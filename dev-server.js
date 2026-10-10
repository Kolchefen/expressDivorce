// Local preview server that mirrors the clean-URL rules in .htaccess
// (Live Server ignores .htaccess). Run with: npm start
// Not used in production; IONOS serves the site with Apache.

const http = require('http');
const fs = require('fs');
const path = require('path');

const root = __dirname;
const port = process.env.PORT || 8080;

const types = {
	'.html': 'text/html; charset=utf-8',
	'.css': 'text/css; charset=utf-8',
	'.js': 'text/javascript; charset=utf-8',
	'.json': 'application/json',
	'.png': 'image/png',
	'.jpg': 'image/jpeg',
	'.jpeg': 'image/jpeg',
	'.gif': 'image/gif',
	'.svg': 'image/svg+xml',
	'.ico': 'image/x-icon',
	'.webp': 'image/webp',
	'.pdf': 'application/pdf',
	'.woff': 'font/woff',
	'.woff2': 'font/woff2'
};

const isFile = (file) => {
	try { return fs.statSync(file).isFile(); } catch (err) { return false; }
};

const redirect = (res, location) => {
	res.writeHead(301, { Location: location });
	res.end();
};

http.createServer((req, res) => {
	const url = new URL(req.url, 'http://localhost');
	const query = url.search;
	let pathname = decodeURIComponent(url.pathname);

	// Same order as .htaccess
	if (pathname === '/' || pathname === '/index' || pathname === '/index.html') return redirect(res, '/home' + query);
	if (pathname.endsWith('.html')) return redirect(res, pathname.slice(0, -5) + query);
	if (pathname.length > 1 && pathname.endsWith('/')) return redirect(res, pathname.slice(0, -1) + query);

	if (pathname === '/home') pathname = '/index.html';

	let file = path.normalize(path.join(root, pathname));
	if (!file.startsWith(root)) {
		res.writeHead(403);
		return res.end('Forbidden');
	}
	if (!isFile(file) && isFile(file + '.html')) file += '.html';

	if (!isFile(file)) {
		res.writeHead(404, { 'Content-Type': 'text/plain' });
		return res.end('Not found: ' + pathname);
	}

	// no-store so the browser always picks up edits instead of a cached copy
	res.writeHead(200, {
		'Content-Type': types[path.extname(file).toLowerCase()] || 'application/octet-stream',
		'Cache-Control': 'no-store'
	});
	fs.createReadStream(file).pipe(res);
}).listen(port, () => {
	console.log('Preview at http://localhost:' + port + '/home');
});
