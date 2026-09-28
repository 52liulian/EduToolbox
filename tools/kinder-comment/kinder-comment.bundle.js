/* 自动生成，请勿手改 —— 源：tools/kinder-comment/  ·  构建：2026-09-28 11:07:05 */
/* 用途：file:// 离线场景下 fetch 被 CORS 拦截，站点改用 <script src> 加载本文件，
   拿到工具页面与本地 CSS/JS 文本后走与 http 相同的 Shadow DOM 组件化挂载。
   工具源码改动后请重跑：python .workbuddy/scripts/build_tool_bundles.py */
(function(){
  var g = window.EduToolboxToolBundles || (window.EduToolboxToolBundles = {});
  g["kinder-comment"] = {
    html: `<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>幼儿园评语生成 | EduToolbox · 童化语气评语工具<\/title>
<meta name="description" content="幼儿园期末评语生成器：10 大维度童化评语词库、温暖鼓励/童趣可爱/具体细致三种风格、男女孩与中性适配，一键为全班生成不雷同评语，支持复制、导出 Word/Excel/TXT，数据本地自动保存。">
<link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ctext y='.9em' font-size='90'%3E%F0%9F%8E%93%3C/text%3E%3C/svg%3E">
<link rel="stylesheet" href="kinder-comment.css">
<link rel="stylesheet" href="../../assets/css/tool-common.css">
<\/head>
<body>

<main class="wrap">
  <!-- 控制面板：名单 / 维度 / 设置 -->
  <section class="panels">

    <!-- 名单管理 -->
    <div class="panel panel-names">
      <h3 class="panel-title">🧒 名单管理<\/h3>
      <textarea id="nameInput" placeholder="每行输入一个姓名，最多 100 人&#10;例如：&#10;李一诺&#10;王梓萱"><\/textarea>
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
      <p class="panel-tip">生成时将从每个已勾选分类中随机抽取 1 条，相邻两位小朋友不会抽到同一条。<\/p>
    <\/div>

    <!-- 生成设置 -->
    <div class="panel panel-settings">
      <h3 class="panel-title">⚙️ 生成设置<\/h3>
      <div class="setting-grid">
        <div class="setting-item">
          <span class="setting-label">性别选择<\/span>
          <div class="seg-group" id="genderGroup">
            <label class="seg"><input type="radio" name="gender" value="neutral" checked><span>🌈 中性<\/span><\/label>
            <label class="seg"><input type="radio" name="gender" value="boy"><span>👦 男孩<\/span><\/label>
            <label class="seg"><input type="radio" name="gender" value="girl"><span>👧 女孩<\/span><\/label>
          <\/div>
        <\/div>
        <div class="setting-item">
          <span class="setting-label">评语风格<\/span>
          <div class="seg-group" id="styleGroup">
            <label class="seg"><input type="radio" name="style" value="warm" checked><span>💖 温暖鼓励<\/span><\/label>
            <label class="seg"><input type="radio" name="style" value="cute"><span>🧸 童趣可爱<\/span><\/label>
            <label class="seg"><input type="radio" name="style" value="detailed"><span>📝 具体细致<\/span><\/label>
          <\/div>
        <\/div>
        <div class="setting-item">
          <span class="setting-label">称呼前缀<\/span>
          <label class="switch-wrap">
            <span class="switch-desc">显示「XXX 小朋友 / 小男子汉 / 小公主：」前缀<\/span>
            <span class="switch"><input type="checkbox" id="chkPrefix" checked><span class="slider"><\/span><\/span>
          <\/label>
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
<div class="toast" id="toast"><\/div>
<script src="../../assets/js/frame-bridge.js"><\/script>
<script src="../../assets/vendor/xlsx.full.min.js"><\/script>
<script src="kinder-comment.js"><\/script>
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
      "tools/kinder-comment/kinder-comment.css": `/* ============================================================================
 * 幼儿园评语生成 · kinder-comment.css
 * 仅包含本工具特有样式：名单管理 / 维度标签 / 生成设置 /
 *                       操作按钮 + 统计 / 导出工具栏 / 评语结果卡
 * 公共底座（reset、按钮、卡片、表单、seg-group、switch、chips、toolbar）见 tool-common.css
 * 高度策略：所有容器高度自动撑开，仅 body 主滚动条；textarea resize:vertical
 * ========================================================================== */

/* ---------------------------------------------------------------------------
 * 一、容器与标题
 * ------------------------------------------------------------------------- */
.wrap {
  max-width: 1240px;
  padding: 24px 24px 56px;
}

/* hero 标题区：本工具使用 .hero-title / .hero-desc 自定义类名 */
.hero {
  margin-bottom: 22px;
  padding: 26px 30px;
  text-align: center;
  background: linear-gradient(135deg, #ffd6e0 0%, #ffe6c8 50%, #e1ecff 100%);
  border: 1px solid var(--border);
  border-radius: var(--r-lg);
  box-shadow: var(--shadow-sm);
}
.hero-title {
  font-size: clamp(22px, 3vw, 30px);
  font-weight: 800;
  color: #5b3a7a;
  margin-bottom: 10px;
  letter-spacing: 0.02em;
  background: linear-gradient(135deg, #d63384 0%, #8450b3 60%, #5a3a7a 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}
.hero-desc {
  font-size: 14px;
  line-height: 1.8;
  color: var(--text-2);
  max-width: 880px;
  margin: 0 auto;
}

/* ---------------------------------------------------------------------------
 * 二、三栏控制面板：名单 + 维度 + 设置（设置占满整行）
 * ------------------------------------------------------------------------- */
.panels {
  grid-template-columns: minmax(260px, 320px) minmax(0, 1fr);
  gap: 16px;
  margin-bottom: 18px;
}

.panel-names,
.panel-dims,
.panel-settings {
  padding: 18px;
}

.panel-names { grid-column: 1; }
.panel-dims  { grid-column: 2; }
.panel-settings { grid-column: 1 / -1; }

@media (max-width: 760px) {
  .panels { grid-template-columns: 1fr; }
  .panel-names, .panel-dims, .panel-settings { grid-column: auto; }
}

.panel-title {
  font-size: 15.5px;
  font-weight: 700;
  margin-bottom: 12px;
  color: var(--text-1);
}

.panel-head { margin-bottom: 10px; }
.panel-head .panel-title { margin-bottom: 0; }
.dim-tools {
  display: inline-flex;
  gap: 6px;
}

.panel-tip {
  margin-top: 10px;
  font-size: 12.5px;
  line-height: 1.6;
  color: var(--text-3);
}

/* 名单输入域 */
.panel-names textarea {
  width: 100%;
  min-height: 200px;
  padding: 10px 14px;
  font-size: 13.5px;
  line-height: 1.8;
  resize: vertical;
  font-family: -apple-system, "PingFang SC", "Microsoft YaHei", monospace;
}
.panel-names .btn-row {
  display: flex;
  gap: 8px;
  margin-top: 10px;
}
.panel-names .btn-row .btn { flex: 1; }

/* 维度标签云 */
.chips { gap: 8px; }
.chip {
  padding: 7px 14px;
  font-size: 13px;
}

/* 设置网格 */
.setting-grid {
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 12px;
}
.setting-item {
  align-items: flex-start;
  flex-direction: column;
  gap: 8px;
  padding: 14px 16px;
}
.setting-item .setting-label {
  font-size: 13.5px;
  font-weight: 700;
  color: var(--text-1);
}
.setting-item .switch-wrap { justify-content: flex-start; }
.setting-item .seg-group { flex-wrap: wrap; }

/* ---------------------------------------------------------------------------
 * 三、生成按钮 + 统计 / 导出工具栏
 * ------------------------------------------------------------------------- */
.action-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
  margin: 18px 0;
  padding: 16px 20px;
  background: var(--card-bg);
  border: 1px solid var(--border);
  border-radius: var(--r);
  box-shadow: var(--shadow-sm);
}
.action-bar .btn-primary { flex-shrink: 0; }
.action-bar .stats {
  display: inline-flex;
  gap: 18px;
  flex-wrap: wrap;
}
.action-bar .stat {
  font-size: 14px;
  color: var(--text-2);
}
.action-bar .stat b {
  font-size: 20px;
  font-weight: 800;
  color: var(--primary);
  margin: 0 4px;
}

.toolbar {
  justify-content: flex-start;
  padding: 12px 16px;
  margin-bottom: 18px;
}
.toolbar .btn { padding: 9px 16px; font-size: 13px; }

/* ---------------------------------------------------------------------------
 * 四、评语结果区
 * ------------------------------------------------------------------------- */
.results { margin-top: 18px; }
.results-title {
  font-size: 17px;
  font-weight: 700;
  margin-bottom: 14px;
  color: var(--text-1);
}

.empty-tip {
  padding: 40px 20px;
  font-size: 14px;
  color: var(--text-3);
  background: var(--card-bg-2);
  border: 1.5px dashed var(--border-2);
  border-radius: var(--r);
}

.r-grid {
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 14px;
}

/* 单个评语卡片：童趣粉调 */
.r-card {
  padding: 16px;
  background: linear-gradient(180deg, #fff 0%, var(--card-bg-2) 100%);
  border: 1px solid var(--border);
  border-radius: var(--r);
  box-shadow: var(--shadow-sm);
  transition: box-shadow var(--t-fast) var(--ease), transform var(--t-fast) var(--ease);
  position: relative;
  overflow: hidden;
}
.r-card::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 4px;
  background: linear-gradient(90deg, #ff9ec7, #ffd29e 50%, #a8c7ff);
}
.r-card:hover {
  box-shadow: var(--shadow);
  transform: translateY(-2px);
}

.r-head {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
  padding-bottom: 10px;
  margin-bottom: 10px;
  border-bottom: 1px dashed var(--border);
}
.r-no {
  display: inline-grid;
  place-items: center;
  width: 26px;
  height: 26px;
  flex-shrink: 0;
  font-size: 12.5px;
  font-weight: 700;
  color: #fff;
  background: linear-gradient(135deg, #ff9ec7, #ff7a9e);
  border-radius: 50%;
}
.r-name {
  font-size: 15px;
  font-weight: 700;
  color: var(--text-1);
}
.r-head .btn-mini {
  margin-left: auto;
  padding: 5px 12px;
  font-size: 12px;
}

.r-text {
  width: 100%;
  min-height: 160px;
  padding: 10px 12px;
  font-size: 13.5px;
  line-height: 1.85;
  resize: vertical;
  background: var(--card-bg-2);
  border: 1.5px solid var(--border);
  border-radius: var(--r-sm);
  outline: none;
  transition: border-color var(--t-fast) var(--ease), box-shadow var(--t-fast) var(--ease);
}
.r-text:focus {
  border-color: var(--primary);
  background: #fff;
  box-shadow: 0 0 0 3px rgba(59, 110, 246, 0.12);
}

/* ---------------------------------------------------------------------------
 * 五、小屏微调
 * ------------------------------------------------------------------------- */
@media (max-width: 640px) {
  .wrap { padding: 16px 12px 40px; }
  .hero { padding: 20px 18px; }
  .panel-names, .panel-dims, .panel-settings { padding: 14px; }
  .action-bar { padding: 12px 14px; }
  .toolbar { padding: 10px 12px; }
  .r-grid { grid-template-columns: 1fr; }
  .r-head .btn-mini { margin-left: 0; flex: 1; text-align: center; }
}

/* ---------------------------------------------------------------------------
 * 六、打印：仅打印评语结果卡片
 * ------------------------------------------------------------------------- */
@media print {
  body { background: #fff !important; }
  .hero, .panels, .action-bar, .toolbar, .results-title, .empty-tip { display: none !important; }
  .results { margin: 0; }
  .r-grid { grid-template-columns: repeat(2, 1fr); gap: 10px; }
  .r-card { box-shadow: none; border: 1px solid #ccc; break-inside: avoid; }
  .r-card::before { display: none; }
  .r-head .btn-mini { display: none; }
}
`,
      "tools/kinder-comment/kinder-comment.js": `/**
 * 幼儿园评语生成器
 * ------------------------------------------------------------------
 * 功能：名单管理（localStorage 自动保存）、10 个评语维度勾选、
 *       评语风格切换（温暖鼓励 / 童趣可爱 / 具体细致）、性别适配（男/女/中性）、
 *       一键为每名幼儿随机拼接评语（同分类相邻不重复）、逐条编辑/重生成、
 *       字数统计、复制全部、导出 TXT / Excel / Word。
 * 运行：纯前端、无网络请求，支持 file:// 离线打开；Excel 依赖本地 SheetJS。
 */
(function () {
  "use strict";

  /* ===================== 学段专属配置 ===================== */

  /** @type {string} 工具唯一标识，同时作为 localStorage 键前缀 */
  var SLUG = "kinder-comment";

  /** @type {string} 工具完整中文名（用于提示与导出文件名） */
  var TOOL_TITLE = "幼儿园期末评语生成器";

  /**
   * 性别 → 称呼前缀尾词
   * @type {{boy:string,girl:string,neutral:string}}
   */
  var PREFIX_LABELS = {
    boy: "小男子汉",
    girl: "小公主",
    neutral: "小朋友"
  };

  /**
   * 性别 → 第三人称代词（用于模板 {ta} 占位替换）
   * @type {{boy:string,girl:string,neutral:string}}
   */
  var GENDER_PRONOUN = {
    boy: "他",
    girl: "她",
    neutral: "TA"
  };

  /** localStorage 键名集合 */
  var KEYS = {
    names: SLUG + ":names",
    dims: SLUG + ":dims",
    settings: SLUG + ":settings",
    results: SLUG + ":results"
  };

  /**
   * 内置示例名单（20 个）
   * @type {string[]}
   */
  var SAMPLE_NAMES = [
    "李一诺", "王梓萱", "张沐辰", "陈思妍", "刘奕辰",
    "赵雨桐", "孙若曦", "周子沐", "吴悦心", "郑皓轩",
    "冯佳琪", "蒋宇泽", "沈心怡", "韩沐阳", "杨若琳",
    "朱奕安", "秦语桐", "何子谦", "高艺涵", "林俊熙"
  ];

  /**
   * 评语维度词库：10 个分类，每个分类 10 条不重复短句。
   * 短句中的 {ta} 会被替换为对应性别的代词（他/她/TA），{name} 替换为幼儿姓名。
   * @type {{key:string,name:string,phrases:string[]}[]}
   */
  var CATEGORIES = [
    {
      key: "zaiyuan",
      name: "在园表现",
      phrases: [
        "每天早上你都能甜甜地和老师问好，开开心心地走进幼儿园，是大家心里的小太阳。",
        "这学期你在幼儿园越来越自在，晨间活动、区域游戏里总能看到你认真投入的小身影。",
        "你在园里总能跟上一日活动的节奏，喝水、如厕、午睡都不用老师多操心。",
        "你对幼儿园的一切充满好奇，种植角的小芽芽、自然角的小蜗牛都能让你惊喜半天。",
        "在园里你愿意把自己的发现和心情讲给老师听，老师最喜欢你笑眯眯说话的样子。",
        "你每天都精神饱满地来到幼儿园，积极参加每一项活动，小身体棒棒的。",
        "在集体生活中{ta}越来越懂事，会自己整理小椅子、摆好小杯子，像个能干的小大人。",
        "你对班级越来越有归属感，会自豪地告诉别人「这是我们班」，老师听了心里暖暖的。",
        "一学期下来，{ta}已经熟练适应幼儿园的一日生活节奏，是班级里让人放心的小帮手。",
        "区域活动、户外游戏、集体教学，每一处都能看到{ta}认真又开心的小小身影。"
      ]
    },
    {
      key: "zili",
      name: "生活自理",
      phrases: [
        "你已经学会自己穿脱外套和鞋子，午睡起床后还会努力把小被子叠得整整齐齐。",
        "饭前便后你能主动用七步洗手法把小手洗干净，是个讲卫生的好宝贝。",
        "吃饭时你能握住小勺子自己吃完一份饭菜，不挑食、不撒饭，进步特别大。",
        "你会自己端水杯接水喝、主动如厕，还能把小毛巾挂回自己的小格子里。",
        "离园时{ta}总能记着整理小书包，拉链、水杯、换洗衣物一样都不落。",
        "午睡时你能自己盖好小被子安静入睡，起床后还会努力穿上小鞋袜。",
        "你学会了根据冷热穿脱马甲，身体不舒服时也会勇敢地告诉老师。",
        "这学期{ta}的小手越来越能干，剥鸡蛋、擦桌子、收玩具，样样都愿意试一试。",
        "洗手、如厕、喝水、用餐，{ta}都能独立完成，自理能力有了大大的进步。",
        "你会主动收拾自己的小柜子，把换洗衣物叠好放进小袋子，井井有条。"
      ]
    },
    {
      key: "huodong",
      name: "活动参与",
      phrases: [
        "户外体育游戏里你总是跑得最欢，钻、爬、跳、平衡样样敢尝试，动作越来越协调。",
        "区域游戏时{ta}专注又投入，建构区里搭出的城堡和大桥充满奇思妙想。",
        "早操和律动中你跟着音乐又唱又跳，小胳膊小腿特别有节奏感。",
        "集体教学活动中你愿意举手回应老师的问题，答错了也不怕，勇气可嘉。",
        "角色游戏里你把娃娃家的爸爸妈妈演得有模有样，会喂娃娃吃饭、哄娃娃睡觉。",
        "每次户外活动{ta}都能听清规则再开始，收器材时还总是抢着帮忙。",
        "你敢于挑战有点难度的运动器械，从不敢到敢尝试，老师看到了你满满的勇气。",
        "节日活动和亲子运动会上你表现大方，和小伙伴合作完成任务时笑得最灿烂。",
        "集体活动时{ta}坐得端正、听得认真，积极参与每一次讨论和操作。",
        "你喜欢尝试各种新鲜的活动，从美工到建构、从音乐到运动，样样都不缺席。"
      ]
    },
    {
      key: "yuyan",
      name: "语言表达",
      phrases: [
        "你的小嘴巴越来越会表达，能把周末的趣事完整地讲给全班小朋友听。",
        "集体听故事时{ta}最专注，回答问题的句子越来越完整，词汇也越来越丰富。",
        "你喜欢念儿歌、背古诗，吐字清楚、声音响亮，当小老师带读时有模有样。",
        "遇到矛盾时{ta}开始学着用「我不喜欢这样」「请你还给我」等小句子表达自己，而不是哭闹。",
        "绘本阅读后你能用自己的话复述故事，还会给小动物加上有趣的新结局。",
        "你愿意在集体面前大胆表演，讲故事、念儿歌时自然又自信，小朋友都为你鼓掌。",
        "这学期{ta}从不敢发言到主动举手，每一次开口都是大大的进步，老师为你骄傲。",
        "你能认真倾听同伴说话不插嘴，等别人讲完再表达，是个有礼貌的小听众。",
        "{ta}能用完整的句子描述自己的发现和心情，词汇越来越丰富，表达越来越自信。",
        "你喜欢和老师分享周末的小故事，逻辑越来越清晰，用词越来越生动。"
      ]
    },
    {
      key: "tongban",
      name: "同伴交往",
      phrases: [
        "你是小朋友们都喜欢的好伙伴，会主动把玩具分给大家，和谁都能玩到一起。",
        "游戏中{ta}学会了等待、轮流和商量，「我们一起玩好吗」常挂在{ta}的嘴边。",
        "看到同伴遇到困难，你会主动上前帮忙，还会用小手轻轻拍拍对方的背安慰对方。",
        "和小伙伴发生小摩擦时，你能听老师的话学着原谅对方，两个人又拉起了小手。",
        "你喜欢邀请好朋友一起合作搭建、一起看绘本，分享让你的快乐变成了双份。",
        "你尊重每一个小伙伴，游戏时愿意迁就别人的想法，大家都愿意和你交朋友。",
        "新朋友加入时，{ta}会大方地拉人家一起玩，带着新朋友熟悉班级，是热心的小主人。",
        "你会用拥抱、牵手表达对小伙伴的喜欢，班级里因为有你多了许多温暖的小瞬间。",
        "{ta}懂得分享与合作，是小组里最受欢迎的小搭档，大家都争着和{ta}一组。",
        "你愿意把自己的玩具和绘本带到幼儿园与小伙伴分享，慷慨又大方。"
      ]
    },
    {
      key: "xiguan",
      name: "习惯与规则",
      phrases: [
        "集体活动中你能坐好小椅子、安静倾听，举手得到老师允许后再发言。",
        "上下楼梯你能扶好栏杆慢慢走，排队时总跟前面的小伙伴保持安全距离。",
        "区域活动结束的音乐一响，{ta}就能快速把玩具分类送回它们的家。",
        "你能记住班级的小约定：轻声说话、慢步走路，是守规则的小榜样。",
        "喝水、如厕、取餐时{ta}都会自觉排队，不争不抢，还会提醒小伙伴遵守秩序。",
        "你爱惜绘本和玩具，轻轻翻书、轻拿轻放，发现损坏还会告诉老师一起修补。",
        "这学期{ta}的规则意识越来越强，知道什么时间做什么事，集体生活适应得很棒。",
        "离园前你会主动把小椅子推回桌下、检查自己的物品，好习惯正在一点点养成。",
        "{ta}能自觉遵守班级约定，午睡、用餐、活动转换都井然有序。",
        "你愿意主动维护班级的小秩序，会提醒同伴收拾玩具、关好水龙头。"
      ]
    },
    {
      key: "xingge",
      name: "性格表现",
      phrases: [
        "你是个开朗热情的小宝贝，笑声像银铃一样，走到哪里就把快乐带到哪里。",
        "你做事专注有耐心，拼图、串珠再难也不轻易放弃，坚持到底的样子特别可爱。",
        "你细心又体贴，发现老师咳嗽会轻轻拍背，看到小伙伴难过会递上小纸巾。",
        "你是个敢想敢做的小小探索家，总有问不完的为什么，小脑袋里装满奇思妙想。",
        "你温和谦让，遇到争抢总愿意先退一步，懂事得让老师心疼又喜欢。",
        "你勇敢又独立，跌倒了会自己爬起来拍拍土说「我不哭」，是个坚强的小勇士。",
        "你做事认真负责，当小小值日生时擦桌、摆碗一丝不苟，是老师得力的小帮手。",
        "你内心细腻柔软，能感受到故事里小动物的心情，善良的小种子正在你心里发芽。",
        "{ta}自信又大方，敢于在全班小朋友面前表达自己的想法，是个闪闪发光的小宝贝。",
        "你内心温暖又敏感，懂得关心别人的情绪，是个让人暖到心底的小天使。"
      ]
    },
    {
      key: "dongshou",
      name: "动手与艺术",
      phrases: [
        "你的小手真灵巧，撕纸、粘贴、团泥样样在行，作品常常被贴在展示墙上。",
        "画画时你用色大胆、想象丰富，会给太阳画上绿胡子，每个故事都藏在你的画里。",
        "手工活动中{ta}能沿线撕贴、正确使用安全剪刀，小手肌肉越来越灵活。",
        "唱歌时你音调准、表情甜，演奏打击乐时还能跟上节拍，是表演区的小明星。",
        "泥工活动里{ta}会搓圆、压扁、捏造型，小面团在{ta}手里变成了小兔和小蛋糕。",
        "你喜欢随音乐自由舞蹈，动作创编大胆可爱，每次表演都充满自信。",
        "建构区里{ta}会和小伙伴合作架空、围合，搭出的幼儿园结构越来越复杂。",
        "你敢于尝试各种美术材料，水彩、拓印、手指画都玩得津津有味，享受创作的快乐。",
        "你的画作色彩明亮、想象力丰富，每一幅都像装着一个童话小世界。",
        "{ta}能在音乐律动中感受节奏、大胆表现，每次艺术活动都乐在其中。"
      ]
    },
    {
      key: "jianyi",
      name: "温馨建议",
      phrases: [
        "假期里也请坚持规律作息，早睡早起多运动，让{ta}的小身体继续棒棒的。",
        "在家可以多让宝贝做些力所能及的小事，穿脱衣物、收拾玩具都是成长的练习。",
        "吃饭时鼓励{ta}自己动手，少看电子产品、细嚼慢咽，营养均衡才能长高高。",
        "希望爸爸妈妈多陪{ta}读绘本、讲故事，每天十五分钟的亲子阅读时光最珍贵。",
        "多带{ta}到大自然中走走看看，一片落叶、一只蚂蚁都是最好的启蒙老师。",
        "鼓励{ta}用语言说出需求和情绪，家人耐心倾听，小嘴巴就会越来越能干。",
        "请坚持送{ta}按时入园，多与老师聊聊家里的小故事，家园携手陪伴成长。",
        "假期里请注意交通、玩水和居家安全，把安全的小种子种进{ta}心里。",
        "建议假期继续保持幼儿园的作息节奏，让{ta}的小习惯不放假、不退步。",
        "多和{ta}聊聊幼儿园的趣事，倾听{ta}的小烦恼，亲子沟通让爱更顺畅。"
      ]
    },
    {
      key: "jiyu",
      name: "成长寄语",
      phrases: [
        "愿你像一株小苗苗，在阳光和爱里继续悄悄拔节生长。",
        "老师会一直在这里，等着看你长成更勇敢、更能干的模样。",
        "新的一岁，愿你的小口袋里装满好奇，小脚步走得更加坚定。",
        "愿你永远保有这份亮晶晶的好奇心，把平凡的日子过成有趣的故事。",
        "老师相信，升入新班级的你一定会更自信、更独立，收获更多好朋友。",
        "愿你的笑容永远这样甜，遇到困难时记得，老师和爸爸妈妈永远是你最稳的依靠。",
        "新的旅程就在前方，愿你带着善良和勇敢，继续做闪闪发光的自己。",
        "老师会把和你在一起的点点滴滴小心珍藏，也祝你在新学期收获满满。",
        "愿{ta}像小树苗一样，在阳光雨露中扎根生长，长成自己最喜欢的模样。",
        "新学期，新旅程，愿{ta}带着这份勇敢与好奇，继续向快乐出发。"
      ]
    }
  ];

  /**
   * 风格专属开场白：3 种风格，每种 3 条。
   * {name} 会替换为幼儿姓名，{ta} 会替换为对应性别代词。
   * @type {{warm:string[],cute:string[],detailed:string[]}}
   */
  var OPENINGS = {
    warm: [
      "这个学期，老师看到了{name}小朋友好多好多的进步——",
      "{name}宝贝这一学期的小脚印踩得又稳又暖，",
      "回想起这个学期，{name}给老师留下了好多温暖的瞬间："
    ],
    cute: [
      "嘘——老师偷偷告诉你，{name}小宝贝这个学期超棒的哟！",
      "哒哒哒～{name}小朋友的小学期结束啦，老师先给你鼓鼓掌！",
      "叮咚！{name}小朋友的本学期成长报告新鲜出炉啦——"
    ],
    detailed: [
      "本学期{ta}在幼儿园的整体表现总结如下：",
      "回顾本学期，{ta}在以下几方面均有明显进步：",
      "本学期{ta}在园期间的成长情况记录如下："
    ]
  };

  /**
   * 风格专属结尾寄语：3 种风格，每种 4 条。
   * @type {{warm:string[],cute:string[],detailed:string[]}}
   */
  var ENDINGS = {
    warm: [
      "宝贝，老师永远爱你，新学期我们继续一起加油哟！",
      "愿你被这个世界温柔以待，健康快乐地长大，老师为你加油！",
      "亲爱的宝贝，慢慢来、别着急，你已经做得很棒很棒啦！",
      "新学期老师会继续牵着你的小手，一起去看更多的美好风景。"
    ],
    cute: [
      "哒哒哒～新学期的脚步来啦，{name}小可爱准备好继续闪闪发光了吗？",
      "老师给你一个大大的熊抱，愿你天天都有甜甜的好心情！",
      "叮咚——你有一份新学期的快乐待查收，老师和你一起打开它哟！",
      "比心心～愿你继续做班里最快乐的小太阳，把笑容洒满每一天！"
    ],
    detailed: [
      "新学期建议家长继续陪伴{ta}坚持早睡早起、独立穿脱衣物，并在阅读与表达上多给予鼓励。",
      "希望假期中能继续保持幼儿园的好习惯，每天安排 20 分钟亲子阅读、30 分钟户外运动。",
      "建议新学期在家也鼓励{ta}自己整理玩具、主动表达需求，遇到困难先尝试再求助。",
      "下学期可重点关注{ta}的同伴合作与情绪表达，多创造与小伙伴互动的机会。"
    ]
  };

  /* ===================== DOM 与运行时状态 ===================== */

  /**
   * 按 id 获取元素
   * @param {string} id 元素 id
   * @returns {HTMLElement} 对应 DOM 元素
   */
  function $(id) { return document.getElementById(id); }

  /** 常用元素缓存 */
  var els = {
    nameInput: $("nameInput"),
    btnSample: $("btnSample"),
    btnClear: $("btnClear"),
    dimChips: $("dimChips"),
    btnDimAll: $("btnDimAll"),
    btnDimNone: $("btnDimNone"),
    genderGroup: $("genderGroup"),
    styleGroup: $("styleGroup"),
    chkPrefix: $("chkPrefix"),
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
   * @type {{prefix:boolean,gender:string,style:string}}
   */
  var settings = { prefix: true, gender: "neutral", style: "warm" };

  /** @type {{name:string,text:string,picks:Object}[]} 已生成的评语结果 */
  var results = [];

  /** toast 定时器句柄 */
  var toastTimer = null;

  /* ===================== 本地存储 ===================== */

  /**
   * 安全写入 localStorage（file:// 或隐私模式下可能不可用）
   * @param {string} key 键名
   * @param {string} value 字符串值
   */
  function storageSet(key, value) {
    try { localStorage.setItem(key, value); } catch (e) { /* 忽略存储异常 */ }
  }

  /**
   * 安全读取 localStorage
   * @param {string} key 键名
   * @returns {string|null} 读到的字符串，不存在或异常时为 null
   */
  function storageGet(key) {
    try { return localStorage.getItem(key); } catch (e) { return null; }
  }

  /** 持久化当前名单 */
  function saveNames() { storageSet(KEYS.names, els.nameInput.value); }

  /** 持久化勾选的维度 key 数组 */
  function saveDims() {
    var keys = CATEGORIES.filter(function (c) { return selected[c.key]; }).map(function (c) { return c.key; });
    storageSet(KEYS.dims, JSON.stringify(keys));
  }

  /** 持久化生成设置 */
  function saveSettings() { storageSet(KEYS.settings, JSON.stringify(settings)); }

  /** 持久化生成结果 */
  function saveResults() { storageSet(KEYS.results, JSON.stringify(results)); }

  /* ===================== 名单与维度 ===================== */

  /**
   * 解析名单文本：按行拆分、去空白、去空行、最多保留 100 人
   * @returns {string[]} 姓名数组
   */
  function parseNames() {
    return els.nameInput.value
      .split(/\\r?\\n/)
      .map(function (s) { return s.trim(); })
      .filter(function (s) { return s.length > 0; })
      .slice(0, 100);
  }

  /**
   * 渲染维度 chip 标签
   */
  function renderChips() {
    els.dimChips.innerHTML = CATEGORIES.map(function (c) {
      var on = !!selected[c.key];
      return '<button type="button" class="chip" aria-pressed="' + on + '" data-key="' + c.key + '">' + c.name + "<\/button>";
    }).join("");
  }

  /**
   * 批量设置全部维度的勾选状态并重绘
   * @param {boolean} on 是否全部选中
   */
  function setAllDims(on) {
    CATEGORIES.forEach(function (c) { selected[c.key] = on; });
    renderChips();
    saveDims();
  }

  /* ===================== 模板替换 ===================== */

  /**
   * 将模板中的 {name} 与 {ta} 替换为对应内容
   * @param {string} tpl 原始模板
   * @param {string} name 学生姓名
   * @returns {string} 替换后的文本
   */
  function fillTemplate(tpl, name) {
    var pronoun = GENDER_PRONOUN[settings.gender] || GENDER_PRONOUN.neutral;
    return tpl.replace(/\\{name\\}/g, name).replace(/\\{ta\\}/g, pronoun);
  }

  /* ===================== 评语生成 ===================== */

  /**
   * 从候选短句中随机抽取一条，自动避开禁用内容
   * @param {string[]} pool 候选短句数组
   * @param {string[]} forbidden 需要避开的短句（如相邻学生已抽到的）
   * @returns {string} 抽中的短句
   */
  function pickPhrase(pool, forbidden) {
    var avail = pool.filter(function (p) { return forbidden.indexOf(p) === -1; });
    if (!avail.length) avail = pool; // 极端情况下兜底
    return avail[Math.floor(Math.random() * avail.length)];
  }

  /**
   * 为一名学生拼接完整评语：前缀 + 风格开场白 + 各维度短句 + 风格结尾寄语
   * @param {string} name 学生姓名
   * @param {Object[]} avoidPicks 需要避开的抽取记录（相邻学生、本人旧记录）
   * @returns {{name:string,text:string,picks:Object}} 一条评语结果
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
      parts.push(fillTemplate(phrase, name));
    });

    // 风格开场白
    var openingPool = OPENINGS[settings.style] || OPENINGS.warm;
    var opening = fillTemplate(pickPhrase(openingPool, []), name);

    // 风格结尾寄语
    var endingPool = ENDINGS[settings.style] || ENDINGS.warm;
    var ending = fillTemplate(pickPhrase(endingPool, []), name);

    // 称呼前缀（按性别选择尾词：小朋友 / 小男子汉 / 小公主）
    var label = PREFIX_LABELS[settings.gender] || PREFIX_LABELS.neutral;
    var prefix = settings.prefix ? name + label + "：" : "";

    return {
      name: name,
      text: prefix + opening + parts.join("") + ending,
      picks: picks
    };
  }

  /**
   * 一键为名单中的全部学生生成评语
   */
  function generateAll() {
    var rawLines = els.nameInput.value.split(/\\r?\\n/);
    var overLimit = rawLines.map(function (s) { return s.trim(); }).filter(Boolean).length > 100;
    var names = parseNames();
    if (!names.length) { toast("请先填写学生名单"); return; }
    if (overLimit) toast("名单超过 100 人，已仅取前 100 人生成");

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
    toast("已为 " + names.length + " 名小朋友生成评语");
    els.resultWrap.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  /**
   * 单独重新生成某一张卡片（避开本人旧内容与前后相邻学生）
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
   * 转义 HTML 特殊字符，防止姓名等内容破坏结构
   * @param {string} s 原始字符串
   * @returns {string} 转义后的字符串
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
   * 轻提示
   * @param {string} msg 提示文案
   */
  function toast(msg) {
    els.toast.textContent = msg;
    els.toast.classList.add("show");
    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { els.toast.classList.remove("show"); }, 2200);
  }

  /**
   * 复制文本到剪贴板，优先用 Clipboard API，失败则回退 execCommand
   * @param {string} text 待复制文本
   * @returns {Promise<void>} 复制成功 resolve，失败 reject
   */
  function copyToClipboard(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      return navigator.clipboard.writeText(text).catch(function () { return legacyCopy(text); });
    }
    return legacyCopy(text);
  }

  /**
   * 旧式复制方案（兼容 file:// 与非安全上下文）
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
   * @param {string} filename 文件名
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
   * 复制全部评语：姓名 + Tab + 评语，可直接粘贴进 Excel
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
   * 导出 TXT（带 BOM，记事本不乱码）
   */
  function exportTxt() {
    if (!results.length) { toast("请先生成评语"); return; }
    var body = results.map(function (r, i) {
      return (i + 1) + ". " + r.name + "\\r\\n" + r.text;
    }).join("\\r\\n\\r\\n");
    var blob = new Blob(["" + body], { type: "text/plain;charset=utf-8" });
    download(TOOL_TITLE + ".txt", blob);
    toast("TXT 文件已开始下载");
  }

  /**
   * 导出 Excel：姓名 / 评语两列，列宽适配（依赖本地 SheetJS 全局 XLSX）
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
   * 导出 Word：HTML 文档 + application/msword Blob，中文段落用 <p>
   * 不依赖外部库，直接生成 HTML 转 .doc
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
    var blob = new Blob(["", doc], { type: "application/msword" });
    download(TOOL_TITLE + ".doc", blob);
    toast("Word 文件已开始下载");
  }

  /* ===================== 事件绑定 ===================== */

  /**
   * 绑定全部页面交互事件
   */
  function bindEvents() {
    // 名单输入：自动保存
    els.nameInput.addEventListener("input", saveNames);

    // 示例名单 / 清空
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

    // 维度 chip：事件委托切换勾选
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

    // 性别切换
    Array.prototype.forEach.call(els.genderGroup.querySelectorAll('input[name="gender"]'), function (radio) {
      radio.addEventListener("change", function () {
        settings.gender = radio.value;
        saveSettings();
      });
    });

    // 评语风格切换
    Array.prototype.forEach.call(els.styleGroup.querySelectorAll('input[name="style"]'), function (radio) {
      radio.addEventListener("change", function () {
        settings.style = radio.value;
        saveSettings();
      });
    });

    // 称呼前缀开关
    els.chkPrefix.addEventListener("change", function () {
      settings.prefix = els.chkPrefix.checked;
      saveSettings();
    });

    // 生成
    els.btnGenerate.addEventListener("click", generateAll);

    // 导出
    els.btnCopy.addEventListener("click", exportCopy);
    els.btnTxt.addEventListener("click", exportTxt);
    els.btnExcel.addEventListener("click", exportExcel);
    els.btnWord.addEventListener("click", exportWord);

    // 结果区：单条重生成 + 手动编辑同步状态
    els.resultWrap.addEventListener("click", function (e) {
      var btn = e.target.closest ? e.target.closest("[data-regen]") : null;
      if (!btn) return;
      regenerateOne(parseInt(btn.getAttribute("data-regen"), 10));
    });
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
        if (obj.gender && PREFIX_LABELS[obj.gender]) settings.gender = obj.gender;
        if (obj.style && OPENINGS[obj.style]) settings.style = obj.style;
      } catch (e) { /* 解析失败保持默认 */ }
    }
    els.chkPrefix.checked = settings.prefix;
    Array.prototype.forEach.call(els.genderGroup.querySelectorAll('input[name="gender"]'), function (radio) {
      radio.checked = radio.value === settings.gender;
    });
    Array.prototype.forEach.call(els.styleGroup.querySelectorAll('input[name="style"]'), function (radio) {
      radio.checked = radio.value === settings.style;
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
    meta: {builtAt: "2026-09-28 11:07:05", sources: {"tools/kinder-comment/kinder-comment.css": "705ca343cba9", "assets/css/tool-common.css": "d35dcf222690", "assets/js/frame-bridge.js": "1131903c1e46", "tools/kinder-comment/kinder-comment.js": "bc5b4ba2a61c"}}
  };
})();