import { AdaData, AdaInfo, HistoricalAdaData } from "@/model/AdaData";
import { getCoinHistoricPrices } from "@/services/CoinDataService";
import { convertUnixToDate, formatNumber } from "@/services/TextFormatService";
import { Tabs, Tab, Chip, Divider } from "@nextui-org/react";
import React, { useEffect, useState } from "react";
import { ResponsiveContainer, AreaChart, XAxis, YAxis, Tooltip, Area, TooltipProps, Label } from "recharts";
import { ArrowIcon } from "./icons/ArrowIcon";
import { MinusIcon } from "./icons/MinusIcon";

interface ValueProps {
    adaPriceData: AdaData
}

interface DataPoint {
    date: string;
    price: number;
    marketcap: number;
    totalvolume: number;
}

const AdaPriceChart: React.FC<ValueProps> = ({ adaPriceData }) => {
    const [yearlyPrices, setYearlyPrices] = useState([] as DataPoint[]);
    const [monthlyPrices, setMonthlyPrices] = useState([] as DataPoint[]);
    const [currentPrices, setCurrentPrices] = useState([] as DataPoint[]);

    useEffect(() => {
        // TODO update periodically


        // query yearly for daily data
        getCoinHistoricPrices("cardano", "yearly", "eur")
          .then(res => {
            console.log("yearly: ", res);
            let historicData = res.data as HistoricalAdaData;

            let data: DataPoint[] = [];
            for(let i = 0; i < historicData.prices.length; i++) {
                let date = convertUnixToDate(historicData.prices[i][0] / 1000);
                let price = historicData.prices[i][1];
                let marketcap = historicData.market_caps[i][1];
                let totalvolume = historicData.total_volumes[i][1];

                data.push({ date: date, price: price, marketcap: marketcap, totalvolume: totalvolume });
            }
            setYearlyPrices(data);
        });

        // query monthly for hourly data
        getCoinHistoricPrices("cardano", "monthly", "eur")
          .then(res => {
            console.log("monthly: ", res);
            let historicData = res.data as HistoricalAdaData;
            
            let data: DataPoint[] = [];
            for(let i = 0; i < historicData.prices.length; i++) {
                let date = convertUnixToDate(historicData.prices[i][0] / 1000);
                let price = historicData.prices[i][1];
                let marketcap = historicData.market_caps[i][1];
                let totalvolume = historicData.total_volumes[i][1];

                data.push({ date: date, price: price, marketcap: marketcap, totalvolume: totalvolume });
            }
            setMonthlyPrices(data);
        });

        // query daily for current 5 min data
        getCoinHistoricPrices("cardano", "daily", "eur")
            .then(res => {
                console.log("daily: ", res);
                let historicData = res.data as HistoricalAdaData;
                
                let data: DataPoint[] = [];
                for(let i = 0; i < historicData.prices.length; i++) {
                    let date = convertUnixToDate(historicData.prices[i][0] / 1000);
                    let price = historicData.prices[i][1];
                    let marketcap = historicData.market_caps[i][1];
                    let totalvolume = historicData.total_volumes[i][1];

                    data.push({ date: date, price: price, marketcap: marketcap, totalvolume: totalvolume });
                }
                setCurrentPrices(data);
            });
    }, []);

    const CustomTooltip: React.FC<TooltipProps<number, string>> = ({active, payload}) => {
        if (active && payload && payload.length > 0 && payload[0].value && payload[0].payload) {
          return (
            <div className="chart-tooltip text-sm text-white flex flex-col">
                <div className="p-1">
                    <span>{formatDateTime(payload[0].payload.date)}</span>
                </div>
                <Divider />
                <div className="flex justify-between p-1">
                    <span>{formatNumber(payload[0].value, 5)} €</span>
                    <span>ADA</span>
                </div>
            </div>
          );
        }
        return null;
    };

    const formatDate = (tickItem: string) => {
        const date = new Date(tickItem);
        return date.toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'short',   
        }); 
    };

    const formatDateTime = (dateString: string): string => {
        const date = new Date(dateString);
        return date.toLocaleString('en-GB', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          hour12: true, 
        });
    };

    const formatTime = (dateString: string): string => {
        const date = new Date(dateString);
        return date.toLocaleTimeString('en-GB', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });
    };

    const formatXAxisLabel = () => {
        return ''; 
    };

    const Chart: React.FC<any> = ({data, period}) => {
        return (
            <ResponsiveContainer width="100%" height={360}>
                <AreaChart
                    data={data}
                    margin={{ top: 10, right: 20, left: 0, bottom: 5 }}
                >
                    <defs>
                        <linearGradient id="fadeGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#9353D3" stopOpacity={0.5} />
                            <stop offset="85%" stopColor="#9353D3" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <XAxis dataKey="date" className="text-sm" tickFormatter={formatXAxisLabel} minTickGap={40}>
                        {
                            data[data.length - 1] &&
                            <Label value={period === "day" ? formatTime(data[data.length - 1].date) : formatDate(data[data.length - 1].date)} offset={0} position="insideBottomRight" />
                        }
                        {
                            data[0] &&
                            <Label value={period === "day" ? formatTime(data[0].date) : formatDate(data[0].date)} offset={0} position="insideBottomLeft" />
                        }
                    </XAxis>
                    <YAxis className="text-sm" domain={['auto']} tickCount={10} />  
                    <Tooltip offset={8} content={<CustomTooltip />} />
                    <Area
                        type="monotone"
                        dataKey="price"
                        stroke="#9353D3"
                        fill="url(#fadeGradient)"
                    />
                </AreaChart>
            </ResponsiveContainer>
        );
    };

    // TODO adjust percent change when period changes
    const PriceSection: React.FC<any> = ({adaPriceData}) => {
        return (
            <div>
                { adaPriceData.eur &&
                    <div className="absolute top-4 right-6 flex flex-col items-end">
                        <div className="flex gap-2.5 items-center">
                            { adaPriceData.eur_24h_change < 0 &&
                                <Chip variant="flat" radius="sm" size="sm" style={{ border: "1px solid rgba(243, 18, 96, 0.5)", background: "rgba(243, 18, 96, 0.1)" }}>
                                    <span className="text-danger font-bold">{formatNumber(adaPriceData.eur_24h_change, 2)}%</span>
                                </Chip>
                            }
                            { adaPriceData.eur_24h_change > 0 &&
                                <Chip variant="flat" radius="sm" size="sm" style={{ border: "1px solid rgba(23, 201, 100, 0.5)", background: "rgba(23, 201, 100, 0.1)" }}>
                                    <span className="text-success font-bold">{formatNumber(adaPriceData.eur_24h_change, 2)}%</span>
                                </Chip>
                            }
                            { adaPriceData.eur_24h_change === 0 &&
                                <Chip variant="flat" radius="sm" size="sm" style={{ border: "1px solid rgba(63, 63, 70, 0.5)", background: "rgba(63, 63, 70, 0.3)" }}>
                                    <span className="font-bold">{formatNumber(adaPriceData.eur_24h_change, 2)}%</span>
                                </Chip>
                            }                                
                            <span className="text-xl text-white">{formatNumber(adaPriceData.eur, 5)} €</span>
                            <span className="pulsating-dot"></span>
                        </div>
                    </div>
                }
            </div>
        );
    };

    return (
        <div className="flex flex-col gap-4">
            <div className="flex">
                <Tabs key="chart-tabs" color="secondary" aria-label="Tabs colors" radius="md" placement="top" classNames={{base: "font-bold", wrapper: "w-full"}}>
                    <Tab key="1D" title="1D">
                        <div>
                            <PriceSection adaPriceData={adaPriceData} />
                            <Chart data={currentPrices} period={"day"} />
                        </div>
                    </Tab>
                    <Tab key="7D" title="7D">
                        <div>
                            <PriceSection adaPriceData={adaPriceData} />
                            <Chart data={monthlyPrices.slice(monthlyPrices.length - 7 * 24, monthlyPrices.length)} period={"week"} />
                        </div>
                    </Tab>
                    <Tab key="1M" title="1M">
                        <div>
                            <PriceSection adaPriceData={adaPriceData} />
                            <Chart data={monthlyPrices} period={"month"} />
                        </div>
                    </Tab>
                    <Tab key="1Y" title="1Y">
                        <div>
                            <PriceSection adaPriceData={adaPriceData} />
                            <Chart data={yearlyPrices} period={"year"} />
                        </div>
                    </Tab>
                </Tabs>
            </div>
            
        </div>
    );
}

export default AdaPriceChart;