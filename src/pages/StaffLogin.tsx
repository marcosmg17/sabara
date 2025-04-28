import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import mockData from '../data/mockData.json';

const StaffLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const doctorsWithAuth = mockData.doctors.map((doctor: any) => ({
      ...doctor,
      email: `${doctor.name.toLowerCase().replace(/dr\.|dra\./g, '').trim().replace(/\s+/g, '.')}@sabarahealth.com`,
      password: 'doctor123',
      room: `${Math.floor(Math.random() * 5) + 1}0${Math.floor(Math.random() * 9) + 1}`,
      available: true
    }));
    
    localStorage.setItem('doctors', JSON.stringify(doctorsWithAuth));
    console.log('Doctors initialized with auth credentials:', doctorsWithAuth);
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (email === 'staff@sabarahealth.com' && password === 'staff123') {
      localStorage.setItem('staffLoggedIn', 'true');
      localStorage.setItem('userRole', 'staff');
      toast({
        title: "Login realizado com sucesso",
        description: "Bem-vindo à área de funcionários",
      });
      navigate('/staff-dashboard');
      return;
    }
    
    const doctors = JSON.parse(localStorage.getItem('doctors') || '[]');
    
    console.log('Attempting doctor login with:', { email, password });
    console.log('Available doctors:', doctors);
    
    const doctor = doctors.find((d: any) => 
      d.email && d.email.toLowerCase() === email.toLowerCase() && 
      d.password === password
    );
    
    if (doctor) {
      localStorage.setItem('staffLoggedIn', 'true');
      localStorage.setItem('userRole', 'doctor');
      localStorage.setItem('currentDoctor', JSON.stringify(doctor));
      toast({
        title: "Login realizado com sucesso",
        description: "Bem-vindo, Dr(a). " + doctor.name.split(' ')[0],
      });
      navigate('/staff-dashboard');
      return;
    }

    toast({
      variant: "destructive",
      title: "Erro no login",
      description: "Credenciais inválidas",
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow pt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-md mx-auto">
            <h1 className="text-2xl font-bold text-center mb-6">Área de Funcionários</h1>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-1">
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium mb-1">
                  Senha
                </label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full">
                Entrar
              </Button>
            </form>
            
            
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default StaffLogin;
