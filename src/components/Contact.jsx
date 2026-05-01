import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    alert('ขอบคุณที่ติดต่อ เรากำลังประมวลผลคำขอของคุณ');
    setFormData({ name: '', email: '', phone: '', message: '' });
  };

  const contactInfo = [
    {
      icon: Phone,
      label: 'โทรศัพท์',
      value: '02-1234-5678'
    },
    {
      icon: Mail,
      label: 'อีเมล',
      value: 'info@spfoods.com'
    },
    {
      icon: MapPin,
      label: 'ที่อยู่',
      value: 'อำเภออินทรีย์ จังหวัรมั่น'
    }
  ];

  return (
    <section id="contact" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="section-title">ติดต่อเรา</h2>
          <p className="section-subtitle">
            เรายินดีที่จะได้ยินจากคุณ ติดต่อเราวันนี้
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
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

        {/* Contact Form */}
        <div className="max-w-2xl mx-auto">
          <form onSubmit={handleSubmit} className="bg-light p-8 rounded-3xl">
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <input
                type="text"
                name="name"
                placeholder="ชื่อของคุณ"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
              <input
                type="email"
                name="email"
                placeholder="อีเมลของคุณ"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <input
              type="tel"
              name="phone"
              placeholder="เบอร์โทรศัพท์"
              value={formData.phone}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 mb-6"
            />
            <textarea
              name="message"
              placeholder="ข้อความของคุณ"
              value={formData.message}
              onChange={handleChange}
              required
              rows="6"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 mb-6"
            ></textarea>
            <button type="submit" className="btn-primary w-full flex items-center justify-center space-x-2">
              <span>ส่งข้อความ</span>
              <Send className="w-5 h-5" />
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
