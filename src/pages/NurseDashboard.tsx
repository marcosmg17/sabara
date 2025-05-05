
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import StaffTriageQueue from '@/components/StaffTriageQueue';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Stethoscope, ListCheck, User, Activity, BellRing } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import { useTriageQueue } from '@/hooks/useTriageQueue';
import { Badge } from '@/components/ui/badge';

const NurseDashboard = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { triageQueue } = useTriageQueue();
  const [stats, setStats] = useState({
    waiting: 0,
    inProgress: 0,
    completed: 0,
    critical: 0
  });
  
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
  
  useEffect(() => {
    if (triageQueue && triageQueue.length > 0) {
      const waitingCount = triageQueue.filter(t => t.status === 'waiting').length;
      const inProgressCount = triageQueue.filter(t => t.status === 'nurse-triage' || t.status === 'assigned' || t.status === 'in-progress').length;
      const completedCount = triageQueue.filter(t => t.status === 'completed').length;
      const criticalCount = triageQueue.filter(t => t.priority === 'Crítico').length;
      
      setStats({
        waiting: waitingCount,
        inProgress: inProgressCount,
        completed: completedCount,
        critical: criticalCount
      });
    }
  }, [triageQueue]);
  
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
          
          <div className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-6">
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
                    <Badge className="mt-1 bg-green-500">{nurse.available ? 'Disponível' : 'Em atendimento'}</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Resumo de Operações
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-blue-100 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-blue-700">{stats.waiting}</div>
                    <div className="text-sm text-blue-700">Aguardando</div>
                  </div>
                  <div className="bg-yellow-100 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-yellow-700">{stats.inProgress}</div>
                    <div className="text-sm text-yellow-700">Em Atendimento</div>
                  </div>
                  <div className="bg-green-100 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-green-700">{stats.completed}</div>
                    <div className="text-sm text-green-700">Concluídos</div>
                  </div>
                  <div className="bg-red-100 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-red-700">{stats.critical}</div>
                    <div className="text-sm text-red-700">Casos Críticos</div>
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
              <TabsTrigger value="notifications" className="flex items-center gap-2">
                <BellRing className="h-4 w-4" />
                Notificações
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
            
            <TabsContent value="notifications">
              <Card>
                <CardHeader>
                  <CardTitle>Notificações</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-3 bg-blue-50 border-l-4 border-blue-500 rounded">
                      <div className="font-medium">Novo protocolo de triagem</div>
                      <p className="text-sm text-gray-600">Um novo protocolo de triagem foi implementado. Por favor, revise as diretrizes atualizadas.</p>
                    </div>
                    <div className="p-3 bg-yellow-50 border-l-4 border-yellow-500 rounded">
                      <div className="font-medium">Alerta de ocupação</div>
                      <p className="text-sm text-gray-600">A capacidade da sala de espera está em 80%. Favor agilizar o processo de triagem.</p>
                    </div>
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
