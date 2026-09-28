/* ============================================================
 * EduToolbox · 古诗文背诵打卡 poem-checkin.js
 * 功能：篇目管理 + 每日打卡 + 日历热力 + 随机抽背 + 本地持久化
 * 纯前端 IIFE；数据结构 { list:[{t,a}], logs:{ 'YYYY-M-D': [idx...] } }
 * ============================================================ */
(function () {
  "use strict";

  var $ = function (id) { return document.getElementById(id); };
  var DATA_KEY = "edutoolbox.poem-checkin.data";

  var PRESETS = {
    "小学必背20首": "静夜思｜李白\n春晓｜孟浩然\n悯农｜李绅\n登鹳雀楼｜王之涣\n江雪｜柳宗元\n咏鹅｜骆宾王\n画｜王维\n古朗月行（节选）｜李白\n风｜李峤\n凉州词｜王之涣\n出塞｜王昌龄\n芙蓉楼送辛渐｜王昌龄\n望庐山瀑布｜李白\n赠汪伦｜李白\n独坐敬亭山｜李白\n望天门山｜李白\n绝句｜杜甫\n春夜喜雨｜杜甫\n江畔独步寻花｜杜甫\n游子吟｜孟郊",
    "初中必背10篇": "观沧海｜曹操\n次北固山下｜王湾\n天净沙·秋思｜马致远\n论语十二章｜\n陋室铭｜刘禹锡\n爱莲说｜周敦颐\n岳阳楼记｜范仲淹\n醉翁亭记｜欧阳修\n出师表｜诸葛亮\n生于忧患死于安乐｜孟子",
    "三字经节选": "人之初｜三字经\n性相近｜三字经\n昔孟母｜三字经\n养不教｜三字经\n玉不琢｜三字经\n为人子｜三字经"
  };

  var state = {
    list: [],        // [{t:标题, a:作者}]
    logs: {},        // {'YYYY-M-D': [篇目下标,...]}
    cal: null,       // {y, m} 当前日历年月
    last: null       // 最近一次打卡（用于撤销）
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

  /* ============ 持久化 ============ */
  function save() {
    try {
      localStorage.setItem(DATA_KEY, JSON.stringify({ list: state.list, logs: state.logs }));
    } catch (e) { /* 隐私模式忽略 */ }
  }
  function load() {
    try {
      var raw = localStorage.getItem(DATA_KEY);
      if (!raw) return false;
      var d = JSON.parse(raw);
      state.list = d.list || [];
      state.logs = d.logs || {};
      return state.list.length > 0;
    } catch (e) { return false; }
  }

  /* ============ 日期 ============ */
  function dayKey(d) { return d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate(); }
  function today() { return dayKey(new Date()); }

  /* ============ 篇目 ============ */
  function parseList(text) {
    var out = [];
    String(text || "").split("\n").forEach(function (line) {
      var s = line.trim();
      if (!s) return;
      var parts = s.split(/[｜|]/);
      var t = (parts[0] || "").trim();
      if (!t) return;
      out.push({ t: t, a: (parts[1] || "").trim() });
    });
    return out;
  }

  function loadList(silent) {
    var list = parseList($("poemInput").value);
    if (!list.length) { toast("请至少填写一篇篇目"); return; }
    state.list = list;
    save();
    $("emptyState").hidden = true;
    $("mainArea").hidden = false;
    var now = new Date();
    state.cal = { y: now.getFullYear(), m: now.getMonth() };
    renderAll();
    if (!silent) toast("已载入 " + list.length + " 篇");
  }

  /* ============ 打卡 ============ */
  function checkin(idx, silent) {
    if (idx < 0 || idx >= state.list.length) return;
    var key = today();
    if (!state.logs[key]) state.logs[key] = [];
    state.logs[key].push(idx);
    state.last = { key: key, idx: idx };
    save();
    renderAll();
    if (!silent) toast("《" + state.list[idx].t + "》打卡 +1");
  }

  function undo() {
    if (!state.last) { toast("没有可撤销的打卡"); return; }
    var arr = state.logs[state.last.key] || [];
    var pos = arr.lastIndexOf(state.last.idx);
    if (pos >= 0) arr.splice(pos, 1);
    if (!arr.length) delete state.logs[state.last.key];
    state.last = null;
    save();
    renderAll();
    toast("已撤销上一次打卡");
  }

  function timesOf(idx) {
    var n = 0;
    for (var k in state.logs) {
      if (!Object.prototype.hasOwnProperty.call(state.logs, k)) continue;
      var arr = state.logs[k] || [];
      for (var i = 0; i < arr.length; i++) if (arr[i] === idx) n += 1;
    }
    return n;
  }

  /* ============ 渲染 ============ */
  function renderAll() {
    renderStats();
    renderCalendar();
    renderPoems();
  }

  function renderStats() {
    var total = state.list.length;
    var done = 0, times = 0;
    for (var i = 0; i < total; i++) {
      var n = timesOf(i);
      times += n;
      if (n > 0) done += 1;
    }
    $("poemCount").textContent = total;
    $("doneCount").textContent = done;
    $("statDone").textContent = done;
    $("statTimes").textContent = times;
    $("statToday").textContent = (state.logs[today()] || []).length;
    $("statStreak").textContent = streak();
    var pct = total ? Math.round(done / total * 100) : 0;
    $("progressFill").style.width = pct + "%";
    $("progressText").textContent = "完成度 " + pct + "%（" + done + "/" + total + " 篇已打卡）";
    $("stageOk").textContent = "今日已打卡 " + (state.logs[today()] || []).length + " 次";
  }

  function streak() {
    var n = 0;
    var d = new Date();
    /* 今天没打卡则从昨天起算，不影响连续天数体验 */
    if (!(state.logs[dayKey(d)] || []).length) d.setDate(d.getDate() - 1);
    while ((state.logs[dayKey(d)] || []).length) {
      n += 1;
      d.setDate(d.getDate() - 1);
    }
    return n;
  }

  function renderCalendar() {
    if (!state.cal) return;
    var y = state.cal.y, m = state.cal.m;
    $("calMonth").textContent = y + " 年 " + (m + 1) + " 月";
    var first = new Date(y, m, 1);
    var start = first.getDay();
    var days = new Date(y, m + 1, 0).getDate();
    var grid = $("calGrid");
    grid.innerHTML = "";
    for (var p = 0; p < start; p++) {
      var pad = document.createElement("div");
      pad.className = "cal-cell pad";
      grid.appendChild(pad);
    }
    var todayK = today();
    for (var d = 1; d <= days; d++) {
      var dt = new Date(y, m, d);
      var key = dayKey(dt);
      var n = (state.logs[key] || []).length;
      var cell = document.createElement("div");
      cell.className = "cal-cell" + (n >= 5 ? " lv3" : n >= 3 ? " lv2" : n >= 1 ? " lv1" : "") + (key === todayK ? " today" : "");
      cell.innerHTML = d + (n ? '<span class="n">' + n + " 次</span>" : "");
      cell.title = key + (n ? " 打卡 " + n + " 次" : " 无打卡");
      grid.appendChild(cell);
    }
  }

  function renderPoems() {
    var box = $("poemList");
    box.innerHTML = "";
    for (var i = 0; i < state.list.length; i++) {
      var item = state.list[i];
      var n = timesOf(i);
      var row = document.createElement("div");
      row.className = "poem-item" + (n ? " done" : "");
      var title = document.createElement("span");
      title.className = "poem-title";
      title.textContent = "《" + item.t + "》";
      var author = document.createElement("span");
      author.className = "poem-author";
      author.textContent = item.a || "";
      var times = document.createElement("span");
      times.className = "poem-times";
      times.textContent = n ? "×" + n : "未打卡";
      title.addEventListener("click", (function (idx) { return function () { checkin(idx, false); }; })(i));
      row.appendChild(title);
      row.appendChild(author);
      row.appendChild(times);
      box.appendChild(row);
    }
  }

  /* ============ 随机抽背 ============ */
  function draw() {
    if (!state.list.length) { toast("请先载入篇目"); return; }
    var idx = Math.floor(Math.random() * state.list.length);
    var item = state.list[idx];
    state.drawIdx = idx;
    $("drawCard").hidden = false;
    $("drawTitle").textContent = "《" + item.t + "》";
    $("drawAuthor").textContent = item.a ? "—— " + item.a : "";
  }

  /* ============ 事件 ============ */
  function bind() {
    var pw = $("presetChips");
    pw.innerHTML = Object.keys(PRESETS).map(function (k) {
      return '<button type="button" class="chip" data-v="' + k + '">' + k + "</button>";
    }).join("");
    pw.querySelectorAll(".chip").forEach(function (c) {
      c.addEventListener("click", function () {
        $("poemInput").value = PRESETS[c.getAttribute("data-v")];
        toast("已填入「" + c.getAttribute("data-v") + "」，点「载入清单」生效");
      });
    });

    $("btnLoadList").addEventListener("click", function () { loadList(false); });
    $("btnClearAll").addEventListener("click", function () {
      state.list = [];
      state.logs = {};
      state.last = null;
      save();
      $("mainArea").hidden = true;
      $("emptyState").hidden = false;
      renderStats();
      toast("已清空全部数据");
    });
    $("btnDraw").addEventListener("click", draw);
    $("btnDrawAgain").addEventListener("click", draw);
    $("btnDrawOk").addEventListener("click", function () {
      if (state.drawIdx == null) { toast("请先抽取篇目"); return; }
      checkin(state.drawIdx, false);
    });
    $("btnDrawUndo").addEventListener("click", undo);

    $("calPrev").addEventListener("click", function () { shiftMonth(-1); });
    $("calNext").addEventListener("click", function () { shiftMonth(1); });
  }

  function shiftMonth(delta) {
    if (!state.cal) return;
    state.cal.m += delta;
    if (state.cal.m < 0) { state.cal.m = 11; state.cal.y -= 1; }
    if (state.cal.m > 11) { state.cal.m = 0; state.cal.y += 1; }
    renderCalendar();
  }

  /* ---------- 初始化 ---------- */
  function init() {
    var now = new Date();
    state.cal = { y: now.getFullYear(), m: now.getMonth() };

    if (load()) {
      $("poemInput").value = state.list.map(function (x) { return x.t + (x.a ? "｜" + x.a : ""); }).join("\n");
      $("emptyState").hidden = true;
      $("mainArea").hidden = false;
      renderAll();
    } else {
      $("poemInput").value = PRESETS["小学必背20首"];
    }
    bind();
    renderStats();
    // 舞台右上角工具栏（⛶ 舞台全屏 / ⚙ 隐藏设置），与随机叫号同构
    if (window.EduToolStageToolbar) window.EduToolStageToolbar.init({ stage: ".stage-panel", panelHost: ".workbench" });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
