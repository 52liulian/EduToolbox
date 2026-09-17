/**
 * 多定时器 · 多环节独立倒计时管理
 * - 卡片式多定时器同时管理，每个独立开始/暂停/重置/删除
 * - 加减时长按钮：+1min / +5min / -1min
 * - 到点 Web Audio API 合成提醒音
 * - 全屏专注模式（Fullscreen API + 自定义覆盖层）
 * - localStorage 持久化保存所有定时器配置与剩余时间
 *
 * 兼容性：纯前端 IIFE，file:// 协议可直接双击打开运行
 */
(function () {
  'use strict';

  /* ============== 工具函数 ============== */

  /**
   * 按 id 获取 DOM 元素
   * @param {string} id - 元素 id
   * @returns {HTMLElement} DOM 元素，不存在时返回 null
   */
  const $ = (id) => document.getElementById(id);

  /**
   * 将秒数格式化为 mm:ss 字符串
   * @param {number} sec - 秒数（可为负，自动截断为 0）
   * @returns {string} 形如 05:30 的字符串；超过 60 分钟显示 HH:MM:SS
   */
  function fmt(sec) {
    if (sec < 0) sec = 0;
    const h = Math.floor(sec / 3600);
    const m = Math.floor((sec % 3600) / 60);
    const s = sec % 60;
    const pad = (n) => String(n).padStart(2, '0');
    return h > 0 ? `${pad(h)}:${pad(m)}:${pad(s)}` : `${pad(m)}:${pad(s)}`;
  }

  /**
   * HTML 转义，避免用户输入的主题名注入 HTML
   * @param {string} str - 原始字符串
   * @returns {string} 转义后的安全字符串
   */
  function esc(str) {
    return String(str).replace(/[&<>"']/g, (c) => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    }[c]));
  }

  /**
   * 生成唯一 id（用于定时器对象）
   * @returns {string} 形如 t-1695000000000-3 的字符串
   */
  function uid() {
    return 't-' + Date.now() + '-' + Math.floor(Math.random() * 1000);
  }

  /* ============== 全局状态 ============== */

  const STORAGE_KEY = 'edutoolbox.multi-timer.v1';
  const THEME_KEY = 'edutoolbox.multi-timer.theme';
  const THEMES = ['green', 'sky', 'orange', 'pink', 'violet', 'gold'];
  let themeIndex = 0;

  /** @type {Array<{id:string,label:string,total:number,remaining:number,running:boolean,finished:boolean}>} */
  let timers = [];

  /** 全屏专注模式覆盖层是否激活 */
  let focusMode = false;

  /* ============== 音效（Web Audio API 合成） ============== */

  let audioCtx = null;

  /**
   * 播放到点提醒音（Web Audio API 合成，无需音频文件）
   * 三声短促 beep，频率 880Hz，每声持续 200ms，间隔 100ms
   * 异常场景：浏览器不支持 AudioContext 时静默失败
   */
  function beep() {
    try {
      if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      // 浏览器策略：首次播放需用户手势已触发，否则 suspended
      if (audioCtx.state === 'suspended') audioCtx.resume();
      const now = audioCtx.currentTime;
      for (let i = 0; i < 3; i++) {
        const t = now + i * 0.3;
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.value = 880;
        gain.gain.setValueAtTime(0.001, t);
        gain.gain.exponentialRampToValueAtTime(0.3, t + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.2);
        osc.connect(gain).connect(audioCtx.destination);
        osc.start(t);
        osc.stop(t + 0.22);
      }
    } catch (e) {
      // 静默失败：浏览器不支持音频时不影响主流程
    }
  }

  /* ============== 持久化 ============== */

  /**
   * 将当前所有定时器写入 localStorage
   * 异常场景：隐私模式或配额超限时静默失败
   */
  function save() {
    try {
      const data = timers.map((t) => ({
        id: t.id, label: t.label, total: t.total,
        remaining: t.remaining, running: t.running, finished: t.finished
      }));
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) { /* 静默 */ }
  }

  /**
   * 从 localStorage 读取定时器列表
   * @returns {Array} 定时器数组，读取失败返回空数组
   */
  function load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return [];
      const arr = JSON.parse(raw);
      if (!Array.isArray(arr)) return [];
      return arr.map((t) => ({
        id: t.id || uid(),
        label: t.label || '未命名',
        total: Number(t.total) || 60,
        remaining: Number(t.remaining) || 0,
        running: false, /* 启动时不自动恢复运行态，避免静默 beep */
        finished: t.finished || false
      }));
    } catch (e) { return []; }
  }

  /* ============== 定时器核心操作 ============== */

  /**
   * 添加一个新定时器
   * @param {string} label - 主题名（空则自动命名）
   * @param {number} min - 分钟
   * @param {number} sec - 秒
   * @returns {object} 新建的定时器对象
   */
  function addTimer(label, min, sec) {
    const total = Math.max(1, min * 60 + sec);
    const t = {
      id: uid(),
      label: (label || '').trim() || `定时器 ${timers.length + 1}`,
      total,
      remaining: total,
      running: false,
      finished: false
    };
    timers.push(t);
    save();
    render();
    return t;
  }

  /**
   * 切换指定定时器的运行/暂停状态
   * @param {number} i - 定时器在 timers 数组中的索引
   */
  function toggle(i) {
    const t = timers[i];
    if (!t) return;
    if (t.finished) {
      // 时间到后再次点击则重置并开始
      t.remaining = t.total;
      t.finished = false;
      t.running = true;
    } else {
      t.running = !t.running;
    }
    save();
    render();
  }

  /**
   * 重置指定定时器到初始时长，并停止运行
   * @param {number} i - 定时器在 timers 数组中的索引
   */
  function reset(i) {
    const t = timers[i];
    if (!t) return;
    t.remaining = t.total;
    t.running = false;
    t.finished = false;
    save();
    render();
  }

  /**
   * 删除指定定时器
   * @param {number} i - 定时器在 timers 数组中的索引
   */
  function remove(i) {
    if (!timers[i]) return;
    timers.splice(i, 1);
    save();
    render();
  }

  /**
   * 调整指定定时器时长（即时修改 total，按比例同步 remaining）
   * @param {number} i - 定时器索引
   * @param {number} deltaSec - 增减秒数（正为加，负为减）
   */
  function adjust(i, deltaSec) {
    const t = timers[i];
    if (!t) return;
    const newTotal = Math.max(1, t.total + deltaSec);
    const ratio = t.remaining / t.total;
    t.total = newTotal;
    t.remaining = Math.max(0, Math.round(newTotal * ratio));
    if (t.remaining === 0 && t.running) {
      t.running = false;
      t.finished = true;
      beep();
    }
    save();
    render();
  }

  /**
   * 批量开始所有未结束的定时器
   */
  function startAll() {
    timers.forEach((t) => { if (!t.finished) t.running = true; });
    save();
    render();
  }

  /**
   * 批量暂停所有运行中的定时器
   */
  function pauseAll() {
    timers.forEach((t) => { t.running = false; });
    save();
    render();
  }

  /**
   * 批量重置所有定时器
   */
  function resetAll() {
    timers.forEach((t) => { t.remaining = t.total; t.running = false; t.finished = false; });
    save();
    render();
  }

  /**
   * 清空所有定时器
   */
  function clearAll() {
    if (!timers.length) return;
    if (!confirm('确定清空全部定时器吗？此操作不可撤销。')) return;
    timers = [];
    save();
    render();
  }

  /* ============== 主计时循环 ============== */

  let lastTick = Date.now();

  /**
   * 主循环：每秒递减所有运行中的定时器
   * 用 Date.now() 差值校正，避免后台 tab 节流后时间漂移
   */
  function tick() {
    const now = Date.now();
    const elapsed = Math.floor((now - lastTick) / 1000);
    if (elapsed < 1) return;
    lastTick = now - (now - lastTick) % 1000; // 校正到整秒

    let changed = false;
    timers.forEach((t) => {
      if (t.running && t.remaining > 0) {
        t.remaining = Math.max(0, t.remaining - elapsed);
        changed = true;
        if (t.remaining === 0) {
          t.running = false;
          t.finished = true;
          beep();
        }
      }
    });
    if (changed) { save(); render(); }
  }

  /* ============== 渲染 ============== */

  /**
   * 渲染定时器卡片列表（含空状态）
   */
  function render() {
    const box = $('timers');
    if (!box) return;

    if (!timers.length) {
      box.innerHTML = '<div class="empty">暂无定时器，请在上方添加</div>';
      renderFocus();
      return;
    }

    box.innerHTML = timers.map((t, i) => {
      const cls = [
        'timer',
        t.running ? 'running' : '',
        t.finished ? 'done' : '',
        (!t.running && !t.finished && t.remaining < t.total && t.remaining > 0) ? 'paused' : ''
      ].filter(Boolean).join(' ');
      const pct = t.total > 0 ? Math.max(0, Math.min(100, (t.remaining / t.total) * 100)) : 0;
      const primaryText = t.finished ? '↻ 重启' : (t.running ? '⏸ 暂停' : '▶ 开始');
      return `
        <div class="${cls}" data-i="${i}">
          <div class="card-head">
            <div class="card-label-wrap">
              <span class="card-index">${i + 1}</span>
              <span class="card-label" title="${esc(t.label)}">${esc(t.label)}</span>
            </div>
            <button type="button" class="card-del" data-act="del" title="删除">×</button>
          </div>
          <div class="card-time">${fmt(t.remaining)}</div>
          <div class="card-progress"><div class="card-progress-bar" style="width:${pct}%"></div></div>
          <div class="adjust-row">
            <button type="button" class="adj-btn minus" data-adj="-60">−1 分</button>
            <button type="button" class="adj-btn" data-adj="60">+1 分</button>
            <button type="button" class="adj-btn" data-adj="300">+5 分</button>
          </div>
          <div class="card-actions">
            <button type="button" class="act-btn primary" data-act="toggle">${primaryText}</button>
            <button type="button" class="act-btn" data-act="reset">↩ 重置</button>
          </div>
        </div>`;
    }).join('');

    // 事件代理：每张卡片
    box.querySelectorAll('.timer').forEach((el) => {
      const i = parseInt(el.dataset.i, 10);
      el.querySelectorAll('[data-act]').forEach((btn) => {
        btn.addEventListener('click', () => {
          const act = btn.dataset.act;
          if (act === 'toggle') toggle(i);
          else if (act === 'reset') reset(i);
          else if (act === 'del') remove(i);
        });
      });
      el.querySelectorAll('[data-adj]').forEach((btn) => {
        btn.addEventListener('click', () => {
          adjust(i, parseInt(btn.dataset.adj, 10));
        });
      });
    });

    renderFocus();
  }

  /**
   * 渲染全屏专注模式列表
   */
  function renderFocus() {
    const list = $('focusList');
    if (!list) return;
    if (!focusMode) { list.innerHTML = ''; return; }
    list.innerHTML = timers.map((t) => {
      const cls = 'focus-card' + (t.finished ? ' done' : '');
      return `<div class="${cls}">
        <div class="f-label">${esc(t.label)}</div>
        <div class="f-time">${fmt(t.remaining)}</div>
      </div>`;
    }).join('') || '<div class="empty">暂无定时器</div>';
  }

  /* ============== 全屏专注模式 ============== */

  /**
   * 进入全屏专注模式（Fullscreen API + 自定义覆盖层）
   * 异常场景：浏览器不支持全屏 API 时仅显示覆盖层
   */
  function enterFocus() {
    focusMode = true;
    const overlay = $('focusOverlay');
    if (overlay) overlay.classList.remove('hidden');
    const root = document.documentElement;
    const req = root.requestFullscreen || root.webkitRequestFullscreen || root.mozRequestFullScreen;
    if (req) {
      try { req.call(root); } catch (e) { /* 忽略 */ }
    }
    renderFocus();
  }

  /**
   * 退出全屏专注模式
   */
  function exitFocus() {
    focusMode = false;
    const overlay = $('focusOverlay');
    if (overlay) overlay.classList.add('hidden');
    if (document.fullscreenElement || document.webkitFullscreenElement) {
      const exit = document.exitFullscreen || document.webkitExitFullscreen;
      if (exit) { try { exit.call(document); } catch (e) { /* 忽略 */ } }
    }
    renderFocus();
  }

  /* ============== 主题切换 ============== */

  /**
   * 切换到下一个主题色
   */
  function nextTheme() {
    themeIndex = (themeIndex + 1) % THEMES.length;
    applyTheme();
  }

  /**
   * 应用当前 themeIndex 对应的主题色
   */
  function applyTheme() {
    document.body.setAttribute('data-theme', THEMES[themeIndex]);
    try { localStorage.setItem(THEME_KEY, String(themeIndex)); } catch (e) { /* 静默 */ }
  }

  /**
   * 从 localStorage 读取并应用主题
   */
  function loadTheme() {
    try {
      const idx = parseInt(localStorage.getItem(THEME_KEY), 10);
      if (!isNaN(idx) && idx >= 0 && idx < THEMES.length) themeIndex = idx;
    } catch (e) { /* 静默 */ }
    applyTheme();
  }

  /* ============== 事件绑定 ============== */

  /**
   * 绑定所有事件监听器
   */
  function bindEvents() {
    // 添加定时器
    $('btnAdd').addEventListener('click', () => {
      const label = $('inputLabel').value;
      const min = parseInt($('inputMin').value, 10) || 0;
      const sec = parseInt($('inputSec').value, 10) || 0;
      if (min === 0 && sec === 0) { alert('请输入有效时长'); return; }
      addTimer(label, min, sec);
      $('inputLabel').value = '';
      $('inputLabel').focus();
    });

    // 回车添加
    ['inputLabel', 'inputSec', 'inputMin'].forEach((id) => {
      $(id).addEventListener('keydown', (e) => {
        if (e.key === 'Enter') $('btnAdd').click();
      });
    });

    // 时长预设 chips：点击后填入分钟
    $('chips').querySelectorAll('.chip').forEach((chip) => {
      chip.addEventListener('click', () => {
        $('inputMin').value = chip.dataset.min;
        $('inputSec').value = 0;
        $('chips').querySelectorAll('.chip').forEach((c) => c.classList.remove('active'));
        chip.classList.add('active');
      });
    });

    // 批量操作
    $('btnStartAll').addEventListener('click', startAll);
    $('btnPauseAll').addEventListener('click', pauseAll);
    $('btnResetAll').addEventListener('click', resetAll);
    $('btnClearAll').addEventListener('click', clearAll);

    // 顶栏：主题切换 + 全屏
    $('btnTheme').addEventListener('click', nextTheme);
    $('btnFullscreen').addEventListener('click', enterFocus);
    $('btnExitFocus').addEventListener('click', exitFocus);

    // Esc 退出全屏（浏览器原生 + 自定义覆盖层）
    document.addEventListener('fullscreenchange', () => {
      if (!document.fullscreenElement && !document.webkitFullscreenElement && focusMode) {
        focusMode = false;
        const overlay = $('focusOverlay');
        if (overlay) overlay.classList.add('hidden');
        renderFocus();
      }
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && focusMode) exitFocus();
    });

    // 页面可见性变化：tab 切回时校正 tick
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden) { lastTick = Date.now(); tick(); }
    });
  }

  /* ============== 初始化 ============== */

  /**
   * 入口：加载主题 → 加载持久化数据 → 渲染 → 绑定事件 → 启动主循环
   */
  function init() {
    loadTheme();
    timers = load();
    bindEvents();
    render();
    lastTick = Date.now();
    setInterval(tick, 1000);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
