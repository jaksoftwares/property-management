'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { X } from 'lucide-react';

interface AddUnitFormProps {
  onSave: (unitData: any) => void;
  onCancel: () => void;
}

export function AddUnitForm({ onSave, onCancel }: AddUnitFormProps) {
  const [formData, setFormData] = useState({
    unitNumber: '',
    type: '',
    size: '',
    rentAmount: '',
    deposit: '',
    status: 'vacant',
    description: '',
    amenities: [] as string[],
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const unitTypes = [
    'studio',
    'bedsitter',
    '1-bedroom',
    '2-bedroom',
    '3-bedroom',
    'penthouse'
  ];

  const availableAmenities = [
    'Balcony',
    'Parking',
    'WiFi',
    'Swimming Pool',
    'Gym',
    'Garden View',
    'Air Conditioning',
    'Elevator Access',
    'Security',
    'Laundry'
  ];

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.unitNumber.trim()) {
      newErrors.unitNumber = 'Unit number is required';
    }
    if (!formData.type) {
      newErrors.type = 'Unit type is required';
    }
    if (!formData.size || isNaN(Number(formData.size)) || Number(formData.size) <= 0) {
      newErrors.size = 'Valid size is required';
    }
    if (!formData.rentAmount || isNaN(Number(formData.rentAmount)) || Number(formData.rentAmount) <= 0) {
      newErrors.rentAmount = 'Valid rent amount is required';
    }
    if (!formData.deposit || isNaN(Number(formData.deposit)) || Number(formData.deposit) < 0) {
      newErrors.deposit = 'Valid deposit amount is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    onSave({
      ...formData,
      size: Number(formData.size),
      rentAmount: Number(formData.rentAmount),
      deposit: Number(formData.deposit),
    });
  };

  const handleAmenityChange = (amenity: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      amenities: checked 
        ? [...prev.amenities, amenity]
        : prev.amenities.filter(a => a !== amenity)
    }));
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Add New Unit</CardTitle>
        <Button variant="ghost" size="icon" onClick={onCancel}>
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="unitNumber">Unit Number *</Label>
              <Input
                id="unitNumber"
                value={formData.unitNumber}
                onChange={(e) => setFormData(prev => ({ ...prev, unitNumber: e.target.value }))}
                placeholder="e.g., A101, B205"
                className={errors.unitNumber ? 'border-red-500' : ''}
              />
              {errors.unitNumber && (
                <p className="text-sm text-red-600 mt-1">{errors.unitNumber}</p>
              )}
            </div>

            <div>
              <Label htmlFor="type">Unit Type *</Label>
              <Select 
                value={formData.type} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, type: value }))}
              >
                <SelectTrigger className={errors.type ? 'border-red-500' : ''}>
                  <SelectValue placeholder="Select unit type" />
                </SelectTrigger>
                <SelectContent>
                  {unitTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.type && (
                <p className="text-sm text-red-600 mt-1">{errors.type}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="size">Size (sq ft) *</Label>
              <Input
                id="size"
                type="number"
                value={formData.size}
                onChange={(e) => setFormData(prev => ({ ...prev, size: e.target.value }))}
                placeholder="e.g., 650"
                className={errors.size ? 'border-red-500' : ''}
              />
              {errors.size && (
                <p className="text-sm text-red-600 mt-1">{errors.size}</p>
              )}
            </div>

            <div>
              <Label htmlFor="rentAmount">Monthly Rent (KSh) *</Label>
              <Input
                id="rentAmount"
                type="number"
                value={formData.rentAmount}
                onChange={(e) => setFormData(prev => ({ ...prev, rentAmount: e.target.value }))}
                placeholder="e.g., 25000"
                className={errors.rentAmount ? 'border-red-500' : ''}
              />
              {errors.rentAmount && (
                <p className="text-sm text-red-600 mt-1">{errors.rentAmount}</p>
              )}
            </div>

            <div>
              <Label htmlFor="deposit">Security Deposit (KSh) *</Label>
              <Input
                id="deposit"
                type="number"
                value={formData.deposit}
                onChange={(e) => setFormData(prev => ({ ...prev, deposit: e.target.value }))}
                placeholder="e.g., 50000"
                className={errors.deposit ? 'border-red-500' : ''}
              />
              {errors.deposit && (
                <p className="text-sm text-red-600 mt-1">{errors.deposit}</p>
              )}
            </div>
          </div>

          <div>
            <Label htmlFor="status">Initial Status</Label>
            <Select 
              value={formData.status} 
              onValueChange={(value) => setFormData(prev => ({ ...prev, status: value }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="vacant">Vacant</SelectItem>
                <SelectItem value="occupied">Occupied</SelectItem>
                <SelectItem value="maintenance">Under Maintenance</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Optional description of the unit..."
              rows={3}
            />
          </div>

          <div>
            <Label>Amenities</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-2">
              {availableAmenities.map((amenity) => (
                <div key={amenity} className="flex items-center space-x-2">
                  <Checkbox
                    id={amenity}
                    checked={formData.amenities.includes(amenity)}
                    onCheckedChange={(checked) => handleAmenityChange(amenity, checked as boolean)}
                  />
                  <Label htmlFor={amenity} className="text-sm font-normal">
                    {amenity}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit">
              Add Unit
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}