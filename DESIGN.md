# DESIGN.md · 设计规范

> EduToolbox 视觉与交互设计的唯一权威。所有令牌值取自 [assets/css/base.css](./assets/css/base.css) 与 [assets/css/tool-mount-base.css](./assets/css/tool-mount-base.css)，改动令牌先改这两个文件再更新本文档。
> 受众：自研工具开发者与 AI 代理。目标：站点外壳与 85 个工具视觉统一、深浅色一致、课堂大屏（投影）与 A4 打印可用。

## 1. 设计原则

1. **教育场景优先**：高对比、大字号、大点击区；课堂投影下 10 米外可读。
2. **零自定义优先用令牌**：颜色/圆角/阴影/间距/动效一律引用 CSS 变量，禁止硬编码十六进制值（工具内部业务色除外）。
3. **双层主题**：站点级 `body.dark` 控深浅；工具舞台级 `data-theme` 控六色调性，二者互不串扰。
4. **单列自然流**：页面唯一纵向滚动是 body；内部容器不制造滚动条，高度由内容撑开。
5. **打印即所得**：生成类工具（奖状/试卷/姓名贴/方格纸）以 A4 为第一排版目标。

## 2. 设计令牌（:root）

### 2.1 品牌与功能色

| 令牌 | 浅色值 | 深色值（body.dark） | 用途 |
|---|---|---|---|
| `--primary` | `#3b6ef6` | `#5b8bff` | 主操作、选中、链接 hover |
| `--primary-hover` | `#2f5ee0` | `#7098ff` | 主按钮悬停 |
| `--primary-active` | `#274fc2` | `#4a7af0` | 按下 |
| `--primary-soft` / `-soft-2` | `#e8edff` / `#dbe4ff` | `#23304f` / `#2a3a60` | 浅色强调背景/边框 |
| `--primary-grad` | `135deg #5a8dff→#3b6ef6→#2f5bd9` | `#5b8bff→#4a7af0` | 主按钮、选中态、Hero 标题 |
| `--success` `--warning` `--danger` `--info` | `#22b36a` `#f5a623` `#ef5b5b` `#38a3e8` | 同 | 状态语义 |

### 2.2 文字 / 面 / 线

| 令牌 | 浅色 | 深色 |
|---|---|---|
| `--text-1/2/3` | `#1f2733` / `#515b6b` / `#8a93a3` | `#e7ecf5` / `#aeb8c9` / `#7e8899` |
| `--text-inverse` | `#ffffff` | 同 |
| `--bg` / `--bg-soft` | `#eef2fa` / `#f4f7fd` | `#141821` / `#191e2a` |
| `--card-bg` / `--card-bg-2` | `#ffffff` / `#f8faff` | `#1e2433` / `#232a3b` |
| `--border` / `--border-2` | `#e4e9f2` / `#d6deec` | `#2d3548` / `#39425a` |

正文基准：font-size **15px**、line-height **1.65**、字体栈 `--font`（-apple-system → Segoe UI → PingFang SC → Microsoft YaHei → sans-serif）。

### 2.3 圆角 / 阴影 / 尺寸 / 动效

- 圆角：`--r-sm:8px` · `--r:14px` · `--r-lg:20px` · `--r-pill:999px`（按钮、标签、tab 用 pill）。
- 阴影：`--shadow-sm`（卡片常态）`--shadow`（悬浮）`--shadow-lg`（弹层）`--shadow-primary`（主按钮）。
- 尺寸：`--topnav-h:64px`、`--container:1240px`（内容最大宽，基线验收值）、`--gap:24px`。
- 动效：`--ease:cubic-bezier(0.4,0,0.2,1)`；`--t-fast:0.16s`（控件反馈）、`--t:0.26s`（主题/面板）；尊重 `prefers-reduced-motion`。

## 3. 主题体系

### 3.1 深浅色（站点级）

- 切换在 `<body>` 上挂/摘 `.dark`，选择器月亮图标按钮；偏好存 localStorage（try/catch）。
- 所有自定义颜色必须在 `body.dark` 有对应值；图片/截图类工具可保持白色工作区。

### 3.2 舞台六色（工具级 data-theme）

工具舞台通过 `.tool-root[data-theme="x"]`（或 `main.stage[data-skin="x"]`）取色，**只影响工具自身，不写 body/documentElement**：

| 主题 | --primary | 渐变倾向 |
|---|---|---|
| `sky`（默认蓝调） | `#0ea5e9` | #38bdf8→#0ea5e9→#0284c7 |
| `violet` | `#7c3aed` | #8b5cf6→#7c3aed→#6d28d9 |
| `green` | `#16a34a` | #22c55e→#16a34a→#15803d |
| `gold` | `#d97706` | #f59e0b→#d97706→#b45309 |
| `orange` | `#ea580c` | #fb923c→#ea580c→#c2410c |
| `pink` | `#db2777` | #f472b6→#db2777→#be185d |

每色同时提供 `-soft`、`-soft-2` 与 `-grad`。工具顶栏主题按钮在六色间循环；Shadow DOM 自定义属性可跨边界继承。

## 4. 布局

### 4.1 站点骨架

- 顶栏 `.topnav`：sticky、高 64px、z-index **100**（全站最高，工具弹层不得超过）；三段式——logo 左 / 导航居中 / 操作区右；下拉箭头用 4px CSS border 自绘三角，open 时旋转 180°。
- `.container`：max-width 1240px，左右 padding 24px，居中。
- 首页：Hero（渐变标题 + 大搜索框 + 学科彩色入口 + 分类标签云 + 统计）→ ⭐精选推荐（黄底条）→ 各分类独立区块（每区块每行 4 个、最多展示 12 个卡片 + “更多 XX 工具→”）。
- 分类页：面包屑**纯文字左对齐**（无背景/圆角/内边距），标题 `.cp-title` 居中、副标题 `.cp-desc` margin auto；隐藏 Hero、精选与侧栏以外区块；有子分类时显示 pill 形 tab 条（active = 主色渐变 + 阴影），无子分类不渲染 tab。
- 页脚（`.footer`，背景 `--bg-soft`）为四列网格：品牌介绍（Logo+一句话定位+版权免责声明）/ 快速链接 / 法律信息 / 联系我们，列标题用 `--text-1`、链接用 `--text-2`（hover 主色）；分隔线下 `.footer-bottom` 居中放工作室版权行；≤760px 折为两列（品牌列跨整行）。未上线栏目渲染为 `.footer-static` 静态文字，禁止死链。

### 4.2 工具舞台（挂载态）

- 结构：挂载容器（`.tool-root`，独立层叠上下文）→ Shadow Root → `main.stage`；stage 首子元素为共享 `.stage-toolbar`（由 tool-stage-toolbar.js 注入）。
- 高度三态：独立页/iframe 兜底 `min-height:100vh`；挂载态 `:host main.stage{min-height:<卡片内容高>}` 收回（典型 460px/窄屏 380px）；适配器根 `:host{height:auto;min-height:0;border-radius:0!important}`。
- 模态居中：`position:fixed; top/left:50%; translate(-50%,-50%)`（Shadow 内 fixed 相对视口）。
- 全屏：目标元素是舞台本身，样式选择器写 `.stage:fullscreen`；iframe 全屏形态由工具内 `.edutf-solo`（fixed; inset:0; 100vw/100vh）并列承接同一套全屏样式，禁止写 `html:fullscreen`。

## 5. 组件规范

- **工具卡片 `.tool-card`**：圆角 14px、白底、`--shadow-sm` 常态 → `--shadow` + 轻微上浮 hover；名称左侧 emoji 图标、右侧外链图标；不显示分类标签；精选卡与普通卡同尺寸，横向滚动展示。
- **按钮 `.btn`**：pill 圆角、14px、600 字重；变体 `.btn-primary`（渐变+主色阴影）、`.btn-ghost`；尺寸 `.btn-lg` / `.btn-sm`；hover translateY(-1px)，active 回 0。
- **标签 `.tag` / 分类 tab `.cat-tab`**：pill、12-13px；active 态主色渐变白字 + `--shadow-primary`。
- **芯片 `.chip` / 芯片容器 `.chips`**：用于工具内可删除项（如学科、图标队列），hover 转危险色提示删除。
- **面板 `.setup-panel` / 舞台 `.stage` / 模态 `.modal`**：统一定义在 `assets/css/tool-common.css`（工具共享底座，含站点级规则，**禁止裸 link 注入全局 head**，只能进 Shadow 或 scoped 注入）。
- **空状态 `.state.state--empty`**：子分类/筛选无结果时统一使用，不自定义空列表。
- **表单控件**：高度 ≥ 32px、字号 ≥ 13px（投影可读）；focus 态用 `--primary` 描边；range 的 thumb 用主色实心圆。
- **外链 favicon**：`https://a.favicon.im/{domain}?larger=true`，加载失败显示 🔗。

## 6. 字体

- 界面字体走系统栈（零网络请求）。
- 装饰/书法类中文字体（如姓名贴的 Long Cang、Ma Shan Zheng、ZCOOL 系列、Zhi Mang Xing、Noto Sans/Serif SC）**必须本地化**：CSS 与 woff2 子集放 `assets/vendor/fonts/`，以 `@font-face` 引用相对路径；禁止运行时请求 `fonts.googleapis.com` / `fonts.gstatic.com`（离线与打印要求）。
- 打印正文不低于 9pt；A4 标签类工具按 mm 标定尺寸（@page margin 6mm/9mm）。

## 7. 响应式断点（assets/css/tools.css）

| 断点 | 典型调整 |
|---|---|
| ≤1080px | 首页网格 4→3 列；分类区块仍卡片化 |
| ≤900px | 顶栏导航折叠；侧栏分类转抽屉/横滑 |
| ≤760px | 网格 2 列；Hero 搜索与统计纵排；工具舞台工具栏换行 |
| ≤480px | 网格 1 列；触控区放大；舞台 min-height 收到 380px |

工具内部布局自行用同名区间媒体查询；`@media print` 块结构必须保持完整（rebase 不得打散 @media）。

## 8. 打印规范

- 站点级 `@media print` 仅做一件事：`html,body{background:#fff!important}`——**禁止**在此重置 max-width/padding（会压制工具容器宽度约束）。
- `print.css` 隐藏 `.topnav/.footer/.stage-toolbar` 等外壳；工具 `@page` 由 tool-adapter 提升为文档级规则（id `edutoolbox-tool-pagerule`）。
- 需要彩色打印的元素加 `-webkit-print-color-adjust:exact; print-color-adjust:exact;`。
- 浏览器自带页眉页脚无法用 CSS 去除，工具内用文案提示用户在打印对话框关闭。

## 9. 可访问性与文案

- 图标按钮必须有 `aria-label`/`title`；自定义可点 div 改为 `<button type="button">` 或补 `tabindex="0"` 与键盘事件。
- 正文对比度 ≥ 4.5:1；语义色不单独承载信息（配图标/文字）。
- 站内文案简体中文；品牌名 EduToolbox；emoji 仅作辅助图形，不作为唯一信息入口。
- 动效提供 `prefers-reduced-motion` 降级。

## 10. 视觉验收基线（零漂移）

打开任一工具再返回首页后逐值核对：`#main` 宽度 **1240px**、body font-size **15px**、`--primary` **#3b6ef6**（深色 #5b8bff）、顶栏 z-index 100 仍为最高；层叠关系需反向对照（工具弹层不遮顶栏）。
