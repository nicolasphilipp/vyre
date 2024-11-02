export interface RewardData {
    stakeAddr: string;
    rewards: Reward[];
}

export interface Reward {
    delegated_pool: string;
    earned_epoch: string;
    amount_reward: string;
    amount_staked: string;
}