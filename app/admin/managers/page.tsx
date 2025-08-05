'use client';

import { useEffect, useState } from 'react';
import { Plus, Search, Filter, MoreHorizontal, Edit, Trash2, Eye } from 'lucide-react';
import { AdminSidebar } from '@/components/admin/admin-sidebar';
import { AdminHeader } from '@/components/admin/admin-header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { currentAdminStorage, propertyManagerStorage } from '@/lib/admin-storage';
import { format } from 'date-fns';

export default function PropertyManagers() {
  const [currentAdmin, setCurrentAdmin] = useState<any>(null);
  const [managers, setManagers] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const admin = currentAdminStorage.get();
    if (!admin) {
      window.location.href = '/admin/login';
      return;
    }

    setCurrentAdmin(admin);
    setManagers(propertyManagerStorage.getAll());
  }, []);

  const filteredManagers = managers.filter(manager =>
    `${manager.firstName} ${manager.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    manager.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    manager.company?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleToggleStatus = (id: string, currentStatus: boolean) => {
    propertyManagerStorage.update(id, { isActive: !currentStatus });
    setManagers(propertyManagerStorage.getAll());
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this property manager?')) {
      propertyManagerStorage.delete(id);
      setManagers(propertyManagerStorage.getAll());
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'owner':
        return 'bg-purple-100 text-purple-800';
      case 'manager':
        return 'bg-blue-100 text-blue-800';
      case 'caretaker':
        return 'bg-green-100 text-green-800';
      case 'accountant':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (!currentAdmin) {
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
      <AdminSidebar />
      <div className="flex-1 flex flex-col overflow-hidden lg:ml-0">
        <AdminHeader 
          title="Property Managers" 
          subtitle="Manage property manager accounts and permissions"
        />
        
        <main className="flex-1 overflow-y-auto p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Property Manager Directory</h2>
              <p className="text-sm text-gray-600">
                {managers.length} total managers, {managers.filter(m => m.isActive).length} active
              </p>
            </div>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Manager
            </Button>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search managers by name, email, or company..."
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

          <Card>
            <CardHeader>
              <CardTitle>Property Managers</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Manager</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Company</TableHead>
                      <TableHead>Properties</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Last Login</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredManagers.map((manager) => (
                      <TableRow key={manager.id}>
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            <Avatar>
                              <AvatarFallback className="bg-blue-100 text-blue-600">
                                {manager.firstName[0]}{manager.lastName[0]}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium text-gray-900">
                                {manager.firstName} {manager.lastName}
                              </div>
                              <div className="text-sm text-gray-500">{manager.email}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={getRoleColor(manager.role)}>
                            {manager.role}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm text-gray-900">{manager.company || '-'}</div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm text-gray-900">
                            {manager.managedProperties?.length || 0} properties
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={manager.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                            {manager.isActive ? 'Active' : 'Inactive'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm text-gray-900">
                            {manager.lastLogin 
                              ? format(new Date(manager.lastLogin), 'MMM dd, yyyy')
                              : 'Never'
                            }
                          </div>
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <Eye className="h-4 w-4 mr-2" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Edit className="h-4 w-4 mr-2" />
                                Edit Manager
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                onClick={() => handleToggleStatus(manager.id, manager.isActive)}
                              >
                                {manager.isActive ? 'Deactivate' : 'Activate'}
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                onClick={() => handleDelete(manager.id)}
                                className="text-red-600"
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete Manager
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}