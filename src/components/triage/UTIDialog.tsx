
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface UTIBed {
  id: string;
  name: string;
  status: string;
}

interface UTIDialogProps {
  triageId: number | null;
  open: boolean;
  onClose: () => void;
  onAssign: (triageId: number, bedId: string) => void;
}

const UTIDialog: React.FC<UTIDialogProps> = ({
  triageId,
  open,
  onClose,
  onAssign
}) => {
  const [availableBeds, setAvailableBeds] = useState<UTIBed[]>([]);
  const [selectedBed, setSelectedBed] = useState<string>('');

  useEffect(() => {
    if (open) {
      // Get available UTI beds from localStorage
      const beds = JSON.parse(localStorage.getItem('beds') || '[]');
      const utiBeds = beds.filter((bed: any) => 
        bed.type === 'UTI' && bed.status === 'available'
      );
      setAvailableBeds(utiBeds);
      setSelectedBed(utiBeds.length > 0 ? utiBeds[0].id : '');
    }
  }, [open]);

  const handleAssign = () => {
    if (triageId !== null && selectedBed) {
      onAssign(triageId, selectedBed);
      onClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Encaminhar Paciente para UTI</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          {availableBeds.length > 0 ? (
            <div className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="bed" className="text-sm font-medium">
                  Selecione um Leito de UTI
                </label>
                <Select value={selectedBed} onValueChange={setSelectedBed}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um leito" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableBeds.map((bed) => (
                      <SelectItem key={bed.id} value={bed.id}>
                        {bed.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          ) : (
            <p className="text-center text-amber-600">
              Não há leitos de UTI disponíveis no momento.
            </p>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button 
            onClick={handleAssign}
            disabled={!selectedBed || availableBeds.length === 0}
          >
            Encaminhar para UTI
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UTIDialog;
