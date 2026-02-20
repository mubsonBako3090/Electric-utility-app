'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import {
  CurrencyRupeeIcon,
  BoltIcon,
  ChartBarIcon,
  ExclamationCircleIcon,
} from '@heroicons/react/24/outline';
import Link from 'next/link';

// Import category-specific dashboards
import R1Dashboard from '@/components/dashboards/R1Dashboard';
import R2Dashboard from '@/components/dashboards/R2Dashboard';
import R3Dashboard from '@/components/dashboards/R3Dashboard';
import R4Dashboard from '@/components/dashboards/R4Dashboard';
import R5Dashboard from '@/components/dashboards/R5Dashboard';
import C1Dashboard from '@/components/dashboards/C1Dashboard';
import C2Dashboard from '@/components/dashboards/C2Dashboard';

const dashboardComponents = {
  R1: R1Dashboard,
  R2: R2Dashboard,
  R3: R3Dashboard,
  R4: R4Dashboard,
  R5: R5Dashboard,
  C1: C1Dashboard,
  C2: C2Dashboard,
};

export default function CategoryDashboard({ params }) {
  const { user } = useAuth();
  const category = params.category;
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, [category]);

  const fetchDashboardData = async () => {
    try {
      const res = await fetch(`/api/customers/dashboard?category=${category}`);
      const data = await res.json();
      if (res.ok) {
        setDashboardData(data);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Use category-specific dashboard component
  const DashboardComponent = dashboardComponents[category] || R1Dashboard;

  return <DashboardComponent data={dashboardData} />;
}
