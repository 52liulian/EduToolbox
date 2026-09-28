/* 自动生成，请勿手改 —— 源：tools/pdf-image-convert/  ·  构建：2026-09-28 11:07:05 */
/* 用途：file:// 离线场景下 fetch 被 CORS 拦截，站点改用 <script src> 加载本文件，
   拿到工具页面与本地 CSS/JS 文本后走与 http 相同的 Shadow DOM 组件化挂载。
   工具源码改动后请重跑：python .workbuddy/scripts/build_tool_bundles.py */
(function(){
  var g = window.EduToolboxToolBundles || (window.EduToolboxToolBundles = {});
  g["pdf-image-convert"] = {
    html: `<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>PDF 与图片转换<\/title>
<link rel="stylesheet" href="pdf-image-convert.css">
<link rel="stylesheet" href="../../assets/css/tool-common.css">
<\/head>
<body>
<div class="wrap">
  <div class="tabs">
    <button class="tab active" data-tab="pdf2img">PDF 转图片<\/button>
    <button class="tab" data-tab="img2pdf">图片转 PDF<\/button>
  <\/div>

  <!-- ============ Tab A：PDF 转图片 ============ -->
  <section class="card tab-panel active" id="panel-pdf2img">
    <div id="pdfDropzone" class="dropzone">
      <div class="dz-icon">📄<\/div>
      <p>拖入 <b>.pdf<\/b> 文件，或<button type="button" class="link-btn" id="pdfPickBtn">点击选择<\/button><\/p>
      <p class="dz-hint">一次处理一个 PDF<\/p>
      <input type="file" id="pdfInput" accept=".pdf,application/pdf" hidden>
    <\/div>

    <div id="pdfInfo" class="file-bar" hidden>
      <span class="fb-icon">📕<\/span>
      <span class="fb-name" id="pdfName"><\/span>
      <span class="fb-meta" id="pdfMeta"><\/span>
      <button class="fb-del" id="pdfRemove" title="移除">✕<\/button>
    <\/div>

    <div class="opts" id="pdfOpts" hidden>
      <div class="opt-group">
        <span class="opt-label">图片格式<\/span>
        <label class="radio"><input type="radio" name="imgFmt" value="png" checked> PNG（无损，适合文字/试卷）<\/label>
        <label class="radio"><input type="radio" name="imgFmt" value="jpg"> JPG（体积更小，质量 0.92）<\/label>
      <\/div>
      <div class="opt-group">
        <span class="opt-label">分辨率倍数<\/span>
        <label class="radio"><input type="radio" name="scale" value="1" checked> 1x（72dpi）<\/label>
        <label class="radio"><input type="radio" name="scale" value="2"> 2x（144dpi，清晰）<\/label>
        <label class="radio"><input type="radio" name="scale" value="3"> 3x（216dpi，高清）<\/label>
      <\/div>
      <div class="opt-group">
        <span class="opt-label">页码范围<\/span>
        <label class="radio"><input type="radio" name="rangeMode" value="all" checked> 全部页面<\/label>
        <label class="radio range-line"><input type="radio" name="rangeMode" value="custom"> 指定页码：
          <input type="text" id="pageRange" placeholder="如 1-3,5" disabled><\/label>
      <\/div>
      <div class="actions">
        <button class="btn btn-primary" id="renderBtn">▶ 开始转换并下载<\/button>
      <\/div>
    <\/div>

    <div id="renderProgress" class="progress-box" hidden>
      <div class="progress-head"><span id="renderStatus">准备中…<\/span><span id="renderPct">0%<\/span><\/div>
      <div class="progress"><div class="progress-bar" id="renderBar"><\/div><\/div>
    <\/div>
  <\/section>

  <!-- ============ Tab B：图片转 PDF ============ -->
  <section class="card tab-panel" id="panel-img2pdf" hidden>
    <div id="imgDropzone" class="dropzone">
      <div class="dz-icon">🖼️<\/div>
      <p>拖入多张 <b>JPG / PNG<\/b> 图片，或<button type="button" class="link-btn" id="imgPickBtn">点击选择<\/button><\/p>
      <p class="dz-hint">可多次添加；下方列表支持上移 / 下移 / 删除调整顺序<\/p>
      <input type="file" id="imgInput" accept="image/jpeg,image/png,.jpg,.jpeg,.png" multiple hidden>
    <\/div>

    <ul class="img-list" id="imgList"><\/ul>

    <div class="opts" id="imgOpts" hidden>
      <div class="opt-group">
        <span class="opt-label">页面设置<\/span>
        <label class="radio"><input type="radio" name="pageMode" value="fit" checked> 适应图片尺寸（每页与图片等大，方向自动）<\/label>
        <label class="radio"><input type="radio" name="pageMode" value="a4"> A4 纸（图片按比例缩放并居中，方向自动）<\/label>
      <\/div>
      <div class="opt-group">
        <span class="opt-label">页边距（仅 A4 模式生效）<\/span>
        <label class="radio"><input type="radio" name="margin" value="0" checked> 无边距（0mm）<\/label>
        <label class="radio"><input type="radio" name="margin" value="10"> 10mm 边距<\/label>
      <\/div>
      <div class="actions">
        <button class="btn btn-primary" id="buildPdfBtn">📄 生成并下载 图片合并.pdf<\/button>
        <button class="btn btn-ghost" id="imgClearBtn">清空列表<\/button>
      <\/div>
    <\/div>

    <div id="pdfProgress" class="progress-box" hidden>
      <div class="progress-head"><span id="pdfStatus">准备中…<\/span><span id="pdfPct">0%<\/span><\/div>
      <div class="progress"><div class="progress-bar" id="pdfBar"><\/div><\/div>
    <\/div>
  <\/section>

  <section class="card tip">
    <h2 class="card-title">说明<\/h2>
    <ul>
      <li>PDF 转图片：多页自动打包为「图片.zip」（页名 page_01、page_02…），单页直接下载。<\/li>
      <li>图片转 PDF：按列表顺序一页一张图；PNG 透明区域在 PDF 中以白底呈现。<\/li>
      <li>所有渲染与打包均在本机浏览器完成，离线可用。<\/li>
    <\/ul>
  <\/section>
<\/div>

<!-- pdf.worker.min.js 通过普通 script 先加载，file:// 下作为主线程兜底（pdfjsWorker） -->
<script src="../../assets/js/frame-bridge.js"><\/script>
<script src="../../assets/vendor/pdf.worker.min.js"><\/script>
<script src="../../assets/vendor/pdf.min.js"><\/script>
<script src="../../assets/vendor/jszip.min.js"><\/script>
<script src="../../assets/vendor/jspdf.umd.min.js"><\/script>
<script src="pdf-image-convert.js"><\/script>
<\/body>
<\/html>
`,
    files: {
      "assets/css/tool-common.css": `/* ============================================================================
 * EduToolbox · tool-common.css
 * 自研工具共享设计系统（iframe 嵌入 / 独立打开均适用）
 * ----------------------------------------------------------------------------
 * 加载约定：各工具页先加载「自己的 css」，再加载本文件。
 *   → 本文件只提供公共底座；工具特有布局写在各自 css 中，
 *     若需覆盖本文件的同优先级声明，请使用更高特异性选择器
 *     （如 body.xxx、#app .main、具体 id）。
 * 高度策略：所有容器高度自动撑开，除 body 浏览器主滚动条外不制造内部滚动条；
 *   唯一例外：textarea 等表单控件在内容超出时允许自身滚动 + 可拖拽放大；
 *   工具自身的全屏投影模式（.is-fullscreen / :fullscreen）由各工具 css 定义。
 * ========================================================================== */

/* ---------------------------------------------------------------------------
 * 1. 设计令牌
 * ------------------------------------------------------------------------- */
:root {
  --primary:        #3b6ef6;
  --primary-hover:  #2f5ee0;
  --primary-active: #274fc2;
  --primary-soft:   #e8edff;
  --primary-soft-2: #dbe4ff;
  --primary-grad:   linear-gradient(135deg, #5a8dff 0%, #3b6ef6 55%, #2f5bd9 100%);

  --success: #22b36a;
  --warning: #f5a623;
  --danger:  #ef5b5b;
  --info:    #38a3e8;

  --text-1: #1f2733;
  --text-2: #515b6b;
  --text-3: #8a93a3;

  --bg:        #eef2fa;
  --bg-soft:   #f4f7fd;
  --card-bg:   #ffffff;
  --card-bg-2: #f8faff;
  --border:    #e4e9f2;
  --border-2:  #d6deec;

  --shadow-sm: 0 2px 8px rgba(31, 45, 80, 0.05);
  --shadow:    0 6px 22px rgba(31, 45, 80, 0.07);
  --shadow-lg: 0 16px 40px rgba(36, 66, 140, 0.14);
  --shadow-primary: 0 10px 24px rgba(59, 110, 246, 0.28);

  --r-sm: 8px;
  --r:    14px;
  --r-lg: 20px;
  --r-pill: 999px;

  --ease: cubic-bezier(0.4, 0, 0.2, 1);
  --t-fast: 0.16s;
  --t:      0.26s;

  --font: -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC",
          "Hiragino Sans GB", "Microsoft YaHei", "Helvetica Neue", Arial,
          sans-serif;
}

/* ---------------------------------------------------------------------------
 * 2. Reset（工具页可能被独立打开，需要完整底座）
 * ------------------------------------------------------------------------- */
*, *::before, *::after { box-sizing: border-box; }
* { margin: 0; padding: 0; }

html {
  -webkit-text-size-adjust: 100%;
  -webkit-tap-highlight-color: transparent;
  height: auto;
}

body {
  height: auto;
  min-height: 100%;
  overflow-x: hidden;      /* 仅防止横向溢出，纵向由浏览器主滚动条承担 */
  overflow-y: visible;
  font-family: var(--font);
  font-size: 15px;
  line-height: 1.65;
  color: var(--text-1);
  background:
    radial-gradient(1200px 500px at 85% -10%, rgba(91, 139, 255, 0.10), transparent 60%),
    radial-gradient(900px 420px at 0% 0%, rgba(56, 163, 232, 0.08), transparent 55%),
    var(--bg);
  background-attachment: fixed;
  -webkit-font-smoothing: antialiased;
}

img, svg, canvas, video { display: block; max-width: 100%; }
input, button, textarea, select { font: inherit; color: inherit; }
button { background: none; border: none; cursor: pointer; }
a { color: inherit; text-decoration: none; }
a:hover { color: var(--primary); }
ul, ol { list-style: none; }
h1, h2, h3, h4, h5, h6 { font-weight: 700; line-height: 1.3; color: var(--text-1); }

::selection { background: var(--primary); color: #fff; }

[hidden] { display: none !important; }
.hidden { display: none !important; }

::-webkit-scrollbar { width: 10px; height: 10px; }
::-webkit-scrollbar-thumb {
  background: var(--border-2);
  border-radius: 999px;
  border: 2px solid transparent;
  background-clip: content-box;
}
::-webkit-scrollbar-track { background: transparent; }

kbd {
  display: inline-block;
  padding: 2px 8px;
  font-family: Consolas, Menlo, monospace;
  font-size: 12px;
  color: var(--text-2);
  background: var(--card-bg);
  border: 1px solid var(--border-2);
  border-bottom-width: 2px;
  border-radius: 6px;
}

/* ---------------------------------------------------------------------------
 * 3. 页面骨架（高度全部 auto，内容自然向下撑开）
 * ------------------------------------------------------------------------- */
#app { width: 100%; }

.container {
  width: 100%;
  max-width: 1180px;
  margin: 0 auto;
  padding: 28px 24px 56px;
}

.wrap {
  width: 100%;
  max-width: 1240px;
  margin: 0 auto;
  padding: 28px 24px 56px;
}

/* 双栏工具：左设置面板 + 右舞台（各工具可用更高优先级改列宽/断点） */
.main {
  display: grid;
  grid-template-columns: 360px minmax(0, 1fr);
  gap: 22px;
  align-items: start;
  width: 100%;
  max-width: 1440px;
  margin: 0 auto;
  padding: 24px;
}

.layout {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: 22px;
  width: 100%;
  max-width: 1240px;
  margin: 0 auto;
  padding: 24px;
}

.setup-panel,
.settings-panel {
  display: flex;
  flex-direction: column;
  gap: 16px;
  /* 不设 sticky、不设固定高度、不内部滚动，随页面一起滚动 */
  min-width: 0;
}

.stage {
  position: relative;
  min-width: 0;
  min-height: 420px;
  padding: 24px;
  background: var(--card-bg);
  border: 1px solid var(--border);
  border-radius: var(--r-lg);
  box-shadow: var(--shadow);
  overflow: visible; /* 内容自动撑开，不裁切不滚动 */
}

/* ---------------------------------------------------------------------------
 * 4. 工具页头部（.hero / .hdr / .head / 标题组）
 * ------------------------------------------------------------------------- */
.hero {
  margin-bottom: 22px;
  padding: 26px 28px;
  text-align: center;
  background: var(--card-bg);
  border: 1px solid var(--border);
  border-radius: var(--r-lg);
  box-shadow: var(--shadow-sm);
}

.hero .title,
.hero h1 {
  font-size: clamp(22px, 3vw, 30px);
  font-weight: 800;
  margin-bottom: 8px;
}

.hero .subtitle,
.hero p {
  font-size: 14.5px;
  line-height: 1.8;
  color: var(--text-2);
  max-width: 860px;
  margin: 0 auto;
}

/* 评语类工具使用的大蓝色介绍卡 */
.hdr {
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 28px 30px;
  margin-bottom: 22px;
  color: #fff;
  background: var(--primary-grad);
  border-radius: var(--r-lg);
  box-shadow: var(--shadow-primary);
}

.hdr-emoji {
  display: grid;
  place-items: center;
  width: 72px;
  height: 72px;
  flex-shrink: 0;
  font-size: 38px;
  background: rgba(255, 255, 255, 0.18);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 20px;
}

.hdr-text h1 { color: #fff; font-size: clamp(22px, 2.6vw, 28px); margin-bottom: 6px; }
.hdr-text p { color: rgba(255, 255, 255, 0.92); font-size: 14px; line-height: 1.75; }

.head {
  margin-bottom: 20px;
  padding: 22px 24px;
  background: var(--card-bg);
  border: 1px solid var(--border);
  border-radius: var(--r-lg);
  box-shadow: var(--shadow-sm);
}

.head h1,
.head .title { font-size: clamp(20px, 2.4vw, 26px); margin-bottom: 6px; }
.head p { color: var(--text-2); font-size: 14px; line-height: 1.7; }

.title { font-size: 24px; font-weight: 800; }
.subtitle { font-size: 14.5px; color: var(--text-2); line-height: 1.75; }
.slogan { font-size: 13px; color: var(--text-3); }
.tool-title { font-size: 20px; font-weight: 800; }
.tool-sub { font-size: 13.5px; color: var(--text-2); }

/* ---------------------------------------------------------------------------
 * 5. 面板 / 卡片 / 区块
 * ------------------------------------------------------------------------- */
.panel,
.card,
.side-card,
.sheet {
  background: var(--card-bg);
  border: 1px solid var(--border);
  border-radius: var(--r);
  box-shadow: var(--shadow-sm);
  padding: 22px;
}

.panels {
  display: grid;
  grid-template-columns: minmax(280px, 360px) minmax(0, 1fr);
  gap: 18px;
  margin-bottom: 18px;
}

.panel { min-width: 0; }
.panel-names { grid-column: 1; }
.panel-dims  {
  grid-column: 2;
  background: linear-gradient(135deg, #f0f6ff 0%, #f7f9ff 100%);
  border-color: #dce7ff;
}
.panel-settings { grid-column: 1 / -1; }

.panel-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 12px;
}

.panel-title,
.card-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 16px;
  font-weight: 700;
  margin-bottom: 12px;
}

.panel-head .panel-title { margin-bottom: 0; }

.panel-tip,
.panel-toggle {
  margin-top: 10px;
  font-size: 12.5px;
  line-height: 1.6;
  color: var(--text-3);
}

.panel-block { margin-top: 16px; }

.block {
  padding: 20px;
  background: var(--card-bg);
  border: 1px solid var(--border);
  border-radius: var(--r);
  box-shadow: var(--shadow-sm);
}

.block + .block { margin-top: 0; }
.setup-panel .block { /* 已由父级 gap 控制间距 */ }

.block-title {
  display: flex;
  align-items: center;
  gap: 7px;
  font-size: 15.5px;
  font-weight: 700;
  margin-bottom: 10px;
}

.block-hint {
  font-size: 12.5px;
  line-height: 1.6;
  color: var(--text-3);
  margin-bottom: 10px;
}

.count-bar {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
  margin-top: 10px;
  font-size: 13px;
  color: var(--text-2);
}

.count-bar span { font-weight: 700; color: var(--primary); }

/* ---------------------------------------------------------------------------
 * 6. 表单元素
 * ------------------------------------------------------------------------- */
input[type="text"],
input[type="number"],
input[type="email"],
input[type="password"],
input[type="search"],
input[type="url"],
input[type="date"],
input[type="time"],
input[type="datetime-local"],
select,
textarea {
  width: 100%;
  padding: 10px 14px;
  font-size: 14px;
  color: var(--text-1);
  background: var(--card-bg-2);
  border: 1.5px solid var(--border);
  border-radius: var(--r-sm);
  outline: none;
  transition: all var(--t-fast) var(--ease);
}

textarea {
  display: block;
  min-height: 150px;
  line-height: 1.7;
  resize: vertical;          /* 用户可拖拽放大，默认完整展示不出现内部滚动条 */
  overflow: auto;
}

input:focus, select:focus, textarea:focus {
  border-color: var(--primary);
  background: #fff;
  box-shadow: 0 0 0 3px rgba(59, 110, 246, 0.12);
}

input::placeholder, textarea::placeholder { color: var(--text-3); }

select {
  appearance: none;
  -webkit-appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath d='M2 4l4 4 4-4' stroke='%238a93a3' stroke-width='1.6' fill='none' stroke-linecap='round'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 12px center;
  padding-right: 34px;
  cursor: pointer;
}

input[type="number"] { -moz-appearance: textfield; }
input[type="number"]::-webkit-outer-spin-button,
input[type="number"]::-webkit-inner-spin-button { -webkit-appearance: none; margin: 0; }

input[type="color"] {
  width: 40px;
  height: 32px;
  padding: 2px;
  border: 1.5px solid var(--border);
  border-radius: var(--r-sm);
  background: var(--card-bg);
  cursor: pointer;
}

/* 滑杆 */
input[type="range"] {
  -webkit-appearance: none;
  appearance: none;
  width: 100%;
  height: 6px;
  border-radius: 999px;
  background: var(--primary-soft-2);
  outline: none;
}

input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: var(--primary-grad);
  border: 3px solid #fff;
  box-shadow: 0 2px 6px rgba(59, 110, 246, 0.4);
  cursor: pointer;
}

input[type="range"]::-moz-range-thumb {
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: var(--primary);
  border: 3px solid #fff;
  box-shadow: 0 2px 6px rgba(59, 110, 246, 0.4);
  cursor: pointer;
}

/* 表单字段组 */
.field { margin-bottom: 14px; }
.field:last-child { margin-bottom: 0; }

.field-label {
  display: block;
  font-size: 13.5px;
  font-weight: 600;
  color: var(--text-1);
  margin-bottom: 7px;
}

.field-row {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.field-hint {
  margin-top: 6px;
  font-size: 12.5px;
  color: var(--text-3);
}

/* 设置行（label 左 / 控件右） */
.setting-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  padding: 9px 0;
  border-bottom: 1px dashed var(--border);
}

.setting-row:last-child { border-bottom: none; }

.setting-row > label {
  font-size: 13.5px;
  font-weight: 500;
  color: var(--text-2);
  flex-shrink: 0;
}

.setting-row input[type="number"],
.setting-row input[type="text"],
.setting-row select { max-width: 180px; }

.setting-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 14px;
}

.setting-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
  padding: 16px;
  background: var(--card-bg-2);
  border: 1px solid var(--border);
  border-radius: var(--r-sm);
}

.setting-item--full { grid-column: 1 / -1; }

.setting-label { font-size: 13.5px; font-weight: 600; }
.setting-val { font-size: 13px; color: var(--text-3); }

.opt-group { display: flex; flex-direction: column; gap: 8px; }
.opt-label { font-size: 13px; font-weight: 600; color: var(--text-2); }

/* 数字步进器 */
.num-ctrl,
.num-input {
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.num-btn,
.adj-btn {
  display: grid;
  place-items: center;
  width: 32px;
  height: 32px;
  font-size: 16px;
  font-weight: 700;
  color: var(--primary);
  background: var(--primary-soft);
  border-radius: var(--r-sm);
  transition: all var(--t-fast) var(--ease);
  flex-shrink: 0;
}

.num-btn:hover,
.adj-btn:hover { background: var(--primary-soft-2); }

.num-val,
.num-mini,
.num-wide {
  min-width: 52px;
  text-align: center;
  font-weight: 700;
  font-size: 16px;
  color: var(--text-1);
}

.num-wide { min-width: 84px; }
.num-mini { min-width: 40px; font-size: 14px; }
.num-unit,
.unit { font-size: 12.5px; color: var(--text-3); margin-left: 4px; }

.textarea-wrap { position: relative; }
.textarea-toolbar {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 8px;
}

/* 复选行 / 单选 */
.check-line,
.check-inline,
.check,
.chk {
  display: flex;
  align-items: center;
  gap: 9px;
  padding: 7px 0;
  font-size: 14px;
  color: var(--text-2);
  cursor: pointer;
  user-select: none;
}

.check-inline { display: inline-flex; padding: 4px 12px 4px 0; }

.check-stack { display: flex; flex-direction: column; gap: 2px; margin-top: 8px; }

.check-line input,
.check-inline input,
.check input,
.chk input {
  width: 17px;
  height: 17px;
  flex-shrink: 0;
  accent-color: var(--primary);
  cursor: pointer;
}

.radio {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  font-size: 14px;
  color: var(--text-2);
}
.radio input { accent-color: var(--primary); width: 16px; height: 16px; }

/* 开关 switch（.switch 内含 checkbox + .slider） */
.switch-wrap {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 12px;
}

.switch-desc { font-size: 13px; color: var(--text-2); }

.switch {
  position: relative;
  display: inline-block;
  width: 46px;
  height: 26px;
  flex-shrink: 0;
}

.switch input {
  position: absolute;
  opacity: 0;
  width: 100%;
  height: 100%;
  cursor: pointer;
  z-index: 2;
  margin: 0;
}

.switch .slider {
  position: absolute;
  inset: 0;
  background: #c7cfdd;
  border-radius: 999px;
  transition: background var(--t-fast) var(--ease);
  pointer-events: none;
}

.switch .slider::before {
  content: "";
  position: absolute;
  top: 3px;
  left: 3px;
  width: 20px;
  height: 20px;
  background: #fff;
  border-radius: 50%;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
  transition: transform var(--t-fast) var(--ease);
}

.switch input:checked + .slider { background: var(--primary); }
.switch input:checked + .slider::before { transform: translateX(20px); }

/* 分段选择器：seg-group > label.seg > input + span；以及按钮式 seg-btn */
.seg-group {
  display: inline-flex;
  flex-wrap: wrap;
  gap: 4px;
  padding: 4px;
  background: var(--bg-soft);
  border: 1px solid var(--border);
  border-radius: var(--r-pill);
}

.seg { position: relative; cursor: pointer; }

.seg input { position: absolute; opacity: 0; inset: 0; cursor: pointer; }

.seg span {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 7px 16px;
  font-size: 13.5px;
  font-weight: 600;
  color: var(--text-2);
  border-radius: var(--r-pill);
  transition: all var(--t-fast) var(--ease);
  white-space: nowrap;
}

.seg input:checked + span {
  color: #fff;
  background: var(--primary-grad);
  box-shadow: var(--shadow-primary);
}

.seg:hover input:not(:checked) + span { color: var(--primary); background: var(--primary-soft); }

.seg-bar {
  display: inline-flex;
  gap: 4px;
  padding: 4px;
  background: var(--bg-soft);
  border-radius: var(--r-pill);
}

.seg-btn,
.mode-btn,
.mode-tab,
.tab,
.year-btn,
.size-btn,
.preset,
.preset-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  padding: 8px 16px;
  font-size: 13.5px;
  font-weight: 600;
  color: var(--text-2);
  background: var(--card-bg);
  border: 1.5px solid var(--border);
  border-radius: var(--r-pill);
  cursor: pointer;
  transition: all var(--t-fast) var(--ease);
  white-space: nowrap;
  user-select: none;
}

.seg-btn:hover,
.mode-btn:hover,
.mode-tab:hover,
.tab:hover,
.year-btn:hover,
.size-btn:hover,
.preset:hover,
.preset-btn:hover {
  color: var(--primary);
  border-color: var(--primary-soft-2);
  background: var(--primary-soft);
}

.seg-btn.active,
.mode-btn.active,
.mode-tab.active,
.tab.active,
.year-btn.active,
.size-btn.active {
  color: #fff;
  background: var(--primary-grad);
  border-color: transparent;
  box-shadow: var(--shadow-primary);
}

.tabs {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 14px;
}

.tab-pane { display: none; }
.tab-pane.active { display: block; }

.seg-tip { font-size: 12.5px; color: var(--text-3); margin-top: 6px; }

/* 标签芯片（可点选） */
.chips {
  display: flex;
  flex-wrap: wrap;
  gap: 9px;
}

.chip {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 8px 16px;
  font-size: 13.5px;
  font-weight: 600;
  color: var(--text-2);
  background: var(--card-bg);
  border: 1.5px solid var(--border);
  border-radius: var(--r-pill);
  cursor: pointer;
  transition: all var(--t-fast) var(--ease);
  user-select: none;
}

.chip:hover {
  color: var(--primary);
  border-color: var(--primary-soft-2);
  transform: translateY(-1px);
}

.chip.active,
.chip[aria-pressed="true"] {
  color: #fff;
  background: var(--primary-grad);
  border-color: transparent;
  box-shadow: var(--shadow-primary);
}

.theme-chip {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 7px 14px;
  font-size: 13px;
  border: 1.5px solid var(--border);
  border-radius: var(--r-pill);
  cursor: pointer;
  background: var(--card-bg);
  color: var(--text-2);
  transition: all var(--t-fast) var(--ease);
}

.theme-chip.active { border-color: var(--primary); color: var(--primary); background: var(--primary-soft); }

.theme-dot,
.dot {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  border: 2px solid var(--border-2);
  flex-shrink: 0;
}
.theme-chip.active .theme-dot { box-shadow: 0 0 0 2px var(--primary-soft); }

.val-tag {
  display: inline-block;
  padding: 1px 9px;
  font-size: 12px;
  font-weight: 600;
  color: var(--primary);
  background: var(--primary-soft);
  border-radius: var(--r-pill);
}

/* 颜色行 */
.color-row { display: flex; flex-wrap: wrap; gap: 12px; }
.color-item {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  font-size: 12.5px;
  color: var(--text-2);
}
.color-item input[type="color"] { width: 34px; height: 28px; }
.color-swatch { width: 22px; height: 22px; border-radius: 7px; border: 1px solid var(--border); }
.color-line { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }

/* 拖拽上传区 */
.dropzone {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 34px 20px;
  text-align: center;
  background: var(--card-bg-2);
  border: 2px dashed var(--border-2);
  border-radius: var(--r);
  cursor: pointer;
  transition: all var(--t-fast) var(--ease);
}
.dropzone:hover,
.dropzone.dragover {
  border-color: var(--primary);
  background: var(--primary-soft);
}
.dz-icon { font-size: 36px; line-height: 1; }
.dz-hint { font-size: 13px; color: var(--text-3); }

/* ---------------------------------------------------------------------------
 * 7. 按钮体系
 * ------------------------------------------------------------------------- */
.btn,
.btn-primary,
.btn-ghost,
.btn-soft,
.btn-danger,
.btn-stop,
.btn-reveal,
.btn-small,
.bulk-btn,
.tool-btn,
.neon-btn,
.link-btn,
.ctrl-btn,
.ctrl-secondary,
.action-btn,
.theme-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 10px 20px;
  font-size: 14px;
  font-weight: 600;
  line-height: 1.2;
  white-space: nowrap;
  color: var(--text-2);
  background: var(--card-bg);
  border: 1.5px solid var(--border);
  border-radius: var(--r-pill);
  cursor: pointer;
  user-select: none;
  transition: all var(--t-fast) var(--ease);
}

.btn:hover,
.btn-ghost:hover,
.btn-soft:hover,
.bulk-btn:hover,
.tool-btn:hover,
.ctrl-btn:hover,
.ctrl-secondary:hover,
.action-btn:hover,
.link-btn:hover {
  color: var(--primary);
  border-color: var(--primary-soft-2);
  background: var(--primary-soft);
  transform: translateY(-1px);
}

.btn-primary {
  color: #fff;
  background: var(--primary-grad);
  border-color: transparent;
  box-shadow: var(--shadow-primary);
}
.btn-primary:hover {
  color: #fff;
  background: var(--primary-grad);
  filter: brightness(1.05);
  box-shadow: 0 12px 28px rgba(59, 110, 246, 0.36);
  transform: translateY(-1px);
}

.btn-danger,
.btn-stop {
  color: var(--danger);
  border-color: #ffd4d4;
  background: #fff5f5;
}
.btn-danger:hover,
.btn-stop:hover {
  color: #fff;
  background: var(--danger);
  border-color: var(--danger);
}

.btn-soft { background: var(--primary-soft); border-color: var(--primary-soft-2); color: var(--primary); }
.btn-soft:hover { background: var(--primary-soft-2); color: var(--primary); }

.btn-lg { padding: 13px 30px; font-size: 16px; }
.btn-small { padding: 7px 15px; font-size: 13px; }
.btn--ghost { /* 变体命名兼容 */ }

/* setup-panel 中无 .btn 前缀的按钮（chouti/seat 等工具使用） */
.setup-panel .btn-primary,
.setup-panel .btn-ghost {
  width: 100%;
  padding: 11px 18px;
  font-size: 14px;
}

.btn-mini {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  padding: 6px 13px;
  font-size: 12.5px;
  font-weight: 600;
  color: var(--text-2);
  background: var(--card-bg);
  border: 1.5px solid var(--border);
  border-radius: var(--r-pill);
  cursor: pointer;
  white-space: nowrap;
  transition: all var(--t-fast) var(--ease);
}
.btn-mini:hover {
  color: var(--primary);
  border-color: var(--primary-soft-2);
  background: var(--primary-soft);
}

.icon-btn {
  display: grid;
  place-items: center;
  width: 40px;
  height: 40px;
  font-size: 18px;
  color: var(--text-2);
  background: var(--card-bg);
  border: 1.5px solid var(--border);
  border-radius: 50%;
  cursor: pointer;
  transition: all var(--t-fast) var(--ease);
  flex-shrink: 0;
}
.icon-btn:hover {
  color: var(--primary);
  border-color: var(--primary-soft-2);
  background: var(--primary-soft);
  transform: translateY(-1px);
}

.link-btn {
  border: none;
  background: none;
  padding: 4px 8px;
  box-shadow: none;
}
.link-btn:hover { background: none; transform: none; }

.btn-start {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 16px 52px;
  font-size: 20px;
  font-weight: 800;
  color: #fff;
  background: var(--primary-grad);
  border-radius: var(--r-pill);
  box-shadow: var(--shadow-primary);
  cursor: pointer;
  transition: all var(--t-fast) var(--ease);
}
.btn-start:hover { transform: translateY(-2px); filter: brightness(1.06); }
.btn-start:active { transform: translateY(0); }

.neon-btn {
  color: #fff;
  background: linear-gradient(135deg, #6d4df2, #3b6ef6);
  border-color: transparent;
  box-shadow: 0 8px 20px rgba(90, 80, 246, 0.35);
}
.neon-btn:hover { color: #fff; filter: brightness(1.08); transform: translateY(-1px); }

/* 按钮行 / 操作区 */
.btn-row,
.actions,
.action-bar,
.button-group,
.btns,
.controls,
.ctrl-row,
.ctrl-group,
.toolbar,
.tool-group,
.text-tools {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}

.action-bar { justify-content: space-between; margin: 18px 0; }
.actions { justify-content: center; margin-top: 18px; }
.setup-panel .actions { flex-direction: column; align-items: stretch; }
.setup-panel .button-group { gap: 8px; }

/* 名单管理区按钮行：统一间距 */
.panel-names .btn-row {
  display: flex;
  gap: 8px;
  margin-top: 10px;
}
.panel-names .btn-row .btn { flex: 1; }

.toolbar {
  justify-content: space-between;
  padding: 16px 20px;
  margin-bottom: 18px;
  background: var(--card-bg);
  border: 1px solid var(--border);
  border-radius: var(--r);
  box-shadow: var(--shadow-sm);
}

.controls {
  justify-content: center;
  margin-top: 22px;
}
.ctrl-row { justify-content: center; }
.ctrl-label { font-size: 13px; font-weight: 600; color: var(--text-3); }
.ctrl-secondary { color: var(--text-3); }

/* ---------------------------------------------------------------------------
 * 8. 舞台 / 大屏展示
 * ------------------------------------------------------------------------- */
.stage-inner {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 20px;
  min-height: 380px;
  height: auto;
  padding: 30px 20px;
}

.stage-toolbar {
  position: absolute;
  top: 14px;
  right: 14px;
  z-index: 5;
  display: flex;
  gap: 8px;
}

.stage-title {
  font-size: 20px;
  font-weight: 800;
  text-align: center;
}

.stage-hint,
.display-hint,
.key-hint {
  font-size: 13px;
  color: var(--text-3);
  text-align: center;
}

.display {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  width: 100%;
}

.display-card {
  width: 100%;
  padding: 28px;
  text-align: center;
  background: var(--card-bg-2);
  border: 1px solid var(--border);
  border-radius: var(--r);
}

.display-value,
.display-label,
.display-sub { text-align: center; }

.display-label { font-size: 14px; color: var(--text-3); }
.display-sub { font-size: 13px; color: var(--text-3); }

.time-display,
.time-value,
.num-display,
.q-display {
  font-variant-numeric: tabular-nums;
  font-weight: 800;
  letter-spacing: -0.02em;
  text-align: center;
  color: var(--text-1);
}

.time-block { display: inline-flex; align-items: baseline; gap: 2px; }
.time-label { font-size: 13px; color: var(--text-3); }
.time-colon,
.colon { font-size: 34px; font-weight: 800; color: var(--text-2); padding: 0 2px; }

.status-bar {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 22px;
  flex-wrap: wrap;
  font-size: 13.5px;
  color: var(--text-2);
}

.status-item { display: inline-flex; align-items: center; gap: 6px; }
.status {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  font-weight: 600;
  color: var(--text-2);
}

/* 进度环（timer） */
.ring { display: block; margin: 0 auto; }
.ring-bg { fill: none; stroke: var(--primary-soft-2); stroke-width: 12; }
.ring-fg {
  fill: none;
  stroke: var(--primary);
  stroke-width: 12;
  stroke-linecap: round;
  transform: rotate(-90deg);
  transform-origin: center;
  transition: stroke-dashoffset 0.3s linear;
}
.ring-center { position: relative; }

/* 抽题专用 */
.q-index { font-size: 14px; font-weight: 700; color: var(--primary); }
.q-display { font-size: clamp(24px, 3.4vw, 40px); line-height: 1.4; padding: 0 10px; }
.answer-area {
  width: 100%;
  max-width: 760px;
  text-align: center;
}
.name-display {
  font-size: clamp(30px, 5vw, 56px);
  font-weight: 900;
  text-align: center;
  background: var(--primary-grad);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

/* 预设按钮组（timer） */
.presets {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 9px;
  margin-bottom: 20px;
}
.presets__label {
  align-self: center;
  font-size: 13.5px;
  color: var(--text-3);
  width: 100%;
  text-align: center;
}

.mode-switch {
  display: inline-flex;
  gap: 4px;
  padding: 5px;
  margin: 0 auto 20px;
  background: var(--card-bg);
  border: 1px solid var(--border);
  border-radius: var(--r-pill);
  box-shadow: var(--shadow-sm);
}

.custom {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 14px;
  flex-wrap: wrap;
  margin-bottom: 14px;
}
.custom__label { font-size: 13.5px; color: var(--text-3); }
.time-input { display: inline-flex; align-items: center; gap: 8px; }
.time-unit { display: inline-flex; flex-direction: column; align-items: center; gap: 2px; }
.time-unit input { width: 88px; text-align: center; font-size: 18px; font-weight: 700; }
.time-unit label { font-size: 12px; color: var(--text-3); }

/* ---------------------------------------------------------------------------
 * 9. 统计
 * ------------------------------------------------------------------------- */
.stats {
  display: inline-flex;
  align-items: center;
  gap: 18px;
  flex-wrap: wrap;
}
.stat {
  display: inline-flex;
  align-items: baseline;
  gap: 5px;
  font-size: 13.5px;
  color: var(--text-2);
}
.stat b { font-size: 18px; color: var(--primary); }

.stat-card,
.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  padding: 14px 20px;
  background: var(--card-bg-2);
  border: 1px solid var(--border);
  border-radius: var(--r);
  min-width: 110px;
}
.stat-num { font-size: 22px; font-weight: 800; color: var(--primary); }
.stat-label { font-size: 12.5px; color: var(--text-3); }

/* ---------------------------------------------------------------------------
 * 10. 记录 / 结果 / 空状态 / 提示
 * ------------------------------------------------------------------------- */
.record-list {
  /* 自动撑开，不限制高度，不出现内部滚动条 */
  display: flex;
  flex-direction: column;
  gap: 6px;
  max-height: none;
  overflow: visible;
}

.record-list li {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  font-size: 13.5px;
  background: var(--card-bg-2);
  border: 1px solid var(--border);
  border-radius: var(--r-sm);
}

.record-list li.empty {
  justify-content: center;
  color: var(--text-3);
  background: none;
  border: 1.5px dashed var(--border-2);
}

.rec { font-size: 13px; color: var(--text-2); }

.results { margin-top: 22px; }
.results-title { font-size: 17px; font-weight: 700; margin-bottom: 14px; }

.r-grid,
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 14px;
}

.result {
  padding: 16px;
  background: var(--card-bg);
  border: 1px solid var(--border);
  border-radius: var(--r);
  box-shadow: var(--shadow-sm);
}

.empty,
.empty-tip {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  padding: 36px 20px;
  text-align: center;
  color: var(--text-3);
  font-size: 14px;
}

.empty-icon { font-size: 48px; line-height: 1; }
.empty-text { font-size: 14px; color: var(--text-2); }

/* ---------------------------------------------------------------------------
 * 10.5 统一状态组件基线（空状态 / 信息 / 错误 / 加载中）
 *   现有 .empty / .empty-tip 保留兼容；新工具优先使用 .state 系列
 *   设计目标：跨工具统一的"无数据/异常/加载"展示，提升体验一致性
 *   用法：
 *     <div class="state state--empty">
 *       <div class="state-icon">📭<\/div>
 *       <div class="state-title">暂无名单<\/div>
 *       <div class="state-desc">请先导入学生名单后再使用<\/div>
 *       <button class="state-action" onclick="...">去添加<\/button>
 *     <\/div>
 *   语义变体（必选其一）：
 *     state--empty | state--info | state--success | state--warning
 *     | state--error | state--loading
 *   尺寸/布局修饰（可叠加）：
 *     state--compact    紧凑变体（小区域/卡片内嵌）
 *     state--list-item  列表项内嵌（消除 li 默认样式，水平占满）
 *     state--inline     行内变体（pill 形，水平排列，按钮旁/表头用）
 *     state--plain      无框变体（去掉虚线边框与背景，融入父容器）
 *     state--hero       超大变体（整页空状态，初始未导入数据用）
 *     state--closable   可关闭变体（右上角 ✕，可消除临时提示，配合 data-close）
 *   按钮修饰：
 *     state-action--ghost（次要按钮：重试/取消）
 *   loading 动效：state--loading 的 .state-title 自动叠加省略号动画
 * ------------------------------------------------------------------------- */
.state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 48px 24px;
  text-align: center;
  border: 1.5px dashed var(--border-2);
  border-radius: var(--r);
  background: var(--bg-soft);
  color: var(--text-2);
}

.state-icon {
  display: grid;
  place-items: center;
  width: 64px;
  height: 64px;
  font-size: 36px;
  line-height: 1;
  background: var(--card-bg);
  border-radius: 50%;
  box-shadow: var(--shadow-sm);
}

.state-title {
  font-size: 16px;
  font-weight: 700;
  color: var(--text-1);
}

.state-desc {
  font-size: 13.5px;
  color: var(--text-3);
  max-width: 420px;
  line-height: 1.7;
}

.state-action {
  margin-top: 4px;
  padding: 8px 20px;
  font-size: 14px;
  font-weight: 600;
  color: #fff;
  background: var(--primary-grad);
  border: none;
  border-radius: var(--r-pill);
  box-shadow: var(--shadow-primary);
  cursor: pointer;
  transition: transform var(--t-fast) var(--ease),
              box-shadow var(--t-fast) var(--ease);
}
.state-action:hover {
  transform: translateY(-1px);
  box-shadow: 0 12px 28px rgba(59, 110, 246, 0.36);
}
.state-action:active { transform: translateY(0); }
.state-action:focus-visible {
  outline: 2px solid var(--primary);
  outline-offset: 2px;
}

/* 次要按钮（重试 / 取消），用于错误状态下的次要操作 */
.state-action--ghost {
  background: transparent;
  color: var(--primary);
  border: 1px solid var(--primary);
  box-shadow: none;
}
.state-action--ghost:hover {
  background: var(--primary-soft);
  box-shadow: none;
}

/* 变体：通过边框色 + 图标色区分语义 */
.state--empty  { border-color: var(--border-2); }
.state--info   { border-color: rgba(56, 163, 232, 0.35); background: #f0f9ff; }
.state--info   .state-icon { color: var(--info); }
.state--success { border-color: rgba(34, 179, 106, 0.35); background: #f0fdf4; }
.state--success .state-icon { color: var(--success); }
.state--warning { border-color: rgba(245, 166, 35, 0.38); background: #fffbf0; }
.state--warning .state-icon { color: var(--warning); }
.state--error  { border-color: rgba(239, 91, 91, 0.42); background: #fef2f2; }
.state--error  .state-icon { color: var(--danger); }

/* 加载中变体：内置旋转 spinner，不依赖外部图标库 */
.state--loading {
  border-style: solid;
  border-color: var(--border);
  background: var(--card-bg);
}
.state--loading .state-icon {
  width: 40px;
  height: 40px;
  font-size: 0;
  border: 3px solid var(--border-2);
  border-top-color: var(--primary);
  border-radius: 50%;
  animation: state-spin 0.8s linear infinite;
}
@keyframes state-spin { to { transform: rotate(360deg); } }

/* 紧凑变体：用于列表/卡片内嵌的局部空状态或错误提示 */
.state--compact { padding: 24px 16px; }
.state--compact .state-icon { width: 48px; height: 48px; font-size: 28px; }
.state--compact .state-title { font-size: 14px; }
.state--compact .state-desc  { font-size: 12.5px; }

/* 列表项内嵌变体：消除 li 默认样式干扰，让 .state 占满列表项宽度
   用法：<li class="state state--list-item state--empty">...<\/li> 或
        <li><div class="state state--list-item state--empty">...<\/div><\/li> */
.state--list-item,
li.state--list-item {
  width: 100%;
  list-style: none;
  margin: 0;
  padding: 20px 12px;
  border-left: none;
  border-right: none;
  border-top: none;
  border-radius: 0;
  background: transparent;
}
.state--list-item + .state--list-item { border-top: 1px solid var(--border); }
.state--list-item .state-icon { width: 40px; height: 40px; font-size: 22px; }
.state--list-item .state-title { font-size: 13.5px; }
.state--list-item .state-desc  { font-size: 12px; }

/* list-item 的语义色锚点：因 border 已被去除，改用左侧 4px 色条 + 图标色区分
   原 .state--info/-success/-warning/-error 的 background 在 list-item 下被覆盖为透明 */
.state--list-item.state--info,
.state--list-item.state--success,
.state--list-item.state--warning,
.state--list-item.state--error {
  border-left: 4px solid currentColor;
  padding-left: 16px;
  background: transparent;
}
.state--list-item.state--info    { color: var(--info); }
.state--list-item.state--info    .state-title { color: var(--info); }
.state--list-item.state--success { color: var(--success); }
.state--list-item.state--success .state-title { color: var(--success); }
.state--list-item.state--warning { color: var(--warning); }
.state--list-item.state--warning .state-title { color: var(--warning); }
.state--list-item.state--error   { color: var(--danger); }
.state--list-item.state--error   .state-title { color: var(--danger); }
/* empty 变体无色条（默认中性），保持简洁 */

/* list-item hover 态：轻微背景高亮，提示该项可点击/可操作 */
.state--list-item.state--closable,
.state--list-item[data-close] {
  cursor: default;
  transition: background var(--t-fast) var(--ease);
}
.state--list-item.state--closable:hover,
.state--list-item[data-close]:hover {
  background: var(--bg-soft);
}

/* list-item + closable 组合：关闭按钮位置调整（避开 4px 色条） */
.state--list-item.state--closable { padding-right: 40px; }
.state--list-item.state--closable::before { top: 14px; right: 12px; }

/* list-item 在父容器 ul/ol 内的兼容：去默认 list-style 与 padding
   兼容性：:has() 需 Firefox 121+ / Safari 15.4+ / Chrome 105+，
   旧浏览器兜底：给 ul/ol 显式加 class="clean-list" 即可 */
ul:has(> .state--list-item),
ol:has(> .state--list-item),
ul.clean-list,
ol.clean-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

/* 嵌套容器适配：带背景的容器内不加分割线，改用卡片背景；多列网格中等高撑满 */
.record-list .state--list-item,
.results .state--list-item,
.grid .state--list-item,
.r-grid .state--list-item {
  border-top: none;
  border-radius: var(--r-sm);
  background: var(--card-bg);
}
.record-list .state--list-item,
.results .state--list-item { margin-bottom: 6px; }
.grid .state--list-item,
.r-grid .state--list-item { width: 100%; height: 100%; }

/* list-item + loading 组合：spinner 与标题水平排列，避免竖向占用过多行高 */
.state--list-item.state--loading {
  flex-direction: row;
  justify-content: center;
  gap: 12px;
  padding: 14px 12px;
}
.state--list-item.state--loading .state-icon {
  width: 18px;
  height: 18px;
  border-width: 2px;
}

/* list-item + inline 组合：行内 pill 在列表项内自动占满 */
.state--list-item.state--inline {
  width: 100%;
  justify-content: flex-start;
  border-radius: var(--r-sm);
  padding: 8px 12px;
}

/* 行内变体：水平排列，用于按钮组旁、表格单元格内、卡片头部的轻量提示
   用法：<span class="state state--inline state--info"><span class="state-icon">ℹ️<\/span><span class="state-title">已保存<\/span><\/span> */
.state--inline {
  display: inline-flex;
  flex-direction: row;
  align-items: center;
  gap: 8px;
  width: auto;
  max-width: 100%;
  padding: 6px 12px;
  border-width: 1px;
  border-style: solid;
  border-radius: var(--r-pill);
  background: var(--card-bg);
}
.state--inline .state-icon {
  width: 20px;
  height: 20px;
  font-size: 14px;
  background: none;
  box-shadow: none;
  border-radius: 0;
}
.state--inline .state-title { font-size: 13px; font-weight: 600; }
.state--inline .state-desc  { font-size: 12px; max-width: none; }
.state--inline .state-action { margin-top: 0; padding: 4px 10px; font-size: 12px; }

/* 无框变体：去掉虚线边框与背景，融入父容器
   用法：卡片头部小提示、分割区段内的轻提示 */
.state--plain {
  border: none;
  background: none;
  padding: 16px 8px;
}

/* 超大变体：用于整页空状态（如初始未导入任何数据）
   用法：<div class="state state--hero state--empty">...<\/div> */
.state--hero {
  padding: 80px 24px;
  gap: 18px;
}
.state--hero .state-icon { width: 96px; height: 96px; font-size: 52px; }
.state--hero .state-title { font-size: 20px; }
.state--hero .state-desc  { font-size: 14.5px; max-width: 540px; }

/* loading 文字动效：在 state--loading 内 .state-title 上叠加省略号动画
   实现：::after content="..." + width 0→3ch 阶梯动画（step-end）
   原因：content 不是 animatable property，旧方案在 Firefox 等浏览器失效；
        改用 width 动画是 CSS Animations Level 1 标准做法，跨浏览器一致 */
.state--loading .state-title::after {
  content: "...";
  display: inline-block;
  width: 0;
  overflow: hidden;
  vertical-align: baseline;
  font-family: ui-monospace, Menlo, Consolas, monospace;
  animation: state-dots 1.4s step-end infinite;
}
@keyframes state-dots {
  0%   { width: 0ch; }
  25%  { width: 1ch; }
  50%  { width: 2ch; }
  75%  { width: 3ch; }
  100% { width: 0ch; }
}

/* 可关闭变体：右上角关闭按钮，用于可消除的临时提示
   用法：<div class="state state--info state--closable" data-close>...<\/div>
        JS 中监听 [data-close] 点击事件隐藏整块 */
.state--closable { position: relative; padding-right: 40px; }
.state--closable::before {
  content: "✕";
  position: absolute;
  top: 10px;
  right: 12px;
  width: 22px;
  height: 22px;
  display: grid;
  place-items: center;
  font-size: 13px;
  color: var(--text-3);
  cursor: pointer;
  border-radius: 50%;
  transition: background var(--t-fast) var(--ease), color var(--t-fast) var(--ease);
}
.state--closable::before:hover {
  background: var(--bg-soft);
  color: var(--text-1);
}

/* 行内轻量错误提示：用于表单字段下方的小字提示 */
.field-error {
  margin-top: 6px;
  font-size: 12.5px;
  color: var(--danger);
  display: flex;
  align-items: center;
  gap: 4px;
}
.field-error::before { content: "⚠"; font-size: 13px; }

.tip,
.hint,
.notice {
  padding: 10px 14px;
  font-size: 12.5px;
  line-height: 1.65;
  color: var(--text-2);
  background: var(--bg-soft);
  border-left: 3px solid var(--primary);
  border-radius: var(--r-sm);
}
.notice { margin: 10px 0; }
.hint { background: none; border-left: none; padding: 4px; color: var(--text-3); }

/* ---------------------------------------------------------------------------
 * 11. 弹窗 / Toast
 * ------------------------------------------------------------------------- */
.modal-mask {
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background: rgba(20, 28, 48, 0.5);
  backdrop-filter: blur(3px);
}

.modal {
  width: 100%;
  max-width: 520px;
  max-height: 86vh;          /* 视口约束的弹层允许内部滚动 */
  overflow-y: auto;
  padding: 26px;
  background: var(--card-bg);
  border-radius: var(--r-lg);
  box-shadow: var(--shadow-lg);
  animation: modal-in 0.22s var(--ease);
}

@keyframes modal-in {
  from { opacity: 0; transform: translateY(14px) scale(0.98); }
  to   { opacity: 1; transform: translateY(0) scale(1); }
}

.modal-close {
  position: absolute;
  top: 14px;
  right: 14px;
  width: 34px;
  height: 34px;
  font-size: 16px;
  color: var(--text-3);
  border-radius: 50%;
  transition: all var(--t-fast) var(--ease);
}
.modal-close:hover { background: var(--bg-soft); color: var(--danger); }
.modal { position: relative; }

.toast {
  position: fixed;
  left: 50%;
  bottom: 36px;
  z-index: 1200;
  max-width: min(90vw, 480px);
  padding: 12px 24px;
  font-size: 14px;
  font-weight: 600;
  color: #fff;
  background: rgba(31, 39, 51, 0.92);
  border-radius: var(--r-pill);
  box-shadow: var(--shadow-lg);
  opacity: 0;
  visibility: hidden;
  transform: translate(-50%, 16px);
  transition: all var(--t) var(--ease);
  pointer-events: none;
  text-align: center;
}

.toast.show {
  opacity: 1;
  visibility: visible;
  transform: translate(-50%, 0);
}

/* ---------------------------------------------------------------------------
 * 12. 介绍/引导（intro__* 系列）
 * ------------------------------------------------------------------------- */
.intro__section {
  padding: 22px;
  margin-bottom: 16px;
  background: var(--card-bg);
  border: 1px solid var(--border);
  border-radius: var(--r);
}
.intro__h3 { font-size: 17px; margin-bottom: 10px; }
.intro__h4 { font-size: 14.5px; margin: 12px 0 6px; color: var(--text-1); }
.intro__body { font-size: 14px; color: var(--text-2); line-height: 1.8; }
.intro__qa { padding: 8px 0; font-size: 14px; line-height: 1.8; color: var(--text-2); }
.intro__step {
  display: flex;
  gap: 12px;
  padding: 10px 0;
  border-bottom: 1px dashed var(--border);
  font-size: 14px;
  color: var(--text-2);
}

.feature {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 7px 15px;
  font-size: 13px;
  font-weight: 600;
  color: var(--text-2);
  background: var(--card-bg);
  border: 1px solid var(--border);
  border-radius: var(--r-pill);
}
.feature-icon { font-size: 16px; }

/* meta 键值 */
.meta-key { font-size: 12.5px; color: var(--text-3); }
.meta-val { font-size: 13.5px; font-weight: 600; }

/* 表单行 */
.form-row,
.row {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
  margin-bottom: 12px;
}

/* 滑杆行 */
.slider-line {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 0;
}
.slider-line input[type="range"] { flex: 1; }

/* range 区间 */
.range { display: inline-flex; align-items: center; gap: 8px; }
.range-block { margin-bottom: 12px; }
.range-sep { color: var(--text-3); }

/* 预览/纸张区 */
.preview-panel,
.paper-area {
  padding: 22px;
  background: var(--card-bg);
  border: 1px solid var(--border);
  border-radius: var(--r);
  box-shadow: var(--shadow-sm);
}

/* settings 通用 */
.settings { display: flex; flex-direction: column; gap: 14px; }
.params { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 12px; }
.sep { color: var(--text-3); }
.tpl { /* 模板容器占位 */ }
.c-text { font-size: 14px; color: var(--text-2); line-height: 1.7; }
.screen { width: 100%; }

/* ---------------------------------------------------------------------------
 * 13. 大屏全屏模式基础（各工具可覆盖细节）
 *     进入全屏后固定视口；正常文档流不使用这些类
 * ------------------------------------------------------------------------- */
.is-fullscreen,
body:fullscreen,
body:-webkit-full-screen {
  background: var(--bg);
}

.is-fullscreen {
  position: fixed;
  inset: 0;
  z-index: 900;
  overflow: auto; /* 仅全屏投影时允许滚动，常规流不受影响 */
  border-radius: 0;
}

/* ---------------------------------------------------------------------------
 * 14. 打印
 * ------------------------------------------------------------------------- */
@media print {
  body { background: #fff !important; }
  .toolbar, .setup-panel, .stage-toolbar, .action-bar, .toast, .modal-mask,
  .btn-row, .actions, .controls, .button-group, .tool-topbar { display: none !important; }
  .main { display: block; padding: 0; }
  .stage, .panel, .card, .block {
    border: none;
    box-shadow: none;
    padding: 0;
    overflow: visible;
  }
}
`,
      "assets/js/frame-bridge.js": `/* ============================================================================
 * iframe 内工具桥 · frame-bridge.js
 * ============================================================================
 * 【背景】站点在 file://（离线双击 index.html）下无法用 fetch 读取工具页面
 * （Chromium 把 file:// 互相视为不透明源，fetch/XHR 一律被 CORS 拦截），于是
 * 所有自研工具回退为 <iframe> 兜底。跨源带来两个问题：
 *   ① 父页拿不到 iframe 的 contentDocument → 高度自适应失效，工具页被压成
 *      固定视口高度（"页面不能自动撑开"）；
 *   ② file:// 下 iframe 内的 requestFullscreen 被权限策略拒绝 → 工具右上角
 *      ⛶ 点了没反应（"全屏按钮不能用"）。
 *
 * 【方案】本脚本随工具页面一起被 iframe 加载（真实文档环境），通过
 * postMessage 向父页（站点外壳）上报：
 *   - height     ：工具内容实际高度（rAF 节流 + ResizeObserver 持续监听）；
 *   - fullscreen ：工具内部全屏请求被拒时，请父页对 <iframe> 本身发起全屏
 *                  （postMessage 会把 user activation 一并委托给父页；
 *                  父页若仍失败，再降级为父页侧 CSS 伪全屏）。
 *
 * 【安全阀】用 self !== top 判定「真实运行在 iframe 里」：
 *   - 独立双击打开工具页 → self === top → 本脚本整体空转；
 *   - 站点内嵌 Shadow DOM（http 适配器）路径下，脚本在 docShim/winShim 代理里
 *     执行，self/top 都落到真实顶层 window → self === top → 空转，
 *     不会向父页发任何消息；
 *   - 真实 iframe 内（含 file:// 跨源）→ self !== top → 激活。
 *   ⚠️ 不要用 window.frameElement 判定：跨源 iframe 里访问它会抛 SecurityError
 *     （实测），一旦 catch 成 null 桥就整体失效。
 *   ⚠️ self / top 属于跨源 WindowProxy 的「允许访问」属性（不会抛错），
 *     引用比较即可判定。
 * 消息一律带 __edutoolboxFrame 命名空间标记，父页校验 e.source 后才处理。
 * ========================================================================== */
(function () {
  "use strict";

  /* 只在真实 iframe 内激活 */
  var inFrame = false;
  try {
    var self = window.self, top = window.top;
    inFrame = !!(self && top && self !== top && window.parent && window.parent !== window);
  } catch (e) { inFrame = false; }
  if (!inFrame) return;

  var raf = 0;

  /** rAF 节流地把当前文档高度报给父页 */
  function reportHeight() {
    if (raf) return;
    raf = (window.requestAnimationFrame || function (f) { return setTimeout(f, 60); })(
      function () {
        raf = 0;
        try {
          var h = Math.max(
            document.documentElement ? document.documentElement.scrollHeight : 0,
            document.body ? document.body.scrollHeight : 0
          );
          window.parent.postMessage({
            __edutoolboxFrame: true,
            type: "height",
            h: h
          }, "*");
        } catch (e) { /* 父页不可达：静默 */ }
      }
    );
  }

  /** 工具内部全屏请求失败时，委托父页对 iframe 元素本身发起全屏 */
  function requestParentFullscreen() {
    try {
      window.parent.postMessage({
        __edutoolboxFrame: true,
        type: "fullscreen"
      }, "*");
    } catch (e) { /* 静默 */ }
  }

  /* 暴露给共享舞台模块（tool-stage-toolbar.js）在全屏失败分支调用 */
  window.EduToolFrameBridge = {
    reportHeight: reportHeight,
    requestParentFullscreen: requestParentFullscreen
  };

  /* 首帧 + load 后补报，防首报时内容未排完 */
  reportHeight();
  window.addEventListener("load", function () {
    reportHeight();
    setTimeout(reportHeight, 300);
  });

  /* 内容持续变化（点名记录增长、生成结果插入等）→ 宿主跟着长高 */
  if (typeof ResizeObserver === "function") {
    try {
      new ResizeObserver(reportHeight).observe(document.documentElement);
    } catch (e) { /* 老浏览器无此能力：靠 load 兜底 */ }
  }

  /* 父页通知重新测量（伪全屏退出后恢复常规高度） */
  window.addEventListener("message", function (e) {
    var d = e.data;
    if (d && d.__edutoolboxFrame === true && d.type === "report") reportHeight();
  });
})();
`,
      "tools/pdf-image-convert/pdf-image-convert.css": `/* ============================================================================
 * PDF 与图片转换 · pdf-image-convert.css
 * 仅包含本工具特有样式：文件信息条 / 选项组 / 进度条 / 图片排序列表 / 说明卡
 * 公共底座（wrap、head、tabs、tab、card、dropzone、radio、actions、btn、tip 等）
 *   见 tool-common.css
 * 高度策略：所有容器高度自动撑开，仅 body 主滚动条
 * ========================================================================== */

/* ---------------------------------------------------------------------------
 * 一、页头副标题与提示徽标
 * ------------------------------------------------------------------------- */
.head .sub { color: var(--text-2); font-size: 14px; line-height: 1.7; }
.head .notice {
  display: inline-block;
  margin-top: 10px;
  font-size: 12.5px;
}

/* Tab 面板：用 hidden 属性切换，.active 仅作初始标记，无需 display 规则 */

/* ---------------------------------------------------------------------------
 * 二、已选文件信息条
 * ------------------------------------------------------------------------- */
.file-bar {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
  margin-top: 16px;
  padding: 14px 18px;
  background: var(--card-bg-2);
  border: 1px solid var(--border);
  border-radius: var(--r);
}

.fb-icon { font-size: 24px; flex-shrink: 0; }

.fb-name {
  flex: 1;
  min-width: 0;
  font-weight: 600;
  color: var(--text-1);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.fb-meta {
  font-size: 13px;
  color: var(--text-3);
  flex-shrink: 0;
  font-variant-numeric: tabular-nums;
}

.fb-del {
  display: grid;
  place-items: center;
  width: 30px;
  height: 30px;
  flex-shrink: 0;
  font-size: 14px;
  color: var(--text-3);
  background: var(--card-bg);
  border: 1px solid var(--border);
  border-radius: 50%;
  cursor: pointer;
  transition: all var(--t-fast) var(--ease);
}
.fb-del:hover {
  color: var(--danger);
  border-color: #ffd4d4;
  background: #fff5f5;
}

/* ---------------------------------------------------------------------------
 * 三、选项组（格式 / 分辨率 / 页码范围 / 页面设置 / 边距）
 * ------------------------------------------------------------------------- */
.opts {
  display: flex;
  flex-direction: column;
  gap: 18px;
  margin-top: 18px;
}

/* 单选项中内嵌输入框（页码范围） */
.range-line {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}
.range-line input[type="text"] { max-width: 160px; }

/* ---------------------------------------------------------------------------
 * 四、进度条
 * ------------------------------------------------------------------------- */
.progress-box {
  margin-top: 18px;
  padding: 16px 18px;
  background: var(--card-bg-2);
  border: 1px solid var(--border);
  border-radius: var(--r);
}

.progress-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 10px;
  font-size: 13px;
  color: var(--text-2);
}
.progress-head span:last-child {
  font-weight: 700;
  color: var(--primary);
  font-variant-numeric: tabular-nums;
}

.progress {
  height: 10px;
  background: var(--primary-soft-2);
  border-radius: var(--r-pill);
  overflow: hidden;
}

.progress-bar {
  height: 100%;
  width: 0;
  background: var(--primary-grad);
  border-radius: var(--r-pill);
  transition: width .25s var(--ease);
}

/* ---------------------------------------------------------------------------
 * 五、图片排序列表（图片转 PDF）
 * ------------------------------------------------------------------------- */
.img-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 16px;
}

.img-item {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
  padding: 10px 14px;
  background: var(--card-bg-2);
  border: 1px solid var(--border);
  border-radius: var(--r);
}

.ii-idx {
  display: grid;
  place-items: center;
  width: 26px;
  height: 26px;
  flex-shrink: 0;
  font-size: 13px;
  font-weight: 700;
  color: var(--primary);
  background: var(--primary-soft);
  border-radius: 50%;
}

.ii-thumb {
  width: 48px;
  height: 48px;
  object-fit: cover;
  border-radius: var(--r-sm);
  border: 1px solid var(--border);
  flex-shrink: 0;
}

.ii-name {
  flex: 1;
  min-width: 120px;
  font-weight: 600;
  color: var(--text-1);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.ii-meta {
  font-size: 12.5px;
  color: var(--text-3);
  flex-shrink: 0;
  font-variant-numeric: tabular-nums;
}

.ii-btn {
  padding: 6px 12px;
  font-size: 12.5px;
  font-weight: 600;
  color: var(--text-2);
  background: var(--card-bg);
  border: 1px solid var(--border);
  border-radius: var(--r-pill);
  cursor: pointer;
  transition: all var(--t-fast) var(--ease);
  flex-shrink: 0;
}
.ii-btn:hover:not(:disabled) {
  color: var(--primary);
  border-color: var(--primary-soft-2);
  background: var(--primary-soft);
}
.ii-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}
.ii-btn.danger {
  color: var(--danger);
  border-color: #ffd4d4;
  background: #fff5f5;
}
.ii-btn.danger:hover {
  color: #fff;
  background: var(--danger);
  border-color: var(--danger);
}

/* ---------------------------------------------------------------------------
 * 六、说明卡（公共 .tip 提供左侧色条与底色，这里仅放宽内边距 + 列表项样式）
 * ------------------------------------------------------------------------- */
.card.tip { padding: 20px 22px; }

.tip ul {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-top: 8px;
}
.tip li {
  position: relative;
  padding-left: 18px;
  font-size: 13.5px;
  line-height: 1.7;
  color: var(--text-2);
}
.tip li::before {
  content: "•";
  position: absolute;
  left: 4px;
  color: var(--primary);
  font-weight: 700;
}

/* ---------------------------------------------------------------------------
 * 七、小屏微调
 * ------------------------------------------------------------------------- */
@media (max-width: 640px) {
  .img-item { gap: 8px; }
  .ii-name { min-width: 100px; }
}
`,
      "tools/pdf-image-convert/pdf-image-convert.js": `/**
 * PDF 与图片转换
 * A) pdf.js 逐页渲染 canvas → PNG/JPG（多页 JSZip 打包）
 * B) jsPDF 将多张图片按顺序合并为 PDF（适应图片尺寸 / A4）
 * worker 通过普通 script 预加载（file:// 下主线程兜底），再设置 workerSrc。
 */
"use strict";
(function () {
  // workerSrc 指向本地同版 worker；file:// 无法创建 Worker 时 pdf.js 会回退到全局 pdfjsWorker
  if (window.pdfjsLib) {
    pdfjsLib.GlobalWorkerOptions.workerSrc = "../../assets/vendor/pdf.worker.min.js";
  }

  /** 按 id 获取元素 */
  function $(id) { return document.getElementById(id); }

  /** 让出主线程刷新进度 */
  function nextTick() { return new Promise(function (r) { setTimeout(r, 10); }); }

  /** 触发浏览器下载 */
  function downloadBlob(blob, name) {
    var url = URL.createObjectURL(blob);
    var a = document.createElement("a");
    a.href = url; a.download = name;
    document.body.appendChild(a); a.click();
    setTimeout(function () { document.body.removeChild(a); URL.revokeObjectURL(url); }, 1000);
  }

  /** canvas 转 Blob（Promise 封装） */
  function canvasToBlob(canvas, type, quality) {
    return new Promise(function (resolve, reject) {
      canvas.toBlob(function (blob) {
        if (blob) resolve(blob);
        else reject(new Error("图片生成失败"));
      }, type, quality);
    });
  }

  /** 页码补零：1 → "01" */
  function pad(n) { return n < 10 ? "0" + n : String(n); }

  /**
   * 解析页码范围文本，如 "1-3,5"
   * @param {string} text 原始输入
   * @param {number} maxPage 总页数
   * @returns {number[]} 页码数组（已去重、升序）
   */
  function parseRanges(text, maxPage) {
    var result = [];
    var parts = String(text || "").split(/[,，;；]/).map(function (s) { return s.trim(); }).filter(Boolean);
    parts.forEach(function (p) {
      var m = p.match(/^(\\d+)\\s*[-–~]\\s*(\\d+)$/);
      var a, b;
      if (m) { a = parseInt(m[1], 10); b = parseInt(m[2], 10); }
      else if (/^\\d+$/.test(p)) { a = b = parseInt(p, 10); }
      else { throw new Error("无法识别的页码写法：" + p); }
      if (a < 1 || b < 1 || a > maxPage || b > maxPage) {
        throw new Error("页码超出范围（共 " + maxPage + " 页）：" + p);
      }
      if (a > b) { var t = a; a = b; b = t; }
      for (var i = a; i <= b; i++) { if (result.indexOf(i) < 0) result.push(i); }
    });
    result.sort(function (x, y) { return x - y; });
    if (!result.length) throw new Error("请填写页码范围，或选择全部页面");
    return result;
  }

  /* ==================== Tab 切换 ==================== */
  document.querySelectorAll(".tab").forEach(function (btn) {
    btn.addEventListener("click", function () {
      document.querySelectorAll(".tab").forEach(function (b) { b.classList.toggle("active", b === btn); });
      var key = btn.getAttribute("data-tab");
      $("panel-pdf2img").hidden = key !== "pdf2img";
      $("panel-img2pdf").hidden = key !== "img2pdf";
    });
  });

  /* ==================== A) PDF 转图片 ==================== */
  var currentPdf = null;   // {name, buf, pageCount, doc}
  var rendering = false;

  var pdfDropzone = $("pdfDropzone");
  var pdfInput = $("pdfInput");

  /** 加载并解析 PDF，显示页数 */
  async function loadPdf(file) {
    if (!/\\.pdf$/i.test(file.name) && file.type !== "application/pdf") {
      alert("请选择 .pdf 文件"); return;
    }
    resetPdfView();
    $("renderStatus").textContent = "正在读取 PDF…";
    try {
      var buf = await file.arrayBuffer();
      var task = pdfjsLib.getDocument({ data: new Uint8Array(buf), isEvalSupported: false });
      var doc = await task.promise;
      currentPdf = { name: file.name, buf: buf, pageCount: doc.numPages, doc: doc };
      $("pdfInfo").hidden = false;
      $("pdfOpts").hidden = false;
      $("pdfName").textContent = file.name;
      $("pdfMeta").textContent = "共 " + doc.numPages + " 页";
      $("renderProgress").hidden = true;
    } catch (err) {
      alert("PDF 打开失败：" + (err && err.message ? err.message : "文件可能已损坏或加密"));
      resetPdfView();
    }
  }

  /** 清空 PDF 界面状态 */
  function resetPdfView() {
    currentPdf = null;
    $("pdfInfo").hidden = true;
    $("pdfOpts").hidden = true;
    $("renderProgress").hidden = true;
    $("renderBar").style.width = "0";
    $("renderPct").textContent = "0%";
  }

  pdfDropzone.addEventListener("click", function (e) {
    if (e.target.tagName !== "BUTTON" && !rendering) pdfInput.click();
  });
  $("pdfPickBtn").addEventListener("click", function () { pdfInput.click(); });
  pdfInput.addEventListener("change", function () {
    if (pdfInput.files[0]) loadPdf(pdfInput.files[0]);
    pdfInput.value = "";
  });
  ["dragenter", "dragover"].forEach(function (ev) {
    pdfDropzone.addEventListener(ev, function (e) { e.preventDefault(); pdfDropzone.classList.add("dragover"); });
  });
  ["dragleave", "drop"].forEach(function (ev) {
    pdfDropzone.addEventListener(ev, function (e) {
      e.preventDefault();
      if (ev === "dragleave" && pdfDropzone.contains(e.relatedTarget)) return;
      pdfDropzone.classList.remove("dragover");
      if (ev === "drop" && e.dataTransfer.files[0]) loadPdf(e.dataTransfer.files[0]);
    });
  });
  $("pdfRemove").addEventListener("click", resetPdfView);

  // 页码范围单选与输入框联动
  document.querySelectorAll('input[name="rangeMode"]').forEach(function (r) {
    r.addEventListener("change", function () {
      $("pageRange").disabled = document.querySelector('input[name="rangeMode"]:checked').value !== "custom";
      if (!$("pageRange").disabled) $("pageRange").focus();
    });
  });

  /** 逐页渲染并下载（多页打包 zip） */
  $("renderBtn").addEventListener("click", async function () {
    if (!currentPdf || rendering) return;
    var fmt = document.querySelector('input[name="imgFmt"]:checked').value;
    var scale = parseInt(document.querySelector('input[name="scale"]:checked').value, 10);
    var rangeMode = document.querySelector('input[name="rangeMode"]:checked').value;

    var pages;
    try {
      pages = rangeMode === "all"
        ? Array.from({ length: currentPdf.pageCount }, function (_, i) { return i + 1; })
        : parseRanges($("pageRange").value, currentPdf.pageCount);
    } catch (err) { alert(err.message); return; }

    rendering = true;
    this.disabled = true;
    var mime = fmt === "jpg" ? "image/jpeg" : "image/png";
    var ext = fmt === "jpg" ? "jpg" : "png";
    $("renderProgress").hidden = false;
    var blobs = [];   // {name, blob}

    try {
      for (var i = 0; i < pages.length; i++) {
        var pageNo = pages[i];
        $("renderStatus").textContent = "正在渲染第 " + pageNo + " 页（" + (i + 1) + "/" + pages.length + "）";
        var page = await currentPdf.doc.getPage(pageNo);
        var viewport = page.getViewport({ scale: scale });
        var canvas = document.createElement("canvas");
        canvas.width = Math.floor(viewport.width);
        canvas.height = Math.floor(viewport.height);
        var ctx = canvas.getContext("2d");
        // JPG 无透明通道，先铺白底
        if (fmt === "jpg") { ctx.fillStyle = "#fff"; ctx.fillRect(0, 0, canvas.width, canvas.height); }
        await page.render({ canvasContext: ctx, viewport: viewport }).promise;
        var blob = await canvasToBlob(canvas, mime, 0.92);
        blobs.push({ name: "page_" + pad(pageNo) + "." + ext, blob: blob });

        var pct = Math.round(((i + 1) / pages.length) * 100);
        $("renderBar").style.width = pct + "%";
        $("renderPct").textContent = pct + "%";
        await nextTick();
      }

      $("renderStatus").textContent = "正在打包下载…";
      if (blobs.length === 1) {
        downloadBlob(blobs[0].blob, blobs[0].name);
      } else {
        var zip = new JSZip();
        blobs.forEach(function (b) { zip.file(b.name, b.blob); });
        var zipBlob = await zip.generateAsync({ type: "blob", compression: "DEFLATE" });
        downloadBlob(zipBlob, "图片.zip");
      }
      $("renderStatus").textContent = "完成，已输出 " + blobs.length + " 张图片";
    } catch (err) {
      $("renderStatus").textContent = "转换失败：" + (err && err.message ? err.message : err);
      alert("转换失败：" + (err && err.message ? err.message : err));
    } finally {
      rendering = false;
      $("renderBtn").disabled = false;
    }
  });

  /* ==================== B) 图片转 PDF ==================== */
  var imgItems = [];   // {name,dataUrl,fmt,w,h}
  var building = false;

  var imgDropzone = $("imgDropzone");
  var imgInput = $("imgInput");
  var imgList = $("imgList");

  /** 文件读取为 dataURL（Promise） */
  function readDataUrl(file) {
    return new Promise(function (resolve, reject) {
      var fr = new FileReader();
      fr.onload = function () { resolve(fr.result); };
      fr.onerror = function () { reject(new Error("读取失败")); };
      fr.readAsDataURL(file);
    });
  }

  /** 由 dataURL 加载图片取得像素尺寸 */
  function loadImageEl(dataUrl) {
    return new Promise(function (resolve, reject) {
      var im = new Image();
      im.onload = function () { resolve(im); };
      im.onerror = function () { reject(new Error("图片解码失败")); };
      im.src = dataUrl;
    });
  }

  /** 添加图片：过滤格式、去重、读取尺寸后渲染列表 */
  async function addImages(files) {
    var accepted = Array.prototype.filter.call(files, function (f) {
      return /\\.(jpe?g|png)$/i.test(f.name) || f.type === "image/jpeg" || f.type === "image/png";
    });
    if (files.length - accepted.length > 0) alert("仅支持 JPG / PNG 图片，部分文件已忽略");
    if (!accepted.length || building) return;

    for (var i = 0; i < accepted.length; i++) {
      var f = accepted[i];
      if (imgItems.some(function (x) { return x.name === f.name && x.size === f.size; })) continue;
      try {
        var dataUrl = await readDataUrl(f);
        var im = await loadImageEl(dataUrl);
        var isPng = f.type === "image/png" || /\\.png$/i.test(f.name);
        imgItems.push({
          name: f.name, size: f.size, dataUrl: dataUrl,
          fmt: isPng ? "PNG" : "JPEG", w: im.naturalWidth, h: im.naturalHeight
        });
      } catch (err) {
        alert("「" + f.name + "」读取失败，已跳过");
      }
    }
    renderImgList();
  }

  /** 渲染图片排序列表 */
  function renderImgList() {
    imgList.innerHTML = "";
    $("imgOpts").hidden = imgItems.length === 0;
    imgItems.forEach(function (item, idx) {
      var li = document.createElement("li");
      li.className = "img-item";

      var no = document.createElement("span");
      no.className = "ii-idx"; no.textContent = idx + 1;

      var thumb = document.createElement("img");
      thumb.className = "ii-thumb"; thumb.src = item.dataUrl; thumb.alt = "";

      var name = document.createElement("span");
      name.className = "ii-name"; name.textContent = item.name; name.title = item.name;

      var meta = document.createElement("span");
      meta.className = "ii-meta"; meta.textContent = item.w + "×" + item.h;

      var up = document.createElement("button");
      up.className = "ii-btn"; up.textContent = "↑ 上移"; up.disabled = idx === 0;
      up.onclick = function () {
        var t = imgItems[idx - 1]; imgItems[idx - 1] = imgItems[idx]; imgItems[idx] = t;
        renderImgList();
      };
      var down = document.createElement("button");
      down.className = "ii-btn"; down.textContent = "↓ 下移"; down.disabled = idx === imgItems.length - 1;
      down.onclick = function () {
        var t = imgItems[idx + 1]; imgItems[idx + 1] = imgItems[idx]; imgItems[idx] = t;
        renderImgList();
      };
      var del = document.createElement("button");
      del.className = "ii-btn danger"; del.textContent = "删除";
      del.onclick = function () { imgItems.splice(idx, 1); renderImgList(); };

      li.appendChild(no); li.appendChild(thumb); li.appendChild(name); li.appendChild(meta);
      li.appendChild(up); li.appendChild(down); li.appendChild(del);
      imgList.appendChild(li);
    });
  }

  imgDropzone.addEventListener("click", function (e) {
    if (e.target.tagName !== "BUTTON" && !building) imgInput.click();
  });
  $("imgPickBtn").addEventListener("click", function () { imgInput.click(); });
  imgInput.addEventListener("change", function () {
    addImages(imgInput.files);
    imgInput.value = "";
  });
  ["dragenter", "dragover"].forEach(function (ev) {
    imgDropzone.addEventListener(ev, function (e) { e.preventDefault(); imgDropzone.classList.add("dragover"); });
  });
  ["dragleave", "drop"].forEach(function (ev) {
    imgDropzone.addEventListener(ev, function (e) {
      e.preventDefault();
      if (ev === "dragleave" && imgDropzone.contains(e.relatedTarget)) return;
      imgDropzone.classList.remove("dragover");
      if (ev === "drop") addImages(e.dataTransfer.files);
    });
  });

  $("imgClearBtn").addEventListener("click", function () {
    if (building) return;
    imgItems = [];
    renderImgList();
    $("pdfProgress").hidden = true;
  });

  /** 根据图片列表生成 PDF 并下载 */
  $("buildPdfBtn").addEventListener("click", async function () {
    if (!imgItems.length || building) return;
    var pageMode = document.querySelector('input[name="pageMode"]:checked').value;
    var margin = parseInt(document.querySelector('input[name="margin"]:checked').value, 10); // mm

    building = true;
    this.disabled = true;
    $("pdfProgress").hidden = false;
    $("pdfBar").style.width = "0";
    $("pdfPct").textContent = "0%";

    try {
      var pdf = null;
      for (var i = 0; i < imgItems.length; i++) {
        var im = imgItems[i];
        var landscape = im.w > im.h;
        var orient = landscape ? "l" : "p";
        var x, y, drawW, drawH, pageW, pageH, unit;

        if (pageMode === "a4") {
          // A4：短边 210mm、长边 297mm，方向随图片
          unit = "mm";
          pageW = landscape ? 297 : 210;
          pageH = landscape ? 210 : 297;
          var availW = pageW - margin * 2;
          var availH = pageH - margin * 2;
          // 按图片实际像素比例等比缩放
          var scale = Math.min(availW / im.w, availH / im.h);
          drawW = im.w * scale;
          drawH = im.h * scale;
          x = (pageW - drawW) / 2;
          y = (pageH - drawH) / 2;
        } else {
          // 适应图片：以像素值作为 pt（72dpi 下图片像素与点一一对应），页面与图等大
          unit = "pt";
          pageW = im.w; pageH = im.h;
          drawW = im.w; drawH = im.h;
          x = 0; y = 0;
        }

        if (!pdf) {
          pdf = new window.jspdf.jsPDF({ orientation: orient, unit: unit, format: pageMode === "a4" ? "a4" : [pageW, pageH] });
        } else {
          pdf.addPage(pageMode === "a4" ? "a4" : [pageW, pageH], orient);
        }
        // 白底（保证 PNG 透明区域呈现白色）
        pdf.setFillColor(255, 255, 255);
        pdf.rect(0, 0, pageW, pageH, "F");
        pdf.addImage(im.dataUrl, im.fmt, x, y, drawW, drawH, undefined, "FAST");

        var pct = Math.round(((i + 1) / imgItems.length) * 100);
        $("pdfStatus").textContent = "正在生成第 " + (i + 1) + " / " + imgItems.length + " 页";
        $("pdfBar").style.width = pct + "%";
        $("pdfPct").textContent = pct + "%";
        await nextTick();
      }
      $("pdfStatus").textContent = "正在保存 PDF…";
      pdf.save("图片合并.pdf");
      $("pdfStatus").textContent = "完成，已下载 图片合并.pdf";
    } catch (err) {
      $("pdfStatus").textContent = "生成失败：" + (err && err.message ? err.message : err);
      alert("生成 PDF 失败：" + (err && err.message ? err.message : err));
    } finally {
      building = false;
      $("buildPdfBtn").disabled = false;
    }
  });
})();
`
    },
    meta: {builtAt: "2026-09-28 11:07:05", sources: {"tools/pdf-image-convert/pdf-image-convert.css": "dec1f87b059e", "assets/css/tool-common.css": "d35dcf222690", "assets/js/frame-bridge.js": "1131903c1e46", "tools/pdf-image-convert/pdf-image-convert.js": "e62d5efe096b"}}
  };
})();