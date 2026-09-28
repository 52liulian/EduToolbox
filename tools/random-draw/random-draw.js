/* EduToolbox · 随机抽取工具核心逻辑
 * -----------------------------------------------------------------------------
 * 功能：
 *   1. 名单管理：输入/导入/导出/去重/排序/清空，实时人数统计
 *   2. 抽奖设置：抽中后移除、视觉音效、滚动速度（30-300ms）
 *   3. 滚动抽号：点击或按 Space/PageDown 开始滚动姓名，再次按下定格
 *   4. 流体背景：Canvas 绘制流动光球，营造沉浸式深色氛围
 *   5. 中奖记录：自动保存到 localStorage，支持复制导出与清空
 *   6. 全屏模式：调用 Fullscreen API，投影/大屏场景下隐藏设置面板
 *
 * 架构：纯前端 IIFE 模块，无后端依赖，支持 file:// 协议离线打开
 */

(function () {
  "use strict";

  const $ = (s) => document.querySelector(s);

  /* ========== 状态 ==========
   * rolling：是否正在滚动
   * pool：当前可抽取名单池（受"抽中后移除"影响动态变化）
   * records：中奖记录数组 [{name, time}]
   */
  const state = {
    rolling: false,
    pool: [],
    records: [],
    timer: null,
    speed: 50,
    removeAfter: true,
  };

  /* ========== 工具：保存/读取记录到 localStorage ==========
   * 兼容 file:// 协议下 localStorage 不可用场景，异常时降级为内存存储
   */
  const STORAGE_KEY = "random-draw-records";
  function loadRecords() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      state.records = raw ? JSON.parse(raw) : [];
    } catch (e) { state.records = []; }
  }
  function saveRecords() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state.records)); }
    catch (e) { /* file:// 协议下可能不可用，忽略 */ }
  }

  /* ========== 解析名单 ==========
   * 从 textarea 读取，按换行分割，去除空行与首尾空格
   * @returns {string[]} 姓名数组
   */
  function parseNames() {
    const raw = $("#participants").value;
    return raw.split(/\r?\n/).map(s => s.trim()).filter(Boolean);
  }

  /* ========== 更新名单池 + 人数显示 ========== */
  function refreshPool() {
    state.pool = parseNames();
    $("#count").textContent = state.pool.length;
  }

  /* ========== 渲染中奖记录列表 ==========
   * 倒序显示（最新在前），每条带序号、姓名、时间
   */
  function renderRecords() {
    const ul = $("#recordList");
    $("#recordCount").textContent = state.records.length;
    if (state.records.length === 0) {
      ul.innerHTML = '<li class="state state--list-item state--empty"><div class="state-icon">🎲</div><div class="state-title">暂无记录</div></li>';
      return;
    }
    ul.innerHTML = state.records.map((r, i) => `
      <li>
        <span><span class="r-num">${state.records.length - i}</span><span class="r-name">${escapeHtml(r.name)}</span></span>
        <span class="r-time">${r.time}</span>
      </li>`).join("");
  }

  /* ========== HTML 转义 ==========
   * 防止用户输入的姓名中包含 HTML 特殊字符导致 XSS
   */
  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, c => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;", "'": "&#39;"
    })[c]);
  }

  /* ========== 开始/停止滚动 ==========
   * 切换状态：
   *   - 未开始 → 启动定时器，按 speed 切换显示随机姓名
   *   - 滚动中 → 停止定时器，从 pool 中随机选一个作为最终中奖者
   *   - 抽中后从名单移除：从 #participants 中删除该姓名，刷新 pool
   */
  function toggleRoll() {
    if (state.rolling) {
      stopAndPick();
    } else {
      startRoll();
    }
  }

  /* ========== 开始滚动 ========== */
  function startRoll() {
    refreshPool();
    if (state.pool.length === 0) {
      $("#displayHint").textContent = "名单为空，请先输入姓名";
      return;
    }
    state.rolling = true;
    const display = $("#nameDisplay");
    const btn = $("#startBtn");
    display.classList.add("rolling");
    display.classList.remove("winner");
    btn.textContent = "停止";
    btn.classList.add("rolling");
    $("#displayHint").textContent = "按 Space 或 PageDown 停止";

    state.timer = setInterval(() => {
      const idx = Math.floor(Math.random() * state.pool.length);
      display.textContent = state.pool[idx];
    }, state.speed);
  }

  /* ========== 停止并抽取中奖者 ========== */
  function stopAndPick() {
    state.rolling = false;
    clearInterval(state.timer);
    state.timer = null;

    const display = $("#nameDisplay");
    const btn = $("#startBtn");
    display.classList.remove("rolling");

    /* 从池中随机选取一个作为最终中选者 */
    const winnerIdx = Math.floor(Math.random() * state.pool.length);
    const winner = state.pool[winnerIdx];

    display.textContent = winner;
    display.classList.add("winner");
    btn.textContent = "开始抽取";
    btn.classList.remove("rolling");
    $("#displayHint").textContent = `🎉 恭喜 ${winner}！`;

    /* 记录中奖结果 */
    const time = new Date();
    const timeStr = `${pad(time.getHours())}:${pad(time.getMinutes())}:${pad(time.getSeconds())}`;
    state.records.unshift({ name: winner, time: timeStr });
    saveRecords();
    renderRecords();

    /* 抽中后从名单移除 */
    if (state.removeAfter) {
      removeNameFromList(winner);
      refreshPool();
      if (state.pool.length === 0) {
        $("#displayHint").textContent = "🎉 全部抽完，请补充名单";
      }
    }
  }

  function pad(n) { return String(n).padStart(2, "0"); }

  /* ========== 从 textarea 删除指定姓名（仅删除第一个匹配项） ========== */
  function removeNameFromList(name) {
    const ta = $("#participants");
    const lines = ta.value.split(/\r?\n/);
    const idx = lines.findIndex(s => s.trim() === name);
    if (idx >= 0) {
      lines.splice(idx, 1);
      ta.value = lines.join("\n");
    }
  }

  /* ========== 名单操作：去重 / 排序 / 清空 / 导入 / 导出 ========== */
  function deduplicate() {
    const names = parseNames();
    const seen = new Set();
    const out = [];
    for (const n of names) {
      if (!seen.has(n)) { seen.add(n); out.push(n); }
    }
    $("#participants").value = out.join("\n");
    refreshPool();
  }
  function sortNames() {
    const names = parseNames();
    names.sort((a, b) => a.localeCompare(b, "zh-Hans-CN"));
    $("#participants").value = names.join("\n");
    refreshPool();
  }
  function clearNames() {
    if (!confirm("确定清空全部名单？")) return;
    $("#participants").value = "";
    refreshPool();
  }
  function importFile(file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      $("#participants").value = e.target.result;
      refreshPool();
    };
    reader.readAsText(file);
  }
  function exportNames() {
    const blob = new Blob([$("#participants").value], { type: "text/plain;charset=utf-8" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "名单.txt";
    link.click();
    URL.revokeObjectURL(link.href);
  }

  /* ========== 中奖记录操作：复制 / 清空 ========== */
  function copyRecords() {
    if (state.records.length === 0) { alert("暂无记录可复制"); return; }
    const text = state.records.map((r, i) => `${i + 1}. ${r.name}  ${r.time}`).join("\n");
    navigator.clipboard?.writeText(text).then(
      () => alert("已复制到剪贴板"),
      () => {
        /* 兜底：file:// 协议下 clipboard 可能不可用 */
        const ta = document.createElement("textarea");
        ta.value = text;
        document.body.appendChild(ta);
        ta.select();
        try { document.execCommand("copy"); alert("已复制到剪贴板"); }
        catch (e) { alert("复制失败，请手动选择"); }
        document.body.removeChild(ta);
      }
    );
  }
  function clearRecords() {
    if (state.records.length === 0) return;
    if (!confirm("确定清空全部中奖记录？")) return;
    state.records = [];
    saveRecords();
    renderRecords();
  }

  /* ========== 全屏与设置栏联动 ==========
   * ⛶ 全屏（自动隐藏设置栏）/ ⚙ 隐藏设置 已统一交给共享模块
   * assets/js/tool-stage-toolbar.js（init 在下方 init() 末尾调用），
   * 本文件不再维护 toggleFullscreen / 显隐 toggle 等重复逻辑。
   */

  /* ========== 流体背景动画 ==========
   * Canvas 绘制多个流动光球，营造沉浸式深色背景
   * 兼容 file:// 协议，无外部依赖
   */
  function initBackground() {
    const canvas = $("#bgCanvas");
    const ctx = canvas.getContext("2d");
    const balls = [];
    const COLORS = ["#a5b4fc", "#f0abfc", "#93c5fd", "#fde68a", "#c4b5fd"];
    let w = 0, h = 0;

    function resize() {
      w = canvas.width = canvas.offsetWidth;
      h = canvas.height = canvas.offsetHeight;
    }

    function initBalls() {
      balls.length = 0;
      const n = 8;
      for (let i = 0; i < n; i++) {
        balls.push({
          x: Math.random() * w,
          y: Math.random() * h,
          r: 80 + Math.random() * 120,
          dx: (Math.random() - 0.5) * 0.5,
          dy: (Math.random() - 0.5) * 0.5,
          color: COLORS[i % COLORS.length],
        });
      }
    }

    function draw() {
      ctx.clearRect(0, 0, w, h);
      balls.forEach(b => {
        b.x += b.dx;
        b.y += b.dy;
        if (b.x < -b.r) b.x = w + b.r;
        if (b.x > w + b.r) b.x = -b.r;
        if (b.y < -b.r) b.y = h + b.r;
        if (b.y > h + b.r) b.y = -b.r;
        const grad = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, b.r);
        grad.addColorStop(0, b.color);
        grad.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = grad;
        ctx.globalAlpha = 0.35;
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
        ctx.fill();
      });
      requestAnimationFrame(draw);
    }

    resize();
    initBalls();
    draw();
    window.addEventListener("resize", () => { resize(); initBalls(); });
  }

  /* ========== 绑定事件 ========== */
  function bindEvents() {
    /* 名单输入实时更新人数 */
    $("#participants").addEventListener("input", refreshPool);

    /* 名单操作按钮 */
    $("#dedupBtn").onclick = deduplicate;
    $("#sortBtn").onclick = sortNames;
    $("#clearBtn").onclick = clearNames;
    $("#importBtn").onclick = () => $("#fileInput").click();
    $("#fileInput").onchange = (e) => {
      const f = e.target.files[0];
      if (f) importFile(f);
      e.target.value = "";
    };
    $("#exportBtn").onclick = exportNames;

    /* 抽奖设置 */
    $("#removeAfter").onchange = (e) => state.removeAfter = e.target.checked;
    $("#speed").oninput = (e) => {
      state.speed = parseInt(e.target.value, 10);
      $("#speedVal").textContent = state.speed;
    };

    /* 中奖记录 */
    $("#copyRecord").onclick = copyRecords;
    $("#clearRecord").onclick = clearRecords;

    /* 开始抽取按钮 */
    $("#startBtn").onclick = toggleRoll;

    /* ⛶ 全屏（自动隐藏设置栏）/ ⚙ 隐藏设置 由共享模块接管，见 init() 末尾 */

    /* 键盘控制：Space / PageDown 开始/停止 */
    document.addEventListener("keydown", (e) => {
      if (e.code === "Space" || e.code === "PageDown") {
        /* 避免在 textarea 内按空格触发 */
        if (document.activeElement.tagName === "TEXTAREA" && e.code === "Space") return;
        e.preventDefault();
        toggleRoll();
      } else if (e.code === "F11") {
        /* 复用舞台右上角 ⛶ 按钮，避免再抄一份全屏逻辑 */
        e.preventDefault();
        const fb = $("#fullscreenBtn");
        if (fb) fb.click();
      }
    });
  }

  /* ========== 初始化 ========== */
  function init() {
    loadRecords();
    refreshPool();
    renderRecords();
    initBackground();
    bindEvents();
    // 舞台右上角工具栏（⛶ 全屏 / ⚙ 隐藏设置）：全屏目标是 #stage 自身，双栏容器 .main
    if (window.EduToolStageToolbar) {
      window.EduToolStageToolbar.init({ stage: "#stage", panelHost: ".main", hiddenClass: "setup-hidden" });
    }
  }

  document.addEventListener("DOMContentLoaded", init);
  window.__randomDrawInit = init;   // 供测试/e2e 触发（生产无影响）
})();
