'use client';
import { COMPANIES, QUARTERS, LATEST_QUARTER } from '@/lib/data';
import { MetricCard } from '../ui/MetricCard';
import { RevenueChart, MarginChart, GeoChart } from '../ui/Chart';

export default function CompanyPage({ companyId }: { companyId: string }) {
  const company = COMPANIES.find(c => c.id === companyId);
  if (!company) return <div>Company not found</div>;
  const q = company.quarters[LATEST_QUARTER];
  const revData = QUARTERS.slice(-12).map(qt => ({ quarter: qt, Revenue: company.quarters[qt].revenue }));
  const marginTrend = QUARTERS.slice(-12).map(qt => ({ quarter: qt, 'EBIT Margin': company.quarters[qt].ebitMargin }));
  const geoData = [
    { name: 'Americas', value: q.geographies.americas },
    { name: 'Europe', value: q.geographies.europe },
    { name: 'India', value: q.geographies.india },
    { name: 'RoW', value: q.geographies.rowe },
  ];
  return (
    <div>
      <div className="page-header">
        <div className="flex items-center justify-between">
          <div>
            <div className="page-title"><span className="company-dot" style={{ background: company.color, width: 12, height: 12, marginRight: 10, display: 'inline-block' }} />{company.name}</div>
            <div className="page-subtitle">{company.theme} | {company.ticker} | {company.exchange}</div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <span className={`tag ${company.cap === 'large' ? 'tag-blue' : 'tag-amber'}`}>{company.cap.toUpperCase()} CAP</span>
            <a href={company.irUrl} target="_blank" rel="noopener" className="tag tag-green">IR Website ↗</a>
          </div>
        </div>
      </div>
      <div className="grid-4 mb-6">
        <MetricCard label="Revenue (Q4FY25)" value={`$${q.revenue.toFixed(2)}B`} subValue={`₹${q.revenueINR.toLocaleString()} Cr`} change={q.revenueGrowthYoY} color={company.color} source="Quarterly Results Press Release" />
        <MetricCard label="EBIT Margin" value={`${q.ebitMargin.toFixed(1)}%`} color={company.color} source="Earnings Release" />
        <MetricCard label="PAT" value={`$${q.pat.toFixed(2)}B`} color={company.color} source="P&L Statement" />
        <MetricCard label="Deal TCV" value={`$${q.tcv.toFixed(2)}B`} color={company.color} source="Investor Presentation" />
        <MetricCard label="Free Cash Flow" value={`$${q.fcf.toFixed(2)}B`} color={company.color} source="Cash Flow Statement" />
        <MetricCard label="Cash Balance" value={`$${q.cashBalance.toFixed(2)}B`} color={company.color} source="Balance Sheet" />
        <MetricCard label="Headcount" value={q.headcount.toLocaleString()} color={company.color} source="HR Disclosure" />
        <MetricCard label="Attrition" value={`${q.attrition.toFixed(1)}%`} color={company.color} source="Earnings Call" />
      </div>
      <div className="grid-3 mb-6">
        <div className="chart-card"><div className="chart-title">Revenue Trend — 12 Quarters ($B)</div><RevenueChart data={revData} colors={[company.color]} /></div>
        <div className="chart-card"><div className="chart-title">EBIT Margin Trend (%)</div><MarginChart data={marginTrend} colors={[company.color]} /></div>
        <div className="chart-card"><div className="chart-title">Geography Mix</div><GeoChart data={geoData} /></div>
      </div>
      {q.guidance && (
        <div className="ai-module mb-6">
          <div className="ai-module-header"><span className="ai-chip">📍 GUIDANCE</span><span style={{ fontSize: 13, fontWeight: 600 }}>Management Outlook</span></div>
          <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
            <div><div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 4 }}>REVENUE GROWTH</div><span className="guidance-chip">{q.guidance.revenueGrowth}</span></div>
            <div><div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 4 }}>EBIT MARGIN BAND</div><span className="guidance-chip">{q.guidance.ebitMargin}</span></div>
          </div>
        </div>
      )}
      <div className="grid-2 mb-6">
        <div className="chart-card"><div className="chart-title">🏆 Quarter Highlights</div>{q.highlights.map((h, i) => <div key={i} className="risk-pill"><span style={{ color: company.color }}>✓</span>{h}</div>)}</div>
        <div className="chart-card"><div className="chart-title">🤝 Key Deal Wins</div>{q.dealWins.map((d, i) => <div key={i} className="risk-pill"><span style={{ color: 'var(--accent-amber)' }}>💼</span>{d}</div>)}</div>
      </div>
      <div className="section-title">Management Commentary</div>
      <div className="grid-2 mb-6">
        <div className="chart-card"><div className="chart-title">CEO</div><div className="quote-box">{q.managementQuotes.ceo}</div><div className="quote-attr">— CEO, Earnings Call {LATEST_QUARTER}</div></div>
        <div className="chart-card"><div className="chart-title">CFO</div><div className="quote-box">{q.managementQuotes.cfo}</div><div className="quote-attr">— CFO, Earnings Call {LATEST_QUARTER}</div></div>
      </div>
      <div className="ai-module mb-6">
        <div className="ai-module-header"><span className="ai-chip">🤖 AI INTEL</span><span style={{ fontSize: 13, fontWeight: 600 }}>AI Business Update</span></div>
        <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
          <div><div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 4 }}>AI REVENUE (EST.)</div><div style={{ fontSize: 22, fontWeight: 700, color: 'var(--accent-purple)', fontFamily: 'JetBrains Mono' }}>${q.aiRevenue.toFixed(2)}B</div></div>
          <div><div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 4 }}>AI CLIENTS</div><div style={{ fontSize: 22, fontWeight: 700, color: 'var(--accent-cyan)', fontFamily: 'JetBrains Mono' }}>{q.aiClients}+</div></div>
        </div>
      </div>
      <div className="section-title">Risk Factors</div>
      <div className="chart-card mb-6">{q.risks.map((r, i) => <div key={i} className="risk-pill"><span style={{ color: 'var(--accent-red)' }}>⚠</span>{r}</div>)}<div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 10 }}>Source: {q.source} | Filed: {q.filingDate}</div></div>
      <div className="section-title">12-Quarter Historical Data</div>
      <div className="table-wrap">
        <table className="data-table">
          <thead><tr><th>Quarter</th><th>Revenue ($B)</th><th>YoY %</th><th>QoQ %</th><th>EBIT%</th><th>PAT ($B)</th><th>FCF ($B)</th><th>TCV ($B)</th><th>HC</th></tr></thead>
          <tbody>
            {QUARTERS.map(qt => {
              const qd = company.quarters[qt];
              return (
                <tr key={qt} style={qt === LATEST_QUARTER ? { background: 'rgba(59,130,246,0.05)' } : {}}>
                  <td>{qt === LATEST_QUARTER ? <strong>{qt}</strong> : qt}</td>
                  <td>${qd.revenue.toFixed(2)}</td>
                  <td className={qd.revenueGrowthYoY >= 0 ? 'best-val' : 'worst-val'}>{qd.revenueGrowthYoY > 0 ? '+' : ''}{qd.revenueGrowthYoY.toFixed(1)}%</td>
                  <td>{qd.revenueGrowthQoQ > 0 ? '+' : ''}{qd.revenueGrowthQoQ.toFixed(1)}%</td>
                  <td>{qd.ebitMargin.toFixed(1)}%</td>
                  <td>${qd.pat.toFixed(2)}</td>
                  <td>${qd.fcf.toFixed(2)}</td>
                  <td>${qd.tcv.toFixed(2)}</td>
                  <td>{qd.headcount.toLocaleString()}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
