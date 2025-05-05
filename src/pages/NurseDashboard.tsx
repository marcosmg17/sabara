
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import StaffTriageQueue from '@/components/StaffTriageQueue';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { ListCheck, User, BellRing } from 'lucide-react';
import { useNurseDashboard } from '@/hooks/useNurseDashboard';
import NurseInfoCard from '@/components/nurse/NurseInfoCard';
import OperationsSummaryCard from '@/components/nurse/OperationsSummaryCard';
import NursePatients from '@/components/nurse/NursePatients';
import NurseNotifications from '@/components/nurse/NurseNotifications';

const NurseDashboard = () => {
  const { stats, nurse, handleLogout } = useNurseDashboard();

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
            <NurseInfoCard nurse={nurse} />
            <OperationsSummaryCard stats={stats} />
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
              <NursePatients />
            </TabsContent>
            
            <TabsContent value="notifications">
              <NurseNotifications />
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default NurseDashboard;
