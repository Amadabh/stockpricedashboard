import "./App.css";
import { useEffect, useState } from "react";
import StockTable, { Quote } from "./components/StockTable";
import LineChart from "./components/LineChart";






const CACHE_KEY = "stock_data";
const TIMESTAMP_KEY = "stock_data_timestamp";
const CACHE_TTL = 10 * 60 * 1000; // 10 minutes
const REFRESH_COOLDOWN = 15 * 1000; // 15 seconds

function App() {
  const [stocks, setStocks] = useState<Quote[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const [cooldownUntil, setCooldownUntil] = useState<number>(0);

  const formatTimestamp = (ts: number) => {
    const date = new Date(ts);
    return date.toLocaleTimeString();
  };


  const loadStocks = async (forceRefresh = false) => {
    setLoading(true);
    console.log("Loading stocks...");
  
    const cached = localStorage.getItem(CACHE_KEY);
    const timestampStr = localStorage.getItem(TIMESTAMP_KEY);
    const now = Date.now();
  
    if (
      cached &&
      timestampStr &&
      !forceRefresh &&
      now - parseInt(timestampStr) < CACHE_TTL
    ) {
      console.log("Loaded from cache");
      setStocks(JSON.parse(cached));
      setLastUpdated(formatTimestamp(parseInt(timestampStr)));
      setLoading(false);
      return;
    }
  
    try {
      const res = await fetch("/api/dashboarddata");
  
      console.log("API response status:", res.status);
      const quotes: Quote[] = await res.json();
      console.log("Quotes from API:", quotes);
  
      localStorage.setItem(CACHE_KEY, JSON.stringify(quotes));
      localStorage.setItem(TIMESTAMP_KEY, now.toString());
  
      setStocks(quotes);
      setLastUpdated(formatTimestamp(now));
      setCooldownUntil(now + REFRESH_COOLDOWN);
    } catch (err) {
      console.error("Error loading symbols or quotes:", err);
    } finally {
      setLoading(false);
    }
  };
  

  useEffect(() => {
    loadStocks();
  }, []);

  const handleRefresh = () => {
    const now = Date.now();
    if (now < cooldownUntil) {
      alert("Please wait a few seconds before refreshing again.");
      return;
    }
    loadStocks(true);
  };

  return (
    <div className="min-h-screen bg-gray-900 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold text-white">📈 Stock Dashboard</h1>

      
        <div className="flex items-center gap-4 flex-wrap">
          <button
            onClick={handleRefresh}
            className="bg-cyan-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
            disabled={loading}
          >
            🔄 Refresh Data
          </button>
          {loading && (
            <span className="text-sm text-amber-600">Updating...</span>
          )}
          {lastUpdated && (
            <span className="text-sm text-amber-500">
              Last updated at: <strong>{lastUpdated}</strong>
            </span>
          )}
        </div>

       
        <div className="bg-slate-700 p-4 rounded-lg shadow overflow-x-auto lg:flex lg:flex-row gap-10 h-[70%]">
          <div className="basis-1/3">
            {stocks && <StockTable stocks={stocks} />}
          </div>
          <div className="basis-2/3 w-full h-[400px] items-center self-center md:mt-5">
           { stocks && <LineChart stocks={stocks}/>}
          </div>

      

        </div>
      </div>
    </div>
  );
}

export default App;
