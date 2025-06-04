const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

const app = express();
const db = new sqlite3.Database(':memory:');

app.use(bodyParser.json());
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));

// Initialize database
function initDB() {
  db.serialize(() => {
    db.run(`CREATE TABLE products (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, price REAL, stock INTEGER, description TEXT, image TEXT)`);
    db.run(`CREATE TABLE reviews (id INTEGER PRIMARY KEY AUTOINCREMENT, product_id INTEGER, author TEXT, rating INTEGER, comment TEXT)`);
    const stmt = db.prepare('INSERT INTO products (name, price, stock, description, image) VALUES (?, ?, ?, ?, ?)');
    stmt.run('Product A', 19.99, 10, 'A great product', '/images/product_a.jpg');
    stmt.run('Product B', 29.99, 5, 'Another great product', '/images/product_b.jpg');
    stmt.finalize();
  });
}

initDB();

// API routes
app.get('/api/products', (req, res) => {
  db.all('SELECT * FROM products', (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.get('/api/products/:id', (req, res) => {
  db.get('SELECT * FROM products WHERE id = ?', req.params.id, (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!row) return res.status(404).json({ error: 'Product not found' });
    db.all('SELECT author, rating, comment FROM reviews WHERE product_id = ?', req.params.id, (err2, reviews) => {
      if (err2) return res.status(500).json({ error: err2.message });
      res.json({ ...row, reviews });
    });
  });
});

app.post('/api/products/:id/reviews', (req, res) => {
  const { author, rating, comment } = req.body;
  db.run('INSERT INTO reviews (product_id, author, rating, comment) VALUES (?, ?, ?, ?)', [req.params.id, author, rating, comment], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ id: this.lastID });
  });
});

app.post('/api/cart', (req, res) => {
  const { items } = req.body; // [{id, quantity}]
  const placeholders = items.map(() => '?').join(',');
  db.all(`SELECT id, name, price, stock FROM products WHERE id IN (${placeholders})`, items.map(i => i.id), (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    // Check stock
    for (const item of items) {
      const product = rows.find(r => r.id === item.id);
      if (!product || product.stock < item.quantity) {
        return res.status(400).json({ error: `Insufficient stock for product ${item.id}` });
      }
    }
    res.json({ success: true });
  });
});

app.post('/api/checkout', (req, res) => {
  // This is a placeholder for payment processing
  res.json({ success: true, message: 'Payment processed (simulated).' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

