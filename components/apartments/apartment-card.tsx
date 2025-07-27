'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Building2, MapPin, Home, Users, MoreHorizontal } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface ApartmentCardProps {
  apartment: {
    id: string;
    name: string;
    address: string;
    totalUnits: number;
    description?: string;
  };
  unitStats: {
    occupied: number;
    vacant: number;
    maintenance: number;
  };
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onViewUnits: (id: string) => void;
}

export function ApartmentCard({ 
  apartment, 
  unitStats, 
  onEdit, 
  onDelete, 
  onViewUnits 
}: ApartmentCardProps) {
  const occupancyRate = apartment.totalUnits > 0 
    ? ((unitStats.occupied / apartment.totalUnits) * 100).toFixed(1)
    : '0';

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Building2 className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <CardTitle className="text-lg">{apartment.name}</CardTitle>
            <div className="flex items-center text-sm text-gray-500 mt-1">
              <MapPin className="h-3 w-3 mr-1" />
              {apartment.address}
            </div>
          </div>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onViewUnits(apartment.id)}>
              View Units
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onEdit(apartment.id)}>
              Edit Apartment
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => onDelete(apartment.id)}
              className="text-red-600"
            >
              Delete Apartment
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {apartment.description && (
          <p className="text-sm text-gray-600">{apartment.description}</p>
        )}
        
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center space-x-2">
            <Home className="h-4 w-4 text-gray-400" />
            <div>
              <p className="text-sm font-medium">{apartment.totalUnits}</p>
              <p className="text-xs text-gray-500">Total Units</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Users className="h-4 w-4 text-gray-400" />
            <div>
              <p className="text-sm font-medium">{occupancyRate}%</p>
              <p className="text-xs text-gray-500">Occupancy</p>
            </div>
          </div>
        </div>
        
        <div className="flex space-x-2">
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            {unitStats.occupied} Occupied
          </Badge>
          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
            {unitStats.vacant} Vacant
          </Badge>
          {unitStats.maintenance > 0 && (
            <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
              {unitStats.maintenance} Maintenance
            </Badge>
          )}
        </div>
        
        <Button 
          onClick={() => onViewUnits(apartment.id)}
          className="w-full"
          variant="outline"
        >
          Manage Units
        </Button>
      </CardContent>
    </Card>
  );
}