'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { month: 'Jan', revenue: 450000, expenses: 120000 },
  { month: 'Feb', revenue: 520000, expenses: 140000 },
  { month: 'Mar', revenue: 480000, expenses: 135000 },
  { month: 'Apr', revenue: 610000, expenses: 150000 },
  { month: 'May', revenue: 580000, expenses: 145000 },
  { month: 'Jun', revenue: 650000, expenses: 160000 },
  { month: 'Jul', revenue: 620000, expenses: 155000 },
  { month: 'Aug', revenue: 680000, expenses: 165000 },
  { month: 'Sep', revenue: 700000, expenses: 170000 },
  { month: 'Oct', revenue: 720000, expenses: 175000 },
  { month: 'Nov', revenue: 750000, expenses: 180000 },
  { month: 'Dec', revenue: 680000, expenses: 160000 },
];

export function RevenueChart() {
  return (
    <Card className="col-span-1 lg:col-span-2">
      <CardHeader>
        <CardTitle>Revenue Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis tickFormatter={(value) => `${value / 1000}K`} />
            <Tooltip 
              formatter={(value: number) => [`KSh ${value.toLocaleString()}`, '']}
              labelFormatter={(label) => `Month: ${label}`}
            />
            <Bar dataKey="revenue" fill="#3B82F6" name="Revenue" />
            <Bar dataKey="expenses" fill="#EF4444" name="Expenses" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}