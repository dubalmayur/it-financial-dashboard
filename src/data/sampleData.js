export const companies = ["TCS", "Infosys", "HCLTech", "Wipro", "Tech Mahindra", "LTIMindtree", "Persistent"];
export const quarters  = ["Q1FY23","Q2FY23","Q3FY23","Q4FY23","Q1FY24","Q2FY24","Q3FY24","Q4FY24","Q1FY25","Q2FY25","Q3FY25","Q4FY25"];

// Realistic quarterly INR/USD exchange rates (average rate for that quarter)
export const quarterlyFxRates = {
  Q1FY23: 78.05, Q2FY23: 80.12, Q3FY23: 82.18, Q4FY23: 82.54,
  Q1FY24: 82.80, Q2FY24: 83.15, Q3FY24: 83.42, Q4FY24: 83.68,
  Q1FY25: 83.52, Q2FY25: 83.89, Q3FY25: 84.36, Q4FY25: 84.72,
};

// Convert INR Crore → USD Million  (1 Cr = 10 M, divide by FX rate)
export const inrCrToUsdMn = (inrCr, quarter) =>
  parseFloat(((inrCr * 10) / quarterlyFxRates[quarter]).toFixed(1));

// Format helpers
export const fmtINR   = (crore) => crore >= 1000 ? `₹${(crore/1000).toFixed(2)}K Cr` : `₹${crore.toLocaleString()} Cr`;
export const fmtUSD   = (mn)    => mn >= 1000     ? `$${(mn/1000).toFixed(3)}B`        : `$${mn.toFixed(0)}M`;
export const fmtBoth  = (crore, quarter) => `${fmtINR(crore)}  /  ${fmtUSD(inrCrToUsdMn(crore, quarter))}`;

const seed = (company, quarter, metric) => {
  let h = 0;
  for (let c of (company + quarter + metric)) h = (Math.imul(31, h) + c.charCodeAt(0)) | 0;
  return Math.abs(h) / 2147483648;
};

const baseRevenue   = { TCS:55000, Infosys:37000, HCLTech:26000, Wipro:23000, "Tech Mahindra":13000, LTIMindtree:8500, Persistent:2800 };
const baseEmployees = { TCS:614000, Infosys:343000, HCLTech:227000, Wipro:258000, "Tech Mahindra":152000, LTIMindtree:84000, Persistent:23000 };

export const generateFinancialData = () => {
  const data = [];
  companies.forEach(company => {
    let rev = baseRevenue[company];
    let emp = baseEmployees[company];
    quarters.forEach((quarter, qi) => {
      const s = seed(company, quarter, "main");
      rev = rev * (1 + 0.01 + s * 0.035);
      emp = Math.round(emp * (1 + seed(company, quarter, "emp") * 0.03 - 0.01));

      const opMargin  = 20 + seed(company, quarter, "margin") * 8 - 2;
      const netMargin = opMargin - 4 - seed(company, quarter, "netm") * 2;
      const pat       = rev * netMargin / 100;
      const ebit      = rev * opMargin  / 100;
      const attrition = 12 + seed(company, quarter, "attr") * 8 - 2;

      const naRev     = rev * (0.50 + seed(company, quarter, "na")     * 0.08);
      const euRev     = rev * (0.22 + seed(company, quarter, "eu")     * 0.06);
      const inRev     = rev * (0.08 + seed(company, quarter, "in")     * 0.03);
      const apRev     = rev - naRev - euRev - inRev;

      const bfsiRev   = rev * (0.28 + seed(company, quarter, "bfsi")   * 0.05);
      const retailRev = rev * (0.15 + seed(company, quarter, "retail") * 0.04);
      const mfgRev    = rev * (0.12 + seed(company, quarter, "mfg")    * 0.03);
      const hcRev     = rev * (0.10 + seed(company, quarter, "hc")     * 0.03);
      const telecomRev= rev * (0.12 + seed(company, quarter, "telecom")* 0.04);
      const energyRev = rev - bfsiRev - retailRev - mfgRev - hcRev - telecomRev;

      const totalClients = Math.round(300 + baseRevenue[company]/200 + qi*2 + seed(company, quarter, "clients")*40);
      const fx           = quarterlyFxRates[quarter];

      // USD conversions (INR Cr → USD Mn)
      const toUSD = (cr) => parseFloat(((cr * 10) / fx).toFixed(1));

      data.push({
        company, quarter, quarterIndex: qi,
        fxRate: fx,                          // ₹ per $1

        // ── INR fields (Crore) ──────────────────────────────────
        revenue:    Math.round(rev),
        pat:        Math.round(pat),
        ebit:       Math.round(ebit),
        ebitda:     Math.round(ebit * 1.12),
        cashFlow:   Math.round(ebit * 0.85),
        operatingMargin: parseFloat(opMargin.toFixed(2)),
        netMargin:       parseFloat(netMargin.toFixed(2)),
        eps:             parseFloat((pat / (baseRevenue[company] * 0.01)).toFixed(2)),

        // ── USD fields (Million) ────────────────────────────────
        revenueUSD:  toUSD(rev),
        patUSD:      toUSD(pat),
        ebitUSD:     toUSD(ebit),
        ebitdaUSD:   toUSD(ebit * 1.12),
        cashFlowUSD: toUSD(ebit * 0.85),

        // Geography — INR Cr + USD Mn
        naRevenue:      Math.round(naRev),   naRevenueUSD:      toUSD(naRev),
        euRevenue:      Math.round(euRev),   euRevenueUSD:      toUSD(euRev),
        indiaRevenue:   Math.round(inRev),   indiaRevenueUSD:   toUSD(inRev),
        apacRevenue:    Math.round(apRev),   apacRevenueUSD:    toUSD(apRev),

        // Verticals — INR Cr + USD Mn
        bfsiRevenue:      Math.round(bfsiRev),    bfsiRevenueUSD:      toUSD(bfsiRev),
        retailRevenue:    Math.round(retailRev),  retailRevenueUSD:    toUSD(retailRev),
        mfgRevenue:       Math.round(mfgRev),     mfgRevenueUSD:       toUSD(mfgRev),
        healthcareRevenue:Math.round(hcRev),      healthcareRevenueUSD:toUSD(hcRev),
        telecomRevenue:   Math.round(telecomRev), telecomRevenueUSD:   toUSD(telecomRev),
        energyRevenue:    Math.round(energyRev),  energyRevenueUSD:    toUSD(energyRev),

        // Workforce
        employees:    emp,
        netAdditions: Math.round(emp * 0.015),
        attrition:    parseFloat(attrition.toFixed(1)),

        // Clients
        totalClients, clients1M:Math.round(totalClients*0.35),
        clients5M:Math.round(totalClients*0.12), clients10M:Math.round(totalClients*0.05),
        largeDeals: Math.round(5 + seed(company, quarter, "deals") * 18),
      });
    });
  });
  return data;
};

export const allData        = generateFinancialData();
export const getCompanyData = (company) =>
  allData.filter(d => d.company === company).sort((a,b) => a.quarterIndex - b.quarterIndex);
export const getQuarterData = (quarter) => allData.filter(d => d.quarter === quarter);

export const getGrowthData  = (company) => {
  const cd = getCompanyData(company);
  return cd.map((d, i) => {
    const prev    = i > 0 ? cd[i-1] : null;
    const yoyPrev = i >= 4 ? cd[i-4] : null;
    return {
      ...d,
      qoqRevenue:    prev    ? parseFloat(((d.revenue - prev.revenue)       / prev.revenue    * 100).toFixed(2)) : null,
      yoyRevenue:    yoyPrev ? parseFloat(((d.revenue - yoyPrev.revenue)    / yoyPrev.revenue * 100).toFixed(2)) : null,
      qoqRevenueUSD: prev    ? parseFloat(((d.revenueUSD - prev.revenueUSD) / prev.revenueUSD * 100).toFixed(2)) : null,
      yoyRevenueUSD: yoyPrev ? parseFloat(((d.revenueUSD - yoyPrev.revenueUSD) / yoyPrev.revenueUSD * 100).toFixed(2)) : null,
      qoqMargin:     prev    ? parseFloat((d.operatingMargin - prev.operatingMargin).toFixed(2)) : null,
    };
  });
};

export const generateAIInsights = (company, quarter) => {
  const cd  = getCompanyData(company);
  const idx = cd.findIndex(d => d.quarter === quarter);
  if (idx < 0) return [];
  const curr = cd[idx];
  const prev = idx > 0 ? cd[idx-1] : null;
  const yoy  = idx >= 4 ? cd[idx-4] : null;
  const insights = [];
  if (prev) {
    const revG  = ((curr.revenue - prev.revenue) / prev.revenue * 100).toFixed(1);
    const revGU = ((curr.revenueUSD - prev.revenueUSD) / prev.revenueUSD * 100).toFixed(1);
    const mDiff = (curr.operatingMargin - prev.operatingMargin).toFixed(1);
    const attrD = (curr.attrition - prev.attrition).toFixed(1);
    const empG  = ((curr.employees - prev.employees) / prev.employees * 100).toFixed(1);

    insights.push({ type: revG > 0 ? "positive" : "negative",
      text: `Revenue ${revG > 0 ? 'grew' : 'declined'} ${Math.abs(revG)}% QoQ in INR terms (${revGU > 0 ? '+' : ''}${revGU}% in USD). FX rate moved from ₹${prev.fxRate} to ₹${curr.fxRate} per dollar — currency ${curr.fxRate > prev.fxRate ? 'depreciation added INR tailwind' : 'appreciation created INR headwind'}.` });

    if (Math.abs(mDiff) > 0.5) insights.push({ type: mDiff > 0 ? "positive" : (Math.abs(mDiff) > 2 ? "risk" : "neutral"),
      text: `Operating margin ${mDiff > 0 ? 'expanded' : 'contracted'} ${Math.abs(mDiff)}pp QoQ to ${curr.operatingMargin}%${mDiff > 0 ? ', driven by cost efficiencies and better utilization' : ' — pricing pressure or higher subcontractor costs are likely factors'}.` });

    if (parseFloat(empG) < -0.5) insights.push({ type:"neutral", text:`Employee count declined ${Math.abs(empG)}%, indicating workforce optimization and automation investments.` });
    else insights.push({ type:"positive", text:`Net addition of ${curr.netAdditions.toLocaleString()} employees signals deal ramp-ups and growth momentum.` });

    if (parseFloat(attrD) > 2) insights.push({ type:"risk", text:`Attrition rose ${attrD}pp QoQ to ${curr.attrition}%, which may weigh on delivery margins.` });
    else if (parseFloat(attrD) < -2) insights.push({ type:"positive", text:`Attrition improved ${Math.abs(attrD)}pp to ${curr.attrition}%, reflecting better employee engagement.` });

    const topV = ["bfsiRevenue","retailRevenue","mfgRevenue","healthcareRevenue","telecomRevenue","energyRevenue"].reduce((a,b) => curr[a]>curr[b]?a:b);
    const vNames = { bfsiRevenue:"BFSI", retailRevenue:"Retail", mfgRevenue:"Manufacturing", healthcareRevenue:"Healthcare", telecomRevenue:"Telecom", energyRevenue:"Energy & Utilities" };
    insights.push({ type:"opportunity", text:`${vNames[topV]} leads verticals at ${(curr[topV]/curr.revenue*100).toFixed(1)}% of revenue. Large deal pipeline of ${curr.largeDeals} wins this quarter provides future revenue visibility.` });
  }
  if (yoy) {
    const yoyR  = ((curr.revenue    - yoy.revenue)    / yoy.revenue    * 100).toFixed(1);
    const yoyRU = ((curr.revenueUSD - yoy.revenueUSD) / yoy.revenueUSD * 100).toFixed(1);
    insights.push({ type: yoyR > 0 ? "positive" : "negative",
      text: `YoY revenue growth: ${yoyR > 0 ? '+' : ''}${yoyR}% in INR / ${yoyRU > 0 ? '+' : ''}${yoyRU}% in USD. The INR/USD gap reflects cumulative currency movement of ₹${(curr.fxRate - yoy.fxRate).toFixed(2)} over 4 quarters.` });
  }
  return insights;
};
