'use client';

import { useEffect, useState } from 'react';
import { Plus, Search, Filter, Wrench } from 'lucide-react';
import { TenantSidebar } from '@/components/tenant/tenant-sidebar';
import { TenantHeader } from '@/components/tenant/tenant-header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { currentTenantStorage } from '@/lib/tenant-storage';
import { maintenanceStorage } from '@/lib/storage';
import { formatDistanceToNow } from 'date-fns';

export default function TenantMaintenance() {
  const [currentTenant, setCurrentTenant] = useState<any>(null);
  const [requests, setRequests] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const tenant = currentTenantStorage.get();
    if (!tenant) {
      window.location.href = '/tenant/login';
      return;
    }

    setCurrentTenant(tenant);
    const tenantRequests = maintenanceStorage.getAll().filter(
      (req: any) => req.tenantId === tenant.tenantId
    );
    setRequests(tenantRequests);
  }, []);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'high':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'plumbing':
        return '🔧';
      case 'electrical':
        return '⚡';
      case 'hvac':
        return '❄️';
      case 'appliance':
        return '🏠';
      case 'structural':
        return '🏗️';
      default:
        return '🔨';
    }
  };

  const filteredRequests = requests.filter(request =>
    request.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    request.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    request.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
          title="Maintenance Requests" 
          subtitle="Submit and track your maintenance requests"
        />
        
        <main className="flex-1 overflow-y-auto p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Your Maintenance Requests</h2>
              <p className="text-sm text-gray-600">
                {requests.length} total requests
              </p>
            </div>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Request
            </Button>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search maintenance requests..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
          </div>

          {filteredRequests.length === 0 ? (
            <div className="text-center py-12">
              <div className="mx-auto h-12 w-12 text-gray-400">
                <Wrench className="h-12 w-12" />
              </div>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No maintenance requests</h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchTerm ? 'Try adjusting your search criteria.' : 'Get started by submitting your first maintenance request.'}
              </p>
              {!searchTerm && (
                <div className="mt-6">
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Submit Request
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredRequests.map((request) => (
                <Card key={request.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="text-lg">{getCategoryIcon(request.category)}</span>
                        <div>
                          <CardTitle className="text-lg">{request.title}</CardTitle>
                          <p className="text-sm text-gray-500 capitalize">
                            {request.category}
                          </p>
                        </div>
                      </div>
                      <Badge variant="outline" className={getPriorityColor(request.priority)}>
                        {request.priority}
                      </Badge>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <p className="text-sm text-gray-700 line-clamp-3">
                      {request.description}
                    </p>
                    
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Submitted:</span>
                        <span className="font-medium">
                          {formatDistanceToNow(new Date(request.createdAt), { addSuffix: true })}
                        </span>
                      </div>
                      {request.assignedTo && (
                        <div className="flex justify-between">
                          <span className="text-gray-500">Assigned to:</span>
                          <span className="font-medium">{request.assignedTo}</span>
                        </div>
                      )}
                      {request.estimatedCost && (
                        <div className="flex justify-between">
                          <span className="text-gray-500">Est. Cost:</span>
                          <span className="font-medium">
                            KSh {request.estimatedCost.toLocaleString()}
                          </span>
                        </div>
                      )}
                      {request.completedDate && (
                        <div className="flex justify-between">
                          <span className="text-gray-500">Completed:</span>
                          <span className="font-medium">
                            {formatDistanceToNow(new Date(request.completedDate), { addSuffix: true })}
                          </span>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Badge className={getStatusColor(request.status)}>
                        {request.status.replace('-', ' ')}
                      </Badge>
                      
                      {request.status === 'pending' && (
                        <Button size="sm" variant="outline">
                          Edit Request
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}