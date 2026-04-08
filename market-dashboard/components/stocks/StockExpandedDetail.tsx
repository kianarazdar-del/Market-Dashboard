"use client";
import { PriceChart } from "@/components/ui/Sparkline";
import { ReturnBadge } from "@/components/ui/Badge";
import { NewsSection } from "@/components/ui/NewsSection";
import { formatMarketCap, formatPrice, formatVolume } from "@/lib/format";
import type { StockData } from "@/types/market";

const DESCRIPTIONS: Record<string, string> = {
  AMZN: "Amazon is the world's largest e-commerce and cloud computing company. AWS (Amazon Web Services) is the dominant cloud provider, and its advertising business has become a major profit driver.",
  TEM: "Tempus AI applies artificial intelligence and data analytics to healthcare — particularly oncology and genomics — helping physicians make more informed treatment decisions.",
  INTC: "Intel is the largest U.S. semiconductor company by revenue, making CPUs for PCs and data centers. The company is undergoing a major transformation to rebuild its manufacturing competitiveness.",
  VOO: "Vanguard S&P 500 ETF tracks the S&P 500 index, giving broad exposure to 500 large U.S. companies. One of the most popular and lowest-cost index funds in the world.",
  QQQM: "Invesco Nasdaq-100 ETF tracks the 100 largest non-financial companies on the Nasdaq — heavily weighted toward technology, making it a popular way to gain tech exposure.",
  VST: "Vistra is one of the largest power generation and retail energy companies in the U.S., with significant nuclear and natural gas assets. It's increasingly seen as an AI data center power play.",
  TSLA: "Tesla is the world's leading electric vehicle manufacturer and also operates energy storage and solar businesses. CEO Elon Musk's decisions significantly impact the stock.",
  SMCI: "Super Micro Computer designs and manufactures high-performance server solutions, particularly for AI and data center workloads. Heavily tied to GPU/AI infrastructure build-out.",
  PLTR: "Palantir builds AI-powered data analytics platforms used by government agencies and large enterprises. Its AIP (AI Platform) product has become a major commercial growth driver.",
  NVDA: "NVIDIA designs the GPUs that power AI training and inference at scale. The H100 and Blackwell chips have made NVIDIA the defining company of the AI infrastructure boom.",
  MSFT: "Microsoft is one of the world's most valuable companies, with major businesses in cloud (Azure), productivity software (Office 365), and AI (deep OpenAI partnership and Copilot integration).",
  GOOGL: "Alphabet is Google's parent company. Revenue is dominated by search advertising, but Google Cloud is a fast-growing contributor. The company is racing to integrate AI across all products.",
  META: "Meta operates Facebook, Instagram, and WhatsApp — the largest social media ecosystem. The company is investing heavily in AI ad targeting and the metaverse via Reality Labs.",
  AMD: "Advanced Micro Devices makes CPUs and GPUs competing with Intel and NVIDIA. Its MI300X AI accelerators are gaining traction as an alternative to NVIDIA in the AI chip market.",
  ADBE: "Adobe makes creative and document software (Photoshop, Premiere, Acrobat) used by designers worldwide. Its Firefly AI is being integrated across the Creative Cloud suite.",
  CRM: "Salesforce is the world's leading CRM (customer relationship management) platform. Its Einstein AI and Agentforce products are central to its strategy to automate enterprise workflows.",
  ORCL: "Oracle provides enterprise databases, cloud infrastructure, and business applications. Its OCI (Oracle Cloud Infrastructure) is growing rapidly, partly driven by AI workload demand.",
  AVGO: "Broadcom is a diversified semiconductor company making networking, storage, and wireless chips. Its acquisition of VMware added a major software business to its portfolio.",
};

interface Props { data: StockData }

export function StockExpandedDetail({ data }: Props) {
  const { quote, returns, history, news } = data;
  const desc = DESCRIPTIONS[quote.symbol];

  return (
    <div className="px-4 pb-5 pt-3 space-y-5 animate-fade-in border-t border-border-soft bg-surface-1/50">
      {/* Price chart */}
      {history.length > 2 && (
        <div>
          <p className="text-xs text-slate-500 mb-2">Price — Last 3 Months</p>
          <div className="bg-surface-2 rounded-lg p-3 border border-border-soft">
            <PriceChart data={history} symbol={quote.symbol} height={180} />
          </div>
        </div>
      )}

      {/* Key stats grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
        {[
          { label: "Day Range", value: `$${formatPrice(quote.dayLow)} – $${formatPrice(quote.dayHigh)}` },
          { label: "52W High", value: `$${formatPrice(quote.week52High)}` },
          { label: "52W Low", value: `$${formatPrice(quote.week52Low)}` },
          { label: "Market Cap", value: formatMarketCap(quote.marketCap) },
          { label: "P/E Ratio", value: quote.peRatio ? formatPrice(quote.peRatio, 1) : "—" },
          { label: "Volume", value: formatVolume(quote.volume) },
        ].map(({ label, value }) => (
          <div key={label} className="bg-surface-2 rounded-lg p-3 border border-border-soft">
            <p className="text-xs text-slate-500 mb-1">{label}</p>
            <p className="text-sm font-semibold num text-slate-200">{value}</p>
          </div>
        ))}
      </div>

      {/* Returns breakdown */}
      <div>
        <p className="text-xs text-slate-500 mb-2">Return History</p>
        <div className="flex flex-wrap gap-2">
          {[
            { label: "1D", value: returns.daily },
            { label: "1W", value: returns.weekly },
            { label: "1M", value: returns.monthly },
            { label: "YTD", value: returns.ytd },
            { label: "1Y", value: returns.oneYear },
            { label: "5Y", value: returns.fiveYear },
          ].map(({ label, value }) => (
            <div key={label} className="flex items-center gap-2 bg-surface-2 border border-border-soft rounded-lg px-3 py-2">
              <span className="text-xs text-slate-500 w-6">{label}</span>
              <ReturnBadge value={value} size="sm" />
            </div>
          ))}
        </div>
      </div>

      {/* Sector + description */}
      <div className="grid sm:grid-cols-2 gap-4">
        {(quote.sector || quote.industry) && (
          <div className="bg-surface-2 border border-border-soft rounded-lg p-3">
            <p className="text-xs text-slate-500 mb-1">Sector / Industry</p>
            <p className="text-sm text-slate-300">{quote.sector}</p>
            {quote.industry && <p className="text-xs text-slate-500 mt-0.5">{quote.industry}</p>}
          </div>
        )}
        {desc && (
          <div className="bg-surface-2 border border-border-soft rounded-lg p-3 sm:col-span-1">
            <p className="text-xs text-slate-500 mb-1">About</p>
            <p className="text-sm text-slate-300 leading-relaxed">{desc}</p>
          </div>
        )}
      </div>

      {/* News */}
      {news.length > 0 && <NewsSection items={news} title={`${quote.symbol} News`} />}
    </div>
  );
}
