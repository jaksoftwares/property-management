'use client';

import { useEffect, useState } from 'react';
import { Download, TrendingUp, FileText, BarChart3 } from 'lucide-react';
import { Sidebar } from '@/components/layout/sidebar';
import { Header } from '@/components/layout/header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RevenueChart } from '@/components/dashboard/revenue-chart';
import { apartmentStorage, unitStorage, tenantStorage, paymentStorage } from '@/lib/storage';

export default function Reports() {
  const [reportData, setReportData] = useState<{
    apartments: any[];
    units: any[];
    tenants: any[];
    payments: any[];
  }>({
    apartments: [],
    units: [],
    tenants: [],
    payments: [],
  });

  useEffect(() => {
    setReportData({
      apartments: apartmentStorage.getAll(),
      units: unitStorage.getAll(),
      tenants: tenantStorage.getAll(),
      payments: paymentStorage.getAll(),
    });
  }, []);

  const generateFinancialSummary = () => {
    const totalRevenue = reportData.payments
      .filter((p: any) => p.status === 'paid')
      .reduce((sum: number, p: any) => sum + p.amount, 0);
    
    const pendingRevenue = reportData.payments
      .filter((p: any) => p.status === 'pending')
      .reduce((sum: number, p: any) => sum + p.amount, 0);
    
    const overdueRevenue = reportData.payments
      .filter((p: any) => p.status === 'overdue')
      .reduce((sum: number, p: any) => sum + p.amount, 0);

    return {
      totalRevenue,
      pendingRevenue,
      overdueRevenue,
      collectionRate: totalRevenue / (totalRevenue + pendingRevenue + overdueRevenue) * 100 || 0,
    };
  };

  const generateOccupancyReport = () => {
    const occupied = reportData.units.filter((u: any) => u.status === 'occupied').length;
    const vacant = reportData.units.filter((u: any) => u.status === 'vacant').length;
    const maintenance = reportData.units.filter((u: any) => u.status === 'maintenance').length;
    const total = reportData.units.length;

    return {
      occupied,
      vacant,
      maintenance,
      total,
      occupancyRate: total > 0 ? (occupied / total) * 100 : 0,
    };
  };

  const financialSummary = generateFinancialSummary();
  const occupancyReport = generateOccupancyReport();

  const reportCards = [
    {
      title: 'Financial Report',
      description: 'Revenue, expenses, and collection rates',
      icon: TrendingUp,
      color: 'bg-green-100 text-green-600',
    },
    {
      title: 'Occupancy Report',
      description: 'Unit utilization and vacancy rates',
      icon: BarChart3,
      color: 'bg-blue-100 text-blue-600',
    },
    {
      title: 'Tenant Report',
      description: 'Lease details and tenant information',
      icon: FileText,
      color: 'bg-purple-100 text-purple-600',
    },
    {
      title: 'Maintenance Report',
      description: 'Service requests and completion rates',
      icon: FileText,
      color: 'bg-orange-100 text-orange-600',
    },
  ];

  const exportReport = (type: string) => {
    // In a real app, this would generate and download the report
    console.log(`Exporting ${type} report...`);
    alert(`${type} report exported successfully!`);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden lg:ml-0">
        <Header 
          title="Reports & Analytics" 
          subtitle="Generate insights and export data"
        />
        
        <main className="flex-1 overflow-y-auto p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Business Intelligence</h2>
              <p className="text-sm text-gray-600">
                Analyze performance and make data-driven decisions
              </p>
            </div>
            <Button>
              <Download className="h-4 w-4 mr-2" />
              Export All Reports
            </Button>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  Total Revenue
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  KSh {financialSummary.totalRevenue.toLocaleString()}
                </div>
                <p className="text-xs text-gray-500 mt-1">Collected this period</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  Collection Rate
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">
                  {financialSummary.collectionRate.toFixed(1)}%
                </div>
                <p className="text-xs text-gray-500 mt-1">Payment efficiency</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  Occupancy Rate
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-600">
                  {occupancyReport.occupancyRate.toFixed(1)}%
                </div>
                <p className="text-xs text-gray-500 mt-1">Units occupied</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  Total Properties
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-600">
                  {reportData.apartments.length}
                </div>
                <p className="text-xs text-gray-500 mt-1">Managed buildings</p>
              </CardContent>
            </Card>
          </div>

          {/* Report Categories */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {reportCards.map((report, index) => (
              <Card key={index} className="cursor-pointer hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className={`p-3 rounded-lg ${report.color}`}>
                        <report.icon className="h-6 w-6" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{report.title}</h3>
                        <p className="text-sm text-gray-600">{report.description}</p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => exportReport(report.title)}
                      >
                        <Download className="h-4 w-4 mr-1" />
                        PDF
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => exportReport(report.title)}
                      >
                        CSV
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Tabs defaultValue="financial" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="financial">Financial Analysis</TabsTrigger>
              <TabsTrigger value="occupancy">Occupancy Trends</TabsTrigger>
              <TabsTrigger value="custom">Custom Reports</TabsTrigger>
            </TabsList>
            
            <TabsContent value="financial" className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <RevenueChart />
                <Card>
                  <CardHeader>
                    <CardTitle>Payment Status Breakdown</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Collected</span>
                        <div className="text-right">
                          <div className="font-semibold text-green-600">
                            KSh {financialSummary.totalRevenue.toLocaleString()}
                          </div>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Pending</span>
                        <div className="text-right">
                          <div className="font-semibold text-yellow-600">
                            KSh {financialSummary.pendingRevenue.toLocaleString()}
                          </div>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Overdue</span>
                        <div className="text-right">
                          <div className="font-semibold text-red-600">
                            KSh {financialSummary.overdueRevenue.toLocaleString()}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="occupancy" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Unit Status Overview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-green-600">
                        {occupancyReport.occupied}
                      </div>
                      <p className="text-sm text-gray-600">Occupied Units</p>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-yellow-600">
                        {occupancyReport.vacant}
                      </div>
                      <p className="text-sm text-gray-600">Vacant Units</p>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-red-600">
                        {occupancyReport.maintenance}
                      </div>
                      <p className="text-sm text-gray-600">Maintenance Units</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="custom" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Custom Report Builder</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Custom Reports</h3>
                    <p className="text-gray-500 mb-4">
                      Build custom reports with specific date ranges and filters
                    </p>
                    <Button>
                      Create Custom Report
                    </Button>
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