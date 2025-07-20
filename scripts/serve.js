#!/usr/bin/env node

const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = process.env.PORT || 8000;

// MIME类型映射
const mimeTypes = {
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.wav': 'audio/wav',
    '.mp4': 'video/mp4',
    '.woff': 'application/font-woff',
    '.ttf': 'application/font-ttf',
    '.eot': 'application/vnd.ms-fontobject',
    '.otf': 'application/font-otf',
    '.wasm': 'application/wasm',
    '.md': 'text/markdown'
};

const server = http.createServer((req, res) => {
    // 解析URL
    const parsedUrl = url.parse(req.url);
    let pathname = parsedUrl.pathname;
    
    // 默认页面
    if (pathname === '/') {
        pathname = '/index.html';
    }
    
    // 构建文件路径
    const filePath = path.join(__dirname, '..', pathname);
    
    // 获取文件扩展名
    const extname = path.extname(filePath).toLowerCase();
    const contentType = mimeTypes[extname] || 'application/octet-stream';
    
    // 读取文件
    fs.readFile(filePath, (err, data) => {
        if (err) {
            if (err.code === 'ENOENT') {
                // 文件不存在，返回404
                res.writeHead(404, { 'Content-Type': 'text/html' });
                res.end(`
                    <html>
                        <head><title>404 Not Found</title></head>
                        <body>
                            <h1>404 Not Found</h1>
                            <p>The requested file ${pathname} was not found on this server.</p>
                            <a href="/">Go to Homepage</a>
                        </body>
                    </html>
                `);
            } else {
                // 其他错误
                res.writeHead(500, { 'Content-Type': 'text/html' });
                res.end(`
                    <html>
                        <head><title>500 Internal Server Error</title></head>
                        <body>
                            <h1>500 Internal Server Error</h1>
                            <p>Sorry, there was a problem loading the requested file.</p>
                        </body>
                    </html>
                `);
            }
            return;
        }
        
        // 设置响应头
        res.writeHead(200, { 
            'Content-Type': contentType,
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type'
        });
        
        // 发送文件内容
        res.end(data);
    });
});

server.listen(PORT, () => {
    console.log(`🚀 服务器运行在 http://localhost:${PORT}`);
    console.log(`📁 服务目录: ${path.join(__dirname, '..')}`);
    console.log(`⏹️  按 Ctrl+C 停止服务器`);
});

// 优雅关闭
process.on('SIGINT', () => {
    console.log('\n👋 服务器已停止');
    process.exit(0);
}); 