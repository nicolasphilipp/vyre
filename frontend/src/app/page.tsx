'use client';
import dynamic from 'next/dynamic';
import CreateWallet from '../components/CreateWallet';
import useWalletStore from '@/model/WalletState';
import { useEffect } from 'react';
import { Button, Link, Tooltip } from '@nextui-org/react';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import { redirect } from 'next/navigation';

const Spline = dynamic(() => import('@splinetool/react-spline'), {
  ssr: false,
});

export default function Home() {
  useEffect(() => {
    let menu = document.getElementById("menu") as HTMLElement;
    menu.onmousemove = e => {
      let cards = document.getElementsByClassName("menu-card") as HTMLCollectionOf<HTMLElement>;
      for(const card of cards) {
        const rect = card.getBoundingClientRect(), x = e.clientX - rect.left, y = e.clientY - rect.top;
        card.style.setProperty("--mouse-x", `${x}px`);
        card.style.setProperty("--mouse-y", `${y}px`);
      }
    }; 
  });

  return (
    <>
      <NavBar />
      <div className='flex flex-col items-center gap-24'>
        <div className='mt-32 flex flex-col items-center'>
          <h1 className='text-9xl text-white'>Vyre</h1>
          <span className='text-2xl mt-4'>Your Cardano journey starts here.</span>
          <Button color='secondary' className='mt-4'><Link className='text-white' href="/me/overview">Get started</Link></Button>
        </div>
        <div id="menu" className='menu'>
          <div className='flex flex-col gap-5'>
            <div className='menu-card'>
              <div className='menu-card-content'>
                <span className='text-md font-bold block'>Create ADA wallets and manage your existing wallets</span>
              </div>
            </div>
            <div className='menu-card'>
              <div className='menu-card-content'>
                <span className='text-md font-bold block'>Send and receive ADA</span>
              </div>
            </div>
          </div>
          <div className='flex flex-col gap-5'>
            <div className='menu-card'>
              <div className='menu-card-content'>
                <span className='text-md font-bold block'>Search stake pools and stake your ADA</span>
              </div>
            </div>
            <div className='menu-card'>
              <div className='menu-card-content'>
                <span className='text-md font-bold block'>Visualize your activity on the blockchain</span>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </>
    
  );
}


/*
      <div className='w-96 h-96'>
        <Spline scene="https://prod.spline.design/nI2tACYQ5gfjsH6K/scene.splinecode" />
      </div> */