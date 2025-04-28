
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import StaffBedManagement from '@/components/StaffBedManagement';
import StaffTriageQueue from '@/components/StaffTriageQueue';
import ExamUpload from '@/components/ExamUpload';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { ListCheck, User, UserRound, File, ClipboardList } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import DoctorDashboard from '@/components/DoctorDashboard';
import DoctorPatientHistory from '@/components/DoctorPatientHistory';
import mockData from '@/data/mockData.json';
import { useToast } from "@/hooks/use-toast";

const StaffDashboard = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const userRole = localStorage.getItem('userRole');

  useEffect(() => {
    const isStaffLoggedIn = localStorage.getItem('staffLoggedIn') === 'true';
    if (!isStaffLoggedIn) {
      navigate('/staff-login');
    }

    queryClient.invalidateQueries({ queryKey: ['triageQueue'] });
    queryClient.invalidateQueries({ queryKey: ['beds'] });
    queryClient.invalidateQueries({ queryKey: ['doctors'] });
    
    const existingUsers = localStorage.getItem('users');
    if (!existingUsers || JSON.parse(existingUsers).length === 0) {
      localStorage.setItem('users', JSON.stringify(mockData.patients));
      console.log('Initialized users from mock data:', mockData.patients);
    }
  }, [navigate, queryClient]);

  const handleExamUpload = ({ userId, examName, file }: { userId: string; examName: string; file: File }) => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    console.log('Handling exam upload for user ID:', userId);
    console.log('All users:', users);
    
    const updatedUsers = users.map((user: any) => {
      if ((user.id && user.id.toString() === userId) || 
          (user.email && user.email === userId)) {
        console.log('Found user to update:', user);
        const examResults = user.examResults || [];
        examResults.unshift({
          id: Date.now(),
          name: examName,
          date: new Date().toISOString(),
          status: 'Disponível',
          pdfLink: URL.createObjectURL(file) 
        });
        return { ...user, examResults };
      }
      return user;
    });
    
    
    localStorage.setItem('users', JSON.stringify(updatedUsers));
    
   
    const currentUserStr = sessionStorage.getItem('currentUser');
    if (currentUserStr) {
      const currentUser = JSON.parse(currentUserStr);
      if ((currentUser.id && currentUser.id.toString() === userId) || 
          (currentUser.email === userId)) {
        const updatedUser = updatedUsers.find(u => 
          (u.id && u.id.toString() === userId) || (u.email === userId)
        );
        if (updatedUser) {
          sessionStorage.setItem('currentUser', JSON.stringify(updatedUser));
        }
      }
    }

    toast({
      title: "Sucesso",
      description: `Exame enviado para o paciente com sucesso`,
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow pt-16">
        <div className="container mx-auto px-4 py-8">
          {userRole === 'doctor' ? (
            
            <>
              <h1 className="text-3xl font-bold text-sabara-primary mb-8">Painel do Médico</h1>
              
              <Tabs defaultValue="assignedPatients" className="space-y-6">
                <TabsList>
                  <TabsTrigger value="assignedPatients" className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Pacientes Atribuídos
                  </TabsTrigger>
                  <TabsTrigger value="patientHistory" className="flex items-center gap-2">
                    <ClipboardList className="h-4 w-4" />
                    Histórico de Pacientes
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="assignedPatients">
                  <DoctorDashboard />
                </TabsContent>

                <TabsContent value="patientHistory">
                  <DoctorPatientHistory />
                </TabsContent>
              </Tabs>
            </>
          ) : (
            
            <>
              <h1 className="text-3xl font-bold text-sabara-primary mb-8">Painel de Funcionários</h1>
              
              <Tabs defaultValue="triage" className="space-y-6">
                <TabsList>
                  <TabsTrigger value="triage" className="flex items-center gap-2">
                    <ListCheck className="h-4 w-4" />
                    Fila de Triagem
                  </TabsTrigger>
                  <TabsTrigger value="beds" className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Gestão de Leitos
                  </TabsTrigger>
                  <TabsTrigger value="doctor" className="flex items-center gap-2">
                    <UserRound className="h-4 w-4" />
                    Painel de Médicos
                  </TabsTrigger>
                  <TabsTrigger value="exams" className="flex items-center gap-2">
                    <File className="h-4 w-4" />
                    Enviar Exames
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="triage">
                  <StaffTriageQueue />
                </TabsContent>

                <TabsContent value="beds">
                  <StaffBedManagement />
                </TabsContent>

                <TabsContent value="doctor">
                  <DoctorDashboard />
                </TabsContent>

                <TabsContent value="exams">
                  <ExamUpload onUpload={handleExamUpload} />
                </TabsContent>
              </Tabs>
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default StaffDashboard;
