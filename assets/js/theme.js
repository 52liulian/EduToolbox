/**
 * EduToolbox 主题层
 * ============================================================================
 * 功能：深浅色主题切换 + localStorage 持久化
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
})(window);
