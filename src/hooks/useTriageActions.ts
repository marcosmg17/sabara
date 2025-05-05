import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { Doctor } from '@/types/doctor';
import { Nurse } from '@/types/nurse';
import { TriageEntry, TriageMeasurements } from '@/types/triage';

export const useTriageActions = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const autoAssignNurse = (currentNurses: Nurse[], currentQueue: TriageEntry[]) => {
    const availableNurses = currentNurses.filter(n => n.available);
    if (availableNurses.length === 0) return null;
    return availableNurses[0];
  };

  const autoAssignDoctor = (currentDoctors: Doctor[], currentQueue: TriageEntry[]) => {
    const availableDoctors = currentDoctors.filter(d => d.available);
    if (availableDoctors.length === 0) return null;
    return availableDoctors[0];
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
        n.id === nurse!.id ? { ...n, available: false } : n
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
          n.id === triage.assignedNurse?.id ? { ...n, available: true } : n
        );
      }
      
      const updatedQueue = currentQueue.map(t => 
        t.id === triageId ? { ...t, status: 'waiting' } : t
      );
      
      localStorage.setItem('triageQueue', JSON.stringify(updatedQueue));
      localStorage.setItem('nurses', JSON.stringify(updatedNurses));
      
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

  const assignToUTI = useMutation({
    mutationFn: async ({ triageId, bedId }: { triageId: number, bedId: string }) => {
      const currentQueue = queryClient.getQueryData(['triageQueue']) as TriageEntry[] || [];
      const currentBeds = queryClient.getQueryData(['beds']) as any[] || [];
      
      const triage = currentQueue.find(t => t.id === triageId);
      
      // Update bed status to occupied
      const updatedBeds = currentBeds.map(bed => 
        bed.id === bedId ? { ...bed, status: 'occupied', patient: triage?.patientName } : bed
      );
      
      const updatedQueue = currentQueue.map(t => 
        t.id === triageId ? { ...t, status: 'uti', assignedRoom: bedId } : t
      );
      
      localStorage.setItem('triageQueue', JSON.stringify(updatedQueue));
      localStorage.setItem('beds', JSON.stringify(updatedBeds));
      
      return { triageId, bedId };
    },
    onSuccess: ({ bedId }) => {
      queryClient.invalidateQueries({ queryKey: ['triageQueue'] });
      queryClient.invalidateQueries({ queryKey: ['beds'] });
      
      toast({
        title: "Paciente encaminhado para UTI",
        description: `Paciente alocado ao leito ${bedId}`,
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

  return {
    assignNurse,
    assignDoctor,
    updateTriageMeasurements,
    completeNurseTriage,
    assignToUTI,
    removeTriage,
    toggleDoctorAvailability
  };
};
