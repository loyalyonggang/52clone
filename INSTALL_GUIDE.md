# 我爱克隆 - 详细安装指南

## 📋 系统要求

- **操作系统**: Windows 10/11, macOS, Linux
- **Python**: 3.7 或更高版本
- **Node.js**: 16.0 或更高版本
- **浏览器**: Chrome（用于 Selenium 渲染）
- **内存**: 至少 4GB RAM
- **磁盘空间**: 至少 500MB

## 🔍 检查环境

### 检查 Python

打开命令行，运行：
```bash
python --version
```
应该显示类似：`Python 3.x.x`

如果没有安装，请访问：https://www.python.org/downloads/

### 检查 Node.js

```bash
node --version
npm --version
```
应该显示版本号。

如果没有安装，请访问：https://nodejs.org/

### 检查 Chrome

确保已安装 Google Chrome 浏览器。

## 📦 安装步骤

### Windows 用户（推荐）

#### 方法一：使用一键安装脚本

1. 下载或克隆项目到本地
2. 双击运行 `install.bat`
3. 等待安装完成
4. 双击运行 `start-all.bat` 启动项目

#### 方法二：手动安装

1. **创建 Python 虚拟环境**
```bash
cd WebTwin
python -m venv venv
```

2. **激活虚拟环境**
```bash
.\venv\Scripts\activate
```

3. **安装 Python 依赖**
```bash
pip install -r requirements.txt
pip install html5lib
```

4. **安装前端依赖**
```bash
cd frontend
npm install
```

### macOS/Linux 用户

1. **创建 Python 虚拟环境**
```bash
cd WebTwin
python3 -m venv venv
```

2. **激活虚拟环境**
```bash
source venv/bin/activate
```

3. **安装 Python 依赖**
```bash
pip install -r requirements.txt
pip install html5lib
```

4. **安装前端依赖**
```bash
cd frontend
npm install
```

## 🚀 启动项目

### Windows

#### 方法一：使用启动脚本
双击运行 `start-all.bat`

#### 方法二：手动启动

**终端 1 - 启动后端：**
```bash
cd WebTwin
.\venv\Scripts\activate
python app.py
```

**终端 2 - 启动前端：**
```bash
cd WebTwin\frontend
npm run dev
```

### macOS/Linux

**终端 1 - 启动后端：**
```bash
cd WebTwin
source venv/bin/activate
python app.py
```

**终端 2 - 启动前端：**
```bash
cd WebTwin/frontend
npm run dev
```

## 🌐 访问应用

启动成功后：
- 前端地址：http://localhost:3000
- 后端地址：http://127.0.0.1:5001

在浏览器中打开 http://localhost:3000 即可使用！

## ❗ 常见安装问题

### 问题 1: pip 安装失败

**解决方案：**
```bash
# 升级 pip
python -m pip install --upgrade pip

# 使用国内镜像源
pip install -r requirements.txt -i https://pypi.tuna.tsinghua.edu.cn/simple
```

### 问题 2: npm 安装慢或失败

**解决方案：**
```bash
# 使用淘宝镜像
npm install --registry=https://registry.npmmirror.com

# 或者使用 cnpm
npm install -g cnpm --registry=https://registry.npmmirror.com
cnpm install
```

### 问题 3: 虚拟环境激活失败（Windows）

**解决方案：**
```bash
# 以管理员身份运行 PowerShell
Set-ExecutionPolicy RemoteSigned

# 然后重新激活
.\venv\Scripts\activate
```

### 问题 4: 端口被占用

**解决方案：**

**后端端口冲突：**
修改 `app.py` 最后一行：
```python
app.run(debug=True, threaded=True, port=5002)  # 改为其他端口
```

**前端端口冲突：**
```bash
npm run dev -- -p 3001  # 使用其他端口
```

### 问题 5: Selenium 无法启动

**解决方案：**
1. 确保已安装 Chrome 浏览器
2. 检查防火墙设置
3. 尝试手动安装 ChromeDriver：
```bash
pip install webdriver-manager --upgrade
```

## 🔄 更新项目

### 更新 Python 依赖
```bash
.\venv\Scripts\activate  # Windows
source venv/bin/activate  # macOS/Linux
pip install -r requirements.txt --upgrade
```

### 更新前端依赖
```bash
cd frontend
npm update
```

## 🧹 卸载

### 删除虚拟环境
```bash
# Windows
rmdir /s venv

# macOS/Linux
rm -rf venv
```

### 删除前端依赖
```bash
cd frontend
# Windows
rmdir /s node_modules

# macOS/Linux
rm -rf node_modules
```

## 📞 获取帮助

如果遇到问题：
1. 查看 START.md 文件
2. 查看 README_CN.md 文件
3. 提交 Issue 到 GitHub

## ✅ 安装验证

安装完成后，运行以下命令验证：

```bash
# 检查 Python 依赖
pip list | grep flask
pip list | grep selenium
pip list | grep beautifulsoup4

# 检查前端依赖
cd frontend
npm list next
npm list react
```

如果所有依赖都正确显示，说明安装成功！

---

祝你使用愉快！🎉
