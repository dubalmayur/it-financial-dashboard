import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { getCompanyData } from '../data/sampleData';
import { ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, AreaChart, Area } from 'recharts';
import { CustomTooltip } from '../components/ChartComponents';

export default function EmployeeAnalysis({ company, quarter }) {
  const { darkMode } = useTheme();
  const cd = getCompanyData(company);
  const grid = darkMode ? '#1e2d47' : '#e2e8f0';
  const txt = darkMode ? '#8a9bb5' : '#64748b';
  const idx = cd.findIndex(d => d.quarter === quarter);
  const curr = idx >= 0 ? cd[idx] : cd[cd.length-1];
  const prev = idx > 0 ? cd[idx-1] : null;

  const trendData = cd.slice(-8).map(d => ({
    quarter: d.quarter.replace('FY',''),
    employees: Math.round(d.employees/1000), netAdditions: d.netAdditions,
    attrition: d.attrition, revenue: d.revenue,
  }));

  const revenuePerEmp = Math.round(curr.revenue / (curr.employees / 1000));

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Employee Analytics — {company}</div>
          <div className="page-subtitle">Headcount, attrition and workforce efficiency metrics</div>
        </div>
      </div>

      <div className="kpi-grid" style={{ gridTemplateColumns: 'repeat(4,1fr)' }}>
        {[
          { label: 'Total Employees', val: curr.employees.toLocaleString(), sub: prev ? `${curr.employees >= prev.employees ? '+' : ''}${(curr.employees-prev.employees).toLocaleString()} QoQ` : '', color: 'blue' },
          { label: 'Net Additions', val: curr.netAdditions.toLocaleString(), sub: 'This quarter', color: curr.netAdditions >= 0 ? 'green' : 'red' },
          { label: 'Attrition Rate', val: `${curr.attrition}%`, sub: prev ? `${curr.attrition >= prev.attrition ? '+' : ''}${(curr.attrition-prev.attrition).toFixed(1)}pp QoQ` : '', color: curr.attrition > 18 ? 'red' : curr.attrition > 14 ? 'orange' : 'green' },
          { label: 'Rev/1K Employees', val: `₹${revenuePerEmp} Cr`, sub: 'Productivity indicator', color: 'purple' },
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
              <div className="chart-title">Headcount Trend</div>
              <div className="chart-subtitle">Employees in thousands ('000)</div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={230}>
            <AreaChart data={trendData}>
              <defs>
                <linearGradient id="empG" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.25}/>
                  <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={grid} />
              <XAxis dataKey="quarter" tick={{ fill: txt, fontSize: 11 }} />
              <YAxis tick={{ fill: txt, fontSize: 11 }} tickFormatter={v => `${v}K`} />
              <Tooltip content={<CustomTooltip formatter={v => `${v}K employees`} />} />
              <Area type="monotone" dataKey="employees" stroke="#06b6d4" strokeWidth={2.5} fill="url(#empG)" name="Employees(K)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card">
          <div className="chart-header">
            <div>
              <div className="chart-title">Attrition Trend</div>
              <div className="chart-subtitle">Quarterly attrition rate %</div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={230}>
            <ComposedChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" stroke={grid} />
              <XAxis dataKey="quarter" tick={{ fill: txt, fontSize: 11 }} />
              <YAxis tick={{ fill: txt, fontSize: 11 }} tickFormatter={v => `${v}%`} domain={[8, 28]} />
              <Tooltip content={<CustomTooltip formatter={v => `${v}%`} />} />
              <Legend wrapperStyle={{ fontSize: 12, color: txt }} />
              <Bar dataKey="netAdditions" name="Net Additions" fill="#3b82f640" radius={[3,3,0,0]} yAxisId={0} hide />
              <Line type="monotone" dataKey="attrition" name="Attrition%" stroke="#ef4444" strokeWidth={2.5} dot={{ fill: '#ef4444', r: 4 }} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="chart-card">
        <div className="chart-header">
          <div className="chart-title">Net Additions by Quarter</div>
        </div>
        <ResponsiveContainer width="100%" height={200}>
          <ComposedChart data={trendData}>
            <CartesianGrid strokeDasharray="3 3" stroke={grid} />
            <XAxis dataKey="quarter" tick={{ fill: txt, fontSize: 11 }} />
            <YAxis tick={{ fill: txt, fontSize: 11 }} tickFormatter={v => `${v.toLocaleString()}`} />
            <Tooltip content={<CustomTooltip formatter={v => v.toLocaleString()} />} />
            <Bar dataKey="netAdditions" name="Net Additions" radius={[4,4,0,0]}
              fill="#10b981"
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      <div className="chart-card" style={{ marginTop: 16 }}>
        <div className="chart-header"><div className="chart-title">Workforce Data Table</div></div>
        <table className="data-table">
          <thead>
            <tr><th>Quarter</th><th>Total Employees</th><th>Net Additions</th><th>Attrition %</th><th>Rev/1K Emp (₹ Cr)</th><th>Trend</th></tr>
          </thead>
          <tbody>
            {cd.slice(-8).reverse().map((d, i) => {
              const prev2 = i < cd.slice(-8).length - 1 ? cd.slice(-8).reverse()[i+1] : null;
              const attrTrend = prev2 ? d.attrition - prev2.attrition : 0;
              return (
                <tr key={i}>
                  <td style={{ fontFamily: 'Inter', fontWeight: 500 }}>{d.quarter}</td>
                  <td>{d.employees.toLocaleString()}</td>
                  <td style={{ color: d.netAdditions >= 0 ? 'var(--positive)' : 'var(--negative)' }}>
                    {d.netAdditions >= 0 ? '+' : ''}{d.netAdditions.toLocaleString()}
                  </td>
                  <td style={{ color: d.attrition > 18 ? 'var(--negative)' : d.attrition > 14 ? 'var(--warning)' : 'var(--positive)' }}>
                    {d.attrition}%
                  </td>
                  <td>{Math.round(d.revenue / (d.employees/1000))}</td>
                  <td>
                    <span style={{ color: attrTrend > 0 ? 'var(--negative)' : 'var(--positive)', fontSize: 16 }}>
                      {attrTrend > 0 ? '↑' : attrTrend < 0 ? '↓' : '→'}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
