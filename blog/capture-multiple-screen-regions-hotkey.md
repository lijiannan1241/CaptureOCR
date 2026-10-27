---
layout: default
title: "Capture Multiple Screen Regions at Once with Windows Hotkey"
description: "Stop the capture-OCR-copy loop. Press Ctrl+Shift+X, drag 10+ regions, auto-numbered ①②③. Batch OCR and export structured data in one session. No more context switching."
date: 2026-11-20
author: nannan2008
tags: [hotkey, multi-region-capture, windows-shortcuts, ocr, productivity]
canonical_url: https://lijiannan1241.github.io/CaptureOCR/blog/posts/capture-multiple-screen-regions-hotkey/
---

# Capture Multiple Screen Regions at Once with Windows Hotkey

The standard OCR workflow on Windows: `Win+Shift+S` → capture one field → OCR → copy → repeat. Ten times for an invoice. Then paste into Excel and realize you lost track of which text came from where.

CaptureOCR replaces that loop with one hotkey: `Ctrl+Shift+X`. Drag all regions first, then batch recognize, export once.

## The Hotkey: `Ctrl+Shift+X`

Press it → screen dims → crosshair appears. Drag around region 1 → **①** appears. Drag region 2 → **②**. Region 3 → **③**. Up to 10+ regions in one session.

Each region shows in the **region drawer** (side panel):
- Thumbnail preview
- Number badge (①②③...)
- Status: pending / recognizing / done / error

## Why Not `Win+Shift+S`?

| `Win+Shift+S` (Snipping Tool) | `Ctrl+Shift+X` (CaptureOCR) |
|-------------------------------|----------------------------|
| One region per capture | 10+ regions per session |
| Text Actions = single text blob | Structured Markdown/CSV export |
| No numbering | Auto-numbered ①②③ |
| No coordinates | Screen coordinates (x,y,w,h) |
| No confidence scores | Per-line confidence (0.00–1.00) |
| Copy → paste → repeat | Batch capture → batch OCR → single export |

## The Region Drawer: Your Control Center

Before recognizing, manage in the drawer:
- **Reorder**: Drag thumbnails → numbers update visually (stable IDs preserved internally)
- **Delete**: Right-click → remove (won't affect other regions)
- **Undo**: `Ctrl+Z` restores last deleted region
- **Rename**: Not needed — numbers are display-only; stable IDs handle identity

## Hotkey Customization

Don't like `Ctrl+Shift+X`? Change it in Settings → Hotkey. Options:
- `Ctrl+Shift+X` (default)
- `Ctrl+Shift+S`
- `Alt+Shift+X`
- Any valid combo

The hotkey uses Win32 `RegisterHotKey` — not a low-level keyboard hook. Cleaner, no security software conflicts.

## Real Workflow: Invoice in 45 Seconds

**Scenario**: Extract 7 fields from a vendor invoice

1. `Ctrl+Shift+X` → drag 7 regions (invoice #, date, vendor, line items, subtotal, tax, total)
2. Auto-numbered ①②③④⑤⑥⑦
3. Click "Recognize All" (or enable auto-OCR for instant)
4. Export CSV → open in Excel → every row labeled with region index and coordinates

**Old way**: 7 screenshots, 7 OCR runs, 7 copy-pastes, manual Excel entry = ~3 minutes  
**CaptureOCR way**: 1 session, 1 batch OCR, 1 export = ~45 seconds

## Hotkey Conflicts? Here's the Fix

If `Ctrl+Shift+X` conflicts with your IDE:

1. Settings → Hotkey
2. Pick an alternative
3. Or disable the conflicting app's hotkey

Common conflicts:
- VS Code: `Ctrl+Shift+X` = Extensions panel → change CaptureOCR to `Ctrl+Shift+S`
- Some terminals: `Ctrl+Shift+X` = custom binding → use `Alt+Shift+X`

## Multi-Monitor & DPI: It Just Works

The hotkey captures on whichever monitor your cursor is on. Selection overlay works in Qt logical coordinates; capture works in physical pixels. On 125%/150% displays or mixed-DPI multi-monitor setups, coordinates are DPI-independent physical pixels.

Each monitor has a `ScreenInfo` with logical rect, physical rect, and device pixel ratio. When you drag a selection, the controller converts logical → physical for that monitor, grabs exact region.

## Batch OCR After Capture

Two modes:
- **Auto-OCR** (Settings → ON): Each region recognizes immediately after capture
- **Manual batch**: Capture all → click "Recognize All" → processes sequentially

Progress UI: "Recognizing ③ of ⑦..." with per-region progress.

## Export: All Regions, One File

One click → Markdown / CSV / TXT / .snipx session package. All regions in one file.

CSV includes for every row:
- Region display index (1, 2, 3...)
- Screen coordinates (x, y, w, h) — physical pixels
- Line index within region
- Confidence (0.0000–1.0000)
- Text
- OCR mode (fast/accurate)
- Processing time
- Model hash (reproducibility)

## Power User Tips

1. **Enable auto-copy**: Settings → Output → Copy after export → Markdown/CSV goes straight to clipboard
2. **Pre-capture all, then recognize**: Avoids "wait, did I capture that field?" moments
3. **Use display order for export**: Drawer order = export row order (stable IDs handle identity)
4. **Session package for handoff**: Send .snipx to colleague → they continue exactly where you left off

## The One Hotkey to Rule Them All

`Ctrl+Shift+X` → capture everything → done.

No more `Win+Shift+S` → copy → paste → repeat loops. One session, structured export, done.

[Get CaptureOCR](https://apps.microsoft.com/store/detail/9PBP8VBG4RJ1?cid=DevShareMCLPCS) ($2.99 one-time, no subscription) and reclaim your workflow.

---

<a href="https://apps.microsoft.com/store/detail/9PBP8VBG4RJ1?cid=DevShareMCLPCS" target="_blank" rel="noopener" aria-label="Get CaptureOCR from the Microsoft Store">
  <img src="/assets/ms-store-badge-en.png" alt="Get CaptureOCR from Microsoft Store" width="200" style="height:auto; border:0;">
</a>

---

**Related reads:**
- [How to Extract Text from Multiple Screenshots at Once](/CaptureOCR/blog/extract-text-multiple-screenshots-windows)
- [Batch OCR Multiple Regions Single Session Windows](/CaptureOCR/blog/batch-ocr-multiple-regions-single-session-windows)
- [Export Screenshot OCR to CSV with Coordinates](/CaptureOCR/blog/export-screenshot-ocr-to-csv-coordinates)