import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getBillById } from '../services/usageService';
import { generateBillPDF } from '../services/pdfService';
import { Bill } from '../types';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { 
  Calendar, 
  Zap, 
  Download, 
  CheckCircle, 
  AlertCircle,
  CreditCard
} from 'lucide-react';

const BillDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [bill, setBill] = useState<Bill | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (id && user) {
      const billData = getBillById(id);
      if (billData) {
        setBill(billData);
      }
      setIsLoading(false);
    }
  }, [id, user]);

  const handleDownloadPDF = () => {
    if (bill && user) {
      const pdfDataUri = generateBillPDF(bill, user);
      const linkElement = document.createElement('a');
      linkElement.href = pdfDataUri;
      linkElement.download = `EnergyTrack_Bill_${bill.month}_${bill.year}.pdf`;
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

  if (!bill) {
    return (
      <div className="min-h-screen bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Card>
            <div className="py-8 text-center">
              <h2 className="text-xl font-semibold text-gray-800 mb-2">Bill Not Found</h2>
              <p className="text-gray-500 mb-4">The bill you're looking for doesn't exist.</p>
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
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Bill Details</h1>
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
          <div className="border-b border-gray-200 pb-4 mb-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-800">
                {bill.month} {bill.year} Bill
              </h2>
              {bill.paid ? (
                <span className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full flex items-center">
                  <CheckCircle className="h-4 w-4 mr-1" /> Paid
                </span>
              ) : (
                <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-sm rounded-full flex items-center">
                  <AlertCircle className="h-4 w-4 mr-1" /> Unpaid
                </span>
              )}
            </div>
            <p className="text-sm text-gray-500">
              Bill #{bill.id}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-md font-medium text-gray-700 mb-3">Bill Information</h3>
              
              <div className="space-y-3">
                <div className="flex items-center">
                  <Calendar className="h-5 w-5 text-gray-400 mr-2" />
                  <div>
                    <p className="text-sm text-gray-500">Billing Period</p>
                    <p className="font-medium">{bill.month} {bill.year}</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <Calendar className="h-5 w-5 text-gray-400 mr-2" />
                  <div>
                    <p className="text-sm text-gray-500">Due Date</p>
                    <p className="font-medium">{new Date(bill.dueDate).toLocaleDateString()}</p>
                  </div>
                </div>
                
                {bill.paid && bill.paidOn && (
                  <div className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                    <div>
                      <p className="text-sm text-gray-500">Payment Date</p>
                      <p className="font-medium">{new Date(bill.paidOn).toLocaleDateString()}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            <div>
              <h3 className="text-md font-medium text-gray-700 mb-3">Usage & Charges</h3>
              
              <div className="bg-gray-50 p-4 rounded">
                <div className="flex items-center mb-3">
                  <Zap className="h-5 w-5 text-blue-500 mr-2" />
                  <div>
                    <p className="text-sm text-gray-500">Total Usage</p>
                    <p className="font-medium">{bill.totalUsage} kWh</p>
                  </div>
                </div>
                
                <div className="border-t border-gray-200 pt-3 mt-3">
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-600">Electricity Charge (${(0.12).toFixed(2)}/kWh)</span>
                    <span className="text-gray-900">${bill.amount.toFixed(2)}</span>
                  </div>
                  
                  <div className="flex justify-between pt-3 mt-3 border-t border-gray-200">
                    <span className="text-md font-bold">Total Amount</span>
                    <span className="text-md font-bold text-blue-600">${bill.amount.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {!bill.paid && (
            <div className="border-t border-gray-200 pt-4 mt-6">
              <Link to={`/pay/${bill.id}`}>
                <Button variant="primary" fullWidth className="flex items-center justify-center">
                  <CreditCard className="h-5 w-5 mr-2" />
                  Pay This Bill
                </Button>
              </Link>
            </div>
          )}
          
          {bill.paid && (
            <div className="border-t border-gray-200 pt-4 mt-6">
              <Link to={`/receipts/${bill.id}`}>
                <Button variant="outline" fullWidth className="flex items-center justify-center">
                  <Download className="h-5 w-5 mr-2" />
                  View Receipt
                </Button>
              </Link>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default BillDetailPage;