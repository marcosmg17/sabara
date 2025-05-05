
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { Nurse } from '@/types/nurse';
import { TriageEntry, TriageMeasurements } from '@/types/triage';

export const useNurseActions = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const autoAssignNurse = (currentNurses: Nurse[], currentQueue: TriageEntry[]) => {
    const availableNurses = currentNurses.filter(n => n.available && n.status === 'available');
    if (availableNurses.length === 0) return null;
    return availableNurses[0];
  };

  const assignNurse = useMutation({
    mutationFn: async ({ triageId, nurseId }: { triageId: number, nurseId?: number }) => {
      const currentQueue = queryClient.getQueryData(['triageQueue']) as TriageEntry[] || [];
      const currentNurses = queryClient.getQueryData(['nurses']) as Nurse[] || [];
      
      let nurse;
      if (nurseId) {
        nurse = currentNurses.find(n => n.id === nurseId);
      } else {
        nurse = autoAssignNurse(currentNurses, currentQueue);
      }
      
      if (!nurse) throw new Error("No available nurses");
      
      const updatedNurses = currentNurses.map(n => 
        n.id === nurse!.id ? { ...n, available: false, status: 'busy' } : n
      );
      
      const updatedQueue = currentQueue.map(triage => 
        triage.id === triageId 
          ? { 
              ...triage, 
              assignedNurse: nurse, 
              status: 'nurse-triage' 
            } 
          : triage
      );
      
      localStorage.setItem('triageQueue', JSON.stringify(updatedQueue));
      localStorage.setItem('nurses', JSON.stringify(updatedNurses));
      
      // Update current nurse if this was the currently logged in nurse
      const currentNurse = JSON.parse(localStorage.getItem('currentNurse') || 'null');
      if (currentNurse && currentNurse.id === nurse.id) {
        localStorage.setItem('currentNurse', JSON.stringify({ ...currentNurse, available: false, status: 'busy' }));
      }
      
      return { triageId, nurse };
    },
    onSuccess: ({ nurse }) => {
      queryClient.invalidateQueries({ queryKey: ['triageQueue'] });
      queryClient.invalidateQueries({ queryKey: ['nurses'] });
      
      toast({
        title: "Paciente atribuído à enfermagem",
        description: `Paciente atribuído ao(à) enfermeiro(a) ${nurse.name}`,
      });
    },
    onError: (error) => {
      toast({
        title: "Erro na atribuição",
        description: "Não há enfermeiros disponíveis no momento",
        variant: "destructive"
      });
    }
  });

  const updateTriageMeasurements = useMutation({
    mutationFn: async ({ 
      triageId, 
      measurements, 
      notes 
    }: { 
      triageId: number, 
      measurements: TriageMeasurements,
      notes?: string
    }) => {
      const currentQueue = queryClient.getQueryData(['triageQueue']) as TriageEntry[] || [];
      
      const updatedQueue = currentQueue.map(triage => 
        triage.id === triageId 
          ? { 
              ...triage,
              measurements: { ...triage.measurements, ...measurements },
              nurseNotes: notes || triage.nurseNotes
            } 
          : triage
      );
      
      localStorage.setItem('triageQueue', JSON.stringify(updatedQueue));
      
      return { triageId };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['triageQueue'] });
      
      toast({
        title: "Triagem atualizada",
        description: "As medições e notas foram salvas com sucesso",
      });
    }
  });

  const completeNurseTriage = useMutation({
    mutationFn: async ({ triageId }: { triageId: number }) => {
      const currentQueue = queryClient.getQueryData(['triageQueue']) as TriageEntry[] || [];
      const currentNurses = queryClient.getQueryData(['nurses']) as Nurse[] || [];
      
      const triage = currentQueue.find(t => t.id === triageId);
      
      let updatedNurses = [...currentNurses];
      if (triage?.assignedNurse) {
        updatedNurses = currentNurses.map(n => 
          n.id === triage.assignedNurse?.id ? { ...n, available: true, status: 'available' } : n
        );
      }
      
      const updatedQueue = currentQueue.map(t => 
        t.id === triageId ? { ...t, status: 'waiting' } : t
      );
      
      localStorage.setItem('triageQueue', JSON.stringify(updatedQueue));
      localStorage.setItem('nurses', JSON.stringify(updatedNurses));
      
      // Update current nurse if this was the currently logged in nurse
      const currentNurse = JSON.parse(localStorage.getItem('currentNurse') || 'null');
      if (currentNurse && triage?.assignedNurse && currentNurse.id === triage.assignedNurse.id) {
        localStorage.setItem('currentNurse', JSON.stringify({ ...currentNurse, available: true, status: 'available' }));
      }
      
      return { triageId };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['triageQueue'] });
      queryClient.invalidateQueries({ queryKey: ['nurses'] });
      
      toast({
        title: "Triagem de enfermagem concluída",
        description: "O paciente está pronto para atendimento médico",
      });
    }
  });

  return {
    assignNurse,
    updateTriageMeasurements,
    completeNurseTriage
  };
};
