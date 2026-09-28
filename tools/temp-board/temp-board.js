/**
 * 记录板主逻辑（IIFE 模块）
 * 功能描述：
 *   1. 大字记录区域（contenteditable），支持多行文本
 *   2. 字号调节（A− / A+），范围 16–96px
 *   3. 三种板面切换：白板 / 黑板 / 绿板（业务皮肤，挂在 #stage[data-board]）
 *   4. 一键清空全部内容
 *   5. 自动保存到 localStorage（输入即存，刷新不丢）
 *   6. 全屏展示：舞台右上角工具栏 ⛶（舞台自身全屏）/ ⚙（隐藏顶部工具条），
 *      由共享模块 assets/js/tool-stage-toolbar.js 提供
 *   7. file:// 协议直接打开可用（无任何外部依赖）
 */
(function () {
  "use strict";

  /* ========== 常量与配置 ========== */
  const STORAGE_KEY = "tempBoardData";
  const MIN_SIZE = 16;
  const MAX_SIZE = 96;
  const DEFAULT_SIZE = 32;
  const SAVE_DEBOUNCE = 400; // 自动保存防抖毫秒数

  /* ========== DOM 引用 ========== */
  const $ = (id) => document.getElementById(id);
  const boardEl = $("board");
  const stageEl = $("stage");
  const statusEl = $("status");
  const sizeValEl = $("sizeVal");
  const fontDownBtn = $("fontDown");
  const fontUpBtn = $("fontUp");
  const clearBtn = $("clearBtn");
  const fullscreenBtn = $("fullscreenBtn");
  const boardDots = document.querySelectorAll(".theme-dot");

  /* ========== 状态 ========== */
  let fontSize = loadFontSize();
  let theme = loadTheme();
  let saveTimer = null;

  /* ---------- 加载持久化的字号 ----------
   * 返回值: number，范围 [MIN_SIZE, MAX_SIZE]
   */
  function loadFontSize() {
    let raw = NaN;
    try { raw = parseInt(localStorage.getItem("tempBoard.fontSize"), 10); } catch (e) { /* 忽略（隐私模式） */ }
    if (Number.isNaN(raw)) return DEFAULT_SIZE;
    return Math.min(MAX_SIZE, Math.max(MIN_SIZE, raw));
  }

  /* ---------- 加载持久化的主题 ----------
   * 返回值: string（white / black / green），默认 white
   */
  function loadTheme() {
    let t = "white";
    try { t = localStorage.getItem("tempBoard.theme") || "white"; } catch (e) { /* 忽略（隐私模式） */ }
    return ["white", "black", "green"].indexOf(t) >= 0 ? t : "white";
  }

  /* ---------- 加载持久化的文本内容 ----------
   * 返回值: string（HTML 字符串，可为空）
   */
  function loadContent() {
    try { return localStorage.getItem("tempBoard.content") || ""; } catch (e) { return ""; }
  }

  /* ---------- 应用字号到 DOM 与显示 ----------
   * 入参: size (number)
   */
  function applyFontSize(size) {
    fontSize = size;
    document.documentElement.style.setProperty("--font-size", size + "px");
    sizeValEl.textContent = size;
  }

  /* ---------- 应用板面主题到舞台 #stage ----------
   * 入参: t (string)，并同步高亮按钮
   *
   * 为什么不再写 document.body[data-theme]：data-theme 是站点全局配色通道，
   * 站点把它写在挂载容器 .tool-root 上并用 .tool-root[data-theme="x"] 改写
   * --primary；工具往 body 上写 data-theme="green" 会顶掉站点配色、污染该
   * 容器的 --primary（见 assets/js/theme.js 与 assets/css/tool-mount-base.css
   * 的事故记录）。板面（白板 / 黑板 / 绿板）是本工具的业务皮肤，改用工具私有
   * 的 data-board 写在自己的舞台 #stage 上，与站点配色彻底解耦。
   * 注：影子挂载时 body 会被 rebaseCss 重基成 :host（宿主容器），写在 body 上的
   * 属性还要靠 patchThemeAttr 镜像才命中，改用 #stage 后不需要任何镜像。
   */
  function applyTheme(t) {
    theme = t;
    stageEl.setAttribute("data-board", t);
    boardDots.forEach((d) => {
      d.classList.toggle("active", d.dataset.board === t);
    });
  }

  /* ---------- 持久化保存内容（防抖）----------
   * 在输入停止 SAVE_DEBOUNCE 毫秒后写入 localStorage
   */
  function saveContent() {
    setSaving(true);
    if (saveTimer) clearTimeout(saveTimer);
    saveTimer = setTimeout(() => {
      try {
        localStorage.setItem("tempBoard.content", boardEl.innerHTML);
        localStorage.setItem("tempBoard.fontSize", String(fontSize));
        localStorage.setItem("tempBoard.theme", theme);
      } catch (e) {
        /* 容量超限或隐私模式忽略 */
      }
      setSaving(false);
    }, SAVE_DEBOUNCE);
  }

  /* ---------- 设置保存中状态 ----------
   * 入参: boolean
   */
  function setSaving(saving) {
    statusEl.classList.toggle("saving", saving);
    statusEl.textContent = saving ? "保存中..." : "已保存";
  }

  /* ---------- 字号 ± ----------
   * 入参: delta (number, 正为放大/负为缩小)
   * 边界：超出 [MIN_SIZE, MAX_SIZE] 则钳制
   */
  function adjustFont(delta) {
    const next = Math.min(MAX_SIZE, Math.max(MIN_SIZE, fontSize + delta));
    if (next === fontSize) return;
    applyFontSize(next);
    saveContent();
  }

  /* ---------- 清空全部内容 ----------
   * 弹出确认框，确认后清空 DOM 与存储
   */
  function clearAll() {
    if (boardEl.textContent.trim() === "") return;
    if (!confirm("确定清空全部记录？此操作不可撤销。")) return;
    boardEl.innerHTML = "";
    saveContent();
    boardEl.focus();
  }

  /* ---------- 全屏 / 隐藏设置 ----------
   * 已交由共享模块 tool-stage-toolbar.js 处理：
   *   ⛶ → 舞台 #stage 自身全屏；⚙ → 隐藏 / 显示顶部工具条 #toolbar
   */

  /* ========== 事件绑定 ========== */
  // 输入即保存
  boardEl.addEventListener("input", saveContent);
  // 字号
  fontDownBtn.addEventListener("click", () => adjustFont(-4));
  fontUpBtn.addEventListener("click", () => adjustFont(4));
  // 清空
  clearBtn.addEventListener("click", clearAll);
  // 主题切换
  boardDots.forEach((d) => {
    d.addEventListener("click", () => {
      applyTheme(d.dataset.board);
      saveContent();
    });
  });
  // 键盘快捷键：Ctrl/Cmd + Enter 切换舞台全屏（触发共享模块绑定的同一个按钮）
  document.addEventListener("keydown", (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
      fullscreenBtn.click();
    }
  });

  /* ========== 初始化 ========== */
  // 舞台右上角工具栏：⛶ 舞台全屏 / ⚙ 隐藏顶部工具条
  if (window.EduToolStageToolbar) {
    window.EduToolStageToolbar.init({ stage: "#stage", panelHost: "#toolbar", hiddenClass: "setup-hidden" });
  }
  applyTheme(theme);
  applyFontSize(fontSize);
  boardEl.innerHTML = loadContent();
  statusEl.textContent = "准备就绪";
})();
