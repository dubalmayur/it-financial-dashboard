import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { companies, quarters } from '../data/sampleData';

const pageNames = {
  executive: 'Executive Summary', revenue: 'Revenue Analysis', profitability: 'Profitability Analysis',
  employees: 'Employee Analytics', verticals: 'Business Verticals', geography: 'Geography Analysis',
  clients: 'Client Metrics', comparison: 'Company Comparison', ai: 'AI Insights', upload: 'Data Upload',
};

export default function Header({ selectedCompany, setSelectedCompany, selectedQuarter, setSelectedQuarter, sidebarOpen, setSidebarOpen, activePage }) {
  const { darkMode, setDarkMode } = useTheme();

  const selectStyle = {
    background: darkMode ? '#1a2235' : '#ffffff',
    border: `1px solid ${darkMode ? '#1e2d47' : '#e2e8f0'}`,
    color: darkMode ? '#e8edf5' : '#0f172a',
    borderRadius: 6, padding: '7px 12px', fontSize: 13, cursor: 'pointer',
    outline: 'none', fontFamily: 'Inter, sans-serif',
  };

  return (
    <div style={{
      height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0 24px', background: darkMode ? '#111827' : '#ffffff',
      borderBottom: `1px solid ${darkMode ? '#1e2d47' : '#e2e8f0'}`,
      position: 'sticky', top: 0, zIndex: 50,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          style={{ background: 'none', border: 'none', color: darkMode ? '#8a9bb5' : '#475569', cursor: 'pointer', padding: 6, borderRadius: 6, fontSize: 18 }}
        >☰</button>
        <div>
          <div style={{ fontSize: 16, fontWeight: 700, color: darkMode ? '#e8edf5' : '#0f172a' }}>{pageNames[activePage]}</div>
          <div style={{ fontSize: 11, color: darkMode ? '#4a5a73' : '#94a3b8' }}>IT Financial Insights Dashboard</div>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        {activePage !== 'comparison' && activePage !== 'upload' && (
          <>
            <select value={selectedCompany} onChange={e => setSelectedCompany(e.target.value)} style={selectStyle}>
              {companies.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <select value={selectedQuarter} onChange={e => setSelectedQuarter(e.target.value)} style={selectStyle}>
              {quarters.map(q => <option key={q} value={q}>{q}</option>)}
            </select>
          </>
        )}
        <button
          onClick={() => setDarkMode(!darkMode)}
          style={{ ...selectStyle, padding: '7px 14px', cursor: 'pointer', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6 }}
        >
          {darkMode ? '☀️ Light' : '🌙 Dark'}
        </button>
      </div>
    </div>
  );
}
