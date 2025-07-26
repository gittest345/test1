/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: { unoptimized: true },
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
  devIndicators: false,
  // 静态博客配置
  experimental: {
    typedRoutes: false
  },
  // 确保JSON文件可以被正确导入
  webpack: (config) => {
    config.module.rules.push({
      test: /\.json$/,
      type: 'json'
    })
    return config
  }
};

module.exports = nextConfig;