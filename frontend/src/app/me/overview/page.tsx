'use client';

import "./overview.css";
import { Button, Divider, Link, ScrollShadow, Snippet, Spinner, Tooltip, Image, Progress, Chip } from '@nextui-org/react';
import useWalletStore from "@/model/WalletState";
import { getAddress, syncWallet } from '@/services/WalletService';
import { useEffect, useState } from "react";
import { DelegationStatus, Wallet } from "@/model/Wallet";
import { Address } from "@/model/Address";
import { DangerIcon } from "@/components/icons/DangerIcon";
import { AdaData, AdaInfo } from "@/model/AdaData";
import OverviewPieChart from "@/components/OverviewPieChart";
import { cutText, extractTicker, formatAdaAddress, formatNumber, hexToAsciiString, numberToPercent, parseDateTime } from "@/services/TextFormatService";
import EditWalletModal from "@/components/EditWalletModal";
import RemoveWalletModal from "@/components/RemoveWalletModal";
import { QRCodeSVG } from "qrcode.react";
import { ArrowIcon } from "@/components/icons/ArrowIcon";
import { TransactionIcon } from "@/components/icons/TransactionIcon";
import { StakingIcon } from "@/components/icons/StakingIcon";
import React from "react";
import { setActiveItem } from "@/services/NavbarHelperService";
import TxHistoryEntry from "@/components/TxHistoryEntry";
import { LightningIcon } from "@/components/icons/LightningIcon";
import { IncreaseIcon } from "@/components/icons/IncreaseIcon";
import { SwapIcon } from "@/components/icons/SwapIcon";
import SendAdaModal from "@/components/SendAdaModal";
import { queryPool } from "@/services/StakeService";
import { StakePoolData } from "@/model/StakePool";
import { Transaction, TransactionListDto } from "@/model/Transaction";
import { getTxHistory, searchTxHistory } from "@/services/TxService";
import StakePoolCard from "@/components/StakePoolCard";
import { adaPrice, loveLaceToAda } from "@/Constants";
import { TreasureIcon } from "@/components/icons/TreasureIcon";
import AdaPriceChart from "@/components/AdaPriceChart";
import { getCoinInfo, getCoinPriceData } from "@/services/CoinDataService";
import { SuccessIcon } from "@/components/icons/SuccessIcon";
import { CheckmarkIcon } from "@/components/icons/CheckmarkIcon";
import { ExternalLinkIcon } from "@/components/icons/ExternalLinkIcon";
import StopDelegateModal from "@/components/StopDelegateModal";
import { getNetworkInformation, getRemainingEpochTime } from "@/services/NetworkService";
import { NetworkInformation } from "@/model/NetworkInformation";
import { RecentApyIcon } from "@/components/icons/RecentApyIcon";
import { BoxesIcon } from "@/components/icons/BoxesIcon";
import { BoxIcon } from "@/components/icons/BoxIcon";
import { PledgeIcon } from "@/components/icons/PledgeIcon";
import { DelegatorIcon } from "@/components/icons/DelegatorIcon";
import { ProjectedBoxIcon } from "@/components/icons/ProjectedBoxIcon";
import { FireIcon } from "@/components/icons/FireIcon";
import { SaturationIcon } from "@/components/icons/SaturationIcon";
import { HandCoinIcon } from "@/components/icons/HandCoinIcon";

export default function Home() {
  const { wallets, add, remove, update, selected, setSelected } = useWalletStore();

  const [selectedWallet, setSelectedWallet] = useState({} as Wallet);
  const [transactions, setTransactions] = useState([] as Transaction[]);
  const [address, setAddress] = useState({} as Address);
  const [poolData, setPoolData] = useState({} as StakePoolData);
  const [network, setNetwork] = useState({} as NetworkInformation);

  const [adaData, setAdaData] = useState({} as AdaData);
  const [adaInfo, setAdaInfo] = useState({} as AdaInfo);
  const [windowWidth, setWindowWidth] = useState(typeof window !== "undefined" ? window.innerWidth : 0);

  useEffect(() => {
    getNetworkInformation()
      .then(res => {
        setNetwork(res.information as NetworkInformation);
      });
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);  
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const getPieChartData = () => {
    let data = [];
    let assets = selectedWallet.assets.total;

    if(selectedWallet) {
      let adaQuantity = selectedWallet.balance.available.quantity / loveLaceToAda;
      data.push({ name: "ADA", quantity: adaQuantity, value: adaQuantity * adaPrice });

      for(let i = 0; i < assets.length; i++) {
        // TODO call backend for current price of native token
        let value = 400; // TODO only for testing

        data.push({ name: hexToAsciiString(assets[i].asset_name), quantity: assets[i].quantity, value: value });
      }
    }

    /*
    return [
      { name: 'ADA', quantity: 100, value: 400, ratio: 0.25 },
      { name: 'SNEK', quantity: 100, value: 300, ratio: 0.25 },
      { name: 'AXS', quantity: 100, value: 900, ratio: 0.25 },
      { name: 'TLS', quantity: 100, value: 200, ratio: 0.25 }
    ];
    */
    return data;
  };

  function sync() {
    document.getElementById("syncIcon")?.classList.add("hidden");
    document.getElementById("spinnerIcon")?.classList.remove("hidden");

    syncWallet(selectedWallet.id)
      .then(res => {
        res.wallet.isSelected = selectedWallet.isSelected;
        res.wallet.lastSynced = new Date().toUTCString();
        update(selectedWallet.id, res.wallet as Wallet);

        setTimeout(() => {
          document.getElementById("spinnerIcon")?.classList.add("hidden");
          document.getElementById("successIcon")?.classList.remove("hidden");
        }, 2000);

        setTimeout(() => {
          document.getElementById("successIcon")?.classList.add("hidden");
          document.getElementById("syncIcon")?.classList.remove("hidden");
        }, 5000);
      });
  
    getNetworkInformation()
      .then(res => {
        setNetwork(res.information as NetworkInformation);
      });  
  }

  useEffect(() => {
    getCoinPriceData("cardano")
      .then(res => {
        console.log("prices: ", res);

        setAdaData(res.data as AdaData);
      });
    
    /*getCoinInfo("cardano")
      .then(res => {
        console.log(res);

        setAdaInfo(res.data as AdaInfo);
      });*/
  }, []);
 
  useEffect(() => {
    let activeWallet = {} as Wallet;

    for(let i = 0; i < wallets.length; i++) {
      if(wallets[i].isSelected) {
        activeWallet = wallets[i];

        getAddress(wallets[i].id)
          .then(res => {
            setAddress(res.address);
          });

        syncWallet(wallets[i].id)
          .then(res => {
            res.wallet.isSelected = wallets[i].isSelected;
            res.wallet.lastSynced = new Date().toUTCString();
            wallets[i] = res.wallet as Wallet;

            update(wallets[i].id, wallets[i]);
          });

          if(wallets[i].delegation.active.target) {
            // TODO wallets[i].delegation.active.target
            queryPool('pool1qqqqqdk4zhsjuxxd8jyvwncf5eucfskz0xjjj64fdmlgj735lr9')
              .then(res => {
                console.log(res);

                setPoolData(res.pool);
              });
          } else {
            setPoolData({} as StakePoolData);
          }
      }
    }

    setSelectedWallet(activeWallet);
  }, [selected]);

  useEffect(() => {
    if(selectedWallet && selectedWallet.id) {
      getTxHistory(selectedWallet.id, 1, 10)
        .then(res => {
          console.log(res);

          let listDto = res as TransactionListDto;
          setTransactions(listDto.transactions);
        }); 
    }
  }, [selectedWallet]);

  // TODO sync wallet every minute 
  /*useEffect(() => {
    setTimeout(() => {
      setInterval(() => {
        for(let i = 0; i < wallets.length; i++) {
          syncWallet(wallets[i].id)
            .then(res => {
              console.log("synced wallet");

              res.wallet.isSelected = wallets[i].isSelected;
              res.wallet.lastSynced = new Date().toUTCString();
              wallets[i] = res.wallet as Wallet;

              update(wallets[i].id, wallets[i]);
            });
        }
      }, 5000);
    }, 5000);
  }, []);*/

  return (
    <>
      {
        wallets.length <= 0 &&
        <div className="w-full h-full flex flex-col justify-center items-center">
          <div className="absolute top-0 right-0 mt-16 mr-20 text-white">
            <ArrowIcon className="rotate-45"/>
          </div>
          <span className="text-center">You currently do not have any wallets saved. <br></br>Start by creating or restoring one.</span>
        </div>
      }
      {
        wallets.length > 0 && !selectedWallet.id &&
        <div className="w-full h-full flex flex-col justify-center items-center">
          <div className="absolute top-0 right-0 mt-16 mr-20 text-white">
            <ArrowIcon className="rotate-45"/>
          </div>
          <div className="absolute top-0 left-0 mt-16 ml-20 text-white">
            <ArrowIcon className="-rotate-45"/>
          </div>
          <span className="text-center">Select one of your wallets or add a new wallet <br></br> by creating or restoring an existing wallet.</span>
        </div>
      }
      {
        wallets.length > 0 && selectedWallet.id && 
        <div className="wallet-overview-content">
          <div className="grid h-full w-full gap-4 grid-cols-5 grid-rows-5 rounded-lg"> 

            <div className="col-span-3 row-span-3 p-4 overview-card flex-col break-words" style={{height: "460px"}}>
              <div className="flex justify-between">
                <div className="flex gap-1 items-center">
                  <span className="section-headline">Wallet Overview</span>
                  <TreasureIcon className="text-white" width={20} height={20} />
                </div>

                <div className="flex flex-col gap-2 items-end">
                  <div className="flex gap-2 items-center">
                    <div>
                      <a id="syncIcon" className="sync-icon flex items-center justify-center cursor-pointer" onClick={sync} aria-label="Sync wallet"><SwapIcon width={20} height={20} /></a>
                      <Spinner id="spinnerIcon" size="sm" color="secondary" className="hidden text-white" />
                      <CheckmarkIcon id="successIcon" className="hidden text-white" width={24} height={24} />
                    </div>
                    
                    <EditWalletModal id={selectedWallet.id} value={selectedWallet.name} />
                    <RemoveWalletModal wallet={selectedWallet} />
                  </div>
                  <Button className="absolute translate-y-8" size="sm" color="secondary" variant="ghost" aria-label='Buy ADA'>
                    <span className="flex gap-0.5 items-center">
                      Buy ADA
                      <IncreaseIcon width={16} height={16} />
                    </span>
                  </Button>
                </div>
              </div>

              <div className="balance-overview-container">
                <div className="flex justify-center">
                  <OverviewPieChart data={getPieChartData()} />
                </div>

                <div className="w-full flex flex-col justify-end">
                  <div className="balance-container">
                    <span>Available 
                      <Tooltip
                        color="warning"
                        className='tooltip-container text-white'
                        content={
                          <div className="px-1 py-2">
                            <div className="text-small font-bold text-success">Information</div>
                            <div className="text-tiny">The funds which are not locked <br></br> and you can use to full extend.</div>
                          </div>
                        }
                      >
                      <span className='absolute ml-0.5 mt-0.5'><DangerIcon width={12} height={12} /></span>
                      </Tooltip>
                    </span>
                    <div className="balance-price-container">
                      <span className="price-field">{<span>₳ {formatNumber(selectedWallet.balance.available.quantity / loveLaceToAda, 2)}</span>}</span>
                      <span className="price-field">{<span>{formatNumber((selectedWallet.balance.available.quantity / loveLaceToAda) * adaPrice, 2)} €</span>}</span>
                    </div>
                  </div>

                  <div className="balance-container">
                    <span>Reward
                      <Tooltip
                        color="warning"
                        className='tooltip-container text-white'
                        content={
                          <div className="px-1 py-2">
                            <div className="text-small font-bold text-success">Information</div>
                            <div className="text-tiny">The funds which where earned through staking.</div>
                          </div>
                        }
                      >
                      <span className='absolute ml-0.5 mt-0.5'><DangerIcon width={12} height={12} /></span>
                      </Tooltip>
                    </span>
                    <div className="balance-price-container">
                      <span className="price-field">{<span>₳ {formatNumber(selectedWallet.balance.reward.quantity / loveLaceToAda, 2)}</span>}</span>
                      <span className="price-field">{<span>{formatNumber((selectedWallet.balance.reward.quantity / loveLaceToAda) * adaPrice, 2)} €</span>}</span>
                    </div>
                  </div>

                  <div className="balance-container">
                    <span>Total</span>
                    <div className="balance-price-container">
                      <span className="price-field">{<span>₳ {formatNumber(selectedWallet.balance.total.quantity / loveLaceToAda, 2)}</span>}</span>
                      <span className="price-field">{<span>{formatNumber((selectedWallet.balance.total.quantity / loveLaceToAda) * adaPrice, 2)} €</span>}</span>
                    </div>
                  </div>
                </div>
              </div>

              <Divider className="my-3" />

              <div className="flex flex-col justify-between h-full">
                <ScrollShadow hideScrollBar size={20}>
                  {
                    selectedWallet.assets.total.map((asset, i) => 
                      <div key={"asset" + i} aria-label={"asset" + i} className="flex justify-between">
                        <span>{hexToAsciiString(asset.asset_name)} ({asset.quantity})</span>
                        <span>N/A €</span>
                      </div>
                    )
                  }
                </ScrollShadow>
              
                <div className="flex flex-col gap-3">
                  <div className="flex justify-end">
                    <Chip variant="flat" radius="sm" size="md" style={{ border: "1px solid rgba(63, 63, 70, 0.5)", background: "rgba(63, 63, 70, 0.3)" }}>
                      <span>Epoch: {network.network_tip && network.network_tip.epoch_number} - Slot: {network.network_tip && network.network_tip.slot_number} / 86400 ({network.network_tip && getRemainingEpochTime(network.network_tip.slot_number)})</span>
                    </Chip>
                  </div>
                </div>
              </div>
            </div>
                    
            <div className="col-span-2 row-span-3 p-4 overview-card flex-col break-words">
              <AdaPriceChart adaPriceData={adaData} />
            </div>

            <div className="col-span-2 row-span-2 p-4 overview-card flex-col gap-2 break-words justify-between">
              <div>
                <div className="flex gap-1 items-center">
                  <span className="section-headline">Recent Transactions</span>
                  <TransactionIcon className="text-white" width={20} height={20} />
                </div>
                
                  <ScrollShadow className="h-52 overflow-x-hidden" size={20}>
                    {
                      transactions && transactions.map((tx, i) => 
                        <TxHistoryEntry key={"transaction" + i} aria-label={"transaction" + i} transaction={tx} />
                      )
                    }
                  </ScrollShadow>
              </div>
              <div className="flex items-center text-right justify-end">
                <Link id="transactions" color='secondary' className='wallet-nav-link' href="/me/transactions" onPress={() => setActiveItem("transactions")}>
                  View all transactions
                  <ArrowIcon width={16} height={16} className='mb-0.5 rotate-45' />
                </Link>
              </div>
            </div>
                    
            <div className="col-span-2 row-span-2 p-4 overview-card flex-col break-words">
              <div className="flex gap-0.5 items-center">
                <span className="section-headline">Staking Overview</span>
                <StakingIcon className="text-white" width={20} height={20} />
              </div>

              {
                selectedWallet.delegation.active.status !== DelegationStatus.NotDelegating &&
                <div className="mt-2">
                  <div>
                    <Link color='secondary' className='wallet-nav-link absolute top-2 right-2' href={poolData.url} isExternal>
                      <ExternalLinkIcon width={18} height={18} />
                    </Link>
                    <div className="flex gap-3 items-center">
                      <Image
                        alt={poolData.name}
                        height={50}
                        radius="sm"
                        src={poolData.img}
                        width={50}
                      />
                      <div className="flex flex-col">
                        <span>{extractTicker(poolData.name, true)}</span>
                        <span>{extractTicker(poolData.name, false)}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-1">
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
                  <Divider className="mb-2" />
                  <div className="flex gap-3 justify-between h-full max-h-28">
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
                    <Divider orientation="vertical" />
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
                </div>
              }
              {
                selectedWallet.delegation.active.status === DelegationStatus.NotDelegating && (!selectedWallet.delegation.next[0] 
                  || selectedWallet.delegation.next[0].status === DelegationStatus.NotDelegating) &&
                <div className="flex justify-center items-center w-full h-full">
                  <span>You are currently not staking to a pool.</span>
                  <div className="h-full absolute top-0 right-0 p-4 flex flex-col justify-between items-end">
                    <span className="text-center">You can earn up to ~3% APY on <br></br> your ADA by staking to a stake pool.</span>
                    <Link id="staking" color='secondary' className='wallet-nav-link' href="/me/staking" onPress={() => setActiveItem("staking")}>
                      Stake to a pool
                      <ArrowIcon width={16} height={16} className='mb-0.5 rotate-45' />
                    </Link>
                  </div>
                </div>
              }
              {
                selectedWallet.delegation.active.status === DelegationStatus.NotDelegating && selectedWallet.delegation.next[0] 
                  && selectedWallet.delegation.next[0].status !== DelegationStatus.NotDelegating &&
                <div className="flex flex-col justify-center items-center w-full h-full">
                  <span>Your delegation starts in epoch {selectedWallet.delegation.next[0].changes_at.epoch_number}.</span>
                  <span>The epoch starts at {parseDateTime(selectedWallet.delegation.next[0].changes_at.epoch_start_time)}</span>
                </div>
              }
            </div>

            <div className="col-span-1 row-span-2 p-4 overview-card flex-col break-words">
              <div className="flex gap-0.5 items-center">
                <span className="section-headline">Actions</span>
                <LightningIcon className="text-white" width={20} height={20} />
              </div>
              
              <div className="adaAddress">
                <Snippet 
                  symbol="" 
                  tooltipProps={{
                    className: "dark"
                  }}
                  codeString={address?.id}
                  size="sm"
                >
                  {windowWidth > 1450 ? formatAdaAddress(address?.id, 8) : formatAdaAddress(address?.id, 4)}
                </Snippet>
              </div>

              <div className="absolute bottom-0 left-0 p-4 w-full">
                <div className="quickaction-container">
                  <QRCodeSVG className="qrcode" value={address?.id} includeMargin size={windowWidth <= 1630 ? 70 : 110 } />
                  <div className="flex flex-col gap-4 justify-between">
                    <SendAdaModal wallet={selectedWallet} />
                    <Button size="md" color="secondary" variant="ghost" aria-label='Swap ADA'>
                      <span className="flex gap-0.5 items-center">
                        Swap ADA
                        <SwapIcon width={16} height={16} />
                      </span>
                    </Button>
                  </div>
                </div>
              </div>

            </div> 
          </div>
        </div>
      }
    </>
  );
}