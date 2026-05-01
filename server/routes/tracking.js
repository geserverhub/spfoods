import { Router } from 'express';
import pool from '../db.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

// Public: search orders by name or phone
router.get('/', async (req, res) => {
  try {
    const { type, q } = req.query;
    if (!q?.trim()) return res.json([]);
    const search = `%${q.replace(/-/g, '').trim()}%`;
    const field = type === 'phone' ? 'phone' : 'customer_name';
    const [rows] = await pool.query(
      `SELECT * FROM orders WHERE ${field} LIKE ? ORDER BY created_at DESC`,
      [search]
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Admin: list all orders
router.get('/all', requireAuth, async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM orders ORDER BY created_at DESC');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Admin: create order
router.post('/', requireAuth, async (req, res) => {
  try {
    const { customer_name, phone, item, status, location } = req.body;
    if (!customer_name || !phone || !item) {
      return res.status(400).json({ error: 'กรุณากรอกข้อมูลให้ครบ' });
    }
    const orderId = `SPF-${new Date().getFullYear()}-${Date.now().toString().slice(-6)}`;
    const [result] = await pool.query(
      'INSERT INTO orders (order_id, customer_name, phone, item, status, location) VALUES (?, ?, ?, ?, ?, ?)',
      [orderId, customer_name, phone, item, status || 'packing', location || 'กำลังเตรียมพัสดุ']
    );
    res.json({ success: true, id: result.insertId, order_id: orderId });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Admin: update order
router.put('/:id', requireAuth, async (req, res) => {
  try {
    const { status, location, item, customer_name, phone } = req.body;
    await pool.query(
      'UPDATE orders SET status=?, location=?, item=?, customer_name=?, phone=? WHERE id=?',
      [status, location, item, customer_name, phone, req.params.id]
    );
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Admin: delete order
router.delete('/:id', requireAuth, async (req, res) => {
  try {
    await pool.query('DELETE FROM orders WHERE id = ?', [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
