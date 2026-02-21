'use client';

import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const UsageChart = ({ data, period = 'daily', comparison = false, height = 300 }) => {
  const dailyData = data || [
    { hour: '00', usage: 1.2, cost: 6 },
    { hour: '02', usage: 0.8, cost: 4 },
    { hour: '04', usage: 0.6, cost: 3 },
    { hour: '06', usage: 1.5, cost: 7.5 },
    { hour: '08', usage: 3.2, cost: 16 },
    { hour: '10', usage: 4.5, cost: 22.5 },
    { hour: '12', usage: 4.8, cost: 24 },
    { hour: '14', usage: 5.2, cost: 26 },
    { hour: '16', usage: 6.5, cost: 32.5 },
    { hour: '18', usage: 7.8, cost: 39 },
    { hour: '20', usage: 8.2, cost: 41 },
    { hour: '22', usage: 4.5, cost: 22.5 },
  ];

  const weeklyData = data || [
    { day: 'Mon', usage: 28.5, cost: 142.5, previous: 26.2 },
    { day: 'Tue', usage: 32.2, cost: 161, previous: 30.5 },
    { day: 'Wed', usage: 30.8, cost: 154, previous: 29.8 },
    { day: 'Thu', usage: 35.5, cost: 177.5, previous: 32.5 },
    { day: 'Fri', usage: 38.2, cost: 191, previous: 35.8 },
    { day: 'Sat', usage: 42.5, cost: 212.5, previous: 40.2 },
    { day: 'Sun', usage: 45.8, cost: 229, previous: 42.5 },
  ];

  const monthlyData = data || [
    { week: 'W1', usage: 245, cost: 1225, previous: 235 },
    { week: 'W2', usage: 268, cost: 1340, previous: 258 },
    { week: 'W3', usage: 282, cost: 1410, previous: 272 },
    { week: 'W4', usage: 295, cost: 1475, previous: 285 },
  ];

  const getChartData = () => {
    switch (period) {
      case 'daily':
        return dailyData;
      case 'weekly':
        return weeklyData;
      case 'monthly':
        return monthlyData;
      default:
        return dailyData;
    }
  };

  const getXAxisKey = () => {
    switch (period) {
      case 'daily':
        return 'hour';
      case 'weekly':
        return 'day';
      case 'monthly':
        return 'week';
      default:
        return 'hour';
    }
  };

  const chartData = getChartData();
  const xAxisKey = getXAxisKey();

  return (
    <div className="w-full" style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData}>
          <defs>
            <linearGradient id="usageGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="costGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10B981" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey={xAxisKey} />
          <YAxis yAxisId="left" />
          <YAxis yAxisId="right" orientation="right" />
          <Tooltip />
          <Legend />
          <Area
            yAxisId="left"
            type="monotone"
            dataKey="usage"
            stroke="#3B82F6"
            fill="url(#usageGradient)"
            name="Usage (kWh)"
          />
          <Area
            yAxisId="right"
            type="monotone"
            dataKey="cost"
            stroke="#10B981"
            fill="url(#costGradient)"
            name="Cost (₹)"
          />
          {comparison && (
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="previous"
              stroke="#F59E0B"
              strokeDasharray="5 5"
              name="Previous Period"
            />
          )}
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default UsageChart;
