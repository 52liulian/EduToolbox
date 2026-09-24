/* ============================================================
 * EduToolbox · 文本表格互转 table-convert.js
 * 功能：CSV/TSV/Markdown/纯文本 ↔ Markdown/HTML/CSV/纯文本
 *       分隔符自动识别（含 Markdown 表格反向解析）、表头与对齐、
 *       实时预览、复制与文件下载
 * ============================================================ */
(function () {
  "use strict";

  var $ = function (id) { return document.getElementById(id); };
  var DATA_KEY = "edutoolbox.table-convert.data";

  var DELIM_LABEL = {
    auto: "自动", ",": "逗号", tab: "制表符", ";": "分号", "|": "竖线",
    space: "空格", custom: "自定义", md: "Markdown"
  };

  var state = {
    delim: "auto",      /* auto | , | tab | ; | | | space | custom */
    custom: "·",
    fmt: "md",          /* md | html | csv | txt */
    align: "left",
    header: true,
    trim: true,
    rows: [],
    usedDelim: "auto"
  };
  var debounceId = null;

  /* ============ 提示条 ============ */
  function toast(msg) {
    var t = $("toast");
    if (!t) return;
    t.textContent = msg;
    t.classList.add("show");
    clearTimeout(toast._t);
    toast._t = setTimeout(function () { t.classList.remove("show"); }, 1800);
  }

  /* ============ 解析 ============ */
  /* 引号/转义感知的分割 */
  function splitBy(line, delim) {
    var out = [], cur = "", inQ = false;
    for (var i = 0; i < line.length; i++) {
      var c = line.charAt(i);
      if (c === '"') {
        if (inQ && line.charAt(i + 1) === '"') { cur += '"'; i += 1; }
        else inQ = !inQ;
        continue;
      }
      if (!inQ && line.substr(i, delim.length) === delim) {
        out.push(cur); cur = ""; i += delim.length - 1; continue;
      }
      cur += c;
    }
    out.push(cur);
    return out;
  }
  /* Markdown 行分割：支持 \| 转义 */
  function splitMd(line) {
    var s = line.replace(/^\s*\|/, "").replace(/\|\s*$/, "");
    var out = [], cur = "";
    for (var i = 0; i < s.length; i++) {
      var c = s.charAt(i);
      if (c === "\\" && s.charAt(i + 1) === "|") { cur += "|"; i += 1; continue; }
      if (c === "|") { out.push(cur); cur = ""; continue; }
      cur += c;
    }
    out.push(cur);
    return out;
  }
  function isMdSep(cells) {
    if (!cells.length) return false;
    for (var i = 0; i < cells.length; i++) {
      if (!/^:?-{1,}:?$/.test(String(cells[i]).trim())) return false;
    }
    return true;
  }

  function detectDelim(lines) {
    /* Markdown 表格优先 */
    var mdCount = 0;
    for (var i = 0; i < lines.length; i++) if (/^\s*\|/.test(lines[i])) mdCount += 1;
    if (mdCount >= Math.max(2, Math.ceil(lines.length * 0.5))) return "md";

    var cands = ["\t", ",", ";", "|", "  "];
    var best = ",", bestScore = -1;
    for (var c = 0; c < cands.length; c++) {
      var d = cands[c], counts = [];
      for (var l = 0; l < lines.length; l++) counts.push(splitBy(lines[l], d).length - 1);
      var positive = 0, sum = 0;
      for (var k = 0; k < counts.length; k++) { if (counts[k] > 0) positive += 1; sum += counts[k]; }
      if (!sum) continue;
      var avg = sum / counts.length;
      var score = (positive / counts.length) * 10 + Math.min(avg, 12);
      /* 列数一致性加分 */
      var first = counts[0], same = 0;
      for (var m = 0; m < counts.length; m++) if (counts[m] === first) same += 1;
      score += (same / counts.length) * 4;
      if (score > bestScore) { bestScore = score; best = d; }
    }
    return best === "  " ? "space" : (best === "\t" ? "tab" : best);
  }

  function parse() {
    var text = $("srcInput").value.replace(/\r\n?/g, "\n");
    var raw = text.split("\n");
    var lines = [];
    for (var i = 0; i < raw.length; i++) {
      if (raw[i].replace(/\s+$/, "").length) lines.push(raw[i].replace(/\s+$/, ""));
    }
    if (!lines.length) { state.rows = []; state.usedDelim = "auto"; return; }

    var mode = state.delim;
    if (mode === "auto") mode = detectDelim(lines);
    state.usedDelim = mode;

    var rows = [];
    for (var r = 0; r < lines.length; r++) {
      var cells;
      if (mode === "md") {
        cells = splitMd(lines[r]);
        if (isMdSep(cells)) continue;      /* 跳过 |---|---| 分隔行 */
      } else if (mode === "space") {
        var t = lines[r].trim();
        var parts = t.split(/\s{2,}/);
        cells = parts.length > 1 ? parts : t.split(/\s+/);
      } else if (mode === "tab") {
        cells = splitBy(lines[r], "\t");
      } else if (mode === "custom") {
        cells = splitBy(lines[r], state.custom || "·");
      } else {
        cells = splitBy(lines[r], mode);
      }
      if (state.trim) {
        for (var c = 0; c < cells.length; c++) cells[c] = String(cells[c]).trim();
      }
      rows.push(cells);
    }

    /* 去掉完全空白行 */
    rows = rows.filter(function (row) {
      for (var i = 0; i < row.length; i++) if (String(row[i]).length) return true;
      return false;
    });

    var maxCols = 0;
    for (var m = 0; m < rows.length; m++) maxCols = Math.max(maxCols, rows[m].length);
    for (var n = 0; n < rows.length; n++) {
      while (rows[n].length < maxCols) rows[n].push("");
    }
    state.rows = rows;
  }

  /* ============ 生成 ============ */
  function escHtml(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c];
    });
  }
  function mdCell(s) {
    return String(s).replace(/\|/g, "\\|").replace(/\n/g, "<br>");
  }
  function csvCell(s) {
    var v = String(s);
    return /[",\n]/.test(v) ? '"' + v.replace(/"/g, '""') + '"' : v;
  }
  /* 显示宽度：中文按 2 计 */
  function dispWidth(s) {
    var w = 0;
    for (var i = 0; i < s.length; i++) {
      w += /[\u1100-\u115F\u2E80-\uA4CF\uAC00-\uD7A3\uF900-\uFAFF\uFE30-\uFE6F\uFF00-\uFF60\uFFE0-\uFFE6]/.test(s.charAt(i)) ? 2 : 1;
    }
    return w;
  }

  function toMarkdown() {
    var rows = state.rows;
    if (!rows.length) return "";
    var cols = rows[0].length, out = [];
    var head = state.header ? rows[0] : null;
    var body = state.header ? rows.slice(1) : rows;
    if (!head) {
      head = [];
      for (var i = 0; i < cols; i++) head.push("列 " + (i + 1));
    }
    out.push("| " + head.map(mdCell).join(" | ") + " |");
    var mark = state.align === "center" ? ":---:" : (state.align === "right" ? "---:" : ":---");
    var sep = [];
    for (var s = 0; s < cols; s++) sep.push(mark);
    out.push("| " + sep.join(" | ") + " |");
    for (var b = 0; b < body.length; b++) {
      out.push("| " + body[b].map(mdCell).join(" | ") + " |");
    }
    return out.join("\n");
  }

  function toHtml() {
    var rows = state.rows;
    if (!rows.length) return "";
    var body = state.header ? rows.slice(1) : rows;
    var out = ["<table>"];
    if (state.header) {
      out.push("  <thead>");
      out.push("    <tr>" + rows[0].map(function (c) { return "<th>" + escHtml(c) + "</th>"; }).join("") + "</tr>");
      out.push("  </thead>");
    }
    out.push("  <tbody>");
    for (var i = 0; i < body.length; i++) {
      out.push("    <tr>" + body[i].map(function (c) { return "<td>" + escHtml(c) + "</td>"; }).join("") + "</tr>");
    }
    out.push("  </tbody>");
    out.push("</table>");
    return out.join("\n");
  }

  function toCsv() {
    var rows = state.rows;
    var out = [];
    for (var i = 0; i < rows.length; i++) out.push(rows[i].map(csvCell).join(","));
    return out.join("\n");
  }

  function toPlain() {
    var rows = state.rows;
    if (!rows.length) return "";
    var cols = rows[0].length, widths = [];
    for (var c = 0; c < cols; c++) {
      var w = 0;
      for (var r = 0; r < rows.length; r++) w = Math.max(w, dispWidth(String(rows[r][c])));
      widths.push(w);
    }
    var out = [];
    for (var i = 0; i < rows.length; i++) {
      var cells = [];
      for (var k = 0; k < cols; k++) {
        var s = String(rows[i][k]);
        var pad = widths[k] - dispWidth(s);
        cells.push(s + new Array(Math.max(0, pad) + 1).join(" "));
      }
      out.push(cells.join(" ").replace(/\s+$/, ""));
    }
    return out.join("\n");
  }

  function genOutput() {
    if (state.fmt === "md") return toMarkdown();
    if (state.fmt === "html") return toHtml();
    if (state.fmt === "csv") return toCsv();
    return toPlain();
  }

  /* ============ 渲染 ============ */
  function renderPreview() {
    var wrap = $("previewWrap");
    wrap.innerHTML = "";
    var rows = state.rows;
    if (!rows.length) return;
    var table = document.createElement("table");
    var thead = document.createElement("thead");
    var htr = document.createElement("tr");
    if (!state.header) {
      var ith = document.createElement("th");
      ith.className = "idx";
      ith.textContent = "#";
      htr.appendChild(ith);
    }
    var head = state.header ? rows[0] : null;
    var cols = rows[0].length;
    for (var c = 0; c < cols; c++) {
      var th = document.createElement("th");
      th.textContent = head ? head[c] : ("列 " + (c + 1));
      htr.appendChild(th);
    }
    thead.appendChild(htr);
    table.appendChild(thead);

    var tbody = document.createElement("tbody");
    var body = state.header ? rows.slice(1) : rows;
    for (var i = 0; i < body.length; i++) {
      var tr = document.createElement("tr");
      if (!state.header) {
        var td0 = document.createElement("td");
        td0.className = "idx";
        td0.textContent = String(i + 1);
        tr.appendChild(td0);
      }
      for (var k = 0; k < cols; k++) {
        var td = document.createElement("td");
        td.textContent = body[i][k];
        tr.appendChild(td);
      }
      tbody.appendChild(tr);
    }
    table.appendChild(tbody);
    wrap.appendChild(table);
    $("previewSub").textContent = body.length + " 行 × " + cols + " 列";
  }

  function convert(quiet) {
    parse();
    var rows = state.rows;
    var has = rows.length > 0;
    $("emptyState").hidden = has;
    $("resultArea").hidden = !has;

    var dataRows = has ? (state.header ? Math.max(0, rows.length - 1) : rows.length) : 0;
    $("statRows").textContent = String(dataRows);
    $("statCols").textContent = has ? String(rows[0].length) : "0";
    $("statDelim").textContent = has ? (DELIM_LABEL[state.usedDelim] || state.usedDelim) : "—";
    $("statChars").textContent = String($("srcInput").value.length);
    $("stageOk").textContent = has ? "已转换" : "等待输入";

    if (!has) {
      $("outText").value = "";
      $("previewWrap").innerHTML = "";
      return;
    }
    $("outText").value = genOutput();
    $("outLabel").textContent = ({ md: "Markdown", html: "HTML", csv: "CSV", txt: "纯文本" })[state.fmt];
    renderPreview();
    if (!quiet) toast("转换完成：" + dataRows + " 行 × " + rows[0].length + " 列");
    save();
  }

  function save() {
    try {
      localStorage.setItem(DATA_KEY, JSON.stringify({
        delim: state.delim, custom: state.custom, fmt: state.fmt,
        align: state.align, header: state.header, trim: state.trim,
        input: $("srcInput").value.slice(0, 20000)
      }));
    } catch (e) { /* 忽略 */ }
  }

  /* ============ 复制 / 下载 ============ */
  function copy(text) {
    if (!text) { toast("没有可复制的内容"); return; }
    var done = function () { toast("已复制到剪贴板"); };
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(done, fallback);
        return;
      }
    } catch (e) { /* 忽略 */ }
    fallback();
    function fallback() {
      try {
        var ta = document.createElement("textarea");
        ta.value = text;
        ta.setAttribute("readonly", "");
        ta.style.position = "fixed";
        ta.style.opacity = "0";
        document.body.appendChild(ta);
        ta.select();
        document.execCommand("copy");
        document.body.removeChild(ta);
        done();
      } catch (e2) { toast("复制失败，请手动选中复制"); }
    }
  }

  function download() {
    var text = $("outText").value;
    if (!text) { toast("还没有转换结果"); return; }
    var ext = { md: "md", html: "html", csv: "csv", txt: "txt" }[state.fmt];
    var mime = { md: "text/markdown", html: "text/html", csv: "text/csv", txt: "text/plain" }[state.fmt];
    var name = "表格转换_" + stamp() + "." + ext;
    try {
      var blob = new Blob([(ext === "csv" ? "\ufeff" : "") + text], { type: mime + ";charset=utf-8" });
      var url = URL.createObjectURL(blob);
      var a = document.createElement("a");
      a.href = url;
      a.download = name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(function () { URL.revokeObjectURL(url); }, 1500);
      toast("已下载 " + name);
    } catch (e) { toast("下载失败，请用「复制结果」"); }
  }
  function stamp() {
    var d = new Date(), p = function (n) { return n < 10 ? "0" + n : String(n); };
    return d.getFullYear() + p(d.getMonth() + 1) + p(d.getDate()) + "_" + p(d.getHours()) + p(d.getMinutes());
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

  function syncAlignRow() {
    $("alignRow").hidden = state.fmt !== "md";
    $("customRow").hidden = state.delim !== "custom";
  }

  function bind() {

    chips("delimChips", "data-delim", function (v) { state.delim = v; syncAlignRow(); convert(true); });
    chips("fmtChips", "data-fmt", function (v) { state.fmt = v; syncAlignRow(); convert(true); });
    chips("alignChips", "data-align", function (v) { state.align = v; convert(true); });

    $("customDelim").addEventListener("input", function () {
      state.custom = this.value || "·";
      convert(true);
    });
    $("chkHeader").addEventListener("change", function () { state.header = this.checked; convert(true); });
    $("chkTrim").addEventListener("change", function () { state.trim = this.checked; convert(true); });

    $("srcInput").addEventListener("input", function () {
      clearTimeout(debounceId);
      debounceId = setTimeout(function () { convert(true); }, 260);
    });
    $("srcInput").addEventListener("keydown", function (e) {
      if ((e.ctrlKey || e.metaKey) && e.key === "Enter") { e.preventDefault(); convert(); }
    });

    $("btnConvert").addEventListener("click", function () { convert(); });
    $("btnCopy").addEventListener("click", function () { copy($("outText").value); });
    $("btnDownload").addEventListener("click", download);
    $("btnClear").addEventListener("click", function () {
      $("srcInput").value = "";
      convert(true);
      toast("已清空");
    });
    $("btnSample").addEventListener("click", function () {
      $("srcInput").value = [
        "姓名,语文,数学,英语,总分",
        "张三,92,88,95,275",
        "李四,85,91,79,255",
        "王五,78,96,88,262",
        "赵六,90,84,92,266",
        "孙七,\"66,5\",73,81,220"
      ].join("\n");
      convert();
    });
  }

  /* ---------- 初始化 ---------- */
  function init() {
    try {
      var raw = localStorage.getItem(DATA_KEY);
      if (raw) {
        var d = JSON.parse(raw);
        if (d && typeof d === "object") {
          if (d.delim) state.delim = d.delim;
          if (typeof d.custom === "string") state.custom = d.custom;
          if (d.fmt) state.fmt = d.fmt;
          if (d.align) state.align = d.align;
          if (typeof d.header === "boolean") state.header = d.header;
          if (typeof d.trim === "boolean") state.trim = d.trim;
          if (typeof d.input === "string") $("srcInput").value = d.input;
        }
      }
    } catch (e) { /* 忽略 */ }

    /* 还原选中态 */
    [["delimChips", "data-delim", state.delim], ["fmtChips", "data-fmt", state.fmt], ["alignChips", "data-align", state.align]].forEach(function (pair) {
      $(pair[0]).querySelectorAll(".chip").forEach(function (c) {
        c.classList.toggle("active", c.getAttribute(pair[1]) === pair[2]);
      });
    });
    $("customDelim").value = state.custom;
    $("chkHeader").checked = state.header;
    $("chkTrim").checked = state.trim;

    /* 舞台右上角工具栏（⛶ 舞台全屏 / ⚙ 隐藏设置），与随机叫号同构 */
    if (window.EduToolStageToolbar) {
      window.EduToolStageToolbar.init({ stage: ".stage-panel", panelHost: ".workbench", hiddenClass: "setup-hidden" });
    }
    bind();
    syncAlignRow();
    convert(true);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
