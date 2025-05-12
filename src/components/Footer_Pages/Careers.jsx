import React from 'react';
import './Careers.css';
import savifylogo from './Savify logo.png';

const Careers = () => {
  return (
    <div className="careers-container">
      <img className="careers-logo" src={savifylogo} alt="Savify Logo" />

      <h1 className="careers-title">Join Our Team at Savify</h1>
      <p className="careers-intro">
        At <strong>Savify</strong>, we're building a smarter, more connected online shopping experience — and we want you to be part of it.
        Whether you're passionate about technology, design, customer service, or operations, we’re always on the lookout for driven individuals.
      </p>

      <section className="why-join">
        <h2>Why Work With Us?</h2>
        <ul>
          <li>✨ Fast-growing and innovative e-commerce platform</li>
          <li>👥 Collaborative and inclusive team culture</li>
          <li>🌱 Opportunities for career growth and learning</li>
          <li>💻 Work on meaningful, high-impact projects</li>
        </ul>
      </section>

      <section className="open-positions">
        <h2>Current Openings</h2>
        <div className="job-card">
          <h3>Frontend Developer (React)</h3>
          <p><strong>Location:</strong> Remote / Islamabad</p>
          <p><strong>Experience:</strong> 1-3 years</p>
          <p><strong>Skills:</strong> React.js, HTML/CSS, REST APIs</p>
        </div>

        <div className="job-card">
          <h3>Customer Support Executive</h3>
          <p><strong>Location:</strong> Lahore (Onsite)</p>
          <p><strong>Experience:</strong> Fresh / 1 year</p>
          <p><strong>Skills:</strong> Communication, Email Support, CRM</p>
        </div>

        <div className="job-card">
          <h3>Marketing Intern</h3>
          <p><strong>Location:</strong> Remote</p>
          <p><strong>Duration:</strong> 3 months (Paid)</p>
          <p><strong>Skills:</strong> Social Media, Canva, Content Writing</p>
        </div>
      </section>

      <section className="how-to-apply">
        <h2>How to Apply</h2>
        <p>Send your resume and a brief cover letter to <strong>careers@savify.com</strong>. Mention the position you're applying for in the subject line.</p>
        <p>We look forward to hearing from you!</p>
      </section>
    </div>
  );
};

export default Careers;
