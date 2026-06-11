import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { getCompanyData, getGrowthData } from '../data/sampleData';
import { AreaChart, Area, LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Legend } from 'recharts';
import { CustomTooltip, fmtRevenue } from '../components/ChartComponents';

export default function RevenueAnalysis({ company, quarter }) {
  const { darkMode } = useTheme();
  const cd = getGrowthData(company);
  const grid = darkMode ? '#1e2d47' : '#e2e8f0';
  const txt = darkMode ? '#8a9bb5' : '#64748b';

  const idx = cd.findIndex(d => d.quarter === quarter);
  const curr = idx >= 0 ? cd[idx] : cd[cd.length-1];

  // CAGR
  const first = cd[0];
  const last = cd[cd.length-1];
  const years = (cd.length-1)/4;
  const cagr = ((Math.pow(last.revenue/first.revenue, 1/years) - 1)*100).toFixed(1);

  const recent8 = cd.slice(-8);

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Revenue Analysis — {company}</div>
          <div className="page-subtitle">Quarterly trends, growth rates & CAGR analysis</div>
        </div>
      </div>

      <div className="kpi-grid" style={{ gridTemplateColumns: 'repeat(4,1fr)' }}>
        {[
          { label: 'Latest Revenue', val: `₹${(curr.revenue/1000).toFixed(1)}K Cr`, color: 'blue' },
          { label: 'QoQ Growth', val: curr.qoqRevenue !== null ? `${curr.qoqRevenue > 0 ? '+' : ''}${curr.qoqRevenue}%` : 'N/A', color: curr.qoqRevenue >= 0 ? 'green' : 'red' },
          { label: 'YoY Growth', val: curr.yoyRevenue !== null ? `${curr.yoyRevenue > 0 ? '+' : ''}${curr.yoyRevenue}%` : 'N/A', color: curr.yoyRevenue >= 0 ? 'cyan' : 'orange' },
          { label: '3-Year CAGR', val: `${cagr}%`, color: 'purple' },
        ].map((k, i) => (
          <div key={i} className={`kpi-card ${k.color}`}>
            <div className="kpi-label">{k.label}</div>
            <div className="kpi-value small">{k.val}</div>
          </div>
        ))}
      </div>

      <div className="charts-grid single">
        <div className="chart-card">
          <div className="chart-header">
            <div>
              <div className="chart-title">Quarterly Revenue Trend</div>
              <div className="chart-subtitle">All quarters · INR Crore</div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={cd}>
              <defs>
                <linearGradient id="revG" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.25}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={grid} />
              <XAxis dataKey="quarter" tick={{ fill: txt, fontSize: 11 }} />
              <YAxis tick={{ fill: txt, fontSize: 11 }} tickFormatter={v => `${(v/1000).toFixed(0)}K`} />
              <Tooltip content={<CustomTooltip formatter={fmtRevenue} />} />
              <Area type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={2.5} fill="url(#revG)" name="Revenue" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="charts-grid">
        <div className="chart-card">
          <div className="chart-header">
            <div>
              <div className="chart-title">QoQ Revenue Growth %</div>
              <div className="chart-subtitle">Quarter-on-Quarter change</div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={recent8.filter(d => d.qoqRevenue !== null)}>
              <CartesianGrid strokeDasharray="3 3" stroke={grid} />
              <XAxis dataKey="quarter" tick={{ fill: txt, fontSize: 11 }} />
              <YAxis tick={{ fill: txt, fontSize: 11 }} tickFormatter={v => `${v}%`} />
              <Tooltip content={<CustomTooltip formatter={v => `${v}%`} />} />
              <ReferenceLine y={0} stroke={grid} />
              <Bar dataKey="qoqRevenue" name="QoQ Growth" fill="#3b82f6"
                radius={[4,4,0,0]}
                label={false}
                cells={recent8.filter(d => d.qoqRevenue !== null).map((d, i) => (
                  <React.Fragment key={i} />
                ))}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card">
          <div className="chart-header">
            <div>
              <div className="chart-title">YoY Revenue Growth %</div>
              <div className="chart-subtitle">Year-on-Year comparison</div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={cd.filter(d => d.yoyRevenue !== null)}>
              <CartesianGrid strokeDasharray="3 3" stroke={grid} />
              <XAxis dataKey="quarter" tick={{ fill: txt, fontSize: 11 }} />
              <YAxis tick={{ fill: txt, fontSize: 11 }} tickFormatter={v => `${v}%`} />
              <Tooltip content={<CustomTooltip formatter={v => `${v}%`} />} />
              <ReferenceLine y={0} stroke={grid} />
              <Line type="monotone" dataKey="yoyRevenue" stroke="#10b981" strokeWidth={2.5} dot={{ fill: '#10b981', r: 4 }} name="YoY Growth%" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="chart-card">
        <div className="chart-header"><div className="chart-title">Revenue Breakdown Table</div></div>
        <table className="data-table">
          <thead>
            <tr><th>Quarter</th><th>Revenue (₹ Cr)</th><th>QoQ %</th><th>YoY %</th><th>Running CAGR</th></tr>
          </thead>
          <tbody>
            {cd.slice(-8).reverse().map((d, i) => {
              const runningYears = (cd.length - 1 - cd.findIndex(x => x.quarter === d.quarter)) / 4;
              const runCagr = runningYears > 0 ? ((Math.pow(last.revenue/d.revenue, 1/runningYears)-1)*100).toFixed(1) : '—';
              return (
                <tr key={i}>
                  <td style={{ fontFamily: 'Inter', fontWeight: 500 }}>{d.quarter}</td>
                  <td>₹{d.revenue.toLocaleString()} Cr</td>
                  <td style={{ color: d.qoqRevenue >= 0 ? 'var(--positive)' : 'var(--negative)' }}>
                    {d.qoqRevenue !== null ? `${d.qoqRevenue > 0 ? '+' : ''}${d.qoqRevenue}%` : '—'}
                  </td>
                  <td style={{ color: d.yoyRevenue >= 0 ? 'var(--accent)' : 'var(--warning)' }}>
                    {d.yoyRevenue !== null ? `${d.yoyRevenue > 0 ? '+' : ''}${d.yoyRevenue}%` : '—'}
                  </td>
                  <td>{runCagr !== '—' ? `${runCagr}%` : '—'}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
