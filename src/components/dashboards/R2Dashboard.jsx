'use client';

import { StatCard, QuickActions } from './BaseDashboard';
import {
  CurrencyRupeeIcon,
  BoltIcon,
  ChartBarIcon,
  ExclamationCircleIcon,
  DevicePhoneMobileIcon,
  LightBulbIcon,
} from '@heroicons/react/24/outline';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function R2Dashboard({ data }) {
  // Sample data - replace with real data from API
  const usageData = [
    { day: 'Mon', usage: 5.2 },
    { day: 'Tue', usage: 6.1 },
    { day: 'Wed', usage: 4.8 },
    { day: 'Thu', usage: 5.5 },
    { day: 'Fri', usage: 7.2 },
    { day: 'Sat', usage: 8.4 },
    { day: 'Sun', usage: 7.8 },
  ];

  const stats = [
    {
      name: 'Current Bill',
      value: data?.currentBill ? `₹${data.currentBill}` : '₹2,450',
      icon: CurrencyRupeeIcon,
      change: '+5.2%',
      changeType: 'positive',
      href: '/billing',
    },
    {
      name: 'Units Consumed',
      value: data?.unitsConsumed ? `${data.unitsConsumed} kWh` : '450 kWh',
      icon: BoltIcon,
      change: '+3.1%',
      changeType: 'positive',
      href: '/usage',
    },
    {
      name: 'Peak Usage',
      value: data?.peakUsage ? `${data.peakUsage} kW` : '2.4 kW',
      icon: ChartBarIcon,
      change: 'Today 7-8 PM',
      changeType: 'neutral',
      href: '/usage',
    },
    {
      name: 'Appliances',
      value: data?.appliances || '8',
      icon: LightBulbIcon,
      change: 'Track usage',
      changeType: 'neutral',
      href: '/appliances',
    },
  ];

  const actions = [
    { name: 'Pay Bill', href: '/billing', primary: true },
    { name: 'Report Outage', href: '/outage', primary: false },
    { name: 'Energy Audit', href: '/audit', primary: false },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">
          Welcome back, {data?.name || 'Customer'}!
        </h1>
        <p className="text-gray-600">
          R2 Dashboard - Medium Residential Consumer
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        {stats.map((stat) => (
          <StatCard key={stat.name} stat={stat} />
        ))}
      </div>

      {/* Usage Chart */}
      <div className="bg-white shadow rounded-lg mb-8">
        <div className="px-6 py-5 border-b border-gray-200">
          <h3 className="text-lg font-medium leading-6 text-gray-900">
            Weekly Usage Pattern
          </h3>
          <p className="text-sm text-gray-500">
            Your consumption trend for the last 7 days
          </p>
        </div>
        <div className="px-6 py-5">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={usageData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="usage" stroke="#3B82F6" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <QuickActions actions={actions} />
    </div>
  );
}
