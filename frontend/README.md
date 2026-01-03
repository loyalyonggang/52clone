# 我爱克隆 - 专业网站克隆工具

一个现代化的网站克隆工具，使用 Next.js + Tailwind CSS + Shadcn/ui 构建。

## 功能特性

- 🚀 一键克隆任何网站
- 💎 完美提取 HTML、CSS、JavaScript、图片等所有资源
- ⚡ 支持现代框架（React、Vue、Next.js、Angular）
- 🎨 使用 Selenium 渲染动态内容
- 🔒 本地处理，保护隐私
- 📦 自动打包成 ZIP 文件

## 技术栈

- **前端**: Next.js 14 + TypeScript
- **样式**: Tailwind CSS
- **组件**: Shadcn/ui
- **后端**: Flask (Python)
- **渲染**: Selenium WebDriver

## 快速开始

### 1. 安装依赖

```bash
cd frontend
npm install
```

### 2. 启动后端服务

确保 Python 后端服务正在运行（端口 5001）：

```bash
cd ..
python -m venv venv
venv\Scripts\activate  # Windows
source venv/bin/activate  # macOS/Linux
pip install -r requirements.txt
python app.py
```

### 3. 启动前端开发服务器

```bash
cd frontend
npm run dev
```

访问 http://localhost:3000

## 项目结构

```
frontend/
├── app/
│   ├── layout.tsx          # 根布局
│   ├── page.tsx            # 主页面（落地页）
│   └── globals.css         # 全局样式
├── components/
│   ├── ui/                 # Shadcn UI 组件
│   │   ├── button.tsx
│   │   └── dialog.tsx
│   └── CloneDialog.tsx     # 克隆功能对话框
├── lib/
│   └── utils.ts            # 工具函数
└── public/                 # 静态资源
```

## 使用方法

1. 点击"免费开始使用"按钮
2. 在弹出的对话框中输入要克隆的网站地址
3. 选择是否使用高级渲染模式（推荐用于现代网站）
4. 点击"开始克隆"
5. 等待处理完成，自动下载 ZIP 文件

## 构建生产版本

```bash
npm run build
npm start
```

## 环境变量

创建 `.env.local` 文件：

```env
NEXT_PUBLIC_API_URL=http://127.0.0.1:5001
```

## License

MIT
