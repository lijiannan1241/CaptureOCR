---
layout: default
title: "Export Screenshot to CSV with Coordinates and Confidence on Windows"
description: "CaptureOCR exports CSV with region coordinates, line numbers, confidence scores, and model metadata. UTF-8 BOM for Excel. Ready for data pipelines."
date: 2026-10-28
author: nannan2008
tags: [csv, export, data, windows, automation]
canonical_url: https://lijiannan1241.github.io/CaptureOCR/blog/posts/export-screenshot-to-csv-coordinates-confidence/
---

# Export Screenshot to CSV with Coordinates and Confidence on Windows

Most OCR tools give you text. CaptureOCR gives you **data**: every row carries screen coordinates, line index, confidence score, OCR mode, processing time, and model hash. Ready for Excel, Python, or your data pipeline.

## What's in the CSV

Export → CSV (UTF-8 with BOM) → open in Excel. Columns:

| Column | Type | Description |
|--------|------|-------------|
| `session_id` | UUID | Unique session identifier |
| `index` | int | Display order (1, 2, 3... matches drawer) |
| `x` | int | Region left (physical pixels) |
| `y` | int | Region top (physical pixels) |
| `w` | int | Region width (physical pixels) |
| `h` | int | Region height (physical pixels) |
| `line_index` | int | Line number within region (0-based) |
| `confidence` | float | 0.0000–1.0000 (4 decimal places) |
| `text` | string | Recognized text (UTF-8) |
| `mode` | string | `fast` or `accurate` |
| `elapsed_ms` | int | OCR time for this region |
| `model_hash` | string | SHA-256 of model files (reproducibility) |

## Why Coordinates Matter

| Use Case | How Coordinates Help |
|----------|---------------------|
| **Reproducibility** | Navigate to exact UI location for reproduction |
| **DPI independence** | Physical pixels → works across 100%/125%/150% displays |
| **Automation** | Feed coordinates to UI automation tools |
| **Audit trail** | Prove which screen area produced which data |
| **Multi-monitor** | `x,y` are virtual desktop coordinates — knows which monitor |

## Why Confidence Scores Matter

| Confidence Range | Meaning | Action |
|------------------|---------|--------|
| 0.99–1.00 | Very high | Trust completely |
| 0.95–0.98 | High | Trust, quick visual check |
| 0.90–0.94 | Medium | Review if critical |
| 0.80–0.89 | Low | Likely needs correction |
| < 0.80 | Very low | Likely garbage, re-capture |

**Pro tip**: In Excel, filter `confidence < 0.90` → highlight rows → review only those.

## CSV Sample (Real Export)

```csv
session_id,index,x,y,w,h,line_index,confidence,text,mode,elapsed_ms,model_hash
a1b2c3d4-5678-90ab-cdef-1234567890ab,1,120,45,380,80,0,0.9984,Invoice #INV-2024-0315,fast,78,abc123def456...
a1b2c3d4-5678-90ab-cdef-1234567890ab,1,120,45,380,80,1,0.9921,Date: 2024-03-15,fast,78,abc123def456...
a1b2c3d4-5678-90ab-cdef-1234567890ab,2,120,140,380,60,0,0.9953,Vendor: Acme Corp,fast,65,abc123def456...
```

**UTF-8 BOM**: The file starts with `\ufeff` — Excel opens Chinese/Japanese correctly without "Data → Text to Columns."

## CSV vs Markdown vs JSON

| Feature | CSV | Markdown | JSON (.snipx) |
|---------|-----|----------|---------------|
| Excel native | ✅ | ❌ | ❌ |
| Python/pandas | ✅ | ⚠️ | ✅ |
| Coordinates | ✅ | ✅ | ✅ (normalized) |
| Confidence | ✅ | ✅ | ✅ |
| Model metadata | ✅ | ✅ | ✅ |
| Normalized boxes | ❌ | ❌ | ✅ (0–1 relative) |
| Images included | ❌ | ❌ | ✅ (PNG in ZIP) |

**Choose CSV for**: Excel analysis, Python pandas, BI tools, data pipelines.  
**Choose .snipx for**: Full reproducibility, sharing with team, re-export with different settings.

## Python: Read CaptureOCR CSV

```python
import pandas as pd

df = pd.read_csv('capture_export.csv', encoding='utf-8-sig')

# Filter low confidence
low_conf = df[df['confidence'] < 0.90]
print(f"Low confidence rows: {len(low_conf)}")

# Group by region
for region_idx, group in df.groupby('index'):
    print(f"Region {region_idx}: {len(group)} lines, avg conf {group['confidence'].mean():.4f}")

# Export low-confidence for review
low_conf[['index', 'line_index', 'confidence', 'text']].to_csv('review.csv', index=False)
```

## Python: Reconstruct Regions from Coordinates

```python
import pyautogui

# Click center of region 3
row = df[df['index'] == 3].iloc[0]
center_x = row['x'] + row['w'] // 2
center_y = row['y'] + row['h'] // 2
pyautogui.click(center_x, center_y)
```

## Excel: Conditional Formatting for Confidence

1. Select `confidence` column
2. Home → Conditional Formatting → Color Scales
3. Green (high) → Yellow (medium) → Red (low)
4. Instant visual: green = trust, red = review

## Data Pipeline Integration

### Airflow/Dagster Task
```python
def process_capture_csv(**context):
    df = pd.read_csv('/data/captures/latest.csv', encoding='utf-8-sig')
    
    # Validate
    assert df['confidence'].min() > 0.80, "Unacceptably low confidence"
    
    # Transform
    df['source'] = 'captureocr'
    df['ingested_at'] = pd.Timestamp.now()
    
    # Load to warehouse
    df.to_sql('ocr_captures', con=engine, if_exists='append', index=False)
```

### dbt Model
```sql
-- models/staging/stg_captureocr.sql
SELECT
    session_id,
    index AS region_display_order,
    x, y, w, h,
    line_index,
    confidence,
    text,
    mode,
    elapsed_ms,
    model_hash,
    CURRENT_TIMESTAMP AS loaded_at
FROM {{ source('raw', 'captureocr_csv') }}
WHERE confidence >= 0.80
```

## Advanced: Session Package for Full Fidelity

Export `.snipx` → unzip → `session.json` contains:

```json
{
  "id": "uuid",
  "mode": "fast",
  "selections": [
    {"index": 1, "rect_phys": [120,45,380,80], "screen_index": 0, "dpr": 1.5}
  ],
  "results": {
    "1": {
      "ok": true,
      "lines": [
        {"text": "Invoice #INV-2024-0315", "confidence": 0.9984, "box": [0.1, 0.1, 0.9, 0.2], "line_index": 0}
      ],
      "elapsed_ms": 78,
      "model_hash": "abc123..."
    }
  }
}
```

**Normalized boxes** (`box`: x0,y0,x1,y1 in 0–1 relative to region) — only in JSON, not CSV/Markdown. Use for precise overlay rendering.

## Compare: CaptureOCR CSV vs Other Tools

| Feature | CaptureOCR | Windows OCR | Snagit | ABBYY |
|---------|------------|-------------|--------|-------|
| Coordinates | ✅ Physical px | ❌ | ❌ | ✅ |
| Confidence | ✅ 4 decimals | ❌ | ❌ | ✅ |
| Line index | ✅ | ❌ | ❌ | ✅ |
| Model metadata | ✅ | ❌ | ❌ | ⚠️ |
| UTF-8 BOM | ✅ | ✅ | ✅ | ✅ |
| Batch export | ✅ | ❌ | ❌ | ✅ |

## Automation Ideas

1. **Watch folder**: New CSV → auto-ingest to database
2. **Quality gate**: Fail CI if any confidence < 0.85
3. **Alerting**: Low confidence → Slack notification
4. **Versioning**: Store `model_hash` → detect model drift
5. **A/B testing**: Compare `fast` vs `accurate` confidence distributions

## Get Structured Data from Screenshots

1. [Install CaptureOCR](https://apps.microsoft.com/store/detail/9PBP8VBG4RJ1?cid=blog_csv_export) ($2.99 one-time)
2. Capture regions → batch OCR
3. Export CSV → feed your pipeline

---

**Related reads:**
- [How to Convert Screenshot to Markdown Table on Windows](/CaptureOCR/blog/posts/convert-screenshot-to-markdown-table-windows/)
- [Batch OCR Multiple Regions Single Session Windows](/CaptureOCR/blog/posts/batch-ocr-multiple-regions-single-session-windows/)
- [PP-OCRv6 vs Windows Snipping Tool OCR Comparison](/CaptureOCR/blog/posts/pp-ocrv6-vs-windows-snipping-tool-ocr-comparison/)