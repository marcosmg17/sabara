
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { 
  UserRound, 
  Users, 
  ClipboardList, 
  BookCheck, 
  Bed, 
  LayoutDashboard, 
  Square 
} from 'lucide-react';
import StaffTriageQueue from '@/components/StaffTriageQueue';
import StaffBedManagement from '@/components/StaffBedManagement';
import { useTriageQueue, statusLabels } from '@/hooks/useTriageQueue';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { triageQueue } = useTriageQueue();
  const [stats, setStats] = useState({
    waiting: 0,
    inProgress: 0,
    completed: 0,
    critical: 0,
    beds: { total: 20, occupied: 0, available: 0 }
  });
  
  useEffect(() => {
    const isLoggedIn = localStorage.getItem('staffLoggedIn') === 'true';
    const userRole = localStorage.getItem('userRole');
    
    if (!isLoggedIn) {
      navigate('/staff-login');
      return;
    }
    
    if (userRole !== 'admin') {
      navigate('/staff-login');
      return;
    }
    
    localStorage.setItem('userRole', 'admin');

    // Calculate stats
    const waitingCount = triageQueue.filter(t => t.status === 'waiting').length;
    const inProgressCount = triageQueue.filter(t => ['nurse-triage', 'assigned', 'in-progress'].includes(t.status)).length;
    const completedCount = triageQueue.filter(t => t.status === 'completed').length;
    const criticalCount = triageQueue.filter(t => t.priority === 'Crítico').length;
    
    // Get bed data from localStorage
    const bedsData = JSON.parse(localStorage.getItem('beds') || '[]');
    const totalBeds = bedsData.length || 20;
    const occupiedBeds = bedsData.filter((bed: any) => bed.status === 'occupied').length;
    
    setStats({
      waiting: waitingCount,
      inProgress: inProgressCount,
      completed: completedCount,
      critical: criticalCount,
      beds: {
        total: totalBeds,
        occupied: occupiedBeds,
        available: totalBeds - occupiedBeds
      }
    });
  }, [navigate, triageQueue]);
  
  const handleLogout = () => {
    localStorage.removeItem('staffLoggedIn');
    localStorage.removeItem('userRole');
    navigate('/staff-login');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow pt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-sabara-primary">Painel Administrativo</h1>
            <button 
              onClick={handleLogout}
              className="px-4 py-2 border border-red-500 text-red-500 rounded hover:bg-red-50"
            >
              Sair
            </button>
          </div>
          
          {/* Dashboard Overview */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <LayoutDashboard className="h-5 w-5" />
              Visão Geral
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="bg-blue-50 border-blue-200">
                <CardContent className="p-6">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm font-medium text-blue-600">Pacientes Aguardando</p>
                      <p className="text-3xl font-bold">{stats.waiting}</p>
                    </div>
                    <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <ClipboardList className="h-6 w-6 text-blue-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-amber-50 border-amber-200">
                <CardContent className="p-6">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm font-medium text-amber-600">Em Atendimento</p>
                      <p className="text-3xl font-bold">{stats.inProgress}</p>
                    </div>
                    <div className="h-12 w-12 bg-amber-100 rounded-full flex items-center justify-center">
                      <UserRound className="h-6 w-6 text-amber-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-green-50 border-green-200">
                <CardContent className="p-6">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm font-medium text-green-600">Atendimentos Concluídos</p>
                      <p className="text-3xl font-bold">{stats.completed}</p>
                    </div>
                    <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center">
                      <BookCheck className="h-6 w-6 text-green-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-red-50 border-red-200">
                <CardContent className="p-6">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm font-medium text-red-600">Casos Críticos</p>
                      <p className="text-3xl font-bold">{stats.critical}</p>
                    </div>
                    <div className="h-12 w-12 bg-red-100 rounded-full flex items-center justify-center">
                      <Square className="h-6 w-6 text-red-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Bed Status */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Bed className="h-5 w-5" />
              Status dos Leitos
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-6">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm font-medium">Leitos Total</p>
                      <p className="text-3xl font-bold">{stats.beds.total}</p>
                    </div>
                    <div className="h-12 w-12 bg-gray-100 rounded-full flex items-center justify-center">
                      <Bed className="h-6 w-6 text-gray-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="border-red-200">
                <CardContent className="p-6">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm font-medium text-red-600">Leitos Ocupados</p>
                      <p className="text-3xl font-bold">{stats.beds.occupied}</p>
                    </div>
                    <div className="h-12 w-12 bg-red-100 rounded-full flex items-center justify-center">
                      <Bed className="h-6 w-6 text-red-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="border-green-200">
                <CardContent className="p-6">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm font-medium text-green-600">Leitos Disponíveis</p>
                      <p className="text-3xl font-bold">{stats.beds.available}</p>
                    </div>
                    <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center">
                      <Bed className="h-6 w-6 text-green-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
          
          <Tabs defaultValue="triage">
            <TabsList className="mb-6">
              <TabsTrigger value="triage" className="flex items-center gap-2">
                <ClipboardList className="h-4 w-4" />
                Fila de Triagem
              </TabsTrigger>
              <TabsTrigger value="beds" className="flex items-center gap-2">
                <Bed className="h-4 w-4" />
                Gestão de Leitos
              </TabsTrigger>
              <TabsTrigger value="staff" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Equipe
              </TabsTrigger>
              <TabsTrigger value="patients" className="flex items-center gap-2">
                <UserRound className="h-4 w-4" />
                Pacientes
              </TabsTrigger>
              <TabsTrigger value="reports" className="flex items-center gap-2">
                <BookCheck className="h-4 w-4" />
                Relatórios
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="triage">
              <ResizablePanelGroup direction="horizontal" className="rounded-lg border">
                <ResizablePanel defaultSize={30}>
                  <div className="flex h-full flex-col">
                    <div className="bg-gradient-to-r from-sabara-primary to-sabara-secondary text-white p-4">
                      <h3 className="font-medium">Status da Triagem</h3>
                    </div>
                    <div className="space-y-4 p-4">
                      {Object.entries(statusLabels).map(([key, label]) => {
                        const count = triageQueue.filter(t => t.status === key).length;
                        return (
                          <div key={key} className="flex justify-between items-center">
                            <span className="text-sm font-medium">{label}</span>
                            <span className="text-sm bg-gray-100 px-2 py-1 rounded-full">{count}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </ResizablePanel>
                <ResizableHandle />
                <ResizablePanel defaultSize={70}>
                  <StaffTriageQueue />
                </ResizablePanel>
              </ResizablePanelGroup>
            </TabsContent>
            
            <TabsContent value="beds">
              <StaffBedManagement />
            </TabsContent>
            
            <TabsContent value="staff">
              <Card>
                <CardHeader>
                  <CardTitle>Gerenciamento de Equipe</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6">
                    <Card className="shadow-md">
                      <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 pb-2">
                        <CardTitle className="text-lg">Médicos</CardTitle>
                        <CardDescription>Status e disponibilidade</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="p-4">
                          <div className="flex justify-between mb-2">
                            <span className="font-semibold">Total:</span>
                            <span>8</span>
                          </div>
                          <div className="flex justify-between mb-2">
                            <span className="font-semibold">Disponíveis:</span>
                            <span>5</span>
                          </div>
                          <div className="flex justify-between mb-2">
                            <span className="font-semibold">Em atendimento:</span>
                            <span>3</span>
                          </div>
                          <Sheet>
                            <SheetTrigger className="mt-4 w-full text-center text-sm px-4 py-2 border border-blue-500 text-blue-500 rounded hover:bg-blue-50">
                              Ver detalhes
                            </SheetTrigger>
                            <SheetContent>
                              <h3 className="text-lg font-semibold mb-4">Lista de Médicos</h3>
                              <div className="text-center py-8 text-gray-500">
                                Lista detalhada em desenvolvimento.
                              </div>
                            </SheetContent>
                          </Sheet>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card className="shadow-md">
                      <CardHeader className="bg-gradient-to-r from-green-50 to-green-100 pb-2">
                        <CardTitle className="text-lg">Enfermeiros</CardTitle>
                        <CardDescription>Status e disponibilidade</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="p-4">
                          <div className="flex justify-between mb-2">
                            <span className="font-semibold">Total:</span>
                            <span>12</span>
                          </div>
                          <div className="flex justify-between mb-2">
                            <span className="font-semibold">Disponíveis:</span>
                            <span>7</span>
                          </div>
                          <div className="flex justify-between mb-2">
                            <span className="font-semibold">Em atendimento:</span>
                            <span>5</span>
                          </div>
                          <Sheet>
                            <SheetTrigger className="mt-4 w-full text-center text-sm px-4 py-2 border border-green-500 text-green-500 rounded hover:bg-green-50">
                              Ver detalhes
                            </SheetTrigger>
                            <SheetContent>
                              <h3 className="text-lg font-semibold mb-4">Lista de Enfermeiros</h3>
                              <div className="text-center py-8 text-gray-500">
                                Lista detalhada em desenvolvimento.
                              </div>
                            </SheetContent>
                          </Sheet>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="patients">
              <Card>
                <CardHeader>
                  <CardTitle>Gerenciamento de Pacientes</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-3 gap-4">
                    <Card className="shadow-md">
                      <CardHeader className="bg-blue-50 pb-2">
                        <CardTitle className="text-lg">Pacientes Registrados</CardTitle>
                      </CardHeader>
                      <CardContent className="p-4">
                        <div className="text-center">
                          <div className="text-3xl font-bold">142</div>
                          <div className="text-sm text-gray-500">Total de pacientes</div>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card className="shadow-md">
                      <CardHeader className="bg-amber-50 pb-2">
                        <CardTitle className="text-lg">Consultas Hoje</CardTitle>
                      </CardHeader>
                      <CardContent className="p-4">
                        <div className="text-center">
                          <div className="text-3xl font-bold">28</div>
                          <div className="text-sm text-gray-500">Consultas realizadas</div>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card className="shadow-md">
                      <CardHeader className="bg-purple-50 pb-2">
                        <CardTitle className="text-lg">Exames Pendentes</CardTitle>
                      </CardHeader>
                      <CardContent className="p-4">
                        <div className="text-center">
                          <div className="text-3xl font-bold">16</div>
                          <div className="text-sm text-gray-500">Aguardando resultados</div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                  
                  <div className="mt-6 text-center">
                    <button className="px-4 py-2 border border-sabara-primary text-sabara-primary rounded hover:bg-sabara-50">
                      Ver Lista Completa
                    </button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="reports">
              <Card>
                <CardHeader>
                  <CardTitle>Relatórios</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6 mb-6">
                    <Card className="shadow-md">
                      <CardHeader className="bg-gradient-to-r from-purple-50 to-purple-100 pb-2">
                        <CardTitle className="text-lg">Estatísticas de Atendimentos</CardTitle>
                      </CardHeader>
                      <CardContent className="p-4">
                        <div className="grid grid-cols-2 gap-2">
                          <div className="bg-purple-50 p-3 rounded-md">
                            <div className="text-sm text-purple-800">Hoje</div>
                            <div className="text-2xl font-bold">28</div>
                          </div>
                          <div className="bg-blue-50 p-3 rounded-md">
                            <div className="text-sm text-blue-800">Esta semana</div>
                            <div className="text-2xl font-bold">142</div>
                          </div>
                          <div className="bg-green-50 p-3 rounded-md">
                            <div className="text-sm text-green-800">Este mês</div>
                            <div className="text-2xl font-bold">687</div>
                          </div>
                          <div className="bg-amber-50 p-3 rounded-md">
                            <div className="text-sm text-amber-800">Total</div>
                            <div className="text-2xl font-bold">2548</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card className="shadow-md">
                      <CardHeader className="bg-gradient-to-r from-amber-50 to-amber-100 pb-2">
                        <CardTitle className="text-lg">Tempo Médio de Atendimento</CardTitle>
                      </CardHeader>
                      <CardContent className="p-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <div className="text-sm font-medium mb-1">Triagem</div>
                            <div className="text-xl font-bold">12 min</div>
                          </div>
                          <div>
                            <div className="text-sm font-medium mb-1">Consulta</div>
                            <div className="text-xl font-bold">24 min</div>
                          </div>
                          <div>
                            <div className="text-sm font-medium mb-1">Exames</div>
                            <div className="text-xl font-bold">35 min</div>
                          </div>
                          <div>
                            <div className="text-sm font-medium mb-1">Total</div>
                            <div className="text-xl font-bold">71 min</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                  
                  <div className="mt-6 flex flex-wrap gap-3 justify-center">
                    <button className="px-4 py-2 border border-sabara-primary text-sabara-primary rounded hover:bg-sabara-50">
                      Relatório Completo
                    </button>
                    <button className="px-4 py-2 border border-purple-500 text-purple-500 rounded hover:bg-purple-50">
                      Exportar Dados
                    </button>
                    <button className="px-4 py-2 border border-green-500 text-green-500 rounded hover:bg-green-50">
                      Análise de Desempenho
                    </button>
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

export default AdminDashboard;
