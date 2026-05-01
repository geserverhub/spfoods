import { Router } from 'express';
import pool from '../db.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

router.get('/', requireAuth, async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT s.*, p.product_name, p.product_code, p.unit AS p_unit, c.category_name,
              p.price_cost, p.price_sell
       FROM stock s
       LEFT JOIN products p ON s.product_id = p.id
       LEFT JOIN product_categories c ON p.category_id = c.id
       ORDER BY s.qty_balance ASC LIMIT 500`
    );
    res.json(rows);
  } catch { res.status(500).json({ error: 'Server error' }); }
});

router.get('/movements', requireAuth, async (req, res) => {
  try {
    const { product_id } = req.query;
    const cond = product_id ? 'WHERE sm.product_id = ?' : '';
    const params = product_id ? [product_id] : [];
    const [rows] = await pool.query(
      `SELECT sm.*, p.product_name, p.product_code
       FROM stock_movements sm
       LEFT JOIN products p ON sm.product_id = p.id
       ${cond}
       ORDER BY sm.created_at DESC LIMIT 500`,
      params
    );
    res.json(rows);
  } catch { res.status(500).json({ error: 'Server error' }); }
});

router.post('/adjust', requireAuth, async (req, res) => {
  try {
    const { product_id, movement_type, qty, note } = req.body;
    if (!product_id || !qty) return res.status(400).json({ error: 'กรุณากรอกข้อมูลให้ครบ' });

    const [[s]] = await pool.query('SELECT * FROM stock WHERE product_id = ?', [product_id]);
    if (!s) return res.status(404).json({ error: 'ไม่พบสต๊อกสินค้านี้' });

    const qty_before = s.qty_balance;
    const qty_after = movement_type === 'in'
      ? qty_before + Number(qty)
      : movement_type === 'out'
        ? qty_before - Number(qty)
        : Number(qty);

    await pool.query('UPDATE stock SET qty_balance=?, last_updated=NOW() WHERE product_id=?', [qty_after, product_id]);
    const dir = movement_type === 'in' ? s.qty_in + Number(qty) : s.qty_in;
    const dout = movement_type === 'out' ? s.qty_out + Number(qty) : s.qty_out;
    await pool.query('UPDATE stock SET qty_in=?, qty_out=? WHERE product_id=?', [dir, dout, product_id]);

    const [[p]] = await pool.query('SELECT unit FROM products WHERE id=?', [product_id]);
    await pool.query(
      `INSERT INTO stock_movements (product_id, movement_type, ref_type, qty, qty_before, qty_after, unit, note, created_by)
       VALUES (?,?,?,?,?,?,?,?,?)`,
      [product_id, movement_type, 'adjust', qty, qty_before, qty_after,
       p?.unit || '', note || null, req.user?.username || 'system']
    );
    res.json({ success: true, qty_after });
  } catch (e) { console.error(e); res.status(500).json({ error: 'Server error' }); }
});

export default router;
