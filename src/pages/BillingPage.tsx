import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getUserBills } from '../services/usageService';
import { Bill } from '../types';
import Card from '../components/ui/Card';
import BillingTable from '../components/billing/BillingTable';
import { FileText, ArrowUpCircle } from 'lucide-react';

const BillingPage: React.FC = () => {
  const { user } = useAuth();
  const [bills, setBills] = useState<Bill[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      // Fetch user bills
      const userBills = getUserBills(user.id);
      setBills(userBills);
      setIsLoading(false);
    }
  }, [user]);

  // Calculate total amount due
  const totalDue = bills
    .filter(bill => !bill.paid)
    .reduce((sum, bill) => sum + bill.amount, 0);

  // Calculate paid bills value
  const totalPaid = bills
    .filter(bill => bill.paid)
    .reduce((sum, bill) => sum + bill.amount, 0);

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
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Billing & Payments</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Amount Due</p>
                <p className="text-3xl font-bold">${totalDue.toFixed(2)}</p>
              </div>
              <div className="p-3 bg-orange-100 rounded-full">
                <FileText className="h-6 w-6 text-orange-600" />
              </div>
            </div>
            <p className="text-sm text-gray-500 mt-2">
              {totalDue > 0 
                ? `You have ${bills.filter(bill => !bill.paid).length} unpaid bill(s)`
                : 'All bills are paid'}
            </p>
          </Card>
          
          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Paid (YTD)</p>
                <p className="text-3xl font-bold">${totalPaid.toFixed(2)}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <ArrowUpCircle className="h-6 w-6 text-green-600" />
              </div>
            </div>
            <p className="text-sm text-gray-500 mt-2">
              From {bills.filter(bill => bill.paid).length} bill(s)
            </p>
          </Card>
        </div>
        
        <Card>
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Bill History</h2>
          <BillingTable bills={bills} />
        </Card>
      </div>
    </div>
  );
};

export default BillingPage;