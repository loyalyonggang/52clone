@echo off
echo ========================================
echo 我爱克隆 - 首次安装脚本
echo ========================================
echo.

echo [1/3] 检查 Python 环境...
python --version
if errorlevel 1 (
    echo 错误: 未找到 Python，请先安装 Python 3.7+
    pause
    exit /b 1
)

echo.
echo [2/3] 安装 Python 依赖...
if not exist venv (
    echo 创建虚拟环境...
    python -m venv venv
)

call .\venv\Scripts\activate
pip install -r requirements.txt
pip install html5lib

echo.
echo [3/3] 安装 Node.js 依赖...
cd frontend

echo 检查 Node.js 环境...
node --version
if errorlevel 1 (
    echo 错误: 未找到 Node.js，请先安装 Node.js
    pause
    exit /b 1
)

echo 安装前端依赖（这可能需要几分钟）...
call npm install

cd ..

echo.
echo ========================================
echo 安装完成！
echo ========================================
echo.
echo 现在可以运行 start-all.bat 来启动项目
echo 或者按照 START.md 中的说明手动启动
echo.
pause
