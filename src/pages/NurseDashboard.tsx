
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import StaffTriageQueue from '@/components/StaffTriageQueue';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Stethoscope, ListCheck, User } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';

const NurseDashboard = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  useEffect(() => {
    const isLoggedIn = localStorage.getItem('staffLoggedIn') === 'true';
    const userRole = localStorage.getItem('userRole');
    
    if (!isLoggedIn) {
      navigate('/staff-login');
      return;
    }
    
    if (userRole !== 'nurse') {
      navigate('/staff-login');
      return;
    }
    
    localStorage.setItem('userRole', 'nurse');
    
    queryClient.invalidateQueries({ queryKey: ['triageQueue'] });
    queryClient.invalidateQueries({ queryKey: ['nurses'] });
    
    // Initialize nurses if not already done
    const nurses = localStorage.getItem('nurses');
    if (!nurses) {
      const initialNurses = [
        { id: 1, name: "Ana Silva", available: true, room: "Triagem 1" },
        { id: 2, name: "Carlos Oliveira", available: true, room: "Triagem 2" },
        { id: 3, name: "Lucia Santos", available: true, room: "Triagem 3" }
      ];
      localStorage.setItem('nurses', JSON.stringify(initialNurses));
    }
    
    // Set current nurse if not already done
    const currentNurse = localStorage.getItem('currentNurse');
    if (!currentNurse) {
      const nursesData = JSON.parse(localStorage.getItem('nurses') || '[]');
      if (nursesData.length > 0) {
        localStorage.setItem('currentNurse', JSON.stringify(nursesData[0]));
      }
    }
  }, [navigate, queryClient]);
  
  const nurse = JSON.parse(localStorage.getItem('currentNurse') || '{}');
  
  const handleLogout = () => {
    localStorage.removeItem('staffLoggedIn');
    localStorage.removeItem('userRole');
    localStorage.removeItem('currentNurse');
    navigate('/staff-login');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow pt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-sabara-primary">Painel de Enfermagem</h1>
            <button 
              onClick={handleLogout}
              className="px-4 py-2 border border-red-500 text-red-500 rounded hover:bg-red-50"
            >
              Sair
            </button>
          </div>
          
          <div className="mb-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Stethoscope className="h-5 w-5" />
                  Enfermeiro(a) de plantão
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-full bg-sabara-primary text-white flex items-center justify-center text-xl font-bold">
                    {nurse.name?.[0]}
                  </div>
                  <div className="ml-4">
                    <h3 className="font-medium">{nurse.name}</h3>
                    <p className="text-sm text-gray-600">{nurse.room && `Sala ${nurse.room}`}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Tabs defaultValue="triage">
            <TabsList className="mb-6">
              <TabsTrigger value="triage" className="flex items-center gap-2">
                <ListCheck className="h-4 w-4" />
                Fila de Triagem
              </TabsTrigger>
              <TabsTrigger value="patients" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Meus Pacientes
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="triage">
              <StaffTriageQueue />
            </TabsContent>
            
            <TabsContent value="patients">
              <Card>
                <CardHeader>
                  <CardTitle>Meus Pacientes em Triagem</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8 text-gray-500">
                    Você não tem pacientes atribuídos no momento.
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default NurseDashboard;
