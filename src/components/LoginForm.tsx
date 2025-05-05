
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Hospital, User } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import mockData from '../data/mockData.json';

const LoginForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    // Log available patient credentials to console for reference
    console.log('Available patients for login:', mockData.patients.map(p => ({ email: p.email, password: p.password })));
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

   
    setTimeout(() => {
      const user = mockData.patients.find(
        (patient) => patient.email === email && patient.password === password
      );

      if (user) {
        // Especificamente marcar como tipo paciente
        const userWithRole = { ...user, role: 'patient' };
        
        // Salvar no sessionStorage
        sessionStorage.setItem('currentUser', JSON.stringify(userWithRole));
        
        toast({
          title: "Login realizado com sucesso!",
          description: `Bem-vindo(a) de volta, ${user.name}!`,
        });
        
        navigate('/dashboard');
      } else {
        toast({
          variant: "destructive",
          title: "Erro ao fazer login",
          description: "Email ou senha incorretos. Por favor, tente novamente.",
        });
      }
      
      setIsLoading(false);
    }, 1500);
  };

  return (
    <Card className="w-full max-w-md mx-auto shadow-lg">
      <CardHeader className="space-y-1 flex flex-col items-center">
        <div className="bg-sabara-primary rounded-full p-3 mb-2">
          <User className="h-6 w-6 text-white" />
        </div>
        <CardTitle className="text-2xl text-center">Área do Paciente</CardTitle>
        <CardDescription className="text-center">
          Faça login para acessar sua conta e gerenciar seus dados de saúde.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <form onSubmit={handleLogin}>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="seuemail@exemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
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
                required
              />
            </div>
            <Button 
              type="submit" 
              className="w-full bg-sabara-primary hover:bg-sabara-primary/90" 
              disabled={isLoading}
            >
              {isLoading ? "Entrando..." : "Entrar"}
            </Button>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex flex-col space-y-4 border-t pt-4">
        <div className="text-center text-sm">
          <span className="text-gray-500">Não tem uma conta? </span>
          <a href="#" className="text-sabara-primary hover:underline">
            Cadastre-se
          </a>
        </div>
        <div className="flex items-center justify-center">
          <Hospital className="h-5 w-5 text-sabara-primary mr-1" />
          <span className="text-xs text-gray-500">Sabara Health Connect</span>
        </div>
      </CardFooter>
    </Card>
  );
};

export default LoginForm;
