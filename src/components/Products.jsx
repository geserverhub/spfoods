import React from 'react';
import { ShoppingCart, Star } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function Products() {
  const { t } = useLanguage();

  const products = [
    { nameKey: 'prod1Name', catKey: 'catBrand', image: '🧊', rating: 4.9, reviews: 312 },
    { nameKey: 'prod2Name', catKey: 'catBrand', image: '🥩', rating: 4.8, reviews: 245 },
    { nameKey: 'prod3Name', catKey: 'catIntl',  image: '✈️', rating: 4.9, reviews: 198 },
    { nameKey: 'prod4Name', catKey: 'catIntl',  image: '🚢', rating: 4.8, reviews: 176 },
    { nameKey: 'prod5Name', catKey: 'catBrand', image: '🍱', rating: 5.0, reviews: 423 },
    { nameKey: 'prod6Name', catKey: 'catBrand', image: '🥫', rating: 4.7, reviews: 156 },
  ];

  return (
    <section id="products" className="scroll-mt-14 py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-light to-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="section-title">{t.productsTitle}</h2>
          <p className="section-subtitle">{t.productsSubtitle}</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {products.map((product, index) => (
            <div key={index} className="card group overflow-hidden">
              <div className="bg-gradient-to-br from-primary/10 to-accent/10 h-48 rounded-lg flex items-center justify-center mb-4 group-hover:from-primary/20 group-hover:to-accent/20 transition-all">
                <span className="text-7xl">{product.image}</span>
              </div>

              <span className="inline-block bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium mb-3">
                {t[product.catKey]}
              </span>

              <h3 className="text-xl font-bold text-dark mb-2">{t[product.nameKey]}</h3>

              <div className="flex items-center space-x-2 mb-3">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4" fill={i < Math.floor(product.rating) ? 'currentColor' : 'none'} />
                  ))}
                </div>
                <span className="text-sm text-gray-600">
                  {product.rating} ({product.reviews} {t.reviews})
                </span>
              </div>

              <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200">
                <p className="text-base font-bold text-primary">{t.contactForPrice}</p>
                <button className="p-2 bg-primary text-white rounded-full hover:bg-orange-600 transition-colors">
                  <ShoppingCart className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-16">
          <button className="btn-secondary">{t.viewAllProducts}</button>
        </div>
      </div>
    </section>
  );
}
