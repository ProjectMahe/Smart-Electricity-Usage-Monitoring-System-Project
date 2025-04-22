import { UsageData, Bill, Receipt, User } from '../types';
import { 
  mockUsageData, 
  mockBills, 
  mockReceipts, 
  generateMockUsageData, 
  generateMockBills, 
  generateMockReceipts 
} from '../data/mockData';

// Get usage data for a specific user
export const getUserUsageData = (userId: string): UsageData[] => {
  // In a real app, this would fetch from an API
  return mockUsageData.filter(data => data.userId === userId);
};

// Get bills for a specific user
export const getUserBills = (userId: string): Bill[] => {
  // In a real app, this would fetch from an API
  return mockBills.filter(bill => bill.userId === userId);
};

// Get receipts for a specific user
export const getUserReceipts = (userId: string): Receipt[] => {
  // In a real app, this would fetch from an API
  return mockReceipts.filter(receipt => receipt.userId === userId);
};

// Get a specific bill by ID
export const getBillById = (billId: string): Bill | undefined => {
  return mockBills.find(bill => bill.id === billId);
};

// Get a specific receipt by ID
export const getReceiptById = (receiptId: string): Receipt | undefined => {
  return mockReceipts.find(receipt => receipt.id === receiptId);
};

// Pay a bill
export const payBill = (billId: string, paymentMethod: string): Receipt => {
  // In a real app, this would update the database
  const bill = getBillById(billId);
  
  if (!bill) {
    throw new Error('Bill not found');
  }
  
  if (bill.paid) {
    throw new Error('Bill already paid');
  }
  
  // Update bill status
  const billIndex = mockBills.findIndex(b => b.id === billId);
  mockBills[billIndex] = {
    ...bill,
    paid: true,
    paidOn: new Date().toISOString().split('T')[0],
  };
  
  // Create receipt
  const receipt: Receipt = {
    id: `receipt-${bill.userId}-${Date.now()}`,
    billId: bill.id,
    userId: bill.userId,
    paidAmount: bill.amount,
    paidOn: new Date().toISOString().split('T')[0],
    paymentMethod,
    transactionId: `TRX-${Math.floor(Math.random() * 900000) + 100000}`,
  };
  
  mockReceipts.push(receipt);
  
  return receipt;
};

// Generate demo data for a new user
export const generateUserData = (user: User): void => {
  // Generate usage data
  const newUsageData = generateMockUsageData(user.id);
  mockUsageData.push(...newUsageData);
  
  // Generate bills
  const newBills = generateMockBills(user.id);
  mockBills.push(...newBills);
  
  // Generate receipts
  const newReceipts = generateMockReceipts(
    user.id, 
    newBills.filter(bill => bill.paid)
  );
  mockReceipts.push(...newReceipts);
};