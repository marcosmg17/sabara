
import React from 'react';
import { Link } from 'react-router-dom';
import { Hospital, Phone, Mail, MapPin } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-sabara-primary text-white pt-10 pb-6">
      <div className="container mx-auto px-4">
        <div className="row">
          
          <div className="w-full md:w-1/3 mb-6 md:mb-0 px-4">
            <div className="flex items-center mb-4">
              <Hospital className="h-8 w-8 mr-2" />
              <h3 className="text-xl font-bold">Smart Care</h3>
            </div>
            <p className="mb-4">
              Oferecendo cuidados de saúde de excelência com tecnologia e compaixão para toda a família.
            </p>
            <div className="flex items-center mb-3">
              <Phone size={18} className="mr-2" />
              <span>(11) 3003-1234</span>
            </div>
            <div className="flex items-center mb-3">
              <Mail size={18} className="mr-2" />
              <span>contato@smartcare.com.br</span>
            </div>
            <div className="flex items-center">
              <MapPin size={18} className="mr-2" />
              <span>Av. Paulista, 1000 - São Paulo, SP</span>
            </div>
          </div>
          
         
          <div className="w-full md:w-1/3 mb-6 md:mb-0 px-4">
            <h4 className="text-lg font-semibold mb-4">Links Úteis</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/servicos" className="hover:underline">Nossos Serviços</Link>
              </li>
              <li>
                <Link to="/sobre" className="hover:underline">Sobre o Hospital</Link>
              </li>
              <li>
                <Link to="/medicos" className="hover:underline">Equipe Médica</Link>
              </li>
              <li>
                <Link to="/contato" className="hover:underline">Fale Conosco</Link>
              </li>
              
            </ul>
          </div>
          
       
          <div className="w-full md:w-1/3 px-4">
            <h4 className="text-lg font-semibold mb-4">Serviços</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/servicos/triagem" className="hover:underline">Triagem Automatizada</Link>
              </li>
              <li>
                <Link to="/servicos/leitos" className="hover:underline">Gestão de Leitos</Link>
              </li>
              <li>
                <Link to="/servicos/comunicacao" className="hover:underline">Comunicação Digital</Link>
              </li>
            </ul>
          </div>
        </div>
        
       
        <div className="border-t border-sabara-secondary/30 mt-8 pt-6 text-center">
          <p>&copy; {new Date().getFullYear()} Smart Care. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
