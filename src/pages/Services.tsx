
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ServicesList from '@/components/ServicesList';

const Services = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow pt-16">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-sabara-primary mb-8">Nossos Serviços</h1>
          <ServicesList />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Services;
