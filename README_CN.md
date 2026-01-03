# 我爱克隆 🚀

一个专业的网站克隆工具，使用现代化技术栈构建，支持一键克隆任何网站的所有资源。

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Python](https://img.shields.io/badge/python-3.7+-blue.svg)
![Next.js](https://img.shields.io/badge/next.js-14-black.svg)

## ✨ 功能特性

- 🎯 **一键克隆** - 输入网址即可完整克隆网站
- 💎 **完整提取** - HTML、CSS、JavaScript、图片、字体、视频等所有资源
- ⚡ **智能渲染** - 使用 Selenium 渲染 JavaScript，支持现代框架
- 🎨 **现代界面** - 基于 Next.js + Tailwind CSS + Shadcn/ui 的专业落地页
- 🔒 **隐私保护** - 本地处理，不上传任何数据
- 📦 **自动打包** - 自动整理并打包成 ZIP 文件

## 🖼️ 界面预览

- **专业落地页** - 现代化设计，清晰的功能介绍
- **弹窗式克隆** - 点击按钮即可在当前页面弹出克隆功能
- **实时进度** - 显示克隆进度和状态信息
- **成功提示** - 清晰的成功提示和下载按钮

## 🚀 快速开始

### 方式一：一键安装和启动（推荐）

1. **首次安装**
```bash
# 双击运行
install.bat
```

2. **启动项目**
```bash
# 双击运行
start-all.bat
```

3. **访问应用**
打开浏览器访问：http://localhost:3000

### 方式二：手动安装

#### 1. 安装后端依赖

```bash
cd WebTwin
python -m venv venv
.\venv\Scripts\activate  # Windows
source venv/bin/activate  # macOS/Linux
pip install -r requirements.txt
pip install html5lib
```

#### 2. 安装前端依赖

```bash
cd frontend
npm install
```

#### 3. 启动服务

**启动后端（终端1）：**
```bash
cd WebTwin
.\venv\Scripts\activate
python app.py
```

**启动前端（终端2）：**
```bash
cd WebTwin/frontend
npm run dev
```

## 📖 使用说明

1. 访问 http://localhost:3000
2. 点击页面上的"免费开始使用"按钮
3. 在弹出的对话框中输入要克隆的网站地址
4. 勾选"使用高级渲染"（推荐用于 React、Vue 等现代网站）
5. 点击"开始克隆"按钮
6. 等待几秒到几十秒（取决于网站大小）
7. 自动下载 ZIP 文件到浏览器下载文件夹
8. 解压 ZIP 文件，打开 index.html 即可查看克隆的网站

## 🛠️ 技术栈

### 前端
- **框架**: Next.js 14 (React 18)
- **语言**: TypeScript
- **样式**: Tailwind CSS
- **组件**: Shadcn/ui (Radix UI)
- **图标**: Lucide React

### 后端
- **框架**: Flask (Python)
- **解析**: BeautifulSoup4
- **渲染**: Selenium WebDriver
- **请求**: Requests

## 📁 项目结构

```
WebTwin/
├── frontend/                 # Next.js 前端项目
│   ├── app/
│   │   ├── page.tsx         # 落地页
│   │   ├── layout.tsx       # 根布局
│   │   └── globals.css      # 全局样式
│   ├── components/
│   │   ├── ui/              # Shadcn UI 组件
│   │   └── CloneDialog.tsx  # 克隆功能对话框
│   └── lib/
│       └── utils.ts         # 工具函数
├── templates/               # Flask 模板（旧版）
├── app.py                   # Flask 后端主文件
├── requirements.txt         # Python 依赖
├── install.bat             # 一键安装脚本
├── start-all.bat           # 一键启动脚本
└── START.md                # 详细启动指南
```

## 🎯 支持的网站类型

- ✅ 静态网站（HTML/CSS）
- ✅ WordPress 网站
- ✅ React 应用
- ✅ Vue.js 应用
- ✅ Next.js 应用
- ✅ Angular 应用
- ✅ 使用 Tailwind CSS 的网站
- ✅ Bootstrap 网站
- ✅ 电商网站
- ✅ 博客网站

## ⚙️ 配置说明

### 后端配置
- 端口：5001（可在 app.py 中修改）
- 超时时间：20秒（可在 app.py 中调整）

### 前端配置
- 端口：3000（可通过 `npm run dev -- -p 端口号` 修改）
- API 代理：配置在 next.config.js 中

## 🔧 常见问题

### 1. 后端启动失败
- 确保已安装 Python 3.7+
- 确保已激活虚拟环境
- 确保已安装所有依赖：`pip install -r requirements.txt`

### 2. 前端启动失败
- 确保已安装 Node.js 16+
- 删除 node_modules 文件夹，重新运行 `npm install`

### 3. Selenium 无法工作
- 确保已安装 Chrome 浏览器
- Selenium 会自动下载 ChromeDriver，无需手动安装

### 4. 克隆失败
- 检查网址是否正确
- 尝试勾选"使用高级渲染"选项
- 某些网站有反爬虫保护，可能无法克隆

## 📝 开发计划

- [ ] 支持批量克隆
- [ ] 添加克隆历史记录
- [ ] 支持自定义克隆选项
- [ ] 添加预览功能
- [ ] 支持更多框架识别

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📄 许可证

MIT License - 完全开源免费

## 👨‍💻 作者

基于 WebTwin 项目改进

---

⭐ 如果这个项目对你有帮助，请给个 Star！
