# 纯前端博客项目使用指南

## 项目特点
这是一个完全基于前端的静态博客项目，无需后端服务器，可以直接部署到GitHub Pages等静态托管服务。

## 快速开始

### 1. 安装依赖
```bash
# 项目使用纯前端技术，无需安装额外依赖
# 只需要确保有Node.js环境即可
```

### 2. 生成文章索引
```bash
# 扫描posts目录并生成index.json
npm run generate-index
```

### 3. 启动开发服务器
```bash
# 启动本地开发服务器
npm run dev
# 或者
npm run serve
```

### 4. 访问网站
打开浏览器访问：`http://localhost:8000`

## 项目结构

```
ZouR-Ma.github.io/
├── index.html          # 首页
├── post.html           # 文章详情页
├── archive.html        # 归档页面
├── 404.html           # 404错误页
├── assets/            # 静态资源
│   ├── css/           # 样式文件
│   ├── js/            # JavaScript文件
│   └── images/        # 图片资源
├── content/           # 内容目录
│   └── posts/         # 文章目录
│       ├── index.json # 文章索引
│       ├── 2025_01/   # 按年月组织的文章
│       └── 2025_07/
└── scripts/           # 工具脚本
    ├── serve.js       # 开发服务器
    └── generate-index.js # 索引生成器
```

## 添加新文章

### 1. 创建文章文件
在 `content/posts/YYYY_MM/` 目录下创建 `.md` 文件

### 2. 文章格式
```markdown
# 文章标题

date: 2025-01-15
tags: [标签1, 标签2, 标签3]

文章内容...
```

### 3. 重新生成索引
```bash
npm run generate-index
```

## 部署

### GitHub Pages
1. 将项目推送到GitHub仓库
2. 在仓库设置中启用GitHub Pages
3. 选择主分支作为源

### 其他静态托管
- Netlify
- Vercel
- 任何支持静态文件的托管服务

## 技术栈

- **前端**: HTML5, CSS3, JavaScript (ES6+)
- **Markdown解析**: marked.js
- **代码高亮**: highlight.js
- **图标**: Font Awesome
- **开发服务器**: Node.js HTTP服务器

## 功能特性

- ✅ 响应式设计
- ✅ 暗色/亮色主题切换
- ✅ 文章搜索
- ✅ 标签分类
- ✅ 文章归档
- ✅ 代码高亮
- ✅ 目录导航
- ✅ 相关文章推荐

## 注意事项

1. **纯前端项目**: 无需后端服务器，所有功能都在浏览器中运行
2. **静态生成**: 文章索引通过Node.js脚本预生成
3. **兼容性**: 支持现代浏览器，建议使用Chrome、Firefox、Safari等
4. **性能**: 所有资源都是静态文件，加载速度快

## 故障排除

### 文章无法加载
1. 检查 `content/posts/index.json` 是否存在
2. 运行 `npm run generate-index` 重新生成索引
3. 检查浏览器控制台是否有错误信息

### 服务器无法启动
1. 确保Node.js已安装
2. 检查端口8000是否被占用
3. 尝试使用其他端口：`PORT=3000 npm run dev`

### 样式问题
1. 清除浏览器缓存
2. 检查CSS文件是否正确加载
3. 确认Font Awesome CDN是否可访问 