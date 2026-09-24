/**
 * 函数绘图工具 (function-graph.js)
 * 功能：纯 Canvas 绘制坐标系与函数图像；自研安全表达式解析（词法分析 + 调度场算法），
 *       支持多函数叠加、滚轮缩放、拖拽平移、X/Y 范围调节、采样点数、线宽、显示选项、
 *       绘制动画、关键点标注、全屏模式、导出 PNG。禁止使用 eval/Function。
 * 视觉参考：https://classtool.cn/function-graph/
 */
(function () {
  "use strict";

  /* ============================================================
   * 一、安全表达式解析器
   * ============================================================ */

  /** 单参函数表：名称 -> 求值函数 */
  var UNARY_FUNCS = {
    sin: Math.sin, cos: Math.cos, tan: Math.tan,
    asin: Math.asin, acos: Math.acos, atan: Math.atan,
    sinh: Math.sinh, cosh: Math.cosh, tanh: Math.tanh,
    ln: Math.log,
    log2: function (v) { return Math.log(v) / Math.LN2; },
    lg: function (v) { return Math.log(v) / Math.LN10; }, // log10
    log: function (v) { return Math.log(v) / Math.LN10; }, // 通用对数
    sqrt: Math.sqrt, cbrt: Math.cbrt, abs: Math.abs, exp: Math.exp,
    floor: Math.floor, ceil: Math.ceil, round: Math.round,
    sign: Math.sign, trunc: Math.trunc
  };
  /** 多参函数表：名称 -> 求值函数 */
  var MULTI_FUNCS = {
    max: Math.max, min: Math.min, pow: Math.pow,
    atan2: Math.atan2, hypot: function (a, b) { return Math.hypot(a, b); }
  };
  /** 运算符优先级：二元 + - * / ^，一元负号记为 ~ */
  var PRECEDENCE = { "+": 1, "-": 1, "*": 2, "/": 2, "~": 3, "^": 4 };

  /**
   * 词法分析：把表达式字符串切分为 token 数组
   * 入参：expr 表达式字符串
   * 返回值：Array<{t:string, v:*}>，t 为 num/name/op
   * 异常：遇到无法识别的字符抛 Error
   */
  function tokenize(expr) {
    var tokens = [];
    var i = 0;
    var n = expr.length;
    while (i < n) {
      var ch = expr.charAt(i);
      if (ch === " " || ch === "\t") { i++; continue; }
      // 数字：支持 12、12.34、.5
      if ((ch >= "0" && ch <= "9") || ch === ".") {
        var m = /^[0-9]+(\.[0-9]+)?|^\.[0-9]+/.exec(expr.slice(i));
        var raw = m[0];
        if (raw === ".") throw new Error("数字格式错误（孤立的小数点）");
        tokens.push({ t: "num", v: parseFloat(raw) });
        i += raw.length;
        continue;
      }
      // 标识符（函数名、常量、变量；允许字母后带数字，如 log2）
      if (/[A-Za-z_]/.test(ch)) {
        var name = /^[A-Za-z_][A-Za-z0-9_]*/.exec(expr.slice(i))[0];
        tokens.push({ t: "name", v: name });
        i += name.length;
        continue;
      }
      // 运算符与括号
      if ("+-*/^(),".indexOf(ch) !== -1) {
        tokens.push({ t: "op", v: ch });
        i++;
        continue;
      }
      throw new Error("无法识别的字符：\"" + ch + "\"");
    }
    return tokens;
  }

  /**
   * 调度场算法：token 数组转逆波兰表达式（RPN）
   * 入参：tokens tokenize 的结果；varName 当前变量名（x 或 t）
   * 返回值：Array，RPN 指令序列（数字/名称字符串/运算符/{fn,arity}）
   * 异常：括号不匹配、运算符位置错误等抛 Error
   */
  function toRPN(tokens, varName) {
    var output = [];
    var stack = [];
    var expectOperand = true; // 下一个 token 是否应当是操作数（用于识别一元负号）
    var k;

    /**
     * 把栈顶运算符按优先级弹出到输出队列
     * 入参：currentOp 当前运算符（用于比较优先级）
     * 返回值：无
     */
    function popOps(currentOp) {
      while (stack.length) {
        var top = stack[stack.length - 1];
        if (typeof top === "string" && top !== "(") {
          // 特殊约定：一元负号与幂互不抢占
          if ((currentOp === "^" && top === "~") || (currentOp === "~" && top === "^")) break;
          var topPrec = PRECEDENCE[top];
          var curPrec = PRECEDENCE[currentOp];
          var rightAssoc = currentOp === "^" || currentOp === "~";
          if ((rightAssoc && topPrec > curPrec) || (!rightAssoc && topPrec >= curPrec)) {
            output.push(stack.pop());
          } else {
            break;
          }
        } else {
          break;
        }
      }
    }

    for (k = 0; k < tokens.length; k++) {
      var tok = tokens[k];
      var next = tokens[k + 1];

      if (tok.t === "num") {
        if (!expectOperand) { popOps("*"); stack.push("*"); }
        output.push(tok.v);
        expectOperand = false;
      } else if (tok.t === "name") {
        var nm = tok.v;
        var isFunc = Object.prototype.hasOwnProperty.call(UNARY_FUNCS, nm) ||
                     Object.prototype.hasOwnProperty.call(MULTI_FUNCS, nm);
        if (isFunc) {
          if (!expectOperand) { popOps("*"); stack.push("*"); }
          if (!next || next.t !== "op" || next.v !== "(") {
            throw new Error("函数 \"" + nm + "\" 后面需要一对小括号，例如 " + nm + "(" + varName + ")");
          }
          stack.push({ fn: nm, arity: 1 });
          expectOperand = true;
        } else if (nm === varName) {
          if (!expectOperand) { popOps("*"); stack.push("*"); }
          output.push(varName);
          expectOperand = false;
        } else if (nm === "pi" || nm === "e") {
          if (!expectOperand) { popOps("*"); stack.push("*"); }
          output.push(nm);
          expectOperand = false;
        } else {
          throw new Error("未知标识符：\"" + nm + "\"（可用变量只有 " + varName + "，常量 pi、e）");
        }
      } else if (tok.v === "(") {
        if (!expectOperand) { popOps("*"); stack.push("*"); }
        stack.push("(");
        expectOperand = true;
      } else if (tok.v === ")") {
        if (expectOperand) throw new Error("括号内缺少表达式");
        while (stack.length && stack[stack.length - 1] !== "(") {
          output.push(stack.pop());
        }
        if (!stack.length) throw new Error("括号不匹配：多余的右括号 )");
        stack.pop(); // 丢弃 "("
        if (stack.length && typeof stack[stack.length - 1] === "object") {
          output.push(stack.pop()); // 函数标记出队（带参数个数）
        }
        expectOperand = false;
      } else if (tok.v === ",") {
        while (stack.length && stack[stack.length - 1] !== "(") {
          output.push(stack.pop());
        }
        if (!stack.length) throw new Error("逗号位置错误或括号不匹配");
        var marker = stack[stack.length - 2];
        if (!marker || typeof marker !== "object") {
          throw new Error("逗号只能出现在 max/min/pow 等函数的参数之间");
        }
        marker.arity++;
        expectOperand = true;
      } else {
        // 二元 / 一元运算符
        var op = tok.v;
        if (op === "-" && expectOperand) {
          popOps("~");
          stack.push("~");
          expectOperand = true;
        } else if (op === "+" && expectOperand) {
          continue; // 一元正号忽略
        } else {
          if (expectOperand) throw new Error("运算符 \"" + op + "\" 前缺少操作数");
          if (PRECEDENCE[op] === undefined) throw new Error("不支持的运算符：" + op);
          popOps(op);
          stack.push(op);
          expectOperand = true;
        }
      }
    }

    if (expectOperand) throw new Error("表达式不完整：末尾缺少操作数");
    while (stack.length) {
      var rest = stack.pop();
      if (rest === "(" || typeof rest === "object") {
        throw new Error("括号不匹配：缺少右括号 )");
      }
      output.push(rest);
    }
    return output;
  }

  /**
   * 编译表达式为求值函数
   * 入参：expr 用户输入的表达式字符串；varName 变量名（默认 x）
   * 返回值：function(x):number，输入 x 返回函数值；非法时抛 Error
   */
  function compile(expr, varName) {
    varName = varName || "x";
    var text = String(expr || "").trim();
    if (text === "") throw new Error("表达式为空");
    var rpn = toRPN(tokenize(text), varName);
    return function evaluator(v) {
      var st = [];
      for (var i = 0; i < rpn.length; i++) {
        var t = rpn[i];
        if (typeof t === "number") {
          st.push(t);
        } else if (t === varName) {
          st.push(v);
        } else if (t === "pi") {
          st.push(Math.PI);
        } else if (t === "e") {
          st.push(Math.E);
        } else if (t === "~") {
          st.push(-st.pop());
        } else if (t === "+") {
          var b1 = st.pop(), a1 = st.pop(); st.push(a1 + b1);
        } else if (t === "-") {
          var b2 = st.pop(), a2 = st.pop(); st.push(a2 - b2);
        } else if (t === "*") {
          var b3 = st.pop(), a3 = st.pop(); st.push(a3 * b3);
        } else if (t === "/") {
          var b4 = st.pop(), a4 = st.pop(); st.push(a4 / b4);
        } else if (t === "^") {
          var b5 = st.pop(), a5 = st.pop(); st.push(Math.pow(a5, b5));
        } else if (typeof t === "object" && t.fn) {
          var args = [];
          for (var ar = 0; ar < t.arity; ar++) args.unshift(st.pop());
          if (UNARY_FUNCS[t.fn]) {
            if (t.arity !== 1) throw new Error("函数 " + t.fn + " 只接受 1 个参数");
            st.push(UNARY_FUNCS[t.fn](args[0]));
          } else {
            if (t.arity < 2) throw new Error("函数 " + t.fn + " 至少需要 2 个参数");
            st.push(MULTI_FUNCS[t.fn].apply(null, args));
          }
        } else {
          throw new Error("求值失败：未知指令 " + String(t));
        }
      }
      if (st.length !== 1) throw new Error("表达式无法正确求值");
      var val = st[0];
      if (typeof val !== "number" || Number.isNaN(val)) throw new Error("计算结果不是有效数字");
      return val;
    };
  }

  /* ============================================================
   * 二、画布与视图状态
   * ============================================================ */

  var canvas = document.getElementById("graphCanvas");
  var ctx = canvas.getContext("2d");
  var canvasWrap = document.getElementById("canvasWrap");
  var dpr = Math.max(1, window.devicePixelRatio || 1);
  var cssW = 0, cssH = 0;

  /** 视图状态：中心点数学坐标 + 每单位像素数 */
  var view = { cx: 0, cy: 0, scale: 40 };

  /** 函数行数据 */
  var PALETTE = ["#ef4444", "#2563eb", "#16a34a", "#9333ea", "#ea580c"];
  var funcs = [];
  var MAX_FUNCS = 5;
  var rafPending = false;
  var animFrame = null;       // 当前动画帧 id
  var animStartTime = 0;     // 动画起始时间戳

  /** 显示选项（与 UI checkbox 双向绑定） */
  var opts = {
    grid: true, axis: true, keyPoints: false, fill: false, anim: false
  };

  /* ============================================================
   * 三、绘图辅助
   * ============================================================ */

  /**
   * 按 1/2/5×10^n 选取“好看”的刻度步长
   * 入参：raw 期望的步长（数学单位）
   * 返回值：number 实际使用的步长
   */
  function niceStep(raw) {
    if (!(raw > 0) || !isFinite(raw)) return 1;
    var exp = Math.floor(Math.log10(raw));
    var base = raw / Math.pow(10, exp);
    var stepBase = base < 1.5 ? 1 : base < 3 ? 2 : base < 7 ? 5 : 10;
    return stepBase * Math.pow(10, exp);
  }

  /**
   * 格式化刻度数字，规避浮点尾差
   * 入参：v 刻度数值
   * 返回值：string 显示文本
   */
  function formatTick(v) {
    if (v === 0) return "0";
    var av = Math.abs(v);
    if (av >= 1e5 || av < 1e-4) return v.toExponential(1);
    return String(parseFloat(v.toFixed(6)));
  }

  /** 适配画布物理像素（高 DPI）与 CSS 尺寸 */
  function resizeCanvas() {
    var rect = canvas.getBoundingClientRect();
    cssW = Math.max(50, rect.width);
    cssH = Math.max(50, rect.height);
    canvas.width = Math.round(cssW * dpr);
    canvas.height = Math.round(cssH * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  /** 数学坐标 -> 屏幕 x 像素 */
  function toScreenX(x) { return cssW / 2 + (x - view.cx) * view.scale; }
  /** 数学坐标 -> 屏幕 y 像素（y 轴向上为正） */
  function toScreenY(y) { return cssH / 2 - (y - view.cy) * view.scale; }
  /** 屏幕 x 像素 -> 数学坐标 */
  function toMathX(px) { return (px - cssW / 2) / view.scale + view.cx; }
  /** 屏幕 y 像素 -> 数学坐标 */
  function toMathY(py) { return view.cy - (py - cssH / 2) / view.scale; }

  /**
   * 绘制网格、坐标轴、刻度
   * 入参：无
   * 返回值：无
   */
  function drawGrid() {
    var xmin = toMathX(0), xmax = toMathX(cssW);
    var ymin = toMathY(cssH), ymax = toMathY(0);
    var step = niceStep(70 / view.scale);

    // 网格线（仅在开启网格时绘制）
    if (opts.grid) {
      ctx.lineWidth = 1;
      ctx.font = "11px -apple-system, 'Segoe UI', sans-serif";
      var gx0 = Math.ceil(xmin / step) * step;
      for (var gx = gx0; gx <= xmax + step * 1e-6; gx += step) {
        var sx = toScreenX(gx);
        ctx.strokeStyle = Math.abs(gx) < step * 1e-6 ? "#d7dde6" : "#eef2f7";
        ctx.beginPath();
        ctx.moveTo(sx, 0);
        ctx.lineTo(sx, cssH);
        ctx.stroke();
      }
      var gy0 = Math.ceil(ymin / step) * step;
      for (var gy = gy0; gy <= ymax + step * 1e-6; gy += step) {
        var sy = toScreenY(gy);
        ctx.strokeStyle = Math.abs(gy) < step * 1e-6 ? "#d7dde6" : "#eef2f7";
        ctx.beginPath();
        ctx.moveTo(0, sy);
        ctx.lineTo(cssW, sy);
        ctx.stroke();
      }
    }

    // 坐标轴（仅在开启坐标轴时绘制）
    if (opts.axis) {
      var axisX = Math.min(Math.max(toScreenX(0), 0), cssW);
      var axisY = Math.min(Math.max(toScreenY(0), 0), cssH);

      ctx.strokeStyle = "#374151";
      ctx.lineWidth = 1.6;
      ctx.beginPath(); // x 轴
      ctx.moveTo(0, axisY);
      ctx.lineTo(cssW, axisY);
      ctx.stroke();
      ctx.beginPath(); // y 轴
      ctx.moveTo(axisX, 0);
      ctx.lineTo(axisX, cssH);
      ctx.stroke();

      // 轴端箭头
      ctx.fillStyle = "#374151";
      ctx.beginPath();
      ctx.moveTo(cssW - 1, axisY);
      ctx.lineTo(cssW - 9, axisY - 4.5);
      ctx.lineTo(cssW - 9, axisY + 4.5);
      ctx.closePath();
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(axisX, 1);
      ctx.lineTo(axisX - 4.5, 9);
      ctx.lineTo(axisX + 4.5, 9);
      ctx.closePath();
      ctx.fill();

      // 刻度数字
      ctx.fillStyle = "#6b7280";
      ctx.font = "11px -apple-system, 'Segoe UI', sans-serif";
      var labelBelow = axisY < cssH - 18;
      var tx0 = Math.ceil(xmin / step) * step;
      for (var tx = tx0; tx <= xmax + step * 1e-6; tx += step) {
        if (Math.abs(tx) < step * 1e-6) continue;
        var lx = toScreenX(tx);
        ctx.beginPath();
        ctx.strokeStyle = "#9ca3af";
        ctx.moveTo(lx, axisY - 3);
        ctx.lineTo(lx, axisY + 3);
        ctx.stroke();
        ctx.textAlign = "center";
        ctx.textBaseline = labelBelow ? "top" : "bottom";
        ctx.fillText(formatTick(tx), lx, labelBelow ? axisY + 5 : axisY - 5);
      }
      var labelsOnRight = axisX > cssW - 46;
      var ty0 = Math.ceil(ymin / step) * step;
      for (var ty = ty0; ty <= ymax + step * 1e-6; ty += step) {
        if (Math.abs(ty) < step * 1e-6) continue;
        var ly = toScreenY(ty);
        ctx.beginPath();
        ctx.strokeStyle = "#9ca3af";
        ctx.moveTo(axisX - 3, ly);
        ctx.lineTo(axisX + 3, ly);
        ctx.stroke();
        ctx.textAlign = labelsOnRight ? "left" : "right";
        ctx.textBaseline = "middle";
        ctx.fillText(formatTick(ty), labelsOnRight ? axisX + 7 : axisX - 7, ly);
      }

      // 原点十字与标注
      if (axisX > 0 && axisX < cssW && axisY > 0 && axisY < cssH) {
        ctx.strokeStyle = "#374151";
        ctx.lineWidth = 1.4;
        ctx.beginPath();
        ctx.moveTo(axisX - 5, axisY);
        ctx.lineTo(axisX + 5, axisY);
        ctx.moveTo(axisX, axisY - 5);
        ctx.lineTo(axisX, axisY + 5);
        ctx.stroke();
        ctx.fillStyle = "#6b7280";
        ctx.textAlign = "right";
        ctx.textBaseline = "top";
        ctx.fillText("O", axisX - 6, axisY + 4);
      }
      ctx.textAlign = "left";
      ctx.textBaseline = "alphabetic";
    }
  }

  /**
   * 计算单条函数在当前 X 范围内的关键点（零点、y 截距、可见极值）
   * 入参：f 函数行数据；xmin/xmax 当前可见 X 范围；samples 采样数
   * 返回值：Array<{x, y, type}>
   */
  function findKeyPoints(f, xmin, xmax, samples) {
    if (!f.evaluator) return [];
    var pts = [];
    var step = (xmax - xmin) / samples;
    var prevX = xmin, prevY = null;
    try { prevY = f.evaluator(xmin); } catch (e) { prevY = NaN; }
    var lastWasUp = null; // 用于判断极值拐点

    for (var i = 1; i <= samples; i++) {
      var x = xmin + i * step;
      var y;
      try { y = f.evaluator(x); } catch (e) { y = NaN; }
      if (isFinite(prevY) && isFinite(y)) {
        // 零点：符号反转
        if (prevY === 0) pts.push({ x: prevX, y: 0, type: "零点" });
        else if (prevY * y < 0) {
          // 线性插值估计零点
          var t = -prevY / (y - prevY);
          pts.push({ x: prevX + t * step, y: 0, type: "零点" });
        }
        // 极值：导数符号反转（用差分近似）
        var diff = y - prevY;
        var isUp = diff > 0;
        if (lastWasUp !== null && isUp !== lastWasUp && Math.abs(diff) > 1e-9) {
          pts.push({ x: prevX, y: prevY, type: isUp ? "极小值" : "极大值" });
        }
        lastWasUp = isUp;
      }
      prevX = x;
      prevY = y;
    }

    // y 轴截距
    try {
      var y0 = f.evaluator(0);
      if (isFinite(y0) && y0 !== 0) pts.push({ x: 0, y: y0, type: "y 截距" });
    } catch (e) { /* 忽略 */ }

    // 去重（同一关键点附近归并）+ 限制数量
    var unique = [];
    pts.forEach(function (p) {
      var dup = unique.some(function (q) { return Math.abs(p.x - q.x) < step * 2 && Math.abs(p.y - q.y) < step * 2; });
      if (!dup) unique.push(p);
    });
    return unique.slice(0, 12);
  }

  /**
   * 绘制单条函数图像（逐像素采样，跳变处断开视为渐近线）
   * 入参：f 函数行数据；progress 动画进度 0~1（1 为完整）
   * 返回值：无
   */
  function drawFunction(f, progress) {
    if (!f.enabled || f.error || !f.evaluator) return;
    progress = typeof progress === "number" ? Math.max(0, Math.min(1, progress)) : 1;
    var endPx = Math.floor(cssW * progress);
    var jumpThreshold = (toMathY(0) - toMathY(cssH)) * 0.5;
    var lw = parseFloat(document.getElementById("lineWidth").value) || 2;
    ctx.strokeStyle = f.color;
    ctx.lineWidth = Math.max(0.5, lw);
    ctx.lineJoin = "round";
    ctx.lineCap = "round";

    // 填充曲线下方区域（可选）
    if (opts.fill) {
      var axisY = Math.min(Math.max(toScreenY(0), 0), cssH);
      ctx.beginPath();
      var started = false;
      for (var px = 0; px <= endPx; px++) {
        var x = toMathX(px);
        var y;
        try { y = f.evaluator(x); } catch (e) { y = NaN; }
        if (!isFinite(y)) { started = false; continue; }
        var sy = toScreenY(y);
        if (!started) {
          ctx.moveTo(px, axisY);
          ctx.lineTo(px, sy);
          started = true;
        } else {
          ctx.lineTo(px, sy);
        }
      }
      if (started) ctx.lineTo(endPx, axisY);
      ctx.closePath();
      ctx.fillStyle = hexToRgba(f.color, 0.16);
      ctx.fill();
    }

    // 折线
    ctx.beginPath();
    var pen = false;
    var prevY = 0;
    for (var qx = 0; qx <= endPx; qx++) {
      var xv = toMathX(qx);
      var yv;
      try { yv = f.evaluator(xv); } catch (e) { yv = NaN; }
      if (typeof yv !== "number" || !isFinite(yv)) {
        pen = false;
        continue;
      }
      var syv = toScreenY(yv);
      if (!pen) {
        ctx.moveTo(qx, syv);
        pen = true;
      } else if (Math.abs(yv - prevY) > jumpThreshold) {
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(qx, syv);
      } else {
        ctx.lineTo(qx, syv);
      }
      prevY = yv;
    }
    ctx.stroke();

    // 关键点标注（仅在完整绘制后展示）
    if (opts.keyPoints && progress >= 1) {
      var samples = Math.min(800, Math.max(200, Math.floor(cssW)));
      var kps = findKeyPoints(f, toMathX(0), toMathX(cssW), samples);
      ctx.fillStyle = f.color;
      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = 1.6;
      kps.forEach(function (p) {
        var sx = toScreenX(p.x);
        var sy = toScreenY(p.y);
        if (sx < 0 || sx > cssW || sy < 0 || sy > cssH) return;
        ctx.beginPath();
        ctx.arc(sx, sy, 3.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
      });
    }
  }

  /**
   * 将 #rrggbb 颜色转为带 alpha 的 rgba 字符串
   * 入参：hex 颜色字符串；alpha 透明度 0~1
   * 返回值：string rgba 字符串
   */
  function hexToRgba(hex, alpha) {
    var m = /^#([0-9a-f]{6})$/i.exec(hex);
    if (!m) return "rgba(127,127,127," + alpha + ")";
    var n = parseInt(m[1], 16);
    return "rgba(" + ((n >> 16) & 255) + "," + ((n >> 8) & 255) + "," + (n & 255) + "," + alpha + ")";
  }

  /** 更新视图范围文字 */
  function updateRangeInfo() {
    var info = document.getElementById("rangeInfo");
    var xs = [toMathX(0), toMathX(cssW)];
    var ys = [toMathY(cssH), toMathY(0)];
    function r(v) { return parseFloat(v.toFixed(3)); }
    info.textContent =
      "x：[" + r(Math.min.apply(null, xs)) + ", " + r(Math.max.apply(null, xs)) + "]　" +
      "y：[" + r(Math.min.apply(null, ys)) + ", " + r(Math.max.apply(null, ys)) + "]";
  }

  /** 同步范围输入框到当前视图状态 */
  function syncRangeInputs() {
    var xmin = toMathX(0);
    var xmax = toMathX(cssW);
    var ymin = toMathY(cssH);
    var ymax = toMathY(0);
    document.getElementById("xMin").value = parseFloat(xmin.toFixed(4));
    document.getElementById("xMax").value = parseFloat(xmax.toFixed(4));
    if (!document.getElementById("yAuto").checked) {
      document.getElementById("yMin").value = parseFloat(ymin.toFixed(4));
      document.getElementById("yMax").value = parseFloat(ymax.toFixed(4));
    }
  }

  /** 整体重绘（rAF 合并高频事件） */
  function redraw() {
    if (rafPending) return;
    rafPending = true;
    requestAnimationFrame(function () {
      rafPending = false;
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, cssW, cssH);
      drawGrid();
      for (var i = 0; i < funcs.length; i++) drawFunction(funcs[i], 1);
      updateRangeInfo();
    });
  }

  /**
   * 以指定屏幕点为锚点缩放
   * 入参：px/py 锚点像素；factor 缩放倍数（>1 放大）
   * 返回值：无
   */
  function zoomAt(px, py, factor) {
    var ax = toMathX(px);
    var ay = toMathY(py);
    view.scale *= factor;
    view.scale = Math.min(1e7, Math.max(1e-5, view.scale));
    view.cx = ax - (px - cssW / 2) / view.scale;
    view.cy = ay + (py - cssH / 2) / view.scale;
    syncRangeInputs();
    redraw();
  }

  /**
   * 根据 Y 自动计算模式重新调整 Y 范围
   * 入参：无
   * 返回值：无
   */
  function applyYAutoRange() {
    if (!document.getElementById("yAuto").checked) return;
    var samples = parseInt(document.getElementById("samples").value, 10) || 801;
    var xmin = toMathX(0);
    var xmax = toMathX(cssW);
    var ymin = Infinity, ymax = -Infinity;
    var dx = (xmax - xmin) / (samples - 1);
    funcs.forEach(function (f) {
      if (!f.enabled || f.error || !f.evaluator) return;
      for (var i = 0; i < samples; i++) {
        var x = xmin + i * dx;
        var y;
        try { y = f.evaluator(x); } catch (e) { y = NaN; }
        if (isFinite(y)) {
          if (y < ymin) ymin = y;
          if (y > ymax) ymax = y;
        }
      }
    });
    if (isFinite(ymin) && isFinite(ymax)) {
      if (ymin === ymax) { ymin -= 1; ymax += 1; }
      var pad = (ymax - ymin) * 0.12;
      ymin -= pad; ymax += pad;
      view.cy = (ymin + ymax) / 2;
      view.scale = cssW / (xmax - xmin); // 保持 x 范围
      var yScale = cssH / (ymax - ymin);
      view.scale = Math.min(view.scale, yScale); // 取较小者保证两轴都装下
      view.cy = (ymin + ymax) / 2;
    }
    syncRangeInputs();
  }

  /** 应用 X/Y 范围输入框的值到视图状态 */
  function applyManualRange() {
    var xmin = parseFloat(document.getElementById("xMin").value);
    var xmax = parseFloat(document.getElementById("xMax").value);
    if (!(isFinite(xmin) && isFinite(xmax) && xmax > xmin)) return;
    view.cx = (xmin + xmax) / 2;
    view.scale = cssW / (xmax - xmin);
    if (document.getElementById("yAuto").checked) {
      applyYAutoRange();
    } else {
      var ymin = parseFloat(document.getElementById("yMin").value);
      var ymax = parseFloat(document.getElementById("yMax").value);
      if (isFinite(ymin) && isFinite(ymax) && ymax > ymin) {
        view.cy = (ymin + ymax) / 2;
        var yScale = cssH / (ymax - ymin);
        view.scale = Math.min(view.scale, yScale);
      }
    }
    redraw();
  }

  /**
   * 播放从左到右绘制动画
   * 入参：无
   * 返回值：无
   */
  function playAnimation() {
    if (animFrame) cancelAnimationFrame(animFrame);
    var duration = parseInt(document.getElementById("animDuration").value, 10) || 3000;
    animStartTime = performance.now();

    /**
     * 单帧渲染回调
     * 入参：now 当前时间戳
     * 返回值：无
     */
    function frame(now) {
      var progress = Math.min(1, (now - animStartTime) / duration);
      // 缓动：easeOutCubic
      var eased = 1 - Math.pow(1 - progress, 3);
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, cssW, cssH);
      drawGrid();
      for (var i = 0; i < funcs.length; i++) drawFunction(funcs[i], eased);
      updateRangeInfo();
      if (progress < 1) {
        animFrame = requestAnimationFrame(frame);
      } else {
        animFrame = null;
      }
    }
    animFrame = requestAnimationFrame(frame);
  }

  /* ============================================================
   * 四、函数列表 UI
   * ============================================================ */

  var funcListEl = document.getElementById("funcList");
  var addBtn = document.getElementById("btnAdd");

  /**
   * 重新编译某一行表达式并更新错误样式
   * 入参：f 函数行数据
   * 返回值：无
   */
  function recompile(f) {
    var text = f.input.value.trim();
    f.expr = text;
    f.error = "";
    f.evaluator = null;
    if (text === "") {
      f.row.classList.remove("has-error");
      f.errorEl.textContent = "";
      redraw();
      return;
    }
    try {
      f.evaluator = compile(text, "x");
      f.row.classList.remove("has-error");
      f.errorEl.textContent = "";
    } catch (err) {
      f.error = err.message;
      f.row.classList.add("has-error");
      f.errorEl.textContent = "⚠️ " + err.message;
    }
    if (document.getElementById("yAuto").checked) applyYAutoRange();
    redraw();
  }

  /**
   * 创建一个函数行
   * 入参：expr 初始表达式；color 颜色
   * 返回值：无（写入 funcs 与 DOM）
   */
  function addFunctionRow(expr, color) {
    if (funcs.length >= MAX_FUNCS) return;
    var row = document.createElement("div");
    row.className = "func-row";
    row.innerHTML =
      '<input type="color" class="func-color" value="' + color + '" title="线条颜色">' +
      '<input type="checkbox" class="func-enable" checked title="启用/隐藏此函数">' +
      '<input type="text" class="func-expr" spellcheck="false" placeholder="例如 sin(x)、2x+1、x^2-3x+2">' +
      '<button type="button" class="func-del" title="删除此函数">🗑️ 删除</button>' +
      '<div class="func-error"></div>';
    funcListEl.appendChild(row);

    var f = {
      row: row,
      colorInput: row.querySelector(".func-color"),
      enableInput: row.querySelector(".func-enable"),
      input: row.querySelector(".func-expr"),
      errorEl: row.querySelector(".func-error"),
      delBtn: row.querySelector(".func-del"),
      color: color,
      enabled: true,
      expr: expr,
      evaluator: null,
      error: ""
    };
    f.input.value = expr;
    funcs.push(f);

    f.input.addEventListener("input", function () { recompile(f); });
    f.colorInput.addEventListener("input", function () { f.color = f.colorInput.value; redraw(); });
    f.enableInput.addEventListener("change", function () {
      f.enabled = f.enableInput.checked;
      if (document.getElementById("yAuto").checked) applyYAutoRange();
      redraw();
    });
    f.delBtn.addEventListener("click", function () {
      var idx = funcs.indexOf(f);
      if (idx !== -1) funcs.splice(idx, 1);
      row.parentNode.removeChild(row);
      addBtn.disabled = funcs.length >= MAX_FUNCS;
      if (document.getElementById("yAuto").checked) applyYAutoRange();
      redraw();
    });

    addBtn.disabled = funcs.length >= MAX_FUNCS;
    recompile(f);
  }

  /* ============================================================
   * 五、交互事件
   * ============================================================ */

  /** 滚轮缩放（以指针位置为锚点） */
  canvas.addEventListener("wheel", function (e) {
    e.preventDefault();
    var rect = canvas.getBoundingClientRect();
    var px = e.clientX - rect.left;
    var py = e.clientY - rect.top;
    var factor = e.deltaY < 0 ? 1.12 : 1 / 1.12;
    zoomAt(px, py, factor);
  }, { passive: false });

  /** 拖拽平移 */
  var drag = null;
  canvas.addEventListener("pointerdown", function (e) {
    drag = { x: e.clientX, y: e.clientY, cx: view.cx, cy: view.cy };
    canvas.classList.add("dragging");
    canvas.setPointerCapture(e.pointerId);
  });
  canvas.addEventListener("pointermove", function (e) {
    // 实时坐标提示
    var rect = canvas.getBoundingClientRect();
    var mx = e.clientX - rect.left;
    var my = e.clientY - rect.top;
    if (mx >= 0 && mx <= cssW && my >= 0 && my <= cssH) {
      var liveEl = document.getElementById("liveCoord");
      liveEl.hidden = false;
      liveEl.textContent = "x = " + parseFloat(toMathX(mx).toFixed(4)) + ", y = " + parseFloat(toMathY(my).toFixed(4));
    } else {
      document.getElementById("liveCoord").hidden = true;
    }
    if (!drag) return;
    view.cx = drag.cx - (e.clientX - drag.x) / view.scale;
    view.cy = drag.cy + (e.clientY - drag.y) / view.scale;
    syncRangeInputs();
    redraw();
  });
  canvas.addEventListener("pointerleave", function () {
    document.getElementById("liveCoord").hidden = true;
  });
  /** 结束拖拽（兼容抬起/取消） */
  function endDrag(e) {
    drag = null;
    canvas.classList.remove("dragging");
    try { canvas.releasePointerCapture(e.pointerId); } catch (err) { /* 忽略 */ }
  }
  canvas.addEventListener("pointerup", endDrag);
  canvas.addEventListener("pointercancel", endDrag);

  /** 工具栏：放大/缩小/居中/复位/生成/导出 */
  document.getElementById("btnZoomIn").addEventListener("click", function () {
    zoomAt(cssW / 2, cssH / 2, 1.25);
  });
  document.getElementById("btnZoomOut").addEventListener("click", function () {
    zoomAt(cssW / 2, cssH / 2, 1 / 1.25);
  });
  document.getElementById("btnCenter").addEventListener("click", function () {
    view.cx = 0; view.cy = 0;
    syncRangeInputs();
    redraw();
  });
  document.getElementById("btnReset").addEventListener("click", function () {
    document.getElementById("xMin").value = "-10";
    document.getElementById("xMax").value = "10";
    document.getElementById("yMin").value = "-10";
    document.getElementById("yMax").value = "10";
    document.getElementById("yAuto").checked = false;
    applyManualRange();
  });
  document.getElementById("btnGenerate").addEventListener("click", function () {
    applyManualRange();
    if (opts.anim) {
      playAnimation();
    } else {
      if (animFrame) { cancelAnimationFrame(animFrame); animFrame = null; }
      redraw();
    }
  });
  document.getElementById("btnExport").addEventListener("click", function () {
    // 确保 1:1 完整重绘一帧再导出
    if (animFrame) { cancelAnimationFrame(animFrame); animFrame = null; }
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, cssW, cssH);
    drawGrid();
    for (var i = 0; i < funcs.length; i++) drawFunction(funcs[i], 1);
    var link = document.createElement("a");
    link.download = "function-graph-" + Date.now() + ".png";
    link.href = canvas.toDataURL("image/png");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  });

  /** 全屏状态变化时重建像素缓冲并重绘（进出全屏由共享模块 tool-stage-toolbar.js 接管） */
  document.addEventListener("fullscreenchange", function () { resizeCanvas(); redraw(); });
  document.addEventListener("webkitfullscreenchange", function () { resizeCanvas(); redraw(); });

  /** 添加函数按钮 */
  addBtn.addEventListener("click", function () {
    addFunctionRow("", PALETTE[funcs.length % PALETTE.length]);
  });

  /** 查看示例：载入多组对比函数 */
  document.getElementById("btnExample").addEventListener("click", function () {
    // 清空现有
    while (funcs.length) {
      var f = funcs.pop();
      f.row.parentNode.removeChild(f.row);
    }
    addBtn.disabled = false;
    var examples = [
      { expr: "sin(x)", color: "#ef4444" },
      { expr: "cos(x)", color: "#2563eb" },
      { expr: "x^2/8 - 2", color: "#16a34a" }
    ];
    examples.forEach(function (ex) { addFunctionRow(ex.expr, ex.color); });
    document.getElementById("xMin").value = "-10";
    document.getElementById("xMax").value = "10";
    document.getElementById("yAuto").checked = true;
    applyManualRange();
  });

  /** 范围输入框回车应用 */
  ["xMin", "xMax", "yMin", "yMax", "samples", "lineWidth", "animDuration"].forEach(function (id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener("change", function () {
      if (id === "xMin" || id === "xMax" || id === "yMin" || id === "yMax") applyManualRange();
      else redraw();
    });
  });

  /** Y 自动切换：勾选后立即重算并隐藏手动输入 */
  document.getElementById("yAuto").addEventListener("change", function () {
    var yManualRow = document.getElementById("yManualRow");
    yManualRow.style.display = this.checked ? "none" : "flex";
    if (this.checked) applyYAutoRange();
    redraw();
  });
  // 初始化隐藏状态
  document.getElementById("yManualRow").style.display = document.getElementById("yAuto").checked ? "none" : "flex";

  /** 显示选项 checkbox 联动 */
  ["Grid", "Axis", "Key", "Fill", "Anim"].forEach(function (suffix) {
    var el = document.getElementById("opt" + suffix);
    if (!el) return;
    var key = suffix === "Key" ? "keyPoints" : suffix.toLowerCase();
    el.addEventListener("change", function () {
      opts[key] = el.checked;
      // 动画时长行只在勾选动画后显示
      if (suffix === "Anim") {
        document.getElementById("animDurationRow").style.display = el.checked ? "flex" : "none";
      }
      redraw();
    });
  });
  // 初始化动画时长行隐藏
  document.getElementById("animDurationRow").style.display = document.getElementById("optAnim").checked ? "flex" : "none";

  /** 窗口尺寸变化时重建像素缓冲并重绘 */
  window.addEventListener("resize", function () {
    resizeCanvas();
    redraw();
  });

  /* ============================================================
   * 六、初始化
   * ============================================================ */
  resizeCanvas();
  // 默认 x 方向显示约 [-10, 10]
  var xMin0 = parseFloat(document.getElementById("xMin").value) || -10;
  var xMax0 = parseFloat(document.getElementById("xMax").value) || 10;
  if (xMax0 <= xMin0) { xMin0 = -10; xMax0 = 10; }
  view.scale = cssW / (xMax0 - xMin0);
  view.cx = (xMin0 + xMax0) / 2;
  addFunctionRow("sin(x)", PALETTE[0]);
  if (document.getElementById("yAuto").checked) applyYAutoRange();
  redraw();

  /* 舞台工具栏：⛶ 对 .graph-card 自身全屏，⚙ 收起左侧的 .side-card。
     交互与全屏状态回滚均由共享模块 tool-stage-toolbar.js 提供。 */
  if (window.EduToolStageToolbar) {
    window.EduToolStageToolbar.init({
      stage: ".graph-card",
      panelHost: "#graphLayout",
      hiddenClass: "setup-hidden"
    });
  }
})();
