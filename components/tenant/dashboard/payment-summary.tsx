'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { CreditCard, Calendar, AlertTriangle } from 'lucide-react';

interface PaymentSummaryProps {
  payments: Array<{
    id: string;
    amount: number;
    dueDate: string;
    paidDate?: string;
    status: 'paid' | 'pending' | 'overdue' | 'partial';
    method?: string;
    penalty?: number;
  }>;
}

export function PaymentSummary({ payments }: PaymentSummaryProps) {
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

  const upcomingPayments = payments.filter(p => p.status === 'pending').slice(0, 3);
  const recentPayments = payments.filter(p => p.status === 'paid').slice(0, 3);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Upcoming Payments */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg">Upcoming Payments</CardTitle>
          <Calendar className="h-5 w-5 text-gray-400" />
        </CardHeader>
        <CardContent>
          {upcomingPayments.length === 0 ? (
            <div className="text-center py-6">
              <div className="text-gray-400 mb-2">
                <CreditCard className="h-8 w-8 mx-auto" />
              </div>
              <p className="text-sm text-gray-500">No upcoming payments</p>
            </div>
          ) : (
            <div className="space-y-4">
              {upcomingPayments.map((payment) => (
                <div key={payment.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">KSh {payment.amount.toLocaleString()}</p>
                    <p className="text-sm text-gray-500">
                      Due: {format(new Date(payment.dueDate), 'MMM dd, yyyy')}
                    </p>
                  </div>
                  <div className="text-right">
                    <Badge className={getStatusColor(payment.status)}>
                      {payment.status}
                    </Badge>
                    {payment.status === 'pending' && (
                      <Button size="sm" className="mt-2">
                        Pay Now
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Payments */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg">Recent Payments</CardTitle>
          <CreditCard className="h-5 w-5 text-gray-400" />
        </CardHeader>
        <CardContent>
          {recentPayments.length === 0 ? (
            <div className="text-center py-6">
              <div className="text-gray-400 mb-2">
                <AlertTriangle className="h-8 w-8 mx-auto" />
              </div>
              <p className="text-sm text-gray-500">No recent payments</p>
            </div>
          ) : (
            <div className="space-y-4">
              {recentPayments.map((payment) => (
                <div key={payment.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">KSh {payment.amount.toLocaleString()}</p>
                    <p className="text-sm text-gray-500">
                      Paid: {payment.paidDate ? format(new Date(payment.paidDate), 'MMM dd, yyyy') : 'N/A'}
                    </p>
                    {payment.method && (
                      <p className="text-xs text-gray-400">via {payment.method}</p>
                    )}
                  </div>
                  <Badge className={getStatusColor(payment.status)}>
                    {payment.status}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}