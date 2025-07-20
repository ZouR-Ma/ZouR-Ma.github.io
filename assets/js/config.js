// 网站配置文件
const CONFIG = {
    // 网站基本信息
    site: {
        title: 'ZouR-Ma 的博客',
        description: 'ZouR-Ma的个人博客，分享技术文章、学习心得和项目经验',
        url: 'https://zour-ma.github.io',
        author: 'ZouR-Ma',
        email: 'your-email@example.com'
    },
    
    // 个人信息
    profile: {
        name: 'ZouR-Ma',
        bio: '热爱技术，记录生活',
        avatar: 'assets/images/avatar.jpg',
        social: {
            github: 'https://github.com/ZouR-Ma',
            twitter: 'https://twitter.com/ZouR-Ma',
            email: 'mailto:your-email@example.com'
        }
    },
    
    // 功能配置
    features: {
        search: true,
        themeToggle: true,
        pagination: true,
        relatedPosts: true,
        toc: true,
        keyboardShortcuts: true
    },
    
    // 分页配置
    pagination: {
        postsPerPage: 5,
        showPageNumbers: true
    },
    
    // 搜索配置
    search: {
        debounceTime: 300,
        minQueryLength: 1,
        highlightResults: true
    },
    
    // 主题配置
    theme: {
        default: 'light',
        storageKey: 'theme',
        autoDetect: true
    },
    
    // 代码高亮配置
    codeHighlight: {
        theme: 'github',
        languages: ['javascript', 'css', 'html', 'markdown', 'bash', 'json']
    },
    
    // 性能配置
    performance: {
        lazyLoading: true,
        imageOptimization: true,
        cacheStrategy: 'network-first'
    },
    
    // 分析配置
    analytics: {
        enabled: false,
        googleAnalytics: '',
        baiduAnalytics: ''
    },
    
    // 评论配置
    comments: {
        enabled: false,
        provider: 'gitalk', // gitalk, utterances, disqus
        config: {}
    },
    
    // 部署配置
    deploy: {
        platform: 'github-pages',
        branch: 'main',
        domain: ''
    }
};

// 导出配置
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CONFIG;
} else {
    window.CONFIG = CONFIG;
} 