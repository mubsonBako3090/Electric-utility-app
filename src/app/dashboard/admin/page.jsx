'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import {
  UsersIcon,
  BoltIcon,
  CurrencyRupeeIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  XCircleIcon,
  ArrowPathIcon,
  ChartBarIcon,
  MapPinIcon,
} from '@heroicons/react/24/outline';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import toast from 'react-hot-toast';

export default function AdminDashboard() {
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalCustomers: 0,
    activeFeeders: 0,
    monthlyRevenue: 0,
    activeOutages: 0,
    pendingVerifications: 0,
    collectionEfficiency: 0,
  });
  const [recentActivities, setRecentActivities] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [outageData, setOutageData] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const res = await fetch('/api/admin/stats');
      const data = await res.json();
      if (res.ok) {
        setStats(data.stats);
        setRecentActivities(data.activities);
        setChartData(data.chartData);
        setOutageData(data.outageData);
      }
    } catch (error) {
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const statsCards = [
    {
      name: 'Total Customers',
      value: stats.totalCustomers.toLocaleString(),
      icon: UsersIcon,
      change: '+12%',
      changeType: 'positive',
      color: 'bg-blue-500',
      href: '/dashboard/admin/customers',
    },
    {
      name: 'Active Feeders',
      value: stats.activeFeeders,
      icon: BoltIcon,
      change: `${stats.activeFeeders}/45`,
      changeType: 'neutral',
      color: 'bg-green-500',
      href: '/feeders',
    },
    {
      name: 'Monthly Revenue',
      value: `₹${(stats.monthlyRevenue / 100000).toFixed(1)}L`,
      icon: CurrencyRupeeIcon,
      change: '+8.2%',
      changeType: 'positive',
      color: 'bg-purple-500',
      href: '/billing',
    },
    {
      name: 'Active Outages',
      value: stats.activeOutages,
      icon: ExclamationTriangleIcon,
      change: stats.activeOutages > 5 ? 'High' : 'Normal',
      changeType: stats.activeOutages > 5 ? 'negative' : 'positive',
      color: 'bg-red-500',
      href: '/outage',
    },
    {
      name: 'Pending Verifications',
      value: stats.pendingVerifications,
      icon: CheckCircleIcon,
      change: 'Requires attention',
      changeType: stats.pendingVerifications > 10 ? 'negative' : 'neutral',
      color: 'bg-yellow-500',
      href: '/verification/pending',
    },
    {
      name: 'Collection Efficiency',
      value: `${stats.collectionEfficiency}%`,
      icon: ChartBarIcon,
      change: 'This month',
      changeType: stats.collectionEfficiency > 90 ? 'positive' : 'neutral',
      color: 'bg-indigo-500',
      href: '/billing/analysis',
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="mt-2 text-gray-600">
            Welcome back, {user?.name}! Here's your system overview.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 mb-8">
          {statsCards.map((stat) => (
            <div
              key={stat.name}
              onClick={() => router.push(stat.href)}
              className="bg-white overflow-hidden shadow rounded-lg hover:shadow-lg transition-shadow cursor-pointer"
            >
              <div className="p-5">
                <div className="flex items-center">
                  <div className={`flex-shrink-0 rounded-md p-3 ${stat.color}`}>
                    <stat.icon className="h-6 w-6 text-white" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        {stat.name}
                      </dt>
                      <dd>
                        <div className="text-lg font-medium text-gray-900">
                          {stat.value}
                        </div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-5 py-3">
                <div className="text-sm">
                  <span
                    className={
                      stat.changeType === 'positive'
                        ? 'text-green-600'
                        : stat.changeType === 'negative'
                        ? 'text-red-600'
                        : 'text-gray-600'
                    }
                  >
                    {stat.change}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Revenue Chart */}
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Revenue Trend (Last 7 Days)
            </h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="revenue"
                    stroke="#3B82F6"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Outage Distribution */}
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Outage Distribution by Area
            </h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={outageData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {outageData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={['#3B82F6', '#10B981', '#F59E0B', '#EF4444'][index % 4]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Recent Activities & Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Activities */}
          <div className="lg:col-span-2 bg-white shadow rounded-lg">
            <div className="px-6 py-5 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">
                Recent Activities
              </h3>
            </div>
            <div className="divide-y divide-gray-200">
              {recentActivities.map((activity, index) => (
                <div key={index} className="px-6 py-4 hover:bg-gray-50">
                  <div className="flex items-center space-x-3">
                    {activity.type === 'outage' && (
                      <ExclamationTriangleIcon className="h-5 w-5 text-red-500" />
                    )}
                    {activity.type === 'payment' && (
                      <CurrencyRupeeIcon className="h-5 w-5 text-green-500" />
                    )}
                    {activity.type === 'verification' && (
                      <CheckCircleIcon className="h-5 w-5 text-blue-500" />
                    )}
                    {activity.type === 'feeder' && (
                      <BoltIcon className="h-5 w-5 text-yellow-500" />
                    )}
                    <div className="flex-1">
                      <p className="text-sm text-gray-900">{activity.message}</p>
                      <p className="text-xs text-gray-500">{activity.time}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-5 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Quick Actions</h3>
            </div>
            <div className="p-6 space-y-3">
              <button
                onClick={() => router.push('/verification/pending')}
                className="w-full flex items-center justify-between px-4 py-3 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors"
              >
                <span className="font-medium">Verify Customers</span>
                <span className="bg-blue-600 text-white px-2 py-1 rounded-full text-xs">
                  {stats.pendingVerifications} pending
                </span>
              </button>
              
              <button
                onClick={() => router.push('/feeders')}
                className="w-full flex items-center justify-between px-4 py-3 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors"
              >
                <span className="font-medium">Manage Feeders</span>
                <ArrowPathIcon className="h-5 w-5" />
              </button>
              
              <button
                onClick={() => router.push('/outage')}
                className="w-full flex items-center justify-between px-4 py-3 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors"
              >
                <span className="font-medium">View Outages</span>
                <span className="bg-red-600 text-white px-2 py-1 rounded-full text-xs">
                  {stats.activeOutages} active
                </span>
              </button>
              
              <button
                onClick={() => router.push('/billing/generate')}
                className="w-full flex items-center justify-between px-4 py-3 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors"
              >
                <span className="font-medium">Generate Bills</span>
                <CurrencyRupeeIcon className="h-5 w-5" />
              </button>
              
              <button
                onClick={() => router.push('/dashboard/admin/reports')}
                className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <span className="font-medium">Download Reports</span>
                <ChartBarIcon className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
    }
