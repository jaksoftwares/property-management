'use client';

import { useEffect, useState } from 'react';
import { Download, FileText, Calendar, DollarSign, User, Home } from 'lucide-react';
import { TenantSidebar } from '@/components/tenant/tenant-sidebar';
import { TenantHeader } from '@/components/tenant/tenant-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { currentTenantStorage } from '@/lib/tenant-storage';
import { tenantStorage, unitStorage, apartmentStorage } from '@/lib/storage';
import { format, differenceInDays } from 'date-fns';

export default function TenantLease() {
  const [currentTenant, setCurrentTenant] = useState<any>(null);
  const [tenantData, setTenantData] = useState<any>(null);
  const [unitData, setUnitData] = useState<any>(null);
  const [apartmentData, setApartmentData] = useState<any>(null);

  useEffect(() => {
    const tenant = currentTenantStorage.get();
    if (!tenant) {
      window.location.href = '/tenant/login';
      return;
    }

    setCurrentTenant(tenant);
    
    const tenantInfo = tenantStorage.findById(tenant.tenantId);
    const unitInfo = unitStorage.findById(tenant.unitId);
    const apartmentInfo = apartmentStorage.findById(tenant.apartmentId);
    
    setTenantData(tenantInfo);
    setUnitData(unitInfo);
    setApartmentData(apartmentInfo);
  }, []);

  if (!currentTenant || !tenantData || !unitData || !apartmentData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading lease details...</p>
        </div>
      </div>
    );
  }

  const daysUntilExpiry = differenceInDays(new Date(tenantData.leaseEnd), new Date());
  const isLeaseExpiringSoon = daysUntilExpiry <= 60;

  return (
    <div className="flex h-screen bg-gray-50">
      <TenantSidebar />
      <div className="flex-1 flex flex-col overflow-hidden lg:ml-0">
        <TenantHeader 
          title="Lease Agreement" 
          subtitle="View your lease details and contract information"
        />
        
        <main className="flex-1 overflow-y-auto p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Lease Details</h2>
              <p className="text-sm text-gray-600">
                Unit {unitData.unitNumber} - {apartmentData.name}
              </p>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Download Contract
              </Button>
              <Button>
                <FileText className="h-4 w-4 mr-2" />
                Request Renewal
              </Button>
            </div>
          </div>

          {/* Lease Status Alert */}
          {isLeaseExpiringSoon && (
            <Card className="mb-6 border-orange-200 bg-orange-50">
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <Calendar className="h-5 w-5 text-orange-600" />
                  <div>
                    <h3 className="font-medium text-orange-900">Lease Expiring Soon</h3>
                    <p className="text-sm text-orange-700">
                      Your lease expires in {daysUntilExpiry} days. Contact property management to discuss renewal options.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Personal Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <User className="h-5 w-5" />
                  <span>Personal Information</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Full Name</label>
                    <p className="text-sm text-gray-900">
                      {tenantData.firstName} {tenantData.lastName}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">ID Number</label>
                    <p className="text-sm text-gray-900">{tenantData.idNumber}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Email</label>
                    <p className="text-sm text-gray-900">{tenantData.email}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Phone</label>
                    <p className="text-sm text-gray-900">{tenantData.phone}</p>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Emergency Contact</label>
                  <div className="text-sm text-gray-900">
                    <p>{tenantData.emergencyContact.name}</p>
                    <p>{tenantData.emergencyContact.phone}</p>
                    <p className="text-gray-600">({tenantData.emergencyContact.relationship})</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Property Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Home className="h-5 w-5" />
                  <span>Property Information</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Property</label>
                  <p className="text-sm text-gray-900">{apartmentData.name}</p>
                  <p className="text-xs text-gray-600">{apartmentData.address}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Unit Number</label>
                    <p className="text-sm text-gray-900">{unitData.unitNumber}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Unit Type</label>
                    <p className="text-sm text-gray-900 capitalize">{unitData.type}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Size</label>
                    <p className="text-sm text-gray-900">{unitData.size} sq ft</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Status</label>
                    <Badge className="bg-green-100 text-green-800">
                      {tenantData.status}
                    </Badge>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Amenities</label>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {unitData.amenities.map((amenity: string, index: number) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {amenity}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Lease Terms */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Calendar className="h-5 w-5" />
                  <span>Lease Terms</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Lease Start</label>
                    <p className="text-sm text-gray-900">
                      {format(new Date(tenantData.leaseStart), 'MMM dd, yyyy')}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Lease End</label>
                    <p className="text-sm text-gray-900">
                      {format(new Date(tenantData.leaseEnd), 'MMM dd, yyyy')}
                    </p>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Days Until Expiry</label>
                  <p className={`text-sm font-medium ${
                    isLeaseExpiringSoon ? 'text-orange-600' : 'text-gray-900'
                  }`}>
                    {daysUntilExpiry} days
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Financial Terms */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <DollarSign className="h-5 w-5" />
                  <span>Financial Terms</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Monthly Rent</label>
                    <p className="text-lg font-semibold text-gray-900">
                      KSh {tenantData.rentAmount.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Security Deposit</label>
                    <p className="text-lg font-semibold text-gray-900">
                      KSh {tenantData.deposit.toLocaleString()}
                    </p>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Payment Due Date</label>
                  <p className="text-sm text-gray-900">1st of every month</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Contract Document */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FileText className="h-5 w-5" />
                <span>Contract Document</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <FileText className="h-8 w-8 text-blue-600" />
                  <div>
                    <h4 className="font-medium text-gray-900">Lease Agreement.pdf</h4>
                    <p className="text-sm text-gray-500">
                      Signed on {format(new Date(tenantData.leaseStart), 'MMM dd, yyyy')}
                    </p>
                  </div>
                </div>
                <Button variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}