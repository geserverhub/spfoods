import { Router } from 'express';
import pool from '../db.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

function nextNo(prefix) {
  const ym = new Date().toISOString().slice(2, 7).replace('-', '');
  return `${prefix}-${ym}-${Date.now().toString().slice(-4)}`;
}

/* ── DELIVERY NOTES ── */
router.get('/', requireAuth, async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT dn.*, c.customer_name AS cust_name, c.customer_code, i.invoice_no,
         JSON_ARRAYAGG(JSON_OBJECT(
           'product_name', dni.product_name, 'qty', dni.qty, 'unit', dni.unit
         )) AS items
       FROM delivery_notes dn
       LEFT JOIN customers c ON dn.customer_id = c.id
       LEFT JOIN invoices i ON dn.invoice_id = i.id
       LEFT JOIN delivery_note_items dni ON dni.delivery_id = dn.id
       GROUP BY dn.id
       ORDER BY dn.created_at DESC LIMIT 300`
    );
    rows.forEach(r => { try { r.items = JSON.parse(r.items || '[]').filter(i => i.product_name); } catch { r.items = []; } });
    res.json(rows);
  } catch { res.status(500).json({ error: 'Server error' }); }
});

router.post('/', requireAuth, async (req, res) => {
  try {
    const { customer_id, invoice_id, delivery_address, delivery_date, driver_name, vehicle_no, note, items } = req.body;
    if (!customer_id) return res.status(400).json({ error: 'กรุณาระบุลูกค้า' });
    const delivery_no = nextNo('DN');
    const [[cust]] = await pool.query('SELECT customer_name, address FROM customers WHERE id=?', [customer_id]);
    const [result] = await pool.query(
      `INSERT INTO delivery_notes (delivery_no, invoice_id, customer_id, customer_name, delivery_address,
        delivery_date, driver_name, vehicle_no, note, created_by)
       VALUES (?,?,?,?,?,?,?,?,?,?)`,
      [delivery_no, invoice_id || null, customer_id, cust?.customer_name || '',
       delivery_address || cust?.address || '', delivery_date || null,
       driver_name || null, vehicle_no || null, note || null, req.user?.username || 'system']
    );
    const deliveryId = result.insertId;
    for (const item of (items || [])) {
      await pool.query(
        `INSERT INTO delivery_note_items (delivery_id, product_id, product_name, unit, qty)
         VALUES (?,?,?,?,?)`,
        [deliveryId, item.product_id || null, item.product_name || '', item.unit || '', item.qty || 0]
      );
    }
    res.json({ success: true, delivery_no });
  } catch (e) { console.error(e); res.status(500).json({ error: 'Server error' }); }
});

router.patch('/:id', requireAuth, async (req, res) => {
  try {
    const { status } = req.body;
    await pool.query('UPDATE delivery_notes SET status=? WHERE id=?', [status, req.params.id]);
    res.json({ success: true });
  } catch { res.status(500).json({ error: 'Server error' }); }
});

/* ── CLAIMS & RETURNS ── */
router.get('/claims', requireAuth, async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT cr.*, c.customer_name AS cust_name, i.invoice_no, dn.delivery_no
       FROM claims_returns cr
       LEFT JOIN customers c ON cr.customer_id = c.id
       LEFT JOIN invoices i ON cr.invoice_id = i.id
       LEFT JOIN delivery_notes dn ON cr.delivery_id = dn.id
       ORDER BY cr.created_at DESC LIMIT 300`
    );
    res.json(rows);
  } catch { res.status(500).json({ error: 'Server error' }); }
});

router.post('/claims', requireAuth, async (req, res) => {
  try {
    const { customer_id, invoice_id, delivery_id, claim_date, claim_type, reason, total_amount } = req.body;
    if (!customer_id || !reason) return res.status(400).json({ error: 'กรุณากรอกข้อมูลให้ครบ' });
    const claim_no = nextNo('CLM');
    const [[cust]] = await pool.query('SELECT customer_name FROM customers WHERE id=?', [customer_id]);
    await pool.query(
      `INSERT INTO claims_returns (claim_no, invoice_id, delivery_id, customer_id, customer_name,
        claim_date, claim_type, reason, total_amount, created_by)
       VALUES (?,?,?,?,?,?,?,?,?,?)`,
      [claim_no, invoice_id || null, delivery_id || null, customer_id, cust?.customer_name || '',
       claim_date || new Date().toISOString().slice(0, 10), claim_type || 'claim',
       reason, total_amount || 0, req.user?.username || 'system']
    );
    res.json({ success: true, claim_no });
  } catch (e) { console.error(e); res.status(500).json({ error: 'Server error' }); }
});

router.patch('/claims/:id', requireAuth, async (req, res) => {
  try {
    const { status, resolution } = req.body;
    await pool.query('UPDATE claims_returns SET status=?, resolution=? WHERE id=?',
      [status, resolution || null, req.params.id]);
    res.json({ success: true });
  } catch { res.status(500).json({ error: 'Server error' }); }
});

export default router;
