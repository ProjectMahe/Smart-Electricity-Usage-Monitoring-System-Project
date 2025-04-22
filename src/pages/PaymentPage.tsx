import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getBillById, payBill } from '../services/usageService';
import { Bill } from '../types';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import * as Lucide from 'lucide-react';

const PaymentPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [bill, setBill] = useState<Bill | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState<'credit' | 'bank'>('credit');
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [routingNumber, setRoutingNumber] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [receiptId, setReceiptId] = useState<string | null>(null);

  useEffect(() => {
    if (id && user) {
      const billData = getBillById(id);
      if (billData) {
        if (billData.paid) {
          // Bill already paid, redirect
          navigate(`/bills/${id}`);
          return;
        }
        setBill(billData);
      }
      setIsLoading(false);
    }
  }, [id, user, navigate]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (paymentMethod === 'credit') {
      if (!cardNumber) {
        newErrors.cardNumber = 'Card number is required';
      } else if (!/^\d{16}$/.test(cardNumber.replace(/\s/g, ''))) {
        newErrors.cardNumber = 'Invalid card number';
      }
      
      if (!expiryDate) {
        newErrors.expiryDate = 'Expiry date is required';
      } else if (!/^\d{2}\/\d{2}$/.test(expiryDate)) {
        newErrors.expiryDate = 'Invalid format (MM/YY)';
      }
      
      if (!cvv) {
        newErrors.cvv = 'CVV is required';
      } else if (!/^\d{3,4}$/.test(cvv)) {
        newErrors.cvv = 'Invalid CVV';
      }
    } else {
      if (!accountNumber) {
        newErrors.accountNumber = 'Account number is required';
      } else if (!/^\d{8,17}$/.test(accountNumber.replace(/\s/g, ''))) {
        newErrors.accountNumber = 'Invalid account number';
      }
      
      if (!routingNumber) {
        newErrors.routingNumber = 'Routing number is required';
      } else if (!/^\d{9}$/.test(routingNumber)) {
        newErrors.routingNumber = 'Invalid routing number';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePayment = async () => {
    if (!validateForm() || !bill) {
      return;
    }
    
    setIsProcessing(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Process payment
      const paymentMethodDisplay = paymentMethod === 'credit' ? 'Credit Card' : 'Bank Transfer';
      const receipt = payBill(bill.id, paymentMethodDisplay);
      
      setPaymentSuccess(true);
      setReceiptId(receipt.id);
    } catch (error) {
      setErrors({ form: 'Payment failed. Please try again.' });
    } finally {
      setIsProcessing(false);
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
              <p className="text-gray-500 mb-4">The bill you're trying to pay doesn't exist.</p>
              <Link to="/billing">
                <Button variant="primary">Go Back to Billing</Button>
              </Link>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  if (paymentSuccess) {
    return (
      <div className="min-h-screen bg-gray-100">
        <div className="max-w-md mx-auto px-4 sm:px-6 py-12">
          <Card>
            <div className="py-8 text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                <Lucide.CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-800 mb-2">Payment Successful!</h2>
              <p className="text-gray-500 mb-4">
                Your payment of ${bill.amount.toFixed(2)} for {bill.month} {bill.year} has been processed successfully.
              </p>
              <div className="flex flex-col space-y-3 mt-6">
                <Link to={`/receipts/${bill.id}`}>
                  <Button variant="primary" fullWidth>
                    View Receipt
                  </Button>
                </Link>
                <Link to="/billing">
                  <Button variant="outline" fullWidth>
                    Return to Billing
                  </Button>
                </Link>
              </div>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center mb-6">
          <Link to={`/bills/${bill.id}`} className="text-blue-600 hover:text-blue-800 flex items-center">
            <Lucide.ArrowLeft className="h-4 w-4 mr-1" />
            Back to Bill
          </Link>
        </div>
        
        <Card>
          <div className="border-b border-gray-200 pb-4 mb-6">
            <h1 className="text-xl font-bold text-gray-900">Make a Payment</h1>
            <p className="text-sm text-gray-500 mt-1">
              Bill for {bill.month} {bill.year}
            </p>
          </div>
          
          <div className="bg-blue-50 p-4 rounded-md border border-blue-100 mb-6">
            <div className="flex justify-between items-center">
              <span className="text-gray-700">Amount Due:</span>
              <span className="text-lg font-bold text-blue-600">${bill.amount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center mt-2">
              <span className="text-gray-700">Due Date:</span>
              <span className="text-gray-700">{new Date(bill.dueDate).toLocaleDateString()}</span>
            </div>
          </div>
          
          {errors.form && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
              <div className="flex">
                <div className="ml-3">
                  <p className="text-sm text-red-700">{errors.form}</p>
                </div>
              </div>
            </div>
          )}
          
          <div className="mb-6">
            <h2 className="text-md font-semibold text-gray-800 mb-3">Select Payment Method</h2>
            
            <div className="flex space-x-3">
              <button
                type="button"
                className={`flex-1 p-3 border rounded-md flex items-center justify-center ${
                  paymentMethod === 'credit'
                    ? 'bg-blue-50 border-blue-300'
                    : 'border-gray-300 hover:bg-gray-50'
                }`}
                onClick={() => setPaymentMethod('credit')}
              >
                <Lucide.CreditCard className={`h-5 w-5 mr-2 ${paymentMethod === 'credit' ? 'text-blue-500' : 'text-gray-500'}`} />
                <span className={paymentMethod === 'credit' ? 'text-blue-700' : 'text-gray-700'}>Credit Card</span>
              </button>
              
              <button
                type="button"
                className={`flex-1 p-3 border rounded-md flex items-center justify-center ${
                  paymentMethod === 'bank'
                    ? 'bg-blue-50 border-blue-300'
                    : 'border-gray-300 hover:bg-gray-50'
                }`}
                onClick={() => setPaymentMethod('bank')}
              >
                <Lucide.Bank className={`h-5 w-5 mr-2 ${paymentMethod === 'bank' ? 'text-blue-500' : 'text-gray-500'}`} />
                <span className={paymentMethod === 'bank' ? 'text-blue-700' : 'text-gray-700'}>Bank Transfer</span>
              </button>
            </div>
          </div>
          
          {paymentMethod === 'credit' ? (
            <div className="space-y-4">
              <div>
                <div className="flex items-center mb-2">
                  <Lucide.CreditCard className="h-5 w-5 text-gray-500 mr-2" />
                  <label htmlFor="cardNumber" className="font-medium text-gray-700">Card Number</label>
                </div>
                <Input
                  id="cardNumber"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  placeholder="1234 5678 9012 3456"
                  fullWidth
                  error={errors.cardNumber}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="flex items-center mb-2">
                    <Lucide.Calendar className="h-5 w-5 text-gray-500 mr-2" />
                    <label htmlFor="expiryDate" className="font-medium text-gray-700">Expiry Date</label>
                  </div>
                  <Input
                    id="expiryDate"
                    value={expiryDate}
                    onChange={(e) => setExpiryDate(e.target.value)}
                    placeholder="MM/YY"
                    fullWidth
                    error={errors.expiryDate}
                  />
                </div>
                
                <div>
                  <div className="flex items-center mb-2">
                    <Lucide.DollarSign className="h-5 w-5 text-gray-500 mr-2" />
                    <label htmlFor="cvv" className="font-medium text-gray-700">CVV</label>
                  </div>
                  <Input
                    id="cvv"
                    value={cvv}
                    onChange={(e) => setCvv(e.target.value)}
                    placeholder="123"
                    fullWidth
                    error={errors.cvv}
                    type="password"
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <div className="flex items-center mb-2">
                  <Lucide.Bank className="h-5 w-5 text-gray-500 mr-2" />
                  <label htmlFor="accountNumber" className="font-medium text-gray-700">Account Number</label>
                </div>
                <Input
                  id="accountNumber"
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value)}
                  placeholder="Account Number"
                  fullWidth
                  error={errors.accountNumber}
                />
              </div>
              
              <div>
                <div className="flex items-center mb-2">
                  <Lucide.Bank className="h-5 w-5 text-gray-500 mr-2" />
                  <label htmlFor="routingNumber" className="font-medium text-gray-700">Routing Number</label>
                </div>
                <Input
                  id="routingNumber"
                  value={routingNumber}
                  onChange={(e) => setRoutingNumber(e.target.value)}
                  placeholder="Routing Number"
                  fullWidth
                  error={errors.routingNumber}
                />
              </div>
            </div>
          )}
          
          <div className="mt-6">
            <Button
              onClick={handlePayment}
              variant="primary"
              fullWidth
              isLoading={isProcessing}
              size="lg"
            >
              Pay ${bill.amount.toFixed(2)}
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default PaymentPage;