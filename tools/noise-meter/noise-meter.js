/**
 * 课堂噪音计 noise-meter.js
 * - IIFE 模块，纯前端实现，无外部依赖
 * - 使用 Web Audio API + getUserMedia 实时采集麦克风音量
 * - 计算分贝参考值，更新圆环进度、分贝大字、状态文字
 * - 超阈值时屏幕变红脉动 + 提示音 + 文字"太吵了！"
 * - 全屏模式（Fullscreen API）、超标记录、权限被拒绝友好提示
 * - 兼容 file:// 协议：不依赖任何 CDN，所有逻辑本地运行
 */
(function () {
  "use strict";

  /* —— DOM 元素引用（缓存以避免重复查询） —— */
  const $ = function (id) { return document.getElementById(id); };
  const dbValueEl   = $("dbValue");          // 分贝大字
  const dbLabelEl   = $("dbLabel");          // 圆环下方标签
  const ringFgEl   = $("ringFg");            // 圆环前景圆
  const statusEl   = $("status");            // 状态文字
  const startBtn   = $("startBtn");         // 开始/停止按钮
  const fsBtn      = $("fullscreenBtn");    // 全屏按钮
  const thInput    = $("threshold");        // 阈值滑块
  const thValueEl  = $("thresholdValue");   // 阈值数值显示
  const meterPanel = $("meterPanel");       // 主显示面板（用于切换颜色态）
  const permTip    = $("permissionTip");    // 麦克风权限被拒绝友好提示
  const recordsList = $("recordsList");     // 超标记录列表
  const clearBtn   = $("clearRecords");     // 清空记录按钮

  /* —— 运行时状态 —— */
  var audioCtx = null;        // AudioContext 实例
  var analyser = null;        // AnalyserNode 用于读取频域数据
  var freqData = null;        // Uint8Array 缓存频域数据
  var micStream = null;       // 麦克风 MediaStream
  var rafId = null;           // requestAnimationFrame 句柄
  var running = false;        // 是否正在监测
  var lastBeepTime = 0;       // 上一次提示音时间戳（用于节流）
  var overThresholdStart = 0; // 当前连续超阈值的起始时间戳
  var records = [];           // 超标记录数组 [{ time, db }]

  /* —— 圆环周长常量（半径 r=100，周长 = 2πr） —— */
  var RING_RADIUS = 100;
  var RING_CIRCUM = 2 * Math.PI * RING_RADIUS; // ≈ 628.3185

  /**
   * 启动麦克风监测
   * - 调用 getUserMedia 申请麦克风权限
   * - 创建 AudioContext + AnalyserNode，连接麦克风源
   * - 启动 requestAnimationFrame 循环
   * 异常场景：权限被拒绝 / 浏览器不支持时显示友好提示
   */
  async function start() {
    // 浏览器能力检测
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      showPermissionTip("当前浏览器不支持麦克风访问，请使用 Chrome / Edge 最新版。");
      return;
    }
    if (!window.AudioContext && !window.webkitAudioContext) {
      showPermissionTip("当前浏览器不支持 Web Audio API，请升级浏览器。");
      return;
    }
    try {
      // 申请麦克风权限（仅音频，避免视频开销）
      micStream = await navigator.mediaDevices.getUserMedia({ audio: true });

      // 隐藏权限被拒绝提示（如果之前显示过）
      hidePermissionTip();

      // 创建 AudioContext 与 AnalyserNode
      var Ctx = window.AudioContext || window.webkitAudioContext;
      audioCtx = new Ctx();
      var source = audioCtx.createMediaStreamSource(micStream);
      analyser = audioCtx.createAnalyser();
      analyser.fftSize = 256;                      // 256 -> frequencyBinCount = 128
      analyser.smoothingTimeConstant = 0.6;        // 平滑系数，避免数值抖动
      source.connect(analyser);
      freqData = new Uint8Array(analyser.frequencyBinCount);

      running = true;
      startBtn.textContent = "■ 停止监测";
      startBtn.classList.add("running");
      statusEl.textContent = "正在监测…";
      statusEl.className = "status";

      loop();
    } catch (err) {
      // 区分用户拒绝权限与其他异常
      var name = err && err.name ? err.name : "";
      if (name === "NotAllowedError" || name === "SecurityError") {
        showPermissionTip("您已拒绝麦克风权限。请在浏览器地址栏左侧 🔒 图标中重新允许，然后重试。");
      } else if (name === "NotFoundError" || name === "OverconstrainedError") {
        showPermissionTip("未检测到可用的麦克风设备，请检查设备连接后重试。");
      } else {
        showPermissionTip("麦克风访问失败：" + (err && err.message ? err.message : "未知错误"));
      }
    }
  }

  /**
   * 停止监测
   * - 取消动画帧
   * - 关闭 MediaStream 与 AudioContext
   * - 复位按钮、状态文字、面板颜色
   */
  function stop() {
    running = false;
    if (rafId) { cancelAnimationFrame(rafId); rafId = null; }
    if (micStream) { micStream.getTracks().forEach(function (t) { t.stop(); }); micStream = null; }
    if (audioCtx) { audioCtx.close(); audioCtx = null; }
    analyser = null;
    freqData = null;

    startBtn.textContent = "▶ 开始监测";
    startBtn.classList.remove("running");
    statusEl.textContent = "已停止监测";
    statusEl.className = "status";
    meterPanel.classList.remove("warn", "danger");
    document.body.classList.remove("danger-overlay");
    overThresholdStart = 0;
    // 复位圆环与数值
    dbValueEl.textContent = "0";
    ringFgEl.style.strokeDashoffset = RING_CIRCUM;
  }

  /**
   * 主循环：每帧读取频域数据并更新 UI
   * - 计算平均振幅，映射为 0-100 的相对分贝值
   * - 更新圆环进度、分贝大字、状态文字
   * - 判定是否超阈值，触发红色脉动 / 提示音 / 记录
   */
  function loop() {
    if (!running || !analyser) return;
    analyser.getByteFrequencyData(freqData);

    // 取有效频段的平均振幅（跳过过低频段以减少低频噪声干扰）
    var sum = 0, count = 0;
    for (var i = 2; i < freqData.length; i++) {
      sum += freqData[i];
      count++;
    }
    var avg = count > 0 ? sum / count : 0;

    // 将 0-255 振幅映射为 0-100 相对分贝参考值
    // 注：受麦克风灵敏度差异影响，本值为相对参考，并非标准声学 dB
    var db = Math.round(avg * (100 / 255));

    // 更新分贝大字与圆环进度
    dbValueEl.textContent = db;
    var ratio = Math.max(0, Math.min(1, db / 100));
    ringFgEl.style.strokeDashoffset = String(RING_CIRCUM * (1 - ratio));

    // 读取阈值（每次读取以支持运行中调节）
    var th = parseInt(thInput.value, 10) || 0;

    // 状态分级：正常 / 接近阈值（差 ≤ 5）/ 超阈值
    if (db >= th) {
      // 超阈值：红色脉动 + 提示音 + 文字"太吵了！"
      meterPanel.classList.remove("warn");
      meterPanel.classList.add("danger");
      statusEl.textContent = "⚠️ 太吵了！请保持安静";
      statusEl.className = "status danger";
      document.body.classList.add("danger-overlay");

      // 提示音节流：每 2 秒触发一次
      var now = Date.now();
      if (now - lastBeepTime > 2000) {
        lastBeepTime = now;
        playAlarmBeep();
      }
      // 记录超标事件：仅在从正常态进入超标态时记录一次
      if (overThresholdStart === 0) {
        overThresholdStart = now;
        addRecord(db);
      }
    } else if (db >= th - 5) {
      // 接近阈值：黄色警告
      meterPanel.classList.remove("danger");
      meterPanel.classList.add("warn");
      statusEl.textContent = "⚠️ 接近阈值，请降低音量";
      statusEl.className = "status warn";
      document.body.classList.remove("danger-overlay");
      overThresholdStart = 0;
    } else {
      // 正常：绿色
      meterPanel.classList.remove("warn", "danger");
      statusEl.textContent = "✓ 音量正常";
      statusEl.className = "status";
      document.body.classList.remove("danger-overlay");
      overThresholdStart = 0;
    }

    rafId = requestAnimationFrame(loop);
  }

  /**
   * 播放超标提示音
   * - 使用 Web Audio API 合成短促双音（不依赖外部音频文件）
   * - 异常静默处理，避免影响主流程
   */
  function playAlarmBeep() {
    try {
      var ctx = new (window.AudioContext || window.webkitAudioContext)();
      var freqs = [880, 660]; // 两段不同频率构成报警节奏
      freqs.forEach(function (f, i) {
        var osc = ctx.createOscillator();
        var gain = ctx.createGain();
        osc.type = "square";
        osc.frequency.value = f;
        var t = ctx.currentTime + i * 0.18;
        gain.gain.setValueAtTime(0.18, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.16);
        osc.connect(gain).connect(ctx.destination);
        osc.start(t);
        osc.stop(t + 0.16);
      });
    } catch (e) {
      // 忽略音频播放失败
    }
  }

  /**
   * 添加超标记录
   * - 在记录列表顶部插入新条目，限制最多 50 条
   * @param {number} db 超标时的分贝值
   */
  function addRecord(db) {
    var now = new Date();
    var timeStr = now.toLocaleTimeString("zh-CN", { hour12: false });
    records.unshift({ time: timeStr, db: db });
    if (records.length > 50) records.length = 50;
    renderRecords();
  }

  /**
   * 渲染超标记录列表
   * - 空列表显示"暂无超标记录"
   * - 非空列表按时间倒序展示
   */
  function renderRecords() {
    if (!records.length) {
      recordsList.innerHTML = '<div class="empty">暂无超标记录</div>';
      return;
    }
    recordsList.innerHTML = records.map(function (r) {
      return '<div class="record-item">'
        + '<span class="rec-time">' + r.time + '</span>'
        + '<span class="rec-db">' + r.db + ' dB</span>'
        + '</div>';
    }).join("");
  }

  /**
   * 显示麦克风权限被拒绝/不可用友好提示
   * @param {string} msg 自定义提示文字
   */
  function showPermissionTip(msg) {
    var p = permTip.querySelector("p");
    if (p && msg) p.textContent = msg;
    permTip.hidden = false;
  }

  /**
   * 隐藏麦克风权限提示
   */
  function hidePermissionTip() {
    permTip.hidden = true;
  }

  /**
   * 切换全屏模式
   * - 使用 Fullscreen API，兼容 webkit 前缀
   * - 进入全屏时放大主显示，隐藏辅助说明（由 CSS 控制）
   */
  function toggleFullscreen() {
    var el = document.documentElement;
    var isFs = document.fullscreenElement || document.webkitFullscreenElement;
    if (!isFs) {
      if (el.requestFullscreen) el.requestFullscreen();
      else if (el.webkitRequestFullscreen) el.webkitRequestFullscreen();
    } else {
      if (document.exitFullscreen) document.exitFullscreen();
      else if (document.webkitExitFullscreen) document.webkitExitFullscreen();
    }
  }

  /* —— 事件绑定 —— */

  // 开始/停止监测按钮
  startBtn.addEventListener("click", function () {
    if (running) stop(); else start();
  });

  // 全屏按钮
  fsBtn.addEventListener("click", toggleFullscreen);

  // 阈值滑块：实时更新数值显示
  thInput.addEventListener("input", function () {
    thValueEl.textContent = thInput.value;
  });

  // 清空超标记录
  clearBtn.addEventListener("click", function () {
    records = [];
    renderRecords();
  });

  /* —— 初始化 —— */
  // 初始化圆环周长与偏移
  ringFgEl.style.strokeDasharray = String(RING_CIRCUM);
  ringFgEl.style.strokeDashoffset = String(RING_CIRCUM);
  // 初始化阈值数值显示
  thValueEl.textContent = thInput.value;
  renderRecords();
})();
