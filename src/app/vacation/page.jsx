'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import {
  CalendarIcon,
  HomeIcon,
  PhoneIcon,
  EnvelopeIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  DocumentTextIcon,
  PlusIcon,
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

export default function VacationPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [vacations, setVacations] = useState([]);
  const [formData, setFormData] = useState({
    type: 'vacation',
    fromDate: new Date(),
    toDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    contactDuringVacation: {
      phone: '',
      email: '',
      address: '',
    },
    alternateContact: {
      name: '',
      phone: '',
      relation: '',
    },
    propertyStatus: {
      locked: true,
      appliancesOff: false,
      meterAccessible: true,
      hasPets: false,
    },
    billingPreference: 'estimated',
    notes: '',
  });

  useEffect(() => {
    fetchVacations();
  }, []);

  const fetchVacations = async () => {
    try {
      const res = await fetch('/api/vacation');
      const data = await res.json();
      if (res.ok) {
        setVacations(data.vacations);
      }
    } catch (error) {
      toast.error('Failed to load vacation history');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData({
        ...formData,
        [parent]: {
          ...formData[parent],
          [child]: type === 'checkbox' ? checked : value,
        },
      });
    } else {
      setFormData({
        ...formData,
        [name]: type === 'checkbox' ? checked : value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/vacation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success('Vacation declared successfully!');
        setShowForm(false);
        setFormData({
          type: 'vacation',
          fromDate: new Date(),
          toDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          contactDuringVacation: { phone: '', email: '', address: '' },
          alternateContact: { name: '', phone: '', relation: '' },
          propertyStatus: { locked: true, appliancesOff: false, meterAccessible: true, hasPets: false },
          billingPreference: 'estimated',
          notes: '',
        });
        fetchVacations();
      } else {
        toast.error(data.message || 'Failed to declare vacation');
      }
    } catch (error) {
      toast.error('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-green-100 text-green-800',
      active: 'bg-blue-100 text-blue-800',
      completed: 'bg-gray-100 text-gray-800',
      cancelled: 'bg-red-100 text-red-800',
      rejected: 'bg-red-100 text-red-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'approved':
      case 'completed':
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
      case 'pending':
        return <ClockIcon className="h-5 w-5 text-yellow-500" />;
      case 'cancelled':
      case 'rejected':
        return <XCircleIcon className="h-5 w-5 text-red-500" />;
      default:
        return <CalendarIcon className="h-5 w-5 text-gray-500" />;
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
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Vacation Declaration</h1>
            <p className="mt-2 text-gray-600">
              Notify us when you'll be away to adjust your billing
            </p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            New Declaration
          </button>
        </div>

        {/* Declaration Form */}
        {showForm && (
          <div className="bg-white shadow rounded-lg mb-8">
            <div className="px-6 py-5 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">
                Declare Vacation / Property Vacancy
              </h2>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Vacation Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Declaration Type
                </label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                >
                  <option value="vacation">Vacation</option>
                  <option value="temporary_relocation">Temporary Relocation</option>
                  <option value="property_vacant">Property Vacant</option>
                  <option value="renovation">Renovation</option>
                </select>
              </div>

              {/* Date Range */}
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    From Date
                  </label>
                  <DatePicker
                    selected={formData.fromDate}
                    onChange={(date) => setFormData({ ...formData, fromDate: date })}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    minDate={new Date()}
                    dateFormat="dd/MM/yyyy"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    To Date
                  </label>
                  <DatePicker
                    selected={formData.toDate}
                    onChange={(date) => setFormData({ ...formData, toDate: date })}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    minDate={formData.fromDate}
                    dateFormat="dd/MM/yyyy"
                  />
                </div>
              </div>

              {/* Contact During Vacation */}
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-3">
                  Contact During Vacation
                </h3>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
                  <div>
                    <input
                      type="tel"
                      name="contactDuringVacation.phone"
                      value={formData.contactDuringVacation.phone}
                      onChange={handleChange}
                      placeholder="Phone Number"
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                  </div>
                  <div>
                    <input
                      type="email"
                      name="contactDuringVacation.email"
                      value={formData.contactDuringVacation.email}
                      onChange={handleChange}
                      placeholder="Email"
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      name="contactDuringVacation.address"
                      value={formData.contactDuringVacation.address}
                      onChange={handleChange}
                      placeholder="Address"
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                  </div>
                </div>
              </div>

              {/* Alternate Contact */}
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-3">
                  Alternate Contact (Emergency)
                </h3>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
                  <div>
                    <input
                      type="text"
                      name="alternateContact.name"
                      value={formData.alternateContact.name}
                      onChange={handleChange}
                      placeholder="Contact Name"
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                  </div>
                  <div>
                    <input
                      type="tel"
                      name="alternateContact.phone"
                      value={formData.alternateContact.phone}
                      onChange={handleChange}
                      placeholder="Phone Number"
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      name="alternateContact.relation"
                      value={formData.alternateContact.relation}
                      onChange={handleChange}
                      placeholder="Relation"
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                  </div>
                </div>
              </div>

              {/* Property Status */}
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-3">
                  Property Status
                </h3>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="propertyStatus.locked"
                      checked={formData.propertyStatus.locked}
                      onChange={handleChange}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-600">Property will be locked</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="propertyStatus.appliancesOff"
                      checked={formData.propertyStatus.appliancesOff}
                      onChange={handleChange}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-600">All appliances switched off</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="propertyStatus.meterAccessible"
                      checked={formData.propertyStatus.meterAccessible}
                      onChange={handleChange}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-600">Meter is accessible</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="propertyStatus.hasPets"
                      checked={formData.propertyStatus.hasPets}
                      onChange={handleChange}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-600">Pets at home (needs care)</span>
                  </label>
                </div>
              </div>

              {/* Billing Preference */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Billing Preference During Vacation
                </label>
                <select
                  name="billingPreference"
                  value={formData.billingPreference}
                  onChange={handleChange}
                  className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                >
                  <option value="estimated">Estimated based on average</option>
                  <option value="minimum_charge">Minimum charge only</option>
                  <option value="average_based">Average of last 3 months</option>
                  <option value="no_change">Regular billing</option>
                </select>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Additional Notes
                </label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  rows={3}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Any special instructions..."
                />
              </div>

              {/* Submit Button */}
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                >
                  {loading ? 'Submitting...' : 'Submit Declaration'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Vacation History */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-5 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">
              Your Vacation History
            </h2>
          </div>
          <div className="divide-y divide-gray-200">
            {vacations.length > 0 ? (
              vacations.map((vacation) => (
                <div key={vacation._id} className="px-6 py-4 hover:bg-gray-50">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3">
                      {getStatusIcon(vacation.status)}
                      <div>
                        <div className="flex items-center space-x-2">
                          <h3 className="text-sm font-medium text-gray-900">
                            {vacation.type.replace('_', ' ').toUpperCase()}
                          </h3>
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(vacation.status)}`}>
                            {vacation.status}
                          </span>
                        </div>
                        <p className="text-sm text-gray-500 mt-1">
                          {new Date(vacation.fromDate).toLocaleDateString()} - {new Date(vacation.toDate).toLocaleDateString()}
                          {vacation.duration && ` (${vacation.duration} days)`}
                        </p>
                        {vacation.approvedAt && (
                          <p className="text-xs text-green-600 mt-1">
                            Approved on {new Date(vacation.approvedAt).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => router.push(`/vacation/${vacation._id}`)}
                      className="text-sm text-blue-600 hover:text-blue-800"
                    >
                      View Details →
                      </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="px-6 py-12 text-center">
                <CalendarIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No Vacations Declared
                </h3>
                <p className="text-gray-500">
                  You haven't declared any vacations yet. Click "New Declaration" to get started.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Information Card */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-sm font-medium text-blue-800 mb-2">
            ℹ️ About Vacation Declaration
          </h3>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Declare your vacation to get estimated billing based on your average usage</li>
            <li>• Submit at least 3 days before your vacation start date</li>
            <li>• You can modify or cancel your declaration anytime</li>
            <li>• Field officer may visit to verify property status</li>
            <li>• Final bill adjustment will be done after your return</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
