/* EduToolbox · 凹凸工坊手写文稿生成器
 * -----------------------------------------------------------------------------
 * 功能：
 *   1. 上传 Word(.docx) / PDF / 图片 / 纯文本，本地解析为文本
 *   2. 6 种 Google 开源手写字体（woff2 本地切片，离线可用）
 *   3. 多种纸张背景：空白/横线/方格/点阵/红格子稿纸/单红线信稿纸/草稿纸/A4 纵横/B5/A3
 *   4. 基础参数：字号、行距、字间距、每行字数、倾斜角度、墨水颜色
 *   5. 高级效果（参考 autohanding.com）：
 *      - 随机勾画涂改概率：模拟手写时偶尔涂改/勾画
 *      - 文字位置凌乱度：每个字上下左右偏移
 *      - 字体笔画凌乱度：字号缩放与旋转扰动
 *   6. Canvas 本地渲染 → 预览 / 下载 PNG / 下载 PDF
 *
 * 架构：纯前端 IIFE 模块，无后端依赖，支持 file:// 协议离线打开
 */

(function () {
  "use strict";

  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));

  /* ========== 字体定义 ==========
   * 所有字体均通过 fonts/handwrite-fonts.css 本地引入（woff2 切片，离线可用）
   * Family 名称与 CSS @font-face 中定义一致
   */
  const FONTS = [
    { id: "liujianmaocao", name: "中文·毛笔草", family: "'Liu Jian Mao Cao', cursive", sample: "春江潮水连海平" },
    { id: "zhimangxing",  name: "中文·硬笔楷", family: "'Zhi Mang Xing', cursive",   sample: "明月清风入怀" },
    { id: "longcang",     name: "中文·行书",  family: "'Long Cang', cursive",          sample: "行云流水自然" },
    { id: "mashanzheng",  name: "中文·稚趣",  family: "'Ma Shan Zheng', cursive",     sample: "童趣天真烂漫" },
    { id: "dancingscript",name: "英文·连笔",  family: "'Dancing Script', cursive",    sample: "Handwriting" },
    { id: "caveat",       name: "英文·印刷",  family: "'Caveat', cursive",             sample: "Notebook" },
  ];

  /* ========== 纸张定义 ==========
   * thumb：缩略图背景色（用于选择卡预览）
   * draw：渲染函数标识，对应 drawPaper 中的分支
   */
  const PAPERS = [
    { id: "plain",    name: "空白纸",    thumb: "#ffffff" },
    { id: "lined",    name: "横线纸",    thumb: "repeating-linear-gradient(0deg,#fff 0 22px,#e0e4ec 22px 23px)" },
    { id: "grid",     name: "方格纸",    thumb: "repeating-linear-gradient(0deg,#fff 0 22px,#e0e4ec 22px 23px),repeating-linear-gradient(90deg,#fff 0 22px,#e0e4ec 22px 23px)" },
    { id: "dot",      name: "点阵纸",    thumb: "radial-gradient(circle, #cfd6e4 1px, #fff 1.5px) 0 0 / 18px 18px" },
    { id: "redgrid",  name: "红格稿纸",  thumb: "repeating-linear-gradient(0deg,#fff 0 22px,#ffb8b8 22px 23px),repeating-linear-gradient(90deg,#fff 0 22px,#ffb8b8 22px 23px)" },
    { id: "letter",   name: "单红线信稿", thumb: "repeating-linear-gradient(0deg,#fff 0 26px,#e0e4ec 26px 27px)" },
    { id: "draft",    name: "草稿纸",    thumb: "#f5f0e0" },
    { id: "a4-v",     name: "A4 纵向",    thumb: "#ffffff" },
    { id: "a4-h",     name: "A4 横向",    thumb: "#ffffff" },
  ];

  /* ========== 全局状态 ==========
   * 所有用户可调参数集中管理，便于持久化与重置
   */
  const state = {
    font: FONTS[1].family,
    fontSize: 22,
    lineHeight: 1.8,
    gap: 0,
    skew: -4,
    color: "#1a1a1a",
    paper: "lined",
    cpl: 24,        // 每行字数（自动换行参考）
    scrawl: 3,      // 涂改概率 %
    messy: 10,      // 位置凌乱度 %
    stroke: 5,      // 笔画凌乱度 %
    text: "",
  };

  /* ========== 工具：种子伪随机 ==========
   * 基于字符索引生成稳定的伪随机数，保证同一文本每次渲染结果一致
   * @param {number} seed - 种子（通常是字符索引）
   * @returns {number} 0~1 之间的伪随机数
   */
  function seededRand(seed) {
    const x = Math.sin(seed * 12.9898) * 43758.5453;
    return x - Math.floor(x);
  }

  /* ========== 字体加载 ==========
   * 字体已通过 fonts/handwrite-fonts.css 本地引入，离线可用
   * 此处仅等待字体就绪后触发一次重绘，不请求任何在线字体服务
   */
  function loadFonts() {
    const families = FONTS.map(f => f.family.replace(/['",].*$/, "").trim());
    try {
      if (document.fonts && document.fonts.load) {
        Promise.all(families.map(f => document.fonts.load(`16px "${f}"`).catch(() => {})))
          .then(() => document.fonts.ready)
          .then(() => render())
          .catch(() => {});
      }
    } catch (e) { /* 旧浏览器无 FontFaceSet，忽略 */ }
  }

  /* ========== 渲染字体选择卡 ========== */
  function renderFonts() {
    $("#fontList").innerHTML = FONTS.map((f, i) => `
      <div class="font-card ${i === 1 ? "active" : ""}" data-family="${f.family}" data-id="${f.id}">
        <div class="fc-name">${f.name}</div>
        <div class="fc-sample" style="font-family:${f.family}">${f.sample}</div>
      </div>`).join("");
    $$(".font-card").forEach(c => c.onclick = () => {
      $$(".font-card").forEach(x => x.classList.remove("active"));
      c.classList.add("active");
      state.font = c.dataset.family;
      render();
    });
  }

  /* ========== 渲染纸张选择卡 ========== */
  function renderPapers() {
    $("#paperList").innerHTML = PAPERS.map((p, i) => `
      <div class="paper-card ${i === 0 ? "active" : ""}" data-paper="${p.id}">
        <div class="pc-thumb" style="background:${p.thumb}"></div>
        <div>${p.name}</div>
      </div>`).join("");
    $$(".paper-card").forEach(c => c.onclick = () => {
      $$(".paper-card").forEach(x => x.classList.remove("active"));
      c.classList.add("active");
      state.paper = c.dataset.paper;
      $("#paper").dataset.paper = c.dataset.paper;
      render();
    });
  }

  /* ========== 绑定基础参数滑块 ==========
   * map 数组定义：[元素ID, 状态键, 数值显示ID, 格式化函数]
   */
  function bindParams() {
    const map = [
      ["p-size",   "fontSize",   "v-size",   v => v],
      ["p-line",   "lineHeight", "v-line",   v => Number(v).toFixed(1)],
      ["p-gap",    "gap",        "v-gap",    v => v],
      ["p-skew",   "skew",       "v-skew",   v => v + "°"],
      ["p-cpl",    "cpl",        "v-cpl",    v => v],
      ["p-scrawl", "scrawl",     "v-scrawl", v => v],
      ["p-messy",  "messy",      "v-messy",  v => v],
      ["p-stroke", "stroke",     "v-stroke", v => v],
    ];
    map.forEach(([id, key, valId, fmt]) => {
      const el = $("#" + id);
      el.oninput = () => {
        state[key] = parseFloat(el.value);
        $("#" + valId).textContent = fmt(el.value);
        render();
      };
    });
    $$(".color-swatch").forEach(s => s.onclick = () => {
      $$(".color-swatch").forEach(x => x.classList.remove("active"));
      s.classList.add("active");
      state.color = s.dataset.color;
      render();
    });
  }

  /* ========== 绑定标签页切换 ========== */
  function bindTabs() {
    $$(".tab").forEach(t => t.onclick = () => {
      $$(".tab").forEach(x => x.classList.remove("active"));
      t.classList.add("active");
      $$(".tab-pane").forEach(p => p.classList.remove("active"));
      $("#pane-" + t.dataset.tab).classList.add("active");
    });
  }

  /* ========== 绑定文件上传 ========== */
  function bindFile() {
    const dz = $("#dropzone"), fi = $("#fileInput");
    ["dragover", "dragenter"].forEach(ev =>
      dz.addEventListener(ev, e => { e.preventDefault(); dz.classList.add("dragover"); }));
    ["dragleave", "drop"].forEach(ev =>
      dz.addEventListener(ev, e => { e.preventDefault(); dz.classList.remove("dragover"); }));
    dz.addEventListener("drop", e => {
      const f = e.dataTransfer.files[0];
      if (f) handleFile(f);
    });
    fi.addEventListener("change", e => {
      const f = e.target.files[0];
      if (f) handleFile(f);
    });
  }

  /**
   * 显示文件解析结果信息
   * @param {string} name - 文件名
   * @param {number} len - 解析得到的字符数
   */
  function setFileInfo(name, len) {
    const info = $("#fileInfo");
    info.hidden = false;
    info.classList.remove("error");
    info.textContent = `✅ 已读取：${name}（${len} 字）`;
  }

  /**
   * 显示文件解析错误信息
   * @param {string} name - 文件名
   * @param {string} msg - 错误信息
   */
  function setFileError(name, msg) {
    const info = $("#fileInfo");
    info.hidden = false;
    info.classList.add("error");
    info.textContent = `❌ 解析失败：${name}（${msg}）`;
  }

  /**
   * 解析上传的文件，提取文本内容
   * 支持：Word(.docx) → mammoth；PDF → pdf.js；图片 → OCR 兜底提示；纯文本 → file.text()
   * @param {File} file - 用户上传的文件对象
   */
  async function handleFile(file) {
    const name = file.name.toLowerCase();
    try {
      if (name.endsWith(".docx")) {
        const buf = await file.arrayBuffer();
        const res = await mammoth.extractRawText({ arrayBuffer: buf });
        state.text = (res.value || "").trim();
      } else if (name.endsWith(".pdf")) {
        const buf = await file.arrayBuffer();
        const pdf = await pdfjsLib.getDocument({ data: buf.slice(0) }).promise;
        let txt = "";
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const tc = await page.getTextContent();
          txt += tc.items.map(it => it.str).join(" ") + "\n";
        }
        state.text = txt.trim();
      } else if (name.endsWith(".txt") || file.type.startsWith("text/")) {
        state.text = await file.text();
      } else if (file.type.startsWith("image/")) {
        /* 图片 OCR 需要后端 AI 支持，纯前端无法实现，提示用户 */
        setFileError(file.name, "图片识别需要 AI 后端，本工具暂不支持，请粘贴文字或上传 Word/PDF");
        return;
      } else {
        state.text = await file.text();
      }
      $("#textInput").value = state.text;
      setFileInfo(file.name, state.text.length);
      render();
    } catch (e) {
      setFileError(file.name, e.message || String(e));
    }
  }

  /* ========== 文本换行 ==========
   * 按每行字数自动换行，标点符号不留在行首
   * @param {string} text - 原始文本
   * @param {number} cpl - 每行字数
   * @returns {string[]} 换行后的行数组
   */
  function wrapText(text, cpl) {
    const lines = [];
    const PUNCT = "，。！？；：、,.!?;:\"''（）()【】《》";
    text.split(/\r?\n/).forEach(raw => {
      if (raw === "") { lines.push(""); return; }
      let cur = "";
      for (const ch of raw) {
        cur += ch;
        if (PUNCT.includes(ch) || cur.length >= cpl) {
          lines.push(cur);
          cur = "";
        }
      }
      if (cur) lines.push(cur);
    });
    return lines;
  }

  /* ========== 核心：Canvas 渲染手写效果 ==========
   * 1. 计算画布尺寸（A4 96dpi 宽度 794px）
   * 2. 绘制纸张背景纹理
   * 3. 逐字渲染，应用：
   *    - 字体
   *    - 字号、行距、字间距
   *    - 倾斜角度（全局）
   *    - 位置凌乱度（每字随机偏移）
   *    - 笔画凌乱度（每字随机缩放/旋转）
   *    - 涂改概率（随机勾画/涂改笔触）
   */
  function render() {
    const text = ($("#textInput").value || "").trim();
    state.text = text;
    const canvas = $("#canvas"), ctx = canvas.getContext("2d");
    const paperEl = $("#paper");

    const W = 794;                              // A4 宽度 96dpi
    const padX = 70, padTop = 80;
    const lineH = state.fontSize * state.lineHeight;
    const lines = wrapText(text, state.cpl);
    const H = Math.max(600, padTop + lines.length * lineH + 80);

    canvas.width = W; canvas.height = H;
    paperEl.dataset.paper = state.paper;

    /* 1. 绘制纸张背景 */
    drawPaper(ctx, W, H, state.paper, lineH, padX, padTop);

    /* 2. 逐字渲染（手写模拟） */
    ctx.fillStyle = state.color;
    ctx.textBaseline = "alphabetic";

    /* 凌乱度转换为实际像素/角度系数 */
    const messyFactor  = state.messy / 100;     // 0~1
    const strokeFactor = state.stroke / 100;   // 0~1
    const scrawlProb   = state.scrawl / 100;   // 0~1

    const baseSkew = state.skew * Math.PI / 180;

    let x = padX, y = padTop + state.fontSize;
    let lineCharIdx = 0;                       // 当前行内字符索引

    const chars = Array.from(text);

    chars.forEach((ch, i) => {
      /* 换行处理 */
      if (ch === "\n") {
        x = padX;
        y += lineH;
        lineCharIdx = 0;
        return;
      }
      /* 超过每行字数自动换行 */
      if (lineCharIdx >= state.cpl) {
        x = padX;
        y += lineH;
        lineCharIdx = 0;
      }

      /* 伪随机扰动（基于全局字符索引，保证稳定） */
      const r1 = seededRand(i * 2.1 + 1);
      const r2 = seededRand(i * 3.7 + 7);
      const r3 = seededRand(i * 5.3 + 13);
      const r4 = seededRand(i * 7.1 + 23);

      /* 位置凌乱度：每字上下左右偏移 */
      const maxOffset = state.fontSize * 0.4 * messyFactor;
      const jitterX = (r1 - 0.5) * 2 * maxOffset;
      const jitterY = (r2 - 0.5) * 2 * maxOffset;

      /* 笔画凌乱度：每字缩放与旋转 */
      const scale = 1 + (r3 - 0.5) * 0.3 * strokeFactor;
      const extraRot = (r4 - 0.5) * 0.2 * strokeFactor;
      const rot = baseSkew + extraRot;

      ctx.save();
      ctx.translate(x + jitterX, y + jitterY);
      ctx.rotate(rot);
      ctx.scale(scale, scale);
      ctx.font = `${state.fontSize}px ${state.font}`;
      ctx.fillText(ch, 0, 0);
      ctx.restore();

      /* 涂改概率：随机在文字上叠加涂改笔触 */
      if (scrawlProb > 0 && seededRand(i * 11.3 + 31) < scrawlProb) {
        drawScrawl(ctx, x + jitterX, y + jitterY, state.fontSize, ch);
      }

      x += state.fontSize * (state.gap / state.fontSize + 1) + 2;
      lineCharIdx++;
    });
  }

  /* ========== 绘制涂改笔触 ==========
   * 模拟手写时偶尔涂改/勾画的效果
   * 策略：随机选择"划线删除"/"涂黑覆盖"/"圈选勾画"三种模式
   * @param {CanvasRenderingContext2D} ctx
   * @param {number} x - 字符 x 坐标
   * @param {number} y - 字符 y 坐标
   * @param {number} size - 字号
   * @param {string} ch - 字符内容（决定涂改样式）
   */
  function drawScrawl(ctx, x, y, size, ch) {
    const r = seededRand(ch.charCodeAt(0) * 1.7 + 41);
    ctx.save();
    ctx.strokeStyle = state.color;
    ctx.fillStyle = state.color;
    ctx.lineWidth = Math.max(1.5, size * 0.08);
    ctx.lineCap = "round";

    if (r < 0.4) {
      /* 模式1：横向划线删除 */
      ctx.beginPath();
      ctx.moveTo(x - size * 0.2, y - size * 0.3);
      ctx.lineTo(x + size * 0.8, y - size * 0.3);
      ctx.stroke();
    } else if (r < 0.7) {
      /* 模式2：涂黑覆盖（小色块） */
      ctx.globalAlpha = 0.75;
      ctx.fillRect(x - size * 0.15, y - size * 0.85, size * 0.95, size * 0.85);
    } else {
      /* 模式3：圈选勾画（不规则圆圈） */
      ctx.beginPath();
      const cx = x + size * 0.35, cy = y - size * 0.35, rad = size * 0.55;
      for (let a = 0; a < Math.PI * 2; a += 0.3) {
        const rr = rad * (0.85 + seededRand(a * 10 + 1) * 0.3);
        const px = cx + Math.cos(a) * rr;
        const py = cy + Math.sin(a) * rr;
        if (a === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
      }
      ctx.closePath();
      ctx.stroke();
    }
    ctx.restore();
  }

  /* ========== 绘制纸张背景 ==========
   * 根据纸张类型绘制不同纹理：横线/方格/点阵/红格稿纸/单红线信稿/草稿纸/A4 等
   * @param {CanvasRenderingContext2D} ctx
   * @param {number} W - 画布宽
   * @param {number} H - 画布高
   * @param {string} paper - 纸张类型 ID
   * @param {number} lineH - 行高
   * @param {number} padX - 左右边距
   * @param {number} padTop - 顶部边距
   */
  function drawPaper(ctx, W, H, paper, lineH, padX, padTop) {
    /* 基础白色背景 */
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, W, H);

    const lineColor = "#e0e4ec";
    const redColor = "#ffb8b8";
    const dotColor = "#cfd6e4";
    const draftColor = "#f5f0e0";
    const letterRed = "#e85d5d";

    ctx.strokeStyle = lineColor;
    ctx.lineWidth = 1;

    if (paper === "lined") {
      /* 横线纸：等间距水平线 */
      for (let y = padTop; y < H - 40; y += lineH) {
        ctx.beginPath();
        ctx.moveTo(40, y);
        ctx.lineTo(W - 40, y);
        ctx.stroke();
      }
    } else if (paper === "grid") {
      /* 方格纸：等间距横竖线 */
      const step = lineH;
      for (let x = 40; x < W - 30; x += step) {
        ctx.beginPath(); ctx.moveTo(x, 30); ctx.lineTo(x, H - 30); ctx.stroke();
      }
      for (let y = 30; y < H - 30; y += step) {
        ctx.beginPath(); ctx.moveTo(40, y); ctx.lineTo(W - 30, y); ctx.stroke();
      }
    } else if (paper === "dot") {
      /* 点阵纸：交点处画小圆点 */
      ctx.fillStyle = dotColor;
      for (let y = padTop; y < H - 40; y += lineH) {
        for (let x = 50; x < W - 40; x += state.fontSize * 1.2) {
          ctx.beginPath();
          ctx.arc(x, y, 1.6, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    } else if (paper === "redgrid") {
      /* 红格子稿纸（400字/页风格）：红色网格 */
      ctx.strokeStyle = redColor;
      const step = lineH;
      for (let x = 40; x < W - 30; x += step) {
        ctx.beginPath(); ctx.moveTo(x, 30); ctx.lineTo(x, H - 30); ctx.stroke();
      }
      for (let y = 30; y < H - 30; y += step) {
        ctx.beginPath(); ctx.moveTo(40, y); ctx.lineTo(W - 30, y); ctx.stroke();
      }
      /* 左侧装订红线 */
      ctx.strokeStyle = letterRed;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(40, 20);
      ctx.lineTo(40, H - 20);
      ctx.stroke();
      ctx.lineWidth = 1;
      ctx.strokeStyle = lineColor;
    } else if (paper === "letter") {
      /* 单红线信稿纸：左侧红色装订线 + 横线 */
      ctx.strokeStyle = letterRed;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(50, 20);
      ctx.lineTo(50, H - 20);
      ctx.stroke();
      ctx.lineWidth = 1;
      ctx.strokeStyle = lineColor;
      for (let y = padTop; y < H - 40; y += lineH) {
        ctx.beginPath();
        ctx.moveTo(60, y);
        ctx.lineTo(W - 40, y);
        ctx.stroke();
      }
    } else if (paper === "draft") {
      /* 草稿纸：米黄色背景，轻微横线 */
      ctx.fillStyle = draftColor;
      ctx.fillRect(0, 0, W, H);
      ctx.strokeStyle = "rgba(180,170,140,0.25)";
      for (let y = padTop; y < H - 40; y += lineH) {
        ctx.beginPath();
        ctx.moveTo(40, y);
        ctx.lineTo(W - 40, y);
        ctx.stroke();
      }
    } else if (paper === "a4-v" || paper === "a4-h") {
      /* A4 纵/横向：纯白 + 边框 */
      ctx.strokeStyle = "#f0f0f0";
      ctx.lineWidth = 1;
      ctx.strokeRect(20, 20, W - 40, H - 40);
    }
    /* plain 空白纸：仅白色背景，不绘制额外纹理 */
  }

  /* ========== 导出 PNG ========== */
  function exportPNG() {
    const canvas = $("#canvas");
    const link = document.createElement("a");
    link.download = "手写文稿.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  }

  /* ========== 导出 PDF ==========
   * 使用 jsPDF 将 Canvas 转为 PDF
   * 异常时降级为 PNG 导出
   */
  function exportPDF() {
    const canvas = $("#canvas");
    const { jsPDF } = window.jspdf || {};
    if (!window.jspdf) {
      exportPNG();
      alert("PDF 库未加载，已改为导出 PNG。");
      return;
    }
    const img = canvas.toDataURL("image/png");
    const pdf = new jsPDF({ unit: "px", format: [canvas.width, canvas.height] });
    pdf.addImage(img, "PNG", 0, 0, canvas.width, canvas.height);
    pdf.save("手写文稿.pdf");
  }

  /* ========== 初始化 ========== */
  function init() {
    loadFonts();
    renderFonts();
    renderPapers();
    bindParams();
    bindTabs();
    bindFile();

    /* 首次用预置文字渲染 */
    $("#textInput").value = "床前明月光，疑是地上霜。\n举头望明月，低头思故乡。\n\n—— 李白《静夜思》";
    $("#paper").dataset.paper = state.paper;

    $("#btnPreview").onclick = render;
    $("#btnExportPng").onclick = exportPNG;
    $("#btnExportPdf").onclick = exportPDF;

    /* 字体加载完成后重绘 */
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(render);
    }
    render();
  }

  document.addEventListener("DOMContentLoaded", init);
  window.__handwriteInit = init;   // 供测试/e2e 触发（生产无影响）
})();
