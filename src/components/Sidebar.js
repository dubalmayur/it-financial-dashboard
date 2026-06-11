import React from 'react';
import { useTheme } from '../context/ThemeContext';

const navItems = [
  { id: 'executive', icon: '▣', label: 'Executive Summary' },
  { id: 'revenue', icon: '📈', label: 'Revenue Analysis' },
  { id: 'profitability', icon: '💹', label: 'Profitability' },
  { id: 'employees', icon: '👥', label: 'Employee Analytics' },
  { id: 'verticals', icon: '🏢', label: 'Business Verticals' },
  { id: 'geography', icon: '🌍', label: 'Geography' },
  { id: 'clients', icon: '🤝', label: 'Client Metrics' },
  { id: 'comparison', icon: '⚖️', label: 'Company Comparison' },
  { id: 'ai', icon: '🤖', label: 'AI Insights' },
  { id: 'upload', icon: '📤', label: 'Data Upload' },
];

export default function Sidebar({ activePage, setActivePage, isOpen }) {
  const { darkMode } = useTheme();

  const sidebarStyle = {
    position: 'fixed', left: 0, top: 0, bottom: 0,
    width: '240px',
    background: darkMode ? '#0d1526' : '#1a2235',
    borderRight: `1px solid ${darkMode ? '#1e2d47' : '#253451'}`,
    display: 'flex', flexDirection: 'column',
    transform: isOpen ? 'translateX(0)' : 'translateX(-100%)',
    transition: 'transform 0.2s ease',
    zIndex: 100,
    overflowY: 'auto',
  };

  return (
    <div style={sidebarStyle}>
      {/* Logo */}
      <div style={{ padding: '20px 16px 16px', borderBottom: '1px solid #1e2d47' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 36, height: 36, background: 'linear-gradient(135deg,#3b82f6,#8b5cf6)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>₹</div>
          <div>
            <div style={{ color: '#e8edf5', fontSize: 13, fontWeight: 700, lineHeight: 1.2 }}>IT Financial</div>
            <div style={{ color: '#4a5a73', fontSize: 11, fontWeight: 500 }}>Insights Dashboard</div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '12px 8px' }}>
        <div style={{ fontSize: 10, fontWeight: 700, color: '#4a5a73', textTransform: 'uppercase', letterSpacing: '0.08em', padding: '4px 8px 8px' }}>Navigation</div>
        {navItems.map(item => (
          <button
            key={item.id}
            onClick={() => setActivePage(item.id)}
            style={{
              width: '100%', display: 'flex', alignItems: 'center', gap: 10,
              padding: '9px 12px', borderRadius: 6, border: 'none', cursor: 'pointer',
              background: activePage === item.id ? 'rgba(59,130,246,0.15)' : 'transparent',
              color: activePage === item.id ? '#60a5fa' : '#8a9bb5',
              fontSize: 13, fontWeight: activePage === item.id ? 600 : 400,
              textAlign: 'left', marginBottom: 2,
              transition: 'all 0.15s',
              borderLeft: activePage === item.id ? '2px solid #3b82f6' : '2px solid transparent',
            }}
            onMouseEnter={e => { if (activePage !== item.id) { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.color = '#e8edf5'; } }}
            onMouseLeave={e => { if (activePage !== item.id) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#8a9bb5'; } }}
          >
            <span style={{ fontSize: 15, width: 20, textAlign: 'center' }}>{item.icon}</span>
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      {/* Footer */}
      <div style={{ padding: '12px 16px', borderTop: '1px solid #1e2d47', fontSize: 11, color: '#4a5a73' }}>
        <div style={{ marginBottom: 4 }}>IT Financial Insights v1.0</div>
        <div>Data updated: Q4FY25</div>
      </div>
    </div>
  );
}
