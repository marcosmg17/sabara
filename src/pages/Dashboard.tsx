
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import TriageForm from '@/components/dashboard/TriageForm';
import TriageHistory from '@/components/dashboard/TriageHistory';
import AppointmentList from '@/components/dashboard/AppointmentList';
import ExamResults from '@/components/dashboard/ExamResults';
import PatientNotifications from '@/components/patient/PatientNotifications';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { FileText, Calendar, TestTube, Stethoscope, Bell, Smartphone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const currentUser = sessionStorage.getItem('currentUser');
    if (!currentUser) {
      navigate('/');
      return;
    }

    const userData = JSON.parse(currentUser);
    if (userData.role !== 'patient') {
      navigate('/');
      return;
    }

    setUser(userData);
  }, [navigate]);

  if (!user) {
    return <div className="flex items-center justify-center min-h-screen">Carregando...</div>;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow pt-16">
        <div className="container mx-auto px-4 py-8">
          <DashboardHeader user={user} />
          
          {/* Quick Actions */}
          <div className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button asChild size="lg" className="h-16 bg-sabara-primary hover:bg-sabara-primary/90">
              <Link to="/pre-triage">
                <Smartphone className="w-6 h-6 mr-3" />
                <div className="text-left">
                  <div className="font-semibold">Fazer Pré-Triagem</div>
                  <div className="text-sm opacity-90">Avalie seus sintomas online</div>
                </div>
              </Link>
            </Button>
            
            <Button asChild size="lg" variant="outline" className="h-16">
              <Link to="/tracking">
                <Stethoscope className="w-6 h-6 mr-3" />
                <div className="text-left">
                  <div className="font-semibold">Acompanhar Atendimento</div>
                  <div className="text-sm opacity-70">Veja o status da sua consulta</div>
                </div>
              </Link>
            </Button>
          </div>

          <Tabs defaultValue="triage" className="space-y-6">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="triage" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                <span className="hidden sm:inline">Triagem</span>
              </TabsTrigger>
              <TabsTrigger value="appointments" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span className="hidden sm:inline">Consultas</span>
              </TabsTrigger>
              <TabsTrigger value="exams" className="flex items-center gap-2">
                <TestTube className="h-4 w-4" />
                <span className="hidden sm:inline">Exames</span>
              </TabsTrigger>
              <TabsTrigger value="history" className="flex items-center gap-2">
                <Stethoscope className="h-4 w-4" />
                <span className="hidden sm:inline">Histórico</span>
              </TabsTrigger>
              <TabsTrigger value="notifications" className="flex items-center gap-2">
                <Bell className="h-4 w-4" />
                <span className="hidden sm:inline">Avisos</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="triage">
              <TriageForm />
            </TabsContent>

            <TabsContent value="appointments">
              <AppointmentList />
            </TabsContent>

            <TabsContent value="exams">
              <ExamResults />
            </TabsContent>

            <TabsContent value="history">
              <TriageHistory />
            </TabsContent>

            <TabsContent value="notifications">
              <PatientNotifications />
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Dashboard;
