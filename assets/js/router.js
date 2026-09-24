/**
 * EduToolbox 路由层
 * ============================================================================
 * 功能：History API 路由解析与页面调度（URL 无 # 号），联动侧栏显示/隐藏
 * 路由表：
 *   /                      -> 首页（Hero + 分类标签云 + 全部工具网格，无侧栏）
 *   /section/:catId        -> 分类页（侧栏 + 过滤后网格）
 *   /tools                 -> 自研工具页（复用分类页布局：同容器 + 同头部）
 *   /tool/:slug            -> 外链工具详情页
 *   /onlinetools/:id       -> 自研工具运行页（异步加载模板）
 *   /articles              -> 教学资讯页（复用分类页布局：同容器 + 同头部）
 *   /categories            -> 全部分类页（复用分类页布局：同容器 + 同头部）
 *   /about                 -> 关于页（复用分类页布局：同容器 + 同头部）
 *   /search?q=关键词       -> 搜索结果页（复用分类页布局：同容器 + 同头部 + 同网格）
 * 加载顺序：utils.js / render.js / search.js 之后
 * ============================================================================
 */
(function (global) {
  "use strict";

  global.EduToolbox = global.EduToolbox || {};

  const EduT = global.EduToolbox;
  const { $, $$ } = EduT.utils;

  /**
   * 运行模式判定
   * - http(s)：使用 History API 路由，URL 为干净路径（/categories、/tools/xxx）
   *   —— 依赖服务器的 SPA fallback：未知路径一律回 index.html
   *   （本地 server.py 已支持；GitHub Pages 等纯静态托管由 404.html 兜底还原）
   * - file: 双击离线打开时没有服务器、也没有 fallback，只能退回 hash 路由（#/path）
   * - iframe src 统一用相对路径，兼容 http(s) 与 file://
   */
  const IS_FILE = location.protocol === "file:";

  /** 上一次已渲染的路径（用于过滤重复触发，避免工具内部改 hash 导致页面重建） */
  let lastPath = null;

  /** 页面容器映射 */
  const PAGES = {
    home: ["heroSection", "main"],
    detail: ["detailPage"],
  };

  /**
   * 路径归一化
   * - 去掉查询串之后的锚点、剥掉结尾多余斜杠（保留根 "/"）
   * - /index.html → /，/tools/index.html → /tools（服务端 fallback 会把两者都回首页文档，
   *   统一后 URL 更干净，也避免同一页面出现两个地址）
   * @param {string} raw - 原始路径（可含查询串）
   * @returns {string} 归一化后的路径
   */
  function normalizePath(raw) {
    let str = String(raw || "/");
    let query = "";
    const qi = str.indexOf("?");
    if (qi >= 0) { query = str.slice(qi); str = str.slice(0, qi); }
    const hi = str.indexOf("#");
    if (hi >= 0) str = str.slice(0, hi);
    if (!str) str = "/";
    if (str.charAt(0) !== "/") str = "/" + str;
    str = str.replace(/\/index\.html$/i, "/");
    if (str.length > 1) str = str.replace(/\/+$/, "") || "/";
    return str + query;
  }

  /**
   * 解析当前路径（含查询串）
   * - http(s)：读 location.pathname + location.search（干净 URL，无 #）
   * - file:   读 location.hash（离线双击场景没有服务端 fallback）
   * - 兼容旧 hash 地址：路径仍停在根、URL 却带 #/xxx 时按 hash 解析
   *   （老书签 / 第三方跳转 / 工具内部改 hash 的场景）
   * @returns {string} 路径，如 "/search?q=PPT"
   */
  function parsePath() {
    if (IS_FILE) {
      const h = location.hash;
      if (h && h.charAt(1) === "/") return h.slice(1);
      return "/";
    }
    const h = location.hash || "";
    const p = normalizePath((location.pathname || "/") + (location.search || ""));
    if ((p === "/" || p === "") && h.charAt(1) === "/") return normalizePath(h.slice(1));
    return p;
  }

  /**
   * 切换显示指定页面（隐藏其他）
   * @param {string} page - PAGES 中的 key
   * @returns {void}
   */
  function showPage(page) {
    Object.values(PAGES).flat().forEach(id => {
      const el = document.getElementById(id);
      if (el) el.hidden = true;
    });
    PAGES[page].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.hidden = false;
    });
    window.scrollTo({ top: 0, behavior: "instant" });
  }

  /**
   * 控制侧栏显示与主区 grid 布局
   * @param {boolean} showSidebar - 是否显示侧栏
   * @returns {void}
   */
  function setLayout(showSidebar) {
    const sidebar = $("#sidebar");
    const layout = $("#mainLayout");
    if (showSidebar) {
      sidebar.hidden = false;
      layout.classList.remove("no-sidebar");
    } else {
      sidebar.hidden = true;
      layout.classList.add("no-sidebar");
    }
  }

  /**
   * 切换首页/分类页视图
   * 首页：显示精选推荐 + 分类独立区块，隐藏完整网格
   * 分类页：隐藏精选/分类区块，显示完整网格（带侧栏）
   * @param {"home"|"category"} mode
   * @returns {void}
   */
  function setContentView(mode) {
    const hero = $("#heroSection");
    const featured = $("#featuredSection");
    const catBlocks = $("#categorySections");
    const gridView = $("#categoryGridView");
    if (mode === "home") {
      hero.hidden = false;
      featured.hidden = false;
      catBlocks.hidden = false;
      gridView.hidden = true;
    } else {
      hero.hidden = true;
      featured.hidden = true;
      catBlocks.hidden = true;
      gridView.hidden = false;
    }
  }

  /**
   * 高亮顶导链接
   * @param {string} path - 当前路径
   * @returns {void}
   */
  function highlightNav(path) {
    $$(".nav-link").forEach(a =>
      a.classList.toggle("active", a.dataset.route === path || (path.startsWith("/") && a.dataset.route === "/"))
    );
  }

  /**
   * 打开自研工具运行页 —— 组件化工具(mount) 同文档直挂；未迁移工具回退 iframe
   * @param {string} slug - 自研工具 slug
   * @returns {void}
   */
  function openSelfTool(slug) {
    const tool = DB.selfTools.find(t => t.slug === slug);
    if (!tool) { showPage("home"); return; }

    showPage("detail");
    // 自研工具页已有面包屑导航，隐藏顶部"返回"按钮
    const backBtn = $("#backBtn");
    if (backBtn) backBtn.hidden = true;
    const content = $("#detailContent");

    // 切换工具时先卸载上一组件（清理定时器/监听等状态）
    EduT.mount.close();

    // 渲染详情页头部（面包屑 + 标题 + 徽章 + features）
    const features = (tool.features || []).map(f =>
      `<span class="tool-feature">${f}</span>`).join("");
    content.innerHTML = `
      <nav class="breadcrumb">
        <a href="/">首页</a>
        <span class="sep">/</span>
        <a href="/tools">自研工具</a>
        <span class="sep">/</span>
        <span class="current">${tool.name}</span>
      </nav>
      <header class="tool-run-header">
        <div class="tool-run-title-row">
          <span class="tool-run-icon">${tool.icon || "🛠️"}</span>
          <h1>${tool.name}</h1>
          ${tool.featured ? `<span class="tool-run-badge">精选</span>` : ""}
        </div>
        <p class="tool-run-sub">${tool.desc}</p>
        <div class="tool-run-features">${features}</div>
      </header>
      <div class="tool-iframe-wrap" id="toolMount"></div>
    `;

    const wrap = document.getElementById("toolMount");
    if (!wrap) return;

    // 组件化(mount) 工具：同一文档直挂；否则/失败 → iframe 兜底
    if (EduT.mount.supports(slug)) {
      EduT.mount.open(slug, wrap, {}).then(ok => {
        // 挂载失败时重新取宿主（宿主可能在适配过程中被替换）
        if (!ok) renderToolIframe(document.getElementById("toolMount") || wrap, slug);
      });
    } else {
      renderToolIframe(wrap, slug);
    }
  }

  /**
   * iframe 兜底渲染（未迁移 / mount 失败 / 旧工具）
   * 保留原高度自适应逻辑：ResizeObserver 同步工具内容高度
   * @param {HTMLElement} wrap  - 挂载容器
   * @param {string} slug - 工具 slug
   * @returns {void}
   */
  function renderToolIframe(wrap, slug) {
    /* 组件挂载可能已在宿主上建立 Shadow Root；有影子树时 light DOM 不渲染，
       会挡住兜底 iframe —— 这里整体替换为一个干净的宿主元素。 */
    if (wrap && wrap.shadowRoot) {
      var fresh = wrap.cloneNode(false);   // 浅克隆不带影子树
      if (wrap.parentNode) {
        wrap.parentNode.replaceChild(fresh, wrap);
        wrap = fresh;
      }
    }
    if (!wrap) return;
    wrap.classList.remove("tool-root");
    wrap.innerHTML = `
      <iframe id="toolIframe" src="tools/${slug}/index.html"
        loading="lazy"
        allow="fullscreen"></iframe>`;
    const iframe = wrap.querySelector("#toolIframe");
    if (!iframe) return;
    /**
     * 尝试按 iframe 文档实际高度同步外框高度
     * file:// 下跨目录文档可能被浏览器安全策略拒绝访问，失败时使用视口高度兜底
     * @returns {void}
     */
    const resizeIframe = () => {
      try {
        const doc = iframe.contentDocument || iframe.contentWindow.document;
        iframe.style.height = doc.body.scrollHeight + "px";
      } catch (e) {
        /* file:// 跨源读不到文档：高度由 iframe 内 frame-bridge.js 的
           postMessage 上报接管 —— 这里【不写死高度】。
           ⚠️ 历史写法 `iframe.style.height = (innerHeight-150)+"px"` 会把工具区
              锁成固定高度：内容再多也不撑开、内容再少也留一大截空白，
              且 iframe 内 100vh 布局会与这个值互相自锁（上报永远等于固定值）。
           上报到达前的空窗期由 #toolIframe 的 min-height 兜底，不再闪白。 */
      }
    };
    iframe.addEventListener("load", () => {
      setTimeout(resizeIframe, 200);
      // 持续监听内容变化（工具内部 DOM 变化）
      try {
        const doc = iframe.contentDocument || iframe.contentWindow.document;
        iframe.style.height = doc.body.scrollHeight + "px";
        const ro = new ResizeObserver(resizeIframe);
        ro.observe(doc.body);
      } catch (e) {
        // file:// 跨文档访问被拒：高度改由 iframe 内 frame-bridge.js 的
        // postMessage 上报接管（见 installFrameBridge）——只留 CSS 的 min-height
        // 兜住首屏空窗，绝不写死高度（写死 = 工具区不再随内容自动撑开）。
      }
    });
    installFrameBridge();
  }

  /* ==========================================================================
   * iframe 跨源桥（父页侧）
   * --------------------------------------------------------------------------
   * file:// 下 iframe 与父页互为不透明源：contentDocument 拿不到（高度自适应
   * 失效），iframe 内的 requestFullscreen 也会被权限策略拒绝（⛶ 失效）。
   * 工具页面里的 frame-bridge.js 通过 postMessage 上报两件事：
   *   height     —— 工具内容真实高度 → 同步给 iframe（页面恢复自动撑开）；
   *   fullscreen —— 工具内全屏被拒 → 由父页对 iframe 本身发起全屏
   *                 （postMessage 会委托 user activation；若父页仍被拒，
   *                  降级为 .fs-pseudo CSS 伪全屏，Esc 或再次点击退出）。
   * 同源（http 挂载失败）场景 ResizeObserver 直读文档仍优先，消息只是冗余。
   * ======================================================================== */
  let pseudoFsWrap = null;
  function onEscInPseudoFs(e) {
    if (e.key === "Escape" && pseudoFsWrap) exitPseudoFullscreen();
  }
  function enterPseudoFullscreen(wrap) {
    if (pseudoFsWrap === wrap) return;
    pseudoFsWrap = wrap;
    wrap.classList.add("fs-pseudo");
    document.addEventListener("keydown", onEscInPseudoFs);
  }
  function exitPseudoFullscreen() {
    if (!pseudoFsWrap) return;
    const wrap = pseudoFsWrap;
    pseudoFsWrap = null;
    wrap.classList.remove("fs-pseudo");
    document.removeEventListener("keydown", onEscInPseudoFs);
    onFsChangeForSolo(); // 通知 iframe 解除舞台独占
    // 让 iframe 内重新上报一次常规高度，把 height:100% 恢复成内容高
    const ifr = wrap.querySelector("#toolIframe");
    try {
      if (ifr && ifr.contentWindow) {
        ifr.contentWindow.postMessage({ __edutoolboxFrame: true, type: "report" }, "*");
      }
    } catch (e) { /* 忽略 */ }
  }
  function handleFrameFsRequest() {
    const ifr = document.getElementById("toolIframe");
    if (!ifr) return;
    const wrap = ifr.closest(".tool-iframe-wrap") || ifr.parentElement;
    if (pseudoFsWrap) { exitPseudoFullscreen(); return; }   // 再点一次 ⛶ = 退出
    if (document.fullscreenElement) {                        // 已在真全屏 → 退出
      const p = document.exitFullscreen();
      if (p && p.catch) p.catch(() => {});
      return;
    }
    // 全屏的是 iframe 本身（工具页面整页）；先通知 iframe 内把舞台切成
    // 独占模式（fixed 铺满），用户看到的全屏画面才是舞台而非含设置栏的整页。
    try {
      if (ifr.contentWindow) {
        ifr.contentWindow.postMessage({ __edutoolboxFrame: true, type: "fs-enter" }, "*");
      }
    } catch (e) { /* 忽略 */ }
    let p = null;
    try { p = ifr.requestFullscreen ? ifr.requestFullscreen() : null; } catch (e) { p = null; }
    if (p && p.catch) {
      p.catch(() => { if (!document.fullscreenElement) enterPseudoFullscreen(wrap); });
    } else if (!p) {
      // 无 Fullscreen API（老内核 / file:// 直接抛）：CSS 伪全屏兜底
      setTimeout(() => { if (!document.fullscreenElement) enterPseudoFullscreen(wrap); }, 350);
    }
  }
  /* 真全屏退出（含 Esc）→ 通知 iframe 解除舞台独占，恢复常规布局 */
  function onFsChangeForSolo() {
    if (document.fullscreenElement) return;
    const ifr = document.getElementById("toolIframe");
    try {
      if (ifr && ifr.contentWindow) {
        ifr.contentWindow.postMessage({ __edutoolboxFrame: true, type: "fs-exit" }, "*");
      }
    } catch (e) { /* 忽略 */ }
  }
  let frameBridgeInstalled = false;
  function installFrameBridge() {
    if (frameBridgeInstalled) return;
    frameBridgeInstalled = true;
    document.addEventListener("fullscreenchange", onFsChangeForSolo);
    window.addEventListener("message", (e) => {
      const d = e.data;
      if (!d || d.__edutoolboxFrame !== true) return;
      const ifr = document.getElementById("toolIframe");
      if (!ifr) return;
      try { if (e.source && ifr.contentWindow && e.source !== ifr.contentWindow) return; } catch (e) { /* 忽略 */ }
      if (d.type === "height" && typeof d.h === "number") {
        // 伪全屏下高度由 CSS 接管，忽略内容上报
        if (pseudoFsWrap || document.fullscreenElement) return;
        ifr.style.minHeight = "0";
        ifr.style.height = Math.max(320, Math.round(d.h)) + "px";
      } else if (d.type === "fullscreen") {
        handleFrameFsRequest();
      }
    });
  }

  /**
   * 主路由调度
   * @returns {void}
   */
  function router() {
    const path = parsePath();
    // 离开工具运行页时卸载已挂载组件（清理定时器/监听，避免后台运行）
    if (!path.startsWith("/onlinetools/")) EduT.mount.close();
    highlightNav(path);

    if (path === "/" || path === "") {
      showPage("home");
      setLayout(false);      // 首页无侧栏
      setContentView("home"); // 显示精选推荐 + 分类独立区块
      EduT.search.setCat("all");
      // 返回首页时清空搜索框，避免保留上次搜索关键词
      const homeInput = $("#searchInput");
      const homeClear = $("#searchClear");
      if (homeInput) homeInput.value = "";
      if (homeClear) homeClear.hidden = true;
      /* 把 #categoryGridView 内的视图切回默认的工具网格：
         从 /categories、/articles 等共用容器切回首页时，若不做复位，
         #catListGrid / #articleList 的 hidden 会停留在 false ——
         虽然容器（#categoryGridView）整体是隐藏的、肉眼不可见，但视图状态是脏的，
         下次切到分类页/搜索页时可能出现两个网格并存。 */
      EduT.render.setGridView("tools");
      EduT.render.renderFeatured();
      EduT.render.renderAllCategories();
      EduT.render.renderCategories("all");
    } else if (path.startsWith("/search")) {
      /* 搜索结果页：与分类页共用同一视图容器与布局
         （content-head + toolGrid + 空状态 + .category-page-header 头部） */
      showPage("home");
      setLayout(false);
      setContentView("category");
      // 解析查询串：/search?q=关键词
      const qs = path.split("?")[1] || "";
      const params = new URLSearchParams(qs);
      const q = (params.get("q") || "").trim();
      // 同步搜索框（若存在）
      const input = $("#searchInput");
      const clear = $("#searchClear");
      if (input) input.value = q;
      if (clear) clear.hidden = !q;
      EduT.search.setCat("all");
      EduT.search.setSubCat("");
      EduT.render.renderCategories("all");
      EduT.render.renderSearchResults(q);
    } else if (path.startsWith("/section/")) {
      showPage("home");
      setLayout(false);          // 分类页无侧栏（对齐参考站）
      setContentView("category");
      const segs = path.split("/");
      const cat = segs[2] || "all";
      // 解析可选 query：/section/:catId?sub=:subCatId
      const qs = path.split("?")[1] || "";
      const subParam = new URLSearchParams(qs).get("sub") || "";
      EduT.search.setCat(cat);
      EduT.search.setSubCat(subParam);
      EduT.render.renderCategories(cat);
      EduT.render.renderTools(EduT.search.applyFilter());
      // 渲染分类页头部（面包屑 + 大标题 + 副标题）——与搜索页共用同一渲染函数
      const catObj = DB.categories.find(c => c.id === cat);
      if (catObj) {
        $("#sectionTitle").textContent = ""; // 清掉旧小标题
        const desc = catObj.desc || catObj.name + "专业工具与资源合集";
        // 若有 subCat，面包屑追加子分类名
        let crumbCur = catObj.name;
        if (subParam) {
          const sc = (catObj.subCategories || []).find(s => s.id === subParam);
          if (sc) crumbCur = `${catObj.name} / ${sc.name}`;
        }
        EduT.render.renderCategoryHeader({
          mid: `<a href="/categories" class="cp-breadcrumb-link">分类</a>`,
          cur: crumbCur,
          title: `${catObj.icon} ${catObj.name}`,
          desc,
        });
      } else {
        // 未知分类 id：清掉上一次注入的共用头部（避免残留其它页面的标题）
        const stale = document.querySelector("#categoryGridView .category-page-header");
        if (stale) stale.remove();
      }
    } else if (path.startsWith("/tool/")) {
      showPage("detail");
      setLayout(false);
      // 外链工具详情页无面包屑，显示顶部"返回"按钮
      const backBtn = $("#backBtn");
      if (backBtn) backBtn.hidden = false;
      const slug = decodeURIComponent(path.split("/")[2] || "");
      const ok = EduT.render.renderToolDetail(slug);
      if (!ok) { navigate("/"); return; }
    } else if (path.startsWith("/onlinetools/")) {
      setLayout(false);
      const slug = decodeURIComponent(path.split("/")[2] || "");
      openSelfTool(slug);
    } else if (path === "/categories") {
      /* 全部分类页：与分类页 / 搜索结果页共用同一视图容器与页面头部 */
      showPage("home");
      setLayout(false);
      setContentView("category");
      EduT.search.setCat("all");
      EduT.search.setSubCat("");
      EduT.render.renderCategories("all");
      EduT.render.renderCategoryList();
    } else if (path === "/tools") {
      /* 自研工具页：与其它五页共用同一视图容器与页面头部
         （不再有独立的 #toolsPage，避免 .page > .container 的 24px 左右 padding
           让内容宽度比其余几页窄 48px） */
      showPage("home");
      setLayout(false);
      setContentView("category");
      EduT.search.setCat("all");
      EduT.search.setSubCat("");
      EduT.render.renderCategories("all");
      EduT.render.renderSelfTools();
    } else if (path === "/articles") {
      /* 教学资讯页：与分类页 / 搜索结果页 / 全部分类页共用同一视图容器与页面头部
         （不再有独立的 #articlesPage，避免 .page > .container 的 24px 左右 padding
           让内容宽度比其余三页窄 48px） */
      showPage("home");
      setLayout(false);
      setContentView("category");
      EduT.search.setCat("all");
      EduT.search.setSubCat("");
      EduT.render.renderCategories("all");
      EduT.render.renderArticles();
    } else if (path === "/about") {
      /* 关于页：与分类页 / 搜索结果页 / 全部分类页 / 教学资讯页共用同一视图容器与页面头部
         （顶栏「关于」与页脚「关于我们」指向此处，早期该路由不存在会被弹回首页） */
      showPage("home");
      setLayout(false);
      setContentView("category");
      EduT.search.setCat("all");
      EduT.search.setSubCat("");
      EduT.render.renderCategories("all");
      EduT.render.renderAbout();
    } else {
      navigate("/");
    }
  }

  /**
   * 路由分发入口
   * 差异说明：
   * - popstate 是真实用户导航（前进/后退），无论路径是否变化都重新渲染，
   *   保证与浏览器行为完全一致。
   * - hashchange 额外做重复过滤：部分遗留工具自带 hash 路由（如 math-mastery
   *   内部写 location.hash="#/path"），若不加过滤会把站点当前页整个重渲染，
   *   工具里的用户输入/状态被清空。
   * @param {boolean} force - true=强制重渲染（popstate / file 导航）
   * @returns {void}
   */
  function handleRoute(force) {
    const p = parsePath();
    if (!force && p === lastPath) return;
    lastPath = p;
    router();
  }

  /**
   * 编程式导航
   * - http(s)：history.pushState 写入干净路径后手工触发渲染
   * - file:   写入 location.hash，由 hashchange 驱动
   * @param {string} path - 路径（如 /onlinetools/comment）
   * @returns {void}
   */
  function navigate(path) {
    const target = IS_FILE ? path : normalizePath(path);
    if (target === parsePath()) { router(); lastPath = target; return; }
    if (IS_FILE) {
      location.hash = target;   // hashchange 会自动调用 handleRoute()
      return;
    }
    try {
      history.pushState(null, "", target);
    } catch (e) {
      /* 极少数环境（data:/blob: 文档）禁用 pushState → 退回 hash 路由 */
      location.hash = target;
      return;
    }
    lastPath = target;
    router();
  }

  /**
   * 拦截站内 <a> 点击，使用 History API 导航（避免整页刷新）
   * @param {Event} e - 点击事件
   * @returns {void}
   */
  function handleLinkClick(e) {
    const a = e.target.closest("a[href]");
    if (!a) return;
    let href = a.getAttribute("href");
    if (!href) return;
    /* 历史写法兼容：/#/xxx、#/xxx 一律剥掉 # 还原成 /xxx */
    if (href === "/#/" || href === "#/") href = "/";
    else if (href.startsWith("/#/")) href = href.slice(2);
    else if (href.startsWith("#/")) href = href.slice(1);
    // 只处理站内以 / 开头的相对链接；外链、锚点、mailto、tel 等放行
    if (!href.startsWith("/") || href.startsWith("//")) return;
    // 新窗口打开的链接放行
    if (a.target === "_blank" || a.target === "_parent" || a.target === "_top") return;
    // 修饰键点击放行（新标签页）
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    e.preventDefault();
    navigate(href);
  }

  /**
   * 旧 hash 地址（/#/categories）迁移为干净地址（/categories）
   * 仅在路径停在根 / index.html 时执行 —— 深链接场景（如 /onlinetools/rollcall
   * 里工具自己改 hash）不能被迁移，否则会把工具页的地址改写掉。
   * @returns {void}
   */
  function migrateLegacyHash() {
    const p = location.pathname || "/";
    const isRoot = p === "/" || p === "" || /(^|\/)index\.html$/i.test(p);
    const h = location.hash || "";
    if (!isRoot || h.charAt(1) !== "/") return;
    try { history.replaceState(null, "", h.slice(1)); } catch (e) { /* 不支持则走 parsePath 兼容分支 */ }
  }

  /**
   * 初始化：绑定路由事件与站内链接点击拦截
   * - http(s)：监听 popstate（浏览器前进/后退）+ hashchange（旧地址兼容）
   * - file:   只能监听 hashchange
   * - 首次加载命中旧 hash 地址时先迁移再渲染
   * @returns {void}
   */
  function init() {
    document.addEventListener("click", handleLinkClick);
    if (IS_FILE) {
      /* file:// 下 hash 就是唯一的导航通道 → 必须强制重渲染 */
      window.addEventListener("hashchange", () => handleRoute(true));
      lastPath = null;
      handleRoute(true);
      return;
    }
    window.addEventListener("popstate", () => handleRoute(true));
    window.addEventListener("hashchange", () => handleRoute(false));
    migrateLegacyHash();
    handleRoute(true);
  }

  global.EduToolbox.router = { init, router, navigate, parsePath, normalizePath };
})(window);
