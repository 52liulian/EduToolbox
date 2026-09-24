/* ============================================================
 * 融会贯通 · 参数化出题引擎（小学核心 10 法）
 *  - 每个技巧注册 qgen(n)：每次生成 n 道全新随机题，真正不重样
 *  - 生成的题自带 q.fig，由 app.js 的 renderFigOf() 渲染配图
 *  - 学而思 / 作业帮 / 高途 通用套路：假设法、画图法、归一、找周期……
 * ============================================================ */
(function () {
  /* ---------- 通用工具 ---------- */
  const K = { ink: "#334155", sub: "#64748b", line: "#cbd5e1", pri: "#2f6fed", ok: "#16a34a", warn: "#d97706", red: "#dc2626", soft: "#eef3ff", blue: "#2563eb", purple: "#7c3aed" };
  function S(w, h, inner, maxw) {
    return `<svg viewBox="0 0 ${w} ${h}" width="100%" style="max-width:${maxw || w}px;height:auto;display:block" xmlns="http://www.w3.org/2000/svg">${inner}</svg>`;
  }
  function rnd(a, b) { return a + Math.floor(Math.random() * (b - a + 1)); }
  function pick(a) { return a[rnd(0, a.length - 1)]; }
  function shuffle(a) { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); const t = a[i]; a[i] = a[j]; a[j] = t; } return a; }

  // 由正确答构造 n 个互异选项（含正确项）；make() 生成干扰项
  function opts(ans, make, n) {
    n = n || 4;
    const set = new Set([ans]);
    let g = 0;
    while (set.size < n && g++ < 400) { const d = make(); if (d !== ans) set.add(d); }
    let k = 1;
    while (set.size < n) { set.add(ans + k); if (set.size < n) set.add(ans - k); k++; }
    const arr = shuffle([...set]).map(String);
    return { opts: arr, ans: arr.indexOf(String(ans)) };
  }

  function Q(q, optsObj, level, explain, point, fig) {
    return Object.assign({ q, level: level || "基础", explain, point: point || "" }, optsObj, { fig: fig || null });
  }

  /* ============================================================
   * 1. 鸡兔同笼（假设法 / 抬脚法）
   * ============================================================ */
  function qChicken() {
    const H = rnd(8, 18);
    const R = rnd(2, Math.max(3, H - 2));
    const C = H - R;
    const F = 2 * C + 4 * R;
    const askRabbit = Math.random() < 0.5;
    const ans = askRabbit ? R : C;
    const o = opts(ans, () => rnd(1, H - 1));
    const q = `鸡兔同笼：共有 ${H} 个头，${F} 只脚。问${askRabbit ? "兔" : "鸡"}有几只？`;
    const explain = askRabbit
      ? `假设全是鸡，应有 ${2 * H} 只脚，实际多 ${F - 2 * H} 只；每只兔比鸡多 2 脚，兔 = (${F} − ${2 * H}) ÷ 2 = ${R} 只。`
      : `假设全是兔，应有 ${4 * H} 只脚，实际少 ${4 * H - F} 只；每只鸡比兔少 2 脚，鸡 = (${4 * H} − ${F}) ÷ 2 = ${C} 只。`;
    return Q(q, o, "基础", explain, "假设法/抬脚法", { name: "gChicken", H, F, C, R });
  }

  /* ============================================================
   * 2. 植树问题（两端都栽 / 只栽一端 / 两端不栽 / 环形）
   * ============================================================ */
  function qPlant() {
    const d = pick([2, 4, 5, 10]);
    const seg = rnd(4, 12);
    const L = d * seg;
    const type = rnd(0, 3);
    const base = seg;
    let trees, mode, q, figMode, exp;
    if (type === 0) { trees = base + 1; mode = "both"; figMode = "both"; q = `一条 ${L} 米长的路，每隔 ${d} 米栽一棵（两端都栽），共需多少棵树？`; exp = `间隔数 = ${L} ÷ ${d} = ${base}；两端都栽：棵数 = 间隔数 + 1 = ${base + 1}。`; }
    else if (type === 1) { trees = base; mode = "one"; figMode = "one"; q = `一条 ${L} 米长的路，每隔 ${d} 米栽一棵（只栽一端），共需多少棵树？`; exp = `间隔数 = ${L} ÷ ${d} = ${base}；只栽一端：棵数 = 间隔数 = ${base}。`; }
    else if (type === 2) { trees = base - 1; mode = "none"; figMode = "none"; q = `一条 ${L} 米长的路，每隔 ${d} 米栽一棵（两端都不栽），共需多少棵树？`; exp = `间隔数 = ${L} ÷ ${d} = ${base}；两端不栽：棵数 = 间隔数 − 1 = ${base - 1}。`; }
    else { trees = base; mode = "ring"; figMode = "ring"; q = `一个周长 ${L} 米的圆形花坛，沿边每隔 ${d} 米栽一棵，共需多少棵树？`; exp = `封闭图形：棵数 = 间隔数 = ${L} ÷ ${d} = ${base}。`; }
    const o = opts(trees, () => Math.max(1, base + rnd(-2, 3)));
    return Q(q, o, "基础", exp, "植树三情形", { name: "gPlant", seg, mode: figMode });
  }

  /* ============================================================
   * 3. 和差倍问题（和差 / 和倍 / 差倍）
   * ============================================================ */
  function qSumDiff() {
    const type = rnd(0, 2);
    if (type === 0) {
      const D = rnd(4, 30); const big = rnd(D + 2, D + 30); const small = big - D; const Ssum = big + small;
      const askBig = Math.random() < 0.5; const ans = askBig ? big : small;
      const o = opts(ans, () => rnd(small - 5, big + 5));
      const q = `两数之和是 ${Ssum}，差是 ${D}。问${askBig ? "较大的数" : "较小的数"}是多少？`;
      const exp = `较大 = (和 + 差) ÷ 2 = (${Ssum} + ${D}) ÷ 2 = ${big}；较小 = (和 − 差) ÷ 2 = (${Ssum} − ${D}) ÷ 2 = ${small}。`;
      return Q(q, o, "基础", exp, "和差公式", { name: "gSumdiff", big, small, type: "sd" });
    } else if (type === 1) {
      const m = rnd(2, 4); const small = rnd(3, 15); const big = small * m; const Ssum = big + small;
      const askBig = Math.random() < 0.5; const ans = askBig ? big : small;
      const o = opts(ans, () => rnd(2, big + 5));
      const q = `两数之和是 ${Ssum}，大数是小数的 ${m} 倍。问${askBig ? "大数" : "小数"}是多少？`;
      const exp = `小数 = 和 ÷ (倍数 + 1) = ${Ssum} ÷ (${m} + 1) = ${small}；大数 = ${small} × ${m} = ${big}。`;
      return Q(q, o, "基础", exp, "和倍公式", { name: "gSumdiff", big, small, type: "sb" });
    } else {
      const m = rnd(2, 4); const small = rnd(2, 12); const big = small * m; const D = big - small;
      const askBig = Math.random() < 0.5; const ans = askBig ? big : small;
      const o = opts(ans, () => rnd(1, big + 5));
      const q = `两数之差是 ${D}，大数是小数的 ${m} 倍。问${askBig ? "大数" : "小数"}是多少？`;
      const exp = `小数 = 差 ÷ (倍数 − 1) = ${D} ÷ (${m} − 1) = ${small}；大数 = ${small} × ${m} = ${big}。`;
      return Q(q, o, "基础", exp, "差倍公式", { name: "gSumdiff", big, small, type: "db" });
    }
  }

  /* ============================================================
   * 4. 盈亏问题（一盈一亏 / 双盈 / 双亏）
   * ============================================================ */
  function qProfit() {
    const type = rnd(0, 2);
    const a = rnd(3, 6), c = a + rnd(1, 3);
    const N = rnd(3, 10);
    let q, ans, exp, fig, o;
    if (type === 0) {
      const diff = (c - a) * N;
      const b = rnd(1, diff - 1), dd = diff - b;
      ans = N; const thing = a * N + b;
      o = opts(ans, () => rnd(2, N + 8));
      q = `分糖果：如果每人分 ${a} 颗，多出 ${b} 颗；如果每人分 ${c} 颗，反而少 ${dd} 颗。一共有几个小朋友？`;
      exp = `人数 = (盈 + 亏) ÷ 两次每份差 = (${b} + ${dd}) ÷ (${c} − ${a}) = ${diff} ÷ ${c - a} = ${N} 人。（糖果共 ${thing} 颗）`;
      fig = { name: "gProfit", a, c, b, d: dd, N, thing };
    } else if (type === 1) {
      const diff = (c - a) * N;
      const b = rnd(diff + 1, diff + 12); const e = b - diff;
      ans = N; const thing = a * N + b;
      o = opts(ans, () => rnd(2, N + 8));
      q = `分糖果：每人分 ${a} 颗多 ${b} 颗；每人分 ${c} 颗多 ${e} 颗。一共有几个小朋友？`;
      exp = `人数 = (大盈 − 小盈) ÷ 两次每份差 = (${b} − ${e}) ÷ (${c} − ${a}) = ${diff} ÷ ${c - a} = ${N} 人。`;
      fig = { name: "gProfit", a, c, b, e, N, thing, kind: "双盈" };
    } else {
      const diff = (c - a) * N;
      const f = rnd(diff + 1, diff + 12); const g = f - diff;
      ans = N; const need = a * N + f;
      o = opts(ans, () => rnd(2, N + 8));
      q = `分糖果：每人分 ${a} 颗少 ${f} 颗；每人分 ${c} 颗少 ${g} 颗。一共有几个小朋友？`;
      exp = `人数 = (大亏 − 小亏) ÷ 两次每份差 = (${f} − ${g}) ÷ (${c} − ${a}) = ${diff} ÷ ${c - a} = ${N} 人。`;
      fig = { name: "gProfit", a, c, f, g, N, thing: need, kind: "双亏" };
    }
    return Q(q, o, "进阶", exp, "盈亏公式", fig);
  }

  /* ============================================================
   * 5. 平均数问题（求平均 / 已知平均求缺数）
   * ============================================================ */
  function qAvg() {
    const type = rnd(0, 1);
    if (type === 0) {
      const n = rnd(3, 5);
      const vals = []; let sum = 0;
      for (let i = 0; i < n; i++) { const v = rnd(60, 98); vals.push(v); sum += v; }
      const r = sum % n; if (r !== 0) { vals[n - 1] += (n - r); sum += (n - r); }
      const avg = sum / n;
      const o = opts(avg, () => rnd(50, 99));
      const q = `某小组 ${n} 次测验成绩分别为 ${vals.join("、")} 分，平均成绩是多少？`;
      const exp = `总数 = ${sum}，份数 = ${n}，平均数 = ${sum} ÷ ${n} = ${avg} 分。`;
      return Q(q, o, "基础", exp, "总数 ÷ 份数", { name: "gAvg", vals, avg, showAvg: false });
    } else {
      const n = rnd(3, 5);
      const avg = rnd(70, 90);
      const known = [];
      for (let i = 0; i < n - 1; i++) known.push(rnd(Math.max(45, avg - 15), avg));
      const sum = avg * n;
      const knownSum = known.reduce((x, y) => x + y, 0);
      const miss = sum - knownSum;
      const o = opts(miss, () => rnd(40, 120));
      const q = `前 ${n - 1} 次成绩为 ${known.join("、")} 分，要使平均分达到 ${avg} 分，第 ${n} 次至少要考多少分？`;
      const exp = `总分需 ${avg} × ${n} = ${sum}，已得 ${knownSum} 分，缺 = ${sum} − ${knownSum} = ${miss} 分。`;
      return Q(q, o, "进阶", exp, "平均数 × 份数", { name: "gAvg", vals: known.concat([miss]), avg, showAvg: true, missIndex: known.length });
    }
  }

  /* ============================================================
   * 6. 周期问题（找余数定位）
   * ============================================================ */
  function qCycle() {
    const T = rnd(2, 5);
    const letters = "ABCDEF".slice(0, T).split("");
    const n = rnd(T + 3, T + 20);
    const rem = n % T, pos = rem === 0 ? T : rem;
    const ansSym = letters[pos - 1];
    const optList = shuffle(letters.slice());
    const o = { opts: optList, ans: optList.indexOf(ansSym) };
    const q = `一串珠子按 ${letters.join("")} 的顺序不断重复排列。第 ${n} 个珠子是什么？`;
    const exp = `周期长 = ${T}。${n} ÷ ${T} = ${Math.floor(n / T)} …… ${rem === 0 ? T : rem}，余数定位周期里第 ${pos} 个 = ${ansSym}。`;
    return Q(q, o, "基础", exp, "找周期余数", { name: "gCycle", letters, highlight: pos - 1 });
  }

  /* ============================================================
   * 7. 归一问题（先求单一量 / 归总反求）
   * ============================================================ */
  function qGuiyi() {
    const type = rnd(0, 1);
    if (type === 0) {
      const ppl = rnd(2, 5), days = rnd(2, 6);
      const unit = rnd(3, 9);
      const total = unit * ppl * days;
      const p2 = rnd(2, 6), d2 = rnd(2, 6);
      const ans = unit * p2 * d2;
      const o = opts(ans, () => unit * rnd(1, 8) * rnd(1, 7));
      const q = `${ppl} 个工人 ${days} 天可生产零件 ${total} 个。照这样计算，${p2} 个工人 ${d2} 天可生产多少个？`;
      const exp = `单一量 = 总数 ÷ 人数 ÷ 天数 = ${total} ÷ ${ppl} ÷ ${days} = ${unit} 个/人天；${p2} 人 ${d2} 天 = ${unit} × ${p2} × ${d2} = ${ans} 个。`;
      return Q(q, o, "基础", exp, "先求单一量", { name: "gGuiyi", ppl, days, unit, p2, d2, ans });
    } else {
      const ppl = rnd(2, 5), days = rnd(3, 9);
      const total = ppl * days;
      let p2; do { p2 = rnd(2, 7); } while (total % p2 !== 0);
      const ans = total / p2;
      const o = opts(ans, () => Math.max(1, Math.round(total / rnd(1, 7))));
      const q = `一批任务，${ppl} 人做需 ${days} 天完成。若改为 ${p2} 人同时做（效率相同），需多少天？`;
      const exp = `总工作量 = ${ppl} × ${days} = ${total} 人·天；${p2} 人需 ${total} ÷ ${p2} = ${ans} 天。`;
      return Q(q, o, "进阶", exp, "归总（总量不变）", { name: "gGuiyi", ppl, days, p2, ans, total });
    }
  }

  /* ============================================================
   * 8. 工程问题（设总量为 1）
   * ============================================================ */
  const PAIRS = [[6, 3], [3, 6], [4, 4], [12, 4], [4, 12], [6, 6], [8, 8], [9, 6], [6, 9], [12, 6], [6, 12], [10, 15], [15, 10]];
  function qEngineer() {
    const type = rnd(0, 2);
    const pr = pick(PAIRS); const a = pr[0], b = pr[1];
    const coop = Math.round(a * b / (a + b));
    if (type === 0) {
      const o = opts(coop, () => rnd(2, Math.max(coop + 3, a, b)));
      const q = `一项工程，甲单独做需 ${a} 天，乙单独做需 ${b} 天。两人合作需几天完成？`;
      const exp = `甲效 = 1/${a}，乙效 = 1/${b}；合作效 = 1/${a} + 1/${b} = (${a} + ${b})/${a * b}；时间 = 1 ÷ (${(a + b)}/${a * b}) = ${a * b} ÷ (${a + b}) = ${coop} 天。`;
      return Q(q, o, "基础", exp, "工程问题（设总量为1）", { name: "gEngineer", bars: [{ l: "甲", v: a }, { l: "乙", v: b }] });
    } else if (type === 1) {
      const o = opts(b, () => rnd(2, a + 10));
      const q = `一项工程，甲单独做需 ${a} 天，甲乙合作需 ${coop} 天。乙单独做需几天？`;
      const exp = `1/${a} + 1/乙 = 1/${coop} → 1/乙 = 1/${coop} − 1/${a} = (${a} − ${coop})/(${a * coop}) → 乙 = ${a * coop} ÷ (${a} − ${coop}) = ${b} 天。`;
      return Q(q, o, "进阶", exp, "合作效率反求", { name: "gEngineer", bars: [{ l: "甲", v: a }, { l: "合作", v: coop }] });
    } else {
      const save = a - coop;
      const o = opts(save, () => rnd(1, Math.max(save + 3, a)));
      const q = `甲单独做 ${a} 天，两人合作 ${coop} 天。合作比甲单独少用几天？`;
      const exp = `甲单独 ${a} 天，合作 ${coop} 天，少用 ${a} − ${coop} = ${save} 天（效率越高用时越短）。`;
      return Q(q, o, "基础", exp, "效率比较", { name: "gEngineer", bars: [{ l: "甲", v: a }, { l: "合作", v: coop }] });
    }
  }

  /* ============================================================
   * 9. 相遇问题（求时间 / 求路程 / 求一速度）
   * ============================================================ */
  function qMeet() {
    const type = rnd(0, 2);
    const v1 = rnd(40, 90), v2 = rnd(30, 80);
    const vsum = v1 + v2;
    if (type === 0) {
      const t = rnd(2, 6); const s = vsum * t;
      const o = opts(t, () => rnd(1, t + 4));
      const q = `甲、乙从相距 ${s} 千米两地同时相向出发，甲速 ${v1} 千米/时，乙速 ${v2} 千米/时。几小时相遇？`;
      const exp = `相遇时间 = 路程 ÷ 速度和 = ${s} ÷ (${v1} + ${v2}) = ${s} ÷ ${vsum} = ${t} 小时。`;
      return Q(q, o, "基础", exp, "相遇：s=(v1+v2)t", { name: "gMeet", s, v1, v2, t, show: { s: 1, v1: 1, v2: 1, t: 0 } });
    } else if (type === 1) {
      const t = rnd(2, 6); const s = vsum * t;
      const o = opts(s, () => vsum * rnd(1, t + 2));
      const q = `甲速 ${v1} 千米/时、乙速 ${v2} 千米/时，相向而行 ${t} 小时后相遇。两地相距多少千米？`;
      const exp = `路程 = 速度和 × 时间 = (${v1} + ${v2}) × ${t} = ${vsum} × ${t} = ${s} 千米。`;
      return Q(q, o, "基础", exp, "相遇：s=(v1+v2)t", { name: "gMeet", s, v1, v2, t, show: { s: 0, v1: 1, v2: 1, t: 1 } });
    } else {
      const t = rnd(2, 6); const s = vsum * t;
      const o = opts(v2, () => rnd(20, v1 + 40));
      const q = `两地相距 ${s} 千米，相向而行 ${t} 小时相遇；甲速 ${v1} 千米/时，乙速多少？`;
      const exp = `速度和 = ${s} ÷ ${t} = ${vsum}；乙速 = 速度和 − 甲速 = ${vsum} − ${v1} = ${v2} 千米/时。`;
      return Q(q, o, "进阶", exp, "相遇：求速度和", { name: "gMeet", s, v1, v2, t, show: { s: 1, v1: 1, v2: 0, t: 1 } });
    }
  }

  /* ============================================================
   * 10. 追及问题（求时间 / 求路程差 / 求一速度）
   * ============================================================ */
  function qChase() {
    const type = rnd(0, 2);
    const v2 = rnd(30, 70), dv = rnd(5, 30), v1 = v2 + dv;
    if (type === 0) {
      const t = rnd(2, 6); const ds = dv * t;
      const o = opts(t, () => rnd(1, t + 4));
      const q = `甲速 ${v1} 千米/时，乙速 ${v2} 千米/时，乙先走 ${ds} 千米后甲同向追乙。几小时追上？`;
      const exp = `追及时间 = 路程差 ÷ 速度差 = ${ds} ÷ (${v1} − ${v2}) = ${ds} ÷ ${dv} = ${t} 小时。`;
      return Q(q, o, "基础", exp, "追及：t=Δs÷(v1−v2)", { name: "gChase", v1, v2, ds, t, show: { v1: 1, v2: 1, ds: 1, t: 0 } });
    } else if (type === 1) {
      const t = rnd(2, 6); const ds = dv * t;
      const o = opts(ds, () => dv * rnd(1, t + 3));
      const q = `甲速 ${v1} 千米/时、乙速 ${v2} 千米/时，同向而行，${t} 小时后甲追上乙。乙先走了多少千米？`;
      const exp = `路程差 = 速度差 × 时间 = (${v1} − ${v2}) × ${t} = ${dv} × ${t} = ${ds} 千米。`;
      return Q(q, o, "基础", exp, "追及：Δs=(v1−v2)t", { name: "gChase", v1, v2, ds, t, show: { v1: 1, v2: 1, ds: 0, t: 1 } });
    } else {
      const t = rnd(2, 6); const ds = dv * t;
      const o = opts(v2, () => rnd(20, v1 + 10));
      const q = `甲速 ${v1} 千米/时，乙先走 ${ds} 千米，${t} 小时后甲追上乙。乙速多少？`;
      const exp = `速度差 = 路程差 ÷ 时间 = ${ds} ÷ ${t} = ${dv}；乙速 = 甲速 − 速度差 = ${v1} − ${dv} = ${v2} 千米/时。`;
      return Q(q, o, "进阶", exp, "追及：求速度差", { name: "gChase", v1, v2, ds, t, show: { v1: 1, v2: 0, ds: 1, t: 1 } });
    }
  }

  /* ============================================================
   * 配图：生成题自带 fig，由 renderFigOf() 调用 window.Fig[name]
   * ============================================================ */
  function animalChicken(x, y) {
    return `<g><ellipse cx="${x}" cy="${y}" rx="16" ry="12" fill="${K.soft}" stroke="${K.ink}" stroke-width="1.5"/>` +
      `<circle cx="${x}" cy="${y - 16}" r="8" fill="${K.soft}" stroke="${K.ink}" stroke-width="1.5"/>` +
      `<line x1="${x - 5}" y1="${y + 12}" x2="${x - 5}" y2="${y + 22}" stroke="${K.ink}" stroke-width="2"/>` +
      `<line x1="${x + 5}" y1="${y + 12}" x2="${x + 5}" y2="${y + 22}" stroke="${K.ink}" stroke-width="2"/></g>`;
  }
  function animalRabbit(x, y) {
    return `<g><ellipse cx="${x}" cy="${y}" rx="16" ry="12" fill="${K.soft}" stroke="${K.ink}" stroke-width="1.5"/>` +
      `<circle cx="${x}" cy="${y - 15}" r="8" fill="${K.soft}" stroke="${K.ink}" stroke-width="1.5"/>` +
      `<ellipse cx="${x - 5}" cy="${y - 26}" rx="3" ry="8" fill="${K.soft}" stroke="${K.ink}" stroke-width="1.2"/>` +
      `<ellipse cx="${x + 5}" cy="${y - 26}" rx="3" ry="8" fill="${K.soft}" stroke="${K.ink}" stroke-width="1.2"/>` +
      `<line x1="${x - 6}" y1="${y + 12}" x2="${x - 6}" y2="${y + 22}" stroke="${K.ink}" stroke-width="2"/>` +
      `<line x1="${x + 6}" y1="${y + 12}" x2="${x + 6}" y2="${y + 22}" stroke="${K.ink}" stroke-width="2"/>` +
      `<line x1="${x}" y1="${y + 12}" x2="${x}" y2="${y + 22}" stroke="${K.ink}" stroke-width="2"/>` +
      `<line x1="${x + 12}" y1="${y + 12}" x2="${x + 12}" y2="${y + 22}" stroke="${K.ink}" stroke-width="2"/></g>`;
  }
  // 顶部括号标注（用于线段图），只标"题目已给出的量"，绝不标答案
  function bracket(x1, x2, y, label) {
    const t = 6;
    return `<line x1="${x1}" y1="${y}" x2="${x1}" y2="${y - t}" stroke="${K.sub}" stroke-width="1.2"/>` +
           `<line x1="${x2}" y1="${y}" x2="${x2}" y2="${y - t}" stroke="${K.sub}" stroke-width="1.2"/>` +
           `<line x1="${x1}" y1="${y - t}" x2="${x2}" y2="${y - t}" stroke="${K.sub}" stroke-width="1.2"/>` +
           `<text x="${(x1 + x2) / 2}" y="${y - t - 4}" font-size="11" text-anchor="middle" fill="${K.sub}">${label}</text>`;
  }
  window.Fig.gChicken = function (p) {
    p = p || {};
    let s = `<rect x="20" y="40" width="280" height="78" rx="8" fill="${K.soft}" stroke="${K.line}" stroke-width="1.5"/>`;
    s += animalChicken(78, 78) + animalRabbit(160, 78);
    s += `<text x="78" y="112" font-size="11" text-anchor="middle" fill="${K.sub}">鸡（2脚）</text>`;
    s += `<text x="160" y="112" font-size="11" text-anchor="middle" fill="${K.sub}">兔（4脚）</text>`;
    s += `<text x="248" y="64" font-size="13" text-anchor="middle" fill="${K.pri}">头 ${p.H}</text>`;
    s += `<text x="248" y="86" font-size="13" text-anchor="middle" fill="${K.pri}">脚 ${p.F}</text>`;
    s += `<text x="248" y="104" font-size="10" text-anchor="middle" fill="${K.sub}">（仅示意）</text>`;
    return S(320, 128, s, 320);
  };
  window.Fig.gPlant = function (p) {
    p = p || {}; const seg = p.seg || 5, mode = p.mode || "both";
    if (mode === "ring") {
      const cx = 160, cy = 64, R = 52;
      let s = `<circle cx="${cx}" cy="${cy}" r="${R}" fill="none" stroke="${K.sub}" stroke-width="2"/>`;
      for (let i = 0; i < seg; i++) { const ang = -Math.PI / 2 + i * 2 * Math.PI / seg; const x = cx + R * Math.cos(ang), y = cy + R * Math.sin(ang); s += `<line x1="${x}" y1="${y}" x2="${cx + (R - 12) * Math.cos(ang)}" y2="${cy + (R - 12) * Math.sin(ang)}" stroke="${K.pri}" stroke-width="2"/>`; }
      s += `<text x="160" y="140" font-size="12" text-anchor="middle" fill="${K.ink}">周长分 ${seg} 段（间隔）</text>`;
      return S(320, 152, s, 320);
    }
    const x0 = 20, x1 = 300, y = 70, gap = (x1 - x0) / seg;
    let s = `<line x1="${x0}" y1="${y}" x2="${x1}" y2="${y}" stroke="${K.sub}" stroke-width="2"/>`;
    for (let i = 0; i <= seg; i++) { const x = x0 + i * gap; s += `<line x1="${x}" y1="${y - 9}" x2="${x}" y2="${y + 9}" stroke="${K.pri}" stroke-width="2"/>`; }
    const label = { both: "两端都栽：棵数 = 间隔 + 1", one: "只栽一端：棵数 = 间隔", none: "两端不栽：棵数 = 间隔 − 1" }[mode] || mode;
    s += `<text x="160" y="112" font-size="12" text-anchor="middle" fill="${K.ink}">共 ${seg} 段间隔</text>`;
    s += `<text x="160" y="134" font-size="11" text-anchor="middle" fill="${K.sub}">${label}</text>`;
    return S(320, 148, s, 320);
  };
  // 线段图：只标"和/差/倍数"（题目已给），绝不标出大数、小数
  window.Fig.gSumdiff = function (p) {
    p = p || {}; const big = p.big || 9, small = p.small || 5, type = p.type || "sd";
    const unit = 4, x0 = 30, barH = 34, ySmall = 64, yBig = 118;
    const wSmall = small * unit, wBig = big * unit, sum = big + small;
    let s = "";
    if (type === "sb" || type === "db") {
      const m = big / small;
      s += `<rect x="${x0}" y="${ySmall}" width="${wSmall}" height="${barH}" fill="${K.pri}" opacity="0.85"/>`;
      s += `<text x="${x0 + wSmall / 2}" y="${ySmall + 22}" font-size="12" text-anchor="middle" fill="#fff">小数</text>`;
      s += `<rect x="${x0}" y="${yBig}" width="${wBig}" height="${barH}" fill="${K.ok}" opacity="0.85"/>`;
      s += `<text x="${x0 + wBig / 2}" y="${yBig + 22}" font-size="12" text-anchor="middle" fill="#fff">大数（${m}倍）</text>`;
      for (let i = 1; i < m; i++) { const x = x0 + i * wSmall; s += `<line x1="${x}" y1="${yBig}" x2="${x}" y2="${yBig + barH}" stroke="#fff" stroke-width="1.5"/>`; }
      s += bracket(x0, x0 + wBig, ySmall - 14, `和 = ${sum}`);
      if (type === "db") { const dW = (m - 1) * wSmall; s += `<rect x="${x0 + wSmall}" y="${yBig}" width="${dW}" height="${barH}" fill="none" stroke="${K.warn}" stroke-width="2" stroke-dasharray="4 3"/><text x="${x0 + wSmall + dW / 2}" y="${yBig + barH + 18}" font-size="11" text-anchor="middle" fill="${K.warn}">差 = ${big - small}</text>`; }
      return S(360, yBig + barH + 28, s, 320);
    }
    const D = big - small;
    s += `<rect x="${x0}" y="${ySmall}" width="${wSmall}" height="${barH}" fill="${K.pri}" opacity="0.85"/>`;
    s += `<text x="${x0 + wSmall / 2}" y="${ySmall + 22}" font-size="12" text-anchor="middle" fill="#fff">小数</text>`;
    s += `<rect x="${x0}" y="${yBig}" width="${wBig}" height="${barH}" fill="${K.ok}" opacity="0.85"/>`;
    s += `<text x="${x0 + wBig / 2}" y="${yBig + 22}" font-size="12" text-anchor="middle" fill="#fff">大数</text>`;
    s += `<rect x="${x0 + wSmall}" y="${yBig}" width="${D * unit}" height="${barH}" fill="none" stroke="${K.warn}" stroke-width="2" stroke-dasharray="4 3"/>`;
    s += `<text x="${x0 + wSmall + D * unit / 2}" y="${yBig + barH + 18}" font-size="11" text-anchor="middle" fill="${K.warn}">差 = ${D}</text>`;
    s += bracket(x0, x0 + wBig, ySmall - 14, `和 = ${sum}`);
    return S(360, yBig + barH + 28, s, 320);
  };
  // 盈亏：只列两种分法（题目已给），人数由学生用公式算
  window.Fig.gProfit = function (p) {
    p = p || {};
    let s = `<text x="30" y="34" font-size="13" fill="${K.ink}">方案①：每人 ${p.a} 颗</text>`;
    s += `<text x="30" y="60" font-size="13" fill="${K.ink}">方案②：每人 ${p.c} 颗</text>`;
    const tags = [];
    if (p.b != null) tags.push(`方案①多 ${p.b} 颗（盈）`);
    if (p.d != null) tags.push(`方案②少 ${p.d} 颗（亏）`);
    if (p.e != null) tags.push(`方案②多 ${p.e} 颗（盈）`);
    if (p.g != null) tags.push(`方案②少 ${p.g} 颗（亏）`);
    tags.forEach((t, i) => s += `<text x="30" y="${92 + i * 20}" font-size="12" fill="${K.pri}">${t}</text>`);
    s += `<text x="30" y="${92 + tags.length * 20 + 10}" font-size="11" fill="${K.sub}">人数 = ? 用盈亏公式算</text>`;
    return S(320, 92 + tags.length * 20 + 26, s, 320);
  };
  // 平均数：只画已知分数；答案(平均)仅在题目已给时才画线
  window.Fig.gAvg = function (p) {
    p = p || {}; const vals = p.vals || [80, 90, 70], showAvg = p.showAvg, avg = p.avg;
    const n = vals.length, max = Math.max.apply(null, vals.concat(showAvg ? [avg] : [])), H = 90, yb = 120, uw = Math.min(40, 240 / n), gap = 14;
    let s = ""; const totalW = n * (uw + gap), x0 = (320 - totalW) / 2;
    vals.forEach((v, i) => { const x = x0 + i * (uw + gap), h = v / max * H; const miss = (p.missIndex != null && i === p.missIndex); s += `<rect x="${x}" y="${yb - h}" width="${uw}" height="${h}" fill="${miss ? K.line : K.pri}"/><text x="${x + uw / 2}" y="${yb - h - 5}" font-size="11" text-anchor="middle" fill="${K.ink}">${miss ? "?" : v}</text>`; });
    if (showAvg && avg != null) { const avgY = yb - avg / max * H; s += `<line x1="${x0 - 6}" y1="${avgY}" x2="${x0 + totalW + 6}" y2="${avgY}" stroke="${K.warn}" stroke-width="2" stroke-dasharray="5 3"/><text x="${x0 + totalW + 10}" y="${avgY + 4}" font-size="11" fill="${K.warn}">平均${avg}</text>`; }
    return S(320, 140, s, 320);
  };
  // 周期：只展示循环规律，不标答案位置
  window.Fig.gCycle = function (p) {
    p = p || {}; const letters = p.letters || ["A", "B", "C"];
    const n = letters.length, gap = Math.min(48, 260 / n), x0 = (320 - n * gap) / 2 + gap / 2;
    let s = "";
    letters.forEach((L, i) => { const x = x0 + i * gap; s += `<circle cx="${x}" cy="56" r="18" fill="${K.soft}" stroke="${K.ink}" stroke-width="1.5"/><text x="${x}" y="61" font-size="14" text-anchor="middle" fill="${K.ink}">${L}</text>`; if (i < n - 1) s += `<text x="${x + gap / 2}" y="61" font-size="14" fill="${K.sub}">→</text>`; });
    s += `<text x="160" y="104" font-size="12" text-anchor="middle" fill="${K.ink}">周期 ${n}：按此顺序不断重复</text>`;
    s += `<text x="160" y="124" font-size="11" text-anchor="middle" fill="${K.sub}">第 ${p.n} 个 = ?（用余数定位）</text>`;
    return S(320, 138, s, 320);
  };
  // 归一：只画"人数×天数"网格（题目已给），不标单一量
  window.Fig.gGuiyi = function (p) {
    p = p || {}; const ppl = p.ppl || 3, days = p.days || 4, total = p.total;
    const cols = ppl, rows = Math.min(days, 8), cw = 26, ch = 20, x0 = 30, y0 = 30;
    let s = "";
    for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) s += `<rect x="${x0 + c * cw}" y="${y0 + r * ch}" width="${cw - 3}" height="${ch - 3}" fill="${K.soft}" stroke="${K.line}" stroke-width="1"/>`;
    s += `<text x="30" y="${y0 + rows * ch + 18}" font-size="12" fill="${K.ink}">${ppl} 人 × ${days} 天 = ${ppl * days} 人·天</text>`;
    if (total != null) s += `<text x="30" y="${y0 + rows * ch + 36}" font-size="12" fill="${K.pri}">共生产 ${total} 个</text>`;
    return S(320, y0 + rows * ch + 46, s, 320);
  };
  // 工程：只画"题目已给"的效率条，绝不含答案条
  window.Fig.gEngineer = function (p) {
    p = p || {}; const bars = p.bars || [{ l: "甲", v: 6 }, { l: "乙", v: 3 }];
    const max = Math.max.apply(null, bars.map(b => b.v).concat([1])), H = 90, yb = 120, uw = 26, gap = 72, x0 = 44;
    let s = "";
    bars.forEach((b, i) => { const x = x0 + i * gap, h = b.v / max * H; s += `<rect x="${x}" y="${yb - h}" width="${uw}" height="${h}" fill="${i === 0 ? K.pri : K.ok}"/><text x="${x + uw / 2}" y="${yb - h - 6}" font-size="12" text-anchor="middle" fill="${K.ink}">${b.l}${b.v}</text>`; });
    return S(360, 140, s, 320);
  };
  // 相遇：只标"题目已给"的量，答案(时间/路程/速度)不出现
  window.Fig.gMeet = function (p) {
    p = p || {}; const show = p.show || {}, s = p.s, v1 = p.v1, v2 = p.v2, t = p.t;
    let svg = `<line x1="30" y1="70" x2="290" y2="70" stroke="${K.sub}" stroke-width="2"/>`;
    if (show.v1) svg += `<circle cx="40" cy="70" r="8" fill="${K.pri}"/><text x="40" y="94" font-size="11" text-anchor="middle" fill="${K.pri}">甲${v1}</text>`; else svg += `<circle cx="40" cy="70" r="8" fill="${K.pri}"/>`;
    if (show.v2) svg += `<circle cx="280" cy="70" r="8" fill="${K.ok}"/><text x="280" y="94" font-size="11" text-anchor="middle" fill="${K.ok}">乙${v2}</text>`; else svg += `<circle cx="280" cy="70" r="8" fill="${K.ok}"/>`;
    if (show.s) svg += `<text x="160" y="116" font-size="12" text-anchor="middle" fill="${K.ink}">相距 ${s} 千米</text>`;
    if (show.t) svg += `<text x="160" y="58" font-size="12" text-anchor="middle" fill="${K.warn}">行 ${t} 小时</text>`;
    svg += `<text x="160" y="50" font-size="11" text-anchor="middle" fill="${K.sub}">相向而行</text>`;
    return S(320, 132, svg, 320);
  };
  // 追及：只标"题目已给"的量
  window.Fig.gChase = function (p) {
    p = p || {}; const show = p.show || {}, v1 = p.v1, v2 = p.v2, ds = p.ds, t = p.t;
    let svg = `<line x1="30" y1="70" x2="290" y2="70" stroke="${K.sub}" stroke-width="2"/>`;
    if (show.v2) svg += `<circle cx="120" cy="70" r="8" fill="${K.ok}"/><text x="120" y="94" font-size="11" text-anchor="middle" fill="${K.ok}">乙${v2}</text>`; else svg += `<circle cx="120" cy="70" r="8" fill="${K.ok}"/>`;
    if (show.v1) svg += `<circle cx="40" cy="70" r="8" fill="${K.pri}"/><text x="40" y="50" font-size="11" text-anchor="middle" fill="${K.pri}">甲${v1}</text>`; else svg += `<circle cx="40" cy="70" r="8" fill="${K.pri}"/>`;
    if (show.ds) svg += `<text x="205" y="116" font-size="12" text-anchor="middle" fill="${K.ink}">乙先走 ${ds} 千米</text>`;
    if (show.t) svg += `<text x="200" y="58" font-size="12" fill="${K.warn}">追及 ${t} 小时</text>`;
    svg += `<text x="160" y="50" font-size="11" text-anchor="middle" fill="${K.sub}">同向而行</text>`;
    return S(320, 132, svg, 320);
  };

  /* ============================================================
   * 注册：把 qgen 挂到对应技巧上（引擎见 app.js renderQuiz）
   * ============================================================ */
  const GEN = { chicken: qChicken, plant: qPlant, sumdiff: qSumDiff, profitloss: qProfit, average: qAvg, cycle: qCycle, guiyi: qGuiyi, engineer: qEngineer, meet: qMeet, chase: qChase };
  if (window.TECHNIQUES) {
    window.TECHNIQUES.forEach(t => {
      if (GEN[t.id]) {
        // qgen(n)：每次随机生成 n 道全新题，真正不重样
        t.qgen = function (n) { const out = []; for (let i = 0; i < (n || 6); i++) out.push(GEN[t.id]()); return out; };
      }
    });
  }
  window.QGEN_READY = true;
})();
