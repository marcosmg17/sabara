
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Building, Users, Award, Heart } from 'lucide-react';

const About = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow pt-16">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-sabara-primary mb-8">Sobre Nós</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <div>
              <h2 className="text-2xl font-semibold mb-4">Nossa História</h2>
              <p className="text-gray-600 mb-4">
                A Smart Care é uma instituição de referência em saúde, com mais de 5 anos
                de experiência no atendimento de excelência. Nossa missão é proporcionar o melhor
                cuidado possível para nossos pacientes, combinando tecnologia de ponta com atendimento
                humanizado.
              </p>
            </div>
            <div>
              <img
                src="https://images.unsplash.com/photo-1518005020951-eccb494ad742"
                alt="Hospital Sabara"
                className="rounded-lg shadow-lg w-full h-64 object-cover"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <div className="p-6 bg-white rounded-lg shadow-md">
              <Building className="h-12 w-12 text-sabara-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">Infraestrutura Moderna</h3>
              <p className="text-gray-600">sistema de última geração.</p>
            </div>
            <div className="p-6 bg-white rounded-lg shadow-md">
              <Users className="h-12 w-12 text-sabara-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">Equipe Especializada</h3>
              <p className="text-gray-600">Profissionais altamente qualificados e dedicados.</p>
            </div>
            <div className="p-6 bg-white rounded-lg shadow-md">
              <Award className="h-12 w-12 text-sabara-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">Certificações</h3>
              <p className="text-gray-600">Reconhecimento nacional e internacional em qualidade.</p>
            </div>
            <div className="p-6 bg-white rounded-lg shadow-md">
              <Heart className="h-12 w-12 text-sabara-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">Atendimento Humanizado</h3>
              <p className="text-gray-600">Cuidado centrado no paciente e sua família.</p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default About;
