
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import mockData from '../data/mockData.json';
import { Card, CardContent } from '@/components/ui/card';
import { User, Bed, Smartphone, FileText, Phone, Hospital } from 'lucide-react';

const ServicesList = () => {
  const { data: services, isLoading } = useQuery({
    queryKey: ['services'],
    queryFn: () => Promise.resolve(mockData.services),
  });

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'user':
        return <User className="h-12 w-12 text-sabara-primary mb-4" />;
      case 'bed':
        return <Bed className="h-12 w-12 text-sabara-primary mb-4" />;
      case 'smartphone':
        return <Smartphone className="h-12 w-12 text-sabara-primary mb-4" />;
      case 'file-text':
        return <FileText className="h-12 w-12 text-sabara-primary mb-4" />;
      case 'phone':
        return <Phone className="h-12 w-12 text-sabara-primary mb-4" />;
      case 'hospital':
        return <Hospital className="h-12 w-12 text-sabara-primary mb-4" />;
      default:
        return null;
    }
  };

  if (isLoading) {
    return <div>Carregando...</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {services.map((service) => (
        <Card key={service.id} className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            {getIcon(service.icon)}
            <h3 className="text-xl font-semibold mb-2">{service.name}</h3>
            <p className="text-gray-600">{service.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ServicesList;
