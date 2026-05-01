import React, { useState, useEffect } from 'react';
import {
  LogOut, Factory, Calculator, ShoppingCart,
  Truck, FlaskConical, TrendingUp, User,
  Bell, Settings, ChevronRight, LayoutDashboard
} from 'lucide-react';

const departments = [
  {
    id: 'production',
    icon: Factory,
    title: 'แผนกผลิต',
    subtitle: 'และดูแลพนักงานต่างชาติ',
    desc: 'จัดการสายการผลิต ควบคุมกะงาน ดูแลพนักงานต่างชาติ',
    color: 'from-orange-500 to-red-500',
    bg: 'bg-orange-50',
    border: 'border-orange-200',
    text: 'text-orange-600',
    count: '12 พนักงาน',
  },
  {
    id: 'accounting',
    icon: Calculator,
    title: 'แผนกบัญชี',
    subtitle: 'ภาษีและลูกหนี้',
    desc: 'จัดการบัญชีรายรับ-รายจ่าย ภาษี และติดตามลูกหนี้',
    color: 'from-blue-500 to-indigo-600',
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    text: 'text-blue-600',
    count: '5 พนักงาน',
  },
  {
    id: 'admin',
    icon: ShoppingCart,
    title: 'แผนกธุรการ',
    subtitle: 'ขาย-ซื้อ',
    desc: 'จัดการใบสั่งซื้อ ใบสั่งขาย สต๊อกสินค้า และเอกสาร',
    color: 'from-emerald-500 to-teal-600',
    bg: 'bg-emerald-50',
    border: 'border-emerald-200',
    text: 'text-emerald-600',
    count: '8 พนักงาน',
  },
  {
    id: 'delivery',
    icon: Truck,
    title: 'แผนกติดต่องานภายนอก',
    subtitle: 'และจัดส่ง',
    desc: 'ประสานงานภายนอก จัดการโลจิสติกส์ และติดตามการจัดส่ง',
    color: 'from-purple-500 to-violet-600',
    bg: 'bg-purple-50',
    border: 'border-purple-200',
    text: 'text-purple-600',
    count: '10 พนักงาน',
  },
  {
    id: 'qc',
    icon: FlaskConical,
    title: 'แผนกควบคุมคุณภาพ',
    subtitle: 'และ R&D',
    desc: 'ตรวจสอบคุณภาพสินค้า วิจัยพัฒนาผลิตภัณฑ์ใหม่',
    color: 'from-cyan-500 to-sky-600',
    bg: 'bg-cyan-50',
    border: 'border-cyan-200',
    text: 'text-cyan-600',
    count: '6 พนักงาน',
  },
  {
    id: 'sales',
    icon: TrendingUp,
    title: 'แผนกขาย',
    subtitle: 'และการตลาด',
    desc: 'วางแผนการขาย การตลาด ดูแลลูกค้า และโปรโมชั่น',
    color: 'from-pink-500 to-rose-600',
    bg: 'bg-pink-50',
    border: 'border-pink-200',
    text: 'text-pink-600',
    count: '9 พนักงาน',
  },
];

export default function AdminDashboard({ onLogout, token }) {
  const [activeDept, setActiveDept] = useState(null);
  const [deptCounts, setDeptCounts] = useState({});
  const [regCount, setRegCount] = useState('...');

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
            <p className="text-gray-400 text-xs">ระบบจัดการภายใน</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-full text-xs">
            <User className="w-3.5 h-3.5" />
            <span>Admin</span>
          </div>
          <button
            onClick={onLogout}
            className="flex items-center gap-1.5 bg-red-500/20 hover:bg-red-500 px-3 py-1.5 rounded-full text-xs font-medium transition-colors text-red-300 hover:text-white"
          >
            <LogOut className="w-3.5 h-3.5" />
            ออกจากระบบ
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
              <h1 className="text-2xl font-bold text-gray-800">แดชบอร์ด Admin</h1>
            </div>
            <p className="text-gray-500 text-sm">เลือกแผนกที่ต้องการจัดการ</p>
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
            { label: 'พนักงานทั้งหมด', value: Object.keys(deptCounts).length ? String(Object.values(deptCounts).reduce((a,b)=>a+b,0)) : '50', icon: '👥' },
            { label: 'ผู้ลงทะเบียน', value: String(regCount), icon: '📋' },
            { label: 'สถานะระบบ', value: 'ปกติ', icon: '✅' },
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
          {departments.map((dept) => {
            const Icon = dept.icon;
            const isActive = activeDept === dept.id;
            return (
              <button
                key={dept.id}
                onClick={() => setActiveDept(isActive ? null : dept.id)}
                className={`text-left rounded-2xl border-2 p-5 transition-all duration-200 hover:shadow-lg hover:-translate-y-1 ${
                  isActive
                    ? `${dept.border} ${dept.bg} shadow-lg -translate-y-1`
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${dept.color} flex items-center justify-center shadow-md`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex items-center gap-1">
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${dept.bg} ${dept.text} border ${dept.border}`}>
                      {deptCounts[dept.id] !== undefined ? `${deptCounts[dept.id]} พนักงาน` : dept.count}
                    </span>
                    <ChevronRight className={`w-4 h-4 transition-transform ${isActive ? 'rotate-90 ' + dept.text : 'text-gray-300'}`} />
                  </div>
                </div>

                {/* Title */}
                <h3 className="font-bold text-gray-800 text-base leading-tight">{dept.title}</h3>
                <p className={`text-sm font-semibold mb-2 ${dept.text}`}>{dept.subtitle}</p>
                <p className="text-xs text-gray-500 leading-relaxed">{dept.desc}</p>

                {/* Expanded */}
                {isActive && (
                  <div className={`mt-4 pt-4 border-t ${dept.border} space-y-2`}>
                    {['ดูข้อมูล', 'เพิ่มข้อมูล', 'รายงาน'].map((action) => (
                      <div key={action}
                        className={`flex items-center justify-between px-3 py-2 rounded-xl bg-white border ${dept.border} text-sm font-medium ${dept.text} hover:bg-white cursor-pointer`}
                      >
                        <span>{action}</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </div>
                    ))}
                  </div>
                )}
              </button>
            );
          })}
        </div>

        <p className="text-center text-xs text-gray-400 mt-8">
          SP FOODS CO.,LTD · ระบบจัดการภายใน · เฉพาะผู้มีสิทธิ์เท่านั้น
        </p>
      </div>
    </div>
  );
}
