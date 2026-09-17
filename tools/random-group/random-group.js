/* EduToolbox · 随机分组工具核心逻辑
 * -----------------------------------------------------------------------------
 * 功能：
 *   1. 名单管理：输入/示例/清空，支持换行/逗号/空格分隔，实时人数统计
 *   2. 分组模式：按组数分配 或 按每组人数分配，支持 +/− 微调数值
 *   3. 性别平衡：姓名后缀 男/女 自动识别，开启后均匀分配到各组
 *   4. 分组动画：开启后逐步分批显示成员，营造仪式感
 *   5. Fisher-Yates 洗牌：保证结果完全随机且公平
 *   6. 复制结果：一键复制分组结果到剪贴板
 *   7. 本地保存：勾选后通过 localStorage 自动保存名单
 *   8. 全屏展示：Fullscreen API，投影/大屏场景下放大显示
 *
 * 架构：纯前端 IIFE 模块，无后端依赖，支持 file:// 协议离线打开
 */

(function () {
  "use strict";

  /** 简易 ID 选择器 */
  const $ = (id) => document.getElementById(id);

  /** localStorage 键名 */
  const STORAGE_KEY = "random-group-names";

  /** 状态：当前分组结果 */
  const state = {
    lastGroups: [],
    mode: "group",   // group | size
    animating: false,
  };

  /** 分组配色（循环使用） */
  const GROUP_COLORS = [
    "#4a6cf7", "#0ea5e9", "#10b981", "#f59e0b",
    "#ef4444", "#8b5cf6", "#ec4899", "#14b8a6",
    "#f97316", "#6366f1", "#06b6d4", "#84cc16",
  ];

  /* ========== 本地存储 ==========
   * 兼容 file:// 协议下 localStorage 不可用场景，异常时降级忽略
   */
  function loadNames() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) $("names").value = raw;
    } catch (e) { /* 忽略 */ }
  }
  function saveNames() {
    if (!$("autoSave").checked) return;
    try { localStorage.setItem(STORAGE_KEY, $("names").value); }
    catch (e) { /* 忽略 */ }
  }

  /* ========== 解析名单 ==========
   * 根据分隔符切分原始文本，识别姓名后缀 男/女 标记
   * @returns {{name:string,gender:string|null}[]} 解析后的人员数组
   */
  function parseNames() {
    const raw = $("names").value;
    if (!raw.trim()) return [];
    const sepMode = $("sep").value;
    let sep;
    if (sepMode === "comma") sep = ",";
    else if (sepMode === "space") sep = /\s+/;
    else sep = /\r?\n/;
    return raw.split(sep).map(s => s.trim()).filter(Boolean).map(s => {
      const m = s.match(/^(.+?)\s*(男|女)$/);
      if (m) return { name: m[1].trim(), gender: m[2] };
      return { name: s, gender: null };
    });
  }

  /* ========== 更新人数显示 ========== */
  function refreshCount() {
    $("count").textContent = parseNames().length;
  }

  /* ========== Fisher-Yates 洗牌算法 ==========
   * 等概率打乱数组，不修改原数组
   * @param {Array} arr - 待打乱数组
   * @returns {Array} 已打乱的新数组
   */
  function shuffle(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  /* ========== 分组核心算法 ==========
   * @param {Array} people - {name,gender}[] 人员数组
   * @param {string} mode - group: 按组数分 / size: 按每组人数分
   * @param {number} num - 组数 或 每组人数
   * @param {boolean} balance - 是否启用性别平衡
   * @returns {Array<Array>} 分组二维数组
   */
  function groupPeople(people, mode, num, balance) {
    const n = people.length;
    if (n === 0) return [];
    let groupCount;
    if (mode === "group") {
      groupCount = Math.max(1, Math.min(num, n));
    } else {
      const size = Math.max(1, num);
      groupCount = Math.ceil(n / size);
    }

    let shuffled;
    if (balance) {
      // 性别平衡：分别洗牌男女，再轮流分配到各组，确保每组性别比例接近
      const males = shuffle(people.filter(p => p.gender === "男"));
      const females = shuffle(people.filter(p => p.gender === "女"));
      const others = shuffle(people.filter(p => p.gender !== "男" && p.gender !== "女"));
      shuffled = [];
      let idx = 0;
      while (idx < males.length || idx < females.length || idx < others.length) {
        if (idx < males.length)   shuffled.push(males[idx]);
        if (idx < females.length) shuffled.push(females[idx]);
        if (idx < others.length)  shuffled.push(others[idx]);
        idx++;
      }
    } else {
      shuffled = shuffle(people);
    }

    // 蛇形分配（S 型），避免最后一组只有 1 人时其他组都是 N 人
    const groups = Array.from({ length: groupCount }, () => []);
    let forward = true;
    let g = 0;
    shuffled.forEach(p => {
      groups[g].push(p);
      if (forward) {
        g++;
        if (g >= groupCount) { g = groupCount - 1; forward = false; }
      } else {
        g--;
        if (g < 0) { g = 0; forward = true; }
      }
    });
    return groups;
  }

  /* ========== HTML 转义 ==========
   * 防止名单内容包含 HTML 字符导致 XSS
   * @param {string} str - 待转义文本
   * @returns {string} 转义后的安全文本
   */
  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  /* ========== 渲染分组卡片 ==========
   * @param {boolean} animate - 是否启用逐步显示动画
   */
  function renderGroups(animate) {
    const box = $("result");
    if (state.lastGroups.length === 0) {
      box.innerHTML = '<div class="tip">请先输入名单并点击"开始分组"</div>';
      return;
    }
    const cards = state.lastGroups.map((g, i) => {
      const color = GROUP_COLORS[i % GROUP_COLORS.length];
      const members = g.map((p, j) => {
        const cls = p.gender === "男" ? "male" : p.gender === "女" ? "female" : "";
        return `<span class="member ${cls}" style="animation-delay:${j * 0.04}s">
          <span class="seq">${j + 1}</span>${escapeHtml(p.name)}
        </span>`;
      }).join("");
      return `
        <div class="group-card" data-idx="${i}" style="border-top-color:${color}; animation-delay:${i * 0.08}s">
          <div class="group-title">
            <span class="gname" style="color:${color}">第 ${i + 1} 组</span>
            <span class="gcount">${g.length} 人</span>
          </div>
          <div class="member-list">${members}</div>
        </div>`;
    }).join("");
    box.innerHTML = `<div class="group-grid">${cards}</div>`;

    // 动画模式：分批闪烁卡片
    if (animate) {
      const cardsArr = box.querySelectorAll(".group-card");
      cardsArr.forEach(card => card.classList.add("flicker"));
      let i = 0;
      state.animating = true;
      const timer = setInterval(() => {
        if (i >= cardsArr.length) {
          clearInterval(timer);
          state.animating = false;
          return;
        }
        cardsArr[i].classList.remove("flicker");
        i++;
      }, 180);
    }
  }

  /* ========== 执行分组 ==========
   * 解析名单 -> 计算分组 -> 渲染 -> 自动保存
   */
  function doGroup() {
    if (state.animating) return;
    const people = parseNames();
    if (people.length === 0) {
      $("result").innerHTML = '<div class="tip">请先在左侧输入名单</div>';
      return;
    }
    const num = parseInt($("num").value, 10) || 1;
    const balance = $("balance").checked;
    const animate = $("animate").checked;
    state.lastGroups = groupPeople(people, state.mode, num, balance);
    renderGroups(animate);
    saveNames();
  }

  /* ========== 复制分组结果 ==========
   * 兼容 navigator.clipboard 与降级 execCommand
   */
  async function copyResult() {
    if (state.lastGroups.length === 0) {
      alert("请先点击开始分组");
      return;
    }
    const text = state.lastGroups.map((g, i) =>
      `第${i + 1}组（${g.length}人）：${g.map(p => p.name + (p.gender ? "(" + p.gender + ")" : "")).join("、")}`
    ).join("\n");
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(text);
      } else {
        const ta = document.createElement("textarea");
        ta.value = text;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand("copy");
        document.body.removeChild(ta);
      }
      const btn = $("copyBtn");
      const old = btn.textContent;
      btn.textContent = "✓ 已复制";
      setTimeout(() => { btn.textContent = old; }, 1500);
    } catch (e) {
      alert("复制失败：" + e.message);
    }
  }

  /* ========== 切换分组模式 ==========
   * 同步更新标签文案与数值范围
   */
  function switchMode(mode) {
    state.mode = mode;
    document.querySelectorAll(".seg-btn").forEach(b => {
      b.classList.toggle("active", b.dataset.mode === mode);
    });
    $("numLabel").textContent = mode === "group" ? "组数" : "每组人数";
    $("num").min = "1";
    if (mode === "size" && parseInt($("num").value, 10) < 2) {
      $("num").value = "4";
    }
  }

  /* ========== 全屏展示 ==========
   * 调用 Fullscreen API，进入/退出全屏
   */
  function toggleFullscreen() {
    const stage = $("stage");
    if (!document.fullscreenElement) {
      const req = stage.requestFullscreen || stage.webkitRequestFullscreen || stage.msRequestFullscreen;
      if (req) req.call(stage);
    } else {
      const exit = document.exitFullscreen || document.webkitExitFullscreen || document.msExitFullscreen;
      if (exit) exit.call(document);
    }
  }

  /* ========== 全屏状态变化时切换退出按钮 ========== */
  function onFullscreenChange() {
    $("exitFullBtn").style.display = document.fullscreenElement ? "block" : "none";
    $("fullscreenBtn").textContent = document.fullscreenElement ? "⤫ 退出全屏" : "⛶ 全屏展示";
  }

  /* ========== 加载示例名单 ========== */
  function loadExample() {
    $("names").value = "张三\n李四 女\n王五 男\n赵六\n钱七 女\n孙八 男\n周九\n吴十 女\n郑十一\n王十二\n刘十三 男\n陈十四\n杨十五 女";
    refreshCount();
    saveNames();
  }

  /* ========== 数值 +/- 调整 ========== */
  function adjustNum(delta) {
    const input = $("num");
    let v = (parseInt(input.value, 10) || 1) + delta;
    if (v < 1) v = 1;
    input.value = String(v);
  }

  /* ========== 事件绑定 ========== */
  function bindEvents() {
    // 输入实时计数与保存
    $("names").addEventListener("input", () => { refreshCount(); saveNames(); });

    // 示例 / 清空
    $("exampleBtn").addEventListener("click", loadExample);
    $("clearBtn").addEventListener("click", () => {
      if (!confirm("确定清空名单吗？")) return;
      $("names").value = "";
      state.lastGroups = [];
      refreshCount();
      renderGroups(false);
      saveNames();
    });

    // 分组模式切换
    document.querySelectorAll(".seg-btn").forEach(b => {
      b.addEventListener("click", () => switchMode(b.dataset.mode));
    });

    // 数值 +/-
    $("numMinus").addEventListener("click", () => adjustNum(-1));
    $("numPlus").addEventListener("click", () => adjustNum(1));

    // 主操作按钮
    $("genBtn").addEventListener("click", doGroup);
    $("copyBtn").addEventListener("click", copyResult);
    $("fullscreenBtn").addEventListener("click", toggleFullscreen);
    $("exitFullBtn").addEventListener("click", toggleFullscreen);

    // 全屏状态监听
    ["fullscreenchange", "webkitfullscreenchange", "msfullscreenchange"].forEach(ev => {
      document.addEventListener(ev, onFullscreenChange);
    });

    // 键盘快捷键：Enter 触发分组
    document.addEventListener("keydown", (e) => {
      if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        doGroup();
      }
    });
  }

  /* ========== 初始化 ========== */
  function init() {
    loadNames();
    refreshCount();
    bindEvents();
    renderGroups(false);
  }

  // DOM 就绪后启动
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
