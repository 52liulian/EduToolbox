/**
 * EduToolbox 工具函数层
 * ============================================================================
 * 提供全局命名空间 EduToolbox.utils，包含 DOM 选择器与通用辅助
 * 加载顺序：位于 data.js 之后，其他模块之前
 * ============================================================================
 */
(function (global) {
  "use strict";

  global.EduToolbox = global.EduToolbox || {};

  /**
   * querySelector 简写
   * @param {string} sel       - CSS 选择器
   * @param {Element} [root]   - 查询根节点，默认 document
   * @returns {Element|null}
   */
  function $(sel, root) {
    return (root || document).querySelector(sel);
  }

  /**
   * querySelectorAll 简写，返回数组
   * @param {string} sel       - CSS 选择器
   * @param {Element} [root]   - 查询根节点，默认 document
   * @returns {Element[]}
   */
  function $$(sel, root) {
    return Array.from((root || document).querySelectorAll(sel));
  }

  /**
   * HTML 转义，防止 XSS
   * @param {string} str - 待转义的字符串
   * @returns {string}
   */
  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  /**
   * 模板缓存（避免重复 fetch 同一模板）
   * @type {Object<string, string>}
   */
  const tplCache = {};

  /**
   * 异步加载 HTML 模板（带缓存）
   * @param {string} name - 模板名（不含扩展名，如 "comment"）
   * @returns {Promise<string>} 模板 HTML 字符串
   * @throws {Error} 当 fetch 失败时抛出
   */
  async function loadTemplate(name) {
    if (tplCache[name]) return tplCache[name];
    const url = `tools/${name}/${name}.html`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`模板加载失败: ${name} (HTTP ${res.status})`);
    const html = await res.text();
    tplCache[name] = html;
    return html;
  }

  global.EduToolbox.utils = { $, $$, escapeHtml, loadTemplate };
})(window);
