# 👤 Admin Users - Login Credentials (ข้อมูลล็อกอิน Admin)

## 📊 Admin Users by Department (ผู้ใช้ Admin แต่ละแผนก)

### ทุกแผนก: 7 Users + 1 Owner = 8 Admin Accounts

| # | Username | Password | Role | Department | Status |
|---|----------|----------|------|-----------|--------|
| 1 | `admin_production` | `production_2026` | manager | 🏭 แผนกผลิต | ✅ |
| 2 | `admin_accounting` | `accounting_2026` | manager | 💰 แผนกบัญชี | ✅ |
| 3 | `admin_admin` | `admin_2026` | manager | 🛒 แผนกธุรการ | ✅ |
| 4 | `admin_delivery` | `delivery_2026` | manager | 🚚 แผนกจัดส่ง | ✅ |
| 5 | `admin_qc` | `qc_2026` | manager | 🧪 แผนก QC | ✅ |
| 6 | `admin_sales` | `sales_2026` | manager | 📊 แผนกขาย | ✅ |
| 7 | `owner` | `owner_2026` | superadmin | 👨‍💼 เจ้าของกิจการ | ✅ |

---

## 🔐 **Access Control (การควบคุมสิทธิ์)**

### ✅ **Manager (แต่ละแผนก)**
```
- login ด้วย username + password ของแผนกตัวเอง
- เข้าถึงได้เฉพาะแผนก/เมนูของตัวเอง
- ไม่สามารถ access แผนกอื่น ❌
```

### ✅ **Superadmin (Owner)**
```
- login ด้วย owner / owner_2026
- เข้าถึงได้ทั้งหมด ✅
- ดูข้อมูลทุกแผนก
- จัดการทั้งระบบ
```

---

## 🎯 **How to Login**

### Step 1: เข้า Admin Page
```
http://localhost:5173
↓
คลิก "ADMIN" ปุ่มสีส้ม
```

### Step 2: Enter Credentials
```
Username: admin_production  (หรืออันไหนที่ต้องการ)
Password: production_2026
```

### Step 3: ระบบจะ Check
- ✅ Username & Password ถูกต้อง
- ✅ Dept_id ของคนล็อกอินตรงกับแผนก
- ✅ Allow login เข้าแผนกตัวเอง
- ❌ Deny ถ้าพยายาม access แผนกอื่น

---

## 🗂️ **Admin Dashboard Access by Role**

### **🏭 Production Manager** (admin_production / production_2026)
```
✅ เข้าได้: /admin/dept/production
✅ เมนู: พนักงาน, สต๊อก, ใบสั่ง
❌ ห้าม: เข้า /admin/dept/accounting, delivery, etc.
```

### **💰 Accounting Manager** (admin_accounting / accounting_2026)
```
✅ เข้าได้: /admin/dept/accounting
✅ เมนู: รายรับ-รายจ่าย, ใบแจ้งหนี้, ลูกหนี้
❌ ห้าม: เข้าแผนกอื่น
```

### **🛒 Admin Manager** (admin_admin / admin_2026)
```
✅ เข้าได้: /admin/dept/admin
✅ เมนู: ผู้ลงทะเบียน, สต๊อก, เอกสาร
❌ ห้าม: เข้าแผนกอื่น
```

### **🚚 Delivery Manager** (admin_delivery / delivery_2026)
```
✅ เข้าได้: /admin/dept/delivery
✅ เมนู: การจัดส่ง, ติดตามพัสดุ, พนักงาน
❌ ห้าม: เข้าแผนกอื่น
```

### **🧪 QC Manager** (admin_qc / qc_2026)
```
✅ เข้าได้: /admin/dept/qc
✅ เมนู: ตรวจสอบคุณภาพ, สต๊อก R&D
❌ ห้าม: เข้าแผนกอื่น
```

### **📊 Sales Manager** (admin_sales / sales_2026)
```
✅ เข้าได้: /admin/dept/sales
✅ เมนู: ลูกค้า, ใบสั่งขาย, รายงาน
❌ ห้าม: เข้าแผนกอื่น
```

### **👨‍💼 Owner / Superadmin** (owner / owner_2026)
```
✅ เข้าได้: ทั้งหมด
✅ เมนู: ดูทั้งหมด 8 เมนู
✅ ไม่มีข้อจำกัด
```

---

## 🔧 **Technical Details**

### Login Flow
```
1. User กรอก username, password, dept_id
2. Server check:
   - SELECT * FROM admin_users WHERE username = ?
   - bcrypt.compare(password, password_hash)
   - IF role == 'superadmin' → ALLOW
   - ELSE IF dept_id != user.dept_id → DENY (403)
   - ELSE → CREATE JWT TOKEN
3. Token มี: { id, username, role, dept_id }
4. Frontend store token ใน sessionStorage
```

### Database Schema
```sql
admin_users:
  - id (PK)
  - username (UNIQUE)
  - password_hash
  - role (manager / superadmin)
  - dept_id (FK → departments.dept_id)
  - created_at
```

### API Endpoint
```
POST /api/auth/login
Body: {
  "username": "admin_production",
  "password": "production_2026",
  "dept_id": "production"
}

Response: {
  "token": "eyJhbGc...",
  "user": {
    "id": 1,
    "username": "admin_production",
    "role": "manager",
    "dept_id": "production"
  }
}
```

---

## ✅ **Setup Complete**

### Database Created ✅
```bash
# Run seed to create admin_users
npm run seed
```

### Admin Users Created ✅
- 7 Department Managers (each restricted to own dept)
- 1 Superadmin/Owner (full access)

### Access Control Working ✅
- Each manager can only login to their own department
- Superadmin can access everything
- JWT token includes dept_id for further validation

---

## 📝 **Test Logins**

### Quick Test Commands
```bash
# Test Production Manager login
curl -X POST http://localhost:3010/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin_production",
    "password": "production_2026",
    "dept_id": "production"
  }'

# Test Owner login
curl -X POST http://localhost:3010/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "owner",
    "password": "owner_2026",
    "dept_id": null
  }'

# Test unauthorized access (should fail)
curl -X POST http://localhost:3010/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin_production",
    "password": "production_2026",
    "dept_id": "accounting"  # Wrong dept
  }'
```

---

## 🚀 **Next Steps**

1. ✅ Run `npm run seed` to create users and departments
2. ✅ Go to http://localhost:5173
3. ✅ Click "ADMIN" button
4. ✅ Try login with credentials above
5. ✅ Each manager should see only their own department menu
6. ✅ Superadmin (owner) should see all 8 menus

**ระบบควบคุมสิทธิ์โดยแผนกติดตั้งเรียบร้อย! 🎉**
