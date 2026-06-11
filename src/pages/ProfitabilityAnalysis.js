import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { useData } from '../context/DataContext';

import { LineChart, Line, ComposedChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Area } from 'recharts';
import { CustomTooltip } from '../components/ChartComponents';

export default function ProfitabilityAnalysis({ company, quarter }) {
  const { darkMode } = useTheme();
  const { getCompanyData } = useData();
  const cd = getCompanyData(company);
  const grid = darkMode ? '#1e2d47' : '#e2e8f0';
  const txt = darkMode ? '#8a9bb5' : '#64748b';

  const idx = cd.findIndex(d => d.quarter === quarter);
  const curr = idx >= 0 ? cd[idx] : cd[cd.length-1];
  const prev = idx > 0 ? cd[idx-1] : null;
  const yoy = idx >= 4 ? cd[idx-4] : null;

  const trendData = cd.slice(-8).map(d => ({
    quarter: d.quarter.replace('FY',''),
    ebit: d.ebit, pat: d.pat, ebitda: d.ebitda,
    opMargin: d.operatingMargin, netMargin: d.netMargin,
    cashFlow: d.cashFlow,
  }));

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Profitability Analysis — {company}</div>
          <div className="page-subtitle">EBIT, PAT, margins and cash flow trends</div>
        </div>
      </div>

      <div className="kpi-grid" style={{ gridTemplateColumns: 'repeat(4,1fr)' }}>
        {[
          { label: 'EBIT', val: `₹${(curr.ebit/1000).toFixed(1)}K Cr`, sub: prev ? `${curr.ebit >= prev.ebit ? '+' : ''}${((curr.ebit-prev.ebit)/prev.ebit*100).toFixed(1)}% QoQ` : '', color: 'blue' },
          { label: 'EBITDA', val: `₹${(curr.ebitda/1000).toFixed(1)}K Cr`, sub: `₹${((curr.ebitda-curr.ebit)/1000).toFixed(1)}K D&A`, color: 'cyan' },
          { label: 'PAT', val: `₹${(curr.pat/1000).toFixed(1)}K Cr`, sub: prev ? `${curr.pat >= prev.pat ? '+' : ''}${((curr.pat-prev.pat)/prev.pat*100).toFixed(1)}% QoQ` : '', color: 'green' },
          { label: 'Free Cash Flow', val: `₹${(curr.cashFlow/1000).toFixed(1)}K Cr`, sub: `${(curr.cashFlow/curr.ebit*100).toFixed(0)}% of EBIT`, color: 'purple' },
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
          <div className="chart-header">
            <div>
              <div className="chart-title">EBIT & PAT Trend</div>
              <div className="chart-subtitle">₹ Crore</div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={230}>
            <ComposedChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" stroke={grid} />
              <XAxis dataKey="quarter" tick={{ fill: txt, fontSize: 11 }} />
              <YAxis tick={{ fill: txt, fontSize: 11 }} tickFormatter={v => `${(v/1000).toFixed(0)}K`} />
              <Tooltip content={<CustomTooltip formatter={v => `₹${v.toLocaleString()} Cr`} />} />
              <Legend wrapperStyle={{ fontSize: 12, color: txt }} />
              <Bar dataKey="ebit" name="EBIT" fill="#3b82f680" radius={[4,4,0,0]} />
              <Line type="monotone" dataKey="pat" name="PAT" stroke="#10b981" strokeWidth={2.5} dot={false} />
              <Line type="monotone" dataKey="ebitda" name="EBITDA" stroke="#8b5cf6" strokeWidth={2} dot={false} strokeDasharray="4 2" />
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card">
          <div className="chart-header">
            <div>
              <div className="chart-title">Margin Trend</div>
              <div className="chart-subtitle">Operating & Net Margin %</div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={230}>
            <LineChart data={trendData}>
              <defs>
                <linearGradient id="opG" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={grid} />
              <XAxis dataKey="quarter" tick={{ fill: txt, fontSize: 11 }} />
              <YAxis tick={{ fill: txt, fontSize: 11 }} tickFormatter={v => `${v}%`} domain={[10, 35]} />
              <Tooltip content={<CustomTooltip formatter={v => `${v}%`} />} />
              <Legend wrapperStyle={{ fontSize: 12, color: txt }} />
              <Line type="monotone" dataKey="opMargin" name="Op.Margin%" stroke="#3b82f6" strokeWidth={2.5} dot={{ fill: '#3b82f6', r: 3 }} />
              <Line type="monotone" dataKey="netMargin" name="Net.Margin%" stroke="#10b981" strokeWidth={2} dot={{ fill: '#10b981', r: 3 }} strokeDasharray="4 2" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="chart-card">
        <div className="chart-header"><div className="chart-title">Profitability Summary Table — Last 8 Quarters</div></div>
        <table className="data-table">
          <thead>
            <tr><th>Quarter</th><th>Revenue</th><th>EBIT</th><th>Op. Margin</th><th>PAT</th><th>Net Margin</th><th>EPS (₹)</th><th>Cash Flow</th></tr>
          </thead>
          <tbody>
            {cd.slice(-8).reverse().map((d, i) => (
              <tr key={i}>
                <td style={{ fontFamily: 'Inter', fontWeight: 500 }}>{d.quarter}</td>
                <td>₹{(d.revenue/1000).toFixed(1)}K</td>
                <td>₹{(d.ebit/1000).toFixed(1)}K</td>
                <td style={{ color: d.operatingMargin >= 22 ? 'var(--positive)' : d.operatingMargin >= 18 ? 'var(--warning)' : 'var(--negative)' }}>{d.operatingMargin}%</td>
                <td>₹{(d.pat/1000).toFixed(1)}K</td>
                <td style={{ color: d.netMargin >= 18 ? 'var(--positive)' : 'var(--text-secondary)' }}>{d.netMargin}%</td>
                <td>₹{d.eps}</td>
                <td>₹{(d.cashFlow/1000).toFixed(1)}K</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
