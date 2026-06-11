import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { getCompanyData } from '../data/sampleData';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';
import { CustomTooltip } from '../components/ChartComponents';

const COLORS = ['#3b82f6','#10b981','#8b5cf6','#f59e0b','#ef4444','#06b6d4'];

export function VerticalAnalysis({ company, quarter }) {
  const { darkMode } = useTheme();
  const cd = getCompanyData(company);
  const grid = darkMode ? '#1e2d47' : '#e2e8f0';
  const txt = darkMode ? '#8a9bb5' : '#64748b';

  const recent6 = cd.slice(-6).map(d => ({
    quarter: d.quarter.replace('FY',''),
    BFSI: Math.round(d.bfsiRevenue/1000*10)/10,
    Retail: Math.round(d.retailRevenue/1000*10)/10,
    Manufacturing: Math.round(d.mfgRevenue/1000*10)/10,
    Healthcare: Math.round(d.healthcareRevenue/1000*10)/10,
    Telecom: Math.round(d.telecomRevenue/1000*10)/10,
    Energy: Math.round(d.energyRevenue/1000*10)/10,
  }));

  const idx = cd.findIndex(d => d.quarter === quarter);
  const curr = idx >= 0 ? cd[idx] : cd[cd.length-1];
  const pieData = [
    { name: 'BFSI', value: Math.round(curr.bfsiRevenue/curr.revenue*100) },
    { name: 'Retail', value: Math.round(curr.retailRevenue/curr.revenue*100) },
    { name: 'Manufacturing', value: Math.round(curr.mfgRevenue/curr.revenue*100) },
    { name: 'Healthcare', value: Math.round(curr.healthcareRevenue/curr.revenue*100) },
    { name: 'Telecom', value: Math.round(curr.telecomRevenue/curr.revenue*100) },
    { name: 'Energy', value: Math.round(curr.energyRevenue/curr.revenue*100) },
  ];

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Business Verticals — {company}</div>
          <div className="page-subtitle">Revenue mix across industry segments · ₹K Crore</div>
        </div>
      </div>

      <div className="charts-grid">
        <div className="chart-card" style={{ gridColumn: '1 / -1' }}>
          <div className="chart-header">
            <div className="chart-title">Stacked Revenue by Vertical — Last 6 Quarters</div>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={recent6}>
              <CartesianGrid strokeDasharray="3 3" stroke={grid} />
              <XAxis dataKey="quarter" tick={{ fill: txt, fontSize: 11 }} />
              <YAxis tick={{ fill: txt, fontSize: 11 }} tickFormatter={v => `${v}K`} />
              <Tooltip content={<CustomTooltip formatter={v => `₹${v}K Cr`} />} />
              <Legend wrapperStyle={{ fontSize: 12, color: txt }} />
              {['BFSI','Retail','Manufacturing','Healthcare','Telecom','Energy'].map((v, i) => (
                <Bar key={v} dataKey={v} stackId="a" fill={COLORS[i]} radius={i === 5 ? [4,4,0,0] : [0,0,0,0]} />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="charts-grid">
        <div className="chart-card">
          <div className="chart-header"><div className="chart-title">Vertical Mix — {quarter}</div></div>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" outerRadius={100} innerRadius={50} dataKey="value" nameKey="name" label={({ name, value }) => `${name} ${value}%`} labelLine={{ stroke: txt }}>
                {pieData.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
              </Pie>
              <Tooltip formatter={v => `${v}%`} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card">
          <div className="chart-header"><div className="chart-title">Vertical Revenue — {quarter}</div></div>
          <table className="data-table">
            <thead><tr><th>Vertical</th><th>Revenue (₹ Cr)</th><th>Mix %</th></tr></thead>
            <tbody>
              {[
                ['BFSI', curr.bfsiRevenue], ['Retail', curr.retailRevenue], ['Manufacturing', curr.mfgRevenue],
                ['Healthcare', curr.healthcareRevenue], ['Telecom', curr.telecomRevenue], ['Energy', curr.energyRevenue],
              ].sort((a, b) => b[1] - a[1]).map(([name, val], i) => (
                <tr key={i}>
                  <td style={{ fontFamily: 'Inter', display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ width: 8, height: 8, borderRadius: '50%', background: COLORS[i], display: 'inline-block' }}></span>
                    {name}
                  </td>
                  <td>₹{val.toLocaleString()}</td>
                  <td style={{ color: 'var(--accent)' }}>{(val/curr.revenue*100).toFixed(1)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export function GeographyAnalysis({ company, quarter }) {
  const { darkMode } = useTheme();
  const cd = getCompanyData(company);
  const grid = darkMode ? '#1e2d47' : '#e2e8f0';
  const txt = darkMode ? '#8a9bb5' : '#64748b';

  const trendData = cd.slice(-8).map(d => ({
    quarter: d.quarter.replace('FY',''),
    'North America': Math.round(d.naRevenue/1000*10)/10,
    'Europe': Math.round(d.euRevenue/1000*10)/10,
    'India': Math.round(d.indiaRevenue/1000*10)/10,
    'APAC': Math.round(d.apacRevenue/1000*10)/10,
  }));

  const idx = cd.findIndex(d => d.quarter === quarter);
  const curr = idx >= 0 ? cd[idx] : cd[cd.length-1];
  const geoData = [
    { name: 'North America', value: curr.naRevenue },
    { name: 'Europe', value: curr.euRevenue },
    { name: 'India', value: curr.indiaRevenue },
    { name: 'APAC', value: curr.apacRevenue },
  ];
  const GEO_COLORS = ['#3b82f6','#10b981','#f59e0b','#8b5cf6'];

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Geography Analysis — {company}</div>
          <div className="page-subtitle">Region-wise revenue breakdown · ₹K Crore</div>
        </div>
      </div>

      <div className="charts-grid single">
        <div className="chart-card">
          <div className="chart-header"><div className="chart-title">Stacked Area — Regional Revenue Trend</div></div>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={trendData}>
              <defs>
                {GEO_COLORS.map((c, i) => (
                  <linearGradient key={i} id={`geoG${i}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={c} stopOpacity={0.3}/>
                    <stop offset="95%" stopColor={c} stopOpacity={0.05}/>
                  </linearGradient>
                ))}
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={grid} />
              <XAxis dataKey="quarter" tick={{ fill: txt, fontSize: 11 }} />
              <YAxis tick={{ fill: txt, fontSize: 11 }} tickFormatter={v => `${v}K`} />
              <Tooltip content={<CustomTooltip formatter={v => `₹${v}K Cr`} />} />
              <Legend wrapperStyle={{ fontSize: 12, color: txt }} />
              {['North America','Europe','India','APAC'].map((g, i) => (
                <Area key={g} type="monotone" dataKey={g} stackId="1" stroke={GEO_COLORS[i]} fill={`url(#geoG${i})`} strokeWidth={1.5} />
              ))}
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="charts-grid">
        <div className="chart-card">
          <div className="chart-header"><div className="chart-title">Geography Mix — {quarter}</div></div>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie data={geoData} cx="50%" cy="50%" outerRadius={100} innerRadius={50} dataKey="value" nameKey="name"
                label={({ name, value }) => `${name.split(' ')[0]} ${(value/curr.revenue*100).toFixed(0)}%`} labelLine={{ stroke: txt }}>
                {geoData.map((_, i) => <Cell key={i} fill={GEO_COLORS[i]} />)}
              </Pie>
              <Tooltip formatter={v => `₹${v.toLocaleString()} Cr`} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card">
          <div className="chart-header"><div className="chart-title">Geography Revenue — {quarter}</div></div>
          <table className="data-table">
            <thead><tr><th>Region</th><th>Revenue (₹ Cr)</th><th>Mix %</th></tr></thead>
            <tbody>
              {geoData.sort((a, b) => b.value - a.value).map((g, i) => (
                <tr key={i}>
                  <td style={{ fontFamily: 'Inter', display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ width: 8, height: 8, borderRadius: '50%', background: GEO_COLORS[geoData.indexOf(g)], display: 'inline-block' }}></span>
                    {g.name}
                  </td>
                  <td>₹{g.value.toLocaleString()}</td>
                  <td style={{ color: 'var(--accent)' }}>{(g.value/curr.revenue*100).toFixed(1)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export function ClientAnalysis({ company, quarter }) {
  const { darkMode } = useTheme();
  const cd = getCompanyData(company);
  const grid = darkMode ? '#1e2d47' : '#e2e8f0';
  const txt = darkMode ? '#8a9bb5' : '#64748b';

  const idx = cd.findIndex(d => d.quarter === quarter);
  const curr = idx >= 0 ? cd[idx] : cd[cd.length-1];
  const prev = idx > 0 ? cd[idx-1] : null;

  const trendData = cd.slice(-8).map(d => ({
    quarter: d.quarter.replace('FY',''),
    total: d.totalClients, m1: d.clients1M, m5: d.clients5M, m10: d.clients10M, deals: d.largeDeals,
  }));

  const funnelData = [
    { name: 'Total Clients', value: curr.totalClients, color: '#3b82f6' },
    { name: '$1M+ Clients', value: curr.clients1M, color: '#10b981' },
    { name: '$5M+ Clients', value: curr.clients5M, color: '#8b5cf6' },
    { name: '$10M+ Clients', value: curr.clients10M, color: '#f59e0b' },
  ];

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Client Metrics — {company}</div>
          <div className="page-subtitle">Client pyramid, large deals and high-value client tracking</div>
        </div>
      </div>

      <div className="kpi-grid" style={{ gridTemplateColumns: 'repeat(4,1fr)' }}>
        {[
          { label: 'Total Clients', val: curr.totalClients.toLocaleString(), sub: prev ? `+${curr.totalClients - prev.totalClients} QoQ` : '', color: 'blue' },
          { label: '$1M+ Clients', val: curr.clients1M.toLocaleString(), sub: `${(curr.clients1M/curr.totalClients*100).toFixed(0)}% of base`, color: 'green' },
          { label: '$5M+ Clients', val: curr.clients5M.toLocaleString(), sub: `${(curr.clients5M/curr.totalClients*100).toFixed(1)}% of base`, color: 'purple' },
          { label: 'Large Deal Wins', val: curr.largeDeals, sub: 'This quarter', color: 'orange' },
        ].map((k, i) => (
          <div key={i} className={`kpi-card ${k.color}`}>
            <div className="kpi-label">{k.label}</div>
            <div className="kpi-value small">{k.val}</div>
            <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginTop: 4 }}>{k.sub}</div>
          </div>
        ))}
      </div>

      <div className="charts-grid">
        <div className="chart-card">
          <div className="chart-header"><div className="chart-title">Client Pyramid — {quarter}</div></div>
          <div style={{ padding: '10px 0' }}>
            {funnelData.map((f, i) => {
              const pct = f.value / funnelData[0].value;
              return (
                <div key={i} style={{ marginBottom: 12 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4, fontSize: 12, color: 'var(--text-secondary)' }}>
                    <span>{f.name}</span>
                    <span style={{ color: f.color, fontFamily: 'JetBrains Mono', fontWeight: 600 }}>{f.value.toLocaleString()}</span>
                  </div>
                  <div style={{ background: 'var(--border)', borderRadius: 4, height: 10 }}>
                    <div style={{ width: `${pct * 100}%`, height: '100%', background: f.color, borderRadius: 4, transition: 'width 0.5s ease' }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="chart-card">
          <div className="chart-header"><div className="chart-title">Large Deal Wins Trend</div></div>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" stroke={grid} />
              <XAxis dataKey="quarter" tick={{ fill: txt, fontSize: 11 }} />
              <YAxis tick={{ fill: txt, fontSize: 11 }} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="deals" name="Large Deals" fill="#f59e0b" radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="chart-card">
        <div className="chart-header"><div className="chart-title">Client Metrics Table — Last 8 Quarters</div></div>
        <table className="data-table">
          <thead>
            <tr><th>Quarter</th><th>Total Clients</th><th>$1M+</th><th>$5M+</th><th>$10M+</th><th>Large Deals</th><th>Penetration</th></tr>
          </thead>
          <tbody>
            {cd.slice(-8).reverse().map((d, i) => (
              <tr key={i}>
                <td style={{ fontFamily: 'Inter', fontWeight: 500 }}>{d.quarter}</td>
                <td>{d.totalClients.toLocaleString()}</td>
                <td>{d.clients1M.toLocaleString()}</td>
                <td>{d.clients5M.toLocaleString()}</td>
                <td>{d.clients10M.toLocaleString()}</td>
                <td style={{ color: 'var(--warning)' }}>{d.largeDeals}</td>
                <td style={{ color: 'var(--accent)' }}>{(d.clients1M/d.totalClients*100).toFixed(0)}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
