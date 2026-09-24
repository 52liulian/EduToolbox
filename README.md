# EduToolbox 教师工具箱

> 1000+ 免费教育工具导航 + 85 个浏览器本地运行的自研小工具（评语/点名/倒计时/抽题/奖状...）

## 项目特性

- **纯前端零依赖**：原生 HTML + CSS + JS（IIFE 模块化），不引入构建工具
- **Hash 路由**：始终使用 `#/path` 路由，任意服务器刷新不 404；干净 URL 自动迁移
- **本地隐私**：自研工具数据全部在浏览器内处理，无网络请求
- **双主题**：浅色/深色切换 + localStorage 持久化
- **响应式**：兼容桌面/平板/手机
- **离线可用**：所有外部库下载到本地 `assets/vendor/`，`file://` 双击也能跑

## 快速预览

推荐使用 SPA 服务器（干净 URL 自动迁移 + 刷新不 404）：

```bash
python server.py 8899
```

或用启动脚本：

### Windows PowerShell
```powershell
powershell -ExecutionPolicy Bypass -File start.ps1
```

### macOS / Linux / Git Bash
```bash
bash start.sh
```

访问 [http://localhost:8899/](http://localhost:8899/)

> 也支持 `python -m http.server` 或 `file://` 双击打开，但干净 URL（如 `/onlinetools/comment`）刷新会 404。

## 目录层级

```
EduToolbox/
├── index.html                  # SPA 入口（顶栏 + 路由容器 + 页脚）
├── README.md                   # 项目说明
├── server.py                   # SPA fallback 服务器（推荐）
├── start.ps1 / start.sh        # 本地预览脚本
├── .gitignore
│
├── assets/                     # 静态资源根
│   ├── css/                    # 样式层（按职责拆分）
│   │   ├── base.css            #   CSS 变量令牌（--primary 等）、reset、.container、.btn、.tag
│   │   ├── layout.css          #   顶栏 topnav sticky + 下拉菜单、路由容器、tool-run-header、页脚
│   │   ├── components.css      #   .tool-grid、.tool-card、.featured-grid、.cat-block、.tool-detail
│   │   ├── pages.css           #   首页 Hero（渐变背景/标题/搜索框/学科按钮/标签云/统计）
│   │   ├── tool-common.css     #   自研工具共享底座（.setup-panel/.stage/.chips/.chip/.modal 等）
│   │   └── tools.css           #   iframe 响应式 + 全站断点（1080/900/760/480）+ prefers-reduced-motion
│   │
│   ├── js/                     # 脚本层（IIFE 命名空间 window.EduToolbox.*）
│   │   ├── data.js             #   数据层（DB = categories / selfTools / articles）
│   │   ├── utils.js            #   工具函数（$/$$/escapeHtml/loadTemplate）
│   │   ├── theme.js            #   主题切换（浅色/深色）
│   │   ├── search.js           #   搜索过滤（关键词 + 分类）
│   │   ├── render.js           #   渲染层（精选/分类/搜索结果/详情页）
│   │   ├── router.js           #   Hash 路由 + iframe 高度自适应
│   │   └── app.js              #   入口（最后加载，初始化所有模块）
│   │
│   ├── vendor/                 # 外部库与字体（本地化，离线可用）
│   │   ├── fonts/              #   本地化 Web 字体（如 xingmingtie.css + xingmingtie/ 子集 woff2）
│   │   ├── bootstrap/  katex/  #   本地 CSS 框架 / 数学公式字体
│   │   └── *.js                #   pinyin-pro / qrcode / html2canvas / jspdf / JSZip / SheetJS(xlsx) / mammoth / pdf.js / echarts
│   │
│   └── img/                    # 图标、占位图、logo（可选）
│
├── tools/                      # 自研工具（每个工具独立目录，iframe 嵌入）
│   ├── gaokao-countdown/       #   高考倒计时
│   │   ├── index.html          #     工具页面（无 navbar，高度自然撑开）
│   │   ├── gaokao-countdown.css #     工具特有样式
│   │   └── gaokao-countdown.js #     工具逻辑
│   ├── senior-comment/         #   高中评语生成
│   ├── rollcall/               #   随机点名器
│   ├── random-question/        #   随机抽题
│   └── ...                     #   共 85 个工具
│
└── docs/                       # 项目规范文档
    └── directory-spec.md       # 目录层级规范
```

## 路由表

| Hash 路径 | 页面 | 说明 |
|---|---|---|
| `#/` | 首页 | Hero + 精选推荐 + 分类独立区块 |
| `#/search?q=关键词` | 搜索结果 | 全站关键词 + 分类过滤 |
| `#/section/:catId` | 分类页 | 如 `#/section/math`，标题居中 |
| `#/tool/:slug` | 外链工具详情 | 如 `#/tool/ai-1` |
| `#/tools` | 自研工具列表 | 全部 85 个自研工具卡片 |
| `#/onlinetools/:slug` | 自研工具运行页 | iframe 嵌入，如 `#/onlinetools/gaokao-countdown` |
| `#/categories` | 全部分类入口 | 分类卡片网格 |
| `#/articles` | 文章资讯 | 教学工具资讯列表 |

> 干净 URL（如 `/onlinetools/comment`）访问时自动迁移为 hash URL，刷新不 404。

## 自研工具规范

### 目录结构

每个自研工具一个独立文件夹，**必须**包含：

```
tools/<slug>/
├── index.html        # 工具页面（iframe 嵌入）
├── <slug>.css        # 工具特有样式
└── <slug>.js         # 工具逻辑
```

### index.html 要求

1. **删除所有 navbar/header 块**（返回按钮、品牌 logo、全屏按钮等）
2. **不设置固定高度**：`html, body { height: auto; min-height: 100%; }`，由内容自然撑开
3. **无内部滚动条**：仅 `body` 浏览器主滚动条、`textarea` 自身滚动、`.modal max-height:86vh + overflow-y:auto`、`.is-fullscreen position:fixed; inset:0` 为例外
4. 引入公共底座：`<link rel="stylesheet" href="../../assets/css/tool-common.css">`
5. iframe src 使用**相对路径** `tools/<slug>/index.html`，自动适配 http(s) 和 file://

### 注册到 data.js

在 `assets/js/data.js` 的 `selfTools` 数组追加条目：

```js
{id: "my-tool", slug: "my-tool", name: "我的工具", icon: "🛠️", desc: "描述...", features: ["✨ 特性1", "✨ 特性2"]},
```

slug 必须与目录名完全一致。

## 设计令牌（CSS 变量）

| 变量 | 默认值 | 说明 |
|---|---|---|
| `--primary` | `#3b6ef6` | 品牌蓝 |
| `--primary-grad` | `linear-gradient(135deg, #5a8dff, #3b6ef6, #2f5bd9)` | 渐变按钮 |
| `--primary-soft` | `#e8edff` | 浅色强调背景 |
| `--text-1 / --text-2 / --text-3` | `#1f2733 / #515b6b / #8a93a3` | 三级文字色 |
| `--bg` | `#eef2fa` | 页面背景 |
| `--card-bg` | `#ffffff` | 卡片背景 |
| `--border` | `#e4e9f2` | 边框 |
| `--shadow-sm / --shadow / --shadow-lg` | 渐进阴影 | 卡片/悬浮阴影 |
| `--r-sm / --r / --r-lg / --r-pill` | `8px / 14px / 20px / 999px` | 圆角 |

暗色主题自动切换（`body.dark`）。

## 浏览器兼容

- 现代浏览器（Chrome / Edge / Firefox / Safari 最新两个稳定版）
- iframe Fullscreen API（自研工具全屏投影）
- ResizeObserver（iframe 高度自适应）
- 不支持 IE11

## 项目引用
math-mastery：https://github.com/kenowong/math-mastery

## 更新记录

| 日期 | 范围 | 内容 |
|---|---|---|
| 2026-09-23 | `tools/xingmingtie` | 姓名贴工具 Google Fonts 在线引用本地化：新增 `assets/vendor/fonts/xingmingtie.css`（662 个 `@font-face`）与 `assets/vendor/fonts/xingmingtie/`（662 个 woff2 子集，约 25 MB），覆盖 Long Cang、Ma Shan Zheng、ZCOOL QingKe HuangYou、ZCOOL XiaoWei、Zhi Mang Xing、Noto Sans SC、Noto Serif SC 共 7 个字族；`index.html` 改用相对路径并移除 preconnect，消除对 `fonts.googleapis.com` / `fonts.gstatic.com` 的外部请求，支持 `file://` 离线打印 |

## 许可

代码部分：MIT
收录工具版权归原作者所有，自建站请替换为自有链接
