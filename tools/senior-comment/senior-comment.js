/**
 * 高中评语生成器
 * ------------------------------------------------------------------
 * 功能：名单管理（localStorage 自动保存）、十大评语维度勾选、
 *       性别选项（不限 / 男 / 女，影响寄语代称）、三种评语风格切换
 *       （严谨深刻 / 期望激励 / 具体细致）、一键为每名学生随机拼接评语
 *       （同分类相邻不重复）、逐条编辑/重生成、字数统计、
 *       复制全部、导出 TXT / Excel / Word。
 * 运行：纯前端 IIFE、无网络请求，支持 file:// 离线打开；Excel 依赖本地 SheetJS。
 */
(function () {
  "use strict";

  /* ===================== 学段专属配置 ===================== */

  /** @type {string} 工具唯一标识，同时作为 localStorage 键前缀 */
  var SLUG = "senior-comment";

  /** @type {string} 工具完整中文名（用于提示与导出文件名） */
  var TOOL_TITLE = "高中评语生成器";

  /** @type {string} 前缀称呼，高中使用「同学」 */
  var PREFIX_LABEL = "同学";

  /** localStorage 键名集合 */
  var KEYS = {
    names: SLUG + ":names",
    dims: SLUG + ":dims",
    settings: SLUG + ":settings",
    results: SLUG + ":results"
  };

  /**
   * 内置示例名单（20 个）
   * @type {string[]}
   */
  var SAMPLE_NAMES = [
    "陈思远", "赵子涵", "林语桐", "周沐阳", "吴欣怡",
    "孙浩然", "郑雨彤", "何嘉宁", "高梓轩", "梁书瑶",
    "谢晨曦", "彭子墨", "郭可欣", "邓一诺", "罗俊熙",
    "蒋诗涵", "韩宇航", "曹安琪", "许文博", "苏若彤"
  ];

  /**
   * 性别代称映射表：用于结尾寄语中 {PRONOUN} 占位符的替换
   * 不限 → 你（第二人称，性别中立）；男 → 他；女 → 她
   * @type {Object<string,string>}
   */
  var PRONOUN_MAP = { any: "你", male: "他", female: "她" };

  /**
   * 评语维度词库：十个分类，每分类 10 条不重复短句。
   * 语气成熟，关注学习品质、思维深度、生涯规划、心理素质等高中阶段核心议题。
   * @type {{key:string,name:string,phrases:string[]}[]}
   */
  var CATEGORIES = [
    {
      key: "pinzhi",
      name: "学习品质",
      phrases: [
        "你具备优秀的学习内驱力，目标清晰、行动果决，在高中学业竞争中始终保持着难得的定力。",
        "你治学严谨，概念必究本源、步骤必求规范，这种精益求精的品质是高分段学生的共性。",
        "你高度自律，能抵御手机与娱乐的诱惑，把自主学习时间经营得充实而高效。",
        "你善于复盘，考试后从知识、方法、策略多维度归因，让每一次检测都成为跃升的台阶。",
        "你有强烈的问题意识，敢于质疑资料与标准答案，与老师的探讨常能触及问题本质。",
        "你能在高强度学习中保持专注与节奏，张弛有度，具备顶尖学生可贵的持续性。",
        "你对知识有真正的热爱，会为一个原理刨根问底，这份赤诚比一时的分数更有价值。",
        "你独立完成学习闭环，预习、听讲、练习、订正、归纳环环相扣，几乎不需外力督促。",
        "你做事有始有终，作业从不敷衍，哪怕是基础题也坚持独立思考、规范书写。",
        "你面对繁重的课业依然保持稳定的投入度，不急不躁、不骄不馁，学习品质令人放心。"
      ]
    },
    {
      key: "xueke",
      name: "学科表现",
      phrases: [
        "你的语文学科积淀深厚，文本解读有独立见地，议论文逻辑严密、文气充沛，颇具大家气象。",
        "你数学抽象与建模能力突出，面对压轴题能迅速识别结构、选择策略，竞赛潜力明显。",
        "你的英语综合运用能力强，外刊阅读与书面表达流畅地道，语言优势已成为稳定增分点。",
        "你物理观念清晰、科学推理严密，能在真实情境中综合调用力学与电磁学知识解决问题。",
        "你化学宏微结合的素养扎实，反应原理与实验探究并重，规范表达减少了不必要的失分。",
        "你生物科学思维严谨，能基于证据进行论证，对生命观念与社会责任有真切的体认。",
        "你人文社科素养全面，史论结合、视野开阔，论述题中常有超越应试框架的思考。",
        "你学科发展均衡并有强势科目引领，综合科目答题时间分配合理，应试素养日趋成熟。",
        "你在选考科目上展现出浓厚兴趣与扎实功底，能将课堂知识延展到真实情境中分析问题。",
        "你各学科基础稳固，弱科在持续补强中明显回升，学科版图正在变得更加均衡有力。"
      ]
    },
    {
      key: "siwei",
      name: "思维深度",
      phrases: [
        "你不满足于会做题，更追问为何如此，对学科大概念和底层逻辑有自觉的建构。",
        "你的逻辑推理严密而有层次，复杂问题能层层剥离，论证链条完整、令人信服。",
        "你具备批判性与辩证思维，能在对立观点间权衡，避免了非黑即白的简单化判断。",
        "你善于跨学科联结，用数学工具建模、用哲学视角审辨，知识在你这里是打通的。",
        "你的抽象概括能力强，能从大量习题中提炼通性通法，真正实现举一反三。",
        "你面对开放性问题敢于提出原创假设并设计验证路径，创新思维已崭露头角。",
        "你能区分事实、推论与价值判断，信息素养和理性精神在同龄人中相当突出。",
        "你思考问题有时间纵深和全局视野，愿意把眼前的题目放到学科发展脉络中理解。",
        "你的反思性思维活跃，常能从一道题引出一类问题、从一次错误总结一套方法。",
        "你对待争议性问题保持克制与开放，愿意被更好的论证说服，思维弹性很高。"
      ]
    },
    {
      key: "fangfa",
      name: "学习方法",
      phrases: [
        "你建立了完整的错题档案，按考点与思维障碍双维度分类，滚动清零成效显著。",
        "你善于使用思维导图与知识结构图，把零散概念编织成网络，复习时一目了然。",
        "你坚持限时训练，把平时作业当考试，把考试当作业，节奏感和应试状态都更稳定。",
        "你能针对不同学科选用不同策略：理科重归纳、文科重梳理，方法与任务匹配度高。",
        "你重视基础概念的精读与辨析，知道所有的高阶能力都建立在对定义的精准把握上。",
        "你主动研究高考真题的命题脉络，从答案反推思路，把刷题升级为研究题目。",
        "你善用费曼技巧向同学讲解疑难，以教促学，方法的内化程度远超一般同学。",
        "你坚持每日复盘与每周小结，把碎片化的学习沉淀为可调用的方法资产。",
        "你能在老师指导之外主动寻找优质资源，自学能力与筛选信息的能力俱佳。",
        "你处理难题懂得先独立思考再求助，把每一次提问都变成一次方法的提升。"
      ]
    },
    {
      key: "xinli",
      name: "心理素质",
      phrases: [
        "你心理素质过硬，大考期间睡眠与发挥稳定，越是硬仗越能沉住气，具备冠军心态。",
        "你在成绩起伏中保持清醒，高分不忘形、低谷不沉沦，情绪调节成熟而有效。",
        "你有很强的延迟满足能力，愿意为长远目标放弃即时享乐，坚韧是你最深的底色。",
        "面对强手如林的环境，你把压力转化为动力，与优秀者同行而不自卑，格局很大。",
        "你在挫折中展现了极强的复原力，难过之后仍能坐回书桌前，这种勇敢最为动人。",
        "你能正视焦虑并主动求助，与老师、家长和心理老师保持沟通，心理自助意识强。",
        "你坚持运动为大脑充电，跑步和球类运动让你在高压学习中依然精力充沛。",
        "你对自己有客观稳定的评价，不被一次排名定义，内在的笃定是难得的心理资本。",
        "你能在大考前的紧张氛围中保持自己的节奏，不被他人进度裹挟，定力令人敬佩。",
        "你善于用音乐、阅读、运动等方式疏导情绪，让紧绷的神经在合适的时机放松。"
      ]
    },
    {
      key: "zeren",
      name: "集体责任",
      phrases: [
        "你在班级中勇挑重担，关键时刻站得出来、顶得上去，展现了可贵的领袖气质。",
        "作为班干部，你既能服务同学又能坚持原则，处理复杂班级事务时公正而有温度。",
        "你学业优秀却从不独善其身，主动牵头学习互助，带动了整个集体向上的氛围。",
        "你积极参加社会实践与志愿服务，把对社会的观察与思考转化为青年人的责任。",
        "你在学校大型活动中独当一面，组织协调沉稳可靠，老师交代的事最让人放心。",
        "面对错误你敢于承担、及时补救，不推诿、不回避，胸襟与责任感令人敬佩。",
        "你关心集体荣誉，运动会、文艺汇演、班级值周都能见到你全力以赴的身影。",
        "你善于协调班级内部的小矛盾，以理服人、以情动人，是同学信任的桥梁。",
        "你珍惜集体资源、维护公共环境，宿舍与教室卫生从不敷衍，公共意识很强。",
        "你愿意为集体目标牺牲个人便利，关键时刻把班级放在前面，担当令人动容。"
      ]
    },
    {
      key: "pinde",
      name: "品德修养",
      phrases: [
        "你诚信考试、遵守公德，独处时依然慎独自律，品格经得起无人监督的检验。",
        "你待人有礼有节，对师长心怀感恩、对同伴真诚相待，教养融入了举手投足之间。",
        "你尊重差异、包容异见，不轻率评判他人，展现了良好的同理心与胸襟。",
        "你关心时代与国家发展，把个人理想融入社会需要，志向中有一份知识分子的担当。",
        "你拾金不昧、言行一致，承诺过的事情必定全力以赴去兑现，信誉是同学的共识。",
        "你面对不公敢于发声、面对弱者愿意伸手，正直与善良在你身上从未缺席。",
        "你珍惜粮食、爱护公物、节约水电，绿色生活的理念在你的日常中自然流露。",
        "你不攀比、不浮躁，专注于自身成长，简朴中透着一份难得的清醒。",
        "你诚实面对自己的不足，不掩饰、不粉饰，这种坦诚本身就是一种高尚的品格。",
        "你对师长长辈有由衷的敬意，对低年级同学有真切的关怀，温良恭俭让在你身上得到体现。"
      ]
    },
    {
      key: "techang",
      name: "特长发展",
      phrases: [
        "你在学科竞赛中持续突破，能在高强度训练中保持热爱，竞赛已成为你学习的重要支点。",
        "你的艺术特长突出，钢琴 / 绘画 / 舞蹈等级别稳步提升，作品已显露出个人风格。",
        "你是校队主力，体育特长让你学会坚持与协作，赛场上的拼搏也反过来滋养了学业。",
        "你在科技社团与机器人 / 编程 / 创客活动中表现亮眼，工程思维与动手能力俱佳。",
        "你热爱写作与演讲，校刊与演讲台多次见到你的身影，表达力是你的鲜明标签。",
        "你在学生组织与社团中担任骨干，策划、协调、执行的综合性能力得到充分锻炼。",
        "你能在特长与学业之间理性分配时间，让热爱成为情绪的出口与能量的补给。",
        "你参与研究性学习课题，从选题、查文献到结题报告，初步具备研究者的素养。",
        "你善于在跨学科项目中发挥特长，把艺术、技术、人文素养融成独特的表达。",
        "你坚持把特长做到极致而非浅尝辄止，这份专注让某项兴趣真正成为你的辨识度。"
      ]
    },
    {
      key: "shengya",
      name: "生涯规划",
      phrases: [
        "你对高中三年有清醒的阶段规划，学期目标、月度任务清晰可执行，节奏感极佳。",
        "你能根据学情动态调整学习策略，弱科补强、强科拔尖，资源配置理性而高效。",
        "你自主管理时间的能力出色，自习课、周末和假期都有结构化安排，从不虚度。",
        "你主动搜集高校专业、强基计划与升学政策信息，把当下努力与长远目标精准对接。",
        "你善于经营学习资源，善用老师答疑、图书馆和优质课程，借力意识强而不依赖。",
        "你建立了个人知识库与错题档案，标签清晰、滚动复习，沉淀出专属的复习资产。",
        "面对选科与分流，你结合兴趣、能力与社会需求审慎决策，规划有理有据。",
        "你对心仪院校与专业方向有清晰画像，知道每一分努力对应着哪一条升学路径。",
        "你愿意为长远目标放弃短期诱惑，生涯规划已从口号变成了可执行的周计划。",
        "你把生涯探索落到了实习、访谈、课题等行动上，对未来的判断比同龄人更立体。"
      ]
    },
    {
      key: "jiyu",
      name: "成长寄语",
      phrases: [
        "愿你在最该奋斗的年纪倾尽全力，然后带着一身本领与坦荡，走向更广阔的天地。",
        "十八而志，未来已来。愿你以独立之精神、自由之思想，成为照亮时代的一束光。",
        "愿你既能承受高分的重量，也能接纳平凡的美好，过一种清醒、热烈而丰盈的人生。",
        "老师相信，这三年你锤炼出的自律、韧性与思考力，将比录取通知书带你走得更远。",
        "愿你永远忠于热爱、勇于行动、敢于担当，在时代浪潮中做奔涌的后浪。",
        "山高路远，看世界也找自己；愿你走出半生，归来仍是那个眼里有光的少年。",
        "愿你把个人的小梦想融入时代的大命题，在服务他人与社会中成就真正的自我。",
        "聚是一团火，散是满天星。愿此去前程似锦，再相逢依旧如故。",
        "愿你的高中三年不留遗憾，愿你的大学时光更加辽阔，愿你的人生由此出发。",
        "请记得，老师最骄傲的不是你考了多少分，而是你成为了一个怎样的人。"
      ]
    }
  ];

  /**
   * 结尾寄语词库：三种风格，每种 4 条；{PRONOUN} 由性别选项替换。
   * - rigorous 严谨深刻：理性、深沉、含蓄。
   * - expect    期望激励：饱含期许，鼓劲打气。
   * - specific  具体细致：落到当下行动，可操作。
   * @type {{rigorous:string[],expect:string[],specific:string[]}}
   */
  var ENDINGS = {
    rigorous: [
      "成长是一场漫长的修行，愿{PRONOUN}在喧嚣中守住本心，在得失间保持清醒，行而不辍、未来可期。",
      "真正的优秀是日复一日的自省与精进，愿{PRONOUN}把这份自律延续到更远的将来。",
      "高中三年最大的收获，不在分数而在心性，愿{PRONOUN}带着这份笃定，从容应对人生每一场大考。",
      "愿你眼里有光、心中有尺、脚下有路，把每一步都走得稳，把每一个选择都做得正。"
    ],
    expect: [
      "冲刺阶段，愿你咬定目标、科学备考，把最稳定的发挥留给高考那几天，加油！",
      "希望你以终为始、精准备分，强科更强、弱科突围，在千军万马中一骑绝尘！",
      "期待{PRONOUN}把对未来的全部渴望，化作今天清晨的第一个闹钟和深夜的最后一盏灯！",
      "老师坚信，{PRONOUN}的努力终将得到回应，请继续奔跑，顶峰相见！"
    ],
    specific: [
      "建议{PRONOUN}在未来一个月把失分清单滚动清零，每天 30 分钟限时训练，让会的不丢分。",
      "希望你保持每日 7 小时睡眠与 30 分钟运动，把作息稳住，状态也是分数的一部分。",
      "建议{PRONOUN}提前研究目标院校与专业的录取路径，让志愿填报与三年努力同样精彩。",
      "请把错题本每周末复盘一次、每月归因一次，把方法沉淀成习惯，让进步可被衡量。"
    ]
  };

  /* ===================== DOM 与运行时状态 ===================== */

  /**
   * 按 id 获取元素
   * @param {string} id 元素 id
   * @returns {HTMLElement} 对应 DOM 元素
   */
  function $(id) { return document.getElementById(id); }

  /** 常用元素缓存 */
  var els = {
    nameInput: $("nameInput"),
    btnSample: $("btnSample"),
    btnClear: $("btnClear"),
    dimChips: $("dimChips"),
    btnDimAll: $("btnDimAll"),
    btnDimNone: $("btnDimNone"),
    chkPrefix: $("chkPrefix"),
    genderGroup: $("genderGroup"),
    endingGroup: $("endingGroup"),
    btnGenerate: $("btnGenerate"),
    btnCopy: $("btnCopy"),
    btnTxt: $("btnTxt"),
    btnExcel: $("btnExcel"),
    btnWord: $("btnWord"),
    resultWrap: $("resultWrap"),
    emptyTip: $("emptyTip"),
    statPeople: $("statPeople"),
    statChars: $("statChars"),
    toast: $("toast")
  };

  /** @type {Object<string,boolean>} 维度勾选状态，key 为分类 key */
  var selected = {};

  /** @type {{prefix:boolean,gender:string,ending:string}} 生成设置：前缀 / 性别 / 风格 */
  var settings = { prefix: true, gender: "any", ending: "rigorous" };

  /** @type {{name:string,text:string,picks:Object}[]} 已生成的评语结果 */
  var results = [];

  /** toast 定时器句柄 */
  var toastTimer = null;

  /* ===================== 本地存储 ===================== */

  /**
   * 安全写入 localStorage（file:// 或隐私模式下可能不可用）
   * @param {string} key 键名
   * @param {string} value 字符串值
   */
  function storageSet(key, value) {
    try { localStorage.setItem(key, value); } catch (e) { /* 忽略存储异常 */ }
  }

  /**
   * 安全读取 localStorage
   * @param {string} key 键名
   * @returns {string|null} 读到的字符串，不存在或异常时为 null
   */
  function storageGet(key) {
    try { return localStorage.getItem(key); } catch (e) { return null; }
  }

  /** 持久化当前名单 */
  function saveNames() { storageSet(KEYS.names, els.nameInput.value); }

  /** 持久化勾选的维度 key 数组 */
  function saveDims() {
    var keys = CATEGORIES.filter(function (c) { return selected[c.key]; }).map(function (c) { return c.key; });
    storageSet(KEYS.dims, JSON.stringify(keys));
  }

  /** 持久化生成设置 */
  function saveSettings() { storageSet(KEYS.settings, JSON.stringify(settings)); }

  /** 持久化生成结果 */
  function saveResults() { storageSet(KEYS.results, JSON.stringify(results)); }

  /* ===================== 名单与维度 ===================== */

  /**
   * 解析名单文本：按行拆分、去空白、去空行、最多保留 100 人
   * @returns {string[]} 姓名数组
   */
  function parseNames() {
    return els.nameInput.value
      .split(/\r?\n/)
      .map(function (s) { return s.trim(); })
      .filter(function (s) { return s.length > 0; })
      .slice(0, 100);
  }

  /**
   * 渲染维度 chip 标签
   */
  function renderChips() {
    els.dimChips.innerHTML = CATEGORIES.map(function (c) {
      var on = !!selected[c.key];
      return '<button type="button" class="chip" aria-pressed="' + on + '" data-key="' + c.key + '">' + c.name + "</button>";
    }).join("");
  }

  /**
   * 批量设置全部维度的勾选状态并重绘
   * @param {boolean} on 是否全部选中
   */
  function setAllDims(on) {
    CATEGORIES.forEach(function (c) { selected[c.key] = on; });
    renderChips();
    saveDims();
  }

  /* ===================== 评语生成 ===================== */

  /**
   * 根据性别把结尾寄语中的 {PRONOUN} 占位符替换为实际代称
   * @param {string} text 含 {PRONOUN} 的文本
   * @returns {string} 替换后的文本
   */
  function applyPronoun(text) {
    var pronoun = PRONOUN_MAP[settings.gender] || PRONOUN_MAP.any;
    return text.split("{PRONOUN}").join(pronoun);
  }

  /**
   * 从候选短句中随机抽取一条，自动避开禁用内容
   * @param {string[]} pool 候选短句数组
   * @param {string[]} forbidden 需要避开的短句（如相邻学生已抽到的）
   * @returns {string} 抽中的短句
   */
  function pickPhrase(pool, forbidden) {
    var avail = pool.filter(function (p) { return forbidden.indexOf(p) === -1; });
    if (!avail.length) avail = pool; // 极端情况下兜底
    return avail[Math.floor(Math.random() * avail.length)];
  }

  /**
   * 为一名学生拼接完整评语
   * @param {string} name 学生姓名
   * @param {Object[]} avoidPicks 需要避开的抽取记录（相邻学生、本人旧记录）
   * @returns {{name:string,text:string,picks:Object}} 一条评语结果
   */
  function buildOne(name, avoidPicks) {
    var picks = {};
    var parts = [];
    CATEGORIES.forEach(function (cat) {
      if (!selected[cat.key]) return;
      var forbidden = avoidPicks
        .map(function (rec) { return rec && rec[cat.key]; })
        .filter(Boolean);
      var phrase = pickPhrase(cat.phrases, forbidden);
      picks[cat.key] = phrase;
      parts.push(phrase);
    });

    var endingPool = ENDINGS[settings.ending] || ENDINGS.rigorous;
    var ending = applyPronoun(pickPhrase(endingPool, []));

    var prefix = settings.prefix ? name + PREFIX_LABEL + "：" : "";
    return { name: name, text: prefix + parts.join("") + ending, picks: picks };
  }

  /**
   * 一键为名单中的全部学生生成评语
   */
  function generateAll() {
    var rawCount = els.nameInput.value.split(/\r?\n/).map(function (s) { return s.trim(); }).filter(Boolean).length;
    var names = parseNames();
    if (!names.length) { toast("请先填写学生名单"); return; }
    if (rawCount > 100) toast("名单超过 100 人，已仅取前 100 人生成");

    var dimCount = CATEGORIES.filter(function (c) { return selected[c.key]; }).length;
    if (!dimCount) { toast("请至少勾选一个评语维度"); return; }

    var list = [];
    var prevPicks = null;
    names.forEach(function (n) {
      var item = buildOne(n, prevPicks ? [prevPicks] : []);
      list.push(item);
      prevPicks = item.picks;
    });
    results = list;
    saveResults();
    renderResults();
    toast("已为 " + names.length + " 名同学生成评语");
    els.resultWrap.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  /**
   * 单独重新生成某一张卡片（避开本人旧内容与前后相邻学生）
   * @param {number} index 结果下标
   */
  function regenerateOne(index) {
    var cur = results[index];
    if (!cur) return;
    var avoid = [cur.picks];
    if (results[index - 1]) avoid.push(results[index - 1].picks);
    if (results[index + 1]) avoid.push(results[index + 1].picks);
    var item = buildOne(cur.name, avoid);
    results[index] = item;
    saveResults();

    var ta = els.resultWrap.querySelector('[data-idx="' + index + '"]');
    if (ta) ta.value = item.text;
    updateStats();
    toast(cur.name + " 的评语已重新生成");
  }

  /* ===================== 结果渲染与统计 ===================== */

  /**
   * 转义 HTML 特殊字符，防止姓名等内容破坏结构
   * @param {string} s 原始字符串
   * @returns {string} 转义后的字符串
   */
  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  /**
   * 渲染全部评语结果卡片
   */
  function renderResults() {
    els.emptyTip.style.display = results.length ? "none" : "block";
    els.resultWrap.innerHTML = results.map(function (r, i) {
      var no = String(i + 1).padStart(2, "0");
      return '<div class="r-card">'
        + '<div class="r-head">'
        + '<span class="r-no">' + no + "</span>"
        + '<span class="r-name">' + escapeHtml(r.name) + "</span>"
        + '<button type="button" class="btn-mini" data-regen="' + i + '">🔄 重新生成</button>'
        + "</div>"
        + '<textarea class="r-text" data-idx="' + i + '">' + escapeHtml(r.text) + "</textarea>"
        + "</div>";
    }).join("");
    updateStats();
  }

  /**
   * 更新顶部统计：人数 / 全部评语的非空白总字数
   */
  function updateStats() {
    els.statPeople.textContent = String(results.length);
    var chars = results.reduce(function (sum, r) {
      return sum + r.text.replace(/\s/g, "").length;
    }, 0);
    els.statChars.textContent = String(chars);
  }

  /* ===================== 复制与导出 ===================== */

  /**
   * 轻提示
   * @param {string} msg 提示文案
   */
  function toast(msg) {
    els.toast.textContent = msg;
    els.toast.classList.add("show");
    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { els.toast.classList.remove("show"); }, 2200);
  }

  /**
   * 复制文本到剪贴板，优先用 Clipboard API，失败则回退 execCommand
   * @param {string} text 待复制文本
   * @returns {Promise<void>} 复制成功 resolve，失败 reject
   */
  function copyToClipboard(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      return navigator.clipboard.writeText(text).catch(function () { return legacyCopy(text); });
    }
    return legacyCopy(text);
  }

  /**
   * 旧式复制方案（兼容 file:// 与非安全上下文）
   * @param {string} text 待复制文本
   * @returns {Promise<void>}
   */
  function legacyCopy(text) {
    return new Promise(function (resolve, reject) {
      var ta = document.createElement("textarea");
      ta.value = text;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      var ok = false;
      try { ok = document.execCommand("copy"); } catch (e) { ok = false; }
      document.body.removeChild(ta);
      if (ok) resolve(); else reject(new Error("复制失败"));
    });
  }

  /**
   * 触发浏览器下载
   * @param {string} filename 文件名
   * @param {Blob} blob 文件 Blob 对象
   */
  function download(filename, blob) {
    var url = URL.createObjectURL(blob);
    var a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(function () { URL.revokeObjectURL(url); }, 1500);
  }

  /**
   * 复制全部评语：姓名 + Tab + 评语，可直接粘贴进 Excel
   */
  function exportCopy() {
    if (!results.length) { toast("请先生成评语"); return; }
    var text = results.map(function (r) {
      return r.name + "\t" + r.text.replace(/[\r\n\t]/g, " ");
    }).join("\r\n");
    copyToClipboard(text).then(function () {
      toast("已复制全部评语（制表符分隔，可直接粘贴到 Excel）");
    }).catch(function () {
      toast("复制失败，请检查浏览器权限");
    });
  }

  /**
   * 导出 TXT（带 BOM，记事本不乱码）
   */
  function exportTxt() {
    if (!results.length) { toast("请先生成评语"); return; }
    var body = results.map(function (r, i) {
      return (i + 1) + ". " + r.name + "\r\n" + r.text;
    }).join("\r\n\r\n");
    var blob = new Blob(["\ufeff" + body], { type: "text/plain;charset=utf-8" });
    download(TOOL_TITLE + ".txt", blob);
    toast("TXT 文件已开始下载");
  }

  /**
   * 导出 Excel：姓名 / 评语两列，列宽适配（依赖本地 SheetJS 全局 XLSX）
   */
  function exportExcel() {
    if (!results.length) { toast("请先生成评语"); return; }
    if (typeof XLSX === "undefined") { toast("Excel 组件未加载，请确认 xlsx.full.min.js 存在"); return; }
    var rows = results.map(function (r) {
      return { "姓名": r.name, "评语": r.text };
    });
    var ws = XLSX.utils.json_to_sheet(rows, { header: ["姓名", "评语"] });
    ws["!cols"] = [{ wch: 12 }, { wch: 90 }];
    var wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "高中评语");
    XLSX.writeFile(wb, TOOL_TITLE + ".xlsx");
    toast("Excel 文件已开始下载");
  }

  /**
   * 导出 Word：简单 HTML 文档 + application/msword Blob，中文段落用 <p>
   */
  function exportWord() {
    if (!results.length) { toast("请先生成评语"); return; }
    var paras = results.map(function (r) {
      var head = settings.prefix ? "" : "<b>" + escapeHtml(r.name) + "：</b>";
      return '<p style="text-indent:2em;margin:0 0 12pt 0;line-height:1.8;font-size:12pt;">'
        + head + escapeHtml(r.text) + "</p>";
    }).join("");
    var doc = '<html xmlns:o="urn:schemas-microsoft-com:office:office" '
      + 'xmlns:w="urn:schemas-microsoft-com:office:word" '
      + ">"
      + "<head><meta charset=\"utf-8\"><title>" + TOOL_TITLE + "</title>"
      + '<style>body{font-family:"宋体",SimSun,serif;} h2{text-align:center;font-size:18pt;margin:20pt 0;}</style>'
      + "</head><body><h2>" + TOOL_TITLE + "</h2>" + paras + "</body></html>";
    var blob = new Blob(["\ufeff", doc], { type: "application/msword" });
    download(TOOL_TITLE + ".doc", blob);
    toast("Word 文件已开始下载");
  }

  /* ===================== 事件绑定 ===================== */

  /**
   * 绑定全部页面交互事件
   */
  function bindEvents() {
    // 名单输入：自动保存
    els.nameInput.addEventListener("input", saveNames);

    // 示例名单 / 清空
    els.btnSample.addEventListener("click", function () {
      els.nameInput.value = SAMPLE_NAMES.join("\n");
      saveNames();
      toast("已填入 20 个示例姓名");
    });
    els.btnClear.addEventListener("click", function () {
      els.nameInput.value = "";
      saveNames();
      toast("名单已清空");
    });

    // 维度 chip：事件委托切换勾选
    els.dimChips.addEventListener("click", function (e) {
      var btn = e.target.closest ? e.target.closest(".chip") : null;
      if (!btn) return;
      var key = btn.getAttribute("data-key");
      selected[key] = !selected[key];
      btn.setAttribute("aria-pressed", selected[key] ? "true" : "false");
      saveDims();
    });
    els.btnDimAll.addEventListener("click", function () { setAllDims(true); });
    els.btnDimNone.addEventListener("click", function () { setAllDims(false); });

    // 称呼前缀开关
    els.chkPrefix.addEventListener("change", function () {
      settings.prefix = els.chkPrefix.checked;
      saveSettings();
    });

    // 性别选项
    Array.prototype.forEach.call(els.genderGroup.querySelectorAll('input[name="gender"]'), function (radio) {
      radio.addEventListener("change", function () {
        settings.gender = radio.value;
        saveSettings();
      });
    });

    // 评语风格
    Array.prototype.forEach.call(els.endingGroup.querySelectorAll('input[name="ending"]'), function (radio) {
      radio.addEventListener("change", function () {
        settings.ending = radio.value;
        saveSettings();
      });
    });

    // 生成
    els.btnGenerate.addEventListener("click", generateAll);

    // 导出
    els.btnCopy.addEventListener("click", exportCopy);
    els.btnTxt.addEventListener("click", exportTxt);
    els.btnExcel.addEventListener("click", exportExcel);
    els.btnWord.addEventListener("click", exportWord);

    // 结果区：单条重生成 + 手动编辑同步状态
    els.resultWrap.addEventListener("click", function (e) {
      var btn = e.target.closest ? e.target.closest("[data-regen]") : null;
      if (!btn) return;
      regenerateOne(parseInt(btn.getAttribute("data-regen"), 10));
    });
    els.resultWrap.addEventListener("input", function (e) {
      var ta = e.target;
      if (!ta.hasAttribute("data-idx")) return;
      var idx = parseInt(ta.getAttribute("data-idx"), 10);
      if (results[idx]) {
        results[idx].text = ta.value;
        saveResults();
        updateStats();
      }
    });
  }

  /* ===================== 初始化：恢复本地数据 ===================== */

  /**
   * 从 localStorage 恢复名单、勾选、设置与历史结果
   */
  function restore() {
    // 默认勾选全部维度
    CATEGORIES.forEach(function (c) { selected[c.key] = true; });

    var savedNames = storageGet(KEYS.names);
    if (savedNames !== null) els.nameInput.value = savedNames;

    var savedDims = storageGet(KEYS.dims);
    if (savedDims) {
      try {
        var arr = JSON.parse(savedDims);
        if (Array.isArray(arr)) {
          CATEGORIES.forEach(function (c) { selected[c.key] = arr.indexOf(c.key) !== -1; });
        }
      } catch (e) { /* 解析失败保持默认全选 */ }
    }

    var savedSettings = storageGet(KEYS.settings);
    if (savedSettings) {
      try {
        var obj = JSON.parse(savedSettings);
        if (typeof obj.prefix === "boolean") settings.prefix = obj.prefix;
        if (obj.gender && PRONOUN_MAP[obj.gender]) settings.gender = obj.gender;
        if (obj.ending && ENDINGS[obj.ending]) settings.ending = obj.ending;
      } catch (e) { /* 解析失败保持默认 */ }
    }
    els.chkPrefix.checked = settings.prefix;
    Array.prototype.forEach.call(els.genderGroup.querySelectorAll('input[name="gender"]'), function (radio) {
      radio.checked = radio.value === settings.gender;
    });
    Array.prototype.forEach.call(els.endingGroup.querySelectorAll('input[name="ending"]'), function (radio) {
      radio.checked = radio.value === settings.ending;
    });

    var savedResults = storageGet(KEYS.results);
    if (savedResults) {
      try {
        var arr2 = JSON.parse(savedResults);
        if (Array.isArray(arr2)) {
          results = arr2.filter(function (r) {
            return r && typeof r.name === "string" && typeof r.text === "string";
          }).map(function (r) {
            return { name: r.name, text: r.text, picks: r.picks || {} };
          });
        }
      } catch (e) { results = []; }
    }
  }

  /**
   * 入口：恢复数据 → 渲染界面 → 绑定事件
   */
  function init() {
    restore();
    renderChips();
    renderResults();
    bindEvents();
  }

  init();
})();
