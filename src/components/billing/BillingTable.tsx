import React from 'react';
import { Bill } from '../../types';
import { Link } from 'react-router-dom';
import { FileText, Download, CheckCircle, AlertCircle, CreditCard } from 'lucide-react';
import Button from '../ui/Button';

interface BillingTableProps {
  bills: Bill[];
}

const BillingTable: React.FC<BillingTableProps> = ({ bills }) => {
  // Sort bills by year and month (most recent first)
  const sortedBills = [...bills].sort((a, b) => {
    if (a.year !== b.year) return b.year - a.year;
    
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    
    return months.indexOf(b.month) - months.indexOf(a.month);
  });

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Period
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Usage
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Amount
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Due Date
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {sortedBills.map((bill) => (
            <tr key={bill.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <FileText className="flex-shrink-0 h-5 w-5 text-gray-400 mr-3" />
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      {bill.month} {bill.year}
                    </div>
                    <div className="text-xs text-gray-500">
                      Bill #{bill.id.substring(bill.id.length - 6)}
                    </div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {bill.totalUsage} kWh
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">
                  ${bill.amount.toFixed(2)}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {new Date(bill.dueDate).toLocaleDateString()}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {bill.paid ? (
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                    <CheckCircle className="h-4 w-4 mr-1" /> Paid
                  </span>
                ) : (
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                    <AlertCircle className="h-4 w-4 mr-1" /> Unpaid
                  </span>
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                {bill.paid ? (
                  <Link 
                    to={`/receipts/${bill.id}`} 
                    className="text-blue-600 hover:text-blue-900 inline-flex items-center mr-3"
                  >
                    <Download className="h-4 w-4 mr-1" /> Receipt
                  </Link>
                ) : (
                  <Link 
                    to={`/pay/${bill.id}`} 
                    className="text-green-600 hover:text-green-900 inline-flex items-center mr-3"
                  >
                    <CreditCard className="h-4 w-4 mr-1" /> Pay
                  </Link>
                )}
                <Link 
                  to={`/bills/${bill.id}`} 
                  className="text-blue-600 hover:text-blue-900 inline-flex items-center"
                >
                  View
                </Link>
              </td>
            </tr>
          ))}
          {sortedBills.length === 0 && (
            <tr>
              <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">
                No bills found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default BillingTable;