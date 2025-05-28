
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Smartphone, Clock, AlertTriangle } from 'lucide-react';
import QRCode from 'qrcode.react';
import { useToast } from '@/hooks/use-toast';

const PreTriage = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [symptomDuration, setSymptomDuration] = useState('');
  const [preExistingConditions, setPreExistingConditions] = useState<string[]>([]);
  const [qrCode, setQrCode] = useState('');
  const [priority, setPriority] = useState('');
  const [priorityColor, setPriorityColor] = useState('');
  const navigate = useNavigate();
  const { toast } = useToast();

  const symptoms = [
    "Febre alta", "Dor no peito", "Falta de ar", "Dor de cabeça intensa",
    "Náusea/Vômito", "Dor abdominal", "Tontura", "Dor nas costas",
    "Tosse persistente", "Dor de garganta", "Fadiga extrema", "Outros"
  ];

  const durations = [
    "Menos de 1 hora", "1-6 horas", "6-12 horas", 
    "1-2 dias", "3-7 dias", "Mais de 1 semana"
  ];

  const conditions = [
    "Diabetes", "Hipertensão", "Problemas cardíacos", "Asma",
    "Medicação contínua", "Cirurgia recente", "Gravidez", "Nenhuma"
  ];

  const toggleSymptom = (symptom: string) => {
    setSelectedSymptoms(prev => 
      prev.includes(symptom) 
        ? prev.filter(s => s !== symptom)
        : [...prev, symptom]
    );
  };

  const toggleCondition = (condition: string) => {
    setPreExistingConditions(prev => 
      prev.includes(condition) 
        ? prev.filter(c => c !== condition)
        : [...prev, condition]
    );
  };

  const calculatePriority = () => {
    const criticalSymptoms = ["Dor no peito", "Falta de ar", "Febre alta"];
    const urgentSymptoms = ["Náusea/Vômito", "Dor abdominal", "Dor de cabeça intensa"];
    
    const hasCritical = selectedSymptoms.some(s => criticalSymptoms.includes(s));
    const hasUrgent = selectedSymptoms.some(s => urgentSymptoms.includes(s));
    const hasConditions = preExistingConditions.some(c => c !== "Nenhuma");
    const recentSymptoms = ["Menos de 1 hora", "1-6 horas"].includes(symptomDuration);

    if (hasCritical || (hasUrgent && hasConditions && recentSymptoms)) {
      return { priority: "Emergência", color: "bg-red-500", colorName: "red" };
    } else if (hasUrgent || (hasConditions && recentSymptoms)) {
      return { priority: "Muito Urgente", color: "bg-orange-500", colorName: "orange" };
    } else if (selectedSymptoms.length >= 2 || hasConditions) {
      return { priority: "Urgente", color: "bg-yellow-500", colorName: "yellow" };
    } else if (selectedSymptoms.length === 1) {
      return { priority: "Pouco Urgente", color: "bg-green-500", colorName: "green" };
    } else {
      return { priority: "Não Urgente", color: "bg-blue-500", colorName: "blue" };
    }
  };

  const generateQRCode = () => {
    const triageData = {
      id: Date.now(),
      symptoms: selectedSymptoms,
      duration: symptomDuration,
      conditions: preExistingConditions,
      timestamp: new Date().toISOString(),
      priority: priority,
      color: priorityColor
    };
    
    const qrData = JSON.stringify(triageData);
    setQrCode(qrData);
    
    // Save to localStorage for later use
    localStorage.setItem('currentPreTriage', qrData);
  };

  const handleNext = () => {
    if (currentStep === 1 && selectedSymptoms.length === 0) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Selecione pelo menos um sintoma"
      });
      return;
    }
    
    if (currentStep === 2 && !symptomDuration) {
      toast({
        variant: "destructive",
        title: "Erro", 
        description: "Selecione há quanto tempo os sintomas começaram"
      });
      return;
    }
    
    if (currentStep === 3 && preExistingConditions.length === 0) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Selecione suas condições pré-existentes ou 'Nenhuma'"
      });
      return;
    }

    if (currentStep === 3) {
      const result = calculatePriority();
      setPriority(result.priority);
      setPriorityColor(result.color);
      setTimeout(() => {
        generateQRCode();
        setCurrentStep(4);
      }, 500);
    } else {
      setCurrentStep(prev => prev + 1);
    }
  };

  const goToCheckin = () => {
    navigate('/checkin');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="text-center mb-6">
          <Smartphone className="h-12 w-12 text-sabara-primary mx-auto mb-2" />
          <h1 className="text-2xl font-bold text-sabara-primary">Pré-Triagem Online</h1>
          <p className="text-gray-600">Faça sua triagem antes de chegar ao hospital</p>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex justify-between mb-2">
            {[1, 2, 3, 4].map((step) => (
              <div 
                key={step}
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                  step <= currentStep ? 'bg-sabara-primary text-white' : 'bg-gray-300 text-gray-600'
                }`}
              >
                {step}
              </div>
            ))}
          </div>
          <div className="w-full bg-gray-300 rounded-full h-2">
            <div 
              className="bg-sabara-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / 4) * 100}%` }}
            />
          </div>
        </div>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg">
              {currentStep === 1 && "1. Quais sintomas você está sentindo?"}
              {currentStep === 2 && "2. Há quanto tempo os sintomas começaram?"}
              {currentStep === 3 && "3. Condições pré-existentes"}
              {currentStep === 4 && "4. Sua Pré-Triagem"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            
            {/* Step 1: Symptoms */}
            {currentStep === 1 && (
              <div className="grid grid-cols-2 gap-3">
                {symptoms.map((symptom) => (
                  <Button
                    key={symptom}
                    type="button"
                    variant={selectedSymptoms.includes(symptom) ? "default" : "outline"}
                    className={`h-16 text-sm ${
                      selectedSymptoms.includes(symptom) 
                        ? 'bg-sabara-primary text-white' 
                        : 'border-sabara-secondary'
                    }`}
                    onClick={() => toggleSymptom(symptom)}
                  >
                    {symptom}
                  </Button>
                ))}
              </div>
            )}

            {/* Step 2: Duration */}
            {currentStep === 2 && (
              <div className="space-y-3">
                {durations.map((duration) => (
                  <Button
                    key={duration}
                    type="button"
                    variant={symptomDuration === duration ? "default" : "outline"}
                    className={`w-full h-12 ${
                      symptomDuration === duration 
                        ? 'bg-sabara-primary text-white' 
                        : 'border-sabara-secondary'
                    }`}
                    onClick={() => setSymptomDuration(duration)}
                  >
                    <Clock className="w-4 h-4 mr-2" />
                    {duration}
                  </Button>
                ))}
              </div>
            )}

            {/* Step 3: Pre-existing conditions */}
            {currentStep === 3 && (
              <div className="grid grid-cols-2 gap-3">
                {conditions.map((condition) => (
                  <Button
                    key={condition}
                    type="button"
                    variant={preExistingConditions.includes(condition) ? "default" : "outline"}
                    className={`h-16 text-sm ${
                      preExistingConditions.includes(condition) 
                        ? 'bg-sabara-primary text-white' 
                        : 'border-sabara-secondary'
                    }`}
                    onClick={() => toggleCondition(condition)}
                  >
                    {condition}
                  </Button>
                ))}
              </div>
            )}

            {/* Step 4: Results */}
            {currentStep === 4 && (
              <div className="text-center space-y-4">
                <div className={`p-4 rounded-lg ${priorityColor} text-white`}>
                  <AlertTriangle className="w-8 h-8 mx-auto mb-2" />
                  <h3 className="text-xl font-bold">Classificação: {priority}</h3>
                </div>
                
                {qrCode && (
                  <div className="bg-white p-4 rounded-lg border-2 border-gray-200">
                    <QRCode 
                      value={qrCode} 
                      size={200}
                      className="mx-auto"
                    />
                    <p className="mt-2 text-sm text-gray-600">
                      Mostre este QR Code no totem do hospital
                    </p>
                  </div>
                )}
                
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-blue-800 mb-2">Próximos passos:</h4>
                  <ol className="text-sm text-blue-700 space-y-1">
                    <li>1. Vá ao hospital Smart Care</li>
                    <li>2. Escaneie este QR Code no totem</li>
                    <li>3. Receba sua senha de atendimento</li>
                    <li>4. Acompanhe sua chamada pelo celular</li>
                  </ol>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between pt-4">
              {currentStep > 1 && currentStep < 4 && (
                <Button 
                  variant="outline" 
                  onClick={() => setCurrentStep(prev => prev - 1)}
                >
                  Voltar
                </Button>
              )}
              
              {currentStep < 4 ? (
                <Button 
                  className="ml-auto bg-sabara-primary hover:bg-sabara-primary/90"
                  onClick={handleNext}
                >
                  Próximo
                </Button>
              ) : (
                <Button 
                  className="w-full bg-sabara-primary hover:bg-sabara-primary/90"
                  onClick={goToCheckin}
                >
                  Ir para Check-in
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PreTriage;
