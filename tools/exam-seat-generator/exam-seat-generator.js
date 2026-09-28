/**
 * ============================================================================
 *  exam-seat-generator.js — 考试座位安排表
 *  ----------------------------------------------------------------------------
 *  功能说明：
 *    1. 解析考生名单（每行 "姓名<分隔符>准考号"，支持 Tab/逗号/竖线/空格）
 *    2. 考场设置：座位列数、每列座位数、排列方式（Z 字形 / S 字形 / 顺序）
 *    3. 随机排座：Fisher-Yates 洗牌后按选定排列方式分配座位号
 *    4. 拖拽安排/交换座位（HTML5 Drag and Drop）
 *    5. 打印座位表（横向）+ 导出 Excel（xlsx.full.min.js）
 *    6. 全屏展示模式
 *    7. 名单/座位/设置保存到 localStorage，刷新不丢失
 *  依赖：本地 vendor 的 xlsx.full.min.js（../../assets/vendor/xlsx.full.min.js）
 *  运行方式：file:// 协议下双击 index.html 直接打开即可使用
 * ============================================================================
 */
(function () {
  "use strict";

  /** localStorage 存储键名 */
  var STORAGE_KEY = "edutoolbox_exam_seat_generator";

  /** 示例名单 */
  var EXAMPLE = [
    "张三\t20250001", "李四,20250002", "王五 20250003", "赵六\t20250004",
    "钱七,20250005", "孙八\t20250006", "周九 20250007", "吴十\t20250008",
    "郑十一,20250009", "王十二\t20250010", "刘十三 20250011", "陈十四\t20250012",
    "杨十五,20250013", "朱十六\t20250014", "秦十七 20250015", "尤十八\t20250016"
  ];

  /** 简易 DOM 查询
   * @param {string} id 元素 id
   * @returns {HTMLElement|null} */
  function $(id) { return document.getElementById(id); }

  /** 数值钳制到 [min, max]
   * @param {number} n 输入值
   * @param {number} min 最小值
   * @param {number} max 最大值
   * @returns {number} */
  function clamp(n, min, max) { return Math.min(max, Math.max(min, n)); }

  /** Fisher-Yates 洗牌，返回新数组
   * @param {Array} arr 待洗牌数组
   * @returns {Array} 打乱后的新数组 */
  function shuffle(arr) {
    var b = arr.slice();
    for (var i = b.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = b[i]; b[i] = b[j]; b[j] = t;
    }
    return b;
  }

  /** HTML 转义
   * @param {string} s 待转义字符串
   * @returns {string} */
  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c];
    });
  }

  /** 解析一行考生文本，支持多种分隔符：Tab / 英文逗号 / 中文逗号 / 竖线 / 空格
   * @param {string} line 单行文本
   * @returns {{name:string, id:string}|null} 考生对象；解析失败返回 null */
  function parseCandidate(line) {
    var s = (line || "").trim();
    if (!s) return null;
    // 优先识别 Tab / 逗号 / 竖线
    var m = s.split(/[\t,，|]+/);
    if (m.length >= 2) {
      var a = m[0].trim(), b = m.slice(1).join("").trim();
      // 姓名通常在前；若第一段是纯数字则视为准考号在前
      if (/^\d+$/.test(a) && b && !/^\d+$/.test(b)) {
        return { name: b, id: a };
      }
      return { name: a, id: b };
    }
    // 退化为空格分隔：取第一段为姓名，其余拼接为准考号
    var parts = s.split(/\s+/);
    if (parts.length >= 2) {
      return { name: parts[0], id: parts.slice(1).join("") };
    }
    // 只有姓名
    return { name: s, id: "" };
  }

  /** 解析整段名单文本
   * @param {string} text textarea 原始文本
   * @returns {Array<{name:string,id:string}>} 考生数组 */
  function parseCandidates(text) {
    var out = [];
    (text || "").split(/\r?\n/).forEach(function (line) {
      var c = parseCandidate(line);
      if (c) out.push(c);
    });
    return out;
  }

  /** 当前状态 */
  var state = {
    candidates: [],   // {name, id}
    seats: [],        // 一维数组，长度=列数×每列数，元素为考生对象或 null
    cols: 3,
    perCol: 8,
    arrange: "z",     // z | s | straight
    startNum: 1,
    title: "考试座位安排表",
    room: "第七考场（0003教室）",
    invigilator: "",
    showRoom: true,
    showInvigilator: false,
    autoSave: true
  };

  /** 从 localStorage 读取并合并到 state
   * @returns {void} */
  function loadState() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      var data = JSON.parse(raw);
      Object.keys(data).forEach(function (k) {
        if (state.hasOwnProperty(k)) state[k] = data[k];
      });
    } catch (e) {}
  }

  /** 把 state 写入 localStorage
   * @returns {void} */
  function saveState() {
    if (!state.autoSave) return;
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch (e) {}
  }

  /** 从 DOM 控件读取设置回填 state
   * @returns {void} */
  function readSettings() {
    state.cols = clamp(parseInt($("cols").value, 10) || 3, 1, 6);
    state.perCol = clamp(parseInt($("perCol").value, 10) || 8, 1, 10);
    state.arrange = $("arrange").value;
    state.startNum = Math.max(1, parseInt($("startNum").value, 10) || 1);
    state.title = $("titleText").value;
    state.room = $("roomText").value;
    state.invigilator = $("invigilator").value;
    state.showRoom = $("showRoom").checked;
    state.showInvigilator = $("showInvigilator").checked;
    state.autoSave = $("autoSave").checked;
  }

  /** 把 state 反向写入 DOM 控件
   * @returns {void} */
  function writeSettings() {
    $("cols").value = state.cols;
    $("colsVal").textContent = state.cols;
    $("perCol").value = state.perCol;
    $("perColVal").textContent = state.perCol;
    $("arrange").value = state.arrange;
    $("startNum").value = state.startNum;
    $("titleText").value = state.title;
    $("roomText").value = state.room;
    $("invigilator").value = state.invigilator;
    $("showRoom").checked = state.showRoom;
    $("showInvigilator").checked = state.showInvigilator;
    $("autoSave").checked = state.autoSave;
  }

  /** 同步名单到 state 与计数显示
   * @returns {void} */
  function syncCandidates() {
    state.candidates = parseCandidates($("candidates").value);
    $("count").textContent = state.candidates.length;
    updateCapacity();
  }

  /** 更新容量显示
   * @returns {void} */
  function updateCapacity() {
    var total = state.cols * state.perCol;
    $("capacity").textContent = total;
    $("totalSeats").textContent = total;
    $("arrangeCount").textContent = state.candidates.length;
  }

  /** 计算座位号序列（基于排列方式）
   * @returns {number[]} 长度为 cols*perCol 的座位号数组
   *  - z（蛇形）：偶数列从上到下，奇数列从下到上，形成 Z 字形蛇回
   *  - s（回转）：每列都从上到下，但列顺序左右镜像交替（更像 S）
   *  - straight：纯顺序，从上到下、从左到右 */
  function computeSeatNumbers() {
    var cols = state.cols, perCol = state.perCol;
    var start = state.startNum;
    var total = cols * perCol;
    var nums = new Array(total);

    if (state.arrange === "straight") {
      // 顺序：按列优先，第 c 列第 r 行 -> nums[c*perCol + r] = start + c*perCol + r
      for (var c = 0; c < cols; c++) {
        for (var r = 0; r < perCol; r++) {
          nums[c * perCol + r] = start + c * perCol + r;
        }
      }
    } else if (state.arrange === "s") {
      // S 字形：列方向都是上到下，但列号按 S 形左右镜像：偶数列左→右，奇数列右→左
      // 简化：第 c 列内座位号连续递增；列与列之间座位号也连续递增
      // 真正 S 形：行优先填号，列按行蛇形
      var idx = 0;
      for (var r2 = 0; r2 < perCol; r2++) {
        // 偶数行从左到右，奇数行从右到左
        var leftToRight = (r2 % 2 === 0);
        for (var cc = 0; cc < cols; cc++) {
          var realCol = leftToRight ? cc : (cols - 1 - cc);
          nums[realCol * perCol + r2] = start + idx;
          idx++;
        }
      }
    } else {
      // z（默认蛇形）：第 c 列内，偶数列从上到下，奇数列从下到上
      var n = start;
      for (var c3 = 0; c3 < cols; c3++) {
        if (c3 % 2 === 0) {
          for (var r3 = 0; r3 < perCol; r3++) {
            nums[c3 * perCol + r3] = n++;
          }
        } else {
          for (var r4 = perCol - 1; r4 >= 0; r4--) {
            nums[c3 * perCol + r4] = n++;
          }
        }
      }
    }
    return nums;
  }

  /** 渲染纸张头部（标题/考场/监考）
   * @returns {void} */
  function renderPaperHeader() {
    $("seatPaper").querySelector(".paper-title").textContent = state.title || "考试座位安排表";
    var sub = $("seatPaper").querySelector(".paper-subtitle");
    sub.textContent = state.showRoom ? (state.room || "") : "";
    sub.style.display = state.showRoom ? "" : "none";
    var inv = $("paperInvigilator");
    inv.textContent = "监考老师：" + (state.invigilator || "");
    inv.style.display = state.showInvigilator ? "" : "none";
  }

  /** 渲染考场座位主区域
   * @returns {void} */
  function renderSeats() {
    readSettings();
    renderPaperHeader();
    updateCapacity();

    var area = $("paperArea");
    area.innerHTML = "";

    var cols = state.cols, perCol = state.perCol;
    var total = cols * perCol;

    if (!state.candidates.length) {
      area.innerHTML = '<div class="state state--compact state--empty"><div class="state-icon">📋</div><div class="state-title">请先导入考生名单</div><div class="state-desc">然后点击"随机排座"</div></div>';
      updateArrangeTip(0, total);
      return;
    }

    var nums = computeSeatNumbers();

    // 创建网格容器，按列数横向排布；每列内部纵向堆叠 perCol 个座位
    var grid = document.createElement("div");
    grid.className = "seat-grid";
    grid.style.gridTemplateColumns = "repeat(" + cols + ", var(--seat-w))";

    var arranged = 0;
    for (var i = 0; i < total; i++) {
      var card = document.createElement("div");
      card.className = "seat-card";
      card.dataset.index = i;
      card.draggable = true;
      var cand = state.seats[i];

      if (cand) {
        arranged++;
        card.innerHTML =
          '<div class="seat-no">座位号 ' + nums[i] + '</div>' +
          '<div class="seat-name">' + escapeHtml(cand.name) + '</div>' +
          '<div class="seat-id">' + escapeHtml(cand.id || "") + '</div>';
      } else {
        card.classList.add("empty");
        card.innerHTML =
          '<div class="seat-no">座位号 ' + nums[i] + '</div>' +
          '<div class="placeholder-text">拖入考生</div>';
      }
      grid.appendChild(card);
    }
    area.appendChild(grid);
    enableDrag(area);
    updateArrangeTip(arranged, total);
    saveState();
  }

  /** 更新已安排提示
   * @param {number} arranged 已安排人数
   * @param {number} total 总座位数
   * @returns {void} */
  function updateArrangeTip(arranged, total) {
    $("arrangeTip").innerHTML = '已安排 <span>' + arranged + '</span> / <span>' + total + '</span> 个座位';
  }

  /** 启用拖拽：从待排列表/已有座位拖到目标座位
   * @param {HTMLElement} container 容器
   * @returns {void} */
  function enableDrag(container) {
    var dragEl = null;
    var cards = container.querySelectorAll(".seat-card");
    cards.forEach(function (card) {
      card.addEventListener("dragstart", function () {
        dragEl = card;
        card.classList.add("dragging");
      });
      card.addEventListener("dragend", function () {
        card.classList.remove("dragging");
        cards.forEach(function (c) { c.classList.remove("drop-target"); });
      });
      card.addEventListener("dragover", function (e) {
        e.preventDefault();
        if (card !== dragEl) card.classList.add("drop-target");
      });
      card.addEventListener("dragleave", function () {
        card.classList.remove("drop-target");
      });
      card.addEventListener("drop", function (e) {
        e.preventDefault();
        card.classList.remove("drop-target");
        if (dragEl && dragEl !== card) {
          var i1 = +dragEl.dataset.index;
          var i2 = +card.dataset.index;
          // 交换 state.seats[i1] 与 state.seats[i2]
          var tmp = state.seats[i1];
          state.seats[i1] = state.seats[i2];
          state.seats[i2] = tmp;
          renderSeats();
        }
      });
    });
  }

  /** 随机排座：洗牌全部考生，按座位顺序填入；超出容量的考生留在待排
   * @returns {void} */
  function randomArrange() {
    readSettings();
    syncCandidates();
    if (!state.candidates.length) {
      alert("请先输入考生名单");
      return;
    }
    var total = state.cols * state.perCol;
    var shuffled = shuffle(state.candidates);
    state.seats = new Array(total).fill(null);
    for (var i = 0; i < total && i < shuffled.length; i++) {
      state.seats[i] = shuffled[i];
    }
    renderSeats();
  }

  /** 清空座位：所有座位置空，保留名单
   * @returns {void} */
  function clearSeats() {
    var total = state.cols * state.perCol;
    state.seats = new Array(total).fill(null);
    renderSeats();
  }

  /** 打印座位表
   * @returns {void} */
  function printSheet() {
    readSettings();
    renderPaperHeader();
    renderSeats();
    setTimeout(function () { window.print(); }, 100);
  }

  /** 导出 Excel
   * @returns {void} */
  function exportExcel() {
    if (typeof XLSX === "undefined") {
      alert("Excel 导出库未加载，请确认 ../../assets/vendor/xlsx.full.min.js 存在");
      return;
    }
    readSettings();
    var cols = state.cols, perCol = state.perCol;
    var total = cols * perCol;
    var nums = computeSeatNumbers();

    var aoa = [];
    aoa.push([state.title || "考试座位安排表"]);
    if (state.showRoom && state.room) aoa.push([state.room]);
    aoa.push([]);

    // 按列输出：每列一个区块，列头 + 座位号/姓名/准考号
    // 这里简化为表格：一行对应一个座位（座位号、姓名、准考号）
    aoa.push(["座位号", "姓名", "准考号"]);
    for (var i = 0; i < total; i++) {
      var c = state.seats[i];
      aoa.push([nums[i], c ? c.name : "", c ? (c.id || "") : ""]);
    }
    aoa.push([]);
    if (state.showInvigilator && state.invigilator) {
      aoa.push(["监考老师：" + state.invigilator]);
    }

    var ws = XLSX.utils.aoa_to_sheet(aoa);
    var wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "考场座位表");
    var fname = (state.title || "考场座位表").replace(/[\\/:*?"<>|]/g, "_") + ".xlsx";
    XLSX.writeFile(wb, fname);
  }

  /** 加载示例名单
   * @returns {void} */
  function loadExample() {
    $("candidates").value = EXAMPLE.join("\n");
    syncCandidates();
    saveState();
  }

  /** 清空考生名单
   * @returns {void} */
  function clearCandidates() {
    if (!confirm("确定清空考生名单吗？")) return;
    $("candidates").value = "";
    syncCandidates();
    var total = state.cols * state.perCol;
    state.seats = new Array(total).fill(null);
    renderSeats();
  }

  /** 导入 CSV/TXT 文件
   * @returns {void} */
  function importFile(e) {
    var f = e.target.files[0];
    if (!f) return;
    var reader = new FileReader();
    reader.onload = function (ev) {
      $("candidates").value = ev.target.result;
      syncCandidates();
      saveState();
    };
    reader.readAsText(f, "UTF-8");
    e.target.value = ""; // 允许重复导入同名文件
  }

  /** 名单输入实时保存
   * @returns {void} */
  function onCandidatesInput() {
    syncCandidates();
    saveState();
  }

  /** 绑定事件
   * @returns {void} */
  function bindEvents() {
    $("randomBtn").addEventListener("click", randomArrange);
    $("clearSeatsBtn").addEventListener("click", clearSeats);
    $("printBtn").addEventListener("click", printSheet);
    $("excelBtn").addEventListener("click", exportExcel);
    $("exampleBtn").addEventListener("click", loadExample);
    $("clearCandsBtn").addEventListener("click", clearCandidates);
    $("importCsvBtn").addEventListener("click", function () { $("fileInput").click(); });
    $("fileInput").addEventListener("change", importFile);

    $("candidates").addEventListener("input", onCandidatesInput);

    $("cols").addEventListener("input", function () {
      readSettings();
      $("colsVal").textContent = state.cols;
      // 容量变化后重置座位
      var total = state.cols * state.perCol;
      var newSeats = new Array(total).fill(null);
      // 尽量保留原座位安排
      for (var i = 0; i < total && i < state.seats.length; i++) {
        newSeats[i] = state.seats[i];
      }
      state.seats = newSeats;
      renderSeats();
    });
    $("perCol").addEventListener("input", function () {
      readSettings();
      $("perColVal").textContent = state.perCol;
      var total = state.cols * state.perCol;
      var newSeats = new Array(total).fill(null);
      for (var i = 0; i < total && i < state.seats.length; i++) {
        newSeats[i] = state.seats[i];
      }
      state.seats = newSeats;
      renderSeats();
    });

    $("arrange").addEventListener("change", renderSeats);
    $("startNum").addEventListener("change", renderSeats);

    $("titleText").addEventListener("input", function () {
      readSettings(); renderPaperHeader(); saveState();
    });
    $("roomText").addEventListener("input", function () {
      readSettings(); renderPaperHeader(); saveState();
    });
    $("invigilator").addEventListener("input", function () {
      readSettings(); renderPaperHeader(); saveState();
    });
    $("showRoom").addEventListener("change", function () { readSettings(); renderPaperHeader(); saveState(); });
    $("showInvigilator").addEventListener("change", function () { readSettings(); renderPaperHeader(); saveState(); });
    $("autoSave").addEventListener("change", function () { readSettings(); saveState(); });
  }

  /** 初始化
   * @returns {void} */
  function init() {
    loadState();
    if (!state.candidates.length) state.candidates = parseCandidates($("candidates").value);
    else $("candidates").value = state.candidates.map(function (c) {
      return c.name + "\t" + c.id;
    }).join("\n");
    writeSettings();
    syncCandidates();
    bindEvents();
    renderSeats();

    /* 舞台右上角工具栏（⛶ 全屏 / ⚙ 隐藏设置）：全屏目标是 #stage 自身，
       双栏容器 .main 加 setup-hidden 时变单栏并隐藏 .setup-panel。 */
    if (window.EduToolStageToolbar) {
      window.EduToolStageToolbar.init({ stage: "#stage", panelHost: ".main" });
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
