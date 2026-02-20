'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import {
  MapPinIcon,
  ClipboardDocumentCheckIcon,
  BoltIcon,
  ExclamationTriangleIcon,
  UserGroupIcon,
  CheckCircleIcon,
  CameraIcon,
  DocumentTextIcon,
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

export default function FieldOfficerDashboard() {
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [tasks, setTasks] = useState({
    pendingReadings: 0,
    assignedOutages: 0,
    verifications: 0,
    completedToday: 0,
  });
  const [myTasks, setMyTasks] = useState([]);
  const [currentLocation, setCurrentLocation] = useState(null);

  useEffect(() => {
    fetchDashboardData();
    getCurrentLocation();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const res = await fetch('/api/field-officer/tasks');
      const data = await res.json();
      if (res.ok) {
        setTasks(data.tasks);
        setMyTasks(data.myTasks);
      }
    } catch (error) {
      toast.error('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.error('Error getting location:', error);
        }
      );
    }
  };

  const statsCards = [
    {
      name: 'Meter Readings',
      value: tasks.pendingReadings,
      icon: ClipboardDocumentCheckIcon,
      color: 'bg-blue-500',
      href: '/dashboard/field-officer/readings',
    },
    {
      name: 'Assigned Outages',
      value: tasks.assignedOutages,
      icon: ExclamationTriangleIcon,
      color: 'bg-red-500',
      href: '/outage',
    },
    {
      name: 'Verifications',
      value: tasks.verifications,
      icon: CheckCircleIcon,
      color: 'bg-green-500',
      href: '/verification/pending',
    },
    {
      name: 'Completed Today',
      value: tasks.completedToday,
      icon: DocumentTextIcon,
      color: 'bg-purple-500',
      href: '/dashboard/field-officer/history',
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
        {/* Header with Location */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Field Officer Dashboard</h1>
              <p className="mt-2 text-gray-600">
                Welcome back, {user?.name}!
              </p>
            </div>
            {currentLocation && (
              <div className="bg-white px-4 py-2 rounded-lg shadow flex items-center">
                <MapPinIcon className="h-5 w-5 text-green-500 mr-2" />
                <span className="text-sm text-gray-600">
                  Location tracking active
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
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
                        <div className="text-2xl font-medium text-gray-900">
                          {stat.value}
                        </div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Today's Tasks */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Task List */}
          <div className="lg:col-span-2 bg-white shadow rounded-lg">
            <div className="px-6 py-5 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">
                Today's Assigned Tasks
              </h3>
            </div>
            <div className="divide-y divide-gray-200">
              {myTasks.length > 0 ? (
                myTasks.map((task) => (
                  <div key={task.id} className="px-6 py-4 hover:bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        {task.type === 'reading' && (
                          <ClipboardDocumentCheckIcon className="h-5 w-5 text-blue-500" />
                        )}
                        {task.type === 'outage' && (
                          <ExclamationTriangleIcon className="h-5 w-5 text-red-500" />
                        )}
                        {task.type === 'verification' && (
                          <CheckCircleIcon className="h-5 w-5 text-green-500" />
                        )}
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {task.title}
                          </p>
                          <p className="text-xs text-gray-500">
                            {task.location} • {task.time}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => router.push(task.actionUrl)}
                        className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                      >
                        Start
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="px-6 py-8 text-center text-gray-500">
                  No tasks assigned for today
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions & Map */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Quick Actions
              </h3>
              <div className="space-y-3">
                <button
                  onClick={() => router.push('/dashboard/field-officer/readings/new')}
                  className="w-full flex items-center justify-between px-4 py-3 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100"
                >
                  <span className="font-medium">Record Meter Reading</span>
                  <CameraIcon className="h-5 w-5" />
                </button>
                
                <button
                  onClick={() => router.push('/outage')}
                  className="w-full flex items-center justify-between px-4 py-3 bg-red-50 text-red-700 rounded-lg hover:bg-red-100"
                >
                  <span className="font-medium">Update Outage Status</span>
                  <ExclamationTriangleIcon className="h-5 w-5" />
                </button>
                
                <button
                  onClick={() => router.push('/verification/inspect/new')}
                  className="w-full flex items-center justify-between px-4 py-3 bg-green-50 text-green-700 rounded-lg hover:bg-green-100"
                >
                  <span className="font-medium">New Inspection</span>
                  <CheckCircleIcon className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Mini Map Placeholder */}
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Today's Route
              </h3>
              <div className="bg-gray-100 rounded-lg h-48 flex items-center justify-center">
                <MapPinIcon className="h-8 w-8 text-gray-400" />
                <span className="ml-2 text-gray-500">Map view loading...</span>
              </div>
              <button
                onClick={() => router.push('/dashboard/field-officer/route')}
                className="mt-4 w-full text-center text-sm text-blue-600 hover:text-blue-800"
              >
                View Full Route →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
    }
