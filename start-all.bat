@echo off
echo ========================================
echo 我爱克隆 - 一键启动脚本
echo ========================================
echo.

echo [1/2] 启动后端服务 (Flask)...
start "我爱克隆-后端" cmd /k "cd /d %~dp0 && .\venv\Scripts\activate && python app.py"

timeout /t 3 /nobreak >nul

echo [2/2] 启动前端服务 (Next.js)...
start "我爱克隆-前端" cmd /k "cd /d %~dp0frontend && npm run dev"

echo.
echo ========================================
echo 启动完成！
echo ========================================
echo.
echo 后端服务: http://127.0.0.1:5001
echo 前端服务: http://localhost:3000
echo.
echo 请等待几秒钟让服务完全启动...
echo 然后在浏览器中访问: http://localhost:3000
echo.
echo 按任意键关闭此窗口...
pause >nul
