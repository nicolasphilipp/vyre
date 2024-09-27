import {Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure, Radio, RadioGroup, Input, Divider, input, Tooltip, Spinner} from "@nextui-org/react";
import { useEffect, useRef, useState } from 'react';

import { SendIcon } from './icons/SendIcon';
import { EyeFilledIcon } from "./icons/EyeFilledIcon";
import { EyeSlashFilledIcon } from "./icons/EyeSlashFilledIcon";
import { formatNumber } from "@/services/TextFormatService";
import { Wallet } from "@/model/Wallet";
import useWalletStore from "@/model/WalletState";
import { ArrowIcon } from "./icons/ArrowIcon";
import { DangerIcon } from "./icons/DangerIcon";
import { Address } from "@/model/Address";
import { estimateFees, submitTx } from "@/services/TxService";
import { Transaction, TxFees } from "@/model/Transaction";
import toast, { Toaster } from "react-hot-toast";
import { loveLaceToAda } from "@/Constants";
import { syncWallet } from "@/services/WalletService";

interface ValueProps {
    wallet: Wallet;
}

const SendAdaModal: React.FC<ValueProps> = ({ wallet }) => {
  const { update } = useWalletStore();
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  
  const [receiver, setReceiver] = useState("");
  const [receiverTouched, setReceiverTouched] = useState(false);

  const [amount, setAmount] = useState("");
  const [amountTouched, setAmountTouched] = useState(false);
  const [estimatedFees, setEstimatedFees] = useState(0);

  const [passphrase, setPassphrase] = useState("");
  const [passTouched, setPassTouched] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const toggleVisibility = () => setIsVisible(!isVisible);

  const [submit, setSubmit] = useState(false);
  const firstRender = useRef(true);

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
    if(address === "") {
        return true;
    }
    // TODO call backend to check if address is invalid
    // or check only if address has the required length?
    return false;
  }

  function isSubmitDisabled(): boolean {
    return (!passTouched || passphrase.length < 10) || isReceiverInvalid() || isAmountInvalid();
  }

  function resetForm(): void {
    setReceiver("");
    setReceiverTouched(false);
    setAmount("");
    setAmountTouched(false);
    setPassTouched(false);
    setPassphrase("");
    setIsVisible(false);
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

    syncWallet(wallet.id)
        .then(res => {
            res.wallet.isSelected = wallet.isSelected;
            wallet = res.wallet as Wallet;
            
            update(wallet.id, wallet);
        });
  }, [submit]);
  
  return (
    <>
        <Button size="md" color="secondary" variant="ghost" aria-label='Send ADA' onPress={onOpen}>
            <span className="flex gap-0.5 items-center">
                Send ADA
                <SendIcon width={16} height={16} />
            </span>
        </Button>
        <Modal isOpen={isOpen} onOpenChange={onOpenChange} onClose={resetForm} classNames={{ base: "dark" }}>
            <ModalContent>
            {(onClose) => (
                <>
                    <ModalHeader className="flex flex-col gap-1 text-white">Send ADA</ModalHeader>
                    <ModalBody>
                        <Input
                            aria-label='Receiver'
                            isRequired
                            isClearable
                            type="text"
                            label="Receiver"
                            placeholder="Enter the receiving address"
                            variant='bordered'
                            className="max-w-xs"
                            value={receiver}
                            onValueChange={setReceiveAddressTouched} 
                            isInvalid={isReceiverInvalid()}
                            errorMessage="Enter a valid address"
                            classNames={{input: "text-white"}} 
                        />
                        <Input
                            aria-label='Amount'
                            isRequired
                            type="number"
                            label="Amount"
                            placeholder="0.0000"
                            variant='bordered'
                            className="max-w-xs"
                            startContent={<><span id="amount" className="text-sm">₳</span></>}
                            value={amount}
                            onValueChange={setAmountInputTouched}
                            isInvalid={isAmountInvalid()}
                            errorMessage={"Amount can not be higher than your available balance! Available: ₳ " + formatNumber(wallet.balance.available.quantity / loveLaceToAda, 2)}
                        />

                        <Divider className="my-1" />

                        <div className="flex flex-col text-sm mt-1">
                            <div className="flex justify-between w-9/12">
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
                            <div className="flex justify-between w-9/12">
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
                                <EyeSlashFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                            ) : (
                                <EyeFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                            )}
                            </button>}
                            type={isVisible ? "text" : "password"}
                            className="max-w-xs"
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