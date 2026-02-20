'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import toast from 'react-hot-toast';
import {
  ExclamationTriangleIcon,
  MapPinIcon,
  ClockIcon,
  UserIcon,
  WrenchScrewdriverIcon,
  CheckCircleIcon,
  ArrowLeftIcon,
} from '@heroicons/react/24/outline';

export default function OutageDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [outage, setOutage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState({ rating: 5, comment: '' });

  useEffect(() => {
    fetchOutageDetails();
  }, [id]);

  const fetchOutageDetails = async () => {
    try {
      const res = await fetch(`/api/outage/${id}`);
      const data = await res.json();
      if (res.ok) {
        setOutage(data.outage);
      }
    } catch (error) {
      console.error('Error fetching outage:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitFeedback = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/outage/${id}/feedback`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(feedback),
      });

      if (res.ok) {
        toast.success('Thank you for your feedback!');
        fetchOutageDetails();
      }
    } catch (error) {
      toast.error('Failed to submit feedback');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!outage) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <ExclamationTriangleIcon className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900">Outage not found</h2>
          <button
            onClick={() => router.back()}
            className="mt-4 text-blue-600 hover:text-blue-800"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const getStatusColor = (status) => {
    const colors = {
      reported: 'bg-yellow-100 text-yellow-800',
      verified: 'bg-blue-100 text-blue-800',
      assigned: 'bg-purple-100 text-purple-800',
      in_progress: 'bg-orange-100 text-orange-800',
      resolved: 'bg-green-100 text-green-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back button */}
        <button
          onClick={() => router.back()}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeftIcon className="h-4 w-4 mr-1" />
          Back
        </button>

        {/* Header */}
        <div className="bg-white shadow rounded-lg overflow-hidden mb-6">
          <div className="px-6 py-5 bg-gradient-to-r from-red-600 to-red-700">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold text-white">Outage #{outage.outageId}</h1>
                <p className="text-red-100 mt-1">Reported on {new Date(outage.reportedAt).toLocaleString()}</p>
              </div>
              <span className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(outage.status)}`}>
                {outage.status.replace('_', ' ').toUpperCase()}
              </span>
            </div>
          </div>

          <div className="p-6">
            {/* Key Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="space-y-4">
                <div className="flex items-start">
                  <MapPinIcon className="h-5 w-5 text-gray-400 mt-0.5 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">Location</p>
                    <p className="text-gray-900">{outage.location?.area}, {outage.location?.street}</p>
                    {outage.location?.city && (
                      <p className="text-sm text-gray-500">{outage.location.city} - {outage.location.pincode}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-start">
                  <ExclamationTriangleIcon className="h-5 w-5 text-gray-400 mt-0.5 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">Type & Severity</p>
                    <p className="text-gray-900 capitalize">{outage.type.replace('_', ' ')}</p>
                    <p className="text-sm">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                        outage.severity === 'critical' ? 'bg-red-100 text-red-800' :
                        outage.severity === 'high' ? 'bg-orange-100 text-orange-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {outage.severity} severity
                      </span>
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-start">
                  <UserIcon className="h-5 w-5 text-gray-400 mt-0.5 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">Reported By</p>
                    <p className="text-gray-900">{outage.reportedBy?.name}</p>
                    <p className="text-sm text-gray-500">{outage.reportedBy?.email}</p>
                  </div>
                </div>

                {outage.assignedOfficer && (
                  <div className="flex items-start">
                    <WrenchScrewdriverIcon className="h-5 w-5 text-gray-400 mt-0.5 mr-3" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">Assigned Team</p>
                      <p className="text-gray-900">{outage.assignedOfficer?.name}</p>
                      {outage.assignedTeam && (
                        <p className="text-sm text-gray-500">{outage.assignedTeam.name}</p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Description */}
            <div className="border-t border-gray-200 pt-6 mb-6">
              <h3 className="text-sm font-medium text-gray-500 mb-2">Description</h3>
              <p className="text-gray-900">{outage.description}</p>
              {outage.cause && (
                <p className="mt-2 text-sm">
                  <span className="font-medium">Cause:</span> {outage.cause.replace('_', ' ')}
                </p>
              )}
            </div>

            {/* Timeline */}
            {outage.updates && outage.updates.length > 0 && (
              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-sm font-medium text-gray-500 mb-4">Updates</h3>
                <div className="space-y-4">
                  {outage.updates.map((update, index) => (
                    <div key={index} className="flex">
                      <div className="flex-shrink-0 mr-3">
                        <div className="h-2 w-2 mt-2 rounded-full bg-blue-600"></div>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-900">{update.message}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {new Date(update.timestamp).toLocaleString()}
                          {update.updatedBy && ` by ${update.updatedBy.name}`}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Resolution Info */}
            {outage.status === 'resolved' && (
              <div className="border-t border-gray-200 pt-6 mt-6">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex">
                    <CheckCircleIcon className="h-5 w-5 text-green-600 mt-0.5" />
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-green-800">Outage Resolved</h3>
                      <p className="text-sm text-green-700 mt-1">
                        Resolved at: {new Date(outage.resolvedAt).toLocaleString()}
                      </p>
                      <p className="text-sm text-green-700">
                        Duration: {outage.duration} minutes
                      </p>
                      {outage.resolution?.notes && (
                        <p className="text-sm text-green-700 mt-2">
                          Notes: {outage.resolution.notes}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Feedback Form (for resolved outages) */}
        {outage.status === 'resolved' && !outage.customerFeedback && (
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Rate Your Experience</h2>
            <form onSubmit={handleSubmitFeedback}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rating
                </label>
                <div className="flex space-x-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setFeedback({ ...feedback, rating: star })}
                      className={`text-2xl focus:outline-none ${
                        star <= feedback.rating ? 'text-yellow-400' : 'text-gray-300'
                      }`}
                    >
                      ★
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Comments (Optional)
                </label>
                <textarea
                  value={feedback.comment}
                  onChange={(e) => setFeedback({ ...feedback, comment: e.target.value })}
                  rows={3}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Tell us about your experience..."
                />
              </div>

              <button
                type="submit"
                className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
              >
                Submit Feedback
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
