---
layout: default
title: "Offline OCR Software for Invoices on Windows 11: No Cloud, No Subscription"
description: "Process invoices locally with PP-OCRv6. Extract vendor, date, line items, and totals to CSV. $2.99 one-time purchase. Works fully offline."
date: 2026-10-28
author: nannan2008
tags: [invoice, ocr, offline, windows-11, finance]
canonical_url: https://lijiannan1241.github.io/CaptureOCR/blog/posts/offline-ocr-software-invoices-windows-11/
---

# Offline OCR Software for Invoices on Windows 11: No Cloud, No Subscription

Most invoice OCR tools send your documents to the cloud. If you handle vendor invoices, expense receipts, or financial statements, that's a non-starter. You need local processing, structured output, and predictable pricing.

CaptureOCR does exactly that.

## Why Offline Matters for Invoices

- **Data sovereignty**: Financial documents never leave your machine
- **Compliance**: Meets internal policies that forbid cloud upload of financial data
- **Speed**: No upload/download latency, no queue waiting
- **Cost predictability**: $2.99 once. No per-page fees, no monthly subscription, no API rate limits

## How It Works for Invoices

### 1. Open the Invoice on Screen
PDF in Edge, scanned image in Photos, web portal in browser — doesn't matter. CaptureOCR captures *pixels*, not file formats.

### 2. Capture Key Fields as Regions
Press `Ctrl+Shift+X`. Drag around each field you need:
- ① Invoice number
- ② Date
- ③ Vendor name
- ④ Line items area (capture the whole table region)
- ⑤ Subtotal
- ⑥ Tax
- ⑦ Total

Each region auto-numbered. Reorder in the drawer if needed.

### 3. Run OCR (Two Modes)
| Mode | Model | Speed | Languages | Best For |
|------|-------|-------|-----------|----------|
| Fast | tiny (~6.6 MB) | ~78 ms/img | 49 (no Japanese) | Clean English/Chinese invoices |
| Accurate | small (~30 MB) | ~258 ms/img | 50 (includes Japanese) | Low contrast, small print, mixed scripts |

Both run 100% locally via ONNX Runtime. The tiny model is bundled in the installer — works immediately after install. The small model downloads once (~30 MB) then runs offline forever.

### 4. Export to CSV (Excel-Ready)
Export → CSV → open in Excel. Every row includes:
- Region index (1, 2, 3...)
- Screen coordinates (x, y, w, h)
- Line number within region
- Confidence score (0.00–1.00)
- Recognized text
- OCR mode used
- Processing time
- Model hash (for reproducibility)

<figure>
  <img src="/CaptureOCR/assets/shots/03-export.png" alt="Exported Markdown table showing invoice fields with coordinates and confidence" width="800">
  <figcaption>CSV opens directly in Excel with UTF-8 BOM for correct Chinese character display.</figcaption>
</figure>

## Real Invoice Example

**Input**: A typical vendor invoice with:
- Chinese vendor name + English address
- Mixed currency symbols (¥ and $)
- Small-print terms at bottom
- A 12-row line items table

**CaptureOCR output** (Fast mode, 5 regions, ~390ms total):

| Region | Field | Confidence | Sample Output |
|--------|-------|------------|---------------|
| ① | Invoice # | 0.998 | INV-2024-0315 |
| ② | Date | 0.992 | 2024-03-15 |
| ③ | Vendor | 0.987 | 北京华夏科技有限公司 |
| ④ | Line items | 0.981 | Widget A × 100 @ ¥25.00<br>Widget B × 50 @ ¥45.00 |
| ⑤ | Total | 0.999 | ¥4,750.00 |

The line items region captures the whole table as text lines. You get each row as a separate line with coordinates. Pivot in Excel for analysis.

## Privacy & Compliance

- **No telemetry**: CaptureOCR collects zero usage data
- **No account required**: Install and run
- **Payment via Microsoft**: We never see payment details
- **Local storage only**: Settings, sessions, and images stay in `%LOCALAPPDATA%\CaptureOCR\`

## Compare: Cloud API vs CaptureOCR

| Factor | Cloud OCR APIs (AWS/Azure/Google) | CaptureOCR |
|--------|-----------------------------------|------------|
| Data leaves machine | Yes | **Never** |
| Per-page cost | $0.001–$0.015/page | **$0** (one-time $2.99) |
| Internet required | Yes | **No** (after install) |
| Setup complexity | API keys, SDK, billing | **Install → run** |
| Output format | JSON (custom parsing) | **CSV/Markdown ready for Excel** |
| Chinese/English mixed | Good (extra cost) | **Native PP-OCRv6 support** |

## When to Use Accurate Mode

Switch to Accurate (small model) when:
- Invoice has low contrast (light gray text on white)
- Text is unusually small (under 10pt)
- Mixed Chinese/English/Japanese on same page
- Dot-matrix or unusual fonts

The 30 MB download happens once. After that, it's just as offline as Fast mode.

## Get Started

1. [Install from Microsoft Store](https://apps.microsoft.com/store/detail/9PBP8VBG4RJ1?cid=blog_invoice_ocr) ($2.99 one-time)
2. Open your invoice on screen
3. `Ctrl+Shift+X` → capture 5–7 regions
4. Export CSV → drop into your accounting workflow

---

**Related reads:**
- [How to Extract Text from Multiple Screenshots at Once](/CaptureOCR/blog/posts/extract-text-multiple-screenshots-windows/)
- [Convert Screenshot to Markdown Table on Windows](/CaptureOCR/blog/posts/convert-screenshot-to-markdown-table-windows/)
- [Best Screenshot OCR Tool for Chinese Text Windows](/CaptureOCR/blog/posts/best-screenshot-ocr-tool-chinese-text-windows/)