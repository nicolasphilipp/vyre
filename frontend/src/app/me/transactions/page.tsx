'use client';

import { LightningIcon } from "@/components/icons/LightningIcon";
import { SwapIcon } from "@/components/icons/SwapIcon";
import SendAdaModal from "@/components/SendAdaModal";
import { Wallet } from "@/model/Wallet";
import useWalletStore from "@/model/WalletState";
import { Button, Divider } from "@nextui-org/react";
import { useEffect, useState } from "react";
import { InsightsIcon } from "@/components/icons/InsightsIcon";
import React from "react";
import TxCountChart from "@/components/TxCountChart";
import TxSection from "@/components/TxSection";

export default function Home() {
  const { wallets, selected } = useWalletStore();
  const [selectedWallet, setSelectedWallet] = useState({} as Wallet);

  useEffect(() => {

    for(let i = 0; i < wallets.length; i++) {
      if(wallets[i].id === selected) {
        setSelectedWallet(wallets[i]);
      }
    }
  }, [selected]);

  // TODO pass function to sendAdaModal -> that executes searchTxHistory, fix bug where transaction shows not up in history after submitting 

  return (
    <>
      <div className="wallet-overview-content">
        <div className="grid h-full w-full gap-4 grid-cols-5 grid-rows-5 rounded-lg"> 
          <div className="col-span-3 row-span-5 flex-col">
            <TxSection />
          </div>

          <div className="col-span-2 row-span-4 p-4 overview-card flex-col break-words">
            <div className="flex gap-1 items-center">
              <span className="section-headline">Insights</span>
              <InsightsIcon className="text-white" width={20} height={20} />
            </div>

            {
              selectedWallet && selectedWallet.id &&
                <>
                  <TxCountChart wallet={selectedWallet} />
                  <Divider className="mb-3" />
                </>
            }
            {
              selectedWallet && selectedWallet.id &&
                <>
                  <TxCountChart wallet={selectedWallet} />
                </>
            }
          </div>

          <div className="col-span-2 row-span-1 p-4 overview-card flex-col break-words">
            <div className="flex gap-0.5 items-center">
              <span className="section-headline">Actions</span>
              <LightningIcon className="text-white" width={20} height={20} />
            </div>

            <div className="flex gap-4 mt-3">
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
    </>
  );
}