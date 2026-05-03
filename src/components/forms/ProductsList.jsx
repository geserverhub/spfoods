import { apiFetch } from '../../lib/api.js'
import { useEffect, useState } from 'react'
import { Check, Eye, Pencil, Printer, Upload, X } from 'lucide-react'

const i18n = {
  th: {
    title:'รายการสินค้า', code:'รหัส', name:'ชื่อสินค้า', unit:'หน่วย', cost:'ต้นทุน', sell:'ราคาขาย', thb:'บาท', krw:'วอน', usd:'ดอลลาร์', cny:'หยวน', stock:'สต๊อก', cat:'หมวด', empty:'ไม่มีข้อมูล', total:'รายการทั้งหมด',
    loading:'กำลังโหลด...', searchPlaceholder:'ค้นหา...', action:'การจัดการ', view:'วิว', upload:'อัปโหลดรูป', uploading:'กำลังอัปโหลด...',
    loadFailed:'โหลดรายการสินค้าไม่สำเร็จ', uploadFailed:'อัปโหลดรูปไม่สำเร็จ',
    editPrice:'แก้ราคา', save:'บันทึก', cancel:'ยกเลิก', saving:'กำลังบันทึก...', savePriceFailed:'บันทึกราคาไม่สำเร็จ',
    printTitle:'รายละเอียดสินค้า', close:'ปิด', print:'พิมพ์',
    productCode:'รหัสสินค้า', productName:'ชื่อสินค้า', category:'หมวดหมู่', remainStock:'สต๊อกคงเหลือ', minStock:'สต๊อกขั้นต่ำ', detail:'รายละเอียด'
  },
  en: {
    title:'Products List', code:'Code', name:'Product Name', unit:'Unit', cost:'Cost', sell:'Sell Price', thb:'THB', krw:'KRW', usd:'USD', cny:'CNY', stock:'Stock', cat:'Category', empty:'No data', total:'Total',
    loading:'Loading...', searchPlaceholder:'Search...', action:'Action', view:'View', upload:'Upload Image', uploading:'Uploading...',
    loadFailed:'Failed to load products', uploadFailed:'Failed to upload image',
    editPrice:'Edit Price', save:'Save', cancel:'Cancel', saving:'Saving...', savePriceFailed:'Failed to save prices',
    printTitle:'Product Details', close:'Close', print:'Print',
    productCode:'Product Code', productName:'Product Name', category:'Category', remainStock:'Remaining Stock', minStock:'Minimum Stock', detail:'Description'
  },
  ko: {
    title:'제품 목록', code:'코드', name:'제품명', unit:'단위', cost:'원가', sell:'판매가', thb:'THB', krw:'KRW', usd:'USD', cny:'CNY', stock:'재고', cat:'분류', empty:'데이터 없음', total:'전체',
    loading:'로딩 중...', searchPlaceholder:'검색...', action:'작업', view:'보기', upload:'이미지 업로드', uploading:'업로드 중...',
    loadFailed:'제품 목록을 불러오지 못했습니다', uploadFailed:'이미지 업로드에 실패했습니다',
    editPrice:'가격 수정', save:'저장', cancel:'취소', saving:'저장 중...', savePriceFailed:'가격 저장에 실패했습니다',
    printTitle:'제품 상세', close:'닫기', print:'인쇄',
    productCode:'제품 코드', productName:'제품명', category:'분류', remainStock:'재고', minStock:'최소 재고', detail:'상세'
  },
}
const fmt = n => parseFloat(n || 0).toLocaleString('th-TH', { minimumFractionDigits: 2 })

const FX_FROM_THB = { KRW: 40, USD: 0.027, CNY: 0.20 }
const toKrw = thb => Number((parseFloat(thb || 0) * FX_FROM_THB.KRW).toFixed(2))
const toUsd = thb => Number((parseFloat(thb || 0) * FX_FROM_THB.USD).toFixed(3))
const toCny = thb => Number((parseFloat(thb || 0) * FX_FROM_THB.CNY).toFixed(2))
const getCostThb = row => parseFloat(row.price_cost_thb ?? row.price_cost ?? 0)
const getCostKrw = row => parseFloat(row.price_cost_krw ?? toKrw(getCostThb(row)))
const getCostUsd = row => parseFloat(row.price_cost_usd ?? toUsd(getCostThb(row)))
const getCostCny = row => parseFloat(row.price_cost_cny ?? toCny(getCostThb(row)))
const getSellThb = row => parseFloat(row.price_sell_thb ?? row.price_sell ?? 0)
const getSellKrw = row => parseFloat(row.price_sell_krw ?? toKrw(getSellThb(row)))
const getSellUsd = row => parseFloat(row.price_sell_usd ?? toUsd(getSellThb(row)))
const getSellCny = row => parseFloat(row.price_sell_cny ?? toCny(getSellThb(row)))

function PrintView({ row, onClose, t }) {
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center print:bg-white print:inset-auto">
      <div className="bg-white rounded-2xl p-8 max-w-lg w-full mx-4 shadow-2xl print:shadow-none print:rounded-none print:p-4" id="print-area">
        <div className="flex justify-between items-start mb-6 print:hidden">
          <h3 className="font-bold text-lg text-gray-900">{t.printTitle}</h3>
          <button onClick={onClose}><X className="w-5 h-5 text-gray-500" /></button>
        </div>
        <div className="space-y-3 text-sm">
          {row.image_url && (
            <div className="pb-3 border-b border-gray-100">
              <img
                src={row.image_url}
                alt={row.product_name || 'product'}
                className="w-full h-44 object-cover rounded-xl border border-gray-200"
              />
            </div>
          )}
          {[
            [t.productCode, row.product_code],
            [t.productName, row.product_name],
            [t.category, row.category_name || row.category_id || '—'],
            [t.unit, row.unit],
            [`${t.cost} (THB)`, `฿ ${fmt(getCostThb(row))}`],
            [`${t.cost} (KRW)`, `₩ ${fmt(getCostKrw(row))}`],
            [`${t.cost} (USD)`, `$ ${fmt(getCostUsd(row))}`],
            [`${t.cost} (CNY)`, `¥ ${fmt(getCostCny(row))}`],
            [`${t.sell} (THB)`, `฿ ${fmt(getSellThb(row))}`],
            [`${t.sell} (KRW)`, `₩ ${fmt(getSellKrw(row))}`],
            [`${t.sell} (USD)`, `$ ${fmt(getSellUsd(row))}`],
            [`${t.sell} (CNY)`, `¥ ${fmt(getSellCny(row))}`],
            [t.remainStock, row.stock_qty],
            [t.minStock, row.min_stock],
            [t.detail, row.description || '—'],
          ].map(([k, v]) => (
            <div key={k} className="flex gap-4 border-b border-gray-100 pb-2">
              <span className="text-gray-500 w-32 shrink-0">{k}</span>
              <span className="font-medium text-gray-900">{v}</span>
            </div>
          ))}
        </div>
        <div className="mt-6 flex gap-3 print:hidden">
          <button onClick={() => window.print()} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700">
            <Printer className="w-4 h-4" /> {t.print}
          </button>
          <button onClick={onClose} className="px-4 py-2 border border-gray-200 rounded-xl text-sm text-gray-700 hover:bg-gray-50">{t.close}</button>
        </div>
      </div>
    </div>
  )
}

export default function ProductsList({ token, lang }) {
  const t = i18n[lang] || i18n.th
  const [rows, setRows]   = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [view, setView]   = useState(null)
  const [search, setSearch] = useState('')
  const [uploadingId, setUploadingId] = useState(null)
  const [editingId, setEditingId] = useState(null)
  const [priceDraft, setPriceDraft] = useState({ cost: '', sell: '' })
  const [savingPriceId, setSavingPriceId] = useState(null)

  const loadRows = async () => {
    const r = await apiFetch('/api/products', { headers: { Authorization: `Bearer ${token}` } })
    const d = await r.json()
    if (!r.ok) throw new Error(d.error || t.loadFailed)
    const list = Array.isArray(d) ? d : []
    setRows(list)
    setError('')
    return list
  }

  useEffect(() => {
    setLoading(true)
    loadRows()
      .catch(err => setError(err.message || t.loadFailed))
      .finally(() => setLoading(false))
  }, [token, lang])

  const filtered = rows.filter(r =>
    (r.product_name || '').toLowerCase().includes(search.toLowerCase()) ||
    (r.product_code || '').toLowerCase().includes(search.toLowerCase())
  )

  const beginInlinePriceEdit = row => {
    setEditingId(row.id)
    setPriceDraft({ cost: String(getCostThb(row)), sell: String(getSellThb(row)) })
  }

  const cancelInlinePriceEdit = () => {
    setEditingId(null)
    setPriceDraft({ cost: '', sell: '' })
  }

  const saveInlinePrice = async row => {
    const costThb = parseFloat(priceDraft.cost || 0)
    const sellThb = parseFloat(priceDraft.sell || 0)
    if (!Number.isFinite(costThb) || costThb < 0 || !Number.isFinite(sellThb) || sellThb < 0) {
      alert(t.savePriceFailed)
      return
    }

    setSavingPriceId(row.id)
    try {
      const res = await apiFetch(`/api/products/${row.id}/prices`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ price_cost_thb: costThb, price_sell_thb: sellThb }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || t.savePriceFailed)

      const latest = await loadRows()
      if (view && view.id === row.id) {
        const fresh = latest.find(it => Number(it.id) === Number(row.id))
        if (fresh) setView(fresh)
      }
      cancelInlinePriceEdit()
    } catch (e) {
      alert(e.message || t.savePriceFailed)
    } finally {
      setSavingPriceId(null)
    }
  }

  const handleInlineUpload = async (row, file) => {
    if (!row?.id || !file) return
    setUploadingId(row.id)
    try {
      const fd = new FormData()
      fd.append('image', file)
      const res = await apiFetch(`/api/products/${row.id}/image`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: fd,
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || t.uploadFailed)

      const latest = await loadRows()
      if (view && view.id === row.id) {
        const fresh = latest.find(it => Number(it.id) === Number(row.id))
        if (fresh) setView(fresh)
      }
    } catch (e) {
      alert(e.message || t.uploadFailed)
    } finally {
      setUploadingId(null)
    }
  }

  if (loading) return <p className="text-center py-10 text-gray-500">{t.loading}</p>

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      {view && <PrintView row={view} onClose={() => setView(null)} t={t} />}
      <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
        <h3 className="font-bold text-gray-900">{t.title}</h3>
        <div className="flex items-center gap-3">
          <span className="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full">{t.total}: {filtered.length}</span>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder={t.searchPlaceholder} className="text-sm border border-gray-200 rounded-xl px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-200 w-40" />
        </div>
      </div>
      {error ? <p className="text-center py-12 text-red-500">{error || t.loadFailed}</p> : filtered.length === 0 ? <p className="text-center py-12 text-gray-400">{t.empty}</p> : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-xs font-bold text-gray-800 uppercase">
              <tr>
                <th className="px-4 py-3 text-left">{t.code}</th>
                <th className="px-4 py-3 text-left">{t.name}</th>
                <th className="px-4 py-3 text-left">{t.unit}</th>
                <th className="px-4 py-3 text-right">{t.cost} ({t.thb})</th>
                <th className="px-4 py-3 text-right">{t.cost} ({t.krw})</th>
                <th className="px-4 py-3 text-right">{t.cost} ({t.usd})</th>
                <th className="px-4 py-3 text-right">{t.cost} ({t.cny})</th>
                <th className="px-4 py-3 text-right">{t.sell} ({t.thb})</th>
                <th className="px-4 py-3 text-right">{t.sell} ({t.krw})</th>
                <th className="px-4 py-3 text-right">{t.sell} ({t.usd})</th>
                <th className="px-4 py-3 text-right">{t.sell} ({t.cny})</th>
                <th className="px-4 py-3 text-right">{t.stock}</th>
                <th className="px-4 py-3 text-center">{t.action}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map(r => (
                <tr key={r.id} className="hover:bg-gray-50">
                  {(() => {
                    const isEditing = editingId === r.id
                    const costThbValue = isEditing ? (parseFloat(priceDraft.cost || 0) || 0) : getCostThb(r)
                    const sellThbValue = isEditing ? (parseFloat(priceDraft.sell || 0) || 0) : getSellThb(r)
                    const costKrwValue = isEditing ? toKrw(costThbValue) : getCostKrw(r)
                    const costUsdValue = isEditing ? toUsd(costThbValue) : getCostUsd(r)
                    const costCnyValue = isEditing ? toCny(costThbValue) : getCostCny(r)
                    const sellKrwValue = isEditing ? toKrw(sellThbValue) : getSellKrw(r)
                    const sellUsdValue = isEditing ? toUsd(sellThbValue) : getSellUsd(r)
                    const sellCnyValue = isEditing ? toCny(sellThbValue) : getSellCny(r)

                    return (
                      <>
                  <td className="px-4 py-3 font-mono text-xs text-gray-700">{r.product_code}</td>
                  <td className="px-4 py-3 font-medium text-gray-900">{r.product_name}</td>
                  <td className="px-4 py-3 text-gray-700">{r.unit}</td>
                  <td className="px-4 py-3 text-right text-gray-800">
                    {isEditing ? (
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={priceDraft.cost}
                        onChange={e => setPriceDraft(prev => ({ ...prev, cost: e.target.value }))}
                        className="w-28 ml-auto px-2 py-1 border border-gray-200 rounded-lg text-right text-sm text-gray-900 focus:outline-none focus:ring-1 focus:ring-blue-300"
                      />
                    ) : (
                      <>฿ {fmt(costThbValue)}</>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right text-gray-800">₩ {fmt(costKrwValue)}</td>
                  <td className="px-4 py-3 text-right text-gray-800">$ {fmt(costUsdValue)}</td>
                  <td className="px-4 py-3 text-right text-gray-800">¥ {fmt(costCnyValue)}</td>
                  <td className="px-4 py-3 text-right font-semibold text-blue-700">
                    {isEditing ? (
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={priceDraft.sell}
                        onChange={e => setPriceDraft(prev => ({ ...prev, sell: e.target.value }))}
                        className="w-28 ml-auto px-2 py-1 border border-blue-200 rounded-lg text-right text-sm text-blue-700 focus:outline-none focus:ring-1 focus:ring-blue-300"
                      />
                    ) : (
                      <>฿ {fmt(sellThbValue)}</>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right font-semibold text-blue-700">₩ {fmt(sellKrwValue)}</td>
                  <td className="px-4 py-3 text-right font-semibold text-blue-700">$ {fmt(sellUsdValue)}</td>
                  <td className="px-4 py-3 text-right font-semibold text-blue-700">¥ {fmt(sellCnyValue)}</td>
                  <td className="px-4 py-3 text-right text-gray-800">{r.stock_qty}</td>
                  <td className="px-4 py-3 text-center">
                    <div className="flex items-center justify-center gap-2">
                      {isEditing ? (
                        <>
                          <button
                            onClick={() => saveInlinePrice(r)}
                            disabled={savingPriceId === r.id}
                            className="inline-flex items-center gap-1 text-xs px-2.5 py-1 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 font-medium disabled:opacity-60"
                          >
                            <Check className="w-3.5 h-3.5" /> {savingPriceId === r.id ? t.saving : t.save}
                          </button>
                          <button
                            onClick={cancelInlinePriceEdit}
                            disabled={savingPriceId === r.id}
                            className="inline-flex items-center gap-1 text-xs px-2.5 py-1 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium disabled:opacity-60"
                          >
                            {t.cancel}
                          </button>
                        </>
                      ) : (
                        <>
                          <button onClick={() => setView(r)} className="inline-flex items-center gap-1 text-xs px-2.5 py-1 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 font-medium">
                            <Eye className="w-3.5 h-3.5" /> {t.view}
                          </button>
                          <button
                            onClick={() => beginInlinePriceEdit(r)}
                            className="inline-flex items-center gap-1 text-xs px-2.5 py-1 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 font-medium"
                          >
                            <Pencil className="w-3.5 h-3.5" /> {t.editPrice}
                          </button>
                          <label className={`inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg font-medium cursor-pointer ${uploadingId === r.id ? 'bg-gray-100 text-gray-400' : 'bg-amber-50 text-amber-700 hover:bg-amber-100'}`}>
                            <Upload className="w-3.5 h-3.5" /> {uploadingId === r.id ? t.uploading : t.upload}
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              disabled={uploadingId === r.id}
                              onChange={e => {
                                const f = e.target.files?.[0]
                                if (f) handleInlineUpload(r, f)
                                e.target.value = ''
                              }}
                            />
                          </label>
                        </>
                      )}
                    </div>
                  </td>
                      </>
                    )
                  })()}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
