# 项目结构说明

## 📁 目录结构

```
ZouR-Ma.github.io/
├── 📄 index.html                    # 首页 - 文章列表展示
├── 📄 archive.html                  # 归档页 - 按时间归档文章
├── 📄 post.html                     # 文章详情页 - 显示完整文章
├── 📄 README.md                     # 项目说明文档
├── 📄 DEPLOY.md                     # 部署指南
├── 📄 LICENSE                       # 开源许可证
├── 📄 config.js                     # 配置文件
├── 📄 PROJECT_STRUCTURE.md          # 项目结构说明（本文件）
│
├── 📁 assets/                       # 静态资源目录
│   ├── 📁 css/                      # 样式文件
│   │   ├── 📄 style.css             # 主样式文件
│   │   └── 📄 post.css              # 文章页专用样式
│   ├── 📁 js/                       # JavaScript文件
│   │   ├── 📄 app.js                # 主应用逻辑
│   │   └── 📄 post.js               # 文章页逻辑
│   └── 📁 images/                   # 图片资源
│       └── 📄 avatar.jpg            # 头像图片（可选）
│
└── 📁 content/                      # 内容目录
    └── 📁 posts/                    # 文章目录
        └── 📄 *.md                  # Markdown文章文件
```

## 📋 文件说明

### 🏠 页面文件

- **`index.html`** - 博客首页，展示文章列表
- **`archive.html`** - 归档页面，按时间顺序展示所有文章
- **`post.html`** - 文章详情页，显示完整的文章内容

### 🎨 样式文件

- **`assets/css/style.css`** - 主样式文件，包含全局样式和组件样式
- **`assets/css/post.css`** - 文章详情页专用样式

### ⚙️ 脚本文件

- **`assets/js/app.js`** - 主应用逻辑，处理首页和归档页功能
- **`assets/js/post.js`** - 文章详情页逻辑，处理文章渲染和导航

### 📝 内容文件

- **`content/posts/`** - 存放Markdown格式的文章文件
- **`assets/images/`** - 存放网站图片资源

### 📚 文档文件

- **`README.md`** - 项目主要说明文档
- **`DEPLOY.md`** - 部署指南和说明
- **`LICENSE`** - 开源许可证
- **`config.js`** - 网站配置文件

## 🔧 文件组织原则

### 1. 资源分离
- 所有静态资源（CSS、JS、图片）统一放在 `assets/` 目录下
- 按文件类型进一步分类：`css/`、`js/`、`images/`

### 2. 内容独立
- 文章内容独立存放在 `content/posts/` 目录
- 便于内容管理和版本控制

### 3. 功能模块化
- 不同页面的JavaScript逻辑分离
- 样式文件按功能模块划分

### 4. 文档完整
- 提供完整的项目说明和部署指南
- 便于其他开发者理解和使用

## 🚀 使用说明

### 添加新文章
1. 在 `content/posts/` 目录下创建 `.md` 文件
2. 在 `assets/js/app.js` 的 `posts` 数组中添加文章信息
3. 刷新页面查看效果

### 修改样式
1. 编辑 `assets/css/style.css` 修改全局样式
2. 编辑 `assets/css/post.css` 修改文章页样式

### 添加功能
1. 在 `assets/js/` 目录下创建新的JS文件
2. 在相应的HTML文件中引入
3. 实现具体功能逻辑

## 📝 注意事项

1. **路径引用** - 所有资源文件路径都已更新为新的目录结构
2. **文件命名** - 使用小写字母和连字符命名文件
3. **目录结构** - 保持清晰的目录层次，便于维护
4. **版本控制** - 建议将 `content/posts/` 目录加入版本控制

## 🔄 迁移说明

如果您从旧版本迁移：
1. 删除旧的 `css/`、`js/`、`images/`、`posts/` 目录
2. 确保所有HTML文件中的路径引用已更新
3. 检查 `assets/js/app.js` 中的文章数据是否正确 