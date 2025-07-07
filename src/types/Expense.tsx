import type { TripUsers } from './Trip';

export interface ExpenseReq {
  amount: number;
  category: string;
  date: Date | string;
  paidBy: string;
  title: string;
  splitDetails: SplitDetail[];
  tripId: string;
}

export interface SplitDetail {
  splitDetailId?: string;
  userId: string;
  amount: number;
  userDetails?: TripUsers;
}

export interface ExpenseData {
  expenseId?: string;
  title: string;
  amount: number;
  paidBy: string;
  splitType: 'equal' | 'custom' | 'percentage';
  splitDetails: { userId: string; amount: number }[];
  date: Date;
  category: string;
}

export interface Expense {
  expenseId: string;
  amount: number;
  category: string;
  date: Date;
  paidBy: string;
  title: string;
  splitDetails: SplitDetail[];
}

export interface Settlement {
  userId: string;
  settlementAmount: number;
  userDetails?: TripUsers;
  settlements: SettlementActivity[];
}

export interface NewSettlement {
  tripId: string;
  payee: string;
  payer: string;
  amount: number;
}

export interface EditSettlement {
  settlementId: string;
  payee: string;
  payer: string;
  amount: number;
}

export interface SettlementActivity {
  settlementId: string;
  amount: number;
  payee: string;
  payer: string;
  payeeDetail?: TripUsers;
  payerDetail?: TripUsers;
}
