
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
  // Sintomas críticos que requerem atenção imediata
  const criticalSymptoms = [
    "Dificuldade respiratória", 
    "Dor no peito",
    "Outros: Desmaio",
    "Outros: Convulsão",
    "Outros: Sangramento intenso"
  ];
  
  // Sintomas de alta prioridade
  const highPrioritySymptoms = [
    "Febre",
    "Vômito",
    "Diarreia"
  ];
  
  // Verifica sintomas críticos
  if (symptoms.some(s => criticalSymptoms.some(cs => s.includes(cs)))) {
    return 'Crítico';
  } 
  
  // Verifica combinações de alta prioridade
  const hasFever = symptoms.some(s => s.includes("Febre"));
  const hasRespiratorySymptom = symptoms.some(s => 
    s.includes("Tosse") || s.includes("Dor de garganta")
  );
  
  if (hasFever && hasRespiratorySymptom) {
    return 'Alto';
  }
  
  // Verifica múltiplos sintomas de alta prioridade
  const highPriorityCount = symptoms.filter(s => 
    highPrioritySymptoms.some(hs => s.includes(hs))
  ).length;
  
  if (highPriorityCount >= 2) {
    return 'Alto';
  } 
  
  // Verifica quantidade de sintomas para prioridade moderada
  if (symptoms.length >= 3) {
    return 'Moderado';
  }
  
  // Caso contrário, prioridade baixa
  return 'Baixo';
};
