/* ============================================================
 * 融会贯通 · 同类项目与资源推荐
 * 全网搜集与 math-mastery 定位相近的可视化数学学习项目
 * ============================================================ */
(function () {
  "use strict";

  // 分类：可视化引擎 / 开源学习项目 / 商业/课程参考 / 资源聚合
  window.RELATED_PROJECTS = [
    {
      category: "可视化数学引擎",
      desc: "这些工具能把抽象的公式变成可拖动、可观察的图像，是老师和学生做课件、探究规律的神器。",
      items: [
        {
          name: "Manim",
          url: "https://github.com/3b1b/manim",
          cnUrl: "https://docs.manim.org.cn",
          tags: ["Python", "动画引擎", "3Blue1Brown"],
          summary: "3Blue1Brown 开源的数学动画引擎，用代码就能生成像科普视频一样精美的数学动画。",
          why: "和「初中动图数学」广告里呈现的动画效果最像；想把题目讲成视频时，它是业界标杆。"
        },
        {
          name: "Manim-Web",
          url: "https://github.com/maloyan/manim-web",
          cnUrl: "https://maloyan.github.io/manim-web/examples",
          tags: ["TypeScript", "浏览器", "零安装"],
          summary: "Manim 的 TypeScript 移植版，完全在浏览器里跑 60fps 数学动画，不用装 Python、FFmpeg、LaTeX。",
          why: "最接近 math-mastery「纯前端、离线可用」的理念，可直接嵌到网页里。"
        },
        {
          name: "GeoGebra",
          url: "https://www.geogebra.org",
          tags: ["动态几何", "跨平台", "免费"],
          summary: "全球老师用得最多的动态数学软件，几何、代数、统计、3D 绘图一锅端。",
          why: "视频中「拖动点看图形变化」的效果，GeoGebra 是最成熟的实现。"
        },
        {
          name: "Desmos",
          url: "https://www.desmos.com",
          tags: ["函数图像", "在线", "课堂互动"],
          summary: "界面极简洁的在线图形计算器，输入函数即时出图，滑动条调参数实时看变化。",
          why: "讲函数性质、解方程可视化时零门槛，手机和电脑都能用。"
        },
        {
          name: "网络画板",
          url: "https://www.netpad.net.cn",
          tags: ["国产", "网页", "课堂互动"],
          summary: "国内主流的网页版动态数学工具，可嵌入 PPT、希沃白板，支持多端协同。",
          why: "国产课堂环境适配最好，老师做课件、学生自主探究都方便。"
        }
      ]
    },
    {
      category: "开源数学学习项目",
      desc: "这些项目和我们一样，想把「学数学方法」这件事做得更直观、更自动化。",
      items: [
        {
          name: "AI Math Tutor（math-learning-tool）",
          url: "https://github.com/veryyannan/math-learning-tool",
          tags: ["LLM", "Manim", "可视化视频"],
          summary: "输入一道数学题，AI Agent 自动生成数形结合的可视化讲解视频。",
          why: "和「初中动图数学」同一个思路：用动画把题目讲透；它胜在能自动把任意题做成视频。"
        },
        {
          name: "Học Toán（mathleaning）",
          url: "https://github.com/hacrot3000/mathleaning",
          cnUrl: "https://www.chuongduong.net/hoctoan/",
          tags: ["PHP", "小学", "初中", "自适应难度"],
          summary: "面向小学到初中的 Web 数学练习平台，含乘法表、整数/分数四则运算、幂次、绝对值等。",
          why: "有错题历史、连胜追踪、自适应难度，和 math-mastery 的练习闭环思路一致。"
        },
        {
          name: "小学数学思维课堂",
          url: "https://github.com/joycoding200/math-teaching-for-primary-grades",
          tags: ["纯前端", "小学奥数", "SVG 交互"],
          summary: "原生 HTML/CSS/JS 写的小学奥数互动教学工具，25 个游戏对应人教版教材单元。",
          why: "同样是「零依赖、打开即用」；它的天平、线段图、韦恩图等 SVG 组件值得参考。"
        },
        {
          name: "小乐数学 Mather",
          url: "https://github.com/thinksail/mather",
          cnUrl: "http://zzllrr.gitee.io/mather/",
          tags: ["离线", "多学科", "公式/作图"],
          summary: "野心很大的离线数学学习与研究辅助工具，目标覆盖数学全部学科的解题、作图、演示。",
          why: "定位最像 math-mastery 的「离线可用、方法/工具箱」路线，可做长期参考。"
        },
        {
          name: "Math Helper",
          url: "https://github.com/alott2223/math-helper-",
          tags: ["Python", "步骤教学", "问题分类"],
          summary: "识别题目类型（代数/几何/微积分等），给出分步解题思路和推荐学习资源。",
          why: "它的「题型识别 → 步骤拆解 → 资源推荐」流程，和 math-mastery 的方法卡片理念相通。"
        },
        {
          name: "AI 数学老师（math-tutor）",
          url: "https://github.com/Jialehh/math-tutor",
          tags: ["AI", "苏格拉底式", "LaTeX"],
          summary: "不直接给答案，而是通过启发式提问引导学生一步步思考。",
          why: "和 math-mastery「先给方法口诀、再做练习」的脚手架理念互补。"
        },
        {
          name: "ShapeLearn",
          url: "https://github.com/schellrw/ShapeLearn",
          tags: ["儿童", "数感", "3D 可视化"],
          summary: "通过 3D 形状和变换教 5–10 岁孩子算术，强调视觉-空间学习。",
          why: "把数字变成形状，和「数形结合」的启蒙方向一致。"
        }
      ]
    },
    {
      category: "商业/课程参考",
      desc: "这些是市面上常见的数学方法/动图课程类产品，可作为内容选题和交互设计的参考。",
      items: [
        {
          name: "初中动图数学",
          url: "https://www.douyin.com/search/%E5%88%9D%E4%B8%AD%E5%8A%A8%E5%9B%BE%E6%95%B0%E5%AD%A6",
          tags: ["短视频", "可视化", "初中"],
          summary: "抖音/视频号上常见的「一看就会」系列，用动图讲方程、函数、几何模型。",
          why: "就是用户提供的视频类型：用 10–60 秒动画把一个技巧讲明白，适合做应用内「动图演示」的参考。"
        },
        {
          name: "学而思网校 / 学而思",
          url: "https://www.xueersi.com",
          tags: ["K12", "方法体系", "培优"],
          summary: "国内最早的体系化数学方法培训机构之一，沉淀了大量「小学/初中/高中」解题模型。",
          why: "math-mastery 的方法体系最初就参考了学而思、作业帮、高途的课程框架。"
        },
        {
          name: "作业帮",
          url: "https://www.zybang.com",
          tags: ["拍照搜题", "视频讲题", "题库"],
          summary: "以拍照搜题和视频讲解起家，积累了海量题目与考点拆解。",
          why: "它的「一题一视频」模式是 math-mastery 练习页「每题解析」的参考方向。"
        },
        {
          name: "高途课堂",
          url: "https://www.gaotu100.com",
          tags: ["在线直播", "方法大招", "高中"],
          summary: "主打在线直播大班课，强调「方法大招」和应试技巧。",
          why: "和 math-mastery「核心解题方法」的定位最接近，可借鉴其方法命名和归类方式。"
        }
      ]
    },
    {
      category: "资源聚合",
      desc: "想继续拓展数学学习资源，可以从这些精选清单出发。",
      items: [
        {
          name: "Awesome Math",
          url: "https://github.com/rossant/awesome-math",
          tags: ["资源清单", "书籍", "课程"],
          summary: "GitHub 上最全面的数学资源清单，覆盖书籍、视频、工具、课程、博客。",
          why: "math-mastery 未来想扩展大学/竞赛内容时，这是最好的起点。"
        },
        {
          name: "OSSU 数学自学课程",
          url: "https://github.com/ossu/math",
          tags: ["免费课程", "大学数学", "自学路线"],
          summary: "开源大学数学完整学习路线，汇集哈佛、MIT、斯坦福等免费课程。",
          why: "对想从高中数学往大学数学延伸的学生/家长很有价值。"
        }
      ]
    }
  ];
})();
