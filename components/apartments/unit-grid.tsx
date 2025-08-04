'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface UnitGridProps {
  units: any[];
  onUnitClick: (unit: any) => void;
  selectedUnit: any;
}

export function UnitGrid({ units, onUnitClick, selectedUnit }: UnitGridProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'occupied':
        return 'bg-green-100 border-green-300 text-green-800';
      case 'vacant':
        return 'bg-yellow-100 border-yellow-300 text-yellow-800';
      case 'maintenance':
        return 'bg-red-100 border-red-300 text-red-800';
      default:
        return 'bg-gray-100 border-gray-300 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'occupied':
        return '👥';
      case 'vacant':
        return '🏠';
      case 'maintenance':
        return '🔧';
      default:
        return '❓';
    }
  };

  if (units.length === 0) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="text-6xl mb-4">🏢</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Units Added</h3>
            <p className="text-gray-500">Start by adding units to this apartment</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
      {units.map((unit) => (
        <Card
          key={unit.id}
          className={cn(
            'cursor-pointer transition-all duration-200 hover:shadow-md',
            selectedUnit?.id === unit.id ? 'ring-2 ring-blue-500 shadow-md' : '',
            getStatusColor(unit.status)
          )}
          onClick={() => onUnitClick(unit)}
        >
          <CardContent className="p-4 text-center">
            <div className="text-2xl mb-2">{getStatusIcon(unit.status)}</div>
            <div className="font-semibold text-lg">{unit.unitNumber}</div>
            <div className="text-sm opacity-75 capitalize">{unit.type}</div>
            <div className="text-xs mt-1">
              KSh {unit.rentAmount.toLocaleString()}
            </div>
            <Badge 
              variant="outline" 
              className={cn('mt-2 text-xs', getStatusColor(unit.status))}
            >
              {unit.status}
            </Badge>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}