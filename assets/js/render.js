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
  const { $, escapeHtml } = EduT.utils;

  /**
   * 渲染分类侧栏（带工具数量）
   * @param {string} activeId - 当前激活的分类 id
   * @returns {void}
   */
  function renderCategories(activeId) {
    const list = $("#catList");
    const items = [
      { id: "all", name: "全部工具", icon: "✨", count: EduT.search.flattenTools().length },
      ...DB.categories.map(c => ({ id: c.id, name: c.name, icon: c.icon, count: c.tools.length })),
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
        <span class="dropdown-item-count">${c.tools.length}</span>
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
    // 学科分类映射到 data.js 的 categories id
    const subjects = [
      { catId: "math",      name: "数学", icon: "📐" },
      { catId: "chinese",   name: "语文", icon: "📚" },
      { catId: "english",   name: "英语", icon: "🌍" },
      { catId: "physics",   name: "物理", icon: "⚛️" },
      { catId: "chemistry", name: "化学", icon: "🧪" },
      { catId: "geo",       name: "地理", icon: "🌏" },
      { catId: "history",   name: "历史", icon: "🏛️" },
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
      id: c.id, name: c.name, icon: c.icon, count: c.tools.length,
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
    const href = isSelf
      ? `/onlinetools/${t.slug}`
      : (t.url || "#");
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
          ${t.tags.slice(0, 3).map(tag => `<span class="tag">${escapeHtml(tag)}</span>`).join("")}
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
   * 渲染首页分类独立区块（每分类显示前 4 个 + "更多 XX 工具 →"）
   * @returns {void}
   */
  function renderAllCategories() {
    const container = $("#categorySections");
    if (!container) return;
    container.innerHTML = DB.categories.map(cat => {
      const first12 = cat.tools.slice(0, 12);
      return `
        <section class="cat-block">
          <header class="cat-block-head">
            <h3>${cat.icon} ${escapeHtml(cat.name)}</h3>
            <a class="cat-block-more" href="/section/${cat.id}">更多 ${escapeHtml(cat.name)} 工具 →</a>
          </header>
          <div class="tool-grid cat-block-grid">
            ${first12.map(t => {
              const full = { ...t, catId: cat.id, catName: cat.name, catIcon: cat.icon };
              return toolCard(full);
            }).join("")}
          </div>
        </section>
      `;
    }).join("");
  }

  /**
   * 渲染分类列表页（全部分类卡片入口）
   * @returns {void}
   */
  function renderCategoryList() {
    const grid = $("#catListGrid");
    const desc = $("#catListDesc");
    if (!grid) return;
    const total = DB.categories.reduce((s, c) => s + c.tools.length, 0);
    if (desc) desc.textContent = `${DB.categories.length} 个分类 · ${total}+ 教育工具与资源`;
    grid.innerHTML = DB.categories.map(cat => `
      <a class="cat-card" href="/section/${cat.id}">
        <div class="cat-card-icon">${cat.icon}</div>
        <div class="cat-card-body">
          <h3 class="cat-card-name">${escapeHtml(cat.name)}</h3>
          <span class="cat-card-count">${cat.tools.length} 个工具</span>
        </div>
        <span class="cat-card-arrow">›</span>
      </a>
    `).join("");
  }

  /**
   * 渲染工具网格
   * @param {Object[]} list - 工具数组
   * @returns {void}
   */
  function renderTools(list) {
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
   * 渲染独立搜索结果页（面包屑 + 居中标题 + 结果网格）
   * @param {string} keyword - 搜索关键词
   * @returns {void}
   */
  function renderSearchResults(keyword) {
    const q = (keyword || "").trim();
    const grid = $("#searchGrid");
    const empty = $("#searchEmpty");
    const list = EduT.search.byKeyword(q);
    $("#searchBreadcrumb").textContent = q ? `搜索: ${q}` : "搜索";
    $("#searchTitle").textContent = q ? `搜索: ${q}` : "搜索结果";
    $("#searchCount").textContent = q ? `共找到 ${list.length} 个相关工具` : "";
    if (!list.length) {
      grid.innerHTML = "";
      empty.hidden = false;
      return;
    }
    empty.hidden = true;
    grid.innerHTML = list.map(toolCard).join("");
  }

  /**
   * 渲染自研工具卡片网格
   * @returns {void}
   */
  function renderSelfTools() {
    $("#selfToolsGrid").innerHTML = DB.selfTools.map(t => `
      <div class="tool-card self-tool-card" data-tool="${t.slug}">
        ${t.featured ? `<span class="tool-badge">推荐</span>` : ""}
        <div class="tool-head">
          <span class="tool-cat-icon">🛠️</span>
          <span class="tool-cat">自研免费</span>
        </div>
        <h4 class="tool-name">${t.icon || ""} ${escapeHtml(t.name)}</h4>
        <p class="tool-desc">${escapeHtml(t.desc)}</p>
        <div class="tool-tags"><span class="tag">本地运行</span><span class="tag">隐私保护</span></div>
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
          <a class="btn btn-primary" href="${t.url}" target="_blank" rel="noopener">访问工具 →</a>
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
    renderCategories, renderCategoryDropdown, renderSelfDropdown,
    renderSubjectEntry, renderCategoryTags,
    renderTools, renderFeatured, renderAllCategories, renderCategoryList,
    renderSearchResults,
    renderSelfTools, renderArticles, renderToolDetail, renderStats
  };
})(window);
