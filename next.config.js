/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  distDir: 'out',
  images: { unoptimized: true },
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
  devIndicators: false,
  // GitHub Pages 部署配置
  basePath: process.env.NODE_ENV === 'production' ? '/test1' : '',
  assetPrefix: process.env.NODE_ENV === 'production' ? '/test1/' : '',
};

module.exports = nextConfig;