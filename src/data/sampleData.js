export const companies = ["TCS", "Infosys", "HCLTech", "Wipro", "Tech Mahindra", "LTIMindtree", "Persistent"];
export const quarters = ["Q1FY23","Q2FY23","Q3FY23","Q4FY23","Q1FY24","Q2FY24","Q3FY24","Q4FY24","Q1FY25","Q2FY25","Q3FY25","Q4FY25"];

const seed = (company, quarter, metric) => {
  let h = 0;
  for (let c of (company + quarter + metric)) h = (Math.imul(31, h) + c.charCodeAt(0)) | 0;
  return Math.abs(h) / 2147483648;
};

const baseRevenue = { TCS: 55000, Infosys: 37000, HCLTech: 26000, Wipro: 23000, "Tech Mahindra": 13000, LTIMindtree: 8500, Persistent: 2800 };
const baseEmployees = { TCS: 614000, Infosys: 343000, HCLTech: 227000, Wipro: 258000, "Tech Mahindra": 152000, LTIMindtree: 84000, Persistent: 23000 };

export const generateFinancialData = () => {
  const data = [];
  companies.forEach(company => {
    let rev = baseRevenue[company];
    let emp = baseEmployees[company];
    quarters.forEach((quarter, qi) => {
      const s = seed(company, quarter, "main");
      rev = rev * (1 + 0.01 + s * 0.035);
      emp = Math.round(emp * (1 + seed(company, quarter, "emp") * 0.03 - 0.01));
      const opMargin = 20 + seed(company, quarter, "margin") * 8 - 2;
      const netMargin = opMargin - 4 - seed(company, quarter, "netm") * 2;
      const pat = rev * netMargin / 100;
      const ebit = rev * opMargin / 100;
      const attrition = 12 + seed(company, quarter, "attr") * 8 - 2;
      const naRev = rev * (0.50 + seed(company, quarter, "na") * 0.08);
      const euRev = rev * (0.22 + seed(company, quarter, "eu") * 0.06);
      const inRev = rev * (0.08 + seed(company, quarter, "in") * 0.03);
      const apRev = rev - naRev - euRev - inRev;
      const bfsiRev = rev * (0.28 + seed(company, quarter, "bfsi") * 0.05);
      const retailRev = rev * (0.15 + seed(company, quarter, "retail") * 0.04);
      const mfgRev = rev * (0.12 + seed(company, quarter, "mfg") * 0.03);
      const hcRev = rev * (0.10 + seed(company, quarter, "hc") * 0.03);
      const telecomRev = rev * (0.12 + seed(company, quarter, "telecom") * 0.04);
      const energyRev = rev - bfsiRev - retailRev - mfgRev - hcRev - telecomRev;
      const totalClients = Math.round(300 + baseRevenue[company] / 200 + qi * 2 + seed(company, quarter, "clients") * 40);
      data.push({
        company, quarter, quarterIndex: qi,
        revenue: Math.round(rev), pat: Math.round(pat), ebit: Math.round(ebit),
        operatingMargin: parseFloat(opMargin.toFixed(2)), netMargin: parseFloat(netMargin.toFixed(2)),
        eps: parseFloat((pat / (baseRevenue[company] * 0.01)).toFixed(2)),
        employees: emp, netAdditions: Math.round(emp * 0.015), attrition: parseFloat(attrition.toFixed(1)),
        totalClients, clients1M: Math.round(totalClients * 0.35), clients5M: Math.round(totalClients * 0.12),
        clients10M: Math.round(totalClients * 0.05), largeDeals: Math.round(5 + seed(company, quarter, "deals") * 18),
        naRevenue: Math.round(naRev), euRevenue: Math.round(euRev), indiaRevenue: Math.round(inRev), apacRevenue: Math.round(apRev),
        bfsiRevenue: Math.round(bfsiRev), retailRevenue: Math.round(retailRev), mfgRevenue: Math.round(mfgRev),
        healthcareRevenue: Math.round(hcRev), telecomRevenue: Math.round(telecomRev), energyRevenue: Math.round(energyRev),
        cashFlow: Math.round(ebit * 0.85), ebitda: Math.round(ebit * 1.12),
      });
    });
  });
  return data;
};

export const allData = generateFinancialData();
export const getCompanyData = (company) => allData.filter(d => d.company === company);
export const getQuarterData = (quarter) => allData.filter(d => d.quarter === quarter);
export const getFilteredData = (companies, quarter) => allData.filter(d =>
  (!companies || companies.length === 0 || companies.includes(d.company)) &&
  (!quarter || quarter === "All" || d.quarter === quarter)
);

export const calcQoQ = (current, previous, field) => {
  if (!previous || !previous[field]) return null;
  return parseFloat(((current[field] - previous[field]) / previous[field] * 100).toFixed(2));
};

export const getGrowthData = (company) => {
  const cd = getCompanyData(company);
  return cd.map((d, i) => {
    const prev = i > 0 ? cd[i-1] : null;
    const yoyPrev = i >= 4 ? cd[i-4] : null;
    return {
      ...d,
      qoqRevenue: calcQoQ(d, prev, "revenue"),
      yoyRevenue: yoyPrev ? parseFloat(((d.revenue - yoyPrev.revenue) / yoyPrev.revenue * 100).toFixed(2)) : null,
      qoqMargin: prev ? parseFloat((d.operatingMargin - prev.operatingMargin).toFixed(2)) : null,
    };
  });
};

export const generateAIInsights = (company, quarter) => {
  const cd = getCompanyData(company);
  const idx = cd.findIndex(d => d.quarter === quarter);
  if (idx < 0) return [];
  const curr = cd[idx];
  const prev = idx > 0 ? cd[idx-1] : null;
  const yoyPrev = idx >= 4 ? cd[idx-4] : null;
  const insights = [];
  if (prev) {
    const revGrowth = ((curr.revenue - prev.revenue) / prev.revenue * 100).toFixed(1);
    const marginChange = (curr.operatingMargin - prev.operatingMargin).toFixed(1);
    const attrChange = (curr.attrition - prev.attrition).toFixed(1);
    const empChange = ((curr.employees - prev.employees) / prev.employees * 100).toFixed(1);
    insights.push({ type: revGrowth > 0 ? "positive" : "negative", text: `Revenue ${revGrowth > 0 ? 'grew' : 'declined'} by ${Math.abs(revGrowth)}% QoQ, ${revGrowth > 0 ? 'driven by strong momentum in BFSI and Retail segments' : 'reflecting macro headwinds in key verticals'}.` });
    if (Math.abs(marginChange) > 0.5) insights.push({ type: marginChange > 0 ? "positive" : (Math.abs(marginChange) > 2 ? "risk" : "neutral"), text: `Operating margin ${marginChange > 0 ? 'expanded' : 'contracted'} by ${Math.abs(marginChange)}pp QoQ${marginChange > 0 ? ', driven by cost efficiencies and better utilization' : ' — pricing pressure and higher subcontractor costs are likely factors'}.` });
    if (empChange < -0.5) insights.push({ type: "neutral", text: `Employee count declined by ${Math.abs(empChange)}%, indicating workforce optimization and increased automation investments.` });
    else insights.push({ type: "positive", text: `Net addition of ${curr.netAdditions.toLocaleString()} employees signals deal ramp-ups and growth momentum in new markets.` });
    if (parseFloat(attrChange) > 2) insights.push({ type: "risk", text: `Attrition rose by ${attrChange}pp QoQ to ${curr.attrition}%, which may weigh on delivery margins and client satisfaction scores.` });
    else if (parseFloat(attrChange) < -2) insights.push({ type: "positive", text: `Attrition improved sharply by ${Math.abs(attrChange)}pp to ${curr.attrition}%, reflecting better employee engagement and compensation strategies.` });
    const topVertical = ["bfsiRevenue","retailRevenue","mfgRevenue","healthcareRevenue","telecomRevenue","energyRevenue"].reduce((a,b) => curr[a]>curr[b]?a:b);
    const vNames = { bfsiRevenue:"BFSI", retailRevenue:"Retail", mfgRevenue:"Manufacturing", healthcareRevenue:"Healthcare", telecomRevenue:"Telecom", energyRevenue:"Energy & Utilities" };
    insights.push({ type: "opportunity", text: `${vNames[topVertical]} leads all verticals at ${(curr[topVertical]/curr.revenue*100).toFixed(1)}% of revenue — continued focus here can drive margin expansion.` });
    insights.push({ type: "opportunity", text: `Large deal pipeline of ${curr.largeDeals} wins this quarter positions the company well for revenue visibility in the next 2-4 quarters.` });
  }
  if (yoyPrev) {
    const yoyRev = ((curr.revenue - yoyPrev.revenue) / yoyPrev.revenue * 100).toFixed(1);
    insights.push({ type: yoyRev > 0 ? "positive" : "negative", text: `YoY revenue growth of ${yoyRev}% indicates a ${Math.abs(yoyRev) > 8 ? "strong" : yoyRev > 0 ? "moderate" : "declining"} annual performance trajectory against a ${yoyRev > 0 ? "favorable" : "challenging"} base.` });
  }
  return insights;
};
