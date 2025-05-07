
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const Hero: React.FC = () => {
  return (
    <section className="pt-20 pb-10 bg-white overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center">
          
          <div className="md:w-1/2 mb-10 md:mb-0 md:pr-8">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4">
              Inovação em Saúde para o seu bem-estar
            </h1>
            <p className="text-lg md:text-xl text-gray-600 mb-8">
              Smart Care conecta tecnologia avançada e cuidado humanizado para oferecer a melhor experiência em saúde.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/servicos">
                <Button className="bg-sabara-primary hover:bg-sabara-primary/90 text-white px-6 py-2">
                  Conheça nossos serviços
                </Button>
              </Link>
              <Link to="/login">
                <Button variant="outline" className="border-sabara-primary text-sabara-primary hover:bg-sabara-primary hover:text-white px-6 py-2">
                  Área do Paciente
                </Button>
              </Link>
            </div>
          </div>
          
         
          <div className="md:w-1/2 relative">
            <div className="bg-sabara-secondary/30 rounded-lg p-4">
            <video 
                controls 
                autoPlay 
                loop 
                muted
                className="w-full h-auto rounded-lg shadow-xl"
              >
                <source src="/video.mp4" type="video/mp4" />
                Seu navegador não suporta o vídeo.
              </video>
              
              
              <div className="absolute -bottom-5 left-10 right-10 bg-white rounded-lg shadow-lg p-4 flex justify-between">
                <div className="text-center">
                  <p className="text-3xl font-bold text-sabara-primary">98%</p>
                  <p className="text-sm text-gray-600">Satisfação dos pacientes</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-sabara-primary">24h</p>
                  <p className="text-sm text-gray-600">Atendimento</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-sabara-primary">+200</p>
                  <p className="text-sm text-gray-600">Especialistas</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
