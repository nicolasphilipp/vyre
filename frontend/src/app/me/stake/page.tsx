'use client';

import CreateWallet from "@/components/CreateWallet";
import SelectWallet from "@/components/SelectWallet";
import useWalletStore from "@/model/WalletState";

export default function Home() {
  const wallets = useWalletStore((state) => state.wallets);

  return (
    <div className='h-screen flex flex-col justify-center items-center gap-24'>
      <div className='flex flex-col gap-4 items-center'>
        {wallets.length > 0 ? <SelectWallet /> : <span className="text-center">You currently do not have any wallets saved. <br></br>Start by creating or restoring one.</span>}
        <CreateWallet />
      </div>
    </div>
  );
}