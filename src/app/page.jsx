'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/context/AuthContext';
import { useAuthModal } from '@/context/AuthModalContext';
import {
  BoltIcon,
  CurrencyRupeeIcon,
  ChartBarIcon,
  ShieldCheckIcon,
  UserGroupIcon,
  SunIcon,
  ArrowRightIcon,
  CheckCircleIcon,
  PhoneIcon,
  EnvelopeIcon,
  MapPinIcon,
  ClockIcon,
} from '@heroicons/react/24/outline';
import Button from '@/components/ui/Button';
import styles from '@/styles/landing.module.css';

export default function LandingPage() {
  const { user } = useAuth();
  const { openLogin, openRegister } = useAuthModal();
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const features = [
    {
      icon: BoltIcon,
      title: 'Reliable Power Supply',
      description: '24/7 uninterrupted electricity with smart grid technology and real-time monitoring.',
      color: 'blue',
    },
    {
      icon: CurrencyRupeeIcon,
      title: 'Transparent Billing',
      description: 'Clear, detailed bills with complete breakdown of charges and consumption.',
      color: 'green',
    },
    {
      icon: ChartBarIcon,
      title: 'Usage Analytics',
      description: 'Track your consumption patterns and get insights to save energy and money.',
      color: 'purple',
    },
    {
      icon: ShieldCheckIcon,
      title: 'Secure Platform',
      description: 'Your data is protected with enterprise-grade security and encryption.',
      color: 'red',
    },
    {
      icon: UserGroupIcon,
      title: '24/7 Customer Support',
      description: 'Round-the-clock assistance for all your electricity-related queries.',
      color: 'yellow',
    },
    {
      icon: SunIcon,
      title: 'Green Energy',
      description: 'Promoting sustainable energy with solar integration and carbon tracking.',
      color: 'orange',
    },
  ];

  const stats = [
    { label: 'Customers Served', value: '50,000+', icon: UserGroupIcon },
    { label: 'Units Distributed', value: '10M+ kWh', icon: BoltIcon },
    { label: 'Cities Covered', value: '25+', icon: MapPinIcon },
    { label: 'Satisfaction Rate', value: '98%', icon: CheckCircleIcon },
  ];

  const testimonials = [
    {
      name: 'Rajesh Kumar',
      role: 'R5 Customer',
      content: 'The best electricity service I\'ve ever used. The app makes it so easy to track usage and pay bills.',
      rating: 5,
      image: '/testimonials/1.jpg',
    },
    {
      name: 'Priya Sharma',
      role: 'C2 Customer',
      content: 'Excellent transparency in billing and great customer support. Highly recommended!',
      rating: 5,
      image: '/testimonials/2.jpg',
    },
    {
      name: 'Amit Patel',
      role: 'R3 Customer',
      content: 'The usage analytics helped me reduce my electricity bill by 20%. Amazing features!',
      rating: 5,
      image: '/testimonials/3.jpg',
    },
  ];

  const steps = [
    {
      number: '01',
      title: 'Register Your Account',
      description: 'Sign up with your details and choose your customer category.',
    },
    {
      number: '02',
      title: 'Get Verified',
      description: 'Our field officer will verify your connection and meter details.',
    },
    {
      number: '03',
      title: 'Start Using',
      description: 'Access your dashboard, track usage, pay bills, and more.',
    },
  ];

  const faqs = [
    {
      question: 'How do I report a power outage?',
      answer: 'You can report outages through our app, website, or by calling our 24/7 helpline. We prioritize critical outages for immediate response.',
    },
    {
      question: 'How is my electricity bill calculated?',
      answer: 'Your bill is calculated based on your consumption category, units used, and applicable tariffs. You can see the complete breakdown in the billing section.',
    },
    {
      question: 'Can I declare vacation and get estimated billing?',
      answer: 'Yes! You can declare your vacation period, and we\'ll provide estimated billing based on your average usage. This helps avoid meter reading issues.',
    },
    {
      question: 'What payment methods are accepted?',
      answer: 'We accept all major payment methods including credit/debit cards, UPI, net banking, and auto-debit options.',
    },
  ];

  return (
    <div className={styles.container}>
      {/* Navigation */}
      <nav className={`${styles.navbar} ${scrollY > 50 ? styles.navbarScrolled : ''}`}>
        <div className={styles.navContainer}>
          <div className={styles.logo}>
            <BoltIcon className={styles.logoIcon} />
            <span className={styles.logoText}>Rigyasa Electric</span>
          </div>
          
          <div className={styles.navLinks}>
            <a href="#features">Features</a>
            <a href="#how-it-works">How It Works</a>
            <a href="#testimonials">Testimonials</a>
            <a href="#faq">FAQ</a>
            <a href="#contact">Contact</a>
          </div>

          <div className={styles.navButtons}>
            {user ? (
              <Link href="/dashboard">
                <Button variant="primary" size="sm">
                  Dashboard
                  <ArrowRightIcon className="h-4 w-4 ml-2" />
                </Button>
              </Link>
            ) : (
              <>
                <button
                  onClick={() => openLogin()}
                  className={styles.loginBtn}
                >
                  Login
                </button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => openRegister()}
                >
                  Register
                </Button>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <div className={styles.heroText}>
            <h1 className={styles.heroTitle}>
              Powering Your Future with
              <span className={styles.heroHighlight}> Smart Energy</span>
            </h1>
            <p className={styles.heroSubtitle}>
              Experience reliable, transparent, and intelligent electricity distribution 
              with real-time monitoring and control at your fingertips.
            </p>
            <div className={styles.heroButtons}>
              {user ? (
                <Link href="/dashboard">
                  <Button variant="primary" size="lg">
                    Go to Dashboard
                    <ArrowRightIcon className="h-5 w-5 ml-2" />
                  </Button>
                </Link>
              ) : (
                <>
                  <Button
                    variant="primary"
                    size="lg"
                    onClick={() => openRegister()}
                  >
                    Get Started
                    <ArrowRightIcon className="h-5 w-5 ml-2" />
                  </Button>
                  <button
                    onClick={() => openLogin()}
                    className={styles.heroLoginBtn}
                  >
                    Existing Customer? Login
                  </button>
                </>
              )}
            </div>
          </div>
          <div className={styles.heroImage}>
            <div className={styles.heroImageContainer}>
              {/* Add your hero image here */}
              <div className={styles.heroImagePlaceholder}>
                <BoltIcon className="h-32 w-32 text-blue-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className={styles.statsSection}>
          {stats.map((stat, index) => (
            <div key={index} className={styles.statItem}>
              <stat.icon className={styles.statIcon} />
              <div>
                <h3 className={styles.statValue}>{stat.value}</h3>
                <p className={styles.statLabel}>{stat.label}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className={styles.features}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Why Choose Rigyasa Electric?</h2>
          <p className={styles.sectionSubtitle}>
            We provide the best electricity distribution experience with cutting-edge technology
          </p>
        </div>

        <div className={styles.featuresGrid}>
          {features.map((feature, index) => (
            <div key={index} className={styles.featureCard}>
              <div className={`${styles.featureIcon} ${styles[feature.color]}`}>
                <feature.icon className="h-6 w-6" />
              </div>
              <h3 className={styles.featureTitle}>{feature.title}</h3>
              <p className={styles.featureDescription}>{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className={styles.howItWorks}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>How It Works</h2>
          <p className={styles.sectionSubtitle}>
            Get started in three simple steps
          </p>
        </div>

        <div className={styles.stepsContainer}>
          {steps.map((step, index) => (
            <div key={index} className={styles.stepItem}>
              <div className={styles.stepNumber}>{step.number}</div>
              <h3 className={styles.stepTitle}>{step.title}</h3>
              <p className={styles.stepDescription}>{step.description}</p>
              {index < steps.length - 1 && (
                <ArrowRightIcon className={styles.stepArrow} />
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className={styles.testimonials}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>What Our Customers Say</h2>
          <p className={styles.sectionSubtitle}>
            Real stories from satisfied customers
          </p>
        </div>

        <div className={styles.testimonialsGrid}>
          {testimonials.map((testimonial, index) => (
            <div key={index} className={styles.testimonialCard}>
              <div className={styles.testimonialHeader}>
                <div className={styles.testimonialImage}>
                  {/* Add image placeholder */}
                  <div className={styles.testimonialImagePlaceholder}>
                    {testimonial.name.charAt(0)}
                  </div>
                </div>
                <div>
                  <h4 className={styles.testimonialName}>{testimonial.name}</h4>
                  <p className={styles.testimonialRole}>{testimonial.role}</p>
                </div>
              </div>
              <p className={styles.testimonialContent}>"{testimonial.content}"</p>
              <div className={styles.testimonialRating}>
                {[...Array(testimonial.rating)].map((_, i) => (
                  <span key={i} className={styles.starFilled}>★</span>
                ))}
                {[...Array(5 - testimonial.rating)].map((_, i) => (
                  <span key={i} className={styles.starEmpty}>★</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className={styles.faq}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Frequently Asked Questions</h2>
          <p className={styles.sectionSubtitle}>
            Find answers to common questions
          </p>
        </div>

        <div className={styles.faqContainer}>
          {faqs.map((faq, index) => (
            <div key={index} className={styles.faqItem}>
              <h3 className={styles.faqQuestion}>{faq.question}</h3>
              <p className={styles.faqAnswer}>{faq.answer}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className={styles.cta}>
        <div className={styles.ctaContent}>
          <h2 className={styles.ctaTitle}>Ready to Get Started?</h2>
          <p className={styles.ctaSubtitle}>
            Join thousands of satisfied customers who trust Rigyasa Electric for their power needs.
          </p>
          {!user && (
            <Button
              variant="primary"
              size="lg"
              onClick={() => openRegister()}
              className={styles.ctaButton}
            >
              Create Your Account Now
              <ArrowRightIcon className="h-5 w-5 ml-2" />
            </Button>
          )}
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className={styles.contact}>
        <div className={styles.contactGrid}>
          <div className={styles.contactInfo}>
            <h3 className={styles.contactTitle}>Get in Touch</h3>
            <p className={styles.contactDescription}>
              Have questions? We're here to help 24/7.
            </p>
            
            <div className={styles.contactDetails}>
              <div className={styles.contactItem}>
                <PhoneIcon className="h-5 w-5 text-blue-600" />
                <span>24/7 Helpline: 1800-123-4567</span>
              </div>
              <div className={styles.contactItem}>
                <EnvelopeIcon className="h-5 w-5 text-blue-600" />
                <span>support@rigyasa.com</span>
              </div>
              <div className={styles.contactItem}>
                <MapPinIcon className="h-5 w-5 text-blue-600" />
                <span>123 Power Street, Bangalore - 560001</span>
              </div>
              <div className={styles.contactItem}>
                <ClockIcon className="h-5 w-5 text-blue-600" />
                <span>Customer Service: 24/7</span>
              </div>
            </div>
          </div>

          <div className={styles.contactForm}>
            <h3 className={styles.formTitle}>Send us a Message</h3>
            <form className={styles.form}>
              <input
                type="text"
                placeholder="Your Name"
                className={styles.formInput}
              />
              <input
                type="email"
                placeholder="Your Email"
                className={styles.formInput}
              />
              <select className={styles.formSelect}>
                <option>Select Subject</option>
                <option>Billing Query</option>
                <option>Technical Support</option>
                <option>General Inquiry</option>
                <option>Feedback</option>
              </select>
              <textarea
                placeholder="Your Message"
                rows="4"
                className={styles.formTextarea}
              />
              <Button type="submit" variant="primary" className="w-full">
                Send Message
              </Button>
            </form>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <div className={styles.footerSection}>
            <div className={styles.footerLogo}>
              <BoltIcon className="h-8 w-8" />
              <span>Rigyasa Electric</span>
            </div>
            <p className={styles.footerText}>
              Powering your future with smart, reliable, and sustainable energy solutions.
            </p>
          </div>

          <div className={styles.footerLinks}>
            <div className={styles.footerColumn}>
              <h4>Quick Links</h4>
              <a href="#features">Features</a>
              <a href="#how-it-works">How It Works</a>
              <a href="#testimonials">Testimonials</a>
              <a href="#faq">FAQ</a>
            </div>

            <div className={styles.footerColumn}>
              <h4>Services</h4>
              <a href="#">Billing</a>
              <a href="#">Outage Reporting</a>
              <a href="#">Vacation Declaration</a>
              <a href="#">New Connection</a>
            </div>

            <div className={styles.footerColumn}>
              <h4>Legal</h4>
              <a href="#">Privacy Policy</a>
              <a href="#">Terms of Service</a>
              <a href="#">Tariff Schedule</a>
              <a href="#">Grievance Redressal</a>
            </div>
          </div>
        </div>

        <div className={styles.footerBottom}>
          <p>&copy; {new Date().getFullYear()} Rigyasa Electric. All rights reserved.</p>
          <div className={styles.socialLinks}>
            <a href="#" className={styles.socialLink}>f</a>
            <a href="#" className={styles.socialLink}>t</a>
            <a href="#" className={styles.socialLink}>in</a>
            <a href="#" className={styles.socialLink}>ig</a>
          </div>
        </div>
      </footer>
    </div>
  );
                            }
