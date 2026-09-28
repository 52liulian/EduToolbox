/* 自动生成，请勿手改 —— 源：tools/primary-comment/  ·  构建：2026-09-28 11:07:05 */
/* 用途：file:// 离线场景下 fetch 被 CORS 拦截，站点改用 <script src> 加载本文件，
   拿到工具页面与本地 CSS/JS 文本后走与 http 相同的 Shadow DOM 组件化挂载。
   工具源码改动后请重跑：python .workbuddy/scripts/build_tool_bundles.py */
(function(){
  var g = window.EduToolboxToolBundles || (window.EduToolboxToolBundles = {});
  g["primary-comment"] = {
    html: `<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>小学评语生成 | EduToolbox · 小学期末评语<\/title>
<meta name="description" content="小学期末评语生成器，支持名单批量导入、10 维度勾选、性别选择、3 种评语风格、一键批量生成、逐条编辑，可复制并导出 Word/Excel/TXT，数据本地自动保存，纯前端 file:// 可用。">
<link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ctext y='.9em' font-size='90'%3E%F0%9F%8E%93%3C/text%3E%3C/svg%3E">
<link rel="stylesheet" href="primary-comment.css">
<link rel="stylesheet" href="../../assets/css/tool-common.css">
<\/head>
<body>
<div id="app">

  <!-- =============== 主体 =============== -->
  <main class="wrap">

    <!-- 控制面板：名单 / 维度 / 设置 -->
    <section class="panels">

      <!-- 名单管理 -->
      <div class="panel panel-names">
        <h3 class="panel-title">🧑‍🎓 名单管理<\/h3>
        <textarea id="nameInput" placeholder="每行输入一个姓名，最多 100 人&#10;例如：&#10;陈思远&#10;赵子涵"><\/textarea>
        <div class="btn-row">
          <button type="button" class="btn btn-soft" id="btnSample">✨ 填入示例名单<\/button>
          <button type="button" class="btn btn-soft" id="btnClear">🗑 清空<\/button>
        <\/div>
        <p class="panel-tip">提示：名单会自动保存，刷新页面不丢失。<\/p>
      <\/div>

      <!-- 评语维度 -->
      <div class="panel panel-dims">
        <div class="panel-head">
          <h3 class="panel-title">🏷 评语维度（点击标签勾选）<\/h3>
          <div class="dim-tools">
            <button type="button" class="btn-mini" id="btnDimAll">全选<\/button>
            <button type="button" class="btn-mini" id="btnDimNone">全不选<\/button>
          <\/div>
        <\/div>
        <div class="chips" id="dimChips"><\/div>
        <p class="panel-tip">生成时将从每个已勾选分类中随机抽取 1 条，相邻两位同学不会抽到同一条。<\/p>
      <\/div>

      <!-- 生成设置 -->
      <div class="panel panel-settings">
        <h3 class="panel-title">⚙️ 生成设置<\/h3>
        <div class="setting-grid">
          <div class="setting-item">
            <span class="setting-label">学生性别<\/span>
            <select id="genderSelect" class="select">
              <option value="neutral">中性（该生）<\/option>
              <option value="male">男（他）<\/option>
              <option value="female">女（她）<\/option>
            <\/select>
            <p class="setting-hint">影响评语中第三人称代词；多数句子使用「你」与性别无关。<\/p>
          <\/div>
          <div class="setting-item">
            <span class="setting-label">称呼前缀<\/span>
            <label class="switch-wrap">
              <span class="switch-desc">显示「XXX同学：」前缀<\/span>
              <span class="switch"><input type="checkbox" id="chkPrefix" checked><span class="slider"><\/span><\/span>
            <\/label>
          <\/div>
          <div class="setting-item setting-item--full">
            <span class="setting-label">评语风格<\/span>
            <div class="seg-group" id="endingGroup">
              <label class="seg"><input type="radio" name="ending" value="warm" checked><span>💖 温暖鼓励<\/span><\/label>
              <label class="seg"><input type="radio" name="ending" value="objective"><span>📋 客观细致<\/span><\/label>
              <label class="seg"><input type="radio" name="ending" value="expectation"><span>🎯 期望激励<\/span><\/label>
            <\/div>
          <\/div>
        <\/div>
      <\/div>
    <\/section>

    <!-- 生成按钮 + 统计 -->
    <div class="action-bar">
      <button type="button" class="btn btn-primary btn-lg" id="btnGenerate">🚀 一键生成全部评语<\/button>
      <div class="stats">
        <span class="stat">共 <b id="statPeople">0<\/b> 人<\/span>
        <span class="stat">共 <b id="statChars">0<\/b> 字<\/span>
      <\/div>
    <\/div>

    <!-- 导出工具栏 -->
    <div class="toolbar">
      <button type="button" class="btn btn-ghost" id="btnCopy">📋 复制全部<\/button>
      <button type="button" class="btn btn-ghost" id="btnTxt">📄 下载 TXT<\/button>
      <button type="button" class="btn btn-ghost" id="btnExcel">📊 下载 Excel<\/button>
      <button type="button" class="btn btn-ghost" id="btnWord">📝 下载 Word<\/button>
    <\/div>

    <!-- 评语结果区 -->
    <section class="results">
      <h3 class="results-title">🎁 评语结果（可直接在卡片中修改）<\/h3>
      <div class="state state--compact state--empty" id="emptyTip"><div class="state-icon">📝<\/div><div class="state-title">还没有评语<\/div><div class="state-desc">填好名单后点击「一键生成全部评语」试试吧～<\/div><\/div>
      <div class="r-grid" id="resultWrap"><\/div>
    <\/section>

  <\/main>
<\/div>
<div class="toast" id="toast"><\/div>
<script src="../../assets/js/frame-bridge.js"><\/script>
<script src="../../assets/vendor/xlsx.full.min.js"><\/script>
<script src="primary-comment.js"><\/script>
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
      "tools/primary-comment/primary-comment.css": `/* ============================================================================
 * 小学评语生成 · primary-comment.css
 * 仅包含本工具特有样式：维度工具按钮 / 设置项提示 / 评语结果卡片
 * 公共底座（wrap、panels、panel、panel-names/dims/settings、panel-head、chips、
 *   setting-grid、setting-item、switch、seg-group、action-bar、stats、toolbar、
 *   results、r-grid、toast、btn、btn-mini 等）见 tool-common.css
 * 高度策略：评语卡片随内容自然增高，textarea 可纵向拖拽，仅 body 主滚动条
 * ========================================================================== */

/* ---------------------------------------------------------------------------
 * 一、维度面板头部的「全选 / 全不选」按钮组
 * ------------------------------------------------------------------------- */
.dim-tools { display: flex; gap: 8px; }

/* ---------------------------------------------------------------------------
 * 二、设置项下方提示文字
 * ------------------------------------------------------------------------- */
.setting-hint {
  margin-top: 6px;
  font-size: 12.5px;
  line-height: 1.6;
  color: var(--text-3);
}

/* ---------------------------------------------------------------------------
 * 三、评语结果卡片网格：放宽最小列宽，便于阅读长评语
 * ------------------------------------------------------------------------- */
.results .r-grid {
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 16px;
}

/* 单张评语卡片 */
.r-card {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 16px;
  background: var(--card-bg);
  border: 1px solid var(--border);
  border-radius: var(--r);
  box-shadow: var(--shadow-sm);
  transition: box-shadow var(--t-fast) var(--ease);
}
.r-card:hover { box-shadow: var(--shadow); }

.r-head {
  display: flex;
  align-items: center;
  gap: 10px;
}
.r-no {
  display: grid;
  place-items: center;
  width: 28px;
  height: 28px;
  flex-shrink: 0;
  font-size: 13px;
  font-weight: 700;
  color: var(--primary);
  background: var(--primary-soft);
  border-radius: 50%;
}
.r-name {
  flex: 1;
  min-width: 0;
  font-size: 15px;
  font-weight: 700;
  color: var(--text-1);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.r-head .btn-mini { margin-left: auto; flex-shrink: 0; }

/* 评语可编辑文本域 */
.r-text {
  width: 100%;
  min-height: 150px;
  padding: 12px 14px;
  font-size: 14px;
  line-height: 1.8;
  color: var(--text-1);
  background: var(--card-bg-2);
  border: 1px solid var(--border);
  border-radius: var(--r-sm);
  resize: vertical;
  outline: none;
  transition: border-color var(--t-fast) var(--ease),
              box-shadow var(--t-fast) var(--ease);
}
.r-text:focus {
  border-color: var(--primary);
  background: #fff;
  box-shadow: 0 0 0 3px rgba(59, 110, 246, 0.12);
}

/* ---------------------------------------------------------------------------
 * 四、小屏微调
 * ------------------------------------------------------------------------- */
@media (max-width: 640px) {
  .results .r-grid { grid-template-columns: 1fr; }
  .r-name { font-size: 14px; }
}
`,
      "tools/primary-comment/primary-comment.js": `/**
 * 小学评语生成器 · 主逻辑
 * ------------------------------------------------------------------
 * 功能概览：
 *   1. 名单管理（textarea 批量导入 / 示例填充 / 清空，localStorage 自动保存）
 *   2. 10 个评语维度（品德表现 / 学习态度 / 课堂参与 / 作业完成 / 阅读习惯 /
 *      劳动卫生 / 集体荣誉 / 特长发展 / 同伴合作 / 进步寄语）勾选
 *   3. 性别选择（男 / 女 / 中性），自动替换评语中的 {ta} 占位符
 *   4. 评语风格切换（温暖鼓励 / 客观细致 / 期望激励），决定结尾寄语
 *   5. 一键批量生成，相邻学生避免抽到同一条模板，结果不雷同
 *   6. 评语列表卡片展示，支持逐条手动编辑与单条重新生成
 *   7. 复制全部 / 导出 TXT / 导出 Excel（SheetJS）/ 导出 Word
 *   8. 所有配置与结果本地持久化（localStorage），刷新页面可恢复
 *
 * 运行环境：纯前端 IIFE，无网络请求；file:// 协议离线可用。
 * Excel 导出依赖本地 SheetJS（../../assets/vendor/xlsx.full.min.js）。
 */
(function () {
  "use strict";

  /* ===================== 学段专属配置 ===================== */

  /** @type {string} 工具唯一标识，同时作为 localStorage 键前缀，避免与其他工具冲突 */
  var SLUG = "primary-comment";

  /** @type {string} 工具完整中文名，用于导出文件名与提示文案 */
  var TOOL_TITLE = "小学评语生成";

  /** @type {string} 称呼前缀后缀，小学用「同学」（例：陈思远同学：） */
  var PREFIX_LABEL = "同学";

  /** localStorage 键名集合，集中管理便于维护 */
  var KEYS = {
    names: SLUG + ":names",
    dims: SLUG + ":dims",
    settings: SLUG + ":settings",
    results: SLUG + ":results"
  };

  /**
   * 内置示例名单（20 个，常见小学姓名，男女搭配）
   * @type {string[]}
   */
  var SAMPLE_NAMES = [
    "陈思远", "赵子涵", "林语桐", "周沐阳", "吴欣怡",
    "孙浩然", "郑雨彤", "何嘉宁", "高梓轩", "梁书瑶",
    "谢晨曦", "彭子墨", "郭可欣", "邓一诺", "罗俊熙",
    "蒋诗涵", "韩宇航", "曹安琪", "许文博", "苏若彤"
  ];

  /**
   * 性别到第三人称代词的映射，用于替换评语模板中的 {ta} 占位符
   * 中性使用「该生」，更适合正式档案与客观评语场景
   * @type {{male:string,female:string,neutral:string}}
   */
  var PRONOUNS = {
    male: "他",
    female: "她",
    neutral: "该生"
  };

  /**
   * 评语维度词库：共 10 个分类，每分类 10 条不重复短句
   * 模板中可用占位符：
   *   {ta}    —— 第三人称单数代词（男：他 / 女：她 / 中性：该生）
   *   {tas}   —— 第三人称物主代词（男：他的 / 女：她的 / 中性：该生的）
   * 未使用占位符的句子与性别无关，可跨性别使用。
   * @type {{key:string,name:string,phrases:string[]}[]}
   */
  var CATEGORIES = [
    {
      key: "pinde",
      name: "品德表现",
      phrases: [
        "你尊敬师长、团结同学，见到老师主动问好，文明有礼的样子让人如沐春风。",
        "你诚实守信，做错事敢于承认并及时改正，一颗正直的小种子正在心里生根发芽。",
        "你有一颗善良感恩的心，懂得体谅父母和老师的辛苦，常把谢谢挂在嘴边。",
        "你爱护公物、讲究卫生，看到校园里的纸屑会主动弯腰捡起，是校园的小主人。",
        "你热爱班集体，班级荣誉面前总能顾全大局，是老师心中有担当的好孩子。",
        "你遵守校规班纪、明辨是非，能用班规约束自己，也能善意提醒身边的同学。",
        "你乐于助人，同学有困难时主动伸出援手，是大家公认的小雷锋。",
        "你珍惜粮食、节俭朴实，午餐坚持光盘行动，良好的品德就在一点一滴中闪光。",
        "{ta}待人真诚、言行一致，答应别人的事总能认真做到，是同学们信赖的小伙伴。",
        "{tas}心里装着别人，会留意身边人的情绪并主动关心，这份善良与共情格外珍贵。"
      ]
    },
    {
      key: "taidu",
      name: "学习态度",
      phrases: [
        "你学习主动自觉，预习、听讲、复习环环认真，踏实的态度是你最亮眼的名片。",
        "你求知欲强，遇到不懂的问题敢于追问，打破砂锅问到底的劲儿特别可贵。",
        "你能正确对待学习中的挫折，考得不理想不气馁，擦干眼泪继续努力的样子真棒。",
        "你做事一丝不苟，哪怕是一次小听写也全力以赴，认真已经成为你的习惯。",
        "这学期你学习上更加自律，能主动安排学习任务，不再需要老师和家长反复提醒。",
        "你虚心好学，乐于接受老师和同学的建议，知错就改，进步有目共睹。",
        "你对新知识充满热情，课堂上眼睛里总闪着光，这份热爱比分数更珍贵。",
        "你能合理安排学习与玩耍的时间，先完成作业再痛快游戏，自我管理越来越出色。",
        "{ta}对待学习认真踏实，不浮躁、不敷衍，每一次小测都当成大考来对待。",
        "{tas}学习态度端正，遇到困难不退缩，这种韧劲是后续进步最坚实的底盘。"
      ]
    },
    {
      key: "ketang",
      name: "课堂参与",
      phrases: [
        "课堂上你坐姿端正、专心听讲，紧跟老师思路，是同学们学习的榜样。",
        "你积极思考、踊跃发言，回答问题声音响亮、条理清楚，常常给大家带来惊喜。",
        "你敢于提出不同见解，课堂上的奇思妙想常常引发热烈讨论，是爱思考的小质疑家。",
        "小组讨论时你总能积极参与，认真倾听组员意见，推动小组共同完成学习任务。",
        "你听讲专注，能抓住老师讲的重点并认真做好笔记，学习效率很高。",
        "从不敢举手到主动发言，这学期你在课堂上的每一次开口都是勇敢的跨越。",
        "你能在课堂上有效合作，会补充、会质疑、会总结，展现了良好的学习素养。",
        "你上课严守纪律，从不做小动作，还能用眼神和老师交流，专注的样子最美。",
        "{ta}在课堂上思维活跃，常常能从不同角度提出问题，让师生都眼前一亮。",
        "同伴发言时{ta}能认真倾听、不随意打断，这份尊重让课堂氛围格外温暖。"
      ]
    },
    {
      key: "zuoye",
      name: "作业完成",
      phrases: [
        "你的作业卷面整洁、字迹娟秀，翻开你的本子就像欣赏一幅小作品。",
        "你能按时独立完成各科作业，正确率稳步提升，错题总能及时订正。",
        "你书写姿势端正，坚持一尺一拳一寸，工整的字迹是你长期坚持的成果。",
        "你对待作业有钻研精神，遇到难题先自己思考，实在不会才向老师请教。",
        "你的错题本条理清晰，错因分析到位、订正及时，是善于反思的学习者。",
        "这学期你的书写进步明显，横平竖直间能看出你静下心来下了一番苦功。",
        "你能合理安排各科作业时间，先易后难、不拖沓，每晚都能从容完成任务。",
        "你作业完成质量高，还会主动给自己加餐做拓展练习，上进心令人欣赏。",
        "{ta}作业按时上交、订正积极，遇到不会的题目会主动标记请教，学习闭环做得很好。",
        "{tas}作业本干净整洁，每道题步骤完整，能看出写作业时心是静的、思路是清的。"
      ]
    },
    {
      key: "yuedu",
      name: "阅读习惯",
      phrases: [
        "你是个小书虫，课间、午休手不释卷，广泛的阅读让你的表达与众不同。",
        "你坚持每日阅读，好词佳句日积月累，写作文时信手拈来、生动传神。",
        "你读书有方法，会圈点批注、写读书笔记，真正做到了不动笔墨不读书。",
        "从绘本到桥梁书再到名著，你的阅读面越来越广，知识储备让同学们羡慕。",
        "你乐于分享读书收获，读书会上的推荐有理有据，带动了全班的阅读热情。",
        "你能把书中的故事讲得绘声绘色，还能联系生活谈感悟，阅读已经走进了你心里。",
        "你背诵积累了大量古诗和优美段落，传统文化的养分正在悄悄滋养你的文笔。",
        "这学期你的阅读理解能力明显提升，能抓住主要内容、体会人物情感，进步喜人。",
        "{ta}的阅读笔记图文并茂、有自己的思考，每一次翻阅都能看到新的生长点。",
        "{tas}书桌里总藏着几本课外书，{ta}用阅读为自己打开了一扇通往更大世界的窗。"
      ]
    },
    {
      key: "laodong",
      name: "劳动卫生",
      phrases: [
        "你值日认真负责，扫地、擦窗、排桌椅一丝不苟，每次都把教室打扫得窗明几净。",
        "你是老师得力的小助手，收发作业、管理班级井然有序，是同学们信赖的小干部。",
        "大扫除时你总是抢着干最脏最累的活，不怕苦不怕累的精神让大家竖起大拇指。",
        "你自觉维护教室卫生，看到纸屑主动捡起、桌椅歪了主动摆正，校园因你更整洁。",
        "你当值日生时能提前到校、最后离开，责任心在劳动中闪闪发光。",
        "你爱护班级的一草一木，植物角的绿植在你的照料下生机勃勃。",
        "你乐于为班级服务，出黑板报、布置展板总有你忙碌的身影，从无怨言。",
        "在家你也是父母的小帮手，会做家务、体谅长辈，劳动让你更加懂事能干。",
        "{ta}劳动积极肯干，从不挑活儿，把每一项值日任务都完成得认认真真。",
        "{tas}个人卫生习惯也很好，桌斗整齐、衣着干净，举手投足都透着自律。"
      ]
    },
    {
      key: "jiti",
      name: "集体荣誉",
      phrases: [
        "你把班级荣誉看得很重，运动会、合唱节上拼尽全力，为班级争光的样子特别帅。",
        "你是班集体的小主人，主动参与策划班队活动，是同学们信任的「小管家」。",
        "在集体中你敢于担当，遇到脏活累活冲在前，是班级凝聚力的「小粘合剂」。",
        "你关心班级每一个成员，谁生病了主动问候、谁落单了主动邀请，温暖又贴心。",
        "你代表班级参加比赛自信大方，把集体荣誉看得比自己得失更重，格局让人佩服。",
        "运动会、艺术节上你都能见到你忙碌的身影，为班级拿回来的奖状里有你一份功劳。",
        "你爱护班级形象，校外活动时主动维持纪律，是班级「行走的名片」。",
        "班级有困难时你总能挺身而出，这份担当让老师和同学都对你刮目相看。",
        "{ta}在集体活动中积极配合、不抢功、不抱怨，是班级不可或缺的稳定力量。",
        "{tas}集体荣誉感很强，常把「我们班」挂在嘴边，这份归属感让班级更团结。"
      ]
    },
    {
      key: "techang",
      name: "特长发展",
      phrases: [
        "你写得一手漂亮的毛笔字，横竖撇捺间有模有样，是班里公认的小书法家。",
        "运动场上你身姿矫健，跑步、跳绳、球类样样出色，为班级争得了不少荣誉。",
        "你歌声甜美、舞姿灵动，艺术节上的精彩表演让全校师生都记住了你。",
        "你擅长绘画，笔下的人物和风景充满灵气，班级的宣传海报总少不了你的手笔。",
        "你热爱科学探究，小实验、小发明中常有奇思妙想，是科技节上的闪亮之星。",
        "你能说会道、口才出众，朗诵和演讲时抑扬顿挫，是舞台上最自信的小主持人。",
        "你棋艺精湛，对弈时沉着冷静、落子无悔，胜不骄败不馁的风度更胜棋艺。",
        "你坚持学习才艺多年不辍，这份持久的热爱和毅力比奖状更加可贵。",
        "{ta}在计算机、编程等数字领域展现出浓厚兴趣，作品创意十足、完成度很高。",
        "{tas}兴趣广泛而不浮躁，能在多个领域都保持探索热情，难能可贵。"
      ]
    },
    {
      key: "jiaowang",
      name: "同伴合作",
      phrases: [
        "你待人真诚友善，同学们都愿意和你交朋友，你是大家心中值得信赖的伙伴。",
        "你善于合作，小组活动中能倾听、会协商，和你一组做项目总是又轻松又高效。",
        "你宽容大度，和同学有小矛盾时能换位思考、主动和解，胸怀让人佩服。",
        "你热心帮助学习有困难的伙伴，耐心讲题、共同进步，是班里的小老师。",
        "你懂得尊重差异，能欣赏每位同学的优点，从不取笑别人，善良而有教养。",
        "你组织能力强，课间游戏、班队活动总能把大家安排得明明白白，是天生的小组织者。",
        "你关心新同学，主动带他熟悉校园、认识伙伴，让新成员很快融入了班集体。",
        "你诚实守信、重诺守约，答应别人的事一定做到，小伙伴都把你当知心朋友。",
        "{ta}能主动化解同学间的小矛盾，是大家公认的「和事佬」，情商很高。",
        "{tas}合作意识很强，会主动补位、不计较个人得失，团队因{ta}更融洽。"
      ]
    },
    {
      key: "jianyi",
      name: "进步寄语",
      phrases: [
        "希望你今后课堂上更大胆地举手表达，错了也没关系，思考本身就是最美的风景。",
        "建议你给作业多留几分钟检查，再细心一点点，就能和更多好成绩握手。",
        "期待你新学期多读几本科普和历史书，让阅读的面再宽一些、眼界再远一些。",
        "希望你改掉偶尔拖拉的小毛病，用今日事今日毕提醒自己，你会更加轻松出色。",
        "建议你遇到难题先独立思考十分钟再求助，相信自己，你比想象中更有力量。",
        "希望你坚持体育锻炼、保护好视力，用健康的身体支撑大大的梦想。",
        "期待你学会管理自己的小情绪，遇事先深呼吸，做内心更有力量的孩子。",
        "建议你多参加集体活动和志愿服务，在帮助他人的过程中收获更大的成长。",
        "{ta}若能在课堂上再主动一些，下学期一定能更上一层楼，老师拭目以待。",
        "愿{ta}带着这学期的努力与成长继续前行，遇见更优秀的自己，未来可期。"
      ]
    }
  ];

  /**
   * 结尾寄语词库：三种风格，每种 4 条
   * warm        —— 温暖鼓励：第二人称你，柔光、亲和、肯定
   * objective   —— 客观细致：第三人称{ta}，理性、具体、陈述事实
   * expectation —— 期望激励：第二人称你，目标导向、向上、有冲劲
   * @type {{warm:string[],objective:string[],expectation:string[]}}
   */
  var ENDINGS = {
    warm: [
      "孩子，老师为你的努力点赞，愿你永远健康快乐、向阳生长！",
      "愿你被爱包围、被光指引，带着满满的信心迎接新的成长！",
      "你真的很棒，请继续相信自己，老师永远是你最坚实的后盾！",
      "你是一颗闪闪发光的小星星，老师愿陪着你慢慢亮起来。"
    ],
    objective: [
      "{ta}本学期综合表现稳定、品德与学业并进，是一名全面发展的好学生。",
      "{ta}本学期学习态度端正、与同学相处融洽，整体表现令人满意。",
      "综合来看，{ta}是一名自律、上进、有集体责任感的小学生，值得肯定。",
      "{ta}本学期在多个方面均有明显进步，发展态势良好，望继续保持。"
    ],
    expectation: [
      "新学期，愿你以更专注的课堂、更工整的书写，遇见更优秀的自己！",
      "希望你向着既定目标稳步前行，不怕困难、坚持到底，收获更丰硕的果实！",
      "期待你新学期多读书、勤思考、敢表达，成为更全面发展的好少年！",
      "愿你带着这学期的成长继续奔跑，把目标种在心里，用行动浇灌它开花！"
    ]
  };

  /* ===================== DOM 与运行时状态 ===================== */

  /**
   * 按 id 获取 DOM 元素，省略每次的 document.getElementById
   * @param {string} id 元素 id
   * @returns {HTMLElement} 对应 DOM 元素，未找到时为 null
   */
  function $(id) { return document.getElementById(id); }

  /** 常用元素缓存，避免重复查询 */
  var els = {
    nameInput: $("nameInput"),
    btnSample: $("btnSample"),
    btnClear: $("btnClear"),
    genderSelect: $("genderSelect"),
    dimChips: $("dimChips"),
    btnDimAll: $("btnDimAll"),
    btnDimNone: $("btnDimNone"),
    chkPrefix: $("chkPrefix"),
    endingGroup: $("endingGroup"),
    btnGenerate: $("btnGenerate"),
    btnCopy: $("btnCopy"),
    btnTxt: $("btnTxt"),
    btnExcel: $("btnExcel"),
    btnWord: $("btnWord"),
    resultWrap: $("resultWrap"),
    emptyTip: $("emptyTip"),
    statPeople: $("statPeople"),
    statChars: $("statChars"),
    toast: $("toast")
  };

  /** @type {Object<string,boolean>} 维度勾选状态，key 为分类 key */
  var selected = {};

  /**
   * 生成设置
   * @type {{prefix:boolean,ending:string,gender:string}}
   * prefix  是否在评语前加「XXX同学：」
   * ending  结尾寄语风格：warm / objective / expectation
   * gender  性别：male / female / neutral
   */
  var settings = { prefix: true, ending: "warm", gender: "neutral" };

  /** @type {{name:string,text:string,picks:Object}[]} 已生成的评语结果，按名单顺序 */
  var results = [];

  /** toast 提示定时器句柄，用于重复触发时清除上次定时 */
  var toastTimer = null;

  /* ===================== 本地存储 ===================== */

  /**
   * 安全写入 localStorage
   * file:// 协议或浏览器隐私模式下可能抛异常，此处吞掉异常避免阻塞主流程
   * @param {string} key 键名
   * @param {string} value 字符串值
   */
  function storageSet(key, value) {
    try { localStorage.setItem(key, value); } catch (e) { /* 忽略存储异常 */ }
  }

  /**
   * 安全读取 localStorage
   * @param {string} key 键名
   * @returns {string|null} 读到的字符串；不存在或异常时返回 null
   */
  function storageGet(key) {
    try { return localStorage.getItem(key); } catch (e) { return null; }
  }

  /** 持久化当前名单文本 */
  function saveNames() { storageSet(KEYS.names, els.nameInput.value); }

  /** 持久化当前勾选的维度 key 数组 */
  function saveDims() {
    var keys = CATEGORIES.filter(function (c) { return selected[c.key]; }).map(function (c) { return c.key; });
    storageSet(KEYS.dims, JSON.stringify(keys));
  }

  /** 持久化生成设置（前缀、寄语风格、性别） */
  function saveSettings() { storageSet(KEYS.settings, JSON.stringify(settings)); }

  /** 持久化生成结果，便于刷新后恢复 */
  function saveResults() { storageSet(KEYS.results, JSON.stringify(results)); }

  /* ===================== 名单与维度 ===================== */

  /**
   * 解析名单文本：按行拆分、去首尾空白、过滤空行、最多保留 100 人
   * @returns {string[]} 姓名数组，可能为空数组
   */
  function parseNames() {
    return els.nameInput.value
      .split(/\\r?\\n/)
      .map(function (s) { return s.trim(); })
      .filter(function (s) { return s.length > 0; })
      .slice(0, 100);
  }

  /**
   * 渲染维度 chip 标签到页面
   * 每次调用都全量重绘，依靠 aria-pressed 反映勾选状态
   */
  function renderChips() {
    els.dimChips.innerHTML = CATEGORIES.map(function (c) {
      var on = !!selected[c.key];
      return '<button type="button" class="chip" aria-pressed="' + on + '" data-key="' + c.key + '">' + c.name + "<\/button>";
    }).join("");
  }

  /**
   * 批量设置全部维度的勾选状态并重绘
   * @param {boolean} on true=全选；false=全不选
   */
  function setAllDims(on) {
    CATEGORIES.forEach(function (c) { selected[c.key] = on; });
    renderChips();
    saveDims();
  }

  /* ===================== 评语生成 ===================== */

  /**
   * 将模板中的 {ta} / {tas} 占位符替换为对应性别的代词
   * @param {string} tpl 原始模板字符串
   * @returns {string} 替换后的评语片段
   */
  function applyPronoun(tpl) {
    var pron = PRONOUNS[settings.gender] || PRONOUNS.neutral;
    var pronS = pron + "的";
    return tpl.replace(/\\{tas\\}/g, pronS).replace(/\\{ta\\}/g, pron);
  }

  /**
   * 从候选短句中随机抽取一条，自动避开禁用内容
   * 当全部候选都被禁用时，回退为整个候选池再抽一次，保证一定有结果
   * @param {string[]} pool 候选短句数组
   * @param {string[]} forbidden 需要避开的短句集合（如相邻学生已抽到的）
   * @returns {string} 抽中的短句
   */
  function pickPhrase(pool, forbidden) {
    var avail = pool.filter(function (p) { return forbidden.indexOf(p) === -1; });
    if (!avail.length) avail = pool;
    return avail[Math.floor(Math.random() * avail.length)];
  }

  /**
   * 为一名学生拼接完整评语
   * @param {string} name 学生姓名
   * @param {Object[]} avoidPicks 需要避开的抽取记录数组（相邻学生、本人旧记录）
   * @returns {{name:string,text:string,picks:Object}} 一条评语结果对象
   *   - name  学生姓名
   *   - text  最终评语文本（含前缀、拼接段落、结尾寄语）
   *   - picks 每个维度抽中的具体短句，便于单条重生成时去重
   */
  function buildOne(name, avoidPicks) {
    var picks = {};
    var parts = [];
    CATEGORIES.forEach(function (cat) {
      if (!selected[cat.key]) return;
      var forbidden = avoidPicks
        .map(function (rec) { return rec && rec[cat.key]; })
        .filter(Boolean);
      var phrase = pickPhrase(cat.phrases, forbidden);
      picks[cat.key] = phrase;
      parts.push(applyPronoun(phrase));
    });

    var endingPool = ENDINGS[settings.ending] || ENDINGS.warm;
    var ending = applyPronoun(pickPhrase(endingPool, []));

    var prefix = settings.prefix ? name + PREFIX_LABEL + "：" : "";
    return { name: name, text: prefix + parts.join("") + ending, picks: picks };
  }

  /**
   * 一键为名单中的全部学生批量生成评语
   * 校验名单非空、至少勾选一个维度；超 100 人仅取前 100；
   * 相邻学生避免抽到同一条模板，保证差异化
   */
  function generateAll() {
    var rawCount = els.nameInput.value.split(/\\r?\\n/).map(function (s) { return s.trim(); }).filter(Boolean).length;
    var names = parseNames();
    if (!names.length) { toast("请先填写学生名单"); return; }
    if (rawCount > 100) toast("名单超过 100 人，已仅取前 100 人生成");

    var dimCount = CATEGORIES.filter(function (c) { return selected[c.key]; }).length;
    if (!dimCount) { toast("请至少勾选一个评语维度"); return; }

    var list = [];
    var prevPicks = null;
    names.forEach(function (n) {
      var item = buildOne(n, prevPicks ? [prevPicks] : []);
      list.push(item);
      prevPicks = item.picks;
    });
    results = list;
    saveResults();
    renderResults();
    toast("已为 " + names.length + " 名同学生成评语");
    els.resultWrap.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  /**
   * 单独重新生成某一张卡片的评语
   * 避开本人旧抽取记录与前后相邻学生的抽取记录，确保新结果与上下文不雷同
   * @param {number} index 结果下标
   */
  function regenerateOne(index) {
    var cur = results[index];
    if (!cur) return;
    var avoid = [cur.picks];
    if (results[index - 1]) avoid.push(results[index - 1].picks);
    if (results[index + 1]) avoid.push(results[index + 1].picks);
    var item = buildOne(cur.name, avoid);
    results[index] = item;
    saveResults();

    var ta = els.resultWrap.querySelector('[data-idx="' + index + '"]');
    if (ta) ta.value = item.text;
    updateStats();
    toast(cur.name + " 的评语已重新生成");
  }

  /* ===================== 结果渲染与统计 ===================== */

  /**
   * 转义 HTML 特殊字符，防止姓名或评语内容破坏页面结构
   * @param {string} s 原始字符串
   * @returns {string} 转义后的字符串，可直接用于 innerHTML 拼接
   */
  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/<\/g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  /**
   * 渲染全部评语结果卡片
   * 每张卡片含序号、姓名、单条重生成按钮、可编辑评语文本域
   */
  function renderResults() {
    els.emptyTip.style.display = results.length ? "none" : "block";
    els.resultWrap.innerHTML = results.map(function (r, i) {
      var no = String(i + 1).padStart(2, "0");
      return '<div class="r-card">'
        + '<div class="r-head">'
        + '<span class="r-no">' + no + "<\/span>"
        + '<span class="r-name">' + escapeHtml(r.name) + "<\/span>"
        + '<button type="button" class="btn-mini" data-regen="' + i + '">🔄 重新生成<\/button>'
        + "<\/div>"
        + '<textarea class="r-text" data-idx="' + i + '">' + escapeHtml(r.text) + "<\/textarea>"
        + "<\/div>";
    }).join("");
    updateStats();
  }

  /**
   * 更新顶部统计：人数 / 全部评语的非空白总字数
   * 字数计算去除所有空白字符，更接近真实阅读长度
   */
  function updateStats() {
    els.statPeople.textContent = String(results.length);
    var chars = results.reduce(function (sum, r) {
      return sum + r.text.replace(/\\s/g, "").length;
    }, 0);
    els.statChars.textContent = String(chars);
  }

  /* ===================== 复制与导出 ===================== */

  /**
   * 轻提示 toast：在屏幕底部短暂显示一条消息
   * @param {string} msg 提示文案
   */
  function toast(msg) {
    els.toast.textContent = msg;
    els.toast.classList.add("show");
    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { els.toast.classList.remove("show"); }, 2200);
  }

  /**
   * 复制文本到剪贴板：优先用 Clipboard API，失败则回退 execCommand
   * file:// 协议或非安全上下文下 Clipboard API 可能不可用
   * @param {string} text 待复制文本
   * @returns {Promise<void>} 成功 resolve，失败 reject
   */
  function copyToClipboard(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      return navigator.clipboard.writeText(text).catch(function () { return legacyCopy(text); });
    }
    return legacyCopy(text);
  }

  /**
   * 旧式复制方案：临时 textarea + execCommand('copy')
   * 兼容 file:// 与非安全上下文，移动端也能工作
   * @param {string} text 待复制文本
   * @returns {Promise<void>}
   */
  function legacyCopy(text) {
    return new Promise(function (resolve, reject) {
      var ta = document.createElement("textarea");
      ta.value = text;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      var ok = false;
      try { ok = document.execCommand("copy"); } catch (e) { ok = false; }
      document.body.removeChild(ta);
      if (ok) resolve(); else reject(new Error("复制失败"));
    });
  }

  /**
   * 触发浏览器下载
   * @param {string} filename 文件名（含扩展名）
   * @param {Blob} blob 文件 Blob 对象
   */
  function download(filename, blob) {
    var url = URL.createObjectURL(blob);
    var a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(function () { URL.revokeObjectURL(url); }, 1500);
  }

  /**
   * 复制全部评语：姓名 + Tab + 评语文本，可直接粘贴进 Excel 一行一条
   * 评语内的换行与制表符会被替换为空格，避免破坏表格结构
   */
  function exportCopy() {
    if (!results.length) { toast("请先生成评语"); return; }
    var text = results.map(function (r) {
      return r.name + "\\t" + r.text.replace(/[\\r\\n\\t]/g, " ");
    }).join("\\r\\n");
    copyToClipboard(text).then(function () {
      toast("已复制全部评语（制表符分隔，可直接粘贴到 Excel）");
    }).catch(function () {
      toast("复制失败，请检查浏览器权限");
    });
  }

  /**
   * 导出 TXT：带 BOM 头，记事本打开不乱码
   * 格式为「序号. 姓名」一行、评语一行、空行分隔
   */
  function exportTxt() {
    if (!results.length) { toast("请先生成评语"); return; }
    var body = results.map(function (r, i) {
      return (i + 1) + ". " + r.name + "\\r\\n" + r.text;
    }).join("\\r\\n\\r\\n");
    var blob = new Blob(["\\ufeff" + body], { type: "text/plain;charset=utf-8" });
    download(TOOL_TITLE + ".txt", blob);
    toast("TXT 文件已开始下载");
  }

  /**
   * 导出 Excel：姓名 / 评语两列，列宽适配
   * 依赖本地 SheetJS（../../assets/vendor/xlsx.full.min.js）暴露的全局 XLSX 对象
   * 若用户意外删除该 vendor 文件，给出明确提示而非静默失败
   */
  function exportExcel() {
    if (!results.length) { toast("请先生成评语"); return; }
    if (typeof XLSX === "undefined") { toast("Excel 组件未加载，请确认 xlsx.full.min.js 存在"); return; }
    var rows = results.map(function (r) {
      return { "姓名": r.name, "评语": r.text };
    });
    var ws = XLSX.utils.json_to_sheet(rows, { header: ["姓名", "评语"] });
    ws["!cols"] = [{ wch: 12 }, { wch: 90 }];
    var wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "期末评语");
    XLSX.writeFile(wb, TOOL_TITLE + ".xlsx");
    toast("Excel 文件已开始下载");
  }

  /**
   * 导出 Word：HTML 文档 + application/msword Blob，Word/WPS 可直接打开
   * 中文段落用 <p> + text-indent，姓名加粗作为段首
   */
  function exportWord() {
    if (!results.length) { toast("请先生成评语"); return; }
    var paras = results.map(function (r) {
      var head = settings.prefix ? "" : "<b>" + escapeHtml(r.name) + "：<\/b>";
      return '<p style="text-indent:2em;margin:0 0 12pt 0;line-height:1.8;font-size:12pt;">'
        + head + escapeHtml(r.text) + "<\/p>";
    }).join("");
    var doc = '<html xmlns:o="urn:schemas-microsoft-com:office:office" '
      + 'xmlns:w="urn:schemas-microsoft-com:office:word" '
      + ">"
      + "<head><meta charset=\\"utf-8\\"><title>" + TOOL_TITLE + "<\/title>"
      + '<style>body{font-family:"宋体",SimSun,serif;} h2{text-align:center;font-size:18pt;margin:20pt 0;}<\/style>'
      + "<\/head><body><h2>" + TOOL_TITLE + "<\/h2>" + paras + "<\/body><\/html>";
    var blob = new Blob(["\\ufeff", doc], { type: "application/msword" });
    download(TOOL_TITLE + ".doc", blob);
    toast("Word 文件已开始下载");
  }

  /* ===================== 事件绑定 ===================== */

  /**
   * 绑定全部页面交互事件
   * 采用事件委托处理维度 chip 与结果区的动态元素，减少监听器数量
   */
  function bindEvents() {
    // 名单输入：每次按键即自动保存
    els.nameInput.addEventListener("input", saveNames);

    // 示例名单 / 清空名单
    els.btnSample.addEventListener("click", function () {
      els.nameInput.value = SAMPLE_NAMES.join("\\n");
      saveNames();
      toast("已填入 20 个示例姓名");
    });
    els.btnClear.addEventListener("click", function () {
      els.nameInput.value = "";
      saveNames();
      toast("名单已清空");
    });

    // 性别切换：实时保存并应用到新生成的评语
    els.genderSelect.addEventListener("change", function () {
      settings.gender = els.genderSelect.value;
      saveSettings();
    });

    // 维度 chip：事件委托切换勾选状态
    els.dimChips.addEventListener("click", function (e) {
      var btn = e.target.closest ? e.target.closest(".chip") : null;
      if (!btn) return;
      var key = btn.getAttribute("data-key");
      selected[key] = !selected[key];
      btn.setAttribute("aria-pressed", selected[key] ? "true" : "false");
      saveDims();
    });
    els.btnDimAll.addEventListener("click", function () { setAllDims(true); });
    els.btnDimNone.addEventListener("click", function () { setAllDims(false); });

    // 生成设置：前缀开关
    els.chkPrefix.addEventListener("change", function () {
      settings.prefix = els.chkPrefix.checked;
      saveSettings();
    });
    // 生成设置：寄语风格单选
    Array.prototype.forEach.call(els.endingGroup.querySelectorAll('input[name="ending"]'), function (radio) {
      radio.addEventListener("change", function () {
        settings.ending = radio.value;
        saveSettings();
      });
    });

    // 一键生成
    els.btnGenerate.addEventListener("click", generateAll);

    // 导出
    els.btnCopy.addEventListener("click", exportCopy);
    els.btnTxt.addEventListener("click", exportTxt);
    els.btnExcel.addEventListener("click", exportExcel);
    els.btnWord.addEventListener("click", exportWord);

    // 结果区：单条重生成（事件委托）
    els.resultWrap.addEventListener("click", function (e) {
      var btn = e.target.closest ? e.target.closest("[data-regen]") : null;
      if (!btn) return;
      regenerateOne(parseInt(btn.getAttribute("data-regen"), 10));
    });
    // 结果区：手动编辑实时同步到 results 并保存
    els.resultWrap.addEventListener("input", function (e) {
      var ta = e.target;
      if (!ta.hasAttribute("data-idx")) return;
      var idx = parseInt(ta.getAttribute("data-idx"), 10);
      if (results[idx]) {
        results[idx].text = ta.value;
        saveResults();
        updateStats();
      }
    });
  }

  /* ===================== 初始化：恢复本地数据 ===================== */

  /**
   * 从 localStorage 恢复名单、勾选、设置与历史结果
   * 任何一项读取或解析失败均回退到默认值，保证页面可用
   */
  function restore() {
    // 默认勾选全部维度
    CATEGORIES.forEach(function (c) { selected[c.key] = true; });

    var savedNames = storageGet(KEYS.names);
    if (savedNames !== null) els.nameInput.value = savedNames;

    var savedDims = storageGet(KEYS.dims);
    if (savedDims) {
      try {
        var arr = JSON.parse(savedDims);
        if (Array.isArray(arr)) {
          CATEGORIES.forEach(function (c) { selected[c.key] = arr.indexOf(c.key) !== -1; });
        }
      } catch (e) { /* 解析失败保持默认全选 */ }
    }

    var savedSettings = storageGet(KEYS.settings);
    if (savedSettings) {
      try {
        var obj = JSON.parse(savedSettings);
        if (typeof obj.prefix === "boolean") settings.prefix = obj.prefix;
        if (obj.ending && ENDINGS[obj.ending]) settings.ending = obj.ending;
        if (obj.gender && PRONOUNS[obj.gender]) settings.gender = obj.gender;
      } catch (e) { /* 解析失败保持默认 */ }
    }
    els.chkPrefix.checked = settings.prefix;
    els.genderSelect.value = settings.gender;
    Array.prototype.forEach.call(els.endingGroup.querySelectorAll('input[name="ending"]'), function (radio) {
      radio.checked = radio.value === settings.ending;
    });

    var savedResults = storageGet(KEYS.results);
    if (savedResults) {
      try {
        var arr2 = JSON.parse(savedResults);
        if (Array.isArray(arr2)) {
          results = arr2.filter(function (r) {
            return r && typeof r.name === "string" && typeof r.text === "string";
          }).map(function (r) {
            return { name: r.name, text: r.text, picks: r.picks || {} };
          });
        }
      } catch (e) { results = []; }
    }
  }

  /**
   * 入口：恢复数据 → 渲染界面 → 绑定事件
   * 在 DOMContentLoaded 之后由 IIFE 末尾直接调用
   */
  function init() {
    restore();
    renderChips();
    renderResults();
    bindEvents();
  }

  init();
})();
`
    },
    meta: {builtAt: "2026-09-28 11:07:05", sources: {"tools/primary-comment/primary-comment.css": "f3864d746318", "assets/css/tool-common.css": "d35dcf222690", "assets/js/frame-bridge.js": "1131903c1e46", "tools/primary-comment/primary-comment.js": "6b63cd437e55"}}
  };
})();