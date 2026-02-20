'use client';

import { useState, useEffect } from 'react';
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
import { CalendarIcon, ArrowDownTrayIcon } from '@heroicons/react/24/outline';

export default function UsagePage({ params }) {
  const [timeRange, setTimeRange] = useState('week');
  const [usageData, setUsageData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsageData();
  }, [timeRange]);

  const fetchUsageData = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/energy/usage?range=${timeRange}`);
      const data = await res.json();
      if (res.ok) {
        setUsageData(data);
      }
    } catch (error) {
      console.error('Error fetching usage data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Sample data - replace with API data
  const hourlyData = [
    { hour: '00:00', usage: 0.8, cost: 4.0 },
    { hour: '02:00', usage: 0.5, cost: 2.5 },
    { hour: '04:00', usage: 0.4, cost: 2.0 },
    { hour: '06:00', usage: 1.2, cost: 6.0 },
    { hour: '08:00', usage: 2.8, cost: 14.0 },
    { hour: '10:00', usage: 3.2, cost: 16.0 },
    { hour: '12:00', usage: 3.5, cost: 17.5 },
    { hour: '14:00', usage: 3.0, cost: 15.0 },
    { hour: '16:00', usage: 3.8, cost: 19.0 },
    { hour: '18:00', usage: 4.2, cost: 21.0 },
    { hour: '20:00', usage: 4.5, cost: 22.5 },
    { hour: '22:00', usage: 2.5, cost: 12.5 },
  ];

  const weeklyData = [
    { day: 'Mon', usage: 28.5, cost: 142.5 },
    { day: 'Tue', usage: 32.2, cost: 161.0 },
    { day: 'Wed', usage: 30.8, cost: 154.0 },
    { day: 'Thu', usage: 35.5, cost: 177.5 },
    { day: 'Fri', usage: 38.2, cost: 191.0 },
    { day: 'Sat', usage: 42.5, cost: 212.5 },
    { day: 'Sun', usage: 45.8, cost: 229.0 },
  ];

  const monthlyData = [
    { week: 'Week 1', usage: 245, cost: 1225 },
    { week: 'Week 2', usage: 268, cost: 1340 },
    { week: 'Week 3', usage: 282, cost: 1410 },
    { week: 'Week 4', usage: 295, cost: 1475 },
  ];

  const applianceData = [
    { name: 'Air Conditioner', value: 35, cost: 525 },
    { name: 'Refrigerator', value: 20, cost: 300 },
    { name: 'Water Heater', value: 15, cost: 225 },
    { name: 'Lighting', value: 12, cost: 180 },
    { name: 'Others', value: 18, cost: 270 },
  ];

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

  const getChartData = () => {
    switch (timeRange) {
      case 'day':
        return hourlyData;
      case 'week':
        return weeklyData;
      case 'month':
        return monthlyData;
      default:
        return weeklyData;
    }
  };

  const totalUsage = getChartData().reduce((sum, item) => sum + item.usage, 0);
  const totalCost = getChartData().reduce((sum, item) => sum + item.cost, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Energy Usage Analytics</h1>
          <p className="text-gray-600">Track your consumption patterns and costs</p>
        </div>
        <div className="flex items-center space-x-4">
          {/* Time Range Selector */}
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="block w-40 pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
          >
            <option value="day">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="year">This Year</option>
          </select>
          
          {/* Export Button */}
          <button className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
            <ArrowDownTrayIcon className="h-4 w-4 mr-2" />
            Export
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="bg-blue-100 rounded-md p-3">
                  <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Consumption</dt>
                  <dd>
                    <div className="text-lg font-medium text-gray-900">{totalUsage.toFixed(1)} kWh</div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="bg-green-100 rounded-md p-3">
                  <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Cost</dt>
                  <dd>
                    <div className="text-lg font-medium text-gray-900">₹{totalCost.toFixed(2)}</div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="bg-purple-100 rounded-md p-3">
                  <svg className="h-6 w-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Avg Daily</dt>
                  <dd>
                    <div className="text-lg font-medium text-gray-900">
                      {(totalUsage / (timeRange === 'week' ? 7 : timeRange === 'month' ? 30 : 1)).toFixed(1)} kWh
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="bg-yellow-100 rounded-md p-3">
                  <svg className="h-6 w-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Peak Usage</dt>
                  <dd>
                    <div className="text-lg font-medium text-gray-900">
                      {Math.max(...getChartData().map(d => d.usage)).toFixed(1)} kWh
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Chart */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-5 border-b border-gray-200">
          <h3 className="text-lg font-medium leading-6 text-gray-900">
            Consumption Pattern
          </h3>
        </div>
        <div className="px-6 py-5">
          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={getChartData()}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey={timeRange === 'day' ? 'hour' : timeRange === 'week' ? 'day' : 'week'} />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Legend />
                <Line yAxisId="left" type="monotone" dataKey="usage" stroke="#3B82F6" name="Usage (kWh)" strokeWidth={2} />
                <Line yAxisId="right" type="monotone" dataKey="cost" stroke="#10B981" name="Cost (₹)" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Appliance Breakdown */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-5 border-b border-gray-200">
          <h3 className="text-lg font-medium leading-6 text-gray-900">
            Appliance-wise Breakdown
          </h3>
        </div>
        <div className="px-6 py-5">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Pie Chart */}
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={applianceData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={100}
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

            {/* Table */}
            <div className="flex flex-col">
              <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
                  <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Appliance
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Usage (%)
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Cost
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {applianceData.map((item) => (
                          <tr key={item.name}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {item.name}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {item.value}%
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              ₹{item.cost}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Insights */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h4 className="text-sm font-medium text-blue-800 mb-2">💡 Energy Saving Insights</h4>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• Peak usage between 6 PM - 9 PM. Consider shifting some usage to off-peak hours.</li>
          <li>• Your AC consumes 35% of total energy. Set temperature to 24°C for optimal efficiency.</li>
          <li>• Compared to last week, your consumption increased by 8%. Check for any new appliances.</li>
        </ul>
      </div>
    </div>
  );
        }
