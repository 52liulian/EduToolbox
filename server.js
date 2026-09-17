/**
 * EduToolbox 本地预览服务器（Node.js）
 * ============================================================================
 * 功能：静态文件服务 + SPA 路由 fallback
 *   - 静态资源（html/js/css/图片等）直接返回
 *   - 非文件路径（如 /articles、/section/xxx）统一返回 index.html，由前端 History 路由接管
 * 用法：node server.js [端口]
 * 访问：http://localhost:8765/
 * ============================================================================
 */
const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = parseInt(process.argv[2], 10) || 8765;
const ROOT = __dirname;

/** MIME 类型映射 */
const MIME = {
  ".html": "text/html; charset=utf-8",
  ".js":   "text/javascript; charset=utf-8",
  ".css":  "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png":  "image/png",
  ".jpg":  "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif":  "image/gif",
  ".svg":  "image/svg+xml",
  ".ico":  "image/x-icon",
  ".woff": "font/woff",
  ".woff2":"font/woff2",
  ".ttf":  "font/ttf",
  ".map":  "application/json",
  ".txt":  "text/plain; charset=utf-8",
  ".md":   "text/markdown; charset=utf-8",
};

/**
 * 解析请求路径对应的文件，若不存在则返回 index.html（SPA fallback）
 * @param {string} urlPath - 请求路径
 * @returns {string} 实际文件路径
 */
function resolveFile(urlPath) {
  // 去掉查询串
  let p = decodeURIComponent(urlPath.split("?")[0]);
  // 根路径 → index.html
  if (p === "/" || p === "") return path.join(ROOT, "index.html");
  // 去掉开头的 /
  p = p.replace(/^\/+/, "");
  // 禁止越权访问上级目录
  const abs = path.normalize(path.join(ROOT, p));
  if (!abs.startsWith(ROOT)) return path.join(ROOT, "index.html");
  // 若路径以 / 结尾，尝试拼接 index.html
  if (p.endsWith("/")) {
    const idx = path.join(abs, "index.html");
    if (fs.existsSync(idx)) return idx;
  }
  // 文件存在直接返回
  if (fs.existsSync(abs) && fs.statSync(abs).isFile()) return abs;
  // 否则 SPA fallback 到 index.html
  return path.join(ROOT, "index.html");
}

const server = http.createServer((req, res) => {
  const filePath = resolveFile(req.url);
  const ext = path.extname(filePath).toLowerCase();
  const type = MIME[ext] || "application/octet-stream";
  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
      res.end("Server Error");
      return;
    }
    res.writeHead(200, { "Content-Type": type });
    res.end(data);
  });
});

server.listen(PORT, () => {
  console.log(`\n  EduToolbox 服务器已启动`);
  console.log(`  预览地址: http://localhost:${PORT}/`);
  console.log(`  停止服务: Ctrl+C\n`);
});
