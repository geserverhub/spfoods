import { Router } from 'express';
import pool from '../db.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

function nextNo() {
  const ym = new Date().toISOString().slice(2, 7).replace('-', '');
  return `PO-${ym}-${Date.now().toString().slice(-4)}`;
}

router.get('/', requireAuth, async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT po.*,
         JSON_ARRAYAGG(JSON_OBJECT(
           'id', poi.id, 'product_name', poi.product_name, 'unit', poi.unit,
           'qty', poi.qty, 'price_unit', poi.price_unit, 'amount', poi.amount
         )) AS items
       FROM purchase_orders po
       LEFT JOIN purchase_order_items poi ON poi.po_id = po.id
       GROUP BY po.id
       ORDER BY po.created_at DESC LIMIT 300`
    );
    rows.forEach(r => { try { r.items = JSON.parse(r.items || '[]').filter(i => i.id); } catch { r.items = []; } });
    res.json(rows);
  } catch { res.status(500).json({ error: 'Server error' }); }
});

router.post('/', requireAuth, async (req, res) => {
  try {
    const { supplier_name, supplier_contact, order_date, due_date, note, items } = req.body;
    if (!supplier_name) return res.status(400).json({ error: 'กรุณาระบุชื่อผู้ขาย' });
    const po_no = nextNo();
    const total = (items || []).reduce((s, i) => s + (Number(i.amount) || 0), 0);
    const vat = Math.round(total * 7) / 100;
    const [result] = await pool.query(
      `INSERT INTO purchase_orders (po_no, supplier_name, supplier_contact, order_date, due_date,
        total_amount, vat_amount, net_amount, note, created_by)
       VALUES (?,?,?,?,?,?,?,?,?,?)`,
      [po_no, supplier_name, supplier_contact || null, order_date || null, due_date || null,
       total, vat, total + vat, note || null, req.user?.username || 'system']
    );
    const poId = result.insertId;
    for (const item of (items || [])) {
      await pool.query(
        `INSERT INTO purchase_order_items (po_id, product_id, product_name, unit, qty, price_unit, amount)
         VALUES (?,?,?,?,?,?,?)`,
        [poId, item.product_id || null, item.product_name || '', item.unit || '',
         item.qty || 0, item.price_unit || 0, item.amount || 0]
      );
    }
    res.json({ success: true, po_no });
  } catch (e) { console.error(e); res.status(500).json({ error: 'Server error' }); }
});

router.patch('/:id', requireAuth, async (req, res) => {
  try {
    const { status } = req.body;
    await pool.query('UPDATE purchase_orders SET status=? WHERE id=?', [status, req.params.id]);
    res.json({ success: true });
  } catch { res.status(500).json({ error: 'Server error' }); }
});

export default router;
