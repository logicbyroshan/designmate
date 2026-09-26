import React, { useState, useEffect } from 'react';
import { X, Mail, CheckCircle, Send } from 'lucide-react';
import confetti from 'canvas-confetti';
import { API_ENDPOINTS } from '../config/api';

export default function CallBookingModal({ isOpen, onClose, onOpenPrivacy }) {
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    project_type: 'Brand Identity & Logos',
    budget: 'Flexible',
    preferred_date: '',
    message: '',
    consent_given: false,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Handle Escape key to close modal
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData(prev => ({
      ...prev,
      [e.target.name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.consent_given) {
      setErrorMessage('Please consent to the processing of your contact details under the DPDP Act, 2023 to submit this inquiry.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const payload = {
        ...formData,
        consent_given: true,
        consent_notice_version: '1.0',
        consent_purpose: 'Consultation & Project Inquiry Communication',
      };

      const response = await fetch(API_ENDPOINTS.bookings, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        let errMsg = 'Failed to submit message.';
        try {
          const errData = await response.json();
          if (typeof errData === 'object') {
            const firstKey = Object.keys(errData)[0];
            const firstVal = Array.isArray(errData[firstKey]) ? errData[firstKey][0] : errData[firstKey];
            errMsg = `${firstKey}: ${firstVal}`;
          }
        } catch {
          // fallback
        }
        throw new Error(errMsg);
      }

      setIsSubmitted(true);
      
      // Trigger festive celebration confetti
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });

    } catch (err) {
      console.error('Contact submission error:', err);
      setErrorMessage(err.message || 'Could not connect to Django backend. You can also email directly at mail@logicbyroshan.in');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="booking-modal-title">
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">
          <X size={20} />
        </button>

        <div style={{ padding: '36px 32px' }}>
          {isSubmitted ? (
            <div style={{ textAlign: 'center', padding: '24px 0' }}>
              <div
                style={{
                  width: 70,
                  height: 70,
                  borderRadius: '50%',
                  background: '#ECFDF5',
                  color: '#10B981',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 20px',
                }}
              >
                <CheckCircle size={40} />
              </div>

              <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0F172A', marginBottom: 12 }}>
                Message Sent Successfully!
              </h2>

              <p style={{ color: '#475569', fontSize: '1.05rem', lineHeight: 1.6, maxWidth: 460, margin: '0 auto 24px' }}>
                Thank you, <strong>{formData.full_name}</strong>! Roshan Damor has received your inquiry and will get back to you at <strong>{formData.email}</strong> shortly.
              </p>

              <button
                onClick={onClose}
                style={{
                  padding: '12px 28px',
                  background: '#0066FF',
                  color: '#FFFFFF',
                  fontWeight: 700,
                  borderRadius: 10,
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '0.95rem',
                }}
              >
                Back to Portfolio
              </button>
            </div>
          ) : (
            <>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 'var(--radius-sm)',
                    background: 'var(--color-primary-subtle)',
                    color: 'var(--color-primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Mail size={22} />
                </div>
                <div>
                  <h2 id="booking-modal-title" style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1.2 }}>
                    Contact Roshan Damor
                  </h2>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>
                    Send a direct message or email at <a href="mailto:mail@logicbyroshan.in" style={{ color: 'var(--color-primary)', fontWeight: 700 }}>mail@logicbyroshan.in</a>
                  </p>
                </div>
              </div>

              {errorMessage && (
                <div style={{ background: '#FEF2F2', border: '1px solid #F87171', color: '#991B1B', padding: '10px 14px', borderRadius: 'var(--radius-sm)', fontSize: '0.88rem', margin: '16px 0' }}>
                  {errorMessage}
                </div>
              )}

              <form onSubmit={handleSubmit} style={{ marginTop: 20, display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                  <div className="form-group">
                    <label className="form-label">
                      Your Name <span className="form-label-required">*</span>
                    </label>
                    <input
                      type="text"
                      name="full_name"
                      required
                      className="form-input"
                      value={formData.full_name}
                      onChange={handleChange}
                      placeholder="Jane Doe"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">
                      Your Email <span className="form-label-required">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      className="form-input"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="jane@company.com"
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                  <div className="form-group">
                    <label className="form-label">
                      Phone / WhatsApp
                    </label>
                    <input
                      type="text"
                      name="phone"
                      className="form-input"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+91 98765 43210"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">
                      Design Discipline / Service
                    </label>
                    <select
                      name="project_type"
                      className="form-select"
                      value={formData.project_type}
                      onChange={handleChange}
                    >
                      <option value="Brand Identity & Logos">Brand Identity & Logos</option>
                      <option value="ID Cards & Corporate Lanyards">ID Cards & Corporate Lanyards</option>
                      <option value="Print Production & CMYK">Print Production & CMYK Prepress</option>
                      <option value="Social Media Creatives & Ads">Social Media Creatives & Ads</option>
                      <option value="Photo Retouching & Compositing">Photo Retouching & Compositing</option>
                      <option value="Brochures & Editorial Design">Brochures & Editorial Design</option>
                      <option value="Packaging & Label Design">Packaging & Label Design</option>
                      <option value="Other Design Project">Other Design Project</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">
                    Message / Project Details <span className="form-label-required">*</span>
                  </label>
                  <textarea
                    name="message"
                    required
                    rows={3}
                    className="form-textarea"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Tell Roshan about your project timeline, requirements, or vision..."
                  />
                </div>

                {/* DPDP Act 2023 Explicit Consent Checkbox */}
                <div
                  style={{
                    background: 'var(--bg-subtle)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-sm)',
                    padding: '12px 14px',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 10,
                  }}
                >
                  <input
                    type="checkbox"
                    id="consent_given_checkbox"
                    name="consent_given"
                    required
                    checked={formData.consent_given}
                    onChange={handleChange}
                    style={{
                      marginTop: 3,
                      cursor: 'pointer',
                      accentColor: 'var(--color-primary)',
                      width: 16,
                      height: 16,
                    }}
                  />
                  <label
                    htmlFor="consent_given_checkbox"
                    style={{
                      fontSize: '0.82rem',
                      color: 'var(--text-secondary)',
                      lineHeight: 1.45,
                      cursor: 'pointer',
                    }}
                  >
                    I consent to the processing of my contact information strictly to respond to this consultation inquiry in accordance with the{' '}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        if (onOpenPrivacy) onOpenPrivacy();
                      }}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: 'var(--color-primary)',
                        padding: 0,
                        fontWeight: 700,
                        textDecoration: 'underline',
                        cursor: 'pointer',
                        fontSize: '0.82rem',
                        display: 'inline',
                      }}
                    >
                      DPDP Privacy Notice
                    </button>
                    . (Retained for 180 days · Zero third-party sharing).
                  </label>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 10, flexWrap: 'wrap', gap: 12 }}>
                  <a
                    href="mailto:mail@logicbyroshan.in"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 6,
                      color: 'var(--color-primary)',
                      fontSize: '0.88rem',
                      fontWeight: 700,
                      textDecoration: 'none',
                    }}
                  >
                    <Mail size={16} /> Open in Email App
                  </a>

                  <div style={{ display: 'flex', gap: 10 }}>
                    <button
                      type="button"
                      onClick={onClose}
                      className="btn btn-secondary btn-md"
                    >
                      Cancel
                    </button>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="btn btn-primary btn-md"
                    >
                      <Send size={16} />
                      {isSubmitting ? 'Sending...' : 'Send Message'}
                    </button>
                  </div>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
