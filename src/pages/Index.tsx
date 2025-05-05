
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Hero from '@/components/Hero';
import Services from '@/components/Services';
import TriageDemo from '@/components/TriageDemo';
import BedManagement from '@/components/BedManagement';
import DigitalCommunication from '@/components/DigitalCommunication';
import QuickAccess from '@/components/QuickAccess';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow pt-16">
        <Hero />
        <QuickAccess />
        <Services />
        <TriageDemo />
        <BedManagement />
        <DigitalCommunication />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
