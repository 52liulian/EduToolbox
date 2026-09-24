/* ============================================================
 * EduToolbox · 成绩统计分析 grade-analyzer.js
 * 功能：粘贴单科成绩 → 均分/极值/中位数/标准差/四率 + 分数段分布
 * 纯前端 IIFE，全部本地计算，可打印分析报告
 * ============================================================ */
(function () {
  "use strict";

  var $ = function (id) { return document.getElementById(id); };
  var esc = function (s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]; }); };

  /* ---------- 状态 ---------- */
  var state = {
    list: [],       // [{name, score}]
    stats: null
  };

  /* ============ 提示条 ============ */
  var toastTimer;
  function toast(msg) {
    var t = $("toast");
    if (!t) return;
    t.textContent = msg;
    t.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { t.classList.remove("show"); }, 2200);
  }

  /* ============ 数据解析 ============ */
  function parseData() {
    var raw = $("rawData").value.replace(/\r/g, "");
    var lines = raw.split("\n").map(function (s) { return s.trim(); }).filter(Boolean);
    if (lines.length < 1) { toast("请先输入成绩"); return false; }
    var list = [];
    lines.forEach(function (line) {
      // 分割方式：Tab / 逗号 / 连续空格
      var parts = line.split(/[\t,，]|\s{2,}|\s+/).map(function (s) { return s.trim(); }).filter(Boolean);
      if (!parts.length) return;
      var score = parseFloat(parts[parts.length - 1]);
      if (isNaN(score)) return;
      var name = parts.length > 1 ? parts.slice(0, parts.length - 1).join(" ") : "";
      list.push({ name: name, score: score });
    });
    if (!list.length) { toast("未解析到有效分数"); return false; }
    state.list = list;
    return true;
  }

  /* ============ 统计 ============ */
  function avg(a) { return a.length ? a.reduce(function (s, x) { return s + x; }, 0) / a.length : 0; }
  function stddev(a) {
    if (a.length < 2) return 0;
    var m = avg(a);
    return Math.sqrt(avg(a.map(function (x) { return (x - m) * (x - m); })));
  }
  function median(a) {
    if (!a.length) return 0;
    var s = a.slice().sort(function (x, y) { return x - y; });
    var mid = Math.floor(s.length / 2);
    return s.length % 2 ? s[mid] : (s[mid - 1] + s[mid]) / 2;
  }
  var round = function (v, d) { var p = Math.pow(10, d == null ? 1 : d); return Math.round(v * p) / p; };

  function analyze() {
    if (!parseData()) return;
    var full = parseFloat($("fullScore").value) || 100;
    var excR = parseFloat($("excLine").value) || 85;
    var passR = parseFloat($("passLine").value) || 60;
    var exc = excR / 100 * full;
    var pass = passR / 100 * full;
    var scores = state.list.map(function (r) { return r.score; });

    var st = {
      n: scores.length,
      avg: round(avg(scores), 1),
      max: Math.max.apply(null, scores),
      min: Math.min.apply(null, scores),
      med: round(median(scores), 1),
      std: round(stddev(scores), 1),
      excN: scores.filter(function (v) { return v >= exc; }).length,
      passN: scores.filter(function (v) { return v >= pass; }).length,
      failN: scores.filter(function (v) { return v < pass; }).length
    };
    st.excRate = round(st.excN / st.n * 100, 1);
    st.passRate = round(st.passN / st.n * 100, 1);
    st.failRate = round(st.failN / st.n * 100, 1);
    state.stats = st;

    $("emptyView").style.display = "none";
    $("resultView").style.display = "block";
    $("stageOk").textContent = "已分析 " + st.n + " 人";
    renderKPI(st);
    renderRates(st, full);
    renderDist(st, full, exc, pass);
    renderTable(st, full, exc, pass);
    renderNote(st, excR, passR);
  }

  /* ============ KPI ============ */
  function renderKPI(st) {
    var cards = [
      ["k1", "参考人数", st.n, "条有效记录"],
      ["k2", "平均分", st.avg, "集中趋势"],
      ["k3", "最高分", st.max, "与最低差 " + round(st.max - st.min, 1)],
      ["k4", "最低分", st.min, "需重点关注"],
      ["k5", "中位数", st.med, "中间水平"],
      ["k6", "标准差", st.std, "离散程度"]
    ];
    $("kpiGrid").innerHTML = cards.map(function (c) {
      return '<div class="kpi ' + c[0] + '"><div class="k-label">' + c[1] + '</div><div class="k-val">' + c[2] + '</div><div class="k-sub">' + c[3] + "</div></div>";
    }).join("");
  }

  /* ============ 四率 ============ */
  function renderRates(st, full) {
    var items = [
      ["good", "及格率", st.passRate, st.excRate],
      ["warn", "优秀率", st.excRate, 0],
      ["bad", "不及格率", st.failRate, 0]
    ];
    var html = items.map(function (it) {
      var cls = it[0], label = it[1], v = it[2];
      var p = Math.min(100, v);
      return '<div class="rate ' + cls + '"><div class="ring" style="--p:' + p * 3.6 + "deg\"><i>" + v + "%</i></div><div><div class=\"r-t\">" + label + '</div><div class="r-v">' + v + "%</div></div></div>";
    }).join("");
    // 优秀率环
    var excHtml = '<div class="rate good"><div class="ring" style="--p:' + Math.min(100, st.excRate) * 3.6 + "deg\"><i>" + st.excRate + "%</i></div><div><div class=\"r-t\">优秀率</div><div class=\"r-v\">" + st.excRate + "%</div></div></div>";
    $("rateRow").innerHTML = excHtml + html;
  }

  /* ============ 分数段柱状图 ============ */
  function renderDist(st, full, exc, pass) {
    var segs = 10;
    var size = full / segs;
    var counts = new Array(segs).fill(0);
    state.list.forEach(function (r) {
      var i = Math.floor(r.score / size);
      if (i >= segs) i = segs - 1;
      if (i < 0) i = 0;
      counts[i] += 1;
    });
    var max = Math.max.apply(null, counts.concat([1]));
    $("bars").innerHTML = counts.map(function (c, i) {
      var lo = round(i * size, 0), hi = round((i + 1) * size, 0);
      var cls = hi <= pass ? "r" : (lo >= exc ? "g" : "");
      return '<div class="bar-col"><div class="bar ' + cls + '" style="height:' + (c / max * 160) + 'px"><span class="b-v">' + (c > 0 ? c : "") + "</span></div></div>";
    }).join("");
    $("xAxis").innerHTML = counts.map(function (c, i) {
      var lo = round(i * size, 0), hi = round((i + 1) * size, 0);
      return '<div class="x-lab">' + lo + "–" + hi + "</div>";
    }).join("");
  }

  /* ============ 分数段明细表 ============ */
  function renderTable(st, full, exc, pass) {
    var segs = 10;
    var size = full / segs;
    var counts = new Array(segs).fill(0);
    state.list.forEach(function (r) {
      var i = Math.floor(r.score / size);
      if (i >= segs) i = segs - 1;
      if (i < 0) i = 0;
      counts[i] += 1;
    });
    var max = Math.max.apply(null, counts.concat([1]));
    var acc = 0;
    var rows = counts.map(function (c, i) {
      var lo = round(i * size, 0), hi = round((i + 1) * size, 0);
      acc += c;
      var pct = round(c / st.n * 100, 1);
      var accPct = round(acc / st.n * 100, 1);
      var cls = hi <= pass ? "low" : (lo >= exc ? "hi" : "");
      var pv = Math.round(c / max * 100);
      return '<tr class="' + cls + '"><td>' + lo + "–" + hi + '</td><td><span class="mini-bar" style="width:' + (pv * 1.6) + 'px"></span></td><td>' + c + '</td><td>' + pct + "%</td><td>" + accPct + "%</td></tr>";
    }).join("");
    $("segTable").innerHTML = '<thead><tr><th>分数段</th><th>分布</th><th>人数</th><th>占比</th><th>累计</th></tr></thead><tbody>' + rows + "</tbody>";
  }

  /* ============ 小结 ============ */
  function renderNote(st, excR, passR) {
    var title = $("reportTitle").value.trim() || "本次成绩";
    var diff = "（标准差 " + st.std + "）";
    var trend = st.std <= 10 ? "整体较均衡" : (st.std <= 18 ? "存在一定分层" : "两极分化较明显");
    var excC = st.excRate >= 60 ? "优秀率表现良好" : (st.excRate >= 30 ? "优秀率尚可" : "优秀率偏低，建议培优");
    var html = "<b>" + esc(title) + "</b> 分析：共 " + st.n + " 人，平均 " + st.avg + " 分，最高 " + st.max + " 分、最低 " + st.min + " 分，中位数 " + st.med + " 分" + diff + "。及格率 " + st.passRate + "%（≥" + passR + "% 线），优秀率 " + st.excRate + "%，不及格 " + st.failN + " 人。整体" + trend + "，" + excC + "。";
    $("noteLine").innerHTML = html;
  }

  /* ============ 示例数据 ============ */
  function loadDemo() {
    var names = ["陈宇轩", "王梓涵", "李欣怡", "张浩然", "刘子涵", "陈思远", "杨语桐", "赵俊杰", "黄诗涵", "周宇航", "吴梦洁", "郑博文", "孙雅琪", "马天佑", "朱梓萱", "胡晨曦", "林俊豪", "何欣妍", "罗志强", "高梓睿", "谢雨泽", "唐婉清", "韩明哲", "曹馨月", "邓嘉怡", "冯子墨", "蒋欣悦", "沈嘉豪", "韩雪", "袁博超"];
    var seed = 20260921;
    var rnd = function () { seed = (seed * 9301 + 49297) % 233280; return seed / 233280; };
    $("rawData").value = names.map(function (n) { return n + " " + Math.floor(rnd() * 55 + 45); }).join("\n");
    $("reportTitle").value = "三年级数学期末卷面分析";
    toast("已载入示例数据");
    analyze();
  }

  /* ============ 事件 ============ */
  function bind() {
    $("btnAnalyze").addEventListener("click", analyze);
    $("btnDemo").addEventListener("click", loadDemo);
    $("btnPrint").addEventListener("click", function () { window.print(); });
    ["fullScore", "excLine", "passLine"].forEach(function (id) {
      $(id).addEventListener("input", function () { if (state.list.length && $("resultView").style.display !== "none") analyze(); });
    });
  }

  /* ---------- 初始化 ---------- */
  function init() {
    if (window.EduToolStageToolbar) window.EduToolStageToolbar.init({ stage: ".stage-panel", panelHost: ".workbench", hiddenClass: "setup-hidden" });
    bind();
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
