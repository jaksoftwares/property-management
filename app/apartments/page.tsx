'use client';

import { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import { Sidebar } from '@/components/layout/sidebar';
import { Header } from '@/components/layout/header';
import { Button } from '@/components/ui/button';
import { ApartmentCard } from '@/components/apartments/apartment-card';
import { apartmentStorage, unitStorage } from '@/lib/storage';

export default function Apartments() {
  const [apartments, setApartments] = useState<any[]>([]);
  const [units, setUnits] = useState<any[]>([]);

  useEffect(() => {
    setApartments(apartmentStorage.getAll());
    setUnits(unitStorage.getAll());
  }, []);

  const getUnitStats = (apartmentId: string) => {
    const apartmentUnits = units.filter(unit => unit.apartmentId === apartmentId);
    return {
      occupied: apartmentUnits.filter(unit => unit.status === 'occupied').length,
      vacant: apartmentUnits.filter(unit => unit.status === 'vacant').length,
      maintenance: apartmentUnits.filter(unit => unit.status === 'maintenance').length,
    };
  };

  const handleEdit = (id: string) => {
    console.log('Edit apartment:', id);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this apartment?')) {
      apartmentStorage.delete(id);
      setApartments(apartmentStorage.getAll());
    }
  };

  const handleViewUnits = (id: string) => {
    console.log('View units for apartment:', id);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden lg:ml-0">
        <Header 
          title="Apartments" 
          subtitle="Manage your property portfolio"
        />
        
        <main className="flex-1 overflow-y-auto p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Property Overview</h2>
              <p className="text-sm text-gray-600">
                {apartments.length} apartments, {units.length} total units
              </p>
            </div>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Apartment
            </Button>
          </div>

          {apartments.length === 0 ? (
            <div className="text-center py-12">
              <div className="mx-auto h-12 w-12 text-gray-400">
                <svg fill="none" stroke="currentColor" viewBox="0 0 48 48">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 14v20c0 4.418 7.163 8 16 8 1.381 0 2.721-.087 4-.252M8 14c0 4.418 7.163 8 16 8s16-3.582 16-8M8 14c0-4.418 7.163-8 16-8s16 3.582 16 8m0 0v14m-16-4c0 4.418 7.163 8 16 8 1.381 0 2.721-.087 4-.252" />
                </svg>
              </div>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No apartments</h3>
              <p className="mt-1 text-sm text-gray-500">Get started by adding your first apartment.</p>
              <div className="mt-6">
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Apartment
                </Button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {apartments.map((apartment) => (
                <ApartmentCard
                  key={apartment.id}
                  apartment={apartment}
                  unitStats={getUnitStats(apartment.id)}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onViewUnits={handleViewUnits}
                />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}