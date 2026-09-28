/**
 * common-2500-hanzi.js
 * 常用 2500 汉字表 - 前端交互逻辑
 * 设计：IIFE 单例模块，无外部依赖（除 pinyin-pro）
 * 兼容：file:// 协议、http(s) 协议
 *
 * 功能：
 *   1. 内置 2500 常用汉字字表（现代汉语常用字表）
 *   2. 使用 pinyin-pro 动态生成拼音
 *   3. 网格展示 + 分页（每页 100 字）
 *   4. 搜索（支持汉字 / 拼音 / 声调符号）
 *   5. 笔画分组筛选
 *   6. 拼音标注开关
 *   7. 字号调节（36~96px）
 *   8. 全屏模式（舞台右上角工具栏 ⛶ / ⚙，由共享模块 tool-stage-toolbar.js 提供）
 *   9. 点击汉字弹窗详情
 *  10. localStorage 持久化设置
 */
(function () {
  "use strict";

  /* ================================================================
   * 一、内置 2500 常用汉字字表（现代汉语常用字表）
   * 字符串顺序无关，由 pinyin-pro 运行时计算拼音。
   * 数据来源：1988 年国家语委颁布的《现代汉语常用字表》常用字 2500
   * ================================================================ */
  var HANZI_2500 =
    "一乙二十丁厂七卜人入八九几儿了力乃刀又三于干亏士工土才寸下大丈与万上小口巾山千乞川亿个勺久凡及夕丸么" +
    "广亡门义之尸弓己已子卫也女飞刃习叉马乡丰王井开夫天无元专云扎艺木五支厅不太犬区历尤友匹车巨牙屯比互切" +
    "瓦止少日中冈贝内水见午牛手毛气升长仁什片仆化仇币仍仅斤爪反介父从今凶分乏公仓月氏勿欠风丹匀乌凤勾文六" +
    "方火为斗忆订计户认心尺引丑巴孔队办以允予劝双书幻玉刊示末未击打巧正扑扒功扔去甘世古节本术可丙左厉右石" +
    "布龙平灭轧东卡北占业旧帅归且旦目叶甲申叮电号田由史只央兄叼叫另叨叹四生失禾丘付仗代仙们仪白仔他斥瓜乎" +
    "丛令用甩印乐句匆册犯外处冬鸟务包饥主市立闪兰半汁汇头汉宁穴它讨写让礼训必议讯记永司尼民出辽奶奴加召皮" +
    "边发孕圣对台矛纠母幼丝式刑动扛寺吉扣考托老执巩圾扩扫地扬场耳共芒亚芝朽朴机权过臣再协西压厌在有百存而" +
    "页匠夸夺灰达列死成夹轨邪划迈毕至此贞师尘尖劣光当早吐吓虫曲团同吊吃因吸吗屿帆岁回岂刚则肉网年朱先丢舌" +
    "竹迁乔伟传乒乓休伍伏优伐延件任伤价份华仰仿伙伪自血向似后行舟全会杀合兆企众爷伞创肌朵杂危旬旨负各名多" +
    "争色壮冲冰庄庆亦刘齐交次衣产决充妄闭问闯羊并关米灯州汗污江池汤忙兴宇守宅字安讲军许论农讽设访寻那迅尽" +
    "导异孙阵阳收阶阴防奸如妇好她妈戏羽观欢买红纤级约纪驰巡寿弄麦形进戒吞远违运扶抚坛技坏扰拒找批扯址走抄" +
    "坝贡攻赤折抓扮抢孝均抛投坟抗坑坊抖护壳志扭块声把报却劫芽花芹芬苍芳严芦劳克苏杆杠杜材村杏极李杨求更束" +
    "豆两丽医辰励否还歼来连步坚旱盯呈时吴助县里呆园旷围呀吨足邮男困吵串员听吩吹呜吧吼别岗帐财针钉告我乱利" +
    "秃秀私每兵估体何但伸作伯伶佣低你住位伴身皂佛近彻役返余希坐谷妥含邻岔肝肚免狂犹角删条卵岛迎饭饮系言冻" +
    "状亩况床库疗应冷这序辛弃冶忘闲间闷判灶灿弟汪沙汽沃泛沟没沈沉怀忧快完宋宏牢究穷灾良证启评补初社识诉诊" +
    "词译君灵即层尿尾迟局改张忌际陆阿陈阻附妙妖妨努忍劲鸡驱纯纱纳纲驳纵纷纸纹纺驴纽奉玩环武青责现表规抹拢" +
    "拔拣担坦押抽拐拖拍者顶拆拥抵拘势抱垃拉拦拌幸招坡披拨择抬其取苦若茂苹苗英范直茄茎茅林枝杯柜析板松枪构" +
    "杰述枕丧或画卧事刺枣雨卖矿码厕奔奇奋态欧垄妻轰顷转斩轮软到非叔肯齿些虎虏肾贤尚旺具果味昆国昌畅明易昂" +
    "典固忠咐呼鸣咏呢岸岩帖罗帜岭凯败贩购图钓制知垂牧物乖刮秆和季委佳侍供使例版侄侦侧凭侨佩货依的迫质欣征" +
    "往爬彼径所舍金命斧爸采受乳贪念贫肤肺肢肿胀朋股肥服胁周昏鱼兔狐忽狗备饰饱饲变京享店夜庙府底剂郊废净盲" +
    "放刻育闸闹郑券卷单炒炊炕炎炉沫浅法泄河沾泪油泊沿泡注泻泳泥沸波泼泽治怖性怕怜怪学宝宗定宜审宙官空帘实" +
    "隶居届刷屈弦承陕降限妹姑姐姓始驾参艰线练组细驶织终驻驼绍经贯奏春帮珍玻毒型挂封持项垮挎城挠政赴赵挡挺" +
    "括拴拾挑指垫挣挤拼挖按挥挪某甚革荐巷带草茧茶荒茫荡荣故胡南药标枯柄栋相查柏柳柱柿栏树要咸威歪研砖厘厚" +
    "砌砍面耐耍牵残殃轻鸦皆背战点临览竖省削尝是盼眨哄显哑冒映星昨畏趴胃贵界虹虾蚁思蚂虽品咽骂哗咱响哈咬咳" +
    "哪炭峡罚贱贴骨钞钟钢钥钩卸缸拜看矩怎牲选适秒香种秋科重复竿段便俩贷顺修保促侮俭俗俘信皇泉鬼侵追俊盾待" +
    "律很须叙剑逃食盆胆胜胞胖脉勉狭狮独狡狱狠贸怨急饶蚀饺饼弯将奖哀亭亮度迹庭疮疯疫疤姿亲音帝施闻阀阁差养" +
    "美姜叛送类迷前首逆总炼炸炮烂剃洁洪洒浇浊洞测洗活派洽染济洋洲浑浓津恒恢恰恼恨举觉宣室宫宪突穿窃客冠语" +
    "扁袄祖神祝误诱说诵垦退既屋昼费陡眉孩除险院娃姥姨姻娇怒架贺盈勇怠柔垒绑绒结绕骄绘给络骆绝绞统障缝静碧" +
    "璃墙撇嘉摧截誓境摘摔聚蔽慕暮蔑模榴榜榨歌遭酷酿酸磁愿需弊裳颗嗽蜻蜡蝇蜘赚锹锻舞稳算箩管僚鼻魄貌膜膊膀" +
    "鲜疑馒裹敲豪膏遮腐瘦辣竭端旗精歉熄熔漆漂漫滴演漏慢寨赛察蜜谱嫩翠熊凳骡缩慧撕撒趣趟撑播撞撤增聪鞋蕉蔬" +
    "横槽樱橡飘醋醉震霉瞒题暴瞎影踢踏踩踪蝶蝴嘱墨镇靠稻黎稿稼箱箭篇僵躺僻德艘膝膛熟摩颜毅糊遵潜潮懂肠龟试" +
    "郎诗肩房诚衬衫视话诞询该详建肃录孟孤耕耗艳泰珠班素蚕顽盏匪捞栽捕振载赶起盐捎捏埋捉捆捐损都哲逝捡换挽" +
    "热恐壶挨耻耽恭莲莫荷获晋恶真框桂档桐株桥桃格校核样根索哥速";

  /* ================================================================
   * 笔画数与部首数据（2026-09-28 由 cnchar + cnchar-radical 离线生成）
   * 与 buildData() 的去重顺序严格对齐（同序索引一一对应）：
   *   - STROKE_COUNTS：每字笔画数，base36 编码（1~f 即 1~15 画）
   *   - RADICALS：每字所属部首（《现代汉语词典》规范部首）
   * ================================================================ */
  var STROKE_COUNTS = "1122222222222222222333333333333333333333333333333333333333333333333334444444444444444444444444444444444444444444444444444444444444444444444444444444444444444444444444444444445555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555566666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666677777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777778888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888889999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999ddeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeefffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff778888888888888888888aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa";
  var RADICALS =
    "一乙二十一厂一卜人入八丿几儿乙力丿刀又一二干二士工土扌寸一大一一一一小口巾山十乙川亻人勹丿几又夕丿丿广亠门丶丶尸弓己己子卩乙女飞刀乙又马乙丨王二廾大大一二一二扌艹木二支厂一大犬匚厂尢又匚车工牙屮比二刀瓦止小日丨冂贝冂水见十牛手毛气十长亻亻片亻亻亻巾亻亻斤爪又人父人人凵刀丿八人月氏勹欠风丿勹丿几勹文八方火丶斗忄讠讠户讠心尸弓一巳子阝力人儿乙力又乙幺玉刂示木木凵扌工止扌扌力扌厶甘一口艹木木口一工厂口石巾龙干火车一丨匕卜一日巾彐一日目口田田口田口田田口口大儿口口口口口囗生大禾丿亻亻亻亻亻亻白亻亻斤瓜丿一人用用卩丿口勹丿犭夕夂夂鸟力勹饣丶巾立门丷十氵氵大氵宀穴宀讠冖讠礻讠心讠讠讠水口尸氏凵辶女女力口皮辶又子土寸口矛纟母幺一弋刂力扌寸口扌耂扌耂扌工土扌扌土扌土耳八艹二艹木木木木辶臣冂十覀厂厂土月白子而页匚大大火辶刂歹戈大车阝刂辶比至止贝巾小小力儿彐日口口虫曰囗口口口囗口口山巾山囗山刂刂肉冂干木儿丿舌竹辶丿亻亻丿丿亻亻亻亻亻廴亻亻亻亻亻十亻亻亻亻自血口亻口行舟入人木口儿人人父人刂月木木厄日日贝口口夕刀色士冫冫广广亠刂齐亠欠衣亠冫亠女门门门羊干丷米火川氵氵氵氵氵忄八宀宀宀子宀讠冖讠讠冖讠讠讠寸阝辶尸寸廾子阝阝攵阝阝阝女女女女女女戈羽见欠乙纟纟纟纟纟马巛寸廾麦彡辶戈口辶辶辶扌扌土扌土扌扌扌扌扌土走扌土贝攵赤扌扌扌扌子土扌扌土扌土土扌扌士心扌土士扌扌卩力艹艹艹艹艹艹一艹力十艹木木木木木木木木木水曰木豆一一匚辰力口辶歹木辶止土日目口日口力厶里口囗日囗口口足阝田囗口丨口口口口口口口刂山巾贝钅钅口戈乙刂禾禾禾母八亻亻亻亻亻亻亻亻亻亻亻亻亻亻身白亻辶彳彳辶人巾土谷女口阝山月月刀犭犭角刂木卩山辶饣饣糸言冫犬亠冫广广疒广冫辶广辛廾冫心门门门刂火火弓氵氵氵氵氵氵氵氵氵忄忄忄宀宀宀牛穴穴火艮讠口讠衤刀礻讠讠讠讠讠口火卩尸尸尸辶尸攵弓心阝阝阝阝阝阝女女女力心力鸟马纟纟纟纟马纟纟纟纟纟马纟大王王止青贝见衣见扌扌扌扌扌土扌扌扌扌扌耂页扌扌扌扌力扌土扌扌扌干扌土扌扌扌扌八又艹艹艹艹艹艹艹目艹艹艹木木木木木木木木木木辶木一戈一卜亅刂木雨十石石厂大大大心欠土女车页车斤车车刂非又月齿二虍虍月贝小日八木口日囗日田日日日八囗心口口鸟口口山山巾罒巾山几贝贝贝囗钅刂矢土牜牜丿刂禾口子女亻亻亻亻亻片亻亻亻几亻亻贝亻白辶贝欠彳彳爪彳彳户舌金口斤父采又乚贝心贝月月月月月月月月月月口日鱼刀犭心犭夂饣饣饣又亠亠广夕广广广刂阝广冫目攵刂月门门阝刀厄十火火火火火氵氵氵氵氵氵氵氵氵氵氵氵氵氵氵氵氵氵氵氵忄忄忄忄忄子宀宀宀宀宀宀宀穴巾宀隶尸尸刂尸弓手阝阝阝女女女女女马厶艮纟纟纟纟马纟纟马马纟纟贝大日巾王王母土扌寸扌页土扌土扌攵走走扌扌扌扌扌扌扌土扌扌扌扌扌扌扌木甘革艹巳巾艹艹艹艹艹艹艹攵月十艹木木木木目木木木木木木木覀口女止石石厂厂石石面而而牛歹歹车鸟白月戈灬丨见立目刂小日目目口日口冂日日日田足月贝田虫虫虫心虫虫口口马口口口口口口口火山罒贝贝骨钅钅钅钅钅卩缶手目矢心牜辶辶禾香禾禾禾里夂竹殳亻亻贝页亻亻亻亻亻亻亻亻白水鬼亻辶亻目彳彳彳页又刂辶飠皿月月月月月力犭犭犭犭犭犭贝心心饣虫饣饣弓寸大口亠亠广辶广疒疒疒疒女亠音巾方门门门工丷八女又辶米辶刂首辶心火火火火刂氵氵氵氵氵氵氵氵氵氵氵木氵氵氵氵氵氵忄忄忄忄忄丶见宀宀宀宀穴穴穴宀冖讠户衤礻礻礻讠讠讠讠土辶旡尸日贝阝目子阝阝阝女女女女女心木贝皿力心木土纟纟纟纟马纟纟纟马纟纟纟阝纟青石王土扌口扌戈言土扌扌耳艹小日艹木木木木欠辶酉酉酉石心雨廾衣页口虫虫虫虫贝钅钅夕禾竹竹竹亻鼻鬼豸月月月鱼疋饣衣攴豕月辶肉疒辛立立方米欠火火氵氵氵氵氵氵忄宀贝宀虫讠女羽灬几马纟心扌扌走走扌扌扌扌土耳革艹艹木木木木风酉酉雨雨目页日目彡足足足足虫虫口土钅非禾黍禾禾竹⺮竹亻身亻彳舟月月灬手页殳米辶氵氵忄月刀讠阝讠月户讠衤衤见讠讠讠讠讠廴聿彐子子耒耒色水王王糸虫页皿匚扌木扌扌车走走皿扌扌土扌扌扌扌阝口辶扌扌扌灬心士扌耳耳小艹艹艹艹日心目木木木木木木木木木木木木糸口辶";

  /* ================================================================
   * 二、配置与状态
   * ================================================================ */
  /** 每页显示汉字数量 */
  var PAGE_SIZE = 100;

  /** 字号范围 */
  var FONT_MIN = 36;
  var FONT_MAX = 96;
  var FONT_STEP = 8;

  /** localStorage 键名 */
  var LS_KEY = "edu-hanzi-2500-settings-v1";

  /** 全局状态 */
  var state = {
    data: [],            // [{ch, py, pyLower}]
    filtered: [],       // 当前过滤后的数据
    page: 1,            // 当前页码
    search: "",         // 搜索关键字
    strokesFilter: 0,   // 笔画筛选：0 表示全部
    pinyinOn: true,     // 拼音显示开关
    fontSize: 64,       // 字号
    pinyinReady: false  // pinyin-pro 是否可用
  };

  /* ================================================================
   * 三、工具函数
   * ================================================================ */

  /**
   * 按 id 获取元素
   * @param {string} id 元素 id
   * @returns {HTMLElement|null}
   */
  function $(id) { return document.getElementById(id); }

  /**
   * HTML 转义，避免注入风险
   * @param {string} s
   * @returns {string}
   */
  function esc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  /**
   * 显示 toast 提示
   * @param {string} msg 提示文案
   * @param {number} [duration=1600] 显示时长（ms）
   */
  function toast(msg, duration) {
    var t = $("toast");
    if (!t) return;
    t.textContent = msg;
    t.hidden = false;
    // 强制 reflow 触发动画
    void t.offsetWidth;
    t.classList.add("show");
    clearTimeout(t._timer);
    t._timer = setTimeout(function () {
      t.classList.remove("show");
      setTimeout(function () { t.hidden = true; }, 250);
    }, duration || 1600);
  }

  /**
   * 防抖函数
   * @param {Function} fn 目标函数
   * @param {number} wait 等待毫秒
   * @returns {Function}
   */
  function debounce(fn, wait) {
    var timer = null;
    return function () {
      var ctx = this, args = arguments;
      clearTimeout(timer);
      timer = setTimeout(function () { fn.apply(ctx, args); }, wait || 180);
    };
  }

  /**
   * 读取 localStorage 设置（容错 file:// 协议）
   * @returns {Object} 设置对象
   */
  function loadSettings() {
    try {
      var raw = localStorage.getItem(LS_KEY);
      if (!raw) return {};
      return JSON.parse(raw) || {};
    } catch (e) { return {}; }
  }

  /**
   * 写入 localStorage 设置
   * @param {Object} obj 设置对象
   */
  function saveSettings(obj) {
    try { localStorage.setItem(LS_KEY, JSON.stringify(obj || {})); }
    catch (e) { /* 静默失败：隐私模式或 file:// 权限被拒 */ }
  }

  /* ================================================================
   * 四、pinyin-pro 包装
   * ================================================================ */

  /**
   * 调用 pinyin-pro 获取单字拼音
   * @param {string} ch 单个汉字
   * @returns {string} 拼音字符串（带声调符号，多音字以逗号分隔）；不可用则返回空
   */
  function getPinyin(ch) {
    if (!state.pinyinReady || !ch) return "";
    try {
      var arr = window.pinyinPro.pinyin(ch, { type: "array", toneType: "symbol", mode: "normal" });
      if (arr && arr.length) {
        // pinyin-pro 对单字也返回数组，多音字去重
        var uniq = [];
        for (var i = 0; i < arr.length; i++) {
          if (arr[i] && uniq.indexOf(arr[i]) === -1) uniq.push(arr[i]);
        }
        return uniq.join(",");
      }
    } catch (e) { /* 忽略单字异常 */ }
    return "";
  }

  /* ================================================================
   * 五、数据初始化
   * ================================================================ */

  /**
   * 从 HANZI_2500 字符串构造数据数组，去重并计算拼音
   * 同时按同序索引从 STROKE_COUNTS / RADICALS 取笔画数与部首
   * @returns {Array<{ch:string, py:string, pyLower:string, strokes:number, radical:string}>} 数据数组
   */
  function buildData() {
    var seen = Object.create(null);
    var result = [];
    var str = HANZI_2500;
    for (var i = 0; i < str.length; i++) {
      var ch = str.charAt(i);
      // 跳过非汉字（标点、空格、字母数字）
      if (!/[\u4e00-\u9fa5]/.test(ch)) continue;
      if (seen[ch]) continue;
      seen[ch] = 1;
      var idx = result.length; // 与 STROKE_COUNTS / RADICALS 同序对齐
      var py = getPinyin(ch);
      result.push({
        ch: ch,
        py: py,
        pyLower: py.toLowerCase(),
        strokes: parseInt(STROKE_COUNTS.charAt(idx), 36) || 0,
        radical: RADICALS.charAt(idx) || ""
      });
    }
    // 数据对齐守卫：长度不一致时降级为不显示（不影响拼音主功能）
    if (result.length !== STROKE_COUNTS.length || result.length !== RADICALS.length) {
      console.warn("[common-2500-hanzi] 笔画/部首数据长度不对齐，已停用", result.length, STROKE_COUNTS.length, RADICALS.length);
      for (var j = 0; j < result.length; j++) { result[j].strokes = 0; result[j].radical = ""; }
    }
    return result;
  }

  /* ================================================================
   * 六、过滤与渲染
   * ================================================================ */

  /**
   * 根据当前搜索词与笔画筛选，更新 state.filtered
   */
  function applyFilter() {
    var kw = state.search.trim().toLowerCase();
    var sf = state.strokesFilter;
    var arr = state.data;

    if (!kw && !sf) {
      state.filtered = arr.slice();
    } else {
      state.filtered = arr.filter(function (d) {
        var matchKw = !kw || d.ch.indexOf(kw) >= 0 || d.pyLower.indexOf(kw) >= 0;
        var matchSf = !sf || d.strokes === sf;
        return matchKw && matchSf;
      });
    }

    // 修正越界页码
    var totalPages = Math.max(1, Math.ceil(state.filtered.length / PAGE_SIZE));
    if (state.page > totalPages) state.page = totalPages;
    if (state.page < 1) state.page = 1;
  }

  /**
   * 渲染汉字网格（当前页）
   */
  function renderGrid() {
    var grid = $("grid");
    var empty = $("emptyState");
    if (!grid) return;

    var start = (state.page - 1) * PAGE_SIZE;
    var end = Math.min(start + PAGE_SIZE, state.filtered.length);
    var showPinyin = state.pinyinOn;

    var html = [];
    for (var i = start; i < end; i++) {
      var d = state.filtered[i];
      var pyHtml = showPinyin
        ? '<span class="py">' + esc(d.py || "—") + '</span>'
        : '';
      html.push(
        '<div class="char' + (showPinyin ? '' : ' no-pinyin') + '" data-idx="' + i + '" title="' + esc(d.py || d.ch) + '">' +
          '<span class="ch">' + esc(d.ch) + '</span>' +
          pyHtml +
        '</div>'
      );
    }
    grid.innerHTML = html.join("");
    empty.hidden = state.filtered.length > 0;
  }

  /**
   * 渲染统计信息
   */
  function renderStats() {
    var el = $("stats");
    if (el) {
      var total = state.data.length;
      var cur = state.filtered.length;
      el.textContent = "共 " + cur + " 字" + (cur < total ? " / 总 " + total + " 字" : "");
    }
  }

  /**
   * 渲染分页控件
   */
  function renderPagination() {
    var wrap = $("pagination");
    if (!wrap) return;
    var total = state.filtered.length;
    var totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
    if (totalPages <= 1) { wrap.innerHTML = ""; return; }

    var cur = state.page;
    var html = [];

    // 上一页
    html.push('<button class="page-btn" data-page="' + (cur - 1) + '" ' + (cur <= 1 ? "disabled" : "") + '>‹</button>');

    // 页码：首页 + 省略号 + 当前附近 + 末页 + 省略号
    function pageBtn(n, label, active) {
      return '<button class="page-btn' + (active ? " active" : "") + '" data-page="' + n + '">' + (label || n) + '</button>';
    }
    var pages = computePageList(cur, totalPages);
    for (var i = 0; i < pages.length; i++) {
      var p = pages[i];
      if (p === "...") html.push('<span class="page-info">…</span>');
      else html.push(pageBtn(p, p, p === cur));
    }

    // 下一页
    html.push('<button class="page-btn" data-page="' + (cur + 1) + '" ' + (cur >= totalPages ? "disabled" : "") + '>›</button>');

    // 跳转
    html.push('<span class="page-info">' + cur + ' / ' + totalPages + ' 页</span>');

    wrap.innerHTML = html.join("");
  }

  /**
   * 计算分页页码列表（含省略号）
   * @param {number} cur 当前页
   * @param {number} total 总页数
   * @returns {Array<number|string>}
   */
  function computePageList(cur, total) {
    var list = [];
    var edge = 1;        // 首尾各保留的页码数
    var around = 1;      // 当前页前后保留的页码数
    var last = -1;

    for (var p = 1; p <= total; p++) {
      var inFirst = p <= edge;
      var inLast = p > total - edge;
      var nearCur = p >= cur - around && p <= cur + around;
      if (inFirst || inLast || nearCur) {
        if (last !== -1 && p - last > 1) list.push("...");
        list.push(p);
        last = p;
      }
    }
    return list;
  }

  /**
   * 渲染笔画筛选 chip 列表
   * 注：每字笔画数已内置（见 STROKE_COUNTS），chip 交互暂未开放，
   *     仅渲染"全部"占位，避免过多筛选项干扰主查询流程。
   */
  function renderStrokesFilter() {
    var el = $("strokesFilter");
    if (!el) return;
    // 简化处理：仅显示"全部"占位，避免无数据时误导
    el.innerHTML =
      '<span class="chip' + (state.strokesFilter === 0 ? " active" : "") + '" data-strokes="0">全部</span>';
  }

  /**
   * 渲染字号显示
   */
  function renderFontSize() {
    var val = $("fontSizeVal");
    if (val) val.textContent = state.fontSize;
    document.documentElement.style.setProperty("--char-size", state.fontSize + "px");
    // 拼音字号随主字号缩放
    var pySize = Math.max(10, Math.round(state.fontSize * 0.18));
    document.documentElement.style.setProperty("--pinyin-size", pySize + "px");
  }

  /**
   * 主渲染入口
   */
  function render() {
    applyFilter();
    renderStats();
    renderGrid();
    renderPagination();
    renderStrokesFilter();
    renderFontSize();
  }

  /* ================================================================
   * 七、详情弹窗
   * ================================================================ */

  /**
   * 打开汉字详情弹窗
   * @param {number} idx 在 state.filtered 中的索引
   */
  function openModal(idx) {
    var d = state.filtered[idx];
    if (!d) return;
    $("modalChar").textContent = d.ch;
    $("modalPinyin").textContent = d.py || "—";
    // 笔画数、部首：来自内联离线数据（cnchar 生成）；释义未收录
    $("modalStrokes").textContent = d.strokes ? d.strokes + " 画" : "—";
    $("modalRadical").textContent = d.radical || "—";
    $("modalDef").textContent = "暂未收录释义数据，释义请以《现代汉语词典》为准。";

    $("modalMask").hidden = false;
    document.body.style.overflow = "hidden";
  }

  /**
   * 关闭详情弹窗
   */
  function closeModal() {
    $("modalMask").hidden = true;
    document.body.style.overflow = "";
  }

  /* ================================================================
   * 八、全屏模式
   * 说明：舞台（.grid-wrap）右上角工具栏的 ⛶ / ⚙ 由共享模块
   *       tool-stage-toolbar.js 接管，本工具不再自行调用 Fullscreen API，
   *       也不再使用 body.is-fullscreen 兜底样式。
   * ================================================================ */

  /* ================================================================
   * 九、设置持久化
   * ================================================================ */

  /**
   * 将当前可持久化的设置写入 localStorage
   */
  function persistSettings() {
    saveSettings({
      pinyinOn: state.pinyinOn,
      fontSize: state.fontSize,
      search: state.search,
      strokesFilter: state.strokesFilter
    });
  }

  /* ================================================================
   * 十、事件绑定
   * ================================================================ */

  /**
   * 绑定所有交互事件
   */
  function bindEvents() {
    // 搜索输入（防抖）
    var searchInput = $("searchInput");
    var searchClear = $("searchClear");
    var onSearch = debounce(function (val) {
      state.search = val;
      state.page = 1;
      persistSettings();
      render();
    }, 160);
    searchInput.addEventListener("input", function (e) {
      var v = e.target.value;
      searchClear.hidden = !v;
      onSearch(v);
    });
    searchClear.addEventListener("click", function () {
      searchInput.value = "";
      searchClear.hidden = true;
      state.search = "";
      state.page = 1;
      persistSettings();
      render();
      searchInput.focus();
    });

    // 拼音开关
    $("pinyinToggle").addEventListener("change", function (e) {
      state.pinyinOn = e.target.checked;
      persistSettings();
      render();
    });

    // 字号调节
    $("fontDec").addEventListener("click", function () {
      var next = Math.max(FONT_MIN, state.fontSize - FONT_STEP);
      if (next === state.fontSize) return;
      state.fontSize = next;
      persistSettings();
      renderFontSize();
    });
    $("fontInc").addEventListener("click", function () {
      var next = Math.min(FONT_MAX, state.fontSize + FONT_STEP);
      if (next === state.fontSize) return;
      state.fontSize = next;
      persistSettings();
      renderFontSize();
    });

    // 复制当前结果
    $("copyBtn").addEventListener("click", function () {
      var chars = state.filtered.map(function (d) { return d.ch; }).join("");
      if (!chars) { toast("暂无字符可复制"); return; }
      // 优先 Clipboard API，兜底 textarea
      function done(ok) {
        if (ok) toast("已复制 " + state.filtered.length + " 字");
        else toast("复制失败，请手动选中");
      }
      try {
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(chars).then(function () { done(true); }).catch(function () {
            done(copyFallback(chars));
          });
        } else {
          done(copyFallback(chars));
        }
      } catch (e) { done(copyFallback(chars)); }
    });

    // 网格点击 - 事件委托
    $("grid").addEventListener("click", function (e) {
      var node = e.target.closest(".char");
      if (!node) return;
      var idx = parseInt(node.getAttribute("data-idx"), 10);
      if (!isNaN(idx)) openModal(idx);
    });

    // 分页点击 - 事件委托
    $("pagination").addEventListener("click", function (e) {
      var btn = e.target.closest(".page-btn");
      if (!btn || btn.disabled) return;
      var p = parseInt(btn.getAttribute("data-page"), 10);
      if (!isNaN(p)) {
        var totalPages = Math.max(1, Math.ceil(state.filtered.length / PAGE_SIZE));
        state.page = Math.min(Math.max(1, p), totalPages);
        render();
        // 滚动到网格顶部
        var wrap = document.querySelector(".grid-wrap");
        if (wrap) wrap.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });

    // 弹窗关闭
    $("modalClose").addEventListener("click", closeModal);
    $("modalMask").addEventListener("click", function (e) {
      if (e.target === $("modalMask")) closeModal();
    });

    // 键盘：ESC 关闭弹窗
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" || e.keyCode === 27) {
        if (!$("modalMask").hidden) closeModal();
      }
    });

    // 笔画筛选点击 - 占位（预留扩展）
    $("strokesFilter").addEventListener("click", function (e) {
      var chip = e.target.closest(".chip");
      if (!chip) return;
      var n = parseInt(chip.getAttribute("data-strokes"), 10) || 0;
      state.strokesFilter = n;
      state.page = 1;
      persistSettings();
      render();
    });
  }

  /**
   * 兜底复制方案（无 Clipboard API 时）
   * @param {string} text
   * @returns {boolean} 是否成功
   */
  function copyFallback(text) {
    try {
      var ta = document.createElement("textarea");
      ta.value = text;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      ta.style.left = "-9999px";
      document.body.appendChild(ta);
      ta.select();
      var ok = document.execCommand("copy");
      document.body.removeChild(ta);
      return ok;
    } catch (e) { return false; }
  }

  /* ================================================================
   * 十一、初始化
   * ================================================================ */

  /**
   * 应用持久化的设置到 state
   */
  function applySettings() {
    var s = loadSettings();
    if (typeof s.pinyinOn === "boolean") state.pinyinOn = s.pinyinOn;
    if (typeof s.fontSize === "number") {
      state.fontSize = Math.min(FONT_MAX, Math.max(FONT_MIN, s.fontSize));
    }
    if (typeof s.search === "string") {
      state.search = s.search;
      var si = $("searchInput"); if (si) si.value = s.search;
      var sc = $("searchClear"); if (sc) sc.hidden = !s.search;
    }
    if (typeof s.strokesFilter === "number") state.strokesFilter = s.strokesFilter;

    // 同步 UI 控件
    var pt = $("pinyinToggle");
    if (pt) pt.checked = state.pinyinOn;
  }

  /**
   * 主初始化函数
   */
  function init() {
    // 舞台右上角工具栏：⛶ 汉字网格全屏 / ⚙ 隐藏搜索与筛选条
    if (window.EduToolStageToolbar) {
      window.EduToolStageToolbar.init({ stage: ".grid-wrap", panelHost: "#appRoot", hiddenClass: "setup-hidden" });
    }

    // 检测 pinyin-pro
    state.pinyinReady = !!(window.pinyinPro && typeof window.pinyinPro.pinyin === "function");
    if (!state.pinyinReady) {
      console.warn("[common-2500-hanzi] 未检测到 pinyin-pro，拼音将显示为空。请检查 assets/vendor/pinyin-pro.min.js 是否加载。");
    }

    // 应用持久化设置
    applySettings();

    // 构造数据
    state.data = buildData();

    // 绑定事件
    bindEvents();

    // 首次渲染
    render();
  }

  // DOM 就绪后启动
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
