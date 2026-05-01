import React from 'react';
import { Facebook, Instagram, Twitter, Linkedin } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-dark text-white py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-4 gap-8 mb-12">
          {/* Company Info */}
          <div>
            <h3 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-4">
              SP Foods
            </h3>
            <p className="text-gray-400">
              อาหารสุขภาพจากธรรมชาติ คุณภาพดีที่สุด เชื่อถือได้
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold mb-4">ลิงก์ด่วน</h4>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#hero" className="hover:text-primary transition-colors">หน้าแรก</a></li>
              <li><a href="#services" className="hover:text-primary transition-colors">บริการ</a></li>
              <li><a href="#products" className="hover:text-primary transition-colors">ผลิตภัณฑ์</a></li>
              <li><a href="#about" className="hover:text-primary transition-colors">เกี่ยวกับเรา</a></li>
              <li><a href="#contact" className="hover:text-primary transition-colors">ติดต่อ</a></li>
            </ul>
          </div>

          {/* Products */}
          <div>
            <h4 className="font-bold mb-4">ผลิตภัณฑ์</h4>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-primary transition-colors">ผักสด</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">ผลไม้</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">เครื่องปรุง</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">ผลิตภัณฑ์อื่นๆ</a></li>
            </ul>
          </div>

          {/* Social Media */}
          <div>
            <h4 className="font-bold mb-4">ติดตามเรา</h4>
            <div className="flex space-x-4">
              <a href="#" className="p-3 bg-primary/20 hover:bg-primary rounded-full transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="p-3 bg-primary/20 hover:bg-primary rounded-full transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="p-3 bg-primary/20 hover:bg-primary rounded-full transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="p-3 bg-primary/20 hover:bg-primary rounded-full transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-700 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center text-gray-400 text-sm">
            <p>&copy; {currentYear} SP Foods. สงวนลิขสิทธิ์ทั้งหมด</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="hover:text-primary transition-colors">นโยบายความเป็นส่วนตัว</a>
              <a href="#" className="hover:text-primary transition-colors">เงื่อนไขการใช้</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
