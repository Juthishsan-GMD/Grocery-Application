import React, { useState } from 'react';
import { FiMapPin, FiPhone, FiMail, FiSend, FiUser, FiMessageSquare, FiBookOpen } from 'react-icons/fi';
import emailjs from '@emailjs/browser';
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
    <div className="pt-20 min-h-[80vh] relative overflow-hidden bg-slate-50">
      
      {/* Dynamic Background Elements for Modern Look */}
      <div className="absolute w-[50vw] h-[50vw] bg-emerald-500/15 rounded-full blur-[80px] -top-[10%] -left-[10%] -z-0"></div>
      <div className="absolute w-[40vw] h-[40vw] bg-yellow-400/15 rounded-full blur-[80px] bottom-0 -right-[10%] -z-0"></div>

      <div className="relative py-24 text-center text-white bg-[url('https://images.unsplash.com/photo-1596524430615-b46475ddff6e?auto=format&fit=crop&q=80&w=1600')] bg-center bg-cover">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-600/90 to-emerald-500/80 z-10"></div>
        <div className="container relative z-20 mx-auto px-4">
          <h1 className="text-[2.5rem] md:text-[3.5rem] font-black mb-4 drop-shadow-md">Let's Connect.</h1>
          <p className="text-xl max-w-[600px] mx-auto opacity-90 leading-relaxed">We're here to help and answer any question you might have. We look forward to hearing from you.</p>
        </div>
      </div>

      <div className="container mx-auto px-6 py-20 pb-32 flex flex-col lg:flex-row gap-16 relative z-10">
        
        {/* Contact Information */}
        <div className="flex-1">
          <h2 className="text-[2.2rem] font-extrabold text-slate-800 mb-4">Contact Information</h2>
          <p className="text-lg text-slate-600 leading-relaxed mb-12">
            Whether you have a question about an order, our sustainable farming partners, or anything else, our team is ready to assist you.
          </p>

          <div className="flex flex-col gap-6">
            <div className="flex items-start gap-6 bg-white p-6 rounded-[20px] shadow-[0_10px_30px_rgba(0,0,0,0.03)] border border-emerald-500/5 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_15px_35px_rgba(16,185,129,0.1)]">
              <div className="w-[55px] h-[55px] bg-gradient-to-br from-emerald-500/10 to-emerald-500/20 text-emerald-500 rounded-2xl flex flex-shrink-0 items-center justify-center text-[1.4rem]">
                <FiMapPin />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-800 mb-1">Our Headquarters</h3>
                <p className="text-slate-600 leading-relaxed">A.V. Info Tech Park<br/>Coimbatore, Tamil Nadu 641001</p>
              </div>
            </div>

            <div className="flex items-start gap-6 bg-white p-6 rounded-[20px] shadow-[0_10px_30px_rgba(0,0,0,0.03)] border border-emerald-500/5 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_15px_35px_rgba(16,185,129,0.1)]">
              <div className="w-[55px] h-[55px] bg-gradient-to-br from-emerald-500/10 to-emerald-500/20 text-emerald-500 rounded-2xl flex flex-shrink-0 items-center justify-center text-[1.4rem]">
                <FiPhone />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-800 mb-1">Call Us</h3>
                <p className="text-slate-600 leading-relaxed">+91 9876543210<br/>Mon-Fri from 8am to 8pm</p>
              </div>
            </div>

            <div className="flex items-start gap-6 bg-white p-6 rounded-[20px] shadow-[0_10px_30px_rgba(0,0,0,0.03)] border border-emerald-500/5 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_15px_35px_rgba(16,185,129,0.1)]">
              <div className="w-[55px] h-[55px] bg-gradient-to-br from-emerald-500/10 to-emerald-500/20 text-emerald-500 rounded-2xl flex flex-shrink-0 items-center justify-center text-[1.4rem]">
                <FiMail />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-800 mb-1">Email Us</h3>
                <p className="text-slate-600 leading-relaxed">support@freshbasket.com<br/>partnerships@freshbasket.com</p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="flex-1">
          <form className="bg-white/85 backdrop-blur-[16px] p-8 md:p-12 rounded-[24px] shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-white" onSubmit={handleSubmit}>
            <div className="mb-10">
              <h2 className="text-[2rem] font-extrabold text-slate-800 mb-2">Send us a Message</h2>
              <div className="w-[60px] h-1 bg-emerald-500 rounded-full"></div>
            </div>
            
            <div className="flex flex-col md:flex-row gap-6 mb-6">
              <div className="flex flex-col gap-2 flex-1 relative group">
                <label className="text-[0.95rem] font-bold text-slate-800 ml-1">Full Name</label>
                <div className="relative flex items-center bg-white rounded-2xl border border-black/10 transition-all duration-300 overflow-hidden focus-within:border-emerald-500 focus-within:shadow-[0_0_0_4px_rgba(16,185,129,0.1)] focus-within:-translate-y-0.5">
                  <FiUser className="absolute left-5 text-slate-500 text-lg transition-colors duration-300 group-focus-within:text-emerald-500" />
                  <input 
                    type="text" 
                    placeholder="John Doe" 
                    required
                    className="w-full p-[1.2rem] pl-[3.2rem] border-none bg-transparent font-sans text-base text-slate-800 outline-none font-medium placeholder:text-slate-400 placeholder:font-normal"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                </div>
              </div>
              <div className="flex flex-col gap-2 flex-1 relative group">
                <label className="text-[0.95rem] font-bold text-slate-800 ml-1">Email Address</label>
                <div className="relative flex items-center bg-white rounded-2xl border border-black/10 transition-all duration-300 overflow-hidden focus-within:border-emerald-500 focus-within:shadow-[0_0_0_4px_rgba(16,185,129,0.1)] focus-within:-translate-y-0.5">
                  <FiMail className="absolute left-5 text-slate-500 text-lg transition-colors duration-300 group-focus-within:text-emerald-500" />
                  <input 
                    type="email" 
                    placeholder="mail@example.com" 
                    required
                    className="w-full p-[1.2rem] pl-[3.2rem] border-none bg-transparent font-sans text-base text-slate-800 outline-none font-medium placeholder:text-slate-400 placeholder:font-normal"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2 mb-6 relative group">
              <label className="text-[0.95rem] font-bold text-slate-800 ml-1">Subject</label>
              <div className="relative flex items-center bg-white rounded-2xl border border-black/10 transition-all duration-300 overflow-hidden focus-within:border-emerald-500 focus-within:shadow-[0_0_0_4px_rgba(16,185,129,0.1)] focus-within:-translate-y-0.5">
                <FiBookOpen className="absolute left-5 text-slate-500 text-lg transition-colors duration-300 group-focus-within:text-emerald-500" />
                <input 
                  type="text" 
                  placeholder="How can we help?" 
                  required
                  className="w-full p-[1.2rem] pl-[3.2rem] border-none bg-transparent font-sans text-base text-slate-800 outline-none font-medium placeholder:text-slate-400 placeholder:font-normal"
                  value={formData.subject}
                  onChange={(e) => setFormData({...formData, subject: e.target.value})}
                />
              </div>
            </div>

            <div className="flex flex-col gap-2 mb-6 relative group">
              <label className="text-[0.95rem] font-bold text-slate-800 ml-1">Message</label>
              <div className="relative flex items-start bg-white rounded-2xl border border-black/10 transition-all duration-300 overflow-hidden focus-within:border-emerald-500 focus-within:shadow-[0_0_0_4px_rgba(16,185,129,0.1)] focus-within:-translate-y-0.5">
                <FiMessageSquare className="absolute left-5 top-5 text-slate-500 text-lg transition-colors duration-300 group-focus-within:text-emerald-500" />
                <textarea 
                  rows="5" 
                  placeholder="Tell us everything..." 
                  required
                  className="w-full p-[1.2rem] pl-[3.2rem] min-h-[120px] resize-y border-none bg-transparent font-sans text-base text-slate-800 outline-none font-medium placeholder:text-slate-400 placeholder:font-normal"
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                ></textarea>
              </div>
            </div>

            <button type="submit" className="w-full p-[1.2rem] text-[1.15rem] font-bold rounded-2xl flex justify-center items-center gap-3 mt-4 text-white bg-emerald-500 hover:bg-emerald-600 shadow-[0_10px_20px_rgba(16,185,129,0.2)] transition-all duration-300 ease-[cubic-bezier(0.175,0.885,0.32,1.275)] disabled:opacity-70 disabled:cursor-not-allowed hover:not-disabled:-translate-y-[5px] hover:not-disabled:shadow-[0_15px_30px_rgba(16,185,129,0.3)] border-none outline-none cursor-pointer" disabled={isSending}>
              {isSending ? 'Sending securely...' : <>Shoot Message <FiSend /></>}
            </button>
          </form>
        </div>

      </div>
    </div>
  );
};

export default Contact;
