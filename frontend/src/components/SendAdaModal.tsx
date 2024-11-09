import {Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure, Input, Divider, Tooltip, Select, SelectItem} from "@nextui-org/react";
import { useEffect, useRef, useState } from 'react';

import { SendIcon } from './icons/SendIcon';
import { formatNumber } from "@/services/TextFormatService";
import { Wallet } from "@/model/Wallet";
import useWalletStore from "@/model/WalletState";
import { ArrowIcon } from "./icons/ArrowIcon";
import { DangerIcon } from "./icons/DangerIcon";
import { estimateFees, submitTx } from "@/services/TxService";
import { Transaction, TxFees } from "@/model/Transaction";
import toast from "react-hot-toast";
import { adaPrice, loveLaceToAda } from "@/Constants";
import { getAddress, syncWallet } from "@/services/WalletService";
import React from "react";
import { EyeIcon } from "./icons/EyeIcon";
import { EyeSlashIcon } from "./icons/EyeSlashIcon";

interface ValueProps {
    wallet: Wallet;
}

const SendAdaModal: React.FC<ValueProps> = ({ wallet }) => {
    const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
    const wallets = useWalletStore(state => state.wallets.filter(w => w.id !== wallet.id));
    const { update } = useWalletStore();

    const [selectedId, setSelectedId] = useState("");
    const [selectedInternal, setSelectedInternal] = useState({} as Wallet);

    const [receiver, setReceiver] = useState("");
    const [receiverTouched, setReceiverTouched] = useState(false);
    const [receiverFromSelect, setReceiverFromSelect] = useState(false);
    const [prevReceiver, setPrevReceiver] = useState("");

    const [amount, setAmount] = useState("");
    const [amountTouched, setAmountTouched] = useState(false);
    const [estimatedFees, setEstimatedFees] = useState(0);

    const [passphrase, setPassphrase] = useState("");
    const [passTouched, setPassTouched] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const toggleVisibility = () => setIsVisible(!isVisible);

    const [submit, setSubmit] = useState(false);
    const firstRender = useRef(true);

    const handleSelectionChange = (e: { target: { value: React.SetStateAction<string>; }; }) => {
        setSelectedId(e.target.value);
        setSelectedInternal(wallets.filter(w => w.id === e.target.value)[0]);
    };

    useEffect(() => {
        if(selectedInternal && selectedInternal.address) {
            setReceiverTouched(true);
            setReceiver(selectedInternal.address.id);
            setPrevReceiver(selectedInternal.address.id);
            setReceiverFromSelect(true);
        } else {
            if(receiver === prevReceiver) {
                setReceiver("");
            }
        }
    }, [selectedInternal]);

  function isAmountInvalid(): boolean {
    return amountTouched && (getTxAmount() > wallet.balance.available.quantity / loveLaceToAda || getTxAmount() <= 0);
  }

  function isReceiverInvalid(): boolean {
    return receiverTouched && isAddressInvalid(receiver);
  }

  useEffect(() => {
    if(isAmountInvalid()) {
        document.getElementById("amount")?.classList.add("text-danger");
        setEstimatedFees(0);
    } else {
        document.getElementById("amount")?.classList.remove("text-danger");
    }

    if((receiverTouched && !isReceiverInvalid()) && (amountTouched && !isAmountInvalid())) {
        // TODO only call this after waiting 2 seconds after last amount change?

        estimateFees(wallet.id, receiver, getTxAmount())
            .then(res => {
                let fees = res.fees as TxFees;
                setEstimatedFees(fees.estimated_max.quantity / loveLaceToAda);
            });
    }
  }, [amount]);

  function setReceiveAddressTouched(inputAddress: string): void { 
    if(receiverFromSelect && selectedId !== "") {
        setSelectedId("");
    }
    if(receiverFromSelect && selectedInternal) {
        setSelectedInternal({} as Wallet);
    }

    setReceiverFromSelect(false);
    setReceiverTouched(true);
    setReceiver(inputAddress);
  }

  function setAmountInputTouched(inputAmount: string): void { 
    setAmountTouched(true);
    setAmount(inputAmount);
  }

  function setPassphraseTouched(inputPass: string): void { 
    setPassTouched(true);
    setPassphrase(inputPass);
  }

  function isAddressInvalid(address: string): boolean {
    if(!address || address === "") {
        return true;
    }
    // TODO call backend to check if address is invalid
    // or check only if address has the required length?
    return false;
  }

  function isSubmitDisabled(): boolean {
    return (!passTouched || passphrase.length < 10) || (!receiverTouched || isReceiverInvalid()) || (!amountTouched || isAmountInvalid());
  }

  function resetForm(): void {
    setReceiver("");
    setReceiverTouched(false);
    setAmount("");
    setAmountTouched(false);
    setPassTouched(false);
    setPassphrase("");
    setIsVisible(false);
    setSelectedId("");
    setSelectedInternal({} as Wallet);
    setReceiverFromSelect(false);
    setPrevReceiver("");
  }

  function submitInput(): void {
    setSubmit(!submit);
  } 

  function getTxAmount(): number {
    return parseFloat(amount) || 0;
  }

  function getResultBalance(): number {
    let bal = (wallet.balance.available.quantity / loveLaceToAda) - getTxAmount() - estimatedFees;
    return bal > 0 ? bal : 0;
  }

  useEffect(() => {
    if(firstRender.current) {
        firstRender.current = false;
        return;
    }
  
    toast.promise(new Promise((resolve, reject) =>  {
        submitTx(wallet.id, receiver, getTxAmount(), passphrase)
            .then(res => {
                if(res.error){
                    reject(res.error);
                } else {
                    let tx = res.transaction as Transaction;
                    console.log(tx);

                    syncWallet(wallet.id)
                        .then(async res => {
                            res.wallet.isSelected = wallet.isSelected;
                            res.wallet.lastSynced = new Date().toUTCString();

                            await getAddress(res.wallet.id)
                                .then(result => {
                                    res.wallet.address = result.address;
                                });

                            wallet = res.wallet as Wallet;
                            update(wallet.id, wallet);
                        });

                    resetForm();
                    onClose();
                    resolve("");
                }
            })
    }), 
    {
        loading: 'Submitting transaction...',
        success: 'Successfully submitted transaction.',
        error: 'Error submitting transaction.',
    });
  }, [submit]);
  
  return (
    <>
        <Button size="md" color="secondary" variant="ghost" aria-label='Send ADA' onPress={onOpen}>
            <span className="flex gap-0.5 items-center">
                send ADA
                <SendIcon width={16} height={16} />
            </span>
        </Button>
        <Modal isOpen={isOpen} onOpenChange={onOpenChange} onClose={resetForm} classNames={{ base: "dark" }}>
            <ModalContent>
            {(onClose) => (
                <>
                    <ModalHeader className="flex flex-col gap-1 text-white">Send ADA</ModalHeader>
                    <ModalBody>
                        <div className="flex items-center justify-between gap-4">
                            <Input
                                aria-label='Receiver'
                                isRequired
                                isClearable
                                type="text"
                                label="Receiver"
                                placeholder="Receiving address"
                                variant='bordered'
                                value={receiver}
                                onValueChange={setReceiveAddressTouched} 
                                isInvalid={isReceiverInvalid()}
                                errorMessage="Enter a valid address"
                                classNames={{input: "text-white"}} 
                            />

                            <Divider orientation="vertical" className="h-16" />

                            <Select
                                aria-label="Select wallet"
                                size="md"
                                color="secondary"
                                variant="bordered"
                                placeholder="Select a wallet"
                                labelPlacement="outside"
                                selectedKeys={[selectedId]}
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
                        </div>
                        
                        <Input
                            aria-label='Amount'
                            isRequired
                            type="number"
                            label="Amount"
                            placeholder="0.0000"
                            variant='bordered'
                            startContent={<><span id="amount" className="text-sm">₳</span></>}
                            value={amount}
                            onValueChange={setAmountInputTouched}
                            isInvalid={isAmountInvalid()}
                            errorMessage={getTxAmount() === 0 ? "Amount must be greater than 0" : "Amount can not be higher than your available balance! Available: ₳ " + formatNumber(wallet.balance.available.quantity / loveLaceToAda, 2)}
                        />

                        <Divider className="my-1" />

                        <div className="flex flex-col text-sm mt-1">
                            <div className="flex justify-between">
                                <span className="flex">
                                    Estimated fees: 
                                    <Tooltip
                                        color="warning"
                                        className='tooltip-container text-white'
                                        content={
                                            <div className="px-1 py-2">
                                            <div className="text-small font-bold text-success">Information</div>
                                                <div className="text-tiny">Cardano uses a transaction fee system that covers the processing <br></br> and long-term storage cost of transactions.</div>
                                            </div>
                                        }
                                        >
                                        <span><DangerIcon width={10} height={10} /></span>
                                    </Tooltip>
                                    </span>
                                <span className="text-danger">₳ {estimatedFees} (<ArrowIcon width={16} height={16} className='mb-0.5 -mx-0.5 rotate-180 inline' />)</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Balance after execution: </span>
                                <span>₳ {formatNumber(getResultBalance(), 2)}</span>
                            </div>
                        </div>

                        <Input
                            aria-label='Passphrase'
                            isRequired
                            label="Passphrase"
                            variant="bordered"
                            placeholder="Enter your passphrase"
                            endContent={<button className="focus:outline-none" type="button" onClick={toggleVisibility}>
                                    {isVisible ? (
                                        <EyeSlashIcon width={25} height={25} className="text-default-400" />
                                    ) : (
                                        <EyeIcon width={25} height={25} className="text-default-400" />
                                    )}
                                </button>
                            }
                            type={isVisible ? "text" : "password"}
                            value={passphrase}
                            onValueChange={setPassphraseTouched}
                            isInvalid={passTouched && passphrase.length < 10}
                            errorMessage="Passphrase must be atleast 10 characters long"
                            classNames={{base: "mt-1", input: "text-white"}} 
                        />
                    </ModalBody>
                    <ModalFooter>
                        <Button color="danger" variant="light" onPress={onClose}>
                            Close
                        </Button>
                        <Button color="secondary" onPress={submitInput} isDisabled={isSubmitDisabled()}>
                            Submit
                        </Button>
                    </ModalFooter>
                </>
            )}
            </ModalContent>
        </Modal>
    </>
  );
};

export default SendAdaModal;