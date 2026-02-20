'use client';

import { StatCard, QuickActions } from './BaseDashboard';
import {
  CurrencyRupeeIcon,
  BoltIcon,
  ChartBarIcon,
  ExclamationCircleIcon,
  HomeModernIcon,
  DevicePhoneMobileIcon,
  SunIcon,
  FireIcon,
  SparklesIcon,
  ShieldCheckIcon,
  Battery100Icon,
  CpuChipIcon,
} from '@heroicons/react/24/outline';
import {
  ComposedChart,
  Line,
  Bar,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  ScatterChart,
  Scatter,
  ZAxis,
} from 'recharts';

export default function R5Dashboard({ data }) {
  // Advanced analytics data
  const realTimeData = [
    { time: '00:00', usage: 3.2, solar: 0, grid: 3.2, battery: 0 },
    { time: '02:00', usage: 2.8, solar: 0, grid: 1.8, battery: 1.0 },
    { time: '04:00', usage: 2.5, solar: 0, grid: 1.0, battery: 1.5 },
    { time: '06:00', usage: 4.5, solar: 0.5, grid: 2.5, battery: 1.5 },
    { time: '08:00', usage: 8.2, solar: 3.2, grid: 3.0, battery: 2.0 },
    { time: '10:00', usage: 7.5, solar: 5.5, grid: 1.0, battery: 1.0 },
    { time: '12:00', usage: 6.8, solar: 6.8, grid: 0, battery: 0 },
    { time: '14:00', usage: 7.2, solar: 7.2, grid: 0, battery: 0 },
    { time: '16:00', usage: 8.5, solar: 6.5, grid: 1.0, battery: 1.0 },
    { time: '18:00', usage: 10.2, solar: 2.2, grid: 5.0, battery: 3.0 },
    { time: '20:00', usage: 12.5, solar: 0, grid: 7.5, battery: 5.0 },
    { time: '22:00', usage: 8.8, solar: 0, grid: 4.8, battery: 4.0 },
  ];

  const monthlyTrend = [
    { month: 'Jan', usage: 1850, cost: 9250, solar: 420, temp: 18 },
    { month: 'Feb', usage: 1720, cost: 8600, solar: 480, temp: 20 },
    { month: 'Mar', usage: 1680, cost: 8400, solar: 580, temp: 24 },
    { month: 'Apr', usage: 1820, cost: 9100, solar: 620, temp: 28 },
    { month: 'May', usage: 2150, cost: 10750, solar: 680, temp: 32 },
    { month: 'Jun', usage: 2350, cost: 11750, solar: 650, temp: 34 },
    { month: 'Jul', usage: 2420, cost: 12100, solar: 580, temp: 33 },
    { month: 'Aug', usage: 2380, cost: 11900, solar: 550, temp: 32 },
    { month: 'Sep', usage: 2050, cost: 10250, solar: 520, temp: 30 },
    { month: 'Oct', usage: 1880, cost: 9400, solar: 480, temp: 26 },
    { month: 'Nov', usage: 1720, cost: 8600, solar: 420, temp: 22 },
    { month: 'Dec', usage: 1680, cost: 8400, solar: 380, temp: 19 },
  ];

  const deviceData = [
    { name: 'EV Charger', usage: 350, efficiency: 92, status: 'Active' },
    { name: 'HVAC (2 units)', usage: 850, efficiency: 88, status: 'Active' },
    { name: 'Pool Pump', usage: 180, efficiency: 78, status: 'Warning' },
    { name: 'Smart Home', usage: 95, efficiency: 95, status: 'Active' },
    { name: 'Water Heater', usage: 220, efficiency: 82, status: 'Active' },
    { name: 'Battery System', usage: -150, efficiency: 94, status: 'Charging' },
  ];

  const stats = [
    {
      name: 'Current Bill',
      value: data?.currentBill ? `₹${data.currentBill.toLocaleString()}` : '₹15,800',
      icon: CurrencyRupeeIcon,
      change: '+8.2%',
      changeType: 'positive',
      href: '/billing',
      subtext: 'Includes solar credit',
    },
    {
      name: 'Net Usage',
      value: data?.netUsage ? `${data.netUsage} kWh` : '1,850 kWh',
      icon: BoltIcon,
      change: '-12% vs last month',
      changeType: 'negative',
      href: '/usage',
      subtext: 'Solar generated: 580 kWh',
    },
    {
      name: 'Self-Sufficiency',
      value: data?.selfSufficiency || '68%',
      icon: SunIcon,
      change: '⬆️ 5%',
      changeType: 'positive',
      href: '/solar',
      subtext: 'Powered by solar',
    },
    {
      name: 'Battery Status',
      value: data?.batteryLevel || '78%',
      icon: Battery100Icon,
      change: '12.4 kWh stored',
      changeType: 'positive',
      href: '/battery',
      subtext: 'Backup: 8.5 hours',
    },
  ];

  const actions = [
    { name: 'Pay Bill', href: '/billing', primary: true },
    { name: 'Energy Dashboard', href: '/live', primary: false },
    { name: 'Smart Controls', href: '/smart', primary: false },
    { name: 'Export Data', href: '/export', primary: false },
    { name: 'AI Optimizer', href: '/ai', primary: false },
  ];

  // Calculate metrics
  const totalSolarGen = realTimeData.reduce((sum, item) => sum + item.solar, 0);
  const totalBatteryUsage = realTimeData.reduce((sum, item) => sum + item.battery, 0);
  const gridIndependence = ((totalSolarGen + totalBatteryUsage) / realTimeData.reduce((sum, item) => sum + item.usage, 0) * 100).toFixed(1);

  return (
    <div className="space-y-6">
      {/* Premium Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg shadow-lg p-6 text-white">
        <div className="flex justify-between items-center">
          <div>
            <div className="flex items-center gap-3">
              <SparklesIcon className="h-8 w-8" />
              <h1 className="text-2xl font-semibold">Premium Dashboard</h1>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-white text-blue-600">
                R5 Consumer
              </span>
            </div>
            <p className="text-blue-100 mt-2">
              Welcome back, {data?.name || 'Valued Customer'}! Your smart home is running efficiently.
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-blue-100">Smart Home Score</p>
            <p className="text-3xl font-bold">92<span className="text-lg">/100</span></p>
          </div>
        </div>
      </div>

      {/* Stats Grid with Premium Styling */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-white overflow-hidden shadow-lg rounded-lg hover:shadow-xl transition-shadow">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="bg-gradient-to-br from-blue-100 to-purple-100 rounded-md p-3">
                    <stat.icon className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">{stat.name}</dt>
                    <dd>
                      <div className="text-lg font-medium text-gray-900">{stat.value}</div>
                    </dd>
                    <dd className="text-xs text-gray-400 mt-1">{stat.subtext}</dd>
                  </dl>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-5 py-2">
              <div className="text-sm">
                <span className={stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'}>
                  {stat.change}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Real-time Energy Flow */}
      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-medium leading-6 text-gray-900">
                Real-time Energy Flow
              </h3>
              <p className="text-sm text-gray-500">
                Grid Independence: {gridIndependence}% • Live monitoring
              </p>
            </div>
            <div className="flex space-x-2">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                Solar Active
              </span>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                Battery: {stats[3].value}
              </span>
            </div>
          </div>
        </div>
        <div className="px-6 py-5">
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={realTimeData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Area type="monotone" dataKey="usage" fill="#FEE2E2" stroke="#EF4444" name="Total Usage" />
                <Bar dataKey="solar" stackId="a" fill="#F59E0B" name="Solar" />
                <Bar dataKey="battery" stackId="a" fill="#10B981" name="Battery" />
                <Bar dataKey="grid" stackId="a" fill="#3B82F6" name="Grid" />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Device Intelligence */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Device Monitoring */}
        <div className="bg-white shadow-lg rounded-lg">
          <div className="px-6 py-5 border-b border-gray-200">
            <h3 className="text-lg font-medium leading-6 text-gray-900">
              Smart Device Intelligence
            </h3>
            <p className="text-sm text-gray-500">
              AI-powered monitoring & optimization
            </p>
          </div>
          <div className="px-6 py-5">
            <div className="space-y-4">
              {deviceData.map((device) => (
                <div key={device.name} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <CpuChipIcon className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">{device.name}</p>
                      <p className="text-xs text-gray-500">Efficiency: {device.efficiency}%</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">
                      {device.usage > 0 ? `${device.usage} kWh` : `${Math.abs(device.usage)} kWh charging`}
                    </p>
                    <p className={`text-xs ${
                      device.status === 'Active' ? 'text-green-600' : 
                      device.status === 'Warning' ? 'text-yellow-600' : 'text-blue-600'
                    }`}>
                      {device.status}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Yearly Trend & Forecast */}
        <div className="bg-white shadow-lg rounded-lg">
          <div className="px-6 py-5 border-b border-gray-200">
            <h3 className="text-lg font-medium leading-6 text-gray-900">
              Yearly Analysis & Forecast
            </h3>
            <p className="text-sm text-gray-500">
              AI predicts 5% lower consumption next month
            </p>
          </div>
          <div className="px-6 py-5">
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={monthlyTrend}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Legend />
                  <Bar yAxisId="left" dataKey="usage" fill="#3B82F6" name="Usage (kWh)" />
                  <Line yAxisId="right" type="monotone" dataKey="temp" stroke="#EF4444" name="Temp (°C)" />
                  <Line yAxisId="left" type="monotone" dataKey="solar" stroke="#F59E0B" name="Solar (kWh)" />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
            
            {/* AI Insights */}
            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="bg-purple-50 rounded-lg p-3">
                <p className="text-xs text-purple-600">Best Time to Use</p>
                <p className="text-sm font-medium text-purple-900">12 PM - 3 PM</p>
                <p className="text-xs text-purple-500">Peak solar generation</p>
              </div>
              <div className="bg-green-50 rounded-lg p-3">
                <p className="text-xs text-green-600">Monthly Savings</p>
                <p className="text-sm font-medium text-green-900">₹2,450</p>
                <p className="text-xs text-green-500">From solar + battery</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Premium Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-4 text-white">
          <ShieldCheckIcon className="h-6 w-6 mb-2" />
          <h4 className="text-sm font-medium">Power Quality</h4>
          <p className="text-xs opacity-90 mt-1">Voltage: 231V • 50Hz</p>
          <p className="text-xs opacity-75">THD: 2.3% (Excellent)</p>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg p-4 text-white">
          <Battery100Icon className="h-6 w-6 mb-2" />
          <h4 className="text-sm font-medium">Backup Status</h4>
          <p className="text-xs opacity-90 mt-1">8.5 hours remaining</p>
          <p className="text-xs opacity-75">Last charged: 2 hrs ago</p>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg p-4 text-white">
          <SparklesIcon className="h-6 w-6 mb-2" />
          <h4 className="text-sm font-medium">Carbon Saved</h4>
          <p className="text-xs opacity-90 mt-1">2.4 tons CO₂</p>
          <p className="text-xs opacity-75">Equivalent to 120 trees</p>
        </div>

        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg p-4 text-white">
          <HomeModernIcon className="h-6 w-6 mb-2" />
          <h4 className="text-sm font-medium">Smart Home</h4>
          <p className="text-xs opacity-90 mt-1">14 connected devices</p>
          <p className="text-xs opacity-75">2 offline • 12 online</p>
        </div>
      </div>

      {/* Quick Actions */}
      <QuickActions actions={actions} />
    </div>
  );
     }
