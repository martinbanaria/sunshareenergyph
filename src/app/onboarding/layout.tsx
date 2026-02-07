import React from 'react';

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div style={{ backgroundColor: 'var(--sunshare-deep)', color: 'var(--sunshare-cream)', minHeight: '100vh' }}>
      <header style={{ padding: '1rem', borderBottom: '1px solid var(--sunshare-lime)' }}>
        <h1>SunShare Onboarding</h1>
      </header>
      <main>{children}</main>
    </div>
  );
};

export default Layout;