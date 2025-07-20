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
    
    const post = getPostById(currentPostId);
    if (!post) {
        showError('文章不存在');
        return;
    }
    
    await renderPost(post);
    renderPostNavigation(currentPostId);
    renderRelatedPosts(post);
    renderTOC();
    renderPostInfo(post);
    
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
    // 从全局作用域获取postsIndex
    if (typeof window.postsIndex !== 'undefined') {
        return window.postsIndex.find(post => post.id === id);
    }
    
    // 如果postsIndex未定义，返回null
    return null;
}

// 初始化页面
document.addEventListener('DOMContentLoaded', () => {
    // 确保app.js已加载并且getPostContent函数可用
    if (typeof getPostContent === 'undefined') {
        console.error('getPostContent函数未定义，请确保app.js已正确加载');
        showError('页面初始化失败，请刷新页面重试');
        return;
    }
    
    initPostPage();
}); 