import { Router } from 'express';
import pool from '../db.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

async function getNextCustomerCode(db = pool) {
  const [rows] = await db.query(
    `SELECT COALESCE(MAX(CAST(SUBSTRING(customer_code, 3) AS UNSIGNED)), 0) AS max_no
     FROM customers
     WHERE customer_code REGEXP '^C-[0-9]+$'`
  );
  const nextNo = Number(rows?.[0]?.max_no || 0) + 1;
  return `C-${String(nextNo).padStart(3, '0')}`;
}

router.get('/next-code', requireAuth, async (req, res) => {
  try {
    const code = await getNextCustomerCode(pool);
    res.json({ code });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/', requireAuth, async (req, res) => {
  try {
    const { customer_code, customer_name, contact_name, phone, email, address, subdistrict, district, province, country, tax_id, payment_type, currency, credit_limit, credit_days, note } = req.body;
    if (!customer_name || !phone) return res.status(400).json({ error: 'กรุณากรอกชื่อและเบอร์โทร' });

    let code = String(customer_code || '').trim().toUpperCase();
    if (!/^C-\d+$/.test(code)) {
      code = await getNextCustomerCode(pool);
    }

    // เพิ่ม columns ที่อาจยังไม่มีใน DB
    const alterCols = [
      `ALTER TABLE customers ADD COLUMN IF NOT EXISTS currency VARCHAR(10) DEFAULT 'THB'`,
      `ALTER TABLE customers ADD COLUMN IF NOT EXISTS subdistrict VARCHAR(100)`,
      `ALTER TABLE customers ADD COLUMN IF NOT EXISTS district VARCHAR(100)`,
      `ALTER TABLE customers ADD COLUMN IF NOT EXISTS payment_type ENUM('cash','credit') DEFAULT 'cash'`,
    ];
    for (const sql of alterCols) await pool.query(sql).catch(() => {});


    // กันกรณีชนรหัสจากการบันทึกพร้อมกันหลายคน
    for (let attempt = 0; attempt < 5; attempt += 1) {
      const [exist] = await pool.query('SELECT id FROM customers WHERE customer_code = ?', [code]);
      if (exist.length) {
        code = await getNextCustomerCode(pool);
        continue;
      }

      const [result] = await pool.query(
        `INSERT INTO customers
          (customer_code, customer_name, contact_person, phone, email,
           address, subdistrict, district, province, country,
           tax_id, payment_type, currency, credit_limit, credit_days, note)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          code, customer_name, contact_name || null, phone, email || null,
          address || null, subdistrict || null, district || null, province || null, country || 'ไทย',
          tax_id || null, payment_type || 'cash', currency || 'THB',
          credit_limit || 0, payment_type === 'cash' ? 0 : (credit_days || 30),
          note || null,
        ]
      );
      return res.json({ success: true, id: result.insertId, customer_code: code });
    }

    return res.status(409).json({ error: 'ไม่สามารถสร้างรหัสลูกค้าใหม่ได้ กรุณาลองอีกครั้ง' });
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
