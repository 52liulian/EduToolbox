/**
 * 小学生字表模块（EduToolbox · 1-6 年级生字）
 * ----------------------------------------------------------------
 * 功能：
 *   1) 1-6 年级 12 个册次生字切换（标签栏）
 *   2) 网格展示当前册次全部生字，支持拼音标注开关
 *   3) 字号调节（小/中/大/特大），网格单元自适应
 *   4) 点击汉字显示详情（拼音、笔画数、册次、序号）
 *   5) 字数统计
 *   6) 全屏大字预览（课堂展示，支持上/下切换、键盘 ← → ESC）
 *   7) 浏览器 Fullscreen API 全屏模式
 *   8) 复制当前册次全部生字
 * 结构：IIFE 单文件模块，纯前端实现，兼容 file:// 协议离线打开。
 * 数据：内置人教版 1-6 年级生字（与 classtool.cn 同源，2218 个不重复字）；
 *       笔画数取自 MakeMeAHani 开源数据集，按笔画数分桶存储。
 */

(function () {
  "use strict";

  /* ===================== 内置数据 ===================== */

  /**
   * 1-6 年级各册生字数据（人教版，字符串形式，已去重）
   * @type {Object<string,string>}
   */
  var GRADE_DATA = {
    "一年级上册": "一二三十木禾上下土个八入大天人火文六七儿九无口日中了子门月不开四五目耳头米见白田电也长山出飞马鸟云公车牛羊小少巾牙尺毛卜又心风力手水广升足走方半巴业本平书自已东西回片皮生里果几用鱼今正雨两瓜衣来年左右",
    "一年级下册": "万丁冬百齐说话朋友春高你们红绿花草爷节岁亲的行古声多处知忙洗认扫真父母爸全关写完家看着画笑兴会妈奶午合放收女太气早去亮和语千李秀香听唱连远定向以后更主意总先干赶起明净同工专才级队蚂蚁前空房网诗林童黄闭立是朵美我叶机她他送过时让吗吧虫往得很河姐借呢呀哪谁怕跟凉量最园因为脸阳光可石办法找许别到那都吓叫再象像做点照沙海桥竹军苗井乡面忘想念王从边这进道贝原男爱虾跑吹地快乐老师短对冷淡热情拉把给活种吃练习苦学非常问间伙伴共汽分要没位孩选北南江湖秋只星雪帮请就球玩跳桃树刚兰各坐座带急名发成晚动新有在什么变条",
    "二年级上册": "宜实色华谷金尽层丰壮波浪灯作字苹丽劳尤其区巨它安块站已甲豆识纷经如好娃洼于首枝枫记刘胡戏棋钢观弹琴养休伸甜歌院除息您牵困员青宁室样校切教响班欠元包钟叹哈迟闹及身仔细次外计怦礼加夕与川州台争民族亿洁欢祖旗帜庆曲央交市旁优阴坛城国图申匹互京泪洋拥抱相扬讲打指接惊故侯奇寸落补拔功助取所信沿拾际蛙错答还言每治棵挂哇怪慢怎思穿弯比服浅漂啦啊夫表示号汗伤吸极串免告诉狐狸猴颗斤折挑根独满容易采背板椅但傍清消由术吐注课铅笔桌景拿坏松扎抓祝福句幸之令布直当第现期轮路丑永饥饱温贫富户亚角周床病始张寻哭良食双体操场份粉昨晴姑娘妹读舟乘音客何汪丛牢拍护保物鸡猫羽领捉理跃蹦灵晨失觉扔掉眼睛纸船久乎至死腰捡粒被并夜喜重味轻刻群卫运宇宙航舰冲晒池浮灾害黑器岸纹洞影倒游圆围杯件住须能飘必事历史灭克化代孙植厂产介农科技纺织",
    "二年级下册": "诗村童碧妆绿丝剪冲寻姑娘吐柳荡桃杏鲜邮递员原叔局堆礼邓植格引注满休息锋昨冒留弯背洒温暖能桌味买具甘甜菜劳匹妹波纹像景恋舍求州湾岛峡民族谊齐奋贴街舟艾敬转团热闹贝壳甲骨钱币与财关烧茄烤鸭肉鸡蛋炒饭彩梦森拉结苹般精灵伞姨弟便教游戏母周围句补充药合死记屁股尿净屎幸使劲亡牢钻劝丢告筋疲图课摆座交哈页抢嘻愿意麦该伯刻突掉湖莲穷荷绝含岭吴雷乌黑压垂户迎扑指针帮助导永碰特积宇宙杯失板容易浴室扇慢遇兔安根痛最店决定商夫终完换期蛙卖搬倒籽泉破应整抽纺织编怎布消祖啊浓望蓝摘掏赛忆世界功反复式简弄由觉值类艰弓炎害此新",
    "三年级上册": "坪坝戴招蝴蝶孔雀舞铜粗尾要装劲绒朝些钓察瓣拢掌趣爬峰顶似苍仰咱奋辫勇居郊散步胸脯渣或者敢惜低诚基突按摆弄准备侧胶卷辆秘杂社著藏悄闪坑臣推旅考秦纪遗究震促深忆异逢佳倍遥遍插精希却依拼命奔村抖丧磨坊扇枚邮爽柿仙梨菠萝粮紧杨艳内梦醒苏湿娇嫩强适昆播修致论试验袋证概减阻测括确误途超堂镜闲待阅腿随调简拜访具闻尘仆纳闷丘迎等止境授品暗降丈肢肌肤辽阔血液滋润创造县设参部横跨举击坚固栏案爪贵断楚孤帆蓝懒披划威武拣颜形状渔料辈汇欣赏映挡视线浸献药材软刮舌矛盾集持般架龟攻炮坦战神兵退挖鞋斧锯免屋抢难初管敌阶懂陶谦虚嘴恼怒吵感荒捧朴素值受愿姿势投况吞烈绪述普通鼓励育瓶系绳茶危险顺俩索激堵获予担宽裕买猜糖即卡盼仁贴",
    "三年级下册": "燕聚增掠稻尖偶沾圈漾倦符演赞咏碧妆裁剪滨紫荷挨莲蓬账仿佛裳翩蹈蜻蜓翠秆腹赤衬衫透泛泡饲翁陡壁欧洲瑞士舒启殊骤涉疲政踏救载森郁葱湛盖犁砍裸扩栋柴喘黎寓则窟窿狼叼街劝悔盘缠硬弓魏射箭猎雁弦悲惨愈痛裂叮嘱排靠幅审肃晌悦熟悉诲赛疼忧慰梭虽狂赢暑益穷将若俱博鸦截伍默局棒羡慕禁席众纠匠替抄墨骂缩承肩扛缘愤毕戒既贺顾迅速复恰犯缓婆议达稚烦享炸医输眉型否垫酒掩咬拳制柔渴罐累竟匆哀舔反递忍凑咽唾沫涌差抵氏庄稼兽存繁殖蔬麻较杀预幕临悬曾奥努登任撒藻旦项估龄络箱迫悟盯鼠唐警眯览敞寄秒恋彤霞陪趁窄脖段漆胆踪镇摊鼻换摔竖卖售驮构端掏馆饭辨堆模付标齿乞巧霄渡屏烛晓偷淹官逼姓睁旱徒腾催吊跪渠灌溉隆塌露燃熊挣熄喷缺纯冶炼盆",
    "四年级上册": "潮称盐笼罩蒙薄雾昂沸贯旧恢灿烂竿茫桨规律支株缝隙耀梢寂莫腊浑疑虎占铺均匀叠茎柄触痕逐宅蔽弃毫遇择址穴掘搜倾扒抛溢允墙牌添训覆凝辣酷愉拆融剩伐煤颈郑厉剧餐倘饮侍脾蹲供邻性格凭贪职痒稿踩梅蛇跌撞辟崇旋嘉砖隔屯堡垒仗扶智慧魄殿廊柱栽筑阁朱堤雕狮态孟浩陵辞唯舍君洪暴猛涨裤懒稳俗衡序伏峡桂移湾彼袭余怀旷暂胞脉帝义伯租振范闯凡巡嚷妇惩篇荐翻帘页删词燥握洽昏厅糊改程赖耕驾幻潜核控联哲归恐凶笨鸽仅顿描绘吨盈敏捷崭",
    "四年级下册": "亭庭潭螺谙澜瑕攀峦泰骆驼罗障兀绵浙桐簇浓臀稍额擦蜿蜒乳据源维财属货驰赠驶德惑码库捎橡拨尊沃呈惫堪善款例瘦杰喉捶僵配幼滩侦嘲啄企愚蠢返拦鸥帽吁彻蝙蝠捕蛾蚊避锐铛蝇揭碍荧削喂哨挺斯甩踢枪防鬼汉滚毁惯牺牲凯征阿姨济贡圣驻罪恶健康径畅磕绊瞬弧翔权缤扰欲屈茁诊撼蹋限棚饰冠菊瞧率觅耸捣搬巢谐眠辛蚕桑昼耕绩塞鹭笠略辩奉违磅拴拖释宣萨妄执港澈壶缸罢苟绣挥徽聋哑昌妻刺绑扁鹊蔡睬肠胃烫剂汤焰驱袖败罚佩饶抗押锁狠膝肝脏",
    "五年级上册": "窃炒锅踮哟饿惧充檐皱碗酸撑柜侣娱盒豫趟诵零编某洛榆畔帐魂缕幽葬愁腮甚绸呜谓梳衰绢侨鲸猪腭哺滤肚肺矮判胎盗嫌夹恙藕粘噪废捞饵溅钩翼纵啪鳃皎唇沮诱诫践亩尝吩咐茅榨榴杉矶混昔墟曼疾爆砾砸颤糕迪搂豪誊置司妙版慈祥歧谨慎损皇珑剔杭莱瑶宏宋侵统销瑰烬庙务葛吼腔崎岖尸斩坠雹仇恨眺丸崖岷典副委协宾泽奏诞钮瞻拂骑嗓党",
    "五年级下册": "毯渲勒吟迂襟蹄貌拘羞涩跤偏涯晰伞抚绍疆陷牧蓑遮醉媚锄剥毡卸咀嚼漠寞袄袍傻胚祸患臂赋淘妨岂痴绞汁厘愧亏梁惠诣乃曰禽侮辱谎敝矩囚嘻臣淮柑橘枳贼赔妮役硝炭谊谣噩耗跺嫂挎篮咆哮疯狞淌肆揪豹瞪呻膛搀祭奠赵璧召诺怯瑟拒诸荆妒忌曹督甘鲁延幔私寨擂呐援丞擞绽扳咚监侄郎皆敛媳骚宗怜帕脊莞锦姹嫣暇颇尼艇叉艄翘舱姆祷雇哗",
    "六年级上册": "邀俯瀑峭躯津蕴侠谧巷俏逗庞烘烤韵勤勉吻施挠庸艰毅铲劣惹讥浆岔挚寝频朦胧凄斑篇搁填怨掀唉裹魁梧淋撕霉虑悠仪歉溜嘿割晶莹蔼资矿赐竭滥胁睹嗡鹿骏鹰潺脂婴眷扭胯厨套猬畜窜挽囫囵枣搞恍霜详逝章咳嗽塑饼谱抑挫歇吉营劈寇蕉筒躁革遭泣浴搏碑茵蜡陌盲键粼霎录",
    "六年级下册": "挪蒸秧萎番锻雅勃旬熬蒜醋饺翡拌榛栗筝鞭麦寺逛籍屉怖瞅魔胖刑哼峻残"
  };

  /**
   * 笔画数分桶：STROKE_BUCKETS[i] 为笔画数等于 i 的所有汉字拼接字符串。
   * 数据来源：MakeMeAHani 开源项目 graphics.txt（strokes 数组长度即笔画数）。
   * 查找时遍历各桶，命中桶索引即为笔画数。
   * @type {string[]}
   */
  var STROKE_BUCKETS = ["","一","丁七乃九了二人儿入八几力十卜厂又","万丈三上下与个丸久么义之乞也习乡于亏亡亿兀凡千卫叉及口土士夕大女子寸小尸山川工已巾干广弓才门飞马","不丑专中丰为乌书予云互五井什仁仅仆仇今介从以允元公六内凶分切劝办匀化匹区升午厅历友双反天太夫孔少尤尺屯巨巴币幻开引心忆户手扎支文斤方无日曰月木欠止比毛氏气水火爪父片牙牛王见计认讥贝车邓长队风","世丘业丛东丝主乎乐仔他仗付仙代令仪们兰写冬出击功加务包匆北半占卡厉去发古句只叫召叮可台史右叶号司叹叼囚四圣处外央失头奶宁它对尼左巧市布平幼归必扑扒打扔旦旧本术正母民永汁汇汉灭犯瓜甘生用甩田由甲申电白皮目矛石示礼禾穴立纠艾节让训议记边辽闪饥鸟","丞丢买争亚交产仰件任份仿企伍伏伐休众优伙会伞伤似充先光全共关兴再军农冲决刑划刘则刚创劣动匠华协危压吁吃各合吉吊同名后吐向吓吗吸回因团在地场壮多夹她好如妄妆妇妈字存孙宅宇安寺寻导尖尘尽岁岂州巡帆师年并庄庆延异式当忙戏成扛执扩扫扬收早旬曲有朱朴朵机杀杂权次欢此死毕汗江池汤灯爷百竹米红级纪网羊羽老考耳肉肌臣自至舌舟色虫血行衣西观讲许论设访达迂迅过那闭问闯防阳阴阶页驮驰齐","两串丽亩伯估伴伸但位低住体何余佛作你克免兵况冶冷初删判别助努励劲劳医即却县君吞吟否吧吨吩含听启吴吵吹吻吼呀呈告呐员呜囫园困围囵址均坊坏坐坑块坚坛坝坠声壳妒妙妨宋完宏尾尿局屁层岔岖岛希帐床序库应弃弄弟张形彤役彻忌忍忘忧快怀我戒扭扰扳扶找技抄把抑抓投抖抗折抚抛抢护拒改攻旱时旷更杉李杏材村条来杨极步每求汪汽沃沙没泛灵灾灿牢状狂男盯矶社秀私究穷系纯纳纵纷纸纹纺肚肝肠良花苍苏补角言证识诉诊词谷豆贡财赤走足身辛迎运退还这进远违连迟邮邻里针闲间闷阻阿际饭饮驱鸡麦龟","丧乳事些享京佩佳使侄例侍供依侠侣侦侧侨兔其具典净凭凯刮到制刺刻剂势卖卷参叔取受变呢周味呻命咀咆和咏咐咚固国图坦坪垂备夜奇奉奋奔妮妹妻姆始姐姑姓委孟孤学宗官宙定宜实审居屈屉岭岷岸帕帘帜幸店庙庞废弦弧录彼往征径念态怕怖怜怦性怪怯或房所承披抱抵押抽拂担拆拉拌拍拔拖拘招拢拣拥拦拨择放斧斩昂昆昌明昏易昔朋服杭杯杰松板构林枚果枝枣枪枫柜欣欧武歧沫沮河沸治沾沿法泡波泣注泪泽浅炎炒爬爸版牧物狐狞玩现画畅的盲直知矿码秆空线练细织终绊绍经罗者肃股肢肤肩育肺胁舍艰苗苟若苦苹茁范茄茅茎虎表衫衬规觅视试诗诚话诞诣该详败账货贪贫贯转轮软迪迫述郁郊郎郑采金钓闹陌降限雨青非顶饰饱饲驶驻驼驾鱼齿","临举亭亮亲侮侯侵便促俏俗保信俩修养冒冠削前勃勇勉南卸厘咬咱咳咽哀品哇哈响哑哗哟哪型垒垫城复奏姨姹姿威娃娇孩客宣室将尝屋屎屏峡峦差巷帝带帮幽庭弯待很律怎怒思急怨总恍恢恨恰恼战扁拜括拴拼拾持挂指按挎挑挖挠挡挣挥挪挺政故施既星映春昨是昼枳架柄某柑柔柱柳柿标栋栏树残段毡泉洁洋洒洗洛洞津洪洲活洼洽测济浑浓炭炮炸点炼烂牲牵狠独狮珑甚界疯皆皇盆盈相盼盾眉看矩砍砖祖祝神秋种科秒穿突窃竖竿类籽绑绒结绘给络绝绞统缸罚美胃胆背胎胖胚胞胡胧脉茫茵茶荆草荐荒荡荧药虽虾蚁蚂袄要览觉诫语误诱诲说诵贴贵贺赵轻退送适选重钟钢钩钮闻阁陡院除险面革音项顺须食饵饶饺饼首香骂骆骨鬼鸥鸦","乘俯俱倍倒倘借倦值倾健党凄准凉剔剥剧原哨哭哮哲哺哼唇唉唐啊圆壶套娘娱害家容宽宾射峭峰峻席座徒恋恐恙息恶悄悔悟悦扇拳拿挚挨挫振挽捉捎捕捞损捡换捣敌料旁旅晌晒晓柴栗校株样核根格栽桂桃案桌桐桑桥桨殊泰浆浙浩浪浮浴海浸消涉涌润涨涩烈烘烛烤烦烧烫烬热爱特牺狸狼班瓶畔留畜疲疼疾病皱益盐监真眠破砸砾祥秘租秦秧积称窄站笑笔粉素索紧绢绣缺罢羞翁耕耗耸胯胶胸能脂脊脏致航般舰舱艳荷莞莫莱莲获莹虑蚊蚕衰袍袖被请诸诺读课谁调谊豹贼资赶起载较辱透逐递途逗通逛逝速造逢部都配酒钱钻铅阅陪陵陶陷难顾顿预饿验骏高鸭","偏做偶偷兽减凑剪副勒售唯唱唾啄商啦啪圈基堂堆堵婆婴寂寄寇崇崎崖崭巢常康庸廊弹彩得悉悠患您悬情惊惜惧惨惯捧据捶捷掀授掉掏排掘掠接控推掩描敏救教敛敝敢断旋族晚晨曹曼望梁梅梢梦梧梨梭梳欲毫涯液淋淌淘淡淮深混淹添清渔渠爽犁猎猛猜猪猫率球理甜略痒痕皎盒盖盗盘眯眷眺眼着睁祭祷祸移竟章笠符笨第笼粒粗粘累绩绪绳维绵绸绽绿聋职脖脯脸船菊菜菠萎萝营萨著虚蛇蛋袋袭谎谐谓谙象跃躯辆铛铜铲隆随雀雪领颇颈馆骑鸽鹿麻黄","傍剩割博厨喂善喉喘喜喷堡堤堪奠奥媚嫂富寓尊就属帽幅强悲惑惠惩惫惹愉愤愧掌插握揪揭援搀搁搂搜敞散敬斑斯普景晰晴晶智暂暑曾替最朝期棋棒棚森棵椅植款殖毯渡渣温港渲渴游湖湛湾湿溅溉滋焰牌猬猴琴番痛登短硝硬确禽程稍窜童等筋筑筒答筝紫缓缕编缘羡翔翘联脾腊腔舒艇落葛葬葱蛙蜒蜓街裁裂装裕裤谣谦谧赋赏赐赔趁超跌跑践辈逼遇遍道遗释量铺销锁锄锅锋锐阔隔隙雁雅集雇骚鲁黑","催傻像勤叠嗓嗡塌塑塞填媳嫌寝寞幕想愁愈意愚感慈慎搏搞搬摆摊新暇暖暗楚概榆歇殿毁源溜溢滚满滤滥滨滩漠煤照献瑕瑞瑟瑰痴睛督睬睹矮碍碑碗碰禁福稚窟简粮缝缠缤罩罪置群肆腭腮腰腹腾腿艄蒙蒜蒸蓑蓝蓬蛾裸触誊谨赖跟跤跨跪路跳跺输辞辟遥错锦键锯障零雷雹雾韵频魁魂鹊鼓鼠龄","嗽嘉境墙墟嫣嫩察寨幔愿慕慢截摔摘旗榛榨榴模歉歌漂漆演漾熄熊熬瑶疑瘦瞅碧稳竭端管粼精缩翠翡聚舔舞蔡蔼蔽蜡蜻蜿蝇裳裹谱豪貌赛辣遭遮酷酸锻颗魄鲜鼻","僵劈嘱嘲嘻嘿增墨影德慧慰懂撑撒撕撞播暴横橡毅潜潭潮潺澈澜熟磅磕稻稼稿箭箱篇糊翩膛膝蔬蕉蕴蝙蝠蝴蝶豫趟趣踏踢踩踪踮醉醋镇霄震霉靠鞋颜额飘黎","凝嘴器噩噪壁懒撼擂操擞整橘激燃燕磨窿篮糕糖薄融衡赞赠蹄辨辩避邀醒镜雕霎餐鲸默","徽戴擦朦檐燥瞧瞪瞬簇繁翼臀臂藏螺赢蹈蹋辫霜霞骤魏鳃","瀑璧瞻翻藕襟覆蹦鞭鹭鹰","攀爆瓣疆藻警蹲颤","嚷嚼灌籍耀躁魔","蠢露","","罐"];

  /* ===================== 工具函数 ===================== */

  /**
   * 按 id 获取 DOM 元素
   * @param {string} id - 元素 id
   * @returns {HTMLElement} 对应 DOM 元素
   */
  function $(id) { return document.getElementById(id); }

  /**
   * 简易 HTML 转义，防止数据中存在 < 等字符破坏结构
   * @param {string} s - 原始字符串
   * @returns {string} 转义后字符串
   */
  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c];
    });
  }

  /**
   * 获取一个汉字的拼音（声调符号形式）
   * 异常场景：pinyin-pro 未加载或字符非汉字时返回空字符串
   * @param {string} ch - 单个汉字
   * @returns {string} 拼音字符串（如 "mā"），无则返回 ""
   */
  function pinyinOf(ch) {
    var lib = window.pinyinPro;
    if (!lib || typeof lib.pinyin !== "function") return "";
    try {
      // multiple:true 返回所有多音字读音；取并用空格连接
      var arr = lib.pinyin(ch, { toneType: "symbol", multiple: true, type: "array" });
      if (Array.isArray(arr) && arr.length) return arr.join("  ");
      var s = lib.pinyin(ch, { toneType: "symbol" });
      return s == null ? "" : String(s);
    } catch (e) {
      return "";
    }
  }

  /**
   * 查询汉字笔画数
   * @param {string} ch - 单个汉字
   * @returns {number} 笔画数；未命中返回 0
   */
  function strokesOf(ch) {
    for (var i = 1; i < STROKE_BUCKETS.length; i++) {
      if (STROKE_BUCKETS[i] && STROKE_BUCKETS[i].indexOf(ch) >= 0) return i;
    }
    return 0;
  }

  /* ===================== 模块状态 ===================== */

  /** 册次键名顺序（含「全部」在首位） */
  var GRADE_ORDER = ["全部"].concat(Object.keys(GRADE_DATA));

  /** 当前选中的册次 */
  var activeGrade = "全部";

  /** 是否显示拼音 */
  var showPinyin = false;

  /** 字号等级配置：key -> [字号px, 网格单元最小宽度px, 显示名] */
  var FONT_LEVELS = {
    sm: [22, 56, "小"],
    md: [30, 66, "中"],
    lg: [40, 84, "大"],
    xl: [56, 110, "特大"]
  };
  var FONT_KEYS = ["sm", "md", "lg", "xl"];
  var fontKey = "md";

  /** 全屏预览当前索引（针对当前册次字列表） */
  var previewIndex = 0;

  /* ===================== 数据派生 ===================== */

  /**
   * 获取指定册次的字列表（数组形式）
   * 「全部」返回所有册次字按年级顺序去重后的合集
   * @param {string} grade - 册次名
   * @returns {string[]} 字符数组
   */
  function wordListOf(grade) {
    if (grade === "全部") {
      var seen = {}, out = [];
      for (var i = 1; i < GRADE_ORDER.length; i++) {
        var chars = GRADE_DATA[GRADE_ORDER[i]];
        for (var j = 0; j < chars.length; j++) {
          var c = chars[j];
          if (!seen[c]) { seen[c] = 1; out.push(c); }
        }
      }
      return out;
    }
    var s = GRADE_DATA[grade] || "";
    return s.split("");
  }

  /* ===================== 渲染 ===================== */

  /**
   * 渲染册次标签栏（含各册字数）
   */
  function renderTabs() {
    var html = GRADE_ORDER.map(function (g) {
      var n = wordListOf(g).length;
      var cls = "tab" + (g === activeGrade ? " active" : "");
      return '<button type="button" class="' + cls + '" data-grade="' + esc(g) + '">' +
        esc(g) + '<span class="tab-count">（' + n + '）</span></button>';
    }).join("");
    $("tabs").innerHTML = html;
  }

  /**
   * 应用当前字号等级到网格（CSS 变量驱动）
   */
  function applyFontLevel() {
    var cfg = FONT_LEVELS[fontKey];
    var grid = $("grid");
    grid.style.setProperty("--fs", cfg[0] + "px");
    grid.style.setProperty("--cell", cfg[1] + "px");
    $("fontValue").textContent = cfg[2];
  }

  /**
   * 渲染生字网格
   */
  function renderGrid() {
    var list = wordListOf(activeGrade);
    var html = list.map(function (c, i) {
      var py = showPinyin ? pinyinOf(c) : "";
      return '<div class="cell" data-i="' + i + '" title="点击查看详情，双击全屏展示">' +
        '<div class="py' + (showPinyin ? '' : ' hidden') + '">' + esc(py) + '</div>' +
        '<div class="ch">' + esc(c) + '</div>' +
        '<span class="zoom-ico">⤢</span>' +
        '</div>';
    }).join("");
    $("grid").innerHTML = html;
    $("empty").hidden = list.length > 0;
    $("countValue").textContent = list.length;
    $("gradeTitle").textContent = activeGrade + "生字列表（" + list.length + "）";
  }

  /**
   * 切换册次并重渲染
   * @param {string} g - 目标册次名
   */
  function selectGrade(g) {
    activeGrade = g;
    renderTabs();
    renderGrid();
  }

  /* ===================== 详情弹层 ===================== */

  /**
   * 打开单字详情弹层
   * @param {number} i - 在当前册次字列表中的索引
   */
  function openModal(i) {
    var list = wordListOf(activeGrade);
    var ch = list[i];
    if (!ch) return;
    $("modalChar").textContent = ch;
    $("modalPinyin").textContent = pinyinOf(ch) || "—";
    $("modalStrokes").textContent = strokesOf(ch) || "—";
    $("modalGrade").textContent = activeGrade;
    $("modalIndex").textContent = (i + 1) + " / " + list.length;

    // 弹层定位：本工具在 iframe 内被父页撑开到全文档高度，
    // position:absolute（见 .css #modal）按当前可见屏幕居中，
    // 避免 fixed 在 iframe 文档视口（=全文档）中心显示的问题
    var modal = $("modal");
    modal.style.top = window.scrollY + "px";
    modal.style.height = window.innerHeight + "px";

    modal.hidden = false;
    // 记录当前索引供「全屏展示」使用
    previewIndex = i;
  }

  /**
   * 关闭详情弹层
   */
  function closeModal() { $("modal").hidden = true; }

  /* ===================== 全屏大字预览 ===================== */

  /**
   * 打开全屏大字预览（课堂展示）
   * @param {number} i - 起始索引
   */
  function openPreview(i) {
    var list = wordListOf(activeGrade);
    if (!list.length) return;
    previewIndex = Math.max(0, Math.min(i, list.length - 1));
    updatePreview();
    $("preview").hidden = false;
  }

  /**
   * 刷新预览内容（字、拼音、册次、序号）
   */
  function updatePreview() {
    var list = wordListOf(activeGrade);
    var ch = list[previewIndex] || "";
    $("previewChar").textContent = ch;
    $("previewPinyin").textContent = ch ? pinyinOf(ch) : "";
    $("previewGrade").textContent = activeGrade;
    $("previewIndex").textContent = (previewIndex + 1);
    $("previewTotal").textContent = list.length;
  }

  /**
   * 关闭全屏预览
   */
  function closePreview() { $("preview").hidden = true; }

  /**
   * 预览翻页
   * @param {number} step - 步长（-1 上一个，+1 下一个）
   */
  function stepPreview(step) {
    var list = wordListOf(activeGrade);
    if (!list.length) return;
    previewIndex += step;
    if (previewIndex < 0) previewIndex = list.length - 1;
    if (previewIndex >= list.length) previewIndex = 0;
    updatePreview();
  }

  /* ===================== 浏览器全屏 API ===================== */

  /**
   * 切换浏览器全屏模式
   * 异常场景：Fullscreen API 不支持或被浏览器拦截时静默失败
   */
  function toggleFullscreen() {
    var el = document.documentElement;
    if (!document.fullscreenElement && !document.webkitFullscreenElement) {
      var req = el.requestFullscreen || el.webkitRequestFullscreen;
      if (req) req.call(el);
    } else {
      var ex = document.exitFullscreen || document.webkitExitFullscreen;
      if (ex) ex.call(document);
    }
  }

  /* ===================== 复制 ===================== */

  /**
   * 复制当前册次全部生字到剪贴板
   * 异常场景：navigator.clipboard 不可用时回退到 execCommand
   * @returns {void}
   */
  function copyCurrentGrade() {
    var text = wordListOf(activeGrade).join("");
    var done = function () { /* 复制成功可在此提示 */ };
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(done).catch(function () { legacyCopy(text); });
    } else {
      legacyCopy(text);
    }
  }

  /**
   * 兼容老浏览器的复制方案（textarea + execCommand）
   * @param {string} text - 待复制文本
   */
  function legacyCopy(text) {
    var ta = document.createElement("textarea");
    ta.value = text;
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    try { document.execCommand("copy"); } catch (e) {}
    document.body.removeChild(ta);
  }

  /* ===================== 事件绑定 ===================== */

  /**
   * 初始化所有事件监听
   */
  function bindEvents() {
    // 册次切换
    $("tabs").addEventListener("click", function (e) {
      var btn = e.target.closest(".tab");
      if (btn) selectGrade(btn.dataset.grade);
    });

    // 拼音开关
    $("pinyinToggle").addEventListener("change", function () {
      showPinyin = this.checked;
      renderGrid();
    });

    // 字号 +/-
    $("fontPlus").addEventListener("click", function () {
      var i = FONT_KEYS.indexOf(fontKey);
      if (i < FONT_KEYS.length - 1) { fontKey = FONT_KEYS[i + 1]; applyFontLevel(); }
    });
    $("fontMinus").addEventListener("click", function () {
      var i = FONT_KEYS.indexOf(fontKey);
      if (i > 0) { fontKey = FONT_KEYS[i - 1]; applyFontLevel(); }
    });

    // 网格点击：单击=详情，双击=全屏预览
    var clickTimer = null;
    $("grid").addEventListener("click", function (e) {
      var cell = e.target.closest(".cell");
      if (!cell) return;
      var idx = parseInt(cell.dataset.i, 10);
      if (isNaN(idx)) return;
      if (clickTimer) { // 第二次点击（双击）
        clearTimeout(clickTimer); clickTimer = null;
        openPreview(idx);
      } else {
        clickTimer = setTimeout(function () {
          clickTimer = null;
          openModal(idx);
        }, 260);
      }
    });

    // 复制
    $("copyBtn").addEventListener("click", copyCurrentGrade);

    // 顶栏全屏按钮
    $("fullscreenBtn").addEventListener("click", toggleFullscreen);

    // 详情弹层关闭
    $("modal").addEventListener("click", function (e) {
      if (e.target.hasAttribute("data-close")) closeModal();
    });

    // 全屏预览导航
    $("previewClose").addEventListener("click", closePreview);
    $("previewPrev").addEventListener("click", function () { stepPreview(-1); });
    $("previewNext").addEventListener("click", function () { stepPreview(1); });

    // 键盘：详情/预览打开时支持 ESC、← →
    document.addEventListener("keydown", function (e) {
      if (!$("preview").hidden) {
        if (e.key === "Escape") { closePreview(); e.preventDefault(); return; }
        if (e.key === "ArrowLeft" || e.key === "ArrowUp") { stepPreview(-1); e.preventDefault(); return; }
        if (e.key === "ArrowRight" || e.key === "ArrowDown") { stepPreview(1); e.preventDefault(); return; }
      }
      if (!$("modal").hidden && e.key === "Escape") { closeModal(); e.preventDefault(); }
      // 详情弹层按「→」直接进入全屏展示
      if (!$("modal").hidden && e.key === "Enter") { openPreview(previewIndex); e.preventDefault(); }
    });
  }

  /* ===================== 启动 ===================== */

  /**
   * 模块初始化入口
   */
  function init() {
    applyFontLevel();
    renderTabs();
    renderGrid();
    bindEvents();
  }

  init();
})();
