'use client';

import "./overview.css";
import CreateWallet from "@/components/CreateWallet";
import { Button, Divider, Link, ScrollShadow, Snippet, Tooltip} from '@nextui-org/react';
import useWalletStore from "@/model/WalletState";
import { getAddress, syncWallet } from '@/services/WalletService';
import { useEffect, useState } from "react";
import { Wallet } from "@/model/Wallet";
import { Address } from "@/model/Address";
import { DangerIcon } from "@/components/icons/DangerIcon";
import { getAdaStats } from "@/services/CoinCapService";
import { AdaData } from "@/model/AdaData";
import OverviewPieChart from "@/components/OverviewPieChart";
import { formatAdaAddress, formatNumber, hexToAsciiString } from "@/services/TextFormatService";
import { EditIcon } from "@/components/icons/EditIcon";
import { RemoveIcon } from "@/components/icons/RemoveIcon";
import EditWalletModal from "@/components/EditWalletModal";
import RemoveWalletModal from "@/components/RemoveWalletModal";
import { QRCodeSVG } from "qrcode.react";
import { ArrowIcon } from "@/components/icons/ArrowIcon";
import { TransactionIcon } from "@/components/icons/TransactionIcon";
import { StakingIcon } from "@/components/icons/StakingIcon";
import React from "react";
import { setActiveItem } from "@/services/NavbarHelperService";
import TransactionHistoryEntry from "@/components/TransactionHistoryEntry";
import { LightningIcon } from "@/components/icons/LightningIcon";
import { IncreaseIcon } from "@/components/icons/IncreaseIcon";
import { SwapIcon } from "@/components/icons/SwapIcon";
import { SendIcon } from "@/components/icons/SendIcon";
import SendAdaModal from "@/components/SendAdaModal";

export default function Home() {
  const { wallets, add, remove, update, selected, setSelected } = useWalletStore();

  const [selectedWallet, setSelectedWallet] = useState({} as Wallet);
  const [address, setAddress] = useState({} as Address);
  const loveLaceToAda = 1000000;

  const [adaData, setAdaData] = useState({} as AdaData);
  const adaPrice = 0.32; // TODO only for testing

  const [windowWidth, setWindowWidth] = useState(typeof window !== "undefined" ? window.innerWidth : 0);

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

  /*useEffect(() => {
    getAdaStats()
      .then(res => {
        setAdaData(JSON.parse(res).data);
      });
  }, []);*/
 
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
            wallets[i] = res.wallet as Wallet;
          });
      }
    }

    setSelectedWallet(activeWallet);
  }, [selected]);

  useEffect(() => {
    setTimeout(() => {
      setInterval(() => {
        // TODO doesnt work -> wallets length 0 here

        for(let i = 0; i < wallets.length; i++) {
          syncWallet(wallets[i].id)
            .then(res => {
              res.wallet.isSelected = wallets[i].isSelected;
              wallets[i] = res.wallet as Wallet;
            });
        }
      }, 5000);
    }, 5000);
  }, []);

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
      {wallets.length > 0 && selectedWallet.id && 
        <div className="wallet-overview-content">
          <div className="grid h-full w-full gap-4 grid-cols-5 grid-rows-5 rounded-lg"> 

            <div className="col-span-2 row-span-3 p-4 overview-card flex-col break-words" style={{height: "460px"}}>
              <div className="flex justify-between">
                <span className="section-headline">Wallet Overview</span>

                <div className="flex flex-col gap-2 items-end">
                  <div className="flex gap-2">
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
              <ScrollShadow hideScrollBar size={20}>
                {
                  selectedWallet.assets.total.map((asset, i) => 
                    <>
                      <div key={"asset" + i} className="flex justify-between">
                        <span>{hexToAsciiString(asset.asset_name)} ({asset.quantity})</span>
                        <span>N/A €</span>
                      </div>
                      <div key={"asset" + i} className="flex justify-between">
                        <span>{hexToAsciiString(asset.asset_name)} ({asset.quantity})</span>
                        <span>N/A €</span>
                      </div>
                      <div key={"asset" + i} className="flex justify-between">
                        <span>{hexToAsciiString(asset.asset_name)} ({asset.quantity})</span>
                        <span>N/A €</span>
                      </div>
                      <div key={"asset" + i} className="flex justify-between">
                        <span>{hexToAsciiString(asset.asset_name)} ({asset.quantity})</span>
                        <span>N/A €</span>
                      </div>
                      <div key={"asset" + i} className="flex justify-between">
                        <span>{hexToAsciiString(asset.asset_name)} ({asset.quantity})</span>
                        <span>N/A €</span>
                      </div>
                      <div key={"asset" + i} className="flex justify-between">
                        <span>{hexToAsciiString(asset.asset_name)} ({asset.quantity})</span>
                        <span>N/A €</span>
                      </div>
                      <div key={"asset" + i} className="flex justify-between">
                        <span>{hexToAsciiString(asset.asset_name)} ({asset.quantity})</span>
                        <span>N/A €</span>
                      </div>
                    </>
                  )
                }
              </ScrollShadow>
            </div>
                    
            <div className="col-span-3 row-span-4 overview-card flex-col break-words items-center justify-center">
              <span>{adaData.priceUsd ? Math.round(parseFloat(adaData.priceUsd) * 10000) / 10000 : "0"}</span>
            </div>

            <div className="col-span-1 row-span-2 p-4 overview-card flex-col gap-2 break-words justify-between">
              <div>
                <div className="flex gap-1 items-center">
                  <span className="section-headline">Recent</span>
                  <TransactionIcon className="text-white" width={16} height={16} />
                </div>

                  <ScrollShadow className="h-52" hideScrollBar size={20}>
                    <TransactionHistoryEntry date="08.08." amount={500.33} fee={0} currency="ADA" />
                    <TransactionHistoryEntry date="11.08." amount={-1123.79} fee={0.65} currency="ADA" />
                    <TransactionHistoryEntry date="11.08." amount={-1123.79} fee={0.65} currency="ADA" />
                    <TransactionHistoryEntry date="11.08." amount={-1123.79} fee={0.65} currency="ADA" />
                    <TransactionHistoryEntry date="11.08." amount={-1123.79} fee={0.65} currency="ADA" />
                    <TransactionHistoryEntry date="11.08." amount={-1123.79} fee={0.65} currency="ADA" />
                    <TransactionHistoryEntry date="11.08." amount={-1123.79} fee={0.65} currency="ADA" />
                    <TransactionHistoryEntry date="11.08." amount={-1123.79} fee={0.65} currency="ADA" />
                    <TransactionHistoryEntry date="11.08." amount={-1123.79} fee={0.65} currency="ADA" />
                    <TransactionHistoryEntry date="11.08." amount={-1123.79} fee={0.65} currency="ADA" />
                  </ScrollShadow>
                
              </div>
              <div className="flex items-center text-right justify-end">
                <Link id="transactions" color='secondary' className='wallet-nav-link' href="/me/transactions" onClick={() => setActiveItem("transactions")}>
                  View all
                  <ArrowIcon width={16} height={16} className='mb-0.5 rotate-45' />
                </Link>
              </div>
            </div>
                    
            <div className="col-span-1 row-span-2 p-4 overview-card flex-col break-words">
              <div className="flex gap-0.5 items-center">
                <span className="section-headline">Actions</span>
                <LightningIcon className="text-white" width={16} height={16} />
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

            <div className="col-span-3 row-span-1 p-4 overview-card flex-col break-words">
              <div>
                <div className="flex gap-1 items-center">
                  <span className="section-headline">Staking Overview</span>
                  <StakingIcon className="text-white" width={16} height={16} />
                </div>
              </div>
              <div>
                <span>{selectedWallet && <span>Status: {selectedWallet.delegation.active.status}</span>}</span>
              </div>

              <div className="h-full absolute top-0 right-0 p-4 flex flex-col justify-between items-end">
                <span className="text-center">You can earn up to ~3% APY on <br></br> your ADA by staking to a stake pool.</span>
                <Link id="staking" color='secondary' className='wallet-nav-link' href="/me/staking" onClick={() => setActiveItem("staking")}>
                  Stake to a pool
                  <ArrowIcon width={16} height={16} className='mb-0.5 rotate-45' />
                </Link>
              </div>
            </div> 
          </div>
        </div>
      }
    </>
  );
}