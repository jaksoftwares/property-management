'use client';

import { useEffect, useState } from 'react';
import { Bell, Mail, MessageSquare, AlertTriangle, Calendar, BookMarked as MarkAsRead } from 'lucide-react';
import { TenantSidebar } from '@/components/tenant/tenant-sidebar';
import { TenantHeader } from '@/components/tenant/tenant-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { currentTenantStorage, tenantNotificationStorage } from '@/lib/tenant-storage';
import { formatDistanceToNow } from 'date-fns';

export default function TenantNotifications() {
  const [currentTenant, setCurrentTenant] = useState<any>(null);
  const [notifications, setNotifications] = useState<any[]>([]);

  useEffect(() => {
    const tenant = currentTenantStorage.get();
    if (!tenant) {
      window.location.href = '/tenant/login';
      return;
    }

    setCurrentTenant(tenant);
    const tenantNotifications = tenantNotificationStorage.findByTenant(tenant.tenantId);
    setNotifications(tenantNotifications);
  }, []);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'rent-due':
        return <MessageSquare className="h-5 w-5 text-green-600" />;
      case 'maintenance':
        return <AlertTriangle className="h-5 w-5 text-orange-600" />;
      case 'lease-expiry':
        return <Calendar className="h-5 w-5 text-blue-600" />;
      case 'general':
        return <Bell className="h-5 w-5 text-purple-600" />;
      default:
        return <Mail className="h-5 w-5 text-gray-600" />;
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

  const markAsRead = (notificationId: string) => {
    tenantNotificationStorage.update(notificationId, { isRead: true });
    setNotifications(tenantNotificationStorage.findByTenant(currentTenant.tenantId));
  };

  const markAllAsRead = () => {
    notifications.forEach(notification => {
      if (!notification.isRead) {
        tenantNotificationStorage.update(notification.id, { isRead: true });
      }
    });
    setNotifications(tenantNotificationStorage.findByTenant(currentTenant.tenantId));
  };

  const unreadNotifications = notifications.filter(n => !n.isRead);
  const readNotifications = notifications.filter(n => n.isRead);

  if (!currentTenant) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <TenantSidebar />
      <div className="flex-1 flex flex-col overflow-hidden lg:ml-0">
        <TenantHeader 
          title="Notifications" 
          subtitle="Stay updated with important messages and alerts"
          notificationCount={unreadNotifications.length}
        />
        
        <main className="flex-1 overflow-y-auto p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Your Notifications</h2>
              <p className="text-sm text-gray-600">
                {unreadNotifications.length} unread, {notifications.length} total
              </p>
            </div>
            {unreadNotifications.length > 0 && (
              <Button onClick={markAllAsRead}>
                <MarkAsRead className="h-4 w-4 mr-2" />
                Mark All as Read
              </Button>
            )}
          </div>

          <Tabs defaultValue="unread" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="unread">
                Unread ({unreadNotifications.length})
              </TabsTrigger>
              <TabsTrigger value="all">
                All Notifications ({notifications.length})
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="unread" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Unread Notifications</CardTitle>
                </CardHeader>
                <CardContent>
                  {unreadNotifications.length === 0 ? (
                    <div className="text-center py-8">
                      <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">All caught up!</h3>
                      <p className="text-gray-500">You have no unread notifications.</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {unreadNotifications.map((notification) => (
                        <div 
                          key={notification.id} 
                          className="p-4 bg-blue-50 border border-blue-200 rounded-lg"
                        >
                          <div className="flex items-start space-x-3">
                            <div className="flex-shrink-0 mt-1">
                              {getTypeIcon(notification.type)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <h4 className="text-sm font-medium text-gray-900">
                                    {notification.title}
                                  </h4>
                                  <p className="text-sm text-gray-700 mt-1">
                                    {notification.message}
                                  </p>
                                </div>
                                <div className="flex flex-col items-end space-y-2 ml-4">
                                  <Badge variant="outline" className={getTypeColor(notification.type)}>
                                    {notification.type.replace('-', ' ')}
                                  </Badge>
                                  <Button 
                                    size="sm" 
                                    variant="outline"
                                    onClick={() => markAsRead(notification.id)}
                                  >
                                    Mark as Read
                                  </Button>
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
            </TabsContent>
            
            <TabsContent value="all" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>All Notifications</CardTitle>
                </CardHeader>
                <CardContent>
                  {notifications.length === 0 ? (
                    <div className="text-center py-8">
                      <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No notifications yet</h3>
                      <p className="text-gray-500">
                        You'll receive notifications about rent, maintenance, and other important updates here.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {notifications.map((notification) => (
                        <div 
                          key={notification.id} 
                          className={`p-4 rounded-lg border ${
                            !notification.isRead 
                              ? 'bg-blue-50 border-blue-200' 
                              : 'bg-gray-50 border-gray-200'
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
                                  <p className="text-sm text-gray-600 mt-1">
                                    {notification.message}
                                  </p>
                                </div>
                                <div className="flex flex-col items-end space-y-1 ml-4">
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
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
}