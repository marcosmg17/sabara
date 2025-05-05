
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Hospital } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const StaffLogin = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [role, setRole] = useState<string>('staff');
  
  useEffect(() => {
    const isStaffLoggedIn = localStorage.getItem('staffLoggedIn') === 'true';
    const userRole = localStorage.getItem('userRole');
    
    if (isStaffLoggedIn) {
      switch (userRole) {
        case 'doctor':
          navigate('/staff-dashboard');
          break;
        case 'nurse':
          navigate('/nurse-dashboard');
          break;
        case 'admin':
          navigate('/admin-dashboard');
          break;
        default:
          navigate('/staff-dashboard');
      }
    }
  }, [navigate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simple validation
    if (!email || !password) {
      toast({
        title: "Erro",
        description: "Por favor, preencha todos os campos",
        variant: "destructive"
      });
      return;
    }
    
    // For demo purposes, accept any login credentials
    localStorage.setItem('staffLoggedIn', 'true');
    localStorage.setItem('userRole', role);
    
    // Set up mock data for different roles
    if (role === 'doctor') {
      const doctors = JSON.parse(localStorage.getItem('doctors') || '[]');
      if (doctors.length > 0) {
        localStorage.setItem('currentDoctor', JSON.stringify(doctors[0]));
      } else {
        const defaultDoctor = { id: 1, name: "Dr. Roberto Almeida", available: true, room: "101", specialty: "Clínico Geral" };
        localStorage.setItem('currentDoctor', JSON.stringify(defaultDoctor));
        localStorage.setItem('doctors', JSON.stringify([defaultDoctor]));
      }
      navigate('/staff-dashboard');
    } else if (role === 'nurse') {
      navigate('/nurse-dashboard');
    } else if (role === 'admin') {
      navigate('/admin-dashboard');
    } else {
      navigate('/staff-dashboard');
    }
    
    toast({
      title: "Login realizado",
      description: "Você foi conectado com sucesso",
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex justify-center mb-4">
            <div className="flex items-center space-x-2">
              <Hospital className="h-8 w-8 text-sabara-primary" />
              <span className="text-2xl font-bold text-sabara-primary">Sabara Health</span>
            </div>
          </div>
          <CardTitle className="text-center text-2xl font-bold">Portal de Funcionários</CardTitle>
          <CardDescription className="text-center">
            Entre com suas credenciais para acessar o sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="role">Perfil</Label>
              <Select value={role} onValueChange={setRole}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione seu perfil" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="doctor">Médico</SelectItem>
                  <SelectItem value="nurse">Enfermeiro</SelectItem>
                  <SelectItem value="staff">Funcionário</SelectItem>
                  <SelectItem value="admin">Administrador</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="exemplo@sabara.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Senha</Label>
                <a href="#" className="text-sm text-sabara-primary hover:underline">
                  Esqueceu a senha?
                </a>
              </div>
              <Input 
                id="password" 
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <Button type="submit" className="w-full bg-sabara-primary hover:bg-sabara-primary/90">
              Entrar
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default StaffLogin;
