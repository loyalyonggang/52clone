"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { 
  Download, 
  Zap, 
  Shield, 
  Code2, 
  Sparkles,
  CheckCircle,
  ArrowRight,
  Loader2,
  AlertCircle
} from "lucide-react"

export default function Home() {
  const [showCloneSection, setShowCloneSection] = useState(false)
  const cloneSectionRef = useRef<HTMLDivElement>(null)
  
  // Clone form states
  const [url, setUrl] = useState("")
  const [useSelenium, setUseSelenium] = useState(true)
  const [loading, setLoading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [progressText, setProgressText] = useState("初始化...")
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")
  const [downloadUrl, setDownloadUrl] = useState("")
  const [filename, setFilename] = useState("")

  const toggleCloneSection = () => {
    setShowCloneSection(!showCloneSection)
    // 滚动到页面顶部
    if (!showCloneSection) {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const resetState = () => {
    setLoading(false)
    setProgress(0)
    setProgressText("初始化...")
    setSuccess(false)
    setError("")
    setDownloadUrl("")
    setFilename("")
  }

  const startProgressSimulation = () => {
    const maxProgress = useSelenium ? 90 : 95
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev < maxProgress) {
          if (prev < 30) {
            setProgressText("正在获取网站内容...")
            return prev + 0.5
          } else if (prev < 60) {
            setProgressText("正在提取 CSS 和 JavaScript...")
            return prev + 0.3
          } else {
            if (useSelenium) {
              setProgressText("正在渲染 JavaScript 并捕获动态内容...")
            } else {
              setProgressText("正在下载资源并创建 ZIP 文件...")
            }
            return prev + 0.1
          }
        }
        return prev
      })
    }, 100)
    return interval
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!url) {
      setError("请输入有效的网址")
      return
    }

    resetState()
    setLoading(true)

    const interval = startProgressSimulation()

    const formData = new FormData()
    formData.append("url", url)
    formData.append("use_selenium", useSelenium ? "true" : "false")

    try {
      const response = await fetch("/api/extract", {
        method: "POST",
        body: formData,
      })

      clearInterval(interval)

      if (response.ok) {
        setProgress(100)
        setProgressText("提取成功！准备下载...")

        const contentDisposition = response.headers.get("Content-Disposition")
        let fname = "website_clone.zip"

        if (contentDisposition) {
          const filenameMatch = contentDisposition.match(/filename="?([^"]+)"?/)
          if (filenameMatch && filenameMatch[1]) {
            fname = filenameMatch[1]
          }
        }

        const blob = await response.blob()
        
        if (blob.size < 1000) {
          throw new Error("服务器返回的文件无效，请重试")
        }

        const url = window.URL.createObjectURL(blob)
        setDownloadUrl(url)
        setFilename(fname)
        setSuccess(true)
        setLoading(false)

        // 自动触发下载
        const a = document.createElement("a")
        a.href = url
        a.download = fname
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)

        // 30分钟后清理
        setTimeout(() => {
          window.URL.revokeObjectURL(url)
        }, 1800000)
      } else {
        const text = await response.text()
        try {
          const data = JSON.parse(text)
          throw new Error(data.error || "提取网站失败")
        } catch {
          throw new Error(text || "提取网站失败")
        }
      }
    } catch (err: any) {
      clearInterval(interval)
      setLoading(false)
      setError(err.message || "提取网站时发生错误，请检查网址是否正确或稍后重试")
    }
  }

  const handleDownload = () => {
    if (downloadUrl && filename) {
      const a = document.createElement("a")
      a.href = downloadUrl
      a.download = filename
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <Download className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              我爱克隆
            </span>
          </div>
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-gray-600 hover:text-gray-900 transition">
              功能特性
            </a>
            <a href="#how-it-works" className="text-gray-600 hover:text-gray-900 transition">
              使用方法
            </a>
            <a href="#faq" className="text-gray-600 hover:text-gray-900 transition">
              常见问题
            </a>
            <Button onClick={toggleCloneSection} size="sm">
              免费开始
            </Button>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 md:py-32">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center space-x-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full mb-6">
            <Sparkles className="h-4 w-4" />
            <span className="text-sm font-medium">专业的网站克隆工具</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            一键克隆任何网站
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-600 mb-10 max-w-2xl mx-auto">
            完美提取 HTML、CSS、JavaScript、图片等所有资源，
            支持现代框架，让网站克隆变得简单高效
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button 
              onClick={toggleCloneSection} 
              size="xl"
              className="text-lg px-8 py-6 shadow-lg hover:shadow-xl transition-all"
            >
              <Download className="mr-2 h-5 w-5" />
              免费开始使用
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>

          <p className="mt-6 text-sm text-gray-500">
            ✨ 完全免费 · 无需注册 · 开源项目
          </p>
        </div>

        {/* Clone Section - 在 Hero 下方展开 */}
        {showCloneSection && (
          <div 
            ref={cloneSectionRef}
            className="mt-12 animate-slide-down"
          >
            <div className="max-w-3xl mx-auto">
              <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12 border-2 border-blue-500">
                <div className="text-center mb-8">
                  <h3 className="text-2xl md:text-3xl font-bold mb-2">
                    开始克隆网站
                  </h3>
                  <p className="text-gray-600">
                    输入网址，一键获取完整网站资源
                  </p>
                </div>

                {!success ? (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <label htmlFor="url" className="block text-sm font-medium mb-2">
                        网站地址
                      </label>
                      <input
                        type="url"
                        id="url"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        placeholder="https://example.com"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                        required
                        disabled={loading}
                      />
                      <p className="mt-2 text-sm text-gray-500">
                        输入您想要克隆的网站完整地址
                      </p>
                    </div>

                    <div className="flex items-start space-x-3 p-4 bg-blue-50 rounded-lg">
                      <input
                        type="checkbox"
                        id="use_selenium"
                        checked={useSelenium}
                        onChange={(e) => setUseSelenium(e.target.checked)}
                        className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        disabled={loading}
                      />
                      <div>
                        <label htmlFor="use_selenium" className="text-sm font-medium">
                          使用高级渲染 (Selenium)
                          <span className="ml-2 px-2 py-0.5 text-xs bg-blue-600 text-white rounded">
                            推荐
                          </span>
                        </label>
                        <p className="text-xs text-gray-600 mt-1">
                          渲染 JavaScript 并滚动页面以捕获所有内容。推荐用于现代动态网站。
                        </p>
                      </div>
                    </div>

                    {loading && (
                      <div className="space-y-4 p-6 bg-gray-50 rounded-lg">
                        <div className="flex items-center justify-center">
                          <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
                        </div>
                        <div>
                          <p className="text-center text-gray-700 mb-3 font-medium">{progressText}</p>
                          <div className="w-full bg-gray-200 rounded-full h-3">
                            <div
                              className="bg-gradient-to-r from-blue-600 to-purple-600 h-3 rounded-full transition-all duration-300"
                              style={{ width: `${progress}%` }}
                            />
                          </div>
                          <p className="text-center text-sm text-gray-500 mt-2">{progress}%</p>
                        </div>
                      </div>
                    )}

                    {error && (
                      <div className="p-4 bg-red-50 border-l-4 border-red-500 rounded-lg flex items-start space-x-3">
                        <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                        <p className="text-sm text-red-700">{error}</p>
                      </div>
                    )}

                    <Button
                      type="submit"
                      className="w-full"
                      size="xl"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                          正在提取...
                        </>
                      ) : (
                        <>
                          <Download className="mr-2 h-5 w-5" />
                          开始克隆
                        </>
                      )}
                    </Button>
                  </form>
                ) : (
                  <div className="space-y-6">
                    <div className="p-6 bg-green-50 border-l-4 border-green-500 rounded-lg">
                      <div className="flex items-center space-x-3 mb-4">
                        <CheckCircle className="h-8 w-8 text-green-600" />
                        <h3 className="text-xl font-bold text-green-900">
                          ✅ 网站克隆成功！
                        </h3>
                      </div>
                      <p className="text-sm text-green-700 mb-2">
                        文件已开始下载，请检查浏览器的下载文件夹。
                      </p>
                      <p className="text-sm text-green-700">
                        如果下载没有自动开始，请点击下面的按钮：
                      </p>
                    </div>

                    <Button
                      onClick={handleDownload}
                      className="w-full"
                      size="xl"
                    >
                      <Download className="mr-2 h-5 w-5" />
                      点击这里下载
                    </Button>

                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <p className="text-sm text-blue-700">
                        💡 <strong>提示：</strong>下载的 ZIP 文件包含网站的所有资源，解压后可以直接打开 index.html 查看
                      </p>
                    </div>

                    <Button
                      onClick={() => {
                        resetState()
                        setUrl("")
                      }}
                      variant="outline"
                      className="w-full"
                      size="lg"
                    >
                      克隆另一个网站
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">强大的功能特性</h2>
            <p className="text-lg text-gray-600">为什么选择我爱克隆？</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto mb-20">
            <div className="bg-white p-8 rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all">
              <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center mb-4">
                <Zap className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold mb-3">闪电般快速</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                高效的提取算法，几秒钟内完成整个网站的克隆，支持并发下载
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl border border-gray-200 hover:border-purple-300 hover:shadow-md transition-all">
              <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center mb-4">
                <Code2 className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold mb-3">支持现代框架</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                完美支持 React、Vue、Next.js、Angular 等现代 JavaScript 框架
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl border border-gray-200 hover:border-green-300 hover:shadow-md transition-all">
              <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center mb-4">
                <Shield className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-xl font-bold mb-3">安全可靠</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                本地处理，不上传任何数据到服务器，保护您的隐私安全
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl border border-gray-200 hover:border-orange-300 hover:shadow-md transition-all">
              <div className="w-12 h-12 bg-orange-50 rounded-lg flex items-center justify-center mb-4">
                <Download className="h-6 w-6 text-orange-600" />
              </div>
              <h3 className="text-xl font-bold mb-3">完整资源提取</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                提取所有 CSS、JS、图片、字体、视频等资源，保持原始结构
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl border border-gray-200 hover:border-pink-300 hover:shadow-md transition-all">
              <div className="w-12 h-12 bg-pink-50 rounded-lg flex items-center justify-center mb-4">
                <Sparkles className="h-6 w-6 text-pink-600" />
              </div>
              <h3 className="text-xl font-bold mb-3">智能渲染</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                使用 Selenium 渲染 JavaScript，捕获动态加载的内容和组件
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl border border-gray-200 hover:border-indigo-300 hover:shadow-md transition-all">
              <div className="w-12 h-12 bg-indigo-50 rounded-lg flex items-center justify-center mb-4">
                <CheckCircle className="h-6 w-6 text-indigo-600" />
              </div>
              <h3 className="text-xl font-bold mb-3">组件识别</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                自动识别并提取 UI 组件，包括导航栏、卡片、表单等
              </p>
            </div>
          </div>

          {/* 详细功能列表 */}
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h3 className="text-3xl font-bold text-gray-900">增强的提取功能</h3>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-white p-8 rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all">
                <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center mb-4">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
                <h4 className="text-xl font-bold mb-3">完整的 HTML DOM 结构</h4>
                <p className="text-gray-600 text-sm leading-relaxed">保留原始页面结构和层次</p>
              </div>

              <div className="bg-white p-8 rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all">
                <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center mb-4">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
                <h4 className="text-xl font-bold mb-3">所有 CSS 样式表</h4>
                <p className="text-gray-600 text-sm leading-relaxed">外部和内联样式全部提取</p>
              </div>

              <div className="bg-white p-8 rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all">
                <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center mb-4">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
                <h4 className="text-xl font-bold mb-3">globals.css 相关样式文件</h4>
                <p className="text-gray-600 text-sm leading-relaxed">包括全局样式和主题配置</p>
              </div>

              <div className="bg-white p-8 rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all">
                <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center mb-4">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
                <h4 className="text-xl font-bold mb-3">JavaScript 文件和功能</h4>
                <p className="text-gray-600 text-sm leading-relaxed">完整的脚本和交互逻辑</p>
              </div>

              <div className="bg-white p-8 rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all">
                <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center mb-4">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
                <h4 className="text-xl font-bold mb-3">Next.js 配置和文件</h4>
                <p className="text-gray-600 text-sm leading-relaxed">识别并提取 Next.js 特定资源</p>
              </div>

              <div className="bg-white p-8 rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all">
                <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center mb-4">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
                <h4 className="text-xl font-bold mb-3">图片配置和资源</h4>
                <p className="text-gray-600 text-sm leading-relaxed">包括响应式图片和优化配置</p>
              </div>

              <div className="bg-white p-8 rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all">
                <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center mb-4">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
                <h4 className="text-xl font-bold mb-3">元数据提取</h4>
                <p className="text-gray-600 text-sm leading-relaxed">SEO 标签、OpenGraph 等</p>
              </div>

              <div className="bg-white p-8 rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all">
                <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center mb-4">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
                <h4 className="text-xl font-bold mb-3">视频和音频文件</h4>
                <p className="text-gray-600 text-sm leading-relaxed">包括播放器组件</p>
              </div>

              <div className="bg-white p-8 rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all">
                <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center mb-4">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
                <h4 className="text-xl font-bold mb-3">SVG 图形</h4>
                <p className="text-gray-600 text-sm leading-relaxed">链接和内联 SVG 全部提取</p>
              </div>

              <div className="bg-white p-8 rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all">
                <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center mb-4">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
                <h4 className="text-xl font-bold mb-3">字体文件和字体族</h4>
                <p className="text-gray-600 text-sm leading-relaxed">自动检测和下载字体</p>
              </div>

              <div className="bg-white p-8 rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all">
                <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center mb-4">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
                <h4 className="text-xl font-bold mb-3">GIF 动画和动态内容</h4>
                <p className="text-gray-600 text-sm leading-relaxed">保留所有动画效果</p>
              </div>

              <div className="bg-white p-8 rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all">
                <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center mb-4">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
                <h4 className="text-xl font-bold mb-3">Favicon 和图标</h4>
                <p className="text-gray-600 text-sm leading-relaxed">网站图标和各种尺寸的 icon</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 bg-gradient-to-b from-blue-50 to-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">使用超级简单</h2>
            <p className="text-xl text-gray-600">只需三步，轻松克隆任何网站</p>
          </div>

          <div className="max-w-4xl mx-auto grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 text-white text-2xl font-bold">
                1
              </div>
              <h3 className="text-xl font-bold mb-2">输入网址</h3>
              <p className="text-gray-600">
                输入您想要克隆的网站地址
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 text-white text-2xl font-bold">
                2
              </div>
              <h3 className="text-xl font-bold mb-2">选择模式</h3>
              <p className="text-gray-600">
                选择是否使用高级渲染模式
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4 text-white text-2xl font-bold">
                3
              </div>
              <h3 className="text-xl font-bold mb-2">下载文件</h3>
              <p className="text-gray-600">
                等待几秒钟，下载完整的网站包
              </p>
            </div>
          </div>

          <div className="text-center mt-12">
            <Button 
              onClick={toggleCloneSection} 
              size="xl"
              className="text-lg px-8 py-6"
            >
              立即体验
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">完全免费</h2>
            <p className="text-xl text-gray-600">无需付费，无限制使用</p>
          </div>

          <div className="max-w-md mx-auto">
            <div className="p-8 rounded-2xl border-2 border-blue-500 shadow-xl">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold mb-2">免费版</h3>
                <div className="text-5xl font-bold mb-2">¥0</div>
                <p className="text-gray-600">永久免费</p>
              </div>

              <ul className="space-y-4 mb-8">
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-600 mr-3 flex-shrink-0" />
                  <span>无限次克隆</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-600 mr-3 flex-shrink-0" />
                  <span>支持所有功能</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-600 mr-3 flex-shrink-0" />
                  <span>高级渲染模式</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-600 mr-3 flex-shrink-0" />
                  <span>完整资源提取</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-600 mr-3 flex-shrink-0" />
                  <span>开源代码</span>
                </li>
              </ul>

              <Button 
                onClick={toggleCloneSection} 
                className="w-full"
                size="lg"
              >
                免费开始使用
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">常见问题</h2>
            <p className="text-lg text-gray-600">解答您的疑问</p>
          </div>

          <div className="max-w-4xl mx-auto space-y-4">
            {/* FAQ 1 */}
            <div className="bg-gray-50 rounded-lg p-6 hover:bg-gray-100 transition-colors">
              <h3 className="text-lg font-bold mb-2 flex items-start">
                <span className="text-blue-600 mr-2 flex-shrink-0">Q:</span>
                <span>什么是&ldquo;我爱克隆&rdquo;？</span>
              </h3>
              <p className="text-gray-700 ml-7 text-sm leading-relaxed">
                <span className="text-green-600 font-bold mr-2">A:</span>
                我爱克隆是一个专业的网站克隆工具，可以帮助您一键下载和保存任何网站的完整内容，包括 HTML、CSS、JavaScript、图片、字体等所有资源。非常适合学习网站设计、保存网页内容、分析竞品网站等场景。
              </p>
            </div>

            {/* FAQ 2 */}
            <div className="bg-gray-50 rounded-lg p-6 hover:bg-gray-100 transition-colors">
              <h3 className="text-lg font-bold mb-2 flex items-start">
                <span className="text-blue-600 mr-2 flex-shrink-0">Q:</span>
                <span>是否需要付费？</span>
              </h3>
              <p className="text-gray-700 ml-7 text-sm leading-relaxed">
                <span className="text-green-600 font-bold mr-2">A:</span>
                完全免费！我爱克隆是一个开源项目，所有功能都可以免费使用，没有任何限制。您可以无限次克隆网站，无需注册账号或付费。
              </p>
            </div>

            {/* FAQ 3 */}
            <div className="bg-gray-50 rounded-lg p-6 hover:bg-gray-100 transition-colors">
              <h3 className="text-lg font-bold mb-2 flex items-start">
                <span className="text-blue-600 mr-2 flex-shrink-0">Q:</span>
                <span>什么是&ldquo;高级渲染模式&rdquo;？什么时候需要使用？</span>
              </h3>
              <div className="ml-7 text-sm">
                <p className="text-gray-700 leading-relaxed mb-2">
                  <span className="text-green-600 font-bold mr-2">A:</span>
                  高级渲染模式使用 Selenium 浏览器自动化技术，可以执行网页中的 JavaScript 代码，捕获动态加载的内容。推荐在克隆以下类型的网站时使用：
                </p>
                <ul className="space-y-1 text-gray-600 ml-5">
                  <li>• React、Vue、Angular 等单页应用</li>
                  <li>• 使用 JavaScript 动态加载内容的网站</li>
                  <li>• Next.js、Nuxt.js 等现代框架构建的网站</li>
                </ul>
              </div>
            </div>

            {/* FAQ 4 */}
            <div className="bg-gray-50 rounded-lg p-6 hover:bg-gray-100 transition-colors">
              <h3 className="text-lg font-bold mb-2 flex items-start">
                <span className="text-blue-600 mr-2 flex-shrink-0">Q:</span>
                <span>克隆一个网站需要多长时间？</span>
              </h3>
              <div className="ml-7 text-sm">
                <p className="text-gray-700 leading-relaxed mb-2">
                  <span className="text-green-600 font-bold mr-2">A:</span>
                  时间取决于网站的大小和复杂度：
                </p>
                <ul className="space-y-1 text-gray-600 ml-5">
                  <li>• 小型网站（&lt; 1MB）：5-10 秒</li>
                  <li>• 中型网站（1-10MB）：15-30 秒</li>
                  <li>• 大型网站（&gt; 10MB）：30-60 秒</li>
                </ul>
              </div>
            </div>

            {/* FAQ 5 */}
            <div className="bg-gray-50 rounded-lg p-6 hover:bg-gray-100 transition-colors">
              <h3 className="text-lg font-bold mb-2 flex items-start">
                <span className="text-blue-600 mr-2 flex-shrink-0">Q:</span>
                <span>克隆的网站可以直接使用吗？</span>
              </h3>
              <p className="text-gray-700 ml-7 text-sm leading-relaxed">
                <span className="text-green-600 font-bold mr-2">A:</span>
                可以！下载的 ZIP 文件解压后，直接双击打开 index.html 文件即可在浏览器中查看克隆的网站。所有的样式、图片、脚本都已经正确链接，可以离线浏览。
              </p>
            </div>

            {/* FAQ 6 */}
            <div className="bg-gray-50 rounded-lg p-6 hover:bg-gray-100 transition-colors">
              <h3 className="text-lg font-bold mb-2 flex items-start">
                <span className="text-blue-600 mr-2 flex-shrink-0">Q:</span>
                <span>为什么有些网站克隆失败？</span>
              </h3>
              <div className="ml-7 text-sm">
                <p className="text-gray-700 leading-relaxed mb-2">
                  <span className="text-green-600 font-bold mr-2">A:</span>
                  可能的原因包括：
                </p>
                <ul className="space-y-1 text-gray-600 ml-5">
                  <li>• 网站有反爬虫保护机制</li>
                  <li>• 需要登录才能访问的内容</li>
                  <li>• 网络连接问题或超时</li>
                </ul>
                <p className="text-gray-600 mt-2 ml-5">建议：尝试勾选"高级渲染模式"，或者稍后重试。</p>
              </div>
            </div>

            {/* FAQ 7 */}
            <div className="bg-gray-50 rounded-lg p-6 hover:bg-gray-100 transition-colors">
              <h3 className="text-lg font-bold mb-2 flex items-start">
                <span className="text-blue-600 mr-2 flex-shrink-0">Q:</span>
                <span>我的数据安全吗？</span>
              </h3>
              <p className="text-gray-700 ml-7 text-sm leading-relaxed">
                <span className="text-green-600 font-bold mr-2">A:</span>
                非常安全！我爱克隆采用本地处理方式，所有的克隆操作都在您的电脑上完成，不会上传任何数据到我们的服务器。您的隐私和数据完全受到保护。
              </p>
            </div>

            {/* FAQ 8 */}
            <div className="bg-gray-50 rounded-lg p-6 hover:bg-gray-100 transition-colors">
              <h3 className="text-lg font-bold mb-2 flex items-start">
                <span className="text-blue-600 mr-2 flex-shrink-0">Q:</span>
                <span>支持哪些浏览器？</span>
              </h3>
              <div className="ml-7 text-sm">
                <p className="text-gray-700 leading-relaxed mb-2">
                  <span className="text-green-600 font-bold mr-2">A:</span>
                  我爱克隆支持所有现代浏览器，包括 Chrome / Edge（推荐）、Firefox、Safari、Opera。注意：高级渲染模式需要系统安装 Chrome 浏览器。
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Download className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold">我爱克隆</span>
            </div>
          </div>
          
          <div className="mt-8 text-center text-sm text-gray-600">
            <p>© 2024 我爱克隆. 保留所有权利.</p>
            <p className="mt-2">基于 MIT 协议开源</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
