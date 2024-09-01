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
    lastUpdated: Date; 
}

interface Tip {
    absoluteSlotNumber: number;
    epochNumber: number;
    height: UnitBalance;
    slotNumber: number;
    time: Date;
}

interface Assets {
    available: Asset[];
    total: Asset[];
}

interface Asset {
    assetName: string;
    quantitiy: number;
    policyId: string;
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