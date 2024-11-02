import { Divider } from "@nextui-org/react";
import React, { useEffect, useState } from "react";
import { ResponsiveContainer, XAxis, YAxis, Tooltip, TooltipProps, Bar, ComposedChart } from "recharts";
import { formatNumber, numberToPercent } from "@/services/TextFormatService";
import { RewardData } from "@/model/Reward";
import { loveLaceToAda } from "@/Constants";
import { getStakeRewards } from "@/services/StakeService";
import { Wallet } from "@/model/Wallet";

interface ValueProps {
    wallet: Wallet;
}

interface DataPoint {
    delegated_pool: string;
    earned_epoch: string;
    amount: number;
    staked: number;
}

const StakeStatisticsChart: React.FC<ValueProps> = ({ wallet }) => {
    const [data, setData] = useState([] as DataPoint[]);
    const [totalRewards, setTotalRewards] = useState(0);
    const [lifetimeROS, setLifetimeROS] = useState(0);
    const [rewardData, setRewardData] = useState({} as RewardData);

    useEffect(() => {
        getStakeRewards(wallet.id)
          .then(res => {
            console.log(res);

            setRewardData(res);
          })
    }, [wallet]);

    useEffect(() => {
        let rewards = rewardData.rewards;
        let tempData: DataPoint[] = [];

        if(rewards) {
            let total = 0;
            let avg_ros = 0;

            for(let i = 0; i < rewards.length; i++) {
                let amount = parseFloat(rewards[i].amount_reward) / loveLaceToAda;
                let staked = parseFloat(rewards[i].amount_staked) / loveLaceToAda;

                tempData.push({ delegated_pool: rewards[i].delegated_pool, earned_epoch: rewards[i].earned_epoch, amount: amount, staked: staked });
                total += amount;
                avg_ros += (amount / staked);
            }
            avg_ros /= rewards.length;

            // 365/5 = 73 epochs in one year
            let ros = (Math.pow(1 + avg_ros / 73, 73) - 1) * 100;

            setData(tempData);
            setTotalRewards(total);
            setLifetimeROS(ros);
        }
    }, [rewardData]);

    const CustomTooltip: React.FC<TooltipProps<number, string>> = ({active, payload}) => {
        if (active && payload && payload.length > 0 && payload[0].payload) {
          return (
            <div className="chart-tooltip text-sm flex flex-col min-w-44">
                <div className="flex gap-4 items-center justify-between p-1">
                    <span className="text-white">Epoch {payload[0].payload.earned_epoch}</span>
                </div>
                <Divider />
                <div className="flex flex-col p-1">
                    <div className="flex justify-between">
                        <span>Earned Rewards</span>
                        <span className="text-white">₳ {formatNumber(payload[0].payload.amount, 2)}</span>
                    </div>
                </div>
            </div>
          );
        }
        return null;
    };

    const formatXAxisLabel = (label: string) => {
        return 'Epoch ' + label; 
    };

    const StatisticSection: React.FC<any> = ({lifetimeROS, totalRewards}) => {
        return (
            <div className="absolute -translate-y-10 right-4 flex flex-col text-right">
                <span className="text-sm text-white">~{numberToPercent(lifetimeROS, 2)} (Lifetime ROS)</span>
                <span className="text-sm text-white">₳ {formatNumber(totalRewards, 2)} (Total rewards)</span>
            </div>
        );
    };

    const Chart: React.FC<any> = ({ data }) => {
        return (
            <ResponsiveContainer width="100%" height={225}>
                <ComposedChart
                    data={data}
                    margin={{ top: 20, right: 40, left: -10, bottom: 30 }}
                >
                    <XAxis dataKey="earned_epoch" className="text-sm" tickFormatter={formatXAxisLabel} angle={45} tick={{ dy: 20 }} />
                    <YAxis className="text-sm" />
                    <Tooltip offset={8} content={<CustomTooltip />} />
                    <Bar dataKey="amount" fill="#17c964" />
                </ComposedChart>
            </ResponsiveContainer>
        );
    };

    return (
        <div>
            <StatisticSection lifetimeROS={lifetimeROS} totalRewards={totalRewards} />
            <Chart data={data} />
        </div>
    );
}

export default StakeStatisticsChart;