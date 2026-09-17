/**
 * 试卷格式转换（A3 ⇄ A4）
 * 纯前端：JSZip 读写 .docx（zip），正则修改 word/document.xml 中所有 w:sectPr 的
 * 纸张（w:pgSz）、分栏（w:cols）、页边距（w:pgMar），其余文件原样保留。
 */
"use strict";
(function () {
  /* ============ 常量：尺寸单位为 twip（1/20 磅，1cm≈567twip） ============ */
  var A3_W = 16838, A3_H = 23811;           // A3 纵向
  var A4_W = 11906, A4_H = 16838;           // A4 纵向
  var SIZE_TOL = 200;                        // 纸张识别容差
  var RATIO_DOWN = 0.707;                    // A3→A4 边距缩放（1/√2）
  var RATIO_UP = 1.414;                      // A4→A3 边距放大（√2）
  var COLS_GAP = 425;                        // A3 双栏栏间距

  /** 按 id 获取元素 */
  function $(id) { return document.getElementById(id); }

  /** 让出主线程，使进度 UI 有机会刷新 */
  function nextTick() { return new Promise(function (r) { setTimeout(r, 10); }); }

  /** 转义正则特殊字符 */
  function escRe(s) { return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); }

  /** 人性化文件大小 */
  function fmtSize(n) {
    if (n < 1024) return n + " B";
    if (n < 1024 * 1024) return (n / 1024).toFixed(1) + " KB";
    return (n / 1024 / 1024).toFixed(2) + " MB";
  }

  /** 触发浏览器下载 */
  function downloadBlob(blob, name) {
    var url = URL.createObjectURL(blob);
    var a = document.createElement("a");
    a.href = url; a.download = name;
    document.body.appendChild(a); a.click();
    setTimeout(function () { document.body.removeChild(a); URL.revokeObjectURL(url); }, 1000);
  }

  /** 读取标签上的整数属性，不存在返回 null */
  function getAttr(tag, name) {
    var m = tag.match(new RegExp("\\s" + escRe(name) + '="(-?\\d+)"'));
    return m ? parseInt(m[1], 10) : null;
  }

  /** 设置标签属性：存在则替换，不存在则在自闭合 "/>" 前追加 */
  function setAttr(tag, name, val) {
    var re = new RegExp("\\s" + escRe(name) + '="[^"]*"');
    if (re.test(tag)) return tag.replace(re, " " + name + '="' + val + '"');
    return tag.replace(/\/>\s*$/, " " + name + '="' + val + '"/>');
  }

  /** 判断两个尺寸是否在容差范围内相等 */
  function near(a, b) { return Math.abs(a - b) <= SIZE_TOL; }

  /**
   * 识别纸张类型与方向
   * @param {number} w pgSz 的 w:w
   * @param {number} h pgSz 的 w:h
   * @returns {{kind:string,orient:string}} kind=A3|A4|other，orient=portrait|landscape
   */
  function detectPaper(w, h) {
    var landscape = w > h;
    var kind = "other";
    if (landscape) {
      if (near(w, A3_H) && near(h, A3_W)) kind = "A3";
      else if (near(w, A4_H) && near(h, A4_W)) kind = "A4";
    } else {
      if (near(w, A3_W) && near(h, A3_H)) kind = "A3";
      else if (near(w, A4_W) && near(h, A4_H)) kind = "A4";
    }
    return { kind: kind, orient: landscape ? "landscape" : "portrait" };
  }

  /**
   * 将 w:cols 改为单栏（删除栏间距/分隔线，w:num 置 1）
   * @param {string} tag 原始 w:cols 标签
   * @returns {string} 处理后的标签
   */
  function colsToSingle(tag) {
    var t = tag
      .replace(/\s+w:num="[^"]*"/g, "")
      .replace(/\s+w:space="[^"]*"/g, "")
      .replace(/\s+w:sep="[^"]*"/g, "");
    return t.replace(/<w:cols\b/, '<w:cols w:num="1"');
  }

  /**
   * 将 w:cols 改为双栏（num=2、space=425、sep=1）
   * @param {string} tag 原始 w:cols 标签
   * @returns {string} 处理后的标签
   */
  function colsToDouble(tag) {
    var t = tag
      .replace(/\s+w:num="[^"]*"/g, "")
      .replace(/\s+w:space="[^"]*"/g, "")
      .replace(/\s+w:sep="[^"]*"/g, "");
    return t.replace(/<w:cols\b/, '<w:cols w:num="2" w:space="' + COLS_GAP + '" w:sep="1"');
  }

  /**
   * 按比例缩放 w:pgMar 的 left/right/top/bottom/header/footer/gutter，并限制不超出纸面
   * @param {string} tag w:pgMar 标签
   * @param {number} factor 缩放系数
   * @param {number} pageW 新纸宽（twip）
   * @param {number} pageH 新纸高（twip）
   * @returns {string} 处理后的标签
   */
  function scaleMargins(tag, factor, pageW, pageH) {
    var names = ["w:left", "w:right", "w:top", "w:bottom", "w:header", "w:footer", "w:gutter"];
    var vals = {};
    names.forEach(function (n) {
      var v = getAttr(tag, n);
      vals[n] = v === null ? null : Math.round(v * factor);
    });

    // 水平方向（含装订线）至少保留 200twip 正文宽，超出则整体等比收缩
    var left = vals["w:left"] || 0, right = vals["w:right"] || 0, gutter = vals["w:gutter"] || 0;
    var sumX = left + right + gutter;
    if (sumX > pageW - 200) {
      var kx = (pageW - 200) / sumX;
      vals["w:left"] = Math.round(left * kx);
      vals["w:right"] = Math.round(right * kx);
      vals["w:gutter"] = Math.round(gutter * kx);
    }
    // 垂直方向至少保留 200twip 正文高
    var top = vals["w:top"] || 0, bottom = vals["w:bottom"] || 0;
    if (top + bottom > pageH - 200) {
      var ky = (pageH - 200) / (top + bottom);
      vals["w:top"] = Math.round(top * ky);
      vals["w:bottom"] = Math.round(bottom * ky);
    }

    var t = tag;
    names.forEach(function (n) {
      if (vals[n] !== null) t = setAttr(t, n, vals[n]);
    });
    return t;
  }

  /**
   * 处理单个 w:sectPr 片段
   * @param {string} sect 原始 sectPr XML
   * @param {string} dir a3to4 | a4to3
   * @param {boolean} dualCol A4→A3 时是否改为双栏
   * @returns {{xml:string, logs:string[], changed:boolean}} 处理结果与日志
   */
  function processSectPr(sect, dir, dualCol) {
    var logs = [];
    var pgSzMatch = sect.match(/<w:pgSz\b[^>]*?\/>/);
    if (!pgSzMatch) {
      logs.push("该节缺少纸张设置（w:pgSz），保持不变");
      return { xml: sect, logs: logs, changed: false };
    }
    var pgSz = pgSzMatch[0];
    var w = getAttr(pgSz, "w:w");
    var h = getAttr(pgSz, "w:h");
    if (w === null || h === null) {
      logs.push("该节纸张尺寸缺失，保持不变");
      return { xml: sect, logs: logs, changed: false };
    }

    var info = detectPaper(w, h);
    var orientText = info.orient === "landscape" ? "横向" : "纵向";
    var targetKind, factor, newW, newH;

    if (dir === "a3to4") {
      targetKind = "A4"; factor = RATIO_DOWN;
      if (info.kind === "A4") {
        logs.push("该节已是 A4" + orientText + "，保持不变");
        return { xml: sect, logs: logs, changed: false };
      }
      if (info.kind !== "A3") {
        logs.push("该节为非 A3/A4 自定义纸张（" + w + "×" + h + "），保持不变");
        return { xml: sect, logs: logs, changed: false };
      }
      if (info.orient === "landscape") { newW = A4_H; newH = A4_W; } else { newW = A4_W; newH = A4_H; }
    } else {
      targetKind = "A3"; factor = RATIO_UP;
      if (info.kind === "A3") {
        logs.push("该节已是 A3" + orientText + "，保持不变");
        return { xml: sect, logs: logs, changed: false };
      }
      if (info.kind !== "A4") {
        logs.push("该节为非 A3/A4 自定义纸张（" + w + "×" + h + "），保持不变");
        return { xml: sect, logs: logs, changed: false };
      }
      if (info.orient === "landscape") { newW = A3_H; newH = A3_W; } else { newW = A3_W; newH = A3_H; }
    }

    var newSect = sect;
    var colDesc = "保持原分栏";

    // 1）纸张尺寸与方向
    var newPgSz = pgSz;
    newPgSz = setAttr(newPgSz, "w:w", newW);
    newPgSz = setAttr(newPgSz, "w:h", newH);
    // 有 w:orient 则同步更新；横向时缺失则补上
    if (/\s+w:orient="[^"]*"/.test(newPgSz) || info.orient === "landscape") {
      newPgSz = setAttr(newPgSz, "w:orient", info.orient === "landscape" ? "landscape" : "portrait");
    }
    newSect = newSect.replace(pgSz, newPgSz);

    // 2）分栏
    var colsMatch = newSect.match(/<w:cols\b[^>]*?\/>/);
    var oldNum = colsMatch ? (getAttr(colsMatch[0], "w:num") || 1) : 1;
    var oldColText = oldNum === 2 ? "双栏" : (oldNum === 1 ? "单栏" : oldNum + "栏");

    if (dir === "a3to4") {
      // A3→A4：一律改单栏，删除栏间距与分隔线
      if (colsMatch) {
        newSect = newSect.replace(colsMatch[0], colsToSingle(colsMatch[0]));
      }
      colDesc = oldNum > 1 ? (oldColText + "→单栏") : "单栏";
    } else if (dualCol) {
      // A4→A3 且勾选双栏：存在则替换属性，不存在则在 pgSz 后插入
      if (colsMatch) {
        newSect = newSect.replace(colsMatch[0], colsToDouble(colsMatch[0]));
      } else {
        newSect = newSect.replace(newPgSz, newPgSz + '<w:cols w:num="2" w:space="' + COLS_GAP + '" w:sep="1"/>');
      }
      colDesc = "双栏";
    } else {
      colDesc = oldColText + "保持";
    }

    // 3）页边距按比例缩放
    var pgMarMatch = newSect.match(/<w:pgMar\b[^>]*?\/>/);
    if (pgMarMatch) {
      newSect = newSect.replace(pgMarMatch[0], scaleMargins(pgMarMatch[0], factor, newW, newH));
    }

    logs.push("A" + (dir === "a3to4" ? "3" : "4") + orientText + " → " + targetKind + orientText +
      "（" + colDesc + "，页边距×" + factor + "）");
    return { xml: newSect, logs: logs, changed: true };
  }

  /**
   * 转换单个 docx 文件：读取 zip → 改 document.xml → 生成新 blob
   * @param {File} file 用户选择的 docx
   * @param {string} dir 转换方向
   * @param {boolean} dualCol 是否双栏（A4→A3）
   * @returns {Promise<{blob:Blob,outName:string,logs:string[]}>}
   */
  async function convertDocx(file, dir, dualCol) {
    var buf = await file.arrayBuffer();
    var zip = await JSZip.loadAsync(buf);
    var docFile = zip.file("word/document.xml");
    if (!docFile) {
      throw new Error("未找到 word/document.xml，可能不是有效的 .docx 文件");
    }
    var xml = await docFile.async("string");
    var allLogs = [];
    var changedCount = 0;

    // 替换所有 sectPr（含自闭合的极端情况）
    var newXml = xml.replace(/<w:sectPr\b[^>]*?\/>|<w:sectPr\b[^>]*>[\s\S]*?<\/w:sectPr>/g, function (m) {
      if (/\/>\s*$/.test(m)) {
        allLogs.push("存在空节标记 <w:sectPr/>，无纸张设置，保持不变");
        return m;
      }
      var r = processSectPr(m, dir, dualCol);
      allLogs = allLogs.concat(r.logs);
      if (r.changed) changedCount++;
      return r.xml;
    });

    if (!changedCount && !/w:sectPr/.test(xml)) {
      allLogs.push("文档中未找到任何节设置（sectPr），文件原样输出");
    }

    // 字符串写回，其余 zip 条目原样保留
    zip.file("word/document.xml", newXml);
    var blob = await zip.generateAsync({ type: "blob", compression: "DEFLATE" });
    var base = file.name.replace(/\.docx$/i, "");
    var outName = base + (dir === "a3to4" ? "_A4.docx" : "_A3.docx");
    return { blob: blob, outName: outName, logs: allLogs };
  }

  /* ==================== 界面与交互 ==================== */
  var files = [];           // 待转换文件
  var busy = false;

  var dropzone = $("dropzone");
  var fileInput = $("fileInput");
  var fileList = $("fileList");
  var convertBtn = $("convertBtn");
  var statusEl = $("status");
  var logList = $("logList");

  /** 渲染文件列表 */
  function renderFiles() {
    fileList.innerHTML = "";
    if (!files.length) {
      var li = document.createElement("li");
      li.className = "file-empty";
      li.textContent = "尚未添加文件";
      li.style.display = "block";
      fileList.appendChild(li);
    } else {
      files.forEach(function (f, idx) {
        var item = document.createElement("li");
        item.className = "file-item";
        var icon = document.createElement("span");
        icon.className = "fi-icon"; icon.textContent = "📘";
        var name = document.createElement("span");
        name.className = "fi-name"; name.textContent = f.name; name.title = f.name;
        var size = document.createElement("span");
        size.className = "fi-size"; size.textContent = fmtSize(f.size);
        var del = document.createElement("button");
        del.className = "fi-del"; del.textContent = "✕"; del.title = "移除";
        del.onclick = function () { files.splice(idx, 1); renderFiles(); };
        item.appendChild(icon); item.appendChild(name); item.appendChild(size); item.appendChild(del);
        fileList.appendChild(item);
      });
    }
    convertBtn.disabled = !files.length || busy;
  }

  /** 添加用户拖入/选择的文件（仅 .docx，自动去重） */
  function addFiles(list) {
    Array.prototype.forEach.call(list, function (f) {
      if (!/\.docx$/i.test(f.name)) {
        addLog("err", "「" + f.name + "」不是 .docx 文件，已忽略");
        return;
      }
      if (files.some(function (x) { return x.name === f.name && x.size === f.size; })) return;
      files.push(f);
    });
    renderFiles();
  }

  /** 读取当前选项：方向与双栏开关 */
  function getOptions() {
    var dir = document.querySelector('input[name="direction"]:checked').value;
    return { dir: dir, dualCol: $("dualCol").checked };
  }

  /** 追加一条日志 */
  function addLog(type, text) {
    var li = document.createElement("li");
    li.className = type;
    li.textContent = text;
    logList.appendChild(li);
  }

  // 方向切换：仅 A4→A3 时显示双栏选项，并同步 body 标记控制 CSS
  document.querySelectorAll('input[name="direction"]').forEach(function (radio) {
    radio.addEventListener("change", function () {
      document.body.setAttribute("data-dir", this.value);
    });
  });
  document.body.setAttribute("data-dir", "a3to4");

  // 拖拽事件
  dropzone.addEventListener("click", function (e) {
    if (e.target.tagName !== "BUTTON") fileInput.click();
  });
  $("pickBtn").addEventListener("click", function () { fileInput.click(); });
  fileInput.addEventListener("change", function () {
    addFiles(fileInput.files);
    fileInput.value = "";
  });
  ["dragenter", "dragover"].forEach(function (ev) {
    dropzone.addEventListener(ev, function (e) { e.preventDefault(); dropzone.classList.add("dragover"); });
  });
  ["dragleave", "drop"].forEach(function (ev) {
    dropzone.addEventListener(ev, function (e) {
      e.preventDefault();
      if (ev === "dragleave" && dropzone.contains(e.relatedTarget)) return;
      dropzone.classList.remove("dragover");
      if (ev === "drop") addFiles(e.dataTransfer.files);
    });
  });

  // 清空
  $("clearBtn").addEventListener("click", function () {
    if (busy) return;
    files = [];
    renderFiles();
    logList.innerHTML = "";
    statusEl.textContent = "等待添加文件…";
  });

  // 开始转换
  convertBtn.addEventListener("click", async function () {
    if (busy || !files.length) return;
    busy = true;
    renderFiles();
    logList.innerHTML = "";
    var opt = getOptions();
    var results = [];
    var failCount = 0;

    try {
      for (var i = 0; i < files.length; i++) {
        var f = files[i];
        statusEl.textContent = "正在转换（" + (i + 1) + "/" + files.length + "）：" + f.name;
        addLog("info", "● " + f.name);
        try {
          var r = await convertDocx(f, opt.dir, opt.dualCol);
          r.logs.forEach(function (t) { addLog("ok", "　" + t); });
          results.push(r);
        } catch (err) {
          failCount++;
          addLog("err", "　转换失败：" + (err && err.message ? err.message : err));
        }
        await nextTick();
      }

      // 下载：单个直接下载，多个打包 zip
      if (results.length === 1) {
        downloadBlob(results[0].blob, results[0].outName);
        statusEl.textContent = "转换完成，已开始下载：" + results[0].outName;
      } else if (results.length > 1) {
        statusEl.textContent = "正在打包 " + results.length + " 个文件…";
        var pack = new JSZip();
        var used = {};
        results.forEach(function (r) {
          // 防止同名文件互相覆盖
          var name = r.outName;
          if (used[name]) {
            var dot = name.lastIndexOf(".");
            name = name.slice(0, dot) + "(" + used[name] + ")" + name.slice(dot);
          }
          used[r.outName] = (used[r.outName] || 0) + 1;
          pack.file(name, r.blob);
        });
        var zipBlob = await pack.generateAsync({ type: "blob", compression: "DEFLATE" });
        downloadBlob(zipBlob, "转换结果.zip");
        statusEl.textContent = "转换完成，已打包下载：转换结果.zip（成功 " + results.length + " 个" +
          (failCount ? "，失败 " + failCount + " 个" : "") + "）";
      } else {
        statusEl.textContent = "全部文件转换失败，请查看日志";
      }
    } catch (err) {
      statusEl.textContent = "处理出错：" + (err && err.message ? err.message : err);
    } finally {
      busy = false;
      renderFiles();
    }
  });

  renderFiles();
})();
