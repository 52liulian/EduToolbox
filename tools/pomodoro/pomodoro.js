/**
 * 番茄钟 · 专注力训练（Pomodoro Timer）
 * ----------------------------------------------------------------
 * 功能清单：
 *   1. 三种模式切换：专注（默认 25 分钟）/ 短休息（5 分钟）/ 长休息（15 分钟）
 *   2. 大字倒计时 mm:ss 显示，时间戳精准计时，不受 setInterval 抖动影响
 *   3. SVG 圆形进度环（dasharray/dashoffset 驱动，颜色随模式切换）
 *   4. 开始 / 暂停 / 重置 / 跳过 控制按钮
 *   5. 完成 4 个番茄后自动进入长休（数量可在设置中自定义 2~12）
 *   6. 番茄完成统计：今日 / 累计 / 累计专注分钟
 *   7. 阶段切换提示音（Web Audio API 合成“滴滴”声，无外部音频文件）
 *   8. 全屏模式（Fullscreen API，支持 Esc 退出）
 *   9. localStorage 持久化设置（各模式时长 / 长休触发 / 自动开始 / 音效开关）与统计
 *  10. 键盘快捷键：空格 开始/暂停、R 重置、S 跳过、F 全屏、Esc 退出全屏/关闭弹层
 *
 * 兼容性：纯前端 IIFE，无 fetch / Worker / import，可双击 file:// 直接打开
 */
(function () {
  "use strict";

  /** 持久化键：设置 */
  var STORAGE_KEY = "pomodoro:settings:v1";
  /** 持久化键：统计 */
  var STATS_KEY = "pomodoro:stats:v1";

  /** 模式枚举：专注 / 短休 / 长休 */
  var MODE = { focus: "focus", short: "short", long: "long" };

  /** 模式 -> 中文显示文本 */
  var MODE_LABEL = {
    focus: "专注中",
    short: "短休息",
    long:  "长休息"
  };

  /** 默认设置（首次访问或本地数据损坏时回退） */
  var DEFAULTS = {
    focusMin: 25,
    shortMin: 5,
    longMin:  15,
    rounds:   4,    // 每完成多少个番茄触发长休
    autoStart: true,
    sound:    true
  };

  /** 圆形进度环周长（半径 r=140 → 2πr ≈ 879.646） */
  var RING_CIRCUM = 2 * Math.PI * 140;

  /**
   * 按 id 获取 DOM 元素
   * @param  {string} id - 元素 id 属性
   * @return {HTMLElement|null} 找到的元素，无匹配返回 null
   */
  function $(id) { return document.getElementById(id); }

  // —— DOM 引用 ——
  var stage       = $("timerStage");
  var modeTabs    = $("modeTabs");
  var ringFg      = $("ringFg");
  var timeText    = $("timeText");
  var phaseText   = $("phaseText");
  var pomoDots    = $("pomoDots");
  var btnStart    = $("btnStart");
  var btnReset    = $("btnReset");
  var btnSkip     = $("btnSkip");
  var btnFullscreen = $("fullscreenBtn");   // ⛶ 全屏：由共享模块 tool-stage-toolbar.js 接管
  var btnHideSetup  = $("hideSetupBtn");    // ⚙ 本工具复用为「打开设置弹层」
  var btnCloseSettings = $("btnCloseSettings");
  var btnCancelSettings = $("btnCancelSettings");
  var btnSaveSettings  = $("btnSaveSettings");
  var btnTestSound = $("btnTestSound");
  var btnClearStats = $("btnClearStats");
  var settingsModal = $("settingsModal");
  var fsHint = $("fsHint");
  var statToday  = $("statToday");
  var statTotal = $("statTotal");
  var statFocusMin = $("statFocusMin");

  // —— 计时状态变量 ——
  var timerId = null;       // setInterval 句柄
  var audioCtx = null;      // WebAudio 上下文（延迟创建，避免浏览器自动播放策略拦截）
  var settings = null;     // 当前设置（从 localStorage 加载）
  var stats = null;        // 当前统计（从 localStorage 加载）
  var mode = MODE.focus;   // 当前模式
  var totalMs = 0;         // 当前阶段总时长（毫秒）
  var remainingMs = 0;     // 剩余时长（毫秒）
  var endAt = 0;           // 运行时的结束时间戳
  var running = false;     // 是否正在走时
  var completedFocus = 0;  // 本轮已完成的连续专注番茄数（达 rounds 时触发长休并归零）

  /* ============================================================
   * 工具函数
   * ============================================================ */

  /**
   * 把毫秒格式化为 MM:SS（向上取整，最后一秒显示 00:01）
   * @param  {number} ms - 剩余毫秒
   * @return {string}    形如 "25:00" 的字符串
   * @throws 不抛异常，参数非法时返回 "00:00"
   */
  function format(ms) {
    if (!isFinite(ms) || ms < 0) ms = 0;
    var totalSec = Math.max(0, Math.ceil(ms / 1000));
    var m = Math.floor(totalSec / 60);
    var s = totalSec % 60;
    return String(m).padStart(2, "0") + ":" + String(s).padStart(2, "0");
  }

  /**
   * 获取当前模式对应的总分钟数
   * @param  {string} m - 模式枚举（focus/short/long）
   * @return {number}    分钟数，默认值兜底
   */
  function minutesFor(m) {
    if (m === MODE.focus) return settings.focusMin;
    if (m === MODE.short) return settings.shortMin;
    if (m === MODE.long)  return settings.longMin;
    return settings.focusMin;
  }

  /**
   * 安全读取 localStorage 中的 JSON
   * @param  {string} key - 存储键
   * @param  {*} fallback  - 解析失败/不存在时返回的兜底值
   * @return {*}           解析后的对象或 fallback
   */
  function loadJSON(key, fallback) {
    try {
      var raw = localStorage.getItem(key);
      if (!raw) return fallback;
      return JSON.parse(raw);
    } catch (e) {
      return fallback;
    }
  }

  /**
   * 安全写入 localStorage 中的 JSON
   * @param {string} key - 存储键
   * @param {*} value     - 任意可序列化数据
   * @return {void}
   */
  function saveJSON(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      // 隐私模式或配额超限时静默失败，不影响运行
    }
  }

  /**
   * 获取今日日期字符串 YYYY-MM-DD（本地时区）
   * @return {string} 如 "2026-09-14"
   */
  function todayKey() {
    var d = new Date();
    var m = String(d.getMonth() + 1).padStart(2, "0");
    var day = String(d.getDate()).padStart(2, "0");
    return d.getFullYear() + "-" + m + "-" + day;
  }

  /* ============================================================
   * Web Audio 提示音
   * ============================================================ */

  /**
   * 懒初始化 AudioContext（用户首次交互后创建，规避浏览器自动播放策略）
   * @return {AudioContext|null} 已就绪的上下文，创建失败返回 null
   */
  function ensureAudio() {
    if (!settings.sound) return null;
    if (audioCtx) return audioCtx;
    try {
      var Ctor = window.AudioContext || window.webkitAudioContext;
      if (!Ctor) return null;
      audioCtx = new Ctor();
      return audioCtx;
    } catch (e) {
      return null;
    }
  }

  /**
   * 合成单次提示音
   * @param {number} freq    - 频率（Hz）
   * @param {number} startAt - 相对开始的偏移时间（秒）
   * @param {number} duration- 持续时间（秒）
   * @return {void}
   */
  function beep(freq, startAt, duration) {
    var ctx = ensureAudio();
    if (!ctx) return;
    // 浏览器要求用户交互后才能 resume
    if (ctx.state === "suspended") { ctx.resume(); }
    var osc = ctx.createOscillator();
    var gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.value = freq;
    // 包络：起音 0.01s、保持、释音 0.05s，避免咔哒声
    var t0 = ctx.currentTime + startAt;
    gain.gain.setValueAtTime(0, t0);
    gain.gain.linearRampToValueAtTime(0.25, t0 + 0.01);
    gain.gain.setValueAtTime(0.25, t0 + duration - 0.05);
    gain.gain.linearRampToValueAtTime(0, t0 + duration);
    osc.connect(gain).connect(ctx.destination);
    osc.start(t0);
    osc.stop(t0 + duration + 0.02);
  }

  /**
   * 播放阶段切换提示音：两声“嘀嘀”
   * @return {void}
   */
  function playChime() {
    if (!settings.sound) return;
    beep(880, 0.00, 0.18);   // 第一声
    beep(1320, 0.22, 0.22); // 第二声（更高音）
  }

  /* ============================================================
   * 渲染层
   * ============================================================ */

  /**
   * 设置进度环偏移量与文本显示
   * @param {number} ms - 剩余毫秒
   * @return {void}
   */
  function renderTime(ms) {
    timeText.textContent = format(ms);
    // 剩余比例 = 剩余 / 总时长；offset 从 0（满）线性增长到 RING_CIRCUM（空）
    var ratio = totalMs > 0 ? ms / totalMs : 0;
    if (ratio < 0) ratio = 0;
    var offset = RING_CIRCUM * (1 - ratio);
    ringFg.setAttribute("stroke-dashoffset", String(offset));
    // 同步标签页标题，方便切到其他标签时查看
    document.title = format(ms) + " · " + MODE_LABEL[mode] + " | 番茄钟";
  }

  /**
   * 渲染番茄进度点：已完成的连续专注数 + 当前是否进行中
   * @return {void}
   */
  function renderDots() {
    var dots = pomoDots.querySelectorAll(".dot");
    for (var i = 0; i < dots.length; i++) {
      dots[i].classList.remove("done", "current");
    }
    // 仅专注模式显示进度，其他模式保持 4 个圆点的完成态指示
    var n = Math.min(completedFocus, settings.rounds);
    for (var j = 0; j < n; j++) {
      if (dots[j]) dots[j].classList.add("done");
    }
    if (mode === MODE.focus && running && n < settings.rounds && dots[n]) {
      dots[n].classList.add("current");
    }
  }

  /**
   * 渲染统计数字到 DOM
   * @return {void}
   */
  function renderStats() {
    statToday.textContent  = String(stats.today);
    statTotal.textContent = String(stats.total);
    statFocusMin.textContent = String(stats.focusMin);
  }

  /**
   * 切换模式：更新 data-mode、按钮激活态、阶段文本与时长
   * @param {string} m - 目标模式枚举
   * @return {void}
   */
  function switchMode(m) {
    mode = m;
    stage.setAttribute("data-mode", m);
    // 更新模式按钮激活态
    var tabs = modeTabs.querySelectorAll(".mode-tab");
    for (var i = 0; i < tabs.length; i++) {
      var active = tabs[i].getAttribute("data-mode") === m;
      tabs[i].classList.toggle("active", active);
      tabs[i].setAttribute("aria-selected", active ? "true" : "false");
    }
    // 同步设置弹层中的当前值（防止用户再次打开时混淆）
    // 重置时间与状态
    stopTimer();
    totalMs = minutesFor(m) * 60 * 1000;
    remainingMs = totalMs;
    renderTime(remainingMs);
    phaseText.textContent = "点击开始" + MODE_LABEL[m];
    phaseText.classList.remove("running");
    btnStart.textContent = "开始";
    renderDots();
  }

  /* ============================================================
   * 计时核心
   * ============================================================ */

  /**
   * 启动 setInterval 计时（每次 tick 基于时间戳推算剩余时间）
   * @return {void}
   */
  function startTick() {
    stopTimer();
    timerId = setInterval(tick, 250);
  }

  /**
   * 停止 setInterval
   * @return {void}
   */
  function stopTimer() {
    if (timerId) { clearInterval(timerId); timerId = null; }
  }

  /**
   * 单次 tick：基于 endAt 计算剩余时间，到点触发完成
   * @return {void}
   */
  function tick() {
    if (!running) return;
    var now = Date.now();
    var ms = endAt - now;
    if (ms <= 0) {
      // 阶段结束
      renderTime(0);
      finish();
      return;
    }
    remainingMs = ms;
    renderTime(ms);
  }

  /**
   * 开始或暂停计时（按钮入口）
   * @return {void}
   */
  function toggleStart() {
    if (running) {
      // 暂停：保留 remainingMs，清空 endAt
      running = false;
      stopTimer();
      btnStart.textContent = "继续";
      phaseText.textContent = "已暂停";
      phaseText.classList.remove("running");
      renderDots();
    } else {
      // 开始/继续：基于 remainingMs 推算 endAt
      running = true;
      endAt = Date.now() + remainingMs;
      btnStart.textContent = "暂停";
      phaseText.textContent = MODE_LABEL[mode] + "…";
      phaseText.classList.add("running");
      // 首次交互时尝试解锁 AudioContext
      ensureAudio();
      startTick();
      renderDots();
    }
  }

  /**
   * 重置当前阶段：停止计时并恢复初始时长
   * @return {void}
   */
  function reset() {
    running = false;
    stopTimer();
    remainingMs = totalMs;
    renderTime(remainingMs);
    phaseText.textContent = "点击开始" + MODE_LABEL[mode];
    phaseText.classList.remove("running");
    btnStart.textContent = "开始";
    renderDots();
  }

  /**
   * 跳过当前阶段：按完成情况判定是否计数番茄
   * @return {void}
   */
  function skip() {
    // 跳过不计数统计，仅推进阶段流转
    advance(false);
  }

  /**
   * 阶段完成处理：播放提示音 + 累计统计 + 推进下一阶段
   * @return {void}
   */
  function finish() {
    running = false;
    stopTimer();
    playChime();
    // 仅专注完成时累计统计
    var counted = (mode === MODE.focus);
    if (counted) {
      completedFocus++;
      stats.today++;
      stats.total++;
      stats.focusMin += settings.focusMin;
      saveJSON(STATS_KEY, stats);
      renderStats();
    }
    advance(counted);
  }

  /**
   * 推进到下一阶段
   * @param {boolean} focusDone - 本次是否为专注阶段正常完成
   * @return {void}
   */
  function advance(focusDone) {
    var nextMode;
    if (mode === MODE.focus) {
      // 专注完成 → 判断是否触发长休
      if (focusDone && completedFocus >= settings.rounds) {
        nextMode = MODE.long;
        completedFocus = 0; // 触发长休后归零
      } else {
        nextMode = MODE.short;
      }
    } else {
      // 休息结束 → 回到专注
      nextMode = MODE.focus;
    }
    switchMode(nextMode);
    // 是否自动开始下一阶段
    if (settings.autoStart) {
      // 略延迟，避免提示音与开始按钮同帧冲突
      setTimeout(function () { toggleStart(); }, 300);
    }
  }

  /* ============================================================
   * 设置弹层
   * ============================================================ */

  /**
   * 打开设置弹层并填充当前值
   * @return {void}
   */
  function openSettings() {
    $("setFocus").value = settings.focusMin;
    $("setShort").value = settings.shortMin;
    $("setLong").value  = settings.longMin;
    $("setRounds").value = settings.rounds;
    $("setAutoStart").checked = settings.autoStart;
    $("setSound").checked    = settings.sound;
    settingsModal.hidden = false;
  }

  /**
   * 关闭设置弹层（不保存）
   * @return {void}
   */
  function closeSettings() {
    settingsModal.hidden = true;
  }

  /**
   * 保存设置：读取输入并校验范围，写入 localStorage 并应用到当前阶段
   * @return {void}
   */
  function saveSettings() {
    var f = parseInt($("setFocus").value, 10);
    var s = parseInt($("setShort").value, 10);
    var l = parseInt($("setLong").value, 10);
    var r = parseInt($("setRounds").value, 10);
    // 范围校验，非法回退默认值
    settings.focusMin = (f >= 1 && f <= 120) ? f : DEFAULTS.focusMin;
    settings.shortMin = (s >= 1 && s <= 60)  ? s : DEFAULTS.shortMin;
    settings.longMin  = (l >= 1 && l <= 60)  ? l : DEFAULTS.longMin;
    settings.rounds   = (r >= 2 && r <= 12)  ? r : DEFAULTS.rounds;
    settings.autoStart = !!$("setAutoStart").checked;
    settings.sound     = !!$("setSound").checked;
    saveJSON(STORAGE_KEY, settings);
    closeSettings();
    // 重新初始化当前阶段（非运行中才更新，避免覆盖正在计时的剩余时间）
    if (!running) {
      switchMode(mode);
    }
    // 调整进度点数量（4 个固定圆点 + 数量映射高亮）
    renderDots();
  }

  /**
   * 清空所有统计数据（带二次确认）
   * @return {void}
   */
  function clearStats() {
    if (!confirm("确定清空所有番茄统计？此操作不可恢复。")) return;
    stats = { today: 0, total: 0, focusMin: 0, date: todayKey() };
    saveJSON(STATS_KEY, stats);
    renderStats();
  }

  /* ============================================================
   * 跨日重置 & 全屏
   * ============================================================ */

  /**
   * 检查今日是否跨日，跨日则重置 today 计数
   * @return {void}
   */
  function checkDayRollover() {
    var t = todayKey();
    if (stats.date !== t) {
      stats.date = t;
      stats.today = 0;
      saveJSON(STATS_KEY, stats);
      renderStats();
    }
  }

  /**
   * 切换全屏：转发给舞台右上角 ⛶ 按钮（真实全屏逻辑在
   * assets/js/tool-stage-toolbar.js 里，本文件不再自行调用 requestFullscreen）
   * @return {void}
   */
  function toggleFullscreen() {
    if (btnFullscreen) btnFullscreen.click();
  }

  /**
   * 全屏状态变化时显示/隐藏退出提示
   * @return {void}
   */
  function onFsChange() {
    var isFs = document.fullscreenElement || document.webkitFullscreenElement;
    fsHint.hidden = !isFs;
  }

  /* ============================================================
   * 事件绑定
   * ============================================================ */

  /**
   * 绑定所有 UI 事件（仅在初始化时调用一次）
   * @return {void}
   */
  function bindEvents() {
    // 模式标签点击
    modeTabs.addEventListener("click", function (e) {
      var btn = e.target.closest(".mode-tab");
      if (!btn) return;
      var m = btn.getAttribute("data-mode");
      if (m && m !== mode) switchMode(m);
    });

    btnStart.addEventListener("click", toggleStart);
    btnReset.addEventListener("click", reset);
    btnSkip.addEventListener("click", skip);

    btnHideSetup.addEventListener("click", openSettings);
    btnCloseSettings.addEventListener("click", closeSettings);
    btnCancelSettings.addEventListener("click", closeSettings);
    btnSaveSettings.addEventListener("click", saveSettings);
    btnTestSound.addEventListener("click", playChime);
    btnClearStats.addEventListener("click", clearStats);

    document.addEventListener("fullscreenchange", onFsChange);
    document.addEventListener("webkitfullscreenchange", onFsChange);

    // 点击遮罩关闭弹层
    settingsModal.addEventListener("click", function (e) {
      if (e.target === settingsModal) closeSettings();
    });

    // 键盘快捷键
    document.addEventListener("keydown", function (e) {
      // 输入框聚焦时不拦截
      var tag = (e.target && e.target.tagName) || "";
      if (tag === "INPUT" || tag === "TEXTAREA") return;
      // 弹层打开时仅允许 Esc 关闭
      if (!settingsModal.hidden) {
        if (e.key === "Escape") closeSettings();
        return;
      }
      switch (e.key) {
        case " ":
        case "Spacebar":
          e.preventDefault();
          toggleStart();
          break;
        case "r":
        case "R":
          reset();
          break;
        case "s":
        case "S":
          skip();
          break;
        case "f":
        case "F":
          toggleFullscreen();
          break;
        case "Escape":
          if (document.fullscreenElement || document.webkitFullscreenElement) {
            // Esc 退出全屏由浏览器原生处理，这里无需额外动作
          }
          break;
      }
    });
  }

  /* ============================================================
   * 初始化
   * ============================================================ */

  /**
   * 初始化：加载持久化数据 → 校验补全 → 渲染 → 绑定事件
   * @return {void}
   */
  function init() {
    // 加载设置，缺失字段用默认值补全
    var loaded = loadJSON(STORAGE_KEY, null) || {};
    settings = {
      focusMin:  typeof loaded.focusMin  === "number" ? loaded.focusMin  : DEFAULTS.focusMin,
      shortMin:  typeof loaded.shortMin  === "number" ? loaded.shortMin  : DEFAULTS.shortMin,
      longMin:   typeof loaded.longMin   === "number" ? loaded.longMin   : DEFAULTS.longMin,
      rounds:    typeof loaded.rounds     === "number" ? loaded.rounds     : DEFAULTS.rounds,
      autoStart: typeof loaded.autoStart === "boolean" ? loaded.autoStart : DEFAULTS.autoStart,
      sound:     typeof loaded.sound     === "boolean" ? loaded.sound     : DEFAULTS.sound
    };

    // 加载统计
    var loadedStats = loadJSON(STATS_KEY, null) || {};
    stats = {
      today:    typeof loadedStats.today    === "number" ? loadedStats.today    : 0,
      total:    typeof loadedStats.total    === "number" ? loadedStats.total    : 0,
      focusMin: typeof loadedStats.focusMin === "number" ? loadedStats.focusMin : 0,
      date:     typeof loadedStats.date     === "string" ? loadedStats.date     : todayKey()
    };
    checkDayRollover();

    // 初始化进度环 dasharray
    ringFg.setAttribute("stroke-dasharray", String(RING_CIRCUM));

    // 默认进入专注模式
    switchMode(MODE.focus);
    renderStats();
    bindEvents();

    /* 舞台右上角工具栏（⛶ 全屏 / ⚙ 设置）：全屏目标是 #timerStage 自身。
       番茄钟没有可隐藏的设置栏（设置为弹层），故 panelHost 传 null ——
       共享模块只接全屏，不做任何显隐操作。 */
    if (window.EduToolStageToolbar) {
      window.EduToolStageToolbar.init({ stage: "#timerStage", panelHost: null });
    }
  }

  // DOM 就绪后启动
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
