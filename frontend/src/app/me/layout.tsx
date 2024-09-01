'use client';

import { FireIcon } from "@/components/icons/FireIcon";
import { HelpIcon } from "@/components/icons/HelpIcon";
import WalletNavBar from "@/components/WalletNavBar";
import React from "react";

export default function PageLayout({ children }: Readonly<{children: React.ReactNode}>) {
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
          <WalletNavBar />

          <div className="w-full h-full">
            {children}
          </div>

        </div>
        
        <span id="copyright" className="absolute bottom-2">© Vyre 2024</span>
      </div>
    </div>
  );
}
