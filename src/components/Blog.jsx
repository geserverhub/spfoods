import React from 'react';
import { Calendar, User, ArrowRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const articles = [
  { id: 1, title: 'ประโยชน์ของการกินผัก 5 สี ต่อสุขภาพของคุณ', excerpt: 'ผักแต่ละสีมีคุณประโยชน์ต่างกัน ผักสีเขียว แดง ส้ม ม่วง และสีขาว ช่วยให้กำลังและสุขภาพดีขึ้น', image: '🥗', author: 'อ.สมนึก', date: '15 เมษายน 2026', category: 'สุขภาพ' },
  { id: 2, title: 'เกษตรอินทรีย์ - ความแตกต่างจากวิธีปลูกทั่วไป', excerpt: 'เกษตรอินทรีย์ไม่ใช้สารเคมี ยาฆ่าแมลง และปุ๋ยเคมี ให้ผลผลิตที่ปลอดภัยและเป็นมิตรกับธรรมชาติ', image: '🌱', author: 'นส.นวลนำ', date: '10 เมษายน 2026', category: 'เกษตร' },
  { id: 3, title: 'วิธีเก็บรักษาผักให้สดใหม่นาน 7 วัน', excerpt: 'เคล็ดลับการเก็บรักษาผักในตู้เย็นอย่างถูกต้อง เพื่อให้ผักคงความสดใหม่และมีคุณค่าทางอาหารสูงสุด', image: '❄️', author: 'อ.สมชาย', date: '5 เมษายน 2026', category: 'ทำอาหาร' },
];

export default function Blog() {
  const { t } = useLanguage();

  return (
    <section id="blog" className="scroll-mt-14 py-20 px-4 sm:px-6 lg:px-8 bg-light">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="section-title">{t.blogTitle}</h2>
          <p className="section-subtitle">{t.blogSubtitle}</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {articles.map((article) => (
            <div key={article.id} className="card overflow-hidden flex flex-col hover:shadow-2xl transition-shadow">
              <div className="bg-gradient-to-br from-primary/20 to-accent/20 h-40 flex items-center justify-center mb-4 rounded-lg">
                <span className="text-6xl">{article.image}</span>
              </div>
              <span className="inline-block bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-medium mb-3 w-fit">
                {article.category}
              </span>
              <h3 className="text-lg font-bold text-dark mb-2 line-clamp-2">{article.title}</h3>
              <p className="text-gray-600 text-sm mb-4 flex-grow line-clamp-2">{article.excerpt}</p>
              <div className="space-y-2 text-sm text-gray-600 border-t border-gray-200 pt-4 mt-auto">
                <div className="flex items-center space-x-2">
                  <User className="w-4 h-4" />
                  <span>{article.author}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4" />
                  <span>{article.date}</span>
                </div>
              </div>
              <button className="mt-4 flex items-center space-x-2 text-primary hover:text-orange-600 font-semibold transition-colors">
                <span>{t.readMore}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>

        <div className="text-center mt-16">
          <button className="btn-secondary">{t.viewAllArticles}</button>
        </div>
      </div>
    </section>
  );
}
