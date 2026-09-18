/**
 * EduToolbox · 滚动抽题（无答案版）核心逻辑
 * -----------------------------------------------------------------------------
 * 功能（参考 classtool.cn/chouti-3/）：
 *   1. 标题列表解析：每行一条，支持 "#001 标题" 自定义题号
 *   2. 大屏滚动抽取：题号滚动，再次点击锁定并展示对应标题
 *   3. 标题专注展示：只展示题号与标题，不包含答案
 *   4. 防重复抽取：默认不重复，可手动开启允许重复
 *   5. 外观自定义：题号字号、标题字号、颜色、滚动速度
 *   6. 全屏模式：Fullscreen API，大屏投影场景下沉浸展示
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
   * allQuestions：标题全量（含原始行号信息）
   * drawnSet：已抽题目索引集合
   * records：抽题历史记录
   */
  const state = {
    rolling: false,
    pool: [],
    allQuestions: [], // [{num: "001", title: "中国四大名著..."}]
    drawnSet: new Set(),
    records: [],
    timer: null,
    speed: 60,
    removeAfter: true,
    current: null,
  };

  /** localStorage 键名 */
  const STORAGE_Q = "chouti3-questions";
  const STORAGE_R = "chouti3-records";

  /** 内置示例标题列表，用于"默认"按钮 */
  const DEFAULT_QUESTIONS = [
    "001 中国四大名著是哪些？",
    "太阳系中体积最大的行星是？",
    "Z-03 光的三原色是哪三种颜色？",
    "“床前明月光”的下一句是？",
    "水在标准大气压下的沸点是多少度？",
    "请用一句话概括你心中理想的课堂应该是什么样子。",
    "请围绕“如果让你为班级设计一次主题活动，你会怎么策划”这个主题，分别从活动目标、流程安排、人员分工和展示方式四个角度，进行完整说明。",
  ];

  /* ========== localStorage 安全读写 ========== */
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
    try { localStorage.setItem(STORAGE_Q, JSON.stringify(state.allQuestions.map(q => q.raw))); }
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

  /* ========== HTML 转义 ========== */
  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, (c) => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
    }[c]));
  }

  /* ========== 解析标题列表 ==========
   * 从 textarea 读取，按行拆分
   * 支持 "#001 标题" 格式自定义题号；否则使用自然序号
   * @returns {Array<{num:string,title:string,raw:string,idx:number}>}
   */
  function parseQuestions() {
    const lines = $("qList").value.split(/\r?\n/).map(s => s.trim()).filter(Boolean);
    return lines.map((line, i) => {
      // 形如 "#001 标题" 自定义题号
      const m = line.match(/^#(\S+)\s+(.+)$/);
      if (m) {
        return { num: m[1], title: m[2], raw: line, idx: i };
      }
      return { num: String(i + 1).padStart(2, "0"), title: line, raw: line, idx: i };
    });
  }

  /* ========== 同步标题全量到 state ========== */
  function syncQuestionsFromTextarea() {
    state.allQuestions = parseQuestions();
    rebuildPool();
    saveQ();
    updateCountUI();
  }

  /* ========== 重建可抽题池 ========== */
  function rebuildPool() {
    if (state.removeAfter) {
      state.pool = state.allQuestions.filter(q => !state.drawnSet.has(q.idx));
    } else {
      state.pool = state.allQuestions.slice();
    }
  }

  /* ========== 更新计数 UI ========== */
  function updateCountUI() {
    const total = state.allQuestions.length;
    const drawn = state.drawnSet.size;
    const remain = total - drawn;
    $("count").textContent = total;
    $("totalCount").textContent = total;
    $("drawnCount").textContent = drawn;
    $("remainCount").textContent = remain;
  }

  /* ========== 渲染历史记录 ========== */
  function renderRecords() {
    const ul = $("recordList");
    $("recordCount").textContent = state.records.length;
    if (!state.records.length) {
      ul.innerHTML = '<li class="empty">暂无记录</li>';
      return;
    }
    ul.innerHTML = state.records.map((r, i) => `
      <li>
        <span><span class="r-num">${state.records.length - i}</span><span class="r-name"><em>${escapeHtml(r.num)}</em> ${escapeHtml(r.title)}</span></span>
        <span class="r-time">${r.time}</span>
      </li>`).join("");
  }

  /* ========== 当前时间字符串 ========== */
  function nowTime() {
    const d = new Date();
    const p = (n) => String(n).padStart(2, "0");
    return `${p(d.getHours())}:${p(d.getMinutes())}:${p(d.getSeconds())}`;
  }

  /* ========== 流体背景 Canvas ========== */
  function initBgCanvas() {
    const canvas = $("bgCanvas");
    const ctx = canvas.getContext("2d");
    const balls = [];
    const colors = ["#a78bfa", "#c084fc", "#fbbf24", "#f472b6", "#60a5fa"];

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

  /* ========== 抽题动画 ========== */
  function startRolling() {
    if (state.rolling) return;
    if (!state.pool.length) {
      $("displayHint").textContent = "标题列表已抽完，请重置记录或导入更多标题";
      return;
    }
    state.rolling = true;
    $("startBtn").textContent = "停止抽取";
    $("startBtn").classList.add("rolling");
    $("numDisplay").classList.add("rolling");
    $("qDisplay").classList.add("rolling");
    $("displayHint").textContent = "滚动中... 再次点击停止";

    const speed = state.speed;
    const tick = () => {
      const q = state.pool[Math.floor(Math.random() * state.pool.length)];
      $("numDisplay").textContent = q.num;
      $("qDisplay").textContent = q.title;
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

    const pick = state.pool[Math.floor(Math.random() * state.pool.length)];
    state.current = pick;
    $("numDisplay").textContent = pick.num;
    $("numDisplay").classList.add("winner");
    setTimeout(() => $("numDisplay").classList.remove("winner"), 600);
    $("qDisplay").textContent = pick.title;
    $("qDisplay").classList.add("winner");
    setTimeout(() => $("qDisplay").classList.remove("winner"), 600);
    $("qIndex").textContent = `第 ${pick.idx + 1} 题`;
    $("displayHint").textContent = "已抽中，可继续抽题";
    $("startBtn").textContent = "继续抽题";
    $("startBtn").classList.remove("rolling");

    // 记录
    state.records.unshift({ num: pick.num, title: pick.title, time: nowTime() });
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

  /* ========== 切换滚动状态 ========== */
  function toggleRolling() {
    if (state.rolling) stopRolling();
    else startRolling();
  }

  /* ========== 重置抽题记录 ========== */
  function resetDrawn() {
    state.drawnSet.clear();
    state.current = null;
    rebuildPool();
    updateCountUI();
    $("qIndex").textContent = "第 ? 题";
    $("numDisplay").textContent = "--";
    $("qDisplay").textContent = "等待抽取...";
    $("displayHint").textContent = "已重置，点击下方按钮或按 Space 开始";
    $("startBtn").textContent = "开始抽题";
  }

  /* ========== 全屏切换 ========== */
  function toggleFullscreen() {
    const stage = $("stage");
    if (!document.fullscreenElement) {
      (stage.requestFullscreen || stage.webkitRequestFullscreen || function(){}).call(stage);
    } else {
      (document.exitFullscreen || document.webkitExitFullscreen || function(){}).call(document);
    }
  }

  /* ========== 隐藏 / 显示左侧设置面板 ========== */
  function toggleSetupPanel() {
    $("main").classList.toggle("setup-hidden");
  }

  /* ========== 导入标题文件 ========== */
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

  /* ========== 导出标题到 .txt ========== */
  function exportFile() {
    const text = $("qList").value;
    if (!text.trim()) { alert("标题列表为空，无可导出内容"); return; }
    const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "滚动抽题标题列表.txt";
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
    alert(`去重完成，移除 ${removed} 条重复标题`);
  }

  /* ========== 清空标题列表 ========== */
  function clearAll() {
    if (!confirm("确认清空标题列表？此操作不可撤销。")) return;
    $("qList").value = "";
    state.drawnSet.clear();
    syncQuestionsFromTextarea();
    resetDrawn();
  }

  /* ========== 恢复默认标题列表 ========== */
  function restoreDefault() {
    if (!confirm("确认恢复为内置示例标题列表？当前编辑内容将被覆盖。")) return;
    $("qList").value = DEFAULT_QUESTIONS.join("\n");
    state.drawnSet.clear();
    syncQuestionsFromTextarea();
    resetDrawn();
  }

  /* ========== 复制抽题记录到剪贴板 ========== */
  function copyRecords() {
    if (!state.records.length) { alert("暂无记录可复制"); return; }
    const text = state.records.map((r, i) =>
      `${i + 1}. ${r.num} ${r.title}  [${r.time}]`).join("\n");
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(() => alert("已复制到剪贴板")).catch(() => fallbackCopy(text));
    } else {
      fallbackCopy(text);
    }
  }
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

  /* ========== 应用外观自定义 ==========
   * 根据设置面板的字号、颜色调整中央展示样式
   */
  function applyAppearance() {
    const numSize = parseInt($("numSize").value) || 200;
    const titleSize = parseInt($("titleSize").value) || 44;
    const numColor = $("numColor").value;
    const titleColor = $("titleColor").value;
    $("numDisplay").style.fontSize = numSize + "px";
    $("numDisplay").style.background = `linear-gradient(135deg, ${numColor} 0%, ${shade(numColor, 30)} 50%, ${shade(numColor, 80)} 100%)`;
    $("numDisplay").style.webkitBackgroundClip = "text";
    $("numDisplay").style.backgroundClip = "text";
    $("numDisplay").style.color = "transparent";
    $("qDisplay").style.fontSize = titleSize + "px";
    $("qDisplay").style.color = titleColor;
    $("numSizeVal").textContent = numSize;
    $("titleSizeVal").textContent = titleSize;
  }

  /** 简易颜色变换：返回 hex 颜色加上亮度偏移后的 hex */
  function shade(hex, amount) {
    const m = hex.match(/^#?([0-9a-f]{6})$/i);
    if (!m) return hex;
    const num = parseInt(m[1], 16);
    let r = (num >> 16) + amount, g = ((num >> 8) & 0xff) + amount, b = (num & 0xff) + amount;
    r = Math.max(0, Math.min(255, r));
    g = Math.max(0, Math.min(255, g));
    b = Math.max(0, Math.min(255, b));
    return "#" + ((r << 16) | (g << 8) | b).toString(16).padStart(6, "0");
  }

  /* ========== 键盘控制 ========== */
  function onKeydown(e) {
    if (e.target && /^(TEXTAREA|INPUT)$/.test(e.target.tagName)) return;
    if (e.code === "Space" || e.code === "PageDown") {
      e.preventDefault();
      toggleRolling();
    } else if (e.code === "KeyR" && e.shiftKey) {
      e.preventDefault();
      resetDrawn();
    } else if (e.code === "KeyF" && e.shiftKey) {
      e.preventDefault();
      toggleFullscreen();
    }
  }

  /* ========== 初始化 ========== */
  function init() {
    // 先把默认列表文本回填到 textarea，然后解析为对象数组
    const rawList = loadQ();
    $("qList").value = rawList.join("\n");
    state.allQuestions = parseQuestions();
    loadR();
    rebuildPool();
    updateCountUI();
    renderRecords();
    applyAppearance();

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
    $("numSize").addEventListener("input", applyAppearance);
    $("titleSize").addEventListener("input", applyAppearance);
    $("numColor").addEventListener("input", applyAppearance);
    $("titleColor").addEventListener("input", applyAppearance);

    // 抽题按钮
    $("startBtn").addEventListener("click", toggleRolling);

    // 工具栏
    $("fullscreenBtn").addEventListener("click", toggleFullscreen);
    $("hideSetupBtn").addEventListener("click", toggleSetupPanel);

    // 标题列表管理
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
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
