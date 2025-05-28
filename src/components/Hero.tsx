
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, Smartphone, QrCode } from 'lucide-react';
import { Link } from 'react-router-dom';

const Hero = () => {
  return (
    <section className="relative bg-gradient-to-r from-sabara-primary to-sabara-secondary text-white py-20">
      <div className="container mx-auto px-4 text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-6">
          Smart Care Hospital
        </h1>
        <p className="text-xl md:text-2xl mb-8 text-sabara-secondary/90">
          Tecnologia e cuidado para uma experiência hospitalar única
        </p>
        <p className="text-lg mb-8 max-w-2xl mx-auto">
          Faça sua pré-triagem online antes de chegar ao hospital. 
          Receba um QR Code, realize check-in no totem e acompanhe seu atendimento em tempo real.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button 
            asChild 
            size="lg" 
            className="bg-white text-sabara-primary hover:bg-gray-100 text-lg px-8 py-3"
          >
            <Link to="/pre-triage">
              <Smartphone className="mr-2 h-5 w-5" />
              Fazer Pré-Triagem
            </Link>
          </Button>
          
          <Button 
            asChild 
            size="lg" 
            variant="outline" 
            className="border-white text-white hover:bg-white hover:text-sabara-primary text-lg px-8 py-3"
          >
            <Link to="/checkin">
              <QrCode className="mr-2 h-5 w-5" />
              Check-in Totem
            </Link>
          </Button>
        </div>
        
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
          <div className="bg-white/10 p-6 rounded-lg">
            <Smartphone className="h-12 w-12 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">1. Pré-Triagem Online</h3>
            <p className="text-sabara-secondary/90">Informe seus sintomas pelo celular</p>
          </div>
          <div className="bg-white/10 p-6 rounded-lg">
            <QrCode className="h-12 w-12 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">2. Check-in Rápido</h3>
            <p className="text-sabara-secondary/90">Escaneie o QR Code no totem</p>
          </div>
          <div className="bg-white/10 p-6 rounded-lg">
            <ArrowRight className="h-12 w-12 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">3. Acompanhamento</h3>
            <p className="text-sabara-secondary/90">Monitore seu status em tempo real</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
