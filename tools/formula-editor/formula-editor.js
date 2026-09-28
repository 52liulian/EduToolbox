/**
 * LaTeX 公式编辑器（EduToolbox）
 * 功能：
 *   1. 符号工具条按分块插入 LaTeX 片段（运算符 / 关系 / 希腊字母 / 上下标 / 分式 / 根号 / 求和 / 积分 / 矩阵 等）
 *   2. 实时调用 KaTeX 渲染预览，错误时显示红色错误提示
 *   3. 内置示例公式下拉，一键载入常用公式
 *   4. 复制 LaTeX 源码到剪贴板（含 file:// 降级方案）
 *   5. 导出 PNG（html2canvas）/ 导出 SVG（序列化预览节点 svg）
 *   6. 全屏模式：将预览区放大到全屏查看
 * 兼容：file:// 双击离线打开，KaTeX / html2canvas 均走本地 vendor
 */
(function () {
  "use strict";

  /** 按 id 获取 DOM 元素 */
  function $(id) {
    return document.getElementById(id);
  }

  var input = $("latexInput");
  var previewContent = $("previewContent");
  var previewBox = $("previewBox");
  var errorBox = $("errorBox");
  var statusEl = $("status");
  var displayModeToggle = $("displayMode");
  var autoRenderToggle = $("autoRender");
  var previewPane = $("previewPane");

  /**
   * 符号工具条配置
   * 每项格式：[按钮文字, 插入片段, 光标落点位置(相对片段开头)，省略则放到片段末尾]
   * 分块依据规范：运算符 / 关系 / 希腊字母 / 上下标 / 分式 / 根号 / 求和 / 积分 / 矩阵 等
   */
  var TOOLBAR = [
    {
      title: "🔺 上下标",
      items: [
        ["x²", "x^{}", 3],
        ["xₙ", "x_{}", 3],
        ["xₙ²", "x_{}^{}", 3],
        ["组合", "x_{}^{y}", 2]
      ]
    },
    {
      title: "➗ 分式根号",
      items: [
        ["a/b", "\\frac{}{}", 6],
        ["√", "\\sqrt{}", 6],
        ["ⁿ√", "\\sqrt[]{}", 6],
        ["∛", "\\sqrt[3]{}", 8]
      ]
    },
    {
      title: "➕ 运算符",
      items: [
        ["±", "\\pm "], ["×", "\\times "], ["÷", "\\div "], ["·", "\\cdot "],
        ["∗", "\\ast "], ["∘", "\\circ "], ["⊕", "\\oplus "], ["⊗", "\\otimes "]
      ]
    },
    {
      title: "⚖ 关系",
      items: [
        ["=", "="], ["≠", "\\ne "], ["≈", "\\approx "], ["≡", "\\equiv "],
        ["≤", "\\le "], ["≥", "\\ge "], ["∝", "\\propto "], ["∞", "\\infty "]
      ]
    },
    {
      title: "🔤 希腊字母",
      items: [
        ["α", "\\alpha "], ["β", "\\beta "], ["γ", "\\gamma "], ["δ", "\\delta "],
        ["ε", "\\epsilon "], ["ζ", "\\zeta "], ["η", "\\eta "], ["θ", "\\theta "],
        ["ι", "\\iota "], ["κ", "\\kappa "], ["λ", "\\lambda "], ["μ", "\\mu "],
        ["ν", "\\nu "], ["ξ", "\\xi "], ["π", "\\pi "], ["ρ", "\\rho "],
        ["σ", "\\sigma "], ["τ", "\\tau "], ["φ", "\\phi "], ["χ", "\\chi "],
        ["ψ", "\\psi "], ["ω", "\\omega "],
        ["Γ", "\\Gamma "], ["Δ", "\\Delta "], ["Θ", "\\Theta "],
        ["Λ", "\\Lambda "], ["Π", "\\Pi "], ["Σ", "\\Sigma "],
        ["Φ", "\\Phi "], ["Ψ", "\\Psi "], ["Ω", "\\Omega "]
      ]
    },
    {
      title: "∑ 求和积分",
      items: [
        ["∑", "\\sum_{}^{}", 5],
        ["∏", "\\prod_{}^{}", 6],
        ["∫", "\\int_{}^{}", 5],
        ["∬", "\\iint "],
        ["∭", "\\iiint "],
        ["∮", "\\oint "],
        ["∯", "\\oiint "],
        ["∂", "\\partial "],
        ["∇", "\\nabla "],
        ["d", "\\,d"]
      ]
    },
    {
      title: "📐 矩阵分段",
      wide: true,
      items: [
        ["2×2 矩阵", "\\begin{matrix} a & b \\\\ c & d \\end{matrix}"],
        ["3×3 矩阵", "\\begin{matrix} a & b & c \\\\ d & e & f \\\\ g & h & i \\end{matrix}"],
        ["bmatrix", "\\begin{bmatrix} a & b \\\\ c & d \\end{bmatrix}"],
        ["pmatrix", "\\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix}"],
        ["分段函数", "\\begin{cases} f(x) = x, & x \\ge 0 \\\\ -x, & x < 0 \\end{cases}"],
        ["数组", "\\begin{array}{cc} 1 & 2 \\\\ 3 & 4 \\end{array}"]
      ]
    },
    {
      title: "ƒ 函数",
      items: [
        ["sin", "\\sin "],
        ["cos", "\\cos "],
        ["tan", "\\tan "],
        ["cot", "\\cot "],
        ["log", "\\log "],
        ["ln", "\\ln "],
        ["exp", "\\exp "],
        ["极限", "\\lim_{}^{}", 5],
        ["最值", "\\max_{} ", 5],
        ["最小", "\\min_{} ", 5]
      ]
    },
    {
      title: "⃗ 上划与箭头",
      items: [
        ["上划线", "\\overline{}", 10],
        ["向量", "\\vec{}", 5],
        ["帽", "\\hat{}", 5],
        ["短划", "\\bar{}", 5],
        ["点", "\\dot{}", 5],
        ["→", "\\to "],
        ["←", "\\leftarrow "],
        ["↔", "\\leftrightarrow "],
        ["⇒", "\\Rightarrow "],
        ["⇐", "\\Leftarrow "],
        ["⇔", "\\Leftrightarrow "],
        ["↑", "\\uparrow "],
        ["↓", "\\downarrow "]
      ]
    },
    {
      title: "⊆ 集合与逻辑",
      items: [
        ["∈", "\\in "], ["∉", "\\notin "], ["⊂", "\\subset "], ["⊆", "\\subseteq "],
        ["⊃", "\\supset "], ["⊇", "\\supseteq "], ["∪", "\\cup "], ["∩", "\\cap "],
        ["∅", "\\emptyset "], ["∀", "\\forall "], ["∃", "\\exists "],
        ["¬", "\\neg "], ["∧", "\\wedge "], ["∨", "\\vee "], ["⇒", "\\implies "]
      ]
    },
    {
      title: "🎨 排版",
      items: [
        ["空格", "\\ "],
        ["quad", "\\quad "],
        ["qquad", "\\qquad "],
        ["左对齐", "\\left "],
        ["右对齐", "\\right "],
        ["绝对值", "\\left| \\right|", 7],
        ["字号", "\\displaystyle "],
        ["文本", "\\text{}", 6]
      ]
    }
  ];

  /** 示例公式：[下拉名称, LaTeX 源码] */
  var EXAMPLES = [
    ["基础结构", null],
    ["二次方程求根公式", "x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}"],
    ["勾股定理", "a^2 + b^2 = c^2"],
    ["等差数列求和", "\\sum_{i=1}^{n} i = \\frac{n(n+1)}{2}"],
    ["三角恒等式", "\\sin^2\\theta + \\cos^2\\theta = 1"],
    ["重要极限", "\\lim_{x \\to 0} \\frac{\\sin x}{x} = 1"],
    ["高等数学", null],
    ["高斯积分", "\\int_{0}^{\\infty} e^{-x^2}\\,dx = \\frac{\\sqrt{\\pi}}{2}"],
    ["泰勒展开", "e^x = \\sum_{n=0}^{\\infty} \\frac{x^n}{n!}"],
    ["链式法则", "\\frac{dy}{dx} = \\frac{dy}{du} \\cdot \\frac{du}{dx}"],
    ["分部积分", "\\int u\\,dv = uv - \\int v\\,du"],
    ["麦克斯韦方程", "\\oint_S \\mathbf{E} \\cdot d\\mathbf{A} = \\frac{Q}{\\varepsilon_0}"],
    ["欧拉公式", "e^{i\\pi} + 1 = 0"],
    ["希腊字母", null],
    ["希腊字母集合", "\\alpha, \\beta, \\gamma, \\delta, \\epsilon, \\zeta, \\eta, \\theta"],
    ["大写希腊", "\\Gamma \\Delta \\Theta \\Lambda \\Pi \\Sigma \\Phi \\Omega"],
    ["矩阵与线性代数", null],
    ["2×2 矩阵", "A = \\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix}"],
    ["行列式", "\\det(A) = \\begin{vmatrix} a & b \\\\ c & d \\end{vmatrix} = ad - bc"],
    ["特征方程", "\\det(A - \\lambda I) = 0"],
    ["概率与统计", null],
    ["期望值", "E(X) = \\sum_{i=1}^{n} x_i p_i"],
    ["正态分布", "f(x) = \\frac{1}{\\sigma\\sqrt{2\\pi}} e^{-\\frac{(x-\\mu)^2}{2\\sigma^2}}"],
    ["方差", "\\mathrm{Var}(X) = E\\left[(X - \\mu)^2\\right]"],
    ["物理化学", null],
    ["牛顿第二定律", "F = ma,\\quad p = mv"],
    ["动能定理", "E_k = \\frac{1}{2}mv^2"],
    ["理想气体方程", "PV = nRT"],
    ["化学反应速率", "v = k[A]^m[B]^n"]
  ];

  /** 默认载入的示例公式 */
  var DEFAULT_FORMULA = "x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}";

  /**
   * 构建符号工具条按钮
   * 入参：无（读取全局 TOOLBAR 配置）
   * 返回值：无（直接写入 DOM）
   */
  function buildToolbar() {
    var wrap = $("toolbarGroups");
    TOOLBAR.forEach(function (group) {
      var row = document.createElement("div");
      row.className = "tb-group";
      var title = document.createElement("span");
      title.className = "tb-group-title";
      title.textContent = group.title;
      row.appendChild(title);
      group.items.forEach(function (item) {
        var btn = document.createElement("button");
        btn.type = "button";
        btn.className = "sym-btn" + (group.wide ? " wide" : "");
        btn.textContent = item[0];
        btn.title = item[1] || "";
        btn.addEventListener("click", function () {
          insertSnippet(item[1], item[2]);
        });
        row.appendChild(btn);
      });
      wrap.appendChild(row);
    });
  }

  /**
   * 构建示例下拉选项（支持分组占位标题）
   * 入参：无
   * 返回值：无
   */
  function buildExampleSelect() {
    var sel = $("exampleSelect");
    EXAMPLES.forEach(function (ex, idx) {
      var opt = document.createElement("option");
      opt.value = String(idx);
      if (ex[1] === null) {
        opt.disabled = true;
        opt.style.fontWeight = "600";
      }
      opt.textContent = ex[0];
      sel.appendChild(opt);
    });
    sel.addEventListener("change", function () {
      if (sel.value === "") return;
      var picked = EXAMPLES[Number(sel.value)];
      if (!picked || picked[1] === null) return;
      input.value = picked[1];
      render();
      input.focus();
      sel.value = "";
    });
  }

  /**
   * 在 textarea 光标处插入 LaTeX 片段；若有选区则把选区内容放到光标落点
   * 入参：snippet 片段字符串；cursorPos 插入后光标位置（相对片段开头），省略则置于片段末尾
   * 返回值：无
   */
  function insertSnippet(snippet, cursorPos) {
    var start = input.selectionStart;
    var end = input.selectionEnd;
    var value = input.value;
    var selected = value.slice(start, end);
    var pos = typeof cursorPos === "number" ? cursorPos : snippet.length;
    var before = value.slice(0, start);
    var after = value.slice(end);
    var inserted = snippet.slice(0, pos) + selected + snippet.slice(pos);
    input.value = before + inserted + after;
    var caret = before.length + pos + selected.length;
    input.focus();
    input.setSelectionRange(caret, caret);
    render();
  }

  /**
   * 使用 KaTeX 实时渲染当前源码；错误时红色提示
   * 入参：无
   * 返回值：无
   */
  function render() {
    var tex = input.value;
    errorBox.classList.remove("show");
    statusEl.classList.remove("error");
    if (tex.trim() === "") {
      previewContent.innerHTML = '<span class="preview-placeholder">公式预览将显示在这里…</span>';
      statusEl.textContent = "就绪";
      return;
    }
    var displayMode = displayModeToggle.checked;
    // 先用严格模式探测错误信息，再用宽松模式渲染（KaTeX 会把错误部分标红）
    var hasError = false;
    var message = "";
    try {
      katex.render(tex, document.createElement("div"), {
        displayMode: displayMode,
        throwOnError: true
      });
    } catch (err) {
      hasError = true;
      message = err && err.message ? err.message : String(err);
    }
    previewContent.innerHTML = "";
    katex.render(tex, previewContent, {
      displayMode: displayMode,
      throwOnError: false,
      errorColor: "#dc2626",
      output: "html"
    });
    if (hasError) {
      statusEl.textContent = "语法错误";
      statusEl.classList.add("error");
      errorBox.textContent = "⚠️ " + message;
      errorBox.classList.add("show");
    } else {
      statusEl.textContent = "渲染正常";
    }
  }

  /**
   * 复制 LaTeX 源码到剪贴板（含 file:// 下的降级方案）
   * 入参：无
   * 返回值：无
   */
  function copySource() {
    var text = input.value;
    if (!text.trim()) {
      toast("⚠️ 当前没有可复制的 LaTeX 源码");
      return;
    }
    function fallback() {
      var ta = document.createElement("textarea");
      ta.value = text;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      try { document.execCommand("copy"); } catch (e) { /* 忽略 */ }
      document.body.removeChild(ta);
    }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(function () {
        toast("✅ 已复制 LaTeX 源码");
      }, function () {
        fallback();
        toast("✅ 已复制 LaTeX 源码");
      });
    } else {
      fallback();
      toast("✅ 已复制 LaTeX 源码");
    }
  }

  /**
   * 轻量提示条
   * 入参：msg 提示文字
   * 返回值：无
   */
  function toast(msg) {
    var el = document.createElement("div");
    el.className = "fe-toast";
    el.textContent = msg;
    document.body.appendChild(el);
    requestAnimationFrame(function () { el.style.opacity = "1"; });
    setTimeout(function () {
      el.style.opacity = "0";
      setTimeout(function () {
        if (el.parentNode) el.parentNode.removeChild(el);
      }, 300);
    }, 1600);
  }

  /**
   * 将渲染容器用 html2canvas 截为白底 2 倍缩放 PNG 并下载
   * 入参：无
   * 返回值：无
   */
  function exportPng() {
    if (input.value.trim() === "") {
      toast("⚠️ 请先输入公式");
      return;
    }
    if (typeof html2canvas !== "function") {
      toast("⚠️ 截图组件未加载");
      return;
    }
    toast("⏳ 正在生成 PNG…");
    html2canvas(previewBox, {
      backgroundColor: "#ffffff",
      scale: 2,
      useCORS: true,
      logging: false
    }).then(function (canvas) {
      var link = document.createElement("a");
      link.download = "formula-" + Date.now() + ".png";
      link.href = canvas.toDataURL("image/png");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast("🖼️ 已导出 PNG");
    }).catch(function (err) {
      toast("⚠️ 导出失败：" + (err && err.message ? err.message : "未知错误"));
    });
  }

  /**
   * 导出 SVG：从预览区抽取第一个 <svg> 节点，序列化后下载
   * 入参：无
   * 返回值：无
   * 异常场景：若没有 svg 节点则提示用户
   */
  function exportSvg() {
    if (input.value.trim() === "") {
      toast("⚠️ 请先输入公式");
      return;
    }
    var svgNode = previewContent.querySelector("svg");
    if (!svgNode) {
      // 兜底：用 KaTeX 离屏生成 SVG
      try {
        var holder = document.createElement("div");
        katex.render(input.value, holder, {
          displayMode: displayModeToggle.checked,
          throwOnError: false,
          output: "html"
        });
        svgNode = holder.querySelector("svg");
      } catch (e) {
        toast("⚠️ 没有可导出的 SVG");
        return;
      }
    }
    if (!svgNode) {
      toast("⚠️ 当前公式无可导出的 SVG");
      return;
    }
    // 克隆并补充 xmlns 以便独立打开
    var clone = svgNode.cloneNode(true);
    clone.setAttribute("xmlns", "http://www.w3.org/2000/svg");
    clone.setAttribute("xmlns:xlink", "http://www.w3.org/1999/xlink");
    // 背景白底
    var bg = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    bg.setAttribute("width", "100%");
    bg.setAttribute("height", "100%");
    bg.setAttribute("fill", "#ffffff");
    clone.insertBefore(bg, clone.firstChild);
    var svgText = new XMLSerializer().serializeToString(clone);
    var blob = new Blob(['<?xml version="1.0" encoding="UTF-8"?>\n', svgText], { type: "image/svg+xml" });
    var url = URL.createObjectURL(blob);
    var link = document.createElement("a");
    link.download = "formula-" + Date.now() + ".svg";
    link.href = url;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
    toast("📐 已导出 SVG");
  }

  /** 清空输入与预览 */
  function clearAll() {
    input.value = "";
    render();
    input.focus();
    toast("🗑️ 已重置");
  }

  // —— 事件绑定 ——
  // 自动渲染模式下输入即渲染；非自动模式下用户需手动点击"生成预览"
  input.addEventListener("input", function () {
    if (autoRenderToggle.checked) render();
  });
  // 渲染模式切换立即刷新
  displayModeToggle.addEventListener("change", render);
  // 自动渲染开关切换时也刷新一次
  autoRenderToggle.addEventListener("change", function () {
    if (autoRenderToggle.checked) render();
  });

  $("btnRender").addEventListener("click", render);
  $("btnCopy").addEventListener("click", copySource);
  $("btnPng").addEventListener("click", exportPng);
  $("btnSvg").addEventListener("click", exportSvg);
  $("btnClear").addEventListener("click", clearAll);

  // ⛶ 全屏 / ⚙ 隐藏源码栏 由共享模块接管（ESC 退出由浏览器原生处理）

  // Tab 键插入两个空格而非跳出输入框
  input.addEventListener("keydown", function (e) {
    if (e.key === "Tab") {
      e.preventDefault();
      insertSnippet("  ");
    }
  });

  // —— 初始化 ——
  buildToolbar();
  buildExampleSelect();
  input.value = DEFAULT_FORMULA;
  render();

  /* 舞台右上角工具栏（⛶ 全屏 / ⚙ 隐藏设置）：全屏目标是 #previewPane（预览栏）自身，
     双栏容器 .editor-grid 加 setup-hidden 时变单栏并隐藏左侧源码栏。 */
  if (window.EduToolStageToolbar && previewPane) {
    window.EduToolStageToolbar.init({ stage: "#previewPane", panelHost: ".editor-grid" });
  }
})();
