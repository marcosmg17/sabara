
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { TriageEntry } from '@/types/triage';
import { Doctor } from '@/types/doctor';
import { useToast } from '@/hooks/use-toast';
import { usePatientNotifications } from './usePatientNotifications';

export const useUTIActions = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { notifyPatient } = usePatientNotifications();

  // Assign patient to UTI
  const assignToUTI = useMutation({
    mutationFn: async ({ triageId, bedId }: { triageId: number, bedId: string }) => {
      const currentQueue = JSON.parse(localStorage.getItem('triageQueue') || '[]') as TriageEntry[];
      const beds = JSON.parse(localStorage.getItem('beds') || '[]');
      
      const triage = currentQueue.find(t => t.id === triageId);
      if (!triage) {
        throw new Error("Triage not found");
      }
      
      // Update bed status
      const updatedBeds = beds.map((bed: any) => 
        bed.id === bedId ? { ...bed, isOccupied: true, patientName: triage.patientName } : bed
      );
      
      // If doctor was assigned, make them available again
      const currentDoctors = JSON.parse(localStorage.getItem('doctors') || '[]') as Doctor[];
      let updatedDoctors = [...currentDoctors];
      
      if (triage.assignedDoctor) {
        updatedDoctors = currentDoctors.map(d => 
          d.id === triage.assignedDoctor?.id ? { ...d, available: true } : d
        );
      }
      
      // Update triage status
      const updatedQueue = currentQueue.map(t => 
        t.id === triageId ? { ...t, status: 'uti', assignedRoom: `UTI - Leito ${bedId}` } : t
      );
      
      // Save changes
      localStorage.setItem('beds', JSON.stringify(updatedBeds));
      localStorage.setItem('doctors', JSON.stringify(updatedDoctors));
      localStorage.setItem('triageQueue', JSON.stringify(updatedQueue));
      
      // Add to patient history
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const updatedUsers = users.map((user: any) => {
        if (user.id === triage.patientId) {
          const medicalHistory = user.medicalHistory || [];
          medicalHistory.unshift({
            id: Date.now(),
            date: new Date().toISOString(),
            doctor: triage.assignedDoctor?.name || 'Equipe médica',
            notes: 'Paciente transferido para UTI',
            measurements: triage.measurements
          });
          
          // Notify patient's family about UTI transfer
          notifyPatient.mutate({
            patientId: triage.patientId,
            notification: {
              title: "Transferência para UTI",
              message: `O paciente foi transferido para a UTI - Leito ${bedId}. Um médico entrará em contato com a família em breve.`
            }
          });
          
          return { ...user, medicalHistory };
        }
        return user;
      });
      
      localStorage.setItem('users', JSON.stringify(updatedUsers));
      
      return { triageId, bedId };
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['triageQueue'] });
      queryClient.invalidateQueries({ queryKey: ['beds'] });
      queryClient.invalidateQueries({ queryKey: ['doctors'] });
      toast({
        title: "Paciente transferido para UTI",
        description: `O paciente foi transferido para o leito ${data.bedId}`
      });
    }
  });

  return {
    assignToUTI
  };
};
