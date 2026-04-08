export const MY_STOCKS = ["AMZN", "TEM", "INTC", "VOO", "QQQM", "VST", "TSLA", "SMCI"];
export const WATCHLIST = ["PLTR", "NVDA"];
export const TECH_AI_SYMBOLS = ["NVDA","MSFT","GOOGL","META","AMZN","PLTR","AMD","SMCI","TSLA","ADBE","CRM","ORCL","AVGO","INTC","TEM"];
export const MARKET_OVERVIEW_SYMBOLS = ["^GSPC","^IXIC","^DJI","^RUT","^VIX","^TNX","BTC-USD","ETH-USD","CL=F"];

export const TECH_SECTORS: Record<string, string[]> = {
  "AI Leaders": ["NVDA", "PLTR", "TEM"],
  "Semiconductors": ["AMD", "AVGO", "INTC", "SMCI"],
  "Big Tech Platforms": ["MSFT", "GOOGL", "META", "AMZN", "TSLA"],
  "Enterprise Software & Infra": ["ADBE", "CRM", "ORCL"],
};

export const SYMBOL_NAMES: Record<string, string> = {
  "^GSPC": "S&P 500","^IXIC": "Nasdaq Composite","^DJI": "Dow Jones Industrials",
  "^RUT": "Russell 2000","^VIX": "CBOE VIX","^TNX": "10-Yr Treasury Yield",
  "BTC-USD": "Bitcoin","ETH-USD": "Ethereum","CL=F": "Crude Oil (WTI)",
  AMZN:"Amazon",TEM:"Tempus AI",INTC:"Intel",VOO:"Vanguard S&P 500 ETF",
  QQQM:"Invesco Nasdaq-100 ETF",VST:"Vistra Corp",TSLA:"Tesla",SMCI:"Super Micro Computer",
  PLTR:"Palantir Technologies",NVDA:"NVIDIA",MSFT:"Microsoft",GOOGL:"Alphabet (Google)",
  META:"Meta Platforms",AMD:"Advanced Micro Devices",ADBE:"Adobe",CRM:"Salesforce",
  ORCL:"Oracle",AVGO:"Broadcom",
};

export const FRED_SERIES = {
  CASE_SHILLER: "CSUSHPINSA",
  MORTGAGE_30Y: "MORTGAGE30US",
  HOUSING_STARTS: "HOUST",
};
