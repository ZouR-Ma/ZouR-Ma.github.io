# 部署指南

本指南将帮助您将 ZouR-Ma 文档中心部署到各种平台。

## 🚀 GitHub Pages 部署

### 1. 准备仓库

```bash
# 克隆项目
git clone https://github.com/ZouR-Ma/ZouR-Ma.github.io.git
cd ZouR-Ma.github.io

# 添加您的文档
# 编辑 script.js 文件，在 documents 对象中添加您的文档

# 提交更改
git add .
git commit -m "添加我的文档"
git push origin main
```

### 2. 启用 GitHub Pages

1. 进入您的 GitHub 仓库
2. 点击 "Settings" 标签
3. 滚动到 "Pages" 部分
4. 在 "Source" 下选择 "Deploy from a branch"
5. 选择 "main" 分支和 "/ (root)" 文件夹
6. 点击 "Save"

几分钟后，您的网站将在 `https://your-username.github.io` 上线。

## 🌐 Netlify 部署

### 1. 准备项目

确保您的项目包含以下文件：
- `index.html`
- `styles.css`
- `script.js`
- `config.js`（可选）

### 2. 部署步骤

1. 访问 [Netlify](https://netlify.com)
2. 点击 "New site from Git"
3. 选择您的 Git 提供商（GitHub、GitLab 等）
4. 选择您的仓库
5. 配置构建设置（对于静态网站，通常不需要）
6. 点击 "Deploy site"

### 3. 自定义域名

1. 在 Netlify 仪表板中，进入 "Domain settings"
2. 点击 "Add custom domain"
3. 按照说明配置 DNS 记录

## ☁️ Vercel 部署

### 1. 准备项目

Vercel 会自动检测静态网站，无需特殊配置。

### 2. 部署步骤

1. 访问 [Vercel](https://vercel.com)
2. 点击 "New Project"
3. 导入您的 Git 仓库
4. 保持默认设置，点击 "Deploy"

### 3. 自动部署

每次推送到主分支时，Vercel 会自动重新部署您的网站。

## 🔧 本地开发

### 1. 使用项目脚本（推荐）

```bash
# 使用项目提供的脚本
npm run dev
```

然后在浏览器中访问 `http://localhost:8000`

### 2. 使用自定义Node.js服务器

```bash
# 使用项目提供的服务器脚本
node scripts/serve.js
```

### 3. 使用 PHP

```bash
php -S localhost:8000
```

## 📱 移动端测试

### 1. 使用浏览器开发者工具

1. 打开浏览器开发者工具（F12）
2. 点击设备模拟器图标
3. 选择不同的设备尺寸进行测试

### 2. 使用真实设备

1. 确保您的电脑和设备在同一网络
2. 找到您电脑的本地 IP 地址
3. 在设备浏览器中访问 `http://your-ip:8000`

## 🔒 HTTPS 配置

### GitHub Pages

GitHub Pages 自动提供 HTTPS，无需额外配置。

### Netlify

Netlify 自动为所有网站提供 HTTPS 证书。

### Vercel

Vercel 自动为所有网站提供 HTTPS 证书。

### 自定义域名

如果您使用自定义域名，需要配置 SSL 证书：

1. **Let's Encrypt** - 免费 SSL 证书
2. **Cloudflare** - 提供免费 SSL
3. **您的域名提供商** - 通常提供 SSL 服务

## 📊 性能优化

### 1. 压缩文件

```bash
# 使用 gzip 压缩
gzip -9 index.html
gzip -9 styles.css
gzip -9 script.js
```

### 2. 图片优化

- 使用 WebP 格式
- 压缩图片大小
- 使用适当的图片尺寸

### 3. 缓存配置

在服务器配置中添加缓存头：

```nginx
# Nginx 配置示例
location ~* \.(css|js|png|jpg|jpeg|gif|ico|svg)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}
```

## 🔍 SEO 优化

### 1. 添加 Meta 标签

在 `index.html` 的 `<head>` 部分添加：

```html
<meta name="description" content="您的网站描述">
<meta name="keywords" content="关键词1,关键词2,关键词3">
<meta name="author" content="您的名字">
<meta property="og:title" content="您的网站标题">
<meta property="og:description" content="您的网站描述">
<meta property="og:image" content="您的网站图片URL">
```

### 2. 创建 sitemap.xml

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    <url>
        <loc>https://your-domain.com/</loc>
        <lastmod>2024-01-01</lastmod>
        <changefreq>weekly</changefreq>
        <priority>1.0</priority>
    </url>
</urlset>
```

### 3. 添加 robots.txt

```
User-agent: *
Allow: /
Sitemap: https://your-domain.com/sitemap.xml
```

## 🚨 故障排除

### 常见问题

1. **页面显示空白**
   - 检查浏览器控制台错误
   - 确认所有文件路径正确
   - 验证 JavaScript 语法

2. **样式没有加载**
   - 检查 CSS 文件路径
   - 确认文件编码为 UTF-8
   - 清除浏览器缓存

3. **搜索功能不工作**
   - 检查 JavaScript 文件是否正确加载
   - 确认搜索输入框 ID 正确
   - 查看控制台错误信息

4. **移动端显示异常**
   - 检查 viewport meta 标签
   - 测试不同屏幕尺寸
   - 验证 CSS 媒体查询

### 调试技巧

1. **使用浏览器开发者工具**
   - 检查网络请求
   - 查看控制台错误
   - 调试 JavaScript 代码

2. **使用在线工具**
   - [W3C Validator](https://validator.w3.org/) - HTML 验证
   - [CSS Validator](https://jigsaw.w3.org/css-validator/) - CSS 验证
   - [PageSpeed Insights](https://pagespeed.web.dev/) - 性能测试

## 📞 获取帮助

如果您在部署过程中遇到问题：

1. 查看本文档的故障排除部分
2. 检查项目的 GitHub Issues
3. 创建新的 Issue 描述您的问题
4. 联系项目维护者

---

祝您部署顺利！🎉 