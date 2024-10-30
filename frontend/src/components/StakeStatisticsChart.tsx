import { Divider } from "@nextui-org/react";
import React, { useEffect, useState } from "react";
import { ResponsiveContainer, XAxis, YAxis, Tooltip, TooltipProps, Bar, ComposedChart } from "recharts";
import { formatNumber } from "@/services/TextFormatService";
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
}

const StakeStatisticsChart: React.FC<ValueProps> = ({ wallet }) => {
    const [data, setData] = useState([] as DataPoint[]);
    const [totalRewards, setTotalRewards] = useState(0);
    const [rewardData, setRewardData] = useState({} as RewardData);

    useEffect(() => {
        getStakeRewards(wallet.id)
          .then(res => {
            setRewardData(res);
          })
    }, [wallet]);

    useEffect(() => {
        let rewards = rewardData.rewards;
        let tempData: DataPoint[] = [];

        if(rewards) {
            let total = 0;
            for(let i = 0; i < rewards.length; i++) {
                let amount = parseFloat(rewards[i].lovelace) / loveLaceToAda;
                tempData.push({ delegated_pool: rewards[i].delegated_pool, earned_epoch: rewards[i].earned_epoch, amount: amount });
                total += amount;
            }

            setData(tempData);
            setTotalRewards(total);
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

    // TODO lifetime ROS (return on stake), breakdown per epoch, total staking rewards

    return (
        <div>
            <Chart data={data} />
        </div>
    );
}

export default StakeStatisticsChart;