import React from 'react';
import { Mail, ArrowRight } from 'lucide-react';

export default function FeelingConfusedCTA({ profile, onOpenBooking }) {
  const ctaTitle = profile?.cta_title || "Feeling Confused?";
  const ctaSubtext = profile?.cta_subtext || "I'd love to chat with you about how I can help. Get in touch at";
  const ctaBoldText = profile?.cta_bold_text || "mail@logicbyroshan.in";
  const ctaBtnText = profile?.cta_btn_text || "Contact Me";

  return (
    <section className="cta-section" id="contact">
      <div className="cta-notched-card">
        {/* Top Notch Label */}
        <div className="cta-notched-label">{ctaTitle}</div>

        {/* Text Copy */}
        <div className="cta-text-left">
          {ctaSubtext}{' '}
          <a
            href="mailto:mail@logicbyroshan.in"
            style={{
              color: 'var(--text-main)',
              fontWeight: 800,
              textDecoration: 'underline',
              textUnderlineOffset: 3,
            }}
          >
            {ctaBoldText}
          </a>
        </div>

        {/* Action Button */}
        <button
          className="cta-btn-call"
          onClick={onOpenBooking}
          aria-label="Contact Roshan Damor"
        >
          <Mail size={18} />
          <span>{ctaBtnText}</span>
          <ArrowRight size={16} />
        </button>
      </div>
    </section>
  );
}
