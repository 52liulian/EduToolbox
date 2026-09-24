/* ============================================================
 * EduToolbox · 口算竞技场 mental-math.js
 * 功能：限时口算 + 班级对战；分年级难度 + 自定义四则运算
 * 纯前端 IIFE，全部本地计算
 * ============================================================ */
(function () {
  "use strict";

  var $ = function (id) { return document.getElementById(id); };

  /* ---------- 年级难度配置 ---------- */
  var DIFFS = {
    "1": { ops: ["add", "sub"], max: 10, hint: "一年级：10 以内加减" },
    "2": { ops: ["add", "sub"], max: 20, hint: "二年级：20 以内加减" },
    "3": { ops: ["add", "sub", "mul"], max: 20, hint: "三年级：整十加减 + 九九乘法" },
    "4": { ops: ["add", "sub", "mul", "div"], max: 50, hint: "四年级：混合四则（除法整除）" },
    "5": { ops: ["add", "sub", "mul", "div"], max: 100, hint: "五六年级：百内混合四则" }
  };

  var OP_SYM = { add: "+", sub: "-", mul: "×", div: "÷" };

  /* ---------- 状态 ---------- */
  var state = {
    mode: "solo",
    diff: "3",
    ops: [],
    max: 20,
    sec: 60,
    teams: [],
    curTeam: 0,
    okTab: 0,
    noTab: 0,
    wrong: [],
    question: null,
    remaining: 0,
    timer: null,
    running: false
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

  /* ============ 出题 ============ */
  function rand(a, b) { return a + Math.floor(Math.random() * (b - a + 1)); }
  function genQuestion() {
    var ops = state.ops.length ? state.ops : ["add"];
    var op = ops[rand(0, ops.length - 1)];
    var M = state.max;
    var a, b, answer, text;
    if (op === "add") {
      b = rand(1, M);
      a = rand(1, Math.max(1, M - b));
      answer = a + b; text = a + " + " + b;
    } else if (op === "sub") {
      a = rand(1, M); b = rand(1, a);
      answer = a - b; text = a + " − " + b;
    } else if (op === "mul") {
      var hi = Math.min(9, Math.max(2, M));
      a = rand(2, hi); b = rand(2, hi);
      answer = a * b; text = a + " × " + b;
    } else {
      var q = rand(2, Math.min(9, Math.max(2, M)));
      b = rand(2, Math.min(9, Math.max(2, M)));
      a = q * b; answer = q; text = a + " ÷ " + b;
    }
    state.question = { text: text, answer: answer, your: null, ok: false };
  }

  /* ============ 视图 ============ */
  function setViews(which) {
    $("readyView").style.display = which === "ready" ? "block" : "none";
    $("runningView").style.display = which === "running" ? "block" : "none";
    $("doneView").style.display = which === "done" ? "block" : "none";
  }

  function renderTeamBar() {
    var bar = $("teamBar");
    if (state.mode !== "team") { bar.style.display = "none"; return; }
    bar.style.display = "";
    bar.innerHTML = state.teams.map(function (t, i) {
      return '<span class="team-tag' + (i === state.curTeam ? " on" : "") + '" data-i="' + i + '">' + t.name + ' <span class="ts">' + t.score + " 分</span></span>";
    }).join("");
  }

  function showQuestion() {
    genQuestion();
    $("qIndex").textContent = "第 " + (state.okTab + state.noTab + 1) + " 题";
    $("question").textContent = state.question.text + " = ?";
    $("answerInput").value = "";
    $("answerInput").focus();
    if (state.mode === "team") renderTeamBar();
    updateStats();
  }

  function updateStats() {
    $("okCnt").textContent = state.okTab;
    $("noCnt").textContent = state.noTab;
    if (state.mode === "team" && state.teams[state.curTeam]) {
      $("score").textContent = state.teams[state.curTeam].score + " 分";
    } else {
      var pts = state.okTab * 10;
      $("score").textContent = pts + " 分";
    }
  }

  function beginCountdown() {
    $("timer").textContent = state.remaining;
    $("timer").classList.remove("warn");
    state.timer = setInterval(function () {
      state.remaining -= 1;
      if (state.remaining <= 0) { state.remaining = 0; $("timer").textContent = "0"; fin(); return; }
      $("timer").textContent = state.remaining;
      if (state.remaining <= 10) $("timer").classList.add("warn");
    }, 1000);
  }

  /* ============ 流程 ============ */
  function startGame() {
    // 读取难度
    var cfg = DIFFS[state.diff];
    if (state.diff === "custom") {
      var selOps = [];
      $("opChips").querySelectorAll(".chip.on").forEach(function (c) { selOps.push(c.dataset.op); });
      state.ops = selOps.length ? selOps : ["add"];
      state.max = parseInt($("custMax").value, 10) || 20;
      state.max = Math.min(999, Math.max(5, state.max));
    } else {
      state.ops = cfg.ops.slice();
      state.max = cfg.max;
    }
    state.sec = getSec();
    // 队伍
    state.teams = [];
    if (state.mode === "team") {
      var n = getTeamNum();
      for (var i = 0; i < n; i++) state.teams.push({ name: "第" + (i + 1) + "队", score: 0, ok: 0 });
    } else {
      state.teams.push({ name: "我", score: 0, ok: 0 });
    }
    state.curTeam = 0;
    state.okTab = 0; state.noTab = 0; state.wrong = [];
    state.remaining = state.sec;
    state.running = true;
    setViews("running");
    $("stageOk").textContent = "挑战中";
    $("btnStart").disabled = true;
    showQuestion();
    beginCountdown();
    toast("开始！限时 " + state.sec + " 秒");
  }

  function submit() {
    if (!state.running) return;
    var v = parseInt($("answerInput").value, 10);
    if (isNaN(v)) { toast("请输入答案"); return; }
    var q = state.question;
    q.your = v;
    if (v === q.answer) {
      q.ok = true;
      state.okTab++;
      if (state.teams[state.curTeam]) state.teams[state.curTeam].score += 10;
      if (state.teams[state.curTeam]) state.teams[state.curTeam].ok += 1;
    } else {
      q.ok = false;
      state.noTab++;
      state.wrong.push({ eq: q.text, ans: q.answer, your: v });
    }
    // 对战模式：答完后轮到下一队
    if (state.mode === "team" && state.teams.length > 1) {
      state.curTeam = (state.curTeam + 1) % state.teams.length;
    }
    updateStats();
    setTimeout(showQuestion, 260);
  }

  function fin() {
    state.running = false;
    clearInterval(state.timer);
    var total = state.okTab + state.noTab;
    var pct = total ? Math.round(state.okTab / total * 100) : 0;
    if (state.mode === "team") {
      $("resultTitle").textContent = "🏆 对战结束";
      $("resultDesc").textContent = "共 " + total + " 题 · 全部答题结束";
      var sorted = state.teams.slice().sort(function (a, b) { return b.score - a.score; });
      var medals = ["r1", "r2", "r3"];
      var html = sorted.map(function (t, i) {
        return '<div class="rank-item ' + (medals[i] || "") + '"><span class="rk">' + (i + 1) + '</span><span class="nm">' + t.name + '</span><span class="st">答对 ' + t.ok + '</span><span class="sc">' + t.score + " 分</span></div>";
      }).join("");
      $("rankList").innerHTML = html;
    } else {
      $("resultTitle").textContent = "🎯 挑战完成";
      $("resultDesc").textContent = "共 " + total + " 题 · 答对 " + state.okTab + " · 正确率 " + pct + " % · 得分 " + (state.okTab * 10) + " 分";
      var w = state.wrong;
      var whtml = w.length
        ? '<div class="wrong-box">' + w.map(function (x) { return '<div class="wb"><span class="eq">' + x.eq + " =</span><span class=\"bad\">" + x.ans + '</span><span style="color:var(--text-3)">你的答案 ' + x.your + "</span></div>"; }).join("") + "</div>"
        : '<div style="color:#16a34a;font-weight:700;padding:8px">全对！太棒了 👏</div>';
      $("rankList").innerHTML = whtml;
    }
    setViews("done");
    $("stageOk").textContent = "已结束";
    $("btnStart").disabled = false;
  }

  function getSec() {
    var s = 60;
    $("timeChips").querySelectorAll(".chip").forEach(function (c) { if (c.classList.contains("active")) s = parseInt(c.dataset.sec, 10) || 60; });
    return s;
  }
  function getTeamNum() {
    var n = 3;
    $("teamNumChips").querySelectorAll(".chip").forEach(function (c) { if (c.classList.contains("active")) n = parseInt(c.dataset.n, 10) || 3; });
    return n;
  }

  /* ============ 事件 ============ */
  function bind() {
    // 模式
    $("modeChips").querySelectorAll(".chip").forEach(function (chip) {
      chip.addEventListener("click", function () {
        state.mode = chip.dataset.mode;
        $("modeChips").querySelectorAll(".chip").forEach(function (c) { c.classList.remove("active"); });
        chip.classList.add("active");
        $("teamSetup").style.display = state.mode === "team" ? "block" : "none";
        if (state.mode === "team") { buildTeamNumChips(); }
      });
    });

    // 难度
    $("diffChips").querySelectorAll(".chip").forEach(function (chip) {
      chip.addEventListener("click", function () {
        state.diff = chip.dataset.diff;
$("diffChips").querySelectorAll(".chip").forEach(function (c) { c.classList.remove("active"); });
        chip.classList.add("active");
        $("customOps").style.display = state.diff === "custom" ? "block" : "none";
        $("diffHint").textContent = state.diff === "custom" ? "自定义：选择运算与数值上限" : (DIFFS[state.diff] ? DIFFS[state.diff].hint : "");
      });
    });

    // 自定义运算 chips
    $("opChips").querySelectorAll(".chip").forEach(function (chip) {
      chip.addEventListener("click", function () { chip.classList.toggle("on"); });
    });

    // 限时
    $("timeChips").querySelectorAll(".chip").forEach(function (chip) {
      chip.addEventListener("click", function () {
        $("timeChips").querySelectorAll(".chip").forEach(function (c) { c.classList.remove("active"); });
        chip.classList.add("active");
      });
    });

    $("btnStart").addEventListener("click", startGame);
    $("btnSubmit").addEventListener("click", submit);
    $("answerInput").addEventListener("keydown", function (e) { if (e.key === "Enter") { e.preventDefault(); submit(); } });
    $("btnAgain").addEventListener("click", function () { setViews("ready"); $("stageOk").textContent = "未开始"; $("btnStart").disabled = false; updateReadyDesc(); });
    // 队伍条点击切换当前队
    document.addEventListener("click", function (e) {
      var t = e.target.closest ? e.target.closest(".team-tag") : null;
      if (t && state.running && state.mode === "team") {
        state.curTeam = parseInt(t.dataset.i, 10);
        renderTeamBar();
        updateStats();
      }
    });
  }

  function buildTeamNumChips() {
    var wrap = $("teamNumChips");
    wrap.innerHTML = "";
    var cur = getTeamNum() || 3;
    [2, 3, 4, 6].forEach(function (n) {
      var b = document.createElement("button");
      b.type = "button";
      b.className = "chip" + (n === cur ? " active" : "");
      b.dataset.n = String(n);
      b.textContent = n + " 队";
      b.addEventListener("click", function () {
        wrap.querySelectorAll(".chip").forEach(function (c) { c.classList.remove("active"); });
        b.classList.add("active");
      });
      wrap.appendChild(b);
    });
  }

  function updateReadyDesc() {
    var cfg = DIFFS[state.diff] || DIFFS["3"];
    var modeName = state.mode === "team" ? "班级对战" : "个人训练";
    $("readyDesc").textContent = modeName + " · " + (state.diff === "custom" ? "自定义难度" : cfg.hint) + " · 限时 " + getSec() + " 秒";
  }

  /* ---------- 初始化 ---------- */
  function init() {
    if (window.EduToolStageToolbar) window.EduToolStageToolbar.init({ stage: ".stage-panel", panelHost: ".workbench", hiddenClass: "setup-hidden" });
    updateReadyDesc();
    // 自定义默认全选
    $("opChips").querySelectorAll(".chip").forEach(function (c) { c.classList.add("on"); });
    buildTeamNumChips();
    bind();
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
