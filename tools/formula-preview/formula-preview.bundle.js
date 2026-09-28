/* 自动生成，请勿手改 —— 源：tools/formula-preview/  ·  构建：2026-09-28 11:07:05 */
/* 用途：file:// 离线场景下 fetch 被 CORS 拦截，站点改用 <script src> 加载本文件，
   拿到工具页面与本地 CSS/JS 文本后走与 http 相同的 Shadow DOM 组件化挂载。
   工具源码改动后请重跑：python .workbuddy/scripts/build_tool_bundles.py */
(function(){
  var g = window.EduToolboxToolBundles || (window.EduToolboxToolBundles = {});
  g["formula-preview"] = {
    html: `<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>公式预览 | EduToolbox · 数理公式计算<\/title>
<link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ctext y='.9em' font-size='90'%3E%F0%9F%8E%93%3C/text%3E%3C/svg%3E">
<link rel="stylesheet" href="../../assets/vendor/katex/katex.min.css">
<link rel="stylesheet" href="../../assets/css/tool-common.css">
<link rel="stylesheet" href="formula-preview.css">
<\/head>
<body>

<!-- 主体容器 -->
<main class="container">
  <div class="layout" id="formulaLayout">
    <!-- 左侧：模板库 -->
    <aside class="card side-card">
      <div class="side-head">
        <button type="button" class="btn btn-primary btn-block" id="btnBrowse" title="从模板库选择公式">📚 从模板库选择公式<\/button>
      <\/div>
      <div class="side-search">
        <input type="text" id="searchInput" placeholder="🔍 搜索公式名称…" spellcheck="false">
      <\/div>
      <nav class="tpl-nav" id="tplNav"><!-- 模板按钮由脚本生成 --><\/nav>
    <\/aside>

    <!-- 右侧：预览与参数 -->
    <section class="card main-card">
      <!-- 舞台右上角工具栏：⛶ 全屏 / ⚙ 隐藏设置（由共享模块 tool-stage-toolbar.js 接管） -->
      <div class="stage-toolbar">
        <button type="button" class="icon-btn" id="fullscreenBtn" title="全屏">⛶<\/button>
        <button type="button" class="icon-btn" id="hideSetupBtn" title="隐藏设置">⚙<\/button>
      <\/div>
      <div class="main-head">
        <h3 class="tpl-name" id="tplName">请选择公式<\/h3>
        <div class="view-tabs">
          <button type="button" class="tab-btn active" data-view="image">图像预览<\/button>
          <button type="button" class="tab-btn" data-view="text">文字预览<\/button>
        <\/div>
      <\/div>

      <div class="formula-box">
        <div id="formulaRender" class="formula-render"><\/div>
        <div id="formulaText" class="formula-text" hidden><\/div>
      <\/div>

      <div class="params-head">
        <span class="params-title">参数设置<\/span>
        <span class="params-current" id="paramsCurrent"><\/span>
      <\/div>
      <div class="params" id="paramsBox"><!-- 参数输入由脚本生成 --><\/div>

      <div class="result-row">
        <span class="result-label">📊 计算结果<\/span>
        <span class="result-value" id="resultValue">—<\/span>
      <\/div>

      <div class="graph-wrap" id="graphWrap">
        <div class="graph-head">
          <span class="graph-title" id="graphTitle">📈 函数图像<\/span>
          <div class="graph-range">
            <span>X 轴范围：<\/span>
            <input type="number" class="num-mini" id="gxMin" value="-10" step="any">
            <span class="range-sep">至<\/span>
            <input type="number" class="num-mini" id="gxMax" value="10" step="any">
            <span class="range-divider">|<\/span>
            <span>Y 轴范围：<\/span>
            <input type="number" class="num-mini" id="gyMin" value="-10" step="any">
            <span class="range-sep">至<\/span>
            <input type="number" class="num-mini" id="gyMax" value="10" step="any">
          <\/div>
        <\/div>
        <canvas id="miniCanvas"><\/canvas>
      <\/div>

      <div class="actions">
        <button type="button" class="btn btn-primary" id="btnRerender" title="重新渲染公式">🔄 重新渲染<\/button>
        <button type="button" class="btn" id="btnScreenshot" title="保存当前公式为 PNG">📸 保存截图<\/button>
        <button type="button" class="btn" id="btnCopyTex" title="复制代入数值后的 LaTeX">📋 复制 LaTeX<\/button>
      <\/div>

      <div class="op-hint">
        <strong>操作提示：<\/strong>
        1. 点击上方 <strong>“从模板库选择公式”<\/strong> 浏览并载入不同学科的经典数学与物理公式；
        2. 选择公式后系统自动提取参数，可拖拽滑块或在右侧输入框自定义参数值；
        3. 右侧面板将实时呈现代入参数后的公式排版，并动态绘制函数图像。
      <\/div>
    <\/section>
  <\/div>
<\/main>

<script src="../../assets/js/frame-bridge.js"><\/script>
<script src="../../assets/vendor/katex/katex.min.js"><\/script>
<script src="../../assets/js/tool-stage-toolbar.js"><\/script>
<script src="formula-preview.js"><\/script>
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
      "assets/vendor/katex/katex.min.css": `@font-face{font-family:KaTeX_AMS;font-style:normal;font-weight:400;src:url(assets/vendor/katex/fonts/KaTeX_AMS-Regular.woff2) format("woff2"),url(assets/vendor/katex/fonts/KaTeX_AMS-Regular.woff) format("woff"),url(assets/vendor/katex/fonts/KaTeX_AMS-Regular.ttf) format("truetype")}@font-face{font-family:KaTeX_Caligraphic;font-style:normal;font-weight:700;src:url(assets/vendor/katex/fonts/KaTeX_Caligraphic-Bold.woff2) format("woff2"),url(assets/vendor/katex/fonts/KaTeX_Caligraphic-Bold.woff) format("woff"),url(assets/vendor/katex/fonts/KaTeX_Caligraphic-Bold.ttf) format("truetype")}@font-face{font-family:KaTeX_Caligraphic;font-style:normal;font-weight:400;src:url(assets/vendor/katex/fonts/KaTeX_Caligraphic-Regular.woff2) format("woff2"),url(assets/vendor/katex/fonts/KaTeX_Caligraphic-Regular.woff) format("woff"),url(assets/vendor/katex/fonts/KaTeX_Caligraphic-Regular.ttf) format("truetype")}@font-face{font-family:KaTeX_Fraktur;font-style:normal;font-weight:700;src:url(assets/vendor/katex/fonts/KaTeX_Fraktur-Bold.woff2) format("woff2"),url(assets/vendor/katex/fonts/KaTeX_Fraktur-Bold.woff) format("woff"),url(assets/vendor/katex/fonts/KaTeX_Fraktur-Bold.ttf) format("truetype")}@font-face{font-family:KaTeX_Fraktur;font-style:normal;font-weight:400;src:url(assets/vendor/katex/fonts/KaTeX_Fraktur-Regular.woff2) format("woff2"),url(assets/vendor/katex/fonts/KaTeX_Fraktur-Regular.woff) format("woff"),url(assets/vendor/katex/fonts/KaTeX_Fraktur-Regular.ttf) format("truetype")}@font-face{font-family:KaTeX_Main;font-style:normal;font-weight:700;src:url(assets/vendor/katex/fonts/KaTeX_Main-Bold.woff2) format("woff2"),url(assets/vendor/katex/fonts/KaTeX_Main-Bold.woff) format("woff"),url(assets/vendor/katex/fonts/KaTeX_Main-Bold.ttf) format("truetype")}@font-face{font-family:KaTeX_Main;font-style:italic;font-weight:700;src:url(assets/vendor/katex/fonts/KaTeX_Main-BoldItalic.woff2) format("woff2"),url(assets/vendor/katex/fonts/KaTeX_Main-BoldItalic.woff) format("woff"),url(assets/vendor/katex/fonts/KaTeX_Main-BoldItalic.ttf) format("truetype")}@font-face{font-family:KaTeX_Main;font-style:italic;font-weight:400;src:url(assets/vendor/katex/fonts/KaTeX_Main-Italic.woff2) format("woff2"),url(assets/vendor/katex/fonts/KaTeX_Main-Italic.woff) format("woff"),url(assets/vendor/katex/fonts/KaTeX_Main-Italic.ttf) format("truetype")}@font-face{font-family:KaTeX_Main;font-style:normal;font-weight:400;src:url(assets/vendor/katex/fonts/KaTeX_Main-Regular.woff2) format("woff2"),url(assets/vendor/katex/fonts/KaTeX_Main-Regular.woff) format("woff"),url(assets/vendor/katex/fonts/KaTeX_Main-Regular.ttf) format("truetype")}@font-face{font-family:KaTeX_Math;font-style:italic;font-weight:700;src:url(assets/vendor/katex/fonts/KaTeX_Math-BoldItalic.woff2) format("woff2"),url(assets/vendor/katex/fonts/KaTeX_Math-BoldItalic.woff) format("woff"),url(assets/vendor/katex/fonts/KaTeX_Math-BoldItalic.ttf) format("truetype")}@font-face{font-family:KaTeX_Math;font-style:italic;font-weight:400;src:url(assets/vendor/katex/fonts/KaTeX_Math-Italic.woff2) format("woff2"),url(assets/vendor/katex/fonts/KaTeX_Math-Italic.woff) format("woff"),url(assets/vendor/katex/fonts/KaTeX_Math-Italic.ttf) format("truetype")}@font-face{font-family:"KaTeX_SansSerif";font-style:normal;font-weight:700;src:url(assets/vendor/katex/fonts/KaTeX_SansSerif-Bold.woff2) format("woff2"),url(assets/vendor/katex/fonts/KaTeX_SansSerif-Bold.woff) format("woff"),url(assets/vendor/katex/fonts/KaTeX_SansSerif-Bold.ttf) format("truetype")}@font-face{font-family:"KaTeX_SansSerif";font-style:italic;font-weight:400;src:url(assets/vendor/katex/fonts/KaTeX_SansSerif-Italic.woff2) format("woff2"),url(assets/vendor/katex/fonts/KaTeX_SansSerif-Italic.woff) format("woff"),url(assets/vendor/katex/fonts/KaTeX_SansSerif-Italic.ttf) format("truetype")}@font-face{font-family:"KaTeX_SansSerif";font-style:normal;font-weight:400;src:url(assets/vendor/katex/fonts/KaTeX_SansSerif-Regular.woff2) format("woff2"),url(assets/vendor/katex/fonts/KaTeX_SansSerif-Regular.woff) format("woff"),url(assets/vendor/katex/fonts/KaTeX_SansSerif-Regular.ttf) format("truetype")}@font-face{font-family:KaTeX_Script;font-style:normal;font-weight:400;src:url(assets/vendor/katex/fonts/KaTeX_Script-Regular.woff2) format("woff2"),url(assets/vendor/katex/fonts/KaTeX_Script-Regular.woff) format("woff"),url(assets/vendor/katex/fonts/KaTeX_Script-Regular.ttf) format("truetype")}@font-face{font-family:KaTeX_Size1;font-style:normal;font-weight:400;src:url(assets/vendor/katex/fonts/KaTeX_Size1-Regular.woff2) format("woff2"),url(assets/vendor/katex/fonts/KaTeX_Size1-Regular.woff) format("woff"),url(assets/vendor/katex/fonts/KaTeX_Size1-Regular.ttf) format("truetype")}@font-face{font-family:KaTeX_Size2;font-style:normal;font-weight:400;src:url(assets/vendor/katex/fonts/KaTeX_Size2-Regular.woff2) format("woff2"),url(assets/vendor/katex/fonts/KaTeX_Size2-Regular.woff) format("woff"),url(assets/vendor/katex/fonts/KaTeX_Size2-Regular.ttf) format("truetype")}@font-face{font-family:KaTeX_Size3;font-style:normal;font-weight:400;src:url(assets/vendor/katex/fonts/KaTeX_Size3-Regular.woff2) format("woff2"),url(assets/vendor/katex/fonts/KaTeX_Size3-Regular.woff) format("woff"),url(assets/vendor/katex/fonts/KaTeX_Size3-Regular.ttf) format("truetype")}@font-face{font-family:KaTeX_Size4;font-style:normal;font-weight:400;src:url(assets/vendor/katex/fonts/KaTeX_Size4-Regular.woff2) format("woff2"),url(assets/vendor/katex/fonts/KaTeX_Size4-Regular.woff) format("woff"),url(assets/vendor/katex/fonts/KaTeX_Size4-Regular.ttf) format("truetype")}@font-face{font-family:KaTeX_Typewriter;font-style:normal;font-weight:400;src:url(assets/vendor/katex/fonts/KaTeX_Typewriter-Regular.woff2) format("woff2"),url(assets/vendor/katex/fonts/KaTeX_Typewriter-Regular.woff) format("woff"),url(assets/vendor/katex/fonts/KaTeX_Typewriter-Regular.ttf) format("truetype")}.katex{text-rendering:auto;font:normal 1.21em KaTeX_Main,Times New Roman,serif;line-height:1.2;text-indent:0}.katex *{-ms-high-contrast-adjust:none!important;border-color:currentColor}.katex .katex-version:after{content:"0.16.9"}.katex .katex-mathml{clip:rect(1px,1px,1px,1px);border:0;height:1px;overflow:hidden;padding:0;position:absolute;width:1px}.katex .katex-html>.newline{display:block}.katex .base{position:relative;white-space:nowrap;width:-webkit-min-content;width:-moz-min-content;width:min-content}.katex .base,.katex .strut{display:inline-block}.katex .textbf{font-weight:700}.katex .textit{font-style:italic}.katex .textrm{font-family:KaTeX_Main}.katex .textsf{font-family:KaTeX_SansSerif}.katex .texttt{font-family:KaTeX_Typewriter}.katex .mathnormal{font-family:KaTeX_Math;font-style:italic}.katex .mathit{font-family:KaTeX_Main;font-style:italic}.katex .mathrm{font-style:normal}.katex .mathbf{font-family:KaTeX_Main;font-weight:700}.katex .boldsymbol{font-family:KaTeX_Math;font-style:italic;font-weight:700}.katex .amsrm,.katex .mathbb,.katex .textbb{font-family:KaTeX_AMS}.katex .mathcal{font-family:KaTeX_Caligraphic}.katex .mathfrak,.katex .textfrak{font-family:KaTeX_Fraktur}.katex .mathboldfrak,.katex .textboldfrak{font-family:KaTeX_Fraktur;font-weight:700}.katex .mathtt{font-family:KaTeX_Typewriter}.katex .mathscr,.katex .textscr{font-family:KaTeX_Script}.katex .mathsf,.katex .textsf{font-family:KaTeX_SansSerif}.katex .mathboldsf,.katex .textboldsf{font-family:KaTeX_SansSerif;font-weight:700}.katex .mathitsf,.katex .textitsf{font-family:KaTeX_SansSerif;font-style:italic}.katex .mainrm{font-family:KaTeX_Main;font-style:normal}.katex .vlist-t{border-collapse:collapse;display:inline-table;table-layout:fixed}.katex .vlist-r{display:table-row}.katex .vlist{display:table-cell;position:relative;vertical-align:bottom}.katex .vlist>span{display:block;height:0;position:relative}.katex .vlist>span>span{display:inline-block}.katex .vlist>span>.pstrut{overflow:hidden;width:0}.katex .vlist-t2{margin-right:-2px}.katex .vlist-s{display:table-cell;font-size:1px;min-width:2px;vertical-align:bottom;width:2px}.katex .vbox{align-items:baseline;display:inline-flex;flex-direction:column}.katex .hbox{width:100%}.katex .hbox,.katex .thinbox{display:inline-flex;flex-direction:row}.katex .thinbox{max-width:0;width:0}.katex .msupsub{text-align:left}.katex .mfrac>span>span{text-align:center}.katex .mfrac .frac-line{border-bottom-style:solid;display:inline-block;width:100%}.katex .hdashline,.katex .hline,.katex .mfrac .frac-line,.katex .overline .overline-line,.katex .rule,.katex .underline .underline-line{min-height:1px}.katex .mspace{display:inline-block}.katex .clap,.katex .llap,.katex .rlap{position:relative;width:0}.katex .clap>.inner,.katex .llap>.inner,.katex .rlap>.inner{position:absolute}.katex .clap>.fix,.katex .llap>.fix,.katex .rlap>.fix{display:inline-block}.katex .llap>.inner{right:0}.katex .clap>.inner,.katex .rlap>.inner{left:0}.katex .clap>.inner>span{margin-left:-50%;margin-right:50%}.katex .rule{border:0 solid;display:inline-block;position:relative}.katex .hline,.katex .overline .overline-line,.katex .underline .underline-line{border-bottom-style:solid;display:inline-block;width:100%}.katex .hdashline{border-bottom-style:dashed;display:inline-block;width:100%}.katex .sqrt>.root{margin-left:.27777778em;margin-right:-.55555556em}.katex .fontsize-ensurer.reset-size1.size1,.katex .sizing.reset-size1.size1{font-size:1em}.katex .fontsize-ensurer.reset-size1.size2,.katex .sizing.reset-size1.size2{font-size:1.2em}.katex .fontsize-ensurer.reset-size1.size3,.katex .sizing.reset-size1.size3{font-size:1.4em}.katex .fontsize-ensurer.reset-size1.size4,.katex .sizing.reset-size1.size4{font-size:1.6em}.katex .fontsize-ensurer.reset-size1.size5,.katex .sizing.reset-size1.size5{font-size:1.8em}.katex .fontsize-ensurer.reset-size1.size6,.katex .sizing.reset-size1.size6{font-size:2em}.katex .fontsize-ensurer.reset-size1.size7,.katex .sizing.reset-size1.size7{font-size:2.4em}.katex .fontsize-ensurer.reset-size1.size8,.katex .sizing.reset-size1.size8{font-size:2.88em}.katex .fontsize-ensurer.reset-size1.size9,.katex .sizing.reset-size1.size9{font-size:3.456em}.katex .fontsize-ensurer.reset-size1.size10,.katex .sizing.reset-size1.size10{font-size:4.148em}.katex .fontsize-ensurer.reset-size1.size11,.katex .sizing.reset-size1.size11{font-size:4.976em}.katex .fontsize-ensurer.reset-size2.size1,.katex .sizing.reset-size2.size1{font-size:.83333333em}.katex .fontsize-ensurer.reset-size2.size2,.katex .sizing.reset-size2.size2{font-size:1em}.katex .fontsize-ensurer.reset-size2.size3,.katex .sizing.reset-size2.size3{font-size:1.16666667em}.katex .fontsize-ensurer.reset-size2.size4,.katex .sizing.reset-size2.size4{font-size:1.33333333em}.katex .fontsize-ensurer.reset-size2.size5,.katex .sizing.reset-size2.size5{font-size:1.5em}.katex .fontsize-ensurer.reset-size2.size6,.katex .sizing.reset-size2.size6{font-size:1.66666667em}.katex .fontsize-ensurer.reset-size2.size7,.katex .sizing.reset-size2.size7{font-size:2em}.katex .fontsize-ensurer.reset-size2.size8,.katex .sizing.reset-size2.size8{font-size:2.4em}.katex .fontsize-ensurer.reset-size2.size9,.katex .sizing.reset-size2.size9{font-size:2.88em}.katex .fontsize-ensurer.reset-size2.size10,.katex .sizing.reset-size2.size10{font-size:3.45666667em}.katex .fontsize-ensurer.reset-size2.size11,.katex .sizing.reset-size2.size11{font-size:4.14666667em}.katex .fontsize-ensurer.reset-size3.size1,.katex .sizing.reset-size3.size1{font-size:.71428571em}.katex .fontsize-ensurer.reset-size3.size2,.katex .sizing.reset-size3.size2{font-size:.85714286em}.katex .fontsize-ensurer.reset-size3.size3,.katex .sizing.reset-size3.size3{font-size:1em}.katex .fontsize-ensurer.reset-size3.size4,.katex .sizing.reset-size3.size4{font-size:1.14285714em}.katex .fontsize-ensurer.reset-size3.size5,.katex .sizing.reset-size3.size5{font-size:1.28571429em}.katex .fontsize-ensurer.reset-size3.size6,.katex .sizing.reset-size3.size6{font-size:1.42857143em}.katex .fontsize-ensurer.reset-size3.size7,.katex .sizing.reset-size3.size7{font-size:1.71428571em}.katex .fontsize-ensurer.reset-size3.size8,.katex .sizing.reset-size3.size8{font-size:2.05714286em}.katex .fontsize-ensurer.reset-size3.size9,.katex .sizing.reset-size3.size9{font-size:2.46857143em}.katex .fontsize-ensurer.reset-size3.size10,.katex .sizing.reset-size3.size10{font-size:2.96285714em}.katex .fontsize-ensurer.reset-size3.size11,.katex .sizing.reset-size3.size11{font-size:3.55428571em}.katex .fontsize-ensurer.reset-size4.size1,.katex .sizing.reset-size4.size1{font-size:.625em}.katex .fontsize-ensurer.reset-size4.size2,.katex .sizing.reset-size4.size2{font-size:.75em}.katex .fontsize-ensurer.reset-size4.size3,.katex .sizing.reset-size4.size3{font-size:.875em}.katex .fontsize-ensurer.reset-size4.size4,.katex .sizing.reset-size4.size4{font-size:1em}.katex .fontsize-ensurer.reset-size4.size5,.katex .sizing.reset-size4.size5{font-size:1.125em}.katex .fontsize-ensurer.reset-size4.size6,.katex .sizing.reset-size4.size6{font-size:1.25em}.katex .fontsize-ensurer.reset-size4.size7,.katex .sizing.reset-size4.size7{font-size:1.5em}.katex .fontsize-ensurer.reset-size4.size8,.katex .sizing.reset-size4.size8{font-size:1.8em}.katex .fontsize-ensurer.reset-size4.size9,.katex .sizing.reset-size4.size9{font-size:2.16em}.katex .fontsize-ensurer.reset-size4.size10,.katex .sizing.reset-size4.size10{font-size:2.5925em}.katex .fontsize-ensurer.reset-size4.size11,.katex .sizing.reset-size4.size11{font-size:3.11em}.katex .fontsize-ensurer.reset-size5.size1,.katex .sizing.reset-size5.size1{font-size:.55555556em}.katex .fontsize-ensurer.reset-size5.size2,.katex .sizing.reset-size5.size2{font-size:.66666667em}.katex .fontsize-ensurer.reset-size5.size3,.katex .sizing.reset-size5.size3{font-size:.77777778em}.katex .fontsize-ensurer.reset-size5.size4,.katex .sizing.reset-size5.size4{font-size:.88888889em}.katex .fontsize-ensurer.reset-size5.size5,.katex .sizing.reset-size5.size5{font-size:1em}.katex .fontsize-ensurer.reset-size5.size6,.katex .sizing.reset-size5.size6{font-size:1.11111111em}.katex .fontsize-ensurer.reset-size5.size7,.katex .sizing.reset-size5.size7{font-size:1.33333333em}.katex .fontsize-ensurer.reset-size5.size8,.katex .sizing.reset-size5.size8{font-size:1.6em}.katex .fontsize-ensurer.reset-size5.size9,.katex .sizing.reset-size5.size9{font-size:1.92em}.katex .fontsize-ensurer.reset-size5.size10,.katex .sizing.reset-size5.size10{font-size:2.30444444em}.katex .fontsize-ensurer.reset-size5.size11,.katex .sizing.reset-size5.size11{font-size:2.76444444em}.katex .fontsize-ensurer.reset-size6.size1,.katex .sizing.reset-size6.size1{font-size:.5em}.katex .fontsize-ensurer.reset-size6.size2,.katex .sizing.reset-size6.size2{font-size:.6em}.katex .fontsize-ensurer.reset-size6.size3,.katex .sizing.reset-size6.size3{font-size:.7em}.katex .fontsize-ensurer.reset-size6.size4,.katex .sizing.reset-size6.size4{font-size:.8em}.katex .fontsize-ensurer.reset-size6.size5,.katex .sizing.reset-size6.size5{font-size:.9em}.katex .fontsize-ensurer.reset-size6.size6,.katex .sizing.reset-size6.size6{font-size:1em}.katex .fontsize-ensurer.reset-size6.size7,.katex .sizing.reset-size6.size7{font-size:1.2em}.katex .fontsize-ensurer.reset-size6.size8,.katex .sizing.reset-size6.size8{font-size:1.44em}.katex .fontsize-ensurer.reset-size6.size9,.katex .sizing.reset-size6.size9{font-size:1.728em}.katex .fontsize-ensurer.reset-size6.size10,.katex .sizing.reset-size6.size10{font-size:2.074em}.katex .fontsize-ensurer.reset-size6.size11,.katex .sizing.reset-size6.size11{font-size:2.488em}.katex .fontsize-ensurer.reset-size7.size1,.katex .sizing.reset-size7.size1{font-size:.41666667em}.katex .fontsize-ensurer.reset-size7.size2,.katex .sizing.reset-size7.size2{font-size:.5em}.katex .fontsize-ensurer.reset-size7.size3,.katex .sizing.reset-size7.size3{font-size:.58333333em}.katex .fontsize-ensurer.reset-size7.size4,.katex .sizing.reset-size7.size4{font-size:.66666667em}.katex .fontsize-ensurer.reset-size7.size5,.katex .sizing.reset-size7.size5{font-size:.75em}.katex .fontsize-ensurer.reset-size7.size6,.katex .sizing.reset-size7.size6{font-size:.83333333em}.katex .fontsize-ensurer.reset-size7.size7,.katex .sizing.reset-size7.size7{font-size:1em}.katex .fontsize-ensurer.reset-size7.size8,.katex .sizing.reset-size7.size8{font-size:1.2em}.katex .fontsize-ensurer.reset-size7.size9,.katex .sizing.reset-size7.size9{font-size:1.44em}.katex .fontsize-ensurer.reset-size7.size10,.katex .sizing.reset-size7.size10{font-size:1.72833333em}.katex .fontsize-ensurer.reset-size7.size11,.katex .sizing.reset-size7.size11{font-size:2.07333333em}.katex .fontsize-ensurer.reset-size8.size1,.katex .sizing.reset-size8.size1{font-size:.34722222em}.katex .fontsize-ensurer.reset-size8.size2,.katex .sizing.reset-size8.size2{font-size:.41666667em}.katex .fontsize-ensurer.reset-size8.size3,.katex .sizing.reset-size8.size3{font-size:.48611111em}.katex .fontsize-ensurer.reset-size8.size4,.katex .sizing.reset-size8.size4{font-size:.55555556em}.katex .fontsize-ensurer.reset-size8.size5,.katex .sizing.reset-size8.size5{font-size:.625em}.katex .fontsize-ensurer.reset-size8.size6,.katex .sizing.reset-size8.size6{font-size:.69444444em}.katex .fontsize-ensurer.reset-size8.size7,.katex .sizing.reset-size8.size7{font-size:.83333333em}.katex .fontsize-ensurer.reset-size8.size8,.katex .sizing.reset-size8.size8{font-size:1em}.katex .fontsize-ensurer.reset-size8.size9,.katex .sizing.reset-size8.size9{font-size:1.2em}.katex .fontsize-ensurer.reset-size8.size10,.katex .sizing.reset-size8.size10{font-size:1.44027778em}.katex .fontsize-ensurer.reset-size8.size11,.katex .sizing.reset-size8.size11{font-size:1.72777778em}.katex .fontsize-ensurer.reset-size9.size1,.katex .sizing.reset-size9.size1{font-size:.28935185em}.katex .fontsize-ensurer.reset-size9.size2,.katex .sizing.reset-size9.size2{font-size:.34722222em}.katex .fontsize-ensurer.reset-size9.size3,.katex .sizing.reset-size9.size3{font-size:.40509259em}.katex .fontsize-ensurer.reset-size9.size4,.katex .sizing.reset-size9.size4{font-size:.46296296em}.katex .fontsize-ensurer.reset-size9.size5,.katex .sizing.reset-size9.size5{font-size:.52083333em}.katex .fontsize-ensurer.reset-size9.size6,.katex .sizing.reset-size9.size6{font-size:.5787037em}.katex .fontsize-ensurer.reset-size9.size7,.katex .sizing.reset-size9.size7{font-size:.69444444em}.katex .fontsize-ensurer.reset-size9.size8,.katex .sizing.reset-size9.size8{font-size:.83333333em}.katex .fontsize-ensurer.reset-size9.size9,.katex .sizing.reset-size9.size9{font-size:1em}.katex .fontsize-ensurer.reset-size9.size10,.katex .sizing.reset-size9.size10{font-size:1.20023148em}.katex .fontsize-ensurer.reset-size9.size11,.katex .sizing.reset-size9.size11{font-size:1.43981481em}.katex .fontsize-ensurer.reset-size10.size1,.katex .sizing.reset-size10.size1{font-size:.24108004em}.katex .fontsize-ensurer.reset-size10.size2,.katex .sizing.reset-size10.size2{font-size:.28929605em}.katex .fontsize-ensurer.reset-size10.size3,.katex .sizing.reset-size10.size3{font-size:.33751205em}.katex .fontsize-ensurer.reset-size10.size4,.katex .sizing.reset-size10.size4{font-size:.38572806em}.katex .fontsize-ensurer.reset-size10.size5,.katex .sizing.reset-size10.size5{font-size:.43394407em}.katex .fontsize-ensurer.reset-size10.size6,.katex .sizing.reset-size10.size6{font-size:.48216008em}.katex .fontsize-ensurer.reset-size10.size7,.katex .sizing.reset-size10.size7{font-size:.57859209em}.katex .fontsize-ensurer.reset-size10.size8,.katex .sizing.reset-size10.size8{font-size:.69431051em}.katex .fontsize-ensurer.reset-size10.size9,.katex .sizing.reset-size10.size9{font-size:.83317261em}.katex .fontsize-ensurer.reset-size10.size10,.katex .sizing.reset-size10.size10{font-size:1em}.katex .fontsize-ensurer.reset-size10.size11,.katex .sizing.reset-size10.size11{font-size:1.19961427em}.katex .fontsize-ensurer.reset-size11.size1,.katex .sizing.reset-size11.size1{font-size:.20096463em}.katex .fontsize-ensurer.reset-size11.size2,.katex .sizing.reset-size11.size2{font-size:.24115756em}.katex .fontsize-ensurer.reset-size11.size3,.katex .sizing.reset-size11.size3{font-size:.28135048em}.katex .fontsize-ensurer.reset-size11.size4,.katex .sizing.reset-size11.size4{font-size:.32154341em}.katex .fontsize-ensurer.reset-size11.size5,.katex .sizing.reset-size11.size5{font-size:.36173633em}.katex .fontsize-ensurer.reset-size11.size6,.katex .sizing.reset-size11.size6{font-size:.40192926em}.katex .fontsize-ensurer.reset-size11.size7,.katex .sizing.reset-size11.size7{font-size:.48231511em}.katex .fontsize-ensurer.reset-size11.size8,.katex .sizing.reset-size11.size8{font-size:.57877814em}.katex .fontsize-ensurer.reset-size11.size9,.katex .sizing.reset-size11.size9{font-size:.69453376em}.katex .fontsize-ensurer.reset-size11.size10,.katex .sizing.reset-size11.size10{font-size:.83360129em}.katex .fontsize-ensurer.reset-size11.size11,.katex .sizing.reset-size11.size11{font-size:1em}.katex .delimsizing.size1{font-family:KaTeX_Size1}.katex .delimsizing.size2{font-family:KaTeX_Size2}.katex .delimsizing.size3{font-family:KaTeX_Size3}.katex .delimsizing.size4{font-family:KaTeX_Size4}.katex .delimsizing.mult .delim-size1>span{font-family:KaTeX_Size1}.katex .delimsizing.mult .delim-size4>span{font-family:KaTeX_Size4}.katex .nulldelimiter{display:inline-block;width:.12em}.katex .delimcenter,.katex .op-symbol{position:relative}.katex .op-symbol.small-op{font-family:KaTeX_Size1}.katex .op-symbol.large-op{font-family:KaTeX_Size2}.katex .accent>.vlist-t,.katex .op-limits>.vlist-t{text-align:center}.katex .accent .accent-body{position:relative}.katex .accent .accent-body:not(.accent-full){width:0}.katex .overlay{display:block}.katex .mtable .vertical-separator{display:inline-block;min-width:1px}.katex .mtable .arraycolsep{display:inline-block}.katex .mtable .col-align-c>.vlist-t{text-align:center}.katex .mtable .col-align-l>.vlist-t{text-align:left}.katex .mtable .col-align-r>.vlist-t{text-align:right}.katex .svg-align{text-align:left}.katex svg{fill:currentColor;stroke:currentColor;fill-rule:nonzero;fill-opacity:1;stroke-width:1;stroke-linecap:butt;stroke-linejoin:miter;stroke-miterlimit:4;stroke-dasharray:none;stroke-dashoffset:0;stroke-opacity:1;display:block;height:inherit;position:absolute;width:100%}.katex svg path{stroke:none}.katex img{border-style:none;max-height:none;max-width:none;min-height:0;min-width:0}.katex .stretchy{display:block;overflow:hidden;position:relative;width:100%}.katex .stretchy:after,.katex .stretchy:before{content:""}.katex .hide-tail{overflow:hidden;position:relative;width:100%}.katex .halfarrow-left{left:0;overflow:hidden;position:absolute;width:50.2%}.katex .halfarrow-right{overflow:hidden;position:absolute;right:0;width:50.2%}.katex .brace-left{left:0;overflow:hidden;position:absolute;width:25.1%}.katex .brace-center{left:25%;overflow:hidden;position:absolute;width:50%}.katex .brace-right{overflow:hidden;position:absolute;right:0;width:25.1%}.katex .x-arrow-pad{padding:0 .5em}.katex .cd-arrow-pad{padding:0 .55556em 0 .27778em}.katex .mover,.katex .munder,.katex .x-arrow{text-align:center}.katex .boxpad{padding:0 .3em}.katex .fbox,.katex .fcolorbox{border:.04em solid;box-sizing:border-box}.katex .cancel-pad{padding:0 .2em}.katex .cancel-lap{margin-left:-.2em;margin-right:-.2em}.katex .sout{border-bottom-style:solid;border-bottom-width:.08em}.katex .angl{border-right:.049em solid;border-top:.049em solid;box-sizing:border-box;margin-right:.03889em}.katex .anglpad{padding:0 .03889em}.katex .eqn-num:before{content:"(" counter(katexEqnNo) ")";counter-increment:katexEqnNo}.katex .mml-eqn-num:before{content:"(" counter(mmlEqnNo) ")";counter-increment:mmlEqnNo}.katex .mtr-glue{width:50%}.katex .cd-vert-arrow{display:inline-block;position:relative}.katex .cd-label-left{display:inline-block;position:absolute;right:calc(50% + .3em);text-align:left}.katex .cd-label-right{display:inline-block;left:calc(50% + .3em);position:absolute;text-align:right}.katex-display{display:block;margin:1em 0;text-align:center}.katex-display>.katex{display:block;text-align:center;white-space:nowrap}.katex-display>.katex>.katex-html{display:block;position:relative}.katex-display>.katex>.katex-html>.tag{position:absolute;right:0}.katex-display.leqno>.katex>.katex-html>.tag{left:0;right:auto}.katex-display.fleqn>.katex{padding-left:2em;text-align:left}body{counter-reset:katexEqnNo mmlEqnNo}
`,
      "tools/formula-preview/formula-preview.css": `/* ============================================================================
 * 公式预览 · formula-preview.css
 * 仅包含本工具特有样式：双栏布局 / 模板库侧栏 / 公式渲染区 / 参数滑块组 /
 *                       计算结果行 / 内嵌函数图像 / 操作提示
 * 公共底座（reset、按钮、卡片、表单、stage、modal、toast）见 tool-common.css
 * 高度策略：所有容器高度自动撑开，仅 body 主滚动条；侧栏模板列表自然撑开
 * ========================================================================== */

/* ---------------------------------------------------------------------------
 * 一、覆盖 .layout：本工具需要左侧固定栏 + 右侧主区
 * ------------------------------------------------------------------------- */
#app .layout,
.layout {
  grid-template-columns: 280px minmax(0, 1fr);
  gap: 20px;
  max-width: 1280px;
}

@media (max-width: 900px) {
  #app .layout,
  .layout { grid-template-columns: 1fr; }
}

/* ⚙ 隐藏设置态：双栏容器带 .setup-hidden 时改为单栏并收起左侧模板库 */
#app .layout.setup-hidden,
.layout.setup-hidden {
  grid-template-columns: minmax(0, 1fr);
}
.layout.setup-hidden .side-card {
  display: none;
}

/* ---------------------------------------------------------------------------
 * 二、左侧模板库侧栏
 * ------------------------------------------------------------------------- */
.side-card {
  display: flex;
  flex-direction: column;
  gap: 14px;
  padding: 18px 16px;
  min-width: 0;
}

.side-head .btn-block {
  display: flex;
  width: 100%;
  justify-content: center;
  padding: 11px 16px;
  font-size: 14px;
}

.side-search input { font-size: 13.5px; }

/* 模板分类标题 */
.tpl-nav {
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
}

.cat-title {
  margin: 12px 0 4px;
  padding: 4px 6px;
  font-size: 13px;
  font-weight: 700;
  color: var(--text-3);
  letter-spacing: 0.04em;
}
.cat-title:first-child { margin-top: 0; }

/* 单个模板按钮：左对齐文字、悬停高亮、选中态主色 */
.tpl-btn {
  width: 100%;
  padding: 9px 12px;
  font-size: 13.5px;
  font-weight: 500;
  text-align: left;
  color: var(--text-2);
  background: var(--card-bg);
  border: 1px solid var(--border);
  border-radius: var(--r-sm);
  cursor: pointer;
  transition: all var(--t-fast) var(--ease);
  white-space: normal;
  word-break: break-word;
}
.tpl-btn:hover {
  color: var(--primary);
  border-color: var(--primary-soft-2);
  background: var(--primary-soft);
  transform: translateX(2px);
}
.tpl-btn.active {
  color: #fff;
  background: var(--primary-grad);
  border-color: transparent;
  box-shadow: var(--shadow-primary);
}

/* ---------------------------------------------------------------------------
 * 三、右侧主区
 * ------------------------------------------------------------------------- */
.main-card {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 18px;
  padding: 22px 24px;
  min-width: 0;
}

/* 舞台 .main-card 自身进入全屏：铺满视口，去掉圆角与投影 */
.main-card:fullscreen,
.main-card:-webkit-full-screen,
.main-card.edutf-solo{
  padding: 32px 36px;
  border: none;
  border-radius: 0;
  box-shadow: none;
  background: var(--card-bg);
  /* 参数较多时可能超出一屏，舞台全屏后没有 body 滚动条，这里让舞台自己滚动 */
  overflow: auto;
}
.main-card:fullscreen::backdrop,
.main-card:-webkit-full-screen::backdrop,
.main-card.edutf-solo::backdrop{
  background: var(--bg);
}

.main-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  flex-wrap: wrap;
}

.tpl-name {
  font-size: 18px;
  font-weight: 800;
  color: var(--text-1);
}

/* 视图切换标签 */
.view-tabs {
  display: inline-flex;
  gap: 4px;
  padding: 4px;
  background: var(--bg-soft);
  border: 1px solid var(--border);
  border-radius: var(--r-pill);
}
.tab-btn {
  padding: 7px 16px;
  font-size: 13px;
  font-weight: 600;
  color: var(--text-2);
  background: transparent;
  border: none;
  border-radius: var(--r-pill);
  cursor: pointer;
  transition: all var(--t-fast) var(--ease);
}
.tab-btn:hover { color: var(--primary); background: var(--card-bg); }
.tab-btn.active {
  color: #fff;
  background: var(--primary-grad);
  box-shadow: var(--shadow-primary);
}

/* ---------------------------------------------------------------------------
 * 四、公式渲染区
 * ------------------------------------------------------------------------- */
.formula-box {
  position: relative;
  padding: 32px 24px;
  background: linear-gradient(180deg, #fbfcff 0%, #f5f8ff 100%);
  border: 1px solid var(--border);
  border-radius: var(--r);
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.6);
  min-height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow-x: auto;     /* 公式过宽时允许横向滚动，不撑破布局 */
  overflow-y: visible;
}

.formula-render {
  width: 100%;
  text-align: center;
  font-size: 24px;
  color: var(--text-1);
  line-height: 1.6;
}
.formula-render:empty::before {
  content: "请从左侧选择公式模板";
  color: var(--text-3);
  font-size: 14px;
}

.formula-text {
  width: 100%;
  text-align: center;
  font-family: Consolas, Menlo, monospace;
  font-size: 16px;
  color: var(--text-2);
  line-height: 1.7;
  word-break: break-word;
  white-space: pre-wrap;
}

/* ---------------------------------------------------------------------------
 * 五、参数设置区
 * ------------------------------------------------------------------------- */
.params-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
  padding-bottom: 8px;
  border-bottom: 1px dashed var(--border);
}
.params-title {
  font-size: 14.5px;
  font-weight: 700;
  color: var(--text-1);
}
.params-current {
  font-size: 12.5px;
  color: var(--text-3);
  font-variant-numeric: tabular-nums;
  word-break: break-all;
  text-align: right;
  max-width: 70%;
}

/* 参数网格：自动适配列数 */
.params {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 12px;
}

.param-item {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 12px 14px;
  background: var(--card-bg-2);
  border: 1px solid var(--border);
  border-radius: var(--r-sm);
}
.param-item label {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  font-size: 13px;
  font-weight: 600;
  color: var(--text-2);
}
.param-item input[type="range"] { width: 100%; }
.param-item input[type="number"] {
  width: 100%;
  padding: 7px 10px;
  font-size: 13.5px;
  font-weight: 700;
  text-align: center;
}

/* ---------------------------------------------------------------------------
 * 六、计算结果行
 * ------------------------------------------------------------------------- */
.result-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  flex-wrap: wrap;
  padding: 14px 18px;
  background: linear-gradient(135deg, rgba(59, 110, 246, 0.06), rgba(56, 163, 232, 0.04));
  border: 1px solid var(--primary-soft-2);
  border-radius: var(--r);
}
.result-label {
  font-size: 14px;
  font-weight: 700;
  color: var(--text-2);
  flex-shrink: 0;
}
.result-value {
  font-size: clamp(18px, 2.4vw, 24px);
  font-weight: 800;
  color: var(--primary);
  font-variant-numeric: tabular-nums;
  letter-spacing: -0.01em;
  text-align: right;
  word-break: break-all;
  flex: 1;
  min-width: 0;
}
.result-value .unit {
  display: inline-block;
  margin-left: 6px;
  padding: 2px 9px;
  font-size: 12px;
  font-weight: 600;
  color: var(--primary);
  background: var(--primary-soft);
  border-radius: var(--r-pill);
  vertical-align: middle;
}

/* ---------------------------------------------------------------------------
 * 七、函数图像区（仅 graph 模板显示）
 * ------------------------------------------------------------------------- */
.graph-wrap {
  display: none;
  flex-direction: column;
  gap: 10px;
  padding: 16px;
  background: var(--card-bg);
  border: 1px solid var(--border);
  border-radius: var(--r);
  box-shadow: var(--shadow-sm);
}
.graph-wrap.show { display: flex; }

.graph-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
}
.graph-title {
  font-size: 14.5px;
  font-weight: 700;
  color: var(--text-1);
}
.graph-range {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
  font-size: 12.5px;
  color: var(--text-3);
}
.graph-range input.num-mini {
  width: 60px;
  padding: 5px 8px;
  font-size: 12.5px;
  font-weight: 600;
  text-align: center;
}
.range-divider {
  color: var(--border-2);
  padding: 0 4px;
}

#miniCanvas {
  width: 100%;
  height: 280px;
  background: #fff;
  border: 1px solid var(--border);
  border-radius: var(--r-sm);
}

/* ---------------------------------------------------------------------------
 * 八、操作按钮区与提示
 * ------------------------------------------------------------------------- */
.main-card .actions {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  justify-content: center;
  margin-top: 4px;
}

.op-hint {
  padding: 12px 16px;
  font-size: 13px;
  line-height: 1.8;
  color: var(--text-2);
  background: var(--bg-soft);
  border-left: 3px solid var(--primary);
  border-radius: var(--r-sm);
}
.op-hint strong { color: var(--text-1); font-weight: 700; }

/* ---------------------------------------------------------------------------
 * 九、小屏微调
 * ------------------------------------------------------------------------- */
@media (max-width: 640px) {
  .main-card { padding: 16px; }
  .formula-box { padding: 20px 12px; }
  .params { grid-template-columns: 1fr; }
  .params-current { max-width: 100%; text-align: left; }
}

/* ---------- 顶部工具栏已移除：全屏按钮迁入舞台右上角的 .stage-toolbar ---------- */
`,
      "tools/formula-preview/formula-preview.js": `/**
 * 公式预览与计算工具 (formula-preview.js)
 * 功能：30 个中小学数学/物理/化学公式模板，参数实时代入、KaTeX 渲染、数值结果计算，
 *       一次函数与二次函数附带内嵌 Canvas 图像；支持图像/文字预览切换、X/Y 范围调节、
 *       重新渲染、保存截图、复制 LaTeX。
 * 视觉参考：https://classtool.cn/formula-preview/
 */
(function () {
  "use strict";

  /** 按 id 获取元素 */
  function $(id) { return document.getElementById(id); }

  /**
   * 数字格式化为整洁字符串（最多保留 6 位小数，超大/超小用科学记数法）
   * 入参：v 数字
   * 返回值：string
   */
  function fmt(v) {
    if (!isFinite(v)) return "无效";
    if (v === 0) return "0";
    var av = Math.abs(v);
    if (av >= 1e9 || av < 1e-6) return v.toExponential(3).replace(/\\.?0+e/, "e");
    return String(parseFloat(v.toFixed(6)));
  }

  /**
   * 生成多项式单项文本（LaTeX），自动处理正负号与系数 1
   * 入参：coef 系数；power 次数(0/1/2)；isFirst 是否首项
   * 返回值：string 单项文本
   */
  function polyTerm(coef, power, isFirst) {
    var sign = coef < 0 ? (isFirst ? "-" : " - ") : (isFirst ? "" : " + ");
    var ac = Math.abs(coef);
    var core;
    if (power === 0) {
      core = fmt(ac);
    } else {
      core = (ac === 1 ? "" : fmt(ac)) + (power === 1 ? "x" : "x^{2}");
    }
    return sign + core;
  }

  /**
   * 组装一次/二次多项式右侧表达式
   * 入参：coeffs 系数数组（按次数从高到低，每项 {c:系数,p:次数}）
   * 返回值：string 如 x^{2} - 3x + 2
   */
  function polyText(coeffs) {
    var parts = [];
    coeffs.forEach(function (item) {
      if (item.c !== 0) parts.push(polyTerm(item.c, item.p, parts.length === 0));
    });
    return parts.length ? parts.join("") : "0";
  }

  /**
   * 模板定义：params 为参数（k 键名/label 中文名/def 默认值/min/max/step 滑块范围），
   * render(v) 返回 {tex:LaTeX, value:结果文本, unit:单位, invalid:非法提示}
   * graph 字段可选：linear/quad 表示附带函数图像
   */
  var TEMPLATES = [
    /* —————— 数学 —————— */
    {
      cat: "📐 数学", name: "一次函数 y = kx + b", graph: "linear",
      params: [
        { k: "k", label: "斜率 k", def: 2, min: -10, max: 10, step: 0.1 },
        { k: "b", label: "截距 b", def: 1, min: -10, max: 10, step: 0.1 }
      ],
      render: function (v) {
        var t = polyText([{ c: v.k, p: 1 }, { c: v.b, p: 0 }]);
        return { tex: "y = " + t, value: "y = " + t, unit: "（函数式）" };
      }
    },
    {
      cat: "📐 数学", name: "二次函数 y = ax² + bx + c", graph: "quad",
      params: [
        { k: "a", label: "二次项系数 a", def: 1, min: -5, max: 5, step: 0.1 },
        { k: "b", label: "一次项系数 b", def: -3, min: -10, max: 10, step: 0.1 },
        { k: "c", label: "常数项 c", def: 2, min: -10, max: 10, step: 0.1 }
      ],
      render: function (v) {
        var t = polyText([{ c: v.a, p: 2 }, { c: v.b, p: 1 }, { c: v.c, p: 0 }]);
        return { tex: "y = " + t, value: "y = " + t, unit: "（函数式）" };
      }
    },
    {
      cat: "📐 数学", name: "一元二次方程求根", graph: null,
      params: [
        { k: "a", label: "系数 a（≠0）", def: 1, min: -5, max: 5, step: 0.1 },
        { k: "b", label: "系数 b", def: -5, min: -10, max: 10, step: 0.1 },
        { k: "c", label: "系数 c", def: 6, min: -10, max: 10, step: 0.1 }
      ],
      render: function (v) {
        if (v.a === 0) return { invalid: "a 不能为 0" };
        var d = v.b * v.b - 4 * v.a * v.c;
        var base = "x = \\\\frac{" + fmt(-v.b) + " \\\\pm \\\\sqrt{\\\\Delta}}{2 \\\\times " + fmt(v.a) +
          "},\\\\quad \\\\Delta = " + fmt(d);
        if (d < 0) {
          return { tex: base, value: "无实数根（Δ = " + fmt(d) + " < 0）", unit: "" };
        }
        var r1 = (-v.b + Math.sqrt(d)) / (2 * v.a);
        var r2 = (-v.b - Math.sqrt(d)) / (2 * v.a);
        if (d === 0) {
          return { tex: base + ",\\\\quad x = " + fmt(r1), value: "x = " + fmt(r1) + "（两个相等实根）", unit: "" };
        }
        return {
          tex: base + ",\\\\quad x_1 = " + fmt(r1) + ",\\\\; x_2 = " + fmt(r2),
          value: "x₁ = " + fmt(r1) + "，x₂ = " + fmt(r2), unit: ""
        };
      }
    },
    {
      cat: "📐 数学", name: "一元二次方程判别式", graph: null,
      params: [
        { k: "a", label: "系数 a", def: 1, min: -5, max: 5, step: 0.1 },
        { k: "b", label: "系数 b", def: -5, min: -10, max: 10, step: 0.1 },
        { k: "c", label: "系数 c", def: 6, min: -10, max: 10, step: 0.1 }
      ],
      render: function (v) {
        var d = v.b * v.b - 4 * v.a * v.c;
        var note = d > 0 ? "Δ > 0，两个不相等实数根" : d === 0 ? "Δ = 0，两个相等实数根" : "Δ < 0，无实数根";
        return {
          tex: "\\\\Delta = b^{2} - 4ac = " + fmt(v.b) + "^{2} - 4 \\\\times " + fmt(v.a) +
            " \\\\times " + fmt(v.c) + " = " + fmt(d),
          value: fmt(d) + "（" + note + "）", unit: ""
        };
      }
    },
    {
      cat: "📐 数学", name: "等差数列通项", graph: null,
      params: [
        { k: "a1", label: "首项 a₁", def: 2, min: -50, max: 50, step: 0.5 },
        { k: "d", label: "公差 d", def: 3, min: -20, max: 20, step: 0.5 },
        { k: "n", label: "项数 n", def: 10, min: 1, max: 100, step: 1 }
      ],
      render: function (v) {
        var an = v.a1 + (v.n - 1) * v.d;
        return {
          tex: "a_{" + fmt(v.n) + "} = a_1 + (n-1)d = " + fmt(v.a1) + " + (" + fmt(v.n) +
            "-1) \\\\times " + fmt(v.d) + " = " + fmt(an),
          value: "a" + fmt(v.n) + " = " + fmt(an), unit: ""
        };
      }
    },
    {
      cat: "📐 数学", name: "等差数列求和", graph: null,
      params: [
        { k: "a1", label: "首项 a₁", def: 2, min: -50, max: 50, step: 0.5 },
        { k: "d", label: "公差 d", def: 3, min: -20, max: 20, step: 0.5 },
        { k: "n", label: "项数 n", def: 10, min: 1, max: 100, step: 1 }
      ],
      render: function (v) {
        var an = v.a1 + (v.n - 1) * v.d;
        var s = v.n * (v.a1 + an) / 2;
        return {
          tex: "S_{" + fmt(v.n) + "} = \\\\frac{n(a_1 + a_n)}{2} = \\\\frac{" + fmt(v.n) +
            " \\\\times (" + fmt(v.a1) + " + " + fmt(an) + ")}{2} = " + fmt(s),
          value: "S" + fmt(v.n) + " = " + fmt(s), unit: ""
        };
      }
    },
    {
      cat: "📐 数学", name: "等比数列通项", graph: null,
      params: [
        { k: "a1", label: "首项 a₁", def: 1, min: -50, max: 50, step: 0.5 },
        { k: "q", label: "公比 q", def: 2, min: -10, max: 10, step: 0.1 },
        { k: "n", label: "项数 n", def: 8, min: 1, max: 30, step: 1 }
      ],
      render: function (v) {
        var an = v.a1 * Math.pow(v.q, v.n - 1);
        return {
          tex: "a_{" + fmt(v.n) + "} = a_1 q^{n-1} = " + fmt(v.a1) + " \\\\times " + fmt(v.q) +
            "^{" + fmt(v.n - 1) + "} = " + fmt(an),
          value: "a" + fmt(v.n) + " = " + fmt(an), unit: ""
        };
      }
    },
    {
      cat: "📐 数学", name: "圆的面积", graph: null,
      params: [{ k: "r", label: "半径 r", def: 5, min: 0, max: 50, step: 0.5 }],
      render: function (v) {
        var s = Math.PI * v.r * v.r;
        return {
          tex: "S = \\\\pi r^{2} = \\\\pi \\\\times " + fmt(v.r) + "^{2} = " + fmt(s),
          value: fmt(s), unit: "平方单位"
        };
      }
    },
    {
      cat: "📐 数学", name: "圆的周长", graph: null,
      params: [{ k: "r", label: "半径 r", def: 5, min: 0, max: 100, step: 0.5 }],
      render: function (v) {
        var c = 2 * Math.PI * v.r;
        return {
          tex: "C = 2\\\\pi r = 2 \\\\times \\\\pi \\\\times " + fmt(v.r) + " = " + fmt(c),
          value: fmt(c), unit: "长度单位"
        };
      }
    },
    {
      cat: "📐 数学", name: "梯形面积", graph: null,
      params: [
        { k: "a", label: "上底 a", def: 4, min: 0, max: 100, step: 0.5 },
        { k: "b", label: "下底 b", def: 6, min: 0, max: 100, step: 0.5 },
        { k: "h", label: "高 h", def: 5, min: 0, max: 100, step: 0.5 }
      ],
      render: function (v) {
        var s = (v.a + v.b) * v.h / 2;
        return {
          tex: "S = \\\\frac{(a+b)h}{2} = \\\\frac{(" + fmt(v.a) + "+" + fmt(v.b) + ") \\\\times " +
            fmt(v.h) + "}{2} = " + fmt(s),
          value: fmt(s), unit: "平方单位"
        };
      }
    },
    {
      cat: "📐 数学", name: "勾股定理求斜边", graph: null,
      params: [
        { k: "a", label: "直角边 a", def: 3, min: 0, max: 100, step: 0.5 },
        { k: "b", label: "直角边 b", def: 4, min: 0, max: 100, step: 0.5 }
      ],
      render: function (v) {
        var c = Math.sqrt(v.a * v.a + v.b * v.b);
        return {
          tex: "c = \\\\sqrt{a^{2}+b^{2}} = \\\\sqrt{" + fmt(v.a) + "^{2}+" + fmt(v.b) +
            "^{2}} = " + fmt(c),
          value: "c = " + fmt(c), unit: "长度单位"
        };
      }
    },
    {
      cat: "📐 数学", name: "两点间距离", graph: null,
      params: [
        { k: "x1", label: "x₁", def: 1, min: -50, max: 50, step: 0.5 },
        { k: "y1", label: "y₁", def: 2, min: -50, max: 50, step: 0.5 },
        { k: "x2", label: "x₂", def: 4, min: -50, max: 50, step: 0.5 },
        { k: "y2", label: "y₂", def: 6, min: -50, max: 50, step: 0.5 }
      ],
      render: function (v) {
        var d = Math.sqrt(Math.pow(v.x2 - v.x1, 2) + Math.pow(v.y2 - v.y1, 2));
        return {
          tex: "d = \\\\sqrt{(x_2-x_1)^{2}+(y_2-y_1)^{2}} = \\\\sqrt{(" + fmt(v.x2 - v.x1) +
            ")^{2}+(" + fmt(v.y2 - v.y1) + ")^{2}} = " + fmt(d),
          value: "d = " + fmt(d), unit: "长度单位"
        };
      }
    },
    {
      cat: "📐 数学", name: "算术平均数（三数）", graph: null,
      params: [
        { k: "a", label: "数 a", def: 70, min: 0, max: 100, step: 1 },
        { k: "b", label: "数 b", def: 85, min: 0, max: 100, step: 1 },
        { k: "c", label: "数 c", def: 92, min: 0, max: 100, step: 1 }
      ],
      render: function (v) {
        var avg = (v.a + v.b + v.c) / 3;
        return {
          tex: "\\\\bar{x} = \\\\frac{a+b+c}{3} = \\\\frac{" + fmt(v.a) + "+" + fmt(v.b) + "+" +
            fmt(v.c) + "}{3} = " + fmt(avg),
          value: "x̄ = " + fmt(avg), unit: ""
        };
      }
    },

    /* —————— 物理 —————— */
    {
      cat: "⚡ 物理", name: "匀速直线运动速度", graph: null,
      params: [
        { k: "s", label: "路程 s（米）", def: 100, min: 0, max: 1000, step: 1 },
        { k: "t", label: "时间 t（秒）", def: 20, min: 0.001, max: 1000, step: 0.1 }
      ],
      render: function (v) {
        if (v.t === 0) return { invalid: "时间 t 不能为 0" };
        var r = v.s / v.t;
        return {
          tex: "v = \\\\frac{s}{t} = \\\\frac{" + fmt(v.s) + "}{" + fmt(v.t) + "} = " + fmt(r),
          value: fmt(r), unit: "m/s"
        };
      }
    },
    {
      cat: "⚡ 物理", name: "密度公式", graph: null,
      params: [
        { k: "m", label: "质量 m（克）", def: 79, min: 0, max: 1000, step: 1 },
        { k: "V", label: "体积 V（厘米³）", def: 10, min: 0.001, max: 1000, step: 0.1 }
      ],
      render: function (v) {
        if (v.V === 0) return { invalid: "体积 V 不能为 0" };
        var r = v.m / v.V;
        return {
          tex: "\\\\rho = \\\\frac{m}{V} = \\\\frac{" + fmt(v.m) + "}{" + fmt(v.V) + "} = " + fmt(r),
          value: "ρ = " + fmt(r), unit: "g/cm³"
        };
      }
    },
    {
      cat: "⚡ 物理", name: "重力公式", graph: null,
      params: [
        { k: "m", label: "质量 m（kg）", def: 5, min: 0, max: 1000, step: 0.5 },
        { k: "g", label: "g（N/kg）", def: 9.8, min: 0, max: 20, step: 0.1 }
      ],
      render: function (v) {
        var r = v.m * v.g;
        return {
          tex: "G = mg = " + fmt(v.m) + " \\\\times " + fmt(v.g) + " = " + fmt(r),
          value: "G = " + fmt(r), unit: "N"
        };
      }
    },
    {
      cat: "⚡ 物理", name: "压强公式", graph: null,
      params: [
        { k: "F", label: "压力 F（N）", def: 100, min: 0, max: 10000, step: 1 },
        { k: "S", label: "受力面积 S（m²）", def: 2, min: 0.001, max: 100, step: 0.1 }
      ],
      render: function (v) {
        if (v.S === 0) return { invalid: "面积 S 不能为 0" };
        var r = v.F / v.S;
        return {
          tex: "p = \\\\frac{F}{S} = \\\\frac{" + fmt(v.F) + "}{" + fmt(v.S) + "} = " + fmt(r),
          value: "p = " + fmt(r), unit: "Pa"
        };
      }
    },
    {
      cat: "⚡ 物理", name: "液体压强", graph: null,
      params: [
        { k: "rho", label: "密度 ρ（kg/m³）", def: 1000, min: 0, max: 20000, step: 10 },
        { k: "g", label: "g（N/kg）", def: 9.8, min: 0, max: 20, step: 0.1 },
        { k: "h", label: "深度 h（m）", def: 2, min: 0, max: 1000, step: 0.5 }
      ],
      render: function (v) {
        var r = v.rho * v.g * v.h;
        return {
          tex: "p = \\\\rho g h = " + fmt(v.rho) + " \\\\times " + fmt(v.g) + " \\\\times " +
            fmt(v.h) + " = " + fmt(r),
          value: "p = " + fmt(r), unit: "Pa"
        };
      }
    },
    {
      cat: "⚡ 物理", name: "阿基米德浮力", graph: null,
      params: [
        { k: "rho", label: "液体密度 ρ（kg/m³）", def: 1000, min: 0, max: 20000, step: 10 },
        { k: "g", label: "g（N/kg）", def: 9.8, min: 0, max: 20, step: 0.1 },
        { k: "V", label: "排开体积 V（m³）", def: 0.001, min: 0.0001, max: 10, step: 0.0001 }
      ],
      render: function (v) {
        var r = v.rho * v.g * v.V;
        return {
          tex: "F_{\\\\text{浮}} = \\\\rho g V = " + fmt(v.rho) + " \\\\times " + fmt(v.g) +
            " \\\\times " + fmt(v.V) + " = " + fmt(r),
          value: "F浮 = " + fmt(r), unit: "N"
        };
      }
    },
    {
      cat: "⚡ 物理", name: "功的公式", graph: null,
      params: [
        { k: "F", label: "力 F（N）", def: 50, min: 0, max: 10000, step: 1 },
        { k: "s", label: "距离 s（m）", def: 6, min: 0, max: 1000, step: 0.5 }
      ],
      render: function (v) {
        var r = v.F * v.s;
        return {
          tex: "W = Fs = " + fmt(v.F) + " \\\\times " + fmt(v.s) + " = " + fmt(r),
          value: "W = " + fmt(r), unit: "J"
        };
      }
    },
    {
      cat: "⚡ 物理", name: "功率公式", graph: null,
      params: [
        { k: "W", label: "功 W（J）", def: 600, min: 0, max: 100000, step: 10 },
        { k: "t", label: "时间 t（s）", def: 20, min: 0.001, max: 10000, step: 0.1 }
      ],
      render: function (v) {
        if (v.t === 0) return { invalid: "时间 t 不能为 0" };
        var r = v.W / v.t;
        return {
          tex: "P = \\\\frac{W}{t} = \\\\frac{" + fmt(v.W) + "}{" + fmt(v.t) + "} = " + fmt(r),
          value: "P = " + fmt(r), unit: "W"
        };
      }
    },
    {
      cat: "⚡ 物理", name: "机械效率", graph: null,
      params: [
        { k: "wu", label: "有用功 W有（J）", def: 600, min: 0, max: 100000, step: 10 },
        { k: "wz", label: "总功 W总（J）", def: 750, min: 0.001, max: 100000, step: 10 }
      ],
      render: function (v) {
        if (v.wz === 0) return { invalid: "总功不能为 0" };
        var r = v.wu / v.wz * 100;
        return {
          tex: "\\\\eta = \\\\frac{W_{\\\\text{有}}}{W_{\\\\text{总}}} \\\\times 100\\\\% = \\\\frac{" +
            fmt(v.wu) + "}{" + fmt(v.wz) + "} \\\\times 100\\\\% = " + fmt(r) + "\\\\%",
          value: "η = " + fmt(r), unit: "%"
        };
      }
    },
    {
      cat: "⚡ 物理", name: "欧姆定律", graph: null,
      params: [
        { k: "U", label: "电压 U（V）", def: 6, min: 0, max: 1000, step: 0.1 },
        { k: "R", label: "电阻 R（Ω）", def: 12, min: 0.001, max: 10000, step: 0.1 }
      ],
      render: function (v) {
        if (v.R === 0) return { invalid: "电阻 R 不能为 0" };
        var r = v.U / v.R;
        return {
          tex: "I = \\\\frac{U}{R} = \\\\frac{" + fmt(v.U) + "}{" + fmt(v.R) + "} = " + fmt(r),
          value: "I = " + fmt(r), unit: "A"
        };
      }
    },
    {
      cat: "⚡ 物理", name: "串联电阻", graph: null,
      params: [
        { k: "r1", label: "电阻 R₁（Ω）", def: 10, min: 0, max: 10000, step: 1 },
        { k: "r2", label: "电阻 R₂（Ω）", def: 20, min: 0, max: 10000, step: 1 }
      ],
      render: function (v) {
        var r = v.r1 + v.r2;
        return {
          tex: "R = R_1 + R_2 = " + fmt(v.r1) + " + " + fmt(v.r2) + " = " + fmt(r),
          value: "R = " + fmt(r), unit: "Ω"
        };
      }
    },
    {
      cat: "⚡ 物理", name: "并联电阻", graph: null,
      params: [
        { k: "r1", label: "电阻 R₁（Ω）", def: 10, min: 0.001, max: 10000, step: 1 },
        { k: "r2", label: "电阻 R₂（Ω）", def: 20, min: 0.001, max: 10000, step: 1 }
      ],
      render: function (v) {
        var den = v.r1 + v.r2;
        if (den === 0) return { invalid: "R₁ + R₂ 不能为 0" };
        var r = v.r1 * v.r2 / den;
        return {
          tex: "R = \\\\frac{R_1 R_2}{R_1 + R_2} = \\\\frac{" + fmt(v.r1) + " \\\\times " + fmt(v.r2) +
            "}{" + fmt(v.r1) + "+" + fmt(v.r2) + "} = " + fmt(r),
          value: "R = " + fmt(r), unit: "Ω"
        };
      }
    },
    {
      cat: "⚡ 物理", name: "电功公式", graph: null,
      params: [
        { k: "U", label: "电压 U（V）", def: 220, min: 0, max: 1000, step: 1 },
        { k: "I", label: "电流 I（A）", def: 0.5, min: 0, max: 100, step: 0.05 },
        { k: "t", label: "时间 t（s）", def: 60, min: 0, max: 3600, step: 1 }
      ],
      render: function (v) {
        var r = v.U * v.I * v.t;
        return {
          tex: "W = UIt = " + fmt(v.U) + " \\\\times " + fmt(v.I) + " \\\\times " + fmt(v.t) +
            " = " + fmt(r),
          value: "W = " + fmt(r), unit: "J"
        };
      }
    },
    {
      cat: "⚡ 物理", name: "电功率公式", graph: null,
      params: [
        { k: "U", label: "电压 U（V）", def: 220, min: 0, max: 1000, step: 1 },
        { k: "I", label: "电流 I（A）", def: 0.5, min: 0, max: 100, step: 0.05 }
      ],
      render: function (v) {
        var r = v.U * v.I;
        return {
          tex: "P = UI = " + fmt(v.U) + " \\\\times " + fmt(v.I) + " = " + fmt(r),
          value: "P = " + fmt(r), unit: "W"
        };
      }
    },
    {
      cat: "⚡ 物理", name: "物体吸热公式", graph: null,
      params: [
        { k: "c", label: "比热容 c（J/(kg·℃)）", def: 4200, min: 0, max: 20000, step: 10 },
        { k: "m", label: "质量 m（kg）", def: 2, min: 0, max: 1000, step: 0.5 },
        { k: "dt", label: "温升 Δt（℃）", def: 10, min: 0, max: 500, step: 0.5 }
      ],
      render: function (v) {
        var r = v.c * v.m * v.dt;
        return {
          tex: "Q_{\\\\text{吸}} = cm\\\\Delta t = " + fmt(v.c) + " \\\\times " + fmt(v.m) +
            " \\\\times " + fmt(v.dt) + " = " + fmt(r),
          value: "Q吸 = " + fmt(r), unit: "J"
        };
      }
    },

    /* —————— 化学 —————— */
    {
      cat: "🧪 化学", name: "物质的量", graph: null,
      params: [
        { k: "m", label: "质量 m（g）", def: 36, min: 0, max: 1000, step: 1 },
        { k: "M", label: "摩尔质量 M（g/mol）", def: 18, min: 0.001, max: 1000, step: 0.5 }
      ],
      render: function (v) {
        if (v.M === 0) return { invalid: "摩尔质量 M 不能为 0" };
        var r = v.m / v.M;
        return {
          tex: "n = \\\\frac{m}{M} = \\\\frac{" + fmt(v.m) + "}{" + fmt(v.M) + "} = " + fmt(r),
          value: "n = " + fmt(r), unit: "mol"
        };
      }
    },
    {
      cat: "🧪 化学", name: "物质的量浓度", graph: null,
      params: [
        { k: "n", label: "溶质物质的量 n（mol）", def: 0.5, min: 0, max: 100, step: 0.05 },
        { k: "V", label: "溶液体积 V（L）", def: 0.25, min: 0.001, max: 100, step: 0.05 }
      ],
      render: function (v) {
        if (v.V === 0) return { invalid: "体积 V 不能为 0" };
        var r = v.n / v.V;
        return {
          tex: "c = \\\\frac{n}{V} = \\\\frac{" + fmt(v.n) + "}{" + fmt(v.V) + "} = " + fmt(r),
          value: "c = " + fmt(r), unit: "mol/L"
        };
      }
    }
  ];

  /* ============================================================
   * 交互与渲染
   * ============================================================ */

  var navEl = $("tplNav");
  var paramsBox = $("paramsBox");
  var formulaRender = $("formulaRender");
  var formulaText = $("formulaText");
  var resultValue = $("resultValue");
  var graphWrap = $("graphWrap");
  var miniCanvas = $("miniCanvas");
  var miniCtx = miniCanvas.getContext("2d");
  var currentTemplate = null;
  var currentInputs = {}; // {key: {range, number, def, min, max, step}}
  var lastTex = "";
  var lastValue = "";
  var lastUnit = "";

  /**
   * 构建左侧分类模板按钮
   * 入参：无
   * 返回值：无
   */
  function buildNav() {
    var lastCat = "";
    TEMPLATES.forEach(function (tpl, idx) {
      if (tpl.cat !== lastCat) {
        var title = document.createElement("div");
        title.className = "cat-title";
        title.textContent = tpl.cat;
        navEl.appendChild(title);
        lastCat = tpl.cat;
      }
      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "tpl-btn";
      btn.textContent = tpl.name;
      btn.dataset.idx = String(idx);
      btn.addEventListener("click", function () { selectTemplate(idx); });
      navEl.appendChild(btn);
    });
  }

  /**
   * 选中模板：生成参数输入区并首次渲染
   * 入参：idx 模板下标
   * 返回值：无
   */
  function selectTemplate(idx) {
    currentTemplate = TEMPLATES[idx];
    navEl.querySelectorAll(".tpl-btn").forEach(function (b) {
      b.classList.toggle("active", Number(b.dataset.idx) === idx);
    });
    $("tplName").textContent = currentTemplate.name;
    paramsBox.innerHTML = "";
    currentInputs = {};
    currentTemplate.params.forEach(function (p) {
      var item = document.createElement("div");
      item.className = "param-item";

      // 标签 + 当前值显示
      var label = document.createElement("label");
      var labelText = document.createElement("span");
      labelText.textContent = p.label;
      var valTag = document.createElement("span");
      valTag.className = "val-tag";
      valTag.textContent = fmt(p.def);
      label.appendChild(labelText);
      label.appendChild(valTag);

      // 滑块 + 数字输入（联动）
      var rangeInput = document.createElement("input");
      rangeInput.type = "range";
      rangeInput.min = String(p.min !== undefined ? p.min : -50);
      rangeInput.max = String(p.max !== undefined ? p.max : 50);
      rangeInput.step = String(p.step !== undefined ? p.step : 0.1);
      rangeInput.value = String(p.def);

      var numInput = document.createElement("input");
      numInput.type = "number";
      numInput.step = "any";
      numInput.value = String(p.def);

      /** 同步两个输入 */
      function syncFromRange() {
        numInput.value = rangeInput.value;
        valTag.textContent = fmt(parseFloat(rangeInput.value));
        update();
      }
      function syncFromNumber() {
        var v = parseFloat(numInput.value);
        if (isFinite(v)) {
          rangeInput.value = String(v);
          valTag.textContent = fmt(v);
        }
        update();
      }
      rangeInput.addEventListener("input", syncFromRange);
      numInput.addEventListener("input", syncFromNumber);

      item.appendChild(label);
      item.appendChild(rangeInput);
      item.appendChild(numInput);
      paramsBox.appendChild(item);

      currentInputs[p.k] = {
        range: rangeInput,
        number: numInput,
        valTag: valTag,
        def: p.def,
        min: p.min,
        max: p.max,
        step: p.step
      };
    });
    update();
  }

  /**
   * 读取当前全部参数值
   * 入参：无
   * 返回值：{values:数值对象, ok:是否全部合法}
   */
  function readValues() {
    var values = {};
    var ok = true;
    currentTemplate.params.forEach(function (p) {
      var raw = currentInputs[p.k].number.value.trim();
      var num = parseFloat(raw);
      if (raw === "" || Number.isNaN(num)) ok = false;
      values[p.k] = num;
    });
    return { values: values, ok: ok };
  }

  /**
   * 格式化参数当前值清单（用于 params-current 显示）
   * 入参：values 当前参数对象
   * 返回值：string
   */
  function formatParamsCurrent(values) {
    return currentTemplate.params.map(function (p) {
      return p.k + " = " + fmt(values[p.k]);
    }).join("，");
  }

  /**
   * 参数变化后重算并重渲染
   * 入参：无
   * 返回值：无
   */
  function update() {
    if (!currentTemplate) return;
    var read = readValues();
    if (!read.ok) {
      resultValue.innerHTML = "请填写全部参数（须为数字）";
      formulaRender.textContent = "";
      formulaText.textContent = "";
      graphWrap.classList.remove("show");
      lastTex = "";
      return;
    }
    $("paramsCurrent").textContent = formatParamsCurrent(read.values);
    var out;
    try {
      out = currentTemplate.render(read.values);
    } catch (e) {
      resultValue.textContent = "计算出错：" + e.message;
      return;
    }
    if (out.invalid) {
      formulaRender.textContent = "";
      formulaText.textContent = "";
      resultValue.textContent = "⚠️ " + out.invalid;
      graphWrap.classList.remove("show");
      lastTex = "";
      return;
    }
    // KaTeX 渲染
    formulaRender.innerHTML = "";
    katex.render(out.tex, formulaRender, { displayMode: true, throwOnError: false });
    // 文字预览（去除 LaTeX 反斜杠与花括号，保留可读文本）
    formulaText.textContent = out.tex.replace(/\\\\\\\\/g, "").replace(/\\{|\\}/g, "").replace(/\\\\frac/g, "frac").replace(/\\\\text\\{[^}]+\\}/g, "").replace(/\\\\quad/g, " ").replace(/\\\\,/g, " ").replace(/\\\\;/g, " ").replace(/\\\\times/g, "×").replace(/\\\\pm/g, "±").replace(/\\\\Delta/g, "Δ").replace(/\\\\sqrt/g, "√").replace(/\\\\pi/g, "π").replace(/\\\\rho/g, "ρ").replace(/\\\\eta/g, "η").replace(/\\\\bar\\{x\\}/g, "x̄");
    lastTex = out.tex;
    lastValue = out.value;
    lastUnit = out.unit || "";
    resultValue.innerHTML = "";
    resultValue.appendChild(document.createTextNode(out.value));
    if (out.unit) {
      var unit = document.createElement("span");
      unit.className = "unit";
      unit.textContent = out.unit;
      resultValue.appendChild(unit);
    }
    if (currentTemplate.graph) {
      graphWrap.classList.add("show");
      drawMiniGraph(currentTemplate.graph, read.values);
    } else {
      graphWrap.classList.remove("show");
    }
  }

  /**
   * 内嵌极简函数图像：白底网格 + 坐标轴 + 采样折线
   * 入参：type "linear" 或 "quad"；v 当前参数值
   * 返回值：无
   */
  function drawMiniGraph(type, v) {
    var dpr = Math.max(1, window.devicePixelRatio || 1);
    var w = Math.max(50, miniCanvas.clientWidth);
    var h = 280;
    miniCanvas.width = Math.round(w * dpr);
    miniCanvas.height = Math.round(h * dpr);
    miniCtx.setTransform(dpr, 0, 0, dpr, 0, 0);

    var XMIN = parseFloat($("gxMin").value);
    var XMAX = parseFloat($("gxMax").value);
    var YMIN = parseFloat($("gyMin").value);
    var YMAX = parseFloat($("gyMax").value);
    if (!(isFinite(XMIN) && isFinite(XMAX) && XMAX > XMIN)) { XMIN = -10; XMAX = 10; }
    if (!(isFinite(YMIN) && isFinite(YMAX) && YMAX > YMIN)) { YMIN = -10; YMAX = 10; }

    /** 按类型求函数值 */
    function f(x) {
      return type === "linear" ? v.k * x + v.b : v.a * x * x + v.b * x + v.c;
    }

    var pad = 28;
    function sx(xx) { return pad + (xx - XMIN) / (XMAX - XMIN) * (w - pad * 2); }
    function sy(yy) { return h - pad - (yy - YMIN) / (YMAX - YMIN) * (h - pad * 2); }

    miniCtx.fillStyle = "#ffffff";
    miniCtx.fillRect(0, 0, w, h);

    // 网格
    miniCtx.strokeStyle = "#eef2f7";
    miniCtx.lineWidth = 1;
    var step = niceStep((XMAX - XMIN) / 8);
    var gx0 = Math.ceil(XMIN / step) * step;
    for (var gx = gx0; gx <= XMAX + step * 1e-6; gx += step) {
      miniCtx.beginPath();
      miniCtx.moveTo(sx(gx), 0);
      miniCtx.lineTo(sx(gx), h);
      miniCtx.stroke();
    }
    var ystep = niceStep((YMAX - YMIN) / 6);
    var gy0 = Math.ceil(YMIN / ystep) * ystep;
    for (var gy = gy0; gy <= YMAX + ystep * 1e-6; gy += ystep) {
      miniCtx.beginPath();
      miniCtx.moveTo(0, sy(gy));
      miniCtx.lineTo(w, sy(gy));
      miniCtx.stroke();
    }

    // 坐标轴（0 在范围内才画）
    miniCtx.strokeStyle = "#9ca3af";
    miniCtx.lineWidth = 1.4;
    if (0 >= XMIN && 0 <= XMAX) {
      miniCtx.beginPath();
      miniCtx.moveTo(sx(0), 0);
      miniCtx.lineTo(sx(0), h);
      miniCtx.stroke();
    }
    if (0 >= YMIN && 0 <= YMAX) {
      miniCtx.beginPath();
      miniCtx.moveTo(0, sy(0));
      miniCtx.lineTo(w, sy(0));
      miniCtx.stroke();
    }

    // 刻度数字
    miniCtx.fillStyle = "#6b7280";
    miniCtx.font = "10px sans-serif";
    miniCtx.textAlign = "center";
    miniCtx.textBaseline = "top";
    [gx0, 0, XMAX].forEach(function (t) {
      if (t >= XMIN && t <= XMAX) miniCtx.fillText(String(parseFloat(t.toFixed(4))), sx(t), h - 16);
    });
    miniCtx.textAlign = "right";
    miniCtx.textBaseline = "middle";
    [YMIN, 0, YMAX].forEach(function (t) {
      if (t >= YMIN && t <= YMAX) miniCtx.fillText(String(parseFloat(t.toFixed(4))), sx(0) - 5, sy(t));
    });

    // 函数折线
    miniCtx.strokeStyle = type === "linear" ? "#2563eb" : "#dc2626";
    miniCtx.lineWidth = 2.4;
    miniCtx.lineJoin = "round";
    miniCtx.lineCap = "round";
    miniCtx.beginPath();
    var started = false;
    var samples = 400;
    for (var i = 0; i <= samples; i++) {
      var x = XMIN + (XMAX - XMIN) * i / samples;
      var y = f(x);
      if (!isFinite(y)) { started = false; continue; }
      var px = sx(x), py = sy(y);
      // 超出可视范围视为断点（避免穿过画面）
      if (py < -1000 || py > h + 1000) { started = false; continue; }
      if (!started) { miniCtx.moveTo(px, py); started = true; }
      else miniCtx.lineTo(px, py);
    }
    miniCtx.stroke();
  }

  /**
   * 按 1/2/5×10^n 选取“好看”的刻度步长（与 function-graph 共用算法）
   * 入参：raw 期望步长
   * 返回值：number
   */
  function niceStep(raw) {
    if (!(raw > 0) || !isFinite(raw)) return 1;
    var exp = Math.floor(Math.log10(raw));
    var base = raw / Math.pow(10, exp);
    var stepBase = base < 1.5 ? 1 : base < 3 ? 2 : base < 7 ? 5 : 10;
    return stepBase * Math.pow(10, exp);
  }

  /**
   * 重新渲染当前模板（强制刷新 KaTeX 与图像）
   * 入参：无
   * 返回值：无
   */
  function rerender() {
    if (!currentTemplate) return;
    update();
    var btn = $("btnRerender");
    var old = btn.textContent;
    btn.textContent = "✅ 已重渲染";
    setTimeout(function () { btn.textContent = old; }, 1200);
  }

  /**
   * 保存截图：含图像模板直接导出 canvas，无图像模板合成文字图
   * 入参：无
   * 返回值：无
   */
  function screenshot() {
    if (!currentTemplate) return;
    var link = document.createElement("a");
    var ts = new Date();
    var stamp = ts.getFullYear() + "-" +
      String(ts.getMonth() + 1).padStart(2, "0") + "-" +
      String(ts.getDate()).padStart(2, "0") + " " +
      String(ts.getHours()).padStart(2, "0") + String(ts.getMinutes()).padStart(2, "0");

    if (graphWrap.classList.contains("show")) {
      // 有图像：直接导出 miniCanvas
      link.download = "公式图像-" + currentTemplate.name.replace(/[\\\\/:*?"<>|]/g, "_") + " " + stamp + ".png";
      link.href = miniCanvas.toDataURL("image/png");
    } else {
      // 无图像：合成一张文字图（公式名 + 代入式 + 结果）
      var cv = document.createElement("canvas");
      var W = 900, H = 280;
      cv.width = W; cv.height = H;
      var c = cv.getContext("2d");
      c.fillStyle = "#ffffff";
      c.fillRect(0, 0, W, H);
      // 边框
      c.strokeStyle = "#6d28d9";
      c.lineWidth = 4;
      c.strokeRect(0, 0, W, H);
      // 公式名
      c.fillStyle = "#0f172a";
      c.font = "bold 24px -apple-system,'Segoe UI','Microsoft YaHei',sans-serif";
      c.textAlign = "center";
      c.fillText(currentTemplate.name, W / 2, 50);
      // 分隔线
      c.strokeStyle = "#cbd5e1";
      c.lineWidth = 1;
      c.beginPath();
      c.moveTo(80, 70);
      c.lineTo(W - 80, 70);
      c.stroke();
      // 代入式（文字版）
      c.fillStyle = "#1f2937";
      c.font = "18px Consolas, 'Courier New', monospace";
      var lines = wrapText(formulaText.textContent || lastValue, W - 120);
      lines.forEach(function (ln, i) {
        c.fillText(ln, W / 2, 110 + i * 26);
      });
      // 结果
      c.fillStyle = "#16a34a";
      c.font = "bold 26px -apple-system,'Segoe UI','Microsoft YaHei',sans-serif";
      c.fillText("结果：" + lastValue + (lastUnit ? " " + lastUnit : ""), W / 2, H - 30);
      link.download = "公式截图-" + currentTemplate.name.replace(/[\\\\/:*?"<>|]/g, "_") + " " + stamp + ".png";
      link.href = cv.toDataURL("image/png");
    }
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    // 按钮反馈
    var btn = $("btnScreenshot");
    var old = btn.textContent;
    btn.textContent = "✅ 已保存";
    setTimeout(function () { btn.textContent = old; }, 1400);
  }

  /**
   * 简单的文本换行（按字符宽度近似）
   * 入参：text 文本；maxWidth 最大宽度（像素，对应 font-size 已设置）
   * 返回值：Array<string> 行数组
   */
  function wrapText(text, maxWidth) {
    if (!text) return [];
    var lines = [];
    var current = "";
    for (var i = 0; i < text.length; i++) {
      var tryLine = current + text.charAt(i);
      // 近似：每行 60 字符（中文 2 字符宽度）
      if (tryLine.length > 60) {
        lines.push(current);
        current = text.charAt(i);
      } else {
        current = tryLine;
      }
    }
    if (current) lines.push(current);
    return lines.slice(0, 4);
  }

  /**
   * 复制代入数值后的 LaTeX（含剪贴板降级方案）
   * 入参：无
   * 返回值：无
   */
  function copyTex() {
    if (!lastTex) return;
    function fallback() {
      var ta = document.createElement("textarea");
      ta.value = lastTex;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      try { document.execCommand("copy"); } catch (e) { /* 忽略 */ }
      document.body.removeChild(ta);
    }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(lastTex).catch(fallback);
    } else {
      fallback();
    }
    var btn = $("btnCopyTex");
    var old = btn.textContent;
    btn.textContent = "✅ 已复制";
    setTimeout(function () { btn.textContent = old; }, 1400);
  }

  /* ============================================================
   * 事件绑定
   * ============================================================ */

  /** 名称搜索过滤 */
  $("searchInput").addEventListener("input", function (e) {
    var kw = e.target.value.trim().toLowerCase();
    navEl.querySelectorAll(".tpl-btn").forEach(function (b) {
      b.classList.toggle("hidden", kw !== "" && b.textContent.toLowerCase().indexOf(kw) === -1);
    });
  });

  /** 浏览按钮：滚动到模板列表并展开（已展开则聚焦搜索框） */
  $("btnBrowse").addEventListener("click", function () {
    $("searchInput").focus();
    navEl.scrollTop = 0;
  });

  /** 视图切换：图像 / 文字 */
  document.querySelectorAll(".tab-btn").forEach(function (btn) {
    btn.addEventListener("click", function () {
      document.querySelectorAll(".tab-btn").forEach(function (b) { b.classList.remove("active"); });
      btn.classList.add("active");
      var view = btn.dataset.view;
      formulaRender.hidden = (view !== "image");
      formulaText.hidden = (view !== "text");
    });
  });

  /** X/Y 范围输入框：变化后重绘图像 */
  ["gxMin", "gxMax", "gyMin", "gyMax"].forEach(function (id) {
    $(id).addEventListener("change", function () {
      if (currentTemplate && currentTemplate.graph && graphWrap.classList.contains("show")) {
        var read = readValues();
        if (read.ok) drawMiniGraph(currentTemplate.graph, read.values);
      }
    });
  });

  /** 操作按钮 */
  $("btnRerender").addEventListener("click", rerender);
  $("btnScreenshot").addEventListener("click", screenshot);
  $("btnCopyTex").addEventListener("click", copyTex);

  /** 全屏状态变化时重绘缩略图像（进出全屏由共享模块 tool-stage-toolbar.js 接管） */
  document.addEventListener("fullscreenchange", function () {
    if (currentTemplate && currentTemplate.graph && graphWrap.classList.contains("show")) {
      var read = readValues();
      if (read.ok) drawMiniGraph(currentTemplate.graph, read.values);
    }
  });

  /** 窗口尺寸变化时重绘图像 */
  window.addEventListener("resize", function () {
    if (currentTemplate && currentTemplate.graph && graphWrap.classList.contains("show")) {
      var read = readValues();
      if (read.ok) drawMiniGraph(currentTemplate.graph, read.values);
    }
  });

  /* ============================================================
   * 初始化
   * ============================================================ */
  buildNav();
  selectTemplate(0);

  /* 舞台工具栏：⛶ 对 .main-card 自身全屏，⚙ 收起左侧模板库 .side-card。
     交互与全屏状态回滚均由共享模块 tool-stage-toolbar.js 提供。 */
  if (window.EduToolStageToolbar) {
    window.EduToolStageToolbar.init({
      stage: ".main-card",
      panelHost: "#formulaLayout",
      hiddenClass: "setup-hidden"
    });
  }
})();
`
    },
    meta: {builtAt: "2026-09-28 11:07:05", sources: {"assets/vendor/katex/katex.min.css": "94edbc490693", "assets/css/tool-common.css": "d35dcf222690", "tools/formula-preview/formula-preview.css": "0f03d51b4fe7", "assets/js/frame-bridge.js": "1131903c1e46", "assets/js/tool-stage-toolbar.js": "30f2ddfe48d2", "tools/formula-preview/formula-preview.js": "2855e1a0ec54"}}
  };
})();