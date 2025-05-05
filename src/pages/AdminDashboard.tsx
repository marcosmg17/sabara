
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { UserRound, Users, ClipboardList, BookCheck, Bed } from 'lucide-react';
import StaffTriageQueue from '@/components/StaffTriageQueue';
import StaffBedManagement from '@/components/StaffBedManagement';

const AdminDashboard = () => {
  const navigate = useNavigate();
  
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
  }, [navigate]);
  
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
              <StaffTriageQueue />
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
                  <div className="text-center py-8 text-gray-500">
                    Gerenciamento de equipe em desenvolvimento.
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
                  <div className="text-center py-8 text-gray-500">
                    Gerenciamento de pacientes em desenvolvimento.
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
                  <div className="text-center py-8 text-gray-500">
                    Sistema de relatórios em desenvolvimento.
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
