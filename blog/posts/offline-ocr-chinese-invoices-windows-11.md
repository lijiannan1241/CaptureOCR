---
layout: default
title: "Best Offline OCR for Chinese Invoices on Windows 11"
description: "Process Chinese invoices locally with PP-OCRv6. Extract vendor, date, line items, and totals to CSV. No cloud upload, no subscription. $2.99 one-time on Microsoft Store."
date: 2026-11-16
author: nannan2008
tags: [invoice-ocr, chinese-ocr, offline-ocr, windows-11, finance]
canonical_url: https://lijiannan1241.github.io/CaptureOCR/blog/posts/offline-ocr-chinese-invoices-windows-11/
---

# Best Offline OCR for Chinese Invoices on Windows 11

If you process Chinese vendor invoices, you know the drill: screenshot each field, paste into a translator, manually type into Excel. Or worse — upload sensitive financial docs to a cloud OCR API.

There's a better way. CaptureOCR runs PP-OCRv6 locally on Windows via ONNX Runtime. No cloud, no subscription, no data leaving your machine.

## Why Cloud OCR Fails for Chinese Invoices

Most cloud OCR services (AWS Textract, Azure Form Recognizer, Google Document AI) have three problems for Chinese invoice workflows:

1. **Data sovereignty** — financial docs can't leave your network per company policy
2. **Mixed script accuracy** — Chinese vendor name + English address + numbers + currency symbols = boundary errors
2. **Cost at scale** — $0.001–0.015/page adds up fast for monthly invoice batches
3. **Internet dependency** — no OCR when the network's down

Windows Snipping Tool's built-in OCR is free and local, but it's single-region only and struggles with vertical text, rare characters, and small print.

## How CaptureOCR Handles Chinese Invoices

### Multi-region capture = one invoice, one session

Open the invoice (PDF in Edge, scanned image, web portal — CaptureOCR captures pixels, not file formats). Press `Ctrl+Shift+X` and drag regions around each field:

- ① Invoice number
- ② Date  
- ③ Vendor name (Chinese)
- ④ Line items table area
- ⑤ Subtotal
- ⑥ Tax
- ⑦ Total

Each region auto-numbered ①②③. Reorder in the drawer if needed.

### Two OCR modes for Chinese

| Mode | Model | Speed | Chinese Support | Best For |
|------|-------|-------|-----------------|----------|
| **Fast** | tiny (~6.6 MB) | ~78 ms/img | Simplified + Traditional + 46 Latin scripts | Clean printed invoices |
| **Accurate** | small (~30 MB) | ~258 ms/img | + Japanese, better on rare chars | Low contrast, small print, mixed scripts |

Both run 100% locally via ONNX Runtime. Tiny model bundled in installer — works immediately after install. Small model downloads once (~30 MB) then runs offline forever.

### Real Chinese invoice test

**Input**: Typical vendor invoice with:
- Chinese vendor name + English address
- Mixed currency symbols (¥ and $)
- Small-print terms at bottom (8pt)
- 12-row line items table

**CaptureOCR output** (Fast mode, 5 regions, ~390ms total):

| Region | Field | Confidence | Sample Output |
|--------|-------|------------|---------------|
| ① | Invoice # | 0.998 | INV-2024-0315 |
| ② | Date | 0.992 | 2024-03-15 |
| ③ | Vendor | 0.987 | 北京华夏科技有限公司 |
| ④ | Line items | 0.981 | Widget A × 100 @ ¥25.00<br>Widget B × 50 @ ¥45.00 |
| ⑤ | Total | 0.999 | ¥4,750.00 |

The line items region captures the whole table as text lines. Each row becomes a separate CSV row with coordinates. Pivot in Excel for analysis.

## Export: CSV That Opens Correctly in Excel

Export → CSV (UTF-8 with BOM) → open in Excel. Every row includes:

- Region index (1, 2, 3...)
- Screen coordinates (x, y, w, h) — physical pixels, DPI-independent
- Line number within region
- Confidence score (0.0000–1.0000)
- Recognized text (UTF-8)
- OCR mode used
- Processing time
- Model hash (for reproducibility)

**UTF-8 BOM** means Chinese characters display correctly in Excel without the "Data → Text to Columns" dance.

## Privacy & Compliance for Finance

- **No telemetry** — zero usage data collected
- **No account required** — install and run
- **Payment via Microsoft** — we never see payment details
- **Local storage only** — settings, sessions, images in `%LOCALAPPDATA%\CaptureOCR\`
- **Works fully offline** after install (tiny model bundled)

## When to Use Accurate Mode for Invoices

Switch to Accurate (small model) when:
- Invoice has low contrast (light gray text on white)
- Text is unusually small (under 10pt)
- Mixed Chinese/English/Japanese on same page
- Dot-matrix or unusual fonts

The 30 MB download happens once. After that, it's just as offline as Fast mode.

## Compare: Cloud API vs CaptureOCR for Invoices

| Factor | Cloud OCR APIs | CaptureOCR |
|--------|----------------|------------|
| Data leaves machine | Yes | **Never** |
| Per-page cost | $0.001–0.015 | **$0** (one-time $2.99) |
| Internet required | Yes | **No** (after install) |
| Setup complexity | API keys, SDK, billing | **Install → run** |
| Output format | JSON (custom parsing) | **CSV/Markdown ready for Excel** |
| Chinese/English mixed | Good (extra cost) | **Native PP-OCRv6 support** |
| Vertical text | Limited | **Supported** |
| Rare characters (生僻字) | Hit or miss | **7,000+ char coverage** |

## Get Started

1. [Install from Microsoft Store](https://apps.microsoft.com/store/detail/9PBP8VBG4RJ1?cid=blog_chinese_invoice) ($2.99 one-time, no subscription)
2. Open invoice on screen (PDF, browser, scanned image — any app)
3. `Ctrl+Shift+X` → capture 5–7 regions
4. Export CSV → drop into your accounting workflow

---

**Related reads:**
- [How to Extract Text from Multiple Screenshots at Once](/CaptureOCR/blog/posts/extract-text-multiple-screenshots-windows/)
- [How to Export Screenshot OCR to CSV with Coordinates](/CaptureOCR/blog/posts/export-screenshot-to-csv-coordinates-confidence/)
- [PP-OCRv6 vs Windows Snipping Tool OCR Comparison](/CaptureOCR/blog/posts/pp-ocrv6-vs-windows-snipping-tool-ocr-comparison/)