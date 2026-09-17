"""
EduToolbox SPA 开发服务器
- 所有非文件请求（/section/xxx、/onlinetools/xxx 等）一律返回 index.html
- 让前端 hash 路由接管
- 同时支持 file:// 双击打开（项目本身不依赖服务器）
"""
import http.server
import os
import sys

ROOT = os.path.dirname(os.path.abspath(__file__))

class SPAServer(http.server.SimpleHTTPRequestHandler):
    # 禁止静态资源缓存，开发调试时避免旧文件残留
    def end_headers(self):
        self.send_header("Cache-Control", "no-store, no-cache, must-revalidate")
        self.send_header("Pragma", "no-cache")
        self.send_header("Expires", "0")
        super().end_headers()

    def translate_path(self, path):
        # 正常解析路径
        fp = super().translate_path(path)
        # 如果路径对应文件不存在，返回 index.html
        if not os.path.isfile(fp):
            # 排除已带扩展名的真实文件请求（.css/.js/.html/.svg/.ico/.png/.jpg/.woff2 等）
            ext = os.path.splitext(path)[1].lower()
            if ext in (".css", ".js", ".html", ".svg", ".ico", ".png", ".jpg",
                       ".jpeg", ".gif", ".webp", ".woff2", ".woff", ".ttf",
                       ".eot", ".otf", ".mp3", ".mp4", ".json", ".txt",
                       ".pdf", ".zip", ".map"):
                return fp  # 真实文件不存在就正常 404
            # SPA 路由 → 返回 index.html
            return os.path.join(ROOT, "index.html")
        return fp

    def log_message(self, format, *args):
        sys.stderr.write("[SPA] " + (format % args) + "\n")

if __name__ == "__main__":
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 8080
    os.chdir(ROOT)
    with http.server.ThreadingHTTPServer(("0.0.0.0", port), SPAServer) as httpd:
        print(f"EduToolbox SPA server running at http://localhost:{port}")
        print("Press Ctrl+C to stop")
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nStopped.")
