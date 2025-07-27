const STORAGE_KEYS = {
  APARTMENTS: 'dovepeak_apartments',
  UNITS: 'dovepeak_units',
  TENANTS: 'dovepeak_tenants',
  PAYMENTS: 'dovepeak_payments',
  MAINTENANCE: 'dovepeak_maintenance',
  NOTIFICATIONS: 'dovepeak_notifications',
  USERS: 'dovepeak_users',
  CURRENT_USER: 'dovepeak_current_user',
};

export class LocalStorage {
  static get<T>(key: string): T[] {
    if (typeof window === 'undefined') return [];
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  }

  static set<T>(key: string, data: T[]): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(key, JSON.stringify(data));
  }

  static add<T extends { id: string }>(key: string, item: T): T {
    const items = this.get<T>(key);
    const newItem = { ...item, id: item.id || this.generateId() };
    items.push(newItem);
    this.set(key, items);
    return newItem;
  }

  static update<T extends { id: string }>(key: string, id: string, updates: Partial<T>): T | null {
    const items = this.get<T>(key);
    const index = items.findIndex(item => item.id === id);
    if (index === -1) return null;
    
    items[index] = { ...items[index], ...updates, updatedAt: new Date().toISOString() };
    this.set(key, items);
    return items[index];
  }

  static delete(key: string, id: string): boolean {
    const items = this.get(key);
    const index = items.findIndex((item: any) => item.id === id);
    if (index === -1) return false;
    
    items.splice(index, 1);
    this.set(key, items);
    return true;
  }

  static findById<T extends { id: string }>(key: string, id: string): T | null {
    const items = this.get<T>(key);
    return items.find(item => item.id === id) || null;
  }

  static generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }
}

export const apartmentStorage = {
  getAll: () => LocalStorage.get(STORAGE_KEYS.APARTMENTS),
  add: (apartment: any) => LocalStorage.add(STORAGE_KEYS.APARTMENTS, apartment),
  update: (id: string, updates: any) => LocalStorage.update(STORAGE_KEYS.APARTMENTS, id, updates),
  delete: (id: string) => LocalStorage.delete(STORAGE_KEYS.APARTMENTS, id),
  findById: (id: string) => LocalStorage.findById(STORAGE_KEYS.APARTMENTS, id),
};

export const unitStorage = {
  getAll: () => LocalStorage.get(STORAGE_KEYS.UNITS),
  add: (unit: any) => LocalStorage.add(STORAGE_KEYS.UNITS, unit),
  update: (id: string, updates: any) => LocalStorage.update(STORAGE_KEYS.UNITS, id, updates),
  delete: (id: string) => LocalStorage.delete(STORAGE_KEYS.UNITS, id),
  findById: (id: string) => LocalStorage.findById(STORAGE_KEYS.UNITS, id),
  findByApartment: (apartmentId: string) => LocalStorage.get(STORAGE_KEYS.UNITS).filter((unit: any) => unit.apartmentId === apartmentId),
};

export const tenantStorage = {
  getAll: () => LocalStorage.get(STORAGE_KEYS.TENANTS),
  add: (tenant: any) => LocalStorage.add(STORAGE_KEYS.TENANTS, tenant),
  update: (id: string, updates: any) => LocalStorage.update(STORAGE_KEYS.TENANTS, id, updates),
  delete: (id: string) => LocalStorage.delete(STORAGE_KEYS.TENANTS, id),
  findById: (id: string) => LocalStorage.findById(STORAGE_KEYS.TENANTS, id),
  findByUnit: (unitId: string) => LocalStorage.get(STORAGE_KEYS.TENANTS).filter((tenant: any) => tenant.unitId === unitId),
};

export const paymentStorage = {
  getAll: () => LocalStorage.get(STORAGE_KEYS.PAYMENTS),
  add: (payment: any) => LocalStorage.add(STORAGE_KEYS.PAYMENTS, payment),
  update: (id: string, updates: any) => LocalStorage.update(STORAGE_KEYS.PAYMENTS, id, updates),
  delete: (id: string) => LocalStorage.delete(STORAGE_KEYS.PAYMENTS, id),
  findById: (id: string) => LocalStorage.findById(STORAGE_KEYS.PAYMENTS, id),
  findByTenant: (tenantId: string) => LocalStorage.get(STORAGE_KEYS.PAYMENTS).filter((payment: any) => payment.tenantId === tenantId),
};

export const maintenanceStorage = {
  getAll: () => LocalStorage.get(STORAGE_KEYS.MAINTENANCE),
  add: (request: any) => LocalStorage.add(STORAGE_KEYS.MAINTENANCE, request),
  update: (id: string, updates: any) => LocalStorage.update(STORAGE_KEYS.MAINTENANCE, id, updates),
  delete: (id: string) => LocalStorage.delete(STORAGE_KEYS.MAINTENANCE, id),
  findById: (id: string) => LocalStorage.findById(STORAGE_KEYS.MAINTENANCE, id),
};

export const notificationStorage = {
  getAll: () => LocalStorage.get(STORAGE_KEYS.NOTIFICATIONS),
  add: (notification: any) => LocalStorage.add(STORAGE_KEYS.NOTIFICATIONS, notification),
  update: (id: string, updates: any) => LocalStorage.update(STORAGE_KEYS.NOTIFICATIONS, id, updates),
  delete: (id: string) => LocalStorage.delete(STORAGE_KEYS.NOTIFICATIONS, id),
  findById: (id: string) => LocalStorage.findById(STORAGE_KEYS.NOTIFICATIONS, id),
};