import React from 'react';

export const CustomTooltip = ({ active, payload, label, formatter }) => {
  if (!active || !payload || !payload.length) return null;
  return (
    <div className="custom-tooltip">
      <div className="label">{label}</div>
      {payload.map((p, i) => (
        <div key={i} style={{ display: 'flex', justifyContent: 'space-between', gap: 16, marginBottom: 3 }}>
          <span style={{ color: p.color, fontSize: 12 }}>{p.name}</span>
          <span className="value">{formatter ? formatter(p.value) : p.value}</span>
        </div>
      ))}
    </div>
  );
};

export const fmtRevenue = (v) => v >= 1000 ? `₹${(v/1000).toFixed(1)}K Cr` : `₹${v} Cr`;
export const fmtPct = (v) => `${v}%`;
export const fmtNum = (v) => v ? v.toLocaleString() : '-';

export default CustomTooltip;
