# GitHub Token 配置说明

## 🔑 Token 配置位置

**重要：** 在使用本项目前，您需要配置 GitHub Personal Access Token。

### 配置步骤：

1. **编辑环境变量文件**
   - 打开项目根目录下的 `.env.local` 文件
   - 找到以下行：
   ```bash
   # GITHUB_TOKEN=your_github_token_here
   ```

2. **获取 GitHub Token**
   - 访问 GitHub Settings > Developer settings > Personal access tokens
   - 创建新的 token，确保勾选 `gist` 权限
   - 复制生成的 token

3. **配置 Token**
   - 将 `.env.local` 文件中的注释行修改为：
   ```bash
   GITHUB_TOKEN=你的实际token
   ```
   - 保存文件

### 示例配置：
```bash
# GitHub Personal Access Token for Gist API
# 请在此处填入您的 GitHub Personal Access Token
GITHUB_TOKEN=ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
# 注意：请确保 token 具有 gist 权限
```

## ⚠️ 安全提醒

- **切勿将真实 token 提交到公共仓库**
- `.env.local` 文件已在 `.gitignore` 中，不会被提交
- 如需分享代码，请确保 token 已被注释或移除

## 🚀 启动项目

配置完成后，运行以下命令启动项目：

```bash
npm install
npm run dev
```

访问 `http://localhost:3000` 即可使用登录记录系统。