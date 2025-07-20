// 文章索引数据 - 动态加载
window.postsIndex = [];

// 文章目录结构
const POSTS_DIR = 'content/posts';

// 分页配置
const PAGINATION_CONFIG = {
    postsPerPage: 10,
    maxPages: 10 // 最多显示10页
};

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
let postsPerPage = PAGINATION_CONFIG.postsPerPage;
let currentTheme = localStorage.getItem(window.CONFIG?.theme?.storageKey || 'theme') || window.CONFIG?.theme?.default || 'light';
let filteredPosts = [];
let isLoading = false;
let hasMorePosts = true;

// DOM 元素
const elements = {
    postsContainer: document.getElementById('postsContainer'),
    pagination: document.getElementById('pagination'),
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
        
        // 动态加载文章索引
        await loadPostsIndex();
        
        // 确保postsIndex数据已加载
        if (!window.postsIndex || window.postsIndex.length === 0) {
            throw new Error('文章索引数据未加载');
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
    
    // 分页按钮事件在renderPagination中动态添加
    
    // 键盘快捷键
    document.addEventListener('keydown', handleKeyboard);
}

// 初始化首页
function initHomePage() {
    // 初始化filteredPosts
    filteredPosts = [...window.postsIndex];
    
    // 按日期排序，最新的在前
    filteredPosts.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    // 加载第一页
    loadPage(1);
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

// 加载指定页面的文章
async function loadPage(page) {
    if (isLoading || page < 1) return;
    
    isLoading = true;
    currentPage = page;
    
    try {
        // 显示加载状态
        if (page === 1) {
            showLoading();
        } else {
            showPageLoading();
        }
        
        // 计算当前页的文章
        const startIndex = (page - 1) * postsPerPage;
        const endIndex = startIndex + postsPerPage;
        const pagePosts = filteredPosts.slice(startIndex, endIndex);
        
        // 渲染文章列表
        await renderPosts(pagePosts, page === 1);
        
        // 更新分页信息
        renderPagination();
        
        // 滚动到顶部（如果是第一页）
        if (page === 1) {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
        
    } catch (error) {
        console.error('加载页面失败:', error);
        showError('加载页面失败，请重试');
    } finally {
        isLoading = false;
        hideLoading();
        hidePageLoading();
    }
}

// 渲染文章列表
async function renderPosts(pagePosts, isFirstPage = false) {
    if (!elements.postsContainer) return;
    
    // 数据验证
    if (!Array.isArray(pagePosts)) {
        console.error('pagePosts不是数组');
        return;
    }
    
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
    
    if (isFirstPage) {
        elements.postsContainer.innerHTML = postsHTML;
    } else {
        elements.postsContainer.innerHTML += postsHTML;
    }
    
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
    const maxDisplayPages = Math.min(totalPages, PAGINATION_CONFIG.maxPages);
    
    // 更新分页信息
    if (elements.paginationInfo) {
        elements.paginationInfo.textContent = `第 ${currentPage} 页，共 ${totalPages} 页`;
    }
    
    // 生成分页按钮
    const paginationHTML = generatePaginationButtons(currentPage, totalPages, maxDisplayPages);
    if (elements.pagination) {
        elements.pagination.innerHTML = paginationHTML;
    }
    
    // 添加分页按钮事件
    addPaginationEvents();
}

// 生成分页按钮
function generatePaginationButtons(currentPage, totalPages, maxDisplayPages) {
    if (totalPages <= 1) return '';
    
    let buttons = '';
    
    // 上一页按钮
    buttons += `
        <button class="pagination-btn prev-btn" ${currentPage <= 1 ? 'disabled' : ''}>
            <i class="fas fa-chevron-left"></i> 上一页
        </button>
    `;
    
    // 页码按钮
    const startPage = Math.max(1, currentPage - Math.floor(maxDisplayPages / 2));
    const endPage = Math.min(totalPages, startPage + maxDisplayPages - 1);
    
    for (let i = startPage; i <= endPage; i++) {
        buttons += `
            <button class="pagination-btn page-btn ${i === currentPage ? 'active' : ''}" data-page="${i}">
                ${i}
            </button>
        `;
    }
    
    // 下一页按钮
    buttons += `
        <button class="pagination-btn next-btn" ${currentPage >= totalPages ? 'disabled' : ''}>
            下一页 <i class="fas fa-chevron-right"></i>
        </button>
    `;
    
    return buttons;
}

// 添加分页事件
function addPaginationEvents() {
    const pagination = elements.pagination;
    if (!pagination) return;
    
    // 上一页
    const prevBtn = pagination.querySelector('.prev-btn');
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            if (currentPage > 1) {
                loadPage(currentPage - 1);
            }
        });
    }
    
    // 下一页
    const nextBtn = pagination.querySelector('.next-btn');
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            const totalPages = Math.ceil(filteredPosts.length / postsPerPage);
            if (currentPage < totalPages) {
                loadPage(currentPage + 1);
            }
        });
    }
    
    // 页码按钮
    const pageBtns = pagination.querySelectorAll('.page-btn');
    pageBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const page = parseInt(btn.dataset.page);
            if (page !== currentPage) {
                loadPage(page);
            }
        });
    });
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
    
    const recentPosts = window.postsIndex.slice(0, 5);
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
    const postsToRender = filteredPosts.length > 0 ? filteredPosts : window.postsIndex;
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
    const postsToRender = filteredPosts.length > 0 ? filteredPosts : window.postsIndex;
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
    const postsToRender = filteredPosts.length > 0 ? filteredPosts : window.postsIndex;
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
    window.postsIndex.forEach(post => {
        post.tags.forEach(tag => tagSet.add(tag));
    });
    return Array.from(tagSet);
}

function groupPostsByYear(posts = window.postsIndex) {
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

function getYearStats(posts = window.postsIndex) {
    const stats = {};
    posts.forEach(post => {
        const year = new Date(post.date).getFullYear();
        stats[year] = (stats[year] || 0) + 1;
    });
    return stats;
}

function getCategoryStats(posts = window.postsIndex) {
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
        filteredPosts = [...window.postsIndex];
    } else {
        filteredPosts = window.postsIndex.filter(post => 
            post.title.toLowerCase().includes(query) ||
            post.excerpt.toLowerCase().includes(query) ||
            post.tags.some(tag => tag.toLowerCase().includes(query))
        );
    }
    
    // 按日期排序，最新的在前
    filteredPosts.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    currentPage = 1;
    
    if (window.location.pathname.includes('archive.html')) {
        renderArchive();
        // 更新统计信息
        renderYearStats();
        renderCategoryStats();
    } else {
        loadPage(1);
    }
}

// 按标签过滤
function filterByTag(tag) {
    filteredPosts = window.postsIndex.filter(post => 
        post.tags.includes(tag)
    );
    
    // 按日期排序，最新的在前
    filteredPosts.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    currentPage = 1;
    loadPage(1);
    
    // 更新搜索框
    if (elements.searchInput) {
        elements.searchInput.value = tag;
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

// 显示页面加载状态
function showPageLoading() {
    if (elements.postsContainer) {
        const loadingDiv = document.createElement('div');
        loadingDiv.className = 'page-loading';
        loadingDiv.innerHTML = `
            <div style="text-align: center; padding: 2rem; color: var(--text-secondary);">
                <i class="fas fa-spinner fa-spin"></i> 加载中...
            </div>
        `;
        elements.postsContainer.appendChild(loadingDiv);
    }
}

// 隐藏页面加载状态
function hidePageLoading() {
    const loadingDiv = elements.postsContainer?.querySelector('.page-loading');
    if (loadingDiv) {
        loadingDiv.remove();
    }
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
    return window.postsIndex.find(post => post.id === id);
}

// 将getPostById函数暴露到全局作用域，供post.js使用
window.getPostById = getPostById;

// 动态扫描posts目录并加载文章索引
async function loadPostsIndex() {
    try {
        // 尝试加载文章索引文件
        console.log('尝试加载文章索引文件...');
        const indexResponse = await fetch(`${POSTS_DIR}/index.json`);
        if (indexResponse.ok) {
            const indexData = await indexResponse.json();
            window.postsIndex = indexData.posts || [];
            console.log(`从索引文件加载了 ${window.postsIndex.length} 篇文章:`, window.postsIndex.map(p => ({id: p.id, title: p.title})));
            return;
        }
        
        // 如果索引文件不存在，尝试扫描目录
        console.log('索引文件不存在，尝试扫描posts目录...');
        await scanPostsDirectory();
        
    } catch (error) {
        console.error('加载文章索引失败:', error);
        // 如果扫描失败，尝试扫描目录作为备用方案
        await scanPostsDirectory();
    }
}

// 扫描posts目录结构
async function scanPostsDirectory() {
    try {
        // 尝试获取目录列表
        const response = await fetch(`${POSTS_DIR}/`);
        if (!response.ok) {
            throw new Error('无法访问posts目录');
        }
        
        const html = await response.text();
        const posts = [];
        
        // 解析HTML中的目录链接
        const linkRegex = /<a href="([^"]+)">([^<]+)<\/a>/g;
        let match;
        
        while ((match = linkRegex.exec(html)) !== null) {
            const href = match[1];
            const name = match[2];
            
            // 跳过父目录和当前目录
            if (href === '../' || href === './' || name === 'Parent Directory') {
                continue;
            }
            
            // 检查是否是年份目录（如2025_07）
            if (href.endsWith('/') && /^\d{4}_\d{2}/.test(name)) {
                await scanYearDirectory(name, posts);
            }
        }
        
        // 按日期排序，最新的在前
        posts.sort((a, b) => new Date(b.date) - new Date(a.date));
        
        window.postsIndex = posts;
        console.log(`扫描到 ${posts.length} 篇文章`);
        
    } catch (error) {
        console.error('扫描posts目录失败:', error);
        // 如果扫描失败，使用默认文章
        window.postsIndex = [{
            id: 'trpc',
            title: '腾讯Trpc框架潜规则',
            date: '2025-07-01',
            tags: ['后端', 'Trpc', '腾讯', 'Go'],
            excerpt: '记录腾讯Trpc框架使用中的常见潜规则和默认配置，基于Trpc-go框架的实践经验总结。',
            filePath: 'content/posts/2025_07/腾讯Trpc框架潜规则.md'
        }];
    }
}

// 扫描年份目录
async function scanYearDirectory(yearDir, posts) {
    try {
        const response = await fetch(`${POSTS_DIR}/${yearDir}/`);
        if (!response.ok) return;
        
        const html = await response.text();
        const linkRegex = /<a href="([^"]+)">([^<]+)<\/a>/g;
        let match;
        
        while ((match = linkRegex.exec(html)) !== null) {
            const href = match[1];
            const name = match[2];
            
            // 跳过父目录和当前目录
            if (href === '../' || href === './' || name === 'Parent Directory') {
                continue;
            }
            
            // 检查是否是markdown文件
            if (name.endsWith('.md')) {
                const filePath = `${POSTS_DIR}/${yearDir}/${name}`;
                const postInfo = await extractPostInfo(filePath, name);
                if (postInfo) {
                    posts.push(postInfo);
                }
            }
        }
        
    } catch (error) {
        console.error(`扫描目录 ${yearDir} 失败:`, error);
    }
}

// 从markdown文件中提取文章信息
async function extractPostInfo(filePath, fileName) {
    try {
        const content = await loadMarkdownContent(filePath);
        
        // 提取标题（第一个#开头的行）
        const titleMatch = content.match(/^#\s+(.+)$/m);
        const title = titleMatch ? titleMatch[1].trim() : fileName.replace('.md', '');
        
        // 提取日期（从文件路径或内容中）
        const dateMatch = content.match(/date:\s*(\d{4}-\d{2}-\d{2})/i) || 
                         content.match(/日期:\s*(\d{4}-\d{2}-\d{2})/i);
        const date = dateMatch ? dateMatch[1] : extractDateFromPath(filePath);
        
        // 提取标签
        const tagsMatch = content.match(/tags:\s*\[([^\]]+)\]/i) || 
                         content.match(/标签:\s*\[([^\]]+)\]/i);
        const tags = tagsMatch ? 
            tagsMatch[1].split(',').map(tag => tag.trim().replace(/['"]/g, '')) : 
            ['未分类'];
        
        // 提取摘要（前200个字符）
        const excerpt = content.replace(/^#.*$/m, '').replace(/[#*`]/g, '').trim().substring(0, 200) + '...';
        
        // 生成ID - 使用更简单的逻辑，避免特殊字符问题
        let id = fileName.replace('.md', '');
        // 对于中文文件名，使用特殊处理
        if (/[\u4e00-\u9fff]/.test(id)) {
            // 如果是中文文件名，尝试从内容中提取英文标识
            const titleMatch = content.match(/^#\s+(.+)$/m);
            if (titleMatch) {
                const title = titleMatch[1].trim();
                // 提取英文部分作为ID
                const englishMatch = title.match(/[a-zA-Z]+/);
                if (englishMatch) {
                    id = englishMatch[0].toLowerCase();
                } else {
                    // 如果没有英文，使用拼音或简化的中文
                    id = 'post-' + Date.now();
                }
            } else {
                id = 'post-' + Date.now();
            }
        } else {
            // 英文文件名，转换为小写并替换特殊字符
            id = id.toLowerCase().replace(/[^a-z0-9]/g, '-');
        }
        
        return {
            id,
            title,
            date,
            tags,
            excerpt,
            filePath
        };
        
    } catch (error) {
        console.error(`提取文章信息失败 ${filePath}:`, error);
        return null;
    }
}

// 从文件路径中提取日期
function extractDateFromPath(filePath) {
    const pathMatch = filePath.match(/(\d{4})_(\d{2})/);
    if (pathMatch) {
        return `${pathMatch[1]}-${pathMatch[2]}-01`;
    }
    return new Date().toISOString().split('T')[0];
}

// 动态加载markdown文件内容
async function loadMarkdownContent(filePath) {
    try {
        const response = await fetch(filePath);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const content = await response.text();
        return content;
    } catch (error) {
        console.error('加载markdown文件失败:', error);
        return `# 加载失败

无法加载文章内容，请检查文件路径是否正确。

错误信息: ${error.message}`;
    }
}

// 获取文章内容（支持动态加载）
async function getPostContent(post) {
    if (post.content) {
        return post.content;
    } else if (post.filePath) {
        return await loadMarkdownContent(post.filePath);
    } else {
        return '文章内容不可用';
    }
}

// 将getPostContent函数暴露到全局作用域，供post.js使用
window.getPostContent = getPostContent;

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

// 为post.html页面提供初始化支持
if (window.location.pathname.includes('post.html')) {
    console.log('app.js: 检测到post.html页面，准备初始化...');
    // 在post.html页面，确保postsIndex被加载
    window.addEventListener('load', async () => {
        try {
            console.log('app.js: post.html页面load事件触发');
            console.log('app.js: 当前postsIndex状态:', window.postsIndex);
            
            if (!window.postsIndex || window.postsIndex.length === 0) {
                console.log('app.js: post.html页面：加载文章索引...');
                await loadPostsIndex();
                console.log('app.js: post.html页面：文章索引加载完成', window.postsIndex);
            } else {
                console.log('app.js: post.html页面：postsIndex已存在，无需重新加载');
            }
        } catch (error) {
            console.error('app.js: post.html页面：加载文章索引失败', error);
        }
    });
}

// 添加错误处理，防止资源加载失败导致页面卡住
window.addEventListener('error', (event) => {
    console.warn('资源加载失败:', event.target.src || event.target.href);
    // 如果是外部资源加载失败，不影响页面功能
    if (event.target.tagName === 'LINK' || event.target.tagName === 'SCRIPT') {
        hideLoading();
    }
}); 