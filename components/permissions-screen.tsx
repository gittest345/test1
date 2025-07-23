"use client";

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Check } from "lucide-react"
import { useRouter } from 'next/navigation';

import { useIsMobile } from "@/hooks/use-mobile"

// 定义组件属性类型
interface PermissionsScreenProps {
  onAllow?: () => void;
  onDeny?: () => void;
}

export default function PermissionsScreen({ onAllow, onDeny }: PermissionsScreenProps) {
  const router = useRouter();
  const basePath = router.basePath || '';
  return (
    <div className="bg-gray-50 rounded-xl overflow-hidden">
      <div className="w-full mx-auto p-4">
        {/* Header */}
        <div className="flex items-center gap-3 mb-4 md:mb-6">
          <div className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center overflow-hidden rounded-lg bg-gradient-to-br from-red-500 to-orange-500">
            <div className="w-full h-full bg-center bg-no-repeat bg-contain" 
                 style={{backgroundImage: `url('${basePath}/wz.png')`}} />
          </div>
          <div>
            <h1 className="text-base md:text-lg font-medium text-gray-900">王者荣耀</h1>
            <p className="text-xs md:text-sm text-gray-500">申请获得</p>
          </div>
        </div>

        {/* Permissions Card */}
        <Card className="bg-white shadow-sm border-gray-200">
          <CardHeader className="pb-2 md:pb-4">
            <h2 className="text-base md:text-lg font-medium text-gray-900">以下权限</h2>
          </CardHeader>
          <CardContent className="space-y-3 md:space-y-4">
            {/* Permission 1 */}
            <div className="flex items-start gap-2 md:gap-3">
              <div className="w-5 h-5 md:w-6 md:h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <Check className="w-3 h-3 md:w-4 md:h-4 text-white" />
              </div>
              <p className="text-gray-700 text-xs md:text-sm leading-relaxed">你的微信好友关系,寻找与你共同使用此应用的好友</p>
            </div>

            {/* Permission 2 */}
            <div className="flex items-start gap-2 md:gap-3">
              <div className="w-5 h-5 md:w-6 md:h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <Check className="w-3 h-3 md:w-4 md:h-4 text-white" />
              </div>
              <p className="text-gray-700 text-xs md:text-sm leading-relaxed">你的微信身份浏览视频号和观看直播</p>
            </div>
            
            {/* Permission 3 - 新增权限 */}
            <div className="flex items-start gap-2 md:gap-3">
              <div className="w-5 h-5 md:w-6 md:h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <Check className="w-3 h-3 md:w-4 md:h-4 text-white" />
              </div>
              <p className="text-gray-700 text-xs md:text-sm leading-relaxed">你的手机相册，用于上传游戏截图和分享</p>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="mt-4 md:mt-6 space-y-2 md:space-y-3">
          <Button 
            className="w-full bg-green-500 hover:bg-green-600 text-white font-medium py-2 md:py-3 rounded-lg text-sm md:text-base"
            onClick={onAllow}
          >
            允许
          </Button>
          <Button 
            variant="ghost" 
            className="w-full text-gray-600 hover:text-gray-800 font-medium py-2 md:py-3 text-sm md:text-base"
            onClick={onDeny}
          >
            拒绝
          </Button>
        </div>
      </div>
    </div>
  )
}
