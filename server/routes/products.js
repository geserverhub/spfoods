import { Router } from 'express';
import pool from '../db.js';
import { requireAuth } from '../middleware/auth.js';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const router = Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadsDir = path.resolve(__dirname, '../uploads/products');
fs.mkdirSync(uploadsDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadsDir),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname || '').toLowerCase();
    const safeExt = ['.jpg', '.jpeg', '.png', '.webp', '.gif'].includes(ext) ? ext : '.jpg';
    cb(null, `${Date.now()}-${Math.round(Math.random() * 1e9)}${safeExt}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if ((file.mimetype || '').startsWith('image/')) return cb(null, true);
    cb(new Error('อนุญาตเฉพาะไฟล์รูปภาพเท่านั้น'));
  },
});

const FX_KRW = 40;
const FX_USD = 0.027;
const FX_CNY = 0.20;
const round2 = (n) => Number(Number(n || 0).toFixed(2));
const round3 = (n) => Number(Number(n || 0).toFixed(3));

let ensuredProductSchema = false;
async function ensureProductSchema() {
  if (ensuredProductSchema) return;

  await pool.query(`ALTER TABLE products ADD COLUMN IF NOT EXISTS image_path VARCHAR(255) NULL AFTER description`);
  await pool.query(`ALTER TABLE products ADD COLUMN IF NOT EXISTS price_cost_thb DECIMAL(12,2) DEFAULT 0.00 AFTER price_cost`);
  await pool.query(`ALTER TABLE products ADD COLUMN IF NOT EXISTS price_cost_krw DECIMAL(12,2) DEFAULT 0.00 AFTER price_cost_thb`);
  await pool.query(`ALTER TABLE products ADD COLUMN IF NOT EXISTS price_cost_usd DECIMAL(12,3) DEFAULT 0.000 AFTER price_cost_krw`);
  await pool.query(`ALTER TABLE products ADD COLUMN IF NOT EXISTS price_cost_cny DECIMAL(12,2) DEFAULT 0.00 AFTER price_cost_usd`);
  await pool.query(`ALTER TABLE products ADD COLUMN IF NOT EXISTS price_sell_thb DECIMAL(12,2) DEFAULT 0.00 AFTER price_sell`);
  await pool.query(`ALTER TABLE products ADD COLUMN IF NOT EXISTS price_sell_krw DECIMAL(12,2) DEFAULT 0.00 AFTER price_sell_thb`);
  await pool.query(`ALTER TABLE products ADD COLUMN IF NOT EXISTS price_sell_usd DECIMAL(12,3) DEFAULT 0.000 AFTER price_sell_krw`);
  await pool.query(`ALTER TABLE products ADD COLUMN IF NOT EXISTS price_sell_cny DECIMAL(12,2) DEFAULT 0.00 AFTER price_sell_usd`);

  // Backfill existing rows so DB stores the same currency values shown by API
  await pool.query(
    `UPDATE products
     SET
       price_cost_thb = COALESCE(NULLIF(price_cost_thb, 0), price_cost, 0),
       price_cost_krw = COALESCE(NULLIF(price_cost_krw, 0), ROUND(COALESCE(NULLIF(price_cost_thb, 0), price_cost, 0) * ?, 2)),
       price_cost_usd = COALESCE(NULLIF(price_cost_usd, 0), ROUND(COALESCE(NULLIF(price_cost_thb, 0), price_cost, 0) * ?, 3)),
       price_cost_cny = COALESCE(NULLIF(price_cost_cny, 0), ROUND(COALESCE(NULLIF(price_cost_thb, 0), price_cost, 0) * ?, 2)),
       price_sell_thb = COALESCE(NULLIF(price_sell_thb, 0), price_sell, 0),
       price_sell_krw = COALESCE(NULLIF(price_sell_krw, 0), ROUND(COALESCE(NULLIF(price_sell_thb, 0), price_sell, 0) * ?, 2)),
       price_sell_usd = COALESCE(NULLIF(price_sell_usd, 0), ROUND(COALESCE(NULLIF(price_sell_thb, 0), price_sell, 0) * ?, 3)),
       price_sell_cny = COALESCE(NULLIF(price_sell_cny, 0), ROUND(COALESCE(NULLIF(price_sell_thb, 0), price_sell, 0) * ?, 2))`,
    [FX_KRW, FX_USD, FX_CNY, FX_KRW, FX_USD, FX_CNY]
  );

  ensuredProductSchema = true;
}

const toImageUrl = (imagePath) => (imagePath ? `/sp-api/products/image/${encodeURIComponent(imagePath)}` : null);

router.get('/next-code', requireAuth, async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT product_code FROM products WHERE product_code LIKE 'SPF-%' ORDER BY id DESC LIMIT 1`
    );
    let next = 'SPF-001';
    if (rows.length) {
      const last = parseInt(rows[0].product_code.replace('SPF-', ''), 10);
      next = `SPF-${String(last + 1).padStart(3, '0')}`;
    }
    res.json({ code: next });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/categories', requireAuth, async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT id, name AS category_name FROM product_categories ORDER BY name ASC`
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/', requireAuth, async (req, res) => {
  try {
    await ensureProductSchema();
    const { product_code, product_name, category_id, unit, price_cost, price_sell, stock_qty, min_stock, description } = req.body;
    if (!product_name) return res.status(400).json({ error: 'กรุณากรอกชื่อสินค้า' });

    const costThb = round2(price_cost || 0);
    const sellThb = round2(price_sell || 0);

    const [exist] = await pool.query('SELECT id FROM products WHERE product_code = ?', [product_code]);
    if (exist.length) return res.status(400).json({ error: 'รหัสสินค้านี้มีอยู่แล้ว' });

    const [result] = await pool.query(
      `INSERT INTO products (
        product_code, product_name, category_id, unit,
        price_cost, price_cost_thb, price_cost_krw, price_cost_usd, price_cost_cny,
        price_sell, price_sell_thb, price_sell_krw, price_sell_usd, price_sell_cny,
        stock_qty, min_stock, description
      )
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        product_code,
        product_name,
        category_id || null,
        unit || 'กล่อง',
        costThb,
        costThb,
        round2(costThb * FX_KRW),
        round3(costThb * FX_USD),
        round2(costThb * FX_CNY),
        sellThb,
        sellThb,
        round2(sellThb * FX_KRW),
        round3(sellThb * FX_USD),
        round2(sellThb * FX_CNY),
        stock_qty || 0,
        min_stock || 0,
        description || null,
      ]
    );
    res.json({ success: true, id: result.insertId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.put('/:id/prices', requireAuth, async (req, res) => {
  try {
    await ensureProductSchema();

    const id = parseInt(req.params.id, 10);
    if (!id) return res.status(400).json({ error: 'รหัสสินค้าไม่ถูกต้อง' });

    const costThb = round2(req.body?.price_cost_thb);
    const sellThb = round2(req.body?.price_sell_thb);

    if (!Number.isFinite(costThb) || costThb < 0 || !Number.isFinite(sellThb) || sellThb < 0) {
      return res.status(400).json({ error: 'ข้อมูลราคาไม่ถูกต้อง' });
    }

    const [result] = await pool.query(
      `UPDATE products
       SET
         price_cost = ?,
         price_cost_thb = ?,
         price_cost_krw = ?,
         price_cost_usd = ?,
         price_cost_cny = ?,
         price_sell = ?,
         price_sell_thb = ?,
         price_sell_krw = ?,
         price_sell_usd = ?,
         price_sell_cny = ?
       WHERE id = ?`,
      [
        costThb,
        costThb,
        round2(costThb * FX_KRW),
        round3(costThb * FX_USD),
        round2(costThb * FX_CNY),
        sellThb,
        sellThb,
        round2(sellThb * FX_KRW),
        round3(sellThb * FX_USD),
        round2(sellThb * FX_CNY),
        id,
      ]
    );

    if (!result.affectedRows) return res.status(404).json({ error: 'ไม่พบสินค้า' });

    res.json({
      success: true,
      price_cost_thb: costThb,
      price_cost_krw: round2(costThb * FX_KRW),
      price_cost_usd: round3(costThb * FX_USD),
      price_cost_cny: round2(costThb * FX_CNY),
      price_sell_thb: sellThb,
      price_sell_krw: round2(sellThb * FX_KRW),
      price_sell_usd: round3(sellThb * FX_USD),
      price_sell_cny: round2(sellThb * FX_CNY),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/:id/image', requireAuth, upload.single('image'), async (req, res) => {
  try {
    await ensureProductSchema();
    const id = parseInt(req.params.id, 10);
    if (!id) return res.status(400).json({ error: 'รหัสสินค้าไม่ถูกต้อง' });
    if (!req.file) return res.status(400).json({ error: 'ไม่พบไฟล์รูปภาพ' });

    const [rows] = await pool.query('SELECT id FROM products WHERE id = ? LIMIT 1', [id]);
    if (!rows.length) return res.status(404).json({ error: 'ไม่พบสินค้า' });

    await pool.query('UPDATE products SET image_path = ? WHERE id = ?', [req.file.filename, id]);
    res.json({ success: true, image_path: req.file.filename, image_url: toImageUrl(req.file.filename) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message || 'Server error' });
  }
});

router.get('/image/:filename', (req, res) => {
  try {
    const filename = path.basename(String(req.params.filename || ''));
    if (!filename) return res.status(400).json({ error: 'Invalid filename' });

    const filePath = path.join(uploadsDir, filename);
    if (!fs.existsSync(filePath)) return res.status(404).json({ error: 'Image not found' });
    res.sendFile(filePath);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/', requireAuth, async (req, res) => {
  try {
    await ensureProductSchema();

    const [rows] = await pool.query(
      `SELECT p.*, c.category_name FROM products p
       LEFT JOIN (
         SELECT id, name AS category_name
         FROM product_categories
       ) c ON p.category_id = c.id
       WHERE p.active = 1 ORDER BY p.created_at DESC`
    );

    const data = rows.map((p) => {
      const costThb = Number(p.price_cost_thb ?? p.price_cost ?? 0);
      const sellThb = Number(p.price_sell_thb ?? p.price_sell ?? 0);

      return {
        ...p,
        image_url: toImageUrl(p.image_path),
        price_cost_thb: costThb,
        price_cost_krw: Number(p.price_cost_krw ?? round2(costThb * FX_KRW)),
        price_cost_usd: Number(p.price_cost_usd ?? round3(costThb * FX_USD)),
        price_cost_cny: Number(p.price_cost_cny ?? round2(costThb * FX_CNY)),
        price_sell_thb: sellThb,
        price_sell_krw: Number(p.price_sell_krw ?? round2(sellThb * FX_KRW)),
        price_sell_usd: Number(p.price_sell_usd ?? round3(sellThb * FX_USD)),
        price_sell_cny: Number(p.price_sell_cny ?? round2(sellThb * FX_CNY)),
      };
    });

    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
