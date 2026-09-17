/**
 * PDF 与图片转换
 * A) pdf.js 逐页渲染 canvas → PNG/JPG（多页 JSZip 打包）
 * B) jsPDF 将多张图片按顺序合并为 PDF（适应图片尺寸 / A4）
 * worker 通过普通 script 预加载（file:// 下主线程兜底），再设置 workerSrc。
 */
"use strict";
(function () {
  // workerSrc 指向本地同版 worker；file:// 无法创建 Worker 时 pdf.js 会回退到全局 pdfjsWorker
  if (window.pdfjsLib) {
    pdfjsLib.GlobalWorkerOptions.workerSrc = "../../assets/vendor/pdf.worker.min.js";
  }

  /** 按 id 获取元素 */
  function $(id) { return document.getElementById(id); }

  /** 让出主线程刷新进度 */
  function nextTick() { return new Promise(function (r) { setTimeout(r, 10); }); }

  /** 触发浏览器下载 */
  function downloadBlob(blob, name) {
    var url = URL.createObjectURL(blob);
    var a = document.createElement("a");
    a.href = url; a.download = name;
    document.body.appendChild(a); a.click();
    setTimeout(function () { document.body.removeChild(a); URL.revokeObjectURL(url); }, 1000);
  }

  /** canvas 转 Blob（Promise 封装） */
  function canvasToBlob(canvas, type, quality) {
    return new Promise(function (resolve, reject) {
      canvas.toBlob(function (blob) {
        if (blob) resolve(blob);
        else reject(new Error("图片生成失败"));
      }, type, quality);
    });
  }

  /** 页码补零：1 → "01" */
  function pad(n) { return n < 10 ? "0" + n : String(n); }

  /**
   * 解析页码范围文本，如 "1-3,5"
   * @param {string} text 原始输入
   * @param {number} maxPage 总页数
   * @returns {number[]} 页码数组（已去重、升序）
   */
  function parseRanges(text, maxPage) {
    var result = [];
    var parts = String(text || "").split(/[,，;；]/).map(function (s) { return s.trim(); }).filter(Boolean);
    parts.forEach(function (p) {
      var m = p.match(/^(\d+)\s*[-–~]\s*(\d+)$/);
      var a, b;
      if (m) { a = parseInt(m[1], 10); b = parseInt(m[2], 10); }
      else if (/^\d+$/.test(p)) { a = b = parseInt(p, 10); }
      else { throw new Error("无法识别的页码写法：" + p); }
      if (a < 1 || b < 1 || a > maxPage || b > maxPage) {
        throw new Error("页码超出范围（共 " + maxPage + " 页）：" + p);
      }
      if (a > b) { var t = a; a = b; b = t; }
      for (var i = a; i <= b; i++) { if (result.indexOf(i) < 0) result.push(i); }
    });
    result.sort(function (x, y) { return x - y; });
    if (!result.length) throw new Error("请填写页码范围，或选择全部页面");
    return result;
  }

  /* ==================== Tab 切换 ==================== */
  document.querySelectorAll(".tab").forEach(function (btn) {
    btn.addEventListener("click", function () {
      document.querySelectorAll(".tab").forEach(function (b) { b.classList.toggle("active", b === btn); });
      var key = btn.getAttribute("data-tab");
      $("panel-pdf2img").hidden = key !== "pdf2img";
      $("panel-img2pdf").hidden = key !== "img2pdf";
    });
  });

  /* ==================== A) PDF 转图片 ==================== */
  var currentPdf = null;   // {name, buf, pageCount, doc}
  var rendering = false;

  var pdfDropzone = $("pdfDropzone");
  var pdfInput = $("pdfInput");

  /** 加载并解析 PDF，显示页数 */
  async function loadPdf(file) {
    if (!/\.pdf$/i.test(file.name) && file.type !== "application/pdf") {
      alert("请选择 .pdf 文件"); return;
    }
    resetPdfView();
    $("renderStatus").textContent = "正在读取 PDF…";
    try {
      var buf = await file.arrayBuffer();
      var task = pdfjsLib.getDocument({ data: new Uint8Array(buf), isEvalSupported: false });
      var doc = await task.promise;
      currentPdf = { name: file.name, buf: buf, pageCount: doc.numPages, doc: doc };
      $("pdfInfo").hidden = false;
      $("pdfOpts").hidden = false;
      $("pdfName").textContent = file.name;
      $("pdfMeta").textContent = "共 " + doc.numPages + " 页";
      $("renderProgress").hidden = true;
    } catch (err) {
      alert("PDF 打开失败：" + (err && err.message ? err.message : "文件可能已损坏或加密"));
      resetPdfView();
    }
  }

  /** 清空 PDF 界面状态 */
  function resetPdfView() {
    currentPdf = null;
    $("pdfInfo").hidden = true;
    $("pdfOpts").hidden = true;
    $("renderProgress").hidden = true;
    $("renderBar").style.width = "0";
    $("renderPct").textContent = "0%";
  }

  pdfDropzone.addEventListener("click", function (e) {
    if (e.target.tagName !== "BUTTON" && !rendering) pdfInput.click();
  });
  $("pdfPickBtn").addEventListener("click", function () { pdfInput.click(); });
  pdfInput.addEventListener("change", function () {
    if (pdfInput.files[0]) loadPdf(pdfInput.files[0]);
    pdfInput.value = "";
  });
  ["dragenter", "dragover"].forEach(function (ev) {
    pdfDropzone.addEventListener(ev, function (e) { e.preventDefault(); pdfDropzone.classList.add("dragover"); });
  });
  ["dragleave", "drop"].forEach(function (ev) {
    pdfDropzone.addEventListener(ev, function (e) {
      e.preventDefault();
      if (ev === "dragleave" && pdfDropzone.contains(e.relatedTarget)) return;
      pdfDropzone.classList.remove("dragover");
      if (ev === "drop" && e.dataTransfer.files[0]) loadPdf(e.dataTransfer.files[0]);
    });
  });
  $("pdfRemove").addEventListener("click", resetPdfView);

  // 页码范围单选与输入框联动
  document.querySelectorAll('input[name="rangeMode"]').forEach(function (r) {
    r.addEventListener("change", function () {
      $("pageRange").disabled = document.querySelector('input[name="rangeMode"]:checked').value !== "custom";
      if (!$("pageRange").disabled) $("pageRange").focus();
    });
  });

  /** 逐页渲染并下载（多页打包 zip） */
  $("renderBtn").addEventListener("click", async function () {
    if (!currentPdf || rendering) return;
    var fmt = document.querySelector('input[name="imgFmt"]:checked').value;
    var scale = parseInt(document.querySelector('input[name="scale"]:checked').value, 10);
    var rangeMode = document.querySelector('input[name="rangeMode"]:checked').value;

    var pages;
    try {
      pages = rangeMode === "all"
        ? Array.from({ length: currentPdf.pageCount }, function (_, i) { return i + 1; })
        : parseRanges($("pageRange").value, currentPdf.pageCount);
    } catch (err) { alert(err.message); return; }

    rendering = true;
    this.disabled = true;
    var mime = fmt === "jpg" ? "image/jpeg" : "image/png";
    var ext = fmt === "jpg" ? "jpg" : "png";
    $("renderProgress").hidden = false;
    var blobs = [];   // {name, blob}

    try {
      for (var i = 0; i < pages.length; i++) {
        var pageNo = pages[i];
        $("renderStatus").textContent = "正在渲染第 " + pageNo + " 页（" + (i + 1) + "/" + pages.length + "）";
        var page = await currentPdf.doc.getPage(pageNo);
        var viewport = page.getViewport({ scale: scale });
        var canvas = document.createElement("canvas");
        canvas.width = Math.floor(viewport.width);
        canvas.height = Math.floor(viewport.height);
        var ctx = canvas.getContext("2d");
        // JPG 无透明通道，先铺白底
        if (fmt === "jpg") { ctx.fillStyle = "#fff"; ctx.fillRect(0, 0, canvas.width, canvas.height); }
        await page.render({ canvasContext: ctx, viewport: viewport }).promise;
        var blob = await canvasToBlob(canvas, mime, 0.92);
        blobs.push({ name: "page_" + pad(pageNo) + "." + ext, blob: blob });

        var pct = Math.round(((i + 1) / pages.length) * 100);
        $("renderBar").style.width = pct + "%";
        $("renderPct").textContent = pct + "%";
        await nextTick();
      }

      $("renderStatus").textContent = "正在打包下载…";
      if (blobs.length === 1) {
        downloadBlob(blobs[0].blob, blobs[0].name);
      } else {
        var zip = new JSZip();
        blobs.forEach(function (b) { zip.file(b.name, b.blob); });
        var zipBlob = await zip.generateAsync({ type: "blob", compression: "DEFLATE" });
        downloadBlob(zipBlob, "图片.zip");
      }
      $("renderStatus").textContent = "完成，已输出 " + blobs.length + " 张图片";
    } catch (err) {
      $("renderStatus").textContent = "转换失败：" + (err && err.message ? err.message : err);
      alert("转换失败：" + (err && err.message ? err.message : err));
    } finally {
      rendering = false;
      $("renderBtn").disabled = false;
    }
  });

  /* ==================== B) 图片转 PDF ==================== */
  var imgItems = [];   // {name,dataUrl,fmt,w,h}
  var building = false;

  var imgDropzone = $("imgDropzone");
  var imgInput = $("imgInput");
  var imgList = $("imgList");

  /** 文件读取为 dataURL（Promise） */
  function readDataUrl(file) {
    return new Promise(function (resolve, reject) {
      var fr = new FileReader();
      fr.onload = function () { resolve(fr.result); };
      fr.onerror = function () { reject(new Error("读取失败")); };
      fr.readAsDataURL(file);
    });
  }

  /** 由 dataURL 加载图片取得像素尺寸 */
  function loadImageEl(dataUrl) {
    return new Promise(function (resolve, reject) {
      var im = new Image();
      im.onload = function () { resolve(im); };
      im.onerror = function () { reject(new Error("图片解码失败")); };
      im.src = dataUrl;
    });
  }

  /** 添加图片：过滤格式、去重、读取尺寸后渲染列表 */
  async function addImages(files) {
    var accepted = Array.prototype.filter.call(files, function (f) {
      return /\.(jpe?g|png)$/i.test(f.name) || f.type === "image/jpeg" || f.type === "image/png";
    });
    if (files.length - accepted.length > 0) alert("仅支持 JPG / PNG 图片，部分文件已忽略");
    if (!accepted.length || building) return;

    for (var i = 0; i < accepted.length; i++) {
      var f = accepted[i];
      if (imgItems.some(function (x) { return x.name === f.name && x.size === f.size; })) continue;
      try {
        var dataUrl = await readDataUrl(f);
        var im = await loadImageEl(dataUrl);
        var isPng = f.type === "image/png" || /\.png$/i.test(f.name);
        imgItems.push({
          name: f.name, size: f.size, dataUrl: dataUrl,
          fmt: isPng ? "PNG" : "JPEG", w: im.naturalWidth, h: im.naturalHeight
        });
      } catch (err) {
        alert("「" + f.name + "」读取失败，已跳过");
      }
    }
    renderImgList();
  }

  /** 渲染图片排序列表 */
  function renderImgList() {
    imgList.innerHTML = "";
    $("imgOpts").hidden = imgItems.length === 0;
    imgItems.forEach(function (item, idx) {
      var li = document.createElement("li");
      li.className = "img-item";

      var no = document.createElement("span");
      no.className = "ii-idx"; no.textContent = idx + 1;

      var thumb = document.createElement("img");
      thumb.className = "ii-thumb"; thumb.src = item.dataUrl; thumb.alt = "";

      var name = document.createElement("span");
      name.className = "ii-name"; name.textContent = item.name; name.title = item.name;

      var meta = document.createElement("span");
      meta.className = "ii-meta"; meta.textContent = item.w + "×" + item.h;

      var up = document.createElement("button");
      up.className = "ii-btn"; up.textContent = "↑ 上移"; up.disabled = idx === 0;
      up.onclick = function () {
        var t = imgItems[idx - 1]; imgItems[idx - 1] = imgItems[idx]; imgItems[idx] = t;
        renderImgList();
      };
      var down = document.createElement("button");
      down.className = "ii-btn"; down.textContent = "↓ 下移"; down.disabled = idx === imgItems.length - 1;
      down.onclick = function () {
        var t = imgItems[idx + 1]; imgItems[idx + 1] = imgItems[idx]; imgItems[idx] = t;
        renderImgList();
      };
      var del = document.createElement("button");
      del.className = "ii-btn danger"; del.textContent = "删除";
      del.onclick = function () { imgItems.splice(idx, 1); renderImgList(); };

      li.appendChild(no); li.appendChild(thumb); li.appendChild(name); li.appendChild(meta);
      li.appendChild(up); li.appendChild(down); li.appendChild(del);
      imgList.appendChild(li);
    });
  }

  imgDropzone.addEventListener("click", function (e) {
    if (e.target.tagName !== "BUTTON" && !building) imgInput.click();
  });
  $("imgPickBtn").addEventListener("click", function () { imgInput.click(); });
  imgInput.addEventListener("change", function () {
    addImages(imgInput.files);
    imgInput.value = "";
  });
  ["dragenter", "dragover"].forEach(function (ev) {
    imgDropzone.addEventListener(ev, function (e) { e.preventDefault(); imgDropzone.classList.add("dragover"); });
  });
  ["dragleave", "drop"].forEach(function (ev) {
    imgDropzone.addEventListener(ev, function (e) {
      e.preventDefault();
      if (ev === "dragleave" && imgDropzone.contains(e.relatedTarget)) return;
      imgDropzone.classList.remove("dragover");
      if (ev === "drop") addImages(e.dataTransfer.files);
    });
  });

  $("imgClearBtn").addEventListener("click", function () {
    if (building) return;
    imgItems = [];
    renderImgList();
    $("pdfProgress").hidden = true;
  });

  /** 根据图片列表生成 PDF 并下载 */
  $("buildPdfBtn").addEventListener("click", async function () {
    if (!imgItems.length || building) return;
    var pageMode = document.querySelector('input[name="pageMode"]:checked').value;
    var margin = parseInt(document.querySelector('input[name="margin"]:checked').value, 10); // mm

    building = true;
    this.disabled = true;
    $("pdfProgress").hidden = false;
    $("pdfBar").style.width = "0";
    $("pdfPct").textContent = "0%";

    try {
      var pdf = null;
      for (var i = 0; i < imgItems.length; i++) {
        var im = imgItems[i];
        var landscape = im.w > im.h;
        var orient = landscape ? "l" : "p";
        var x, y, drawW, drawH, pageW, pageH, unit;

        if (pageMode === "a4") {
          // A4：短边 210mm、长边 297mm，方向随图片
          unit = "mm";
          pageW = landscape ? 297 : 210;
          pageH = landscape ? 210 : 297;
          var availW = pageW - margin * 2;
          var availH = pageH - margin * 2;
          // 按图片实际像素比例等比缩放
          var scale = Math.min(availW / im.w, availH / im.h);
          drawW = im.w * scale;
          drawH = im.h * scale;
          x = (pageW - drawW) / 2;
          y = (pageH - drawH) / 2;
        } else {
          // 适应图片：以像素值作为 pt（72dpi 下图片像素与点一一对应），页面与图等大
          unit = "pt";
          pageW = im.w; pageH = im.h;
          drawW = im.w; drawH = im.h;
          x = 0; y = 0;
        }

        if (!pdf) {
          pdf = new window.jspdf.jsPDF({ orientation: orient, unit: unit, format: pageMode === "a4" ? "a4" : [pageW, pageH] });
        } else {
          pdf.addPage(pageMode === "a4" ? "a4" : [pageW, pageH], orient);
        }
        // 白底（保证 PNG 透明区域呈现白色）
        pdf.setFillColor(255, 255, 255);
        pdf.rect(0, 0, pageW, pageH, "F");
        pdf.addImage(im.dataUrl, im.fmt, x, y, drawW, drawH, undefined, "FAST");

        var pct = Math.round(((i + 1) / imgItems.length) * 100);
        $("pdfStatus").textContent = "正在生成第 " + (i + 1) + " / " + imgItems.length + " 页";
        $("pdfBar").style.width = pct + "%";
        $("pdfPct").textContent = pct + "%";
        await nextTick();
      }
      $("pdfStatus").textContent = "正在保存 PDF…";
      pdf.save("图片合并.pdf");
      $("pdfStatus").textContent = "完成，已下载 图片合并.pdf";
    } catch (err) {
      $("pdfStatus").textContent = "生成失败：" + (err && err.message ? err.message : err);
      alert("生成 PDF 失败：" + (err && err.message ? err.message : err));
    } finally {
      building = false;
      $("buildPdfBtn").disabled = false;
    }
  });
})();
