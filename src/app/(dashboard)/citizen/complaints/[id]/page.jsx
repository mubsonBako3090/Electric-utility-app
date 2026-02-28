'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import styles from './page.module.css';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import StatusBadge from '@/components/shared/StatusBadge';
import PriorityTag from '@/components/shared/PriorityTag';
import Timeline from '@/components/shared/Timeline';
import Modal from '@/components/ui/Modal';
import Input from '@/components/ui/Input';
import Alert from '@/components/ui/Alert';
import { useAuth } from '@/lib/hooks/useAuth';
import api from '@/lib/api/axios';

export default function ComplaintDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [complaint, setComplaint] = useState(null);
  const [updates, setUpdates] = useState([]);
  const [evidence, setEvidence] = useState([]);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showEvidenceModal, setShowEvidenceModal] = useState(false);
  const [updateText, setUpdateText] = useState('');
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchComplaintDetails();
  }, [id]);

  const fetchComplaintDetails = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/complaints/${id}`);
      setComplaint(response.data.complaint);
      setUpdates(response.data.updates || []);
      setEvidence(response.data.evidence || []);
    } catch (error) {
      console.error('Error fetching complaint:', error);
      setError('Failed to load complaint details');
    } finally {
      setLoading(false);
    }
  };

  const handleAddUpdate = async () => {
    if (!updateText.trim()) return;
    
    setSubmitting(true);
    try {
      await api.post(`/complaints/${id}/updates`, {
        text: updateText,
        updateType: 'note',
      });
      
      setShowUpdateModal(false);
      setUpdateText('');
      fetchComplaintDetails(); // Refresh data
    } catch (error) {
      setError('Failed to add update');
    } finally {
      setSubmitting(false);
    }
  };

  const handleFileUpload = async () => {
    if (selectedFiles.length === 0) return;
    
    const formData = new FormData();
    selectedFiles.forEach(file => {
      formData.append('files', file);
    });

    setSubmitting(true);
    try {
      await api.post(`/complaints/${id}/evidence`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      
      setShowEvidenceModal(false);
      setSelectedFiles([]);
      fetchComplaintDetails(); // Refresh data
    } catch (error) {
      setError('Failed to upload evidence');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner} />
        <p>Loading complaint details...</p>
      </div>
    );
  }

  if (!complaint) {
    return (
      <div className={styles.error}>
        <Alert type="error">Complaint not found</Alert>
        <Button onClick={() => router.back()}>Go Back</Button>
      </div>
    );
  }

  const timelineItems = updates.map(update => ({
    time: new Date(update.createdAt).toLocaleString(),
    status: update.updateType,
    title: update.updateType.replace('_', ' ').toUpperCase(),
    description: update.content.text,
    metadata: {
      'By': update.userId?.name || 'System',
    },
  }));

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div>
          <Link href="/citizen/dashboard" className={styles.backLink}>
            ← Back to Dashboard
          </Link>
          <h1 className={styles.title}>Case #{complaint.caseNumber}</h1>
        </div>
        <div className={styles.actions}>
          <Button
            variant="outline"
            onClick={() => setShowUpdateModal(true)}
          >
            Add Update
          </Button>
          <Button onClick={() => setShowEvidenceModal(true)}>
            Upload Evidence
          </Button>
        </div>
      </div>

      {error && (
        <Alert type="error" className={styles.alert}>
          {error}
        </Alert>
      )}

      {/* Main Content Grid */}
      <div className={styles.grid}>
        {/* Left Column - Case Details */}
        <div className={styles.leftColumn}>
          <Card className={styles.detailsCard}>
            <div className={styles.detailsHeader}>
              <h2 className={styles.sectionTitle}>Case Information</h2>
              <StatusBadge status={complaint.status.current} size="large" />
            </div>

            <div className={styles.detailsGrid}>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Category</span>
                <span className={styles.detailValue}>{complaint.complaint.category}</span>
              </div>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Urgency</span>
                <PriorityTag priority={complaint.complaint.urgencyLevel} />
              </div>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Submitted</span>
                <span className={styles.detailValue}>
                  {new Date(complaint.submittedAt).toLocaleDateString()}
                </span>
              </div>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Last Updated</span>
                <span className={styles.detailValue}>
                  {new Date(complaint.updatedAt).toLocaleDateString()}
                </span>
              </div>
            </div>

            <div className={styles.description}>
              <h3 className={styles.subTitle}>Description</h3>
              <p className={styles.descriptionText}>{complaint.complaint.description}</p>
            </div>

            {complaint.respondent?.name && (
              <div className={styles.respondent}>
                <h3 className={styles.subTitle}>Respondent</h3>
                <div className={styles.respondentDetails}>
                  <p><strong>Name:</strong> {complaint.respondent.name}</p>
                  {complaint.respondent.organization && (
                    <p><strong>Organization:</strong> {complaint.respondent.organization}</p>
                  )}
                  {complaint.respondent.contactInfo && (
                    <p><strong>Contact:</strong> {complaint.respondent.contactInfo}</p>
                  )}
                </div>
              </div>
            )}

            {complaint.assignment?.mediatorId && (
              <div className={styles.mediator}>
                <h3 className={styles.subTitle}>Assigned Mediator</h3>
                <div className={styles.mediatorInfo}>
                  <div className={styles.mediatorAvatar}>
                    {complaint.assignment.mediatorId.firstName?.[0]}
                  </div>
                  <div>
                    <p className={styles.mediatorName}>
                      {complaint.assignment.mediatorId.firstName} {complaint.assignment.mediatorId.lastName}
                    </p>
                    <Button variant="outline" size="small">
                      Contact Mediator
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </Card>

          {/* Evidence Section */}
          <Card className={styles.evidenceCard}>
            <h2 className={styles.sectionTitle}>Evidence</h2>
            {evidence.length > 0 ? (
              <div className={styles.evidenceList}>
                {evidence.map((file) => (
                  <div key={file.id} className={styles.evidenceItem}>
                    <span className={styles.evidenceIcon}>
                      {file.fileInfo.type === 'image' ? '🖼️' :
                       file.fileInfo.type === 'audio' ? '🎵' :
                       file.fileInfo.type === 'video' ? '🎥' : '📄'}
                    </span>
                    <div className={styles.evidenceInfo}>
                      <p className={styles.evidenceName}>{file.fileInfo.originalName}</p>
                      <p className={styles.evidenceMeta}>
                        {(file.fileInfo.size / 1024 / 1024).toFixed(2)} MB • 
                        {new Date(file.uploadedAt).toLocaleDateString()}
                      </p>
                    </div>
                    <Button variant="outline" size="small">
                      View
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <p className={styles.noEvidence}>No evidence uploaded yet</p>
            )}
          </Card>
        </div>

        {/* Right Column - Timeline */}
        <div className={styles.rightColumn}>
          <Card className={styles.timelineCard}>
            <h2 className={styles.sectionTitle}>Case Timeline</h2>
            <Timeline items={timelineItems} />
          </Card>
        </div>
      </div>

      {/* Add Update Modal */}
      <Modal
        isOpen={showUpdateModal}
        onClose={() => setShowUpdateModal(false)}
        title="Add Case Update"
        size="medium"
      >
        <div className={styles.modalContent}>
          <Input
            label="Update Message"
            value={updateText}
            onChange={(e) => setUpdateText(e.target.value)}
            placeholder="Enter your update or comment..."
            multiline
            rows={4}
            fullWidth
          />
        </div>
        <div className={styles.modalFooter}>
          <Button variant="outline" onClick={() => setShowUpdateModal(false)}>
            Cancel
          </Button>
          <Button onClick={handleAddUpdate} loading={submitting}>
            Post Update
          </Button>
        </div>
      </Modal>

      {/* Upload Evidence Modal */}
      <Modal
        isOpen={showEvidenceModal}
        onClose={() => setShowEvidenceModal(false)}
        title="Upload Evidence"
        size="medium"
      >
        <div className={styles.modalContent}>
          <div className={styles.uploadArea}>
            <input
              type="file"
              id="file-upload"
              multiple
              onChange={(e) => setSelectedFiles(Array.from(e.target.files))}
              accept=".jpg,.jpeg,.png,.pdf,.doc,.docx,.mp3,.mp4"
              className={styles.fileInput}
            />
            <label htmlFor="file-upload" className={styles.uploadLabel}>
              <span className={styles.uploadIcon}>📤</span>
              <span>Click to select files</span>
              <span className={styles.uploadHint}>
                Supported: Images, PDF, DOC, Audio, Video
              </span>
            </label>
          </div>

          {selectedFiles.length > 0 && (
            <div className={styles.selectedFiles}>
              <h4>Selected Files:</h4>
              {selectedFiles.map((file, index) => (
                <div key={index} className={styles.fileItem}>
                  <span>{file.name}</span>
                  <span>{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className={styles.modalFooter}>
          <Button variant="outline" onClick={() => setShowEvidenceModal(false)}>
            Cancel
          </Button>
          <Button onClick={handleFileUpload} loading={submitting}>
            Upload Files
          </Button>
        </div>
      </Modal>
    </div>
  );
}
