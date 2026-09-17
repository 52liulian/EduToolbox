/* 由 MakeMeAHani graphics.txt 生成 2218 生字的笔画数桶（cnchar 风格：strokeBuckets[i] = i 画的字串）*/
const fs = require("fs");
const path = require("path");
const dir = __dirname;

const data = JSON.parse(fs.readFileSync(path.join(dir, "_data.json"), "utf8"));
const uniq = {};
for (const k of Object.keys(data)) {
  for (const ch of data[k]) uniq[ch] = true;
}
const uniqChars = Object.keys(uniq);
console.log("unique chars:", uniqChars.length);

const buckets = {};
let missing = [];
const lines = fs.readFileSync(path.join(dir, "_graphics.txt"), "utf8").split(/\r?\n/);
for (const line of lines) {
  if (!line.trim()) continue;
  let obj;
  try { obj = JSON.parse(line); } catch (e) { continue; }
  const ch = obj.character;
  if (!ch || uniq[ch] === undefined) continue;
  if (!Array.isArray(obj.strokes)) continue;
  const n = obj.strokes.length;
  if (!buckets[n]) buckets[n] = "";
  if (buckets[n].indexOf(ch) < 0) buckets[n] += ch;
  uniq[ch] = "found";
}
for (const ch of uniqChars) {
  if (uniq[ch] !== "found") missing.push(ch);
}
console.log("missing stroke data:", missing.length, missing.slice(0, 40).join(""));

// 输出为稀疏数组（index=笔画数，value=字串），缺失的归到 0 号桶便于排查
const maxN = Math.max.apply(null, Object.keys(buckets).map(Number));
const arr = new Array(maxN + 1).fill("");
for (const n of Object.keys(buckets)) arr[n] = buckets[n];
if (missing.length) arr[0] = missing.join("");

fs.writeFileSync(
  path.join(dir, "_strokes.json"),
  JSON.stringify(arr),
  "utf8"
);
console.log("max strokes:", maxN, "WROTE _strokes.json size:", JSON.stringify(arr).length);
