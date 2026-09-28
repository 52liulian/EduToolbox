/* ============================================================
 * EduToolbox · 课件取色器 color-picker.js
 * 功能：HEX/RGB/HSL 互转、屏幕吸管、图片取色、
 *       互补/类似/三角配色 + 明暗色阶、WCAG 对比度检查、色板收藏
 * ============================================================ */
(function () {
  "use strict";

  var $ = function (id) { return document.getElementById(id); };
  var COLOR_KEY = "edutoolbox.color-picker.color";
  var FAV_KEY = "edutoolbox.color-picker.favs";
  var TONE_STEPS = [0.15, 0.28, 0.42, 0.55, 0.68, 0.82, 0.93];

  var state = { color: "#4F8CFF", favs: [] };
  var ctx2d = null;

  /* ============ 提示条 ============ */
  function toast(msg) {
    var t = $("toast");
    if (!t) return;
    t.textContent = msg;
    t.classList.add("show");
    clearTimeout(toast._t);
    toast._t = setTimeout(function () { t.classList.remove("show"); }, 1800);
  }

  /* ============ 颜色换算 ============ */
  function clamp(n, lo, hi) { return n < lo ? lo : (n > hi ? hi : n); }
  function pad2(n) { var s = Math.round(n).toString(16); return s.length < 2 ? "0" + s : s; }

  function normalizeHex(s) {
    var v = String(s || "").trim().replace(/^#/, "");
    if (/^[0-9a-fA-F]{3}$/.test(v)) v = v[0] + v[0] + v[1] + v[1] + v[2] + v[2];
    if (!/^[0-9a-fA-F]{6}$/.test(v)) return null;
    return ("#" + v).toUpperCase();
  }
  function hexToRgb(hex) {
    var h = normalizeHex(hex) || "#000000";
    return {
      r: parseInt(h.slice(1, 3), 16),
      g: parseInt(h.slice(3, 5), 16),
      b: parseInt(h.slice(5, 7), 16)
    };
  }
  function rgbToHex(r, g, b) {
    return ("#" + pad2(clamp(r, 0, 255)) + pad2(clamp(g, 0, 255)) + pad2(clamp(b, 0, 255))).toUpperCase();
  }
  function rgbToHsl(r, g, b) {
    r /= 255; g /= 255; b /= 255;
    var max = Math.max(r, g, b), min = Math.min(r, g, b);
    var h = 0, s = 0, l = (max + min) / 2, d = max - min;
    if (d !== 0) {
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      if (max === r) h = ((g - b) / d + (g < b ? 6 : 0));
      else if (max === g) h = (b - r) / d + 2;
      else h = (r - g) / d + 4;
      h *= 60;
    }
    return { h: Math.round(h), s: Math.round(s * 100), l: Math.round(l * 100) };
  }
  function hslToRgb(h, s, l) {
    h = ((h % 360) + 360) % 360; s = clamp(s, 0, 100) / 100; l = clamp(l, 0, 100) / 100;
    var c = (1 - Math.abs(2 * l - 1)) * s;
    var x = c * (1 - Math.abs(((h / 60) % 2) - 1));
    var m = l - c / 2, r = 0, g = 0, b = 0;
    if (h < 60) { r = c; g = x; }
    else if (h < 120) { r = x; g = c; }
    else if (h < 180) { g = c; b = x; }
    else if (h < 240) { g = x; b = c; }
    else if (h < 300) { r = x; b = c; }
    else { r = c; b = x; }
    return { r: Math.round((r + m) * 255), g: Math.round((g + m) * 255), b: Math.round((b + m) * 255) };
  }

  /* ============ 对比度（WCAG 2.1） ============ */
  function channel(v) {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  }
  function luminance(rgb) {
    return 0.2126 * channel(rgb.r) + 0.7152 * channel(rgb.g) + 0.0722 * channel(rgb.b);
  }
  function contrastRatio(a, b) {
    var l1 = luminance(a), l2 = luminance(b);
    var hi = Math.max(l1, l2), lo = Math.min(l1, l2);
    return (hi + 0.05) / (lo + 0.05);
  }

  /* ============ 渲染 ============ */
  function texts() {
    var rgb = hexToRgb(state.color), hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
    return {
      rgb: rgb,
      hsl: hsl,
      hex: state.color,
      rgbText: "rgb(" + rgb.r + ", " + rgb.g + ", " + rgb.b + ")",
      hslText: "hsl(" + hsl.h + ", " + hsl.s + "%, " + hsl.l + "%)"
    };
  }

  function setColor(hex, from) {
    var h = normalizeHex(hex);
    if (!h) return false;
    state.color = h;
    render(from);
    try { localStorage.setItem(COLOR_KEY, h); } catch (e) { /* 忽略 */ }
    return true;
  }

  function render(from) {
    var t = texts();
    if (from !== "picker") $("nativePicker").value = state.color.toLowerCase();
    if (from !== "hex") $("hexInput").value = state.color;
    if (from !== "rgb") {
      $("rVal").value = t.rgb.r; $("gVal").value = t.rgb.g; $("bVal").value = t.rgb.b;
    }
    $("hslText").textContent = t.hslText;
    $("swatch").style.background = state.color;

    $("preview").style.background = state.color;
    var fg = bestText(state.color);
    $("preview").style.color = fg;
    $("previewHex").textContent = state.color;
    $("previewSub").textContent = t.rgbText + " · " + t.hslText;
    $("previewBadge").textContent = fg === "#FFFFFF" ? "推荐使用白色文字" : "推荐使用深色文字";

    $("valHex").textContent = state.color;
    $("valRgb").textContent = t.rgbText;
    $("valHsl").textContent = t.hslText;
    $("valCss").textContent = "--color: " + state.color + ";";

    renderSchemes();
    renderContrast();
  }

  function bestText(hex) {
    var rgb = hexToRgb(hex);
    return contrastRatio(rgb, { r: 255, g: 255, b: 255 }) >= contrastRatio(rgb, { r: 0, g: 0, b: 0 })
      ? "#FFFFFF" : "#111827";
  }

  /* ---------- 配色方案 ---------- */
  function swatchEl(hex, tip) {
    var el = document.createElement("div");
    el.className = "sw";
    el.title = "点击应用 " + hex;
    var dot = document.createElement("div");
    dot.className = "sw-dot";
    dot.style.background = hex;
    var hx = document.createElement("div");
    hx.className = "sw-hex";
    hx.textContent = hex;
    el.appendChild(dot);
    el.appendChild(hx);
    if (tip) {
      var tp = document.createElement("div");
      tp.className = "sw-tip";
      tp.textContent = tip;
      el.appendChild(tp);
    }
    el.addEventListener("click", function () { setColor(hex, "external"); toast("已应用 " + hex); });
    return el;
  }
  function fillRow(id, list) {
    var row = $(id);
    row.innerHTML = "";
    for (var i = 0; i < list.length; i++) {
      row.appendChild(swatchEl(list[i].hex, list[i].tip));
    }
  }
  function renderSchemes() {
    var hsl = texts().hsl;
    var h = hsl.h, s = hsl.s, l = hsl.l;
    var mk = function (dh, ds, dl, tip) {
      var rgb = hslToRgb(h + dh, clamp(s + ds, 0, 100), clamp(l + dl, 0, 100));
      return { hex: rgbToHex(rgb.r, rgb.g, rgb.b), tip: tip };
    };
    fillRow("rowComp", [mk(0, 0, 0, "当前"), mk(180, 0, 0, "互补")]);
    fillRow("rowAnalog", [mk(-30, 0, 0, "-30°"), mk(-15, 0, 0, "-15°"), mk(0, 0, 0, "当前"), mk(15, 0, 0, "+15°"), mk(30, 0, 0, "+30°")]);
    fillRow("rowTriadic", [mk(0, 0, 0, "当前"), mk(120, 0, 0, "+120°"), mk(240, 0, 0, "+240°")]);
    var tones = [];
    for (var i = 0; i < TONE_STEPS.length; i++) {
      var lv = TONE_STEPS[i];
      var trgb = hslToRgb(h, s, lv * 100);
      tones.push({ hex: rgbToHex(trgb.r, trgb.g, trgb.b), tip: Math.round(lv * 100) + "%" });
    }
    fillRow("rowTone", tones);
  }

  /* ---------- 对比度 ---------- */
  function renderContrast() {
    var fg = hexToRgb($("fgInput").value), bg = hexToRgb($("bgInput").value);
    var ratio = contrastRatio(fg, bg);
    $("contrastRatio").textContent = ratio.toFixed(2) + ":1";
    $("contrastSample").style.background = $("bgInput").value;
    $("contrastSample").style.color = $("fgInput").value;

    var tags = [
      { label: "正文 AA（≥4.5）", ok: ratio >= 4.5 },
      { label: "正文 AAA（≥7）", ok: ratio >= 7 },
      { label: "大字 AA（≥3）", ok: ratio >= 3 }
    ];
    var ul = $("contrastTags");
    ul.innerHTML = "";
    for (var i = 0; i < tags.length; i++) {
      var li = document.createElement("li");
      li.className = tags[i].ok ? "ct-pass" : "ct-fail";
      li.textContent = (tags[i].ok ? "✓ " : "✕ ") + tags[i].label;
      ul.appendChild(li);
    }
    $("contrastSub").textContent = ratio >= 7 ? "投影清晰，达标 AAA" : (ratio >= 4.5 ? "达标 AA，正文可读" : (ratio >= 3 ? "仅够大标题，正文偏弱" : "对比过低，投影看不清"));
  }

  /* ---------- 我的色板 ---------- */
  function renderFavs() {
    var box = $("favGrid");
    box.innerHTML = "";
    if (!state.favs.length) {
      var p = document.createElement("div");
      p.className = "fav-empty";
      p.textContent = "还没有收藏，点「⭐ 收藏当前色」保存常用配色";
      box.appendChild(p);
      return;
    }
    for (var i = 0; i < state.favs.length; i++) {
      (function (hex) {
        var d = document.createElement("div");
        d.className = "fav-dot";
        d.style.background = hex;
        d.title = hex + "（点击应用 · 右键删除）";
        d.addEventListener("click", function () { setColor(hex, "external"); });
        d.addEventListener("contextmenu", function (e) {
          e.preventDefault();
          state.favs = state.favs.filter(function (x) { return x !== hex; });
          saveFavs(); renderFavs(); toast("已移除 " + hex);
        });
        box.appendChild(d);
      })(state.favs[i]);
    }
  }
  function saveFavs() {
    try { localStorage.setItem(FAV_KEY, JSON.stringify(state.favs)); } catch (e) { /* 忽略 */ }
  }
  function addFav() {
    if (state.favs.indexOf(state.color) >= 0) { toast("该颜色已在色板中"); return; }
    state.favs.push(state.color);
    if (state.favs.length > 40) state.favs.shift();
    saveFavs(); renderFavs(); toast("已收藏 " + state.color);
  }

  /* ============ 复制 ============ */
  function copy(text) {
    var done = function () { toast("已复制：" + text); };
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(done, fallback);
        return;
      }
    } catch (e) { /* 忽略 */ }
    fallback();
    function fallback() {
      try {
        var ta = document.createElement("textarea");
        ta.value = text;
        ta.setAttribute("readonly", "");
        ta.style.position = "fixed";
        ta.style.opacity = "0";
        document.body.appendChild(ta);
        ta.select();
        document.execCommand("copy");
        document.body.removeChild(ta);
        done();
      } catch (e2) { toast("复制失败，请手动选中复制"); }
    }
  }

  /* ============ 图片取色 ============ */
  function loadImage(file) {
    if (!file || !/^image\//.test(file.type)) { toast("请选择图片文件"); return; }
    var reader = new FileReader();
    reader.onload = function () {
      var img = new Image();
      img.onload = function () {
        var maxW = 720;
        var scale = Math.min(1, maxW / img.width);
        var cv = $("picCanvas");
        cv.width = Math.max(1, Math.round(img.width * scale));
        cv.height = Math.max(1, Math.round(img.height * scale));
        ctx2d = cv.getContext("2d");
        ctx2d.drawImage(img, 0, 0, cv.width, cv.height);
        cv.hidden = false;
        $("picEmpty").hidden = true;
        $("picBar").hidden = false;
        $("picHint").textContent = "鼠标移动预览颜色，点击即可应用";
        $("picBarText").textContent = "已载入 " + cv.width + "×" + cv.height + "，移动鼠标预览";
      };
      img.onerror = function () { toast("图片读取失败"); };
      img.src = String(reader.result);
    };
    reader.onerror = function () { toast("图片读取失败"); };
    reader.readAsDataURL(file);
  }
  function pickAt(e) {
    var cv = $("picCanvas");
    if (cv.hidden || !ctx2d) return;
    var rect = cv.getBoundingClientRect();
    var x = Math.round((e.clientX - rect.left) * (cv.width / rect.width));
    var y = Math.round((e.clientY - rect.top) * (cv.height / rect.height));
    if (x < 0 || y < 0 || x >= cv.width || y >= cv.height) return;
    var d;
    try { d = ctx2d.getImageData(x, y, 1, 1).data; } catch (err) { return; }
    var hex = rgbToHex(d[0], d[1], d[2]);
    $("hoverDot").style.background = hex;
    $("picBarText").textContent = hex + "  rgb(" + d[0] + ", " + d[1] + ", " + d[2] + ")";
    return hex;
  }

  /* ============ 事件 ============ */
  function bind() {
    $("nativePicker").addEventListener("input", function () { setColor(this.value, "picker"); });
    $("hexInput").addEventListener("input", function () {
      var h = normalizeHex(this.value);
      if (h) setColor(h, "hex");
    });
    $("hexInput").addEventListener("blur", function () { render("external"); });
    ["rVal", "gVal", "bVal"].forEach(function (id) {
      $(id).addEventListener("input", function () {
        setColor(rgbToHex(
          parseInt($("rVal").value, 10) || 0,
          parseInt($("gVal").value, 10) || 0,
          parseInt($("bVal").value, 10) || 0
        ), "rgb");
      });
    });

    $("btnRandom").addEventListener("click", function () {
      var rgb = hslToRgb(Math.floor(Math.random() * 360), 55 + Math.floor(Math.random() * 40), 40 + Math.floor(Math.random() * 30));
      setColor(rgbToHex(rgb.r, rgb.g, rgb.b), "external");
    });

    $("btnEyedrop").addEventListener("click", function () {
      var ED = window.EyeDropper;
      if (!ED) { toast("当前浏览器不支持屏幕吸管，请使用图片取色"); return; }
      try {
        new ED().open().then(function (res) {
          if (res && res.sRGBHex) { setColor(res.sRGBHex, "external"); toast("取到颜色 " + res.sRGBHex.toUpperCase()); }
        }).catch(function () { /* 用户取消 */ });
      } catch (e) { toast("屏幕吸管不可用，请使用图片取色"); }
    });

    $("btnAddFav").addEventListener("click", addFav);
    $("btnClearFav").addEventListener("click", function () {
      if (!state.favs.length) { toast("色板已经是空的"); return; }
      state.favs = []; saveFavs(); renderFavs(); toast("已清空色板");
    });

    ["fgInput", "bgInput"].forEach(function (id) {
      $(id).addEventListener("input", renderContrast);
    });
    $("btnSwap").addEventListener("click", function () {
      var a = $("fgInput").value, b = $("bgInput").value;
      $("fgInput").value = b; $("bgInput").value = a;
      renderContrast();
    });
    $("btnUseFg").addEventListener("click", function () { $("fgInput").value = state.color.toLowerCase(); renderContrast(); });
    $("btnUseBg").addEventListener("click", function () { $("bgInput").value = state.color.toLowerCase(); renderContrast(); });

    document.querySelectorAll("[data-copy]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var k = btn.getAttribute("data-copy");
        var t = texts();
        if (k === "hex") copy(t.hex);
        else if (k === "rgb") copy(t.rgbText);
        else if (k === "hsl") copy(t.hslText);
        else copy("--color: " + t.hex + ";");
      });
    });

    /* 图片取色 */
    var area = $("picArea");
    area.addEventListener("click", function (e) {
      if (e.target === $("picCanvas")) return;   /* 画布上的点击交给画布处理 */
      $("imgInput").click();
    });
    $("imgInput").addEventListener("change", function () {
      if (this.files && this.files[0]) loadImage(this.files[0]);
      this.value = "";
    });
    area.addEventListener("dragover", function (e) { e.preventDefault(); area.classList.add("over"); });
    area.addEventListener("dragleave", function () { area.classList.remove("over"); });
    area.addEventListener("drop", function (e) {
      e.preventDefault();
      area.classList.remove("over");
      if (e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files[0]) loadImage(e.dataTransfer.files[0]);
    });
    var cv = $("picCanvas");
    cv.addEventListener("mousemove", function (e) { pickAt(e); });
    cv.addEventListener("click", function (e) {
      var hex = pickAt(e);
      if (hex) { setColor(hex, "external"); toast("已取色 " + hex); }
    });
  }

  /* ---------- 初始化 ---------- */
  function init() {
    if (window.EduToolStageToolbar) window.EduToolStageToolbar.init({ stage: ".stage-panel", panelHost: ".workbench", hiddenClass: "setup-hidden" });
    try {
      var c = localStorage.getItem(COLOR_KEY);
      if (c && normalizeHex(c)) state.color = normalizeHex(c);
      var f = localStorage.getItem(FAV_KEY);
      if (f) {
        var arr = JSON.parse(f);
        if (Array.isArray(arr)) {
          state.favs = arr.filter(function (x) { return !!normalizeHex(x); }).slice(0, 40);
        }
      }
    } catch (e) { /* 忽略 */ }

    if (!window.EyeDropper) {
      $("btnEyedrop").disabled = true;
      $("eyeTip").textContent = "当前浏览器不支持屏幕吸管，可用「图片取色」或从课件截图导入。";
    }

    bind();
    render("external");
    renderFavs();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
