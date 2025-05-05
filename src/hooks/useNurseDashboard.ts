
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/components/ui/use-toast';
import { useTriageQueue } from '@/hooks/useTriageQueue';
import { TriageEntry } from '@/types/triage';

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
  }, [navigate, queryClient, toast]);

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

  const nurse = JSON.parse(localStorage.getItem('currentNurse') || '{}');

  return {
    stats,
    nurse,
    handleLogout
  };
};
