/** 生字田字格练习：生成带十字线的田字格练字纸 */
(function () {
  const $ = (id) => document.getElementById(id);

  function gen() {
    const chars = [...$("chars").value.replace(/\s/g, "")];
    if (!chars.length) { $("sheet").innerHTML = '<p style="text-align:center;color:#9ca3af">请输入汉字</p>'; return; }
    const cols = parseInt($("cols").value) || 8;
    const repeat = parseInt($("repeat").value) || 3;
    const showRef = $("showRef").checked;
    const html = chars.map(ch => {
      const cells = Array.from({ length: repeat }, (_, i) =>
        `<div class="cell">${i === 0 && showRef ? `<span class="ref">${ch}</span>` : ""}</div>`
      ).join("");
      return `<div class="char-row"><div class="char-label">${ch}（${repeat}次）</div><div class="cells" style="grid-template-columns:repeat(${cols},1fr)">${cells}${repeat < cols ? Array(cols-repeat).fill('<div class="cell"></div>').join("") : ""}</div></div>`;
    }).join("");
    $("sheet").innerHTML = html;
  }

  $("gen").addEventListener("click", gen);
  $("print").addEventListener("click", () => window.print());
  gen();
})();
