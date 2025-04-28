
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

const symptoms = [
  "Febre", "Dor de cabeça", "Tosse", "Dor de garganta",
  "Dificuldade respiratória", "Náusea", "Dor abdominal", "Fadiga",
  "Dor no peito", "Tontura", "Vômito", "Diarreia"
];

const priorityLevels = [
  { name: "Emergência", color: "bg-red-500" },
  { name: "Muito Urgente", color: "bg-orange-500" },
  { name: "Urgente", color: "bg-yellow-500" },
  { name: "Pouco Urgente", color: "bg-green-500" },
  { name: "Não Urgente", color: "bg-blue-500" }
];

const TriageDemo: React.FC = () => {
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [triageResult, setTriageResult] = useState<{ priority: number; recommendations: string } | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const toggleSymptom = (symptom: string) => {
    if (selectedSymptoms.includes(symptom)) {
      setSelectedSymptoms(selectedSymptoms.filter(s => s !== symptom));
    } else {
      setSelectedSymptoms([...selectedSymptoms, symptom]);
    }

    // Reset triage result when symptoms change
    setTriageResult(null);
  };

  const analyzeSymptoms = () => {
    if (selectedSymptoms.length === 0) return;

    setIsAnalyzing(true);
    
    // Simulate AI analysis with a delay
    setTimeout(() => {
      // Simple mock AI logic - in reality, this would be a sophisticated algorithm
      let priority = 4; // Default to non-urgent
      
      // Logic to determine priority
      if (selectedSymptoms.includes("Dificuldade respiratória") || 
          selectedSymptoms.includes("Dor no peito")) {
        priority = 0; // Emergency
      } else if (selectedSymptoms.includes("Febre") && 
                (selectedSymptoms.includes("Tosse") || selectedSymptoms.includes("Dificuldade respiratória"))) {
        priority = 1; // Very urgent
      } else if (selectedSymptoms.includes("Febre") || selectedSymptoms.includes("Dor abdominal")) {
        priority = 2; // Urgent
      } else if (selectedSymptoms.length >= 3) {
        priority = 3; // Semi-urgent
      }

      // Generate recommendations based on priority
      const recommendations = getRecommendations(priority);
      
      setTriageResult({ priority, recommendations });
      setIsAnalyzing(false);
    }, 2000); // 2 second delay to simulate AI processing
  };

  const getRecommendations = (priority: number) => {
    switch(priority) {
      case 0:
        return "Atendimento imediato. Dirija-se à área de emergência.";
      case 1:
        return "Atendimento em até 10 minutos. Aguarde na área designada.";
      case 2:
        return "Atendimento em até 60 minutos. Aguarde ser chamado.";
      case 3:
        return "Atendimento em até 120 minutos. Você pode aguardar na sala de espera.";
      default:
        return "Atendimento não prioritário. Será atendido por ordem de chegada.";
    }
  };

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-2">Triagem Automatizada com IA</h2>
          <p className="text-gray-600 max-w-3xl mx-auto">
            Nossa tecnologia de inteligência artificial analisa seus sintomas e determina a prioridade do seu atendimento.
            Experimente nossa demonstração interativa abaixo.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-sabara-primary">Selecione seus sintomas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {symptoms.map((symptom) => (
                  <Button
                    key={symptom}
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
              </div>
              
              <Button 
                className="w-full mt-6 bg-sabara-primary hover:bg-sabara-primary/90"
                disabled={selectedSymptoms.length === 0 || isAnalyzing}
                onClick={analyzeSymptoms}
              >
                {isAnalyzing ? "Analisando..." : "Analisar Sintomas"}
              </Button>
            </CardContent>
          </Card>

          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-sabara-primary">Resultado da Triagem</CardTitle>
            </CardHeader>
            <CardContent>
              {isAnalyzing ? (
                <div className="flex flex-col items-center justify-center h-64">
                  <div className="w-16 h-16 border-4 border-sabara-primary border-t-transparent rounded-full animate-spin"></div>
                  <p className="mt-4 text-gray-600">Analisando seus sintomas...</p>
                </div>
              ) : triageResult ? (
                <div className="space-y-6">
                  <div className="flex flex-col items-center">
                    <div className={`${priorityLevels[triageResult.priority].color} w-24 h-24 rounded-full flex items-center justify-center text-white font-bold mb-2`}>
                      {priorityLevels[triageResult.priority].name}
                    </div>
                    <p className="text-gray-600">Nível de prioridade: {5 - triageResult.priority} de 5</p>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Recomendações:</h3>
                    <p className="text-gray-700">{triageResult.recommendations}</p>
                  </div>

                  <div>
                    <h3 className="font-semibold text-lg mb-2">Sintomas informados:</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedSymptoms.map(symptom => (
                        <span key={symptom} className="bg-sabara-secondary px-3 py-1 rounded-full text-sm">
                          {symptom}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-64 text-center">
                  <p className="text-gray-500">
                    Selecione seus sintomas no painel ao lado e clique em "Analisar Sintomas" para receber uma avaliação.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default TriageDemo;
