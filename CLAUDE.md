# CLAUDE.md · AI 协作工作指南

> 面向对话式 AI 助手（Claude / Trae 等）在本仓库的作业手册。
> 硬性规约看 [AGENTS.md](./AGENTS.md)，设计取值看 [DESIGN.md](./DESIGN.md)，项目全貌与进度看 [说明文档.md](./说明文档.md)。本文件回答“接到一个需求后具体怎么干”。

## 0. 每次开工的固定动作

1. 先读 [说明文档.md](./说明文档.md)「进度记录」，确认当前在 M5（持续运营）阶段及最近改动。
2. 用文件读取/检索工具核实事实再动手——**禁止凭印象断言文件路径、id、行号**；引用具体代码前先 Read/Grep 取证。
3. 需求拆解成带验收标准的任务清单，按顺序闭环；完成一项标记一项。
4. 完成后自检并回写「说明文档.md」进度记录（日期/范围/验收/结果）。

## 1. 需求分诊：先判断属于哪一类

| 需求类型 | 入口文件 | 关键约束 |
|---|---|---|
| 新增外链工具 | `assets/js/data.js` 对应分类 `tools[]` | url 必须真实；走后处理自动 slug |
| 新增自研工具 | 新建 `tools/<slug>/` + data.js `selfTools[]` | 默认 `mount:"adapter"`，必须重打 bundle |
| 修改某工具 UI/逻辑 | `tools/<slug>/` 源码 | 改完重打 bundle；双场景验证 |
| 改站点外壳/导航/首页 | `assets/css/*.css` + `assets/js/render.js` | 零漂移基线验收 |
| 改路由 | `assets/js/router.js` | http 干净 URL / file:// hash 双模式；勿碰 index.html 顶部两段脚本 |
| 改挂载机制 | `tool-adapter.js` / `toolkit.js` / `tool-mount-base.css` | Shadow rebase、层叠上下文、主题隔离 |
| 引入第三方库 | 下载到 `assets/vendor/` | 必须本地化；评估体积与 file:// 兼容 |
| 数据统计/分类口径 | `render.js` 的 `countTools/countAllTools` | 禁止 `cat.tools.length` |

超出“纯前端可实现”边界的需求**直接说明无法在本架构实现**，不要硬造方案。

## 2. 标准作业流（自研工具相关）

```
建 tools/<slug>/index.html（单文件或三件套）
  → 追加组件化挂载兜底块（参照 tools/100neijiajian/index.html）
  → data.js selfTools 注册（slug=id=目录名，mount:"adapter"）
  → python .workbuddy/scripts/build_tool_bundles.py
  → build_tool_bundles.py --check 无 STALE
  → node --check（若有独立 js）
  → python .workbuddy/scripts/run_all_suites.py（12/12）
  → http 与 file:// 双场景人工核对（挂载模式/高度/裁切/全屏/打印）
  → 回写说明文档进度
```

工具页硬性要求：无 navbar/header 等框选内容；高度 auto 自然撑开；仅 body/textarea/modal/fullscreen 四类允许滚动；打印类工具设 `@page` 与 `print-color-adjust:exact`。

## 3. 验证配方

### 3.1 起服务（Windows PowerShell）

```powershell
python server.py 18420
# 探活（本机有代理时必须 --noproxy）
curl.exe --noproxy '*' http://127.0.0.1:18420/ -UseBasicParsing
```

长驻服务器用后台任务方式启动，不要用 shell `&`（会被会话回收）。

### 3.2 双场景核对清单

- **http**：`http://127.0.0.1:18420/` → 进工具 → Shadow 挂载（无 iframe 兜底）→ 回首页零漂移。
- **file://**：直接双击 `index.html` → 进同一工具 → 应仍为 Shadow（bundle 生效），渲染与 http 逐像素一致；若回退 iframe 说明 bundle 缺失/过期，重跑构建。
- **全屏**：舞台全屏与 `.edutf-solo` 两种形态样式一致（居中、字号放大、max-width 解除、圆角 0）。
- **打印**：Ctrl+P 预览无站点外壳、白底、纸张几何正确。
- **主题**：六色切换只影响工具；深浅切换后回首页 `--primary` 恢复 #3b6ef6。

### 3.3 回归套件

`.workbuddy/scripts/run_all_suites.py` 是总闸门（12 套件全绿才视为完成）。专项：`audit_tools.py`（注册一致性）、`audit_deep.py`（语法/id 交叉引用）、`smoke_test.js`（jsdom 运行时）、`audit_mount_all.py`（Edge CDP 挂载普查）。

## 4. 常见任务操作要点

- **静态资源更新缓存**：引用处加 `?v=yyyyMMdd`；提醒用户 Ctrl+Shift+R。
- **外链处理**：所有跳转链接经 `withUtm()`；新增后人工打开核验，失效即删换。
- **子分类**：在分类对象加可选 `subCategories[]`；展平由 search.js 合并并附加 `subCatId/subCatName/subCatIcon`；空结果渲染 `.state.state--empty`；深链 `/section/:id?sub=xxx` 面包屑追加子分类名。
- **本地化外部引用**：CSS/字体下载到 `assets/vendor/`（字体含子集 woff2 时需重写 CSS url 为相对路径）；姓名贴字体本地化（662 个 woff2）是现成范式。
- **工具内调共享库**：写全限定名 `window.EduToolStageToolbar.init(...)`——adapter 用 `new Function` 执行，裸标识符会 ReferenceError。
- **Shadow DOM 写 CSS**：`:host([attr])` 合法、`:host[attr]` 非法；同特异性后加载者赢，工具 CSS 必须晚于 tool-mount-base.css；hex 自定义属性跨 Shadow 继承，混色用 `color-mix(in srgb,…)`。

## 5. 故障排查速查表

| 现象 | 优先怀疑 | 处置 |
|---|---|---|
| file:// 下工具样式全丢/回退 iframe | bundle 过期或 `<link>` 写法未被构建器识别 | 重跑 build_tool_bundles.py；构建器已支持 rel/href 任意顺序 |
| 工具打开后页面变窄/下拉被遮 | 工具 CSS 裸 link 进了全局 head | 改 Shadow rebase 或 injectScopedCss |
| 首页整站崩、控制台 forEach undefined | 某分类缺 tools 数组 | 补 `Array.isArray()` 兜底 |
| 全屏后样式没变（file://） | 只写了 `:fullscreen`，全屏元素是 iframe | 补 `.edutf-solo` 并列变体 |
| 打印白底灰边/排版被压 | print.css 被加了宽度 !important | print.css 只允许 background 重置 |
| 改了工具但运行仍旧 | bundle 未重建 / 浏览器缓存 | 重打 bundle + 硬刷新 |
| 本地 127.0.0.1 探活 502 | http_proxy 拦截 | curl `--noproxy '*'`；Edge `--no-proxy-server` |
| PowerShell 输出乱码 | `>` 重定向为 UTF-16LE | 让脚本自行写 UTF-8 |
| data.js 改完数量不对 | 用了 cat.tools.length | 统一 countTools() 口径 |

## 6. 批量脚本纪律（血泪教训）

1. 先备份再批量改；脚本先剥离注释再做模式判定（注释中的关键词曾误触发）。
2. 正则避免跨规则污染：用 `[^{}]+` 而非贪婪/可回溯量词；花括号配对守卫；拒绝异常写入。
3. 脚本必须幂等；跑完做 `node --check` + 垃圾标记 grep（Placeholder 等未完成痕迹）。
4. **一旦批量改坏：回滚到版本库干净版，再按既定顺序重放，绝不在损坏文件上继续叠加步骤。**
5. 「另存网页」来源的工具入库前查扩展残留（体积异常、doubao/cici/sonner 等关键词）。

## 7. 沟通与交付偏好

- 全程简体中文，技术名词保留英文；时间用北京时间（Asia/Shanghai）。
- 代码函数级中文注释：功能、入参类型与用途、返回值、异常场景。
- 不擅自提交 git、不做计划外重构、不新建无关文件；文档变动即时同步，不留文档-代码漂移。
- 报告问题时给“现象 → 根因证据 → 修复 → 验证结果”四段式，不写未经取证的断言。
