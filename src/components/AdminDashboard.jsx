import React, { useState, useEffect } from 'react';
import {
  LogOut, Factory, Calculator, ShoppingCart,
  Truck, FlaskConical, TrendingUp, User,
  Bell, Settings, ChevronRight, LayoutDashboard, HeadphonesIcon
} from 'lucide-react';
import DeptLoginModal from './DeptLoginModal';
import DeptDashboard from './DeptDashboard';

const i18n = {
  th: {
    title: 'แดชบอร์ด Admin',
    subtitle: 'เลือกแผนกที่ต้องการจัดการ',
    system: 'ระบบจัดการภายใน',
    logout: 'ออกจากระบบ',
    employees: 'พนักงานทั้งหมด',
    registrations: 'ผู้ลงทะเบียน',
    systemStatus: 'สถานะระบบ',
    normal: 'ปกติ',
    empUnit: 'พนักงาน',
    footer: 'SP FOODS CO.,LTD · ระบบจัดการภายใน · เฉพาะผู้มีสิทธิ์เท่านั้น',
    actions: ['ดูข้อมูล', 'เพิ่มข้อมูล', 'รายงาน'],
    depts: [
      { title: 'แผนกผลิต', subtitle: 'และดูแลพนักงานต่างชาติ', desc: 'จัดการสายการผลิต ควบคุมกะงาน ดูแลพนักงานต่างชาติ' },
      { title: 'แผนกบัญชี', subtitle: 'ภาษีและลูกหนี้', desc: 'จัดการบัญชีรายรับ-รายจ่าย ภาษี และติดตามลูกหนี้' },
      { title: 'แผนกธุรการ', subtitle: 'ขาย-ซื้อ', desc: 'จัดการใบสั่งซื้อ ใบสั่งขาย สต๊อกสินค้า และเอกสาร' },
      { title: 'แผนกติดต่องานภายนอก', subtitle: 'และจัดส่ง', desc: 'ประสานงานภายนอก จัดการโลจิสติกส์ และติดตามการจัดส่ง' },
      { title: 'แผนกควบคุมคุณภาพ', subtitle: 'และ R&D', desc: 'ตรวจสอบคุณภาพสินค้า วิจัยพัฒนาผลิตภัณฑ์ใหม่' },
      { title: 'แผนกขาย', subtitle: 'และการตลาด', desc: 'วางแผนการขาย การตลาด ดูแลลูกค้า และโปรโมชั่น' },
      { title: 'เจ้าของกิจการ', subtitle: 'ดูข้อมูลทั้งหมด', desc: 'ตรวจสอบและดูแลข้อมูลทุกแผนก รายได้ สต๊อก ลูกค้า และรายงานสรุป' },
    ],
    ownerMenus: [
      { icon: '👥', label: 'ข้อมูลพนักงานทั้งหมด' },
      { icon: '📋', label: 'ผู้ลงทะเบียนทั้งหมด' },
      { icon: '🧾', label: 'ใบแจ้งหนี้ / ใบกำกับภาษี' },
      { icon: '📦', label: 'สต๊อกสินค้า' },
      { icon: '🚚', label: 'การจัดส่ง / ติดตามพัสดุ' },
      { icon: '💰', label: 'รายรับ-รายจ่าย' },
      { icon: '🏆', label: 'ข้อมูลลูกค้า / ลูกหนี้' },
      { icon: '📊', label: 'รายงานสรุปภาพรวม' },
    ],
  },
  en: {
    title: 'Admin Dashboard',
    subtitle: 'Select a department to manage',
    system: 'Internal Management System',
    logout: 'Logout',
    employees: 'Total Employees',
    registrations: 'Registrations',
    systemStatus: 'System Status',
    normal: 'Normal',
    empUnit: 'employees',
    footer: 'SP FOODS CO.,LTD · Internal System · Authorized Personnel Only',
    actions: ['View Data', 'Add Data', 'Report'],
    depts: [
      { title: 'Production', subtitle: 'Foreign Worker Management', desc: 'Manage production lines, shift control, and foreign workers' },
      { title: 'Accounting', subtitle: 'Tax & Accounts Receivable', desc: 'Manage income/expenses, taxes, and track receivables' },
      { title: 'Administration', subtitle: 'Sales & Purchase', desc: 'Manage purchase orders, sales orders, stock, and documents' },
      { title: 'External Affairs', subtitle: 'Logistics & Delivery', desc: 'Coordinate external operations, logistics, and delivery tracking' },
      { title: 'Quality Control', subtitle: 'QC & R&D', desc: 'Inspect product quality and develop new products' },
      { title: 'Sales', subtitle: 'Sales & Marketing', desc: 'Plan sales, marketing, customer relations, and promotions' },
      { title: 'Owner / Director', subtitle: 'Full Access', desc: 'View and manage all departments, revenue, stock, customers, and summary reports' },
    ],
    ownerMenus: [
      { icon: '👥', label: 'All Employees' },
      { icon: '📋', label: 'All Registrations' },
      { icon: '🧾', label: 'Invoices / Tax Invoices' },
      { icon: '📦', label: 'Stock & Inventory' },
      { icon: '🚚', label: 'Deliveries & Tracking' },
      { icon: '💰', label: 'Income & Expenses' },
      { icon: '🏆', label: 'Customers / Debtors' },
      { icon: '📊', label: 'Summary Report' },
    ],
  },
  ko: {
    title: '관리자 대시보드',
    subtitle: '관리할 부서를 선택하세요',
    system: '내부 관리 시스템',
    logout: '로그아웃',
    employees: '전체 직원',
    registrations: '등록자',
    systemStatus: '시스템 상태',
    normal: '정상',
    empUnit: '명',
    footer: 'SP FOODS CO.,LTD · 내부 시스템 · 권한자 전용',
    actions: ['데이터 보기', '데이터 추가', '보고서'],
    depts: [
      { title: '생산부', subtitle: '외국인 직원 관리', desc: '생산 라인 관리, 교대 근무 통제, 외국인 직원 관리' },
      { title: '회계부', subtitle: '세금 및 채권', desc: '수입/지출 관리, 세금 처리, 채권 추적' },
      { title: '총무부', subtitle: '영업-구매', desc: '구매 주문, 판매 주문, 재고 및 서류 관리' },
      { title: '대외업무부', subtitle: '물류 및 배송', desc: '외부 업무 조율, 물류 관리, 배송 추적' },
      { title: '품질관리부', subtitle: 'QC & R&D', desc: '제품 품질 검사 및 신제품 개발' },
      { title: '영업부', subtitle: '영업 및 마케팅', desc: '영업 계획, 마케팅, 고객 관리 및 프로모션' },
      { title: '사업주 / 대표', subtitle: '전체 접근 권한', desc: '모든 부서 데이터, 매출, 재고, 고객, 요약 보고서 확인 및 관리' },
    ],
    ownerMenus: [
      { icon: '👥', label: '전체 직원 현황' },
      { icon: '📋', label: '전체 등록자' },
      { icon: '🧾', label: '청구서 / 세금계산서' },
      { icon: '📦', label: '재고 현황' },
      { icon: '🚚', label: '배송 / 추적' },
      { icon: '💰', label: '수입 및 지출' },
      { icon: '🏆', label: '고객 / 채권 관리' },
      { icon: '📊', label: '종합 보고서' },
    ],
  },
};

const deptMeta = [
  { id: 'production', icon: Factory,      color: 'from-orange-500 to-red-500',    bg: 'bg-orange-50',  border: 'border-orange-200', text: 'text-orange-600',  count: 12 },
  { id: 'accounting', icon: Calculator,   color: 'from-blue-500 to-indigo-600',   bg: 'bg-blue-50',    border: 'border-blue-200',   text: 'text-blue-600',    count: 5  },
  { id: 'admin',      icon: ShoppingCart, color: 'from-emerald-500 to-teal-600',  bg: 'bg-emerald-50', border: 'border-emerald-200',text: 'text-emerald-600', count: 8  },
  { id: 'delivery',   icon: Truck,        color: 'from-purple-500 to-violet-600', bg: 'bg-purple-50',  border: 'border-purple-200', text: 'text-purple-600',  count: 10 },
  { id: 'qc',         icon: FlaskConical, color: 'from-cyan-500 to-sky-600',      bg: 'bg-cyan-50',    border: 'border-cyan-200',   text: 'text-cyan-600',    count: 6  },
  { id: 'sales',      icon: TrendingUp,      color: 'from-pink-500 to-rose-600',     bg: 'bg-pink-50',    border: 'border-pink-200',   text: 'text-pink-600',    count: 9  },
  { id: 'service',    icon: HeadphonesIcon,  color: 'from-yellow-400 to-amber-600',  bg: 'bg-yellow-50',  border: 'border-yellow-300', text: 'text-yellow-700',  count: 0, owner: true },
];

const LANGS = [
  { code: 'th', label: 'ไทย' },
  { code: 'en', label: 'EN' },
  { code: 'ko', label: '한국어' },
];

export default function AdminDashboard({ onLogout, token }) {
  const [deptCounts, setDeptCounts] = useState({});
  const [regCount, setRegCount] = useState('...');
  const [lang, setLang] = useState('th');
  const [loginModal, setLoginModal] = useState(null);
  const [deptSession, setDeptSession] = useState(null);

  const t = i18n[lang];

  useEffect(() => {
    if (!token) return;
    fetch('/api/departments', { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(rows => {
        if (Array.isArray(rows)) {
          const map = {};
          rows.forEach(r => { map[r.dept_id] = r.employee_count; });
          setDeptCounts(map);
        }
      })
      .catch(() => {});

    fetch('/api/registrations', { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(rows => { if (Array.isArray(rows)) setRegCount(rows.length); })
      .catch(() => {});
  }, [token]);

  return (
    <div className="fixed inset-0 z-[100] bg-gray-100 overflow-y-auto">

      {/* Top Bar */}
      <div className="bg-gray-900 text-white px-6 py-3 flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-3">
          <img src="/logo.jpg" alt="logo" className="w-8 h-8 rounded-full object-cover border border-white/30" />
          <div>
            <p className="font-bold text-sm leading-tight">SP FOODS CO.,LTD</p>
            <p className="text-gray-400 text-xs">{t.system}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {/* Language switcher */}
          <div className="flex items-center gap-1 bg-white/10 rounded-full px-1 py-1">
            {LANGS.map(l => (
              <button
                key={l.code}
                onClick={() => setLang(l.code)}
                className={`px-2.5 py-1 rounded-full text-xs font-medium transition-colors ${
                  lang === l.code ? 'bg-white text-gray-900' : 'text-gray-300 hover:text-white'
                }`}
              >
                {l.label}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-full text-xs">
            <User className="w-3.5 h-3.5" />
            <span>Admin</span>
          </div>
          <button
            onClick={onLogout}
            className="flex items-center gap-1.5 bg-red-500/20 hover:bg-red-500 px-3 py-1.5 rounded-full text-xs font-medium transition-colors text-red-300 hover:text-white"
          >
            <LogOut className="w-3.5 h-3.5" />
            {t.logout}
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 py-8">

        {/* Welcome */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <LayoutDashboard className="w-5 h-5 text-primary" />
              <h1 className="text-2xl font-bold text-gray-800">{t.title}</h1>
            </div>
            <p className="text-gray-500 text-sm">{t.subtitle}</p>
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2 bg-white rounded-xl shadow hover:shadow-md transition-shadow">
              <Bell className="w-5 h-5 text-gray-500" />
            </button>
            <button className="p-2 bg-white rounded-xl shadow hover:shadow-md transition-shadow">
              <Settings className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label: t.employees,     value: Object.keys(deptCounts).length ? String(Object.values(deptCounts).reduce((a,b)=>a+b,0)) : '50', icon: '👥' },
            { label: t.registrations, value: String(regCount), icon: '📋' },
            { label: t.systemStatus,  value: t.normal, icon: '✅' },
          ].map((s, i) => (
            <div key={i} className="bg-white rounded-2xl p-4 shadow-sm flex items-center gap-4">
              <span className="text-3xl">{s.icon}</span>
              <div>
                <p className="text-2xl font-bold text-gray-800">{s.value}</p>
                <p className="text-xs text-gray-500">{s.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Department Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {deptMeta.map((dept, idx) => {
            const Icon = dept.icon;
            const labels = t.depts[idx];
            const empCount = deptCounts[dept.id] !== undefined ? deptCounts[dept.id] : dept.count;
            return (
              <button
                key={dept.id}
                onClick={() => setLoginModal({ dept, deptIdx: idx })}
                className="text-left rounded-2xl border-2 border-gray-200 bg-white p-5 transition-all duration-200 hover:shadow-lg hover:-translate-y-1 hover:border-gray-300"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${dept.color} flex items-center justify-center shadow-md`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex items-center gap-1">
                    {!dept.owner && (
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${dept.bg} ${dept.text} border ${dept.border}`}>
                        {empCount} {t.empUnit}
                      </span>
                    )}
                    <ChevronRight className="w-4 h-4 text-gray-300" />
                  </div>
                </div>

                {dept.owner && (
                  <div className="mb-2">
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-yellow-400 text-yellow-900">👑 OWNER ACCESS</span>
                  </div>
                )}
                <h3 className="font-bold text-gray-800 text-base leading-tight">{labels.title}</h3>
                <p className={`text-sm font-semibold mb-2 ${dept.text}`}>{labels.subtitle}</p>
                <p className="text-xs text-gray-500 leading-relaxed">{labels.desc}</p>

              </button>
            );
          })}
        </div>

        <p className="text-center text-xs text-gray-400 mt-8">{t.footer}</p>
      </div>

      {loginModal && (
        <DeptLoginModal
          dept={loginModal.dept}
          labels={t.depts[loginModal.deptIdx]}
          lang={lang}
          onClose={() => setLoginModal(null)}
          onSuccess={(session) => { setLoginModal(null); setDeptSession({ ...session, deptIdx: loginModal.deptIdx }); }}
        />
      )}

      {deptSession && (
        <DeptDashboard
          dept={deptSession.dept}
          labels={t.depts[deptSession.deptIdx]}
          token={deptSession.token}
          ownerMenus={t.ownerMenus}
          lang={lang}
          setLang={setLang}
          onClose={() => setDeptSession(null)}
        />
      )}
    </div>
  );
}
