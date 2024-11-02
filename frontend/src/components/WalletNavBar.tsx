import { Button, Link, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Chip } from '@nextui-org/react';
import { FireIcon } from './icons/FireIcon';
import { BurgerMenuIcon } from './icons/BurgerMenuIcon';
import CreateWallet from './CreateWallet';
import SelectWallet from './SelectWallet';
import { useEffect, useState } from "react";
import { ArrowIcon } from './icons/ArrowIcon';
import { TransactionIcon } from './icons/TransactionIcon';
import { SettingsIcon } from './icons/SettingsIcon';
import { StakingIcon } from './icons/StakingIcon';
import React from 'react';
import { setActiveItem } from '@/services/NavbarHelperService';
import { NetworkInformation } from '@/model/NetworkInformation';
import { getNetworkInformation, getRemainingEpochTime } from '@/services/NetworkService';

export default function WalletNavBar() {
  const [network, setNetwork] = useState({} as NetworkInformation);

  useEffect(() => {
    let lastIndex = window.location.href.lastIndexOf("/");
    let currentRoute = window.location.href.substring(lastIndex + 1);

    let navLink = document.getElementById(currentRoute);
    navLink?.classList.add("wallet-nav-link-active");
  }, []);

  useEffect(() => {
    getNetworkInformation()
      .then(res => {
        setNetwork(res.information as NetworkInformation);
      });
  }, []);


  return (
    <div className="wallet-nav-container">
      <SelectWallet />
      <div className="nav-link-container">
        <Link id="overview" color='secondary' className='wallet-nav-link' href="/me/overview" onPress={() => setActiveItem("overview")}>
          <ArrowIcon width={16} height={16} className='mr-0.5 -rotate-45' />
          Overview
        </Link>
        <Link id="transactions" color='secondary' className='wallet-nav-link' href="/me/transactions" onPress={() => setActiveItem("transactions")}> 
          <TransactionIcon width={16} height={16} className='mr-1' />
          Transactions
        </Link>
        <Link id="staking" color='secondary' className='wallet-nav-link' href="/me/staking" onPress={() => setActiveItem("staking")}>
          <StakingIcon width={16} height={16} className='mr-1' />
          Staking
        </Link>
        <Link id="settings" color='secondary' className='wallet-nav-link' href="/me/settings" onPress={() => setActiveItem("settings")}>
          <SettingsIcon width={16} height={16} className='mr-1' />
          Settings
        </Link>
      </div>
      <div>
        <Chip variant="flat" radius="sm" size="md" style={{ border: "1px solid rgba(63, 63, 70, 0.5)", background: "rgba(63, 63, 70, 0.3)" }}>
          <span>Epoch: {network.network_tip && network.network_tip.epoch_number} - Slot: {network.network_tip && network.network_tip.slot_number} / 86400 ({network.network_tip && getRemainingEpochTime(network.network_tip.slot_number)})</span>
        </Chip>
      </div>
    </div>
  );
}
