'use client';

import { useAuth } from '@/context/AuthContext';
import DashboardLayout from '@/components/layout/DashboardLayout';
import CustomerSidebar from '@/components/layout/CustomerSidebar';

export default function CustomerDashboardLayout({ children, params }) {
  const { user } = useAuth();
  const category = params?.category || user?.customerCategory;

  return (
    <DashboardLayout>
      <div className="flex h-screen">
        <CustomerSidebar category={category} />
        <main className="flex-1 overflow-y-auto bg-gray-50 p-6">
          {children}
        </main>
      </div>
    </DashboardLayout>
  );
}
