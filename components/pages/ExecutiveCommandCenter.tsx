'use client';
import { COMPANIES, QUARTERS, getSectorTotals, LATEST_QUARTER } from '@/lib/data';
import { MetricCard } from '../ui/MetricCard';
import { RevenueChart, MarginChart } from '../ui/Chart';

export default function ExecutiveCommandCenter() {
  const totals = getSectorTotals(LATEST_QUARTER);
  const prevTotals = getSectorTotals('Q4FY24');

  const revenueData = QUARTERS.slice(-8).map(q => {
    const t = getSectorTotals(q);
    return { quarter: q, 'Sector Revenue': +t.revenue.toFixed(1) };
  });

  const marginData = QUARTERS.slice(-8).map(q => ({
    quarter: q,
    ...Object.fromEntries(COMPANIES.slice(0,4).map(c => [c.shortName, c.quarters[q].ebitMargin]))
  }));

  const yoyRev = ((totals.revenue - prevTotals.revenue) / prevTotals.revenue * 100);
  const COLORS = COMPANIES.map(c => c.color);

  return (
    <div>
      <div className="page-header">
        <div className="flex items-center justify-between">
          <div>
            <div className="page-title">⚡ Executive Command Center</div>
            <div className="page-subtitle">Indian IT Sector — Q4FY25 | 10 Companies | Institutional Intelligence Dashboard</div>
          </div>
          <span className="tag tag-green">Q4FY25 LIVE</span>
        </div>
      </div>

      {/* KPI Row */}
      <div className="grid-5 mb-6">
        <MetricCard label="Total Sector Revenue" value={`$${totals.revenue.toFixed(1)}B`} subValue={`₹${(totals.revenue * 83.5 / 100).toFixed(0)}K Cr`} change={yoyRev} color="#3b82f6" source="Company IR Websites — Q4FY25" />
        <MetricCard label="Total Sector PAT" value={`$${totals.pat.toFixed(1)}B`} change={((totals.pat - prevTotals.pat) / prevTotals.pat * 100)} color="#10b981" source="Company Earnings Releases" />
        <MetricCard label="Total Deal TCV" value={`$${totals.tcv.toFixed(1)}B`} change={((totals.tcv - prevTotals.tcv) / prevTotals.tcv * 100)} color="#f59e0b" source="Company Investor Presentations" />
        <MetricCard label="Sector Cash & Equivalents" value={`$${totals.cashBalance.toFixed(1)}B`} color="#8b5cf6" source="Balance Sheet Filings" />
        <MetricCard label="AI Revenue (Est.)" value={`$${totals.aiRevenue.toFixed(1)}B`} change={((totals.aiRevenue - prevTotals.aiRevenue) / prevTotals.aiRevenue * 100)} color="#06b6d4" source="Management Commentary / IR Disclosures" />
      </div>

      {/* Charts Row */}
      <div className="grid-2 mb-6">
        <div className="chart-card">
          <div className="chart-title">📊 Sector Revenue Trend (8 Quarters) — USD Billion</div>
          <RevenueChart data={revenueData} colors={['#3b82f6']} />
        </div>
        <div className="chart-card">
          <div className="chart-title">📈 EBIT Margin Trends — Large Cap (%)</div>
          <MarginChart data={marginData} colors={COLORS} />
        </div>
      </div>

      {/* Company Matrix */}
      <div className="section-title">Company Performance Matrix — Q4FY25</div>
      <div className="table-wrap mb-6">
        <table className="data-table">
          <thead>
            <tr>
              <th>Company</th><th>Revenue (USD)</th><th>YoY %</th><th>EBIT Margin</th><th>PAT (USD)</th><th>TCV (USD)</th><th>Headcount</th><th>Attrition</th><th>AI Rev</th><th>Source</th>
            </tr>
          </thead>
          <tbody>
            {COMPANIES.map(c => {
              const q = c.quarters[LATEST_QUARTER];
              return (
                <tr key={c.id}>
                  <td><span className="company-dot" style={{ background: c.color }} /> {c.shortName}</td>
                  <td>${q.revenue.toFixed(2)}B</td>
                  <td className={q.revenueGrowthYoY >= 0 ? 'best-val' : 'worst-val'}>{q.revenueGrowthYoY > 0 ? '+' : ''}{q.revenueGrowthYoY.toFixed(1)}%</td>
                  <td>{q.ebitMargin.toFixed(1)}%</td>
                  <td>${q.pat.toFixed(2)}B</td>
                  <td>${q.tcv.toFixed(1)}B</td>
                  <td>{q.headcount.toLocaleString()}</td>
                  <td>{q.attrition.toFixed(1)}%</td>
                  <td>${q.aiRevenue.toFixed(2)}B</td>
                  <td><a href={c.irUrl} target="_blank" rel="noopener" className="tag tag-blue">IR ↗</a></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* AI Module */}
      <div className="ai-module mb-6">
        <div className="ai-module-header">
          <span className="ai-chip">🤖 AI SUMMARY</span>
          <span style={{ fontSize: 13, fontWeight: 600 }}>Q4FY25 Sector Intelligence Brief</span>
        </div>
        <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.7 }}>
          Indian IT sector delivered <strong style={{ color: 'var(--text-primary)' }}>resilient Q4FY25 performance</strong> with aggregate sector revenue of <strong style={{ color: 'var(--accent-blue)' }}>${totals.revenue.toFixed(1)}B</strong>, 
          up {yoyRev.toFixed(1)}% YoY. Large caps led by TCS ($7.62B) and Infosys ($4.96B) maintained EBIT margins above 20%+. 
          Mid-caps Persistent and Coforge continued outperforming with 30%+ revenue growth trajectories. 
          GenAI & AI-led deal wins are accelerating across all 10 companies with estimated sector AI revenue of <strong style={{ color: 'var(--accent-cyan)' }}>${totals.aiRevenue.toFixed(2)}B</strong>.
          Deal momentum remains strong with sector TCV at <strong style={{ color: 'var(--accent-amber)' }}>${totals.tcv.toFixed(1)}B</strong> in Q4.
        </p>
        <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 10 }}>⚠️ AI-generated summary based on company-reported data. Verify against official filings before investment decisions.</div>
      </div>

      {/* Management Highlights */}
      <div className="section-title">Management Highlights</div>
      <div className="grid-2 mb-6">
        {COMPANIES.slice(0, 4).map(c => (
          <div key={c.id} className="chart-card">
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
              <span className="company-dot" style={{ background: c.color }} />
              <span style={{ fontWeight: 600, fontSize: 13 }}>{c.shortName}</span>
              <span className="tag tag-blue">{LATEST_QUARTER}</span>
            </div>
            <div className="quote-box">{c.quarters[LATEST_QUARTER].managementQuotes.ceo}</div>
            <div className="quote-attr">— CEO, Earnings Call {LATEST_QUARTER}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
