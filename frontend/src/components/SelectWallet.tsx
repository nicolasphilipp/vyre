import React, { useEffect, useState } from "react";
import {Button, Select, SelectItem} from "@nextui-org/react";
import useWalletStore from "@/model/WalletState";
import { Wallet } from "@/model/Wallet";
import { RemoveIcon } from "./icons/RemoveIcon";
import { removeWallet } from "@/services/WalletService";

export default function SelectWallet() {
    const wallets = useWalletStore((state) => state.wallets);
    const update = useWalletStore((state) => state.update);
    const remove = useWalletStore((state) => state.remove);
    const [selected, setSelected] = useState("");

    useEffect(() => {
        let selectedWallet = wallets.filter(wallet => wallet.isSelected === true)[0];
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

    function removeLocalWallet(wallet: Wallet): void {
        removeWallet(wallet.id);
        remove(wallet);
    }

    return (
        <>
            <Select
                size="md"
                color="secondary"
                variant="bordered"
                items={wallets}
                placeholder="Select a wallet"
                labelPlacement="outside"
                selectedKeys={[selected]}
                onChange={handleSelectionChange}
                classNames={{
                    base: "max-w-xs",
                    popoverContent: "pop-content"
                }}
                renderValue={(items) => {
                    return items.map((item) => (
                        <div key={item.key} className="flex items-center gap-2">
                            <div className="flex flex-col">
                                <span className="text-md text-white">{item.data?.name}</span>
                                <span className="text-tiny">({item.data?.id})</span>
                            </div>
                        </div>
                    ));
                }}
            >
            {(wallet) => (
                <SelectItem hideSelectedIcon color="secondary" key={wallet.id} textValue={wallet.name} endContent={
                    <Button size="sm" isIconOnly color="danger" onClick={() => removeLocalWallet(wallet)} aria-label="Remove wallet"><RemoveIcon /></Button>}>
                    <div className="flex gap-2 items-center">
                        <div className="flex flex-col">
                            <span className="text-md text-white">{wallet.name}</span>
                            <span className="text-tiny">{wallet.id}</span>
                        </div>
                        
                    </div>
                </SelectItem>
            )}
            </Select>
        </>
    );
}
