export interface TenantUser {
  id: string;
  tenantId: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone: string;
  unitId: string;
  apartmentId: string;
  isActive: boolean;
  lastLogin?: string;
  createdAt: string;
  updatedAt: string;
}

export interface TenantDashboardStats {
  currentRent: number;
  nextDueDate: string;
  paymentStatus: 'paid' | 'pending' | 'overdue';
  leaseEndDate: string;
  daysUntilLeaseExpiry: number;
  totalPaid: number;
  outstandingBalance: number;
  maintenanceRequests: number;
  unreadNotifications: number;
}

export interface TenantPaymentHistory {
  id: string;
  amount: number;
  dueDate: string;
  paidDate?: string;
  status: 'paid' | 'pending' | 'overdue' | 'partial';
  method?: string;
  reference?: string;
  penalty?: number;
}

export interface TenantNotification {
  id: string;
  title: string;
  message: string;
  type: 'rent-due' | 'maintenance' | 'general' | 'lease-expiry';
  isRead: boolean;
  createdAt: string;
}