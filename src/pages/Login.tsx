
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginForm from '@/components/LoginForm';
import { Hospital } from 'lucide-react';

const Login = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is already logged in
    const currentUser = sessionStorage.getItem('currentUser');
    if (currentUser) {
      navigate('/dashboard');
    }
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-6">
          <div className="flex items-center space-x-2">
            <Hospital className="h-8 w-8 text-sabara-primary" />
            <span className="text-2xl font-bold text-sabara-primary">Sabara Health</span>
          </div>
        </div>
        <LoginForm />
        <p className="mt-8 text-center text-sm text-gray-500">
          Ao fazer login, você concorda com os{' '}
          <a href="#" className="text-sabara-primary hover:underline">
            Termos de Uso
          </a>{' '}
          e{' '}
          <a href="#" className="text-sabara-primary hover:underline">
            Política de Privacidade
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;
