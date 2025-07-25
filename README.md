# ZouR-Ma 的博客

一个现代化的个人博客网站，采用简洁优雅的设计风格，专为展示技术文章和个人思考而设计。

## ✨ 特性

- 📖 **文章展示** - 按时间顺序展示博客文章
- 🗂️ **归档功能** - 按年份和分类归档文章
- 🔍 **智能搜索** - 快速查找文章内容
- 🎨 **现代化设计** - 简洁优雅的界面设计
- 🌙 **深色/浅色主题** - 支持主题切换
- 📱 **完全响应式** - 适配各种设备
- ⚡ **代码高亮** - 支持多种编程语言
- 📋 **文章目录** - 自动生成文章目录导航
- 📄 **动态索引** - 自动扫描和索引Markdown文件
- 🔄 **分页加载** - 支持大量文章的分页显示
- 🚀 **性能优化** - 按需加载文章内容

## 📁 项目结构

```
ZouR-Ma.github.io/
├── index.html              # 首页
├── archive.html            # 归档页
├── post.html               # 文章详情页
├── assets/
│   ├── css/
│   │   ├── style.css       # 主样式文件
│   │   └── post.css        # 文章页样式
│   ├── js/
│   │   ├── app.js          # 主应用逻辑
│   │   ├── post.js         # 文章页逻辑
│   │   └── config.js       # 配置文件
│   └── images/             # 图片资源
├── content/
│   └── posts/              # 文章目录
│       ├── index.json      # 文章索引文件
│       └── 2025_07/        # 按年份组织的文章
│           └── *.md        # Markdown文章文件
├── scripts/
│   └── generate-index.js   # 索引生成脚本（Node.js）
├── package.json            # 项目配置
├── README.md               # 项目说明
└── DEPLOY.md               # 部署指南
```

## 🚀 快速开始

### 1. 克隆项目

```bash
git clone https://github.com/ZouR-Ma/ZouR-Ma.github.io.git
cd ZouR-Ma.github.io
```

### 2. 添加文章

#### 方法一：使用自动索引（推荐）

1. 在 `content/posts/` 目录下创建年份目录，如 `2025_07/`
2. 将Markdown文件放入对应目录
3. 运行索引生成脚本：

```bash
# 使用npm脚本
npm run generate-index

# 或者直接使用node
node scripts/generate-index.js
```

#### 方法二：手动编辑索引

编辑 `content/posts/index.json` 文件：

```json
{
  "posts": [
    {
      "id": "your-article-id",
      "title": "您的文章标题",
      "date": "2024-01-01",
      "tags": ["标签1", "标签2"],
      "excerpt": "文章摘要...",
      "filePath": "content/posts/2024_01/your-article.md"
    }
  ]
}
```

#### Markdown文件格式

您的Markdown文件可以包含以下元数据（可选）：

```markdown
# 文章标题

date: 2024-01-01
tags: [标签1, 标签2]

文章内容...
```

### 3. 本地预览

使用项目提供的脚本启动本地服务器：

```bash
# 使用npm脚本
npm run dev
```

然后在浏览器中访问 `http://localhost:8000`

### 4. 部署上线

推送到GitHub并启用GitHub Pages，或者部署到其他静态网站托管服务。

## 🛠️ 自定义配置

### 修改网站信息

在 `js/app.js` 中修改网站基本信息：

```javascript
// 修改个人信息
const profile = {
    name: '您的名字',
    bio: '您的简介',
    avatar: 'images/your-avatar.jpg'
};
```

### 修改主题颜色

在 `css/style.css` 中修改CSS变量：

```css
:root {
    --primary-color: #your-color;
    --primary-hover: #your-hover-color;
}
```

### 添加新功能

项目采用模块化设计，您可以轻松添加新功能：

- 在 `js/app.js` 中添加新的交互功能
- 在 `css/style.css` 中添加新的样式
- 在HTML文件中添加新的UI元素

## 📱 响应式设计

网站完全响应式，支持以下设备：

- **桌面端** - 完整功能体验
- **平板设备** - 优化的触摸交互
- **移动端** - 移动友好的界面

## ⌨️ 键盘快捷键

- `Ctrl/Cmd + K` - 打开搜索
- `Ctrl/Cmd + T` - 切换主题

## 🎨 主题支持

### 浅色主题
- 清爽的白色背景
- 深色文字，高对比度
- 适合白天使用

### 深色主题
- 护眼的深色背景
- 浅色文字，减少眼疲劳
- 适合夜间使用

## 🔧 技术栈

- **HTML5** - 语义化标记
- **CSS3** - 现代化样式和动画
- **JavaScript ES6+** - 交互功能和逻辑
- **Marked.js** - Markdown解析器
- **Highlight.js** - 代码语法高亮
- **Font Awesome** - 图标库

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

1. Fork 本项目
2. 创建您的特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交您的更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开一个 Pull Request

## 📞 联系

如果您有任何问题或建议，请通过以下方式联系：

- 创建 GitHub Issue
- 发送邮件到 [your-email@example.com]

---

⭐ 如果这个项目对您有帮助，请给它一个星标！