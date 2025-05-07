
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Hospital, User, Smartphone, FileText, Phone, Bed } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';


import mockData from '../data/mockData.json';

const iconMap: Record<string, React.ReactNode> = {
  hospital: <Hospital className="h-8 w-8 text-white" />,
  user: <User className="h-8 w-8 text-white" />,
  smartphone: <Smartphone className="h-8 w-8 text-white" />,
  "file-text": <FileText className="h-8 w-8 text-white" />,
  phone: <Phone className="h-8 w-8 text-white" />,
  bed: <Bed className="h-8 w-8 text-white" />
};

const Services: React.FC = () => {
  
  const { data: services, isLoading } = useQuery({
    queryKey: ['services'],
    queryFn: () => Promise.resolve(mockData.services),
  });

  if (isLoading) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-2">Nossos Serviços</h2>
            <p className="text-gray-600">Carregando...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-2">Nossos Serviços</h2>
          <p className="text-gray-600 max-w-3xl mx-auto">
            O smart care oferece um dashboard com serviços de saúde e com tecnologia de ponta.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service) => (
            <Card key={service.id} className="service-card hover:border-sabara-primary hover:border transition-all">
              <CardContent className="pt-6">
                <div className="mb-4 bg-sabara-primary rounded-lg w-16 h-16 flex items-center justify-center">
                  {iconMap[service.icon]}
                </div>
                <h3 className="text-xl font-semibold mb-2">{service.name}</h3>
                <p className="text-gray-600">{service.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
