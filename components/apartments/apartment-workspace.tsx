'use client';

import { useState, useEffect } from 'react';
import { ArrowLeft, Plus, Edit, Trash2, Users, Home, MapPin, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { UnitGrid } from './unit-grid';
import { UnitDetails } from './unit-details';
import { AddUnitForm } from './add-unit-form';
import { EditApartmentForm } from './edit-apartment-form';
import { unitStorage, tenantStorage } from '@/lib/storage';

interface ApartmentWorkspaceProps {
  apartment: any;
  onBack: () => void;
  onUpdate: (apartment: any) => void;
  onDelete: (id: string) => void;
}

export function ApartmentWorkspace({ apartment, onBack, onUpdate, onDelete }: ApartmentWorkspaceProps) {
  const [units, setUnits] = useState<any[]>([]);
  const [selectedUnit, setSelectedUnit] = useState<any>(null);
  const [showAddUnit, setShowAddUnit] = useState(false);
  const [showEditApartment, setShowEditApartment] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    loadUnits();
  }, [apartment.id]);

  const loadUnits = () => {
    const apartmentUnits = unitStorage.findByApartment(apartment.id);
    setUnits(apartmentUnits);
  };

  const handleAddUnit = (unitData: any) => {
    const newUnit = unitStorage.add({
      ...unitData,
      apartmentId: apartment.id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    loadUnits();
    setShowAddUnit(false);
  };

  const handleEditUnit = (unitId: string, updates: any) => {
    unitStorage.update(unitId, updates);
    loadUnits();
    if (selectedUnit?.id === unitId) {
      setSelectedUnit({ ...selectedUnit, ...updates });
    }
  };

  const handleDeleteUnit = (unitId: string) => {
    if (confirm('Are you sure you want to delete this unit?')) {
      unitStorage.delete(unitId);
      loadUnits();
      if (selectedUnit?.id === unitId) {
        setSelectedUnit(null);
      }
    }
  };

  const handleEditApartment = (updates: any) => {
    onUpdate({ ...apartment, ...updates });
    setShowEditApartment(false);
  };

  const getUnitStats = () => {
    const occupied = units.filter(u => u.status === 'occupied').length;
    const vacant = units.filter(u => u.status === 'vacant').length;
    const maintenance = units.filter(u => u.status === 'maintenance').length;
    const totalRevenue = units.reduce((sum, unit) => {
      if (unit.status === 'occupied') return sum + unit.rentAmount;
      return sum;
    }, 0);

    return { occupied, vacant, maintenance, totalRevenue };
  };

  const stats = getUnitStats();

  if (showEditApartment) {
    return (
      <EditApartmentForm
        apartment={apartment}
        onSave={handleEditApartment}
        onCancel={() => setShowEditApartment(false)}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="outline" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Apartments
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{apartment.name}</h1>
            <div className="flex items-center text-gray-500 mt-1">
              <MapPin className="h-4 w-4 mr-1" />
              {apartment.address}
            </div>
          </div>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={() => setShowEditApartment(true)}>
            <Edit className="h-4 w-4 mr-2" />
            Edit Apartment
          </Button>
          <Button 
            variant="destructive" 
            onClick={() => onDelete(apartment.id)}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Units</CardTitle>
            <Home className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{units.length}</div>
            <p className="text-xs text-gray-500">of {apartment.totalUnits} planned</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Occupied</CardTitle>
            <Users className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.occupied}</div>
            <p className="text-xs text-gray-500">
              {units.length > 0 ? ((stats.occupied / units.length) * 100).toFixed(1) : 0}% occupancy
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Vacant</CardTitle>
            <Home className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.vacant}</div>
            <p className="text-xs text-gray-500">Available for rent</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Monthly Revenue</CardTitle>
            <Settings className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              KSh {stats.totalRevenue.toLocaleString()}
            </div>
            <p className="text-xs text-gray-500">From occupied units</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Unit Overview</TabsTrigger>
          <TabsTrigger value="details">Unit Details</TabsTrigger>
          <TabsTrigger value="management">Management</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Unit Layout</h3>
            <Button onClick={() => setShowAddUnit(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Unit
            </Button>
          </div>
          
          <UnitGrid
            units={units}
            onUnitClick={setSelectedUnit}
            selectedUnit={selectedUnit}
          />

          {showAddUnit && (
            <AddUnitForm
              onSave={handleAddUnit}
              onCancel={() => setShowAddUnit(false)}
            />
          )}
        </TabsContent>

        <TabsContent value="details" className="space-y-4">
          {selectedUnit ? (
            <UnitDetails
              unit={selectedUnit}
              onEdit={handleEditUnit}
              onDelete={handleDeleteUnit}
            />
          ) : (
            <Card>
              <CardContent className="flex items-center justify-center py-12">
                <div className="text-center">
                  <Home className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Select a Unit</h3>
                  <p className="text-gray-500">Click on a unit from the overview to see its details</p>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="management" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button className="w-full justify-start" onClick={() => setShowAddUnit(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add New Unit
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Users className="h-4 w-4 mr-2" />
                  Bulk Unit Update
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Settings className="h-4 w-4 mr-2" />
                  Generate Report
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Apartment Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Description</label>
                  <p className="text-sm text-gray-900">{apartment.description || 'No description available'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Created</label>
                  <p className="text-sm text-gray-900">
                    {new Date(apartment.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Last Updated</label>
                  <p className="text-sm text-gray-900">
                    {new Date(apartment.updatedAt).toLocaleDateString()}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}