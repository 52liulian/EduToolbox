/* 自动生成，请勿手改 —— 源：tools/random-question/  ·  构建：2026-09-28 11:07:05 */
/* 用途：file:// 离线场景下 fetch 被 CORS 拦截，站点改用 <script src> 加载本文件，
   拿到工具页面与本地 CSS/JS 文本后走与 http 相同的 Shadow DOM 组件化挂载。
   工具源码改动后请重跑：python .workbuddy/scripts/build_tool_bundles.py */
(function(){
  var g = window.EduToolboxToolBundles || (window.EduToolboxToolBundles = {});
  g["random-question"] = {
    html: `<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>随机抽题 | EduToolbox · 滚动抽题工具<\/title>
<meta name="description" content="输入题目列表，一键随机抽题，支持题目|答案格式、滚动动画、抽中移除、空格/PageDown 控制、抽题记录导出。适合课堂提问、知识竞赛、考试复习。本地处理，隐私安全，离线可用。">
<link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ctext y='.9em' font-size='90'%3E%F0%9F%8E%93%3C/text%3E%3C/svg%3E">
<link rel="stylesheet" href="random-question.css">
<link rel="stylesheet" href="../../assets/css/tool-common.css">
<\/head>
<body>
<div id="app">
  <!-- 顶栏 -->

  <main class="main">
    <!-- 左侧：设置面板 -->
    <section class="setup-panel" id="setupPanel">
      <!-- 题目设置 -->
      <div class="block">
        <h2 class="block-title">📋 题目列表<\/h2>
        <p class="block-hint">每行一题，支持"题目|答案"格式<\/p>
        <textarea id="qList" placeholder="题目1&#10;题目2|答案2&#10;...">什么是光合作用？|植物利用光能将二氧化碳和水转化为有机物并释放氧气
牛顿第一定律的内容是什么？|物体在不受外力时保持静止或匀速直线运动
请背诵《静夜思》。
勾股定理的公式是什么？|a² + b² = c²
水的化学式是什么？|H₂O
中国四大发明是哪些？|造纸术、印刷术、火药、指南针
英语中元音字母有哪些？|a, e, i, o, u
地球自转的方向是？|自西向东
人体最大的器官是什么？|皮肤
圆周率的前5位小数是多少？|3.14159<\/textarea>
        <div class="count-bar">
          共 <span id="count">10<\/span> 题
          <button class="btn-mini" id="dedupBtn" title="去除重复题目">去重<\/button>
          <button class="btn-mini" id="clearBtn" title="清空题库">清空<\/button>
        <\/div>
        <div class="button-group">
          <button class="btn-mini" id="importBtn">📥 导入<\/button>
          <input type="file" id="fileInput" accept=".txt,.csv" hidden>
          <button class="btn-mini" id="exportBtn">📤 导出<\/button>
          <button class="btn-mini" id="resetBtn" title="恢复内置示例题库">↺ 默认<\/button>
        <\/div>
      <\/div>

      <!-- 抽题设置 -->
      <div class="block">
        <h2 class="block-title">⚙️ 抽题设置<\/h2>
        <label class="check-line">
          <input type="checkbox" id="removeAfter" checked>
          <span>抽中后从题库移除<\/span>
        <\/label>
        <div class="slider-line">
          <label for="speed">滚动速度<\/label>
          <input type="range" id="speed" min="30" max="300" value="50" step="10">
          <span class="val" id="speedVal">50<\/span>ms
        <\/div>
      <\/div>

      <!-- 抽题记录 -->
      <div class="block">
        <h2 class="block-title">
          🏆 抽题记录 (<span id="recordCount">0<\/span>)
        <\/h2>
        <ul id="recordList" class="record-list">
          <li class="state state--list-item state--empty"><div class="state-icon">🎲<\/div><div class="state-title">暂无记录<\/div><\/li>
        <\/ul>
        <div class="button-group">
          <button class="btn-mini" id="copyRecord">📋 复制<\/button>
          <button class="btn-mini" id="clearRecord">🗑 清空<\/button>
        <\/div>
      <\/div>
    <\/section>

    <!-- 右侧：抽题舞台 -->
    <section class="stage" id="stage">
      <!-- 工具栏 -->
      <div class="stage-toolbar">
        <button class="icon-btn" id="fullscreenBtn" title="全屏">⛶<\/button>
        <button class="icon-btn" id="hideSetupBtn" title="隐藏设置">⚙<\/button>
      <\/div>

      <!-- 流体背景 -->
      <canvas id="bgCanvas" class="bg-canvas"><\/canvas>

      <!-- 中央展示 -->
      <div class="display">
        <div class="q-index" id="qIndex">第 ? 题<\/div>
        <div class="q-display" id="qDisplay">等待抽取...<\/div>
        <div class="answer-area" id="answerArea">
          <button class="btn-reveal" id="revealBtn">👁 揭晓答案<\/button>
          <div class="q-answer" id="qAnswer"><\/div>
        <\/div>
        <div class="display-hint" id="displayHint">点击下方按钮或按 Space / PageDown 开始<\/div>
        <button class="btn-start" id="startBtn">开始抽题<\/button>
        <p class="key-hint">按 <kbd>Space<\/kbd> 或 <kbd>PageDown<\/kbd> 开始/停止<\/p>
      <\/div>
    <\/section>
  <\/main>
<\/div>

<script src="../../assets/js/frame-bridge.js"><\/script>
<script src="../../assets/js/tool-stage-toolbar.js"><\/script>
<script src="random-question.js"><\/script>
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
      "tools/random-question/random-question.css": `/* ============================================================================
 * 随机抽题 · random-question.css
 * 仅包含本工具特有样式：紫色知识舞台内景 / 流体 Canvas 层 / 题号胶囊 /
 *                       题目滚动与定格 / 答案揭晓卡片 / stage 全屏投影
 * 公共底座（双栏布局、面板、按钮、记录列表）见 tool-common.css
 * 高度策略：舞台 min-height 撑开、内容自然增高，仅 body 主滚动条；深色仅限
 *           舞台卡片内部与全屏模式，整页 body 保持浅色；仅全屏时铺满视口
 * ========================================================================== */

/* ---------------------------------------------------------------------------
 * 一、双栏布局：窄屏回落 & 「隐藏设置」单栏态
 * ------------------------------------------------------------------------- */
@media (max-width: 900px) {
  #app .main { grid-template-columns: 1fr; }
}

#app .main.setup-hidden {
  grid-template-columns: 1fr;
}
.main.setup-hidden .setup-panel {
  display: none;
}

/* 速度滑杆数值 */
.slider-line .val {
  min-width: 48px;
  text-align: right;
  font-size: 13.5px;
  font-weight: 700;
  font-variant-numeric: tabular-nums;
  color: var(--primary);
}

/* ---------------------------------------------------------------------------
 * 二、抽题舞台：白色卡片包裹一块紫色深色沉浸内景（body 不变黑）
 * ------------------------------------------------------------------------- */
#stage {
  min-height: 580px;
  padding: 0;
  overflow: hidden; /* 仅把流体背景裁切在圆角内，不产生滚动条 */
  background:
    radial-gradient(1100px 560px at 50% -10%, rgba(167, 139, 250, 0.28), transparent 62%),
    linear-gradient(160deg, #2a2160 0%, #1c1648 48%, #0e0a2a 100%);
}

/* 流体光球画布：铺满整个舞台，由 JS 按 offsetWidth/Height 取尺寸 */
.bg-canvas {
  position: absolute;
  inset: 0;
  z-index: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

/* 暗角聚光，让中央题目更突出 */
#stage::after {
  content: "";
  position: absolute;
  inset: 0;
  z-index: 1;
  pointer-events: none;
  background:
    radial-gradient(ellipse at center, transparent 42%, rgba(8, 5, 24, 0.52) 100%);
}

/* 深色舞台内的角标按钮改为玻璃质感（覆盖公共白底 icon-btn） */
#stage .stage-toolbar { z-index: 5; }
#stage .stage-toolbar .icon-btn {
  color: rgba(255, 255, 255, 0.9);
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.24);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
}
#stage .stage-toolbar .icon-btn:hover {
  color: #fff;
  background: rgba(255, 255, 255, 0.2);
  border-color: rgba(255, 255, 255, 0.42);
}

/* ---------------------------------------------------------------------------
 * 三、中央展示区（浮于流体层之上）
 * ------------------------------------------------------------------------- */
#stage .display {
  position: relative;
  z-index: 2;
  justify-content: center;
  gap: 16px;
  min-height: 580px;
  padding: 72px 24px 56px;
}

/* 题号胶囊（覆盖公共 .q-index 的纯蓝文字样式） */
#qIndex {
  padding: 6px 22px;
  font-size: 14px;
  font-weight: 700;
  letter-spacing: 2px;
  color: #ddd3ff;
  background: rgba(196, 181, 253, 0.14);
  border: 1px solid rgba(196, 181, 253, 0.42);
  border-radius: var(--r-pill);
}

/* 题目大字（覆盖公共 .q-display 的深色文字） */
#qDisplay {
  max-width: 100%;
  padding: 0 10px;
  font-size: clamp(26px, 4vw, 48px);
  font-weight: 900;
  line-height: 1.45;
  color: rgba(255, 255, 255, 0.95);
  text-shadow: 0 0 30px rgba(167, 139, 250, 0.4);
}

/* 滚动态：快速换题 + 轻微抖动与紫色辉光 */
#qDisplay.rolling {
  color: #fff;
  text-shadow:
    0 0 18px rgba(196, 181, 253, 0.9),
    0 0 52px rgba(167, 139, 250, 0.55);
  animation: rq-rolling 0.14s linear infinite;
}

@keyframes rq-rolling {
  0%   { transform: translateY(-3%) scale(0.99); opacity: 0.82; }
  50%  { transform: translateY(3%) scale(1.01);  opacity: 1; }
  100% { transform: translateY(-3%) scale(0.99); opacity: 0.82; }
}

/* 定格态：紫白渐变大字 + 弹出动效 */
#qDisplay.winner {
  background: linear-gradient(180deg, #ffffff 0%, #ddd3ff 55%, #b39bff 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  text-shadow: none;
  filter: drop-shadow(0 0 26px rgba(167, 139, 250, 0.55));
  animation: rq-pop 0.55s var(--ease);
}

@keyframes rq-pop {
  0%   { transform: scale(0.7); opacity: 0; }
  60%  { transform: scale(1.06); opacity: 1; }
  100% { transform: scale(1); }
}

/* ---------------------------------------------------------------------------
 * 四、答案揭晓区（未抽中前整块隐藏；揭晓按钮 + 答案卡片）
 * ------------------------------------------------------------------------- */
.answer-area {
  display: none; /* 覆盖公共 answer-area 的常显，仅 .show 时出现 */
  width: 100%;
  max-width: 720px;
  text-align: center;
}
.answer-area.show {
  display: block;
  animation: rq-fade-up 0.35s var(--ease);
}

@keyframes rq-fade-up {
  from { opacity: 0; transform: translateY(10px); }
  to   { opacity: 1; transform: translateY(0); }
}

/* 揭晓按钮：深色舞台上的紫色玻璃描边按钮（公共底座未定义 .btn-reveal） */
.btn-reveal {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 9px 24px;
  font-size: 14px;
  font-weight: 700;
  color: #e6ddff;
  background: rgba(167, 139, 250, 0.16);
  border: 1.5px solid rgba(196, 181, 253, 0.5);
  border-radius: var(--r-pill);
  cursor: pointer;
  transition: all var(--t-fast) var(--ease);
}
.btn-reveal:hover {
  color: #fff;
  background: rgba(167, 139, 250, 0.32);
  border-color: rgba(224, 214, 255, 0.8);
  transform: translateY(-1px);
}

/* 答案内容卡片：揭晓后淡入 */
.q-answer {
  margin-top: 14px;
  padding: 14px 22px;
  font-size: clamp(15px, 2vw, 19px);
  font-weight: 600;
  line-height: 1.75;
  color: #f4efff;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: var(--r);
  animation: rq-fade-up 0.35s var(--ease);
}
.q-answer:empty { display: none; }

/* ---------------------------------------------------------------------------
 * 五、提示行 / 按键 / 开始按钮（深色背景反色）
 * ------------------------------------------------------------------------- */
#displayHint {
  color: rgba(255, 255, 255, 0.66);
  font-size: 15px;
}
#stage .key-hint { color: rgba(255, 255, 255, 0.42); }
#stage .key-hint kbd {
  color: rgba(255, 255, 255, 0.88);
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.24);
}

/* 停止态按钮：主色蓝 → 警示红 */
#startBtn.rolling {
  background: linear-gradient(135deg, #ff7a7a, #ef4444);
  box-shadow: 0 10px 26px rgba(239, 68, 68, 0.45);
}

/* ---------------------------------------------------------------------------
 * 六、抽题记录列表项（.r-num / .r-name / em / .r-time 由 JS 生成）
 * ------------------------------------------------------------------------- */
.record-list li {
  align-items: flex-start;
  justify-content: space-between;
}
.record-list .r-name {
  display: flex;
  align-items: flex-start;
  gap: 9px;
  flex: 1;
  min-width: 0;
  font-size: 13px;
  line-height: 1.6;
  color: var(--text-1);
  word-break: break-all;
}
.record-list .r-name .r-num {
  display: inline-grid;
  place-items: center;
  width: 22px;
  height: 22px;
  margin-top: 1px;
  flex-shrink: 0;
  font-size: 12px;
  font-weight: 700;
  color: var(--primary);
  background: var(--primary-soft);
  border-radius: 50%;
}
.record-list .r-name em {
  font-style: normal;
  color: var(--text-3);
}
.r-time {
  flex-shrink: 0;
  margin-left: 10px;
  margin-top: 3px;
  font-size: 12px;
  font-variant-numeric: tabular-nums;
  color: var(--text-3);
}

/* ---------------------------------------------------------------------------
 * 七、全屏投影（全屏元素是 stage 本身；流体画布与题目铺满视口）
 * ------------------------------------------------------------------------- */
#stage:fullscreen,
#stage:-webkit-full-screen,
#stage.edutf-solo{
  width: 100%;
  height: 100%;
  min-height: 100vh;
  border: none;
  border-radius: 0;
}

#stage:fullscreen .display,
#stage:-webkit-full-screen .display,
#stage.edutf-solo .display{
  min-height: 100vh;
  padding: 40px 32px;
}

#stage:fullscreen #qDisplay,
#stage:-webkit-full-screen #qDisplay,
#stage.edutf-solo #qDisplay{
  font-size: clamp(34px, 5.4vw, 68px);
  max-width: 1100px;
}
#stage:fullscreen .q-answer,
#stage:-webkit-full-screen .q-answer,
#stage.edutf-solo .q-answer{
  max-width: 900px;
  margin-left: auto;
  margin-right: auto;
}

/* ---------------------------------------------------------------------------
 * 八、小屏微调
 * ------------------------------------------------------------------------- */
@media (max-width: 640px) {
  #stage,
  #stage .display { min-height: 480px; }
  #stage .display { padding: 64px 14px 40px; gap: 12px; }
  #startBtn { padding: 14px 40px; font-size: 18px; }
}
`,
      "tools/random-question/random-question.js": `/* EduToolbox · 随机抽题工具核心逻辑
 * -----------------------------------------------------------------------------
 * 功能：
 *   1. 题目管理：输入/导入/导出/去重/清空/恢复默认，实时题数统计，支持"题目|答案"格式
 *   2. 抽题设置：抽中后移除、滚动速度（30-300ms）
 *   3. 滚动抽题：点击或按 Space/PageDown 开始滚动题目，再次按下定格
 *   4. 序号显示：抽取过程与结果页实时显示题目序号，方便对应题号
 *   5. 答案揭晓：抽中后一键揭晓/隐藏答案
 *   6. 流体背景：Canvas 绘制流动光球，营造沉浸式深色氛围
 *   7. 抽题记录：自动保存到 localStorage，支持复制导出与清空
 *   8. 题目持久化：题目列表自动保存到 localStorage，刷新不丢失
 *   9. 全屏模式：调用 Fullscreen API，投影/大屏场景下隐藏设置面板
 *
 * 架构：纯前端 IIFE 模块，无后端依赖，无外部库，支持 file:// 协议离线打开
 */

(function () {
  "use strict";

  /** 简易选择器：按 CSS 选择器取首个匹配元素 */
  const $ = (s) => document.querySelector(s);

  /* ========== 内置默认题库 ==========
   * 用户首次访问或点击"恢复默认"时使用，包含答案示例
   */
  const DEFAULT_QUESTIONS = \`什么是光合作用？|植物利用光能将二氧化碳和水转化为有机物并释放氧气
牛顿第一定律的内容是什么？|物体在不受外力时保持静止或匀速直线运动
请背诵《静夜思》。
勾股定理的公式是什么？|a² + b² = c²
水的化学式是什么？|H₂O
中国四大发明是哪些？|造纸术、印刷术、火药、指南针
英语中元音字母有哪些？|a, e, i, o, u
地球自转的方向是？|自西向东
人体最大的器官是什么？|皮肤
圆周率的前5位小数是多少？|3.14159\`;

  /* ========== 运行时状态 ==========
   * rolling：是否正在滚动
   * pool：当前可抽取题目池（受"抽中后移除"影响动态变化）
   * records：抽题记录数组 [{q, a, num, time}]
   * current：当前抽中的题目对象
   * answerRevealed：当前题目答案是否处于揭晓状态
   */
  const state = {
    rolling: false,
    pool: [],
    records: [],
    timer: null,
    speed: 50,
    removeAfter: true,
    current: null,
    answerRevealed: false,
  };

  /* ========== localStorage 键名 ========== */
  const STORAGE_KEY_LIST = "random-question-list";
  const STORAGE_KEY_RECORDS = "random-question-records";

  /* ========== 题目列表持久化 ==========
   * 从 localStorage 恢复题库；不可用时回退到默认题库
   */
  function loadList() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY_LIST);
      $("#qList").value = raw || DEFAULT_QUESTIONS;
    } catch (e) {
      $("#qList").value = DEFAULT_QUESTIONS;
    }
  }
  /** 保存题目列表到 localStorage；file:// 协议下可能不可用，异常忽略 */
  function saveList() {
    try { localStorage.setItem(STORAGE_KEY_LIST, $("#qList").value); }
    catch (e) { /* file:// 协议下可能不可用，忽略 */ }
  }

  /* ========== 抽题记录持久化 ========== */
  function loadRecords() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY_RECORDS);
      state.records = raw ? JSON.parse(raw) : [];
    } catch (e) { state.records = []; }
  }
  function saveRecords() {
    try { localStorage.setItem(STORAGE_KEY_RECORDS, JSON.stringify(state.records)); }
    catch (e) { /* 忽略 */ }
  }

  /* ========== 解析题目 ==========
   * 从 textarea 读取，按换行分割，去除空行与首尾空格
   * 支持 "题目|答案" 格式，| 之后内容作为答案
   * @returns {Array<{q:string, a:string, num:number}>} 题目对象数组
   */
  function parseQuestions() {
    const raw = $("#qList").value;
    return raw.split(/\\r?\\n/)
      .map(s => s.trim())
      .filter(Boolean)
      .map((s, i) => {
        const [q, a] = s.split("|");
        return { q: (q || "").trim(), a: (a || "").trim(), num: i + 1 };
      });
  }

  /* ========== 刷新题目池 + 题数显示 + 持久化 ========== */
  function refreshPool() {
    state.pool = parseQuestions();
    $("#count").textContent = state.pool.length;
    saveList();
  }

  /* ========== HTML 转义 ==========
   * 防止用户输入的题目/答案中包含 HTML 特殊字符导致 XSS
   * @param {string} s 原始字符串
   * @returns {string} 转义后的安全字符串
   */
  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, c => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", "\\"": "&quot;", "'": "&#39;"
    })[c]);
  }

  /* ========== 渲染抽题记录列表 ==========
   * 倒序显示（最新在前），每条带序号、题目、答案（若有）、时间
   */
  function renderRecords() {
    const ul = $("#recordList");
    $("#recordCount").textContent = state.records.length;
    if (state.records.length === 0) {
      ul.innerHTML = '<li class="state state--list-item state--empty"><div class="state-icon">🎲<\/div><div class="state-title">暂无记录<\/div><\/li>';
      return;
    }
    ul.innerHTML = state.records.map((r, i) => \`
      <li>
        <span class="r-name"><span class="r-num">\${state.records.length - i}<\/span>第\${r.num}题 · \${escapeHtml(r.q)}\${r.a ? \` <em>· \${escapeHtml(r.a)}<\/em>\` : ""}<\/span>
        <span class="r-time">\${r.time}<\/span>
      <\/li>\`).join("");
  }

  /* ========== 切换滚动 / 抽取 ==========
   * 未滚动 → 启动定时器滚动随机题目
   * 滚动中 → 停止定时器，定格并抽取最终题目
   */
  function toggleRoll() {
    if (state.rolling) stopAndPick();
    else startRoll();
  }

  /* ========== 开始滚动 ==========
   * 启动定时器按 speed 间隔切换显示随机题目与序号
   * 题库为空时给出提示并中止
   */
  function startRoll() {
    refreshPool();
    if (state.pool.length === 0) {
      $("#displayHint").textContent = "题库为空，请先输入题目";
      return;
    }
    state.rolling = true;
    state.answerRevealed = false;

    const qDisplay = $("#qDisplay");
    const qIndex = $("#qIndex");
    const btn = $("#startBtn");
    qDisplay.classList.add("rolling");
    qDisplay.classList.remove("winner");
    btn.textContent = "停止";
    btn.classList.add("rolling");
    $("#displayHint").textContent = "按 Space 或 PageDown 停止";
    $("#answerArea").classList.remove("show");
    $("#qAnswer").textContent = "";

    state.timer = setInterval(() => {
      const idx = Math.floor(Math.random() * state.pool.length);
      const item = state.pool[idx];
      qIndex.textContent = \`第 \${item.num} 题\`;
      qDisplay.textContent = item.q;
    }, state.speed);
  }

  /* ========== 停止并抽取最终题目 ==========
   * 停止定时器，从池中随机选取一题作为最终结果
   * 显示题目序号与文本，准备答案揭晓按钮，记录抽题结果
   * 若开启"抽中后移除"，从 textarea 中删除该题目并刷新池
   */
  function stopAndPick() {
    state.rolling = false;
    clearInterval(state.timer);
    state.timer = null;

    const qDisplay = $("#qDisplay");
    const qIndex = $("#qIndex");
    const btn = $("#startBtn");
    qDisplay.classList.remove("rolling");

    /* 从池中随机选取一题作为最终抽中题目 */
    const winnerIdx = Math.floor(Math.random() * state.pool.length);
    const winner = state.pool[winnerIdx];
    state.current = winner;
    state.answerRevealed = false;

    qIndex.textContent = \`第 \${winner.num} 题\`;
    qDisplay.textContent = winner.q;
    qDisplay.classList.add("winner");
    btn.textContent = "继续抽题";
    btn.classList.remove("rolling");
    $("#displayHint").textContent = "🎉 已抽中！可点击下方揭晓答案";

    /* 准备答案揭晓区：有答案则显示揭晓按钮，无答案则提示 */
    const ansArea = $("#answerArea");
    ansArea.classList.add("show");
    if (winner.a) {
      $("#revealBtn").style.display = "";
      $("#revealBtn").textContent = "👁 揭晓答案";
      $("#qAnswer").textContent = "";
    } else {
      $("#revealBtn").style.display = "none";
      $("#qAnswer").textContent = "（本题未配置答案）";
    }

    /* 记录抽题结果 */
    const time = new Date();
    const timeStr = \`\${pad(time.getHours())}:\${pad(time.getMinutes())}:\${pad(time.getSeconds())}\`;
    state.records.unshift({ q: winner.q, a: winner.a, num: winner.num, time: timeStr });
    saveRecords();
    renderRecords();

    /* 抽中后从题库移除 */
    if (state.removeAfter) {
      removeQuestionFromList(winner.q);
      refreshPool();
      if (state.pool.length === 0) {
        $("#displayHint").textContent = "🎉 全部抽完，请补充题目";
      }
    }
  }

  /* ========== 揭晓 / 隐藏答案 ==========
   * 切换当前题目答案的显示状态
   * 揭晓时显示"答案：xxx"，按钮变为"隐藏答案"
   * 隐藏时清空答案文本，按钮恢复"揭晓答案"
   */
  function toggleReveal() {
    if (!state.current) return;
    const ans = $("#qAnswer");
    const btn = $("#revealBtn");
    if (state.answerRevealed) {
      ans.textContent = "";
      btn.textContent = "👁 揭晓答案";
      state.answerRevealed = false;
    } else {
      ans.textContent = \`答案：\${state.current.a}\`;
      btn.textContent = "🙈 隐藏答案";
      state.answerRevealed = true;
    }
  }

  /** 数字补零至两位 */
  function pad(n) { return String(n).padStart(2, "0"); }

  /* ========== 从 textarea 删除指定题目（仅删除第一个题目文本匹配项） ==========
   * @param {string} q 题目文本（不含答案）
   */
  function removeQuestionFromList(q) {
    const ta = $("#qList");
    const lines = ta.value.split(/\\r?\\n/);
    const idx = lines.findIndex(s => {
      const [qq] = s.split("|");
      return (qq || "").trim() === q;
    });
    if (idx >= 0) {
      lines.splice(idx, 1);
      ta.value = lines.join("\\n");
    }
  }

  /* ========== 题目操作：去重 / 清空 / 导入 / 导出 / 恢复默认 ========== */
  /** 去除重复题目（按 题目|答案 组合键去重，保留首次出现） */
  function deduplicate() {
    const items = parseQuestions();
    const seen = new Set();
    const out = [];
    for (const it of items) {
      const key = it.q + "|" + it.a;
      if (!seen.has(key)) {
        seen.add(key);
        out.push(it.a ? \`\${it.q}|\${it.a}\` : it.q);
      }
    }
    $("#qList").value = out.join("\\n");
    refreshPool();
  }
  /** 清空题库（需二次确认） */
  function clearQuestions() {
    if (!confirm("确定清空全部题目？")) return;
    $("#qList").value = "";
    refreshPool();
  }
  /** 从 .txt / .csv 文件导入题目列表 */
  function importFile(file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      $("#qList").value = e.target.result;
      refreshPool();
    };
    reader.readAsText(file);
  }
  /** 导出当前题库为 .txt 文件 */
  function exportQuestions() {
    const blob = new Blob([$("#qList").value], { type: "text/plain;charset=utf-8" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "题目列表.txt";
    link.click();
    URL.revokeObjectURL(link.href);
  }
  /** 恢复为内置默认题库（需二次确认） */
  function resetToDefault() {
    if (!confirm("确定恢复为默认题目列表？当前题库将被替换。")) return;
    $("#qList").value = DEFAULT_QUESTIONS;
    refreshPool();
  }

  /* ========== 抽题记录操作：复制 / 清空 ========== */
  /** 复制全部抽题记录到剪贴板，兼容 file:// 协议降级 */
  function copyRecords() {
    if (state.records.length === 0) { alert("暂无记录可复制"); return; }
    const text = state.records.map((r, i) =>
      \`\${i + 1}. [第\${r.num}题] \${r.q}\${r.a ? "  答案：" + r.a : ""}  \${r.time}\`
    ).join("\\n");
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(text).then(
        () => alert("已复制到剪贴板"),
        () => fallbackCopy(text)
      );
    } else {
      fallbackCopy(text);
    }
  }
  /** 兜底复制：使用临时 textarea + execCommand("copy") */
  function fallbackCopy(text) {
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    try { document.execCommand("copy"); alert("已复制到剪贴板"); }
    catch (e) { alert("复制失败，请手动选择"); }
    document.body.removeChild(ta);
  }
  /** 清空全部抽题记录（需二次确认） */
  function clearRecords() {
    if (state.records.length === 0) return;
    if (!confirm("确定清空全部抽题记录？")) return;
    state.records = [];
    saveRecords();
    renderRecords();
  }

  /* ========== 全屏与设置栏联动 ==========
   * ⛶ 全屏（自动隐藏设置栏）/ ⚙ 隐藏设置 已统一交给共享模块
   * assets/js/tool-stage-toolbar.js（init 在下方 init() 末尾调用），
   * 本文件不再维护 toggleFullscreen / 显隐 toggle 等重复逻辑。
   */

  /* ========== 流体背景动画 ==========
   * Canvas 绘制多个流动光球，营造沉浸式深色舞台氛围
   * 纯本地绘制，无外部依赖，兼容 file:// 协议
   */
  function initBackground() {
    const canvas = $("#bgCanvas");
    const ctx = canvas.getContext("2d");
    const balls = [];
    const COLORS = ["#5eead4", "#f0abfc", "#93c5fd", "#fde68a", "#c4b5fd"];
    let w = 0, h = 0;

    /** 按画布显示尺寸调整内部像素分辨率 */
    function resize() {
      w = canvas.width = canvas.offsetWidth;
      h = canvas.height = canvas.offsetHeight;
    }
    /** 初始化光球数组：随机位置、半径、速度、颜色 */
    function initBalls() {
      balls.length = 0;
      const n = 8;
      for (let i = 0; i < n; i++) {
        balls.push({
          x: Math.random() * w,
          y: Math.random() * h,
          r: 80 + Math.random() * 120,
          dx: (Math.random() - 0.5) * 0.5,
          dy: (Math.random() - 0.5) * 0.5,
          color: COLORS[i % COLORS.length],
        });
      }
    }
    /** 帧绘制：清空画布，逐个绘制带径向渐变的光球，越界回绕 */
    function draw() {
      ctx.clearRect(0, 0, w, h);
      balls.forEach(b => {
        b.x += b.dx;
        b.y += b.dy;
        if (b.x < -b.r) b.x = w + b.r;
        if (b.x > w + b.r) b.x = -b.r;
        if (b.y < -b.r) b.y = h + b.r;
        if (b.y > h + b.r) b.y = -b.r;
        const grad = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, b.r);
        grad.addColorStop(0, b.color);
        grad.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = grad;
        ctx.globalAlpha = 0.35;
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
        ctx.fill();
      });
      requestAnimationFrame(draw);
    }

    resize();
    initBalls();
    draw();
    window.addEventListener("resize", () => { resize(); initBalls(); });
  }

  /* ========== 绑定全部事件 ========== */
  function bindEvents() {
    /* 题目输入实时更新题数 + 持久化 */
    $("#qList").addEventListener("input", refreshPool);

    /* 题目操作按钮 */
    $("#dedupBtn").onclick = deduplicate;
    $("#clearBtn").onclick = clearQuestions;
    $("#importBtn").onclick = () => $("#fileInput").click();
    $("#fileInput").onchange = (e) => {
      const f = e.target.files[0];
      if (f) importFile(f);
      e.target.value = "";
    };
    $("#exportBtn").onclick = exportQuestions;
    $("#resetBtn").onclick = resetToDefault;

    /* 抽题设置 */
    $("#removeAfter").onchange = (e) => state.removeAfter = e.target.checked;
    $("#speed").oninput = (e) => {
      state.speed = parseInt(e.target.value, 10);
      $("#speedVal").textContent = state.speed;
    };

    /* 抽题记录 */
    $("#copyRecord").onclick = copyRecords;
    $("#clearRecord").onclick = clearRecords;

    /* 抽题按钮 + 答案揭晓按钮 */
    $("#startBtn").onclick = toggleRoll;
    $("#revealBtn").onclick = toggleReveal;

    /* ⛶ 全屏（自动隐藏设置栏）/ ⚙ 隐藏设置 由共享模块接管，见 init() 末尾 */

    /* 键盘控制：Space / PageDown 开始/停止；F11 切换全屏 */
    document.addEventListener("keydown", (e) => {
      if (e.code === "Space" || e.code === "PageDown") {
        /* 避免在 textarea 内按空格触发抽题 */
        if (document.activeElement.tagName === "TEXTAREA" && e.code === "Space") return;
        e.preventDefault();
        toggleRoll();
      } else if (e.code === "F11") {
        /* 复用舞台右上角 ⛶ 按钮，避免再抄一份全屏逻辑 */
        e.preventDefault();
        const fb = $("#fullscreenBtn");
        if (fb) fb.click();
      }
    });
  }

  /* ========== 初始化 ========== */
  function init() {
    loadList();
    loadRecords();
    refreshPool();
    renderRecords();
    initBackground();
    bindEvents();
    // 舞台右上角工具栏（⛶ 全屏 / ⚙ 隐藏设置）：全屏目标是 #stage 自身，双栏容器 .main
    if (window.EduToolStageToolbar) {
      window.EduToolStageToolbar.init({ stage: "#stage", panelHost: ".main", hiddenClass: "setup-hidden" });
    }
  }

  document.addEventListener("DOMContentLoaded", init);
  window.__randomQuestionInit = init;   // 供测试/e2e 触发（生产无影响）
})();
`
    },
    meta: {builtAt: "2026-09-28 11:07:05", sources: {"tools/random-question/random-question.css": "c9c4bc7cb88d", "assets/css/tool-common.css": "d35dcf222690", "assets/js/frame-bridge.js": "1131903c1e46", "assets/js/tool-stage-toolbar.js": "30f2ddfe48d2", "tools/random-question/random-question.js": "eacf61fe815f"}}
  };
})();