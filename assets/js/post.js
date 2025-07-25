// 文章详情页功能

// 获取URL参数
function getUrlParameter(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}

// 获取当前文章ID
const currentPostId = getUrlParameter('id');

// 初始化文章页面
async function initPostPage() {
    if (!currentPostId) {
        showError('文章ID不存在');
        return;
    }
    
    console.log('查找文章ID:', currentPostId);
    console.log('当前文章索引:', window.postsIndex);
    
    const post = getPostById(currentPostId);
    
    if (!post) {
        console.error('未找到文章:', currentPostId);
        if (window.postsIndex && window.postsIndex.length > 0) {
            const availableIds = window.postsIndex.map(p => p.id).join(', ');
            showError(`文章不存在。可用的文章ID: ${availableIds}`);
        } else {
            showError('文章不存在，且文章索引未加载。请刷新页面重试。');
        }
        return;
    }
    
    console.log('找到文章:', post.title);
    await renderPost(post);
    renderPostNavigation(currentPostId);
    renderRelatedPosts(post);
    renderTOC();
    await renderPostInfo(post);
    
    // 更新页面标题
    document.title = `${post.title} - ZouR-Ma 的博客`;
}

// 渲染文章内容
async function renderPost(post) {
    const postContent = document.getElementById('postContent');
    if (!postContent) return;
    
    // 显示加载状态
    postContent.innerHTML = `
        <div style="text-align: center; padding: 2rem;">
            <div style="color: var(--text-secondary);">正在加载文章内容...</div>
        </div>
    `;
    
    try {
        // 获取文章内容（支持动态加载）
        const content = await getPostContent(post);
        
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
                    <span><i class="fas fa-clock"></i>${calculateReadTime(content)}分钟阅读</span>
                </div>
                <div class="post-tags">
                    ${post.tags.map(tag => `
                        <a href="index.html?tag=${encodeURIComponent(tag)}" class="post-tag">${tag}</a>
                    `).join('')}
                </div>
            </header>
            <div class="post-content">
                ${marked.parse(content)}
            </div>
        `;
        
        postContent.innerHTML = postHTML;
        
        // 重新初始化代码高亮
        hljs.highlightAll();
        
        // 添加标题ID用于目录导航
        addHeadingIds();
        
    } catch (error) {
        console.error('渲染文章失败:', error);
        postContent.innerHTML = `
            <div style="text-align: center; padding: 2rem;">
                <h2 style="color: var(--text-secondary);">加载失败</h2>
                <p style="color: var(--text-secondary);">无法加载文章内容，请稍后重试。</p>
                <p style="color: var(--text-secondary); font-size: 0.875rem;">错误信息: ${error.message}</p>
                <p style="color: var(--text-secondary); font-size: 0.875rem;">文章路径: ${post.filePath}</p>
                <a href="index.html" style="color: var(--primary-color); text-decoration: none; margin-top: 1rem; display: inline-block;">
                    返回首页
                </a>
            </div>
        `;
    }
}

// 渲染文章导航
function renderPostNavigation(currentId) {
    const posts = window.postsIndex || [];
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
    
    const posts = window.postsIndex || [];
    
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
async function renderPostInfo(post) {
    const postDate = document.getElementById('postDate');
    const readTime = document.getElementById('readTime');
    const postTags = document.getElementById('postTags');
    
    if (postDate) {
        postDate.textContent = formatDate(post.date);
    }
    
    if (readTime) {
        // 如果post.content不存在，尝试从文件路径加载内容
        let content = post.content;
        if (!content && post.filePath && typeof window.getPostContent === 'function') {
            try {
                content = await window.getPostContent(post);
            } catch (error) {
                console.warn('无法获取文章内容用于计算阅读时间:', error);
                content = '';
            }
        }
        readTime.textContent = `${calculateReadTime(content || '')}分钟`;
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
    // 从全局作用域获取postsIndex
    if (typeof window.postsIndex !== 'undefined' && window.postsIndex.length > 0) {
        const post = window.postsIndex.find(post => post.id === id);
        if (post) {
            console.log('找到文章:', post.title, 'ID:', post.id);
            return post;
        }
    }
    
    // 如果postsIndex未定义或为空，尝试从app.js的函数获取
    if (typeof window.getPostById === 'function') {
        return window.getPostById(id);
    }
    
    console.error('未找到文章，ID:', id);
    console.log('可用的文章:', window.postsIndex);
    return null;
}

// 初始化页面
async function initPostPageWithRetry() {
    try {
        console.log('开始初始化文章页面...');
        console.log('当前URL:', window.location.href);
        console.log('文章ID:', currentPostId);
        
        // 等待文章索引加载完成
        if (!window.postsIndex || window.postsIndex.length === 0) {
            console.log('等待文章索引加载...');
            await new Promise((resolve, reject) => {
                let attempts = 0;
                const maxAttempts = 50; // 最多等待5秒
                
                const checkIndex = () => {
                    attempts++;
                    console.log(`检查文章索引 (${attempts}/${maxAttempts}):`, window.postsIndex);
                    if (window.postsIndex && window.postsIndex.length > 0) {
                        console.log('文章索引加载完成');
                        resolve();
                    } else if (attempts >= maxAttempts) {
                        reject(new Error('文章索引加载超时'));
                    } else {
                        setTimeout(checkIndex, 100);
                    }
                };
                checkIndex();
            });
        }
        
        // 确保getPostContent函数可用
        if (typeof window.getPostContent === 'undefined') {
            throw new Error('getPostContent函数未定义，请确保app.js已正确加载');
        }
        
        console.log('开始初始化文章页面...');
        await initPostPage();
        console.log('文章页面初始化完成');
        
    } catch (error) {
        console.error('初始化文章页面失败:', error);
        showError(`页面初始化失败: ${error.message}`);
    }
}

// 等待页面完全加载后再初始化
function startInitialization() {
    console.log('post.js: 开始初始化...');
    console.log('post.js: 当前URL:', window.location.href);
    console.log('post.js: 文章ID:', currentPostId);
    console.log('post.js: postsIndex状态:', window.postsIndex);
    
    // 延迟一点时间确保所有脚本都加载完成
    setTimeout(initPostPageWithRetry, 100);
}

// 立即开始初始化，不等待DOMContentLoaded
startInitialization(); 