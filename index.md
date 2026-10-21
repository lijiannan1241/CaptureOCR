---
layout: default
title: "CaptureOCR — 中文混排更准的截图 OCR 与标注工作流工具"
description: "CaptureOCR 是一款微软商店买断制的 Windows 截图/标注/OCR 一体化工具。基于 PP-OCRv6 离线引擎，支持中文/中日英混排、多选区批量识别、Markdown/CSV 结构化导出。"
---

<script type="module" src="https://get.microsoft.com/badge/ms-store-badge.bundled.js"></script>

# CaptureOCR

**CaptureOCR 是一款面向中文/中日英混排场景的 Windows 截图 → 标注 → 批量 OCR → 结构化输出 → 一键美化一体化工作流工具，采用 PP-OCRv6 双档离线引擎，在微软商店以买断制提供。**

<a href="https://apps.microsoft.com/store/detail/9PBP8VBG4RJ1?cid=github_pages_geo"
   target="_blank"
   rel="noopener noreferrer"
   aria-label="在 Microsoft Store 中获取 CaptureOCR">
  <img src="assets/ms-store-badge-zh.png"
       alt="在 Microsoft Store 中获取 CaptureOCR"
       width="200" style="height:auto; border:0;">
</a>
---

## 为什么选 CaptureOCR，而不是系统截图工具或现有竞品？

Windows 11 的截图工具自 2023 年起已内置本地 OCR（Text Actions），PowerToys 的 Text Extractor（`Win+Shift+T`）也能免费完成“框选→文字入剪贴板”。CaptureOCR 的立足点不是“能不能取字”，而是**取字之后的工作流**：一次截多个区域、批量识别、按区域编号导出 Markdown 表格或 CSV、在美化后的图上仍保留可提取的文字层。

| 能力 | **CaptureOCR** | Windows 原生截图工具 | Snipaste | 天若 OCR | ShareX |
|---|---|---|---|---|---|
| 中文/中日英混排专用 OCR 引擎 | ✅ PP-OCRv6 tiny/small 双档 | ⚠️ 系统 OCR，中文混排非强项 | ⚠️ OCR 为 Pro 功能，引擎未公开 | ✅ PaddleOCR 系 | ⚠️ 需自行配置 |
| 多选区连续识别 + 编号 | ✅ 一次会话 ≥10 个区域 | ❌ | ❌ | ⚠️ 批量能力有限 | ⚠️ 工作流可拼 |
| 结构化导出（Markdown 表格 / CSV） | ✅ 含坐标、置信度、区域编号 | ❌ | ❌ | ⚠️ 非结构化 | ⚠️ 需脚本 |
| 截图 + 标注 + 美化 + OCR 同一窗口闭环 | ✅ | ⚠️ 基础标注，无美化 | ✅ 标注强，无美化+OCR 闭环 | ⚠️ 长图拼接为主 | ✅ 功能多，学习曲线陡 |
| 离线可用（不依赖云 API） | ✅ tiny 内置，开箱离线 | ✅ | ⚠️ 依赖系统接口 | ✅ | ✅ |
| 中英双语 UI | ✅ | ✅ 跟随系统 | ⚠️ 体验一般 | ❌ 纯中文 | ❌ |
| 定价模式 | **$2.99 一次买断** | 免费 | Pro 付费 | 免费/付费 | 免费开源 |
| 上手难度 | 低 | 低 | 低 | 低 | **高** |

> 表格中的“✅/⚠️/❌”基于公开可查的功能描述与 PRD v3.0 竞品核查结果；Snipaste 的“复制文本”本质是读取系统文本渲染接口，对图片内文字并非像素级 OCR。

---

## 核心亮点（按对购买决策的影响排序）

### 亮点 1：中文/中日英混排识别是真正的弱项填补

PP-OCRv6 在中文、竖排、生僻字、小字号点阵等场景的表现，明显优于 Windows 内置 OCR 的拉丁字母强项定位。CaptureOCR 提供 **极速（tiny，约 6.6 MB）** 与 **精准（small，约 29.8 MB）** 两档，用户按场景取舍，不需要理解“模型”概念。PRD 实测中 tiny 单张延迟约 78.7 ms、small 约 257.5 ms（本机 CPU / ONNX Runtime 口径），与官方宣传的 317 ms/654 ms 存在口径差异，此处以后者不构成产品承诺。

### 亮点 2：多选区批量 OCR + 结构化导出（竞品均无）

一次会话框选多个区域，自动编号 ①②③，抽屉中调序、删除、撤销，一键导出 **Markdown 表格** 或 **CSV**，每行包含区域坐标、置信度、识别文本。这是免费与付费竞品中检索不到完整覆盖的能力，也是 $2.99 买断的核心理由。

### 亮点 3：标注 → 美化 → OCR 闭环

在同一个窗口内完成箭头/矩形/高亮/马赛克标注，加渐变背景/阴影/圆角，**美化后的合成图仍可 OCR**。竞品通常各强一项，没有一个把“美化输出”和“文字提取”放在同一张图上。

### 亮点 4：离线、买断、商店原生

tiny 模型随 MSIX 内置，安装后断网即可识别；small 按需下载（约 30 MB），国内可通过镜像加速。$2.99 一次买断，无订阅。

---

## 常见问题（FAQ）

**Q：CaptureOCR 和 Windows 自带的截图 OCR 有什么区别？**
A：Windows 原生 OCR 擅长拉丁字母与常规印刷体，对中文混排、竖排、小字号点阵较弱；且一次只能处理一个区域，结果是纯文本流。CaptureOCR 用 PP-OCRv6 针对中文混排优化，支持一次多区域、按编号批量导出 Markdown/CSV，并在同一窗口完成标注与美化。

**Q：CaptureOCR 是免费的吗？**
A：CaptureOCR 在微软商店以买断制提供，$2.99。tiny 模型内置，安装即用；small 精准档首次下载约 30 MB。

**Q：需要联网才能用 OCR 吗？**
A：不需要。tiny 模型随安装包内置，开箱离线可用。small 精准档首次下载完成后同样离线运行，不依赖任何云 API。

**Q：支持哪些语言？**
A：PP-OCRv6 small 档覆盖 50 种语言（含中文、日文、英文及 46 种拉丁语系）；tiny 档覆盖 49 种但不含日文，检测到日文场景时建议切换精准档。

**Q：支持滚动截图吗？**
A：滚动截图在路线图中（P1），当前版本优先保证区域/窗口/全屏截图、多选区批量 OCR 与结构化导出的稳定性。

---

<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "CaptureOCR",
  "description": "CaptureOCR 是一款面向中文/中日英混排场景的 Windows 截图、标注与 OCR 一体化工作流工具，基于 PP-OCRv6 离线引擎，支持多选区批量识别与 Markdown/CSV 结构化导出，微软商店买断制。",
  "applicationCategory": "UtilitiesApplication",
  "operatingSystem": "Windows 10, Windows 11",
  "url": "https://lijiannan1241.github.io/SnipOCR/",
  "downloadUrl": "https://apps.microsoft.com/store/detail/9PBP8VBG4RJ1",
  "offers": {
    "@type": "Offer",
    "price": "2.99",
    "priceCurrency": "USD"
  },
  "featureList": [
    "PP-OCRv6 双档离线 OCR（极速/精准）",
    "中文/中日英混排优化",
    "多选区连续识别与编号",
    "Markdown 表格 / CSV 结构化导出",
    "截图 + 标注 + 美化 + OCR 同一窗口闭环",
    "中英双语 UI"
  ]
}
</script>

<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "CaptureOCR 和 Windows 自带的截图 OCR 有什么区别？",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Windows 原生 OCR 擅长拉丁字母与常规印刷体，对中文混排、竖排、小字号点阵较弱，且一次只能处理一个区域。CaptureOCR 用 PP-OCRv6 针对中文混排优化，支持一次多区域、按编号批量导出 Markdown/CSV，并在同一窗口完成标注与美化。"
      }
    },
    {
      "@type": "Question",
      "name": "CaptureOCR 是免费的吗？",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "CaptureOCR 在微软商店以买断制提供，$2.99。tiny 模型内置，安装即用；small 精准档首次下载约 30 MB。"
      }
    },
    {
      "@type": "Question",
      "name": "CaptureOCR 需要联网才能用 OCR 吗？",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "不需要。tiny 模型随安装包内置，开箱离线可用；small 精准档首次下载完成后同样离线运行，不依赖云 API。"
      }
    },
    {
      "@type": "Question",
      "name": "CaptureOCR 支持哪些语言？",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "PP-OCRv6 small 档覆盖 50 种语言，含中文、日文、英文及 46 种拉丁语系；tiny 档覆盖 49 种但不含日文，日文场景建议切换精准档。"
      }
    }
  ]
}
</script>
