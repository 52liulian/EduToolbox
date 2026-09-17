/**
 * EduToolbox 搜索过滤层
 * ============================================================================
 * 功能：按关键词 + 分类筛选工具列表
 * 加载顺序：utils.js / data.js 之后
 * ============================================================================
 */
(function (global) {
  "use strict";

  global.EduToolbox = global.EduToolbox || {};

  const EduT = global.EduToolbox;

  /** 当前激活的分类 id，"all" 表示全部 */
  let currentCat = "all";

  /**
   * 获取当前分类
   * @returns {string}
   */
  function getCat() { return currentCat; }

  /**
   * 设置当前分类
   * @param {string} cat - 分类 id
   * @returns {void}
   */
  function setCat(cat) { currentCat = cat || "all"; }

  /**
   * 展平所有外链工具（附带 catId/catName/catIcon 字段）
   * @returns {Object[]} 工具数组
   */
  function flattenTools() {
    return DB.categories.flatMap(cat =>
      cat.tools.map(t => ({ ...t, catId: cat.id, catName: cat.name, catIcon: cat.icon }))
    );
  }

  /**
   * 应用筛选：分类 + 关键词
   * @returns {Object[]} 筛选后的工具数组
   */
  function applyFilter() {
    const q = (EduT.utils.$("#searchInput").value || "").trim().toLowerCase();
    let list = flattenTools();
    if (currentCat !== "all") list = list.filter(t => t.catId === currentCat);
    if (q) {
      list = list.filter(t =>
        t.name.toLowerCase().includes(q) ||
        t.desc.toLowerCase().includes(q) ||
        t.tags.some(tag => tag.toLowerCase().includes(q)) ||
        t.catName.toLowerCase().includes(q)
      );
    }
    return list;
  }

  /**
   * 计算当前筛选标题文案
   * @returns {string}
   */
  function currentTitle() {
    const q = (EduT.utils.$("#searchInput").value || "").trim();
    if (q) return `搜索：「${q}」`;
    if (currentCat === "all") return "全部工具";
    const c = DB.categories.find(x => x.id === currentCat);
    return c ? c.name : "";
  }

  /**
   * 全局关键词搜索（外链工具 + 自研工具）
   * 匹配字段：名称 / 描述 / 标签 / 分类名
   * @param {string} keyword - 搜索关键词
   * @returns {Object[]} 命中的工具数组（自研带 kind:"self"）
   */
  function byKeyword(keyword) {
    const q = (keyword || "").trim().toLowerCase();
    if (!q) return [];
    const match = t =>
      (t.name || "").toLowerCase().includes(q) ||
      (t.desc || "").toLowerCase().includes(q) ||
      (t.tags || []).some(tag => tag.toLowerCase().includes(q)) ||
      (t.catName || "").toLowerCase().includes(q);

    const external = flattenTools().filter(match);
    const self = (DB.selfTools || [])
      .map(t => ({
        ...t,
        kind: "self",
        tags: t.tags || ["自研工具", "本地运行", "免费"],
      }))
      .filter(match)
      // 自研工具排在前
      .sort(() => -1);

    return [...self, ...external];
  }

  global.EduToolbox.search = { getCat, setCat, applyFilter, currentTitle, flattenTools, byKeyword };
})(window);
