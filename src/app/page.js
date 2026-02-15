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
      <Navbar />

      <div className={styles.container}>
        {/* SYSTEM INTRO */}
        <section className={styles.hero}>
          <h1>Hospital Management System</h1>
          <p>
            A centralized platform designed to manage hospital operations including
            patient registration, appointment scheduling, medical records, billing,
            and staff coordination.
          </p>

          <div className={styles.actions}>
            <Link href="/login" className={styles.primaryBtn}>
              Login to System
            </Link>

            <Link href="/register" className={styles.secondaryBtn}>
              Register Patient
            </Link>
          </div>
        </section>

        {/* ABOUT SYSTEM */}
        <section className={styles.section}>
          <h2>About This System</h2>
          <p>
            This web-based Hospital Management System was developed to digitize
            manual hospital processes, reduce paperwork, improve patient care,
            and ensure secure access to medical information for authorized users.
          </p>
        </section>

        {/* USER ROLES */}
        <section className={styles.section}>
          <h2>System Access Levels</h2>

          <div className={styles.grid}>
            <div className={styles.card}>
              <h3>Administrator</h3>
              <p>
                Manages hospital staff, system records, departments, and generates
                operational reports.
              </p>
            </div>

            <div className={styles.card}>
              <h3>Doctor</h3>
              <p>
                Views assigned patients, updates diagnoses, prescribes treatment,
                and manages appointments.
              </p>
            </div>

            <div className={styles.card}>
              <h3>Receptionist</h3>
              <p>
                Registers patients, schedules appointments, and assists with
                hospital front-desk operations.
              </p>
            </div>

            <div className={styles.card}>
              <h3>Patient</h3>
              <p>
                Books appointments, views medical history, and tracks treatment
                information through the portal.
              </p>
            </div>
          </div>
        </section>

        {/* CORE FEATURES */}
        <section className={styles.section}>
          <h2>Core Functionalities</h2>

          <ul className={styles.features}>
            <li>✔ Electronic Medical Records (EMR)</li>
            <li>✔ Appointment Scheduling System</li>
            <li>✔ Role-Based Access Control</li>
            <li>✔ Automated Billing and Payment Tracking</li>
            <li>✔ Secure Authentication</li>
            <li>✔ Real-Time Data Management</li>
          </ul>
        </section>

        {/* FOOTER */}
        <footer className={styles.footer}>
          <p>
            Developed as a Final Year Computer Science Project — Hospital Management System
          </p>
        </footer>
      </div>
    </>
  )
      }
