import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { useData } from '../context/DataContext';
import { generateAIInsights } from '../data/sampleData';

const icons  = { positive:'✅', negative:'❌', risk:'⚠️', opportunity:'💡', neutral:'ℹ️' };
const labels = { positive:'Positive Trend', negative:'Negative Trend', risk:'Risk', opportunity:'Opportunity', neutral:'Observation' };

export default function AIInsights({ company, quarter }) {
  const { darkMode } = useTheme();
  const { getCompanyData } = useData();
  const cd   = getCompanyData(company);
  const idx  = cd.findIndex(d => d.quarter === quarter);
  const curr = idx >= 0 ? cd[idx] : cd[cd.length-1];
  const prev = idx > 0 ? cd[idx-1] : null;

  const insights = curr ? generateAIInsights(company, quarter) : [];
  const byType = { positive:[], negative:[], risk:[], opportunity:[], neutral:[] };
  insights.forEach(i => { if (byType[i.type]) byType[i.type].push(i); });

  const summaryStats = [
    {label:'Positive Signals',  count:byType.positive.length,                           color:'var(--positive)', bg:'var(--positive-bg)'},
    {label:'Risks Identified',  count:byType.risk.length+byType.negative.length,        color:'var(--negative)', bg:'var(--negative-bg)'},
    {label:'Opportunities',     count:byType.opportunity.length,                        color:'var(--purple)',   bg:'var(--purple-bg)'},
    {label:'Observations',      count:byType.neutral.length,                            color:'var(--accent)',   bg:'var(--accent-glow)'},
  ];

  return (
    <div>
      <div className="page-header">
        <div><div className="page-title">AI Insights — {company} · {quarter}</div>
        <div className="page-subtitle">Automated intelligence · <span style={{color:'var(--positive)',fontSize:11}}>● Live Firestore</span></div></div>
        <div style={{display:'flex',alignItems:'center',gap:8,padding:'6px 14px',background:'var(--accent-glow)',border:'1px solid var(--accent)',borderRadius:20,fontSize:12,color:'var(--accent)',fontWeight:600}}>
          <span>🤖</span> AI Analytics Active
        </div>
      </div>

      <div className="kpi-grid" style={{gridTemplateColumns:'repeat(4,1fr)',marginBottom:24}}>
        {summaryStats.map((s,i) => (
          <div key={i} style={{background:s.bg,border:`1px solid ${s.color}30`,borderRadius:8,padding:'16px 20px',textAlign:'center'}}>
            <div style={{fontSize:32,fontWeight:700,color:s.color,fontFamily:'JetBrains Mono'}}>{s.count}</div>
            <div style={{fontSize:12,color:'var(--text-secondary)',marginTop:4,fontWeight:500}}>{s.label}</div>
          </div>
        ))}
      </div>

      {curr && (
        <div className="chart-card" style={{marginBottom:20}}>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:16}}>
            <div className="chart-title">Performance Score Card — {company} {quarter}</div>
            <div style={{fontSize:11,color:'var(--text-secondary)',background:'var(--bg-primary)',padding:'4px 10px',borderRadius:4}}>AI-generated · Not investment advice</div>
          </div>
          <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:12}}>
            {[
              {label:'Revenue Momentum', score:prev?Math.min(100,Math.max(0,50+parseFloat(((curr.revenue-prev.revenue)/prev.revenue*100))*5)):70},
              {label:'Margin Quality',   score:Math.min(100,curr.operatingMargin*3.5)},
              {label:'Workforce Health', score:Math.min(100,Math.max(0,100-curr.attrition*3))},
              {label:'Client Depth',     score:Math.min(100,(curr.clients1M/curr.totalClients)*300)},
              {label:'Deal Pipeline',    score:Math.min(100,curr.largeDeals*4)},
              {label:'Cash Generation',  score:Math.min(100,(curr.cashFlow/curr.revenue)*500)},
            ].map((s,i) => (
              <div key={i} style={{padding:12,background:'var(--bg-primary)',borderRadius:6}}>
                <div style={{display:'flex',justifyContent:'space-between',marginBottom:6}}>
                  <span style={{fontSize:12,color:'var(--text-secondary)'}}>{s.label}</span>
                  <span style={{fontSize:13,fontWeight:700,color:s.score>=70?'var(--positive)':s.score>=50?'var(--warning)':'var(--negative)',fontFamily:'JetBrains Mono'}}>{Math.round(s.score)}</span>
                </div>
                <div style={{background:'var(--border)',borderRadius:4,height:6}}>
                  <div style={{width:`${s.score}%`,height:'100%',background:s.score>=70?'var(--positive)':s.score>=50?'var(--warning)':'var(--negative)',borderRadius:4,transition:'width 0.6s ease'}}/>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {Object.entries(byType).filter(([,v])=>v.length>0).map(([type,items]) => (
        <div key={type} style={{marginBottom:20}}>
          <div style={{fontSize:13,fontWeight:700,color:'var(--text-secondary)',textTransform:'uppercase',letterSpacing:'0.06em',marginBottom:10}}>
            {icons[type]} {labels[type]}s ({items.length})
          </div>
          {items.map((item,i) => (
            <div key={i} className={`insight-card ${type}`}>
              <span className="icon">{icons[type]}</span>
              <span className="text">{item.text}</span>
            </div>
          ))}
        </div>
      ))}

      {insights.length===0 && (
        <div style={{textAlign:'center',padding:60,color:'var(--text-secondary)'}}>
          <div style={{fontSize:40,marginBottom:12}}>📊</div>
          <div>Select a company and quarter with available Firestore data</div>
        </div>
      )}

      <div style={{marginTop:24,padding:'12px 16px',background:'var(--bg-card)',border:'1px solid var(--border)',borderRadius:8,fontSize:11,color:'var(--text-muted)',lineHeight:1.6}}>
        <strong style={{color:'var(--text-secondary)'}}>Disclaimer:</strong> AI-generated insights are based on quantitative data analysis only. Not investment advice.
      </div>
    </div>
  );
}
