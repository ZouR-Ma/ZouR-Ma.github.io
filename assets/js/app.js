// 博客文章数据
window.posts = [
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
    },
    {
        id: 'css-grid-layout',
        title: 'CSS Grid布局完全指南',
        date: '2024-02-20',
        tags: ['CSS', '布局', '前端'],
        excerpt: '深入讲解CSS Grid布局系统，从基础概念到高级应用，包含大量实用示例。',
        content: `# CSS Grid布局完全指南

## 什么是CSS Grid

CSS Grid是一个强大的布局系统，可以创建二维的网格布局。

## 基础概念

### Grid Container
\`\`\`css
.grid-container {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    grid-template-rows: 100px 100px;
    gap: 20px;
}
\`\`\`

### Grid Items
网格容器内的直接子元素自动成为网格项目。

## 高级特性

### 命名网格线
\`\`\`css
.grid {
    grid-template-columns: [start] 1fr [middle] 1fr [end];
    grid-template-rows: [top] 100px [bottom];
}
\`\`\`

### 网格区域
\`\`\`css
.grid {
    grid-template-areas: 
        "header header"
        "sidebar main"
        "footer footer";
}
\`\`\`

## 实用示例

### 响应式布局
\`\`\`css
.responsive-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 20px;
}
\`\`\`

## 总结

CSS Grid是现代Web布局的强大工具，掌握它可以创建复杂的响应式布局。`
    },
    {
        id: 'javascript-es6-features',
        title: 'JavaScript ES6+ 核心特性详解',
        date: '2024-02-15',
        tags: ['JavaScript', 'ES6', '编程'],
        excerpt: '详细介绍JavaScript ES6及后续版本的核心特性，包括箭头函数、解构赋值、Promise等。',
        content: `# JavaScript ES6+ 核心特性详解

## 箭头函数

### 基本语法
\`\`\`javascript
// 传统函数
function add(a, b) {
    return a + b;
}

// 箭头函数
const add = (a, b) => a + b;
\`\`\`

### 特点
- 更简洁的语法
- 自动绑定this
- 不能用作构造函数

## 解构赋值

### 数组解构
\`\`\`javascript
const [a, b, c] = [1, 2, 3];
console.log(a, b, c); // 1 2 3
\`\`\`

### 对象解构
\`\`\`javascript
const { name, age } = { name: 'John', age: 30 };
console.log(name, age); // John 30
\`\`\`

## Promise和异步

### 基本用法
\`\`\`javascript
const fetchData = () => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve('数据加载完成');
        }, 1000);
    });
};

fetchData().then(data => console.log(data));
\`\`\`

## 总结

ES6+为JavaScript带来了许多强大的特性，大大提升了开发效率和代码可读性。`
    }
];

// 检查外部资源加载状态
function checkExternalResources() {
    return new Promise((resolve) => {
        const resources = [
            'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.8.0/highlight.min.js',
            'https://cdnjs.cloudflare.com/ajax/libs/marked/5.1.1/marked.min.js',
            'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css'
        ];
        
        let loadedCount = 0;
        const totalResources = resources.length;
        
        // 检查脚本是否已加载
        const checkScript = (url) => {
            const scriptName = url.split('/').pop();
            if (window.marked && scriptName.includes('marked')) return true;
            if (window.hljs && scriptName.includes('highlight')) return true;
            return false;
        };
        
        // 检查样式是否已加载
        const checkStyle = (url) => {
            const styleName = url.split('/').pop();
            return document.querySelector(`link[href*="${styleName}"]`) !== null;
        };
        
        resources.forEach(url => {
            if (url.includes('.js') && checkScript(url)) {
                loadedCount++;
            } else if (url.includes('.css') && checkStyle(url)) {
                loadedCount++;
            } else {
                // 如果资源未加载，我们继续执行，不阻塞页面
                loadedCount++;
            }
        });
        
        // 无论资源是否加载完成，都继续执行
        resolve();
    });
}

// 应用状态
let currentPage = 1;
let postsPerPage = window.CONFIG?.pagination?.postsPerPage || 5;
let currentTheme = localStorage.getItem(window.CONFIG?.theme?.storageKey || 'theme') || window.CONFIG?.theme?.default || 'light';
let filteredPosts = [];

// DOM 元素
const elements = {
    postsContainer: document.getElementById('postsContainer'),
    pagination: document.getElementById('pagination'),
    prevBtn: document.getElementById('prevBtn'),
    nextBtn: document.getElementById('nextBtn'),
    paginationInfo: document.getElementById('paginationInfo'),
    searchInput: document.getElementById('searchInput'),
    themeToggle: document.getElementById('themeToggle'),
    loadingOverlay: document.getElementById('loadingOverlay'),
    tagCloud: document.getElementById('tagCloud'),
    recentPostsList: document.getElementById('recentPostsList'),
    archiveList: document.getElementById('archiveList'),
    yearStats: document.getElementById('yearStats'),
    categoryStats: document.getElementById('categoryStats')
};

// 初始化应用
async function initApp() {
    try {
        showLoading();
        
        // 检查外部资源加载状态（不阻塞页面加载）
        await checkExternalResources();
        
        // 确保posts数据已加载
        if (!window.posts || window.posts.length === 0) {
            throw new Error('文章数据未加载');
        }
        
        // 检查必要的DOM元素是否存在（根据页面类型）
        if (window.location.pathname.includes('archive.html')) {
            if (!document.getElementById('archiveList')) {
                throw new Error('归档页面必要的DOM元素未找到');
            }
        } else {
            if (!document.getElementById('postsContainer')) {
                throw new Error('首页必要的DOM元素未找到');
            }
        }
        
        setupEventListeners();
        setTheme(currentTheme);
        
        // 更新页面meta信息
        updatePageMeta();
        
        // 根据当前页面初始化不同功能
        if (window.location.pathname.includes('archive.html')) {
            initArchivePage();
        } else {
            initHomePage();
        }
        
        // 检查URL参数
        const urlParams = new URLSearchParams(window.location.search);
        const tagParam = urlParams.get('tag');
        if (tagParam) {
            filterByTag(tagParam);
        }
        
    } catch (error) {
        console.error('应用初始化失败:', error);
        showError('应用加载失败，请刷新页面重试');
    } finally {
        // 确保加载动画被隐藏
        setTimeout(() => {
            hideLoading();
        }, 100);
    }
}

// 设置事件监听器
function setupEventListeners() {
    // 主题切换
    if (elements.themeToggle) {
        elements.themeToggle.addEventListener('click', toggleTheme);
    }
    
    // 搜索功能
    if (elements.searchInput) {
        elements.searchInput.addEventListener('input', debounce(handleSearch, window.CONFIG?.search?.debounceTime || 300));
    }
    
    // 分页按钮
    if (elements.prevBtn) {
        elements.prevBtn.addEventListener('click', () => changePage(currentPage - 1));
    }
    if (elements.nextBtn) {
        elements.nextBtn.addEventListener('click', () => changePage(currentPage + 1));
    }
    
    // 键盘快捷键
    document.addEventListener('keydown', handleKeyboard);
}

// 初始化首页
function initHomePage() {
    // 初始化filteredPosts
    filteredPosts = [...window.posts];
    renderPosts();
    renderPagination();
    renderTagCloud();
    renderRecentPosts();
}

// 初始化归档页
function initArchivePage() {
    renderArchive();
    renderYearStats();
    renderCategoryStats();
}

// 渲染文章列表
function renderPosts() {
    if (!elements.postsContainer) return;
    
    // 数据验证
    if (!Array.isArray(filteredPosts)) {
        console.error('filteredPosts不是数组');
        filteredPosts = [...window.posts];
    }
    
    const startIndex = (currentPage - 1) * postsPerPage;
    const endIndex = startIndex + postsPerPage;
    const pagePosts = filteredPosts.slice(startIndex, endIndex);
    
    const postsHTML = pagePosts.map(post => `
        <article class="post-card">
            <header class="post-header">
                <h2 class="post-title">
                    <a href="post.html?id=${post.id}">${post.title}</a>
                </h2>
                <div class="post-meta">
                    <span><i class="fas fa-calendar"></i>${formatDate(post.date)}</span>
                    <span><i class="fas fa-tags"></i>${post.tags.join(', ')}</span>
                </div>
                <div class="post-tags">
                    ${post.tags.map(tag => `
                        <a href="#" class="post-tag" data-tag="${tag}">${tag}</a>
                    `).join('')}
                </div>
            </header>
            <div class="post-excerpt">
                ${post.excerpt}
            </div>
            <footer class="post-footer">
                <a href="post.html?id=${post.id}" class="read-more">
                    阅读全文 <i class="fas fa-arrow-right"></i>
                </a>
            </footer>
        </article>
    `).join('');
    
    elements.postsContainer.innerHTML = postsHTML;
    
    // 添加标签点击事件
    elements.postsContainer.querySelectorAll('.post-tag').forEach(tag => {
        tag.addEventListener('click', (e) => {
            e.preventDefault();
            filterByTag(tag.dataset.tag);
        });
    });
}

// 渲染分页
function renderPagination() {
    if (!elements.pagination) return;
    
    const totalPages = Math.ceil(filteredPosts.length / postsPerPage);
    
    elements.prevBtn.disabled = currentPage <= 1;
    elements.nextBtn.disabled = currentPage >= totalPages;
    
    if (elements.paginationInfo) {
        elements.paginationInfo.textContent = `第 ${currentPage} 页，共 ${totalPages} 页`;
    }
}

// 渲染标签云
function renderTagCloud() {
    if (!elements.tagCloud) return;
    
    const tags = getAllTags();
    const tagHTML = tags.map(tag => `
        <a href="#" class="tag-cloud-item" data-tag="${tag}">${tag}</a>
    `).join('');
    
    elements.tagCloud.innerHTML = tagHTML;
    
    // 添加标签点击事件
    elements.tagCloud.querySelectorAll('.tag-cloud-item').forEach(tag => {
        tag.addEventListener('click', (e) => {
            e.preventDefault();
            filterByTag(tag.dataset.tag);
        });
    });
}

// 渲染最新文章
function renderRecentPosts() {
    if (!elements.recentPostsList) return;
    
    const recentPosts = window.posts.slice(0, window.CONFIG?.pagination?.postsPerPage || 5);
    const recentHTML = recentPosts.map(post => `
        <li>
            <a href="post.html?id=${post.id}">${post.title}</a>
            <div class="date">${formatDate(post.date)}</div>
        </li>
    `).join('');
    
    elements.recentPostsList.innerHTML = recentHTML;
}

// 渲染归档页面
function renderArchive() {
    if (!elements.archiveList) return;
    
    // 使用过滤后的文章或所有文章
    const postsToRender = filteredPosts.length > 0 ? filteredPosts : window.posts;
    const groupedPosts = groupPostsByYear(postsToRender);
    
    if (Object.keys(groupedPosts).length === 0) {
        elements.archiveList.innerHTML = `
            <div style="text-align: center; padding: 3rem;">
                <h2 style="color: var(--text-secondary);">没有找到相关文章</h2>
                <p style="color: var(--text-secondary); margin-top: 1rem;">请尝试其他搜索关键词</p>
            </div>
        `;
        return;
    }
    
    const archiveHTML = Object.keys(groupedPosts).sort((a, b) => b - a).map(year => `
        <div class="archive-year">
            <div class="year-header">${year}年</div>
            <div class="archive-posts">
                ${groupedPosts[year].map(post => `
                    <div class="archive-post">
                        <a href="post.html?id=${post.id}">${post.title}</a>
                        <span class="archive-date">${formatDate(post.date)}</span>
                    </div>
                `).join('')}
            </div>
        </div>
    `).join('');
    
    elements.archiveList.innerHTML = archiveHTML;
}

// 渲染年份统计
function renderYearStats() {
    if (!elements.yearStats) return;
    
    // 使用过滤后的文章或所有文章
    const postsToRender = filteredPosts.length > 0 ? filteredPosts : window.posts;
    const yearStats = getYearStats(postsToRender);
    const statsHTML = Object.keys(yearStats).sort((a, b) => b - a).map(year => `
        <div class="stat-item">
            <span class="stat-label">${year}年</span>
            <span class="stat-count">${yearStats[year]}</span>
        </div>
    `).join('');
    
    elements.yearStats.innerHTML = statsHTML;
}

// 渲染分类统计
function renderCategoryStats() {
    if (!elements.categoryStats) return;
    
    // 使用过滤后的文章或所有文章
    const postsToRender = filteredPosts.length > 0 ? filteredPosts : window.posts;
    const categoryStats = getCategoryStats(postsToRender);
    const statsHTML = Object.keys(categoryStats).map(category => `
        <div class="stat-item">
            <span class="stat-label">${category}</span>
            <span class="stat-count">${categoryStats[category]}</span>
        </div>
    `).join('');
    
    elements.categoryStats.innerHTML = statsHTML;
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

function getAllTags() {
    const tagSet = new Set();
    window.posts.forEach(post => {
        post.tags.forEach(tag => tagSet.add(tag));
    });
    return Array.from(tagSet);
}

function groupPostsByYear(posts = window.posts) {
    const grouped = {};
    posts.forEach(post => {
        const year = new Date(post.date).getFullYear();
        if (!grouped[year]) {
            grouped[year] = [];
        }
        grouped[year].push(post);
    });
    return grouped;
}

function getYearStats(posts = window.posts) {
    const stats = {};
    posts.forEach(post => {
        const year = new Date(post.date).getFullYear();
        stats[year] = (stats[year] || 0) + 1;
    });
    return stats;
}

function getCategoryStats(posts = window.posts) {
    const stats = {};
    posts.forEach(post => {
        post.tags.forEach(tag => {
            stats[tag] = (stats[tag] || 0) + 1;
        });
    });
    return stats;
}

// 搜索处理
function handleSearch() {
    const query = elements.searchInput.value.trim().toLowerCase();
    
    if (!query) {
        filteredPosts = [...window.posts];
    } else {
        filteredPosts = window.posts.filter(post => 
            post.title.toLowerCase().includes(query) ||
            post.excerpt.toLowerCase().includes(query) ||
            post.tags.some(tag => tag.toLowerCase().includes(query))
        );
    }
    
    currentPage = 1;
    
    if (window.location.pathname.includes('archive.html')) {
        renderArchive();
        // 更新统计信息
        renderYearStats();
        renderCategoryStats();
    } else {
        renderPosts();
        renderPagination();
    }
}

// 按标签过滤
function filterByTag(tag) {
    filteredPosts = window.posts.filter(post => 
        post.tags.includes(tag)
    );
    
    currentPage = 1;
    renderPosts();
    renderPagination();
    
    // 更新搜索框
    if (elements.searchInput) {
        elements.searchInput.value = tag;
    }
}

// 分页处理
function changePage(page) {
    const totalPages = Math.ceil(filteredPosts.length / postsPerPage);
    
    if (page >= 1 && page <= totalPages) {
        currentPage = page;
        renderPosts();
        renderPagination();
        
        // 滚动到顶部
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

// 主题切换
function toggleTheme() {
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
}

// 设置主题
function setTheme(theme) {
    currentTheme = theme;
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(window.CONFIG?.theme?.storageKey || 'theme', theme);
    
    // 更新主题按钮图标
    const icon = elements.themeToggle?.querySelector('i');
    if (icon) {
        icon.className = theme === 'light' ? 'fas fa-moon' : 'fas fa-sun';
    }
}

// 键盘快捷键
function handleKeyboard(e) {
    // Ctrl/Cmd + K: 搜索
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        elements.searchInput?.focus();
    }
    
    // Ctrl/Cmd + T: 切换主题
    if ((e.ctrlKey || e.metaKey) && e.key === 't') {
        e.preventDefault();
        toggleTheme();
    }
}

// 显示加载动画
function showLoading() {
    elements.loadingOverlay?.classList.add('show');
}

// 隐藏加载动画
function hideLoading() {
    elements.loadingOverlay?.classList.remove('show');
}

// 防抖函数
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
    return window.posts.find(post => post.id === id);
}

// 更新页面meta信息
function updatePageMeta() {
    const config = window.CONFIG;
    if (!config) return;
    
    // 更新标题
    const titleElement = document.getElementById('pageTitle');
    if (titleElement) {
        titleElement.textContent = config.site.title;
    }
    
    // 更新描述
    const descElement = document.getElementById('pageDescription');
    if (descElement) {
        descElement.setAttribute('content', config.site.description);
    }
    
    // 更新Open Graph标签
    const ogTitle = document.getElementById('ogTitle');
    if (ogTitle) {
        ogTitle.setAttribute('content', config.site.title);
    }
    
    const ogDesc = document.getElementById('ogDescription');
    if (ogDesc) {
        ogDesc.setAttribute('content', config.site.description);
    }
    
    const ogUrl = document.getElementById('ogUrl');
    if (ogUrl) {
        ogUrl.setAttribute('content', config.site.url);
    }
}

// 显示错误信息
function showError(message) {
    const postsContainer = elements.postsContainer;
    if (postsContainer) {
        postsContainer.innerHTML = `
            <div style="text-align: center; padding: 3rem;">
                <h2 style="color: var(--text-secondary); margin-bottom: 1rem;">${message}</h2>
                <button onclick="location.reload()" style="
                    background-color: var(--primary-color);
                    color: white;
                    border: none;
                    padding: 0.5rem 1rem;
                    border-radius: 0.375rem;
                    cursor: pointer;
                    font-size: 0.875rem;
                ">刷新页面</button>
            </div>
        `;
    }
}

// 初始化应用
document.addEventListener('DOMContentLoaded', initApp);

// 确保页面完全加载后隐藏加载动画
window.addEventListener('load', () => {
    // 延迟一点时间确保所有资源都加载完成
    setTimeout(() => {
        hideLoading();
    }, 200);
});

// 添加错误处理，防止资源加载失败导致页面卡住
window.addEventListener('error', (event) => {
    console.warn('资源加载失败:', event.target.src || event.target.href);
    // 如果是外部资源加载失败，不影响页面功能
    if (event.target.tagName === 'LINK' || event.target.tagName === 'SCRIPT') {
        hideLoading();
    }
}); 