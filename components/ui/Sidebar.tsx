'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';

const NAV = [
  { section: 'SECTOR INTELLIGENCE', items: [
    { href: '/', label: '01 Executive Command Center', icon: '⚡' },
    { href: '/macro', label: '02 Macro & Demand', icon: '🌍' },
    { href: '/genai', label: '03 GenAI Opportunity', icon: '🤖' },
    { href: '/quarterly', label: '04 Quarterly Review', icon: '📊' },
    { href: '/margins', label: '05 Margins & Profitability', icon: '📈' },
    { href: '/deals', label: '06 Deal Wins Intelligence', icon: '🤝' },
    { href: '/scorecard', label: '07 Sector Scorecard', icon: '🏆' },
    { href: '/risk', label: '08 Risk Observatory', icon: '⚠️' },
    { href: '/outlook', label: '09 FY27/28 Outlook', icon: '🔭' },
    { href: '/valuation', label: '10 Valuation & Thesis', icon: '💰' },
  ]},
  { section: 'COMPANY DEEP DIVES', items: [
    { href: '/company/tcs', label: 'TCS', icon: '🔵' },
    { href: '/company/infosys', label: 'Infosys', icon: '🟢' },
    { href: '/company/wipro', label: 'Wipro', icon: '🟡' },
    { href: '/company/hcltech', label: 'HCLTech', icon: '🟣' },
    { href: '/company/techm', label: 'Tech Mahindra', icon: '🔴' },
    { href: '/company/ltimindtree', label: 'LTIMindtree', icon: '🔷' },
    { href: '/company/mphasis', label: 'Mphasis', icon: '🟠' },
    { href: '/company/persistent', label: 'Persistent', icon: '🟩' },
    { href: '/company/coforge', label: 'Coforge', icon: '🌸' },
    { href: '/company/zensar', label: 'Zensar', icon: '🩵' },
  ]},
  { section: 'COMPARATIVE ANALYTICS', items: [
    { href: '/compare/largecap', label: '21 Large Cap Compare', icon: '🔬' },
    { href: '/compare/midcap', label: '22 Mid Cap Compare', icon: '🔬' },
    { href: '/ai-rankings', label: '23 AI Readiness', icon: '🧠' },
    { href: '/deal-leaderboard', label: '24 Deal Leaderboard', icon: '🥇' },
    { href: '/screener', label: '25 Company Screener', icon: '🔍' },
  ]},
];

export default function Sidebar({ open, onToggle }: { open: boolean; onToggle: () => void }) {
  const pathname = usePathname();
  return (
    <>
      <aside className={clsx('sidebar', open ? 'open' : 'closed')}>
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <div className="logo-icon">₹</div>
            {open && <div className="logo-text"><div className="logo-main">IT Intelligence</div><div className="logo-sub">Indian IT Sector Hub</div></div>}
          </div>
          <button className="sidebar-toggle" onClick={onToggle}>{open ? '◀' : '▶'}</button>
        </div>
        <nav className="sidebar-nav">
          {NAV.map(s => (
            <div key={s.section}>
              {open && <div className="nav-section">{s.section}</div>}
              {s.items.map(item => (
                <Link key={item.href} href={item.href} className={clsx('nav-item', pathname === item.href && 'active')}>
                  <span className="nav-icon">{item.icon}</span>
                  {open && <span className="nav-label">{item.label}</span>}
                </Link>
              ))}
            </div>
          ))}
        </nav>
      </aside>
    </>
  );
}
