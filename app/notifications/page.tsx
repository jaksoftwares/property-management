'use client';

import { useEffect, useState } from 'react';
import { Plus, Send, Users, Mail, MessageSquare } from 'lucide-react';
import { Sidebar } from '@/components/layout/sidebar';
import { Header } from '@/components/layout/header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { notificationStorage } from '@/lib/storage';
import { format } from 'date-fns';

export default function Notifications() {
  const [notifications, setNotifications] = useState<any[]>([]);

  useEffect(() => {
    setNotifications(notificationStorage.getAll());
  }, []);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'rent-due':
        return '💰';
      case 'maintenance':
        return '🔧';
      case 'lease-expiry':
        return '📋';
      case 'general':
        return '📢';
      default:
        return '📨';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'sent':
        return 'bg-green-100 text-green-800';
      case 'draft':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getMethodIcon = (method: string) => {
    switch (method) {
      case 'email':
        return <Mail className="h-4 w-4" />;
      case 'sms':
        return <MessageSquare className="h-4 w-4" />;
      case 'both':
        return <Users className="h-4 w-4" />;
      default:
        return <Mail className="h-4 w-4" />;
    }
  };

  const sentNotifications = notifications.filter(n => n.status === 'sent');
  const draftNotifications = notifications.filter(n => n.status === 'draft');

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden lg:ml-0">
        <Header 
          title="Notifications" 
          subtitle="Send messages and reminders to tenants"
        />
        
        <main className="flex-1 overflow-y-auto p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Communication Center</h2>
              <p className="text-sm text-gray-600">
                Send rent reminders, maintenance updates, and announcements
              </p>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline">
                <Send className="h-4 w-4 mr-2" />
                Bulk Reminder
              </Button>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                New Message
              </Button>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card className="cursor-pointer hover:shadow-md transition-shadow">
              <CardContent className="flex items-center p-6">
                <div className="p-2 bg-blue-100 rounded-lg mr-4">
                  <Mail className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-medium">Rent Reminders</h3>
                  <p className="text-sm text-gray-500">Send to all tenants</p>
                </div>
              </CardContent>
            </Card>
            
            <Card className="cursor-pointer hover:shadow-md transition-shadow">
              <CardContent className="flex items-center p-6">
                <div className="p-2 bg-green-100 rounded-lg mr-4">
                  <MessageSquare className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-medium">Maintenance Notice</h3>
                  <p className="text-sm text-gray-500">Update on repairs</p>
                </div>
              </CardContent>
            </Card>
            
            <Card className="cursor-pointer hover:shadow-md transition-shadow">
              <CardContent className="flex items-center p-6">
                <div className="p-2 bg-yellow-100 rounded-lg mr-4">
                  <Users className="h-6 w-6 text-yellow-600" />
                </div>
                <div>
                  <h3 className="font-medium">General Notice</h3>
                  <p className="text-sm text-gray-500">Building announcement</p>
                </div>
              </CardContent>
            </Card>
            
            <Card className="cursor-pointer hover:shadow-md transition-shadow">
              <CardContent className="flex items-center p-6">
                <div className="p-2 bg-purple-100 rounded-lg mr-4">
                  <Send className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-medium">Custom Message</h3>
                  <p className="text-sm text-gray-500">Personalized notice</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="history" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="history">Message History</TabsTrigger>
              <TabsTrigger value="drafts">Drafts ({draftNotifications.length})</TabsTrigger>
            </TabsList>
            
            <TabsContent value="history" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Sent Messages</CardTitle>
                </CardHeader>
                <CardContent>
                  {sentNotifications.length === 0 ? (
                    <div className="text-center py-8">
                      <Send className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No messages sent yet</h3>
                      <p className="text-gray-500 mb-4">Start communicating with your tenants</p>
                      <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        Send First Message
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {sentNotifications.map((notification) => (
                        <div key={notification.id} className="flex items-start space-x-4 p-4 border rounded-lg">
                          <div className="text-2xl">{getTypeIcon(notification.type)}</div>
                          <div className="flex-1 space-y-2">
                            <div className="flex items-start justify-between">
                              <div>
                                <h3 className="font-medium">{notification.title}</h3>
                                <p className="text-sm text-gray-600 mt-1">
                                  {notification.message}
                                </p>
                              </div>
                              <Badge className={getStatusColor(notification.status)}>
                                {notification.status}
                              </Badge>
                            </div>
                            <div className="flex items-center space-x-4 text-sm text-gray-500">
                              <div className="flex items-center space-x-1">
                                {getMethodIcon(notification.method)}
                                <span>{notification.method}</span>
                              </div>
                              <span>•</span>
                              <span>{notification.recipients.length} recipients</span>
                              <span>•</span>
                              <span>
                                {notification.sentDate 
                                  ? format(new Date(notification.sentDate), 'MMM dd, yyyy - HH:mm')
                                  : 'Not sent'
                                }
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="drafts" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Draft Messages</CardTitle>
                </CardHeader>
                <CardContent>
                  {draftNotifications.length === 0 ? (
                    <div className="text-center py-8">
                      <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No drafts</h3>
                      <p className="text-gray-500">All your draft messages will appear here</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {draftNotifications.map((notification) => (
                        <div key={notification.id} className="flex items-start space-x-4 p-4 border rounded-lg">
                          <div className="text-2xl">{getTypeIcon(notification.type)}</div>
                          <div className="flex-1">
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <h3 className="font-medium">{notification.title}</h3>
                                <p className="text-sm text-gray-600 mt-1">
                                  {notification.message}
                                </p>
                              </div>
                              <div className="flex space-x-2">
                                <Button size="sm" variant="outline">
                                  Edit
                                </Button>
                                <Button size="sm">
                                  Send
                                </Button>
                              </div>
                            </div>
                            <div className="flex items-center space-x-4 text-sm text-gray-500">
                              <div className="flex items-center space-x-1">
                                {getMethodIcon(notification.method)}
                                <span>{notification.method}</span>
                              </div>
                              <span>•</span>
                              <span>{notification.recipients.length} recipients</span>
                              <span>•</span>
                              <span>
                                Created {format(new Date(notification.createdAt), 'MMM dd, yyyy')}
                              </span>
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