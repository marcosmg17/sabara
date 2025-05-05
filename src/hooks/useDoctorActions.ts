
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { Doctor } from '@/types/doctor';
import { TriageEntry } from '@/types/triage';

export const useDoctorActions = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const autoAssignDoctor = (currentDoctors: Doctor[], currentQueue: TriageEntry[]) => {
    const availableDoctors = currentDoctors.filter(d => d.available);
    if (availableDoctors.length === 0) return null;
    return availableDoctors[0];
  };

  const assignDoctor = useMutation({
    mutationFn: async ({ triageId }: { triageId: number }) => {
      const currentQueue = queryClient.getQueryData(['triageQueue']) as TriageEntry[] || [];
      const currentDoctors = queryClient.getQueryData(['doctors']) as Doctor[] || [];
      
      const doctor = autoAssignDoctor(currentDoctors, currentQueue);
      if (!doctor) throw new Error("No available doctors");
      
      const updatedDoctors = currentDoctors.map(d => 
        d.id === doctor.id ? { ...d, available: false } : d
      );
      
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
        title: "Paciente atribuído ao médico",
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
      
      const updatedDoctors = currentDoctors.map(doctor => 
        doctor.id === doctorId ? { ...doctor, available } : doctor
      );
      
      localStorage.setItem('doctors', JSON.stringify(updatedDoctors));
      
      return { doctorId, available };
    },
    onSuccess: ({ available }) => {
      queryClient.invalidateQueries({ queryKey: ['doctors'] });
      
      toast({
        title: `Status do médico atualizado`,
        description: `Médico agora está ${available ? 'disponível' : 'indisponível'} para atendimento`,
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
    toggleDoctorAvailability,
    removeTriage
  };
};
