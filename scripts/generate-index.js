#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// 配置
const POSTS_DIR = path.join(__dirname, '../content/posts');
const INDEX_FILE = path.join(POSTS_DIR, 'index.json');

// 从markdown文件中提取文章信息
function extractPostInfo(filePath, fileName) {
    try {
        const content = fs.readFileSync(filePath, 'utf8');
        
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
        
        // 生成ID
        const id = fileName.replace('.md', '').toLowerCase().replace(/[^a-z0-9]/g, '-');
        // 清理多余的连字符
        const cleanId = id.replace(/-+/g, '-').replace(/^-|-$/g, '');
        
        // 生成相对路径
        const relativePath = path.relative(path.join(__dirname, '..'), filePath).replace(/\\/g, '/');
        
        return {
            id: cleanId,
            title,
            date,
            tags,
            excerpt,
            filePath: relativePath
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

// 扫描年份目录
function scanYearDirectory(yearDir) {
    const yearPath = path.join(POSTS_DIR, yearDir);
    const posts = [];
    
    try {
        const files = fs.readdirSync(yearPath);
        
        files.forEach(file => {
            if (file.endsWith('.md')) {
                const filePath = path.join(yearPath, file);
                const postInfo = extractPostInfo(filePath, file);
                if (postInfo) {
                    posts.push(postInfo);
                }
            }
        });
        
    } catch (error) {
        console.error(`扫描目录 ${yearDir} 失败:`, error);
    }
    
    return posts;
}

// 扫描posts目录
function scanPostsDirectory() {
    const posts = [];
    
    try {
        const items = fs.readdirSync(POSTS_DIR);
        
        items.forEach(item => {
            const itemPath = path.join(POSTS_DIR, item);
            const stat = fs.statSync(itemPath);
            
            if (stat.isDirectory() && /^\d{4}_\d{2}/.test(item)) {
                const yearPosts = scanYearDirectory(item);
                posts.push(...yearPosts);
            }
        });
        
        // 按日期排序，最新的在前
        posts.sort((a, b) => new Date(b.date) - new Date(a.date));
        
        return posts;
        
    } catch (error) {
        console.error('扫描posts目录失败:', error);
        return [];
    }
}

// 生成索引文件
function generateIndex() {
    console.log('开始扫描posts目录...');
    
    const posts = scanPostsDirectory();
    
    const indexData = {
        posts,
        lastUpdated: new Date().toISOString(),
        totalPosts: posts.length
    };
    
    try {
        // 确保目录存在
        const dir = path.dirname(INDEX_FILE);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        
        fs.writeFileSync(INDEX_FILE, JSON.stringify(indexData, null, 2), 'utf8');
        console.log(`成功生成索引文件: ${INDEX_FILE}`);
        console.log(`共扫描到 ${posts.length} 篇文章`);
        
        // 显示文章列表
        posts.forEach((post, index) => {
            console.log(`${index + 1}. ${post.title} (${post.date})`);
        });
        
    } catch (error) {
        console.error('生成索引文件失败:', error);
    }
}

// 运行脚本
if (require.main === module) {
    generateIndex();
}

module.exports = { generateIndex, scanPostsDirectory }; 