'use client';
import { COMPANIES, QUARTERS, LATEST_QUARTER } from '@/lib/data';
import { RevenueChart } from '../ui/Chart';
export default function ComparePage({ type }: { type: string }) {
  const companies = COMPANIES.filter(c => type === 'largecap' ? c.cap === 'large' : c.cap === 'mid');
  const revData = QUARTERS.slice(-8).map(q => {
    const row: { quarter: string; [key: string]: string | number } = { quarter: q };
    companies.forEach(c => { row[c.shortName] = c.quarters[q].revenue; });
    return row;
  });
  return (
    <div>
      <div className="page-header"><div className="page-title">🔬 {type === 'largecap' ? 'Large Cap' : 'Mid Cap'} Comparison</div><div className="page-subtitle">Side-by-side financial comparison across all metrics</div></div>
      <div className="chart-card mb-6"><div className="chart-title">Revenue Trend Comparison ($B)</div><RevenueChart data={revData} colors={companies.map(c=>c.color)} /></div>
      <div className="table-wrap">
        <table className="data-table">
          <thead><tr><th>Metric</th>{companies.map(c=><th key={c.id}><span className="company-dot" style={{background:c.color}}/> {c.shortName}</th>)}</tr></thead>
          <tbody>
            {[
              {label:'Revenue ($B)', fn:(c: typeof companies[0])=>c.quarters[LATEST_QUARTER].revenue.toFixed(2)},
              {label:'YoY Growth', fn:(c: typeof companies[0])=>`${c.quarters[LATEST_QUARTER].revenueGrowthYoY>0?'+':''}${c.quarters[LATEST_QUARTER].revenueGrowthYoY.toFixed(1)}%`},
              {label:'EBIT Margin', fn:(c: typeof companies[0])=>`${c.quarters[LATEST_QUARTER].ebitMargin.toFixed(1)}%`},
              {label:'PAT ($B)', fn:(c: typeof companies[0])=>c.quarters[LATEST_QUARTER].pat.toFixed(2)},
              {label:'FCF ($B)', fn:(c: typeof companies[0])=>c.quarters[LATEST_QUARTER].fcf.toFixed(2)},
              {label:'TCV ($B)', fn:(c: typeof companies[0])=>c.quarters[LATEST_QUARTER].tcv.toFixed(2)},
              {label:'AI Revenue ($B)', fn:(c: typeof companies[0])=>c.quarters[LATEST_QUARTER].aiRevenue.toFixed(2)},
              {label:'Headcount', fn:(c: typeof companies[0])=>c.quarters[LATEST_QUARTER].headcount.toLocaleString()},
              {label:'Attrition', fn:(c: typeof companies[0])=>`${c.quarters[LATEST_QUARTER].attrition.toFixed(1)}%`},
            ].map(row=>(
              <tr key={row.label}><td>{row.label}</td>{companies.map(c=><td key={c.id} style={{fontFamily:'JetBrains Mono'}}>{row.fn(c)}</td>)}</tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
