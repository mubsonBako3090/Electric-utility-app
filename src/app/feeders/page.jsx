'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import {
  BoltIcon,
  MapPinIcon,
  WrenchScrewdriverIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  ArrowPathIcon,
  ChartBarIcon,
} from '@heroicons/react/24/outline';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import toast from 'react-hot-toast';

export default function FeedersPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [feeders, setFeeders] = useState([]);
  const [selectedFeeder, setSelectedFeeder] = useState(null);
  const [stats, setStats] = useState({
    totalFeeders: 0,
    activeFeeders: 0,
    totalLoad: 0,
    avgVoltage: 0,
  });

  useEffect(() => {
    fetchFeeders();
  }, []);

  const fetchFeeders = async () => {
    try {
      const res = await fetch('/api/feeders');
      const data = await res.json();
      if (res.ok) {
        setFeeders(data.feeders);
        setStats(data.stats);
        if (data.feeders.length > 0) {
          setSelectedFeeder(data.feeders[0]);
        }
      }
    } catch (error) {
      toast.error('Failed to load feeders');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      active: 'bg-green-100 text-green-800',
      maintenance: 'bg-yellow-100 text-yellow-800',
      faulty: 'bg-red-100 text-red-800',
      offline: 'bg-gray-100 text-gray-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active':
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
      case 'maintenance':
        return <WrenchScrewdriverIcon className="h-5 w-5 text-yellow-500" />;
      case 'faulty':
        return <ExclamationCircleIcon className="h-5 w-5 text-red-500" />;
      default:
        return <BoltIcon className="h-5 w-5 text-gray-500" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Feeders Management</h1>
          <p className="mt-2 text-gray-600">
            Monitor and manage power distribution feeders
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-blue-500 rounded-md p-3">
                  <BoltIcon className="h-6 w-6 text-white" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Total Feeders</dt>
                    <dd className="text-lg font-medium text-gray-900">{stats.totalFeeders}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-green-500 rounded-md p-3">
                  <CheckCircleIcon className="h-6 w-6 text-white" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Active Feeders</dt>
                    <dd className="text-lg font-medium text-gray-900">{stats.activeFeeders}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-purple-500 rounded-md p-3">
                  <ChartBarIcon className="h-6 w-6 text-white" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Total Load</dt>
                    <dd className="text-lg font-medium text-gray-900">{stats.totalLoad} MW</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-yellow-500 rounded-md p-3">
                  <BoltIcon className="h-6 w-6 text-white" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Avg Voltage</dt>
                    <dd className="text-lg font-medium text-gray-900">{stats.avgVoltage} kV</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Feeders List */}
          <div className="lg:col-span-1 bg-white shadow rounded-lg overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">All Feeders</h2>
            </div>
            <div className="divide-y divide-gray-200 max-h-96 overflow-y-auto">
              {feeders.map((feeder) => (
                <div
                  key={feeder._id}
                  onClick={() => setSelectedFeeder(feeder)}
                  className={`px-6 py-4 hover:bg-gray-50 cursor-pointer transition-colors ${
                    selectedFeeder?._id === feeder._id ? 'bg-blue-50' : ''
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    {getStatusIcon(feeder.status)}
                    <div className="flex-1">
                      <h3 className="text-sm font-medium text-gray-900">{feeder.name}</h3>
                      <p className="text-xs text-gray-500">
                        Load: {feeder.currentLoad} / {feeder.capacity} MW
                      </p>
                    </div>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(feeder.status)}`}>
                      {feeder.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Feeder Details */}
          <div className="lg:col-span-2 space-y-6">
            {selectedFeeder ? (
              <>
                {/* Feeder Info */}
                <div className="bg-white shadow rounded-lg p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h2 className="text-xl font-bold text-gray-900">{selectedFeeder.name}</h2>
                      <p className="text-sm text-gray-500">ID: {selectedFeeder.feederId}</p>
                    </div>
                    <span className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(selectedFeeder.status)}`}>
                      {selectedFeeder.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="bg-gray-50 p-3 rounded">
                      <p className="text-xs text-gray-500">Capacity</p>
                      <p className="text-lg font-semibold">{selectedFeeder.capacity} MW</p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded">
                      <p className="text-xs text-gray-500">Current Load</p>
                      <p className="text-lg font-semibold">{selectedFeeder.currentLoad} MW</p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded">
                      <p className="text-xs text-gray-500">Voltage</p>
                      <p className="text-lg font-semibold">{selectedFeeder.voltage} kV</p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded">
                      <p className="text-xs text-gray-500">Load Factor</p>
                      <p className="text-lg font-semibold">
                        {((selectedFeeder.currentLoad / selectedFeeder.capacity) * 100).toFixed(1)}%
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-2">
                    <MapPinIcon className="h-5 w-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-900">
                        {selectedFeeder.location?.substation}, {selectedFeeder.location?.area}
                      </p>
                      {selectedFeeder.assignedOfficer && (
                        <p className="text-xs text-gray-500">
                          Assigned Officer: {selectedFeeder.assignedOfficer.name}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Load Chart */}
                <div className="bg-white shadow rounded-lg p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    Load Profile (Last 24 Hours)
                  </h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={selectedFeeder.loadHistory || [
                        { time: '00:00', load: 65 },
                        { time: '04:00', load: 45 },
                        { time: '08:00', load: 78 },
                        { time: '12:00', load: 82 },
                        { time: '16:00', load: 88 },
                        { time: '20:00', load: 72 },
                      ]}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="time" />
                        <YAxis />
                        <Tooltip />
                        <Line type="monotone" dataKey="load" stroke="#3B82F6" strokeWidth={2} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Actions */}
                <div className="bg-white shadow rounded-lg p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    Quick Actions
                  </h3>
                  <div className="flex space-x-3">
                    <button className="px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700">
                      Schedule Maintenance
                    </button>
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                      View Reports
                    </button>
                    <button className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">
                      Update Status
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="bg-white shadow rounded-lg p-12 text-center">
                <BoltIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No Feeder Selected
                </h3>
                <p className="text-gray-500">
                  Select a feeder from the list to view details
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
      }
