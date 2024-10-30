export interface RewardData {
    stakeAddr: string;
    rewards: Reward[];
}

export interface Reward {
    delegated_pool: string;
    earned_epoch: string;
    lovelace: string;
}