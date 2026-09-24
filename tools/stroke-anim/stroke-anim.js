/* ============================================================
 * EduToolbox · 汉字笔顺动画 stroke-anim.js
 * 功能：逐笔动画演示汉字笔顺（笔顺数据本地打包 + CDN 按需补齐）
 * 纯前端 IIFE，无后端依赖；笔迹坐标 1024 网格、y 轴向上
 * ============================================================ */
(function () {
  "use strict";

  var $ = function (id) { return document.getElementById(id); };
  var NS = "http://www.w3.org/2000/svg";
  /* 数据坐标系 → SVG 坐标系：y' = 900 - y（数据在 -124~900 区间） */
  var FLIP = "translate(0,900) scale(1,-1)";
  var MASK_W = 150;                 // 笔画遮罩线宽（1024 网格）
  var CDN = "https://cdn.jsdelivr.net/npm/hanzi-writer-data@2.0.1/";
  var CACHE_KEY = "edutoolbox.stroke-anim.cache";

  /* ---------- 运行时状态 ---------- */
  var state = {
    chars: "水",
    index: 0,
    data: null,        // {strokes:[], medians:[]}
    lens: [],          // 各笔中线长度
    durs: [],          // 各笔时长(ms)
    speed: 1,
    grid: "tian",
    playing: false,
    t0: 0,
    cur: -1,           // 当前笔画下标
    uid: 0
  };

  /* ============ 提示条 ============ */
  var toastTimer;
  function toast(msg) {
    var t = $("toast");
    if (!t) return;
    t.textContent = msg;
    t.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { t.classList.remove("show"); }, 2000);
  }

  /* ============ 本地存储（统一 try/catch） ============ */
  function readCache() {
    try { return JSON.parse(localStorage.getItem(CACHE_KEY) || "{}") || {}; } catch (e) { return {}; }
  }
  function writeCache(obj) {
    try {
      var keys = Object.keys(obj);
      if (keys.length > 300) {                       // 控制缓存体积
        var slim = {};
        for (var i = keys.length - 300; i < keys.length; i++) slim[keys[i]] = obj[keys[i]];
        obj = slim;
      }
      localStorage.setItem(CACHE_KEY, JSON.stringify(obj));
    } catch (e) { /* 配额或隐私模式忽略 */ }
  }

  /* ============ 数据获取 ============ */
  function localData() { return (typeof window !== "undefined" && window.STROKE_DATA) || {}; }

  function normalize(raw) {
    if (!raw || !raw.strokes || !raw.medians) return null;
    if (raw.strokes.length !== raw.medians.length) return null;
    return { strokes: raw.strokes, medians: raw.medians };
  }

  function fetchRemote(ch) {
    return new Promise(function (resolve) {
      if (typeof fetch !== "function") { resolve(null); return; }
      var timer = setTimeout(function () { resolve(null); }, 8000);
      fetch(CDN + encodeURIComponent(ch) + ".json", { cache: "force-cache" })
        .then(function (r) { return r.ok ? r.json() : null; })
        .then(function (j) { clearTimeout(timer); resolve(normalize(j)); })
        .catch(function () { clearTimeout(timer); resolve(null); });
    });
  }

  function getData(ch, cb) {
    var local = localData();
    if (local[ch]) { cb(normalize({ strokes: local[ch].s, medians: local[ch].m }) || normalize(local[ch])); return; }
    var cache = readCache();
    if (cache[ch]) { cb(normalize({ strokes: cache[ch].s, medians: cache[ch].m }) || normalize(cache[ch])); return; }
    cb(null);                                   // 先返回空，保证 UI 立即响应
    fetchRemote(ch).then(function (d) {
      if (!d) return;
      var c = readCache();
      c[ch] = { s: d.strokes, m: d.medians };
      writeCache(c);
      if (currentChar() === ch) loadChar(ch);   // 仍是当前字则重新渲染
    });
  }

  /* ============ SVG 构建 ============ */
  function mk(tag, attrs) {
    var el = document.createElementNS(NS, tag);
    if (attrs) { for (var k in attrs) { if (Object.prototype.hasOwnProperty.call(attrs, k)) el.setAttribute(k, attrs[k]); } }
    return el;
  }

  function buildGrid() {
    var g = mk("g", { class: "grid" });
    g.appendChild(mk("rect", { class: "grid-border", x: 12, y: 12, width: 1000, height: 1000, rx: 8 }));
    if (state.grid === "tian" || state.grid === "mi") {
      g.appendChild(mk("line", { class: "grid-line", x1: 512, y1: 12, x2: 512, y2: 1012 }));
      g.appendChild(mk("line", { class: "grid-line", x1: 12, y1: 512, x2: 1012, y2: 512 }));
    }
    if (state.grid === "mi") {
      g.appendChild(mk("line", { class: "grid-diag", x1: 12, y1: 12, x2: 1012, y2: 1012 }));
      g.appendChild(mk("line", { class: "grid-diag", x1: 1012, y1: 12, x2: 12, y2: 1012 }));
    }
    return g;
  }

  function pathLen(p) {
    try { if (p && typeof p.getTotalLength === "function") { var l = p.getTotalLength(); if (l > 0) return l; } } catch (e) { /* 忽略 */ }
    return 300;
  }

  function buildSvg() {
    var svg = $("hanziSvg");
    if (!svg) return;
    state.svgEl = svg;
    while (svg.firstChild) svg.removeChild(svg.firstChild);
    svg.setAttribute("class", state.grid === "none" ? "is-none" : "");
    if (!state.data) return;

    state.uid += 1;
    var prefix = "sa" + state.uid + "-";
    var strokes = state.data.strokes, medians = state.data.medians;

    svg.appendChild(buildGrid());

    /* 描红底字 */
    var trace = mk("g", { class: "trace", transform: FLIP });
    for (var i = 0; i < strokes.length; i++) trace.appendChild(mk("path", { class: "trace-path", d: strokes[i] }));
    svg.appendChild(trace);

    /* 遮罩 + 笔画 */
    var layer = mk("g", { class: "strokes", transform: FLIP });
    var measure = mk("g", { class: "measure", transform: FLIP, fill: "none", stroke: "none", visibility: "hidden" });
    state.lens = [];
    state.masks = [];
    state.outlines = [];
    for (var k = 0; k < strokes.length; k++) {
      var cp = mk("clipPath", { id: prefix + k });
      var mp = mk("path", {
        d: medians[k], fill: "none", stroke: "#000",
        "stroke-width": String(MASK_W), "stroke-linecap": "round", "stroke-linejoin": "round"
      });
      cp.appendChild(mp);
      layer.appendChild(cp);

      var out = mk("path", { class: "stroke-path", d: strokes[k], "clip-path": "url(#" + prefix + k + ")" });
      layer.appendChild(out);

      var meas = mk("path", { d: medians[k], fill: "none", stroke: "none" });
      measure.appendChild(meas);

      state.lens.push(pathLen(meas));
      state.masks.push(mp);
      state.outlines.push(out);
    }
    svg.appendChild(layer);
    svg.appendChild(measure);

    /* 笔尖 */
    var penLayer = mk("g", { class: "pen", transform: FLIP, id: "penLayer" });
    var ring = mk("circle", { class: "pen-dot-ring", r: 30, cx: -999, cy: -999 });
    var dot = mk("circle", { class: "pen-dot", r: 17, cx: -999, cy: -999 });
    penLayer.appendChild(ring);
    penLayer.appendChild(dot);
    svg.appendChild(penLayer);
    state.pen = { dot: dot, ring: ring, paths: measure.childNodes };

    computeDurs();
  }

  function computeDurs() {
    state.durs = state.lens.map(function (l) {
      var d = l * 0.55 + 180;
      if (d < 260) d = 260;
      if (d > 900) d = 900;
      return d / state.speed;
    });
  }

  /* ============ 进度应用 ============ */
  function setMask(i, ratio) {
    if (!state.masks || !state.masks[i]) return;
    var L = state.lens[i] || 300;
    var p = state.masks[i];
    p.setAttribute("stroke-dasharray", L + " " + (L + 10));
    p.setAttribute("stroke-dashoffset", String(L * (1 - ratio)));
  }

  function applyProgress(idx, local) {
    for (var i = 0; i < state.masks.length; i++) {
      setMask(i, i < idx ? 1 : (i === idx ? local : 0));
    }
    movePen(idx, local);
    markChips(idx);
  }

  function movePen(idx, local) {
    if (!state.pen) return;
    var dot = state.pen.dot, ring = state.pen.ring;
    var holder = $("chkPen");
    if (holder && !holder.checked) { dot.setAttribute("cx", -999); ring.setAttribute("cx", -999); return; }
    if (idx < 0 || !state.pen.paths[idx]) { dot.setAttribute("cx", -999); ring.setAttribute("cx", -999); return; }
    var p = state.pen.paths[idx];
    var pt = null;
    try { if (typeof p.getPointAtLength === "function") pt = p.getPointAtLength((state.lens[idx] || 300) * local); } catch (e) { pt = null; }
    if (!pt) { dot.setAttribute("cx", -999); ring.setAttribute("cx", -999); return; }
    dot.setAttribute("cx", pt.x); dot.setAttribute("cy", pt.y);
    ring.setAttribute("cx", pt.x); ring.setAttribute("cy", pt.y);
  }

  function markChips(idx) {
    var list = $("strokeList");
    if (!list) return;
    var chips = list.querySelectorAll(".stroke-chip");
    for (var i = 0; i < chips.length; i++) {
      chips[i].classList.remove("done", "current");
      if (i < idx) chips[i].classList.add("done");
      else if (i === idx) chips[i].classList.add("current");
    }
  }

  /* 空安全赋值：组件卸载后异步回调仍可能触发，避免空指针 */
  function txt(id, val) {
    var el = $(id);
    if (el) el.textContent = val;
  }

  /* ============ 播放 ============ */
  function play() {
    if (!state.data) { toast("暂无笔顺数据"); return; }
    state.playing = true;
    state.t0 = 0;
    txt("btnPlay",  "⏸ 暂停");
    txt("stageOk",  "播放中…");
    requestAnimationFrame(tick);
  }

  function pause() {
    state.playing = false;
    txt("btnPlay",  "▶ 继续播放");
    txt("stageOk",  "已暂停");
  }

  function stop(resetAll) {
    state.playing = false;
    txt("btnPlay",  "▶ 播放笔顺");
    if (resetAll) { applyProgress(0, 0); state.cur = -1; }
  }

  function tick(ts) {
    if (!state.playing) return;
    /* 组件已卸载（节点脱离文档）→ 停止动画循环，避免空转与空指针 */
    if (!state.svgEl || state.svgEl.isConnected === false) { state.playing = false; return; }
    if (!state.t0) state.t0 = ts;
    var elapsed = ts - state.t0;
    var acc = 0, i = 0;
    for (; i < state.durs.length; i++) {
      if (elapsed <= acc + state.durs[i]) break;
      acc += state.durs[i];
    }
    if (i >= state.durs.length) {
      applyProgress(state.durs.length, 1);
      state.playing = false;
      state.cur = state.durs.length - 1;
      txt("btnPlay",  "▶ 播放笔顺");
      txt("stageOk",  "演示完成 · 共 " + state.durs.length + " 笔");
      return;
    }
    var local = (elapsed - acc) / state.durs[i];
    if (local > 1) local = 1;
    state.cur = i;
    applyProgress(i, local);
    requestAnimationFrame(tick);
  }

  function stepTo(idx) {
    if (!state.data) return;
    state.playing = false;
    txt("btnPlay",  "▶ 播放笔顺");
    if (idx < 0) idx = 0;
    if (idx >= state.durs.length) idx = state.durs.length - 1;
    state.cur = idx;
    applyProgress(idx + 1, 1);
    txt("stageOk",  "第 " + (idx + 1) + " / " + state.durs.length + " 笔");
  }

  function showAll() {
    if (!state.data) return;
    state.playing = false;
    txt("btnPlay",  "▶ 播放笔顺");
    applyProgress(state.durs.length, 1);
    txt("stageOk",  "已显示整字 · 共 " + state.durs.length + " 笔");
  }

  /* ============ 渲染字 ============ */
  function currentChar() { return state.chars.charAt(state.index) || ""; }

  function renderStrokeList() {
    var list = $("strokeList");
    if (!list) return;
    list.innerHTML = "";
    if (!state.data) { txt("strokeCount", "0 笔"); return; }
    var n = state.data.strokes.length;
    txt("strokeCount",  n + " 笔");
    for (var i = 0; i < n; i++) {
      var b = document.createElement("button");
      b.type = "button";
      b.className = "stroke-chip";
      b.innerHTML = "第 " + (i + 1) + " 笔";
      (function (idx) {
        b.addEventListener("click", function () { stepTo(idx); });
      })(i);
      list.appendChild(b);
    }
  }

  function loadChar(ch) {
    getData(ch, function (d) {
      var empty = $("emptyState");
      if (!d) {
        state.data = null;
        buildSvg();
        renderStrokeList();
        if (empty) { empty.hidden = false; txt("emptyDesc", "「" + ch + "」暂无本地数据，联网后自动获取…"); }
        txt("charMeta",  "笔画数 —");
        txt("stageOk",  "无数据");
        return;
      }
      if (empty) empty.hidden = true;
      state.data = d;
      buildSvg();
      renderStrokeList();
      txt("charMeta",  "笔画数 " + d.strokes.length + " · 第 " + (state.index + 1) + "/" + state.chars.length + " 字");
      applyProgress(0, 0);
      txt("stageOk",  "就绪 · 共 " + d.strokes.length + " 笔");
      play();
    });
  }

  function setChars(text) {
    var cleaned = String(text || "").replace(/[^\u4e00-\u9fff]/g, "");
    if (!cleaned) { toast("请输入汉字"); return; }
    state.chars = cleaned;
    if (state.index >= cleaned.length) state.index = cleaned.length - 1;
    syncQuickActive();
    loadChar(currentChar());
  }

  /* 常用字速选：直接取自本地打包数据（离线可用），并按笔画数升序排列便于教学 */
  var FALLBACK_QUICK = ["水", "一", "月", "田", "本", "开", "云", "方", "生", "用",
    "字", "问", "光", "西", "共", "机", "存", "灰", "曲", "争"];

  function renderQuick() {
    var box = $("quickGrid");
    if (!box) return;
    var local = localData();
    var keys = Object.keys(local || {}).filter(function (k) { return local[k] && local[k].s && local[k].m; });
    if (!keys.length) keys = FALLBACK_QUICK.slice();
    /* 按笔画数升序：先易后难，符合识字教学顺序 */
    keys.sort(function (a, b) {
      var d = (local[a] ? local[a].s.length : 0) - (local[b] ? local[b].s.length : 0);
      return d !== 0 ? d : (a < b ? -1 : 1);
    });
    box.innerHTML = "";
    for (var k = 0; k < keys.length; k++) {
      var cell = document.createElement("div");
      cell.className = "quick-cell";
      cell.textContent = keys[k];
      cell.title = keys[k] + "（" + (local[keys[k]] ? local[keys[k]].s.length : "?") + " 笔）";
      cell.setAttribute("data-ch", keys[k]);
      (function (ch) {
        cell.addEventListener("click", function () {
          var input = $("charInput");
          if (input) input.value = ch;
          state.chars = ch; state.index = 0;
          syncQuickActive();
          loadChar(ch);
        });
      })(keys[k]);
      box.appendChild(cell);
    }
    syncQuickActive();
  }

  function syncQuickActive() {
    var box = $("quickGrid");
    if (!box) return;
    var cells = box.querySelectorAll(".quick-cell");
    var cur = currentChar();
    for (var i = 0; i < cells.length; i++) {
      if (cells[i].getAttribute("data-ch") === cur) cells[i].classList.add("active");
      else cells[i].classList.remove("active");
    }
  }

  /* ============ 事件 ============ */
  function bind() {
    var input = $("charInput");
    input.addEventListener("input", function () { setChars(input.value); });
    input.addEventListener("keydown", function (e) { if (e.key === "Enter") setChars(input.value); });

    $("btnPrevChar").addEventListener("click", function () {
      if (state.index > 0) { state.index -= 1; $("charInput").value = state.chars; syncQuickActive(); loadChar(currentChar()); }
    });
    $("btnNextChar").addEventListener("click", function () {
      if (state.index < state.chars.length - 1) { state.index += 1; $("charInput").value = state.chars; syncQuickActive(); loadChar(currentChar()); }
    });

    $("btnPlay").addEventListener("click", function () { state.playing ? pause() : play(); });
    $("btnReplay").addEventListener("click", function () { stop(true); play(); });
    $("btnShowAll").addEventListener("click", showAll);
    $("btnPrevStroke").addEventListener("click", function () { stepTo(state.cur <= 0 ? 0 : state.cur - 1); });
    $("btnNextStroke").addEventListener("click", function () { stepTo((state.cur < 0 ? 0 : state.cur) + 1); });

    $("speedChips").querySelectorAll(".chip").forEach(function (c) {
      c.addEventListener("click", function () {
        state.speed = parseFloat(c.getAttribute("data-speed")) || 1;
        $("speedChips").querySelectorAll(".chip").forEach(function (x) { x.classList.remove("active"); });
        c.classList.add("active");
        computeDurs();
      });
    });

    $("gridChips").querySelectorAll(".chip").forEach(function (c) {
      c.addEventListener("click", function () {
        state.grid = c.getAttribute("data-grid") || "tian";
        $("gridChips").querySelectorAll(".chip").forEach(function (x) { x.classList.remove("active"); });
        c.classList.add("active");
        buildSvg();
        applyProgress(state.cur + 1, 1);
      });
    });

    $("chkTrace").addEventListener("change", function () {
      var host = $("hanziSvg");
      var el = host ? host.querySelector(".trace") : null;
      if (el) el.style.display = $("chkTrace").checked ? "" : "none";
    });
    $("chkPen").addEventListener("change", function () { movePen(state.cur, 1); });
  }

  /* ---------- 初始化 ---------- */
  function init() {
    /* 舞台右上角工具栏（⛶ 舞台全屏 / ⚙ 隐藏设置），与随机叫号同构 */
    if (window.EduToolStageToolbar) {
      window.EduToolStageToolbar.init({ stage: ".stage-panel", panelHost: ".workbench", hiddenClass: "setup-hidden" });
    }
    state.chars = "水";
    state.index = 0;
    renderQuick();
    bind();
    loadChar("水");
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
