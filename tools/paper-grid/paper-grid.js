/* ============================================================
 * EduToolbox · 备课本/方格纸生成 paper-grid.js
 * 功能：SVG 生成可打印稿纸（横线/方格/田字格/米字格/作文格），
 *       纸张与版式参数可调，支持打印与 SVG 下载
 * ============================================================ */
(function () {
  "use strict";

  var $ = function (id) { return document.getElementById(id); };
  var DATA_KEY = "edutoolbox.paper-grid.data";

  var PAPERS = { A4: [210, 297], A5: [148, 210], B5: [176, 250] };
  var TYPE_SIZE = { ruled: 9, grid: 10, tian: 15, mi: 15, compose: 8 };
  var TYPE_LABEL = { ruled: "横线本", grid: "方格本", tian: "田字格", mi: "米字格", compose: "作文格" };
  var NS = "http://www.w3.org/2000/svg";

  var state = {
    paper: "A4",
    type: "ruled",
    margin: 15,
    size: 9,
    perRow: 20,
    color: "#9db8e0",
    header: true,
    headerText: "",
    pageNum: false
  };

  /* ============ 提示条 ============ */
  function toast(msg) {
    var t = $("toast");
    if (!t) return;
    t.textContent = msg;
    t.classList.add("show");
    clearTimeout(toast._t);
    toast._t = setTimeout(function () { t.classList.remove("show"); }, 1800);
  }

  /* ============ 绘制 ============ */
  function n(v) { return Math.round(v * 100) / 100; }
  function mk(tag, attrs) {
    var el = document.createElementNS(NS, tag);
    for (var k in attrs) {
      if (Object.prototype.hasOwnProperty.call(attrs, k)) el.setAttribute(k, String(attrs[k]));
    }
    return el;
  }

  function build() {
    var svg = $("paperSvg");
    var size = PAPERS[state.paper] || PAPERS.A4;
    var W = size[0], H = size[1];
    var m = clampNum(state.margin, 5, 40);
    var headerH = state.header ? 12 : 0;
    var footerH = state.pageNum ? 10 : 0;
    var x0 = m, x1 = W - m, y0 = m + headerH, y1 = H - m - footerH;

    svg.setAttribute("viewBox", "0 0 " + W + " " + H);
    while (svg.firstChild) svg.removeChild(svg.firstChild);

    svg.appendChild(mk("rect", { x: 0, y: 0, width: W, height: H, fill: "#ffffff" }));

    if (x1 - x0 < 20 || y1 - y0 < 20) {
      $("stageOk").textContent = "参数过大";
      toast("页边距过大，请调小后再试");
      return;
    }

    var stats = { rows: 0, cols: 0, cells: 0 };

    if (state.type === "ruled") {
      var lh = clampNum(state.size, 4, 30);
      var d = "";
      var rows = 0;
      for (var y = y0 + lh; y <= y1 + 0.01; y += lh) {
        d += "M" + n(x0) + " " + n(y) + "H" + n(x1) + " ";
        rows += 1;
      }
      svg.appendChild(mk("path", { d: d, stroke: state.color, "stroke-width": 0.3, fill: "none" }));
      /* 装订线（左侧竖线） */
      if (m >= 8) {
        svg.appendChild(mk("path", {
          d: "M" + n(x0 - 5) + " " + n(y0) + "V" + n(y1),
          stroke: state.color, "stroke-width": 0.3, fill: "none", opacity: 0.8
        }));
      }
      stats.rows = rows;
      stats.cols = 0;
      stats.cells = 0;
    } else {
      var cw = clampNum(state.size, 4, 30);
      var cols;
      if (state.type === "compose") {
        cols = clampInt(state.perRow, 6, 40);
        cw = (x1 - x0) / cols;
      } else {
        cols = Math.floor((x1 - x0) / cw);
      }
      var usableW = cols * cw;
      var gridX1 = x0 + usableW;
      var rowsN = Math.floor((y1 - y0) / cw);
      var gridY1 = y0 + rowsN * cw;

      var g = "";
      for (var i = 0; i <= cols; i++) {
        var gx = x0 + i * cw;
        g += "M" + n(gx) + " " + n(y0) + "V" + n(gridY1) + " ";
      }
      for (var j = 0; j <= rowsN; j++) {
        var gy = y0 + j * cw;
        g += "M" + n(x0) + " " + n(gy) + "H" + n(gridX1) + " ";
      }
      svg.appendChild(mk("path", { d: g, stroke: state.color, "stroke-width": 0.3, fill: "none" }));

      /* 田字格 / 米字格：格内辅助线 */
      if (state.type === "tian" || state.type === "mi") {
        var aux = "";
        for (var r2 = 0; r2 < rowsN; r2++) {
          var cy = y0 + r2 * cw + cw / 2;
          aux += "M" + n(x0) + " " + n(cy) + "H" + n(gridX1) + " ";
          for (var c2 = 0; c2 < cols; c2++) {
            var cx = x0 + c2 * cw + cw / 2;
            aux += "M" + n(cx) + " " + n(y0 + r2 * cw) + "V" + n(y0 + (r2 + 1) * cw) + " ";
          }
        }
        svg.appendChild(mk("path", {
          d: aux, stroke: state.color, "stroke-width": 0.22, fill: "none",
          "stroke-dasharray": "1.2 1.2", opacity: 0.75
        }));
      }
      if (state.type === "mi") {
        var diag = "";
        for (var r3 = 0; r3 < rowsN; r3++) {
          for (var c3 = 0; c3 < cols; c3++) {
            var bx = x0 + c3 * cw, by = y0 + r3 * cw;
            diag += "M" + n(bx) + " " + n(by) + "L" + n(bx + cw) + " " + n(by + cw) + " ";
            diag += "M" + n(bx + cw) + " " + n(by) + "L" + n(bx) + " " + n(by + cw) + " ";
          }
        }
        svg.appendChild(mk("path", {
          d: diag, stroke: state.color, "stroke-width": 0.2, fill: "none",
          "stroke-dasharray": "0.8 1.4", opacity: 0.45
        }));
      }

      /* 作文格：左侧行号 */
      if (state.type === "compose" && m >= 10) {
        var nums = "";
        for (var r4 = 0; r4 < rowsN; r4++) {
          var t = mk("text", {
            x: n(x0 - 3.5), y: n(y0 + r4 * cw + cw / 2 + 1.2),
            "font-size": 2.8, fill: "#8a94a6", "text-anchor": "end",
            "font-family": "Microsoft YaHei, PingFang SC, sans-serif"
          });
          t.textContent = String(r4 + 1);
          svg.appendChild(t);
        }
        void nums;
      }

      stats.rows = rowsN;
      stats.cols = cols;
      stats.cells = rowsN * cols;
    }

    /* 页眉 */
    if (state.header) {
      var left = state.headerText || "学校__________　班级__________";
      var tl = mk("text", {
        x: n(x0), y: n(m + 6), "font-size": 4.4, fill: "#3a4356",
        "font-family": "Microsoft YaHei, PingFang SC, sans-serif"
      });
      tl.textContent = left;
      svg.appendChild(tl);
      var tr = mk("text", {
        x: n(x1), y: n(m + 6), "font-size": 4.4, fill: "#3a4356",
        "text-anchor": "end", "font-family": "Microsoft YaHei, PingFang SC, sans-serif"
      });
      tr.textContent = "姓名__________　日期__________";
      svg.appendChild(tr);
      svg.appendChild(mk("path", {
        d: "M" + n(x0) + " " + n(m + 9) + "H" + n(x1),
        stroke: state.color, "stroke-width": 0.3, fill: "none", opacity: 0.7
      }));
    }

    /* 页脚页码 */
    if (state.pageNum) {
      var tf = mk("text", {
        x: n(W / 2), y: n(H - m - 2), "font-size": 4, fill: "#6b7280",
        "text-anchor": "middle", "font-family": "Microsoft YaHei, PingFang SC, sans-serif"
      });
      tf.textContent = "第 ______ 页";
      svg.appendChild(tf);
    }

    /* 打印纸张尺寸 */
    var rule = $("pageRule");
    if (rule) rule.textContent = "@page{size:" + W + "mm " + H + "mm;margin:0}";

    $("statSize").textContent = state.paper;
    $("statRows").textContent = String(stats.rows);
    $("statCols").textContent = state.type === "ruled" ? "—" : String(stats.cols);
    $("statCells").textContent = state.type === "ruled" ? "—" : String(stats.cells);
    $("stageOk").textContent = TYPE_LABEL[state.type] + " · 已生成";
  }

  function clampNum(v, lo, hi) {
    v = parseFloat(v);
    if (isNaN(v)) v = lo;
    return Math.min(hi, Math.max(lo, v));
  }
  function clampInt(v, lo, hi) {
    v = parseInt(v, 10);
    if (isNaN(v)) v = lo;
    return Math.min(hi, Math.max(lo, v));
  }

  /* ============ 下载 ============ */
  function download() {
    var svg = $("paperSvg");
    var src;
    try {
      src = new XMLSerializer().serializeToString(svg);
    } catch (e) {
      toast("当前环境不支持导出");
      return;
    }
    if (src.indexOf('xmlns=') < 0) {
      src = src.replace("<svg", '<svg xmlns="' + NS + '"');
    }
    try {
      var blob = new Blob(['<?xml version="1.0" encoding="UTF-8"?>\n' + src], { type: "image/svg+xml;charset=utf-8" });
      var url = URL.createObjectURL(blob);
      var a = document.createElement("a");
      a.href = url;
      a.download = TYPE_LABEL[state.type] + "_" + state.paper + ".svg";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(function () { URL.revokeObjectURL(url); }, 1500);
      toast("已下载 SVG");
    } catch (e) { toast("导出失败"); }
  }

  /* ============ 事件 ============ */
  function chips(containerId, attr, onPick) {
    var box = $(containerId);
    box.querySelectorAll(".chip").forEach(function (c) {
      c.addEventListener("click", function () {
        var v = c.getAttribute(attr);
        box.querySelectorAll(".chip").forEach(function (x) { x.classList.remove("active"); });
        c.classList.add("active");
        onPick(v);
      });
    });
  }

  function syncForm() {
    $("sizeLabel").textContent = state.type === "ruled" ? "行高 (mm)" : "格宽 (mm)";
    $("perRowRow").hidden = state.type !== "compose";
    $("titleRow").hidden = !state.header;
    $("marginVal").value = state.margin;
    $("sizeVal").value = state.size;
    $("perRowVal").value = state.perRow;
    $("lineColor").value = state.color;
    $("chkHeader").checked = state.header;
    $("headerText").value = state.headerText;
    $("chkPageNum").checked = state.pageNum;
  }

  function save() {
    try { localStorage.setItem(DATA_KEY, JSON.stringify(state)); } catch (e) { /* 忽略 */ }
  }

  function bind() {

    chips("paperChips", "data-paper", function (v) { state.paper = v; syncForm(); build(); save(); });
    chips("typeChips", "data-type", function (v) {
      state.type = v;
      state.size = TYPE_SIZE[v] || state.size;
      syncForm(); build(); save();
    });

    ["marginVal", "sizeVal", "perRowVal"].forEach(function (id) {
      $(id).addEventListener("input", function () {
        state.margin = parseFloat($("marginVal").value) || state.margin;
        state.size = parseFloat($("sizeVal").value) || state.size;
        state.perRow = parseInt($("perRowVal").value, 10) || state.perRow;
        build(); save();
      });
    });
    $("lineColor").addEventListener("change", function () { state.color = this.value; build(); save(); });
    $("chkHeader").addEventListener("change", function () {
      state.header = this.checked; syncForm(); build(); save();
    });
    $("headerText").addEventListener("input", function () { state.headerText = this.value; build(); save(); });
    $("chkPageNum").addEventListener("change", function () { state.pageNum = this.checked; build(); save(); });

    $("btnPrint").addEventListener("click", function () {
      build();
      try { window.print(); } catch (e) { toast("打印不可用，请用浏览器 Ctrl+P"); }
    });
    $("btnDownload").addEventListener("click", download);
    $("btnReset").addEventListener("click", function () {
      state.paper = "A4"; state.type = "ruled"; state.margin = 15; state.size = 9;
      state.perRow = 20; state.color = "#9db8e0"; state.header = true;
      state.headerText = ""; state.pageNum = false;
      $("paperChips").querySelectorAll(".chip").forEach(function (c) {
        c.classList.toggle("active", c.getAttribute("data-paper") === "A4");
      });
      $("typeChips").querySelectorAll(".chip").forEach(function (c) {
        c.classList.toggle("active", c.getAttribute("data-type") === "ruled");
      });
      syncForm(); build(); save();
      toast("已恢复默认");
    });
  }

  /* ---------- 初始化 ---------- */
  function init() {
    try {
      var raw = localStorage.getItem(DATA_KEY);
      if (raw) {
        var d = JSON.parse(raw);
        if (d && typeof d === "object") {
          if (PAPERS[d.paper]) state.paper = d.paper;
          if (TYPE_LABEL[d.type]) state.type = d.type;
          if (typeof d.margin === "number") state.margin = d.margin;
          if (typeof d.size === "number") state.size = d.size;
          if (typeof d.perRow === "number") state.perRow = d.perRow;
          if (typeof d.color === "string") state.color = d.color;
          if (typeof d.header === "boolean") state.header = d.header;
          if (typeof d.headerText === "string") state.headerText = d.headerText;
          if (typeof d.pageNum === "boolean") state.pageNum = d.pageNum;
        }
      }
    } catch (e) { /* 忽略 */ }

    $("paperChips").querySelectorAll(".chip").forEach(function (c) {
      c.classList.toggle("active", c.getAttribute("data-paper") === state.paper);
    });
    $("typeChips").querySelectorAll(".chip").forEach(function (c) {
      c.classList.toggle("active", c.getAttribute("data-type") === state.type);
    });

    /* 舞台右上角工具栏（⛶ 舞台全屏 / ⚙ 隐藏设置），与随机叫号同构 */
    if (window.EduToolStageToolbar) {
      window.EduToolStageToolbar.init({ stage: ".stage-panel", panelHost: ".workbench", hiddenClass: "setup-hidden" });
    }
    bind();
    syncForm();
    build();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
