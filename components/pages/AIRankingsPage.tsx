'use client';
import { COMPANIES, LATEST_QUARTER } from '@/lib/data';
const getAIScore = (companyId: string) => {
  const scores: Record<string,{revenue:number,clients:number,partnerships:number,platforms:number,monetization:number}> = {
    tcs:{revenue:88,clients:82,partnerships:90,platforms:85,monetization:80},
    infosys:{revenue:86,clients:88,partnerships:85,platforms:90,monetization:85},
    wipro:{revenue:72,clients:75,partnerships:80,platforms:78,monetization:68},
    hcltech:{revenue:80,clients:78,partnerships:82,platforms:76,monetization:74},
    techm:{revenue:68,clients:70,partnerships:72,platforms:70,monetization:62},
    ltimindtree:{revenue:78,clients:80,partnerships:76,platforms:82,monetization:76},
    mphasis:{revenue:74,clients:72,partnerships:70,platforms:72,monetization:70},
    persistent:{revenue:84,clients:86,partnerships:80,platforms:86,monetization:80},
    coforge:{revenue:76,clients:74,partnerships:74,platforms:76,monetization:70},
    zensar:{revenue:66,clients:68,partnerships:65,platforms:68,monetization:62},
  };
  return scores[companyId] || {revenue:70,clients:70,partnerships:70,platforms:70,monetization:70};
};
export default function AIRankingsPage() {
  const ranked = [...COMPANIES].map(c => {
    const s = getAIScore(c.id);
    const total = Math.round((s.revenue+s.clients+s.partnerships+s.platforms+s.monetization)/5);
    return {...c, scores: s, total};
  }).sort((a,b)=>b.total-a.total);
  return (
    <div>
      <div className="page-header"><div className="page-title">🧠 AI Readiness Rankings</div><div className="page-subtitle">Scoring: AI Revenue, Clients, Partnerships, Platforms, Monetization</div></div>
      <div className="grid-2">
        {ranked.map((c,i) => {
          const s = getAIScore(c.id);
          const q = c.quarters[LATEST_QUARTER];
          return (
            <div key={c.id} className="chart-card">
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:14}}>
                <div style={{display:'flex',alignItems:'center',gap:10}}>
                  <span style={{fontSize:20,fontWeight:800,color:i<3?'var(--accent-amber)':'var(--text-muted)',fontFamily:'JetBrains Mono'}}>#{i+1}</span>
                  <span className="company-dot" style={{background:c.color}}/><strong style={{fontSize:14}}>{c.shortName}</strong>
                </div>
                <div style={{fontFamily:'JetBrains Mono',fontSize:22,fontWeight:700,color:c.color}}>{c.total}/100</div>
              </div>
              {[['Revenue',' Score',s.revenue],['Client',' Depth',s.clients],['Partnerships','',s.partnerships],['Platforms','',s.platforms],['Monetization','',s.monetization]].map(([k,sfx,v]) => (
                <div key={String(k)} style={{marginBottom:8}}>
                  <div style={{display:'flex',justifyContent:'space-between',fontSize:11,color:'var(--text-muted)',marginBottom:3}}><span>{k}{sfx}</span><span style={{color:c.color}}>{v}</span></div>
                  <div className="ai-score-bar"><div className="ai-score-fill" style={{width:`${v}%`,background:c.color}}/></div>
                </div>
              ))}
              <div style={{marginTop:12,fontSize:11,color:'var(--text-muted)'}}>AI Revenue: <span style={{color:c.color,fontFamily:'JetBrains Mono'}}>${q.aiRevenue.toFixed(2)}B</span> | Clients: <span style={{color:c.color,fontFamily:'JetBrains Mono'}}>{q.aiClients}+</span></div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
