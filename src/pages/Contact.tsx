
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ContactForm from '@/components/ContactForm';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';

const Contact = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow pt-16">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-2xl md:text-3xl font-bold text-sabara-primary mb-6 md:mb-8 text-center md:text-left">
            Fale Conosco
          </h1>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
            <div className="order-2 lg:order-1">
              <h2 className="text-xl md:text-2xl font-semibold mb-4 md:mb-6">Informações de Contato</h2>
              
              <div className="space-y-4 md:space-y-6">
                <div className="flex items-start space-x-3 md:space-x-4">
                  <MapPin className="h-5 w-5 md:h-6 md:w-6 text-sabara-primary mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold">Endereço</h3>
                    <p className="text-gray-600">Av. Paulista, 1000</p>
                    <p className="text-gray-600">São Paulo, SP - 01310-100</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3 md:space-x-4">
                  <Phone className="h-5 w-5 md:h-6 md:w-6 text-sabara-primary mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold">Telefone</h3>
                    <p className="text-gray-600">(11) 3003-1234</p>
                    <p className="text-gray-600">0800 123 4567 (Emergências)</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3 md:space-x-4">
                  <Mail className="h-5 w-5 md:h-6 md:w-6 text-sabara-primary mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold">Email</h3>
                    <p className="text-gray-600">contato@sabarahealth.com.br</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3 md:space-x-4">
                  <Clock className="h-5 w-5 md:h-6 md:w-6 text-sabara-primary mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold">Horário de Atendimento</h3>
                    <p className="text-gray-600">24 horas por dia</p>
                    <p className="text-gray-600">7 dias por semana</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="order-1 lg:order-2">
              <ContactForm />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Contact;
