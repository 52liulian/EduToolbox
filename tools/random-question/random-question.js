/* EduToolbox · 随机抽题工具核心逻辑
 * -----------------------------------------------------------------------------
 * 功能：
 *   1. 题目管理：输入/导入/导出/去重/清空/恢复默认，实时题数统计，支持"题目|答案"格式
 *   2. 抽题设置：抽中后移除、滚动速度（30-300ms）
 *   3. 滚动抽题：点击或按 Space/PageDown 开始滚动题目，再次按下定格
 *   4. 序号显示：抽取过程与结果页实时显示题目序号，方便对应题号
 *   5. 答案揭晓：抽中后一键揭晓/隐藏答案
 *   6. 流体背景：Canvas 绘制流动光球，营造沉浸式深色氛围
 *   7. 抽题记录：自动保存到 localStorage，支持复制导出与清空
 *   8. 题目持久化：题目列表自动保存到 localStorage，刷新不丢失
 *   9. 全屏模式：调用 Fullscreen API，投影/大屏场景下隐藏设置面板
 *
 * 架构：纯前端 IIFE 模块，无后端依赖，无外部库，支持 file:// 协议离线打开
 */

(function () {
  "use strict";

  /** 简易选择器：按 CSS 选择器取首个匹配元素 */
  const $ = (s) => document.querySelector(s);

  /* ========== 内置默认题库 ==========
   * 用户首次访问或点击"恢复默认"时使用，包含答案示例
   */
  const DEFAULT_QUESTIONS = `什么是光合作用？|植物利用光能将二氧化碳和水转化为有机物并释放氧气
牛顿第一定律的内容是什么？|物体在不受外力时保持静止或匀速直线运动
请背诵《静夜思》。
勾股定理的公式是什么？|a² + b² = c²
水的化学式是什么？|H₂O
中国四大发明是哪些？|造纸术、印刷术、火药、指南针
英语中元音字母有哪些？|a, e, i, o, u
地球自转的方向是？|自西向东
人体最大的器官是什么？|皮肤
圆周率的前5位小数是多少？|3.14159`;

  /* ========== 运行时状态 ==========
   * rolling：是否正在滚动
   * pool：当前可抽取题目池（受"抽中后移除"影响动态变化）
   * records：抽题记录数组 [{q, a, num, time}]
   * current：当前抽中的题目对象
   * answerRevealed：当前题目答案是否处于揭晓状态
   */
  const state = {
    rolling: false,
    pool: [],
    records: [],
    timer: null,
    speed: 50,
    removeAfter: true,
    current: null,
    answerRevealed: false,
  };

  /* ========== localStorage 键名 ========== */
  const STORAGE_KEY_LIST = "random-question-list";
  const STORAGE_KEY_RECORDS = "random-question-records";

  /* ========== 题目列表持久化 ==========
   * 从 localStorage 恢复题库；不可用时回退到默认题库
   */
  function loadList() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY_LIST);
      $("#qList").value = raw || DEFAULT_QUESTIONS;
    } catch (e) {
      $("#qList").value = DEFAULT_QUESTIONS;
    }
  }
  /** 保存题目列表到 localStorage；file:// 协议下可能不可用，异常忽略 */
  function saveList() {
    try { localStorage.setItem(STORAGE_KEY_LIST, $("#qList").value); }
    catch (e) { /* file:// 协议下可能不可用，忽略 */ }
  }

  /* ========== 抽题记录持久化 ========== */
  function loadRecords() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY_RECORDS);
      state.records = raw ? JSON.parse(raw) : [];
    } catch (e) { state.records = []; }
  }
  function saveRecords() {
    try { localStorage.setItem(STORAGE_KEY_RECORDS, JSON.stringify(state.records)); }
    catch (e) { /* 忽略 */ }
  }

  /* ========== 解析题目 ==========
   * 从 textarea 读取，按换行分割，去除空行与首尾空格
   * 支持 "题目|答案" 格式，| 之后内容作为答案
   * @returns {Array<{q:string, a:string, num:number}>} 题目对象数组
   */
  function parseQuestions() {
    const raw = $("#qList").value;
    return raw.split(/\r?\n/)
      .map(s => s.trim())
      .filter(Boolean)
      .map((s, i) => {
        const [q, a] = s.split("|");
        return { q: (q || "").trim(), a: (a || "").trim(), num: i + 1 };
      });
  }

  /* ========== 刷新题目池 + 题数显示 + 持久化 ========== */
  function refreshPool() {
    state.pool = parseQuestions();
    $("#count").textContent = state.pool.length;
    saveList();
  }

  /* ========== HTML 转义 ==========
   * 防止用户输入的题目/答案中包含 HTML 特殊字符导致 XSS
   * @param {string} s 原始字符串
   * @returns {string} 转义后的安全字符串
   */
  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, c => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;", "'": "&#39;"
    })[c]);
  }

  /* ========== 渲染抽题记录列表 ==========
   * 倒序显示（最新在前），每条带序号、题目、答案（若有）、时间
   */
  function renderRecords() {
    const ul = $("#recordList");
    $("#recordCount").textContent = state.records.length;
    if (state.records.length === 0) {
      ul.innerHTML = '<li class="empty">暂无记录</li>';
      return;
    }
    ul.innerHTML = state.records.map((r, i) => `
      <li>
        <span class="r-name"><span class="r-num">${state.records.length - i}</span>第${r.num}题 · ${escapeHtml(r.q)}${r.a ? ` <em>· ${escapeHtml(r.a)}</em>` : ""}</span>
        <span class="r-time">${r.time}</span>
      </li>`).join("");
  }

  /* ========== 切换滚动 / 抽取 ==========
   * 未滚动 → 启动定时器滚动随机题目
   * 滚动中 → 停止定时器，定格并抽取最终题目
   */
  function toggleRoll() {
    if (state.rolling) stopAndPick();
    else startRoll();
  }

  /* ========== 开始滚动 ==========
   * 启动定时器按 speed 间隔切换显示随机题目与序号
   * 题库为空时给出提示并中止
   */
  function startRoll() {
    refreshPool();
    if (state.pool.length === 0) {
      $("#displayHint").textContent = "题库为空，请先输入题目";
      return;
    }
    state.rolling = true;
    state.answerRevealed = false;

    const qDisplay = $("#qDisplay");
    const qIndex = $("#qIndex");
    const btn = $("#startBtn");
    qDisplay.classList.add("rolling");
    qDisplay.classList.remove("winner");
    btn.textContent = "停止";
    btn.classList.add("rolling");
    $("#displayHint").textContent = "按 Space 或 PageDown 停止";
    $("#answerArea").classList.remove("show");
    $("#qAnswer").textContent = "";

    state.timer = setInterval(() => {
      const idx = Math.floor(Math.random() * state.pool.length);
      const item = state.pool[idx];
      qIndex.textContent = `第 ${item.num} 题`;
      qDisplay.textContent = item.q;
    }, state.speed);
  }

  /* ========== 停止并抽取最终题目 ==========
   * 停止定时器，从池中随机选取一题作为最终结果
   * 显示题目序号与文本，准备答案揭晓按钮，记录抽题结果
   * 若开启"抽中后移除"，从 textarea 中删除该题目并刷新池
   */
  function stopAndPick() {
    state.rolling = false;
    clearInterval(state.timer);
    state.timer = null;

    const qDisplay = $("#qDisplay");
    const qIndex = $("#qIndex");
    const btn = $("#startBtn");
    qDisplay.classList.remove("rolling");

    /* 从池中随机选取一题作为最终抽中题目 */
    const winnerIdx = Math.floor(Math.random() * state.pool.length);
    const winner = state.pool[winnerIdx];
    state.current = winner;
    state.answerRevealed = false;

    qIndex.textContent = `第 ${winner.num} 题`;
    qDisplay.textContent = winner.q;
    qDisplay.classList.add("winner");
    btn.textContent = "继续抽题";
    btn.classList.remove("rolling");
    $("#displayHint").textContent = "🎉 已抽中！可点击下方揭晓答案";

    /* 准备答案揭晓区：有答案则显示揭晓按钮，无答案则提示 */
    const ansArea = $("#answerArea");
    ansArea.classList.add("show");
    if (winner.a) {
      $("#revealBtn").style.display = "";
      $("#revealBtn").textContent = "👁 揭晓答案";
      $("#qAnswer").textContent = "";
    } else {
      $("#revealBtn").style.display = "none";
      $("#qAnswer").textContent = "（本题未配置答案）";
    }

    /* 记录抽题结果 */
    const time = new Date();
    const timeStr = `${pad(time.getHours())}:${pad(time.getMinutes())}:${pad(time.getSeconds())}`;
    state.records.unshift({ q: winner.q, a: winner.a, num: winner.num, time: timeStr });
    saveRecords();
    renderRecords();

    /* 抽中后从题库移除 */
    if (state.removeAfter) {
      removeQuestionFromList(winner.q);
      refreshPool();
      if (state.pool.length === 0) {
        $("#displayHint").textContent = "🎉 全部抽完，请补充题目";
      }
    }
  }

  /* ========== 揭晓 / 隐藏答案 ==========
   * 切换当前题目答案的显示状态
   * 揭晓时显示"答案：xxx"，按钮变为"隐藏答案"
   * 隐藏时清空答案文本，按钮恢复"揭晓答案"
   */
  function toggleReveal() {
    if (!state.current) return;
    const ans = $("#qAnswer");
    const btn = $("#revealBtn");
    if (state.answerRevealed) {
      ans.textContent = "";
      btn.textContent = "👁 揭晓答案";
      state.answerRevealed = false;
    } else {
      ans.textContent = `答案：${state.current.a}`;
      btn.textContent = "🙈 隐藏答案";
      state.answerRevealed = true;
    }
  }

  /** 数字补零至两位 */
  function pad(n) { return String(n).padStart(2, "0"); }

  /* ========== 从 textarea 删除指定题目（仅删除第一个题目文本匹配项） ==========
   * @param {string} q 题目文本（不含答案）
   */
  function removeQuestionFromList(q) {
    const ta = $("#qList");
    const lines = ta.value.split(/\r?\n/);
    const idx = lines.findIndex(s => {
      const [qq] = s.split("|");
      return (qq || "").trim() === q;
    });
    if (idx >= 0) {
      lines.splice(idx, 1);
      ta.value = lines.join("\n");
    }
  }

  /* ========== 题目操作：去重 / 清空 / 导入 / 导出 / 恢复默认 ========== */
  /** 去除重复题目（按 题目|答案 组合键去重，保留首次出现） */
  function deduplicate() {
    const items = parseQuestions();
    const seen = new Set();
    const out = [];
    for (const it of items) {
      const key = it.q + "|" + it.a;
      if (!seen.has(key)) {
        seen.add(key);
        out.push(it.a ? `${it.q}|${it.a}` : it.q);
      }
    }
    $("#qList").value = out.join("\n");
    refreshPool();
  }
  /** 清空题库（需二次确认） */
  function clearQuestions() {
    if (!confirm("确定清空全部题目？")) return;
    $("#qList").value = "";
    refreshPool();
  }
  /** 从 .txt / .csv 文件导入题目列表 */
  function importFile(file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      $("#qList").value = e.target.result;
      refreshPool();
    };
    reader.readAsText(file);
  }
  /** 导出当前题库为 .txt 文件 */
  function exportQuestions() {
    const blob = new Blob([$("#qList").value], { type: "text/plain;charset=utf-8" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "题目列表.txt";
    link.click();
    URL.revokeObjectURL(link.href);
  }
  /** 恢复为内置默认题库（需二次确认） */
  function resetToDefault() {
    if (!confirm("确定恢复为默认题目列表？当前题库将被替换。")) return;
    $("#qList").value = DEFAULT_QUESTIONS;
    refreshPool();
  }

  /* ========== 抽题记录操作：复制 / 清空 ========== */
  /** 复制全部抽题记录到剪贴板，兼容 file:// 协议降级 */
  function copyRecords() {
    if (state.records.length === 0) { alert("暂无记录可复制"); return; }
    const text = state.records.map((r, i) =>
      `${i + 1}. [第${r.num}题] ${r.q}${r.a ? "  答案：" + r.a : ""}  ${r.time}`
    ).join("\n");
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(text).then(
        () => alert("已复制到剪贴板"),
        () => fallbackCopy(text)
      );
    } else {
      fallbackCopy(text);
    }
  }
  /** 兜底复制：使用临时 textarea + execCommand("copy") */
  function fallbackCopy(text) {
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    try { document.execCommand("copy"); alert("已复制到剪贴板"); }
    catch (e) { alert("复制失败，请手动选择"); }
    document.body.removeChild(ta);
  }
  /** 清空全部抽题记录（需二次确认） */
  function clearRecords() {
    if (state.records.length === 0) return;
    if (!confirm("确定清空全部抽题记录？")) return;
    state.records = [];
    saveRecords();
    renderRecords();
  }

  /* ========== 全屏切换 ==========
   * 调用 Fullscreen API，兼容 webkit 前缀
   */
  function toggleFullscreen() {
    const stage = $("#stage");
    if (!document.fullscreenElement && !document.webkitFullscreenElement) {
      (stage.requestFullscreen || stage.webkitRequestFullscreen)?.call(stage);
    } else {
      (document.exitFullscreen || document.webkitExitFullscreen)?.call(document);
    }
  }

  /* ========== 流体背景动画 ==========
   * Canvas 绘制多个流动光球，营造沉浸式深色舞台氛围
   * 纯本地绘制，无外部依赖，兼容 file:// 协议
   */
  function initBackground() {
    const canvas = $("#bgCanvas");
    const ctx = canvas.getContext("2d");
    const balls = [];
    const COLORS = ["#5eead4", "#f0abfc", "#93c5fd", "#fde68a", "#c4b5fd"];
    let w = 0, h = 0;

    /** 按画布显示尺寸调整内部像素分辨率 */
    function resize() {
      w = canvas.width = canvas.offsetWidth;
      h = canvas.height = canvas.offsetHeight;
    }
    /** 初始化光球数组：随机位置、半径、速度、颜色 */
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
    /** 帧绘制：清空画布，逐个绘制带径向渐变的光球，越界回绕 */
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

  /* ========== 绑定全部事件 ========== */
  function bindEvents() {
    /* 题目输入实时更新题数 + 持久化 */
    $("#qList").addEventListener("input", refreshPool);

    /* 题目操作按钮 */
    $("#dedupBtn").onclick = deduplicate;
    $("#clearBtn").onclick = clearQuestions;
    $("#importBtn").onclick = () => $("#fileInput").click();
    $("#fileInput").onchange = (e) => {
      const f = e.target.files[0];
      if (f) importFile(f);
      e.target.value = "";
    };
    $("#exportBtn").onclick = exportQuestions;
    $("#resetBtn").onclick = resetToDefault;

    /* 抽题设置 */
    $("#removeAfter").onchange = (e) => state.removeAfter = e.target.checked;
    $("#speed").oninput = (e) => {
      state.speed = parseInt(e.target.value, 10);
      $("#speedVal").textContent = state.speed;
    };

    /* 抽题记录 */
    $("#copyRecord").onclick = copyRecords;
    $("#clearRecord").onclick = clearRecords;

    /* 抽题按钮 + 答案揭晓按钮 */
    $("#startBtn").onclick = toggleRoll;
    $("#revealBtn").onclick = toggleReveal;

    /* 全屏 / 隐藏设置 */
    $("#fullscreenBtn").onclick = toggleFullscreen;
    $("#hideSetupBtn").onclick = () => {
      document.querySelector(".main").classList.toggle("setup-hidden");
    };

    /* 键盘控制：Space / PageDown 开始/停止；F11 切换全屏 */
    document.addEventListener("keydown", (e) => {
      if (e.code === "Space" || e.code === "PageDown") {
        /* 避免在 textarea 内按空格触发抽题 */
        if (document.activeElement.tagName === "TEXTAREA" && e.code === "Space") return;
        e.preventDefault();
        toggleRoll();
      } else if (e.code === "F11") {
        e.preventDefault();
        toggleFullscreen();
      }
    });
  }

  /* ========== 初始化 ========== */
  function init() {
    loadList();
    loadRecords();
    refreshPool();
    renderRecords();
    initBackground();
    bindEvents();
  }

  document.addEventListener("DOMContentLoaded", init);
  window.__randomQuestionInit = init;   // 供测试/e2e 触发（生产无影响）
})();
