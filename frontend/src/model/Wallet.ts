export interface Wallet {
    id: string;
    name: string;
    passphrase: Passphrase;
    assets: Assets;
    balance: Balance;
    state: State;
    tip: Tip;
    delegation: Delegation;
    config: Configuration;
    keysApi: Api;
    stakePoolApi: Api;
    transactionsApi: Api;
    walletsApi: Api;
    coinSelectionApi: Api;
    addressesApi: Api;
    address_pool_gap: number;
    isSelected: boolean;
}

export interface Balance {
    available: UnitBalance;
    reward: UnitBalance;
    total: UnitBalance;
}

export interface UnitBalance {
    quantity: number;
    unit: string;
}

export interface Delegation {
    active: Status;
    next: string[];
}

export interface Status {
    status: string;
}

export interface Passphrase {
    last_updated_at: Date; 
}

export interface Tip {
    absolute_slot_number: number;
    epoch_number: number;
    height: UnitBalance;
    slot_number: number;
    time: Date;
}

export interface Assets {
    available: Asset[];
    total: Asset[];
}

export interface Asset {
    asset_name: string;
    quantity: number;
    policy_id: string;
}

export interface State {
    progress: UnitBalance;
    status: string;
}

export interface Api {
    basePath: string;
    configuration: Configuration;
}

export interface Configuration {
    basePath: string;
}