import { Router } from 'express';
import pool from '../db.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

function nextNo() {
  const ym = new Date().toISOString().slice(2, 7).replace('-', '');
  return `QC-${ym}-${Date.now().toString().slice(-4)}`;
}

router.get('/', requireAuth, async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT qc.*, p.product_name, p.product_code, po.order_no AS prod_order_no
       FROM quality_checks qc
       LEFT JOIN products p ON qc.product_id = p.id
       LEFT JOIN production_orders po ON qc.production_order_id = po.id
       ORDER BY qc.created_at DESC LIMIT 300`
    );
    res.json(rows);
  } catch { res.status(500).json({ error: 'Server error' }); }
});

router.post('/', requireAuth, async (req, res) => {
  try {
    const { production_order_id, product_id, check_date, qty_checked, qty_passed, qty_failed, result, note } = req.body;
    if (!product_id || !qty_checked) return res.status(400).json({ error: 'กรุณากรอกข้อมูลให้ครบ' });
    const check_no = nextNo();
    await pool.query(
      `INSERT INTO quality_checks (check_no, production_order_id, product_id, check_date,
        qty_checked, qty_passed, qty_failed, result, note, checked_by)
       VALUES (?,?,?,?,?,?,?,?,?,?)`,
      [check_no, production_order_id || null, product_id, check_date || new Date().toISOString().slice(0, 10),
       qty_checked, qty_passed || 0, qty_failed || 0, result || 'passed', note || null,
       req.user?.username || 'system']
    );
    res.json({ success: true, check_no });
  } catch (e) { console.error(e); res.status(500).json({ error: 'Server error' }); }
});

export default router;
