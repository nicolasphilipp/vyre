'use client';

import CreateWallet from "@/components/CreateWallet";
import { Button, Divider, Link, Snippet, Tooltip} from '@nextui-org/react';
import useWalletStore from "@/model/WalletState";
import { getAddress, syncWallet } from '@/services/WalletService';
import { useEffect, useState } from "react";
import { Wallet } from "@/model/Wallet";
import { Address } from "@/model/Address";
import { DangerIcon } from "@/components/icons/DangerIcon";
import { getAdaStats } from "@/services/CoinCapService";
import { AdaData } from "@/model/AdaData";
import OverviewPieChart from "@/components/OverviewPieChart";
import { formatNumber, formatString } from "@/services/TextFormatService";
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

export default function Home() {
  const { wallets, add, remove, update, selected, setSelected } = useWalletStore();

  const [selectedWallet, setSelectedWallet] = useState({} as Wallet);
  const [address, setAddress] = useState({} as Address);
  const loveLaceToAda = 1000000;

  const [adaData, setAdaData] = useState({} as AdaData);

  const pieChartData = [
    { name: 'ADA', totalCount: 100, value: 400, ratio: 0.25 },
    { name: 'SNEK', totalCount: 100, value: 300, ratio: 0.25 },
    { name: 'AXS', totalCount: 100, value: 900, ratio: 0.25 },
    { name: 'TLS', totalCount: 100, value: 200, ratio: 0.25 }
  ];

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

  // TODO: fix bug when creating wallet from button inside content div, the mnemonic modal is not showing
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
        <div className="wallet-overview-content text-medium">
          <div className="grid h-full w-full gap-4 grid-cols-5 grid-rows-5 rounded-lg"> 

            <div className="col-span-2 row-span-3 p-4 overview-card flex-col break-words">
              <div className="flex justify-between">
                <span className="text-xl text-white">Wallet Overview</span>

                <div className="flex gap-2">
                  <EditWalletModal id={selectedWallet?.id} value={selectedWallet?.name} />
                  <RemoveWalletModal wallet={selectedWallet} />
                </div>
              </div>

              <div className="flex justify-center">
                <OverviewPieChart data={pieChartData} />
              </div>

              <div className="flex flex-row justify-between mt-2">
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
                <div className="flex flex-row gap-4 justify-between w-6/12">
                  <span>{selectedWallet && <span>₳ {formatNumber(selectedWallet.balance.available.quantity / loveLaceToAda)}</span>}</span>
                  <span>0.00 €</span>
                </div>
              </div>

              <div className="flex flex-row justify-between">
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
                <div className="flex flex-row gap-4 justify-between w-6/12">
                  <span>{selectedWallet && <span>₳ {formatNumber(selectedWallet.balance.reward.quantity / loveLaceToAda)}</span>}</span>
                  <span>250.99 €</span>
                </div>
              </div>

              <div className="flex flex-row justify-between">
                <span>Total</span>
                <div className="flex flex-row gap-4 justify-between w-6/12">
                  <span>{selectedWallet && <span>₳ {formatNumber(selectedWallet.balance.total.quantity / loveLaceToAda)}</span>}</span>
                  <span>10,346.12 €</span>
                </div>
              </div>

              <Divider className="my-4" />
              <div>
                <span>Native Tokens will be shown here</span>
              </div>

            </div>
                    
            <div className="col-span-3 row-span-4 overview-card flex-col break-words items-center justify-center">
              <span>{adaData.priceUsd ? Math.round(parseFloat(adaData.priceUsd) * 10000) / 10000 : "0"}</span>
            </div>

            <div className="col-span-1 row-span-2 p-4 overview-card flex-col break-words justify-between">
              <div>
                <div className="flex gap-1 items-center">
                  <span className="text-xl text-white">Recent Transactions</span>
                  <TransactionIcon className="text-white" width={16} height={16} />
                </div>

                <TransactionHistoryEntry date="08.08." amount={500.33} fee={0} currency="ADA" />
                <TransactionHistoryEntry date="11.08." amount={-1123.79} fee={0.65} currency="ADA" />
                <TransactionHistoryEntry date="11.08." amount={-1123.79} fee={0.65} currency="ADA" />
                
              </div>
              <Link id="transactions" color='secondary' className='wallet-nav-link' href="/me/transactions" onClick={() => setActiveItem("transactions")}>
                View all transactions
                <ArrowIcon width={16} height={16} className='mb-0.5 rotate-45' />
              </Link>
            </div>
                    
            <div className="col-span-1 row-span-2 p-4 overview-card flex-col break-words justify-center items-center">
              <div className="flex flex-col gap-4 justify-center items-center">
                <QRCodeSVG value={address?.id} includeMargin size={140} />
                <Snippet 
                  symbol="" 
                  tooltipProps={{
                    className: "dark"
                  }}
                  codeString={address?.id}
                >
                  {formatString(address?.id)}
                </Snippet>
              </div>
            </div>

            <div className="col-span-3 row-span-1 p-4 overview-card flex-col break-words">
              <div className="flex justify-between">
                <div className="flex gap-1 items-center">
                  <span className="text-xl text-white">Staking Overview</span>
                  <StakingIcon className="text-white" width={16} height={16} />
                </div>
                <span>You can earn up to ~3% APY on your ADA by staking to a stake pool.</span>
              </div>
              <div>
                <span>{selectedWallet && <span>Status: {selectedWallet.delegation.active.status}</span>}</span>
              </div>
            </div> 
          </div>
        </div>
      }
    </>
  );
}