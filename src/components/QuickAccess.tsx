
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { User, Users, Stethoscope, Shield } from 'lucide-react';

const QuickAccess = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handlePatientLogin = () => {
    // Login como paciente
    const user = {
      id: 1,
      name: "Maria Silva",
      email: "maria.silva@email.com",
      password: "senha123",
      age: 35,
      gender: "Feminino",
      examResults: [],
      triageHistory: []
    };
    sessionStorage.setItem('currentUser', JSON.stringify(user));
    toast({
      title: "Login realizado com sucesso!",
      description: `Bem-vindo(a), ${user.name}!`,
    });
    navigate('/dashboard');
  };

  const handleStaffLogin = (role: string) => {
    // Login como funcionário
    localStorage.setItem('staffLoggedIn', 'true');
    localStorage.setItem('userRole', role);
    
    if (role === 'doctor') {
      const doctor = { id: 1, name: "Dr. Roberto Almeida", available: true, room: "101", specialty: "Clínico Geral" };
      localStorage.setItem('currentDoctor', JSON.stringify(doctor));
      navigate('/staff-dashboard');
    } else if (role === 'nurse') {
      const nurse = { id: 1, name: "Ana Silva", available: true, room: "Triagem 1" };
      localStorage.setItem('currentNurse', JSON.stringify(nurse));
      navigate('/nurse-dashboard');
    } else if (role === 'admin') {
      navigate('/admin-dashboard');
    } else {
      navigate('/staff-dashboard');
    }
    
    toast({
      title: `Login como ${role} realizado!`,
      description: `Você entrou no sistema como ${getRoleName(role)}.`,
    });
  };
  
  const getRoleName = (role: string) => {
    switch (role) {
      case 'doctor': return 'Médico';
      case 'nurse': return 'Enfermeiro';
      case 'admin': return 'Administrador';
      default: return 'Funcionário';
    }
  };

  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-8 text-sabara-primary">Acesso Rápido ao Sistema</h2>
        <p className="text-center text-gray-600 mb-8 max-w-2xl mx-auto">
          Para facilitar os testes, você pode acessar o sistema com as contas demonstrativas abaixo.
          Clique em um dos botões para entrar automaticamente no painel correspondente.
        </p>
        
        <div className="max-w-5xl mx-auto">
          <Tabs defaultValue="patients" className="w-full">
            <TabsList className="grid grid-cols-4 mb-8">
              <TabsTrigger value="patients" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Pacientes
              </TabsTrigger>
              <TabsTrigger value="doctors" className="flex items-center gap-2">
                <Stethoscope className="h-4 w-4" />
                Médicos
              </TabsTrigger>
              <TabsTrigger value="nurses" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Enfermeiros
              </TabsTrigger>
              <TabsTrigger value="admin" className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Admin
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="patients">
              <Card>
                <CardHeader>
                  <CardTitle>Área do Paciente</CardTitle>
                  <CardDescription>
                    Acesse como paciente para visualizar exames, histórico médico e fazer triagem online.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="border rounded p-4">
                        <h3 className="font-medium mb-2">Maria Silva</h3>
                        <p className="text-sm text-gray-500 mb-1">Email: maria.silva@email.com</p>
                        <p className="text-sm text-gray-500">Senha: senha123</p>
                        <Button 
                          onClick={handlePatientLogin}
                          className="mt-4 w-full bg-sabara-primary hover:bg-sabara-primary/90"
                        >
                          Entrar como Maria
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="border-t pt-4">
                  <p className="text-xs text-gray-500">
                    Os dados são apenas para demonstração e serão reiniciados periodicamente.
                  </p>
                </CardFooter>
              </Card>
            </TabsContent>
            
            <TabsContent value="doctors">
              <Card>
                <CardHeader>
                  <CardTitle>Área do Médico</CardTitle>
                  <CardDescription>
                    Acesse como médico para gerenciar pacientes, consultas e prescrições.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="border rounded p-4">
                        <h3 className="font-medium mb-2">Dr. Roberto Almeida</h3>
                        <p className="text-sm text-gray-500 mb-1">Especialidade: Clínico Geral</p>
                        <p className="text-sm text-gray-500">Sala: 101</p>
                        <Button 
                          onClick={() => handleStaffLogin('doctor')}
                          className="mt-4 w-full bg-blue-600 hover:bg-blue-700"
                        >
                          Entrar como Dr. Roberto
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="border-t pt-4">
                  <p className="text-xs text-gray-500">
                    Acesso para demonstração do painel médico.
                  </p>
                </CardFooter>
              </Card>
            </TabsContent>
            
            <TabsContent value="nurses">
              <Card>
                <CardHeader>
                  <CardTitle>Área de Enfermagem</CardTitle>
                  <CardDescription>
                    Acesse como enfermeiro(a) para gerenciar triagens e acompanhar pacientes.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="border rounded p-4">
                        <h3 className="font-medium mb-2">Ana Silva</h3>
                        <p className="text-sm text-gray-500 mb-1">Sala: Triagem 1</p>
                        <Button 
                          onClick={() => handleStaffLogin('nurse')}
                          className="mt-4 w-full bg-teal-600 hover:bg-teal-700"
                        >
                          Entrar como Ana
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="border-t pt-4">
                  <p className="text-xs text-gray-500">
                    Acesso para demonstração do painel de enfermagem.
                  </p>
                </CardFooter>
              </Card>
            </TabsContent>
            
            <TabsContent value="admin">
              <Card>
                <CardHeader>
                  <CardTitle>Área Administrativa</CardTitle>
                  <CardDescription>
                    Acesse como administrador para gerenciar o hospital, equipes e recursos.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="border rounded p-4">
                        <h3 className="font-medium mb-2">Admin</h3>
                        <p className="text-sm text-gray-500 mb-1">Acesso total ao sistema</p>
                        <Button 
                          onClick={() => handleStaffLogin('admin')}
                          className="mt-4 w-full bg-purple-600 hover:bg-purple-700"
                        >
                          Entrar como Admin
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="border-t pt-4">
                  <p className="text-xs text-gray-500">
                    Acesso para demonstração do painel administrativo.
                  </p>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </section>
  );
};

export default QuickAccess;
