
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Clock } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import SymptomSelector from './triage/SymptomSelector';
import VitalSignsForm from './triage/VitalSignsForm';
import { symptoms, getRecommendation, calculatePriority } from './triage/TriageFormUtils';

interface TriageFormProps {
  onTriageSubmit: (triageData: any) => void;
}

const TriageForm: React.FC<TriageFormProps> = ({ onTriageSubmit }) => {
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [otherSymptoms, setOtherSymptoms] = useState('');
  const [showOtherInput, setShowOtherInput] = useState(false);
  const [showVitalSigns, setShowVitalSigns] = useState(false);
  const [temperature, setTemperature] = useState<string>('');
  const [heartRate, setHeartRate] = useState<string>('');
  const [preTriageNotes, setPreTriageNotes] = useState('');
  const { toast } = useToast();

  const toggleSymptom = (symptom: string) => {
    if (symptom === "Outros") {
      setShowOtherInput(!showOtherInput);
      setSelectedSymptoms(prev => 
        prev.includes(symptom) 
          ? prev.filter(s => s !== symptom)
          : [...prev, symptom]
      );
      return;
    }
    
    setSelectedSymptoms(prev => 
      prev.includes(symptom) 
        ? prev.filter(s => s !== symptom)
        : [...prev, symptom]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    let allSymptoms = [...selectedSymptoms];
    if (showOtherInput && otherSymptoms.trim()) {
      allSymptoms = allSymptoms.filter(s => s !== "Outros");
      allSymptoms.push(`Outros: ${otherSymptoms.trim()}`);
    } else if (showOtherInput) {
      allSymptoms = allSymptoms.filter(s => s !== "Outros");
    }

    if (allSymptoms.length === 0) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Selecione pelo menos um sintoma",
      });
      return;
    }

    const priority = calculatePriority(allSymptoms);

    // Parse temperature and heart rate
    const parsedTemperature = temperature ? parseFloat(temperature) : undefined;
    const parsedHeartRate = heartRate ? parseInt(heartRate) : undefined;

    const triageData = {
      date: new Date().toISOString(),
      symptoms: allSymptoms,
      priority,
      id: Date.now(),
      recommendation: getRecommendation(priority),
      assignedDoctor: null,
      assignedNurse: null,
      assignedRoom: null,
      status: 'waiting',
      measurements: {
        temperature: parsedTemperature,
        heartRate: parsedHeartRate
      },
      preTriageNotes: preTriageNotes.trim() || undefined
    };

    onTriageSubmit(triageData);
    setSelectedSymptoms([]);
    setOtherSymptoms('');
    setShowOtherInput(false);
    setShowVitalSigns(false);
    setTemperature('');
    setHeartRate('');
    setPreTriageNotes('');
    
    toast({
      title: "Pré-triagem enviada",
      description: "Sua pré-triagem foi registrada com sucesso",
    });
  };

  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Nova Pré-Triagem via Celular
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <SymptomSelector 
            symptoms={symptoms}
            selectedSymptoms={selectedSymptoms}
            toggleSymptom={toggleSymptom}
            showOtherInput={showOtherInput}
            otherSymptoms={otherSymptoms}
            setOtherSymptoms={setOtherSymptoms}
            Textarea={Textarea}
          />

          <div className="pt-2">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setShowVitalSigns(!showVitalSigns)}
              className="mb-4 w-full"
            >
              {showVitalSigns ? "Ocultar Sinais Vitais" : "Informar Sinais Vitais (opcional)"}
            </Button>
            
            {showVitalSigns && (
              <VitalSignsForm 
                temperature={temperature}
                setTemperature={setTemperature}
                heartRate={heartRate}
                setHeartRate={setHeartRate}
                preTriageNotes={preTriageNotes}
                setPreTriageNotes={setPreTriageNotes}
              />
            )}
          </div>

          <Button 
            type="submit"
            className="w-full"
            disabled={selectedSymptoms.length === 0 && !otherSymptoms}
          >
            Enviar Pré-Triagem
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default TriageForm;
