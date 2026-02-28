import React from 'react';
import Link from 'next/link';
import styles from './page.module.css';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import BarChart from '@/components/charts';

export default function HomePage() {
  const stats = [
    { value: '1,247', label: 'Complaints Filed', icon: '📝' },
    { value: '856', label: 'Cases Resolved', icon: '✅' },
    { value: '98%', label: 'Resolution Rate', icon: '📊' },
    { value: '36', label: 'States Covered', icon: '🗺️' },
  ];

  const categories = [
    { name: 'Police Brutality', count: 234, color: '#DC2626' },
    { name: 'Land Dispute', count: 189, color: '#D97706' },
    { name: 'Unpaid Salary', count: 156, color: '#059669' },
    { name: 'Corruption', count: 112, color: '#7C3AED' },
    { name: 'Missing Person', count: 67, color: '#2563EB' },
    { name: 'Domestic Violence', count: 98, color: '#DB2777' },
  ];

  const recentCases = [
    { id: 'BRK-2024-01234', title: 'Unpaid Salary', location: 'Lagos', status: 'resolved' },
    { id: 'BRK-2024-01235', title: 'Land Dispute', location: 'Abuja', status: 'resolved' },
    { id: 'BRK-2024-01236', title: 'Police Brutality', location: 'Kano', status: 'resolved' },
  ];

  const chartData = categories.map(c => ({
    label: c.name,
    value: c.count
  }));

  return (
    <main className={styles.home}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.container}>
          <div className={styles.heroContent}>
            <h1 className={styles.heroTitle}>
              Speak Up.<br />
              <span className={styles.highlight}>Get Justice.</span><br />
              Track Progress.
            </h1>
            <p className={styles.heroDescription}>
              A digital platform for Nigerian citizens to report injustices,
              track cases, and connect with mediators for fair resolution.
            </p>
            <div className={styles.heroActions}>
              <Link href="/submit">
                <Button size="large">
                  📝 Submit a Complaint
                </Button>
              </Link>
              <Link href="/track">
                <Button variant="outline" size="large">
                  📋 Track Your Case
                </Button>
              </Link>
            </div>
          </div>
          <div className={styles.heroImage}>
            <div className={styles.heroStats}>
              {stats.map((stat, index) => (
                <div key={index} className={styles.heroStat}>
                  <span className={styles.heroStatValue}>{stat.value}</span>
                  <span className={styles.heroStatLabel}>{stat.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className={styles.howItWorks}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>How It Works</h2>
          <div className={styles.steps}>
            <div className={styles.step}>
              <div className={styles.stepNumber}>1</div>
              <h3 className={styles.stepTitle}>Submit Complaint</h3>
              <p className={styles.stepDescription}>
                Fill out our online form with details of your complaint
              </p>
            </div>
            <div className={styles.step}>
              <div className={styles.stepNumber}>2</div>
              <h3 className={styles.stepTitle}>Upload Evidence</h3>
              <p className={styles.stepDescription}>
                Provide supporting documents, photos, or recordings
              </p>
            </div>
            <div className={styles.step}>
              <div className={styles.stepNumber}>3</div>
              <h3 className={styles.stepTitle}>Case Assigned</h3>
              <p className={styles.stepDescription}>
                A mediator is assigned to handle your case
              </p>
            </div>
            <div className={styles.step}>
              <div className={styles.stepNumber}>4</div>
              <h3 className={styles.stepTitle}>Get Resolution</h3>
              <p className={styles.stepDescription}>
                Track progress and receive fair resolution
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className={styles.categories}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>Common Complaint Categories</h2>
          <div className={styles.categoryGrid}>
            {categories.map((category, index) => (
              <Card key={index} hoverable className={styles.categoryCard}>
                <div className={styles.categoryHeader}>
                  <span className={styles.categoryColor} style={{ background: category.color }} />
                  <h3 className={styles.categoryName}>{category.name}</h3>
                </div>
                <p className={styles.categoryCount}>{category.count} cases</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Chart Section */}
      <section className={styles.chartSection}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>Cases by Category</h2>
          <Card>
            <BarChart
              data={chartData}
              title="Distribution of Complaints"
              height={400}
            />
          </Card>
        </div>
      </section>

      {/* Recent Cases */}
      <section className={styles.recentCases}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>Recent Resolved Cases</h2>
          <div className={styles.caseList}>
            {recentCases.map((case_) => (
              <Card key={case_.id} hoverable className={styles.caseCard}>
                <div className={styles.caseHeader}>
                  <span className={styles.caseId}>{case_.id}</span>
                  <span className={`${styles.caseStatus} ${styles[case_.status]}`}>
                    ✓ Resolved
                  </span>
                </div>
                <h3 className={styles.caseTitle}>{case_.title}</h3>
                <p className={styles.caseLocation}>{case_.location}</p>
              </Card>
            ))}
          </div>
          <div className={styles.viewAll}>
            <Link href="/resolved-cases">
              <Button variant="outline">View All Resolved Cases →</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Partners */}
      <section className={styles.partners}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>Our Partners</h2>
          <div className={styles.partnerGrid}>
            <div className={styles.partner}>NHRC</div>
            <div className={styles.partner}>Police</div>
            <div className={styles.partner}>ICPC</div>
            <div className={styles.partner}>NBA</div>
            <div className={styles.partner}>NJC</div>
          </div>
        </div>
      </section>
    </main>
  );
     }
