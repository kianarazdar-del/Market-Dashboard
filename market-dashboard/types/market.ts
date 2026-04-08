export interface Quote {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  open: number;
  previousClose: number;
  dayHigh: number;
  dayLow: number;
  week52High: number;
  week52Low: number;
  marketCap?: number;
  peRatio?: number;
  volume?: number;
  avgVolume?: number;
  sector?: string;
  industry?: string;
  currency?: string;
  exchangeName?: string;
  lastUpdated: number;
}

export interface HistoricalBar {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface Returns {
  daily: number | null;
  weekly: number | null;
  monthly: number | null;
  ytd: number | null;
  oneYear: number | null;
  fiveYear: number | null;
}

export interface StockData {
  quote: Quote;
  returns: Returns;
  history: HistoricalBar[];
  news: NewsItem[];
}

export interface MarketIndex {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  history: HistoricalBar[];
}

export interface MarketOverviewData {
  indices: MarketIndex[];
  vix: MarketIndex | null;
  treasury10y: MarketIndex | null;
  bitcoin: MarketIndex | null;
  ethereum: MarketIndex | null;
  oil: MarketIndex | null;
  news: NewsItem[];
  lastUpdated: number;
}

export interface NewsItem {
  title: string;
  url: string;
  source: string;
  publishedAt: string;
  summary?: string;
}

export interface FredObservation {
  date: string;
  value: number;
}

export interface FredSeries {
  seriesId: string;
  title: string;
  observations: FredObservation[];
  units: string;
}

export interface RealEstateData {
  caseShiller: FredSeries | null;
  mortgageRate: FredSeries | null;
  housingStarts: FredSeries | null;
  news: NewsItem[];
  lastUpdated: number;
}

export type TabId = "overview" | "stocks" | "watchlist" | "realestate" | "tech";

export interface SortConfig {
  key: keyof Returns | "symbol" | "name" | "price";
  direction: "asc" | "desc";
}
