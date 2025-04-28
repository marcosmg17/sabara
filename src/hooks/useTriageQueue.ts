
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { TriageEntry } from '@/types/triage';

export const useTriageQueue = () => {
  const { data: triageQueue = [], isLoading } = useQuery({
    queryKey: ['triageQueue'],
    queryFn: () => {
      const storedQueue = localStorage.getItem('triageQueue');
      return storedQueue ? JSON.parse(storedQueue) : [];
    }
  });

  // Sort triage entries by priority and status
  const sortedQueue = [...triageQueue].sort((a: TriageEntry, b: TriageEntry) => {
    // First sort by status (waiting first)
    if (a.status === 'waiting' && b.status !== 'waiting') return -1;
    if (a.status !== 'waiting' && b.status === 'waiting') return 1;
    
    // Then sort by priority order
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });

  return {
    triageQueue: sortedQueue,
    isLoading
  };
};

export const priorityOrder: Record<string, number> = {
  'Crítico': 0,
  'Alto': 1,
  'Moderado': 2,
  'Baixo': 3
};

export const priorityColors: Record<string, string> = {
  'Crítico': 'bg-red-500',
  'Alto': 'bg-orange-500',
  'Moderado': 'bg-yellow-500',
  'Baixo': 'bg-green-500'
};
