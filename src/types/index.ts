export interface User {
  id: string;
  name: string;
  email: string;
  address: string;
  meterNumber: string;
  role: 'user' | 'admin';
}

export interface UsageData {
  id: string;
  userId: string;
  date: string;
  kWh: number;
  peakHours: number;
  offPeakHours: number;
}

export interface Bill {
  id: string;
  userId: string;
  month: string;
  year: number;
  totalUsage: number;
  amount: number;
  dueDate: string;
  paid: boolean;
  paidOn?: string;
}

export interface Receipt {
  id: string;
  billId: string;
  userId: string;
  paidAmount: number;
  paidOn: string;
  paymentMethod: string;
  transactionId: string;
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: {
    name: string;
    email: string;
    password: string;
    address: string;
    meterNumber: string;
  }) => Promise<void>;
  logout: () => void;
}