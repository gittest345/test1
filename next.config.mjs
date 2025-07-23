/** @type {import('next').NextConfig} */
const nextConfig = {
  // 让 Next.js 15 静态导出到 ./out
  output: 'export',
  trailingSlash: true,
  distDir: 'out',               // ✅ 正确写法：顶层字段
  images: { unoptimized: true }, // ✅ 放在顶层，不是 experimental
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
  devIndicators: false,
};

export default nextConfig;