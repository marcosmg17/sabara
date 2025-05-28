
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Hospital, User, UserCheck, Stethoscope, Home } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Link } from 'react-router-dom';
import mockData from '@/data/mockData.json';

const Login = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userType, setUserType] = useState('patient');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const currentUser = sessionStorage.getItem('currentUser');
    const staffLoggedIn = localStorage.getItem('staffLoggedIn');
    
    if (currentUser || staffLoggedIn) {
      const user = currentUser ? JSON.parse(currentUser) : null;
      const userRole = localStorage.getItem('userRole');
      
      if (user?.role === 'patient') {
        navigate('/dashboard');
      } else if (staffLoggedIn && userRole) {
        switch (userRole) {
          case 'nurse':
            navigate('/nurse-dashboard');
            break;
          case 'doctor':
            navigate('/staff-dashboard');
            break;
          case 'admin':
            navigate('/admin-dashboard');
            break;
          default:
            navigate('/staff-dashboard');
        }
      }
    }
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      if (userType === 'patient') {
        const user = mockData.patients.find(
          (patient) => patient.email === email && patient.password === password
        );

        if (user) {
          const userWithRole = { ...user, role: 'patient' };
          sessionStorage.setItem('currentUser', JSON.stringify(userWithRole));
          
          toast({
            title: "Login realizado com sucesso!",
            description: `Bem-vindo(a), ${user.name}!`,
          });
          
          navigate('/dashboard');
        } else {
          toast({
            variant: "destructive",
            title: "Erro ao fazer login",
            description: "Email ou senha incorretos.",
          });
        }
      } else {
        // Staff login - accept any credentials for demo
        localStorage.setItem('staffLoggedIn', 'true');
        localStorage.setItem('userRole', userType);
        
        if (userType === 'nurse') {
          const defaultNurse = { 
            id: 1, 
            name: "Enfermeira Maria Silva", 
            available: true, 
            status: 'available',
            sector: "Triagem" 
          };
          localStorage.setItem('currentNurse', JSON.stringify(defaultNurse));
          navigate('/nurse-dashboard');
        } else if (userType === 'doctor') {
          const defaultDoctor = { 
            id: 1, 
            name: "Dr. Roberto Almeida", 
            available: true, 
            room: "101", 
            specialty: "Clínico Geral" 
          };
          localStorage.setItem('currentDoctor', JSON.stringify(defaultDoctor));
          navigate('/staff-dashboard');
        } else if (userType === 'admin') {
          navigate('/admin-dashboard');
        }
        
        toast({
          title: "Login realizado",
          description: "Você foi conectado com sucesso",
        });
      }
      
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen relative overflow-hidden flex flex-col justify-center items-center p-4">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-sabara-primary via-sabara-secondary to-blue-600">
        <div className="absolute inset-0 opacity-30">
          {/* Floating circles animation */}
          <div className="absolute top-10 left-10 w-20 h-20 bg-white rounded-full opacity-20 animate-pulse"></div>
          <div className="absolute top-32 right-20 w-16 h-16 bg-white rounded-full opacity-15 animate-bounce"></div>
          <div className="absolute bottom-20 left-32 w-24 h-24 bg-white rounded-full opacity-10 animate-pulse delay-1000"></div>
          <div className="absolute bottom-32 right-10 w-12 h-12 bg-white rounded-full opacity-25 animate-bounce delay-500"></div>
          
          {/* Wave animation */}
          <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-white/10 to-transparent animate-pulse"></div>
          
          {/* Light rays */}
          <div className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-white/20 via-transparent to-white/20 animate-pulse delay-300"></div>
          <div className="absolute top-0 right-1/3 w-px h-full bg-gradient-to-b from-white/15 via-transparent to-white/15 animate-pulse delay-700"></div>
        </div>
      </div>

      {/* Header with navigation */}
      <div className="absolute top-4 right-4 z-10">
        <Button asChild variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
          <Link to="/home">
            <Home className="h-4 w-4 mr-2" />
            Página Inicial
          </Link>
        </Button>
      </div>

      {/* Login Card */}
      <div className="w-full max-w-md relative z-10">
        <div className="flex justify-center mb-6">
          <div className="flex items-center space-x-2 bg-white/10 p-4 rounded-full backdrop-blur-sm">
            <Hospital className="h-12 w-12 text-white" />
            <span className="text-3xl font-bold text-white">Smart Care</span>
          </div>
        </div>
        
        <Card className="shadow-2xl bg-white/95 backdrop-blur-sm border-0">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-2xl text-sabara-primary">Acesso ao Sistema</CardTitle>
            <p className="text-gray-600">Faça login para continuar</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="userType">Tipo de Usuário</Label>
                <Select value={userType} onValueChange={setUserType}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="patient">
                      <div className="flex items-center">
                        <User className="h-4 w-4 mr-2" />
                        Paciente
                      </div>
                    </SelectItem>
                    <SelectItem value="nurse">
                      <div className="flex items-center">
                        <UserCheck className="h-4 w-4 mr-2" />
                        Enfermeiro(a)
                      </div>
                    </SelectItem>
                    <SelectItem value="doctor">
                      <div className="flex items-center">
                        <Stethoscope className="h-4 w-4 mr-2" />
                        Médico(a)
                      </div>
                    </SelectItem>
                    <SelectItem value="admin">
                      <div className="flex items-center">
                        <Hospital className="h-4 w-4 mr-2" />
                        Administrador
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
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
            </form>

            {userType === 'patient' && (
              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <h4 className="font-semibold text-blue-800 mb-2">Paciente Demo:</h4>
                <p className="text-sm text-blue-700">Email: joao.silva@email.com</p>
                <p className="text-sm text-blue-700">Senha: 123456</p>
              </div>
            )}

            {userType !== 'patient' && (
              <div className="mt-6 p-4 bg-green-50 rounded-lg">
                <h4 className="font-semibold text-green-800 mb-2">Acesso Staff:</h4>
                <p className="text-sm text-green-700">Use qualquer email e senha para demonstração</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;
