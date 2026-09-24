# AGENTS.md · AI 代理协作约定

> 适用：在本仓库工作的所有 AI 编码代理（Trae / Cursor / Codex / Claude Code 等）。
> 开工前必读 [说明文档.md](./说明文档.md) 对齐进度；设计细节查 [DESIGN.md](./DESIGN.md)；对话式工作流查 [CLAUDE.md](./CLAUDE.md)。

## 1. 项目一句话

EduToolbox 是**零构建、零后端**的纯前端教师工具站：原生 HTML/CSS/JS（IIFE）+ 本地 Bootstrap 5，Hash/History 双模式路由，85 个自研工具经 Shadow DOM 适配器挂载，必须同时在 http(s) 与 `file://` 离线场景下工作。

## 2. 环境事实（不要假设类 Unix）

- 本机操作系统：**Windows + PowerShell**。禁止直接使用 `find/grep/cat/sed` 等类 Unix 命令；文件枚举用 `Get-ChildItem`，内容检索用专用工具或 `Select-String`。
- 运行时：Python 3（`python server.py`）、Node.js（jsdom 质检用）。
- 浏览器验证：Edge headless（CDP）。注意本机 http_proxy 会拦截 127.0.0.1：curl 加 `--noproxy '*'`，Edge 加 `--no-proxy-server`。
- PowerShell 的 `>` 重定向产出 UTF-16LE，长文本一律让脚本自己写 UTF-8 文件。

## 3. 常用命令

```powershell
python server.py 18420          # 启动 SPA 开发服务器（有 fallback，调试唯一选择）
node --check assets/js/xxx.js   # JS 语法检查（批量改码后必跑）
python .workbuddy/scripts/run_all_suites.py   # 12 套件一键回归（验收门槛 12/12）
python .workbuddy/scripts/build_tool_bundles.py --check   # 检查 bundle 是否过期(STALE)
python .workbuddy/scripts/build_tool_bundles.py           # 重新预打包全部工具 bundle
```

## 4. 架构红线（违反即事故）

1. **不引入框架、构建器、npm 运行时依赖、后端服务**。新依赖先评估能否下载到 `assets/vendor/` 本地化。
2. **工具 CSS 禁止裸 `<link>` 注入全局 head**。adapter 工具样式走 Shadow DOM rebase；唯一原生工具 scoreboard 走 `injectScopedCss()`。
3. **禁止工具改写 `body` / `documentElement` 的 `data-theme`**；站点六色令牌是全局的，工具业务配色挂自己的容器（`main.stage[data-skin]`）。
4. 工具内 z-index 不得越过 `.topnav`（z-index:100）；挂载容器是独立层叠上下文。
5. **改工具源码后必须重跑 bundle 构建**，否则 file:// 下运行旧产物；`--check` 必须无 STALE。
6. `index.html` 顶部两段内联脚本（动态 `<base>`、深链接还原）顺序与内容不得改动；`document.write(base)` 必须早于一切资源。
7. 路由：http 用 History API 干净 URL，file:// 保留 hash；外链一律经 `withUtm()`。
8. 分类计数只用 `EduToolbox.render.countTools(cat)` / `countAllTools()`；数据层 `cat.tools` 必须数组兜底，杜绝 `undefined.forEach` 全站崩溃。
9. localStorage / sessionStorage 访问必须 try/catch（隐私模式）。
10. 不恢复已删除目录（旧 rollcall、name-sticker 已删，勿引用）；已废弃 id（searchGrid、catListDesc、#searchPage、#categoryListPage）勿再使用。

## 5. 代码约定

- JS：IIFE 挂 `window.EduToolbox.*`；`"use strict"`；camelCase 变量、UPPER_SNAKE 常量；**所有函数写中文函数级注释**（功能 / 入参类型用途 / 返回值 / 异常场景）。
- CSS：类名 kebab-case；变量集中在 `assets/css/base.css` 的 `:root` 与 `body.dark`；样式分层与加载顺序固定（bootstrap → bootstrap-theme → base → layout → components → pages → tools → print）。
- 工具页面：不含 navbar/header/返回品牌块；高度 `height:auto; min-height:100%` 由内容撑开，无内部滚动条（例外仅 body 主滚动、textarea 自身滚动、`.modal` 的 max-height+overflow-y、`.is-fullscreen` fixed）。
- 新工具默认 `mount:"adapter"`，不再新增 `mount:true` 原生工具。
- 正则批量改码后必须 `node --check` + DOM id 交叉引用校验；批量脚本须幂等、花括号配对守卫、先备份，失败时回滚到版本库再按序重放，**禁止在损坏文件上续跑**。

## 6. 数据编辑（assets/js/data.js）

- 结构：`categories[]`（外链，17 个一级分类，resource 含 3 个子分类）、`selfTools[]`（85 个自研工具）、`articles[]`。
- 新自研工具：slug = 目录名 = id；追加条目后同步建 `tools/<slug>/index.html` 并重打 bundle。
- 外链 url 必须真实可访问；占位 `"#"` 只允许临时存在并尽快替换；文件末尾后处理自动附加 slug/catId 等字段，勿手写覆盖。
- 静态数据更新后加 `?v=yyyyMMdd` 版本参数并提醒硬刷新。

## 7. 交付与验收

- 任何改动完成后必须自检：语法检查 → 相关套件 → http 与 file:// 双场景核对（涉及工具时）。
- 零漂移验收：开工具再回首页，`#main` 宽度 1240px、font-size 15px、`--primary` #3b6ef6 逐值等于基线。
- 完成即在 [说明文档.md](./说明文档.md)「进度记录」追加：日期、范围、验收标准、结果。
- 不主动提交 git（除非用户明确要求）；不 `--force`、不 amend、不跳过 hooks。
- 输出语言：简体中文（技术名词保留英文）。

## 8. 文件与目录速查

| 路径 | 作用 |
|---|---|
| `index.html` / `404.html` | SPA 入口 / 静态托管深链接兜底 |
| `assets/js/router.js` | 路由 + 工具挂载调度 + iframe 自适应 |
| `assets/js/tool-adapter.js` | Shadow DOM 适配器 + bundle 加载（file://） |
| `assets/js/tool-stage-toolbar.js` | 共享舞台工具栏（调用写全 `window.EduToolStageToolbar.init`） |
| `assets/js/toolkit.js` | CSS 作用域化等挂载工具函数 |
| `assets/js/frame-bridge.js` | iframe ↔ 父页高度/全屏通信 |
| `assets/js/data.js` | 全站数据（分类/自研工具/资讯） |
| `assets/css/tool-common.css` | 工具共享底座（含站点级规则，勿裸链入 head） |
| `assets/css/tool-mount-base.css` | 挂载舞台基座样式 |
| `assets/vendor/fonts/` | 本地化 Web 字体（CSS + woff2 子集） |
| `tools/<slug>/<slug>.bundle.js` | 预打包产物（生成器产物，勿手改） |
| `docs/directory-spec.md` | 目录层级规范（历史文档，部分旧机制描述以本文件与说明文档为准） |
