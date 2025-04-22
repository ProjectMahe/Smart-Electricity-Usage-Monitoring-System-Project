import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getUserUsageData } from '../services/usageService';
import { UsageData } from '../types';
import UsageChart from '../components/dashboard/UsageChart';
import Card from '../components/ui/Card';
import { format, parseISO, subDays } from 'date-fns';
import { BarChart3, Calendar, ArrowDownCircle } from 'lucide-react';

const UsagePage: React.FC = () => {
  const { user } = useAuth();
  const [usageData, setUsageData] = useState<UsageData[]>([]);
  const [selectedPeriod, setSelectedPeriod] = useState<number>(7); // 7, 14, 30 days
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      // Fetch user data
      const data = getUserUsageData(user.id);
      setUsageData(data);
      setIsLoading(false);
    }
  }, [user]);

  // Filter data based on selected period
  const filteredData = usageData
    .filter(data => {
      const dataDate = new Date(data.date);
      const cutoffDate = subDays(new Date(), selectedPeriod);
      return dataDate >= cutoffDate;
    })
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  // Calculate total kWh for the period
  const totalUsage = filteredData.reduce((sum, item) => sum + item.kWh, 0);
  
  // Calculate average daily usage
  const avgDailyUsage = totalUsage / filteredData.length || 0;
  
  // Find day with highest usage
  const highestUsageDay = [...filteredData].sort((a, b) => b.kWh - a.kWh)[0];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Electricity Usage</h1>
          
          <div className="flex space-x-2">
            <button
              onClick={() => setSelectedPeriod(7)}
              className={`px-3 py-1 text-sm rounded-md ${
                selectedPeriod === 7
                  ? 'bg-blue-100 text-blue-700'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              7 Days
            </button>
            <button
              onClick={() => setSelectedPeriod(14)}
              className={`px-3 py-1 text-sm rounded-md ${
                selectedPeriod === 14
                  ? 'bg-blue-100 text-blue-700'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              14 Days
            </button>
            <button
              onClick={() => setSelectedPeriod(30)}
              className={`px-3 py-1 text-sm rounded-md ${
                selectedPeriod === 30
                  ? 'bg-blue-100 text-blue-700'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              30 Days
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Usage</p>
                <p className="text-3xl font-bold">{totalUsage.toFixed(1)} kWh</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <BarChart3 className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            <p className="text-sm text-gray-500 mt-2">
              Over the last {selectedPeriod} days
            </p>
          </Card>
          
          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Average Daily Usage</p>
                <p className="text-3xl font-bold">{avgDailyUsage.toFixed(1)} kWh</p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <Calendar className="h-6 w-6 text-green-600" />
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5 mt-3">
              <div 
                className="bg-green-600 h-2.5 rounded-full" 
                style={{ width: `${(avgDailyUsage / 25) * 100}%` }}
              ></div>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Compared to 25 kWh national average
            </p>
          </Card>
          
          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Highest Usage Day</p>
                <p className="text-3xl font-bold">
                  {highestUsageDay ? highestUsageDay.kWh.toFixed(1) : "0"} kWh
                </p>
              </div>
              <div className="p-3 bg-orange-100 rounded-full">
                <ArrowDownCircle className="h-6 w-6 text-orange-600" />
              </div>
            </div>
            <p className="text-sm text-gray-500 mt-2">
              {highestUsageDay 
                ? format(parseISO(highestUsageDay.date), 'MMM dd, yyyy') 
                : "No data available"}
            </p>
          </Card>
        </div>
        
        <div className="grid grid-cols-1 gap-6">
          <Card>
            <div className="h-96">
              <UsageChart data={filteredData} days={selectedPeriod} title={`Electricity Usage - Last ${selectedPeriod} Days`} />
            </div>
          </Card>
          
          <Card>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Daily Usage Breakdown</h3>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total Usage
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Peak Hours
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Off-Peak Hours
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredData.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {format(parseISO(item.date), 'MMM dd, yyyy')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.kWh} kWh
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex items-center">
                          <span className="mr-2">{item.peakHours} kWh</span>
                          <div className="w-16 bg-gray-200 rounded-full h-1.5">
                            <div 
                              className="bg-orange-500 h-1.5 rounded-full" 
                              style={{ width: `${(item.peakHours / item.kWh) * 100}%` }}
                            ></div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex items-center">
                          <span className="mr-2">{item.offPeakHours} kWh</span>
                          <div className="w-16 bg-gray-200 rounded-full h-1.5">
                            <div 
                              className="bg-green-500 h-1.5 rounded-full" 
                              style={{ width: `${(item.offPeakHours / item.kWh) * 100}%` }}
                            ></div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default UsagePage;