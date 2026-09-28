/* ============================================================
 * EduToolbox · 单词闪卡记忆 flash-cards.js
 * 功能：翻转卡片 + 艾宾浩斯间隔复习 + 进度本地持久化
 * 纯前端 IIFE；间隔梯度 1/2/4/7/15/30 天
 * ============================================================ */
(function () {
  "use strict";

  var $ = function (id) { return document.getElementById(id); };
  var DAY = 86400000;
  /* 艾宾浩斯复习间隔（天）：按掌握等级递进 */
  var STEPS = [1, 2, 4, 7, 15, 30];
  var DECK_KEY = "edutoolbox.flash-cards.deck";
  var PROG_KEY = "edutoolbox.flash-cards.progress";
  var SOUND_KEY = "edutoolbox.flash-cards.sound";

  /* ---------- 内置词库预设 ---------- */
  var PRESETS = {
    "小学英语": "apple = 苹果\nbook = 书\ncat = 猫\ndog = 狗\negg = 鸡蛋\nfish = 鱼\ngirl = 女孩\nhand = 手\nice = 冰\njuice = 果汁",
    "初中高频": "important = 重要的\ndifference = 差别\nenvironment = 环境\nexperience = 经验/经历\nknowledge = 知识\nprogress = 进步\nprotect = 保护\nrealize = 意识到\nsucceed = 成功\nvalue = 价值",
    "课堂用语": "attention = 注意\nquestion = 问题\nanswer = 回答\npractice = 练习\nreview = 复习\nhomework = 作业\nblackboard = 黑板\nclassroom = 教室\nstudent = 学生\nteacher = 老师",
    "语文易错词": "已经 = 表示完成\n既然 = 连词，既然如此\n截止 = 到…为止\n截至 = 截止到\n反应 = 有机体受刺激\n反映 = 把情况报告\n启用 = 开始使用\n起用 = 重新任用\n做客 = 访问别人\n作客 = 寄居异地"
  };

  /* ---------- 状态 ---------- */
  var state = {
    deck: [],        // [{front, back, key}]
    progress: {},    // key: {level, due, seen}
    queue: [],       // 当前学习队列（key 列表）
    idx: 0,
    mode: "due",
    flipped: false,
    j2c: true,
    autoFlip: false,
    sound: true,
    todayKey: "",
    todayDone: 0
  };

  /* ============ 工具 ============ */
  function toast(msg) {
    var t = $("toast");
    if (!t) return;
    t.textContent = msg;
    t.classList.add("show");
    clearTimeout(toast._t);
    toast._t = setTimeout(function () { t.classList.remove("show"); }, 1800);
  }

  function todayKey() {
    var d = new Date();
    return d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate();
  }

  function store(key, val) {
    try { localStorage.setItem(key, JSON.stringify(val)); } catch (e) { /* 隐私模式忽略 */ }
  }
  function restore(key, def) {
    try {
      var raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : def;
    } catch (e) { return def; }
  }

  /* ============ 朗读 ============ */
  function speak(text) {
    if (!state.sound || !text) return;
    try {
      if (!window.speechSynthesis) return;
      var u = new SpeechSynthesisUtterance(text);
      u.lang = /[\u4e00-\u9fff]/.test(text) ? "zh-CN" : "en-US";
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(u);
    } catch (e) { /* 忽略 */ }
  }

  /* ============ 词库解析 ============ */
  function parseDeck(text) {
    var lines = String(text || "").split("\n");
    var out = [];
    for (var i = 0; i < lines.length; i++) {
      var line = lines[i].trim();
      if (!line || line.charAt(0) === "#") continue;
      var parts = line.split(/\s*[=＝\t,，]\s*/);
      if (parts.length < 2) continue;
      var a = parts[0].trim(), b = parts.slice(1).join(" ").trim();
      if (!a || !b) continue;
      out.push({ front: a, back: b, key: a + "||" + b });
    }
    return out;
  }

  function loadDeck(silent) {
    var deck = parseDeck($("deckInput").value);
    if (!deck.length) { toast("请至少填写一行「单词 = 释义」"); return; }
    state.deck = deck;
    state.progress = restore(PROG_KEY, {}) || {};
    store(DECK_KEY, $("deckInput").value);
    $("emptyState").hidden = true;
    $("cardArea").hidden = false;
    buildQueue();
    if (!silent) toast("已载入 " + deck.length + " 个词条");
    showCard();
  }

  /* ============ 队列 ============ */
  function isDue(item) {
    var p = state.progress[item.key];
    if (!p) return true;                       // 未学习 → 视为待学
    return !p.due || p.due <= Date.now();
  }

  function buildQueue() {
    var now = Date.now();
    var list = state.deck.slice();
    var due = [], fresh = [], rest = [];
    for (var i = 0; i < list.length; i++) {
      var p = state.progress[list[i].key];
      if (!p) { fresh.push(list[i]); }
      else if (!p.due || p.due <= now) { due.push(list[i]); }
      else { rest.push(list[i]); }
    }
    shuffle(due); shuffle(fresh); shuffle(rest);
    if (state.mode === "due") state.queue = due.concat(fresh, rest);
    else if (state.mode === "new") state.queue = fresh.concat(due, rest);
    else state.queue = list.slice();
    state.idx = 0;
  }

  function shuffle(arr) {
    for (var i = arr.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = arr[i]; arr[i] = arr[j]; arr[j] = t;
    }
    return arr;
  }

  /* ============ 卡片渲染 ============ */
  function current() { return state.queue[state.idx] || null; }

  function showCard() {
    var item = current();
    if (!item) {
      $("frontWord").textContent = "🎉";
      $("backWord").textContent = "本轮已完成，可切换模式或重新载入";
      $("stageOk").textContent = "本轮完成";
      $("cardMeta").textContent = "";
      setFlipped(true);
      updateStats();
      return;
    }
    setFlipped(false);
    var front = state.j2c ? item.front : item.back;
    var back = state.j2c ? item.back : item.front;
    $("frontWord").textContent = front;
    $("backWord").textContent = back;
    $("frontTag").textContent = state.j2c ? "单词" : "释义";
    $("backTag").textContent = state.j2c ? "释义" : "单词";
    var p = state.progress[item.key];
    var meta = "第 " + (state.idx + 1) + " / " + state.queue.length + " 张";
    if (p) {
      meta += " · 掌握等级 " + (p.level || 0) + "/" + STEPS.length;
      if (p.due && p.due > Date.now()) {
        var d = Math.ceil((p.due - Date.now()) / DAY);
        meta += " · " + d + " 天后复习";
      } else { meta += " · 待复习"; }
    } else { meta += " · 新词"; }
    $("cardMeta").textContent = meta;
    $("stageOk").textContent = "待复习 " + countDue() + " 个";
    speak(front);
    if (state.autoFlip) {
      clearTimeout(showCard._t);
      showCard._t = setTimeout(function () { if (current() === item) setFlipped(true); }, 3000);
    }
    updateStats();
  }

  function setFlipped(v) {
    state.flipped = !!v;
    var el = $("flipCard");
    if (el) el.classList.toggle("flipped", !!v);
    $("feedbackRow").style.opacity = v ? "1" : ".45";
  }

  /* ============ 反馈 ============ */
  function feedback(kind) {
    var item = current();
    if (!item) return;
    var now = Date.now();
    var p = state.progress[item.key] || { level: 0, seen: 0 };
    p.seen = (p.seen || 0) + 1;
    if (kind === "again") {
      p.level = 0;
      p.due = now + 1 * DAY;
    } else if (kind === "hard") {
      p.level = Math.max(0, (p.level || 0) - 1);
      p.due = now + 2 * DAY;
    } else {
      p.level = Math.min(STEPS.length, (p.level || 0) + 1);
      var step = STEPS[Math.min(STEPS.length - 1, p.level - 1)] || 30;
      p.due = now + step * DAY;
    }
    state.progress[item.key] = p;
    store(PROG_KEY, state.progress);
    state.todayDone += 1;
    next();
  }

  function next() {
    if (state.idx < state.queue.length - 1) { state.idx += 1; showCard(); }
    else { state.idx = state.queue.length; showCard(); }
  }

  function prev() {
    if (state.idx > 0) { state.idx -= 1; showCard(); }
    else toast("已经是第一张");
  }

  /* ============ 统计 ============ */
  function countDue() {
    var now = Date.now(), n = 0;
    for (var i = 0; i < state.deck.length; i++) {
      var p = state.progress[state.deck[i].key];
      if (!p || !p.due || p.due <= now) n += 1;
    }
    return n;
  }

  function updateStats() {
    var now = Date.now();
    var total = state.deck.length, due = 0, fresh = 0, mastered = 0;
    for (var i = 0; i < state.deck.length; i++) {
      var p = state.progress[state.deck[i].key];
      if (!p) { fresh += 1; due += 1; continue; }
      if (!p.due || p.due <= now) due += 1;
      if ((p.level || 0) >= STEPS.length) mastered += 1;
    }
    $("statTotal").textContent = total;
    $("statDue").textContent = due;
    $("statNew").textContent = fresh;
    $("statDone").textContent = state.todayDone;
    var pct = total ? Math.round(mastered / total * 100) : 0;
    $("progressFill").style.width = pct + "%";
    $("progressText").textContent = "掌握度 " + pct + "%（" + mastered + "/" + total + " 已达最终间隔）";
  }

  /* ============ 事件 ============ */
  function bind() {
    var pw = $("presetChips");
    pw.innerHTML = Object.keys(PRESETS).map(function (k) {
      return '<button type="button" class="chip" data-v="' + k + '">' + k + "</button>";
    }).join("");
    pw.querySelectorAll(".chip").forEach(function (c) {
      c.addEventListener("click", function () {
        $("deckInput").value = PRESETS[c.getAttribute("data-v")];
        toast("已填入「" + c.getAttribute("data-v") + "」词库，点「载入词库」开始");
      });
    });

    $("btnLoadDeck").addEventListener("click", function () { loadDeck(false); });
    $("btnResetProgress").addEventListener("click", function () {
      state.progress = {};
      store(PROG_KEY, state.progress);
      state.todayDone = 0;
      buildQueue(); showCard();
      toast("进度已清空");
    });

    $("modeChips").querySelectorAll(".chip").forEach(function (c) {
      c.addEventListener("click", function () {
        state.mode = c.getAttribute("data-mode") || "due";
        $("modeChips").querySelectorAll(".chip").forEach(function (x) { x.classList.remove("active"); });
        c.classList.add("active");
        buildQueue(); showCard();
      });
    });

    $("chkJ2C").addEventListener("change", function () {
      state.j2c = $("chkJ2C").checked;
      showCard();
    });
    $("chkAutoFlip").addEventListener("change", function () { state.autoFlip = $("chkAutoFlip").checked; });

    $("flipCard").addEventListener("click", function () {
      if (!current()) return;
      setFlipped(!state.flipped);
      if (state.flipped) speak(state.j2c ? current().back : current().front);
    });
    $("btnAgain").addEventListener("click", function () { feedback("again"); });
    $("btnHard").addEventListener("click", function () { feedback("hard"); });
    $("btnGood").addEventListener("click", function () { feedback("good"); });
    $("btnSkip").addEventListener("click", next);
    $("btnPrev").addEventListener("click", prev);
    $("btnSpeak").addEventListener("click", function () {
      var it = current();
      if (it) speak(state.flipped ? (state.j2c ? it.back : it.front) : (state.j2c ? it.front : it.back));
    });

    $("btnSound").addEventListener("click", function () {
      state.sound = !state.sound;
      $("btnSound").textContent = state.sound ? "🔊 朗读" : "🔇 静音";
      store(SOUND_KEY, state.sound);
    });

    document.addEventListener("keydown", function (e) {
      if (e.target && /INPUT|TEXTAREA/.test(e.target.tagName)) return;
      if (e.key === " ") { e.preventDefault(); if (current()) setFlipped(!state.flipped); }
      else if (e.key === "1") feedback("again");
      else if (e.key === "2") feedback("hard");
      else if (e.key === "3") feedback("good");
      else if (e.key === "ArrowRight") next();
      else if (e.key === "ArrowLeft") prev();
    });
  }

  /* ---------- 初始化 ---------- */
  function init() {
    state.sound = restore(SOUND_KEY, true) !== false;
    $("btnSound").textContent = state.sound ? "🔊 朗读" : "🔇 静音";

    var saved = restore(DECK_KEY, "");
    if (saved) { $("deckInput").value = saved; loadDeck(true); }
    else { $("deckInput").value = PRESETS["小学英语"]; }
    bind();
    updateStats();
    // 舞台右上角工具栏（⛶ 舞台全屏 / ⚙ 隐藏设置），与随机叫号同构
    if (window.EduToolStageToolbar) window.EduToolStageToolbar.init({ stage: ".stage-panel", panelHost: ".workbench" });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
