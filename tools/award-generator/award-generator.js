/* ============================================================
 * EduToolbox · 电子奖状生成器 award-generator.js
 * 功能：模板/姓名/奖项/正文 → 实时预览 → 打印 / 导出 PNG
 * 纯前端 IIFE，全本地处理；依赖本地 vendor/html2canvas
 * ============================================================ */
(function () {
  "use strict";

  /* ---------- 常用工具 ---------- */
  const $ = (id) => document.getElementById(id);
  const esc = (s) => String(s == null ? "" : s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  /* ---------- 常量 ---------- */
  // 常用奖项快捷选项
  const AWARDS = [
    "三好学生", "优秀学生", "学习之星", "进步之星", "文明之星",
    "劳动之星", "纪律之星", "体育之星", "艺术之星", "阅读之星",
    "小小书法家", "数学之星", "英语小达人", "科学小博士", "优秀干部",
  ];
  // 模板标题
  const TPL_TITLES = { award: "奖　状", cert: "荣 誉 证 书", praise: "表 扬 信", happy: "喜　报" };
  // 状态
  const state = { tpl: "award" };

  /* ---------- 提示条 ---------- */
  let toastTimer;
  function toast(msg) {
    const t = $("toast");
    if (!t) return;
    t.textContent = msg;
    t.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => t.classList.remove("show"), 2200);
  }

  /* ---------- 渲染：把表单状态反映到奖状预览 ---------- */
  function todayStr() {
    const d = new Date();
    const p = (n) => String(n).padStart(2, "0");
    return d.getFullYear() + "-" + p(d.getMonth() + 1) + "-" + p(d.getDate());
  }

  function render() {
    const name = ($("studentName").value || "张三").trim();
    const award = ($("awardName").value || "三好学生").trim();
    const school = ($("schoolName").value || "").trim();
    const date = $("awardDate").value || todayStr();

    // 模板
    const cert = $("certificate");
    cert.className = "certificate tpl-" + state.tpl;
    $("certTitle").textContent = TPL_TITLES[state.tpl] || "奖　状";
    $("certAward").textContent = award;
    $("certName").textContent = name;
    $("certSchool").textContent = school;
    // 日期格式化为 2026年9月21日
    let dateText = date;
    if (/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      const [y, m, d] = date.split("-");
      dateText = y + " 年 " + parseInt(m, 10) + " 月 " + parseInt(d, 10) + " 日";
    }
    $("certDate").textContent = dateText;
    // 正文：替换占位符
    const body = ($("certBody").value || "")
      .replace(/\{name\}/g, name)
      .replace(/\{award\}/g, award);
    $("certBodyView").textContent = body || "在 2025—2026 学年度中，表现优异，特授予「" + award + "」荣誉称号，以资鼓励。";
  }

  /* ---------- 导出 PNG（html2canvas） ---------- */
  function exportPng() {
    const node = $("certificate");
    if (typeof html2canvas === "undefined") {
      toast("当前环境不支持导出图片，可使用打印替代");
      return;
    }
    toast("正在生成图片…");
    html2canvas(node, {
      scale: 2,
      backgroundColor: null,
      useCORS: true,
      logging: false,
    }).then((canvas) => {
      const a = document.createElement("a");
      a.download = "奖状-" + ($("studentName").value || "学生") + ".png";
      a.href = canvas.toDataURL("image/png");
      a.click();
      toast("✅ 已导出 PNG 图片");
    }).catch(() => toast("❌ 导出失败，请使用打印"));
  }

  /* ---------- 事件绑定 ---------- */
  function bind() {
    // 模板选择
    $("tplChips").querySelectorAll(".chip").forEach((chip) => {
      chip.addEventListener("click", () => {
        state.tpl = chip.dataset.tpl;
        $("tplChips").querySelectorAll(".chip").forEach((c) => c.classList.remove("active"));
        chip.classList.add("active");
        render();
      });
    });

    // 奖项快捷 chips
    const wrap = $("awardChips");
    wrap.innerHTML = AWARDS.map((a) => '<button type="button" class="chip" data-v="' + esc(a) + '">' + esc(a) + "</button>").join("");
    wrap.querySelectorAll(".chip").forEach((chip) => {
      chip.addEventListener("click", () => {
        $("awardName").value = chip.dataset.v;
        $("awardChips").querySelectorAll(".chip").forEach((c) => c.classList.remove("active"));
        chip.classList.add("active");
        render();
      });
    });

    // 表单变化 → 实时刷新
    ["studentName", "awardName", "schoolName", "awardDate", "certBody"].forEach((id) => {
      $(id).addEventListener("input", render);
    });

    // 按钮
    $("btnExport").addEventListener("click", exportPng);
    $("btnPrint").addEventListener("click", () => window.print());
    $("btnDemo").addEventListener("click", () => {
      $("studentName").value = "李欣怡";
      $("awardName").value = "学习之星";
      $("schoolName").value = "杏坛实验学校";
      $("certBody").value = "在 2025—2026 学年度第一学期中，刻苦努力、进步显著，特授予「{award}」荣誉称号，以资鼓励。";
      $("awardDate").value = todayStr();
      render();
      toast("已载入示例");
    });

  }

  /* ---------- 初始化 ---------- */
  function init() {
    $("awardDate").value = todayStr();
    if (window.EduToolStageToolbar) window.EduToolStageToolbar.init({ stage: ".stage-panel", panelHost: ".workbench", hiddenClass: "setup-hidden" });
    bind();
    render();
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
