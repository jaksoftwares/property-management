'use client';

import { useEffect, useState } from 'react';
import { TenantSidebar } from '@/components/tenant/tenant-sidebar';
import { TenantHeader } from '@/components/tenant/tenant-header';
import { TenantStatsCards } from '@/components/tenant/dashboard/tenant-stats-cards';
import { PaymentSummary } from '@/components/tenant/dashboard/payment-summary';
import { MaintenanceOverview } from '@/components/tenant/dashboard/maintenance-overview';
import { NotificationsPreview } from '@/components/tenant/dashboard/notifications-preview';
import { 
  currentTenantStorage, 
  tenantNotificationStorage 
} from '@/lib/tenant-storage';
import { 
  tenantStorage, 
  unitStorage, 
  apartmentStorage, 
  paymentStorage, 
  maintenanceStorage 
} from '@/lib/storage';
import { differenceInDays } from 'date-fns';

export default function TenantDashboard() {
  const [currentTenant, setCurrentTenant] = useState<any>(null);
  const [tenantData, setTenantData] = useState<any>(null);
  const [unitData, setUnitData] = useState<any>(null);
  const [apartmentData, setApartmentData] = useState<any>(null);
  const [payments, setPayments] = useState<any[]>([]);
  const [maintenanceRequests, setMaintenanceRequests] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [stats, setStats] = useState({
    currentRent: 0,
    nextDueDate: '',
    paymentStatus: 'pending' as const,
    leaseEndDate: '',
    daysUntilLeaseExpiry: 0,
    totalPaid: 0,
    outstandingBalance: 0,
    maintenanceRequests: 0,
    unreadNotifications: 0,
  });

  useEffect(() => {
    const tenant = currentTenantStorage.get();
    if (!tenant) {
      window.location.href = '/tenant/login';
      return;
    }

    setCurrentTenant(tenant);

    // Get tenant data
    const tenantInfo = tenantStorage.findById(tenant.tenantId);
    const unitInfo = unitStorage.findById(tenant.unitId);
    const apartmentInfo = apartmentStorage.findById(tenant.apartmentId);
    const tenantPayments = paymentStorage.findByTenant(tenant.tenantId);
    const tenantMaintenance = maintenanceStorage.getAll().filter(
      (req: any) => req.tenantId === tenant.tenantId
    );
    const tenantNotifications = tenantNotificationStorage.findByTenant(tenant.tenantId);

    setTenantData(tenantInfo);
    setUnitData(unitInfo);
    setApartmentData(apartmentInfo);
    setPayments(tenantPayments);
    setMaintenanceRequests(tenantMaintenance);
    setNotifications(tenantNotifications);

    // Calculate stats
    if (tenantInfo && tenantPayments.length > 0) {
      const nextPayment = tenantPayments.find((p: any) => p.status === 'pending');
      const totalPaid = tenantPayments
        .filter((p: any) => p.status === 'paid')
        .reduce((sum: number, p: any) => sum + p.amount, 0);
      const outstandingBalance = tenantPayments
        .filter((p: any) => p.status === 'overdue')
        .reduce((sum: number, p: any) => sum + p.amount + (p.penalty || 0), 0);
      const activeMaintenance = tenantMaintenance.filter(
        (req: any) => req.status !== 'completed' && req.status !== 'cancelled'
      ).length;
      const unreadNotifications = tenantNotifications.filter((n: any) => !n.isRead).length;

      setStats({
        currentRent: tenantInfo.rentAmount,
        nextDueDate: nextPayment?.dueDate || new Date().toISOString(),
        paymentStatus: nextPayment?.status || 'pending',
        leaseEndDate: tenantInfo.leaseEnd,
        daysUntilLeaseExpiry: differenceInDays(new Date(tenantInfo.leaseEnd), new Date()),
        totalPaid,
        outstandingBalance,
        maintenanceRequests: activeMaintenance,
        unreadNotifications,
      });
    }
  }, []);

  if (!currentTenant || !tenantData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <TenantSidebar />
      <div className="flex-1 flex flex-col overflow-hidden lg:ml-0">
        <TenantHeader 
          title={`Welcome back, ${tenantData.firstName}!`}
          subtitle={`Unit ${unitData?.unitNumber} - ${apartmentData?.name}`}
          notificationCount={stats.unreadNotifications}
        />
        
        <main className="flex-1 overflow-y-auto p-6">
          <div className="space-y-6">
            <TenantStatsCards stats={stats} />
            
            <PaymentSummary payments={payments} />
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <MaintenanceOverview requests={maintenanceRequests} />
              <NotificationsPreview notifications={notifications} />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}