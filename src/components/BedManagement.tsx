
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Bed, Check, Clock } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';

// Import mock data
import mockData from '../data/mockData.json';

const statusColors: Record<string, string> = {
  "Ocupado": "bg-red-500",
  "Disponível": "bg-green-500",
  "Em Limpeza": "bg-yellow-500",
  "Reservado": "bg-blue-500",
  "Pendente": "bg-red-300",
  "Em Progresso": "bg-yellow-500",
  "Limpo": "bg-green-500"
};

const BedManagement: React.FC = () => {
  const [currentFloor, setCurrentFloor] = useState(1);

  // Using react-query to fetch data
  const { data: beds, isLoading } = useQuery({
    queryKey: ['beds'],
    queryFn: () => Promise.resolve(mockData.beds),
  });

  const floors = beds ? [...new Set(beds.map(bed => bed.floor))].sort() : [];
  const filteredBeds = beds ? beds.filter(bed => bed.floor === currentFloor) : [];

  if (isLoading) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-2">Gestão Dinâmica de Leitos</h2>
            <p className="text-gray-600">Carregando...</p>
          </div>
        </div>
      </section>
    );
  }

  const availableBeds = beds?.filter(bed => bed.status === "Disponível").length || 0;
  const occupiedBeds = beds?.filter(bed => bed.status === "Ocupado").length || 0;
  const cleaningBeds = beds?.filter(bed => bed.status === "Em Limpeza").length || 0;
  const reservedBeds = beds?.filter(bed => bed.status === "Reservado").length || 0;
  
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-2">Gestão Dinâmica de Leitos</h2>
          <p className="text-gray-600 max-w-3xl mx-auto">
            Nosso sistema monitora continuamente o status dos leitos, permitindo maior eficiência na gestão hospitalar
            e reduzindo o tempo de espera para internação.
          </p>
        </div>
        
        {/* Status summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="shadow-sm">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">Disponíveis</p>
                  <h3 className="text-3xl font-bold text-green-500">{availableBeds}</h3>
                </div>
                <div className="bg-green-100 p-3 rounded-full">
                  <Check className="h-6 w-6 text-green-500" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="shadow-sm">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">Ocupados</p>
                  <h3 className="text-3xl font-bold text-red-500">{occupiedBeds}</h3>
                </div>
                <div className="bg-red-100 p-3 rounded-full">
                  <Bed className="h-6 w-6 text-red-500" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="shadow-sm">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">Em Limpeza</p>
                  <h3 className="text-3xl font-bold text-yellow-500">{cleaningBeds}</h3>
                </div>
                <div className="bg-yellow-100 p-3 rounded-full">
                  <Clock className="h-6 w-6 text-yellow-500" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="shadow-sm">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">Reservados</p>
                  <h3 className="text-3xl font-bold text-blue-500">{reservedBeds}</h3>
                </div>
                <div className="bg-blue-100 p-3 rounded-full">
                  <Bed className="h-6 w-6 text-blue-500" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Floor selector */}
        <Tabs defaultValue={`${currentFloor}`} className="mb-8">
          <div className="flex justify-center mb-4">
            <TabsList>
              {floors.map(floor => (
                <TabsTrigger 
                  key={floor} 
                  value={`${floor}`} 
                  onClick={() => setCurrentFloor(floor)}
                >
                  {`Andar ${floor}`}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>
          
          {floors.map(floor => (
            <TabsContent key={floor} value={`${floor}`} className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredBeds.map((bed) => (
                  <Card key={bed.id} className="shadow-sm overflow-hidden">
                    <div className={`${statusColors[bed.status]} h-2 w-full`}></div>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-center">
                        <CardTitle className="text-xl">Quarto {bed.room}</CardTitle>
                        <Badge className={`${statusColors[bed.status]}`}>{bed.status}</Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      {bed.patient ? (
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-500">Paciente:</span>
                            <span className="font-medium">{bed.patient}</span>
                          </div>
                          {bed.estimatedRelease && (
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-500">Previsão de alta:</span>
                              <span className="font-medium">
                                {new Date(bed.estimatedRelease).toLocaleDateString('pt-BR')}
                              </span>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-500">Status de limpeza:</span>
                            <Badge className={`${statusColors[bed.cleaningStatus]}`}>
                              {bed.cleaningStatus}
                            </Badge>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </section>
  );
};

export default BedManagement;
