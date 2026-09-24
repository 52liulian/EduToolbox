/**
 * 幼儿园评语生成器
 * ------------------------------------------------------------------
 * 功能：名单管理（localStorage 自动保存）、10 个评语维度勾选、
 *       评语风格切换（温暖鼓励 / 童趣可爱 / 具体细致）、性别适配（男/女/中性）、
 *       一键为每名幼儿随机拼接评语（同分类相邻不重复）、逐条编辑/重生成、
 *       字数统计、复制全部、导出 TXT / Excel / Word。
 * 运行：纯前端、无网络请求，支持 file:// 离线打开；Excel 依赖本地 SheetJS。
 */
(function () {
  "use strict";

  /* ===================== 学段专属配置 ===================== */

  /** @type {string} 工具唯一标识，同时作为 localStorage 键前缀 */
  var SLUG = "kinder-comment";

  /** @type {string} 工具完整中文名（用于提示与导出文件名） */
  var TOOL_TITLE = "幼儿园期末评语生成器";

  /**
   * 性别 → 称呼前缀尾词
   * @type {{boy:string,girl:string,neutral:string}}
   */
  var PREFIX_LABELS = {
    boy: "小男子汉",
    girl: "小公主",
    neutral: "小朋友"
  };

  /**
   * 性别 → 第三人称代词（用于模板 {ta} 占位替换）
   * @type {{boy:string,girl:string,neutral:string}}
   */
  var GENDER_PRONOUN = {
    boy: "他",
    girl: "她",
    neutral: "TA"
  };

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
    "李一诺", "王梓萱", "张沐辰", "陈思妍", "刘奕辰",
    "赵雨桐", "孙若曦", "周子沐", "吴悦心", "郑皓轩",
    "冯佳琪", "蒋宇泽", "沈心怡", "韩沐阳", "杨若琳",
    "朱奕安", "秦语桐", "何子谦", "高艺涵", "林俊熙"
  ];

  /**
   * 评语维度词库：10 个分类，每个分类 10 条不重复短句。
   * 短句中的 {ta} 会被替换为对应性别的代词（他/她/TA），{name} 替换为幼儿姓名。
   * @type {{key:string,name:string,phrases:string[]}[]}
   */
  var CATEGORIES = [
    {
      key: "zaiyuan",
      name: "在园表现",
      phrases: [
        "每天早上你都能甜甜地和老师问好，开开心心地走进幼儿园，是大家心里的小太阳。",
        "这学期你在幼儿园越来越自在，晨间活动、区域游戏里总能看到你认真投入的小身影。",
        "你在园里总能跟上一日活动的节奏，喝水、如厕、午睡都不用老师多操心。",
        "你对幼儿园的一切充满好奇，种植角的小芽芽、自然角的小蜗牛都能让你惊喜半天。",
        "在园里你愿意把自己的发现和心情讲给老师听，老师最喜欢你笑眯眯说话的样子。",
        "你每天都精神饱满地来到幼儿园，积极参加每一项活动，小身体棒棒的。",
        "在集体生活中{ta}越来越懂事，会自己整理小椅子、摆好小杯子，像个能干的小大人。",
        "你对班级越来越有归属感，会自豪地告诉别人「这是我们班」，老师听了心里暖暖的。",
        "一学期下来，{ta}已经熟练适应幼儿园的一日生活节奏，是班级里让人放心的小帮手。",
        "区域活动、户外游戏、集体教学，每一处都能看到{ta}认真又开心的小小身影。"
      ]
    },
    {
      key: "zili",
      name: "生活自理",
      phrases: [
        "你已经学会自己穿脱外套和鞋子，午睡起床后还会努力把小被子叠得整整齐齐。",
        "饭前便后你能主动用七步洗手法把小手洗干净，是个讲卫生的好宝贝。",
        "吃饭时你能握住小勺子自己吃完一份饭菜，不挑食、不撒饭，进步特别大。",
        "你会自己端水杯接水喝、主动如厕，还能把小毛巾挂回自己的小格子里。",
        "离园时{ta}总能记着整理小书包，拉链、水杯、换洗衣物一样都不落。",
        "午睡时你能自己盖好小被子安静入睡，起床后还会努力穿上小鞋袜。",
        "你学会了根据冷热穿脱马甲，身体不舒服时也会勇敢地告诉老师。",
        "这学期{ta}的小手越来越能干，剥鸡蛋、擦桌子、收玩具，样样都愿意试一试。",
        "洗手、如厕、喝水、用餐，{ta}都能独立完成，自理能力有了大大的进步。",
        "你会主动收拾自己的小柜子，把换洗衣物叠好放进小袋子，井井有条。"
      ]
    },
    {
      key: "huodong",
      name: "活动参与",
      phrases: [
        "户外体育游戏里你总是跑得最欢，钻、爬、跳、平衡样样敢尝试，动作越来越协调。",
        "区域游戏时{ta}专注又投入，建构区里搭出的城堡和大桥充满奇思妙想。",
        "早操和律动中你跟着音乐又唱又跳，小胳膊小腿特别有节奏感。",
        "集体教学活动中你愿意举手回应老师的问题，答错了也不怕，勇气可嘉。",
        "角色游戏里你把娃娃家的爸爸妈妈演得有模有样，会喂娃娃吃饭、哄娃娃睡觉。",
        "每次户外活动{ta}都能听清规则再开始，收器材时还总是抢着帮忙。",
        "你敢于挑战有点难度的运动器械，从不敢到敢尝试，老师看到了你满满的勇气。",
        "节日活动和亲子运动会上你表现大方，和小伙伴合作完成任务时笑得最灿烂。",
        "集体活动时{ta}坐得端正、听得认真，积极参与每一次讨论和操作。",
        "你喜欢尝试各种新鲜的活动，从美工到建构、从音乐到运动，样样都不缺席。"
      ]
    },
    {
      key: "yuyan",
      name: "语言表达",
      phrases: [
        "你的小嘴巴越来越会表达，能把周末的趣事完整地讲给全班小朋友听。",
        "集体听故事时{ta}最专注，回答问题的句子越来越完整，词汇也越来越丰富。",
        "你喜欢念儿歌、背古诗，吐字清楚、声音响亮，当小老师带读时有模有样。",
        "遇到矛盾时{ta}开始学着用「我不喜欢这样」「请你还给我」等小句子表达自己，而不是哭闹。",
        "绘本阅读后你能用自己的话复述故事，还会给小动物加上有趣的新结局。",
        "你愿意在集体面前大胆表演，讲故事、念儿歌时自然又自信，小朋友都为你鼓掌。",
        "这学期{ta}从不敢发言到主动举手，每一次开口都是大大的进步，老师为你骄傲。",
        "你能认真倾听同伴说话不插嘴，等别人讲完再表达，是个有礼貌的小听众。",
        "{ta}能用完整的句子描述自己的发现和心情，词汇越来越丰富，表达越来越自信。",
        "你喜欢和老师分享周末的小故事，逻辑越来越清晰，用词越来越生动。"
      ]
    },
    {
      key: "tongban",
      name: "同伴交往",
      phrases: [
        "你是小朋友们都喜欢的好伙伴，会主动把玩具分给大家，和谁都能玩到一起。",
        "游戏中{ta}学会了等待、轮流和商量，「我们一起玩好吗」常挂在{ta}的嘴边。",
        "看到同伴遇到困难，你会主动上前帮忙，还会用小手轻轻拍拍对方的背安慰对方。",
        "和小伙伴发生小摩擦时，你能听老师的话学着原谅对方，两个人又拉起了小手。",
        "你喜欢邀请好朋友一起合作搭建、一起看绘本，分享让你的快乐变成了双份。",
        "你尊重每一个小伙伴，游戏时愿意迁就别人的想法，大家都愿意和你交朋友。",
        "新朋友加入时，{ta}会大方地拉人家一起玩，带着新朋友熟悉班级，是热心的小主人。",
        "你会用拥抱、牵手表达对小伙伴的喜欢，班级里因为有你多了许多温暖的小瞬间。",
        "{ta}懂得分享与合作，是小组里最受欢迎的小搭档，大家都争着和{ta}一组。",
        "你愿意把自己的玩具和绘本带到幼儿园与小伙伴分享，慷慨又大方。"
      ]
    },
    {
      key: "xiguan",
      name: "习惯与规则",
      phrases: [
        "集体活动中你能坐好小椅子、安静倾听，举手得到老师允许后再发言。",
        "上下楼梯你能扶好栏杆慢慢走，排队时总跟前面的小伙伴保持安全距离。",
        "区域活动结束的音乐一响，{ta}就能快速把玩具分类送回它们的家。",
        "你能记住班级的小约定：轻声说话、慢步走路，是守规则的小榜样。",
        "喝水、如厕、取餐时{ta}都会自觉排队，不争不抢，还会提醒小伙伴遵守秩序。",
        "你爱惜绘本和玩具，轻轻翻书、轻拿轻放，发现损坏还会告诉老师一起修补。",
        "这学期{ta}的规则意识越来越强，知道什么时间做什么事，集体生活适应得很棒。",
        "离园前你会主动把小椅子推回桌下、检查自己的物品，好习惯正在一点点养成。",
        "{ta}能自觉遵守班级约定，午睡、用餐、活动转换都井然有序。",
        "你愿意主动维护班级的小秩序，会提醒同伴收拾玩具、关好水龙头。"
      ]
    },
    {
      key: "xingge",
      name: "性格表现",
      phrases: [
        "你是个开朗热情的小宝贝，笑声像银铃一样，走到哪里就把快乐带到哪里。",
        "你做事专注有耐心，拼图、串珠再难也不轻易放弃，坚持到底的样子特别可爱。",
        "你细心又体贴，发现老师咳嗽会轻轻拍背，看到小伙伴难过会递上小纸巾。",
        "你是个敢想敢做的小小探索家，总有问不完的为什么，小脑袋里装满奇思妙想。",
        "你温和谦让，遇到争抢总愿意先退一步，懂事得让老师心疼又喜欢。",
        "你勇敢又独立，跌倒了会自己爬起来拍拍土说「我不哭」，是个坚强的小勇士。",
        "你做事认真负责，当小小值日生时擦桌、摆碗一丝不苟，是老师得力的小帮手。",
        "你内心细腻柔软，能感受到故事里小动物的心情，善良的小种子正在你心里发芽。",
        "{ta}自信又大方，敢于在全班小朋友面前表达自己的想法，是个闪闪发光的小宝贝。",
        "你内心温暖又敏感，懂得关心别人的情绪，是个让人暖到心底的小天使。"
      ]
    },
    {
      key: "dongshou",
      name: "动手与艺术",
      phrases: [
        "你的小手真灵巧，撕纸、粘贴、团泥样样在行，作品常常被贴在展示墙上。",
        "画画时你用色大胆、想象丰富，会给太阳画上绿胡子，每个故事都藏在你的画里。",
        "手工活动中{ta}能沿线撕贴、正确使用安全剪刀，小手肌肉越来越灵活。",
        "唱歌时你音调准、表情甜，演奏打击乐时还能跟上节拍，是表演区的小明星。",
        "泥工活动里{ta}会搓圆、压扁、捏造型，小面团在{ta}手里变成了小兔和小蛋糕。",
        "你喜欢随音乐自由舞蹈，动作创编大胆可爱，每次表演都充满自信。",
        "建构区里{ta}会和小伙伴合作架空、围合，搭出的幼儿园结构越来越复杂。",
        "你敢于尝试各种美术材料，水彩、拓印、手指画都玩得津津有味，享受创作的快乐。",
        "你的画作色彩明亮、想象力丰富，每一幅都像装着一个童话小世界。",
        "{ta}能在音乐律动中感受节奏、大胆表现，每次艺术活动都乐在其中。"
      ]
    },
    {
      key: "jianyi",
      name: "温馨建议",
      phrases: [
        "假期里也请坚持规律作息，早睡早起多运动，让{ta}的小身体继续棒棒的。",
        "在家可以多让宝贝做些力所能及的小事，穿脱衣物、收拾玩具都是成长的练习。",
        "吃饭时鼓励{ta}自己动手，少看电子产品、细嚼慢咽，营养均衡才能长高高。",
        "希望爸爸妈妈多陪{ta}读绘本、讲故事，每天十五分钟的亲子阅读时光最珍贵。",
        "多带{ta}到大自然中走走看看，一片落叶、一只蚂蚁都是最好的启蒙老师。",
        "鼓励{ta}用语言说出需求和情绪，家人耐心倾听，小嘴巴就会越来越能干。",
        "请坚持送{ta}按时入园，多与老师聊聊家里的小故事，家园携手陪伴成长。",
        "假期里请注意交通、玩水和居家安全，把安全的小种子种进{ta}心里。",
        "建议假期继续保持幼儿园的作息节奏，让{ta}的小习惯不放假、不退步。",
        "多和{ta}聊聊幼儿园的趣事，倾听{ta}的小烦恼，亲子沟通让爱更顺畅。"
      ]
    },
    {
      key: "jiyu",
      name: "成长寄语",
      phrases: [
        "愿你像一株小苗苗，在阳光和爱里继续悄悄拔节生长。",
        "老师会一直在这里，等着看你长成更勇敢、更能干的模样。",
        "新的一岁，愿你的小口袋里装满好奇，小脚步走得更加坚定。",
        "愿你永远保有这份亮晶晶的好奇心，把平凡的日子过成有趣的故事。",
        "老师相信，升入新班级的你一定会更自信、更独立，收获更多好朋友。",
        "愿你的笑容永远这样甜，遇到困难时记得，老师和爸爸妈妈永远是你最稳的依靠。",
        "新的旅程就在前方，愿你带着善良和勇敢，继续做闪闪发光的自己。",
        "老师会把和你在一起的点点滴滴小心珍藏，也祝你在新学期收获满满。",
        "愿{ta}像小树苗一样，在阳光雨露中扎根生长，长成自己最喜欢的模样。",
        "新学期，新旅程，愿{ta}带着这份勇敢与好奇，继续向快乐出发。"
      ]
    }
  ];

  /**
   * 风格专属开场白：3 种风格，每种 3 条。
   * {name} 会替换为幼儿姓名，{ta} 会替换为对应性别代词。
   * @type {{warm:string[],cute:string[],detailed:string[]}}
   */
  var OPENINGS = {
    warm: [
      "这个学期，老师看到了{name}小朋友好多好多的进步——",
      "{name}宝贝这一学期的小脚印踩得又稳又暖，",
      "回想起这个学期，{name}给老师留下了好多温暖的瞬间："
    ],
    cute: [
      "嘘——老师偷偷告诉你，{name}小宝贝这个学期超棒的哟！",
      "哒哒哒～{name}小朋友的小学期结束啦，老师先给你鼓鼓掌！",
      "叮咚！{name}小朋友的本学期成长报告新鲜出炉啦——"
    ],
    detailed: [
      "本学期{ta}在幼儿园的整体表现总结如下：",
      "回顾本学期，{ta}在以下几方面均有明显进步：",
      "本学期{ta}在园期间的成长情况记录如下："
    ]
  };

  /**
   * 风格专属结尾寄语：3 种风格，每种 4 条。
   * @type {{warm:string[],cute:string[],detailed:string[]}}
   */
  var ENDINGS = {
    warm: [
      "宝贝，老师永远爱你，新学期我们继续一起加油哟！",
      "愿你被这个世界温柔以待，健康快乐地长大，老师为你加油！",
      "亲爱的宝贝，慢慢来、别着急，你已经做得很棒很棒啦！",
      "新学期老师会继续牵着你的小手，一起去看更多的美好风景。"
    ],
    cute: [
      "哒哒哒～新学期的脚步来啦，{name}小可爱准备好继续闪闪发光了吗？",
      "老师给你一个大大的熊抱，愿你天天都有甜甜的好心情！",
      "叮咚——你有一份新学期的快乐待查收，老师和你一起打开它哟！",
      "比心心～愿你继续做班里最快乐的小太阳，把笑容洒满每一天！"
    ],
    detailed: [
      "新学期建议家长继续陪伴{ta}坚持早睡早起、独立穿脱衣物，并在阅读与表达上多给予鼓励。",
      "希望假期中能继续保持幼儿园的好习惯，每天安排 20 分钟亲子阅读、30 分钟户外运动。",
      "建议新学期在家也鼓励{ta}自己整理玩具、主动表达需求，遇到困难先尝试再求助。",
      "下学期可重点关注{ta}的同伴合作与情绪表达，多创造与小伙伴互动的机会。"
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
    genderGroup: $("genderGroup"),
    styleGroup: $("styleGroup"),
    chkPrefix: $("chkPrefix"),
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

  /**
   * 生成设置
   * @type {{prefix:boolean,gender:string,style:string}}
   */
  var settings = { prefix: true, gender: "neutral", style: "warm" };

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

  /* ===================== 模板替换 ===================== */

  /**
   * 将模板中的 {name} 与 {ta} 替换为对应内容
   * @param {string} tpl 原始模板
   * @param {string} name 学生姓名
   * @returns {string} 替换后的文本
   */
  function fillTemplate(tpl, name) {
    var pronoun = GENDER_PRONOUN[settings.gender] || GENDER_PRONOUN.neutral;
    return tpl.replace(/\{name\}/g, name).replace(/\{ta\}/g, pronoun);
  }

  /* ===================== 评语生成 ===================== */

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
   * 为一名学生拼接完整评语：前缀 + 风格开场白 + 各维度短句 + 风格结尾寄语
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
      parts.push(fillTemplate(phrase, name));
    });

    // 风格开场白
    var openingPool = OPENINGS[settings.style] || OPENINGS.warm;
    var opening = fillTemplate(pickPhrase(openingPool, []), name);

    // 风格结尾寄语
    var endingPool = ENDINGS[settings.style] || ENDINGS.warm;
    var ending = fillTemplate(pickPhrase(endingPool, []), name);

    // 称呼前缀（按性别选择尾词：小朋友 / 小男子汉 / 小公主）
    var label = PREFIX_LABELS[settings.gender] || PREFIX_LABELS.neutral;
    var prefix = settings.prefix ? name + label + "：" : "";

    return {
      name: name,
      text: prefix + opening + parts.join("") + ending,
      picks: picks
    };
  }

  /**
   * 一键为名单中的全部学生生成评语
   */
  function generateAll() {
    var rawLines = els.nameInput.value.split(/\r?\n/);
    var overLimit = rawLines.map(function (s) { return s.trim(); }).filter(Boolean).length > 100;
    var names = parseNames();
    if (!names.length) { toast("请先填写学生名单"); return; }
    if (overLimit) toast("名单超过 100 人，已仅取前 100 人生成");

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
    toast("已为 " + names.length + " 名小朋友生成评语");
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
    var blob = new Blob(["﻿" + body], { type: "text/plain;charset=utf-8" });
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
    XLSX.utils.book_append_sheet(wb, ws, "期末评语");
    XLSX.writeFile(wb, TOOL_TITLE + ".xlsx");
    toast("Excel 文件已开始下载");
  }

  /**
   * 导出 Word：HTML 文档 + application/msword Blob，中文段落用 <p>
   * 不依赖外部库，直接生成 HTML 转 .doc
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
    var blob = new Blob(["﻿", doc], { type: "application/msword" });
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

    // 性别切换
    Array.prototype.forEach.call(els.genderGroup.querySelectorAll('input[name="gender"]'), function (radio) {
      radio.addEventListener("change", function () {
        settings.gender = radio.value;
        saveSettings();
      });
    });

    // 评语风格切换
    Array.prototype.forEach.call(els.styleGroup.querySelectorAll('input[name="style"]'), function (radio) {
      radio.addEventListener("change", function () {
        settings.style = radio.value;
        saveSettings();
      });
    });

    // 称呼前缀开关
    els.chkPrefix.addEventListener("change", function () {
      settings.prefix = els.chkPrefix.checked;
      saveSettings();
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
        if (obj.gender && PREFIX_LABELS[obj.gender]) settings.gender = obj.gender;
        if (obj.style && OPENINGS[obj.style]) settings.style = obj.style;
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
