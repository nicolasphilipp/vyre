import { Button, Link, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from '@nextui-org/react';
import { FireIcon } from './icons/FireIcon';
import { BurgerMenuIcon } from './icons/BurgerMenuIcon';
import CreateWallet from './CreateWallet';
import SelectWallet from './SelectWallet';
import { useEffect } from "react";
import { ArrowIcon } from './icons/ArrowIcon';
import { TransactionIcon } from './icons/TransactionIcon';
import { SettingsIcon } from './icons/SettingsIcon';
import { StakingIcon } from './icons/StakingIcon';

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
        <Link id="overview" color='secondary' className='wallet-nav-link' href="/me/overview">
          <ArrowIcon width={16} height={16} className='mr-0.5' />
          Overview
        </Link>
        <Link id="transactions" color='secondary' className='wallet-nav-link' href="/me/transactions"> 
          <TransactionIcon width={16} height={16} className='mr-1' />
          Transactions
        </Link>
        <Link id="staking" color='secondary' className='wallet-nav-link' href="/me/staking">
          <StakingIcon width={16} height={16} className='mr-1' />
          Staking
        </Link>
        <Link id="settings" color='secondary' className='wallet-nav-link' href="/me/settings">
          <SettingsIcon width={16} height={16} className='mr-1' />
          Settings
        </Link>
      </div>
      <div>
        <CreateWallet />
      </div>
    </div>
  );
}
