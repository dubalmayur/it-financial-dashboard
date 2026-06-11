'use client';
import { COMPANIES, QUARTERS, LATEST_QUARTER } from '@/lib/data';
import { MarginChart } from '../ui/Chart';
export default function MarginsPage() {
  const ebitData = QUARTERS.slice(-8).map(q => {
    const row: { quarter: string; [key: string]: string | number } = { quarter: q };
    COMPANIES.forEach(c => { row[c.shortName] = c.quarters[q].ebitMargin; });
    return row;
  });
  const sorted = [...COMPANIES].sort((a,b) => b.quarters[LATEST_QUARTER].ebitMargin - a.quarters[LATEST_QUARTER].ebitMargin);
  return (
    <div>
      <div className="page-header"><div className="page-title">📈 Margins & Profitability Lab</div><div className="page-subtitle">EBIT, EBITDA, Net Margin, FCF Conversion Analysis</div></div>
      <div className="chart-card mb-6"><div className="chart-title">EBIT Margin Trends — All Companies (%)</div><MarginChart data={ebitData} colors={COMPANIES.map(c=>c.color)} /></div>
      <div className="section-title">Profitability Ranking — Q4FY25</div>
      <div className="table-wrap mb-6">
        <table className="data-table">
          <thead><tr><th>Rank</th><th>Company</th><th>EBIT Margin</th><th>EBITDA Margin</th><th>Net Margin</th><th>FCF ($B)</th><th>FCF Conv.</th><th>Cash ($B)</th></tr></thead>
          <tbody>
            {sorted.map((c,i) => {
              const q = c.quarters[LATEST_QUARTER];
              return (
                <tr key={c.id}>
                  <td>{i+1}</td>
                  <td><span className="company-dot" style={{background:c.color}}/> {c.shortName}</td>
                  <td className={i===0?'best-val':''}>{q.ebitMargin.toFixed(1)}%</td>
                  <td>{q.ebitdaMargin.toFixed(1)}%</td>
                  <td>{q.netMargin.toFixed(1)}%</td>
                  <td>${q.fcf.toFixed(2)}</td>
                  <td>{(q.fcf/q.pat*100).toFixed(0)}%</td>
                  <td>${q.cashBalance.toFixed(2)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
