import { Button, Link, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from '@nextui-org/react';
import { FireIcon } from './icons/FireIcon';
import { BurgerMenuIcon } from './icons/BurgerMenuIcon';
import CreateWallet from './CreateWallet';
import SelectWallet from './SelectWallet';
import { useEffect } from "react";
import { ArrowIcon } from './icons/ArrowIcon';

export default function WalletNavBar() {
  useEffect(() => {
    let lastIndex = window.location.href.lastIndexOf("/");
    let currentRoute = window.location.href.substring(lastIndex + 1);

    let navLink = document.getElementById(currentRoute);
    navLink?.classList.add("wallet-nav-link-active");
  });

  return (
    <div className="wallet-nav-container">
      <div>
        <SelectWallet />
      </div>
      <div className="nav-link-container">
        <span className='flex flex-row items-center'>
          <ArrowIcon className="text-white" width={16} height={16} />
          <Link id="overview" color='secondary' className='wallet-nav-link' href="/me/overview">Overview</Link>
        </span>
        
        <Link id="transactions" color='secondary' className='wallet-nav-link' href="/me/transactions">Transactions</Link>
        <Link id="staking" color='secondary' className='wallet-nav-link' href="/me/stake">Staking</Link>
        <Link id="settings" color='secondary' className='wallet-nav-link' href="/me/settings">Settings</Link>
      </div>
      <div>
        <CreateWallet />
      </div>
    </div>
  );
}
