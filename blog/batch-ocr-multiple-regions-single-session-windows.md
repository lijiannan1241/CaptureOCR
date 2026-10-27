---
layout: default
title: "Batch OCR Multiple Regions in a Single Session on Windows"
description: "Capture 10+ regions once, recognize all at once, export structured data. CaptureOCR's batch workflow eliminates repetitive capture-OCR-copy cycles."
date: 2026-10-28
author: nannan2008
tags: [batch-ocr, workflow, windows, productivity]
canonical_url: https://lijiannan1241.github.io/CaptureOCR/blog/posts/batch-ocr-multiple-regions-single-session-windows/
---

# Batch OCR Multiple Regions in a Single Session on Windows

The standard OCR loop: capture → recognize → copy → repeat. Ten times. CaptureOCR changes this: capture all regions first, then recognize in batch.

## The Batch Advantage

| Traditional Loop | CaptureOCR Batch |
|------------------|------------------|
| Capture → OCR → copy → repeat × N | Capture × N → OCR all → export once |
| Context switching each time | Stay in flow |
| Easy to lose track | All regions visible in drawer |
| No undo after OCR | Delete/reorder before recognition |

## How Batch OCR Works in CaptureOCR

### 1. Enter Capture Mode
`Ctrl+Shift+X` → screen dims, crosshair appears.

### 2. Capture All Regions
Drag around region 1 → **①** appears.  
Drag around region 2 → **②**.  
... up to 10+ regions.

Each region shows in the **region drawer** (side panel):
- Thumbnail preview
- Number badge (①②③...)
- Status: pending / recognizing / done / error

### 3. Manage Before Recognizing
The drawer is your control center:
- **Reorder**: Drag thumbnails → numbers update visually (stable IDs preserved internally)
- **Delete**: Right-click → remove (won't affect other regions)
- **Undo**: `Ctrl+Z` restores last deleted region
- **Rename**: Not needed — numbers are display-only; stable IDs handle identity

### 4. Batch Recognize
Two ways:
- **Auto-OCR** (Settings → ON): Each region recognizes immediately after capture
- **Manual batch**: Capture all → click "Recognize All" → processes sequentially

**Progress UI**: Shows "Recognizing ③ of ⑦..." with per-region progress.

### 5. Single Export
One click → Markdown / CSV / TXT / .snipx. All regions in one file.

## Real Batch Scenarios

### Scenario 1: Dashboard Screenshot
**Goal**: Extract 8 KPIs from a monitoring dashboard

| Region | KPI | Why Batch Wins |
|--------|-----|----------------|
| ① | CPU % | All captured in 30 sec |
| ② | Memory % | No context switching |
| ③ | Disk I/O | Reorder to match report order |
| ④ | Network | Delete false capture instantly |
| ⑤ | Requests/sec | |
| ⑥ | Error rate | |
| ⑥ | Latency p99 | |
| ⑧ | Active users | |

Export CSV → pivot in Excel → weekly report done.

### Scenario 2: Code Review Screenshots
**Goal**: Capture 6 code blocks from a PR for documentation

1. Capture each function/class as separate region
2. Reorder in drawer to match doc structure
3. Batch OCR (Accurate mode for code)
4. Export Markdown → paste into docs

Each code block gets its own region with coordinates. Dev can trace back to exact source location.

### Scenario 3: Form Field Extraction
**Goal**: Extract 12 fields from a legacy app form

| Field | Region | Notes |
|-------|--------|-------|
| Customer ID | ① | Top-left |
| Account # | ② | |
| Name | ③ | |
| Address | ④ | Multi-line |
| Phone | ⑤ | |
| Email | ⑥ | |
| Plan | ⑦ | Dropdown |
| Status | ⑧ | |
| Balance | ⑨ | |
| Credit limit | ⑩ | |
| Last payment | ⑪ | |
| Notes | ⑫ | Large text area |

Capture all → batch OCR → Export CSV → import into CRM.

## Batch Settings Worth Configuring

| Setting | Location | Recommendation |
|---------|----------|----------------|
| Auto-OCR | Settings → OCR | ON for speed, OFF if you want to review captures first |
| Auto-copy to clipboard | Settings → Output | ON for instant paste |
| Default mode | Settings → OCR | Fast for clean UI, Accurate for dense text |
| Max history items | Settings → History | 200 (default) — batch sessions add up |

## Batch Progress & Error Handling

**Progress indicators**:
- Per-region: pending → recognizing → done/error
- Overall: "3 of 7 completed"
- Cancel button: stops after current region

**Error handling**:
- Failed region shows error badge
- Click to retry just that region
- Other regions unaffected
- Export skips failed regions (notes in output)

## Batch Export Formats

| Format | Batch Output Structure |
|--------|------------------------|
| **Markdown** | Single table, region index column separates sources |
| **CSV** | All rows with `session_id`, `index` (display order), `region_index` (stable ID) |
| **TXT** | Blocks separated by `--- [N] ---` |
| **.snipx** | ZIP: all PNGs + Markdown + CSV + session.json |

## Performance: Batch vs Sequential

| Metric | Sequential (old way) | Batch (CaptureOCR) |
|--------|---------------------|-------------------|
| 10 regions capture time | ~60 sec | ~30 sec |
| OCR time (Fast mode) | 10 × 78ms = 780ms | 780ms (same, sequential on 1 thread) |
| Total workflow | ~2–3 min | ~45 sec |
| Mental context switches | 10 | 1 |

**Key insight**: OCR runs on a single worker thread (ONNX Runtime constraint). Batch doesn't parallelize OCR — but it eliminates *your* context switching.

## Advanced: Session Package for Reproducibility

Export `.snipx` → ZIP contains:
```
session.snipx/
├── session.json      # Full state: regions, results, annotations
├── img/
│   ├── 1.png         # Region ① original
│   ├── 2.png         # Region ② original
│   └── ...
├── ocr-batch.md      # Markdown export
└── ocr-batch.csv     # CSV export
```

Share `.snipx` with colleague → they open in CaptureOCR → full session restored. Re-export with different settings (e.g., Accurate mode) without re-capturing.

## Compare: Batch OCR Tools

| Tool | Batch Capture | Batch OCR | Structured Export | Price |
|------|---------------|-----------|-------------------|-------|
| CaptureOCR | ✅ 10+ regions | ✅ Sequential | Markdown/CSV/JSON | $2.99 once |
| Snagit | ❌ Single only | ✅ | Text only | $62+ |
| ShareX | ✅ Multiple | ❌ | Image only | Free |
| PowerToys | ❌ | ❌ | Text only | Free |
| ABBYY FineReader | ✅ | ✅ | Rich formats | $199+/yr |

## Pro Tips for Batch Workflows

1. **Name your session**: In session.json, add a description field for context
2. **Use display order for export**: Drawer order = export row order (stable IDs handle identity)
3. **Pre-capture all, then recognize**: Avoids "wait, did I capture that field?" moments
3. **Export CSV for Excel**: UTF-8 BOM → Chinese works, coordinates for traceability
4. **Session package for handoff**: Send .snipx to colleague → they continue exactly where you left off

## Get Batch OCR Working

1. [Install CaptureOCR](https://apps.microsoft.com/store/detail/9PBP8VBG4RJ1?cid=DevShareMCLPCS) ($2.99 one-time)

<a href="https://apps.microsoft.com/store/detail/9PBP8VBG4RJ1?cid=DevShareMCLPCS" target="_blank" rel="noopener" aria-label="Get CaptureOCR from the Microsoft Store">
  <img src="/assets/ms-store-badge-en.png" alt="Get CaptureOCR from Microsoft Store" width="200" style="height:auto; border:0;">
</a>
2. `Ctrl+Shift+X` → capture 5+ regions
3. Click "Recognize All" (or enable auto-OCR)
4. Export CSV → done

---

**Related reads:**
- [How to Extract Text from Multiple Screenshots at Once](/CaptureOCR/blog/posts/extract-text-multiple-screenshots-windows/)
- [Extract Error Messages from Screenshots: Support Workflow](/CaptureOCR/blog/posts/extract-error-messages-from-screenshot-windows/)
- [Export Screenshot to CSV with Coordinates and Confidence](/CaptureOCR/blog/posts/export-screenshot-to-csv-coordinates-confidence/)