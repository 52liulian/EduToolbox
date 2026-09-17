# ============================================================================
# EduToolbox 本地预览服务器启动脚本（Windows PowerShell）
# ============================================================================
# 用途：在项目根目录启动 Node.js 静态 HTTP 服务器（支持 SPA 路由 fallback）
# 原因：前端使用 History API 路由（URL 无 # 号），刷新子页面需服务器返回 index.html
# 用法：powershell -ExecutionPolicy Bypass -File start.ps1
# 访问：http://localhost:8765/
# ============================================================================

param([int]$Port = 8765)

# 切换到脚本所在目录
Set-Location -Path $PSScriptRoot

Write-Host "🚀 启动 EduToolbox 本地预览服务器（端口 $Port）..." -ForegroundColor Cyan

# 检测 Node.js
if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Host "❌ 未检测到 Node.js，请先安装 Node.js（https://nodejs.org）" -ForegroundColor Red
    exit 1
}

# 后台启动服务器
$proc = Start-Process -FilePath "node" -ArgumentList "server.js", $Port -PassThru -WindowStyle Hidden
Write-Host "PID=$($proc.Id)"
Start-Sleep -Seconds 2

# 自检
Write-Host ""
Write-Host "📦 资源自检：" -ForegroundColor Yellow
$urls = @(
    "/",
    "/assets/css/base.css",
    "/assets/js/data.js",
    "/assets/js/app.js",
    "/articles"
)
foreach ($u in $urls) {
    try {
        $resp = Invoke-WebRequest -Uri "http://localhost:$Port$u" -UseBasicParsing
        Write-Host ("  {0,-20} HTTP {1} size={2}" -f $u, $resp.StatusCode, $resp.RawContentLength)
    } catch {
        Write-Host ("  {0,-20} HTTP 错误: {1}" -f $u, $_.Exception.Message) -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "🌐 预览地址: http://localhost:$Port/" -ForegroundColor Green
Write-Host "🛑 停止服务: Stop-Process -Id $($proc.Id)" -ForegroundColor Gray
