
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useQuery } from '@tanstack/react-query';
import mockData from '../data/mockData.json';
import { Card, CardContent } from '@/components/ui/card';

const MedicalTeam = () => {
  const { data: doctors, isLoading } = useQuery({
    queryKey: ['doctors'],
    queryFn: () => Promise.resolve(mockData.doctors),
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow pt-16">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-sabara-primary mb-8">Nossa Equipe Médica</h1>
          
          {isLoading ? (
            <div className="text-center">Carregando...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {doctors.map((doctor) => (
                <Card key={doctor.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <img
                      src={doctor.imageUrl || "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d"}
                      alt={doctor.name}
                      className="w-full h-48 object-cover rounded-lg mb-4"
                    />
                    <h3 className="text-xl font-semibold mb-2">{doctor.name}</h3>
                    <p className="text-sabara-primary mb-4">{doctor.specialty}</p>
                    <div className="space-y-2">
                      <h4 className="font-medium">Horários de Atendimento:</h4>
                      {doctor.availability.map((slot, index) => (
                        <p key={index} className="text-gray-600">
                          {slot.day}: {slot.hours}
                        </p>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default MedicalTeam;
