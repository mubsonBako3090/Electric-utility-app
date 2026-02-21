'use client';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from 'recharts';

const PeakDemandChart = ({ data, type = 'bar', height = 300 }) => {
  const peakData = data || [
    { time: '00:00', demand: 45, threshold: 50 },
    { time: '04:00', demand: 38, threshold: 50 },
    { time: '08:00', demand: 72, threshold: 50 },
    { time: '12:00', demand: 85, threshold: 50 },
    { time: '16:00', demand: 92, threshold: 50 },
    { time: '20:00', demand: 78, threshold: 50 },
  ];

  const radarData = data || [
    { category: 'Residential', current: 85, optimal: 100 },
    { category: 'Commercial', current: 72, optimal: 100 },
    { category: 'Industrial', current: 68, optimal: 100 },
    { category: 'Agricultural', current: 45, optimal: 100 },
    { category: 'Others', current: 58, optimal: 100 },
  ];

  const renderChart = () => {
    if (type === 'radar') {
      return (
        <RadarChart outerRadius={90} width={730} height={250} data={radarData}>
          <PolarGrid />
          <PolarAngleAxis dataKey="category" />
          <PolarRadiusAxis angle={30} domain={[0, 100]} />
          <Radar name="Current" dataKey="current" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.6} />
          <Radar name="Optimal" dataKey="optimal" stroke="#10B981" fill="#10B981" fillOpacity={0.3} />
          <Legend />
          <Tooltip />
        </RadarChart>
      );
    }

    return (
      <BarChart data={peakData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="time" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="demand" fill="#3B82F6" name="Peak Demand (kW)" />
        <Bar dataKey="threshold" fill="#EF4444" name="Threshold (kW)" />
      </BarChart>
    );
  };

  return (
    <div className="w-full" style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        {renderChart()}
      </ResponsiveContainer>
    </div>
  );
};

export default PeakDemandChart;
