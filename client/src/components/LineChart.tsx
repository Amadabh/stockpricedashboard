import React,{useState, useEffect} from "react";
import { Quote } from "./StockTable";
import "../chartSetup";

import { Line } from "react-chartjs-2";


interface ChartDataset {
  label: string;
  data: number[];
  fill: boolean;
  backgroundColor:string,
  borderColor: string,
  borderWidth:number,
  pointRadius: number,
  pointBorderWidth: number,
  tension: number;
}

export interface ChartData {
  labels: string[];
  datasets: ChartDataset[];
}


interface StockProps {
  stocks: Quote[];
}


const LineChart: React.FC<StockProps> = ({ stocks}) => {

    
  const [linedata, setLinedata] = useState<ChartData>({
    labels: [],
    datasets: [],
  });


  
  useEffect(() => {
    const labels = stocks.map((q) => q.symbol);
    const values = stocks.map((q) => q.price);

    const Chartdata: ChartData = {
      labels,
      datasets: [
        {
          label: "Stock Data",
          data: values,
          fill: false,
          backgroundColor: "rgb(172, 137, 216)",
          borderColor: "rgb(241, 181, 75)",
          borderWidth:1,
          pointRadius: 5,
          pointBorderWidth: 0,
          tension: 0.3,
        },
      ],
    };

    setLinedata(Chartdata);
  }, [stocks]);

  return (
    <Line
    data={linedata}
    options={{
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          labels: {
            color: "#33e0ff", 
            font: {
              size: 14,
            },
            borderRadius:20,    
           
          },
        },
      },
      scales: {
        x: {
          ticks: {
            color: "#38bdf8", 
          },
          grid: {
            color: "#ccc", 
          },
        },
        y: {
          ticks: {
            color: "#38bdf8", 
          },
          grid: {
            color: "#ccc", 
          },
        },
      },
    }}
  />
  );
};

export default LineChart;
