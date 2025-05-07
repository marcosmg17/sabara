
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Doctor } from '@/types/doctor';
import { TriageEntry } from '@/types/triage';
import { useToast } from '@/hooks/use-toast';
import { usePatientNotifications } from './usePatientNotifications';

export const useDoctorActions = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { notifyPatient } = usePatientNotifications();

  const assignDoctor = useMutation({
    mutationFn: async ({ triageId }: { triageId: number }) => {
      const currentDoctors = JSON.parse(localStorage.getItem('doctors') || '[]') as Doctor[];
      const currentQueue = JSON.parse(localStorage.getItem('triageQueue') || '[]') as TriageEntry[];
      
      // Find available doctors
      const availableDoctors = currentDoctors.filter(doc => doc.available);
      if (availableDoctors.length === 0) {
        throw new Error("No doctors available");
      }
      
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
      
      // Assign doctor and update doctor's availability
      const updatedDoctors = currentDoctors.map(doc => 
        doc.id === selectedDoctor.id ? { ...doc, available: false } : doc
      );
      
      // Find a suitable room
      const availableRooms = ['Sala 1', 'Sala 2', 'Sala 3', 'Sala 4', 'Sala 5'];
      const usedRooms = currentQueue
        .filter(t => t.assignedRoom !== null)
        .map(t => t.assignedRoom);
      
      const availableRoom = availableRooms.find(room => !usedRooms.includes(room)) || 'Sala de Espera';
      
      // Update the triage entry
      const updatedQueue = currentQueue.map(triage => 
        triage.id === triageId ? {
          ...triage,
          assignedDoctor: selectedDoctor,
          status: 'assigned',
          assignedRoom: availableRoom
        } : triage
      );
      
      localStorage.setItem('doctors', JSON.stringify(updatedDoctors));
      localStorage.setItem('triageQueue', JSON.stringify(updatedQueue));
      
      // Get patient info to notify them
      const triage = updatedQueue.find(t => t.id === triageId);
      if (triage) {
        notifyPatient.mutate({
          patientId: triage.patientId,
          notification: {
            title: "Médico designado",
            message: `Dr(a). ${selectedDoctor.name} foi designado para seu atendimento. Por favor, dirija-se à ${availableRoom}.`
          }
        });
      }
      
      return { doctorId: selectedDoctor.id, triageId, room: availableRoom };
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['triageQueue'] });
      queryClient.invalidateQueries({ queryKey: ['doctors'] });
      toast({
        title: "Médico designado",
        description: `Médico designado para o paciente na ${data.room}`
      });
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Não há médicos disponíveis no momento",
        variant: "destructive"
      });
    }
  });

  const toggleDoctorAvailability = useMutation({
    mutationFn: async ({ doctorId }: { doctorId: number }) => {
      const currentDoctors = JSON.parse(localStorage.getItem('doctors') || '[]') as Doctor[];
      const updatedDoctors = currentDoctors.map(doc => 
        doc.id === doctorId ? { ...doc, available: !doc.available } : doc
      );
      
      localStorage.setItem('doctors', JSON.stringify(updatedDoctors));
      return doctorId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['doctors'] });
    }
  });

  const removeTriage = useMutation({
    mutationFn: async (triageId: number) => {
      const currentQueue = JSON.parse(localStorage.getItem('triageQueue') || '[]') as TriageEntry[];
      
      const triage = currentQueue.find(t => t.id === triageId);
      if (!triage) throw new Error("Triage not found");
      
      // If doctor was assigned, make them available again
      if (triage.assignedDoctor) {
        const currentDoctors = JSON.parse(localStorage.getItem('doctors') || '[]') as Doctor[];
        const updatedDoctors = currentDoctors.map(doc => 
          doc.id === triage.assignedDoctor?.id ? { ...doc, available: true } : doc
        );
        localStorage.setItem('doctors', JSON.stringify(updatedDoctors));
      }
      
      // Remove the triage entry from queue
      const updatedQueue = currentQueue.filter(t => t.id !== triageId);
      localStorage.setItem('triageQueue', JSON.stringify(updatedQueue));
      
      // Notify patient that their case has been removed
      if (triage) {
        notifyPatient.mutate({
          patientId: triage.patientId,
          notification: {
            title: "Atendimento cancelado",
            message: "Seu atendimento foi cancelado. Por favor, entre em contato com a recepção para mais informações."
          }
        });
      }
      
      return triageId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['triageQueue'] });
      queryClient.invalidateQueries({ queryKey: ['doctors'] });
      toast({
        title: "Triagem removida",
        description: "A triagem foi removida da fila com sucesso"
      });
    }
  });

  return {
    assignDoctor,
    toggleDoctorAvailability,
    removeTriage
  };
};
