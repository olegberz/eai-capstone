app.post('/payment/authorize', (req, res) => {
  const correlationId = req.body.correlationId || req.headers['x-correlation-id'];
  const orderId = req.body.orderId;
  
  callLog.push({ endpoint: '/payment/authorize', correlationId, orderId, timestamp: new Date().toISOString() });

  let shouldFail = false;
  if (PAYMENT_FAIL_MODE === 'always') shouldFail = true;
  if (PAYMENT_FAIL_MODE === 'random' && Math.random() < 0.1) shouldFail = true;

  if (shouldFail) {
    return res.status(422).json({ status: 'rejected', reason: 'Payment declined', correlationId });
  }

  res.json({ status: 'authorized', transactionId: uuidv4(), correlationId });
});

app.post('/payment/refund', (req, res) => {
  const correlationId = req.body.correlationId || req.headers['x-correlation-id'];
  const orderId = req.body.orderId;

  callLog.push({ endpoint: '/payment/refund', correlationId, orderId, timestamp: new Date().toISOString() });

  res.json({ status: 'refunded', correlationId });
});