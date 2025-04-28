
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';

const statusColors: Record<string, string> = {
  "Ocupado": "bg-red-500",
  "Disponível": "bg-green-500",
  "Em Limpeza": "bg-yellow-500",
  "Reservado": "bg-blue-500"
};

const StaffBedManagement = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [currentFloor, setCurrentFloor] = React.useState(1);

  const { data: beds, isLoading } = useQuery({
    queryKey: ['beds'],
    queryFn: () => {
    
      const storedBeds = localStorage.getItem('hospital_beds');
      if (storedBeds) {
        return JSON.parse(storedBeds);
      }
      
  
      const initialBeds = [
        {
          id: 1,
          room: "101",
          floor: 1,
          status: "Disponível",
          patient: null,
          cleaningStatus: "Limpo"
        },
        {
          id: 2,
          room: "102",
          floor: 1,
          status: "Ocupado",
          patient: "Maria Silva",
          estimatedRelease: "2025-05-10"
        },
        {
          id: 3,
          room: "103",
          floor: 1,
          status: "Em Limpeza",
          patient: null,
          cleaningStatus: "Em Progresso"
        },
        {
          id: 4,
          room: "201",
          floor: 2,
          status: "Disponível",
          patient: null,
          cleaningStatus: "Limpo"
        },
        {
          id: 5,
          room: "202",
          floor: 2,
          status: "Reservado",
          patient: "Carlos Oliveira",
          estimatedRelease: null
        }
      ];
      localStorage.setItem('hospital_beds', JSON.stringify(initialBeds));
      return initialBeds;
    }
  });

  const updateBedStatus = useMutation({
    mutationFn: async ({ bedId, newStatus, newCleaningStatus }: { bedId: number, newStatus: string, newCleaningStatus?: string }) => {
      const currentBeds = queryClient.getQueryData(['beds']) as any[] || [];
      const updatedBeds = currentBeds.map(bed => {
        if (bed.id === bedId) {
          return {
            ...bed,
            status: newStatus,
            cleaningStatus: newCleaningStatus || bed.cleaningStatus
          };
        }
        return bed;
      });
      

      localStorage.setItem('hospital_beds', JSON.stringify(updatedBeds));
      return updatedBeds;
    },
    onSuccess: (updatedBeds) => {
      queryClient.setQueryData(['beds'], updatedBeds);
      toast({
        title: "Status atualizado",
        description: "O status do leito foi atualizado com sucesso",
      });
    },
  });

  const floors = beds ? [...new Set(beds.map((bed: any) => bed.floor))].sort() : [];
  const filteredBeds = beds ? beds.filter((bed: any) => bed.floor === currentFloor) : [];

  if (isLoading) {
    return <div>Carregando...</div>;
  }

  return (
    <section className="py-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Gestão de Leitos</h2>
        <Tabs defaultValue={`${currentFloor}`} className="w-full">
          <TabsList>
            {floors.map((floor: number) => (
              <TabsTrigger
                key={floor}
                value={`${floor}`}
                onClick={() => setCurrentFloor(floor)}
              >
                Andar {floor}
              </TabsTrigger>
            ))}
          </TabsList>

          {floors.map((floor: number) => (
            <TabsContent key={floor} value={`${floor}`}>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredBeds.map((bed: any) => (
                  <Card key={bed.id} className="shadow-sm">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-xl">Quarto {bed.room}</CardTitle>
                      <Badge className={`${statusColors[bed.status]}`}>
                        {bed.status}
                      </Badge>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {bed.patient && (
                          <div className="text-sm">
                            <span className="font-medium">Paciente: </span>
                            {bed.patient}
                          </div>
                        )}
                        <div>
                          <label className="block text-sm font-medium mb-1">
                            Alterar Status
                          </label>
                          <Select
                            onValueChange={(value) => {
                              updateBedStatus.mutate({
                                bedId: bed.id,
                                newStatus: value,
                              });
                            }}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione o status" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Disponível">Disponível</SelectItem>
                              <SelectItem value="Em Limpeza">Em Limpeza</SelectItem>
                              <SelectItem value="Reservado">Reservado</SelectItem>
                              <SelectItem value="Ocupado">Ocupado</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        {bed.status === "Em Limpeza" && (
                          <div>
                            <label className="block text-sm font-medium mb-1">
                              Status da Limpeza
                            </label>
                            <Select
                              onValueChange={(value) => {
                                updateBedStatus.mutate({
                                  bedId: bed.id,
                                  newStatus: value === "Limpo" ? "Disponível" : bed.status,
                                  newCleaningStatus: value,
                                });
                              }}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Status da limpeza" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Em Progresso">Em Progresso</SelectItem>
                                <SelectItem value="Limpo">Limpo</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        )}
                      </div>
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

export default StaffBedManagement;
