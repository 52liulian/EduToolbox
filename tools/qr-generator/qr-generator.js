/**
 * 二维码生成器
 * 依赖：qrcodejs (CDN)
 * 功能：生成二维码、自定义颜色/尺寸/容错/Logo、下载 PNG
 */
(function () {
  "use strict";
  const $ = (id) => document.getElementById(id);
  let qrcode = null;
  let logoDataUrl = null;

  /** 生成二维码 */
  function generate() {
    const text = $("text").value.trim();
    if (!text) { alert("请输入文本或链接"); return; }
    const el = $("qrcode");
    el.innerHTML = "";
    const size = parseInt($("size").value);
    const ecLevel = $("ec").value;
    const ecMap = { L: QRCode.CorrectLevel.L, M: QRCode.CorrectLevel.M, Q: QRCode.CorrectLevel.Q, H: QRCode.CorrectLevel.H };
    qrcode = new QRCode(el, {
      text,
      width: size, height: size,
      colorDark: $("fg").value,
      colorLight: $("bg").value,
      correctLevel: ecMap[ecLevel]
    });
    // 叠加 Logo
    if (logoDataUrl) setTimeout(drawLogo, 100);
  }

  /** 在二维码中心叠加 Logo */
  function drawLogo() {
    const canvas = $("qrcode").querySelector("canvas");
    if (!canvas || !logoDataUrl) return;
    const ctx = canvas.getContext("2d");
    const img = new Image();
    img.onload = () => {
      const logoSize = canvas.width * 0.22;
      const x = (canvas.width - logoSize) / 2;
      const y = (canvas.height - logoSize) / 2;
      // 白色圆角底
      const r = logoSize * 0.15;
      ctx.fillStyle = "#fff";
      roundRect(ctx, x - 6, y - 6, logoSize + 12, logoSize + 12, r + 4);
      ctx.fill();
      roundRect(ctx, x, y, logoSize, logoSize, r);
      ctx.save();
      ctx.clip();
      ctx.drawImage(img, x, y, logoSize, logoSize);
      ctx.restore();
    };
    img.src = logoDataUrl;
  }

  function roundRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  }

  /** 下载二维码为 PNG */
  function download() {
    const canvas = $("qrcode").querySelector("canvas") || $("qrcode").querySelector("img");
    if (!canvas) { alert("请先生成二维码"); return; }
    let dataUrl;
    if (canvas.tagName === "IMG") {
      dataUrl = canvas.src;
    } else {
      dataUrl = canvas.toDataURL("image/png");
    }
    const a = document.createElement("a");
    a.href = dataUrl;
    a.download = `qrcode_${Date.now()}.png`;
    a.click();
  }

  $("gen").addEventListener("click", generate);
  $("download").addEventListener("click", download);

  $("logo").addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (!file) { logoDataUrl = null; return; }
    const reader = new FileReader();
    reader.onload = (ev) => { logoDataUrl = ev.target.result; if (qrcode) generate(); };
    reader.readAsDataURL(file);
  });

  // 实时重绘
  ["fg", "bg", "size", "ec", "margin"].forEach(id => {
    $(id).addEventListener("change", () => { if ($("text").value.trim()) generate(); });
  });
})();
