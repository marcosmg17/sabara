
import { useState } from 'react';
import { Patient } from '@/types/patient';
import { useToast } from '@/hooks/use-toast';

export const usePatientHistory = () => {
  const [selectedPatientId, setSelectedPatientId] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  const currentDoctor = JSON.parse(localStorage.getItem('currentDoctor') || '{}');
  const patients = JSON.parse(localStorage.getItem('users') || '[]');
  const selectedPatient = patients.find((p: Patient) => p.id.toString() === selectedPatientId);

  const handleAddMedicalRecord = () => {
    if (!notes.trim()) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "As anotações não podem estar vazias",
      });
      return;
    }

    const updatedPatients = patients.map((patient: Patient) => {
      if (patient.id.toString() === selectedPatientId) {
        const medicalHistory = patient.medicalHistory || [];
        medicalHistory.unshift({
          id: Date.now(),
          date: new Date().toISOString(),
          doctor: currentDoctor.name,
          notes: notes
        });
        return { ...patient, medicalHistory };
      }
      return patient;
    });

    localStorage.setItem('users', JSON.stringify(updatedPatients));
    setNotes('');
    setIsDialogOpen(false);
    
    toast({
      title: "Registro adicionado",
      description: "O histórico médico foi atualizado com sucesso",
    });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  return {
    selectedPatientId,
    setSelectedPatientId,
    notes,
    setNotes,
    isDialogOpen,
    setIsDialogOpen,
    selectedPatient,
    patients,
    currentDoctor,
    handleAddMedicalRecord,
    formatDate,
  };
};
