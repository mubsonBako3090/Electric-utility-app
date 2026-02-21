'use client';

import {
  ComposedChart,
  Line,
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

const BillingChart = ({ data, type = 'revenue', height = 300 }) => {
  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];

  const revenueData = data || [
    { month: 'Jan', revenue: 45000, bills: 320 },
    { month: 'Feb', revenue: 52000, bills: 345 },
    { month: 'Mar', revenue: 48000, bills: 338 },
    { month: 'Apr', revenue: 61000, bills: 352 },
    { month: 'May', revenue: 58000, bills: 348 },
    { month: 'Jun', revenue: 63000, bills: 365 },
  ];

  const collectionData = data || [
    { name: 'Paid', value: 75 },
    { name: 'Pending', value: 15 },
    { name: 'Overdue', value: 10 },
  ];

  const renderChart = () => {
    switch (type) {
      case 'collection':
        return (
          <PieChart>
            <Pie
              data={collectionData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {collectionData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        );
      case 'comparison':
        return (
          <ComposedChart data={revenueData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis yAxisId="left" />
            <YAxis yAxisId="right" orientation="right" />
            <Tooltip />
            <Legend />
            <Bar yAxisId="left" dataKey="revenue" fill="#3B82F6" name="Revenue (₹)" />
            <Line yAxisId="right" type="monotone" dataKey="bills" stroke="#10B981" name="Bills Count" strokeWidth={2} />
          </ComposedChart>
        );
      default:
        return (
          <ComposedChart data={revenueData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="revenue" fill="#3B82F6" name="Revenue (₹)" />
          </ComposedChart>
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

export default BillingChart;
