
import React from 'react';
import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Notification {
  id: number;
  date: string;
  title: string;
  message: string;
  read: boolean;
}

interface PatientNotificationsProps {
  notifications: Notification[];
  onMarkAsRead: (notificationId: number) => void;
  formatDate: (date: string) => string;
}

const PatientNotifications: React.FC<PatientNotificationsProps> = ({ 
  notifications, 
  onMarkAsRead,
  formatDate 
}) => {
  if (!notifications || notifications.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <Bell className="mx-auto h-12 w-12 text-gray-300 mb-3" />
        <p>Não há notificações no momento.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {notifications.map((notification) => (
        <div 
          key={notification.id}
          className={`border rounded-lg p-4 transition-shadow ${
            notification.read ? 'bg-white' : 'bg-blue-50 border-blue-200'
          }`}
        >
          <div className="mb-2 flex justify-between items-start">
            <div className="flex items-center gap-2">
              {!notification.read && (
                <span className="h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
              )}
              <h3 className="font-medium">{notification.title}</h3>
            </div>
            <div className="text-xs text-gray-600">
              {formatDate(notification.date)}
            </div>
          </div>
          
          <p className="text-sm text-gray-700 mb-3">{notification.message}</p>
          
          {!notification.read && (
            <div className="text-right">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onMarkAsRead(notification.id)}
              >
                Marcar como lida
              </Button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default PatientNotifications;
