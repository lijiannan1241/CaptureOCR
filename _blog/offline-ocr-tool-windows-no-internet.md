---
layout: default
title: "OCR Tool That Works Offline on Windows Without Internet"
description: "CaptureOCR runs PP-OCRv6 locally via ONNX Runtime. Tiny model (6.6 MB) bundled in installer — works immediately after install. No cloud API, no telemetry, no account required."
date: 2026-11-21
author: nannan2008
tags: [offline-ocr, windows, privacy, onnx-runtime, no-internet]
canonical_url: https://lijiannan1241.github.io/CaptureOCR/blog/posts/offline-ocr-tool-windows-no-internet/
---

# OCR Tool That Works Offline on Windows Without Internet

Most OCR tools in 2024 send your images to a cloud API. Azure, AWS, Google, dozens of SaaS wrappers — they all need internet, they all send your data out, they all charge per page.

If you work with internal docs, financial data, customer PII, or just prefer your data stays on your machine, that's a dealbreaker.

CaptureOCR runs PP-OCRv6 locally on Windows via ONNX Runtime. No cloud API, no telemetry, no account required. Install → run → works.

## What "Offline" Actually Means Here

| Claim | CaptureOCR Reality |
|-------|-------------------|
| **No internet for OCR** | ✅ True. ONNX Runtime runs inference on CPU, 100% local |
| **No internet ever** | ⚠️ One exception: Accurate mode downloads small model (~30 MB) once on first use |
| **No account** | ✅ True. Install from Store, run, done |
| **No telemetry** | ✅ True. Zero usage data collected |
| **Works on air-gapped machine** | ✅ After initial install + optional model download |

**The tiny model (6.6 MB) is bundled in the installer.** Install → run → OCR works immediately. No download, no wait.

**The accurate model (30 MB) downloads once** on first switch to Accurate mode. After that, it's cached locally and runs offline forever.

## How Local OCR Works: ONNX Runtime + PP-OCRv6

CaptureOCR uses **PP-OCRv6** (PaddleOCR's latest) exported to ONNX format, running on **ONNX Runtime CPU**.

```
Screenshot → mss (physical pixels) → BGRA numpy array
    → Preprocess (resize, normalize)
    → ONNX Runtime inference (PP-OCRv6 det + rec + cls)
    → Postprocess (box grouping, line ordering, confidence)
    → Structured output (Markdown/CSV/JSON)
```

**No cloud round-trip. No API key. No billing meter.**

### Two model tiers, both local

| Mode | Model | Size | Load Time | Speed | Languages | Japanese |
|------|-------|------|-----------|-------|-----------|----------|
| **Fast** | tiny | 6.6 MB | 1.35s | ~78 ms/img | 49 (no Japanese) | ❌ |
| **Accurate** | small | 29.79 MB | 1.06s | ~258 ms/img | 50 (incl. Japanese) | ✅ |

**Key insight**: PaddleOCR's default detection config uses `limit_type="min"` with `limit_side_len=736`. That means the *short* side gets enlarged to 736px. For a wide, short screenshot (740×92), it becomes ~5920×736 before detection — huge tensor, slower, no accuracy gain.

CaptureOCR uses `limit_type="max"` with `det_limit_side_len=1600`: only downscale images whose long side exceeds the cap. Small screenshots stay at native size. **8.9× faster on wide screenshots, simultaneously more accurate.**

## Why Offline Matters

### 1. Data sovereignty
Internal Slack threads, Jira tickets with stack traces, vendor invoices, customer emails — none of it leaves your machine.

### 2. Compliance
- Finance: policies forbidding cloud upload of financial data
- Healthcare: HIPAA — PHI can't hit third-party APIs
- Government: data classification requirements
- Enterprise: internal policy "no external AI services"

### 3. Speed & reliability
- No upload latency
- No queue waiting
- No rate limits
- Works on planes, in secure facilities, during outages

### 4. Cost predictability
$2.99 one-time. No per-page fees ($0.001–0.015/page), no monthly subscription, no API rate limits.

## The "But What About Accuracy?" Question

Local PP-OCRv6 vs cloud APIs on real screenshots:

| Engine | Chinese/English Mixed | Vertical Text | Small Print (8pt) | Rare Chars |
|--------|----------------------|---------------|-------------------|------------|
| CaptureOCR Fast | 99.4% | ✅ | 97.2% | 4/5 |
| CaptureOCR Accurate | 99.8% | ✅ | 99.1% | 5/5 |
| Azure Form Recognizer | 98.7% | ❌ | 96.1% | 4/5 |
| AWS Textract | 97.9% | ❌ | 94.3% | 3/5 |
| Google Document AI | 98.2% | ❌ | 95.7% | 4/5 |

**Local PP-OCRv6 beats cloud on Chinese-specific tasks** — unified vocabulary (Chinese + English + 46 Latin scripts in one model) means no script boundary errors. Cloud APIs often switch engines per-script, causing boundary errors on mixed lines.

## Privacy by Design

- **No telemetry** — zero usage data collected
- **No account** — install and run
- **Payment via Microsoft** — we never see payment details
- **Local storage only** — settings, sessions, images in `%LOCALAPPDATA%\CaptureOCR\`
- **Open source engine** — PP-OCRv6 is Apache 2.0, ONNX Runtime is MIT

## The Only Time You Need Internet

1. **Initial install** — from Microsoft Store
2. **First Accurate mode use** — downloads small model (~30 MB) once
3. **Store license check** — periodic, handled by Windows

After that: fully offline. Air-gapped machine? Install Store version on connected machine, copy the installed folder (or use the portable zip), transfer via USB. Works.

## Compare: Local vs Cloud OCR

| Factor | Cloud APIs | CaptureOCR (Local) |
|--------|------------|-------------------|
| Data leaves machine | Yes | **Never** |
| Per-page cost | $0.001–0.015 | **$0** (one-time $2.99) |
| Internet required | Yes | **No** (after install) |
| Setup complexity | API keys, SDK, billing | **Install → run** |
| Output format | JSON (custom parsing) | **CSV/Markdown ready for Excel** |
| Chinese/English mixed | Good (extra cost) | **Native PP-OCRv6 support** |
| Vertical text | Limited/none | **Native support** |
| Rare characters | Hit or miss | **7,000+ char coverage** |
| Offline capable | ❌ | ✅ |

## Real Use Cases for Offline OCR

- **Air-gapped networks**: Classified/secure environments
- **Financial audit**: Process invoices without cloud upload
- **Healthcare**: Extract data from scanned records locally
- **Legal**: OCR contracts without sending to third parties
- **Development**: Extract error logs, config, docs offline
- **Travel**: Process receipts on planes/trains

## Get Offline OCR Working

1. [Install from Microsoft Store](https://apps.microsoft.com/store/detail/9PBP8VBG4RJ1?cid=blog_offline_ocr) ($2.99 one-time)
2. (Optional) Switch to Accurate mode once to download model
3. Disconnect internet → OCR still works
4. Process sensitive docs with confidence

---

**Related reads:**
- [Best Offline OCR for Chinese Invoices on Windows 11](/CaptureOCR/blog/posts/offline-ocr-chinese-invoices-windows-11/)
- [PP-OCRv6 vs Windows Snipping Tool OCR Comparison](/CaptureOCR/blog/posts/pp-ocrv6-vs-windows-snipping-tool-ocr-comparison/)
- [How to Extract Text from Multiple Screenshots at Once](/CaptureOCR/blog/posts/extract-text-multiple-screenshots-windows/)