/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // 禁用开发指示器，隐藏左下角的n按钮及相关设置
  devIndicators: false,
  // GitHub Pages 静态导出配置
  output: 'export',
  trailingSlash: true,
  distDir: 'out',   // ← 让构建结果直接落到 ./out
};

export default nextConfig;