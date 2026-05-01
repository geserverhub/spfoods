import { Router } from 'express';
import pool from '../db.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

function nextNo() {
  const ym = new Date().toISOString().slice(2, 7).replace('-', '');
  return `EXP-${ym}-${Date.now().toString().slice(-4)}`;
}

router.get('/categories', requireAuth, async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM expense_categories ORDER BY name ASC');
    res.json(rows);
  } catch { res.status(500).json({ error: 'Server error' }); }
});

router.get('/', requireAuth, async (req, res) => {
  try {
    const { dept } = req.query;
    const cond = dept ? 'WHERE e.dept_id = ?' : '';
    const params = dept ? [dept] : [];
    const [rows] = await pool.query(
      `SELECT e.*, ec.name AS category_name
       FROM expenses e
       LEFT JOIN expense_categories ec ON e.category_id = ec.id
       ${cond}
       ORDER BY e.created_at DESC LIMIT 300`,
      params
    );
    res.json(rows);
  } catch { res.status(500).json({ error: 'Server error' }); }
});

router.post('/', requireAuth, async (req, res) => {
  try {
    const { category_id, expense_date, description, amount, vat_amount, net_amount,
      payment_method, ref_document, dept_id, note } = req.body;
    if (!description || !amount || !expense_date) {
      return res.status(400).json({ error: 'กรุณากรอกข้อมูลให้ครบ' });
    }
    const expense_no = nextNo();
    await pool.query(
      `INSERT INTO expenses (expense_no, category_id, expense_date, description, amount, vat_amount, net_amount,
        payment_method, ref_document, dept_id, note, created_by)
       VALUES (?,?,?,?,?,?,?,?,?,?,?,?)`,
      [expense_no, category_id || null, expense_date, description,
       amount, vat_amount || 0, net_amount || amount,
       payment_method || 'cash', ref_document || null, dept_id || null, note || null,
       req.user?.username || 'system']
    );
    res.json({ success: true, expense_no });
  } catch (e) { console.error(e); res.status(500).json({ error: 'Server error' }); }
});

router.patch('/:id', requireAuth, async (req, res) => {
  try {
    const { status, approved_by } = req.body;
    await pool.query('UPDATE expenses SET status=?, approved_by=? WHERE id=?',
      [status, approved_by || null, req.params.id]);
    res.json({ success: true });
  } catch { res.status(500).json({ error: 'Server error' }); }
});

export default router;
