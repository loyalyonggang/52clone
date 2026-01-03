"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Download, Loader2, CheckCircle2, AlertCircle } from "lucide-react"

interface CloneDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CloneDialog({ open, onOpenChange }: CloneDialogProps) {
  const [url, setUrl] = useState("")
  const [useSelenium, setUseSelenium] = useState(true)
  const [loading, setLoading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [progressText, setProgressText] = useState("初始化...")
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")
  const [downloadUrl, setDownloadUrl] = useState("")
  const [filename, setFilename] = useState("")

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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">开始克隆网站</DialogTitle>
        </DialogHeader>

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
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
                disabled={loading}
              />
              <p className="mt-2 text-sm text-gray-500">
                输入您想要克隆的网站完整地址
              </p>
            </div>

            <div className="flex items-start space-x-3">
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
                  <span className="ml-2 px-2 py-0.5 text-xs bg-blue-100 text-blue-700 rounded">
                    推荐
                  </span>
                </label>
                <p className="text-xs text-gray-500 mt-1">
                  渲染 JavaScript 并滚动页面以捕获所有内容。推荐用于现代动态网站。
                </p>
              </div>
            </div>

            {loading && (
              <div className="space-y-4">
                <div className="flex items-center justify-center">
                  <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                </div>
                <div>
                  <p className="text-center text-gray-600 mb-2">{progressText}</p>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              </div>
            )}

            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start space-x-3">
                <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            <Button
              type="submit"
              className="w-full"
              size="lg"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  正在提取...
                </>
              ) : (
                <>
                  <Download className="mr-2 h-4 w-4" />
                  开始克隆
                </>
              )}
            </Button>
          </form>
        ) : (
          <div className="space-y-6">
            <div className="p-6 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center space-x-3 mb-4">
                <CheckCircle2 className="h-6 w-6 text-green-600" />
                <h3 className="text-lg font-bold text-green-900">
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
            >
              克隆另一个网站
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
