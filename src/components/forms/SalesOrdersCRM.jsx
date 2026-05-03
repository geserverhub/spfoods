import { apiFetch } from '../../lib/api.js'
import { useEffect, useRef, useState } from 'react'
import { Search, Plus, Trash2, Calendar, Phone, Mail, MapPin, X } from 'lucide-react'

const i18n = {
  th: {
    searchPlaceholder: 'ค้นหารหัส / ชื่อลูกค้า / เบอร์โทร...',
    newTracking: 'เพิ่มบันทึกการติดตาม',
    interactionType: 'ประเภทการติดตาม',
    serviceStage: 'สถานะ',
    description: 'รายละเอียด',
    notes: 'หมายเหตุ',
    addRecord: 'บันทึก',
    cancel: 'ยกเลิก',
    trackingHistory: 'ประวัติการติดตาม',
    relatedOrders: 'ใบสั่งขายที่เกี่ยวข้อง',
    noTracking: 'ยังไม่มีบันทึกการติดตาม',
    noOrders: 'ไม่มีใบสั่งขาย',
    selectCustomer: 'ค้นหาและเลือกลูกค้าเพื่อเริ่มต้น',
    soNo: 'เลขที่ SO',
    amount: 'ยอดรวม',
    no: 'ลำดับ',
    updatedDate: 'วันที่อัปเดต',
    soStatus: 'สถานะ SO',
    contractNo: 'เลขที่สัญญา',
    loading: 'กำลังโหลด...',
    success: '✓ บันทึกสำเร็จ',
    error: 'เกิดข้อผิดพลาด',
    searching: 'กำลังค้นหา...',
    noResults: 'ไม่พบลูกค้า',
    changeCustomer: 'เปลี่ยนลูกค้า',
    selectSalesOrder: 'เลือกใบสั่งขาย (ถ้ามี)',
    selectSalesOrderPlaceholder: '— เลือกใบสั่งขาย —',
    noContractOnSO: 'SO นี้ยังไม่ผูกเลขสัญญา',
    allDbRecords: 'รายการบันทึกทั้งหมดจากฐานข้อมูล',
    dbCustomerList: 'รายชื่อลูกค้าจากฐานข้อมูล',
    pendingCustomers: 'ลูกค้าที่ติดตามค้างอยู่',
    countRecords: 'รายการ',
    choose: 'เลือก',
    customerCode: 'รหัสลูกค้า',
    customer: 'ลูกค้า',
    phone: 'โทรศัพท์',
    lastFollowUp: 'ติดตามล่าสุด',
    followUpStage: 'สถานะติดตาม',
    pendingEmpty: 'ยังไม่พบลูกค้าที่ติดตามค้างอยู่',
    loadFailed: 'ไม่สามารถโหลดข้อมูลจากฐานข้อมูลได้',
    tableCustomer: 'ลูกค้า',
    tableContractNo: 'เลขที่สัญญา',
    tableSONo: 'เลขที่บิล',
    tableInteractionType: 'ประเภทการติดตาม',
    tableStage: 'สถานะ',
    tableDescription: 'รายละเอียด',
    tableNotes: 'หมายเหตุ',
    tableUpdated: 'อัปเดต',
  },
  en: {
    searchPlaceholder: 'Search code / name / phone...',
    newTracking: 'Add Tracking Record',
    interactionType: 'Interaction Type',
    serviceStage: 'Status',
    description: 'Description',
    notes: 'Notes',
    addRecord: 'Save',
    cancel: 'Cancel',
    trackingHistory: 'Tracking History',
    relatedOrders: 'Related Sales Orders',
    noTracking: 'No tracking records yet',
    noOrders: 'No sales orders',
    selectCustomer: 'Search and select a customer to begin',
    soNo: 'SO No.',
    amount: 'Total',
    no: 'No.',
    updatedDate: 'Updated Date',
    soStatus: 'SO Status',
    contractNo: 'Contract No.',
    loading: 'Loading...',
    success: '✓ Record saved',
    error: 'An error occurred',
    searching: 'Searching...',
    noResults: 'No customers found',
    changeCustomer: 'Change',
    selectSalesOrder: 'Select Sales Order (optional)',
    selectSalesOrderPlaceholder: '— Select Sales Order —',
    noContractOnSO: 'This SO has no contract number',
    allDbRecords: 'All records from database',
    dbCustomerList: 'Customer list from database',
    pendingCustomers: 'Customers with pending follow-up',
    countRecords: 'items',
    choose: 'Select',
    customerCode: 'Customer Code',
    customer: 'Customer',
    phone: 'Phone',
    lastFollowUp: 'Last follow-up',
    followUpStage: 'Follow-up stage',
    tableCustomer: 'Customer',
    tableContractNo: 'Contract No.',
    tableSONo: 'SO No.',
    tableInteractionType: 'Interaction Type',
    tableStage: 'Stage',
    tableDescription: 'Description',
    tableNotes: 'Notes',
    tableUpdated: 'Updated',
    pendingEmpty: 'No pending follow-up customers found',
    loadFailed: 'Failed to load database records',
  },
  ko: {
    searchPlaceholder: '코드 / 고객명 / 전화번호 검색...',
    newTracking: '추적 기록 추가',
    interactionType: '상호작용 유형',
    serviceStage: '상태',
    description: '설명',
    notes: '비고',
    addRecord: '저장',
    cancel: '취소',
    trackingHistory: '추적 이력',
    relatedOrders: '관련 판매 주문',
    noTracking: '추적 기록 없음',
    noOrders: '판매 주문 없음',
    selectCustomer: '고객을 검색하여 시작하세요',
    soNo: 'SO번호',
    amount: '합계',
    no: '순번',
    updatedDate: '업데이트 날짜',
    soStatus: 'SO 상태',
    contractNo: '계약 번호',
    loading: '로딩 중...',
    success: '✓ 저장되었습니다',
    error: '오류가 발생했습니다',
    searching: '검색 중...',
    noResults: '고객을 찾을 수 없음',
    changeCustomer: '변경',
    selectSalesOrder: '판매 주문 선택 (선택)',
    selectSalesOrderPlaceholder: '— 판매 주문 선택 —',
    noContractOnSO: '이 SO에는 계약 번호가 없습니다',
    allDbRecords: '데이터베이스 전체 기록',
    dbCustomerList: '데이터베이스 고객 목록',
    pendingCustomers: '후속 관리가 남은 고객',
    countRecords: '항목',
    choose: '선택',
    customerCode: '고객 코드',
    customer: '고객',
    phone: '전화번호',
    lastFollowUp: '최근 추적',
    followUpStage: '추적 상태',
    tableCustomer: '고객',
    tableContractNo: '계약 번호',
    tableSONo: 'SO번호',
    tableInteractionType: '상호작용 유형',
    tableStage: '상태',
    tableDescription: '설명',
    tableNotes: '비고',
    tableUpdated: '업데이트',
    pendingEmpty: '후속 관리가 필요한 고객이 없습니다',
    loadFailed: '데이터베이스 정보를 불러오지 못했습니다',
  },
}

const INTERACTION_TYPES = [
  { value: 'call',      icon: '📞', th: 'โทรศัพท์',    en: 'Phone Call',  ko: '전화' },
  { value: 'email',     icon: '✉️',  th: 'อีเมล',       en: 'Email',       ko: '이메일' },
  { value: 'visit',     icon: '🏢', th: 'เยี่ยมลูกค้า', en: 'Visit',       ko: '방문' },
  { value: 'inquiry',   icon: '❓', th: 'สอบถาม',       en: 'Inquiry',     ko: '문의' },
  { value: 'complaint', icon: '⚠️', th: 'ร้องเรียน',    en: 'Complaint',   ko: '불만' },
  { value: 'feedback',  icon: '💬', th: 'ฟีดแบ็ค',      en: 'Feedback',    ko: '피드백' },
  { value: 'meeting',   icon: '🤝', th: 'ประชุม',       en: 'Meeting',     ko: '회의' },
  { value: 'quotation', icon: '📋', th: 'เสนอราคา',     en: 'Quotation',   ko: '견적' },
  { value: 'follow_up', icon: '🔄', th: 'ติดตามผล',     en: 'Follow Up',   ko: '팔로우업' },
  { value: 'demo',      icon: '📊', th: 'สาธิตสินค้า',  en: 'Demo',        ko: '데모' },
]

const STAGES = [
  { value: 'pre-sale',  th: 'ก่อนขาย',    en: 'Pre-Sale',    ko: '판매 전', badge: 'bg-blue-100 text-blue-700',   border: 'border-l-blue-400',   bg: 'bg-blue-50' },
  { value: 'during',    th: 'ระหว่างขาย', en: 'During Sale', ko: '판매 중', badge: 'bg-purple-100 text-purple-700', border: 'border-l-purple-400', bg: 'bg-purple-50' },
  { value: 'post-sale', th: 'หลังขาย',    en: 'Post-Sale',   ko: '판매 후', badge: 'bg-green-100 text-green-700',  border: 'border-l-green-400',  bg: 'bg-green-50' },
]

const headers = token => ({ Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' })
const fmt = n => parseFloat(n || 0).toLocaleString('th-TH', { minimumFractionDigits: 2 })
const DATE_LOCALE = { th: 'th-TH', en: 'en-US', ko: 'ko-KR' }

const SO_STATUS_META = {
  draft: 'bg-gray-100 text-gray-700',
  confirmed: 'bg-blue-100 text-blue-700',
  delivered: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
}

const SO_STATUS_LABEL = {
  th: { draft: 'ร่าง', confirmed: 'ยืนยันแล้ว', delivered: 'ส่งแล้ว', cancelled: 'ยกเลิก' },
  en: { draft: 'Draft', confirmed: 'Confirmed', delivered: 'Delivered', cancelled: 'Cancelled' },
  ko: { draft: '임시', confirmed: '확정', delivered: '배송완료', cancelled: '취소' },
}

export default function SalesOrdersCRM({ token, lang }) {
  const t = i18n[lang] || i18n.th

  const [query, setQuery]               = useState('')
  const [searching, setSearching]       = useState(false)
  const [results, setResults]           = useState([])
  const [showDrop, setShowDrop]         = useState(false)
  const [customer, setCustomer]         = useState(null)
  const [trackings, setTrackings]       = useState([])
  const [salesOrders, setSalesOrders]   = useState([])
  const [loadingData, setLoadingData]   = useState(false)
  const [showForm, setShowForm]         = useState(false)
  const [selectedSOId, setSelectedSOId] = useState('')
  const [formType, setFormType]         = useState('')
  const [formStage, setFormStage]       = useState('pre-sale')
  const [formDesc, setFormDesc]         = useState('')
  const [formNotes, setFormNotes]       = useState('')
  const [submitting, setSubmitting]     = useState(false)
  const [message, setMessage]           = useState('')
  const [summary, setSummary]           = useState([])
  const [summaryLoading, setSummaryLoading] = useState(false)
  const [summaryError, setSummaryError] = useState('')
  const [editRow, setEditRow]           = useState(null)   // { id, field, value }
  const [savingRow, setSavingRow]       = useState(null)
  const dropRef = useRef(null)

  // Contract autocomplete
  const [formContract, setFormContract]       = useState('')
  const [contractResults, setContractResults] = useState([])
  const [showContractDrop, setShowContractDrop] = useState(false)
  const [contractSearching, setContractSearching] = useState(false)
  const [contractError, setContractError]     = useState(false)
  const [skipContractSearchOnce, setSkipContractSearchOnce] = useState(false)
  const contractDropRef = useRef(null)

  async function loadSummary() {
    setSummaryLoading(true)
    setSummaryError('')
    try {
      const r = await apiFetch('/api/crm-tracking/records', { headers: headers(token) })
      if (!r.ok) throw new Error('load failed')
      const d = await r.json()
      setSummary(Array.isArray(d) ? d : [])
    } catch {
      setSummary([])
      setSummaryError(t.loadFailed)
    } finally {
      setSummaryLoading(false)
    }
  }

  async function loadCustomerData(customerId) {
    if (!customerId) return
    const r = await apiFetch(`/api/crm-tracking/customer/${customerId}`, { headers: headers(token) })
    const d = await r.json()
    setCustomer(d.customer)
    setTrackings(d.trackings || [])
    setSalesOrders(d.salesOrders || [])
  }

  async function saveInline(trackingId, field, value) {
    setSavingRow(trackingId)
    try {
      const row = summary.find(s => s.tracking_id === trackingId)
      if (!row) return
      const r = await apiFetch(`/api/crm-tracking/${trackingId}`, {
        method: 'PUT',
        headers: headers(token),
        body: JSON.stringify({
          interaction_type: field === 'interaction_type' ? value : row.interaction_type,
          service_stage:    field === 'service_stage'    ? value : row.service_stage,
          description:      field === 'description'      ? value : row.description,
          notes:            field === 'notes'             ? value : row.notes,
          contract_no:      field === 'contract_no'      ? value : row.contract_no,
        }),
      })
      const d = await r.json().catch(() => ({}))
      if (!r.ok || !d.success) throw new Error(d.error || t.error)
      await loadSummary()
      await loadCustomerData(customer?.id)
      setMessage(t.success)
      setTimeout(() => setMessage(''), 2000)
    } catch {
      setMessage(t.error)
    }
    setSavingRow(null)
    setEditRow(null)
  }

  useEffect(() => {
    const h = e => { if (dropRef.current && !dropRef.current.contains(e.target)) setShowDrop(false) }
    document.addEventListener('mousedown', h)
    return () => document.removeEventListener('mousedown', h)
  }, [])

  useEffect(() => {
    loadSummary()
  }, [token])

  useEffect(() => {
    const h = e => { if (contractDropRef.current && !contractDropRef.current.contains(e.target)) setShowContractDrop(false) }
    document.addEventListener('mousedown', h)
    return () => document.removeEventListener('mousedown', h)
  }, [])

  useEffect(() => {
    if (skipContractSearchOnce) {
      setSkipContractSearchOnce(false)
      return
    }
    if (!formContract.trim()) { setContractResults([]); setShowContractDrop(false); return }
    setContractError(false)
    const t2 = setTimeout(() => searchContracts(formContract), 300)
    return () => clearTimeout(t2)
  }, [formContract, skipContractSearchOnce])

  async function searchContracts(q) {
    setContractSearching(true)
    try {
      const r = await apiFetch(`/api/crm-tracking/contracts/search?q=${encodeURIComponent(q)}`, { headers: headers(token) })
      const d = await r.json()
      setContractResults(Array.isArray(d) ? d : [])
      setShowContractDrop(true)
    } catch { setContractResults([]) }
    finally { setContractSearching(false) }
  }

  useEffect(() => {
    if (!query.trim()) { setResults([]); setShowDrop(false); return }
    const t2 = setTimeout(() => doSearch(query), 300)
    return () => clearTimeout(t2)
  }, [query])

  async function doSearch(q) {
    setSearching(true)
    try {
      const r = await apiFetch(`/api/crm-tracking/customers/search?q=${encodeURIComponent(q)}`, {
        headers: headers(token),
      })
      const d = await r.json()
      setResults(Array.isArray(d) ? d : [])
      setShowDrop(true)
    } catch { setResults([]) }
    finally { setSearching(false) }
  }

  async function selectCustomer(c) {
    setQuery(''); setResults([]); setShowDrop(false); setShowForm(false)
    setSelectedSOId(''); setFormContract(''); setContractError(false)
    setCustomer(c); setTrackings([]); setSalesOrders([])
    setLoadingData(true)
    try {
      await loadCustomerData(c.id)
    } catch {}
    finally { setLoadingData(false) }
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!formType) { setMessage('กรุณาเลือกประเภทการติดตาม'); return }
    if (!formContract.trim()) { setContractError(true); setMessage('กรุณาแนบเลขที่สัญญาซื้อขาย (CNTyyyyymmdd-00001) ก่อนบันทึก'); return }
    setSubmitting(true); setMessage('')
    try {
      const r = await apiFetch('/api/crm-tracking', {
        method: 'POST',
        headers: headers(token),
        body: JSON.stringify({
          customer_id: customer.id,
          contract_no: formContract.trim() || null,
          interaction_type: formType,
          service_stage: formStage,
          description: formDesc,
          notes: formNotes,
        }),
      })
      const d = await r.json()
      if (d.success) {
        setMessage(t.success)
        setFormType(''); setFormStage('pre-sale'); setFormDesc(''); setFormNotes(''); setFormContract(''); setContractError(false); setSelectedSOId(''); setShowForm(false)
        const r2 = await apiFetch(`/api/crm-tracking/customer/${customer.id}`, { headers: headers(token) })
        const d2 = await r2.json()
        setTrackings(d2.trackings || []); setSalesOrders(d2.salesOrders || [])
        loadSummary()
        setTimeout(() => setMessage(''), 3000)
      } else {
        setMessage(d.error || t.error)
      }
    } catch { setMessage(t.error) }
    finally { setSubmitting(false) }
  }

  async function handleDelete(id) {
    if (!confirm('ลบบันทึกนี้?')) return
    try {
      const r = await apiFetch(`/api/crm-tracking/${id}`, { method: 'DELETE', headers: headers(token) })
      const d = await r.json().catch(() => ({}))
      if (!r.ok || !d.success) throw new Error(d.error || t.error)
      await loadSummary()
      await loadCustomerData(customer?.id)
      setMessage(t.success)
      setTimeout(() => setMessage(''), 2000)
    } catch {
      setMessage(t.error)
    }
  }

  const stageMeta  = v => STAGES.find(s => s.value === v) || STAGES[0]
  const typeLabel  = v => { const f = INTERACTION_TYPES.find(x => x.value === v); return f ? (f[lang] || f.en) : v }
  const stageLabel = v => { const f = stageMeta(v); return f[lang] || f.en }
  const dateLocale = DATE_LOCALE[lang] || 'th-TH'
  const sortedSalesOrders = [...salesOrders].sort((a, b) => {
    const ad = new Date(a?.created_at || 0).getTime()
    const bd = new Date(b?.created_at || 0).getTime()
    return bd - ad
  })
  const dbCustomers = Object.values(
    summary.reduce((acc, row) => {
      const customerId = row?.id
      if (!customerId || acc[customerId]) return acc
      acc[customerId] = {
        id: customerId,
        customer_code: row.customer_code,
        customer_name: row.customer_name,
        phone: row.phone,
      }
      return acc
    }, {})
  ).sort((a, b) => String(a.customer_name || '').localeCompare(String(b.customer_name || '')))

  const latestSummaryByCustomer = Object.values(
    summary.reduce((acc, row) => {
      if (!row?.id) return acc
      if (!acc[row.id]) acc[row.id] = row
      return acc
    }, {})
  )

  const pendingCustomers = latestSummaryByCustomer.filter(row => row.service_stage !== 'post-sale')

  function handleSOChange(soId) {
    setSelectedSOId(soId)
    const picked = salesOrders.find(so => String(so.id) === String(soId))
    if (!picked) return
    if (picked.contract_no) {
      setSkipContractSearchOnce(true)
      setFormContract(picked.contract_no)
      setContractError(false)
      setShowContractDrop(false)
      setContractResults([])
    } else {
      setFormContract('')
    }
  }

  return (
    <div className="space-y-5">

      {/* Search */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
        <div className="relative" ref={dropRef}>
          <div className="flex items-center gap-2 border-2 border-gray-200 focus-within:border-blue-400 rounded-xl px-4 py-3 bg-white transition-colors">
            <Search className="w-4 h-4 text-gray-400 shrink-0" />
            <input
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder={t.searchPlaceholder}
              className="flex-1 text-sm outline-none bg-transparent placeholder-gray-400"
            />
            {searching && <span className="text-xs text-gray-400">{t.searching}</span>}
            {query && (
              <button onClick={() => { setQuery(''); setResults([]); setShowDrop(false) }}>
                <X className="w-4 h-4 text-gray-400 hover:text-gray-600" />
              </button>
            )}
          </div>

          {showDrop && (
            <div className="absolute top-full mt-1 left-0 right-0 bg-white border border-gray-200 rounded-xl shadow-xl z-50 max-h-64 overflow-y-auto">
              {results.length === 0 ? (
                <p className="text-sm text-center text-gray-400 py-6">{t.noResults}</p>
              ) : results.map(c => (
                <button key={c.id} onClick={() => selectCustomer(c)}
                  className="w-full text-left px-4 py-3 hover:bg-blue-50 border-b border-gray-50 last:border-0 flex items-center gap-3 transition-colors">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center shrink-0">
                    <span className="text-white text-xs font-bold">{(c.customer_name || '?').charAt(0)}</span>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">{c.customer_name}</p>
                    <p className="text-xs text-gray-400">{c.customer_code}{c.phone ? ` • ${c.phone}` : ''}</p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Summary Table — ลูกค้าที่กำลังติดตามทั้งหมด */}
      {summary.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
            <h3 className="font-bold text-gray-900 text-sm">{t.allDbRecords}</h3>
            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-medium">{summary.length} {t.countRecords}</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead className="bg-gray-50 text-gray-700 font-bold uppercase">
                <tr>
                  <th className="px-4 py-2.5 text-left">{t.tableCustomer}</th>
                  <th className="px-4 py-2.5 text-left whitespace-nowrap">{t.tableContractNo}</th>
                  <th className="px-4 py-2.5 text-left whitespace-nowrap">{t.tableSONo}</th>
                  <th className="px-4 py-2.5 text-left">{t.tableInteractionType}</th>
                  <th className="px-4 py-2.5 text-left">{t.tableStage}</th>
                  <th className="px-4 py-2.5 text-left min-w-[180px]">{t.tableDescription}</th>
                  <th className="px-4 py-2.5 text-left min-w-[140px]">{t.tableNotes}</th>
                  <th className="px-4 py-2.5 text-left">{t.tableUpdated}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {summary.map(row => {
                  const stage = STAGES.find(s => s.value === row.service_stage) || STAGES[0]
                  const itype = INTERACTION_TYPES.find(i => i.value === row.interaction_type)
                  const isEditing = f => editRow?.id === row.tracking_id && editRow?.field === f
                  return (
                    <tr key={row.tracking_id} className="hover:bg-gray-50 align-top">
                      <td className="px-4 py-2.5">
                        <p className="font-semibold text-gray-900">{row.customer_name}</p>
                        <p className="text-gray-400">{row.customer_code}</p>
                      </td>

                      {/* เลขที่สัญญา — inline input */}
                      <td className="px-4 py-2.5 whitespace-nowrap">
                        <input
                          type="text"
                          defaultValue={row.contract_no || ''}
                          onBlur={e => saveInline(row.tracking_id, 'contract_no', e.target.value.trim() || null)}
                          disabled={savingRow === row.tracking_id}
                          placeholder="CNTyyyymmdd-00001"
                          className="w-full min-w-[100px] border border-gray-200 rounded-lg px-2 py-1 text-xs font-mono text-purple-700 font-semibold focus:outline-none focus:ring-1 focus:ring-purple-300 disabled:opacity-50 placeholder-gray-300"
                        />
                      </td>

                      {/* เลขที่บิล */}
                      <td className="px-4 py-2.5 whitespace-nowrap">
                        {row.latest_so_no ? (
                          <span className="font-mono text-blue-700 font-semibold text-xs">{row.latest_so_no}</span>
                        ) : (
                          <span className="text-gray-300 text-xs">—</span>
                        )}
                        {row.so_count > 1 && (
                          <p className="text-gray-400 text-xs mt-0.5">{row.so_count} ใบ</p>
                        )}
                      </td>

                      {/* ประเภทการติดตาม — inline select */}
                      <td className="px-4 py-2.5">
                        <select
                          value={isEditing('interaction_type') ? editRow.value : (row.interaction_type || '')}
                          onChange={e => setEditRow({ id: row.tracking_id, field: 'interaction_type', value: e.target.value })}
                          onBlur={e => saveInline(row.tracking_id, 'interaction_type', e.target.value)}
                          disabled={savingRow === row.tracking_id}
                          className="w-full border border-gray-200 rounded-lg px-2 py-1 text-xs text-gray-900 focus:outline-none focus:ring-1 focus:ring-blue-300 disabled:opacity-50"
                        >
                          {INTERACTION_TYPES.map(i => (
                            <option key={i.value} value={i.value}>{i.icon} {i[lang] || i.en}</option>
                          ))}
                        </select>
                      </td>

                      {/* ระยะบริการ — inline select */}
                      <td className="px-4 py-2.5">
                        <select
                          value={isEditing('service_stage') ? editRow.value : (row.service_stage || 'pre-sale')}
                          onChange={e => setEditRow({ id: row.tracking_id, field: 'service_stage', value: e.target.value })}
                          onBlur={e => saveInline(row.tracking_id, 'service_stage', e.target.value)}
                          disabled={savingRow === row.tracking_id}
                          className={`w-full border rounded-lg px-2 py-1 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-blue-300 disabled:opacity-50 ${stage.badge}`}
                        >
                          {STAGES.map(s => (
                            <option key={s.value} value={s.value}>{s[lang] || s.en}</option>
                          ))}
                        </select>
                      </td>

                      {/* รายละเอียด — inline textarea */}
                      <td className="px-4 py-2.5">
                        <textarea
                          rows={2}
                          defaultValue={row.description || ''}
                          onFocus={e => setEditRow({ id: row.tracking_id, field: 'description', value: e.target.value })}
                          onChange={e => setEditRow({ id: row.tracking_id, field: 'description', value: e.target.value })}
                          onBlur={e => saveInline(row.tracking_id, 'description', e.target.value)}
                          disabled={savingRow === row.tracking_id}
                          placeholder="รายละเอียด..."
                          className="w-full border border-gray-200 rounded-lg px-2 py-1 text-xs text-gray-900 resize-none focus:outline-none focus:ring-1 focus:ring-blue-300 disabled:opacity-50"
                        />
                      </td>

                      {/* หมายเหตุ — inline textarea */}
                      <td className="px-4 py-2.5">
                        <textarea
                          rows={2}
                          defaultValue={row.notes || ''}
                          onFocus={e => setEditRow({ id: row.tracking_id, field: 'notes', value: e.target.value })}
                          onChange={e => setEditRow({ id: row.tracking_id, field: 'notes', value: e.target.value })}
                          onBlur={e => saveInline(row.tracking_id, 'notes', e.target.value)}
                          disabled={savingRow === row.tracking_id}
                          placeholder="หมายเหตุ..."
                          className="w-full border border-gray-200 rounded-lg px-2 py-1 text-xs text-gray-900 resize-none focus:outline-none focus:ring-1 focus:ring-blue-300 disabled:opacity-50"
                        />
                      </td>

                      <td className="px-4 py-2.5 text-gray-400 whitespace-nowrap">
                        {savingRow === row.tracking_id
                          ? <span className="text-blue-500">💾</span>
                          : new Date(row.updated_at).toLocaleDateString('th-TH')}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Pending follow-up customers */}
      <div className="bg-white rounded-2xl border border-amber-200 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-amber-100 flex items-center justify-between bg-amber-50/60">
          <h3 className="font-bold text-amber-900 text-sm">{t.pendingCustomers}</h3>
                <span className="text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded-full font-medium">{pendingCustomers.length} {t.countRecords}</span>
        </div>

        {summaryLoading ? (
          <p className="text-sm text-center text-gray-500 py-8">{t.loading}</p>
        ) : summaryError ? (
          <p className="text-sm text-center text-red-500 py-8">{summaryError}</p>
        ) : pendingCustomers.length === 0 ? (
          <p className="text-sm text-center text-gray-400 py-8">{t.pendingEmpty}</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead className="bg-amber-50 text-amber-900 font-bold uppercase">
                <tr>
                  <th className="px-4 py-2.5 text-left">{t.customerCode}</th>
                  <th className="px-4 py-2.5 text-left">{t.customer}</th>
                  <th className="px-4 py-2.5 text-left">{t.phone}</th>
                  <th className="px-4 py-2.5 text-left whitespace-nowrap">{t.lastFollowUp}</th>
                  <th className="px-4 py-2.5 text-left whitespace-nowrap">{t.followUpStage}</th>
                  <th className="px-4 py-2.5 text-center">{t.choose}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-amber-100">
                {pendingCustomers.map(c => (
                  <tr key={`pending-${c.id}`} className="hover:bg-amber-50/50">
                    <td className="px-4 py-2.5 font-mono text-gray-700">{c.customer_code || '—'}</td>
                    <td className="px-4 py-2.5 font-semibold text-gray-900">{c.customer_name || '—'}</td>
                    <td className="px-4 py-2.5 text-gray-600">{c.phone || '—'}</td>
                    <td className="px-4 py-2.5 text-gray-600 whitespace-nowrap">
                      {c.updated_at ? new Date(c.updated_at).toLocaleDateString(dateLocale) : '—'}
                    </td>
                    <td className="px-4 py-2.5">
                      <span className={`px-2 py-1 rounded-full text-[11px] font-semibold ${stageMeta(c.service_stage).badge}`}>
                        {stageLabel(c.service_stage)}
                      </span>
                    </td>
                    <td className="px-4 py-2.5 text-center">
                      <button
                        onClick={() => selectCustomer(c)}
                        className="inline-flex items-center gap-1 text-xs px-2.5 py-1 bg-amber-100 text-amber-800 rounded-lg hover:bg-amber-200 font-medium"
                      >
                        {t.choose}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* No customer */}
      {!customer && (
        <div className="space-y-5">

          {dbCustomers.length > 0 ? (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
                <h3 className="font-bold text-gray-900 text-sm">{t.dbCustomerList}</h3>
                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-medium">{dbCustomers.length} {t.countRecords}</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead className="bg-gray-50 text-gray-700 font-bold uppercase">
                    <tr>
                      <th className="px-4 py-2.5 text-left">{t.customerCode}</th>
                      <th className="px-4 py-2.5 text-left">{t.customer}</th>
                      <th className="px-4 py-2.5 text-left">{t.phone}</th>
                      <th className="px-4 py-2.5 text-center">{t.choose}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {dbCustomers.map(c => (
                      <tr key={c.id} className="hover:bg-gray-50">
                        <td className="px-4 py-2.5 font-mono text-gray-700">{c.customer_code || '—'}</td>
                        <td className="px-4 py-2.5 font-semibold text-gray-900">{c.customer_name || '—'}</td>
                        <td className="px-4 py-2.5 text-gray-600">{c.phone || '—'}</td>
                        <td className="px-4 py-2.5 text-center">
                          <button
                            onClick={() => selectCustomer(c)}
                            className="inline-flex items-center gap-1 text-xs px-2.5 py-1 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 font-medium"
                          >
                            {t.choose}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          ) : (
            <div className="bg-white rounded-2xl border-2 border-dashed border-gray-200 p-12 text-center">
              <Search className="w-10 h-10 text-gray-200 mx-auto mb-3" />
              <p className="text-gray-400 font-medium text-sm">{t.selectCustomer}</p>
            </div>
          )}
        </div>
      )}

      {/* Customer view */}
      {customer && (
        <div className="grid lg:grid-cols-3 gap-5">

          {/* LEFT */}
          <div className="space-y-4">

            {/* Customer card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center shrink-0">
                    <span className="text-white font-bold">{(customer.customer_name || '?').charAt(0)}</span>
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 text-sm">{customer.customer_name}</p>
                    <p className="text-xs text-gray-400 font-mono">{customer.customer_code}</p>
                  </div>
                </div>
                <button onClick={() => { setCustomer(null); setTrackings([]); setSalesOrders([]) }}
                  className="text-xs text-gray-400 hover:text-gray-700 bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded-lg transition-colors">
                  {t.changeCustomer}
                </button>
              </div>
              <div className="space-y-2 text-sm">
                {customer.phone && <div className="flex items-center gap-2 text-gray-600"><Phone className="w-3.5 h-3.5 text-gray-400" />{customer.phone}</div>}
                {customer.email && <div className="flex items-center gap-2 text-gray-600"><Mail className="w-3.5 h-3.5 text-gray-400" /><span className="text-xs break-all">{customer.email}</span></div>}
                {customer.address && <div className="flex items-start gap-2 text-gray-600"><MapPin className="w-3.5 h-3.5 text-gray-400 mt-0.5 shrink-0" /><span className="text-xs">{customer.address}</span></div>}
              </div>
            </div>

            {/* Add button / Form */}
            {!showForm ? (
              <button onClick={() => setShowForm(true)}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl py-3 font-semibold text-sm shadow-md transition-all">
                <Plus className="w-4 h-4" />
                {t.newTracking}
              </button>
            ) : (
              <div className="bg-white rounded-2xl shadow-sm border-2 border-blue-200 p-5">
                <div className="flex items-center justify-between mb-4">
                  <p className="font-bold text-gray-900 text-sm">{t.newTracking}</p>
                  <button onClick={() => setShowForm(false)}><X className="w-4 h-4 text-gray-400 hover:text-gray-600" /></button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Sales order selector */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
                      {t.selectSalesOrder}
                    </label>
                    <select
                      value={selectedSOId}
                      onChange={e => handleSOChange(e.target.value)}
                      className="w-full px-3 py-2 border-2 border-gray-200 rounded-xl text-xs text-gray-900 bg-white focus:outline-none focus:border-blue-400"
                    >
                      <option value="">{t.selectSalesOrderPlaceholder}</option>
                      {sortedSalesOrders.map(so => (
                        <option key={so.id} value={so.id}>
                          {so.so_no} • {new Date(so.created_at).toLocaleDateString(dateLocale)} {so.contract_no ? `• ${so.contract_no}` : `• ${t.noContractOnSO}`}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Contract number search */}
                  <div ref={contractDropRef} className="relative">
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
                      เลขที่สัญญาซื้อขาย <span className="text-red-400">*</span>
                    </label>
                    <div className={`flex items-center gap-2 border-2 rounded-xl px-3 py-2 transition-colors ${contractError ? 'border-red-400 bg-red-50' : 'border-gray-200 focus-within:border-purple-400'}`}>
                      <Search className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                      <input
                        value={formContract}
                        onChange={e => { setFormContract(e.target.value); setContractError(false) }}
                        placeholder="CNT20260503-00001"
                        className="flex-1 text-xs outline-none bg-transparent placeholder-gray-400 font-mono"
                      />
                      {contractSearching && <span className="text-xs text-gray-400">...</span>}
                      {formContract && (
                        <button type="button" onClick={() => { setFormContract(''); setContractResults([]); setShowContractDrop(false) }}>
                          <X className="w-3.5 h-3.5 text-gray-400 hover:text-gray-600" />
                        </button>
                      )}
                    </div>
                    {contractError && (
                      <p className="text-xs text-red-500 mt-1">⚠️ กรุณาแนบเลขที่สัญญาซื้อขาย (CNTyyyyymmdd-00001) ก่อนบันทึก</p>
                    )}
                    {showContractDrop && (
                      <div className="absolute top-full mt-1 left-0 right-0 bg-white border border-gray-200 rounded-xl shadow-xl z-50 max-h-48 overflow-y-auto">
                        {contractResults.length === 0 ? (
                          <p className="text-xs text-center text-gray-400 py-4">ค้นหาจากฐานข้อมูลไม่ได้</p>
                        ) : contractResults.map(c => (
                          <button key={c.id} type="button"
                            onClick={() => { setFormContract(c.contract_no); setContractResults([]); setShowContractDrop(false); setContractError(false) }}
                            className="w-full text-left px-3 py-2.5 hover:bg-purple-50 border-b border-gray-50 last:border-0 transition-colors">
                            <p className="font-mono font-semibold text-purple-700 text-xs">{c.contract_no}</p>
                            <p className="text-gray-400 text-xs truncate">{c.customer_name}</p>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Type picker */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wide">
                      {t.interactionType} <span className="text-red-400">*</span>
                    </label>
                    <div className="grid grid-cols-2 gap-1.5">
                      {INTERACTION_TYPES.map(type => (
                        <button key={type.value} type="button" onClick={() => setFormType(type.value)}
                          className={`flex items-center gap-1.5 px-2 py-2 rounded-lg text-xs font-medium border transition-all ${
                            formType === type.value
                              ? 'bg-blue-500 text-white border-blue-500 shadow-sm'
                              : 'bg-gray-50 text-gray-700 border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                          }`}>
                          <span>{type.icon}</span>
                          <span className="truncate">{type[lang] || type.en}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Stage */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wide">
                      {t.serviceStage} <span className="text-red-400">*</span>
                    </label>
                    <div className="flex gap-1.5">
                      {STAGES.map(s => (
                        <button key={s.value} type="button" onClick={() => setFormStage(s.value)}
                          className={`flex-1 py-2 px-1 rounded-lg text-xs font-semibold border transition-all ${
                            formStage === s.value ? `${s.badge} border-current` : 'bg-gray-50 text-gray-500 border-gray-200 hover:bg-gray-100'
                          }`}>
                          {s[lang] || s.en}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">{t.description}</label>
                    <textarea value={formDesc} onChange={e => setFormDesc(e.target.value)} rows={3}
                      placeholder="รายละเอียดการติดต่อ..."
                      className="w-full text-sm border border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:border-blue-400 resize-none" />
                  </div>

                  {/* Notes */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">{t.notes}</label>
                    <textarea value={formNotes} onChange={e => setFormNotes(e.target.value)} rows={2}
                      placeholder="หมายเหตุ..."
                      className="w-full text-sm border border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:border-blue-400 resize-none" />
                  </div>

                  {message && (
                    <p className={`text-xs px-3 py-2 rounded-lg ${message.startsWith('✓') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'}`}>
                      {message}
                    </p>
                  )}

                  <div className="flex gap-2">
                    <button type="button" onClick={() => setShowForm(false)}
                      className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50">
                      {t.cancel}
                    </button>
                    <button type="submit" disabled={submitting || !formType}
                      className="flex-1 py-2.5 bg-blue-500 hover:bg-blue-600 disabled:opacity-50 text-white rounded-xl text-sm font-semibold transition-colors">
                      {submitting ? '...' : t.addRecord}
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>

          {/* RIGHT */}
          <div className="lg:col-span-2 space-y-5">

            {message && message.startsWith('✓') && !showForm && (
              <div className="bg-green-50 border border-green-200 text-green-700 text-sm px-4 py-3 rounded-xl">{message}</div>
            )}

            {/* Tracking timeline */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-gray-900 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-blue-500" />
                  {t.trackingHistory}
                </h3>
                <span className="text-xs bg-blue-100 text-blue-600 font-semibold px-2.5 py-0.5 rounded-full">{trackings.length}</span>
              </div>

              {loadingData ? (
                <p className="text-sm text-center text-gray-400 py-10">{t.loading}</p>
              ) : trackings.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-sm text-gray-400">{t.noTracking}</p>
                  <p className="text-xs text-gray-300 mt-1">กดปุ่ม "เพิ่มบันทึก" ทางซ้ายเพื่อเริ่มต้น</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {trackings.map(rec => {
                    const sm  = stageMeta(rec.service_stage)
                    const typeObj = INTERACTION_TYPES.find(x => x.value === rec.interaction_type)
                    return (
                      <div key={rec.id} className={`border-l-4 ${sm.border} ${sm.bg} rounded-r-xl p-4 flex gap-3`}>
                        <span className="text-xl mt-0.5">{typeObj?.icon || '📝'}</span>
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2 mb-1">
                            <span className="font-semibold text-gray-900 text-sm">{typeLabel(rec.interaction_type)}</span>
                            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${sm.badge}`}>{stageLabel(rec.service_stage)}</span>
                            <span className="text-xs text-gray-400 ml-auto">
                              {new Date(rec.created_at).toLocaleDateString(
                                lang === 'ko' ? 'ko-KR' : lang === 'en' ? 'en-US' : 'th-TH',
                                { year: 'numeric', month: 'short', day: 'numeric' }
                              )}
                            </span>
                          </div>
                          {rec.description && <p className="text-sm text-gray-700">{rec.description}</p>}
                          {rec.notes && <p className="text-xs text-gray-400 italic mt-0.5">{rec.notes}</p>}
                        </div>
                        <button onClick={() => handleDelete(rec.id)} className="text-gray-300 hover:text-red-400 transition-colors shrink-0">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>

            {/* Sales Orders */}
            {sortedSalesOrders.length > 0 && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                <h3 className="font-bold text-gray-900 mb-4">{t.relatedOrders}</h3>
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-100">
                      <th className="text-left py-2 px-2 text-xs font-semibold text-gray-500 uppercase">{t.no}</th>
                      <th className="text-left py-2 px-2 text-xs font-semibold text-gray-500 uppercase">{t.soNo}</th>
                      <th className="text-left py-2 px-2 text-xs font-semibold text-gray-500 uppercase">{t.contractNo}</th>
                      <th className="text-left py-2 px-2 text-xs font-semibold text-gray-500 uppercase">{t.updatedDate}</th>
                      <th className="text-left py-2 px-2 text-xs font-semibold text-gray-500 uppercase">{t.soStatus}</th>
                      <th className="text-right py-2 px-2 text-xs font-semibold text-gray-500 uppercase">{t.amount}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedSalesOrders.map((o, idx) => (
                      <tr key={o.id} className="border-b border-gray-50 hover:bg-gray-50">
                        <td className="py-2.5 px-2 text-gray-500 text-xs">{idx + 1}</td>
                        <td className="py-2.5 px-2 font-mono text-blue-700 text-xs font-semibold">{o.so_no}</td>
                        <td className="py-2.5 px-2 text-xs font-mono text-purple-700">{o.contract_no || '—'}</td>
                        <td className="py-2.5 px-2 text-gray-500 text-xs">
                          {new Date(o.created_at).toLocaleDateString(dateLocale)}
                        </td>
                        <td className="py-2.5 px-2 text-xs">
                          <span className={`px-2 py-1 rounded-full font-medium ${SO_STATUS_META[o.status] || 'bg-gray-100 text-gray-600'}`}>
                            {(SO_STATUS_LABEL[lang] || SO_STATUS_LABEL.th)[o.status] || o.status || '—'}
                          </span>
                        </td>
                        <td className="py-2.5 px-2 text-right font-semibold text-gray-900">{fmt(o.total_amount)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
