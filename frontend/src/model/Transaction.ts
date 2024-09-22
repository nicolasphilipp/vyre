import { Asset, Tip, UnitBalance } from "./Wallet"

export interface TransactionListDto {
    totalResults: number;
    totalPages: number;
    currentPage: number;
    transactions: Transaction[];
}

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
    depth: UnitBalance;
    inserted_at: Tip; 
    direction: string;
    expires_at: Tip;
    pending_since: Tip;
    inputs: Input[];
    outputs: Output[];
    withdrawals: [];
    mint: MintTokens;
    status: string;
    metadata: {};
}

export interface MintTokens {
    tokens: Token[];
    wallet_policy_key_hash: string;
    wallet_policy_key_index: string;
}

interface Token {
    assets: TokenAsset[];
    policy_id: string;
    policy_script: PolicyScript;
}

interface PolicyScript {
    script: string;
    script_type: string;
}

interface TokenAsset {
    asset_name: string;
    fingerprint: string;
    quantity: number;
}

interface Input {
    address: string;
    amount: UnitBalance;
    assets: Asset[];
    id: string;
    index: number;
}

interface Output {
    address: string;
    amount: UnitBalance;
    assets: Asset[];
}