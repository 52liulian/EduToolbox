# 🎓 EduToolbox 教师工具箱

> 1000+ 免费教育工具导航 + 85 个浏览器本地运行的自研小工具（评语/点名/倒计时/抽题/奖状...）

## 项目特性

- **纯前端零依赖**：原生 HTML + CSS + JS（IIFE 模块化），不引入构建工具
- **双模式路由**：http(s) 下走 History API 干净 URL，`file://` 下自动保留 `#/path` hash；干净 URL 访问自动迁移，任意服务器刷新不 404
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
│   │   ├── router.js           #   History/hash 双模式路由 + 工具挂载调度 + iframe 自适应
│   │   ├── tool-adapter.js     #   Shadow DOM 适配器（CSS rebase）+ file:// bundle 加载
│   │   ├── toolkit.js          #   CSS 作用域化等挂载工具函数
│   │   ├── frame-bridge.js     #   iframe 兜底时父子页面高度/全屏通信
│   │   └── app.js              #   入口（最后加载，初始化所有模块）
│   │
│   ├── vendor/                 # 外部库与字体（本地化，离线可用）
│   │   ├── fonts/              #   本地化 Web 字体（xingmingtie/ 姓名贴 662 子集、kechengbiao/ 课程表 103 woff2 等）
│   │   ├── bootstrap/  katex/  #   本地 CSS 框架 / 数学公式字体
│   │   └── *.js                #   pinyin-pro / qrcode / html2canvas / jspdf / JSZip / SheetJS(xlsx) / mammoth / pdf.js / echarts
│   │
│   └── img/                    # 图标、占位图、logo（可选）
│
├── tools/                      # 自研工具（每个工具独立目录，Shadow DOM 适配器挂载）
│   ├── gaokao-countdown/       #   高考倒计时
│   │   ├── index.html          #     工具页面（无 navbar，高度自然撑开）
│   │   ├── gaokao-countdown.css #     工具特有样式
│   │   └── gaokao-countdown.js #     工具逻辑
│   ├── senior-comment/         #   高中评语生成
│   ├── random-shuffle/         #   随机打乱/点名
│   ├── random-question/        #   随机抽题
│   └── ...                     #   共 85 个工具（84 adapter + 1 native）
│
│   注：每个工具另由构建脚本生成 <slug>.bundle.js（预打包产物，file:// 用，勿手改）
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
| `#/onlinetools/:slug` | 自研工具运行页 | Shadow DOM 组件化挂载（iframe 仅 bundle 缺失时兜底），如 `#/onlinetools/gaokao-countdown` |
| `#/categories` | 全部分类入口 | 分类卡片网格 |
| `#/articles` | 文章资讯 | 教学工具资讯列表 |
| `#/about` | 关于本站 | 项目简介 + 数据统计 + 收录标准 + 联系入口（与分类页共用头部） |

> 干净 URL（如 `/onlinetools/comment`）访问时自动迁移为 hash URL，刷新不 404。

## 自研工具规范

### 目录结构

每个自研工具一个独立文件夹，**必须**包含：

```
tools/<slug>/
├── index.html        # 工具页面（Shadow DOM 适配器挂载）
├── <slug>.css        # 工具特有样式
└── <slug>.js         # 工具逻辑
```

### index.html 要求

1. **删除所有 navbar/header 块**（返回按钮、品牌 logo、全屏按钮等）
2. **不设置固定高度**：`html, body { height: auto; min-height: 100%; }`，由内容自然撑开
3. **无内部滚动条**：仅 `body` 浏览器主滚动条、`textarea` 自身滚动、`.modal max-height:86vh + overflow-y:auto`、`.is-fullscreen position:fixed; inset:0` 为例外
4. 引入公共底座：`<link rel="stylesheet" href="../../assets/css/tool-common.css">`（单文件工具可在 `<style>` 内写等价的「组件化挂载兜底」块：六色主题变量 + `.container` 宽度）
5. 资源一律使用**相对路径**，自动适配 http(s) 和 `file://`；工具 CSS 禁裸 `<link>` 注入全局 head（由适配器 rebase 进 Shadow DOM）
6. 注册默认 `mount:"adapter"`；改动源码后必须重跑 `python .workbuddy/scripts/build_tool_bundles.py`，`--check` 无 STALE

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
- Shadow DOM v1（自研工具组件化挂载）
- Fullscreen API（工具全屏；iframe 兜底形态由 `.edutf-solo` 承接）
- ResizeObserver（iframe 兜底高度自适应）
- 不支持 IE11

## 项目引用与致谢

### 改编项目与数据来源

| 用途 | 上游项目 | 许可 |
|---|---|---|
| `tools/math-mastery`（数学学习工具） | [kenowong/math-mastery](https://github.com/kenowong/math-mastery) | 遵循原项目开源许可，工具页内保留出处与署名 |
| 笔顺笔画数据（`tools/stroke-anim`、`tools/primary-grade-hanzi`） | [Make Me A Hanzi](https://github.com/skishore/makemeahanzi)（graphics.txt）/ [hanzi-writer-data](https://github.com/chanind/hanzi-writer-data) | Arphic Public License（文鼎公开授权衍生数据；Hanzi Writer 代码本身为 MIT） |
| 常用字表（`tools/common-2500-hanzi`） | 《现代汉语常用字表》（国家语委 1988） | 公开规范数据 |

### 本地化第三方库（均存放于 `assets/vendor/`，离线运行、无运行时外部请求）

- [Bootstrap](https://getbootstrap.com/) 5.3.3 — MIT（文件头声明）
- [KaTeX](https://katex.org/) — 数学公式渲染（许可见上游仓库）
- [Apache ECharts](https://echarts.apache.org/) — Apache-2.0（文件头声明）
- [html2canvas](https://html2canvas.hertzen.com/) 1.4.1 — MIT（文件头声明）
- [jsPDF](https://github.com/parallax/jsPDF) 2.5.2 — MIT（文件头许可文本）
- [JSZip](https://github.com/Stuk/jszip) — MIT / GPLv3 双许可（文件头声明）
- [mammoth.js](https://github.com/mwilliamson/mammoth.js) — Word 文档解析（许可见上游仓库）
- [PDF.js](https://github.com/mozilla/pdf.js) — Apache-2.0（文件头声明）
- [pinyin-pro](https://github.com/zh-lx/pinyin-pro) — 汉字拼音处理（许可见上游仓库）
- qrcode（二维码生成）/ [SheetJS](https://sheetjs.com/)（xlsx 解析）— 许可见各上游仓库

### 字体

- Google Fonts 字族（Noto Sans SC、Noto Serif SC、Comic Neue、Long Cang、Ma Shan Zheng、ZCOOL QingKe HuangYou、ZCOOL XiaoWei、Zhi Mang Xing 等），遵循 SIL Open Font License；已下载为本地 woff2 子集存放于 `assets/vendor/fonts/`（xingmingtie/ 662 个、kechengbiao/ 103 个），不向 Google 发起运行时请求。

## 更新记录

| 日期 | 范围 | 内容 |
|---|---|---|
| 2026-09-24 | `tools/kechengbiao` / `assets/vendor/fonts/kechengbiao*` | 课程表工具 Google Fonts 在线 `@import` 本地化：103 个 woff2（Comic Neue + Noto Sans SC，4.34 MB）下载至 `assets/vendor/fonts/kechengbiao/`，新增 `kechengbiao.css`（406 个 `@font-face`，零远程域名残留）；`index.html` 删除 @import 改 `<link>` 并删除 css2.css，修复 DevTools「@import 未置顶 / 样式表 URL 失败」两项 Issues；补「组件化挂载兜底」块（六色主题 + 容器宽度，主容器 data-no-fallback 豁免保留 1400px）；重建 bundle，回归 12/12 全绿 |
| 2026-09-24 | `assets/vendor/`（bootstrap / jspdf） | 补齐 vendor 压缩文件引用的 source map（Bootstrap 5.3.3 js/css 两个 .map、jsPDF 2.5.2 .map），消除 DevTools source map 读取警告 |
| 2026-09-24 | `index.html` / `assets/css/layout.css` / `assets/css/tools.css` | 页脚按参考设计改版为四列信息架构（品牌介绍 / 快速链接 / 法律信息 / 联系我们）+ 分隔线居中版权栏「© 2026 杏坛网络工作室 · 版权所有」；背景改用 --bg-soft，≤760px 两列折行；顺手清理死链 /about，未上线栏目暂为静态文字 |
| 2026-09-23 | `tools/xingmingtie` | 姓名贴工具 Google Fonts 在线引用本地化：新增 `assets/vendor/fonts/xingmingtie.css`（662 个 `@font-face`）与 `assets/vendor/fonts/xingmingtie/`（662 个 woff2 子集，约 25 MB），覆盖 Long Cang、Ma Shan Zheng、ZCOOL QingKe HuangYou、ZCOOL XiaoWei、Zhi Mang Xing、Noto Sans SC、Noto Serif SC 共 7 个字族；`index.html` 改用相对路径并移除 preconnect，消除对 `fonts.googleapis.com` / `fonts.gstatic.com` 的外部请求，支持 `file://` 离线打印 |

## 许可

代码部分：MIT
收录工具版权归原作者所有，自建站请替换为自有链接
