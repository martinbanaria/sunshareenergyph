import React from 'react';
import Link from 'next/link';

export default function DashboardPage() {
  return (
    <div style={{
      minHeight: '100vh',
      background: '#00242E', // sunshare-deep
      color: '#F3F6E4', // sunshare-cream
      fontFamily: 'sans-serif',
      padding: '1.5rem'
    }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#D1EB0C' }}>SunShare</h1>
        <div style={{ width: '32px', height: '32px', background: 'rgba(255,255,255,0.2)', borderRadius: '50%' }} />
      </div>

      <h2 style={{ fontSize: '1.75rem', fontWeight: 600, marginBottom: '1.5rem' }}>
        Good evening, Juan.
      </h2>

      {/* Status Card */}
      <div style={{
        padding: '1.5rem',
        borderRadius: '1rem',
        background: 'rgba(255, 255, 255, 0.06)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(12px)',
        marginBottom: '2rem'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <span style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px', opacity: 0.7 }}>Application Status</span>
          <span style={{ 
            background: 'rgba(209, 235, 12, 0.2)', 
            color: '#D1EB0C', 
            padding: '0.25rem 0.75rem', 
            borderRadius: '1rem', 
            fontSize: '0.75rem', 
            fontWeight: 600 
          }}>
            UNDER REVIEW
          </span>
        </div>
        <p style={{ fontSize: '1.1rem', marginBottom: '0.5rem', fontWeight: 500 }}>
          We are verifying your ID and property details.
        </p>
        <p style={{ fontSize: '0.9rem', opacity: 0.6 }}>
          Estimated time: 24-48 hours. We will notify you via email.
        </p>
      </div>

      {/* Learning Hub */}
      <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem' }}>
        While you wait...
      </h3>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1rem' }}>
        {/* Video 1 */}
        <div style={{
          background: 'rgba(0,0,0,0.3)',
          borderRadius: '0.75rem',
          overflow: 'hidden',
          border: '1px solid rgba(255,255,255,0.1)'
        }}>
          <div style={{ aspectRatio: '16/9', background: 'black', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontSize: '2rem' }}>▶️</span>
          </div>
          <div style={{ padding: '1rem' }}>
            <div style={{ fontWeight: 600, marginBottom: '0.25rem' }}>Understanding Your Bill</div>
            <div style={{ fontSize: '0.8rem', opacity: 0.7 }}>How solar savings appear on your statement.</div>
          </div>
        </div>

        {/* Video 2 */}
        <div style={{
          background: 'rgba(0,0,0,0.3)',
          borderRadius: '0.75rem',
          overflow: 'hidden',
          border: '1px solid rgba(255,255,255,0.1)'
        }}>
          <div style={{ aspectRatio: '16/9', background: 'black', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontSize: '2rem' }}>▶️</span>
          </div>
          <div style={{ padding: '1rem' }}>
            <div style={{ fontWeight: 600, marginBottom: '0.25rem' }}>Solar 101</div>
            <div style={{ fontSize: '0.8rem', opacity: 0.7 }}>Basics of rooftop generation.</div>
          </div>
        </div>
      </div>
    </div>
  );
}
