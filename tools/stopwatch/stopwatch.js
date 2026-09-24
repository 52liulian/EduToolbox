/**
 * ============================================================================
 * 课堂秒表 stopwatch.js
 * ----------------------------------------------------------------------------
 * 功能描述：
 *   1. 高精度毫秒级正计时（基于 performance.now() 计时，毫秒级精度）
 *   2. 开始 / 暂停 / 继续 同一按钮切换文字与配色
 *   3. 计次（lap）记录当前时间点 + 与上一次计次的差值（间隔）
 *   4. 重置归零并清空所有计次记录
 *   5. 全屏模式（Fullscreen API，含 webkit 前缀兼容）
 *   6. 键盘快捷键：Space 开始/暂停、L 计次、R 重置
 *   7. 计次列表自动标注最快（绿）/ 最慢（红）计次
 *   8. 计次记录导出为 CSV 文件（含 BOM 防 Excel 中文乱码）
 *
 * 模块形式：纯前端 IIFE 立即执行函数，无外部依赖
 * 协议兼容：file:// 直接双击打开可用，不使用 fetch / Worker / import
 * 异常场景：
 *   - 浏览器不支持 Fullscreen API → 全屏按钮优雅降级，不影响计时
 *   - performance.now 缺失 → 回退到 Date.now()
 *   - 切换标签页导致 RAF 暂停 → 回到前台时基于时间戳重新对齐，时间不丢
 * ============================================================================
 */
(function () {
  'use strict';

  /* ========================================================================
   * 一、常量与状态定义
   * ====================================================================== */

  /** 1 秒 = 1000 毫秒 */
  var MS_PER_SEC = 1000;
  /** 1 分钟 = 60 秒 */
  var MS_PER_MIN = 60 * MS_PER_SEC;
  /** 1 小时 = 60 分钟 */
  var MS_PER_HOUR = 60 * MS_PER_MIN;

  /** 运行状态枚举 */
  var STATE = { IDLE: 'idle', RUNNING: 'running', PAUSED: 'paused' };

  /* ========================================================================
   * 二、计时状态变量（模块私有，闭包内）
   * ====================================================================== */

  /** 当前运行状态 */
  var state = STATE.IDLE;
  /** performance.now() 基准时刻（每次开始/继续时重置） */
  var baseTime = 0;
  /** 累计已计时毫秒数（暂停时累加，重置时清零） */
  var elapsed = 0;
  /** requestAnimationFrame 句柄，null 表示未在循环 */
  var rafId = null;
  /** 上一次计次时间点（毫秒），用于计算本次计次的差值 */
  var lastLapTime = 0;
  /** 计次记录数组：[{ idx:序号, time:总时间, diff:间隔 }] */
  var laps = [];

  /* ========================================================================
   * 三、DOM 引用缓存（避免反复查询）
   * ====================================================================== */

  /**
   * 按 id 获取 DOM 元素的简写
   * @param {string} id - 元素 id（不带 #）
   * @returns {HTMLElement|null} 对应 DOM 元素，未找到返回 null
   */
  var $ = function (id) { return document.getElementById(id); };

  var display = $('display');        // 时间显示容器
  var statusEl = $('status');        // 状态提示文字
  var startBtn = $('startBtn');      // 开始/暂停按钮
  var lapBtn = $('lapBtn');          // 计次按钮
  var resetBtn = $('resetBtn');      // 重置按钮
  var exportBtn = $('exportBtn');    // 导出 CSV 按钮
  var lapsList = $('lapsList');      // 计次列表 ul
  var lapsPanel = $('lapsPanel');    // 计次面板容器（用于全屏时判断是否隐藏）

  // 缓存时间显示的两个 span，避免每帧 querySelector
  var timeMainEl = display ? display.querySelector('.time-main') : null;
  var timeMsEl = display ? display.querySelector('.time-ms') : null;

  /* ========================================================================
   * 四、时间格式化与渲染
   * ====================================================================== */

  /**
   * 获取当前累计已计时毫秒数
   * 运行中：累计已暂停时间 + (当前 performance.now - 基准时刻)
   * 非运行：直接返回累计已计时时间
   * @returns {number} 当前累计已计时毫秒数
   */
  function getCurrentElapsed() {
    if (state === STATE.RUNNING) {
      return elapsed + (now() - baseTime);
    }
    return elapsed;
  }

  /**
   * 获取高精度时间戳，自动回退到 Date.now
   * @returns {number} 高精度时间戳（毫秒）
   */
  function now() {
    return (typeof performance !== 'undefined' && performance.now)
      ? performance.now()
      : Date.now();
  }

  /**
   * 把毫秒数格式化为 { main, ms } 结构
   * 不足 1 小时显示 MM:SS，达到 1 小时显示 HH:MM:SS
   * @param {number} ms - 毫秒数（负值会被钳为 0）
   * @returns {{main:string, ms:string}} main=主体时间(如 "01:23")，ms=毫秒位(如 ".456")
   */
  function formatTime(ms) {
    if (!isFinite(ms) || ms < 0) ms = 0;
    var h = Math.floor(ms / MS_PER_HOUR);
    var m = Math.floor((ms % MS_PER_HOUR) / MS_PER_MIN);
    var s = Math.floor((ms % MS_PER_MIN) / MS_PER_SEC);
    var millis = Math.floor(ms % MS_PER_SEC);

    /** 左侧补零辅助 */
    var pad = function (n, len) { return String(n).padStart(len, '0'); };

    var main = (h > 0)
      ? (pad(h, 2) + ':' + pad(m, 2) + ':' + pad(s, 2))
      : (pad(m, 2) + ':' + pad(s, 2));
    return { main: main, ms: '.' + pad(millis, 3) };
  }

  /**
   * 把毫秒数格式化为完整字符串（用于计次列表与 CSV）
   * @param {number} ms - 毫秒数
   * @returns {string} 形如 "00:00.000" 或 "01:23:45.678"
   */
  function formatFull(ms) {
    var p = formatTime(ms);
    return p.main + p.ms;
  }

  /**
   * 渲染时间显示区（每帧调用）
   * @returns {void}
   */
  function renderDisplay() {
    var p = formatTime(getCurrentElapsed());
    if (timeMainEl) timeMainEl.textContent = p.main;
    if (timeMsEl) timeMsEl.textContent = p.ms;
  }

  /* ========================================================================
   * 五、计时核心控制
   * ====================================================================== */

  /**
   * requestAnimationFrame 主循环，运行时持续刷新显示
   * @returns {void}
   */
  function loop() {
    if (state !== STATE.RUNNING) return;
    renderDisplay();
    rafId = requestAnimationFrame(loop);
  }

  /**
   * 开始或继续计时
   * 状态切换：IDLE/PAUSED → RUNNING
   * @returns {void}
   */
  function start() {
    if (state === STATE.RUNNING) return;
    baseTime = now();
    state = STATE.RUNNING;
    startBtn.textContent = '暂停';
    startBtn.classList.add('is-running');
    lapBtn.disabled = false;
    statusEl.textContent = '计时中…';
    statusEl.className = 'status running';
    loop();
  }

  /**
   * 暂停计时，累计已运行时间
   * 状态切换：RUNNING → PAUSED
   * @returns {void}
   */
  function pause() {
    if (state !== STATE.RUNNING) return;
    elapsed += now() - baseTime;
    state = STATE.PAUSED;
    if (rafId) { cancelAnimationFrame(rafId); rafId = null; }
    startBtn.textContent = '继续';
    startBtn.classList.remove('is-running');
    lapBtn.disabled = true;
    statusEl.textContent = '已暂停';
    statusEl.className = 'status paused';
    renderDisplay();
  }

  /**
   * 切换开始/暂停状态
   * @returns {void}
   */
  function toggleStart() {
    if (state === STATE.RUNNING) {
      pause();
    } else {
      start();
    }
  }

  /**
   * 重置秒表到初始状态并清空计次记录
   * 状态切换：任意 → IDLE
   * @returns {void}
   */
  function reset() {
    if (rafId) { cancelAnimationFrame(rafId); rafId = null; }
    state = STATE.IDLE;
    elapsed = 0;
    baseTime = 0;
    lastLapTime = 0;
    laps = [];
    startBtn.textContent = '开始';
    startBtn.classList.remove('is-running');
    lapBtn.disabled = true;
    exportBtn.disabled = true;
    statusEl.textContent = '准备就绪';
    statusEl.className = 'status';
    renderDisplay();
    renderLaps();
  }

  /* ========================================================================
   * 六、计次（lap）记录
   * ====================================================================== */

  /**
   * 记录一次计次
   * 仅在运行状态下有效；记录当前时间与距离上一次计次的差值
   * 异常场景：非运行状态下调用直接 return，不产生记录
   * @returns {void}
   */
  function lap() {
    if (state !== STATE.RUNNING) return;
    var t = getCurrentElapsed();
    laps.push({
      idx: laps.length + 1,
      time: t,
      diff: t - lastLapTime
    });
    lastLapTime = t;
    exportBtn.disabled = false;
    renderLaps();
  }

  /**
   * 渲染计次列表
   * - 倒序显示（最新在顶部）
   * - 计次数量 ≥ 2 时，自动标注最快(绿) / 最慢(红) 计次
   * - 无记录时显示空状态文案
   * @returns {void}
   */
  function renderLaps() {
    if (laps.length === 0) {
      lapsList.innerHTML = '<li class="state state--list-item state--empty"><div class="state-icon">⏱️</div><div class="state-title">暂无计次记录</div></li>';
      lapsPanel.classList.remove('has-laps');
      return;
    }
    lapsPanel.classList.add('has-laps');

    // 计算最快/最慢（基于 diff 间隔）
    var fastestIdx = -1, slowestIdx = -1;
    if (laps.length >= 2) {
      var minDiff = Infinity, maxDiff = -Infinity;
      for (var i = 0; i < laps.length; i++) {
        var d = laps[i].diff;
        if (d < minDiff) { minDiff = d; fastestIdx = i; }
        if (d > maxDiff) { maxDiff = d; slowestIdx = i; }
      }
    }

    // 倒序拼接 HTML
    var html = '';
    for (var j = laps.length - 1; j >= 0; j--) {
      var item = laps[j];
      var cls = 'lap-item';
      if (j === fastestIdx) cls += ' fastest';
      else if (j === slowestIdx) cls += ' slowest';
      html += '<li class="' + cls + '">' +
              '<span class="lap-idx">#' + item.idx + '</span>' +
              '<span class="lap-time">' + formatFull(item.time) + '</span>' +
              '<span class="lap-diff">+' + formatFull(item.diff) + '</span>' +
              '</li>';
    }
    lapsList.innerHTML = html;
  }

  /* ========================================================================
   * 七、CSV 导出
   * ====================================================================== */

  /**
   * 导出计次记录为 CSV 文件并触发下载
   * 文件名带时间戳避免覆盖；加 BOM 头防止 Excel 中文乱码
   * 异常场景：无计次记录时直接 return；浏览器不支持 Blob 则静默失败
   * @returns {void}
   */
  function exportCSV() {
    if (laps.length === 0) return;
    var rows = ['序号,计次时间,间隔时间(差值)'];
    for (var i = 0; i < laps.length; i++) {
      var it = laps[i];
      rows.push(it.idx + ',' + formatFull(it.time) + ',+' + formatFull(it.diff));
    }
    var csv = rows.join('\n');

    // 兼容性检查：无 Blob 时静默退出
    if (typeof Blob === 'undefined') return;

    // \ufeff 为 BOM 头，确保 Excel 正确识别 UTF-8
    var blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = '秒表计次记录_' + Date.now() + '.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    // 释放对象 URL，避免内存泄漏
    setTimeout(function () { URL.revokeObjectURL(url); }, 0);
  }

  /* ========================================================================
   * 八、全屏模式
   *
   * ⛶ 全屏由共享模块 assets/js/tool-stage-toolbar.js 统一接管：
   * 全屏目标是 #stage 自身（而非整页），本工具没有可隐藏的设置栏，
   * 因此只接全屏、不做显隐。见 IIFE 末尾的 EduToolStageToolbar.init()。
   * ====================================================================== */

  /* ========================================================================
   * 九、键盘控制
   * ====================================================================== */

  /**
   * 键盘事件处理
   * Space → 开始/暂停；L → 计次；R → 重置
   * 忽略输入框中的按键避免误触
   * @param {KeyboardEvent} e - 键盘事件对象
   * @returns {void}
   */
  function onKeydown(e) {
    // 在输入框中按键不响应快捷键
    var tag = (e.target && e.target.tagName) || '';
    if (tag === 'INPUT' || tag === 'TEXTAREA') return;

    switch (e.code) {
      case 'Space':
      case ' ':
        e.preventDefault();
        toggleStart();
        break;
      case 'KeyL':
        e.preventDefault();
        lap();
        break;
      case 'KeyR':
        e.preventDefault();
        reset();
        break;
    }
  }

  /* ========================================================================
   * 十、事件绑定与初始化
   * ====================================================================== */

  // 防御性检查：避免 DOM 缺失时报错
  if (startBtn) startBtn.addEventListener('click', toggleStart);
  if (lapBtn) lapBtn.addEventListener('click', lap);
  if (resetBtn) resetBtn.addEventListener('click', reset);
  if (exportBtn) exportBtn.addEventListener('click', exportCSV);
  document.addEventListener('keydown', onKeydown);

  // 初始化渲染（显示 00:00.000）
  renderDisplay();

  /* 舞台右上角工具栏（⛶ 全屏）：全屏目标是 #stage 自身；
     秒表没有可隐藏的设置栏（计次面板是全屏时被裁掉的兄弟栏，隐藏后无法调回），
     故 panelHost 传 null。 */
  if (window.EduToolStageToolbar) {
    window.EduToolStageToolbar.init({ stage: '#stage', panelHost: null });
  }
})();
