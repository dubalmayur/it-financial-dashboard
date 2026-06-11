import { ReactNode } from 'react';
import clsx from 'clsx';

interface MetricCardProps {
  label: string; value: string | number; subValue?: string;
  change?: number; icon?: ReactNode; color?: string; className?: string;
  source?: string; onClick?: () => void;
}
export function MetricCard({ label, value, subValue, change, icon, color = '#3b82f6', className, source, onClick }: MetricCardProps) {
  return (
    <div className={clsx('metric-card', className)} onClick={onClick} title={source ? `Source: ${source}` : undefined} style={{ cursor: onClick ? 'pointer' : 'default' }}>
      <div className="flex items-start justify-between mb-2">
        <span className="metric-label">{label}</span>
        {icon && <span style={{ color }}>{icon}</span>}
      </div>
      <div className="metric-value" style={{ color }}>{value}</div>
      {subValue && <div className="metric-sub">{subValue}</div>}
      {change !== undefined && (
        <div className={clsx('metric-change', change >= 0 ? 'positive' : 'negative')}>
          {change >= 0 ? '▲' : '▼'} {Math.abs(change).toFixed(1)}% YoY
        </div>
      )}
      {source && <div className="metric-source">📋 {source}</div>}
    </div>
  );
}
