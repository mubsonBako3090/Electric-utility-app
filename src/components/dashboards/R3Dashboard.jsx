'use client';

import { StatCard, QuickActions } from './BaseDashboard';
import {
  CurrencyRupeeIcon,
  BoltIcon,
  ChartBarIcon,
  ExclamationCircleIcon,
  SunIcon,
  HomeModernIcon,
} from '@heroicons/react/24/outline';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

export default function R3Dashboard({ data }) {
  const hourlyData = [
    { hour: '12 AM', usage: 0.8 },
    { hour: '4 AM', usage: 0.5 },
    { hour: '8 AM', usage: 2.1 },
    { hour: '12 PM', usage: 1.8 },
    { hour: '4 PM', usage: 2.5 },
    { hour: '8 PM', usage: 3.2 },
  ];

  const applianceData = [
    { name: 'AC', value: 45 },
    { name: 'Refrigerator', value: 25 },
    { name: 'Lighting', value: 15 },
    { name: 'Others', value: 15 },
  ];

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#6B7280'];

  const stats = [
    {
      name: 'Current Bill',
      value: data?.currentBill ? `₹${data.currentBill}` : '₹4,850',
      icon: CurrencyRupeeIcon,
      change: '+8.5%',
      changeType: 'positive',
      href: '/billing',
    },
    {
      name: 'Units Consumed',
      value: data?.unitsConsumed ? `${data.unitsConsumed} kWh` : '850 kWh',
      icon: BoltIcon,
      change: '+12%',
      changeType: 'positive',
      href: '/usage',
    },
    {
      name: 'Peak Demand',
      value: data?.peakDemand ? `${data.peakDemand} kW` : '5.2 kW',
      icon: ChartBarIcon,
      change: '8-9 PM',
      changeType: 'neutral',
      href: '/usage',
    },
    {
      name: 'Solar Generation',
      value: data?.solar || '120 kWh',
      icon: SunIcon,
      change: 'This month',
      changeType: 'positive',
      href: '/solar',
    },
  ];

  const actions = [
    { name: 'Pay Bill', href: '/billing', primary: true },
    { name: 'Solar Settings', href: '/solar', primary: false },
    { name: 'Load Analysis', href: '/analysis', primary: false },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">
          Welcome back, {data?.name || 'Customer'}!
        </h1>
        <p className="text-gray-600">
          R3 Dashboard - Large Residential Consumer
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        {stats.map((stat) => (
          <StatCard key={stat.name} stat={stat} />
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Hourly Usage */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-5 border-b border-gray-200">
            <h3 className="text-lg font-medium">Hourly Consumption</h3>
          </div>
          <div className="px-6 py-5">
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={hourlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="hour" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="usage" fill="#3B82F6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Appliance Breakdown */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-5 border-b border-gray-200">
            <h3 className="text-lg font-medium">Appliance Breakdown</h3>
          </div>
          <div className="px-6 py-5">
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={applianceData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {applianceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <QuickActions actions={actions} />
    </div>
  );
     }
