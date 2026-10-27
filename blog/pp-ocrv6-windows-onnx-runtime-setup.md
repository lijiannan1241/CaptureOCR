---
layout: default
title: "PP-OCRv6 Windows ONNX Runtime Setup: Local OCR Without Python Dependencies"
description: "How CaptureOCR bundles PP-OCRv6 with ONNX Runtime for zero-dependency local OCR on Windows. Model management, tiling for long images, and performance tuning."
date: 2026-11-23
author: nannan2008
tags: [pp-ocrv6, onnx-runtime, windows, local-ocr, model-management]
canonical_url: https://lijiannan1241.github.io/CaptureOCR/blog/posts/pp-ocrv6-windows-onnx-runtime-setup/
---

# PP-OCRv6 Windows ONNX Runtime Setup: Local OCR Without Python Dependencies

If you've tried running PaddleOCR on Windows, you know the pain: Python environment, pip dependencies, version conflicts, model downloads, GPU/CUDA setup. CaptureOCR solves this by bundling PP-OCRv6 with ONNX Runtime in a native Windows app. Zero Python, zero dependencies, runs out of the box.

## The Python OCR Problem

Typical PaddleOCR setup on Windows:
1. Install Python 3.10+
2. `pip install paddlepaddle paddleocr` (huge, pulls CUDA if not careful)
3. Download models manually or let rapidocr handle it
4. Deal with OpenCV DLL conflicts (`opencv-python` vs `opencv-python-headless`)
5. ONNX Runtime providers: CPU vs CUDA vs DirectML — which works?
6. Model version drift: rapidocr updates break model compatibility

CaptureOCR sidesteps all of this by:
- **Pre-converting** PP-OCRv6 to ONNX at build time
- **Bundling ONNX Runtime** (CPU, no CUDA needed)
- **Shipping models inside the installer** (tiny = 6.6 MB, no download)
- **Managing models via custom ModelManager** (SHA256 verified, resumable, ModelScope mirror)

## Architecture: ONNX Runtime + PP-OCRv6

```
CaptureOCR (PySide6/Qt)
    → mss capture (physical pixels, BGRA numpy)
    → Preprocess (resize, normalize, HWC→CHW)
    → ONNX Runtime InferenceSession
        → Det model (text detection)
        → Rec model (text recognition)  
        → Cls model (orientation, optional)
    → Postprocess (box grouping, line ordering, confidence)
    → Structured output (Markdown/CSV/JSON)
```

**Zero Python at runtime.** The inference runs in a dedicated worker thread via ONNX Runtime C API (via `onnxruntime` Python package at build time, but the packaged app is pure native + ONNX Runtime DLLs).

## Model Management: Zero-Hassle

### Two tiers, both local

| Tier | Model | Size | Download | Use Case |
|------|-------|------|----------|----------|
| **Fast** | PP-OCRv6 tiny | 6.61 MB | Bundled in installer | Clean docs, English/Chinese, no Japanese |
| **Accurate** | PP-OCRv6 small | 29.79 MB | Auto-download once | Low contrast, small print, Japanese |

### Model storage
```
%LOCALAPPDATA%\CaptureOCR\SnipOCR\models\PP-OCRv6\
├── tiny\
│   ├── det.onnx
│   ├── rec.onnx
│   └── cls.onnx (optional)
└── small\
    ├── det.onnx
    ├── rec.onnx
    └── cls.onnx
```

### Download: SHA256 verified, resumable, ModelScope mirror
```python
# infra/model_manager.py
_MS = "https://www.modelscope.cn/models/RapidAI/RapidOCR/resolve/v3.9.2"
_ONNX = f"{_MS}/onnx/PP-OCRv6"
```
- SHA256 verified on every file
- Resumable download (Range headers)
- Falls back to alternative URLs
- Progress callback for UI

### Fast mode = zero download
Tiny model (6.61 MB) is **inside the MSIX/installer**. Install → run → OCR works. No network call.

Accurate mode downloads small model once (~30 MB, ~1 second on broadband). After that, fully offline.

## Performance Tuning: 4 Choices That Mattered More Than Model Choice

### 1. Never upscale before detection
PaddleOCR default: `limit_type="min"` + `limit_side_len=736` → short side enlarged to 736px.

**Problem**: 740×92 screenshot → 5920×736 before detection. Huge tensor, slower, no accuracy gain.

**Fix**: `limit_type="max"` + `det_limit_side_len=1600`. Only downscale if long side > 1600px.
- 740×92 stays 740×92 → **8.9× faster** (738ms → 85ms)
- CAR 98.59% → 99.86% (**simultaneously more accurate**)

### 2. Disable orientation classification
`use_cls=False`. Classifier trained for 0°/180° rotation; screenshots are upright. Extra stage, no signal.

### 3. Single inference thread
ONNX Runtime `InferenceSession` not guaranteed thread-safe. Instead of locks:
- All model loads, unloads, `run()` calls on **single worker thread**
- UI enqueues work, receives results via queue
- Cost: no parallel OCR (10 regions = sequential)
- Benefit: predictable switching, no UB

### 4. Keep fast model hot, unload accurate
- Tiny stays loaded (resident)
- Small unloads after 5s idle → drops resident memory substantially
- CPU memory arena disabled → predictable unload for tray app

## Tiling for Long Images: Precision, Not Throughput

A 20,000px tall image fed to OCR with 1600px cap gets globally downscaled. 30px text → 2px. Noise.

**CaptureOCR tiles instead**:
- Tile height target: 1600px
- Overlap: 64px (2 lines at 1080p)
- Core bands: `[0, 1536)`, `[1536, 3072)`, ...
- Each tile extends 32px above/below for context
- Lines assigned by center Y to exactly one core band
- Boxes remapped to whole-image coords, sorted by Y then X

Core bands contiguous → every line claimed once. Overlap ensures boundary lines complete.

**Cost**: Serial inference 1520ms → 4000ms for 5550px image. Tiling = precision feature, not throughput.

## Scroll Capture: Row Signatures, Not Template Matching

Template matching fails: consecutive frames overlap, neither contains the other.

**Row signature approach**:
1. Grayscale + ignore right 8% (scrollbars)
2. Compress each row → 32 column-bucket means: `(H, 32)`
3. Shift search: minimize mean absolute difference `prev[s:]` vs `cur[:H-s]`
4. Peak validation: best score < threshold AND clearly better than median

**Why 32 buckets?** Tested on real frame pairs:
- 12 buckets: 7/9 correct
- 24 buckets: 8/9 correct  
- 32 buckets: 9/9 correct
- 64 buckets: 9/9 (2× compute)

**Sticky headers**: Matcher retries skipping 8%/16%/25% of top rows.

**Adaptive wheel step**: Start at 1 notch → measure actual shift → target 45% selection height, 2× growth cap, 1–12 notches.

## Model Verification: SHA256 on Every Build

Build scripts verify model integrity:
```powershell
# Verify model files match expected SHA256
python scripts/verify_models.py
```
- Compares every `.onnx` file against known hashes
- Fails build if mismatch
- Ensures no corrupted/partial downloads in package

## Building Your Own: Key Dependencies

If you want to replicate locally:

```powershell
# Python 3.10+
py -3.12 -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -e ".[windows,dev]"

# Critical: use opencv-python-headless, NOT opencv-python
# Otherwise two ffmpeg DLL sets (55 MB extra)
pip install opencv-python-headless
pip install --no-deps rapidocr
```

**ONNX Runtime**: `onnxruntime` (CPU) or `onnxruntime-gpu` (CUDA) — CaptureOCR uses CPU for portability.

**MSIX packaging**: Uses `makeappx.exe` from Windows SDK. `--onedir` mode (faster startup, models don't re-extract).

## Troubleshooting Common Issues

| Issue | Cause | Fix |
|-------|-------|-----|
| `DLL load failed` | Missing VC++ runtime | Install `Microsoft.VCLibs.140.00.UWPDesktop` |
| Model not found | Download failed/corrupted | Delete `%LOCALAPPDATA%\CaptureOCR\models\`, retry Accurate mode |
| Slow first run | Model loading | Expected: tiny 1.35s, small 1.06s |
| Japanese not working | Using Fast mode | Switch to Accurate mode |
| OCR crashes | ONNX Runtime provider issue | Ensure CPU provider, not CUDA/DirectML |

## Why Not Just Use rapidocr Directly?

| rapidocr | CaptureOCR |
|----------|------------|
| Python dependency | Zero runtime deps (bundled) |
| Manual model management | Auto-download, SHA256, resumable |
| `limit_type="min"` default | `limit_type="max"` fixed |
| No tiling for long images | 1600px tiles with 64px overlap |
| No scroll capture | Row-signature stitching (32 buckets) |
| No structured export | Markdown/CSV/JSON with coordinates + confidence |
| Single region | 10+ regions per session |

## Get It Running

1. [Install from Microsoft Store](https://apps.microsoft.com/store/detail/9PBP8VBG4RJ1?cid=DevShareMCLPCS) ($2.99 one-time)
2. `Ctrl+Shift+X` → capture
3. Done. No Python, no pip, no model downloads (Fast mode).

---

<a href="https://apps.microsoft.com/store/detail/9PBP8VBG4RJ1?cid=DevShareMCLPCS" target="_blank" rel="noopener" aria-label="Get CaptureOCR from the Microsoft Store">
  <img src="/assets/ms-store-badge-en.png" alt="Get CaptureOCR from Microsoft Store" width="200" style="height:auto; border:0;">
</a>

---

**Related reads:**
- [PP-OCRv6 vs Windows Snipping Tool OCR Comparison](/CaptureOCR/blog/pp-ocrv6-vs-windows-snipping-tool-ocr-comparison)
- [Offline OCR Tool That Works on Windows Without Internet](/CaptureOCR/blog/offline-ocr-tool-windows-no-internet)
- [Best Offline OCR for Chinese Invoices on Windows 11](/CaptureOCR/blog/offline-ocr-chinese-invoices-windows-11)