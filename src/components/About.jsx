import React from 'react';
import { CheckCircle } from 'lucide-react';

export default function About() {
  const features = [
    'ปลูกโดยเกษตรกรมืออาชีพที่มีประสบการณ์',
    'ไม่ใช้ยาฆ่าแมลงและสารเคมีใดๆ',
    'เก็บเกี่ยวและส่งสดใหม่ทุกวัน',
    'ผ่านการตรวจสอบมาตรฐาน FDA'
  ];

  return (
    <section id="about" className="py-20 px-4 sm:px-6 lg:px-8 bg-light">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Image Section */}
          <div className="relative">
            <div className="bg-gradient-to-br from-secondary to-primary rounded-3xl p-8 aspect-square flex items-center justify-center">
              <div className="text-center text-white">
                <div className="text-6xl mb-4">👨‍🌾</div>
                <p className="text-xl font-semibold">เกษตรกรอินทรีย์</p>
                <p className="text-sm opacity-90">มีประสบการณ์ 20+ ปี</p>
              </div>
            </div>
          </div>

          {/* Content Section */}
          <div>
            <h2 className="section-title">เกี่ยวกับ SP Foods</h2>
            <p className="text-gray-600 text-lg mb-8 leading-relaxed">
              เรามีเนื้อที่ปลูก 500 ไร่ในอำเภออินทรีย์ที่สำคัญของไทย เฉพาะเลือกเมล็ดพันธุ์ที่ดีที่สุด 
              เพื่อให้คุณได้รับผลผลิตที่มีคุณค่าทางอาหารสูงสุด
            </p>

            {/* Features List */}
            <div className="space-y-4 mb-8">
              {features.map((feature, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <CheckCircle className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                  <p className="text-gray-700 font-medium">{feature}</p>
                </div>
              ))}
            </div>

            {/* Call to Action */}
            <button className="btn-secondary">เรียนรู้เพิ่มเติม</button>
          </div>
        </div>
      </div>
    </section>
  );
}
