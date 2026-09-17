/* 提取 classtool.cn 原版混淆 JS 中的 hanziMap 数据 */
const fs = require("fs");
const vm = require("vm");

let src = fs.readFileSync(__dirname + "/_source.js", "utf8");

/** 按 indexOf 精确替换子串（避免正则元字符歧义） */
function spliceSubstr(str, needle, replacement) {
  const i = str.indexOf(needle);
  if (i < 0) { console.warn("NOT FOUND:", needle.slice(0, 40)); return str; }
  return str.slice(0, i) + replacement + str.slice(i + needle.length);
}

// 1) 暴露原始 hanziMap 与解码字典：注意原代码中 _0x3e6c9a / _0xdb4da7 / _0x5c2214
//    同属一个 var 声明（逗号分隔），故替换须带上前导逗号并重新起 var。
src = spliceSubstr(
  src,
  ",_0x5c2214=new Vue({",
  ";global.__HANZI=_0xdb4da7;global.__DEC=_0x32c8b2;var _0x5c2214=new Vue({"
);
// 2) 中和两处自校验/控制台篡改调用（沙箱无完整 console 会抛错，阻断后续数据定义）
src = spliceSubstr(src, "_0x32c8b2[_0x5a5d15(0x4b7,0x46e,0x3f5,0x52d)](_0x3622eb)", "0");
src = spliceSubstr(src, "_0x32c8b2['bGLjH'](_0x131b06)", "0");

// 最小化 DOM/浏览器 mock
const noop = function () {};
const fakeEl = {
  style: {},
  setAttribute: noop,
  appendChild: noop,
  insertBefore: noop,
  querySelector: () => fakeEl,
  querySelectorAll: () => [],
  addEventListener: noop,
  removeEventListener: noop,
  getContext: () => null,
};
const document = {
  createElement: () => ({ ...fakeEl }),
  createTextNode: () => ({}),
  head: fakeEl,
  body: fakeEl,
  getElementsByTagName: () => [fakeEl],
  getElementById: () => null,
  querySelector: () => null,
  addEventListener: noop,
  removeEventListener: noop,
};

// 捕获 Vue 选项（含 data、computed、methods、mounted）
let captured = null;
function Vue(options) {
  captured = options;
  // 模拟 Vue 实例：挂载 data、computed、methods 到 this 并调用 mounted
  const inst = {};
  const data = typeof options.data === "function" ? options.data.call(inst) : options.data || {};
  Object.assign(inst, data);
  if (options.computed) {
    for (const k in options.computed) {
      Object.defineProperty(inst, k, { get: () => options.computed[k].call(inst) });
    }
  }
  if (options.methods) {
    for (const k in options.methods) {
      inst[k] = (...args) => options.methods[k].apply(inst, args);
    }
  }
  // 暴露 data 上的字段 setter
  for (const k in data) {
    Object.defineProperty(inst, k, {
      get() { return data[k]; },
      set(v) { data[k] = v; },
      configurable: true,
    });
  }
  if (options.mounted) {
    try { options.mounted.call(inst); } catch (e) { console.error("mounted err:", e.message); }
  }
  return inst;
}

const window = { Vue };
const navigator = { userAgent: "node", appVersion: "node" };

const sandbox = {
  window,
  Window: function () {},
  document,
  navigator,
  Vue,
  copyText: noop,
  console,
  Function,
  parseInt,
  parseFloat,
  isNaN,
  isFinite,
  Math,
  Date,
  RegExp,
  String,
  Number,
  Boolean,
  Object,
  Array,
  JSON,
  Error,
  TypeError,
  setTimeout,
  clearTimeout,
  setInterval,
  clearInterval,
  decodeURIComponent,
  encodeURIComponent,
  Buffer,
  exports: {},
  module: { exports: {} },
};

sandbox.global = sandbox;
sandbox.self = sandbox;
sandbox.this = sandbox;

const ctx = vm.createContext(sandbox);

fs.writeFileSync(__dirname + "/_patched.js", src, "utf8");
try {
  vm.runInContext(src, ctx, { timeout: 10000 });
} catch (e) {
  console.error("run err:", e.message);
}

// 读取注入的原始 hanziMap（_0xdb4da7）并按原脚本逻辑去重 normalize
const rawHanzi = sandbox.__HANZI;
if (rawHanzi && typeof rawHanzi === "object") {
  const out = {};
  let total = 0;
  for (const k of Object.keys(rawHanzi)) {
    const s = String(rawHanzi[k] || "").replace(/\s+/g, "");
    const seen = {};
    const arr = [];
    for (const ch of s) {
      if (!/[\u4e00-\u9fa5]/.test(ch)) continue;
      if (seen[ch]) continue;
      seen[ch] = true;
      arr.push(ch);
    }
    out[k] = arr.join("");
    total += arr.length;
    console.log(k, arr.length);
  }
  console.log("TOTAL (unique per grade, with cross-grade dupes):", total);
  fs.writeFileSync(__dirname + "/_data.json", JSON.stringify(out, null, 0), "utf8");
  console.log("WROTE _data.json");
} else {
  console.error("No __HANZI captured; sandbox keys:", Object.keys(sandbox).filter(k => k.startsWith("__")));
}
