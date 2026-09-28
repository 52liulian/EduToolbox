/* 自动生成，请勿手改 —— 源：tools/quick-ref/  ·  构建：2026-09-28 11:07:05 */
/* 用途：file:// 离线场景下 fetch 被 CORS 拦截，站点改用 <script src> 加载本文件，
   拿到工具页面与本地 CSS/JS 文本后走与 http 相同的 Shadow DOM 组件化挂载。
   工具源码改动后请重跑：python .workbuddy/scripts/build_tool_bundles.py */
(function(){
  var g = window.EduToolboxToolBundles || (window.EduToolboxToolBundles = {});
  g["quick-ref"] = {
    html: `<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>学科常识速查表 | EduToolbox · 中小学常用知识点检索<\/title>
<meta name="description" content="学科常识速查表：单位换算、数学公式、物理常数与公式、化学元素与化合价、语文常识、英语不规则动词，支持关键词检索与一键复制。">
<link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ctext y='.9em' font-size='90'%3E%F0%9F%8C%8F%3C/text%3E">
<link rel="stylesheet" href="../../assets/css/tool-common.css">
<link rel="stylesheet" href="quick-ref.css">
<\/head>
<body>

<div class="container">
  <div class="workbench">
    <!-- ======================= 左侧筛选面板 ======================= -->
    <aside class="panel setup-panel">
      <div class="block">
        <h2 class="block-title">① 选择分类<\/h2>
        <div class="chips chips-mini" id="catChips">
          <button type="button" class="chip active" data-cat="all">全部<\/button>
          <button type="button" class="chip" data-cat="unit">📏 单位换算<\/button>
          <button type="button" class="chip" data-cat="math">📐 数学公式<\/button>
          <button type="button" class="chip" data-cat="phys">🔭 物理常数<\/button>
          <button type="button" class="chip" data-cat="chem">⚗️ 化学常识<\/button>
          <button type="button" class="chip" data-cat="chn">📖 语文常识<\/button>
          <button type="button" class="chip" data-cat="eng">🔤 英语动词<\/button>
        <\/div>
      <\/div>

      <div class="block">
        <h2 class="block-title">② 关键词速查<\/h2>
        <div class="setting-row">
          <label for="searchInput">搜索<\/label>
          <input type="text" id="searchInput" placeholder="如：勾股 / 浮力 / take / 化合价">
        <\/div>
        <p class="hint-line">支持中英文关键词，命中字会高亮显示；搜索时命中的小节自动展开。<\/p>
        <div class="actions">
          <div class="btn-row">
            <button type="button" class="btn btn-small btn-ghost" id="btnExpand">🔽 展开全部<\/button>
            <button type="button" class="btn btn-small btn-ghost" id="btnCollapse">🔼 折叠全部<\/button>
          <\/div>
        <\/div>
      <\/div>

      <div class="block">
        <h2 class="block-title">③ 导出<\/h2>
        <div class="actions">
          <div class="btn-row">
            <button type="button" class="btn btn-small" id="btnCopy">📋 复制命中结果<\/button>
            <button type="button" class="btn btn-small" id="btnDownload">📥 导出 TXT<\/button>
          <\/div>
          <div class="btn-row">
            <button type="button" class="btn btn-small btn-ghost" id="btnPrint">🖨️ 打印速查表<\/button>
            <button type="button" class="btn btn-small btn-ghost" id="btnReset">↺ 重置筛选<\/button>
          <\/div>
        <\/div>
      <\/div>
    <\/aside>

    <!-- ======================= 右侧内容 ======================= -->
    <main class="stage-panel">
      <div class="stage-toolbar">
        <button type="button" class="icon-btn" id="fullscreenBtn" title="全屏展示">⛶<\/button>
        <button type="button" class="icon-btn" id="hideSetupBtn" title="隐藏设置栏">⚙<\/button>
      <\/div>
      <div class="stage-head">
        <h2 class="panel-title">📚 知识条目<\/h2>
        <span class="stage-ok" id="stageOk">—<\/span>
      <\/div>

      <div class="stat-grid qr-stats">
        <div class="stat-card"><span class="stat-num" id="statTotal">0<\/span><span class="stat-label">收录条目<\/span><\/div>
        <div class="stat-card"><span class="stat-num" id="statHit">0<\/span><span class="stat-label">当前命中<\/span><\/div>
        <div class="stat-card"><span class="stat-num" id="statCats">0<\/span><span class="stat-label">学科分类<\/span><\/div>
        <div class="stat-card"><span class="stat-num" id="statGroups">0<\/span><span class="stat-label">知识小节<\/span><\/div>
      <\/div>

      <div class="state state--empty" id="emptyState">
        <div class="state-icon">🔍<\/div>
        <div class="state-title">没有找到匹配的知识点<\/div>
        <div class="state-desc">换个关键词试试，或点击左侧「重置筛选」查看全部条目<\/div>
      <\/div>

      <div class="qr-list" id="listWrap"><\/div>
    <\/main>
  <\/div>
<\/div>

<div class="toast" id="toast"><\/div>

<script src="../../assets/js/frame-bridge.js"><\/script>
<script src="../../assets/js/tool-stage-toolbar.js"><\/script>
<script src="quick-ref.js"><\/script>
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
      "tools/quick-ref/quick-ref.css": `/* ============================================================
 * EduToolbox · 学科常识速查表 quick-ref.css
 * 依赖公共底座 tool-common.css（本文件应在其后加载）
 * ============================================================ */

body[data-theme="sky"]   { --primary:#0ea5e9; --primary-soft:#e0f2fe; --primary-soft-2:#ccecfc; --primary-grad:linear-gradient(135deg,#38bdf8,#0ea5e9,#0284c7); }
body[data-theme="violet"]{ --primary:#7c3aed; --primary-soft:#f0e9fe; --primary-soft-2:#e2d5fc; --primary-grad:linear-gradient(135deg,#8b5cf6,#7c3aed,#6d28d9); }
body[data-theme="green"] { --primary:#16a34a; --primary-soft:#e7f6ec; --primary-soft-2:#d3f0dc; --primary-grad:linear-gradient(135deg,#22c55e,#16a34a,#15803d); }
body[data-theme="gold"]  { --primary:#d97706; --primary-soft:#fdf1dc; --primary-soft-2:#fbe3bc; --primary-grad:linear-gradient(135deg,#f59e0b,#d97706,#b45309); }
body[data-theme="orange"]{ --primary:#ea580c; --primary-soft:#ffefe4; --primary-soft-2:#ffdec9; --primary-grad:linear-gradient(135deg,#fb923c,#ea580c,#c2410c); }
body[data-theme="pink"]  { --primary:#db2777; --primary-soft:#fce7f0; --primary-soft-2:#f9cfe1; --primary-grad:linear-gradient(135deg,#f472b6,#db2777,#be185d); }

.workbench { display:grid; grid-template-columns:320px minmax(0,1fr); gap:20px; align-items:start; }

.hint-line { margin:8px 0 0; font-size:12.5px; line-height:1.6; color:var(--text-3); }
/* position:relative —— 舞台右上角 .stage-toolbar 的绝对定位基准 */
.stage-panel { position:relative; min-width:0; }
/* padding-right 为右上角 ⛶⚙ 工具栏（40+8+40=88px）留出避让空间 */
.stage-head { display:flex; align-items:center; justify-content:space-between; gap:12px; margin-bottom:14px; padding-right:96px; }
.stage-head .panel-title { margin-bottom:0; }
.stage-ok { font-size:13px; font-weight:600; color:var(--primary); }

.qr-stats { grid-template-columns:repeat(4,minmax(0,1fr)); }
.qr-stats .stat-num { font-size:19px; }

/* ---------- 分类小节 ---------- */
.qr-list { display:flex; flex-direction:column; gap:14px; margin-top:16px; }

.qr-section {
  background:var(--card-bg); border:1px solid var(--border);
  border-radius:var(--r); box-shadow:var(--shadow-sm); overflow:hidden;
}
.qr-sec-head {
  display:flex; align-items:center; gap:10px; flex-wrap:wrap;
  padding:12px 16px; background:var(--primary-grad); color:#fff; cursor:pointer;
  user-select:none; transition:filter .16s var(--ease);
}
.qr-sec-head:hover { filter:brightness(1.06); }
.qr-sec-title { font-size:15px; font-weight:800; letter-spacing:.2px; }
.qr-sec-count {
  padding:2px 9px; border-radius:var(--r-pill); font-size:11.5px; font-weight:700;
  background:rgba(255,255,255,.22); color:#fff; border:1px solid rgba(255,255,255,.32);
}
.qr-sec-spacer { margin-left:auto; }
.qr-sec-btn {
  padding:3px 10px; font-size:12px; font-weight:700; border-radius:var(--r-pill);
  background:rgba(255,255,255,.18); color:#fff; border:1px solid rgba(255,255,255,.34);
  cursor:pointer; transition:background .16s var(--ease);
}
.qr-sec-btn:hover { background:rgba(255,255,255,.32); }
.qr-sec-arrow { font-size:12px; opacity:.9; }
.qr-section.collapsed .qr-sec-arrow { transform:rotate(-90deg); }
.qr-section.collapsed .qr-sec-body { display:none; }

.qr-group { padding:6px 16px 12px; border-bottom:1px dashed var(--border); }
.qr-group:last-child { border-bottom:none; }
.qr-group-title {
  display:flex; align-items:center; gap:8px; margin:10px 0 6px;
  font-size:13px; font-weight:700; color:var(--text-2);
}
.qr-group-title::before {
  content:""; width:4px; height:13px; border-radius:2px; background:var(--primary);
}

/* ---------- 条目行 ---------- */
.qr-row {
  display:grid; grid-template-columns:minmax(0,1fr) auto; align-items:start; gap:10px;
  padding:6px 8px; border-radius:8px; transition:background .14s var(--ease);
}
.qr-row:hover { background:var(--primary-soft); }
.qr-k { font-size:13.5px; font-weight:700; color:var(--text-1); line-height:1.55; word-break:break-all; }
.qr-v {
  font-size:13px; color:var(--text-2); line-height:1.6; word-break:break-all;
  font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,"Courier New",monospace;
}
.qr-note { display:block; margin-top:2px; font-size:12px; color:var(--text-3); font-family:inherit; }
.qr-copy {
  padding:3px 9px; font-size:11.5px; font-weight:700; border-radius:var(--r-pill);
  background:var(--card-bg-2); color:var(--text-3); border:1px solid var(--border);
  cursor:pointer; white-space:nowrap; transition:all .16s var(--ease);
}
.qr-copy:hover { background:var(--primary); color:#fff; border-color:var(--primary); }

mark { padding:0 2px; border-radius:3px; background:#fde68a; color:#78350f; font-weight:700; }

@media (max-width:900px){
  .workbench { grid-template-columns:1fr; }
  .qr-stats { grid-template-columns:repeat(2,minmax(0,1fr)); }
  .qr-row { grid-template-columns:minmax(0,1fr); }
  .qr-copy { justify-self:start; }
}
@media print {
  .setup-panel, .stage-head, .toast, .qr-copy, .qr-sec-btn, .state { display:none !important; }
  .workbench { display:block; }
  .qr-section { break-inside:avoid; box-shadow:none; }
  .qr-sec-head { background:none !important; color:#111 !important; border-bottom:1px solid #999; }
  .qr-sec-count { background:none !important; color:#333 !important; border-color:#999 !important; }
}

/* ---------- 隐藏设置栏（⚙）：双栏 → 单栏，与 random-call 同构 ---------- */
.workbench.setup-hidden { grid-template-columns:minmax(0,1fr); }
.workbench.setup-hidden .setup-panel { display:none; }

/* ---------- 舞台全屏（⛶）：全屏目标是 .stage-panel 自身，不是整页 ---------- */
.stage-panel:fullscreen,
.stage-panel:-webkit-full-screen,
.stage-panel.edutf-solo{
  display:flex; flex-direction:column; justify-content:center; align-items:stretch;
  min-height:100vh; padding:36px 30px;
  border-radius:0; border-color:transparent; box-shadow:none;
  background:var(--bg); overflow:auto;
}
/* 全屏下工具栏仍可见：贴边 + 半透明，hover 恢复不透明 */
.stage-panel:fullscreen .stage-toolbar,
.stage-panel:-webkit-full-screen .stage-toolbar,
.stage-panel.edutf-solo .stage-toolbar{
  position:fixed; top:18px; right:22px; z-index:30;
  opacity:.55; transition:opacity .18s var(--ease);
}
.stage-panel:fullscreen .stage-toolbar:hover,
.stage-panel:-webkit-full-screen .stage-toolbar:hover,
.stage-panel.edutf-solo .stage-toolbar:hover{ opacity:1; }
@media print { .stage-toolbar { display:none; } }
`,
      "tools/quick-ref/quick-ref.js": `/* ============================================================
 * EduToolbox · 学科常识速查表 quick-ref.js
 * 功能：六大类学科常识（单位换算 / 数学公式 / 物理常数 / 化学常识 /
 *       语文常识 / 英语不规则动词）关键词检索、高亮、小节折叠、
 *       单条·整节·整类一键复制、TXT 导出与打印
 * ============================================================ */
(function () {
  "use strict";

  var $ = function (id) { return document.getElementById(id); };
  var CAT_KEY = "edutoolbox.quick-ref.cat";

  /* ============================================================
   * 知识库数据：条目 { k: 名称, v: 内容, n: 备注 }
   * ============================================================ */
  var DATA = [
    /* ---------------- 单位换算 ---------------- */
    {
      id: "unit", icon: "📏", name: "单位换算",
      groups: [
        {
          name: "长度", items: [
            { k: "1 千米（km）", v: "= 1000 米（m）" },
            { k: "1 米（m）", v: "= 10 分米（dm）= 100 厘米（cm）= 1000 毫米（mm）" },
            { k: "1 毫米（mm）", v: "= 1000 微米（μm）= 10⁶ 纳米（nm）" },
            { k: "1 里", v: "= 500 米" },
            { k: "1 尺", v: "≈ 0.333 米（3 尺 = 1 米）" },
            { k: "1 英寸（in）", v: "= 2.54 厘米" },
            { k: "1 英尺（ft）", v: "= 30.48 厘米 = 12 英寸" },
            { k: "1 英里（mile）", v: "≈ 1.609 千米" },
            { k: "1 海里（n mile）", v: "= 1852 米" }
          ]
        },
        {
          name: "面积", items: [
            { k: "1 平方千米（km²）", v: "= 100 公顷 = 1 000 000 平方米" },
            { k: "1 公顷（ha）", v: "= 10 000 平方米 = 15 亩" },
            { k: "1 亩", v: "≈ 666.67 平方米" },
            { k: "1 平方米（m²）", v: "= 100 平方分米 = 10 000 平方厘米" }
          ]
        },
        {
          name: "体积与容积", items: [
            { k: "1 立方米（m³）", v: "= 1000 立方分米 = 1000 升（L）" },
            { k: "1 升（L）", v: "= 1 立方分米 = 1000 毫升（mL）" },
            { k: "1 毫升（mL）", v: "= 1 立方厘米（cm³）" }
          ]
        },
        {
          name: "质量", items: [
            { k: "1 吨（t）", v: "= 1000 千克（kg）" },
            { k: "1 千克（kg）", v: "= 1000 克（g）= 2 斤" },
            { k: "1 斤 / 1 两", v: "= 500 克 / = 50 克" },
            { k: "1 磅（lb）", v: "≈ 0.4536 千克" },
            { k: "1 盎司（oz）", v: "≈ 28.35 克" }
          ]
        },
        {
          name: "时间", items: [
            { k: "1 世纪 / 1 年", v: "= 100 年 / = 12 个月 = 365 天（闰年 366 天）" },
            { k: "1 日 / 1 时 / 1 分", v: "= 24 时 / = 60 分 / = 60 秒" },
            { k: "闰年判定", v: "能被 4 整除且不能被 100 整除，或能被 400 整除" }
          ]
        },
        {
          name: "温度与速度", items: [
            { k: "摄氏 → 华氏", v: "℉ = ℃ × 9/5 + 32" },
            { k: "华氏 → 摄氏", v: "℃ = (℉ − 32) × 5/9" },
            { k: "摄氏 → 开尔文", v: "K = ℃ + 273.15" },
            { k: "1 米/秒", v: "= 3.6 千米/时" },
            { k: "1 节（kn）", v: "= 1.852 千米/时" }
          ]
        }
      ]
    },

    /* ---------------- 数学公式 ---------------- */
    {
      id: "math", icon: "📐", name: "数学公式",
      groups: [
        {
          name: "乘法公式与因式分解", items: [
            { k: "完全平方（和）", v: "(a+b)² = a² + 2ab + b²" },
            { k: "完全平方（差）", v: "(a−b)² = a² − 2ab + b²" },
            { k: "平方差", v: "(a+b)(a−b) = a² − b²" },
            { k: "完全立方", v: "(a+b)³ = a³ + 3a²b + 3ab² + b³" },
            { k: "立方和", v: "a³ + b³ = (a+b)(a² − ab + b²)" },
            { k: "立方差", v: "a³ − b³ = (a−b)(a² + ab + b²)" }
          ]
        },
        {
          name: "方程", items: [
            { k: "一元二次求根", v: "x = (−b ± √(b²−4ac)) / 2a" },
            { k: "判别式 Δ", v: "= b² − 4ac；Δ>0 两不等实根，Δ=0 两相等实根，Δ<0 无实根" },
            { k: "韦达定理", v: "x₁ + x₂ = −b/a，x₁·x₂ = c/a" }
          ]
        },
        {
          name: "平面几何", items: [
            { k: "勾股定理", v: "a² + b² = c²（直角三角形两直角边与斜边）" },
            { k: "三角形面积", v: "S = ½ × 底 × 高" },
            { k: "平行四边形面积", v: "S = 底 × 高" },
            { k: "梯形面积", v: "S = ½ × (上底 + 下底) × 高" },
            { k: "圆的周长与面积", v: "C = 2πr = πd；S = πr²" },
            { k: "扇形面积", v: "S = nπr²/360 = ½ l r（l 为弧长）" }
          ]
        },
        {
          name: "立体几何", items: [
            { k: "长方体 / 正方体体积", v: "V = abc / V = a³" },
            { k: "圆柱", v: "V = πr²h；侧面积 S侧 = 2πrh" },
            { k: "圆锥", v: "V = ⅓ πr²h" },
            { k: "球", v: "V = 4/3 πr³；表面积 S = 4πr²" }
          ]
        },
        {
          name: "数列与计数", items: [
            { k: "等差数列", v: "an = a₁ + (n−1)d；Sn = n(a₁+an)/2" },
            { k: "等比数列", v: "an = a₁·qⁿ⁻¹；Sn = a₁(1−qⁿ)/(1−q)（q ≠ 1）" },
            { k: "排列 A(n,m)", v: "= n! / (n−m)!" },
            { k: "组合 C(n,m)", v: "= n! / [m!(n−m)!]" }
          ]
        },
        {
          name: "函数与三角", items: [
            { k: "指数运算", v: "aᵐ·aⁿ = aᵐ⁺ⁿ；(aᵐ)ⁿ = aᵐⁿ；(ab)ⁿ = aⁿbⁿ" },
            { k: "对数运算", v: "logₐ(MN) = logₐM + logₐN；logₐ(M/N) = logₐM − logₐN" },
            { k: "同角关系", v: "sin²α + cos²α = 1；tanα = sinα / cosα" },
            { k: "正弦定理", v: "a/sinA = b/sinB = c/sinC = 2R" },
            { k: "余弦定理", v: "a² = b² + c² − 2bc·cosA" }
          ]
        }
      ]
    },

    /* ---------------- 物理常数与公式 ---------------- */
    {
      id: "phys", icon: "🔭", name: "物理常数与公式",
      groups: [
        {
          name: "常用常数", items: [
            { k: "重力常数 g", v: "= 9.8 N/kg（粗略计算取 10 N/kg）" },
            { k: "真空中光速 c", v: "= 3.0 × 10⁸ m/s" },
            { k: "标准大气压 p₀", v: "= 1.013 × 10⁵ Pa（约 760 mmHg）" },
            { k: "水的密度 ρ水", v: "= 1.0 × 10³ kg/m³" },
            { k: "水的比热容 c水", v: "= 4.2 × 10³ J/(kg·℃)" },
            { k: "常见电压", v: "一节干电池 1.5 V；家庭电路 220 V；人体安全电压 ≤ 36 V" },
            { k: "常见温度", v: "标准大气压下水沸点 100 ℃；冰的熔点 0 ℃" },
            { k: "元电荷 e", v: "= 1.6 × 10⁻¹⁹ C" }
          ]
        },
        {
          name: "力学", items: [
            { k: "速度", v: "v = s / t" },
            { k: "密度", v: "ρ = m / V" },
            { k: "重力", v: "G = mg" },
            { k: "压强", v: "p = F / S（固体）；液体压强 p = ρgh" },
            { k: "浮力（阿基米德）", v: "F浮 = ρ液 · g · V排" },
            { k: "杠杆平衡", v: "F₁L₁ = F₂L₂" },
            { k: "功与功率", v: "W = Fs；P = W/t = Fv" },
            { k: "机械效率", v: "η = W有 / W总 × 100%" }
          ]
        },
        {
          name: "热学", items: [
            { k: "热量计算", v: "Q = cmΔt；吸热 Q吸 = cm(t−t₀)，放热 Q放 = cm(t₀−t)" },
            { k: "燃料燃烧放热", v: "Q = mq（固、液体）；Q = Vq（气体）" },
            { k: "热机效率", v: "η = W有 / Q放 × 100%" }
          ]
        },
        {
          name: "电学", items: [
            { k: "欧姆定律", v: "I = U / R" },
            { k: "电功与电功率", v: "W = UIt = Pt；P = UI = W/t" },
            { k: "焦耳定律", v: "Q = I²Rt" },
            { k: "串联电路", v: "I = I₁ = I₂；U = U₁ + U₂；R = R₁ + R₂" },
            { k: "并联电路", v: "U = U₁ = U₂；I = I₁ + I₂；1/R = 1/R₁ + 1/R₂" }
          ]
        },
        {
          name: "光学与声学", items: [
            { k: "光的反射", v: "反射角 = 入射角；三线共面、法线居中" },
            { k: "光的折射", v: "由空气斜射入水或玻璃时，折射角 < 入射角" },
            { k: "凸透镜成像", v: "1/f = 1/u + 1/v" },
            { k: "频率与周期", v: "f = 1/T；λ = vT = v/f" },
            { k: "声速", v: "15 ℃ 空气中 ≈ 340 m/s" }
          ]
        }
      ]
    },

    /* ---------------- 化学常识 ---------------- */
    {
      id: "chem", icon: "⚗️", name: "化学常识",
      groups: [
        {
          name: "常见元素化合价", items: [
            { k: "+1 价常见", v: "H、Na、K、Ag、NH₄（铵根）" },
            { k: "−1 价常见", v: "Cl、F、Br、I、OH、NO₃" },
            { k: "+2 价常见", v: "Ca、Mg、Ba、Zn" },
            { k: "−2 价常见", v: "O、S、SO₄、CO₃" },
            { k: "+3 价常见", v: "Al、Fe（铁还有 +2 价）" },
            { k: "常见变价元素", v: "C（+2、+4）、S（−2、+4、+6）、N（−3、+2、+4、+5）、Mn（+2、+4、+6、+7）、Cu（+1、+2）" },
            { k: "化合价口诀", v: "一价氢氯钾钠银，二价氧钙钡镁锌；三铝四硅五价磷，二三铁、二四碳，二四六硫都齐全，铜汞二价最常见" }
          ]
        },
        {
          name: "常见原子团（根）", items: [
            { k: "氢氧根 OH⁻", v: "−1 价" },
            { k: "硝酸根 NO₃⁻", v: "−1 价" },
            { k: "硫酸根 SO₄²⁻", v: "−2 价" },
            { k: "碳酸根 CO₃²⁻", v: "−2 价" },
            { k: "铵根 NH₄⁺", v: "+1 价" },
            { k: "磷酸根 PO₄³⁻", v: "−3 价" },
            { k: "高锰酸根 MnO₄⁻", v: "−1 价（碳酸氢根 HCO₃⁻ 也是 −1 价）" }
          ]
        },
        {
          name: "1～20 号元素", items: [
            { k: "1—5", v: "H 氢 · He 氦 · Li 锂 · Be 铍 · B 硼" },
            { k: "6—10", v: "C 碳 · N 氮 · O 氧 · F 氟 · Ne 氖" },
            { k: "11—15", v: "Na 钠 · Mg 镁 · Al 铝 · Si 硅 · P 磷" },
            { k: "16—20", v: "S 硫 · Cl 氯 · Ar 氩 · K 钾 · Ca 钙" }
          ]
        },
        {
          name: "常见物质与沉淀", items: [
            { k: "蓝色沉淀", v: "Cu(OH)₂ 氢氧化铜" },
            { k: "红褐色沉淀", v: "Fe(OH)₃ 氢氧化铁" },
            { k: "不溶于稀硝酸的白色沉淀", v: "BaSO₄ 硫酸钡、AgCl 氯化银" },
            { k: "溶于酸并放气的白色沉淀", v: "CaCO₃ 碳酸钙、BaCO₃ 碳酸钡" },
            { k: "溶液颜色", v: "CuSO₄ 蓝色 · FeCl₂ 浅绿色 · FeCl₃ 黄色 · KMnO₄ 紫红色" },
            { k: "CO₂ 检验", v: "通入澄清石灰水变浑浊（CO₂ + Ca(OH)₂ → CaCO₃↓ + H₂O）" },
            { k: "O₂ 检验与验满", v: "带火星木条伸入瓶中复燃；验满置于瓶口" }
          ]
        },
        {
          name: "化学之最", items: [
            { k: "空气成分", v: "N₂ 约 78%（最多）、O₂ 约 21%、稀有气体 0.94%" },
            { k: "地壳元素含量前四", v: "氧 O ＞ 硅 Si ＞ 铝 Al ＞ 铁 Fe" },
            { k: "最轻的气体", v: "H₂ 氢气" },
            { k: "天然最硬的物质", v: "金刚石（C）" },
            { k: "最简单的有机物", v: "甲烷 CH₄；最常用的溶剂是水 H₂O" }
          ]
        }
      ]
    },

    /* ---------------- 语文常识 ---------------- */
    {
      id: "chn", icon: "📖", name: "语文常识",
      groups: [
        {
          name: "修辞手法", items: [
            { k: "比喻", v: "用相似事物打比方，分明喻、暗喻、借喻" },
            { k: "拟人", v: "把物当人来写，赋予人的情感、动作" },
            { k: "夸张", v: "故意扩大或缩小事物特征以突出本质" },
            { k: "排比", v: "三个及以上结构相似、语气一致的句子连用" },
            { k: "对偶", v: "字数相等、结构相同、意义对称的两句" },
            { k: "反复", v: "重复使用同一词语或句子以强调" },
            { k: "设问", v: "自问自答，引起读者注意与思考" },
            { k: "反问", v: "用疑问形式表达确定意思，答案寓于问句" },
            { k: "借代", v: "用相关事物代替本体，如以「帆」代「船」" },
            { k: "其他常见", v: "引用、双关、反语、通感、对比、衬托" }
          ]
        },
        {
          name: "说明文知识", items: [
            { k: "说明方法", v: "举例子、列数字、作比较、打比方、下定义、分类别、作诠释、摹状貌、引资料" },
            { k: "说明顺序", v: "时间顺序、空间顺序、逻辑顺序（由主到次、由因到果、由现象到本质）" },
            { k: "语言特点", v: "准确、严密、科学；生动说明文亦讲求形象性" }
          ]
        },
        {
          name: "记叙文知识", items: [
            { k: "记叙六要素", v: "时间、地点、人物、起因、经过、结果" },
            { k: "记叙顺序", v: "顺叙、倒叙、插叙" },
            { k: "描写方法", v: "外貌、语言、动作、心理、神态描写；正面描写与侧面描写" },
            { k: "表达方式", v: "记叙、描写、抒情、议论、说明" },
            { k: "常见线索", v: "以人、以事、以物、以情、以时间为线索" }
          ]
        },
        {
          name: "病句常见类型", items: [
            { k: "成分残缺", v: "缺主语、缺谓语、缺宾语（常因滥用介词导致）" },
            { k: "搭配不当", v: "主谓、动宾、修饰语与中心语搭配不当" },
            { k: "语序不当", v: "多层定语/状语次序混乱，逻辑顺序颠倒" },
            { k: "重复啰嗦", v: "同义词语重复使用" },
            { k: "前后矛盾 / 否定不当", v: "如「防止不再发生」应删去「不」" },
            { k: "句式杂糅 / 歧义", v: "两种句式混用；一句话可作多种理解" }
          ]
        },
        {
          name: "文学文化常识", items: [
            { k: "四大名著", v: "《三国演义》罗贯中 ·《水浒传》施耐庵 ·《西游记》吴承恩 ·《红楼梦》曹雪芹" },
            { k: "四书五经", v: "四书：大学、中庸、论语、孟子；五经：诗、书、礼、易、春秋" },
            { k: "唐诗代表", v: "李白（浪漫主义）· 杜甫（现实主义）· 王维 · 白居易" },
            { k: "宋词流派", v: "豪放派：苏轼、辛弃疾；婉约派：柳永、李清照" },
            { k: "岁寒三友 / 花中四君子", v: "松、竹、梅 / 梅、兰、竹、菊" },
            { k: "敬辞", v: "令尊、令堂、惠顾、赐教、斧正、久仰、高见" },
            { k: "谦辞", v: "家父、家母、寒舍、拙作、见谅、犬子" }
          ]
        },
        {
          name: "标点符号要点", items: [
            { k: "顿号", v: "并列词语之间的停顿" },
            { k: "分号", v: "并列分句之间的停顿" },
            { k: "冒号", v: "提示下文或总结上文" },
            { k: "引号", v: "直接引用、特殊含义、着重指出、反语讽刺" },
            { k: "破折号", v: "解释说明、话题转换、声音延长" },
            { k: "省略号", v: "内容省略、语意未尽、说话断断续续" },
            { k: "书名号", v: "书名、篇名、报纸、刊物、文件名；课程与主题活动不用书名号" }
          ]
        }
      ]
    },

    /* ---------------- 英语不规则动词 ---------------- */
    {
      id: "eng", icon: "🔤", name: "英语不规则动词",
      groups: [
        {
          name: "A — C", items: [
            { k: "arise", v: "arose · arisen", n: "出现，发生" },
            { k: "am / is", v: "was · been", n: "是" },
            { k: "are", v: "were · been", n: "是" },
            { k: "bear", v: "bore · born", n: "忍受；出生" },
            { k: "beat", v: "beat · beaten", n: "击败，敲打" },
            { k: "become", v: "became · become", n: "变成" },
            { k: "begin", v: "began · begun", n: "开始" },
            { k: "bite", v: "bit · bitten", n: "咬" },
            { k: "blow", v: "blew · blown", n: "吹" },
            { k: "break", v: "broke · broken", n: "打破" },
            { k: "bring", v: "brought · brought", n: "带来" },
            { k: "build", v: "built · built", n: "建造" },
            { k: "burn", v: "burnt / burned · burnt / burned", n: "燃烧" },
            { k: "buy", v: "bought · bought", n: "买" },
            { k: "catch", v: "caught · caught", n: "抓住" },
            { k: "choose", v: "chose · chosen", n: "选择" },
            { k: "come", v: "came · come", n: "来" },
            { k: "cost", v: "cost · cost", n: "花费" },
            { k: "cut", v: "cut · cut", n: "切，割" }
          ]
        },
        {
          name: "D — G", items: [
            { k: "deal", v: "dealt · dealt", n: "处理，应对" },
            { k: "dig", v: "dug · dug", n: "挖" },
            { k: "do", v: "did · done", n: "做" },
            { k: "draw", v: "drew · drawn", n: "画，拉" },
            { k: "dream", v: "dreamt / dreamed · dreamt / dreamed", n: "做梦" },
            { k: "drink", v: "drank · drunk", n: "喝" },
            { k: "drive", v: "drove · driven", n: "驾驶" },
            { k: "eat", v: "ate · eaten", n: "吃" },
            { k: "fall", v: "fell · fallen", n: "落下" },
            { k: "feed", v: "fed · fed", n: "喂养" },
            { k: "feel", v: "felt · felt", n: "感觉" },
            { k: "fight", v: "fought · fought", n: "打架，战斗" },
            { k: "find", v: "found · found", n: "找到" },
            { k: "fly", v: "flew · flown", n: "飞" },
            { k: "forget", v: "forgot · forgotten", n: "忘记" },
            { k: "freeze", v: "froze · frozen", n: "冻结" },
            { k: "get", v: "got · got / gotten", n: "得到" },
            { k: "give", v: "gave · given", n: "给" },
            { k: "go", v: "went · gone", n: "去" },
            { k: "grow", v: "grew · grown", n: "生长，种植" }
          ]
        },
        {
          name: "H — L", items: [
            { k: "hang", v: "hung · hung", n: "悬挂" },
            { k: "have", v: "had · had", n: "有" },
            { k: "hear", v: "heard · heard", n: "听见" },
            { k: "hide", v: "hid · hidden", n: "隐藏" },
            { k: "hit", v: "hit · hit", n: "击打" },
            { k: "hold", v: "held · held", n: "握住，举行" },
            { k: "hurt", v: "hurt · hurt", n: "伤害" },
            { k: "keep", v: "kept · kept", n: "保持" },
            { k: "know", v: "knew · known", n: "知道" },
            { k: "lay", v: "laid · laid", n: "放置，下蛋（及物）" },
            { k: "lead", v: "led · led", n: "领导，带领" },
            { k: "learn", v: "learnt / learned · learnt / learned", n: "学习" },
            { k: "leave", v: "left · left", n: "离开，留下" },
            { k: "lend", v: "lent · lent", n: "借出" },
            { k: "let", v: "let · let", n: "让" },
            { k: "lie", v: "lay · lain", n: "躺，位于（不及物）" },
            { k: "lose", v: "lost · lost", n: "丢失" }
          ]
        },
        {
          name: "M — R", items: [
            { k: "make", v: "made · made", n: "制作，使" },
            { k: "mean", v: "meant · meant", n: "意思是" },
            { k: "meet", v: "met · met", n: "遇见" },
            { k: "pay", v: "paid · paid", n: "支付" },
            { k: "put", v: "put · put", n: "放" },
            { k: "read", v: "read · read", n: "读（读音变为 /red/）" },
            { k: "ride", v: "rode · ridden", n: "骑" },
            { k: "ring", v: "rang · rung", n: "响铃" },
            { k: "rise", v: "rose · risen", n: "升起（不及物）" },
            { k: "run", v: "ran · run", n: "跑" }
          ]
        },
        {
          name: "S — W", items: [
            { k: "say", v: "said · said", n: "说" },
            { k: "see", v: "saw · seen", n: "看见" },
            { k: "sell", v: "sold · sold", n: "卖" },
            { k: "send", v: "sent · sent", n: "发送" },
            { k: "set", v: "set · set", n: "设置，放置" },
            { k: "shake", v: "shook · shaken", n: "摇动" },
            { k: "shine", v: "shone · shone", n: "发光" },
            { k: "shoot", v: "shot · shot", n: "射击" },
            { k: "show", v: "showed · shown", n: "展示" },
            { k: "shut", v: "shut · shut", n: "关闭" },
            { k: "sing", v: "sang · sung", n: "唱" },
            { k: "sink", v: "sank · sunk", n: "下沉" },
            { k: "sit", v: "sat · sat", n: "坐" },
            { k: "sleep", v: "slept · slept", n: "睡觉" },
            { k: "speak", v: "spoke · spoken", n: "说话（某种语言）" },
            { k: "spend", v: "spent · spent", n: "花费" },
            { k: "stand", v: "stood · stood", n: "站" },
            { k: "steal", v: "stole · stolen", n: "偷" },
            { k: "swim", v: "swam · swum", n: "游泳" },
            { k: "take", v: "took · taken", n: "拿，取" },
            { k: "teach", v: "taught · taught", n: "教" },
            { k: "tell", v: "told · told", n: "告诉" },
            { k: "think", v: "thought · thought", n: "想，认为" },
            { k: "throw", v: "threw · thrown", n: "扔" },
            { k: "understand", v: "understood · understood", n: "理解" },
            { k: "wake", v: "woke · woken", n: "醒来" },
            { k: "wear", v: "wore · worn", n: "穿，戴" },
            { k: "win", v: "won · won", n: "赢" },
            { k: "write", v: "wrote · written", n: "写" }
          ]
        },
        {
          name: "易混辨析", items: [
            { k: "lie（躺）", v: "lay · lain", n: "不及物动词，后不接宾语" },
            { k: "lie（说谎）", v: "lied · lied", n: "规则变化，与「躺」不同" },
            { k: "lay（放置）", v: "laid · laid", n: "及物动词，后必须接宾语" },
            { k: "rise", v: "rose · risen", n: "升起（不及物，如太阳升起）" },
            { k: "raise", v: "raised · raised", n: "举起、提高（及物，规则变化）" },
            { k: "find / found", v: "found · found / founded · founded", n: "「找到」与「建立」过去式同形但过去分词不同" }
          ]
        }
      ]
    }
  ];

  /* ============================================================
   * 状态
   * ============================================================ */
  var state = {
    cat: "all",
    kw: "",
    collapsed: {}
  };

  /* ============================================================
   * 工具函数
   * ============================================================ */
  function toast(msg) {
    var t = $("toast");
    if (!t) return;
    t.textContent = msg;
    t.classList.add("show");
    clearTimeout(toast._t);
    toast._t = setTimeout(function () { t.classList.remove("show"); }, 1800);
  }

  function esc(s) {
    return String(s).replace(/[&<>]/g, function (c) {
      return c === "&" ? "&amp;" : (c === "<" ? "&lt;" : "&gt;");
    });
  }

  /* 关键词高亮：先按原文切片，再逐段转义，避免破坏标签 */
  function hlHtml(s, kw) {
    var t = String(s);
    if (!kw) return esc(t);
    var lk = kw.toLowerCase(), ls = t.toLowerCase();
    var out = "", i = 0;
    while (true) {
      var p = ls.indexOf(lk, i);
      if (p < 0) { out += esc(t.slice(i)); break; }
      out += esc(t.slice(i, p)) + "<mark>" + esc(t.slice(p, p + kw.length)) + "<\/mark>";
      i = p + kw.length;
    }
    return out;
  }

  function today() {
    var d = new Date(), p = function (n) { return n < 10 ? "0" + n : String(n); };
    return d.getFullYear() + "-" + p(d.getMonth() + 1) + "-" + p(d.getDate());
  }

  function itemText(it) {
    return it.k + (it.v ? "：" + it.v : "") + (it.n ? "（" + it.n + "）" : "");
  }

  function matchKw(cat, group, it) {
    var kw = state.kw;
    if (!kw) return true;
    var hay = (cat.name + " " + group.name + " " + it.k + " " + (it.v || "") + " " + (it.n || "")).toLowerCase();
    return hay.indexOf(kw) >= 0;
  }

  /* 当前应当渲染的分类（分类筛选） */
  function cats() {
    if (state.cat === "all") return DATA;
    return DATA.filter(function (c) { return c.id === state.cat; });
  }

  /* 命中结果：[{ cat, groups:[{ name, items:[] }] }] */
  function results() {
    var out = [];
    var list = cats();
    for (var i = 0; i < list.length; i++) {
      var cat = list[i], gs = [];
      for (var j = 0; j < cat.groups.length; j++) {
        var g = cat.groups[j];
        var items = g.items.filter(function (it) { return matchKw(cat, g, it); });
        if (items.length) gs.push({ name: g.name, items: items });
      }
      if (gs.length) out.push({ cat: cat, groups: gs });
    }
    return out;
  }

  function countAll() {
    var n = 0;
    for (var i = 0; i < DATA.length; i++) {
      for (var j = 0; j < DATA[i].groups.length; j++) n += DATA[i].groups[j].items.length;
    }
    return n;
  }

  function countGroups() {
    var n = 0;
    for (var i = 0; i < DATA.length; i++) n += DATA[i].groups.length;
    return n;
  }

  /* ============================================================
   * 渲染
   * ============================================================ */
  function render() {
    var res = results();
    var hit = 0;
    for (var i = 0; i < res.length; i++) {
      for (var j = 0; j < res[i].groups.length; j++) hit += res[i].groups[j].items.length;
    }

    $("statTotal").textContent = String(countAll());
    $("statHit").textContent = String(hit);
    $("statCats").textContent = String(DATA.length);
    $("statGroups").textContent = String(countGroups());
    $("stageOk").textContent = state.kw
      ? ("命中 " + hit + " 条 · 关键词「" + state.kw + "」")
      : ("共 " + hit + " 条");

    var wrap = $("listWrap");
    wrap.innerHTML = "";
    $("emptyState").hidden = hit > 0;

    for (var a = 0; a < res.length; a++) wrap.appendChild(section(res[a]));
  }

  function section(sec) {
    var cat = sec.cat;
    var total = 0;
    for (var i = 0; i < sec.groups.length; i++) total += sec.groups[i].items.length;

    var el = document.createElement("div");
    el.className = "qr-section" + (state.collapsed[cat.id] ? " collapsed" : "");

    /* 头部 */
    var head = document.createElement("div");
    head.className = "qr-sec-head";
    head.setAttribute("role", "button");
    head.setAttribute("tabindex", "0");

    var title = document.createElement("span");
    title.className = "qr-sec-title";
    title.textContent = cat.icon + " " + cat.name;

    var cnt = document.createElement("span");
    cnt.className = "qr-sec-count";
    cnt.textContent = total + " 条";

    var spacer = document.createElement("span");
    spacer.className = "qr-sec-spacer";

    var cp = document.createElement("button");
    cp.type = "button";
    cp.className = "qr-sec-btn";
    cp.textContent = "📋 复制本类";
    cp.addEventListener("click", function (e) {
      e.stopPropagation();
      copy(sectionText(sec), "已复制「" + cat.name + "」共 " + total + " 条");
    });

    var arrow = document.createElement("span");
    arrow.className = "qr-sec-arrow";
    arrow.textContent = "▼";

    head.appendChild(title);
    head.appendChild(cnt);
    head.appendChild(spacer);
    head.appendChild(cp);
    head.appendChild(arrow);

    var toggle = function () {
      state.collapsed[cat.id] = !state.collapsed[cat.id];
      el.classList.toggle("collapsed", !!state.collapsed[cat.id]);
    };
    head.addEventListener("click", toggle);
    head.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); toggle(); }
    });

    /* 主体 */
    var body = document.createElement("div");
    body.className = "qr-sec-body";
    for (var g = 0; g < sec.groups.length; g++) body.appendChild(groupBlock(sec.cat, sec.groups[g]));

    el.appendChild(head);
    el.appendChild(body);
    return el;
  }

  function groupBlock(cat, g) {
    var box = document.createElement("div");
    box.className = "qr-group";

    var gt = document.createElement("div");
    gt.className = "qr-group-title";
    gt.innerHTML = hlHtml(g.name, state.kw);
    box.appendChild(gt);

    for (var i = 0; i < g.items.length; i++) box.appendChild(row(g.items[i]));
    return box;
  }

  function row(it) {
    var el = document.createElement("div");
    el.className = "qr-row";

    var main = document.createElement("div");
    var k = document.createElement("div");
    k.className = "qr-k";
    k.innerHTML = hlHtml(it.k, state.kw);
    main.appendChild(k);

    if (it.v) {
      var v = document.createElement("div");
      v.className = "qr-v";
      v.innerHTML = hlHtml(it.v, state.kw);
      main.appendChild(v);
    }
    if (it.n) {
      var n = document.createElement("div");
      n.className = "qr-note";
      n.innerHTML = hlHtml(it.n, state.kw);
      main.appendChild(n);
    }

    var btn = document.createElement("button");
    btn.type = "button";
    btn.className = "qr-copy";
    btn.textContent = "复制";
    btn.addEventListener("click", function () {
      copy(itemText(it), "已复制：" + it.k);
    });

    el.appendChild(main);
    el.appendChild(btn);
    return el;
  }

  /* ============================================================
   * 文本导出
   * ============================================================ */
  function sectionText(sec) {
    var lines = ["【" + sec.cat.name + "】"];
    for (var i = 0; i < sec.groups.length; i++) {
      var g = sec.groups[i];
      lines.push("", "· " + g.name);
      for (var j = 0; j < g.items.length; j++) lines.push("  " + itemText(g.items[j]));
    }
    return lines.join("\\n");
  }

  function allText() {
    var res = results();
    var hit = 0;
    for (var i = 0; i < res.length; i++) {
      for (var j = 0; j < res[i].groups.length; j++) hit += res[i].groups[j].items.length;
    }
    if (!hit) return "";
    var lines = ["学科常识速查表（共 " + hit + " 条" + (state.kw ? " · 关键词「" + state.kw + "」" : "") + "）"];
    for (var a = 0; a < res.length; a++) {
      lines.push("");
      lines.push(sectionText(res[a]));
    }
    return lines.join("\\n");
  }

  /* ============================================================
   * 复制 / 下载 / 打印
   * ============================================================ */
  function copy(text, okMsg) {
    if (!text) { toast("没有可复制的内容"); return; }
    var done = function () { toast(okMsg || "已复制到剪贴板"); };
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(done, fallback);
        return;
      }
    } catch (e) { /* 忽略 */ }
    fallback();
    function fallback() {
      try {
        var ta = document.createElement("textarea");
        ta.value = text;
        ta.setAttribute("readonly", "");
        ta.style.position = "fixed";
        ta.style.opacity = "0";
        document.body.appendChild(ta);
        ta.select();
        document.execCommand("copy");
        document.body.removeChild(ta);
        done();
      } catch (e2) { toast("复制失败，请手动选中复制"); }
    }
  }

  function download() {
    var text = allText();
    if (!text) { toast("当前没有命中内容"); return; }
    try {
      var blob = new Blob(["\\ufeff" + text], { type: "text/plain;charset=utf-8" });
      var url = URL.createObjectURL(blob);
      var a = document.createElement("a");
      a.href = url;
      a.download = "学科常识速查表_" + today() + ".txt";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(function () { URL.revokeObjectURL(url); }, 1500);
      toast("已导出速查表 TXT");
    } catch (e) { toast("导出失败，请使用「复制命中结果」"); }
  }

  /* ============================================================
   * 事件
   * ============================================================ */
  function chips(containerId, attr, onPick) {
    var box = $(containerId);
    box.querySelectorAll(".chip").forEach(function (c) {
      c.addEventListener("click", function () {
        var v = c.getAttribute(attr);
        box.querySelectorAll(".chip").forEach(function (x) { x.classList.remove("active"); });
        c.classList.add("active");
        onPick(v);
      });
    });
  }

  function syncCatChips() {
    $("catChips").querySelectorAll(".chip").forEach(function (c) {
      c.classList.toggle("active", c.getAttribute("data-cat") === state.cat);
    });
  }

  function bind() {

    chips("catChips", "data-cat", function (v) {
      state.cat = v;
      try { localStorage.setItem(CAT_KEY, v); } catch (e) { /* 忽略 */ }
      render();
    });

    $("searchInput").addEventListener("input", function () {
      state.kw = String(this.value || "").trim().toLowerCase();
      state.collapsed = {}; /* 搜索时自动展开全部命中项 */
      render();
    });

    $("btnExpand").addEventListener("click", function () { state.collapsed = {}; render(); });
    $("btnCollapse").addEventListener("click", function () {
      var m = {};
      for (var i = 0; i < DATA.length; i++) m[DATA[i].id] = true;
      state.collapsed = m;
      render();
    });

    $("btnCopy").addEventListener("click", function () {
      var text = allText();
      if (!text) { toast("当前没有命中内容"); return; }
      copy(text, "已复制全部命中结果");
    });
    $("btnDownload").addEventListener("click", download);
    $("btnPrint").addEventListener("click", function () {
      if (!$("listWrap").children.length) { toast("当前没有可打印的内容"); return; }
      try { window.print(); } catch (e) { toast("打印不可用，请用浏览器 Ctrl+P"); }
    });
    $("btnReset").addEventListener("click", function () {
      state.cat = "all";
      state.kw = "";
      state.collapsed = {};
      $("searchInput").value = "";
      syncCatChips();
      render();
      toast("已重置筛选");
    });
  }

  /* ---------- 初始化 ---------- */
  function init() {
    /* 舞台右上角工具栏（⛶ 舞台全屏 / ⚙ 隐藏设置），与随机叫号同构 */
    if (window.EduToolStageToolbar) {
      window.EduToolStageToolbar.init({ stage: ".stage-panel", panelHost: ".workbench", hiddenClass: "setup-hidden" });
    }
    try {
      var c = localStorage.getItem(CAT_KEY);
      if (c) {
        var ok = false;
        for (var i = 0; i < DATA.length; i++) if (DATA[i].id === c) ok = true;
        if (ok || c === "all") state.cat = c;
      }
    } catch (e) { /* 忽略 */ }

    bind();
    syncCatChips();
    render();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
`
    },
    meta: {builtAt: "2026-09-28 11:07:05", sources: {"assets/css/tool-common.css": "d35dcf222690", "tools/quick-ref/quick-ref.css": "25a5a12a85a0", "assets/js/frame-bridge.js": "1131903c1e46", "assets/js/tool-stage-toolbar.js": "30f2ddfe48d2", "tools/quick-ref/quick-ref.js": "3e8acbd6162c"}}
  };
})();