/**
 * 早读检测 · 早读声音强度可视化
 * 纯前端 IIFE 模块，基于 Web Audio API + getUserMedia 实现麦克风音量检测、
 * 实时波形可视化、声音强度评分与鼓励性提示。
 * 兼容 file:// 协议，无任何外部依赖。
 *
 * 设计参考：classtool.cn/morning-reading-meter/
 */
(function () {
  "use strict";

  /* ============ DOM 元素快捷选取 ============ */
  /** 通过 id 获取 DOM 元素的简写函数 */
  var $ = function (id) { return document.getElementById(id); };

  /** 控制按钮：开始/停止 */
  var startBtn = $("startBtn");
  /** 灵敏度滑块 */
  var sensitivitySlider = $("sensitivity");
  /** 达标阈值滑块 */
  var thresholdSlider = $("threshold");
  /** 灵敏度数值显示 */
  var sensitivityVal = $("sensitivityVal");
  /** 达标阈值数值显示 */
  var thresholdVal = $("thresholdVal");
  /** 评分（0-100）数字显示 */
  var scoreEl = $("score");
  /** 鼓励性状态文字 */
  var statusEl = $("status");
  /** 波形画布 */
  var canvas = $("canvas");
  /** 随声音缩放变色的中心圆环 */
  var ringEl = $("ring");

  /* ============ 音频与运行状态 ============ */
  /** AudioContext 实例，用于音频图构建 */
  var audioCtx = null;
  /** AnalyserNode，提供频域数据 */
  var analyser = null;
  /** 频域数据缓冲（Uint8Array） */
  var dataArray = null;
  /** 麦克风媒体流 */
  var mediaStream = null;
  /** requestAnimationFrame 句柄 */
  var rafId = null;
  /** 是否正在检测 */
  var isRunning = false;

  /* ============ 可调参数 ============ */
  /** 灵敏度系数（1-10），数值越大对声音越敏感 */
  var sensitivity = 5;
  /** 达标阈值（0-100），达到该值视为朗读洪亮 */
  var threshold = 60;

  /* ============ Canvas 2D 上下文 ============ */
  var canvasCtx = canvas.getContext("2d");

  /**
   * 根据 CSS 像素尺寸与设备像素比设置画布物理尺寸
   * 使用 setTransform 避免重复缩放叠加，保证高清屏清晰绘制
   */
  function resizeCanvas() {
    var dpr = window.devicePixelRatio || 1;
    var rect = canvas.getBoundingClientRect();
    canvas.width = Math.max(1, Math.floor(rect.width * dpr));
    canvas.height = Math.max(1, Math.floor(rect.height * dpr));
    canvasCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  /**
   * 启动检测：请求麦克风权限、构建音频图、进入渲染循环
   * 异步函数，失败时给出麦克风权限提示
   */
  async function start() {
    try {
      // 1. 请求麦克风音频流
      mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true });
      // 2. 创建 AudioContext（兼容 webkit 前缀）
      var Ctx = window.AudioContext || window.webkitAudioContext;
      audioCtx = new Ctx();
      // 部分浏览器需手动恢复（自动播放策略）
      if (audioCtx.state === "suspended") { audioCtx.resume(); }
      // 3. 构建音频图：源 -> 分析器（不连 destination，避免回声）
      var source = audioCtx.createMediaStreamSource(mediaStream);
      analyser = audioCtx.createAnalyser();
      analyser.fftSize = 256;
      analyser.smoothingTimeConstant = 0.8;
      source.connect(analyser);
      // 4. 准备频域数据缓冲
      dataArray = new Uint8Array(analyser.frequencyBinCount);
      // 5. 进入运行态
      isRunning = true;
      startBtn.textContent = "⏹ 停止检测";
      statusEl.textContent = "正在检测…";
      statusEl.className = "status";
      loop();
    } catch (err) {
      // 麦克风权限被拒或设备不可用
      statusEl.textContent = "⚠️ 麦克风权限被拒绝，请在浏览器中允许访问后重试";
      statusEl.className = "status error";
      cleanup();
    }
  }

  /**
   * 停止检测：停止渲染循环、关闭媒体流与音频上下文、复位 UI
   */
  function stop() {
    isRunning = false;
    if (rafId) { cancelAnimationFrame(rafId); rafId = null; }
    cleanup();
    startBtn.textContent = "▶ 开始检测";
    statusEl.textContent = "已停止";
    statusEl.className = "status";
    scoreEl.textContent = "0";
    resetRing();
    drawIdleWaveform();
  }

  /**
   * 释放音频资源：停止媒体轨、关闭 AudioContext
   */
  function cleanup() {
    if (mediaStream) {
      mediaStream.getTracks().forEach(function (t) { t.stop(); });
      mediaStream = null;
    }
    if (audioCtx) {
      try { audioCtx.close(); } catch (e) {}
      audioCtx = null;
    }
    analyser = null;
    dataArray = null;
  }

  /**
   * 主渲染循环：每帧读取频域数据、计算评分、更新圆环与波形
   * 通过 requestAnimationFrame 调度自身
   */
  function loop() {
    if (!isRunning || !analyser) return;
    analyser.getByteFrequencyData(dataArray);

    // 计算平均音量并映射为 0-100 评分
    var sum = 0;
    for (var i = 0; i < dataArray.length; i++) { sum += dataArray[i]; }
    var avg = sum / dataArray.length;
    // 灵敏度 5 为基准（×1），最高 ×2，最低 ×0.2
    var rawScore = (avg / 255) * 100 * (sensitivity / 5);
    var score = Math.min(100, Math.max(0, Math.round(rawScore)));

    // 更新 UI 元素
    scoreEl.textContent = score;
    updateStatus(score);
    updateRing(score);
    drawWaveform();

    rafId = requestAnimationFrame(loop);
  }

  /**
   * 根据评分与阈值更新鼓励性状态文字与配色
   * @param {number} score - 当前声音强度评分 0-100
   */
  function updateStatus(score) {
    if (score >= threshold) {
      statusEl.textContent = "🎉 朗读很棒！";
      statusEl.className = "status great";
    } else if (score >= threshold * 0.6) {
      statusEl.textContent = "👍 继续加油！";
      statusEl.className = "status good";
    } else {
      statusEl.textContent = "🔊 声音再大一些";
      statusEl.className = "status low";
    }
  }

  /**
   * 根据评分动态缩放圆环并切换配色（蓝→紫→红）
   * @param {number} score - 当前声音强度评分 0-100
   */
  function updateRing(score) {
    var scale = 0.8 + (score / 100) * 0.45;
    var bg, shadow;
    if (score >= threshold) {
      bg = "var(--ring-red)";
      shadow = "var(--ring-shadow-red)";
    } else if (score >= threshold * 0.6) {
      bg = "var(--ring-purple)";
      shadow = "var(--ring-shadow-purple)";
    } else {
      bg = "var(--ring-blue)";
      shadow = "var(--ring-shadow-blue)";
    }
    ringEl.style.transform = "translate(-50%, -50%) scale(" + scale + ")";
    ringEl.style.background = bg;
    ringEl.style.boxShadow = "0 0 60px " + shadow;
  }

  /** 复位圆环到初始静态状态 */
  function resetRing() {
    ringEl.style.transform = "translate(-50%, -50%) scale(0.8)";
    ringEl.style.background = "var(--ring-blue)";
    ringEl.style.boxShadow = "0 0 60px var(--ring-shadow-blue)";
  }

  /**
   * 在画布上绘制实时频谱柱状图
   * 柱高随频域数据与灵敏度变化，使用黄→粉渐变填充
   */
  function drawWaveform() {
    var w = canvas.clientWidth;
    var h = canvas.clientHeight;
    canvasCtx.clearRect(0, 0, w, h);

    var barCount = 40;
    var slot = w / barCount;
    var barWidth = slot * 0.68;
    var gap = slot - barWidth;
    var sensMul = sensitivity / 5;

    for (var i = 0; i < barCount; i++) {
      var v = dataArray[i % dataArray.length] / 255;
      var barHeight = Math.max(2, v * h * sensMul);
      var x = i * slot + gap / 2;
      var y = (h - barHeight) / 2;

      var grad = canvasCtx.createLinearGradient(0, y, 0, y + barHeight);
      grad.addColorStop(0, "#fbbf24");
      grad.addColorStop(1, "#db2777");
      canvasCtx.fillStyle = grad;
      drawRoundBar(x, y, barWidth, barHeight, barWidth / 2);
    }
  }

  /**
   * 绘制单个圆角柱体（频谱条）
   * @param {number} x - 左上角 x
   * @param {number} y - 左上角 y
   * @param {number} w - 宽度
   * @param {number} h - 高度
   * @param {number} r - 圆角半径
   */
  function drawRoundBar(x, y, w, h, r) {
    r = Math.min(r, w / 2, h / 2);
    canvasCtx.beginPath();
    canvasCtx.moveTo(x + r, y);
    canvasCtx.arcTo(x + w, y, x + w, y + h, r);
    canvasCtx.arcTo(x + w, y + h, x, y + h, r);
    canvasCtx.arcTo(x, y + h, x, y, r);
    canvasCtx.arcTo(x, y, x + w, y, r);
    canvasCtx.closePath();
    canvasCtx.fill();
  }

  /** 清空画布（停止状态下的静态展示） */
  function drawIdleWaveform() {
    var w = canvas.clientWidth;
    var h = canvas.clientHeight;
    canvasCtx.clearRect(0, 0, w, h);
    canvasCtx.fillStyle = "rgba(255,255,255,0.25)";
    canvasCtx.font = "14px sans-serif";
    canvasCtx.textAlign = "center";
    canvasCtx.textBaseline = "middle";
    canvasCtx.fillText("点击「开始检测」查看实时波形", w / 2, h / 2);
  }

  /** 全屏状态变化时重新测量画布尺寸（全屏进出由共享模块 tool-stage-toolbar.js 接管） */
  function onFullscreenChange() {
    setTimeout(resizeCanvas, 60);
  }

  /* ============ 事件绑定 ============ */
  // 开始/停止按钮
  startBtn.addEventListener("click", function () {
    if (isRunning) { stop(); } else { start(); }
  });
  // 全屏状态变化：重测画布
  document.addEventListener("fullscreenchange", onFullscreenChange);
  document.addEventListener("webkitfullscreenchange", onFullscreenChange);
  // 灵敏度调节
  sensitivitySlider.addEventListener("input", function (e) {
    sensitivity = parseFloat(e.target.value);
    sensitivityVal.textContent = sensitivity.toFixed(1);
  });
  // 达标阈值调节
  thresholdSlider.addEventListener("input", function (e) {
    threshold = parseInt(e.target.value, 10);
    thresholdVal.textContent = threshold;
  });
  // 窗口尺寸变化时重置画布
  window.addEventListener("resize", resizeCanvas);

  /* ============ 初始化 ============ */
  resizeCanvas();
  drawIdleWaveform();

  /* 舞台工具栏：⛶ 对 .display 自身全屏，⚙ 收起页面上方的设置卡（main.main > .settings）。
     交互与全屏状态回滚均由共享模块 tool-stage-toolbar.js 提供。 */
  if (window.EduToolStageToolbar) {
    window.EduToolStageToolbar.init({
      stage: ".display",
      panelHost: "main.main",
      hiddenClass: "setup-hidden"
    });
  }
})();
