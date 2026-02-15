'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import styles from './page.module.css';

export default function HomePage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    // Redirect if already logged in
    if (status === 'authenticated') {
      const role = session.user.role;
      switch(role) {
        case 'admin':
          router.push('/admin');
          break;
        case 'doctor':
          router.push('/doctor');
          break;
        case 'receptionist':
          router.push('/receptionist');
          break;
        case 'patient':
          router.push('/patient');
          break;
        default:
          router.push('/dashboard');
      }
    }
  }, [status, session, router]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const features = [
    {
      icon: '👥',
      title: 'Patient Management',
      description: 'Efficiently manage patient records, medical history, and personal information in one secure place.'
    },
    {
      icon: '📅',
      title: 'Appointment Scheduling',
      description: 'Smart scheduling system with automated reminders and real-time availability tracking.'
    },
    {
      icon: '💰',
      title: 'Billing & Payments',
      description: 'Streamlined billing process with invoice generation, payment tracking, and insurance claims.'
    },
    {
      icon: '👨‍⚕️',
      title: 'Doctor Management',
      description: 'Comprehensive doctor profiles, schedules, and performance analytics.'
    },
    {
      icon: '📋',
      title: 'Medical Records',
      description: 'Secure digital storage of medical records, prescriptions, and lab reports.'
    },
    {
      icon: '📊',
      title: 'Reports & Analytics',
      description: 'Detailed insights and customizable reports for better decision making.'
    }
  ];

  const stats = [
    { value: '10K+', label: 'Patients' },
    { value: '500+', label: 'Doctors' },
    { value: '50K+', label: 'Appointments' },
    { value: '24/7', label: 'Support' }
  ];

  const testimonials = [
    {
      name: 'Dr. Sarah Johnson',
      role: 'Cardiologist',
      image: '/images/testimonials/doctor1.jpg',
      quote: 'This system has transformed how I manage my patients. The intuitive interface and comprehensive features save me hours every day.'
    },
    {
      name: 'John Smith',
      role: 'Patient',
      image: '/images/testimonials/patient1.jpg',
      quote: 'Booking appointments and accessing my medical records has never been easier. The patient portal is incredibly user-friendly.'
    },
    {
      name: 'Michael Chen',
      role: 'Hospital Administrator',
      image: '/images/testimonials/admin1.jpg',
      quote: 'The reporting and analytics tools give us valuable insights into our operations. Best investment we\'ve made.'
    }
  ];

  return (
    <div className={styles.container}>
      {/* Navigation */}
      <nav className={`${styles.navbar} ${scrolled ? styles.scrolled : ''}`}>
        <div className={styles.navContainer}>
          <Link href="/" className={styles.logo}>
            <span className={styles.logoIcon}>🏥</span>
            <span className={styles.logoText}>HealthCare Plus</span>
          </Link>

          <button 
            className={styles.menuToggle}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? '✕' : '☰'}
          </button>

          <div className={`${styles.navLinks} ${isMenuOpen ? styles.open : ''}`}>
            <Link href="#features" className={styles.navLink} onClick={() => setIsMenuOpen(false)}>
              Features
            </Link>
            <Link href="#about" className={styles.navLink} onClick={() => setIsMenuOpen(false)}>
              About
            </Link>
            <Link href="#testimonials" className={styles.navLink} onClick={() => setIsMenuOpen(false)}>
              Testimonials
            </Link>
            <Link href="#contact" className={styles.navLink} onClick={() => setIsMenuOpen(false)}>
              Contact
            </Link>
            <div className={styles.navButtons}>
              <Link href="/login" className={styles.loginBtn}>
                Login
              </Link>
              <Link href="/register" className={styles.registerBtn}>
                Register
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroContainer}>
          <div className={styles.heroContent}>
            <h1 className={styles.heroTitle}>
              Modern Healthcare <span className={styles.highlight}>Management System</span>
            </h1>
            <p className={styles.heroSubtitle}>
              Streamline your hospital operations with our comprehensive management solution. 
              From patient records to billing, we've got you covered.
            </p>
            <div className={styles.heroButtons}>
              <Link href="/register" className={styles.primaryBtn}>
                Get Started
              </Link>
              <Link href="#demo" className={styles.secondaryBtn}>
                Watch Demo
              </Link>
            </div>
            <p className={styles.trustBadge}>
              <span>✓ Trusted by 500+ healthcare providers</span>
              <span>✓ HIPAA Compliant</span>
              <span>✓ 24/7 Support</span>
            </p>
          </div>
          <div className={styles.heroImage}>
            <Image 
              src="/images/hero-dashboard.png"
              alt="Healthcare Dashboard"
              width={600}
              height={400}
              className={styles.dashboardPreview}
            />
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className={styles.statsSection}>
        <div className={styles.statsContainer}>
          {stats.map((stat, index) => (
            <div key={index} className={styles.statItem}>
              <span className={styles.statValue}>{stat.value}</span>
              <span className={styles.statLabel}>{stat.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className={styles.features}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Comprehensive Features</h2>
          <p className={styles.sectionSubtitle}>
            Everything you need to manage your healthcare facility efficiently
          </p>
        </div>

        <div className={styles.featuresGrid}>
          {features.map((feature, index) => (
            <div key={index} className={styles.featureCard}>
              <div className={styles.featureIcon}>{feature.icon}</div>
              <h3 className={styles.featureTitle}>{feature.title}</h3>
              <p className={styles.featureDescription}>{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* About Section */}
      <section id="about" className={styles.about}>
        <div className={styles.aboutContainer}>
          <div className={styles.aboutContent}>
            <h2 className={styles.aboutTitle}>Why Choose HealthCare Plus?</h2>
            <p className={styles.aboutText}>
              We understand the challenges of modern healthcare management. Our platform 
              is designed to simplify workflows, reduce administrative burden, and improve 
              patient care.
            </p>
            <ul className={styles.benefitsList}>
              <li>✓ Secure, HIPAA-compliant platform</li>
              <li>✓ Intuitive interface for all user types</li>
              <li>✓ Real-time updates and notifications</li>
              <li>✓ Comprehensive reporting and analytics</li>
              <li>✓ Seamless integration with existing systems</li>
              <li>✓ Dedicated customer support team</li>
            </ul>
            <Link href="/about" className={styles.learnMoreBtn}>
              Learn More About Us
            </Link>
          </div>
          <div className={styles.aboutImage}>
            <Image 
              src="/images/about-image.jpg"
              alt="About HealthCare Plus"
              width={500}
              height={400}
              className={styles.aboutImg}
            />
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className={styles.testimonials}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>What Our Users Say</h2>
          <p className={styles.sectionSubtitle}>
            Trusted by healthcare professionals worldwide
          </p>
        </div>

        <div className={styles.testimonialsGrid}>
          {testimonials.map((testimonial, index) => (
            <div key={index} className={styles.testimonialCard}>
              <div className={styles.quoteIcon}>"</div>
              <p className={styles.testimonialQuote}>{testimonial.quote}</p>
              <div className={styles.testimonialAuthor}>
                <Image 
                  src={testimonial.image}
                  alt={testimonial.name}
                  width={50}
                  height={50}
                  className={styles.authorImage}
                />
                <div className={styles.authorInfo}>
                  <h4>{testimonial.name}</h4>
                  <p>{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section id="demo" className={styles.cta}>
        <div className={styles.ctaContainer}>
          <h2 className={styles.ctaTitle}>Ready to Transform Your Healthcare Management?</h2>
          <p className={styles.ctaText}>
            Join thousands of healthcare providers who have already streamlined their operations
          </p>
          <div className={styles.ctaButtons}>
            <Link href="/register" className={styles.ctaPrimaryBtn}>
              Start Free Trial
            </Link>
            <Link href="/contact" className={styles.ctaSecondaryBtn}>
              Contact Sales
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className={styles.footer}>
        <div className={styles.footerContainer}>
          <div className={styles.footerGrid}>
            <div className={styles.footerColumn}>
              <h3 className={styles.footerLogo}>
                <span className={styles.footerLogoIcon}>🏥</span>
                HealthCare Plus
              </h3>
              <p className={styles.footerText}>
                Revolutionizing healthcare management with innovative technology solutions.
              </p>
              <div className={styles.socialLinks}>
                <a href="#" className={styles.socialLink}>📘</a>
                <a href="#" className={styles.socialLink}>🐦</a>
                <a href="#" className={styles.socialLink}>📷</a>
                <a href="#" className={styles.socialLink}>💼</a>
              </div>
            </div>

            <div className={styles.footerColumn}>
              <h4>Quick Links</h4>
              <ul className={styles.footerLinks}>
                <li><Link href="#features">Features</Link></li>
                <li><Link href="#about">About Us</Link></li>
                <li><Link href="#testimonials">Testimonials</Link></li>
                <li><Link href="/pricing">Pricing</Link></li>
              </ul>
            </div>

            <div className={styles.footerColumn}>
              <h4>Support</h4>
              <ul className={styles.footerLinks}>
                <li><Link href="/help">Help Center</Link></li>
                <li><Link href="/docs">Documentation</Link></li>
                <li><Link href="/api">API</Link></li>
                <li><Link href="/status">System Status</Link></li>
              </ul>
            </div>

            <div className={styles.footerColumn}>
              <h4>Contact Us</h4>
              <ul className={styles.contactInfo}>
                <li>📞 +1 (555) 123-4567</li>
                <li>✉️ info@healthcareplus.com</li>
                <li>📍 123 Medical Drive, Suite 100</li>
                <li>🏥 New York, NY 10001</li>
              </ul>
            </div>
          </div>

          <div className={styles.footerBottom}>
            <p>&copy; 2024 HealthCare Plus. All rights reserved.</p>
            <div className={styles.footerBottomLinks}>
              <Link href="/privacy">Privacy Policy</Link>
              <Link href="/terms">Terms of Service</Link>
              <Link href="/cookies">Cookie Policy</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
      }
