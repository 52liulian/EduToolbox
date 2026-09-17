/**
 * 在线奖状生成器
 * 依赖：html2canvas (本地文件)
 * 功能：多模板奖状、自定义内容、印章、下载 PNG / 打印
 */
(function () {
  "use strict";
  const $ = (id) => document.getElementById(id);
  let currentTpl = "default";

  /** 实时更新预览 */
  function update() {
    $("pName").textContent = $("fName").value || "学生姓名";
    $("pYear").textContent = $("fYear").value;
    $("pSem").textContent = $("fSem").value;
    $("pReason").textContent = $("fReason").value;
    $("pAward").textContent = $("fAward").value;
    $("pOrg").textContent = $("fOrg").value;

    const d = new Date();
    $("pDate").textContent = `${d.getFullYear()} 年 ${String(d.getMonth()+1).padStart(2,"0")} 月 ${String(d.getDate()).padStart(2,"0")} 日`;

    const seal = $("seal");
    const sealText = $("fSeal").value.trim();
    if (sealText) {
      seal.style.display = "flex";
      seal.textContent = sealText;
    } else {
      seal.style.display = "none";
    }
  }

  /** 切换模板 */
  function setTpl(name) {
    currentTpl = name;
    const cert = $("cert");
    cert.className = "cert tpl-" + name;
    document.querySelectorAll(".tpl").forEach(t => t.classList.toggle("active", t.dataset.tpl === name));
    update();
  }

  /** 下载 PNG */
  async function download() {
    const cert = $("cert");
    try {
      const canvas = await html2canvas(cert, { scale: 2, backgroundColor: "#fff", useCORS: true });
      const a = document.createElement("a");
      a.href = canvas.toDataURL("image/png");
      a.download = `奖状_${$("fName").value}_${Date.now()}.png`;
      a.click();
    } catch (e) {
      alert("下载失败：" + e.message);
    }
  }

  // 模板切换
  document.querySelectorAll(".tpl").forEach(t => t.addEventListener("click", () => setTpl(t.dataset.tpl)));

  // 输入实时更新
  ["fName", "fYear", "fSem", "fReason", "fAward", "fOrg", "fSeal"].forEach(id => {
    $(id).addEventListener("input", update);
    $(id).addEventListener("change", update);
  });

  $("download").addEventListener("click", download);
  $("print").addEventListener("click", () => window.print());

  update();
})();
