/**
 * 小学评语生成器 · 主逻辑
 * ------------------------------------------------------------------
 * 功能概览：
 *   1. 名单管理（textarea 批量导入 / 示例填充 / 清空，localStorage 自动保存）
 *   2. 10 个评语维度（品德表现 / 学习态度 / 课堂参与 / 作业完成 / 阅读习惯 /
 *      劳动卫生 / 集体荣誉 / 特长发展 / 同伴合作 / 进步寄语）勾选
 *   3. 性别选择（男 / 女 / 中性），自动替换评语中的 {ta} 占位符
 *   4. 评语风格切换（温暖鼓励 / 客观细致 / 期望激励），决定结尾寄语
 *   5. 一键批量生成，相邻学生避免抽到同一条模板，结果不雷同
 *   6. 评语列表卡片展示，支持逐条手动编辑与单条重新生成
 *   7. 复制全部 / 导出 TXT / 导出 Excel（SheetJS）/ 导出 Word
 *   8. 所有配置与结果本地持久化（localStorage），刷新页面可恢复
 *
 * 运行环境：纯前端 IIFE，无网络请求；file:// 协议离线可用。
 * Excel 导出依赖本地 SheetJS（../../assets/vendor/xlsx.full.min.js）。
 */
(function () {
  "use strict";

  /* ===================== 学段专属配置 ===================== */

  /** @type {string} 工具唯一标识，同时作为 localStorage 键前缀，避免与其他工具冲突 */
  var SLUG = "primary-comment";

  /** @type {string} 工具完整中文名，用于导出文件名与提示文案 */
  var TOOL_TITLE = "小学评语生成";

  /** @type {string} 称呼前缀后缀，小学用「同学」（例：陈思远同学：） */
  var PREFIX_LABEL = "同学";

  /** localStorage 键名集合，集中管理便于维护 */
  var KEYS = {
    names: SLUG + ":names",
    dims: SLUG + ":dims",
    settings: SLUG + ":settings",
    results: SLUG + ":results"
  };

  /**
   * 内置示例名单（20 个，常见小学姓名，男女搭配）
   * @type {string[]}
   */
  var SAMPLE_NAMES = [
    "陈思远", "赵子涵", "林语桐", "周沐阳", "吴欣怡",
    "孙浩然", "郑雨彤", "何嘉宁", "高梓轩", "梁书瑶",
    "谢晨曦", "彭子墨", "郭可欣", "邓一诺", "罗俊熙",
    "蒋诗涵", "韩宇航", "曹安琪", "许文博", "苏若彤"
  ];

  /**
   * 性别到第三人称代词的映射，用于替换评语模板中的 {ta} 占位符
   * 中性使用「该生」，更适合正式档案与客观评语场景
   * @type {{male:string,female:string,neutral:string}}
   */
  var PRONOUNS = {
    male: "他",
    female: "她",
    neutral: "该生"
  };

  /**
   * 评语维度词库：共 10 个分类，每分类 10 条不重复短句
   * 模板中可用占位符：
   *   {ta}    —— 第三人称单数代词（男：他 / 女：她 / 中性：该生）
   *   {tas}   —— 第三人称物主代词（男：他的 / 女：她的 / 中性：该生的）
   * 未使用占位符的句子与性别无关，可跨性别使用。
   * @type {{key:string,name:string,phrases:string[]}[]}
   */
  var CATEGORIES = [
    {
      key: "pinde",
      name: "品德表现",
      phrases: [
        "你尊敬师长、团结同学，见到老师主动问好，文明有礼的样子让人如沐春风。",
        "你诚实守信，做错事敢于承认并及时改正，一颗正直的小种子正在心里生根发芽。",
        "你有一颗善良感恩的心，懂得体谅父母和老师的辛苦，常把谢谢挂在嘴边。",
        "你爱护公物、讲究卫生，看到校园里的纸屑会主动弯腰捡起，是校园的小主人。",
        "你热爱班集体，班级荣誉面前总能顾全大局，是老师心中有担当的好孩子。",
        "你遵守校规班纪、明辨是非，能用班规约束自己，也能善意提醒身边的同学。",
        "你乐于助人，同学有困难时主动伸出援手，是大家公认的小雷锋。",
        "你珍惜粮食、节俭朴实，午餐坚持光盘行动，良好的品德就在一点一滴中闪光。",
        "{ta}待人真诚、言行一致，答应别人的事总能认真做到，是同学们信赖的小伙伴。",
        "{tas}心里装着别人，会留意身边人的情绪并主动关心，这份善良与共情格外珍贵。"
      ]
    },
    {
      key: "taidu",
      name: "学习态度",
      phrases: [
        "你学习主动自觉，预习、听讲、复习环环认真，踏实的态度是你最亮眼的名片。",
        "你求知欲强，遇到不懂的问题敢于追问，打破砂锅问到底的劲儿特别可贵。",
        "你能正确对待学习中的挫折，考得不理想不气馁，擦干眼泪继续努力的样子真棒。",
        "你做事一丝不苟，哪怕是一次小听写也全力以赴，认真已经成为你的习惯。",
        "这学期你学习上更加自律，能主动安排学习任务，不再需要老师和家长反复提醒。",
        "你虚心好学，乐于接受老师和同学的建议，知错就改，进步有目共睹。",
        "你对新知识充满热情，课堂上眼睛里总闪着光，这份热爱比分数更珍贵。",
        "你能合理安排学习与玩耍的时间，先完成作业再痛快游戏，自我管理越来越出色。",
        "{ta}对待学习认真踏实，不浮躁、不敷衍，每一次小测都当成大考来对待。",
        "{tas}学习态度端正，遇到困难不退缩，这种韧劲是后续进步最坚实的底盘。"
      ]
    },
    {
      key: "ketang",
      name: "课堂参与",
      phrases: [
        "课堂上你坐姿端正、专心听讲，紧跟老师思路，是同学们学习的榜样。",
        "你积极思考、踊跃发言，回答问题声音响亮、条理清楚，常常给大家带来惊喜。",
        "你敢于提出不同见解，课堂上的奇思妙想常常引发热烈讨论，是爱思考的小质疑家。",
        "小组讨论时你总能积极参与，认真倾听组员意见，推动小组共同完成学习任务。",
        "你听讲专注，能抓住老师讲的重点并认真做好笔记，学习效率很高。",
        "从不敢举手到主动发言，这学期你在课堂上的每一次开口都是勇敢的跨越。",
        "你能在课堂上有效合作，会补充、会质疑、会总结，展现了良好的学习素养。",
        "你上课严守纪律，从不做小动作，还能用眼神和老师交流，专注的样子最美。",
        "{ta}在课堂上思维活跃，常常能从不同角度提出问题，让师生都眼前一亮。",
        "同伴发言时{ta}能认真倾听、不随意打断，这份尊重让课堂氛围格外温暖。"
      ]
    },
    {
      key: "zuoye",
      name: "作业完成",
      phrases: [
        "你的作业卷面整洁、字迹娟秀，翻开你的本子就像欣赏一幅小作品。",
        "你能按时独立完成各科作业，正确率稳步提升，错题总能及时订正。",
        "你书写姿势端正，坚持一尺一拳一寸，工整的字迹是你长期坚持的成果。",
        "你对待作业有钻研精神，遇到难题先自己思考，实在不会才向老师请教。",
        "你的错题本条理清晰，错因分析到位、订正及时，是善于反思的学习者。",
        "这学期你的书写进步明显，横平竖直间能看出你静下心来下了一番苦功。",
        "你能合理安排各科作业时间，先易后难、不拖沓，每晚都能从容完成任务。",
        "你作业完成质量高，还会主动给自己加餐做拓展练习，上进心令人欣赏。",
        "{ta}作业按时上交、订正积极，遇到不会的题目会主动标记请教，学习闭环做得很好。",
        "{tas}作业本干净整洁，每道题步骤完整，能看出写作业时心是静的、思路是清的。"
      ]
    },
    {
      key: "yuedu",
      name: "阅读习惯",
      phrases: [
        "你是个小书虫，课间、午休手不释卷，广泛的阅读让你的表达与众不同。",
        "你坚持每日阅读，好词佳句日积月累，写作文时信手拈来、生动传神。",
        "你读书有方法，会圈点批注、写读书笔记，真正做到了不动笔墨不读书。",
        "从绘本到桥梁书再到名著，你的阅读面越来越广，知识储备让同学们羡慕。",
        "你乐于分享读书收获，读书会上的推荐有理有据，带动了全班的阅读热情。",
        "你能把书中的故事讲得绘声绘色，还能联系生活谈感悟，阅读已经走进了你心里。",
        "你背诵积累了大量古诗和优美段落，传统文化的养分正在悄悄滋养你的文笔。",
        "这学期你的阅读理解能力明显提升，能抓住主要内容、体会人物情感，进步喜人。",
        "{ta}的阅读笔记图文并茂、有自己的思考，每一次翻阅都能看到新的生长点。",
        "{tas}书桌里总藏着几本课外书，{ta}用阅读为自己打开了一扇通往更大世界的窗。"
      ]
    },
    {
      key: "laodong",
      name: "劳动卫生",
      phrases: [
        "你值日认真负责，扫地、擦窗、排桌椅一丝不苟，每次都把教室打扫得窗明几净。",
        "你是老师得力的小助手，收发作业、管理班级井然有序，是同学们信赖的小干部。",
        "大扫除时你总是抢着干最脏最累的活，不怕苦不怕累的精神让大家竖起大拇指。",
        "你自觉维护教室卫生，看到纸屑主动捡起、桌椅歪了主动摆正，校园因你更整洁。",
        "你当值日生时能提前到校、最后离开，责任心在劳动中闪闪发光。",
        "你爱护班级的一草一木，植物角的绿植在你的照料下生机勃勃。",
        "你乐于为班级服务，出黑板报、布置展板总有你忙碌的身影，从无怨言。",
        "在家你也是父母的小帮手，会做家务、体谅长辈，劳动让你更加懂事能干。",
        "{ta}劳动积极肯干，从不挑活儿，把每一项值日任务都完成得认认真真。",
        "{tas}个人卫生习惯也很好，桌斗整齐、衣着干净，举手投足都透着自律。"
      ]
    },
    {
      key: "jiti",
      name: "集体荣誉",
      phrases: [
        "你把班级荣誉看得很重，运动会、合唱节上拼尽全力，为班级争光的样子特别帅。",
        "你是班集体的小主人，主动参与策划班队活动，是同学们信任的「小管家」。",
        "在集体中你敢于担当，遇到脏活累活冲在前，是班级凝聚力的「小粘合剂」。",
        "你关心班级每一个成员，谁生病了主动问候、谁落单了主动邀请，温暖又贴心。",
        "你代表班级参加比赛自信大方，把集体荣誉看得比自己得失更重，格局让人佩服。",
        "运动会、艺术节上你都能见到你忙碌的身影，为班级拿回来的奖状里有你一份功劳。",
        "你爱护班级形象，校外活动时主动维持纪律，是班级「行走的名片」。",
        "班级有困难时你总能挺身而出，这份担当让老师和同学都对你刮目相看。",
        "{ta}在集体活动中积极配合、不抢功、不抱怨，是班级不可或缺的稳定力量。",
        "{tas}集体荣誉感很强，常把「我们班」挂在嘴边，这份归属感让班级更团结。"
      ]
    },
    {
      key: "techang",
      name: "特长发展",
      phrases: [
        "你写得一手漂亮的毛笔字，横竖撇捺间有模有样，是班里公认的小书法家。",
        "运动场上你身姿矫健，跑步、跳绳、球类样样出色，为班级争得了不少荣誉。",
        "你歌声甜美、舞姿灵动，艺术节上的精彩表演让全校师生都记住了你。",
        "你擅长绘画，笔下的人物和风景充满灵气，班级的宣传海报总少不了你的手笔。",
        "你热爱科学探究，小实验、小发明中常有奇思妙想，是科技节上的闪亮之星。",
        "你能说会道、口才出众，朗诵和演讲时抑扬顿挫，是舞台上最自信的小主持人。",
        "你棋艺精湛，对弈时沉着冷静、落子无悔，胜不骄败不馁的风度更胜棋艺。",
        "你坚持学习才艺多年不辍，这份持久的热爱和毅力比奖状更加可贵。",
        "{ta}在计算机、编程等数字领域展现出浓厚兴趣，作品创意十足、完成度很高。",
        "{tas}兴趣广泛而不浮躁，能在多个领域都保持探索热情，难能可贵。"
      ]
    },
    {
      key: "jiaowang",
      name: "同伴合作",
      phrases: [
        "你待人真诚友善，同学们都愿意和你交朋友，你是大家心中值得信赖的伙伴。",
        "你善于合作，小组活动中能倾听、会协商，和你一组做项目总是又轻松又高效。",
        "你宽容大度，和同学有小矛盾时能换位思考、主动和解，胸怀让人佩服。",
        "你热心帮助学习有困难的伙伴，耐心讲题、共同进步，是班里的小老师。",
        "你懂得尊重差异，能欣赏每位同学的优点，从不取笑别人，善良而有教养。",
        "你组织能力强，课间游戏、班队活动总能把大家安排得明明白白，是天生的小组织者。",
        "你关心新同学，主动带他熟悉校园、认识伙伴，让新成员很快融入了班集体。",
        "你诚实守信、重诺守约，答应别人的事一定做到，小伙伴都把你当知心朋友。",
        "{ta}能主动化解同学间的小矛盾，是大家公认的「和事佬」，情商很高。",
        "{tas}合作意识很强，会主动补位、不计较个人得失，团队因{ta}更融洽。"
      ]
    },
    {
      key: "jianyi",
      name: "进步寄语",
      phrases: [
        "希望你今后课堂上更大胆地举手表达，错了也没关系，思考本身就是最美的风景。",
        "建议你给作业多留几分钟检查，再细心一点点，就能和更多好成绩握手。",
        "期待你新学期多读几本科普和历史书，让阅读的面再宽一些、眼界再远一些。",
        "希望你改掉偶尔拖拉的小毛病，用今日事今日毕提醒自己，你会更加轻松出色。",
        "建议你遇到难题先独立思考十分钟再求助，相信自己，你比想象中更有力量。",
        "希望你坚持体育锻炼、保护好视力，用健康的身体支撑大大的梦想。",
        "期待你学会管理自己的小情绪，遇事先深呼吸，做内心更有力量的孩子。",
        "建议你多参加集体活动和志愿服务，在帮助他人的过程中收获更大的成长。",
        "{ta}若能在课堂上再主动一些，下学期一定能更上一层楼，老师拭目以待。",
        "愿{ta}带着这学期的努力与成长继续前行，遇见更优秀的自己，未来可期。"
      ]
    }
  ];

  /**
   * 结尾寄语词库：三种风格，每种 4 条
   * warm        —— 温暖鼓励：第二人称你，柔光、亲和、肯定
   * objective   —— 客观细致：第三人称{ta}，理性、具体、陈述事实
   * expectation —— 期望激励：第二人称你，目标导向、向上、有冲劲
   * @type {{warm:string[],objective:string[],expectation:string[]}}
   */
  var ENDINGS = {
    warm: [
      "孩子，老师为你的努力点赞，愿你永远健康快乐、向阳生长！",
      "愿你被爱包围、被光指引，带着满满的信心迎接新的成长！",
      "你真的很棒，请继续相信自己，老师永远是你最坚实的后盾！",
      "你是一颗闪闪发光的小星星，老师愿陪着你慢慢亮起来。"
    ],
    objective: [
      "{ta}本学期综合表现稳定、品德与学业并进，是一名全面发展的好学生。",
      "{ta}本学期学习态度端正、与同学相处融洽，整体表现令人满意。",
      "综合来看，{ta}是一名自律、上进、有集体责任感的小学生，值得肯定。",
      "{ta}本学期在多个方面均有明显进步，发展态势良好，望继续保持。"
    ],
    expectation: [
      "新学期，愿你以更专注的课堂、更工整的书写，遇见更优秀的自己！",
      "希望你向着既定目标稳步前行，不怕困难、坚持到底，收获更丰硕的果实！",
      "期待你新学期多读书、勤思考、敢表达，成为更全面发展的好少年！",
      "愿你带着这学期的成长继续奔跑，把目标种在心里，用行动浇灌它开花！"
    ]
  };

  /* ===================== DOM 与运行时状态 ===================== */

  /**
   * 按 id 获取 DOM 元素，省略每次的 document.getElementById
   * @param {string} id 元素 id
   * @returns {HTMLElement} 对应 DOM 元素，未找到时为 null
   */
  function $(id) { return document.getElementById(id); }

  /** 常用元素缓存，避免重复查询 */
  var els = {
    nameInput: $("nameInput"),
    btnSample: $("btnSample"),
    btnClear: $("btnClear"),
    genderSelect: $("genderSelect"),
    dimChips: $("dimChips"),
    btnDimAll: $("btnDimAll"),
    btnDimNone: $("btnDimNone"),
    chkPrefix: $("chkPrefix"),
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

  /**
   * 生成设置
   * @type {{prefix:boolean,ending:string,gender:string}}
   * prefix  是否在评语前加「XXX同学：」
   * ending  结尾寄语风格：warm / objective / expectation
   * gender  性别：male / female / neutral
   */
  var settings = { prefix: true, ending: "warm", gender: "neutral" };

  /** @type {{name:string,text:string,picks:Object}[]} 已生成的评语结果，按名单顺序 */
  var results = [];

  /** toast 提示定时器句柄，用于重复触发时清除上次定时 */
  var toastTimer = null;

  /* ===================== 本地存储 ===================== */

  /**
   * 安全写入 localStorage
   * file:// 协议或浏览器隐私模式下可能抛异常，此处吞掉异常避免阻塞主流程
   * @param {string} key 键名
   * @param {string} value 字符串值
   */
  function storageSet(key, value) {
    try { localStorage.setItem(key, value); } catch (e) { /* 忽略存储异常 */ }
  }

  /**
   * 安全读取 localStorage
   * @param {string} key 键名
   * @returns {string|null} 读到的字符串；不存在或异常时返回 null
   */
  function storageGet(key) {
    try { return localStorage.getItem(key); } catch (e) { return null; }
  }

  /** 持久化当前名单文本 */
  function saveNames() { storageSet(KEYS.names, els.nameInput.value); }

  /** 持久化当前勾选的维度 key 数组 */
  function saveDims() {
    var keys = CATEGORIES.filter(function (c) { return selected[c.key]; }).map(function (c) { return c.key; });
    storageSet(KEYS.dims, JSON.stringify(keys));
  }

  /** 持久化生成设置（前缀、寄语风格、性别） */
  function saveSettings() { storageSet(KEYS.settings, JSON.stringify(settings)); }

  /** 持久化生成结果，便于刷新后恢复 */
  function saveResults() { storageSet(KEYS.results, JSON.stringify(results)); }

  /* ===================== 名单与维度 ===================== */

  /**
   * 解析名单文本：按行拆分、去首尾空白、过滤空行、最多保留 100 人
   * @returns {string[]} 姓名数组，可能为空数组
   */
  function parseNames() {
    return els.nameInput.value
      .split(/\r?\n/)
      .map(function (s) { return s.trim(); })
      .filter(function (s) { return s.length > 0; })
      .slice(0, 100);
  }

  /**
   * 渲染维度 chip 标签到页面
   * 每次调用都全量重绘，依靠 aria-pressed 反映勾选状态
   */
  function renderChips() {
    els.dimChips.innerHTML = CATEGORIES.map(function (c) {
      var on = !!selected[c.key];
      return '<button type="button" class="chip" aria-pressed="' + on + '" data-key="' + c.key + '">' + c.name + "</button>";
    }).join("");
  }

  /**
   * 批量设置全部维度的勾选状态并重绘
   * @param {boolean} on true=全选；false=全不选
   */
  function setAllDims(on) {
    CATEGORIES.forEach(function (c) { selected[c.key] = on; });
    renderChips();
    saveDims();
  }

  /* ===================== 评语生成 ===================== */

  /**
   * 将模板中的 {ta} / {tas} 占位符替换为对应性别的代词
   * @param {string} tpl 原始模板字符串
   * @returns {string} 替换后的评语片段
   */
  function applyPronoun(tpl) {
    var pron = PRONOUNS[settings.gender] || PRONOUNS.neutral;
    var pronS = pron + "的";
    return tpl.replace(/\{tas\}/g, pronS).replace(/\{ta\}/g, pron);
  }

  /**
   * 从候选短句中随机抽取一条，自动避开禁用内容
   * 当全部候选都被禁用时，回退为整个候选池再抽一次，保证一定有结果
   * @param {string[]} pool 候选短句数组
   * @param {string[]} forbidden 需要避开的短句集合（如相邻学生已抽到的）
   * @returns {string} 抽中的短句
   */
  function pickPhrase(pool, forbidden) {
    var avail = pool.filter(function (p) { return forbidden.indexOf(p) === -1; });
    if (!avail.length) avail = pool;
    return avail[Math.floor(Math.random() * avail.length)];
  }

  /**
   * 为一名学生拼接完整评语
   * @param {string} name 学生姓名
   * @param {Object[]} avoidPicks 需要避开的抽取记录数组（相邻学生、本人旧记录）
   * @returns {{name:string,text:string,picks:Object}} 一条评语结果对象
   *   - name  学生姓名
   *   - text  最终评语文本（含前缀、拼接段落、结尾寄语）
   *   - picks 每个维度抽中的具体短句，便于单条重生成时去重
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
      parts.push(applyPronoun(phrase));
    });

    var endingPool = ENDINGS[settings.ending] || ENDINGS.warm;
    var ending = applyPronoun(pickPhrase(endingPool, []));

    var prefix = settings.prefix ? name + PREFIX_LABEL + "：" : "";
    return { name: name, text: prefix + parts.join("") + ending, picks: picks };
  }

  /**
   * 一键为名单中的全部学生批量生成评语
   * 校验名单非空、至少勾选一个维度；超 100 人仅取前 100；
   * 相邻学生避免抽到同一条模板，保证差异化
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
   * 单独重新生成某一张卡片的评语
   * 避开本人旧抽取记录与前后相邻学生的抽取记录，确保新结果与上下文不雷同
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
   * 转义 HTML 特殊字符，防止姓名或评语内容破坏页面结构
   * @param {string} s 原始字符串
   * @returns {string} 转义后的字符串，可直接用于 innerHTML 拼接
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
   * 每张卡片含序号、姓名、单条重生成按钮、可编辑评语文本域
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
   * 字数计算去除所有空白字符，更接近真实阅读长度
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
   * 轻提示 toast：在屏幕底部短暂显示一条消息
   * @param {string} msg 提示文案
   */
  function toast(msg) {
    els.toast.textContent = msg;
    els.toast.classList.add("show");
    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { els.toast.classList.remove("show"); }, 2200);
  }

  /**
   * 复制文本到剪贴板：优先用 Clipboard API，失败则回退 execCommand
   * file:// 协议或非安全上下文下 Clipboard API 可能不可用
   * @param {string} text 待复制文本
   * @returns {Promise<void>} 成功 resolve，失败 reject
   */
  function copyToClipboard(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      return navigator.clipboard.writeText(text).catch(function () { return legacyCopy(text); });
    }
    return legacyCopy(text);
  }

  /**
   * 旧式复制方案：临时 textarea + execCommand('copy')
   * 兼容 file:// 与非安全上下文，移动端也能工作
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
   * @param {string} filename 文件名（含扩展名）
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
   * 复制全部评语：姓名 + Tab + 评语文本，可直接粘贴进 Excel 一行一条
   * 评语内的换行与制表符会被替换为空格，避免破坏表格结构
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
   * 导出 TXT：带 BOM 头，记事本打开不乱码
   * 格式为「序号. 姓名」一行、评语一行、空行分隔
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
   * 导出 Excel：姓名 / 评语两列，列宽适配
   * 依赖本地 SheetJS（../../assets/vendor/xlsx.full.min.js）暴露的全局 XLSX 对象
   * 若用户意外删除该 vendor 文件，给出明确提示而非静默失败
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
   * 导出 Word：HTML 文档 + application/msword Blob，Word/WPS 可直接打开
   * 中文段落用 <p> + text-indent，姓名加粗作为段首
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
   * 采用事件委托处理维度 chip 与结果区的动态元素，减少监听器数量
   */
  function bindEvents() {
    // 名单输入：每次按键即自动保存
    els.nameInput.addEventListener("input", saveNames);

    // 示例名单 / 清空名单
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

    // 性别切换：实时保存并应用到新生成的评语
    els.genderSelect.addEventListener("change", function () {
      settings.gender = els.genderSelect.value;
      saveSettings();
    });

    // 维度 chip：事件委托切换勾选状态
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

    // 生成设置：前缀开关
    els.chkPrefix.addEventListener("change", function () {
      settings.prefix = els.chkPrefix.checked;
      saveSettings();
    });
    // 生成设置：寄语风格单选
    Array.prototype.forEach.call(els.endingGroup.querySelectorAll('input[name="ending"]'), function (radio) {
      radio.addEventListener("change", function () {
        settings.ending = radio.value;
        saveSettings();
      });
    });

    // 一键生成
    els.btnGenerate.addEventListener("click", generateAll);

    // 导出
    els.btnCopy.addEventListener("click", exportCopy);
    els.btnTxt.addEventListener("click", exportTxt);
    els.btnExcel.addEventListener("click", exportExcel);
    els.btnWord.addEventListener("click", exportWord);

    // 结果区：单条重生成（事件委托）
    els.resultWrap.addEventListener("click", function (e) {
      var btn = e.target.closest ? e.target.closest("[data-regen]") : null;
      if (!btn) return;
      regenerateOne(parseInt(btn.getAttribute("data-regen"), 10));
    });
    // 结果区：手动编辑实时同步到 results 并保存
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
   * 任何一项读取或解析失败均回退到默认值，保证页面可用
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
        if (obj.ending && ENDINGS[obj.ending]) settings.ending = obj.ending;
        if (obj.gender && PRONOUNS[obj.gender]) settings.gender = obj.gender;
      } catch (e) { /* 解析失败保持默认 */ }
    }
    els.chkPrefix.checked = settings.prefix;
    els.genderSelect.value = settings.gender;
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
   * 在 DOMContentLoaded 之后由 IIFE 末尾直接调用
   */
  function init() {
    restore();
    renderChips();
    renderResults();
    bindEvents();
  }

  init();
})();
