---
layout: default
title: "Scrolling Capture OCR on Windows 11: Local Processing, No Cloud"
description: "Capture full-page scrolling screenshots and run OCR locally on Windows 11. CaptureOCR uses row-signature stitching (32 buckets) and tiled PP-OCRv6 via ONNX Runtime. No cloud upload, works offline."
date: 2026-11-25
author: nannan2008
tags: [scrolling-capture, windows-11, local-ocr, offline, onnx-runtime]
canonical_url: https://lijiannan1241.github.io/CaptureOCR/blog/posts/scrolling-capture-ocr-windows-11-local/
---

# Scrolling Capture OCR on Windows 11: Local Processing, No Cloud

Windows 11's Snipping Tool does scrolling capture. ShareX does it better. But neither does OCR — and if you use a cloud OCR API, your full-page screenshots leave your machine.

CaptureOCR combines scrolling capture + local OCR in one Windows app. No cloud, no subscription, works offline.

## The Scrolling + OCR Gap

| Tool | Scrolling Capture | OCR | Local? |
|------|-------------------|-----|--------|
| Windows Snipping Tool | ✅ | ✅ (Text Actions) | ✅ | ❌ Single region only |
| ShareX | ✅ Excellent | ❌ | ✅ | No OCR |
| Snagit | ✅ Excellent | ✅ Built-in | ❌ | Cloud OCR option |
| PowerToys Text Extractor | ❌ | ✅ | ✅ | Single region only |
| **CaptureOCR** | ✅ Best-effort | ✅ PP-OCRv6 | ✅ | **Yes, fully local** |

## How CaptureOCR Does Scrolling Capture

### Row-signature stitching (not template matching)

Template matching fails on scrolling: consecutive frames overlap, neither contains the other. `cv2.matchTemplate` expects template ⊂ target — that's not scrolling.

**Row signatures work better**:
1. Grayscale + ignore right 8% (scrollbars)
2. Compress each row → 32 column-bucket means: `(H, 32)`
3. Shift search: minimize mean absolute difference `prev[s:]` vs `cur[:H-s]`
4. Peak validation: best score < threshold AND clearly better than median

**Why 32 buckets?** Tested on real frame pairs:
- 12 buckets: 7/9 correct
- 24 buckets: 8/9 correct
- 32 buckets: 9/9 correct
- 64 buckets: 9/9 (2× compute)

### Sticky headers (the real headache)

Fixed nav bars break naive stitching — overlap region never matches. The matcher retries skipping 8%, 16%, 25% of top rows. If no sticky element, first pass works.

### Adaptive wheel stepping

One scroll notch = wildly different pixels across apps. Stepper starts at 1 notch, measures actual shift, targets ~45% selection height, 2× growth cap, 1–12 notch range.

**Hard caps**: 999 frames, 512 MB canvas, 20,000 px minimum height.

## The OCR Side: Tiled PP-OCRv6

Here's the key insight: a 20,000 px tall image fed to an OCR engine with 1600 px cap gets globally downscaled. 30 px text → 2 px. Noise.

**CaptureOCR tiles tall images instead**:

- Tile height target: 1600 px
- Overlap: 64 px (2 lines at 1080p)
- Core bands: `[0, 1536)`, `[1536, 3072)`, ...
- Each tile extends 32 px above/below for context
- Lines assigned by center Y to exactly one core band
- Boxes remapped to whole-image coords, sorted by Y then X

Core bands contiguous → every line claimed exactly once. Overlap ensures boundary lines complete.

Tiles process serially (single ONNX session). Tiling = precision, not throughput.

## Real Test Results on Windows 11

| Selection | Frames | Height | Stop Reason | Rows Extracted |
|-----------|--------|--------|-------------|----------------|
| 500×400 | 30 | 7,226 px | frame_limit | 6 → 183 |
| 500×220 | 60 | 6,420 px | **bottom** (natural stop) | 10 → 191 |

The small region (220px tall) scrolled all the way to document bottom naturally. Row numbers increment cleanly — no duplicates, no gaps.

## When It Works (and When It Doesn't)

**Works well:**
- Terminal output, log viewers (cmd, PowerShell, Windows Terminal)
- Simple web pages with stable scrolling
- Notepad++, VS Code output panels
- PDF viewers with smooth scroll (Edge, Adobe Reader)
- Long chat logs in simple clients

**Struggles with:**
- Virtualized lists (Discord, Slack, Teams, Twitter/X) — content not rendered until scrolled into view
- Lazy-loaded images — content appears mid-scroll
- Custom scroll animations — frame alignment breaks
- Horizontal scrolling — vertical only
- Complex dynamic pages (SPA with infinite scroll)

**Region capture is the reliable fallback.** If scrolling fails, capture regions manually.

## The Workflow on Windows 11

1. `Ctrl+Shift+X` → hold `Shift` → drag scrollable area
2. Click "Start Scroll Capture" in floating panel
3. Watch progress (frame count, canvas height)
4. Stop at bottom or click "Stop"
5. OCR runs automatically (tiled, 1600px tiles, 64px overlap)
6. Export Markdown/CSV/TXT/.snipx

## Local Processing = Privacy & Compliance

- **No telemetry**, no account, no cloud calls
- Tiny model (6.6 MB) bundled in installer — works offline immediately
- Small model (30 MB) downloads once on first use, then runs offline
- Payment via Microsoft Store; we never see payment details
- Settings and sessions in `%LOCALAPPDATA%\CaptureOCR\`

## Performance on Windows 11

| Metric | Fast Mode (tiny) | Accurate Mode (small) |
|--------|------------------|----------------------|
| Model size | 6.61 MB | 29.79 MB |
| Load time | 1.35s | 1.06s |
| Per image | ~78 ms | ~258 ms |
| P95 latency | 144 ms | 471 ms |
| Languages | 49 (no Japanese) | 50 (includes Japanese) |

**ONNX Runtime CPU** — no GPU needed, no CUDA, no DirectML. Runs on any Windows 10/11 x64.

## Compare: Cloud vs Local for Scrolling OCR

| Factor | Cloud API (AWS/Azure/Google) | CaptureOCR (Local) |
|--------|-------------------------------|-------------------|
| Data leaves machine | Yes (full page screenshots) | **Never** |
| Per-page cost | $0.001–0.015 | **$0** (one-time $2.99) |
| Internet required | Yes | **No** (after install) |
| Setup | API keys, SDK, billing | **Install → run** |
| Output | JSON (custom parsing) | **CSV/Markdown ready for Excel** |
| Vertical text | Limited | ✅ Native |
| Offline capable | ❌ | ✅ |

## Windows 11 Specifics

- **Snipping Tool** does scrolling capture but single-region OCR only
- **CaptureOCR** adds: multi-region batch, structured export, coordinates, confidence
- **Works on Windows 10 2004+** (19041) and Windows 11
- **MSIX packaging** — clean install/uninstall, no registry pollution
- **Portable zip available** — unzip to USB, run anywhere

## The Workflow

1. `Ctrl+Shift+X` → hold `Shift` → drag scrollable area
2. Click "Start Scroll Capture" in floating panel
3. Watch progress (frame count, canvas height)
6. Stop at bottom or click "Stop"
7. OCR runs automatically (tiled, 1600px tiles, 64px overlap)
8. Export Markdown/CSV/TXT/.snipx

## When Scrolling Fails: Region Capture Fallback

If scrolling capture fails (virtualized list, lazy loading, custom animation):

1. `Ctrl+Shift+X` (no Shift)
2. Drag regions manually around visible content
3. Scroll → capture next batch → repeat
4. Batch OCR → single export

Slower but 100% reliable.

## Get Local Scrolling OCR on Windows 11

1. [Install from Microsoft Store](https://apps.microsoft.com/store/detail/9PBP8VBG4RJ1?cid=blog_scrolling_w11) ($2.99 one-time, no subscription)
2. Open long page (terminal, log, doc, chat)
3. `Ctrl+Shift+X` + `Shift` → capture scroll
4. Export CSV → done

No cloud, no subscription, works offline.

---

**Related reads:**
- [How to Extract Text from Multiple Screenshots at Once](/CaptureOCR/blog/posts/extract-text-multiple-screenshots-windows/)
- [Batch OCR Multiple Regions Single Session Windows](/CaptureOCR/blog/posts/batch-ocr-multiple-regions-single-session-windows/)
- [PP-OCRv6 vs Windows Snipping Tool OCR Comparison](/CaptureOCR/blog/posts/pp-ocrv6-vs-windows-snipping-tool-ocr-comparison/)