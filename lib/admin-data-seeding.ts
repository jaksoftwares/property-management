import { systemAdminStorage, propertyManagerStorage, systemSettingsStorage, auditLogStorage } from './admin-storage';

export function seedAdminData() {
  // Check if admin data already exists
  if (systemAdminStorage.getAll().length > 0) return;

  // Sample system admins
  const systemAdmins = [
    {
      id: 'admin-1',
      email: 'admin@dovepeak.com',
      password: 'admin123', // In real app, this would be hashed
      firstName: 'System',
      lastName: 'Administrator',
      role: 'super-admin',
      permissions: ['all'],
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'admin-2',
      email: 'support@dovepeak.com',
      password: 'support123',
      firstName: 'Support',
      lastName: 'Admin',
      role: 'admin',
      permissions: ['users', 'properties', 'reports'],
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];

  // Sample property managers
  const propertyManagers = [
    {
      id: 'pm-1',
      email: 'manager@dovepeak.com',
      password: 'manager123',
      firstName: 'Property',
      lastName: 'Manager',
      phone: '+254700000001',
      company: 'Dovepeak Management',
      role: 'manager',
      permissions: ['properties', 'tenants', 'payments', 'maintenance'],
      isActive: true,
      managedProperties: ['apt-1', 'apt-2'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'pm-2',
      email: 'caretaker@dovepeak.com',
      password: 'caretaker123',
      firstName: 'Building',
      lastName: 'Caretaker',
      phone: '+254700000002',
      company: 'Dovepeak Management',
      role: 'caretaker',
      permissions: ['maintenance', 'tenants'],
      isActive: true,
      managedProperties: ['apt-1'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];

  // Default system settings
  const systemSettings = {
    siteName: 'Dovepeak Property Management',
    siteDescription: 'Professional apartment and property management platform',
    defaultCurrency: 'KSH',
    defaultTimezone: 'Africa/Nairobi',
    maintenanceMode: false,
    allowRegistration: true,
    emailSettings: {
      smtpHost: 'smtp.gmail.com',
      smtpPort: 587,
      smtpUser: '',
      smtpPassword: '',
      fromEmail: 'noreply@dovepeak.com',
      fromName: 'Dovepeak Management',
    },
    smsSettings: {
      provider: 'twilio',
      apiKey: '',
      senderId: 'Dovepeak',
    },
    paymentSettings: {
      enabledMethods: ['cash', 'bank', 'mobile'],
      defaultLateFeePercentage: 5,
      gracePeriodDays: 3,
    },
    updatedAt: new Date().toISOString(),
  };

  // Sample audit logs
  const auditLogs = [
    {
      id: 'audit-1',
      userId: 'admin-1',
      userType: 'admin',
      action: 'login',
      resource: 'system',
      details: 'System administrator logged in',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 'audit-2',
      userId: 'pm-1',
      userType: 'property-manager',
      action: 'create',
      resource: 'apartment',
      resourceId: 'apt-1',
      details: 'Created new apartment: Sunshine Towers',
      timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 'audit-3',
      userId: 'admin-1',
      userType: 'admin',
      action: 'update',
      resource: 'settings',
      details: 'Updated system settings',
      timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ];

  // Seed the data
  systemAdmins.forEach(admin => systemAdminStorage.add(admin));
  propertyManagers.forEach(manager => propertyManagerStorage.add(manager));
  systemSettingsStorage.update(systemSettings);
  auditLogs.forEach(log => auditLogStorage.add(log));
}