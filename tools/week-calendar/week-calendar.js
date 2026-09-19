/**
 * 学期日历模块（EduToolbox · 教学周周日历）
 * 功能：设置开学日期后自动计算当前教学周次，高亮今日与本周，
 *      展示学期进度条与完整周历表格，支持全屏模式、localStorage 持久化与 URL 参数分享。
 * 结构：IIFE 单文件模块，纯前端实现，兼容 file:// 协议。
 */
(function () {
  "use strict";

  /** 通过 id 获取 DOM 元素
   * @param {string} id - 元素 id
   * @returns {HTMLElement} 对应 DOM 元素
   */
  function $(id) { return document.getElementById(id); }

  /** localStorage 键名 */
  var STORAGE_KEY_START = "semesterStart";
  var STORAGE_KEY_WEEKS = "semesterWeeks";

  /** 星期名称（索引 0 = 周日） */
  var WEEK_NAMES = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];

  /** 月份名称（索引 0 = 1月） */
  var MONTH_NAMES = ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"];

  /** 模块状态：开学日期（YYYY-MM-DD 字符串）与总周数 */
  var state = { startDate: "", weeks: 20 };

  /**
   * 获取指定日期所在周的周一（0:00）
   * @param {Date} date - 任意日期
   * @returns {Date} 该日期所在周的周一
   */
  function getMonday(date) {
    var d = new Date(date);
    d.setHours(0, 0, 0, 0);
    var day = d.getDay() || 7; // 周日 getDay() 返回 0，转换为 7 以统一计算
    d.setDate(d.getDate() - (day - 1));
    return d;
  }

  /**
   * 将 Date 格式化为 YYYY-MM-DD（input[type=date] 所需值）
   * @param {Date} d - 日期对象
   * @returns {string} YYYY-MM-DD 字符串
   */
  function toISO(d) {
    var y = d.getFullYear();
    var m = String(d.getMonth() + 1).padStart(2, "0");
    var day = String(d.getDate()).padStart(2, "0");
    return y + "-" + m + "-" + day;
  }

  /**
   * 将 YYYY-MM-DD 字符串解析为本地 Date（0:00）
   * @param {string} str - YYYY-MM-DD 字符串
   * @returns {Date|null} 解析失败返回 null
   */
  function parseDate(str) {
    if (!str) return null;
    var parts = str.split("-");
    if (parts.length !== 3) return null;
    var d = new Date(+parts[0], +parts[1] - 1, +parts[2]);
    return isNaN(d.getTime()) ? null : d;
  }

  /**
   * 计算两个日期相差的整天数（a - b，向下取整）
   * @param {Date} a - 被减数
   * @param {Date} b - 减数
   * @returns {number} 相差天数
   */
  function diffDays(a, b) {
    return Math.floor((a - b) / 86400000);
  }

  /**
   * 从 localStorage 读取保存的开学日期与总周数
   * 异常场景：隐私模式或存储被禁用时抛错，已被 try/catch 忽略
   */
  function loadFromStorage() {
    try {
      var s = localStorage.getItem(STORAGE_KEY_START);
      var w = parseInt(localStorage.getItem(STORAGE_KEY_WEEKS), 10);
      if (s && parseDate(s)) state.startDate = s;
      if (w >= 10 && w <= 30) state.weeks = w;
    } catch (e) { /* localStorage 不可用时静默忽略 */ }
  }

  /**
   * 从 URL 查询参数读取设置（优先级高于 localStorage）
   * 参数格式：?start=YYYY-MM-DD&weeks=N
   * 异常场景：file:// 协议下 location.search 通常为空，自动跳过
   */
  function loadFromURL() {
    var search = location.search.replace(/^\?/, "");
    if (!search) return;
    var params = {};
    search.split("&").forEach(function (kv) {
      var p = kv.split("=");
      if (p.length === 2) params[decodeURIComponent(p[0])] = decodeURIComponent(p[1]);
    });
    if (params.start && parseDate(params.start)) state.startDate = params.start;
    var w = parseInt(params.weeks, 10);
    if (w >= 10 && w <= 30) state.weeks = w;
  }

  /**
   * 将当前设置同步写入 localStorage 与 URL 参数
   * 异常场景：隐私模式或 file:// 下 replaceState 可能失败，已被 try/catch 忽略
   */
  function persist() {
    try {
      localStorage.setItem(STORAGE_KEY_START, state.startDate);
      localStorage.setItem(STORAGE_KEY_WEEKS, String(state.weeks));
    } catch (e) { /* 忽略 */ }
    try {
      var url = location.pathname + "?start=" + state.startDate + "&weeks=" + state.weeks;
      history.replaceState(null, "", url);
    } catch (e) { /* file:// 下可能不支持，忽略 */ }
  }

  /**
   * 初始化总周数下拉选项（10-30 周）
   * 并根据当前状态选中对应选项
   */
  function initWeeksSelect() {
    var sel = $("weeks");
    var html = "";
    for (var i = 10; i <= 30; i++) {
      html += '<option value="' + i + '"' + (i === state.weeks ? " selected" : "") + ">" + i + "周</option>";
    }
    sel.innerHTML = html;
  }

  /**
   * 渲染大屏信息展示区
   * 计算并显示：当前教学周次 + 本周起止日期、今日日期与星期、学期进度百分比
   */
  function renderDisplay() {
    var today = new Date();
    today.setHours(0, 0, 0, 0);
    var start = parseDate(state.startDate);
    var weekLabel = "未设置";
    var weekRange = "";
    var percent = 0;

    if (start) {
      var monday1 = getMonday(start);
      var totalDays = state.weeks * 7;
      var passed = diffDays(today, monday1);
      var curWeek = -1;

      if (passed < 0) {
        weekLabel = "未开学";
      } else {
        curWeek = Math.floor(passed / 7) + 1;
        if (curWeek > state.weeks) {
          weekLabel = "已结束";
        } else {
          weekLabel = "第 " + curWeek + " 周";
          // 计算当前周的周一到周日日期范围
          var ws = new Date(monday1);
          ws.setDate(monday1.getDate() + (curWeek - 1) * 7);
          var we = new Date(ws);
          we.setDate(ws.getDate() + 6);
          weekRange = (ws.getMonth() + 1) + "." + ws.getDate() + " - " + (we.getMonth() + 1) + "." + we.getDate();
        }
      }

      // 学期进度百分比：已过天数 / 总天数
      if (passed < 0) percent = 0;
      else if (passed > totalDays) percent = 100;
      else percent = Math.round((passed / totalDays) * 100);
    }

    $("currentWeek").textContent = weekLabel;
    $("currentWeekRange").textContent = weekRange;
    $("todayDate").textContent = (today.getMonth() + 1) + "月" + today.getDate() + "日";
    $("todayWeekday").textContent = WEEK_NAMES[today.getDay()];
    $("progressPercent").textContent = percent + "%";
    $("progressFill").style.width = percent + "%";
    $("progressEnd").textContent = "第" + state.weeks + "周";
  }

  /**
   * 渲染学期日历表格
   * 逐周生成行：周次 + 起止日期 + 7 个日期格子
   * 当前周整行高亮，今日格子添加红色"今天"徽标，过去日期灰色显示
   */
  function renderCalendar() {
    var body = $("calendarBody");
    var start = parseDate(state.startDate);
    if (!start) {
      body.innerHTML = '<tr><td colspan="8"><div class="state state--compact state--empty" style="margin:8px auto"><div class="state-icon">📅</div><div class="state-title">请先在上方设置开学日期</div></div></td></tr>';
      return;
    }
    var today = new Date();
    today.setHours(0, 0, 0, 0);
    var monday1 = getMonday(start);
    var passed = diffDays(today, monday1);
    var curWeek = passed < 0 ? -1 : Math.floor(passed / 7) + 1;

    var html = "";
    for (var i = 0; i < state.weeks; i++) {
      var ws = new Date(monday1);
      ws.setDate(monday1.getDate() + i * 7);
      var we = new Date(ws);
      we.setDate(ws.getDate() + 6);
      var isCur = (i + 1 === curWeek);

      html += '<tr class="' + (isCur ? "current-week" : "") + '">';
      html += '<td class="week-cell">第 ' + (i + 1) + ' 周';
      html += '<span class="week-range">' + (ws.getMonth() + 1) + "." + ws.getDate() + " - " + (we.getMonth() + 1) + "." + we.getDate() + "</span></td>";

      for (var j = 0; j < 7; j++) {
        var d = new Date(ws);
        d.setDate(ws.getDate() + j);
        var diff = diffDays(d, today);
        var cls = "day-cell";
        if (diff < 0) cls += " past";
        if (diff === 0) cls += " today";
        html += '<td><div class="' + cls + '">';
        html += '<span class="day-num">' + d.getDate() + "</span>";
        html += '<span class="day-month">' + MONTH_NAMES[d.getMonth()] + "</span>";
        if (diff === 0) html += '<span class="today-badge">今天</span>';
        html += "</div></td>";
      }
      html += "</tr>";
    }
    body.innerHTML = html;
  }

  /**
   * 渲染全部视图
   * 同步输入控件值，刷新信息区与日历表，并持久化设置
   */
  function render() {
    $("startDate").value = state.startDate;
    $("weeks").value = String(state.weeks);
    renderDisplay();
    renderCalendar();
    persist();
  }

  /**
   * 切换全屏显示（兼容 Webkit 前缀）
   * 异常场景：浏览器不支持 Fullscreen API 时静默忽略
   */
  function toggleFullscreen() {
    var el = document.documentElement;
    var isFs = document.fullscreenElement || document.webkitFullscreenElement;
    try {
      if (!isFs) {
        if (el.requestFullscreen) el.requestFullscreen();
        else if (el.webkitRequestFullscreen) el.webkitRequestFullscreen();
      } else {
        if (document.exitFullscreen) document.exitFullscreen();
        else if (document.webkitExitFullscreen) document.webkitExitFullscreen();
      }
    } catch (e) { /* 忽略 */ }
  }

  /**
   * 模块初始化
   * 加载设置 -> 填充下拉 -> 首次渲染 -> 绑定事件
   */
  function init() {
    loadFromStorage();
    loadFromURL();
    // 默认值：未设置开学日期时取本年 9 月 1 日
    if (!state.startDate) {
      var now = new Date();
      state.startDate = toISO(new Date(now.getFullYear(), 8, 1));
    }
    initWeeksSelect();
    render();

    // 开学日期变更
    $("startDate").addEventListener("change", function () {
      state.startDate = this.value;
      render();
    });

    // 总周数变更
    $("weeks").addEventListener("change", function () {
      state.weeks = parseInt(this.value, 10) || 20;
      render();
    });

    // 预设按钮：一键应用 2026 春季 / 秋季开学日期
    var presets = document.querySelectorAll(".preset-btn");
    Array.prototype.forEach.call(presets, function (btn) {
      btn.addEventListener("click", function () {
        state.startDate = btn.getAttribute("data-start");
        render();
      });
    });

    // 全屏按钮
    $("fullscreenBtn").addEventListener("click", toggleFullscreen);
  }

  // DOM 就绪后启动（兼容 file:// 直接打开场景）
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
