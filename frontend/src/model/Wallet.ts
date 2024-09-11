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

interface Balance {
    available: UnitBalance;
    reward: UnitBalance;
    total: UnitBalance;
}

interface UnitBalance {
    quantity: number;
    unit: string;
}

interface Delegation {
    active: Status;
    next: string[];
}

interface Status {
    status: string;
}

interface Passphrase {
    last_updated_at: Date; 
}

interface Tip {
    absolute_slot_number: number;
    epoch_number: number;
    height: UnitBalance;
    slot_number: number;
    time: Date;
}

interface Assets {
    available: Asset[];
    total: Asset[];
}

interface Asset {
    asset_name: string;
    quantity: number;
    policy_id: string;
}

interface State {
    progress: UnitBalance;
    status: string;
}

interface Api {
    basePath: string;
    configuration: Configuration;
}

interface Configuration {
    basePath: string;
}