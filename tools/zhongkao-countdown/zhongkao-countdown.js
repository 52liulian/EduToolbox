/**
 * 中考倒计时 · 核心逻辑
 * 功能：实时显示距离中考剩余时间、全屏沉浸展示、自定义标题/日期/标语、10 套主题切换
 * 数据持久化：localStorage（键名 ZKCD_CONFIG）
 * 运行环境：纯前端，兼容 file:// 协议，无需联网
 */
(function () {
  'use strict';

  /* ============================================================
   * 一、常量与默认配置
   * ========================================================== */

  /** 默认配置：中考日期 = 2027-06-20 09:00 AM */
  var DEFAULT_CONFIG = {
    title: '距离2027年中考还有',  // 主标题文案
    year: 2027,                    // 中考年份
    month: 6,                      // 中考月份（1-12）
    day: 20,                       // 中考日（1-31）
    hour: 9,                       // 中考时（12 小时制 1-12）
    minute: 0,                     // 中考分（0-59）
    ampm: 'AM',                    // 上午/下午
    theme: 'auto',                 // 配色主题
    slogan: '长风破浪会有时，直挂云帆济沧海'  // 励志标语
  };

  /** localStorage 键名 */
  var STORAGE_KEY = 'ZKCD_CONFIG';

  /** 主题列表（除 auto 外，其余对应 CSS 中的 theme-* 类） */
  var THEMES = ['auto', 'deepblue', 'forest', 'crimson', 'purple',
                'midnight', 'charcoal', 'ocean', 'coffee', 'slate'];

  /** 自动渐变主题每 N 秒切换一次 */
  var AUTO_INTERVAL_MS = 8000;

  /* ============================================================
   * 二、DOM 元素引用
   * ========================================================== */
  var $ = function (id) { return document.getElementById(id); };

  var el = {
    days: null, hours: null, minutes: null, seconds: null,
    titleLabel: null, slogan: null,
    settingsBtn: null, fullscreenBtn: null,
    overlay: null, closeBtn: null,
    setTitle: null, setMonth: null, setDay: null, setYear: null,
    setHour: null, setMinute: null, setAmpm: null,
    setTheme: null, setSlogan: null,
    saveBtn: null, resetBtn: null
  };

  /* ============================================================
   * 三、运行时状态
   * ========================================================== */
  /** 当前生效配置 */
  var config = null;
  /** 自动主题定时器句柄 */
  var autoThemeTimer = null;
  /** 倒计时定时器句柄 */
  var tickTimer = null;
  /** 自动主题当前索引 */
  var autoThemeIndex = 0;

  /* ============================================================
   * 四、配置读写
   * ========================================================== */

  /**
   * 从 localStorage 加载配置，缺失字段用默认值补全
   * @returns {Object} 合并后的配置对象
   */
  function loadConfig() {
    var saved = null;
    try { saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null'); }
    catch (e) { saved = null; }
    var merged = {};
    for (var k in DEFAULT_CONFIG) {
      if (DEFAULT_CONFIG.hasOwnProperty(k)) {
        merged[k] = (saved && saved[k] !== undefined && saved[k] !== null)
          ? saved[k] : DEFAULT_CONFIG[k];
      }
    }
    return merged;
  }

  /**
   * 将当前 config 写入 localStorage
   */
  function saveConfig() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(config)); }
    catch (e) { /* 容量满或隐私模式：静默忽略 */ }
  }

  /* ============================================================
   * 五、主题切换
   * ========================================================== */

  /**
   * 应用指定主题到 body 元素
   * @param {string} theme 主题名（auto 或 THEMES 列表中的一项）
   */
  function applyTheme(theme) {
    // 清除全部 theme-* 类
    for (var i = 0; i < THEMES.length; i++) {
      document.body.classList.remove('theme-' + THEMES[i]);
    }
    if (theme === 'auto') {
      // 自动渐变：立刻应用第一个非 auto 主题
      autoThemeIndex = 0;
      document.body.classList.add('theme-' + THEMES[1 + autoThemeIndex]);
      startAutoTheme();
    } else {
      stopAutoTheme();
      document.body.classList.add('theme-' + theme);
    }
  }

  /**
   * 启动自动主题轮换定时器
   */
  function startAutoTheme() {
    stopAutoTheme();
    autoThemeTimer = setInterval(function () {
      // 移除当前主题类
      document.body.classList.remove('theme-' + THEMES[1 + autoThemeIndex]);
      autoThemeIndex = (autoThemeIndex + 1) % (THEMES.length - 1);
      document.body.classList.add('theme-' + THEMES[1 + autoThemeIndex]);
    }, AUTO_INTERVAL_MS);
  }

  /**
   * 停止自动主题轮换
   */
  function stopAutoTheme() {
    if (autoThemeTimer) { clearInterval(autoThemeTimer); autoThemeTimer = null; }
  }

  /* ============================================================
   * 六、倒计时核心
   * ========================================================== */

  /**
   * 将 12 小时制 + AM/PM 转换为 24 小时制小时
   * @param {number} h 12 小时制小时（1-12）
   * @param {string} ap 'AM' 或 'PM'
   * @returns {number} 24 小时制小时（0-23）
   */
  function to24Hour(h, ap) {
    h = ((h % 12) + 12) % 12; // 规范化到 0-11
    return ap === 'PM' ? h + 12 : h;
  }

  /**
   * 根据当前 config 构造目标 Date 对象
   * @returns {Date} 中考目标时刻
   */
  function buildTargetDate() {
    var h24 = to24Hour(config.hour, config.ampm);
    return new Date(config.year, config.month - 1, config.day, h24, config.minute, 0, 0);
  }

  /**
   * 把数字补齐到 2 位字符串
   * @param {number} n 数字
   * @returns {string} 至少 2 位的字符串
   */
  function pad2(n) { return (n < 10 ? '0' : '') + n; }

  /**
   * 每秒执行一次：计算并刷新倒计时显示
   */
  function tick() {
    var now = new Date();
    var target = buildTargetDate();
    var diff = target - now;

    // 若目标已过，理论上不应发生（用户应自行切换至下一年），
    // 但仍兜底显示 0，避免负数溢出
    if (diff < 0) diff = 0;

    var d = Math.floor(diff / 86400000);
    var h = Math.floor((diff % 86400000) / 3600000);
    var m = Math.floor((diff % 3600000) / 60000);
    var s = Math.floor((diff % 60000) / 1000);

    el.days.textContent = d;
    el.hours.textContent = pad2(h);
    el.minutes.textContent = pad2(m);
    el.seconds.textContent = pad2(s);

    // 同步浏览器标签页标题
    document.title = '距中考 ' + d + ' 天 ' + pad2(h) + ':' + pad2(m) + ':' + pad2(s)
      + ' | EduToolbox';
  }

  /* ============================================================
   * 七、设置面板
   * ========================================================== */

  /**
   * 把当前 config 灌入设置面板表单
   */
  function fillSettingsForm() {
    el.setTitle.value = config.title;
    el.setYear.value = config.year;
    el.setMonth.value = config.month;
    el.setDay.value = config.day;
    el.setHour.value = config.hour;
    el.setMinute.value = config.minute;
    el.setAmpm.value = config.ampm;
    el.setTheme.value = config.theme;
    el.setSlogan.value = config.slogan;
  }

  /**
   * 从设置面板表单读取并校验用户输入
   * @returns {Object|null} 校验通过的新配置；失败返回 null
   */
  function readSettingsForm() {
    var year   = parseInt(el.setYear.value, 10);
    var month  = parseInt(el.setMonth.value, 10);
    var day    = parseInt(el.setDay.value, 10);
    var hour   = parseInt(el.setHour.value, 10);
    var minute = parseInt(el.setMinute.value, 10);

    // 范围校验
    if (isNaN(year) || year < 2000 || year > 2099) { alert('年份请填写 2000-2099'); return null; }
    if (isNaN(month) || month < 1 || month > 12) { alert('月份请填写 1-12'); return null; }
    if (isNaN(day) || day < 1 || day > 31) { alert('日期请填写 1-31'); return null; }
    if (isNaN(hour) || hour < 1 || hour > 12) { alert('小时请填写 1-12'); return null; }
    if (isNaN(minute) || minute < 0 || minute > 59) { alert('分钟请填写 0-59'); return null; }

    // 验证日期是否真实存在（例如 2 月 30 日会被 Date 滚动）
    var h24 = to24Hour(hour, el.setAmpm.value);
    var probe = new Date(year, month - 1, day, h24, minute, 0, 0);
    if (probe.getFullYear() !== year || probe.getMonth() !== month - 1 || probe.getDate() !== day) {
      alert('该日期不存在，请检查');
      return null;
    }

    return {
      title: (el.setTitle.value || '').trim() || DEFAULT_CONFIG.title,
      year: year, month: month, day: day,
      hour: hour, minute: minute, ampm: el.setAmpm.value,
      theme: el.setTheme.value,
      slogan: (el.setSlogan.value || '').trim() || DEFAULT_CONFIG.slogan
    };
  }

  /** 打开设置面板 */
  function openSettings() {
    fillSettingsForm();
    el.overlay.classList.add('show');
  }

  /** 关闭设置面板 */
  function closeSettings() { el.overlay.classList.remove('show'); }

  /**
   * 保存设置：校验通过后写入 config、刷新视图、持久化、关闭面板
   */
  function handleSave() {
    var next = readSettingsForm();
    if (!next) return;
    config = next;
    saveConfig();
    applyTheme(config.theme);
    el.titleLabel.textContent = config.title;
    el.slogan.textContent = config.slogan;
    tick();
    closeSettings();
  }

  /**
   * 恢复默认：清空 localStorage、重置 config、刷新视图
   */
  function handleReset() {
    if (!confirm('确定恢复全部默认设置？自定义内容将丢失。')) return;
    try { localStorage.removeItem(STORAGE_KEY); } catch (e) {}
    config = JSON.parse(JSON.stringify(DEFAULT_CONFIG));
    fillSettingsForm();
    applyTheme(config.theme);
    el.titleLabel.textContent = config.title;
    el.slogan.textContent = config.slogan;
    tick();
  }

  /* ============================================================
   * 八、全屏模式
   * ========================================================== */

  /**
   * 切换全屏沉浸模式，全屏后自动隐藏顶栏与工具栏
   */
  function toggleFullscreen() {
    var doc = document;
    var docEl = doc.documentElement;
    if (!doc.fullscreenElement && !doc.webkitFullscreenElement) {
      var req = docEl.requestFullscreen || docEl.webkitRequestFullscreen;
      if (req) req.call(docEl);
    } else {
      var exit = doc.exitFullscreen || doc.webkitExitFullscreen;
      if (exit) exit.call(doc);
    }
  }

  /**
   * 全屏状态变化回调：给 body 加 is-fullscreen 类驱动样式
   */
  function onFullscreenChange() {
    var fs = document.fullscreenElement || document.webkitFullscreenElement;
    document.body.classList.toggle('is-fullscreen', !!fs);
  }

  /* ============================================================
   * 九、事件绑定与初始化
   * ========================================================== */

  /**
   * 缓存所有需要操作的 DOM 元素到 el 对象
   */
  function cacheDom() {
    el.days = $('days');
    el.hours = $('hours');
    el.minutes = $('minutes');
    el.seconds = $('seconds');
    el.titleLabel = $('title-label');
    el.slogan = $('slogan');
    el.settingsBtn = $('settings-btn');
    el.fullscreenBtn = $('fullscreen-btn');
    el.overlay = $('settings-overlay');
    el.closeBtn = $('close-settings');
    el.setTitle = $('set-title');
    el.setMonth = $('set-month');
    el.setDay = $('set-day');
    el.setYear = $('set-year');
    el.setHour = $('set-hour');
    el.setMinute = $('set-minute');
    el.setAmpm = $('set-ampm');
    el.setTheme = $('set-theme');
    el.setSlogan = $('set-slogan');
    el.saveBtn = $('save-settings');
    el.resetBtn = $('reset-settings');
  }

  /**
   * 绑定所有交互事件
   */
  function bindEvents() {
    el.settingsBtn.addEventListener('click', openSettings);
    el.closeBtn.addEventListener('click', closeSettings);
    // 点击遮罩空白区域关闭面板
    el.overlay.addEventListener('click', function (e) {
      if (e.target === el.overlay) closeSettings();
    });
    // ESC 关闭面板
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && el.overlay.classList.contains('show')) closeSettings();
    });
    el.saveBtn.addEventListener('click', handleSave);
    el.resetBtn.addEventListener('click', handleReset);
    el.fullscreenBtn.addEventListener('click', toggleFullscreen);

    document.addEventListener('fullscreenchange', onFullscreenChange);
    document.addEventListener('webkitfullscreenchange', onFullscreenChange);
  }

  /**
   * 初始化入口：加载配置 → 应用主题与文案 → 启动倒计时
   */
  function init() {
    cacheDom();
    config = loadConfig();

    // 应用主题
    applyTheme(config.theme);
    // 应用文案
    el.titleLabel.textContent = config.title;
    el.slogan.textContent = config.slogan;

    bindEvents();
    tick();
    tickTimer = setInterval(tick, 1000);
  }

  // DOM 就绪后启动
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
