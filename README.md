# 登录记录管理系统

一个基于 Next.js 的登录记录管理系统，使用 GitHub Gist 作为数据存储。

## 功能特性

- 🔐 模拟登录界面，记录登录信息
- 📊 后台管理系统，查看所有登录记录
- ☁️ 使用 GitHub Gist 云端存储，支持多设备数据同步
- 📱 响应式设计，支持移动端访问
- 🎨 现代化 UI 设计，基于 Tailwind CSS

## 快速开始

### 1. 克隆项目

```bash
git clone <repository-url>
cd <project-directory>
```

### 2. 安装依赖

```bash
npm install
```

### 3. 配置环境变量

1. 复制环境变量示例文件：
   ```bash
   cp .env.example .env.local
   ```

2. 获取 GitHub Personal Access Token：
   - 访问 [GitHub Settings](https://github.com/settings/tokens)
   - 点击 "Generate new token (classic)"
   - 选择 `gist` 权限
   - 复制生成的 token

3. 编辑 `.env.local` 文件，填入您的 token：
   ```
   GITHUB_TOKEN=your_github_token_here
   ```

### 4. 启动开发服务器

```bash
npm run dev
```

访问 [http://localhost:3000](http://localhost:3000) 查看应用。

## 使用说明

### 前台登录页面
- 访问首页进行模拟登录
- 支持任意用户名和密码（演示用途）
- 登录信息会自动保存到 GitHub Gist

### 后台管理页面
- 访问 `/login-records` 进入后台管理
- 默认管理员账号：`admin` / `admin123`
- 可查看所有登录记录
- 支持分页浏览和数据刷新

## 技术栈

- **框架**: Next.js 14
- **样式**: Tailwind CSS
- **UI 组件**: shadcn/ui
- **数据存储**: GitHub Gist API
- **类型检查**: TypeScript

## 项目结构

```
├── app/                    # Next.js App Router
│   ├── page.tsx           # 首页（登录界面）
│   └── login-records/     # 后台管理页面
├── components/            # React 组件
│   ├── login-form.tsx     # 登录表单组件
│   └── ui/               # UI 基础组件
├── lib/                   # 工具库
│   ├── gist-storage.ts    # GitHub Gist 存储服务
│   └── login-records.ts   # 登录记录类型定义
└── public/               # 静态资源
```

## 部署

### Vercel 部署

1. 推送代码到 GitHub
2. 在 Vercel 中导入项目
3. 在 Vercel 环境变量中设置 `GITHUB_TOKEN`
4. 部署完成

### 其他平台

确保在部署平台的环境变量中设置 `GITHUB_TOKEN`。

## 注意事项

- ⚠️ 请妥善保管您的 GitHub Token，不要提交到代码仓库
- 🔒 建议为 Token 设置适当的权限范围，仅启用 `gist` 权限
- 📝 首次运行时会自动创建 Gist，请查看控制台输出的 Gist ID
- 🌐 多设备使用时，确保使用相同的 GitHub Token 以实现数据同步

## 许可证

MIT License