// ============================================
// Student Expense Dashboard - Live Server
// ============================================

const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 8000;
const projectDir = __dirname;

const server = http.createServer((req, res) => {
    // Route handling
    let requestPath = req.url === '/' ? '/index.html' : req.url;
    if (requestPath === '/favicon.ico') {
        res.writeHead(204);
        return res.end();
    }
    filePath = path.join(projectDir, requestPath);

    // Determine file type
    const extname = String(path.extname(filePath)).toLowerCase();
    const mimeTypes = {
        '.html': 'text/html;charset=utf-8',
        '.css': 'text/css;charset=utf-8',
        '.js': 'application/javascript;charset=utf-8',
        '.json': 'application/json',
        '.png': 'image/png',
        '.jpg': 'image/jpg',
        '.gif': 'image/gif',
        '.svg': 'image/svg+xml'
    };

    const contentType = mimeTypes[extname] || 'application/octet-stream';

    // Read and serve file
    fs.readFile(filePath, (err, content) => {
        if (err) {
            if (err.code === 'ENOENT') {
                res.writeHead(404, { 'Content-Type': 'text/html;charset=utf-8' });
                res.end(`
                    <html>
                        <head><title>404 - Not Found</title></head>
                        <body style="font-family: Arial; padding: 20px; background: #f5f5f5;">
                            <h1>404 - File Not Found</h1>
                            <p>Requested file: ${req.url}</p>
                            <p>Looking in: ${filePath}</p>
                            <a href="/">← Back to Home</a>
                        </body>
                    </html>
                `, 'utf-8');
            } else {
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('Server Error: ' + err.message);
            }
        } else {
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content, 'utf-8');
        }
    });
});

server.listen(PORT, () => {
    console.log('\n╔════════════════════════════════════════╗');
    console.log('║   STUDENT EXPENSE DASHBOARD LIVE      ║');
    console.log('╠════════════════════════════════════════╣');
    console.log(`║ 🌐 Server running at:                 ║`);
    console.log(`║ → http://localhost:${PORT}                    ║`);
    console.log('║ → http://127.0.0.1:' + PORT + '                    ║');
    console.log('║                                        ║');
    console.log('║ ✅ Dashboard is ready!                ║');
    console.log('║ ⏹️  Press Ctrl+C to stop               ║');
    console.log('╚════════════════════════════════════════╝\n');
});

process.on('SIGINT', () => {
    console.log('\n⏹️  Server stopped.');
    process.exit(0);
});

process.on('uncaughtException', (err) => {
    console.error('❌ Error:', err.message);
});
