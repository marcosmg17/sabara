
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Clock } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';

interface TriageFormProps {
  onTriageSubmit: (triageData: any) => void;
}

const symptoms = [
  "Febre", "Dor de cabeça", "Tosse", "Dor de garganta",
  "Dificuldade respiratória", "Náusea", "Dor abdominal", "Fadiga",
  "Dor no peito", "Tontura", "Vômito", "Diarreia"
];

const TriageForm: React.FC<TriageFormProps> = ({ onTriageSubmit }) => {
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [otherSymptoms, setOtherSymptoms] = useState('');
  const [showOtherInput, setShowOtherInput] = useState(false);
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
    
    // Collect all symptoms, including "Other" if entered
    let allSymptoms = [...selectedSymptoms];
    if (showOtherInput && otherSymptoms.trim()) {
      allSymptoms = allSymptoms.filter(s => s !== "Outros");
      allSymptoms.push(`Outros: ${otherSymptoms.trim()}`);
    } else if (showOtherInput) {
      // If "Outros" is selected but no input, remove it
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

    // Calculate priority based on symptoms
    let priority = 'Baixo';
    if (allSymptoms.some(s => s.includes("Dificuldade respiratória")) || 
        allSymptoms.some(s => s.includes("Dor no peito"))) {
      priority = 'Crítico';
    } else if (allSymptoms.some(s => s.includes("Febre")) && 
              (allSymptoms.some(s => s.includes("Tosse")) || 
               allSymptoms.some(s => s.includes("Dificuldade respiratória")))) {
      priority = 'Alto';
    } else if (allSymptoms.length >= 3) {
      priority = 'Moderado';
    }

    const triageData = {
      date: new Date().toISOString(),
      symptoms: allSymptoms,
      priority,
      id: Date.now(),
      recommendation: getRecommendation(priority),
      assignedDoctor: null,
      assignedRoom: null,
      status: 'waiting', // 'waiting', 'assigned', 'in-progress', 'completed'
    };

    onTriageSubmit(triageData);
    setSelectedSymptoms([]);
    setOtherSymptoms('');
    setShowOtherInput(false);
    
    toast({
      title: "Triagem enviada",
      description: "Sua triagem foi registrada com sucesso",
    });
  };

  const getRecommendation = (priority: string) => {
    switch (priority) {
      case 'Crítico':
        return "Procure atendimento médico imediatamente.";
      case 'Alto':
        return "Recomendamos que você se dirija ao hospital assim que possível.";
      case 'Moderado':
        return "Aguarde o atendimento. Um profissional irá chamá-lo em breve.";
      case 'Baixo':
        return "Aguarde o atendimento conforme ordem de chegada.";
      default:
        return "Aguarde o atendimento.";
    }
  };

  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Nova Triagem
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {symptoms.map((symptom) => (
              <Button
                key={symptom}
                type="button"
                variant={selectedSymptoms.includes(symptom) ? "default" : "outline"}
                className={`${
                  selectedSymptoms.includes(symptom) 
                  ? 'bg-sabara-primary text-white' 
                  : 'border-sabara-secondary text-gray-700'
                } w-full justify-start`}
                onClick={() => toggleSymptom(symptom)}
              >
                {symptom}
              </Button>
            ))}
            <Button
              type="button"
              variant={selectedSymptoms.includes("Outros") ? "default" : "outline"}
              className={`${
                selectedSymptoms.includes("Outros") 
                ? 'bg-sabara-primary text-white' 
                : 'border-sabara-secondary text-gray-700'
              } w-full justify-start`}
              onClick={() => toggleSymptom("Outros")}
            >
              Outros
            </Button>
          </div>

          {showOtherInput && (
            <div className="mt-2">
              <label htmlFor="otherSymptoms" className="block text-sm font-medium text-gray-700 mb-1">
                Descreva outros sintomas
              </label>
              <Textarea
                id="otherSymptoms"
                placeholder="Descreva seus sintomas aqui..."
                value={otherSymptoms}
                onChange={(e) => setOtherSymptoms(e.target.value)}
                className="w-full"
              />
            </div>
          )}

          <Button 
            type="submit"
            className="w-full"
            disabled={selectedSymptoms.length === 0 && !otherSymptoms}
          >
            Enviar Triagem
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default TriageForm;
