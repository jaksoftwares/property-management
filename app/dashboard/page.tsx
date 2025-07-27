'use client';

import { useEffect, useState } from 'react';
import { Sidebar } from '@/components/layout/sidebar';
import { Header } from '@/components/layout/header';
import { StatsCards } from '@/components/dashboard/stats-cards';
import { RevenueChart } from '@/components/dashboard/revenue-chart';
import { OccupancyChart } from '@/components/dashboard/occupancy-chart';
import { RecentActivity } from '@/components/dashboard/recent-activity';
import { apartmentStorage, unitStorage, tenantStorage, paymentStorage, maintenanceStorage } from '@/lib/storage';
import type { DashboardStats } from '@/types';

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalApartments: 0,
    totalUnits: 0,
    occupiedUnits: 0,
    vacantUnits: 0,
    maintenanceUnits: 0,
    totalTenants: 0,
    monthlyRevenue: 0,
    overduePayments: 0,
    maintenanceRequests: 0,
    occupancyRate: 0,
  });

  useEffect(() => {
    const calculateStats = () => {
      const apartments = apartmentStorage.getAll();
      const units = unitStorage.getAll();
      const tenants = tenantStorage.getAll();
      const payments = paymentStorage.getAll();
      const maintenance = maintenanceStorage.getAll();

      const occupiedUnits = units.filter((unit: any) => unit.status === 'occupied').length;
      const vacantUnits = units.filter((unit: any) => unit.status === 'vacant').length;
      const maintenanceUnits = units.filter((unit: any) => unit.status === 'maintenance').length;
      
      const paidPayments = payments.filter((payment: any) => payment.status === 'paid');
      const monthlyRevenue = paidPayments.reduce((sum: number, payment: any) => sum + payment.amount, 0);
      
      const overduePayments = payments.filter((payment: any) => payment.status === 'overdue').length;
      const maintenanceRequests = maintenance.filter((request: any) => request.status !== 'completed').length;
      
      const occupancyRate = units.length > 0 ? (occupiedUnits / units.length) * 100 : 0;

      setStats({
        totalApartments: apartments.length,
        totalUnits: units.length,
        occupiedUnits,
        vacantUnits,
        maintenanceUnits,
        totalTenants: tenants.length,
        monthlyRevenue,
        overduePayments,
        maintenanceRequests,
        occupancyRate,
      });
    };

    calculateStats();
  }, []);

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden lg:ml-0">
        <Header 
          title="Dashboard" 
          subtitle="Welcome back! Here's what's happening with your properties."
        />
        
        <main className="flex-1 overflow-y-auto p-6">
          <div className="space-y-6">
            <StatsCards stats={stats} />
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <RevenueChart />
              <OccupancyChart 
                data={{
                  occupied: stats.occupiedUnits,
                  vacant: stats.vacantUnits,
                  maintenance: stats.maintenanceUnits,
                }}
              />
            </div>
            
            <RecentActivity />
          </div>
        </main>
      </div>
    </div>
  );
}