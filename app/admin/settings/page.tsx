'use client';

import { useEffect, useState } from 'react';
import { Save, Mail, MessageSquare, DollarSign, Shield, Database } from 'lucide-react';
import { AdminSidebar } from '@/components/admin/admin-sidebar';
import { AdminHeader } from '@/components/admin/admin-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { currentAdminStorage, systemSettingsStorage } from '@/lib/admin-storage';

export default function AdminSettings() {
  const [currentAdmin, setCurrentAdmin] = useState<any>(null);
  const [settings, setSettings] = useState({
    general: {
      siteName: 'Dovepeak Property Management',
      siteDescription: 'Professional apartment and property management platform',
      defaultCurrency: 'KSH',
      defaultTimezone: 'Africa/Nairobi',
      maintenanceMode: false,
      allowRegistration: true,
    },
    email: {
      smtpHost: 'smtp.gmail.com',
      smtpPort: 587,
      smtpUser: '',
      smtpPassword: '',
      fromEmail: 'noreply@dovepeak.com',
      fromName: 'Dovepeak Management',
    },
    sms: {
      provider: 'twilio',
      apiKey: '',
      senderId: 'Dovepeak',
    },
    payments: {
      enabledMethods: ['cash', 'bank', 'mobile'],
      defaultLateFeePercentage: 5,
      gracePeriodDays: 3,
    },
    security: {
      sessionTimeout: 30,
      passwordExpiry: 90,
      twoFactorRequired: false,
      maxLoginAttempts: 5,
    },
  });

  useEffect(() => {
    const admin = currentAdminStorage.get();
    if (!admin) {
      window.location.href = '/admin/login';
      return;
    }

    setCurrentAdmin(admin);
    loadSettings();
  }, []);

  const loadSettings = () => {
    const systemSettings = systemSettingsStorage.get();
    if (systemSettings) {
      setSettings({
        general: {
          siteName: systemSettings.siteName,
          siteDescription: systemSettings.siteDescription,
          defaultCurrency: systemSettings.defaultCurrency,
          defaultTimezone: systemSettings.defaultTimezone,
          maintenanceMode: systemSettings.maintenanceMode,
          allowRegistration: systemSettings.allowRegistration,
        },
        email: systemSettings.emailSettings,
        sms: systemSettings.smsSettings,
        payments: systemSettings.paymentSettings,
        security: {
          sessionTimeout: 30,
          passwordExpiry: 90,
          twoFactorRequired: false,
          maxLoginAttempts: 5,
        },
      });
    }
  };

  const handleSave = () => {
    const updatedSettings = {
      siteName: settings.general.siteName,
      siteDescription: settings.general.siteDescription,
      defaultCurrency: settings.general.defaultCurrency,
      defaultTimezone: settings.general.defaultTimezone,
      maintenanceMode: settings.general.maintenanceMode,
      allowRegistration: settings.general.allowRegistration,
      emailSettings: settings.email,
      smsSettings: settings.sms,
      paymentSettings: settings.payments,
      updatedAt: new Date().toISOString(),
    };

    systemSettingsStorage.update(updatedSettings);
    alert('Settings saved successfully!');
  };

  if (!currentAdmin) {
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
      <AdminSidebar />
      <div className="flex-1 flex flex-col overflow-hidden lg:ml-0">
        <AdminHeader 
          title="System Settings" 
          subtitle="Configure platform-wide settings and preferences"
        />
        
        <main className="flex-1 overflow-y-auto p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Platform Configuration</h2>
              <p className="text-sm text-gray-600">
                Manage system-wide settings and integrations
              </p>
            </div>
            <Button onClick={handleSave}>
              <Save className="h-4 w-4 mr-2" />
              Save All Changes
            </Button>
          </div>

          <Tabs defaultValue="general" className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="general" className="flex items-center space-x-2">
                <Shield className="h-4 w-4" />
                <span className="hidden sm:inline">General</span>
              </TabsTrigger>
              <TabsTrigger value="email" className="flex items-center space-x-2">
                <Mail className="h-4 w-4" />
                <span className="hidden sm:inline">Email</span>
              </TabsTrigger>
              <TabsTrigger value="sms" className="flex items-center space-x-2">
                <MessageSquare className="h-4 w-4" />
                <span className="hidden sm:inline">SMS</span>
              </TabsTrigger>
              <TabsTrigger value="payments" className="flex items-center space-x-2">
                <DollarSign className="h-4 w-4" />
                <span className="hidden sm:inline">Payments</span>
              </TabsTrigger>
              <TabsTrigger value="security" className="flex items-center space-x-2">
                <Database className="h-4 w-4" />
                <span className="hidden sm:inline">Security</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="general" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>General Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="siteName">Site Name</Label>
                    <Input
                      id="siteName"
                      value={settings.general.siteName}
                      onChange={(e) => setSettings({
                        ...settings,
                        general: { ...settings.general, siteName: e.target.value }
                      })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="siteDescription">Site Description</Label>
                    <Textarea
                      id="siteDescription"
                      value={settings.general.siteDescription}
                      onChange={(e) => setSettings({
                        ...settings,
                        general: { ...settings.general, siteDescription: e.target.value }
                      })}
                      rows={3}
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="currency">Default Currency</Label>
                      <Select
                        value={settings.general.defaultCurrency}
                        onValueChange={(value) => setSettings({
                          ...settings,
                          general: { ...settings.general, defaultCurrency: value }
                        })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="KSH">KSH - Kenyan Shilling</SelectItem>
                          <SelectItem value="USD">USD - US Dollar</SelectItem>
                          <SelectItem value="EUR">EUR - Euro</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="timezone">Default Timezone</Label>
                      <Select
                        value={settings.general.defaultTimezone}
                        onValueChange={(value) => setSettings({
                          ...settings,
                          general: { ...settings.general, defaultTimezone: value }
                        })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Africa/Nairobi">Africa/Nairobi (EAT)</SelectItem>
                          <SelectItem value="UTC">UTC</SelectItem>
                          <SelectItem value="America/New_York">America/New_York (EST)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="maintenanceMode">Maintenance Mode</Label>
                      <p className="text-sm text-gray-500">Temporarily disable access to the platform</p>
                    </div>
                    <Switch
                      id="maintenanceMode"
                      checked={settings.general.maintenanceMode}
                      onCheckedChange={(checked) => setSettings({
                        ...settings,
                        general: { ...settings.general, maintenanceMode: checked }
                      })}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="allowRegistration">Allow Registration</Label>
                      <p className="text-sm text-gray-500">Allow new property managers to register</p>
                    </div>
                    <Switch
                      id="allowRegistration"
                      checked={settings.general.allowRegistration}
                      onCheckedChange={(checked) => setSettings({
                        ...settings,
                        general: { ...settings.general, allowRegistration: checked }
                      })}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="email" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Email Configuration</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="smtpHost">SMTP Host</Label>
                      <Input
                        id="smtpHost"
                        value={settings.email.smtpHost}
                        onChange={(e) => setSettings({
                          ...settings,
                          email: { ...settings.email, smtpHost: e.target.value }
                        })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="smtpPort">SMTP Port</Label>
                      <Input
                        id="smtpPort"
                        type="number"
                        value={settings.email.smtpPort}
                        onChange={(e) => setSettings({
                          ...settings,
                          email: { ...settings.email, smtpPort: Number(e.target.value) }
                        })}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="smtpUser">SMTP Username</Label>
                      <Input
                        id="smtpUser"
                        value={settings.email.smtpUser}
                        onChange={(e) => setSettings({
                          ...settings,
                          email: { ...settings.email, smtpUser: e.target.value }
                        })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="smtpPassword">SMTP Password</Label>
                      <Input
                        id="smtpPassword"
                        type="password"
                        value={settings.email.smtpPassword}
                        onChange={(e) => setSettings({
                          ...settings,
                          email: { ...settings.email, smtpPassword: e.target.value }
                        })}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="fromEmail">From Email</Label>
                      <Input
                        id="fromEmail"
                        type="email"
                        value={settings.email.fromEmail}
                        onChange={(e) => setSettings({
                          ...settings,
                          email: { ...settings.email, fromEmail: e.target.value }
                        })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="fromName">From Name</Label>
                      <Input
                        id="fromName"
                        value={settings.email.fromName}
                        onChange={(e) => setSettings({
                          ...settings,
                          email: { ...settings.email, fromName: e.target.value }
                        })}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="sms" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>SMS Configuration</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="smsProvider">SMS Provider</Label>
                    <Select
                      value={settings.sms.provider}
                      onValueChange={(value) => setSettings({
                        ...settings,
                        sms: { ...settings.sms, provider: value }
                      })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="twilio">Twilio</SelectItem>
                        <SelectItem value="africastalking">Africa's Talking</SelectItem>
                        <SelectItem value="nexmo">Nexmo</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="smsApiKey">API Key</Label>
                    <Input
                      id="smsApiKey"
                      type="password"
                      value={settings.sms.apiKey}
                      onChange={(e) => setSettings({
                        ...settings,
                        sms: { ...settings.sms, apiKey: e.target.value }
                      })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="senderId">Sender ID</Label>
                    <Input
                      id="senderId"
                      value={settings.sms.senderId}
                      onChange={(e) => setSettings({
                        ...settings,
                        sms: { ...settings.sms, senderId: e.target.value }
                      })}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="payments" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Payment Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="lateFee">Default Late Fee (%)</Label>
                      <Input
                        id="lateFee"
                        type="number"
                        value={settings.payments.defaultLateFeePercentage}
                        onChange={(e) => setSettings({
                          ...settings,
                          payments: { ...settings.payments, defaultLateFeePercentage: Number(e.target.value) }
                        })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="gracePeriod">Grace Period (Days)</Label>
                      <Input
                        id="gracePeriod"
                        type="number"
                        value={settings.payments.gracePeriodDays}
                        onChange={(e) => setSettings({
                          ...settings,
                          payments: { ...settings.payments, gracePeriodDays: Number(e.target.value) }
                        })}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="security" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Security Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
                      <Input
                        id="sessionTimeout"
                        type="number"
                        value={settings.security.sessionTimeout}
                        onChange={(e) => setSettings({
                          ...settings,
                          security: { ...settings.security, sessionTimeout: Number(e.target.value) }
                        })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="maxLoginAttempts">Max Login Attempts</Label>
                      <Input
                        id="maxLoginAttempts"
                        type="number"
                        value={settings.security.maxLoginAttempts}
                        onChange={(e) => setSettings({
                          ...settings,
                          security: { ...settings.security, maxLoginAttempts: Number(e.target.value) }
                        })}
                      />
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="twoFactorRequired">Require Two-Factor Authentication</Label>
                      <p className="text-sm text-gray-500">Force all users to enable 2FA</p>
                    </div>
                    <Switch
                      id="twoFactorRequired"
                      checked={settings.security.twoFactorRequired}
                      onCheckedChange={(checked) => setSettings({
                        ...settings,
                        security: { ...settings.security, twoFactorRequired: checked }
                      })}
                    />
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