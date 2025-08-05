export interface SystemAdmin {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'super-admin' | 'admin';
  permissions: string[];
  isActive: boolean;
  lastLogin?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PropertyManager {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  company?: string;
  role: 'owner' | 'manager' | 'caretaker' | 'accountant';
  permissions: string[];
  isActive: boolean;
  managedProperties: string[];
  lastLogin?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SystemSettings {
  id: string;
  siteName: string;
  siteDescription: string;
  defaultCurrency: string;
  defaultTimezone: string;
  maintenanceMode: boolean;
  allowRegistration: boolean;
  emailSettings: {
    smtpHost: string;
    smtpPort: number;
    smtpUser: string;
    smtpPassword: string;
    fromEmail: string;
    fromName: string;
  };
  smsSettings: {
    provider: string;
    apiKey: string;
    senderId: string;
  };
  paymentSettings: {
    enabledMethods: string[];
    defaultLateFeePercentage: number;
    gracePeriodDays: number;
  };
  updatedAt: string;
}

export interface SystemStats {
  totalPropertyManagers: number;
  activePropertyManagers: number;
  totalTenants: number;
  activeTenants: number;
  totalApartments: number;
  totalUnits: number;
  totalRevenue: number;
  systemUptime: string;
  storageUsed: number;
  activeUsers: number;
}

export interface AuditLog {
  id: string;
  userId: string;
  userType: 'admin' | 'property-manager' | 'tenant';
  action: string;
  resource: string;
  resourceId?: string;
  details: string;
  ipAddress?: string;
  userAgent?: string;
  timestamp: string;
}