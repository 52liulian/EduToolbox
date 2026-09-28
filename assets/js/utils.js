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

  /**
   * 本站来源域名（用于外链 utm_source 标记）
   * 优先级：DB.siteDomain 配置 → 当前页面 hostname → 离线(file://)兜底常量
   * @returns {string} 域名
   */
  function siteDomain() {
    try {
      if (global.DB && global.DB.siteDomain) return global.DB.siteDomain;
      const h = (location.hostname || "").trim();
      if (h) return h;
    } catch (e) { /* 受限环境忽略 */ }
    return "edutoolbox";
  }

  /**
   * 为外链工具 URL 追加来源标记 ?utm_source=<本站域名>
   * 规则：
   *   - 仅处理 http(s) 外链；站内路径(/...)、锚点、mailto/tel、"#" 原样返回
   *   - 已带 utm_source 的不重复追加
   *   - 已有查询串用 & 连接，无查询串用 ? 连接
   *   - 存在 # 片段时，参数拼在片段之前
   * 采用字符串拼接而非 URL 重写，避免改写/再编码原有参数。
   * @param {string} url - 原始 URL
   * @returns {string} 处理后的 URL
   */
  function withUtm(url) {
    if (!url || url === "#") return url;
    if (!/^https?:\/\//i.test(url)) return url;      // 非 http(s) 外链不处理
    if (/[?&]utm_source=/i.test(url)) return url;    // 已有来源标记
    const src = "utm_source=" + encodeURIComponent(siteDomain());
    const hashIdx = url.indexOf("#");
    const base = hashIdx >= 0 ? url.slice(0, hashIdx) : url;
    const hash = hashIdx >= 0 ? url.slice(hashIdx) : "";
    return base + (base.indexOf("?") >= 0 ? "&" : "?") + src + hash;
  }

  global.EduToolbox.utils = { $, $$, escapeHtml, loadTemplate, siteDomain, withUtm };
})(window);
