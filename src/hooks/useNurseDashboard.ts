
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/components/ui/use-toast';
import { useTriageQueue } from '@/hooks/useTriageQueue';
import { TriageEntry } from '@/types/triage';
import { Nurse, NurseStatus } from '@/types/nurse';

export const useNurseDashboard = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { triageQueue } = useTriageQueue();
  
  const [stats, setStats] = useState({
    waiting: 0,
    inProgress: 0,
    completed: 0,
    critical: 0
  });

  const [nurses, setNurses] = useState<Nurse[]>([]);
  const [currentNurse, setCurrentNurse] = useState<Nurse | null>(null);

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('staffLoggedIn') === 'true';
    const userRole = localStorage.getItem('userRole');
    
    // Verificar se o usuário é um paciente tentando acessar a área de enfermagem
    const currentUserStr = sessionStorage.getItem('currentUser');
    if (currentUserStr) {
      const currentUser = JSON.parse(currentUserStr);
      if (currentUser.role === 'patient') {
        // Redirecionar pacientes para o dashboard de pacientes
        toast({
          variant: "destructive",
          title: "Acesso negado",
          description: "Você não tem permissão para acessar a área de enfermagem.",
        });
        navigate('/dashboard');
        return;
      }
    }
    
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
    
    // Load nurses
    const nursesData = JSON.parse(localStorage.getItem('nurses') || '[]');
    setNurses(nursesData);
    
    // Set current nurse
    const currentNurseData = JSON.parse(localStorage.getItem('currentNurse') || 'null');
    if (currentNurseData) {
      setCurrentNurse(currentNurseData);
    } else if (nursesData.length > 0) {
      localStorage.setItem('currentNurse', JSON.stringify(nursesData[0]));
      setCurrentNurse(nursesData[0]);
    }
  }, [navigate, queryClient, toast]);

  // Update statistics when triageQueue changes
  useEffect(() => {
    if (triageQueue && triageQueue.length > 0) {
      const waitingCount = triageQueue.filter((t: TriageEntry) => t.status === 'waiting').length;
      const inProgressCount = triageQueue.filter((t: TriageEntry) => 
        t.status === 'nurse-triage' || t.status === 'assigned' || t.status === 'in-progress').length;
      const completedCount = triageQueue.filter((t: TriageEntry) => t.status === 'completed').length;
      const criticalCount = triageQueue.filter((t: TriageEntry) => t.priority === 'Crítico').length;
      
      setStats({
        waiting: waitingCount,
        inProgress: inProgressCount,
        completed: completedCount,
        critical: criticalCount
      });
    }
  }, [triageQueue]);

  const handleLogout = () => {
    localStorage.removeItem('staffLoggedIn');
    localStorage.removeItem('userRole');
    localStorage.removeItem('currentNurse');
    navigate('/staff-login');
  };

  const updateNurseStatus = (status: NurseStatus) => {
    if (!currentNurse) return;
    
    const updatedNurse = { ...currentNurse, status };
    
    // Update in local state
    setCurrentNurse(updatedNurse);
    
    // Update in localStorage
    localStorage.setItem('currentNurse', JSON.stringify(updatedNurse));
    
    // Update in nurses list
    const updatedNurses = nurses.map(nurse => 
      nurse.id === currentNurse.id ? updatedNurse : nurse
    );
    setNurses(updatedNurses);
    localStorage.setItem('nurses', JSON.stringify(updatedNurses));
    
    // Invalidate queries to trigger re-renders
    queryClient.invalidateQueries({ queryKey: ['nurses'] });
  };

  const updateNurseAvailability = (available: boolean) => {
    if (!currentNurse) return;
    
    const updatedNurse = { ...currentNurse, available };
    
    // Update in local state
    setCurrentNurse(updatedNurse);
    
    // Update in localStorage
    localStorage.setItem('currentNurse', JSON.stringify(updatedNurse));
    
    // Update in nurses list
    const updatedNurses = nurses.map(nurse => 
      nurse.id === currentNurse.id ? updatedNurse : nurse
    );
    setNurses(updatedNurses);
    localStorage.setItem('nurses', JSON.stringify(updatedNurses));
    
    // Invalidate queries to trigger re-renders
    queryClient.invalidateQueries({ queryKey: ['nurses'] });
  };

  return {
    stats,
    nurses,
    currentNurse,
    handleLogout,
    updateNurseStatus,
    updateNurseAvailability
  };
};
