'use client';
import { COMPANIES, LATEST_QUARTER } from '@/lib/data';
const VERTICALS = ['BFSI','Manufacturing','Technology','Telecom','Healthcare','Retail','Energy'];
const getColor = (v: number) => v > 25 ? '#10b981' : v > 15 ? '#3b82f6' : v > 10 ? '#f59e0b' : '#ef4444';
export default function MacroPage() {
  return (
    <div>
      <div className="page-header"><div className="page-title">🌍 Macro & Demand Environment</div><div className="page-subtitle">Global Demand Radar — Q4FY25 Vertical Exposure</div></div>
      <div className="section-title">Vertical Demand Heatmap</div>
      <div className="table-wrap mb-6">
        <table className="data-table">
          <thead><tr><th>Company</th>{VERTICALS.map(v => <th key={v}>{v}</th>)}</tr></thead>
          <tbody>
            {COMPANIES.map(c => {
              const q = c.quarters[LATEST_QUARTER];
              const vals = [q.verticals.bfsi,q.verticals.manufacturing,q.verticals.technology,q.verticals.telecom,q.verticals.healthcare,q.verticals.retail,q.verticals.energy];
              return (
                <tr key={c.id}>
                  <td><span className="company-dot" style={{background:c.color}}/> {c.shortName}</td>
                  {vals.map((v,i) => <td key={i} style={{background:`rgba(${v>20?'16,185,129':v>15?'59,130,246':v>10?'245,158,11':'239,68,68'},${Math.min(v/100*3,0.4)})`,color:getColor(v),fontFamily:'JetBrains Mono',fontWeight:600}}>{v.toFixed(1)}%</td>)}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="grid-2 mb-6">
        {['BFSI Outlook','Technology Vertical','Manufacturing Demand','Healthcare Growth'].map(t => (
          <div key={t} className="chart-card">
            <div className="chart-title">{t}</div>
            <div className="quote-box">Management commentary indicates strong demand momentum in {t.split(' ')[0]} with deal pipelines at healthy levels. Client discretionary spending is gradually recovering while cost optimization programs remain active.</div>
          </div>
        ))}
      </div>
    </div>
  );
}
