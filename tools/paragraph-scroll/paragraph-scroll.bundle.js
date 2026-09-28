/* 自动生成，请勿手改 —— 源：tools/paragraph-scroll/  ·  构建：2026-09-28 11:07:05 */
/* 用途：file:// 离线场景下 fetch 被 CORS 拦截，站点改用 <script src> 加载本文件，
   拿到工具页面与本地 CSS/JS 文本后走与 http 相同的 Shadow DOM 组件化挂载。
   工具源码改动后请重跑：python .workbuddy/scripts/build_tool_bundles.py */
(function(){
  var g = window.EduToolboxToolBundles || (window.EduToolboxToolBundles = {});
  g["paragraph-scroll"] = {
    html: `<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>段落滚动 | EduToolbox · 朗读提词<\/title>
<link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ctext y='.9em' font-size='90'%3E%F0%9F%8E%93%3C/text%3E%3C/svg%3E">
<link rel="stylesheet" href="paragraph-scroll.css">
<link rel="stylesheet" href="../../assets/css/tool-common.css">
<\/head>
<body>

<main class="app">
  <!-- 左侧设置面板 -->
  <aside class="panel" id="panel">
    <section class="panel-block">
      <h3 class="block-title">段落内容 <span class="count" id="count">1 / 12<\/span><\/h3>
      <textarea id="text" class="text-area" placeholder="每段之间用空行分隔…">第一段：清晨的教室安静明亮，同学们准备开始今天的朗读。
请把视线集中在中间段落，跟着节奏慢慢进入状态。

第二段：这款段落滚动工具采用歌词式显示方式。
每次只突出一个段落，前后段落会按统一的淡出段数进行辅助展示。

第三段：你可以设置淡出段数和段落间距。
这样既能看到上下文，又不会让整屏文字显得太乱。

第四段：如果选择自动模式，内容会按段停留并自动切换。
如果选择手动模式，就可以自己控制上一段和下一段。

第五段：切换动画支持脉冲放大、淡入淡出、上下滑动等多种效果。
不同动画风格适合不同的课堂投影和舞台展示场景。

第六段：你还可以自由设置左对齐、居中对齐或右对齐。
无论是诗歌、台词、演讲稿还是歌词，都能找到更合适的排版方式。

第七段：快速外观设置内置了多套默认主题。
点击不同样式后，文字颜色和背景颜色会立即切换。

第八段：淡出透明度会按段落距离逐级递减。
越远离中心段落，透明度越低，视觉焦点就越集中。

第九段：段落间距使用像素数值控制。
间距调大后层次更清楚，间距调小后整体画面更紧凑。

第十段：手动模式更适合课堂讲解和临时停顿。
自动模式则适合晨读、朗诵、提词和节目排练等连续展示场景。

第十一段：当切到第一段或最后一段时，工具会给出对应提示。
自动模式播放到末尾后，也会提示播放结束并自动停止。

第十二段：现在你可以直接用这组示例体验完整效果。
确认没问题后，再替换成自己的课文、歌词或演讲内容。<\/textarea>
      <div class="text-tools">
        <button type="button" class="btn-mini" id="clearBtn">清空<\/button>
        <button type="button" class="btn-mini" id="resetBtn">重置设置<\/button>
        <button type="button" class="btn-mini" id="sampleBtn">加载示例<\/button>
      <\/div>
    <\/section>

    <section class="panel-block">
      <h3 class="block-title">播放控制<\/h3>
      <div class="ctrl-row">
        <button type="button" class="btn btn-primary" id="startBtn">▶ 开始播放 (空格)<\/button>
      <\/div>
      <div class="ctrl-row">
        <button type="button" class="btn btn-ghost" id="prevBtn">◀ 上一段<\/button>
        <button type="button" class="btn btn-ghost" id="nextBtn">下一段 ▶<\/button>
      <\/div>
      <div class="ctrl-row">
        <button type="button" class="btn btn-ghost" id="resetPosBtn">↺ 重置<\/button>
      <\/div>
      <div class="mode-row">
        <label class="field-label">切换模式<\/label>
        <div class="seg" id="modeSeg">
          <button type="button" class="seg-btn active" data-mode="manual">手动<\/button>
          <button type="button" class="seg-btn" data-mode="auto">自动<\/button>
        <\/div>
      <\/div>
      <div class="field">
        <label class="field-label">自动切换时间 <span class="num-unit">秒<\/span><\/label>
        <div class="num-ctrl">
          <button type="button" class="num-btn" id="stayMinus">-<\/button>
          <span class="num-val" id="stayVal">4<\/span>
          <button type="button" class="num-btn" id="stayPlus">+<\/button>
        <\/div>
        <div class="duration-tip">完整播放一轮约 <span id="totalTime">48<\/span> 秒<\/div>
      <\/div>
    <\/section>

    <section class="panel-block">
      <h3 class="block-title">显示与动画<\/h3>
      <div class="field">
        <label class="field-label">淡出段数<\/label>
        <div class="num-ctrl">
          <button type="button" class="num-btn" id="fadeMinus">-<\/button>
          <span class="num-val" id="fadeVal">2<\/span>
          <button type="button" class="num-btn" id="fadePlus">+<\/button>
        <\/div>
      <\/div>
      <div class="field">
        <label class="field-label">淡出透明度<\/label>
        <input type="range" id="fadeOpacity" class="range" min="0.1" max="1" value="0.7" step="0.05">
      <\/div>
      <div class="field">
        <label class="field-label">段落间距 <span class="num-unit">px<\/span><\/label>
        <div class="num-ctrl">
          <button type="button" class="num-btn" id="gapMinus">-<\/button>
          <span class="num-val" id="gapVal">60<\/span>
          <button type="button" class="num-btn" id="gapPlus">+<\/button>
        <\/div>
      <\/div>
      <div class="field">
        <label class="field-label">左右边距 <span class="num-unit">%<\/span><\/label>
        <input type="range" id="padding" class="range" min="0" max="20" value="6" step="1">
      <\/div>
      <div class="field">
        <label class="field-label" for="anim">切换动画<\/label>
        <select id="anim" class="select">
          <option value="none">不使用动画<\/option>
          <option value="zoom">放大<\/option>
          <option value="fade">淡入淡出<\/option>
          <option value="slide">上下滑动<\/option>
          <option value="smooth">平滑切换<\/option>
          <option value="bounce">弹跳<\/option>
          <option value="elastic">弹性放大<\/option>
          <option value="flip">翻转<\/option>
          <option value="pulse" selected>脉冲放大<\/option>
          <option value="float">浮动上升<\/option>
          <option value="rotate">旋转进入<\/option>
        <\/select>
      <\/div>
    <\/section>

    <section class="panel-block">
      <h3 class="block-title">外观设置<\/h3>
      <div class="theme-row" id="themeRow">
        <button type="button" class="theme-chip" data-theme="white">白底<\/button>
        <button type="button" class="theme-chip" data-theme="black">黑底<\/button>
        <button type="button" class="theme-chip" data-theme="green">绿板<\/button>
        <button type="button" class="theme-chip" data-theme="warm">暖阳<\/button>
        <button type="button" class="theme-chip" data-theme="sky">晴空<\/button>
        <button type="button" class="theme-chip" data-theme="pink">樱粉<\/button>
        <button type="button" class="theme-chip" data-theme="purple">紫雾<\/button>
        <button type="button" class="theme-chip" data-theme="deep">深海<\/button>
        <button type="button" class="theme-chip" data-theme="sunset">晚霞<\/button>
        <button type="button" class="theme-chip" data-theme="paper">米纸<\/button>
        <button type="button" class="theme-chip" data-theme="mint">薄荷<\/button>
        <button type="button" class="theme-chip" data-theme="graphite">石墨<\/button>
      <\/div>
      <div class="field">
        <label class="field-label" for="fontFamily">字体<\/label>
        <select id="fontFamily" class="select">
          <option value='"Microsoft YaHei", sans-serif'>微软雅黑<\/option>
          <option value='SimSun, serif'>宋体<\/option>
          <option value='SimHei, sans-serif'>黑体<\/option>
          <option value='KaiTi, "楷体", serif'>楷体<\/option>
          <option value='LiSu, "隶书", serif'>隶书<\/option>
        <\/select>
      <\/div>
      <div class="field-row">
        <div class="field">
          <label class="field-label" for="color">字色<\/label>
          <input type="color" id="color" class="color" value="#f8fafc">
        <\/div>
        <div class="field">
          <label class="field-label" for="bgColor">背景<\/label>
          <input type="color" id="bgColor" class="color" value="#0f172a">
        <\/div>
      <\/div>
      <div class="field">
        <label class="field-label">字号 (px)<\/label>
        <div class="num-ctrl">
          <button type="button" class="num-btn" id="fontMinus">-<\/button>
          <span class="num-val" id="fontVal">40<\/span>
          <button type="button" class="num-btn" id="fontPlus">+<\/button>
        <\/div>
      <\/div>
      <div class="field">
        <label class="field-label">行高<\/label>
        <div class="num-ctrl">
          <button type="button" class="num-btn" id="lhMinus">-<\/button>
          <span class="num-val" id="lhVal">1.6<\/span>
          <button type="button" class="num-btn" id="lhPlus">+<\/button>
        <\/div>
      <\/div>
      <div class="field">
        <label class="field-label">对齐方式<\/label>
        <div class="seg" id="alignSeg">
          <button type="button" class="seg-btn" data-align="left">左<\/button>
          <button type="button" class="seg-btn active" data-align="center">中<\/button>
          <button type="button" class="seg-btn" data-align="right">右<\/button>
        <\/div>
      <\/div>
      <div class="field-row">
        <label class="check">
          <input type="checkbox" id="loop" checked>
          <span>循环播放（最后一段后回到第一段）<\/span>
        <\/label>
        <label class="check">
          <input type="checkbox" id="showInfo" checked>
          <span>显示段落信息<\/span>
        <\/label>
      <\/div>
    <\/section>
  <\/aside>

  <!-- 右侧段落展示舞台 -->
  <section class="stage" id="stage">
    <div class="stage-inner" id="stageInner">
      <div class="para-list" id="paraList"><\/div>
    <\/div>
    <div class="para-info" id="paraInfo">当前第 1 段，共 12 段<\/div>
    <!-- 舞台右上角工具栏：全屏 + 隐藏设置（与 random-call 结构/顺序一致） -->
    <div class="stage-toolbar">
      <button type="button" class="icon-btn" id="fullscreenBtn" title="全屏">⛶<\/button>
      <button type="button" class="icon-btn" id="hideSetupBtn" title="隐藏设置">⚙<\/button>
    <\/div>
    <div class="stage-hint">按空格键开始/暂停 · 点击屏幕切换段落<\/div>
  <\/section>
<\/main>

<script src="../../assets/js/frame-bridge.js"><\/script>
<script src="../../assets/js/tool-stage-toolbar.js"><\/script>
<script src="paragraph-scroll.js"><\/script>
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
      "tools/paragraph-scroll/paragraph-scroll.css": `/* ============================================================================
 * 段落滚动（朗读提词）· paragraph-scroll.css
 * 仅包含本工具特有样式：双栏布局 / 段落舞台 / 逐段切换动画 / 主题反色 / 全屏
 * 公共底座（按钮、表单、面板、seg、theme-chip、num-ctrl、check 等）见 tool-common.css
 * 高度策略：舞台 min-height 撑开、内容自然增高，仅 body 主滚动条；
 *           仅 #stage 自身进入全屏时铺满视口
 * ========================================================================== */

/* ---------------------------------------------------------------------------
 * 一、双栏布局（.app 不在公共底座中，本工具自定义；窄屏回落 / 隐藏面板单栏）
 * ------------------------------------------------------------------------- */
.app {
  display: grid;
  grid-template-columns: 360px minmax(0, 1fr);
  gap: 22px;
  align-items: start;
  width: 100%;
  max-width: 1440px;
  margin: 0 auto;
  padding: 24px;
}

@media (max-width: 980px) {
  .app { grid-template-columns: 1fr; }
}

/* 隐藏设置面板时切回单栏（:has 现代浏览器支持） */
.app:has(.panel.hide) { grid-template-columns: 1fr; }
.panel.hide { display: none; }

/* 面板内分块分隔 */
.panel .panel-block + .panel-block {
  margin-top: 18px;
  padding-top: 18px;
  border-top: 1px dashed var(--border);
}

/* 标题行右侧计数 */
.block-title .count {
  margin-left: auto;
  font-size: 13px;
  font-weight: 600;
  color: var(--text-3);
}

/* 段落文本框略高、字号略小 */
.text-area { min-height: 180px; font-size: 13.5px; line-height: 1.7; }

/* 切换模式行 */
.mode-row { margin-top: 14px; }
.mode-row .field-label { margin-bottom: 8px; }

/* 自动模式总时长提示 */
.duration-tip {
  margin-top: 8px;
  font-size: 12.5px;
  color: var(--text-3);
}
.duration-tip span { color: var(--primary); font-weight: 700; }

/* 主题芯片行 */
.theme-row {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 14px;
}

/* ---------------------------------------------------------------------------
 * 二、段落舞台：默认深色（黑底主题），JS 按主题改 bg；文字色由 JS 内联
 * ------------------------------------------------------------------------- */
#stage {
  position: relative;
  display: flex;
  flex-direction: column;
  min-height: 600px;
  padding: 0;
  background: #0f172a;
  border: 1px solid var(--border);
  border-radius: var(--r-lg);
  box-shadow: var(--shadow);
  overflow: hidden;            /* 仅裁切圆角边缘，不产生内部滚动条（舞台随内容增高） */
  transition: background var(--t) var(--ease);
}

#stage .stage-inner {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 600px;
  padding: 48px 6% 24px;       /* 左右内边距由 JS 按设置改写 */
}

.para-list {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
}

.para-item {
  width: 100%;
  max-width: 1000px;
  margin: 0 auto;
  text-align: center;
  white-space: pre-wrap;       /* 保留段落内换行 */
  word-break: break-word;
  transition: transform .55s var(--ease), opacity .55s var(--ease), filter .55s var(--ease);
}

.para-item.ghost { display: none; }

/* 段落信息行 & 底部提示：深色舞台反白 */
.para-info {
  padding: 10px 18px 4px;
  font-size: 13.5px;
  font-weight: 600;
  text-align: center;
  color: rgba(255, 255, 255, 0.72);
}

.stage-hint {
  padding: 4px 18px 18px;
  font-size: 12.5px;
  text-align: center;
  color: rgba(255, 255, 255, 0.5);
}

/* 右上角工具栏：全屏 + 隐藏设置
 * .stage-toolbar / .icon-btn 的基础样式（定位、尺寸、圆形、hover）来自
 * tool-common.css，与 random-call 完全一致；此处只按舞台主题做反色。
 * 舞台默认深色，故按钮用浅色玻璃质感。 */
.stage-toolbar .icon-btn {
  color: rgba(255, 255, 255, 0.75);
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.22);
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
}
.stage-toolbar .icon-btn:hover {
  color: #fff;
  background: rgba(255, 255, 255, 0.2);
  border-color: rgba(255, 255, 255, 0.35);
}

/* 自动播放中：左上角小徽标 */
#stage.running::before {
  content: "● 播放中";
  position: absolute;
  top: 18px;
  left: 18px;
  z-index: 6;
  padding: 4px 12px;
  font-size: 12px;
  font-weight: 700;
  color: #fff;
  background: var(--primary);
  border-radius: var(--r-pill);
  box-shadow: var(--shadow-primary);
  animation: ps-pulse 1.6s ease-in-out infinite;
}
@keyframes ps-pulse {
  0%, 100% { opacity: 0.85; }
  50%      { opacity: 1; }
}

/* 隐藏段落信息 */
#stage.hide-info .para-info { display: none; }

/* ---------------------------------------------------------------------------
 * 三、浅色主题反色（白底/暖阳/晴空/樱粉/米纸/薄荷 时辅助元素改深色）
 * ------------------------------------------------------------------------- */
#stage.light-theme .para-info { color: var(--text-3); }
#stage.light-theme .stage-hint { color: var(--text-3); }
#stage.light-theme .stage-toolbar .icon-btn {
  color: var(--text-2);
  background: rgba(255, 255, 255, 0.7);
  border-color: var(--border);
  backdrop-filter: none;
  -webkit-backdrop-filter: none;
}
#stage.light-theme .stage-toolbar .icon-btn:hover {
  color: var(--primary);
  background: #fff;
  border-color: var(--primary-soft-2);
}

/* ---------------------------------------------------------------------------
 * 四、逐段切换动画：.enter 为初始态，rAF 后 .enter-active 切到终态触发过渡
 *   说明：opacity 内联由 JS 写入（cur=1），此处用 !important 覆盖以实现淡入
 * ------------------------------------------------------------------------- */
/* 放大 */
.anim-zoom .para-item.enter { transform: scale(0.4); opacity: 0 !important; }
.anim-zoom .para-item.enter-active { transform: scale(1); opacity: 1 !important; }

/* 淡入淡出 */
.anim-fade .para-item.enter { opacity: 0 !important; }
.anim-fade .para-item.enter-active { opacity: 1 !important; }

/* 上下滑动 */
.anim-slide .para-item.enter { transform: translateY(64px); opacity: 0 !important; }
.anim-slide .para-item.enter-active { transform: translateY(0); opacity: 1 !important; }

/* 平滑切换 */
.anim-smooth .para-item.enter { transform: translateY(22px); opacity: 0 !important; }
.anim-smooth .para-item.enter-active { transform: translateY(0); opacity: 1 !important; }

/* 弹跳（overshoot 缓动） */
.anim-bounce .para-item.enter { transform: scale(0.3); opacity: 0 !important; }
.anim-bounce .para-item.enter-active {
  transform: scale(1); opacity: 1 !important;
  transition: transform .6s cubic-bezier(0.34, 1.56, 0.64, 1), opacity .4s var(--ease);
}

/* 弹性放大 */
.anim-elastic .para-item.enter { transform: scale(0); opacity: 0 !important; }
.anim-elastic .para-item.enter-active {
  transform: scale(1); opacity: 1 !important;
  transition: transform .8s cubic-bezier(0.68, -0.55, 0.27, 1.55), opacity .5s var(--ease);
}

/* 翻转 */
.anim-flip .para-item.enter { transform: perspective(900px) rotateY(90deg); opacity: 0 !important; }
.anim-flip .para-item.enter-active { transform: perspective(900px) rotateY(0); opacity: 1 !important; }

/* 脉冲放大（默认） */
.anim-pulse .para-item.enter { transform: scale(1.25); opacity: 0 !important; }
.anim-pulse .para-item.enter-active { transform: scale(1); opacity: 1 !important; }

/* 浮动上升 */
.anim-float .para-item.enter { transform: translateY(-44px); opacity: 0 !important; }
.anim-float .para-item.enter-active { transform: translateY(0); opacity: 1 !important; }

/* 旋转进入 */
.anim-rotate .para-item.enter { transform: rotate(-12deg) scale(0.6); opacity: 0 !important; }
.anim-rotate .para-item.enter-active { transform: rotate(0) scale(1); opacity: 1 !important; }

/* ---------------------------------------------------------------------------
 * 五、全屏投影（全屏元素即 #stage 本身，与 random-call 一致）
 *    不再全屏 html/body，故不再需要整页黑底、.app 单栏覆盖等规则；
 *    舞台沿用自身主题背景（JS 内联写入），铺满视口。
 * ------------------------------------------------------------------------- */
#stage:fullscreen,
#stage:-webkit-full-screen,
#stage.edutf-solo{
  width: 100%;
  height: 100%;
  min-height: 100vh;
  padding: 0;
  border: none;
  border-radius: 0;
  box-shadow: none;
}

#stage:fullscreen .stage-inner,
#stage:-webkit-full-screen .stage-inner,
#stage.edutf-solo .stage-inner{
  flex: 1;
  min-height: 100vh;
  padding: 80px 6% 60px;
}

/* 全屏下工具栏贴边半透明悬浮，鼠标移入恢复，不挡段落 */
#stage:fullscreen .stage-toolbar,
#stage:-webkit-full-screen .stage-toolbar,
#stage.edutf-solo .stage-toolbar{
  top: 20px;
  right: 20px;
  opacity: 0.55;
}
#stage:fullscreen .stage-toolbar:hover,
#stage:-webkit-full-screen .stage-toolbar:hover,
#stage.edutf-solo .stage-toolbar:hover{ opacity: 1; }

/* ---------------------------------------------------------------------------
 * 六、小屏微调
 * ------------------------------------------------------------------------- */
@media (max-width: 640px) {
  .app { padding: 14px; }
  #stage,
  #stage .stage-inner { min-height: 460px; }
  #stage .stage-inner { padding: 36px 5% 16px; }
}
`,
      "tools/paragraph-scroll/paragraph-scroll.js": `/* ====================================================================
 * 段落滚动 (paragraph-scroll.js)
 * 功能：歌词式逐段切换，当前段居中大字，前后段按淡出层级显示，
 *       支持字号/行高/字体/颜色/对齐/动画/主题/淡出/间距/全屏，
 *       手动/自动两种切换模式，纯前端 IIFE 模块。
 * 兼容：file:// 协议，无任何外部依赖
 * ==================================================================== */
(function () {
  'use strict';

  /* ---------- 工具函数 ---------- */

  /**
   * 按元素 id 简写获取（DOM 元素引用）
   * @param {string} id - 元素 id
   * @returns {HTMLElement} 目标 DOM 元素
   */
  const $ = (id) => document.getElementById(id);

  /* ---------- 状态 ---------- */
  let paras = [];           // 段落数组
  let idx = 0;                // 当前段索引
  let running = false;        // 是否自动播放中
  let timer = null;           // 自动播放计时器句柄
  let curMode = 'manual';    // manual / auto
  let curAnim = 'pulse';     // 当前切换动画

  /* ---------- DOM 引用 ---------- */
  const stage = $('stage');
  const stageInner = $('stageInner');
  const paraList = $('paraList');
  const paraInfo = $('paraInfo');
  const panel = $('panel');
  const textArea = $('text');
  const countEl = $('count');
  const totalTimeEl = $('totalTime');
  const startBtn = $('startBtn');
  const prevBtn = $('prevBtn');
  const nextBtn = $('nextBtn');
  const resetPosBtn = $('resetPosBtn');
  const modeSeg = $('modeSeg');
  const stayVal = $('stayVal');
  const fadeVal = $('fadeVal');
  const fadeOpacity = $('fadeOpacity');
  const gapVal = $('gapVal');
  const padding = $('padding');
  const animSel = $('anim');
  const themeRow = $('themeRow');
  const fontFamily = $('fontFamily');
  const colorEl = $('color');
  const bgColorEl = $('bgColor');
  const fontVal = $('fontVal');
  const lhVal = $('lhVal');
  const alignSeg = $('alignSeg');
  const loopEl = $('loop');
  const showInfoEl = $('showInfo');

  /* ---------- 主题预设 ---------- */
  const THEMES = {
    white:    { color: '#1a1a1a', bg: '#ffffff', light: true },
    black:    { color: '#f8fafc', bg: '#0f0f12', light: false },
    green:    { color: '#e6f4d0', bg: '#1f3a25', light: false },
    warm:     { color: '#3a2a1a', bg: '#f7e7c4', light: true },
    sky:      { color: '#0c2a4a', bg: '#dbeafe', light: true },
    pink:     { color: '#4a1024', bg: '#fde2ec', light: true },
    purple:   { color: '#f3e8ff', bg: '#2d1b4e', light: false },
    deep:     { color: '#e0f2fe', bg: '#082f49', light: false },
    sunset:   { color: '#fff7ed', bg: '#7c2d12', light: false },
    paper:    { color: '#3b2f1e', bg: '#e8d8a8', light: true },
    mint:     { color: '#063b2a', bg: '#d1fae5', light: true },
    graphite: { color: '#e2e8f0', bg: '#1f2937', light: false }
  };

  /* ---------- 文本与渲染 ---------- */

  /**
   * 解析文本，按空行拆分段落（去掉空段）
   * @returns {string[]} 段落数组
   */
  function parse() {
    return textArea.value
      .split(/\\r?\\n\\s*\\r?\\n/)
      .map((s) => s.replace(/^\\s+|\\s+$/g, ''))
      .filter(Boolean);
  }

  /**
   * 重新加载段落数组，重置索引，触发渲染
   * @returns {void}
   */
  function load() {
    paras = parse();
    idx = 0;
    render(true);
    updateCount();
    updateTotalTime();
  }

  /**
   * 计算指定段落相对于当前的「距离」（正=下方，负=上方，0=当前）
   * @param {number} i - 段索引
   * @returns {number} 距离（负上正下）
   */
  function distOf(i) {
    return i - idx;
  }

  /**
   * 渲染段落列表：当前段居中，前后段按淡出层级显示
   * @param {boolean} [withAnim] - 是否触发进入动画
   * @returns {void}
   */
  function render(withAnim) {
    paraList.innerHTML = '';
    paraList.className = 'para-list';
    if (curAnim !== 'none') paraList.classList.add('anim-' + curAnim);

    const fade = parseInt(fadeVal.textContent, 10) || 2;
    const opEdge = parseFloat(fadeOpacity.value) || 0.7;
    const baseFont = parseInt(fontVal.textContent, 10) || 40;
    const gap = parseInt(gapVal.textContent, 10) || 60;
    const pad = parseInt(padding.value, 10) || 6;
    const align = alignSeg.querySelector('.seg-btn.active')?.dataset.align || 'center';

    stageInner.style.paddingLeft = pad + '%';
    stageInner.style.paddingRight = pad + '%';
    paraList.style.gap = gap + 'px';

    // 渲染范围：[idx - fade, idx + fade]，超出用 ghost 占位避免跳动
    for (let d = -fade; d <= fade; d++) {
      const i = idx + d;
      if (i < 0 || i >= paras.length) continue;
      const item = document.createElement('div');
      item.className = 'para-item';
      item.textContent = paras[i];
      item.style.textAlign = align;
      item.style.fontFamily = fontFamily.value;
      item.style.color = colorEl.value;
      item.style.lineHeight = lhVal.textContent;

      const ad = Math.abs(d);
      let scale, opacity;
      if (d === 0) {
        scale = 1;
        opacity = 1;
        item.classList.add('cur');
      } else if (ad <= fade) {
        scale = 1 / (1 + ad * 0.55);
        opacity = 1 - (ad / fade) * (1 - opEdge);
        item.classList.add(ad === 1 ? 'side' : (ad === 2 ? 'side' : 'far'));
      } else {
        scale = 0.4;
        opacity = 0;
        item.classList.add('ghost');
      }
      item.style.fontSize = Math.round(baseFont * scale) + 'px';
      item.style.opacity = opacity.toFixed(2);
      // 当前段触发进入动画
      if (d === 0 && withAnim && curAnim !== 'none') {
        item.classList.add('enter');
        // 强制重排后切换到 enter-active 触发动画
        requestAnimationFrame(() => {
          requestAnimationFrame(() => item.classList.add('enter-active'));
        });
      }
      paraList.appendChild(item);
    }
  }

  /* ---------- 切换 ---------- */

  /**
   * 切换到指定段落索引（带边界提示）
   * @param {number} i - 目标索引
   * @returns {void}
   */
  function goTo(i) {
    if (!paras.length) return;
    const last = paras.length - 1;
    if (i < 0) {
      // 已到第一段
      if (loopEl.checked) i = last;
      else { toast('已经是第一段了'); return; }
    } else if (i > last) {
      // 已到最后一段
      if (loopEl.checked) i = 0;
      else {
        toast('已播放到最后一段');
        if (running) toggleRun();
        return;
      }
    }
    idx = i;
    render(true);
    updateCount();
  }

  /**
   * 下一段
   * @returns {void}
   */
  function next() { goTo(idx + 1); }

  /**
   * 上一段
   * @returns {void}
   */
  function prev() { goTo(idx - 1); }

  /* ---------- 自动播放 ---------- */

  /**
   * 自动模式开始 / 暂停
   * @returns {void}
   */
  function toggleRun() {
    if (!paras.length) return;
    running = !running;
    stage.classList.toggle('running', running);
    startBtn.textContent = running ? '⏸ 暂停播放 (空格)' : '▶ 开始播放 (空格)';
    if (running) {
      // 若处于手动模式，切到自动模式
      if (curMode !== 'auto') setMode('auto');
      scheduleNext();
    } else {
      clearTimeout(timer);
      timer = null;
    }
  }

  /**
   * 安排下一段自动切换
   * @returns {void}
   */
  function scheduleNext() {
    if (!running) return;
    const stay = (parseInt(stayVal.textContent, 10) || 4) * 1000;
    clearTimeout(timer);
    timer = setTimeout(() => {
      const last = paras.length - 1;
      if (idx >= last && !loopEl.checked) {
        toast('已播放完毕');
        toggleRun();
        return;
      }
      next();
      scheduleNext();
    }, stay);
  }

  /* ---------- UI 状态 ---------- */

  /**
   * 更新段落计数显示
   * @returns {void}
   */
  function updateCount() {
    countEl.textContent = (paras.length ? idx + 1 : 0) + ' / ' + paras.length;
    paraInfo.textContent = '当前第 ' + (paras.length ? idx + 1 : 0) + ' 段，共 ' + paras.length + ' 段';
  }

  /**
   * 更新完整播放一轮的总时长（段数 × 停留秒数）
   * @returns {void}
   */
  function updateTotalTime() {
    const stay = parseInt(stayVal.textContent, 10) || 4;
    totalTimeEl.textContent = paras.length * stay;
  }

  /**
   * 显示临时提示（屏幕中央）
   * @param {string} msg - 提示文字
   * @returns {void}
   */
  let toastTimer = null;
  function toast(msg) {
    let el = document.getElementById('toast');
    if (!el) {
      el = document.createElement('div');
      el.id = 'toast';
      el.style.cssText = 'position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);background:rgba(0,0,0,.7);color:#fff;padding:12px 24px;border-radius:8px;font-size:14px;letter-spacing:1px;z-index:200;pointer-events:none;opacity:0;transition:opacity .2s ease';
      document.body.appendChild(el);
    }
    el.textContent = msg;
    el.style.opacity = '1';
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => { el.style.opacity = '0'; }, 1400);
  }

  /* ---------- 设置项 ---------- */

  /**
   * 设置切换模式（手动 / 自动）
   * @param {string} m - manual / auto
   * @returns {void}
   */
  function setMode(m) {
    curMode = m;
    modeSeg.querySelectorAll('.seg-btn').forEach((el) => {
      el.classList.toggle('active', el.dataset.mode === m);
    });
    if (m === 'manual' && running) toggleRun();
  }

  /**
   * 应用预设主题
   * @param {string} key - 主题 key
   * @returns {void}
   */
  function applyTheme(key) {
    const t = THEMES[key];
    if (!t) return;
    colorEl.value = t.color;
    bgColorEl.value = t.bg;
    stage.classList.toggle('light-theme', t.light);
    stage.style.background = t.bg;
    themeRow.querySelectorAll('.theme-chip').forEach((el) => {
      el.classList.toggle('active', el.dataset.theme === key);
    });
    render(false);
  }

  /**
   * 设置对齐方式
   * @param {string} align - left/center/right
   * @returns {void}
   */
  function setAlign(align) {
    alignSeg.querySelectorAll('.seg-btn').forEach((el) => {
      el.classList.toggle('active', el.dataset.align === align);
    });
    render(false);
  }

  /**
   * 应用外观样式（背景 / 字色 / 字体 / 字号 / 行高）
   * @returns {void}
   */
  function applyStyles() {
    stage.style.background = bgColorEl.value;
    render(false);
  }

  /* ---------- 全屏联动 ----------
   * 设置栏显隐（进入全屏自动隐藏 / 退出还原 / 请求失败回滚）由共享模块
   * assets/js/tool-stage-toolbar.js 统一负责，本文件只保留全屏切换后的重渲染。 */

  /**
   * 全屏状态变化处理：全屏切换后重新渲染（尺寸变化需要重新排版）。
   *
   * 注意：这里不再操作 panel 的显隐 —— 那部分已交给共享模块，避免同一份状态
   * 在两个地方各维护一次而漂移。
   * @returns {void}
   */
  function handleFullscreenChange() {
    setTimeout(render, 60);
  }

  /**
   * 调整字号（+/-2）
   * @param {number} delta - 增量
   * @returns {void}
   */
  function adjustFont(delta) {
    let v = parseInt(fontVal.textContent, 10) + delta;
    v = Math.max(16, Math.min(120, v));
    fontVal.textContent = v;
    render(false);
  }

  /**
   * 调整行高（+/-0.1）
   * @param {number} delta - 增量
   * @returns {void}
   */
  function adjustLh(delta) {
    let v = parseFloat(lhVal.textContent) + delta;
    v = Math.round(v * 10) / 10;
    v = Math.max(1.0, Math.min(3.0, v));
    lhVal.textContent = v.toFixed(1);
    render(false);
  }

  /**
   * 调整停留时长（+/-1 秒）
   * @param {number} delta - 增量
   * @returns {void}
   */
  function adjustStay(delta) {
    let v = parseInt(stayVal.textContent, 10) + delta;
    v = Math.max(1, Math.min(30, v));
    stayVal.textContent = v;
    updateTotalTime();
    if (running) scheduleNext();
  }

  /**
   * 调整淡出段数（+/-1）
   * @param {number} delta - 增量
   * @returns {void}
   */
  function adjustFade(delta) {
    let v = parseInt(fadeVal.textContent, 10) + delta;
    v = Math.max(0, Math.min(6, v));
    fadeVal.textContent = v;
    render(false);
  }

  /**
   * 调整段落间距（+/-10px）
   * @param {number} delta - 增量
   * @returns {void}
   */
  function adjustGap(delta) {
    let v = parseInt(gapVal.textContent, 10) + delta;
    v = Math.max(0, Math.min(200, v));
    gapVal.textContent = v;
    render(false);
  }

  /* ---------- 事件绑定 ---------- */

  // 段落内容输入
  textArea.addEventListener('input', load);
  $('clearBtn').addEventListener('click', () => { textArea.value = ''; load(); });
  $('sampleBtn').addEventListener('click', () => { textArea.value = SAMPLE; load(); });
  $('resetBtn').addEventListener('click', () => {
    stayVal.textContent = '4';
    fadeVal.textContent = '2';
    gapVal.textContent = '60';
    fontVal.textContent = '40';
    lhVal.textContent = '1.6';
    fadeOpacity.value = '0.7';
    padding.value = '6';
    animSel.value = 'pulse';
    curAnim = 'pulse';
    load();
    toast('已重置设置');
  });

  // 播放控制
  startBtn.addEventListener('click', toggleRun);
  prevBtn.addEventListener('click', prev);
  nextBtn.addEventListener('click', next);
  resetPosBtn.addEventListener('click', () => { if (running) toggleRun(); idx = 0; render(true); updateCount(); });

  // 模式切换
  modeSeg.querySelectorAll('.seg-btn').forEach((el) => {
    el.addEventListener('click', () => setMode(el.dataset.mode));
  });

  // 数值 +/- 按钮
  $('stayMinus').addEventListener('click', () => adjustStay(-1));
  $('stayPlus').addEventListener('click', () => adjustStay(1));
  $('fadeMinus').addEventListener('click', () => adjustFade(-1));
  $('fadePlus').addEventListener('click', () => adjustFade(1));
  $('gapMinus').addEventListener('click', () => adjustGap(-10));
  $('gapPlus').addEventListener('click', () => adjustGap(10));
  $('fontMinus').addEventListener('click', () => adjustFont(-2));
  $('fontPlus').addEventListener('click', () => adjustFont(2));
  $('lhMinus').addEventListener('click', () => adjustLh(-0.1));
  $('lhPlus').addEventListener('click', () => adjustLh(0.1));

  // 滑块与下拉
  fadeOpacity.addEventListener('input', () => render(false));
  padding.addEventListener('input', () => render(false));
  animSel.addEventListener('change', () => { curAnim = animSel.value; render(false); });
  fontFamily.addEventListener('change', () => render(false));
  colorEl.addEventListener('input', () => render(false));
  bgColorEl.addEventListener('input', () => { stage.style.background = bgColorEl.value; render(false); });

  // 主题 / 对齐
  themeRow.querySelectorAll('.theme-chip').forEach((el) => {
    el.addEventListener('click', () => applyTheme(el.dataset.theme));
  });
  alignSeg.querySelectorAll('.seg-btn').forEach((el) => {
    el.addEventListener('click', () => setAlign(el.dataset.align));
  });

  // 循环 / 信息开关
  loopEl.addEventListener('change', () => {});
  showInfoEl.addEventListener('change', () => stage.classList.toggle('hide-info', !showInfoEl.checked));

  // 隐藏 / 显示设置栏（舞台右上角齿轮）与全屏（⛶）由共享模块接管，见文件末尾初始化处

  // 点击舞台 = 下一段（手动模式）或暂停（自动模式）
  stageInner.addEventListener('click', () => {
    if (curMode === 'auto' && running) toggleRun();
    else next();
  });

  // 键盘快捷键
  document.addEventListener('keydown', (e) => {
    if (e.target === textArea) return;
    if (e.code === 'Space') { e.preventDefault(); toggleRun(); }
    else if (e.code === 'ArrowLeft') { e.preventDefault(); prev(); }
    else if (e.code === 'ArrowRight') { e.preventDefault(); next(); }
  });

  // 全屏变化：同步设置栏显隐 + 重新渲染
  document.addEventListener('fullscreenchange', handleFullscreenChange);
  document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
  // 窗口大小变化重新渲染
  window.addEventListener('resize', () => render(false));

  /* ---------- 默认示例文本 ---------- */
  const SAMPLE = textArea.value;

  /* ---------- 初始化 ---------- */
  load();
  applyTheme('black');
  // 舞台右上角工具栏（⛶ 全屏 / ⚙ 隐藏设置）：舞台 #stage，设置栏 #panel，隐藏 class = hide
  if (window.EduToolStageToolbar) window.EduToolStageToolbar.init({ stage: "#stage", panelHost: "#panel", hiddenClass: "hide" });
})();
`
    },
    meta: {builtAt: "2026-09-28 11:07:05", sources: {"tools/paragraph-scroll/paragraph-scroll.css": "36d1a668f97a", "assets/css/tool-common.css": "d35dcf222690", "assets/js/frame-bridge.js": "1131903c1e46", "assets/js/tool-stage-toolbar.js": "30f2ddfe48d2", "tools/paragraph-scroll/paragraph-scroll.js": "1091c5e48baa"}}
  };
})();