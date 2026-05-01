import { Router } from 'express';
import pool from '../db.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

router.get('/next-code', requireAuth, async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT customer_code FROM customers WHERE customer_code LIKE 'C-%' ORDER BY id DESC LIMIT 1`
    );
    let next = 'C-001';
    if (rows.length) {
      const last = parseInt(rows[0].customer_code.replace('C-', ''), 10);
      next = `C-${String(last + 1).padStart(3, '0')}`;
    }
    res.json({ code: next });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/', requireAuth, async (req, res) => {
  try {
    const { customer_code, customer_name, contact_name, phone, email, address, subdistrict, district, province, country, tax_id, payment_type, currency, credit_limit, credit_days, note } = req.body;
    if (!customer_name || !phone) return res.status(400).json({ error: 'กรุณากรอกชื่อและเบอร์โทร' });

    const [exist] = await pool.query('SELECT id FROM customers WHERE customer_code = ?', [customer_code]);
    if (exist.length) return res.status(400).json({ error: 'รหัสลูกค้านี้มีอยู่แล้ว' });

    // เพิ่ม columns ที่อาจยังไม่มีใน DB
    const alterCols = [
      `ALTER TABLE customers ADD COLUMN IF NOT EXISTS currency VARCHAR(10) DEFAULT 'THB'`,
      `ALTER TABLE customers ADD COLUMN IF NOT EXISTS subdistrict VARCHAR(100)`,
      `ALTER TABLE customers ADD COLUMN IF NOT EXISTS district VARCHAR(100)`,
      `ALTER TABLE customers ADD COLUMN IF NOT EXISTS payment_type ENUM('cash','credit') DEFAULT 'cash'`,
    ];
    for (const sql of alterCols) await pool.query(sql).catch(() => {});

    const [result] = await pool.query(
      `INSERT INTO customers
        (customer_code, customer_name, contact_name, phone, email,
         address, subdistrict, district, province, country,
         tax_id, payment_type, currency, credit_limit, credit_days, note, created_by)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        customer_code, customer_name, contact_name || null, phone, email || null,
        address || null, subdistrict || null, district || null, province || null, country || 'ไทย',
        tax_id || null, payment_type || 'cash', currency || 'THB',
        credit_limit || 0, payment_type === 'cash' ? 0 : (credit_days || 30),
        note || null, 'sales'
      ]
    );
    res.json({ success: true, id: result.insertId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/', requireAuth, async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM customers ORDER BY created_at DESC');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
