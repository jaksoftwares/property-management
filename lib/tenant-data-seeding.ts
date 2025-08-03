import { tenantUserStorage, tenantNotificationStorage } from './tenant-storage';

export function seedTenantData() {
  // Check if tenant users already exist
  if (tenantUserStorage.getAll().length > 0) return;

  // Sample tenant users (corresponding to existing tenants)
  const tenantUsers = [
    {
      id: 'tenant-user-1',
      tenantId: 'tenant-1',
      email: 'john.doe@email.com',
      password: 'password123', // In real app, this would be hashed
      firstName: 'John',
      lastName: 'Doe',
      phone: '+254701234567',
      unitId: 'unit-1',
      apartmentId: 'apt-1',
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'tenant-user-2',
      tenantId: 'tenant-2',
      email: 'mary.smith@email.com',
      password: 'password123',
      firstName: 'Mary',
      lastName: 'Smith',
      phone: '+254707654321',
      unitId: 'unit-3',
      apartmentId: 'apt-1',
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];

  // Sample tenant notifications
  const tenantNotifications = [
    {
      id: 'tenant-notif-1',
      tenantId: 'tenant-1',
      title: 'Rent Due Reminder',
      message: 'Your rent payment of KSh 25,000 is due on January 1st, 2025.',
      type: 'rent-due',
      isRead: false,
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 'tenant-notif-2',
      tenantId: 'tenant-1',
      title: 'Maintenance Update',
      message: 'Your maintenance request for the leaking faucet has been assigned to our team.',
      type: 'maintenance',
      isRead: false,
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 'tenant-notif-3',
      tenantId: 'tenant-2',
      title: 'Payment Overdue',
      message: 'Your rent payment is now 3 days overdue. Please make payment to avoid penalties.',
      type: 'rent-due',
      isRead: false,
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 'tenant-notif-4',
      tenantId: 'tenant-1',
      title: 'Building Notice',
      message: 'Water supply will be interrupted on Saturday from 9 AM to 2 PM for maintenance.',
      type: 'general',
      isRead: true,
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ];

  // Seed the data
  tenantUsers.forEach(user => tenantUserStorage.add(user));
  tenantNotifications.forEach(notification => tenantNotificationStorage.add(notification));
}