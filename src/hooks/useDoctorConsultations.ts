import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { TriageEntry, Doctor } from '@/types/doctor';

export const useDoctorConsultations = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const startPatientConsultation = useMutation({
    mutationFn: async (triageId: number) => {
      const currentQueue = queryClient.getQueryData(['triageQueue']) as TriageEntry[] || [];
      const updatedQueue = currentQueue.map(triage => 
        triage.id === triageId 
          ? { ...triage, status: 'in-progress' as const } 
          : triage
      );
      localStorage.setItem('triageQueue', JSON.stringify(updatedQueue));
      return triageId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['triageQueue'] });
      toast({
        title: "Consulta iniciada",
        description: "A consulta foi iniciada com sucesso"
      });
    }
  });

  const completePatientConsultation = useMutation({
    mutationFn: async (triageId: number) => {
      const currentQueue = queryClient.getQueryData(['triageQueue']) as TriageEntry[] || [];
      const currentDoctors = queryClient.getQueryData(['doctors']) as Doctor[] || [];
      
      const triage = currentQueue.find(t => t.id === triageId);
      
      let updatedDoctors = [...currentDoctors];
      if (triage?.assignedDoctor) {
        updatedDoctors = currentDoctors.map(d => 
          d.id === triage.assignedDoctor?.id ? { ...d, available: true } : d
        );
      }
      
      const updatedQueue = currentQueue.filter(t => t.id !== triageId);
      
      localStorage.setItem('triageQueue', JSON.stringify(updatedQueue));
      localStorage.setItem('doctors', JSON.stringify(updatedDoctors));
      
      return { triageId, doctorId: triage?.assignedDoctor?.id };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['triageQueue'] });
      queryClient.invalidateQueries({ queryKey: ['doctors'] });
      toast({
        title: "Consulta concluída",
        description: "A consulta foi concluída com sucesso"
      });
    }
  });

  return {
    startPatientConsultation,
    completePatientConsultation
  };
};
