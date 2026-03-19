'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

// ─── Styles ──────────────────────────────────────────────────────────────────

const cardStyle: React.CSSProperties = {
  padding: '1.25rem',
  borderRadius: '0.75rem',
  background: 'rgba(255, 255, 255, 0.06)',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  backdropFilter: 'blur(12px)',
};

const sectionHeader: React.CSSProperties = {
  fontSize: '0.7rem',
  fontWeight: 600,
  textTransform: 'uppercase',
  letterSpacing: '0.1em',
  color: '#D1EB0C',
  marginBottom: '0.75rem',
};

const metricCard = (accentColor: string): React.CSSProperties => ({
  ...cardStyle,
  borderLeft: `3px solid ${accentColor}`,
});

// ─── Animated Counter ────────────────────────────────────────────────────────

const AnimatedMetric = ({ target, prefix = '', suffix = '' }: { target: number; prefix?: string; suffix?: string }) => {
  const [current, setCurrent] = useState(0);
  useEffect(() => {
    const start = Date.now();
    const dur = 1200;
    const tick = () => {
      const elapsed = Date.now() - start;
      const progress = Math.min(elapsed / dur, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCurrent(Math.round(target * eased));
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [target]);

  const formatted = current >= 1000000
    ? `${(current / 1000000).toFixed(1)}M`
    : current.toLocaleString();
  return <>{prefix}{formatted}{suffix}</>;
};

// ─── Timeline Step ───────────────────────────────────────────────────────────

type TimelineStatus = 'completed' | 'active' | 'upcoming';

const TimelineStep = ({
  step,
  title,
  description,
  date,
  status,
  isLast,
}: {
  step: number;
  title: string;
  description: string;
  date: string;
  status: TimelineStatus;
  isLast: boolean;
}) => (
  <div style={{ display: 'flex', gap: '1rem', position: 'relative' }}>
    {/* Vertical line */}
    {!isLast && (
      <div style={{
        position: 'absolute',
        left: '15px',
        top: '32px',
        bottom: '-8px',
        width: '2px',
        background: status === 'completed' ? 'rgba(209, 235, 12, 0.3)' : 'rgba(255,255,255,0.08)',
      }} />
    )}
    {/* Circle */}
    <div style={{
      width: '32px',
      height: '32px',
      minWidth: '32px',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '0.75rem',
      fontWeight: 700,
      background: status === 'completed'
        ? '#D1EB0C'
        : status === 'active'
          ? 'rgba(209, 235, 12, 0.2)'
          : 'rgba(255,255,255,0.08)',
      color: status === 'completed' ? '#00242E' : status === 'active' ? '#D1EB0C' : 'rgba(255,255,255,0.4)',
      border: status === 'active' ? '2px solid #D1EB0C' : 'none',
    }}>
      {status === 'completed' ? (
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path d="M3 7L6 10L11 4" stroke="#00242E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ) : step}
    </div>
    {/* Content */}
    <div style={{ paddingBottom: isLast ? 0 : '1.5rem', flex: 1 }}>
      <div style={{
        fontWeight: 600,
        fontSize: '0.95rem',
        marginBottom: '0.15rem',
        color: status === 'upcoming' ? 'rgba(255,255,255,0.4)' : 'white',
      }}>
        {title}
      </div>
      <div style={{ fontSize: '0.8rem', opacity: 0.5, marginBottom: '0.15rem' }}>{description}</div>
      <div style={{ fontSize: '0.75rem', color: status === 'active' ? '#D1EB0C' : 'rgba(255,255,255,0.3)' }}>{date}</div>
    </div>
  </div>
);

// ─── Main Dashboard ──────────────────────────────────────────────────────────

export default function CIDashboardPage() {
  return (
    <div style={{
      minHeight: '100vh',
      background: '#00242E',
      color: '#F3F6E4',
      padding: '1.5rem',
      maxWidth: '800px',
      margin: '0 auto',
    }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
        <div>
          <div style={{ fontSize: '0.75rem', opacity: 0.5, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            SunShare C&I Portal
          </div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 600 }}>
            Welcome back.
          </h1>
        </div>
        <Link href="/" style={{
          padding: '0.5rem 1rem',
          borderRadius: '0.5rem',
          background: 'rgba(255,255,255,0.08)',
          border: '1px solid rgba(255,255,255,0.1)',
          color: 'white',
          fontSize: '0.8rem',
          textDecoration: 'none',
        }}>
          Home
        </Link>
      </div>
      <p style={{ opacity: 0.5, fontSize: '0.85rem', marginBottom: '2rem' }}>
        Pacific Star Manufacturing Corp. &mdash; Main Plant, Laguna Technopark
      </p>

      {/* ── Status Banner ── */}
      <div style={{
        ...cardStyle,
        background: 'rgba(209, 235, 12, 0.06)',
        border: '1px solid rgba(209, 235, 12, 0.2)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '1.5rem',
        flexWrap: 'wrap',
        gap: '0.75rem',
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
            <div style={{
              width: '8px', height: '8px', borderRadius: '50%',
              background: '#D1EB0C',
              boxShadow: '0 0 8px rgba(209, 235, 12, 0.5)',
              animation: 'pulse 2s infinite',
            }} />
            <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>Energy Audit Scheduled</span>
          </div>
          <div style={{ fontSize: '0.8rem', opacity: 0.6 }}>
            Your SunShare energy advisor will contact you shortly
          </div>
        </div>
        <div style={{
          padding: '0.4rem 0.75rem',
          borderRadius: '2rem',
          background: 'rgba(209, 235, 12, 0.15)',
          color: '#D1EB0C',
          fontSize: '0.75rem',
          fontWeight: 600,
        }}>
          IN PROGRESS
        </div>
      </div>

      {/* ── Savings Overview ── */}
      <div style={sectionHeader}>Estimated Savings</div>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
        gap: '0.75rem',
        marginBottom: '1.5rem',
      }}>
        <div style={metricCard('#D1EB0C')}>
          <div style={{ fontSize: '0.75rem', opacity: 0.5, marginBottom: '0.5rem' }}>Monthly Savings</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#D1EB0C' }}>
            <AnimatedMetric target={180000} prefix="₱" />
          </div>
          <div style={{ fontSize: '0.7rem', opacity: 0.4 }}>to ₱270,000</div>
        </div>

        <div style={metricCard('#20B2AA')}>
          <div style={{ fontSize: '0.75rem', opacity: 0.5, marginBottom: '0.5rem' }}>Annual Projection</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#20B2AA' }}>
            <AnimatedMetric target={3200000} prefix="₱" />
          </div>
          <div style={{ fontSize: '0.7rem', opacity: 0.4 }}>estimated per year</div>
        </div>

        <div style={metricCard('rgba(255,255,255,0.3)')}>
          <div style={{ fontSize: '0.75rem', opacity: 0.5, marginBottom: '0.5rem' }}>vs. Current Provider</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>
            <AnimatedMetric target={14} suffix="%" />
          </div>
          <div style={{ fontSize: '0.7rem', opacity: 0.4 }}>avg. RCOA savings</div>
        </div>
      </div>

      {/* ── Solutions Matched ── */}
      <div style={sectionHeader}>Your SunShare Solutions</div>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '0.75rem',
        marginBottom: '1.5rem',
      }}>
        {[
          { name: 'Retail Supply (PSA)', status: 'Pending audit', icon: '⚡', savings: '₱84K–₱126K/mo', color: '#D1EB0C' },
          { name: 'PF Correction', status: 'Pending audit', icon: '🔧', savings: '₱30K–₱45K/mo', color: '#20B2AA' },
          { name: 'Smappee Monitoring', status: 'To be deployed', icon: '📊', savings: '₱18K–₱27K/mo', color: '#D1EB0C' },
          { name: 'Embedded Solar', status: 'Roof assessment needed', icon: '☀️', savings: '₱48K–₱72K/mo', color: '#20B2AA' },
        ].map((solution) => (
          <div key={solution.name} style={{
            ...cardStyle,
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div style={{ fontSize: '1.25rem', marginBottom: '0.25rem' }}>{solution.icon}</div>
                <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{solution.name}</div>
              </div>
              <div style={{
                padding: '0.2rem 0.5rem',
                borderRadius: '0.25rem',
                background: 'rgba(255,255,255,0.05)',
                fontSize: '0.65rem',
                opacity: 0.5,
              }}>
                {solution.status}
              </div>
            </div>
            <div style={{ fontSize: '0.85rem', color: solution.color, fontWeight: 600 }}>
              {solution.savings}
            </div>
          </div>
        ))}
      </div>

      {/* ── Onboarding Timeline ── */}
      <div style={sectionHeader}>Your Journey</div>
      <div style={{ ...cardStyle, marginBottom: '1.5rem' }}>
        <TimelineStep
          step={1}
          title="Audit Requested"
          description="You submitted your free energy audit request"
          date="Completed today"
          status="completed"
          isLast={false}
        />
        <TimelineStep
          step={2}
          title="Advisor Contact"
          description="A SunShare energy advisor will reach out to schedule"
          date="Within 24 hours"
          status="active"
          isLast={false}
        />
        <TimelineStep
          step={3}
          title="On-Site Energy Audit"
          description="Smappee monitoring deployed, 30-day baseline measurement"
          date="To be scheduled"
          status="upcoming"
          isLast={false}
        />
        <TimelineStep
          step={4}
          title="Efficiency Diagnosis"
          description="Detailed report with exact savings, PF correction sizing, solar design"
          date="After baseline period"
          status="upcoming"
          isLast={false}
        />
        <TimelineStep
          step={5}
          title="PSA Signing"
          description="Power Supply Agreement execution — start saving immediately"
          date="Pending"
          status="upcoming"
          isLast={true}
        />
      </div>

      {/* ── Facility Details ── */}
      <div style={sectionHeader}>Facility Overview</div>
      <div style={{ ...cardStyle, marginBottom: '1.5rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', fontSize: '0.85rem' }}>
          <div>
            <div style={{ opacity: 0.5, fontSize: '0.75rem', marginBottom: '0.15rem' }}>Facility</div>
            <div style={{ fontWeight: 500 }}>Main Plant — Laguna Technopark</div>
          </div>
          <div>
            <div style={{ opacity: 0.5, fontSize: '0.75rem', marginBottom: '0.15rem' }}>Industry</div>
            <div style={{ fontWeight: 500 }}>Manufacturing & Industrial</div>
          </div>
          <div>
            <div style={{ opacity: 0.5, fontSize: '0.75rem', marginBottom: '0.15rem' }}>Current Provider</div>
            <div style={{ fontWeight: 500 }}>Meralco</div>
          </div>
          <div>
            <div style={{ opacity: 0.5, fontSize: '0.75rem', marginBottom: '0.15rem' }}>Monthly Spend</div>
            <div style={{ fontWeight: 500 }}>₱500K – ₱1M</div>
          </div>
          <div>
            <div style={{ opacity: 0.5, fontSize: '0.75rem', marginBottom: '0.15rem' }}>Operating Hours</div>
            <div style={{ fontWeight: 500 }}>24/7</div>
          </div>
          <div>
            <div style={{ opacity: 0.5, fontSize: '0.75rem', marginBottom: '0.15rem' }}>Rooftop for Solar</div>
            <div style={{ fontWeight: 500, color: '#D1EB0C' }}>Available</div>
          </div>
          <div>
            <div style={{ opacity: 0.5, fontSize: '0.75rem', marginBottom: '0.15rem' }}>Floor Area</div>
            <div style={{ fontWeight: 500 }}>3,500 sqm</div>
          </div>
          <div>
            <div style={{ opacity: 0.5, fontSize: '0.75rem', marginBottom: '0.15rem' }}>Ownership</div>
            <div style={{ fontWeight: 500 }}>Owned</div>
          </div>
        </div>
      </div>

      {/* ── Quick Actions ── */}
      <div style={sectionHeader}>Quick Actions</div>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
        gap: '0.75rem',
        marginBottom: '1.5rem',
      }}>
        <Link href="/onboarding" style={{
          ...cardStyle,
          textDecoration: 'none',
          color: '#F3F6E4',
          textAlign: 'center',
          cursor: 'pointer',
          transition: 'border-color 0.2s',
        }}>
          <div style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>➕</div>
          <div style={{ fontWeight: 500, fontSize: '0.85rem' }}>Add Facility</div>
        </Link>

        <Link href="/contact" style={{
          ...cardStyle,
          textDecoration: 'none',
          color: '#F3F6E4',
          textAlign: 'center',
          cursor: 'pointer',
          transition: 'border-color 0.2s',
        }}>
          <div style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>💬</div>
          <div style={{ fontWeight: 500, fontSize: '0.85rem' }}>Contact Advisor</div>
        </Link>

        <Link href="/how-it-works" style={{
          ...cardStyle,
          textDecoration: 'none',
          color: '#F3F6E4',
          textAlign: 'center',
          cursor: 'pointer',
          transition: 'border-color 0.2s',
        }}>
          <div style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>📖</div>
          <div style={{ fontWeight: 500, fontSize: '0.85rem' }}>Learn More</div>
        </Link>
      </div>

      {/* ── Footer ── */}
      <div style={{
        textAlign: 'center',
        paddingTop: '1.5rem',
        borderTop: '1px solid rgba(255,255,255,0.06)',
        fontSize: '0.75rem',
        opacity: 0.3,
      }}>
        SunShare Philippines Inc. &mdash; C&I Energy Portal
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  );
}
