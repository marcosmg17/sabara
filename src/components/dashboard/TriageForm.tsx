
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Clock } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';

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
          Nova Pré-Triagem via Celular
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
              <div className="space-y-4 border p-4 rounded-md">
                <div>
                  <label htmlFor="temperature" className="block text-sm font-medium text-gray-700 mb-1">
                    Temperatura (°C)
                  </label>
                  <Input
                    id="temperature"
                    type="number"
                    step="0.1"
                    placeholder="Ex: 37.5"
                    value={temperature}
                    onChange={(e) => setTemperature(e.target.value)}
                    className="w-full"
                  />
                </div>
                
                <div>
                  <label htmlFor="heartRate" className="block text-sm font-medium text-gray-700 mb-1">
                    Batimentos Cardíacos (BPM)
                  </label>
                  <Input
                    id="heartRate"
                    type="number"
                    placeholder="Ex: 80"
                    value={heartRate}
                    onChange={(e) => setHeartRate(e.target.value)}
                    className="w-full"
                  />
                </div>
                
                <div>
                  <label htmlFor="preTriageNotes" className="block text-sm font-medium text-gray-700 mb-1">
                    Observações adicionais
                  </label>
                  <Textarea
                    id="preTriageNotes"
                    placeholder="Descreva qualquer informação adicional relevante..."
                    value={preTriageNotes}
                    onChange={(e) => setPreTriageNotes(e.target.value)}
                    className="w-full"
                  />
                </div>
              </div>
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
