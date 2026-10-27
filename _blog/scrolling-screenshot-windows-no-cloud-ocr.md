---
layout: default
title: "How to Capture Scrolling Screenshots on Windows Without Cloud OCR"
description: "Learn how to capture full-page scrolling screenshots locally on Windows. CaptureOCR stitches scrolling content using row-signature matching and runs PP-OCRv6 entirely offline via ONNX Runtime."
date: 2026-11-15
author: nannan2008
tags: [scrolling-screenshot, offline-ocr, windows, privacy]
canonical_url: https://lijiannan1241.github.io/CaptureOCR/blog/posts/scrolling-screenshot-windows-no-cloud-ocr/
---

# How to Capture Scrolling Screenshots on Windows Without Cloud OCR

Most "scrolling capture" tools either don't do OCR, or they send your screenshots to a cloud API. If you're dealing with internal docs, chat logs, or long web pages, that's a problem.

I built CaptureOCR to solve this exact gap. Here's how it works and why the local-first approach matters.

## The Cloud OCR Problem

You've probably tried this: install a browser extension for full-page screenshots, then upload to some OCR service. Three issues:

1. **Data leaves your machine** — not great for internal Slack conversations, Jira tickets, or financial reports
2. **Rate limits and costs** — per-page pricing adds up fast
3. **You're blocked offline** — no internet = no OCR

Windows Snipping Tool and ShareX capture scrolling content fine, but they stop at the image. You still need OCR.

## How CaptureOCR Does Scrolling Capture Locally

The capture side uses a row-signature approach instead of template matching. Here's why that matters:

**Template matching fails on scrolling** because consecutive frames overlap without either containing the other. `cv2.matchTemplate` expects the template to be a sub-image of the target — that's not how scrolling works.

**Row signatures work better**: each frame gets compressed into a 32-bucket row signature (mean pixel values per column bucket). Then we search for the vertical shift that minimizes mean absolute difference between overlapping regions.

Why 32 buckets? Tested 12/24/32/64 on real frame pairs. 12 buckets got 7/9 correct alignments, 24 got 8/9, 32 and 64 both got 9/9. 32 is the sweet spot — cheap enough, accurate enough.

### Sticky headers (the real headache)

Fixed nav bars break naive stitching because the overlap region never matches. The matcher retries while skipping 8%, 16%, then 25% of the top rows. If there's no sticky element, the first pass works normally.

### Adaptive wheel stepping

One scroll notch means wildly different pixel distances across apps. The stepper starts at one notch, measures actual shift, then targets ~45% of selection height with 2× growth cap and 1–12 notch range.

Hard caps: 999 frames, 512 MB canvas, 20,000 px minimum height.

## The OCR Side: Tiled PP-OCRv6

Here's where it gets interesting. A 20,000 px tall image fed to an OCR engine with a 1600 px cap gets globally downscaled. A 30 px text line becomes ~2 px — noise.

CaptureOCR tiles tall images instead:

- Tile height target: 1600 px
- Overlap: 64 px (about two lines at 1080p)
- Core bands: `[0, 1536)`, `[1536, 3072)`, ...
- Each tile extends 32 px above/below for context
- Lines assigned by center Y to exactly one core band
- Boxes remapped to whole-image coordinates, sorted by Y then X

Core bands are contiguous and non-overlapping, so every line is claimed exactly once. Overlap only ensures boundary lines are complete in at least one tile.

Tiles process serially (single ONNX session constraint). Tiling solves precision, not throughput.

## Real Test Results

| Selection | Frames | Height | Stop Reason | Rows Extracted |
|-----------|--------|--------|-------------|----------------|
| 500×400 | 30 | 7,226 px | frame_limit | 6 → 183 |
| 500×220 | 60 | 6,420 px | **bottom** (natural stop) | 10 → 191 |

The small region (220px tall) scrolled all the way to the document bottom naturally. Row numbers increment cleanly from top to bottom — no duplicates, no gaps.

## When It Works (and When It Doesn't)

**Works well:**
- Terminal output, log viewers
- Simple web pages with stable scrolling
- Notepad++, VS Code output panels
- PDF viewers with smooth scroll

**Struggles with:**
- Virtualized lists (Discord, Slack, Twitter) — content not rendered until scrolled into view
- Lazy-loaded images — content appears mid-scroll
- Custom scroll animations — frame alignment breaks
- Horizontal scrolling — vertical only

Region capture is the reliable fallback. If scrolling fails, capture regions manually.

## The Workflow

1. `Ctrl+Shift+X` → hold `Shift` → drag scrollable area
2. Click "Start Scroll Capture" in the floating panel
3. Watch progress (frame count, canvas height)
4. Stop at bottom or click "Stop"
5. OCR runs automatically (tiled, 1600px tiles with 64px overlap)
6. Export Markdown/CSV/TXT/.snipx

## Privacy & Compliance

- **No telemetry**, no account, no cloud calls
- Tiny model (6.6 MB) bundled in installer — works offline immediately
- Small model (30 MB) downloads once on first use, then runs offline
- Payment via Microsoft Store; we never see payment details
- Settings and sessions in `%LOCALAPPDATA%\CaptureOCR\`

## Bottom Line

If you need full-page OCR without sending data out, CaptureOCR is one of the few tools that does scrolling capture + local OCR in one package. $2.99 one-time on the Microsoft Store.

[Get it here](https://apps.microsoft.com/store/detail/9PBP8VBG4RJ1?cid=blog_scrolling_ocr) — no subscription, works offline.

---

**Related reads:**
- [How to Extract Text from Multiple Screenshots at Once](/CaptureOCR/blog/posts/extract-text-multiple-screenshots-windows/)
- [Batch OCR Multiple Regions Single Session Windows](/CaptureOCR/blog/posts/batch-ocr-multiple-regions-single-session-windows/)
- [PP-OCRv6 vs Windows Snipping Tool OCR Comparison](/CaptureOCR/blog/posts/pp-ocrv6-vs-windows-snipping-tool-ocr-comparison/)