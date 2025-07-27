'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { seedSampleData } from '@/lib/data-seeding';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Seed sample data on first load
    seedSampleData();
    // Redirect to dashboard
    router.push('/dashboard');
  }, [router]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading Dovepeak...</p>
      </div>
    </div>
  );
}