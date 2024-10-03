'use client';

import { FilterIcon } from "@/components/icons/FilterIcon";
import { StakingIcon } from "@/components/icons/StakingIcon";
import StakePoolCard from "@/components/StakePoolCard";
import { StakePoolData } from "@/model/StakePool";
import { DelegationStatus, Wallet } from "@/model/Wallet";
import useWalletStore from "@/model/WalletState";
import { queryPool } from "@/services/StakeService";
import { Input, Pagination, ScrollShadow } from "@nextui-org/react";
import React, { useEffect, useState } from "react";

export default function Home() {
  const { wallets, add, remove, update, selected, setSelected } = useWalletStore();
  const [selectedWallet, setSelectedWallet] = useState({} as Wallet);
  const [poolData, setPoolData] = useState({} as StakePoolData);
  const [search, setSearch] = useState("");

  const [stakePools, setStakePools] = useState([] as StakePoolData[]);

  const [currentPage, setCurrentPage] = useState(1);
  const [oldPage, setOldPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    for(let i = 0; i < wallets.length; i++) {
      if(wallets[i].id === selected) {
        setSelectedWallet(wallets[i]);

        if(wallets[i].delegation.active.target) {
          queryPool(wallets[i].delegation.active.target)
            .then(res => {
              setPoolData(res.pool);
            });
        } else {
          setPoolData({} as StakePoolData);
        }
      }
    }
  }, [selected]);

  // query stakepools

  // make browse pool cards smaller, move search filter to browse pools section, make statistics block bigger, dropdown for different metrics

  return (
    <>
      <div className="wallet-overview-content">
        <div className="grid h-full w-full gap-4 grid-cols-5 grid-rows-5 rounded-lg"> 
          <div className="col-span-2 row-span-1 p-4 overview-card flex-col break-words justify-between">
            <div className="flex gap-0.5 items-center">
              <span className="section-headline">Statistics</span>
            </div>


          </div>

          <div className="col-span-3 row-span-2 p-4 overview-card flex-col break-words justify-between">
            <div className="flex gap-0.5 items-center">
              <span className="section-headline">Staking Overview</span>
              <StakingIcon className="text-white" width={16} height={16} />
            </div>

            {
              selectedWallet && selectedWallet.delegation && selectedWallet.delegation.active.status !== DelegationStatus.NotDelegating &&
                <StakePoolCard pool={poolData} />
            }
          </div>

          <div className="col-span-2 row-span-1 p-4 overview-card flex-col break-words justify-between">
            <div className="flex gap-0.5 items-center">
              <span className="section-headline">Search Filters</span>
              <FilterIcon className="text-white" width={16} height={16} />
            </div>

            <div className="flex gap-4">
              <Input type="text" isClearable variant="bordered" label="Search" placeholder="Type to search..." value={search} onValueChange={setSearch} />
            </div>
          </div>

          <div className="col-span-5 row-span-3 p-4 overview-card flex-col break-words">
            <div className="flex gap-0.5 items-center">
              <span className="section-headline">Browse Pools</span>
            </div>

            <div className="flex flex-col justify-between h-full">
              <div className="w-full" style={{height: "350px"}}>
                <ScrollShadow className="h-full" size={20}>
                  <div className="flex justify-between">
                    {
                      selectedWallet && selectedWallet.delegation && selectedWallet.delegation.active.status !== DelegationStatus.NotDelegating &&
                        <StakePoolCard pool={poolData} />
                    }
                    {
                      selectedWallet && selectedWallet.delegation && selectedWallet.delegation.active.status !== DelegationStatus.NotDelegating &&
                        <StakePoolCard pool={poolData} />
                    }
                    {
                      selectedWallet && selectedWallet.delegation && selectedWallet.delegation.active.status !== DelegationStatus.NotDelegating &&
                        <StakePoolCard pool={poolData} />
                    }
                  </div>
                  <div className="flex justify-between">
                    {
                      selectedWallet && selectedWallet.delegation && selectedWallet.delegation.active.status !== DelegationStatus.NotDelegating &&
                        <StakePoolCard pool={poolData} />
                    }
                    {
                      selectedWallet && selectedWallet.delegation && selectedWallet.delegation.active.status !== DelegationStatus.NotDelegating &&
                        <StakePoolCard pool={poolData} />
                    }
                    {
                      selectedWallet && selectedWallet.delegation && selectedWallet.delegation.active.status !== DelegationStatus.NotDelegating &&
                        <StakePoolCard pool={poolData} />
                    }
                  </div>
                  <div className="flex justify-between">
                    {
                      selectedWallet && selectedWallet.delegation && selectedWallet.delegation.active.status !== DelegationStatus.NotDelegating &&
                        <StakePoolCard pool={poolData} />
                    }
                    {
                      selectedWallet && selectedWallet.delegation && selectedWallet.delegation.active.status !== DelegationStatus.NotDelegating &&
                        <StakePoolCard pool={poolData} />
                    }
                    {
                      selectedWallet && selectedWallet.delegation && selectedWallet.delegation.active.status !== DelegationStatus.NotDelegating &&
                        <StakePoolCard pool={poolData} />
                    }
                  </div>
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
            </div>

          </div>
        </div>
      </div>
    </>
  );
}