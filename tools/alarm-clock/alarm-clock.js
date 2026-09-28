/**
 * 课堂闹钟主模块（IIFE 闭包）
 *
 * 功能描述：
 *   - 管理多个闹钟的增删改查与启用状态
 *   - 实时刷新当前时间并检测触发条件
 *   - 到点使用 Web Audio API 合成持续双音节响铃
 *   - 通过 localStorage 持久化保存全部闹钟
 *   - 支持全屏模式切换（Fullscreen API）
 *
 * 异常场景：
 *   - localStorage 不可用 / JSON 解析失败 → 回退为空数组
 *   - Web Audio API 不支持 → 静默降级（弹窗仍可用）
 *   - Fullscreen API 不支持 → 由共享模块静默降级，不再弹 alert
 *
 * 兼容性：file:// 协议可直接运行，不依赖 fetch/Worker/import
 */
(function () {
  'use strict';

  /** @type {string} localStorage 持久化键名 */
  var STORAGE_KEY = 'edu.alarm-clock.alarms';

  /** @type {Object<string, HTMLElement>} DOM 元素缓存，避免反复查询 */
  var dom = {
    clock: document.getElementById('clock'),
    date: document.getElementById('date'),
    alarmTime: document.getElementById('alarmTime'),
    alarmMsg: document.getElementById('alarmMsg'),
    addBtn: document.getElementById('addBtn'),
    list: document.getElementById('list'),
    status: document.getElementById('status'),
    presets: document.getElementById('presets'),
    ringModal: document.getElementById('ringModal'),
    ringTime: document.getElementById('ringTime'),
    ringMsg: document.getElementById('ringMsg'),
    stopBtn: document.getElementById('stopBtn')
  };

  /** @type {Array<{time:string,msg:string,enabled:boolean}>} 闹钟数据列表 */
  var alarms = [];

  /** @type {Set<string>} 已触发标记集合，键为 "索引@HH:MM"，避免一分钟内重复响铃 */
  var triggered = new Set();

  /** @type {AudioContext|null} Web Audio 上下文，懒加载 */
  var audioCtx = null;

  /** @type {number|null} 响铃定时器句柄，用于停止循环 */
  var ringTimer = null;

  /** @type {Object|null} 当前正在响铃的闹钟对象引用 */
  var currentRinging = null;

  /**
   * 从 localStorage 加载闹钟数据
   *
   * 功能描述：读取 localStorage 中的 JSON 字符串并解析为闹钟数组
   *
   * 返回值类型：Array<{time:string,msg:string,enabled:boolean}>
   *
   * 异常场景：
   *   - localStorage 中无数据 → 返回空数组
   *   - JSON 解析失败 / 数据结构异常 → 控制台告警并返回空数组
   *   - 单条数据字段缺失 → 用默认值补全
   *
   * @returns {Array} 闹钟数组
   */
  function load() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      var arr = raw ? JSON.parse(raw) : [];
      if (!Array.isArray(arr)) return [];
      return arr.map(function (a) {
        return {
          time: typeof a.time === 'string' ? a.time : '00:00',
          msg: typeof a.msg === 'string' && a.msg ? a.msg : '时间到！',
          enabled: a.enabled !== false
        };
      });
    } catch (e) {
      console.warn('[alarm-clock] load failed:', e);
      return [];
    }
  }

  /**
   * 保存闹钟列表到 localStorage
   *
   * 功能描述：将闹钟数组序列化为 JSON 字符串写入 localStorage
   *
   * 返回值类型：void
   *
   * 异常场景：写入失败（如配额超限、隐私模式禁用）→ 控制台告警后静默处理
   */
  function save() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(alarms));
    } catch (e) {
      console.warn('[alarm-clock] save failed:', e);
    }
  }

  /**
   * 渲染闹钟列表到 DOM
   *
   * 功能描述：按时间升序展示所有闹钟，含时间、文字、开关、删除按钮；
   *           空列表时显示"未设置闹钟"占位
   *
   * 返回值类型：void
   */
  function render() {
    if (!alarms.length) {
      dom.list.innerHTML = '<div class="state state--compact state--empty"><div class="state-icon">⏰</div><div class="state-title">未设置闹钟</div></div>';
      updateStatus();
      return;
    }
    var sorted = alarms.slice().sort(function (a, b) {
      return a.time < b.time ? -1 : (a.time > b.time ? 1 : 0);
    });
    dom.list.innerHTML = sorted.map(function (a, i) {
      return [
        '<div class="alarm' + (a.enabled ? '' : ' disabled') + '" data-i="' + i + '">',
        '  <div class="alarm-main">',
        '    <span class="alarm-time">' + a.time + '</span>',
        '    <span class="alarm-msg">' + escapeHtml(a.msg) + '</span>',
        '  </div>',
        '  <label class="switch" title="启用/禁用">',
        '    <input type="checkbox" class="toggle"' + (a.enabled ? ' checked' : '') + '>',
        '    <span class="slider"></span>',
        '  </label>',
        '  <button type="button" class="del" title="删除" aria-label="删除">×</button>',
        '</div>'
      ].join('');
    }).join('');
    bindListEvents();
    updateStatus();
  }

  /**
   * 为列表项绑定开关与删除事件
   *
   * 功能描述：遍历 DOM 中所有 .alarm 元素，绑定 toggle 切换与删除点击事件
   *
   * 返回值类型：void
   */
  function bindListEvents() {
    var items = dom.list.querySelectorAll('.alarm');
    Array.prototype.forEach.call(items, function (el) {
      var i = parseInt(el.getAttribute('data-i'), 10);
      var toggle = el.querySelector('.toggle');
      var del = el.querySelector('.del');
      if (toggle) {
        toggle.addEventListener('change', function () {
          if (!alarms[i]) return;
          alarms[i].enabled = toggle.checked;
          save();
          el.classList.toggle('disabled', !toggle.checked);
          updateStatus();
        });
      }
      if (del) {
        del.addEventListener('click', function () {
          if (!confirm('确认删除闹钟 ' + (alarms[i] ? alarms[i].time : '') + ' ？')) return;
          alarms.splice(i, 1);
          save();
          render();
        });
      }
    });
  }

  /**
   * 转义 HTML 特殊字符
   *
   * 功能描述：将 & < > " ' 转义为实体字符，防止用户输入引发 XSS
   *
   * 参数说明：
   *   - s {string} 原始字符串
   *
   * 返回值类型：string 转义后安全字符串
   *
   * @param {string} s 原始字符串
   * @returns {string} 转义后字符串
   */
  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  /**
   * 更新底部状态提示文字
   *
   * 功能描述：若至少有一个启用的闹钟，显示"下一闹钟"及距当前时间的剩余时长；
   *           否则显示"等待设定..."
   *
   * 返回值类型：void
   */
  function updateStatus() {
    var enabled = alarms.filter(function (a) { return a.enabled; });
    if (!enabled.length) {
      dom.status.textContent = '等待设定...';
      return;
    }
    var now = new Date();
    var cur = now.getHours() * 60 + now.getMinutes();
    var next = null;
    var minDiff = Infinity;
    enabled.forEach(function (a) {
      var p = a.time.split(':');
      var m = parseInt(p[0], 10) * 60 + parseInt(p[1], 10);
      var diff = m - cur;
      if (diff <= 0) diff += 1440; // 跨天处理
      if (diff < minDiff) { minDiff = diff; next = a; }
    });
    if (!next) return;
    var h = Math.floor(minDiff / 60);
    var mi = minDiff % 60;
    dom.status.textContent = '下一闹钟 ' + next.time + ' ' + next.msg +
      '（还有 ' + h + ' 时 ' + mi + ' 分）';
  }

  /**
   * 每秒走时主循环
   *
   * 功能描述：
   *   1. 刷新当前时间大字显示（HH:MM:SS）
   *   2. 刷新日期与星期
   *   3. 检测是否有闹钟到点（秒数=0 时触发，避免同一分钟多次响铃）
   *   4. 每分钟半段清理过期触发标记
   *
   * 返回值类型：void
   */
  function tick() {
    var now = new Date();
    dom.clock.textContent = pad(now.getHours()) + ':' + pad(now.getMinutes()) + ':' + pad(now.getSeconds());
    dom.date.textContent = now.toLocaleDateString('zh-CN', {
      year: 'numeric', month: 'long', day: 'numeric', weekday: 'long'
    });

    var hhmm = pad(now.getHours()) + ':' + pad(now.getMinutes());
    alarms.forEach(function (a, i) {
      var key = i + '@' + hhmm;
      if (a.enabled && a.time === hhmm && now.getSeconds() === 0 && !triggered.has(key)) {
        triggered.add(key);
        startRinging(a);
      }
    });
    // 每分钟清理过期标记，避免集合无限增长
    if (now.getSeconds() === 30) triggered.clear();
  }

  /**
   * 数字两位补零
   *
   * 功能描述：将 0-99 的整数转为两位字符串，不足补前导零
   *
   * 参数说明：
   *   - n {number} 0-99 的整数
   *
   * 返回值类型：string 两位字符串
   *
   * @param {number} n 输入数字
   * @returns {string} 两位补零字符串
   */
  function pad(n) { return String(n).padStart(2, '0'); }

  /**
   * 启动持续响铃
   *
   * 功能描述：响铃弹窗显示，并以 800ms 间隔循环播放双音节铃声；
   *           同时将当前闹钟对象记录到 currentRinging
   *
   * 参数说明：
   *   - alarm {{time:string,msg:string,enabled:boolean}} 触发的闹钟对象
   *
   * 返回值类型：void
   *
   * @param {Object} alarm 闹钟对象
   */
  function startRinging(alarm) {
    currentRinging = alarm;
    dom.ringTime.textContent = alarm.time;
    dom.ringMsg.textContent = alarm.msg || '时间到！';
    dom.ringModal.hidden = false;
    playBeep();
    if (ringTimer) clearInterval(ringTimer);
    ringTimer = setInterval(playBeep, 800);
  }

  /**
   * 合成一段双音节铃声
   *
   * 功能描述：使用 Web Audio API 创建 880Hz + 660Hz 方波震荡器，
   *           通过 Gain 节点包络避免爆音，输出 0.5 秒铃声
   *
   * 返回值类型：void
   *
   * 异常场景：AudioContext 创建失败 / 浏览器不支持 → 控制台告警后静默
   */
  function playBeep() {
    try {
      if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      if (audioCtx.state === 'suspended') audioCtx.resume();
      [880, 660].forEach(function (f, i) {
        var o = audioCtx.createOscillator();
        var g = audioCtx.createGain();
        o.type = 'square';
        o.frequency.value = f;
        var t = audioCtx.currentTime + i * 0.25;
        g.gain.setValueAtTime(0.0001, t);
        g.gain.exponentialRampToValueAtTime(0.3, t + 0.02);
        g.gain.exponentialRampToValueAtTime(0.0001, t + 0.22);
        o.connect(g).connect(audioCtx.destination);
        o.start(t);
        o.stop(t + 0.24);
      });
    } catch (e) {
      console.warn('[alarm-clock] beep failed:', e);
    }
  }

  /**
   * 停止响铃并关闭弹窗
   *
   * 功能描述：清除响铃定时器、隐藏弹窗、重置 currentRinging 引用
   *
   * 返回值类型：void
   */
  function stopRinging() {
    if (ringTimer) { clearInterval(ringTimer); ringTimer = null; }
    dom.ringModal.hidden = true;
    currentRinging = null;
  }

  /**
   * 添加新闹钟
   *
   * 功能描述：读取时间与文字输入，校验后追加到 alarms 数组并持久化
   *
   * 返回值类型：void
   *
   * 异常场景：
   *   - 时间为空 → alert 提示后中断
   *   - 时间与文字完全重复 → alert 提示后中断
   */
  function addAlarm() {
    var t = dom.alarmTime.value;
    var m = (dom.alarmMsg.value || '').trim() || '时间到！';
    if (!t) { alert('请选择提醒时间'); return; }
    var dup = alarms.some(function (a) { return a.time === t && a.msg === m; });
    if (dup) { alert('已存在相同时间与文字的闹钟'); return; }
    alarms.push({ time: t, msg: m, enabled: true });
    save();
    render();
    dom.alarmTime.value = '';
    dom.alarmMsg.value = '';
    dom.alarmTime.focus();
  }

  /* ⛶ 全屏由共享模块 assets/js/tool-stage-toolbar.js 统一接管：
     全屏目标是 main.container 自身，本工具没有可隐藏的设置栏，
     故只接全屏、不做显隐。见 IIFE 末尾的 EduToolStageToolbar.init()。 */

  // ============== 事件绑定 ==============
  dom.addBtn.addEventListener('click', addAlarm);
  dom.stopBtn.addEventListener('click', stopRinging);

  // 快速设定预设：点击直接添加闹钟
  dom.presets.addEventListener('click', function (e) {
    var btn = e.target.closest('.preset');
    if (!btn) return;
    var t = btn.dataset.time;
    var dup = alarms.some(function (a) { return a.time === t; });
    if (dup) { alert('已存在 ' + t + ' 的闹钟'); return; }
    alarms.push({ time: t, msg: '闹钟提醒', enabled: true });
    save();
    render();
  });

  // 输入框回车快捷添加
  dom.alarmMsg.addEventListener('keydown', function (e) {
    if (e.key === 'Enter') addAlarm();
  });
  dom.alarmTime.addEventListener('keydown', function (e) {
    if (e.key === 'Enter') addAlarm();
  });

  // ============== 初始化 ==============
  alarms = load();
  render();
  tick();
  setInterval(tick, 1000);

  /* 舞台右上角工具栏（⛶ 全屏）：全屏目标是 main.container 自身；
     闹钟工具没有可隐藏的设置栏，故 panelHost 传 null。 */
  if (window.EduToolStageToolbar) {
    window.EduToolStageToolbar.init({ stage: 'main.container', panelHost: null });
  }
})();
