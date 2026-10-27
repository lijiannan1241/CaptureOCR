---
layout: default
title: "Scrolling Screenshot OCR on Windows: Free Alternative vs CaptureOCR"
description: "Compare scrolling capture tools. CaptureOCR uses row-signature stitching (32 buckets) for long pages. Best-effort v1.0 with sticky-header handling."
date: 2026-10-28
author: nannan2008
tags: [scrolling-screenshot, ocr, windows, comparison]
canonical_url: https://lijiannan1241.github.io/CaptureOCR/blog/posts/scrolling-screenshot-ocr-windows-free-alternative/
---

# Scrolling Screenshot OCR on Windows: Free Alternative vs CaptureOCR

Long pages — chat logs, documentation, web articles, terminal output — don't fit in one screenshot. You need scrolling capture + OCR.

Here's how the options stack up.

## The Scrolling Capture Landscape

| Tool | Scrolling Capture | OCR | Export | Cost |
|------|-------------------|-----|--------|------|
| **ShareX** | ✅ Excellent | ❌ None | Image only | Free |
| **PicPick** | ✅ Good | ❌ None | Image only | Free/Paid |
| **Snagit** | ✅ Excellent | ✅ Built-in | Text/Image | $62+ |
| **Windows Snipping Tool** | ❌ No scrolling | ✅ Text Actions | Text only | Free |
| **PowerToys Text Extractor** | ❌ No scrolling | ✅ | Text only | Free |
| **CaptureOCR** | ✅ Best-effort v1.0 | ✅ PP-OCRv6 | Markdown/CSV/JSON | $2.99 once |

## CaptureOCR's Scrolling Approach (Technical Details)

Unlike template matching (which fails when neither frame contains the other), CaptureOCR uses **row-signature stitching**:

1. **Grayscale + crop right 8%** (removes scrollbar noise)
2. **Compress each row into 32 column buckets** (mean pixel value per bucket)
3. **Shift search**: compare `prev[s:]` vs `cur[:H-s]` using mean absolute difference
4. **Peak validation**: best score must be < threshold AND clearly better than median
5. **Sticky-header handling**: retry skipping 8%/16%/25% of top rows
6. **Adaptive wheel step**: measure actual scroll distance, target ~45% of selection height

**Why 32 buckets?** Tested 12/24/32/64 on real frame pairs:
- 12 buckets: 7/9 correct
- 24 buckets: 8/9 correct
- 32 buckets: 9/9 correct
- 64 buckets: 9/9 correct (2× compute)

32 is the sweet spot.

## CaptureOCR Scrolling Limits (Honest Assessment)

| Scenario | Works? | Notes |
|----------|--------|-------|
| Standard web page (stable scroll) | ✅ | Best case |
| Terminal output (stable) | ✅ | Excellent |
| Chat app (Discord, Slack) | ⚠️ | Virtualized lists break it |
| Browser with lazy-loaded images | ❌ | Content not rendered yet |
| Sticky header/nav bar | ⚠️ | Handled via skip retries |
| Custom scroll animation | ❌ | Breaks frame alignment |
| Horizontal scroll | ❌ | Vertical only |

**Hard caps**: 999 frames, 512 MB canvas, minimum 20,000px height.

## Free Workflow: ShareX + CaptureOCR

If you want free scrolling capture + OCR:

1. **ShareX** (free, open source) for scrolling capture
   - Configure: Capture → Scrolling capture → Vertical
   - Output: PNG (high quality)
2. **CaptureOCR** (paid, $2.99) for OCR
   - Drag the long PNG into CaptureOCR (or capture from screen)
   - Runs tiling OCR: 1600px tiles with 64px overlap
   - Export Markdown/CSV

**Why this combo?**
- ShareX has the most robust scrolling capture engine (years of development)
- CaptureOCR has the best offline OCR for structured export
- Total cost: $2.99 vs Snagit's $62+

## CaptureOCR's Built-in Scrolling (When It Works)

For stable scrollers (terminal, simple web pages, Notepad++), CaptureOCR's built-in scrolling is convenient:

1. `Ctrl+Shift+X` → hold `Shift` → drag to select scrollable area
2. Click "Start Scroll Capture" in the floating panel
3. Watch the progress bar (shows frame count, canvas height)
4. Stop when it reaches bottom or click "Stop"
5. OCR runs automatically (tiling: 1600px tiles, 64px overlap)
6. Export Markdown/CSV

**Tiling OCR for long images**: A 20,000px tall image would be crushed to 2px text if fed whole. CaptureOCR tiles it:
- Tile height: 1600px target
- Overlap: 64px (2 lines at 1080p)
- Core bands: contiguous, non-overlapping
- Line assignment: by center Y coordinate
- Remap to whole-image coordinates → sort by Y then X

## Comparison: Built-in vs ShareX + CaptureOCR

| Aspect | CaptureOCR Built-in | ShareX + CaptureOCR |
|--------|---------------------|---------------------|
| Convenience | One app | Two apps |
| Scrolling robustness | Best-effort v1.0 | Battle-tested |
| OCR integration | Seamless | Manual drag |
| Cost | $2.99 (included) | $2.99 + free |
| Virtualized lists | ❌ | ❌ (same limitation) |

## Recommendation

| Your Need | Recommended Approach |
|-----------|---------------------|
| Occasional long pages, stable scroll | CaptureOCR built-in (simpler) |
| Frequent scrolling, tricky apps | ShareX capture → CaptureOCR OCR |
| Chat logs, virtualized lists | Manual region capture (reliable fallback) |
| Budget $0 | ShareX (capture only) + Windows OCR (limited) |

## The Honest Truth

Scrolling capture + OCR is **hard**. No tool handles every case. Virtualized lists, lazy loading, custom scroll animations — these break everyone.

CaptureOCR's v1.0 scrolling is **best-effort**. Region capture is the **reliable fallback**. The app tells you this upfront.

If scrolling fails: capture regions manually. It's slower but 100% reliable.

## Get the Tool

[CaptureOCR on Microsoft Store](https://apps.microsoft.com/store/detail/9PBP8VBG4RJ1?cid=DevShareMCLPCS) — $2.99 one-time. Includes both region and scrolling capture.

<a href="https://apps.microsoft.com/store/detail/9PBP8VBG4RJ1?cid=DevShareMCLPCS" target="_blank" rel="noopener" aria-label="Get CaptureOCR from the Microsoft Store">
  <img src="/assets/ms-store-badge-en.png" alt="Get CaptureOCR from Microsoft Store" width="200" style="height:auto; border:0;">
</a>

[ShareX](https://getsharex.com/) — Free, open source. Best-in-class scrolling capture.

---

**Related reads:**
- [How to Extract Text from Multiple Screenshots at Once](/CaptureOCR/blog/posts/extract-text-multiple-screenshots-windows/)
- [Batch OCR Multiple Regions Single Session Windows](/CaptureOCR/blog/posts/batch-ocr-multiple-regions-single-session-windows/)
- [PP-OCRv6 vs Windows Snipping Tool OCR Comparison](/CaptureOCR/blog/posts/pp-ocrv6-vs-windows-snipping-tool-ocr-comparison/)