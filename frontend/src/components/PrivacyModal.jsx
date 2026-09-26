import React, { useEffect } from 'react';
import { X, ShieldCheck, Lock, FileText, CheckCircle2, AlertCircle, Mail } from 'lucide-react';

export default function PrivacyModal({ isOpen, onClose }) {
  // Close on Escape key press
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="modal-backdrop"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="privacy-modal-title"
    >
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '780px', maxHeight: '88vh', overflowY: 'auto' }}
      >
        <button className="modal-close-btn" onClick={onClose} aria-label="Close Privacy Notice">
          <X size={20} />
        </button>

        <div style={{ padding: '36px 32px' }}>
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: '12px',
                background: 'rgba(0, 102, 255, 0.12)',
                border: '1px solid rgba(0, 102, 255, 0.25)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#0066FF',
              }}
            >
              <ShieldCheck size={24} />
            </div>
            <div>
              <h2 id="privacy-modal-title" style={{ fontSize: '1.4rem', fontWeight: 800, margin: 0, color: '#FFFFFF' }}>
                Digital Personal Data Protection Notice
              </h2>
              <span style={{ fontSize: '0.8rem', color: '#94A3B8' }}>
                Aligned with DPDP Act, 2023 &amp; DPDP Rules, 2025 · Notice Version 1.0
              </span>
            </div>
          </div>

          <div style={{ color: '#CBD5E1', fontSize: '0.92rem', lineHeight: 1.65 }}>
            <p style={{ marginTop: 0 }}>
              This privacy notice provides clear, transparent information about how personal data is collected,
              processed, and protected when you submit a consultation request or interact with Roshan Damor's creative portfolio.
            </p>

            {/* 1. Data Fiduciary Identity */}
            <div style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: 10, padding: 16, marginBottom: 16 }}>
              <strong style={{ color: '#FFFFFF', display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                <Lock size={16} style={{ color: '#0066FF' }} /> 1. Data Fiduciary Details
              </strong>
              <div><strong>Name:</strong> Roshan Damor (Graphic Designer &amp; Creative Director)</div>
              <div><strong>Location:</strong> Bhopal, Madhya Pradesh, India</div>
              <div><strong>Official Privacy Contact:</strong> <a href="mailto:mail@logicbyroshan.in" style={{ color: '#0066FF' }}>mail@logicbyroshan.in</a></div>
            </div>

            {/* 2. Itemised Personal Data & Specified Purpose */}
            <div style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: 10, padding: 16, marginBottom: 16 }}>
              <strong style={{ color: '#FFFFFF', display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                <FileText size={16} style={{ color: '#0066FF' }} /> 2. Itemised Data &amp; Purpose Specification
              </strong>
              <ul style={{ margin: '8px 0 0 0', paddingLeft: 20 }}>
                <li><strong>Full Name:</strong> To address you personally in consultation replies.</li>
                <li><strong>Email Address:</strong> To deliver design proposals, scope discussions, and call scheduling confirmations.</li>
                <li><strong>Phone Number (Optional):</strong> For direct WhatsApp / telephonic project inquiries if requested by you.</li>
                <li><strong>Project Details &amp; Budget:</strong> To evaluate creative requirements, timelines, and technical feasibility.</li>
              </ul>
              <div style={{ marginTop: 10, fontSize: '0.85rem', color: '#94A3B8' }}>
                <em>Lawful Basis:</em> Free, specific, informed, and unambiguous consent under Section 6 of the DPDP Act, 2023.
              </div>
            </div>

            {/* 3. Data Retention & Purpose Limitation */}
            <div style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: 10, padding: 16, marginBottom: 16 }}>
              <strong style={{ color: '#FFFFFF', display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                <CheckCircle2 size={16} style={{ color: '#10B981' }} /> 3. Data Retention &amp; Automated Purge Policy
              </strong>
              <p style={{ margin: '6px 0 0 0' }}>
                Personal data collected through consultation forms is retained for a maximum of <strong>180 days</strong> from the date of submission to facilitate ongoing project discussions. Expired records are permanently purged from the database in compliance with Section 8(7) of the DPDP Act.
              </p>
            </div>

            {/* 4. Data Principal Rights */}
            <div style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: 10, padding: 16, marginBottom: 16 }}>
              <strong style={{ color: '#FFFFFF', display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                <ShieldCheck size={16} style={{ color: '#0066FF' }} /> 4. Your Rights under the DPDP Act, 2023
              </strong>
              <ul style={{ margin: '8px 0 0 0', paddingLeft: 20 }}>
                <li><strong>Right to Access (Section 11):</strong> Request a summary of your personal data processed.</li>
                <li><strong>Right to Correction &amp; Updating (Section 12):</strong> Request correction or updating of inaccurate personal data.</li>
                <li><strong>Right to Erasure / Deletion (Section 12):</strong> Request immediate permanent deletion of your inquiry record.</li>
                <li><strong>Right of Grievance Redressal (Section 13):</strong> Submit any privacy concern for resolution within 30 days.</li>
                <li><strong>Right to Nominate (Section 14):</strong> Nominate an individual to exercise your rights in the event of incapacity.</li>
              </ul>
            </div>

            {/* 5. Zero Third-Party Sharing / No Trackers */}
            <div style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: 10, padding: 16, marginBottom: 16 }}>
              <strong style={{ color: '#FFFFFF', display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                <AlertCircle size={16} style={{ color: '#38BDF8' }} /> 5. Zero Third-Party Trackers or Data Sharing
              </strong>
              <p style={{ margin: '6px 0 0 0' }}>
                This website does NOT use third-party advertising cookies, behavioural trackers, or tracking pixels. Your data is stored securely in India and is never sold, shared, or transferred to third parties.
              </p>
            </div>

            {/* 6. Grievance Redressal & Contact Channel */}
            <div style={{ background: 'rgba(0, 102, 255, 0.08)', border: '1px solid rgba(0, 102, 255, 0.25)', borderRadius: 10, padding: 16 }}>
              <strong style={{ color: '#FFFFFF', display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                <Mail size={16} style={{ color: '#0066FF' }} /> 6. Grievance Redressal Officer
              </strong>
              <p style={{ margin: '4px 0 8px 0', fontSize: '0.88rem' }}>
                To exercise any Data Principal right, request data erasure, or submit a privacy grievance, please email:
              </p>
              <a
                href="mailto:mail@logicbyroshan.in?subject=DPDP%20Privacy%20Request%20-%20Roshan%20Damor%20Portfolio"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  color: '#FFFFFF',
                  background: '#0066FF',
                  padding: '8px 14px',
                  borderRadius: 6,
                  textDecoration: 'none',
                  fontWeight: 700,
                  fontSize: '0.86rem',
                }}
              >
                <Mail size={14} /> Contact Privacy Officer: mail@logicbyroshan.in
              </a>
              <div style={{ marginTop: 8, fontSize: '0.78rem', color: '#94A3B8' }}>
                Guaranteed grievance resolution within 30 days (statutory timeline: 90 days under DPDP Rules).
              </div>
            </div>
          </div>

          {/* Close Button */}
          <div style={{ marginTop: 24, textAlign: 'right' }}>
            <button className="btn btn-primary" onClick={onClose}>
              Acknowledge &amp; Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
