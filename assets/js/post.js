// 文章详情页功能

// 获取URL参数
function getUrlParameter(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}

// 获取当前文章ID
const currentPostId = getUrlParameter('id');

// 初始化文章页面
function initPostPage() {
    if (!currentPostId) {
        showError('文章ID不存在');
        return;
    }
    
    const post = getPostById(currentPostId);
    if (!post) {
        showError('文章不存在');
        return;
    }
    
    renderPost(post);
    renderPostNavigation(currentPostId);
    renderRelatedPosts(post);
    renderTOC();
    renderPostInfo(post);
    
    // 更新页面标题
    document.title = `${post.title} - ZouR-Ma 的博客`;
}

// 渲染文章内容
function renderPost(post) {
    const postContent = document.getElementById('postContent');
    if (!postContent) return;
    
    // 设置Marked配置
    marked.setOptions({
        highlight: function(code, lang) {
            if (lang && hljs.getLanguage(lang)) {
                try {
                    return hljs.highlight(code, { language: lang }).value;
                } catch (err) {
                    console.warn('代码高亮失败:', err);
                }
            }
            return hljs.highlightAuto(code).value;
        },
        breaks: true,
        gfm: true
    });
    
    const postHTML = `
        <header class="post-header">
            <h1 class="post-title">${post.title}</h1>
            <div class="post-meta">
                <span><i class="fas fa-calendar"></i>${formatDate(post.date)}</span>
                <span><i class="fas fa-tags"></i>${post.tags.join(', ')}</span>
                <span><i class="fas fa-clock"></i>${calculateReadTime(post.content)}分钟阅读</span>
            </div>
            <div class="post-tags">
                ${post.tags.map(tag => `
                    <a href="index.html?tag=${encodeURIComponent(tag)}" class="post-tag">${tag}</a>
                `).join('')}
            </div>
        </header>
        <div class="post-content">
            ${marked.parse(post.content)}
        </div>
    `;
    
    postContent.innerHTML = postHTML;
    
    // 重新初始化代码高亮
    hljs.highlightAll();
    
    // 添加标题ID用于目录导航
    addHeadingIds();
}

// 渲染文章导航
function renderPostNavigation(currentId) {
    const posts = window.posts || [];
    const currentIndex = posts.findIndex(post => post.id === currentId);
    const prevPost = currentIndex > 0 ? posts[currentIndex - 1] : null;
    const nextPost = currentIndex < posts.length - 1 ? posts[currentIndex + 1] : null;
    
    const navPrev = document.getElementById('navPrev');
    const navNext = document.getElementById('navNext');
    
    if (navPrev) {
        if (prevPost) {
            navPrev.innerHTML = `
                <a href="post.html?id=${prevPost.id}">
                    <div class="nav-label">上一篇</div>
                    <div class="nav-title">${prevPost.title}</div>
                </a>
            `;
        } else {
            navPrev.innerHTML = `
                <div class="nav-label">上一篇</div>
                <div class="nav-title">没有更多文章</div>
            `;
            navPrev.classList.add('disabled');
        }
    }
    
    if (navNext) {
        if (nextPost) {
            navNext.innerHTML = `
                <a href="post.html?id=${nextPost.id}">
                    <div class="nav-label">下一篇</div>
                    <div class="nav-title">${nextPost.title}</div>
                </a>
            `;
        } else {
            navNext.innerHTML = `
                <div class="nav-label">下一篇</div>
                <div class="nav-title">没有更多文章</div>
            `;
            navNext.classList.add('disabled');
        }
    }
}

// 渲染相关文章
function renderRelatedPosts(currentPost) {
    const relatedPostsContainer = document.getElementById('relatedPosts');
    if (!relatedPostsContainer) return;
    
    const posts = window.posts || [];
    
    // 根据标签找到相关文章
    const relatedPosts = posts
        .filter(post => post.id !== currentPost.id)
        .filter(post => post.tags.some(tag => currentPost.tags.includes(tag)))
        .slice(0, 3);
    
    if (relatedPosts.length === 0) {
        // 如果没有相关文章，显示最新文章
        relatedPosts.push(...posts
            .filter(post => post.id !== currentPost.id)
            .slice(0, 3)
        );
    }
    
    const relatedList = relatedPostsContainer.querySelector('.related-list');
    if (relatedList) {
        const relatedHTML = relatedPosts.map(post => `
            <div class="related-item">
                <a href="post.html?id=${post.id}">${post.title}</a>
                <div class="date">${formatDate(post.date)}</div>
            </div>
        `).join('');
        
        relatedList.innerHTML = relatedHTML;
    }
}

// 渲染目录
function renderTOC() {
    const tocContent = document.getElementById('tocContent');
    if (!tocContent) return;
    
    const headings = document.querySelectorAll('.post-content h1, .post-content h2, .post-content h3');
    const tocItems = [];
    
    headings.forEach((heading, index) => {
        const id = `heading-${index}`;
        heading.id = id;
        
        tocItems.push({
            id,
            text: heading.textContent,
            level: parseInt(heading.tagName.charAt(1)),
            element: heading
        });
    });
    
    if (tocItems.length === 0) {
        tocContent.innerHTML = '<p style="color: var(--text-secondary); font-size: 0.875rem;">暂无目录</p>';
        return;
    }
    
    const tocHTML = tocItems.map(item => `
        <div class="toc-item">
            <a href="#${item.id}" class="toc-link h${item.level}" data-target="${item.id}">
                ${item.text}
            </a>
        </div>
    `).join('');
    
    tocContent.innerHTML = tocHTML;
    
    // 添加目录链接事件
    tocContent.querySelectorAll('.toc-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('data-target');
            const targetElement = document.getElementById(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
    
    // 监听滚动，高亮当前章节
    window.addEventListener('scroll', debounce(() => {
        highlightCurrentSection(tocItems);
    }, 100));
}

// 渲染文章信息
function renderPostInfo(post) {
    const postDate = document.getElementById('postDate');
    const readTime = document.getElementById('readTime');
    const postTags = document.getElementById('postTags');
    
    if (postDate) {
        postDate.textContent = formatDate(post.date);
    }
    
    if (readTime) {
        readTime.textContent = `${calculateReadTime(post.content)}分钟`;
    }
    
    if (postTags) {
        postTags.innerHTML = post.tags.map(tag => `
            <span class="tag">${tag}</span>
        `).join('');
    }
}

// 工具函数
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

function calculateReadTime(content) {
    const wordsPerMinute = 200;
    const wordCount = content.split(/\s+/).length;
    return Math.ceil(wordCount / wordsPerMinute);
}

function addHeadingIds() {
    const headings = document.querySelectorAll('.post-content h1, .post-content h2, .post-content h3');
    headings.forEach((heading, index) => {
        if (!heading.id) {
            heading.id = `heading-${index}`;
        }
    });
}

function highlightCurrentSection(tocItems) {
    const tocLinks = document.querySelectorAll('.toc-link');
    const scrollTop = window.pageYOffset;
    const windowHeight = window.innerHeight;
    
    let currentSection = null;
    
    tocItems.forEach(item => {
        const element = item.element;
        const elementTop = element.offsetTop;
        const elementHeight = element.offsetHeight;
        
        if (scrollTop >= elementTop - 100 && scrollTop < elementTop + elementHeight - 100) {
            currentSection = item.id;
        }
    });
    
    tocLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('data-target') === currentSection) {
            link.classList.add('active');
        }
    });
}

function showError(message) {
    const postContent = document.getElementById('postContent');
    if (postContent) {
        postContent.innerHTML = `
            <div style="text-align: center; padding: 3rem;">
                <h2 style="color: var(--text-secondary); margin-bottom: 1rem;">${message}</h2>
                <a href="index.html" style="color: var(--primary-color); text-decoration: none;">
                    返回首页
                </a>
            </div>
        `;
    }
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// 获取文章详情
function getPostById(id) {
    // 尝试从全局作用域获取posts
    if (typeof window.posts !== 'undefined') {
        return window.posts.find(post => post.id === id);
    }
    
    // 备用方案：重新定义posts数据
    const postsData = [
        {
            id: 'how-to-make-blog-website',
            title: '如何制作个人博客网站',
            date: '2024-02-28',
            tags: ['前端', '博客', '教程'],
            excerpt: '详细介绍了如何从零开始制作一个现代化的个人博客网站，包括技术选型、设计思路和实现步骤。',
            content: `# 如何制作个人博客网站

## 前言

在数字化时代，拥有一个个人博客网站是展示自己、分享知识和建立个人品牌的重要方式。本文将详细介绍如何从零开始制作一个现代化的个人博客网站。

## 技术选型

### 前端技术栈
- **HTML5** - 语义化标记
- **CSS3** - 现代化样式
- **JavaScript ES6+** - 交互功能
- **Markdown** - 内容编写

### 部署平台
- **GitHub Pages** - 免费静态网站托管
- **Netlify** - 现代化部署平台
- **Vercel** - 快速部署服务

## 设计思路

### 用户体验
- 简洁清晰的界面设计
- 响应式布局，适配各种设备
- 快速加载，优化性能
- 易于导航和搜索

### 功能特性
- 文章列表和详情页
- 分类和标签系统
- 搜索功能
- 归档页面
- 深色/浅色主题切换

## 实现步骤

### 1. 项目结构
\`\`\`
blog-website/
├── index.html          # 首页
├── archive.html        # 归档页
├── css/
│   └── style.css       # 样式文件
├── js/
│   └── app.js          # 应用逻辑
├── posts/              # 文章目录
└── images/             # 图片资源
\`\`\`

### 2. 创建基础页面
首先创建HTML结构，包括头部导航、主要内容区域和侧边栏。

### 3. 样式设计
使用CSS3实现现代化的设计风格，包括：
- 卡片式布局
- 渐变和阴影效果
- 平滑动画过渡
- 响应式设计

### 4. 功能实现
使用JavaScript实现交互功能：
- 文章数据管理
- 搜索和过滤
- 主题切换
- 分页功能

## 部署上线

### GitHub Pages
1. 创建GitHub仓库
2. 上传项目文件
3. 启用GitHub Pages
4. 配置自定义域名（可选）

### 性能优化
- 压缩CSS和JavaScript文件
- 优化图片大小
- 启用浏览器缓存
- 使用CDN加速

## 总结

制作个人博客网站是一个很好的学习项目，既能提升技术能力，又能建立个人品牌。通过合理的技术选型和设计思路，可以创建一个既美观又实用的博客网站。

记住，好的博客网站不仅要有漂亮的外观，更要有优质的内容和良好的用户体验。`
        },
        {
            id: 'modern-web-development',
            title: '现代Web开发技术趋势',
            date: '2024-02-25',
            tags: ['Web开发', '技术趋势', '前端'],
            excerpt: '探讨2024年Web开发领域的最新技术趋势，包括框架、工具和最佳实践。',
            content: `# 现代Web开发技术趋势

## 概述

Web开发技术日新月异，本文将探讨2024年最受关注的技术趋势和发展方向。

## 前端框架

### React 18
- 并发特性
- 自动批处理
- Suspense for Data Fetching

### Vue 3
- Composition API
- 更好的TypeScript支持
- 性能优化

### Svelte
- 编译时框架
- 更小的包体积
- 更好的性能

## 构建工具

### Vite
- 极快的开发服务器
- 优化的构建输出
- 丰富的插件生态

### Turbopack
- Rust编写的构建工具
- 更快的构建速度
- 与Webpack兼容

## 全栈开发

### Next.js 14
- App Router
- Server Components
- 更好的性能

### Nuxt 3
- Vue 3支持
- 自动导入
- 更好的开发体验

## 总结

选择合适的技术栈需要根据项目需求和团队能力来决定。`
        }
    ];
    
    return postsData.find(post => post.id === id);
}

// 初始化页面
document.addEventListener('DOMContentLoaded', initPostPage); 