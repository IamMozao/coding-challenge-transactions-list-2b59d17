declare global {
  interface Window {
    web3: any;
  }
}

export interface Transaction {
  gasLimit: string;
  gasPrice: string;
  to: string;
  from: string;
  value: string;
  data?: string;
  chainId: string;
  hash: string;
}

export interface TransactionsData {
  getAllTransactions: Transaction[];
}

export interface SingleTransactionData {
  getTransaction: Transaction;
}

export type Action<P> = {
  type: Actions;
  payload: P;
};

export enum Actions {
  SendTransaction = "SEND_TRANSACTION",
}

export enum TransactionFields {
  "sender" = "sender",
  "recipient"  = "recipient",
  "amount" = "amount"
}

export interface InputProps {
    id: TransactionFields;
    value: string;
    placeholder?: string;
    disabled?: boolean;
}

export interface TransactionData {
  sender: string;
  recipient: string;
  amount: string;
}