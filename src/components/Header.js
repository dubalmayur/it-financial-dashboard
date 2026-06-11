import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { companies, quarters } from '../data/sampleData';

const pageNames = {
  executive:'Executive Summary', revenue:'Revenue Analysis', profitability:'Profitability Analysis',
  employees:'Employee Analytics', verticals:'Business Verticals', geography:'Geography Analysis',
  clients:'Client Metrics', comparison:'Company Comparison', ai:'AI Insights', upload:'Data Upload',
};

export default function Header({ selectedCompany, setSelectedCompany, selectedQuarter, setSelectedQuarter, sidebarOpen, setSidebarOpen, activePage }) {
  const { darkMode, setDarkMode, currency, setCurrency } = useTheme();

  const sel = {
    background: darkMode ? '#1a2235' : '#ffffff',
    border: `1px solid ${darkMode ? '#1e2d47' : '#e2e8f0'}`,
    color: darkMode ? '#e8edf5' : '#0f172a',
    borderRadius: 6, padding: '7px 12px', fontSize: 13, cursor: 'pointer',
    outline: 'none', fontFamily: 'Inter, sans-serif',
  };

  const currBtnStyle = (val) => ({
    padding: '6px 12px', borderRadius: 6, border: `1px solid ${currency === val ? 'var(--accent)' : (darkMode ? '#1e2d47' : '#e2e8f0')}`,
    background: currency === val ? 'rgba(59,130,246,0.15)' : 'transparent',
    color: currency === val ? '#60a5fa' : (darkMode ? '#8a9bb5' : '#475569'),
    cursor: 'pointer', fontSize: 12, fontWeight: 700, fontFamily: 'JetBrains Mono, monospace',
    transition: 'all 0.15s',
  });

  return (
    <div style={{
      height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0 24px', background: darkMode ? '#111827' : '#ffffff',
      borderBottom: `1px solid ${darkMode ? '#1e2d47' : '#e2e8f0'}`,
      position: 'sticky', top: 0, zIndex: 50, gap: 12,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexShrink: 0 }}>
        <button onClick={() => setSidebarOpen(!sidebarOpen)}
          style={{ background:'none', border:'none', color:darkMode?'#8a9bb5':'#475569', cursor:'pointer', padding:6, borderRadius:6, fontSize:18 }}>
          ☰
        </button>
        <div>
          <div style={{ fontSize: 16, fontWeight: 700, color: darkMode ? '#e8edf5' : '#0f172a' }}>{pageNames[activePage]}</div>
          <div style={{ fontSize: 11, color: darkMode ? '#4a5a73' : '#94a3b8' }}>
            IT Financial Insights Dashboard
            {selectedCompany === 'TCS' && <span style={{marginLeft:8,background:'rgba(16,185,129,0.15)',color:'#10b981',padding:'1px 7px',borderRadius:10,fontSize:10,fontWeight:700}}>★ ACTUAL IR DATA</span>}
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
        {/* Currency toggle */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 2, background: darkMode ? '#1a2235' : '#f8fafc', border: `1px solid ${darkMode ? '#1e2d47' : '#e2e8f0'}`, borderRadius: 8, padding: 3 }}>
          <button onClick={() => setCurrency('inr')}  style={currBtnStyle('inr')}>₹ INR</button>
          <button onClick={() => setCurrency('both')} style={currBtnStyle('both')}>Both</button>
          <button onClick={() => setCurrency('usd')}  style={currBtnStyle('usd')}>$ USD</button>
        </div>

        {activePage !== 'comparison' && activePage !== 'upload' && (
          <>
            <select value={selectedCompany} onChange={e => setSelectedCompany(e.target.value)} style={sel}>
              {companies.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <select value={selectedQuarter} onChange={e => setSelectedQuarter(e.target.value)} style={sel}>
              {quarters.map(q => <option key={q} value={q}>{q}</option>)}
            </select>
          </>
        )}

        <button onClick={() => setDarkMode(!darkMode)}
          style={{ ...sel, padding: '7px 14px', cursor: 'pointer', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6 }}>
          {darkMode ? '☀️ Light' : '🌙 Dark'}
        </button>
      </div>
    </div>
  );
}
