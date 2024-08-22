import { create } from "zustand";
import { Wallet } from "./Wallet";
import { persist } from "zustand/middleware";

interface WalletState {
    wallets: Wallet[];
    add: (toAdd: Wallet) => void;
    remove: (toRemove: Wallet) => void;
    update: (id: string, toUpdate: Wallet) => void;
}

const useWalletStore = create<WalletState>()(
    persist(
        (set) => ({
            wallets: [],
            add: (toAdd) => set((state) => ({
                wallets: [...state.wallets, toAdd], 
            })),
            remove: (toRemove) => set((state) => ({
                wallets: state.wallets.filter((wallet) => wallet.id !== toRemove.id), 
            })),
            update: (id, toUpdate) => set((state) => ({
                wallets: state.wallets.map((wallet) => wallet.id === id ? { ...wallet, value: toUpdate } : wallet),
            })) 
        }),
        {
            name: 'wallet-store'
        }
    )
);

export default useWalletStore;