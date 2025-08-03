'use client';

import { useEffect, useState } from 'react';
import { Save, User, Bell, Shield, LogOut } from 'lucide-react';
import { TenantSidebar } from '@/components/tenant/tenant-sidebar';
import { TenantHeader } from '@/components/tenant/tenant-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { currentTenantStorage, tenantUserStorage } from '@/lib/tenant-storage';

export default function TenantSettings() {
  const [currentTenant, setCurrentTenant] = useState<any>(null);
  const [settings, setSettings] = useState({
    profile: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
    },
    notifications: {
      rentReminders: true,
      maintenanceUpdates: true,
      generalNotices: true,
      emailNotifications: true,
      smsNotifications: false,
    },
    privacy: {
      shareContactInfo: false,
      allowMaintenanceAccess: true,
    },
  });

  useEffect(() => {
    const tenant = currentTenantStorage.get();
    if (!tenant) {
      window.location.href = '/tenant/login';
      return;
    }

    setCurrentTenant(tenant);
    setSettings({
      profile: {
        firstName: tenant.firstName,
        lastName: tenant.lastName,
        email: tenant.email,
        phone: tenant.phone,
      },
      notifications: {
        rentReminders: true,
        maintenanceUpdates: true,
        generalNotices: true,
        emailNotifications: true,
        smsNotifications: false,
      },
      privacy: {
        shareContactInfo: false,
        allowMaintenanceAccess: true,
      },
    });
  }, []);

  const handleSave = () => {
    if (!currentTenant) return;

    // Update tenant user data
    tenantUserStorage.update(currentTenant.id, {
      firstName: settings.profile.firstName,
      lastName: settings.profile.lastName,
      email: settings.profile.email,
      phone: settings.profile.phone,
    });

    // Update current tenant in storage
    const updatedTenant = {
      ...currentTenant,
      ...settings.profile,
    };
    currentTenantStorage.set(updatedTenant);
    setCurrentTenant(updatedTenant);

    alert('Settings saved successfully!');
  };

  const handleLogout = () => {
    currentTenantStorage.clear();
    window.location.href = '/tenant/login';
  };

  if (!currentTenant) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <TenantSidebar />
      <div className="flex-1 flex flex-col overflow-hidden lg:ml-0">
        <TenantHeader 
          title="Settings" 
          subtitle="Manage your account preferences and notifications"
        />
        
        <main className="flex-1 overflow-y-auto p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Account Settings</h2>
              <p className="text-sm text-gray-600">
                Update your profile and preferences
              </p>
            </div>
            <Button onClick={handleSave}>
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </Button>
          </div>

          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="profile" className="flex items-center space-x-2">
                <User className="h-4 w-4" />
                <span className="hidden sm:inline">Profile</span>
              </TabsTrigger>
              <TabsTrigger value="notifications" className="flex items-center space-x-2">
                <Bell className="h-4 w-4" />
                <span className="hidden sm:inline">Notifications</span>
              </TabsTrigger>
              <TabsTrigger value="privacy" className="flex items-center space-x-2">
                <Shield className="h-4 w-4" />
                <span className="hidden sm:inline">Privacy</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="profile" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Profile Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        value={settings.profile.firstName}
                        onChange={(e) => setSettings({
                          ...settings,
                          profile: { ...settings.profile, firstName: e.target.value }
                        })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        value={settings.profile.lastName}
                        onChange={(e) => setSettings({
                          ...settings,
                          profile: { ...settings.profile, lastName: e.target.value }
                        })}
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={settings.profile.email}
                      onChange={(e) => setSettings({
                        ...settings,
                        profile: { ...settings.profile, email: e.target.value }
                      })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      value={settings.profile.phone}
                      onChange={(e) => setSettings({
                        ...settings,
                        profile: { ...settings.profile, phone: e.target.value }
                      })}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="notifications" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Notification Preferences</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="rentReminders">Rent Reminders</Label>
                      <p className="text-sm text-gray-500">Get notified when rent is due</p>
                    </div>
                    <Switch
                      id="rentReminders"
                      checked={settings.notifications.rentReminders}
                      onCheckedChange={(checked) => setSettings({
                        ...settings,
                        notifications: { ...settings.notifications, rentReminders: checked }
                      })}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="maintenanceUpdates">Maintenance Updates</Label>
                      <p className="text-sm text-gray-500">Updates on your maintenance requests</p>
                    </div>
                    <Switch
                      id="maintenanceUpdates"
                      checked={settings.notifications.maintenanceUpdates}
                      onCheckedChange={(checked) => setSettings({
                        ...settings,
                        notifications: { ...settings.notifications, maintenanceUpdates: checked }
                      })}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="generalNotices">General Notices</Label>
                      <p className="text-sm text-gray-500">Building announcements and updates</p>
                    </div>
                    <Switch
                      id="generalNotices"
                      checked={settings.notifications.generalNotices}
                      onCheckedChange={(checked) => setSettings({
                        ...settings,
                        notifications: { ...settings.notifications, generalNotices: checked }
                      })}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="emailNotifications">Email Notifications</Label>
                      <p className="text-sm text-gray-500">Receive notifications via email</p>
                    </div>
                    <Switch
                      id="emailNotifications"
                      checked={settings.notifications.emailNotifications}
                      onCheckedChange={(checked) => setSettings({
                        ...settings,
                        notifications: { ...settings.notifications, emailNotifications: checked }
                      })}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="smsNotifications">SMS Notifications</Label>
                      <p className="text-sm text-gray-500">Receive notifications via SMS</p>
                    </div>
                    <Switch
                      id="smsNotifications"
                      checked={settings.notifications.smsNotifications}
                      onCheckedChange={(checked) => setSettings({
                        ...settings,
                        notifications: { ...settings.notifications, smsNotifications: checked }
                      })}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="privacy" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Privacy Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="shareContactInfo">Share Contact Information</Label>
                      <p className="text-sm text-gray-500">Allow property management to share your contact info with service providers</p>
                    </div>
                    <Switch
                      id="shareContactInfo"
                      checked={settings.privacy.shareContactInfo}
                      onCheckedChange={(checked) => setSettings({
                        ...settings,
                        privacy: { ...settings.privacy, shareContactInfo: checked }
                      })}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="allowMaintenanceAccess">Allow Maintenance Access</Label>
                      <p className="text-sm text-gray-500">Permit maintenance staff to enter your unit when you're not present</p>
                    </div>
                    <Switch
                      id="allowMaintenanceAccess"
                      checked={settings.privacy.allowMaintenanceAccess}
                      onCheckedChange={(checked) => setSettings({
                        ...settings,
                        privacy: { ...settings.privacy, allowMaintenanceAccess: checked }
                      })}
                    />
                  </div>
                </CardContent>
              </Card>
              
              <Card className="border-red-200">
                <CardHeader>
                  <CardTitle className="text-red-900">Account Actions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Logout</h4>
                      <p className="text-sm text-gray-600 mb-4">
                        Sign out of your tenant portal account
                      </p>
                      <Button variant="outline" onClick={handleLogout}>
                        <LogOut className="h-4 w-4 mr-2" />
                        Logout
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
}