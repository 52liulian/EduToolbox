/**
 * 生词提取（Word 生词表 → Excel）
 * 纯前端：JSZip 解析 .docx 的 word/document.xml 提取段落（含表格单元格），
 * 按规则识别分组标题、分词、标记拼音行，可编辑校对后导出 XLSX / TXT。
 */
"use strict";
(function () {
  /** 分组标题识别正则：第X单元/第X课、语文园地、识字、口语交际、习作、快乐读书吧 */
  var TITLE_RE = /第[0-9一二三四五六七八九十百]+[单元课]|语文园地|识字|口语交际|习作|快乐读书吧/;
  /** 词语切分：空白（含制表符）、逗号、顿号、分号 */
  var SPLIT_RE = /[\s,，、;；]+/;
  /** 含汉字判定 */
  var HAN_RE = /[一-鿿]/;
  /** 合法词语需含汉字 / 字母 / 数字（过滤纯标点） */
  var WORD_CHAR_RE = /[A-Za-z0-9一-鿿]/;
  /** 拼音字母（含带声调韵母）判定 */
  var PINYIN_RE = /[A-Za-zāáǎàēéěèīíǐìōóǒòūúǔùǖǘǚǜüêńňǹĀÁǍÀĒÉĚÈĪÍǏÌŌÓǑÒŪÚǓÙǕǗǙǛ]/;
  /** 编辑区中拼音行的前缀 */
  var PY_PREFIX = "//拼音：";

  /** 按 id 获取元素 */
  function $(id) { return document.getElementById(id); }

  /** 让出主线程刷新 UI */
  function nextTick() { return new Promise(function (r) { setTimeout(r, 10); }); }

  /** 触发浏览器下载 */
  function downloadBlob(blob, name) {
    var url = URL.createObjectURL(blob);
    var a = document.createElement("a");
    a.href = url; a.download = name;
    document.body.appendChild(a); a.click();
    setTimeout(function () { document.body.removeChild(a); URL.revokeObjectURL(url); }, 1000);
  }

  /**
   * 解码 XML 实体（数字、十六进制、常用命名实体）
   * @param {string} s 原始 XML 文本
   * @returns {string} 解码后的文本
   */
  function decodeXml(s) {
    return s
      .replace(/&#x([0-9a-fA-F]+);/g, function (_, h) { return String.fromCodePoint(parseInt(h, 16)); })
      .replace(/&#(\d+);/g, function (_, d) { return String.fromCodePoint(parseInt(d, 10)); })
      .replace(/&lt;/g, "<").replace(/&gt;/g, ">")
      .replace(/&quot;/g, '"').replace(/&apos;/g, "'")
      .replace(/&amp;/g, "&");
  }

  /**
   * 从 .docx 的 ArrayBuffer 提取全部段落文本（含表格单元格，保持文档顺序）
   * @param {ArrayBuffer} buf docx 文件二进制
   * @returns {Promise<string[]>} 段落文本数组
   */
  async function extractDocxLines(buf) {
    var zip = await JSZip.loadAsync(buf);
    var docFile = zip.file("word/document.xml");
    if (!docFile) throw new Error("未找到 word/document.xml，可能不是有效的 .docx 文件");
    var xml = await docFile.async("string");

    var lines = [];
    var pRe = /<w:p\b[^>]*>[\s\S]*?<\/w:p>/g;
    var m;
    while ((m = pRe.exec(xml)) !== null) {
      var p = m[0];
      var text = "";
      // 同一正则内顺序扫描：w:t 取文本，w:tab/w:br/w:cr 补空格（节点可能位于相邻 run 之间）
      var nodeRe = /<w:tab\b[^>]*?\/>|<w:br\b[^>]*?\/>|<w:cr\b[^>]*?\/>|<w:t\b[^>]*>([\s\S]*?)<\/w:t>/g;
      var tm;
      while ((tm = nodeRe.exec(p)) !== null) {
        text += tm[1] !== undefined ? tm[1] : " ";
      }
      lines.push(decodeXml(text));
    }
    return lines;
  }

  /**
   * 判断一行是否为“可能的拼音行”：不含汉字、长度 <30、含拼音类字母
   * @param {string} line 文本行
   * @returns {boolean}
   */
  function isPinyinLine(line) {
    var t = line.trim();
    return t.length > 0 && t.length < 30 && !HAN_RE.test(t) && PINYIN_RE.test(t);
  }

  /**
   * 对一行内容分词并追加到目标分组（自动去空、去纯标点、组内去重）
   * @param {string} line 文本行
   * @param {Object} group 目标分组 {name,words,pinyin}
   * @returns {void}
   */
  function appendWords(line, group) {
    line.split(SPLIT_RE).forEach(function (w) {
      w = w.trim();
      if (!w || !WORD_CHAR_RE.test(w)) return;
      if (group.words.indexOf(w) < 0) group.words.push(w);
    });
  }

  /**
   * 结构识别：按分组标题归组
   * @param {string[]} lines 原始文本行
   * @returns {Array<{name:string,words:string[],pinyin:string[]}>} 分组数组
   */
  function recognize(lines) {
    var groups = [];
    var cur = null;
    lines.forEach(function (raw) {
      var line = raw.trim();
      if (!line) return;
      if (TITLE_RE.test(line)) {
        cur = { name: line, words: [], pinyin: [] };
        groups.push(cur);
        return;
      }
      if (!cur) {
        cur = { name: "未分组", words: [], pinyin: [] };
        groups.push(cur);
      }
      if (isPinyinLine(line)) {
        if (cur.pinyin.indexOf(line) < 0) cur.pinyin.push(line);
      } else {
        appendWords(line, cur);
      }
    });
    return groups;
  }

  /**
   * 将分组序列化为编辑区文本（【组名】块、拼音行加 //拼音 前缀）
   * @param {Array} groups 分组数组
   * @returns {string}
   */
  function groupsToText(groups) {
    var blocks = groups.map(function (g) {
      var lines = ["【" + g.name + "】"].concat(g.words);
      (g.pinyin || []).forEach(function (p) { lines.push(PY_PREFIX + p); });
      return lines.join("\n");
    });
    return blocks.join("\n");
  }

  /**
   * 解析编辑区文本回分组结构
   * @param {string} text 编辑区内容
   * @returns {Array} 分组数组
   */
  function parseEditText(text) {
    var groups = [];
    var cur = null;
    text.split(/\r?\n/).forEach(function (raw) {
      var line = raw.trim();
      if (!line) return;
      var hm = line.match(/^【(.+)】$/);
      if (hm) {
        cur = { name: hm[1].trim() || "未命名分组", words: [], pinyin: [] };
        groups.push(cur);
      } else if (line.indexOf("//") === 0) {
        // 拼音备注行不进词语列表
        return;
      } else {
        if (!cur) { cur = { name: "未分组", words: [], pinyin: [] }; groups.push(cur); }
        line.split(SPLIT_RE).forEach(function (w) {
          w = w.trim();
          if (w && WORD_CHAR_RE.test(w) && cur.words.indexOf(w) < 0) cur.words.push(w);
        });
      }
    });
    return groups;
  }

  /**
   * 用本地 pinyin-pro 生成整词拼音，多字空格连接
   * @param {string} word 词语
   * @returns {string} 拼音串
   */
  function wordPinyin(word) {
    if (!window.pinyinPro || !window.pinyinPro.pinyin) return "";
    try {
      var arr = window.pinyinPro.pinyin(word, { type: "array", toneType: "symbol" });
      return (arr || []).join(" ");
    } catch (e) {
      return "";
    }
  }

  /* ==================== 界面交互 ==================== */
  var dropzone = $("dropzone");
  var fileInput = $("fileInput");
  var editCard = $("editCard");
  var editArea = $("editArea");
  var groupList = $("groupList");
  var statusEl = $("status");
  var activeGroupIdx = -1;

  /** 设置状态提示 */
  function setStatus(text, type) {
    statusEl.textContent = text || "";
    statusEl.className = "status" + (type ? " " + type : "");
  }

  /**
   * 加载识别结果到编辑区
   * @param {Array} groups 分组数组
   * @param {string} sourceDesc 来源描述
   */
  function loadGroups(groups, sourceDesc) {
    var total = groups.reduce(function (n, g) { return n + g.words.length; }, 0);
    if (!groups || total === 0) {
      alert("未识别到任何词语，请检查内容格式，或改用粘贴文本方式");
      return;
    }
    editArea.value = groupsToText(groups);
    editCard.hidden = false;
    activeGroupIdx = -1;
    renderGroupList();
    setStatus("已从" + sourceDesc + "识别到 " + groups.length + " 个分组、" + total + " 个词语，可在校对后导出。", "ok");
    editCard.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  /** 渲染左侧分组列表（组名 + 词数） */
  function renderGroupList() {
    var groups = parseEditText(editArea.value);
    groupList.innerHTML = "";
    groups.forEach(function (g, idx) {
      var item = document.createElement("div");
      item.className = "group-item" + (idx === activeGroupIdx ? " active" : "");
      var name = document.createElement("span");
      name.className = "g-name"; name.textContent = g.name; name.title = g.name;
      var count = document.createElement("span");
      count.className = "g-count"; count.textContent = g.words.length;
      item.appendChild(name); item.appendChild(count);
      // 点击定位到编辑区对应【组名】块
      item.addEventListener("click", function () {
        activeGroupIdx = idx;
        renderGroupList();
        var lines = editArea.value.split(/\r?\n/);
        var lineNo = 0;
        for (var i = 0; i < lines.length; i++) {
          if (lines[i].trim() === "【" + g.name + "】") { lineNo = i; break; }
        }
        editArea.focus();
        editArea.scrollTop = Math.max(0, lineNo * 26 - 10);
      });
      groupList.appendChild(item);
    });
  }

  // 编辑时同步刷新左侧词数
  editArea.addEventListener("input", function () {
    activeGroupIdx = -1;
    renderGroupList();
  });

  /** 处理拖入/选择的文件（.docx 走 JSZip，.txt 直接读文本） */
  async function handleFile(file) {
    if (/\.doc$/i.test(file.name) && !/\.docx$/i.test(file.name)) {
      alert("不支持旧版 .doc 格式，请先用 Word/WPS 另存为 .docx");
      return;
    }
    var isDocx = /\.docx$/i.test(file.name);
    var isTxt = /\.txt$/i.test(file.name);
    if (!isDocx && !isTxt) {
      alert("不支持的文件类型：" + file.name + "（仅支持 .docx / .txt）");
      return;
    }
    setStatus("正在解析文件：" + file.name + " …");
    editCard.hidden = true;
    await nextTick();
    try {
      var lines;
      if (isDocx) {
        var buf = await file.arrayBuffer();
        lines = await extractDocxLines(buf);
      } else {
        lines = await new Promise(function (resolve, reject) {
          var fr = new FileReader();
          fr.onload = function () { resolve(String(fr.result).split(/\r?\n/)); };
          fr.onerror = function () { reject(new Error("文本读取失败")); };
          fr.readAsText(file, "UTF-8");
        });
      }
      loadGroups(recognize(lines), "文件「" + file.name + "」");
    } catch (err) {
      setStatus("解析失败：" + (err && err.message ? err.message : err), "err");
      alert("解析失败：" + (err && err.message ? err.message : err));
    }
  }

  // 拖拽 / 选择
  dropzone.addEventListener("click", function (e) {
    if (e.target.tagName !== "BUTTON") fileInput.click();
  });
  $("pickBtn").addEventListener("click", function () { fileInput.click(); });
  fileInput.addEventListener("change", function () {
    if (fileInput.files[0]) handleFile(fileInput.files[0]);
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
      if (ev === "drop" && e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0]);
    });
  });

  // 粘贴文本识别
  $("pasteBtn").addEventListener("click", function () {
    var text = $("pasteArea").value;
    if (!text.trim()) { alert("请先粘贴文本内容"); return; }
    loadGroups(recognize(text.split(/\r?\n/)), "粘贴文本");
  });

  // 重新开始
  $("clearBtn").addEventListener("click", function () {
    editArea.value = "";
    $("pasteArea").value = "";
    editCard.hidden = true;
    groupList.innerHTML = "";
    setStatus("");
  });

  // 导出 XLSX
  $("exportXlsxBtn").addEventListener("click", function () {
    var groups = parseEditText(editArea.value).filter(function (g) { return g.words.length > 0; });
    if (!groups.length) { alert("没有可导出的词语"); return; }

    var withPinyin = $("optPinyin").checked;
    var withGroup = $("optGroup").checked;
    if (withPinyin && !window.pinyinPro) {
      alert("拼音库未加载，无法生成拼音列（可取消勾选后导出）");
      return;
    }

    try {
      var header = [];
      if (withGroup) header.push("分组");
      header.push("词语");
      if (withPinyin) header.push("拼音");

      var rows = [header];
      groups.forEach(function (g) {
        g.words.forEach(function (w) {
          var row = [];
          if (withGroup) row.push(g.name);
          row.push(w);
          if (withPinyin) row.push(wordPinyin(w));
          rows.push(row);
        });
      });

      var ws = XLSX.utils.aoa_to_sheet(rows);
      var wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "生词表");
      var out = XLSX.write(wb, { bookType: "xlsx", type: "array" });
      downloadBlob(new Blob([out], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" }), "生词表.xlsx");
      setStatus("已导出 生词表.xlsx（" + (rows.length - 1) + " 个词语）", "ok");
    } catch (err) {
      setStatus("导出失败：" + (err.message || err), "err");
    }
  });

  // 导出 TXT（仅词语，按【组名】分块，带 UTF-8 BOM 方便记事本识别）
  $("exportTxtBtn").addEventListener("click", function () {
    var groups = parseEditText(editArea.value).filter(function (g) { return g.words.length > 0; });
    if (!groups.length) { alert("没有可导出的词语"); return; }
    var text = groups.map(function (g) {
      return "【" + g.name + "】\n" + g.words.join("\n");
    }).join("\n");
    downloadBlob(new Blob(["\ufeff" + text], { type: "text/plain;charset=utf-8" }), "生词表.txt");
    setStatus("已导出 生词表.txt", "ok");
  });
})();
