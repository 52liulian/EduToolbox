/**
 * EduToolbox 渲染层
 * ============================================================================
 * 功能：渲染分类侧栏、学科入口、分类标签云、下拉菜单、工具卡片网格、自研工具卡片、文章列表、工具详情页
 * 加载顺序：utils.js / data.js / search.js 之后
 * ============================================================================
 */
(function (global) {
  "use strict";

  global.EduToolbox = global.EduToolbox || {};

  const EduT = global.EduToolbox;
  const { $, escapeHtml, withUtm } = EduT.utils;

  /**
   * 统计单个分类下的工具总数
   * 口径统一：父分类直挂工具 + 所有子分类工具
   * （旧写法只算 cat.tools，导致仅有 subCategories 的分类显示为 0）
   * @param {Object} cat - 分类对象
   * @returns {number}
   */
  function countTools(cat) {
    const own = (cat.tools || []).length;
    const sub = (cat.subCategories || []).reduce((s, sc) => s + (sc.tools || []).length, 0);
    return own + sub;
  }

  /**
   * 全站工具总数（口径同 countTools：父分类 + 子分类）
   * @returns {number}
   */
  function countAllTools() {
    return DB.categories.reduce((s, c) => s + countTools(c), 0);
  }

  /**
   * 渲染分类侧栏（带工具数量）
   * @param {string} activeId - 当前激活的分类 id
   * @returns {void}
   */
  function renderCategories(activeId) {
    const list = $("#catList");
    const items = [
      { id: "all", name: "全部工具", icon: "✨", count: countAllTools() },
      ...DB.categories.map(c => ({ id: c.id, name: c.name, icon: c.icon, count: countTools(c) })),
    ];
    list.innerHTML = items.map(c => `
      <li>
        <a href="/section/${c.id}" class="cat-item ${c.id === activeId ? "active" : ""}" data-cat="${c.id}">
          <span class="cat-icon">${c.icon}</span>
          <span class="cat-name">${escapeHtml(c.name)}</span>
          <span class="cat-count">${c.count}</span>
        </a>
      </li>
    `).join("");
  }

  /**
   * 渲染顶栏分类下拉菜单
   * @returns {void}
   */
  function renderCategoryDropdown() {
    const menu = $("#catDropdown");
    if (!menu) return;
    menu.innerHTML = DB.categories.map(c => `
      <a href="/section/${c.id}" class="dropdown-item">
        <span class="dropdown-item-icon">${c.icon}</span>
        <span>${escapeHtml(c.name)}</span>
        <span class="dropdown-item-count">${countTools(c)}</span>
      </a>
    `).join("");
  }

  /**
   * 渲染顶栏必用工具下拉菜单
   * @returns {void}
   */
  function renderSelfDropdown() {
    const menu = $("#selfDropdown");
    if (!menu) return;
    menu.innerHTML = DB.selfTools.map(t => `
      <a href="/onlinetools/${t.slug}" class="dropdown-item">
        <span class="dropdown-item-icon">${t.icon || "🛠️"}</span>
        <span>${escapeHtml(t.name)}</span>
      </a>
    `).join("");
  }

  /**
   * 渲染学科快速入口（彩色圆角按钮）
   * @returns {void}
   */
  function renderSubjectEntry() {
    const container = $("#subjectEntry");
    if (!container) return;
    // 九科（顺序按学科常规排列；catId 仅用于配色 class，点击按 name 走搜索）
    const subjects = [
      { catId: "chinese",   name: "语文", icon: "📚" },
      { catId: "math",      name: "数学", icon: "📐" },
      { catId: "english",   name: "英语", icon: "🌍" },
      { catId: "physics",   name: "物理", icon: "⚛️" },
      { catId: "chemistry", name: "化学", icon: "🧪" },
      { catId: "biology",   name: "生物", icon: "🧬" },
      { catId: "politics",  name: "政治", icon: "⚖️" },
      { catId: "history",   name: "历史", icon: "🏛️" },
      { catId: "geo",       name: "地理", icon: "🌏" },
    ];
    container.innerHTML = subjects.map(s => `
      <button class="subject-btn cat-${s.catId}" data-cat="${s.catId}" data-name="${s.name}">
        ${s.icon} ${s.name}
      </button>
    `).join("");
  }

  /**
   * 渲染分类标签云（两行交叉循环滚动：上行左移、下行右移）
   * 每条轨道内复制两份相同标签，配合 CSS 位移实现无缝循环
   * @returns {void}
   */
  function renderCategoryTags() {
    const container = $("#categoryTags");
    if (!container) return;
    const catTagHtml = c => `
      <a href="/section/${c.id}" class="cat-tag" data-cat="${c.id}">
        <span>${c.icon} ${escapeHtml(c.name)}</span>
        <span class="cat-tag-count">${c.count}</span>
      </a>`;
    const all = DB.categories.map(c => ({
      id: c.id, name: c.name, icon: c.icon, count: countTools(c),
    }));
    // 奇偶拆分到两行，使两行长度尽量均衡
    const rowA = all.filter((_, i) => i % 2 === 0);
    const rowB = all.filter((_, i) => i % 2 === 1);
    const track = list =>
      `<div class="cat-tag-track">${list.map(catTagHtml).join("")}${list.map(catTagHtml).join("")}</div>`;

    // 标签云：从所有工具 tags 去重，按出现频率排序，单行连续左移
    const tagCount = {};
    DB.categories.forEach(c => c.tools.forEach(t =>
      (t.tags || []).forEach(tag => { tagCount[tag] = (tagCount[tag] || 0) + 1; })
    ));
    const tagList = Object.entries(tagCount)
      .sort((a, b) => b[1] - a[1])
      .map(([name]) => escapeHtml(name));
    const toolTagHtml = name =>
      `<a href="/search?q=${encodeURIComponent(name)}" class="tpl-tag" data-tag="${name}">${name}</a>`;
    const tagTrack =
      `<div class="cat-tag-track">${tagList.map(toolTagHtml).join("")}${tagList.map(toolTagHtml).join("")}</div>`;

    container.innerHTML = `
      <div class="cat-tag-row cat-tag-row--left">${track(rowA)}</div>
      <div class="cat-tag-row cat-tag-row--right">${track(rowB)}</div>
      <div class="cat-tag-row cat-tag-row--tags">${tagTrack}</div>`;
  }

  /**
   * 生成工具卡片 HTML
   * 外链工具：直接 href → 原站（target="_blank"）
   * 自研工具：href → 内部 /onlinetools/:slug
   * @param {Object} t - 工具对象
   * @returns {string}
   */
  /**
   * 从 URL 字符串中提取域名，用于 favicon 图标
   * @param {string} url - 完整 URL
   * @returns {string} 域名，失败返回空
   */
  function extractDomain(url) {
    if (!url || url === "#") return "";
    try {
      // 补全协议
      const u = /^https?:\/\//i.test(url) ? url : `https://${url}`;
      return new URL(u).hostname;
    } catch (e) {
      const m = url.match(/^([^\/]+)/);
      return m ? m[1] : "";
    }
  }

  /**
   * 生成工具卡片 HTML
   * 外链工具：尝试站点 favicon，失败回退 emoji
   * 自研工具：使用 emoji/icon
   * @param {Object} t - 工具对象
   * @returns {string}
   */
  function toolCard(t) {
    const isSelf = t.kind === "self" || t.isSelf;
    // 外链工具：原站地址 + 来源标记 utm_source=<本站域名>（自研工具走站内路由，不处理）
    const href = isSelf
      ? `/onlinetools/${t.slug}`
      : withUtm(t.url || "#");
    const externalAttr = !isSelf ? ` target="_blank" rel="noopener"` : "";

    // 图标：外链在联网时尝试 favicon.im，离线（file:// 或断网）直接用 🔗，避免无效外网请求
    let iconHtml;
    if (isSelf) {
      iconHtml = `<span class="tool-name-icon">${t.icon || "🔧"}</span>`;
    } else {
      const domain = navigator.onLine ? extractDomain(t.url) : "";
      if (domain) {
        iconHtml = `<img class="tool-name-icon tool-favicon" src="https://a.favicon.im/${domain}?larger=true" alt="" onerror="this.style.display='none';this.insertAdjacentHTML('afterend','<span class=tool-name-icon>🔗</span>')">`;
      } else {
        iconHtml = `<span class="tool-name-icon">🔗</span>`;
      }
    }

    return `
      <a class="tool-card" href="${href}"${externalAttr}>
        <div class="tool-title-row">
          ${iconHtml}
          <h4 class="tool-name">${escapeHtml(t.name)}</h4>
          <span class="tool-ext">↗</span>
        </div>
        <p class="tool-desc">${escapeHtml(t.desc)}</p>
        <div class="tool-tags">
          ${isSelf
            ? (t.tags || []).slice(0, 2).map(tag => `<span class="tag">${escapeHtml(tag)}</span>`).join("")
              + `<span class="tag tag-local">本地运行</span>`
            : (t.tags || []).slice(0, 3).map(tag => `<span class="tag">${escapeHtml(tag)}</span>`).join("")}
        </div>
      </a>
    `;
  }

  /**
   * 渲染首页 ⭐ 精选推荐区
   * 复用 toolCard，包一层 marquee 容器实现左移滚动
   * @returns {void}
   */
  function renderFeatured() {
    const grid = $("#featuredGrid");
    if (!grid) return;
    const list = DB.featuredAll.slice(0, 12);
    // marquee 需要重复一份实现无缝循环
    const html = list.map(toolCard).join("");
    grid.innerHTML = `
      <div class="marquee-track marquee-track-a">${html}</div>
      <div class="marquee-track marquee-track-b">${html}</div>
    `;
  }

  /**
   * 渲染某个 cat-block 内的工具网格 HTML（按子分类过滤；subCatId 为空串/undefined 取全部）
   * 无子分类时直接返回 cat.tools 前 12 个
   * @param {Object} cat - 分类对象
   * @param {string} [subCatId] - 子分类 id；空则取全部（父级 + 子分类合并）
   * @returns {string} 工具卡片 HTML
   */
  function renderCatBlockTools(cat, subCatId) {
    const pool = subCatId
      ? ((cat.subCategories || []).find(s => s.id === subCatId)?.tools || [])
      : [...(cat.tools || []), ...(cat.subCategories || []).flatMap(s => s.tools)];
    const cards = pool.slice(0, 12).map(t => {
      const full = { ...t, catId: cat.id, catName: cat.name, catIcon: cat.icon };
      return toolCard(full);
    }).join("");
    // 空池：复用 .state 空状态基线
    return cards || '<div class="state state--empty"><div class="state-icon">📭</div><div class="state-title">暂无工具</div></div>';
  }

  /**
   * 渲染首页分类独立区块
   * - 有 subCategories 的分类：在 head 与 grid 之间插入 tab 条（默认"全部"激活）
   * - 无 subCategories 的分类：保持原样，直接展示前 12 个工具
   * @returns {void}
   */
  function renderAllCategories() {
    const container = $("#categorySections");
    if (!container) return;
    container.innerHTML = DB.categories.map(cat => {
      const hasSub = Array.isArray(cat.subCategories) && cat.subCategories.length > 0;
      const tabsHTML = hasSub ? `
        <div class="cat-tabs" data-cat="${cat.id}">
          <button class="cat-tab active" data-subcat="">全部</button>
          ${cat.subCategories.map(sc =>
            `<button class="cat-tab" data-subcat="${sc.id}">${sc.icon} ${escapeHtml(sc.name)}</button>`
          ).join("")}
        </div>
      ` : "";
      return `
        <section class="cat-block" data-cat-block="${cat.id}">
          <header class="cat-block-head">
            <h3>${cat.icon} ${escapeHtml(cat.name)}</h3>
            <a class="cat-block-more" href="/section/${cat.id}">更多 ${escapeHtml(cat.name)} 工具 →</a>
          </header>
          ${tabsHTML}
          <div class="tool-grid cat-block-grid" data-grid="${cat.id}">
            ${renderCatBlockTools(cat, "")}
          </div>
        </section>
      `;
    }).join("");

    // 一次性事件委托：点击 .cat-tab 只切换该 cat-block 内的网格
    if (!container.dataset.bound) {
      container.addEventListener("click", e => {
        const tab = e.target.closest(".cat-tab");
        if (!tab) return;
        const tabsBar = tab.closest(".cat-tabs");
        if (!tabsBar) return;
        const catId = tabsBar.dataset.cat;
        const catObj = DB.categories.find(c => c.id === catId);
        if (!catObj) return;
        const subCatId = tab.dataset.subcat || "";
        // 切换激活态
        tabsBar.querySelectorAll(".cat-tab").forEach(t => t.classList.toggle("active", t === tab));
        // 重渲染对应网格
        const grid = container.querySelector(`.cat-block-grid[data-grid="${catId}"]`);
        if (grid) grid.innerHTML = renderCatBlockTools(catObj, subCatId);
      });
      container.dataset.bound = "1";
    }
  }

  /**
   * 渲染全部分类页（分类卡片入口）
   * 头部与分类页 / 搜索结果页共用 renderCategoryHeader
   * @returns {void}
   */
  function renderCategoryList() {
    const grid = $("#catListGrid");
    if (!grid) return;
    setGridView("catList");
    const empty = $("#emptyState");
    if (empty) empty.hidden = true;
    const total = countAllTools();
    renderCategoryHeader({
      cur: "全部分类",
      title: `📂 全部分类`,
      desc: `${DB.categories.length} 个分类 · ${total}+ 教育工具与资源`,
    });
    grid.innerHTML = DB.categories.map(cat => `
      <a class="cat-card" href="/section/${cat.id}">
        <div class="cat-card-icon">${cat.icon}</div>
        <div class="cat-card-body">
          <h3 class="cat-card-name">${escapeHtml(cat.name)}</h3>
          <span class="cat-card-count">${countTools(cat)} 个工具</span>
        </div>
        <span class="cat-card-arrow">›</span>
      </a>
    `).join("");
  }

  /**
   * 页面头部（面包屑 + 大标题 + 副标题）—— 分类页 / 搜索结果页 / 全部分类页共用
   * 注入到目标容器顶部，三页因此拥有完全一致的头部结构与视觉
   * @param {Object} opts - 配置
   * @param {string} [opts.container] - 容器选择器，默认 "#categoryGridView"
   * @param {string} [opts.mid]  - 面包屑中段 HTML（如分类页的"分类"链接，留空则省略该段）
   * @param {string} [opts.cur]  - 面包屑当前节点（已转义的 HTML）
   * @param {string} [opts.title] - 大标题（已转义的 HTML）
   * @param {string} [opts.desc]  - 副标题（已转义的 HTML）
   * @returns {void}
   */
  function renderCategoryHeader(opts) {
    const o = opts || {};
    const container = document.querySelector(o.container || "#categoryGridView");
    if (!container) return;
    // 移除上一次注入的头部，避免重复堆叠
    const oldHead = container.querySelector(".category-page-header");
    if (oldHead) oldHead.remove();
    // 面包屑：首页 [/ 中段] / 当前
    const crumbs = [`<a href="/">首页</a>`];
    if (o.mid) crumbs.push(`<span class="sep">/</span>`, o.mid);
    crumbs.push(`<span class="sep">/</span>`, `<span class="cp-breadcrumb-cur">${o.cur || ""}</span>`);
    const head = document.createElement("div");
    head.className = "category-page-header";
    head.innerHTML = `
      <nav class="cp-breadcrumb">${crumbs.join("")}</nav>
      <h1 class="cp-title">${o.title || ""}</h1>
      <p class="cp-desc">${o.desc || ""}</p>
    `;
    container.insertBefore(head, container.firstChild);
  }

  /**
   * 切换 #categoryGridView 内的视图区块
   * "tools"   —— 分类页 / 搜索结果页：content-head + 工具网格（+空状态）
   * "catList" —— 全部分类页：分类卡片网格
   * @param {"tools"|"catList"} mode - 视图模式
   * @returns {void}
   */
  function setGridView(mode) {
    const showTools = mode !== "catList";
    const head = $("#categoryContentHead");
    const toolGrid = $("#toolGrid");
    const catGrid = $("#catListGrid");
    if (head) head.hidden = !showTools;
    if (toolGrid) toolGrid.hidden = !showTools;
    if (catGrid) catGrid.hidden = showTools;
  }

  /**
   * 渲染工具网格
   * @param {Object[]} list - 工具数组
   * @returns {void}
   */
  function renderTools(list) {
    setGridView("tools");
    const grid = $("#toolGrid");
    const empty = $("#emptyState");
    $("#resultCount").textContent = list.length ? `共 ${list.length} 个工具` : "";
    if (!list.length) {
      grid.innerHTML = "";
      empty.hidden = false;
      return;
    }
    empty.hidden = true;
    grid.innerHTML = list.map(toolCard).join("");
  }

  /**
   * 渲染搜索结果页
   * 布局与分类页完全一致：共用 #categoryGridView 容器 + .category-page-header 头部
   * + #toolGrid 网格 + #emptyState 空状态（含"清除搜索"按钮）
   * @param {string} keyword - 搜索关键词
   * @returns {void}
   */
  function renderSearchResults(keyword) {
    const q = (keyword || "").trim();
    const list = EduT.search.byKeyword(q);
    const safeQ = escapeHtml(q);
    renderCategoryHeader({
      mid: `<span>搜索</span>`,
      cur: q ? safeQ : "全部",
      title: q ? `🔍 搜索「${safeQ}」` : "🔍 搜索结果",
      desc: q
        ? `关键词「${safeQ}」共匹配 ${list.length} 个工具（自研工具优先，含外链工具）`
        : "输入关键词，搜索全站自研工具与外链工具",
    });
    // 小标题由页面头部接管，清空 content-head 里的旧文案
    $("#sectionTitle").textContent = "";
    // 与分类页共用同一套网格渲染（含结果计数与空状态）
    renderTools(list);
  }

  /**
   * 渲染自研工具卡片网格
   * @returns {void}
   */
  function renderSelfTools() {
    $("#selfToolsGrid").innerHTML = DB.selfTools.map(t => `
      <div class="tool-card self-tool-card" data-tool="${t.slug}">
        ${t.featured ? `<span class="tool-badge">推荐</span>` : ""}
        <h4 class="tool-name">${t.icon || ""} ${escapeHtml(t.name)}</h4>
        <p class="tool-desc">${escapeHtml(t.desc)}</p>
        <div class="tool-tags">
          ${(t.tags || []).slice(0, 2).map(tag => `<span class="tag">${escapeHtml(tag)}</span>`).join("")}
          <span class="tag tag-local">本地运行</span>
        </div>
      </div>
    `).join("");
    EduT.utils.$$(".self-tool-card").forEach(card => {
      card.addEventListener("click", () => EduT.router.navigate(`/onlinetools/${card.dataset.tool}`));
    });
  }

  /**
   * 渲染文章列表
   * @returns {void}
   */
  function renderArticles() {
    $("#articleList").innerHTML = DB.articles.map(a => `
      <article class="article-card">
        <div class="article-meta"><span class="tag">${escapeHtml(a.tag)}</span><time>${escapeHtml(a.date)}</time></div>
        <h4>${escapeHtml(a.title)}</h4>
        <p>${escapeHtml(a.excerpt)}</p>
      </article>
    `).join("");
  }

  /**
   * 渲染工具详情页
   * @param {string} slug - 工具 slug
   * @returns {boolean} 是否成功渲染
   */
  function renderToolDetail(slug) {
    const all = EduT.search.flattenTools();
    const t = all.find(x => x.slug === slug);
    if (!t) return false;
    $("#detailContent").innerHTML = `
      <div class="tool-detail">
        <div class="tool-detail-meta">
          <span class="tag">${escapeHtml(t.catName || "")}</span>
          ${t.featured ? `<span class="tag" style="color:var(--primary);border-color:var(--primary)">推荐</span>` : ""}
          ${t.tags.map(tag => `<span class="tag">${escapeHtml(tag)}</span>`).join("")}
        </div>
        <h1>${escapeHtml(t.name)}</h1>
        <p class="tool-detail-desc">${escapeHtml(t.desc)}</p>
        <div class="tool-detail-actions">
          <a class="btn btn-primary" href="${withUtm(t.url)}" target="_blank" rel="noopener">访问工具 →</a>
          <a class="btn btn-ghost" href="/section/${t.catId}">查看同类工具</a>
        </div>
      </div>
    `;
    return true;
  }

  /**
   * 渲染首页 Hero 统计数字
   * @returns {void}
   */
  function renderStats() {
    $("#statTools").textContent = EduT.search.flattenTools().length;
    $("#statCats").textContent = DB.categories.length;
  }

  global.EduToolbox.render = {
    countTools, countAllTools,
    renderCategories, renderCategoryDropdown, renderSelfDropdown,
    renderSubjectEntry, renderCategoryTags,
    renderTools, renderFeatured, renderAllCategories, renderCategoryList,
    renderCategoryHeader, renderSearchResults,
    renderSelfTools, renderArticles, renderToolDetail, renderStats
  };
})(window);
