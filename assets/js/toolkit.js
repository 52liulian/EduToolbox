/**
 * EduToolbox · 工具挂载层（toolkit.js）
 * ============================================================================
 * 功能：把「自研工具」从 iframe 嵌入升级为「同一文档组件挂载(mount)」。
 *
 *   EduToolbox.tools[slug] —— 组件注册表；已迁移工具在自己的 JS 里注册：
 *        { mount(root, opts), unmount() }
 *
 *   EduToolbox.mount.open(slug, container, opts)
 *        - 注入工具公共底座样式 + 工具自身 CSS（均只注入一次，且作用域化到
 *          .tool-root 内，不泄漏到站点 —— 详见下方「CSS 作用域化」小节）
 *        - 注入工具 JS（首次），使其注册组件
 *        - 调用 api.mount(root) 直挂到容器
 *        - 返回 true = 已挂载；false = 该工具未暴露 mount API（调用方回退 iframe）
 *
 *   EduToolbox.mount.close() —— 卸载当前组件（清理定时器/监听）
 *
 * 注册约定：data.js 的 selfTools 条目加 "mount": true 即声明「该工具已组件化」，
 *   路由层据此决定走 mount 还是回退 iframe。
 * 加载顺序：data/utils/theme/search/render 之后、router 之前。
 * ============================================================================
 */
(function (global) {
  "use strict";

  var EduT = (global.EduToolbox = global.EduToolbox || {});
  EduT.tools = EduT.tools || {}; // 组件注册表

  /* ---------- 内部状态 ---------- */
  var cssLoaded = {};       // 已注入的工具 CSS（防重复）
  var jsLoaded = {};        // 已加载的工具 JS（防重复）
  var baseInjected = false; // 公共底座样式只注入一次
  var current = null;       // 当前挂载的组件 { slug, api }
  var nativeHost = null;    // 当前 native 直挂的容器（供 et:accent 即时换色）

  /* ---------- 资源注入 ---------- */
  function injectBaseCss() {
    if (baseInjected) return;
    var link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "assets/css/tool-mount-base.css";
    link.setAttribute("data-tool-css", "__base__");
    document.head.appendChild(link);
    baseInjected = true;
  }

  /* ==========================================================================
   * CSS 作用域化
   * --------------------------------------------------------------------------
   * 历史缺陷（2026-09-21「页面忽然变窄 / 配色突变 / 顶栏菜单被遮挡」三合一事故）：
   *   native 组件路径原本用 <link> 把 tool-common.css 与 <slug>.css 注入站点
   *   <head>，且在 cssLoaded 去重后永不移除。tool-common.css 是给「工具独立
   *   打开」设计的完整底座，内含大量站点级规则：
   *     :root{--primary/--bg/--font…}      → 覆盖站点设计令牌（配色/字号突变）
   *     *{margin:0;padding:0}              → 抹掉整站间距（页面忽然变窄）
   *     html{} / body{font-size;background}→ 改写站点背景与字号
   *     #app{} / .container{max-width:1180px} / .wrap{} → 抢占站点栅格宽度
   *     .modal-mask{z-index:1000} / .toast{z-index:1200} → 盖住 z-index:100 的顶栏
   *   一句话：<link> 一旦进 head，工具样式就永久泄漏到整站。
   * 正确做法：fetch 到样式文本后先做作用域化（每条规则限定到 .tool-root 内），
   *   再以 <style> 注入。adapter 路径已有 Shadow DOM 隔离（同样的目的），
   *   本节让 native 路径拥有等价隔离；<link> 仅作为 fetch 失败（file:// 等）
   *   时的兜底，保证可用性不比改造前更差。
   * 解析器说明：沿用 tool-adapter.js 的「花括号配对 + 字符串感知 + at-rule
   *   感知」手写扫描方案，不用正则匹配整块（本项目 CSS 体量大，贪婪/回溯易炸）。
   * ======================================================================== */

  /** 作用域根选择器，与 open() 里 container.classList.add("tool-root") 对应 */
  var SCOPE = ".tool-root";

  /** 块体内不是普通样式规则、必须原样保留的 at-rule（名字含厂商前缀） */
  var KEEP_BLOCK_AT = /^(?:-\w+-)?(?:keyframes|font-face|page|property|counter-style|font-feature-values|viewport)$/i;

  /**
   * 从 '{' 位置开始做花括号配对，取出块体
   * 字符串感知：引号内的括号不计入深度
   * @param {string} css  - 完整 CSS 文本
   * @param {number} open - '{' 的下标
   * @returns {{body: string, end: number}} body=块体内容；end=闭括号之后的下标
   */
  function readBlock(css, open) {
    var depth = 1;
    var i = open + 1;
    var len = css.length;
    var quote = null;
    while (i < len) {
      var c = css.charAt(i);
      if (quote) {
        if (c === "\\") { i += 2; continue; }
        if (c === quote) quote = null;
      } else if (c === '"' || c === "'") {
        quote = c;
      } else if (c === "{") {
        depth++;
      } else if (c === "}") {
        depth--;
        if (depth === 0) break;
      }
      i++;
    }
    return { body: css.slice(open + 1, i), end: i < len ? i + 1 : len };
  }

  /**
   * 按顶层逗号切分选择器（忽略属性选择器 / :not() 等括号内的逗号）
   * @param {string} sel - 选择器串
   * @returns {string[]} 各分支
   */
  function splitSelector(sel) {
    var parts = [];
    var start = 0;
    var depth = 0;
    var quote = null;
    for (var i = 0; i < sel.length; i++) {
      var c = sel.charAt(i);
      if (quote) {
        if (c === "\\") { i++; continue; }
        if (c === quote) quote = null;
        continue;
      }
      if (c === '"' || c === "'") { quote = c; continue; }
      if (c === "(" || c === "[") { depth++; continue; }
      if (c === ")" || c === "]") { depth--; continue; }
      if (c === "," && depth === 0) { parts.push(sel.slice(start, i)); start = i + 1; }
    }
    parts.push(sel.slice(start));
    return parts;
  }

  /**
   * 给单个选择器分支加作用域
   * - :root                  → 作用域根自身（正文替换后直接返回）
   * - html / body            → 作用域根自身；其后紧跟的组合器被吞掉
   *   （html>body、html body 这类整页写法在组件里不存在，都折叠到同一根上）
   * - body[data-theme="sky"] / body.cls / body::before → 作用域根 + 后缀
   *   （不加空格！这是同元素附着关系，与 syncToolTheme 写在容器上的 data-theme 配套）
   * - 裸 `*`                 → 作用域根自身 + 其后代（等价于工具原作用域内的 *）
   * - 其余选择器             → 作为作用域根的后代
   * @param {string} part  - 单个选择器分支
   * @param {string} scope - 作用域根选择器
   * @returns {string}
   */
  function prefixSelectorPart(part, scope) {
    var p = String(part).replace(/^\s+/, "").replace(/\s+$/, "");
    if (!p) return "";

    /* ① :root：替换后已是完整选择器（可能带后缀或后代），不再二次前缀 */
    if (/^:root\b/i.test(p)) return p.replace(/:root\b/gi, scope);
    p = p.replace(/:root\b/gi, scope);

    /* ② 前导 html / body 链：逐层折叠到作用域根 */
    var root = null;                       // 已折叠出的根部分
    var combinator = " ";                  // 根与剩余部分之间的组合器
    var guard = 0;
    while (guard++ < 8) {
      var mm = /^(html|body)\b/i.exec(p);
      if (!mm) break;
      p = p.slice(mm[0].length);
      root = scope;
      var rest = p.replace(/^\s+/, "");
      if (!rest) { p = ""; break; }
      if (/^[\s>+~]/.test(p)) {            // 后代/子代等组合关系
        var cm = /^([>+~])/.exec(rest);
        if (cm) { combinator = " " + cm[1] + " "; p = rest.slice(1).replace(/^\s+/, ""); }
        else { combinator = " "; p = rest; }
        continue;
      }
      /* 无空白、无组合器 → 与 html/body 是同一元素：body[data-theme] / body.cls */
      return scope + p;
    }

    /* ③ 无 html/body 前导的普通选择器 */
    if (root === null) {
      if (p === "*") return scope + ", " + scope + " *";   // 根自身 + 全部后代
      if (p.charAt(0) === "*") return scope + " " + p;     // *::before 等
      return scope + " " + p;
    }

    /* ④ 已折叠出根，剩余部分按原组合关系接回 */
    return p ? root + combinator + p : root;
  }

  /**
   * 递归作用域化一段 CSS（入口）
   * - @media / @supports / @layer / @container 等条件组：保留块结构，内部递归作用域化
   * - @keyframes / @font-face / @page 等：整体原样保留（keyframes 名需全局可用）
   * - @charset / @import / @namespace 等语句式 at-rule：原样透传
   * - 注释与空白原样保留，避免破坏源码可读性
   * @param {string} css   - CSS 文本
   * @param {string} scope - 作用域根选择器
   * @returns {string}
   */
  function scopeRules(css, scope) {
    var out = [];
    var i = 0;
    var len = css.length;
    while (i < len) {
      /* 空白原样透传 */
      if (/\s/.test(css.charAt(i))) {
        var ws = i;
        while (i < len && /\s/.test(css.charAt(i))) i++;
        out.push(css.slice(ws, i));
        continue;
      }
      /* 注释原样透传 */
      if (css.charAt(i) === "/" && css.charAt(i + 1) === "*") {
        var ce = css.indexOf("*/", i + 2);
        if (ce < 0) { out.push(css.slice(i)); break; }
        out.push(css.slice(i, ce + 2));
        i = ce + 2;
        continue;
      }
      /* at-rule */
      if (css.charAt(i) === "@") {
        var nameMatch = /^@([-\w]+)/.exec(css.slice(i, i + 40));
        var name = nameMatch ? nameMatch[1].toLowerCase() : "";
        var semi = css.indexOf(";", i);
        var brace = css.indexOf("{", i);
        if (brace < 0 || (semi >= 0 && semi < brace)) {
          /* 语句式 at-rule（@import/@charset/@namespace）：原样透传 */
          out.push(css.slice(i, semi < 0 ? len : semi + 1));
          i = semi < 0 ? len : semi + 1;
          continue;
        }
        if (KEEP_BLOCK_AT.test(name)) {
          /* 名字/声明型 at-rule：整体保留 */
          var keepBlk = readBlock(css, brace);
          out.push(css.slice(i, brace), "{", keepBlk.body, "}");
          i = keepBlk.end;
          continue;
        }
        /* 条件组（@media/@supports/@layer/@container/@scope 等）：递归作用域化块内规则 */
        var grpBlk = readBlock(css, brace);
        out.push(css.slice(i, brace), "{", scopeRules(grpBlk.body, scope), "}");
        i = grpBlk.end;
        continue;
      }
      /* 普通规则：选择器 + 声明块 */
      var open = css.indexOf("{", i);
      if (open < 0) { out.push(css.slice(i)); break; }
      var selSrc = css.slice(i, open);
      var blk = readBlock(css, open);
      var scoped = splitSelector(selSrc)
        .map(function (part) { return prefixSelectorPart(part, scope); })
        .filter(function (s) { return !!s; })
        .join(", ");
      out.push(scoped || selSrc, "{", blk.body, "}");
      i = blk.end;
    }
    return out.join("");
  }

  /**
   * CSS 作用域化（对外入口）
   * @param {string} css - 原始 CSS 文本
   * @param {string} scope - 作用域根选择器
   * @returns {string}
   */
  function scopeCss(css, scope) {
    if (!css) return "";
    return scopeRules(css, scope || SCOPE);
  }

  /**
   * 规范 ../ 相对路径为站点根绝对路径
   * @param {string} p - 路径
   * @returns {string}
   */
  function normalizeCssPath(p) {
    var parts = String(p).split("/");
    var stack = [];
    for (var i = 0; i < parts.length; i++) {
      var seg = parts[i];
      if (!seg || seg === ".") continue;
      if (seg === "..") { stack.pop(); continue; }
      stack.push(seg);
    }
    return "/" + stack.join("/");
  }

  /**
   * 重写 CSS 里的相对 url()：
   * 作用域化后样式以 <style> 注入主文档，url() 会以「文档 base」解析，
   * 与原 <link>（以 CSS 文件位置解析）不一致，这里统一改为站点根绝对路径。
   * @param {string} css - CSS 文本
   * @param {string} cssUrl - 该 CSS 的站点相对地址（用于取目录）
   * @returns {string}
   */
  function rebaseUrls(css, cssUrl) {
    if (!css || css.indexOf("url(") < 0) return css;
    var base = String(cssUrl).replace(/[^/]*$/, "");   // 去掉文件名，只留目录
    return css.replace(/url\(([^)]*)\)/gi, function (full, raw) {
      var v = raw.trim().replace(/^['"]/, "").replace(/['"]$/, "");
      if (!v || /^(https?:|data:|#|\/|about:|blob:)/i.test(v)) return full;
      return "url(" + normalizeCssPath(base + v) + ")";
    });
  }

  /**
   * 兜底：<link> 注入（fetch 不可用时退化为改造前方案）
   * @param {string} key  - 去重键（__common__ 或 slug）
   * @param {string} href - 样式地址
   * @returns {void}
   */
  function injectLinkFallback(key, href) {
    var link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = href;
    link.setAttribute("data-tool-css", key);
    document.head.appendChild(link);
  }

  /**
   * 拉取文本；失败返回 null
   * @param {string} url - 地址
   * @returns {Promise<string|null>}
   */
  async function fetchCssText(url) {
    try {
      var res = await fetch(url);
      if (!res.ok) return null;
      return await res.text();
    } catch (e) {
      return null;   // file:// 协议或网络异常
    }
  }

  /**
   * 以「作用域化 <style>」注入单份样式（同地址只注入一次）
   * @param {string} key  - 去重键（__common__ 或 slug）
   * @param {string} href - 样式地址
   * @returns {Promise<void>}
   */
  async function injectScopedCss(key, href) {
    if (cssLoaded[key]) return cssLoaded[key];
    cssLoaded[key] = (async function () {
      var text = await fetchCssText(href);
      if (text == null) {
        injectLinkFallback(key, href);   // 不比改造前更差
        return;
      }
      var style = document.createElement("style");
      style.setAttribute("data-tool-css", key);
      style.textContent = scopeCss(rebaseUrls(text, href), SCOPE);
      document.head.appendChild(style);
    })();
    return cssLoaded[key];
  }

  /**
   * 工具 CSS 注入：公共底座 + 工具自身（均做 .tool-root 作用域化）
   * @param {string} slug - 工具 slug
   * @returns {Promise<void>}
   */
  async function injectCss(slug) {
    /* ① 公共底座：保持 iframe / 适配器两条路径一致的宽度与设计变量来源 */
    await injectScopedCss("__common__", "assets/css/tool-common.css");
    /* ② 工具自身样式（后加载，可覆盖底座） */
    await injectScopedCss(slug, "tools/" + slug + "/" + slug + ".css");
  }

  /* ---------- 原生组件的主题载体 ----------
   * 原生组件直挂在同一文档内，工具自带的 `body[data-theme="x"]{--primary:…}`
   * 依赖 <body> 上的 data-theme。站点 <body> 的主题属性不保证存在，且工具
   * 自身可能完全没有声明六色变量（如 rollcall / scoreboard），因此这里把当前
   * 站点主题同步到一个专用载体元素上，并补齐六色兜底，与适配器路径的
   * 公共底座保持同一套视觉语义。 */
  function syncToolTheme(container) {
    if (!container) return;
    var bodyTheme = "";
    /* ① 全局配色开关（站点顶栏 #accentBtn，键 et-accent）优先：它是唯一的写入口，
          切换后对所有工具即时生效。 */
    try {
      if (EduT.accent && typeof EduT.accent.get === "function") bodyTheme = EduT.accent.get() || "";
      else bodyTheme = localStorage.getItem("et-accent") || "";
    } catch (e) { bodyTheme = ""; }
    /* ② 其次：容器上已有的 data-theme（工具内旧按钮留下的值，尚未被删除时仍可用） */
    try { bodyTheme = bodyTheme || (container.getAttribute && container.getAttribute("data-theme")) || ""; } catch (e) { /* 忽略 */ }
    /* ③ 再次：历史遗留键（toolkit 早期写入），最后才是站点 body
          —— 注意站点 body 上的 data-theme 会污染整站 --primary，仅作只读兜底。 */
    try { bodyTheme = bodyTheme || (document.body && document.body.getAttribute("data-theme")) || ""; } catch (e) { bodyTheme = bodyTheme || ""; }
    try { bodyTheme = bodyTheme || localStorage.getItem("theme") || localStorage.getItem("edutoolbox-theme") || ""; } catch (e) { /* 隐私模式忽略 */ }
    try { container.setAttribute("data-theme", bodyTheme || "sky"); } catch (e) { /* 忽略 */ }
  }

  /* 卸载时清掉主题载体，避免残留属性污染下一次挂载 */
  function clearToolTheme(container) {
    if (!container) return;
    try { container.removeAttribute("data-theme"); } catch (e) { /* 忽略 */ }
  }

  function injectScript(slug) {
    return new Promise(function (resolve, reject) {
      if (jsLoaded[slug]) { resolve(); return; }
      var s = document.createElement("script");
      s.src = "tools/" + slug + "/" + slug + ".js";
      jsLoaded[slug] = true;
      s.onload = resolve;
      s.onerror = function () {
        jsLoaded[slug] = false;
        reject(new Error("load fail " + s.src));
      };
      document.head.appendChild(s);
    });
  }

  /* ---------- 站点级共享脚本的依赖注入 ----------
   * native 直挂工具不会解析自己的 index.html，因此工具在 index.html 里声明的
   * `<script src="../../assets/js/tool-stage-toolbar.js">` 对站点挂载态无效。
   * toolkit.open() 过去也只注入 tools/<slug>/<slug>.js，导致
   * window.EduToolStageToolbar 在挂载态恒为 undefined —— 舞台右上角 ⛶/⚙
   * 全部失效（2026-09-23 scoreboard 普查发现）。
   * adapter 路径无此问题：tool-adapter.js 会按文档顺序把工具 index.html 里的
   * 所有非 vendor 脚本（含共享模块）拼进 Shim 作用域执行。
   * 这里把 native 路径补齐到等价水位。
   * @returns {Promise<void>}
   */
  var sharedJsLoaded = {};   // 已注入的共享脚本（防重复）

  /**
   * 注入一份站点级共享脚本（同地址只加载一次）
   * @param {string} src - 站点根相对地址
   * @returns {Promise<void>}
   */
  function injectSharedScript(src) {
    if (sharedJsLoaded[src]) return sharedJsLoaded[src];
    sharedJsLoaded[src] = new Promise(function (resolve) {
      var done = false;
      /**
       * 结束加载（成功 / 失败 / 超时都放行）
       * 超时兜底很关键：404 或网络异常时 onload/onerror 可能都不触发，
       * 死等会把挂载流程整个卡住。
       * @returns {void}
       */
      function finish() {
        if (done) return;
        done = true;
        resolve();
      }
      /* 已被站点其它路径加载过 → 直接放行 */
      if (src.indexOf("tool-stage-toolbar") >= 0 && global.EduToolStageToolbar) {
        finish();
        return;
      }
      var s = document.createElement("script");
      s.src = src;
      s.async = false;
      s.onload = finish;
      s.onerror = finish;              // 失败不阻断挂载：由工具内的 else 降级分支兜底
      document.head.appendChild(s);
      setTimeout(finish, 600);         // 超时兜底（舞台工具栏是增强项，
                                 //  工具内有降级分支，不该把挂载流程卡住数秒）
    });
    return sharedJsLoaded[src];
  }

  /* ---------- 卸载当前组件 ---------- */
  function unmountCurrent() {
    if (current && current.api && current.api.unmount) {
      try { current.api.unmount(); } catch (e) { /* 忽略清理异常 */ }
    }
    /* 原生组件：清理挂载容器的主题载体与类名 */
    try {
      var host = nativeHost || document.getElementById("toolMount");
      if (host) { clearToolTheme(host); host.classList.remove("tool-root"); }
    } catch (e) { /* 忽略 */ }
    nativeHost = null;
    current = null;
  }

  /* ---------- 是否已声明为「组件化工具」 ----------
   * data.js 的 mount 字段：true = 原生组件；"adapter" = 由 tool-adapter.js 通用适配挂载
   */
  function modeOf(slug) {
    try {
      var list = (global.DB && global.DB.selfTools) || [];
      var t = list.find(function (x) { return x.slug === slug; });
      if (!t || !t.mount) return null;
      return t.mount === true ? "native" : "adapter";
    } catch (e) {
      return null;
    }
  }

  function supports(slug) {
    return !!modeOf(slug);
  }

  /* ---------- 打开工具：mount 优先 ---------- */
  /**
   * @param {string} slug      - 工具 slug
   * @param {HTMLElement} container - 挂载容器
   * @param {object} opts      - 透传给组件的选项
   * @returns {Promise<boolean>} true=已挂载；false=调用方回退 iframe
   */
  async function open(slug, container, opts) {
    unmountCurrent();
    injectBaseCss();
    var mode = modeOf(slug);
    try {
      /* ---- 通用适配器：遗留独立页面 → 同文档组件（Shadow DOM 隔离） ---- */
      if (mode === "adapter" && !EduT.tools[slug]) {
        if (!EduT.adapter) return false;
        var ok = await EduT.adapter.mount(slug, container);
        if (!ok) return false;                       // 适配失败 → 调用方回退 iframe
        current = { slug: slug, api: { unmount: EduT.adapter.unmount } };
        return true;
      }

      /* ---- 原生组件 ---- */
      if (!EduT.tools[slug]) {
        await injectScript(slug);
        if (!EduT.tools[slug]) return false; // 加载后仍未暴露 mount API → 回退
      }
      var api = EduT.tools[slug];
      if (!api || typeof api.mount !== "function") return false;
      /* CSS 需 await：作用域化后的样式必须在组件 render 前就位，
         否则工具首帧会按站点样式排版（宽度/配色跳变）。 */
      await injectCss(slug);
      /* 共享脚本必须在 api.mount() 之前就位：工具会在 mount() 里调用
         window.EduToolStageToolbar.init(...) 绑定舞台右上角 ⛶/⚙，
         晚一步就只能吃掉工具内部的降级分支（全屏仍可用，但双栏显隐没了）。 */
      await injectSharedScript("assets/js/tool-stage-toolbar.js");
      container.innerHTML = "";
      container.classList.add("tool-root");
      nativeHost = container;
      syncToolTheme(container);          // 主题载体：让 body[data-theme] 规则在直挂场景命中
      api.mount(container, opts || {});
      current = { slug: slug, api: api };
      return true;
    } catch (e) {
      console.warn("[toolkit] mount failed:", slug, e);
      return false;
    }
  }

  /* ---------- 关闭：卸载当前组件 ---------- */
  function close() {
    unmountCurrent();
  }

  /* ---------- 全局配色切换：已挂载的 native 工具即时换色 ----------
   * 顶栏 #accentBtn 派发 document 上的 `et:accent`，此处收到后对当前挂载容器
   * 重新执行 syncToolTheme()（容器上的 data-theme 命中
   * tool-mount-base.css 的 .tool-root[data-theme=…]）。
   * 监听挂在 document 上、与组件生命周期解耦，因此用「宿主仍存在」做空安全判断。 */
  function onAccentChange() {
    var host = nativeHost;
    if (!host) return;                                  // 未挂载 / 走 adapter 或 iframe → 跳过
    if (typeof host.isConnected === "boolean" && !host.isConnected) { nativeHost = null; return; }
    syncToolTheme(host);
  }

  /* 绑定：Node/单测环境里 document 可能是残缺 stub，做能力探测 + try/catch 兜底 */
  try {
    if (typeof document !== "undefined" && typeof document.addEventListener === "function") {
      document.addEventListener("et:accent", onAccentChange);
    }
  } catch (e) { /* 忽略 */ }

  /* ---------- 对外 API ---------- */
  EduT.mount = {
    open: open,
    close: close,
    supports: supports,
    syncToolTheme: syncToolTheme,
    activeSlug: function () { return current ? current.slug : null; },
    isActive: function () { return !!current; },
  };
})(window);
