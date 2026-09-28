/* ============================================================
 * EduToolbox · 组内角色分配 group-roles.js
 * 功能：随机为组员分配角色（一键全分配 / 逐个抽取）
 * 纯前端 IIFE，全部本地计算
 * ============================================================ */
(function () {
  "use strict";

  var $ = function (id) { return document.getElementById(id); };
  var esc = function (s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]; }); };

  /* ---------- 常用角色预设 ---------- */
  var PRESETS = {
    "通用分工": ["组长", "记录员", "计时员", "发言人", "检查员"],
    "科学实验": ["操作员", "观察员", "记录员", "汇报员", "材料员"],
    "阅读圈": ["主持人", "朗读者", "总结者", "提问者"],
    "手工合作": ["设计", "裁剪", "粘贴", "展示"]
  };

  var ICONS = ["👑", "✍️", "⏱️", "🎤", "🔍", "🧪", "📚", "🖌️", "📐", "💡", "🤝", "⭐"];

  /* ---------- 状态 ---------- */
  var state = {
    mode: "shuffle",      // shuffle | draw
    pairs: [],            // [{role, person, icon}]
    members: [],
    roles: [],
    drawIdx: 0,           // draw 模式进度
    useMembers: []        // 已用成员（不重复模式）
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

  /* ============ 解析 ============ */
  function parseLines(v) {
    return String(v || "").split("\n").map(function (s) { return s.trim(); }).filter(Boolean);
  }
  function loadLists() {
    state.roles = parseLines($("roles").value);
    state.members = parseLines($("members").value);
  }

  /* ============ 一键分配 ============ */
  function shuffleAssign() {
    loadLists();
    if (!state.roles.length) { toast("请先填写角色"); return; }
    if (!state.members.length) { toast("请先填写组员名单"); return; }
    var allow = $("allowRepeat").checked;
    // 洗牌成员
    var mem = state.members.slice();
    for (var i = mem.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var tmp = mem[i]; mem[i] = mem[j]; mem[j] = tmp;
    }
    var pairs = state.roles.map(function (r, k) {
      return { role: r, person: k < mem.length ? mem[k] : "", icon: ICONS[k % ICONS.length] };
    });
    if (allow) {
      pairs = state.roles.map(function (r, k) {
        return { role: r, person: mem[k % mem.length], icon: ICONS[k % ICONS.length] };
      });
    }
    state.pairs = pairs;
    showResult();
    $("stageOk").textContent = "已分配 " + pairs.length + " 个角色";
    renderCards();
  }

  /* ============ 逐个抽取 ============ */
  function startDraw() {
    loadLists();
    if (!state.roles.length) { toast("请先填写角色"); return; }
    if (!state.members.length) { toast("请先填写组员名单"); return; }
    // 打乱角色顺序
    var roles = state.roles.slice();
    for (var i = roles.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = roles[i]; roles[i] = roles[j]; roles[j] = t;
    }
    state.roles = roles;
    state.pairs = [];
    state.drawIdx = 0;
    state.useMembers = [];
    showResult();
    $("cardsGrid").innerHTML = "";
    $("drawArea").style.display = "block";
    $("btnDraw").style.display = "inline-flex";
    $("drawRoll").textContent = "?";
    $("drawTip").textContent = "点「抽取一个角色」开始逐一揭示";
    updateDrawRest();
    showResult();
    $("stageOk").textContent = "逐个抽取中";
  }

  function drawOne() {
    if (state.drawIdx >= state.roles.length) { toast("所有角色已抽完"); return; }
    var role = state.roles[state.drawIdx];
    state.drawIdx += 1;
    var allow = $("allowRepeat").checked;
    // 选人：不重复则从未用成员中随机选；否则随机
    var pick;
    if (!allow) {
      var available = state.members.filter(function (m) { return state.useMembers.indexOf(m) < 0; });
      if (!available.length) { available = state.members; } // 兜底
      pick = available[Math.floor(Math.random() * available.length)];
    } else {
      pick = state.members[Math.floor(Math.random() * state.members.length)];
    }
    if (!allow) state.useMembers.push(pick);
    var item = { role: role, person: pick, icon: ICONS[state.drawIdx % ICONS.length] };
    state.pairs.push(item);
    renderCards(true);
    // 滚动动画：快速切换然后定格
    var roll = $("drawRoll");
    var spins = 12;
    var n = 0;
    var iv = setInterval(function () {
      n++;
      if (n <= spins) {
        var r = state.members[Math.floor(Math.random() * state.members.length)];
        roll.textContent = r;
        roll.style.opacity = n % 2 ? "0.4" : "1";
      } else {
        clearInterval(iv);
        roll.textContent = pick;
        roll.style.opacity = "1";
        $("drawTip").textContent = "「" + role + "」抽中 " + pick + " 👏";
        updateDrawRest();
        if (state.drawIdx >= state.roles.length) {
          $("stageOk").textContent = "全部抽取完成";
          $("btnDraw").style.display = "none";
          $("drawTip").textContent = "全部角色已分配完成，可复制结果 🎉";
        }
      }
    }, 90);
  }

  function updateDrawRest() {
    var left = state.roles.length - state.drawIdx;
    $("drawRest").textContent = "剩余 " + left + " 个角色";
  }

  /* ============ 渲染 ============ */
  function showResult() {
    $("readyView").style.display = "none";
    $("resultView").style.display = "block";
  }

  function renderCards(pop) {
    var grid = $("cardsGrid");
    grid.innerHTML = state.pairs.map(function (p) {
      var personHtml = p.person
        ? '<div class="person">' + esc(p.person) + "</div>"
        : '<div class="person p-empty">— 未分配 —</div>';
      return '<div class="role-card' + (pop ? " pop" : "") + '"><div class="r-ico">' + p.icon + "</div><div class=\"r-name\">" + esc(p.role) + "</div>" + personHtml + "</div>";
    }).join("");
  }

  /* ============ 复制 ============ */
  function copyResult() {
    if (!state.pairs.length) { toast("还没有分配结果"); return; }
    var txt = state.pairs.map(function (p) { return p.role + "：" + (p.person || "未分配"); }).join("\n");
    navigator.clipboard?.writeText(txt).then(function () { toast("已复制到剪贴板"); }, function () {
      var ta = document.createElement("textarea");
      ta.value = txt; document.body.appendChild(ta); ta.select();
      try { document.execCommand("copy"); toast("已复制"); } catch (e) { toast("复制失败，请手动复制"); }
      document.body.removeChild(ta);
    });
  }

  /* ============ 重置 ============ */
  function resetAll() {
    state.pairs = []; state.drawIdx = 0; state.useMembers = [];
    $("cardsGrid").innerHTML = "";
    $("drawArea").style.display = "none";
    $("btnDraw").style.display = "none";
    $("readyView").style.display = "block";
    $("resultView").style.display = "none";
    $("stageOk").textContent = "未分配";
  }

  /* ============ 事件 ============ */
  function bind() {
    // 角色预设
    var pw = $("rolePresets");
    pw.innerHTML = Object.keys(PRESETS).map(function (k) { return '<button type="button" class="chip" data-v="' + esc(k) + '">' + esc(k) + "</button>"; }).join("");
    pw.querySelectorAll(".chip").forEach(function (chip) {
      chip.addEventListener("click", function () {
        $("roles").value = PRESETS[chip.dataset.v].join("\n");
        toast("已填入「" + chip.dataset.v + "」角色");
      });
    });

    // 模式切换
    $("modeChips").querySelectorAll(".chip").forEach(function (chip) {
      chip.addEventListener("click", function () {
        state.mode = chip.dataset.mode;
        $("modeChips").querySelectorAll(".chip").forEach(function (c) { c.classList.remove("active"); });
        chip.classList.add("active");
        // 切换模式时更新主按钮文案并复位
        $("btnShuffle").textContent = state.mode === "draw" ? "🎲 开始抽取" : "🔀 开始分配";
        $("btnDraw").style.display = "none";
        resetAll();
      });
    });

    // 主按钮：按模式分发（shuffle 一键分配 / draw 初始化逐抽）
    $("btnShuffle").addEventListener("click", function () {
      if (state.mode === "draw") { startDraw(); }
      else { resetAll(); shuffleAssign(); }
    });
    $("btnDraw").addEventListener("click", drawOne);
    $("btnReset").addEventListener("click", resetAll);
    $("btnCopy").addEventListener("click", copyResult);
  }

  /* ---------- 初始化 ---------- */
  function init() {
    if (window.EduToolStageToolbar) window.EduToolStageToolbar.init({ stage: ".stage-panel", panelHost: ".workbench", hiddenClass: "setup-hidden" });
    $("roles").value = PRESETS["通用分工"].join("\n");
    bind();
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
