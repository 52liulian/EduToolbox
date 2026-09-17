/**
 * 在线抢答 · 课堂抢答记录
 * ============================================================================
 * 功能说明：
 *   - 多队伍卡片抢答，点击卡片或按数字键 1-9 触发对应队伍抢答
 *   - 每轮锁定第一支抢答队伍并高亮显示，需点击"新一轮"解锁
 *   - 抢答历史按顺序记录（#序号 + 队名 + 用时 + 轮次标签）
 *   - 支持队伍新增 / 删除、名单批量导入（textarea 每行一个）
 *   - 支持全屏模式（Fullscreen API）、抢答动画反馈（缩放 + 变色）
 *   - 队伍名单、轮次、历史记录自动持久化到 localStorage
 *
 * 依赖：纯原生 JavaScript（IIFE 模块），不使用任何外部库，兼容 file:// 协议
 * 文件：quick-answer.js
 * ============================================================================
 */
(function () {
  'use strict';

  /* ============================ 常量定义 ============================ */

  /** localStorage 存储键名 */
  var STORAGE_KEY = 'quickAnswerState_v1';
  /** 默认队伍名称 */
  var DEFAULT_TEAM_NAMES = ['第一队', '第二队'];
  /** 最大队伍数量（对应数字键 1-9） */
  var MAX_TEAMS = 9;
  /** 历史记录最大保留条数 */
  var MAX_HISTORY = 100;

  /* ============================ 工具函数 ============================ */

  /**
   * 按 id 获取 DOM 元素（简写）
   * @param {string} id - 元素 id
   * @returns {HTMLElement}
   */
  function $(id) { return document.getElementById(id); }

  /**
   * 将秒数格式化为 M:SS（如 75 -> "1:15"，5 -> "0:05"）
   * @param {number} seconds - 秒数
   * @returns {string} 格式化后的时间字符串
   */
  function formatTime(seconds) {
    var safe = Math.max(0, seconds);
    var m = Math.floor(safe / 60);
    var s = Math.floor(safe % 60);
    return m + ':' + String(s).padStart(2, '0');
  }

  /**
   * HTML 特殊字符转义，防止 XSS
   * @param {string} str - 原始字符串
   * @returns {string} 转义后的字符串
   */
  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  /**
   * 从 localStorage 读取并解析状态
   * @returns {Object|null} 解析后的状态对象；失败返回 null
   */
  function loadState() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      return JSON.parse(raw);
    } catch (e) {
      console.warn('加载本地状态失败：', e);
      return null;
    }
  }

  /**
   * 将状态对象持久化到 localStorage
   * @param {Object} obj - 待保存的状态
   */
  function saveState(obj) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(obj));
    } catch (e) {
      console.warn('保存本地状态失败：', e);
    }
  }

  /* ============================ 应用状态 ============================ */

  /** 应用运行时状态 */
  var state = {
    /** 队伍数组：[{name: string}] */
    teams: DEFAULT_TEAM_NAMES.map(function (n) { return { name: n }; }),
    /** 当前轮次序号 */
    round: 1,
    /** 抢答历史：[{round, teamIndex, teamName, elapsed, time}] */
    history: [],
    /** 本轮是否已锁定（已有人抢答） */
    locked: false,
    /** 本轮抢答成功队伍索引，-1 表示无人 */
    winnerIndex: -1,
    /** 本轮开始时间戳（毫秒） */
    roundStartTime: Date.now(),
  };

  // 从 localStorage 恢复持久化数据（不恢复运行时锁定状态）
  var saved = loadState();
  if (saved) {
    if (Array.isArray(saved.teams) && saved.teams.length > 0) {
      state.teams = saved.teams.map(function (t) {
        return { name: typeof t.name === 'string' ? t.name : '未命名' };
      });
    }
    if (typeof saved.round === 'number' && saved.round > 0) state.round = saved.round;
    if (Array.isArray(saved.history)) state.history = saved.history;
    state.roundStartTime = Date.now(); // 每次启动重置本轮计时
  }

  /**
   * 持久化当前状态到 localStorage
   */
  function persist() {
    saveState({
      teams: state.teams,
      round: state.round,
      history: state.history,
    });
  }

  /* ============================ 渲染函数 ============================ */

  /**
   * 渲染顶部状态栏（轮次、队伍数、抢答状态文字与指示灯）
   */
  function renderStatusBar() {
    $('roundNum').textContent = state.round;
    $('teamCount').textContent = state.teams.length;
    var statusEl = $('statusText');
    if (state.locked && state.winnerIndex >= 0) {
      var winner = state.teams[state.winnerIndex];
      statusEl.textContent = winner.name + ' 抢答成功！';
      statusEl.classList.add('locked');
    } else {
      statusEl.textContent = '等待抢答中…';
      statusEl.classList.remove('locked');
    }
  }

  /**
   * 渲染队伍卡片网格
   */
  function renderTeams() {
    var container = $('teams');
    container.classList.toggle('locked', state.locked);

    container.innerHTML = state.teams.map(function (team, i) {
      var isWinner = state.locked && state.winnerIndex === i;
      var cardClass = 'team-card' + (isWinner ? ' buzzed' : '');
      var disabled = state.locked ? 'aria-disabled="true"' : '';
      return ''
        + '<div class="' + cardClass + '" data-index="' + i + '" role="button" tabindex="0" ' + disabled + '>'
        +   '<button class="remove-btn" data-remove="' + i + '" title="删除该队伍" type="button" aria-label="删除该队伍">×</button>'
        +   '<span class="key-badge">' + (i + 1) + '</span>'
        +   '<input class="team-name" data-name="' + i + '" value="' + escapeHtml(team.name) + '" maxlength="20" type="text" aria-label="队伍名称" />'
        +   '<div class="buzz-hint">点击或按数字键 ' + (i + 1) + ' 抢答</div>'
        + '</div>';
    }).join('');

    // 绑定卡片点击 / 键盘事件
    Array.prototype.forEach.call(
      container.querySelectorAll('.team-card'),
      function (el) {
        var idx = +el.dataset.index;
        el.addEventListener('click', function (e) {
          // 点击删除按钮或名称输入框时不触发抢答
          if (e.target.closest('.remove-btn') || e.target.closest('.team-name')) return;
          buzz(idx);
        });
        el.addEventListener('keydown', function (e) {
          if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); buzz(idx); }
        });
      }
    );

    // 绑定删除按钮
    Array.prototype.forEach.call(
      container.querySelectorAll('.remove-btn'),
      function (btn) {
        btn.addEventListener('click', function (e) {
          e.stopPropagation();
          removeTeam(+btn.dataset.remove);
        });
      }
    );

    // 绑定名称编辑
    Array.prototype.forEach.call(
      container.querySelectorAll('.team-name'),
      function (input) {
        input.addEventListener('input', function () {
          var idx = +input.dataset.name;
          state.teams[idx].name = input.value;
          persist();
        });
        // 阻止输入框内的键盘事件冒泡（避免按数字键时触发抢答）
        input.addEventListener('keydown', function (e) { e.stopPropagation(); });
      }
    );
  }

  /**
   * 渲染抢答历史记录列表（按抢答顺序：#1 在最上，最新在底部）
   */
  function renderHistory() {
    var ol = $('log');
    var empty = $('historyEmpty');
    if (state.history.length === 0) {
      ol.innerHTML = '';
      empty.style.display = 'block';
      return;
    }
    empty.style.display = 'none';
    ol.innerHTML = state.history.map(function (h, idx) {
      return ''
        + '<li>'
        +   '<span class="rank">#' + (idx + 1) + '</span>'
        +   '<span class="team-label">' + escapeHtml(h.teamName) + '</span>'
        +   '<span class="time-stamp">' + formatTime(h.elapsed) + '</span>'
        +   '<span class="round-tag">第 ' + h.round + ' 轮</span>'
        + '</li>';
    }).join('');
    // 自动滚动到底部，便于查看最新抢答
    ol.scrollTop = ol.scrollHeight;
  }

  /**
   * 主渲染函数：刷新状态栏 / 队伍 / 历史三部分
   */
  function render() {
    renderStatusBar();
    renderTeams();
    renderHistory();
  }

  /* ============================ 业务逻辑 ============================ */

  /**
   * 触发抢答：记录第一支抢答队伍并锁定本轮
   * @param {number} teamIndex - 队伍索引（0-based）
   */
  function buzz(teamIndex) {
    // 已锁定则忽略后续抢答
    if (state.locked) return;
    // 索引越界保护
    if (teamIndex < 0 || teamIndex >= state.teams.length) return;

    var elapsed = (Date.now() - state.roundStartTime) / 1000;
    var team = state.teams[teamIndex];

    state.locked = true;
    state.winnerIndex = teamIndex;

    state.history.push({
      round: state.round,
      teamIndex: teamIndex,
      teamName: team.name,
      elapsed: elapsed,
      time: Date.now(),
    });
    if (state.history.length > MAX_HISTORY) state.history.shift();

    persist();
    render();
  }

  /**
   * 开始新一轮：解锁抢答、轮次 +1、重置本轮开始时间
   */
  function newRound() {
    state.round += 1;
    state.locked = false;
    state.winnerIndex = -1;
    state.roundStartTime = Date.now();
    persist();
    render();
  }

  /**
   * 重置：清空所有抢答历史，恢复到第 1 轮（保留队伍名单）
   */
  function resetAll() {
    if (!confirm('确认要重置所有抢答记录吗？此操作不可撤销。')) return;
    state.round = 1;
    state.history = [];
    state.locked = false;
    state.winnerIndex = -1;
    state.roundStartTime = Date.now();
    persist();
    render();
  }

  /**
   * 新增一支队伍（最多 MAX_TEAMS 支）
   */
  function addTeam() {
    if (state.teams.length >= MAX_TEAMS) {
      alert('最多支持 ' + MAX_TEAMS + ' 支队伍（对应数字键 1-9）。');
      return;
    }
    state.teams.push({ name: '第' + (state.teams.length + 1) + '队' });
    persist();
    render();
  }

  /**
   * 删除指定队伍（至少保留 1 支）
   * @param {number} idx - 待删除队伍索引
   */
  function removeTeam(idx) {
    if (state.teams.length <= 1) {
      alert('至少保留一支队伍。');
      return;
    }
    state.teams.splice(idx, 1);
    // 若本轮已锁定且删除的恰好是获胜队伍，则解锁重置本轮
    if (state.locked) {
      state.locked = false;
      state.winnerIndex = -1;
      state.roundStartTime = Date.now();
    }
    persist();
    render();
  }

  /**
   * 从 textarea 导入名单（每行一个名字，按顺序对应数字键 1-N）
   */
  function importNames() {
    var text = $('importTextarea').value;
    var lines = text.split(/\r?\n/).map(function (s) { return s.trim(); })
      .filter(function (s) { return s.length > 0; });
    if (lines.length === 0) {
      alert('请输入至少一个名字（每行一个）。');
      return;
    }
    if (lines.length > MAX_TEAMS) {
      alert('最多支持 ' + MAX_TEAMS + ' 个名字（对应数字键 1-' + MAX_TEAMS + '），多余将被截断。');
      lines.length = MAX_TEAMS;
    }
    state.teams = lines.map(function (name) { return { name: name }; });
    // 重置抢答状态与轮次计时
    state.locked = false;
    state.winnerIndex = -1;
    state.roundStartTime = Date.now();
    persist();
    render();
    closeImportDialog();
  }

  /**
   * 打开名单导入对话框，预填当前名单
   */
  function openImportDialog() {
    $('importTextarea').value = state.teams.map(function (t) { return t.name; }).join('\n');
    var dlg = $('importDialog');
    if (typeof dlg.showModal === 'function') {
      dlg.showModal();
    } else {
      dlg.setAttribute('open', '');
    }
    setTimeout(function () { $('importTextarea').focus(); }, 50);
  }

  /**
   * 关闭名单导入对话框
   */
  function closeImportDialog() {
    var dlg = $('importDialog');
    if (dlg.open && typeof dlg.close === 'function') {
      dlg.close();
    } else {
      dlg.removeAttribute('open');
    }
  }

  /**
   * 切换全屏模式（Fullscreen API）
   */
  function toggleFullscreen() {
    try {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen();
      }
    } catch (e) {
      console.warn('全屏切换失败：', e);
    }
  }

  /* ============================ 事件绑定 ============================ */

  /**
   * 全局键盘事件：
   *   - 输入框/文本域获焦时不触发抢答
   *   - ESC 关闭对话框
   *   - 数字键 1-9 触发对应队伍抢答
   */
  document.addEventListener('keydown', function (e) {
    var tag = (e.target.tagName || '').toLowerCase();
    if (tag === 'input' || tag === 'textarea') return;

    if (e.key === 'Escape') {
      closeImportDialog();
      return;
    }
    var num = parseInt(e.key, 10);
    if (!isNaN(num) && num >= 1 && num <= MAX_TEAMS) {
      buzz(num - 1);
    }
  });

  /**
   * 初始化所有按钮事件
   */
  function initButtons() {
    $('btnAddTeam').addEventListener('click', addTeam);
    $('btnNewRound').addEventListener('click', newRound);
    $('btnReset').addEventListener('click', resetAll);
    $('btnFullscreen').addEventListener('click', toggleFullscreen);
    $('btnImport').addEventListener('click', openImportDialog);
    $('importConfirm').addEventListener('click', importNames);
    $('importCancel').addEventListener('click', closeImportDialog);

    // 点击对话框背景空白处关闭
    $('importDialog').addEventListener('click', function (e) {
      if (e.target === $('importDialog')) closeImportDialog();
    });
  }

  /* ============================ 启动应用 ============================ */

  initButtons();
  render();
})();
