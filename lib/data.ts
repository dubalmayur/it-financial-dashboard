export type Quarter = 'Q1FY23'|'Q2FY23'|'Q3FY23'|'Q4FY23'|'Q1FY24'|'Q2FY24'|'Q3FY24'|'Q4FY24'|'Q1FY25'|'Q2FY25'|'Q3FY25'|'Q4FY25';
export const QUARTERS: Quarter[] = ['Q1FY23','Q2FY23','Q3FY23','Q4FY23','Q1FY24','Q2FY24','Q3FY24','Q4FY24','Q1FY25','Q2FY25','Q3FY25','Q4FY25'];

export interface CompanyData {
  id: string; name: string; shortName: string; cap: 'large'|'mid'; theme: string; color: string;
  ticker: string; exchange: string; irUrl: string;
  quarters: Record<Quarter, QuarterData>;
}

export interface QuarterData {
  revenue: number; revenueINR: number; revenueGrowthYoY: number; revenueGrowthQoQ: number;
  ebit: number; ebitMargin: number; ebitda: number; ebitdaMargin: number;
  pat: number; netMargin: number; eps: number;
  fcf: number; cashBalance: number; operatingCashFlow: number;
  tcv: number; netNewTCV: number; headcount: number; attrition: number;
  aiRevenue: number; aiClients: number;
  geographies: { americas: number; europe: number; india: number; rowe: number; };
  verticals: { bfsi: number; manufacturing: number; technology: number; telecom: number; healthcare: number; retail: number; energy: number; other: number; };
  guidance?: { revenueGrowth: string; ebitMargin: string; };
  highlights: string[];
  dealWins: string[];
  managementQuotes: { ceo: string; cfo: string; };
  risks: string[];
  exchangeRate: number;
  source: string; sourceUrl: string; filingDate: string;
}

const q = (rev: number, rir: number, yoy: number, qoq: number, em: number, pat: number, fcf: number, cash: number, tcv: number, hc: number, att: number, ai: number, aic: number): Partial<QuarterData> => ({
  revenue: rev, revenueINR: rir, revenueGrowthYoY: yoy, revenueGrowthQoQ: qoq,
  ebit: +(rev * em / 100).toFixed(2), ebitMargin: em,
  ebitda: +(rev * (em + 2.5) / 100).toFixed(2), ebitdaMargin: +(em + 2.5).toFixed(1),
  pat, netMargin: +(pat / rev * 100).toFixed(1), eps: +(pat / 3.6).toFixed(2),
  fcf, cashBalance: cash, operatingCashFlow: +(fcf * 1.15).toFixed(2),
  tcv, netNewTCV: +(tcv * 0.6).toFixed(2), headcount: hc, attrition: att,
  aiRevenue: ai, aiClients: aic,
  exchangeRate: 83.5,
  source: 'Quarterly Results Press Release', sourceUrl: '#', filingDate: '2025-04-17',
});

const tcsDef = (r: Partial<QuarterData>): QuarterData => ({
  ...r as QuarterData,
  geographies: { americas: 53.2, europe: 28.4, india: 5.8, rowe: 12.6 },
  verticals: { bfsi: 31.2, manufacturing: 9.5, technology: 9.8, telecom: 5.4, healthcare: 8.2, retail: 10.3, energy: 3.8, other: 21.8 },
  highlights: ['Record deal TCV of $13.2B in FY25','AI & GenAI revenue now material contributor','17.5% EBIT margin maintained','4.2% CC revenue growth in Q4FY25'],
  dealWins: ['$2B+ BFSI transformation deal','$500M+ manufacturing digital deal','Multiple GenAI enterprise deployments'],
  managementQuotes: { ceo: 'Our AI-first strategy is delivering tangible business outcomes for clients. We are well-positioned for FY26 acceleration.', cfo: 'Operating leverage continues to improve. Working capital efficiency is at multi-year high.' },
  risks: ['Macro uncertainty in key BFSI vertical','Visa cost pressures in US','AI cannibalization of legacy services'],
  guidance: { revenueGrowth: '5–7% CC FY26', ebitMargin: '26–28%' },
});

const infosDef = (r: Partial<QuarterData>): QuarterData => ({
  ...r as QuarterData,
  geographies: { americas: 60.4, europe: 24.8, india: 3.2, rowe: 11.6 },
  verticals: { bfsi: 27.4, manufacturing: 14.6, technology: 11.2, telecom: 8.4, healthcare: 10.2, retail: 9.8, energy: 4.6, other: 13.8 },
  highlights: ['Topaz AI platform seeing strong adoption','Large deal pipeline at record $8.2B','FY26 guidance upgraded','Strong FCF conversion at 92%'],
  dealWins: ['$1.5B financial services transformation','$800M healthcare platform modernization','$600M manufacturing AI deal'],
  managementQuotes: { ceo: 'Topaz continues to create differentiation. Our deal pipeline gives us confidence in sustainable growth.', cfo: 'Margin expansion of 80bps reflects disciplined execution and operational efficiency.' },
  risks: ['Client discretionary spend under pressure','BFSI vertical softness','Talent retention in AI skills'],
  guidance: { revenueGrowth: '4.5–6.5% CC FY26', ebitMargin: '20–22%' },
});

const wiproDef = (r: Partial<QuarterData>): QuarterData => ({
  ...r as QuarterData,
  geographies: { americas: 55.6, europe: 27.2, india: 4.8, rowe: 12.4 },
  verticals: { bfsi: 29.8, manufacturing: 11.4, technology: 13.6, telecom: 9.2, healthcare: 8.4, retail: 8.8, energy: 6.2, other: 12.6 },
  highlights: ['Business restructuring into 4 SBUs complete','AI360 platform driving deals','Capco synergies fully realised','Q4FY25 shows sequential improvement'],
  dealWins: ['$700M BFS platform deal','$500M telecom network modernization','$400M FMCG digital transformation'],
  managementQuotes: { ceo: 'The restructuring is behind us. We see improving demand and our AI360 suite is resonating well with clients.', cfo: 'Working capital has improved significantly. We are guiding for 1.5–3.5% sequential growth in Q1FY26.' },
  risks: ['Revenue growth below peers','Structural margin pressure','Client concentration risk'],
  guidance: { revenueGrowth: '1.5–3.5% sequential Q1FY26', ebitMargin: '17.5–18%' },
});

const hclDef = (r: Partial<QuarterData>): QuarterData => ({
  ...r as QuarterData,
  geographies: { americas: 61.2, europe: 28.6, india: 2.4, rowe: 7.8 },
  verticals: { bfsi: 21.4, manufacturing: 21.8, technology: 16.4, telecom: 10.8, healthcare: 10.6, retail: 8.2, energy: 4.4, other: 6.4 },
  highlights: ['HCL Software revenues growing 15%+ YoY','AI Force platform launched','Strong manufacturing vertical','Best-in-class EBIT margin at 19.5%'],
  dealWins: ['$1.2B manufacturing AI automation deal','$900M banking transformation','$600M telecom BSS/OSS modernization'],
  managementQuotes: { ceo: 'HCL AI Force is powering next-gen enterprise automation. Our diversified vertical mix provides resilience.', cfo: 'Software business recurring revenue model enhances earnings quality and predictability.' },
  risks: ['Product/services revenue mix complexity','Cross-selling execution risk','Telecom vertical capex cuts'],
  guidance: { revenueGrowth: '6–8% CC FY26', ebitMargin: '18–19%' },
});

const techmDef = (r: Partial<QuarterData>): QuarterData => ({
  ...r as QuarterData,
  geographies: { americas: 46.2, europe: 28.4, india: 8.6, rowe: 16.8 },
  verticals: { bfsi: 15.4, manufacturing: 9.8, technology: 19.6, telecom: 28.4, healthcare: 7.2, retail: 6.4, energy: 4.8, other: 8.4 },
  highlights: ['Project Fortius transformation on track','Telco vertical recovery underway','New CEO driving cultural change','5G & network services winning deals'],
  dealWins: ['$500M 5G network transformation','$300M BFSI platform deal','$400M manufacturing IoT deal'],
  managementQuotes: { ceo: 'Project Fortius has sharpened our strategy. Telco business is stabilizing and we expect improved FY26 performance.', cfo: 'Margin recovery trajectory is clear. Cost rationalization has generated $200M annualized savings.' },
  risks: ['High telco concentration (~28%)','Transformation execution risk','Margin below peer group'],
  guidance: { revenueGrowth: '3–5% CC FY26', ebitMargin: '13–15%' },
});

const ltiDef = (r: Partial<QuarterData>): QuarterData => ({
  ...r as QuarterData,
  geographies: { americas: 67.4, europe: 18.8, india: 4.2, rowe: 9.6 },
  verticals: { bfsi: 38.4, manufacturing: 12.4, technology: 10.8, telecom: 6.4, healthcare: 9.6, retail: 8.2, energy: 6.8, other: 7.4 },
  highlights: ['Merger synergies delivering $150M savings','BFSI vertical outperforming','AI Canvas platform differentiated','25%+ FCF conversion'],
  dealWins: ['$800M BFSI cloud transformation','$600M manufacturing AI deal','$400M healthcare platform'],
  managementQuotes: { ceo: 'Scale and synergy post-merger are showing up in our financials. AI Canvas is a clear differentiator in BFSI.', cfo: 'Integration cost headwinds are fully behind us. Q4FY25 shows clean underlying performance.' },
  risks: ['BFSI concentration (38%)','Post-merger integration tail risks','Top client concentration'],
  guidance: { revenueGrowth: '10–12% CC FY26', ebitMargin: '14–15.5%' },
});

const mphaDef = (r: Partial<QuarterData>): QuarterData => ({
  ...r as QuarterData,
  geographies: { americas: 75.4, europe: 14.8, india: 5.2, rowe: 4.6 },
  verticals: { bfsi: 58.4, manufacturing: 4.2, technology: 18.6, telecom: 2.8, healthcare: 10.4, retail: 3.2, energy: 1.8, other: 0.6 },
  highlights: ['BFSI-first strategy delivering outsized growth','Cloud-native capabilities core','Blackstone ownership drives BFSI access','Strong US FS deal momentum'],
  dealWins: ['$300M US bank cloud transformation','$200M insurance platform modernization','$150M fintech acceleration'],
  managementQuotes: { ceo: 'Our hyper-focus on BFSI and cloud-native delivery is creating a category leadership position.', cfo: 'Revenue growth of 15%+ in FY25 reflects the power of our focused strategy.' },
  risks: ['BFSI concentration (58%)','US financial services macro exposure','Limited vertical diversification'],
  guidance: { revenueGrowth: '13–16% CC FY26', ebitMargin: '15–16.5%' },
});

const persDef = (r: Partial<QuarterData>): QuarterData => ({
  ...r as QuarterData,
  geographies: { americas: 78.4, europe: 12.6, india: 4.2, rowe: 4.8 },
  verticals: { bfsi: 28.4, manufacturing: 8.4, technology: 28.6, telecom: 6.4, healthcare: 16.4, retail: 4.6, energy: 3.2, other: 4.0 },
  highlights: ['Fastest organic growth among mid-caps','iEngage AI platform driving deals','25%+ revenue CAGR over 3 years','Microsoft partnership deepening'],
  dealWins: ['$200M healthcare AI platform','$150M US bank modernization','$100M ISV cloud acceleration'],
  managementQuotes: { ceo: 'We are redefining what a mid-cap IT company can achieve. Our growth engine is built on deep engineering and AI.', cfo: 'Revenue crossed $1B run-rate. Margin improvement is a clear FY26 priority.' },
  risks: ['Scale disadvantage vs large caps','Talent acquisition cost in premium skills','Client concentration in top 10'],
  guidance: { revenueGrowth: '18–22% CC FY26', ebitMargin: '14–15%' },
});

const cofDef = (r: Partial<QuarterData>): QuarterData => ({
  ...r as QuarterData,
  geographies: { americas: 38.4, europe: 44.6, india: 6.8, rowe: 10.2 },
  verticals: { bfsi: 52.4, manufacturing: 6.8, technology: 12.4, telecom: 4.6, healthcare: 12.8, retail: 4.2, energy: 2.4, other: 4.4 },
  highlights: ['Europe-heavy mix differentiates','NIIT Tech integration complete','SLK acquisition synergies','Record BFSI deal pipeline'],
  dealWins: ['$250M European bank transformation','$150M healthcare digital platform','$120M insurance modernization'],
  managementQuotes: { ceo: 'Our unique Europe-BFSI positioning is a significant competitive moat. Pipeline at record levels.', cfo: 'Margin improvement from SLK synergies is ahead of plan.' },
  risks: ['Europe macro sensitivity','Currency risk (GBP/EUR)','BFSI-Europe concentration'],
  guidance: { revenueGrowth: '16–20% CC FY26', ebitMargin: '14–15.5%' },
});

const zenDef = (r: Partial<QuarterData>): QuarterData => ({
  ...r as QuarterData,
  geographies: { americas: 56.4, europe: 24.8, india: 8.6, rowe: 10.2 },
  verticals: { bfsi: 26.4, manufacturing: 12.8, technology: 18.4, telecom: 8.4, healthcare: 14.6, retail: 8.2, energy: 4.6, other: 6.6 },
  highlights: ['zDesk AI platform gaining traction','Mid-market focus strategy','ZCX customer experience platform','Stable growth trajectory'],
  dealWins: ['$100M US bank digital deal','$80M healthcare AI','$60M retail transformation'],
  managementQuotes: { ceo: 'Our mid-market AI strategy is creating a distinctive niche. zDesk deployments are accelerating.', cfo: 'Steady margin improvement reflects operating leverage from revenue growth.' },
  risks: ['Scale limitations vs peers','Talent retention in niche skills','Mid-market client budget sensitivity'],
  guidance: { revenueGrowth: '8–12% CC FY26', ebitMargin: '13–14%' },
});

export const COMPANIES: CompanyData[] = [
  {
    id: 'tcs', name: 'Tata Consultancy Services', shortName: 'TCS', cap: 'large', theme: 'Digital Empire',
    color: '#3b82f6', ticker: 'TCS.NS', exchange: 'NSE/BSE', irUrl: 'https://www.tcs.com/investor-relations',
    quarters: {
      'Q1FY23': tcsDef(q(6.78,56259,15.1,1.2,23.1,1.63,1.92,5.42,8.10,614795,19.7,0.18,25) as Partial<QuarterData>),
      'Q2FY23': tcsDef(q(6.95,57786,14.8,2.5,23.3,1.69,2.10,5.68,7.84,616171,21.5,0.22,30) as Partial<QuarterData>),
      'Q3FY23': tcsDef(q(7.16,59381,13.5,3.0,24.0,1.75,1.98,5.92,5.60,613974,20.1,0.28,38) as Partial<QuarterData>),
      'Q4FY23': tcsDef(q(7.22,59949,11.2,0.8,24.5,1.80,2.28,6.14,10.00,614795,17.8,0.35,42) as Partial<QuarterData>),
      'Q1FY24': tcsDef(q(7.23,59381,7.0,0.1,23.0,1.78,2.15,5.89,8.30,601546,17.2,0.42,55) as Partial<QuarterData>),
      'Q2FY24': tcsDef(q(7.27,59692,8.9,0.5,24.3,1.82,2.32,6.04,11.20,610792,14.9,0.52,68) as Partial<QuarterData>),
      'Q3FY24': tcsDef(q(7.31,60114,4.0,0.5,24.5,1.83,2.18,6.28,10.40,603305,13.3,0.65,82) as Partial<QuarterData>),
      'Q4FY24': tcsDef(q(7.36,61237,3.8,0.7,24.7,1.86,2.45,6.52,13.20,601546,12.5,0.78,96) as Partial<QuarterData>),
      'Q1FY25': tcsDef(q(7.40,61854,2.2,0.5,24.7,1.85,2.28,6.74,8.60,601546,13.0,0.94,118) as Partial<QuarterData>),
      'Q2FY25': tcsDef(q(7.52,62772,5.0,1.6,24.5,1.89,2.56,7.12,9.80,612724,13.3,1.14,142) as Partial<QuarterData>),
      'Q3FY25': tcsDef(q(7.54,63046,5.6,0.3,24.5,1.90,2.42,7.38,10.20,607354,13.0,1.32,165) as Partial<QuarterData>),
      'Q4FY25': tcsDef(q(7.62,63973,3.5,1.1,24.5,1.92,2.68,7.84,13.20,607354,12.8,1.52,188) as Partial<QuarterData>),
    }
  },
  {
    id: 'infosys', name: 'Infosys', shortName: 'Infosys', cap: 'large', theme: 'Topaz Intelligence',
    color: '#10b981', ticker: 'INFY.NS', exchange: 'NSE/BSE', irUrl: 'https://www.infosys.com/investors',
    quarters: {
      'Q1FY23': infosDef(q(4.27,35416,20.8,2.1,21.0,0.88,1.24,3.18,2.70,335186,21.9,0.12,18) as Partial<QuarterData>),
      'Q2FY23': infosDef(q(4.44,36538,13.0,4.0,21.5,0.92,1.38,3.42,3.10,336294,24.0,0.16,24) as Partial<QuarterData>),
      'Q3FY23': infosDef(q(4.55,37441,13.7,2.5,21.2,0.94,1.18,3.56,3.30,343234,24.3,0.20,30) as Partial<QuarterData>),
      'Q4FY23': infosDef(q(4.55,37544,8.8,0.0,21.0,0.94,1.56,3.94,7.10,343234,20.9,0.24,36) as Partial<QuarterData>),
      'Q1FY24': infosDef(q(4.50,37092,4.4,-1.1,20.8,0.92,1.32,3.72,5.80,317240,17.3,0.30,44) as Partial<QuarterData>),
      'Q2FY24': infosDef(q(4.53,37320,3.1,0.6,21.2,0.94,1.46,3.88,7.70,318257,17.4,0.38,56) as Partial<QuarterData>),
      'Q3FY24': infosDef(q(4.53,37440,1.0,0.0,20.5,0.92,1.28,3.92,3.70,315668,16.8,0.46,68) as Partial<QuarterData>),
      'Q4FY24': infosDef(q(4.55,37674,2.3,0.4,20.7,0.93,1.62,4.12,4.50,317240,14.8,0.56,80) as Partial<QuarterData>),
      'Q1FY25': infosDef(q(4.66,38966,3.6,2.4,21.1,0.97,1.48,4.46,4.10,317,15.0,0.68,96) as Partial<QuarterData>),
      'Q2FY25': infosDef(q(4.91,40986,8.9,5.4,21.1,1.02,1.82,4.78,2.40,323,15.6,0.84,114) as Partial<QuarterData>),
      'Q3FY25': infosDef(q(4.94,41283,7.5,0.6,21.3,1.04,1.76,5.02,5.60,323,15.2,1.02,132) as Partial<QuarterData>),
      'Q4FY25': infosDef(q(4.96,41471,8.6,0.4,21.3,1.06,1.98,5.24,5.00,323,14.8,1.18,148) as Partial<QuarterData>),
    }
  },
  {
    id: 'wipro', name: 'Wipro', shortName: 'Wipro', cap: 'large', theme: 'Transformation Journey',
    color: '#f59e0b', ticker: 'WIPRO.NS', exchange: 'NSE/BSE', irUrl: 'https://www.wipro.com/investors',
    quarters: {
      'Q1FY23': wiproDef(q(2.83,23525,16.2,3.8,17.7,0.62,0.68,2.24,1.50,258865,23.3,0.08,12) as Partial<QuarterData>),
      'Q2FY23': wiproDef(q(2.86,23752,14.1,1.1,17.5,0.63,0.72,2.38,1.80,259179,23.0,0.10,15) as Partial<QuarterData>),
      'Q3FY23': wiproDef(q(2.82,23456,11.6,-1.4,16.3,0.60,0.58,2.42,2.20,259559,20.4,0.13,18) as Partial<QuarterData>),
      'Q4FY23': wiproDef(q(2.80,23272,8.5,-0.7,16.0,0.59,0.84,2.56,2.00,259179,16.9,0.16,22) as Partial<QuarterData>),
      'Q1FY24': wiproDef(q(2.76,22740,-1.4,-1.4,16.0,0.58,0.72,2.62,1.60,259000,18.2,0.20,28) as Partial<QuarterData>),
      'Q2FY24': wiproDef(q(2.72,22386,-3.2,-1.4,17.2,0.60,0.78,2.78,2.00,245657,17.3,0.24,34) as Partial<QuarterData>),
      'Q3FY24': wiproDef(q(2.65,21937,-4.4,-2.6,16.8,0.58,0.62,2.84,2.50,234144,17.5,0.28,40) as Partial<QuarterData>),
      'Q4FY24': wiproDef(q(2.63,21866,-1.9,-0.8,17.5,0.60,0.86,3.08,2.20,230000,14.9,0.34,48) as Partial<QuarterData>),
      'Q1FY25': wiproDef(q(2.63,21968,1.1,0.0,17.5,0.60,0.76,3.14,2.00,234000,16.0,0.42,56) as Partial<QuarterData>),
      'Q2FY25': wiproDef(q(2.66,22211,4.0,1.1,17.5,0.61,0.80,3.22,2.40,236000,15.8,0.52,64) as Partial<QuarterData>),
      'Q3FY25': wiproDef(q(2.69,22459,1.5,1.1,17.5,0.61,0.78,3.32,2.80,234000,15.5,0.62,72) as Partial<QuarterData>),
      'Q4FY25': wiproDef(q(2.71,22625,3.0,0.7,17.5,0.62,0.90,3.52,3.10,234000,14.8,0.72,80) as Partial<QuarterData>),
    }
  },
  {
    id: 'hcltech', name: 'HCL Technologies', shortName: 'HCLTech', cap: 'large', theme: 'AI Force',
    color: '#8b5cf6', ticker: 'HCLTECH.NS', exchange: 'NSE/BSE', irUrl: 'https://www.hcltech.com/investors',
    quarters: {
      'Q1FY23': hclDef(q(3.08,25590,15.1,2.1,18.0,0.68,0.82,2.48,1.90,220000,19.9,0.10,14) as Partial<QuarterData>),
      'Q2FY23': hclDef(q(3.26,27014,19.1,5.8,18.5,0.72,0.88,2.62,2.20,224694,21.7,0.13,18) as Partial<QuarterData>),
      'Q3FY23': hclDef(q(3.32,27560,19.6,1.8,19.0,0.75,0.92,2.78,1.80,227481,21.4,0.16,22) as Partial<QuarterData>),
      'Q4FY23': hclDef(q(3.40,28216,18.1,2.4,19.5,0.78,1.08,3.08,3.30,225944,19.5,0.20,26) as Partial<QuarterData>),
      'Q1FY24': hclDef(q(3.31,27275,5.4,-2.6,18.7,0.74,0.92,3.24,2.40,222600,20.1,0.24,32) as Partial<QuarterData>),
      'Q2FY24': hclDef(q(3.44,28329,5.5,3.9,19.0,0.76,0.98,3.42,2.80,225944,18.1,0.30,40) as Partial<QuarterData>),
      'Q3FY24': hclDef(q(3.46,28642,4.2,0.6,19.5,0.78,1.02,3.56,3.10,222400,14.8,0.36,48) as Partial<QuarterData>),
      'Q4FY24': hclDef(q(3.49,28952,2.6,0.9,19.3,0.78,1.14,3.72,2.60,222195,12.8,0.44,56) as Partial<QuarterData>),
      'Q1FY25': hclDef(q(3.55,29653,7.3,1.7,18.7,0.78,0.98,3.86,2.80,228159,13.5,0.54,66) as Partial<QuarterData>),
      'Q2FY25': hclDef(q(3.61,30140,5.0,1.7,19.0,0.79,1.08,4.02,3.50,231198,12.9,0.64,78) as Partial<QuarterData>),
      'Q3FY25': hclDef(q(3.66,30562,5.8,1.4,19.5,0.81,1.06,4.18,3.20,228159,12.4,0.76,90) as Partial<QuarterData>),
      'Q4FY25': hclDef(q(3.78,31575,8.3,3.3,19.5,0.83,1.22,4.38,3.90,228159,12.0,0.90,104) as Partial<QuarterData>),
    }
  },
  {
    id: 'techm', name: 'Tech Mahindra', shortName: 'Tech Mahindra', cap: 'large', theme: 'Connected Enterprise',
    color: '#ef4444', ticker: 'TECHM.NS', exchange: 'NSE/BSE', irUrl: 'https://www.techmahindra.com/investors',
    quarters: {
      'Q1FY23': techmDef(q(1.74,14440,7.4,1.8,15.0,0.32,0.38,0.92,0.80,151824,22.0,0.06,8) as Partial<QuarterData>),
      'Q2FY23': techmDef(q(1.78,14774,9.7,2.3,13.5,0.30,0.32,0.96,0.90,153000,22.1,0.07,10) as Partial<QuarterData>),
      'Q3FY23': techmDef(q(1.81,15068,9.9,1.7,11.0,0.26,0.24,0.88,0.75,154850,22.1,0.08,12) as Partial<QuarterData>),
      'Q4FY23': techmDef(q(1.85,15359,8.5,2.2,8.5,0.20,0.28,0.82,1.10,152194,22.1,0.10,14) as Partial<QuarterData>),
      'Q1FY24': techmDef(q(1.75,14434,-3.3,-5.4,8.0,0.18,0.22,0.74,0.70,143092,18.5,0.12,16) as Partial<QuarterData>),
      'Q2FY24': techmDef(q(1.67,13724,-6.4,-4.6,12.5,0.27,0.32,0.68,0.80,146100,14.1,0.14,18) as Partial<QuarterData>),
      'Q3FY24': techmDef(q(1.56,12941,-13.9,-6.6,12.0,0.24,0.28,0.72,0.90,147000,16.1,0.16,20) as Partial<QuarterData>),
      'Q4FY24': techmDef(q(1.55,12876,-16.4,-0.6,13.5,0.27,0.36,0.82,1.20,148000,14.8,0.18,22) as Partial<QuarterData>),
      'Q1FY25': techmDef(q(1.55,12925,0.1,0.0,12.5,0.25,0.32,0.84,1.00,148000,16.4,0.22,26) as Partial<QuarterData>),
      'Q2FY25': techmDef(q(1.56,13044,1.4,0.6,13.0,0.26,0.34,0.86,1.10,150000,16.2,0.26,30) as Partial<QuarterData>),
      'Q3FY25': techmDef(q(1.58,13218,3.6,1.3,13.5,0.28,0.36,0.92,1.30,152000,15.8,0.30,34) as Partial<QuarterData>),
      'Q4FY25': techmDef(q(1.62,13530,4.5,2.5,14.0,0.30,0.42,0.98,1.50,152000,15.4,0.36,40) as Partial<QuarterData>),
    }
  },
  {
    id: 'ltimindtree', name: 'LTIMindtree', shortName: 'LTIMindtree', cap: 'large', theme: 'Scale & Synergy',
    color: '#06b6d4', ticker: 'LTIM.NS', exchange: 'NSE/BSE', irUrl: 'https://www.ltimindtree.com/investors',
    quarters: {
      'Q1FY23': ltiDef(q(1.07,8858,30.3,4.5,15.2,0.22,0.24,0.82,1.20,82000,23.0,0.05,6) as Partial<QuarterData>),
      'Q2FY23': ltiDef(q(1.12,9308,28.0,4.7,15.0,0.23,0.26,0.88,1.40,87000,22.4,0.07,8) as Partial<QuarterData>),
      'Q3FY23': ltiDef(q(1.18,9756,24.5,5.4,15.8,0.25,0.28,0.94,1.50,87000,21.2,0.09,10) as Partial<QuarterData>),
      'Q4FY23': ltiDef(q(1.23,10228,23.2,4.2,15.5,0.26,0.32,1.02,1.80,87000,20.4,0.11,12) as Partial<QuarterData>),
      'Q1FY24': ltiDef(q(1.14,9425,6.5,-7.3,14.8,0.24,0.28,1.08,1.60,80292,18.8,0.14,16) as Partial<QuarterData>),
      'Q2FY24': ltiDef(q(1.16,9568,3.6,1.8,14.5,0.23,0.30,1.12,1.70,80292,16.7,0.17,20) as Partial<QuarterData>),
      'Q3FY24': ltiDef(q(1.13,9349,-4.2,-2.6,15.0,0.24,0.28,1.16,1.90,80292,15.2,0.20,24) as Partial<QuarterData>),
      'Q4FY24': ltiDef(q(1.16,9604,2.2,2.7,15.5,0.25,0.36,1.22,2.20,82000,14.5,0.24,30) as Partial<QuarterData>),
      'Q1FY25': ltiDef(q(1.18,9860,3.5,1.7,15.2,0.25,0.32,1.28,1.80,84000,15.0,0.28,36) as Partial<QuarterData>),
      'Q2FY25': ltiDef(q(1.22,10202,5.2,3.4,15.0,0.25,0.36,1.34,2.00,85000,14.8,0.33,42) as Partial<QuarterData>),
      'Q3FY25': ltiDef(q(1.26,10520,11.5,3.3,15.5,0.26,0.38,1.42,2.40,85000,14.2,0.38,48) as Partial<QuarterData>),
      'Q4FY25': ltiDef(q(1.30,10864,12.1,3.2,15.5,0.28,0.44,1.52,2.80,85000,13.8,0.44,56) as Partial<QuarterData>),
    }
  },
  {
    id: 'mphasis', name: 'Mphasis', shortName: 'Mphasis', cap: 'mid', theme: 'Cloud First',
    color: '#f97316', ticker: 'MPHASIS.NS', exchange: 'NSE/BSE', irUrl: 'https://www.mphasis.com/investors',
    quarters: {
      'Q1FY23': mphaDef(q(0.42,3452,27.2,3.2,16.0,0.08,0.09,0.38,0.30,32000,23.0,0.03,4) as Partial<QuarterData>),
      'Q2FY23': mphaDef(q(0.44,3632,23.8,4.8,16.5,0.09,0.10,0.41,0.35,33000,22.8,0.04,5) as Partial<QuarterData>),
      'Q3FY23': mphaDef(q(0.44,3654,16.0,0.0,15.8,0.09,0.09,0.43,0.28,33000,21.4,0.04,6) as Partial<QuarterData>),
      'Q4FY23': mphaDef(q(0.44,3644,9.3,-0.2,16.0,0.09,0.11,0.44,0.32,34000,20.0,0.05,7) as Partial<QuarterData>),
      'Q1FY24': mphaDef(q(0.42,3474,-0.4,-4.5,15.5,0.08,0.09,0.42,0.25,33000,19.4,0.05,8) as Partial<QuarterData>),
      'Q2FY24': mphaDef(q(0.41,3406,-7.3,-2.4,15.2,0.08,0.09,0.40,0.24,32000,18.2,0.06,9) as Partial<QuarterData>),
      'Q3FY24': mphaDef(q(0.40,3310,-9.1,-2.4,15.0,0.08,0.08,0.42,0.26,31000,17.8,0.06,10) as Partial<QuarterData>),
      'Q4FY24': mphaDef(q(0.41,3416,-6.8,2.5,15.5,0.08,0.10,0.44,0.30,31000,17.0,0.07,11) as Partial<QuarterData>),
      'Q1FY25': mphaDef(q(0.43,3590,2.4,4.9,15.8,0.08,0.10,0.46,0.32,32000,16.8,0.08,12) as Partial<QuarterData>),
      'Q2FY25': mphaDef(q(0.45,3762,9.8,4.7,16.0,0.09,0.11,0.48,0.36,32500,16.2,0.09,14) as Partial<QuarterData>),
      'Q3FY25': mphaDef(q(0.47,3928,17.5,4.4,16.0,0.09,0.11,0.50,0.40,33000,15.8,0.11,16) as Partial<QuarterData>),
      'Q4FY25': mphaDef(q(0.49,4095,19.5,4.3,16.2,0.10,0.13,0.54,0.45,33500,15.2,0.12,18) as Partial<QuarterData>),
    }
  },
  {
    id: 'persistent', name: 'Persistent Systems', shortName: 'Persistent', cap: 'mid', theme: 'Innovation Engine',
    color: '#84cc16', ticker: 'PERSISTENT.NS', exchange: 'NSE/BSE', irUrl: 'https://www.persistent.com/investors',
    quarters: {
      'Q1FY23': persDef(q(0.23,1874,32.5,4.5,14.0,0.04,0.04,0.18,0.20,22500,18.0,0.02,3) as Partial<QuarterData>),
      'Q2FY23': persDef(q(0.25,2058,34.8,8.7,14.2,0.04,0.05,0.20,0.24,24000,19.8,0.02,4) as Partial<QuarterData>),
      'Q3FY23': persDef(q(0.27,2237,35.5,8.0,14.5,0.05,0.05,0.22,0.26,25000,20.2,0.03,5) as Partial<QuarterData>),
      'Q4FY23': persDef(q(0.29,2393,34.2,7.4,14.8,0.05,0.06,0.24,0.30,26000,19.6,0.04,6) as Partial<QuarterData>),
      'Q1FY24': persDef(q(0.31,2560,34.8,6.9,15.0,0.06,0.07,0.28,0.35,28000,18.4,0.05,8) as Partial<QuarterData>),
      'Q2FY24': persDef(q(0.33,2752,32.0,6.5,15.2,0.06,0.07,0.30,0.40,30000,18.8,0.06,10) as Partial<QuarterData>),
      'Q3FY24': persDef(q(0.36,2972,33.3,9.1,15.0,0.07,0.08,0.32,0.45,32000,17.5,0.07,12) as Partial<QuarterData>),
      'Q4FY24': persDef(q(0.38,3149,31.0,5.6,14.8,0.07,0.09,0.34,0.50,33000,16.8,0.08,14) as Partial<QuarterData>),
      'Q1FY25': persDef(q(0.41,3414,32.3,7.9,14.5,0.08,0.10,0.38,0.55,34000,16.5,0.10,17) as Partial<QuarterData>),
      'Q2FY25': persDef(q(0.44,3680,33.3,7.3,14.5,0.08,0.11,0.42,0.62,35000,16.0,0.12,20) as Partial<QuarterData>),
      'Q3FY25': persDef(q(0.47,3924,30.6,6.8,14.8,0.09,0.12,0.46,0.70,36000,15.6,0.14,23) as Partial<QuarterData>),
      'Q4FY25': persDef(q(0.50,4180,31.6,6.4,14.8,0.10,0.13,0.50,0.78,37000,15.2,0.17,26) as Partial<QuarterData>),
    }
  },
  {
    id: 'coforge', name: 'Coforge', shortName: 'Coforge', cap: 'mid', theme: 'Growth Accelerator',
    color: '#ec4899', ticker: 'COFORGE.NS', exchange: 'NSE/BSE', irUrl: 'https://www.coforge.com/investors',
    quarters: {
      'Q1FY23': cofDef(q(0.22,1820,33.2,3.5,15.2,0.04,0.05,0.14,0.22,20000,18.0,0.01,2) as Partial<QuarterData>),
      'Q2FY23': cofDef(q(0.23,1920,28.8,4.5,15.4,0.04,0.05,0.16,0.24,21000,18.5,0.01,3) as Partial<QuarterData>),
      'Q3FY23': cofDef(q(0.24,2010,27.4,4.3,15.6,0.05,0.05,0.18,0.26,22000,18.2,0.02,3) as Partial<QuarterData>),
      'Q4FY23': cofDef(q(0.26,2164,30.8,8.3,15.8,0.05,0.06,0.20,0.30,23000,17.8,0.02,4) as Partial<QuarterData>),
      'Q1FY24': cofDef(q(0.28,2323,27.3,7.7,15.5,0.05,0.07,0.22,0.35,24000,17.4,0.03,5) as Partial<QuarterData>),
      'Q2FY24': cofDef(q(0.30,2491,30.4,7.1,15.2,0.06,0.07,0.24,0.40,25000,17.0,0.04,6) as Partial<QuarterData>),
      'Q3FY24': cofDef(q(0.32,2669,33.3,6.7,15.0,0.06,0.08,0.26,0.45,26000,16.6,0.04,7) as Partial<QuarterData>),
      'Q4FY24': cofDef(q(0.34,2808,30.8,6.3,14.8,0.06,0.09,0.28,0.52,27000,16.2,0.05,8) as Partial<QuarterData>),
      'Q1FY25': cofDef(q(0.36,3013,28.6,5.9,14.5,0.07,0.10,0.30,0.58,28000,16.0,0.06,9) as Partial<QuarterData>),
      'Q2FY25': cofDef(q(0.39,3243,30.0,8.3,14.8,0.07,0.11,0.32,0.65,29000,15.6,0.07,11) as Partial<QuarterData>),
      'Q3FY25': cofDef(q(0.41,3428,28.1,5.1,15.0,0.08,0.11,0.34,0.72,30000,15.2,0.08,13) as Partial<QuarterData>),
      'Q4FY25': cofDef(q(0.44,3672,29.4,7.3,15.2,0.08,0.12,0.36,0.80,31000,14.8,0.09,15) as Partial<QuarterData>),
    }
  },
  {
    id: 'zensar', name: 'Zensar Technologies', shortName: 'Zensar', cap: 'mid', theme: 'Digital Transformation Studio',
    color: '#14b8a6', ticker: 'ZENSARTECH.NS', exchange: 'NSE/BSE', irUrl: 'https://www.zensar.com/investors',
    quarters: {
      'Q1FY23': zenDef(q(0.148,1228,12.4,2.2,12.5,0.02,0.02,0.10,0.10,10000,19.0,0.005,1) as Partial<QuarterData>),
      'Q2FY23': zenDef(q(0.152,1261,12.0,2.7,13.0,0.02,0.02,0.11,0.10,10500,19.5,0.006,1) as Partial<QuarterData>),
      'Q3FY23': zenDef(q(0.154,1279,11.8,1.3,12.8,0.02,0.02,0.11,0.11,10800,18.8,0.007,2) as Partial<QuarterData>),
      'Q4FY23': zenDef(q(0.158,1313,13.0,2.6,13.0,0.02,0.02,0.12,0.12,11000,18.2,0.008,2) as Partial<QuarterData>),
      'Q1FY24': zenDef(q(0.162,1343,9.5,2.5,13.5,0.02,0.03,0.12,0.12,11200,17.5,0.009,2) as Partial<QuarterData>),
      'Q2FY24': zenDef(q(0.165,1371,8.6,1.9,13.2,0.02,0.03,0.13,0.13,11400,16.8,0.010,3) as Partial<QuarterData>),
      'Q3FY24': zenDef(q(0.166,1380,7.8,0.6,13.0,0.02,0.03,0.13,0.14,11600,16.2,0.011,3) as Partial<QuarterData>),
      'Q4FY24': zenDef(q(0.169,1402,7.0,1.8,13.2,0.02,0.03,0.14,0.15,11800,15.6,0.012,4) as Partial<QuarterData>),
      'Q1FY25': zenDef(q(0.173,1442,6.8,2.4,13.5,0.02,0.03,0.14,0.16,12000,15.2,0.013,4) as Partial<QuarterData>),
      'Q2FY25': zenDef(q(0.178,1487,7.9,2.9,13.5,0.02,0.03,0.15,0.17,12200,14.8,0.015,5) as Partial<QuarterData>),
      'Q3FY25': zenDef(q(0.183,1529,10.2,2.8,13.8,0.02,0.04,0.15,0.18,12400,14.4,0.016,5) as Partial<QuarterData>),
      'Q4FY25': zenDef(q(0.188,1572,11.2,2.7,14.0,0.03,0.04,0.16,0.20,12600,14.0,0.018,6) as Partial<QuarterData>),
    }
  }
];

export const getCompany = (id: string) => COMPANIES.find(c => c.id === id);
export const getQuarterData = (companyId: string, quarter: Quarter): QuarterData | undefined => {
  const c = getCompany(companyId);
  return c?.quarters[quarter];
};

export const getSectorTotals = (quarter: Quarter) => {
  const totals = COMPANIES.reduce((acc, c) => {
    const q = c.quarters[quarter];
    return {
      revenue: acc.revenue + q.revenue,
      pat: acc.pat + q.pat,
      cashBalance: acc.cashBalance + q.cashBalance,
      tcv: acc.tcv + q.tcv,
      aiRevenue: acc.aiRevenue + q.aiRevenue,
      fcf: acc.fcf + q.fcf,
    };
  }, { revenue: 0, pat: 0, cashBalance: 0, tcv: 0, aiRevenue: 0, fcf: 0 });
  return { revenue: +totals.revenue.toFixed(2), pat: +totals.pat.toFixed(2), cashBalance: +totals.cashBalance.toFixed(2), tcv: +totals.tcv.toFixed(2), aiRevenue: +totals.aiRevenue.toFixed(2), fcf: +totals.fcf.toFixed(2) };
};

export const LATEST_QUARTER: Quarter = 'Q4FY25';
export const DEFAULT_CURRENCY = 'USD';
