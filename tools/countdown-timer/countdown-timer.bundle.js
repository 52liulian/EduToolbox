/* 自动生成，请勿手改 —— 源：tools/countdown-timer/  ·  构建：2026-09-28 11:07:05 */
/* 用途：file:// 离线场景下 fetch 被 CORS 拦截，站点改用 <script src> 加载本文件，
   拿到工具页面与本地 CSS/JS 文本后走与 http 相同的 Shadow DOM 组件化挂载。
   工具源码改动后请重跑：python .workbuddy/scripts/build_tool_bundles.py */
(function(){
  var g = window.EduToolboxToolBundles || (window.EduToolboxToolBundles = {});
  g["countdown-timer"] = {
    html: `<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>倒计时 | EduToolbox · 极简倒计时工具<\/title>
<link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ctext y='.9em' font-size='90'%3E%F0%9F%8E%93%3C/text%3E%3C/svg%3E">
<link rel="stylesheet" href="countdown-timer.css">
<link rel="stylesheet" href="../../assets/css/tool-common.css">
<\/head>
<body>

<!-- 设置页 -->
<section class="screen setup-screen" id="setupScreen">
  <h2 class="title">⏳ 极简倒计时<\/h2>
  <p class="subtitle">深色大屏 · 每秒提示音 · 全屏专注<\/p>

  <div class="big-input">
    <input type="number" id="inputMin" min="0" max="999" value="5" inputmode="numeric">
    <span class="colon">:<\/span>
    <input type="number" id="inputSec" min="0" max="59" value="0" inputmode="numeric">
  <\/div>
  <div class="field-hint"><span id="minLabel">分<\/span><span id="secLabel">秒<\/span><\/div>

  <!-- 时间微调按钮：±1分 / ±10秒 -->
  <div class="adjust" id="adjust">
    <button type="button" class="adj-btn" data-delta="-60000" title="-1 分钟">−1 分<\/button>
    <button type="button" class="adj-btn" data-delta="-10000" title="-10 秒">−10 秒<\/button>
    <span class="adj-current" id="adjCurrent">5 分<\/span>
    <button type="button" class="adj-btn" data-delta="10000" title="+10 秒">+10 秒<\/button>
    <button type="button" class="adj-btn" data-delta="60000" title="+1 分钟">+1 分<\/button>
  <\/div>

  <div class="chips" id="chips">
    <button type="button" class="chip" data-min="1">1 分钟<\/button>
    <button type="button" class="chip" data-min="3">3 分钟<\/button>
    <button type="button" class="chip" data-min="5">5 分钟<\/button>
    <button type="button" class="chip" data-min="10">10 分钟<\/button>
    <button type="button" class="chip" data-min="15">15 分钟<\/button>
    <button type="button" class="chip" data-min="30">30 分钟<\/button>
    <button type="button" class="chip" data-min="45">45 分钟<\/button>
    <button type="button" class="chip" data-min="60">60 分钟<\/button>
    <button type="button" class="chip" data-min="90">90 分钟<\/button>
    <button type="button" class="chip" data-min="120">120 分钟<\/button>
  <\/div>

  <button type="button" class="start-btn" id="btnStart">▶ 开始<\/button>
<\/section>

<!-- 倒计时页 -->
<section class="screen run-screen hidden" id="runScreen">
  <!-- 舞台右上角工具栏：⛶ 全屏（由 assets/js/tool-stage-toolbar.js 接管） -->
  <div class="stage-toolbar">
    <button type="button" class="icon-btn" id="fullscreenBtn" title="全屏">⛶<\/button>
  <\/div>

  <div class="time-text" id="timeText" title="点击暂停 / 继续">05:00<\/div>
  <div class="finish-text hidden" id="finishText">⏰ 时间到<\/div>
  <div class="run-actions">
    <button type="button" class="neon-btn" id="btnPause">⏸ 暂停<\/button>
    <button type="button" class="neon-btn ghost" id="btnReset">↩ 重置<\/button>
  <\/div>
  <p class="run-hint">空格 = 暂停 / 继续 · R = 重置 · Esc = 退出全屏<\/p>
<\/section>

<!-- 底部细线进度条 -->
<div class="progress-track" id="progressTrack"><div class="progress-bar" id="progressBar"><\/div><\/div>

<script src="../../assets/js/frame-bridge.js"><\/script>
<script src="../../assets/js/tool-stage-toolbar.js"><\/script>
<script src="countdown-timer.js"><\/script>
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
      "tools/countdown-timer/countdown-timer.css": `/* ============================================================================
 * countdown-timer.css · 极简倒计时（深色霓虹大屏专属样式）
 * ----------------------------------------------------------------------------
 * 依赖底座：../../assets/css/tool-common.css（后加载）
 *   覆盖策略：本工具整体为深色场景，需要压掉底座的浅色 body。注意底座是【后
 *   加载】的同特异性规则，且在 Shadow DOM 下外部文档树的普通声明会压过影子树
 *   内的普通声明 —— 所以本文件的页面级覆盖一律走 \`body + !important\`
 *   （原理与实测数据见「2. 深色页面底」段注释），不靠堆特异性。
 * 内容分区：
 *   1. 强调色变量（霓虹绿兜底；站点配色由 JS 映射，原理见该段注释）
 *   2. 深色页面底
 *   3. 设置页（大数字输入 / 微调 / 预设 chips / 开始按钮）
 *   4. 倒计时大屏（霓虹大字 / 时间到闪烁 / 操作按钮）
 *   5. 底部细线进度条（最后 10 秒变红）
 *   6. 全屏投影（Fullscreen API，仅此场景固定视口）
 *   7. 减弱动效
 * 高度策略：两屏均 min-height:100vh 内容居中，内容超高时由 body 主滚动条承担。
 * ========================================================================== */

/* ---------------------------------------------------------------------------
 * 1. 强调色（--accent 霓虹强调色；--accent-rgb 供 rgba() 辉光使用，逗号分隔）
 * ----------------------------------------------------------------------------
 * 颜色来源：站点全局 🎨 配色（顶栏 #accentBtn → localStorage 键 et-accent）。
 *   映射由 countdown-timer.js 的 applyAccent() 完成：读配色名 → 查工具霓虹色
 *   调色板 → 把 --accent / --accent-rgb 写成工具根容器的内联自定义属性
 *   （站点内嵌 = 影子树内层 .tool-page；独立页 = <body>）。
 *   这里只提供兜底值，两种场景都会命中它：
 *     ① 用户从未在站点选过配色（et-accent 键不存在）→ JS 不写内联 → 霓虹绿，
 *        与改造前默认完全一致，视觉不跳变；
 *     ② 独立页（file:// 双击打开）没有站点配色通道 → 同样是霓虹绿。
 *
 * ⚠️ 选择器必须是 body 而不是 html body：内嵌时 rebaseCss 逐个 token 替换，
 *    \`html body\` 会变成 \`:host :host\`（后代选择器），影子树里永不命中。
 * ⚠️ 不要用 body[data-theme="x"] 写映射表：内嵌时会被重基成
 *    \`:host[data-theme="x"]\`，而 :host 的复合选择器写法浏览器不支持（实测
 *    Edge/Chromium 下 \`:host[attr]\` 与 \`:host[attr]\` 均不命中，只有
 *    \`:host([attr])\` 函数式写法命中），而该写法在独立页里又永不匹配。
 * ⚠️ --accent-rgb 必须是 "52, 255, 176" 这种逗号分隔：全文件都以
 *    rgba(var(--accent-rgb), 0.35) 形式消费，写成空格分隔会导致整条声明失效。
 * ------------------------------------------------------------------------- */
body {
  --accent: #34ffb0;
  --accent-rgb: 52, 255, 176;
}

/* ---------------------------------------------------------------------------
 * 2. 深色页面底
 * ----------------------------------------------------------------------------
 * ⚠️ 选择器必须是 body（不能写 html body），且三条声明必须带 !important。
 *   ① 不用 html body：站点内嵌时 tool-adapter.js 的 rebaseCss 逐个 token 把
 *      html/body 都换成 :host，\`html body\` 会变成后代选择器 \`:host :host\`，
 *      影子树里永不命中 —— 实测内嵌下整段失效，宿主背景退回 layout.css:504
 *      \`.tool-iframe-wrap{background:var(--card-bg)}\` 的白卡片。
 *   ② 为什么必须 !important（而不是继续提特异性）：
 *      - 同树场景：index.html 里本文件先、../../assets/css/tool-common.css 后
 *        加载，底座 72-87 行有同特异性的 body{background:…}；【同特异性时后
 *        加载者通吃】，只写 body 会被压掉（实测独立页会从 #0a0f1f 掉回 #eef2fa）。
 *      - 跨树场景：级联在 Shadow DOM 下先比「封装上下文」再比特异性，外部文档
 *        树的普通声明一律压过影子树内的普通声明。实测往影子树追加
 *        \`:host(.tool-root){background:#0a0f1f}\`（0,2,0,0，高于外层
 *        .tool-iframe-wrap 的 0,1,0,0）依然不生效，加 !important 才命中。
 *      故这里显式 !important，用途单一且明确：压过后加载底座的同特异性规则，
 *      不用于解决工具内部的选择器冲突。
 *   ③ 打印不能跟着变：底座打印段只重置 background（tool-common.css:1906
 *      \`body{background:#fff!important}\`），没有重置 color。上面三条 !important
 *      里只有 background 会被它压回来，color 会一路带进打印媒介，纸上变成
 *      「白底 + #e8eeff 浅色字」——紧随其后的「2.1 打印修正」负责收掉。
 * ------------------------------------------------------------------------- */
body {
  color: #e8eeff !important;
  background:
    radial-gradient(900px 480px at 85% -8%, rgba(var(--accent-rgb), 0.14), transparent 60%),
    radial-gradient(760px 420px at 8% 4%, rgba(80, 120, 255, 0.12), transparent 58%),
    #0a0f1f !important;
  background-attachment: fixed !important;
  transition: background 0.6s var(--ease);
}

/* ---------------------------------------------------------------------------
 * 2.1 打印修正
 * ----------------------------------------------------------------------------
 * 承接上一段：那份深色的 !important 会一路带进打印媒介。这里把纸面恢复成
 * 「白底 + 深字」。与底座打印段（tool-common.css:1906）同为 !important，
 * 分工不冲突：底座负责刷白背景，本段负责把文字色改回可读的深色。
 * ------------------------------------------------------------------------- */
@media print {
  body {
    color: #1f2733 !important;
    background: #fff !important;
    background-attachment: scroll !important;
  }
}

/* 两个屏幕的通用布局：整屏居中列 */
.screen {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 22px;
  width: 100%;
  max-width: 880px;
  min-height: 100vh;
  margin: 0 auto;
  padding: 48px 24px 64px;
  text-align: center;
}

/* ---------------------------------------------------------------------------
 * 3. 设置页
 * ------------------------------------------------------------------------- */
.setup-screen .title {
  font-size: clamp(24px, 3.4vw, 34px);
  font-weight: 800;
  color: #fff;
}

.setup-screen .subtitle {
  margin-top: -12px;
  font-size: 14px;
  letter-spacing: 1px;
  color: rgba(232, 238, 255, 0.55);
}

/* 大号分:秒输入 */
.big-input {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: clamp(10px, 2.4vw, 22px);
}

.big-input input {
  width: clamp(96px, 20vw, 150px);
  padding: 14px 10px;
  font-size: clamp(40px, 7vw, 66px);
  font-weight: 800;
  text-align: center;
  color: #fff;
  background: rgba(255, 255, 255, 0.06);
  border: 2px solid rgba(255, 255, 255, 0.14);
  border-radius: var(--r-lg);
  outline: none;
  font-variant-numeric: tabular-nums;
  transition: border-color var(--t-fast) var(--ease),
              box-shadow var(--t-fast) var(--ease),
              background var(--t-fast) var(--ease);
}
.big-input input:focus {
  background: rgba(255, 255, 255, 0.1);
  border-color: var(--accent);
  box-shadow: 0 0 0 4px rgba(var(--accent-rgb), 0.18),
              0 0 30px rgba(var(--accent-rgb), 0.25);
}

.big-input .colon {
  font-size: clamp(34px, 5vw, 52px);
  color: rgba(232, 238, 255, 0.4);
  padding: 0;
}

/* 分 / 秒 标注与输入框上下对齐 */
.setup-screen .field-hint {
  display: flex;
  justify-content: center;
  gap: clamp(10px, 2.4vw, 22px);
  margin: -12px 0 0;
}
.setup-screen .field-hint span {
  width: clamp(96px, 20vw, 150px);
  text-align: center;
  font-size: 13px;
  color: rgba(232, 238, 255, 0.45);
}

/* 微调行（底座 .adj-btn 为 32px 方格，此处改为带文字的胶囊） */
.adjust {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  gap: 10px;
}

.adjust .adj-btn {
  width: auto;
  height: auto;
  padding: 9px 18px;
  font-size: 13.5px;
  font-weight: 600;
  color: rgba(232, 238, 255, 0.82);
  background: rgba(255, 255, 255, 0.07);
  border: 1.5px solid rgba(255, 255, 255, 0.14);
  border-radius: var(--r-pill);
  cursor: pointer;
  transition: all var(--t-fast) var(--ease);
}
.adjust .adj-btn:hover {
  color: #07101f;
  background: var(--accent);
  border-color: transparent;
  box-shadow: 0 6px 18px rgba(var(--accent-rgb), 0.4);
}

.adj-current {
  min-width: 104px;
  padding: 0 6px;
  font-size: 14px;
  font-weight: 700;
  color: var(--accent);
  font-variant-numeric: tabular-nums;
}

/* 预设 chips：深色玻璃风（覆盖底座白底 chip） */
.setup-screen .chips {
  justify-content: center;
  max-width: 640px;
}
.setup-screen .chips .chip {
  color: rgba(232, 238, 255, 0.78);
  background: rgba(255, 255, 255, 0.06);
  border-color: rgba(255, 255, 255, 0.14);
}
.setup-screen .chips .chip:hover {
  color: var(--accent);
  border-color: rgba(var(--accent-rgb), 0.5);
  background: rgba(var(--accent-rgb), 0.1);
  transform: translateY(-1px);
}
.setup-screen .chips .chip.active {
  color: #07101f;
  background: var(--accent);
  border-color: transparent;
  box-shadow: 0 6px 18px rgba(var(--accent-rgb), 0.42);
}

/* 开始按钮（HTML 类名为 .start-btn） */
.start-btn {
  margin-top: 6px;
  padding: 16px 60px;
  font-size: 19px;
  font-weight: 800;
  letter-spacing: 2px;
  color: #07101f;
  background: var(--accent);
  border: none;
  border-radius: var(--r-pill);
  cursor: pointer;
  box-shadow: 0 12px 30px rgba(var(--accent-rgb), 0.42),
              inset 0 1px 0 rgba(255, 255, 255, 0.4);
  transition: transform var(--t-fast) var(--ease),
              filter var(--t-fast) var(--ease),
              box-shadow var(--t-fast) var(--ease);
}
.start-btn:hover {
  transform: translateY(-2px);
  filter: brightness(1.06);
  box-shadow: 0 16px 38px rgba(var(--accent-rgb), 0.55);
}
.start-btn:active {
  transform: translateY(0);
}

/* ---------------------------------------------------------------------------
 * 4. 倒计时大屏
 * ------------------------------------------------------------------------- */
.run-screen {
  gap: 26px;
  padding-bottom: 90px; /* 给底部进度条与按钮留呼吸空间 */
}

/* 霓虹大字（点击可暂停 / 继续） */
.time-text {
  font-size: clamp(96px, 20vw, 240px);
  font-weight: 800;
  line-height: 1.05;
  letter-spacing: -0.02em;
  font-variant-numeric: tabular-nums;
  color: var(--accent);
  text-shadow: 0 0 36px rgba(var(--accent-rgb), 0.55),
               0 0 90px rgba(var(--accent-rgb), 0.3);
  cursor: pointer;
  user-select: none;
  transition: color var(--t-fast) var(--ease),
              text-shadow var(--t-fast) var(--ease);
}
.time-text:hover {
  filter: brightness(1.1);
}

/* 最后 10 秒：红字 + 急促呼吸（JS 切换 .danger） */
.time-text.danger {
  color: #ff4d5e;
  text-shadow: 0 0 36px rgba(255, 77, 94, 0.6),
               0 0 90px rgba(255, 77, 94, 0.35);
  animation: ct-danger-pulse 1s var(--ease) infinite;
}

@keyframes ct-danger-pulse {
  0%, 100% { transform: scale(1); }
  50%      { transform: scale(1.04); }
}

/* 时间到文字 */
.finish-text {
  font-size: clamp(30px, 5vw, 54px);
  font-weight: 800;
  letter-spacing: 4px;
  color: #ff5d6e;
  text-shadow: 0 0 34px rgba(255, 93, 110, 0.55);
  animation: ct-blink 1s steps(1) infinite;
}

@keyframes ct-blink {
  0%, 49%  { opacity: 1; }
  50%, 100% { opacity: 0.25; }
}

.run-actions {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  gap: 14px;
}

/* 霓虹描边按钮（覆盖底座紫色 .neon-btn） */
.run-actions .neon-btn {
  min-width: 124px;
  padding: 12px 28px;
  font-size: 15px;
  color: var(--accent);
  background: rgba(var(--accent-rgb), 0.1);
  border: 1.5px solid rgba(var(--accent-rgb), 0.65);
  border-radius: var(--r-pill);
  box-shadow: 0 0 18px rgba(var(--accent-rgb), 0.18),
              inset 0 0 12px rgba(var(--accent-rgb), 0.08);
  transition: all var(--t-fast) var(--ease);
}
.run-actions .neon-btn:hover {
  color: #07101f;
  background: var(--accent);
  border-color: transparent;
  box-shadow: 0 8px 24px rgba(var(--accent-rgb), 0.5);
  transform: translateY(-1px);
}

/* 次级幽灵按钮 */
.run-actions .neon-btn.ghost {
  color: rgba(232, 238, 255, 0.82);
  background: rgba(255, 255, 255, 0.06);
  border-color: rgba(255, 255, 255, 0.18);
  box-shadow: none;
}
.run-actions .neon-btn.ghost:hover {
  color: #fff;
  background: rgba(255, 255, 255, 0.14);
  border-color: rgba(255, 255, 255, 0.4);
}

.run-hint {
  font-size: 13px;
  letter-spacing: 1px;
  color: rgba(232, 238, 255, 0.4);
}

/* ---------------------------------------------------------------------------
 * 5. 底部细线进度条（JS 用 transform:scaleX 驱动）
 * ------------------------------------------------------------------------- */
.progress-track {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 60;
  height: 6px;
  background: rgba(255, 255, 255, 0.08);
}

.progress-bar {
  width: 100%;
  height: 100%;
  background: var(--accent);
  box-shadow: 0 0 12px rgba(var(--accent-rgb), 0.7);
  transform-origin: left center;
  transition: transform 0.28s linear, background var(--t-fast) var(--ease);
}

.progress-bar.danger {
  background: #ff4d5e;
  box-shadow: 0 0 14px rgba(255, 77, 94, 0.8);
}

/* ---------------------------------------------------------------------------
 * 6. 全屏投影（⛶ 由共享模块对 #runScreen 自身调用 Fullscreen API）
 *    注：运行屏是舞台自身进入全屏，选择器必须是「舞台自身 :fullscreen」，
 *        旧的 \`:fullscreen .run-screen\`（祖先全屏）在此永不匹配。
 * ------------------------------------------------------------------------- */

/* 工具栏需要相对运行屏定位 */
#runScreen {
  position: relative;
}

/* 深色舞台内的角标按钮改为玻璃质感（覆盖公共白底 icon-btn） */
#runScreen .stage-toolbar {
  z-index: 5;
}
#runScreen .stage-toolbar .icon-btn {
  color: rgba(255, 255, 255, 0.9);
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.24);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
}
#runScreen .stage-toolbar .icon-btn:hover {
  color: #fff;
  background: rgba(255, 255, 255, 0.2);
  border-color: rgba(255, 255, 255, 0.42);
}

#runScreen:fullscreen,
#runScreen:-webkit-full-screen,
#runScreen.edutf-solo{
  min-height: 0;
  max-width: none;
  padding: 24px 24px 90px;
  background: #0a0f1f;
}

#runScreen:fullscreen .time-text,
#runScreen:-webkit-full-screen .time-text,
#runScreen.edutf-solo .time-text{
  font-size: clamp(140px, 24vw, 320px);
}

#runScreen:fullscreen .finish-text,
#runScreen:-webkit-full-screen .finish-text,
#runScreen.edutf-solo .finish-text{
  font-size: clamp(44px, 7vw, 84px);
}

/* ---------------------------------------------------------------------------
 * 7. 小屏适配 / 减弱动效
 * ------------------------------------------------------------------------- */
@media (max-width: 640px) {
  .screen { padding: 36px 16px 80px; gap: 18px; }
  .run-actions .neon-btn { min-width: 104px; padding: 11px 20px; }
}

@media (prefers-reduced-motion: reduce) {
  body,
  .big-input input,
  .adjust .adj-btn,
  .setup-screen .chips .chip,
  .start-btn,
  .time-text,
  .run-actions .neon-btn,
  .progress-bar {
    transition: none !important;
  }
  .time-text.danger,
  .finish-text {
    animation: none !important;
  }
}
`,
      "tools/countdown-timer/countdown-timer.js": `/**
 * 极简倒计时（深色霓虹大屏版）
 * ----------------------------------------------------------------
 * 功能清单：
 *   1. 分:秒自定义输入 + 10 档常用时长预设（1/3/5/10/15/30/45/60/90/120 分钟）
 *   2. ±1 分 / ±10 秒 微调按钮（运行中也可调整，自动同步剩余时间）
 *   3. 时间戳精准计时（不受 setInterval 抖动影响）
 *   4. 暂停 / 继续 / 重置 / 全屏（⛶ 由 assets/js/tool-stage-toolbar.js 统一接管）
 *   5. 最后 10 秒数字与进度条变红 + 每秒短促提示音（Web Audio API 合成，无音频文件）
 *   6. 倒计时结束三声长音 + “时间到”文字闪烁
 *   7. 标签页标题同步显示剩余时间，便于切到其它标签时查看
 *   8. 强调色跟随站点全局 🎨 配色（六色一一映射，本工具不再自带配色开关）
 *   9. localStorage 持久化最后设置（分 / 秒；配色改由站点全局控制）
 *  10. 键盘快捷键：空格暂停 / 继续、R 重置、Esc 退出全屏
 *
 * 兼容性：纯前端 IIFE，无 fetch / Worker / import，可双击 file:// 直接打开
 */
(function () {
  "use strict";

  /** 持久化键名常量 */
  var STORAGE_KEY = "countdown-timer:settings";

  /**
   * 按 id 获取元素
   * @param  {string} id - 元素的 id 属性
   * @return {HTMLElement|null} 找到的 DOM 元素，无匹配返回 null
   */
  function $(id) { return document.getElementById(id); }

  // —— DOM 引用 ——
  var setupScreen = $("setupScreen");
  var runScreen   = $("runScreen");
  var inputMin    = $("inputMin");
  var inputSec    = $("inputSec");
  var adjCurrent  = $("adjCurrent");
  var timeText    = $("timeText");
  var finishText  = $("finishText");
  var progressBar = $("progressBar");
  var btnPause    = $("btnPause");

  /** 计时状态变量 */
  var timerId = null;          // setInterval 句柄
  var audioCtx = null;         // WebAudio 上下文（延迟创建）
  var totalMs = 0;             // 总时长（毫秒）
  var remainingMs = 0;         // 暂停时保存的剩余毫秒
  var endAt = 0;               // 运行时的结束时间戳
  var running = false;         // 是否正在走时
  var finished = false;        // 是否已结束
  var lastBeepSecond = -1;     // 上次已响提示音的整秒，防止重复发声

  // —— 站点全局配色 → 本工具霓虹强调色 ——
  /* 设计说明（2026 整改）：本工具不再自带配色开关（原 6 个主题圆点已移除），
     强调色改为跟随站点顶栏 🎨（localStorage 键 et-accent）。
       · 用户从未选过配色（键不存在）→ 不写内联变量，CSS 兜底的霓虹绿生效，
         与改造前默认完全一致，视觉不跳变；
       · 用户选过配色 → 按下面的调色板映射后写到工具根容器。
     为什么映射表放在 JS 而不是 CSS：站点内嵌时 rebaseCss 会把
     body[data-theme="x"] 重基成 :host[data-theme="x"]，而 :host 的复合选择器
     写法浏览器不支持（实测只有 :host([data-theme="x"]) 函数式写法命中），
     独立页里又永不匹配 —— 两边无法两全，故由 JS 读配色名后写自定义属性。
     写在哪里：document.body 在站点内嵌模式下就是影子树内层容器 .tool-page，
     在独立页模式下就是 <body>，两种模式都只落在工具自己的根容器上；
     只写 --accent / --accent-rgb 两个工具私有变量，绝不碰站点 --primary，
     也不再往任何元素上写 data-theme。 */
  var ACCENT_PALETTE = {
    sky:    { hex: "#38bdf8", rgb: "56, 189, 248" },
    violet: { hex: "#a78bfa", rgb: "167, 139, 250" },
    green:  { hex: "#34ffb0", rgb: "52, 255, 176" },
    gold:   { hex: "#fbbf24", rgb: "251, 191, 36" },
    orange: { hex: "#fb923c", rgb: "251, 146, 60" },
    pink:   { hex: "#f472b6", rgb: "244, 114, 182" }
  };

  /**
   * 读取站点全局配色名；用户从未选过（键缺失 / 非法）时返回空串
   * @return {string} 合法配色名或 ""
   */
  function readSiteAccent() {
    var raw = null;
    try { raw = localStorage.getItem("et-accent"); } catch (e) { raw = null; }
    // 用 hasOwnProperty 兜住 raw 为 "constructor" / "__proto__" 之类的脏值
    if (raw && Object.prototype.hasOwnProperty.call(ACCENT_PALETTE, raw)) return raw;
    return "";
  }

  /**
   * 把站点配色映射到本工具强调色，写到工具根容器的内联自定义属性
   * @return {void}
   */
  function applyAccent() {
    var root = document.body;
    if (!root || !root.style) return;
    var pal = ACCENT_PALETTE[readSiteAccent()];
    if (pal) {
      root.style.setProperty("--accent", pal.hex);
      root.style.setProperty("--accent-rgb", pal.rgb);
    } else {
      // 未选过配色：清掉内联值，交回 CSS 的霓虹绿兜底
      root.style.removeProperty("--accent");
      root.style.removeProperty("--accent-rgb");
    }
  }

  /**
   * 监听站点配色变化
   * 内嵌模式下站点切换 🎨 时会把配色名同步到根容器的 data-theme，
   * 因此观察该属性即可实时跟随（站点派发的 et:accent 事件不进影子树）。
   * @return {void}
   */
  function watchAccent() {
    if (typeof MutationObserver !== "function" || !document.body) return;
    try {
      new MutationObserver(applyAccent).observe(document.body, {
        attributes: true,
        attributeFilter: ["data-theme"]
      });
    } catch (e) { /* 老浏览器忽略：退化为重新进入工具时生效 */ }
  }

  /**
   * 把毫秒格式化为 MM:SS（向上取整，最后一秒显示 00:01）
   * @param  {number} ms - 剩余毫秒
   * @return {string}    形如 "05:00" 的字符串
   */
  function format(ms) {
    var totalSec = Math.max(0, Math.ceil(ms / 1000));
    var m = Math.floor(totalSec / 60);
    var s = totalSec % 60;
    return String(m).padStart(2, "0") + ":" + String(s).padStart(2, "0");
  }

  /**
   * 把当前分:秒输入框的值格式化为 "N 分" / "N 分 S 秒" 文本
   * @return {string} 例如 "5 分" 或 "5 分 30 秒"
   */
  function currentAdjustLabel() {
    var m = parseInt(inputMin.value, 10) || 0;
    var s = parseInt(inputSec.value, 10) || 0;
    if (s > 0) return m + " 分 " + s + " 秒";
    return m + " 分";
  }

  /**
   * 同步微调区显示的当前时长文字
   * @return {void}
   */
  function refreshAdjustLabel() {
    if (adjCurrent) adjCurrent.textContent = currentAdjustLabel();
  }

  /**
   * 惰性创建音频上下文（必须在用户手势后调用，否则浏览器会阻止）
   * @return {AudioContext|null} 浏览器不支持时返回 null
   */
  function ensureAudio() {
    if (!audioCtx) {
      var AC = window.AudioContext || window.webkitAudioContext;
      if (AC) audioCtx = new AC();
    }
    if (audioCtx && audioCtx.state === "suspended") audioCtx.resume();
    return audioCtx;
  }

  /**
   * 合成一个提示音（无音频文件依赖，纯 Web Audio 振荡器）
   * @param {number} freq     - 频率（Hz）
   * @param {number} duration - 时长（秒）
   * @param {number} [delay=0]- 相对当前的延后（秒）
   * @param {string} [type="sine"] - 波形 sine/square/sawtooth/triangle
   * @return {void}
   */
  function tone(freq, duration, delay, type) {
    var ac = audioCtx;
    if (!ac) return;
    var t0 = ac.currentTime + (delay || 0);
    var osc = ac.createOscillator();
    var gain = ac.createGain();
    osc.type = type || "sine";
    osc.frequency.setValueAtTime(freq, t0);
    gain.gain.setValueAtTime(0.0001, t0);
    gain.gain.exponentialRampToValueAtTime(0.35, t0 + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, t0 + duration);
    osc.connect(gain).connect(ac.destination);
    osc.start(t0);
    osc.stop(t0 + duration + 0.05);
  }

  /** 短促“滴”声（最后 10 秒每秒一次） */
  function shortBeep() { tone(1000, 0.12, 0, "square"); }

  /** 结束三长音提示 */
  function finishChime() {
    tone(760, 0.55, 0,    "sine");
    tone(760, 0.55, 0.75, "sine");
    tone(960, 0.8,  1.5,  "sine");
  }

  /**
   * 刷新一次显示（数字、进度条、标题、警示状态与提示音）
   * @return {void}
   */
  function tick() {
    remainingMs = Math.max(0, endAt - Date.now());
    var text = format(remainingMs);
    timeText.textContent = text;
    document.title = text + " - 极简倒计时";
    progressBar.style.transform = "scaleX(" + (totalMs > 0 ? remainingMs / totalMs : 0) + ")";

    var leftSec = Math.ceil(remainingMs / 1000);
    var danger = leftSec <= 10 && leftSec > 0;
    timeText.classList.toggle("danger", danger);
    progressBar.classList.toggle("danger", danger);

    // 进入新的整秒且处于最后 10 秒：响一声
    if (danger && running && leftSec !== lastBeepSecond) {
      lastBeepSecond = leftSec;
      shortBeep();
    }

    if (remainingMs <= 0) finish();
  }

  /**
   * 启动走时循环（250ms 轮询时间戳，非死循环，可随时清除）
   * @return {void}
   */
  function startLoop() {
    stopLoop();
    endAt = Date.now() + remainingMs;
    running = true;
    timerId = setInterval(tick, 250);
    tick();
  }

  /** 清除走时循环 */
  function stopLoop() {
    if (timerId !== null) {
      clearInterval(timerId);
      timerId = null;
    }
  }

  /**
   * 从设置页开始倒计时
   * @return {void}
   */
  function start() {
    var m = parseInt(inputMin.value, 10);
    var s = parseInt(inputSec.value, 10);
    if (Number.isNaN(m)) m = 0;
    if (Number.isNaN(s)) s = 0;
    m = Math.min(999, Math.max(0, m));
    s = Math.min(59, Math.max(0, s));
    var ms = (m * 60 + s) * 1000;
    if (ms <= 0) {
      inputMin.focus();
      flashEmpty();
      return;
    }
    ensureAudio();
    totalMs = ms;
    remainingMs = ms;
    finished = false;
    lastBeepSecond = -1;
    finishText.classList.add("hidden");
    timeText.classList.remove("danger");
    progressBar.classList.remove("danger");
    timeText.textContent = format(ms);
    btnPause.textContent = "⏸ 暂停";
    setupScreen.classList.add("hidden");
    runScreen.classList.remove("hidden");
    saveSettings();
    startLoop();
  }

  /** 时长为 0 时输入框短暂闪红提示 */
  function flashEmpty() {
    inputMin.style.borderColor = "#ff4d5e";
    inputSec.style.borderColor = "#ff4d5e";
    setTimeout(function () {
      inputMin.style.borderColor = "";
      inputSec.style.borderColor = "";
    }, 700);
  }

  /**
   * 暂停 / 继续切换（运行中暂停，暂停后继续）
   * @return {void}
   */
  function togglePause() {
    if (finished) return;
    ensureAudio();
    if (running) {
      stopLoop();
      running = false;
      btnPause.textContent = "▶ 继续";
    } else {
      startLoop();
      btnPause.textContent = "⏸ 暂停";
    }
  }

  /**
   * 时间到：停止计时、三声长音、显示“时间到”
   * @return {void}
   */
  function finish() {
    stopLoop();
    running = false;
    finished = true;
    remainingMs = 0;
    timeText.textContent = "00:00";
    timeText.classList.remove("danger");
    finishText.classList.remove("hidden");
    btnPause.textContent = "⏸ 暂停";
    document.title = "时间到 - 极简倒计时";
    progressBar.style.transform = "scaleX(0)";
    finishChime();
  }

  /**
   * 重置回设置页并清理计时资源
   * @return {void}
   */
  function reset() {
    stopLoop();
    running = false;
    finished = false;
    lastBeepSecond = -1;
    runScreen.classList.add("hidden");
    setupScreen.classList.remove("hidden");
    finishText.classList.add("hidden");
    timeText.classList.remove("danger");
    progressBar.classList.remove("danger");
    progressBar.style.transform = "scaleX(1)";
    document.title = "极简倒计时";
    refreshAdjustLabel();
    syncChipsActive();
  }

  /**
   * 在当前分:秒基础上微调时长（毫秒增量，可为负）
   * 运行中调用会同步调整 endAt 与 remainingMs；设置页调用会改输入框值
   * @param {number} deltaMs - 时长增量（毫秒），正负均可
   * @return {void}
   */
  function adjustTime(deltaMs) {
    if (running) {
      // 运行中：直接调整 endAt（保持正在走时）
      var newRemain = remainingMs + deltaMs;
      if (newRemain <= 0) newRemain = 1000; // 至少保留 1 秒避免立刻结束
      remainingMs = newRemain;
      totalMs = Math.max(totalMs, newRemain);
      endAt = Date.now() + remainingMs;
      tick();
    } else if (finished) {
      // 已结束状态：忽略微调，等用户重置后再用
    } else {
      // 设置页：直接改输入框
      var totalOld = (parseInt(inputMin.value, 10) || 0) * 60000 +
                     (parseInt(inputSec.value, 10) || 0) * 1000;
      var totalNew = Math.max(0, totalOld + deltaMs);
      var totalMin = Math.floor(totalNew / 60000);
      var totalSec = Math.floor((totalNew % 60000) / 1000);
      inputMin.value = String(Math.min(999, totalMin));
      inputSec.value = String(Math.min(59, totalSec));
      refreshAdjustLabel();
      syncChipsActive();
      saveSettings();
    }
  }

  /**
   * 同步 chips 的高亮状态：当前分:秒 等于某预设时高亮对应按钮
   * @return {void}
   */
  function syncChipsActive() {
    var m = parseInt(inputMin.value, 10);
    var s = parseInt(inputSec.value, 10);
    document.querySelectorAll(".chip").forEach(function (c) {
      var cm = Number(c.dataset.min);
      if (cm === m && s === 0) c.classList.add("active");
      else c.classList.remove("active");
    });
  }

  /**
   * 持久化当前设置到 localStorage（分 / 秒）
   * 异常场景：隐私模式或 storage 被禁用时 try/catch 静默忽略
   * @return {void}
   */
  function saveSettings() {
    try {
      var data = {
        min: parseInt(inputMin.value, 10) || 0,
        sec: parseInt(inputSec.value, 10) || 0
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) { /* localStorage 不可用时静默忽略 */ }
  }

  /**
   * 从 localStorage 读取并应用上次设置
   * 异常场景：JSON 解析失败或无存储时使用默认值（5 分 0 秒）
   *
   * 悬空 key 说明：历史版本会把 theme（主题色）一起持久化；配色改由站点全局 🎨
   * 控制后该字段作废。这里刻意不读它 —— 旧数据里的 theme 是悬空 key，
   * 忽略即可，min / sec 的恢复不受影响，也不再需要任何默认值兜底。
   * @return {void}
   */
  function loadSettings() {
    var min = 5, sec = 0;
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        var data = JSON.parse(raw);
        if (typeof data.min === "number") min = Math.min(999, Math.max(0, data.min));
        if (typeof data.sec === "number") sec = Math.min(59, Math.max(0, data.sec));
      }
    } catch (e) { /* 解析失败使用默认值 */ }
    inputMin.value = String(min);
    inputSec.value = String(sec);
    refreshAdjustLabel();
    syncChipsActive();
  }

  // —— 事件绑定 ——
  $("btnStart").addEventListener("click", start);
  btnPause.addEventListener("click", togglePause);
  $("btnReset").addEventListener("click", reset);
  timeText.addEventListener("click", togglePause); // 点击大数字 = 暂停 / 继续

  // 预设 chips：点击填入分:秒并高亮
  document.querySelectorAll(".chip").forEach(function (chip) {
    chip.addEventListener("click", function () {
      var mins = Number(chip.dataset.min);
      inputMin.value = String(mins);
      inputSec.value = "0";
      syncChipsActive();
      refreshAdjustLabel();
      inputMin.focus();
      saveSettings();
    });
  });

  // 时间微调按钮：±1 分 / ±10 秒
  document.querySelectorAll(".adj-btn").forEach(function (btn) {
    btn.addEventListener("click", function () {
      ensureAudio();
      adjustTime(Number(btn.dataset.delta));
    });
  });

  // 输入框内容变化：取消预设高亮；秒超 59 自动进位到分
  [inputMin, inputSec].forEach(function (inp) {
    inp.addEventListener("input", function () {
      var sv = parseInt(inputSec.value, 10);
      if (!Number.isNaN(sv) && sv >= 60) {
        var mv = parseInt(inputMin.value, 10);
        if (Number.isNaN(mv)) mv = 0;
        inputMin.value = String(mv + Math.floor(sv / 60));
        inputSec.value = String(sv % 60);
      }
      syncChipsActive();
      refreshAdjustLabel();
    });
    inp.addEventListener("blur", saveSettings);
  });

  // 键盘快捷键：空格 = 暂停 / 继续；R = 重置；Esc = 退出全屏（浏览器自带）
  document.addEventListener("keydown", function (e) {
    if (runScreen.classList.contains("hidden")) return;
    if (e.code === "Space" && e.target.tagName !== "INPUT") {
      e.preventDefault();
      togglePause();
    } else if (e.key === "r" || e.key === "R") {
      if (e.target.tagName !== "INPUT") reset();
    }
  });

  // 页面卸载时清理计时器与音频，杜绝残留
  window.addEventListener("pagehide", function () {
    stopLoop();
    if (audioCtx) {
      try { audioCtx.close(); } catch (e) { /* 忽略 */ }
      audioCtx = null;
    }
  });

  // —— 初始化：恢复上次设置 + 同步站点配色 ——
  loadSettings();
  applyAccent();
  watchAccent();

  /* 舞台右上角工具栏（⛶ 全屏）：全屏目标是 #runScreen 自身；
     本工具是「设置屏 / 运行屏」两屏结构，没有可隐藏的侧边设置栏，故 panelHost 传 null。 */
  if (window.EduToolStageToolbar) {
    window.EduToolStageToolbar.init({ stage: "#runScreen", panelHost: null });
  }
})();
`
    },
    meta: {builtAt: "2026-09-28 11:07:05", sources: {"tools/countdown-timer/countdown-timer.css": "61edd948f0b5", "assets/css/tool-common.css": "d35dcf222690", "assets/js/frame-bridge.js": "1131903c1e46", "assets/js/tool-stage-toolbar.js": "30f2ddfe48d2", "tools/countdown-timer/countdown-timer.js": "3e903f116436"}}
  };
})();