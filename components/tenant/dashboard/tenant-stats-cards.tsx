'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DollarSign, Calendar, Home, AlertTriangle, Clock, CheckCircle } from 'lucide-react';
import { format, differenceInDays } from 'date-fns';

interface TenantStatsCardsProps {
  stats: {
    currentRent: number;
    nextDueDate: string;
    paymentStatus: 'paid' | 'pending' | 'overdue';
    leaseEndDate: string;
    daysUntilLeaseExpiry: number;
    totalPaid: number;
    outstandingBalance: number;
    maintenanceRequests: number;
  };
}

export function TenantStatsCards({ stats }: TenantStatsCardsProps) {
  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'overdue':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPaymentStatusIcon = (status: string) => {
    switch (status) {
      case 'paid':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'overdue':
        return <AlertTriangle className="h-4 w-4 text-red-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  const cards = [
    {
      title: 'Current Rent',
      value: `KSh ${stats.currentRent.toLocaleString()}`,
      icon: DollarSign,
      subtitle: `Due: ${format(new Date(stats.nextDueDate), 'MMM dd, yyyy')}`,
      badge: (
        <Badge className={getPaymentStatusColor(stats.paymentStatus)}>
          {getPaymentStatusIcon(stats.paymentStatus)}
          <span className="ml-1">{stats.paymentStatus}</span>
        </Badge>
      ),
    },
    {
      title: 'Outstanding Balance',
      value: stats.outstandingBalance > 0 ? `KSh ${stats.outstandingBalance.toLocaleString()}` : 'None',
      icon: AlertTriangle,
      subtitle: stats.outstandingBalance > 0 ? 'Please settle soon' : 'All payments up to date',
      valueColor: stats.outstandingBalance > 0 ? 'text-red-600' : 'text-green-600',
    },
    {
      title: 'Lease Expires',
      value: `${stats.daysUntilLeaseExpiry} days`,
      icon: Calendar,
      subtitle: format(new Date(stats.leaseEndDate), 'MMM dd, yyyy'),
      valueColor: stats.daysUntilLeaseExpiry < 60 ? 'text-orange-600' : 'text-gray-900',
    },
    {
      title: 'Total Paid This Year',
      value: `KSh ${stats.totalPaid.toLocaleString()}`,
      icon: CheckCircle,
      subtitle: 'Rent payments made',
      valueColor: 'text-green-600',
    },
    {
      title: 'Active Maintenance',
      value: stats.maintenanceRequests.toString(),
      icon: AlertTriangle,
      subtitle: stats.maintenanceRequests === 0 ? 'No pending requests' : 'Requests pending',
      valueColor: stats.maintenanceRequests > 0 ? 'text-orange-600' : 'text-green-600',
    },
    {
      title: 'Unit Status',
      value: 'Occupied',
      icon: Home,
      subtitle: 'Your current status',
      badge: (
        <Badge className="bg-green-100 text-green-800">
          Active Lease
        </Badge>
      ),
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
            <div className={`text-2xl font-bold ${card.valueColor || 'text-gray-900'}`}>
              {card.value}
            </div>
            {card.subtitle && (
              <p className="text-xs text-gray-500 mt-1">{card.subtitle}</p>
            )}
            {card.badge && (
              <div className="mt-2">{card.badge}</div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}