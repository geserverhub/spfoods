import React from 'react';
import { Mail, Phone, MapPin, Store, Building2, Users, Globe, HeartHandshake } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function Contact() {
  const { t } = useLanguage();

  const contactInfo = [
    { icon: Phone,  label: t.phoneLabel,   value: '02-1234-5678' },
    { icon: Mail,   label: t.emailLabel,   value: 'info@spfoods.com' },
    { icon: MapPin, label: t.addressLabel, value: '경기도 화성시 서신면 흔들길 42' },
  ];

  const partnerTypes = [
    { icon: Users,     label: 'ตัวแทนจำหน่าย' },
    { icon: Store,     label: 'ร้านค้า / มาร์ท' },
    { icon: Building2, label: 'บริษัท / ห้างร้าน' },
    { icon: Globe,     label: 'คู่ค้าต่างประเทศ' },
  ];

  return (
    <section id="contact" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="section-title">{t.contactTitle}</h2>
        </div>

        {/* Contact Info Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {contactInfo.map((info, index) => {
            const IconComponent = info.icon;
            return (
              <div key={index} className="card text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
                  <IconComponent className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-bold text-dark mb-2">{info.label}</h3>
                <p className="text-gray-600">{info.value}</p>
              </div>
            );
          })}
        </div>

        {/* Google Maps */}
        <div className="mb-12 rounded-3xl overflow-hidden shadow-lg">
          <iframe
            title="SP FOODS CO.,LTD Location"
            src="https://maps.google.com/maps?q=경기도+화성시+서신면+흔들길+42&output=embed&z=15&hl=ko"
            width="100%"
            height="400"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>

        {/* Partner Announcement Banner */}
        <div id="announce" className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-orange-500 to-accent p-1 shadow-2xl">
          <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-[22px] px-8 py-12 md:px-16 md:py-14">

            {/* Top badge */}
            <div className="flex justify-center mb-6">
              <span className="inline-flex items-center gap-2 bg-primary text-white px-5 py-2 rounded-full text-sm font-bold tracking-wide shadow">
                <HeartHandshake className="w-4 h-4" />
                ประกาศรับสมัคร
              </span>
            </div>

            {/* Headline */}
            <h3 className="text-center text-3xl md:text-4xl font-extrabold text-dark mb-4 leading-tight">
              ร่วมสร้างอาชีพ &amp; หารายได้เสริม
              <span className="block text-primary mt-1">กับ SP FOODS CO.,LTD</span>
            </h3>

            <p className="text-center text-gray-600 text-lg mb-10">
              สำหรับผู้ที่สนใจร่วมเป็นส่วนหนึ่งของครอบครัวเรา ทั้งในและต่างประเทศ
            </p>

            {/* Partner Types */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
              {partnerTypes.map((p, i) => {
                const Icon = p.icon;
                return (
                  <div key={i} className="bg-white rounded-2xl p-5 text-center shadow-md hover:shadow-lg hover:-translate-y-1 transition-all">
                    <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 rounded-full mb-3">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <p className="font-bold text-dark text-sm">{p.label}</p>
                  </div>
                );
              })}
            </div>

            {/* Description */}
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 mb-8 border border-primary/10">
              <p className="text-center text-gray-700 font-medium leading-relaxed">
                เปิดรับ <span className="text-primary font-bold">ตัวแทนจำหน่าย · ร้านค้า · มาร์ท · บริษัท · ห้างร้าน · คู่ค้า</span><br />
                ทั้งในประเทศไทย เกาหลี และนานาชาติ<br />
                <span className="text-sm text-gray-500 mt-1 block">แบรนด์ ส.ภาวิณีร์ อีสานฟู้ดส์ เจ้าเดียวในเกาหลี นานกว่า 30 ปี</span>
              </p>
            </div>

            {/* CTA */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href={`tel:02-1234-5678`}
                className="btn-primary flex items-center justify-center gap-2 text-base px-8 py-3">
                <Phone className="w-5 h-5" />
                โทรสอบถาม
              </a>
              <a href={`mailto:info@spfoods.com`}
                className="btn-outline flex items-center justify-center gap-2 text-base px-8 py-3">
                <Mail className="w-5 h-5" />
                ส่งอีเมลหาเรา
              </a>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
