/**
 * 积分板主逻辑（IIFE 模块）
 * 功能描述：
 *   1. 队伍的添加 / 删除 / 重命名
 *   2. 快捷加减分（-1 / +1 / +2 / +5）与自定义分值加分
 *   3. 实时按分数排序并展示排名
 *   4. 前三名金/银/铜高亮
 *   5. 重置分数 / 清空所有 / 全屏模式
 *   6. localStorage 持久化（刷新不丢失）
 *   7. file:// 协议直接打开可用（无任何外部依赖）
 */
(function () {
  "use strict";

  /* ========== DOM 引用 ========== */
  const $ = (id) => document.getElementById(id);
  const boardEl = $("board");
  const emptyEl = $("empty");
  const nameInput = $("teamName");
  const addBtn = $("addBtn");
  const resetBtn = $("resetBtn");
  const clearBtn = $("clearBtn");
  const fullscreenBtn = $("fullscreenBtn");

  /* ========== 数据模型 ==========
   * teams: Array<{ id: number, name: string, score: number }>
   * 持久化到 localStorage.scoreboardTeams
   */
  /* ---------- 生成唯一自增 id ----------
   * 返回值: number（基于时间戳 + 随机数，足够唯一）
   * 注意：必须在 loadTeams() 调用前声明，避免 TDZ 引用错误
   */
  let _idSeed = Date.now();
  function nextId() { return ++_idSeed; }

  const STORAGE_KEY = "scoreboardTeams";

  /* ---------- 加载持久化数据 ----------
   * 返回值: Array<{id,name,score}>；解析失败或为空返回默认 4 队
   */
  function loadTeams() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const parsed = raw ? JSON.parse(raw) : null;
      if (Array.isArray(parsed)) return parsed;
    } catch (e) {
      /* JSON 损坏时回退到默认 */
    }
    return [
      { id: nextId(), name: "第1组", score: 0 },
      { id: nextId(), name: "第2组", score: 0 },
      { id: nextId(), name: "第3组", score: 0 },
      { id: nextId(), name: "第4组", score: 0 }
    ];
  }

  let teams = loadTeams();

  /* ---------- 持久化保存 ---------- */
  function save() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(teams)); }
    catch (e) { /* 容量超限或隐私模式忽略 */ }
  }

  /* ---------- 按分数降序排序 ----------
   * 入参: teams 数组
   * 返回值: 新数组（不修改原数组），按 score 降序
   */
  function rankTeams(list) {
    return list.slice().sort((a, b) => b.score - a.score);
  }

  /* ---------- HTML 转义，防注入 ----------
   * 入参: string
   * 返回值: 转义后的安全字符串
   */
  function esc(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  /* ---------- 渲染积分榜 ----------
   * 根据当前 teams 排序后重新生成卡片 DOM
   * 异常场景：teams 为空时展示空状态
   */
  function render() {
    const ranked = rankTeams(teams);
    if (ranked.length === 0) {
      boardEl.innerHTML = "";
      emptyEl.hidden = false;
      return;
    }
    emptyEl.hidden = true;
    boardEl.innerHTML = ranked.map((t, idx) => {
      const rank = idx + 1;
      const rankClass = rank <= 3 ? `rank-${rank}` : "";
      return `
        <article class="card ${rankClass}" data-id="${t.id}">
          <div class="card-head">
            <input class="team-name" value="${esc(t.name)}" data-id="${t.id}" maxlength="12" aria-label="队伍名称">
            <span class="rank-badge" title="第 ${rank} 名">${rank}</span>
            <button class="del-team" data-id="${t.id}" title="删除该队" aria-label="删除该队">×</button>
          </div>
          <div class="score-wrap">
            <span class="score" data-id="${t.id}">${t.score}</span><span class="score-unit">分</span>
          </div>
          <div class="quick">
            <button class="quick-btn minus" data-id="${t.id}" data-d="-1" title="扣 1 分">−1</button>
            <button class="quick-btn plus"  data-id="${t.id}" data-d="1"  title="加 1 分">+1</button>
            <button class="quick-btn plus"  data-id="${t.id}" data-d="2"  title="加 2 分">+2</button>
            <button class="quick-btn plus"  data-id="${t.id}" data-d="5"  title="加 5 分">+5</button>
          </div>
          <div class="custom">
            <input type="number" min="-999" max="999" placeholder="自定义分值" data-id="${t.id}" aria-label="自定义分值">
            <button data-id="${t.id}" class="custom-add" title="加分">加分</button>
          </div>
        </article>`;
    }).join("");
  }

  /* ---------- 修改队伍分数并保存 ----------
   * 入参: id (number), delta (number, 正为加/负为扣)
   * 异常场景: id 不存在则忽略
   */
  function changeScore(id, delta) {
    const t = teams.find((x) => x.id === id);
    if (!t) return;
    t.score += delta;
    save();
    render();
    bumpScore(id);
  }

  /* ---------- 分数变化时的弹跳动画 ----------
   * 入参: id (number)
   */
  function bumpScore(id) {
    const el = boardEl.querySelector(`.score[data-id="${id}"]`);
    if (!el) return;
    el.classList.add("bump");
    setTimeout(() => el.classList.remove("bump"), 200);
  }

  /* ---------- 添加队伍 ----------
   * 入参: name (string)
   * 空名自动生成默认名
   */
  function addTeam(name) {
    const trimmed = (name || "").trim();
    const finalName = trimmed || `第${teams.length + 1}组`;
    teams.push({ id: nextId(), name: finalName, score: 0 });
    save();
    render();
  }

  /* ---------- 重命名队伍 ----------
   * 入参: id (number), name (string)
   * 空名保留原名
   */
  function renameTeam(id, name) {
    const t = teams.find((x) => x.id === id);
    if (!t) return;
    const trimmed = (name || "").trim();
    if (trimmed) t.name = trimmed;
    save();
  }

  /* ---------- 删除单个队伍 ----------
   * 入参: id (number)
   */
  function removeTeam(id) {
    teams = teams.filter((x) => x.id !== id);
    save();
    render();
  }

  /* ---------- 重置所有分数为 0 ---------- */
  function resetScores() {
    teams.forEach((t) => (t.score = 0));
    save();
    render();
  }

  /* ---------- 清空所有队伍 ---------- */
  function clearAll() {
    teams = [];
    save();
    render();
  }

  /* ---------- 切换全屏模式 ----------
   * 异常场景: 浏览器不支持 Fullscreen API 则静默
   */
  function toggleFullscreen() {
    const el = document.documentElement;
    if (!document.fullscreenElement && !document.webkitFullscreenElement) {
      (el.requestFullscreen || el.webkitRequestFullscreen || function () {}).call(el);
    } else {
      (document.exitFullscreen || document.webkitExitFullscreen || function () {}).call(document);
    }
  }

  /* ========== 事件绑定 ========== */
  // 添加按钮
  addBtn.addEventListener("click", () => {
    addTeam(nameInput.value);
    nameInput.value = "";
    nameInput.focus();
  });
  // 输入框回车提交
  nameInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") addBtn.click();
  });
  // 重置分数
  resetBtn.addEventListener("click", () => {
    if (teams.length === 0) return;
    if (confirm("确定将所有小组分数归零？")) resetScores();
  });
  // 清空所有
  clearBtn.addEventListener("click", () => {
    if (teams.length === 0) return;
    if (confirm("确定删除所有小组？此操作不可撤销。")) clearAll();
  });
  // 全屏
  fullscreenBtn.addEventListener("click", toggleFullscreen);

  // 卡片事件委托：加减分 / 自定义加分 / 重命名 / 删除
  boardEl.addEventListener("click", (e) => {
    const btn = e.target.closest("button");
    if (!btn) return;
    const id = Number(btn.dataset.id);
    if (btn.classList.contains("quick-btn")) {
      changeScore(id, Number(btn.dataset.d));
    } else if (btn.classList.contains("del-team")) {
      removeTeam(id);
    } else if (btn.classList.contains("custom-add")) {
      const input = btn.previousElementSibling;
      const val = parseInt(input.value, 10);
      if (Number.isNaN(val)) { input.focus(); return; }
      // 负数即扣分
      changeScore(id, val);
      input.value = "";
    }
  });

  // 自定义输入框回车提交
  boardEl.addEventListener("keydown", (e) => {
    if (e.key !== "Enter") return;
    const input = e.target.closest(".custom input");
    if (!input) return;
    const btn = input.nextElementSibling;
    btn.click();
  });

  // 重命名（失焦保存）
  boardEl.addEventListener("change", (e) => {
    const nameEl = e.target.closest(".team-name");
    if (!nameEl) return;
    renameTeam(Number(nameEl.dataset.id), nameEl.value);
  });
  boardEl.addEventListener("keydown", (e) => {
    const nameEl = e.target.closest(".team-name");
    if (!nameEl) return;
    if (e.key === "Enter") nameEl.blur();
  });

  /* ========== 初始化 ========== */
  render();
})();
