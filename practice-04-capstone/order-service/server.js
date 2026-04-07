app.post('/orders', (req, res) => {
  const orderId = 'ord-' + uuidv4().slice(0, 8);
  const correlationId = uuidv4();
  const order = {
    orderId,
    correlationId,
    ...req.body,
    receivedAt: new Date().toISOString(),
    status: 'received'
  };
  orders.set(orderId, order);
  res.status(201).json({ orderId, correlationId, status: 'received' });
});

app.get('/orders/:id', (req, res) => {
  const order = orders.get(req.params.id);
  if (!order) {
    return res.status(404).json({ error: 'Order not found' });
  }
  res.json(order);
});