const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
// Client → MY Gateway(my port of guarx) → Another Serverhich is actual port(Target API).
const routesConfig = require('./config/rules.json');
const rateLimiter = require('./middleware/rateLimiter')
const auth = require('./middleware/auth')

const app = express();
const PORT = 3000;

// Middleware Pipeline starts here
// app.use will work on all req, not just on specific path.
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} to ${req.url}`);
    next();
});

// Health Check, it just check that wather server is able to respond or not when get a req.
app.get('/health', (req, res) => res.send('Gateway is health'));

// ratelimiter middlewere
app.use('/api', auth)
app.use('/api', rateLimiter)
// Dynamic Proxy Logic (final endpoint lead to main port)
routesConfig.routes.forEach(route => {
    console.log(`Loading route: ${route.path} -> ${route.target}`);
    app.use(route.path, createProxyMiddleware({
        target: route.target,
        changeOrigin: true,
    }));
});

app.listen(PORT, () => {
    console.log(`🚀 GuardX Gateway routing traffic from :${PORT} to :5000`);
});
// here port 5000 is not rate limiter, it is main server that perform operation.
// Here Port 3000 is guarex req, it check incoming- as middleware, check auth, check limit, quota, services, thereat score,etc
// then go to main port 5000 , that will give res back to PORT 3000
// 3000 will res to user, so like that user never direct communicate to main port 5000 for any req. it always req to guaredx not knowing it is real port.
