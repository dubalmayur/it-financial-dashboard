import { useTheme } from '../context/ThemeContext';

// Format INR Crore
export const fmtINR = (crore) => {
  if (crore == null) return '—';
  return crore >= 1000
    ? `₹${(crore / 1000).toFixed(2)}K Cr`
    : `₹${Math.round(crore).toLocaleString()} Cr`;
};

// Format USD Million
export const fmtUSD = (mn) => {
  if (mn == null) return '—';
  return mn >= 1000
    ? `$${(mn / 1000).toFixed(3)}B`
    : `$${Math.round(mn)}M`;
};

// Format USD Million short (for charts)
export const fmtUSDShort = (mn) => {
  if (mn == null) return '—';
  return mn >= 1000 ? `$${(mn / 1000).toFixed(1)}B` : `$${Math.round(mn)}M`;
};

// Format INR Crore short (for charts)
export const fmtINRShort = (crore) => {
  if (crore == null) return '—';
  return crore >= 1000 ? `₹${(crore / 1000).toFixed(1)}K Cr` : `₹${Math.round(crore)} Cr`;
};

// Hook — returns formatter functions based on current currency preference
export const useCurrencyFormat = () => {
  const { currency } = useTheme();

  // Primary display string for a revenue value
  const formatRevenue = (inrCrore, usdMn) => {
    if (currency === 'usd') return fmtUSD(usdMn);
    if (currency === 'inr') return fmtINR(inrCrore);
    // 'both'
    return (
      <span>
        {fmtINR(inrCrore)}
        <span style={{ color: 'var(--text-muted)', margin: '0 6px' }}>|</span>
        <span style={{ color: 'var(--cyan)', fontSize: '0.9em' }}>{fmtUSD(usdMn)}</span>
      </span>
    );
  };

  // Plain string version (for table cells, tooltips)
  const formatRevenueStr = (inrCrore, usdMn) => {
    if (currency === 'usd') return fmtUSD(usdMn);
    if (currency === 'inr') return fmtINR(inrCrore);
    return `${fmtINR(inrCrore)} / ${fmtUSD(usdMn)}`;
  };

  // Chart axis / tick formatter
  const axisFormatter = (inrCrore, usdMn) => {
    if (currency === 'usd') return fmtUSDShort(usdMn);
    return fmtINRShort(inrCrore);
  };

  // Which data key to use for charts
  const revenueKey    = currency === 'usd' ? 'revenueUSD'    : 'revenue';
  const patKey        = currency === 'usd' ? 'patUSD'        : 'pat';
  const ebitKey       = currency === 'usd' ? 'ebitUSD'       : 'ebit';
  const ebitdaKey     = currency === 'usd' ? 'ebitdaUSD'     : 'ebitda';
  const cashFlowKey   = currency === 'usd' ? 'cashFlowUSD'   : 'cashFlow';

  const currencySymbol = currency === 'usd' ? '$' : '₹';
  const currencyUnit   = currency === 'usd' ? 'USD Mn' : 'INR Cr';

  return {
    currency, formatRevenue, formatRevenueStr,
    axisFormatter, fmtINR, fmtUSD,
    revenueKey, patKey, ebitKey, ebitdaKey, cashFlowKey,
    currencySymbol, currencyUnit,
  };
};

export default useCurrencyFormat;
