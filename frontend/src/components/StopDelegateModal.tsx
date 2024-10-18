import { StakePoolData } from "@/model/StakePool";
import { Wallet } from "@/model/Wallet";
import { ScatterIcon } from "./icons/ScatterIcon";
import { Button, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure } from "@nextui-org/react";
import { startDelegation, stopDelegation } from "@/services/StakeService";
import { useEffect, useRef, useState } from "react";
import { EyeFilledIcon } from "./icons/EyeFilledIcon";
import { EyeSlashFilledIcon } from "./icons/EyeSlashFilledIcon";
import { RemoveIcon } from "./icons/RemoveIcon";
import toast from "react-hot-toast";
import useWalletStore from "@/model/WalletState";
import { syncWallet } from "@/services/WalletService";

interface ValueProps {
    wallet: Wallet;
    pool: StakePoolData;
}

const StopDelegateModal: React.FC<ValueProps> = ({ wallet, pool }) => {
    const { update } = useWalletStore();
    const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
    const [passphrase, setPassphrase] = useState("");
    const [passTouched, setPassTouched] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const toggleVisibility = () => setIsVisible(!isVisible);

    const [submit, setSubmit] = useState(false);
    const firstRender = useRef(true);

    function setPassphraseTouched(inputPass: string): void { 
        setPassTouched(true);
        setPassphrase(inputPass);
    }    

    function resetForm(): void {
        setPassTouched(false);
        setPassphrase("");
        setIsVisible(false);
    }

    function submitInput(): void {
        setSubmit(!submit);
    }     

    useEffect(() => {
        if(firstRender.current) {
            firstRender.current = false;
            return;
        }

        if(wallet && pool && passphrase) {
            toast.promise(new Promise((resolve, reject) =>  {
                stopDelegation(wallet.id, passphrase)
                    .then(res => {
                        if(res.error){
                            reject(res.error);
                        } else {
                            let tx = res.stopTx;
                            console.log("stopTx", tx);
                            
                            syncWallet(wallet.id)
                                .then(res => {
                                    res.wallet.isSelected = wallet.isSelected;
                                    res.wallet.lastSynced = new Date().toUTCString();
                                    wallet = res.wallet as Wallet;

                                    update(wallet.id, wallet);
                                });


                            resetForm();
                            onClose();
                            resolve("");
                        }
                    });
            }),
            {
                loading: 'Stopping delegation to pool...',
                success: 'Successfully stopped delegation to pool.',
                error: 'Error stopping delegation to pool.',
            });  
        }        
    }, [submit]);

    return(
        <>
            <Button size="sm" color="secondary" variant="ghost" className="text-sm" onClick={onOpen} startContent={<RemoveIcon width={18} height={18} className="-m-1" />}>stop delegating</Button> 
            <Modal isOpen={isOpen} onOpenChange={onOpenChange} onClose={resetForm} classNames={{ base: "dark" }}>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1 text-white">Stop your delegation to {pool.name}</ModalHeader>
                            <ModalBody className='text-base'>
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
                                        </button>
                                    }
                                    type={isVisible ? "text" : "password"}
                                    className="max-w-xs"
                                    value={passphrase}
                                    onValueChange={setPassphraseTouched}
                                    isInvalid={passTouched && passphrase.length < 10}
                                    errorMessage="Passphrase must be atleast 10 characters long"
                                    classNames={{input: "text-white"}}
                                />
                            </ModalBody>
                            <ModalFooter>
                                <Button color="danger" variant="light" onPress={onClose}>
                                    Close
                                </Button>
                                <Button color="secondary" className='text-white' onPress={submitInput} isDisabled={!passTouched || passphrase.length < 10}>
                                    Stop delegation
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    );
};

export default StopDelegateModal;