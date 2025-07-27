'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

interface OccupancyChartProps {
  data: {
    occupied: number;
    vacant: number;
    maintenance: number;
  };
}

export function OccupancyChart({ data }: OccupancyChartProps) {
  const chartData = [
    { name: 'Occupied', value: data.occupied, color: '#10B981' },
    { name: 'Vacant', value: data.vacant, color: '#F59E0B' },
    { name: 'Maintenance', value: data.maintenance, color: '#EF4444' },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Unit Status</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip formatter={(value) => [`${value} units`, '']} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}