'use client';
import { useState } from 'react';
import { COMPANIES, LATEST_QUARTER } from '@/lib/data';
export default function ScreenerPage() {
  const [minGrowth, setMinGrowth] = useState(-20);
  const [minMargin, setMinMargin] = useState(0);
  const [capFilter, setCapFilter] = useState('all');
  const filtered = COMPANIES.filter(c => {
    const q = c.quarters[LATEST_QUARTER];
    return q.revenueGrowthYoY >= minGrowth && q.ebitMargin >= minMargin && (capFilter === 'all' || c.cap === capFilter);
  });
  return (
    <div>
      <div className="page-header"><div className="page-title">🔍 Interactive Company Screener</div><div className="page-subtitle">Filter by Revenue Growth, EBIT Margin, Cap, FCF, TCV, AI Score</div></div>
      <div className="filter-row mb-6">
        <div className="filter-group"><label className="filter-label">Min Revenue Growth %</label><input type="range" min={-20} max={35} value={minGrowth} onChange={e=>setMinGrowth(+e.target.value)} style={{accentColor:'var(--accent-blue)'}}/><span style={{fontSize:12,color:'var(--accent-blue)'}}>{minGrowth}%+</span></div>
        <div className="filter-group"><label className="filter-label">Min EBIT Margin %</label><input type="range" min={0} max={25} value={minMargin} onChange={e=>setMinMargin(+e.target.value)} style={{accentColor:'var(--accent-green)'}}/><span style={{fontSize:12,color:'var(--accent-green)'}}>{minMargin}%+</span></div>
        <div className="filter-group"><label className="filter-label">Market Cap</label><select className="filter-select" value={capFilter} onChange={e=>setCapFilter(e.target.value)}><option value="all">All</option><option value="large">Large Cap</option><option value="mid">Mid Cap</option></select></div>
      </div>
      <div style={{fontSize:13,color:'var(--text-muted)',marginBottom:12}}>{filtered.length} companies match your criteria</div>
      <div className="table-wrap">
        <table className="data-table">
          <thead><tr><th>Company</th><th>Cap</th><th>Revenue</th><th>YoY%</th><th>EBIT%</th><th>PAT</th><th>FCF</th><th>TCV</th><th>AI Rev</th><th>Headcount</th></tr></thead>
          <tbody>
            {filtered.map(c => {
              const q = c.quarters[LATEST_QUARTER];
              return (
                <tr key={c.id}>
                  <td><span className="company-dot" style={{background:c.color}}/> <strong>{c.shortName}</strong><div style={{fontSize:10,color:'var(--text-muted)'}}>{c.theme}</div></td>
                  <td><span className={`tag ${c.cap==='large'?'tag-blue':'tag-amber'}`}>{c.cap}</span></td>
                  <td style={{fontFamily:'JetBrains Mono'}}>${q.revenue.toFixed(2)}B</td>
                  <td className={q.revenueGrowthYoY>=0?'best-val':'worst-val'}>{q.revenueGrowthYoY>0?'+':''}{q.revenueGrowthYoY.toFixed(1)}%</td>
                  <td className={q.ebitMargin>=20?'best-val':''}>{q.ebitMargin.toFixed(1)}%</td>
                  <td>${q.pat.toFixed(2)}B</td>
                  <td>${q.fcf.toFixed(2)}B</td>
                  <td>${q.tcv.toFixed(2)}B</td>
                  <td>${q.aiRevenue.toFixed(2)}B</td>
                  <td>{q.headcount.toLocaleString()}</td>
                </tr>
              );
            })}
            {filtered.length === 0 && <tr><td colSpan={10} style={{textAlign:'center',padding:32,color:'var(--text-muted)'}}>No companies match your filters. Try adjusting the criteria.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
