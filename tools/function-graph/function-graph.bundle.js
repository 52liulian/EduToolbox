/* 自动生成，请勿手改 —— 源：tools/function-graph/  ·  构建：2026-09-28 11:07:05 */
/* 用途：file:// 离线场景下 fetch 被 CORS 拦截，站点改用 <script src> 加载本文件，
   拿到工具页面与本地 CSS/JS 文本后走与 http 相同的 Shadow DOM 组件化挂载。
   工具源码改动后请重跑：python .workbuddy/scripts/build_tool_bundles.py */
(function(){
  var g = window.EduToolboxToolBundles || (window.EduToolboxToolBundles = {});
  g["function-graph"] = {
    html: `<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>函数绘图 | EduToolbox · 函数图像绘制<\/title>
<link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ctext y='.9em' font-size='90'%3E%F0%9F%8E%93%3C/text%3E%3C/svg%3E">
<link rel="stylesheet" href="function-graph.css">
<link rel="stylesheet" href="../../assets/css/tool-common.css">
<\/head>
<body>

<!-- 主体容器 -->
<main class="container">
  <div class="layout" id="graphLayout">
    <!-- 左侧：函数与曲线设置 -->
    <aside class="card side-card">
      <div class="card-head">
        <h3 class="card-title">函数与曲线设置<\/h3>
        <button type="button" class="btn btn-mini" id="btnExample" title="载入默认示例">查看示例<\/button>
      <\/div>

      <!-- 绘图模式切换 -->
      <div class="field-row">
        <span class="field-label">绘图模式<\/span>
        <div class="seg-group" id="modeGroup">
          <button type="button" class="seg-btn active" data-mode="func">函数模式<\/button>
          <button type="button" class="seg-btn" data-mode="param">参数曲线<\/button>
        <\/div>
      <\/div>

      <!-- 函数输入列表 -->
      <div class="field-row">
        <span class="field-label">函数表达式<\/span>
      <\/div>
      <div class="func-list" id="funcList"><!-- 函数行由脚本生成 --><\/div>
      <button type="button" class="btn btn-add" id="btnAdd">➕ 添加函数<\/button>

      <!-- 范围设置 -->
      <div class="field-row range-block">
        <span class="field-label">X 轴范围<\/span>
        <div class="range-pair">
          <input type="number" class="num-input" id="xMin" value="-10" step="any">
          <span class="range-sep">至<\/span>
          <input type="number" class="num-input" id="xMax" value="10" step="any">
        <\/div>
      <\/div>
      <div class="field-row range-block">
        <span class="field-label">Y 轴范围<\/span>
        <label class="check-inline">
          <input type="checkbox" id="yAuto" checked>
          <span>自动计算<\/span>
        <\/label>
      <\/div>
      <div class="field-row range-block" id="yManualRow">
        <div class="range-pair">
          <input type="number" class="num-input" id="yMin" value="-10" step="any">
          <span class="range-sep">至<\/span>
          <input type="number" class="num-input" id="yMax" value="10" step="any">
        <\/div>
      <\/div>

      <!-- 绘图参数 -->
      <div class="field-row">
        <span class="field-label">采样点数<\/span>
        <input type="number" class="num-input num-wide" id="samples" value="801" min="51" max="5001" step="50">
      <\/div>
      <div class="field-row">
        <span class="field-label">线宽度<\/span>
        <input type="number" class="num-input num-wide" id="lineWidth" value="2" min="0.5" max="8" step="0.1">
      <\/div>

      <!-- 显示选项 -->
      <div class="field-row check-grid">
        <label class="check-inline"><input type="checkbox" id="optGrid" checked><span>显示网格<\/span><\/label>
        <label class="check-inline"><input type="checkbox" id="optAxis" checked><span>显示坐标轴<\/span><\/label>
        <label class="check-inline"><input type="checkbox" id="optKey"><span>显示关键点<\/span><\/label>
        <label class="check-inline"><input type="checkbox" id="optFill"><span>填充曲线下方<\/span><\/label>
        <label class="check-inline"><input type="checkbox" id="optAnim"><span>显示动画<\/span><\/label>
      <\/div>

      <div class="field-row" id="animDurationRow">
        <span class="field-label">动画时长 (ms)<\/span>
        <input type="number" class="num-input num-wide" id="animDuration" value="3000" min="200" max="10000" step="100">
      <\/div>
    <\/aside>

    <!-- 右侧：函数图像预览 -->
    <section class="card graph-card">
      <!-- 舞台右上角工具栏：⛶ 全屏 / ⚙ 隐藏设置（由共享模块 tool-stage-toolbar.js 接管） -->
      <div class="stage-toolbar">
        <button type="button" class="icon-btn" id="fullscreenBtn" title="全屏">⛶<\/button>
        <button type="button" class="icon-btn" id="hideSetupBtn" title="隐藏设置">⚙<\/button>
      <\/div>
      <div class="graph-toolbar">
        <div class="tool-group">
          <button type="button" class="btn btn-small" id="btnZoomIn">🔍＋ 放大<\/button>
          <button type="button" class="btn btn-small" id="btnZoomOut">🔍－ 缩小<\/button>
          <button type="button" class="btn btn-small" id="btnCenter">🎯 居中<\/button>
          <button type="button" class="btn btn-small" id="btnReset">↩️ 复位<\/button>
          <button type="button" class="btn btn-small btn-primary" id="btnGenerate">⚡ 生成图像<\/button>
          <button type="button" class="btn btn-small" id="btnExport">🖼️ 导出 PNG<\/button>
        <\/div>
        <div class="range-info" id="rangeInfo"><\/div>
      <\/div>
      <div class="canvas-wrap" id="canvasWrap">
        <canvas id="graphCanvas"><\/canvas>
        <div class="hint">💡 鼠标滚轮以指针为锚点缩放，按住左键拖拽平移<\/div>
        <div class="live-coord" id="liveCoord" hidden><\/div>
      <\/div>
      <div class="expr-hints">
        <strong>表达式提示：<\/strong>
        支持 <code>sin<\/code> <code>cos<\/code> <code>tan<\/code> <code>log<\/code> <code>ln<\/code> <code>sqrt<\/code> <code>abs<\/code> <code>exp<\/code> <code>pow<\/code> <code>pi<\/code> <code>e<\/code>，
        乘法请显式输入 <code>*<\/code>，幂运算用 <code>x^2<\/code> 或 <code>pow(x,2)<\/code>。
      <\/div>
    <\/section>
  <\/div>
<\/main>

<script src="../../assets/js/frame-bridge.js"><\/script>
<script src="../../assets/js/tool-stage-toolbar.js"><\/script>
<script src="function-graph.js"><\/script>
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
      "assets/js/tool-stage-toolbar.js": `/* ============================================================================
 * 舞台右上角工具栏（共享模块）· tool-stage-toolbar.js
 *
 * 【约定】
 *   1. 本模块只做两件事：舞台全屏（对 stage 元素自身，不是整页）与设置栏显隐。
 *      它不认识任何具体工具的业务，也不读写 localStorage。
 *   2. 结构与「随机叫号 random-call」保持一致：舞台内第一个子元素为
 *      <div class="stage-toolbar">，内含且仅含两个 .icon-btn，顺序固定为
 *      #fullscreenBtn(⛶ 全屏) → #hideSetupBtn(⚙ 隐藏设置)。
 *      .stage-toolbar / .icon-btn 的基础样式由 assets/css/tool-common.css 提供。
 *   3. 隐藏机制：给「双栏容器」（panelHost）加/去 hiddenClass，由各工具 css 把
 *      带该 class 的容器改成单栏并 display:none 掉 .setup-panel。
 *   4. 【全屏专属模式】#hideSetupBtn 是可选的。很多工具（计时器、秒表、板书、
 *      噪音检测等）根本没有可隐藏的设置栏，只有 ⛶ 一个按钮。此时只接全屏，
 *      不做任何显隐操作 —— 否则「进入全屏自动隐藏、却没有按钮能调回来」会
 *      把界面改坏。判定：只有 host 与 hideBtn 同时存在才启用自动隐藏。
 *
 * 【用法】
 *   在工具的 <script src="<slug>.js"> 之前引入本文件，然后在工具自身的
 *   初始化函数里调用：
 *
 *     if (window.EduToolStageToolbar) {
 *       EduToolStageToolbar.init({ stage: ".stage-panel", panelHost: ".workbench" });
 *     }
 *
 *   三个可选参数（缺省即下面 DEFAULTS 的值）：
 *     stage       —— 舞台元素选择器，进入全屏的 target，也是工具栏的挂载父级
 *     panelHost   —— 承载 hiddenClass 的双栏容器选择器
 *     hiddenClass —— 隐藏态 class 名（与 random-call 一致用 "setup-hidden"）
 *
 * 【健壮性】
 *   - 找不到 stage / panelHost / 任一按钮时静默返回，绝不抛异常（工具页可能
 *     被站点适配器裁剪或降级渲染）。
 *   - 全屏请求同时处理「同步抛错」与「Promise 拒绝」两种失败形态；失败时把设置
 *     栏显隐回滚到发起请求前的状态，避免界面被改坏或产生未处理的 rejection。
 *   - 所有 DOM 查询走 document.querySelector，以适配站点 Shadow DOM 适配器；
 *     禁止 window.top / parent / documentElement.requestFullscreen。
 * ========================================================================== */
(function (global) {
  "use strict";

  /** 默认配置：与 random-call 的命名保持一致 */
  var DEFAULTS = {
    stage: ".stage-panel",
    panelHost: ".workbench",
    hiddenClass: "setup-hidden"
  };

  /**
   * 合并配置（浅拷贝，缺省值兜底）
   * @param {Object|undefined} opts 调用方传入的选项
   * @returns {{stage:string, panelHost:string, hiddenClass:string}} 合并后的配置
   */
  function mergeOptions(opts) {
    var o = opts || {};
    return {
      stage: typeof o.stage === "string" && o.stage ? o.stage : DEFAULTS.stage,
      /* panelHost 传 null 或 "" 表示「本工具没有可隐藏的设置栏」——
         设置区是浮层/弹窗的工具（如倒计时）用这个显式声明，避免误命中默认值。 */
      panelHost: (o.panelHost === null || o.panelHost === "")
        ? ""
        : (typeof o.panelHost === "string" && o.panelHost ? o.panelHost : DEFAULTS.panelHost),
      hiddenClass: typeof o.hiddenClass === "string" && o.hiddenClass ? o.hiddenClass : DEFAULTS.hiddenClass
    };
  }

  /**
   * 调用一个可能「同步抛错」或「返回 rejected Promise」的方法，两种失败都吞掉。
   * @param {Function|undefined} fn 待调用的方法
   * @param {Object} ctx this 指向
   * @returns {boolean} 是否成功发起（未同步抛错）
   */
  function callQuietly(fn, ctx) {
    if (typeof fn !== "function") return false;
    try {
      var p = fn.call(ctx);
      if (p && typeof p.catch === "function") p.catch(function () { /* 静默：权限/手势被拒 */ });
      return true;
    } catch (err) {
      return false;
    }
  }

  /**
   * 取得「本工具自己的」document。
   *
   * ⚠️ 历史缺陷（2026-09-22）：早期实现写成 \`global.document\`。站点适配器是
   * 通过 \`new Function("document","window", code)\` 执行脚本的 —— 词法上的
   * \`document\` 形参才是限定在影子树内的 docShim，而 \`window.document\` 会退回
   * 真实文档，导致 querySelector 找不到 .stage-panel，init() 静默返回 false，
   * 两个按钮完全无反应（仅在「站点内嵌」路径复现，单独打开工具页正常）。
   * 因此这里优先取词法 document，取不到再回退 global。
   * @returns {Document|null} 文档对象
   */
  function resolveDoc(global) {
    try {
      if (typeof document !== "undefined" && document) return document;
    } catch (e) { /* 自由变量不存在：继续回退 */ }
    try {
      return global && global.document ? global.document : null;
    } catch (e) {
      return null;
    }
  }

  /**
   * 当前是否处于全屏状态（兼容 webkit 前缀）
   * @param {Document} doc 文档对象
   * @returns {boolean} 是否已全屏
   */
  function isFullscreen(doc) {
    return !!(doc && (doc.fullscreenElement || doc.webkitFullscreenElement));
  }

  /**
   * 按 v 的布尔值增删 class
   * @param {Element} el 目标元素
   * @param {string} cls class 名
   * @param {boolean} v true 加 / false 去
   * @returns {void}
   */
  function setHidden(el, cls, v) {
    if (v) el.classList.add(cls);
    else el.classList.remove(cls);
  }

  /**
   * 注册 fullscreenchange：同一目标只保留一个 handler，避免重复 init 叠加监听。
   * @param {Array<object>} targets 监听目标（可能同时含 shim 与真实 document）
   * @param {Function} handler 事件处理函数
   * @returns {void}
   */
  function listenChange(targets, handler) {
    for (var i = 0; i < targets.length; i++) {
      var t = targets[i];
      if (!t) continue;
      var prev = registered ? registered.get(t) : null;
      if (prev && prev !== handler) {
        try { t.removeEventListener("fullscreenchange", prev); } catch (e) { /* 忽略 */ }
        try { t.removeEventListener("webkitfullscreenchange", prev); } catch (e) { /* 忽略 */ }
      }
      t.addEventListener("fullscreenchange", handler);
      t.addEventListener("webkitfullscreenchange", handler);
      if (registered) registered.set(t, handler);
    }
  }

  /** 已注册的 fullscreenchange handler：目标对象 → handler */
  var registered = typeof WeakMap === "function" ? new WeakMap() : null;

  /* ------------------------------------------------------------------
   * 【iframe 独占模式（solo）】
   * file:// 下 iframe 内全屏被拒，由父页对 <iframe> 本身全屏。此时如果不加
   * 处理，全屏画面是「整个工具页」（含左侧设置栏），不是舞台。父页在发起
   * 全屏前会 postMessage {__edutoolboxFrame,type:'fs-enter'}，本模块收到后
   * 给舞台加 .edutf-solo（fixed 铺满 iframe 视口），退出时移除。
   * 直接监听 window message：iframe 内共享模块能收到父页发给 iframe 的消息；
   * 同文档挂载（站点适配器）下父页不会发这种消息，监听器永远空转，无害。
   * ------------------------------------------------------------------ */
  var soloCssDone = false;
  /** 最近一次 init() 成功注册的舞台元素（模块级：iframe 独占消息处理需要）。
   *  ⚠️ 不能在 onFrameFsMessage 里直接引用 init 作用域的 stage —— strict 模式下
   *  未声明变量抛 ReferenceError，solo 永远加不上（zhongkao 实测踩坑：
   *  random-call 侥幸生效只是因为它恰好在 window 上有同名全局变量）。 */
  var currentStage = null;
  function ensureSoloCss() {
    if (soloCssDone) return;
    soloCssDone = true;
    try {
      var st = document.createElement("style");
      /* ⚠️ 尺寸用 100vw/100vh 而不是 100%：solo 模式下工具 body 里被盖住的
         内容若超高会产生滚动条，100% 会被滚动条挤掉一截（实测右侧留 10px 缝）；
         vw/vh 含滚动条槽，舞台整体铺满且把滚动条压在底下。 */
      st.textContent =
        ".edutf-solo{position:fixed!important;inset:0!important;z-index:2147483000!important;" +
        "width:100vw!important;height:100vh!important;max-width:none!important;min-height:0!important;" +
        "margin:0!important;border:none!important;border-radius:0!important;box-shadow:none!important;}";
      (document.head || document.documentElement).appendChild(st);
    } catch (err) { /* 静默 */ }
  }

  function onFrameFsMessage(e) {
    var d = e.data;
    if (!d || d.__edutoolboxFrame !== true) return;
    if (d.type === "fs-enter") {
      ensureSoloCss();
      if (currentStage) currentStage.classList.add("edutf-solo");
    } else if (d.type === "fs-exit") {
      if (currentStage) currentStage.classList.remove("edutf-solo");
    }
  }
  try { global.addEventListener("message", onFrameFsMessage, false); } catch (err) { /* 静默 */ }

  /**
   * 初始化舞台工具栏
   * @param {Object} [opts] {stage, panelHost, hiddenClass}
   * @returns {boolean} 是否成功初始化
   */
  function init(opts) {
    var doc = resolveDoc(global);
    if (!doc) return false;

    var cfg = mergeOptions(opts);
    var stage = doc.querySelector(cfg.stage);
    var host = cfg.panelHost ? doc.querySelector(cfg.panelHost) : null;
    /* 统一用 querySelector：站点 Shadow DOM 适配器会把 document 查询限定到 shadow 内部 */
    var fsBtn = doc.querySelector("#fullscreenBtn");
    var hideBtn = doc.querySelector("#hideSetupBtn");

    /* 结构不齐（页面被裁剪 / 降级渲染）时静默退出，不影响工具其它功能。
       #hideSetupBtn 允许缺失：见文件头约定 4「全屏专属模式」。 */
    if (!stage || !fsBtn) return false;
    currentStage = stage;  // 供 onFrameFsMessage（iframe 独占）使用

    /* 只有「双栏容器」与「设置按钮」都在，才启用进入全屏自动隐藏设置栏 ——
       否则用户进了全屏就再也调不回设置栏了。 */
    var canHide = !!(host && hideBtn);

    /**
     * 进入全屏「之前」设置栏的显隐快照。
     * 退出全屏时按它还原，而不是按全屏中最后看到的状态 —— 这样即便用户在全屏里
     * 手动把设置栏调出来，退出后也会回到进入前的样子。
     */
    var wasHidden = false;

    /** 隐藏/还原设置栏（无设置栏时是空操作） */
    function applyHidden(v) {
      if (!canHide) return;
      setHidden(host, cfg.hiddenClass, v);
    }

  /**
   * 全屏请求失败后的兜底：若本工具正以 iframe 形式内嵌在站点里（file:// 离线
   * 场景下 iframe 内的 requestFullscreen 会被权限策略拒绝），通过 frame-bridge.js
   * 请父页（站点外壳）对 iframe 元素本身发起全屏。非内嵌场景桥不存在，空操作。
   * @param {Element} stage 舞台元素（仅用于签名，桥不需要）
   * @returns {void}
   */
  function bridgeFallback() {
    try {
      var b = global.EduToolFrameBridge;
      if (b && typeof b.requestParentFullscreen === "function") b.requestParentFullscreen();
    } catch (err) { /* 静默 */ }
  }

  /**
   * 切换舞台全屏：目标是 stage 元素自身
   * @returns {void}
   */
  function toggleFullscreen() {
    if (isFullscreen(doc)) {
      var exit = doc.exitFullscreen || doc.webkitExitFullscreen;
      callQuietly(exit, doc);
      return;
    }
    /* 先快照再乐观隐藏：进入全屏后画面立刻铺满，不等 fullscreenchange */
    wasHidden = canHide ? host.classList.contains(cfg.hiddenClass) : false;
    applyHidden(true);

    /* 只发起一次请求；同步抛错与异步 Promise 拒绝都要能回滚 */
    var request = stage.requestFullscreen || stage.webkitRequestFullscreen;
    var ok = false;
    try {
      if (request) {
        var p = request.call(stage);
        ok = true;
        /* 异步失败（权限策略拒绝 / 缺少用户手势）→ 在 catch 里回滚 */
        if (p && typeof p.catch === "function") {
          p.catch(function () { applyHidden(wasHidden); bridgeFallback(); });
        }
      }
    } catch (err) {
      ok = false;
    }
    /* 同步失败（方法缺失 / 直接抛错）→ 立刻回滚 */
    if (!ok) { applyHidden(wasHidden); bridgeFallback(); }
  }

    /**
     * 全屏状态变化：进入时确保隐藏，退出时按快照还原
     * @returns {void}
     */
    var onChange = function () {
      if (!canHide) return;
      if (isFullscreen(doc)) setHidden(host, cfg.hiddenClass, true);
      else setHidden(host, cfg.hiddenClass, wasHidden);
    };

    /* 站点适配器把 document 代理成 ShadowRoot，其 addEventListener 也绑在影子树上；
       而 fullscreenchange 派发在「真实 document」上、不会向下穿透进影子树。
       因此除 shim 之外，再在 stage.ownerDocument（即真实文档）上注册一份，
       保证「直开页面」与「站点内嵌」两种加载方式都能拿到退出全屏事件。
       直开模式下二者是同一个对象，listenChange 只会注册一次，不会重复触发。 */
    var realDoc = stage.ownerDocument || null;
    var targets = (realDoc && realDoc !== doc) ? [doc, realDoc] : [doc];
    listenChange(targets, onChange);

    fsBtn.addEventListener("click", toggleFullscreen);
    if (canHide) {
      hideBtn.addEventListener("click", function () {
        host.classList.toggle(cfg.hiddenClass);
      });
    }

    return true;
  }

  /* 只暴露一个全局，不污染其它命名空间 */
  global.EduToolStageToolbar = { init: init };
})(typeof window !== "undefined" ? window : this);
`,
      "tools/function-graph/function-graph.css": `/* ============================================================================
 * 函数绘图 · function-graph.css
 * 仅包含本工具特有样式：双栏布局 / 函数行列表 / 颜色+启用+表达式输入 /
 *                       范围设置 / 画布容器 / 工具栏 / 实时坐标 / 表达式提示
 * 公共底座（reset、按钮、卡片、表单、seg-group、check-inline）见 tool-common.css
 * 高度策略：画布固定 480px 高（CSS 像素），其余容器高度自动撑开；
 *           仅 body 主滚动条；函数列表自然向下扩展
 * ========================================================================== */

/* ---------------------------------------------------------------------------
 * 一、覆盖 .layout：本工具需要左侧固定栏 + 右侧主区
 * 【重要】tool-common.css 在本文件之后加载，其 \`.layout{grid-template-columns:minmax(0,1fr)}\`
 * 与本声明同特异性（0-1-0），后加载者会把它压成单栏（实测三场景均为单栏）。
 * 因此必须用更高特异性的 \`.container .layout\`（0-2-0）才能稳定保持左右分栏。
 * ------------------------------------------------------------------------- */
#app .layout,
main.container .layout,
.container .layout {
  display: grid;
  grid-template-columns: 320px minmax(0, 1fr);
  gap: 20px;
  max-width: 1320px;
}

@media (max-width: 900px) {
  #app .layout,
  main.container .layout,
  .container .layout { grid-template-columns: minmax(0, 1fr); }
}

/* ⚙ 隐藏设置态：双栏容器带 .setup-hidden 时改为单栏并收起左侧设置卡 */
#app .layout.setup-hidden,
main.container .layout.setup-hidden,
.container .layout.setup-hidden {
  grid-template-columns: minmax(0, 1fr);
}
.layout.setup-hidden .side-card {
  display: none;
}

/* ---------------------------------------------------------------------------
 * 二、左侧设置卡片
 * ------------------------------------------------------------------------- */
.side-card {
  display: flex;
  flex-direction: column;
  gap: 14px;
  padding: 18px 18px 22px;
  min-width: 0;
}

.card-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  margin-bottom: 4px;
}
.card-head .card-title { margin-bottom: 0; }

/* 模式切换按钮组在窄面板中自适应换行 */
.field-row {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
  margin-bottom: 10px;
}
.field-row > .field-label {
  flex-shrink: 0;
  margin-bottom: 0;
  min-width: 64px;
}
.seg-group { flex-wrap: wrap; }

/* 范围输入对：min/max + 中间分隔 */
.range-pair {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  flex: 1;
  min-width: 0;
}
.range-pair .num-input { flex: 1; min-width: 0; }
.range-block .range-pair { flex: 1; }

.num-input {
  width: 100%;
  padding: 8px 12px;
  font-size: 13.5px;
  font-weight: 600;
  font-variant-numeric: tabular-nums;
}
.num-input.num-wide { max-width: 110px; }

/* Y 自动模式时手动行隐藏（由 JS 控制 display） */
#yManualRow { margin-bottom: 10px; }

/* 显示选项复选框网格：两列布局 */
.check-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 6px 12px;
  margin-top: 4px;
}
.check-grid .check-inline { padding: 4px 0; }

/* ---------------------------------------------------------------------------
 * 三、函数行列表（动态生成）
 * ------------------------------------------------------------------------- */
.func-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 8px;
}

.func-row {
  display: grid;
  grid-template-columns: 32px 24px 1fr auto;
  grid-template-rows: auto auto;
  align-items: center;
  gap: 6px 8px;
  padding: 10px 12px;
  background: var(--card-bg-2);
  border: 1px solid var(--border);
  border-radius: var(--r-sm);
  transition: border-color var(--t-fast) var(--ease), background var(--t-fast) var(--ease);
}
.func-row.has-error {
  border-color: #ffd4d4;
  background: #fff5f5;
}

/* 颜色选择圆点 */
.func-color {
  width: 30px;
  height: 30px;
  padding: 2px;
  border-radius: 50%;
  border: 1.5px solid var(--border-2);
  background: var(--card-bg);
  cursor: pointer;
  grid-row: 1;
  grid-column: 1;
}

/* 启用复选 */
.func-enable {
  width: 16px;
  height: 16px;
  accent-color: var(--primary);
  cursor: pointer;
  grid-row: 1;
  grid-column: 2;
}

/* 表达式输入 */
.func-expr {
  grid-row: 1;
  grid-column: 3;
  padding: 7px 12px;
  font-family: Consolas, Menlo, "Courier New", monospace;
  font-size: 13.5px;
  font-weight: 500;
  background: var(--card-bg);
  border: 1.5px solid var(--border);
  border-radius: var(--r-sm);
  transition: all var(--t-fast) var(--ease);
  min-width: 0;
}
.func-expr:focus {
  border-color: var(--primary);
  background: #fff;
  box-shadow: 0 0 0 3px rgba(59, 110, 246, 0.12);
}
.func-row.has-error .func-expr {
  border-color: #fca5a5;
  background: #fff;
}
.func-row.has-error .func-expr:focus {
  border-color: var(--danger);
  box-shadow: 0 0 0 3px rgba(239, 91, 91, 0.16);
}

/* 删除按钮 */
.func-del {
  grid-row: 1;
  grid-column: 4;
  padding: 6px 10px;
  font-size: 12px;
  font-weight: 600;
  color: var(--text-3);
  background: var(--card-bg);
  border: 1.5px solid var(--border);
  border-radius: var(--r-pill);
  cursor: pointer;
  transition: all var(--t-fast) var(--ease);
  white-space: nowrap;
}
.func-del:hover {
  color: var(--danger);
  border-color: #ffd4d4;
  background: #fff5f5;
}

/* 错误提示行 */
.func-error {
  grid-row: 2;
  grid-column: 1 / -1;
  font-size: 12.5px;
  color: var(--danger);
  line-height: 1.5;
  word-break: break-word;
}
.func-error:empty { display: none; }

/* 添加函数按钮：占满一行 */
.btn-add {
  width: 100%;
  padding: 10px 16px;
  font-size: 13.5px;
  font-weight: 600;
  color: var(--primary);
  background: var(--primary-soft);
  border: 1.5px dashed var(--primary-soft-2);
  border-radius: var(--r-sm);
  cursor: pointer;
  transition: all var(--t-fast) var(--ease);
}
.btn-add:hover {
  background: var(--primary-soft-2);
  border-color: var(--primary);
  transform: translateY(-1px);
}
.btn-add:disabled {
  color: var(--text-3);
  background: var(--bg-soft);
  border-color: var(--border);
  cursor: not-allowed;
  transform: none;
}

/* ---------------------------------------------------------------------------
 * 四、右侧画布主区
 * ------------------------------------------------------------------------- */
.graph-card {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 14px;
  padding: 18px 20px 22px;
  min-width: 0;
}

.graph-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  flex-wrap: wrap;
  padding: 12px 14px;
  background: var(--card-bg-2);
  border: 1px solid var(--border);
  border-radius: var(--r);
}
.graph-toolbar .tool-group {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
.graph-toolbar .btn-small {
  padding: 7px 14px;
  font-size: 12.5px;
}

.range-info {
  font-size: 12.5px;
  color: var(--text-3);
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
}

/* 画布容器：白底 + 投影 + 圆角 */
.canvas-wrap {
  position: relative;
  width: 100%;
  height: 480px;
  background: #fff;
  border: 1px solid var(--border);
  border-radius: var(--r);
  box-shadow: var(--shadow-sm);
  overflow: hidden;
}
#graphCanvas {
  display: block;
  width: 100%;
  height: 100%;
  cursor: grab;
  touch-action: none;
}
#graphCanvas.dragging { cursor: grabbing; }

/* 画布下方提示 */
.canvas-wrap .hint {
  position: absolute;
  left: 12px;
  bottom: 10px;
  font-size: 12px;
  color: var(--text-3);
  background: rgba(255, 255, 255, 0.78);
  padding: 4px 10px;
  border-radius: var(--r-pill);
  pointer-events: none;
  -webkit-backdrop-filter: blur(4px);
  backdrop-filter: blur(4px);
}

/* 实时坐标提示（鼠标在画布上时显示） */
.live-coord {
  position: absolute;
  top: 12px;
  right: 12px;
  padding: 5px 12px;
  font-family: Consolas, Menlo, monospace;
  font-size: 12.5px;
  font-weight: 600;
  color: var(--text-1);
  background: rgba(255, 255, 255, 0.92);
  border: 1px solid var(--border);
  border-radius: var(--r-pill);
  pointer-events: none;
  -webkit-backdrop-filter: blur(4px);
  backdrop-filter: blur(4px);
  box-shadow: var(--shadow-sm);
}

/* ---------------------------------------------------------------------------
 * 五、表达式提示卡片
 * ------------------------------------------------------------------------- */
.expr-hints {
  padding: 12px 16px;
  font-size: 13px;
  line-height: 1.75;
  color: var(--text-2);
  background: var(--bg-soft);
  border: 1px solid var(--border);
  border-radius: var(--r-sm);
}
.expr-hints strong { color: var(--text-1); font-weight: 700; }
.expr-hints code {
  display: inline-block;
  margin: 0 2px;
  padding: 1px 7px;
  font-family: Consolas, Menlo, monospace;
  font-size: 12px;
  font-weight: 600;
  color: var(--primary);
  background: var(--card-bg);
  border: 1px solid var(--border);
  border-radius: 4px;
}

/* ---------------------------------------------------------------------------
 * 六、全屏投影
 * ------------------------------------------------------------------------- */
.graph-card:fullscreen,
.graph-card:-webkit-full-screen,
.graph-card.edutf-solo{
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  padding: 24px;
  background: var(--bg);
  border-radius: 0;
}
.graph-card:fullscreen .canvas-wrap,
.graph-card:-webkit-full-screen .canvas-wrap,
.graph-card.edutf-solo .canvas-wrap{
  flex: 1;
  height: auto;
  min-height: 60vh;
}

/* ---------------------------------------------------------------------------
 * 七、小屏微调
 * ------------------------------------------------------------------------- */
@media (max-width: 640px) {
  .side-card, .graph-card { padding: 14px; }
  .canvas-wrap { height: 360px; }
  .func-row {
    grid-template-columns: 30px 18px 1fr;
  }
  .func-del {
    grid-column: 1 / -1;
    grid-row: 2;
    justify-self: start;
    margin-top: 4px;
  }
  .func-error { grid-row: 3; }
  .check-grid { grid-template-columns: 1fr; }
  .range-info { width: 100%; text-align: left; }
}
`,
      "tools/function-graph/function-graph.js": `/**
 * 函数绘图工具 (function-graph.js)
 * 功能：纯 Canvas 绘制坐标系与函数图像；自研安全表达式解析（词法分析 + 调度场算法），
 *       支持多函数叠加、滚轮缩放、拖拽平移、X/Y 范围调节、采样点数、线宽、显示选项、
 *       绘制动画、关键点标注、全屏模式、导出 PNG。禁止使用 eval/Function。
 * 视觉参考：https://classtool.cn/function-graph/
 */
(function () {
  "use strict";

  /* ============================================================
   * 一、安全表达式解析器
   * ============================================================ */

  /** 单参函数表：名称 -> 求值函数 */
  var UNARY_FUNCS = {
    sin: Math.sin, cos: Math.cos, tan: Math.tan,
    asin: Math.asin, acos: Math.acos, atan: Math.atan,
    sinh: Math.sinh, cosh: Math.cosh, tanh: Math.tanh,
    ln: Math.log,
    log2: function (v) { return Math.log(v) / Math.LN2; },
    lg: function (v) { return Math.log(v) / Math.LN10; }, // log10
    log: function (v) { return Math.log(v) / Math.LN10; }, // 通用对数
    sqrt: Math.sqrt, cbrt: Math.cbrt, abs: Math.abs, exp: Math.exp,
    floor: Math.floor, ceil: Math.ceil, round: Math.round,
    sign: Math.sign, trunc: Math.trunc
  };
  /** 多参函数表：名称 -> 求值函数 */
  var MULTI_FUNCS = {
    max: Math.max, min: Math.min, pow: Math.pow,
    atan2: Math.atan2, hypot: function (a, b) { return Math.hypot(a, b); }
  };
  /** 运算符优先级：二元 + - * / ^，一元负号记为 ~ */
  var PRECEDENCE = { "+": 1, "-": 1, "*": 2, "/": 2, "~": 3, "^": 4 };

  /**
   * 词法分析：把表达式字符串切分为 token 数组
   * 入参：expr 表达式字符串
   * 返回值：Array<{t:string, v:*}>，t 为 num/name/op
   * 异常：遇到无法识别的字符抛 Error
   */
  function tokenize(expr) {
    var tokens = [];
    var i = 0;
    var n = expr.length;
    while (i < n) {
      var ch = expr.charAt(i);
      if (ch === " " || ch === "\\t") { i++; continue; }
      // 数字：支持 12、12.34、.5
      if ((ch >= "0" && ch <= "9") || ch === ".") {
        var m = /^[0-9]+(\\.[0-9]+)?|^\\.[0-9]+/.exec(expr.slice(i));
        var raw = m[0];
        if (raw === ".") throw new Error("数字格式错误（孤立的小数点）");
        tokens.push({ t: "num", v: parseFloat(raw) });
        i += raw.length;
        continue;
      }
      // 标识符（函数名、常量、变量；允许字母后带数字，如 log2）
      if (/[A-Za-z_]/.test(ch)) {
        var name = /^[A-Za-z_][A-Za-z0-9_]*/.exec(expr.slice(i))[0];
        tokens.push({ t: "name", v: name });
        i += name.length;
        continue;
      }
      // 运算符与括号
      if ("+-*/^(),".indexOf(ch) !== -1) {
        tokens.push({ t: "op", v: ch });
        i++;
        continue;
      }
      throw new Error("无法识别的字符：\\"" + ch + "\\"");
    }
    return tokens;
  }

  /**
   * 调度场算法：token 数组转逆波兰表达式（RPN）
   * 入参：tokens tokenize 的结果；varName 当前变量名（x 或 t）
   * 返回值：Array，RPN 指令序列（数字/名称字符串/运算符/{fn,arity}）
   * 异常：括号不匹配、运算符位置错误等抛 Error
   */
  function toRPN(tokens, varName) {
    var output = [];
    var stack = [];
    var expectOperand = true; // 下一个 token 是否应当是操作数（用于识别一元负号）
    var k;

    /**
     * 把栈顶运算符按优先级弹出到输出队列
     * 入参：currentOp 当前运算符（用于比较优先级）
     * 返回值：无
     */
    function popOps(currentOp) {
      while (stack.length) {
        var top = stack[stack.length - 1];
        if (typeof top === "string" && top !== "(") {
          // 特殊约定：一元负号与幂互不抢占
          if ((currentOp === "^" && top === "~") || (currentOp === "~" && top === "^")) break;
          var topPrec = PRECEDENCE[top];
          var curPrec = PRECEDENCE[currentOp];
          var rightAssoc = currentOp === "^" || currentOp === "~";
          if ((rightAssoc && topPrec > curPrec) || (!rightAssoc && topPrec >= curPrec)) {
            output.push(stack.pop());
          } else {
            break;
          }
        } else {
          break;
        }
      }
    }

    for (k = 0; k < tokens.length; k++) {
      var tok = tokens[k];
      var next = tokens[k + 1];

      if (tok.t === "num") {
        if (!expectOperand) { popOps("*"); stack.push("*"); }
        output.push(tok.v);
        expectOperand = false;
      } else if (tok.t === "name") {
        var nm = tok.v;
        var isFunc = Object.prototype.hasOwnProperty.call(UNARY_FUNCS, nm) ||
                     Object.prototype.hasOwnProperty.call(MULTI_FUNCS, nm);
        if (isFunc) {
          if (!expectOperand) { popOps("*"); stack.push("*"); }
          if (!next || next.t !== "op" || next.v !== "(") {
            throw new Error("函数 \\"" + nm + "\\" 后面需要一对小括号，例如 " + nm + "(" + varName + ")");
          }
          stack.push({ fn: nm, arity: 1 });
          expectOperand = true;
        } else if (nm === varName) {
          if (!expectOperand) { popOps("*"); stack.push("*"); }
          output.push(varName);
          expectOperand = false;
        } else if (nm === "pi" || nm === "e") {
          if (!expectOperand) { popOps("*"); stack.push("*"); }
          output.push(nm);
          expectOperand = false;
        } else {
          throw new Error("未知标识符：\\"" + nm + "\\"（可用变量只有 " + varName + "，常量 pi、e）");
        }
      } else if (tok.v === "(") {
        if (!expectOperand) { popOps("*"); stack.push("*"); }
        stack.push("(");
        expectOperand = true;
      } else if (tok.v === ")") {
        if (expectOperand) throw new Error("括号内缺少表达式");
        while (stack.length && stack[stack.length - 1] !== "(") {
          output.push(stack.pop());
        }
        if (!stack.length) throw new Error("括号不匹配：多余的右括号 )");
        stack.pop(); // 丢弃 "("
        if (stack.length && typeof stack[stack.length - 1] === "object") {
          output.push(stack.pop()); // 函数标记出队（带参数个数）
        }
        expectOperand = false;
      } else if (tok.v === ",") {
        while (stack.length && stack[stack.length - 1] !== "(") {
          output.push(stack.pop());
        }
        if (!stack.length) throw new Error("逗号位置错误或括号不匹配");
        var marker = stack[stack.length - 2];
        if (!marker || typeof marker !== "object") {
          throw new Error("逗号只能出现在 max/min/pow 等函数的参数之间");
        }
        marker.arity++;
        expectOperand = true;
      } else {
        // 二元 / 一元运算符
        var op = tok.v;
        if (op === "-" && expectOperand) {
          popOps("~");
          stack.push("~");
          expectOperand = true;
        } else if (op === "+" && expectOperand) {
          continue; // 一元正号忽略
        } else {
          if (expectOperand) throw new Error("运算符 \\"" + op + "\\" 前缺少操作数");
          if (PRECEDENCE[op] === undefined) throw new Error("不支持的运算符：" + op);
          popOps(op);
          stack.push(op);
          expectOperand = true;
        }
      }
    }

    if (expectOperand) throw new Error("表达式不完整：末尾缺少操作数");
    while (stack.length) {
      var rest = stack.pop();
      if (rest === "(" || typeof rest === "object") {
        throw new Error("括号不匹配：缺少右括号 )");
      }
      output.push(rest);
    }
    return output;
  }

  /**
   * 编译表达式为求值函数
   * 入参：expr 用户输入的表达式字符串；varName 变量名（默认 x）
   * 返回值：function(x):number，输入 x 返回函数值；非法时抛 Error
   */
  function compile(expr, varName) {
    varName = varName || "x";
    var text = String(expr || "").trim();
    if (text === "") throw new Error("表达式为空");
    var rpn = toRPN(tokenize(text), varName);
    return function evaluator(v) {
      var st = [];
      for (var i = 0; i < rpn.length; i++) {
        var t = rpn[i];
        if (typeof t === "number") {
          st.push(t);
        } else if (t === varName) {
          st.push(v);
        } else if (t === "pi") {
          st.push(Math.PI);
        } else if (t === "e") {
          st.push(Math.E);
        } else if (t === "~") {
          st.push(-st.pop());
        } else if (t === "+") {
          var b1 = st.pop(), a1 = st.pop(); st.push(a1 + b1);
        } else if (t === "-") {
          var b2 = st.pop(), a2 = st.pop(); st.push(a2 - b2);
        } else if (t === "*") {
          var b3 = st.pop(), a3 = st.pop(); st.push(a3 * b3);
        } else if (t === "/") {
          var b4 = st.pop(), a4 = st.pop(); st.push(a4 / b4);
        } else if (t === "^") {
          var b5 = st.pop(), a5 = st.pop(); st.push(Math.pow(a5, b5));
        } else if (typeof t === "object" && t.fn) {
          var args = [];
          for (var ar = 0; ar < t.arity; ar++) args.unshift(st.pop());
          if (UNARY_FUNCS[t.fn]) {
            if (t.arity !== 1) throw new Error("函数 " + t.fn + " 只接受 1 个参数");
            st.push(UNARY_FUNCS[t.fn](args[0]));
          } else {
            if (t.arity < 2) throw new Error("函数 " + t.fn + " 至少需要 2 个参数");
            st.push(MULTI_FUNCS[t.fn].apply(null, args));
          }
        } else {
          throw new Error("求值失败：未知指令 " + String(t));
        }
      }
      if (st.length !== 1) throw new Error("表达式无法正确求值");
      var val = st[0];
      if (typeof val !== "number" || Number.isNaN(val)) throw new Error("计算结果不是有效数字");
      return val;
    };
  }

  /* ============================================================
   * 二、画布与视图状态
   * ============================================================ */

  var canvas = document.getElementById("graphCanvas");
  var ctx = canvas.getContext("2d");
  var canvasWrap = document.getElementById("canvasWrap");
  var dpr = Math.max(1, window.devicePixelRatio || 1);
  var cssW = 0, cssH = 0;

  /** 视图状态：中心点数学坐标 + 每单位像素数 */
  var view = { cx: 0, cy: 0, scale: 40 };

  /** 函数行数据 */
  var PALETTE = ["#ef4444", "#2563eb", "#16a34a", "#9333ea", "#ea580c"];
  var funcs = [];
  var MAX_FUNCS = 5;
  var rafPending = false;
  var animFrame = null;       // 当前动画帧 id
  var animStartTime = 0;     // 动画起始时间戳

  /** 显示选项（与 UI checkbox 双向绑定） */
  var opts = {
    grid: true, axis: true, keyPoints: false, fill: false, anim: false
  };

  /* ============================================================
   * 三、绘图辅助
   * ============================================================ */

  /**
   * 按 1/2/5×10^n 选取“好看”的刻度步长
   * 入参：raw 期望的步长（数学单位）
   * 返回值：number 实际使用的步长
   */
  function niceStep(raw) {
    if (!(raw > 0) || !isFinite(raw)) return 1;
    var exp = Math.floor(Math.log10(raw));
    var base = raw / Math.pow(10, exp);
    var stepBase = base < 1.5 ? 1 : base < 3 ? 2 : base < 7 ? 5 : 10;
    return stepBase * Math.pow(10, exp);
  }

  /**
   * 格式化刻度数字，规避浮点尾差
   * 入参：v 刻度数值
   * 返回值：string 显示文本
   */
  function formatTick(v) {
    if (v === 0) return "0";
    var av = Math.abs(v);
    if (av >= 1e5 || av < 1e-4) return v.toExponential(1);
    return String(parseFloat(v.toFixed(6)));
  }

  /** 适配画布物理像素（高 DPI）与 CSS 尺寸 */
  function resizeCanvas() {
    var rect = canvas.getBoundingClientRect();
    cssW = Math.max(50, rect.width);
    cssH = Math.max(50, rect.height);
    canvas.width = Math.round(cssW * dpr);
    canvas.height = Math.round(cssH * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  /** 数学坐标 -> 屏幕 x 像素 */
  function toScreenX(x) { return cssW / 2 + (x - view.cx) * view.scale; }
  /** 数学坐标 -> 屏幕 y 像素（y 轴向上为正） */
  function toScreenY(y) { return cssH / 2 - (y - view.cy) * view.scale; }
  /** 屏幕 x 像素 -> 数学坐标 */
  function toMathX(px) { return (px - cssW / 2) / view.scale + view.cx; }
  /** 屏幕 y 像素 -> 数学坐标 */
  function toMathY(py) { return view.cy - (py - cssH / 2) / view.scale; }

  /**
   * 绘制网格、坐标轴、刻度
   * 入参：无
   * 返回值：无
   */
  function drawGrid() {
    var xmin = toMathX(0), xmax = toMathX(cssW);
    var ymin = toMathY(cssH), ymax = toMathY(0);
    var step = niceStep(70 / view.scale);

    // 网格线（仅在开启网格时绘制）
    if (opts.grid) {
      ctx.lineWidth = 1;
      ctx.font = "11px -apple-system, 'Segoe UI', sans-serif";
      var gx0 = Math.ceil(xmin / step) * step;
      for (var gx = gx0; gx <= xmax + step * 1e-6; gx += step) {
        var sx = toScreenX(gx);
        ctx.strokeStyle = Math.abs(gx) < step * 1e-6 ? "#d7dde6" : "#eef2f7";
        ctx.beginPath();
        ctx.moveTo(sx, 0);
        ctx.lineTo(sx, cssH);
        ctx.stroke();
      }
      var gy0 = Math.ceil(ymin / step) * step;
      for (var gy = gy0; gy <= ymax + step * 1e-6; gy += step) {
        var sy = toScreenY(gy);
        ctx.strokeStyle = Math.abs(gy) < step * 1e-6 ? "#d7dde6" : "#eef2f7";
        ctx.beginPath();
        ctx.moveTo(0, sy);
        ctx.lineTo(cssW, sy);
        ctx.stroke();
      }
    }

    // 坐标轴（仅在开启坐标轴时绘制）
    if (opts.axis) {
      var axisX = Math.min(Math.max(toScreenX(0), 0), cssW);
      var axisY = Math.min(Math.max(toScreenY(0), 0), cssH);

      ctx.strokeStyle = "#374151";
      ctx.lineWidth = 1.6;
      ctx.beginPath(); // x 轴
      ctx.moveTo(0, axisY);
      ctx.lineTo(cssW, axisY);
      ctx.stroke();
      ctx.beginPath(); // y 轴
      ctx.moveTo(axisX, 0);
      ctx.lineTo(axisX, cssH);
      ctx.stroke();

      // 轴端箭头
      ctx.fillStyle = "#374151";
      ctx.beginPath();
      ctx.moveTo(cssW - 1, axisY);
      ctx.lineTo(cssW - 9, axisY - 4.5);
      ctx.lineTo(cssW - 9, axisY + 4.5);
      ctx.closePath();
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(axisX, 1);
      ctx.lineTo(axisX - 4.5, 9);
      ctx.lineTo(axisX + 4.5, 9);
      ctx.closePath();
      ctx.fill();

      // 刻度数字
      ctx.fillStyle = "#6b7280";
      ctx.font = "11px -apple-system, 'Segoe UI', sans-serif";
      var labelBelow = axisY < cssH - 18;
      var tx0 = Math.ceil(xmin / step) * step;
      for (var tx = tx0; tx <= xmax + step * 1e-6; tx += step) {
        if (Math.abs(tx) < step * 1e-6) continue;
        var lx = toScreenX(tx);
        ctx.beginPath();
        ctx.strokeStyle = "#9ca3af";
        ctx.moveTo(lx, axisY - 3);
        ctx.lineTo(lx, axisY + 3);
        ctx.stroke();
        ctx.textAlign = "center";
        ctx.textBaseline = labelBelow ? "top" : "bottom";
        ctx.fillText(formatTick(tx), lx, labelBelow ? axisY + 5 : axisY - 5);
      }
      var labelsOnRight = axisX > cssW - 46;
      var ty0 = Math.ceil(ymin / step) * step;
      for (var ty = ty0; ty <= ymax + step * 1e-6; ty += step) {
        if (Math.abs(ty) < step * 1e-6) continue;
        var ly = toScreenY(ty);
        ctx.beginPath();
        ctx.strokeStyle = "#9ca3af";
        ctx.moveTo(axisX - 3, ly);
        ctx.lineTo(axisX + 3, ly);
        ctx.stroke();
        ctx.textAlign = labelsOnRight ? "left" : "right";
        ctx.textBaseline = "middle";
        ctx.fillText(formatTick(ty), labelsOnRight ? axisX + 7 : axisX - 7, ly);
      }

      // 原点十字与标注
      if (axisX > 0 && axisX < cssW && axisY > 0 && axisY < cssH) {
        ctx.strokeStyle = "#374151";
        ctx.lineWidth = 1.4;
        ctx.beginPath();
        ctx.moveTo(axisX - 5, axisY);
        ctx.lineTo(axisX + 5, axisY);
        ctx.moveTo(axisX, axisY - 5);
        ctx.lineTo(axisX, axisY + 5);
        ctx.stroke();
        ctx.fillStyle = "#6b7280";
        ctx.textAlign = "right";
        ctx.textBaseline = "top";
        ctx.fillText("O", axisX - 6, axisY + 4);
      }
      ctx.textAlign = "left";
      ctx.textBaseline = "alphabetic";
    }
  }

  /**
   * 计算单条函数在当前 X 范围内的关键点（零点、y 截距、可见极值）
   * 入参：f 函数行数据；xmin/xmax 当前可见 X 范围；samples 采样数
   * 返回值：Array<{x, y, type}>
   */
  function findKeyPoints(f, xmin, xmax, samples) {
    if (!f.evaluator) return [];
    var pts = [];
    var step = (xmax - xmin) / samples;
    var prevX = xmin, prevY = null;
    try { prevY = f.evaluator(xmin); } catch (e) { prevY = NaN; }
    var lastWasUp = null; // 用于判断极值拐点

    for (var i = 1; i <= samples; i++) {
      var x = xmin + i * step;
      var y;
      try { y = f.evaluator(x); } catch (e) { y = NaN; }
      if (isFinite(prevY) && isFinite(y)) {
        // 零点：符号反转
        if (prevY === 0) pts.push({ x: prevX, y: 0, type: "零点" });
        else if (prevY * y < 0) {
          // 线性插值估计零点
          var t = -prevY / (y - prevY);
          pts.push({ x: prevX + t * step, y: 0, type: "零点" });
        }
        // 极值：导数符号反转（用差分近似）
        var diff = y - prevY;
        var isUp = diff > 0;
        if (lastWasUp !== null && isUp !== lastWasUp && Math.abs(diff) > 1e-9) {
          pts.push({ x: prevX, y: prevY, type: isUp ? "极小值" : "极大值" });
        }
        lastWasUp = isUp;
      }
      prevX = x;
      prevY = y;
    }

    // y 轴截距
    try {
      var y0 = f.evaluator(0);
      if (isFinite(y0) && y0 !== 0) pts.push({ x: 0, y: y0, type: "y 截距" });
    } catch (e) { /* 忽略 */ }

    // 去重（同一关键点附近归并）+ 限制数量
    var unique = [];
    pts.forEach(function (p) {
      var dup = unique.some(function (q) { return Math.abs(p.x - q.x) < step * 2 && Math.abs(p.y - q.y) < step * 2; });
      if (!dup) unique.push(p);
    });
    return unique.slice(0, 12);
  }

  /**
   * 绘制单条函数图像（逐像素采样，跳变处断开视为渐近线）
   * 入参：f 函数行数据；progress 动画进度 0~1（1 为完整）
   * 返回值：无
   */
  function drawFunction(f, progress) {
    if (!f.enabled || f.error || !f.evaluator) return;
    progress = typeof progress === "number" ? Math.max(0, Math.min(1, progress)) : 1;
    var endPx = Math.floor(cssW * progress);
    var jumpThreshold = (toMathY(0) - toMathY(cssH)) * 0.5;
    var lw = parseFloat(document.getElementById("lineWidth").value) || 2;
    ctx.strokeStyle = f.color;
    ctx.lineWidth = Math.max(0.5, lw);
    ctx.lineJoin = "round";
    ctx.lineCap = "round";

    // 填充曲线下方区域（可选）
    if (opts.fill) {
      var axisY = Math.min(Math.max(toScreenY(0), 0), cssH);
      ctx.beginPath();
      var started = false;
      for (var px = 0; px <= endPx; px++) {
        var x = toMathX(px);
        var y;
        try { y = f.evaluator(x); } catch (e) { y = NaN; }
        if (!isFinite(y)) { started = false; continue; }
        var sy = toScreenY(y);
        if (!started) {
          ctx.moveTo(px, axisY);
          ctx.lineTo(px, sy);
          started = true;
        } else {
          ctx.lineTo(px, sy);
        }
      }
      if (started) ctx.lineTo(endPx, axisY);
      ctx.closePath();
      ctx.fillStyle = hexToRgba(f.color, 0.16);
      ctx.fill();
    }

    // 折线
    ctx.beginPath();
    var pen = false;
    var prevY = 0;
    for (var qx = 0; qx <= endPx; qx++) {
      var xv = toMathX(qx);
      var yv;
      try { yv = f.evaluator(xv); } catch (e) { yv = NaN; }
      if (typeof yv !== "number" || !isFinite(yv)) {
        pen = false;
        continue;
      }
      var syv = toScreenY(yv);
      if (!pen) {
        ctx.moveTo(qx, syv);
        pen = true;
      } else if (Math.abs(yv - prevY) > jumpThreshold) {
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(qx, syv);
      } else {
        ctx.lineTo(qx, syv);
      }
      prevY = yv;
    }
    ctx.stroke();

    // 关键点标注（仅在完整绘制后展示）
    if (opts.keyPoints && progress >= 1) {
      var samples = Math.min(800, Math.max(200, Math.floor(cssW)));
      var kps = findKeyPoints(f, toMathX(0), toMathX(cssW), samples);
      ctx.fillStyle = f.color;
      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = 1.6;
      kps.forEach(function (p) {
        var sx = toScreenX(p.x);
        var sy = toScreenY(p.y);
        if (sx < 0 || sx > cssW || sy < 0 || sy > cssH) return;
        ctx.beginPath();
        ctx.arc(sx, sy, 3.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
      });
    }
  }

  /**
   * 将 #rrggbb 颜色转为带 alpha 的 rgba 字符串
   * 入参：hex 颜色字符串；alpha 透明度 0~1
   * 返回值：string rgba 字符串
   */
  function hexToRgba(hex, alpha) {
    var m = /^#([0-9a-f]{6})$/i.exec(hex);
    if (!m) return "rgba(127,127,127," + alpha + ")";
    var n = parseInt(m[1], 16);
    return "rgba(" + ((n >> 16) & 255) + "," + ((n >> 8) & 255) + "," + (n & 255) + "," + alpha + ")";
  }

  /** 更新视图范围文字 */
  function updateRangeInfo() {
    var info = document.getElementById("rangeInfo");
    var xs = [toMathX(0), toMathX(cssW)];
    var ys = [toMathY(cssH), toMathY(0)];
    function r(v) { return parseFloat(v.toFixed(3)); }
    info.textContent =
      "x：[" + r(Math.min.apply(null, xs)) + ", " + r(Math.max.apply(null, xs)) + "]　" +
      "y：[" + r(Math.min.apply(null, ys)) + ", " + r(Math.max.apply(null, ys)) + "]";
  }

  /** 同步范围输入框到当前视图状态 */
  function syncRangeInputs() {
    var xmin = toMathX(0);
    var xmax = toMathX(cssW);
    var ymin = toMathY(cssH);
    var ymax = toMathY(0);
    document.getElementById("xMin").value = parseFloat(xmin.toFixed(4));
    document.getElementById("xMax").value = parseFloat(xmax.toFixed(4));
    if (!document.getElementById("yAuto").checked) {
      document.getElementById("yMin").value = parseFloat(ymin.toFixed(4));
      document.getElementById("yMax").value = parseFloat(ymax.toFixed(4));
    }
  }

  /** 整体重绘（rAF 合并高频事件） */
  function redraw() {
    if (rafPending) return;
    rafPending = true;
    requestAnimationFrame(function () {
      rafPending = false;
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, cssW, cssH);
      drawGrid();
      for (var i = 0; i < funcs.length; i++) drawFunction(funcs[i], 1);
      updateRangeInfo();
    });
  }

  /**
   * 以指定屏幕点为锚点缩放
   * 入参：px/py 锚点像素；factor 缩放倍数（>1 放大）
   * 返回值：无
   */
  function zoomAt(px, py, factor) {
    var ax = toMathX(px);
    var ay = toMathY(py);
    view.scale *= factor;
    view.scale = Math.min(1e7, Math.max(1e-5, view.scale));
    view.cx = ax - (px - cssW / 2) / view.scale;
    view.cy = ay + (py - cssH / 2) / view.scale;
    syncRangeInputs();
    redraw();
  }

  /**
   * 根据 Y 自动计算模式重新调整 Y 范围
   * 入参：无
   * 返回值：无
   */
  function applyYAutoRange() {
    if (!document.getElementById("yAuto").checked) return;
    var samples = parseInt(document.getElementById("samples").value, 10) || 801;
    var xmin = toMathX(0);
    var xmax = toMathX(cssW);
    var ymin = Infinity, ymax = -Infinity;
    var dx = (xmax - xmin) / (samples - 1);
    funcs.forEach(function (f) {
      if (!f.enabled || f.error || !f.evaluator) return;
      for (var i = 0; i < samples; i++) {
        var x = xmin + i * dx;
        var y;
        try { y = f.evaluator(x); } catch (e) { y = NaN; }
        if (isFinite(y)) {
          if (y < ymin) ymin = y;
          if (y > ymax) ymax = y;
        }
      }
    });
    if (isFinite(ymin) && isFinite(ymax)) {
      if (ymin === ymax) { ymin -= 1; ymax += 1; }
      var pad = (ymax - ymin) * 0.12;
      ymin -= pad; ymax += pad;
      view.cy = (ymin + ymax) / 2;
      view.scale = cssW / (xmax - xmin); // 保持 x 范围
      var yScale = cssH / (ymax - ymin);
      view.scale = Math.min(view.scale, yScale); // 取较小者保证两轴都装下
      view.cy = (ymin + ymax) / 2;
    }
    syncRangeInputs();
  }

  /** 应用 X/Y 范围输入框的值到视图状态 */
  function applyManualRange() {
    var xmin = parseFloat(document.getElementById("xMin").value);
    var xmax = parseFloat(document.getElementById("xMax").value);
    if (!(isFinite(xmin) && isFinite(xmax) && xmax > xmin)) return;
    view.cx = (xmin + xmax) / 2;
    view.scale = cssW / (xmax - xmin);
    if (document.getElementById("yAuto").checked) {
      applyYAutoRange();
    } else {
      var ymin = parseFloat(document.getElementById("yMin").value);
      var ymax = parseFloat(document.getElementById("yMax").value);
      if (isFinite(ymin) && isFinite(ymax) && ymax > ymin) {
        view.cy = (ymin + ymax) / 2;
        var yScale = cssH / (ymax - ymin);
        view.scale = Math.min(view.scale, yScale);
      }
    }
    redraw();
  }

  /**
   * 播放从左到右绘制动画
   * 入参：无
   * 返回值：无
   */
  function playAnimation() {
    if (animFrame) cancelAnimationFrame(animFrame);
    var duration = parseInt(document.getElementById("animDuration").value, 10) || 3000;
    animStartTime = performance.now();

    /**
     * 单帧渲染回调
     * 入参：now 当前时间戳
     * 返回值：无
     */
    function frame(now) {
      var progress = Math.min(1, (now - animStartTime) / duration);
      // 缓动：easeOutCubic
      var eased = 1 - Math.pow(1 - progress, 3);
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, cssW, cssH);
      drawGrid();
      for (var i = 0; i < funcs.length; i++) drawFunction(funcs[i], eased);
      updateRangeInfo();
      if (progress < 1) {
        animFrame = requestAnimationFrame(frame);
      } else {
        animFrame = null;
      }
    }
    animFrame = requestAnimationFrame(frame);
  }

  /* ============================================================
   * 四、函数列表 UI
   * ============================================================ */

  var funcListEl = document.getElementById("funcList");
  var addBtn = document.getElementById("btnAdd");

  /**
   * 重新编译某一行表达式并更新错误样式
   * 入参：f 函数行数据
   * 返回值：无
   */
  function recompile(f) {
    var text = f.input.value.trim();
    f.expr = text;
    f.error = "";
    f.evaluator = null;
    if (text === "") {
      f.row.classList.remove("has-error");
      f.errorEl.textContent = "";
      redraw();
      return;
    }
    try {
      f.evaluator = compile(text, "x");
      f.row.classList.remove("has-error");
      f.errorEl.textContent = "";
    } catch (err) {
      f.error = err.message;
      f.row.classList.add("has-error");
      f.errorEl.textContent = "⚠️ " + err.message;
    }
    if (document.getElementById("yAuto").checked) applyYAutoRange();
    redraw();
  }

  /**
   * 创建一个函数行
   * 入参：expr 初始表达式；color 颜色
   * 返回值：无（写入 funcs 与 DOM）
   */
  function addFunctionRow(expr, color) {
    if (funcs.length >= MAX_FUNCS) return;
    var row = document.createElement("div");
    row.className = "func-row";
    row.innerHTML =
      '<input type="color" class="func-color" value="' + color + '" title="线条颜色">' +
      '<input type="checkbox" class="func-enable" checked title="启用/隐藏此函数">' +
      '<input type="text" class="func-expr" spellcheck="false" placeholder="例如 sin(x)、2x+1、x^2-3x+2">' +
      '<button type="button" class="func-del" title="删除此函数">🗑️ 删除<\/button>' +
      '<div class="func-error"><\/div>';
    funcListEl.appendChild(row);

    var f = {
      row: row,
      colorInput: row.querySelector(".func-color"),
      enableInput: row.querySelector(".func-enable"),
      input: row.querySelector(".func-expr"),
      errorEl: row.querySelector(".func-error"),
      delBtn: row.querySelector(".func-del"),
      color: color,
      enabled: true,
      expr: expr,
      evaluator: null,
      error: ""
    };
    f.input.value = expr;
    funcs.push(f);

    f.input.addEventListener("input", function () { recompile(f); });
    f.colorInput.addEventListener("input", function () { f.color = f.colorInput.value; redraw(); });
    f.enableInput.addEventListener("change", function () {
      f.enabled = f.enableInput.checked;
      if (document.getElementById("yAuto").checked) applyYAutoRange();
      redraw();
    });
    f.delBtn.addEventListener("click", function () {
      var idx = funcs.indexOf(f);
      if (idx !== -1) funcs.splice(idx, 1);
      row.parentNode.removeChild(row);
      addBtn.disabled = funcs.length >= MAX_FUNCS;
      if (document.getElementById("yAuto").checked) applyYAutoRange();
      redraw();
    });

    addBtn.disabled = funcs.length >= MAX_FUNCS;
    recompile(f);
  }

  /* ============================================================
   * 五、交互事件
   * ============================================================ */

  /** 滚轮缩放（以指针位置为锚点） */
  canvas.addEventListener("wheel", function (e) {
    e.preventDefault();
    var rect = canvas.getBoundingClientRect();
    var px = e.clientX - rect.left;
    var py = e.clientY - rect.top;
    var factor = e.deltaY < 0 ? 1.12 : 1 / 1.12;
    zoomAt(px, py, factor);
  }, { passive: false });

  /** 拖拽平移 */
  var drag = null;
  canvas.addEventListener("pointerdown", function (e) {
    drag = { x: e.clientX, y: e.clientY, cx: view.cx, cy: view.cy };
    canvas.classList.add("dragging");
    canvas.setPointerCapture(e.pointerId);
  });
  canvas.addEventListener("pointermove", function (e) {
    // 实时坐标提示
    var rect = canvas.getBoundingClientRect();
    var mx = e.clientX - rect.left;
    var my = e.clientY - rect.top;
    if (mx >= 0 && mx <= cssW && my >= 0 && my <= cssH) {
      var liveEl = document.getElementById("liveCoord");
      liveEl.hidden = false;
      liveEl.textContent = "x = " + parseFloat(toMathX(mx).toFixed(4)) + ", y = " + parseFloat(toMathY(my).toFixed(4));
    } else {
      document.getElementById("liveCoord").hidden = true;
    }
    if (!drag) return;
    view.cx = drag.cx - (e.clientX - drag.x) / view.scale;
    view.cy = drag.cy + (e.clientY - drag.y) / view.scale;
    syncRangeInputs();
    redraw();
  });
  canvas.addEventListener("pointerleave", function () {
    document.getElementById("liveCoord").hidden = true;
  });
  /** 结束拖拽（兼容抬起/取消） */
  function endDrag(e) {
    drag = null;
    canvas.classList.remove("dragging");
    try { canvas.releasePointerCapture(e.pointerId); } catch (err) { /* 忽略 */ }
  }
  canvas.addEventListener("pointerup", endDrag);
  canvas.addEventListener("pointercancel", endDrag);

  /** 工具栏：放大/缩小/居中/复位/生成/导出 */
  document.getElementById("btnZoomIn").addEventListener("click", function () {
    zoomAt(cssW / 2, cssH / 2, 1.25);
  });
  document.getElementById("btnZoomOut").addEventListener("click", function () {
    zoomAt(cssW / 2, cssH / 2, 1 / 1.25);
  });
  document.getElementById("btnCenter").addEventListener("click", function () {
    view.cx = 0; view.cy = 0;
    syncRangeInputs();
    redraw();
  });
  document.getElementById("btnReset").addEventListener("click", function () {
    document.getElementById("xMin").value = "-10";
    document.getElementById("xMax").value = "10";
    document.getElementById("yMin").value = "-10";
    document.getElementById("yMax").value = "10";
    document.getElementById("yAuto").checked = false;
    applyManualRange();
  });
  document.getElementById("btnGenerate").addEventListener("click", function () {
    applyManualRange();
    if (opts.anim) {
      playAnimation();
    } else {
      if (animFrame) { cancelAnimationFrame(animFrame); animFrame = null; }
      redraw();
    }
  });
  document.getElementById("btnExport").addEventListener("click", function () {
    // 确保 1:1 完整重绘一帧再导出
    if (animFrame) { cancelAnimationFrame(animFrame); animFrame = null; }
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, cssW, cssH);
    drawGrid();
    for (var i = 0; i < funcs.length; i++) drawFunction(funcs[i], 1);
    var link = document.createElement("a");
    link.download = "function-graph-" + Date.now() + ".png";
    link.href = canvas.toDataURL("image/png");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  });

  /** 全屏状态变化时重建像素缓冲并重绘（进出全屏由共享模块 tool-stage-toolbar.js 接管） */
  document.addEventListener("fullscreenchange", function () { resizeCanvas(); redraw(); });
  document.addEventListener("webkitfullscreenchange", function () { resizeCanvas(); redraw(); });

  /** 添加函数按钮 */
  addBtn.addEventListener("click", function () {
    addFunctionRow("", PALETTE[funcs.length % PALETTE.length]);
  });

  /** 查看示例：载入多组对比函数 */
  document.getElementById("btnExample").addEventListener("click", function () {
    // 清空现有
    while (funcs.length) {
      var f = funcs.pop();
      f.row.parentNode.removeChild(f.row);
    }
    addBtn.disabled = false;
    var examples = [
      { expr: "sin(x)", color: "#ef4444" },
      { expr: "cos(x)", color: "#2563eb" },
      { expr: "x^2/8 - 2", color: "#16a34a" }
    ];
    examples.forEach(function (ex) { addFunctionRow(ex.expr, ex.color); });
    document.getElementById("xMin").value = "-10";
    document.getElementById("xMax").value = "10";
    document.getElementById("yAuto").checked = true;
    applyManualRange();
  });

  /** 范围输入框回车应用 */
  ["xMin", "xMax", "yMin", "yMax", "samples", "lineWidth", "animDuration"].forEach(function (id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener("change", function () {
      if (id === "xMin" || id === "xMax" || id === "yMin" || id === "yMax") applyManualRange();
      else redraw();
    });
  });

  /** Y 自动切换：勾选后立即重算并隐藏手动输入 */
  document.getElementById("yAuto").addEventListener("change", function () {
    var yManualRow = document.getElementById("yManualRow");
    yManualRow.style.display = this.checked ? "none" : "flex";
    if (this.checked) applyYAutoRange();
    redraw();
  });
  // 初始化隐藏状态
  document.getElementById("yManualRow").style.display = document.getElementById("yAuto").checked ? "none" : "flex";

  /** 显示选项 checkbox 联动 */
  ["Grid", "Axis", "Key", "Fill", "Anim"].forEach(function (suffix) {
    var el = document.getElementById("opt" + suffix);
    if (!el) return;
    var key = suffix === "Key" ? "keyPoints" : suffix.toLowerCase();
    el.addEventListener("change", function () {
      opts[key] = el.checked;
      // 动画时长行只在勾选动画后显示
      if (suffix === "Anim") {
        document.getElementById("animDurationRow").style.display = el.checked ? "flex" : "none";
      }
      redraw();
    });
  });
  // 初始化动画时长行隐藏
  document.getElementById("animDurationRow").style.display = document.getElementById("optAnim").checked ? "flex" : "none";

  /** 窗口尺寸变化时重建像素缓冲并重绘 */
  window.addEventListener("resize", function () {
    resizeCanvas();
    redraw();
  });

  /* ============================================================
   * 六、初始化
   * ============================================================ */
  resizeCanvas();
  // 默认 x 方向显示约 [-10, 10]
  var xMin0 = parseFloat(document.getElementById("xMin").value) || -10;
  var xMax0 = parseFloat(document.getElementById("xMax").value) || 10;
  if (xMax0 <= xMin0) { xMin0 = -10; xMax0 = 10; }
  view.scale = cssW / (xMax0 - xMin0);
  view.cx = (xMin0 + xMax0) / 2;
  addFunctionRow("sin(x)", PALETTE[0]);
  if (document.getElementById("yAuto").checked) applyYAutoRange();
  redraw();

  /* 舞台工具栏：⛶ 对 .graph-card 自身全屏，⚙ 收起左侧的 .side-card。
     交互与全屏状态回滚均由共享模块 tool-stage-toolbar.js 提供。 */
  if (window.EduToolStageToolbar) {
    window.EduToolStageToolbar.init({
      stage: ".graph-card",
      panelHost: "#graphLayout",
      hiddenClass: "setup-hidden"
    });
  }
})();
`
    },
    meta: {builtAt: "2026-09-28 11:07:05", sources: {"tools/function-graph/function-graph.css": "cc19164a68c9", "assets/css/tool-common.css": "d35dcf222690", "assets/js/frame-bridge.js": "1131903c1e46", "assets/js/tool-stage-toolbar.js": "30f2ddfe48d2", "tools/function-graph/function-graph.js": "35666d1cd785"}}
  };
})();