/**
 * 初中评语生成器
 * ------------------------------------------------------------------
 * 功能：名单管理（localStorage 自动保存）、10 个评语维度勾选、
 *       评语风格切换（客观严谨/鼓励激励/具体细致）、性别选择、
 *       一键为每名学生随机拼接不雷同评语（同分类相邻不重复）、
 *       逐条编辑/重生成、字数统计、复制全部、导出 TXT / Excel / Word。
 * 运行：纯前端 IIFE 模块、无网络请求，支持 file:// 离线打开；
 *       Excel 依赖本地 SheetJS（xlsx.full.min.js）。
 * 作者：EduToolbox
 * ------------------------------------------------------------------ */
(function () {
  "use strict";

  /* ===================== 学段专属配置 ===================== */

  /** @type {string} 工具唯一标识，同时作为 localStorage 键前缀 */
  var SLUG = "junior-comment";

  /** @type {string} 工具完整中文名（用于提示与导出文件名） */
  var TOOL_TITLE = "初中评语生成";

  /** @type {string} 前缀称呼，初中使用「同学」 */
  var PREFIX_LABEL = "同学";

  /** localStorage 键名集合 */
  var KEYS = {
    names: SLUG + ":names",
    dims: SLUG + ":dims",
    settings: SLUG + ":settings",
    results: SLUG + ":results"
  };

  /**
   * 内置示例名单（20 个，贴合初中班级常见姓名）
   * @type {string[]}
   */
  var SAMPLE_NAMES = [
    "陈思远", "赵子涵", "林语桐", "周沐阳", "吴欣怡",
    "孙浩然", "郑雨彤", "何嘉宁", "高梓轩", "梁书瑶",
    "谢晨曦", "彭子墨", "郭可欣", "邓一诺", "罗俊熙",
    "蒋诗涵", "韩宇航", "曹安琪", "许文博", "苏若彤"
  ];

  /**
   * 评语维度词库：10 个分类，每分类 10 条贴合初中学业与青春期成长的短句
   * 维度顺序参考 classtool.cn/junior-comment 原版与初中评价实际场景
   * @type {{key:string,name:string,phrases:string[]}[]}
   */
  var CATEGORIES = [
    {
      key: "xueke",
      name: "学科表现",
      phrases: [
        "你的语文学科素养扎实，阅读理解细腻深刻，作文有思想、有文采，常被当作范文。",
        "你数学思维敏捷，几何证明逻辑严密，综合题中常能找到巧妙的突破口。",
        "你的英语听说读写全面发展，语音语调标准，课外阅读量为你积累了明显优势。",
        "你理科综合表现突出，物理现象、化学变化都爱追问本质，实验操作规范严谨。",
        "你文科积累丰厚，史地政知识融会贯通，答题时视野开阔、论据充分。",
        "你生物学、地理的学习方法得当，图文结合、概念清晰，学考复习从容自信。",
        "你各科发展均衡且有优势学科引领，文理兼修的知识结构为后续学习打下好底子。",
        "面对难度陡增的初中课程，你能及时调整学法，薄弱环节在这学期已有明显起色。",
        "你的物理实验报告书写规范、数据分析准确，展现了良好的科学素养。",
        "你的数学压轴题思路开阔，能用多种方法求解，思维品质在同龄人中十分突出。"
      ]
    },
    {
      key: "siwei",
      name: "思维方法",
      phrases: [
        "你善于归纳总结，能把零散的知识点织成网络，体现了良好的系统化思维。",
        "你解题注重思路而非套路，会一题多解、多题归一，知识迁移能力突出。",
        "你具备较强的批判性思维，不轻信答案，习惯用证据和逻辑检验结论。",
        "你能对错题进行深度归因，区分知识漏洞与方法缺陷，反思精准而高效。",
        "你善于把复杂问题拆解成小步骤，条理清晰，难题在你面前层层瓦解。",
        "你能在学科之间建立联系，用数学的方法看物理、用历史的眼光读文学，视野开阔。",
        "你注重监控自己的理解程度，不懂就标记追问，绝不囫囵吞枣。",
        "你的逆向思维和发散思维常有亮点，开放性试题的答案新颖而不失严谨。",
        "你的课堂提问常能切中知识本质，引发同学深入思考，问题意识令人欣赏。",
        "你善于用图表、思维导图整理知识结构，复杂概念在你的笔下变得清晰直观。"
      ]
    },
    {
      key: "taidu",
      name: "学习态度",
      phrases: [
        "你目标明确、态度端正，能以自律应对初中骤增的学习任务，内驱力令人欣赏。",
        "你勤奋踏实，早读、自习始终保持专注，点滴坚持正在悄悄拉开差距。",
        "你能正视成绩波动，归因理性、不骄不馁，展现了超越年龄的成熟心态。",
        "你对薄弱学科不逃避、不放弃，主动查漏补缺，这份迎难而上的韧劲最为可贵。",
        "你学习计划性强，能按周梳理任务、按时复盘，自我管理能力在同龄人中十分突出。",
        "你求知欲旺盛，不满足于课本答案，常带着问题与老师深入探讨。",
        "你对待每一次测验都严谨认真，把考场当作检验、把错题当作资源，成长迅速。",
        "你逐渐明白学习是自己的事，由要我学到我要学的转变尤为可喜。",
        "你的课堂笔记细致工整，重难点标记清晰，复习时效率极高。",
        "你能在长时间学习中保持稳定专注，不浮躁、不焦虑，这份静气是难得的学习品质。"
      ]
    },
    {
      key: "canyu",
      name: "课堂参与",
      phrases: [
        "课堂上你专注投入、思维在线，眼神和回应让老师感受到高质量的师生共振。",
        "你发言质量高，不满足于说答案，更能讲清思路、点明方法，颇有小老师风范。",
        "你敢于在课堂上提出质疑和不同解法，思辨的火花常常让一节课更加精彩。",
        "小组合作探究中你是核心力量，能组织讨论、整合意见、代表小组清晰汇报。",
        "你的听课笔记详略得当，用不同颜色标注重点疑点，复习时一目了然。",
        "你能迅速适应不同教师的授课风格，主动调整节奏，课堂吸收率高。",
        "你在实验课、实践课上动手能力强，操作规范、观察细致、结论严谨。",
        "这学期你课堂参与的主动性显著增强，从默默倾听到乐于表达，进步有目共睹。",
        "你能把课外阅读与课堂内容相互印证，发言时常带新意，为同学打开新视角。",
        "你回答问题时思路清晰、语言精炼，能把复杂概念讲得让同学都听明白。"
      ]
    },
    {
      key: "zeren",
      name: "集体责任",
      phrases: [
        "作为班干部，你敢管善管、以身作则，是连接老师和同学之间可靠的桥梁。",
        "你集体荣誉感强，运动会、合唱节、文明评比中总愿为班级拼尽全力。",
        "你值日和大扫除从不偷懒，脏活累活抢在前，用行动诠释了责任二字。",
        "你能公平公正地处理班级事务，不徇私情，赢得了同学们的信任和尊重。",
        "班级遇到困难时你主动补位，同学请假、老师不在时都能看到你担当的身影。",
        "你积极参与志愿服务和社区实践，把班级里的责任感延伸到了更广阔的社会。",
        "你组织活动考虑周全，从方案、分工到应急处理井井有条，领导才能初显。",
        "你爱护集体财物、节约水电资源，公共意识和主人翁精神在细节中闪光。",
        "班级文化墙、板报设计中你积极献策出力，为集体营造了温暖向上的氛围。",
        "面对班级评比中的失误你能坦然总结、不推卸，这份担当令老师动容。"
      ]
    },
    {
      key: "pinde",
      name: "品德修养",
      phrases: [
        "你诚实守信、言行一致，答应的事必全力以赴，诚信是你最闪亮的名片。",
        "你尊重师长、礼让同学，日常问候、进出礼节都体现了良好的家教与修养。",
        "你面对诱惑能守住底线，对作弊、欺凌等不良行为敢于说“不”，品格端正。",
        "你心怀感恩，对父母的付出、老师的帮助、同学的善意都记在心里并予回报。",
        "你正直善良，见到同学受委屈会主动伸援手，是班级里温暖的存在。",
        "你面对批评不推责、不抱怨，能诚恳接受并改正，这份虚心难能可贵。",
        "你乐于分享学习资源与方法，不带私心，把同学的进步当作自己的喜悦。",
        "你崇尚公平、不慕虚荣，不被攀比之风裹挟，朴素中透着坚定的价值取向。",
        "你爱护公物、尊重他人劳动，桌椅整齐、地面干净是你默默的坚持。",
        "你拥有同理心，能站在他人角度思考问题，与同学相处时温和而包容。"
      ]
    },
    {
      key: "laodong",
      name: "劳动卫生",
      phrases: [
        "你值日认真负责，黑板、地面、讲台每个角落都一丝不苟，班级卫生有你更安心。",
        "你大扫除冲在前，擦窗、搬桌、清死角都不嫌脏累，是班级劳动的中坚力量。",
        "你桌面整理井井有条，书本、文具分类摆放，整洁的环境也提升了你的学习效率。",
        "你主动维护教室环境，看到纸屑随手捡起、看到桌椅歪斜主动摆正，细节见修养。",
        "你劳动效率高，能在短时间内高质量完成值日任务，方法与态度都值得学习。",
        "你在劳动中不挑活、不攀比，分配什么就认真做什么，朴实态度令人欣赏。",
        "你关心学校公共空间，走廊、楼梯、操场见到杂乱都会主动整理，主人翁意识强。",
        "你重视个人卫生，校服整洁、仪容规范，展现了初中生应有的精神面貌。",
        "你能带领小组成员协同完成劳动任务，分工清晰、调度合理，组织能力出众。",
        "你珍爱劳动成果，能主动劝阻破坏环境的行为，是班级文明的小卫士。"
      ]
    },
    {
      key: "jiaowang",
      name: "人际交往",
      phrases: [
        "你待人真诚、重情重义，在同学中威信很高，是大家愿意追随的核心伙伴。",
        "你善于沟通表达，能把不同意见说得让人接受，化解同学矛盾时成熟而有分寸。",
        "你尊重老师、体谅父母，青春期里仍能与师长保持顺畅交流，十分难得。",
        "你乐于分享学习方法和笔记资料，带领学习小组共同进步，格局令人欣赏。",
        "你能理性看待同学间的竞争，把对手当朋友、把压力变动力，心态阳光。",
        "你重承诺、守边界，不传播流言、不参与小团体，是班级正气的守护者。",
        "你关心性格内向和暂时落后的同学，主动接纳、耐心帮助，温暖而有力量。",
        "你在合作中既能坚持主见又能接纳建议，团队协作意识与能力都很出色。",
        "你的笑容和幽默感总能缓解学习压力，是班级氛围的润滑剂与开心果。",
        "你处理同学分歧时讲理不斗气，能换位思考、寻求共识，情商令人欣赏。"
      ]
    },
    {
      key: "xiguan",
      name: "行为习惯",
      phrases: [
        "你作息规律、惜时如金，能利用好碎片时间，日积月累形成了可观的学习优势。",
        "你自主整理错题和资料，书包、书桌、电子文档井井有条，高效源于这些细节。",
        "你入校即静、入座即学，自修课从不需老师维持纪律，自律已内化为习惯。",
        "你使用电子产品有节制，能自觉抵制游戏和短视频的诱惑，专注力保护得很好。",
        "你礼貌守纪、仪容规范，进出校园、食堂排队都能体现良好的教养。",
        "你答应的事情必定做到，收发作业、值日值班从不用老师操心，信用是你的名片。",
        "你能保持书桌和教室整洁，做事有头有尾、善始善终，细节中见修养。",
        "你养成了提前预习、当堂巩固、限时训练的好习惯，学习后劲十足。",
        "你坚持每天复习当日所学并整理知识框架，长此以往学科理解愈发透彻。",
        "你的时间管理能力突出，能在学业、社团与休息之间找到合理平衡，节奏稳健。"
      ]
    },
    {
      key: "techang",
      name: "特长发展",
      phrases: [
        "你在科技创新、机器人竞赛中崭露头角，钻研精神与动手能力都令人刮目相看。",
        "你体育特长突出，校运会、班级联赛中多次为集体争得荣誉，是大家心中的健将。",
        "你艺术素养出众，绘画、合唱、乐器演奏都展现了独特的审美与才华。",
        "你写作才华横溢，校刊、征文中屡有佳作，文字中透着超越年龄的思考。",
        "你演讲与朗诵能力出色，能在升旗仪式、班会上大方发声，气场不凡。",
        "你编程能力在同龄人中拔尖，参加信息社团与竞赛展现了良好的逻辑天赋。",
        "你组织策划能力突出，班级活动、社团展示从策划到落地都有你担当主力。",
        "你对外语学习有特别热情，课外阅读、配音、戏剧表演都让你脱颖而出。",
        "你善于把学科兴趣发展为钻研方向，生物学、地理学的小课题已初见成果。",
        "你在传统文化、书法、棋艺等领域有扎实积累，文化自信在你身上自然流露。"
      ]
    }
  ];

  /**
   * 评语风格对应的结尾寄语词库
   * - objective：客观严谨，注重事实陈述与改进方向
   * - encourage：鼓励激励，注重情感支持与正向期待
   * - detailed：具体细致，注重行为指引与路径建议
   * 每个风格 5 条；支持 {pronoun} 占位符：男→他，女→她，不限→该生
   * @type {{objective:string[],encourage:string[],detailed:string[]}}
   */
  var ENDINGS = {
    objective: [
      "本学期整体表现稳定，{pronoun}在学习与品格方面均有所进步，望下学期在弱项上持续改进，争取更均衡的发展。",
      "综合来看，{pronoun}的态度端正、基础扎实，部分学科仍有提升空间，建议结合考纲系统梳理，稳步突破。",
      "{pronoun}本学期能较好地完成学习任务，集体意识强，希望后续在思维深度与表达精度上进一步打磨。",
      "总体而言，{pronoun}的表现符合初中阶段学生规范，若能加强时间规划与反思习惯，成效将更为显著。",
      "{pronoun}在本学期各项评比中表现中上，学习态度认真，期待下阶段在自主学习与跨学科融合上有新突破。"
    ],
    encourage: [
      "老师由衷地为{pronoun}的进步感到骄傲，请相信每一份努力都不会被辜负，继续勇敢向前冲！",
      "{pronoun}身上有着令人欣赏的韧劲与潜力，愿你带着这份光和热，在新的学期里遇见更强的自己！",
      "请告诉{pronoun}：成长比成绩更重要，过程比结果更动人，老师会一直在这里为{pronoun}加油！",
      "愿{pronoun}保持这份热爱与坚持，把每一次小进步都当作勋章，在青春的赛道上跑出自己的节奏！",
      "你身上有星辰，脚下有远方——老师相信{pronoun}一定能绽放出属于自己的光芒，加油！"
    ],
    detailed: [
      "建议下学期三件事：一是每周梳理错题并归因；二是每天预留 20 分钟阅读积累；三是主动找老师复盘一次月考，{pronoun}必能更进一步。",
      "具体改进方向：数学加强几何证明的书写规范；语文增加时评阅读与摘抄；英语坚持每日听力 15 分钟，{pronoun}会看到明显变化。",
      "希望{pronoun}在课堂上多举手发言，每周至少一次；在小组合作中尝试担任一次汇报人；并坚持用错题本整理薄弱知识点。",
      "下周起可尝试：①每天列三件最重要任务；②自习课用番茄钟分割时间；③睡前用 5 分钟复盘，{pronoun}的学习效率会显著提升。",
      "建议{pronoun}继续坚持体育锻炼以释放压力，并每月与家长或老师进行一次学习对话，及时调整方向与节奏。"
    ]
  };

  /**
   * 性别配置：影响代词与卡片显示
   * @type {{any:{label:string,pronoun:string,icon:string},male:{label:string,pronoun:string,icon:string},female:{label:string,pronoun:string,icon:string}}}
   */
  var GENDERS = {
    any: { label: "不限", pronoun: "该生", icon: "👤" },
    male: { label: "男生", pronoun: "他", icon: "👦" },
    female: { label: "女生", pronoun: "她", icon: "👧" }
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
    styleGroup: $("styleGroup"),
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

  /** @type {{prefix:boolean,gender:string,style:string}} 生成设置 */
  var settings = { prefix: true, gender: "any", style: "objective" };

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
   * 将结尾寄语中的 {pronoun} 占位符替换为对应性别代词
   * @param {string} tpl 含 {pronoun} 占位符的模板
   * @returns {string} 替换后的句子
   */
  function fillPronoun(tpl) {
    var g = GENDERS[settings.gender] || GENDERS.any;
    return tpl.replace(/\{pronoun\}/g, g.pronoun);
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

    var endingPool = ENDINGS[settings.style] || ENDINGS.objective;
    var endingRaw = pickPhrase(endingPool, []);
    var ending = fillPronoun(endingRaw);
    picks.__ending = endingRaw;

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
    var gInfo = GENDERS[settings.gender] || GENDERS.any;
    els.resultWrap.innerHTML = results.map(function (r, i) {
      var no = String(i + 1).padStart(2, "0");
      return '<div class="r-card">'
        + '<div class="r-head">'
        + '<span class="r-no">' + no + "</span>"
        + '<span class="r-name">' + escapeHtml(r.name) + "</span>"
        + '<span class="r-gender">' + gInfo.icon + " " + gInfo.label + "</span>"
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
   * 导出 Excel：姓名 / 性别 / 评语三列，列宽适配（依赖本地 SheetJS 全局 XLSX）
   */
  function exportExcel() {
    if (!results.length) { toast("请先生成评语"); return; }
    if (typeof XLSX === "undefined") { toast("Excel 组件未加载，请确认 xlsx.full.min.js 存在"); return; }
    var gInfo = GENDERS[settings.gender] || GENDERS.any;
    var rows = results.map(function (r) {
      return { "姓名": r.name, "性别": gInfo.label, "评语": r.text };
    });
    var ws = XLSX.utils.json_to_sheet(rows, { header: ["姓名", "性别", "评语"] });
    ws["!cols"] = [{ wch: 12 }, { wch: 8 }, { wch: 90 }];
    var wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "初中评语");
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

    // 生成设置：称呼前缀
    els.chkPrefix.addEventListener("change", function () {
      settings.prefix = els.chkPrefix.checked;
      saveSettings();
    });

    // 性别选择
    Array.prototype.forEach.call(els.genderGroup.querySelectorAll('input[name="gender"]'), function (radio) {
      radio.addEventListener("change", function () {
        settings.gender = radio.value;
        saveSettings();
        renderResults();
      });
    });

    // 评语风格
    Array.prototype.forEach.call(els.styleGroup.querySelectorAll('input[name="style"]'), function (radio) {
      radio.addEventListener("change", function () {
        settings.style = radio.value;
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
        if (obj.gender && GENDERS[obj.gender]) settings.gender = obj.gender;
        if (obj.style && ENDINGS[obj.style]) settings.style = obj.style;
      } catch (e) { /* 解析失败保持默认 */ }
    }
    els.chkPrefix.checked = settings.prefix;
    Array.prototype.forEach.call(els.genderGroup.querySelectorAll('input[name="gender"]'), function (radio) {
      radio.checked = radio.value === settings.gender;
    });
    Array.prototype.forEach.call(els.styleGroup.querySelectorAll('input[name="style"]'), function (radio) {
      radio.checked = radio.value === settings.style;
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
