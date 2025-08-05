'use client';

import { Bell, Search, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

interface AdminHeaderProps {
  title: string;
  subtitle?: string;
}

export function AdminHeader({ title, subtitle }: AdminHeaderProps) {
  return (
    <div className="flex items-center justify-between py-6 px-6 bg-white border-b border-gray-200">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900 flex items-center">
          <Shield className="h-6 w-6 mr-2 text-blue-600" />
          {title}
        </h1>
        {subtitle && <p className="text-sm text-gray-600 mt-1">{subtitle}</p>}
      </div>
      
      <div className="flex items-center space-x-4">
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search system..."
            className="pl-9 w-64"
          />
        </div>
        
        <Button variant="outline" size="icon" className="relative">
          <Bell className="h-4 w-4" />
          <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs bg-red-500 text-white">
            2
          </Badge>
        </Button>
      </div>
    </div>
  );
}