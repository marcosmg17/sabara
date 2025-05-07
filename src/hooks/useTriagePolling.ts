
import { useQueryClient } from '@tanstack/react-query';
import { usePatientNotifications } from './usePatientNotifications';

export const useTriagePolling = () => {
  const queryClient = useQueryClient();
  const { notifyPatient } = usePatientNotifications();
  
  // Set up polling to update the triage queue regularly and send notifications
  const setupPolling = () => {
    const interval = setInterval(() => {
      // Get current triage queue
      const triageQueueStr = localStorage.getItem('triageQueue');
      if (!triageQueueStr) {
        queryClient.invalidateQueries({ queryKey: ['triageQueue'] });
        return () => clearInterval(interval);
      }
      
      const triageQueue = JSON.parse(triageQueueStr);
      const previousQueueStr = sessionStorage.getItem('previousTriageQueue');
      const previousQueue = previousQueueStr ? JSON.parse(previousQueueStr) : [];
      
      // Check for status changes and send notifications
      triageQueue.forEach(triage => {
        const previousTriage = previousQueue.find((t: any) => t.id === triage.id);
        
        // Status changed from waiting to nurse-triage or assigned
        if (previousTriage && 
            previousTriage.status === 'waiting' && 
            (triage.status === 'nurse-triage' || triage.status === 'assigned')) {
          notifyPatient.mutate({
            patientId: triage.patientId,
            notification: {
              title: "Chamada para Triagem",
              message: "Você está sendo chamado(a) para realizar a triagem. Por favor, dirija-se à recepção."
            }
          });
        }
        
        // Status changed to assigned
        if (previousTriage && 
            previousTriage.status !== 'assigned' && 
            triage.status === 'assigned' && 
            triage.assignedDoctor) {
          notifyPatient.mutate({
            patientId: triage.patientId,
            notification: {
              title: "Chamada para Consulta",
              message: `Você está sendo chamado(a) para consulta com Dr(a). ${triage.assignedDoctor.name} na sala ${triage.assignedDoctor.room}.`
            }
          });
        }
      });
      
      // Save current queue as previous for next comparison
      sessionStorage.setItem('previousTriageQueue', triageQueueStr);
      
      queryClient.invalidateQueries({ queryKey: ['triageQueue'] });
    }, 3000); // Updates every 3 seconds
    
    return () => clearInterval(interval);
  };

  return {
    setupPolling
  };
};
