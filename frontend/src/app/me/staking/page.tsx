'use client';

import BrowsePoolSection from "@/components/BrowsePoolSection";
import { BoxesIcon } from "@/components/icons/BoxesIcon";
import { BoxIcon } from "@/components/icons/BoxIcon";
import { ChartLineIcon } from "@/components/icons/ChartLineIcon";
import { DangerIcon } from "@/components/icons/DangerIcon";
import { DelegatorIcon } from "@/components/icons/DelegatorIcon";
import { ExternalLinkIcon } from "@/components/icons/ExternalLinkIcon";
import { HandCoinIcon } from "@/components/icons/HandCoinIcon";
import { PledgeIcon } from "@/components/icons/PledgeIcon";
import { ProjectedBoxIcon } from "@/components/icons/ProjectedBoxIcon";
import { RecentApyIcon } from "@/components/icons/RecentApyIcon";
import { SaturationIcon } from "@/components/icons/SaturationIcon";
import { StakingIcon } from "@/components/icons/StakingIcon";
import StakeStatisticsChart from "@/components/StakeStatisticsChart";
import StopDelegateModal from "@/components/StopDelegateModal";
import { loveLaceToAda } from "@/Constants";
import { StakePoolData } from "@/model/StakePool";
import { DelegationStatus, Wallet } from "@/model/Wallet";
import useWalletStore from "@/model/WalletState";
import { queryPool } from "@/services/StakeService";
import { extractTicker, formatNumber, numberToPercent, parseDateTime } from "@/services/TextFormatService";
import { Image, Snippet, Divider, Link, Progress, Tooltip } from "@nextui-org/react";
import React, { useEffect, useState } from "react";

export default function Home() {
  const { wallets, selected } = useWalletStore();
  const [selectedWallet, setSelectedWallet] = useState({} as Wallet);
  const [poolData, setPoolData] = useState({} as StakePoolData);

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

  return (
    <>
      <div className="wallet-overview-content">
        <div className="grid h-full w-full gap-4 grid-cols-5 grid-rows-5 rounded-lg"> 
          <div className="col-span-2 row-span-2 p-4 overview-card flex-col break-words justify-between">
            <div className="flex gap-1 items-center">
              <span className="section-headline">Statistics</span>
              <ChartLineIcon className="text-white" width={20} height={20} />
            </div>

            <StakeStatisticsChart wallet={selectedWallet} />
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
                      <div className="flex gap-0.5 items-center">
                        <SaturationIcon width={18} height={18} />
                        <span>Saturation</span>
                      </div>
                      <div className="flex gap-2 items-center w-full">
                        <Progress color="secondary" key={"progress"} aria-label={"progress"} value={parseFloat(numberToPercent(poolData.saturation, 2))} />
                        <span>{numberToPercent(poolData.saturation, 2)}</span>
                      </div>
                    </div>

                    <div className="flex justify-between">
                      <div>
                        <div className="flex gap-0.5 items-center">
                          <PledgeIcon width={20} height={20} />
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
                            <span className="-mt-0.5"><DangerIcon width={12} height={12} /></span>
                          </Tooltip>
                        </div>
                      </div>
                      <span>₳ {formatNumber(parseFloat(poolData.pledge) / loveLaceToAda, 2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <div>
                        <div className="flex gap-0.5 items-center">
                          <HandCoinIcon width={20} height={20} />
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
                            <span className="-mt-0.5"><DangerIcon width={12} height={12} /></span>
                          </Tooltip>
                        </div>
                      </div>
                      <span>₳ {formatNumber(parseFloat(poolData.tax_fix) / loveLaceToAda, 2)} ({formatNumber(parseFloat(poolData.tax_ratio), 2)}%)</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <div className="flex gap-1 items-center">
                        <DelegatorIcon width={20} height={20} />
                        <span>Delegators</span>
                      </div>
                      <span>{poolData.delegators}</span>
                    </div>
                  </div>
                  <Divider orientation="vertical" className="max-h-36" />
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <div className="flex gap-0.5 items-center">
                        <BoxesIcon width={20} height={20} />
                        <span>Blocks Lifetime</span>
                      </div>
                      <span>{poolData.blocks_lifetime}</span>
                    </div>
                    <div className="flex justify-between">
                      <div className="flex gap-0.5 items-center">
                        <BoxIcon width={20} height={20} />
                        <span>Blocks this Epoch</span>
                      </div>
                      <span>{poolData.blocks_epoch}</span>
                    </div>
                    <div className="flex justify-between">
                      <div className="flex gap-0.5 items-center">
                        <ProjectedBoxIcon width={20} height={20} />
                        <span>Projected Blocks</span>
                      </div>
                      <span>{poolData.blocks_est_epoch}</span>
                    </div>
                    <div className="flex justify-between">
                      <div className="flex gap-0.5 items-center">
                        <RecentApyIcon width={20} height={20} />
                        <span>Recent APY</span>
                      </div>
                      <span>~{formatNumber(parseFloat(poolData.roa_short), 2)}%</span>
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

          <BrowsePoolSection />
        </div>
      </div>
    </>
  );
}