'use client';
import { COMPANIES, LATEST_QUARTER } from '@/lib/data';
export default function DealLeaderboardPage() {
  const byTCV = [...COMPANIES].sort((a,b)=>b.quarters[LATEST_QUARTER].tcv-a.quarters[LATEST_QUARTER].tcv);
  const byNetNew = [...COMPANIES].sort((a,b)=>b.quarters[LATEST_QUARTER].netNewTCV-a.quarters[LATEST_QUARTER].netNewTCV);
  return (
    <div>
      <div className="page-header"><div className="page-title">🥇 Deal Wins Leaderboard</div><div className="page-subtitle">TCV, Net New Deals, Mega Deals, Pipeline Strength — Q4FY25</div></div>
      <div className="grid-2 mb-6">
        <div className="chart-card">
          <div className="chart-title">🏆 TCV Leaderboard</div>
          {byTCV.map((c,i) => {
            const q = c.quarters[LATEST_QUARTER];
            const pct = (q.tcv / byTCV[0].quarters[LATEST_QUARTER].tcv * 100);
            return (
              <div key={c.id} style={{marginBottom:10}}>
                <div style={{display:'flex',justifyContent:'space-between',marginBottom:4,fontSize:12}}>
                  <span><span style={{color:'var(--text-muted)',marginRight:6}}>#{i+1}</span><span className="company-dot" style={{background:c.color}}/> {c.shortName}</span>
                  <span style={{fontFamily:'JetBrains Mono',color:c.color}}>${q.tcv.toFixed(2)}B</span>
                </div>
                <div className="ai-score-bar"><div className="ai-score-fill" style={{width:`${pct}%`,background:c.color}}/></div>
              </div>
            );
          })}
        </div>
        <div className="chart-card">
          <div className="chart-title">🆕 Net New TCV Leaderboard</div>
          {byNetNew.map((c,i) => {
            const q = c.quarters[LATEST_QUARTER];
            const pct = (q.netNewTCV / byNetNew[0].quarters[LATEST_QUARTER].netNewTCV * 100);
            return (
              <div key={c.id} style={{marginBottom:10}}>
                <div style={{display:'flex',justifyContent:'space-between',marginBottom:4,fontSize:12}}>
                  <span><span style={{color:'var(--text-muted)',marginRight:6}}>#{i+1}</span><span className="company-dot" style={{background:c.color}}/> {c.shortName}</span>
                  <span style={{fontFamily:'JetBrains Mono',color:c.color}}>${q.netNewTCV.toFixed(2)}B</span>
                </div>
                <div className="ai-score-bar"><div className="ai-score-fill" style={{width:`${pct}%`,background:c.color}}/></div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
