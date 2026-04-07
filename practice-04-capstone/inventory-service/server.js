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