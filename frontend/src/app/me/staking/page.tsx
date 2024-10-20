'use client';

import DelegateModal from "@/components/DelegateModal";
import { ChartLineIcon } from "@/components/icons/ChartLineIcon";
import { DangerIcon } from "@/components/icons/DangerIcon";
import { ExternalLinkIcon } from "@/components/icons/ExternalLinkIcon";
import { FilterIcon } from "@/components/icons/FilterIcon";
import { GlobalIcon } from "@/components/icons/GlobalIcon";
import { ScatterIcon } from "@/components/icons/ScatterIcon";
import { SearchIcon } from "@/components/icons/SearchIcon";
import { StakingIcon } from "@/components/icons/StakingIcon";
import PoolSocials from "@/components/PoolSocials";
import StakePoolCard from "@/components/StakePoolCard";
import StakePoolList from "@/components/StakePoolList";
import StopDelegateModal from "@/components/StopDelegateModal";
import { loveLaceToAda } from "@/Constants";
import { StakePoolData, StakePoolListDto } from "@/model/StakePool";
import { DelegationStatus, Wallet } from "@/model/Wallet";
import useWalletStore from "@/model/WalletState";
import { getAllPools, queryPool } from "@/services/StakeService";
import { cutText, extractTicker, formatNumber, numberToPercent, parseDateTime } from "@/services/TextFormatService";
import { Input, Pagination, ScrollShadow, Image, Snippet, Divider, Link, Progress, Tooltip, Button, Breadcrumbs, BreadcrumbItem } from "@nextui-org/react";
import React, { useEffect, useState } from "react";

export default function Home() {
  const { wallets, add, remove, update, selected, setSelected } = useWalletStore();
  const [selectedWallet, setSelectedWallet] = useState({} as Wallet);
  const [poolData, setPoolData] = useState({} as StakePoolData);
  const [search, setSearch] = useState("");

  const [stakePools, setStakePools] = useState([] as StakePoolData[]);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [currentBreadCrumb, setCurrentBreadCrumb] = React.useState("Browse Pools");
  const [selectedPool, setSelectedPool] = React.useState({} as StakePoolData);

  useEffect(() => {
    if(currentBreadCrumb === "Browse Pools") {
      setSelectedPool({} as StakePoolData);
    }
  }, [currentBreadCrumb]);

  function changeSelectedPool(pool: StakePoolData) {
    setSelectedPool(pool);
  }

  useEffect(() => {
    if(selectedPool.pool_id) {
      setCurrentBreadCrumb(selectedPool.pool_id);
    }
  }, [selectedPool]);

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
        } else if(wallets[i].delegation.next[0].target) { 
          // TODO wallets[i].delegation.next[0].target
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

            {
              selectedWallet.delegation && selectedWallet.delegation.active.status === DelegationStatus.NotDelegating && (!selectedWallet.delegation.next[0] 
                || selectedWallet.delegation.next[0].status === DelegationStatus.NotDelegating) &&
              <div className="flex flex-col justify-center items-center w-full h-full">
                <span>You are currently not staking to a pool.</span>
                <span>Start by choosing a stake pool to delegate your ADA.</span>
                <div className="h-full absolute top-0 right-0 p-4 flex flex-col justify-between items-end">
                  <span className="text-center">You can earn up to ~3% APY on <br></br> your ADA by staking to a stake pool.</span>
                </div>
              </div>
            }
            {
              selectedWallet.delegation && selectedWallet.delegation.active.status === DelegationStatus.NotDelegating && selectedWallet.delegation.next[0] 
                && selectedWallet.delegation.next[0].status !== DelegationStatus.NotDelegating &&
              <div className="absolute flex flex-col items-center right-2 top-2">
                <span>Your delegation starts in epoch {selectedWallet.delegation.next[0].changes_at.epoch_number}.</span>
                <span>The epoch starts at {parseDateTime(selectedWallet.delegation.next[0].changes_at.epoch_start_time)}</span>
              </div>
            }
            {
              poolData && poolData.name &&
              <div className="mt-2">
                <div className="flex gap-3 items-center">
                  <Image
                    alt={poolData.name}
                    height={50}
                    radius="sm"
                    src={poolData.img}
                    width={50}
                  />
                  <div className="flex items-end justify-between w-full">
                    <div className="flex flex-col">
                      <span>{extractTicker(poolData.name, true)}</span>
                      <span>{extractTicker(poolData.name, false)}</span>
                    </div>
                    <div>
                      <Snippet 
                        symbol="" 
                        tooltipProps={{
                          className: "dark"
                        }}
                        codeString={poolData.pool_id}
                        size="md"
                        classNames={{
                          base: "p-0 bg-transparent text-inherit",
                          pre: "font-sans"
                        }}
                      >
                        <span>{poolData.pool_id}</span>
                      </Snippet>
                    </div>
                  </div>
                </div>
                <Divider className="mb-2 mt-3" />
                <div className="flex gap-3 justify-between h-full">
                  <div className="flex-1">
                    <div className="flex gap-4 items-center">
                      <span>Saturation</span>
                      <div className="flex gap-2 items-center w-full">
                        <Progress color="secondary" key={"progress"} aria-label={"progress"} value={parseFloat(numberToPercent(poolData.saturation, 2))} />
                        <span>{numberToPercent(poolData.saturation, 2)}</span>
                      </div>
                    </div>

                    <div className="flex justify-between">
                      <div>
                        <span>Pledge </span>
                        <Tooltip
                          color="warning"
                          className='tooltip-container text-white'
                          content={
                            <div className="px-1 py-2">
                              <div className="text-small font-bold text-success">Information</div>
                              <div className="text-tiny">The pledge is the amount of ADA pledged <br></br> by the operator to the pool.</div>
                            </div>
                          }
                        >
                          <span className="absolute mt-0.5"><DangerIcon width={12} height={12} /></span>
                        </Tooltip>
                      </div>
                      <span>₳ {formatNumber(parseFloat(poolData.pledge) / loveLaceToAda, 2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <div>
                        <span>Fees </span>
                        <Tooltip
                          color="warning"
                          className='tooltip-container text-white'
                          content={
                            <div className="px-1 py-2">
                              <div className="text-small font-bold text-success">Information</div>
                              <div className="text-tiny flex flex-col">
                                <span>The fees consist of a fixed fee and a variable fee (margin).</span>
                                  <span className="mt-1">The fixed fee is deducted from the total rewards of the pool <br></br> to cover stake pool operating costs.</span>
                                  <span className="mt-1">The variable fee is a percentage share of the total rewards <br></br> that the operator receives.</span>
                              </div>
                            </div>
                          }
                        >
                          <span className="absolute mt-0.5"><DangerIcon width={12} height={12} /></span>
                        </Tooltip>
                      </div>
                      <span>₳ {formatNumber(parseFloat(poolData.tax_fix) / loveLaceToAda, 2)} ({formatNumber(parseFloat(poolData.tax_ratio), 2)}%)</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span>Delegators</span>
                      <span>{poolData.delegators}</span>
                    </div>
                  </div>
                  <Divider orientation="vertical" className="max-h-36" />
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <span>Blocks Lifetime</span>
                      <span>{poolData.blocks_lifetime}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Blocks this Epoch</span>
                      <span>{poolData.blocks_epoch}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Projected Blocks</span>
                      <span>{poolData.blocks_est_epoch}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Recent APY</span>
                      <span>~{poolData.roa_short}%</span>
                    </div>
                  </div>
                </div>
                
                <div className="absolute bottom-4 left-4">
                  <StopDelegateModal wallet={selectedWallet} pool={poolData} />
                </div>

                <Link color='secondary' className='wallet-nav-link absolute bottom-2 right-2' href={poolData.url} isExternal>
                  <div className="flex gap-0.5 items-center">
                    <span>view on cexplorer.io</span> 
                    <ExternalLinkIcon width={18} height={18} />
                  </div>
                </Link>
              </div>
            }
          </div>

          <div className="col-span-5 row-span-3 p-4 overview-card gap-2 flex-col break-words">
            <div className="flex gap-4 items-center">
              <Breadcrumbs onAction={(key) => setCurrentBreadCrumb(key as string)}>
                <BreadcrumbItem key={"Browse Pools"} isCurrent={currentBreadCrumb === "Browse Pools"}>
                  <div className="flex gap-0.5 items-center">
                    <span className="text-xl">Browse Pools</span>
                    <GlobalIcon width={20} height={20} />
                  </div>
                </BreadcrumbItem>
                
                {
                  selectedPool && selectedPool.pool_id && 
                  <BreadcrumbItem key={selectedPool.pool_id} isCurrent={currentBreadCrumb === selectedPool.pool_id}>{selectedPool.name}</BreadcrumbItem>
                }
              </Breadcrumbs>
            </div>

            {
              selectedPool && !selectedPool.pool_id && 
              <div className="flex flex-col h-full justify-between">
                <div className="flex flex-col gap-2">
                  <div className="flex w-fit">
                    <Input type="text" isClearable variant="bordered" label="Search" placeholder="Type to search..." startContent={<SearchIcon className="text-white mb-0.5" width={16} height={16} />} value={search} onValueChange={setSearch} />
                  </div>

                  <div className="w-full" style={{height: "270px"}}>
                    <ScrollShadow className="h-full gap-2 flex flex-col overflow-x-hidden" size={20}>
                      <StakePoolList stakePools={stakePools} wallet={selectedWallet} setSelectedPool={changeSelectedPool} />                    
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
            }
            {
              selectedPool && selectedPool.pool_id && 
              <div className="flex gap-4">
                <div className="flex-1">
                  <div className="flex gap-3 items-center">
                    <Image
                      alt={selectedPool.name}
                      height={50}
                      radius="sm"
                      src={selectedPool.img}
                      width={50}
                    />
                    <div className="flex items-center justify-between w-full">
                      <div className="flex flex-col">
                        <span>{extractTicker(selectedPool.name, true)}</span>
                        <span>{extractTicker(selectedPool.name, false)}</span>
                      </div>
                      <div>
                        <Snippet 
                          symbol="" 
                          tooltipProps={{
                            className: "dark"
                          }}
                          codeString={selectedPool.pool_id}
                          size="md"
                          classNames={{
                            base: "p-0 bg-transparent text-inherit",
                            pre: "font-sans"
                          }}
                        >
                          <span>{cutText(selectedPool.pool_id, 30)}</span>
                        </Snippet>
                      </div>
                    </div>
                  </div>
                  <Divider className="mb-2 mt-3" />
                  <div className="flex gap-3 justify-between">
                    <div className="flex-1">
                      <div className="flex gap-4 items-center">
                        <span>Saturation</span>
                        <div className="flex gap-2 items-center w-full">
                          <Progress color="secondary" key={"progress"} aria-label={"progress"} value={parseFloat(numberToPercent(selectedPool.saturation, 2))} />
                          <span>{numberToPercent(selectedPool.saturation, 2)}</span>
                        </div>
                      </div>

                      <div className="flex justify-between">
                        <div>
                          <span>Pledge </span>
                          <Tooltip
                            color="warning"
                            className='tooltip-container text-white'
                            content={
                              <div className="px-1 py-2">
                                <div className="text-small font-bold text-success">Information</div>
                                <div className="text-tiny">The pledge is the amount of ADA pledged <br></br> by the operator to the pool.</div>
                              </div>
                            }
                          >
                            <span className="absolute mt-0.5"><DangerIcon width={12} height={12} /></span>
                          </Tooltip>
                        </div>
                        <span>₳ {formatNumber(parseFloat(selectedPool.pledge) / loveLaceToAda, 2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <div>
                          <span>Fees </span>
                          <Tooltip
                            color="warning"
                            className='tooltip-container text-white'
                            content={
                              <div className="px-1 py-2">
                                <div className="text-small font-bold text-success">Information</div>
                                <div className="text-tiny flex flex-col">
                                  <span>The fees consist of a fixed fee and a variable fee (margin).</span>
                                    <span className="mt-1">The fixed fee is deducted from the total rewards of the pool <br></br> to cover stake pool operating costs.</span>
                                    <span className="mt-1">The variable fee is a percentage share of the total rewards <br></br> that the operator receives.</span>
                                </div>
                              </div>
                            }
                          >
                            <span className="absolute mt-0.5"><DangerIcon width={12} height={12} /></span>
                          </Tooltip>
                        </div>
                        <span>₳ {formatNumber(parseFloat(selectedPool.tax_fix) / loveLaceToAda, 2)} ({selectedPool.tax_ratio}%)</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Delegators</span>
                        <span>{selectedPool.delegators}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Active Stake</span>
                        <span>₳ {formatNumber(parseFloat(selectedPool.stake_active) / loveLaceToAda, 2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Live Stake</span>
                        <span>₳ {formatNumber(parseFloat(selectedPool.stake) / loveLaceToAda, 2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Website</span>
                        <Link color='secondary' href={String(selectedPool.handles.homepage).substring(1, selectedPool.handles.homepage.length - 1)} isExternal>
                          <span>{String(selectedPool.handles.homepage).substring(1, selectedPool.handles.homepage.length - 1)}</span> 
                        </Link>
                      </div>   
                    </div>

                    <Divider orientation="vertical" className="min-h-44 max-h-44" />

                    <div className="flex-1">
                      <div className="flex justify-between">
                        <span>Blocks Lifetime</span>
                        <span>{selectedPool.blocks_lifetime}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Blocks this Epoch</span>
                        <span>{selectedPool.blocks_epoch}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Projected Blocks</span>
                        <span>{selectedPool.blocks_est_epoch}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Recent APY</span>
                        <span>~{selectedPool.roa_short}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Lifetime APY</span>
                        <span>~{selectedPool.roa_lifetime}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Luck Lifetime</span>
                        <span>{numberToPercent(parseFloat(selectedPool.luck_lifetime), 2)}</span>
                      </div>
                    </div>
                  </div>

                  {
                    'pool1qqqqqdk4zhsjuxxd8jyvwncf5eucfskz0xjjj64fdmlgj735lr9' !== selectedPool.pool_id && // wallet.delegation.active.target
                    <div>
                      <DelegateModal wallet={selectedWallet} pool={selectedPool} />
                    </div>
                  }

                  <div className="absolute bottom-4 left-4">
                    <PoolSocials pool={selectedPool} />
                  </div>
                  
                  <Link color='secondary' className='wallet-nav-link absolute bottom-2 right-2' href={selectedPool.url} isExternal>
                    <div className="flex gap-0.5 items-center">
                      <span>view on cexplorer.io</span> 
                      <ExternalLinkIcon width={18} height={18} />
                    </div>
                  </Link>
                </div>

                <Divider orientation="vertical" />

                <div className="flex-1"> 
                  <span>PLACEHOLDER</span>
                </div>
              </div>
            }
          </div>
        </div>
      </div>
    </>
  );
}