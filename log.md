Run echo "Starting build process..."
  echo "Starting build process..."
  echo "Next.js version:"
  npx next --version
  echo "Current next.config.mjs:"
  cat next.config.mjs
  echo "Running npm run build with verbose output:"
  npm run build -- --debug
  echo "Build completed, checking directory contents:"
  ls -la
  echo "Checking for any build output directories:"
  find . -maxdepth 2 -type d -name "*out*" -o -name "*build*" -o -name "*dist*" 2>/dev/null || echo "No common build directories found"
  echo "Checking .next directory:"
  ls -la .next/ 2>/dev/null || echo ".next directory not found"
  echo "Checking if .next/export exists:"
  ls -la .next/export/ 2>/dev/null || echo ".next/export directory not found"
  shell: /usr/bin/bash -e {0}
  env:
    GITHUB_PAGES: true
    NODE_ENV: production
Starting build process...
Next.js version:
Next.js v15.2.4
Current next.config.mjs:
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
}
export default nextConfig
Running npm run build with verbose output:
> my-v0-project@0.1.0 build
> next build --debug
 ⚠ Invalid next.config.js options detected: 
 ⚠     Unrecognized key(s) in object: 'images' at "experimental"
 ⚠ See more info here: https://nextjs.org/docs/messages/invalid-next-config
⚠ No build cache found. Please configure build caching for faster rebuilds. Read more: https://nextjs.org/docs/messages/no-cache
Attention: Next.js now collects completely anonymous telemetry regarding usage.
This information is used to shape Next.js' roadmap and prioritize features.
You can learn more, including how to opt-out if you'd not like to participate in this anonymous program, by visiting the following URL:
https://nextjs.org/telemetry
   ▲ Next.js 15.2.4
   Creating an optimized production build ...
 ✓ Compiled successfully
   Linting and checking validity of types ...
   Collecting page data ...
   Generating static pages (0/5) ...
   Generating static pages (1/5) 
   Generating static pages (2/5) 
   Generating static pages (3/5) 
 ✓ Generating static pages (5/5)
   Finalizing page optimization ...
   Collecting build traces ...
Redirects
┌ source: /test1/
├ destination: /test1
└ permanent: true
┌ source: /:path+/
├ destination: /:path+
└ permanent: true
Route (app)                                 Size  First Load JS
┌ ○ /                                    10.5 kB         118 kB
├ ○ /_not-found                            977 B         102 kB
└ ○ /login-records                       1.64 kB         109 kB
+ First Load JS shared by all             101 kB
  ├ chunks/4bd1b696-f27b9813940beee5.js  53.2 kB
  ├ chunks/684-bc7bb1d08334818c.js       45.4 kB
  └ other shared chunks (total)          1.92 kB
○  (Static)  prerendered as static content
Build completed, checking directory contents:
total 252
drwxr-xr-x  11 runner docker   4096 Jul 23 13:02 .
drwxr-xr-x   3 runner docker   4096 Jul 23 13:02 ..
drwxr-xr-x   7 runner docker   4096 Jul 23 13:02 .git
drwxr-xr-x   3 runner docker   4096 Jul 23 13:02 .github
-rw-r--r--   1 runner docker    313 Jul 23 13:02 .gitignore
drwxr-xr-x   7 runner docker   4096 Jul 23 13:03 .next
drwxr-xr-x   3 runner docker   4096 Jul 23 13:02 app
drwxr-xr-x   3 runner docker   4096 Jul 23 13:02 components
-rw-r--r--   1 runner docker    443 Jul 23 13:02 components.json
-rw-r--r--   1 runner docker    862 Jul 23 13:02 favicon.ico
drwxr-xr-x   2 runner docker   4096 Jul 23 13:02 hooks
drwxr-xr-x   2 runner docker   4096 Jul 23 13:02 lib
-rw-r--r--   1 runner docker    211 Jul 23 13:02 next-env.d.ts
-rw-r--r--   1 runner docker    180 Jul 23 13:02 next.config.js
-rw-r--r--   1 runner docker    402 Jul 23 13:02 next.config.mjs
drwxr-xr-x 190 runner docker   4096 Jul 23 13:02 node_modules
-rw-r--r--   1 runner docker 167941 Jul 23 13:02 package-lock.json
-rw-r--r--   1 runner docker   2185 Jul 23 13:02 package.json
-rw-r--r--   1 runner docker    135 Jul 23 13:02 postcss.config.mjs
drwxr-xr-x   2 runner docker   4096 Jul 23 13:02 public
-rw-r--r--   1 runner docker   2634 Jul 23 13:02 tailwind.config.ts
-rw-r--r--   1 runner docker    595 Jul 23 13:02 tsconfig.json
Checking for any build output directories:
./node_modules/package-json-from-dist
./.next/build-manifest.json
./.next/app-build-manifest.json
Checking .next directory:
total 356
drwxr-xr-x  7 runner docker   4096 Jul 23 13:03 .
drwxr-xr-x 11 runner docker   4096 Jul 23 13:02 ..
-rw-r--r--  1 runner docker     21 Jul 23 13:02 BUILD_ID
-rw-r--r--  1 runner docker   1355 Jul 23 13:02 app-build-manifest.json
-rw-r--r--  1 runner docker     98 Jul 23 13:02 app-path-routes-manifest.json
-rw-r--r--  1 runner docker    995 Jul 23 13:02 build-manifest.json
drwxr-xr-x  4 runner docker   4096 Jul 23 13:02 cache
drwxr-xr-x  2 runner docker   4096 Jul 23 13:02 diagnostics
-rw-r--r--  1 runner docker    111 Jul 23 13:02 export-marker.json
-rw-r--r--  1 runner docker    873 Jul 23 13:02 images-manifest.json
-rw-r--r--  1 runner docker   8095 Jul 23 13:03 next-minimal-server.js.nft.json
-rw-r--r--  1 runner docker  52746 Jul 23 13:03 next-server.js.nft.json
-rw-r--r--  1 runner docker     20 Jul 23 13:02 package.json
-rw-r--r--  1 runner docker   1568 Jul 23 13:02 prerender-manifest.json
-rw-r--r--  1 runner docker      2 Jul 23 13:02 react-loadable-manifest.json
-rw-r--r--  1 runner docker   8541 Jul 23 13:02 required-server-files.json
-rw-r--r--  1 runner docker   1586 Jul 23 13:02 routes-manifest.json
drwxr-xr-x  5 runner docker   4096 Jul 23 13:02 server
drwxr-xr-x  6 runner docker   4096 Jul 23 13:02 static
-rw-r--r--  1 runner docker 218470 Jul 23 13:03 trace
drwxr-xr-x  3 runner docker   4096 Jul 23 13:02 types
Checking if .next/export exists:
.next/export directory not found
0s
Run echo "Checking if out directory exists..."
Checking if out directory exists...
total 252
drwxr-xr-x  11 runner docker   4096 Jul 23 13:02 .
drwxr-xr-x   3 runner docker   4096 Jul 23 13:02 ..
drwxr-xr-x   7 runner docker   4096 Jul 23 13:02 .git
drwxr-xr-x   3 runner docker   4096 Jul 23 13:02 .github
-rw-r--r--   1 runner docker    313 Jul 23 13:02 .gitignore
drwxr-xr-x   7 runner docker   4096 Jul 23 13:03 .next
drwxr-xr-x   3 runner docker   4096 Jul 23 13:02 app
drwxr-xr-x   3 runner docker   4096 Jul 23 13:02 components
-rw-r--r--   1 runner docker    443 Jul 23 13:02 components.json
-rw-r--r--   1 runner docker    862 Jul 23 13:02 favicon.ico
drwxr-xr-x   2 runner docker   4096 Jul 23 13:02 hooks
drwxr-xr-x   2 runner docker   4096 Jul 23 13:02 lib
-rw-r--r--   1 runner docker    211 Jul 23 13:02 next-env.d.ts
-rw-r--r--   1 runner docker    180 Jul 23 13:02 next.config.js
-rw-r--r--   1 runner docker    402 Jul 23 13:02 next.config.mjs
drwxr-xr-x 190 runner docker   4096 Jul 23 13:02 node_modules
-rw-r--r--   1 runner docker 167941 Jul 23 13:02 package-lock.json
-rw-r--r--   1 runner docker   2185 Jul 23 13:02 package.json
-rw-r--r--   1 runner docker    135 Jul 23 13:02 postcss.config.mjs
drwxr-xr-x   2 runner docker   4096 Jul 23 13:02 public
-rw-r--r--   1 runner docker   2634 Jul 23 13:02 tailwind.config.ts
-rw-r--r--   1 runner docker    595 Jul 23 13:02 tsconfig.json
out directory not found
Error: Process completed with exit code 1.