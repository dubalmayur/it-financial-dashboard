import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { companies, getQuarterData, quarters, allData } from '../data/sampleData';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, RadarChart, Radar, PolarGrid, PolarAngleAxis, LineChart, Line } from 'recharts';
import { CustomTooltip } from '../components/ChartComponents';

const COLORS = ['#3b82f6','#10b981','#8b5cf6','#f59e0b','#ef4444','#06b6d4','#ec4899'];

export default function CompanyComparison() {
  const { darkMode } = useTheme();
  const [selectedCompanies, setSelectedCompanies] = useState(['TCS','Infosys','HCLTech','Wipro']);
  const [selectedQuarter, setSelectedQuarter] = useState('Q4FY25');
  const [metric, setMetric] = useState('revenue');
  const grid = darkMode ? '#1e2d47' : '#e2e8f0';
  const txt = darkMode ? '#8a9bb5' : '#64748b';

  const toggleCompany = (c) => {
    setSelectedCompanies(prev =>
      prev.includes(c) ? prev.filter(x => x !== c) : prev.length < 7 ? [...prev, c] : prev
    );
  };

  const qData = getQuarterData(selectedQuarter).filter(d => selectedCompanies.includes(d.company));
  const sortedByRev = [...qData].sort((a, b) => b.revenue - a.revenue);

  const metricOpts = [
    { val: 'revenue', label: 'Revenue' },
    { val: 'pat', label: 'PAT' },
    { val: 'operatingMargin', label: 'Op. Margin %' },
    { val: 'employees', label: 'Employees' },
  ];

  // Trend data for selected metric across last 6 quarters
  const trendData = quarters.slice(-8).map(q => {
    const row = { quarter: q.replace('FY','') };
    selectedCompanies.forEach(c => {
      const d = allData.find(x => x.company === c && x.quarter === q);
      if (d) row[c] = metric === 'revenue' || metric === 'pat' ? Math.round(d[metric]/1000*10)/10 : d[metric];
    });
    return row;
  });

  // Radar data
  const radarData = ['revenue','operatingMargin','pat','employees','totalClients','attrition'].map(m => {
    const row = { metric: m === 'attrition' ? 'Attrition⬇' : m.charAt(0).toUpperCase() + m.slice(1).replace(/([A-Z])/g,' $1') };
    const vals = qData.map(d => m === 'attrition' ? 100 - d[m] * 2 : d[m]);
    const max = Math.max(...vals) || 1;
    qData.forEach(d => {
      row[d.company] = m === 'attrition' ? Math.round((100 - d[m]*2) / max * 100) : Math.round(d[m] / max * 100);
    });
    return row;
  });

  const selectStyle = { background: darkMode ? '#1a2235' : '#fff', border: `1px solid ${darkMode ? '#1e2d47' : '#e2e8f0'}`, color: darkMode ? '#e8edf5' : '#0f172a', borderRadius: 6, padding: '6px 10px', fontSize: 12, cursor: 'pointer', fontFamily: 'Inter' };

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Company Comparison</div>
          <div className="page-subtitle">Side-by-side benchmarking across IT majors</div>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <select value={selectedQuarter} onChange={e => setSelectedQuarter(e.target.value)} style={selectStyle}>
            {quarters.map(q => <option key={q} value={q}>{q}</option>)}
          </select>
          <select value={metric} onChange={e => setMetric(e.target.value)} style={selectStyle}>
            {metricOpts.map(o => <option key={o.val} value={o.val}>{o.label}</option>)}
          </select>
        </div>
      </div>

      {/* Company toggles */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 20 }}>
        {companies.map((c, i) => (
          <button key={c} onClick={() => toggleCompany(c)}
            style={{ padding: '6px 14px', borderRadius: 20, border: `1px solid ${selectedCompanies.includes(c) ? COLORS[i % COLORS.length] : (darkMode ? '#1e2d47' : '#e2e8f0')}`, background: selectedCompanies.includes(c) ? `${COLORS[i % COLORS.length]}20` : 'transparent', color: selectedCompanies.includes(c) ? COLORS[i % COLORS.length] : 'var(--text-secondary)', cursor: 'pointer', fontSize: 12, fontWeight: 600, fontFamily: 'Inter' }}>
            {c}
          </button>
        ))}
      </div>

      <div className="charts-grid">
        <div className="chart-card">
          <div className="chart-header"><div className="chart-title">Revenue Comparison — {selectedQuarter}</div></div>
          <ResponsiveContainer width="100%" height={230}>
            <BarChart data={sortedByRev} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke={grid} horizontal={false} />
              <XAxis type="number" tick={{ fill: txt, fontSize: 11 }} tickFormatter={v => `${(v/1000).toFixed(0)}K`} />
              <YAxis dataKey="company" type="category" tick={{ fill: txt, fontSize: 12 }} width={90} />
              <Tooltip content={<CustomTooltip formatter={v => `₹${v.toLocaleString()} Cr`} />} />
              <Bar dataKey="revenue" name="Revenue" radius={[0,4,4,0]}>
                {sortedByRev.map((d, i) => {
                  const ci = selectedCompanies.indexOf(d.company);
                  return <rect key={i} fill={COLORS[ci % COLORS.length]} />;
                })}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card">
          <div className="chart-header"><div className="chart-title">Operating Margin Comparison</div></div>
          <ResponsiveContainer width="100%" height={230}>
            <BarChart data={[...qData].sort((a,b) => b.operatingMargin - a.operatingMargin)}>
              <CartesianGrid strokeDasharray="3 3" stroke={grid} />
              <XAxis dataKey="company" tick={{ fill: txt, fontSize: 11 }} />
              <YAxis tick={{ fill: txt, fontSize: 11 }} tickFormatter={v => `${v}%`} domain={[15, 35]} />
              <Tooltip content={<CustomTooltip formatter={v => `${v}%`} />} />
              <Bar dataKey="operatingMargin" name="Op. Margin%" radius={[4,4,0,0]}>
                {qData.sort((a,b) => b.operatingMargin - a.operatingMargin).map((d, i) => {
                  const ci = selectedCompanies.indexOf(d.company);
                  return <rect key={i} fill={COLORS[ci % COLORS.length]} />;
                })}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="charts-grid single">
        <div className="chart-card">
          <div className="chart-header">
            <div><div className="chart-title">Trend Comparison — {metricOpts.find(o=>o.val===metric)?.label}</div></div>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" stroke={grid} />
              <XAxis dataKey="quarter" tick={{ fill: txt, fontSize: 11 }} />
              <YAxis tick={{ fill: txt, fontSize: 11 }} tickFormatter={v => metric === 'revenue' || metric === 'pat' ? `${v}K` : metric === 'employees' ? `${(v/1000).toFixed(0)}K` : `${v}%`} />
              <Tooltip />
              <Legend wrapperStyle={{ fontSize: 12, color: txt }} />
              {selectedCompanies.map((c, i) => (
                <Line key={c} type="monotone" dataKey={c} stroke={COLORS[i % COLORS.length]} strokeWidth={2} dot={false} />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="chart-card">
        <div className="chart-header"><div className="chart-title">Comparative Metrics Table — {selectedQuarter}</div></div>
        <table className="data-table">
          <thead>
            <tr><th>Company</th><th>Revenue (₹ Cr)</th><th>PAT</th><th>Op.Margin</th><th>Employees</th><th>Attrition</th><th>Clients</th><th>Large Deals</th></tr>
          </thead>
          <tbody>
            {sortedByRev.map((d, i) => (
              <tr key={i}>
                <td style={{ fontFamily: 'Inter', fontWeight: 700, color: COLORS[selectedCompanies.indexOf(d.company) % COLORS.length] }}>{d.company}</td>
                <td>₹{d.revenue.toLocaleString()}</td>
                <td>₹{d.pat.toLocaleString()}</td>
                <td style={{ color: d.operatingMargin >= 22 ? 'var(--positive)' : 'var(--warning)' }}>{d.operatingMargin}%</td>
                <td>{(d.employees/1000).toFixed(0)}K</td>
                <td style={{ color: d.attrition > 18 ? 'var(--negative)' : d.attrition > 14 ? 'var(--warning)' : 'var(--positive)' }}>{d.attrition}%</td>
                <td>{d.totalClients.toLocaleString()}</td>
                <td>{d.largeDeals}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
