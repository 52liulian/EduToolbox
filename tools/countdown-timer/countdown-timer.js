/**
 * 极简倒计时（深色霓虹大屏版）
 * ----------------------------------------------------------------
 * 功能清单：
 *   1. 分:秒自定义输入 + 10 档常用时长预设（1/3/5/10/15/30/45/60/90/120 分钟）
 *   2. ±1 分 / ±10 秒 微调按钮（运行中也可调整，自动同步剩余时间）
 *   3. 时间戳精准计时（不受 setInterval 抖动影响）
 *   4. 暂停 / 继续 / 重置 / 全屏（⛶ 由 assets/js/tool-stage-toolbar.js 统一接管）
 *   5. 最后 10 秒数字与进度条变红 + 每秒短促提示音（Web Audio API 合成，无音频文件）
 *   6. 倒计时结束三声长音 + “时间到”文字闪烁
 *   7. 标签页标题同步显示剩余时间，便于切到其它标签时查看
 *   8. 强调色跟随站点全局 🎨 配色（六色一一映射，本工具不再自带配色开关）
 *   9. localStorage 持久化最后设置（分 / 秒；配色改由站点全局控制）
 *  10. 键盘快捷键：空格暂停 / 继续、R 重置、Esc 退出全屏
 *
 * 兼容性：纯前端 IIFE，无 fetch / Worker / import，可双击 file:// 直接打开
 */
(function () {
  "use strict";

  /** 持久化键名常量 */
  var STORAGE_KEY = "countdown-timer:settings";

  /**
   * 按 id 获取元素
   * @param  {string} id - 元素的 id 属性
   * @return {HTMLElement|null} 找到的 DOM 元素，无匹配返回 null
   */
  function $(id) { return document.getElementById(id); }

  // —— DOM 引用 ——
  var setupScreen = $("setupScreen");
  var runScreen   = $("runScreen");
  var inputMin    = $("inputMin");
  var inputSec    = $("inputSec");
  var adjCurrent  = $("adjCurrent");
  var timeText    = $("timeText");
  var finishText  = $("finishText");
  var progressBar = $("progressBar");
  var btnPause    = $("btnPause");

  /** 计时状态变量 */
  var timerId = null;          // setInterval 句柄
  var audioCtx = null;         // WebAudio 上下文（延迟创建）
  var totalMs = 0;             // 总时长（毫秒）
  var remainingMs = 0;         // 暂停时保存的剩余毫秒
  var endAt = 0;               // 运行时的结束时间戳
  var running = false;         // 是否正在走时
  var finished = false;        // 是否已结束
  var lastBeepSecond = -1;     // 上次已响提示音的整秒，防止重复发声

  // —— 站点全局配色 → 本工具霓虹强调色 ——
  /* 设计说明（2026 整改）：本工具不再自带配色开关（原 6 个主题圆点已移除），
     强调色改为跟随站点顶栏 🎨（localStorage 键 et-accent）。
       · 用户从未选过配色（键不存在）→ 不写内联变量，CSS 兜底的霓虹绿生效，
         与改造前默认完全一致，视觉不跳变；
       · 用户选过配色 → 按下面的调色板映射后写到工具根容器。
     为什么映射表放在 JS 而不是 CSS：站点内嵌时 rebaseCss 会把
     body[data-theme="x"] 重基成 :host[data-theme="x"]，而 :host 的复合选择器
     写法浏览器不支持（实测只有 :host([data-theme="x"]) 函数式写法命中），
     独立页里又永不匹配 —— 两边无法两全，故由 JS 读配色名后写自定义属性。
     写在哪里：document.body 在站点内嵌模式下就是影子树内层容器 .tool-page，
     在独立页模式下就是 <body>，两种模式都只落在工具自己的根容器上；
     只写 --accent / --accent-rgb 两个工具私有变量，绝不碰站点 --primary，
     也不再往任何元素上写 data-theme。 */
  var ACCENT_PALETTE = {
    sky:    { hex: "#38bdf8", rgb: "56, 189, 248" },
    violet: { hex: "#a78bfa", rgb: "167, 139, 250" },
    green:  { hex: "#34ffb0", rgb: "52, 255, 176" },
    gold:   { hex: "#fbbf24", rgb: "251, 191, 36" },
    orange: { hex: "#fb923c", rgb: "251, 146, 60" },
    pink:   { hex: "#f472b6", rgb: "244, 114, 182" }
  };

  /**
   * 读取站点全局配色名；用户从未选过（键缺失 / 非法）时返回空串
   * @return {string} 合法配色名或 ""
   */
  function readSiteAccent() {
    var raw = null;
    try { raw = localStorage.getItem("et-accent"); } catch (e) { raw = null; }
    // 用 hasOwnProperty 兜住 raw 为 "constructor" / "__proto__" 之类的脏值
    if (raw && Object.prototype.hasOwnProperty.call(ACCENT_PALETTE, raw)) return raw;
    return "";
  }

  /**
   * 把站点配色映射到本工具强调色，写到工具根容器的内联自定义属性
   * @return {void}
   */
  function applyAccent() {
    var root = document.body;
    if (!root || !root.style) return;
    var pal = ACCENT_PALETTE[readSiteAccent()];
    if (pal) {
      root.style.setProperty("--accent", pal.hex);
      root.style.setProperty("--accent-rgb", pal.rgb);
    } else {
      // 未选过配色：清掉内联值，交回 CSS 的霓虹绿兜底
      root.style.removeProperty("--accent");
      root.style.removeProperty("--accent-rgb");
    }
  }

  /**
   * 监听站点配色变化
   * 内嵌模式下站点切换 🎨 时会把配色名同步到根容器的 data-theme，
   * 因此观察该属性即可实时跟随（站点派发的 et:accent 事件不进影子树）。
   * @return {void}
   */
  function watchAccent() {
    if (typeof MutationObserver !== "function" || !document.body) return;
    try {
      new MutationObserver(applyAccent).observe(document.body, {
        attributes: true,
        attributeFilter: ["data-theme"]
      });
    } catch (e) { /* 老浏览器忽略：退化为重新进入工具时生效 */ }
  }

  /**
   * 把毫秒格式化为 MM:SS（向上取整，最后一秒显示 00:01）
   * @param  {number} ms - 剩余毫秒
   * @return {string}    形如 "05:00" 的字符串
   */
  function format(ms) {
    var totalSec = Math.max(0, Math.ceil(ms / 1000));
    var m = Math.floor(totalSec / 60);
    var s = totalSec % 60;
    return String(m).padStart(2, "0") + ":" + String(s).padStart(2, "0");
  }

  /**
   * 把当前分:秒输入框的值格式化为 "N 分" / "N 分 S 秒" 文本
   * @return {string} 例如 "5 分" 或 "5 分 30 秒"
   */
  function currentAdjustLabel() {
    var m = parseInt(inputMin.value, 10) || 0;
    var s = parseInt(inputSec.value, 10) || 0;
    if (s > 0) return m + " 分 " + s + " 秒";
    return m + " 分";
  }

  /**
   * 同步微调区显示的当前时长文字
   * @return {void}
   */
  function refreshAdjustLabel() {
    if (adjCurrent) adjCurrent.textContent = currentAdjustLabel();
  }

  /**
   * 惰性创建音频上下文（必须在用户手势后调用，否则浏览器会阻止）
   * @return {AudioContext|null} 浏览器不支持时返回 null
   */
  function ensureAudio() {
    if (!audioCtx) {
      var AC = window.AudioContext || window.webkitAudioContext;
      if (AC) audioCtx = new AC();
    }
    if (audioCtx && audioCtx.state === "suspended") audioCtx.resume();
    return audioCtx;
  }

  /**
   * 合成一个提示音（无音频文件依赖，纯 Web Audio 振荡器）
   * @param {number} freq     - 频率（Hz）
   * @param {number} duration - 时长（秒）
   * @param {number} [delay=0]- 相对当前的延后（秒）
   * @param {string} [type="sine"] - 波形 sine/square/sawtooth/triangle
   * @return {void}
   */
  function tone(freq, duration, delay, type) {
    var ac = audioCtx;
    if (!ac) return;
    var t0 = ac.currentTime + (delay || 0);
    var osc = ac.createOscillator();
    var gain = ac.createGain();
    osc.type = type || "sine";
    osc.frequency.setValueAtTime(freq, t0);
    gain.gain.setValueAtTime(0.0001, t0);
    gain.gain.exponentialRampToValueAtTime(0.35, t0 + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, t0 + duration);
    osc.connect(gain).connect(ac.destination);
    osc.start(t0);
    osc.stop(t0 + duration + 0.05);
  }

  /** 短促“滴”声（最后 10 秒每秒一次） */
  function shortBeep() { tone(1000, 0.12, 0, "square"); }

  /** 结束三长音提示 */
  function finishChime() {
    tone(760, 0.55, 0,    "sine");
    tone(760, 0.55, 0.75, "sine");
    tone(960, 0.8,  1.5,  "sine");
  }

  /**
   * 刷新一次显示（数字、进度条、标题、警示状态与提示音）
   * @return {void}
   */
  function tick() {
    remainingMs = Math.max(0, endAt - Date.now());
    var text = format(remainingMs);
    timeText.textContent = text;
    document.title = text + " - 极简倒计时";
    progressBar.style.transform = "scaleX(" + (totalMs > 0 ? remainingMs / totalMs : 0) + ")";

    var leftSec = Math.ceil(remainingMs / 1000);
    var danger = leftSec <= 10 && leftSec > 0;
    timeText.classList.toggle("danger", danger);
    progressBar.classList.toggle("danger", danger);

    // 进入新的整秒且处于最后 10 秒：响一声
    if (danger && running && leftSec !== lastBeepSecond) {
      lastBeepSecond = leftSec;
      shortBeep();
    }

    if (remainingMs <= 0) finish();
  }

  /**
   * 启动走时循环（250ms 轮询时间戳，非死循环，可随时清除）
   * @return {void}
   */
  function startLoop() {
    stopLoop();
    endAt = Date.now() + remainingMs;
    running = true;
    timerId = setInterval(tick, 250);
    tick();
  }

  /** 清除走时循环 */
  function stopLoop() {
    if (timerId !== null) {
      clearInterval(timerId);
      timerId = null;
    }
  }

  /**
   * 从设置页开始倒计时
   * @return {void}
   */
  function start() {
    var m = parseInt(inputMin.value, 10);
    var s = parseInt(inputSec.value, 10);
    if (Number.isNaN(m)) m = 0;
    if (Number.isNaN(s)) s = 0;
    m = Math.min(999, Math.max(0, m));
    s = Math.min(59, Math.max(0, s));
    var ms = (m * 60 + s) * 1000;
    if (ms <= 0) {
      inputMin.focus();
      flashEmpty();
      return;
    }
    ensureAudio();
    totalMs = ms;
    remainingMs = ms;
    finished = false;
    lastBeepSecond = -1;
    finishText.classList.add("hidden");
    timeText.classList.remove("danger");
    progressBar.classList.remove("danger");
    timeText.textContent = format(ms);
    btnPause.textContent = "⏸ 暂停";
    setupScreen.classList.add("hidden");
    runScreen.classList.remove("hidden");
    saveSettings();
    startLoop();
  }

  /** 时长为 0 时输入框短暂闪红提示 */
  function flashEmpty() {
    inputMin.style.borderColor = "#ff4d5e";
    inputSec.style.borderColor = "#ff4d5e";
    setTimeout(function () {
      inputMin.style.borderColor = "";
      inputSec.style.borderColor = "";
    }, 700);
  }

  /**
   * 暂停 / 继续切换（运行中暂停，暂停后继续）
   * @return {void}
   */
  function togglePause() {
    if (finished) return;
    ensureAudio();
    if (running) {
      stopLoop();
      running = false;
      btnPause.textContent = "▶ 继续";
    } else {
      startLoop();
      btnPause.textContent = "⏸ 暂停";
    }
  }

  /**
   * 时间到：停止计时、三声长音、显示“时间到”
   * @return {void}
   */
  function finish() {
    stopLoop();
    running = false;
    finished = true;
    remainingMs = 0;
    timeText.textContent = "00:00";
    timeText.classList.remove("danger");
    finishText.classList.remove("hidden");
    btnPause.textContent = "⏸ 暂停";
    document.title = "时间到 - 极简倒计时";
    progressBar.style.transform = "scaleX(0)";
    finishChime();
  }

  /**
   * 重置回设置页并清理计时资源
   * @return {void}
   */
  function reset() {
    stopLoop();
    running = false;
    finished = false;
    lastBeepSecond = -1;
    runScreen.classList.add("hidden");
    setupScreen.classList.remove("hidden");
    finishText.classList.add("hidden");
    timeText.classList.remove("danger");
    progressBar.classList.remove("danger");
    progressBar.style.transform = "scaleX(1)";
    document.title = "极简倒计时";
    refreshAdjustLabel();
    syncChipsActive();
  }

  /**
   * 在当前分:秒基础上微调时长（毫秒增量，可为负）
   * 运行中调用会同步调整 endAt 与 remainingMs；设置页调用会改输入框值
   * @param {number} deltaMs - 时长增量（毫秒），正负均可
   * @return {void}
   */
  function adjustTime(deltaMs) {
    if (running) {
      // 运行中：直接调整 endAt（保持正在走时）
      var newRemain = remainingMs + deltaMs;
      if (newRemain <= 0) newRemain = 1000; // 至少保留 1 秒避免立刻结束
      remainingMs = newRemain;
      totalMs = Math.max(totalMs, newRemain);
      endAt = Date.now() + remainingMs;
      tick();
    } else if (finished) {
      // 已结束状态：忽略微调，等用户重置后再用
    } else {
      // 设置页：直接改输入框
      var totalOld = (parseInt(inputMin.value, 10) || 0) * 60000 +
                     (parseInt(inputSec.value, 10) || 0) * 1000;
      var totalNew = Math.max(0, totalOld + deltaMs);
      var totalMin = Math.floor(totalNew / 60000);
      var totalSec = Math.floor((totalNew % 60000) / 1000);
      inputMin.value = String(Math.min(999, totalMin));
      inputSec.value = String(Math.min(59, totalSec));
      refreshAdjustLabel();
      syncChipsActive();
      saveSettings();
    }
  }

  /**
   * 同步 chips 的高亮状态：当前分:秒 等于某预设时高亮对应按钮
   * @return {void}
   */
  function syncChipsActive() {
    var m = parseInt(inputMin.value, 10);
    var s = parseInt(inputSec.value, 10);
    document.querySelectorAll(".chip").forEach(function (c) {
      var cm = Number(c.dataset.min);
      if (cm === m && s === 0) c.classList.add("active");
      else c.classList.remove("active");
    });
  }

  /**
   * 持久化当前设置到 localStorage（分 / 秒）
   * 异常场景：隐私模式或 storage 被禁用时 try/catch 静默忽略
   * @return {void}
   */
  function saveSettings() {
    try {
      var data = {
        min: parseInt(inputMin.value, 10) || 0,
        sec: parseInt(inputSec.value, 10) || 0
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) { /* localStorage 不可用时静默忽略 */ }
  }

  /**
   * 从 localStorage 读取并应用上次设置
   * 异常场景：JSON 解析失败或无存储时使用默认值（5 分 0 秒）
   *
   * 悬空 key 说明：历史版本会把 theme（主题色）一起持久化；配色改由站点全局 🎨
   * 控制后该字段作废。这里刻意不读它 —— 旧数据里的 theme 是悬空 key，
   * 忽略即可，min / sec 的恢复不受影响，也不再需要任何默认值兜底。
   * @return {void}
   */
  function loadSettings() {
    var min = 5, sec = 0;
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        var data = JSON.parse(raw);
        if (typeof data.min === "number") min = Math.min(999, Math.max(0, data.min));
        if (typeof data.sec === "number") sec = Math.min(59, Math.max(0, data.sec));
      }
    } catch (e) { /* 解析失败使用默认值 */ }
    inputMin.value = String(min);
    inputSec.value = String(sec);
    refreshAdjustLabel();
    syncChipsActive();
  }

  // —— 事件绑定 ——
  $("btnStart").addEventListener("click", start);
  btnPause.addEventListener("click", togglePause);
  $("btnReset").addEventListener("click", reset);
  timeText.addEventListener("click", togglePause); // 点击大数字 = 暂停 / 继续

  // 预设 chips：点击填入分:秒并高亮
  document.querySelectorAll(".chip").forEach(function (chip) {
    chip.addEventListener("click", function () {
      var mins = Number(chip.dataset.min);
      inputMin.value = String(mins);
      inputSec.value = "0";
      syncChipsActive();
      refreshAdjustLabel();
      inputMin.focus();
      saveSettings();
    });
  });

  // 时间微调按钮：±1 分 / ±10 秒
  document.querySelectorAll(".adj-btn").forEach(function (btn) {
    btn.addEventListener("click", function () {
      ensureAudio();
      adjustTime(Number(btn.dataset.delta));
    });
  });

  // 输入框内容变化：取消预设高亮；秒超 59 自动进位到分
  [inputMin, inputSec].forEach(function (inp) {
    inp.addEventListener("input", function () {
      var sv = parseInt(inputSec.value, 10);
      if (!Number.isNaN(sv) && sv >= 60) {
        var mv = parseInt(inputMin.value, 10);
        if (Number.isNaN(mv)) mv = 0;
        inputMin.value = String(mv + Math.floor(sv / 60));
        inputSec.value = String(sv % 60);
      }
      syncChipsActive();
      refreshAdjustLabel();
    });
    inp.addEventListener("blur", saveSettings);
  });

  // 键盘快捷键：空格 = 暂停 / 继续；R = 重置；Esc = 退出全屏（浏览器自带）
  document.addEventListener("keydown", function (e) {
    if (runScreen.classList.contains("hidden")) return;
    if (e.code === "Space" && e.target.tagName !== "INPUT") {
      e.preventDefault();
      togglePause();
    } else if (e.key === "r" || e.key === "R") {
      if (e.target.tagName !== "INPUT") reset();
    }
  });

  // 页面卸载时清理计时器与音频，杜绝残留
  window.addEventListener("pagehide", function () {
    stopLoop();
    if (audioCtx) {
      try { audioCtx.close(); } catch (e) { /* 忽略 */ }
      audioCtx = null;
    }
  });

  // —— 初始化：恢复上次设置 + 同步站点配色 ——
  loadSettings();
  applyAccent();
  watchAccent();

  /* 舞台右上角工具栏（⛶ 全屏）：全屏目标是 #runScreen 自身；
     本工具是「设置屏 / 运行屏」两屏结构，没有可隐藏的侧边设置栏，故 panelHost 传 null。 */
  if (window.EduToolStageToolbar) {
    window.EduToolStageToolbar.init({ stage: "#runScreen", panelHost: null });
  }
})();
