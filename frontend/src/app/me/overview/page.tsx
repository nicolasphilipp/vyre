'use client';

import CreateWallet from "@/components/CreateWallet";
import { Divider, Tooltip} from '@nextui-org/react';
import useWalletStore from "@/model/WalletState";
import { getAddress, syncWallet } from '@/services/WalletService';
import { useEffect, useState } from "react";
import { Wallet } from "@/model/Wallet";
import { Address } from "@/model/Address";
import { DangerIcon } from "@/components/icons/DangerIcon";
import { getAdaStats } from "@/services/CoinCapService";
import { AdaData } from "@/model/AdaData";
import OverviewPieChart from "@/components/OverviewPieChart";
import { formatNumber } from "@/services/NumberFormatService";

export default function Home() {
  const wallets = useWalletStore((state) => state.wallets);
  const update = useWalletStore((state) => state.update);
  const [selectedWallet, setSelectedWallet] = useState(wallets.filter(w => w.isSelected)[0]);
  const [address, setAddress] = useState({} as Address);
  const loveLaceToAda = 1000000;

  const [adaData, setAdaData] = useState({} as AdaData);

  const pieChartData = [
    { name: 'ADA', totalCount: 100, value: 400, ratio: 0.25 },
    { name: 'SNEK', totalCount: 100, value: 300, ratio: 0.25 },
    { name: 'AXS', totalCount: 100, value: 900, ratio: 0.25 },
    { name: 'TLS', totalCount: 100, value: 200, ratio: 0.25 }
  ];

  useEffect(() => {
    getAdaStats()
      .then(res => {
        console.log(JSON.parse(res).data);
        setAdaData(JSON.parse(res).data);
      });
  }, []);
 
  useEffect(() => {
    for(let i = 0; i < wallets.length; i++) {
      if(wallets[i].isSelected) {
        setSelectedWallet(wallets[i]);

        getAddress(wallets[i].id)
          .then(res => {
            let jsonRes = JSON.parse(res);
            setAddress(jsonRes.address);
          });

          syncWallet(wallets[i].id)
            .then(res => {
              let jsonRes = JSON.parse(res);
  
              jsonRes.wallet.isSelected = wallets[i].isSelected;
              wallets[i] = jsonRes.wallet as Wallet;
            });
      }
    }
  }, [wallets]);

  useEffect(() => {
    setTimeout(() => {
      setInterval(() => {
        // TODO doesnt work -> wallets length 0 here

        for(let i = 0; i < wallets.length; i++) {
          syncWallet(wallets[i].id)
            .then(res => {
              let jsonRes = JSON.parse(res);
              jsonRes.wallet.isSelected = wallets[i].isSelected;
              wallets[i] = jsonRes.wallet as Wallet;
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
        <div className='flex flex-col gap-4 justify-center items-center'>
          {wallets.length <= 0 && <span className="text-center">You currently do not have any wallets saved. <br></br>Start by creating or restoring one.</span> }
          <CreateWallet />
        </div>
      }
      {wallets.length > 0 && 
        <div className="wallet-overview-content text-medium">
          <div className="grid h-full w-full gap-4 grid-cols-5 grid-rows-5 rounded-lg"> 

            <div className="col-span-2 row-span-3 p-4 overview-card break-words">
              <span className="text-xl text-white">Wallet Overview</span>
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
                <div className="flex flex-row gap-4 justify-between w-3/5">
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
                <div className="flex flex-row gap-4 justify-between w-3/5">
                  <span>{selectedWallet && <span>₳ {formatNumber(selectedWallet.balance.reward.quantity / loveLaceToAda)}</span>}</span>
                  <span>250.99 €</span>
                </div>
              </div>

              <div className="flex flex-row justify-between">
                <span>Total</span>
                <div className="flex flex-row gap-4 justify-between w-3/5">
                  <span>{selectedWallet && <span>₳ {formatNumber(selectedWallet.balance.total.quantity / loveLaceToAda)}</span>}</span>
                  <span>10,346.12 €</span>
                </div>
              </div>

              <Divider className="my-4" />
              <div>
                <span>Native Tokens will be shown here</span>
              </div>

            </div>
                    
            <div className="col-span-3 row-span-4 overview-card break-words items-center justify-center">
              <span>{Math.round(parseFloat(adaData.priceUsd) * 10000) / 10000}</span>
            </div>
                    
            <div className="col-span-2 row-span-2 p-4 overview-card break-words">
              <span className="text-xl text-white">Staking Overview</span>
              <div>
                <span>{selectedWallet && <span>Status: {selectedWallet.delegation.active.status}</span>}</span>
              </div>
            </div>

            <div className="col-span-3 row-span-1 overview-card break-words items-center justify-center">
              <div>
                Quick Actions
              </div>
            </div> 
          </div>
        </div>
      }
    </>
  );
}