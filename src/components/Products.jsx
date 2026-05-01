import React from 'react';
import { ShoppingCart, Star } from 'lucide-react';

export default function Products() {
  const products = [
    {
      name: 'ผักสดใหม่',
      category: 'ผักอินทรีย์',
      price: '150 บาท/กล่อง',
      image: '🥬',
      rating: 4.8,
      reviews: 245
    },
    {
      name: 'ผลไม้สด',
      category: 'ผลไม้เกษตรอินทรีย์',
      price: '180 บาท/กล่อง',
      image: '🍅',
      rating: 4.9,
      reviews: 312
    },
    {
      name: 'เครื่องปรุงธรรมชาติ',
      category: 'สินค้าเสริม',
      price: '120 บาท/หลอด',
      image: '🌿',
      rating: 4.7,
      reviews: 187
    },
    {
      name: 'ไข่ไก่อินทรีย์',
      category: 'โปรตีนธรรมชาติ',
      price: '90 บาท/ฟอง',
      image: '🥚',
      rating: 4.9,
      reviews: 298
    },
    {
      name: 'ข้าวอินทรีย์',
      category: 'เกรนธรรมชาติ',
      price: '200 บาท/กิโลฯ',
      image: '🌾',
      rating: 4.8,
      reviews: 156
    },
    {
      name: 'น้ำผึ้งธรรมชาติ',
      category: 'ผลิตภัณฑ์ลับษร',
      price: '250 บาท/ขวด',
      image: '🍯',
      rating: 5.0,
      reviews: 423
    }
  ];

  return (
    <section id="products" className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-light to-white">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="section-title">ผลิตภัณฑ์ของเรา</h2>
          <p className="section-subtitle">
            อาหารคุณภาพสูง ตรงจากไร่ของเรา ถึงโต๊ะของคุณ
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {products.map((product, index) => (
            <div key={index} className="card group overflow-hidden">
              {/* Product Image */}
              <div className="bg-gradient-to-br from-primary/10 to-accent/10 h-48 rounded-lg flex items-center justify-center mb-4 group-hover:from-primary/20 group-hover:to-accent/20 transition-all">
                <span className="text-7xl">{product.image}</span>
              </div>

              {/* Product Info */}
              <span className="inline-block bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium mb-3">
                {product.category}
              </span>
              
              <h3 className="text-xl font-bold text-dark mb-2">{product.name}</h3>
              
              {/* Rating */}
              <div className="flex items-center space-x-2 mb-3">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-4 h-4"
                      fill={i < Math.floor(product.rating) ? 'currentColor' : 'none'}
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-600">
                  {product.rating} ({product.reviews} รีวิว)
                </span>
              </div>

              {/* Price and Button */}
              <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200">
                <p className="text-xl font-bold text-primary">{product.price}</p>
                <button className="p-2 bg-primary text-white rounded-full hover:bg-orange-600 transition-colors">
                  <ShoppingCart className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* View All Products Button */}
        <div className="text-center mt-16">
          <button className="btn-secondary">ดูสินค้าทั้งหมด</button>
        </div>
      </div>
    </section>
  );
}
