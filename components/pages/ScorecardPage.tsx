'use client';
import { COMPANIES, LATEST_QUARTER } from '@/lib/data';
export default function ScorecardPage() {
  const metrics = ['Revenue','Growth','EBIT%','PAT','FCF','TCV','AI Rev','Cash'];
  return (
    <div>
      <div className="page-header"><div className="page-title">🏆 Sector Financial Scorecard</div><div className="page-subtitle">Sector Benchmarking Hub — All 10 Companies vs All Key Metrics</div></div>
      <div className="table-wrap">
        <table className="data-table">
          <thead><tr><th>Company</th><th>Cap</th><th>Revenue</th><th>YoY%</th><th>EBIT%</th><th>PAT</th><th>FCF</th><th>TCV</th><th>AI Rev</th><th>Cash</th><th>HC</th><th>Attrition</th></tr></thead>
          <tbody>
            {COMPANIES.map(c => {
              const q = c.quarters[LATEST_QUARTER];
              return (
                <tr key={c.id}>
                  <td><span className="company-dot" style={{background:c.color}}/> <strong>{c.shortName}</strong></td>
                  <td><span className={`tag ${c.cap==='large'?'tag-blue':'tag-amber'}`}>{c.cap}</span></td>
                  <td style={{fontFamily:'JetBrains Mono'}}>${q.revenue.toFixed(2)}B</td>
                  <td className={q.revenueGrowthYoY>=10?'best-val':q.revenueGrowthYoY<0?'worst-val':''}>{q.revenueGrowthYoY>0?'+':''}{q.revenueGrowthYoY.toFixed(1)}%</td>
                  <td className={q.ebitMargin>=20?'best-val':''}>{q.ebitMargin.toFixed(1)}%</td>
                  <td>${q.pat.toFixed(2)}B</td>
                  <td>${q.fcf.toFixed(2)}B</td>
                  <td>${q.tcv.toFixed(2)}B</td>
                  <td>${q.aiRevenue.toFixed(2)}B</td>
                  <td>${q.cashBalance.toFixed(2)}B</td>
                  <td>{q.headcount.toLocaleString()}</td>
                  <td className={q.attrition<15?'best-val':q.attrition>20?'worst-val':''}>{q.attrition.toFixed(1)}%</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
