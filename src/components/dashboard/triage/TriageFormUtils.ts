
export const symptoms = [
  "Febre", "Dor de cabeça", "Tosse", "Dor de garganta",
  "Dificuldade respiratória", "Náusea", "Dor abdominal", "Fadiga",
  "Dor no peito", "Tontura", "Vômito", "Diarreia"
];

export const getRecommendation = (priority: string) => {
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

export const calculatePriority = (symptoms: string[]) => {
  let priority = 'Baixo';
  if (symptoms.some(s => s.includes("Dificuldade respiratória")) || 
      symptoms.some(s => s.includes("Dor no peito"))) {
    priority = 'Crítico';
  } else if (symptoms.some(s => s.includes("Febre")) && 
            (symptoms.some(s => s.includes("Tosse")) || 
             symptoms.some(s => s.includes("Dificuldade respiratória")))) {
    priority = 'Alto';
  } else if (symptoms.length >= 3) {
    priority = 'Moderado';
  }
  return priority;
};
