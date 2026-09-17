# EduToolbox 目录层级规范

> 本文档定义 EduToolbox 项目的目录组织、文件命名、模块边界规则。
> 参考对标：`https://www.teacher-toolset.online/zh` 的资源分层与路由粒度。
> 约束：保持纯前端零依赖，不引入构建工具。

## 一、目录结构总览

```
EduToolbox/
├── index.html                  # SPA 入口
├── README.md
├── start.sh                    # 预览脚本（POSIX）
├── start.ps1                   # 预览脚本（Windows）
├── .gitignore
│
├── assets/                     # 静态资源根
│   ├── css/                    # 样式层（按职责拆分）
│   │   ├── base.css            #   变量、主题、reset、基础元素
│   │   ├── layout.css          #   顶栏、下拉菜单、布局、侧栏、页脚
│   │   ├── components.css      #   工具卡片、网格、徽标、空状态
│   │   ├── pages.css           #   首页 Hero、学科入口、标签云、详情页、文章页
│   │   └── tools.css            #   自研工具运行器样式 + 响应式
│   ├── js/                     # 脚本层（IIFE 命名空间 EduToolbox.*）
│   │   ├── data.js             #   数据层（DB 全局常量）
│   │   ├── utils.js            #   工具函数（$/$$/loadTemplate）
│   │   ├── theme.js            #   主题切换
│   │   ├── search.js           #   搜索过滤
│   │   ├── render.js           #   渲染层（分类/工具/下拉/学科/标签云）
│   │   ├── router.js           #   Hash 路由 + 侧栏联动
│   │   └── app.js              #   入口（最后加载）
│   └── img/                    # 图标与图片资源（可选）
│
├── tools/                      # 自研工具（按工具聚合，一工具一文件夹）
│   ├── comment/                #   评语生成器
│   │   ├── comment.js          #     交互逻辑
│   │   └── comment.html        #     UI 模板
│   ├── rollcall/               #   随机点名
│   │   ├── rollcall.js
│   │   └── rollcall.html
│   ├── seat/                   #   座位表
│   │   ├── seat.js
│   │   └── seat.html
│   └── answercard/             #   答题卡
│       ├── answercard.js
│       └── answercard.html
│
└── docs/                       # 项目规范文档
    └── directory-spec.md       #   本文档
```

## 二、CSS 层职责拆分

所有样式位于 `assets/css/`，按职责分文件，加载顺序固定：

| 文件 | 职责 | 依赖 |
|---|---|---|
| `base.css` | CSS 变量、主题、reset、`.container`、`.btn`、`.tag` | 无 |
| `layout.css` | 顶栏、下拉菜单、布局 grid、侧栏、页脚 | base |
| `components.css` | 工具卡片、网格、徽标、空状态 | base |
| `pages.css` | 首页 Hero、学科入口、分类标签云、详情页、文章页 | base, layout, components |
| `tools.css` | 自研工具运行器 + 响应式 media query | base, components |

**规则**：
- 严禁跨层反向依赖（如 base 不能引用 layout 的类）
- 响应式 `@media` 统一集中在 `tools.css` 末尾
- CSS 变量统一在 `base.css` 的 `:root` 与 `body.dark` 声明

## 三、JS 层模块边界

所有脚本使用 IIFE + 全局命名空间 `EduToolbox.*`，不使用 ES Module（保持 `file://` 兼容性与零构建）。

### 命名空间划分

| 文件 | 命名空间 | 职责 |
|---|---|---|
| `data.js` | `DB`（全局常量） | 数据层 |
| `utils.js` | `EduToolbox.utils` | `$` `$$` `escapeHtml` `loadTemplate` |
| `theme.js` | `EduToolbox.theme` | 主题切换 |
| `search.js` | `EduToolbox.search` | 搜索过滤 |
| `render.js` | `EduToolbox.render` | 渲染分类/工具/下拉/学科/标签云 |
| `router.js` | `EduToolbox.router` | Hash 路由 + 侧栏联动 |
| `tools/<name>/<name>.js` | `EduToolbox.tools.<name>` | 自研工具模块 |
| `app.js` | `EduToolbox`（入口） | 初始化所有模块 |

### 加载顺序（不可颠倒）

`index.html` 末尾 `<script>` 顺序：

```
data.js -> utils.js -> theme.js -> search.js -> render.js -> router.js
       -> tools/<name>/<name>.js（全部自研工具） -> app.js（最后）
```

### 模块通信规则

- 模块间通过 `EduToolbox.xxx.method()` 调用，禁止循环依赖
- 模块对外暴露 `init()` 函数由 `app.js` 统一调度
- 自研工具模块必须暴露 `init()`，由 `router.js` 在模板挂载后调用

## 四、自研工具模块规范

每个自研工具按**按工具聚合**到 `tools/<name>/` 目录，包含 2 个文件：

```
tools/<name>/<name>.js     # 交互逻辑（注册 EduToolbox.tools.<name>）
tools/<name>/<name>.html   # UI 模板（fetch 异步加载）
```

**文件命名规则**：文件夹名 = 模块名 = JS 文件名 = HTML 文件名（四统一，如 `tools/comment/comment.js` + `tools/comment/comment.html`）

**模板加载路径**：`EduToolbox.utils.loadTemplate(name)` → `tools/${name}/${name}.html`

**模块结构模板**：

```js
(function (global) {
  "use strict";
  global.EduToolbox = global.EduToolbox || {};
  global.EduToolbox.tools = global.EduToolbox.tools || {};

  /**
   * 模块初始化：在模板挂载后绑定事件
   * @returns {void}
   */
  function init() { /* ... */ }

  global.EduToolbox.tools.<name> = { init };
})(window);
```

## 五、模板加载机制

- 模板存放于 `tools/<name>/<name>.html`，由 `EduToolbox.utils.loadTemplate(name)` 异步加载
- 加载结果带缓存（`tplCache`），避免重复 fetch
- 由于 `fetch()` 在 `file://` 协议下被 CORS 阻止，**必须通过 HTTP 服务器访问**
- 启动方式：`bash start.sh` 或 `powershell -File start.ps1`

## 六、路由规范

Hash 路由，路径以 `/` 开头：

| 路径模式 | 用途 | 侧栏 | 示例 |
|---|---|---|---|
| `#/` | 首页（Hero + 分类标签云 + 全部工具） | 隐藏 | - |
| `#/section/:catId` | 分类页 | 显示 | `#/section/ai` |
| `#/tool/:slug` | 外链工具详情 | 隐藏 | `#/tool/ai-1` |
| `#/tools` | 自研工具列表 | 隐藏 | - |
| `#/onlinetools/:slug` | 自研工具运行 | 隐藏 | `#/onlinetools/comment` |
| `#/articles` | 文章资讯 | 隐藏 | - |

**slug 生成规则**：
- 外链工具：`${catId}-${index+1}`，由 `data.js` 末尾后处理自动生成
- 自研工具：`slug` 字段手动指定（与 `id` 一致）

## 七、数据字段规范

### 外链工具（`categories[].tools[]`）

| 字段 | 类型 | 必需 | 说明 |
|---|---|---|---|
| `name` | string | 是 | 工具名 |
| `desc` | string | 是 | 描述 |
| `tags` | string[] | 是 | 标签 |
| `url` | string | 是 | 外链（占位 `#`） |
| `featured` | boolean | 否 | 推荐标记 |
| `slug` | string | 自动 | 后处理生成 |
| `catId`/`catName`/`catIcon` | - | 自动 | 后处理附加 |

### 自研工具（`selfTools[]`）

| 字段 | 类型 | 必需 | 说明 |
|---|---|---|---|
| `id` | string | 是 | 模块名（对应 `EduToolbox.tools.<id>` 和 `tools/<id>/` 目录） |
| `slug` | string | 是 | URL 标识（与 `id` 一致） |
| `name` | string | 是 | 工具名 |
| `icon` | string | 是 | emoji 图标 |
| `desc` | string | 是 | 描述 |
| `tpl` | string | 是 | 模板文件名（= 目录名） |
| `featured` | boolean | 否 | 推荐标记 |

## 八、命名约定

- 目录名：小写（如 `comment`、`answercard`）
- 文件名：小写（如 `answercard.js`、`comment.html`）
- JS 变量：camelCase
- 常量：UPPER_SNAKE_CASE
- CSS 类：kebab-case
- ID 选择器：camelCase（仅限需 JS 直接获取的元素）
- 命名空间：`EduToolbox.<module>.<method>`

## 九、扩展流程

### 新增外链工具

1. 在 `data.js` 对应 `categories[].tools[]` 末尾追加条目
2. （可选）设 `featured: true` 标记推荐
3. `slug` 由后处理自动生成，无需手填

### 新增自研工具

1. 在 `tools/` 下创建 `<name>/` 目录
2. 写入 `<name>.html`（UI 模板）和 `<name>.js`（交互逻辑）
3. 在 `data.js` 的 `selfTools` 追加 `{id:<name>, slug:<name>, tpl:<name>, ...}`
4. 在 `index.html` 末尾自研工具段追加 `<script src="tools/<name>/<name>.js"></script>`（在 `app.js` 之前）

## 十、与参考站差异说明

参考站 `teacher-toolset.online` 使用框架构建与多语言前缀，本项目保持纯前端，差异如下：

| 维度 | 参考站 | 本项目 | 取舍原因 |
|---|---|---|---|
| 构建 | 框架（推断 Next/Nuxt） | 原生 JS IIFE | 零依赖、可双击运行 |
| 多语言 | `/zh` 前缀 | 仅中文 | 当前需求聚焦中文教师 |
| 路由 | Browser History | Hash 路由 | 兼容静态托管无 rewrite |
| 工具详情 | `/zh/tool/:slug` | `#/tool/:slug` | 等价语义，URL 更短 |
| 自研工具结构 | 框架组件系统 | `tools/<name>/` 按工具聚合 | 每工具独立，易于扩展 |
