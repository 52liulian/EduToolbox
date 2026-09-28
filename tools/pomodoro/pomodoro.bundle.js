/* 自动生成，请勿手改 —— 源：tools/pomodoro/  ·  构建：2026-09-28 11:07:05 */
/* 用途：file:// 离线场景下 fetch 被 CORS 拦截，站点改用 <script src> 加载本文件，
   拿到工具页面与本地 CSS/JS 文本后走与 http 相同的 Shadow DOM 组件化挂载。
   工具源码改动后请重跑：python .workbuddy/scripts/build_tool_bundles.py */
(function(){
  var g = window.EduToolboxToolBundles || (window.EduToolboxToolBundles = {});
  g["pomodoro"] = {
    html: `<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>番茄钟 | EduToolbox · 专注力训练<\/title>
<link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ctext y='.9em' font-size='90'%3E%F0%9F%8E%93%3C/text%3E%3C/svg%3E">
<link rel="stylesheet" href="pomodoro.css">
<link rel="stylesheet" href="../../assets/css/tool-common.css">
<\/head>
<body>

<!-- ============================================================
     主计时区：模式切换 + 圆形进度环 + 大字倒计时 + 控制按钮
     ============================================================ -->
<main class="timer-stage" id="timerStage" data-mode="focus">

  <!-- 舞台右上角工具栏：⛶ 全屏由共享模块接管；⚙ 由本工具绑定为「打开设置弹层」 -->
  <div class="stage-toolbar">
    <button type="button" class="icon-btn" id="fullscreenBtn" title="全屏">⛶<\/button>
    <button type="button" class="icon-btn" id="hideSetupBtn" title="设置">⚙<\/button>
  <\/div>

  <!-- 模式切换标签 -->
  <div class="mode-tabs" id="modeTabs" role="tablist" aria-label="模式切换">
    <button type="button" class="mode-tab active" data-mode="focus" role="tab" aria-selected="true">专注模式<\/button>
    <button type="button" class="mode-tab" data-mode="short" role="tab" aria-selected="false">短休息<\/button>
    <button type="button" class="mode-tab" data-mode="long" role="tab" aria-selected="false">长休息<\/button>
  <\/div>

  <!-- 圆形进度环 + 大字倒计时 -->
  <div class="ring-wrap">
    <svg class="ring" viewBox="0 0 320 320" aria-hidden="true">
      <!-- 背景圆 -->
      <circle class="ring-bg" cx="160" cy="160" r="140"><\/circle>
      <!-- 进度圆（顺时针递减） -->
      <circle class="ring-fg" id="ringFg" cx="160" cy="160" r="140"
              stroke-dasharray="879.646" stroke-dashoffset="0"
              transform="rotate(-90 160 160)"><\/circle>
    <\/svg>
    <div class="ring-center">
      <div class="time-text" id="timeText">25:00<\/div>
      <div class="phase-text" id="phaseText">点击开始专注<\/div>
    <\/div>
  <\/div>

  <!-- 番茄进度点（4 个一组，完成后进入长休） -->
  <div class="pomo-dots" id="pomoDots" aria-label="当前番茄进度">
    <span class="dot" data-idx="0"><\/span>
    <span class="dot" data-idx="1"><\/span>
    <span class="dot" data-idx="2"><\/span>
    <span class="dot" data-idx="3"><\/span>
  <\/div>

  <!-- 控制按钮组 -->
  <div class="controls">
    <button type="button" class="ctrl-btn ctrl-primary" id="btnStart">开始<\/button>
    <button type="button" class="ctrl-btn ctrl-secondary" id="btnReset" title="重置当前阶段">↺ 重置<\/button>
    <button type="button" class="ctrl-btn ctrl-secondary" id="btnSkip" title="跳过当前阶段">⏭ 跳过<\/button>
  <\/div>

  <!-- 统计区：今日 / 累计 -->
  <div class="stats">
    <div class="stat-item">
      <div class="stat-num" id="statToday">0<\/div>
      <div class="stat-label">今日番茄<\/div>
    <\/div>
    <div class="stat-divider"><\/div>
    <div class="stat-item">
      <div class="stat-num" id="statTotal">0<\/div>
      <div class="stat-label">累计番茄<\/div>
    <\/div>
    <div class="stat-divider"><\/div>
    <div class="stat-item">
      <div class="stat-num" id="statFocusMin">0<\/div>
      <div class="stat-label">累计专注分钟<\/div>
    <\/div>
  <\/div>

<\/main>

<!-- ============================================================
     设置弹层：自定义三种模式时长 + 长休触发条件 + 音效开关
     ============================================================ -->
<div class="modal-mask" id="settingsModal" hidden>
  <div class="modal" role="dialog" aria-modal="true" aria-label="番茄钟设置">
    <div class="modal-head">
      <h3>⚙️ 番茄钟设置<\/h3>
      <button type="button" class="modal-close" id="btnCloseSettings" title="关闭">✕<\/button>
    <\/div>
    <div class="modal-body">
      <label class="field">
        <span class="field-label">专注时长（分钟）<\/span>
        <input type="number" id="setFocus" min="1" max="120" value="25" inputmode="numeric">
      <\/label>
      <label class="field">
        <span class="field-label">短休息时长（分钟）<\/span>
        <input type="number" id="setShort" min="1" max="60" value="5" inputmode="numeric">
      <\/label>
      <label class="field">
        <span class="field-label">长休息时长（分钟）<\/span>
        <input type="number" id="setLong" min="1" max="60" value="15" inputmode="numeric">
      <\/label>
      <label class="field">
        <span class="field-label">长休触发番茄数<\/span>
        <input type="number" id="setRounds" min="2" max="12" value="4" inputmode="numeric">
      <\/label>
      <label class="field field-row">
        <input type="checkbox" id="setAutoStart" checked>
        <span class="field-label">阶段切换后自动开始下一阶段<\/span>
      <\/label>
      <label class="field field-row">
        <input type="checkbox" id="setSound" checked>
        <span class="field-label">阶段切换提示音<\/span>
      <\/label>
      <div class="field-row">
        <button type="button" class="ctrl-btn ctrl-secondary" id="btnTestSound">试听提示音<\/button>
        <button type="button" class="ctrl-btn ctrl-danger" id="btnClearStats">清空统计<\/button>
      <\/div>
    <\/div>
    <div class="modal-foot">
      <button type="button" class="ctrl-btn ctrl-secondary" id="btnCancelSettings">取消<\/button>
      <button type="button" class="ctrl-btn ctrl-primary" id="btnSaveSettings">保存<\/button>
    <\/div>
  <\/div>
<\/div>

<!-- 全屏下方的退出提示 -->
<div class="fs-hint" id="fsHint" hidden>按 Esc 退出全屏<\/div>

<script src="../../assets/js/frame-bridge.js"><\/script>
<script src="../../assets/js/tool-stage-toolbar.js"><\/script>
<script src="pomodoro.js"><\/script>
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
      "tools/pomodoro/pomodoro.css": `/* ============================================================================
 * 番茄钟 · pomodoro.css
 * 仅包含本工具特有样式：主舞台 / 模式标签 / 圆环倒计时 / 进度点 / 控制按钮 /
 *                       设置弹层结构 / 全屏投影
 * 公共底座（ring、ring-bg、ring-fg、mode-tab、controls、ctrl-btn、ctrl-secondary、
 *   stats、stat-item、modal、modal-close、field、field-label、field-row、toast 等）
 *   见 tool-common.css
 * 高度策略：单列居中、内容自然增高，仅 body 主滚动条；仅 stage 全屏时铺满视口
 * ========================================================================== */

/* ---------------------------------------------------------------------------
 * 一、主舞台：单列居中
 * ------------------------------------------------------------------------- */
.timer-stage {
  position: relative; /* 舞台右上角 .stage-toolbar 绝对定位的基准 */
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 26px;
  width: 100%;
  max-width: 720px;
  margin: 0 auto;
  padding: 36px 24px 48px;
}

/* ---------------------------------------------------------------------------
 * 二、模式标签行
 * ------------------------------------------------------------------------- */
.mode-tabs {
  display: inline-flex;
  flex-wrap: wrap;
  gap: 6px;
  padding: 5px;
  background: var(--card-bg);
  border: 1px solid var(--border);
  border-radius: var(--r-pill);
  box-shadow: var(--shadow-sm);
}

/* 按模式给激活标签上色（覆盖公共 .mode-tab.active 的主色渐变） */
.mode-tab[data-mode="focus"].active {
  background: var(--primary-grad);
  box-shadow: var(--shadow-primary);
}
.mode-tab[data-mode="short"].active {
  background: linear-gradient(135deg, #4ade80, #22b36a);
  box-shadow: 0 10px 24px rgba(34, 179, 106, 0.28);
}
.mode-tab[data-mode="long"].active {
  background: linear-gradient(135deg, #60a5fa, #38a3e8);
  box-shadow: 0 10px 24px rgba(56, 163, 232, 0.28);
}

/* ---------------------------------------------------------------------------
 * 三、圆形进度环 + 中心倒计时
 * ------------------------------------------------------------------------- */
.ring-wrap {
  position: relative;
  display: grid;
  place-items: center;
  width: min(78vw, 340px);
  height: min(78vw, 340px);
}
.timer-stage .ring { width: 100%; height: 100%; }

/* 进度色随模式切换 */
#timerStage[data-mode="focus"] .ring-fg { stroke: var(--primary); }
#timerStage[data-mode="short"] .ring-fg { stroke: var(--success); }
#timerStage[data-mode="long"]  .ring-fg { stroke: var(--info); }

.ring-center {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  pointer-events: none;
}
.time-text {
  font-size: clamp(44px, 9vw, 68px);
  font-weight: 800;
  font-variant-numeric: tabular-nums;
  letter-spacing: -0.02em;
  color: var(--text-1);
}
.phase-text {
  font-size: 15px;
  font-weight: 600;
  color: var(--text-3);
  transition: color var(--t-fast) var(--ease);
}
.phase-text.running { color: var(--primary); }

/* ---------------------------------------------------------------------------
 * 四、番茄进度点
 * ------------------------------------------------------------------------- */
.pomo-dots { display: inline-flex; gap: 12px; }
.pomo-dots .dot {
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: var(--border-2);
  transition: all var(--t-fast) var(--ease);
}
.pomo-dots .dot.done {
  background: var(--primary);
  box-shadow: 0 0 0 3px var(--primary-soft);
}
.pomo-dots .dot.current {
  background: var(--primary);
  animation: pomo-pulse 1.2s ease-in-out infinite;
}
@keyframes pomo-pulse {
  0%, 100% { transform: scale(1);   box-shadow: 0 0 0 3px var(--primary-soft); }
  50%      { transform: scale(1.25); box-shadow: 0 0 0 6px var(--primary-soft); }
}

/* ---------------------------------------------------------------------------
 * 五、控制按钮
 * ------------------------------------------------------------------------- */
.timer-stage .controls { gap: 14px; margin-top: 0; }
.ctrl-btn.ctrl-primary {
  color: #fff;
  background: var(--primary-grad);
  border-color: transparent;
  box-shadow: var(--shadow-primary);
  padding: 13px 34px;
  font-size: 16px;
}
.ctrl-btn.ctrl-primary:hover {
  color: #fff;
  filter: brightness(1.05);
  transform: translateY(-1px);
}
.ctrl-btn.ctrl-danger {
  color: var(--danger);
  border-color: #ffd4d4;
  background: #fff5f5;
}
.ctrl-btn.ctrl-danger:hover {
  color: #fff;
  background: var(--danger);
  border-color: var(--danger);
}

/* ---------------------------------------------------------------------------
 * 六、统计区分隔线
 * ------------------------------------------------------------------------- */
.timer-stage .stats { gap: 22px; }
.stat-divider {
  width: 1px;
  align-self: stretch;
  background: var(--border);
}

/* ---------------------------------------------------------------------------
 * 七、设置弹层结构（公共 .modal / .modal-close 已有，这里补 head/body/foot）
 * ------------------------------------------------------------------------- */
.modal-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 16px;
}
.modal-head h3 { font-size: 18px; }
.modal-body { display: flex; flex-direction: column; gap: 14px; }
.modal-body .field {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: 0;
}
.modal-body .field-row {
  flex-direction: row;
  align-items: center;
  gap: 10px;
  margin-bottom: 0;
}
.modal-body input[type="number"] { width: 140px; }
.modal-foot {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 18px;
}

/* ---------------------------------------------------------------------------
 * 八、全屏退出提示
 * ------------------------------------------------------------------------- */
.fs-hint {
  position: fixed;
  bottom: 24px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1100;
  padding: 8px 18px;
  font-size: 13px;
  color: #fff;
  background: rgba(20, 28, 48, 0.8);
  border-radius: var(--r-pill);
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
}

/* ---------------------------------------------------------------------------
 * 九、全屏投影（stage 为全屏元素，铺满视口并放大）
 * ------------------------------------------------------------------------- */
#timerStage:fullscreen,
#timerStage:-webkit-full-screen,
#timerStage.edutf-solo{
  background: var(--bg);
  max-width: none;
  padding: 40px;
  gap: 40px;
}
#timerStage:fullscreen .ring-wrap,
#timerStage:-webkit-full-screen .ring-wrap,
#timerStage.edutf-solo .ring-wrap{
  width: min(60vh, 560px);
  height: min(60vh, 560px);
}
#timerStage:fullscreen .time-text,
#timerStage:-webkit-full-screen .time-text,
#timerStage.edutf-solo .time-text{
  font-size: clamp(72px, 12vh, 120px);
}

/* ---------------------------------------------------------------------------
 * 十、小屏微调
 * ------------------------------------------------------------------------- */
@media (max-width: 640px) {
  .timer-stage { padding: 24px 16px 36px; gap: 22px; }
  .timer-stage .stats { gap: 14px; }
  .stat-item { min-width: 90px; padding: 10px 14px; }
}
`,
      "tools/pomodoro/pomodoro.js": `/**
 * 番茄钟 · 专注力训练（Pomodoro Timer）
 * ----------------------------------------------------------------
 * 功能清单：
 *   1. 三种模式切换：专注（默认 25 分钟）/ 短休息（5 分钟）/ 长休息（15 分钟）
 *   2. 大字倒计时 mm:ss 显示，时间戳精准计时，不受 setInterval 抖动影响
 *   3. SVG 圆形进度环（dasharray/dashoffset 驱动，颜色随模式切换）
 *   4. 开始 / 暂停 / 重置 / 跳过 控制按钮
 *   5. 完成 4 个番茄后自动进入长休（数量可在设置中自定义 2~12）
 *   6. 番茄完成统计：今日 / 累计 / 累计专注分钟
 *   7. 阶段切换提示音（Web Audio API 合成“滴滴”声，无外部音频文件）
 *   8. 全屏模式（Fullscreen API，支持 Esc 退出）
 *   9. localStorage 持久化设置（各模式时长 / 长休触发 / 自动开始 / 音效开关）与统计
 *  10. 键盘快捷键：空格 开始/暂停、R 重置、S 跳过、F 全屏、Esc 退出全屏/关闭弹层
 *
 * 兼容性：纯前端 IIFE，无 fetch / Worker / import，可双击 file:// 直接打开
 */
(function () {
  "use strict";

  /** 持久化键：设置 */
  var STORAGE_KEY = "pomodoro:settings:v1";
  /** 持久化键：统计 */
  var STATS_KEY = "pomodoro:stats:v1";

  /** 模式枚举：专注 / 短休 / 长休 */
  var MODE = { focus: "focus", short: "short", long: "long" };

  /** 模式 -> 中文显示文本 */
  var MODE_LABEL = {
    focus: "专注中",
    short: "短休息",
    long:  "长休息"
  };

  /** 默认设置（首次访问或本地数据损坏时回退） */
  var DEFAULTS = {
    focusMin: 25,
    shortMin: 5,
    longMin:  15,
    rounds:   4,    // 每完成多少个番茄触发长休
    autoStart: true,
    sound:    true
  };

  /** 圆形进度环周长（半径 r=140 → 2πr ≈ 879.646） */
  var RING_CIRCUM = 2 * Math.PI * 140;

  /**
   * 按 id 获取 DOM 元素
   * @param  {string} id - 元素 id 属性
   * @return {HTMLElement|null} 找到的元素，无匹配返回 null
   */
  function $(id) { return document.getElementById(id); }

  // —— DOM 引用 ——
  var stage       = $("timerStage");
  var modeTabs    = $("modeTabs");
  var ringFg      = $("ringFg");
  var timeText    = $("timeText");
  var phaseText   = $("phaseText");
  var pomoDots    = $("pomoDots");
  var btnStart    = $("btnStart");
  var btnReset    = $("btnReset");
  var btnSkip     = $("btnSkip");
  var btnFullscreen = $("fullscreenBtn");   // ⛶ 全屏：由共享模块 tool-stage-toolbar.js 接管
  var btnHideSetup  = $("hideSetupBtn");    // ⚙ 本工具复用为「打开设置弹层」
  var btnCloseSettings = $("btnCloseSettings");
  var btnCancelSettings = $("btnCancelSettings");
  var btnSaveSettings  = $("btnSaveSettings");
  var btnTestSound = $("btnTestSound");
  var btnClearStats = $("btnClearStats");
  var settingsModal = $("settingsModal");
  var fsHint = $("fsHint");
  var statToday  = $("statToday");
  var statTotal = $("statTotal");
  var statFocusMin = $("statFocusMin");

  // —— 计时状态变量 ——
  var timerId = null;       // setInterval 句柄
  var audioCtx = null;      // WebAudio 上下文（延迟创建，避免浏览器自动播放策略拦截）
  var settings = null;     // 当前设置（从 localStorage 加载）
  var stats = null;        // 当前统计（从 localStorage 加载）
  var mode = MODE.focus;   // 当前模式
  var totalMs = 0;         // 当前阶段总时长（毫秒）
  var remainingMs = 0;     // 剩余时长（毫秒）
  var endAt = 0;           // 运行时的结束时间戳
  var running = false;     // 是否正在走时
  var completedFocus = 0;  // 本轮已完成的连续专注番茄数（达 rounds 时触发长休并归零）

  /* ============================================================
   * 工具函数
   * ============================================================ */

  /**
   * 把毫秒格式化为 MM:SS（向上取整，最后一秒显示 00:01）
   * @param  {number} ms - 剩余毫秒
   * @return {string}    形如 "25:00" 的字符串
   * @throws 不抛异常，参数非法时返回 "00:00"
   */
  function format(ms) {
    if (!isFinite(ms) || ms < 0) ms = 0;
    var totalSec = Math.max(0, Math.ceil(ms / 1000));
    var m = Math.floor(totalSec / 60);
    var s = totalSec % 60;
    return String(m).padStart(2, "0") + ":" + String(s).padStart(2, "0");
  }

  /**
   * 获取当前模式对应的总分钟数
   * @param  {string} m - 模式枚举（focus/short/long）
   * @return {number}    分钟数，默认值兜底
   */
  function minutesFor(m) {
    if (m === MODE.focus) return settings.focusMin;
    if (m === MODE.short) return settings.shortMin;
    if (m === MODE.long)  return settings.longMin;
    return settings.focusMin;
  }

  /**
   * 安全读取 localStorage 中的 JSON
   * @param  {string} key - 存储键
   * @param  {*} fallback  - 解析失败/不存在时返回的兜底值
   * @return {*}           解析后的对象或 fallback
   */
  function loadJSON(key, fallback) {
    try {
      var raw = localStorage.getItem(key);
      if (!raw) return fallback;
      return JSON.parse(raw);
    } catch (e) {
      return fallback;
    }
  }

  /**
   * 安全写入 localStorage 中的 JSON
   * @param {string} key - 存储键
   * @param {*} value     - 任意可序列化数据
   * @return {void}
   */
  function saveJSON(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      // 隐私模式或配额超限时静默失败，不影响运行
    }
  }

  /**
   * 获取今日日期字符串 YYYY-MM-DD（本地时区）
   * @return {string} 如 "2026-09-14"
   */
  function todayKey() {
    var d = new Date();
    var m = String(d.getMonth() + 1).padStart(2, "0");
    var day = String(d.getDate()).padStart(2, "0");
    return d.getFullYear() + "-" + m + "-" + day;
  }

  /* ============================================================
   * Web Audio 提示音
   * ============================================================ */

  /**
   * 懒初始化 AudioContext（用户首次交互后创建，规避浏览器自动播放策略）
   * @return {AudioContext|null} 已就绪的上下文，创建失败返回 null
   */
  function ensureAudio() {
    if (!settings.sound) return null;
    if (audioCtx) return audioCtx;
    try {
      var Ctor = window.AudioContext || window.webkitAudioContext;
      if (!Ctor) return null;
      audioCtx = new Ctor();
      return audioCtx;
    } catch (e) {
      return null;
    }
  }

  /**
   * 合成单次提示音
   * @param {number} freq    - 频率（Hz）
   * @param {number} startAt - 相对开始的偏移时间（秒）
   * @param {number} duration- 持续时间（秒）
   * @return {void}
   */
  function beep(freq, startAt, duration) {
    var ctx = ensureAudio();
    if (!ctx) return;
    // 浏览器要求用户交互后才能 resume
    if (ctx.state === "suspended") { ctx.resume(); }
    var osc = ctx.createOscillator();
    var gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.value = freq;
    // 包络：起音 0.01s、保持、释音 0.05s，避免咔哒声
    var t0 = ctx.currentTime + startAt;
    gain.gain.setValueAtTime(0, t0);
    gain.gain.linearRampToValueAtTime(0.25, t0 + 0.01);
    gain.gain.setValueAtTime(0.25, t0 + duration - 0.05);
    gain.gain.linearRampToValueAtTime(0, t0 + duration);
    osc.connect(gain).connect(ctx.destination);
    osc.start(t0);
    osc.stop(t0 + duration + 0.02);
  }

  /**
   * 播放阶段切换提示音：两声“嘀嘀”
   * @return {void}
   */
  function playChime() {
    if (!settings.sound) return;
    beep(880, 0.00, 0.18);   // 第一声
    beep(1320, 0.22, 0.22); // 第二声（更高音）
  }

  /* ============================================================
   * 渲染层
   * ============================================================ */

  /**
   * 设置进度环偏移量与文本显示
   * @param {number} ms - 剩余毫秒
   * @return {void}
   */
  function renderTime(ms) {
    timeText.textContent = format(ms);
    // 剩余比例 = 剩余 / 总时长；offset 从 0（满）线性增长到 RING_CIRCUM（空）
    var ratio = totalMs > 0 ? ms / totalMs : 0;
    if (ratio < 0) ratio = 0;
    var offset = RING_CIRCUM * (1 - ratio);
    ringFg.setAttribute("stroke-dashoffset", String(offset));
    // 同步标签页标题，方便切到其他标签时查看
    document.title = format(ms) + " · " + MODE_LABEL[mode] + " | 番茄钟";
  }

  /**
   * 渲染番茄进度点：已完成的连续专注数 + 当前是否进行中
   * @return {void}
   */
  function renderDots() {
    var dots = pomoDots.querySelectorAll(".dot");
    for (var i = 0; i < dots.length; i++) {
      dots[i].classList.remove("done", "current");
    }
    // 仅专注模式显示进度，其他模式保持 4 个圆点的完成态指示
    var n = Math.min(completedFocus, settings.rounds);
    for (var j = 0; j < n; j++) {
      if (dots[j]) dots[j].classList.add("done");
    }
    if (mode === MODE.focus && running && n < settings.rounds && dots[n]) {
      dots[n].classList.add("current");
    }
  }

  /**
   * 渲染统计数字到 DOM
   * @return {void}
   */
  function renderStats() {
    statToday.textContent  = String(stats.today);
    statTotal.textContent = String(stats.total);
    statFocusMin.textContent = String(stats.focusMin);
  }

  /**
   * 切换模式：更新 data-mode、按钮激活态、阶段文本与时长
   * @param {string} m - 目标模式枚举
   * @return {void}
   */
  function switchMode(m) {
    mode = m;
    stage.setAttribute("data-mode", m);
    // 更新模式按钮激活态
    var tabs = modeTabs.querySelectorAll(".mode-tab");
    for (var i = 0; i < tabs.length; i++) {
      var active = tabs[i].getAttribute("data-mode") === m;
      tabs[i].classList.toggle("active", active);
      tabs[i].setAttribute("aria-selected", active ? "true" : "false");
    }
    // 同步设置弹层中的当前值（防止用户再次打开时混淆）
    // 重置时间与状态
    stopTimer();
    totalMs = minutesFor(m) * 60 * 1000;
    remainingMs = totalMs;
    renderTime(remainingMs);
    phaseText.textContent = "点击开始" + MODE_LABEL[m];
    phaseText.classList.remove("running");
    btnStart.textContent = "开始";
    renderDots();
  }

  /* ============================================================
   * 计时核心
   * ============================================================ */

  /**
   * 启动 setInterval 计时（每次 tick 基于时间戳推算剩余时间）
   * @return {void}
   */
  function startTick() {
    stopTimer();
    timerId = setInterval(tick, 250);
  }

  /**
   * 停止 setInterval
   * @return {void}
   */
  function stopTimer() {
    if (timerId) { clearInterval(timerId); timerId = null; }
  }

  /**
   * 单次 tick：基于 endAt 计算剩余时间，到点触发完成
   * @return {void}
   */
  function tick() {
    if (!running) return;
    var now = Date.now();
    var ms = endAt - now;
    if (ms <= 0) {
      // 阶段结束
      renderTime(0);
      finish();
      return;
    }
    remainingMs = ms;
    renderTime(ms);
  }

  /**
   * 开始或暂停计时（按钮入口）
   * @return {void}
   */
  function toggleStart() {
    if (running) {
      // 暂停：保留 remainingMs，清空 endAt
      running = false;
      stopTimer();
      btnStart.textContent = "继续";
      phaseText.textContent = "已暂停";
      phaseText.classList.remove("running");
      renderDots();
    } else {
      // 开始/继续：基于 remainingMs 推算 endAt
      running = true;
      endAt = Date.now() + remainingMs;
      btnStart.textContent = "暂停";
      phaseText.textContent = MODE_LABEL[mode] + "…";
      phaseText.classList.add("running");
      // 首次交互时尝试解锁 AudioContext
      ensureAudio();
      startTick();
      renderDots();
    }
  }

  /**
   * 重置当前阶段：停止计时并恢复初始时长
   * @return {void}
   */
  function reset() {
    running = false;
    stopTimer();
    remainingMs = totalMs;
    renderTime(remainingMs);
    phaseText.textContent = "点击开始" + MODE_LABEL[mode];
    phaseText.classList.remove("running");
    btnStart.textContent = "开始";
    renderDots();
  }

  /**
   * 跳过当前阶段：按完成情况判定是否计数番茄
   * @return {void}
   */
  function skip() {
    // 跳过不计数统计，仅推进阶段流转
    advance(false);
  }

  /**
   * 阶段完成处理：播放提示音 + 累计统计 + 推进下一阶段
   * @return {void}
   */
  function finish() {
    running = false;
    stopTimer();
    playChime();
    // 仅专注完成时累计统计
    var counted = (mode === MODE.focus);
    if (counted) {
      completedFocus++;
      stats.today++;
      stats.total++;
      stats.focusMin += settings.focusMin;
      saveJSON(STATS_KEY, stats);
      renderStats();
    }
    advance(counted);
  }

  /**
   * 推进到下一阶段
   * @param {boolean} focusDone - 本次是否为专注阶段正常完成
   * @return {void}
   */
  function advance(focusDone) {
    var nextMode;
    if (mode === MODE.focus) {
      // 专注完成 → 判断是否触发长休
      if (focusDone && completedFocus >= settings.rounds) {
        nextMode = MODE.long;
        completedFocus = 0; // 触发长休后归零
      } else {
        nextMode = MODE.short;
      }
    } else {
      // 休息结束 → 回到专注
      nextMode = MODE.focus;
    }
    switchMode(nextMode);
    // 是否自动开始下一阶段
    if (settings.autoStart) {
      // 略延迟，避免提示音与开始按钮同帧冲突
      setTimeout(function () { toggleStart(); }, 300);
    }
  }

  /* ============================================================
   * 设置弹层
   * ============================================================ */

  /**
   * 打开设置弹层并填充当前值
   * @return {void}
   */
  function openSettings() {
    $("setFocus").value = settings.focusMin;
    $("setShort").value = settings.shortMin;
    $("setLong").value  = settings.longMin;
    $("setRounds").value = settings.rounds;
    $("setAutoStart").checked = settings.autoStart;
    $("setSound").checked    = settings.sound;
    settingsModal.hidden = false;
  }

  /**
   * 关闭设置弹层（不保存）
   * @return {void}
   */
  function closeSettings() {
    settingsModal.hidden = true;
  }

  /**
   * 保存设置：读取输入并校验范围，写入 localStorage 并应用到当前阶段
   * @return {void}
   */
  function saveSettings() {
    var f = parseInt($("setFocus").value, 10);
    var s = parseInt($("setShort").value, 10);
    var l = parseInt($("setLong").value, 10);
    var r = parseInt($("setRounds").value, 10);
    // 范围校验，非法回退默认值
    settings.focusMin = (f >= 1 && f <= 120) ? f : DEFAULTS.focusMin;
    settings.shortMin = (s >= 1 && s <= 60)  ? s : DEFAULTS.shortMin;
    settings.longMin  = (l >= 1 && l <= 60)  ? l : DEFAULTS.longMin;
    settings.rounds   = (r >= 2 && r <= 12)  ? r : DEFAULTS.rounds;
    settings.autoStart = !!$("setAutoStart").checked;
    settings.sound     = !!$("setSound").checked;
    saveJSON(STORAGE_KEY, settings);
    closeSettings();
    // 重新初始化当前阶段（非运行中才更新，避免覆盖正在计时的剩余时间）
    if (!running) {
      switchMode(mode);
    }
    // 调整进度点数量（4 个固定圆点 + 数量映射高亮）
    renderDots();
  }

  /**
   * 清空所有统计数据（带二次确认）
   * @return {void}
   */
  function clearStats() {
    if (!confirm("确定清空所有番茄统计？此操作不可恢复。")) return;
    stats = { today: 0, total: 0, focusMin: 0, date: todayKey() };
    saveJSON(STATS_KEY, stats);
    renderStats();
  }

  /* ============================================================
   * 跨日重置 & 全屏
   * ============================================================ */

  /**
   * 检查今日是否跨日，跨日则重置 today 计数
   * @return {void}
   */
  function checkDayRollover() {
    var t = todayKey();
    if (stats.date !== t) {
      stats.date = t;
      stats.today = 0;
      saveJSON(STATS_KEY, stats);
      renderStats();
    }
  }

  /**
   * 切换全屏：转发给舞台右上角 ⛶ 按钮（真实全屏逻辑在
   * assets/js/tool-stage-toolbar.js 里，本文件不再自行调用 requestFullscreen）
   * @return {void}
   */
  function toggleFullscreen() {
    if (btnFullscreen) btnFullscreen.click();
  }

  /**
   * 全屏状态变化时显示/隐藏退出提示
   * @return {void}
   */
  function onFsChange() {
    var isFs = document.fullscreenElement || document.webkitFullscreenElement;
    fsHint.hidden = !isFs;
  }

  /* ============================================================
   * 事件绑定
   * ============================================================ */

  /**
   * 绑定所有 UI 事件（仅在初始化时调用一次）
   * @return {void}
   */
  function bindEvents() {
    // 模式标签点击
    modeTabs.addEventListener("click", function (e) {
      var btn = e.target.closest(".mode-tab");
      if (!btn) return;
      var m = btn.getAttribute("data-mode");
      if (m && m !== mode) switchMode(m);
    });

    btnStart.addEventListener("click", toggleStart);
    btnReset.addEventListener("click", reset);
    btnSkip.addEventListener("click", skip);

    btnHideSetup.addEventListener("click", openSettings);
    btnCloseSettings.addEventListener("click", closeSettings);
    btnCancelSettings.addEventListener("click", closeSettings);
    btnSaveSettings.addEventListener("click", saveSettings);
    btnTestSound.addEventListener("click", playChime);
    btnClearStats.addEventListener("click", clearStats);

    document.addEventListener("fullscreenchange", onFsChange);
    document.addEventListener("webkitfullscreenchange", onFsChange);

    // 点击遮罩关闭弹层
    settingsModal.addEventListener("click", function (e) {
      if (e.target === settingsModal) closeSettings();
    });

    // 键盘快捷键
    document.addEventListener("keydown", function (e) {
      // 输入框聚焦时不拦截
      var tag = (e.target && e.target.tagName) || "";
      if (tag === "INPUT" || tag === "TEXTAREA") return;
      // 弹层打开时仅允许 Esc 关闭
      if (!settingsModal.hidden) {
        if (e.key === "Escape") closeSettings();
        return;
      }
      switch (e.key) {
        case " ":
        case "Spacebar":
          e.preventDefault();
          toggleStart();
          break;
        case "r":
        case "R":
          reset();
          break;
        case "s":
        case "S":
          skip();
          break;
        case "f":
        case "F":
          toggleFullscreen();
          break;
        case "Escape":
          if (document.fullscreenElement || document.webkitFullscreenElement) {
            // Esc 退出全屏由浏览器原生处理，这里无需额外动作
          }
          break;
      }
    });
  }

  /* ============================================================
   * 初始化
   * ============================================================ */

  /**
   * 初始化：加载持久化数据 → 校验补全 → 渲染 → 绑定事件
   * @return {void}
   */
  function init() {
    // 加载设置，缺失字段用默认值补全
    var loaded = loadJSON(STORAGE_KEY, null) || {};
    settings = {
      focusMin:  typeof loaded.focusMin  === "number" ? loaded.focusMin  : DEFAULTS.focusMin,
      shortMin:  typeof loaded.shortMin  === "number" ? loaded.shortMin  : DEFAULTS.shortMin,
      longMin:   typeof loaded.longMin   === "number" ? loaded.longMin   : DEFAULTS.longMin,
      rounds:    typeof loaded.rounds     === "number" ? loaded.rounds     : DEFAULTS.rounds,
      autoStart: typeof loaded.autoStart === "boolean" ? loaded.autoStart : DEFAULTS.autoStart,
      sound:     typeof loaded.sound     === "boolean" ? loaded.sound     : DEFAULTS.sound
    };

    // 加载统计
    var loadedStats = loadJSON(STATS_KEY, null) || {};
    stats = {
      today:    typeof loadedStats.today    === "number" ? loadedStats.today    : 0,
      total:    typeof loadedStats.total    === "number" ? loadedStats.total    : 0,
      focusMin: typeof loadedStats.focusMin === "number" ? loadedStats.focusMin : 0,
      date:     typeof loadedStats.date     === "string" ? loadedStats.date     : todayKey()
    };
    checkDayRollover();

    // 初始化进度环 dasharray
    ringFg.setAttribute("stroke-dasharray", String(RING_CIRCUM));

    // 默认进入专注模式
    switchMode(MODE.focus);
    renderStats();
    bindEvents();

    /* 舞台右上角工具栏（⛶ 全屏 / ⚙ 设置）：全屏目标是 #timerStage 自身。
       番茄钟没有可隐藏的设置栏（设置为弹层），故 panelHost 传 null ——
       共享模块只接全屏，不做任何显隐操作。 */
    if (window.EduToolStageToolbar) {
      window.EduToolStageToolbar.init({ stage: "#timerStage", panelHost: null });
    }
  }

  // DOM 就绪后启动
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
`
    },
    meta: {builtAt: "2026-09-28 11:07:05", sources: {"tools/pomodoro/pomodoro.css": "adb39711e0d9", "assets/css/tool-common.css": "d35dcf222690", "assets/js/frame-bridge.js": "1131903c1e46", "assets/js/tool-stage-toolbar.js": "30f2ddfe48d2", "tools/pomodoro/pomodoro.js": "9a60f68d047d"}}
  };
})();