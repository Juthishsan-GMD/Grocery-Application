import React, { useState } from 'react';
import { FiMapPin, FiPhone, FiMail, FiSend } from 'react-icons/fi';
import emailjs from '@emailjs/browser';
import '../styles/Pages.css';
import { useCart } from '../context/CartContext';

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
        showToast('Thank you for reaching out! We will get back to you shortly.');
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
      <div className="contact-header">
        <div className="container">
          <h1>Get in Touch</h1>
          <p>We'd love to hear from you. Our friendly team is always here to chat.</p>
        </div>
      </div>

      <div className="container contact-container">
        
        {/* Contact Information */}
        <div className="contact-info-panel">
          <h2>Contact Information</h2>
          <p className="contact-desc">
            Whether you have a question about an order, our farming partners, or anything else, our team is ready to answer all your questions.
          </p>

          <div className="info-blocks">
            <div className="info-block">
              <div className="info-icon-wrapper">
                <FiMapPin className="info-icon" />
              </div>
              <div className="info-text">
                <h3>Our Headquarters</h3>
                <p>A.V. Info Tech Park<br/>Coimbatore, Tamil Nadu 641001</p>
              </div>
            </div>

            <div className="info-block">
              <div className="info-icon-wrapper">
                <FiPhone className="info-icon" />
              </div>
              <div className="info-text">
                <h3>Call Us</h3>
                <p>+91 9876543210<br/>Mon-Fri from 8am to 8pm</p>
              </div>
            </div>

            <div className="info-block">
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
          <form className="contact-form" onSubmit={handleSubmit}>
            <h2>Send us a Message</h2>
            
            <div className="form-row">
              <div className="input-group">
                <label>Full Name</label>
                <input 
                  type="text" 
                  placeholder="Name" 
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>
              <div className="input-group">
                <label>Email Address</label>
                <input 
                  type="email" 
                  placeholder="mail@example.com" 
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
              </div>
            </div>

            <div className="input-group">
              <label>Subject</label>
              <input 
                type="text" 
                placeholder="How can we help?" 
                required
                value={formData.subject}
                onChange={(e) => setFormData({...formData, subject: e.target.value})}
              />
            </div>

            <div className="input-group">
              <label>Message</label>
              <textarea 
                rows="5" 
                placeholder="Write your message here..." 
                required
                value={formData.message}
                onChange={(e) => setFormData({...formData, message: e.target.value})}
              ></textarea>
            </div>

            <button type="submit" className="btn btn-primary submit-btn" disabled={isSending}>
              {isSending ? 'Sending...' : <>Send Message <FiSend className="btn-icon" /></>}
            </button>
          </form>
        </div>

      </div>
    </div>
  );
};

export default Contact;
