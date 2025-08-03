'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Bell, Mail, MessageSquare, AlertTriangle, Calendar } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface NotificationsPreviewProps {
  notifications: Array<{
    id: string;
    title: string;
    message: string;
    type: 'rent-due' | 'maintenance' | 'general' | 'lease-expiry';
    isRead: boolean;
    createdAt: string;
  }>;
}

export function NotificationsPreview({ notifications }: NotificationsPreviewProps) {
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'rent-due':
        return <MessageSquare className="h-4 w-4 text-green-600" />;
      case 'maintenance':
        return <AlertTriangle className="h-4 w-4 text-orange-600" />;
      case 'lease-expiry':
        return <Calendar className="h-4 w-4 text-blue-600" />;
      case 'general':
        return <Bell className="h-4 w-4 text-purple-600" />;
      default:
        return <Mail className="h-4 w-4 text-gray-600" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'rent-due':
        return 'bg-green-100 text-green-800';
      case 'maintenance':
        return 'bg-orange-100 text-orange-800';
      case 'lease-expiry':
        return 'bg-blue-100 text-blue-800';
      case 'general':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const unreadNotifications = notifications.filter(n => !n.isRead);
  const recentNotifications = notifications.slice(0, 4);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center space-x-2">
          <CardTitle className="text-lg">Recent Notifications</CardTitle>
          {unreadNotifications.length > 0 && (
            <Badge className="bg-red-100 text-red-800">
              {unreadNotifications.length} new
            </Badge>
          )}
        </div>
        <Button variant="outline" size="sm">
          View All
        </Button>
      </CardHeader>
      <CardContent>
        {recentNotifications.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-gray-400 mb-4">
              <Bell className="h-12 w-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Notifications</h3>
            <p className="text-gray-500">
              You're all caught up! New notifications will appear here.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {recentNotifications.map((notification) => (
              <div 
                key={notification.id} 
                className={`p-3 rounded-lg border ${
                  !notification.isRead ? 'bg-blue-50 border-blue-200' : 'bg-gray-50 border-gray-200'
                }`}
              >
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 mt-1">
                    {getTypeIcon(notification.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className={`text-sm font-medium ${
                          !notification.isRead ? 'text-gray-900' : 'text-gray-700'
                        }`}>
                          {notification.title}
                        </h4>
                        <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                          {notification.message}
                        </p>
                      </div>
                      <div className="flex flex-col items-end space-y-1 ml-2">
                        <Badge variant="outline" className={getTypeColor(notification.type)}>
                          {notification.type.replace('-', ' ')}
                        </Badge>
                        {!notification.isRead && (
                          <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                        )}
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}