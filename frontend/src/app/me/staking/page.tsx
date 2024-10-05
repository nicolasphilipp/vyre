'use client';

import { ChartLineIcon } from "@/components/icons/ChartLineIcon";
import { FilterIcon } from "@/components/icons/FilterIcon";
import { GlobalIcon } from "@/components/icons/GlobalIcon";
import { SearchIcon } from "@/components/icons/SearchIcon";
import { StakingIcon } from "@/components/icons/StakingIcon";
import StakePoolCard from "@/components/StakePoolCard";
import StakePoolList from "@/components/StakePoolList";
import { StakePoolData, StakePoolListDto } from "@/model/StakePool";
import { DelegationStatus, Wallet } from "@/model/Wallet";
import useWalletStore from "@/model/WalletState";
import { getAllPools, queryPool } from "@/services/StakeService";
import { Input, Pagination, ScrollShadow } from "@nextui-org/react";
import React, { useEffect, useState } from "react";

export default function Home() {
  const { wallets, add, remove, update, selected, setSelected } = useWalletStore();
  const [selectedWallet, setSelectedWallet] = useState({} as Wallet);
  const [poolData, setPoolData] = useState({} as StakePoolData);
  const [search, setSearch] = useState("");

  const [stakePools, setStakePools] = useState([] as StakePoolData[]);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    for(let i = 0; i < wallets.length; i++) {
      if(wallets[i].id === selected) {
        setSelectedWallet(wallets[i]);

        if(wallets[i].delegation.active.target) {
          // TODO wallets[i].delegation.active.target
          queryPool('pool1qqqqqdk4zhsjuxxd8jyvwncf5eucfskz0xjjj64fdmlgj735lr9')
            .then(res => {
              setPoolData(res.pool);
            });
        } else {
          setPoolData({} as StakePoolData);
        }
      }
    }
  }, [selected]);

  useEffect(() => {
    getAllPools(currentPage, 8, search)
      .then(res => {
        console.log(res);
        
        let listDto = res as StakePoolListDto;
        setTotalPages(listDto.totalPages);
        setStakePools(listDto.pools);
      });
  }, [currentPage, search]);

  return (
    <>
      <div className="wallet-overview-content">
        <div className="grid h-full w-full gap-4 grid-cols-5 grid-rows-5 rounded-lg"> 
          <div className="col-span-2 row-span-2 p-4 overview-card flex-col break-words justify-between">
            <div className="flex gap-1 items-center">
              <span className="section-headline">Statistics</span>
              <ChartLineIcon className="text-white" width={20} height={20} />
            </div>


          </div>

          <div className="col-span-3 row-span-2 p-4 overview-card flex-col break-words">
            <div className="flex gap-0.5 items-center">
              <span className="section-headline">Staking Overview</span>
              <StakingIcon className="text-white" width={20} height={20} />
            </div>

            <div style={{ width: "300px" }}>
              <StakePoolCard pool={poolData} delegate={false} />
            </div>
          </div>

          <div className="col-span-5 row-span-3 p-4 overview-card gap-2 flex-col break-words">
            <div className="flex gap-0.5 items-center">
              <span className="section-headline">Browse Pools</span>
              <GlobalIcon className="text-white" width={20} height={20} />
            </div>

            <div className="flex flex-col h-full justify-between">
              <div className="flex flex-col gap-2">
                <div className="flex w-fit">
                  <Input type="text" isClearable variant="bordered" label="Search" placeholder="Type to search..." startContent={<SearchIcon className="text-white mb-0.5" width={16} height={16} />} value={search} onValueChange={setSearch} />
                </div>

                <div className="w-full" style={{height: "270px"}}>
                  <ScrollShadow className="h-full gap-2 flex flex-col overflow-x-hidden" size={20}>
                    <StakePoolList stakePools={stakePools} wallet={selectedWallet} />                    
                  </ScrollShadow>
                </div>
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
            </div>

          </div>
        </div>
      </div>
    </>
  );
}