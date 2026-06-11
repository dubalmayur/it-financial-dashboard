'use client';
import { COMPANIES, LATEST_QUARTER } from '@/lib/data';
const SECTOR_RISKS = [
  { label: 'AI Deflation Risk', severity: 'HIGH', desc: 'Generative AI could reduce billing hours in legacy service lines by 15-20% over FY27-28.' },
  { label: 'Macro Slowdown', severity: 'MEDIUM', desc: 'US/Europe GDP deceleration could cut IT budgets. BFSI and discretionary tech spend at risk.' },
  { label: 'Currency Risk (INR/USD)', severity: 'LOW', desc: 'INR appreciation compresses USD revenues. Hedging programs partially mitigate exposure.' },
  { label: 'Wage Inflation', severity: 'MEDIUM', desc: 'AI/cloud talent scarcity driving 15-20% wage premiums. Compresses margins.' },
  { label: 'Deal Delays', severity: 'MEDIUM', desc: 'Prolonged decision cycles in BFSI and manufacturing. Q1FY26 pipeline conversion rate being watched.' },
  { label: 'Visa & Regulatory Risks', severity: 'LOW', desc: 'US H-1B visa restrictions and data localization regulations add delivery complexity.' },
];
const sevColor = { HIGH:'var(--accent-red)', MEDIUM:'var(--accent-amber)', LOW:'var(--positive)' } as const;
export default function RiskPage() {
  return (
    <div>
      <div className="page-header"><div className="page-title">⚠️ Risk Observatory</div><div className="page-subtitle">Enterprise Risk Radar — Sector-wide and Company-specific Risks</div></div>
      <div className="section-title">Sector-Level Risk Radar</div>
      <div className="grid-2 mb-6">
        {SECTOR_RISKS.map(r => (
          <div key={r.label} className="chart-card" style={{borderLeft:`3px solid ${sevColor[r.severity as keyof typeof sevColor]}`}}>
            <div style={{display:'flex',justifyContent:'space-between',marginBottom:8}}>
              <strong style={{fontSize:13}}>{r.label}</strong>
              <span className="tag" style={{background:`rgba(${r.severity==='HIGH'?'239,68,68':r.severity==='MEDIUM'?'245,158,11':'16,185,129'},0.15)`,color:sevColor[r.severity as keyof typeof sevColor],border:`1px solid ${sevColor[r.severity as keyof typeof sevColor]}40`}}>{r.severity}</span>
            </div>
            <p style={{fontSize:12,color:'var(--text-secondary)',lineHeight:1.6}}>{r.desc}</p>
          </div>
        ))}
      </div>
      <div className="section-title">Company Risk Profiles</div>
      <div className="grid-2">
        {COMPANIES.map(c => (
          <div key={c.id} className="chart-card">
            <div style={{display:'flex',gap:8,alignItems:'center',marginBottom:10}}><span className="company-dot" style={{background:c.color}}/><strong>{c.shortName}</strong></div>
            {c.quarters[LATEST_QUARTER].risks.map((r,i) => <div key={i} className="risk-pill"><span style={{color:'var(--accent-red)'}}>⚠</span><span style={{fontSize:11}}>{r}</span></div>)}
          </div>
        ))}
      </div>
    </div>
  );
}
