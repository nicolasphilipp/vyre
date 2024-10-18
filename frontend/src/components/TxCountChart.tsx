import { Transaction } from "@/model/Transaction";
import { Wallet } from "@/model/Wallet";
import { getTxHistory } from "@/services/TxService";
import { Tabs, Tab, Divider, Chip } from "@nextui-org/react";
import React, { useEffect, useState } from "react";
import { ResponsiveContainer, XAxis, YAxis, Tooltip, TooltipProps, Bar, Line, ComposedChart, Label } from "recharts";
import { ArrowIcon } from "./icons/ArrowIcon";
import { formatDate, formatNumber } from "@/services/TextFormatService";

interface ValueProps {
    wallet: Wallet;
}

interface DataPoint {
    date: string;
    transactions: number;
    totalTransactions: number;
    change: number;
}

const TxCountChart: React.FC<ValueProps> = ({ wallet }) => {
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
        let txMap = new Map<string, number>();
        for(let day of getLast30Days()) {
            txMap.set(day, 0);
        }

        for(let i = 0; i < tx.length; i++) {
            if(tx[i].inserted_at) {
                let date = formatDate(tx[i].inserted_at.time);

                if(txMap.get(date) !== undefined) {
                    txMap.set(date, txMap.get(date)! + 1);
                }
            }
        }

        const date = new Date();
        date.setDate(new Date().getDate() - 30);

        let total = countTxUntil(tx, date);
        let data: DataPoint[] = [];
        for(let entry of txMap.entries()) {
            let change = total === 0 ? (entry[1] > 0 ? 1 : 0) : entry[1] / total;
            total += entry[1];
            data.push({ date: entry[0], transactions: entry[1], totalTransactions: total, change: change });
        }
        setMonthData(data);
    }

    function getYearData(tx: Transaction[]) {
        let txMap = new Map<string, number>();
        let yearToday = new Date().getFullYear().toString();
        for(let month of ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']) {
            txMap.set(month + ' ' + yearToday, 0);
        }

        for(let i = 0; i < tx.length; i++) {
            if(tx[i].inserted_at) {
                let date = new Date(tx[i].inserted_at.time);
                let key = date.toLocaleString('en-US', { month: "long" }) + ' ' + date.getFullYear().toString();
    
                if(txMap.get(key) !== undefined) {
                    txMap.set(key, txMap.get(key)! + 1);
                }
            }
        }

        let total = countTxUntil(tx, new Date(new Date().getFullYear(), 0, 1));
        let data: DataPoint[] = [];
        for(let entry of txMap.entries()) {
            let change = total === 0 ? (entry[1] > 0 ? 1 : 0) : entry[1] / total;
            total += entry[1];
            data.push({ date: entry[0], transactions: entry[1], totalTransactions: total, change: change });
        }
        setYearData(data);
    }

    function countTxUntil(tx: Transaction[], date: Date): number {
        let count = 0;
        for(let t of tx) {
            if(t.inserted_at && new Date(t.inserted_at.time) < date) {
                count++;
            }
        }
        return count;
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

    const getAllDaysOfCurrentMonth = (): string[] => {
        const today = new Date();
        const year = today.getFullYear();
        const month = today.getMonth(); 
      
        const daysInMonth = new Date(year, month + 1, 0).getDate();
      
        const daysArray = Array.from({ length: daysInMonth }, (_, i) => {
          const day = String(i + 1).padStart(2, '0');
          const formattedMonth = String(month + 1).padStart(2, '0'); 
          return `${day}-${formattedMonth}-${year}`;
        });
        return daysArray;
    };
      
    const CustomTooltip: React.FC<TooltipProps<number, string>> = ({active, payload}) => {
        if (active && payload && payload.length > 0 && payload[0].payload) {
          return (
            <div className="chart-tooltip text-sm flex flex-col min-w-40">
                <div className="flex gap-4 items-center justify-between p-1">
                    <span className="text-white">{payload[0].payload.date}</span>
                    <div className="p-0.5">
                        {
                            payload[0].payload.change > 0 && 
                            <Chip variant="flat" radius="sm" size="sm" style={{ border: "1px solid rgba(23, 201, 100, 0.5)", background: "rgba(23, 201, 100, 0.1)" }}>
                                <span className="text-success font-bold">+{formatNumber(payload[0].payload.change * 100, 2)}%</span>
                            </Chip>
                        } 
                        {
                            payload[0].payload.change <= 0 &&
                            <Chip variant="flat" radius="sm" size="sm" style={{ border: "1px solid rgba(63, 63, 70, 0.5)", background: "rgba(63, 63, 70, 0.3)" }}>
                                <span className="font-bold">{formatNumber(payload[0].payload.change * 100, 2)}%</span>
                            </Chip>
                        }
                    </div>
                </div>
                <Divider />
                <div className="flex flex-col p-1">
                    <div className="flex justify-between">
                        <span>New Transactions</span>
                        <span className="text-white">{payload[0].value}</span>
                    </div>
                    <div className="flex justify-between">
                        <span>Total Transactions</span>
                        <span className="text-white">{payload[0].payload.totalTransactions}</span>
                    </div>
                </div>
            </div>
          );
        }
        return null;
    };

    function getTxCount(data: DataPoint[]): number {
        let txCount = 0;
        for(let point of data){
            txCount += point.transactions;
        }
        return txCount;
    }

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
                    <Bar dataKey="transactions" fill="#ffffff26" /> 
                    <Line type="basis" dot={false} dataKey="totalTransactions" stroke="#9353D3" strokeWidth={2} />
                </ComposedChart>
            </ResponsiveContainer>
        );
    };

    const CountSection: React.FC<any> = ({txAllTime, txCount, period}) => {
        return (
            <div className="absolute -translate-y-14 right-6 flex flex-col">
                <span className="text-md text-white">{txAllTime} {txAllTime === 1 ? "Transaction" : "Transactions"} (all time)</span>
                <span className="text-sm text-white">{txCount} {txCount === 1 ? "Transaction" : "Transactions"} (last {period})</span>
            </div>
        );
    };

    // TODO add date picker to select timeframe

    return (
        <div className="mt-2">
            <Tabs key="chart-tabs" color="secondary" aria-label="Tabs colors" radius="md" placement="top" classNames={{base: "font-bold", wrapper: "w-full"}}>
                <Tab key="Month" title="Month">
                    <div>
                        <CountSection txAllTime={tx.length} txCount={getTxCount(monthData)} period={"month"} />
                        <Chart data={monthData} />
                    </div>
                </Tab>
                <Tab key="Year" title="Year">
                    <div>
                        <CountSection txAllTime={tx.length} txCount={getTxCount(yearData)} period={"year"} />
                        <Chart data={yearData} />
                    </div>
                </Tab>
            </Tabs>
        </div>
    );
}

export default TxCountChart;