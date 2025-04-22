import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getBillById, getReceiptById } from '../services/usageService';
import { generateReceiptPDF } from '../services/pdfService';
import { Bill, Receipt } from '../types';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { Download, FileText, ArrowLeft, Calendar, CreditCard } from 'lucide-react';

const ReceiptPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [bill, setBill] = useState<Bill | null>(null);
  const [receipt, setReceipt] = useState<Receipt | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (id && user) {
      // Find bill
      const billData = getBillById(id);
      if (billData) {
        setBill(billData);
        
        // Find associated receipt
        const receiptData = getReceiptById(`receipt-${user.id}-${id.split('-')[2]}`);
        if (receiptData) {
          setReceipt(receiptData);
        }
      }
      setIsLoading(false);
    }
  }, [id, user]);

  const handleDownloadPDF = () => {
    if (bill && receipt && user) {
      const pdfDataUri = generateReceiptPDF(receipt, bill, user);
      const linkElement = document.createElement('a');
      linkElement.href = pdfDataUri;
      linkElement.download = `EnergyTrack_Receipt_${bill.month}_${bill.year}.pdf`;
      document.body.appendChild(linkElement);
      linkElement.click();
      document.body.removeChild(linkElement);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!bill || !receipt) {
    return (
      <div className="min-h-screen bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Card>
            <div className="py-8 text-center">
              <h2 className="text-xl font-semibold text-gray-800 mb-2">Receipt Not Found</h2>
              <p className="text-gray-500 mb-4">The receipt you're looking for doesn't exist or has not been generated yet.</p>
              <Link to="/billing">
                <Button variant="primary">Go Back to Billing</Button>
              </Link>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <Link to={`/bills/${bill.id}`} className="text-blue-600 hover:text-blue-800 flex items-center">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Bill
          </Link>
          
          <Button 
            variant="outline" 
            onClick={handleDownloadPDF}
            className="flex items-center"
          >
            <Download className="h-4 w-4 mr-2" />
            Download PDF
          </Button>
        </div>
        
        <Card>
          <div className="border-b border-gray-200 pb-4 mb-6">
            <div className="flex justify-between items-center">
              <h1 className="text-xl font-bold text-gray-900">Payment Receipt</h1>
              <div className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                PAID
              </div>
            </div>
            <p className="text-sm text-gray-500 mt-1">
              Receipt #{receipt.id.substring(receipt.id.length - 6)}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-3">BILL INFORMATION</h3>
              
              <div className="flex items-start mb-4">
                <FileText className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
                <div>
                  <p className="font-medium text-gray-900">Bill #{bill.id.substring(bill.id.length - 6)}</p>
                  <p className="text-sm text-gray-500 mt-1">
                    Billing Period: {bill.month} {bill.year}<br />
                    Due Date: {new Date(bill.dueDate).toLocaleDateString()}<br />
                    Total Usage: {bill.totalUsage} kWh
                  </p>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-3">PAYMENT INFORMATION</h3>
              
              <div className="flex items-start mb-4">
                <Calendar className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
                <div>
                  <p className="font-medium text-gray-900">Payment Date</p>
                  <p className="text-sm text-gray-500 mt-1">
                    {new Date(receipt.paidOn).toLocaleDateString()}
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <CreditCard className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
                <div>
                  <p className="font-medium text-gray-900">Payment Method</p>
                  <p className="text-sm text-gray-500 mt-1">
                    {receipt.paymentMethod}<br />
                    Transaction ID: {receipt.transactionId}
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-200 pt-6 mt-6">
            <div className="bg-gray-50 p-4 rounded-md">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Amount Paid</span>
                <span className="text-xl font-bold text-green-600">${receipt.paidAmount.toFixed(2)}</span>
              </div>
            </div>
          </div>
          
          <div className="mt-6 text-center text-sm text-gray-500">
            <p>
              Thank you for your payment. This is an official receipt for your records.
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ReceiptPage;