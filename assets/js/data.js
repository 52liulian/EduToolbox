/**
 * EduToolbox 数据层
 * ============================================================================
 * 数据结构：
 *   categories[{id, name, icon, desc, tools:[{name, desc, tags[], url, featured}]}]
 *   selfTools[{id, slug, name, icon, desc, ...}]
 *   articles[{title, tag, date, excerpt}]
 *
 * 整合说明：
 *   - 保留原有 16 个分类（AI/课件/组卷/直播/教育资源/教学管理/教师成长/学科资源等）
 *   - 追加 Excel 导入的 14 个新分类（公开课/教学资源/学术科研/演示文稿/音视频/办公等）
 *   - Excel「教学管理」7 个工具已并入原有教学管理分类
 *
 * 字段说明：
 *   - featured : 是否推荐（true 时进入首页精选推荐）
 *   - url      : 外链工具真实地址；旧分类暂为 "#" 占位，可逐步替换
 *
 * 后处理：文件末尾自动给 categories 内的 tool 附加 slug/catId/catName/catIcon
 * ============================================================================
 */
const DB = {
          categories: // 已清理死链 + 人工核验恢复
[
    {
      id: "opencourse", name: "公开课", icon: "🎓", desc: "国家级公开课、赛课直播、课堂实录与微课资源",
      tools: [
        {name:"国家智慧教育平台", desc:"教育部最新上线，课程全覆盖，教师成长必备", tags:["公开课"], url:"https://basic.smartedu.cn/"},
        {name:"研直播", desc:"全国各地大型赛课、教育讲座直播+回看", tags:["公开课", "直播"], url:"https://live.yanxiu.com/public/transfer?type=home"},
        {name:"人教社公开课", desc:"人民教育出版社的直播和公开课平台，权威", tags:["公开课", "直播"], url:"https://appti1qd2s44049.h5.xet.pomoho.com/p/decorate/homepage"},
        {name:"部优精品课", desc:"基础教育部级精品课", tags:["公开课"], url:"https://jpk.basic.smartedu.cn/"},
        {name:"网易公开课", desc:"教育类公开课视频", tags:["公开课", "视频"], url:"https://open.163.com"},
        {name:"职业教育智慧平台", desc:"教育部专门针对职业教育的平台", tags:["公开课"], url:"https://vocational.smartedu.cn/"},
        {name:"深圳教育云", desc:"各学段各学科教学视频", tags:["公开课", "视频"], url:"https://zy.szedu.cn/?ivk_sa=1024320u"},
        {name:"信息素养提升活动", desc:"全国教师信息素养提升活动", tags:["公开课"], url:"https://huodong.ncet.edu.cn/"},
        {name:"华渔杯微课", desc:"101PPT组织的华渔杯微课比赛，很多作品", tags:["公开课", "PPT", "视频"], url:"https://wk-hyb2022.ppt.101.com/#/award"},
        {name:"公开课直播", desc:"老师们可以免费在这儿看各地公开课", tags:["公开课", "免费", "直播"], url:"https://iclasscloud.cretech.cn/livecloudceshi/index.html"},
        {name:"青教赛视频", desc:"全国青教赛视屏", tags:["公开课", "视频"], url:"https://www.jkwwt.cn/previous-videos"},
        {name:"虚拟实验教学系统", desc:"国家级虚拟仿真实验教学平台，覆盖理工医文史等学科", tags:["公开课", "实验", "免费"], url:"https://vlab.eduyun.cn/"},
        {name:"阳光志愿", desc:"高考志愿填报参考系统", tags:["高考", "资源"], url:"https://gaokao.chsi.com.cn/zyck/"},
      ]
    },
    {
      id: "live", name: "录课直播", icon: "📹", desc: "直播课堂、录屏制作、视频会议、在线教学",
      tools: [
        {name:"钉钉直播", desc:"企业级直播，教育直播与在线课堂", tags:["直播", "课堂"], url:"https://www.dingtalk.com"},
        {name:"腾讯会议", desc:"视频会议，广泛用于在线教学", tags:["会议", "教学"], url:"https://meeting.tencent.com", featured:true},
        {name:"飞书会议", desc:"视频会议，屏幕共享与课程录制", tags:["会议", "录制"], url:"https://www.feishu.cn"},
        {name:"小鹅通直播助手", desc:"在线直播与录播，互动式网络授课", tags:["直播", "录播"], url:"https://www.xiaoe-tech.com"},
        {name:"OBS Studio", desc:"免费开源录屏与直播软件", tags:["录屏", "直播"], url:"https://obsproject.com"},
        {name:"Zoom", desc:"视频会议，远程教育与在线授课", tags:["会议", "远程"], url:"https://zoom.us"},
        {name:"Adobe Captivate", desc:"制作互动课程与教学视频", tags:["课程", "互动"], url:"https://www.adobe.com"},
        {name:"网易云课堂", desc:"在线课程直播与录制", tags:["课程", "在线"], url:"https://study.163.com"},
        {name:"oCam", desc:"小巧的录屏软件，只能录屏幕，不能录真人", tags:["录屏软件", "录屏"], url:"https://pan.baidu.com/share/init?surl=YV5htp7RT0ErG2m3S70JxQ&pwd=cfve"},
        {name:"Obs", desc:"录屏、直播神器，可抠绿幕、真人出镜", tags:["录屏软件", "录屏", "直播"], url:"https://www.aliyundrive.com/s/TNN4BcgYszA", featured:true},
        {name:"剪辑师", desc:"希沃出品的录屏软件，可以剪辑，做微课方便", tags:["录屏软件", "视频", "录屏"], url:"https://e.seewo.com/product/JJS"},
        {name:"万兴录演", desc:"可以用虚拟人像演示的录屏软件，录剪一体", tags:["录屏软件", "PPT", "录屏"], url:"https://democreator.wondershare.cn/activity/vip-44886.html"},
        {name:"OBS美颜插件", desc:"一个拓展obs的插件中心，可以让你录课、直播变得美美的", tags:["录屏软件", "录屏", "直播"], url:"https://www.aliyundrive.com/s/PVKU9Eif4Yh"},
        {name:"在线屏幕录制", desc:"在线屏幕录制", tags:["录屏软件", "录屏", "在线"], url:"https://toolwa.com/record/"},
        {name:"抖音直播伴侣", desc:"抖音直播软件，也可用于录屏", tags:["录屏软件", "录屏", "直播"], url:"https://streamingtool.douyin.com/"},
        {name:"万兴智演", desc:"一站式录课、Ai生成课", tags:["录屏软件", "AI", "录屏"], url:"https://zhiyan.wondershare.cn/active/invited-vip.html?share_code=1R93iBx0Pco&activity_id=1558670514800824383"},
        {name:"PixPin", desc:"免费的截图工具，可以截长图、录Gif", tags:["录屏软件", "免费", "录屏"], url:"https://pixpin.cn/"},
        {name:"Snap Camera", desc:"电脑摄像头美颜、虚拟化，真人出镜神器", tags:["录屏软件", "录屏"], url:"https://www.aliyundrive.com/s/cPcKMdKwjUJ"},
      ]
    },
    {
      id: "resource", name: "教学资源", icon: "📚", desc: "教案课件、电子教材、学科资源、题库组卷与考试测评",
      tools: [
        {name:"国家中小学智慧教育平台", desc:"国家级平台，覆盖各学科教学资源", tags:["国家", "资源"], url:"https://basic.smartedu.cn", featured:true},
        {name:"国家教育资源公共服务平台", desc:"全国教育资源共享，下载教学材料", tags:["国家", "资源"], url:"https://www.eduyun.cn"},
        {name:"中国大学 MOOC", desc:"高校 MOOC 课程，教学方法参考", tags:["MOOC", "课程"], url:"https://www.icourse163.org"},
        {name:"学堂在线", desc:"清华大学在线教育平台", tags:["课程", "在线"], url:"https://www.xuetangx.com"},
        {name:"中国国家数字图书馆", desc:"数字化教育资源，查阅参考", tags:["图书", "资源"], url:"https://www.nlc.cn"},
        {name:"学科网", desc:"国内知名的教育资源网站，提供各学科的教学资源、试题库和教学工具", tags:["学科资源", "题库"], url:"https://www.zxxk.com", featured:true},
        {name:"菁优网", desc:"专业的中小学题库和教学资源平台，提供各学科的习题、解析和教学资料", tags:["学科资源", "题库"], url:"https://www.jyeoo.com"},
        {name:"21世纪教育网", desc:"综合性教育资源平台，提供教案、课件、试卷等各类教学资源下载", tags:["学科资源", "PPT", "下载"], url:"https://www.21cnjy.com"},
        {name:"七彩课堂", desc:"七彩课堂配套教学资源，直接下载，无需登录注册", tags:["教学资源", "下载"], url:"https://www.timebook.cc/new/index.html"},
        {name:"状元大课堂", desc:"状元大课堂免费课件", tags:["教学资源", "PPT", "免费"], url:"https://www.wookey.cn/kjfl"},
        {name:"荣德基", desc:"点拔、典中典官方免费提供的课件", tags:["教学资源", "PPT", "免费"], url:"http://www.rudder.com.cn/index.html"},
        {name:"优翼网", desc:"有上课配套课件，教案，习题", tags:["教学资源", "PPT"], url:"https://yy.youyi800.com/web/"},
        {name:"实验空间", desc:"国家虚拟仿真实验教学课程共享平台", tags:["教学资源"], url:"https://www.ilab-x.com/"},
        {name:"有言3D视频", desc:"轻松制作3D微课视频", tags:["教学资源", "视频", "3D"], url:"https://www.youyan3d.com/"},
        {name:"拼音格子", desc:"部编版小学拼音、生字、词语免费生成和打印。", tags:["教学资源", "免费"], url:"https://pinyingezi.cn/"},
        {name:"松果AI备课", desc:"备课上课一体化、AI命题、丰富教学资源、搭建教育资源库", tags:["教学资源", "AI"], url:"https://i.songguoedu.com/register?code=ada8200d1af73ea6fcaac1eab706a50b9bc40a34f96dcb472027ff735ecca7e5eda3654629e3cbcd67cc492b3957b92ab6c59ac695e6517463b3790f2a61dafd69ffcfb0707d8aeedb66b916dd8647dcbb9575730973fbc6aefee04a4d3b2d12c6f9936a9903"},
        {name:"卡兜课堂游戏", desc:"卡兜提供大量互动游戏模版，可以快速制作课堂游戏。例如：女巫的毒药、狼人杀、对对碰等", tags:["教学资源"], url:"https://kadou.yuntika.com/"},
        {name:"人教社教材", desc:"人教版电子教材与配套资源", tags:["电子教材", "资源"], url:"https://jc.pep.com.cn/"},
        {name:"高考资源网", desc:"高考试卷、模拟题与复习资料", tags:["高考", "试卷"], url:"https://www.ks5u.com"},
        {name:"中考网", desc:"中考复习备考试题资源", tags:["中考", "试题"], url:"https://www.zhongkao.com"},
        {name:"题库网", desc:"全国中小学在线题库，免费组卷", tags:["题库", "免费"], url:"https://www.tiku.cn/"},
        {name:"育星教育网", desc:"提供各科教学资源，包括试题、课件、教案等，辅助教师教学。", tags:["试卷习题", "PPT", "题库"], url:"http://www.ht88.com/"},
        {name:"学科网组卷中心", desc:"学科网旗下专业组卷平台，海量优质试题资源，支持精准检索和快速组卷。覆盖K12全学段全学科，提供Word格式导出。", tags:["组卷网", "题库"], url:"https://zujuan.xkw.com/"},
        {name:"教习网组卷系统", desc:"为教师提供海量试题库和便捷的组卷工具。支持多种组卷方式，可按年级、学科、知识点快速组卷，自动生成答案解析。", tags:["组卷网", "题库"], url:"https://www.51jiaoxi.com/"},
        {name:"21世纪教育网组卷", desc:"21世纪教育网组卷系统", tags:["组卷", "题库"], url:"https://zujuan.21cnjy.com/"},
        {name:"古文岛", desc:"古诗词学习，注释、翻译、赏析", tags:["语文", "古诗"], url:"https://www.guwendao.net/", featured:true},
        {name:"汉典", desc:"权威汉语字典词典，汉字查询、成语典故", tags:["语文", "字典"], url:"https://www.zdic.net"},
        {name:"中小学生作文网", desc:"各年级作文范文、写作技巧", tags:["语文", "作文"], url:"https://www.zuowen.com"},
        {name:"书法字典", desc:"各书体汉字写法，书法教学", tags:["语文", "书法"], url:"https://www.shufazidian.com"},
        {name:"国学网", desc:"国学经典、传统文化教学资源", tags:["语文", "国学"], url:"http://www.guoxue.com"},
        {name:"汉语拼音网", desc:"拼音教学、声调练习、输入法学习", tags:["语文", "拼音"], url:"http://www.hanyupinyin.cn"},
        {name:"成语词典在线", desc:"成语查询、典故解释、成语接龙", tags:["语文", "成语"], url:"https://chengyu.t086.com"},
        {name:"有道词典", desc:"专业英语词典，单词、例句、发音、翻译", tags:["英语", "词典"], url:"https://dict.youdao.com"},
        {name:"金山词霸", desc:"经典英语学习，词典、背单词、口语", tags:["英语", "词典"], url:"http://www.iciba.com"},
        {name:"扇贝单词", desc:"科学记忆方法，个性化背单词计划", tags:["英语", "单词"], url:"https://www.shanbay.com"},
        {name:"百词斩", desc:"图像记忆背单词应用", tags:["英语", "单词"], url:"http://www.baicizhan.com"},
        {name:"可可英语", desc:"听力训练、口语练习、英语新闻", tags:["英语", "听力"], url:"http://www.kekenet.com"},
        {name:"沪江英语", desc:"在线课程、学习资料、考试辅导", tags:["英语", "课程"], url:"https://www.hjenglish.com"},
        {name:"英语语法网", desc:"语法规则、例句、练习题", tags:["英语", "语法"], url:"http://www.yygrammar.com"},
        {name:"英语听力室", desc:"各类听力材料与听力技巧", tags:["英语", "听力"], url:"http://www.tingroom.com"},
        {name:"GeoGebra", desc:"免费动态数学软件，几何代数统计微积分", tags:["数学", "几何"], url:"https://www.geogebra.org", featured:true},
        {name:"Desmos 图形计算器", desc:"在线图形计算器，函数绘图与建模", tags:["数学", "绘图"], url:"https://www.desmos.com/calculator"},
        {name:"Khan Academy", desc:"免费在线教育，高质量数学课程", tags:["数学", "课程"], url:"https://zh.khanacademy.org"},
        {name:"洋葱学园", desc:"趣味数学，动画视频讲解概念", tags:["数学", "趣味"], url:"https://yangcongxueyuan.com/applications/"},
        {name:"数学公式编辑器", desc:"在线公式编辑，支持 LaTeX", tags:["数学", "公式"], url:"https://www.latexlive.com"},
        {name:"Wolfram Alpha", desc:"数学计算知识引擎，方程求解、数据可视化", tags:["数学", "计算"], url:"https://www.wolframalpha.com"},
        {name:"PhET 互动仿真物理实验模拟", desc:"科罗拉多大学免费物理仿真实验", tags:["物理", "仿真"], url:"https://phet.colorado.edu/zh_CN", featured:true},
        {name:"学科网物理", desc:"物理课件、试题、教案、实验视频", tags:["物理", "资源"], url:"https://wl.zxxk.com"},
        {name:"猿辅导物理", desc:"在线教育平台的物理课程，提供物理知识点讲解和习题练习", tags:["物理资源", "在线", "课程"], url:"https://www.yuanfudao.com"},
        {name:"物理公式助手", desc:"基于 Wolfram Alpha 的物理公式查询与计算", tags:["物理", "计算"], url:"https://www.wolframalpha.com"},
        {name:"化学加", desc:"化学方程式、实验视频、知识点", tags:["化学", "方程"], url:"https://www.huaxuejia.cn"},
        {name:"学科网化学", desc:"化学课件、试题、教案、实验指导", tags:["化学", "资源"], url:"https://hx.zxxk.com"},
        {name:"化学元素周期表", desc:"互动元素周期表，元素性质查询", tags:["化学", "元素"], url:"https://www.ptable.com/?lang=zh"},
        {name:"学科网地理", desc:"地理课件、试题、教案、地图资料", tags:["地理", "资源"], url:"https://dl.zxxk.com"},
        {name:"学科网历史", desc:"历史课件、试题、教案、史料分析", tags:["历史", "资源"], url:"https://ls.zxxk.com"},
        {name:"中学历史教学园地", desc:"高质量的中学历史资源平台", tags:["历史资源", "试卷", "课程"], url:"https://www.zxls.com/index.html"},
      ]
    },
    {
      id: "management", name: "教学管理", icon: "🏫", desc: "班级管理、教学评价、家校沟通、教务系统与课堂互动工具",
      tools: [
        {name:"希沃班级优化大师", desc:"班级管理，学生行为与课堂互动", tags:["班级", "管理"], url:"https://class.seewo.com", featured:true},
        {name:"雨课堂", desc:"智慧教学，课前课中课后全流程", tags:["智慧", "流程"], url:"https://www.yuketang.cn"},
        {name:"小盒老师", desc:"AI 教学管理，智能批改与学情分析", tags:["AI", "管理"], url:"https://teacher.knowbox.cn"},
        {name:"校宝在线", desc:"一站式教育信息化，招生教务管理", tags:["教务", "招生"], url:"https://www.xiaobaoonline.com"},
        {name:"班级优化大师", desc:"班级管理神器，实时给学生打分与评价", tags:["教学管理"], url:"https://care.seewo.com/app/activity/download"},
        {name:"易查分", desc:"给学生一对一发放成绩，保护学生隐私", tags:["教学管理"], url:"https://www.yichafen.com/"},
        {name:"声波球", desc:"根据环境声音大小跳动的小球", tags:["教学管理"], url:"https://html5.44886.com/ball/"},
        {name:"ClassIsland", desc:"可以在一体机大屏顶部，显示一个条状的课表的小工具", tags:["教学管理"], url:"https://www.classisland.tech/"},
        {name:"icc", desc:"实用的屏幕批注软件，便捷在屏幕上书写", tags:["教学管理"], url:"https://github.com/InkCanvas/InkCanvasForClass"},
      ]
    },
    {
      id: "growth", name: "教师成长", icon: "🌱", desc: "教师培训、知识服务、专业成长、教研提升",
      tools: [
        {name:"得到 APP", desc:"知识服务，教育课程与职业发展", tags:["知识", "职业"], url:"https://www.igetget.com"},
        {name:"樊登读书", desc:"读书分享，教育书籍解读与成长", tags:["读书", "成长"], url:"https://www.dushu365.com"},
        {name:"混沌大学", desc:"创新教育，前沿教育理念培训", tags:["创新", "理念"], url:"https://www.hundun.cn"},
        {name:"三节课", desc:"互联网教育，教育科技与在线教学", tags:["教育", "科技"], url:"https://www.sanjieke.cn"},
        {name:"国家智慧教育平台", desc:"国家级平台，教师培训与教学资源", tags:["国家", "培训"], url:"https://www.smartedu.cn"},
        {name:"智慧树网", desc:"高校教师在线课程与教育培训", tags:["课程", "培训"], url:"https://www.zhihuishu.com"},
        {name:"超星学习通", desc:"教师专业发展与学术资源", tags:["学术", "发展"], url:"https://www.chaoxing.com"},
        {name:"慕课网", desc:"IT 技能学习，信息技术教师专业发展", tags:["IT", "技能"], url:"https://www.imooc.com"},
        {name:"学堂在线", desc:"清华大学发起的在线教育平台，提供教师专业发展课程", tags:["教师成长", "在线", "课程"], url:"https://www.xuetangx.com"},
        {name:"网易云课堂", desc:"提供教育类课程和专业发展资源，适合教师提升技能", tags:["教师成长", "课程"], url:"https://study.163.com"},
        {name:"极客时间", desc:"技术知识服务，前沿技术课程", tags:["技术", "科技"], url:"https://time.geekbang.org"},
      ]
    },
    {
      id: "assist", name: "教育辅助", icon: "🧰", desc: "公式编辑、思维导图、笔记管理、PPT课件制作与效率工具",
      tools: [
        {name:"Notion", desc:"笔记、任务管理、数据库，组织工作内容", tags:["笔记", "管理"], url:"https://www.notion.so", featured:true},
        {name:"MathType", desc:"专业数学公式编辑，制作课件与题目", tags:["数学", "公式"], url:"https://www.mathtype.cn"},
        {name:"Grammarly", desc:"英语语法检查，提升写作质量", tags:["英语", "语法"], url:"https://www.grammarly.com"},
        {name:"Anki", desc:"智能记忆卡片，提升学习效率", tags:["记忆", "学习"], url:"https://apps.ankiweb.net"},
        {name:"Mindomo", desc:"在线思维导图，知识结构图", tags:["思维导图", "知识"], url:"https://www.mindomo.com"},
        {name:"LaTeX在线编辑器 (Overleaf)", desc:"专为数学和科学教学提供的文档编辑工具，支持LaTeX语言", tags:["教育辅助", "在线"], url:"https://www.overleaf.com"},
        {name:"Canva", desc:"图形设计工具，丰富模板制作课件、海报", tags:["设计", "课件"], url:"https://www.canva.com", featured:true},
        {name:"Wolfram Alpha", desc:"知识计算引擎，数学与科学查询", tags:["计算", "科学"], url:"https://www.wolframalpha.com"},
        {name:"Quizlet", desc:"学习卡片与测验，多种学习模式", tags:["卡片", "测验"], url:"https://quizlet.com"},
        {name:"字帖生成", desc:"一键生成书法字帖", tags:["教学资源", "字体"], url:"https://www.babawar.com/shufa.html"},
        {name:"音乐打谱", desc:"在线制作音乐简谱的平台", tags:["教学资源", "音频", "在线"], url:"http://www.jianpu99.net/"},
        {name:"BoardMix 博思白板", desc:"在线白板，实时协作互动教学", tags:["白板", "协作"], url:"https://www.boardmix.cn"},
        {name:"优品 PPT", desc:"丰富 PPT 模板，涵盖各学科教学场景", tags:["PPT", "模板"], url:"https://www.ypppt.com"},
        {name:"希沃白板", desc:"强大的课件演示软件，多端同步", tags:["演示文稿", "PPT"], url:"https://easinote.seewo.com/"},
        {name:"第1PPT", desc:"ppt课件免费下载，无需登录注册", tags:["演示文稿", "PPT", "免费"], url:"https://www.1ppt.com/"},
        {name:"PPTPlus", desc:"微软官方的ppt模板站，免费下载模板", tags:["演示文稿", "PPT", "免费"], url:"https://www.officeplus.cn/"},
        {name:"101教育PPT", desc:"增强PPT功能，实现一键获取课件、备课", tags:["演示文稿", "PPT"], url:"https://ppt.101.com/", featured:true},
        {name:"爱PPT", desc:"永久免费的PPT模板下载网站.", tags:["演示文稿", "PPT", "免费"], url:"https://www.2ppt.com/"},
        {name:"鸿合π6", desc:"一站式教学课件演示软件，课件素材、动态课件、习题，快速组成课件", tags:["演示文稿", "PPT"], url:"https://pie.hitecloud.cn/pie"},
        {name:"AiPPT", desc:"Ai一键生成PPT", tags:["演示文稿", "AI", "PPT"], url:"https://www.aippt.cn/", featured:true},
        {name:"水豚鼠标助手", desc:"功能强大的屏幕演示工具", tags:["演示文稿", "PPT"], url:"https://shuitunapp.com/"},
        {name:"AboutPPT", desc:"一个几乎能满足所有PPT制作与学习需求的导航网站", tags:["演示文稿", "PPT"], url:"https://www.aboutppt.com/"},
      ]
    },
    {
      id: "academic", name: "学术科研", icon: "🔬", desc: "免费文献下载、学术加速与论文资源",
      tools: [
        {name:"浙江图书馆", desc:"可以借用浙江图书馆免费下载知网的文献", tags:["学术科研", "免费", "下载"], url:"https://www.zjlib.cn/#searchs_1_div"},
        {name:"有道学术加速", desc:"有道云笔记提供的学术加速服务", tags:["学术科研"], url:"https://note.youdao.com/scholar.html"},
        {name:"广西图书馆", desc:"提供丰富的学术资源、电子图书与公开讲座", tags:["学术科研", "免费", "下载"], url:"https://www.gxlib.org.cn/"},
        {name:"国家哲学社会科学文献中心", desc:"能搜到的哲学社科论文全部免费下载", tags:["学术科研", "免费", "下载"], url:"https://www.ncpssd.org/index.aspx"},
        {name:"南京图书馆", desc:"南京图书馆在线资源平台", tags:["学术科研", "免费"], url:"http://www.jslib.org.cn/"},
      ]
    },
    {
      id: "download", name: "资源下载", icon: "⬇️", desc: "教材下载、文档资源、学习资料平台",
      tools: [
        {name:"中小学课本网", desc:"中小学电子教材在线阅读与下载", tags:["教材", "电子"], url:"https://www.kebenwang.cn"},
        {name:"学习强国", desc:"丰富学习资源与教育内容", tags:["资源", "学习"], url:"https://www.xuexi.cn"},
        {name:"豆丁网", desc:"教育类文档资源下载", tags:["文档", "下载"], url:"https://www.docin.com"},
        {name:"道客巴巴", desc:"在线文档分享，教育资源与材料", tags:["文档", "分享"], url:"https://www.doc88.com"},
        {name:"中国大学MOOC", desc:"高质量的在线课程平台，提供大学级别的教育资源", tags:["资源下载", "下载", "在线"], url:"https://www.icourse163.org"},
        {name:"猿辅导", desc:"在线教育，数学课程、题库、学习方案", tags:["数学", "课程"], url:"https://www.yuanfudao.com"},
        {name:"小猿搜题", desc:"拍照搜题，详细解答与解题步骤", tags:["数学", "搜题"], url:"https://www.yuansouti.com"},
        {name:"作业帮", desc:"专业的在线作业平台，提供作业、成绩、评价等功能", tags:["作业", "平台"], url:"https://zyb.zuoyebang.com/"},
      ]
    },
    {
      id: "materials", name: "素材资源", icon: "🎨", desc: "视频素材、商用字体、纸张定制等创作素材",
      tools: [
        {name:"黑罐头", desc:"抖音推出的视频剪辑素材平台，素材丰富", tags:["素材资源", "视频"], url:"https://www.heycan.com/material#all"},
        {name:"资源猫", desc:"资源猫", tags:["素材资源"], url:"https://www.ziyuanm.com/zywz/"},
        {name:"免费商用字体", desc:"免费可商用的字体一键下载", tags:["素材资源", "免费", "下载"], url:"https://font.sucai999.com/"},
        {name:"凹凸",desc:"一款专业的在线生成模拟手写稿件工具",tags:["手写模拟"],url:"https://www.autohanding.com/"},
        {name:"纸由我", desc:"打造一个人人都能轻松使用的纸张定制平台，让创意不再受限于现成的模板。无论你是学生、教师、设计师还是办公人士，都能找到或创建最适合自己需求的纸张。", tags:["素材资源", "图片", "模板"], url:"https://paperme.toolooz.com/"},
      ]
    },
    {
      id: "audio", name: "音频处理", icon: "🎵", desc: "文字转语音、音频剪辑、人声分离与音效下载",
      tools: [
        {name:"文本转语音", desc:"微软超强的文本转语音工具，接近真人", tags:["音频处理", "音频"], url:"https://speech.microsoft.com/audiocontentcreation", featured:true},
        {name:"网易见外", desc:"音频转文本、文档翻译、字幕生成", tags:["音频处理", "音频"], url:"https://jianwai.youdao.com/"},
        {name:"Spleeter", desc:"超强的人声和伴奏分离软件", tags:["音频处理", "音频"], url:"https://www.aliyundrive.com/s/tmthTvfQ3M5"},
        {name:"天音", desc:"网易推出的Ai自动创作音乐的平台，不懂音乐的人也能拥有自己的音乐了", tags:["音频处理", "AI", "音频"], url:"https://tianyin.163.com/"},
        {name:"音效下载", desc:"制作ppt或微课时可以下载上面的各种声音效果", tags:["音频处理", "PPT", "视频"], url:"https://sc.chinaz.com/yinxiao/"},
        {name:"音乐解密", desc:"音乐软件下载后加密的音乐，一键解密", tags:["音频处理", "音频", "下载"], url:"https://unlock-music.liumingye.cn/"},
        {name:"放屁音乐", desc:"免费在线听歌、在线下载音乐", tags:["音频处理", "免费", "音频"], url:"https://www.fangpi.net/"},
        {name:"在线音频编辑", desc:"在线音频编辑神器", tags:["音频处理", "在线"], url:"https://vocalremover.org/"},
        {name:"vocalremover", desc:"音频伴奏提取、变调变速、合成", tags:["音频处理", "免费"], url:"https://vocalremover.org/zh/"},
      ]
    },
    {
      id: "image", name: "图像处理", icon: "🖼️", desc: "抠图压缩、在线 PS、AI 放大与设计工具",
      tools: [
        {name:"Caesium", desc:"一键批量压缩图片，释放电脑空间", tags:["图像处理", "图片"], url:"https://pan.baidu.com/share/init?surl=k5CIAS7pgyNbC9ib-41bsQ&pwd=aa37"},
        {name:"稿定PS", desc:"在线ps工具，无需下载也能ps图片", tags:["图像处理", "图片", "下载"], url:"https://ps.gaoding.com/"},
        {name:"魔猴3D", desc:"在线3D建模，创客教师必备", tags:["图像处理", "图片", "3D"], url:"http://www.mohou.com/tools"},
        {name:"稿定拼图", desc:"电脑在线拼图，无需下载软件", tags:["图像处理", "图片", "下载"], url:"https://www.gaoding.com/editor/design?mode=open_external_file&from=local&action_extension=create_puzzle&action_extension_params=%7B%22command%22:%22open%22%7D"},
        {name:"改图鸭", desc:"图片压缩编辑改大小", tags:["图像处理", "图片"], url:"https://www.gaituya.com/"},
        {name:"在线抠图", desc:"自动去除图片背景", tags:["图像处理", "图片", "在线"], url:"https://www.remove.bg/zh", featured:true},
        {name:"图压", desc:"mac上强大的图片压缩软件", tags:["图像处理", "图片"], url:"https://tuya.xinxiao.tech/"},
        {name:"佐糖AI抠图", desc:"一键抠图, 更换背景,移除水印等. 另外还提供图片裁剪, 压缩,高清修复", tags:["图像处理", "AI", "图片"], url:"https://picwish.cn/?apptype=aps-pin"},
        {name:"美术字", desc:"免费字体设计", tags:["图像处理", "免费", "图片"], url:"http://www.meishuzi.cn/"},
        {name:"图片去背景", desc:"一键去除图片中的背景", tags:["图像处理", "图片"], url:"https://www.fococlipping.com/"},
        {name:"AI人工智能图片放大", desc:"清晰化图片", tags:["图像处理", "AI", "图片"], url:"https://bigjpg.com/"},
        {name:"Hama", desc:"一键涂抹掉图片上不要的内容", tags:["图像处理", "图片"], url:"https://www.hama.app/"},
        {name:"一键抠图", desc:"免费的一键抠图", tags:["图像处理", "免费", "图片"], url:"https://koukoukou.cn/"},
        {name:"稿定设计", desc:"一站式在线作图神器", tags:["图像处理", "图片", "在线"], url:"https://www.gaoding.com/?hmsr=bukeng-bukeng-gd--gd-gd-bdqd&utm_source=bukeng"},
        {name:"在线PS", desc:"PS软件网页版 ，小白用户易上手！", tags:["图像处理", "图片", "在线"], url:"https://www.gaoding.com/editor/ps?hmsr=bukeng-bukeng-ps--ps-ps-bdqd&utm_source=bukeng"},
        {name:"Polyhaven", desc:"免版权的360全景图", tags:["图像处理", "图片"], url:"https://polyhaven.com/hdris"},
        {name:"canva可画", desc:"在线图片生成、海报制作", tags:["图像处理", "图片", "模板"], url:"https://www.canva.cn", featured:true},
        {name:"千图网", desc:"PPT 模板、海报、图标、矢量图素材", tags:["素材", "PPT"], url:"https://www.58pic.com"},
      ]
    },
    {
      id: "video", name: "视频处理", icon: "🎬", desc: "视频剪辑、压缩转码、去水印与解析下载",
      tools: [       
        {name:"必剪", desc:"Bilibili推出的视频剪辑软件，素材多", tags:["视频处理", "视频"], url:"http://bcut.drawyoo.com/"},
        {name:"剪映", desc:"抖音推出的视频剪辑软件，素材多，全免费", tags:["视频处理", "免费", "视频"], url:"https://www.capcut.cn/", featured:true},
        {name:"shotcut", desc:"开源的视频剪辑软件，完全免费", tags:["视频处理", "免费", "视频"], url:"https://www.shotcut.org/"},
        {name:"小丸工具箱", desc:"B站定制版小丸工具箱，压缩视频神器", tags:["视频处理", "视频"], url:"https://www.aliyundrive.com/s/KJUJrYAgK2q"},
        {name:"Moo0视频压缩", desc:"免费、简洁、强大的视频转码压缩小工具", tags:["视频处理", "免费", "视频"], url:"https://pan.quark.cn/s/a28a4a5c8a15"},
        {name:"万能视频解析", desc:"可以下载1000+平台的视频、图片、音频等", tags:["视频处理", "视频", "音频"], url:"https://snapany.com/zh"},
        {name:"GreenVideo", desc:"全网视频在线解析下载，神器！", tags:["视频处理", "视频", "下载"], url:"https://greenvideo.cc/youtube"},
        {name:"万彩动画大师", desc:"拖动鼠标就能制作卡通动画，入门简单", tags:["动画制作"], url:"http://www.animiz.cn/download/"},
      ]
    },
    {
      id: "security", name: "安全软件", icon: "🛡️", desc: "杀毒拦截弹窗、系统重装与电脑维护",
      tools: [
        {name:"火绒安全", desc:"目前比较良心的杀毒软件，有效拦截弹窗", tags:["安全软件"], url:"https://www.huorong.cn/person5.html", featured:true},
        {name:"装个机", desc:"重装系统全流程，教程+工具", tags:["安全软件"], url:"https://zhuangit.ababtools.com/"},
      ]
    },
    {
      id: "mindmap", name: "思维与创作", icon: "🧠", desc: "思维导图、流程图、知识库与内容创作",
      tools: [
        {name:"GitMind 思维导图", desc:"免费思维导图，组织教学内容、规划课程", tags:["思维导图", "课程"], url:"https://gitmind.cn"},
        {name:"ZhiMap", desc:"免费思维导图，比收费的还好用", tags:["思维与创作", "免费", "思维导图"], url:"https://zhimap.com/"},
        {name:"ProcessOn", desc:"免费在线流程图思维导图，功能较全", tags:["思维与创作", "免费", "思维导图"], url:"https://www.processon.com/", featured:true},
        {name:"百度脑图", desc:"百度公司的在线版思维导图，界面清爽", tags:["思维与创作", "思维导图", "在线"], url:"https://naotu.baidu.com/"},
        {name:"知犀思维导图", desc:"思维创造，积累每一个灵感的瞬间", tags:["思维与创作", "思维导图"], url:"https://www.zhixi.com/"},
        {name:"Draw.io", desc:"免费开源的流程图工具，非常强大", tags:["思维与创作", "免费", "思维导图"], url:"https://app.diagrams.net/"},
        {name:"树图", desc:"拥有超多模板的思维导图、知识库", tags:["思维导图", "模板"], url:"https://shutu.cn/?from=bukeng"},
        {name:"一图读懂", desc:"输入链接自动总结并生成一图读懂海报", tags:["图片", "AI"], url:"https://stepchat.cn/textposter"},
      ]
    },
    {
      id: "office", name: "实用办公工具", icon: "🧰", desc: "PDF 转换、文件处理、格式转换等办公效率神器",
      tools: [
        {name:"Office最新版", desc:"一键部署任何版本的Office套件", tags:["实用办公工具"], url:"https://otp.landian.vip/zh-cn/download.html"},
        {name:"wps政府版", desc:"政府没有广告版的wps，很纯净", tags:["实用办公工具", "图片"], url:"https://www.aliyundrive.com/s/n6nNW24n72J"},
        {name:"微能力工具箱", desc:"提升工程2.0三十个能力点必备的工具集合", tags:["实用办公工具"], url:"https://www.aliyundrive.com/s/TfdwLKUFGAJ"},
        {name:"光速搜索", desc:"飞快的速度搜索电脑中的文件，秒出结果", tags:["实用办公工具"], url:"https://www.aliyundrive.com/s/FVUaSDcjwtk"},
        {name:"文件批量改名", desc:"一键给目录下的文件改名，可自定义编号", tags:["实用办公工具"], url:"https://www.aliyundrive.com/s/3mLv5Rd4sLH"},
        {name:"Datavrap", desc:"数据可视化工具，制作数据变动视频", tags:["实用办公工具", "视频"], url:"https://www.datavrap.com/"},
        {name:"视频连线", desc:"在线视频聊天（会议），一键开启", tags:["实用办公工具", "视频", "在线"], url:"https://brie.fi/ng"},
        {name:"文本处理", desc:"文字也能变出花样来，很多对文字处理的小工具", tags:["实用办公工具"], url:"https://www.txttool.com/"},
        {name:"Pdf转换", desc:"PDF转word、PPT或其它格式", tags:["实用办公工具", "PPT", "PDF"], url:"https://www.aconvert.com/pdf/"},
        {name:"文档免费下载", desc:"免费下载百度文库、道客巴巴、豆丁网文档", tags:["实用办公工具", "免费", "下载"], url:"https://imwcr.cn/api/GetDocumentText/"},
        {name:"OK插件", desc:"提升PPT制作效率", tags:["实用办公工具", "PPT"], url:"http://www.oktools.xyz/"},
        {name:"Utools", desc:"一个汇集了无数小工具插件的软件，一键启动", tags:["实用办公工具"], url:"https://www.u-tools.cn/index.html"},
        {name:"HelloWindows", desc:"下载正版系统，办公软件，带激活工具", tags:["实用办公工具", "下载"], url:"https://hellowindows.cn/"},
        {name:"各种转换", desc:"PDF转Word等各种常见格式转换，办公小工具", tags:["实用办公工具", "PDF"], url:"https://www.alltoall.net/"},
        {name:"XLSX转VCF", desc:"电子表格转通讯录文件", tags:["实用办公工具"], url:"https://xlsx2vcf.kefuxx.com/"},
        {name:"打字、单词练习站", desc:"开源、免费的练习单词和练习打字的网站", tags:["实用办公工具", "免费"], url:"https://qwerty.kaiyi.cool/"},
        {name:"坚果云收集箱", desc:"轻松收集别人发来的文件", tags:["实用办公工具"], url:"https://workspace.jianguoyun.com/inbox/"},
        {name:"文叔叔", desc:"不限速发文件、收文件", tags:["实用办公工具"], url:"https://www.wenshushu.cn/"},
        {name:"PDF去文字水印", desc:"去除PPT中嵌入图片上的文字水印~", tags:["实用办公工具", "PPT", "PDF"], url:"http://www.pdfdo.com/pdf-delete-text.aspx"},
        {name:"TyniWoW", desc:"PDF、图片、文档无数工具集合", tags:["实用办公工具", "PDF", "图片"], url:"https://tinywow.com/"},
      ]
    },
    {
      id: "plugin", name: "Office插件", icon: "🔌", desc: "Word/PPT 插件，自动排版与智能设计",
      tools: [
        {name:"不坑盒子", desc:"强大的Office插件，自动排版、智能写作", tags:["Office插件"], url:"https://www.bukenghezi.com/", featured:true},
        {name:"ok插件", desc:"非常强大的ppt设计类插件", tags:["Office插件", "PPT", "图片"], url:"http://oktools.xyz/"},
        {name:"Eastar", desc:"新生的强大PPT插件，专业制作PPT", tags:["Office插件", "PPT"], url:"https://44886.lanzouw.com/iYon41shofyf"},
        {name:"方方格子", desc:"一个基于Excel的方方格子插件，用于创建和管理方方格子", tags:["Office插件", "方方格子"], url:"http://www.ffcell.com/home/ffcell.aspx"},
      ]
    },
  ],

  // 自研免费工具（本地运行，无后端）
  selfTools: [
    {id:"random-call", slug:"random-call", name:"随机叫号", icon:"📢", desc:"滚动动画随机叫号，适合课堂随机提问", features:["🎲 滚动动画","🔢 范围设置","📋 已叫记录","🖥️ 大屏"]},
    {id:"random-lottery", slug:"random-lottery", name:"随机抽签系统", icon:"🎰", desc:"转盘式随机抽签系统，适合各类抽奖与随机选择场景", features:["🎡 转盘动画","✏️ 自定义选项","🏆 随机结果","🖥️ 全屏"]},
    {id:"rollcall", slug:"rollcall", name:"随机点名器", icon:"🎲", desc:"名单导入、滚动动画、语音朗读，课堂提问神器", features:["📋 名单导入","🎲 滚动动画","🔊 语音朗读","⌨️ 快捷键","🔒 本地运行"]},
    {id:"rolldraw", slug:"random-draw", name:"随机抽签器", icon:"🎲", desc:"名单导入、随机抽签、语音朗读，课堂提问神器", features:["📋 名单导入","🎲 随机抽签","🔊 语音朗读","⌨️ 快捷键","🔒 本地运行"]},
    {id:"seat", slug:"seat-generator", name:"座位表生成器", icon:"🪑", desc:"设置行列、随机排座、拖拽交换位置", features:["🎲 随机排座","🖱️ 拖拽调整","🔢 灵活行列","🔒 本地运行"]},
    {id:"answercard", slug:"answercard", name:"答题卡生成器", icon:"📄", desc:"设置题量，生成标准机读答题卡", features:["📝 单选/多选","🖨️ 打印友好","🔢 题量灵活","🔒 本地运行"]},
    {id:"text-diff", slug:"text-diff", name:"文本差异对比", icon:"🔍", desc:"快速比对两段文本的差异，高亮显示新增、删除和修改内容", features:["🔍 文本对比","🟢 新增/删除高亮","📄 按行/词/字"]},
    {id:"word-counter", slug:"word-counter", name:"在线字数统计", icon:"📝", desc:"实时统计中文字数、英文字符、段落数，支持排除标点与空格", features:["🔢 中文字数","🔤 英文字符","📊 段落统计","🚫 排除标点"]},
    {id:"qr-generator", slug:"qr-generator", name:"二维码生成器", icon:"📱", desc:"支持文本、链接转换，可自定义颜色和 Logo，高清下载", features:["🎨 自定义颜色","🖼️ 支持 Logo","📏 多尺寸","⬇️ PNG 下载"]},
    {id:"group-maker", slug:"random-group", name:"随机分组工具", icon:"👥", desc:"一键快速分组，支持按组数或人数分配，适合小组讨论", features:["🎲 随机分组","👫 按组/按人数","⚖️ 性别平衡","📋 复制结果"]},
    {id:"timer", slug:"timer", name:"课堂倒计时", icon:"⏱️", desc:"专为课堂设计的倒计时工具，全屏显示、多种提示音效", features:["⏱️ 自定义时长","📊 进度圆环","🔔 结束提示","🖥️ 全屏模式"]},
    {id:"pinyin-annotator", slug:"pinyin-annotator", name:"拼音标注", icon:"🔤", desc:"自动为汉字标注拼音，支持声调符号/数字/无声调多种样式", features:["🔤 自动注音","🎵 多种声调","📐 上方/侧注","📋 复制 HTML"]},
    {id:"certificate-generator", slug:"certificate-generator", name:"在线奖状生成器", icon:"🏆", desc:"多种精美模板，支持自定义内容与电子印章，一键下载 PNG", features:["🎨 6 种模板","✏️ 自定义内容","🔴 电子印章","⬇️ PNG 下载"]},
    {id:"scrolling-text", slug:"scrolling-text", name:"早读滚动", icon:"📖", desc:"文本从下往上滚动展示，适合课堂投影和学生跟读", features:["📜 滚动文字","🎨 字号/颜色","⚡ 调速","🖥️ 全屏"]},
    {id:"paragraph-scroll", slug:"paragraph-scroll", name:"段落滚动", icon:"📜", desc:"逐段切换展示，类似歌词提词，适合朗读和演讲", features:["📝 逐段切换","⏱️ 停留时长","🎨 字号/颜色","🖥️ 全屏"]},
    {id:"temp-board", slug:"temp-board", name:"课堂记录板", icon:"📋", desc:"快速记录课堂要点、作业安排，支持清空与全屏", features:["✏️ 快速记录","💾 本地保存","🗑️ 一键清空","🖥️ 全屏展示"]},
    {id:"random-shuffle", slug:"random-shuffle", name:"随机打乱", icon:"🔀", desc:"一键随机打乱名单顺序，适用于点名、轮流发言", features:["🎲 随机洗牌","🔢 带序号","📋 复制结果"]},
    {id:"stopwatch", slug:"stopwatch", name:"秒表", icon:"⏱️", desc:"课堂活动计时秒表，支持计次与重置", features:["⏱️ 毫秒精度","📊 计次记录","⏸️ 暂停/继续","♻️ 重置"]},
    {id:"alarm-clock", slug:"alarm-clock", name:"课堂闹钟", icon:"⏰", desc:"设置多个提醒时间，到点自动响铃提醒", features:["🔔 多闹钟","🔊 响铃提醒","📝 自定义文字","💾 本地保存"]},
    {id:"multi-timer", slug:"multi-timer", name:"多定时器", icon:"⏲️", desc:"同时管理多个倒计时，为不同教学环节分别计时", features:["⏲️ 多倒计时","🔔 到点提醒","➕ 加减时长","🗑️ 删除"]},
    {id:"pomodoro", slug:"pomodoro", name:"番茄钟", icon:"🍅", desc:"专注与休息交替，提升课堂专注力", features:["🍅 专注25分","☕ 短休5分","😴 长休15分","📊 完成统计"]},
    {id:"gaokao-countdown", slug:"gaokao-countdown", name:"高考倒计时", icon:"🎓", desc:"距离高考实时倒计时，适合教室投影展示", features:["📅 自动计算","⏰ 实时更新","🖥️ 全屏投影","🔢 天/时/分/秒"]},
    {id:"zhongkao-countdown", slug:"zhongkao-countdown", name:"中考倒计时", icon:"📚", desc:"距离中考实时倒计时，适合教室投影展示", features:["📅 自动计算","⏰ 实时更新","🖥️ 全屏投影","🔢 天/时/分/秒"]},
    {id:"week-calendar", slug:"week-calendar", name:"学期日历", icon:"📅", desc:"设置开学日期，自动计算教学周次，高亮本周", features:["📅 自动排周","🔆 高亮本周","📊 周次概览","💾 记住设置"]},
    {id:"turntable", slug:"turntable", name:"转盘抽选", icon:"🎡", desc:"转盘形式随机抽选，动画展示直观有趣", features:["🎡 转盘动画","🎨 多色分区","✏️ 自定义选项","🏆 随机结果"]},
    {id:"random-question", slug:"random-question", name:"随机抽题", icon:"🎯", desc:"批量导入题目，滚动动画随机抽取，支持答案", features:["🎲 滚动动画","❓ 题目+答案","📋 批量导入","⚡ 快速抽取"]},
    {id:"chouti-2", slug:"chouti-2", name:"大屏滚动抽题", icon:"🎲", desc:"超大数字滚动动画抽号，揭晓题目与答案", features:["📺 大屏设计","🔢 滚动抽号","💡 揭晓答案","🖥️ 全屏"]},
    {id:"chouti-3", slug:"chouti-3", name:"滚动抽题(无答案)", icon:"🎲", desc:"无答案版滚动抽题，直接展示标题内容", features:["📺 大屏设计","🔢 滚动抽号","📝 仅标题","🖥️ 全屏"]},
    {id:"chouti-4", slug:"chouti-4", name:"滚动抽题(多题)", icon:"🎲", desc:"一次随机抽取多道题，不重复", features:["📺 大屏设计","🔢 一次多题","🚫 不重复","🖥️ 全屏"]},
    {id:"scoreboard", slug:"scoreboard", name:"积分板", icon:"🏆", desc:"队伍加分扣分，实时排行榜，前三名高亮", features:["➕ 加分","➖ 扣分","📊 自动排序","🥇 前三名"]},
    {id:"quick-answer", slug:"quick-answer", name:"在线抢答", icon:"🚨", desc:"点击或数字键抢答，记录抢答顺序", features:["⌨️ 键盘抢答","🚨 动画反馈","📋 抢答记录","♻️ 重置"]},
    {id:"recitation-screen", slug:"recitation-screen", name:"背诵记录大屏", icon:"📖", desc:"导入学号姓名，点击切换已背诵状态，投屏展示", features:["📥 CSV导入","✅ 状态切换","📊 大屏展示","📤 导出记录"]},
    {id:"exam-seat", slug:"exam-seat-generator", name:"考试座位安排", icon:"🪑", desc:"导入考生名单，随机排座，支持打印", features:["📥 CSV导入","🎲 随机排座","🖨️ 打印","🔢 自定义列数"]},
    {id:"noise-meter", slug:"noise-meter", name:"噪音计", icon:"🔊", desc:"实时检测课堂音量，超出阈值自动提醒", features:["🎤 麦克风检测","📊 实时分贝","⚠️ 阈值提醒","🔴 超阈值动画"]},
    {id:"quiet-meter", slug:"quiet-meter", name:"安静值", icon:"🤫", desc:"实时监测课堂安静程度，可视化反馈", features:["🎤 实时检测","⭕ 圆环可视化","🔢 安静值评分","🟢 状态提示"]},
    {id:"morning-reading-meter", slug:"morning-reading-meter", name:"早读检测", icon:"📢", desc:"检测早读声音强度，波形可视化鼓励朗读", features:["🎤 实时检测","📊 波形动画","🔢 强度评分","📢 鼓励朗读"]},
    {id:"99table", slug:"99table", name:"九九乘法表", icon:"✖️", desc:"九九乘法口诀表，支持完整/三角布局与打印", features:["🔢 9×9口诀","📐 完整/三角","📏 字号调节","🖨️ 打印"]},
    {id:"common-2500-hanzi", slug:"common-2500-hanzi", name:"常用2500汉字表", icon:"📚", desc:"常用汉字查询学习，支持搜索与拼音展示", features:["🔍 搜索汉字","🔤 拼音标注","📋 复制","📚 常用字表"]},
    {id:"primary-grade-hanzi", slug:"primary-grade-hanzi", name:"小学生字表", icon:"📖", desc:"小学各年级生字表，按年级切换查看", features:["🎓 1-6年级","📖 生字展示","🔢 字数统计","🖱️ 点击查看"]},
    {id:"pinyin-worksheet", slug:"pinyin-worksheet", name:"看拼音写词语", icon:"📝", desc:"输入词语生成拼音填空练习，可打印", features:["🔤 自动注音","🙈 隐藏汉字","📐 自定义列数","🖨️ 打印练习"]},
    {id:"stroke-order", slug:"stroke-order", name:"生字田字格练习", icon:"✏️", desc:"生成田字格练字纸，支持示范字与练习次数", features:["✏️ 田字格","👀 示范字","🔢 练习次数","🖨️ 打印"]},
    {id:"name-sticker", slug:"name-sticker", name:"学生姓名贴", icon:"🏷️", desc:"批量生成可打印姓名贴纸，自定义样式", features:["👥 批量生成","🎨 自定义颜色","📏 字号调节","🖨️ 打印"]},
    {id:"teacher-calendar", slug:"teacher-calendar", name:"教师工作日历", icon:"📅", desc:"按周展示每日日期，高亮本周，支持打印", features:["📅 按周日历","🔆 高亮本周","📆 每日日期","🖨️ 打印"]},
    {id:"handwrite", slug:"handwrite", name:"手写转换工具", icon:"✍️", desc:"上传 Word/PDF/纯文字，模拟手写笔迹生成文稿，本地导出 PDF", features:["✍️ 6 款手写字体","📄 Word/PDF 导入","🎨 纸张/字距/倾斜","⬇️ 导出 PDF"]},
    {id:"paper-convert", slug:"paper-convert", name:"试卷格式转换", icon:"📐", desc:"Word 试卷 A3 与 A4 一键互转，自动调整分栏与页边距", features:["📐 A3⇄A4","📑 分栏自适应","📦 批量转换","🔒 本地处理"]},
    {id:"excel-merge", slug:"excel-merge", name:"表格数据处理", icon:"📊", desc:"多张不同字段的 Excel 合为一张，自由选择字段后导出", features:["📊 多表合并","🧩 按列名智能匹配","✏️ 自定义字段","⬇️ 导出 XLSX"]},
    {id:"pdf-image-convert", slug:"pdf-image-convert", name:"PDF与图片转换", icon:"📄", desc:"PDF 转 JPG/PNG 图片、多张图片合成为 PDF，双向互转", features:["📄 PDF→图片","🖼️ 图片→PDF","🔍 1-3 倍清晰度","📦 多页打包"]},
    {id:"word-extract", slug:"word-extract", name:"生词提取", icon:"📝", desc:"从 Word 生词表提取词语，保留单元与园地结构，导出 Excel", features:["📥 读取 Word","🗂️ 单元/园地分组","🔤 可选拼音列","⬇️ 导出 Excel"]},
    {id:"kinder-comment", slug:"kinder-comment", name:"幼儿园评语生成", icon:"🌈", desc:"在园表现、生活能力等 10 维度，批量生成暖心幼儿评语", features:["🌈 10 类维度","👶 童化语气","📋 批量生成","📤 Word/Excel 导出"]},
    {id:"primary-comment", slug:"primary-comment", name:"小学评语生成", icon:"🌱", desc:"品德、学习、阅读、劳动等维度，批量生成小学期末评语", features:["🌱 10 类维度","📚 小学定制","📋 批量生成","📤 Word/Excel 导出"]},
    {id:"junior-comment", slug:"junior-comment", name:"初中评语生成", icon:"📘", desc:"学科表现、思维方法、集体责任等维度，批量生成初中评语", features:["📘 10 类维度","🎯 初中定制","📋 批量生成","📤 Word/Excel 导出"]},
    {id:"senior-comment", slug:"senior-comment", name:"高中评语生成", icon:"🎓", desc:"学习品质、思维深度、生涯规划等维度，批量生成高中评语", features:["🎓 10 类维度","🚀 高中定制","📋 批量生成","📤 Word/Excel 导出"]},
    {id:"formula-editor", slug:"formula-editor", name:"LaTeX公式编辑器", icon:"🧮", desc:"可视化编辑数理化复杂公式，实时渲染，导出图片或代码", features:["🧮 实时渲染","🔣 符号面板","📚 内置示例","⬇️ PNG 导出"]},
    {id:"function-graph", slug:"function-graph", name:"函数绘图", icon:"📈", desc:"绘制各类函数图像，支持多函数叠加、缩放平移与导出", features:["📈 多函数叠加","🔍 缩放平移","🧮 三角/指数/对数","⬇️ PNG 导出"]},
    {id:"formula-preview", slug:"formula-preview", name:"公式预览", icon:"🧪", desc:"30 个数理化公式模板，填参数实时计算并联动函数图像", features:["🧪 30 个模板","#️⃣ 参数实时计算","📈 联动图像","📋 复制公式"]},
    {id:"countdown-timer", slug:"countdown-timer", name:"极简倒计时", icon:"⏳", desc:"深色大屏倒计时，常用时长预设，最后 10 秒声音提醒", features:["⏳ 极简大屏","⚡ 10 档预设","🔔 结尾提示音","🖥️ 全屏模式"]},
  ],

  // 教学工具资讯文章
  articles: [
    {title:"2026 随机点名器推荐：专为课堂教学设计的在线随机点名工具", tag:"课堂互动", date:"2026-08", excerpt:"系统覆盖学生名单导入、本轮不重复、已点名记录、大屏展示、免注册打开即用，以及随机抽人、小组抽签、口语练习、作业检查等典型用途。"},
    {title:"2026 答题卡生成器推荐：3 个在线答题卡制作工具网站整理", tag:"考试考评", date:"2026-07", excerpt:"围绕答题卡生成器、在线答题卡制作、机读答题卡排版等需求，整理 3 个常见答题卡制作网站，帮你快速找到合适工具。"},
    {title:"关于「AI 评语会同质化」的官方说明：并不是模板堆砌", tag:"自研工具", date:"2026-06", excerpt:"回应 AI 评语同质化、无法局部修改、不适合中文环境、数据隐私等常见误解，阐述多维度定制与浏览器本地处理机制。"},
    {title:"幼儿园评语怎么写更快更暖心？评语生成器使用指南 2026", tag:"自研工具", date:"2026-05", excerpt:"面向小班、中班、大班期末评语、成长手册、图文评语模板、Word/Excel 导出、Excel 批量导入等真实场景。"},
    {title:"座位表生成器使用指南：快速完成班级排座、考试排座与讨论课安排", tag:"自研工具", date:"2026-04", excerpt:"涵盖日常调座、考试排座、U 型座位、环形研讨、小组围桌、Excel 名单导入、随机排座、拖拽调整与高清导出。"},
    {title:"证书生成器哪个好用？2026 在线证书生成器横向评测与推荐", tag:"工具评测", date:"2026-03", excerpt:"从证书类型、模板数量、电子盖章、批量下载、价格、隐私 6 个维度横向评测主流在线证书生成器。"},
    {title:"教师期末评语快速生成：个性评语工具推荐 2026", tag:"自研工具", date:"2026-02", excerpt:"支持幼儿园、小学、中学三大模式，20+ 评价维度自由组合，内置名言金句，批量导出 Word/Excel，浏览器本地处理。"},
    {title:"在线奖状生成器：7 大专业模板批量制作奖状证书", tag:"自研工具", date:"2026-01", excerpt:"提供 7 种专业奖状模板，支持批量制作学生奖状、企业证书、培训结业证，浏览器本地处理保护隐私。"},
    {title:"2026 教育在线工具及导航网站全面介绍：为什么教师需要纯净导航", tag:"行业观察", date:"2025-12", excerpt:"解析教育在线工具与导航网站发展趋势，如何通过纯净收录规则与 AI 辅助工具库，实现备课、考评与课堂互动效率翻倍。"},
    {title:"2026 专业在线拼音标注工具指南：兼容 WPS/Word、智能多音字识别", tag:"语文工具", date:"2025-11", excerpt:"支持智能多音字识别、兼容 WPS/Word 排版、动态间距调整，带声调、数字声调、无声调多种格式，语文老师课件制作必备。"},
  ]
};

/**
 * 后处理：给 categories 内的 tool 附加 slug/catId/catName/catIcon 字段
 * slug 规则：`${catId}-${index+1}`，保证全局唯一
 */
DB.categories.forEach(cat => {
  cat.tools.forEach((t, i) => {
    t.slug = `${cat.id}-${i + 1}`;
    t.catId = cat.id;
    t.catName = cat.name;
    t.catIcon = cat.icon;
  });
});

/**
 * 精选推荐合集：自研工具（优先）+ 外链工具 featured 合并
 * 首页"⭐ 精选推荐"区块直接使用此数组
 */
DB.featuredAll = [
  ...DB.selfTools.filter(t => t.featured).map(t => ({
    ...t,
    kind: "self",
    catName: "自研免费",
    catIcon: "🛠️",
    route: `/onlinetools/${t.slug}`,
    tags: ["本地运行", "隐私保护"],
  })),
  ...DB.categories.flatMap(cat => cat.tools
    .filter(t => t.featured)
    .map(t => ({
      ...t,
      kind: "external",
      route: `/tool/${t.slug}`,
    }))
  ),
];

// 暴露到全局：其他模块（render / search / router）通过 DB 访问
globalThis.DB = DB;
if (typeof global !== "undefined") global.DB = DB;
