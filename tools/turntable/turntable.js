/* EduToolbox · 转盘抽选工具核心逻辑
 * -----------------------------------------------------------------------------
 * 功能：
 *   1. 选项管理：每行一个选项，去重/排序/清空/重置默认，实时计数
 *   2. 抽选设置：抽中后移除（本轮不重复）、自动保存选项到 localStorage
 *   3. Canvas 转盘绘制：彩色扇形分区，自动适配选项数量
 *   4. 旋转动画：CSS transition + 随机停止角度（旋转 6 圈 + 目标扇形中心）
 *   5. 中奖记录：自动保存到 localStorage，支持复制导出与清空
 *   6. 全屏模式：Fullscreen API，大屏投影
 *   7. 键盘控制：Space 开始抽选、F11 全屏
 *
 * 架构：纯前端 IIFE 模块，无后端依赖，支持 file:// 协议离线打开
 */

(function () {
  "use strict";

  const $ = (s) => document.querySelector(s);

  /* ========== 状态 ==========
   * opts：当前选项数组
   * spinning：是否正在旋转（旋转期间禁用按钮）
   * currentRotation：累计旋转角度（度），避免每次都从 0 开始
   * records：中奖记录数组 [{name, time}]
   */
  const state = {
    opts: [],
    spinning: false,
    currentRotation: 0,
    records: [],
    removeAfter: false,
    autoSave: true,
  };

  /* 转盘扇形颜色调色板 */
  const COLORS = [
    "#ef4444", "#f97316", "#eab308", "#22c55e",
    "#06b6d4", "#3b82f6", "#8b5cf6", "#ec4899",
    "#14b8a6", "#a855f7", "#84cc16", "#f43f5e",
    "#0ea5e9", "#facc15", "#10b981", "#f59e0b",
    "#6366f1", "#d946ef", "#22d3ee", "#fb7185",
  ];

  /* 默认选项（用户点击"重置默认"时使用） */
  const DEFAULT_OPTS = ["一等奖", "二等奖", "三等奖", "谢谢参与", "再来一次", "超级大奖"];

  /* ========== 工具：保存/读取到 localStorage ==========
   * 兼容 file:// 协议下 localStorage 不可用场景，异常时降级为内存存储
   */
  const OPTS_KEY = "turntable-opts";
  const RECORDS_KEY = "turntable-records";
  function loadOpts() {
    try {
      const raw = localStorage.getItem(OPTS_KEY);
      if (raw) {
        const arr = JSON.parse(raw);
        if (Array.isArray(arr) && arr.length) state.opts = arr;
      }
    } catch (e) { /* ignore */ }
  }
  function saveOpts() {
    if (!state.autoSave) return;
    try { localStorage.setItem(OPTS_KEY, JSON.stringify(state.opts)); }
    catch (e) { /* file:// 协议下可能不可用，忽略 */ }
  }
  function loadRecords() {
    try {
      const raw = localStorage.getItem(RECORDS_KEY);
      state.records = raw ? JSON.parse(raw) : [];
    } catch (e) { state.records = []; }
  }
  function saveRecords() {
    try { localStorage.setItem(RECORDS_KEY, JSON.stringify(state.records)); }
    catch (e) { /* ignore */ }
  }

  /* ========== 解析选项 ==========
   * 从 textarea 读取，按换行分割，去除空行与首尾空格
   * @returns {string[]} 选项数组
   */
  function parseOpts() {
    const raw = $("#opts").value;
    return raw.split(/\r?\n/).map(s => s.trim()).filter(Boolean);
  }

  /* ========== 更新选项 + 计数显示 + 重绘转盘 ========== */
  function refreshOpts() {
    state.opts = parseOpts();
    $("#optCount").textContent = state.opts.length;
    drawWheel();
    saveOpts();
  }

  /* ========== HTML 转义 ==========
   * 防止用户输入的选项中包含 HTML 特殊字符导致 XSS
   */
  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, c => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;", "'": "&#39;"
    })[c]);
  }

  /* ========== Canvas 绘制转盘 ==========
   * 根据 state.opts 数量绘制等分扇形，每个扇形中心写选项文字
   * 文字过长时自动截断（保持转盘美观）
   */
  function drawWheel() {
    const canvas = $("#wheel");
    const ctx = canvas.getContext("2d");
    const size = canvas.width;
    const cx = size / 2;
    const cy = size / 2;
    const r = size / 2 - 8;
    const n = state.opts.length;

    ctx.clearRect(0, 0, size, size);

    if (n === 0) {
      /* 空状态：绘制灰色圆环 */
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.fillStyle = "#f3f4f6";
      ctx.fill();
      ctx.strokeStyle = "#d1d5db";
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.fillStyle = "#9ca3af";
      ctx.font = "bold 18px sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("请输入选项", cx, cy);
      return;
    }

    const arc = (Math.PI * 2) / n;

    for (let i = 0; i < n; i++) {
      /* 起始角度：从顶部（-PI/2）开始，顺时针 */
      const start = i * arc - Math.PI / 2;
      const end = start + arc;

      /* 扇形背景 */
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, r, start, end);
      ctx.closePath();
      ctx.fillStyle = COLORS[i % COLORS.length];
      ctx.fill();
      ctx.strokeStyle = "#fff";
      ctx.lineWidth = 2;
      ctx.stroke();

      /* 扇形文字：旋转到扇形中心方向，沿径向绘制 */
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(start + arc / 2);
      ctx.fillStyle = "#fff";
      ctx.font = `bold ${n > 12 ? 14 : 18}px "PingFang SC", "Microsoft YaHei", sans-serif`;
      ctx.textAlign = "right";
      ctx.textBaseline = "middle";
      const maxLen = n > 8 ? 4 : 6;
      const text = state.opts[i].length > maxLen
        ? state.opts[i].substring(0, maxLen) + "…"
        : state.opts[i];
      ctx.fillText(text, r - 14, 0);
      ctx.restore();
    }

    /* 外圈金色描边 */
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.strokeStyle = "#fbbf24";
    ctx.lineWidth = 6;
    ctx.stroke();

    /* 中心金色圆盘（GO 按钮背景） */
    ctx.beginPath();
    ctx.arc(cx, cy, 52, 0, Math.PI * 2);
    ctx.fillStyle = "#fff";
    ctx.fill();
  }

  /* ========== 旋转并抽取 ==========
   * 旋转 6 圈 + 目标扇形中心对准顶部指针（指针在 -PI/2 = 顶部方向）
   * 由于指针固定在顶部，需让目标扇形中心旋转后到达顶部
   * 即 canvas 累计旋转角度 = 360 * 6 + (360 - winnerIndex * arc - arc/2)
   */
  function spin() {
    if (state.spinning || state.opts.length === 0) {
      if (state.opts.length === 0) {
        showResult("请先输入选项", false);
      }
      return;
    }
    state.spinning = true;
    const btn = $("#spin");
    btn.disabled = true;
    btn.textContent = "...";
    const result = $("#result");
    result.classList.remove("winner");
    result.textContent = "转盘旋转中…";

    const n = state.opts.length;
    const winnerIdx = Math.floor(Math.random() * n);
    const arcDeg = 360 / n;
    /* 旋转目标：让 winner 扇形中心对齐顶部指针
     * canvas 旋转角度（顺时针为正）
     * 当前扇形 i 的中心在 (i*arcDeg + arcDeg/2) 度（从顶部顺时针计算）
     * 要让该位置旋转到 0 度（顶部），需旋转角度 = -(i*arcDeg + arcDeg/2) + 360k
     * 加上 6 圈基础旋转：360*6 - (winnerIdx*arcDeg + arcDeg/2)
     */
    const targetAngle = 360 * 6 - (winnerIdx * arcDeg + arcDeg / 2);
    /* 累计旋转，保证每次都正向旋转（避免回转） */
    state.currentRotation = state.currentRotation - (state.currentRotation % 360) + targetAngle + 360;
    const canvas = $("#wheel");
    canvas.style.transform = `rotate(${state.currentRotation}deg)`;

    /* 旋转结束（5s + 缓冲） */
    setTimeout(() => {
      const winner = state.opts[winnerIdx];
      showResult(`🎉 ${winner}`, true);
      state.spinning = false;
      btn.disabled = false;
      btn.textContent = "GO";

      /* 记录中奖结果 */
      const time = new Date();
      const timeStr = `${pad(time.getHours())}:${pad(time.getMinutes())}:${pad(time.getSeconds())}`;
      state.records.unshift({ name: winner, time: timeStr });
      saveRecords();
      renderRecords();

      /* 抽中后从选项移除 */
      if (state.removeAfter) {
        removeOptFromList(winner);
        refreshOpts();
        if (state.opts.length === 0) {
          showResult("全部抽完，请补充选项", false);
        }
      }
    }, 5100);
  }

  function pad(n) { return String(n).padStart(2, "0"); }

  /* ========== 显示结果文字 ========== */
  function showResult(text, isWinner) {
    const el = $("#result");
    el.textContent = text;
    if (isWinner) el.classList.add("winner");
    else el.classList.remove("winner");
  }

  /* ========== 从 textarea 删除指定选项（仅删除第一个匹配项） ========== */
  function removeOptFromList(opt) {
    const ta = $("#opts");
    const lines = ta.value.split(/\r?\n/);
    const idx = lines.findIndex(s => s.trim() === opt);
    if (idx >= 0) {
      lines.splice(idx, 1);
      ta.value = lines.join("\n");
    }
  }

  /* ========== 渲染中奖记录列表 ========== */
  function renderRecords() {
    const ul = $("#recordList");
    $("#recordCount").textContent = state.records.length;
    if (state.records.length === 0) {
      ul.innerHTML = '<li class="state state--list-item state--empty"><div class="state-icon">🎯</div><div class="state-title">暂无记录</div></li>';
      return;
    }
    ul.innerHTML = state.records.map((r, i) => `
      <li>
        <span><span class="r-num">${state.records.length - i}</span><span class="r-name">${escapeHtml(r.name)}</span></span>
        <span class="r-time">${r.time}</span>
      </li>`).join("");
  }

  /* ========== 重置默认选项 ========== */
  function resetDefault() {
    if (!confirm("确定重置为默认选项？")) return;
    $("#opts").value = DEFAULT_OPTS.join("\n");
    refreshOpts();
  }

  /* ========== 中奖记录操作：复制 / 清空 ========== */
  function copyRecords() {
    if (state.records.length === 0) { alert("暂无记录可复制"); return; }
    const text = state.records.map((r, i) => `${i + 1}. ${r.name}  ${r.time}`).join("\n");
    navigator.clipboard?.writeText(text).then(
      () => alert("已复制到剪贴板"),
      () => {
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

  /* ========== 全屏切换 ==========
   * 调用 Fullscreen API，兼容前缀
   */
  function toggleFullscreen() {
    const stage = $("#stage");
    if (!document.fullscreenElement && !document.webkitFullscreenElement) {
      (stage.requestFullscreen || stage.webkitRequestFullscreen)?.call(stage);
    } else {
      (document.exitFullscreen || document.webkitExitFullscreen)?.call(document);
    }
  }

  /* ========== 绑定事件 ========== */
  function bindEvents() {
    $("#opts").addEventListener("input", refreshOpts);
    $("#resetBtn").onclick = resetDefault;

    $("#removeAfter").onchange = (e) => state.removeAfter = e.target.checked;
    $("#autoSave").onchange = (e) => {
      state.autoSave = e.target.checked;
      saveOpts();
    };

    $("#copyRecord").onclick = copyRecords;
    $("#clearRecord").onclick = clearRecords;

    $("#spin").onclick = spin;
    $("#fullscreenBtn").onclick = toggleFullscreen;

    /* 键盘控制：Space 开始抽选、F11 全屏 */
    document.addEventListener("keydown", (e) => {
      if (e.code === "Space") {
        if (document.activeElement.tagName === "TEXTAREA") return;
        e.preventDefault();
        spin();
      } else if (e.code === "F11") {
        e.preventDefault();
        toggleFullscreen();
      }
    });
  }

  /* ========== 初始化 ========== */
  function init() {
    loadOpts();
    loadRecords();
    /* 若 localStorage 中无选项，使用 textarea 默认值 */
    if (state.opts.length === 0) {
      state.opts = parseOpts();
    } else {
      $("#opts").value = state.opts.join("\n");
    }
    $("#optCount").textContent = state.opts.length;
    renderRecords();
    drawWheel();
    bindEvents();
  }

  document.addEventListener("DOMContentLoaded", init);
  window.__turntableInit = init;
})();
