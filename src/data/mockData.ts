import { User, UsageData, Bill, Receipt } from '../types';
import { addDays, format, subDays, subMonths } from 'date-fns';

// Helper function to generate random number within range
const getRandomNumber = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// Mock Users
export const users: User[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    address: '123 Main St, Anytown, AT 12345',
    meterNumber: 'MT12345678',
    role: 'user',
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    address: '456 Oak Ave, Somewhere, SM 67890',
    meterNumber: 'MT87654321',
    role: 'user',
  },
  {
    id: '3',
    name: 'Admin User',
    email: 'admin@example.com',
    address: '789 Admin Blvd, Adminville, AD 99999',
    meterNumber: 'MT99999999',
    role: 'admin',
  },
];

// Generate mock usage data for the past 30 days
export const generateMockUsageData = (userId: string): UsageData[] => {
  const today = new Date();
  const usageData: UsageData[] = [];

  for (let i = 0; i < 30; i++) {
    const date = subDays(today, i);
    usageData.push({
      id: `usage-${userId}-${i}`,
      userId,
      date: format(date, 'yyyy-MM-dd'),
      kWh: getRandomNumber(8, 25),
      peakHours: getRandomNumber(5, 12),
      offPeakHours: getRandomNumber(3, 10),
    });
  }

  return usageData;
};

// Generate mock bills for the past 6 months
export const generateMockBills = (userId: string): Bill[] => {
  const today = new Date();
  const bills: Bill[] = [];

  for (let i = 0; i < 6; i++) {
    const date = subMonths(today, i);
    const month = format(date, 'MMMM');
    const year = date.getFullYear();
    const totalUsage = getRandomNumber(240, 450);
    const amount = totalUsage * 0.12; // $0.12 per kWh
    const dueDate = format(addDays(date, 15), 'yyyy-MM-dd');
    
    // Bills from more than 1 month ago are marked as paid
    const paid = i > 0;
    const paidOn = paid ? format(addDays(date, getRandomNumber(5, 12)), 'yyyy-MM-dd') : undefined;

    bills.push({
      id: `bill-${userId}-${i}`,
      userId,
      month,
      year,
      totalUsage,
      amount,
      dueDate,
      paid,
      paidOn,
    });
  }

  return bills;
};

// Generate mock receipts for paid bills
export const generateMockReceipts = (userId: string, bills: Bill[]): Receipt[] => {
  return bills
    .filter(bill => bill.paid)
    .map((bill, i) => ({
      id: `receipt-${userId}-${i}`,
      billId: bill.id,
      userId,
      paidAmount: bill.amount,
      paidOn: bill.paidOn!,
      paymentMethod: i % 2 === 0 ? 'Credit Card' : 'Bank Transfer',
      transactionId: `TRX-${getRandomNumber(100000, 999999)}`,
    }));
};

// Combine all mock data
export const mockUsageData: UsageData[] = [
  ...generateMockUsageData('1'),
  ...generateMockUsageData('2'),
];

export const mockBills: Bill[] = [
  ...generateMockBills('1'),
  ...generateMockBills('2'),
];

export const mockReceipts: Receipt[] = [
  ...generateMockReceipts('1', mockBills.filter(bill => bill.userId === '1')),
  ...generateMockReceipts('2', mockBills.filter(bill => bill.userId === '2')),
];