const express = require('express');
const { v4: uuidv4 } = require('uuid');

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3003;
const INVENTORY_FAIL_MODE = process.env.INVENTORY_FAIL_MODE || 'never';

const callLog = [];

app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'inventory-service' });
});

app.post('/inventory/reserve', (req, res) => {
  const correlationId = req.body.correlationId || req.headers['x-correlation-id'];
  const orderId = req.body.orderId;

  callLog.push({ endpoint: '/inventory/reserve', correlationId, orderId, timestamp: new Date().toISOString() });

  let shouldFail = false;
  if (INVENTORY_FAIL_MODE === 'always') shouldFail = true;
  if (INVENTORY_FAIL_MODE === 'random' && Math.random() < 0.1) shouldFail = true;

  if (shouldFail) {
    return res.status(422).json({ status: 'unavailable', reason: 'Insufficient stock', correlationId });
  }

  res.json({ status: 'reserved', reservationId: uuidv4(), correlationId });
});

app.post('/inventory/release', (req, res) => {
  const correlationId = req.body.correlationId || req.headers['x-correlation-id'];
  const orderId = req.body.orderId;

  callLog.push({ endpoint: '/inventory/release', correlationId, orderId, timestamp: new Date().toISOString() });

  res.json({ status: 'released', correlationId });
});

app.get('/admin/logs', (req, res) => {
  res.json(callLog);
});

app.post('/admin/reset', (req, res) => {
  callLog.length = 0;
  console.log('[inventory-service] Call log cleared');
  res.json({ status: 'ok', message: 'Call log cleared' });
});

app.listen(PORT, () => {
  console.log(`[inventory-service] Running on port ${PORT} | INVENTORY_FAIL_MODE=${INVENTORY_FAIL_MODE}`);
});