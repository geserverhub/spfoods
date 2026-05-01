import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  const navigation = [
    { name: 'หน้าแรก', href: '#hero' },
    { name: 'บริการ', href: '#services' },
    { name: 'ผลิตภัณฑ์', href: '#products' },
    { name: 'เกี่ยวกับเรา', href: '#about' },
    { name: 'ติดต่อ', href: '#contact' }
  ];

  return (
    <header className="fixed w-full top-0 z-50 bg-white shadow-md">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <span className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              SP Foods
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-8">
            {navigation.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="text-gray-700 hover:text-primary transition-colors font-medium"
              >
                {item.name}
              </a>
            ))}
          </div>

          {/* CTA Button */}
          <div className="hidden md:block">
            <button className="btn-primary">สั่งสินค้า</button>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden inline-flex items-center justify-center p-2"
          >
            {isOpen ? (
              <X className="h-6 w-6 text-dark" />
            ) : (
              <Menu className="h-6 w-6 text-dark" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden pb-4 space-y-2">
            {navigation.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="block px-3 py-2 text-gray-700 hover:bg-light rounded-lg transition-colors"
                onClick={() => setIsOpen(false)}
              >
                {item.name}
              </a>
            ))}
            <button className="btn-primary w-full mt-4">สั่งสินค้า</button>
          </div>
        )}
      </nav>
    </header>
  );
}
