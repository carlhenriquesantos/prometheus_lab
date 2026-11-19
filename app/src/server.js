const express = require('express');
const routes = require('./routes');
const { registry, httpRequestsTotal, httpRequestDuration, httpErrorsTotal, activeRequests } = require('./metrics');
const app = express();
const PORT = Number(process.env.PORT || 3000);

app.use((req, res, next) => {
  if (req.path === '/metrics') return next();
  const start = process.hrtime.bigint();
  activeRequests.inc();
  res.on('finish', () => {
    activeRequests.dec();
    const route = req.route?.path || req.path;
    const safeRoute = ['/','/health','/api/produtos','/api/usuarios','/api/processamento','/api/erro','/api/not-found-demo'].includes(route) ? route : 'unmatched';
    const labels = { method: req.method, route: safeRoute, status_code: String(res.statusCode) };
    const duration = Number(process.hrtime.bigint() - start) / 1e9;
    httpRequestsTotal.inc(labels);
    httpRequestDuration.observe(labels, duration);
    if (res.statusCode >= 400) httpErrorsTotal.inc(labels);
  });
  next();
});

app.use(routes);
app.get('/metrics', async (_req, res) => {
  res.set('Content-Type', registry.contentType);
  res.end(await registry.metrics());
});
app.use((_req, res) => res.status(404).json({ error: 'Route not found' }));
app.listen(PORT, '0.0.0.0', () => console.log(`monitor-api running on port ${PORT}`));
