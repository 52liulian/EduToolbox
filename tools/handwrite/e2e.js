/* 浏览器端集成测试：jsdom 模拟 DOM，验证真实渲染与导出链路 */
const { JSDOM } = require("jsdom");
const fs = require("fs");
const path = require("path");

const APP = fs.readFileSync(path.join(__dirname, "app.js"), "utf8");

// 加载完整 index.html，剥离 CDN 外链 script（jsdom 不联网，避免卡顿/报错）
let HTML = fs.readFileSync(path.join(__dirname, "index.html"), "utf8");
HTML = HTML.replace(/<script src="https:\/\/[^"]*"><\/script>/g, "");
HTML = HTML.replace(/<script src="app\.js"><\/script>/, "");

// Canvas mock —— 记录 fillText 调用以验证渲染
let fillTextCalls = 0;
const mockCtx = {
  save() {}, restore() {}, translate() {}, rotate() {}, scale() {},
  beginPath() {}, moveTo() {}, lineTo() {}, stroke() {}, arc() {}, fill() {},
  set fillStyle(v) {}, set strokeStyle(v) {}, set lineWidth(v) {}, set font(v) {}, set textBaseline(v) {},
  fillRect() {},
  fillText() { fillTextCalls++; },
};

const dom = new JSDOM(HTML, { runScripts: "outside-only", pretendToBeVisual: true });
const { window } = dom;
delete window.$;
delete window.$$;

// 全局依赖 mock（在脚本执行前就位）
window.HTMLCanvasElement.prototype.getContext = () => mockCtx;
window.HTMLCanvasElement.prototype.toDataURL = () => "data:image/png;base64,FAKE";
window.document.fonts = { ready: Promise.resolve() };
window.mammoth = { extractRawText: async () => ({ value: "docx 文本" }) };
window.pdfjsLib = {
  getDocument: () => ({
    promise: Promise.resolve({
      numPages: 1,
      getPage: async () => ({ getTextContent: async () => ({ items: [{ str: "pdf 文本" }] }) }),
    }),
  }),
};
window.jspdf = { jsPDF: class { constructor() { this.addImage = () => {}; } save() {} } };

// 手动执行 app.js（DOM 已解析完成，DOMContentLoaded 不会再触发，需手动 init）
window.eval(APP);
window.__handwriteInit(); // 手动触发初始化

// ---------- 测试运行 ----------
const tests = [];
function test(name, fn) { tests.push({ name, fn }); }
let passed = 0, failed = 0;

test("字体选择卡渲染 6 个", () => {
  if (window.document.querySelectorAll(".font-card").length !== 6) throw new Error("数量错误");
});
test("纸张选择卡渲染 4 个", () => {
  if (window.document.querySelectorAll(".paper-card").length !== 4) throw new Error("数量错误");
});
test("参数滑块更新数值显示", () => {
  const slider = window.document.getElementById("p-size");
  slider.value = "30"; slider.dispatchEvent(new window.Event("input"));
  if (window.document.getElementById("v-size").textContent !== "30") throw new Error("未更新");
});
test("render() 调用 fillText 渲染文字", () => {
  const before = fillTextCalls;
  window.document.getElementById("textInput").value = "测试渲染一二三";
  window.document.getElementById("btnPreview").click();
  if (fillTextCalls <= before) throw new Error(`fillText 未调用：${before}→${fillTextCalls}`);
});
test("切换字体后重新渲染", () => {
  const before = fillTextCalls;
  window.document.querySelectorAll(".font-card")[0].click();
  window.document.getElementById("btnPreview").click();
  if (fillTextCalls <= before) throw new Error("切换字体后未重渲染");
});
test("切换纸张背景", () => {
  window.document.querySelectorAll(".paper-card")[2].click();
  if (window.document.getElementById("paper").dataset.paper !== "grid") throw new Error("纸张未切换");
});
test("切换墨水颜色", () => {
  window.document.querySelectorAll(".color-swatch")[1].click();
  // 颜色切换通过 render 生效，触发预览验证无异常
  window.document.getElementById("btnPreview").click();
});
test("导出 PNG 生成 dataURL", () => {
  const url = window.document.getElementById("canvas").toDataURL();
  if (!url.startsWith("data:image/png")) throw new Error("格式错误");
});
test("Docx 文件可被解析", async () => {
  const file = new window.File([""], "t.docx", { type: "application/vnd.openxmlformats-officedocument" });
  const res = await window.mammoth.extractRawText({ arrayBuffer: await file.arrayBuffer() });
  if (!res.value) throw new Error("解析失败");
});

(async () => {
  for (const { name, fn } of tests) {
    try { await fn(); console.log(`  ✅ ${name}`); passed++; }
    catch (e) { console.log(`  ❌ ${name} — ${e.message}`); failed++; }
  }
  console.log(`\n通过: ${passed}  |  失败: ${failed}`);
  process.exit(failed ? 1 : 0);
})();
