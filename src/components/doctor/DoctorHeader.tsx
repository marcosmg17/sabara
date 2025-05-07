
import React from 'react';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { UserRound } from 'lucide-react';

interface DoctorHeaderProps {
  title: string;
}

const DoctorHeader: React.FC<DoctorHeaderProps> = ({ title }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <UserRound className="h-5 w-5" />
          {title}
        </CardTitle>
      </CardHeader>
    </Card>
  );
};

export default DoctorHeader;
