import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { useData } from '../context/DataContext';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Legend } from 'recharts';
import { CustomTooltip, fmtRevenue } from '../components/ChartComponents';

const fmt = (n) => n >= 1000 ? `₹${(n/1000).toFixed(1)}K Cr` : `₹${n} Cr`;

export default function ExecutiveSummary({ company, quarter }) {
  const { darkMode } = useTheme();
  const { getCompanyData } = useData();
  const cd = getCompanyData(company);
  const idx = cd.findIndex(d => d.quarter === quarter);
  const curr = idx >= 0 ? cd[idx] : cd[cd.length - 1];
  const prev = idx > 0 ? cd[idx-1] : null;
  const yoy  = idx >= 4 ? cd[idx-4] : null;

  if (!curr) return <div style={{color:'var(--text-secondary)',padding:40,textAlign:'center'}}>No data for {company} · {quarter}</div>;

  const qoq  = (f) => prev ? ((curr[f]-prev[f])/prev[f]*100).toFixed(1) : null;
  const yoyG = (f) => yoy  ? ((curr[f]-yoy[f]) /yoy[f] *100).toFixed(1) : null;

  const kpis = [
    { label:'Revenue',      value:fmt(curr.revenue),          qoq:qoq('revenue'),          yoy:yoyG('revenue'),          color:'blue',   icon:'💰' },
    { label:'EBIT',         value:fmt(curr.ebit),             qoq:qoq('ebit'),             yoy:yoyG('ebit'),             color:'green',  icon:'📊' },
    { label:'PAT',          value:fmt(curr.pat),              qoq:qoq('pat'),              yoy:yoyG('pat'),              color:'purple', icon:'💹' },
    { label:'Op. Margin',   value:`${curr.operatingMargin}%`, qoq:prev?(curr.operatingMargin-prev.operatingMargin).toFixed(1):null, yoy:yoy?(curr.operatingMargin-yoy.operatingMargin).toFixed(1):null, color:'cyan',   icon:'📉', isMargin:true },
    { label:'Employees',    value:`${(curr.employees/1000).toFixed(0)}K`, qoq:qoq('employees'), yoy:yoyG('employees'), color:'orange', icon:'👥' },
    { label:'Attrition',    value:`${curr.attrition}%`,       qoq:prev?(curr.attrition-prev.attrition).toFixed(1):null, yoy:yoy?(curr.attrition-yoy.attrition).toFixed(1):null, color:'red',    icon:'📤', isAttrition:true },
    { label:'Total Clients',value:curr.totalClients.toLocaleString(), qoq:qoq('totalClients'), yoy:yoyG('totalClients'), color:'pink',   icon:'🤝' },
  ];

  const trendData = cd.slice(-8).map(d => ({
    quarter: d.quarter.replace('FY',''), revenue:d.revenue, pat:d.pat,
    margin:d.operatingMargin, employees:Math.round(d.employees/1000),
  }));

  const grid = darkMode ? '#1e2d47' : '#e2e8f0';
  const txt  = darkMode ? '#8a9bb5' : '#64748b';

  const alerts = [];
  if (prev && parseFloat(qoq('revenue'))  < -5) alerts.push({ msg:`Revenue declined ${Math.abs(qoq('revenue'))}% QoQ — exceeds -5% threshold`, type:'red' });
  if (prev && (curr.operatingMargin-prev.operatingMargin) < -2) alerts.push({ msg:`Operating margin contracted ${(curr.operatingMargin-prev.operatingMargin).toFixed(1)}pp QoQ — exceeds -2pp threshold`, type:'red' });
  if (prev && (curr.attrition-prev.attrition) > 3) alerts.push({ msg:`Attrition increased ${(curr.attrition-prev.attrition).toFixed(1)}pp QoQ — exceeds +3pp threshold`, type:'yellow' });

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">{company} — {quarter}</div>
          <div className="page-subtitle">Executive Performance Summary · All figures in INR Crore · <span style={{color:'var(--positive)',fontSize:11}}>● Live Firestore</span></div>
        </div>
      </div>

      {alerts.map((a,i) => <div key={i} className={`alert-card ${a.type}`}><span>⚠️</span><span>{a.msg}</span></div>)}

      <div className="kpi-grid">
        {kpis.map((k,i) => {
          const qv = parseFloat(k.qoq);
          const good = k.isAttrition ? qv <= 0 : k.isMargin ? qv >= 0 : qv >= 0;
          return (
            <div key={i} className={`kpi-card ${k.color}`}>
              <div className="kpi-label">{k.icon} {k.label}</div>
              <div className="kpi-value small">{k.value}</div>
              <div className="kpi-badge-row">
                {k.qoq !== null && <span className={`badge ${good?'positive':'negative'}`}>{good?'▲':'▼'} {Math.abs(k.qoq)}{k.isMargin||k.isAttrition?'pp':'%'} QoQ</span>}
                {k.yoy !== null && <span className="badge neutral">{parseFloat(k.yoy)>=0?'▲':'▼'} {Math.abs(k.yoy)}{k.isMargin||k.isAttrition?'pp':'%'} YoY</span>}
              </div>
            </div>
          );
        })}
      </div>

      <div className="charts-grid">
        <div className="chart-card">
          <div className="chart-header"><div><div className="chart-title">Revenue Trend</div><div className="chart-subtitle">Last 8 quarters · ₹ Crore</div></div></div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={trendData}>
              <defs><linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/><stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/></linearGradient></defs>
              <CartesianGrid strokeDasharray="3 3" stroke={grid}/>
              <XAxis dataKey="quarter" tick={{fill:txt,fontSize:11}}/>
              <YAxis tick={{fill:txt,fontSize:11}} tickFormatter={v=>`${(v/1000).toFixed(0)}K`}/>
              <Tooltip content={<CustomTooltip formatter={fmtRevenue}/>}/>
              <Area type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={2} fill="url(#revGrad)" name="Revenue"/>
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="chart-card">
          <div className="chart-header"><div><div className="chart-title">Margin & PAT Trend</div><div className="chart-subtitle">Op. Margin % & PAT ₹ Cr</div></div></div>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" stroke={grid}/>
              <XAxis dataKey="quarter" tick={{fill:txt,fontSize:11}}/>
              <YAxis yAxisId="left"  tick={{fill:txt,fontSize:11}} tickFormatter={v=>`${v}%`} domain={[15,35]}/>
              <YAxis yAxisId="right" orientation="right" tick={{fill:txt,fontSize:11}} tickFormatter={v=>`${(v/1000).toFixed(0)}K`}/>
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
          <thead><tr><th>Metric</th><th>Value</th><th>QoQ Change</th><th>YoY Change</th><th>Status</th></tr></thead>
          <tbody>
            {[
              {metric:'Revenue',         val:fmt(curr.revenue),          qr:qoq('revenue'),  yr:yoyG('revenue'),  unit:'%',  good:v=>v>=0},
              {metric:'EBIT',            val:fmt(curr.ebit),             qr:qoq('ebit'),     yr:yoyG('ebit'),     unit:'%',  good:v=>v>=0},
              {metric:'PAT',             val:fmt(curr.pat),              qr:qoq('pat'),      yr:yoyG('pat'),      unit:'%',  good:v=>v>=0},
              {metric:'Operating Margin',val:`${curr.operatingMargin}%`, qr:prev?(curr.operatingMargin-prev.operatingMargin).toFixed(1):null, yr:yoy?(curr.operatingMargin-yoy.operatingMargin).toFixed(1):null, unit:'pp', good:v=>v>=0},
              {metric:'Net Margin',      val:`${curr.netMargin}%`,       qr:prev?(curr.netMargin-prev.netMargin).toFixed(1):null,             yr:yoy?(curr.netMargin-yoy.netMargin).toFixed(1):null,             unit:'pp', good:v=>v>=0},
              {metric:'EPS',             val:`₹${curr.eps}`,             qr:qoq('eps'),      yr:yoyG('eps'),      unit:'%',  good:v=>v>=0},
              {metric:'Attrition',       val:`${curr.attrition}%`,       qr:prev?(curr.attrition-prev.attrition).toFixed(1):null,             yr:yoy?(curr.attrition-yoy.attrition).toFixed(1):null,             unit:'pp', good:v=>v<=0},
            ].map((row,i) => {
              const qv2 = parseFloat(row.qr); const good = row.qr !== null && row.good(qv2);
              return (
                <tr key={i}>
                  <td style={{color:'var(--text-primary)',fontFamily:'Inter',fontWeight:500}}>{row.metric}</td>
                  <td>{row.val}</td>
                  <td>{row.qr!==null?<span style={{color:good?'var(--positive)':'var(--negative)'}}>{good?'▲':'▼'} {Math.abs(qv2)}{row.unit}</span>:'—'}</td>
                  <td>{row.yr!==null?<span style={{color:row.good(parseFloat(row.yr))?'var(--accent)':'var(--warning)'}}>{row.good(parseFloat(row.yr))?'▲':'▼'} {Math.abs(parseFloat(row.yr))}{row.unit}</span>:'—'}</td>
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
