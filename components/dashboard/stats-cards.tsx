'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Building2, Users, Home, AlertTriangle, TrendingUp, DollarSign } from 'lucide-react';

interface StatsCardsProps {
  stats: {
    totalApartments: number;
    totalUnits: number;
    occupiedUnits: number;
    vacantUnits: number;
    maintenanceUnits: number;
    totalTenants: number;
    monthlyRevenue: number;
    overduePayments: number;
    occupancyRate: number;
  };
}

export function StatsCards({ stats }: StatsCardsProps) {
  const cards = [
    {
      title: 'Total Revenue',
      value: `KSh ${stats.monthlyRevenue.toLocaleString()}`,
      icon: DollarSign,
      change: '+12.3%',
      changeType: 'positive' as const,
    },
    {
      title: 'Occupancy Rate',
      value: `${stats.occupancyRate.toFixed(1)}%`,
      icon: TrendingUp,
      change: '+2.1%',
      changeType: 'positive' as const,
    },
    {
      title: 'Total Units',
      value: stats.totalUnits.toString(),
      icon: Home,
      subtitle: `${stats.occupiedUnits} occupied, ${stats.vacantUnits} vacant`,
    },
    {
      title: 'Active Tenants',
      value: stats.totalTenants.toString(),
      icon: Users,
      subtitle: `${stats.overduePayments} overdue payments`,
    },
    {
      title: 'Apartments',
      value: stats.totalApartments.toString(),
      icon: Building2,
      subtitle: 'Properties managed',
    },
    {
      title: 'Maintenance',
      value: stats.maintenanceUnits.toString(),
      icon: AlertTriangle,
      subtitle: 'Units under maintenance',
      changeType: 'warning' as const,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {cards.map((card, index) => (
        <Card key={index} className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              {card.title}
            </CardTitle>
            <card.icon className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{card.value}</div>
            {card.subtitle && (
              <p className="text-xs text-gray-500 mt-1">{card.subtitle}</p>
            )}
            {card.change && (
              <p className={`text-xs mt-1 ${
                card.changeType === 'positive' ? 'text-green-600' : 
                card.changeType === 'warning' ? 'text-yellow-600' : 'text-red-600'
              }`}>
                {card.change} from last month
              </p>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}