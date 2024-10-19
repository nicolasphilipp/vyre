import { DatePicker, Input } from "@nextui-org/react";
import { FilterIcon } from "./icons/FilterIcon";
import TxList from "./TxList";
import { TransactionIcon } from "./icons/TransactionIcon";
import { useState } from "react";
import {parseDate, today } from "@internationalized/date";
  
export default function TxSection() {
    const [minAmount, setMinAmount] = useState("");
    const [maxAmount, setMaxAmount] = useState("");
    const [receiver, setReceiver] = useState("");
    const [startDate, setStartDate] = useState(parseDate("2019-01-01"));
    const [endDate, setEndDate] = useState(today("UTC").add({days: 0})); 

    return (    
        <div className="grid h-full w-full gap-4 grid-cols-1 grid-rows-5 rounded-lg"> 
            <div className="col-span-1 row-span-1 p-4 overview-card flex-col break-words justify-between">
                <div className="flex gap-0.5 items-center">
                    <span className="section-headline">Search Filters</span>
                    <FilterIcon className="text-white" width={20} height={20} />
                </div>

                <div className="flex gap-4">
                    <div className="flex w-full gap-4">
                        <Input type="number" isClearable variant="bordered" label="Min Amount" placeholder="0.00" className="min-w-28" value={minAmount} onValueChange={setMinAmount}
                            startContent={
                                <div className="pointer-events-none flex items-center">
                                    <span className="text-sm">₳</span>
                                </div>
                            }
                        />
                        <Input type="number" isClearable variant="bordered" label="Max Amount" placeholder="0.00" className="min-w-28" value={maxAmount} onValueChange={setMaxAmount}
                            startContent={
                                <div className="pointer-events-none flex items-center">
                                    <span className="text-sm">₳</span>
                                </div>
                            }
                        />
                    </div>
                    <Input type="text" isClearable variant="bordered" label="Receiver Address" placeholder="addr_xxxxx..." value={receiver} onValueChange={setReceiver} /> 
                    <DatePicker label="Start Date" variant="bordered" calendarProps={{ color: "secondary" }} value={startDate} onChange={setStartDate} classNames={{ popoverContent: "dark" }} />
                    <DatePicker label="End Date" variant="bordered" calendarProps={{ color: "secondary" }} value={endDate} onChange={setEndDate} classNames={{ popoverContent: "dark" }} />
                </div>
            </div>

            <div className="col-span-1 row-span-4 p-4 overview-card flex-col break-words">
                <div className="flex gap-1 items-center">
                    <span className="section-headline">Transactions</span>
                    <TransactionIcon className="text-white" width={20} height={20} />
                </div>

                <TxList minAmount={minAmount} maxAmount={maxAmount} receiver={receiver} startDate={startDate} endDate={endDate} />
            </div>
        </div>
    );
}