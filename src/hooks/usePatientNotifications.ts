
import { useMutation, useQueryClient } from '@tanstack/react-query';

export interface PatientNotification {
  id: number;
  date: string;
  title: string;
  message: string;
  read: boolean;
}

export const usePatientNotifications = () => {
  const queryClient = useQueryClient();

  const notifyPatient = useMutation({
    mutationFn: async ({ 
      patientId, 
      notification 
    }: { 
      patientId: number; 
      notification: Omit<PatientNotification, 'id' | 'date' | 'read'>
    }) => {
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const updatedUsers = users.map((user: any) => {
        if (user.id === patientId) {
          const notifications = user.notifications || [];
          notifications.unshift({
            id: Date.now(),
            date: new Date().toISOString(),
            ...notification,
            read: false
          });
          return { ...user, notifications };
        }
        return user;
      });
      
      localStorage.setItem('users', JSON.stringify(updatedUsers));
      
      // Update current user in session if it's the same patient
      const currentUserStr = sessionStorage.getItem('currentUser');
      if (currentUserStr) {
        const currentUser = JSON.parse(currentUserStr);
        if (currentUser.id === patientId) {
          const notifications = currentUser.notifications || [];
          notifications.unshift({
            id: Date.now(),
            date: new Date().toISOString(),
            ...notification,
            read: false
          });
          sessionStorage.setItem('currentUser', JSON.stringify({ 
            ...currentUser, 
            notifications 
          }));
        }
      }
      
      return { patientId, notification };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    }
  });

  return {
    notifyPatient
  };
};
