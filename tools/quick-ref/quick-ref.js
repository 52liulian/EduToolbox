/* ============================================================
 * EduToolbox · 学科常识速查表 quick-ref.js
 * 功能：六大类学科常识（单位换算 / 数学公式 / 物理常数 / 化学常识 /
 *       语文常识 / 英语不规则动词）关键词检索、高亮、小节折叠、
 *       单条·整节·整类一键复制、TXT 导出与打印
 * ============================================================ */
(function () {
  "use strict";

  var $ = function (id) { return document.getElementById(id); };
  var CAT_KEY = "edutoolbox.quick-ref.cat";

  /* ============================================================
   * 知识库数据：条目 { k: 名称, v: 内容, n: 备注 }
   * ============================================================ */
  var DATA = [
    /* ---------------- 单位换算 ---------------- */
    {
      id: "unit", icon: "📏", name: "单位换算",
      groups: [
        {
          name: "长度", items: [
            { k: "1 千米（km）", v: "= 1000 米（m）" },
            { k: "1 米（m）", v: "= 10 分米（dm）= 100 厘米（cm）= 1000 毫米（mm）" },
            { k: "1 毫米（mm）", v: "= 1000 微米（μm）= 10⁶ 纳米（nm）" },
            { k: "1 里", v: "= 500 米" },
            { k: "1 尺", v: "≈ 0.333 米（3 尺 = 1 米）" },
            { k: "1 英寸（in）", v: "= 2.54 厘米" },
            { k: "1 英尺（ft）", v: "= 30.48 厘米 = 12 英寸" },
            { k: "1 英里（mile）", v: "≈ 1.609 千米" },
            { k: "1 海里（n mile）", v: "= 1852 米" }
          ]
        },
        {
          name: "面积", items: [
            { k: "1 平方千米（km²）", v: "= 100 公顷 = 1 000 000 平方米" },
            { k: "1 公顷（ha）", v: "= 10 000 平方米 = 15 亩" },
            { k: "1 亩", v: "≈ 666.67 平方米" },
            { k: "1 平方米（m²）", v: "= 100 平方分米 = 10 000 平方厘米" }
          ]
        },
        {
          name: "体积与容积", items: [
            { k: "1 立方米（m³）", v: "= 1000 立方分米 = 1000 升（L）" },
            { k: "1 升（L）", v: "= 1 立方分米 = 1000 毫升（mL）" },
            { k: "1 毫升（mL）", v: "= 1 立方厘米（cm³）" }
          ]
        },
        {
          name: "质量", items: [
            { k: "1 吨（t）", v: "= 1000 千克（kg）" },
            { k: "1 千克（kg）", v: "= 1000 克（g）= 2 斤" },
            { k: "1 斤 / 1 两", v: "= 500 克 / = 50 克" },
            { k: "1 磅（lb）", v: "≈ 0.4536 千克" },
            { k: "1 盎司（oz）", v: "≈ 28.35 克" }
          ]
        },
        {
          name: "时间", items: [
            { k: "1 世纪 / 1 年", v: "= 100 年 / = 12 个月 = 365 天（闰年 366 天）" },
            { k: "1 日 / 1 时 / 1 分", v: "= 24 时 / = 60 分 / = 60 秒" },
            { k: "闰年判定", v: "能被 4 整除且不能被 100 整除，或能被 400 整除" }
          ]
        },
        {
          name: "温度与速度", items: [
            { k: "摄氏 → 华氏", v: "℉ = ℃ × 9/5 + 32" },
            { k: "华氏 → 摄氏", v: "℃ = (℉ − 32) × 5/9" },
            { k: "摄氏 → 开尔文", v: "K = ℃ + 273.15" },
            { k: "1 米/秒", v: "= 3.6 千米/时" },
            { k: "1 节（kn）", v: "= 1.852 千米/时" }
          ]
        }
      ]
    },

    /* ---------------- 数学公式 ---------------- */
    {
      id: "math", icon: "📐", name: "数学公式",
      groups: [
        {
          name: "乘法公式与因式分解", items: [
            { k: "完全平方（和）", v: "(a+b)² = a² + 2ab + b²" },
            { k: "完全平方（差）", v: "(a−b)² = a² − 2ab + b²" },
            { k: "平方差", v: "(a+b)(a−b) = a² − b²" },
            { k: "完全立方", v: "(a+b)³ = a³ + 3a²b + 3ab² + b³" },
            { k: "立方和", v: "a³ + b³ = (a+b)(a² − ab + b²)" },
            { k: "立方差", v: "a³ − b³ = (a−b)(a² + ab + b²)" }
          ]
        },
        {
          name: "方程", items: [
            { k: "一元二次求根", v: "x = (−b ± √(b²−4ac)) / 2a" },
            { k: "判别式 Δ", v: "= b² − 4ac；Δ>0 两不等实根，Δ=0 两相等实根，Δ<0 无实根" },
            { k: "韦达定理", v: "x₁ + x₂ = −b/a，x₁·x₂ = c/a" }
          ]
        },
        {
          name: "平面几何", items: [
            { k: "勾股定理", v: "a² + b² = c²（直角三角形两直角边与斜边）" },
            { k: "三角形面积", v: "S = ½ × 底 × 高" },
            { k: "平行四边形面积", v: "S = 底 × 高" },
            { k: "梯形面积", v: "S = ½ × (上底 + 下底) × 高" },
            { k: "圆的周长与面积", v: "C = 2πr = πd；S = πr²" },
            { k: "扇形面积", v: "S = nπr²/360 = ½ l r（l 为弧长）" }
          ]
        },
        {
          name: "立体几何", items: [
            { k: "长方体 / 正方体体积", v: "V = abc / V = a³" },
            { k: "圆柱", v: "V = πr²h；侧面积 S侧 = 2πrh" },
            { k: "圆锥", v: "V = ⅓ πr²h" },
            { k: "球", v: "V = 4/3 πr³；表面积 S = 4πr²" }
          ]
        },
        {
          name: "数列与计数", items: [
            { k: "等差数列", v: "an = a₁ + (n−1)d；Sn = n(a₁+an)/2" },
            { k: "等比数列", v: "an = a₁·qⁿ⁻¹；Sn = a₁(1−qⁿ)/(1−q)（q ≠ 1）" },
            { k: "排列 A(n,m)", v: "= n! / (n−m)!" },
            { k: "组合 C(n,m)", v: "= n! / [m!(n−m)!]" }
          ]
        },
        {
          name: "函数与三角", items: [
            { k: "指数运算", v: "aᵐ·aⁿ = aᵐ⁺ⁿ；(aᵐ)ⁿ = aᵐⁿ；(ab)ⁿ = aⁿbⁿ" },
            { k: "对数运算", v: "logₐ(MN) = logₐM + logₐN；logₐ(M/N) = logₐM − logₐN" },
            { k: "同角关系", v: "sin²α + cos²α = 1；tanα = sinα / cosα" },
            { k: "正弦定理", v: "a/sinA = b/sinB = c/sinC = 2R" },
            { k: "余弦定理", v: "a² = b² + c² − 2bc·cosA" }
          ]
        }
      ]
    },

    /* ---------------- 物理常数与公式 ---------------- */
    {
      id: "phys", icon: "🔭", name: "物理常数与公式",
      groups: [
        {
          name: "常用常数", items: [
            { k: "重力常数 g", v: "= 9.8 N/kg（粗略计算取 10 N/kg）" },
            { k: "真空中光速 c", v: "= 3.0 × 10⁸ m/s" },
            { k: "标准大气压 p₀", v: "= 1.013 × 10⁵ Pa（约 760 mmHg）" },
            { k: "水的密度 ρ水", v: "= 1.0 × 10³ kg/m³" },
            { k: "水的比热容 c水", v: "= 4.2 × 10³ J/(kg·℃)" },
            { k: "常见电压", v: "一节干电池 1.5 V；家庭电路 220 V；人体安全电压 ≤ 36 V" },
            { k: "常见温度", v: "标准大气压下水沸点 100 ℃；冰的熔点 0 ℃" },
            { k: "元电荷 e", v: "= 1.6 × 10⁻¹⁹ C" }
          ]
        },
        {
          name: "力学", items: [
            { k: "速度", v: "v = s / t" },
            { k: "密度", v: "ρ = m / V" },
            { k: "重力", v: "G = mg" },
            { k: "压强", v: "p = F / S（固体）；液体压强 p = ρgh" },
            { k: "浮力（阿基米德）", v: "F浮 = ρ液 · g · V排" },
            { k: "杠杆平衡", v: "F₁L₁ = F₂L₂" },
            { k: "功与功率", v: "W = Fs；P = W/t = Fv" },
            { k: "机械效率", v: "η = W有 / W总 × 100%" }
          ]
        },
        {
          name: "热学", items: [
            { k: "热量计算", v: "Q = cmΔt；吸热 Q吸 = cm(t−t₀)，放热 Q放 = cm(t₀−t)" },
            { k: "燃料燃烧放热", v: "Q = mq（固、液体）；Q = Vq（气体）" },
            { k: "热机效率", v: "η = W有 / Q放 × 100%" }
          ]
        },
        {
          name: "电学", items: [
            { k: "欧姆定律", v: "I = U / R" },
            { k: "电功与电功率", v: "W = UIt = Pt；P = UI = W/t" },
            { k: "焦耳定律", v: "Q = I²Rt" },
            { k: "串联电路", v: "I = I₁ = I₂；U = U₁ + U₂；R = R₁ + R₂" },
            { k: "并联电路", v: "U = U₁ = U₂；I = I₁ + I₂；1/R = 1/R₁ + 1/R₂" }
          ]
        },
        {
          name: "光学与声学", items: [
            { k: "光的反射", v: "反射角 = 入射角；三线共面、法线居中" },
            { k: "光的折射", v: "由空气斜射入水或玻璃时，折射角 < 入射角" },
            { k: "凸透镜成像", v: "1/f = 1/u + 1/v" },
            { k: "频率与周期", v: "f = 1/T；λ = vT = v/f" },
            { k: "声速", v: "15 ℃ 空气中 ≈ 340 m/s" }
          ]
        }
      ]
    },

    /* ---------------- 化学常识 ---------------- */
    {
      id: "chem", icon: "⚗️", name: "化学常识",
      groups: [
        {
          name: "常见元素化合价", items: [
            { k: "+1 价常见", v: "H、Na、K、Ag、NH₄（铵根）" },
            { k: "−1 价常见", v: "Cl、F、Br、I、OH、NO₃" },
            { k: "+2 价常见", v: "Ca、Mg、Ba、Zn" },
            { k: "−2 价常见", v: "O、S、SO₄、CO₃" },
            { k: "+3 价常见", v: "Al、Fe（铁还有 +2 价）" },
            { k: "常见变价元素", v: "C（+2、+4）、S（−2、+4、+6）、N（−3、+2、+4、+5）、Mn（+2、+4、+6、+7）、Cu（+1、+2）" },
            { k: "化合价口诀", v: "一价氢氯钾钠银，二价氧钙钡镁锌；三铝四硅五价磷，二三铁、二四碳，二四六硫都齐全，铜汞二价最常见" }
          ]
        },
        {
          name: "常见原子团（根）", items: [
            { k: "氢氧根 OH⁻", v: "−1 价" },
            { k: "硝酸根 NO₃⁻", v: "−1 价" },
            { k: "硫酸根 SO₄²⁻", v: "−2 价" },
            { k: "碳酸根 CO₃²⁻", v: "−2 价" },
            { k: "铵根 NH₄⁺", v: "+1 价" },
            { k: "磷酸根 PO₄³⁻", v: "−3 价" },
            { k: "高锰酸根 MnO₄⁻", v: "−1 价（碳酸氢根 HCO₃⁻ 也是 −1 价）" }
          ]
        },
        {
          name: "1～20 号元素", items: [
            { k: "1—5", v: "H 氢 · He 氦 · Li 锂 · Be 铍 · B 硼" },
            { k: "6—10", v: "C 碳 · N 氮 · O 氧 · F 氟 · Ne 氖" },
            { k: "11—15", v: "Na 钠 · Mg 镁 · Al 铝 · Si 硅 · P 磷" },
            { k: "16—20", v: "S 硫 · Cl 氯 · Ar 氩 · K 钾 · Ca 钙" }
          ]
        },
        {
          name: "常见物质与沉淀", items: [
            { k: "蓝色沉淀", v: "Cu(OH)₂ 氢氧化铜" },
            { k: "红褐色沉淀", v: "Fe(OH)₃ 氢氧化铁" },
            { k: "不溶于稀硝酸的白色沉淀", v: "BaSO₄ 硫酸钡、AgCl 氯化银" },
            { k: "溶于酸并放气的白色沉淀", v: "CaCO₃ 碳酸钙、BaCO₃ 碳酸钡" },
            { k: "溶液颜色", v: "CuSO₄ 蓝色 · FeCl₂ 浅绿色 · FeCl₃ 黄色 · KMnO₄ 紫红色" },
            { k: "CO₂ 检验", v: "通入澄清石灰水变浑浊（CO₂ + Ca(OH)₂ → CaCO₃↓ + H₂O）" },
            { k: "O₂ 检验与验满", v: "带火星木条伸入瓶中复燃；验满置于瓶口" }
          ]
        },
        {
          name: "化学之最", items: [
            { k: "空气成分", v: "N₂ 约 78%（最多）、O₂ 约 21%、稀有气体 0.94%" },
            { k: "地壳元素含量前四", v: "氧 O ＞ 硅 Si ＞ 铝 Al ＞ 铁 Fe" },
            { k: "最轻的气体", v: "H₂ 氢气" },
            { k: "天然最硬的物质", v: "金刚石（C）" },
            { k: "最简单的有机物", v: "甲烷 CH₄；最常用的溶剂是水 H₂O" }
          ]
        }
      ]
    },

    /* ---------------- 语文常识 ---------------- */
    {
      id: "chn", icon: "📖", name: "语文常识",
      groups: [
        {
          name: "修辞手法", items: [
            { k: "比喻", v: "用相似事物打比方，分明喻、暗喻、借喻" },
            { k: "拟人", v: "把物当人来写，赋予人的情感、动作" },
            { k: "夸张", v: "故意扩大或缩小事物特征以突出本质" },
            { k: "排比", v: "三个及以上结构相似、语气一致的句子连用" },
            { k: "对偶", v: "字数相等、结构相同、意义对称的两句" },
            { k: "反复", v: "重复使用同一词语或句子以强调" },
            { k: "设问", v: "自问自答，引起读者注意与思考" },
            { k: "反问", v: "用疑问形式表达确定意思，答案寓于问句" },
            { k: "借代", v: "用相关事物代替本体，如以「帆」代「船」" },
            { k: "其他常见", v: "引用、双关、反语、通感、对比、衬托" }
          ]
        },
        {
          name: "说明文知识", items: [
            { k: "说明方法", v: "举例子、列数字、作比较、打比方、下定义、分类别、作诠释、摹状貌、引资料" },
            { k: "说明顺序", v: "时间顺序、空间顺序、逻辑顺序（由主到次、由因到果、由现象到本质）" },
            { k: "语言特点", v: "准确、严密、科学；生动说明文亦讲求形象性" }
          ]
        },
        {
          name: "记叙文知识", items: [
            { k: "记叙六要素", v: "时间、地点、人物、起因、经过、结果" },
            { k: "记叙顺序", v: "顺叙、倒叙、插叙" },
            { k: "描写方法", v: "外貌、语言、动作、心理、神态描写；正面描写与侧面描写" },
            { k: "表达方式", v: "记叙、描写、抒情、议论、说明" },
            { k: "常见线索", v: "以人、以事、以物、以情、以时间为线索" }
          ]
        },
        {
          name: "病句常见类型", items: [
            { k: "成分残缺", v: "缺主语、缺谓语、缺宾语（常因滥用介词导致）" },
            { k: "搭配不当", v: "主谓、动宾、修饰语与中心语搭配不当" },
            { k: "语序不当", v: "多层定语/状语次序混乱，逻辑顺序颠倒" },
            { k: "重复啰嗦", v: "同义词语重复使用" },
            { k: "前后矛盾 / 否定不当", v: "如「防止不再发生」应删去「不」" },
            { k: "句式杂糅 / 歧义", v: "两种句式混用；一句话可作多种理解" }
          ]
        },
        {
          name: "文学文化常识", items: [
            { k: "四大名著", v: "《三国演义》罗贯中 ·《水浒传》施耐庵 ·《西游记》吴承恩 ·《红楼梦》曹雪芹" },
            { k: "四书五经", v: "四书：大学、中庸、论语、孟子；五经：诗、书、礼、易、春秋" },
            { k: "唐诗代表", v: "李白（浪漫主义）· 杜甫（现实主义）· 王维 · 白居易" },
            { k: "宋词流派", v: "豪放派：苏轼、辛弃疾；婉约派：柳永、李清照" },
            { k: "岁寒三友 / 花中四君子", v: "松、竹、梅 / 梅、兰、竹、菊" },
            { k: "敬辞", v: "令尊、令堂、惠顾、赐教、斧正、久仰、高见" },
            { k: "谦辞", v: "家父、家母、寒舍、拙作、见谅、犬子" }
          ]
        },
        {
          name: "标点符号要点", items: [
            { k: "顿号", v: "并列词语之间的停顿" },
            { k: "分号", v: "并列分句之间的停顿" },
            { k: "冒号", v: "提示下文或总结上文" },
            { k: "引号", v: "直接引用、特殊含义、着重指出、反语讽刺" },
            { k: "破折号", v: "解释说明、话题转换、声音延长" },
            { k: "省略号", v: "内容省略、语意未尽、说话断断续续" },
            { k: "书名号", v: "书名、篇名、报纸、刊物、文件名；课程与主题活动不用书名号" }
          ]
        }
      ]
    },

    /* ---------------- 英语不规则动词 ---------------- */
    {
      id: "eng", icon: "🔤", name: "英语不规则动词",
      groups: [
        {
          name: "A — C", items: [
            { k: "arise", v: "arose · arisen", n: "出现，发生" },
            { k: "am / is", v: "was · been", n: "是" },
            { k: "are", v: "were · been", n: "是" },
            { k: "bear", v: "bore · born", n: "忍受；出生" },
            { k: "beat", v: "beat · beaten", n: "击败，敲打" },
            { k: "become", v: "became · become", n: "变成" },
            { k: "begin", v: "began · begun", n: "开始" },
            { k: "bite", v: "bit · bitten", n: "咬" },
            { k: "blow", v: "blew · blown", n: "吹" },
            { k: "break", v: "broke · broken", n: "打破" },
            { k: "bring", v: "brought · brought", n: "带来" },
            { k: "build", v: "built · built", n: "建造" },
            { k: "burn", v: "burnt / burned · burnt / burned", n: "燃烧" },
            { k: "buy", v: "bought · bought", n: "买" },
            { k: "catch", v: "caught · caught", n: "抓住" },
            { k: "choose", v: "chose · chosen", n: "选择" },
            { k: "come", v: "came · come", n: "来" },
            { k: "cost", v: "cost · cost", n: "花费" },
            { k: "cut", v: "cut · cut", n: "切，割" }
          ]
        },
        {
          name: "D — G", items: [
            { k: "deal", v: "dealt · dealt", n: "处理，应对" },
            { k: "dig", v: "dug · dug", n: "挖" },
            { k: "do", v: "did · done", n: "做" },
            { k: "draw", v: "drew · drawn", n: "画，拉" },
            { k: "dream", v: "dreamt / dreamed · dreamt / dreamed", n: "做梦" },
            { k: "drink", v: "drank · drunk", n: "喝" },
            { k: "drive", v: "drove · driven", n: "驾驶" },
            { k: "eat", v: "ate · eaten", n: "吃" },
            { k: "fall", v: "fell · fallen", n: "落下" },
            { k: "feed", v: "fed · fed", n: "喂养" },
            { k: "feel", v: "felt · felt", n: "感觉" },
            { k: "fight", v: "fought · fought", n: "打架，战斗" },
            { k: "find", v: "found · found", n: "找到" },
            { k: "fly", v: "flew · flown", n: "飞" },
            { k: "forget", v: "forgot · forgotten", n: "忘记" },
            { k: "freeze", v: "froze · frozen", n: "冻结" },
            { k: "get", v: "got · got / gotten", n: "得到" },
            { k: "give", v: "gave · given", n: "给" },
            { k: "go", v: "went · gone", n: "去" },
            { k: "grow", v: "grew · grown", n: "生长，种植" }
          ]
        },
        {
          name: "H — L", items: [
            { k: "hang", v: "hung · hung", n: "悬挂" },
            { k: "have", v: "had · had", n: "有" },
            { k: "hear", v: "heard · heard", n: "听见" },
            { k: "hide", v: "hid · hidden", n: "隐藏" },
            { k: "hit", v: "hit · hit", n: "击打" },
            { k: "hold", v: "held · held", n: "握住，举行" },
            { k: "hurt", v: "hurt · hurt", n: "伤害" },
            { k: "keep", v: "kept · kept", n: "保持" },
            { k: "know", v: "knew · known", n: "知道" },
            { k: "lay", v: "laid · laid", n: "放置，下蛋（及物）" },
            { k: "lead", v: "led · led", n: "领导，带领" },
            { k: "learn", v: "learnt / learned · learnt / learned", n: "学习" },
            { k: "leave", v: "left · left", n: "离开，留下" },
            { k: "lend", v: "lent · lent", n: "借出" },
            { k: "let", v: "let · let", n: "让" },
            { k: "lie", v: "lay · lain", n: "躺，位于（不及物）" },
            { k: "lose", v: "lost · lost", n: "丢失" }
          ]
        },
        {
          name: "M — R", items: [
            { k: "make", v: "made · made", n: "制作，使" },
            { k: "mean", v: "meant · meant", n: "意思是" },
            { k: "meet", v: "met · met", n: "遇见" },
            { k: "pay", v: "paid · paid", n: "支付" },
            { k: "put", v: "put · put", n: "放" },
            { k: "read", v: "read · read", n: "读（读音变为 /red/）" },
            { k: "ride", v: "rode · ridden", n: "骑" },
            { k: "ring", v: "rang · rung", n: "响铃" },
            { k: "rise", v: "rose · risen", n: "升起（不及物）" },
            { k: "run", v: "ran · run", n: "跑" }
          ]
        },
        {
          name: "S — W", items: [
            { k: "say", v: "said · said", n: "说" },
            { k: "see", v: "saw · seen", n: "看见" },
            { k: "sell", v: "sold · sold", n: "卖" },
            { k: "send", v: "sent · sent", n: "发送" },
            { k: "set", v: "set · set", n: "设置，放置" },
            { k: "shake", v: "shook · shaken", n: "摇动" },
            { k: "shine", v: "shone · shone", n: "发光" },
            { k: "shoot", v: "shot · shot", n: "射击" },
            { k: "show", v: "showed · shown", n: "展示" },
            { k: "shut", v: "shut · shut", n: "关闭" },
            { k: "sing", v: "sang · sung", n: "唱" },
            { k: "sink", v: "sank · sunk", n: "下沉" },
            { k: "sit", v: "sat · sat", n: "坐" },
            { k: "sleep", v: "slept · slept", n: "睡觉" },
            { k: "speak", v: "spoke · spoken", n: "说话（某种语言）" },
            { k: "spend", v: "spent · spent", n: "花费" },
            { k: "stand", v: "stood · stood", n: "站" },
            { k: "steal", v: "stole · stolen", n: "偷" },
            { k: "swim", v: "swam · swum", n: "游泳" },
            { k: "take", v: "took · taken", n: "拿，取" },
            { k: "teach", v: "taught · taught", n: "教" },
            { k: "tell", v: "told · told", n: "告诉" },
            { k: "think", v: "thought · thought", n: "想，认为" },
            { k: "throw", v: "threw · thrown", n: "扔" },
            { k: "understand", v: "understood · understood", n: "理解" },
            { k: "wake", v: "woke · woken", n: "醒来" },
            { k: "wear", v: "wore · worn", n: "穿，戴" },
            { k: "win", v: "won · won", n: "赢" },
            { k: "write", v: "wrote · written", n: "写" }
          ]
        },
        {
          name: "易混辨析", items: [
            { k: "lie（躺）", v: "lay · lain", n: "不及物动词，后不接宾语" },
            { k: "lie（说谎）", v: "lied · lied", n: "规则变化，与「躺」不同" },
            { k: "lay（放置）", v: "laid · laid", n: "及物动词，后必须接宾语" },
            { k: "rise", v: "rose · risen", n: "升起（不及物，如太阳升起）" },
            { k: "raise", v: "raised · raised", n: "举起、提高（及物，规则变化）" },
            { k: "find / found", v: "found · found / founded · founded", n: "「找到」与「建立」过去式同形但过去分词不同" }
          ]
        }
      ]
    }
  ];

  /* ============================================================
   * 状态
   * ============================================================ */
  var state = {
    cat: "all",
    kw: "",
    collapsed: {}
  };

  /* ============================================================
   * 工具函数
   * ============================================================ */
  function toast(msg) {
    var t = $("toast");
    if (!t) return;
    t.textContent = msg;
    t.classList.add("show");
    clearTimeout(toast._t);
    toast._t = setTimeout(function () { t.classList.remove("show"); }, 1800);
  }

  function esc(s) {
    return String(s).replace(/[&<>]/g, function (c) {
      return c === "&" ? "&amp;" : (c === "<" ? "&lt;" : "&gt;");
    });
  }

  /* 关键词高亮：先按原文切片，再逐段转义，避免破坏标签 */
  function hlHtml(s, kw) {
    var t = String(s);
    if (!kw) return esc(t);
    var lk = kw.toLowerCase(), ls = t.toLowerCase();
    var out = "", i = 0;
    while (true) {
      var p = ls.indexOf(lk, i);
      if (p < 0) { out += esc(t.slice(i)); break; }
      out += esc(t.slice(i, p)) + "<mark>" + esc(t.slice(p, p + kw.length)) + "</mark>";
      i = p + kw.length;
    }
    return out;
  }

  function today() {
    var d = new Date(), p = function (n) { return n < 10 ? "0" + n : String(n); };
    return d.getFullYear() + "-" + p(d.getMonth() + 1) + "-" + p(d.getDate());
  }

  function itemText(it) {
    return it.k + (it.v ? "：" + it.v : "") + (it.n ? "（" + it.n + "）" : "");
  }

  function matchKw(cat, group, it) {
    var kw = state.kw;
    if (!kw) return true;
    var hay = (cat.name + " " + group.name + " " + it.k + " " + (it.v || "") + " " + (it.n || "")).toLowerCase();
    return hay.indexOf(kw) >= 0;
  }

  /* 当前应当渲染的分类（分类筛选） */
  function cats() {
    if (state.cat === "all") return DATA;
    return DATA.filter(function (c) { return c.id === state.cat; });
  }

  /* 命中结果：[{ cat, groups:[{ name, items:[] }] }] */
  function results() {
    var out = [];
    var list = cats();
    for (var i = 0; i < list.length; i++) {
      var cat = list[i], gs = [];
      for (var j = 0; j < cat.groups.length; j++) {
        var g = cat.groups[j];
        var items = g.items.filter(function (it) { return matchKw(cat, g, it); });
        if (items.length) gs.push({ name: g.name, items: items });
      }
      if (gs.length) out.push({ cat: cat, groups: gs });
    }
    return out;
  }

  function countAll() {
    var n = 0;
    for (var i = 0; i < DATA.length; i++) {
      for (var j = 0; j < DATA[i].groups.length; j++) n += DATA[i].groups[j].items.length;
    }
    return n;
  }

  function countGroups() {
    var n = 0;
    for (var i = 0; i < DATA.length; i++) n += DATA[i].groups.length;
    return n;
  }

  /* ============================================================
   * 渲染
   * ============================================================ */
  function render() {
    var res = results();
    var hit = 0;
    for (var i = 0; i < res.length; i++) {
      for (var j = 0; j < res[i].groups.length; j++) hit += res[i].groups[j].items.length;
    }

    $("statTotal").textContent = String(countAll());
    $("statHit").textContent = String(hit);
    $("statCats").textContent = String(DATA.length);
    $("statGroups").textContent = String(countGroups());
    $("stageOk").textContent = state.kw
      ? ("命中 " + hit + " 条 · 关键词「" + state.kw + "」")
      : ("共 " + hit + " 条");

    var wrap = $("listWrap");
    wrap.innerHTML = "";
    $("emptyState").hidden = hit > 0;

    for (var a = 0; a < res.length; a++) wrap.appendChild(section(res[a]));
  }

  function section(sec) {
    var cat = sec.cat;
    var total = 0;
    for (var i = 0; i < sec.groups.length; i++) total += sec.groups[i].items.length;

    var el = document.createElement("div");
    el.className = "qr-section" + (state.collapsed[cat.id] ? " collapsed" : "");

    /* 头部 */
    var head = document.createElement("div");
    head.className = "qr-sec-head";
    head.setAttribute("role", "button");
    head.setAttribute("tabindex", "0");

    var title = document.createElement("span");
    title.className = "qr-sec-title";
    title.textContent = cat.icon + " " + cat.name;

    var cnt = document.createElement("span");
    cnt.className = "qr-sec-count";
    cnt.textContent = total + " 条";

    var spacer = document.createElement("span");
    spacer.className = "qr-sec-spacer";

    var cp = document.createElement("button");
    cp.type = "button";
    cp.className = "qr-sec-btn";
    cp.textContent = "📋 复制本类";
    cp.addEventListener("click", function (e) {
      e.stopPropagation();
      copy(sectionText(sec), "已复制「" + cat.name + "」共 " + total + " 条");
    });

    var arrow = document.createElement("span");
    arrow.className = "qr-sec-arrow";
    arrow.textContent = "▼";

    head.appendChild(title);
    head.appendChild(cnt);
    head.appendChild(spacer);
    head.appendChild(cp);
    head.appendChild(arrow);

    var toggle = function () {
      state.collapsed[cat.id] = !state.collapsed[cat.id];
      el.classList.toggle("collapsed", !!state.collapsed[cat.id]);
    };
    head.addEventListener("click", toggle);
    head.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); toggle(); }
    });

    /* 主体 */
    var body = document.createElement("div");
    body.className = "qr-sec-body";
    for (var g = 0; g < sec.groups.length; g++) body.appendChild(groupBlock(sec.cat, sec.groups[g]));

    el.appendChild(head);
    el.appendChild(body);
    return el;
  }

  function groupBlock(cat, g) {
    var box = document.createElement("div");
    box.className = "qr-group";

    var gt = document.createElement("div");
    gt.className = "qr-group-title";
    gt.innerHTML = hlHtml(g.name, state.kw);
    box.appendChild(gt);

    for (var i = 0; i < g.items.length; i++) box.appendChild(row(g.items[i]));
    return box;
  }

  function row(it) {
    var el = document.createElement("div");
    el.className = "qr-row";

    var main = document.createElement("div");
    var k = document.createElement("div");
    k.className = "qr-k";
    k.innerHTML = hlHtml(it.k, state.kw);
    main.appendChild(k);

    if (it.v) {
      var v = document.createElement("div");
      v.className = "qr-v";
      v.innerHTML = hlHtml(it.v, state.kw);
      main.appendChild(v);
    }
    if (it.n) {
      var n = document.createElement("div");
      n.className = "qr-note";
      n.innerHTML = hlHtml(it.n, state.kw);
      main.appendChild(n);
    }

    var btn = document.createElement("button");
    btn.type = "button";
    btn.className = "qr-copy";
    btn.textContent = "复制";
    btn.addEventListener("click", function () {
      copy(itemText(it), "已复制：" + it.k);
    });

    el.appendChild(main);
    el.appendChild(btn);
    return el;
  }

  /* ============================================================
   * 文本导出
   * ============================================================ */
  function sectionText(sec) {
    var lines = ["【" + sec.cat.name + "】"];
    for (var i = 0; i < sec.groups.length; i++) {
      var g = sec.groups[i];
      lines.push("", "· " + g.name);
      for (var j = 0; j < g.items.length; j++) lines.push("  " + itemText(g.items[j]));
    }
    return lines.join("\n");
  }

  function allText() {
    var res = results();
    var hit = 0;
    for (var i = 0; i < res.length; i++) {
      for (var j = 0; j < res[i].groups.length; j++) hit += res[i].groups[j].items.length;
    }
    if (!hit) return "";
    var lines = ["学科常识速查表（共 " + hit + " 条" + (state.kw ? " · 关键词「" + state.kw + "」" : "") + "）"];
    for (var a = 0; a < res.length; a++) {
      lines.push("");
      lines.push(sectionText(res[a]));
    }
    return lines.join("\n");
  }

  /* ============================================================
   * 复制 / 下载 / 打印
   * ============================================================ */
  function copy(text, okMsg) {
    if (!text) { toast("没有可复制的内容"); return; }
    var done = function () { toast(okMsg || "已复制到剪贴板"); };
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(done, fallback);
        return;
      }
    } catch (e) { /* 忽略 */ }
    fallback();
    function fallback() {
      try {
        var ta = document.createElement("textarea");
        ta.value = text;
        ta.setAttribute("readonly", "");
        ta.style.position = "fixed";
        ta.style.opacity = "0";
        document.body.appendChild(ta);
        ta.select();
        document.execCommand("copy");
        document.body.removeChild(ta);
        done();
      } catch (e2) { toast("复制失败，请手动选中复制"); }
    }
  }

  function download() {
    var text = allText();
    if (!text) { toast("当前没有命中内容"); return; }
    try {
      var blob = new Blob(["\ufeff" + text], { type: "text/plain;charset=utf-8" });
      var url = URL.createObjectURL(blob);
      var a = document.createElement("a");
      a.href = url;
      a.download = "学科常识速查表_" + today() + ".txt";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(function () { URL.revokeObjectURL(url); }, 1500);
      toast("已导出速查表 TXT");
    } catch (e) { toast("导出失败，请使用「复制命中结果」"); }
  }

  /* ============================================================
   * 事件
   * ============================================================ */
  function chips(containerId, attr, onPick) {
    var box = $(containerId);
    box.querySelectorAll(".chip").forEach(function (c) {
      c.addEventListener("click", function () {
        var v = c.getAttribute(attr);
        box.querySelectorAll(".chip").forEach(function (x) { x.classList.remove("active"); });
        c.classList.add("active");
        onPick(v);
      });
    });
  }

  function syncCatChips() {
    $("catChips").querySelectorAll(".chip").forEach(function (c) {
      c.classList.toggle("active", c.getAttribute("data-cat") === state.cat);
    });
  }

  function bind() {

    chips("catChips", "data-cat", function (v) {
      state.cat = v;
      try { localStorage.setItem(CAT_KEY, v); } catch (e) { /* 忽略 */ }
      render();
    });

    $("searchInput").addEventListener("input", function () {
      state.kw = String(this.value || "").trim().toLowerCase();
      state.collapsed = {}; /* 搜索时自动展开全部命中项 */
      render();
    });

    $("btnExpand").addEventListener("click", function () { state.collapsed = {}; render(); });
    $("btnCollapse").addEventListener("click", function () {
      var m = {};
      for (var i = 0; i < DATA.length; i++) m[DATA[i].id] = true;
      state.collapsed = m;
      render();
    });

    $("btnCopy").addEventListener("click", function () {
      var text = allText();
      if (!text) { toast("当前没有命中内容"); return; }
      copy(text, "已复制全部命中结果");
    });
    $("btnDownload").addEventListener("click", download);
    $("btnPrint").addEventListener("click", function () {
      if (!$("listWrap").children.length) { toast("当前没有可打印的内容"); return; }
      try { window.print(); } catch (e) { toast("打印不可用，请用浏览器 Ctrl+P"); }
    });
    $("btnReset").addEventListener("click", function () {
      state.cat = "all";
      state.kw = "";
      state.collapsed = {};
      $("searchInput").value = "";
      syncCatChips();
      render();
      toast("已重置筛选");
    });
  }

  /* ---------- 初始化 ---------- */
  function init() {
    /* 舞台右上角工具栏（⛶ 舞台全屏 / ⚙ 隐藏设置），与随机叫号同构 */
    if (window.EduToolStageToolbar) {
      window.EduToolStageToolbar.init({ stage: ".stage-panel", panelHost: ".workbench", hiddenClass: "setup-hidden" });
    }
    try {
      var c = localStorage.getItem(CAT_KEY);
      if (c) {
        var ok = false;
        for (var i = 0; i < DATA.length; i++) if (DATA[i].id === c) ok = true;
        if (ok || c === "all") state.cat = c;
      }
    } catch (e) { /* 忽略 */ }

    bind();
    syncCatChips();
    render();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
