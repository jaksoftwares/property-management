import { LocalStorage } from './storage';

const TENANT_STORAGE_KEYS = {
  TENANT_USERS: 'dovepeak_tenant_users',
  TENANT_NOTIFICATIONS: 'dovepeak_tenant_notifications',
  CURRENT_TENANT: 'dovepeak_current_tenant',
};

export const tenantUserStorage = {
  getAll: () => LocalStorage.get(TENANT_STORAGE_KEYS.TENANT_USERS),
  add: (tenantUser: any) => LocalStorage.add(TENANT_STORAGE_KEYS.TENANT_USERS, tenantUser),
  update: (id: string, updates: any) => LocalStorage.update(TENANT_STORAGE_KEYS.TENANT_USERS, id, updates),
  delete: (id: string) => LocalStorage.delete(TENANT_STORAGE_KEYS.TENANT_USERS, id),
  findById: (id: string) => LocalStorage.findById(TENANT_STORAGE_KEYS.TENANT_USERS, id),
  findByEmail: (email: string) => {
    const users = LocalStorage.get(TENANT_STORAGE_KEYS.TENANT_USERS);
    return users.find((user: any) => user.email === email) || null;
  },
  findByTenantId: (tenantId: string) => {
    const users = LocalStorage.get(TENANT_STORAGE_KEYS.TENANT_USERS);
    return users.find((user: any) => user.tenantId === tenantId) || null;
  },
};

export const tenantNotificationStorage = {
  getAll: () => LocalStorage.get(TENANT_STORAGE_KEYS.TENANT_NOTIFICATIONS),
  add: (notification: any) => LocalStorage.add(TENANT_STORAGE_KEYS.TENANT_NOTIFICATIONS, notification),
  update: (id: string, updates: any) => LocalStorage.update(TENANT_STORAGE_KEYS.TENANT_NOTIFICATIONS, id, updates),
  delete: (id: string) => LocalStorage.delete(TENANT_STORAGE_KEYS.TENANT_NOTIFICATIONS, id),
  findById: (id: string) => LocalStorage.findById(TENANT_STORAGE_KEYS.TENANT_NOTIFICATIONS, id),
  findByTenant: (tenantId: string) => {
    const notifications = LocalStorage.get(TENANT_STORAGE_KEYS.TENANT_NOTIFICATIONS);
    return notifications.filter((notification: any) => notification.tenantId === tenantId);
  },
};

export const currentTenantStorage = {
  get: () => {
    if (typeof window === 'undefined') return null;
    const data = localStorage.getItem(TENANT_STORAGE_KEYS.CURRENT_TENANT);
    return data ? JSON.parse(data) : null;
  },
  set: (tenant: any) => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(TENANT_STORAGE_KEYS.CURRENT_TENANT, JSON.stringify(tenant));
  },
  clear: () => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(TENANT_STORAGE_KEYS.CURRENT_TENANT);
  },
};