'use client';

import { FilterIcon } from "@/components/icons/FilterIcon";
import { LightningIcon } from "@/components/icons/LightningIcon";
import { SwapIcon } from "@/components/icons/SwapIcon";
import { TransactionIcon } from "@/components/icons/TransactionIcon";
import SendAdaModal from "@/components/SendAdaModal";
import TransactionListAccordionEntry from "@/components/TransactionListAccordionEntry";
import TransactionListDetailEntry from "@/components/TransactionListDetailEntry";
import { Transaction, TransactionListDto } from "@/model/Transaction";
import { Wallet } from "@/model/Wallet";
import useWalletStore from "@/model/WalletState";
import { syncWallet } from "@/services/WalletService";
import { Accordion, AccordionItem, Button, DatePicker, Divider, Input, Pagination, ScrollShadow, Select, SelectItem } from "@nextui-org/react";
import { useEffect, useState } from "react";
import {parseDate, getLocalTimeZone, CalendarDate, today } from "@internationalized/date";
import {useDateFormatter} from "@react-aria/i18n";
import { getTxHistory, searchTxHistory } from "@/services/TxService";
import { InsightsIcon } from "@/components/icons/InsightsIcon";

export default function Home() {
  const { wallets, add, remove, update, selected, setSelected } = useWalletStore();
  const [selectedWallet, setSelectedWallet] = useState({} as Wallet);
  const [transactions, setTransactions] = useState([] as Transaction[]);

  const [receiver, setReceiver] = useState("");
  const [startDate, setStartDate] = useState(parseDate("2019-01-01"));
  const [endDate, setEndDate] = useState(today("UTC").add({days: 1}));
  const [currentPage, setCurrentPage] = useState(1);
  const [oldPage, setOldPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [selectedKeys, setSelectedKeys] = useState(new Set(["-1"]));
  const [resultCount, setResultCount] = useState("10");
  const resultCounts = ["10", "15", "20"];
  
  const handleResultCountChange = (e: { target: { value: React.SetStateAction<string>; }; }) => {
    setResultCount(e.target.value as string);
  };

  useEffect(() => {
    setCurrentPage(1);

    for(let i = 0; i < wallets.length; i++) {
      if(wallets[i].id === selected) {
        setSelectedWallet(wallets[i]);
      }
    }
  }, [selected]);

  useEffect(() => {
    if(oldPage !== currentPage){
      setSelectedKeys(new Set(["-1"]));
      setOldPage(currentPage);
    }
    
    if(selectedWallet && selectedWallet.id) {
      searchTxHistory(selectedWallet.id, currentPage, parseInt(resultCount), receiver, startDate, endDate)
        .then(res => {
            console.log(res);

            let listDto = res as TransactionListDto;
            setTotalPages(listDto.totalPages);
            setTransactions(listDto.transactions);
          }); 
    }
  }, [selectedWallet, currentPage, resultCount, receiver, startDate, endDate]);

  useEffect(() => {
    if(!resultCount) {
      setResultCount("5");
    }
    setCurrentPage(1);
  }, [resultCount, receiver, startDate, endDate]);

  // TODO pass function to sendAdaModal -> that executes searchTxHistory

  return (
    <>
      <div className="wallet-overview-content">
        <div className="grid h-full w-full gap-4 grid-cols-5 grid-rows-5 rounded-lg"> 
          <div className="col-span-3 row-span-1 p-4 overview-card flex-col break-words justify-between">
            <div className="flex gap-0.5 items-center">
              <span className="section-headline">Search Filters</span>
              <FilterIcon className="text-white" width={16} height={16} />
            </div>

            <div className="flex gap-4">
              <Input type="text" isClearable variant="bordered" label="Receiver Address" placeholder="addr_xxxxx..." value={receiver} onValueChange={setReceiver} />
              <DatePicker label="Start Date" variant="bordered" calendarProps={{ color: "secondary" }} value={startDate} onChange={setStartDate} classNames={{ popoverContent: "dark" }} />
              <DatePicker label="End Date" variant="bordered" calendarProps={{ color: "secondary" }} value={endDate} onChange={setEndDate} classNames={{ popoverContent: "dark" }} />
            </div>
          </div>

          <div className="col-span-2 row-span-3 p-4 overview-card flex-col break-words">
            <div className="flex gap-1 items-center">
              <span className="section-headline">Insights</span>
              <InsightsIcon className="text-white" width={18} height={18} />
            </div>
          </div>

          <div className="col-span-3 row-span-4 p-4 overview-card flex-col break-words">
            <div className="flex gap-1 items-center">
              <span className="section-headline">Transactions</span>
              <TransactionIcon className="text-white" width={16} height={16} />
            </div>

            <div className="flex flex-col justify-between h-full">
              <div className="w-full" style={{height: "495px"}}>
                <ScrollShadow className="h-full" size={20}>
                  <Accordion isCompact showDivider={false} selectedKeys={selectedKeys} onSelectionChange={setSelectedKeys}>
                    {
                      transactions && transactions.map((tx, i) => 
                        <AccordionItem key={i} aria-label={"Transaction " + (i + 1)} title="" startContent={<TransactionListAccordionEntry transaction={tx} />}>
                          <TransactionListDetailEntry transaction={tx} />
                          <Divider className="mt-3"/>
                        </AccordionItem>
                      )
                    }
                  </Accordion>
                </ScrollShadow>
              </div>
              
              <div className="flex justify-center">
                <Pagination 
                  total={totalPages} 
                  variant="faded" 
                  color="secondary" 
                  showControls 
                  page={currentPage}
                  onChange={setCurrentPage}
                />
              </div>
              <Select
                aria-label="Select Results"
                size="md"
                color="secondary"
                variant="bordered"
                selectedKeys={[resultCount]}
                onChange={handleResultCountChange}
                classNames={{
                  base: "max-w-20 absolute bottom-4 right-4",
                  popoverContent: "pop-content",
                  value: "text-white"
                }}
              >
                {
                  resultCounts.map((count, index) => (
                    <SelectItem color="secondary" key={count} textValue={count}>
                      <div>
                        {count}
                      </div>
                    </SelectItem>
                  ))
                }
              </Select>
            </div>
          </div>

          <div className="col-span-1 row-span-2 p-4 overview-card flex-col break-words">
            <div className="flex gap-0.5 items-center">
              <span className="section-headline">Actions</span>
              <LightningIcon className="text-white" width={16} height={16} />
            </div>

            <div className="flex flex-col gap-4 mt-3">
              <SendAdaModal wallet={selectedWallet} />
              <Button size="md" color="secondary" variant="ghost" aria-label='Swap ADA'>
                <span className="flex gap-0.5 items-center">
                  Swap ADA
                  <SwapIcon width={16} height={16} />
                </span>
              </Button>
            </div>
          </div>

          <div className="col-span-1 row-span-2 p-4 overview-card flex-col break-words">
            <span>Placeholder</span>
          </div>
        </div>
      </div>
    </>
  );
}