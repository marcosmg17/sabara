
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

  const sortedQueue = [...triageQueue].sort((a: TriageEntry, b: TriageEntry) => {
    // First sort by status
    if (a.status === 'waiting' && b.status !== 'waiting') return -1;
    if (a.status !== 'waiting' && b.status === 'waiting') return 1;
    if (a.status === 'nurse-triage' && b.status !== 'nurse-triage' && b.status !== 'waiting') return -1;
    if (a.status !== 'nurse-triage' && b.status === 'nurse-triage') return 1;
    
    // Then by priority
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

export const statusLabels: Record<string, string> = {
  'waiting': 'Aguardando',
  'nurse-triage': 'Triagem Enfermagem',
  'assigned': 'Atribuído ao Médico',
  'in-progress': 'Em atendimento',
  'completed': 'Concluído',
  'uti': 'Encaminhado para UTI'
};

export const statusColors: Record<string, string> = {
  'waiting': 'bg-blue-500',
  'nurse-triage': 'bg-cyan-500',
  'assigned': 'bg-purple-500',
  'in-progress': 'bg-amber-500',
  'completed': 'bg-gray-500',
  'uti': 'bg-red-700'
};
