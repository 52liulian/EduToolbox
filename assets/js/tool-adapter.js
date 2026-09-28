/**
 * EduToolbox · 遗留工具通用挂载适配器（tool-adapter.js）
 * ============================================================================
 * 目的：让「尚未改造成原生组件」的独立工具页，也能以组件方式挂载到站点同一文档中，
 *       不再使用 iframe，同时又不污染站点（样式/脚本双向隔离）。
 *
 * 实现要点：
 *   1. fetch tools/<slug>/index.html → DOMParser 解析（file:// 下 fetch 被拦 → 自动回退 iframe）
 *   2. 样式隔离：挂载到 Shadow DOM，工具 CSS 只在影子树内生效；
 *      并把 html/body/:root 选择器重定位到组件内层 .tool-page，保证原有外观规则仍然命中。
 *   3. 脚本作用域：用 document/window 的 Shim 代理执行工具脚本，
 *      getElementById/querySelector 等只会在组件内部查找，document.body 指向组件内层，
 *      因此工具脚本不会误操作站点 DOM；title 写入被拦截以免篡改站点标题。
 *      所有 window 级监听（如 hashchange）登记在组件名下，卸载时统一移除，
 *      避免组件销毁后回调仍执行导致崩溃。
 *   4. vendor/第三方库按真实 <script> 全局加载（它们只提供全局能力，不碰工具 DOM）；
 *      工具自身脚本（含内联）按文档顺序拼接后统一在 Shim 作用域内执行。
 *   5. DOMContentLoaded/load 类监听立即异步回调（脚本在 DOM 就绪后才执行）。
 *
 * 任一环节异常 → mount() 返回 false，由 toolkit.js 回退 iframe，保证可用性。
 * 加载顺序：toolkit.js 之后、router.js 之前。
 * ============================================================================
 */
(function (global) {
  "use strict";

  var EduT = (global.EduToolbox = global.EduToolbox || {});

  /* ---------- 缓存 ---------- */
  var htmlCache = {};   // slug -> 页面 HTML
  var cssCache = {};    // url   -> CSS 文本
  var jsCache = {};     // url   -> JS 文本
  var vendorLoaded = {};// url   -> true

  /** 当前适配器实例（用于 unmount 清理） */
  var currentInst = null;

  /**
   * 读取「全局配色开关」的当前值（站点顶栏 #accentBtn / localStorage 键 et-accent）
   * theme.js 因故未加载时安全回退 "sky"，绝不抛异常。
   * @returns {string} 主题名
   */
  function readGlobalAccent() {
    try {
      var acc = global.EduToolbox && global.EduToolbox.accent;
      if (acc && typeof acc.get === "function") {
        var v = acc.get();
        if (v) return v;
      }
    } catch (e) { /* 忽略：theme.js 未加载或 localStorage 不可用 */ }
    try {
      var raw = localStorage.getItem("et-accent");
      if (raw) return raw;
    } catch (e) { /* 隐私模式忽略 */ }
    return "sky";
  }

  /**
   * 判定是否为第三方库脚本（走真实全局作用域加载）
   * @param {string} src - 脚本地址
   * @returns {boolean}
   */
  function isVendor(src) {
    return !src || /^https?:/i.test(src) || /vendor\//i.test(src) ||
      /(html2canvas|xlsx|katex|pdf|jspdf|mammoth|jszip|qrcode|echarts|pinyin|chart|jquery|d3|three)/i.test(src);
  }

  /**
   * 相对地址按工具目录还原为站点可访问地址
   * @param {string} url  - 原始地址
   * @param {string} slug - 工具 slug
   * @returns {string}
   */
  function resolveUrl(url, slug) {
    if (!url) return url;
    if (/^(https?:|data:|blob:|#|javascript:|mailto:)/i.test(url)) return url;   // 绝对/特殊协议原样
    if (/^\//.test(url)) return url.replace(/^\/+/, "");                          // 站点根路径
    /* 工具三件套里用 `../../assets/...` 回指站点资源，需还原为站点根路径。
       ⚠️ 历史事故：早期直接 `replace(/^(\.\.\/)+/,"")` 后再拼 `tools/<slug>/`，
       会把 `../../assets/css/tool-common.css` 错拼成
       `tools/<slug>/assets/css/tool-common.css` → 404 → 公共底座静默丢失
       （主题变量 + .container 宽度全没了，页面明显变窄）。此处必须先还原层级。 */
    if (/^\.\.\//.test(url)) return url.replace(/^(\.\.\/)+/, "");
    return "tools/" + slug + "/" + url;
  }

  /**
   * 抓取文本
   * @param {string} url - 地址
   * @returns {Promise<string>}
   */
  async function fetchText(url) {
    var res = await fetch(url);
    if (!res.ok) throw new Error("资源加载失败: " + url + " (HTTP " + res.status + ")");
    return await res.text();
  }

  /* ==========================================================================
   * file:// 预打包资源（bundle）
   * --------------------------------------------------------------------------
   * file:// 下各页面互为不透明源，fetch/XHR 一律被 CORS 拦掉 —— 适配器取不到
   * index.html，84 个工具只能回退 <iframe> 兜底，于是带来两个硬伤：
   *   ① 工具区高度被父页写死（router.js 的 innerHeight-150），内容再多也不撑开；
   *   ② iframe 内 requestFullscreen 被权限策略拒绝，⛶ 只能降级伪全屏。
   * 但 <script src="本地文件"> 不受 CORS 限制。因此构建脚本
   * （.workbuddy/scripts/build_tool_bundles.py）为每个工具生成
   * `tools/<slug>/<slug>.bundle.js`，把 index.html 与本地 CSS/JS 文本内联其中；
   * file:// 下本模块改用 script 标签把它加载进来，随后走与 http 完全相同的
   * Shadow DOM 组件化链路 —— 高度随内容自动撑开、⛶ 真全屏、主题/打印全部生效。
   *
   * http(s) 下 fetch 正常，永远走原路径（不加载 bundle，零额外开销）。
   * ======================================================================== */
  var bundles = {};        // slug -> bundle 对象
  var bundleTried = {};    // slug -> 是否已尝试过（失败的也记，避免每次导航重试）

  /**
   * 当前是否需要走 bundle（file:// 下 fetch 必然失败）
   * @returns {boolean}
   */
  function needBundle() {
    try {
      return (global.location && global.location.protocol === "file:");
    } catch (e) { return false; }
  }

  /**
   * 用 <script> 标签加载一个本地脚本（file:// 下不受 CORS 限制）
   * @param {string} src - 脚本地址
   * @returns {Promise<void>}
   */
  function loadScriptTag(src) {
    return new Promise(function (resolve, reject) {
      var s = document.createElement("script");
      s.src = src;
      s.async = true;
      var timer = setTimeout(function () { reject(new Error("超时: " + src)); }, 8000);
      s.onload = function () { clearTimeout(timer); resolve(); };
      s.onerror = function () { clearTimeout(timer); reject(new Error("加载失败: " + src)); };
      document.head.appendChild(s);
    });
  }

  /**
   * 确保 file:// 下已就绪该工具的打包资源
   * @param {string} slug - 工具 slug
   * @returns {Promise<object|null>} bundle 对象；http 或不可用时返回 null
   */
  async function ensureBundle(slug) {
    if (bundles[slug]) return bundles[slug];
    if (bundleTried[slug]) return bundles[slug] || null;
    bundleTried[slug] = true;
    try {
      await loadScriptTag("tools/" + slug + "/" + slug + ".bundle.js");
      var reg = global.EduToolboxToolBundles;
      var b = reg && reg[slug];
      if (b && b.html) bundles[slug] = b;
    } catch (e) { /* 无 bundle → 回退 iframe */ }
    return bundles[slug] || null;
  }

  /**
   * 取资源文本：优先命中 bundle 内联内容，否则走 fetch
   * @param {string} url  - 站点相对路径（已过 resolveUrl）
   * @param {string} slug - 工具 slug
   * @returns {Promise<string>}
   */
  async function getText(url, slug) {
    var b = bundles[slug];
    if (b && b.files && Object.prototype.hasOwnProperty.call(b.files, url)) {
      return b.files[url];
    }
    return await fetchText(url);
  }

/**
 * CSS 重定位：处理 Shadow DOM 内不存在 html / body 的问题
 * ----------------------------------------------------------------------------
 * 历史教训（2026-09-21 页面变窄事故）：
 *   早期实现把 html|body 直接替换成 .tool-page，导致两类严重问题——
 *   1) 工具里常见的 `body[data-theme="sky"]{--primary:…}` 被改写成
 *      `.tool-page[data-theme="sky"]`，与工具 JS 实际执行的
 *      `document.body.setAttribute("data-theme", …)` 对不上，
 *      同时把 `body{--primary:…}` 的默认值覆盖也一并杀掉，强调色全部失效；
 *   2) 更致命的是 `body{--primary:#3b6ef6}` 这类默认变量丢失后，站点
 *      `:root` 上的同名 Bootstrap `--primary` 会穿透进影子树，
 *      而 Bootstrap 的 `.container{--bs-gutter-x:1.5rem;padding:0 12px}`
 *      也随之生效 —— 与工具自身 `.container{padding:0 24px}` 叠加成
 *      双层内边距，内容被明显压窄。
 * 正确做法：html|body 统一映射到 `:host`（外层 .tool-page 是影子宿主，
 *   工具脚本里的 document.body 在 Shim 中就等于该元素），
 *   由 .tool-page 承载 data-theme，选择器自然命中，变量继承链完整。
 * @param {string} css - 原始 CSS
 * @returns {string}
 */
function rebaseCss(css) {
  if (!css) return "";
  return rebaseRules(css);
}

/**
 * 媒体查询感知的选择器重定位
 * ----------------------------------------------------------------------------
 * 早期实现是一条扁平正则直接替换 html|body，会把 `@media print { … }` 的
 * 大括号结构一起打散——打印专用的 `.container{padding:0;max-width:none}`
 * 因此脱离媒体上下文进入常规作用域，导致挂载后内容铺满贴边（历史事故）。
 *
 * 这里改为先按「媒体查询块」切分：{@media …} 内的规则原样保留（打印样式只在
 * 打印时生效，无需重定位），只对媒体块之外的顶层规则做 html|body → :host。
 * @param {string} css - 原始 CSS
 * @returns {string}
 */
function rebaseRules(css) {
  var out = [];
  var i = 0;
  var len = css.length;

  while (i < len) {
    /* 定位下一个 @media（或其它 at-rule）起点 */
    var at = css.indexOf("@media", i);
    /* 先把 at 之前的普通样式段做重定位 */
    if (at < 0) {
      out.push(rebasePlain(css.slice(i)));
      break;
    }
    out.push(rebasePlain(css.slice(i, at)));

    /* 读取该 at-rule 的前导（@media screen and (max-width:640px)）到第一个 { */
    var brace = css.indexOf("{", at);
    if (brace < 0) { out.push(css.slice(at)); break; }
    var prelude = css.slice(at, brace + 1);

    /* 从 brace 开始做花括号配对，取出完整块体（容忍字符串内的括号） */
    var depth = 1;
    var j = brace + 1;
    var inStr = null;
    while (j < len && depth > 0) {
      var ch = css.charAt(j);
      if (inStr) {
        if (ch === "\\") { j += 2; continue; }
        if (ch === inStr) inStr = null;
      } else if (ch === '"' || ch === "'") {
        inStr = ch;
      } else if (ch === "{") {
        depth++;
      } else if (ch === "}") {
        depth--;
      }
      j++;
    }
    var body = css.slice(brace + 1, j - 1);

    /* 媒体块内：仍要重定位 html|body（:host 在 @media 内合法且必要），
       但不改变块结构——这样打印规则继续被 @media print 正确包裹。 */
    out.push(prelude + rebasePlain(body) + "}");
    i = j;
  }
  return out.join("");
}

/**
 * 顶层/块内通用重定位：html|body/:root → :host
 * @param {string} css
 * @returns {string}
 */
function rebasePlain(css) {
  if (!css) return "";
  return css
    .replace(/(^|[\s,>+~{(])(html|body)\b/gi, function (m, pre) { return pre + ":host"; })
    .replace(/:root\b/g, ":host");
}

/**
 * 公共底座 tool-common.css 在影子树内的降级兜底
 * ----------------------------------------------------------------------------
 * 六色主题变量与 .container/.btn 等基础类都定义在 tool-common.css 中，
 * 它被 fetch 失败时（或工具页漏引入时）组件会退化成「无主题 + 无容器宽度」，
 * 表现为整块内容贴边或宽度异常。这里提供最小可用的等价兜底。
 * @returns {string}
 */
function baseFallbackCss() {
  return [
    ":host{display:block;width:100%}",
    ".tool-page{display:block;width:100%;min-height:120px;background:var(--bg,#eef2fa);color:var(--text-1,#1f2733);",
    "font-family:-apple-system,BlinkMacSystemFont,'Segoe UI','PingFang SC','Hiragino Sans GB','Microsoft YaHei',system-ui,sans-serif;line-height:1.65}",
    ".tool-page .container{width:100%;max-width:1180px;margin:0 auto;padding:28px 24px 56px;box-sizing:border-box}",
    ".tool-page *,.tool-page *::before,.tool-page *::after{box-sizing:border-box}",
    ":host[data-theme=\"sky\"]{--primary:#0ea5e9;--primary-soft:#e0f2fe;--primary-grad:linear-gradient(135deg,#38bdf8,#0ea5e9,#0284c7)}",
    ":host[data-theme=\"violet\"]{--primary:#7c3aed;--primary-soft:#f0e9fe;--primary-grad:linear-gradient(135deg,#8b5cf6,#7c3aed,#6d28d9)}",
    ":host[data-theme=\"green\"]{--primary:#16a34a;--primary-soft:#e7f6ec;--primary-grad:linear-gradient(135deg,#22c55e,#16a34a,#15803d)}",
    ":host[data-theme=\"gold\"]{--primary:#d97706;--primary-soft:#fdf1dc;--primary-grad:linear-gradient(135deg,#f59e0b,#d97706,#b45309)}",
    ":host[data-theme=\"orange\"]{--primary:#ea580c;--primary-soft:#ffefe4;--primary-grad:linear-gradient(135deg,#fb923c,#ea580c,#c2410c)}",
    ":host[data-theme=\"pink\"]{--primary:#db2777;--primary-soft:#fce7f0;--primary-grad:linear-gradient(135deg,#f472b6,#db2777,#be185d)}"
  ].join("\n");
}

  /**
   * 重写节点内相对资源地址（img/src/href）
   * @param {Element} root - 根节点
   * @param {string} slug  - 工具 slug
   * @returns {void}
   */
  function rewriteAttrs(root, slug) {
    var nodes = root.querySelectorAll("[src],[href]");
    Array.prototype.forEach.call(nodes, function (el) {
      ["src", "href"].forEach(function (attr) {
        var v = el.getAttribute(attr);
        if (!v) return;
        if (/^(https?:|data:|#|javascript:|mailto:)/i.test(v)) return;
        if (/^\//.test(v)) { el.setAttribute(attr, v.replace(/^\/+/, "")); return; }
        el.setAttribute(attr, resolveUrl(v, slug));
      });
    });
  }

/**
 * 打印页规（@page）的提取 / 钳制 / 镜像
 * ----------------------------------------------------------------------------
 * 背景：Shadow DOM 内的 @page 规则对文档打印无效（页规必须落在文档级样式表）。
 *
 * 历史缺陷（2026-09-23 打印专项，本次修复）：
 *   1) 只认 <style id="pageRule"> —— 全站 9 个声明了 @page 的工具里只有
 *      paper-grid 用了这个 id，其余 8 个（award-generator / grade-analyzer /
 *      kousuan / kechengbiao / kechengbiao2 / score-dashboard / 100neijiajian /
 *      sudoku-pdf-batch）把 @page 写在 .css 文件或普通内联 <style> 里，
 *      挂进 Shadow DOM 后文档级打印读不到 → 实测「9 个写、0 个生效」。
 *   2) paper-grid 的 <style id="pageRule"> 是空壳，且适配器只把 <style> 的
 *      textContent 合并进影子树、元素本身从未进入影子树 —— 工具脚本里的
 *      document.getElementById("pageRule") 恒为 null，动态写入的 A4/A5/B5
 *      尺寸永远失败，1:1 稿纸打印在站点内是彻底坏的。
 *
 * 修复策略：
 *   ① 从「工具全部 CSS 文本」里抽 @page，不再只认 pageRule 这个 id；
 *   ② 在影子树里真实插入一个 <style id="pageRule"> 元素，并用 MutationObserver
 *      监听其内容变化、实时重新镜像（docShim 的 getElementById 走
 *      shadow.getElementById，因此工具脚本拿得到它）；
 *   ③ 镜像前统一钳制 margin：任何 >6mm 的分量压到 6mm，统一各工具的可打印区；
 *      **size / 方向等声明原样保留**（尊重工具原始打印参数）。
 *
 * ⚠️ 2026-09-23 实测更正（旧注释是错的，别再照它修）：
 *     钳制 margin 的初衷原本是「防止 Chromium 在页边距区域重新画出页眉页脚」。
 *     headless 实测推翻了这条：同一份内容在 margin 0 / 6 / 20mm 三档下，
 *     displayHeaderFooter 打开带来的 PDF 体积增量分别为 +12.4 / +12.6 / +12.6 KB，
 *     页眉页脚**照画不误** —— 它是打印对话框的开关，CSS 关不掉。
 *     钳制保留下来的唯一真实理由是「统一各工具的可打印区」；已知代价是会把
 *     非对称 margin（如 15mm 10mm）压成统一的 6mm，损失工具作者的原始意图。
 */

/** 打印页边距上限（mm）：仅用于统一可打印区，与浏览器页眉页脚无关 */
var PAGE_MARGIN_LIMIT_MM = 6;

/**
 * 从任意 CSS 文本里抽出全部 @page 块（原文保留、按字面去重）
 * @param {string} css - CSS 文本
 * @returns {Array<string>} @page 块数组（无则空数组）
 */
function extractPageRules(css) {
  var out = [];
  if (!css) return out;
  /* 全文匹配即可：即使 @page 被 @media print { … } 包裹也能命中；
     裸 @page 本身只对打印生效，无需还原媒体上下文。 */
  var re = /@page[^{]*\{[^}]*\}/g;
  var m = re.exec(css);
  while (m !== null) {
    if (out.indexOf(m[0]) < 0) out.push(m[0]);
    m = re.exec(css);
  }
  return out;
}

/**
 * CSS 长度字面量 → 毫米；无法识别（百分比 / auto / var() / 空）时返回 null，
 * 由调用方按「保守钳制」处理
 * @param {string} v - 长度字面量，如 "12mm" / "1cm" / "0.5in" / "0"
 * @returns {number|null}
 */
function lengthToMm(v) {
  var s = String(v === null || v === undefined ? "" : v).replace(/^\s+|\s+$/g, "").toLowerCase();
  if (!s) return null;
  var m = s.match(/^(-?\d*\.?\d+)\s*(mm|cm|in|pt|pc|px|q)?$/);
  if (!m) return null;            // 百分比 / auto / var() 等 → 保守钳制
  var n = parseFloat(m[1]);
  if (isNaN(n)) return null;
  var u = m[2] || "mm";           // 无单位数字按 mm 处理（margin:0 也走这里）
  if (u === "mm") return n;
  if (u === "cm") return n * 10;
  if (u === "in") return n * 25.4;
  if (u === "pt") return n * 25.4 / 72;
  if (u === "pc") return n * 25.4 / 6;
  if (u === "px") return n * 25.4 / 96;
  if (u === "q") return n * 0.25;
  return n;
}

/**
 * 单个 @page 块的 margin 钳制
 * ⚠️ 只动 margin / margin-*，size 与其它声明一律原样保留 —— 工具自己声明的
 *    纸张尺寸与方向是「尊重工具原始打印参数」的核心，绝不能被改写。
 * @param {string} block - 形如 "@page{size:A4; margin:12mm}" 的整块
 * @returns {string}
 */
function clampPageRule(block) {
  var open = block.indexOf("{");
  var close = block.lastIndexOf("}");
  if (open < 0 || close <= open) return block;
  var prelude = block.slice(0, open + 1);
  var decls = block.slice(open + 1, close).split(";");
  var out = [];
  for (var i = 0; i < decls.length; i++) {
    var d = String(decls[i]).replace(/^\s+|\s+$/g, "");
    var ms = /^margin\s*:/i.exec(d);
    if (ms) {
      var vals = d.slice(ms[0].length).split(/\s+/);
      var maxMm = 0;
      var unsure = false;
      for (var k = 0; k < vals.length; k++) {
        var one = String(vals[k]).replace(/^\s+|\s+$/g, "");
        if (!one) continue;
        var num = lengthToMm(one);
        if (num === null) { unsure = true; continue; }
        if (num > maxMm) maxMm = num;
      }
      out.push((maxMm > PAGE_MARGIN_LIMIT_MM || unsure) ? ("margin: " + PAGE_MARGIN_LIMIT_MM + "mm") : d);
      continue;
    }
    var ml = /^margin-(top|right|bottom|left)\s*:/i.exec(d);
    if (ml) {
      var raw = d.slice(ml[0].length).replace(/^\s+|\s+$/g, "");
      var n2 = lengthToMm(raw);
      out.push((n2 === null || n2 > PAGE_MARGIN_LIMIT_MM)
        ? ("margin-" + ml[1].toLowerCase() + ": " + PAGE_MARGIN_LIMIT_MM + "mm")
        : d);
      continue;
    }
    out.push(d);
  }
  return prelude + out.join("; ") + "}";
}

/**
 * 抽出 CSS 文本里的全部 @page 块并钳制 margin，拼成可直接镜像的样式文本
 * @param {string} css - CSS 文本
 * @returns {string} 处理后文本（无 @page 则空串）
 */
function clampPageMargins(css) {
  var blocks = extractPageRules(css);
  if (!blocks.length) return "";
  var out = [];
  for (var i = 0; i < blocks.length; i++) out.push(clampPageRule(blocks[i]));
  return out.join("\n");
}

/**
 * 汇总工具全部 CSS 文本里的 @page 原文（未钳制，供影子树 #pageRule 播种）
 * @param {Array<string>} cssTexts - 原始 CSS 文本列表
 * @returns {string} @page 原文（去重后换行拼接）
 */
function collectPageRuleRaw(cssTexts) {
  var out = [];
  if (!cssTexts || !cssTexts.length) return "";
  for (var i = 0; i < cssTexts.length; i++) {
    var blocks = extractPageRules(cssTexts[i]);
    for (var k = 0; k < blocks.length; k++) {
      if (out.indexOf(blocks[k]) < 0) out.push(blocks[k]);
    }
  }
  return out.join("\n");
}

/**
 * 把页规写入/移出站点 <head>（供打印使用）
 * @param {string} css - @page 规则文本；空串表示移除
 * @returns {void}
 */
function applyPageRule(css) {
  var id = "edutoolbox-tool-pagerule";
  var old = document.getElementById(id);
  if (old && old.parentNode) old.parentNode.removeChild(old);
  if (!css) return;
  var s = document.createElement("style");
  s.id = id;
  s.textContent = css;
  document.head.appendChild(s);
}

/**
 * 加载第三方库（真实全局作用域，按 src 去重）
   * @param {string} src - 脚本地址
   * @returns {Promise<void>}
   */
  function loadVendor(src) {
    if (vendorLoaded[src]) return Promise.resolve();
    return new Promise(function (resolve) {
      var done = false;
      /**
       * 结束加载（成功/失败/超时都放行）
       * 超时兜底很关键：CDN 被墙或脚本 404 时 onload/onerror 可能都不触发，
       * 若死等会把工具挂载流程整个卡住。
       * @returns {void}
       */
      function finish() {
        if (done) return;
        done = true;
        vendorLoaded[src] = true;
        resolve();
      }
      var s = document.createElement("script");
      s.src = src;
      s.onload = finish;
      s.onerror = finish;
      document.head.appendChild(s);
      setTimeout(finish, 4000);
    });
  }

  /**
   * 构造 document Shim：把 DOM 查询限定在组件影子树内
   * @param {ShadowRoot} shadow - 影子树根
   * @param {Element} inner     - 组件内层容器（充当 body/documentElement）
   * @returns {Proxy}
   */
  function makeDocShim(shadow, inner) {
    var realDoc = document;
    var shadowHead = document.createElement("div");
    shadowHead.style.display = "none";
    shadow.appendChild(shadowHead);
    var titleValue = "";

    /* 主题属性同步（2026-09-21 修复「适配器工具主题按钮点了没反应」）
     * ------------------------------------------------------------------
     * 症状：工具 CSS 里的 `body[data-theme="violet"]{--primary:…}` 已被
     *       rebaseCss 重定向成 `:host[data-theme="violet"]`（:host = 影子树宿主
     *       #toolMount）；而工具 JS 写的是 document.body.setAttribute(...)，
     *       Shim 的 body 指向 inner(.tool-page) —— 写属性的元素与选择器命中的
     *       元素不是同一个，于是六个主题色里只有宿主初始值那个生效。
     *       实测：award-generator 连点主题按钮 7 次，--primary 恒为 #0ea5e9。
     * 做法：只同步 data-theme 这一个属性（写入 + 删除），其余一律原样。
     *       直接在 inner 这个元素实例上打补丁，而不是换掉 document.body 的指向
     *       或用 Proxy 包一层 —— 这样 document.body === inner 的同一性不变，
     *       appendChild / classList / scrollTop / instanceof 等已跑通的行为
     *       完全不受影响，切面最小。
     * 卸载：unmount() 里已有 host.removeAttribute("data-theme")，与此处对称，
     *       且 inner 随影子树一起销毁，补丁不会残留到下一个工具。 */
    var themeHost = shadow.host || null;
    var rawSetAttr = inner.setAttribute.bind(inner);
    var rawRemoveAttr = inner.removeAttribute.bind(inner);
    inner.setAttribute = function (name, value) {
      rawSetAttr(name, value);
      if (themeHost && String(name).toLowerCase() === "data-theme") {
        try { themeHost.setAttribute(name, value); } catch (e) { /* 宿主已卸载：忽略 */ }
      }
    };
    inner.removeAttribute = function (name) {
      rawRemoveAttr(name);
      if (themeHost && String(name).toLowerCase() === "data-theme") {
        try { themeHost.removeAttribute(name); } catch (e) { /* 宿主已卸载：忽略 */ }
      }
    };

    return new Proxy(realDoc, {
      get: function (t, p) {
        switch (p) {
          case "getElementById":
            return function (id) { return shadow.getElementById(id) || null; };
          case "querySelector":
            return function (s) { return shadow.querySelector(s); };
          case "querySelectorAll":
            return function (s) { return shadow.querySelectorAll(s); };
          case "getElementsByClassName":
            return function (c) { return shadow.getElementsByClassName(c); };
          case "getElementsByTagName":
            return function (g) { return shadow.getElementsByTagName(g); };
          case "getElementsByName":
            return function (n) { return shadow.getElementsByName ? shadow.getElementsByName(n) : shadow.querySelectorAll('[name="' + n + '"]'); };
          case "body":
          case "documentElement":
            return inner;
          case "head":
            return shadowHead;
          case "readyState":
            return "complete";
          case "title":
            return titleValue;
          case "addEventListener":
            return function (type, fn, opts) {
              // 脚本执行时 DOM 已就绪：就绪类事件立即异步回调，避免工具永远等不到初始化
              if (type === "DOMContentLoaded" || type === "readystatechange") {
                setTimeout(function () { try { fn({ type: type }); } catch (e) { /* 忽略 */ } }, 0);
                return;
              }
              shadow.addEventListener(type, fn, opts);
            };
          case "removeEventListener":
            return function (type, fn, opts) { shadow.removeEventListener(type, fn, opts); };
          case "createElement":
          case "createElementNS":
          case "createTextNode":
          case "createDocumentFragment":
          case "createComment":
          case "importNode":
          case "adoptNode":
            return function () { return realDoc[p].apply(realDoc, arguments); };
        }
        var v = t[p];
        if (typeof v === "function") return v.bind(t);
        return v;
      },
      set: function (t, p, v) {
        if (p === "title") { titleValue = v; return true; }  // 拦截：不篡改站点标题
        try { t[p] = v; } catch (e) { /* 只读属性忽略 */ }
        return true;
      }
    });
  }

  /**
   * 构造 window Shim
   * ----------------------------------------------------------------------------
   * 1) load/DOMContentLoaded 立即异步回调（脚本在 DOM 就绪后才执行）
   * 2) **其余事件的监听登记到本组件的登记表**，而非直接绑到真实 window。
   *    历史缺陷：早期实现把 hashchange/scroll 等直通真实 window，组件卸载后
   *    监听仍然存活，工具的路由处理函数在影子树已销毁的情况下继续执行，
   *    出现 `Cannot set properties of null (setting 'className')` 之类的崩溃，
   *    并可能误操作站点 DOM。现在统一登记，卸载时一并移除。
   * 3) **document 必须与注入给脚本的那个 docShim 是同一个对象**。
   *    历史缺陷（2026-09-22 舞台工具栏失效）：脚本是通过
   *    `new Function("document","window", code)` 注入的，`document` 形参是 docShim
   *    （查询限定在影子树内），但 `window.document` 走的是 Proxy 默认分支、返回真实
   *    document。于是任何用 `window.document.querySelector(...)` 的公共库在站点内嵌
   *    模式下都取不到自身 DOM，静默失效。此处显式把两者对齐。
   * @param {Array} registry - 监听登记表 [{type, fn, opts}]
   * @param {Proxy} [docShim] - 与本次执行配对的 docShim（存在时 window.document 返回它）
   * @returns {Proxy}
   */
  function makeWinShim(registry, docShim) {
    var realWin = window;
    var reg = registry || [];
    return new Proxy(realWin, {
      get: function (t, p) {
        if (p === "document" && docShim) return docShim;
        if (p === "addEventListener") {
          return function (type, fn, opts) {
            if (type === "load" || type === "DOMContentLoaded") {
              setTimeout(function () { try { fn({ type: type }); } catch (e) { /* 忽略 */ } }, 0);
              return;
            }
            /* 登记 + 真实绑定，便于卸载时精确移除 */
            reg.push({ type: type, fn: fn, opts: opts });
            t.addEventListener(type, fn, opts);
          };
        }
        if (p === "removeEventListener") {
          return function (type, fn, opts) {
            for (var i = reg.length - 1; i >= 0; i--) {
              if (reg[i].type === type && reg[i].fn === fn) reg.splice(i, 1);
            }
            t.removeEventListener(type, fn, opts);
          };
        }
        var v = t[p];
        if (typeof v === "function") return v.bind(t);
        return v;
      }
    });
  }

  /**
   * 移除某个组件登记的全部 window 级监听
   * @param {Array} registry - makeWinShim 收集的登记表
   * @returns {void}
   */
  function teardownWinListeners(registry) {
    if (!registry) return;
    for (var i = 0; i < registry.length; i++) {
      try { window.removeEventListener(registry[i].type, registry[i].fn, registry[i].opts); } catch (e) { /* 忽略 */ }
    }
    registry.length = 0;
  }

  /**
   * 以组件方式挂载一个遗留工具页
   * @param {string} slug      - 工具 slug
   * @param {HTMLElement} host - 挂载宿主（站点内的容器元素）
   * @returns {Promise<boolean>} true=挂载成功；false=应回退 iframe
   */
  async function mount(slug, host) {
    if (!host || !host.attachShadow) return false;   // 不支持 Shadow DOM → 回退

    /* 1) 取页面
       file:// 下 fetch 被 CORS 拦死，改从预打包 bundle 取（见 ensureBundle 注释）；
       http(s) 下 bundle 为 null，仍走 fetch，行为与改造前完全一致。 */
    if (needBundle()) await ensureBundle(slug);
    if (!htmlCache[slug]) {
      var bdl = bundles[slug];
      htmlCache[slug] = (bdl && bdl.html) ? bdl.html : await fetchText("tools/" + slug + "/index.html");
    }
    var parsed = new DOMParser().parseFromString(htmlCache[slug], "text/html");
    if (!parsed || !parsed.body) return false;

    /* 2) 收集样式（内联 <style> + 外链 css），并做选择器重定位
       —— 外链里的 tool-common.css（公共底座：主题变量 + .container/.btn 等）
          必须一并注入影子树，否则组件会丢掉容器宽度与主题色，页面明显变窄。 */
    var styleParts = [];
    var rawCssParts = [];   // 未经 rebaseCss 的原文：抽 @page 必须用原文（重定位会改写 html/body）
    var hasCommonBase = false;
    Array.prototype.forEach.call(parsed.querySelectorAll("style"), function (s) {
      var raw = s.textContent || "";
      rawCssParts.push(raw);
      styleParts.push(rebaseCss(raw));
    });
    var links = Array.prototype.slice.call(parsed.querySelectorAll('link[rel="stylesheet"]'));
    for (var i = 0; i < links.length; i++) {
      var href = resolveUrl(links[i].getAttribute("href"), slug);
      if (/tool-common\.css/i.test(href)) hasCommonBase = true;
      try {
        if (!cssCache[href]) cssCache[href] = await getText(href, slug);
        rawCssParts.push(cssCache[href] || "");
        styleParts.push(rebaseCss(cssCache[href]));
      } catch (e) { /* 单个样式失败不阻断 */ }
    }
    // 工具自身样式放在最后，保证能覆盖公共底座
    /* 兜底顺序：底座降级 → :host 宽度锁定 → 组件重置 */
    // 底座缺失（未引入或抓取失败）时补一份最小等价样式，避免无主题 + 无宽度
    if (!hasCommonBase) styleParts.unshift(baseFallbackCss());
    // :host 兜底宽度（组件宿主在站点里是 .tool-iframe-wrap，无自身宽度约束）
    /* ⚠️ 高度策略（2026-09-23 需求「工具区随内容自动撑开、不要固定高度」）：
       不少工具为「独立双击打开」写了 `body{min-height:100vh}` / `body{height:100vh}`
       让整页铺满视口；经本模块 rebase 后这些声明落在 :host（= 站点里的挂载容器）
       上，于是工具内容只有 600px 也把容器撑成一整屏，下方留一大截空白。
       站点内挂载时容器高度应由内容决定，故在工具 CSS 之后补一条同选择器的
       :host 高度重置（同特异性、后加载者赢），把整屏高度收回。
       独立页 / iframe 兜底没有影子根，:host 不匹配，规则自动空转，
       工具原本的满屏设计不受影响。 */
    styleParts.push(":host{display:block;width:100%;height:auto;min-height:0}");
    // 兜底：极简重置，保证工具区与站点不互相干扰
    styleParts.push(".tool-page{display:block;min-height:120px}");
    /* 从工具全部 CSS（内联 style + 外链 .css）里抽 @page，不再只认 pageRule 这个 id */
    var pageRuleRaw = collectPageRuleRaw(rawCssParts);

    /* 3) 建立影子树与内层容器 */
    var shadow = host.attachShadow({ mode: "open" });
    var inner = document.createElement("div");
    inner.className = "tool-page";
    /* 宿主归入 .tool-root 作用域：与 native 路径共用同一套隔离/层叠兜底样式
       （见 tool-mount-base.css 的「挂载容器隔离」段）——这里补的是 Shadow DOM
       之外那一层：工具内的 position:fixed 浮层与 z-index:900/1000/1200
       会被困在宿主构成的独立层叠上下文里，不会越级盖住站点顶栏。 */
    host.classList.add("tool-root");
    /* 宿主也带上 data-theme：:host[data-theme] 变量与 .tool-page 双保险。
       兜底值改为读取「全局配色开关」（站点顶栏 #accentBtn → localStorage 键 et-accent），
       原来是硬编码 "sky"，导致站点层切换对这 20 个 adapter 工具完全无效。 */
    var pageTheme = (parsed.documentElement && parsed.documentElement.getAttribute("data-theme")) ||
      (parsed.body && parsed.body.getAttribute("data-theme")) || "";
    host.setAttribute("data-theme", pageTheme || readGlobalAccent());
    var theme = pageTheme || readGlobalAccent();
    if (theme) inner.setAttribute("data-theme", theme);
    /* 注：data-theme 同步到宿主由 makeDocShim() 内的 patchThemeAttr() 负责
       （拦截 inner 的 setAttribute/removeAttribute），此处不再重复实现。 */

    var styleEl = document.createElement("style");
    styleEl.textContent = styleParts.join("\n");
    shadow.appendChild(styleEl);

    /* 4) 注入 body 内容（剔除脚本，脚本稍后在 Shim 作用域执行） */
    var bodyClone = parsed.body.cloneNode(true);
    Array.prototype.forEach.call(bodyClone.querySelectorAll("script"), function (s) {
      if (s.parentNode) s.parentNode.removeChild(s);
    });
    rewriteAttrs(bodyClone, slug);
    while (bodyClone.firstChild) inner.appendChild(bodyClone.firstChild);
    shadow.appendChild(inner);

    /* 4.1) 页规镜像：Shadow 内的 @page 无效，必须提到文档级
       ① 在影子树里真实插入 <style id="pageRule"> —— docShim 的 getElementById
          走 shadow.getElementById，工具脚本里的 document.getElementById("pageRule")
          因此能拿到元素，paper-grid 的动态 A4/A5/B5 写入链路才通；
       ② MutationObserver 监听其内容变化，变化时重新镜像（脚本在步骤 5/6 才执行，
          此处的监听已提前就位，不会漏掉首次 build()）；
       ③ 镜像前统一钳制 margin，任何工具都不冒出浏览器页眉页脚，size 原样保留。 */
    var pageStyleEl = document.createElement("style");
    pageStyleEl.id = "pageRule";
    pageStyleEl.textContent = pageRuleRaw || "";
    shadow.appendChild(pageStyleEl);

    /* 上一个实例残留的观察者先撤掉，避免两套页规互相覆盖 */
    try {
      if (currentInst && currentInst.pageObserver) {
        currentInst.pageObserver.disconnect();
        currentInst.pageObserver = null;
      }
    } catch (e) { /* 忽略 */ }

    var pageObserver = null;
    /**
     * 重新计算并镜像页规 = 静态 @page 原文 + 影子树 #pageRule 当前内容
     * @returns {void}
     */
    function syncPageRule() {
      try {
        var txt = (pageRuleRaw || "") + "\n" + (pageStyleEl.textContent || "");
        applyPageRule(clampPageMargins(txt));
      } catch (e) { /* 页规失败绝不能影响挂载 */ }
    }
    try {
      if (typeof MutationObserver === "function") {
        pageObserver = new MutationObserver(function () { syncPageRule(); });
        pageObserver.observe(pageStyleEl, { childList: true, characterData: true, subtree: true });
      }
    } catch (e) { pageObserver = null; }
    syncPageRule();

    /* 5) 按文档顺序收集并执行脚本 */
    var scripts = Array.prototype.slice.call(parsed.querySelectorAll("script"));
    var vendorUrls = [];      // 第三方库：并行加载（真实全局作用域）
    var pending = [];         // 工具自身脚本：按文档顺序收集
    for (var j = 0; j < scripts.length; j++) {
      var sc = scripts[j];
      var src = sc.getAttribute("src");
      if (src) {
        var url = resolveUrl(src, slug);
        if (isVendor(src)) {
          vendorUrls.push(url);
        } else {
          pending.push({ order: j, url: url });
        }
      } else if (sc.textContent && sc.textContent.trim()) {
        pending.push({ order: j, code: sc.textContent });
      }
    }
    if (vendorUrls.length) await Promise.all(vendorUrls.map(loadVendor));

    var ownParts = [];
    for (var k = 0; k < pending.length; k++) {
      var it = pending[k];
      if (it.code) { ownParts.push(it.code); continue; }
      try {
        if (!jsCache[it.url]) jsCache[it.url] = await getText(it.url, slug);
        ownParts.push(jsCache[it.url]);
      } catch (e) { /* 取不到则跳过 */ }
    }

    /* 6) 在作用域 Shim 内执行工具自身脚本 */
    var winListeners = [];              // 本组件登记的 window 级监听
    if (ownParts.length) {
      var code = ownParts.join("\n;\n");
      try {
        var fn = new Function("document", "window", code + "\n//# sourceURL=tool://" + slug);
        var docShim = makeDocShim(shadow, inner);
        fn(docShim, makeWinShim(winListeners, docShim));
      } catch (e) {
        console.warn("[adapter] 脚本执行失败:", slug, e && e.message);
        teardownWinListeners(winListeners);
        /* 挂载失败 → 一并撤掉页规镜像与监听，避免残留影响后续工具的打印 */
        try { if (pageObserver) pageObserver.disconnect(); } catch (e2) { /* 忽略 */ }
        try { applyPageRule(""); } catch (e2) { /* 忽略 */ }
        currentInst = null;
        return false;
      }
    }

    currentInst = {
      slug: slug, host: host, shadow: shadow, inner: inner,
      winListeners: winListeners, pageObserver: pageObserver, pageStyleEl: pageStyleEl
    };
    return true;
  }

  /**
   * 卸载当前适配器挂载的组件
   * @returns {void}
   */
  function unmount() {
    if (!currentInst) return;
    try {
      var host = currentInst.host;
      /* 先摘掉组件登记的 window 级监听：否则 hashchange 等事件仍会回调已销毁
         组件里的处理函数，触发 null 引用崩溃（历史事故）。 */
      teardownWinListeners(currentInst.winListeners);
      // 清空宿主（Shadow Root 无法移除，重建一个空影子树覆盖）
      if (host.shadowRoot) {
        while (host.shadowRoot.firstChild) host.shadowRoot.removeChild(host.shadowRoot.firstChild);
      }
      // 撤销页规镜像，避免影响其它页面的打印
      try { if (currentInst.pageObserver) currentInst.pageObserver.disconnect(); } catch (e) { /* 忽略 */ }
      applyPageRule("");
      try { host.removeAttribute("data-theme"); host.classList.remove("tool-root"); } catch (e) { /* 忽略 */ }
    } catch (e) { /* 忽略 */ }
    currentInst = null;
  }

  /* --------------------------------------------------------------------------
   * 全局配色切换：已挂载的 adapter 工具即时换色
   * --------------------------------------------------------------------------
   * 站点顶栏 #accentBtn 点击后，theme.js 在 document 上派发 `et:accent`。
   * adapter 路径下工具 CSS 的 `body[data-theme=…]` 已被 rebaseCss 重基成
   * `:host[data-theme=…]`（:host = 影子树宿主，即站点里的 .tool-root 容器），
   * 因此必须同时写两处：
   *   ① 宿主 host → 直接命中 :host[data-theme] / 站点的 .tool-root[data-theme]
   *   ② 内层 inner → 工具脚本仍可能读 document.body.dataset.theme 做判断，
   *      且 makeDocShim 的 patchThemeAttr 会把 inner 的值再同步一次到 host（幂等）
   * 监听挂在 document 上与组件生命周期解耦，故做「实例已卸载 / 宿主已脱离文档」空安全判断。 */
  function onAccentChange(ev) {
    var name = (ev && ev.detail && ev.detail.theme) || readGlobalAccent();
    var inst = currentInst;
    if (!inst) return;                                   // 未挂载或已卸载 → 跳过
    var host = inst.host;
    var inner = inst.inner;
    /* 宿主已脱离文档（页面切走 / 容器被替换）→ 视为失效，不再写入 */
    if (host && typeof host.isConnected === "boolean" && !host.isConnected) return;
    try { if (host && host.setAttribute) host.setAttribute("data-theme", name); } catch (e) { /* 忽略 */ }
    try { if (inner && inner.setAttribute) inner.setAttribute("data-theme", name); } catch (e) { /* 忽略 */ }
  }

  /* 绑定：Node/单测环境里 document 可能是残缺 stub，做能力探测 + try/catch 兜底，
     不能让本模块的加载因缺少 addEventListener 而整体抛错。 */
  try {
    if (typeof document !== "undefined" && typeof document.addEventListener === "function") {
      document.addEventListener("et:accent", onAccentChange);
    }
  } catch (e) { /* 忽略：环境不支持则退化为「挂载时读取一次」 */ }

  EduT.adapter = { mount: mount, unmount: unmount };
})(window);
