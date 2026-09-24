/* ============================================================
 * EduToolbox · 值日安排表 duty-roster.js
 * 功能：名单 × 岗位 自动轮换排班（按天 / 按周），支持打印
 * 纯前端 IIFE；轮换采用游标递增，保证人人轮到且尽量均衡
 * ============================================================ */
(function () {
  "use strict";

  var $ = function (id) { return document.getElementById(id); };
  var DATA_KEY = "edutoolbox.duty-roster.data";
  var WEEK = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];

  var JOB_PRESETS = {
    "通用值日": ["扫地", "擦黑板", "倒垃圾", "摆桌椅"],
    "教室清洁": ["扫地", "拖地", "擦黑板", "擦窗台", "倒垃圾", "整理讲台"],
    "包干区": ["走廊清扫", "楼梯清扫", "花坛保洁", "垃圾桶清理"],
    "两岗精简": ["扫地", "擦黑板"]
  };

  var state = { cycle: "day", rows: [] };

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
  function lines(v) {
    return String(v || "").split("\n").map(function (s) { return s.trim(); }).filter(Boolean);
  }

  function saveData() {
    try {
      localStorage.setItem(DATA_KEY, JSON.stringify({
        names: $("names").value, jobs: $("jobs").value,
        cycle: state.cycle, perJob: $("perJob").value,
        skip: $("chkSkipWeekend").checked, count: $("periodCount").value
      }));
    } catch (e) { /* 隐私模式忽略 */ }
  }
  function loadData() {
    try {
      var raw = localStorage.getItem(DATA_KEY);
      if (!raw) return false;
      var d = JSON.parse(raw);
      $("names").value = d.names || "";
      $("jobs").value = d.jobs || "";
      if (d.cycle) { state.cycle = d.cycle; }
      if (d.perJob) $("perJob").value = d.perJob;
      if (typeof d.skip === "boolean") $("chkSkipWeekend").checked = d.skip;
      if (d.count) $("periodCount").value = d.count;
      return true;
    } catch (e) { return false; }
  }

  /* ============ 日期工具 ============ */
  function pad(n) { return n < 10 ? "0" + n : String(n); }
  function fmtDate(d) { return (d.getMonth() + 1) + "/" + d.getDate(); }
  function addDays(d, n) { var x = new Date(d.getTime()); x.setDate(x.getDate() + n); return x; }

  function buildPeriods() {
    var startStr = $("startDate").value;
    var start = startStr ? new Date(startStr + "T00:00:00") : new Date();
    if (isNaN(start.getTime())) start = new Date();
    var count = parseInt($("periodCount").value, 10);
    if (isNaN(count) || count < 1) count = 5;
    if (count > 60) count = 60;
    var skip = $("chkSkipWeekend").checked;
    var out = [];
    var cursor = new Date(start.getTime());
    var guard = 0;
    while (out.length < count && guard < 400) {
      var wd = cursor.getDay();
      if (!(skip && (wd === 0 || wd === 6))) {
        if (state.cycle === "week") {
          var weekEnd = addDays(cursor, 6 - ((wd + 6) % 7));
          out.push({ label: fmtDate(cursor) + " - " + fmtDate(weekEnd), tag: "第 " + (out.length + 1) + " 周", weekend: false });
          cursor = addDays(weekEnd, 1);
        } else {
          out.push({ label: fmtDate(cursor) + " " + WEEK[wd], tag: pad(cursor.getMonth() + 1) + "-" + pad(cursor.getDate()), weekend: false });
          cursor = addDays(cursor, 1);
        }
      } else {
        cursor = addDays(cursor, 1);
      }
      guard += 1;
    }
    return out;
  }

  /* ============ 生成 ============ */
  function generate() {
    var names = lines($("names").value);
    var jobs = lines($("jobs").value);
    var perJob = parseInt($("perJob").value, 10);
    if (!names.length) { toast("请先填写学生名单"); return; }
    if (!jobs.length) { toast("请先填写值日岗位"); return; }
    if (isNaN(perJob) || perJob < 1) perJob = 1;
    if (perJob > 10) perJob = 10;

    if ($("chkShuffle").checked) {
      for (var s = names.length - 1; s > 0; s--) {
        var r = Math.floor(Math.random() * (s + 1));
        var tmp = names[s]; names[s] = names[r]; names[r] = tmp;
      }
    }

    var periods = buildPeriods();
    var need = periods.length * jobs.length * perJob;
    var cursor = 0;
    var rows = [];
    for (var p = 0; p < periods.length; p++) {
      var cells = [];
      for (var j = 0; j < jobs.length; j++) {
        var who = [];
        for (var k = 0; k < perJob; k++) {
          who.push(names[cursor % names.length]);
          cursor += 1;
        }
        cells.push(who);
      }
      rows.push({ period: periods[p], cells: cells });
    }

    state.rows = rows;
    renderTable(jobs);
    saveData();

    var tip = "共 " + periods.length + " 个时段 × " + jobs.length + " 个岗位 × 每岗 " + perJob + " 人 = " + need + " 人次；";
    if (need < names.length) tip += "名单尚未全部轮到，可适当增加时段数量。";
    else {
      var rounds = Math.floor(need / names.length);
      tip += "人均约 " + (Math.round(need / names.length * 10) / 10) + " 次（完整轮转 " + rounds + " 轮）。";
    }
    $("tableTip").textContent = tip;
    $("stageOk").textContent = "已生成 " + periods.length + " 个时段";
  }

  function renderTable(jobs) {
    var table = $("dutyTable");
    table.innerHTML = "";
    $("emptyState").hidden = true;
    $("tableArea").hidden = false;

    var thead = document.createElement("thead");
    var htr = document.createElement("tr");
    var th0 = document.createElement("th");
    th0.textContent = state.cycle === "week" ? "周次 / 日期" : "日期";
    htr.appendChild(th0);
    for (var i = 0; i < jobs.length; i++) {
      var th = document.createElement("th");
      th.textContent = jobs[i];
      htr.appendChild(th);
    }
    thead.appendChild(htr);
    table.appendChild(thead);

    var tbody = document.createElement("tbody");
    for (var r = 0; r < state.rows.length; r++) {
      var row = state.rows[r];
      var tr = document.createElement("tr");
      var th = document.createElement("th");
      th.textContent = row.period.label;
      tr.appendChild(th);
      for (var c = 0; c < row.cells.length; c++) {
        var td = document.createElement("td");
        for (var w = 0; w < row.cells[c].length; w++) {
          var span = document.createElement("span");
          span.className = "who";
          span.textContent = row.cells[c][w];
          td.appendChild(span);
        }
        tr.appendChild(td);
      }
      tbody.appendChild(tr);
    }
    table.appendChild(tbody);
  }

  /* ============ 复制 / 打印 ============ */
  function plainText() {
    if (!state.rows.length) return "";
    var jobs = lines($("jobs").value);
    var out = ["日期\t" + jobs.join("\t")];
    for (var i = 0; i < state.rows.length; i++) {
      var row = state.rows[i];
      out.push(row.period.label + "\t" + row.cells.map(function (c) { return c.join("、"); }).join("\t"));
    }
    return out.join("\n");
  }

  function copyTable() {
    if (!state.rows.length) { toast("请先生成安排表"); return; }
    var text = plainText();
    function done() { toast("已复制为表格文本"); }
    function fallback() {
      try {
        var ta = document.createElement("textarea");
        ta.value = text;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand("copy");
        document.body.removeChild(ta);
        toast("已复制");
      } catch (e) { toast("复制失败，请手动复制"); }
    }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(done, fallback);
    } else fallback();
  }

  /* ============ 事件 ============ */
  function bind() {
    var pw = $("jobPresets");
    pw.innerHTML = Object.keys(JOB_PRESETS).map(function (k) {
      return '<button type="button" class="chip" data-v="' + k + '">' + k + "</button>";
    }).join("");
    pw.querySelectorAll(".chip").forEach(function (c) {
      c.addEventListener("click", function () {
        $("jobs").value = JOB_PRESETS[c.getAttribute("data-v")].join("\n");
        updateCounts();
        toast("已填入「" + c.getAttribute("data-v") + "」岗位");
      });
    });

    $("cycleChips").querySelectorAll(".chip").forEach(function (c) {
      c.addEventListener("click", function () {
        state.cycle = c.getAttribute("data-cycle") || "day";
        $("cycleChips").querySelectorAll(".chip").forEach(function (x) { x.classList.remove("active"); });
        c.classList.add("active");
      });
    });

    $("names").addEventListener("input", updateCounts);
    $("jobs").addEventListener("input", updateCounts);
    $("btnGen").addEventListener("click", generate);
    $("btnCopy").addEventListener("click", copyTable);
    $("btnPrint").addEventListener("click", function () {
      if (!state.rows.length) { toast("请先生成安排表"); return; }
      try { window.print(); } catch (e) { toast("当前环境不支持打印"); }
    });
  }

  function updateCounts() {
    $("nameCount").textContent = lines($("names").value).length;
    $("jobCount").textContent = lines($("jobs").value).length;
  }

  /* ---------- 初始化 ---------- */
  function init() {
    if (window.EduToolStageToolbar) window.EduToolStageToolbar.init({ stage: ".stage-panel", panelHost: ".workbench", hiddenClass: "setup-hidden" });

    var has = loadData();
    if (!has) {
      $("jobs").value = JOB_PRESETS["通用值日"].join("\n");
      var d = new Date();
      $("startDate").value = d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate());
    }
    if (!$("startDate").value) {
      var d2 = new Date();
      $("startDate").value = d2.getFullYear() + "-" + pad(d2.getMonth() + 1) + "-" + pad(d2.getDate());
    }
    $("cycleChips").querySelectorAll(".chip").forEach(function (c) {
      c.classList.toggle("active", (c.getAttribute("data-cycle") === state.cycle));
    });
    bind();
    updateCounts();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
