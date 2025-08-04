'use client';

import { useState, useEffect } from 'react';
import { Edit, Trash2, User, Home, DollarSign, Calendar, Phone, Mail } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { EditUnitForm } from './edit-unit-form';
import { tenantStorage, paymentStorage } from '@/lib/storage';
import { format } from 'date-fns';

interface UnitDetailsProps {
  unit: any;
  onEdit: (unitId: string, updates: any) => void;
  onDelete: (unitId: string) => void;
}

export function UnitDetails({ unit, onEdit, onDelete }: UnitDetailsProps) {
  const [showEditForm, setShowEditForm] = useState(false);
  const [tenant, setTenant] = useState<any>(null);
  const [payments, setPayments] = useState<any[]>([]);

  useEffect(() => {
    if (unit.status === 'occupied') {
      const unitTenant = tenantStorage.findByUnit(unit.id)[0];
      const unitPayments = paymentStorage.getAll().filter((p: any) => p.unitId === unit.id);
      setTenant(unitTenant);
      setPayments(unitPayments);
    } else {
      setTenant(null);
      setPayments([]);
    }
  }, [unit]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'occupied':
        return 'bg-green-100 text-green-800';
      case 'vacant':
        return 'bg-yellow-100 text-yellow-800';
      case 'maintenance':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleEdit = (updates: any) => {
    onEdit(unit.id, updates);
    setShowEditForm(false);
  };

  if (showEditForm) {
    return (
      <EditUnitForm
        unit={unit}
        onSave={handleEdit}
        onCancel={() => setShowEditForm(false)}
      />
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-2xl">Unit {unit.unitNumber}</CardTitle>
            <div className="flex items-center space-x-2 mt-2">
              <Badge className={getStatusColor(unit.status)}>
                {unit.status}
              </Badge>
              <span className="text-sm text-gray-500 capitalize">{unit.type}</span>
            </div>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" onClick={() => setShowEditForm(true)}>
              <Edit className="h-4 w-4 mr-2" />
              Edit Unit
            </Button>
            <Button variant="destructive" onClick={() => onDelete(unit.id)}>
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </Button>
          </div>
        </CardHeader>
      </Card>

      <Tabs defaultValue="details" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="details">Unit Details</TabsTrigger>
          <TabsTrigger value="tenant">Tenant Info</TabsTrigger>
          <TabsTrigger value="payments">Payment History</TabsTrigger>
        </TabsList>

        <TabsContent value="details" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Home className="h-5 w-5 mr-2" />
                  Unit Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Unit Number</label>
                    <p className="text-lg font-semibold">{unit.unitNumber}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Type</label>
                    <p className="text-lg font-semibold capitalize">{unit.type}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Size</label>
                    <p className="text-lg font-semibold">{unit.size} sq ft</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Status</label>
                    <Badge className={getStatusColor(unit.status)}>
                      {unit.status}
                    </Badge>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Description</label>
                  <p className="text-sm text-gray-900">{unit.description || 'No description available'}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <DollarSign className="h-5 w-5 mr-2" />
                  Financial Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Monthly Rent</label>
                    <p className="text-xl font-bold text-green-600">
                      KSh {unit.rentAmount.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Security Deposit</label>
                    <p className="text-xl font-bold text-blue-600">
                      KSh {unit.deposit.toLocaleString()}
                    </p>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Amenities</label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {unit.amenities.map((amenity: string, index: number) => (
                      <Badge key={index} variant="outline">
                        {amenity}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="tenant" className="space-y-4">
          {tenant ? (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="h-5 w-5 mr-2" />
                  Current Tenant
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Full Name</label>
                      <p className="text-lg font-semibold">
                        {tenant.firstName} {tenant.lastName}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">ID Number</label>
                      <p className="text-sm text-gray-900">{tenant.idNumber}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Mail className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-900">{tenant.email}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Phone className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-900">{tenant.phone}</span>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Lease Period</label>
                      <p className="text-sm text-gray-900">
                        {format(new Date(tenant.leaseStart), 'MMM dd, yyyy')} - {format(new Date(tenant.leaseEnd), 'MMM dd, yyyy')}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Monthly Rent</label>
                      <p className="text-lg font-semibold text-green-600">
                        KSh {tenant.rentAmount.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Emergency Contact</label>
                      <p className="text-sm text-gray-900">
                        {tenant.emergencyContact.name} ({tenant.emergencyContact.relationship})
                      </p>
                      <p className="text-sm text-gray-600">{tenant.emergencyContact.phone}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="flex items-center justify-center py-12">
                <div className="text-center">
                  <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Tenant Assigned</h3>
                  <p className="text-gray-500 mb-4">This unit is currently {unit.status}</p>
                  <Button>Assign Tenant</Button>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="payments" className="space-y-4">
          {payments.length > 0 ? (
            <Card>
              <CardHeader>
                <CardTitle>Payment History</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {payments.map((payment) => (
                    <div key={payment.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <p className="font-medium">KSh {payment.amount.toLocaleString()}</p>
                        <p className="text-sm text-gray-500">
                          Due: {format(new Date(payment.dueDate), 'MMM dd, yyyy')}
                        </p>
                      </div>
                      <Badge className={
                        payment.status === 'paid' ? 'bg-green-100 text-green-800' :
                        payment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }>
                        {payment.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="flex items-center justify-center py-12">
                <div className="text-center">
                  <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Payment History</h3>
                  <p className="text-gray-500">Payment records will appear here once tenant is assigned</p>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}