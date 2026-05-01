import React from 'react';
import { ArrowRight, Leaf } from 'lucide-react';

export default function Hero() {
  return (
    <section id="hero" className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-light via-white to-light min-h-screen flex items-center">
      <div className="max-w-7xl mx-auto w-full">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-6">
            <div className="inline-flex items-center space-x-2 bg-primary/10 px-4 py-2 rounded-full">
              <Leaf className="w-5 h-5 text-primary" />
              <span className="text-primary font-semibold">100% ผลิตภัณฑ์เกษตรอินทรีย์</span>
            </div>

            <h1 className="text-5xl md:text-6xl font-bold text-dark leading-tight">
              อาหารสุขภาพ
              <span className="block bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                ที่ดีที่สุดสำหรับครอบครัวไทย
              </span>
            </h1>

            <p className="text-xl text-gray-600 leading-relaxed">
              🌾 ปลูกโดยเกษตรกรมืออาชีพ | 🔬 ผ่านการตรวจสอบ FDA | 🚚 ส่งสดใหม่ทุกวัน | ❤️ เนื้อใจจากไร่สู่บ้านคุณ
            </p>

            <div className="flex flex-wrap gap-4 pt-8">
              <button className="btn-primary flex items-center space-x-2">
                <span>สั่งซื้อเลย</span>
                <ArrowRight className="w-5 h-5" />
              </button>
              <button className="btn-outline">ดูเพิ่มเติม</button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 pt-12 border-t border-gray-200">
              <div>
                <p className="text-3xl font-bold text-primary">10K+</p>
                <p className="text-gray-600">ลูกค้าพอใจ</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-primary">50+</p>
                <p className="text-gray-600">ผลิตภัณฑ์</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-primary">100%</p>
                <p className="text-gray-600">ธรรมชาติ</p>
              </div>
            </div>
          </div>

          {/* Right Image */}
          <div className="relative">
            <div className="bg-gradient-to-br from-primary/20 to-accent/20 rounded-3xl p-8 aspect-square flex items-center justify-center">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-40 h-40 bg-gradient-to-br from-primary to-accent rounded-full mb-6 relative">
                  <span className="text-6xl">🥬</span>
                </div>
                <p className="text-lg font-semibold text-gray-700">สินค้าคุณภาพสูง</p>
                <p className="text-sm text-gray-600">ส่งตรงจากไร่</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
