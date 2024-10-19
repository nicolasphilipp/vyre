import { Transaction, TransactionListDto } from "@/model/Transaction";
import { Accordion, AccordionItem, CalendarDate, Divider, Pagination, ScrollShadow, Select, SelectItem } from "@nextui-org/react";
import React, { useEffect, useState } from "react";
import TxListDetailEntry from "./TxListDetailEntry";
import TxListAccordionEntry from "./TxListAccordionEntry";
import useWalletStore from "@/model/WalletState";
import { Wallet } from "@/model/Wallet";
import { searchTxHistory } from "@/services/TxService";

interface ValueProps {
  minAmount: string;
  maxAmount: string;
  receiver: string;
  startDate: CalendarDate;
  endDate: CalendarDate;
}

const TxList: React.FC<ValueProps> = ({ minAmount, maxAmount, receiver, startDate, endDate }) => {
  const { wallets, selected } = useWalletStore();
  const [selectedWallet, setSelectedWallet] = useState({} as Wallet);
  const [transactions, setTransactions] = useState([] as Transaction[]);

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
    setSelectedKeys(new Set(["-1"]));
  }, [selectedWallet]);

  useEffect(() => {
    if(oldPage !== currentPage){
      setSelectedKeys(new Set(["-1"]));
      setOldPage(currentPage);
    }
    
    if(selectedWallet && selectedWallet.id) {
      searchTxHistory(selectedWallet.id, currentPage, parseInt(resultCount), minAmount, maxAmount, receiver, startDate, endDate)
        .then(res => {
          console.log(res);

          let listDto = res as TransactionListDto;
          setTotalPages(listDto.totalPages);
          setTransactions(listDto.transactions);
        }); 
    }
  }, [selectedWallet, currentPage, resultCount, minAmount, maxAmount, receiver, startDate, endDate]);

  useEffect(() => {
    if(!resultCount) {
      setResultCount("5");
    }
    setCurrentPage(1);
  }, [resultCount, minAmount, maxAmount, receiver, startDate, endDate]);

  useEffect(() => {
    setCurrentPage(1);

    for(let i = 0; i < wallets.length; i++) {
      if(wallets[i].id === selected) {
        setSelectedWallet(wallets[i]);
      }
    }
  }, [selected]);

  return (
    <div className="flex flex-col justify-between h-full">
      <div className="w-full" style={{height: "495px"}}>
        <ScrollShadow className="h-full" size={20}>
          <Accordion isCompact showDivider={false} selectedKeys={selectedKeys} onSelectionChange={setSelectedKeys}>
            {
              transactions && transactions.map((tx, i) => 
                <AccordionItem key={i} aria-label={"Transaction " + (i + 1)} title="" startContent={<TxListAccordionEntry transaction={tx} />}>
                  <TxListDetailEntry transaction={tx} />
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
  );
}

export default TxList;