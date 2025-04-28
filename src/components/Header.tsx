
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Hospital, Menu, X } from 'lucide-react';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="bg-white shadow-md fixed w-full top-0 z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-center space-x-2">
            <Hospital className="h-8 w-8 text-sabara-primary" />
            <span className="text-2xl font-bold text-sabara-primary">Sabara Health</span>
          </Link>
          
          <button 
            className="md:hidden text-gray-700 hover:text-sabara-primary focus:outline-none"
            onClick={toggleMenu}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          
          <nav className="hidden md:flex space-x-6 items-center">
            <Link to="/" className="text-gray-700 hover:text-sabara-primary font-medium">
              Início
            </Link>
            <Link to="/servicos" className="text-gray-700 hover:text-sabara-primary font-medium">
              Serviços
            </Link>
            <Link to="/sobre" className="text-gray-700 hover:text-sabara-primary font-medium">
              Sobre Nós
            </Link>
            <Link to="/contato" className="text-gray-700 hover:text-sabara-primary font-medium">
              Contato
            </Link>
            <Link to="/login">
              <Button variant="outline" className="border-sabara-primary text-sabara-primary hover:bg-sabara-primary hover:text-white transition-colors">
                Área do Paciente
              </Button>
            </Link>
            <Link to="/staff-login">
              <Button variant="outline" className="border-sabara-primary text-sabara-primary hover:bg-sabara-primary hover:text-white transition-colors">
                Área de Funcionários
              </Button>
            </Link>
          </nav>
        </div>
        
        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden bg-white rounded-b-lg shadow-lg mt-2 py-2">
            <Link to="/" className="block px-4 py-2 text-gray-700 hover:bg-sabara-secondary hover:text-sabara-primary">
              Início
            </Link>
            <Link to="/servicos" className="block px-4 py-2 text-gray-700 hover:bg-sabara-secondary hover:text-sabara-primary">
              Serviços
            </Link>
            <Link to="/sobre" className="block px-4 py-2 text-gray-700 hover:bg-sabara-secondary hover:text-sabara-primary">
              Sobre Nós
            </Link>
            <Link to="/contato" className="block px-4 py-2 text-gray-700 hover:bg-sabara-secondary hover:text-sabara-primary">
              Contato
            </Link>
            <Link to="/login" className="block px-4 py-2 text-sabara-primary font-medium hover:bg-sabara-secondary">
              Área do Paciente
            </Link>
            <Link to="/staff-login" className="block px-4 py-2 text-sabara-primary font-medium hover:bg-sabara-secondary">
              Área de Funcionários
            </Link>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
