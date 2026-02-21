'use client';

export const dynamic = "force-dynamic";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import {
  ExclamationTriangleIcon,
  MapPinIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  ArrowPathIcon,
  PhoneIcon,
  EnvelopeIcon,
  UserIcon,
  BoltIcon,
  WrenchScrewdriverIcon,
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Spinner from '@/components/ui/Spinner';
import Modal from '@/components/ui/Modal';
import styles from '@/styles/outage/outage.module.css';

export default function OutagePage() {
  const router = useRouter();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedOutage, setSelectedOutage] = useState(null);
  const [activeOutages, setActiveOutages] = useState([]);
  const [stats, setStats] = useState({
    totalToday: 0,
    avgResponseTime: 0,
    resolvedToday: 0,
    criticalCount: 0,
  });
  
  const [formData, setFormData] = useState({
    type: 'unplanned',
    severity: 'medium',
    location: {
      area: '',
      street: '',
      city: '',
      pincode: '',
    },
    description: '',
    cause: 'unknown',
    contactNumber: '',
    additionalInfo: '',
  });

  useEffect(() => {
    fetchActiveOutages();
    fetchStats();
  }, []);

  const fetchActiveOutages = async () => {
    try {
      const res = await fetch('/api/outage?status=reported,verified,assigned,in_progress&limit=10');
      const data = await res.json();
      if (res.ok) {
        setActiveOutages(data.outages || []);
      }
    } catch (error) {
      toast.error('Failed to load outages');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/outage/stats');
      const data = await res.json();
      if (res.ok) {
        setStats(data.stats);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('location.')) {
      const locationField = name.split('.')[1];
      setFormData({
        ...formData,
        location: {
          ...formData.location,
          [locationField]: value,
        },
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const res = await fetch('/api/outage', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success('Outage reported successfully!');
        setShowForm(false);
        setFormData({
          type: 'unplanned',
          severity: 'medium',
          location: { area: '', street: '', city: '', pincode: '' },
          description: '',
          cause: 'unknown',
          contactNumber: '',
          additionalInfo: '',
        });
        fetchActiveOutages();
        fetchStats();
      } else {
        toast.error(data.message || 'Failed to report outage');
      }
    } catch (error) {
      toast.error('Something went wrong');
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      reported: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      verified: 'bg-blue-100 text-blue-800 border-blue-300',
      assigned: 'bg-purple-100 text-purple-800 border-purple-300',
      in_progress: 'bg-orange-100 text-orange-800 border-orange-300',
      resolved: 'bg-green-100 text-green-800 border-green-300',
      closed: 'bg-gray-100 text-gray-800 border-gray-300',
    };
    return colors[status] || 'bg-gray-100 text-gray-800 border-gray-300';
  };

  const getSeverityIcon = (severity) => {
    switch (severity) {
      case 'critical':
        return <ExclamationTriangleIcon className="h-5 w-5 text-red-600 animate-pulse" />;
      case 'high':
        return <ExclamationTriangleIcon className="h-5 w-5 text-orange-600" />;
      case 'medium':
        return <ExclamationTriangleIcon className="h-5 w-5 text-yellow-600" />;
      default:
        return <ExclamationTriangleIcon className="h-5 w-5 text-blue-600" />;
    }
  };

  const getSeverityBadge = (severity) => {
    const colors = {
      critical: 'danger',
      high: 'warning',
      medium: 'warning',
      low: 'success',
    };
    return colors[severity] || 'default';
  };

  const handleViewDetails = (outage) => {
    setSelectedOutage(outage);
    setShowDetailsModal(true);
  };

  const handleTrackOutage = (outageId) => {
    router.push(`/outage/${outageId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        {/* Header Section */}
        <div className={styles.header}>
          <h1>Power Outage Management</h1>
          <p>Report and track power outages in your area</p>
        </div>

        {/* Stats Cards */}
        <div className={styles.statsGrid}>
          <Card className={styles.statCard}>
            <div className={styles.statIcon}>
              <ExclamationTriangleIcon className="h-8 w-8 text-yellow-500" />
            </div>
            <div className={styles.statInfo}>
              <h3>{stats.totalToday}</h3>
              <p>Outages Today</p>
            </div>
          </Card>

          <Card className={styles.statCard}>
            <div className={styles.statIcon}>
              <ClockIcon className="h-8 w-8 text-blue-500" />
            </div>
            <div className={styles.statInfo}>
              <h3>{stats.avgResponseTime} min</h3>
              <p>Avg Response Time</p>
            </div>
          </Card>

          <Card className={styles.statCard}>
            <div className={styles.statIcon}>
              <CheckCircleIcon className="h-8 w-8 text-green-500" />
            </div>
            <div className={styles.statInfo}>
              <h3>{stats.resolvedToday}</h3>
              <p>Resolved Today</p>
            </div>
          </Card>

          <Card className={styles.statCard}>
            <div className={styles.statIcon}>
              <ExclamationTriangleIcon className="h-8 w-8 text-red-500" />
            </div>
            <div className={styles.statInfo}>
              <h3>{stats.criticalCount}</h3>
              <p>Critical</p>
            </div>
          </Card>
        </div>

        {/* Main Grid */}
        <div className={styles.grid}>
          {/* Left Column - Report Form */}
          <div className={styles.leftColumn}>
            {!showForm ? (
              <Card className={styles.reportPrompt}>
                <div className={styles.promptContent}>
                  <ExclamationTriangleIcon className="h-16 w-16 text-red-500 mb-4" />
                  <h2>Experiencing an Outage?</h2>
                  <p>Report it immediately so we can dispatch a team to your location.</p>
                  <Button
                    variant="danger"
                    size="lg"
                    onClick={() => setShowForm(true)}
                    icon={ExclamationTriangleIcon}
                    className="mt-4"
                  >
                    Report Outage
                  </Button>
                </div>
              </Card>
            ) : (
              <Card title="Report New Outage" className={styles.formCard}>
                <form onSubmit={handleSubmit} className={styles.form}>
                  {/* Outage Type */}
                  <div className={styles.formGroup}>
                    <label>
                      <BoltIcon className="h-4 w-4" />
                      Outage Type
                    </label>
                    <select
                      name="type"
                      value={formData.type}
                      onChange={handleChange}
                      className={styles.formControl}
                      required
                    >
                      <option value="unplanned">Unplanned Outage</option>
                      <option value="partial">Partial Outage</option>
                      <option value="complete">Complete Outage</option>
                      <option value="voltage_fluctuation">Voltage Fluctuation</option>
                      <option value="planned">Planned Maintenance</option>
                    </select>
                  </div>

                  {/* Severity */}
                  <div className={styles.formGroup}>
                    <label>
                      <ExclamationTriangleIcon className="h-4 w-4" />
                      Severity Level
                    </label>
                    <div className={styles.severityOptions}>
                      {['low', 'medium', 'high', 'critical'].map((severity) => (
                        <label key={severity} className={styles.severityOption}>
                          <input
                            type="radio"
                            name="severity"
                            value={severity}
                            checked={formData.severity === severity}
                            onChange={handleChange}
                          />
                          <span className={`${styles.severityBadge} ${styles[severity]}`} />
                          <span className="capitalize">{severity}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Location */}
                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label>
                        <MapPinIcon className="h-4 w-4" />
                        Area/Locality
                      </label>
                      <input
                        type="text"
                        name="location.area"
                        value={formData.location.area}
                        onChange={handleChange}
                        placeholder="e.g., Koramangala"
                        className={styles.formControl}
                        required
                      />
                    </div>

                    <div className={styles.formGroup}>
                      <label>Street/Colony</label>
                      <input
                        type="text"
                        name="location.street"
                        value={formData.location.street}
                        onChange={handleChange}
                        placeholder="Street name"
                        className={styles.formControl}
                        required
                      />
                    </div>
                  </div>

                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label>City</label>
                      <input
                        type="text"
                        name="location.city"
                        value={formData.location.city}
                        onChange={handleChange}
                        placeholder="City"
                        className={styles.formControl}
                      />
                    </div>

                    <div className={styles.formGroup}>
                      <label>Pincode</label>
                      <input
                        type="text"
                        name="location.pincode"
                        value={formData.location.pincode}
                        onChange={handleChange}
                        placeholder="Pincode"
                        className={styles.formControl}
                      />
                    </div>
                  </div>

                  {/* Cause */}
                  <div className={styles.formGroup}>
                    <label>Possible Cause (if known)</label>
                    <select
                      name="cause"
                      value={formData.cause}
                      onChange={handleChange}
                      className={styles.formControl}
                    >
                      <option value="unknown">Unknown</option>
                      <option value="equipment_failure">Equipment Failure</option>
                      <option value="weather">Weather Related</option>
                      <option value="accident">Accident</option>
                      <option value="tree">Tree Fall</option>
                      <option value="animal">Animal Contact</option>
                      <option value="maintenance">Maintenance</option>
                      <option value="load_shedding">Load Shedding</option>
                    </select>
                  </div>

                  {/* Contact Number */}
                  <div className={styles.formGroup}>
                    <label>
                      <PhoneIcon className="h-4 w-4" />
                      Contact Number
                    </label>
                    <input
                      type="tel"
                      name="contactNumber"
                      value={formData.contactNumber}
                      onChange={handleChange}
                      placeholder="Your phone number"
                      className={styles.formControl}
                      required
                    />
                  </div>

                  {/* Description */}
                  <div className={styles.formGroup}>
                    <label>Description</label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      rows={3}
                      placeholder="Please provide additional details..."
                      className={styles.formControl}
                      required
                    />
                  </div>

                  {/* Additional Info */}
                  <div className={styles.formGroup}>
                    <label>Additional Information (Optional)</label>
                    <textarea
                      name="additionalInfo"
                      value={formData.additionalInfo}
                      onChange={handleChange}
                      rows={2}
                      placeholder="Any other relevant information..."
                      className={styles.formControl}
                    />
                  </div>

                  {/* Form Actions */}
                  <div className={styles.formActions}>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowForm(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      variant="danger"
                      loading={submitting}
                    >
                      {submitting ? 'Reporting...' : 'Submit Report'}
                    </Button>
                  </div>
                </form>
              </Card>
            )}

            {/* Emergency Contact Card */}
            <Card className={styles.emergencyCard}>
              <div className={styles.emergencyContent}>
                <PhoneIcon className="h-8 w-8 text-red-500" />
                <div>
                  <h3>24/7 Emergency Helpline</h3>
                  <p className={styles.emergencyNumber}>1800-123-4567</p>
                  <p className={styles.emergencyEmail}>
                    <EnvelopeIcon className="h-4 w-4 inline mr-1" />
                    emergency@rigyasa.com
                  </p>
                </div>
              </div>
            </Card>

            {/* Quick Tips */}
            <Card title="Quick Tips" className={styles.tipsCard}>
              <ul className={styles.tipsList}>
                <li>• Check if neighbors are also affected</li>
                <li>• Turn off sensitive electronics</li>
                <li>• Keep refrigerator doors closed</li>
                <li>• Use flashlights, not candles</li>
                <li>• Leave one light on to know when power returns</li>
              </ul>
            </Card>
          </div>

          {/* Right Column - Active Outages */}
          <div className={styles.rightColumn}>
            <Card 
              title="Active Outages in Your Area" 
              subtitle={`${activeOutages.length} ongoing outages`}
              className={styles.outagesCard}
              headerAction={
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={fetchActiveOutages}
                  icon={ArrowPathIcon}
                >
                  Refresh
                </Button>
              }
            >
              <div className={styles.outagesList}>
                {activeOutages.length > 0 ? (
                  activeOutages.map((outage) => (
                    <div key={outage._id} className={styles.outageItem}>
                      <div className={styles.outageHeader}>
                        <div className={styles.outageTitle}>
                          {getSeverityIcon(outage.severity)}
                          <h3 className="font-medium">
                            {outage.type?.replace('_', ' ').toUpperCase()} Outage
                          </h3>
                          <Badge 
                            variant={getSeverityBadge(outage.severity)}
                            size="sm"
                          >
                            {outage.severity}
                          </Badge>
                          <Badge 
                            variant="default"
                            size="sm"
                            className={getStatusColor(outage.status)}
                          >
                            {outage.status?.replace('_', ' ')}
                          </Badge>
                        </div>
                        <span className={styles.outageTime}>
                          <ClockIcon className="h-4 w-4" />
                          {new Date(outage.reportedAt).toLocaleTimeString()}
                        </span>
                      </div>

                      <div className={styles.outageDetails}>
                        <div className={styles.detailItem}>
                          <MapPinIcon className="h-4 w-4" />
                          <span>{outage.location?.area}, {outage.location?.street}</span>
                        </div>
                        {outage.affectedCustomers && (
                          <div className={styles.detailItem}>
                            <UserIcon className="h-4 w-4" />
                            <span>{outage.affectedCustomers} affected</span>
                          </div>
                        )}
                      </div>

                      <p className={styles.outageDescription}>
                        {outage.description}
                      </p>

                      {/* Progress for in-progress outages */}
                      {outage.status === 'in_progress' && (
                        <div className={styles.progressContainer}>
                          <div className={styles.progressHeader}>
                            <span>Estimated restoration</span>
                            <span>        {outage.estimatedRestorationAt 
                                ? new Date(outage.estimatedRestorationAt).toLocaleTimeString()
                                : 'Calculating...'}
                            </span>
                          </div>
                          <div className={styles.progressBar}>
                            <div 
                              className={styles.progressFill}
                              style={{ width: '65%' }}
                            />
                          </div>
                        </div>
                      )}

                      {/* Latest Update */}
                      {outage.updates && outage.updates.length > 0 && (
                        <div className={styles.latestUpdate}>
                          <p className={styles.updateMessage}>
                            {outage.updates[outage.updates.length - 1].message}
                          </p>
                          <span className={styles.updateTime}>
                            <ClockIcon className="h-3 w-3" />
                            {new Date(outage.updates[outage.updates.length - 1].timestamp).toLocaleTimeString()}
                          </span>
                        </div>
                      )}

                      {/* Action Buttons */}
                      <div className={styles.outageActions}>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewDetails(outage)}
                        >
                          Quick View
                        </Button>
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => handleTrackOutage(outage._id)}
                        >
                          Track Status
                        </Button>
                        {outage.assignedTeam && (
                          <Badge variant="info" size="sm">
                            <WrenchScrewdriverIcon className="h-3 w-3 mr-1" />
                            Team Assigned
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className={styles.emptyState}>
                    <CheckCircleIcon className="h-16 w-16 text-green-500" />
                    <h3>No Active Outages</h3>
                    <p>There are no reported outages in your area at the moment.</p>
                  </div>
                )}
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Outage Details Modal */}
      <Modal
        isOpen={showDetailsModal}
        onClose={() => setShowDetailsModal(false)}
        title="Outage Details"
        size="lg"
      >
        {selectedOutage && (
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <div>
                <h4>Outage #{selectedOutage.outageId}</h4>
                <Badge 
                  variant={getSeverityBadge(selectedOutage.severity)}
                  className="mt-2"
                >
                  {selectedOutage.severity} severity
                </Badge>
              </div>
              <Badge className={getStatusColor(selectedOutage.status)}>
                {selectedOutage.status}
              </Badge>
            </div>

            <div className={styles.modalBody}>
              <div className={styles.modalSection}>
                <h5>Location</h5>
                <p>
                  {selectedOutage.location?.area}, {selectedOutage.location?.street}
                  {selectedOutage.location?.city && `, ${selectedOutage.location.city}`}
                  {selectedOutage.location?.pincode && ` - ${selectedOutage.location.pincode}`}
                </p>
              </div>

              <div className={styles.modalSection}>
                <h5>Description</h5>
                <p>{selectedOutage.description}</p>
                {selectedOutage.cause && (
                  <p className="text-sm text-gray-500 mt-2">
                    Cause: {selectedOutage.cause.replace('_', ' ')}
                  </p>
                )}
              </div>

              <div className={styles.modalSection}>
                <h5>Timeline</h5>
                <div className={styles.timeline}>
                  <div className={styles.timelineItem}>
                    <span className={styles.timelineTime}>
                      {new Date(selectedOutage.reportedAt).toLocaleString()}
                    </span>
                    <span className={styles.timelineEvent}>Outage Reported</span>
                  </div>
                  {selectedOutage.verifiedAt && (
                    <div className={styles.timelineItem}>
                      <span className={styles.timelineTime}>
                        {new Date(selectedOutage.verifiedAt).toLocaleString()}
                      </span>
                      <span className={styles.timelineEvent}>Outage Verified</span>
                    </div>
                  )}
                  {selectedOutage.assignedAt && (
                    <div className={styles.timelineItem}>
                      <span className={styles.timelineTime}>
                        {new Date(selectedOutage.assignedAt).toLocaleString()}
                      </span>
                      <span className={styles.timelineEvent}>Team Assigned</span>
                    </div>
                  )}
                </div>
              </div>

              {selectedOutage.assignedTeam && (
                <div className={styles.modalSection}>
                  <h5>Assigned Team</h5>
                  <div className={styles.teamInfo}>
                    <WrenchScrewdriverIcon className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="font-medium">{selectedOutage.assignedTeam.name}</p>
                      <p className="text-sm text-gray-500">
                        {selectedOutage.assignedTeam.members?.length} members
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className={styles.modalFooter}>
              <Button
                variant="outline"
                onClick={() => setShowDetailsModal(false)}
              >
                Close
              </Button>
              <Button
                variant="primary"
                onClick={() => {
                  setShowDetailsModal(false);
                  handleTrackOutage(selectedOutage._id);
                }}
              >
                View Full Details
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
              }
                        
