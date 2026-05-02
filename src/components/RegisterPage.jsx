import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import RegisterModal from './RegisterModal';

export default function RegisterPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="pt-16">
        <RegisterModal onClose={() => navigate('/')} />
      </main>
      <Footer />
    </div>
  );
}
