/**
 * 文本差异对比工具
 * 功能：基于 LCS 算法实现按行/按词/逐字对比，高亮增删改
 */
(function () {
  "use strict";
  const $ = (id) => document.getElementById(id);
  let mode = "line";

  document.querySelectorAll(".mode-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".mode-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      mode = btn.dataset.mode;
      if ($("orig").value || $("edit").value) doDiff();
    });
  });

  /**
   * 将文本按指定模式切分为 token 数组
   * @param {string} text
   * @param {string} m - line/word/char
   * @returns {string[]}
   */
  function tokenize(text, m) {
    if (m === "line") return text.split(/\r?\n/);
    if (m === "char") return [...text];
    return text.split(/(\s+)/).filter(Boolean);
  }

  /**
   * LCS 最长公共子序列动态规划
   * @param {string[]} a
   * @param {string[]} b
   * @returns {number[][]} dp 表
   */
  function lcsTable(a, b) {
    const n = a.length, m = b.length;
    const dp = Array.from({ length: n + 1 }, () => new Int32Array(m + 1));
    for (let i = n - 1; i >= 0; i--)
      for (let j = m - 1; j >= 0; j--)
        dp[i][j] = a[i] === b[j] ? dp[i + 1][j + 1] + 1 : Math.max(dp[i + 1][j], dp[i][j + 1]);
    return dp;
  }

  /**
   * 生成 diff 结果
   * @returns {Array<{type:string,value:string}>}
   */
  function diff(a, b) {
    const ta = tokenize(a, mode), tb = tokenize(b, mode);
    const dp = lcsTable(ta, tb);
    const out = [];
    let i = 0, j = 0;
    while (i < ta.length && j < tb.length) {
      if (ta[i] === tb[j]) { out.push({ type: "same", value: ta[i] }); i++; j++; }
      else if (dp[i + 1][j] >= dp[i][j + 1]) { out.push({ type: "del", value: ta[i] }); i++; }
      else { out.push({ type: "add", value: tb[j] }); j++; }
    }
    while (i < ta.length) { out.push({ type: "del", value: ta[i++] }); }
    while (j < tb.length) { out.push({ type: "add", value: tb[j++] }); }
    return out;
  }

  /** 转义 HTML */
  function esc(s) {
    return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }

  function doDiff() {
    const a = $("orig").value, b = $("edit").value;
    const result = $("result");
    if (!a && !b) { result.innerHTML = '<div class="empty">请输入两段文本后点击「开始对比」</div>'; return; }
    const items = diff(a, b);
    const sep = mode === "line" ? "\n" : (mode === "word" ? "" : "");
    result.innerHTML = items.map(it => {
      const v = esc(it.value);
      if (it.type === "del") return `<span class="del">${v}</span>${sep}`;
      if (it.type === "add") return `<span class="add">${v}</span>${sep}`;
      return `<span class="same">${v}</span>${sep}`;
    }).join("");
  }

  $("btn-diff").addEventListener("click", doDiff);
  $("btn-clear").addEventListener("click", () => {
    $("orig").value = ""; $("edit").value = "";
    $("result").innerHTML = '<div class="empty">请输入两段文本后点击「开始对比」</div>';
  });
})();
