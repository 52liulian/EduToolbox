/**
 * 多表合并（表格数据处理）
 * 纯前端 SheetJS：本地解析 xlsx/xls/csv，支持「按列名智能合并」与「自定义字段映射」，
 * 合并预览后导出 XLSX。
 */
"use strict";
(function () {
  /** 按 id 获取元素 */
  function $(id) { return document.getElementById(id); }

  /** 让出主线程刷新 loading UI */
  function nextTick() { return new Promise(function (r) { setTimeout(r, 10); }); }

  /** 触发浏览器下载 */
  function downloadBlob(blob, name) {
    var url = URL.createObjectURL(blob);
    var a = document.createElement("a");
    a.href = url; a.download = name;
    document.body.appendChild(a); a.click();
    setTimeout(function () { document.body.removeChild(a); URL.revokeObjectURL(url); }, 1000);
  }

  /** 单元格转字符串（用于表头与预览） */
  function toText(v) {
    if (v === null || v === undefined) return "";
    return String(v).trim();
  }

  /* entries: {name,buf,sheetNames,sheetName,fields:[{name,checked,out}],rows,state}[] */
  var entries = [];
  var lastMatrix = null;   // 最近一次合并结果 {headers, rows}

  var dropzone = $("dropzone");
  var fileInput = $("fileInput");
  var entriesEl = $("entries");
  var optionCard = $("optionCard");
  var previewCard = $("previewCard");
  var loadingEl = $("loading");
  var loadingText = $("loadingText");

  /** 显示/隐藏解析中提示 */
  function setLoading(show, text) {
    loadingText.textContent = text || "正在解析文件…";
    loadingEl.classList.toggle("hidden", !show);
  }

  /**
   * 读取工作簿指定工作表，提取表头与数据行
   * @param {Object} entry 文件条目
   * @returns {Promise<void>} 完成后字段写回 entry
   */
  async function loadSheet(entry) {
    var wb = XLSX.read(new Uint8Array(entry.buf), { type: "array" });
    entry.sheetNames = wb.SheetNames.slice();
    if (entry.sheetNames.indexOf(entry.sheetName) < 0) entry.sheetName = entry.sheetNames[0] || "";
    if (!entry.sheetName) throw new Error("工作簿中没有工作表");

    var ws = wb.Sheets[entry.sheetName];
    var matrix = XLSX.utils.sheet_to_json(ws, { header: 1, defval: "" });
    var headerRow = matrix.length ? matrix[0] : [];

    // 表头：空列名给统一占位名，加序号防重复
    var names = headerRow.map(toText);
    var blankCount = 0;
    entry.fields = names.map(function (n) {
      var name = n;
      if (!name) { blankCount++; name = "（空白列名" + blankCount + "）"; }
      return { name: name, checked: true, out: name };
    });

    // 数据行：去掉整行空白
    entry.rows = matrix.slice(1).filter(function (row) {
      return row.some(function (c) { return toText(c) !== ""; });
    });
    entry.state = "ok";
  }

  /** 添加文件：逐个解析（默认第一个工作表） */
  async function addFiles(fileList) {
    var accepted = Array.prototype.filter.call(fileList, function (f) {
      return /\.(xlsx|xls|csv)$/i.test(f.name);
    });
    var rejected = fileList.length - accepted.length;
    if (rejected > 0) alert("有 " + rejected + " 个文件格式不支持，已忽略（仅支持 .xlsx/.xls/.csv）");
    if (!accepted.length) return;

    setLoading(true, "正在解析文件（0/" + accepted.length + "）…");
    await nextTick();

    for (var i = 0; i < accepted.length; i++) {
      var f = accepted[i];
      loadingText.textContent = "正在解析文件（" + (i + 1) + "/" + accepted.length + "）：" + f.name;
      // 同名同大小去重
      if (entries.some(function (e) { return e.name === f.name && e.size === f.size; })) continue;
      var entry = { name: f.name, size: f.size, buf: null, sheetNames: [], sheetName: "", fields: [], rows: [], state: "loading", panelOpen: false };
      entries.push(entry);
      renderEntries();
      try {
        entry.buf = await f.arrayBuffer();
        await nextTick();
        await loadSheet(entry);
      } catch (err) {
        entry.state = "err：" + (err && err.message ? err.message : "解析失败");
      }
      renderEntries();
    }

    setLoading(false);
    optionCard.hidden = entries.length === 0;
  }

  /** 当前合并模式 */
  function currentMode() {
    return document.querySelector('input[name="mode"]:checked').value;
  }

  /** 渲染全部文件条目（输入控件状态直接读写 entry 数据） */
  function renderEntries() {
    entriesEl.innerHTML = "";
    entries.forEach(function (entry, ei) {
      var box = document.createElement("div");
      box.className = "entry";

      /* 头部行 */
      var head = document.createElement("div");
      head.className = "entry-head";
      var icon = document.createElement("span");
      icon.className = "e-icon"; icon.textContent = "📗";
      var name = document.createElement("span");
      name.className = "e-name"; name.textContent = entry.name; name.title = entry.name;

      var sel = document.createElement("select");
      entry.sheetNames.forEach(function (sn) {
        var op = document.createElement("option");
        op.value = sn; op.textContent = sn;
        if (sn === entry.sheetName) op.selected = true;
        sel.appendChild(op);
      });
      // 切换工作表后重新解析该文件
      sel.addEventListener("change", async function () {
        entry.sheetName = sel.value;
        entry.state = "loading";
        renderEntries();
        setLoading(true, "正在切换工作表：" + entry.name);
        await nextTick();
        try { await loadSheet(entry); }
        catch (err) { entry.state = "err：" + (err.message || "解析失败"); }
        setLoading(false);
        renderEntries();
      });

      var toggleBtn = document.createElement("button");
      toggleBtn.className = "e-btn";
      toggleBtn.textContent = entry.panelOpen ? "收起字段" : "字段选择";
      toggleBtn.addEventListener("click", function () {
        entry.panelOpen = !entry.panelOpen;
        renderEntries();
      });

      var state = document.createElement("span");
      state.className = "e-state" + (String(entry.state).indexOf("err") === 0 ? " err" : "");
      if (entry.state === "loading") state.textContent = "解析中…";
      else if (entry.state === "ok") state.textContent = entry.fields.length + " 列 / " + entry.rows.length + " 行";
      else state.textContent = entry.state;

      var del = document.createElement("button");
      del.className = "e-del"; del.textContent = "✕"; del.title = "移除文件";
      del.addEventListener("click", function () {
        entries.splice(ei, 1);
        renderEntries();
        optionCard.hidden = entries.length === 0;
        previewCard.hidden = true;
      });

      head.appendChild(icon); head.appendChild(name); head.appendChild(sel);
      head.appendChild(toggleBtn); head.appendChild(state); head.appendChild(del);
      box.appendChild(head);

      /* 字段面板 */
      var panel = document.createElement("div");
      panel.className = "field-panel" + (entry.panelOpen ? " show" : "");
      var hint = document.createElement("div");
      hint.className = "field-hint";
      hint.textContent = currentMode() === "smart"
        ? "智能合并模式将自动包含全部列，无需勾选。"
        : "勾选要包含的列，并可在右侧填写「输出列名」（同名输出列将归并到一起）。";
      panel.appendChild(hint);

      var grid = document.createElement("div");
      grid.className = "field-grid";
      entry.fields.forEach(function (fld, fi) {
        var item = document.createElement("label");
        item.className = "field-item";
        var cb = document.createElement("input");
        cb.type = "checkbox"; cb.checked = fld.checked;
        cb.disabled = currentMode() === "smart";
        cb.addEventListener("change", function () { fld.checked = cb.checked; });
        var fn = document.createElement("span");
        fn.className = "f-name"; fn.textContent = fld.name; fn.title = fld.name;
        var arrow = document.createElement("span");
        arrow.className = "f-arrow"; arrow.textContent = "→";
        var out = document.createElement("input");
        out.className = "out-name"; out.type = "text"; out.value = fld.out;
        out.placeholder = "输出列名";
        out.addEventListener("input", function () { fld.out = out.value; });
        item.appendChild(cb); item.appendChild(fn); item.appendChild(arrow); item.appendChild(out);
        grid.appendChild(item);
      });
      panel.appendChild(grid);
      box.appendChild(panel);

      entriesEl.appendChild(box);
    });
  }

  /**
   * 按当前设置构建合并矩阵
   * @returns {{headers:string[], rows:Array[]}} 输出表头与全部数据行
   */
  function buildMatrix() {
    var mode = currentMode();
    var addSource = $("addSource").checked;
    var headers = [];

    entries.forEach(function (entry) {
      if (String(entry.state).indexOf("err") === 0) return;
      entry.fields.forEach(function (fld) {
        var key = mode === "smart" ? fld.name : (fld.out || fld.name);
        if (headers.indexOf(key) < 0) headers.push(key);
      });
    });
    if (mode === "custom") {
      headers = [];
      entries.forEach(function (entry) {
        if (String(entry.state).indexOf("err") === 0) return;
        entry.fields.forEach(function (fld) {
          if (!fld.checked) return;
          var key = fld.out || fld.name;
          if (headers.indexOf(key) < 0) headers.push(key);
        });
      });
      if (!headers.length) throw new Error("自定义模式下未勾选任何字段，请至少勾选一列");
    }
    if (addSource) headers.push("来源文件");

    var rows = [];
    entries.forEach(function (entry) {
      if (String(entry.state).indexOf("err") === 0) return;
      entry.rows.forEach(function (row) {
        var outRow = headers.map(function () { return ""; });
        entry.fields.forEach(function (fld, ci) {
          var key = mode === "smart" ? fld.name : (fld.checked ? (fld.out || fld.name) : null);
          if (key === null) return;
          var oi = headers.indexOf(key);
          if (oi >= 0 && row[ci] !== undefined && row[ci] !== null) outRow[oi] = row[ci];
        });
        if (addSource) outRow[headers.length - 1] = entry.name;
        rows.push(outRow);
      });
    });
    return { headers: headers, rows: rows };
  }

  /** 渲染合并预览（统计 + 前 10 行） */
  function renderPreview(matrix) {
    $("summary").innerHTML =
      '<span class="stat-pill">总文件数：' + entries.length + "</span>" +
      '<span class="stat-pill">总行数：' + matrix.rows.length + "</span>" +
      '<span class="stat-pill">总列数：' + matrix.headers.length + "</span>" +
      (matrix.rows.length === 0 ? '<span class="stat-pill warn">⚠ 合并结果为空（没有数据行）</span>' : "");

    var table = $("previewTable");
    var html = "<thead><tr>";
    matrix.headers.forEach(function (h) { html += "<th>" + escapeHtml(h) + "</th>"; });
    html += "</tr></thead><tbody>";
    matrix.rows.slice(0, 10).forEach(function (row) {
      html += "<tr>";
      matrix.headers.forEach(function (_, ci) {
        html += "<td>" + escapeHtml(toText(row[ci])) + "</td>";
      });
      html += "</tr>";
    });
    html += "</tbody>";
    table.innerHTML = html;
  }

  /** 简单 HTML 转义，避免表头内容破坏表格 */
  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  /* ============ 事件绑定 ============ */
  // 拖拽 / 选择文件
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

  // 模式切换：同步 body 标记，刷新字段面板（勾选框/输出列输入框的显隐）
  document.querySelectorAll('input[name="mode"]').forEach(function (radio) {
    radio.addEventListener("change", function () {
      document.body.setAttribute("data-mode", this.value);
      previewCard.hidden = true;
      renderEntries();
    });
  });

  // 清空
  $("clearBtn").addEventListener("click", function () {
    entries = [];
    lastMatrix = null;
    entriesEl.innerHTML = "";
    optionCard.hidden = true;
    previewCard.hidden = true;
  });

  // 生成合并预览（setTimeout 让大文件处理前 UI 能先刷新）
  $("mergeBtn").addEventListener("click", function () {
    if (!entries.length) return;
    if (entries.some(function (e) { return e.state === "loading"; })) {
      alert("还有文件正在解析，请稍候"); return;
    }
    setLoading(true, "正在合并数据…");
    setTimeout(function () {
      try {
        lastMatrix = buildMatrix();
        renderPreview(lastMatrix);
        previewCard.hidden = false;
        previewCard.scrollIntoView({ behavior: "smooth", block: "nearest" });
      } catch (err) {
        alert(err.message || "合并失败");
      } finally {
        setLoading(false);
      }
    }, 30);
  });

  // 导出 XLSX
  $("exportBtn").addEventListener("click", function () {
    if (!lastMatrix) return;
    try {
      var data = [lastMatrix.headers].concat(lastMatrix.rows);
      var ws = XLSX.utils.aoa_to_sheet(data);
      var wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "合并结果");
      var out = XLSX.write(wb, { bookType: "xlsx", type: "array" });
      downloadBlob(new Blob([out], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" }), "合并表格.xlsx");
    } catch (err) {
      alert("导出失败：" + (err.message || err));
    }
  });
})();
