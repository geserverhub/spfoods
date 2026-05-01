import { Router } from 'express';
import pool from '../db.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

function nextNo(prefix) {
  const ym = new Date().toISOString().slice(2, 7).replace('-', '');
  return `${prefix}-${ym}-${Date.now().toString().slice(-4)}`;
}

/* ── PRODUCTION ORDERS ── */
router.get('/', requireAuth, async (req, res) => {
  try {
    const { dept } = req.query;
    const cond = dept ? 'WHERE po.dept_id = ?' : '';
    const params = dept ? [dept] : [];
    const [rows] = await pool.query(
      `SELECT po.*, p.product_name, p.product_code, p.unit
       FROM production_orders po
       LEFT JOIN products p ON po.product_id = p.id
       ${cond}
       ORDER BY po.created_at DESC LIMIT 300`,
      params
    );
    res.json(rows);
  } catch { res.status(500).json({ error: 'Server error' }); }
});

router.post('/', requireAuth, async (req, res) => {
  try {
    const { product_id, qty_ordered, production_date, due_date, dept_id, note } = req.body;
    if (!product_id || !qty_ordered) return res.status(400).json({ error: 'กรุณากรอกข้อมูลให้ครบ' });
    const order_no = nextNo('PRD');
    await pool.query(
      `INSERT INTO production_orders (order_no, product_id, qty_ordered, production_date, due_date, dept_id, note, created_by)
       VALUES (?,?,?,?,?,?,?,?)`,
      [order_no, product_id, qty_ordered, production_date || null, due_date || null,
       dept_id || 'production', note || null, req.user?.username || 'system']
    );
    res.json({ success: true, order_no });
  } catch (e) { console.error(e); res.status(500).json({ error: 'Server error' }); }
});

router.patch('/:id', requireAuth, async (req, res) => {
  try {
    const { status, qty_produced } = req.body;
    await pool.query(
      'UPDATE production_orders SET status=?, qty_produced=? WHERE id=?',
      [status, qty_produced ?? 0, req.params.id]
    );
    res.json({ success: true });
  } catch { res.status(500).json({ error: 'Server error' }); }
});

/* ── GOODS RECEIPTS ── */
router.get('/goods-receipts', requireAuth, async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT gr.*, po.po_no,
         JSON_ARRAYAGG(JSON_OBJECT(
           'id', gri.id, 'product_name', gri.product_name,
           'qty_ordered', gri.qty_ordered, 'qty_received', gri.qty_received,
           'unit', gri.unit, 'price_unit', gri.price_unit, 'amount', gri.amount
         )) AS items
       FROM goods_receipts gr
       LEFT JOIN purchase_orders po ON gr.po_id = po.id
       LEFT JOIN goods_receipt_items gri ON gri.receipt_id = gr.id
       GROUP BY gr.id
       ORDER BY gr.created_at DESC LIMIT 200`
    );
    rows.forEach(r => { try { r.items = JSON.parse(r.items || '[]').filter(i => i.id); } catch { r.items = []; } });
    res.json(rows);
  } catch { res.status(500).json({ error: 'Server error' }); }
});

router.post('/goods-receipts', requireAuth, async (req, res) => {
  try {
    const { po_id, supplier_name, receipt_date, note, items } = req.body;
    const receipt_no = nextNo('GR');
    const total = (items || []).reduce((s, i) => s + (Number(i.amount) || 0), 0);
    const [result] = await pool.query(
      `INSERT INTO goods_receipts (receipt_no, po_id, supplier_name, receipt_date, total_amount, note, created_by)
       VALUES (?,?,?,?,?,?,?)`,
      [receipt_no, po_id || null, supplier_name || '', receipt_date, total, note || null, req.user?.username || 'system']
    );
    const receiptId = result.insertId;
    for (const item of (items || [])) {
      await pool.query(
        `INSERT INTO goods_receipt_items (receipt_id, product_id, product_name, unit, qty_ordered, qty_received, price_unit, amount)
         VALUES (?,?,?,?,?,?,?,?)`,
        [receiptId, item.product_id || null, item.product_name || '', item.unit || '',
         item.qty_ordered || 0, item.qty_received || 0, item.price_unit || 0,
         (item.qty_received || 0) * (item.price_unit || 0)]
      );
    }
    res.json({ success: true, receipt_no });
  } catch (e) { console.error(e); res.status(500).json({ error: 'Server error' }); }
});

/* ── STOCK LEVELS ── */
router.get('/stock', requireAuth, async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT s.*, p.product_name, p.product_code, p.unit AS p_unit, c.category_name
       FROM stock s
       LEFT JOIN products p ON s.product_id = p.id
       LEFT JOIN product_categories c ON p.category_id = c.id
       ORDER BY s.qty_balance ASC LIMIT 500`
    );
    res.json(rows);
  } catch { res.status(500).json({ error: 'Server error' }); }
});

export default router;
