import bcrypt from 'bcryptjs';
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

const conn = await mysql.createConnection({
  host:     process.env.DB_HOST     || 'localhost',
  port:     process.env.DB_PORT     || 3306,
  user:     process.env.DB_USER     || 'root',
  password: process.env.DB_PASSWORD || '',
  multipleStatements: true,
  charset: 'utf8mb4',
});

console.log('🔧 Creating database spfoods...');
await conn.query('CREATE DATABASE IF NOT EXISTS spfoods CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci');
await conn.query('USE spfoods');

console.log('🔧 Creating tables...');
await conn.query(`
  CREATE TABLE IF NOT EXISTS admin_users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) DEFAULT 'admin',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

  CREATE TABLE IF NOT EXISTS registrations (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(200) NOT NULL,
    email VARCHAR(200) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    company VARCHAR(200),
    address TEXT NOT NULL,
    purpose VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

  CREATE TABLE IF NOT EXISTS orders (
    id INT PRIMARY KEY AUTO_INCREMENT,
    order_id VARCHAR(50) UNIQUE NOT NULL,
    customer_name VARCHAR(200) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    item VARCHAR(500) NOT NULL,
    status ENUM('packing','shipping','delivered') DEFAULT 'packing',
    location VARCHAR(500) DEFAULT 'กำลังเตรียมพัสดุ',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

  CREATE TABLE IF NOT EXISTS departments (
    id INT PRIMARY KEY AUTO_INCREMENT,
    dept_id VARCHAR(50) UNIQUE NOT NULL,
    title VARCHAR(200) NOT NULL,
    employee_count INT DEFAULT 0,
    sort_order INT DEFAULT 0
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
`);

console.log('🔧 Seeding admin user...');
const hash = await bcrypt.hash('spfoods2026', 10);
await conn.query(
  'INSERT IGNORE INTO admin_users (username, password_hash, role) VALUES (?, ?, ?)',
  ['admin', hash, 'superadmin']
);

console.log('🔧 Seeding departments...');
const depts = [
  ['production', 'แผนกผลิตและดูแลพนักงานต่างชาติ', 12, 1],
  ['accounting', 'แผนกบัญชีภาษีและลูกหนี้',        5,  2],
  ['admin',      'แผนกธุรการขาย-ซื้อ',               8,  3],
  ['delivery',   'แผนกติดต่องานภายนอกและจัดส่ง',    10, 4],
  ['qc',         'แผนกควบคุมคุณภาพและR&D',           6,  5],
  ['sales',      'แผนกขายและการตลาด',                9,  6],
];
for (const [dept_id, title, employee_count, sort_order] of depts) {
  await conn.query(
    'INSERT IGNORE INTO departments (dept_id, title, employee_count, sort_order) VALUES (?, ?, ?, ?)',
    [dept_id, title, employee_count, sort_order]
  );
}

console.log('🔧 Seeding sample orders...');
const orders = [
  ['SPF-2026-001', 'สมชาย ใจดี',    '0812345678', 'อาหารแช่แข็ง x3',            'delivered', 'จัดส่งสำเร็จ'],
  ['SPF-2026-002', 'กิ่งแก้ว สว่าง', '0898765432', 'อาหารแปรรูป x2',             'shipping',  'กำลังจัดส่ง — กรุงเทพฯ'],
  ['SPF-2026-003', 'อนุสรณ์ เจริญ',  '0823456789', 'อาหารแช่แข็งพรีเมียม x1',   'packing',   'กำลังเตรียมพัสดุ'],
];
for (const [order_id, customer_name, phone, item, status, location] of orders) {
  await conn.query(
    'INSERT IGNORE INTO orders (order_id, customer_name, phone, item, status, location) VALUES (?, ?, ?, ?, ?, ?)',
    [order_id, customer_name, phone, item, status, location]
  );
}

await conn.end();
console.log('✅ Database setup complete!');
console.log('   Admin login: admin / spfoods2026');
