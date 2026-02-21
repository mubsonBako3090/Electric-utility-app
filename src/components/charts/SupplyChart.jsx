'use client';

import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const SupplyChart = ({ data, type = 'line', height = 300 }) => {
  const defaultData = [
    { time: '00:00', supply: 85, demand: 82 },
    { time: '04:00', supply: 72, demand: 68 },
    { time: '08:00', supply: 94, demand: 96 },
    { time: '12:00', supply: 98, demand: 102 },
    { time: '16:00', supply: 96, demand: 104 },
    { time: '20:00', supply: 88, demand: 92 },
  ];

  const chartData = data || defaultData;

  const renderChart = () => {
    switch (type) {
      case 'area':
        return (
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="supplyGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="demandGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#EF4444" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#EF4444" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Area type="monotone" dataKey="supply" stroke="#3B82F6" fill="url(#supplyGradient)" name="Supply (MW)" />
            <Area type="monotone" dataKey="demand" stroke="#EF4444" fill="url(#demandGradient)" name="Demand (MW)" />
          </AreaChart>
        );
      case 'bar':
        return (
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="supply" fill="#3B82F6" name="Supply (MW)" />
            <Bar dataKey="demand" fill="#EF4444" name="Demand (MW)" />
          </BarChart>
        );
      default:
        return (
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="supply" stroke="#3B82F6" strokeWidth={2} name="Supply (MW)" />
            <Line type="monotone" dataKey="demand" stroke="#EF4444" strokeWidth={2} name="Demand (MW)" />
          </LineChart>
        );
    }
  };

  return (
    <div className="w-full" style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        {renderChart()}
      </ResponsiveContainer>
    </div>
  );
};

export default SupplyChart;
