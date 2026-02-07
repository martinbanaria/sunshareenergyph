'use client';
import React, { useState } from 'react';

const Step1Account = ({ onNext }: { onNext: () => void }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div
      style={{
        padding: '2rem',
        borderRadius: '15px',
        background: 'rgba(255, 255, 255, 0.06)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        color: '#F3F6E4', // sunshare-cream
      }}
    >
      <h2 style={{ 
        fontSize: '1.5rem', 
        fontWeight: 600, 
        marginBottom: '1.5rem',
        color: '#D1EB0C' // sunshare-lime
      }}>
        Create Your Account
      </h2>

      <form onSubmit={(e) => { e.preventDefault(); onNext(); }}>
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Full Name</label>
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            style={{
              width: '100%',
              padding: '0.75rem',
              borderRadius: '0.5rem',
              background: 'rgba(0, 36, 46, 0.6)',
              border: '1px solid rgba(255,255,255,0.2)',
              color: 'white',
              fontSize: '1rem'
            }}
            placeholder="Juan dela Cruz"
          />
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Email Address</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            style={{
              width: '100%',
              padding: '0.75rem',
              borderRadius: '0.5rem',
              background: 'rgba(0, 36, 46, 0.6)',
              border: '1px solid rgba(255,255,255,0.2)',
              color: 'white',
              fontSize: '1rem'
            }}
            placeholder="juan@example.com"
          />
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Mobile Phone</label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            style={{
              width: '100%',
              padding: '0.75rem',
              borderRadius: '0.5rem',
              background: 'rgba(0, 36, 46, 0.6)',
              border: '1px solid rgba(255,255,255,0.2)',
              color: 'white',
              fontSize: '1rem'
            }}
            placeholder="0917 123 4567"
          />
        </div>

        <div style={{ marginBottom: '2rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            style={{
              width: '100%',
              padding: '0.75rem',
              borderRadius: '0.5rem',
              background: 'rgba(0, 36, 46, 0.6)',
              border: '1px solid rgba(255,255,255,0.2)',
              color: 'white',
              fontSize: '1rem'
            }}
            placeholder="••••••••"
          />
        </div>

        <button 
          type="submit"
          style={{
            width: '100%',
            padding: '0.75rem',
            borderRadius: '0.5rem',
            background: '#D1EB0C',
            border: 'none',
            color: '#00242E',
            fontWeight: 600,
            fontSize: '1rem',
            cursor: 'pointer'
          }}
        >
          Start Registration
        </button>
      </form>
    </div>
  );
};

export default Step1Account;
