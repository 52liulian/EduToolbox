/* ============================================================
 * EduToolbox · 语文听写报词助手 dictation-chinese.js
 * 功能：生词列表 + 合成语音逐词报读（可报序号/组词）+ 间隔默写
 * 纯前端 IIFE，依赖 Web Speech API（无兼容时以文字提示兜底）
 * ============================================================ */
(function () {
  "use strict";

  var $ = function (id) { return document.getElementById(id); };
  var esc = function (s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]; }); };

  /* ---------- 内置示例词库（按年级，供快速体验） ---------- */
  var LIBS = {
    "一年级": "春天\n冬天\n飞入\n雪花\n方块\n高兴\n桃花\n流水\n青草\n老师",
    "二年级": "碧绿\n化妆\n裁\n找\n娘娘\n邮局\n礼物\n树\n格外\n满足",
    "三年级": "聚集\n偶尔\n姿势\n谦虚\n赏\n匀称\n优雅\n桃花芳\n惊讶",
    "四年级": "倘若\n率领\n奉献\n装饰\n借\n和谐\n郑重\n敏捷\n重叠\n潜含",
    "五年级": "涟漪\n眷恋\n天赋\n穿梭\n呐喊\n沮丧\n驳驳\n持脱\n有意",
    "六年级": "腊月\n初旬\n截然\n翡翠\n展览\n鞭策\n敦厚\n幽雅\n漩涡\n荡漾"
  };

  /* ---------- 状态 ---------- */
  var state = {
    words: [],        // [{word, group}]
    idx: 0,           // 当前词下标（0 基）
    running: false,
    paused: false,
    timer: null,
    tick: null,
    elapsed: 0,
    speakTimer: null
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

  /* ============ 语音播放 ============ */
  function speak(text, onend) {
    if (synth) {
      synth.cancel();
      var u = new SpeechSynthesisUtterance(text);
      u.lang = "zh-CN";
      u.rate = parseFloat($("rate").value) || 0.9;
      u.onend = function () { if (onend) onend(); };
      u.onerror = function () { if (onend) onend(); };
      synth.speak(u);
      return true;
    }
    return false;
  }

  /* 停掉当前语音与定时器 */
  function cancelSpeech() {
    if (synth) { try { synth.cancel(); } catch (e) {} }
    clearTimeout(state.speakTimer);
  }

  /* ============ 流程控制 ============ */
  function parseWords() {
    var raw = $("words").value.replace(/\r/g, "").split("\n");
    var list = [];
    raw.forEach(function (line) {
      line = line.trim();
      if (!line) return;
      var parts = line.split(/\s+/);
      list.push({ word: parts[0], group: parts.slice(1).join(" ") });
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
    $("curWord").textContent = item.word;
    $("shadowWord").textContent = item.word;
    $("curGroup").textContent = item.group || "";
    updateProgress();
    $("stageOk").textContent = "听写中";
  }

  /* 报当前词：repeatCount 遍 + 可选组词，完成后 gapSec 后进入下一词 */
  function speakCurrent(repeatLeft) {
    if (!state.running || state.paused) return;
    var item = state.words[state.idx];
    if (!item) return;
    var total = state.words.length;
    var phrase = "";
    if ($("withIndex").checked) phrase += "第 " + (state.idx + 1) + " 个。";
    phrase += item.word;
    if ($("withGroup").checked && item.group) phrase += "。" + item.group;
    // 听写间隔内：播放完毕后由 onend 驱动下一次
    var played = (typeof window !== "undefined" && window.speechSynthesis)
      ? speak(phrase, function () {
          if (!state.running || state.paused) return;
          if (repeatLeft > 1) { speakMore(repeatLeft - 1); }
          else { state.speakTimer = setTimeout(nextWord, parseFloat($("gapSec").value || 5) * 1000); }
        })
      : false;
    if (!played) {
      // 无语音环境：直接按间隔跳词
      state.speakTimer = setTimeout(nextWord, parseFloat($("gapSec").value || 5) * 1000);
    }
    function speakMore(left) {
      speak(phrase, function () {
        if (!state.running || state.paused) return;
        if (left > 1) speakMore(left - 1);
        else state.speakTimer = setTimeout(nextWord, parseFloat($("gapSec").value || 5) * 1000);
      });
    }
  }

  function nextWord() {
    if (!state.running || state.paused) return;
    if (state.idx + 1 >= state.words.length) { finish(); return; }
    state.idx += 1;
    showCurrent();
    speakCurrent(parseInt($("repeatCount").value, 10) || 1);
  }

  function startDictation() {
    state.words = parseWords();
    if (!state.words.length) { toast("请先输入生词"); return; }
    state.idx = 0;
    state.elapsed = 0;
    state.running = true;
    state.paused = false;
    setViews("running");
    $("wordCount").textContent = state.words.length;
    $("btnStart").disabled = true;
    $("btnStop").disabled = false;
    $("btnPause").disabled = false;
    startTick();
    showCurrent();
    toast("开始听写");
    speakCurrent(parseInt($("repeatCount").value, 10) || 1);
  }

  function finish() {
    state.running = false;
    stopTick();
    cancelSpeech();
    setViews("done");
    var mm = String(Math.floor(state.elapsed / 60)).padStart(2, "0");
    var ss = String(state.elapsed % 60).padStart(2, "0");
    $("doneDesc").textContent = "共 " + state.words.length + " 个词，用时 " + mm + ":" + ss;
    $("btnStart").disabled = false;
    $("btnStop").disabled = true;
    $("btnPause").disabled = true;
    $("stageOk").textContent = "已结束";
  }

  /* 暂停：语音不可靠，采用“停掉并记录”，恢复时重报当前词 */
  function togglePause() {
    if (!state.running) return;
    if (!state.paused) {
      state.paused = true;
      stopTick();
      cancelSpeech();
      $("btnPause").textContent = "▶ 继续";
      $("stageOk").textContent = "已暂停";
    } else {
      state.paused = false;
      startTick();
      $("btnPause").textContent = "⏸ 暂停";
      $("stageOk").textContent = "听写中";
      speakCurrent(parseInt($("repeatCount").value, 10) || 1);
    }
  }

  function repeatCurrent() {
    if (!state.running) return;
    cancelSpeech();
    speakCurrent(parseInt($("repeatCount").value, 10) || 1);
  }

  function stopDictation() {
    state.running = false;
    state.paused = false;
    stopTick();
    cancelSpeech();
    setViews("ready");
    $("btnStart").disabled = false;
    $("btnStop").disabled = true;
    $("btnPause").disabled = true;
    $("btnPause").textContent = "⏸ 暂停";
    $("stageOk").textContent = "未开始";
  }

  /* ============ 计时 ============ */
  function startTick() {
    stopTick();
    state.tick = setInterval(function () {
      if (!state.paused && state.running) {
        state.elapsed += 1;
        var mm = String(Math.floor(state.elapsed / 60)).padStart(2, "0");
        var ss = String(state.elapsed % 60).padStart(2, "0");
        $("elapsed").textContent = mm + ":" + ss;
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

  /* ============ 事件 ============ */
  function bind() {
    // 词库快捷填充
    var wrap = $("libChips");
    wrap.innerHTML = Object.keys(LIBS).map(function (k) { return '<button type="button" class="chip" data-v="' + esc(k) + '">' + esc(k) + "</button>"; }).join("");
    wrap.querySelectorAll(".chip").forEach(function (chip) {
      chip.addEventListener("click", function () {
        $("words").value = LIBS[chip.dataset.v];
        $("wordCount").textContent = parseWords().length;
        toast("已载入 " + chip.dataset.v + " 示例词库");
      });
    });

    $("words").addEventListener("input", function () { $("wordCount").textContent = parseWords().length; });
    $("btnStart").addEventListener("click", startDictation);
    $("btnPause").addEventListener("click", togglePause);
    $("btnRepeat").addEventListener("click", repeatCurrent);
    $("btnStop").addEventListener("click", stopDictation);
    $("btnReplay").addEventListener("click", function () { state.idx = 0; state.running = true; state.paused = false; setViews("running"); $("btnStart").disabled = true; $("btnStop").disabled = false; $("btnPause").disabled = false; $("btnPause").textContent = "⏸ 暂停"; startTick(); showCurrent(); speakCurrent(parseInt($("repeatCount").value, 10) || 1); });
    $("btnAgain").addEventListener("click", function () { setViews("ready"); $("stageOk").textContent = "未开始"; $("btnStart").disabled = false; $("btnStop").disabled = true; $("btnPause").disabled = true; });
  }

  /* ---------- 初始化 ---------- */
  function init() {
    // 默认填入一组示例词，降低上手成本
    $("words").value = "茁壮\n蜿蜒 蜿蜒的山路\n辉煌\n捕捉\n天真烂漫";
    $("wordCount").textContent = parseWords().length;
    bind();
    // 舞台右上角工具栏（⛶ 舞台全屏 / ⚙ 隐藏设置），与随机叫号同构
    if (window.EduToolStageToolbar) window.EduToolStageToolbar.init({ stage: ".stage-panel", panelHost: ".workbench" });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
