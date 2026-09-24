/**
 * 九九乘法表交互模块（IIFE 立即执行函数）
 * 功能描述：渲染 9×9 乘法表网格，支持布局/字号/主题切换、全屏与打印
 * 入参：无（自动从 DOM 读取元素）
 * 返回值：无
 * 异常场景：localStorage 不可用或全屏 API 不支持时静默降级
 * 兼容性：file:// 协议直接打开可运行，无外部依赖
 */
(function () {
  "use strict";

  /** 本地存储键名 */
  const STORAGE_KEY = "edu-99table-settings";

  /** 默认设置：完整表 + 标准字号 + 米黄主题 */
  const DEFAULT_SETTINGS = {
    layout: "full",    // full=完整表 / triangle=三角形（隐藏对角线以上）
    size: "m",         // s=紧凑 / m=标准 / l=大号 / xl=超大
    theme: "amber"     // amber=米黄 / sky=蓝白 / green=绿白 / dark=暗黑
  };

  /** DOM 引用 */
  const elGrid = document.getElementById("table-grid");
  const elPrintBtn = document.getElementById("print-btn");
  /** 舞台容器：工具自身配色（data-skin）挂在这里，不写站点 html/body 令牌 */
  const elStage = document.getElementById("table-area");

  /** 运行时设置（init 时由 loadSettings 填充） */
  let settings = Object.assign({}, DEFAULT_SETTINGS);

  /**
   * 从 localStorage 读取用户设置
   * 功能描述：读取并合并默认设置，失败时静默回退
   * 入参：无
   * 返回值：{Object} 合并后的设置对象，含 layout/size/theme 字段
   * 异常场景：localStorage 禁用、JSON 解析失败 → 返回 DEFAULT_SETTINGS 副本
   */
  function loadSettings() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return Object.assign({}, DEFAULT_SETTINGS);
      return Object.assign({}, DEFAULT_SETTINGS, JSON.parse(raw));
    } catch (e) {
      return Object.assign({}, DEFAULT_SETTINGS);
    }
  }

  /**
   * 保存设置到 localStorage
   * 功能描述：将当前设置序列化后持久化
   * 入参：{Object} s - 待保存的设置对象
   * 返回值：无
   * 异常场景：localStorage 禁用或配额不足 → 静默忽略
   */
  function saveSettings(s) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(s));
    } catch (e) {
      // 忽略写入失败
    }
  }

  /**
   * 渲染 9×9 乘法表网格
   * 功能描述：生成 81 个单元格，对角线（c===r）高亮，三角形模式下隐藏对角线以上（c>r）
   * 入参：{string} layout - "full" 显示全部 / "triangle" 仅显示下三角
   * 返回值：无（直接写入 elGrid.innerHTML）
   * 异常场景：无
   */
  function renderGrid(layout) {
    elGrid.dataset.layout = layout;
    const parts = [];
    for (let r = 1; r <= 9; r++) {
      for (let c = 1; c <= 9; c++) {
        const result = c * r;
        const isDiag = (c === r);
        const isHidden = (layout === "triangle" && c > r);
        const cls = ["cell"];
        if (isDiag) cls.push("diag");
        if (isHidden) cls.push("hide");
        parts.push(
          '<div class="' + cls.join(" ") + '" data-row="' + r + '" data-col="' + c + '">' +
            '<span class="eq">' + c + '×' + r + '=</span>' +
            '<span class="res">' + result + '</span>' +
          '</div>'
        );
      }
    }
    elGrid.innerHTML = parts.join("");
  }

  /**
   * 应用字号档位
   * 功能描述：通过 data-size 属性触发 CSS 字号样式
   * 入参：{string} size - "s"|"m"|"l"|"xl"
   * 返回值：无
   * 异常场景：未知值时 CSS 不匹配，维持默认样式
   */
  function applySize(size) {
    elGrid.dataset.size = size;
  }

  /**
   * 应用颜色主题
   * 功能描述：把 data-skin 写到工具自身舞台 #table-area，触发本工具 CSS 变量切换
   * 入参：{string} theme - "amber"|"sky"|"green"|"dark"
   * 返回值：无
   * 异常场景：舞台元素缺失时静默返回；未知值时无对应规则，沿用默认米黄
   * 说明：站点级配色（html data-theme / et-accent）只由顶栏 🎨 全局切换，
   *       本工具的「表格配色」属于业务配色，挂在自身容器上，不占用站点令牌空间。
   */
  function applyTheme(theme) {
    if (!elStage) return;
    elStage.dataset.skin = theme;
  }

  /**
   * 同步分段控件按钮激活态
   * 功能描述：根据当前值，为对应 .seg-btn 添加 active 类与 aria-pressed 属性
   * 入参：{string} name - 控件 data-name（layout/size/theme）
   * 入参：{string} value - 应激活的 data-value
   * 返回值：无
   * 异常场景：找不到控件时静默返回
   */
  function setSegActive(name, value) {
    const seg = document.querySelector('.seg[data-name="' + name + '"]');
    if (!seg) return;
    seg.querySelectorAll(".seg-btn").forEach(function (btn) {
      const active = btn.dataset.value === value;
      btn.classList.toggle("active", active);
      btn.setAttribute("aria-pressed", active ? "true" : "false");
    });
  }

  /**
   * 绑定分段控件点击事件
   * 功能描述：监听 .seg 容器点击，更新对应设置并刷新视图，最后持久化
   * 入参：无
   * 返回值：无
   * 异常场景：无
   */
  function bindSegControls() {
    document.querySelectorAll(".seg").forEach(function (seg) {
      const name = seg.dataset.name;
      seg.addEventListener("click", function (e) {
        const btn = e.target.closest(".seg-btn");
        if (!btn) return;
        const value = btn.dataset.value;
        settings[name] = value;
        applySetting(name, value);
        setSegActive(name, value);
        saveSettings(settings);
      });
    });
  }

  /**
   * 应用单项设置变更到视图
   * 功能描述：根据字段名分发到对应的渲染函数
   * 入参：{string} name - 字段名（layout/size/theme）
   * 入参：{string} value - 新值
   * 返回值：无
   * 异常场景：未知字段名时静默忽略
   */
  function applySetting(name, value) {
    if (name === "layout") renderGrid(value);
    else if (name === "size") applySize(value);
    else if (name === "theme") applyTheme(value);
  }

  /**
   * 全屏与「隐藏设置」
   * 说明：舞台（#table-area）右上角工具栏的 ⛶ / ⚙ 由共享模块
   *       tool-stage-toolbar.js 接管，本工具不再自行调用 Fullscreen API。
   */

  /**
   * 触发浏览器打印
   * 功能描述：调用 window.print() 唤起打印对话框（@media print 样式自动生效）
   * 入参：无
   * 返回值：无
   * 异常场景：浏览器禁用打印时无效果
   */
  function doPrint() {
    window.print();
  }

  /**
   * 模块初始化
   * 功能描述：加载设置 → 渲染视图 → 同步控件激活态 → 绑定事件
   * 入参：无
   * 返回值：无
   * 异常场景：DOM 元素缺失时部分功能不可用，但不抛错
   */
  function init() {
    // 舞台右上角工具栏：⛶ 表格区全屏 / ⚙ 隐藏上方控制条
    if (window.EduToolStageToolbar) {
      window.EduToolStageToolbar.init({ stage: "#table-area", panelHost: "#controls", hiddenClass: "setup-hidden" });
    }
    settings = loadSettings();
    renderGrid(settings.layout);
    applySize(settings.size);
    applyTheme(settings.theme);
    setSegActive("layout", settings.layout);
    setSegActive("size", settings.size);
    setSegActive("theme", settings.theme);
    bindSegControls();
    elPrintBtn.addEventListener("click", doPrint);
  }

  // 脚本位于 body 末尾，DOM 已就绪，直接初始化
  init();
})();
