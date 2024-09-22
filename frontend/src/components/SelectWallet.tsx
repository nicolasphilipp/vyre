import React, { useEffect, useState } from "react";
import {Select, SelectItem} from "@nextui-org/react";
import useWalletStore from "@/model/WalletState";
import { Wallet } from "@/model/Wallet";
import { formatNumber } from "@/services/TextFormatService";

export default function SelectWallet() {
    const wallets = useWalletStore(state => state.wallets);
    const { update, selected, setSelected } = useWalletStore();
    const [selectedWallet, setSelectedWallet] = useState({} as Wallet);  

    const loveLaceToAda = 1000000;
    const adaPrice = 0.32;

    useEffect(() => {
        let selectedWallet = wallets.filter(w => w.isSelected)[0];
        if(selectedWallet) {
            setSelected(selectedWallet.id);
            setSelectedWallet(selectedWallet);
        }
    }, [wallets]);

    const handleSelectionChange = (e: { target: { value: React.SetStateAction<string>; }; }) => {
        setSelected(e.target.value as string);

        for(let i = 0; i < wallets.length; i++) {
            let wallet: Wallet = wallets[i];
            if(wallet.id === e.target.value){
                wallet.isSelected = true;
            } else {
                wallet.isSelected = false;
            }
            update(wallet.id, wallet);
        } 
    };

    return (
        <>
            <Select
                aria-label="Select wallet"
                size="md"
                color="secondary"
                variant="bordered"
                placeholder="Select a wallet"
                labelPlacement="outside"
                selectedKeys={[selected]}
                onChange={handleSelectionChange}
                classNames={{
                    base: "max-w-36",
                    popoverContent: "pop-content",
                    value: "text-white"
                }}
            >
                {
                    wallets.map(wallet => (
                        <SelectItem color="secondary" key={wallet.id} textValue={wallet.name}>
                            <div className="flex items-center justify-between">
                                <div className="flex flex-col">
                                    <span className="text-md text-white">{wallet.name}</span>
                                    {
                                        wallet.balance &&
                                        <span>{formatNumber((wallet.balance.total.quantity / loveLaceToAda) * adaPrice, 2)} €</span>
                                    }
                                </div>
                            </div>
                        </SelectItem>
                    ))
                }
            </Select>
        </>
    );
}