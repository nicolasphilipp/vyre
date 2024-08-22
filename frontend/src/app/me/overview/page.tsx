'use client';

import CreateWallet from "@/components/CreateWallet";
import { FireIcon } from "@/components/icons/FireIcon";
import { HelpIcon } from "@/components/icons/HelpIcon";
import SelectWallet from "@/components/SelectWallet";
import WalletNavBar from "@/components/WalletNavBar";
import { Divider, Link} from '@nextui-org/react';
import useWalletStore from "@/model/WalletState";
import { getAddress, syncWallet } from '@/services/WalletService';
import { useEffect, useState } from "react";
import { Wallet } from "@/model/Wallet";
import { Address } from "@/model/Address";

export default function Home() {
  const wallets = useWalletStore((state) => state.wallets);
  const update = useWalletStore((state) => state.update);
  const [selectedWallet, setSelectedWallet] = useState(wallets.filter(w => w.isSelected)[0]);
  const [address, setAddress] = useState({} as Address);

  useEffect(() => {
    for(let i = 0; i < wallets.length; i++) {
      if(wallets[i].isSelected) {
        setSelectedWallet(wallets[i]);

        getAddress(wallets[i].id)
          .then(res => {
            let jsonRes = JSON.parse(res);
            setAddress(jsonRes.address);
          });
      }
    }
  }, [wallets]);

  /*useEffect(() => {
    setInterval(() => {
      for(let i = 0; i < wallets.length; i++) {

        syncWallet(wallets[i].id)
          .then(res => {
            let jsonRes = JSON.parse(res);
            update(wallets[i].id, jsonRes.wallet);
          });
      }
    }, 5000);
  }, []);*/

  return (
    <>
      <a href="/" className="text-white absolute">
        <FireIcon className="mt-4 ml-4" width={72} height={72} />
      </a>
      <div className="absolute right-0 top-0 mt-4 mr-4 flex flex-row gap-2 items-center">
        <HelpIcon width={24} height={24} />
        <span>Need help?</span>
      </div>

      <div className="h-screen w-screen flex flex-col justify-center items-center">
        <div className="wallet-overview-container">
          <WalletNavBar />
          
          {
            wallets.length <= 0 &&
            <div className='flex flex-col gap-4 justify-center items-center'>
              {wallets.length == 0 && <span className="text-center">You currently do not have any wallets saved. <br></br>Start by creating or restoring one.</span> }
              <CreateWallet />
            </div>
          }
          {wallets.length > 0 && 
            <div className="wallet-overview-content">
              <div className="grid h-full w-full gap-4 grid-cols-4 grid-rows-4 rounded-lg">
                
                <div className="col-span-2 row-span-4 p-4 overview-card">
                  { selectedWallet && <span className="text-2xl text-bold">{selectedWallet.name}</span>}
                  {selectedWallet && <span>{selectedWallet.id}</span>}
                  <span>₳ {selectedWallet && <span> {selectedWallet.balance.total.quantity}</span>}</span>
                  <br></br>
                  {address && <span>{address.id}</span>}
                  <Divider className="my-4" />
                  <div>
                    Balance
                  </div>
                </div>
                  
                <div className="col-span-2 row-span-3 overview-card">
                  <div>
                    Chart
                  </div>
                </div>
                  
                <div className="col-span-2 row-span-1 overview-card">
                  <div>
                    QR Code
                  </div>
                </div>
                  
              </div>
            </div>
          }
        </div>
        <span id="copyright" className="absolute bottom-4">© Vyre 2024</span>
      </div>
    </>
  );
}