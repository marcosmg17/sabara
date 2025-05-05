
import { useEffect } from 'react';
import { NurseStatus } from '@/types/nurse';

export const useInitializeData = () => {
  useEffect(() => {
    // Initialize doctors
    if (!localStorage.getItem('doctors')) {
      const initialDoctors = [
        { id: 1, name: "Dra. Maria Santos", available: true, room: "101", specialty: "Clínico Geral" },
        { id: 2, name: "Dr. Roberto Almeida", available: true, room: "102", specialty: "Emergência" },
        { id: 3, name: "Dra. Carolina Lima", available: true, room: "103", specialty: "Pediatria" }
      ];
      localStorage.setItem('doctors', JSON.stringify(initialDoctors));
    }

    // Initialize nurses
    if (!localStorage.getItem('nurses')) {
      const initialNurses = [
        { 
          id: 1, 
          name: "Ana Silva", 
          available: true, 
          status: 'available' as NurseStatus, 
          room: "Triagem 1",
          specialty: "Emergência"
        },
        { 
          id: 2, 
          name: "Carlos Oliveira", 
          available: true, 
          status: 'available' as NurseStatus, 
          room: "Triagem 2",
          specialty: "Pediatria"
        },
        { 
          id: 3, 
          name: "Lucia Santos", 
          available: true, 
          status: 'available' as NurseStatus, 
          room: "Triagem 3",
          specialty: "Clínica Médica"
        },
        { 
          id: 4, 
          name: "Pedro Mendes", 
          available: true, 
          status: 'available' as NurseStatus, 
          room: "Triagem 4",
          specialty: "Ortopedia"
        },
        { 
          id: 5, 
          name: "Julia Costa", 
          available: true, 
          status: 'available' as NurseStatus, 
          room: "Triagem 5",
          specialty: "UTI"
        }
      ];
      localStorage.setItem('nurses', JSON.stringify(initialNurses));
    }

    // Initialize beds if they don't exist
    if (!localStorage.getItem('beds')) {
      const initialBeds = [
        { id: "A1", name: "Leito A1", type: "UTI", status: "available" },
        { id: "A2", name: "Leito A2", type: "UTI", status: "available" },
        { id: "A3", name: "Leito A3", type: "UTI", status: "available" },
        { id: "B1", name: "Leito B1", type: "Emergência", status: "available" },
        { id: "B2", name: "Leito B2", type: "Emergência", status: "available" },
        { id: "B3", name: "Leito B3", type: "Emergência", status: "available" },
        { id: "C1", name: "Leito C1", type: "Internação", status: "available" },
        { id: "C2", name: "Leito C2", type: "Internação", status: "available" },
        { id: "C3", name: "Leito C3", type: "Internação", status: "available" }
      ];
      localStorage.setItem('beds', JSON.stringify(initialBeds));
    }
  }, []);
};
