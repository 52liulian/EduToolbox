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
   * 切换 #categoryGridView 内的视图区块（同一容器内的四种互斥视图）
   * "tools"    —— 分类页 / 搜索结果页：content-head + 工具网格（+空状态）
   * "catList"  —— 全部分类页：分类卡片网格
   * "articles" —— 教学资讯页：资讯卡片网格
   * "about"    —— 关于页：项目介绍区块
   * 四种视图共用同一个容器宽度，保证五页视觉几何完全一致
   * @param {"tools"|"catList"|"articles"|"about"} mode - 视图模式
   * @returns {void}
   */
  function setGridView(mode) {
    const head = $("#categoryContentHead");
    const toolGrid = $("#toolGrid");
    const catGrid = $("#catListGrid");
    const articleList = $("#articleList");
    const aboutView = $("#aboutView");
    if (head) head.hidden = mode !== "tools";
    if (toolGrid) toolGrid.hidden = mode !== "tools";
    if (catGrid) catGrid.hidden = mode !== "catList";
    if (articleList) articleList.hidden = mode !== "articles";
    if (aboutView) aboutView.hidden = mode !== "about";
    // 非工具视图下空状态不应残留（搜索空结果态只对工具视图有意义）
    const empty = $("#emptyState");
    if (empty && mode !== "tools") empty.hidden = true;
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
   * 渲染教学资讯页（/articles）
   * 与分类页 / 搜索结果页 / 全部分类页共用 #categoryGridView 容器与
   * renderCategoryHeader 头部：先切到 "articles" 视图，再注入共用头部，
   * 最后填充 #articleList 资讯卡片网格
   * @returns {void}
   */
  function renderArticles() {
    const list = $("#articleList");
    if (!list) return;
    setGridView("articles");
    const total = (DB.articles || []).length;
    renderCategoryHeader({
      cur: "教学资讯",
      title: "📚 教学工具资讯",
      desc: `共 ${total} 篇教学工具动态与资源推荐，分享课堂实用技巧与好用的教学工具`,
    });
    list.innerHTML = (DB.articles || []).map(a => `
      <article class="article-card">
        <div class="article-meta"><span class="tag">${escapeHtml(a.tag)}</span><time>${escapeHtml(a.date)}</time></div>
        <h4>${escapeHtml(a.title)}</h4>
        <p>${escapeHtml(a.excerpt)}</p>
      </article>
    `).join("");
  }

  /**
   * 渲染关于页（/about）
   * 与分类页 / 搜索结果页 / 全部分类页 / 教学资讯页共用 #categoryGridView 容器与
   * renderCategoryHeader 头部：先切到 "about" 视图，再注入共用头部，
   * 最后填充 #aboutView（项目简介 + 数据统计 + 站点特性 + 收录标准 + 隐私说明 + 联系入口）
   * 说明：所有统计数字实时取自 DB / search，数据增删后无需同步改文案
   * @returns {void}
   */
  function renderAbout() {
    const view = $("#aboutView");
    if (!view) return;
    setGridView("about");
    const catCount = DB.categories.length;
    const toolCount = EduT.search.flattenTools().length;
    const selfCount = (DB.selfTools || []).length;
    const articleCount = (DB.articles || []).length;

    renderCategoryHeader({
      cur: "关于",
      title: "🙋 关于 EduToolbox",
      desc: "一站式教师工具资源导航平台 · 由杏坛网络工作室维护 —— 整理好用的教学工具，自研开箱即用的课堂小工具",
    });

    // 数据统计四宫格（数字随数据层实时变化）
    const stats = [
      { n: toolCount, label: "收录工具" },
      { n: catCount, label: "工具分类" },
      { n: selfCount, label: "自研工具" },
      { n: articleCount, label: "教学资讯" },
    ].map(s => `
      <div class="about-stat">
        <b>${s.n}</b>
        <span>${escapeHtml(s.label)}</span>
      </div>`).join("");

    // 站点特性六宫格
    const features = [
      { icon: "🧭", name: "分类导航", text: `按备课、课件、组卷、直播、教学管理等 ${catCount} 个场景分类整理，按图索骥即可找到需要的工具。` },
      { icon: "🛠️", name: "自研工具", text: `${selfCount} 个浏览器内直跑的小工具：评语生成、随机点名、考试倒计时、抽题、奖状、Excel 处理等，点开即用。` },
      { icon: "🔒", name: "隐私优先", text: "自研工具全部在本地计算，名单与文本不上传服务器；主题、偏好只写在本机 localStorage。" },
      { icon: "📴", name: "离线可用", text: "依赖库已全部本地化，下载后双击 index.html（file://）也能完整运行，断网不耽误备课。" },
      { icon: "🎨", name: "双主题", text: "浅色 / 深色一键切换，另有六套品牌配色，夜间备课不刺眼，偏好自动记住。" },
      { icon: "🖨️", name: "打印友好", text: "工具结果打印时只输出内容本身，不带站点导航与页眉页脚，直接贴教案或发给家长。" },
    ].map(f => `
      <div class="about-feature">
        <span class="about-feature-icon">${f.icon}</span>
        <h4>${escapeHtml(f.name)}</h4>
        <p>${escapeHtml(f.text)}</p>
      </div>`).join("");

    // 收录标准（有序清单）
    const rules = [
      "真实教学场景可用，优先免费或 freemium（有免费额度的商业工具）；",
      "界面清晰、无强制弹窗与诱导广告，不需要复杂培训就能上手；",
      "长期维护、链接稳定，收录后定期复查死链并及时下架；",
      "尊重版权，不收录破解软件与侵权资源。",
    ].map(r => `<li>${escapeHtml(r)}</li>`).join("");

    view.innerHTML = `
      <section class="about-block">
        <h3 class="about-block-title">项目简介</h3>
        <p class="about-text">
          EduToolbox（教师工具箱）是一站式教师工具资源导航平台，由<strong>杏坛网络工作室</strong>维护。
          我们把散落在各处的好用教学工具按场景整理成 ${catCount} 个分类，并自研了一批开箱即用的课堂小工具。
          目标只有一个：让老师少折腾工具，把时间留给课堂。
        </p>
        <div class="about-stats">${stats}</div>
        <div class="about-entry">
          <a class="btn btn-primary" href="/categories">📂 浏览全部分类</a>
          <a class="btn btn-ghost" href="/tools">🛠️ 必用工具</a>
          <a class="btn btn-ghost" href="/articles">📚 教学资讯</a>
        </div>
      </section>

      <section class="about-block">
        <h3 class="about-block-title">站点特性</h3>
        <div class="about-features">${features}</div>
      </section>

      <section class="about-block">
        <h3 class="about-block-title">收录标准</h3>
        <ol class="about-rules">${rules}</ol>
        <p class="about-text">
          技术说明：本站为纯前端静态站点，原生 HTML + CSS + JavaScript（IIFE 模块化），
          零构建、零后端、零埋点，可托管在任意静态服务器（GitHub Pages / 对象存储 / 本地 file:// 均可）。
        </p>
      </section>

      <section class="about-block">
        <h3 class="about-block-title">隐私与数据</h3>
        <ul class="about-rules about-rules-plain">
          <li>没有账号体系，不需要注册登录。</li>
          <li>自研工具的输入（学生名单、评语文本、题目等）只在你的浏览器里处理，刷新即消失。</li>
          <li>配色与深浅色偏好写在浏览器 localStorage，清除浏览器数据即可一并抹掉。</li>
        </ul>
      </section>

      <section class="about-block">
        <h3 class="about-block-title">提交收录 / 联系我们</h3>
        <p class="about-text">
          发现死链、分类有误，或想推荐一个好用的教学工具？欢迎通过下面的表单告诉我们，我们会尽快核实处理。
        </p>
        <div class="about-entry">
          <a class="btn btn-primary" href="${withUtm("https://f.wps.cn/g/Ap4o8gL1/")}" target="_blank" rel="noopener">📲 提交收录 / 意见反馈</a>
        </div>
      </section>

      <p class="about-note">
        免责声明：本站仅提供工具导航与索引，收录工具的版权、可用性与收费规则归原作者所有；
        点击工具卡片会跳转第三方站点，请自行甄别内容与付费信息。
      </p>
    `;
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
    renderCategoryHeader, setGridView, renderSearchResults,
    renderSelfTools, renderArticles, renderAbout, renderToolDetail, renderStats
  };
})(window);
