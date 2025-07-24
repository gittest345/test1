"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { LoginRecord } from "@/lib/login-records"
import { 
  getLoginRecordsFromGist, 
  clearLoginRecordsFromGist, 
  generateTestRecordsToGist
} from "@/lib/gist-storage"
import { toast } from "sonner"

/**
 * 登录记录页面组件
 * 显示用户登录的历史记录，包括时间、IP、账号和密码
 * 该页面需要通过特定路径访问，不能从主页面直接链接
 */
export default function LoginRecordsPage() {
  const [records, setRecords] = useState<LoginRecord[]>([])
  const [isAuthorized, setIsAuthorized] = useState(false)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [totalRecords, setTotalRecords] = useState(0)

  // 固定的管理员账号密码
  const ADMIN_USERNAME = 'admin'
  const ADMIN_PASSWORD = 'admin1'

  /**
   * 处理管理员登录
   * 验证固定的账号密码
   */
  const handleAdminLogin = () => {
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      setIsAuthorized(true)
      // 登录成功，不显示弹窗提示
      // toast.success('登录成功', {
      //   description: '欢迎访问后台管理系统',
      //   duration: 2000,
      // })
      // 登录记录将通过useEffect自动获取
    } else {
      toast.error('登录失败', {
        description: '用户名或密码错误',
        duration: 3000,
      })
      setUsername('')
      setPassword('')
    }
  }

  /**
   * 从 Gist 获取登录记录数据
   */
  const fetchLoginRecords = async () => {
    try {
      console.log('开始从 Gist 获取登录记录...')
      
      const loginRecords = await getLoginRecordsFromGist()
      console.log('从 Gist 获取到的登录记录:', loginRecords)
      console.log('记录数量:', loginRecords.length)
      
      setRecords(loginRecords)
      setTotalRecords(loginRecords.length)
      
      // 数据加载成功，不显示弹窗提示
      // if (loginRecords.length > 0) {
      //   toast.success('数据加载成功', {
      //     description: `共找到 ${loginRecords.length} 条登录记录`,
      //     duration: 2000,
      //   })
      // } else {
      //   toast.info('暂无数据', {
      //     description: '没有找到登录记录，请先进行登录测试',
      //     duration: 3000,
      //   })
      // }
    } catch (error) {
      console.error('从 Gist 获取登录记录失败:', error)
      toast.error('获取数据失败', {
        description: '无法从 Gist 加载登录记录',
        duration: 3000,
      })
    }
  }

  /**
   * 生成测试数据到 Gist
   */
  const handleGenerateTestData = async () => {
    try {
      await generateTestRecordsToGist(30)
      toast.success('测试数据生成成功', {
        description: '已生成30条测试登录记录到 Gist',
        duration: 2000,
      })
      // 重新获取数据
      await fetchLoginRecords()
      // 重置分页到第一页
      setCurrentPage(1)
    } catch (error) {
      console.error('生成测试数据到 Gist 失败:', error)
      toast.error('生成测试数据失败', {
        description: '无法生成测试数据到 Gist',
        duration: 3000,
      })
    }
  }

  /**
   * 清空 Gist 中的所有数据
   */
  const handleClearData = async () => {
    try {
      await clearLoginRecordsFromGist()
      setRecords([])
      setTotalRecords(0)
      setCurrentPage(1)
      toast.success('数据清空成功', {
        description: '已清空 Gist 中的所有登录记录',
        duration: 2000,
      })
    } catch (error) {
      console.error('清空 Gist 数据失败:', error)
      toast.error('清空数据失败', {
        description: '无法清除 Gist 中的登录记录',
        duration: 3000,
      })
    }
  }

  // 计算分页数据
  const totalPages = Math.ceil(totalRecords / pageSize)
  const startIndex = (currentPage - 1) * pageSize
  const endIndex = startIndex + pageSize
  const currentRecords = records.slice(startIndex, endIndex)

  // 处理页码变化
  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  // 处理每页显示条数变化
  const handlePageSizeChange = (size: string) => {
    setPageSize(parseInt(size))
    setCurrentPage(1) // 重置到第一页
  }

  // 生成页码按钮
  const generatePageNumbers = () => {
    const pages = []
    const maxVisiblePages = 5
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i)
        }
        pages.push('...')
        pages.push(totalPages)
      } else if (currentPage >= totalPages - 2) {
        pages.push(1)
        pages.push('...')
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i)
        }
      } else {
        pages.push(1)
        pages.push('...')
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i)
        }
        pages.push('...')
        pages.push(totalPages)
      }
    }
    
    return pages
  }

  // 检查是否有权限访问此页面
  useEffect(() => {
    // 默认未授权，需要通过登录验证
    setIsAuthorized(false)
  }, [])

  // 在用户授权后获取数据
  useEffect(() => {
    if (isAuthorized) {
      fetchLoginRecords()
    }
  }, [isAuthorized])

  // 如果未授权，显示登录表单
  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-center">后台管理系统</CardTitle>
              <p className="text-center text-gray-600">请输入管理员账号密码</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">用户名</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="请输入用户名"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAdminLogin()}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">密码</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="请输入密码"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAdminLogin()}
                />
              </div>
              <Button 
                className="w-full" 
                onClick={handleAdminLogin}
                disabled={!username || !password}
              >
                登录
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">后台管理系统</h1>
        <Button 
          variant="outline" 
          onClick={() => {
            setIsAuthorized(false)
            setUsername('')
            setPassword('')
            setRecords([])
            setCurrentPage(1)
            setTotalRecords(0)
          }}
        >
          退出登录
        </Button>
      </div>


      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-xl font-bold">登录记录</CardTitle>
            <div className="flex space-x-2">
               {/* 清空数据按钮已隐藏 */}
               {/* <Button 
                 variant="destructive" 
                 size="sm"
                 onClick={handleClearData}
               >
                 清空所有数据
               </Button> */}
               {/* 生成测试数据按钮已隐藏 */}
               {/* <Button 
                 variant="outline" 
                 size="sm"
                 onClick={handleGenerateTestData}
               >
                 生成测试数据
               </Button> */}
               <Button 
                 variant="outline" 
                 size="sm"
                 onClick={fetchLoginRecords}
               >
                 刷新数据
               </Button>
             </div>
          </div>
        </CardHeader>
        <CardContent>
          {records.length === 0 ? (
            <p className="text-center py-4 text-gray-500">暂无登录记录</p>
          ) : (
            <div className="space-y-4">
              {/* 分页控制栏 */}
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">每页显示</span>
                  <Select value={pageSize.toString()} onValueChange={handlePageSizeChange}>
                    <SelectTrigger className="w-20">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="5">5</SelectItem>
                      <SelectItem value="10">10</SelectItem>
                      <SelectItem value="20">20</SelectItem>
                      <SelectItem value="50">50</SelectItem>
                    </SelectContent>
                  </Select>
                  <span className="text-sm text-gray-600">条</span>
                </div>
                <div className="text-sm text-gray-600">
                  共 {totalRecords} 条记录，第 {currentPage} / {totalPages} 页
                </div>
              </div>

              {/* 数据表格 */}
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
                  {currentRecords.map((record) => (
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

              {/* 分页导航 */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    上一页
                  </Button>
                  
                  {generatePageNumbers().map((page, index) => (
                    <div key={index}>
                      {page === '...' ? (
                        <span className="px-2 text-gray-400">...</span>
                      ) : (
                        <Button
                          variant={currentPage === page ? "default" : "outline"}
                          size="sm"
                          onClick={() => handlePageChange(page as number)}
                          className="min-w-[32px]"
                        >
                          {page}
                        </Button>
                      )}
                    </div>
                  ))}
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    下一页
                  </Button>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}