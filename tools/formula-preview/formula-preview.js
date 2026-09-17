/**
 * 公式预览与计算工具 (formula-preview.js)
 * 功能：30 个中小学数学/物理/化学公式模板，参数实时代入、KaTeX 渲染、数值结果计算，
 *       一次函数与二次函数附带内嵌 Canvas 图像；支持图像/文字预览切换、X/Y 范围调节、
 *       重新渲染、保存截图、复制 LaTeX。
 * 视觉参考：https://classtool.cn/formula-preview/
 */
(function () {
  "use strict";

  /** 按 id 获取元素 */
  function $(id) { return document.getElementById(id); }

  /**
   * 数字格式化为整洁字符串（最多保留 6 位小数，超大/超小用科学记数法）
   * 入参：v 数字
   * 返回值：string
   */
  function fmt(v) {
    if (!isFinite(v)) return "无效";
    if (v === 0) return "0";
    var av = Math.abs(v);
    if (av >= 1e9 || av < 1e-6) return v.toExponential(3).replace(/\.?0+e/, "e");
    return String(parseFloat(v.toFixed(6)));
  }

  /**
   * 生成多项式单项文本（LaTeX），自动处理正负号与系数 1
   * 入参：coef 系数；power 次数(0/1/2)；isFirst 是否首项
   * 返回值：string 单项文本
   */
  function polyTerm(coef, power, isFirst) {
    var sign = coef < 0 ? (isFirst ? "-" : " - ") : (isFirst ? "" : " + ");
    var ac = Math.abs(coef);
    var core;
    if (power === 0) {
      core = fmt(ac);
    } else {
      core = (ac === 1 ? "" : fmt(ac)) + (power === 1 ? "x" : "x^{2}");
    }
    return sign + core;
  }

  /**
   * 组装一次/二次多项式右侧表达式
   * 入参：coeffs 系数数组（按次数从高到低，每项 {c:系数,p:次数}）
   * 返回值：string 如 x^{2} - 3x + 2
   */
  function polyText(coeffs) {
    var parts = [];
    coeffs.forEach(function (item) {
      if (item.c !== 0) parts.push(polyTerm(item.c, item.p, parts.length === 0));
    });
    return parts.length ? parts.join("") : "0";
  }

  /**
   * 模板定义：params 为参数（k 键名/label 中文名/def 默认值/min/max/step 滑块范围），
   * render(v) 返回 {tex:LaTeX, value:结果文本, unit:单位, invalid:非法提示}
   * graph 字段可选：linear/quad 表示附带函数图像
   */
  var TEMPLATES = [
    /* —————— 数学 —————— */
    {
      cat: "📐 数学", name: "一次函数 y = kx + b", graph: "linear",
      params: [
        { k: "k", label: "斜率 k", def: 2, min: -10, max: 10, step: 0.1 },
        { k: "b", label: "截距 b", def: 1, min: -10, max: 10, step: 0.1 }
      ],
      render: function (v) {
        var t = polyText([{ c: v.k, p: 1 }, { c: v.b, p: 0 }]);
        return { tex: "y = " + t, value: "y = " + t, unit: "（函数式）" };
      }
    },
    {
      cat: "📐 数学", name: "二次函数 y = ax² + bx + c", graph: "quad",
      params: [
        { k: "a", label: "二次项系数 a", def: 1, min: -5, max: 5, step: 0.1 },
        { k: "b", label: "一次项系数 b", def: -3, min: -10, max: 10, step: 0.1 },
        { k: "c", label: "常数项 c", def: 2, min: -10, max: 10, step: 0.1 }
      ],
      render: function (v) {
        var t = polyText([{ c: v.a, p: 2 }, { c: v.b, p: 1 }, { c: v.c, p: 0 }]);
        return { tex: "y = " + t, value: "y = " + t, unit: "（函数式）" };
      }
    },
    {
      cat: "📐 数学", name: "一元二次方程求根", graph: null,
      params: [
        { k: "a", label: "系数 a（≠0）", def: 1, min: -5, max: 5, step: 0.1 },
        { k: "b", label: "系数 b", def: -5, min: -10, max: 10, step: 0.1 },
        { k: "c", label: "系数 c", def: 6, min: -10, max: 10, step: 0.1 }
      ],
      render: function (v) {
        if (v.a === 0) return { invalid: "a 不能为 0" };
        var d = v.b * v.b - 4 * v.a * v.c;
        var base = "x = \\frac{" + fmt(-v.b) + " \\pm \\sqrt{\\Delta}}{2 \\times " + fmt(v.a) +
          "},\\quad \\Delta = " + fmt(d);
        if (d < 0) {
          return { tex: base, value: "无实数根（Δ = " + fmt(d) + " < 0）", unit: "" };
        }
        var r1 = (-v.b + Math.sqrt(d)) / (2 * v.a);
        var r2 = (-v.b - Math.sqrt(d)) / (2 * v.a);
        if (d === 0) {
          return { tex: base + ",\\quad x = " + fmt(r1), value: "x = " + fmt(r1) + "（两个相等实根）", unit: "" };
        }
        return {
          tex: base + ",\\quad x_1 = " + fmt(r1) + ",\\; x_2 = " + fmt(r2),
          value: "x₁ = " + fmt(r1) + "，x₂ = " + fmt(r2), unit: ""
        };
      }
    },
    {
      cat: "📐 数学", name: "一元二次方程判别式", graph: null,
      params: [
        { k: "a", label: "系数 a", def: 1, min: -5, max: 5, step: 0.1 },
        { k: "b", label: "系数 b", def: -5, min: -10, max: 10, step: 0.1 },
        { k: "c", label: "系数 c", def: 6, min: -10, max: 10, step: 0.1 }
      ],
      render: function (v) {
        var d = v.b * v.b - 4 * v.a * v.c;
        var note = d > 0 ? "Δ > 0，两个不相等实数根" : d === 0 ? "Δ = 0，两个相等实数根" : "Δ < 0，无实数根";
        return {
          tex: "\\Delta = b^{2} - 4ac = " + fmt(v.b) + "^{2} - 4 \\times " + fmt(v.a) +
            " \\times " + fmt(v.c) + " = " + fmt(d),
          value: fmt(d) + "（" + note + "）", unit: ""
        };
      }
    },
    {
      cat: "📐 数学", name: "等差数列通项", graph: null,
      params: [
        { k: "a1", label: "首项 a₁", def: 2, min: -50, max: 50, step: 0.5 },
        { k: "d", label: "公差 d", def: 3, min: -20, max: 20, step: 0.5 },
        { k: "n", label: "项数 n", def: 10, min: 1, max: 100, step: 1 }
      ],
      render: function (v) {
        var an = v.a1 + (v.n - 1) * v.d;
        return {
          tex: "a_{" + fmt(v.n) + "} = a_1 + (n-1)d = " + fmt(v.a1) + " + (" + fmt(v.n) +
            "-1) \\times " + fmt(v.d) + " = " + fmt(an),
          value: "a" + fmt(v.n) + " = " + fmt(an), unit: ""
        };
      }
    },
    {
      cat: "📐 数学", name: "等差数列求和", graph: null,
      params: [
        { k: "a1", label: "首项 a₁", def: 2, min: -50, max: 50, step: 0.5 },
        { k: "d", label: "公差 d", def: 3, min: -20, max: 20, step: 0.5 },
        { k: "n", label: "项数 n", def: 10, min: 1, max: 100, step: 1 }
      ],
      render: function (v) {
        var an = v.a1 + (v.n - 1) * v.d;
        var s = v.n * (v.a1 + an) / 2;
        return {
          tex: "S_{" + fmt(v.n) + "} = \\frac{n(a_1 + a_n)}{2} = \\frac{" + fmt(v.n) +
            " \\times (" + fmt(v.a1) + " + " + fmt(an) + ")}{2} = " + fmt(s),
          value: "S" + fmt(v.n) + " = " + fmt(s), unit: ""
        };
      }
    },
    {
      cat: "📐 数学", name: "等比数列通项", graph: null,
      params: [
        { k: "a1", label: "首项 a₁", def: 1, min: -50, max: 50, step: 0.5 },
        { k: "q", label: "公比 q", def: 2, min: -10, max: 10, step: 0.1 },
        { k: "n", label: "项数 n", def: 8, min: 1, max: 30, step: 1 }
      ],
      render: function (v) {
        var an = v.a1 * Math.pow(v.q, v.n - 1);
        return {
          tex: "a_{" + fmt(v.n) + "} = a_1 q^{n-1} = " + fmt(v.a1) + " \\times " + fmt(v.q) +
            "^{" + fmt(v.n - 1) + "} = " + fmt(an),
          value: "a" + fmt(v.n) + " = " + fmt(an), unit: ""
        };
      }
    },
    {
      cat: "📐 数学", name: "圆的面积", graph: null,
      params: [{ k: "r", label: "半径 r", def: 5, min: 0, max: 50, step: 0.5 }],
      render: function (v) {
        var s = Math.PI * v.r * v.r;
        return {
          tex: "S = \\pi r^{2} = \\pi \\times " + fmt(v.r) + "^{2} = " + fmt(s),
          value: fmt(s), unit: "平方单位"
        };
      }
    },
    {
      cat: "📐 数学", name: "圆的周长", graph: null,
      params: [{ k: "r", label: "半径 r", def: 5, min: 0, max: 100, step: 0.5 }],
      render: function (v) {
        var c = 2 * Math.PI * v.r;
        return {
          tex: "C = 2\\pi r = 2 \\times \\pi \\times " + fmt(v.r) + " = " + fmt(c),
          value: fmt(c), unit: "长度单位"
        };
      }
    },
    {
      cat: "📐 数学", name: "梯形面积", graph: null,
      params: [
        { k: "a", label: "上底 a", def: 4, min: 0, max: 100, step: 0.5 },
        { k: "b", label: "下底 b", def: 6, min: 0, max: 100, step: 0.5 },
        { k: "h", label: "高 h", def: 5, min: 0, max: 100, step: 0.5 }
      ],
      render: function (v) {
        var s = (v.a + v.b) * v.h / 2;
        return {
          tex: "S = \\frac{(a+b)h}{2} = \\frac{(" + fmt(v.a) + "+" + fmt(v.b) + ") \\times " +
            fmt(v.h) + "}{2} = " + fmt(s),
          value: fmt(s), unit: "平方单位"
        };
      }
    },
    {
      cat: "📐 数学", name: "勾股定理求斜边", graph: null,
      params: [
        { k: "a", label: "直角边 a", def: 3, min: 0, max: 100, step: 0.5 },
        { k: "b", label: "直角边 b", def: 4, min: 0, max: 100, step: 0.5 }
      ],
      render: function (v) {
        var c = Math.sqrt(v.a * v.a + v.b * v.b);
        return {
          tex: "c = \\sqrt{a^{2}+b^{2}} = \\sqrt{" + fmt(v.a) + "^{2}+" + fmt(v.b) +
            "^{2}} = " + fmt(c),
          value: "c = " + fmt(c), unit: "长度单位"
        };
      }
    },
    {
      cat: "📐 数学", name: "两点间距离", graph: null,
      params: [
        { k: "x1", label: "x₁", def: 1, min: -50, max: 50, step: 0.5 },
        { k: "y1", label: "y₁", def: 2, min: -50, max: 50, step: 0.5 },
        { k: "x2", label: "x₂", def: 4, min: -50, max: 50, step: 0.5 },
        { k: "y2", label: "y₂", def: 6, min: -50, max: 50, step: 0.5 }
      ],
      render: function (v) {
        var d = Math.sqrt(Math.pow(v.x2 - v.x1, 2) + Math.pow(v.y2 - v.y1, 2));
        return {
          tex: "d = \\sqrt{(x_2-x_1)^{2}+(y_2-y_1)^{2}} = \\sqrt{(" + fmt(v.x2 - v.x1) +
            ")^{2}+(" + fmt(v.y2 - v.y1) + ")^{2}} = " + fmt(d),
          value: "d = " + fmt(d), unit: "长度单位"
        };
      }
    },
    {
      cat: "📐 数学", name: "算术平均数（三数）", graph: null,
      params: [
        { k: "a", label: "数 a", def: 70, min: 0, max: 100, step: 1 },
        { k: "b", label: "数 b", def: 85, min: 0, max: 100, step: 1 },
        { k: "c", label: "数 c", def: 92, min: 0, max: 100, step: 1 }
      ],
      render: function (v) {
        var avg = (v.a + v.b + v.c) / 3;
        return {
          tex: "\\bar{x} = \\frac{a+b+c}{3} = \\frac{" + fmt(v.a) + "+" + fmt(v.b) + "+" +
            fmt(v.c) + "}{3} = " + fmt(avg),
          value: "x̄ = " + fmt(avg), unit: ""
        };
      }
    },

    /* —————— 物理 —————— */
    {
      cat: "⚡ 物理", name: "匀速直线运动速度", graph: null,
      params: [
        { k: "s", label: "路程 s（米）", def: 100, min: 0, max: 1000, step: 1 },
        { k: "t", label: "时间 t（秒）", def: 20, min: 0.001, max: 1000, step: 0.1 }
      ],
      render: function (v) {
        if (v.t === 0) return { invalid: "时间 t 不能为 0" };
        var r = v.s / v.t;
        return {
          tex: "v = \\frac{s}{t} = \\frac{" + fmt(v.s) + "}{" + fmt(v.t) + "} = " + fmt(r),
          value: fmt(r), unit: "m/s"
        };
      }
    },
    {
      cat: "⚡ 物理", name: "密度公式", graph: null,
      params: [
        { k: "m", label: "质量 m（克）", def: 79, min: 0, max: 1000, step: 1 },
        { k: "V", label: "体积 V（厘米³）", def: 10, min: 0.001, max: 1000, step: 0.1 }
      ],
      render: function (v) {
        if (v.V === 0) return { invalid: "体积 V 不能为 0" };
        var r = v.m / v.V;
        return {
          tex: "\\rho = \\frac{m}{V} = \\frac{" + fmt(v.m) + "}{" + fmt(v.V) + "} = " + fmt(r),
          value: "ρ = " + fmt(r), unit: "g/cm³"
        };
      }
    },
    {
      cat: "⚡ 物理", name: "重力公式", graph: null,
      params: [
        { k: "m", label: "质量 m（kg）", def: 5, min: 0, max: 1000, step: 0.5 },
        { k: "g", label: "g（N/kg）", def: 9.8, min: 0, max: 20, step: 0.1 }
      ],
      render: function (v) {
        var r = v.m * v.g;
        return {
          tex: "G = mg = " + fmt(v.m) + " \\times " + fmt(v.g) + " = " + fmt(r),
          value: "G = " + fmt(r), unit: "N"
        };
      }
    },
    {
      cat: "⚡ 物理", name: "压强公式", graph: null,
      params: [
        { k: "F", label: "压力 F（N）", def: 100, min: 0, max: 10000, step: 1 },
        { k: "S", label: "受力面积 S（m²）", def: 2, min: 0.001, max: 100, step: 0.1 }
      ],
      render: function (v) {
        if (v.S === 0) return { invalid: "面积 S 不能为 0" };
        var r = v.F / v.S;
        return {
          tex: "p = \\frac{F}{S} = \\frac{" + fmt(v.F) + "}{" + fmt(v.S) + "} = " + fmt(r),
          value: "p = " + fmt(r), unit: "Pa"
        };
      }
    },
    {
      cat: "⚡ 物理", name: "液体压强", graph: null,
      params: [
        { k: "rho", label: "密度 ρ（kg/m³）", def: 1000, min: 0, max: 20000, step: 10 },
        { k: "g", label: "g（N/kg）", def: 9.8, min: 0, max: 20, step: 0.1 },
        { k: "h", label: "深度 h（m）", def: 2, min: 0, max: 1000, step: 0.5 }
      ],
      render: function (v) {
        var r = v.rho * v.g * v.h;
        return {
          tex: "p = \\rho g h = " + fmt(v.rho) + " \\times " + fmt(v.g) + " \\times " +
            fmt(v.h) + " = " + fmt(r),
          value: "p = " + fmt(r), unit: "Pa"
        };
      }
    },
    {
      cat: "⚡ 物理", name: "阿基米德浮力", graph: null,
      params: [
        { k: "rho", label: "液体密度 ρ（kg/m³）", def: 1000, min: 0, max: 20000, step: 10 },
        { k: "g", label: "g（N/kg）", def: 9.8, min: 0, max: 20, step: 0.1 },
        { k: "V", label: "排开体积 V（m³）", def: 0.001, min: 0.0001, max: 10, step: 0.0001 }
      ],
      render: function (v) {
        var r = v.rho * v.g * v.V;
        return {
          tex: "F_{\\text{浮}} = \\rho g V = " + fmt(v.rho) + " \\times " + fmt(v.g) +
            " \\times " + fmt(v.V) + " = " + fmt(r),
          value: "F浮 = " + fmt(r), unit: "N"
        };
      }
    },
    {
      cat: "⚡ 物理", name: "功的公式", graph: null,
      params: [
        { k: "F", label: "力 F（N）", def: 50, min: 0, max: 10000, step: 1 },
        { k: "s", label: "距离 s（m）", def: 6, min: 0, max: 1000, step: 0.5 }
      ],
      render: function (v) {
        var r = v.F * v.s;
        return {
          tex: "W = Fs = " + fmt(v.F) + " \\times " + fmt(v.s) + " = " + fmt(r),
          value: "W = " + fmt(r), unit: "J"
        };
      }
    },
    {
      cat: "⚡ 物理", name: "功率公式", graph: null,
      params: [
        { k: "W", label: "功 W（J）", def: 600, min: 0, max: 100000, step: 10 },
        { k: "t", label: "时间 t（s）", def: 20, min: 0.001, max: 10000, step: 0.1 }
      ],
      render: function (v) {
        if (v.t === 0) return { invalid: "时间 t 不能为 0" };
        var r = v.W / v.t;
        return {
          tex: "P = \\frac{W}{t} = \\frac{" + fmt(v.W) + "}{" + fmt(v.t) + "} = " + fmt(r),
          value: "P = " + fmt(r), unit: "W"
        };
      }
    },
    {
      cat: "⚡ 物理", name: "机械效率", graph: null,
      params: [
        { k: "wu", label: "有用功 W有（J）", def: 600, min: 0, max: 100000, step: 10 },
        { k: "wz", label: "总功 W总（J）", def: 750, min: 0.001, max: 100000, step: 10 }
      ],
      render: function (v) {
        if (v.wz === 0) return { invalid: "总功不能为 0" };
        var r = v.wu / v.wz * 100;
        return {
          tex: "\\eta = \\frac{W_{\\text{有}}}{W_{\\text{总}}} \\times 100\\% = \\frac{" +
            fmt(v.wu) + "}{" + fmt(v.wz) + "} \\times 100\\% = " + fmt(r) + "\\%",
          value: "η = " + fmt(r), unit: "%"
        };
      }
    },
    {
      cat: "⚡ 物理", name: "欧姆定律", graph: null,
      params: [
        { k: "U", label: "电压 U（V）", def: 6, min: 0, max: 1000, step: 0.1 },
        { k: "R", label: "电阻 R（Ω）", def: 12, min: 0.001, max: 10000, step: 0.1 }
      ],
      render: function (v) {
        if (v.R === 0) return { invalid: "电阻 R 不能为 0" };
        var r = v.U / v.R;
        return {
          tex: "I = \\frac{U}{R} = \\frac{" + fmt(v.U) + "}{" + fmt(v.R) + "} = " + fmt(r),
          value: "I = " + fmt(r), unit: "A"
        };
      }
    },
    {
      cat: "⚡ 物理", name: "串联电阻", graph: null,
      params: [
        { k: "r1", label: "电阻 R₁（Ω）", def: 10, min: 0, max: 10000, step: 1 },
        { k: "r2", label: "电阻 R₂（Ω）", def: 20, min: 0, max: 10000, step: 1 }
      ],
      render: function (v) {
        var r = v.r1 + v.r2;
        return {
          tex: "R = R_1 + R_2 = " + fmt(v.r1) + " + " + fmt(v.r2) + " = " + fmt(r),
          value: "R = " + fmt(r), unit: "Ω"
        };
      }
    },
    {
      cat: "⚡ 物理", name: "并联电阻", graph: null,
      params: [
        { k: "r1", label: "电阻 R₁（Ω）", def: 10, min: 0.001, max: 10000, step: 1 },
        { k: "r2", label: "电阻 R₂（Ω）", def: 20, min: 0.001, max: 10000, step: 1 }
      ],
      render: function (v) {
        var den = v.r1 + v.r2;
        if (den === 0) return { invalid: "R₁ + R₂ 不能为 0" };
        var r = v.r1 * v.r2 / den;
        return {
          tex: "R = \\frac{R_1 R_2}{R_1 + R_2} = \\frac{" + fmt(v.r1) + " \\times " + fmt(v.r2) +
            "}{" + fmt(v.r1) + "+" + fmt(v.r2) + "} = " + fmt(r),
          value: "R = " + fmt(r), unit: "Ω"
        };
      }
    },
    {
      cat: "⚡ 物理", name: "电功公式", graph: null,
      params: [
        { k: "U", label: "电压 U（V）", def: 220, min: 0, max: 1000, step: 1 },
        { k: "I", label: "电流 I（A）", def: 0.5, min: 0, max: 100, step: 0.05 },
        { k: "t", label: "时间 t（s）", def: 60, min: 0, max: 3600, step: 1 }
      ],
      render: function (v) {
        var r = v.U * v.I * v.t;
        return {
          tex: "W = UIt = " + fmt(v.U) + " \\times " + fmt(v.I) + " \\times " + fmt(v.t) +
            " = " + fmt(r),
          value: "W = " + fmt(r), unit: "J"
        };
      }
    },
    {
      cat: "⚡ 物理", name: "电功率公式", graph: null,
      params: [
        { k: "U", label: "电压 U（V）", def: 220, min: 0, max: 1000, step: 1 },
        { k: "I", label: "电流 I（A）", def: 0.5, min: 0, max: 100, step: 0.05 }
      ],
      render: function (v) {
        var r = v.U * v.I;
        return {
          tex: "P = UI = " + fmt(v.U) + " \\times " + fmt(v.I) + " = " + fmt(r),
          value: "P = " + fmt(r), unit: "W"
        };
      }
    },
    {
      cat: "⚡ 物理", name: "物体吸热公式", graph: null,
      params: [
        { k: "c", label: "比热容 c（J/(kg·℃)）", def: 4200, min: 0, max: 20000, step: 10 },
        { k: "m", label: "质量 m（kg）", def: 2, min: 0, max: 1000, step: 0.5 },
        { k: "dt", label: "温升 Δt（℃）", def: 10, min: 0, max: 500, step: 0.5 }
      ],
      render: function (v) {
        var r = v.c * v.m * v.dt;
        return {
          tex: "Q_{\\text{吸}} = cm\\Delta t = " + fmt(v.c) + " \\times " + fmt(v.m) +
            " \\times " + fmt(v.dt) + " = " + fmt(r),
          value: "Q吸 = " + fmt(r), unit: "J"
        };
      }
    },

    /* —————— 化学 —————— */
    {
      cat: "🧪 化学", name: "物质的量", graph: null,
      params: [
        { k: "m", label: "质量 m（g）", def: 36, min: 0, max: 1000, step: 1 },
        { k: "M", label: "摩尔质量 M（g/mol）", def: 18, min: 0.001, max: 1000, step: 0.5 }
      ],
      render: function (v) {
        if (v.M === 0) return { invalid: "摩尔质量 M 不能为 0" };
        var r = v.m / v.M;
        return {
          tex: "n = \\frac{m}{M} = \\frac{" + fmt(v.m) + "}{" + fmt(v.M) + "} = " + fmt(r),
          value: "n = " + fmt(r), unit: "mol"
        };
      }
    },
    {
      cat: "🧪 化学", name: "物质的量浓度", graph: null,
      params: [
        { k: "n", label: "溶质物质的量 n（mol）", def: 0.5, min: 0, max: 100, step: 0.05 },
        { k: "V", label: "溶液体积 V（L）", def: 0.25, min: 0.001, max: 100, step: 0.05 }
      ],
      render: function (v) {
        if (v.V === 0) return { invalid: "体积 V 不能为 0" };
        var r = v.n / v.V;
        return {
          tex: "c = \\frac{n}{V} = \\frac{" + fmt(v.n) + "}{" + fmt(v.V) + "} = " + fmt(r),
          value: "c = " + fmt(r), unit: "mol/L"
        };
      }
    }
  ];

  /* ============================================================
   * 交互与渲染
   * ============================================================ */

  var navEl = $("tplNav");
  var paramsBox = $("paramsBox");
  var formulaRender = $("formulaRender");
  var formulaText = $("formulaText");
  var resultValue = $("resultValue");
  var graphWrap = $("graphWrap");
  var miniCanvas = $("miniCanvas");
  var miniCtx = miniCanvas.getContext("2d");
  var currentTemplate = null;
  var currentInputs = {}; // {key: {range, number, def, min, max, step}}
  var lastTex = "";
  var lastValue = "";
  var lastUnit = "";

  /**
   * 构建左侧分类模板按钮
   * 入参：无
   * 返回值：无
   */
  function buildNav() {
    var lastCat = "";
    TEMPLATES.forEach(function (tpl, idx) {
      if (tpl.cat !== lastCat) {
        var title = document.createElement("div");
        title.className = "cat-title";
        title.textContent = tpl.cat;
        navEl.appendChild(title);
        lastCat = tpl.cat;
      }
      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "tpl-btn";
      btn.textContent = tpl.name;
      btn.dataset.idx = String(idx);
      btn.addEventListener("click", function () { selectTemplate(idx); });
      navEl.appendChild(btn);
    });
  }

  /**
   * 选中模板：生成参数输入区并首次渲染
   * 入参：idx 模板下标
   * 返回值：无
   */
  function selectTemplate(idx) {
    currentTemplate = TEMPLATES[idx];
    navEl.querySelectorAll(".tpl-btn").forEach(function (b) {
      b.classList.toggle("active", Number(b.dataset.idx) === idx);
    });
    $("tplName").textContent = currentTemplate.name;
    paramsBox.innerHTML = "";
    currentInputs = {};
    currentTemplate.params.forEach(function (p) {
      var item = document.createElement("div");
      item.className = "param-item";

      // 标签 + 当前值显示
      var label = document.createElement("label");
      var labelText = document.createElement("span");
      labelText.textContent = p.label;
      var valTag = document.createElement("span");
      valTag.className = "val-tag";
      valTag.textContent = fmt(p.def);
      label.appendChild(labelText);
      label.appendChild(valTag);

      // 滑块 + 数字输入（联动）
      var rangeInput = document.createElement("input");
      rangeInput.type = "range";
      rangeInput.min = String(p.min !== undefined ? p.min : -50);
      rangeInput.max = String(p.max !== undefined ? p.max : 50);
      rangeInput.step = String(p.step !== undefined ? p.step : 0.1);
      rangeInput.value = String(p.def);

      var numInput = document.createElement("input");
      numInput.type = "number";
      numInput.step = "any";
      numInput.value = String(p.def);

      /** 同步两个输入 */
      function syncFromRange() {
        numInput.value = rangeInput.value;
        valTag.textContent = fmt(parseFloat(rangeInput.value));
        update();
      }
      function syncFromNumber() {
        var v = parseFloat(numInput.value);
        if (isFinite(v)) {
          rangeInput.value = String(v);
          valTag.textContent = fmt(v);
        }
        update();
      }
      rangeInput.addEventListener("input", syncFromRange);
      numInput.addEventListener("input", syncFromNumber);

      item.appendChild(label);
      item.appendChild(rangeInput);
      item.appendChild(numInput);
      paramsBox.appendChild(item);

      currentInputs[p.k] = {
        range: rangeInput,
        number: numInput,
        valTag: valTag,
        def: p.def,
        min: p.min,
        max: p.max,
        step: p.step
      };
    });
    update();
  }

  /**
   * 读取当前全部参数值
   * 入参：无
   * 返回值：{values:数值对象, ok:是否全部合法}
   */
  function readValues() {
    var values = {};
    var ok = true;
    currentTemplate.params.forEach(function (p) {
      var raw = currentInputs[p.k].number.value.trim();
      var num = parseFloat(raw);
      if (raw === "" || Number.isNaN(num)) ok = false;
      values[p.k] = num;
    });
    return { values: values, ok: ok };
  }

  /**
   * 格式化参数当前值清单（用于 params-current 显示）
   * 入参：values 当前参数对象
   * 返回值：string
   */
  function formatParamsCurrent(values) {
    return currentTemplate.params.map(function (p) {
      return p.k + " = " + fmt(values[p.k]);
    }).join("，");
  }

  /**
   * 参数变化后重算并重渲染
   * 入参：无
   * 返回值：无
   */
  function update() {
    if (!currentTemplate) return;
    var read = readValues();
    if (!read.ok) {
      resultValue.innerHTML = "请填写全部参数（须为数字）";
      formulaRender.textContent = "";
      formulaText.textContent = "";
      graphWrap.classList.remove("show");
      lastTex = "";
      return;
    }
    $("paramsCurrent").textContent = formatParamsCurrent(read.values);
    var out;
    try {
      out = currentTemplate.render(read.values);
    } catch (e) {
      resultValue.textContent = "计算出错：" + e.message;
      return;
    }
    if (out.invalid) {
      formulaRender.textContent = "";
      formulaText.textContent = "";
      resultValue.textContent = "⚠️ " + out.invalid;
      graphWrap.classList.remove("show");
      lastTex = "";
      return;
    }
    // KaTeX 渲染
    formulaRender.innerHTML = "";
    katex.render(out.tex, formulaRender, { displayMode: true, throwOnError: false });
    // 文字预览（去除 LaTeX 反斜杠与花括号，保留可读文本）
    formulaText.textContent = out.tex.replace(/\\\\/g, "").replace(/\{|\}/g, "").replace(/\\frac/g, "frac").replace(/\\text\{[^}]+\}/g, "").replace(/\\quad/g, " ").replace(/\\,/g, " ").replace(/\\;/g, " ").replace(/\\times/g, "×").replace(/\\pm/g, "±").replace(/\\Delta/g, "Δ").replace(/\\sqrt/g, "√").replace(/\\pi/g, "π").replace(/\\rho/g, "ρ").replace(/\\eta/g, "η").replace(/\\bar\{x\}/g, "x̄");
    lastTex = out.tex;
    lastValue = out.value;
    lastUnit = out.unit || "";
    resultValue.innerHTML = "";
    resultValue.appendChild(document.createTextNode(out.value));
    if (out.unit) {
      var unit = document.createElement("span");
      unit.className = "unit";
      unit.textContent = out.unit;
      resultValue.appendChild(unit);
    }
    if (currentTemplate.graph) {
      graphWrap.classList.add("show");
      drawMiniGraph(currentTemplate.graph, read.values);
    } else {
      graphWrap.classList.remove("show");
    }
  }

  /**
   * 内嵌极简函数图像：白底网格 + 坐标轴 + 采样折线
   * 入参：type "linear" 或 "quad"；v 当前参数值
   * 返回值：无
   */
  function drawMiniGraph(type, v) {
    var dpr = Math.max(1, window.devicePixelRatio || 1);
    var w = Math.max(50, miniCanvas.clientWidth);
    var h = 280;
    miniCanvas.width = Math.round(w * dpr);
    miniCanvas.height = Math.round(h * dpr);
    miniCtx.setTransform(dpr, 0, 0, dpr, 0, 0);

    var XMIN = parseFloat($("gxMin").value);
    var XMAX = parseFloat($("gxMax").value);
    var YMIN = parseFloat($("gyMin").value);
    var YMAX = parseFloat($("gyMax").value);
    if (!(isFinite(XMIN) && isFinite(XMAX) && XMAX > XMIN)) { XMIN = -10; XMAX = 10; }
    if (!(isFinite(YMIN) && isFinite(YMAX) && YMAX > YMIN)) { YMIN = -10; YMAX = 10; }

    /** 按类型求函数值 */
    function f(x) {
      return type === "linear" ? v.k * x + v.b : v.a * x * x + v.b * x + v.c;
    }

    var pad = 28;
    function sx(xx) { return pad + (xx - XMIN) / (XMAX - XMIN) * (w - pad * 2); }
    function sy(yy) { return h - pad - (yy - YMIN) / (YMAX - YMIN) * (h - pad * 2); }

    miniCtx.fillStyle = "#ffffff";
    miniCtx.fillRect(0, 0, w, h);

    // 网格
    miniCtx.strokeStyle = "#eef2f7";
    miniCtx.lineWidth = 1;
    var step = niceStep((XMAX - XMIN) / 8);
    var gx0 = Math.ceil(XMIN / step) * step;
    for (var gx = gx0; gx <= XMAX + step * 1e-6; gx += step) {
      miniCtx.beginPath();
      miniCtx.moveTo(sx(gx), 0);
      miniCtx.lineTo(sx(gx), h);
      miniCtx.stroke();
    }
    var ystep = niceStep((YMAX - YMIN) / 6);
    var gy0 = Math.ceil(YMIN / ystep) * ystep;
    for (var gy = gy0; gy <= YMAX + ystep * 1e-6; gy += ystep) {
      miniCtx.beginPath();
      miniCtx.moveTo(0, sy(gy));
      miniCtx.lineTo(w, sy(gy));
      miniCtx.stroke();
    }

    // 坐标轴（0 在范围内才画）
    miniCtx.strokeStyle = "#9ca3af";
    miniCtx.lineWidth = 1.4;
    if (0 >= XMIN && 0 <= XMAX) {
      miniCtx.beginPath();
      miniCtx.moveTo(sx(0), 0);
      miniCtx.lineTo(sx(0), h);
      miniCtx.stroke();
    }
    if (0 >= YMIN && 0 <= YMAX) {
      miniCtx.beginPath();
      miniCtx.moveTo(0, sy(0));
      miniCtx.lineTo(w, sy(0));
      miniCtx.stroke();
    }

    // 刻度数字
    miniCtx.fillStyle = "#6b7280";
    miniCtx.font = "10px sans-serif";
    miniCtx.textAlign = "center";
    miniCtx.textBaseline = "top";
    [gx0, 0, XMAX].forEach(function (t) {
      if (t >= XMIN && t <= XMAX) miniCtx.fillText(String(parseFloat(t.toFixed(4))), sx(t), h - 16);
    });
    miniCtx.textAlign = "right";
    miniCtx.textBaseline = "middle";
    [YMIN, 0, YMAX].forEach(function (t) {
      if (t >= YMIN && t <= YMAX) miniCtx.fillText(String(parseFloat(t.toFixed(4))), sx(0) - 5, sy(t));
    });

    // 函数折线
    miniCtx.strokeStyle = type === "linear" ? "#2563eb" : "#dc2626";
    miniCtx.lineWidth = 2.4;
    miniCtx.lineJoin = "round";
    miniCtx.lineCap = "round";
    miniCtx.beginPath();
    var started = false;
    var samples = 400;
    for (var i = 0; i <= samples; i++) {
      var x = XMIN + (XMAX - XMIN) * i / samples;
      var y = f(x);
      if (!isFinite(y)) { started = false; continue; }
      var px = sx(x), py = sy(y);
      // 超出可视范围视为断点（避免穿过画面）
      if (py < -1000 || py > h + 1000) { started = false; continue; }
      if (!started) { miniCtx.moveTo(px, py); started = true; }
      else miniCtx.lineTo(px, py);
    }
    miniCtx.stroke();
  }

  /**
   * 按 1/2/5×10^n 选取“好看”的刻度步长（与 function-graph 共用算法）
   * 入参：raw 期望步长
   * 返回值：number
   */
  function niceStep(raw) {
    if (!(raw > 0) || !isFinite(raw)) return 1;
    var exp = Math.floor(Math.log10(raw));
    var base = raw / Math.pow(10, exp);
    var stepBase = base < 1.5 ? 1 : base < 3 ? 2 : base < 7 ? 5 : 10;
    return stepBase * Math.pow(10, exp);
  }

  /**
   * 重新渲染当前模板（强制刷新 KaTeX 与图像）
   * 入参：无
   * 返回值：无
   */
  function rerender() {
    if (!currentTemplate) return;
    update();
    var btn = $("btnRerender");
    var old = btn.textContent;
    btn.textContent = "✅ 已重渲染";
    setTimeout(function () { btn.textContent = old; }, 1200);
  }

  /**
   * 保存截图：含图像模板直接导出 canvas，无图像模板合成文字图
   * 入参：无
   * 返回值：无
   */
  function screenshot() {
    if (!currentTemplate) return;
    var link = document.createElement("a");
    var ts = new Date();
    var stamp = ts.getFullYear() + "-" +
      String(ts.getMonth() + 1).padStart(2, "0") + "-" +
      String(ts.getDate()).padStart(2, "0") + " " +
      String(ts.getHours()).padStart(2, "0") + String(ts.getMinutes()).padStart(2, "0");

    if (graphWrap.classList.contains("show")) {
      // 有图像：直接导出 miniCanvas
      link.download = "公式图像-" + currentTemplate.name.replace(/[\\/:*?"<>|]/g, "_") + " " + stamp + ".png";
      link.href = miniCanvas.toDataURL("image/png");
    } else {
      // 无图像：合成一张文字图（公式名 + 代入式 + 结果）
      var cv = document.createElement("canvas");
      var W = 900, H = 280;
      cv.width = W; cv.height = H;
      var c = cv.getContext("2d");
      c.fillStyle = "#ffffff";
      c.fillRect(0, 0, W, H);
      // 边框
      c.strokeStyle = "#6d28d9";
      c.lineWidth = 4;
      c.strokeRect(0, 0, W, H);
      // 公式名
      c.fillStyle = "#0f172a";
      c.font = "bold 24px -apple-system,'Segoe UI','Microsoft YaHei',sans-serif";
      c.textAlign = "center";
      c.fillText(currentTemplate.name, W / 2, 50);
      // 分隔线
      c.strokeStyle = "#cbd5e1";
      c.lineWidth = 1;
      c.beginPath();
      c.moveTo(80, 70);
      c.lineTo(W - 80, 70);
      c.stroke();
      // 代入式（文字版）
      c.fillStyle = "#1f2937";
      c.font = "18px Consolas, 'Courier New', monospace";
      var lines = wrapText(formulaText.textContent || lastValue, W - 120);
      lines.forEach(function (ln, i) {
        c.fillText(ln, W / 2, 110 + i * 26);
      });
      // 结果
      c.fillStyle = "#16a34a";
      c.font = "bold 26px -apple-system,'Segoe UI','Microsoft YaHei',sans-serif";
      c.fillText("结果：" + lastValue + (lastUnit ? " " + lastUnit : ""), W / 2, H - 30);
      link.download = "公式截图-" + currentTemplate.name.replace(/[\\/:*?"<>|]/g, "_") + " " + stamp + ".png";
      link.href = cv.toDataURL("image/png");
    }
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    // 按钮反馈
    var btn = $("btnScreenshot");
    var old = btn.textContent;
    btn.textContent = "✅ 已保存";
    setTimeout(function () { btn.textContent = old; }, 1400);
  }

  /**
   * 简单的文本换行（按字符宽度近似）
   * 入参：text 文本；maxWidth 最大宽度（像素，对应 font-size 已设置）
   * 返回值：Array<string> 行数组
   */
  function wrapText(text, maxWidth) {
    if (!text) return [];
    var lines = [];
    var current = "";
    for (var i = 0; i < text.length; i++) {
      var tryLine = current + text.charAt(i);
      // 近似：每行 60 字符（中文 2 字符宽度）
      if (tryLine.length > 60) {
        lines.push(current);
        current = text.charAt(i);
      } else {
        current = tryLine;
      }
    }
    if (current) lines.push(current);
    return lines.slice(0, 4);
  }

  /**
   * 复制代入数值后的 LaTeX（含剪贴板降级方案）
   * 入参：无
   * 返回值：无
   */
  function copyTex() {
    if (!lastTex) return;
    function fallback() {
      var ta = document.createElement("textarea");
      ta.value = lastTex;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      try { document.execCommand("copy"); } catch (e) { /* 忽略 */ }
      document.body.removeChild(ta);
    }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(lastTex).catch(fallback);
    } else {
      fallback();
    }
    var btn = $("btnCopyTex");
    var old = btn.textContent;
    btn.textContent = "✅ 已复制";
    setTimeout(function () { btn.textContent = old; }, 1400);
  }

  /* ============================================================
   * 事件绑定
   * ============================================================ */

  /** 名称搜索过滤 */
  $("searchInput").addEventListener("input", function (e) {
    var kw = e.target.value.trim().toLowerCase();
    navEl.querySelectorAll(".tpl-btn").forEach(function (b) {
      b.classList.toggle("hidden", kw !== "" && b.textContent.toLowerCase().indexOf(kw) === -1);
    });
  });

  /** 浏览按钮：滚动到模板列表并展开（已展开则聚焦搜索框） */
  $("btnBrowse").addEventListener("click", function () {
    $("searchInput").focus();
    navEl.scrollTop = 0;
  });

  /** 视图切换：图像 / 文字 */
  document.querySelectorAll(".tab-btn").forEach(function (btn) {
    btn.addEventListener("click", function () {
      document.querySelectorAll(".tab-btn").forEach(function (b) { b.classList.remove("active"); });
      btn.classList.add("active");
      var view = btn.dataset.view;
      formulaRender.hidden = (view !== "image");
      formulaText.hidden = (view !== "text");
    });
  });

  /** X/Y 范围输入框：变化后重绘图像 */
  ["gxMin", "gxMax", "gyMin", "gyMax"].forEach(function (id) {
    $(id).addEventListener("change", function () {
      if (currentTemplate && currentTemplate.graph && graphWrap.classList.contains("show")) {
        var read = readValues();
        if (read.ok) drawMiniGraph(currentTemplate.graph, read.values);
      }
    });
  });

  /** 操作按钮 */
  $("btnRerender").addEventListener("click", rerender);
  $("btnScreenshot").addEventListener("click", screenshot);
  $("btnCopyTex").addEventListener("click", copyTex);

  /** 全屏切换 */
  $("btnFullscreen").addEventListener("click", function () {
    var card = document.querySelector(".main-card");
    if (!document.fullscreenElement && !document.webkitFullscreenElement) {
      if (card.requestFullscreen) card.requestFullscreen();
      else if (card.webkitRequestFullscreen) card.webkitRequestFullscreen();
    } else {
      if (document.exitFullscreen) document.exitFullscreen();
      else if (document.webkitExitFullscreen) document.webkitExitFullscreen();
    }
  });
  document.addEventListener("fullscreenchange", function () {
    if (currentTemplate && currentTemplate.graph && graphWrap.classList.contains("show")) {
      var read = readValues();
      if (read.ok) drawMiniGraph(currentTemplate.graph, read.values);
    }
  });

  /** 窗口尺寸变化时重绘图像 */
  window.addEventListener("resize", function () {
    if (currentTemplate && currentTemplate.graph && graphWrap.classList.contains("show")) {
      var read = readValues();
      if (read.ok) drawMiniGraph(currentTemplate.graph, read.values);
    }
  });

  /* ============================================================
   * 初始化
   * ============================================================ */
  buildNav();
  selectTemplate(0);
})();
