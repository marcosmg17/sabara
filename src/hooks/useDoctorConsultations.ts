
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { Doctor } from '@/types/doctor';
import { TriageEntry } from '@/types/triage';

export const useDoctorConsultations = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const startPatientConsultation = useMutation({
    mutationFn: async (triageId: number) => {
      const currentQueue = queryClient.getQueryData(['triageQueue']) as TriageEntry[] || [];
      
      // Only allow starting consultation if triage measurements are complete
      const triage = currentQueue.find(t => t.id === triageId);
      if (triage && (!triage.measurements?.temperature && 
                     !triage.measurements?.heartRate && 
                     !triage.measurements?.bloodPressure && 
                     !triage.measurements?.oxygenSaturation && 
                     !triage.measurements?.glucoseLevel)) {
        throw new Error("Triage information not complete");
      }
      
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
    },
    onError: (error) => {
      toast({
        title: "Erro ao iniciar consulta",
        description: "Certifique-se de que a triagem de enfermagem foi realizada",
        variant: "destructive"
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
