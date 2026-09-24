/**
 * 拼音标注工具
 * 依赖：pinyin-pro (CDN)
 * 功能：为汉字标注拼音，支持声调符号/数字/无声调，支持 ruby 上方/右侧/换行布局
 */
(function () {
  "use strict";
  const $ = (id) => document.getElementById(id);

  /**
   * 获取单字拼音
   * @param {string} ch - 汉字
   * @param {string} toneType - symbol/num/none
   * @returns {string}
   */
  function getPinyin(ch, toneType) {
    const typeMap = { symbol: "symbol", num: "num", none: "none" };
    if (window.pinyinPro && pinyinPro.pinyin) {
      return pinyinPro.pinyin(ch, { toneType: typeMap[toneType], type: "array" })[0] || ch;
    }
    return ch;
  }

  /**
   * 生成标注结果 HTML
   * @param {string} text
   * @param {string} toneType
   * @param {string} layout - top/side/line
   * @returns {string}
   */
  function annotate(text, toneType, layout) {
    let html = "";
    for (const ch of text) {
      if (ch === "\n") { html += "<br>"; continue; }
      if (!/[\u4e00-\u9fff]/.test(ch)) { html += ch; continue; }
      const py = getPinyin(ch, toneType);
      if (layout === "top") {
        html += `<ruby>${ch}<rt>${py}</rt></ruby>`;
      } else if (layout === "side") {
        html += `${ch}<span class="py-side">${py}</span>`;
      } else {
        html += `<ruby>${ch}<rt style="display:block">${py}</rt></ruby>`;
      }
    }
    return html;
  }

  /** 生成纯文本拼音（空格分隔） */
  function toPlain(text, toneType) {
    let out = "";
    for (const ch of text) {
      if (/[\u4e00-\u9fff]/.test(ch)) out += getPinyin(ch, toneType) + " ";
      else out += ch;
    }
    return out.trim();
  }

  let lastHtml = "";

  function run() {
    const text = $("input").value;
    if (!text.trim()) { $("output").innerHTML = '<span style="color:#9ca3af">请输入文本</span>'; return; }
    const toneType = $("toneType").value;
    const layout = $("layout").value;
    const fs = $("fontSize").value;
    lastHtml = annotate(text, toneType, layout);
    $("output").style.fontSize = fs + "px";
    $("output").innerHTML = lastHtml;
  }

  $("gen").addEventListener("click", run);
  ["toneType", "layout", "fontSize"].forEach(id => $(id).addEventListener("change", () => { if ($("input").value.trim()) run(); }));

  $("copy").addEventListener("click", async () => {
    const txt = toPlain($("input").value, $("toneType").value);
    try {
      await navigator.clipboard.writeText(txt);
      $("copy").textContent = "已复制 ✓";
      setTimeout(() => $("copy").textContent = "复制文本", 1500);
    } catch (e) { alert("复制失败"); }
  });

  $("copyHtml").addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(lastHtml);
      $("copyHtml").textContent = "已复制 ✓";
      setTimeout(() => $("copyHtml").textContent = "复制带拼音HTML", 1500);
    } catch (e) { alert("复制失败"); }
  });

  // 初始生成
  setTimeout(run, 300);
})();
