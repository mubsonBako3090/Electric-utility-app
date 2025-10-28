'use client';

import { useState } from 'react';
import Head from 'next/head';
import Header from '@/component/Navbar';
import Footer from '@/component/Footer';
import ServiceCard from '@/component/ServiceCard';
import Lightbox from '@/component/Lightbox';
import styles from '@/styles/Home.module.css';

export default function Home() {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxImage, setLightboxImage] = useState('');

  const services = [
    {
      icon: 'bi-house',
      title: 'Residential Services',
      description: 'Reliable power for your home with 24/7 support'
    },
    {
      icon: 'bi-building',
      title: 'Commercial Services',
      description: 'Power solutions for businesses of all sizes'
    },
    {
      icon: 'bi-lightning',
      title: 'Emergency Response',
      description: 'Rapid response teams for power outages'
    }
  ];

  const openLightbox = (image) => {
    setLightboxImage(image);
    setLightboxOpen(true);
  };

  return (
    <>
      <Head>
        <title>PowerGrid Utilities - Reliable Energy Solutions</title>
        <meta name="description" content="Your trusted electric utility provider" />
      </Head>

      <Header />

      {/* Hero Section */}
      <section className={styles.hero}>
        <div className="container">
          <div className="row align-items-center min-vh-100">
            <div className="col-lg-6" data-aos="fade-right">
              <h1 className={styles.heroTitle}>
                Powering Your World with <span className={styles.highlight}>Reliable Energy</span>
              </h1>
              <p className={styles.heroSubtitle}>
                Providing sustainable and reliable electricity to over 2 million customers 
                across the region. Your trusted partner in energy solutions.
              </p>
              <div className={styles.heroButtons}>
                <button className="btn btn-primary btn-lg me-3">
                  Report Outage
                </button>
                <button className="btn btn-outline-primary btn-lg">
                  Pay Bill Online
                </button>
              </div>
            </div>
            <div className="col-lg-6" data-aos="fade-left">
              <div className={styles.heroImage}>
                <img 
                  src="/mum.jpg" 
                  alt="Energy Solutions" 
                  className="img-fluid"
                   style={{ width: '100%', height: '400px', maxWidth: 'none' }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Preview */}
      <section className="section-padding bg-light">
        <div className="container">
          <div className="text-center mb-5" data-aos="fade-up">
            <h2 className="section-title">Our Services</h2>
            <p className="section-subtitle">
              Comprehensive energy solutions for every need
            </p>
          </div>
          <div className="row">
            {services.map((service, index) => (
              <div key={index} className="col-md-4" data-aos="fade-up" data-aos-delay={index * 100}>
                <ServiceCard {...service} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="section-padding">
        <div className="container">
          <div className="text-center mb-5" data-aos="fade-up">
           <h2 className={`section-title ${styles.ourWorkTitle}`}>Our Work</h2>
<p className={`section-subtitle ${styles.ourWorkSubtitle}`}>
  Modern infrastructure for reliable power
</p>

          </div>
          <div className="row">
            {[1, 2, 3, 4].map((item) => (
              <div key={item} className="col-md-3 mb-4" data-aos="zoom-in">
                <div 
                  className={styles.galleryItem}
                  onClick={() => openLightbox(`/loop.jpeg`)}
                >
                  <img 
                    src={`/gallery.webp`}
                    alt={`Gallery ${item}`}
                    className="img-fluid"
                  />
                  <div className={styles.galleryOverlay}>
                    <i className="bi bi-zoom-in"></i>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className={`${styles.ctaSection} text-white`}>
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-8" data-aos="fade-right">
              <h3>Ready to Get Started?</h3>
              <p>Join thousands of satisfied customers with reliable power solutions.</p>
            </div>
            <div className="col-lg-4 text-lg-end" data-aos="fade-left">
              <button className="btn btn-light btn-lg">
                Contact Us Today
              </button>
            </div>
          </div>
        </div>
      </section>

      <Footer />

      {lightboxOpen && (
        <Lightbox 
          image={lightboxImage}
          onClose={() => setLightboxOpen(false)}
        />
      )}
    </>
  );
}
