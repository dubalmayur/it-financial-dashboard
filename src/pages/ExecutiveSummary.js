import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { useData } from '../context/DataContext';
import { useCurrencyFormat, fmtINR, fmtUSD } from '../hooks/useCurrencyFormat';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Legend } from 'recharts';

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="custom-tooltip">
      <div className="label">{label}</div>
      {payload.map((p,i) => (
        <div key={i} style={{display:'flex',justifyContent:'space-between',gap:16,marginBottom:3}}>
          <span style={{color:p.color,fontSize:12}}>{p.name}</span>
          <span className="value">{typeof p.value === 'number' ? p.value.toLocaleString() : p.value}</span>
        </div>
      ))}
    </div>
  );
};

export default function ExecutiveSummary({ company, quarter }) {
  const { darkMode } = useTheme();
  const { getCompanyData } = useData();
  const { currency, formatRevenue, formatRevenueStr, revenueKey, patKey, ebitKey, currencyUnit } = useCurrencyFormat();

  const cd   = getCompanyData(company);
  const idx  = cd.findIndex(d => d.quarter === quarter);
  const curr = idx >= 0 ? cd[idx] : cd[cd.length - 1];
  const prev = idx > 0  ? cd[idx-1] : null;
  const yoy  = idx >= 4 ? cd[idx-4] : null;

  if (!curr) return <div style={{color:'var(--text-secondary)',padding:40,textAlign:'center'}}>No data for {company} · {quarter}</div>;

  const qoqPct  = (f) => prev ? ((curr[f]-prev[f])/prev[f]*100).toFixed(1) : null;
  const yoyPct  = (f) => yoy  ? ((curr[f]-yoy[f]) /yoy[f] *100).toFixed(1) : null;
  const qoqDiff = (f) => prev ? (curr[f]-prev[f]).toFixed(2) : null;

  const revenueQoQ = qoqPct(revenueKey);
  const revenueYoY = yoyPct(revenueKey);

  const kpis = [
    { label:'Revenue',     inr:curr.revenue,  usd:curr.revenueUSD, qoq:qoqPct(revenueKey), yoy:yoyPct(revenueKey), color:'blue',   icon:'💰' },
    { label:'EBIT',        inr:curr.ebit,     usd:curr.ebitUSD,    qoq:qoqPct(ebitKey),    yoy:yoyPct(ebitKey),    color:'green',  icon:'📊' },
    { label:'PAT',         inr:curr.pat,      usd:curr.patUSD,     qoq:qoqPct(patKey),     yoy:yoyPct(patKey),     color:'purple', icon:'💹' },
    { label:'Op. Margin',  special:'margin',  val:`${curr.operatingMargin}%`, qoq:qoqDiff('operatingMargin'), yoy:yoy?(curr.operatingMargin-yoy.operatingMargin).toFixed(2):null, color:'cyan',   icon:'📉' },
    { label:'Employees',   special:'emp',     val:`${(curr.employees/1000).toFixed(0)}K`, qoq:qoqPct('employees'), yoy:yoyPct('employees'), color:'orange', icon:'👥' },
    { label:'Attrition',   special:'attr',    val:`${curr.attrition}%`, qoq:qoqDiff('attrition'), yoy:yoy?(curr.attrition-yoy.attrition).toFixed(1):null, color:'red',    icon:'📤', reverseGood:true },
    { label:'FX Rate',     special:'fx',      val:`₹${curr.fxRate}/$`, sub:`${curr.quarter} avg rate`, color:'pink', icon:'💱' },
  ];

  const trendData = cd.slice(-8).map(d => ({
    quarter: d.quarter.replace('FY',''),
    revenue: d[revenueKey], pat: d[patKey], margin: d.operatingMargin,
    revenueINR: d.revenue, revenueUSD: d.revenueUSD,
  }));

  const grid = darkMode ? '#1e2d47' : '#e2e8f0';
  const txt  = darkMode ? '#8a9bb5' : '#64748b';

  const alerts = [];
  if (prev && parseFloat(revenueQoQ) < -5)
    alerts.push({ msg:`Revenue declined ${Math.abs(revenueQoQ)}% QoQ (${currencyUnit}) — exceeds -5% threshold`, type:'red' });
  if (prev && (curr.operatingMargin-prev.operatingMargin) < -2)
    alerts.push({ msg:`Operating margin contracted ${(curr.operatingMargin-prev.operatingMargin).toFixed(1)}pp QoQ`, type:'red' });
  if (prev && (curr.attrition-prev.attrition) > 3)
    alerts.push({ msg:`Attrition increased ${(curr.attrition-prev.attrition).toFixed(1)}pp QoQ`, type:'yellow' });

  const axLabel = currency === 'usd' ? 'USD Mn' : currency === 'inr' ? '₹ Cr' : '₹ Cr';

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">{company} — {quarter}</div>
          <div className="page-subtitle">
            Executive Performance Summary ·&nbsp;
            <span style={{fontFamily:'JetBrains Mono',fontSize:11,background:'var(--accent-glow)',color:'var(--accent)',padding:'2px 8px',borderRadius:4}}>
              {currency === 'both' ? '₹ INR Cr  +  $ USD Mn' : currency === 'usd' ? '$ USD Million' : '₹ INR Crore'}
            </span>
            &nbsp;&nbsp;<span style={{color:'var(--positive)',fontSize:11}}>● Live Firestore</span>
          </div>
        </div>
      </div>

      {alerts.map((a,i) => <div key={i} className={`alert-card ${a.type}`}><span>⚠️</span><span>{a.msg}</span></div>)}

      <div className="kpi-grid">
        {kpis.map((k,i) => {
          if (k.special === 'fx') return (
            <div key={i} className={`kpi-card ${k.color}`}>
              <div className="kpi-label">{k.icon} {k.label}</div>
              <div className="kpi-value small" style={{fontSize:20}}>{k.val}</div>
              <div style={{fontSize:11,color:'var(--text-secondary)',marginTop:4}}>{k.sub}</div>
            </div>
          );
          const isReverseGood = k.reverseGood;
          const qv = parseFloat(k.qoq);
          const good = isReverseGood ? qv <= 0 : qv >= 0;
          const isMarginOrAttr = k.special === 'margin' || k.special === 'attr';
          const unit = isMarginOrAttr ? 'pp' : '%';
          return (
            <div key={i} className={`kpi-card ${k.color}`}>
              <div className="kpi-label">{k.icon} {k.label}</div>
              {k.special ? (
                <div className="kpi-value small">{k.val}</div>
              ) : (
                <div style={{marginBottom:10}}>
                  {(currency === 'inr' || currency === 'both') && (
                    <div style={{fontFamily:'JetBrains Mono',fontWeight:700,fontSize:currency==='both'?18:24,color:'var(--text-primary)',lineHeight:1.2}}>{fmtINR(k.inr)}</div>
                  )}
                  {(currency === 'usd' || currency === 'both') && (
                    <div style={{fontFamily:'JetBrains Mono',fontWeight:currency==='both'?600:700,fontSize:currency==='both'?14:24,color:currency==='both'?'var(--cyan)':'var(--text-primary)',lineHeight:1.4,marginTop:currency==='both'?2:0}}>{fmtUSD(k.usd)}</div>
                  )}
                </div>
              )}
              <div className="kpi-badge-row">
                {k.qoq !== null && <span className={`badge ${good?'positive':'negative'}`}>{good?'▲':'▼'} {Math.abs(k.qoq)}{unit} QoQ</span>}
                {k.yoy !== null && <span className="badge neutral">{parseFloat(k.yoy)>=0?'▲':'▼'} {Math.abs(k.yoy)}{unit} YoY</span>}
              </div>
            </div>
          );
        })}
      </div>

      {/* FX Rate callout */}
      <div style={{padding:'10px 16px',background:'var(--bg-card)',border:'1px solid var(--border)',borderRadius:8,marginBottom:20,display:'flex',alignItems:'center',gap:16,flexWrap:'wrap'}}>
        <span style={{fontSize:12,color:'var(--text-secondary)',fontWeight:600}}>💱 Exchange Rates Used</span>
        {cd.slice(-4).map(d => (
          <span key={d.quarter} style={{fontFamily:'JetBrains Mono',fontSize:12,color:d.quarter===quarter?'var(--accent)':'var(--text-muted)',background:d.quarter===quarter?'var(--accent-glow)':'transparent',padding:'2px 8px',borderRadius:4}}>
            {d.quarter}: ₹{d.fxRate}
          </span>
        ))}
        <span style={{fontSize:11,color:'var(--text-muted)',marginLeft:'auto'}}>Average quarterly INR/USD rates · Source: RBI</span>
      </div>

      <div className="charts-grid">
        <div className="chart-card">
          <div className="chart-header">
            <div><div className="chart-title">Revenue Trend</div>
            <div className="chart-subtitle">Last 8 quarters · {axLabel}</div></div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={trendData}>
              <defs>
                <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/><stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
                {currency==='both' && <linearGradient id="usdGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.2}/><stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                </linearGradient>}
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={grid}/>
              <XAxis dataKey="quarter" tick={{fill:txt,fontSize:11}}/>
              <YAxis tick={{fill:txt,fontSize:11}} tickFormatter={v => currency==='usd' ? `$${(v/1000).toFixed(1)}B` : `₹${(v/1000).toFixed(0)}K`}/>
              <Tooltip content={<CustomTooltip/>}/>
              {currency !== 'usd' && <Area type="monotone" dataKey="revenueINR" stroke="#3b82f6" strokeWidth={2} fill="url(#revGrad)" name="₹ Cr"/>}
              {currency !== 'inr' && <Area type="monotone" dataKey="revenueUSD" stroke="#06b6d4" strokeWidth={2} fill="url(#usdGrad)" name="$ Mn"/>}
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card">
          <div className="chart-header"><div><div className="chart-title">Margin & PAT Trend</div><div className="chart-subtitle">Op. Margin % & PAT</div></div></div>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" stroke={grid}/>
              <XAxis dataKey="quarter" tick={{fill:txt,fontSize:11}}/>
              <YAxis yAxisId="left"  tick={{fill:txt,fontSize:11}} tickFormatter={v=>`${v}%`} domain={[15,35]}/>
              <YAxis yAxisId="right" orientation="right" tick={{fill:txt,fontSize:11}} tickFormatter={v=>currency==='usd'?`$${(v/1000).toFixed(1)}B`:`₹${(v/1000).toFixed(0)}K`}/>
              <Tooltip content={<CustomTooltip/>}/>
              <Legend wrapperStyle={{fontSize:12,color:txt}}/>
              <Line yAxisId="left"  type="monotone" dataKey="margin" stroke="#10b981" strokeWidth={2} dot={false} name="Op.Margin%"/>
              <Line yAxisId="right" type="monotone" dataKey="pat"    stroke="#8b5cf6" strokeWidth={2} dot={false} name="PAT"/>
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="chart-card">
        <div className="chart-header"><div className="chart-title">Financial Health Snapshot — {quarter}</div></div>
        <table className="data-table">
          <thead>
            <tr><th>Metric</th><th>INR (Crore)</th><th>USD (Million)</th><th>FX Rate</th><th>QoQ ΔRevenue</th><th>YoY ΔRevenue</th><th>Status</th></tr>
          </thead>
          <tbody>
            {[
              {metric:'Revenue', inr:curr.revenue, usd:curr.revenueUSD, qr:qoqPct('revenue'), yr:yoyPct('revenue'), good:v=>v>=0},
              {metric:'EBIT',    inr:curr.ebit,    usd:curr.ebitUSD,    qr:qoqPct('ebit'),    yr:yoyPct('ebit'),    good:v=>v>=0},
              {metric:'EBITDA',  inr:curr.ebitda,  usd:curr.ebitdaUSD,  qr:qoqPct('ebitda'),  yr:yoyPct('ebitda'),  good:v=>v>=0},
              {metric:'PAT',     inr:curr.pat,     usd:curr.patUSD,     qr:qoqPct('pat'),     yr:yoyPct('pat'),     good:v=>v>=0},
              {metric:'Cash Flow',inr:curr.cashFlow,usd:curr.cashFlowUSD,qr:qoqPct('cashFlow'),yr:yoyPct('cashFlow'),good:v=>v>=0},
            ].map((row,i) => {
              const qv = parseFloat(row.qr); const good = row.qr !== null && row.good(qv);
              return (
                <tr key={i}>
                  <td style={{fontFamily:'Inter',fontWeight:600,color:'var(--text-primary)'}}>{row.metric}</td>
                  <td>₹{row.inr?.toLocaleString()} Cr</td>
                  <td style={{color:'var(--cyan)'}}>$ {row.usd?.toLocaleString()} Mn</td>
                  <td style={{color:'var(--text-muted)',fontFamily:'JetBrains Mono',fontSize:11}}>₹{curr.fxRate}/$</td>
                  <td>{row.qr!==null?<span style={{color:good?'var(--positive)':'var(--negative)'}}>{good?'▲':'▼'} {Math.abs(qv)}%</span>:'—'}</td>
                  <td>{row.yr!==null?<span style={{color:row.good(parseFloat(row.yr))?'var(--accent)':'var(--warning)'}}>{row.good(parseFloat(row.yr))?'▲':'▼'} {Math.abs(parseFloat(row.yr))}%</span>:'—'}</td>
                  <td><span style={{padding:'2px 8px',borderRadius:4,fontSize:11,fontFamily:'Inter',fontWeight:600,background:good?'var(--positive-bg)':'var(--negative-bg)',color:good?'var(--positive)':'var(--negative)'}}>{good?'● Healthy':'● Watch'}</span></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
