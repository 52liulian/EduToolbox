/* ============================================================
 * EduToolbox · 课堂错题本整理 mistake-book.js
 * 功能：错题录入（题干/错答/正解/科目/错因/日期）、编辑与删除、
 *       掌握状态流转、科目与状态筛选、关键词搜索、错因分布统计、
 *       复制 / CSV 导出 / 打印，localStorage 持久化
 * ============================================================ */
(function () {
  "use strict";

  var $ = function (id) { return document.getElementById(id); };
  var DATA_KEY = "edutoolbox.mistake-book.data";

  var STATUS_TEXT = ["未掌握", "复习中", "已掌握"];
  var NEXT_TEXT = ["→ 复习中", "→ 已掌握", "↺ 重置"];

  var state = {
    items: [],
    subject: "语文",
    reason: "概念不清",
    filterSubj: "all",
    filterStatus: "all",
    search: "",
    editingId: null
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

  /* ============ 存储 ============ */
  function save() {
    try { localStorage.setItem(DATA_KEY, JSON.stringify(state.items)); } catch (e) { /* 忽略 */ }
  }
  function today() {
    var d = new Date(), p = function (n) { return n < 10 ? "0" + n : String(n); };
    return d.getFullYear() + "-" + p(d.getMonth() + 1) + "-" + p(d.getDate());
  }
  function uid() {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
  }

  /* ============ 渲染 ============ */
  function filtered() {
    var kw = state.search.trim().toLowerCase();
    return state.items.filter(function (it) {
      if (state.filterSubj !== "all" && it.subject !== state.filterSubj) return false;
      if (state.filterStatus !== "all" && String(it.status) !== state.filterStatus) return false;
      if (kw) {
        var hay = (it.q + " " + it.my + " " + it.right + " " + it.reason).toLowerCase();
        if (hay.indexOf(kw) < 0) return false;
      }
      return true;
    });
  }

  function renderStats() {
    var n = [0, 0, 0];
    for (var i = 0; i < state.items.length; i++) {
      var s = state.items[i].status | 0;
      if (s < 0) s = 0; if (s > 2) s = 2;
      n[s] += 1;
    }
    $("statTotal").textContent = String(state.items.length);
    $("statNew").textContent = String(n[0]);
    $("statDoing").textContent = String(n[1]);
    $("statDone").textContent = String(n[2]);
  }

  function renderDist() {
    var map = {}, total = state.items.length, keys = [];
    for (var i = 0; i < state.items.length; i++) {
      var r = state.items[i].reason || "其他";
      if (map[r] === undefined) { map[r] = 0; keys.push(r); }
      map[r] += 1;
    }
    var box = $("distList");
    box.innerHTML = "";
    $("distBlock").hidden = total === 0;
    if (!total) return;
    keys.sort(function (a, b) { return map[b] - map[a]; });
    $("distSub").textContent = "共 " + total + " 题 / " + keys.length + " 类错因";
    for (var k = 0; k < keys.length; k++) {
      var pct = map[keys[k]] / total * 100;
      var row = document.createElement("div");
      row.className = "dist-row";
      var nm = document.createElement("span");
      nm.className = "dist-name";
      nm.textContent = keys[k];
      var track = document.createElement("div");
      track.className = "dist-track";
      var bar = document.createElement("div");
      bar.className = "dist-bar";
      bar.style.width = pct.toFixed(1) + "%";
      track.appendChild(bar);
      var val = document.createElement("span");
      val.className = "dist-val";
      val.textContent = map[keys[k]] + " 题";
      row.appendChild(nm);
      row.appendChild(track);
      row.appendChild(val);
      box.appendChild(row);
    }
  }

  function card(it) {
    var el = document.createElement("div");
    el.className = "mb-card s" + (it.status | 0) + (state.editingId === it.id ? " editing" : "");

    var top = document.createElement("div");
    top.className = "mb-top";
    var subj = document.createElement("span");
    subj.className = "mb-tag";
    subj.textContent = it.subject;
    var reason = document.createElement("span");
    reason.className = "mb-tag";
    reason.textContent = it.reason;
    var st = document.createElement("span");
    st.className = "mb-tag" + ((it.status | 0) === 2 ? "" : " gray");
    st.textContent = STATUS_TEXT[it.status | 0];
    var date = document.createElement("span");
    date.className = "mb-date";
    date.textContent = it.date || "";
    top.appendChild(subj);
    top.appendChild(reason);
    top.appendChild(st);
    top.appendChild(date);

    var q = document.createElement("div");
    q.className = "mb-q";
    q.textContent = it.q;

    var ans = document.createElement("div");
    ans.className = "mb-ans";
    if (it.my) {
      var w = document.createElement("span");
      w.className = "wrong";
      w.innerHTML = "我的答案：<b></b>";
      w.querySelector("b").textContent = it.my;
      ans.appendChild(w);
    }
    if (it.right) {
      var r = document.createElement("span");
      r.className = "right";
      r.innerHTML = "正确答案：<b></b>";
      r.querySelector("b").textContent = it.right;
      ans.appendChild(r);
    }

    var ops = document.createElement("div");
    ops.className = "mb-ops";
    ops.appendChild(mkBtn(NEXT_TEXT[it.status | 0], "btn-small", function () {
      it.status = ((it.status | 0) + 1) % 3;
      save(); render();
      toast("已标记为「" + STATUS_TEXT[it.status] + "」");
    }));
    ops.appendChild(mkBtn("✏️ 编辑", "btn-small btn-ghost", function () { startEdit(it); }));
    ops.appendChild(mkBtn("🗑 删除", "btn-small btn-ghost", function () {
      state.items = state.items.filter(function (x) { return x.id !== it.id; });
      if (state.editingId === it.id) resetForm();
      save(); render();
      toast("已删除该错题");
    }));

    el.appendChild(top);
    el.appendChild(q);
    if (it.my || it.right) el.appendChild(ans);
    el.appendChild(ops);
    return el;
  }

  function mkBtn(label, cls, fn) {
    var b = document.createElement("button");
    b.type = "button";
    b.className = "btn " + cls;
    b.textContent = label;
    b.addEventListener("click", fn);
    return b;
  }

  function render() {
    renderStats();
    renderDist();
    var list = filtered();
    var wrap = $("listWrap");
    wrap.innerHTML = "";
    $("emptyState").hidden = list.length > 0;
    $("stageOk").textContent = state.items.length
      ? ("显示 " + list.length + " / " + state.items.length + " 题")
      : "等待录入";
    /* 最新在前 */
    var ordered = list.slice().sort(function (a, b) { return (b.created || 0) - (a.created || 0); });
    for (var i = 0; i < ordered.length; i++) wrap.appendChild(card(ordered[i]));
  }

  /* ============ 录入 ============ */
  function resetForm() {
    state.editingId = null;
    $("qInput").value = "";
    $("myAns").value = "";
    $("rightAns").value = "";
    $("dateInput").value = today();
    $("btnSave").textContent = "💾 保存错题";
    $("btnCancel").hidden = true;
  }
  function startEdit(it) {
    state.editingId = it.id;
    state.subject = it.subject;
    state.reason = it.reason;
    $("qInput").value = it.q;
    $("myAns").value = it.my || "";
    $("rightAns").value = it.right || "";
    $("dateInput").value = it.date || today();
    $("btnSave").textContent = "💾 保存修改";
    $("btnCancel").hidden = false;
    syncChips();
    render();
    toast("正在编辑该错题");
  }
  function submit() {
    var q = $("qInput").value.trim();
    if (!q) { toast("请先填写题干"); $("qInput").focus(); return; }
    var item = {
      id: state.editingId || uid(),
      subject: state.subject,
      q: q,
      my: $("myAns").value.trim(),
      right: $("rightAns").value.trim(),
      reason: state.reason,
      date: $("dateInput").value || today(),
      status: state.editingId ? (find(state.editingId) || {}).status || 0 : 0,
      created: state.editingId ? (find(state.editingId) || {}).created || Date.now() : Date.now()
    };
    if (state.editingId) {
      state.items = state.items.map(function (x) { return x.id === item.id ? item : x; });
      toast("已保存修改");
    } else {
      state.items.push(item);
      toast("已记录第 " + state.items.length + " 道错题");
    }
    save();
    resetForm();
    render();
  }
  function find(id) {
    for (var i = 0; i < state.items.length; i++) if (state.items[i].id === id) return state.items[i];
    return null;
  }

  /* ============ 导出 ============ */
  function plainText() {
    var list = filtered();
    var lines = ["错题本（共 " + list.length + " 题）", ""];
    for (var i = 0; i < list.length; i++) {
      var it = list[i];
      lines.push((i + 1) + ". [" + it.subject + "｜" + it.reason + "｜" + STATUS_TEXT[it.status | 0] + "] " + (it.date || ""));
      lines.push("   题目：" + it.q);
      if (it.my) lines.push("   我的答案：" + it.my);
      if (it.right) lines.push("   正确答案：" + it.right);
      lines.push("");
    }
    return lines.join("\n");
  }

  function copy(text) {
    if (!text || !state.items.length) { toast("还没有可复制的错题"); return; }
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

  function exportCsv() {
    if (!state.items.length) { toast("还没有错题"); return; }
    var rows = [["科目", "题干", "我的答案", "正确答案", "错因", "状态", "日期"]];
    var list = filtered();
    for (var i = 0; i < list.length; i++) {
      var it = list[i];
      rows.push([it.subject, it.q, it.my || "", it.right || "", it.reason, STATUS_TEXT[it.status | 0], it.date || ""]);
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
      a.download = "错题本_" + today() + ".csv";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(function () { URL.revokeObjectURL(url); }, 1500);
      toast("已导出 " + list.length + " 道错题");
    } catch (e) { toast("导出失败，请用「复制全部」"); }
  }

  /* ============ 事件 ============ */
  function syncChips() {
    $("subjChips").querySelectorAll(".chip").forEach(function (c) {
      c.classList.toggle("active", c.getAttribute("data-subj") === state.subject);
    });
    $("reasonChips").querySelectorAll(".chip").forEach(function (c) {
      c.classList.toggle("active", c.getAttribute("data-reason") === state.reason);
    });
  }

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

  function bind() {

    chips("subjChips", "data-subj", function (v) { state.subject = v; });
    chips("reasonChips", "data-reason", function (v) { state.reason = v; });
    chips("filterChips", "data-filter", function (v) { state.filterSubj = v; render(); });
    chips("statusFilterChips", "data-status", function (v) { state.filterStatus = v; render(); });

    $("btnSave").addEventListener("click", submit);
    $("btnCancel").addEventListener("click", function () { resetForm(); render(); toast("已取消编辑"); });
    $("searchInput").addEventListener("input", function () { state.search = this.value; render(); });

    $("btnCopy").addEventListener("click", function () { copy(plainText()); });
    $("btnExport").addEventListener("click", exportCsv);
    $("btnPrint").addEventListener("click", function () {
      if (!state.items.length) { toast("还没有错题"); return; }
      try { window.print(); } catch (e) { toast("打印不可用，请用浏览器 Ctrl+P"); }
    });
    $("btnClear").addEventListener("click", function () {
      if (!state.items.length) { toast("错题本已经是空的"); return; }
      if (!window.confirm("确定清空全部 " + state.items.length + " 道错题？该操作不可撤销。")) return;
      state.items = [];
      save(); resetForm(); render();
      toast("已清空错题本");
    });
  }

  /* ---------- 初始化 ---------- */
  function init() {
    try {
      var raw = localStorage.getItem(DATA_KEY);
      if (raw) {
        var arr = JSON.parse(raw);
        if (Array.isArray(arr)) {
          state.items = arr.filter(function (x) { return x && typeof x.q === "string"; }).map(function (x) {
            return {
              id: x.id || uid(),
              subject: x.subject || "其他",
              q: x.q,
              my: x.my || "",
              right: x.right || "",
              reason: x.reason || "其他",
              date: x.date || "",
              status: [0, 1, 2].indexOf(x.status | 0) >= 0 ? (x.status | 0) : 0,
              created: x.created || 0
            };
          });
        }
      }
    } catch (e) { /* 忽略 */ }

    /* 舞台右上角工具栏（⛶ 舞台全屏 / ⚙ 隐藏设置），与随机叫号同构 */
    if (window.EduToolStageToolbar) {
      window.EduToolStageToolbar.init({ stage: ".stage-panel", panelHost: ".workbench", hiddenClass: "setup-hidden" });
    }
    bind();
    syncChips();
    resetForm();
    render();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
