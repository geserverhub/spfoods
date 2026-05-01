import React, { useState, useEffect } from 'react';
import { Flame, Star, Tag, Clock, ChevronLeft, ChevronRight, Zap } from 'lucide-react';

const promos = [
  {
    badge: '🔥 HOT DEAL',
    title: 'อาหารแช่แข็งพรีเมียม',
    subtitle: 'ส.ภาวิณีร์ อีสานฟู้ดส์',
    desc: 'คุณภาพระดับส่งออก ราคาพิเศษสำหรับตัวแทนรายใหม่',
    highlight: 'ลดพิเศษ 20%',
    color: 'from-orange-500 via-red-500 to-pink-600',
    emoji: '🧊',
    tag: 'สินค้าขายดี',
  },
  {
    badge: '⭐ NEW PARTNER',
    title: 'สมัครตัวแทนจำหน่าย',
    subtitle: 'เจ้าเดียวในเกาหลี 30+ ปี',
    desc: 'รับสิทธิ์พิเศษ สินค้าคุณภาพสูง ราคาขายส่ง',
    highlight: 'สมัครฟรี!',
    color: 'from-blue-600 via-indigo-600 to-purple-600',
    emoji: '🤝',
    tag: 'โอกาสทอง',
  },
  {
    badge: '🚀 EXPORT READY',
    title: 'สินค้าพร้อมส่งออก',
    subtitle: 'ไทย · เกาหลี · นานาชาติ',
    desc: 'อาหารแปรรูปมาตรฐานสากล พร้อมเอกสารส่งออกครบ',
    highlight: 'ติดต่อด่วน!',
    color: 'from-emerald-500 via-teal-500 to-cyan-600',
    emoji: '✈️',
    tag: 'ตลาดต่างประเทศ',
  },
  {
    badge: '💰 EARN MORE',
    title: 'หารายได้เสริม',
    subtitle: 'กับแบรนด์ ส.ภาวิณีร์',
    desc: 'รายได้มั่นคง สินค้าขายได้ทุกวัน รองรับทุกช่องทาง',
    highlight: 'เริ่มได้เลย!',
    color: 'from-amber-500 via-orange-500 to-yellow-500',
    emoji: '💵',
    tag: 'รายได้เสริม',
  },
];

const tickerItems = [
  '🔥 โปรโมชั่นพิเศษ สำหรับตัวแทนรายใหม่',
  '⭐ อาหารแช่แข็งพรีเมียม แบรนด์ ส.ภาวิณีร์',
  '🚀 รับสมัครคู่ค้าทั้งในและต่างประเทศ',
  '💰 หารายได้เสริม กับ SP FOODS CO.,LTD',
  '🌏 ส่งออกสู่เกาหลีและนานาชาติ',
  '📦 สินค้าคุณภาพสูง มาตรฐานส่งออก',
];

export default function PromoSection() {
  const [current, setCurrent] = useState(0);
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => goTo((prev) => (prev + 1) % promos.length), 4000);
    return () => clearInterval(timer);
  }, []);

  const goTo = (fn) => {
    setAnimating(true);
    setTimeout(() => {
      setCurrent(typeof fn === 'function' ? fn(current) : fn);
      setAnimating(false);
    }, 300);
  };

  const prev = () => goTo((c) => (c - 1 + promos.length) % promos.length);
  const next = () => goTo((c) => (c + 1) % promos.length);

  const promo = promos[current];

  return (
    <section id="promo" className="scroll-mt-14 py-4 px-4 bg-gradient-to-b from-orange-50 to-white overflow-hidden border-b border-orange-100">

      {/* Ticker */}
      <div className="flex items-center gap-3 mb-6 overflow-hidden">
        <div className="shrink-0 flex items-center gap-1.5 bg-primary px-3 py-1.5 rounded-full text-white text-xs font-bold animate-pulse-ring">
          <Zap className="w-3 h-3" /> ข่าวสาร
        </div>
        <div className="flex-1 overflow-hidden relative h-6">
          <div className="animate-ticker whitespace-nowrap text-gray-500 text-sm flex gap-16 absolute">
            {[...tickerItems, ...tickerItems].map((item, i) => (
              <span key={i}>{item}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Main Promo Card */}
      <div className="max-w-lg mx-auto">
        <div className="relative">

          {/* Title */}
          <div className="text-center mb-3">
            <span className="inline-flex items-center gap-1.5 text-gray-500 text-xs uppercase tracking-widest font-semibold">
              <Flame className="w-3.5 h-3.5 text-primary animate-bounce" />
              โปรโมชั่นวันนี้
              <Flame className="w-3.5 h-3.5 text-primary animate-bounce" />
            </span>
          </div>

          {/* Card */}
          <div
            className={`relative rounded-2xl p-0.5 animate-glow transition-all duration-300 ${animating ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}
            style={{ background: `linear-gradient(135deg, rgba(249,115,22,0.8), rgba(59,130,246,0.8))` }}
          >
            <div className={`bg-gradient-to-br ${promo.color} rounded-[14px] p-4 overflow-hidden relative`}>

              {/* BG decoration */}
              <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full -translate-y-20 translate-x-20" />
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-black/10 rounded-full translate-y-16 -translate-x-16" />

              <div className="relative flex items-center gap-4">

                {/* Left */}
                <div className="text-white flex-1 min-w-0">
                  <span className="inline-block bg-white/20 backdrop-blur-sm text-white text-xs font-bold px-2 py-1 rounded-full mb-2 border border-white/30">
                    {promo.badge}
                  </span>
                  <h2 className="text-lg font-extrabold mb-0.5 leading-tight">{promo.title}</h2>
                  <p className="text-white/80 text-xs font-semibold mb-1">{promo.subtitle}</p>
                  <p className="text-white/70 text-xs mb-3 leading-relaxed">{promo.desc}</p>

                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="bg-white text-gray-900 font-extrabold px-3 py-1 rounded-full text-sm animate-pulse">
                      {promo.highlight}
                    </span>
                    <span className="flex items-center gap-1 bg-white/20 px-2 py-1 rounded-full text-xs border border-white/30">
                      <Tag className="w-3 h-3" /> {promo.tag}
                    </span>
                  </div>
                </div>

                {/* Right */}
                <div className="shrink-0">
                  <div className="relative">
                    <div className="w-20 h-20 bg-white/15 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/20 animate-float">
                      <span className="text-4xl">{promo.emoji}</span>
                    </div>
                    {[...Array(2)].map((_, i) => (
                      <div key={i} className="absolute animate-float" style={{
                        top: `${[5, 70][i]}%`, left: `${[75, 85][i]}%`,
                        animationDelay: `${i * 0.5}s`, animationDuration: `${2 + i * 0.5}s`
                      }}>
                        <Star className="w-3.5 h-3.5 text-yellow-300 fill-yellow-300" />
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center gap-4 mt-5">
            <button onClick={prev} className="p-2 bg-gray-200 hover:bg-gray-300 text-gray-600 rounded-full transition-colors">
              <ChevronLeft className="w-5 h-5" />
            </button>

            <div className="flex gap-2">
              {promos.map((_, i) => (
                <button key={i} onClick={() => goTo(i)}
                  className={`rounded-full transition-all duration-300 ${i === current ? 'w-6 h-2.5 bg-primary' : 'w-2.5 h-2.5 bg-gray-300 hover:bg-gray-400'}`}
                />
              ))}
            </div>

            <button onClick={next} className="p-2 bg-gray-200 hover:bg-gray-300 text-gray-600 rounded-full transition-colors">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

        </div>
      </div>
    </section>
  );
}
