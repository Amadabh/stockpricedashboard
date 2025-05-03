import React from "react";

export interface Quote {
  symbol: string;
  price: number;
  changePercent: number;
}

interface StockTableProps {
  stocks: Quote[];
}


const StockTable: React.FC<StockTableProps> = ({ stocks }) => {
  return (
    <div className="bg-slate-800 p-4 rounded-lg shadow overflow-x-auto">
      <h2 className="text-lg font-semibold mb-4 text-sky-400">Live Prices</h2>
      <table className="w-full table-auto border-collapse">
        <thead className="bg-gray-100 text-left">
          <tr>
            <th className="px-4 py-2">Symbol</th>
            <th className="px-4 py-2">Price</th>
            <th className="px-4 py-2">Change %</th>
          </tr>
        </thead>
        <tbody>
          {stocks.map((stock) => (
            <tr key={stock.symbol} className="border-t hover:bg-gray-50 text-sky-400">
              <td className="px-4 py-2 font-medium">{stock.symbol}</td>
              <td className="px-4 py-2">
                {stock.price == null || isNaN(stock.price)
                  ? "$0.00"
                  : `$${stock.price.toFixed(2)}`}
              </td>
              <td
                className={`px-4 py-2 ${
                  stock.changePercent == null || isNaN(stock.changePercent)
                    ? "text-gray-500"
                    : stock.changePercent >= 0
                    ? "text-green-600"
                    : "text-red-500"
                }`}
              >
                {stock.changePercent == null || isNaN(stock.changePercent)
                  ? "0.00%"
                  : `${stock.changePercent.toFixed(2)}%`}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StockTable;
