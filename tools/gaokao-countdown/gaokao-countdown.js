/**
 * 高考倒计时核心脚本 (gaokao-countdown.js)
 * IIFE 模块 · 纯原生 JS · 无外部依赖 · file:// 兼容
 *
 * 功能职责：
 * 1. 自动计算距离最近高考（每年 6 月 7 日 09:00）的剩余时间
 * 2. 实时刷新 天 / 时 / 分 / 秒 显示
 * 3. 支持切换 2026 / 2027 高考，或自动选择最近高考
 * 4. 全屏展示（Fullscreen API，兼容多浏览器前缀）
 * 5. 自定义标题、寄语、主题（localStorage 持久化）
 * 6. 动态更新浏览器标签页标题
 */
(function () {
  "use strict";

  /* ============ 常量定义 ============ */

  /** 高考固定日期配置：6 月 7 日 09:00 开考 */
  var GAOKAO_MONTH = 5;   // JS 月份从 0 开始，6 月 = 5
  var GAOKAO_DAY = 7;
  var GAOKAO_HOUR = 9;
  var GAOKAO_MINUTE = 0;
  var GAOKAO_SECOND = 0;

  /** localStorage 存储键 */
  var STORAGE_KEY = "gaokao_countdown_settings_v1";

  /** 默认配置：未保存时使用 */
  var DEFAULT_SETTINGS = {
    yearMode: "auto",          // auto | 2026 | 2027
    customTitle: "",           // 留空则使用自动标题
    slogan: "乾坤未定，你我皆是黑马",
    theme: "auto"              // auto | gold | crimson | royal | midnight
  };

  /* ============ DOM 元素引用 ============ */

  /**
   * 通过 id 获取元素快捷方法
   * @param {string} id - 元素 id
   * @returns {HTMLElement|null}
   */
  function byId(id) {
    return document.getElementById(id);
  }

  var elTitle = byId("countdownTitle");
  var elDays = byId("days");
  var elHours = byId("hours");
  var elMinutes = byId("minutes");
  var elSeconds = byId("seconds");
  var elSlogan = byId("slogan");
  var elTargetDate = byId("targetDate");
  /* 舞台元素：沉浸式背景 / 内边距 / 业务配色 data-skin 都挂在它身上。
     ⚠️ 不能写 body：站点适配器下「外层文档对影子宿主的普通声明」会压过 :host，
        挂载态一律失效（2026-09-22 实测）。 */
  var elStage = document.querySelector("main.stage");
  var elBtnFullscreen = byId("fullscreenBtn");
  var elBtnSettings = byId("hideSetupBtn");
  var elBtnClose = byId("btnCloseSettings");
  var elSettingsPanel = byId("settingsPanel");
  var elSettingsMask = byId("settingsMask");
  var elInputTitle = byId("inputTitle");
  var elInputSlogan = byId("inputSlogan");
  var elBtnReset = byId("btnReset");
  var elBtnSave = byId("btnSave");
  var elYearButtons = document.querySelectorAll(".year-btn");
  var elThemeButtons = document.querySelectorAll(".theme-btn");

  /* ============ 设置存取 ============ */

  /**
   * 从 localStorage 读取设置；读取失败或为空时回退默认值
   * @returns {object} 设置对象
   */
  function loadSettings() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return Object.assign({}, DEFAULT_SETTINGS);
      var parsed = JSON.parse(raw);
      return Object.assign({}, DEFAULT_SETTINGS, parsed);
    } catch (err) {
      return Object.assign({}, DEFAULT_SETTINGS);
    }
  }

  /**
   * 将设置写入 localStorage
   * @param {object} settings - 设置对象
   */
  function saveSettings(settings) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    } catch (err) {
      // 隐私模式下 localStorage 可能不可用，静默忽略
    }
  }

  /* ============ 时间计算 ============ */

  /**
   * 根据年份模式计算目标高考 Date 对象
   * - auto：若今年高考已过则取明年，否则取今年
   * - 2026 / 2027：固定年份
   * @param {string} yearMode - 年份模式
   * @returns {Date} 目标高考时间
   */
  function getTargetDate(yearMode) {
    var now = new Date();
    var year = now.getFullYear();

    if (yearMode === "2026") {
      year = 2026;
    } else if (yearMode === "2027") {
      year = 2027;
    }

    var target = new Date(
      year,
      GAOKAO_MONTH,
      GAOKAO_DAY,
      GAOKAO_HOUR,
      GAOKAO_MINUTE,
      GAOKAO_SECOND,
      0
    );

    // 自动模式：若已过今年高考，则顺延至下一年
    if (yearMode === "auto" && now > target) {
      target = new Date(
        year + 1,
        GAOKAO_MONTH,
        GAOKAO_DAY,
        GAOKAO_HOUR,
        GAOKAO_MINUTE,
        GAOKAO_SECOND,
        0
      );
    }

    return target;
  }

  /**
   * 数字补零至两位
   * @param {number} n - 原始数字
   * @returns {string} 两位字符串
   */
  function pad2(n) {
    return String(n).padStart(2, "0");
  }

  /**
   * 数字补零至三位（用于天数显示）
   * @param {number} n - 原始数字
   * @returns {string} 三位字符串
   */
  function pad3(n) {
    return String(n).padStart(3, "0");
  }

  /* ============ 渲染逻辑 ============ */

  /** 当前生效的设置（模块内共享） */
  var currentSettings = loadSettings();

  /** 当前目标日期缓存（每秒刷新时复用） */
  var currentTarget = null;

  /**
   * 根据设置应用业务配色：在 main.stage 上设置 data-skin 属性
   *
   * ⚠️ 旧版写在 document.documentElement 的 data-theme 上有两个硬伤：
   *   ① 工具 CSS 里的 `html[data-theme="x"] body` 被适配器重基成
   *      `:host[data-theme="x"] :host`，复合选择器里出现第二个 :host，永不匹配
   *      → 挂载态切换 100% 失效；
   *   ② data-theme 是站点全局六色配色的令牌空间，顶栏配色会静默覆盖倒计时
   *      的业务配色，倒计时也会往宿主泄漏 crimson/royal/midnight 脏值。
   * 改到 main.stage[data-skin] 之后，独立页与挂载态命中的是同一个真实元素，
   * 两种模式都生效，且与全局配色彻底解耦。
   * @param {string} theme - 业务配色名（auto | gold | crimson | royal | midnight）
   * @returns {void}
   */
  function applyTheme(theme) {
    if (!elStage) return;
    if (theme === "auto") {
      elStage.removeAttribute("data-skin");
    } else {
      elStage.setAttribute("data-skin", theme);
    }
  }

  /**
   * 渲染标题文字：优先使用自定义标题，否则自动生成
   * @param {Date} target - 目标日期
   */
  function renderTitle(target) {
    if (currentSettings.customTitle && currentSettings.customTitle.trim()) {
      elTitle.textContent = currentSettings.customTitle.trim();
    } else {
      elTitle.textContent = "距离 " + target.getFullYear() + " 年高考还有";
    }
  }

  /**
   * 渲染目标日期副标题
   * @param {Date} target - 目标日期
   */
  function renderTargetDate(target) {
    var monthStr = pad2(GAOKAO_DAY);   // 仅展示日期，但与文案对齐
    var dateStr = target.getFullYear() + " 年 " +
                  (GAOKAO_MONTH + 1) + " 月 " +
                  GAOKAO_DAY + " 日 " +
                  pad2(GAOKAO_HOUR) + ":" + pad2(GAOKAO_MINUTE);
    elTargetDate.textContent = "目标日期：" + dateStr;
  }

  /**
   * 每秒执行：计算并刷新倒计时数字
   */
  function tick() {
    if (!currentTarget) return;
    var now = new Date();
    var diff = currentTarget - now;

    if (diff < 0) {
      // 已到达目标：显示零值，并尝试自动切换至下一年
      elDays.textContent = "000";
      elHours.textContent = "00";
      elMinutes.textContent = "00";
      elSeconds.textContent = "00";
      elTitle.textContent = "高考已开考，加油！";
      // 静默重新计算下一目标
      currentTarget = getTargetDate(currentSettings.yearMode);
      renderTitle(currentTarget);
      renderTargetDate(currentTarget);
      return;
    }

    var days  = Math.floor(diff / 86400000);
    var hours = Math.floor((diff % 86400000) / 3600000);
    var mins  = Math.floor((diff % 3600000) / 60000);
    var secs  = Math.floor((diff % 60000) / 1000);

    elDays.textContent = pad3(days);
    elHours.textContent = pad2(hours);
    elMinutes.textContent = pad2(mins);
    elSeconds.textContent = pad2(secs);

    // 同步浏览器标签页标题
    document.title = "距高考 " + days + " 天 " +
                     pad2(hours) + "时 " + pad2(mins) + "分";
  }

  /**
   * 整体重新初始化渲染：目标日期 / 标题 / 寄语 / 主题
   */
  function renderAll() {
    currentTarget = getTargetDate(currentSettings.yearMode);
    renderTitle(currentTarget);
    renderTargetDate(currentTarget);
    elSlogan.textContent = currentSettings.slogan || DEFAULT_SETTINGS.slogan;
    applyTheme(currentSettings.theme);
    tick();
  }

  /* ============ 全屏状态（切换动作由共享模块 EduToolStageToolbar 接管） ============ */

  /**
   * 当前是否处于全屏状态（兼容 webkit 前缀）
   * @returns {boolean} 是否已全屏
   */
  function isFullscreen() {
    return !!(document.fullscreenElement || document.webkitFullscreenElement);
  }

  /**
   * 退出全屏（供 ⚙ 按钮在「全屏中打开设置」前先退出；失败静默忽略）
   * @returns {void}
   */
  function exitFullscreenQuietly() {
    var exit = document.exitFullscreen || document.webkitExitFullscreen;
    if (!exit) return;
    try {
      var p = exit.call(document);
      if (p && typeof p.catch === "function") p.catch(function () { /* 静默 */ });
    } catch (err) {
      // 非用户手势等场景会抛错，忽略即可
    }
  }

  /* ============ 设置面板交互 ============ */

  /**
   * 打开设置面板：同步当前值到表单
   */
  function openSettings() {
    elInputTitle.value = currentSettings.customTitle || "";
    elInputSlogan.value = currentSettings.slogan || "";

    // 高亮当前年份按钮
    elYearButtons.forEach(function (btn) {
      btn.classList.remove("active");
      if (btn.id === "yearAuto" && currentSettings.yearMode === "auto") {
        btn.classList.add("active");
      } else if (btn.id === "year2026" && currentSettings.yearMode === "2026") {
        btn.classList.add("active");
      } else if (btn.id === "year2027" && currentSettings.yearMode === "2027") {
        btn.classList.add("active");
      }
    });

    // 高亮当前配色按钮
    elThemeButtons.forEach(function (btn) {
      var t = btn.getAttribute("data-skin");
      if (t === currentSettings.theme) {
        btn.classList.add("active");
      } else {
        btn.classList.remove("active");
      }
    });

    elSettingsPanel.hidden = false;
    elSettingsMask.hidden = false;
  }

  /**
   * 关闭设置面板
   */
  function closeSettings() {
    elSettingsPanel.hidden = true;
    elSettingsMask.hidden = true;
  }

  /**
   * ⚙ 按钮：打开 / 关闭设置抽屉
   * 全屏时舞台之外的内容不会被渲染，因此先退出全屏再打开，避免「点了没反应」。
   * @returns {void}
   */
  function toggleSettings() {
    if (isFullscreen()) exitFullscreenQuietly();
    if (elSettingsPanel.hidden) openSettings();
    else closeSettings();
  }

  /**
   * 读取表单当前值并组装为设置对象
   * @returns {object} 新设置
   */
  function readFormSettings() {
    var yearMode = currentSettings.yearMode;
    elYearButtons.forEach(function (btn) {
      if (btn.classList.contains("active")) {
        if (btn.id === "yearAuto") yearMode = "auto";
        else if (btn.id === "year2026") yearMode = "2026";
        else if (btn.id === "year2027") yearMode = "2027";
      }
    });

    var theme = currentSettings.theme;
    elThemeButtons.forEach(function (btn) {
      if (btn.classList.contains("active")) {
        theme = btn.getAttribute("data-skin");
      }
    });

    return {
      yearMode: yearMode,
      customTitle: elInputTitle.value.trim(),
      slogan: elInputSlogan.value.trim() || DEFAULT_SETTINGS.slogan,
      theme: theme
    };
  }

  /**
   * 保存并立即生效
   */
  function handleSave() {
    currentSettings = readFormSettings();
    saveSettings(currentSettings);
    renderAll();
    closeSettings();
  }

  /**
   * 恢复默认设置
   */
  function handleReset() {
    currentSettings = Object.assign({}, DEFAULT_SETTINGS);
    saveSettings(currentSettings);
    elInputTitle.value = "";
    elInputSlogan.value = DEFAULT_SETTINGS.slogan;
    elYearButtons.forEach(function (b) {
      b.classList.remove("active");
      if (b.id === "yearAuto") b.classList.add("active");
    });
    elThemeButtons.forEach(function (b) {
      b.classList.remove("active");
      if (b.getAttribute("data-skin") === "auto") b.classList.add("active");
    });
    renderAll();
  }

  /* ============ 事件绑定 ============ */

  /**
   * 绑定年份切换按钮：单选效果（点击高亮，其余移除）
   */
  function bindYearSwitch() {
    elYearButtons.forEach(function (btn) {
      btn.addEventListener("click", function () {
        elYearButtons.forEach(function (b) {
          b.classList.remove("active");
        });
        btn.classList.add("active");
      });
    });
  }

  /**
   * 绑定主题切换按钮：单选效果
   */
  function bindThemeSwitch() {
    elThemeButtons.forEach(function (btn) {
      btn.addEventListener("click", function () {
        elThemeButtons.forEach(function (b) {
          b.classList.remove("active");
        });
        btn.classList.add("active");
        // 业务配色实时预览（写入 main.stage 的 data-skin）
        applyTheme(btn.getAttribute("data-skin"));
      });
    });
  }

  /**
   * 集中绑定所有事件
   */
  function bindEvents() {
    // ⛶ 全屏由共享模块接管；这里只补一条「进入全屏时收起设置抽屉」
    if (elBtnFullscreen) {
      elBtnFullscreen.addEventListener("click", closeSettings);
    }
    // ⚙ 打开 / 关闭设置抽屉
    if (elBtnSettings) {
      elBtnSettings.addEventListener("click", toggleSettings);
    }
    elBtnClose.addEventListener("click", closeSettings);
    elSettingsMask.addEventListener("click", closeSettings);
    elBtnSave.addEventListener("click", handleSave);
    elBtnReset.addEventListener("click", handleReset);
    bindYearSwitch();
    bindThemeSwitch();

    // Esc 键关闭设置面板
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && !elSettingsPanel.hidden) {
        closeSettings();
      }
    });
  }

  /* ============ 启动 ============ */

  /**
   * 模块入口：渲染、绑定事件、启动每秒定时器
   */
  function init() {
    bindEvents();
    renderAll();

    /* 舞台右上角工具栏：全屏目标是舞台 main.stage 自身；本工具没有可隐藏的
       设置栏（设置是右侧浮层抽屉），故 panelHost 传 null，只接全屏不做显隐。
       ⚠️ 必须写 window. 前缀：站点适配器用 new Function("document","window",code)
       执行脚本，裸写 EduToolStageToolbar 在部分路径下会抛 ReferenceError，
       把整个初始化带崩。 */
    if (window.EduToolStageToolbar) {
      window.EduToolStageToolbar.init({
        stage: "main.stage",
        panelHost: null,
        hiddenClass: "setup-hidden"
      });
    }

    setInterval(tick, 1000);
  }

  // DOM 就绪后启动（脚本位于 body 末尾，DOM 已解析完成）
  init();
})();
