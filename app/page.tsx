"use client"

import LoginForm from "@/components/login-form"
import PermissionsScreen from "@/components/permissions-screen"
import { useState, useEffect } from "react"

export default function Page() {
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [windowHeight, setWindowHeight] = useState(0);
  
  // 监听窗口大小变化，更新高度
  useEffect(() => {
    // 初始化窗口高度
    setWindowHeight(window.innerHeight);
    
    // 监听窗口大小变化
    const handleResize = () => {
      setWindowHeight(window.innerHeight);
    };
    
    window.addEventListener('resize', handleResize);
    
    // 清理函数
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  
  // 处理权限屏幕按钮点击
  const handlePermissionAllow = () => {
    setShowLoginForm(true);
  };
  
  const handlePermissionDeny = () => {
    // 在浏览器环境中退出网页
    if (typeof window !== "undefined") {
      window.close();
      // 如果window.close()不起作用（现代浏览器限制），提供返回上一页的选项
      window.history.back();
    }
  };
  
  return (
    <div 
      className={`relative flex items-start justify-center w-full overflow-hidden ${
        !showLoginForm ? 'bg-gray-100' : 'bg-gradient-to-b from-slate-800 to-slate-900'
      }`}
      style={{ height: windowHeight ? `${windowHeight}px` : '100vh' }}
    >
      
      {/* 内容区域 */}
      <div className="relative w-full max-w-md mx-auto px-4 pt-4">
        {!showLoginForm ? (
          <PermissionsScreen onAllow={handlePermissionAllow} onDeny={handlePermissionDeny} />
        ) : (
          <LoginForm />
        )}
      </div>
    </div>
  )
}
