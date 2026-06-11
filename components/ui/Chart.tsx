'use client';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, RadarChart, Radar, PolarGrid, PolarAngleAxis, PieChart, Pie, Cell } from 'recharts';

export function RevenueChart({ data, colors }: { data: { quarter: string;[key: string]: number | string }[]; colors: string[] }) {
  const keys = Object.keys(data[0] || {}).filter(k => k !== 'quarter');
  return (
    <ResponsiveContainer width="100%" height={280}>
      <LineChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
        <XAxis dataKey="quarter" tick={{ fill: '#64748b', fontSize: 11 }} />
        <YAxis tick={{ fill: '#64748b', fontSize: 11 }} />
        <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: 8 }} labelStyle={{ color: '#e2e8f0' }} />
        <Legend />
        {keys.map((k, i) => <Line key={k} type="monotone" dataKey={k} stroke={colors[i % colors.length]} strokeWidth={2} dot={false} />)}
      </LineChart>
    </ResponsiveContainer>
  );
}

export function MarginChart({ data, colors }: { data: { quarter: string;[key: string]: number | string }[]; colors: string[] }) {
  const keys = Object.keys(data[0] || {}).filter(k => k !== 'quarter');
  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
        <XAxis dataKey="quarter" tick={{ fill: '#64748b', fontSize: 11 }} />
        <YAxis tick={{ fill: '#64748b', fontSize: 11 }} unit="%" />
        <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: 8 }} formatter={(v) => `${v}%`} />
        <Legend />
        {keys.map((k, i) => <Bar key={k} dataKey={k} fill={colors[i % colors.length]} radius={[4, 4, 0, 0]} />)}
      </BarChart>
    </ResponsiveContainer>
  );
}

export function GeoChart({ data }: { data: { name: string; value: number }[] }) {
  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6'];
  return (
    <ResponsiveContainer width="100%" height={200}>
      <PieChart>
        <Pie data={data} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" label={({ name, value }) => `${name} ${value}%`} labelLine={false}>
          {data.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
        </Pie>
        <Tooltip formatter={(v) => `${v}%`} contentStyle={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: 8 }} />
      </PieChart>
    </ResponsiveContainer>
  );
}

export function RadarComp({ data, keys, colors }: { data: { subject: string;[key: string]: number | string }[]; keys: string[]; colors: string[] }) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <RadarChart data={data}>
        <PolarGrid stroke="#1e293b" />
        <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 11 }} />
        {keys.map((k, i) => <Radar key={k} name={k} dataKey={k} stroke={colors[i]} fill={colors[i]} fillOpacity={0.15} strokeWidth={2} />)}
        <Legend />
        <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: 8 }} />
      </RadarChart>
    </ResponsiveContainer>
  );
}
