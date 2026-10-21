# CaptureOCR

**A Windows screenshot, annotation, and OCR workflow tool built for Chinese/CJK mixed-text scenarios — offline, one-time purchase, and available on the Microsoft Store.**

<a href="https://apps.microsoft.com/store/detail/9PBP8VBG4RJ1?cid=github_readme">
  <img src="https://get.microsoft.com/images/ms-store-badge-en.png"
       alt="Get CaptureOCR from Microsoft Store"
       width="200" style="height:auto; border:0;">
</a>

[Website](https://lijiannan1241.github.io/SnipOCR/) · [Microsoft Store](https://apps.microsoft.com/store/detail/9PBP8VBG4RJ1) · [FAQ](https://lijiannan1241.github.io/SnipOCR/#常见问题faq)

---

## Why CaptureOCR?

Windows 11 already has built-in OCR (Text Actions) and PowerToys Text Extractor (`Win+Shift+T`) can copy screen text for free. CaptureOCR does not try to win on "can it extract text" — it wins on **what happens after the text is extracted**:

- Capture **multiple regions in one session**, auto-numbered ①②③
- Batch-recognize them and export as a **Markdown table** or **CSV** with coordinates, confidence scores, and region indices
- Annotate, beautify, and OCR **in the same window** — the beautified output still keeps extractable text

That is the workflow gap that neither free system tools nor paid competitors currently fill.

---

## Key Features

| Feature | What it does |
|---|---|
| **PP-OCRv6 dual-tier offline OCR** | Fast mode (tiny, ~6.6 MB) and Accurate mode (small, ~29.8 MB). Tiny model ships inside the installer — OCR works offline out of the box. |
| **CJK mixed-text optimization** | Tuned for Chinese, Japanese, and Chinese-English mixed layouts where the Windows built-in OCR is weakest. |
| **Multi-region batch OCR** | Capture 10+ regions in one session with automatic numbering, reorder/delete/undo in a drawer. |
| **Structured export** | Markdown table and CSV export with per-region coordinates, confidence, and text — ready for Excel or documentation. |
| **Annotation → Beautify → OCR loop** | Arrows, rectangles, highlights, mosaic, gradient backgrounds, shadows, rounded corners — all in one window, and the text remains extractable after beautification. |
| **Bilingual UI** | English and Simplified Chinese, switchable at runtime. |

---

## How It Compares

| Capability | **CaptureOCR** | Windows Snipping Tool | Snipaste | ShareX |
|---|---|---|---|---|
| CJK-optimized OCR engine | ✅ PP-OCRv6 tiny/small | ⚠️ System OCR, weaker on CJK mixed layouts | ⚠️ OCR is Pro-only, engine undisclosed | ⚠️ Requires manual setup |
| Multi-region batch OCR + numbering | ✅ 10+ regions per session | ❌ | ❌ | ⚠️ Workflow possible |
| Structured export (Markdown / CSV) | ✅ With coordinates and confidence | ❌ | ❌ | ⚠️ Requires scripting |
| Annotation + Beautify + OCR in one window | ✅ | ⚠️ Basic annotation, no beautify | ✅ Strong annotation, no beautify+OCR loop | ✅ Powerful but steep learning curve |
| Offline out of the box | ✅ Tiny model bundled | ✅ | ⚠️ Depends on system APIs | ✅ |
| Bilingual UI | ✅ | ✅ Follows system | ⚠️ Limited | ❌ |
| Pricing | **$2.99 one-time purchase** | Free | Paid Pro tier | Free, open source |
| Learning curve | Low | Low | Low | **High** |

> Based on publicly available feature descriptions and internal competitive verification. Snipaste's "copy text" reads the system text-rendering interface, which is not pixel-level OCR for text inside images.

---

## Technical Stack

- **OCR engine**: PP-OCRv6 (tiny / small), ONNX Runtime
- **Inference backend**: `rapidocr` + `onnxruntime`
- **UI framework**: PySide6 (Qt for Python)
- **Capture**: `mss` + `pywin32`
- **Packaging**: PyInstaller (`--onedir`) → MSIX → Microsoft Store (`runFullTrust`)

---

## FAQ

**Q: Is CaptureOCR free?**
A: No. CaptureOCR is a one-time purchase of **$2.99** on the Microsoft Store. The tiny OCR model is bundled in the installer, so OCR works immediately after installation without any download.

**Q: Does OCR require an internet connection?**
A: No. The tiny model ships inside the MSIX package and works fully offline. The accurate (small) model downloads once (~30 MB) and then also runs offline — no cloud API is involved at any point.

**Q: What languages are supported?**
A: The PP-OCRv6 small tier covers 50 languages, including Chinese, Japanese, English, and 46 Latin-script languages. The tiny tier covers 49 languages and excludes Japanese — switch to Accurate mode for Japanese text.

**Q: How is this different from the Windows Snipping Tool?**
A: The Windows built-in OCR is strong on Latin script and standard print, but weaker on Chinese mixed layouts, vertical text, and small dot-matrix fonts. It also handles only one region at a time and returns a plain text stream. CaptureOCR supports multi-region capture, numbered batch export to Markdown/CSV, and annotation + beautification in the same window.

**Q: Does it support scrolling screenshots?**
A: Scrolling capture is on the roadmap (P1). The current release prioritizes stability for region/window/fullscreen capture, multi-region batch OCR, and structured export.

---

## Links

- **Microsoft Store**: https://apps.microsoft.com/store/detail/9PBP8VBG4RJ1
- **Product site (GitHub Pages)**: https://lijiannan1241.github.io/SnipOCR/
- **Source repository**: https://github.com/lijiannan1241/SnipOCR

---

## License

The application and bundled models are distributed under their respective licenses. PP-OCRv6 models are Apache-2.0. See the Microsoft Store listing for the end-user license terms.
