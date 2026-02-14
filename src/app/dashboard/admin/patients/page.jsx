'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import styles from './patients.module.css';

export default function PatientsPage() {
  const router = useRouter();
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedPatients, setSelectedPatients] = useState([]);

  useEffect(() => {
    fetchPatients();
  }, [currentPage, filter, searchTerm]);

  const fetchPatients = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams({
        page: currentPage,
        limit: 10,
        filter,
        search: searchTerm
      });
      
      const response = await fetch(`/api/admin/patients?${queryParams}`);
      const data = await response.json();
      setPatients(data.patients);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error('Error fetching patients:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
    setCurrentPage(1);
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedPatients(patients.map(p => p.id));
    } else {
      setSelectedPatients([]);
    }
  };

  const handleSelectPatient = (patientId) => {
    setSelectedPatients(prev => {
      if (prev.includes(patientId)) {
        return prev.filter(id => id !== patientId);
      } else {
        return [...prev, patientId];
      }
    });
  };

  const handleBulkAction = async (action) => {
    if (selectedPatients.length === 0) return;

    if (confirm(`Are you sure you want to ${action} ${selectedPatients.length} patients?`)) {
      try {
        const response = await fetch('/api/admin/patients/bulk', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action, patientIds: selectedPatients })
        });

        if (response.ok) {
          fetchPatients();
          setSelectedPatients([]);
        }
      } catch (error) {
        console.error('Bulk action error:', error);
      }
    }
  };

  const handleDeletePatient = async (patientId) => {
    if (confirm('Are you sure you want to delete this patient?')) {
      try {
        const response = await fetch(`/api/admin/patients/${patientId}`, {
          method: 'DELETE'
        });

        if (response.ok) {
          fetchPatients();
        }
      } catch (error) {
        console.error('Error deleting patient:', error);
      }
    }
  };

  const getStatusBadgeClass = (status) => {
    const statuses = {
      active: styles.badgeActive,
      inactive: styles.badgeInactive,
      critical: styles.badgeCritical,
      discharged: styles.badgeDischarged
    };
    return statuses[status] || styles.badgeActive;
  };

  return (
    <div className={styles.container}>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Patient Management</h1>
          <p className={styles.pageSubtitle}>Manage and view all patient records</p>
        </div>
        <Link href="/admin/patients/new" className={styles.addButton}>
          + Add New Patient
        </Link>
      </div>

      <div className={styles.controls}>
        <div className={styles.searchSection}>
          <div className={styles.searchBox}>
            <span className={styles.searchIcon}>🔍</span>
            <input
              type="text"
              placeholder="Search patients by name, ID, phone..."
              value={searchTerm}
              onChange={handleSearch}
              className={styles.searchInput}
            />
          </div>

          <div className={styles.filterTabs}>
            <button
              className={`${styles.filterTab} ${filter === 'all' ? styles.activeFilter : ''}`}
              onClick={() => handleFilterChange('all')}
            >
              All Patients
            </button>
            <button
              className={`${styles.filterTab} ${filter === 'active' ? styles.activeFilter : ''}`}
              onClick={() => handleFilterChange('active')}
            >
              Active
            </button>
            <button
              className={`${styles.filterTab} ${filter === 'critical' ? styles.activeFilter : ''}`}
              onClick={() => handleFilterChange('critical')}
            >
              Critical
            </button>
            <button
              className={`${styles.filterTab} ${filter === 'discharged' ? styles.activeFilter : ''}`}
              onClick={() => handleFilterChange('discharged')}
            >
              Discharged
            </button>
          </div>
        </div>

        {selectedPatients.length > 0 && (
          <div className={styles.bulkActions}>
            <span className={styles.selectedCount}>{selectedPatients.length} selected</span>
            <button
              className={styles.bulkActionBtn}
              onClick={() => handleBulkAction('activate')}
            >
              ✓ Activate
            </button>
            <button
              className={styles.bulkActionBtn}
              onClick={() => handleBulkAction('deactivate')}
            >
              ✗ Deactivate
            </button>
            <button
              className={`${styles.bulkActionBtn} ${styles.dangerBtn}`}
              onClick={() => handleBulkAction('delete')}
            >
              🗑️ Delete
            </button>
          </div>
        )}
      </div>

      {loading ? (
        <div className={styles.loadingContainer}>
          <div className={styles.loader}></div>
        </div>
      ) : (
        <>
          <div className={styles.tableContainer}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th className={styles.checkboxCell}>
                    <input
                      type="checkbox"
                      onChange={handleSelectAll}
                      checked={selectedPatients.length === patients.length && patients.length > 0}
                      className={styles.checkbox}
                    />
                  </th>
                  <th>Patient Info</th>
                  <th>Contact</th>
                  <th>Medical Info</th>
                  <th>Last Visit</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {patients.map((patient) => (
                  <tr key={patient.id} className={styles.tableRow}>
                    <td className={styles.checkboxCell}>
                      <input
                        type="checkbox"
                        checked={selectedPatients.includes(patient.id)}
                        onChange={() => handleSelectPatient(patient.id)}
                        className={styles.checkbox}
                      />
                    </td>
                    <td>
                      <div className={styles.patientInfo}>
                        <Image
                          src={patient.image || '/images/default-avatar.png'}
                          alt={patient.name}
                          width={50}
                          height={50}
                          className={styles.patientImage}
                        />
                        <div>
                          <div className={styles.patientName}>{patient.name}</div>
                          <div className={styles.patientId}>ID: {patient.patientId}</div>
                          <div className={styles.patientDetails}>
                            {patient.age} yrs • {patient.gender}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className={styles.contactInfo}>
                        <div>📧 {patient.email}</div>
                        <div>📞 {patient.phone}</div>
                        <div className={styles.emergencyContact}>
                          🚨 {patient.emergencyContact}
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className={styles.medicalInfo}>
                        <div>Blood: {patient.bloodGroup}</div>
                        <div>Allergies: {patient.allergies || 'None'}</div>
                        <div>Doctor: {patient.primaryDoctor}</div>
                      </div>
                    </td>
                    <td>
                      <div className={styles.visitInfo}>
                        <div>{patient.lastVisit}</div>
                        <div className={styles.nextAppointment}>
                          Next: {patient.nextAppointment || 'Not scheduled'}
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className={`${styles.statusBadge} ${getStatusBadgeClass(patient.status)}`}>
                        {patient.status}
                      </span>
                    </td>
                    <td>
                      <div className={styles.actionButtons}>
                        <button
                          className={styles.actionBtn}
                          onClick={() => router.push(`/admin/patients/${patient.id}`)}
                          title="View Details"
                        >
                          👁️
                        </button>
                        <button
                          className={styles.actionBtn}
                          onClick={() => router.push(`/admin/patients/${patient.id}/edit`)}
                          title="Edit"
                        >
                          ✏️
                        </button>
                        <button
                          className={styles.actionBtn}
                          onClick={() => router.push(`/admin/patients/${patient.id}/appointments`)}
                          title="Appointments"
                        >
                          📅
                        </button>
                        <button
                          className={styles.actionBtn}
                          onClick={() => router.push(`/admin/patients/${patient.id}/billing`)}
                          title="Billing"
                        >
                          💰
                        </button>
                        <button
                          className={`${styles.actionBtn} ${styles.deleteBtn}`}
                          onClick={() => handleDeletePatient(patient.id)}
                          title="Delete"
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {patients.length === 0 && (
            <div className={styles.emptyState}>
              <div className={styles.emptyStateIcon}>👥</div>
              <h3>No patients found</h3>
              <p>Try adjusting your search or filter to find what you're looking for.</p>
              <button className={styles.clearFiltersBtn} onClick={() => {
                setSearchTerm('');
                setFilter('all');
              }}>
                Clear Filters
              </button>
            </div>
          )}

          <div className={styles.pagination}>
            <button
              className={styles.paginationBtn}
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              ← Previous
            </button>
            
            <div className={styles.pageNumbers}>
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i + 1}
                  className={`${styles.pageNumber} ${currentPage === i + 1 ? styles.activePage : ''}`}
                  onClick={() => setCurrentPage(i + 1)}
                >
                  {i + 1}
                </button>
              ))}
            </div>

            <button
              className={styles.paginationBtn}
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              Next →
            </button>
          </div>
        </>
      )}
    </div>
  );
}
