import React, { useState } from 'react';
import { FiMapPin, FiPhone, FiMail, FiSend, FiUser, FiMessageSquare, FiBookOpen } from 'react-icons/fi';
import emailjs from '@emailjs/browser';
import '../../styles/pages/Pages.css';
import { useCart } from '../../contexts/CartContext';

const Contact = () => {
  const { showToast } = useCart();
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [isSending, setIsSending] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSending(true);

    const templateParams = {
      from_name: formData.name,
      from_email: formData.email,
      subject: formData.subject,
      message: formData.message,
    };

    const SERVICE_ID = process.env.REACT_APP_EMAILJS_SERVICE_ID;
    const TEMPLATE_ID = process.env.REACT_APP_EMAILJS_CONTACT_TEMPLATE_ID;
    const PUBLIC_KEY = process.env.REACT_APP_EMAILJS_PUBLIC_KEY;

    emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams, PUBLIC_KEY)
      .then((response) => {
        console.log('SUCCESS!', response.status, response.text);
        showToast('Message sent! We have received your inquiry and will revert within 24 hours.');
        setFormData({ name: '', email: '', subject: '', message: '' });
      })
      .catch((err) => {
        console.log('FAILED...', err);
        showToast('Failed to send the message. Please try again later.');
      })
      .finally(() => {
        setIsSending(false);
      });
  };

  return (
    <div className="page-wrapper contact-page">
      
      {/* Dynamic Background Elements for Modern Look */}
      <div className="contact-blob contact-blob-1"></div>
      <div className="contact-blob contact-blob-2"></div>

      <div className="contact-header">
        <div className="container" style={{position: 'relative', zIndex: 2}}>
          <h1>Let's Connect.</h1>
          <p>We're here to help and answer any question you might have. We look forward to hearing from you.</p>
        </div>
      </div>

      <div className="container contact-container">
        
        {/* Contact Information */}
        <div className="contact-info-panel">
          <h2>Contact Information</h2>
          <p className="contact-desc">
            Whether you have a question about an order, our sustainable farming partners, or anything else, our team is ready to assist you.
          </p>

          <div className="info-blocks">
            <div className="info-block contact-card">
              <div className="info-icon-wrapper">
                <FiMapPin className="info-icon" />
              </div>
              <div className="info-text">
                <h3>Our Headquarters</h3>
                <p>A.V. Info Tech Park<br/>Coimbatore, Tamil Nadu 641001</p>
              </div>
            </div>

            <div className="info-block contact-card">
              <div className="info-icon-wrapper">
                <FiPhone className="info-icon" />
              </div>
              <div className="info-text">
                <h3>Call Us</h3>
                <p>+91 9876543210<br/>Mon-Fri from 8am to 8pm</p>
              </div>
            </div>

            <div className="info-block contact-card">
              <div className="info-icon-wrapper">
                <FiMail className="info-icon" />
              </div>
              <div className="info-text">
                <h3>Email Us</h3>
                <p>support@freshbasket.com<br/>partnerships@freshbasket.com</p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="contact-form-panel">
          <form className="contact-form glass-form" onSubmit={handleSubmit}>
            <div className="form-title-wrapper">
              <h2>Send us a Message</h2>
              <div className="title-underline"></div>
            </div>
            
            <div className="form-row">
              <div className="contact-input-group">
                <label>Full Name</label>
                <div className="modern-input-wrapper">
                  <FiUser className="input-icon" />
                  <input 
                    type="text" 
                    placeholder="John Doe" 
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                </div>
              </div>
              <div className="contact-input-group">
                <label>Email Address</label>
                <div className="modern-input-wrapper">
                  <FiMail className="input-icon" />
                  <input 
                    type="email" 
                    placeholder="mail@example.com" 
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                  />
                </div>
              </div>
            </div>

            <div className="contact-input-group">
              <label>Subject</label>
              <div className="modern-input-wrapper">
                <FiBookOpen className="input-icon" />
                <input 
                  type="text" 
                  placeholder="How can we help?" 
                  required
                  value={formData.subject}
                  onChange={(e) => setFormData({...formData, subject: e.target.value})}
                />
              </div>
            </div>

            <div className="contact-input-group">
              <label>Message</label>
              <div className="modern-input-wrapper textarea-wrapper">
                <FiMessageSquare className="input-icon area-icon" />
                <textarea 
                  rows="5" 
                  placeholder="Tell us everything..." 
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                ></textarea>
              </div>
            </div>

            <button type="submit" className="btn btn-primary submit-btn premium-btn" disabled={isSending}>
              {isSending ? 'Sending securely...' : <>Shoot Message <FiSend className="btn-icon" /></>}
            </button>
          </form>
        </div>

      </div>
    </div>
  );
};

export default Contact;
