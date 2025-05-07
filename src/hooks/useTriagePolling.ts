
import { useQueryClient } from '@tanstack/react-query';

export const useTriagePolling = () => {
  const queryClient = useQueryClient();
  
  // Set up polling to update the triage queue regularly
  const setupPolling = () => {
    const interval = setInterval(() => {
      queryClient.invalidateQueries({ queryKey: ['triageQueue'] });
    }, 3000); // Updates every 3 seconds
    
    return () => clearInterval(interval);
  };

  return {
    setupPolling
  };
};
