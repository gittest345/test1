import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

/**
 * 中间件函数
 * 用于保护登录记录页面，防止未授权访问
 * @param request - Next.js请求对象
 */
export function middleware(request: NextRequest) {
  // 获取请求路径
  const path = request.nextUrl.pathname
  
  // 如果是访问登录记录页面
  if (path === '/login-records') {
    // 检查请求头中的Referer
    const referer = request.headers.get('referer') || ''
    
    // 如果有Referer，说明是从其他页面链接过来的，禁止访问
    // 只允许直接在地址栏输入URL访问
    if (referer) {
      // 重定向到首页
      return NextResponse.redirect(new URL('/', request.url))
    }
    
    // 设置访问令牌的cookie，用于页面内部验证
    const response = NextResponse.next()
    response.cookies.set('login_records_access', 'true', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 30, // 30分钟
      path: '/login-records',
    })
    
    return response
  }
  
  return NextResponse.next()
}

// 配置中间件应用的路径
export const config = {
  matcher: ['/login-records']
}