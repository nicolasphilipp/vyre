import { AdaData, AdaInfo, HistoricalAdaData } from "@/model/AdaData";
import { getCoinHistoricPrices } from "@/services/CoinDataService";
import { convertUnixToDate, formatNumber } from "@/services/TextFormatService";
import { Tabs, Tab, Image } from "@nextui-org/react";
import React, { useEffect, useState } from "react";
import { ResponsiveContainer, AreaChart, CartesianGrid, XAxis, YAxis, Tooltip, Area, TooltipProps } from "recharts";

interface ValueProps {
    adaPriceData: AdaData
    adaInfo: AdaInfo
}

interface DataPoint {
    date: string;
    price: number;
    marketcap: number;
    totalvolume: number;
}

const AdaPriceChart: React.FC<ValueProps> = ({ adaPriceData, adaInfo }) => {
    const [prices, setPrices] = useState([] as DataPoint[]);
    const [monthlyPrices, setMonthlyPrices] = useState([] as DataPoint[]);
    const [currentPrices, setCurrentPrices] = useState([] as DataPoint[]);

    useEffect(() => {
        // TODO update periodically
        const currentTimestamp = Math.floor(Date.now() / 1000);
        const currentDate = new Date();

        const lastYearDate = new Date();
        lastYearDate.setFullYear(currentDate.getFullYear() - 1);
        const lastYearTimestamp = Math.floor(lastYearDate.getTime() / 1000);

        // query yearly for daily data
        getCoinHistoricPrices("cardano", lastYearTimestamp, currentTimestamp)
          .then(res => {
            console.log(res);
            
            let historicData = res.data as HistoricalAdaData;
            let data: DataPoint[] = [];
            for(let i = 0; i < historicData.prices.length; i++) {
                let date = convertUnixToDate(historicData.prices[i][0] / 1000);
                let price = historicData.prices[i][1];
                let marketcap = historicData.market_caps[i][1];
                let totalvolume = historicData.total_volumes[i][1];

                data.push({ date: date, price: price, marketcap: marketcap, totalvolume: totalvolume });
            }
            setPrices(data);
        });

        const lastMonthDate = new Date();
        lastMonthDate.setMonth(currentDate.getMonth() - 1);
        const lastMonthTimestamp = Math.floor(lastMonthDate.getTime() / 1000);

        // query monthly for hourly data
        getCoinHistoricPrices("cardano", lastMonthTimestamp, currentTimestamp)
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

        const lastDayDate = new Date();
        lastDayDate.setDate(currentDate.getDate() - 1);
        const lastDayTimestamp = Math.floor(lastDayDate.getTime() / 1000);

        // query daily for current 5 min data
        getCoinHistoricPrices("cardano", lastDayTimestamp, currentTimestamp)
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
            <div className="tooltip-container p-1 text-white flex flex-col">
              <span>{formatDateTime(payload[0].payload.date)}</span>
              <span>{formatNumber(payload[0].value, 5)} €</span>
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
          second: '2-digit',
          hour12: true, 
        });
      };

    const Chart: React.FC<any> = ({data}) => {
        return (
            <ResponsiveContainer width="100%" height={365}>
                <AreaChart
                    data={data}
                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                    <defs>
                        <linearGradient id="fadeGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#9353D3" stopOpacity={0.5} />
                            <stop offset="85%" stopColor="#9353D3" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <XAxis dataKey="date" tickFormatter={formatDate} />
                    <YAxis domain={['auto', 0.35]} tickCount={10} />  
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

    const PriceSection: React.FC<any> = ({adaPriceData, adaInfo}) => {
        return (
            <div>
                { adaPriceData.eur && adaInfo.symbol &&
                    <div className="absolute top-4 right-6 flex flex-col items-end">
                        <div className="flex gap-2 items-center">
                            <span className="text-xl text-white">{adaInfo.symbol.toUpperCase()}</span>
                            <span className="text-xl text-white">{formatNumber(adaPriceData.eur, 5)} €</span>
                        </div>
                        { adaPriceData.eur_24h_change < 0 &&
                            <span className="text-danger">{formatNumber(adaPriceData.eur_24h_change, 2)}%</span>
                        }
                        { adaPriceData.eur_24h_change > 0 &&
                            <span className="text-success">{formatNumber(adaPriceData.eur_24h_change, 2)}%</span>
                        }
                        { adaPriceData.eur_24h_change === 0 &&
                            <span>{formatNumber(adaPriceData.eur_24h_change, 2)}%</span>
                        }
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
                            <PriceSection adaPriceData={adaPriceData} adaInfo={adaInfo} />
                            <Chart data={currentPrices} />
                        </div>
                    </Tab>
                    <Tab key="7D" title="7D">
                        <div>
                            <PriceSection adaPriceData={adaPriceData} adaInfo={adaInfo} />
                            <Chart data={monthlyPrices.slice(monthlyPrices.length - 7 * 24, monthlyPrices.length)} />
                        </div>
                    </Tab>
                    <Tab key="1M" title="1M">
                        <div>
                            <PriceSection adaPriceData={adaPriceData} adaInfo={adaInfo} />
                            <Chart data={monthlyPrices} />
                        </div>
                    </Tab>
                    <Tab key="1Y" title="1Y">
                        <div>
                            <PriceSection adaPriceData={adaPriceData} adaInfo={adaInfo} />
                            <Chart data={prices} />
                        </div>
                    </Tab>
                </Tabs>
            </div>
            
        </div>
    );
}

export default AdaPriceChart;