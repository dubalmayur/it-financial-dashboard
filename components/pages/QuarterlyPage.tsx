'use client';
import { COMPANIES, LATEST_QUARTER } from '@/lib/data';
export default function QuarterlyPage() {
  const sorted = [...COMPANIES].sort((a,b) => b.quarters[LATEST_QUARTER].revenueGrowthYoY - a.quarters[LATEST_QUARTER].revenueGrowthYoY);
  return (
    <div>
      <div className="page-header"><div className="page-title">📊 Quarterly Performance Review</div><div className="page-subtitle">Earnings Intelligence Center — {LATEST_QUARTER} Reported Results</div></div>
      <div className="section-title">Quarter Winners by Revenue Growth</div>
      <div className="table-wrap mb-6">
        <table className="data-table">
          <thead><tr><th>Rank</th><th>Company</th><th>Revenue</th><th>YoY %</th><th>QoQ %</th><th>EBIT%</th><th>PAT</th><th>FCF</th><th>TCV</th><th>HC</th><th>Guidance</th></tr></thead>
          <tbody>
            {sorted.map((c,i) => {
              const q = c.quarters[LATEST_QUARTER];
              return (
                <tr key={c.id}>
                  <td><span style={{fontWeight:700,color:i<3?'var(--accent-amber)':'var(--text-muted)'}}>{i+1}</span></td>
                  <td><span className="company-dot" style={{background:c.color}}/> {c.shortName}</td>
                  <td style={{fontFamily:'JetBrains Mono'}}>${q.revenue.toFixed(2)}B</td>
                  <td className={q.revenueGrowthYoY>=0?'best-val':'worst-val'}>{q.revenueGrowthYoY>0?'+':''}{q.revenueGrowthYoY.toFixed(1)}%</td>
                  <td>{q.revenueGrowthQoQ>0?'+':''}{q.revenueGrowthQoQ.toFixed(1)}%</td>
                  <td>{q.ebitMargin.toFixed(1)}%</td>
                  <td>${q.pat.toFixed(2)}B</td>
                  <td>${q.fcf.toFixed(2)}B</td>
                  <td>${q.tcv.toFixed(1)}B</td>
                  <td>{q.headcount.toLocaleString()}</td>
                  <td>{q.guidance ? <span className="guidance-chip">{q.guidance.revenueGrowth}</span> : '—'}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="section-title">Management Commentary Hub</div>
      <div className="grid-2">
        {COMPANIES.map(c => <div key={c.id} className="chart-card"><div style={{display:'flex',gap:8,alignItems:'center',marginBottom:10}}><span className="company-dot" style={{background:c.color}}/><strong>{c.shortName}</strong></div><div className="quote-box">{c.quarters[LATEST_QUARTER].managementQuotes.ceo}</div></div>)}
      </div>
    </div>
  );
}
