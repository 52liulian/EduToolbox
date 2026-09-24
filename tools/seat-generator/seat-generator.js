/**
 * ============================================================================
 *  seat-generator.js — 座位表生成器
 *  ----------------------------------------------------------------------------
 *  功能说明：
 *    1. 按学生名单 + 行列数生成座位表网格
 *    2. 支持随机排座（Fisher-Yates 洗牌）与一键重新生成
 *    3. 讲台位置（前/后）与教师/学生视角切换
 *    4. 拖拽交换座位（HTML5 Drag and Drop）
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
  var STORAGE_KEY = "edutoolbox_seat_generator";

  /** 示例名单，点击"示例"按钮加载 */
  var EXAMPLE_NAMES = [
    "张三", "李四", "王五", "赵六", "钱七", "孙八",
    "周九", "吴十", "郑十一", "王十二", "刘十三", "陈十四",
    "杨十五", "朱十六", "秦十七", "尤十八"
  ];

  /** 中文数字映射，用于排/列提示 */
  var CN_NUM = ["零", "一", "二", "三", "四", "五", "六", "七", "八", "九", "十",
    "十一", "十二", "十三", "十四", "十五", "十六", "十七", "十八"];

  /** 简易 DOM 查询：按 id 获取元素
   * @param {string} id 元素 id
   * @returns {HTMLElement|null} */
  function $(id) { return document.getElementById(id); }

  /** 数值钳制到 [min, max]
   * @param {number} n 输入值
   * @param {number} min 最小值
   * @param {number} max 最大值
   * @returns {number} */
  function clamp(n, min, max) { return Math.min(max, Math.max(min, n)); }

  /** Fisher-Yates 洗牌算法，返回新数组（不修改原数组）
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

  /** HTML 转义，避免名单中含特殊字符破坏 DOM
   * @param {string} s 待转义字符串
   * @returns {string} */
  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c];
    });
  }

  /** 解析名单文本，每行一个姓名，去空格去重
   * @param {string} text textarea 中的原始文本
   * @returns {string[]} 姓名数组 */
  function parseNames(text) {
    var seen = {};
    var out = [];
    (text || "").split(/\r?\n/).forEach(function (line) {
      var n = line.trim();
      if (n && !seen[n]) { seen[n] = 1; out.push(n); }
    });
    return out;
  }

  /** 当前状态对象 */
  var state = {
    names: [],
    seats: [],          // 二维数组：seats[row][col] = 姓名 或 null
    rows: 6,
    cols: 3,
    podiumPos: "bottom",
    viewMode: "teacher",
    title: "三年级二班座位表",
    info: "班主任：xxx   人数：xxx   班长：xxx",
    bgColor: "#ffffff",
    seatColor: "#eaf3ff",
    borderColor: "#7dd3fc",
    fontColor: "#0369a1",
    podiumColor: "#374151",
    podiumTextColor: "#ffffff",
    nameSize: 14,
    nameBold: true,
    showPodium: true,
    showTip: true,
    hideEmpty: false,
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
    } catch (e) { /* 损坏数据忽略 */ }
  }

  /** 把当前 state 写入 localStorage
   * @returns {void} */
  function saveState() {
    if (!state.autoSave) return;
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch (e) {}
  }

  /** 从 DOM 控件读取设置，回填到 state
   * @returns {void} */
  function readSettings() {
    state.rows = clamp(parseInt($("rows").value, 10) || 6, 1, 12);
    state.cols = clamp(parseInt($("cols").value, 10) || 3, 1, 12);
    state.podiumPos = $("podiumPos").value;
    state.viewMode = $("viewMode").value;
    state.title = $("titleText").value;
    state.info = $("infoText").value;
    state.bgColor = $("bgColor").value;
    state.seatColor = $("seatColor").value;
    state.borderColor = $("borderColor").value;
    state.fontColor = $("fontColor").value;
    state.podiumColor = $("podiumColor").value;
    state.podiumTextColor = $("podiumTextColor").value;
    state.nameSize = clamp(parseInt($("nameSize").value, 10) || 14, 10, 36);
    state.nameBold = $("nameBold").checked;
    state.showPodium = $("showPodium").checked;
    state.showTip = $("showTip").checked;
    state.hideEmpty = $("hideEmpty").checked;
    state.autoSave = $("autoSave").checked;
  }

  /** 把 state 反向写入 DOM 控件
   * @returns {void} */
  function writeSettings() {
    $("rows").value = state.rows;
    $("cols").value = state.cols;
    $("podiumPos").value = state.podiumPos;
    $("viewMode").value = state.viewMode;
    $("titleText").value = state.title;
    $("infoText").value = state.info;
    $("bgColor").value = state.bgColor;
    $("seatColor").value = state.seatColor;
    $("borderColor").value = state.borderColor;
    $("fontColor").value = state.fontColor;
    $("podiumColor").value = state.podiumColor;
    $("podiumTextColor").value = state.podiumTextColor;
    $("nameSize").value = state.nameSize;
    $("nameSizeVal").textContent = state.nameSize + "px";
    $("nameBold").checked = state.nameBold;
    $("showPodium").checked = state.showPodium;
    $("showTip").checked = state.showTip;
    $("hideEmpty").checked = state.hideEmpty;
    $("autoSave").checked = state.autoSave;
  }

  /** 把名单同步到 state 并更新计数显示
   * @returns {void} */
  function syncNames() {
    state.names = parseNames($("names").value);
    $("count").textContent = state.names.length;
  }

  /** 应用纸张级样式（颜色/字号）到 DOM
   * @returns {void} */
  function applyPaperStyles() {
    var paper = $("seatPaper");
    paper.style.setProperty("--paper-bg", state.bgColor);
    paper.style.setProperty("--seat-bg", state.seatColor);
    paper.style.setProperty("--seat-border", state.borderColor);
    paper.style.setProperty("--seat-fg", state.fontColor);
    paper.querySelector(".paper-title").textContent = state.title || "";
    paper.querySelector(".paper-title").style.fontWeight = "700";
    paper.querySelector(".paper-info").textContent = state.info || "";
    paper.querySelector(".paper-info").style.whiteSpace = "pre-wrap";
  }

  /** 渲染座位表主区域
   * @returns {void} */
  function renderSeats() {
    readSettings();
    applyPaperStyles();
    var area = $("paperArea");
    area.innerHTML = "";
    area.style.setProperty("--seat-bg", state.seatColor);
    area.style.setProperty("--seat-border", state.borderColor);
    area.style.setProperty("--seat-fg", state.fontColor);

    if (!state.names.length) {
      area.innerHTML = '<div class="state state--compact state--empty"><div class="state-icon">📋</div><div class="state-title">请先导入学生名单</div><div class="state-desc">然后点击"随机排座"或"重新生成"</div></div>';
      return;
    }

    // 讲台位置：教师视角讲台在下方；学生视角讲台在上方
    // podiumPos 也允许用户显式选择前(top)/后(bottom)
    // 讲台位置：尊重 podiumPos 选择（top=讲台在前/上方，bottom=讲台在后/下方）
    // 学生视角时自动反转：教师看到讲台在下方，学生看到的讲台应在上方
    var podiumAtTop = state.viewMode === "student"
      ? (state.podiumPos !== "top")
      : (state.podiumPos === "top");

    var rows = state.rows;
    var cols = state.cols;

    var frag = document.createDocumentFragment();

    // 讲台
    if (state.showPodium) {
      var podium = document.createElement("div");
      podium.className = "podium " + (podiumAtTop ? "top" : "bottom");
      podium.textContent = "讲 台";
      podium.style.background = state.podiumColor;
      podium.style.color = state.podiumTextColor;
      if (podiumAtTop) frag.appendChild(podium);
    }

    // 座位网格容器
    var wrap = document.createElement("div");
    wrap.className = "seat-wrap";

    // 列提示
    if (state.showTip) {
      var colTips = document.createElement("div");
      colTips.className = "col-tips";
      for (var c = 0; c < cols; c++) {
        var ct = document.createElement("div");
        ct.className = "col-tip";
        ct.textContent = "第 " + (CN_NUM[c + 1] || (c + 1)) + " 列";
        colTips.appendChild(ct);
      }
      wrap.appendChild(colTips);
    }

    // 座位网格容器：列提示在左，主座位网格在右
    var grid = document.createElement("div");
    grid.style.display = "grid";
    grid.style.gap = "10px";
    grid.style.flex = "1";

    for (var r = 0; r < rows; r++) {
      var row = document.createElement("div");
      row.className = "seat-row";
      row.style.gridTemplateColumns = "repeat(" + cols + ", 1fr)";

      // 排提示
      if (state.showTip) {
        var rt = document.createElement("div");
        rt.className = "row-tip";
        rt.textContent = "第 " + (CN_NUM[r + 1] || (r + 1)) + " 排";
        row.appendChild(rt);
      }

      for (var cc = 0; cc < cols; cc++) {
        var cell = document.createElement("div");
        cell.className = "seat-cell";
        cell.dataset.row = r;
        cell.dataset.col = cc;
        cell.draggable = true;
        cell.style.fontSize = state.nameSize + "px";
        cell.style.fontWeight = state.nameBold ? "700" : "400";

        var who = state.seats[r] && state.seats[r][cc];
        if (who) {
          cell.textContent = who;
        } else {
          if (state.hideEmpty) {
            cell.classList.add("empty", "hidden-empty");
            cell.style.visibility = "hidden";
          } else {
            cell.classList.add("empty");
            cell.textContent = "空";
          }
        }
        row.appendChild(cell);
      }
      grid.appendChild(row);
    }
    wrap.appendChild(grid);
    area.appendChild(wrap);

    // 下方讲台
    if (state.showPodium && !podiumAtTop) {
      var podium2 = document.createElement("div");
      podium2.className = "podium bottom";
      podium2.textContent = "讲 台";
      podium2.style.background = state.podiumColor;
      podium2.style.color = state.podiumTextColor;
      area.appendChild(podium2);
    }

    enableDrag(area);
    saveState();
  }

  /** 启用拖拽交换座位
   * @param {HTMLElement} container 包含座位格的容器
   * @returns {void} */
  function enableDrag(container) {
    var dragEl = null;
    var cells = container.querySelectorAll(".seat-cell");
    cells.forEach(function (cell) {
      cell.addEventListener("dragstart", function () {
        dragEl = cell;
        cell.classList.add("dragging");
      });
      cell.addEventListener("dragend", function () {
        cell.classList.remove("dragging");
        cells.forEach(function (c) { c.classList.remove("drop-target"); });
      });
      cell.addEventListener("dragover", function (e) {
        e.preventDefault();
        if (cell !== dragEl) cell.classList.add("drop-target");
      });
      cell.addEventListener("dragleave", function () {
        cell.classList.remove("drop-target");
      });
      cell.addEventListener("drop", function (e) {
        e.preventDefault();
        cell.classList.remove("drop-target");
        if (dragEl && dragEl !== cell) {
          // 交换两人姓名，并同步 state.seats
          var r1 = +dragEl.dataset.row, c1 = +dragEl.dataset.col;
          var r2 = +cell.dataset.row, c2 = +cell.dataset.col;
          if (!state.seats[r1]) state.seats[r1] = [];
          if (!state.seats[r2]) state.seats[r2] = [];
          var tmp = state.seats[r1][c1];
          state.seats[r1][c1] = state.seats[r2][c2];
          state.seats[r2][c2] = tmp;
          var t = dragEl.textContent;
          dragEl.textContent = cell.textContent;
          cell.textContent = t;
          // 重新判定空状态
          syncEmptyClass(dragEl); syncEmptyClass(cell);
          saveState();
        }
      });
    });
  }

  /** 根据元素文本同步 empty 样式
   * @param {HTMLElement} cell 座位格子
   * @returns {void} */
  function syncEmptyClass(cell) {
    var isEmpty = !cell.textContent || cell.textContent === "空";
    if (isEmpty) {
      cell.classList.add("empty");
      if (!state.hideEmpty) { cell.textContent = "空"; cell.style.visibility = ""; }
      else { cell.style.visibility = "hidden"; }
    } else {
      cell.classList.remove("empty");
      cell.style.visibility = "";
    }
  }

  /** 随机排座：洗牌名单后按行优先填入座位，超出座位数的人保留待排
   * @returns {void} */
  function randomArrange() {
    readSettings();
    syncNames();
    if (!state.names.length) {
      alert("请先输入学生名单");
      return;
    }
    var shuffled = shuffle(state.names);
    state.seats = [];
    var totalSeats = state.rows * state.cols;
    var idx = 0;
    for (var r = 0; r < state.rows; r++) {
      state.seats[r] = [];
      for (var c = 0; c < state.cols; c++) {
        if (idx < totalSeats && idx < shuffled.length) {
          state.seats[r][c] = shuffled[idx];
        } else {
          state.seats[r][c] = null;
        }
        idx++;
      }
    }
    renderSeats();
  }

  /** 重新生成：基于当前名单重新按行列生成空座位（保留名单、清空排座）
   * @returns {void} */
  function regenerate() {
    readSettings();
    syncNames();
    state.seats = [];
    for (var r = 0; r < state.rows; r++) {
      state.seats[r] = [];
      for (var c = 0; c < state.cols; c++) state.seats[r][c] = null;
    }
    renderSeats();
  }

  /** 清空座位：把所有座位置空
   * @returns {void} */
  function clearSeats() {
    if (!state.seats.length) { regenerate(); return; }
    for (var r = 0; r < state.rows; r++) {
      for (var c = 0; c < state.cols; c++) {
        if (state.seats[r]) state.seats[r][c] = null;
      }
    }
    renderSeats();
  }

  /** 打印座位表
   * @returns {void} */
  function printSheet() {
    readSettings();
    applyPaperStyles();
    renderSeats();
    setTimeout(function () { window.print(); }, 100);
  }

  /** 导出 Excel：使用 xlsx.full.min.js 把座位表写入 .xlsx
   * @returns {void} */
  function exportExcel() {
    if (typeof XLSX === "undefined") {
      alert("Excel 导出库未加载，请确认 ../../assets/vendor/xlsx.full.min.js 存在");
      return;
    }
    readSettings();
    // 构造二维数据：首行写标题，次行写信息，再空一行后是座位矩阵
    var aoa = [];
    aoa.push([state.title || "座位表"]);
    if (state.info) aoa.push([state.info]);
    aoa.push([]);

    // 表头：列提示
    var header = [""];
    for (var c = 0; c < state.cols; c++) header.push("第 " + (CN_NUM[c + 1] || (c + 1)) + " 列");
    aoa.push(header);

    for (var r = 0; r < state.rows; r++) {
      var line = ["第 " + (CN_NUM[r + 1] || (r + 1)) + " 排"];
      for (var cc = 0; cc < state.cols; cc++) {
        var v = state.seats[r] && state.seats[r][cc];
        line.push(v || "");
      }
      aoa.push(line);
    }
    aoa.push([]);
    aoa.push(["讲台"]);

    var ws = XLSX.utils.aoa_to_sheet(aoa);
    var wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "座位表");
    var fname = (state.title || "座位表").replace(/[\\/:*?"<>|]/g, "_") + ".xlsx";
    XLSX.writeFile(wb, fname);
  }

  /** 加载示例名单到 textarea
   * @returns {void} */
  function loadExample() {
    $("names").value = EXAMPLE_NAMES.join("\n");
    syncNames();
    saveState();
  }

  /** 清空名单 textarea
   * @returns {void} */
  function clearNames() {
    if (!confirm("确定清空学生名单吗？")) return;
    $("names").value = "";
    syncNames();
    state.seats = [];
    saveState();
  }

  /** 实时保存名单输入
   * @returns {void} */
  function onNamesInput() {
    syncNames();
    saveState();
  }

  /** 绑定所有事件
   * @returns {void} */
  function bindEvents() {
    $("randomBtn").addEventListener("click", randomArrange);
    $("regenBtn").addEventListener("click", regenerate);
    $("clearSeatsBtn").addEventListener("click", clearSeats);
    $("printBtn").addEventListener("click", printSheet);
    $("excelBtn").addEventListener("click", exportExcel);
    $("exampleBtn").addEventListener("click", loadExample);
    $("clearNamesBtn").addEventListener("click", clearNames);

    $("names").addEventListener("input", onNamesInput);
    $("rows").addEventListener("change", regenerate);
    $("cols").addEventListener("change", regenerate);
    $("podiumPos").addEventListener("change", renderSeats);
    $("viewMode").addEventListener("change", renderSeats);

    $("titleText").addEventListener("input", function () {
      readSettings(); applyPaperStyles(); saveState();
    });
    $("infoText").addEventListener("input", function () {
      readSettings(); applyPaperStyles(); saveState();
    });

    // 颜色与字号联动
    ["bgColor", "seatColor", "borderColor", "fontColor", "podiumColor", "podiumTextColor"].forEach(function (id) {
      $(id).addEventListener("input", function () { readSettings(); renderSeats(); });
    });
    $("nameSize").addEventListener("input", function () {
      readSettings();
      $("nameSizeVal").textContent = state.nameSize + "px";
      renderSeats();
    });
    ["nameBold", "showPodium", "showTip", "hideEmpty"].forEach(function (id) {
      $(id).addEventListener("change", renderSeats);
    });
    $("autoSave").addEventListener("change", function () {
      readSettings();
      saveState();
    });
  }

  /** 初始化：读取本地数据 → 写入控件 → 渲染 → 绑定事件
   * @returns {void} */
  function init() {
    loadState();
    if (!state.names.length) state.names = parseNames($("names").value);
    else $("names").value = state.names.join("\n");
    writeSettings();
    syncNames();
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
