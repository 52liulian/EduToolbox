/* ============================================================
 * EduToolbox · 课堂即时投票 class-vote.js
 * 功能：题目/选项编辑、单选多选、参与口令与链接、学生端模拟投票、
 *       实时条形图统计、结果复制与 CSV 导出（localStorage 持久化）
 * ============================================================ */
(function () {
  "use strict";

  var $ = function (id) { return document.getElementById(id); };
  var DATA_KEY = "edutoolbox.class-vote.data";
  var MAX_OPT = 8;

  var state = {
    title: "这节课你最喜欢哪个环节？",
    options: ["导入讲解", "小组合作", "动手练习", "总结拓展"],
    mode: "single",
    status: "idle",        /* idle | live | closed */
    startedAt: 0,
    room: "",
    votes: [],             /* { name, picks:[idx], t } */
    sel: []                /* 学生端当前选中 */
  };
  var timerId = null;

  /* ============ 提示条 ============ */
  function toast(msg) {
    var t = $("toast");
    if (!t) return;
    t.textContent = msg;
    t.classList.add("show");
    clearTimeout(toast._t);
    toast._t = setTimeout(function () { t.classList.remove("show"); }, 1800);
  }

  /* ============ 工具 ============ */
  function genRoom() {
    var s = "";
    for (var i = 0; i < 4; i++) s += String(Math.floor(Math.random() * 10));
    return s;
  }
  function pad2(n) { return n < 10 ? "0" + n : String(n); }
  function fmtTime(ts) {
    var d = new Date(ts);
    return pad2(d.getHours()) + ":" + pad2(d.getMinutes()) + ":" + pad2(d.getSeconds());
  }
  function fmtElapsed(ms) {
    var s = Math.floor(ms / 1000);
    return pad2(Math.floor(s / 60)) + ":" + pad2(s % 60);
  }
  function save() {
    try {
      localStorage.setItem(DATA_KEY, JSON.stringify({
        title: state.title, options: state.options, mode: state.mode,
        status: state.status === "live" ? "live" : state.status,
        startedAt: state.startedAt, room: state.room, votes: state.votes
      }));
    } catch (e) { /* 忽略 */ }
  }

  /* ============ 选项编辑 ============ */
  function renderOptions() {
    var box = $("optList");
    box.innerHTML = "";
    for (var i = 0; i < state.options.length; i++) {
      (function (idx) {
        var row = document.createElement("div");
        row.className = "opt-row";
        var inp = document.createElement("input");
        inp.type = "text";
        inp.maxLength = 40;
        inp.value = state.options[idx];
        inp.placeholder = "选项 " + (idx + 1);
        inp.addEventListener("input", function () {
          state.options[idx] = inp.value;
          save();
          renderStuChoices();
          renderResults();
        });
        var del = document.createElement("button");
        del.type = "button";
        del.className = "opt-del";
        del.title = "删除该选项";
        del.textContent = "×";
        del.disabled = state.options.length <= 2;
        del.addEventListener("click", function () {
          if (state.options.length <= 2) { toast("至少保留 2 个选项"); return; }
          state.options.splice(idx, 1);
          state.sel = [];
          save();
          renderOptions(); renderStuChoices(); renderResults();
        });
        row.appendChild(inp);
        row.appendChild(del);
        box.appendChild(row);
      })(i);
    }
  }

  /* ============ 学生端选项 ============ */
  function renderStuChoices() {
    var box = $("stuChoices");
    box.innerHTML = "";
    for (var i = 0; i < state.options.length; i++) {
      (function (idx) {
        var b = document.createElement("button");
        b.type = "button";
        b.className = "stu-opt" + (state.sel.indexOf(idx) >= 0 ? " on" : "");
        var mark = document.createElement("span");
        mark.className = "mark";
        mark.textContent = state.sel.indexOf(idx) >= 0 ? "✓" : "";
        var tx = document.createElement("span");
        tx.textContent = state.options[idx] || ("选项 " + (idx + 1));
        b.appendChild(mark);
        b.appendChild(tx);
        b.addEventListener("click", function () {
          var p = state.sel.indexOf(idx);
          if (state.mode === "single") {
            state.sel = p >= 0 ? [] : [idx];
          } else {
            if (p >= 0) state.sel.splice(p, 1);
            else state.sel.push(idx);
          }
          renderStuChoices();
        });
        box.appendChild(b);
      })(i);
    }
  }

  /* ============ 投票流程 ============ */
  function startPoll() {
    if (state.status === "live") { toast("投票已在进行中"); return; }
    state.status = "live";
    state.startedAt = Date.now();
    if (!state.room) state.room = genRoom();
    save();
    renderStatus();
    toast("投票已开始，口令 " + state.room);
  }
  function endPoll() {
    if (state.status !== "live") { toast("当前没有进行中的投票"); return; }
    state.status = "closed";
    save();
    renderStatus();
    toast("投票已结束");
  }
  function resetPoll() {
    state.status = "idle";
    state.votes = [];
    state.sel = [];
    state.startedAt = 0;
    state.room = genRoom();
    save();
    renderAll();
    toast("已重置，可重新投票");
  }

  function renderStatus() {
    var b = $("statusBadge");
    b.classList.remove("live", "done");
    if (state.status === "live") { b.textContent = "进行中"; b.classList.add("live"); }
    else if (state.status === "closed") { b.textContent = "已结束"; b.classList.add("done"); }
    else b.textContent = "未开始";
    $("roomCode").textContent = state.room || "—";

    if (state.status === "live") {
      if (!timerId) {
        timerId = setInterval(function () {
          if (state.status !== "live") { clearInterval(timerId); timerId = null; return; }
          $("timerText").textContent = fmtElapsed(Date.now() - state.startedAt);
        }, 1000);
      }
      $("timerText").textContent = fmtElapsed(Date.now() - state.startedAt);
    } else {
      if (timerId) { clearInterval(timerId); timerId = null; }
      $("timerText").textContent = state.status === "closed" && state.startedAt
        ? "用时 " + fmtElapsed((state.votes.length ? state.votes[state.votes.length - 1].t : Date.now()) - state.startedAt)
        : "00:00";
    }
  }

  function submitVote(name, picks) {
    if (state.status !== "live") { toast("请先点击「开始投票」"); return false; }
    if (!picks.length) { toast("请先选择一个选项"); return false; }
    state.votes.push({
      name: name || "匿名",
      picks: picks.slice(),
      t: Date.now()
    });
    state.sel = [];
    save();
    renderStuChoices();
    renderResults();
    return true;
  }

  function simulate(n) {
    if (state.status !== "live") { state.status = "live"; state.startedAt = Date.now(); if (!state.room) state.room = genRoom(); }
    var names = ["小明", "小红", "小刚", "小雨", "小雪", "小杰", "小雅", "小浩", "小彤", "小宇", "小佳", "小斌"];
    for (var i = 0; i < n; i++) {
      var picks = [];
      if (state.mode === "single") {
        picks.push(Math.floor(Math.random() * state.options.length));
      } else {
        var cnt = 1 + Math.floor(Math.random() * Math.max(1, state.options.length - 1));
        var pool = [];
        for (var k = 0; k < state.options.length; k++) pool.push(k);
        for (var j = 0; j < cnt && pool.length; j++) {
          picks.push(pool.splice(Math.floor(Math.random() * pool.length), 1)[0]);
        }
      }
      state.votes.push({
        name: names[Math.floor(Math.random() * names.length)] + (i + 1),
        picks: picks,
        t: Date.now() - (n - i) * 1000
      });
    }
    save();
    renderStatus();
    renderResults();
    toast("已模拟 " + n + " 票");
  }

  /* ============ 结果统计 ============ */
  function tally() {
    var counts = [];
    for (var i = 0; i < state.options.length; i++) counts.push(0);
    for (var v = 0; v < state.votes.length; v++) {
      var picks = state.votes[v].picks || [];
      for (var p = 0; p < picks.length; p++) {
        if (picks[p] >= 0 && picks[p] < counts.length) counts[picks[p]] += 1;
      }
    }
    return counts;
  }

  function renderResults() {
    var counts = tally();
    var people = state.votes.length;
    var total = 0;
    for (var i = 0; i < counts.length; i++) total += counts[i];
    var has = people > 0;

    $("emptyState").hidden = has;
    $("resultArea").hidden = !has;
    $("stageOk").textContent = has ? (state.status === "live" ? "统计中…" : "已出结果") : "等待投票";
    if (!has) { renderDetail(); return; }

    $("pollQuestion").textContent = state.title || "（未命名投票）";
    $("statTotal").textContent = total;
    $("statPeople").textContent = people;
    $("statMode").textContent = state.mode === "single" ? "单选" : "多选";
    $("chartSub").textContent = "共 " + total + " 票 / " + people + " 人";

    var max = 0;
    for (var m = 0; m < counts.length; m++) max = Math.max(max, counts[m]);
    var leadIdx = -1;
    for (var l = 0; l < counts.length; l++) if (counts[l] === max && max > 0) { leadIdx = l; break; }
    $("statLead").textContent = leadIdx >= 0 ? (state.options[leadIdx] || ("选项 " + (leadIdx + 1))) : "—";

    var rows = $("voteRows");
    rows.innerHTML = "";
    for (var r = 0; r < counts.length; r++) {
      var pct = people ? (counts[r] / people * 100) : 0;
      var row = document.createElement("div");
      row.className = "vote-row" + (r === leadIdx && max > 0 ? " lead" : "");
      var name = document.createElement("div");
      name.className = "vote-name";
      name.textContent = state.options[r] || ("选项 " + (r + 1));
      var track = document.createElement("div");
      track.className = "vote-track";
      var bar = document.createElement("div");
      bar.className = "vote-bar";
      bar.style.width = pct.toFixed(1) + "%";
      track.appendChild(bar);
      var meta = document.createElement("div");
      meta.className = "vote-meta";
      meta.textContent = counts[r] + " 票 · " + pct.toFixed(0) + "%";
      row.appendChild(name);
      row.appendChild(track);
      row.appendChild(meta);
      rows.appendChild(row);
    }
    renderDetail();
  }

  function renderDetail() {
    var ul = $("voteList");
    ul.innerHTML = "";
    $("detailCount").textContent = state.votes.length + " 条";
    var list = state.votes.slice(-30).reverse();
    if (!list.length) {
      var li0 = document.createElement("li");
      li0.className = "empty";
      li0.textContent = "暂无投票记录";
      ul.appendChild(li0);
      return;
    }
    for (var i = 0; i < list.length; i++) {
      var v = list[i];
      var li = document.createElement("li");
      var who = document.createElement("span");
      who.className = "vote-who";
      who.textContent = v.name;
      var pick = document.createElement("span");
      pick.className = "vote-pick";
      var names = [];
      for (var p = 0; p < v.picks.length; p++) names.push(state.options[v.picks[p]] || ("选项 " + (v.picks[p] + 1)));
      pick.textContent = names.join("、");
      var tm = document.createElement("span");
      tm.className = "vote-time";
      tm.textContent = fmtTime(v.t);
      li.appendChild(who);
      li.appendChild(pick);
      li.appendChild(tm);
      ul.appendChild(li);
    }
  }

  /* ============ 复制 / 导出 ============ */
  function copy(text) {
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

  function resultText() {
    var counts = tally(), people = state.votes.length, total = 0;
    for (var i = 0; i < counts.length; i++) total += counts[i];
    var lines = ["【" + (state.title || "课堂投票") + "】", "参与 " + people + " 人 / 共 " + total + " 票（" + (state.mode === "single" ? "单选" : "多选") + "）", ""];
    for (var r = 0; r < counts.length; r++) {
      var pct = people ? (counts[r] / people * 100).toFixed(0) : "0";
      lines.push((r + 1) + ". " + (state.options[r] || ("选项 " + (r + 1))) + "：" + counts[r] + " 票（" + pct + "%）");
    }
    return lines.join("\n");
  }

  function exportCsv() {
    var counts = tally(), people = state.votes.length, total = 0;
    for (var i = 0; i < counts.length; i++) total += counts[i];
    var rows = [];
    rows.push(["题目", state.title || "课堂投票"]);
    rows.push(["方式", state.mode === "single" ? "单选" : "多选"]);
    rows.push(["参与人数", people]);
    rows.push(["总票数", total]);
    rows.push([]);
    rows.push(["选项", "票数", "占比"]);
    for (var r = 0; r < counts.length; r++) {
      var pct = people ? (counts[r] / people * 100).toFixed(1) + "%" : "0%";
      rows.push([state.options[r] || ("选项 " + (r + 1)), counts[r], pct]);
    }
    rows.push([]);
    rows.push(["姓名", "选择", "时间"]);
    for (var v = 0; v < state.votes.length; v++) {
      var names = [];
      for (var p = 0; p < state.votes[v].picks.length; p++) {
        names.push(state.options[state.votes[v].picks[p]] || ("选项 " + (state.votes[v].picks[p] + 1)));
      }
      rows.push([state.votes[v].name, names.join("、"), fmtTime(state.votes[v].t)]);
    }
    var csv = "\ufeff" + rows.map(function (row) {
      return row.map(function (cell) {
        var s = String(cell === null || cell === undefined ? "" : cell);
        return /[",\n]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s;
      }).join(",");
    }).join("\r\n");

    try {
      var blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
      var url = URL.createObjectURL(blob);
      var a = document.createElement("a");
      a.href = url;
      a.download = "课堂投票_" + state.room + ".csv";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(function () { URL.revokeObjectURL(url); }, 1500);
      toast("已导出 CSV");
    } catch (e) { toast("导出失败，请用「复制结果」"); }
  }

  /* ============ 事件 ============ */
  function bind() {
    $("pollTitle").addEventListener("input", function () {
      state.title = this.value;
      save();
      $("pollQuestion").textContent = state.title || "（未命名投票）";
    });

    $("btnAddOpt").addEventListener("click", function () {
      if (state.options.length >= MAX_OPT) { toast("最多 " + MAX_OPT + " 个选项"); return; }
      state.options.push("选项 " + (state.options.length + 1));
      save();
      renderOptions(); renderStuChoices(); renderResults();
    });

    $("modeChips").querySelectorAll(".chip").forEach(function (c) {
      c.addEventListener("click", function () {
        state.mode = c.getAttribute("data-mode") || "single";
        state.sel = [];
        $("modeChips").querySelectorAll(".chip").forEach(function (x) { x.classList.remove("active"); });
        c.classList.add("active");
        save();
        renderStuChoices();
        renderResults();
      });
    });

    $("btnStart").addEventListener("click", startPoll);
    $("btnEnd").addEventListener("click", endPoll);
    $("btnReset").addEventListener("click", resetPoll);

    $("btnSubmit").addEventListener("click", function () {
      var ok = submitVote($("stuName").value.trim(), state.sel);
      if (ok) { $("stuName").value = ""; toast("投票成功"); }
    });
    $("stuName").addEventListener("keydown", function (e) {
      if (e.key === "Enter") { e.preventDefault(); $("btnSubmit").click(); }
    });
    $("btnSimulate").addEventListener("click", function () { simulate(10); });

    $("btnCopyCode").addEventListener("click", function () { copy(state.room || "—"); });
    $("btnCopyLink").addEventListener("click", function () {
      copy(location.href.split("#")[0] + "#/tool/class-vote?room=" + state.room);
    });
    $("btnCopyResult").addEventListener("click", function () { copy(resultText()); });
    $("btnExport").addEventListener("click", exportCsv);
  }

  /* ---------- 初始化 ---------- */
  function renderAll() {
    renderOptions();
    renderStuChoices();
    renderStatus();
    renderResults();
  }

  function init() {
    try {
      var raw = localStorage.getItem(DATA_KEY);
      if (raw) {
        var d = JSON.parse(raw);
        if (d && typeof d === "object") {
          if (typeof d.title === "string") state.title = d.title;
          if (Array.isArray(d.options) && d.options.length >= 2) state.options = d.options.slice(0, MAX_OPT);
          if (d.mode === "single" || d.mode === "multi") state.mode = d.mode;
          if (d.status === "idle" || d.status === "closed") state.status = d.status;
          if (typeof d.startedAt === "number") state.startedAt = d.startedAt;
          if (typeof d.room === "string" && d.room) state.room = d.room;
          if (Array.isArray(d.votes)) {
            state.votes = d.votes.filter(function (v) { return v && Array.isArray(v.picks); });
          }
        }
      }
    } catch (e) { /* 忽略 */ }

    if (!state.room) state.room = genRoom();
    $("pollTitle").value = state.title;
    $("modeChips").querySelectorAll(".chip").forEach(function (c) {
      c.classList.toggle("active", (c.getAttribute("data-mode") || "single") === state.mode);
    });

    bind();
    renderAll();
    // 舞台右上角工具栏（⛶ 舞台全屏 / ⚙ 隐藏设置），与随机叫号同构
    if (window.EduToolStageToolbar) window.EduToolStageToolbar.init({ stage: ".stage-panel", panelHost: ".workbench" });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
