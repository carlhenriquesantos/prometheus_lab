const express = require('express');
const router = express.Router();


router.get('/', (_req, res) => res.json({
  service: 'monitor-api',
  message: 'API de demonstração para monitoramento com Prometheus',
  endpoints: ['/health', '/api/produtos', '/api/usuarios', '/api/processamento', '/api/erro', '/metrics']
}));

router.get('/health', (_req, res) => res.json({ status: 'healthy', uptime_seconds: Math.round(process.uptime()) }));

router.get('/api/produtos', (_req, res) => res.json([
  { id: 1, nome: 'Teclado', preco: 129.9 },
  { id: 2, nome: 'Mouse', preco: 79.9 },
  { id: 3, nome: 'Monitor', preco: 899.9 }
]));

router.get('/api/usuarios', (_req, res) => res.json([
  { id: 1, nome: 'Ana' }, { id: 2, nome: 'Bruno' }, { id: 3, nome: 'Carlos' }
]));

router.get('/api/processamento', async (_req, res) => {
  const delay = Math.floor(Math.random() * 1800) + 200;
  await new Promise(resolve => setTimeout(resolve, delay));
  res.json({ status: 'completed', simulated_processing_ms: delay });
});


router.get('/api/erro', (_req, res) => res.status(500).json({ error: 'Erro simulado para demonstrar métricas de falha', status: 500 }));
router.get('/api/not-found-demo', (_req, res) => res.status(404).json({ error: 'Endpoint demonstrativo não encontrado', status: 404 }));

module.exports = router;
