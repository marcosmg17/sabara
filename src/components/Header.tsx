
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Hospital, Menu, X, Smartphone, QrCode } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <header className="bg-white shadow-lg fixed top-0 left-0 right-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/home" className="flex items-center space-x-2" onClick={closeMenu}>
            <Hospital className="h-8 w-8 text-sabara-primary" />
            <span className="text-xl font-bold text-sabara-primary">Smart Care</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link 
              to="/home" 
              className={`text-gray-700 hover:text-sabara-primary transition-colors ${
                location.pathname === '/home' ? 'text-sabara-primary font-semibold' : ''
              }`}
            >
              Início
            </Link>
            <Link 
              to="/servicos" 
              className={`text-gray-700 hover:text-sabara-primary transition-colors ${
                location.pathname === '/servicos' ? 'text-sabara-primary font-semibold' : ''
              }`}
            >
              Serviços
            </Link>
            <Link 
              to="/sobre" 
              className={`text-gray-700 hover:text-sabara-primary transition-colors ${
                location.pathname === '/sobre' ? 'text-sabara-primary font-semibold' : ''
              }`}
            >
              Sobre
            </Link>
            <Link 
              to="/contato" 
              className={`text-gray-700 hover:text-sabara-primary transition-colors ${
                location.pathname === '/contato' ? 'text-sabara-primary font-semibold' : ''
              }`}
            >
              Contato
            </Link>
            
            {/* Quick Access Buttons */}
            <div className="flex items-center space-x-2">
              <Button asChild size="sm" variant="outline">
                <Link to="/pre-triage">
                  <Smartphone className="w-4 h-4 mr-1" />
                  Pré-Triagem
                </Link>
              </Button>
              <Button asChild size="sm">
                <Link to="/">
                  Login
                </Link>
              </Button>
            </div>
          </nav>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2"
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <X className="h-6 w-6 text-gray-700" />
            ) : (
              <Menu className="h-6 w-6 text-gray-700" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <nav className="flex flex-col space-y-2">
              <Link 
                to="/home" 
                className={`py-2 px-4 text-gray-700 hover:text-sabara-primary transition-colors ${
                  location.pathname === '/home' ? 'text-sabara-primary font-semibold' : ''
                }`}
                onClick={closeMenu}
              >
                Início
              </Link>
              <Link 
                to="/servicos" 
                className={`py-2 px-4 text-gray-700 hover:text-sabara-primary transition-colors ${
                  location.pathname === '/servicos' ? 'text-sabara-primary font-semibold' : ''
                }`}
                onClick={closeMenu}
              >
                Serviços
              </Link>
              <Link 
                to="/sobre" 
                className={`py-2 px-4 text-gray-700 hover:text-sabara-primary transition-colors ${
                  location.pathname === '/sobre' ? 'text-sabara-primary font-semibold' : ''
                }`}
                onClick={closeMenu}
              >
                Sobre
              </Link>
              <Link 
                to="/contato" 
                className={`py-2 px-4 text-gray-700 hover:text-sabara-primary transition-colors ${
                  location.pathname === '/contato' ? 'text-sabara-primary font-semibold' : ''
                }`}
                onClick={closeMenu}
              >
                Contato
              </Link>
              
              <div className="px-4 pt-2 space-y-2">
                <Button asChild size="sm" variant="outline" className="w-full">
                  <Link to="/pre-triage" onClick={closeMenu}>
                    <Smartphone className="w-4 h-4 mr-2" />
                    Fazer Pré-Triagem
                  </Link>
                </Button>
                <Button asChild size="sm" className="w-full">
                  <Link to="/" onClick={closeMenu}>
                    Login
                  </Link>
                </Button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
