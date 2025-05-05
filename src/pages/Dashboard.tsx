
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import ExamResults from '@/components/dashboard/ExamResults';
import TriageHistory from '@/components/dashboard/TriageHistory';
import TriageForm from '@/components/dashboard/TriageForm';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { FileText, User, ClipboardList } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

interface Patient {
  id: number;
  name: string;
  age?: number;
  gender?: string;
  email: string;
  examResults: any[];
  triageHistory: any[];
}

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<Patient | null>(null);

  useEffect(() => {
    const currentUserStr = sessionStorage.getItem('currentUser');
    
    if (!currentUserStr) {
      navigate('/login');
      return;
    }
    
    try {
      const currentUser = JSON.parse(currentUserStr);
      setUser(currentUser);
    } catch (error) {
      console.error('Error parsing user data', error);
      sessionStorage.removeItem('currentUser');
      navigate('/login');
    }
  }, [navigate]);

  const handleTriageSubmit = (triageData: any) => {
    if (user) {
      // Add patient info to triage data
      const triageWithUserInfo = {
        ...triageData,
        patientName: user.name,
        patientAge: user.age || 30,
        patientGender: user.gender || 'Não informado',
        patientId: user.id
      };
      
      // Update user's triage history
      const updatedUser = {
        ...user,
        triageHistory: [triageWithUserInfo, ...(user.triageHistory || [])]
      };
      sessionStorage.setItem('currentUser', JSON.stringify(updatedUser));
      setUser(updatedUser);
      
      // Add to global triage queue
      const currentQueue = JSON.parse(localStorage.getItem('triageQueue') || '[]');
      localStorage.setItem('triageQueue', JSON.stringify([triageWithUserInfo, ...currentQueue]));
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-sabara-primary"></div>
      </div>
    );
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50 pt-16">
        <DashboardHeader userName={user.name.split(' ')[0]} />
        
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-end mb-6">
            <Button asChild variant="outline" className="flex items-center gap-2 border-sabara-primary text-sabara-primary">
              <Link to="/patient-history">
                <ClipboardList className="h-4 w-4" />
                Ver Histórico Completo
              </Link>
            </Button>
          </div>
          
          <div className="md:hidden mb-6">
            <Tabs defaultValue="triage">
              <TabsList className="w-full">
                <TabsTrigger value="triage" className="flex-1">
                  <User className="h-4 w-4 mr-2" /> Triagem
                </TabsTrigger>
                <TabsTrigger value="exams" className="flex-1">
                  <FileText className="h-4 w-4 mr-2" /> Exames
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="triage" className="mt-4 space-y-6">
                <TriageForm onTriageSubmit={handleTriageSubmit} />
                <TriageHistory triageHistory={user.triageHistory || []} />
              </TabsContent>
              
              <TabsContent value="exams" className="mt-4">
                <ExamResults examResults={user.examResults || []} />
              </TabsContent>
            </Tabs>
          </div>
          
          <div className="hidden md:grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-6">
              <TriageForm onTriageSubmit={handleTriageSubmit} />
              <TriageHistory triageHistory={user.triageHistory || []} />
            </div>
            
            <div>
              <ExamResults examResults={user.examResults || []} />
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Dashboard;
