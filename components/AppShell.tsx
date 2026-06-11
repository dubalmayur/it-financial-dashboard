'use client';
import { useState } from 'react';
import Sidebar from './ui/Sidebar';
import Header from './ui/Header';
import { Quarter, LATEST_QUARTER } from '@/lib/data';

export default function AppShell({ children, title }: { children: React.ReactNode; title?: string }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [quarter, setQuarter] = useState<Quarter>(LATEST_QUARTER);
  const [currency, setCurrency] = useState('USD');
  return (
    <div className="app-shell">
      <Sidebar open={sidebarOpen} onToggle={() => setSidebarOpen(o => !o)} />
      <div className="main-area">
        <Header title={title} quarter={quarter} onQuarterChange={setQuarter} currency={currency} onCurrencyToggle={() => setCurrency(c => c === 'USD' ? 'INR' : 'USD')} />
        <div className="page-content fade-in">{children}</div>
      </div>
    </div>
  );
}
