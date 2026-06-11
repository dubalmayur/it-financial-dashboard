'use client';
import { COMPANIES, LATEST_QUARTER } from '@/lib/data';
const SCENARIOS = [
  { type:'bull', label:'Bull Case', rev:'10–12%', ebit:'22–24%', tcv:'$55B+', drivers:['AI monetization accelerates','BFSI recovery faster than expected','Deal pipeline converts at 65%+','INR depreciation tailwind'] },
  { type:'base', label:'Base Case', rev:'6–8%', ebit:'20–22%', tcv:'$45-50B', drivers:['Steady demand recovery','AI revenue grows 40%+ YoY','Attrition stabilises at 13-15%','Margins stable with cost levers'] },
  { type:'bear', label:'Bear Case', rev:'2–4%', ebit:'17–19%', tcv:'$35-40B', drivers:['US recession hits BFSI budgets','AI deflates legacy revenue','Wage inflation 18%+ unhedged','Deal delays extend 2+ quarters'] },
];
export default function OutlookPage() {
  return (
    <div>
      <div className="page-header"><div className="page-title">🔭 FY27/28 Sector Outlook</div><div className="page-subtitle">Future Intelligence Center — Bull / Base / Bear Scenarios & Guidance Tracker</div></div>
      <div className="grid-3 mb-6">
        {SCENARIOS.map(s => (
          <div key={s.type} className={`scenario-card scenario-${s.type}`}>
            <div style={{fontSize:16,fontWeight:700,marginBottom:16,color:s.type==='bull'?'var(--positive)':s.type==='base'?'var(--accent-blue)':'var(--accent-red)'}}>{s.label}</div>
            <div style={{display:'flex',gap:16,marginBottom:16,flexWrap:'wrap'}}>
              <div><div style={{fontSize:10,color:'var(--text-muted)',marginBottom:4}}>SECTOR REV GROWTH</div><div style={{fontFamily:'JetBrains Mono',fontWeight:700,fontSize:18}}>{s.rev}</div></div>
              <div><div style={{fontSize:10,color:'var(--text-muted)',marginBottom:4}}>AVG EBIT MARGIN</div><div style={{fontFamily:'JetBrains Mono',fontWeight:700,fontSize:18}}>{s.ebit}</div></div>
              <div><div style={{fontSize:10,color:'var(--text-muted)',marginBottom:4}}>SECTOR TCV</div><div style={{fontFamily:'JetBrains Mono',fontWeight:700,fontSize:18}}>{s.tcv}</div></div>
            </div>
            {s.drivers.map((d,i) => <div key={i} className="risk-pill" style={{marginBottom:4}}><span style={{color:s.type==='bull'?'var(--positive)':s.type==='base'?'var(--accent-blue)':'var(--accent-red)'}}>•</span><span style={{fontSize:11}}>{d}</span></div>)}
          </div>
        ))}
      </div>
      <div className="section-title">Management Guidance Tracker</div>
      <div className="table-wrap">
        <table className="data-table">
          <thead><tr><th>Company</th><th>Revenue Growth Guidance</th><th>EBIT Margin Band</th><th>Period</th></tr></thead>
          <tbody>
            {COMPANIES.filter(c=>c.quarters[LATEST_QUARTER].guidance).map(c => {
              const g = c.quarters[LATEST_QUARTER].guidance!;
              return <tr key={c.id}><td><span className="company-dot" style={{background:c.color}}/> {c.shortName}</td><td><span className="guidance-chip">{g.revenueGrowth}</span></td><td><span className="guidance-chip">{g.ebitMargin}</span></td><td>FY26</td></tr>;
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
