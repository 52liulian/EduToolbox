/**
 * 记录板主逻辑（IIFE 模块）
 * 功能描述：
 *   1. 大字记录区域（contenteditable），支持多行文本
 *   2. 字号调节（A− / A+），范围 16–96px
 *   3. 三种主题切换：白板 / 黑板 / 绿板
 *   4. 一键清空全部内容
 *   5. 自动保存到 localStorage（输入即存，刷新不丢）
 *   6. 全屏模式：工具栏自动隐藏，鼠标移到顶部呼出
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
  const statusEl = $("status");
  const toolbarEl = $("toolbar");
  const sizeValEl = $("sizeVal");
  const fontDownBtn = $("fontDown");
  const fontUpBtn = $("fontUp");
  const clearBtn = $("clearBtn");
  const fullscreenBtn = $("fullscreenBtn");
  const themeDots = document.querySelectorAll(".theme-dot");

  /* ========== 状态 ========== */
  let fontSize = loadFontSize();
  let theme = loadTheme();
  let saveTimer = null;
  let hideTimer = null;

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

  /* ---------- 应用主题到 body ----------
   * 入参: t (string)，并同步高亮按钮
   */
  function applyTheme(t) {
    theme = t;
    document.body.setAttribute("data-theme", t);
    themeDots.forEach((d) => {
      d.classList.toggle("active", d.dataset.theme === t);
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

  /* ---------- 切换全屏模式 ----------
   * 全屏时隐藏 navbar，工具栏自动隐藏
   * 异常场景：浏览器不支持 Fullscreen API 则静默
   */
  function toggleFullscreen() {
    const el = document.documentElement;
    const isFs = document.fullscreenElement || document.webkitFullscreenElement;
    if (!isFs) {
      (el.requestFullscreen || el.webkitRequestFullscreen || function () {}).call(el);
    } else {
      (document.exitFullscreen || document.webkitExitFullscreen || function () {}).call(document);
    }
  }

  /* ---------- 全屏模式下工具栏的呼出/隐藏 ----------
   * 全屏后鼠标移到屏幕顶部 0-60px 区域时呼出工具栏
   * 鼠标离开后 1.5s 自动隐藏
   */
  function handleFullscreenMouse(e) {
    const isFs = document.fullscreenElement || document.webkitFullscreenElement;
    if (!isFs) {
      toolbarEl.classList.remove("show");
      return;
    }
    if (e.clientY <= 60) {
      toolbarEl.classList.add("show");
      if (hideTimer) clearTimeout(hideTimer);
    } else if (e.clientY > 120) {
      if (hideTimer) clearTimeout(hideTimer);
      hideTimer = setTimeout(() => toolbarEl.classList.remove("show"), 1500);
    }
  }

  /* ========== 事件绑定 ========== */
  // 输入即保存
  boardEl.addEventListener("input", saveContent);
  // 字号
  fontDownBtn.addEventListener("click", () => adjustFont(-4));
  fontUpBtn.addEventListener("click", () => adjustFont(4));
  // 清空
  clearBtn.addEventListener("click", clearAll);
  // 全屏
  fullscreenBtn.addEventListener("click", toggleFullscreen);
  // 主题切换
  themeDots.forEach((d) => {
    d.addEventListener("click", () => {
      applyTheme(d.dataset.theme);
      saveContent();
    });
  });
  // 全屏鼠标移动控制工具栏显隐
  document.addEventListener("mousemove", handleFullscreenMouse);
  // 全屏状态变化时重置工具栏
  document.addEventListener("fullscreenchange", () => {
    if (!document.fullscreenElement) toolbarEl.classList.remove("show");
  });
  document.addEventListener("webkitfullscreenchange", () => {
    if (!document.webkitFullscreenElement) toolbarEl.classList.remove("show");
  });
  // 键盘快捷键：Ctrl/Cmd + Backspace 清空（防误触需确认）
  document.addEventListener("keydown", (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
      toggleFullscreen();
    }
  });

  /* ========== 初始化 ========== */
  applyTheme(theme);
  applyFontSize(fontSize);
  boardEl.innerHTML = loadContent();
  statusEl.textContent = "准备就绪";
})();
