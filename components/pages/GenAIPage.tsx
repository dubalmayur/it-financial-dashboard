'use client';
import { COMPANIES, LATEST_QUARTER, QUARTERS } from '@/lib/data';
import { RevenueChart } from '../ui/Chart';
export default function GenAIPage() {
  const aiData = QUARTERS.slice(-8).map(q => {
    const row: { quarter: string; [key: string]: string | number } = { quarter: q };
    COMPANIES.slice(0,5).forEach(c => { row[c.shortName] = c.quarters[q].aiRevenue; });
    return row;
  });
  const sorted = [...COMPANIES].sort((a,b) => b.quarters[LATEST_QUARTER].aiRevenue - a.quarters[LATEST_QUARTER].aiRevenue);
  return (
    <div>
      <div className="page-header"><div className="page-title">🤖 GenAI Opportunity & Disruption</div><div className="page-subtitle">AI War Room — Tracking AI Revenue, Platforms, Partnerships & Client Wins</div></div>
      <div className="chart-card mb-6"><div className="chart-title">AI Revenue Trend — Top 5 Companies ($B)</div><RevenueChart data={aiData} colors={COMPANIES.slice(0,5).map(c=>c.color)} /></div>
      <div className="section-title">AI Readiness Scorecard</div>
      <div className="grid-2 mb-6">
        {sorted.map(c => {
          const q = c.quarters[LATEST_QUARTER];
          const score = Math.min(100, Math.round((q.aiRevenue * 15 + q.aiClients * 0.3) * 2));
          return (
            <div key={c.id} className="chart-card">
              <div style={{display:'flex',justifyContent:'space-between',marginBottom:10}}>
                <div style={{display:'flex',alignItems:'center',gap:8}}><span className="company-dot" style={{background:c.color}}/><strong>{c.shortName}</strong></div>
                <span style={{fontFamily:'JetBrains Mono',fontWeight:700,color:c.color}}>{score}/100</span>
              </div>
              <div className="ai-score-bar"><div className="ai-score-fill" style={{width:`${score}%`,background:c.color}}/></div>
              <div style={{display:'flex',gap:16,marginTop:10,fontSize:12,color:'var(--text-secondary)'}}>
                <span>Revenue: <strong style={{color:c.color}}>${q.aiRevenue.toFixed(2)}B</strong></span>
                <span>Clients: <strong style={{color:c.color}}>{q.aiClients}+</strong></span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
