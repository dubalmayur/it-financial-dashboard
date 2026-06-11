'use client';
import { COMPANIES, LATEST_QUARTER } from '@/lib/data';
const VAL_DATA = {
  tcs:       { pe: 28.4, evEbitda: 21.2, fcfYield: 3.8, priceInr: 3890, marketCapB: 140 },
  infosys:   { pe: 24.6, evEbitda: 18.4, fcfYield: 4.2, priceInr: 1680, marketCapB: 70 },
  wipro:     { pe: 21.8, evEbitda: 15.6, fcfYield: 4.8, priceInr: 285, marketCapB: 30 },
  hcltech:   { pe: 23.2, evEbitda: 17.8, fcfYield: 4.4, priceInr: 1680, marketCapB: 46 },
  techm:     { pe: 28.6, evEbitda: 16.4, fcfYield: 3.2, priceInr: 1580, marketCapB: 15 },
  ltimindtree:{ pe: 30.2, evEbitda: 22.4, fcfYield: 3.6, priceInr: 5480, marketCapB: 34 },
  mphasis:   { pe: 26.8, evEbitda: 19.2, fcfYield: 3.8, priceInr: 3120, marketCapB: 6.2 },
  persistent:{ pe: 68.4, evEbitda: 44.8, fcfYield: 1.4, priceInr: 6240, marketCapB: 9.6 },
  coforge:   { pe: 56.2, evEbitda: 38.6, fcfYield: 1.8, priceInr: 8840, marketCapB: 6.4 },
  zensar:    { pe: 24.6, evEbitda: 16.8, fcfYield: 4.6, priceInr: 650, marketCapB: 1.8 },
};
export default function ValuationPage() {
  return (
    <div>
      <div className="page-header"><div className="page-title">💰 Valuation & Investment Thesis</div><div className="page-subtitle">Institutional Research Desk — P/E, EV/EBITDA, FCF Yield, Market Cap</div></div>
      <div className="table-wrap mb-6">
        <table className="data-table">
          <thead><tr><th>Company</th><th>Market Cap ($B)</th><th>Price (INR)</th><th>P/E (TTM)</th><th>EV/EBITDA</th><th>FCF Yield</th><th>Revenue Growth</th><th>EBIT Margin</th><th>Thesis</th></tr></thead>
          <tbody>
            {COMPANIES.map(c => {
              const v = VAL_DATA[c.id as keyof typeof VAL_DATA];
              const q = c.quarters[LATEST_QUARTER];
              const thesis = q.revenueGrowthYoY > 15 ? '🚀 Growth' : q.ebitMargin > 20 ? '💎 Quality' : '🔄 Recovery';
              return (
                <tr key={c.id}>
                  <td><span className="company-dot" style={{background:c.color}}/> {c.shortName}</td>
                  <td style={{fontFamily:'JetBrains Mono'}}>${v.marketCapB.toFixed(1)}B</td>
                  <td style={{fontFamily:'JetBrains Mono'}}>₹{v.priceInr.toLocaleString()}</td>
                  <td>{v.pe.toFixed(1)}x</td>
                  <td>{v.evEbitda.toFixed(1)}x</td>
                  <td className="best-val">{v.fcfYield.toFixed(1)}%</td>
                  <td className={q.revenueGrowthYoY>=10?'best-val':q.revenueGrowthYoY<0?'worst-val':''}>{q.revenueGrowthYoY>0?'+':''}{q.revenueGrowthYoY.toFixed(1)}%</td>
                  <td>{q.ebitMargin.toFixed(1)}%</td>
                  <td>{thesis}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div style={{padding:14,background:'rgba(245,158,11,0.08)',border:'1px solid rgba(245,158,11,0.2)',borderRadius:8,fontSize:12,color:'var(--text-secondary)'}}>
        ⚠️ <strong>Disclaimer:</strong> Valuation multiples are indicative and based on publicly available market data. This platform is for information purposes only and does not constitute investment advice. Please consult a registered investment advisor before making investment decisions.
      </div>
    </div>
  );
}
