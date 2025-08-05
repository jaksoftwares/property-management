import { LocalStorage } from './storage';

const ADMIN_STORAGE_KEYS = {
  SYSTEM_ADMINS: 'dovepeak_system_admins',
  PROPERTY_MANAGERS: 'dovepeak_property_managers',
  SYSTEM_SETTINGS: 'dovepeak_system_settings',
  AUDIT_LOGS: 'dovepeak_audit_logs',
  CURRENT_ADMIN: 'dovepeak_current_admin',
};

export const systemAdminStorage = {
  getAll: () => LocalStorage.get(ADMIN_STORAGE_KEYS.SYSTEM_ADMINS),
  add: (admin: any) => LocalStorage.add(ADMIN_STORAGE_KEYS.SYSTEM_ADMINS, admin),
  update: (id: string, updates: any) => LocalStorage.update(ADMIN_STORAGE_KEYS.SYSTEM_ADMINS, id, updates),
  delete: (id: string) => LocalStorage.delete(ADMIN_STORAGE_KEYS.SYSTEM_ADMINS, id),
  findById: (id: string) => LocalStorage.findById(ADMIN_STORAGE_KEYS.SYSTEM_ADMINS, id),
  findByEmail: (email: string) => {
    const admins = LocalStorage.get(ADMIN_STORAGE_KEYS.SYSTEM_ADMINS);
    return admins.find((admin: any) => admin.email === email) || null;
  },
};

export const propertyManagerStorage = {
  getAll: () => LocalStorage.get(ADMIN_STORAGE_KEYS.PROPERTY_MANAGERS),
  add: (manager: any) => LocalStorage.add(ADMIN_STORAGE_KEYS.PROPERTY_MANAGERS, manager),
  update: (id: string, updates: any) => LocalStorage.update(ADMIN_STORAGE_KEYS.PROPERTY_MANAGERS, id, updates),
  delete: (id: string) => LocalStorage.delete(ADMIN_STORAGE_KEYS.PROPERTY_MANAGERS, id),
  findById: (id: string) => LocalStorage.findById(ADMIN_STORAGE_KEYS.PROPERTY_MANAGERS, id),
  findByEmail: (email: string) => {
    const managers = LocalStorage.get(ADMIN_STORAGE_KEYS.PROPERTY_MANAGERS);
    return managers.find((manager: any) => manager.email === email) || null;
  },
};

export const systemSettingsStorage = {
  get: () => {
    const settings = LocalStorage.get(ADMIN_STORAGE_KEYS.SYSTEM_SETTINGS);
    return settings.length > 0 ? settings[0] : null;
  },
  update: (settings: any) => {
    const existing = LocalStorage.get(ADMIN_STORAGE_KEYS.SYSTEM_SETTINGS);
    if (existing.length > 0) {
      LocalStorage.update(ADMIN_STORAGE_KEYS.SYSTEM_SETTINGS, existing[0].id, settings);
    } else {
      LocalStorage.add(ADMIN_STORAGE_KEYS.SYSTEM_SETTINGS, { ...settings, id: LocalStorage.generateId() });
    }
  },
};

export const auditLogStorage = {
  getAll: () => LocalStorage.get(ADMIN_STORAGE_KEYS.AUDIT_LOGS),
  add: (log: any) => LocalStorage.add(ADMIN_STORAGE_KEYS.AUDIT_LOGS, log),
  findByUser: (userId: string) => {
    const logs = LocalStorage.get(ADMIN_STORAGE_KEYS.AUDIT_LOGS);
    return logs.filter((log: any) => log.userId === userId);
  },
  findByAction: (action: string) => {
    const logs = LocalStorage.get(ADMIN_STORAGE_KEYS.AUDIT_LOGS);
    return logs.filter((log: any) => log.action === action);
  },
};

export const currentAdminStorage = {
  get: () => {
    if (typeof window === 'undefined') return null;
    const data = localStorage.getItem(ADMIN_STORAGE_KEYS.CURRENT_ADMIN);
    return data ? JSON.parse(data) : null;
  },
  set: (admin: any) => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(ADMIN_STORAGE_KEYS.CURRENT_ADMIN, JSON.stringify(admin));
  },
  clear: () => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(ADMIN_STORAGE_KEYS.CURRENT_ADMIN);
  },
};

// Audit logging helper
export const logAuditAction = (userId: string, userType: string, action: string, resource: string, details: string, resourceId?: string) => {
  auditLogStorage.add({
    userId,
    userType,
    action,
    resource,
    resourceId,
    details,
    timestamp: new Date().toISOString(),
  });
};