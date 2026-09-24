/** 看拼音写词语出题：输入词语，生成拼音+汉字（可隐藏）练习纸 */
(function () {
  const $ = (id) => document.getElementById(id);

  function gen() {
    const words = $("words").value.split(/\r?\n/).map(s => s.trim()).filter(Boolean);
    if (!words.length) { $("sheet").innerHTML = '<p style="text-align:center;color:#9ca3af">请输入词语</p>'; return; }
    const showHan = $("showHan").checked, showPy = $("showPinyin").checked;
    const cols = parseInt($("cols").value) || 3;
    const html = words.map(w => {
      let py = "";
      if (showPy && window.pinyinPro) py = pinyinPro.pinyin(w, { toneType: "symbol", type: "string" });
      return `<div class="item"><div class="pinyin">${py}</div><div class="hanzi ${showHan ? '' : 'hidden'}">${w}</div></div>`;
    }).join("");
    $("sheet").innerHTML = `<div class="grid" style="grid-template-columns:repeat(${cols},1fr)">${html}</div>`;
  }

  $("gen").addEventListener("click", gen);
  $("print").addEventListener("click", () => window.print());
  gen();
})();
