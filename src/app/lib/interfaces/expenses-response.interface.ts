export interface ExpensesResponseInterface {
  total: number;
  equalShare: number;
  payouts: Payout[]
}

interface Payout {
  owes: string;
  owed: string;
  amount: number;
}
