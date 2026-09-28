/**
 * EduToolbox · 大屏滚动抽题工具核心逻辑
 * -----------------------------------------------------------------------------
 * 功能（参考 classtool.cn/chouti-2/）：
 *   1. 题库管理：题目|答案 格式，导入/导出/去重/清空/默认示例
 *   2. 抽题设置：抽中后移除（防重复）、滚动速度 30-300ms
 *   3. 超大数字滚动动画：抽号过程独立放大，再次点击锁定题目
 *   4. 答案隐藏与揭晓：抽中后答案默认隐藏，点击揭晓按钮平滑显示
 *   5. 状态实时追踪：总计 / 已抽 / 剩余，可重置抽题记录
 *   6. 全屏模式：Fullscreen API，投影/大屏场景下沉浸展示
 *   7. 流体背景：Canvas 绘制流动光球
 *   8. 历史记录：localStorage 持久化，支持复制 / 清空
 *   9. 键盘控制：Space / PageDown 开始 / 停止
 *
 * 架构：纯前端 IIFE 模块，无后端依赖，支持 file:// 协议离线打开
 */

(function () {
  "use strict";

  /** 简易选择器：按 id 取元素 */
  const $ = (id) => document.getElementById(id);

  /* ========== 全局状态 ==========
   * rolling：是否正在滚动
   * pool：当前可抽题池（受 removeAfter 影响）
   * allQuestions：题库全量（包含已抽出的，用于重置）
   * drawnSet：已抽题目索引集合（防重复）
   * records：抽题历史记录
   */
  const state = {
    rolling: false,
    pool: [],
    allQuestions: [],
    drawnSet: new Set(),
    records: [],
    timer: null,
    speed: 60,
    removeAfter: true,
    current: null, // 当前抽中的题目对象 {q, a, idx}
  };

  /** localStorage 键名 */
  const STORAGE_Q = "chouti2-questions";
  const STORAGE_R = "chouti2-records";

  /** 内置示例题库，用于"默认"按钮 */
  const DEFAULT_QUESTIONS = [
    "中国四大名著是哪些？|《水浒传》、《三国演义》、《西游记》、《红楼梦》",
    "太阳系中体积最大的行星是？|木星",
    "光的三原色是哪三种颜色？|红、绿、蓝",
    "“床前明月光”的下一句是？|疑是地上霜",
    "水在标准大气压下的沸点是多少度？|100摄氏度",
    "地球自转的方向是？|自西向东",
    "勾股定理的公式是什么？|a² + b² = c²",
    "中国四大发明是哪些？|造纸术、印刷术、火药、指南针",
  ];

  /* ========== localStorage 安全读写 ==========
   * 兼容 file:// 协议下 localStorage 不可用场景
   */
  function loadQ() {
    try {
      const raw = localStorage.getItem(STORAGE_Q);
      if (raw) {
        const arr = JSON.parse(raw);
        if (Array.isArray(arr) && arr.length) return arr;
      }
    } catch (e) {}
    return DEFAULT_QUESTIONS.slice();
  }
  function saveQ() {
    try { localStorage.setItem(STORAGE_Q, JSON.stringify(state.allQuestions)); }
    catch (e) {}
  }
  function loadR() {
    try {
      const raw = localStorage.getItem(STORAGE_R);
      state.records = raw ? JSON.parse(raw) : [];
    } catch (e) { state.records = []; }
  }
  function saveR() {
    try { localStorage.setItem(STORAGE_R, JSON.stringify(state.records)); }
    catch (e) {}
  }

  /* ========== HTML 转义 ==========
   * 防止用户输入 XSS
   * @param {string} s 待转义文本
   * @returns {string} 转义后安全文本
   */
  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, (c) => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
    }[c]));
  }

  /* ========== 解析题库 ==========
   * 从 textarea 读取，按行拆分，支持 题目|答案 格式
   * @returns {Array<{q:string,a:string}>} 题目对象数组
   */
  function parseQuestions() {
    const raw = $("qList").value;
    return raw.split(/\r?\n/).map(s => s.trim()).filter(Boolean).map(s => {
      const idx = s.indexOf("|");
      if (idx === -1) return { q: s, a: "" };
      return { q: s.slice(0, idx).trim(), a: s.slice(idx + 1).trim() };
    });
  }

  /* ========== 同步题库全量到 state ==========
   * 当用户编辑 textarea 时，更新 state.allQuestions 与可抽题池
   */
  function syncQuestionsFromTextarea() {
    state.allQuestions = parseQuestions();
    rebuildPool();
    saveQ();
    updateCountUI();
  }

  /* ========== 重建可抽题池 ==========
   * 根据 removeAfter 与 drawnSet 决定 pool 内容
   */
  function rebuildPool() {
    if (state.removeAfter) {
      state.pool = state.allQuestions
        .map((q, i) => ({ ...q, idx: i }))
        .filter(q => !state.drawnSet.has(q.idx));
    } else {
      state.pool = state.allQuestions.map((q, i) => ({ ...q, idx: i }));
    }
  }

  /* ========== 更新计数 UI ==========
   * 同步左侧"共 N 题"与右侧"总计/已抽/剩余"
   */
  function updateCountUI() {
    const total = state.allQuestions.length;
    const drawn = state.drawnSet.size;
    const remain = total - drawn;
    $("count").textContent = total;
    $("totalCount").textContent = total;
    $("drawnCount").textContent = drawn;
    $("remainCount").textContent = remain;
  }

  /* ========== 渲染历史记录 ==========
   * 倒序显示（最新在前），每条带序号、题号、题目、时间
   */
  function renderRecords() {
    const ul = $("recordList");
    $("recordCount").textContent = state.records.length;
    if (!state.records.length) {
      ul.innerHTML = '<li class="state state--list-item state--empty"><div class="state-icon">📋</div><div class="state-title">暂无记录</div></li>';
      return;
    }
    ul.innerHTML = state.records.map((r, i) => `
      <li>
        <span><span class="r-num">${state.records.length - i}</span><span class="r-name">${escapeHtml(r.q)}${r.a ? `<em> | ${escapeHtml(r.a)}</em>` : ""}</span></span>
        <span class="r-time">${r.time}</span>
      </li>`).join("");
  }

  /* ========== 当前时间字符串 ==========
   * @returns {string} HH:MM:SS
   */
  function nowTime() {
    const d = new Date();
    const p = (n) => String(n).padStart(2, "0");
    return `${p(d.getHours())}:${p(d.getMinutes())}:${p(d.getSeconds())}`;
  }

  /* ========== 流体背景 Canvas 动画 ==========
   * 绘制流动光球，营造沉浸式深色氛围
   * 适配设备像素比，自动响应窗口尺寸变化
   */
  function initBgCanvas() {
    const canvas = $("bgCanvas");
    const ctx = canvas.getContext("2d");
    const balls = [];
    const colors = ["#38bdf8", "#a78bfa", "#fbbf24", "#4ade80", "#f472b6"];

    /** 创建一颗光球 */
    function makeBall() {
      return {
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: 60 + Math.random() * 120,
        vx: (Math.random() - 0.5) * 0.6,
        vy: (Math.random() - 0.5) * 0.6,
        c: colors[Math.floor(Math.random() * colors.length)],
      };
    }
    /** 重置画布尺寸（响应窗口变化） */
    function resize() {
      const dpr = window.devicePixelRatio || 1;
      const w = canvas.clientWidth, h = canvas.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    resize();
    for (let i = 0; i < 6; i++) balls.push(makeBall());

    window.addEventListener("resize", resize);
    /** 动画主循环 */
    function tick() {
      const w = canvas.clientWidth, h = canvas.clientHeight;
      ctx.clearRect(0, 0, w, h);
      for (const b of balls) {
        b.x += b.vx; b.y += b.vy;
        if (b.x < -b.r) b.x = w + b.r;
        if (b.x > w + b.r) b.x = -b.r;
        if (b.y < -b.r) b.y = h + b.r;
        if (b.y > h + b.r) b.y = -b.r;
        const grad = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, b.r);
        grad.addColorStop(0, b.c + "cc");
        grad.addColorStop(1, b.c + "00");
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
        ctx.fill();
      }
      requestAnimationFrame(tick);
    }
    tick();
  }

  /* ========== 抽题动画 ==========
   * 启动滚动：超大数字与题目文本飞速刷新
   * 锁定：随机选一道题目，更新 UI，添加记录
   */
  function startRolling() {
    if (state.rolling) return;
    if (!state.pool.length) {
      $("displayHint").textContent = "题库已抽完，请重置记录或导入更多题目";
      return;
    }
    state.rolling = true;
    $("startBtn").textContent = "停止抽取";
    $("startBtn").classList.add("rolling");
    $("answerArea").classList.remove("show");
    $("qAnswer").classList.remove("show");
    $("qAnswer").textContent = "";
    $("revealBtn").classList.add("disabled");
    $("numDisplay").classList.add("rolling");
    $("qDisplay").classList.add("rolling");
    $("displayHint").textContent = "滚动中... 再次点击停止";

    const speed = state.speed;
    const tick = () => {
      const idx = Math.floor(Math.random() * state.pool.length);
      const q = state.pool[idx];
      const padded = String(q.idx + 1).padStart(2, "0");
      $("numDisplay").textContent = padded;
      $("qDisplay").textContent = q.q;
    };
    tick();
    state.timer = setInterval(tick, speed);
  }

  /** 停止滚动并锁定结果 */
  function stopRolling() {
    if (!state.rolling) return;
    state.rolling = false;
    clearInterval(state.timer);
    state.timer = null;
    $("numDisplay").classList.remove("rolling");
    $("qDisplay").classList.remove("rolling");

    // 随机锁定一道
    const pick = state.pool[Math.floor(Math.random() * state.pool.length)];
    state.current = pick;
    const padded = String(pick.idx + 1).padStart(2, "0");
    $("numDisplay").textContent = padded;
    $("numDisplay").classList.add("winner");
    setTimeout(() => $("numDisplay").classList.remove("winner"), 600);
    $("qDisplay").textContent = pick.q;
    $("qDisplay").classList.add("winner");
    setTimeout(() => $("qDisplay").classList.remove("winner"), 600);
    $("qIndex").textContent = `第 ${pick.idx + 1} 题`;
    $("answerArea").classList.add("show");
    $("revealBtn").classList.remove("disabled");
    $("displayHint").textContent = "抽中！可点击揭晓答案";
    $("startBtn").textContent = "继续抽题";
    $("startBtn").classList.remove("rolling");

    // 记录
    state.records.unshift({ q: pick.q, a: pick.a, time: nowTime() });
    if (state.records.length > 200) state.records.length = 200;
    saveR();
    renderRecords();

    // 防重复：从池中移除
    if (state.removeAfter) {
      state.drawnSet.add(pick.idx);
      rebuildPool();
    }
    updateCountUI();
  }

  /* ========== 揭晓答案 ========== */
  function revealAnswer() {
    if (!state.current) return;
    if ($("revealBtn").classList.contains("disabled")) return;
    const ans = state.current.a || "（未录入答案）";
    $("qAnswer").textContent = `答案：${ans}`;
    $("qAnswer").classList.add("show");
    $("revealBtn").classList.add("disabled");
  }

  /* ========== 切换滚动状态 ========== */
  function toggleRolling() {
    if (state.rolling) stopRolling();
    else startRolling();
  }

  /* ========== 重置抽题记录 ==========
   * 清空已抽集合，恢复题池
   */
  function resetDrawn() {
    state.drawnSet.clear();
    state.current = null;
    rebuildPool();
    updateCountUI();
    $("qIndex").textContent = "第 ? 题";
    $("numDisplay").textContent = "--";
    $("qDisplay").textContent = "等待抽取...";
    $("answerArea").classList.remove("show");
    $("qAnswer").classList.remove("show");
    $("qAnswer").textContent = "";
    $("displayHint").textContent = "已重置，点击下方按钮或按 Space 开始";
    $("startBtn").textContent = "开始抽题";
  }

  /* ========== 全屏与设置栏联动 ==========
   * ⛶ 全屏（自动隐藏设置栏）/ ⚙ 隐藏设置 已统一交给共享模块
   * assets/js/tool-stage-toolbar.js（init 在下方 init() 末尾调用），
   * 本文件不再维护 toggleFullscreen / toggleSetupPanel / 显隐快照等重复逻辑。
   */

  /* ========== 导入题库文件 ==========
   * 支持 .txt / .csv，按行读取
   */
  function importFile() {
    const file = $("fileInput").files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target.result;
      const existing = $("qList").value.trim();
      $("qList").value = (existing ? existing + "\n" : "") + text.trim();
      syncQuestionsFromTextarea();
    };
    reader.readAsText(file, "UTF-8");
    $("fileInput").value = "";
  }

  /* ========== 导出题库到 .txt ========== */
  function exportFile() {
    const text = $("qList").value;
    if (!text.trim()) { alert("题库为空，无可导出内容"); return; }
    const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "大屏滚动抽题题库.txt";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  /* ========== 去重 ========== */
  function deduplicate() {
    const seen = new Set();
    const lines = $("qList").value.split(/\r?\n/);
    const out = [];
    for (const ln of lines) {
      const k = ln.trim();
      if (!k) continue;
      if (seen.has(k)) continue;
      seen.add(k);
      out.push(k);
    }
    const removed = lines.length - out.length;
    $("qList").value = out.join("\n");
    syncQuestionsFromTextarea();
    alert(`去重完成，移除 ${removed} 条重复题目`);
  }

  /* ========== 清空题库 ========== */
  function clearAll() {
    if (!confirm("确认清空题库？此操作不可撤销。")) return;
    $("qList").value = "";
    state.drawnSet.clear();
    syncQuestionsFromTextarea();
    resetDrawn();
  }

  /* ========== 恢复默认题库 ========== */
  function restoreDefault() {
    if (!confirm("确认恢复为内置示例题库？当前编辑内容将被覆盖。")) return;
    $("qList").value = DEFAULT_QUESTIONS.join("\n");
    state.drawnSet.clear();
    syncQuestionsFromTextarea();
    resetDrawn();
  }

  /* ========== 复制抽题记录到剪贴板 ========== */
  function copyRecords() {
    if (!state.records.length) { alert("暂无记录可复制"); return; }
    const text = state.records.map((r, i) =>
      `${i + 1}. ${r.q}${r.a ? " | " + r.a : ""}  [${r.time}]`).join("\n");
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(() => alert("已复制到剪贴板")).catch(() => fallbackCopy(text));
    } else {
      fallbackCopy(text);
    }
  }
  /** 兼容性复制方案：使用 textarea + execCommand */
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

  /* ========== 清空抽题记录 ========== */
  function clearRecords() {
    if (!state.records.length) return;
    if (!confirm("确认清空抽题记录？")) return;
    state.records = [];
    saveR();
    renderRecords();
  }

  /* ========== 重置抽题记录按钮 ========== */
  function resetRecordBtn() {
    resetDrawn();
    state.records = [];
    saveR();
    renderRecords();
  }

  /* ========== 键盘控制 ==========
   * Space / PageDown：开始 / 停止
   * 忽略输入框中的按键
   */
  function onKeydown(e) {
    if (e.target && /^(TEXTAREA|INPUT)$/.test(e.target.tagName)) return;
    if (e.code === "Space" || e.code === "PageDown") {
      e.preventDefault();
      toggleRolling();
    } else if (e.code === "KeyR" && e.shiftKey) {
      e.preventDefault();
      resetDrawn();
    } else if (e.code === "KeyF" && e.shiftKey) {
      /* 复用舞台右上角 ⛶ 按钮，避免再抄一份全屏逻辑 */
      e.preventDefault();
      const fb = $("fullscreenBtn");
      if (fb) fb.click();
    }
  }

  /* ========== 初始化 ==========
   * 1. 加载 localStorage 题库与记录
   * 2. 绑定事件
   * 3. 启动流体背景
   */
  function init() {
    // 加载已存数据
    state.allQuestions = loadQ();
    loadR();
    $("qList").value = state.allQuestions.join("\n");
    rebuildPool();
    updateCountUI();
    renderRecords();

    // 题库编辑：失焦时同步
    $("qList").addEventListener("blur", syncQuestionsFromTextarea);

    // 抽题设置
    $("removeAfter").addEventListener("change", (e) => {
      state.removeAfter = e.target.checked;
      rebuildPool();
      updateCountUI();
    });
    $("speed").addEventListener("input", (e) => {
      state.speed = parseInt(e.target.value) || 60;
      $("speedVal").textContent = state.speed;
    });

    // 抽题按钮
    $("startBtn").addEventListener("click", toggleRolling);
    $("revealBtn").addEventListener("click", revealAnswer);

    // 工具栏（⛶ 全屏 / ⚙ 隐藏设置）由共享模块接管，见 init() 末尾

    // 题库管理按钮
    $("dedupBtn").addEventListener("click", deduplicate);
    $("clearBtn").addEventListener("click", clearAll);
    $("importBtn").addEventListener("click", () => $("fileInput").click());
    $("fileInput").addEventListener("change", importFile);
    $("exportBtn").addEventListener("click", exportFile);
    $("resetBtn").addEventListener("click", restoreDefault);

    // 记录管理
    $("copyRecord").addEventListener("click", copyRecords);
    $("clearRecord").addEventListener("click", clearRecords);
    $("resetRecord").addEventListener("click", resetRecordBtn);

    // 键盘
    document.addEventListener("keydown", onKeydown);

    // 流体背景
    initBgCanvas();

    // 舞台右上角工具栏（⛶ 全屏 / ⚙ 隐藏设置）：全屏目标是 #stage 自身，双栏容器 .main
    if (window.EduToolStageToolbar) {
      window.EduToolStageToolbar.init({ stage: "#stage", panelHost: ".main", hiddenClass: "setup-hidden" });
    }
  }

  // DOM 就绪后启动
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
