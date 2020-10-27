const handler = require("serve-handler");
const http = require("http");
const apiAddr = process.env.API_PROXY_TARGET || "http://backend:8000";
const port = process.env.PORT || 3000;
const host = process.env.HOST || 'localhost:'+port;
const proxy = require("http-proxy").createProxyServer({
    target: apiAddr,
    xfwd: false,
    hostRewrite: host,
    autoRewrite: true,
    headers: {
        Host: apiAddr.substring(apiAddr.indexOf('//') +2),
        Origin: apiAddr
    }
});

proxy.on('error', function(err, req, res) {
    console.log('proxy error', err, req, res);
});

const server = http.createServer((request, response) => {
    if (request.url.indexOf("/api/") > -1) { // request api
        var newReferer = undefined;
        if (request.headers.referer) {
            var http_prefix = request.headers.referer.indexOf('https') > -1 ? 'https' : 'http';
            newReferer = request.headers.referer.replace(new RegExp(http_prefix+"://"+host), apiAddr);
        }
        console.log("proxying req url: " + apiAddr + request.url);
        proxy.web(request, response, {
            Referer: newReferer
        });
    } else {
        // You pass two more arguments for config and middleware
        // More details here: https://github.com/vercel/serve-handler#options
        return handler(request, response, {
            'public': '/frontapp/build',
            "rewrites": [{
                source: '**',
                destination: '/index.html'
            }]
        });
    }
});

server.listen(port, "0.0.0.0", () => {
    console.log("Running at http://0.0.0.0:" + port);
    console.log('proxy ', apiAddr);
});
