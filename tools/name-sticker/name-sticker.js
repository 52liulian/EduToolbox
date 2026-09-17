/** 学生姓名贴：批量生成可打印姓名贴纸 */
(function () {
  const $ = (id) => document.getElementById(id);

  function gen() {
    const names = $("names").value.split(/\r?\n/).map(s => s.trim()).filter(Boolean);
    if (!names.length) { $("sheet").innerHTML = '<p style="text-align:center;color:#9ca3af">请输入姓名</p>'; return; }
    const cols = parseInt($("cols").value) || 4;
    const size = $("size").value;
    const color = $("color").value;
    $("sheet").innerHTML = `<div class="grid" style="grid-template-columns:repeat(${cols},1fr)">${
      names.map(n => `<div class="sticker" style="border-color:${color};font-size:${size}px">${n}</div>`).join("")
    }</div>`;
  }

  $("gen").addEventListener("click", gen);
  $("print").addEventListener("click", () => window.print());
  gen();
})();
