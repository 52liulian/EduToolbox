/**
 * 积分板 · 组件版（mount 模块化）
 * ============================================================================
 * 兼容两种宿主：
 *   1. 站点 mount 模式 —— 注册 EduToolbox.tools["scoreboard"]，由 toolkit.js
 *      注入样式后调用 api.mount(root) 同一文档直挂。
 *   2. 独立打开（iframe / 直接访问本页）—— 自启到 <div id="app">。
 * 能力：队伍增删/重命名、快捷加减分(-1/+1/+2/+5)与自定义分值、实时排序、
 *       前三名金银铜高亮、重置/清空/全屏、localStorage 持久化。
 * ============================================================================
 */
(function (global) {
  "use strict";

  /* ---------- 工具界面模板 ---------- */
  var TEMPLATE =
      '<main class="container" id="scoreboardRoot">' +
        '<div class="stage-toolbar">' +
          '<button type="button" class="icon-btn" id="fullscreenBtn" title="全屏">⛶</button>' +
        '</div>' +
        '<section class="toolbar">' +
        '<div class="add-group">' +
          '<input type="text" id="teamName" placeholder="输入小组名称，如 飞虎队" maxlength="12" autocomplete="off">' +
          '<button type="button" class="btn btn-primary" id="addBtn">+ 添加小组</button>' +
        '</div>' +
        '<div class="bulk-actions">' +
          '<button type="button" class="btn btn-ghost" id="resetBtn" title="所有小组分数归零">↺ 重置分数</button>' +
          '<button type="button" class="btn btn-danger" id="clearBtn" title="删除所有小组">🗑 清空所有</button>' +
        '</div>' +
        '</section>' +
      '<section class="board" id="board" aria-label="积分榜"></section>' +
      '<div class="state state--empty" id="empty" hidden>' +
        '<div class="state-icon">🏆</div>' +
        '<div class="state-title">暂无小组</div>' +
        '<div class="state-desc">点击「+ 添加小组」开始</div>' +
      '</div>' +
    '</main>';

  var cleanup = null;
  var STORAGE_KEY = "scoreboardTeams";

  /**
   * 舞台全屏降级实现 —— 目标与共享模块完全一致（舞台元素自身），
   * 只在 window.EduToolStageToolbar 缺席时启用。
   *
   * 为什么必须有这条分支：本工具是全站仅有的两个 native 直挂工具之一。
   * toolkit.open() 的 native 分支只注入 tools/<slug>/<slug>.js，不会注入
   * index.html 里声明的 assets/js/tool-stage-toolbar.js（只有独立页走 <script>
   * 才会加载）。模块缺席时若什么都不做，⛶ 就成了死按钮 —— 这是课堂高频工具，
   * 绝不允许失去全屏能力。
   *
   * @param {Element} stageEl - 舞台元素（#scoreboardRoot）
   * @returns {Function} click 事件处理器
   */
  function stageFullscreenFallback(stageEl) {
    return function () {
      try {
        var doc = stageEl.ownerDocument || document;
        if (doc.fullscreenElement || doc.webkitFullscreenElement) {
          var exitFn = doc.exitFullscreen || doc.webkitExitFullscreen;
          if (!exitFn) return;
          var pe = exitFn.call(doc);
          if (pe && typeof pe.catch === "function") pe.catch(function () { /* 忽略：缺少手势 / 策略拒绝 */ });
          return;
        }
        var req = stageEl.requestFullscreen || stageEl.webkitRequestFullscreen;
        if (!req) return;
        var pr = req.call(stageEl);
        if (pr && typeof pr.catch === "function") pr.catch(function () { /* 忽略：同上 */ });
      } catch (e) { /* 全屏被拒时不抛错，避免污染控制台 */ }
    };
  }

  var api = {
    mount: function (root) {
      /* ---------- 渲染模板 ---------- */
      root.innerHTML = TEMPLATE;

      /* ---------- 作用域查询与 DOM 引用 ---------- */
      var $ = function (id) { return root.querySelector("#" + id); };
      var boardEl = $("board");
      var emptyEl = $("empty");
      var nameInput = $("teamName");
      var addBtn = $("addBtn");
      var resetBtn = $("resetBtn");
      var clearBtn = $("clearBtn");
      var stageEl = $("scoreboardRoot");
      var fsBtn = $("fullscreenBtn");

      /* ---------- 数据模型 ----------
       * teams: Array<{ id, name, score }>；持久化到 localStorage.scoreboardTeams
       */
      var _idSeed = Date.now();
      function nextId() { return ++_idSeed; }

      function loadTeams() {
        try {
          var raw = localStorage.getItem(STORAGE_KEY);
          var parsed = raw ? JSON.parse(raw) : null;
          if (Array.isArray(parsed)) return parsed;
        } catch (e) { /* JSON 损坏回退默认 */ }
        return [
          { id: nextId(), name: "第1组", score: 0 },
          { id: nextId(), name: "第2组", score: 0 },
          { id: nextId(), name: "第3组", score: 0 },
          { id: nextId(), name: "第4组", score: 0 }
        ];
      }
      var teams = loadTeams();

      function save() {
        try { localStorage.setItem(STORAGE_KEY, JSON.stringify(teams)); }
        catch (e) { /* 容量超限或隐私模式忽略 */ }
      }

      function rankTeams(list) {
        return list.slice().sort(function (a, b) { return b.score - a.score; });
      }

      function esc(str) {
        return String(str)
          .replace(/&/g, "&amp;")
          .replace(/</g, "&lt;")
          .replace(/>/g, "&gt;")
          .replace(/"/g, "&quot;");
      }

      /* ---------- 渲染积分榜 ---------- */
      function render() {
        var ranked = rankTeams(teams);
        if (ranked.length === 0) {
          boardEl.innerHTML = "";
          emptyEl.hidden = false;
          return;
        }
        emptyEl.hidden = true;
        boardEl.innerHTML = ranked.map(function (t, idx) {
          var rank = idx + 1;
          var rankClass = rank <= 3 ? "rank-" + rank : "";
          return (
            '<article class="card ' + rankClass + '" data-id="' + t.id + '">' +
              '<div class="card-head">' +
                '<input class="team-name" value="' + esc(t.name) + '" data-id="' + t.id + '" maxlength="12" aria-label="队伍名称">' +
                '<span class="rank-badge" title="第 ' + rank + ' 名">' + rank + '</span>' +
                '<button class="del-team" data-id="' + t.id + '" title="删除该队" aria-label="删除该队">×</button>' +
              '</div>' +
              '<div class="score-wrap">' +
                '<span class="score" data-id="' + t.id + '">' + t.score + '</span><span class="score-unit">分</span>' +
              '</div>' +
              '<div class="quick">' +
                '<button class="quick-btn minus" data-id="' + t.id + '" data-d="-1" title="扣 1 分">−1</button>' +
                '<button class="quick-btn plus" data-id="' + t.id + '" data-d="1" title="加 1 分">+1</button>' +
                '<button class="quick-btn plus" data-id="' + t.id + '" data-d="2" title="加 2 分">+2</button>' +
                '<button class="quick-btn plus" data-id="' + t.id + '" data-d="5" title="加 5 分">+5</button>' +
              '</div>' +
              '<div class="custom">' +
                '<input type="number" min="-999" max="999" placeholder="自定义分值" data-id="' + t.id + '" aria-label="自定义分值">' +
                '<button data-id="' + t.id + '" class="custom-add" title="加分">加分</button>' +
              '</div>' +
            '</article>'
          );
        }).join("");
      }

      /* ---------- 分数变更 / 弹跳动画 ---------- */
      function changeScore(id, delta) {
        var t = teams.find(function (x) { return x.id === id; });
        if (!t) return;
        t.score += delta;
        save();
        render();
        bumpScore(id);
      }
      function bumpScore(id) {
        var el = boardEl.querySelector('.score[data-id="' + id + '"]');
        if (!el) return;
        el.classList.add("bump");
        setTimeout(function () { el.classList.remove("bump"); }, 200);
      }

      /* ---------- 增删 / 重命名 / 批量操作 ---------- */
      function addTeam(name) {
        var trimmed = (name || "").trim();
        var finalName = trimmed || "第" + (teams.length + 1) + "组";
        teams.push({ id: nextId(), name: finalName, score: 0 });
        save();
        render();
      }
      function renameTeam(id, name) {
        var t = teams.find(function (x) { return x.id === id; });
        if (!t) return;
        var trimmed = (name || "").trim();
        if (trimmed) t.name = trimmed;
        save();
      }
      function removeTeam(id) {
        teams = teams.filter(function (x) { return x.id !== id; });
        save();
        render();
      }
      function resetScores() {
        teams.forEach(function (t) { t.score = 0; });
        save();
        render();
      }
      function clearAll() {
        teams = [];
        save();
        render();
      }
      /* ---------- 事件绑定 ---------- */
      addBtn.addEventListener("click", function () {
        addTeam(nameInput.value);
        nameInput.value = "";
        nameInput.focus();
      });
      nameInput.addEventListener("keydown", function (e) {
        if (e.key === "Enter") addBtn.click();
      });
      resetBtn.addEventListener("click", function () {
        if (teams.length === 0) return;
        if (confirm("确定将所有小组分数归零？")) resetScores();
      });
      clearBtn.addEventListener("click", function () {
        if (teams.length === 0) return;
        if (confirm("确定删除所有小组？此操作不可撤销。")) clearAll();
      });

      boardEl.addEventListener("click", function (e) {
        var btn = e.target.closest("button");
        if (!btn) return;
        var id = Number(btn.dataset.id);
        if (btn.classList.contains("quick-btn")) {
          changeScore(id, Number(btn.dataset.d));
        } else if (btn.classList.contains("del-team")) {
          removeTeam(id);
        } else if (btn.classList.contains("custom-add")) {
          var input = btn.previousElementSibling;
          var val = parseInt(input.value, 10);
          if (Number.isNaN(val)) { input.focus(); return; }
          changeScore(id, val);
          input.value = "";
        }
      });
      boardEl.addEventListener("keydown", function (e) {
        if (e.key !== "Enter") return;
        var input = e.target.closest(".custom input");
        if (!input) return;
        var btn = input.nextElementSibling;
        btn.click();
      });
      boardEl.addEventListener("change", function (e) {
        var nameEl = e.target.closest(".team-name");
        if (!nameEl) return;
        renameTeam(Number(nameEl.dataset.id), nameEl.value);
      });
      boardEl.addEventListener("keydown", function (e) {
        var nameEl = e.target.closest(".team-name");
        if (!nameEl) return;
        if (e.key === "Enter") nameEl.blur();
      });

      /* ---------- 初始化 ---------- */
      render();

      /* 舞台工具栏：⛶ 对 #scoreboardRoot 自身全屏（本工具无可隐藏设置栏，不接 ⚙）。
         放在 .board 之外，避免 render() 重写 boardEl.innerHTML 时把按钮连同监听一起冲掉。

         ⚠️ native 直挂的加载时序：站点入口 index.html 只引入 toolkit.js 与
         tool-adapter.js，并未全局引入 assets/js/tool-stage-toolbar.js；而
         toolkit.open() 的 native 分支也只注入 tools/<slug>/<slug>.js。因此「模块
         是否已就位」取决于加载顺序，不能假设 —— 这里做能力探测 + else 降级，
         保证任何路径下 ⛶ 都不会变成死按钮，也不会抛错。 */
      if (window.EduToolStageToolbar && stageEl) {
        window.EduToolStageToolbar.init({
          stage: "#scoreboardRoot",
          panelHost: null,
          hiddenClass: "setup-hidden"
        });
      } else if (fsBtn && stageEl) {
        fsBtn.addEventListener("click", stageFullscreenFallback(stageEl));
      }

      /* ---------- 卸载清理 ---------- */
      cleanup = function () { root.innerHTML = ""; };
    },

    unmount: function () {
      if (cleanup) { cleanup(); cleanup = null; }
    }
  };

  /* ---------- 注册为全局组件 ---------- */
  global.EduToolbox = global.EduToolbox || {};
  global.EduToolbox.tools = global.EduToolbox.tools || {};
  global.EduToolbox.tools["scoreboard"] = api;

  /* ---------- 独立打开（iframe / 直接访问）时自启 ----------
   * 仅当根节点携带 .tool-root（独立工具页专用），避免误挂入站点外壳的 #app
   */
  function boot() {
    var app = document.getElementById("app");
    if (app && app.classList.contains("tool-root")) api.mount(app);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})(window);
