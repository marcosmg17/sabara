
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { Doctor } from '@/types/doctor';
import { TriageEntry } from '@/types/triage';

export const useTriageActions = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const autoAssignDoctor = (currentDoctors: Doctor[], currentQueue: TriageEntry[]) => {
    // Find available doctors who are not assigned to any patients
    const availableDoctors = currentDoctors.filter(d => d.available);
    if (availableDoctors.length === 0) return null;

    // Get the first available doctor
    return availableDoctors[0];
  };

  const assignDoctor = useMutation({
    mutationFn: async ({ triageId }: { triageId: number }) => {
      const currentQueue = queryClient.getQueryData(['triageQueue']) as TriageEntry[] || [];
      const currentDoctors = queryClient.getQueryData(['doctors']) as Doctor[] || [];
      
      const doctor = autoAssignDoctor(currentDoctors, currentQueue);
      if (!doctor) throw new Error("No available doctors");
      
      // Update doctor availability
      const updatedDoctors = currentDoctors.map(d => 
        d.id === doctor.id ? { ...d, available: false } : d
      );
      
      // Update triage entry
      const updatedQueue = currentQueue.map(triage => 
        triage.id === triageId 
          ? { 
              ...triage, 
              assignedDoctor: doctor, 
              assignedRoom: doctor.room,
              status: 'assigned' 
            } 
          : triage
      );
      
      localStorage.setItem('triageQueue', JSON.stringify(updatedQueue));
      localStorage.setItem('doctors', JSON.stringify(updatedDoctors));
      
      return { triageId, doctor };
    },
    onSuccess: ({ doctor }) => {
      queryClient.invalidateQueries({ queryKey: ['triageQueue'] });
      queryClient.invalidateQueries({ queryKey: ['doctors'] });
      
      toast({
        title: "Paciente atribuído",
        description: `Paciente atribuído ao(à) ${doctor.name} na sala ${doctor.room}`,
      });
    },
    onError: (error) => {
      toast({
        title: "Erro na atribuição",
        description: "Não há médicos disponíveis no momento",
        variant: "destructive"
      });
    }
  });

  const toggleDoctorAvailability = useMutation({
    mutationFn: async ({ doctorId, available }: { doctorId: number, available: boolean }) => {
      const currentDoctors = queryClient.getQueryData(['doctors']) as Doctor[] || [];
      
      const updatedDoctors = currentDoctors.map(d => 
        d.id === doctorId ? { ...d, available } : d
      );
      
      localStorage.setItem('doctors', JSON.stringify(updatedDoctors));
      return { doctorId, available };
    },
    onSuccess: ({ available }) => {
      queryClient.invalidateQueries({ queryKey: ['doctors'] });
      
      toast({
        title: "Status atualizado",
        description: `Médico marcado como ${available ? 'disponível' : 'indisponível'}`,
      });
    }
  });

  const removeTriage = useMutation({
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
      
      const updatedQueue = currentQueue.filter(triage => triage.id !== triageId);
      
      localStorage.setItem('triageQueue', JSON.stringify(updatedQueue));
      localStorage.setItem('doctors', JSON.stringify(updatedDoctors));
      
      return { triageId, doctorId: triage?.assignedDoctor?.id };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['triageQueue'] });
      queryClient.invalidateQueries({ queryKey: ['doctors'] });
      
      toast({
        title: "Paciente removido da fila",
        description: "Triagem concluída com sucesso",
      });
    }
  });

  return {
    assignDoctor,
    removeTriage,
    toggleDoctorAvailability
  };
};
