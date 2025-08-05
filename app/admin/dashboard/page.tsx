'use client';

import { useEffect, useState } from 'react';
import { AdminSidebar } from '@/components/admin/admin-sidebar';
import { AdminHeader } from '@/components/admin/admin-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  Building2, 
  DollarSign, 
  Activity, 
  TrendingUp, 
  AlertTriangle,
  CheckCircle,
  Clock
} from 'lucide-react';
import { 
  currentAdminStorage,
  propertyManagerStorage,
  systemSettingsStorage,
  auditLogStorage
} from '@/lib/admin-storage';
import { 
  apartmentStorage, 
  unitStorage, 
  tenantStorage, 
  paymentStorage 
} from '@/lib/storage';
import { formatDistanceToNow } from 'date-fns';

export default function AdminDashboard() {
  const [currentAdmin, setCurrentAdmin] = useState<any>(null);
  const [stats, setStats] = useState({
    totalPropertyManagers: 0,
    activePropertyManagers: 0,
    totalTenants: 0,
    activeTenants: 0,
    totalApartments: 0,
    totalUnits: 0,
    totalRevenue: 0,
    systemUptime: '99.9%',
    storageUsed: 0,
    activeUsers: 0,
  });
  const [recentActivity, setRecentActivity] = useState<any[]>([]);

  useEffect(() => {
    const admin = currentAdminStorage.get();
    if (!admin) {
      window.location.href = '/admin/login';
      return;
    }

    setCurrentAdmin(admin);
    loadSystemStats();
    loadRecentActivity();
  }, []);

  const loadSystemStats = () => {
    const propertyManagers = propertyManagerStorage.getAll();
    const tenants = tenantStorage.getAll();
    const apartments = apartmentStorage.getAll();
    const units = unitStorage.getAll();
    const payments = paymentStorage.getAll();

    const totalRevenue = payments
      .filter((p: any) => p.status === 'paid')
      .reduce((sum: number, p: any) => sum + p.amount, 0);

    setStats({
      totalPropertyManagers: propertyManagers.length,
      activePropertyManagers: propertyManagers.filter((pm: any) => pm.isActive).length,
      totalTenants: tenants.length,
      activeTenants: tenants.filter((t: any) => t.status === 'active').length,
      totalApartments: apartments.length,
      totalUnits: units.length,
      totalRevenue,
      systemUptime: '99.9%',
      storageUsed: 45, // Simulated percentage
      activeUsers: propertyManagers.filter((pm: any) => pm.lastLogin).length,
    });
  };

  const loadRecentActivity = () => {
    const logs = auditLogStorage.getAll().slice(0, 10);
    setRecentActivity(logs);
  };

  const getActivityIcon = (action: string) => {
    switch (action) {
      case 'login':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'create':
        return <TrendingUp className="h-4 w-4 text-blue-600" />;
      case 'update':
        return <Activity className="h-4 w-4 text-yellow-600" />;
      case 'delete':
        return <AlertTriangle className="h-4 w-4 text-red-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  if (!currentAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <AdminSidebar />
      <div className="flex-1 flex flex-col overflow-hidden lg:ml-0">
        <AdminHeader 
          title="System Dashboard" 
          subtitle="Monitor and manage the Dovepeak platform"
        />
        
        <main className="flex-1 overflow-y-auto p-6">
          <div className="space-y-6">
            {/* System Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">
                    Property Managers
                  </CardTitle>
                  <Users className="h-4 w-4 text-blue-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-600">
                    {stats.totalPropertyManagers}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {stats.activePropertyManagers} active
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">
                    Total Properties
                  </CardTitle>
                  <Building2 className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">
                    {stats.totalApartments}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {stats.totalUnits} units total
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">
                    Platform Revenue
                  </CardTitle>
                  <DollarSign className="h-4 w-4 text-purple-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-purple-600">
                    KSh {stats.totalRevenue.toLocaleString()}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Total collected
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">
                    System Health
                  </CardTitle>
                  <Activity className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">
                    {stats.systemUptime}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Uptime this month
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Additional Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Active Users</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Property Managers</span>
                      <Badge className="bg-blue-100 text-blue-800">
                        {stats.activePropertyManagers}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Active Tenants</span>
                      <Badge className="bg-green-100 text-green-800">
                        {stats.activeTenants}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Total Users</span>
                      <Badge className="bg-purple-100 text-purple-800">
                        {stats.totalPropertyManagers + stats.totalTenants}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">System Resources</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600">Storage Used</span>
                        <span className="font-medium">{stats.storageUsed}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ width: `${stats.storageUsed}%` }}
                        ></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600">CPU Usage</span>
                        <span className="font-medium">23%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-green-600 h-2 rounded-full w-[23%]"></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600">Memory Usage</span>
                        <span className="font-medium">67%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-yellow-600 h-2 rounded-full w-[67%]"></div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <button className="w-full text-left p-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors">
                      <div className="font-medium text-blue-900">Add Property Manager</div>
                      <div className="text-sm text-blue-700">Create new manager account</div>
                    </button>
                    <button className="w-full text-left p-3 bg-green-50 hover:bg-green-100 rounded-lg transition-colors">
                      <div className="font-medium text-green-900">System Backup</div>
                      <div className="text-sm text-green-700">Create data backup</div>
                    </button>
                    <button className="w-full text-left p-3 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors">
                      <div className="font-medium text-purple-900">View Reports</div>
                      <div className="text-sm text-purple-700">Generate system reports</div>
                    </button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Recent System Activity</CardTitle>
              </CardHeader>
              <CardContent>
                {recentActivity.length === 0 ? (
                  <div className="text-center py-8">
                    <Activity className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No Recent Activity</h3>
                    <p className="text-gray-500">System activity will appear here</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {recentActivity.map((activity) => (
                      <div key={activity.id} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                        <div className="flex-shrink-0 mt-1">
                          {getActivityIcon(activity.action)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-gray-900">{activity.details}</p>
                          <div className="flex items-center space-x-2 mt-1">
                            <Badge variant="outline" className="text-xs">
                              {activity.userType}
                            </Badge>
                            <span className="text-xs text-gray-500">
                              {formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}