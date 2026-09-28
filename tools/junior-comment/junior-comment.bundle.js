/* 自动生成，请勿手改 —— 源：tools/junior-comment/  ·  构建：2026-09-28 11:07:05 */
/* 用途：file:// 离线场景下 fetch 被 CORS 拦截，站点改用 <script src> 加载本文件，
   拿到工具页面与本地 CSS/JS 文本后走与 http 相同的 Shadow DOM 组件化挂载。
   工具源码改动后请重跑：python .workbuddy/scripts/build_tool_bundles.py */
(function(){
  var g = window.EduToolboxToolBundles || (window.EduToolboxToolBundles = {});
  g["junior-comment"] = {
    html: `<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>初中评语生成 | EduToolbox · 初中阶段评语<\/title>
<link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ctext y='.9em' font-size='90'%3E%F0%9F%8D%93%3C/text%3E%3C/svg%3E">
<link rel="stylesheet" href="junior-comment.css">
<link rel="stylesheet" href="../../assets/css/tool-common.css">
<\/head>
<body>

  <div class="wrap">
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
            <span class="setting-label">称呼前缀<\/span>
            <label class="switch-wrap">
              <span class="switch-desc">显示「XXX同学：」前缀<\/span>
              <span class="switch"><input type="checkbox" id="chkPrefix" checked><span class="slider"><\/span><\/span>
            <\/label>
          <\/div>
          <div class="setting-item">
            <span class="setting-label">学生性别<\/span>
            <div class="seg-group" id="genderGroup">
              <label class="seg"><input type="radio" name="gender" value="any" checked><span>👤 不限<\/span><\/label>
              <label class="seg"><input type="radio" name="gender" value="male"><span>👦 男生<\/span><\/label>
              <label class="seg"><input type="radio" name="gender" value="female"><span>👧 女生<\/span><\/label>
            <\/div>
          <\/div>
          <div class="setting-item setting-item--full">
            <span class="setting-label">评语风格<\/span>
            <div class="seg-group" id="styleGroup">
              <label class="seg"><input type="radio" name="style" value="objective" checked><span>📐 客观严谨<\/span><\/label>
              <label class="seg"><input type="radio" name="style" value="encourage"><span>💪 鼓励激励<\/span><\/label>
              <label class="seg"><input type="radio" name="style" value="detailed"><span>🔍 具体细致<\/span><\/label>
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

  <\/div>
  <div class="toast" id="toast"><\/div>
  <script src="../../assets/js/frame-bridge.js"><\/script>
<script src="../../assets/vendor/xlsx.full.min.js"><\/script>
  <script src="junior-comment.js"><\/script>
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
      "tools/junior-comment/junior-comment.css": `/* ============================================================================
 * 初中评语生成 · junior-comment.css
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

/* 标题区变体：默认蓝色渐变 hdr 已由公共底座提供，此处微调间距 */
.hdr {
  margin-bottom: 22px;
  padding: 24px 28px;
}
.hdr-text h1 { margin-bottom: 6px; }
.hdr-text p { max-width: none; }

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

.panel-head {
  margin-bottom: 10px;
}
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

/* 维度标签云：自动换行 */
.chips {
  gap: 8px;
}
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
.setting-item .switch-wrap {
  justify-content: flex-start;
}
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

/* 导出工具栏：覆盖公共 .toolbar 的 space-between 与 padding */
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

/* 单个评语卡片 */
.r-card {
  padding: 16px;
  background: var(--card-bg);
  border: 1px solid var(--border);
  border-radius: var(--r);
  box-shadow: var(--shadow-sm);
  transition: box-shadow var(--t-fast) var(--ease), transform var(--t-fast) var(--ease);
}
.r-card:hover {
  box-shadow: var(--shadow);
  transform: translateY(-1px);
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
  background: var(--primary-grad);
  border-radius: 50%;
}
.r-name {
  font-size: 15px;
  font-weight: 700;
  color: var(--text-1);
}
.r-gender {
  font-size: 12.5px;
  color: var(--text-3);
}
.r-head .btn-mini {
  margin-left: auto;
  padding: 5px 12px;
  font-size: 12px;
}

.r-text {
  width: 100%;
  min-height: 140px;
  padding: 10px 12px;
  font-size: 13.5px;
  line-height: 1.8;
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
  .hdr { padding: 18px 18px; }
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
  .hdr, .panels, .action-bar, .toolbar, .results-title, .empty-tip { display: none !important; }
  .results { margin: 0; }
  .r-grid { grid-template-columns: repeat(2, 1fr); gap: 10px; }
  .r-card { box-shadow: none; border: 1px solid #ccc; break-inside: avoid; }
  .r-head .btn-mini { display: none; }
}
`,
      "tools/junior-comment/junior-comment.js": `/**
 * 初中评语生成器
 * ------------------------------------------------------------------
 * 功能：名单管理（localStorage 自动保存）、10 个评语维度勾选、
 *       评语风格切换（客观严谨/鼓励激励/具体细致）、性别选择、
 *       一键为每名学生随机拼接不雷同评语（同分类相邻不重复）、
 *       逐条编辑/重生成、字数统计、复制全部、导出 TXT / Excel / Word。
 * 运行：纯前端 IIFE 模块、无网络请求，支持 file:// 离线打开；
 *       Excel 依赖本地 SheetJS（xlsx.full.min.js）。
 * 作者：EduToolbox
 * ------------------------------------------------------------------ */
(function () {
  "use strict";

  /* ===================== 学段专属配置 ===================== */

  /** @type {string} 工具唯一标识，同时作为 localStorage 键前缀 */
  var SLUG = "junior-comment";

  /** @type {string} 工具完整中文名（用于提示与导出文件名） */
  var TOOL_TITLE = "初中评语生成";

  /** @type {string} 前缀称呼，初中使用「同学」 */
  var PREFIX_LABEL = "同学";

  /** localStorage 键名集合 */
  var KEYS = {
    names: SLUG + ":names",
    dims: SLUG + ":dims",
    settings: SLUG + ":settings",
    results: SLUG + ":results"
  };

  /**
   * 内置示例名单（20 个，贴合初中班级常见姓名）
   * @type {string[]}
   */
  var SAMPLE_NAMES = [
    "陈思远", "赵子涵", "林语桐", "周沐阳", "吴欣怡",
    "孙浩然", "郑雨彤", "何嘉宁", "高梓轩", "梁书瑶",
    "谢晨曦", "彭子墨", "郭可欣", "邓一诺", "罗俊熙",
    "蒋诗涵", "韩宇航", "曹安琪", "许文博", "苏若彤"
  ];

  /**
   * 评语维度词库：10 个分类，每分类 10 条贴合初中学业与青春期成长的短句
   * 维度顺序参考 classtool.cn/junior-comment 原版与初中评价实际场景
   * @type {{key:string,name:string,phrases:string[]}[]}
   */
  var CATEGORIES = [
    {
      key: "xueke",
      name: "学科表现",
      phrases: [
        "你的语文学科素养扎实，阅读理解细腻深刻，作文有思想、有文采，常被当作范文。",
        "你数学思维敏捷，几何证明逻辑严密，综合题中常能找到巧妙的突破口。",
        "你的英语听说读写全面发展，语音语调标准，课外阅读量为你积累了明显优势。",
        "你理科综合表现突出，物理现象、化学变化都爱追问本质，实验操作规范严谨。",
        "你文科积累丰厚，史地政知识融会贯通，答题时视野开阔、论据充分。",
        "你生物学、地理的学习方法得当，图文结合、概念清晰，学考复习从容自信。",
        "你各科发展均衡且有优势学科引领，文理兼修的知识结构为后续学习打下好底子。",
        "面对难度陡增的初中课程，你能及时调整学法，薄弱环节在这学期已有明显起色。",
        "你的物理实验报告书写规范、数据分析准确，展现了良好的科学素养。",
        "你的数学压轴题思路开阔，能用多种方法求解，思维品质在同龄人中十分突出。"
      ]
    },
    {
      key: "siwei",
      name: "思维方法",
      phrases: [
        "你善于归纳总结，能把零散的知识点织成网络，体现了良好的系统化思维。",
        "你解题注重思路而非套路，会一题多解、多题归一，知识迁移能力突出。",
        "你具备较强的批判性思维，不轻信答案，习惯用证据和逻辑检验结论。",
        "你能对错题进行深度归因，区分知识漏洞与方法缺陷，反思精准而高效。",
        "你善于把复杂问题拆解成小步骤，条理清晰，难题在你面前层层瓦解。",
        "你能在学科之间建立联系，用数学的方法看物理、用历史的眼光读文学，视野开阔。",
        "你注重监控自己的理解程度，不懂就标记追问，绝不囫囵吞枣。",
        "你的逆向思维和发散思维常有亮点，开放性试题的答案新颖而不失严谨。",
        "你的课堂提问常能切中知识本质，引发同学深入思考，问题意识令人欣赏。",
        "你善于用图表、思维导图整理知识结构，复杂概念在你的笔下变得清晰直观。"
      ]
    },
    {
      key: "taidu",
      name: "学习态度",
      phrases: [
        "你目标明确、态度端正，能以自律应对初中骤增的学习任务，内驱力令人欣赏。",
        "你勤奋踏实，早读、自习始终保持专注，点滴坚持正在悄悄拉开差距。",
        "你能正视成绩波动，归因理性、不骄不馁，展现了超越年龄的成熟心态。",
        "你对薄弱学科不逃避、不放弃，主动查漏补缺，这份迎难而上的韧劲最为可贵。",
        "你学习计划性强，能按周梳理任务、按时复盘，自我管理能力在同龄人中十分突出。",
        "你求知欲旺盛，不满足于课本答案，常带着问题与老师深入探讨。",
        "你对待每一次测验都严谨认真，把考场当作检验、把错题当作资源，成长迅速。",
        "你逐渐明白学习是自己的事，由要我学到我要学的转变尤为可喜。",
        "你的课堂笔记细致工整，重难点标记清晰，复习时效率极高。",
        "你能在长时间学习中保持稳定专注，不浮躁、不焦虑，这份静气是难得的学习品质。"
      ]
    },
    {
      key: "canyu",
      name: "课堂参与",
      phrases: [
        "课堂上你专注投入、思维在线，眼神和回应让老师感受到高质量的师生共振。",
        "你发言质量高，不满足于说答案，更能讲清思路、点明方法，颇有小老师风范。",
        "你敢于在课堂上提出质疑和不同解法，思辨的火花常常让一节课更加精彩。",
        "小组合作探究中你是核心力量，能组织讨论、整合意见、代表小组清晰汇报。",
        "你的听课笔记详略得当，用不同颜色标注重点疑点，复习时一目了然。",
        "你能迅速适应不同教师的授课风格，主动调整节奏，课堂吸收率高。",
        "你在实验课、实践课上动手能力强，操作规范、观察细致、结论严谨。",
        "这学期你课堂参与的主动性显著增强，从默默倾听到乐于表达，进步有目共睹。",
        "你能把课外阅读与课堂内容相互印证，发言时常带新意，为同学打开新视角。",
        "你回答问题时思路清晰、语言精炼，能把复杂概念讲得让同学都听明白。"
      ]
    },
    {
      key: "zeren",
      name: "集体责任",
      phrases: [
        "作为班干部，你敢管善管、以身作则，是连接老师和同学之间可靠的桥梁。",
        "你集体荣誉感强，运动会、合唱节、文明评比中总愿为班级拼尽全力。",
        "你值日和大扫除从不偷懒，脏活累活抢在前，用行动诠释了责任二字。",
        "你能公平公正地处理班级事务，不徇私情，赢得了同学们的信任和尊重。",
        "班级遇到困难时你主动补位，同学请假、老师不在时都能看到你担当的身影。",
        "你积极参与志愿服务和社区实践，把班级里的责任感延伸到了更广阔的社会。",
        "你组织活动考虑周全，从方案、分工到应急处理井井有条，领导才能初显。",
        "你爱护集体财物、节约水电资源，公共意识和主人翁精神在细节中闪光。",
        "班级文化墙、板报设计中你积极献策出力，为集体营造了温暖向上的氛围。",
        "面对班级评比中的失误你能坦然总结、不推卸，这份担当令老师动容。"
      ]
    },
    {
      key: "pinde",
      name: "品德修养",
      phrases: [
        "你诚实守信、言行一致，答应的事必全力以赴，诚信是你最闪亮的名片。",
        "你尊重师长、礼让同学，日常问候、进出礼节都体现了良好的家教与修养。",
        "你面对诱惑能守住底线，对作弊、欺凌等不良行为敢于说“不”，品格端正。",
        "你心怀感恩，对父母的付出、老师的帮助、同学的善意都记在心里并予回报。",
        "你正直善良，见到同学受委屈会主动伸援手，是班级里温暖的存在。",
        "你面对批评不推责、不抱怨，能诚恳接受并改正，这份虚心难能可贵。",
        "你乐于分享学习资源与方法，不带私心，把同学的进步当作自己的喜悦。",
        "你崇尚公平、不慕虚荣，不被攀比之风裹挟，朴素中透着坚定的价值取向。",
        "你爱护公物、尊重他人劳动，桌椅整齐、地面干净是你默默的坚持。",
        "你拥有同理心，能站在他人角度思考问题，与同学相处时温和而包容。"
      ]
    },
    {
      key: "laodong",
      name: "劳动卫生",
      phrases: [
        "你值日认真负责，黑板、地面、讲台每个角落都一丝不苟，班级卫生有你更安心。",
        "你大扫除冲在前，擦窗、搬桌、清死角都不嫌脏累，是班级劳动的中坚力量。",
        "你桌面整理井井有条，书本、文具分类摆放，整洁的环境也提升了你的学习效率。",
        "你主动维护教室环境，看到纸屑随手捡起、看到桌椅歪斜主动摆正，细节见修养。",
        "你劳动效率高，能在短时间内高质量完成值日任务，方法与态度都值得学习。",
        "你在劳动中不挑活、不攀比，分配什么就认真做什么，朴实态度令人欣赏。",
        "你关心学校公共空间，走廊、楼梯、操场见到杂乱都会主动整理，主人翁意识强。",
        "你重视个人卫生，校服整洁、仪容规范，展现了初中生应有的精神面貌。",
        "你能带领小组成员协同完成劳动任务，分工清晰、调度合理，组织能力出众。",
        "你珍爱劳动成果，能主动劝阻破坏环境的行为，是班级文明的小卫士。"
      ]
    },
    {
      key: "jiaowang",
      name: "人际交往",
      phrases: [
        "你待人真诚、重情重义，在同学中威信很高，是大家愿意追随的核心伙伴。",
        "你善于沟通表达，能把不同意见说得让人接受，化解同学矛盾时成熟而有分寸。",
        "你尊重老师、体谅父母，青春期里仍能与师长保持顺畅交流，十分难得。",
        "你乐于分享学习方法和笔记资料，带领学习小组共同进步，格局令人欣赏。",
        "你能理性看待同学间的竞争，把对手当朋友、把压力变动力，心态阳光。",
        "你重承诺、守边界，不传播流言、不参与小团体，是班级正气的守护者。",
        "你关心性格内向和暂时落后的同学，主动接纳、耐心帮助，温暖而有力量。",
        "你在合作中既能坚持主见又能接纳建议，团队协作意识与能力都很出色。",
        "你的笑容和幽默感总能缓解学习压力，是班级氛围的润滑剂与开心果。",
        "你处理同学分歧时讲理不斗气，能换位思考、寻求共识，情商令人欣赏。"
      ]
    },
    {
      key: "xiguan",
      name: "行为习惯",
      phrases: [
        "你作息规律、惜时如金，能利用好碎片时间，日积月累形成了可观的学习优势。",
        "你自主整理错题和资料，书包、书桌、电子文档井井有条，高效源于这些细节。",
        "你入校即静、入座即学，自修课从不需老师维持纪律，自律已内化为习惯。",
        "你使用电子产品有节制，能自觉抵制游戏和短视频的诱惑，专注力保护得很好。",
        "你礼貌守纪、仪容规范，进出校园、食堂排队都能体现良好的教养。",
        "你答应的事情必定做到，收发作业、值日值班从不用老师操心，信用是你的名片。",
        "你能保持书桌和教室整洁，做事有头有尾、善始善终，细节中见修养。",
        "你养成了提前预习、当堂巩固、限时训练的好习惯，学习后劲十足。",
        "你坚持每天复习当日所学并整理知识框架，长此以往学科理解愈发透彻。",
        "你的时间管理能力突出，能在学业、社团与休息之间找到合理平衡，节奏稳健。"
      ]
    },
    {
      key: "techang",
      name: "特长发展",
      phrases: [
        "你在科技创新、机器人竞赛中崭露头角，钻研精神与动手能力都令人刮目相看。",
        "你体育特长突出，校运会、班级联赛中多次为集体争得荣誉，是大家心中的健将。",
        "你艺术素养出众，绘画、合唱、乐器演奏都展现了独特的审美与才华。",
        "你写作才华横溢，校刊、征文中屡有佳作，文字中透着超越年龄的思考。",
        "你演讲与朗诵能力出色，能在升旗仪式、班会上大方发声，气场不凡。",
        "你编程能力在同龄人中拔尖，参加信息社团与竞赛展现了良好的逻辑天赋。",
        "你组织策划能力突出，班级活动、社团展示从策划到落地都有你担当主力。",
        "你对外语学习有特别热情，课外阅读、配音、戏剧表演都让你脱颖而出。",
        "你善于把学科兴趣发展为钻研方向，生物学、地理学的小课题已初见成果。",
        "你在传统文化、书法、棋艺等领域有扎实积累，文化自信在你身上自然流露。"
      ]
    }
  ];

  /**
   * 评语风格对应的结尾寄语词库
   * - objective：客观严谨，注重事实陈述与改进方向
   * - encourage：鼓励激励，注重情感支持与正向期待
   * - detailed：具体细致，注重行为指引与路径建议
   * 每个风格 5 条；支持 {pronoun} 占位符：男→他，女→她，不限→该生
   * @type {{objective:string[],encourage:string[],detailed:string[]}}
   */
  var ENDINGS = {
    objective: [
      "本学期整体表现稳定，{pronoun}在学习与品格方面均有所进步，望下学期在弱项上持续改进，争取更均衡的发展。",
      "综合来看，{pronoun}的态度端正、基础扎实，部分学科仍有提升空间，建议结合考纲系统梳理，稳步突破。",
      "{pronoun}本学期能较好地完成学习任务，集体意识强，希望后续在思维深度与表达精度上进一步打磨。",
      "总体而言，{pronoun}的表现符合初中阶段学生规范，若能加强时间规划与反思习惯，成效将更为显著。",
      "{pronoun}在本学期各项评比中表现中上，学习态度认真，期待下阶段在自主学习与跨学科融合上有新突破。"
    ],
    encourage: [
      "老师由衷地为{pronoun}的进步感到骄傲，请相信每一份努力都不会被辜负，继续勇敢向前冲！",
      "{pronoun}身上有着令人欣赏的韧劲与潜力，愿你带着这份光和热，在新的学期里遇见更强的自己！",
      "请告诉{pronoun}：成长比成绩更重要，过程比结果更动人，老师会一直在这里为{pronoun}加油！",
      "愿{pronoun}保持这份热爱与坚持，把每一次小进步都当作勋章，在青春的赛道上跑出自己的节奏！",
      "你身上有星辰，脚下有远方——老师相信{pronoun}一定能绽放出属于自己的光芒，加油！"
    ],
    detailed: [
      "建议下学期三件事：一是每周梳理错题并归因；二是每天预留 20 分钟阅读积累；三是主动找老师复盘一次月考，{pronoun}必能更进一步。",
      "具体改进方向：数学加强几何证明的书写规范；语文增加时评阅读与摘抄；英语坚持每日听力 15 分钟，{pronoun}会看到明显变化。",
      "希望{pronoun}在课堂上多举手发言，每周至少一次；在小组合作中尝试担任一次汇报人；并坚持用错题本整理薄弱知识点。",
      "下周起可尝试：①每天列三件最重要任务；②自习课用番茄钟分割时间；③睡前用 5 分钟复盘，{pronoun}的学习效率会显著提升。",
      "建议{pronoun}继续坚持体育锻炼以释放压力，并每月与家长或老师进行一次学习对话，及时调整方向与节奏。"
    ]
  };

  /**
   * 性别配置：影响代词与卡片显示
   * @type {{any:{label:string,pronoun:string,icon:string},male:{label:string,pronoun:string,icon:string},female:{label:string,pronoun:string,icon:string}}}
   */
  var GENDERS = {
    any: { label: "不限", pronoun: "该生", icon: "👤" },
    male: { label: "男生", pronoun: "他", icon: "👦" },
    female: { label: "女生", pronoun: "她", icon: "👧" }
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
    chkPrefix: $("chkPrefix"),
    genderGroup: $("genderGroup"),
    styleGroup: $("styleGroup"),
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

  /** @type {{prefix:boolean,gender:string,style:string}} 生成设置 */
  var settings = { prefix: true, gender: "any", style: "objective" };

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

  /* ===================== 评语生成 ===================== */

  /**
   * 将结尾寄语中的 {pronoun} 占位符替换为对应性别代词
   * @param {string} tpl 含 {pronoun} 占位符的模板
   * @returns {string} 替换后的句子
   */
  function fillPronoun(tpl) {
    var g = GENDERS[settings.gender] || GENDERS.any;
    return tpl.replace(/\\{pronoun\\}/g, g.pronoun);
  }

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
   * 为一名学生拼接完整评语
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
      parts.push(phrase);
    });

    var endingPool = ENDINGS[settings.style] || ENDINGS.objective;
    var endingRaw = pickPhrase(endingPool, []);
    var ending = fillPronoun(endingRaw);
    picks.__ending = endingRaw;

    var prefix = settings.prefix ? name + PREFIX_LABEL + "：" : "";
    return { name: name, text: prefix + parts.join("") + ending, picks: picks };
  }

  /**
   * 一键为名单中的全部学生生成评语
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
    var gInfo = GENDERS[settings.gender] || GENDERS.any;
    els.resultWrap.innerHTML = results.map(function (r, i) {
      var no = String(i + 1).padStart(2, "0");
      return '<div class="r-card">'
        + '<div class="r-head">'
        + '<span class="r-no">' + no + "<\/span>"
        + '<span class="r-name">' + escapeHtml(r.name) + "<\/span>"
        + '<span class="r-gender">' + gInfo.icon + " " + gInfo.label + "<\/span>"
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
    var blob = new Blob(["\\ufeff" + body], { type: "text/plain;charset=utf-8" });
    download(TOOL_TITLE + ".txt", blob);
    toast("TXT 文件已开始下载");
  }

  /**
   * 导出 Excel：姓名 / 性别 / 评语三列，列宽适配（依赖本地 SheetJS 全局 XLSX）
   */
  function exportExcel() {
    if (!results.length) { toast("请先生成评语"); return; }
    if (typeof XLSX === "undefined") { toast("Excel 组件未加载，请确认 xlsx.full.min.js 存在"); return; }
    var gInfo = GENDERS[settings.gender] || GENDERS.any;
    var rows = results.map(function (r) {
      return { "姓名": r.name, "性别": gInfo.label, "评语": r.text };
    });
    var ws = XLSX.utils.json_to_sheet(rows, { header: ["姓名", "性别", "评语"] });
    ws["!cols"] = [{ wch: 12 }, { wch: 8 }, { wch: 90 }];
    var wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "初中评语");
    XLSX.writeFile(wb, TOOL_TITLE + ".xlsx");
    toast("Excel 文件已开始下载");
  }

  /**
   * 导出 Word：简单 HTML 文档 + application/msword Blob，中文段落用 <p>
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

    // 生成设置：称呼前缀
    els.chkPrefix.addEventListener("change", function () {
      settings.prefix = els.chkPrefix.checked;
      saveSettings();
    });

    // 性别选择
    Array.prototype.forEach.call(els.genderGroup.querySelectorAll('input[name="gender"]'), function (radio) {
      radio.addEventListener("change", function () {
        settings.gender = radio.value;
        saveSettings();
        renderResults();
      });
    });

    // 评语风格
    Array.prototype.forEach.call(els.styleGroup.querySelectorAll('input[name="style"]'), function (radio) {
      radio.addEventListener("change", function () {
        settings.style = radio.value;
        saveSettings();
      });
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
        if (obj.gender && GENDERS[obj.gender]) settings.gender = obj.gender;
        if (obj.style && ENDINGS[obj.style]) settings.style = obj.style;
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
    meta: {builtAt: "2026-09-28 11:07:05", sources: {"tools/junior-comment/junior-comment.css": "a1716dc2a2a4", "assets/css/tool-common.css": "d35dcf222690", "assets/js/frame-bridge.js": "1131903c1e46", "tools/junior-comment/junior-comment.js": "ee9e463eab20"}}
  };
})();