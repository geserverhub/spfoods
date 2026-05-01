import React from 'react';
import { Factory, Truck, Globe, Shield } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function Services() {
  const { t } = useLanguage();

  const services = [
    { icon: Factory, title: t.service1Title, description: t.service1Desc },
    { icon: Truck, title: t.service2Title, description: t.service2Desc },
    { icon: Globe, title: t.service3Title, description: t.service3Desc },
    { icon: Shield, title: t.service4Title, description: t.service4Desc },
  ];

  return (
    <section id="services" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="section-title">{t.servicesTitle}</h2>
          <p className="section-subtitle">{t.servicesSubtitle}</p>
        </div>

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
