
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { TriageEntry } from '@/types/triage';

export const useUTIActions = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

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

  return {
    assignToUTI
  };
};
