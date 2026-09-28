/* EduToolbox · 随机打乱工具核心逻辑
 * -----------------------------------------------------------------------------
 * 功能：
 *   1. 名单管理：输入/示例/清空，实时条数统计
 *   2. 分隔符设置：输入/输出分隔符支持换行、逗号、空格、自定义
 *   3. 展示方式：字符串视图（单行文本）或表格视图（带序号列表）
 *   4. Fisher-Yates 洗牌：保证每个位置等概率分布，结果公平
 *   5. 复制结果：一键复制打乱结果到剪贴板
 *   6. 本地保存：勾选后通过 localStorage 自动保存名单
 *   7. 全屏展示：由共享模块 tool-stage-toolbar.js 提供（⛶ 全屏 + ⚙ 隐藏设置）
 *
 * 架构：纯前端 IIFE 模块，无后端依赖，支持 file:// 协议离线打开
 */

(function () {
  "use strict";

  /** 简易 ID 选择器 */
  const $ = (id) => document.getElementById(id);

  /** localStorage 键名 */
  const STORAGE_KEY = "random-shuffle-names";

  /** 状态：上次打乱结果数组 */
  const state = {
    lastResult: [],
    view: "string",       // string | table
    inSep: "line",        // line | comma | space | custom
    outSep: "auto",       // auto | line | comma | space | custom
  };

  /* ========== 本地存储 ==========
   * 兼容 file:// 协议下 localStorage 不可用场景，异常时降级忽略
   */
  function loadNames() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) $("names").value = raw;
    } catch (e) { /* 忽略 */ }
  }
  function saveNames() {
    if (!$("autoSave").checked) return;
    try { localStorage.setItem(STORAGE_KEY, $("names").value); }
    catch (e) { /* 忽略 */ }
  }

  /* ========== 获取分隔符实际字符 ==========
   * @param {string} mode - line/comma/space/custom
   * @param {string} customVal - 自定义模式下的字符
   * @returns {string} 分隔符字符串
   */
  function resolveSep(mode, customVal) {
    if (mode === "line")   return "\n";
    if (mode === "comma")  return ",";
    if (mode === "space")  return " ";
    return customVal || " ";
  }

  /* ========== 解析名单 ==========
   * 根据输入分隔符切分原始文本，去除空项与首尾空白
   * @returns {string[]} 名字数组
   */
  function parseNames() {
    const raw = $("names").value;
    const sep = resolveSep(state.inSep, $("inCustom").value);
    if (!raw.trim()) return [];
    return raw.split(sep).map(s => s.trim()).filter(Boolean);
  }

  /* ========== 更新计数显示 ========== */
  function refreshCount() {
    $("count").textContent = parseNames().length;
  }

  /* ========== Fisher-Yates 洗牌算法 ==========
   * 等概率打乱数组，原地修改
   * @param {Array} arr - 待打乱数组
   * @returns {Array} 已打乱的新数组（不修改原数组）
   */
  function shuffle(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  /* ========== HTML 转义 ==========
   * 防止名单内容包含 HTML 字符导致 XSS
   * @param {string} str - 待转义文本
   * @returns {string} 转义后的安全文本
   */
  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  /* ========== 渲染打乱结果 ==========
   * 根据当前视图（字符串/表格）渲染到右侧舞台
   */
  function renderResult() {
    const list = state.lastResult;
    const box = $("result");
    if (list.length === 0) {
      box.innerHTML = '<div class="tip">点击"随机打乱"按钮，结果将显示在此处</div>';
      return;
    }
    const showNum = $("showNum").checked;
    if (state.view === "table") {
      renderTableView(box, list, showNum);
    } else {
      renderStringView(box, list, showNum);
    }
  }

  /* ========== 表格视图 ==========
   * 带序号的列表，逐条动画入场
   * @param {HTMLElement} box - 渲染容器
   * @param {string[]} list - 已打乱名单
   * @param {boolean} showNum - 是否显示序号
   */
  function renderTableView(box, list, showNum) {
    const items = list.map((name, i) => `
      <li style="animation-delay:${i * 0.03}s">
        ${showNum ? `<span class="num">${i + 1}</span>` : ""}
        <span class="name">${escapeHtml(name)}</span>
      </li>`).join("");
    box.innerHTML = `<ul class="item-list">${items}</ul>`;
  }

  /* ========== 字符串视图 ==========
   * 单行文本，按输出分隔符拼接
   * @param {HTMLElement} box - 渲染容器
   * @param {string[]} list - 已打乱名单
   * @param {boolean} showNum - 是否显示序号
   */
  function renderStringView(box, list, showNum) {
    let outMode = state.outSep;
    if (outMode === "auto") outMode = state.inSep === "custom" ? "custom" : state.inSep;
    const sep = resolveSep(outMode, $("outCustom").value);
    const text = showNum
      ? list.map((n, i) => `${i + 1}. ${n}`).join(sep)
      : list.join(sep);
    box.innerHTML = `<div class="string-text">${escapeHtml(text)}</div>`;
  }

  /* ========== 执行打乱 ==========
   * 解析名单 -> 洗牌 -> 渲染 -> 自动保存
   */
  function doShuffle() {
    const names = parseNames();
    if (names.length === 0) {
      $("result").innerHTML = '<div class="tip">请先在左侧输入名单</div>';
      return;
    }
    state.lastResult = shuffle(names);
    renderResult();
    saveNames();
  }

  /* ========== 复制结果到剪贴板 ==========
   * 兼容 navigator.clipboard 与降级 execCommand
   */
  async function copyResult() {
    if (state.lastResult.length === 0) {
      alert("请先点击随机打乱");
      return;
    }
    let outMode = state.outSep;
    if (outMode === "auto") outMode = state.inSep === "custom" ? "custom" : state.inSep;
    const sep = resolveSep(outMode, $("outCustom").value);
    const showNum = $("showNum").checked;
    const text = showNum
      ? state.lastResult.map((n, i) => `${i + 1}. ${n}`).join(sep)
      : state.lastResult.join(sep);
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(text);
      } else {
        const ta = document.createElement("textarea");
        ta.value = text;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand("copy");
        document.body.removeChild(ta);
      }
      const btn = $("copyBtn");
      const old = btn.textContent;
      btn.textContent = "✓ 已复制";
      setTimeout(() => { btn.textContent = old; }, 1500);
    } catch (e) {
      alert("复制失败：" + e.message);
    }
  }

  /* ========== 切换视图（字符串/表格） ========== */
  function switchView(view) {
    state.view = view;
    document.querySelectorAll(".seg-btn").forEach(b => {
      b.classList.toggle("active", b.dataset.view === view);
    });
    renderResult();
  }

  /* ========== 加载示例名单 ========== */
  function loadExample() {
    $("names").value = "张三\n李四\n王五\n赵六\n钱七\n孙八\n周九\n吴十\n郑十一\n王十二\n刘十三\n陈十四\n杨十五";
    refreshCount();
    saveNames();
  }

  /* ========== 事件绑定 ========== */
  function bindEvents() {
    // 输入实时计数与保存
    $("names").addEventListener("input", () => { refreshCount(); saveNames(); });

    // 示例 / 清空
    $("exampleBtn").addEventListener("click", loadExample);
    $("clearBtn").addEventListener("click", () => {
      if (!confirm("确定清空名单吗？")) return;
      $("names").value = "";
      state.lastResult = [];
      refreshCount();
      renderResult();
      saveNames();
    });

    // 输入分隔符切换：显示/隐藏自定义输入框
    $("inSep").addEventListener("change", (e) => {
      state.inSep = e.target.value;
      $("inCustom").style.display = state.inSep === "custom" ? "block" : "none";
      refreshCount();
    });
    // 输出分隔符切换
    $("outSep").addEventListener("change", (e) => {
      state.outSep = e.target.value;
      $("outCustom").style.display = state.outSep === "custom" ? "block" : "none";
      renderResult();
    });

    // 视图切换
    document.querySelectorAll(".seg-btn").forEach(b => {
      b.addEventListener("click", () => switchView(b.dataset.view));
    });

    // 序号开关：实时刷新结果
    $("showNum").addEventListener("change", renderResult);

    // 主操作按钮
    $("shuffleBtn").addEventListener("click", doShuffle);
    $("copyBtn").addEventListener("click", copyResult);

    // 键盘快捷键：Enter 触发打乱
    document.addEventListener("keydown", (e) => {
      if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        doShuffle();
      }
    });
  }

  /* ========== 初始化 ========== */
  function init() {
    loadNames();
    refreshCount();
    bindEvents();
    renderResult();
    initStageToolbar();
  }

  /* ========== 舞台右上角工具栏（⛶ 全屏 / ⚙ 隐藏设置） ==========
   * 交互统一由共享模块 assets/js/tool-stage-toolbar.js 提供，本工具不再自带实现。
   * ⚠️ 必须写全 window.EduToolStageToolbar：站点适配器用
   *    new Function("document","window",code) 执行脚本，裸标识符会 ReferenceError。
   * @returns {void}
   */
  function initStageToolbar() {
    if (window.EduToolStageToolbar) {
      window.EduToolStageToolbar.init({ stage: "#stage", panelHost: ".main", hiddenClass: "setup-hidden" });
    }
  }

  // DOM 就绪后启动
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
