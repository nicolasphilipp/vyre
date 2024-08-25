import React, { useEffect, useState } from "react";
import {Button, Select, SelectItem} from "@nextui-org/react";
import useWalletStore from "@/model/WalletState";
import { Wallet } from "@/model/Wallet";
import { RemoveIcon } from "./icons/RemoveIcon";
import { formatNumber } from "@/services/TextFormatService";
import { EditIcon } from "./icons/EditIcon";
import EditWalletModal from "./EditWalletModal";

interface ValueProps {
    wallets: Wallet[];
}

const SelectWallet: React.FC<ValueProps> = ({ wallets }) => {
    const update = useWalletStore((state) => state.update);
    const [selected, setSelected] = useState("");

    useEffect(() => {
        let selectedWallet = wallets.filter(w => w.isSelected)[0];
        if(selectedWallet) {
            setSelected(selectedWallet.id);
        }
    });

    const handleSelectionChange = (e: { target: { value: React.SetStateAction<string>; }; }) => {
        setSelected(e.target.value);

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
                items={wallets}
                placeholder="Select a wallet"
                labelPlacement="outside"
                selectedKeys={[selected]}
                onChange={handleSelectionChange}
                classNames={{
                    base: "max-w-36",
                    popoverContent: "pop-content"
                }}
                renderValue={(items) => {
                    return items.map((item) => (
                        <div key={item.key}>
                            <span className="text-md text-white">{item.data?.name}</span>
                        </div>
                    ));
                }}
            >
            {(wallet) => (
                <SelectItem hideSelectedIcon color="secondary" key={wallet.id} textValue={wallet.name}>
                    <div className="flex items-center justify-between">
                        <div className="flex flex-col">
                            <span className="text-md text-white">{wallet.name}</span>
                            <span>{formatNumber(1800)} €</span>
                        </div>
                    </div>
                </SelectItem>
            )}
            </Select>
        </>
    );
}

export default SelectWallet;