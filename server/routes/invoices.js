import { Router } from 'express';
import pool from '../db.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

function nextNo(prefix, last) {
  const ym = new Date().toISOString().slice(2, 7).replace('-', '');
  if (!last) return `${prefix}-${ym}-001`;
  const m = last.match(/-(\d{3,})$/);
  const n = m ? parseInt(m[1]) + 1 : 1;
  return `${prefix}-${ym}-${String(n).padStart(3, '0')}`;
}

/* ── INVOICES ── */
router.get('/', requireAuth, async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT i.*, c.customer_name AS cust_name, c.customer_code
       FROM invoices i
       LEFT JOIN customers c ON i.customer_id = c.id
       ORDER BY i.created_at DESC LIMIT 200`
    );
    res.json(rows);
  } catch { res.status(500).json({ error: 'Server error' }); }
});

router.post('/', requireAuth, async (req, res) => {
  try {
    const { customer_id, invoice_date, due_date, total_amount, vat_amount, net_amount, note, sale_type_id } = req.body;
    const [[last]] = await pool.query(`SELECT invoice_no FROM invoices ORDER BY id DESC LIMIT 1`);
    const invoice_no = nextNo('INV', last?.invoice_no);
    const [[cust]] = await pool.query('SELECT customer_name, address, tax_id FROM customers WHERE id=?', [customer_id]);
    await pool.query(
      `INSERT INTO invoices (invoice_no, customer_id, customer_name, customer_address, customer_tax_id,
        invoice_date, due_date, total_amount, vat_amount, net_amount, sale_type_id, note, created_by)
       VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)`,
      [invoice_no, customer_id, cust?.customer_name || '', cust?.address || '', cust?.tax_id || '',
       invoice_date, due_date, total_amount || 0, vat_amount || 0, net_amount || 0,
       sale_type_id || null, note || null, req.user?.username || 'system']
    );
    res.json({ success: true, invoice_no });
  } catch (e) { console.error(e); res.status(500).json({ error: 'Server error' }); }
});

router.patch('/:id', requireAuth, async (req, res) => {
  try {
    const { status, paid_amount } = req.body;
    await pool.query('UPDATE invoices SET status=?, paid_amount=? WHERE id=?',
      [status, paid_amount ?? 0, req.params.id]);
    res.json({ success: true });
  } catch { res.status(500).json({ error: 'Server error' }); }
});

/* ── TAX INVOICES ── */
router.get('/tax', requireAuth, async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT t.*, c.customer_name AS cust_name, i.invoice_no
       FROM tax_invoices t
       LEFT JOIN customers c ON t.customer_id = c.id
       LEFT JOIN invoices i ON t.invoice_id = i.id
       ORDER BY t.created_at DESC LIMIT 200`
    );
    res.json(rows);
  } catch { res.status(500).json({ error: 'Server error' }); }
});

router.post('/tax', requireAuth, async (req, res) => {
  try {
    const { customer_id, invoice_id, issue_date, total_amount, vat_rate, vat_amount, net_amount, note } = req.body;
    const [[last]] = await pool.query(`SELECT tax_invoice_no FROM tax_invoices ORDER BY id DESC LIMIT 1`);
    const tax_invoice_no = nextNo('TAX', last?.tax_invoice_no);
    const [[cust]] = await pool.query('SELECT customer_name, address, tax_id FROM customers WHERE id=?', [customer_id]);
    await pool.query(
      `INSERT INTO tax_invoices (tax_invoice_no, invoice_id, customer_id, customer_name, customer_address, customer_tax_id,
        issue_date, total_amount, vat_rate, vat_amount, net_amount, note, created_by)
       VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)`,
      [tax_invoice_no, invoice_id || null, customer_id, cust?.customer_name || '', cust?.address || '', cust?.tax_id || '',
       issue_date, total_amount || 0, vat_rate || 7, vat_amount || 0, net_amount || 0,
       note || null, req.user?.username || 'system']
    );
    res.json({ success: true, tax_invoice_no });
  } catch (e) { console.error(e); res.status(500).json({ error: 'Server error' }); }
});

/* ── CREDIT NOTES ── */
router.get('/credit-notes', requireAuth, async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT cn.*, c.customer_name AS cust_name, i.invoice_no
       FROM credit_notes cn
       LEFT JOIN customers c ON cn.customer_id = c.id
       LEFT JOIN invoices i ON cn.invoice_id = i.id
       ORDER BY cn.created_at DESC LIMIT 200`
    );
    res.json(rows);
  } catch { res.status(500).json({ error: 'Server error' }); }
});

router.post('/credit-notes', requireAuth, async (req, res) => {
  try {
    const { customer_id, invoice_id, issue_date, reason, total_amount, vat_amount, net_amount } = req.body;
    const [[last]] = await pool.query(`SELECT credit_note_no FROM credit_notes ORDER BY id DESC LIMIT 1`);
    const credit_note_no = nextNo('CN', last?.credit_note_no);
    const [[cust]] = await pool.query('SELECT customer_name FROM customers WHERE id=?', [customer_id]);
    await pool.query(
      `INSERT INTO credit_notes (credit_note_no, invoice_id, customer_id, customer_name, issue_date, reason,
        total_amount, vat_amount, net_amount, created_by)
       VALUES (?,?,?,?,?,?,?,?,?,?)`,
      [credit_note_no, invoice_id || null, customer_id, cust?.customer_name || '',
       issue_date, reason || '', total_amount || 0, vat_amount || 0, net_amount || 0,
       req.user?.username || 'system']
    );
    res.json({ success: true, credit_note_no });
  } catch (e) { console.error(e); res.status(500).json({ error: 'Server error' }); }
});

/* ── DEBTORS (customers with outstanding balance) ── */
router.get('/debtors', requireAuth, async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT c.*, dt.type_name AS debtor_type, dg.grade_name AS debtor_grade, da.area_name AS debtor_area
       FROM customers c
       LEFT JOIN debtor_types dt ON c.debtor_type_id = dt.id
       LEFT JOIN debtor_grades dg ON c.debtor_grade_id = dg.id
       LEFT JOIN debtor_areas da ON c.debtor_area_id = da.id
       WHERE c.is_active = 1
       ORDER BY c.balance DESC, c.customer_name ASC LIMIT 500`
    );
    res.json(rows);
  } catch { res.status(500).json({ error: 'Server error' }); }
});

router.patch('/debtors/:id', requireAuth, async (req, res) => {
  try {
    const { balance, credit_limit, credit_days, note } = req.body;
    await pool.query(
      'UPDATE customers SET balance=?, credit_limit=?, credit_days=?, note=? WHERE id=?',
      [balance, credit_limit, credit_days, note, req.params.id]
    );
    res.json({ success: true });
  } catch { res.status(500).json({ error: 'Server error' }); }
});

export default router;
