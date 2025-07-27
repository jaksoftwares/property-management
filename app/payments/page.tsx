'use client';

import { useEffect, useState } from 'react';
import { Plus, Search, Filter, Download, DollarSign, Clock, AlertTriangle } from 'lucide-react';
import { Sidebar } from '@/components/layout/sidebar';
import { Header } from '@/components/layout/header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { paymentStorage, tenantStorage, unitStorage, apartmentStorage } from '@/lib/storage';
import { format } from 'date-fns';

export default function Payments() {
  const [payments, setPayments] = useState<any[]>([]);
  const [tenants, setTenants] = useState<any[]>([]);
  const [units, setUnits] = useState<any[]>([]);
  const [apartments, setApartments] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    setPayments(paymentStorage.getAll());
    setTenants(tenantStorage.getAll());
    setUnits(unitStorage.getAll());
    setApartments(apartmentStorage.getAll());
  }, []);

  const getTenantInfo = (tenantId: string) => {
    return tenants.find(tenant => tenant.id === tenantId);
  };

  const getUnitInfo = (unitId: string) => {
    return units.find(unit => unit.id === unitId);
  };

  const getApartmentInfo = (apartmentId: string) => {
    return apartments.find(apt => apt.id === apartmentId);
  };

  const getPaymentStats = () => {
    const totalCollected = payments
      .filter(p => p.status === 'paid')
      .reduce((sum, p) => sum + p.amount, 0);
    
    const pending = payments.filter(p => p.status === 'pending').length;
    const overdue = payments.filter(p => p.status === 'overdue').length;
    
    return { totalCollected, pending, overdue };
  };

  const stats = getPaymentStats();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'overdue':
        return 'bg-red-100 text-red-800';
      case 'partial':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredPayments = payments.filter(payment => {
    const tenant = getTenantInfo(payment.tenantId);
    const unit = getUnitInfo(payment.unitId);
    const apartment = getApartmentInfo(payment.apartmentId);
    
    if (!tenant || !unit || !apartment) return false;
    
    const searchString = `${tenant.firstName} ${tenant.lastName} ${unit.unitNumber} ${apartment.name}`.toLowerCase();
    return searchString.includes(searchTerm.toLowerCase());
  });

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden lg:ml-0">
        <Header 
          title="Payments" 
          subtitle="Track rent collection and payment status"
        />
        
        <main className="flex-1 overflow-y-auto p-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  Total Collected
                </CardTitle>
                <DollarSign className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  KSh {stats.totalCollected.toLocaleString()}
                </div>
                <p className="text-xs text-gray-500 mt-1">This month</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  Pending Payments
                </CardTitle>
                <Clock className="h-4 w-4 text-yellow-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-600">
                  {stats.pending}
                </div>
                <p className="text-xs text-gray-500 mt-1">Due this month</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  Overdue Payments
                </CardTitle>
                <AlertTriangle className="h-4 w-4 text-red-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">
                  {stats.overdue}
                </div>
                <p className="text-xs text-gray-500 mt-1">Need attention</p>
              </CardContent>
            </Card>
          </div>

          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Payment Records</h2>
              <p className="text-sm text-gray-600">
                {payments.length} total payment records
              </p>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Record Payment
              </Button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by tenant name, unit, or property..."
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
              <CardTitle>Payment History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Tenant</TableHead>
                      <TableHead>Unit</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Due Date</TableHead>
                      <TableHead>Paid Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Method</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPayments.map((payment) => {
                      const tenant = getTenantInfo(payment.tenantId);
                      const unit = getUnitInfo(payment.unitId);
                      const apartment = getApartmentInfo(payment.apartmentId);
                      
                      if (!tenant || !unit || !apartment) return null;
                      
                      return (
                        <TableRow key={payment.id}>
                          <TableCell>
                            <div>
                              <div className="font-medium">
                                {tenant.firstName} {tenant.lastName}
                              </div>
                              <div className="text-sm text-gray-500">
                                {tenant.email}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div>
                              <div className="font-medium">{unit.unitNumber}</div>
                              <div className="text-sm text-gray-500">
                                {apartment.name}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="font-medium">
                            KSh {payment.amount.toLocaleString()}
                            {payment.penalty && (
                              <div className="text-sm text-red-600">
                                +KSh {payment.penalty} penalty
                              </div>
                            )}
                          </TableCell>
                          <TableCell>
                            {format(new Date(payment.dueDate), 'MMM dd, yyyy')}
                          </TableCell>
                          <TableCell>
                            {payment.paidDate 
                              ? format(new Date(payment.paidDate), 'MMM dd, yyyy')
                              : '-'
                            }
                          </TableCell>
                          <TableCell>
                            <Badge className={getStatusColor(payment.status)}>
                              {payment.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {payment.method 
                              ? payment.method.charAt(0).toUpperCase() + payment.method.slice(1)
                              : '-'
                            }
                          </TableCell>
                        </TableRow>
                      );
                    })}
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