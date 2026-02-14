// src/app/page.jsx
'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'
import styles from './page.module.css'
import Image from 'next/image'
import Link from 'next/link'

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
    <div className={styles.container}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <nav className={styles.nav}>
          <div className={styles.logo}>
            <Image 
              src="/images/logo.svg" 
              alt="Hospital Logo" 
              width={50} 
              height={50}
            />
            <span>MediCare Hospital</span>
          </div>
          <div className={styles.navLinks}>
            <Link href="/login" className={styles.loginBtn}>
              Login
            </Link>
            <Link href="/register" className={styles.registerBtn}>
              Register
            </Link>
          </div>
        </nav>

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

      {/* Features Section */}
      <section className={styles.features}>
        <h2>Why Choose Us</h2>
        <div className={styles.featuresGrid}>
          <div className={styles.feature}>
            <h3>Online Appointment</h3>
            <p>Book appointments easily through our portal</p>
          </div>
          <div className={styles.feature}>
            <h3>Digital Records</h3>
            <p>Access your medical records anytime, anywhere</p>
          </div>
          <div className={styles.feature}>
            <h3>Secure Billing</h3>
            <p>Transparent and secure payment processing</p>
          </div>
          <div className={styles.feature}>
            <h3>Patient Portal</h3>
            <p>24/7 access to your health information</p>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className={styles.testimonials}>
        <h2>What Our Patients Say</h2>
        <div className={styles.testimonialsGrid}>
          <div className={styles.testimonial}>
            <p>"Excellent care and professional staff. Highly recommended!"</p>
            <h4>- John Doe</h4>
          </div>
          <div className={styles.testimonial}>
            <p>"The online portal makes managing appointments so easy."</p>
            <h4>- Jane Smith</h4>
          </div>
          <div className={styles.testimonial}>
            <p>"Best hospital experience I've ever had. Thank you!"</p>
            <h4>- Mike Johnson</h4>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className={styles.cta}>
        <h2>Ready to Experience Better Healthcare?</h2>
        <p>Join thousands of satisfied patients today</p>
        <Link href="/register" className={styles.ctaBtn}>
          Register Now
        </Link>
      </section>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <div className={styles.footerSection}>
            <h4>MediCare Hospital</h4>
            <p>123 Healthcare Ave</p>
            <p>Medical City, MC 12345</p>
            <p>Phone: (555) 123-4567</p>
            <p>Email: info@medicare.com</p>
          </div>
          <div className={styles.footerSection}>
            <h4>Quick Links</h4>
            <Link href="/about">About Us</Link>
            <Link href="/services">Services</Link>
            <Link href="/doctors">Our Doctors</Link>
            <Link href="/contact">Contact</Link>
          </div>
          <div className={styles.footerSection}>
            <h4>Follow Us</h4>
            <div className={styles.socialLinks}>
              <a href="#">Facebook</a>
              <a href="#">Twitter</a>
              <a href="#">LinkedIn</a>
              <a href="#">Instagram</a>
            </div>
          </div>
        </div>
        <div className={styles.footerBottom}>
          <p>&copy; 2024 MediCare Hospital. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
