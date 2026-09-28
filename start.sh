#!/bin/bash
# ============================================================================
# EduToolbox 本地预览服务器启动脚本（macOS / Linux / Git Bash）
# ============================================================================
# 用途：在项目根目录启动静态 HTTP 服务器，便于预览
# 原因：fetch() 加载 assets/templates/ 下的模板需要 http 协议（file:// 会被 CORS 阻止）
# 用法：bash start.sh
# 访问：http://localhost:8765/
# ============================================================================

set -e

PORT="${1:-8765}"

# 切换到脚本所在目录（兼容软链/相对路径调用）
cd "$(dirname "$0")"

echo "🚀 启动 EduToolbox 本地预览服务器（端口 $PORT）..."

# 优先使用 Python 3
if command -v python3 >/dev/null 2>&1; then
  python3 -m http.server "$PORT" > /tmp/edutoolbox-server.log 2>&1 &
elif command -v python >/dev/null 2>&1; then
  python -m http.server "$PORT" > /tmp/edutoolbox-server.log 2>&1 &
else
  echo "❌ 未检测到 Python，请先安装 Python 3 或使用 start.ps1（Windows PowerShell）"
  exit 1
fi

SERVER_PID=$!
echo "PID=$SERVER_PID"
sleep 2

# 自检
echo ""
echo "📦 资源自检："
curl -s -o /dev/null -w "  index.html   HTTP %{http_code}\n" "http://localhost:$PORT/index.html"
curl -s -o /dev/null -w "  base.css     HTTP %{http_code} size=%{size_download}\n" "http://localhost:$PORT/assets/css/base.css"
curl -s -o /dev/null -w "  data.js      HTTP %{http_code} size=%{size_download}\n" "http://localhost:$PORT/assets/js/data.js"
curl -s -o /dev/null -w "  app.js       HTTP %{http_code} size=%{size_download}\n" "http://localhost:$PORT/assets/js/app.js"
curl -s -o /dev/null -w "  comment.html HTTP %{http_code} size=%{size_download}\n" "http://localhost:$PORT/assets/templates/comment.html"
echo ""
echo "🌐 预览地址: http://localhost:$PORT/"
echo "🛑 停止服务: kill $SERVER_PID"
