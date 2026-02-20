'use client';

import { StatCard, QuickActions } from './BaseDashboard';
import {
  CurrencyRupeeIcon,
  BoltIcon,
  ChartBarIcon,
  ExclamationCircleIcon,
  BuildingStorefrontIcon,
  DocumentTextIcon,
} from '@heroicons/react/24/outline';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function C1Dashboard({ data }) {
  const businessHoursData = [
    { time: '9 AM', usage: 8.2 },
    { time: '11 AM', usage: 12.5 },
    { time: '1 PM', usage: 15.8 },
    { time: '3 PM', usage: 14.2 },
    { time: '5 PM', usage: 18.5 },
    { time: '7 PM', usage: 10.2 },
  ];

  const stats = [
    {
      name: 'Current Bill',
      value: data?.currentBill ? `₹${data.currentBill}` : '₹12,450',
      icon: CurrencyRupeeIcon,
      change: '+15.2%',
      changeType: 'positive',
      href: '/billing',
    },
    {
      name: 'Units Consumed',
      value: data?.unitsConsumed ? `${data.unitsConsumed} kWh` : '2,450 kWh',
      icon: BoltIcon,
      change: '+8.3%',
      changeType: 'positive',
      href: '/usage',
    },
    {
      name: 'Power Factor',
      value: data?.powerFactor || '0.92',
      icon: ChartBarIcon,
      change: 'Good',
      changeType: 'positive',
      href: '/quality',
    },
    {
      name: 'Demand Charge',
      value: data?.demandCharge ? `₹${data.demandCharge}` : '₹2,850',
      icon: BuildingStorefrontIcon,
      change: 'Based on peak',
      changeType: 'neutral',
      href: '/billing',
    },
  ];

  const actions = [
    { name: 'Pay Bill', href: '/billing', primary: true },
    { name: 'Load Profile', href: '/profile', primary: false },
    { name: 'GST Invoice', href: '/invoice', primary: false },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">
          Welcome back, {data?.businessName || data?.name || 'Customer'}!
        </h1>
        <p className="text-gray-600">
          C1 Dashboard - Small Commercial Establishment
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        {stats.map((stat) => (
          <StatCard key={stat.name} stat={stat} />
        ))}
      </div>

      {/* Business Hours Consumption */}
      <div className="bg-white shadow rounded-lg mb-8">
        <div className="px-6 py-5 border-b border-gray-200">
          <h3 className="text-lg font-medium leading-6 text-gray-900">
            Business Hours Consumption
          </h3>
          <p className="text-sm text-gray-500">
            Today's usage pattern
          </p>
        </div>
        <div className="px-6 py-5">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={businessHoursData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="usage" stroke="#3B82F6" fill="#93C5FD" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Tax Invoice Section */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
        <div className="flex items-start">
          <DocumentTextIcon className="h-6 w-6 text-blue-600 mt-0.5" />
          <div className="ml-3">
            <h3 className="text-sm font-medium text-blue-800">GST Ready Invoice</h3>
            <p className="text-sm text-blue-700 mt-1">
              Your bills include GST input credit. Download tax invoices for your records.
            </p>
            <button className="mt-3 text-sm text-blue-600 hover:text-blue-800 font-medium">
              Download Latest Invoice →
            </button>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <QuickActions actions={actions} />
    </div>
  );
      }
