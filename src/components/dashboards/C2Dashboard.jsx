'use client';

import { StatCard, QuickActions } from './BaseDashboard';
import {
  CurrencyRupeeIcon,
  BoltIcon,
  ChartBarIcon,
  ExclamationCircleIcon,
  BuildingOfficeIcon,
  DocumentTextIcon,
  ScaleIcon,
} from '@heroicons/react/24/outline';
import { ComposedChart, Line, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function C2Dashboard({ data }) {
  const advancedData = [
    { time: '00:00', usage: 25, temp: 24, cost: 125 },
    { time: '04:00', usage: 18, temp: 23, cost: 90 },
    { time: '08:00', usage: 45, temp: 26, cost: 225 },
    { time: '12:00', usage: 52, temp: 30, cost: 260 },
    { time: '16:00', usage: 58, temp: 31, cost: 290 },
    { time: '20:00', usage: 42, temp: 28, cost: 210 },
  ];

  const stats = [
    {
      name: 'Current Bill',
      value: data?.currentBill ? `₹${data.currentBill}` : '₹45,800',
      icon: CurrencyRupeeIcon,
      change: '+12.5%',
      changeType: 'positive',
      href: '/billing',
    },
    {
      name: 'MDI',
      value: data?.mdi ? `${data.mdi} kVA` : '85 kVA',
      icon: BoltIcon,
      change: 'Peak demand',
      changeType: 'neutral',
      href: '/usage',
    },
    {
      name: 'Power Factor',
      value: data?.powerFactor || '0.88',
      icon: ScaleIcon,
      change: 'Penalty applicable',
      changeType: 'negative',
      href: '/quality',
    },
    {
      name: 'Load Factor',
      value: data?.loadFactor ? `${data.loadFactor}%` : '72%',
      icon: ChartBarIcon,
      change: 'Efficiency',
      changeType: 'positive',
      href: '/analysis',
    },
  ];

  const actions = [
    { name: 'Pay Bill', href: '/billing', primary: true },
    { name: 'Power Quality', href: '/quality', primary: false },
    { name: 'Load Management', href: '/load', primary: false },
    { name: 'Export Data', href: '/export', primary: false },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">
          Welcome back, {data?.companyName || data?.name || 'Customer'}!
        </h1>
        <p className="text-gray-600">
          C2 Dashboard - Large Industrial/Commercial Consumer
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        {stats.map((stat) => (
          <StatCard key={stat.name} stat={stat} />
        ))}
      </div>

      {/* Advanced Analytics */}
      <div className="bg-white shadow rounded-lg mb-8">
        <div className="px-6 py-5 border-b border-gray-200">
          <h3 className="text-lg font-medium leading-6 text-gray-900">
            Real-time Monitoring
          </h3>
          <p className="text-sm text-gray-500">
            Usage, temperature correlation & cost analysis
          </p>
        </div>
        <div className="px-6 py-5">
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={advancedData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Legend />
                <Bar yAxisId="left" dataKey="usage" fill="#3B82F6" name="Usage (kW)" />
                <Line yAxisId="right" type="monotone" dataKey="temp" stroke="#EF4444" name="Temperature (°C)" />
                <Line yAxisId="left" type="monotone" dataKey="cost" stroke="#10B981" name="Cost (₹/hr)" />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Power Quality Alert */}
      {stats[2].changeType === 'negative' && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-8">
          <div className="flex items-start">
            <ExclamationCircleIcon className="h-6 w-6 text-red-600 mt-0.5" />
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Power Factor Low</h3>
              <p className="text-sm text-red-700 mt-1">
                Your power factor is below 0.90. This may result in penalty charges. Consider installing capacitor banks.
              </p>
              <button className="mt-3 text-sm text-red-600 hover:text-red-800 font-medium">
                View Recommendations →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <QuickActions actions={actions} />
    </div>
  );
     }
