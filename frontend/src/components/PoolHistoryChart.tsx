import { Divider } from "@nextui-org/react";
import React, { useEffect, useState } from "react";
import { ResponsiveContainer, XAxis, YAxis, Tooltip, TooltipProps, Bar, ComposedChart } from "recharts";
import { formatNumber } from "@/services/TextFormatService";
import { StakePoolDataEpochStats } from "@/model/StakePool";

interface ValueProps {
    stats: StakePoolDataEpochStats[];
}

interface DataPoint {
    epoch: string;
    blocks: string;
    blocks_est: string;
    average_blocks: number;
}

const PoolHistoryChart: React.FC<ValueProps> = ({ stats }) => {
    const [data, setData] = useState([] as DataPoint[]);

    useEffect(() => {
        let sum = 0;
        for(let i = 0; i < stats.length; i++) {
            sum += parseFloat(stats[i].blocks);
        }
        let avg = sum / stats.length;

        let tempData: DataPoint[] = [];
        for(let i = stats.length - 1; i >= 0; i--) {
            tempData.push({ epoch: stats[i].epoch, blocks: stats[i].blocks, blocks_est: stats[i].blocks_est, average_blocks: avg });
        }
        setData(tempData);
    }, [stats]);

    const CustomTooltip: React.FC<TooltipProps<number, string>> = ({active, payload}) => {
        if (active && payload && payload.length > 0 && payload[0].payload) {
          return (
            <div className="chart-tooltip text-sm flex flex-col min-w-44">
                <div className="flex gap-4 items-center justify-between p-1">
                    <span className="text-white">Epoch {payload[0].payload.epoch}</span>
                </div>
                <Divider />
                <div className="flex flex-col p-1">
                    <div className="flex justify-between">
                        <div className="flex gap-1 items-center">
                            <div className="w-3 h-3 rounded-md" style={{ backgroundColor: "#17c964" }}></div>
                            <span>Blocks</span>
                        </div>
                        <span className="text-white">{payload[0].payload.blocks}</span>
                    </div>
                    <div className="flex justify-between">
                        <div className="flex gap-1 items-center">
                            <div className="w-3 h-3 rounded-md" style={{ backgroundColor: "#ffffff26" }}></div>
                            <span>Projected Blocks</span>
                        </div>
                        <span className="text-white">{formatNumber(parseFloat(payload[0].payload.blocks_est), 2)}</span>
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
            <ResponsiveContainer width="100%" height={300}>
                <ComposedChart
                    data={data}
                    margin={{ top: 20, right: 40, left: -10, bottom: 30 }}
                >
                    <XAxis dataKey="epoch" className="text-sm" tickFormatter={formatXAxisLabel} angle={45} tick={{ dy: 20 }} />
                    <YAxis className="text-sm" />
                    <Tooltip offset={8} content={<CustomTooltip />} />
                    <Bar dataKey="blocks" fill="#17c964" /> 
                    <Bar dataKey="blocks_est" fill="#ffffff26" /> 
                </ComposedChart>
            </ResponsiveContainer>
        );
    };

    return (
        <div>
            <Chart data={data} />
        </div>
    );
}

export default PoolHistoryChart;