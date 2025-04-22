import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
} from 'chart.js';
import { UsageData } from '../../types';
import { format, parseISO } from 'date-fns';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface UsageChartProps {
  data: UsageData[];
  days?: number;
  title?: string;
}

const UsageChart: React.FC<UsageChartProps> = ({ 
  data, 
  days = 7,
  title = 'Electricity Usage (kWh)'
}) => {
  // Sort data by date ascending
  const sortedData = [...data].sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );
  
  // Get the most recent days
  const recentData = sortedData.slice(-days);
  
  const chartData = {
    labels: recentData.map(item => format(parseISO(item.date), 'MMM dd')),
    datasets: [
      {
        label: 'Total Usage (kWh)',
        data: recentData.map(item => item.kWh),
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
        tension: 0.2,
      },
      {
        label: 'Peak Hours (kWh)',
        data: recentData.map(item => item.peakHours),
        borderColor: 'rgb(249, 115, 22)',
        backgroundColor: 'rgba(249, 115, 22, 0.5)',
        tension: 0.2,
      },
      {
        label: 'Off-Peak Hours (kWh)',
        data: recentData.map(item => item.offPeakHours),
        borderColor: 'rgb(16, 185, 129)',
        backgroundColor: 'rgba(16, 185, 129, 0.5)',
        tension: 0.2,
      },
    ],
  };

  const options: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: title,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'kWh',
        },
      },
      x: {
        title: {
          display: true,
          text: 'Date',
        },
      },
    },
    interaction: {
      intersect: false,
      mode: 'index',
    },
  };

  return (
    <div className="w-full h-64 sm:h-80">
      <Line data={chartData} options={options} />
    </div>
  );
};

export default UsageChart;