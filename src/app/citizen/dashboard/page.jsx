'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from './page.module.css';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import StatsCard from '@/components/shared/StatsCard';
import StatusBadge from '@/components/shared/StatusBadge';
import Timeline from '@/components/shared/Timeline';
import { useAuth } from '@/lib/hooks/useAuth';
import api from '@/lib/api/axios';

export default function CitizenDashboard() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    resolved: 0,
    pending: 0,
  });
  const [recentCases, setRecentCases] = useState([]);
  const [recentUpdates, setRecentUpdates] = useState([]);
  const [upcomingHearings, setUpcomingHearings] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [statsRes, casesRes, updatesRes, hearingsRes] = await Promise.all([
        api.get('/stats/citizen'),
        api.get('/complaints?limit=5'),
        api.get('/notifications/recent'),
        api.get('/hearings/upcoming'),
      ]);

      setStats(statsRes.data);
      setRecentCases(casesRes.data);
      setRecentUpdates(updatesRes.data);
      setUpcomingHearings(hearingsRes.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const timelineItems = recentUpdates.map(update => ({
    time: new Date(update.createdAt).toLocaleString(),
    status: update.type,
    title: update.title,
    description: update.content,
    metadata: {
      'Case': update.caseNumber,
    },
  }));

  return (
    <div className={styles.dashboard}>
      {/* Welcome Header */}
      <div className={styles.header}>
        <div>
          <h1 className={styles.welcomeTitle}>
            Welcome back, {user?.firstName}! 👋
          </h1>
          <p className={styles.welcomeSubtitle}>
            Here's what's happening with your cases today.
          </p>
        </div>
        <Link href="/citizen/submit">
          <Button size="large">
            📝 New Complaint
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className={styles.statsGrid}>
        <StatsCard
          title="Total Cases"
          value={stats.total}
          icon="📋"
          color="primary"
          loading={loading}
        />
        <StatsCard
          title="Active Cases"
          value={stats.active}
          icon="⚖️"
          color="warning"
          trend="up"
          trendValue={12}
          loading={loading}
        />
        <StatsCard
          title="Resolved"
          value={stats.resolved}
          icon="✅"
          color="success"
          trend="up"
          trendValue={8}
          loading={loading}
        />
        <StatsCard
          title="Pending Review"
          value={stats.pending}
          icon="⏳"
          color="info"
          loading={loading}
        />
      </div>

      {/* Main Content Grid */}
      <div className={styles.contentGrid}>
        {/* Recent Cases */}
        <Card className={styles.recentCases}>
          <div className={styles.cardHeader}>
            <h2 className={styles.cardTitle}>Recent Cases</h2>
            <Link href="/citizen/complaints" className={styles.viewAll}>
              View All →
            </Link>
          </div>
          
          <div className={styles.caseList}>
            {recentCases.map((case_) => (
              <Link
                key={case_.id}
                href={`/citizen/complaints/${case_.id}`}
                className={styles.caseItem}
              >
                <div className={styles.caseInfo}>
                  <span className={styles.caseNumber}>{case_.caseNumber}</span>
                  <h3 className={styles.caseTitle}>{case_.title}</h3>
                  <span className={styles.caseDate}>
                    {new Date(case_.submittedAt).toLocaleDateString()}
                  </span>
                </div>
                <div className={styles.caseStatus}>
                  <StatusBadge status={case_.status} />
                  <span className={styles.caseProgress}>
                    {case_.progress}% Complete
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </Card>

        {/* Recent Updates */}
        <Card className={styles.recentUpdates}>
          <div className={styles.cardHeader}>
            <h2 className={styles.cardTitle}>Recent Updates</h2>
            <Link href="/citizen/notifications" className={styles.viewAll}>
              View All →
            </Link>
          </div>
          
          <Timeline items={timelineItems.slice(0, 5)} />
        </Card>

        {/* Upcoming Hearings */}
        <Card className={styles.upcomingHearings}>
          <div className={styles.cardHeader}>
            <h2 className={styles.cardTitle}>Upcoming Hearings</h2>
          </div>
          
          {upcomingHearings.length > 0 ? (
            <div className={styles.hearingList}>
              {upcomingHearings.map((hearing) => (
                <div key={hearing.id} className={styles.hearingItem}>
                  <div className={styles.hearingDate}>
                    <span className={styles.hearingDay}>
                      {new Date(hearing.date).toLocaleDateString('en-US', { day: 'numeric' })}
                    </span>
                    <span className={styles.hearingMonth}>
                      {new Date(hearing.date).toLocaleDateString('en-US', { month: 'short' })}
                    </span>
                  </div>
                  <div className={styles.hearingInfo}>
                    <h4 className={styles.hearingTitle}>{hearing.caseTitle}</h4>
                    <p className={styles.hearingTime}>
                      {new Date(hearing.date).toLocaleTimeString()} • {hearing.type}
                    </p>
                    {hearing.isVirtual ? (
                      <Button size="small" className={styles.joinButton}>
                        Join Virtual Hearing
                      </Button>
                    ) : (
                      <p className={styles.hearingLocation}>{hearing.location}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className={styles.noHearings}>No upcoming hearings scheduled</p>
          )}
        </Card>

        {/* Quick Actions */}
        <Card className={styles.quickActions}>
          <h2 className={styles.cardTitle}>Quick Actions</h2>
          <div className={styles.actionGrid}>
            <Link href="/citizen/submit" className={styles.actionItem}>
              <span className={styles.actionIcon}>📝</span>
              <span className={styles.actionLabel}>New Complaint</span>
            </Link>
            <Link href="/citizen/evidence" className={styles.actionItem}>
              <span className={styles.actionIcon}>📎</span>
              <span className={styles.actionLabel}>Upload Evidence</span>
            </Link>
            <Link href="/citizen/track" className={styles.actionItem}>
              <span className={styles.actionIcon}>🔍</span>
              <span className={styles.actionLabel}>Track Case</span>
            </Link>
            <Link href="/citizen/messages" className={styles.actionItem}>
              <span className={styles.actionIcon}>💬</span>
              <span className={styles.actionLabel}>Messages</span>
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}
