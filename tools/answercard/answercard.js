/**
 * 答题卡生成器
 * ----------------------------------------------------------------------------
 * 功能：按单选/多选题量生成标准机读答题卡
 * 路由入口：#/onlinetools/answercard
 * 运行方式：作为 iframe 嵌入主站
 */
(function () {
  "use strict";

  const SINGLE_KEYS = ["A", "B", "C", "D"];
  const MULTI_KEYS = ["A", "B", "C", "D", "E"];

  function buildHtml(single, multi) {
    let html = `<div class="ac-title">标准答题卡 · 单选 ${single} 题 / 多选 ${multi} 题</div>`;

    if (single) {
      html += `<div class="ac-section">一、单项选择题（每题 4 个选项）</div>`;
      html += `<div class="ac-options">${SINGLE_KEYS.map(l => `<span class="ac-key">${l}</span>`).join("")}</div>`;
      html += `<div class="ac-grid">${Array.from({ length: single }, (_, i) => `
        <div class="ac-row"><span class="ac-num">${i + 1}</span>
          ${SINGLE_KEYS.map(l => `<span class="ac-bubble">${l}</span>`).join("")}
        </div>`).join("")}</div>`;
    }

    if (multi) {
      html += `<div class="ac-section">二、多项选择题（每题 5 个选项）</div>`;
      html += `<div class="ac-options">${MULTI_KEYS.map(l => `<span class="ac-key">${l}</span>`).join("")}</div>`;
      html += `<div class="ac-grid">${Array.from({ length: multi }, (_, i) => `
        <div class="ac-row"><span class="ac-num">${i + 1 + single}</span>
          ${MULTI_KEYS.map(l => `<span class="ac-bubble">${l}</span>`).join("")}
        </div>`).join("")}</div>`;
    }

    html += `<div class="ac-info">姓名：__________　班级：__________　考号：____________</div>`;
    return html;
  }

  function render() {
    const single = +document.getElementById('ac-single').value || 0;
    const multi = +document.getElementById('ac-multi').value || 0;
    const canvas = document.getElementById('ac-canvas');
    canvas.innerHTML = (single + multi) ? buildHtml(single, multi) : "请设置题量（≥1）";
  }

  document.addEventListener('DOMContentLoaded', () => {
    const genBtn = document.getElementById('ac-gen');
    if (!genBtn) return;
    genBtn.addEventListener('click', render);
    render();
  });
})();
