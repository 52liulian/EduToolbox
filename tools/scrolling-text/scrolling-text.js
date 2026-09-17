/* ====================================================================
 * 早读滚动 (scrolling-text.js)
 * 功能：文本从下往上（或反向）平滑滚动，支持字号/行高/字体/颜色/对齐/
 *       速度/主题/循环/反向/全屏，纯前端 IIFE 模块。
 * 兼容：file:// 协议，无任何外部依赖
 * ==================================================================== */
(function () {
  'use strict';

  /* ---------- 工具函数 ---------- */

  /**
   * 按元素 id 简写获取（DOM 元素引用）
   * @param {string} id - 元素 id
   * @returns {HTMLElement} 目标 DOM 元素
   */
  const $ = (id) => document.getElementById(id);

  /**
   * 预设速度档位映射表（单位：px/秒）
   * 1=慢 2=中 3=快 4=极快 5=极速
   */
  const SPEED_MAP = { 1: 25, 2: 50, 3: 90, 4: 150, 5: 240 };

  /* ---------- 状态 ---------- */
  let running = false;        // 是否正在滚动
  let rafId = null;           // rAF 句柄
  let lastTs = 0;              // 上一帧时间戳（用于计算 delta）
  let offset = 0;              // 当前滚动偏移（单位 px）
  let totalDistance = 0;       // 单程滚动距离 = stageH + textH
  let stageH = 0;              // 舞台高度
  let textH = 0;               // 文本块高度
  let curSpeed = SPEED_MAP[2]; // 当前速度 px/s

  /* ---------- DOM 引用 ---------- */
  const stage = $('stage');
  const stageInner = $('stageInner');
  const scrollText = $('scrollText');
  const panel = $('panel');
  const textArea = $('text');
  const startBtn = $('startBtn');
  const resetBtn = $('resetBtn');
  const fullBtn = $('fullBtn');
  const speedRange = $('speed');
  const speedMarks = document.querySelectorAll('.speed-marks span');
  const durationEl = $('duration');
  const fontVal = $('fontVal');
  const lhVal = $('lhVal');
  const fontFamily = $('fontFamily');
  const colorEl = $('color');
  const bgColorEl = $('bgColor');
  const loopEl = $('loop');
  const reverseEl = $('reverse');
  const themeRow = $('themeRow');
  const alignSeg = $('alignSeg');
  const panelToggle = $('panelToggle');

  /* ---------- 主题预设 ---------- */
  const THEMES = {
    white:   { color: '#1a1a1a', bg: '#ffffff', dark: false },
    black:   { color: '#f5f5f5', bg: '#0e0e10', dark: true },
    green:   { color: '#e6f4d0', bg: '#1f3a25', dark: true },
    warm:    { color: '#3a2a1a', bg: '#f7e7c4', dark: false },
    vintage: { color: '#3b2f1e', bg: '#e8d8a8', dark: false }
  };

  /* ---------- 核心逻辑 ---------- */

  /**
   * 应用文本内容到滚动块，并同步测量尺寸、计算预计时长
   * @returns {void}
   */
  function applyText() {
    scrollText.textContent = textArea.value || '（请输入要滚动的文本）';
    measure();
    updateDuration();
  }

  /**
   * 测量舞台与文本块尺寸，计算单程滚动距离
   * @returns {void}
   */
  function measure() {
    stageH = stageInner.clientHeight;
    textH = scrollText.offsetHeight;
    totalDistance = stageH + textH;
  }

  /**
   * 应用外观样式（字号/行高/字体/对齐/颜色/背景）
   * @returns {void}
   */
  function applyStyles() {
    scrollText.style.fontSize = fontVal.textContent + 'px';
    scrollText.style.lineHeight = lhVal.textContent;
    scrollText.style.fontFamily = fontFamily.value;
    scrollText.style.color = colorEl.value;
    stage.style.background = bgColorEl.value;
  }

  /**
   * 应用速度档位，更新 UI 高亮与状态，重算预计时长
   * @returns {void}
   */
  function applySpeed() {
    const v = parseInt(speedRange.value, 10) || 2;
    curSpeed = SPEED_MAP[v] || SPEED_MAP[2];
    speedMarks.forEach((el) => {
      el.classList.toggle('on', parseInt(el.dataset.speed, 10) === v);
    });
    updateDuration();
  }

  /**
   * 计算并显示预计滚动时长（基于当前速度与总距离）
   * @returns {void}
   */
  function updateDuration() {
    if (!totalDistance || !curSpeed) { durationEl.textContent = '--'; return; }
    const sec = totalDistance / curSpeed;
    durationEl.textContent = formatTime(sec);
  }

  /**
   * 把秒数格式化成 mm:ss
   * @param {number} sec - 秒
   * @returns {string} 格式化后的时间字符串
   */
  function formatTime(sec) {
    const m = Math.floor(sec / 60);
    const s = Math.round(sec % 60);
    return (m < 10 ? '0' + m : m) + ':' + (s < 10 ? '0' + s : s);
  }

  /**
   * 重新定位文本到起始位置
   * - 正向：文本位于舞台下方（translateY(stageH)）
   * - 反向：文本位于舞台上方（translateY(-textH)）
   * @returns {void}
   */
  function placeAtStart() {
    measure();
    offset = reverseEl.checked ? -textH : stageH;
    scrollText.style.transform = 'translateY(' + offset + 'px)';
  }

  /**
   * rAF 每帧回调：根据 delta 时间推进 offset，处理边界与循环
   * @param {number} ts - 时间戳
   * @returns {void}
   */
  function tick(ts) {
    if (!running) return;
    if (!lastTs) lastTs = ts;
    const dt = (ts - lastTs) / 1000;
    lastTs = ts;

    const step = curSpeed * dt;
    if (reverseEl.checked) {
      // 反向：从上往下
      offset += step;
      if (offset >= stageH) {
        if (loopEl.checked) { offset = -textH; }
        else { finish(); return; }
      }
    } else {
      // 正向：从下往上
      offset -= step;
      if (offset <= -textH) {
        if (loopEl.checked) { offset = stageH; }
        else { finish(); return; }
      }
    }
    scrollText.style.transform = 'translateY(' + offset + 'px)';
    rafId = requestAnimationFrame(tick);
  }

  /**
   * 完成单程滚动后停止
   * @returns {void}
   */
  function finish() {
    running = false;
    stage.classList.remove('running');
    startBtn.textContent = '▶ 开始滚动 (空格)';
    cancelAnimationFrame(rafId);
    rafId = null;
    lastTs = 0;
  }

  /**
   * 开始 / 暂停滚动
   * @returns {void}
   */
  function toggleRun() {
    if (!running) {
      measure();
      if (!reverseEl.checked && offset <= -textH) offset = stageH;
      if (reverseEl.checked && offset >= stageH) offset = -textH;
      running = true;
      stage.classList.add('running');
      startBtn.textContent = '⏸ 暂停滚动 (空格)';
      lastTs = 0;
      rafId = requestAnimationFrame(tick);
    } else {
      finish();
    }
  }

  /**
   * 重置：停止滚动并回到起始位置
   * @returns {void}
   */
  function reset() {
    finish();
    placeAtStart();
  }

  /**
   * 应用预设主题（设置颜色与背景，同步色板 UI）
   * @param {string} key - 主题 key（white/black/green/warm/vintage）
   * @returns {void}
   */
  function applyTheme(key) {
    const t = THEMES[key];
    if (!t) return;
    colorEl.value = t.color;
    bgColorEl.value = t.bg;
    stage.classList.toggle('dark-theme', t.dark);
    applyStyles();
    themeRow.querySelectorAll('.theme-chip').forEach((el) => {
      el.classList.toggle('active', el.dataset.theme === key);
    });
  }

  /**
   * 调整字号（+/-）
   * @param {number} delta - 增量（正加负减）
   * @returns {void}
   */
  function adjustFont(delta) {
    let v = parseInt(fontVal.textContent, 10) + delta;
    v = Math.max(24, Math.min(180, v));
    fontVal.textContent = v;
    applyStyles();
    applyText();
  }

  /**
   * 调整行高（+/-0.1）
   * @param {number} delta - 增量
   * @returns {void}
   */
  function adjustLh(delta) {
    let v = parseFloat(lhVal.textContent) + delta;
    v = Math.round(v * 10) / 10;
    v = Math.max(1.0, Math.min(3.0, v));
    lhVal.textContent = v.toFixed(1);
    applyStyles();
    applyText();
  }

  /**
   * 设置对齐方式
   * @param {string} align - left/center/right
   * @returns {void}
   */
  function setAlign(align) {
    scrollText.style.textAlign = align;
    alignSeg.querySelectorAll('.seg-btn').forEach((el) => {
      el.classList.toggle('active', el.dataset.align === align);
    });
  }

  /**
   * 切换全屏模式
   * @returns {void}
   */
  function toggleFullscreen() {
    if (!document.fullscreenElement) {
      (document.documentElement.requestFullscreen?.() || Promise.reject()).catch(() => {});
    } else {
      document.exitFullscreen?.();
    }
  }

  /* ---------- 事件绑定 ---------- */

  // 文本输入实时同步
  textArea.addEventListener('input', () => { applyText(); placeAtStart(); });
  // 清空 / 恢复默认
  $('clearBtn').addEventListener('click', () => { textArea.value = ''; applyText(); placeAtStart(); });
  $('defaultBtn').addEventListener('click', () => {
    textArea.value = '朝辞白帝彩云间，\n千里江陵一日还。\n两岸猿声啼不住，\n轻舟已过万重山。\n\n日照香炉生紫烟，\n遥看瀑布挂前川。\n飞流直下三千尺，\n疑是银河落九天。\n\n鹅鹅鹅，\n曲项向天歌。\n白毛浮绿水，\n红掌拨清波。';
    applyText();
    placeAtStart();
  });

  // 播放控制
  startBtn.addEventListener('click', toggleRun);
  resetBtn.addEventListener('click', reset);
  fullBtn.addEventListener('click', toggleFullscreen);
  // 反向 / 循环切换后回到起点
  loopEl.addEventListener('change', () => {});
  reverseEl.addEventListener('change', () => { reset(); });

  // 速度
  speedRange.addEventListener('input', applySpeed);
  speedMarks.forEach((el) => {
    el.addEventListener('click', () => { speedRange.value = el.dataset.speed; applySpeed(); });
  });

  // 字号 +/- 按钮
  $('fontMinus').addEventListener('click', () => adjustFont(-4));
  $('fontPlus').addEventListener('click', () => adjustFont(4));
  // 行高 +/- 按钮
  $('lhMinus').addEventListener('click', () => adjustLh(-0.1));
  $('lhPlus').addEventListener('click', () => adjustLh(0.1));

  // 字体 / 颜色 / 背景
  fontFamily.addEventListener('change', () => { applyStyles(); applyText(); });
  colorEl.addEventListener('input', applyStyles);
  bgColorEl.addEventListener('input', () => { stage.style.background = bgColorEl.value; });

  // 主题预设
  themeRow.querySelectorAll('.theme-chip').forEach((el) => {
    el.addEventListener('click', () => applyTheme(el.dataset.theme));
  });

  // 对齐
  alignSeg.querySelectorAll('.seg-btn').forEach((el) => {
    el.addEventListener('click', () => setAlign(el.dataset.align));
  });

  // 隐藏 / 显示面板
  panelToggle.addEventListener('click', () => panel.classList.toggle('hide'));

  // 点击舞台切换播放
  stageInner.addEventListener('click', toggleRun);

  // 键盘快捷键
  document.addEventListener('keydown', (e) => {
    // 空格：开始/暂停（避免在文本框中触发）
    if (e.code === 'Space' && e.target !== textArea) {
      e.preventDefault();
      toggleRun();
    }
    // Ctrl+↑/↓ 调速
    if (e.ctrlKey && (e.code === 'ArrowUp' || e.code === 'ArrowDown')) {
      e.preventDefault();
      let v = parseInt(speedRange.value, 10);
      v = e.code === 'ArrowUp' ? Math.min(5, v + 1) : Math.max(1, v - 1);
      speedRange.value = v;
      applySpeed();
    }
  });

  // 全屏变化：重新测量并定位
  document.addEventListener('fullscreenchange', () => {
    setTimeout(() => { applyStyles(); applyText(); placeAtStart(); }, 60);
  });

  // 窗口尺寸变化重新测量
  window.addEventListener('resize', () => {
    applyStyles();
    applyText();
    if (!running) placeAtStart();
  });

  /* ---------- 初始化 ---------- */
  function init() {
    applySpeed();
    applyStyles();
    applyText();
    placeAtStart();
  }
  init();
})();
