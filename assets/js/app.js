/**
 * EduToolbox 应用入口
 * ============================================================================
 * 功能：DOM Ready 后初始化各模块，绑定全局事件
 * 加载顺序：必须在所有模块（data/utils/theme/search/render/router/tools.*）之后
 * ============================================================================
 */
(function (global) {
  "use strict";

  global.EduToolbox = global.EduToolbox || {};

  const EduT = global.EduToolbox;
  const { $, $$ } = EduT.utils;

  /**
   * 跳转到搜索结果页
   * @param {string} keyword - 搜索关键词
   * @returns {void}
   */
  function goSearch(keyword) {
    const q = (keyword || "").trim();
    EduT.router.navigate(q ? `/search?q=${encodeURIComponent(q)}` : "/");
  }

  /**
   * 绑定搜索框事件
   * @returns {void}
   */
  function bindSearch() {
    const input = $("#searchInput");
    const clear = $("#searchClear");
    const clearBtn = $("#clearSearch");
    const submitBtn = $("#searchBtn");

    // 输入时仅控制清除按钮显隐，结果在独立搜索页展示
    input.addEventListener("input", e => {
      clear.hidden = !e.target.value;
    });
    // 回车 / 点击搜索按钮：跳转搜索结果页
    const submit = () => goSearch(input.value);
    input.addEventListener("keydown", e => {
      if (e.key === "Enter") { e.preventDefault(); submit(); }
    });
    if (submitBtn) submitBtn.addEventListener("click", submit);
    clear.addEventListener("click", () => {
      input.value = "";
      clear.hidden = true;
      input.focus();
    });
    if (clearBtn) {
      clearBtn.addEventListener("click", () => {
        input.value = "";
        if (clear) clear.hidden = true;
        input.focus();
        // 清空后若停在搜索结果页，重渲染一次（回到空关键词的搜索态）
        const p = EduT.router.parsePath ? EduT.router.parsePath() : "";
        if (String(p).startsWith("/search")) EduT.router.navigate("/search");
      });
    }
  }

  /**
   * 绑定分类侧栏点击
   * @returns {void}
   */
  function bindCategories() {
    $("#catList").addEventListener("click", e => {
      const item = e.target.closest(".cat-item");
      if (item) EduT.search.setCat(item.dataset.cat);
    });
  }

  /**
   * 绑定学科快速入口点击 → 跳转搜索结果页搜索对应学科
   * @returns {void}
   */
  function bindSubjectEntry() {
    const container = $("#subjectEntry");
    if (!container) return;
    container.addEventListener("click", e => {
      const btn = e.target.closest(".subject-btn");
      if (!btn || !btn.dataset.name) return;
      goSearch(btn.dataset.name);
    });
  }

  /**
   * 绑定分类标签云点击 → 跳转分类页
   * @returns {void}
   */
  function bindCategoryTags() {
    const container = $("#categoryTags");
    if (!container) return;
    container.addEventListener("click", e => {
      const tag = e.target.closest(".cat-tag");
      if (tag && tag.dataset.cat) {
        e.preventDefault();
        EduT.router.navigate(`/section/${tag.dataset.cat}`);
      }
    });
  }

  /**
   * 绑定顶栏下拉菜单交互
   *   - hover 显示（CSS 已处理）
   *   - click 外部区域关闭
   *   - 移动设备点击触发
   * @returns {void}
   */
  function bindDropdowns() {
    const dropdowns = $$(".nav-dropdown");

    // 点击外部关闭 / 点击菜单项后关闭（菜单项跳转前收回下拉）
    document.addEventListener("click", e => {
      const insideDropdown = e.target.closest(".nav-dropdown");
      const clickedItem = e.target.closest(".dropdown-item");
      if (!insideDropdown || clickedItem) {
        dropdowns.forEach(d => d.classList.remove("open"));
      }
    });

    // 点击触发器切换 open 状态（兼容触屏）
    dropdowns.forEach(dd => {
      const trigger = dd.querySelector(".dropdown-trigger");
      if (trigger) {
        trigger.addEventListener("click", e => {
          e.preventDefault();
          e.stopPropagation();
          dropdowns.forEach(d => { if (d !== dd) d.classList.remove("open"); });
          dd.classList.toggle("open");
        });
      }
    });
  }

  /**
   * 绑定详情页返回按钮
   * @returns {void}
   */
  function bindBack() {
    const back = $("#backBtn");
    if (back) back.addEventListener("click", () => { history.back(); EduT.router.router(); });
  }

  /**
   * 应用初始化入口
   * @returns {void}
   */
  function init() {
    // 渲染
    EduT.render.renderStats();
    EduT.render.renderCategoryDropdown();
    EduT.render.renderSelfDropdown();
    EduT.render.renderSubjectEntry();
    EduT.render.renderCategoryTags();
    EduT.render.renderCategories("all");
    EduT.render.renderTools(EduT.search.applyFilter());
    EduT.render.renderSelfTools();
    EduT.render.renderArticles();

    // 事件绑定
    EduT.theme.init();
    // 全局配色主题（顶栏 #accentBtn）：一次切换，对所有工具生效
    if (EduT.accent && typeof EduT.accent.init === "function") EduT.accent.init();
    bindSearch();
    bindCategories();
    bindSubjectEntry();
    bindCategoryTags();
    bindDropdowns();
    bindBack();

    // 路由最后启动
    EduT.router.init();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  // 调试钩子（生产无影响）
  global.__APP__ = { init, DB, EduT };
})(window);
