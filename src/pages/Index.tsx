
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Hero from '@/components/Hero';
import Services from '@/components/Services';
import TriageDemo from '@/components/TriageDemo';
import DigitalCommunication from '@/components/DigitalCommunication';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow pt-16">
        <Hero />
        <Services />
        <TriageDemo />
        <DigitalCommunication />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
