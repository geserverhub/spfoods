import React from 'react';
import { CheckCircle } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function About() {
  const { t } = useLanguage();

  const features = [t.aboutFeature1, t.aboutFeature2, t.aboutFeature3, t.aboutFeature4];

  return (
    <section id="about" className="py-20 px-4 sm:px-6 lg:px-8 bg-light">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="relative">
            <div className="bg-gradient-to-br from-secondary to-primary rounded-3xl p-8 aspect-square flex items-center justify-center">
              <div className="text-center text-white space-y-3">
                <div className="text-6xl mb-4">🏭</div>
                <p className="text-xl font-bold">SP FOODS CO.,LTD</p>
                <p className="text-base font-semibold opacity-95">{t.brandTagline}</p>
              </div>
            </div>
          </div>

          <div>
            <h2 className="section-title">{t.aboutTitle}</h2>
            <p className="text-gray-700 text-lg font-medium leading-relaxed mb-6 whitespace-pre-line">{t.aboutDesc}</p>

            <div className="space-y-4 mb-8">
              {features.map((feature, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <CheckCircle className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                  <p className="text-gray-700 font-medium">{feature}</p>
                </div>
              ))}
            </div>

            <button className="btn-secondary">{t.learnMore}</button>
          </div>
        </div>
      </div>
    </section>
  );
}
