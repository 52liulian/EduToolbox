/* ===== 数据层：完整种子数据内嵌于此，首次打开自动写入 IndexedDB ===== */
let DATA = {
  "school_name": "示例学校",
  "dish_db": {
    "主食": [
      { "name": "窝子面", "sides": [] },
      { "name": "馒头", "sides": [] },
      { "name": "鸡蛋", "sides": [] },
      { "name": "蒸玉米棒", "sides": [] },
      { "name": "蒸红薯", "sides": [] },
      { "name": "蒸面条（荤）", "sides": ["面条300g", "大肉50g", "黄豆芽50g"] },
      { "name": "蒸面条（素）", "sides": ["面条300g", "黄豆芽50g"] },
      { "name": "蒸面条（清真）", "sides": ["面条300g", "鸡肉80g", "黄豆芽50g"] },
      { "name": "蛋炒饭", "sides": ["米饭300g", "鸡蛋1个"] },
      { "name": "炒河粉", "sides": ["河粉100g"] },
      { "name": "炒米粉", "sides": ["米粉100g"] },
      { "name": "炒面", "sides": ["面100g"] }
    ],
    "荤菜": [
      { "name": "豆角炒肉", "sides": ["豆角100g", "大肉50g"] },
      { "name": "青椒茄子炒肉", "sides": ["青椒80g", "大肉50g", "茄子100g"] },
      { "name": "小白菜烧丸子", "sides": ["小白菜100g", "丸子50g"] },
      { "name": "韭菜烧猪血", "sides": ["韭菜100g", "猪血100g"] },
      { "name": "卤翅根", "sides": ["鸡翅根1个"] },
      { "name": "鱼香肉丝", "sides": ["大肉50g", "木耳30g", "胡萝卜30g"] },
      { "name": "宫保鸡丁", "sides": ["鸡丁80g", "黄瓜50g", "胡萝卜50g"] },
      { "name": "腐竹炒肉丝", "sides": ["腐竹100g", "肉丝80g"] },
      { "name": "红烧鱼块", "sides": ["鱼块100g"] },
      { "name": "糖醋里脊", "sides": ["里脊100g"] },
      { "name": "豆干炒肉", "sides": ["豆干100g", "肉丝50g"] },
      { "name": "蒜台炒肉", "sides": ["蒜台100g", "肉丝50g"] },
      { "name": "红烧翅根", "sides": ["翅根1个"] },
      { "name": "豆角炒肉", "sides": ["豆角80g", "肉丝50g"] },
      { "name": "青椒炒肉", "sides": ["青椒80g", "肉丝50g"] },
      { "name": "青椒炒猪肝", "sides": ["猪肝100g"] },
      { "name": "土豆烧牛肉", "sides": ["土豆100g", "牛肉30g"] },
      { "name": "辣椒炒羊肝", "sides": ["羊肝50g"] },
      { "name": "冬瓜烧五花肉", "sides": ["肉40g", "冬瓜80g"] },
      { "name": "土豆烧鸡", "sides": ["鸡肉50g", "土豆80g"] },
      { "name": "辣椒炒千张", "sides": ["辣椒50g", "千张100g"] },
      { "name": "土豆炒肉", "sides": ["土豆150g", "肉丝50g"] },
      { "name": "咖喱鸡块", "sides": ["鸡块100g"] },
      { "name": "芹菜炒肉", "sides": ["芹菜100g", "肉丝50g"] }
    ],
    "素菜": [
      { "name": "红烧豆腐", "sides": ["豆腐100g"] },
      { "name": "蒜蓉青菜", "sides": ["青菜100g"] },
      { "name": "青椒炒西葫芦", "sides": ["西葫芦100g"] },
      { "name": "煎豆腐小白菜", "sides": ["小白菜100g"] },
      { "name": "香菇菜心", "sides": ["菜心100g"] },
      { "name": "蒜蓉白菜", "sides": ["白菜100g"] },
      { "name": "清炒黄心菜", "sides": ["黄心菜100g"] },
      { "name": "酸辣土豆丝", "sides": ["土豆丝100g"] },
      { "name": "蒜蓉苔菜", "sides": ["苔菜100g"] },
      { "name": "酸辣白菜", "sides": ["白菜100g"] },
      { "name": "蒜蓉包菜", "sides": ["包菜100g"] },
      { "name": "青椒炒千张", "sides": ["青椒100g", "千张100g"] },
      { "name": "油麦菜炒千张", "sides": ["油麦菜100g", "千张100g"] },
      { "name": "青椒烧冬瓜", "sides": ["冬瓜100g"] },
      { "name": "清炒莴笋", "sides": ["莴笋100g"] },
      { "name": "青菜炒千张", "sides": ["青菜100g", "千张100g"] },
      { "name": "酸辣土豆丝", "sides": ["土豆丝100g"] },
      { "name": "麻婆豆腐", "sides": ["豆腐100g"] },
      { "name": "青椒木耳洋葱千叶豆腐", "sides": ["青椒100g", "洋葱30g", "千叶豆腐100g"] },
      { "name": "清炒冬瓜虾米", "sides": ["冬瓜100g"] },
      { "name": "干煸豆角", "sides": ["豆角100g"] },
      { "name": "韭菜黄豆芽", "sides": ["韭黄20g", "黄豆芽100g"] },
      { "name": "麻婆豆腐", "sides": ["豆腐100g"] }
    ],
    "粥汤": [
      { "name": "胡辣汤", "sides": [] },
      { "name": "牛肉胡辣汤", "sides": ["牛肉30g"] },
      { "name": "八宝粥", "sides": [] },
      { "name": "小米粥", "sides": [] },
      { "name": "绿豆粥", "sides": [] },
      { "name": "大米花生红豆粥", "sides": [] },
      { "name": "金银二米粥", "sides": [] },
      { "name": "玉米糁", "sides": [] },
      { "name": "西红柿鸡蛋汤", "sides": [] },
      { "name": "鱼头豆腐汤", "sides": [] },
      { "name": "紫菜蛋花汤", "sides": [] },
      { "name": "绿豆汤", "sides": [] }
    ],
    "面点": [
      { "name": "炸油条", "sides": [] },
      { "name": "糖包", "sides": [] },
      { "name": "三鲜包", "sides": [] }
    ],
    "其它": [
      { "name": "洋葱炒蛋", "sides": ["洋葱100g", "鸡蛋1个"] },
      { "name": "蒜台炒蛋", "sides": ["蒜台100g", "鸡蛋1个"] },
      { "name": "西红柿炒鸡蛋", "sides": ["西红柿100g", "鸡蛋1个"] },
      { "name": "西葫芦炒鸡蛋", "sides": ["西葫芦100g", "鸡蛋1个"] }
    ]
  },
  "weeks": {
    "2026-08-31": {
      "label": "9月第1周", "range": "2026年8月31日——2026年9月4日", "startDate": "2026-08-31", "endDate": "2026-09-04",
      "days": {
        "星期一": { "早餐": [], "中餐": [], "晚餐": [] },
        "星期二": { "早餐": [], "中餐": [], "晚餐": [] },
        "星期三": { "早餐": [], "中餐": [], "晚餐": [] },
        "星期四": { "早餐": [], "中餐": [], "晚餐": [] },
        "星期五": { "早餐": [], "中餐": [], "晚餐": [] }
      }
    },
    "2026-09-07": {
      "label": "9月第2周", "range": "2026年9月7日——2026年9月11日", "startDate": "2026-09-07", "endDate": "2026-09-11",
      "days": {
        "星期一": { "早餐": ["洋葱炒蛋（洋葱100g 鸡蛋1个）", "韭菜黄豆芽（韭黄20g 黄豆芽100g）", "蒸红薯", "三鲜包", "馒头", "鸡蛋", "绿豆粥"], "中餐": ["鱼香肉丝（大肉50g 木耳30g 胡萝卜30g）", "红烧鱼块（鱼块100g）", "清炒冬瓜虾米（冬瓜100g）", "香菇菜心（菜心100g）", "蒸面条（荤）（面条300g 大肉50g 黄豆芽50g）", "鱼头豆腐汤", "咖喱鸡块（鸡块100g）"], "晚餐": ["豆干炒肉（豆干100g 肉丝50g）", "酸辣白菜（白菜100g）", "馒头", "鸡蛋", "八宝粥"] },
        "星期二": { "早餐": ["胡辣汤", "炸油条", "芹菜炒肉（芹菜100g 肉丝50g）", "麻婆豆腐（豆腐100g）", "馒头", "鸡蛋", "小米粥"], "中餐": ["青椒炒猪肝（猪肝100g）", "宫保鸡丁（鸡丁80g 黄瓜50g 胡萝卜50g）", "清炒黄心菜（黄心菜100g）", "酸辣土豆丝（土豆丝100g）", "蛋炒饭（米饭300g 鸡蛋1个）", "紫菜蛋花汤"], "晚餐": ["蒜台炒肉（蒜台100g 肉丝50g）", " 韭菜黄豆芽（韭黄20g 黄豆芽80g）", "馒头", "鸡蛋", "小米粥"] },
        "星期三": { "早餐": ["窝子面", "西葫芦炒鸡蛋（西葫芦100g 鸡蛋1个）", "干煸豆角（豆角100g）", "馒头", "鸡蛋", "蒸红薯", "玉米糁"], "中餐": ["红烧翅根（翅根1个）", "豆角炒肉（豆角100g 大肉50g）", "西葫芦炒鸡蛋（西葫芦100g 鸡蛋1个）", "蒜蓉苔菜（苔菜100g）", "炒河粉（河粉100g）", "西红柿鸡蛋汤"], "晚餐": ["青椒炒肉（青椒80g 肉丝50g）", "韭菜烧猪血（韭菜100g 猪血100g）", "馒头", "鸡蛋", "绿豆粥"] },
        "星期四": { "早餐": ["牛肉胡辣汤（牛肉30g）", "酸辣土豆丝（土豆丝100g）", "油麦菜炒千张（油麦菜100g 千张100g）", "馒头", "鸡蛋", "八宝粥"], "中餐": ["冬瓜烧五花肉（肉40g 冬瓜80g）", "土豆烧鸡（鸡肉50g 土豆80g）", "蒜蓉白菜（白菜100g）", "红烧豆腐（豆腐100g）", "蛋炒饭（米饭300g 鸡蛋1个）", "紫菜蛋花汤"], "晚餐": ["土豆炒肉（土豆150g 肉丝50g）", "青椒炒千张（青椒80g 千张100g）", "馒头", "鸡蛋", "玉米糁"] },
        "星期五": { "早餐": ["窝子面", "蒜台炒蛋（蒜台120g）", "酸辣白菜（白菜100g）", "馒头", "鸡蛋", "绿豆粥"], "中餐": ["土豆烧牛肉（土豆100g 牛肉30g）", "辣椒炒羊肝（羊肝50g）", "蒜蓉包菜（包菜100g）", "西红柿炒鸡蛋（西红柿100g 鸡蛋1个）", "紫菜蛋花汤"], "晚餐": [] }
      }
    },
    "2026-09-14": {
      "label": "9月第3周", "range": "2026年9月14日——2026年9月18日", "startDate": "2026-09-14", "endDate": "2026-09-18",
      "days": {
        "星期一": { "早餐": [], "中餐": [], "晚餐": [] },
        "星期二": { "早餐": [], "中餐": [], "晚餐": [] },
        "星期三": { "早餐": [], "中餐": [], "晚餐": [] },
        "星期四": { "早餐": [], "中餐": [], "晚餐": [] },
        "星期五": { "早餐": [], "中餐": [], "晚餐": [] }
      }
    },
    "2026-09-21": {
      "label": "9月第4周", "range": "2026年9月21日——2026年9月25日", "startDate": "2026-09-21", "endDate": "2026-09-25",
      "days": {
        "星期一": { "早餐": [], "中餐": [], "晚餐": [] },
        "星期二": { "早餐": [], "中餐": [], "晚餐": [] },
        "星期三": { "早餐": [], "中餐": [], "晚餐": [] },
        "星期四": { "早餐": [], "中餐": [], "晚餐": [] },
        "星期五": { "早餐": [], "中餐": [], "晚餐": [] }
      }
    },
    "2026-09-28": {
      "label": "9月第5周", "range": "2026年9月28日——2026年10月2日", "startDate": "2026-09-28", "endDate": "2026-10-02",
      "days": {
        "星期一": { "早餐": [], "中餐": [], "晚餐": [] },
        "星期二": { "早餐": [], "中餐": [], "晚餐": [] },
        "星期三": { "早餐": [], "中餐": [], "晚餐": [] },
        "星期四": { "早餐": [], "中餐": [], "晚餐": [] },
        "星期五": { "早餐": [], "中餐": [], "晚餐": [] }
      }
    }
  }
};
const DAYS = ["星期一","星期二","星期三","星期四","星期五"];
const MEALS = ["早餐","中餐","晚餐"];
const STAPLES = { "早餐": [], "中餐": [], "晚餐": [] };

/* ================= 动态菜品分类（从 DATA.dish_db 的 keys 实时获取） ================= */
function getCategories() { return Object.keys(DATA.dish_db || {}); }

/* 菜名/食材同义词表：搜索关键字时双向扩展（如 番茄↔西红柿、蒜苔↔蒜台） */
const SYNONYMS = {
  "蒜台": ["蒜苔","蒜薹"], 
  "西红柿": ["番茄","洋柿子"], 
  "土豆": ["马铃薯","洋芋"],
  "包菜": ["卷心菜","甘蓝","圆白菜"], 
  "虾米": ["海米","虾皮"],
  "千张": ["豆皮","干豆腐"], 
  "胡辣汤": ["糊辣汤","牛肉胡辣汤"], 
  "玉米糁": ["玉米粥","包谷糁","棒子糁"],
  "豆芽": ["芽菜"], 
  "冬瓜": [], 
  "白菜": ["大白菜"]
};

/* ===== 菜品数据契约：标准对象 {name:"土豆烧牛肉", sides:["土豆100g","牛肉30g"]} =====
   - 菜品库（dish_db）所有条目统一为标准对象；周菜谱餐格内是展示文本字符串，不走此契约。
   - parseDishString 仅用于一次性迁移旧版字符串菜品，业务代码不再处理字符串菜品。 */

/* 解析旧字符串菜品（仅迁移用）：@param 菜名字符串；@returns {{name:string, sides:string[]}} */
function parseDishString(s) {
  const m = String(s).trim().match(/^([^（(]+)[（(]([^）)]*)[）)]\s*$/);
  if (!m) return { name: String(s).trim(), sides: [] };
  const sides = m[2].split(/[\s、,，;；]+/).map(x => x.trim()).filter(Boolean);
  return { name: m[1].trim(), sides };
}

/* 一次性迁移：把 dish_db 中遗留的字符串菜品转为标准对象 {name, sides}。
   覆盖内嵌种子与老用户 IndexedDB 数据；迁移后应持久化。
   @param DATA 对象（原地修改）；@returns {boolean} 是否发生了迁移 */
function migrateDishDb(data) {
  if (!data || !data.dish_db) return false;
  let changed = false;
  Object.keys(data.dish_db).forEach(cat => {
    data.dish_db[cat] = (data.dish_db[cat] || []).map(e => {
      if (typeof e === "string") { changed = true; const p = parseDishString(e); return { name: p.name, sides: p.sides || [] }; }
      if (e && typeof e === "object") return { name: (e.name || "").trim(), sides: Array.isArray(e.sides) ? e.sides : [] };
      return e;
    });
  });
  return changed;
}

/* 菜品条目取标准字段：@param 标准对象 {name, sides?, aliases?}；@returns {{name, sides, aliases}} */
function normalizeDish(e) {
  return { name: (e && e.name ? String(e.name) : "").trim(),
           sides: (e && Array.isArray(e.sides)) ? e.sides : [],
           aliases: (e && Array.isArray(e.aliases)) ? e.aliases : [] };
}

/* 菜品完整显示名：名字 +（配菜1 配菜2…）；无配菜则仅名字。
   例：{name:"土豆烧牛肉",sides:["土豆100g","牛肉30g"]} → "土豆烧牛肉（土豆100g 牛肉30g）"
   @param 菜品条目；@returns 用于表格/下拉/候选展示的完整菜名 */
function dishText(e) {
  const d = normalizeDish(e);
  return (d.sides && d.sides.length) ? `${d.name}（${d.sides.join(" ")}）` : d.name;
}

/* 菜品库扁平清单（按当前动态分类顺序）。
   @returns [{name, sides, aliases, cat, text}]，text 为完整显示名 */
function allDishes() {
  const out = [];
  getCategories().forEach(cat => (DATA.dish_db[cat] || []).forEach(e => {
    const d = normalizeDish(e);
    if (d.name) out.push({ ...d, cat, text: dishText(e) });
  }));
  return out;
}

/* 关键字搜索菜品：匹配 菜名 > 别名 > 配菜（含克重，含同义词双向扩展），按相关度降序。
   @param 关键字（可空，空时返回全部）；@returns 命中的菜品对象数组 */
function searchDishes(kw) {
  const all = allDishes();
  kw = (kw || "").trim();
  if (!kw) return all;
  const toks = [kw];
  Object.keys(SYNONYMS).forEach(k => {
    if (kw.includes(k)) SYNONYMS[k].forEach(s => toks.push(s));
    SYNONYMS[k].forEach(s => { if (kw.includes(s)) toks.push(k); });
  });
  return all.map(d => {
    let score = 0;
    if (d.name === kw) score = 100;
    else if (d.name.startsWith(kw)) score = 80;
    else if (d.name.includes(kw)) score = 60;
    else {
      for (const t of toks) {
        if (d.aliases.some(a => a.includes(t))) score = Math.max(score, 45);
        if (d.sides.some(s => s.includes(t))) score = Math.max(score, 35);
        if ([...d.aliases, ...d.sides].join(" ").includes(t)) score = Math.max(score, 25);
      }
    }
    return { d, score };
  }).filter(x => x.score > 0).sort((a, b) => b.score - a.score).map(x => x.d);
}

/* ================= 当月周次计算（核心功能） ================= */
/* 取某年某月的「周一~周五」周次列表。
   - 以该月 1 号所在周的【周一】为起点，每周步进 7 天
   - 只保留 start 落在当月内的周次
   - 每项: {key, label, start(Y-m-d), end(Y-m-d)}
   例如 2026-09 → 5 周：8/31-9/4, 9/7-9/11, ..., 9/28-10/2 */
function getMonthWeeks(year, month) {
  const weeks = [];
  const first = new Date(year, month - 1, 1);
  // 该周周一（getDay(): 周一=1，周日=0 → 统一转成 1~7）
  let dow = first.getDay(); if (dow === 0) dow = 7;
  const monday = new Date(first); monday.setDate(first.getDate() - (dow - 1));
  const fmt = d => `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
  let idx = 1;
  for (let i = 0; i < 6; i++) {
    const start = new Date(monday); start.setDate(monday.getDate() + i * 7);
    const startMonth = start.getMonth() + 1;
    if (startMonth > month) break;
    // ★ 关键：start 在当月，或「第1周跨月但覆盖当月1号」→ 都保留
    const isFirstWeekCovering = (i === 0 && start <= first && new Date(start.getTime()+4*86400000) >= first);
    if (startMonth !== month && !isFirstWeekCovering) continue;
    const end = new Date(start); end.setDate(start.getDate() + 4);
    weeks.push({ key: fmt(start), label: `${month}月第${idx}周`, start: fmt(start), end: fmt(end) });
    idx++;
  }
  return weeks;
}

/* 格式化日期文本为 "YYYY年M月D日——YYYY年M月D日"（如 2026年9月7日——2026年9月11日） */
function buildRange(start, end) {
  if (!start) return "";
  const s = new Date(start), e = end ? new Date(end) : new Date(s);
  const fmt = d => `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`;
  return `${fmt(s)}——${fmt(e)}`;
}

/* ===== 填充「选择周」下拉框：跨月（当月 ± 1 月）+ 已有周次 ===== */
function fillWeeks() {
  const sel = document.getElementById("weekSel");
  sel.innerHTML = "";
  const now = new Date();
  const y0 = now.getFullYear(), m0 = now.getMonth() + 1;

  // 1) 生成「上个月 + 当月 + 下个月」的所有周次（支持跨月选择、提前排菜谱）
  const allWeeks = [];
  const seen = new Set();
  for (let offset = -1; offset <= 1; offset++) {
    const d = new Date(y0, m0 - 1 + offset, 1);
    const y = d.getFullYear(), m = d.getMonth() + 1;
    getMonthWeeks(y, m).forEach(w => { if (!seen.has(w.key)) { seen.add(w.key); allWeeks.push(w); } });
  }

  // 2) 补入 DATA.weeks 中已存在但不在上面范围的（历史排过的旧周、手动加的远未来周）
  Object.keys(DATA.weeks || {}).forEach(k => {
    if (!seen.has(k)) {
      seen.add(k);
      const endD = new Date(k); endD.setDate(endD.getDate() + 4);
      const fmt = d => `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
      const label = (DATA.weeks[k] && DATA.weeks[k].label) ||
        `${new Date(k).getFullYear()}年${new Date(k).getMonth()+1}月第${weekNumberOf(k)}周`;
      allWeeks.push({ key: k, start: k, end: fmt(endD), label });
    }
  });
  // 3) 按 start 日期升序排
  allWeeks.sort((a, b) => a.start < b.start ? -1 : a.start > b.start ? 1 : 0);

  // 4) 渲染下拉项
  allWeeks.forEach(w => {
    const opt = document.createElement("option");
    opt.value = w.key;
    opt.textContent = `${w.label}（${w.start.slice(5)} ~ ${w.end.slice(5)}）`;
    sel.appendChild(opt);
  });

  // 5) 默认选中：今天所在周；周末取刚结束的周；回退第 1 周
  const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
  let def = allWeeks.findIndex(w => w.start <= todayStr && todayStr <= w.end);
  if (def < 0) {
    for (let i = allWeeks.length - 1; i >= 0; i--) {
      if (allWeeks[i].start <= todayStr) { def = i; break; }
    }
  }
  if (sel.options.length > 0) sel.selectedIndex = def < 0 ? 0 : def;

  // 6) 绑定 change 事件
  sel.addEventListener("change", onWeekSelect);
  onWeekSelect();
}

/* 给定周一日期 key 推算本周 start/end/label（跨月通用，不依赖 getMonthWeeks）。
   @param key 周一日期 YYYY-MM-DD；@returns {{key, start, end, label}} */
function deriveWeekFromKey(key) {
  const startD = new Date(key);
  const endD = new Date(startD); endD.setDate(startD.getDate() + 4);
  const fmt = d => `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
  const existing = DATA.weeks[key];
  const label = (existing && existing.label) ? existing.label
              : `${startD.getFullYear()}年${startD.getMonth()+1}月第${weekNumberOf(key)}周`;
  return { key, start: fmt(startD), end: fmt(endD), label };
}

/* 计算某日期是当月第几周（周一为周起点）。@param ds YYYY-MM-DD；@returns number */
function weekNumberOf(ds) {
  const d = new Date(ds);
  const first = new Date(d.getFullYear(), d.getMonth(), 1);
  let dow = first.getDay(); if (dow === 0) dow = 7;
  const firstMonday = new Date(first); firstMonday.setDate(first.getDate() - (dow - 1));
  const diffDays = Math.round((d - firstMonday) / 86400000);
  return diffDays < 0 ? 1 : Math.floor(diffDays / 7) + 1;
}

/* 当前周 key 往前/往后 7 天（自然跨越月界）。@param key 周一日期；@returns 新 key */
function prevWeekKey(key) {
  const d = new Date(key); d.setDate(d.getDate() - 7);
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
}
function nextWeekKey(key) {
  const d = new Date(key); d.setDate(d.getDate() + 7);
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
}

/* 跳转到指定周（key 为周一日期）：设置下拉选中并触发渲染。
   跨月时自动把新 key 补进下拉。@param key 周一日期 YYYY-MM-DD */
function jumpToWeek(key) {
  const sel = document.getElementById("weekSel");
  if (!Array.from(sel.options).some(o => o.value === key)) {
    const w = deriveWeekFromKey(key);
    const opt = document.createElement("option");
    opt.value = key;
    opt.textContent = `${w.label}（${w.start.slice(5)} ~ ${w.end.slice(5)}）`;
    sel.appendChild(opt);
  }
  sel.value = key;
  onWeekSelect();
}
/* 工具栏按钮：上一周 / 下一周 */
function goPrevWeek() { jumpToWeek(prevWeekKey(currentWeekKey())); }
function goNextWeek() { jumpToWeek(nextWeekKey(currentWeekKey())); }

/* 选择周次后：自动设置开始/结束日期 + 同步 range + 刷新表格。
   跨月友好：直接从 key（周一日期字符串）推算，不再依赖「当前月」getMonthWeeks 查找 */
function onWeekSelect() {
  const key = document.getElementById("weekSel").value;
  if (!key) return;
  const w = deriveWeekFromKey(key);
  document.getElementById("startDate").value = w.start;
  document.getElementById("endDate").value = w.end;

  if (!DATA.weeks[key]) {
    DATA.weeks[key] = {
      label: w.label, range: buildRange(w.start, w.end),
      startDate: w.start, endDate: w.end,
      days: (() => { const o = {}; DAYS.forEach(d => o[d] = {早餐:[],中餐:[],晚餐:[]}); return o; })(),
    };
  } else {
    DATA.weeks[key].label = w.label;
    DATA.weeks[key].range = buildRange(w.start, w.end);
    DATA.weeks[key].startDate = w.start;
    DATA.weeks[key].endDate = w.end;
  }
  save(); render();
}

/* 日期选择器被手动修改时：若匹配到某周次则同步下拉框选中，否则清空选中 */
function syncWeekFromDate() {
  const s = document.getElementById("startDate").value;
  const sel = document.getElementById("weekSel");
  if (!s) return;
  // 遍历下拉项找匹配
  let matched = false;
  for (let i = 0; i < sel.options.length; i++) {
    if (sel.options[i].value === s) { sel.selectedIndex = i; matched = true; break; }
  }
  if (!matched) sel.value = ""; // 自定义日期（不在当月周次内）
}

/* 组装某餐完整菜品（含自动标配） */
function fullMeal(week, day, meal) {
  const list = (week.days[day][meal] || []).slice();
  if (list.length === 0) return list;
  const staples = STAPLES[meal] || [];
  staples.forEach(s => { if (!list.includes(s)) list.push(s); });
  return list;
}

/* 渲染表格 */
function render() {
  const key = document.getElementById("weekSel").value;
  const week = DATA.weeks[key];
  if (!week) return;
  const start = document.getElementById("startDate").value;
  const end = document.getElementById("endDate").value;
  if (start) week.range = buildRange(start, end);
  document.getElementById("tblTitle").textContent = `${schoolName()}一周食谱`;
  document.getElementById("tblRange").textContent = week.range || "";
  document.getElementById("tblTitle").colSpan = 4;
  document.getElementById("tblRange").colSpan = 4;
  const body = document.getElementById("mealBody");
  body.innerHTML = "";
  DAYS.forEach(day => {
    const tr = document.createElement("tr");
    const tdDay = document.createElement("td");
    tdDay.className = "day"; tdDay.textContent = day;
    tr.appendChild(tdDay);
    MEALS.forEach(meal => {
      const td = document.createElement("td");
      td.className = "meal";
      // 拖拽落点：允许菜品拖入
      td.dataset.weekKey = key; td.dataset.day = day; td.dataset.meal = meal;
      td.ondragover = e => { e.preventDefault(); td.classList.add("drop-over"); };
      td.ondragleave = () => td.classList.remove("drop-over");
      td.ondrop = e => { e.preventDefault(); td.classList.remove("drop-over"); handleDishDrop(e, key, day, meal); };
      const dishes = fullMeal(week, day, meal);
      dishes.forEach((d, i) => {
        const span = document.createElement("span");
        span.className = "dish";
        const isStaple = (STAPLES[meal] || []).includes(d);
        span.innerHTML = escapeHtml(d) + (isStaple ? "" : ` <span class="x" onclick="delDish('${key}','${day}','${meal}',${i})">✕</span>`);
        if (isStaple) span.classList.add("staple");
        // 拖拽源：只有非标配菜品可拖
        if (!isStaple) {
          span.draggable = true;
          span.ondragstart = e => {
            e.dataTransfer.setData("text/plain", JSON.stringify({weekKey:key, day, meal, index:i}));
            e.dataTransfer.effectAllowed = "move";
            span.classList.add("dragging");
          };
          span.ondragend = () => span.classList.remove("dragging");
        }
        td.appendChild(span);
        td.appendChild(document.createElement("br"));
      });
      const add = document.createElement("div");
      add.className = "add-hint";
      add.textContent = "➕ 添加菜品";
      add.onclick = () => openAddToMeal(key, day, meal);
      td.appendChild(add);
      tr.appendChild(td);
    });
    body.appendChild(tr);
  });
}
/* HTML 转义（含引号，可安全用于属性值与文本） */
function escapeHtml(s){ return String(s).replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c])); }

/* ===== 菜品库管理弹窗：分类管理 + 菜品列表 + 添加/编辑菜品 ===== */
let _libCat = "";   // 当前选中的分类
let _editIdx = -1;  // 当前编辑中的菜品索引（-1 表示非编辑态）
/* 打开菜品库弹窗：两栏布局（左=分类管理，右=菜品+添加/编辑） */
function openDishLibrary() {
  if (!DATA.dish_db) DATA.dish_db = {};
  const html = `
  <div style="display:flex;gap:16px;min-height:360px;box-sizing:border-box;">
    <!-- 左栏：分类管理 -->
    <div style="width:120px;flex-shrink:0;border-right:1px solid #e0e4eb;padding-right:10px;">
      <h4 style="margin:0 0 10px;font-size:13px;color:#1a3a6b;font-weight:bold;">📁 分类管理</h4>
      <div id="libCatList" style="margin-bottom:10px;"></div>
      <div style="display:flex;gap:4px;">
        <input id="libNewCat" placeholder="新分类" style="width:70px;font-size:12px;padding:4px 6px;border:1px solid #ccd;border-radius:4px;">
        <button onclick="doAddCategory()" style="padding:4px 10px;font-size:12px;">+</button>
      </div>
      <p style="color:#aaa;font-size:11px;margin-top:8px;line-height:1.4;">点击分类名可选中<br>✎ 改名 &nbsp; ✕ 删除空分类</p>
    </div>
    <!-- 右栏：菜品列表 + 添加/编辑菜品 -->
    <div style="width:300px;flex-shrink:0;">
      <h4 id="libCurTitle" style="margin:0 0 8px;font-size:13px;color:#1a3a6b;font-weight:bold;"></h4>
      <div id="libDishList" style="max-height:240px;overflow-y:auto;margin-bottom:8px;border:1px solid #eef;border-radius:4px;"></div>
      <div id="libEmptyHint" style="color:#999;font-size:12px;display:none;padding:8px;text-align:center;">该分类暂无菜品，可在下方添加</div>
      <div style="border-top:1px dashed #ccd;margin:6px 0 10px;"></div>
      <h4 id="libFormTitle" style="margin:2px 0 6px;font-size:13px;color:#1a3a6b;font-weight:bold;">➕ 添加菜品</h4>
      <label style="display:block;font-size:12px;color:#666;margin-bottom:2px;">菜品名称</label>
      <input id="libNewDish" placeholder="如：土豆烧牛肉" style="width:100%;margin-bottom:8px;padding:6px 8px;font-size:13px;border:1px solid #ccd;border-radius:4px;box-sizing:border-box;">
      <label style="display:block;font-size:12px;color:#666;margin-bottom:2px;">食材（选填，可添加多个）</label>
      <div id="libIngRows" style="margin-bottom:4px;"></div>
      <button type="button" onclick="addIngRow()" style="font-size:12px;padding:4px 10px;border:1px dashed #8aa4c8;background:#fff;border-radius:4px;cursor:pointer;color:#1a3a6b;">+ 添加食材</button>
      <div style="text-align:right;margin-top:12px;display:flex;gap:6px;justify-content:flex-end;">
        <button id="libCancelEdit" class="ghost" onclick="cancelEditLibDish()" style="display:none;">取消编辑</button>
        <button class="ghost" onclick="closeModal()">关闭</button>
        <button id="libSubmitBtn" onclick="doAddDishToLib()">确认添加</button>
      </div>
    </div>
  </div>`;
  showModal("🥬 菜品库", html, "480px");
  _libCat = getCategories()[0] || "";   // showModal 会清空 _libCat，这里重新赋值
  _editIdx = -1;
  renderLibCatList();
  renderLibDishList();
}

/* 渲染分类列表：每项可选中/改名/删除 */
function renderLibCatList() {
  const cats = getCategories();
  const box = document.getElementById("libCatList");
  if (!box) return;
  if (!cats.length) {
    box.innerHTML = '<div style="color:#999;font-size:12px;padding:6px;">（暂无分类）</div>';
    return;
  }
  box.innerHTML = cats.map(c => {
    const isSel = c === _libCat;
    return `<div style="display:flex;align-items:center;gap:2px;margin:2px 0;padding:4px 6px;
      border-radius:4px;cursor:pointer;transition:background .15s;${isSel ? 'background:#eef3fb;font-weight:600;' : ''}"
      onmouseover="this.style.background='#f5f8ff'" onmouseout="this.style.background='${isSel ? '#eef3fb' : 'transparent'}'">
      <span onclick="pickLibCat('${escapeHtml(c)}')" style="font-size:13px;max-width:80px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${escapeHtml(c)}</span>
      <span onclick="renameCat('${escapeHtml(c)}')" style="margin-left:auto;color:#1a3a6b;cursor:pointer;font-size:11px;padding:0 2px;" title="改名">✎</span>
      <span onclick="deleteCat('${escapeHtml(c)}')" style="flex-shrink:0;color:#c33;cursor:pointer;font-size:11px;padding:0 2px;" title="删除空分类">✕</span>
    </div>`;
  }).join("");
}

/* 选中某个分类 */
function pickLibCat(c) {
  if (_editIdx >= 0 && !confirm("当前有未保存的编辑，确认切换分类？")) return;
  _editIdx = -1;
  resetLibDishForm();
  _libCat = c; renderLibCatList(); renderLibDishList();
}

/* 添加新分类 */
function doAddCategory() {
  const input = document.getElementById("libNewCat");
  const name = (input.value || "").trim();
  if (!name) { alert("请输入分类名"); return; }
  if (!DATA.dish_db) DATA.dish_db = {};
  if (DATA.dish_db[name]) { alert("分类已存在：" + name); return; }
  DATA.dish_db[name] = [];
  input.value = "";
  save();
  _libCat = name;
  renderLibCatList();
  renderLibDishList();
}

/* 重命名分类：prompt 输入新名，更新 dish_db key（保留菜品） */
function renameCat(oldName) {
  const newName = prompt(`将分类「${oldName}」改名为：`, oldName);
  if (newName === null) return;
  const n = newName.trim();
  if (!n || n === oldName) return;
  if (DATA.dish_db[n]) { alert("该分类已存在"); return; }
  DATA.dish_db[n] = DATA.dish_db[oldName];
  delete DATA.dish_db[oldName];
  if (_libCat === oldName) _libCat = n;
  save();
  renderLibCatList();
  renderLibDishList();
}

/* 删除分类（仅允许空分类；有菜品的提示先删菜品） */
function deleteCat(name) {
  const arr = DATA.dish_db[name] || [];
  if (arr.length) { alert(`「${name}」下还有 ${arr.length} 个菜品，请先删除全部菜品`); return; }
  if (!confirm(`确认删除空分类「${name}」？`)) return;
  delete DATA.dish_db[name];
  if (_libCat === name) _libCat = getCategories()[0] || "";
  save();
  renderLibCatList();
  renderLibDishList();
}

/* 渲染当前分类下的菜品列表 */
function renderLibDishList() {
  const box = document.getElementById("libDishList");
  const title = document.getElementById("libCurTitle");
  const hint = document.getElementById("libEmptyHint");
  if (!box) return;
  if (!_libCat) {
    title.textContent = "当前分类：（请先添加或选择一个分类）";
    box.innerHTML = ""; hint.style.display = "block";
    return;
  }
  const arr = DATA.dish_db[_libCat] || [];
  title.textContent = "当前分类：" + _libCat + "（" + arr.length + " 个菜品）";
  if (!arr.length) {
    box.innerHTML = ""; hint.style.display = "block"; return;
  }
  hint.style.display = "none";
  box.innerHTML = arr.map((e, i) => {
    const name = normalizeDish(e).name;   // 菜品库列表只显示菜名，配菜不在此处拼接
    const isEditing = i === _editIdx;
    if (isEditing) return "";   // 编辑中的菜品不渲染到列表
    return `<div style="display:flex;align-items:center;gap:6px;margin:0;padding:5px 8px;
      border-bottom:1px solid #f0f0f0;font-size:13px;">
      <span style="max-width:200px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${escapeHtml(name)}</span>
      <span onclick="editLibDish(${i})" style="margin-left:auto;color:#1a3a6b;cursor:pointer;font-size:12px;padding:0 2px;" title="编辑">✎</span>
      <span onclick="deleteLibDish(${i})" style="color:#c33;cursor:pointer;font-size:12px;padding:0 2px;" title="删除">✕</span>
    </div>`;
  }).join("");
  // 如果正在编辑，把编辑表单填好（编辑态的菜名/配菜已在表单中）
}

/* ===== 食材行（名称+数量+单位）动态增删 ===== */
/* 解析一条配菜字符串（如 "土豆100g"）拆成 {name, qty, unit} */
function parseSideStr(s) {
  const m = String(s || "").match(/^([^\d]+?)(\d+(?:\.\d+)?)([a-zA-Z\u4e00-\u9fa5]+)?$/);
  if (m) return { name: m[1].trim(), qty: m[2], unit: (m[3] || "").trim() };
  return { name: String(s || "").trim(), qty: "", unit: "" };
}
/* 把 {name, qty, unit} 合并为存储字符串（如 "土豆100g"） */
function combineSide(o) {
  const n = (o.name || "").trim();
  if (!n) return "";
  const q = (o.qty || "").trim();
  const u = (o.unit || "").trim();
  return q ? `${n}${q}${u}` : n;
}
/* 新增一行食材输入框 */
function addIngRow(name, qty, unit) {
  const box = document.getElementById("libIngRows");
  if (!box) return;
  const row = document.createElement("div");
  row.style.cssText = "display:flex;gap:4px;margin-bottom:4px;";
  row.innerHTML = `
    <input class="ing-name" placeholder="名称" value="${escapeHtml(name||"")}" style="flex:1;min-width:0;padding:5px 8px;font-size:13px;border:1px solid #ccd;border-radius:4px;box-sizing:border-box;">
    <input class="ing-qty" placeholder="数量" value="${escapeHtml(qty||"")}" style="width:72px;padding:5px 8px;font-size:13px;border:1px solid #ccd;border-radius:4px;box-sizing:border-box;">
    <input class="ing-unit" placeholder="单位" value="${escapeHtml(unit||"")}" style="width:60px;padding:5px 8px;font-size:13px;border:1px solid #ccd;border-radius:4px;box-sizing:border-box;">
    <span onclick="this.parentNode.remove()" style="display:flex;align-items:center;color:#c33;cursor:pointer;font-size:15px;padding:0 4px;user-select:none;" title="删除该行">✕</span>`;
  box.appendChild(row);
}
/* 清空所有食材行 */
function clearIngRows() {
  const box = document.getElementById("libIngRows");
  if (box) box.innerHTML = "";
}
/* 用 sides 数组回填食材行（编辑菜品时调用） */
function fillIngRows(sides) {
  clearIngRows();
  (sides || []).forEach(s => {
    const o = parseSideStr(s);
    addIngRow(o.name, o.qty, o.unit);
  });
}
/* 从表单收集所有食材行 → sides 字符串数组 */
function collectIngRows() {
  const box = document.getElementById("libIngRows");
  if (!box) return [];
  const out = [];
  box.querySelectorAll("div").forEach(row => {
    const name = row.querySelector(".ing-name").value.trim();
    if (!name) return;
    const qty = row.querySelector(".ing-qty").value.trim();
    const unit = row.querySelector(".ing-unit").value.trim();
    out.push(combineSide({ name, qty, unit }));
  });
  return out;
}

/* 进入编辑模式：把指定菜品填入添加表单 */
function editLibDish(idx) {
  if (!_libCat) return;
  const arr = DATA.dish_db[_libCat];
  if (!arr || idx < 0 || idx >= arr.length) return;
  const entry = arr[idx];
  const d = normalizeDish(entry);
  _editIdx = idx;
  document.getElementById("libFormTitle").textContent = "✏️ 编辑菜品";
  document.getElementById("libSubmitBtn").textContent = "保存修改";
  document.getElementById("libCancelEdit").style.display = "inline-block";
  document.getElementById("libNewDish").value = d.name;
  fillIngRows(d.sides || []);   // 用食材行回填配菜
  // 菜品列表中隐藏正在编辑的那一行
  renderLibDishList();
}

/* 取消编辑模式，重置表单 */
function cancelEditLibDish() {
  _editIdx = -1;
  resetLibDishForm();
  renderLibDishList();
}

/* 重置添加/编辑表单到初始状态 */
function resetLibDishForm() {
  document.getElementById("libFormTitle").textContent = "➕ 添加菜品";
  document.getElementById("libSubmitBtn").textContent = "确认添加";
  document.getElementById("libCancelEdit").style.display = "none";
  document.getElementById("libNewDish").value = "";
  clearIngRows();   // 清空所有食材行
}

/* 从当前分类删除指定菜品 */
function deleteLibDish(idx) {
  if (!_libCat) return;
  const arr = DATA.dish_db[_libCat];
  if (!arr || idx < 0 || idx >= arr.length) return;
  if (!confirm(`删除菜品「${dishText(arr[idx])}」？`)) return;
  if (_editIdx === idx) { _editIdx = -1; resetLibDishForm(); }
  arr.splice(idx, 1);
  save();
  renderLibDishList();
}

/* 添加或编辑菜品：_editIdx >= 0 为编辑态，否则为添加态 */
function doAddDishToLib() {
  const name = document.getElementById("libNewDish").value.trim();
  const sides = collectIngRows();   // 从食材行收集配菜
  if (!_libCat) { alert("请先选择或添加一个分类"); return; }
  if (!name) { alert("请输入菜名"); return; }
  if (!DATA.dish_db[_libCat]) DATA.dish_db[_libCat] = [];
  const entry = { name, sides };   // 统一标准对象（sides 为空数组）
  if (_editIdx >= 0) {
    // 编辑态：更新指定索引
    const oldText = dishText(DATA.dish_db[_libCat][_editIdx]);
    const newText = dishText(entry);
    // 改名时需同步更新周次菜品中的引用
    if (oldText !== newText) {
      for (const wk of Object.values(DATA.weeks)) {
        for (const day of DAYS) {
          for (const meal of MEALS) {
            const arr = wk.days[day][meal];
            for (let i = 0; i < arr.length; i++) {
              if (arr[i] === oldText) arr[i] = newText;
            }
          }
        }
      }
    }
    DATA.dish_db[_libCat][_editIdx] = entry;
    _editIdx = -1;
    resetLibDishForm();
    save();
    renderLibDishList();
  } else {
    // 添加态：去重 + push
    if (DATA.dish_db[_libCat].some(e => dishText(e) === dishText(entry))) {
      alert("该菜品已存在：" + dishText(entry)); return;
    }
    DATA.dish_db[_libCat].push(entry);
    document.getElementById("libNewDish").value = "";
    clearIngRows();   // 添加成功后清空食材行
    save();
    renderLibDishList();
  }
}

/* ===== 在某餐插入菜：菜品库选择栏直接输入关键字筛选，点击列表菜品即添加 ===== */
function openAddToMeal(key, day, meal) {
  _ctx = {key, day, meal};
  showModal(`➕ ${day} ${meal} 添加菜品`, `
    <p>从菜品库选择（直接输入关键字筛选，点击菜品即可添加）：</p>
    <input id="libInput" placeholder="输入关键字筛选，如：土豆、牛肉、粥、番茄…" style="width:100%;"
           oninput="renderCandidates(this.value)" onfocus="renderCandidates(this.value)">
    <div id="libBox" class="lib-list"></div>
    <p style="text-align:center;color:#888;margin:6px 0;">— 或直接输入新菜名 —</p>
    <input id="freeDish" placeholder="直接输入新菜名" style="width:100%;">
    <div style="text-align:right;margin-top:12px;"><button onclick="doAddToMeal()">确认添加</button></div>`);
  renderCandidates(""); // 初始展示菜品库全部菜品
}
let _ctx = {};

/* 实时渲染菜品库列表：@param 关键字（匹配菜名/别名/配菜）；点击列表项即加入当餐 */
function renderCandidates(kw) {
  const box = document.getElementById("libBox");
  if (!box) return;
  const list = searchDishes(kw).slice(0, 30);
  if (!list.length) {
    box.innerHTML = '<div style="color:#999;font-size:12px;padding:4px;">无匹配菜品，可在下方直接输入新菜名</div>';
    return;
  }
  /* 内联 onclick：列表随输入重渲染，内联绑定在点击时才解析，避免节点替换导致事件丢失；
     data-name 存完整菜名（菜名+配菜克重），点击即按完整名加入餐格 */
  box.innerHTML = list.map(d =>
    `<button type="button" class="ghost cand-btn" data-name="${escapeHtml(d.text)}"
       onclick="addDishToMeal(this.getAttribute('data-name'))">[${d.cat}] ${escapeHtml(d.text)}</button>`
  ).join("");
}

/* 把指定菜名加入当前餐格（去重），保存并刷新。@param 菜品名 */
function addDishToMeal(name) {
  name = (name || "").trim();
  if (!name) return;
  const {key, day, meal} = _ctx;
  const week = DATA.weeks[key];
  // 防御：本地数据异常（如旧缓存缺周）时给出明确提示而非报错
  if (!week || !week.days || !week.days[day]) { alert("当前周次数据异常，请刷新页面后重试"); closeModal(); return; }
  if (!week.days[day][meal]) week.days[day][meal] = [];
  if (!week.days[day][meal].includes(name)) week.days[day][meal].push(name);
  save(); closeModal(); render();
}

/* 确认添加：菜品库列表点击即添加；此按钮仅用于把「直接输入新菜名」加入餐格 */
function doAddToMeal() {
  const free = document.getElementById("freeDish").value.trim();
  if (!free) { alert("请点击上方列表中的菜品，或在「直接输入新菜名」处填写后再确认"); return; }
  addDishToMeal(free);
}
function delDish(key, day, meal, i) {
  DATA.weeks[key].days[day][meal].splice(i, 1);
  save(); render();
}

/* 拖拽落盘：把源餐格里的菜品移到目标餐格（支持跨天/跨餐移动，同格内则移到末尾） */
function handleDishDrop(e, tgtKey, tgtDay, tgtMeal) {
  let src;
  try { src = JSON.parse(e.dataTransfer.getData("text/plain")); } catch { return; }
  if (!src || src.weekKey == null || src.day == null || src.meal == null) return;
  const srcArr = DATA.weeks[src.weekKey]?.days[src.day]?.[src.meal];
  if (!srcArr || src.index < 0 || src.index >= srcArr.length) return;
  // 取出菜品
  const [dish] = srcArr.splice(src.index, 1);
  // 放入目标餐格（同格内则追加到末尾，跨格则追加）
  const tgtArr = DATA.weeks[tgtKey].days[tgtDay][tgtMeal];
  if (!tgtArr.includes(dish)) tgtArr.push(dish);
  save(); render();
}

/* ===== 均衡检查 ===== */
function analyze() {
  const key = document.getElementById("weekSel").value;
  const week = DATA.weeks[key];
  const tips = [];
  DAYS.forEach(day => {
    MEALS.forEach(meal => {
      const all = fullMeal(week, day, meal).join("");
      if (!all.trim()) return;
      const hasMeat = /肉|鸡|鱼|牛|羊|肝|翅|丸|猪|蛋/.test(all);
      const hasVeg = /炒|烧|清炒|蒜蓉|青菜|白菜|冬瓜|豆腐|土豆|菜心/.test(all);
      if ((meal === "中餐" || meal === "晚餐") && !hasMeat) tips.push(`⚠ ${day} ${meal} 缺少荤菜，建议补充蛋白质`);
      if (meal === "中餐" && !/汤/.test(all)) tips.push(`· ${day} ${meal} 建议搭配一份汤品`);
    });
  });
  document.getElementById("notice").innerHTML =
    "<b>均衡提示：</b><br>" + (tips.length ? tips.join("<br>") : "✅ 搭配良好");
}

/* ===== 持久化：IndexedDB（浏览器原生，大容量、异步、无需服务器/Python） ===== */
const DB_NAME = "zhoushiji";
const DB_STORE = "data";
const DB_KEY = "menu";
const DB_VERSION = 1;

/* 打开/创建 IndexedDB 数据库。@returns Promise<IDBDatabase> */
function openDB() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(DB_STORE)) db.createObjectStore(DB_STORE);
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

/* 保存当前 DATA 到 IndexedDB。@returns Promise<void> */
async function save() {
  try {
    const db = await openDB();
    const tx = db.transaction(DB_STORE, "readwrite");
    tx.objectStore(DB_STORE).put(JSON.parse(JSON.stringify(DATA)), DB_KEY);
    tx.oncomplete = () => db.close();
    tx.onerror = () => db.close();
  } catch (e) { console.warn("save failed", e); }
}

/* 从 IndexedDB 读取 DATA；为空则回退 localStorage 旧版数据迁移。@returns Promise<void> */
async function loadLocal() {
  try {
    const db = await openDB();
    const tx = db.transaction(DB_STORE, "readonly");
    const req = tx.objectStore(DB_STORE).get(DB_KEY);
    req.onsuccess = () => {
      if (req.result) {
        DATA = req.result;
      } else {
        /* 兼容旧版：localStorage 有数据则迁移到 IndexedDB */
        try {
          const ls = localStorage.getItem("menu_data");
          if (ls) {
            DATA = JSON.parse(ls);
            save();
            localStorage.removeItem("menu_data");
          }
        } catch {}
      }
      db.close();
    };
    req.onerror = () => db.close();
  } catch (e) { console.warn("loadLocal failed", e); }
}

/* ===== 学校名称（自定义，修改后自动持久化，标题/导出文件名自动读取） ===== */
const DEFAULT_SCHOOL = "示例学校";
/* 当前学校名：@returns DATA.school_name，空值回退默认名 */
function schoolName() { return ((DATA.school_name || "").trim()) || DEFAULT_SCHOOL; }
/* 文件名安全化：剔除 Windows 非法字符 \ / : * ? " < > | */
function safeFileName(s) { return String(s).replace(/[\\/:*?"<>|]/g, "").trim() || DEFAULT_SCHOOL; }
/* 学校名输入框修改：写入数据并持久化，同步页头/浏览器标题 */
function onSchoolNameChange() {
  const el = document.getElementById("schoolName");
  DATA.school_name = (el.value || "").trim() || DEFAULT_SCHOOL;
  el.value = DATA.school_name;
  save(); applySchoolName(); render();
}
/* 把学校名同步到页头大标题与浏览器标签标题 */
function applySchoolName() {
  const n = schoolName();
  document.title = `${n} · 周食记`;
  const h1 = document.querySelector("h1");
  if (h1) h1.textContent = `${n} · 周食记`;
}

/* modal 工具：showModal(title, html, width) width 可传 "720px" 等，不传则保持默认 */
function showModal(title, html, width) {
  document.getElementById("modalTitle").innerHTML = title;
  document.getElementById("modalBody").innerHTML = html;
  const box = document.getElementById("modalBox");
  if (width) box.style.width = width; else box.style.width = "";
  document.getElementById("modal").style.display = "flex"; _libCat = "";
}
function closeModal() { document.getElementById("modal").style.display = "none"; }

/* 绑定日期选择器：手动改日期 → 反选周次下拉 */
document.getElementById("startDate").addEventListener("change", syncWeekFromDate);
document.getElementById("endDate").addEventListener("change", syncWeekFromDate);

/* ===== 导出 Excel：exceljs 生成 .xlsx =====
   标题合并4列居中(宋体18pt粗) → 日期合并4列居右(宋体11pt粗) → 表头灰底(宋体12pt粗)
   → 星期列居中(宋体11pt粗) → 菜品黑体10pt居中换行；全边框#999；行高 30/22/24/89(pt) */

/* 当前选中周次 key：@returns 周次起始日期字符串 */
function currentWeekKey() {
  const sel = document.getElementById("weekSel");
  const k = sel && sel.value;
  return (k && DATA.weeks[k]) ? k : Object.keys(DATA.weeks)[0];
}

/* 触发浏览器下载：@param Blob 对象；@param 文件名 */
function downloadBlob(blob, filename) {
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(a.href), 2000);
}

/* 导出 Excel：用 exceljs 生成真正的 .xlsx，精确控制列宽/页边距/样式 */
async function exportExcel() {
  if (typeof ExcelJS === "undefined") await loadScript("./static/exceljs.min.js");
  const week = DATA.weeks[currentWeekKey()];
  const range = week.range || buildRange(week.startDate || week.start, week.endDate || week.end);

  const wb = new ExcelJS.Workbook();
  const ws = wb.addWorksheet(week.label || "一周食谱");

  // 页边距：上下左右页眉页脚均 1cm（0.3937 英寸）
  const cm = 1 / 2.54;
  ws.pageSetup.margins = { left: cm, right: cm, top: cm, bottom: cm, header: cm, footer: cm };
  ws.pageSetup.orientation = "landscape";
  ws.pageSetup.fitToPage = true;
  ws.pageSetup.fitToWidth = 1;
  ws.pageSetup.fitToHeight = 1;
  ws.pageSetup.horizontalCentered = true;
  ws.pageSetup.verticalCentered = true;

  const border = { top: { style: "thin", color: { argb: "FF999999" } }, bottom: { style: "thin", color: { argb: "FF999999" } }, left: { style: "thin", color: { argb: "FF999999" } }, right: { style: "thin", color: { argb: "FF999999" } } };
  const center = { horizontal: "center", vertical: "middle", wrapText: true };
  const right = { horizontal: "right", vertical: "middle", wrapText: true };

  // 行1：标题（合并 A1:D1）
  ws.mergeCells("A1:D1");
  ws.getCell("A1").value = `${schoolName()}一周食谱`;
  ws.getCell("A1").font = { name: "宋体", size: 18, bold: true };
  ws.getCell("A1").alignment = center;
  ws.getRow(1).height = 30;

  // 行2：日期（合并 A2:D2）
  ws.mergeCells("A2:D2");
  ws.getCell("A2").value = range;
  ws.getCell("A2").font = { name: "宋体", size: 11, bold: true };
  ws.getCell("A2").alignment = right;
  ws.getRow(2).height = 22;

  // 行3：表头
  ["星期", "早  餐", "中  餐", "晚  餐"].forEach((h, i) => {
    const c = ws.getCell(3, i + 1);
    c.value = h;
    c.font = { name: "宋体", size: 12, bold: true };
    c.alignment = center;
    c.border = border;
    c.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFEEF3FB" } };
  });
  ws.getRow(3).height = 24;

  // 行4~8：每天三餐
  DAYS.forEach((day, r) => {
    const rowNum = 4 + r;
    ws.getCell(rowNum, 1).value = day;
    ws.getCell(rowNum, 1).font = { name: "宋体", size: 11, bold: true };
    ws.getCell(rowNum, 1).alignment = center;
    ws.getCell(rowNum, 1).border = border;
    MEALS.forEach((meal, c) => {
      const dishes = fullMeal(week, day, meal);
      const cell = ws.getCell(rowNum, c + 2);
      cell.value = dishes.join("\n");
      cell.font = { name: "黑体", size: 10 };
      cell.alignment = center;
      cell.border = border;
    });
    ws.getRow(rowNum).height = 89;
  });

  // 列宽：星期列 15 字符，三餐列各 40 字符（数据写入后设置，确保全部生效）
  [15, 40, 40, 40].forEach((w, i) => { ws.getColumn(i + 1).width = w; });

  const buf = await wb.xlsx.writeBuffer();
  downloadBlob(new Blob([buf], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" }),
    `${safeFileName(schoolName())}一周食谱_${week.label || currentWeekKey()}.xlsx`);
}

/* 动态加载第三方 JS（首次导出 Excel 时加载 exceljs） */
function loadScript(src) {
  return new Promise((res, rej) => {
    const s = document.createElement("script");
    s.src = src; s.onload = res; s.onerror = () => rej(new Error("脚本加载失败"));
    document.head.appendChild(s);
  });
}

/* 初始化 DATA：IndexedDB 有数据就覆盖内嵌种子，没有就直接用内嵌种子 */
async function boot() {
  await loadLocal();  // IndexedDB 有保存过就覆盖内嵌种子；没有则 DATA 保持内嵌的完整种子
  migrateDishDb(DATA);  // 一次性迁移：旧版字符串菜品 → 标准对象（随后 save 持久化）
  const schoolEl = document.getElementById("schoolName");
  if (schoolEl) schoolEl.value = schoolName();
  applySchoolName();
  save();
  fillWeeks();   // 默认选中今天所在周，并触发 onWeekSelect → 自动调整日期 + 渲染表格
}
boot();
