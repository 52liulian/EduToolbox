/**
 * EduToolbox · 滚动抽题（多题版）核心逻辑
 * -----------------------------------------------------------------------------
 * 功能（参考 classtool.cn/chouti-4/）：
 *   1. 无答案标题抽取：只展示题号与标题，不显示答案
 *   2. 多题连抽：可指定每次抽取数量，一次随机抽出多道题目
 *   3. 滚动题号抽取：点击开始后中央以大字号滚动显示题号预览
 *   4. 标题结果独立滚动：结果区占据按钮上方剩余高度，长标题内部滚动
 *   5. 逐行清洗展示：多段标题展示前逐行去除空行与首尾空白
 *   6. 题库与记录管理：重置 / 允许重复 / 删除单条 / 清空题库
 *   7. 全屏模式：Fullscreen API，大屏投影场景下沉浸展示
 *   8. 流体背景：Canvas 绘制流动光球
 *   9. 历史记录：localStorage 持久化，支持复制 / 清空
 *  10. 键盘控制：Space / PageDown 开始 / 停止
 *
 * 架构：纯前端 IIFE 模块，无后端依赖，支持 file:// 协议离线打开
 */

(function () {
  "use strict";

  /** 简易选择器：按 id 取元素 */
  const $ = (id) => document.getElementById(id);

  /* ========== 全局状态 ==========
   * rolling：是否正在滚动
   * pool：当前可抽题池
   * allQuestions：标题全量
   * drawnSet：已抽题目索引集合
   * records：抽题历史记录（每轮一组）
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
    drawCount: 3,
  };

  /** localStorage 键名 */
  const STORAGE_Q = "chouti4-questions";
  const STORAGE_R = "chouti4-records";

  /** 内置示例标题列表，用于"默认"按钮 */
  const DEFAULT_QUESTIONS = [
    "001 中国四大名著是哪些？",
    "太阳系中体积最大的行星是？",
    "Z-03 光的三原色是哪三种颜色？",
    ""床前明月光"的下一句是？ 水在标准大气压下的沸点是多少度？",
    "008 请用一句话概括你心中理想的课堂应该是什么样子。",
    "这是一个较长的标题示例：请结合你最近一次课堂展示或小组合作的经历，分享你在准备过程、临场表达以及与同伴协作方面最值得总结的一点经验。",
    "010 下面是一条多段标题示例：\n第一段，请说明你认为阅读习惯对学习能力提升有哪些帮助。\n第二段，请结合自己的实际经历，说说你是如何坚持每天阅读并逐步形成稳定习惯的。\n第三段，请再补充一个你最想推荐给同学的阅读方法或阅读工具。",
    "04 请围绕"如果让你为班级设计一次主题活动，你会怎么策划"这个主题，分别从活动目标、流程安排、人员分工和展示方式四个角度，进行完整说明。",
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
   * 支持自定义题号：行首形如 "#001 标题内容" 或 "001 标题内容" / "Z-03 标题"
   * 若一行本身就是空行结尾，则跳过空行
   * 多行标题（同一题号下连续换行）会被合并：将首行的题号抽出作为 num，
   * 后续非空行作为多段标题
   * @returns {Array<{num:string,title:string,raw:string,idx:number}>}
   */
  function parseQuestions() {
    const lines = $("qList").value.split(/\r?\n/);
    const out = [];
    let i = 0;
    let seqIdx = 0;
    while (i < lines.length) {
      const line = lines[i];
      const trimmed = line.trim();
      if (!trimmed) { i++; continue; }
      // 识别题号：#xxx / xxx 后跟空格 + 标题
      // 题号格式：字母数字 + 短横，长度 1-8
      let num = null, titleFirst = trimmed;
      const mHash = trimmed.match(/^#([A-Za-z0-9\-]{1,8})\s+(.+)$/);
      if (mHash) {
        num = mHash[1];
        titleFirst = mHash[2];
      } else {
        const mPlain = trimmed.match(/^([A-Za-z0-9\-]{1,8})\s+(.+)$/);
        // 仅当首段较短像编号时才识别，否则整行作为标题
        if (mPlain && mPlain[1].length <= 4) {
          num = mPlain[1];
          titleFirst = mPlain[2];
        }
      }
      const titleLines = [titleFirst];
      i++;
      // 合并后续非空连续行（无题号识别）
      while (i < lines.length) {
        const next = lines[i];
        const nextTrim = next.trim();
        if (!nextTrim) { i++; continue; }
        // 如果下一行看起来是新题号（带 # 前缀或纯短编号 + 空格 + 内容），停止合并
        if (/^#[A-Za-z0-9\-]{1,8}\s+/.test(nextTrim)) break;
        // 普通纯短编号也判定为新题（如 "001 ..." / "04 ..."）
        if (/^[A-Za-z0-9\-]{1,4}\s+\S/.test(nextTrim) && nextTrim.split(/\s+/)[0].length <= 4) break;
        titleLines.push(nextTrim);
        i++;
      }
      if (num === null) num = String(seqIdx + 1).padStart(2, "0");
      const cleanedTitle = cleanMultiline(titleLines.join("\n"));
      out.push({ num, title: cleanedTitle, raw: trimmed, idx: seqIdx });
      seqIdx++;
    }
    return out;
  }

  /** 逐行清洗多行标题：去除空行 + 每行首尾空白，按普通换行拼接 */
  function cleanMultiline(text) {
    return text.split(/\r?\n/)
      .map(s => s.trim())
      .filter(Boolean)
      .join("\n");
  }

  /* ========== 同步标题全量到 state ========== */
  function syncQuestionsFromTextarea() {
    state.allQuestions = parseQuestions();
    rebuildPool();
    saveQ();
    updateCountUI();
    clampDrawCount();
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
    $("roundCount").textContent = clampDrawCount();
  }

  /** 将本轮抽取数量限制为不超过剩余可抽数量 */
  function clampDrawCount() {
    const remaining = state.removeAfter
      ? (state.allQuestions.length - state.drawnSet.size)
      : state.allQuestions.length;
    let n = parseInt($("drawCount").value) || 1;
    if (n < 1) n = 1;
    if (state.allQuestions.length > 0 && n > remaining && state.removeAfter) {
      n = Math.max(1, remaining);
    }
    if (state.allQuestions.length > 0 && n > state.allQuestions.length) {
      n = state.allQuestions.length;
    }
    $("drawCount").value = n;
    state.drawCount = n;
    $("roundCount").textContent = n;
    return n;
  }

  /* ========== 渲染历史记录 ==========
   * 每条记录是一轮抽题：{ round, items: [{num,title}], time }
   */
  function renderRecords() {
    const ul = $("recordList");
    $("recordCount").textContent = state.records.length;
    if (!state.records.length) {
      ul.innerHTML = '<li class="empty">暂无记录</li>';
      return;
    }
    ul.innerHTML = state.records.map((r, i) => `
      <li>
        <span><span class="r-num">${state.records.length - i}</span><span class="r-name"><em>第 ${r.round} 轮</em> ${r.items.map(it => escapeHtml(it.num)).join(" / ")}</span></span>
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
    const colors = ["#38bdf8", "#818cf8", "#fbbf24", "#4ade80", "#f472b6"];

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

  /* ========== 滚动动画 ==========
   * 启动滚动：单题号预览滚动；再次点击则锁定本轮多题结果
   */
  function startRolling() {
    if (state.rolling) return;
    if (!state.pool.length) {
      $("qDisplay").textContent = "标题已抽完，请重置记录或导入更多标题";
      return;
    }
    state.rolling = true;
    $("startBtn").textContent = "停止抽取";
    $("startBtn").classList.add("rolling");
    $("numDisplay").classList.add("rolling");
    $("qDisplay").classList.add("rolling");
    $("qIndex").textContent = `本轮 ${clampDrawCount()} 题 · 滚动中`;
    $("resultsEmpty").textContent = "滚动中... 再次点击停止锁定本轮结果";

    const speed = state.speed;
    const tick = () => {
      const q = state.pool[Math.floor(Math.random() * state.pool.length)];
      $("numDisplay").textContent = q.num;
      $("qDisplay").textContent = q.title.split("\n")[0];
    };
    tick();
    state.timer = setInterval(tick, speed);
  }

  /** 停止滚动并锁定本轮多题结果 */
  function stopRolling() {
    if (!state.rolling) return;
    state.rolling = false;
    clearInterval(state.timer);
    state.timer = null;
    $("numDisplay").classList.remove("rolling");
    $("qDisplay").classList.remove("rolling");
    $("startBtn").textContent = "继续抽题";
    $("startBtn").classList.remove("rolling");

    // 按本轮数量随机抽出（不重复）
    clampDrawCount();
    const n = Math.min(state.drawCount, state.pool.length);
    const picked = pickRandomN(state.pool, n);

    // 渲染结果卡片
    const ul = $("resultsList");
    if (picked.length) {
      $("resultsEmpty").style.display = "none";
      ul.innerHTML = picked.map((p, idx) => `
        <li class="result-card" style="animation-delay:${idx * 0.08}s">
          <div class="card-header">
            <span class="card-idx">第 ${idx + 1} 题</span>
            <span class="card-num">${escapeHtml(p.num)}</span>
          </div>
          <div class="card-title">${escapeHtml(p.title)}</div>
        </li>`).join("");
      $("previewArea").classList.add("compact");
      $("qIndex").textContent = `本轮抽中 ${picked.length} 题`;
      $("numDisplay").textContent = picked[0].num;
      $("qDisplay").textContent = picked[0].title.split("\n")[0];
    } else {
      $("resultsEmpty").style.display = "flex";
      $("resultsEmpty").textContent = "无可用标题，请重置记录或导入";
      ul.innerHTML = "";
    }

    // 记录与防重复
    if (picked.length) {
      const round = state.records.length + 1;
      state.records.unshift({
        round,
        items: picked.map(p => ({ num: p.num, title: p.title })),
        time: nowTime(),
      });
      if (state.records.length > 200) state.records.length = 200;
      saveR();
      renderRecords();

      if (state.removeAfter) {
        picked.forEach(p => state.drawnSet.add(p.idx));
        rebuildPool();
      }
    }
    updateCountUI();
  }

  /** 从数组中随机抽取 n 个不重复元素（Fisher-Yates 部分洗牌） */
  function pickRandomN(arr, n) {
    const a = arr.slice();
    const out = [];
    const k = Math.min(n, a.length);
    for (let i = 0; i < k; i++) {
      const j = i + Math.floor(Math.random() * (a.length - i));
      [a[i], a[j]] = [a[j], a[i]];
      out.push(a[i]);
    }
    return out;
  }

  /* ========== 切换滚动状态 ========== */
  function toggleRolling() {
    if (state.rolling) stopRolling();
    else startRolling();
  }

  /* ========== 重置抽题记录 ========== */
  function resetDrawn() {
    state.drawnSet.clear();
    rebuildPool();
    updateCountUI();
    $("qIndex").textContent = "准备抽取";
    $("numDisplay").textContent = "--";
    $("qDisplay").textContent = "等待开始...";
    $("previewArea").classList.remove("compact");
    $("resultsEmpty").style.display = "flex";
    $("resultsEmpty").textContent = "点击下方按钮或按 Space 开始一轮多题抽取";
    $("resultsList").innerHTML = "";
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
    a.download = "滚动抽题多题版标题列表.txt";
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
    let lastNonEmpty = "";
    for (const ln of lines) {
      const k = ln.trim();
      if (!k) {
        // 保留段落间空行用于多行标题分隔？为简单起见：连续空行只保留 1 个
        if (lastNonEmpty) out.push("");
        continue;
      }
      // 整行文本作为去重 key
      if (seen.has(k)) continue;
      seen.add(k);
      out.push(k);
      lastNonEmpty = k;
    }
    // 修剪末尾空行
    while (out.length && !out[out.length - 1].trim()) out.pop();
    const removed = lines.length - out.length;
    $("qList").value = out.join("\n");
    syncQuestionsFromTextarea();
    alert(`去重完成，移除 ${removed} 行重复`);
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
    const text = state.records.map((r) => {
      const items = r.items.map(it => `${it.num} ${it.title}`).join("\n   ");
      return `第 ${r.round} 轮  [${r.time}]\n   ${items}`;
    }).join("\n\n");
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
    const rawList = loadQ();
    $("qList").value = rawList.join("\n");
    state.allQuestions = parseQuestions();
    loadR();
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
    $("drawCount").addEventListener("input", () => {
      clampDrawCount();
    });
    $("drawCount").addEventListener("blur", () => {
      clampDrawCount();
    });

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
