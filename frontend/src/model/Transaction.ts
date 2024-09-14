import { Tip, UnitBalance } from "./Wallet"

export interface TxFees {
    estimated_min: UnitBalance;
    estimated_max: UnitBalance;
    minimum_coins: {};
    deposit: UnitBalance;
} 
          
export interface Transaction {
    id: string;
    amount: UnitBalance;
    fee: UnitBalance;
    direction: string;
    expires_at: Tip;
    pending_since: Tip;
    inputs: {};
    outputs: {};
    withdrawals: {};
    mint: Tokens;
    status: string;
}

export interface Tokens {
    tokens: {};
}