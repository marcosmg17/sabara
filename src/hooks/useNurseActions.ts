import { useMutation, useQueryClient } from '@tanstack/react-query';
import { TriageEntry, TriageMeasurements } from '@/types/triage';
import { Nurse } from '@/types/nurse';
import { Doctor } from '@/types/doctor';
import { useToast } from '@/hooks/use-toast';
import { usePatientNotifications } from './usePatientNotifications';

export const useNurseActions = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { notifyPatient } = usePatientNotifications();

  // Assign nurse to triage
  const assignNurse = useMutation({
    mutationFn: async ({ triageId }: { triageId: number }) => {
      const currentNurses = JSON.parse(localStorage.getItem('nurses') || '[]') as Nurse[];
      const currentQueue = JSON.parse(localStorage.getItem('triageQueue') || '[]') as TriageEntry[];
      
      // Find available nurses
      const availableNurses = currentNurses.filter(nurse => nurse.available);
      
      if (availableNurses.length === 0) {
        throw new Error("No nurses available");
      }
      
      // Find the nurse with the fewest assigned patients
      let selectedNurse = availableNurses[0];
      let minPatients = Infinity;
      
      for (const nurse of availableNurses) {
        const patientCount = currentQueue.filter(t => 
          t.assignedNurse && t.assignedNurse.id === nurse.id
        ).length;
        
        if (patientCount < minPatients) {
          minPatients = patientCount;
          selectedNurse = nurse;
        }
      }
      
      // Update the triage entry
      const updatedQueue = currentQueue.map(triage => 
        triage.id === triageId ? {
          ...triage,
          assignedNurse: selectedNurse,
          status: 'nurse-triage'
        } : triage
      );
      
      localStorage.setItem('triageQueue', JSON.stringify(updatedQueue));
      
      // Get patient info to notify them
      const triage = updatedQueue.find(t => t.id === triageId);
      if (triage) {
        notifyPatient.mutate({
          patientId: triage.patientId,
          notification: {
            title: "Enfermeiro(a) designado(a)",
            message: `Enfermeiro(a) ${selectedNurse.name} irá realizar sua triagem. Por favor, aguarde ser chamado(a).`
          }
        });
      }
      
      return { nurseId: selectedNurse.id, triageId, triage: triage };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['triageQueue'] });
      toast({
        title: "Enfermeiro designado",
        description: "Um enfermeiro foi designado para realizar a triagem"
      });
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Não há enfermeiros disponíveis no momento",
        variant: "destructive"
      });
    }
  });

  // Update triage measurements
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
      const currentQueue = JSON.parse(localStorage.getItem('triageQueue') || '[]') as TriageEntry[];
      
      const updatedQueue = currentQueue.map(triage => 
        triage.id === triageId ? {
          ...triage,
          measurements,
          nurseNotes: notes || triage.nurseNotes
        } : triage
      );
      
      localStorage.setItem('triageQueue', JSON.stringify(updatedQueue));
      
      // Get patient info to notify them about their measurements
      const triage = updatedQueue.find(t => t.id === triageId);
      if (triage) {
        notifyPatient.mutate({
          patientId: triage.patientId,
          notification: {
            title: "Triagem atualizada",
            message: "Suas medições de sinais vitais foram registradas. Continue aguardando para o próximo passo do atendimento."
          }
        });
      }
      
      return { triageId, measurements };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['triageQueue'] });
      toast({
        title: "Medições atualizadas",
        description: "As medições foram salvas com sucesso"
      });
    }
  });

  // Complete nurse triage
  const completeNurseTriage = useMutation({
    mutationFn: async ({ triageId }: { triageId: number }) => {
      const currentQueue = JSON.parse(localStorage.getItem('triageQueue') || '[]') as TriageEntry[];
      const currentNurses = JSON.parse(localStorage.getItem('nurses') || '[]') as Nurse[];
      
      const triage = currentQueue.find(t => t.id === triageId);
      if (!triage) throw new Error("Triage not found");
      
      // Make nurse available again
      let updatedNurses = [...currentNurses];
      if (triage.assignedNurse) {
        updatedNurses = currentNurses.map(n => 
          n.id === triage.assignedNurse?.id ? { ...n, available: true } : n
        );
      }
      
      // Update triage status
      const updatedQueue = currentQueue.map(t => 
        t.id === triageId ? { ...t, assignedNurse: null, status: 'waiting' } : t
      );
      
      localStorage.setItem('nurses', JSON.stringify(updatedNurses));
      localStorage.setItem('triageQueue', JSON.stringify(updatedQueue));
      
      // Notify patient their triage is complete
      notifyPatient.mutate({
        patientId: triage.patientId,
        notification: {
          title: "Triagem de enfermagem concluída",
          message: "Sua triagem com o enfermeiro(a) foi concluída. Aguarde ser chamado(a) pelo médico."
        }
      });
      
      return { triageId, nurseId: triage.assignedNurse?.id };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['triageQueue'] });
      queryClient.invalidateQueries({ queryKey: ['nurses'] });
      toast({
        title: "Triagem finalizada",
        description: "A triagem de enfermagem foi concluída com sucesso"
      });
    }
  });

  // Send patient to doctor after triage
  const sendToDoctor = useMutation({
    mutationFn: async ({ triageId }: { triageId: number }) => {
      const currentQueue = JSON.parse(localStorage.getItem('triageQueue') || '[]') as TriageEntry[];
      const currentNurses = JSON.parse(localStorage.getItem('nurses') || '[]') as Nurse[];
      const currentDoctors = JSON.parse(localStorage.getItem('doctors') || '[]') as Doctor[];
      
      const triage = currentQueue.find(t => t.id === triageId);
      if (!triage) {
        throw new Error("Triage not found");
      }
      
      // Make nurse available again
      let updatedNurses = [...currentNurses];
      if (triage.assignedNurse) {
        updatedNurses = currentNurses.map(n => 
          n.id === triage.assignedNurse?.id ? { ...n, available: true } : n
        );
      }
      
      // Find available doctors
      const availableDoctors = currentDoctors.filter(doc => doc.available);
      
      // If there's an available doctor, assign the patient directly
      if (availableDoctors.length > 0) {
        // Find the doctor with the fewest assigned patients
        let selectedDoctor = availableDoctors[0];
        let minPatients = Infinity;
        
        for (const doctor of availableDoctors) {
          const patientCount = currentQueue.filter(t => 
            t.assignedDoctor && t.assignedDoctor.id === doctor.id
          ).length;
          
          if (patientCount < minPatients) {
            minPatients = patientCount;
            selectedDoctor = doctor;
          }
        }
        
        // Find a suitable room
        const availableRooms = ['Sala 1', 'Sala 2', 'Sala 3', 'Sala 4', 'Sala 5'];
        const usedRooms = currentQueue
          .filter(t => t.assignedRoom !== null)
          .map(t => t.assignedRoom);
        
        const availableRoom = availableRooms.find(room => !usedRooms.includes(room)) || 'Sala de Espera';
        
        // Update doctor availability
        const updatedDoctors = currentDoctors.map(doc => 
          doc.id === selectedDoctor.id ? { ...doc, available: false } : doc
        );
        
        // Update the triage entry
        const updatedQueue = currentQueue.map(t => 
          t.id === triageId ? {
            ...t,
            assignedDoctor: selectedDoctor,
            assignedNurse: null,
            status: 'assigned',
            assignedRoom: availableRoom
          } : t
        );
        
        localStorage.setItem('nurses', JSON.stringify(updatedNurses));
        localStorage.setItem('doctors', JSON.stringify(updatedDoctors));
        localStorage.setItem('triageQueue', JSON.stringify(updatedQueue));
        
        // Notify patient about the doctor assignment
        notifyPatient.mutate({
          patientId: triage.patientId,
          notification: {
            title: "Médico designado",
            message: `Dr(a). ${selectedDoctor.name} foi designado para seu atendimento. Por favor, dirija-se à ${availableRoom}.`
          }
        });
        
        return { 
          nurseId: triage.assignedNurse?.id, 
          triageId, 
          doctorAssigned: true,
          doctorId: selectedDoctor.id,
          room: availableRoom
        };
      } else {
        // No doctor available, just update nurse and keep patient waiting
        const updatedQueue = currentQueue.map(t => 
          t.id === triageId ? { ...t, assignedNurse: null, status: 'waiting' } : t
        );
        
        localStorage.setItem('nurses', JSON.stringify(updatedNurses));
        localStorage.setItem('triageQueue', JSON.stringify(updatedQueue));
        
        // Notify patient they are waiting for a doctor
        notifyPatient.mutate({
          patientId: triage.patientId,
          notification: {
            title: "Aguardando consulta médica",
            message: "Sua triagem de enfermagem foi concluída. Por favor, aguarde na sala de espera até ser chamado(a) pelo médico."
          }
        });
        
        return { 
          nurseId: triage.assignedNurse?.id, 
          triageId, 
          doctorAssigned: false 
        };
      }
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['triageQueue'] });
      queryClient.invalidateQueries({ queryKey: ['nurses'] });
      queryClient.invalidateQueries({ queryKey: ['doctors'] });
      
      if (data.doctorAssigned) {
        toast({
          title: "Paciente encaminhado ao médico",
          description: `O paciente foi encaminhado para ${data.room} com Dr(a) designado`
        });
      } else {
        toast({
          title: "Paciente aguardando médico",
          description: "O paciente foi colocado na fila de espera para médico"
        });
      }
    }
  });

  return {
    assignNurse,
    updateTriageMeasurements,
    completeNurseTriage,
    sendToDoctor
  };
};
