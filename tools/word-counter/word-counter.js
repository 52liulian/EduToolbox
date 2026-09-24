/**
 * 在线字数统计工具
 * 功能：实时统计中文字数、英文字符、数字、总字符、行数、段落数
 * 支持排除标点、空格、换行
 */
(function () {
  "use strict";

  const $ = (id) => document.getElementById(id);
  const input = $("wc-input");
  const optNoPunct = $("optNoPunct");
  const optNoSpace = $("optNoSpace");
  const optNoLine = $("optNoLine");

  /**
   * 统计文本字数
   * @param {string} text - 输入文本
   * @returns {Object} 统计结果
   */
  function count(text) {
    let t = text || "";
    if (optNoPunct.checked) t = t.replace(/[\p{P}\p{S}]/gu, "");
    if (optNoSpace.checked) t = t.replace(/[ \t　]/g, "");
    if (optNoLine.checked) t = t.replace(/\r?\n/g, "");

    const zh = (t.match(/[\u4e00-\u9fff]/g) || []).length;
    const en = (t.match(/[a-zA-Z]/g) || []).length;
    const digit = (t.match(/[0-9]/g) || []).length;
    const total = [...t].length;
    const lines = text ? text.split(/\r?\n/).length : 0;
    const para = text ? text.split(/\r?\n\s*\r?\n/).filter(s => s.trim()).length : 0;
    return { zh, en, digit, total, lines, para };
  }

  /** 渲染统计结果 */
  function render() {
    const r = count(input.value);
    $("s-zh").textContent = r.zh;
    $("s-en").textContent = r.en;
    $("s-digit").textContent = r.digit;
    $("s-total").textContent = r.total;
    $("s-line").textContent = r.lines;
    $("s-para").textContent = r.para;
  }

  input.addEventListener("input", render);
  [optNoPunct, optNoSpace, optNoLine].forEach(el => el.addEventListener("change", render));

  $("btn-clear").addEventListener("click", () => { input.value = ""; render(); });

  $("btn-copy").addEventListener("click", async () => {
    const r = count(input.value);
    const txt = `中文字数：${r.zh}\n英文字符：${r.en}\n数字字符：${r.digit}\n总字符数：${r.total}\n行数：${r.lines}\n段落数：${r.para}`;
    try {
      await navigator.clipboard.writeText(txt);
      $("btn-copy").textContent = "已复制 ✓";
      setTimeout(() => $("btn-copy").textContent = "复制统计结果", 1500);
    } catch (e) { alert("复制失败：" + e.message); }
  });

  render();
})();
