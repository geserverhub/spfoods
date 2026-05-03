import { apiFetch } from '../../lib/api.js'
import { useEffect, useState } from 'react'
import { Trash2, CheckCircle } from 'lucide-react'

const i18n = {
  th: {
    title: 'สร้างใบสั่งขาย', soNo: 'เลขที่ใบสั่งขาย', date: 'วันที่', dueDate: 'วันกำหนดส่ง',
    customer: 'ชื่อลูกค้า / บริษัท', address: 'ที่อยู่', taxId: 'เลขประจำตัวผู้เสียภาษี',
    items: 'รายการสินค้า', product: 'ชื่อสินค้า', unit: 'หน่วย', qty: 'จำนวน',
    price: 'ราคา/หน่วย', discount: 'ส่วนลด', amount: 'รวม', addRow: '+ เพิ่มรายการ',
    subtotal: 'ยอดรวมก่อนภาษี', vat: 'ภาษีมูลค่าเพิ่ม 10%', total: 'ยอดรวมสุทธิ',
    note: 'หมายเหตุ', submit: 'สร้างใบสั่งขาย', success: 'สร้างใบสั่งขายสำเร็จ',
    new: 'สร้างใหม่', payType: 'ประเภทการชำระเงิน', payTerm: 'เงื่อนไขการชำระ',
    contract: 'เลขที่สัญญาซื้อขาย', searchContract: 'ค้นหาสัญญา', attachContract: 'แนบสัญญา',
    contractRequired: '⚠️ กรุณาแนบเลขที่สัญญาซื้อขาย (CNTyyyyymmdd-00001) ก่อนบันทึก',
    cash: 'เงินสด', credit: 'เครดิต', transfer: 'โอนเงิน',
  },
  en: {
    title: 'Create Sales Order', soNo: 'SO Number', date: 'Date', dueDate: 'Due Date',
    customer: 'Customer / Company', address: 'Address', taxId: 'Tax ID',
    items: 'Order Items', product: 'Product Name', unit: 'Unit', qty: 'Qty',
    price: 'Unit Price', discount: 'Discount', amount: 'Amount', addRow: '+ Add Item',
    subtotal: 'Subtotal', vat: 'VAT 10%', total: 'Total',
    note: 'Note', submit: 'Create Sales Order', success: 'Sales Order Created',
    new: 'New Order', payType: 'Payment Type', payTerm: 'Payment Terms',
    contract: 'Contract No.', searchContract: 'Search Contract', attachContract: 'Attach',
    contractRequired: '⚠️ Please attach a Contract No. (CNTyyyymmdd-00001) before saving',
    cash: 'Cash', credit: 'Credit', transfer: 'Transfer',
  },
  ko: {
    title: '판매 주문 작성', soNo: '주문 번호', date: '날짜', dueDate: '납기일',
    customer: '고객 / 회사명', address: '주소', taxId: '사업자번호',
    items: '주문 항목', product: '제품명', unit: '단위', qty: '수량',
    price: '단가', discount: '할인', amount: '금액', addRow: '+ 항목 추가',
    subtotal: '소계', vat: '부가세 10%', total: '합계',
    note: '메모', submit: '판매 주문 작성', success: '판매 주문 생성 완료',
    new: '새 주문', payType: '결제 유형', payTerm: '결제 조건',
    contract: '계약 번호', searchContract: '계약 검색', attachContract: '첨부',
    contractRequired: '⚠️ 저장하기 전에 계약 번호 (CNTyyyymmdd-00001)를 첨부해 주세요',
    cash: '현금', credit: '외상', transfer: '계좌이체',
  },
}

const CURRENCIES = [
  { value: 'THB', label: 'บาท',   symbol: '฿',  flag: '🇹🇭' },
  { value: 'KRW', label: '원',    symbol: '₩',  flag: '🇰🇷' },
  { value: 'USD', label: 'ดอลลาร์', symbol: '$', flag: '🇺🇸' },
  { value: 'CNY', label: 'หยวน',  symbol: '¥', flag: '🇨🇳' },
]
const emptyItem = () => ({ product_id: null, product_name: '', unit: 'กก.', qty: 1, price_unit: 0, discount: 0, amount: 0 })
const today = () => new Date().toISOString().slice(0, 10)

export default function SalesOrder({ token, lang, deptColor }) {
  const t = i18n[lang] || i18n.th
  const [soNo, setSoNo]       = useState('')
  const [form, setForm]       = useState({ customer_name: '', customer_address: '', customer_tax_id: '', so_date: today(), due_date: '', note: '' })
  const [items, setItems]     = useState([emptyItem()])
  const [submitting, setSubmitting] = useState(false)
  const [done, setDone]       = useState(null)
  const [submitError, setSubmitError] = useState('')
  const [products, setProducts]   = useState([])
  const [customers, setCustomers] = useState([])
  const [currency, setCurrency]   = useState('THB')
  const [payType, setPayType]     = useState('cash')
  const [payTerm, setPayTerm]     = useState('ชำระทันที')
  const [contractNo, setContractNo]     = useState('')
  const [contractSearch, setContractSearch] = useState('')
  const [contractResults, setContractResults] = useState([])
  const [showContractSearch, setShowContractSearch] = useState(false)
  const [contractSearching, setContractSearching] = useState(false)

  useEffect(() => {
    const h = { Authorization: `Bearer ${token}` }
    apiFetch('/api/sales-orders/next-no', { headers: h }).then(r => r.json()).then(d => setSoNo(d.so_no)).catch(() => {})
    apiFetch('/api/products',  { headers: h }).then(r => r.json()).then(d => setProducts(Array.isArray(d) ? d : [])).catch(() => {})
    apiFetch('/api/customers', { headers: h }).then(r => r.json()).then(d => setCustomers(Array.isArray(d) ? d : [])).catch(() => {})
  }, [token])

  const searchContracts = async q => {
    const keyword = String(q || '').trim()
    setContractSearch(q)
    setShowContractSearch(true)
    if (!keyword) { setContractResults([]); return }
    setContractSearching(true)
    try {
      const res = await apiFetch(`/api/contracts/search?q=${encodeURIComponent(keyword)}`, { headers: { Authorization: `Bearer ${token}` } })
      const data = await res.json()
      const rows = Array.isArray(data) ? data : []
      setContractResults(rows)

      // ถ้าพิมพ์เลขสัญญาตรงตัว ให้แนบอัตโนมัติทันที
      const exact = rows.find(r => String(r.contract_no || '').toLowerCase() === keyword.toLowerCase())
      if (exact) {
        attachContract(exact)
      }
    } catch {
      setContractResults([])
    } finally {
      setContractSearching(false)
    }
  }

  const attachContract = c => {
    const matchedCustomer = customers.find(x => Number(x.id) === Number(c.customer_id))
      || customers.find(x => String(x.customer_name || '').trim() === String(c.customer_name || '').trim())

    setContractNo(c.contract_no)
    setContractSearch(c.contract_no)
    setContractResults([])
    setShowContractSearch(false)
    setSubmitError('')

    setForm(prev => ({
      ...prev,
      customer_id: c.customer_id || matchedCustomer?.id || prev.customer_id,
      customer_name: c.customer_name || matchedCustomer?.customer_name || prev.customer_name,
      customer_address: c.customer_address || matchedCustomer?.address || prev.customer_address,
      customer_tax_id: c.customer_tax_id || matchedCustomer?.tax_id || prev.customer_tax_id,
    }))
  }

  const selectCustomer = id => {
    const c = customers.find(c => c.id === parseInt(id))
    if (!c) return
    setForm(p => ({ ...p, customer_id: c.id, customer_name: c.customer_name, customer_address: c.address || '', customer_tax_id: c.tax_id || '' }))
  }

  const handleForm = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }))

  const handleItem = (i, field, val) => {
    setItems(prev => {
      const next = prev.map((it, idx) => idx === i ? { ...it, [field]: val } : it)
      const it = next[i]
      if (field === 'qty' || field === 'price_unit' || field === 'discount') {
        const qty   = parseFloat(field === 'qty'       ? val : it.qty)       || 0
        const price = parseFloat(field === 'price_unit' ? val : it.price_unit) || 0
        const disc  = parseFloat(field === 'discount'   ? val : it.discount)   || 0
        next[i] = { ...next[i], amount: parseFloat(((qty * price) - disc).toFixed(2)) }
      }
      if (field === 'product_id') {
        const p = products.find(p => p.id === parseInt(val))
        if (p) next[i] = { ...next[i], product_name: p.product_name, unit: p.unit || '', price_unit: parseFloat(p.price_sell) || 0, amount: parseFloat(((parseFloat(it.qty) * parseFloat(p.price_sell)) - it.discount).toFixed(2)) }
      }
      return next
    })
  }

  const addRow    = () => setItems(p => [...p, emptyItem()])
  const removeRow = i  => setItems(p => p.filter((_, idx) => idx !== i))

  const subtotal   = items.reduce((s, it) => s + (parseFloat(it.amount) || 0), 0)
  const vat_amount = parseFloat((subtotal * 0.10).toFixed(2))
  const total      = parseFloat((subtotal + vat_amount).toFixed(2))
  const fmt        = n => n.toLocaleString('th-TH', { minimumFractionDigits: 2 })

  const handleSubmit = async e => {
    e.preventDefault()
    if (!contractNo.trim()) {
      setSubmitError(t.contractRequired)
      return
    }
    setSubmitting(true)
    setSubmitError('')
    try {
      const res = await apiFetch('/api/sales-orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          ...form,
          items,
          vat_pct: 10,
          payment_type: payType,
          payment_terms: payTerm,
          currency,
          contract_no: contractNo || null,
        }),
      })
      const data = await res.json()
      if (data.success) {
        setDone(data.so_no)
      } else {
        setSubmitError(data.error || 'เกิดข้อผิดพลาด กรุณาลองใหม่')
      }
    } catch {
      setSubmitError('เกิดข้อผิดพลาด กรุณาลองใหม่')
    }
    setSubmitting(false)
  }

  const reset = async () => {
    setDone(null)
    setForm({ customer_name: '', customer_address: '', customer_tax_id: '', so_date: today(), due_date: '', note: '' })
    setItems([emptyItem()])
    const r = await apiFetch('/api/sales-orders/next-no', { headers: { Authorization: `Bearer ${token}` } })
    const d = await r.json()
    setSoNo(d.so_no)
  }

  if (done) return (
    <div className="bg-white rounded-2xl p-10 text-center border border-gray-100 shadow-sm">
      <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <CheckCircle className="w-10 h-10 text-green-500" />
      </div>
      <h3 className="text-xl font-bold text-gray-900 mb-1">{t.success}</h3>
      <p className="text-gray-600 font-mono text-lg mb-6">{done}</p>
      <button onClick={reset} className={`px-6 py-3 rounded-xl font-semibold text-white bg-gradient-to-r ${deptColor} hover:opacity-90`}>
        {t.new}
      </button>
    </div>
  )

  return (
    <form onSubmit={handleSubmit} className="space-y-6">

      {/* เลข SO + วันที่ */}
      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-gray-800 mb-1">{t.soNo}</label>
            <input value={soNo} readOnly className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm font-mono bg-gray-50 text-gray-700 cursor-not-allowed" />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-800 mb-1">{t.date} *</label>
            <input type="text" name="so_date" value={form.so_date} onChange={handleForm} required placeholder="YYYY-MM-DD" pattern="\d{4}-\d{2}-\d{2}" className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-900 font-mono focus:outline-none focus:ring-2 focus:ring-blue-200" />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-800 mb-1">{t.dueDate}</label>
            <input type="date" name="due_date" value={form.due_date} onChange={handleForm} className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-200" />
          </div>
        </div>
      </div>

      {/* ประเภทการชำระเงิน + เงื่อนไข + สัญญา */}
      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
        <div className="grid grid-cols-3 gap-6">

          {/* ประเภทการชำระเงิน */}
          <div>
            <label className="block text-xs font-bold text-gray-800 mb-2">{t.payType}</label>
            <div className="flex gap-2">
              {[
                { value: 'cash',     label: t.cash,     icon: '💵' },
                { value: 'transfer', label: t.transfer, icon: '🏦' },
                { value: 'credit',   label: t.credit,   icon: '💳' },
              ].map(p => (
                <button key={p.value} type="button" onClick={() => setPayType(p.value)}
                  className={`flex-1 flex flex-col items-center gap-1 py-2 rounded-xl border-2 text-xs font-semibold transition-all ${
                    payType === p.value ? 'border-blue-400 bg-blue-50 text-blue-700' : 'border-gray-200 text-gray-600 hover:border-gray-300'
                  }`}>
                  <span className="text-base">{p.icon}</span>{p.label}
                </button>
              ))}
            </div>
          </div>

          {/* เงื่อนไขการชำระ */}
          <div>
            <label className="block text-xs font-bold text-gray-800 mb-2">{t.payTerm}</label>
            <select value={payTerm} onChange={e => setPayTerm(e.target.value)}
              className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-200">
              <option>ชำระทันที</option>
              <option>ชำระภายใน 7 วัน</option>
              <option>ชำระภายใน 15 วัน</option>
              <option>ชำระภายใน 30 วัน</option>
              <option>ชำระภายใน 45 วัน</option>
              <option>ชำระภายใน 60 วัน</option>
              <option>ชำระภายใน 90 วัน</option>
            </select>
          </div>

          {/* เลขที่สัญญาซื้อขาย */}
          <div>
            <label className="block text-xs font-bold text-gray-800 mb-2">
              {t.contract} <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="flex gap-2">
                <input
                  value={contractSearch}
                  onChange={e => searchContracts(e.target.value)}
                  onFocus={() => setShowContractSearch(true)}
                  onKeyDown={e => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      searchContracts(contractSearch)
                    }
                  }}
                  placeholder="CNT20260503-00001"
                  className="flex-1 px-3 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-900 font-mono focus:outline-none focus:ring-2 focus:ring-blue-200"
                />
                <button type="button" onClick={() => { setShowContractSearch(true); searchContracts(contractSearch) }}
                  className="px-3 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-700">
                  🔍
                </button>
              </div>
              {/* Dropdown ผลลัพธ์ */}
              {showContractSearch && contractSearch.trim() && (
                <div className="absolute z-10 top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg max-h-48 overflow-y-auto">
                  {contractSearching ? (
                    <p className="px-4 py-3 text-xs text-gray-500">กำลังค้นหา...</p>
                  ) : contractResults.length === 0 ? (
                    <p className="px-4 py-3 text-xs text-red-500">ไม่พบเลขที่สัญญาจากคำค้น "{contractSearch}"</p>
                  ) : contractResults.map(c => (
                    <button key={c.id} type="button" onClick={() => attachContract(c)}
                      className="w-full text-left px-4 py-2.5 hover:bg-blue-50 border-b border-gray-100 last:border-0">
                      <p className="font-mono text-xs font-bold text-blue-700">{c.contract_no}</p>
                      <p className="text-xs text-gray-700">{c.customer_name} — {c.title}</p>
                    </button>
                  ))}
                </div>
              )}
              {contractNo ? (
                <p className="mt-1 text-xs text-green-700 font-medium">✓ แนบสัญญา: {contractNo}</p>
              ) : contractSearch.trim() ? (
                <p className="mt-1 text-xs text-amber-600 font-medium">พิมพ์แล้วกด 🔍 หรือเลือกจากรายการเพื่อแนบสัญญา</p>
              ) : (
                <p className="mt-1 text-xs text-red-500 font-medium">{t.contractRequired}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ข้อมูลลูกค้า */}
      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
        <h4 className="font-bold text-gray-900 mb-4 text-sm">{t.customer}</h4>
        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className="block text-xs font-bold text-gray-800 mb-1">{t.customer} *</label>
            <select
              onChange={e => selectCustomer(e.target.value)}
              className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-200 mb-2"
            >
              <option value="">— เลือกลูกค้าจากฐานข้อมูล —</option>
              {customers.map(c => (
                <option key={c.id} value={c.id}>{c.customer_code ? `[${c.customer_code}] ` : ''}{c.customer_name}</option>
              ))}
            </select>
            <input name="customer_name" value={form.customer_name} onChange={handleForm} required placeholder="หรือพิมพ์ชื่อลูกค้า / บริษัท" className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-200" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-800 mb-1">{t.address}</label>
              <textarea name="customer_address" value={form.customer_address} onChange={handleForm} rows={2} className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm text-gray-900 resize-none focus:outline-none focus:ring-2 focus:ring-blue-200" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-800 mb-1">{t.taxId}</label>
              <input name="customer_tax_id" value={form.customer_tax_id} onChange={handleForm} className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-200" />
            </div>
          </div>
        </div>
      </div>

      {/* รายการสินค้า */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h4 className="font-bold text-gray-900 text-sm">{t.items}</h4>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-xs font-bold text-gray-800">
              <tr>
                <th className="px-4 py-3 text-left w-8">#</th>
                <th className="px-4 py-3 text-left">{t.product}</th>
                <th className="px-4 py-3 text-left w-24">{t.unit}</th>
                <th className="px-4 py-3 text-right w-24">{t.qty}</th>
                <th className="px-4 py-3 text-right w-32">{t.price}</th>
                <th className="px-4 py-3 text-right w-28">{t.discount}</th>
                <th className="px-4 py-3 text-right w-32">{t.amount}</th>
                <th className="px-4 py-3 w-10"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {items.map((it, i) => (
                <tr key={i} className="hover:bg-gray-50">
                  <td className="px-4 py-2 text-gray-500 text-xs">{i + 1}</td>
                  <td className="px-4 py-2">
                    <div className="space-y-1">
                      <select
                        onChange={e => {
                          const p = products.find(p => p.id === parseInt(e.target.value))
                          if (p) {
                            handleItem(i, 'product_id', p.id)
                            setItems(prev => {
                              const next = [...prev]
                              const qty = parseFloat(next[i].qty) || 1
                              const price = parseFloat(p.price_sell) || 0
                              next[i] = { ...next[i], product_id: p.id, product_name: p.product_name, unit: p.unit || '', price_unit: price, amount: parseFloat((qty * price).toFixed(2)) }
                              return next
                            })
                          }
                        }}
                        className="w-full px-2 py-1.5 border border-gray-200 rounded-lg text-xs text-gray-900 focus:outline-none focus:ring-1 focus:ring-blue-300 bg-white"
                      >
                        <option value="">— เลือกสินค้า —</option>
                        {products.map(p => (
                          <option key={p.id} value={p.id}>{p.product_code} — {p.product_name}</option>
                        ))}
                      </select>
                      <input
                        value={it.product_name}
                        onChange={e => handleItem(i, 'product_name', e.target.value)}
                        placeholder="หรือพิมพ์ชื่อสินค้า"
                        className="w-full px-2 py-1.5 border border-gray-200 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-1 focus:ring-blue-300"
                      />
                    </div>
                  </td>
                  <td className="px-4 py-2">
                    <input value={it.unit} onChange={e => handleItem(i, 'unit', e.target.value)} className="w-full px-2 py-1.5 border border-gray-200 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-1 focus:ring-blue-300" />
                  </td>
                  <td className="px-4 py-2">
                    <input type="number" min="0" value={it.qty} onChange={e => handleItem(i, 'qty', e.target.value)} className="w-full px-2 py-1.5 border border-gray-200 rounded-lg text-sm text-right text-gray-900 focus:outline-none focus:ring-1 focus:ring-blue-300" />
                  </td>
                  <td className="px-4 py-2">
                    <input type="number" min="0" value={it.price_unit} onChange={e => handleItem(i, 'price_unit', e.target.value)} className="w-full px-2 py-1.5 border border-gray-200 rounded-lg text-sm text-right text-gray-900 focus:outline-none focus:ring-1 focus:ring-blue-300" />
                  </td>
                  <td className="px-4 py-2">
                    <input type="number" min="0" value={it.discount} onChange={e => handleItem(i, 'discount', e.target.value)} className="w-full px-2 py-1.5 border border-gray-200 rounded-lg text-sm text-right text-gray-900 focus:outline-none focus:ring-1 focus:ring-blue-300" />
                  </td>
                  <td className="px-4 py-2 text-right font-semibold text-gray-900">
                    {fmt(parseFloat(it.amount) || 0)}
                  </td>
                  <td className="px-4 py-2">
                    {items.length > 1 && (
                      <button type="button" onClick={() => removeRow(i)} className="text-red-400 hover:text-red-600">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-6 py-3 border-t border-gray-100">
          <button type="button" onClick={addRow} className="text-sm text-blue-600 hover:text-blue-800 font-medium">{t.addRow}</button>
        </div>
      </div>

      {/* ยอดรวม + หมายเหตุ */}
      <div className="grid grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <label className="block text-xs font-bold text-gray-800 mb-1">{t.note}</label>
          <textarea name="note" value={form.note} onChange={handleForm} rows={4} className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm text-gray-900 resize-none focus:outline-none focus:ring-2 focus:ring-blue-200" />
        </div>
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-3">
          {/* Currency selector */}
          <div className="flex gap-2 pb-2 border-b border-gray-100">
            {CURRENCIES.map(c => (
              <button
                key={c.value}
                type="button"
                onClick={() => setCurrency(c.value)}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl border-2 text-xs font-bold transition-all ${
                  currency === c.value
                    ? 'border-blue-400 bg-blue-50 text-blue-700'
                    : 'border-gray-200 text-gray-600 hover:border-gray-300'
                }`}
              >
                <span>{c.flag}</span> {c.symbol} {c.label}
              </button>
            ))}
          </div>
          <div className="flex justify-between text-sm text-gray-700">
            <span>{t.subtotal}</span>
            <span className="font-semibold text-gray-900">{CURRENCIES.find(c=>c.value===currency)?.symbol} {fmt(subtotal)}</span>
          </div>
          <div className="flex justify-between text-sm text-gray-700">
            <span>{t.vat}</span>
            <span className="font-semibold text-gray-900">{CURRENCIES.find(c=>c.value===currency)?.symbol} {fmt(vat_amount)}</span>
          </div>
          <div className="flex justify-between text-base font-bold text-gray-900 border-t border-gray-200 pt-3">
            <span>{t.total}</span>
            <span className="text-blue-700 text-lg">{CURRENCIES.find(c=>c.value===currency)?.symbol} {fmt(total)} <span className="text-sm font-medium text-gray-500">{currency}</span></span>
          </div>
        </div>
      </div>

      {/* Submit */}
      <div className="flex justify-end">
        {submitError && (
          <div className="mb-3 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
            {submitError}
          </div>
        )}
        <button
          type="submit"
          disabled={submitting || !contractNo || items.every(it => !it.product_name)}
          className={`px-8 py-3 rounded-xl font-bold text-white text-sm bg-gradient-to-r ${deptColor} hover:opacity-90 disabled:opacity-50 transition-opacity`}
        >
          {submitting ? '...' : !contractNo ? `🔍 ${t.contract}` : t.submit}
        </button>
      </div>
    </form>
  )
}
