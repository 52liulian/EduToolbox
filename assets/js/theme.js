/**
 * EduToolbox 主题层
 * ============================================================================
 * 功能：深浅色主题切换 + 全局配色主题切换 + localStorage 持久化
 * 加载顺序：utils.js 之后
 * ============================================================================
 */
(function (global) {
  "use strict";

  global.EduToolbox = global.EduToolbox || {};

  const STORAGE_KEY = "et-theme";
  const EduT = global.EduToolbox;

  /**
   * 更新主题按钮文案
   * @returns {void}
   */
  function updateBtn() {
    const btn = EduT.utils.$("#themeBtn");
    if (btn) btn.textContent = document.body.classList.contains("dark") ? "☀️" : "🌙";
  }

  /**
   * 应用主题
   * @param {("light"|"dark")} mode - 主题模式
   * @returns {void}
   */
  function apply(mode) {
    if (mode === "dark") document.body.classList.add("dark");
    else document.body.classList.remove("dark");
    localStorage.setItem(STORAGE_KEY, mode);
    updateBtn();
  }

  /**
   * 切换主题
   * @returns {void}
   */
  function toggle() {
    apply(document.body.classList.contains("dark") ? "light" : "dark");
  }

  /**
   * 初始化：从 localStorage 恢复主题 + 绑定切换按钮
   * @returns {void}
   */
  function init() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === "dark") document.body.classList.add("dark");
    updateBtn();
    const btn = EduT.utils.$("#themeBtn");
    if (btn) btn.addEventListener("click", toggle);
  }

  global.EduToolbox.theme = { init, toggle, apply, updateBtn };

  /* ==========================================================================
   * 全局配色主题（六色循环）
   * --------------------------------------------------------------------------
   * 背景：原先每个工具内部各有 🎨 主题按钮，在六色间循环且各存各的 localStorage，
   *       站点无法统一控制。现提升为站点顶栏 #accentBtn 的「全局开关」：
   *       一次点击，对所有已挂载工具（native 直挂 + adapter 影子挂载）同时生效。
   *
   * 状态存放：localStorage 键 `et-accent`。
   *   ⚠️ 严禁把 data-theme 写到站点 document.body 上 —— body[data-theme] 特异性
   *      高于 :root，会污染整站的 --primary（见 tool-mount-base.css 事故记录）。
   *      状态只在 localStorage，由 toolkit.js（.tool-root 容器）与
   *      tool-adapter.js（Shadow 宿主 host + 内层 inner）各自读取并落到自己那层。
   *
   * 事件：set() 派发 document 上的 `et:accent`（detail.theme = 主题名），
   *       toolkit / adapter 各自监听后即时刷新已挂载宿主。
   * ======================================================================== */

  /** @type {string} 全局配色持久化键（勿与 et-theme / theme / edutoolbox-theme 混用） */
  const ACCENT_KEY = "et-accent";
  /** @type {string} 自定义事件名 */
  const ACCENT_EVENT = "et:accent";
  /** @type {string[]} 六色循环顺序，与绝大多数工具内原有顺序保持一致 */
  const ACCENTS = ["sky", "violet", "green", "gold", "orange", "pink"];
  /** @type {Object<string,string>} 中文名，用于按钮提示 */
  const ACCENT_NAMES = {
    sky: "天空蓝",
    violet: "梦幻紫",
    green: "清新绿",
    gold: "活力金",
    orange: "暖阳橙",
    pink: "樱花粉",
  };
  /** @type {string} 兜底主题 */
  const ACCENT_DEFAULT = "sky";

  /**
   * 读取持久化的配色名（隐私模式下 localStorage 会抛异常，统一兜底）
   * @returns {string} 合法的主题名；缺失或非法时返回 "sky"
   */
  function accentRead() {
    let raw = "";
    try { raw = localStorage.getItem(ACCENT_KEY) || ""; } catch (e) { raw = ""; }
    return ACCENTS.indexOf(raw) >= 0 ? raw : ACCENT_DEFAULT;
  }

  /**
   * 写入持久化的配色名（失败不影响内存中的切换）
   * @param {string} name - 主题名
   * @returns {void}
   */
  function accentWrite(name) {
    try { localStorage.setItem(ACCENT_KEY, name); } catch (e) { /* 隐私模式忽略 */ }
  }

  /**
   * 刷新顶栏按钮的 title / aria-label（带上当前中文名与序号，如 3/6）
   * @param {string} name - 主题名
   * @returns {void}
   */
  function accentUpdateBtn(name) {
    let btn = null;
    try { btn = (EduT.utils && EduT.utils.$) ? EduT.utils.$("#accentBtn") : document.getElementById("accentBtn"); }
    catch (e) { btn = null; }
    if (!btn) return;
    const idx = ACCENTS.indexOf(name);
    const label = ACCENT_NAMES[name] || name;
    const text = "切换配色主题（当前：" + label + " · " + (idx >= 0 ? idx + 1 : 1) + "/" + ACCENTS.length + "）";
    btn.title = text;
    btn.setAttribute("aria-label", text);
  }

  /**
   * 把配色名写到指定元素（供 toolkit / adapter 复用，避免各处重复实现）
   * @param {Element} el - 目标元素（宿主或内层容器）
   * @param {string} [name] - 主题名；缺省取当前全局值
   * @returns {void}
   */
  function accentApplyTo(el, name) {
    if (!el || typeof el.setAttribute !== "function") return;
    try { el.setAttribute("data-theme", name || accentGet()); } catch (e) { /* 忽略 */ }
  }

  /**
   * 获取当前全局配色
   * @returns {string} 主题名
   */
  function accentGet() {
    return accentRead();
  }

  /**
   * 设置当前全局配色：持久化 → 广播事件 → 刷新按钮提示
   * @param {string} name - 主题名；非法值回退默认色
   * @returns {string} 实际生效的主题名
   */
  function accentSet(name) {
    const val = ACCENTS.indexOf(name) >= 0 ? name : ACCENT_DEFAULT;
    accentWrite(val);
    try {
      document.dispatchEvent(new CustomEvent(ACCENT_EVENT, { detail: { theme: val } }));
    } catch (e) { /* 忽略派发异常 */ }
    accentUpdateBtn(val);
    return val;
  }

  /**
   * 切到六色循环里的下一个
   * @returns {string} 切换后的主题名
   */
  function accentNext() {
    const cur = accentRead();
    const idx = ACCENTS.indexOf(cur);
    return accentSet(ACCENTS[(idx + 1) % ACCENTS.length]);
  }

  /** @type {boolean} 初始化去重标记（app.js 与本模块自举都会调用，避免重复绑定点击） */
  let accentBooted = false;

  /**
   * 配色模块初始化：同步按钮提示 + 绑定顶栏按钮点击（幂等）
   * @returns {void}
   */
  function accentInit() {
    if (accentBooted) return;
    accentBooted = true;
    accentUpdateBtn(accentRead());
    let btn = null;
    try { btn = (EduT.utils && EduT.utils.$) ? EduT.utils.$("#accentBtn") : document.getElementById("accentBtn"); }
    catch (e) { btn = null; }
    if (btn) btn.addEventListener("click", accentNext);
  }

  EduT.accent = {
    KEY: ACCENT_KEY,
    EVENT: ACCENT_EVENT,
    list: ACCENTS.slice(),
    names: ACCENT_NAMES,
    init: accentInit,
    get: accentGet,
    set: accentSet,
    next: accentNext,
    applyTo: accentApplyTo,
  };

  /* 自举：保证即使调用方（app.js）未显式调用，按钮也已同步并可用。
     Node/单测环境里 document 可能是残缺 stub，故做能力探测 + try/catch 兜底。 */
  try {
    if (typeof document !== "undefined" && document.readyState === "loading" &&
        typeof document.addEventListener === "function") {
      document.addEventListener("DOMContentLoaded", accentInit);
    } else {
      accentInit();
    }
  } catch (e) { /* 忽略 */ }
})(window);
