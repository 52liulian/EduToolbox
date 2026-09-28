/* ============================================================
 * EduToolbox · 英语单词听写 dictation-english.js
 * 功能：单词库 + 英文/中文合成朗读 + 听写/拼写判分双模式
 * 纯前端 IIFE，依赖 Web Speech API（无兼容时以文字提示兜底）
 * ============================================================ */
(function () {
  "use strict";

  var $ = function (id) { return document.getElementById(id); };
  var esc = function (s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]; }); };

  /* ---------- 内置示例单词库 ---------- */
  var LIBS = {
    "三年级": "apple 苹果\nbanana 香蕉\nteacher 老师\nstudent 学生\nbook 书\npen 钢笔\ncat 猫\ndog 狗\nred 红色的\nblue 蓝色的",
    "四年级": "classroom 教室\nlibrary 图书馆\nmorning 早晨\nfriend 朋友\nfamily 家庭\nmother 妈妈\nfather 爸爸\nwater 水\nmusic 音乐\nweather 天气",
    "五年级": "beautiful 美丽的\ndelicious 美味的\ninteresting 有趣的\nimportant 重要的\ncomputer 电脑\nholiday 假期\nseason 季节\nsummer 夏天\nwinter 冬天\nfavorite 最喜爱的",
    "六年级": "dictionary 词典\nlibrary 图书馆\nenvironment 环境\nhealthy 健康的\ndifferent 不同的\nbegin 开始\ntogether 一起\nusually 通常\nsometimes 有时\nalways 总是"
  };

  /* ---------- 状态 ---------- */
  var state = {
    words: [],        // [{en, cn}]
    idx: 0,
    mode: "listen",   // listen | spell
    running: false,
    paused: false,
    tick: null,
    speakTimer: null,
    elapsed: 0,
    correct: 0,
    wrong: 0,
    results: []       // [{en, cn, ok}]
  };

  var synth = (typeof window !== "undefined" && window.speechSynthesis) ? window.speechSynthesis : null;

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

  /* ============ 语音 ============ */
  function speak(text) {
    if (!synth || !text) return false;
    synth.cancel();
    var u = new SpeechSynthesisUtterance(text);
    u.lang = "en-US";
    u.rate = parseFloat($("rate").value) || 0.9;
    synth.speak(u);
    return true;
  }
  function cancelSpeech() { if (synth) { try { synth.cancel(); } catch (e) {} } clearTimeout(state.speakTimer); }

  /* 报当前词（返回是否触发语音） */
  function speakWord() {
    var item = state.words[state.idx];
    if (!item) return;
    var idxPart = $("withIndex").checked ? "Number " + (state.idx + 1) + ". " : "";
    var phrase;
    if (state.mode === "spell") {
      phrase = idxPart + (($("readCn").checked && item.cn) ? item.cn + ". " : "") + item.en;
    } else {
      // 听写模式：默认报中文释义（学生写英文），无中文则报英文
      phrase = idxPart + (($("readCn").checked && item.cn) ? item.cn : item.en);
    }
    speak(phrase);
  }

  /* ============ 流程 ============ */
  function parseWords() {
    var raw = $("words").value.replace(/\r/g, "").split("\n");
    var list = [];
    raw.forEach(function (line) {
      line = line.trim();
      if (!line) return;
      var parts = line.split(/\s+/);
      list.push({ en: parts[0], cn: parts.slice(1).join(" ") });
    });
    return list;
  }

  function updateProgress() {
    var total = Math.max(1, state.words.length);
    $("curIndex").textContent = (state.idx + 1) + " / " + total;
    $("progressBar").style.width = ((state.idx + 1) / total * 100) + "%";
  }

  function showCurrent() {
    var item = state.words[state.idx];
    updateProgress();
    if (state.mode === "listen") {
      $("listenWrap").style.display = "";
      $("spellWrap").style.display = "none";
      $("bigHint").textContent = item.cn || item.en;
      // 显示空书写格
      var n = Math.max(3, item.en.length);
      var cards = "";
      for (var i = 0; i < n; i++) cards += '<span class="wcard"></span>';
      $("wordCards").innerHTML = cards;
    } else {
      $("listenWrap").style.display = "none";
      $("spellWrap").style.display = "";
      $("spellHint").textContent = item.cn ? ("请拼写：" + item.cn) : "请拼写下列单词";
      $("judgeBox").textContent = "";
      $("judgeBox").className = "judge";
      $("spellInput").value = "";
      $("spellInput").focus();
    }
  }

  /* 听写模式：报完 repeat 遍后按间隔进入下一词 */
  function speakCurrentForListen(repeatLeft) {
    if (!state.running || state.paused) return;
    speakWord();
    var gap = parseFloat($("gapSec").value || 5) * 1000;
    if (repeatLeft > 1) {
      state.speakTimer = setTimeout(function () { state.speakTimer = setTimeout(doAfterRepeat, (repeatLeft - 1) * 900 + gap); }, 0);
    }
    // 简化：多次报读间隔 0.9s，最后按 gap 进入下一词
    function doAfterRepeat() { nextWord(); }
  }

  function nextWord() {
    if (!state.running || state.paused) return;
    if (state.idx + 1 >= state.words.length) { finish(); return; }
    state.idx += 1;
    showCurrent();
    startSpeakCurrent();
  }

  /* 根据模式启动当前词的报读流程 */
  function startSpeakCurrent() {
    var item = state.words[state.idx];
    if (!item) return;
    var rep = parseInt($("repeatCount").value, 10) || 1;
    if (state.mode === "spell") {
      // 拼写模式：先报读（含中文），作答不阻塞
      for (var i = 0; i < rep; i++) { (function (t) { setTimeout(function () { if (state.running && !state.paused) speakWord(); }, t); })(i * 900); }
    } else {
      // 听写模式：报 repeat 遍，最后按间隔自动下一词
      var gap = parseFloat($("gapSec").value || 5) * 1000;
      var k = 0;
      function chain() {
        if (!state.running || state.paused) return;
        speakWord();
        k++;
        if (k < rep) { state.speakTimer = setTimeout(chain, 1100); }
        else { state.speakTimer = setTimeout(nextWord, gap); }
      }
      chain();
    }
  }

  function startDictation() {
    state.words = parseWords();
    if (!state.words.length) { toast("请先输入单词"); return; }
    state.idx = 0; state.elapsed = 0; state.correct = 0; state.wrong = 0; state.results = [];
    state.running = true; state.paused = false;
    setViews("running");
    $("wordCount").textContent = state.words.length;
    $("btnStart").disabled = true; $("btnStop").disabled = false; $("btnPause").disabled = false; $("btnRepeat").disabled = false;
    startTick(); updateScores(); showCurrent();
    toast("开始听写");
    startSpeakCurrent();
  }

  function finish() {
    state.running = false;
    stopTick(); cancelSpeech();
    setViews("done");
    var total = state.words.length;
    var pct = total ? Math.round(state.correct / total * 100) : 0;
    $("doneDesc").textContent = "共 " + total + " 词 · 正确 " + state.correct + " · 正确率 " + pct + "%";
    var html = state.results.map(function (r) {
      return '<div class="r"><span class="w">' + esc(r.en) + '</span><span class="cn">' + esc(r.cn || "") + '</span><span class="res ' + (r.ok ? "ok" : "no") + '">' + (r.ok ? "✓ 正确" : "✗ " + esc(r.en)) + "</span></div>";
    }).join("");
    $("doneList").innerHTML = html || '<div style="color:var(--text-3);text-align:center;padding:12px">暂无结果</div>';
    $("btnStart").disabled = false; $("btnStop").disabled = true; $("btnPause").disabled = true; $("btnRepeat").disabled = true;
    $("stageOk").textContent = "已结束";
  }

  /* 拼写模式提交 */
  function submitAnswer() {
    if (!state.running || state.mode !== "spell" || state.paused) return;
    var item = state.words[state.idx];
    if (!item) return;
    var ans = $("spellInput").value.trim();
    if (!ans) { toast("请输入单词，或点跳过"); return; }
    var ok = ans.toLowerCase() === item.en.toLowerCase();
    
    if (ok) { state.correct++; } else { state.wrong++; state.results.push({ en: item.en, cn: item.cn, ok: false }); }
    if (ok) state.results.push({ en: item.en, cn: item.cn, ok: true });
    updateScores();
    showJudge(ok, item.en);
    // 1.3s 后进入下一词
    state.speakTimer = setTimeout(nextWord, 1300);
  }

  function skipAnswer() {
    if (!state.running || state.mode !== "spell") return;
    var item = state.words[state.idx];
    if (!item) return;
    state.wrong++;
    state.results.push({ en: item.en, cn: item.cn, ok: false });
    updateScores();
    showJudge(false, item.en);
    state.speakTimer = setTimeout(nextWord, 1100);
  }

  function showJudge(ok, en) {
    var b = $("judgeBox");
    b.textContent = ok ? "✓ 正确！" : "✗ 正确答案：" + en;
    b.className = "judge " + (ok ? "ok" : "no");
  }

  function updateScores() {
    $("correctCnt").textContent = state.correct;
    $("wrongCnt").textContent = state.wrong;
  }

  /* ============ 计时 ============ */
  function startTick() {
    stopTick();
    state.tick = setInterval(function () {
      if (!state.paused && state.running) {
        state.elapsed += 1;
        var m = String(Math.floor(state.elapsed / 60)).padStart(2, "0");
        var s = String(state.elapsed % 60).padStart(2, "0");
        $("elapsed").textContent = m + ":" + s;
      }
    }, 1000);
  }
  function stopTick() { clearInterval(state.tick); state.tick = null; }

  /* ============ 视图切换 ============ */
  function setViews(which) {
    $("readyView").style.display = which === "ready" ? "block" : "none";
    $("runningView").style.display = which === "running" ? "block" : "none";
    $("doneView").style.display = which === "done" ? "block" : "none";
  }

  function togglePause() {
    if (!state.running) return;
    if (!state.paused) {
      state.paused = true; stopTick(); cancelSpeech();
      $("btnPause").textContent = "▶ 继续"; $("stageOk").textContent = "已暂停";
    } else {
      state.paused = false; startTick();
      $("btnPause").textContent = "⏸ 暂停"; $("stageOk").textContent = "听写中";
      startSpeakCurrent();
    }
  }

  function stopDictation() {
    state.running = false; state.paused = false;
    stopTick(); cancelSpeech();
    setViews("ready");
    $("btnStart").disabled = false; $("btnStop").disabled = true; $("btnPause").disabled = true; $("btnRepeat").disabled = true;
    $("btnPause").textContent = "⏸ 暂停"; $("stageOk").textContent = "未开始";
  }

  /* ============ 事件 ============ */
  function bind() {
    var wrap = $("libChips");
    wrap.innerHTML = Object.keys(LIBS).map(function (k) { return '<button type="button" class="chip" data-v="' + esc(k) + '">' + esc(k) + "</button>"; }).join("");
    wrap.querySelectorAll(".chip").forEach(function (chip) {
      chip.addEventListener("click", function () {
        $("words").value = LIBS[chip.dataset.v];
        $("wordCount").textContent = parseWords().length;
        toast("已载入 " + chip.dataset.v + " 示例词库");
      });
    });

    // 模式切换
    $("modeChips").querySelectorAll(".chip").forEach(function (chip) {
      chip.addEventListener("click", function () {
        state.mode = chip.dataset.mode;
        $("modeChips").querySelectorAll(".chip").forEach(function (c) { c.classList.remove("active"); });
        chip.classList.add("active");
        $("modeHint").textContent = state.mode === "spell" ? "拼写判分：报英文 → 输入拼写 → 自动判对错" : "听写模式：仅报读，学生默写。";
      });
    });

    $("words").addEventListener("input", function () { $("wordCount").textContent = parseWords().length; });
    $("btnStart").addEventListener("click", startDictation);
    $("btnPause").addEventListener("click", togglePause);
    $("btnRepeat").addEventListener("click", function () { if (state.running && !state.paused) { cancelSpeech(); startSpeakCurrent(); } });
    $("btnStop").addEventListener("click", stopDictation);
    $("btnSubmit").addEventListener("click", submitAnswer);
    $("btnSkip").addEventListener("click", skipAnswer);
    $("spellInput").addEventListener("keydown", function (e) { if (e.key === "Enter") { e.preventDefault(); submitAnswer(); } });
    $("btnReplay").addEventListener("click", function () { state.idx = 0; state.running = true; state.paused = false; state.correct = 0; state.wrong = 0; state.results = []; setViews("running"); $("btnStart").disabled = true; $("btnStop").disabled = false; $("btnPause").disabled = false; $("btnRepeat").disabled = false; $("btnPause").textContent = "⏸ 暂停"; startTick(); updateScores(); showCurrent(); startSpeakCurrent(); });
    $("btnAgain").addEventListener("click", function () { setViews("ready"); $("stageOk").textContent = "未开始"; $("btnStart").disabled = false; $("btnStop").disabled = true; $("btnPause").disabled = true; $("btnRepeat").disabled = true; });
  }

  /* ---------- 初始化 ---------- */
  function init() {
    $("words").value = "beautiful 美丽的\ndifferent 不同的\nbecome 成为\ntogether 一起\nlanguage 语言";
    $("wordCount").textContent = parseWords().length;
    bind();
    // 舞台右上角工具栏（⛶ 舞台全屏 / ⚙ 隐藏设置），与随机叫号同构
    if (window.EduToolStageToolbar) window.EduToolStageToolbar.init({ stage: ".stage-panel", panelHost: ".workbench" });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
