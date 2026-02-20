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
} from '@heroicons/react/24/outline';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Legend,
} from 'recharts';

export default function R4Dashboard({ data }) {
  // Sample data - replace with real API data
  const hourlyData = [
    { time: '00:00', usage: 2.5, cost: 12.5 },
    { time: '02:00', usage: 1.8, cost: 9.0 },
    { time: '04:00', usage: 1.5, cost: 7.5 },
    { time: '06:00', usage: 3.2, cost: 16.0 },
    { time: '08:00', usage: 5.8, cost: 29.0 },
    { time: '10:00', usage: 4.5, cost: 22.5 },
    { time: '12:00', usage: 4.2, cost: 21.0 },
    { time: '14:00', usage: 5.0, cost: 25.0 },
    { time: '16:00', usage: 6.5, cost: 32.5 },
    { time: '18:00', usage: 8.2, cost: 41.0 },
    { time: '20:00', usage: 9.5, cost: 47.5 },
    { time: '22:00', usage: 6.8, cost: 34.0 },
  ];

  const weeklyData = [
    { day: 'Mon', usage: 58.5, cost: 292.5, peak: 7.2 },
    { day: 'Tue', usage: 62.8, cost: 314.0, peak: 8.1 },
    { day: 'Wed', usage: 59.2, cost: 296.0, peak: 7.8 },
    { day: 'Thu', usage: 65.5, cost: 327.5, peak: 8.5 },
    { day: 'Fri', usage: 72.8, cost: 364.0, peak: 9.2 },
    { day: 'Sat', usage: 85.5, cost: 427.5, peak: 10.5 },
    { day: 'Sun', usage: 78.2, cost: 391.0, peak: 9.8 },
  ];

  const applianceData = [
    { name: 'HVAC', value: 42, cost: 1250, trend: '+5%' },
    { name: 'Water Heater', value: 18, cost: 540, trend: '+2%' },
    { name: 'Refrigerator', value: 12, cost: 360, trend: '0%' },
    { name: 'Lighting', value: 10, cost: 300, trend: '-3%' },
    { name: 'Entertainment', value: 8, cost: 240, trend: '+8%' },
    { name: 'Kitchen', value: 7, cost: 210, trend: '+1%' },
    { name: 'Others', value: 3, cost: 90, trend: '0%' },
  ];

  const comparisonData = [
    { subject: 'Efficiency', A: 85, B: 78, fullMark: 100 },
    { subject: 'Cost', A: 72, B: 82, fullMark: 100 },
    { subject: 'Peak Usage', A: 68, B: 75, fullMark: 100 },
    { subject: 'Off-peak', A: 82, B: 70, fullMark: 100 },
    { subject: 'Stability', A: 90, B: 85, fullMark: 100 },
  ];

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#6B7280'];

  const stats = [
    {
      name: 'Current Bill',
      value: data?.currentBill ? `₹${data.currentBill.toLocaleString()}` : '₹8,450',
      icon: CurrencyRupeeIcon,
      change: '+12.5%',
      changeType: 'positive',
      href: '/billing',
      subtext: 'Due in 5 days',
    },
    {
      name: 'Monthly Usage',
      value: data?.monthlyUsage ? `${data.monthlyUsage} kWh` : '1,250 kWh',
      icon: BoltIcon,
      change: '+8.2%',
      changeType: 'positive',
      href: '/usage',
      subtext: 'vs last month',
    },
    {
      name: 'Peak Demand',
      value: data?.peakDemand ? `${data.peakDemand} kW` : '8.5 kW',
      icon: ChartBarIcon,
      change: 'Today 7-8 PM',
      changeType: 'neutral',
      href: '/usage',
      subtext: 'Sanctioned: 10 kW',
    },
    {
      name: 'HVAC Usage',
      value: data?.hvacUsage || '42%',
      icon: FireIcon,
      change: '⬆️ 5%',
      changeType: 'positive',
      href: '/analysis',
      subtext: 'of total consumption',
    },
  ];

  const actions = [
    { name: 'Pay Bill', href: '/billing', primary: true },
    { name: 'HVAC Optimizer', href: '/hvac', primary: false },
    { name: 'Load Analysis', href: '/analysis', primary: false },
    { name: 'Solar Quote', href: '/solar', primary: false },
  ];

  // Calculate totals
  const totalWeeklyUsage = weeklyData.reduce((sum, day) => sum + day.usage, 0);
  const avgDailyUsage = (totalWeeklyUsage / 7).toFixed(1);
  const peakUsageToday = Math.max(...hourlyData.map(h => h.usage));

  return (
    <div className="space-y-6">
      {/* Header with Category Badge */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-semibold text-gray-900">
              Welcome back, {data?.name || 'Customer'}!
            </h1>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
              R4 Consumer
            </span>
          </div>
          <p className="text-gray-600 mt-1">
            Large Residential / Small Commercial • Sanctioned Load: 10 kW
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500">Current Status</p>
          <p className="text-lg font-medium text-green-600">⚡ Active</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <StatCard key={stat.name} stat={stat} />
        ))}
      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Hourly Usage Chart */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-5 border-b border-gray-200">
            <h3 className="text-lg font-medium leading-6 text-gray-900">
              Today's Consumption
            </h3>
            <p className="text-sm text-gray-500">
              Peak: {peakUsageToday.toFixed(1)} kW at {hourlyData.find(h => h.usage === peakUsageToday)?.time}
            </p>
          </div>
          <div className="px-6 py-5">
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={hourlyData}>
                  <defs>
                    <linearGradient id="colorUsage" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis />
                  <Tooltip />
                  <Area type="monotone" dataKey="usage" stroke="#3B82F6" fillOpacity={1} fill="url(#colorUsage)" name="Usage (kW)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Weekly Comparison */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-5 border-b border-gray-200">
            <h3 className="text-lg font-medium leading-6 text-gray-900">
              Weekly Usage Pattern
            </h3>
            <p className="text-sm text-gray-500">
              Total this week: {totalWeeklyUsage.toFixed(1)} kWh
            </p>
          </div>
          <div className="px-6 py-5">
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={weeklyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Area type="monotone" dataKey="usage" stroke="#10B981" fill="#D1FAE5" name="Usage (kWh)" />
                  <Area type="monotone" dataKey="peak" stroke="#F59E0B" fill="#FEF3C7" name="Peak (kW)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* Second Row - Appliance Breakdown & Efficiency Radar */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Appliance Breakdown */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-5 border-b border-gray-200">
            <h3 className="text-lg font-medium leading-6 text-gray-900">
              Appliance-wise Consumption
            </h3>
            <p className="text-sm text-gray-500">
              HVAC is your largest consumer
            </p>
          </div>
          <div className="px-6 py-5">
            <div className="grid grid-cols-2 gap-4">
              {/* Pie Chart */}
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={applianceData}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={70}
                      fill="#8884d8"
                      paddingAngle={2}
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
              
              {/* List */}
              <div className="space-y-2">
                {applianceData.slice(0, 5).map((item, index) => (
                  <div key={item.name} className="flex justify-between items-center">
                    <div className="flex items-center">
                      <div className="w-2 h-2 rounded-full mr-2" style={{ backgroundColor: COLORS[index] }}></div>
                      <span className="text-sm text-gray-600">{item.name}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-medium">{item.value}%</span>
                      <span className="text-xs text-gray-400 ml-2">{item.trend}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Cost Summary */}
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Estimated cost this month:</span>
                <span className="font-medium">₹{applianceData.reduce((sum, item) => sum + item.cost, 0)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Efficiency Radar */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-5 border-b border-gray-200">
            <h3 className="text-lg font-medium leading-6 text-gray-900">
              Efficiency Scorecard
            </h3>
            <p className="text-sm text-gray-500">
              You vs. Similar Homes
            </p>
          </div>
          <div className="px-6 py-5">
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={comparisonData}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="subject" />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} />
                  <Radar name="You" dataKey="A" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.6} />
                  <Radar name="Average" dataKey="B" stroke="#9CA3AF" fill="#9CA3AF" fillOpacity={0.3} />
                  <Legend />
                  <Tooltip />
                </RadarChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 text-center">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                Overall Score: 79/100 • Better than 65% of similar homes
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Recommendations */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start">
            <SunIcon className="h-5 w-5 text-blue-600 mt-0.5" />
            <div className="ml-3">
              <h4 className="text-sm font-medium text-blue-800">Solar Potential</h4>
              <p className="text-xs text-blue-700 mt-1">
                Your roof could save ₹45,000/year with solar
              </p>
              <button className="mt-2 text-xs text-blue-600 hover:text-blue-800 font-medium">
                Check eligibility →
              </button>
            </div>
          </div>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-start">
            <DevicePhoneMobileIcon className="h-5 w-5 text-green-600 mt-0.5" />
            <div className="ml-3">
              <h4 className="text-sm font-medium text-green-800">Smart Thermostat</h4>
              <p className="text-xs text-green-700 mt-1">
                Install to save 15% on HVAC costs
              </p>
              <button className="mt-2 text-xs text-green-600 hover:text-green-800 font-medium">
                Shop now →
              </button>
            </div>
          </div>
        </div>

        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
          <div className="flex items-start">
            <FireIcon className="h-5 w-5 text-purple-600 mt-0.5" />
            <div className="ml-3">
              <h4 className="text-sm font-medium text-purple-800">Time-of-Use Rate</h4>
              <p className="text-xs text-purple-700 mt-1">
                Shift usage to save ₹1,200/month
              </p>
              <button className="mt-2 text-xs text-purple-600 hover:text-purple-800 font-medium">
                Learn more →
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <QuickActions actions={actions} />
    </div>
  );
     }
