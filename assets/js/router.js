/**
 * EduToolbox 路由层
 * ============================================================================
 * 功能：History API 路由解析与页面调度（URL 无 # 号），联动侧栏显示/隐藏
 * 路由表：
 *   /                      -> 首页（Hero + 分类标签云 + 全部工具网格，无侧栏）
 *   /section/:catId        -> 分类页（侧栏 + 过滤后网格）
 *   /tools                 -> 自研工具页
 *   /tool/:slug            -> 外链工具详情页
 *   /onlinetools/:id       -> 自研工具运行页（异步加载模板）
 *   /articles              -> 文章资讯页
 *   /search?q=关键词       -> 搜索结果页
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
   * - 始终使用 hash 路由（#/path），确保任意服务器（含 python http.server）
   *   刷新时只请求 index.html，不会因找不到路径而 404
   * - iframe src 统一用相对路径，兼容 http(s) 与 file://
   */
  const IS_FILE = location.protocol === "file:";

  /** 页面容器映射 */
  const PAGES = {
    home: ["heroSection", "main"],
    tools: ["toolsPage"],
    articles: ["articlesPage"],
    detail: ["detailPage"],
    categoryList: ["categoryListPage"],
    search: ["searchPage"],
  };

  /**
   * 解析当前路径（含查询串）
   * - 统一读取 location.hash（形如 #/search?q=x），无 hash 视为首页
   * - 兼容首次启动时历史 URL（如 /onlinetools/comment）自动迁移
   * @returns {string} 路径，如 "/search?q=PPT"
   */
  function parsePath() {
    const h = location.hash;
    if (h && h.charAt(1) === "/") return h.slice(1);
    return "/";
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
   * 打开自研工具运行页（iframe 嵌入独立 index.html）
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
      <div class="tool-iframe-wrap">
        <iframe id="toolIframe" src="tools/${slug}/index.html"
          loading="lazy"
          allow="fullscreen"></iframe>
      </div>
    `;

    // iframe 高度自适应
    const iframe = document.getElementById("toolIframe");
    if (iframe) {
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
          iframe.style.height = (window.innerHeight - 150) + "px";
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
          // file:// 跨文档访问被拒：使用视口高度兜底，保证工具完整可见可滚动
          iframe.style.height = (window.innerHeight - 150) + "px";
          iframe.style.minHeight = "70vh";
        }
      });
    }
  }

  /**
   * 主路由调度
   * @returns {void}
   */
  function router() {
    const path = parsePath();
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
      EduT.render.renderFeatured();
      EduT.render.renderAllCategories();
      EduT.render.renderCategories("all");
    } else if (path.startsWith("/search")) {
      showPage("search");
      setLayout(false);
      // 解析查询串：/search?q=关键词
      const qs = path.split("?")[1] || "";
      const params = new URLSearchParams(qs);
      const q = (params.get("q") || "").trim();
      // 同步搜索框（若存在）
      const input = $("#searchInput");
      const clear = $("#searchClear");
      if (input) input.value = q;
      if (clear) clear.hidden = !q;
      EduT.render.renderSearchResults(q);
    } else if (path.startsWith("/section/")) {
      showPage("home");
      setLayout(false);          // 分类页无侧栏（对齐参考站）
      setContentView("category");
      const cat = path.split("/")[2] || "all";
      EduT.search.setCat(cat);
      EduT.render.renderCategories(cat);
      EduT.render.renderTools(EduT.search.applyFilter());
      // 渲染分类页头部（面包屑 + 大标题 + 副标题）
      const catObj = DB.categories.find(c => c.id === cat);
      if (catObj) {
        $("#sectionTitle").textContent = ""; // 清掉旧小标题
        // 用 innerHTML 注入分类页头部
        const container = document.getElementById("categoryGridView");
        if (container) {
          const desc = catObj.desc || catObj.name + "专业工具与资源合集";
          const oldHead = container.querySelector(".category-page-header");
          if (oldHead) oldHead.remove();
          const head = document.createElement("div");
          head.className = "category-page-header";
          head.innerHTML = `
            <nav class="cp-breadcrumb">
              <a href="/">首页</a>
              <span class="sep">/</span>
              <a href="/categories" class="cp-breadcrumb-link">分类</a>
              <span class="sep">/</span>
              <span class="cp-breadcrumb-cur">${catObj.name}</span>
            </nav>
            <h1 class="cp-title">${catObj.icon} ${catObj.name}</h1>
            <p class="cp-desc">${desc}</p>
          `;
          container.insertBefore(head, container.firstChild);
        }
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
      showPage("categoryList");
      setLayout(false);
      EduT.render.renderCategoryList();
    } else if (path === "/tools") {
      showPage("tools");
      setLayout(false);
      EduT.render.renderSelfTools();
    } else if (path === "/articles") {
      showPage("articles");
      setLayout(false);
      EduT.render.renderArticles();
    } else {
      navigate("/");
    }
  }

  /**
   * 编程式导航
   * - 统一写入 location.hash（#/path），由 hashchange 触发渲染
   * @param {string} path - 路径（如 /onlinetools/comment）
   * @returns {void}
   */
  function navigate(path) {
    if (path === parsePath()) { router(); return; }
    location.hash = path;   // hashchange 事件会自动调用 router()
  }

  /**
   * 拦截站内 <a> 点击，使用 History API 导航（避免整页刷新）
   * @param {Event} e - 点击事件
   * @returns {void}
   */
  function handleLinkClick(e) {
    const a = e.target.closest("a[href]");
    if (!a) return;
    const href = a.getAttribute("href");
    // 只处理站内以 / 开头的相对链接；外链、锚点、mailto、tel 等放行
    if (!href || !href.startsWith("/") || href.startsWith("//")) return;
    // 新窗口打开的链接放行
    if (a.target === "_blank" || a.target === "_parent" || a.target === "_top") return;
    // 修饰键点击放行（新标签页）
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    e.preventDefault();
    navigate(href);
  }

  /**
   * 初始化：绑定路由事件与站内链接点击拦截
   * - 始终监听 hashchange
   * - 若首次加载是历史 URL（如 /onlinetools/comment），自动迁移为 #/onlinetools/comment
   * @returns {void}
   */
  function init() {
    window.addEventListener("hashchange", router);
    document.addEventListener("click", handleLinkClick);
    // 历史 URL → hash URL 自动迁移（仅当无 hash 且 pathname 不是 / 时）
    const path = location.pathname;
    if (!location.hash && path && path !== "/" && !path.endsWith("index.html")) {
      const query = location.search || "";
      history.replaceState(null, "", "/" + query);
      location.hash = path + query;
      // hashchange 会自动调用 router()，不再手动调用
      return;
    }
    router();
  }

  global.EduToolbox.router = { init, router, navigate, parsePath };
})(window);
