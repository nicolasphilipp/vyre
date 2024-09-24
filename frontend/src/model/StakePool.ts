import { EpochTime, UnitBalance } from "./Wallet";

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