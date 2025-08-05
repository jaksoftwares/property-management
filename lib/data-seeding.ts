import { apartmentStorage, unitStorage, tenantStorage, paymentStorage, maintenanceStorage } from './storage';
import { seedTenantData } from './tenant-data-seeding';
import { seedAdminData } from './admin-data-seeding';

export function seedSampleData() {
  // Check if data already exists
  if (apartmentStorage.getAll().length > 0) return;
  
  // Seed tenant portal data
  seedTenantData();
  
  // Seed admin data
  seedAdminData();

  // Sample apartments
  const apartments = [
    {
      id: 'apt-1',
      name: 'Sunshine Towers',
      address: '123 Main Street, Nairobi',
      totalUnits: 24,
      description: 'Modern apartment complex with great amenities',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'apt-2',
      name: 'Green Valley Apartments',
      address: '456 Valley Road, Nairobi',
      totalUnits: 18,
      description: 'Quiet residential area with parking',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];

  // Sample units
  const units = [
    {
      id: 'unit-1',
      apartmentId: 'apt-1',
      unitNumber: 'A101',
      type: '1-bedroom',
      size: 650,
      rentAmount: 25000,
      deposit: 50000,
      status: 'occupied',
      amenities: ['Balcony', 'Parking', 'WiFi'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'unit-2',
      apartmentId: 'apt-1',
      unitNumber: 'A102',
      type: '2-bedroom',
      size: 850,
      rentAmount: 35000,
      deposit: 70000,
      status: 'vacant',
      amenities: ['Balcony', 'Parking', 'WiFi', 'Swimming Pool'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'unit-3',
      apartmentId: 'apt-1',
      unitNumber: 'B201',
      type: 'bedsitter',
      size: 450,
      rentAmount: 18000,
      deposit: 36000,
      status: 'occupied',
      amenities: ['WiFi'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'unit-4',
      apartmentId: 'apt-2',
      unitNumber: 'C301',
      type: '1-bedroom',
      size: 600,
      rentAmount: 22000,
      deposit: 44000,
      status: 'maintenance',
      amenities: ['Parking', 'Garden View'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];

  // Sample tenants
  const tenants = [
    {
      id: 'tenant-1',
      unitId: 'unit-1',
      apartmentId: 'apt-1',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@email.com',
      phone: '+254701234567',
      idNumber: '12345678',
      emergencyContact: {
        name: 'Jane Doe',
        phone: '+254701234568',
        relationship: 'Spouse',
      },
      leaseStart: '2024-01-01',
      leaseEnd: '2024-12-31',
      rentAmount: 25000,
      deposit: 50000,
      status: 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'tenant-2',
      unitId: 'unit-3',
      apartmentId: 'apt-1',
      firstName: 'Mary',
      lastName: 'Smith',
      email: 'mary.smith@email.com',
      phone: '+254707654321',
      idNumber: '87654321',
      emergencyContact: {
        name: 'Peter Smith',
        phone: '+254707654322',
        relationship: 'Brother',
      },
      leaseStart: '2024-02-01',
      leaseEnd: '2025-01-31',
      rentAmount: 18000,
      deposit: 36000,
      status: 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];

  // Sample payments
  const payments = [
    {
      id: 'pay-1',
      tenantId: 'tenant-1',
      unitId: 'unit-1',
      apartmentId: 'apt-1',
      amount: 25000,
      dueDate: '2024-12-01',
      paidDate: '2024-11-28',
      status: 'paid',
      method: 'bank',
      reference: 'TXN123456',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'pay-2',
      tenantId: 'tenant-2',
      unitId: 'unit-3',
      apartmentId: 'apt-1',
      amount: 18000,
      dueDate: '2024-12-01',
      status: 'overdue',
      penalty: 900,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'pay-3',
      tenantId: 'tenant-1',
      unitId: 'unit-1',
      apartmentId: 'apt-1',
      amount: 25000,
      dueDate: '2025-01-01',
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];

  // Sample maintenance requests
  const maintenanceRequests = [
    {
      id: 'maint-1',
      tenantId: 'tenant-1',
      unitId: 'unit-1',
      apartmentId: 'apt-1',
      title: 'Leaking Faucet',
      description: 'Kitchen faucet is leaking constantly',
      category: 'plumbing',
      priority: 'medium',
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'maint-2',
      tenantId: 'tenant-2',
      unitId: 'unit-3',
      apartmentId: 'apt-1',
      title: 'Electrical Issue',
      description: 'Power outlet in bedroom not working',
      category: 'electrical',
      priority: 'high',
      status: 'in-progress',
      assignedTo: 'Maintenance Team',
      estimatedCost: 2500,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];

  // Seed the data
  apartments.forEach(apt => apartmentStorage.add(apt));
  units.forEach(unit => unitStorage.add(unit));
  tenants.forEach(tenant => tenantStorage.add(tenant));
  payments.forEach(payment => paymentStorage.add(payment));
  maintenanceRequests.forEach(request => maintenanceStorage.add(request));
}