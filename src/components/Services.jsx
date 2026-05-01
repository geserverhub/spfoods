import React from 'react';
import { Truck, Leaf, Shield, Award } from 'lucide-react';

export default function Services() {
  const services = [
    {
      icon: Truck,
      title: 'ส่งด่วน 24 ชั่วโมง',
      description: 'เรากำหนด: ส่งสินค้าตรงจากไร่สดใหม่ทุกวัน'
    },
    {
      icon: Leaf,
      title: 'ไม่ใช้สารเคมี',
      description: 'ปลอดภัยและเกษตรอินทรีย์ 100% สำหรับครอบครัวของคุณ'
    },
    {
      icon: Shield,
      title: 'ประกันคุณภาพ',
      description: 'ทั้งหมดจำหน่ายผ่านการตรวจสอบอย่างเข้มงวด'
    },
    {
      icon: Award,
      title: 'รางวัลและการรับรอง',
      description: 'ได้รับรางวัลระดับชาติสำหรับคุณภาพเกษตร'
    }
  ];

  return (
    <section id="services" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="section-title">บริการและข้อดีของเรา</h2>
          <p className="section-subtitle">
            ทำไมลูกค้ากว่า 10,000 คนเลือก SP Foods
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-4 sm:grid-cols-2 gap-8">
          {services.map((service, index) => {
            const IconComponent = service.icon;
            return (
              <div key={index} className="card text-center group">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4 group-hover:bg-primary/20 transition-colors">
                  <IconComponent className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-dark mb-2">{service.title}</h3>
                <p className="text-gray-600">{service.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
