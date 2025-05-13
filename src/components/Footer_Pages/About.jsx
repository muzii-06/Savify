import React from 'react';
import './About.css';
import savifylogo from './Savify logo.png';

const About = () => {
  return (
    <div className="about-container">
      <img className="about-logo" src={savifylogo} alt="Savify Logo" />

      <h1 className="about-title">About Savify</h1>

      <p className="about-intro">
        <strong>Savify</strong> is a next-generation multi-vendor e-commerce platform designed to empower small businesses, enhance buyer experience, and integrate smart technology into every step of online shopping. Whether you're a seller looking to grow or a customer searching for great deals, Savify is built for you.
      </p>

      <section className="about-section">
        <h2>Our Mission</h2>
        <p>
          To revolutionize the e-commerce space in Pakistan by providing a user-friendly, intelligent, and secure platform that supports both vendors and customers.
        </p>
      </section>

      <section className="about-section">
        <h2>What Makes Us Unique?</h2>
        <ul>
          <li>🤖 <strong>AI-Powered Bargaining:</strong> Smart negotiation feature that helps buyers get better deals.</li>
          <li>🎤 <strong>Image Search:</strong> Find products faster using voice or image input.</li>
          <li>📦 <strong>Multi-Vendor Support:</strong> A seamless system for sellers to manage products, orders, and customers.</li>
          <li>🔐 <strong>Secure Transactions:</strong> Ensuring buyer and seller protection through verified processes.</li>
        </ul>
      </section>

      <section className="about-section">
        <h2 >Our Vision</h2>
        <p >
          To become the most trusted and innovative e-commerce marketplace in South Asia — where technology meets convenience, and affordability meets quality.
        </p>
      </section>

      <section className="about-section">
        <h2 className='fs-6'>Contact Us</h2>
        <p>
          Have questions? Reach out to us at <strong>support@savify.com</strong>. We’re always here to help.
        </p>
      </section>
    </div>
  );
};

export default About;
