const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
// Client → MY Gateway → Another Server (Target API). it create one proxy server which move drq first to my gateway then forward it to main api for which it was craeted
const routesConfig = require('./config/rules.json');

const app = express();
const PORT = 3000;

// Middleware Pipeline starts here
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} to ${req.url}`);
    next();
});

// Health Check, it just check that wather server is able to respond or not when get a req.
app.get('/health', (req, res) => res.send('Gateway is healthy'));

// Dynamic Proxy Logic
routesConfig.routes.forEach(route => {
    app.use(route.path, createProxyMiddleware({
        target: route.target,
        changeOrigin: true,
    }));
});

app.listen(PORT, () => {
    console.log(`🚀 GuardX Gateway routing traffic from :${PORT} to :5000`);
});
// req come to port 3000, whevere user search route in browser and then it is forwarede to route 5000 which is our proxy route. then manage everyth
// here first of all we have app, then it go to middleware, in middleware it goes before it go to PORT 5000, then it just check that port 3000 is awake or not then 
// it makes dynamic routes, means insted of /api -> proxy5000 it take routes from config and make proxy route on 5000.
// then it go back to port 3000.
