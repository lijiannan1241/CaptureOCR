---
layout: default
title: "How to Extract Text from Multiple Screenshots at Once on Windows"
description: "Stop taking one screenshot at a time. Learn how to capture 10+ regions in a single session and export structured Markdown or CSV with coordinates and confidence scores."
date: 2026-10-28
author: nannan2008
tags: [tutorial, windows, ocr, productivity]
canonical_url: https://lijiannan1241.github.io/CaptureOCR/blog/posts/extract-text-multiple-screenshots-windows/
---

# How to Extract Text from Multiple Screenshots at Once on Windows

If you've ever needed to pull six fields from an invoice, four error lines from a dialog, or twelve cells from a PDF, you know the pain: take a screenshot, run OCR, copy text, repeat. Ten times. Then paste into Excel and realize you lost track of which text came from where.

There's a better way.

## The Old Way (What You're Probably Doing Now)

1. Press `Win+Shift+S` or open Snipping Tool
2. Drag around one field
3. Click "Text Actions" → "Copy all text"
4. Switch to Excel, paste
5. Repeat 9 more times
6. Hope you didn't mix up row 3 and row 7

Windows Snipping Tool and PowerToys Text Extractor are great for *one* region. They return a single text blob. No numbering, no coordinates, no batch workflow.

## The CaptureOCR Way

CaptureOCR is built for this exact scenario. Here's the workflow:

### 1. Start a Capture Session
Press `Ctrl+Shift+X` (default hotkey) or click the tray icon. The screen dims and you enter selection mode.

### 2. Drag Around Each Region
Click and drag around the first field. A numbered badge appears: **①**. Drag the second field: **②**. Third: **③**. Up to 10+ regions in one session.

<figure>
  <img src="/CaptureOCR/assets/shots/02-regions.png" alt="CaptureOCR region drawer showing five numbered regions on an invoice" width="800">
  <figcaption>Regions are numbered automatically. Reorder or delete before recognition.</figcaption>
</figure>

### 3. Reorder or Delete (Optional)
The region drawer shows all captures. Drag to reorder. Right-click to delete. The numbers update automatically — but internally each region keeps a stable ID so your export stays consistent.

### 4. Run OCR
Click "Recognize" or enable auto-OCR. Two modes:
- **Fast (tiny model, ~6.6 MB)**: ~78 ms per image, 49 languages, no Japanese
- **Accurate (small model, ~30 MB)**: ~258 ms per image, 50 languages including Japanese

Both run offline via ONNX Runtime. No cloud API calls.

### 5. Export Structured Data
This is where it pays off. Export options:

| Format | What You Get |
|--------|--------------|
| **Markdown table** | Region index, coordinates (x,y,w,h), line number, confidence, text |
| **CSV (UTF-8 BOM)** | Same fields plus session_id, mode, elapsed_ms, model_hash — opens correctly in Excel |
| **TXT** | Plain text blocks separated by region |
| **.snipx session package** | ZIP with original images, Markdown, CSV, and full JSON with normalized boxes |

<figure>
  <img src="/CaptureOCR/assets/shots/03-export.png" alt="Exported Markdown table showing region index, coordinates, confidence, and recognized text" width="800">
  <figcaption>Every row carries its region index, coordinates, confidence, and text.</figcaption>
</figure>

## Real Example: Processing an Invoice

Say you have this invoice on screen:
- Invoice number (top right)
- Date (top left)
- Vendor name (middle left)
- Line items table (middle, 5 rows)
- Total (bottom right)

**Old way**: 9 screenshots, 9 copy-pastes, manual cleanup in Excel.

**CaptureOCR way**:
1. `Ctrl+Shift+X` → drag 5 regions (invoice #, date, vendor, line items area, total)
2. Auto-numbered ①②③④⑤
3. Click "Recognize" → done in ~400ms total
4. Export CSV → open in Excel → every row labeled with region index and coordinates

No retyping. No "wait, which cell was this?" The coordinates tell you exactly where on screen each piece came from.

## When This Matters Most

- **Support tickets**: Error dialog + log line + customer message → one table
- **Research**: Figure labels + table cells + citations from a PDF → traceable rows
- **Finance ops**: Invoice fields → CSV → accounting system
- **QA testing**: Multiple UI states captured once, exported for regression docs

## Key Settings Worth Knowing

| Setting | Where | Why It Matters |
|---------|-------|----------------|
| Auto-OCR | Settings → OCR | Recognizes immediately after each capture |
| Copy to clipboard | Settings → Output | Copies Markdown/CSV to clipboard automatically |
| Hotkey | Settings → Hotkey | Change from `Ctrl+Shift+X` if it conflicts |
| Language | Settings → General | UI language (EN/中文), persists across restarts |

## Limitations to Know

- **No table reconstruction**: A captured table becomes text lines with region coordinates, not a reconstructed grid with merged cells. Many users pivot the CSV in Excel.
- **Scrolling capture is best-effort**: Works well in stable scrollers; virtualized lists may fail. Region capture is the reliable fallback.
- **Windows only**: No macOS/Linux build.

## Get Started

1. Install from [Microsoft Store](https://apps.microsoft.com/store/detail/9PBP8VBG4RJ1?cid=blog_multiple_regions) ($2.99 one-time, no subscription)
2. Press `Ctrl+Shift+X`
3. Drag your regions
4. Export CSV → done

---

**Related reads:**
- [How to Convert Screenshot to Markdown Table on Windows](/CaptureOCR/blog/posts/convert-screenshot-to-markdown-table-windows/)
- [Offline OCR Software for Invoices on Windows 11](/CaptureOCR/blog/posts/offline-ocr-software-invoices-windows-11/)
- [Batch OCR Multiple Regions Single Session Windows](/CaptureOCR/blog/posts/batch-ocr-multiple-regions-single-session-windows/)