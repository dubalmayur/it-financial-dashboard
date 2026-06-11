'use client';
import { useState } from 'react';
import { QUARTERS, Quarter } from '@/lib/data';

interface HeaderProps {
  title?: string;
  quarter: Quarter;
  onQuarterChange: (q: Quarter) => void;
  currency: string;
  onCurrencyToggle: () => void;
}

export default function Header({ title, quarter, onQuarterChange, currency, onCurrencyToggle }: HeaderProps) {
  const [search, setSearch] = useState('');
  return (
    <header className="app-header">
      <div className="header-left">
        <h1 className="header-title">{title || 'Indian IT Sector Intelligence Hub'}</h1>
        <span className="header-badge">Institutional Research Platform</span>
      </div>
      <div className="header-controls">
        <input className="search-input" placeholder="Search companies, metrics..." value={search} onChange={e => setSearch(e.target.value)} />
        <select className="quarter-select" value={quarter} onChange={e => onQuarterChange(e.target.value as Quarter)}>
          {QUARTERS.map(q => <option key={q} value={q}>{q}</option>)}
        </select>
        <button className="currency-toggle" onClick={onCurrencyToggle}>
          {currency === 'USD' ? '$ USD' : '₹ INR'}
        </button>
        <div className="header-time">
          <span className="live-dot" />
          Q4FY25 | Live
        </div>
      </div>
    </header>
  );
}
