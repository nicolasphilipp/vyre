import { EpochTime, UnitBalance } from "./Wallet";

export interface StakePoolListDto {
    totalResults: number;
    totalPages: number;
    currentPage: number;
    pools: StakePoolData[];
}

export interface StakePool {
    id: string;
    metrics: PoolMetrics;
    cost: UnitBalance;
    margin: UnitBalance;
    pledge: UnitBalance;
    metadata?: {};
    retirement: EpochTime;
    flags: string[];
}

export interface PoolMetrics {
    non_myopic_member_rewards: UnitBalance;
    relative_stake: UnitBalance;
    saturation: number;
    produced_blocks: UnitBalance;
}

export interface StakePoolData {
    blocks_epoch: string;
    blocks_est_epoch: string;
    blocks_lifetime: number;
    delegators: string;
    handles: StakePoolDataHandles;
    img: string;
    luck_lifetime: string;
    name: string;
    pledge: string;
    pool_id: string;
    pool_id_hash: string;
    position: string;
    roa_lifetime: string;
    roa_short: string;
    saturation: number;
    stake: string;
    stake_active: string;
    stats: StakePoolDataEpochStats[];
    tax_fix: string;
    tax_ratio: string;
    updated: string;
    url: string;
}

export interface StakePoolDataHandles {
    homepage: string;
    discord_handle: string;
    facebook_handle: string;
    github_handle: string;
    telegram_handle: string;
    twitch_handle: string;
    twitter_handle: string;
    youtube_handle: string;
}

export interface StakePoolDataEpochStats {
    active_stake: string;
    blocks: string;
    blocks_est: string;
    delegators: string;
    epoch: string;
    epoch_stake: string;
    luck: string;
    return_member: string;
    reward_member: string;
}
