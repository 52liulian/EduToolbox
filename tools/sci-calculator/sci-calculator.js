/* ============================================================
 * EduToolbox · 科学计算器 sci-calculator.js
 * 功能：表达式求值（词法 + 调度场 + 逆波兰，不使用 eval）
 *      三角/对数/幂/根号/阶乘，DEG-RAD 切换，ANS，历史记录
 * ============================================================ */
(function () {
  "use strict";

  var $ = function (id) { return document.getElementById(id); };
  var HIST_KEY = "edutoolbox.sci-calculator.history";

  var state = { expr: "", angle: "deg", ans: 0, history: [] };

  /* ============ 提示条 ============ */
  function toast(msg) {
    var t = $("toast");
    if (!t) return;
    t.textContent = msg;
    t.classList.add("show");
    clearTimeout(toast._t);
    toast._t = setTimeout(function () { t.classList.remove("show"); }, 1800);
  }

  /* ============ 词法分析 ============ */
  function normalize(src) {
    return String(src || "")
      .replace(/×/g, "*").replace(/÷/g, "/")
      .replace(/−/g, "-").replace(/–/g, "-")
      .replace(/π/g, "pi");
  }

  function tokenize(src) {
    var toks = [], i = 0;
    while (i < src.length) {
      var c = src.charAt(i);
      if (/\s/.test(c)) { i += 1; continue; }
      if (/[0-9.]/.test(c)) {
        var m = /^(?:\d+(?:\.\d*)?|\.\d+)(?:[eE][+-]?\d+)?/.exec(src.slice(i));
        if (!m) throw new Error("数字格式有误");
        toks.push({ t: "num", v: parseFloat(m[0]) });
        i += m[0].length;
        continue;
      }
      if (/[A-Za-z]/.test(c)) {
        var id = /^[A-Za-z]+/.exec(src.slice(i))[0];
        toks.push({ t: "id", v: id });
        i += id.length;
        continue;
      }
      if ("+-*/^()!%".indexOf(c) >= 0) { toks.push({ t: "op", v: c }); i += 1; continue; }
      throw new Error("无法识别的字符：" + c);
    }
    return toks;
  }

  /* ============ 函数与常量 ============ */
  var CONSTS = { pi: Math.PI, e: Math.E };

  function deg2rad(x) { return x * Math.PI / 180; }
  function rad2deg(x) { return x * 180 / Math.PI; }
  function factorial(n) {
    if (n < 0 || Math.floor(n) !== n) throw new Error("阶乘要求非负整数");
    if (n > 170) throw new Error("阶乘数值过大");
    var r = 1;
    for (var i = 2; i <= n; i++) r *= i;
    return r;
  }

  function callFn(name, x) {
    var deg = state.angle === "deg";
    switch (name) {
      case "sin": return Math.sin(deg ? deg2rad(x) : x);
      case "cos": return Math.cos(deg ? deg2rad(x) : x);
      case "tan": return Math.tan(deg ? deg2rad(x) : x);
      case "asin":
      case "arcsin": {
        var v = Math.asin(x);
        return deg ? rad2deg(v) : v;
      }
      case "acos":
      case "arccos": {
        var v2 = Math.acos(x);
        return deg ? rad2deg(v2) : v2;
      }
      case "atan":
      case "arctan": {
        var v3 = Math.atan(x);
        return deg ? rad2deg(v3) : v3;
      }
      case "ln": return Math.log(x);
      case "log": return Math.log(x) / Math.LN10;
      case "sqrt": return Math.sqrt(x);
      case "abs": return Math.abs(x);
      case "exp": return Math.exp(x);
      default: throw new Error("未知函数：" + name);
    }
  }
  var FN_NAMES = ["sin", "cos", "tan", "asin", "acos", "atan",
    "arcsin", "arccos", "arctan", "ln", "log", "sqrt", "abs", "exp"];

  /* ============ 调度场 → 逆波兰 ============ */
  var PREC = { "+": 1, "-": 1, "*": 2, "/": 2, "u-": 3, "^": 4, "!": 6, "%": 6 };
  var RIGHT_ASSOC = { "^": true, "u-": true };

  function toRPN(toks) {
    var out = [], ops = [], prev = null;
    for (var i = 0; i < toks.length; i++) {
      var tk = toks[i];
      if (tk.t === "num") { out.push({ k: "num", v: tk.v }); prev = "num"; continue; }
      if (tk.t === "id") {
        var lower = tk.v.toLowerCase();
        if (lower === "ans") { out.push({ k: "num", v: state.ans }); prev = "num"; continue; }
        if (Object.prototype.hasOwnProperty.call(CONSTS, lower)) {
          out.push({ k: "num", v: CONSTS[lower] });
          prev = "num";
          continue;
        }
        if (FN_NAMES.indexOf(lower) >= 0) { ops.push({ k: "fn", v: lower }); prev = "fn"; continue; }
        throw new Error("未知标识符：" + tk.v);
      }
      var v = tk.v;
      if (v === "(") { ops.push({ k: "op", v: "(" }); prev = "("; continue; }
      if (v === ")") {
        var found = false;
        while (ops.length) {
          var top = ops.pop();
          if (top.k === "op" && top.v === "(") { found = true; break; }
          out.push(top);
        }
        if (!found) throw new Error("括号不匹配");
        prev = "num";
        continue;
      }
      if (v === "-" && (prev === null || prev === "(" || prev === "op" || prev === "fn")) {
        ops.push({ k: "op", v: "u-" });
        prev = "op";
        continue;
      }
      if (v === "!" || v === "%") { ops.push({ k: "op", v: v }); prev = "num"; continue; }
      while (ops.length) {
        var t2 = ops[ops.length - 1];
        /* 函数调用优先级最高：遇到二元运算符时先把函数弹出，
           否则 2*sin(30) 会错算成 sin(2*30) */
        if (t2.k === "fn") { out.push(ops.pop()); continue; }
        if (t2.k !== "op" || t2.v === "(") break;
        var p1 = PREC[t2.v] || 0, p2 = PREC[v] || 0;
        if (p1 > p2 || (p1 === p2 && !RIGHT_ASSOC[v])) out.push(ops.pop());
        else break;
      }
      ops.push({ k: "op", v: v });
      prev = "op";
    }
    while (ops.length) {
      var rest = ops.pop();
      if (rest.k === "op" && (rest.v === "(" || rest.v === ")")) throw new Error("括号不匹配");
      out.push(rest);
    }
    return out;
  }

  /* ============ 求值 ============ */
  function evalRPN(rpn) {
    var st = [];
    for (var i = 0; i < rpn.length; i++) {
      var it = rpn[i];
      if (it.k === "num") { st.push(it.v); continue; }
      if (it.k === "fn") {
        if (!st.length) throw new Error("函数缺少参数");
        st.push(callFn(it.v, st.pop()));
        continue;
      }
      if (it.v === "u-") {
        if (!st.length) throw new Error("表达式不完整");
        st.push(-st.pop());
        continue;
      }
      if (it.v === "!") {
        if (!st.length) throw new Error("阶乘缺少参数");
        st.push(factorial(st.pop()));
        continue;
      }
      if (it.v === "%") {
        if (!st.length) throw new Error("百分号缺少参数");
        st.push(st.pop() / 100);
        continue;
      }
      if (st.length < 2) throw new Error("表达式不完整");
      var b = st.pop(), a = st.pop();
      if (it.v === "+") st.push(a + b);
      else if (it.v === "-") st.push(a - b);
      else if (it.v === "*") st.push(a * b);
      else if (it.v === "/") { if (b === 0) throw new Error("除数不能为 0"); st.push(a / b); }
      else if (it.v === "^") st.push(Math.pow(a, b));
      else throw new Error("未知运算符：" + it.v);
    }
    if (st.length !== 1) throw new Error("表达式不完整");
    var r = st[0];
    if (typeof r !== "number" || isNaN(r) || !isFinite(r)) throw new Error("结果无效");
    return r;
  }

  function balance(src) {
    var s = normalize(src), open = 0;
    for (var i = 0; i < s.length; i++) {
      if (s.charAt(i) === "(") open += 1;
      else if (s.charAt(i) === ")") open -= 1;
    }
    while (open > 0) { s += ")"; open -= 1; }
    return s;
  }

  function evaluate(src) {
    var text = balance(src);
    if (!text.trim()) throw new Error("");
    return evalRPN(toRPN(tokenize(text)));
  }

  /* ============ 格式化 ============ */
  function fmt(v) {
    if (typeof v !== "number" || isNaN(v) || !isFinite(v)) return "错误";
    if (Math.abs(v) >= 1e15 || (Math.abs(v) < 1e-9 && v !== 0)) {
      return trimZeros(v.toExponential(8));
    }
    if (Math.abs(v - Math.round(v)) < 1e-12) return String(Math.round(v));
    var s = v.toPrecision(12);
    return trimZeros(parseFloat(s).toString());
  }
  function trimZeros(s) {
    if (s.indexOf("e") >= 0) return s.replace(/\.?0+e/, "e");
    if (s.indexOf(".") < 0) return s;
    return s.replace(/0+$/, "").replace(/\.$/, "");
  }

  /* ============ 显示 ============ */
  function displayExpr() {
    $("expr").innerHTML = state.expr ? escapeHtml(state.expr).replace(/&nbsp;/g, " ") : "&nbsp;";
  }
  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c];
    });
  }

  function refresh() {
    displayExpr();
    var err = $("errMsg");
    if (!state.expr.trim()) {
      $("result").textContent = fmt(state.ans);
      err.hidden = true;
      return;
    }
    try {
      var v = evaluate(state.expr);
      $("result").textContent = fmt(v);
      err.hidden = true;
    } catch (e) {
      var m = e && e.message ? e.message : "";
      /* 边输入边求值时，"5+" 这类未完成表达式不报错，避免误扰 */
      if (!m || m.indexOf("不完整") >= 0 || m.indexOf("缺少") >= 0) err.hidden = true;
      else { err.hidden = false; err.textContent = m; }
    }
  }

  function insert(text) {
    if (text === "pi") text = "π";
    if (text === "ANS") text = fmt(state.ans);
    if (text === "neg") { negateLast(); return; }
    state.expr += text;
    refresh();
  }

  function negateLast() {
    var m = /(-?\d+(?:\.\d+)?)$/.exec(state.expr);
    if (m) {
      var v = parseFloat(m[1]);
      state.expr = state.expr.slice(0, m.index) + (v === 0 ? "0" : String(-v));
    } else {
      state.expr += "-";
    }
    refresh();
  }

  /* 倒数：把当前表达式整体取倒数，为空时对上一结果取倒数 */
  function reciprocal() {
    var base = state.expr.trim() ? state.expr : fmt(state.ans);
    state.expr = "1/(" + base + ")";
    refresh();
  }

  function backspace() {
    state.expr = state.expr.slice(0, -1);
    refresh();
  }

  function clearAll() {
    state.expr = "";
    refresh();
  }

  function equals() {
    if (!state.expr.trim()) return;
    var v;
    try {
      v = evaluate(state.expr);
    } catch (e) {
      toast(e && e.message ? e.message : "表达式有误");
      return;
    }
    var exprText = state.expr;
    state.ans = v;
    state.expr = "";
    $("ansTag").textContent = "ANS " + fmt(v);
    pushHistory(exprText, v);
    $("result").textContent = fmt(v);
    refresh();
  }

  /* ============ 历史 ============ */
  function pushHistory(expr, res) {
    state.history.unshift({ expr: expr, res: fmt(res) });
    if (state.history.length > 20) state.history.length = 20;
    try { localStorage.setItem(HIST_KEY, JSON.stringify(state.history)); } catch (e) { /* 忽略 */ }
    renderHistory();
  }

  function renderHistory() {
    var ul = $("history");
    ul.innerHTML = "";
    if (!state.history.length) {
      var li = document.createElement("li");
      li.className = "empty";
      li.textContent = "暂无计算记录";
      ul.appendChild(li);
      return;
    }
    for (var i = 0; i < state.history.length; i++) {
      var h = state.history[i];
      var li = document.createElement("li");
      var e1 = document.createElement("span");
      e1.className = "hist-expr";
      e1.textContent = h.expr + " =";
      var e2 = document.createElement("span");
      e2.className = "hist-res";
      e2.textContent = h.res;
      li.appendChild(e1);
      li.appendChild(e2);
      (function (val) {
        li.addEventListener("click", function () { state.expr += val; refresh(); });
      })(h.res);
      ul.appendChild(li);
    }
  }

  /* ============ 事件 ============ */
  function bind() {
    document.querySelectorAll("[data-ins]").forEach(function (btn) {
      btn.addEventListener("click", function () { insert(btn.getAttribute("data-ins")); });
    });
    document.querySelectorAll("[data-act]").forEach(function (btn) {
      var act = btn.getAttribute("data-act");
      btn.addEventListener("click", function () {
        if (act === "clear") clearAll();
        else if (act === "back") backspace();
        else if (act === "eq") equals();
        else if (act === "rec") reciprocal();
      });
    });

    $("angleChips").querySelectorAll(".chip").forEach(function (c) {
      c.addEventListener("click", function () {
        state.angle = c.getAttribute("data-angle") || "deg";
        $("angleChips").querySelectorAll(".chip").forEach(function (x) { x.classList.remove("active"); });
        c.classList.add("active");
        refresh();
      });
    });

    $("btnClearHist").addEventListener("click", function () {
      state.history = [];
      try { localStorage.setItem(HIST_KEY, "[]"); } catch (e) { /* 忽略 */ }
      renderHistory();
    });

    document.addEventListener("keydown", function (e) {
      var k = e.key;
      if (k === "Enter" || k === "=") { e.preventDefault(); equals(); return; }
      if (k === "Backspace") { e.preventDefault(); backspace(); return; }
      if (k === "Escape") { e.preventDefault(); clearAll(); return; }
      if (/^[0-9.+\-*/^()%]$/.test(k)) { e.preventDefault(); insert(k); return; }
      if (k === "p" || k === "P") { e.preventDefault(); insert("pi"); }
    });
  }

  /* ---------- 初始化 ---------- */
  function init() {
    try {
      var h = localStorage.getItem(HIST_KEY);
      if (h) state.history = JSON.parse(h) || [];
    } catch (e) { /* 忽略 */ }
    /* 舞台右上角工具栏（⛶ 舞台全屏 / ⚙ 隐藏设置），与随机叫号同构 */
    if (window.EduToolStageToolbar) {
      window.EduToolStageToolbar.init({ stage: ".calc-panel", panelHost: ".workbench", hiddenClass: "setup-hidden" });
    }
    bind();
    renderHistory();
    refresh();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
