import React from 'react';
import { UsageData } from '../../types';
import Card from '../ui/Card';
import { TrendingUp, TrendingDown, Zap } from 'lucide-react';

interface UsageSummaryProps {
  data: UsageData[];
}

const UsageSummary: React.FC<UsageSummaryProps> = ({ data }) => {
  // Calculate total usage for the current period
  const totalUsage = data.reduce((sum, item) => sum + item.kWh, 0);
  
  // Calculate average daily usage
  const avgDailyUsage = totalUsage / data.length;
  
  // Find max and min usage days
  const maxUsage = Math.max(...data.map(item => item.kWh));
  const minUsage = Math.min(...data.map(item => item.kWh));
  
  // Calculate percentage of peak vs off-peak usage
  const totalPeakHours = data.reduce((sum, item) => sum + item.peakHours, 0);
  const totalOffPeakHours = data.reduce((sum, item) => sum + item.offPeakHours, 0);
  const peakPercentage = (totalPeakHours / (totalPeakHours + totalOffPeakHours)) * 100;
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-500 text-sm">Total Usage</p>
            <p className="text-2xl font-semibold">{totalUsage.toFixed(1)} kWh</p>
          </div>
          <div className="p-3 bg-blue-100 rounded-full">
            <Zap className="h-6 w-6 text-blue-600" />
          </div>
        </div>
        <p className="text-sm text-gray-500 mt-2">For the last {data.length} days</p>
      </Card>
      
      <Card>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-500 text-sm">Daily Average</p>
            <p className="text-2xl font-semibold">{avgDailyUsage.toFixed(1)} kWh</p>
          </div>
          <div className="p-3 bg-green-100 rounded-full">
            <TrendingDown className="h-6 w-6 text-green-600" />
          </div>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5 mt-3">
          <div 
            className="bg-green-600 h-2.5 rounded-full" 
            style={{ width: `${(avgDailyUsage / 25) * 100}%` }}
          ></div>
        </div>
        <p className="text-xs text-gray-500 mt-1">Compared to 25 kWh national average</p>
      </Card>
      
      <Card>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-500 text-sm">Peak Usage</p>
            <p className="text-2xl font-semibold">{peakPercentage.toFixed(0)}%</p>
          </div>
          <div className="p-3 bg-orange-100 rounded-full">
            <TrendingUp className="h-6 w-6 text-orange-600" />
          </div>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5 mt-3">
          <div 
            className="bg-orange-500 h-2.5 rounded-full" 
            style={{ width: `${peakPercentage}%` }}
          ></div>
        </div>
        <p className="text-xs text-gray-500 mt-1">
          {peakPercentage > 60 
            ? 'Try to reduce peak hour usage to save costs' 
            : 'Good distribution of energy usage'}
        </p>
      </Card>
      
      <Card>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-500 text-sm">Usage Range</p>
            <p className="text-2xl font-semibold">{minUsage} - {maxUsage} kWh</p>
          </div>
          <div className="p-3 bg-purple-100 rounded-full">
            <Zap className="h-6 w-6 text-purple-600" />
          </div>
        </div>
        <div className="flex justify-between mt-2 text-xs text-gray-500">
          <span>Min: {minUsage} kWh</span>
          <span>Max: {maxUsage} kWh</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5 mt-1">
          <div 
            className="bg-purple-600 h-2.5 rounded-full" 
            style={{ width: `${((maxUsage - minUsage) / maxUsage) * 100}%` }}
          ></div>
        </div>
      </Card>
    </div>
  );
};

export default UsageSummary;