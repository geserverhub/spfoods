import { Factory, Calculator, ShoppingCart, Truck, FlaskConical, TrendingUp, HeadphonesIcon } from 'lucide-react';

export const deptMeta = [
  { id: 'production', icon: Factory,        color: 'from-orange-500 to-red-500',    bg: 'bg-orange-50',  border: 'border-orange-200', text: 'text-orange-600',  count: 12 },
  { id: 'accounting', icon: Calculator,     color: 'from-blue-500 to-indigo-600',   bg: 'bg-blue-50',    border: 'border-blue-200',   text: 'text-blue-600',    count: 5  },
  { id: 'admin',      icon: ShoppingCart,   color: 'from-emerald-500 to-teal-600',  bg: 'bg-emerald-50', border: 'border-emerald-200',text: 'text-emerald-600', count: 8  },
  { id: 'delivery',   icon: Truck,          color: 'from-purple-500 to-violet-600', bg: 'bg-purple-50',  border: 'border-purple-200', text: 'text-purple-600',  count: 10 },
  { id: 'qc',         icon: FlaskConical,   color: 'from-cyan-500 to-sky-600',      bg: 'bg-cyan-50',    border: 'border-cyan-200',   text: 'text-cyan-600',    count: 6  },
  { id: 'sales',      icon: TrendingUp,     color: 'from-pink-500 to-rose-600',     bg: 'bg-pink-50',    border: 'border-pink-200',   text: 'text-pink-600',    count: 9  },
  { id: 'service',    icon: HeadphonesIcon, color: 'from-yellow-400 to-amber-600',  bg: 'bg-yellow-50',  border: 'border-yellow-300', text: 'text-yellow-700',  count: 0, owner: true },
];

export const deptI18n = {
  th: {
    depts: [
      { title: 'แผนกผลิต',              subtitle: 'และดูแลพนักงานต่างชาติ', desc: 'จัดการสายการผลิต ควบคุมกะงาน ดูแลพนักงานต่างชาติ' },
      { title: 'แผนกบัญชี',             subtitle: 'ภาษีและลูกหนี้',          desc: 'จัดการบัญชีรายรับ-รายจ่าย ภาษี และติดตามลูกหนี้' },
      { title: 'แผนกธุรการ',            subtitle: 'ขาย-ซื้อ',                desc: 'จัดการใบสั่งซื้อ ใบสั่งขาย สต๊อกสินค้า และเอกสาร' },
      { title: 'แผนกติดต่องานภายนอก',  subtitle: 'และจัดส่ง',               desc: 'ประสานงานภายนอก จัดการโลจิสติกส์ และติดตามการจัดส่ง' },
      { title: 'แผนกควบคุมคุณภาพ',     subtitle: 'และ R&D',                  desc: 'ตรวจสอบคุณภาพสินค้า วิจัยพัฒนาผลิตภัณฑ์ใหม่' },
      { title: 'แผนกขาย',              subtitle: 'และการตลาด',              desc: 'วางแผนการขาย การตลาด ดูแลลูกค้า และโปรโมชั่น' },
      { title: 'เจ้าของกิจการ',         subtitle: 'ดูข้อมูลทั้งหมด',          desc: 'ตรวจสอบและดูแลข้อมูลทุกแผนก รายได้ สต๊อก ลูกค้า และรายงานสรุป' },
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
    depts: [
      { title: 'Production',       subtitle: 'Foreign Worker Management', desc: 'Manage production lines, shift control, and foreign workers' },
      { title: 'Accounting',       subtitle: 'Tax & Accounts Receivable',  desc: 'Manage income/expenses, taxes, and track receivables' },
      { title: 'Administration',   subtitle: 'Sales & Purchase',           desc: 'Manage purchase orders, sales orders, stock, and documents' },
      { title: 'External Affairs', subtitle: 'Logistics & Delivery',       desc: 'Coordinate external operations, logistics, and delivery tracking' },
      { title: 'Quality Control',  subtitle: 'QC & R&D',                   desc: 'Inspect product quality and develop new products' },
      { title: 'Sales',            subtitle: 'Sales & Marketing',          desc: 'Plan sales, marketing, customer relations, and promotions' },
      { title: 'Owner / Director', subtitle: 'Full Access',                desc: 'View and manage all departments, revenue, stock, customers, and summary reports' },
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
    depts: [
      { title: '생산부',        subtitle: '외국인 직원 관리',    desc: '생산 라인 관리, 교대 근무 통제, 외국인 직원 관리' },
      { title: '회계부',        subtitle: '세금 및 채권',         desc: '수입/지출 관리, 세금 처리, 채권 추적' },
      { title: '총무부',        subtitle: '영업-구매',             desc: '구매 주문, 판매 주문, 재고 및 서류 관리' },
      { title: '대외업무부',    subtitle: '물류 및 배송',          desc: '외부 업무 조율, 물류 관리, 배송 추적' },
      { title: '품질관리부',    subtitle: 'QC & R&D',              desc: '제품 품질 검사 및 신제품 개발' },
      { title: '영업부',        subtitle: '영업 및 마케팅',        desc: '영업 계획, 마케팅, 고객 관리 및 프로모션' },
      { title: '사업주 / 대표', subtitle: '전체 접근 권한',        desc: '모든 부서 데이터, 매출, 재고, 고객, 요약 보고서 확인 및 관리' },
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
  my: {
    depts: [
      { title: 'ထုတ်လုပ်မှုဌာန',     subtitle: 'နိုင်ငံခြားဝန်ထမ်း စီမံခန့်ခွဲမှု', desc: 'ထုတ်လုပ်မှုလိုင်း၊ အလှည့်ကျစနစ် နှင့် နိုင်ငံခြားဝန်ထမ်းများ စီမံခန့်ခွဲ' },
      { title: 'စာရင်းဌာန',           subtitle: 'အခွန်နှင့် လက်ခံငွေ',               desc: 'ဝင်ငွေ/ထွက်ငွေ၊ အခွန် နှင့် လက်ခံငွေ စီမံခန့်ခွဲ' },
      { title: 'စီမံရေးဌာန',          subtitle: 'ရောင်းဝယ်ရေး',                       desc: 'ဝယ်ယူမှု၊ ရောင်းချမှု၊ စတော့ နှင့် စာရွက်စာတမ်း စီမံခန့်ခွဲ' },
      { title: 'ပြင်ပဆက်ဆံရေးဌာန',  subtitle: 'ထောက်ပံ့ပို့ဆောင်ရေး',              desc: 'ပြင်ပဆက်သွယ်ရေး၊ ထောက်ပံ့ပို့ဆောင်ရေး နှင့် ပစ္စည်းအခြေအနေ ခြေရာခံ' },
      { title: 'အရည်အသွေးထိန်းဌာန', subtitle: 'QC & R&D',                             desc: 'ထုတ်ကုန်အရည်အသွေး စစ်ဆေး နှင့် ထုတ်ကုန်အသစ် သုတေသနပြု' },
      { title: 'ရောင်းချရေးဌာန',      subtitle: 'ရောင်းချရေး နှင့် မားကတ်တင်',       desc: 'ရောင်းချရေးစီမံကိန်း၊ မားကတ်တင်၊ ဖောက်သည်ဆက်ဆံရေး နှင့် ပရိုမိုးရှင်' },
      { title: 'ပိုင်ရှင် / ဒါရိုက်တာ', subtitle: 'အပြည့်အဝ ဝင်ရောက်ခွင့်',           desc: 'ဌာနအားလုံး၊ ဝင်ငွေ၊ စတော့၊ ဖောက်သည် နှင့် အနှစ်ချုပ်အစီရင်ခံစာများ ကြည့်ရှု စီမံ' },
    ],
    ownerMenus: [
      { icon: '👥', label: 'ဝန်ထမ်းအားလုံး' },
      { icon: '📋', label: 'မှတ်ပုံတင်သူအားလုံး' },
      { icon: '🧾', label: 'ငွေတောင်းခံလွှာ / အခွန်ဘောင်ချာ' },
      { icon: '📦', label: 'စတော့ပစ္စည်း' },
      { icon: '🚚', label: 'ပို့ဆောင်မှု / ခြေရာခံ' },
      { icon: '💰', label: 'ဝင်ငွေနှင့် ထွက်ငွေ' },
      { icon: '🏆', label: 'ဖောက်သည် / လက်ခံငွေ' },
      { icon: '📊', label: 'အနှစ်ချုပ်အစီရင်ခံစာ' },
    ],
  },
};
