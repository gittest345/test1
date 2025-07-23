"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { getLoginRecords, LoginRecord } from "@/lib/login-records"

/**
 * 登录记录页面组件
 * 显示用户登录的历史记录，包括时间、IP、账号和密码
 * 该页面需要通过特定路径访问，不能从主页面直接链接
 */
export default function LoginRecordsPage() {
  const [records, setRecords] = useState<LoginRecord[]>([])
  const [isAuthorized, setIsAuthorized] = useState(false)

  // 检查是否有权限访问此页面
  useEffect(() => {
    // 检查cookie中是否有访问令牌（由中间件设置）
    // 由于cookie是httpOnly的，我们无法直接读取，但可以通过页面加载成功来判断
    // 如果中间件没有设置cookie，页面会被重定向到首页
    
    setIsAuthorized(true)
    
    // 从本地文件获取登录记录
    const fetchLoginRecords = async () => {
      try {
        const loginRecords = await getLoginRecords()
        setRecords(loginRecords)
      } catch (error) {
        console.error('Failed to fetch login records:', error)
      }
    }
    
    fetchLoginRecords()
  }, [])

  // 如果未授权，不显示任何内容
  if (!isAuthorized) {
    return null
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-bold">登录记录</CardTitle>
        </CardHeader>
        <CardContent>
          {records.length === 0 ? (
            <p className="text-center py-4 text-gray-500">暂无登录记录</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>时间</TableHead>
                  <TableHead>IP地址</TableHead>
                  <TableHead>账号</TableHead>
                  <TableHead>密码</TableHead>
                  <TableHead>首次登录</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {records.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell>{record.timestamp}</TableCell>
                    <TableCell>{record.ip}</TableCell>
                    <TableCell>{record.account}</TableCell>
                    <TableCell>{record.password}</TableCell>
                    <TableCell>
                      {record.isFirstLogin ? 
                        <span className="text-green-500 font-medium">是</span> : 
                        <span className="text-gray-500">否</span>
                      }
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}