'use client';

import { FireIcon } from "@/components/icons/FireIcon";
import { HelpIcon } from "@/components/icons/HelpIcon";
import WalletNavBar from "@/components/WalletNavBar";
import { Wallet } from "@/model/Wallet";
import useWalletStore from "@/model/WalletState";
import React from "react";

export const PageContext = React.createContext([] as Wallet[]);

export default function PageLayout({ children }: Readonly<{children: React.ReactNode}>) {
  const wallets = useWalletStore((state) => state.wallets);

  return (
    <div>
      <a href="/" className="text-white absolute">
        <FireIcon className="mt-4 ml-4" width={72} height={72} />
      </a>
      <div className="absolute right-0 top-0 mt-4 mr-4 flex flex-row gap-2 items-center">
        <HelpIcon width={24} height={24} />
        <span>Need help?</span>
      </div>
      <div className="h-screen w-screen flex flex-col justify-center items-center"> 
        <div className="wallet-overview-container">
          <PageContext.Provider value={wallets}><WalletNavBar /></PageContext.Provider>

          <div className="w-full h-full">
            <PageContext.Provider value={wallets}>{children}</PageContext.Provider>
          </div>

        </div>
        
        <span id="copyright" className="absolute bottom-2">© Vyre 2024</span>
      </div>
    </div>
  );
}
