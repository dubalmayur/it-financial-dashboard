import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { useData } from '../context/DataContext';
import { useCurrencyFormat, fmtINR, fmtUSD } from '../hooks/useCurrencyFormat';
import { AreaChart, Area, BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Legend } from 'recharts';

const CT = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="custom-tooltip">
      <div className="label">{label}</div>
      {payload.map((p,i) => <div key={i} style={{display:'flex',justifyContent:'space-between',gap:16,marginBottom:3}}><span style={{color:p.color,fontSize:12}}>{p.name}</span><span className="value">{p.value}</span></div>)}
    </div>
  );
};

export default function RevenueAnalysis({ company }) {
  const { darkMode } = useTheme();
  const { getGrowthData } = useData();
  const { currency, revenueKey, currencyUnit } = useCurrencyFormat();
  const cd = getGrowthData(company);
  const grid = darkMode ? '#1e2d47' : '#e2e8f0';
  const txt  = darkMode ? '#8a9bb5' : '#64748b';
  if (!cd.length) return <div style={{color:'var(--text-secondary)',padding:40}}>Loading…</div>;

  const last  = cd[cd.length-1];
  const first = cd[0];
  const years = (cd.length-1)/4;
  const cagrINR = ((Math.pow(last.revenue    / first.revenue,    1/years)-1)*100).toFixed(1);
  const cagrUSD = ((Math.pow(last.revenueUSD / first.revenueUSD, 1/years)-1)*100).toFixed(1);

  const qoqKey = currency === 'usd' ? 'qoqRevenueUSD' : 'qoqRevenue';
  const yoyKey = currency === 'usd' ? 'yoyRevenueUSD' : 'yoyRevenue';
  const curr   = last;
  const recent8 = cd.slice(-8);

  const trendData = cd.map(d => ({
    quarter: d.quarter.replace('FY',''),
    revenueINR: d.revenue, revenueUSD: d.revenueUSD,
    revenue: d[revenueKey],
    qoq: d[qoqKey], yoy: d[yoyKey],
    fxRate: d.fxRate,
  }));

  const axFmt = (v) => currency === 'usd' ? (v >= 1000 ? `$${(v/1000).toFixed(1)}B` : `$${v}M`) : `₹${(v/1000).toFixed(0)}K`;

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Revenue Analysis — {company}</div>
          <div className="page-subtitle">Quarterly trends, growth rates & CAGR ·&nbsp;
            <span style={{fontFamily:'JetBrains Mono',fontSize:11,background:'var(--accent-glow)',color:'var(--accent)',padding:'2px 8px',borderRadius:4}}>{currencyUnit}</span>
            &nbsp;&nbsp;<span style={{color:'var(--positive)',fontSize:11}}>● Live Firestore</span>
          </div>
        </div>
      </div>

      <div className="kpi-grid" style={{gridTemplateColumns:'repeat(4,1fr)'}}>
        <div className="kpi-card blue">
          <div className="kpi-label">Latest Revenue</div>
          <div style={{fontFamily:'JetBrains Mono',fontWeight:700,fontSize:16,color:'var(--text-primary)',margin:'6px 0 2px'}}>₹{(curr.revenue/1000).toFixed(2)}K Cr</div>
          <div style={{fontFamily:'JetBrains Mono',fontWeight:600,fontSize:13,color:'var(--cyan)'}}>$ {(curr.revenueUSD/1000).toFixed(3)}B</div>
        </div>
        <div className={`kpi-card ${curr[qoqKey]>=0?'green':'red'}`}>
          <div className="kpi-label">QoQ Growth</div>
          <div className="kpi-value small">{curr[qoqKey]!==null?`${curr[qoqKey]>0?'+':''}${curr[qoqKey]}%`:'N/A'}</div>
          <div style={{fontSize:11,color:'var(--text-secondary)',marginTop:4}}>In {currencyUnit} terms</div>
        </div>
        <div className={`kpi-card ${curr[yoyKey]>=0?'cyan':'orange'}`}>
          <div className="kpi-label">YoY Growth</div>
          <div className="kpi-value small">{curr[yoyKey]!==null?`${curr[yoyKey]>0?'+':''}${curr[yoyKey]}%`:'N/A'}</div>
          <div style={{fontSize:11,color:'var(--text-secondary)',marginTop:4}}>In {currencyUnit} terms</div>
        </div>
        <div className="kpi-card purple">
          <div className="kpi-label">3-Year CAGR</div>
          <div style={{fontFamily:'JetBrains Mono',fontWeight:700,fontSize:18,color:'var(--text-primary)',margin:'6px 0 2px'}}>₹ {cagrINR}%</div>
          <div style={{fontFamily:'JetBrains Mono',fontWeight:600,fontSize:13,color:'var(--cyan)'}}>$ {cagrUSD}%</div>
        </div>
      </div>

      <div className="charts-grid single">
        <div className="chart-card">
          <div className="chart-header">
            <div><div className="chart-title">Quarterly Revenue Trend — INR & USD</div><div className="chart-subtitle">All quarters</div></div>
            <div style={{display:'flex',gap:12,fontSize:11}}>
              <span style={{color:'#3b82f6'}}>● ₹ INR Crore</span>
              <span style={{color:'#06b6d4'}}>● $ USD Million</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={trendData}>
              <defs>
                <linearGradient id="revGI" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#3b82f6" stopOpacity={0.25}/><stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/></linearGradient>
                <linearGradient id="revGU" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#06b6d4" stopOpacity={0.2}/><stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/></linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={grid}/>
              <XAxis dataKey="quarter" tick={{fill:txt,fontSize:11}}/>
              <YAxis yAxisId="inr" tick={{fill:txt,fontSize:11}} tickFormatter={v=>`₹${(v/1000).toFixed(0)}K`}/>
              <YAxis yAxisId="usd" orientation="right" tick={{fill:'#06b6d4',fontSize:11}} tickFormatter={v=>`$${(v/1000).toFixed(1)}B`}/>
              <Tooltip content={<CT/>}/>
              <Legend wrapperStyle={{fontSize:12,color:txt}}/>
              <Area yAxisId="inr" type="monotone" dataKey="revenueINR" stroke="#3b82f6" strokeWidth={2.5} fill="url(#revGI)" name="₹ INR Cr"/>
              <Area yAxisId="usd" type="monotone" dataKey="revenueUSD" stroke="#06b6d4" strokeWidth={2}   fill="url(#revGU)" name="$ USD Mn"/>
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="charts-grid">
        <div className="chart-card">
          <div className="chart-header"><div><div className="chart-title">QoQ Revenue Growth %</div><div className="chart-subtitle">In {currencyUnit} terms</div></div></div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={trendData.filter(d=>d.qoq!==null).slice(-8)}>
              <CartesianGrid strokeDasharray="3 3" stroke={grid}/>
              <XAxis dataKey="quarter" tick={{fill:txt,fontSize:11}}/>
              <YAxis tick={{fill:txt,fontSize:11}} tickFormatter={v=>`${v}%`}/>
              <Tooltip content={<CT/>}/>
              <ReferenceLine y={0} stroke={grid}/>
              <Bar dataKey="qoq" name="QoQ Growth%" fill="#3b82f6" radius={[4,4,0,0]}/>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="chart-card">
          <div className="chart-header"><div><div className="chart-title">YoY Revenue Growth %</div><div className="chart-subtitle">In {currencyUnit} terms</div></div></div>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={trendData.filter(d=>d.yoy!==null)}>
              <CartesianGrid strokeDasharray="3 3" stroke={grid}/>
              <XAxis dataKey="quarter" tick={{fill:txt,fontSize:11}}/>
              <YAxis tick={{fill:txt,fontSize:11}} tickFormatter={v=>`${v}%`}/>
              <Tooltip content={<CT/>}/>
              <ReferenceLine y={0} stroke={grid}/>
              <Line type="monotone" dataKey="yoy" stroke="#10b981" strokeWidth={2.5} dot={{fill:'#10b981',r:4}} name="YoY Growth%"/>
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="chart-card">
        <div className="chart-header"><div className="chart-title">Revenue Detail Table — Last 8 Quarters (INR + USD as reported)</div></div>
        <table className="data-table">
          <thead>
            <tr><th>Quarter</th><th>Revenue (₹ Cr)</th><th>Revenue ($ Mn)</th><th>FX Rate (₹/$)</th><th>QoQ INR%</th><th>QoQ USD%</th><th>YoY INR%</th><th>YoY USD%</th></tr>
          </thead>
          <tbody>
            {cd.slice(-8).reverse().map((d,i) => (
              <tr key={i}>
                <td style={{fontFamily:'Inter',fontWeight:600}}>{d.quarter}</td>
                <td>₹{d.revenue.toLocaleString()} Cr</td>
                <td style={{color:'var(--cyan)'}}>$ {d.revenueUSD?.toLocaleString()} Mn</td>
                <td style={{color:'var(--text-muted)',fontFamily:'JetBrains Mono',fontSize:11}}>₹{d.fxRate}</td>
                <td style={{color:d.qoqRevenue>=0?'var(--positive)':'var(--negative)'}}>{d.qoqRevenue!==null?`${d.qoqRevenue>0?'+':''}${d.qoqRevenue}%`:'—'}</td>
                <td style={{color:d.qoqRevenueUSD>=0?'var(--cyan)':'var(--warning)'}}>{d.qoqRevenueUSD!==null?`${d.qoqRevenueUSD>0?'+':''}${d.qoqRevenueUSD}%`:'—'}</td>
                <td style={{color:d.yoyRevenue>=0?'var(--positive)':'var(--negative)'}}>{d.yoyRevenue!==null?`${d.yoyRevenue>0?'+':''}${d.yoyRevenue}%`:'—'}</td>
                <td style={{color:d.yoyRevenueUSD>=0?'var(--cyan)':'var(--warning)'}}>{d.yoyRevenueUSD!==null?`${d.yoyRevenueUSD>0?'+':''}${d.yoyRevenueUSD}%`:'—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
