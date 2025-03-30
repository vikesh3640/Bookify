import React from "react";
import { Link } from "react-router-dom";
import styles from "..//Footer.module.css";
import visa from '../assets/visa.jpg';
import phonepe from '../assets/phonepe.jpg';
import gpay from '../assets/gpay.jpg';
import paytm from '../assets/paytm.jpg';

import trustpilot from '../assets/book1.jpeg';

const Footer = () => {
  return (
    <footer className={styles.footer}>
      {/* Newsletter Section */}
      <div className={styles.newsletter}>
        <h3>Sign up to our news & offers</h3>
        <p>Be the first to know about exclusive offers, new services, couriers, tools, and more!</p>
        <div className={styles.subscribeBox}>
          <input type="email" placeholder="email@address.com" />
          <button>Sign up</button>
        </div>
      </div>

      {/* Footer Links Section */}
      <div className={styles.footerContainer}>
        <div className={styles.footerLogo}>
          <h2><span className={styles.monkey}>Bookify </span>®</h2>
          <img src={trustpilot} alt="Trustpilot Rating" className={styles.trustpilot} />
          <p>Trustscore 4.0 | 9,200 reviews</p>
        </div>

        <div className={styles.footerLinks}>
          <div>
            <h4>Company</h4>
            <ul>
              <li><Link to="#">About us</Link></li>
              <li><Link to="#">Reviews</Link></li>
              <li><Link to="#">Privacy policy</Link></li>
              <li><Link to="#">Cookie policy</Link></li>
              <li><Link to="#">Terms & conditions</Link></li>
              <li><Link to="#">Sitemap</Link></li>
            </ul>
          </div>

          <div>
            <h4>Shipping services</h4>
            <ul>
              <li><Link to="#">Ship a package</Link></li>
              <li><Link to="#">Track a package</Link></li>
              <li><Link to="#">Domestic shipping</Link></li>
              <li><Link to="#">International shipping</Link></li>
              <li><Link to="#">Bulk shipping</Link></li>
              <li><Link to="#">Couriers</Link></li>
            </ul>
          </div>

          <div>
            <h4>Customers</h4>
            <ul>
              <li><Link to="/login">Log in</Link></li>
              <li><Link to="#">Register</Link></li>
              <li><Link to="/helpandcontact">Contact us</Link></li>
              <li><Link to="#">Support hub</Link></li>
            </ul>
          </div>
        </div>
      </div>

      {/* Footer Info Section */}
      <div className={styles.footerBottom}>
        <div className={styles.info}>
          <div>
            <span>🚚 Shipping to <strong>over 16+ states</strong></span>
          </div>
          <div>
            <span>🔒 100% <strong>Secure Checkout</strong></span>
          </div>
          <div>
            <span>🌍 Outstanding <strong>Worldwide Support</strong></span>
          </div>
          <div>
            <span>⭐ Over <strong>1,000 Genuine Reviews</strong></span>
          </div>
        </div>
        
        {/* Country Selection & Payment Methods */}
        <div className={styles.payment}>
          <span>🌍 India</span>
          <p>Copyright © 2009-2024 | All Rights Reserved</p>
          <div className={styles.paymentIcons}>
          <p>Payment Partners</p>
           <img src={visa} alt="Visa" />
           <img src={phonepe} alt="PhonePe" />
           <img src={gpay} alt="Google Pay" />
           <img src={paytm} alt="Paytm" />

          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
