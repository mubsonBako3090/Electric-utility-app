import React from 'react';
import Link from 'next/link';
import styles from './Footer.module.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    about: [
      { label: 'About Us', href: '/about' },
      { label: 'Our Mission', href: '/mission' },
      { label: 'Team', href: '/team' },
      { label: 'Partners', href: '/partners' },
    ],
    services: [
      { label: 'Submit Complaint', href: '/submit' },
      { label: 'Track Case', href: '/track' },
      { label: 'Mediation', href: '/mediation' },
      { label: 'Legal Aid', href: '/legal-aid' },
    ],
    resources: [
      { label: 'FAQ', href: '/faq' },
      { label: 'Blog', href: '/blog' },
      { label: 'Statistics', href: '/statistics' },
      { label: 'Success Stories', href: '/success-stories' },
    ],
    legal: [
      { label: 'Privacy Policy', href: '/privacy' },
      { label: 'Terms of Service', href: '/terms' },
      { label: 'Accessibility', href: '/accessibility' },
      { label: 'Sitemap', href: '/sitemap' },
    ],
  };

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        {/* Main Footer */}
        <div className={styles.mainFooter}>
          {/* Brand Section */}
          <div className={styles.brandSection}>
            <div className={styles.logo}>
              <span className={styles.logoIcon}>⚖️</span>
              <span className={styles.logoText}>JusticeConnect NG</span>
            </div>
            <p className={styles.description}>
              A digital platform for Nigerian citizens to report injustices,
              track cases, and connect with mediators for fair resolution.
            </p>
            <div className={styles.socialLinks}>
              <a href="#" className={styles.socialLink}>📘</a>
              <a href="#" className={styles.socialLink}>🐦</a>
              <a href="#" className={styles.socialLink}>📷</a>
              <a href="#" className={styles.socialLink}>💼</a>
            </div>
          </div>

          {/* Links Sections */}
          <div className={styles.linksGrid}>
            <div className={styles.linksSection}>
              <h3 className={styles.sectionTitle}>About</h3>
              <ul className={styles.linkList}>
                {footerLinks.about.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className={styles.link}>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className={styles.linksSection}>
              <h3 className={styles.sectionTitle}>Services</h3>
              <ul className={styles.linkList}>
                {footerLinks.services.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className={styles.link}>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className={styles.linksSection}>
              <h3 className={styles.sectionTitle}>Resources</h3>
              <ul className={styles.linkList}>
                {footerLinks.resources.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className={styles.link}>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className={styles.linksSection}>
              <h3 className={styles.sectionTitle}>Legal</h3>
              <ul className={styles.linkList}>
                {footerLinks.legal.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className={styles.link}>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Contact Info Bar */}
        <div className={styles.contactBar}>
          <div className={styles.contactItem}>
            <span className={styles.contactIcon}>📍</span>
            <span>Abuja, Nigeria</span>
          </div>
          <div className={styles.contactItem}>
            <span className={styles.contactIcon}>📞</span>
            <span>0800-JUSTICE</span>
          </div>
          <div className={styles.contactItem}>
            <span className={styles.contactIcon}>✉️</span>
            <span>help@justiceconnect.ng</span>
          </div>
          <div className={styles.contactItem}>
            <span className={styles.contactIcon}>🕒</span>
            <span>Mon-Fri: 8am - 6pm</span>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className={styles.bottomFooter}>
          <p className={styles.copyright}>
            © {currentYear} JusticeConnect NG. All rights reserved.
          </p>
          <p className={styles.attribution}>
            Made with ❤️ for Nigerian Justice
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
