'use client';
import { COMPANIES, LATEST_QUARTER } from '@/lib/data';
export default function DealsPage() {
  const sorted = [...COMPANIES].sort((a,b) => b.quarters[LATEST_QUARTER].tcv - a.quarters[LATEST_QUARTER].tcv);
  return (
    <div>
      <div className="page-header"><div className="page-title">🤝 Deal Wins Intelligence</div><div className="page-subtitle">Deal Command Center — TCV, Mega Deals, Net New, Pipeline</div></div>
      <div className="grid-3 mb-6">
        {sorted.slice(0,6).map(c => {
          const q = c.quarters[LATEST_QUARTER];
          return (
            <div key={c.id} className="deal-card">
              <div style={{display:'flex',gap:8,alignItems:'center',marginBottom:12}}><span className="company-dot" style={{background:c.color}}/><strong>{c.shortName}</strong></div>
              <div className="deal-tcv">${q.tcv.toFixed(2)}B TCV</div>
              <div style={{fontSize:11,color:'var(--text-muted)',margin:'4px 0 12px'}}>Net New: ${q.netNewTCV.toFixed(2)}B</div>
              {q.dealWins.map((d,i) => <div key={i} className="risk-pill"><span style={{color:'var(--accent-amber)'}}>💼</span><span style={{fontSize:11}}>{d}</span></div>)}
            </div>
          );
        })}
      </div>
      <div className="section-title">Deal Intelligence Table</div>
      <div className="table-wrap">
        <table className="data-table">
          <thead><tr><th>Company</th><th>Total TCV</th><th>Net New TCV</th><th>Renewals Est.</th><th>Key Verticals</th></tr></thead>
          <tbody>
            {sorted.map(c => {
              const q = c.quarters[LATEST_QUARTER];
              const renewal = (q.tcv - q.netNewTCV).toFixed(2);
              const topVert = Object.entries(c.quarters[LATEST_QUARTER].verticals).sort((a,b)=>b[1]-a[1]).slice(0,2).map(([k])=>k).join(', ');
              return <tr key={c.id}><td><span className="company-dot" style={{background:c.color}}/> {c.shortName}</td><td className="best-val">${q.tcv.toFixed(2)}B</td><td>${q.netNewTCV.toFixed(2)}B</td><td>${renewal}B</td><td style={{textTransform:'capitalize'}}>{topVert}</td></tr>;
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
