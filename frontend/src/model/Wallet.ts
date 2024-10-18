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
    lastSynced: string;
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
    active: ActiveDelegation;
    next: NextDelegation[];
}

export interface ActiveDelegation {
    status: DelegationStatus;
    target: string;
    voting: string;
}

export interface NextDelegation {
    status: DelegationStatus;
    target: string;
    voting: string;
    changes_at: EpochTime;
}

export interface EpochTime {
    epoch_number: number;
    epoch_start_time: string;
}

export enum DelegationStatus {
    NotDelegating = "not_delegating",
    Delegating = "delegating",
    VotingAndDelegating = "voting_and_delegating"
}

export interface Passphrase {
    last_updated_at: Date; 
}

export interface Tip {
    absolute_slot_number: number;
    epoch_number: number;
    height: UnitBalance;
    slot_number: number;
    time: string;
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