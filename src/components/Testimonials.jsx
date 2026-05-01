import React from 'react';
import { Star } from 'lucide-react';

export default function Testimonials() {
  const testimonials = [
    {
      name: 'นายสมชาย ใจดี',
      role: 'ผู้บริหาร ร้านอาหารสุขภาพ',
      content: 'ผลิตภัณฑ์ SP Foods มีคุณภาพดีมากจริงๆ ลูกค้าของฉันชื่นชอบมาก และการส่งมอบรวดเร็วทำให้ฉันพอใจ',
      avatar: '👨‍💼',
      rating: 5
    },
    {
      name: 'นางสาวกิ่งแก้ว สว่างสมบัติ',
      role: 'แม่บ้าน',
      content: 'เปลี่ยนมาใช้ผลิตภัณฑ์ของ SP Foods ครอบครัวฉันมีสุขภาพดีขึ้นอย่างเห็นได้ชัด ไม่มีสารเคมีจริงๆ',
      avatar: '👩‍🍳',
      rating: 5
    },
    {
      name: 'นายอนุสรณ์ เจริงศรี',
      role: 'นักกีฬา',
      content: 'สำหรับผู้ที่ใส่ใจสุขภาพแบบฉัน SP Foods คือทางเลือกที่ดีที่สุด คุณภาพ ความสด สะอาด ครบครัน',
      avatar: '🏃',
      rating: 5
    },
    {
      name: 'นางมายา วัฒนา',
      role: 'ครูศรุษศาสตร์',
      content: 'ฉันแนะนำให้นักเรียนและผู้ปกครองของฉันใช้สินค้า SP Foods เพราะเชื่อมั่นได้',
      avatar: '👩‍🏫',
      rating: 5
    }
  ];

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="section-title">ความพึงพอใจของลูกค้า</h2>
          <p className="section-subtitle">
            เสียงจากลูกค้าที่พอใจกับคุณภาพของเรา
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-2 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="card">
              {/* Stars */}
              <div className="flex mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>

              {/* Content */}
              <p className="text-gray-700 mb-6 leading-relaxed italic">
                "{testimonial.content}"
              </p>

              {/* Author */}
              <div className="flex items-center space-x-4 border-t border-gray-200 pt-4">
                <span className="text-4xl">{testimonial.avatar}</span>
                <div>
                  <p className="font-bold text-dark">{testimonial.name}</p>
                  <p className="text-sm text-gray-600">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
