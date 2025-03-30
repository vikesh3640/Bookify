import React from "react";
import "../../src/css/ContactUs.css";

const ContactUs = () => {
  return (
    <div className="support-page">
      {/* Hero Section */}
      <div className="hero-section">
        <h1>Get Support</h1>
        <div className="support-options">
          <div className="support-box">
            <i className="fas fa-map-marker-alt"></i>
            <p>TRACK YOUR ORDER</p>
          </div>
          <div className="support-box">
            <i className="fas fa-undo"></i>
            <p>START A RETURN</p>
          </div>
          <div className="support-box">
            <i className="fas fa-edit"></i>
            <p>CANCEL OR EDIT AN ORDER</p>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="search-bar">
        <input type="text" placeholder="What can we help you with?" />
      </div>

      {/* More Topics Section */}
      <div className="topics-section">
        <h2>MORE TOPICS</h2>
        <div className="topics-grid">
          <div className="topic">
            <h3>ORDER STATUS AND TRACKING</h3>
            <ul>
              <li>Order Status</li>
              <li>More Detailed Tracking Information</li>
              <li>Lost or Missing Package</li>
              <li>Cancel an Order</li>
              <li>Pre-Order FAQs</li>
            </ul>
            <a href="#">SEE MORE</a>
          </div>
          <div className="topic">
            <h3>SHIPPING</h3>
            <ul>
              <li>Change Shipping Address</li>
              <li>Shipping Costs</li>
              <li>Shipping Times</li>
              <li>Shipping Made to Order Items</li>
              <li>International Shipping</li>
            </ul>
            <a href="#">SEE MORE</a>
          </div>
          <div className="topic">
            <h3>RETURNS AND EXCHANGES</h3>
            <ul>
              <li>Cannot Locate Order</li>
              <li>Return Instructions</li>
              <li>Return and Exchange Processing Time</li>
              <li>Return Policy</li>
              <li>Exchange Instructions</li>
            </ul>
            <a href="#">SEE MORE</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
