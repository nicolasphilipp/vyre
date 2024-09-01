import { create } from "zustand";
import { Wallet } from "./Wallet";
import { persist } from "zustand/middleware";

interface WalletState {
    wallets: Wallet[];
    add: (toAdd: Wallet) => void;
    remove: (toRemove: Wallet) => void;
    update: (id: string, toUpdate: Wallet) => void;
    selected: string;
    setSelected: (value: string) => void;
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
            update: (id, toUpdate) => set((state) => {
                let index = -1;
                state.wallets.forEach((wallet, ind) => {
                    if(wallet.id === id) {
                        index = ind; 
                        return;
                    }
                });

                if(index !== -1){
                    state.wallets[index] = toUpdate;
                }
                return { wallets: state.wallets };
            }),
            selected: "",
            setSelected: (value) => set({ selected: value })
        }),
        {
            name: 'wallet-store'
        }
    )
);

export default useWalletStore;