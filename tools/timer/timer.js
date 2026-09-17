/**
 * ============================================================================
 * 课堂计时工具 (timer.js)
 * ----------------------------------------------------------------------------
 * 功能概要：
 *   - 双模式：倒计时 / 正计时
 *   - 大字显示时间（mm:ss 或 hh:mm:ss）
 *   - 快速预设（1/3/5/10/15/30/45/60 分钟）
 *   - 自定义分秒设定
 *   - 开始 / 暂停 / 继续 / 重置
 *   - 全屏切换（Fullscreen API）
 *   - 倒计时结束：循环提示音 + 屏幕闪烁红光 + 停止提醒按钮
 *   - localStorage 保存最后设置（模式、分秒、音效开关）
 * 全部为纯前端实现，不依赖外部资源，兼容 file:// 协议。
 * ============================================================================
 */
(function () {
  "use strict";

  /* ----------------------------------------------------------------
   * 常量与状态
   * ---------------------------------------------------------------- */

  // localStorage 键名
  var LS_KEY = "edu_toolbox_timer_settings";

  // 进度环周长（半径 108，C = 2πr ≈ 678.58）
  var RING_CIRC = 2 * Math.PI * 108;

  // 计时模式枚举
  var MODE_COUNTDOWN = "countdown";  // 倒计时
  var MODE_STOPWATCH = "stopwatch";   // 正计时

  // 运行状态枚举
  var STATE_IDLE = "idle";            // 准备就绪
  var STATE_RUNNING = "running";      // 计时中
  var STATE_PAUSED = "paused";        // 已暂停
  var STATE_FINISHED = "finished";    // 已结束

  // 运行期变量
  var mode = MODE_COUNTDOWN;          // 当前模式
  var state = STATE_IDLE;             // 当前状态
  var totalSec = 300;                 // 倒计时总时长（秒）
  var remainingSec = 300;             // 倒计时剩余（秒）
  var elapsedSec = 0;                 // 正计时已计（秒）
  var ticker = null;                  // setInterval 句柄
  var audioCtx = null;                // AudioContext 懒加载缓存
  var alertLoop = null;               // 结束提醒循环句柄
  var soundOn = true;                 // 音效开关

  /* ----------------------------------------------------------------
   * DOM 工具函数
   * ---------------------------------------------------------------- */

  /**
   * 根据 id 获取 DOM 元素
   * @param {string} id - 元素 id
   * @returns {HTMLElement} 对应 DOM 元素
   */
  function $(id) { return document.getElementById(id); }

  /**
   * 切换元素的 hidden 状态
   * @param {HTMLElement} el - 目标元素
   * @param {boolean} hide - true 表示隐藏，false 表示显示
   * @returns {void}
   */
  function toggleHidden(el, hide) {
    if (!el) return;
    if (hide) el.classList.add("hidden");
    else el.classList.remove("hidden");
  }

  /* ----------------------------------------------------------------
   * 时间格式化
   * ---------------------------------------------------------------- */

  /**
   * 将秒数格式化为 mm:ss 或 hh:mm:ss
   * 超过 1 小时自动使用 hh:mm:ss，否则 mm:ss
   * @param {number} s - 秒数（≥0）
   * @returns {string} 格式化后的时间字符串
   */
  function formatTime(s) {
    s = Math.max(0, Math.floor(s));
    var h = Math.floor(s / 3600);
    var m = Math.floor((s % 3600) / 60);
    var sec = s % 60;
    var pad = function (n) { return n < 10 ? "0" + n : "" + n; };
    if (h > 0) return pad(h) + ":" + pad(m) + ":" + pad(sec);
    return pad(m) + ":" + pad(sec);
  }

  /* ----------------------------------------------------------------
   * 音效（Web Audio API 合成，无外部资源依赖）
   * ---------------------------------------------------------------- */

  /**
   * 懒加载 AudioContext，首次调用时创建
   * @returns {AudioContext|null} 创建的 AudioContext；浏览器不支持时返回 null
   * @throws 不抛出异常，错误被捕获后返回 null
   */
  function getAudioCtx() {
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
   * 播放一次"滴滴"提示音（三声 880/660/880 Hz 的正弦波）
   * @returns {void}
   * @throws 不抛出异常；AudioContext 不可用时静默失败
   */
  function playBeep() {
    var ctx = getAudioCtx();
    if (!ctx) return;
    // 浏览器要求用户手势后才能恢复挂起的 AudioContext
    if (ctx.state === "suspended") { ctx.resume().catch(function () {}); }
    var freqs = [880, 660, 880];
    freqs.forEach(function (freq, i) {
      var t0 = ctx.currentTime + i * 0.4;
      var osc = ctx.createOscillator();
      var gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.001, t0);
      gain.gain.exponentialRampToValueAtTime(0.35, t0 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, t0 + 0.32);
      osc.connect(gain).connect(ctx.destination);
      osc.start(t0);
      osc.stop(t0 + 0.34);
    });
  }

  /**
   * 启动结束循环提醒：循环播放提示音 + 屏幕闪烁
   * @returns {void}
   */
  function startAlertLoop() {
    if (alertLoop) return;
    document.body.classList.add("alerting");
    toggleHidden($("stopAlertBtn"), false);
    playBeep();
    // 每 1.5 秒重复一次提示音
    alertLoop = setInterval(function () {
      if (soundOn) playBeep();
    }, 1500);
  }

  /**
   * 停止结束循环提醒
   * @returns {void}
   */
  function stopAlertLoop() {
    if (alertLoop) {
      clearInterval(alertLoop);
      alertLoop = null;
    }
    document.body.classList.remove("alerting");
    toggleHidden($("stopAlertBtn"), true);
  }

  /* ----------------------------------------------------------------
   * 视图刷新
   * ---------------------------------------------------------------- */

  /**
   * 刷新时间显示、进度环与状态文本
   * @returns {void}
   */
  function renderView() {
    var display = $("display");
    var status = $("status");
    var ring = $("ring");
    var stage = $("stage");

    // 时间显示
    if (mode === MODE_COUNTDOWN) {
      display.textContent = formatTime(remainingSec);
    } else {
      display.textContent = formatTime(elapsedSec);
    }

    // 进度环（仅倒计时模式）
    if (mode === MODE_COUNTDOWN && totalSec > 0) {
      var pct = remainingSec / totalSec;
      ring.style.strokeDashoffset = String(RING_CIRC * (1 - pct));
    } else {
      ring.style.strokeDashoffset = String(RING_CIRC);
    }

    // 状态文字
    var statusText = {
      idle: "准备就绪",
      running: "计时中…",
      paused: "已暂停",
      finished: "时间到"
    }[state] || "准备就绪";
    status.textContent = statusText;
    stage.setAttribute("data-state", state);

    // 暂停 / 开始按钮文案
    var startBtn = $("startBtn");
    if (state === STATE_RUNNING) startBtn.textContent = "暂停";
    else if (state === STATE_PAUSED) startBtn.textContent = "继续";
    else if (state === STATE_FINISHED) startBtn.textContent = "开始计时";
    else startBtn.textContent = "开始计时";

    // 同步 document.title
    document.title = display.textContent + " | 课堂计时";
  }

  /* ----------------------------------------------------------------
   * 计时核心
   * ---------------------------------------------------------------- */

  /**
   * 启动 setInterval 心跳，每秒推进时间
   * @returns {void}
   * @throws 不抛出；任何错误会被忽略以保证心跳稳定
   */
  function startTicker() {
    if (ticker) clearInterval(ticker);
    ticker = setInterval(function () {
      if (mode === MODE_COUNTDOWN) {
        remainingSec--;
        if (remainingSec <= 0) {
          remainingSec = 0;
          renderView();
          finish();
          return;
        }
      } else {
        elapsedSec++;
      }
      renderView();
    }, 1000);
  }

  /**
   * 停止心跳
   * @returns {void}
   */
  function stopTicker() {
    if (ticker) { clearInterval(ticker); ticker = null; }
  }

  /**
   * 倒计时到点处理：停止心跳、启动循环提醒
   * @returns {void}
   */
  function finish() {
    stopTicker();
    state = STATE_FINISHED;
    renderView();
    if (soundOn) startAlertLoop();
  }

  /**
   * 主控按钮：开始 / 暂停 / 继续 / 重启
   * @returns {void}
   */
  function onStart() {
    // 已结束 → 重置后再开始
    if (state === STATE_FINISHED) {
      stopAlertLoop();
      resetState(false);
    }

    // 准备就绪 → 开始
    if (state === STATE_IDLE) {
      if (mode === MODE_COUNTDOWN) {
        var m = parseInt($("min").value, 10) || 0;
        var s = parseInt($("sec").value, 10) || 0;
        totalSec = m * 60 + s;
        if (totalSec <= 0) {
          // 非法时长，给个软提示不阻断
          $("status").textContent = "请设置大于 0 的时长";
          return;
        }
        remainingSec = totalSec;
      } else {
        elapsedSec = 0;
      }
      state = STATE_RUNNING;
      // 用户手势触发后恢复 AudioContext
      var ctx = getAudioCtx();
      if (ctx && ctx.state === "suspended") ctx.resume().catch(function () {});
      startTicker();
      renderView();
      saveSettings();
      return;
    }

    // 计时中 → 暂停
    if (state === STATE_RUNNING) {
      stopTicker();
      state = STATE_PAUSED;
      renderView();
      return;
    }

    // 已暂停 → 继续
    if (state === STATE_PAUSED) {
      state = STATE_RUNNING;
      startTicker();
      renderView();
      return;
    }
  }

  /**
   * 重置到准备就绪状态
   * @param {boolean} [clearInputs=true] - 是否清空正计时的累计值（保留输入框分秒）
   * @returns {void}
   */
  function resetState(clearInputs) {
    if (clearInputs === undefined) clearInputs = true;
    stopTicker();
    stopAlertLoop();
    state = STATE_IDLE;
    if (mode === MODE_COUNTDOWN) {
      var m = parseInt($("min").value, 10) || 0;
      var s = parseInt($("sec").value, 10) || 0;
      totalSec = m * 60 + s;
      remainingSec = totalSec;
    } else {
      if (clearInputs) elapsedSec = 0;
    }
    renderView();
  }

  /**
   * 点击"重置"按钮
   * @returns {void}
   */
  function onReset() {
    resetState(true);
    saveSettings();
  }

  /**
   * 点击"设定"按钮：把输入框分秒应用到倒计时
   * @returns {void}
   */
  function onSetCustom() {
    var m = parseInt($("min").value, 10) || 0;
    var s = parseInt($("sec").value, 10) || 0;
    if (m < 0) m = 0;
    if (s < 0 || s > 59) s = 0;
    $("min").value = m;
    $("sec").value = s;
    totalSec = m * 60 + s;
    remainingSec = totalSec;
    // 清除高亮预设
    eachPreset(function (b) { b.classList.remove("active"); });
    resetState(false);
    saveSettings();
  }

  /**
   * 点击快速预设：应用到倒计时输入框并立即准备就绪
   * @param {number} sec - 预设秒数
   * @returns {void}
   */
  function onPreset(sec) {
    var m = Math.floor(sec / 60);
    var s = sec % 60;
    $("min").value = m;
    $("sec").value = s;
    totalSec = sec;
    remainingSec = sec;
    eachPreset(function (b) {
      var v = parseInt(b.getAttribute("data-sec"), 10);
      b.classList.toggle("active", v === sec);
    });
    resetState(false);
    saveSettings();
  }

  /**
   * 切换模式（正计时 / 倒计时）
   * @param {string} nextMode - MODE_COUNTDOWN 或 MODE_STOPWATCH
   * @returns {void}
   */
  function switchMode(nextMode) {
    if (nextMode === mode) return;
    stopTicker();
    stopAlertLoop();
    mode = nextMode;
    document.body.setAttribute("data-mode", mode);
    // 更新模式按钮高亮
    $("modeCountdown").classList.toggle("active", mode === MODE_COUNTDOWN);
    $("modeStopwatch").classList.toggle("active", mode === MODE_STOPWATCH);
    $("modeCountdown").setAttribute("aria-selected", mode === MODE_COUNTDOWN);
    $("modeStopwatch").setAttribute("aria-selected", mode === MODE_STOPWATCH);
    // 正计时模式隐藏自定义时长输入（用不上）
    var custom = $("custom");
    toggleHidden(custom, mode === MODE_STOPWATCH);
    resetState(true);
    saveSettings();
  }

  /**
   * 切换全屏
   * @returns {void}
   * @throws 不抛出；浏览器不支持 Fullscreen API 时静默失败
   */
  function toggleFullscreen() {
    var el = document.documentElement;
    try {
      if (!document.fullscreenElement && !document.webkitFullscreenElement) {
        if (el.requestFullscreen) el.requestFullscreen();
        else if (el.webkitRequestFullscreen) el.webkitRequestFullscreen();
      } else {
        if (document.exitFullscreen) document.exitFullscreen();
        else if (document.webkitExitFullscreen) document.webkitExitFullscreen();
      }
    } catch (e) { /* 静默忽略 */ }
  }

  /**
   * 更新全屏按钮文案
   * @returns {void}
   */
  function syncFullscreenBtn() {
    var isFs = document.fullscreenElement || document.webkitFullscreenElement;
    $("fsBtn").textContent = isFs ? "退出全屏" : "⛶ 全屏";
  }

  /**
   * 切换音效开关
   * @returns {void}
   */
  function toggleSound() {
    soundOn = !soundOn;
    $("soundIcon").textContent = soundOn ? "🔊" : "🔇";
    if (!soundOn) stopAlertLoop();
    saveSettings();
  }

  /* ----------------------------------------------------------------
   * 持久化
   * ---------------------------------------------------------------- */

  /**
   * 将当前设置写入 localStorage
   * @returns {void}
   * @throws 不抛出；localStorage 不可用时静默失败
   */
  function saveSettings() {
    try {
      var data = {
        mode: mode,
        min: parseInt($("min").value, 10) || 0,
        sec: parseInt($("sec").value, 10) || 0,
        soundOn: soundOn
      };
      localStorage.setItem(LS_KEY, JSON.stringify(data));
    } catch (e) { /* 静默忽略 */ }
  }

  /**
   * 从 localStorage 读取并应用上次设置
   * @returns {void}
   * @throws 不抛出；解析失败时使用默认值
   */
  function loadSettings() {
    var data;
    try {
      data = JSON.parse(localStorage.getItem(LS_KEY) || "{}");
    } catch (e) {
      data = {};
    }
    if (typeof data.min === "number") $("min").value = data.min;
    if (typeof data.sec === "number") $("sec").value = data.sec;
    if (data.soundOn === false) {
      soundOn = false;
      $("soundIcon").textContent = "🔇";
    }
    // 初始化 totalSec / remainingSec
    var m = parseInt($("min").value, 10) || 0;
    var s = parseInt($("sec").value, 10) || 0;
    totalSec = m * 60 + s;
    remainingSec = totalSec;
    // 应用模式
    if (data.mode === MODE_STOPWATCH) switchMode(MODE_STOPWATCH);
    else {
      mode = MODE_COUNTDOWN;
      document.body.setAttribute("data-mode", mode);
    }
  }

  /* ----------------------------------------------------------------
   * 小工具：遍历所有预设按钮
   * ---------------------------------------------------------------- */

  /**
   * 对每个预设按钮执行回调
   * @param {function(HTMLButtonElement):void} cb - 回调函数
   * @returns {void}
   */
  function eachPreset(cb) {
    var list = document.querySelectorAll(".preset");
    for (var i = 0; i < list.length; i++) cb(list[i]);
  }

  /* ----------------------------------------------------------------
   * 事件绑定
   * ---------------------------------------------------------------- */

  /**
   * 绑定所有交互事件
   * @returns {void}
   */
  function bindEvents() {
    $("startBtn").addEventListener("click", onStart);
    $("resetBtn").addEventListener("click", onReset);
    $("setBtn").addEventListener("click", onSetCustom);
    $("fsBtn").addEventListener("click", toggleFullscreen);
    $("soundBtn").addEventListener("click", toggleSound);
    $("soundTest").addEventListener("click", function () { playBeep(); });
    $("stopAlertBtn").addEventListener("click", function () {
      stopAlertLoop();
      state = STATE_FINISHED;
      renderView();
    });
    $("modeCountdown").addEventListener("click", function () { switchMode(MODE_COUNTDOWN); });
    $("modeStopwatch").addEventListener("click", function () { switchMode(MODE_STOPWATCH); });

    eachPreset(function (b) {
      b.addEventListener("click", function () {
        var sec = parseInt(b.getAttribute("data-sec"), 10);
        if (!isNaN(sec)) onPreset(sec);
      });
    });

    // 输入框回车也触发设定
    ["min", "sec"].forEach(function (id) {
      $(id).addEventListener("change", function () {
        var m = parseInt($("min").value, 10) || 0;
        var s = parseInt($("sec").value, 10) || 0;
        if (s > 59) { s = 59; $("sec").value = 59; }
        if (s < 0) { s = 0; $("sec").value = 0; }
        if (m < 0) { m = 0; $("min").value = 0; }
        totalSec = m * 60 + s;
        remainingSec = totalSec;
        renderView();
        saveSettings();
      });
    });

    // 键盘快捷键：空格开始/暂停，R 重置
    document.addEventListener("keydown", function (e) {
      if (e.target && (e.target.tagName === "INPUT")) return;
      if (e.code === "Space") { e.preventDefault(); onStart(); }
      else if (e.key === "r" || e.key === "R") { onReset(); }
      else if (e.key === "f" || e.key === "F") { toggleFullscreen(); }
    });

    // 全屏状态变化同步按钮文案
    document.addEventListener("fullscreenchange", syncFullscreenBtn);
    document.addEventListener("webkitfullscreenchange", syncFullscreenBtn);
  }

  /* ----------------------------------------------------------------
   * 初始化
   * ---------------------------------------------------------------- */

  /**
   * 入口：加载设置、绑定事件、首次渲染
   * @returns {void}
   */
  function init() {
    loadSettings();
    bindEvents();
    renderView();
  }

  // DOM 就绪后启动
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
