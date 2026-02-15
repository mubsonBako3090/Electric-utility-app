// src/app/page.jsx
'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'
import styles from './page.module.css'
import Link from 'next/link'
import Navbar from '@/components/layout/Navbar'

export default function HomePage() {
  const router = useRouter()
  const { user, loading } = useAuth()

  useEffect(() => {
    if (!loading && user) {
      switch (user.role) {
        case 'admin':
          router.push('/admin')
          break
        case 'doctor':
          router.push('/doctor')
          break
        case 'receptionist':
          router.push('/receptionist')
          break
        case 'patient':
          router.push('/patient')
          break
        default:
          router.push('/')
      }
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner}></div>
      </div>
    )
  }

  return (
    <>
      {/* Reusable Navbar */}
      <Navbar />

      <div className={styles.container}>
        {/* Hero Section */}
        <section className={styles.hero}>
          <div className={styles.heroContent}>
            <h1>Welcome to MediCare Hospital</h1>
            <p>Providing compassionate healthcare with cutting-edge technology</p>

            <div className={styles.heroButtons}>
              <Link href="/register" className={styles.primaryBtn}>
                Get Started
              </Link>

              <Link href="#services" className={styles.secondaryBtn}>
                Learn More
              </Link>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className={styles.stats}>
          <div className={styles.statItem}>
            <h3>25+</h3>
            <p>Years of Excellence</p>
          </div>
          <div className={styles.statItem}>
            <h3>500+</h3>
            <p>Medical Professionals</p>
          </div>
          <div className={styles.statItem}>
            <h3>50k+</h3>
            <p>Happy Patients</p>
          </div>
          <div className={styles.statItem}>
            <h3>24/7</h3>
            <p>Emergency Care</p>
          </div>
        </section>

        {/* Services Section */}
        <section id="services" className={styles.services}>
          <h2>Our Services</h2>

          <div className={styles.servicesGrid}>
            <div className={styles.serviceCard}>
              <div className={styles.serviceIcon}>🏥</div>
              <h3>Emergency Care</h3>
              <p>24/7 emergency services with rapid response teams</p>
            </div>

            <div className={styles.serviceCard}>
              <div className={styles.serviceIcon}>👨‍⚕️</div>
              <h3>Expert Doctors</h3>
              <p>Board-certified specialists in various fields</p>
            </div>

            <div className={styles.serviceCard}>
              <div className={styles.serviceIcon}>🔬</div>
              <h3>Advanced Lab</h3>
              <p>State-of-the-art diagnostic facilities</p>
            </div>

            <div className={styles.serviceCard}>
              <div className={styles.serviceIcon}>💊</div>
              <h3>Pharmacy</h3>
              <p>In-house pharmacy with all medications</p>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className={styles.cta}>
          <h2>Ready to Experience Better Healthcare?</h2>
          <p>Join thousands of satisfied patients today</p>

          <Link href="/register" className={styles.ctaBtn}>
            Register Now
          </Link>
        </section>

        {/* Footer */}
        <footer className={styles.footer}>
          <p>© 2024 MediCare Hospital. All rights reserved.</p>
        </footer>
      </div>
    </>
  )
}
