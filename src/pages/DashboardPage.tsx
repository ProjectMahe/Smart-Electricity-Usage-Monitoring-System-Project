import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getUserUsageData, getUserBills } from '../services/usageService';
import { UsageData, Bill } from '../types';
import UsageChart from '../components/dashboard/UsageChart';
import UsageSummary from '../components/dashboard/UsageSummary';
import Card from '../components/ui/Card';
import { Link } from 'react-router-dom';
import { AlertTriangle, CheckCircle, Clock, Zap, FileText } from 'lucide-react';
import Button from '../components/ui/Button';

const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [usageData, setUsageData] = useState<UsageData[]>([]);
  const [bills, setBills] = useState<Bill[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      // Fetch user data
      const data = getUserUsageData(user.id);
      const userBills = getUserBills(user.id);
      
      setUsageData(data);
      setBills(userBills);
      setIsLoading(false);
    }
  }, [user]);

  // Get today's usage
  const todayUsage = usageData.length > 0 ? usageData[0] : null;
  
  // Get unpaid bill
  const unpaidBill = bills.find(bill => !bill.paid);
  
  const currentDate = new Date();
  const currentMonth = currentDate.toLocaleString('default', { month: 'long' });
  const currentYear = currentDate.getFullYear();

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
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <div className="text-sm text-gray-500">
            <Clock className="inline h-4 w-4 mr-1" /> 
            {currentMonth} {currentYear}
          </div>
        </div>
        
        {/* Alert for unpaid bill */}
        {unpaidBill && (
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <AlertTriangle className="h-5 w-5 text-yellow-400" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-yellow-700">
                  You have an unpaid bill for {unpaidBill.month} {unpaidBill.year} of ${unpaidBill.amount.toFixed(2)}
                </p>
                <div className="mt-2">
                  <Link
                    to={`/pay/${unpaidBill.id}`}
                    className="text-sm font-medium text-yellow-700 hover:text-yellow-600"
                  >
                    Pay Now →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Usage Summary */}
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Usage Summary</h2>
        <UsageSummary data={usageData.slice(0, 7)} />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          <div className="lg:col-span-2">
            <Card className="h-full">
              <UsageChart data={usageData} days={14} title="Recent Electricity Consumption" />
            </Card>
          </div>
          
          <div>
            <Card>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Today's Usage</h3>
              
              {todayUsage ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Total</span>
                    <span className="text-gray-900 font-semibold">{todayUsage.kWh} kWh</span>
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Peak Hours</span>
                      <span>{todayUsage.peakHours} kWh</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-orange-500 h-2 rounded-full" 
                        style={{ width: `${(todayUsage.peakHours / todayUsage.kWh) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Off-Peak Hours</span>
                      <span>{todayUsage.offPeakHours} kWh</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-500 h-2 rounded-full" 
                        style={{ width: `${(todayUsage.offPeakHours / todayUsage.kWh) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="p-3 bg-blue-50 rounded text-sm text-blue-700">
                    <Zap className="inline h-4 w-4 mr-1" />
                    Your electricity usage is {todayUsage.kWh > 15 ? 'above' : 'below'} average today.
                  </div>
                </div>
              ) : (
                <p className="text-gray-500">No data available for today</p>
              )}
            </Card>
            
            <Card className="mt-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Billing Status</h3>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <div className="flex items-center">
                    <FileText className="h-5 w-5 text-gray-500 mr-2" />
                    <div>
                      <div className="text-sm font-medium">Latest Bill</div>
                      <div className="text-xs text-gray-500">
                        {bills.length > 0 
                          ? `${bills[0].month} ${bills[0].year}` 
                          : 'No bills available'}
                      </div>
                    </div>
                  </div>
                  <div className="text-lg font-bold">
                    {bills.length > 0 ? `$${bills[0].amount.toFixed(2)}` : '-'}
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-3 rounded">
                  <div className="flex items-center">
                    <div>
                      <div className="text-sm font-medium">Payment Status</div>
                    </div>
                  </div>
                  <div>
                    {bills.length > 0 && bills[0].paid ? (
                      <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full flex items-center">
                        <CheckCircle className="h-3 w-3 mr-1" /> Paid
                      </span>
                    ) : bills.length > 0 ? (
                      <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full flex items-center">
                        <AlertTriangle className="h-3 w-3 mr-1" /> Unpaid
                      </span>
                    ) : (
                      '-'
                    )}
                  </div>
                </div>
              </div>
              
              <div className="mt-4">
                <Link to="/billing">
                  <Button variant="outline" fullWidth>
                    View All Bills
                  </Button>
                </Link>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;