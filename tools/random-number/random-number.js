/* ============================================================
 * EduToolbox · 随机数生成器 random-number.js
 * 功能：范围/个数/重复/排序/小数位生成 + 频率直方图 + 统计
 * 纯前端 IIFE；累计样本用于大数定律演示
 * ============================================================ */
(function () {
  "use strict";

  var $ = function (id) { return document.getElementById(id); };
  var PRESETS = {
    "点名抽号": { min: 1, max: 60, count: 1 },
    "分组编号": { min: 1, max: 6, count: 40 },
    "百分制": { min: 0, max: 100, count: 10 },
    "骰子×20": { min: 1, max: 6, count: 20 }
  };

  var state = { samples: [], history: [] };

  /* ============ 提示条 ============ */
  function toast(msg) {
    var t = $("toast");
    if (!t) return;
    t.textContent = msg;
    t.classList.add("show");
    clearTimeout(toast._t);
    toast._t = setTimeout(function () { t.classList.remove("show"); }, 1800);
  }

  /* ============ 生成 ============ */
  function roundTo(v, dec) {
    var f = Math.pow(10, dec);
    return Math.round(v * f) / f;
  }

  function generate() {
    var min = parseFloat($("minVal").value);
    var max = parseFloat($("maxVal").value);
    var count = parseInt($("countVal").value, 10);
    var dec = parseInt($("decVal").value, 10);
    var unique = $("chkUnique").checked;
    var sortAsc = $("chkSort").checked;

    if (isNaN(min) || isNaN(max)) { toast("请填写有效的最小值与最大值"); return; }
    if (min > max) { var t = min; min = max; max = t; }
    if (isNaN(count) || count < 1) count = 1;
    if (count > 999) count = 999;
    if (isNaN(dec) || dec < 0) dec = 0;
    if (dec > 6) dec = 6;

    if (unique && dec > 0) { toast("不重复模式仅支持整数，已按整数生成"); dec = 0; }

    var out = [];
    if (unique) {
      var span = Math.floor(max - min) + 1;
      if (count > span) { count = span; toast("个数超过可选范围，已调整为 " + count); }
      var pool = [];
      for (var i = 0; i < span; i++) pool.push(min + i);
      for (var j = pool.length - 1; j > 0; j--) {
        var k = Math.floor(Math.random() * (j + 1));
        var tmp = pool[j]; pool[j] = pool[k]; pool[k] = tmp;
      }
      out = pool.slice(0, count);
    } else {
      for (var n = 0; n < count; n++) {
        out.push(roundTo(min + Math.random() * (max - min), dec));
      }
    }
    if (sortAsc) out.sort(function (a, b) { return a - b; });

    state.samples = state.samples.concat(out);
    state.history.unshift({ time: nowText(), vals: out.slice(0, 12), total: out.length });
    if (state.history.length > 10) state.history.length = 10;

    render(out, dec);
  }

  function nowText() {
    var d = new Date();
    var p = function (x) { return x < 10 ? "0" + x : String(x); };
    return p(d.getHours()) + ":" + p(d.getMinutes()) + ":" + p(d.getSeconds());
  }

  function fmt(v, dec) {
    if (dec > 0) return Number(v).toFixed(dec);
    return String(Math.round(v));
  }

  /* ============ 渲染 ============ */
  function render(out, dec) {
    $("emptyState").hidden = true;
    $("resultArea").hidden = false;

    var big = $("bigNumber");
    big.textContent = out.length === 1 ? fmt(out[0], dec) : (out.length + " 个结果");
    big.classList.remove("pop");
    void big.offsetWidth;
    big.classList.add("pop");

    var list = $("numList");
    list.innerHTML = "";
    if (out.length > 1) {
      var show = out.slice(0, 60);
      for (var i = 0; i < show.length; i++) {
        var s = document.createElement("span");
        s.className = "num-pill";
        s.textContent = fmt(show[i], dec);
        list.appendChild(s);
      }
      if (out.length > show.length) {
        var more = document.createElement("span");
        more.className = "num-pill";
        more.textContent = "… +" + (out.length - show.length);
        list.appendChild(more);
      }
    }
    $("stageOk").textContent = "本次 " + out.length + " 个";
    renderStats();
    renderHistogram();
    renderHistory();
  }

  function renderStats() {
    var s = state.samples;
    $("statCount").textContent = s.length;
    if (!s.length) {
      $("statMean").textContent = "—";
      $("statRange").textContent = "—";
      $("statMode").textContent = "—";
      return;
    }
    var sum = 0, min = s[0], max = s[0], freq = {};
    for (var i = 0; i < s.length; i++) {
      sum += s[i];
      if (s[i] < min) min = s[i];
      if (s[i] > max) max = s[i];
      freq[String(s[i])] = (freq[String(s[i])] || 0) + 1;
    }
    $("statMean").textContent = String(Math.round(sum / s.length * 100) / 100);
    $("statRange").textContent = String(Math.round((max - min) * 100) / 100);
    var best = null, bestN = 0;
    for (var k in freq) {
      if (Object.prototype.hasOwnProperty.call(freq, k) && freq[k] > bestN) { bestN = freq[k]; best = k; }
    }
    $("statMode").textContent = best === null ? "—" : best + " ×" + bestN;
  }

  function renderHistogram() {
    var box = $("histogram");
    box.innerHTML = "";
    var s = state.samples;
    if (!s.length) { $("chartSub").textContent = "区间数 0"; return; }
    var min = Math.min.apply(null, s), max = Math.max.apply(null, s);
    var buckets = Math.min(16, Math.max(4, Math.round(Math.sqrt(s.length))));
    if (max === min) buckets = 1;
    var width = (max - min) / buckets || 1;
    var counts = [];
    for (var b = 0; b < buckets; b++) counts.push(0);
    for (var i = 0; i < s.length; i++) {
      var idx = Math.floor((s[i] - min) / width);
      if (idx >= buckets) idx = buckets - 1;
      if (idx < 0) idx = 0;
      counts[idx] += 1;
    }
    var top = Math.max.apply(null, counts) || 1;
    for (var c = 0; c < buckets; c++) {
      var col = document.createElement("div");
      col.className = "hist-col";
      var bar = document.createElement("div");
      bar.className = "hist-bar" + (counts[c] ? "" : " zero");
      bar.style.height = (counts[c] / top * 100) + "%";
      bar.title = "[" + fmt(min + c * width, 2) + " → " + fmt(min + (c + 1) * width, 2) + ") 共 " + counts[c] + " 次";
      var tag = document.createElement("div");
      tag.className = "hist-tag";
      tag.textContent = fmt(min + c * width, 0);
      col.appendChild(bar);
      col.appendChild(tag);
      box.appendChild(col);
    }
    $("chartSub").textContent = "区间数 " + buckets + " · 样本 " + s.length;
  }

  function renderHistory() {
    var ul = $("history");
    ul.innerHTML = "";
    $("historyCount").textContent = state.history.length + " 次";
    if (!state.history.length) {
      var li = document.createElement("li");
      li.className = "empty";
      li.textContent = "暂无记录";
      ul.appendChild(li);
      return;
    }
    for (var i = 0; i < state.history.length; i++) {
      var h = state.history[i];
      var li = document.createElement("li");
      var vals = document.createElement("span");
      vals.className = "hist-vals";
      vals.textContent = h.vals.join(", ") + (h.total > h.vals.length ? " … 共 " + h.total + " 个" : "");
      var time = document.createElement("span");
      time.className = "hist-time";
      time.textContent = h.time;
      li.appendChild(vals);
      li.appendChild(time);
      ul.appendChild(li);
    }
  }

  /* ============ 复制 ============ */
  function copyResult() {
    var text = $("bigNumber").textContent;
    var pills = $("numList").querySelectorAll(".num-pill");
    if (pills.length) {
      var arr = [];
      for (var i = 0; i < pills.length; i++) arr.push(pills[i].textContent);
      text = arr.join(", ");
    }
    if (!text || text === "—") { toast("还没有结果可复制"); return; }
    function done() { toast("已复制到剪贴板"); }
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
    } else { fallback(); }
  }

  /* ============ 事件 ============ */
  function bind() {
    var pw = $("presetChips");
    pw.innerHTML = Object.keys(PRESETS).map(function (k) {
      return '<button type="button" class="chip" data-v="' + k + '">' + k + "</button>";
    }).join("");
    pw.querySelectorAll(".chip").forEach(function (c) {
      c.addEventListener("click", function () {
        var p = PRESETS[c.getAttribute("data-v")];
        $("minVal").value = p.min;
        $("maxVal").value = p.max;
        $("countVal").value = p.count;
        toast("已套用「" + c.getAttribute("data-v") + "」参数");
      });
    });

    $("btnGen").addEventListener("click", generate);
    $("btnCopy").addEventListener("click", copyResult);
    $("btnClear").addEventListener("click", function () {
      state.samples = [];
      state.history = [];
      $("resultArea").hidden = true;
      $("emptyState").hidden = false;
      renderStats();
      renderHistogram();
      renderHistory();
      toast("已清空记录");
    });

    document.addEventListener("keydown", function (e) {
      if (e.target && /INPUT|TEXTAREA/.test(e.target.tagName)) return;
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); generate(); }
    });
  }

  /* ---------- 初始化 ---------- */
  function init() {
    /* 舞台右上角工具栏（⛶ 舞台全屏 / ⚙ 隐藏设置），与随机叫号同构 */
    if (window.EduToolStageToolbar) {
      window.EduToolStageToolbar.init({ stage: ".stage-panel", panelHost: ".workbench", hiddenClass: "setup-hidden" });
    }
    bind();
    renderStats();
    renderHistogram();
    renderHistory();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
