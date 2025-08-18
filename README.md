# TG 代理服务

基于 Vercel 部署的 Telegram 代理服务。

## 功能特性

- 代理 `t.me/s/*` 请求
- 支持跨域访问 (CORS)
- 错误处理和超时管理
- Vercel 无服务器部署

## 快速部署

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/woleigedouer/tg-proxy)

## 本地开发

1. 克隆仓库：
```bash
git clone https://github.com/woleigedouer/tg-proxy.git
cd tg-proxy
```

2. 安装 Vercel CLI：
```bash
npm install -g vercel
```

3. 本地开发：
```bash
npm run dev
```

4. 部署到 Vercel：
```bash
npm run deploy
```

## 使用方法

将 `t.me/s/` 替换为您的部署域名：

- 原始地址：`https://t.me/s/telegram`
- 代理地址：`https://your-domain.vercel.app/s/telegram`

## API 接口

### 代理接口
- **地址**：`/s/*`
- **方法**：GET
- **说明**：代理到 `https://t.me/s/*`

### 健康检查
- **地址**：`/api/health`
- **方法**：GET
- **说明**：返回服务状态