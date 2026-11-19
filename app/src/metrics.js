const client = require('prom-client');

const registry = new client.Registry();
registry.setDefaultLabels({ app: 'monitor-api' });
client.collectDefaultMetrics({ register: registry });

const httpRequestsTotal = new client.Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests handled by the API',
  labelNames: ['method', 'route', 'status_code'],
  registers: [registry]
});

const httpRequestDuration = new client.Histogram({
  name: 'http_request_duration_seconds',
  help: 'HTTP request duration in seconds',
  labelNames: ['method', 'route', 'status_code'],
  buckets: [0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1, 2, 5],
  registers: [registry]
});

const httpErrorsTotal = new client.Counter({
  name: 'http_requests_errors_total',
  help: 'Total number of HTTP requests with 4xx or 5xx status codes',
  labelNames: ['method', 'route', 'status_code'],
  registers: [registry]
});

const activeRequests = new client.Gauge({
  name: 'app_active_requests',
  help: 'Number of HTTP requests currently being handled',
  registers: [registry]
});

module.exports = { client, registry, httpRequestsTotal, httpRequestDuration, httpErrorsTotal, activeRequests };
