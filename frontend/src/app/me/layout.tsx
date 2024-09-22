'use client';

import { DangerIcon } from "@/components/icons/DangerIcon";
import { FireIcon } from "@/components/icons/FireIcon";
import { HelpIcon } from "@/components/icons/HelpIcon";
import { SuccessIcon } from "@/components/icons/SuccessIcon";
import WalletNavBar from "@/components/WalletNavBar";
import { Spinner } from "@nextui-org/react";
import React from "react";
import { Toaster } from "react-hot-toast";

export default function PageLayout({ children }: Readonly<{children: React.ReactNode}>) {
  return (
    <div>
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 8000,
          style: {
            color: 'rgb(180, 180, 180)',
            borderRadius: '20px',
            background: 'rgba(30, 30, 30, 0.9)',
            border: '2px solid rgb(40, 40, 40)'
          },
          loading: {
            icon: <Spinner size="sm" color="secondary" />
          },
          success: {
            icon: <SuccessIcon width={16} height={16} className="text-success" />
          },
          error: {
            style: {
              //background: 'rgba(243, 18, 96, 0.5)',
              //border: '2px solid rgb(253, 28, 106)'
            },
            icon: <DangerIcon width={16} height={16} className="text-danger" />
          }
        }}
      />
      <a href="/" className="text-white absolute">
        <FireIcon className="mt-4 ml-4" width={72} height={72} />
      </a>
      <div className="absolute right-0 top-0 mt-4 mr-4 flex flex-row gap-2 items-center hidden">
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
        
        <span id="copyright" className="absolute bottom-2 left-4">© Vyre 2024</span>
      </div>
    </div>
  );
}
