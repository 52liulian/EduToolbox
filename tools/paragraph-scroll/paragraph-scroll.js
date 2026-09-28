/* ====================================================================
 * 段落滚动 (paragraph-scroll.js)
 * 功能：歌词式逐段切换，当前段居中大字，前后段按淡出层级显示，
 *       支持字号/行高/字体/颜色/对齐/动画/主题/淡出/间距/全屏，
 *       手动/自动两种切换模式，纯前端 IIFE 模块。
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

  /* ---------- 状态 ---------- */
  let paras = [];           // 段落数组
  let idx = 0;                // 当前段索引
  let running = false;        // 是否自动播放中
  let timer = null;           // 自动播放计时器句柄
  let curMode = 'manual';    // manual / auto
  let curAnim = 'pulse';     // 当前切换动画

  /* ---------- DOM 引用 ---------- */
  const stage = $('stage');
  const stageInner = $('stageInner');
  const paraList = $('paraList');
  const paraInfo = $('paraInfo');
  const panel = $('panel');
  const textArea = $('text');
  const countEl = $('count');
  const totalTimeEl = $('totalTime');
  const startBtn = $('startBtn');
  const prevBtn = $('prevBtn');
  const nextBtn = $('nextBtn');
  const resetPosBtn = $('resetPosBtn');
  const modeSeg = $('modeSeg');
  const stayVal = $('stayVal');
  const fadeVal = $('fadeVal');
  const fadeOpacity = $('fadeOpacity');
  const gapVal = $('gapVal');
  const padding = $('padding');
  const animSel = $('anim');
  const themeRow = $('themeRow');
  const fontFamily = $('fontFamily');
  const colorEl = $('color');
  const bgColorEl = $('bgColor');
  const fontVal = $('fontVal');
  const lhVal = $('lhVal');
  const alignSeg = $('alignSeg');
  const loopEl = $('loop');
  const showInfoEl = $('showInfo');

  /* ---------- 主题预设 ---------- */
  const THEMES = {
    white:    { color: '#1a1a1a', bg: '#ffffff', light: true },
    black:    { color: '#f8fafc', bg: '#0f0f12', light: false },
    green:    { color: '#e6f4d0', bg: '#1f3a25', light: false },
    warm:     { color: '#3a2a1a', bg: '#f7e7c4', light: true },
    sky:      { color: '#0c2a4a', bg: '#dbeafe', light: true },
    pink:     { color: '#4a1024', bg: '#fde2ec', light: true },
    purple:   { color: '#f3e8ff', bg: '#2d1b4e', light: false },
    deep:     { color: '#e0f2fe', bg: '#082f49', light: false },
    sunset:   { color: '#fff7ed', bg: '#7c2d12', light: false },
    paper:    { color: '#3b2f1e', bg: '#e8d8a8', light: true },
    mint:     { color: '#063b2a', bg: '#d1fae5', light: true },
    graphite: { color: '#e2e8f0', bg: '#1f2937', light: false }
  };

  /* ---------- 文本与渲染 ---------- */

  /**
   * 解析文本，按空行拆分段落（去掉空段）
   * @returns {string[]} 段落数组
   */
  function parse() {
    return textArea.value
      .split(/\r?\n\s*\r?\n/)
      .map((s) => s.replace(/^\s+|\s+$/g, ''))
      .filter(Boolean);
  }

  /**
   * 重新加载段落数组，重置索引，触发渲染
   * @returns {void}
   */
  function load() {
    paras = parse();
    idx = 0;
    render(true);
    updateCount();
    updateTotalTime();
  }

  /**
   * 计算指定段落相对于当前的「距离」（正=下方，负=上方，0=当前）
   * @param {number} i - 段索引
   * @returns {number} 距离（负上正下）
   */
  function distOf(i) {
    return i - idx;
  }

  /**
   * 渲染段落列表：当前段居中，前后段按淡出层级显示
   * @param {boolean} [withAnim] - 是否触发进入动画
   * @returns {void}
   */
  function render(withAnim) {
    paraList.innerHTML = '';
    paraList.className = 'para-list';
    if (curAnim !== 'none') paraList.classList.add('anim-' + curAnim);

    const fade = parseInt(fadeVal.textContent, 10) || 2;
    const opEdge = parseFloat(fadeOpacity.value) || 0.7;
    const baseFont = parseInt(fontVal.textContent, 10) || 40;
    const gap = parseInt(gapVal.textContent, 10) || 60;
    const pad = parseInt(padding.value, 10) || 6;
    const align = alignSeg.querySelector('.seg-btn.active')?.dataset.align || 'center';

    stageInner.style.paddingLeft = pad + '%';
    stageInner.style.paddingRight = pad + '%';
    paraList.style.gap = gap + 'px';

    // 渲染范围：[idx - fade, idx + fade]，超出用 ghost 占位避免跳动
    for (let d = -fade; d <= fade; d++) {
      const i = idx + d;
      if (i < 0 || i >= paras.length) continue;
      const item = document.createElement('div');
      item.className = 'para-item';
      item.textContent = paras[i];
      item.style.textAlign = align;
      item.style.fontFamily = fontFamily.value;
      item.style.color = colorEl.value;
      item.style.lineHeight = lhVal.textContent;

      const ad = Math.abs(d);
      let scale, opacity;
      if (d === 0) {
        scale = 1;
        opacity = 1;
        item.classList.add('cur');
      } else if (ad <= fade) {
        scale = 1 / (1 + ad * 0.55);
        opacity = 1 - (ad / fade) * (1 - opEdge);
        item.classList.add(ad === 1 ? 'side' : (ad === 2 ? 'side' : 'far'));
      } else {
        scale = 0.4;
        opacity = 0;
        item.classList.add('ghost');
      }
      item.style.fontSize = Math.round(baseFont * scale) + 'px';
      item.style.opacity = opacity.toFixed(2);
      // 当前段触发进入动画
      if (d === 0 && withAnim && curAnim !== 'none') {
        item.classList.add('enter');
        // 强制重排后切换到 enter-active 触发动画
        requestAnimationFrame(() => {
          requestAnimationFrame(() => item.classList.add('enter-active'));
        });
      }
      paraList.appendChild(item);
    }
  }

  /* ---------- 切换 ---------- */

  /**
   * 切换到指定段落索引（带边界提示）
   * @param {number} i - 目标索引
   * @returns {void}
   */
  function goTo(i) {
    if (!paras.length) return;
    const last = paras.length - 1;
    if (i < 0) {
      // 已到第一段
      if (loopEl.checked) i = last;
      else { toast('已经是第一段了'); return; }
    } else if (i > last) {
      // 已到最后一段
      if (loopEl.checked) i = 0;
      else {
        toast('已播放到最后一段');
        if (running) toggleRun();
        return;
      }
    }
    idx = i;
    render(true);
    updateCount();
  }

  /**
   * 下一段
   * @returns {void}
   */
  function next() { goTo(idx + 1); }

  /**
   * 上一段
   * @returns {void}
   */
  function prev() { goTo(idx - 1); }

  /* ---------- 自动播放 ---------- */

  /**
   * 自动模式开始 / 暂停
   * @returns {void}
   */
  function toggleRun() {
    if (!paras.length) return;
    running = !running;
    stage.classList.toggle('running', running);
    startBtn.textContent = running ? '⏸ 暂停播放 (空格)' : '▶ 开始播放 (空格)';
    if (running) {
      // 若处于手动模式，切到自动模式
      if (curMode !== 'auto') setMode('auto');
      scheduleNext();
    } else {
      clearTimeout(timer);
      timer = null;
    }
  }

  /**
   * 安排下一段自动切换
   * @returns {void}
   */
  function scheduleNext() {
    if (!running) return;
    const stay = (parseInt(stayVal.textContent, 10) || 4) * 1000;
    clearTimeout(timer);
    timer = setTimeout(() => {
      const last = paras.length - 1;
      if (idx >= last && !loopEl.checked) {
        toast('已播放完毕');
        toggleRun();
        return;
      }
      next();
      scheduleNext();
    }, stay);
  }

  /* ---------- UI 状态 ---------- */

  /**
   * 更新段落计数显示
   * @returns {void}
   */
  function updateCount() {
    countEl.textContent = (paras.length ? idx + 1 : 0) + ' / ' + paras.length;
    paraInfo.textContent = '当前第 ' + (paras.length ? idx + 1 : 0) + ' 段，共 ' + paras.length + ' 段';
  }

  /**
   * 更新完整播放一轮的总时长（段数 × 停留秒数）
   * @returns {void}
   */
  function updateTotalTime() {
    const stay = parseInt(stayVal.textContent, 10) || 4;
    totalTimeEl.textContent = paras.length * stay;
  }

  /**
   * 显示临时提示（屏幕中央）
   * @param {string} msg - 提示文字
   * @returns {void}
   */
  let toastTimer = null;
  function toast(msg) {
    let el = document.getElementById('toast');
    if (!el) {
      el = document.createElement('div');
      el.id = 'toast';
      el.style.cssText = 'position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);background:rgba(0,0,0,.7);color:#fff;padding:12px 24px;border-radius:8px;font-size:14px;letter-spacing:1px;z-index:200;pointer-events:none;opacity:0;transition:opacity .2s ease';
      document.body.appendChild(el);
    }
    el.textContent = msg;
    el.style.opacity = '1';
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => { el.style.opacity = '0'; }, 1400);
  }

  /* ---------- 设置项 ---------- */

  /**
   * 设置切换模式（手动 / 自动）
   * @param {string} m - manual / auto
   * @returns {void}
   */
  function setMode(m) {
    curMode = m;
    modeSeg.querySelectorAll('.seg-btn').forEach((el) => {
      el.classList.toggle('active', el.dataset.mode === m);
    });
    if (m === 'manual' && running) toggleRun();
  }

  /**
   * 应用预设主题
   * @param {string} key - 主题 key
   * @returns {void}
   */
  function applyTheme(key) {
    const t = THEMES[key];
    if (!t) return;
    colorEl.value = t.color;
    bgColorEl.value = t.bg;
    stage.classList.toggle('light-theme', t.light);
    stage.style.background = t.bg;
    themeRow.querySelectorAll('.theme-chip').forEach((el) => {
      el.classList.toggle('active', el.dataset.theme === key);
    });
    render(false);
  }

  /**
   * 设置对齐方式
   * @param {string} align - left/center/right
   * @returns {void}
   */
  function setAlign(align) {
    alignSeg.querySelectorAll('.seg-btn').forEach((el) => {
      el.classList.toggle('active', el.dataset.align === align);
    });
    render(false);
  }

  /**
   * 应用外观样式（背景 / 字色 / 字体 / 字号 / 行高）
   * @returns {void}
   */
  function applyStyles() {
    stage.style.background = bgColorEl.value;
    render(false);
  }

  /* ---------- 全屏联动 ----------
   * 设置栏显隐（进入全屏自动隐藏 / 退出还原 / 请求失败回滚）由共享模块
   * assets/js/tool-stage-toolbar.js 统一负责，本文件只保留全屏切换后的重渲染。 */

  /**
   * 全屏状态变化处理：全屏切换后重新渲染（尺寸变化需要重新排版）。
   *
   * 注意：这里不再操作 panel 的显隐 —— 那部分已交给共享模块，避免同一份状态
   * 在两个地方各维护一次而漂移。
   * @returns {void}
   */
  function handleFullscreenChange() {
    setTimeout(render, 60);
  }

  /**
   * 调整字号（+/-2）
   * @param {number} delta - 增量
   * @returns {void}
   */
  function adjustFont(delta) {
    let v = parseInt(fontVal.textContent, 10) + delta;
    v = Math.max(16, Math.min(120, v));
    fontVal.textContent = v;
    render(false);
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
    render(false);
  }

  /**
   * 调整停留时长（+/-1 秒）
   * @param {number} delta - 增量
   * @returns {void}
   */
  function adjustStay(delta) {
    let v = parseInt(stayVal.textContent, 10) + delta;
    v = Math.max(1, Math.min(30, v));
    stayVal.textContent = v;
    updateTotalTime();
    if (running) scheduleNext();
  }

  /**
   * 调整淡出段数（+/-1）
   * @param {number} delta - 增量
   * @returns {void}
   */
  function adjustFade(delta) {
    let v = parseInt(fadeVal.textContent, 10) + delta;
    v = Math.max(0, Math.min(6, v));
    fadeVal.textContent = v;
    render(false);
  }

  /**
   * 调整段落间距（+/-10px）
   * @param {number} delta - 增量
   * @returns {void}
   */
  function adjustGap(delta) {
    let v = parseInt(gapVal.textContent, 10) + delta;
    v = Math.max(0, Math.min(200, v));
    gapVal.textContent = v;
    render(false);
  }

  /* ---------- 事件绑定 ---------- */

  // 段落内容输入
  textArea.addEventListener('input', load);
  $('clearBtn').addEventListener('click', () => { textArea.value = ''; load(); });
  $('sampleBtn').addEventListener('click', () => { textArea.value = SAMPLE; load(); });
  $('resetBtn').addEventListener('click', () => {
    stayVal.textContent = '4';
    fadeVal.textContent = '2';
    gapVal.textContent = '60';
    fontVal.textContent = '40';
    lhVal.textContent = '1.6';
    fadeOpacity.value = '0.7';
    padding.value = '6';
    animSel.value = 'pulse';
    curAnim = 'pulse';
    load();
    toast('已重置设置');
  });

  // 播放控制
  startBtn.addEventListener('click', toggleRun);
  prevBtn.addEventListener('click', prev);
  nextBtn.addEventListener('click', next);
  resetPosBtn.addEventListener('click', () => { if (running) toggleRun(); idx = 0; render(true); updateCount(); });

  // 模式切换
  modeSeg.querySelectorAll('.seg-btn').forEach((el) => {
    el.addEventListener('click', () => setMode(el.dataset.mode));
  });

  // 数值 +/- 按钮
  $('stayMinus').addEventListener('click', () => adjustStay(-1));
  $('stayPlus').addEventListener('click', () => adjustStay(1));
  $('fadeMinus').addEventListener('click', () => adjustFade(-1));
  $('fadePlus').addEventListener('click', () => adjustFade(1));
  $('gapMinus').addEventListener('click', () => adjustGap(-10));
  $('gapPlus').addEventListener('click', () => adjustGap(10));
  $('fontMinus').addEventListener('click', () => adjustFont(-2));
  $('fontPlus').addEventListener('click', () => adjustFont(2));
  $('lhMinus').addEventListener('click', () => adjustLh(-0.1));
  $('lhPlus').addEventListener('click', () => adjustLh(0.1));

  // 滑块与下拉
  fadeOpacity.addEventListener('input', () => render(false));
  padding.addEventListener('input', () => render(false));
  animSel.addEventListener('change', () => { curAnim = animSel.value; render(false); });
  fontFamily.addEventListener('change', () => render(false));
  colorEl.addEventListener('input', () => render(false));
  bgColorEl.addEventListener('input', () => { stage.style.background = bgColorEl.value; render(false); });

  // 主题 / 对齐
  themeRow.querySelectorAll('.theme-chip').forEach((el) => {
    el.addEventListener('click', () => applyTheme(el.dataset.theme));
  });
  alignSeg.querySelectorAll('.seg-btn').forEach((el) => {
    el.addEventListener('click', () => setAlign(el.dataset.align));
  });

  // 循环 / 信息开关
  loopEl.addEventListener('change', () => {});
  showInfoEl.addEventListener('change', () => stage.classList.toggle('hide-info', !showInfoEl.checked));

  // 隐藏 / 显示设置栏（舞台右上角齿轮）与全屏（⛶）由共享模块接管，见文件末尾初始化处

  // 点击舞台 = 下一段（手动模式）或暂停（自动模式）
  stageInner.addEventListener('click', () => {
    if (curMode === 'auto' && running) toggleRun();
    else next();
  });

  // 键盘快捷键
  document.addEventListener('keydown', (e) => {
    if (e.target === textArea) return;
    if (e.code === 'Space') { e.preventDefault(); toggleRun(); }
    else if (e.code === 'ArrowLeft') { e.preventDefault(); prev(); }
    else if (e.code === 'ArrowRight') { e.preventDefault(); next(); }
  });

  // 全屏变化：同步设置栏显隐 + 重新渲染
  document.addEventListener('fullscreenchange', handleFullscreenChange);
  document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
  // 窗口大小变化重新渲染
  window.addEventListener('resize', () => render(false));

  /* ---------- 默认示例文本 ---------- */
  const SAMPLE = textArea.value;

  /* ---------- 初始化 ---------- */
  load();
  applyTheme('black');
  // 舞台右上角工具栏（⛶ 全屏 / ⚙ 隐藏设置）：舞台 #stage，设置栏 #panel，隐藏 class = hide
  if (window.EduToolStageToolbar) window.EduToolStageToolbar.init({ stage: "#stage", panelHost: "#panel", hiddenClass: "hide" });
})();
