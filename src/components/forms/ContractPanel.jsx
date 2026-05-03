import { apiFetch } from '../../lib/api.js'
import { useEffect, useState } from 'react'
import { CheckCircle } from 'lucide-react'

const i18n = {
  th: {
    title: 'สร้างสัญญาซื้อ-ขาย', contractNo: 'เลขที่สัญญา', contractDate: 'วันที่ทำสัญญา',
    startDate: 'วันเริ่มต้นสัญญา', endDate: 'วันสิ้นสุดสัญญา', subject: 'หัวข้อสัญญา',
    defaultTitle: 'สัญญาซื้อ-ขายสินค้า',
    sellerDefaultName: 'บริษัท เอส พี ฟู้ดส์ จำกัด',
    seller: 'ข้อมูลผู้ขาย', sellerName: 'ชื่อผู้ขาย / บริษัท',
    customer: 'ชื่อลูกค้า / บริษัท', address: 'ที่อยู่', taxId: 'เลขประจำตัวผู้เสียภาษี',
    contactName: 'ชื่อผู้ติดต่อ', companyPhone: 'เบอร์โทรบริษัท', contactPhone: 'เบอร์โทรผู้ติดต่อ',
    selectCustomer: '— เลือกลูกค้าจากฐานข้อมูล —', customerPlaceholder: 'หรือพิมพ์ชื่อลูกค้า / บริษัท',
    content: 'เนื้อหาสัญญา', contentPlaceholder: 'พิมพ์รายละเอียด เงื่อนไข ข้อตกลง ขอบเขตงาน หรือเนื้อหาสัญญาทั้งหมดที่ต้องการบันทึก',
    note: 'หมายเหตุ', 
    noteLegal: 'สัญญาฉบับนี้จัดทำขึ้นเพื่อเป็นหลักฐานการตกลงซื้อ-ขายและมีผลบังคับทางกฎหมายครบถ้วน หากฝ่ายใดฝ่ายหนึ่งผิดสัญญา สามารถดำเนินการตามกฎหมายได้',
    submit: 'บันทึกสัญญา', success: 'สร้างสัญญาสำเร็จ', new: 'สร้างสัญญาใหม่',
    payType: 'ประเภทการชำระเงิน', payTerm: 'เงื่อนไขการชำระ',
    cash: 'เงินสด', credit: 'เครดิต', transfer: 'โอนเงิน',
    payTermOptions: {
      immediate: 'ชำระทันที',
      d7: 'ชำระภายใน 7 วัน',
      d15: 'ชำระภายใน 15 วัน',
      d30: 'ชำระภายใน 30 วัน',
      d45: 'ชำระภายใน 45 วัน',
      d60: 'ชำระภายใน 60 วัน',
      d90: 'ชำระภายใน 90 วัน',
    },
  },
  en: {
    title: 'Create Sale Contract', contractNo: 'Contract No.', contractDate: 'Contract Date',
    startDate: 'Start Date', endDate: 'End Date', subject: 'Contract Subject',
    defaultTitle: 'Sale-Purchase Contract',
    sellerDefaultName: 'SP FOODS CO., LTD',
    seller: 'Seller Information', sellerName: 'Seller / Company',
    customer: 'Customer / Company', address: 'Address', taxId: 'Tax ID',
    contactName: 'Contact Name', companyPhone: 'Company Phone', contactPhone: 'Contact Phone',
    selectCustomer: '— Select customer from database —', customerPlaceholder: 'or type customer / company name',
    content: 'Contract Content', contentPlaceholder: 'Enter the contract terms, scope of work, conditions, and full agreement details here',
    note: 'Note',
    noteLegal: 'This contract is executed as evidence of the purchase and sale agreement and has full legal force. If either party breaches this contract, legal remedies may be pursued accordingly.',
    submit: 'Save Contract', success: 'Contract Created', new: 'Create Another',
    payType: 'Payment Type', payTerm: 'Payment Terms',
    cash: 'Cash', credit: 'Credit', transfer: 'Transfer',
    payTermOptions: {
      immediate: 'Due immediately',
      d7: 'Due within 7 days',
      d15: 'Due within 15 days',
      d30: 'Due within 30 days',
      d45: 'Due within 45 days',
      d60: 'Due within 60 days',
      d90: 'Due within 90 days',
    },
  },
  ko: {
    title: '매매계약서 작성', contractNo: '계약 번호', contractDate: '계약일',
    startDate: '시작일', endDate: '종료일', subject: '계약 제목',
    defaultTitle: '매매계약서',
    sellerDefaultName: 'SP FOODS CO., LTD',
    seller: '판매자 정보', sellerName: '판매자 / 회사명',
    customer: '고객 / 회사명', address: '주소', taxId: '사업자번호',
    contactName: '담당자명', companyPhone: '회사 전화번호', contactPhone: '담당자 전화번호',
    selectCustomer: '— 데이터베이스에서 고객 선택 —', customerPlaceholder: '또는 고객 / 회사명을 직접 입력',
    content: '계약 내용', contentPlaceholder: '계약 조항, 업무 범위, 조건 및 전체 계약 내용을 입력하세요',
    note: '메모',
    noteLegal: '본 계약서는 매매 계약의 증거로서 작성되며 완전한 법적 효력을 가집니다. 계약 당사자 중 한쪽이 계약을 위반할 경우, 관련 법에 따라 법적 조치를 취할 수 있습니다.',
    submit: '계약 저장', success: '계약 생성 완료', new: '새 계약 작성',
    payType: '결제 유형', payTerm: '결제 조건',
    cash: '현금', credit: '외상', transfer: '계좌이체',
    payTermOptions: {
      immediate: '즉시 결제',
      d7: '7일 이내 결제',
      d15: '15일 이내 결제',
      d30: '30일 이내 결제',
      d45: '45일 이내 결제',
      d60: '60일 이내 결제',
      d90: '90일 이내 결제',
    },
  },
}
const today = () => new Date().toISOString().slice(0, 10)

const CONTRACT_TEMPLATE_BY_LANG = {
  th: `สัญญาฉบับนี้ทำขึ้นระหว่าง
{{seller_name}} (ต่อไปในสัญญาเรียกว่า “ผู้ขาย”)
และ คู่สัญญา {{customer_name}} (ต่อไปในสัญญาเรียกว่า “ผู้ซื้อ”)

ข้อมูลผู้ขาย
ชื่อผู้ขาย / บริษัท: {{seller_name}}
ที่อยู่: {{seller_address}}
เลขประจำตัวผู้เสียภาษี: {{seller_tax_id}}
ชื่อผู้ติดต่อ: {{seller_contact_name}}
เบอร์โทรบริษัท: {{seller_company_phone}}
เบอร์โทรผู้ติดต่อ: {{seller_contact_phone}}

ข้อมูลผู้ซื้อ
ชื่อลูกค้า / บริษัท: {{customer_name}}
ที่อยู่: {{customer_address}}
เลขประจำตัวผู้เสียภาษี: {{customer_tax_id}}
ชื่อผู้ติดต่อ: {{contact_name}}
เบอร์โทรบริษัท: {{company_phone}}
เบอร์โทรผู้ติดต่อ: {{contact_phone}}

โดยคู่สัญญาทั้งสองฝ่ายตกลงเงื่อนไขดังต่อไปนี้

ข้อ 1 การมีผลบังคับของสัญญา
สัญญาฉบับนี้ให้ถือว่ามีผลสมบูรณ์และมีผลผูกพันทางกฎหมายทันที เมื่อผู้ซื้อได้ทำการสั่งซื้อสินค้าและรับมอบสินค้าเรียบร้อยแล้ว โดยให้เริ่มนับตั้งแต่บิลแรกเป็นต้นไป

ข้อ 2 การต่ออายุสัญญา
สัญญานี้ให้มีการต่ออายุโดยอัตโนมัติ หากผู้ซื้อยังคงมีการสั่งซื้อสินค้าและชำระเงินตามเงื่อนไขที่กำหนดไว้อย่างต่อเนื่อง โดยไม่จำเป็นต้องจัดทำสัญญาฉบับใหม่

ข้อ 3 การยอมรับสัญญา
คู่สัญญาทั้งสองฝ่ายตกลงให้ถือว่า ลายเซ็นในใบสั่งซื้อสินค้า ใบส่งมอบสินค้า และเอกสารที่เกี่ยวข้องในบิลแรก เป็นหลักฐานแสดงถึงการยอมรับเงื่อนไข และถือว่าได้ทำสัญญาซื้อขายร่วมกันโดยสมบูรณ์แล้ว

ข้อ 4 เงื่อนไขการชำระเงิน
ผู้ซื้อตกลงชำระค่าสินค้าตามจำนวนและภายในระยะเวลาที่กำหนดไว้ในใบแจ้งหนี้ (Invoice) หรือเอกสารที่เกี่ยวข้อง โดยให้ถือว่าเงื่อนไขการชำระเงินดังกล่าวเป็นส่วนหนึ่งของสัญญานี้
การชำระเงินจะต้องดำเนินการให้ครบถ้วนตามจำนวน โดยไม่มีการหักกลบลบหนี้ เว้นแต่จะได้รับความยินยอมเป็นลายลักษณ์อักษรจากผู้ขาย
ในกรณีที่ผู้ซื้อมีหนี้ค้างชำระ ผู้ขายมีสิทธิระงับการส่งมอบสินค้าเพิ่มเติมได้ทันที โดยไม่ถือเป็นการผิดสัญญา

ข้อ 5 ค่าปรับและดอกเบี้ยกรณีผิดนัดชำระ
ในกรณีที่ผู้ซื้อไม่ชำระเงินภายในกำหนดระยะเวลาที่ตกลงกัน ผู้ซื้อตกลงชำระดอกเบี้ยผิดนัดในอัตราร้อยละ 15 ต่อปี ของยอดเงินค้างชำระ นับตั้งแต่วันครบกำหนดชำระจนกว่าจะชำระเสร็จสิ้น
นอกจากนี้ ผู้ซื้อยินยอมชำระค่าปรับเพิ่มเติมในอัตราร้อยละ 2 ต่อเดือน ของยอดเงินค้างชำระ (หรืออัตราสูงสุดตามที่กฎหมายกำหนด) จนกว่าจะชำระครบถ้วน
ทั้งนี้ ผู้ซื้อยินยอมรับผิดชอบค่าใช้จ่ายในการติดตามทวงถามหนี้ ค่าทนายความ และค่าใช้จ่ายทางกฎหมายอื่น ๆ ทั้งหมดที่เกิดขึ้นจากการผิดนัดชำระ

ข้อ 6 การผิดสัญญาและการบังคับใช้กฎหมาย
ในกรณีที่ผู้ซื้อผิดนัดชำระเงิน หรือไม่ปฏิบัติตามเงื่อนไขที่ตกลงกันไว้ ผู้ซื้อยินยอมให้ผู้ขายดำเนินการตามกฎหมายได้ทันที และตกลงรับผิดชอบค่าเสียหาย ค่าใช้จ่าย ค่าธรรมเนียม รวมถึงค่าดำเนินการทางกฎหมายทั้งหมดที่เกิดขึ้นจากการผิดสัญญาดังกล่าว

ข้อ 7 การไกล่เกลี่ย ชดใช้หนี้ และการผ่อนชำระหลังไกล่เกลี่ย
ในกรณีที่เกิดข้อพิพาท หรือมีหนี้ค้างชำระ คู่สัญญาทั้งสองฝ่ายตกลงให้มีการเจรจาไกล่เกลี่ยกันก่อนดำเนินการทางกฎหมาย
หากผลการไกล่เกลี่ยนำไปสู่การตกลงชำระหนี้ ไม่ว่าทั้งจำนวนหรือบางส่วน ให้ถือว่า ใบแจ้งหนี้ (Invoice) และ/หรือเอกสารที่เกี่ยวข้อง ซึ่งระบุรายละเอียดจำนวนหนี้ เงื่อนไขการชำระ และกำหนดระยะเวลา เป็นส่วนหนึ่งของข้อตกลงดังกล่าว

และให้ถือว่าเนื้อหาที่ระบุในใบแจ้งหนี้ดังกล่าว เป็นสัญญาการผ่อนชำระหนี้ที่มีผลผูกพันทางกฎหมายทันทีภายหลังการไกล่เกลี่ย โดยผู้ซื้อยินยอมปฏิบัติตามเงื่อนไขดังกล่าวทุกประการ

ในกรณีที่ผู้ซื้อผิดนัดตามข้อตกลงการผ่อนชำระหนี้ ผู้ขายมีสิทธิเรียกให้ชำระหนี้ทั้งหมดที่คงค้างในทันที พร้อมดอกเบี้ย ค่าปรับ และค่าเสียหายที่เกี่ยวข้อง และสามารถดำเนินการตามกฎหมายได้โดยไม่ต้องแจ้งให้ทราบล่วงหน้า`,
  en: `This contract is made between
{{seller_name}} (hereinafter referred to as the “Seller”)
and {{customer_name}} (hereinafter referred to as the “Buyer”)

Seller Information
Seller / Company: {{seller_name}}
Address: {{seller_address}}
Tax ID: {{seller_tax_id}}
Contact Name: {{seller_contact_name}}
Company Phone: {{seller_company_phone}}
Contact Phone: {{seller_contact_phone}}

Buyer Information
Customer / Company: {{customer_name}}
Address: {{customer_address}}
Tax ID: {{customer_tax_id}}
Contact Name: {{contact_name}}
Company Phone: {{company_phone}}
Contact Phone: {{contact_phone}}

Both parties agree to the following terms:

Clause 1 Effective Date
This agreement becomes complete and legally binding immediately once the Buyer places an order and receives goods, starting from the first invoice.

Clause 2 Automatic Renewal
This agreement shall renew automatically while the Buyer continues ordering goods and making payments under agreed terms without requiring a new contract.

Clause 3 Acceptance
Signatures on purchase orders, delivery documents, and documents related to the first invoice shall be deemed evidence of acceptance and formation of this agreement.

Clause 4 Payment Terms
The Buyer agrees to pay according to invoice terms. Such payment terms are part of this contract. Payment must be made in full without set-off unless the Seller gives written consent. The Seller may suspend further delivery if the Buyer has overdue debt.

Clause 5 Default Interest and Penalty
If payment is overdue, the Buyer agrees to pay default interest at 15% per annum on the overdue amount from due date until full payment. Additionally, the Buyer agrees to pay penalty at 2% per month on overdue amount (or maximum rate allowed by law). The Buyer is responsible for debt collection costs, attorney fees, and legal expenses.

Clause 6 Breach and Legal Enforcement
If the Buyer breaches payment or other agreed terms, the Seller may immediately pursue legal action, and the Buyer shall bear damages, costs, fees, and legal expenses arising from such breach.

Clause 7 Mediation and Installment after Mediation
In case of dispute or overdue debt, both parties agree to attempt mediation before legal action. If mediation results in repayment agreement, invoices and related documents specifying debt amount, terms, and period are deemed part of such agreement and legally binding. If the Buyer defaults under installment terms, the Seller may demand immediate full payment plus interest, penalty, and damages and proceed by law without prior notice.`,
  ko: `본 계약은 다음 당사자 간에 체결됩니다.
{{seller_name}} (이하 “판매자”)
및 {{customer_name}} (이하 “구매자”)

판매자 정보
판매자 / 회사명: {{seller_name}}
주소: {{seller_address}}
사업자번호: {{seller_tax_id}}
담당자명: {{seller_contact_name}}
회사 전화번호: {{seller_company_phone}}
담당자 전화번호: {{seller_contact_phone}}

구매자 정보
고객 / 회사명: {{customer_name}}
주소: {{customer_address}}
사업자번호: {{customer_tax_id}}
담당자명: {{contact_name}}
회사 전화번호: {{company_phone}}
담당자 전화번호: {{contact_phone}}

양 당사자는 다음 조건에 합의합니다.

제1조 계약의 효력
본 계약은 구매자가 상품을 주문하고 인도받는 즉시, 첫 번째 청구서를 기준으로 완전하고 법적으로 유효하게 효력이 발생합니다.

제2조 계약의 자동 연장
구매자가 계속해서 주문 및 약정된 조건에 따라 결제를 이행하는 경우, 본 계약은 별도 계약서 작성 없이 자동 연장됩니다.

제3조 계약의 수락
첫 번째 청구서 관련 주문서, 납품서 및 관련 문서의 서명은 본 계약 조건 수락 및 계약 성립의 증거로 간주됩니다.

제4조 결제 조건
구매자는 인보이스 또는 관련 문서의 조건에 따라 대금을 지급하며, 해당 결제 조건은 본 계약의 일부로 간주됩니다. 서면 동의 없이는 상계할 수 없으며, 연체 시 판매자는 추가 납품을 즉시 중단할 수 있습니다.

제5조 연체이자 및 위약금
기한 내 미지급 시, 구매자는 연체 금액에 대해 연 15%의 연체이자를 지급합니다. 또한 연체 금액에 대해 월 2%의 위약금(또는 법정 최고율)을 지급하며, 채권 추심비·변호사비·기타 법적 비용을 부담합니다.

제6조 계약 위반 및 법적 집행
구매자가 결제 또는 기타 조건을 위반하는 경우 판매자는 즉시 법적 조치를 취할 수 있으며, 구매자는 손해·비용·수수료·법적 집행 비용을 부담합니다.

제7조 조정 및 조정 후 분할상환
분쟁 또는 연체 발생 시 법적 절차 전에 조정을 우선합니다. 조정 결과 상환 합의가 이루어지면, 채무 금액·조건·기한이 명시된 인보이스 및 관련 문서는 합의의 일부로서 법적 구속력을 가집니다. 구매자가 분할상환 합의를 위반하면, 판매자는 잔액 전액과 이자·위약금·손해배상을 즉시 청구하고 사전 통지 없이 법적 조치를 진행할 수 있습니다.`,
}

const textOrDash = value => {
  const v = String(value ?? '').trim()
  return v || '-'
}

const buildContractContent = (values, lang) => {
  const template = CONTRACT_TEMPLATE_BY_LANG[lang] || CONTRACT_TEMPLATE_BY_LANG.th
  const replacements = {
    '{{seller_name}}': textOrDash(values.seller_name),
    '{{seller_address}}': textOrDash(values.seller_address),
    '{{seller_tax_id}}': textOrDash(values.seller_tax_id),
    '{{seller_contact_name}}': textOrDash(values.seller_contact_name),
    '{{seller_company_phone}}': textOrDash(values.seller_company_phone),
    '{{seller_contact_phone}}': textOrDash(values.seller_contact_phone),
    '{{customer_name}}': textOrDash(values.customer_name),
    '{{customer_address}}': textOrDash(values.customer_address),
    '{{customer_tax_id}}': textOrDash(values.customer_tax_id),
    '{{contact_name}}': textOrDash(values.contact_name),
    '{{company_phone}}': textOrDash(values.company_phone),
    '{{contact_phone}}': textOrDash(values.contact_phone),
  }

  let content = template
  for (const [token, value] of Object.entries(replacements)) {
    content = content.replaceAll(token, value)
  }
  return content
}

const createDefaultForm = lang => {
  const text = i18n[lang] || i18n.th
  return {
    title: text.defaultTitle,
    seller_name: text.sellerDefaultName,
    seller_address: '',
    seller_tax_id: '',
    seller_contact_name: '',
    seller_company_phone: '',
    seller_contact_phone: '',
    customer_name: '',
    customer_address: '',
    customer_tax_id: '',
    contact_name: '',
    company_phone: '',
    contact_phone: '',
    contract_date: today(),
    start_date: today(),
    end_date: '',
    note: text.noteLegal,
  }
}

export default function ContractPanel({ token, lang, deptColor }) {
  const t = i18n[lang] || i18n.th
  const [contractNo, setContractNo] = useState('')
  const [form, setForm] = useState(() => createDefaultForm(lang))
  const [submitting, setSubmitting] = useState(false)
  const [done, setDone] = useState(null)
  const [customers, setCustomers] = useState([])
  const [payType, setPayType] = useState('cash')
  const [payTerm, setPayTerm] = useState('immediate')
  const computedContent = buildContractContent(form, lang)

  useEffect(() => {
    const headers = { Authorization: `Bearer ${token}` }
    apiFetch('/api/contracts/next-no', { headers }).then(r => r.json()).then(d => setContractNo(d.contract_no)).catch(() => {})
    apiFetch('/api/customers', { headers }).then(r => r.json()).then(d => setCustomers(Array.isArray(d) ? d : [])).catch(() => {})
  }, [token])

  useEffect(() => {
    const defaults = Object.values(i18n)
    const defaultSellerNames = defaults.map(x => x.sellerDefaultName)
    const defaultNotes = defaults.map(x => x.noteLegal)

    setForm(prev => ({
      ...prev,
      title: t.defaultTitle,
      seller_name: defaultSellerNames.includes(prev.seller_name) ? t.sellerDefaultName : prev.seller_name,
      note: defaultNotes.includes(prev.note) ? t.noteLegal : prev.note,
    }))
  }, [lang, t.defaultTitle, t.sellerDefaultName, t.noteLegal])

  const selectCustomer = id => {
    const customer = customers.find(c => c.id === parseInt(id))
    if (!customer) return
    setForm(prev => ({
      ...prev,
      customer_id: customer.id,
      customer_name: customer.customer_name,
      customer_address: customer.address || '',
      customer_tax_id: customer.tax_id || '',
      contact_name: customer.contact_name || customer.contact_person || '',
      company_phone: customer.phone || customer.company_phone || '',
      contact_phone: customer.contact_phone || customer.mobile || '',
    }))
  }

  const handleForm = e => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async e => {
    e.preventDefault()
    setSubmitting(true)
    try {
      const res = await apiFetch('/api/contracts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          ...form,
          content: computedContent,
          note: t.noteLegal,
          payment_type: payType,
          payment_terms: t.payTermOptions[payTerm],
        }),
      })
      const data = await res.json()
      if (data.success) setDone(data.contract_no)
    } catch {}
    setSubmitting(false)
  }

  const reset = async () => {
    setDone(null)
    setForm(createDefaultForm(lang))
    setPayType('cash')
    setPayTerm('immediate')
    const response = await apiFetch('/api/contracts/next-no', { headers: { Authorization: `Bearer ${token}` } })
    const data = await response.json()
    setContractNo(data.contract_no)
  }

  if (done) {
    return (
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
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
        <div className="grid grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-bold text-gray-800 mb-1">{t.contractNo}</label>
            <input value={contractNo} readOnly className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm font-mono bg-gray-50 text-gray-700 cursor-not-allowed" />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-800 mb-1">{t.contractDate} *</label>
            <input type="text" name="contract_date" value={form.contract_date} onChange={handleForm} required placeholder="YYYY-MM-DD" pattern="\d{4}-\d{2}-\d{2}" className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-900 font-mono focus:outline-none focus:ring-2 focus:ring-blue-200" />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-800 mb-1">{t.startDate} *</label>
            <input type="text" name="start_date" value={form.start_date} onChange={handleForm} required placeholder="YYYY-MM-DD" pattern="\d{4}-\d{2}-\d{2}" className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-900 font-mono focus:outline-none focus:ring-2 focus:ring-blue-200" />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-800 mb-1">{t.endDate}</label>
            <input type="text" name="end_date" value={form.end_date} onChange={handleForm} placeholder="YYYY-MM-DD" pattern="\d{4}-\d{2}-\d{2}" className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-900 font-mono focus:outline-none focus:ring-2 focus:ring-blue-200" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
        <div className="grid grid-cols-3 gap-6">
          <div>
            <label className="block text-xs font-bold text-gray-800 mb-2">{t.payType}</label>
            <div className="flex gap-2">
              {[
                { value: 'cash', label: t.cash, icon: '💵' },
                { value: 'transfer', label: t.transfer, icon: '🏦' },
                { value: 'credit', label: t.credit, icon: '💳' },
              ].map(option => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setPayType(option.value)}
                  className={`flex-1 flex flex-col items-center gap-1 py-2 rounded-xl border-2 text-xs font-semibold transition-all ${
                    payType === option.value ? 'border-blue-400 bg-blue-50 text-blue-700' : 'border-gray-200 text-gray-600 hover:border-gray-300'
                  }`}
                >
                  <span className="text-base">{option.icon}</span>{option.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-800 mb-2">{t.payTerm}</label>
            <select value={payTerm} onChange={e => setPayTerm(e.target.value)} className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-200">
              <option value="immediate">{t.payTermOptions.immediate}</option>
              <option value="d7">{t.payTermOptions.d7}</option>
              <option value="d15">{t.payTermOptions.d15}</option>
              <option value="d30">{t.payTermOptions.d30}</option>
              <option value="d45">{t.payTermOptions.d45}</option>
              <option value="d60">{t.payTermOptions.d60}</option>
              <option value="d90">{t.payTermOptions.d90}</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-800 mb-2">{t.subject} *</label>
            <input name="title" value={form.title} onChange={handleForm} required className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-200" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
        <h4 className="font-bold text-gray-900 mb-4 text-sm">{t.seller}</h4>
        <div className="grid grid-cols-1 gap-4 mb-6">
          <div>
            <label className="block text-xs font-bold text-gray-800 mb-1">{t.sellerName} *</label>
            <input name="seller_name" value={form.seller_name} onChange={handleForm} required className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-200" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-800 mb-1">{t.address}</label>
              <textarea name="seller_address" value={form.seller_address} onChange={handleForm} rows={2} className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm text-gray-900 resize-none focus:outline-none focus:ring-2 focus:ring-blue-200" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-800 mb-1">{t.taxId}</label>
              <input name="seller_tax_id" value={form.seller_tax_id} onChange={handleForm} className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-200" />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-800 mb-1">{t.contactName}</label>
              <input name="seller_contact_name" value={form.seller_contact_name} onChange={handleForm} className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-200" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-800 mb-1">{t.companyPhone}</label>
              <input name="seller_company_phone" value={form.seller_company_phone} onChange={handleForm} className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-200" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-800 mb-1">{t.contactPhone}</label>
              <input name="seller_contact_phone" value={form.seller_contact_phone} onChange={handleForm} className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-200" />
            </div>
          </div>
        </div>

        <h4 className="font-bold text-gray-900 mb-4 text-sm">{t.customer}</h4>
        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className="block text-xs font-bold text-gray-800 mb-1">{t.customer} *</label>
            <select onChange={e => selectCustomer(e.target.value)} className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-200 mb-2">
              <option value="">{t.selectCustomer}</option>
              {customers.map(customer => (
                <option key={customer.id} value={customer.id}>{customer.customer_code ? `[${customer.customer_code}] ` : ''}{customer.customer_name}</option>
              ))}
            </select>
            <input name="customer_name" value={form.customer_name} onChange={handleForm} required placeholder={t.customerPlaceholder} className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-200" />
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
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-800 mb-1">{t.contactName}</label>
              <input name="contact_name" value={form.contact_name} onChange={handleForm} className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-200" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-800 mb-1">{t.companyPhone}</label>
              <input name="company_phone" value={form.company_phone} onChange={handleForm} className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-200" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-800 mb-1">{t.contactPhone}</label>
              <input name="contact_phone" value={form.contact_phone} onChange={handleForm} className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-200" />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
        <label className="block text-xs font-bold text-gray-800 mb-2">{t.content} *</label>
        <textarea
          name="content"
          value={computedContent}
          readOnly
          rows={16}
          required
          className="w-full px-4 py-3 border border-gray-200 rounded-2xl text-sm text-gray-900 bg-gray-50 resize-y focus:outline-none leading-7 cursor-not-allowed"
        />
      </div>

      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
        <div className="grid grid-cols-1 gap-4">
          <div>
          <label className="block text-xs font-bold text-gray-800 mb-1">{t.note}</label>
          <textarea name="note" value={t.noteLegal} readOnly rows={4} className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm text-gray-900 bg-gray-50 resize-none focus:outline-none cursor-not-allowed" />
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button type="submit" disabled={submitting} className={`px-8 py-3 rounded-xl font-bold text-white text-sm bg-gradient-to-r ${deptColor} hover:opacity-90 disabled:opacity-50 transition-opacity`}>
          {submitting ? '...' : t.submit}
        </button>
      </div>
    </form>
  )
}