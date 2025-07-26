# 静态博客项目

这是一个基于 Next.js 构建的静态博客网站，支持从本地 JSON 文件读取博客内容，并通过 GitHub Actions 自动部署到 GitHub Pages。

## 功能特性

- 📝 **静态博客** - 纯静态生成，加载速度快
- 📄 **JSON 数据源** - 博客内容存储在本地 JSON 文件中
- 🎨 **现代 UI** - 使用 Tailwind CSS 构建的响应式界面
- 🚀 **自动部署** - 推送到 GitHub 后自动部署到 GitHub Pages
- 📱 **响应式设计** - 支持桌面端和移动端

## 项目结构

```
├── app/                    # Next.js App Router 页面
│   ├── blog/[slug]/       # 博客文章详情页
│   ├── globals.css        # 全局样式
│   ├── layout.tsx         # 根布局
│   └── page.tsx           # 首页（博客列表）
├── data/                  # 数据文件
│   └── blog-posts.json    # 博客文章数据
├── lib/                   # 工具函数
│   └── blog.ts            # 博客数据处理函数
├── .github/workflows/     # GitHub Actions 工作流
│   └── deploy.yml         # 自动部署配置
└── next.config.js         # Next.js 配置
```

## 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 本地开发

```bash
npm run dev
```

访问 [http://localhost:3000](http://localhost:3000) 查看博客。

### 3. 构建静态文件

```bash
npm run build
```

构建完成后，静态文件将生成在 `out` 目录中。

## 添加博客文章

编辑 `data/blog-posts.json` 文件来添加新的博客文章：

```json
{
  "posts": [
    {
      "id": 1,
      "title": "文章标题",
      "slug": "article-slug",
      "excerpt": "文章摘要",
      "content": "文章正文内容（支持 Markdown 格式）",
      "author": "作者名称",
      "publishDate": "2024-01-15",
      "tags": ["标签1", "标签2"]
    }
  ]
}
```

## GitHub Pages 自动部署

### 配置步骤

1. **推送代码到 GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **启用 GitHub Pages**
   - 进入 GitHub 仓库设置页面
   - 找到 "Pages" 选项
   - 在 "Source" 中选择 "GitHub Actions"

3. **自动部署**
   - 每次推送到 `main` 分支时，GitHub Actions 会自动运行
   - 构建完成后，网站会自动部署到 GitHub Pages
   - 访问 `https://your-username.github.io/your-repo-name` 查看部署的网站

### 工作流说明

`.github/workflows/deploy.yml` 文件配置了自动部署流程：

- **触发条件**: 推送到 `main` 分支
- **构建环境**: Ubuntu + Node.js 18
- **构建步骤**: 
  1. 检出代码
  2. 设置 Node.js 环境
  3. 安装依赖
  4. 构建静态文件
  5. 上传到 GitHub Pages
  6. 自动部署

## 技术栈

- **框架**: Next.js 15
- **样式**: Tailwind CSS
- **语言**: TypeScript
- **部署**: GitHub Pages + GitHub Actions
- **数据**: 本地 JSON 文件

## 自定义配置

### 修改网站信息

编辑 `app/layout.tsx` 中的 metadata：

```typescript
export const metadata: Metadata = {
  title: '你的博客名称',
  description: '你的博客描述',
}
```

### 修改样式

- 全局样式: `app/globals.css`
- Tailwind 配置: `tailwind.config.ts`
- 组件样式: 直接在 JSX 中使用 Tailwind 类名

## 许可证

MIT License