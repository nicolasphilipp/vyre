import { Transaction } from "@/model/Transaction";
import { Wallet } from "@/model/Wallet";
import { getTxHistory } from "@/services/TxService";
import { Tabs, Tab, Divider, Chip } from "@nextui-org/react";
import React, { useEffect, useState } from "react";
import { ResponsiveContainer, XAxis, YAxis, Tooltip, TooltipProps, Bar, Line, ComposedChart, Label } from "recharts";
import { formatDate, formatNumber } from "@/services/TextFormatService";
import { loveLaceToAda } from "@/Constants";

interface ValueProps {
    wallet: Wallet;
}

interface DataPoint {
    date: string;
    incoming: number;
    outgoing: number;
    changeIn: number;
    changeOut: number;
}

const TxTurnoverChart: React.FC<ValueProps> = ({ wallet }) => {
    const [tx, setTx] = useState([] as Transaction[]);
    const [monthData, setMonthData] = useState([] as DataPoint[]);
    const [yearData, setYearData] = useState([] as DataPoint[]);
    const [allTimeData, setAllTimeData] = useState([] as DataPoint[]);

    useEffect(() => {
        getTxHistory(wallet.id)
            .then(res => {
                let tx = res.transactions as Transaction[];
                setTx(tx);
                getMonthData(tx);
                getYearData(tx);
            });
    }, [wallet]);

    function getMonthData(tx: Transaction[]) {
        let txMap = new Map<string, number[]>();
        for(let day of getLast30Days()) {
            txMap.set(day, [0, 0]);
        }

        for(let i = 0; i < tx.length; i++) {
            if(tx[i].inserted_at) {
                let date = formatDate(tx[i].inserted_at.time);
                
                if(txMap.get(date) !== undefined) {
                    if(tx[i].direction === "incoming") {
                        txMap.set(date, [txMap.get(date)![0] + tx[i].amount.quantity / loveLaceToAda, txMap.get(date)![1]]);
                    } else if(tx[i].direction === "outgoing") {
                        txMap.set(date, [txMap.get(date)![0], txMap.get(date)![1] + tx[i].amount.quantity / loveLaceToAda]);
                    }
                }
            }
        }

        let data: DataPoint[] = [];
        for(let entry of txMap.entries()) {
            let change = 0;

            data.push({ date: entry[0], incoming: entry[1][0], outgoing: entry[1][1], changeIn: change, changeOut: change });
        }
        setMonthData(data);
    }

    function getYearData(tx: Transaction[]) {
        let txMap = new Map<string, number[]>();
        let yearToday = new Date().getFullYear().toString();
        for(let month of ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']) {
            txMap.set(month + ' ' + yearToday, [0, 0]);
        }

        for(let i = 0; i < tx.length; i++) {
            if(tx[i].inserted_at) {
                let date = new Date(tx[i].inserted_at.time);
                let key = date.toLocaleString('en-US', { month: "long" }) + ' ' + date.getFullYear().toString();

                if(txMap.get(key) !== undefined) {
                    if(tx[i].direction === "incoming") {
                        txMap.set(key, [txMap.get(key)![0] + tx[i].amount.quantity / loveLaceToAda, txMap.get(key)![1]]);
                    } else if(tx[i].direction === "outgoing") {
                        txMap.set(key, [txMap.get(key)![0], txMap.get(key)![1] + tx[i].amount.quantity / loveLaceToAda]);
                    }
                }
            }
        }

        let data: DataPoint[] = [];
        for(let entry of txMap.entries()) {
            let change = 0;
            data.push({ date: entry[0], incoming: entry[1][0], outgoing: entry[1][1], changeIn: change, changeOut: change  });
        }
        setYearData(data);
    }

    const getLast30Days = (): string[] => {
        const today = new Date();
        const daysArray: string[] = [];
      
        for (let i = 30; i >= 0; i--) {
          const date = new Date();
          date.setDate(today.getDate() - i);
          daysArray.push(formatDate(date.toString()));
        }
        return daysArray;
    };

    const CustomTooltip: React.FC<TooltipProps<number, string>> = ({active, payload}) => {
        if (active && payload && payload.length > 0 && payload[0].payload) {
          return (
            <div className="chart-tooltip text-sm flex flex-col min-w-40">
                <div className="flex gap-4 items-center justify-between p-1">
                    <span className="text-white">{payload[0].payload.date}</span>
                </div>
                <Divider />
                <div className="flex flex-col p-1">
                    <div className="flex justify-between">
                        <span>Incoming</span>
                        <span className="text-white">₳ {formatNumber(payload[0].payload.incoming, 2)}</span>
                    </div>
                    <div className="flex justify-between">
                        <span>Outgoing</span>
                        <span className="text-white">₳ {formatNumber(payload[0].payload.outgoing, 2)}</span>
                    </div>
                </div>
                <Divider />
                <div className="flex flex-col p-1">
                    <div className="flex justify-between">
                        <span></span>
                        {
                            (payload[0].payload.incoming - payload[0].payload.outgoing) > 0 &&
                            <span className="text-success">₳ +{formatNumber(payload[0].payload.incoming - payload[0].payload.outgoing, 2)}</span>
                        }
                        {
                            (payload[0].payload.incoming - payload[0].payload.outgoing) < 0 &&
                            <span className="text-danger">₳ {formatNumber(payload[0].payload.incoming - payload[0].payload.outgoing, 2)}</span>
                        }
                        {
                            (payload[0].payload.incoming - payload[0].payload.outgoing) === 0 &&
                            <span className="text-white">₳ {formatNumber(payload[0].payload.incoming - payload[0].payload.outgoing, 2)}</span>
                        }
                    </div>
                </div>
            </div>
          );
        }
        return null;
    };

    const formatXAxisLabel = () => {
        return ''; 
    };

    const Chart: React.FC<any> = ({ data }) => {
        return (
            <ResponsiveContainer width="100%" height={200}>
                <ComposedChart
                    data={data}
                >
                    <XAxis dataKey="date" className="text-sm" tickFormatter={formatXAxisLabel}>
                        <Label value={data[data.length - 1] && data[data.length - 1].date} offset={0} position="insideBottomRight" />
                        <Label value={data[0] && data[0].date} offset={0} position="insideBottomLeft" />
                    </XAxis>
                    <YAxis className="text-sm" />
                    <Tooltip offset={8} content={<CustomTooltip />} />
                    <Bar dataKey="incoming" fill="#17c964" /> 
                    <Bar dataKey="outgoing" fill="#f31260" /> 
                </ComposedChart>
            </ResponsiveContainer>
        );
    };

    return (
        <div className="mt-2">
            <Tabs key="chart-tabs" color="secondary" aria-label="Tabs colors" radius="md" placement="top" classNames={{base: "font-bold", wrapper: "w-full"}}>
                <Tab key="Month" title="Month">
                    <div>
                        <Chart data={monthData} />
                    </div>
                </Tab>
                <Tab key="Year" title="Year">
                    <div>
                        <Chart data={yearData} />
                    </div>
                </Tab>
            </Tabs>
        </div>
    );
}

export default TxTurnoverChart;