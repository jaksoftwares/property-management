export interface Apartment {
  id: string;
  name: string;
  address: string;
  totalUnits: number;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Unit {
  id: string;
  apartmentId: string;
  unitNumber: string;
  type: 'studio' | 'bedsitter' | '1-bedroom' | '2-bedroom' | '3-bedroom' | 'penthouse';
  size: number;
  rentAmount: number;
  deposit: number;
  status: 'vacant' | 'occupied' | 'maintenance';
  description?: string;
  amenities: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Tenant {
  id: string;
  unitId: string;
  apartmentId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  idNumber: string;
  emergencyContact: {
    name: string;
    phone: string;
    relationship: string;
  };
  leaseStart: string;
  leaseEnd: string;
  rentAmount: number;
  deposit: number;
  contractDocument?: string;
  status: 'active' | 'inactive' | 'terminated';
  createdAt: string;
  updatedAt: string;
}

export interface Payment {
  id: string;
  tenantId: string;
  unitId: string;
  apartmentId: string;
  amount: number;
  dueDate: string;
  paidDate?: string;
  status: 'pending' | 'paid' | 'overdue' | 'partial';
  method?: 'cash' | 'bank' | 'mobile' | 'cheque';
  reference?: string;
  penalty?: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface MaintenanceRequest {
  id: string;
  tenantId: string;
  unitId: string;
  apartmentId: string;
  title: string;
  description: string;
  category: 'plumbing' | 'electrical' | 'hvac' | 'appliance' | 'structural' | 'other';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'pending' | 'in-progress' | 'completed' | 'cancelled';
  assignedTo?: string;
  estimatedCost?: number;
  actualCost?: number;
  completedDate?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Notification {
  id: string;
  type: 'rent-due' | 'maintenance' | 'lease-expiry' | 'general';
  title: string;
  message: string;
  recipients: string[];
  method: 'email' | 'sms' | 'both';
  status: 'draft' | 'sent' | 'failed';
  scheduledDate?: string;
  sentDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'owner' | 'caretaker' | 'accountant';
  permissions: string[];
  createdAt: string;
  updatedAt: string;
}

export interface DashboardStats {
  totalApartments: number;
  totalUnits: number;
  occupiedUnits: number;
  vacantUnits: number;
  maintenanceUnits: number;
  totalTenants: number;
  monthlyRevenue: number;
  overduePayments: number;
  maintenanceRequests: number;
  occupancyRate: number;
}