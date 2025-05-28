
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
import { useToast } from '@/hooks/use-toast';

const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState(null);
  const [triageHistory, setTriageHistory] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [examResults, setExamResults] = useState([]);
  const [notifications, setNotifications] = useState([]);

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

    // Load mock data for the patient
    setTriageHistory([
      {
        id: 1,
        date: new Date().toISOString(),
        symptoms: ['Febre', 'Dor de cabeça'],
        priority: 'Moderado',
        recommendation: 'Procurar atendimento médico em até 4 horas'
      }
    ]);

    setAppointments([
      {
        id: 1,
        date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        doctor: 'Dr. João Silva',
        specialty: 'Clínico Geral',
        status: 'Agendado'
      }
    ]);

    setExamResults([
      {
        id: 1,
        name: 'Hemograma Completo',
        date: new Date().toISOString(),
        status: 'Disponível',
        pdfLink: '#'
      }
    ]);

    setNotifications([
      {
        id: 1,
        date: new Date().toISOString(),
        title: 'Consulta agendada',
        message: 'Sua consulta foi agendada para amanhã às 14h',
        read: false
      }
    ]);
  }, [navigate]);

  const handleTriageSubmit = (triageData) => {
    // Add to triage history
    setTriageHistory(prev => [triageData, ...prev]);
    
    toast({
      title: "Pré-triagem enviada",
      description: "Sua pré-triagem foi registrada com sucesso",
    });
  };

  const handleMarkAsRead = (notificationId) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === notificationId 
          ? { ...notification, read: true }
          : notification
      )
    );
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  if (!user) {
    return <div className="flex items-center justify-center min-h-screen">Carregando...</div>;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow pt-16">
        <div className="container mx-auto px-4 py-8">
          <DashboardHeader userName={user.name} />
          
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
              <TriageForm onTriageSubmit={handleTriageSubmit} />
            </TabsContent>

            <TabsContent value="appointments">
              <AppointmentList appointments={appointments} />
            </TabsContent>

            <TabsContent value="exams">
              <ExamResults examResults={examResults} />
            </TabsContent>

            <TabsContent value="history">
              <TriageHistory triageHistory={triageHistory} />
            </TabsContent>

            <TabsContent value="notifications">
              <PatientNotifications 
                notifications={notifications}
                onMarkAsRead={handleMarkAsRead}
                formatDate={formatDate}
              />
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Dashboard;
