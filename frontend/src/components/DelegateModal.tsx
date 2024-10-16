import { StakePoolData } from "@/model/StakePool";
import { Wallet } from "@/model/Wallet";
import { ScatterIcon } from "./icons/ScatterIcon";
import { Button, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure } from "@nextui-org/react";
import { startDelegation } from "@/services/StakeService";
import { useEffect, useRef, useState } from "react";
import { EyeFilledIcon } from "./icons/EyeFilledIcon";
import { EyeSlashFilledIcon } from "./icons/EyeSlashFilledIcon";
import toast from "react-hot-toast";

interface ValueProps {
    wallet: Wallet;
    pool: StakePoolData;
}

const DelegateModal: React.FC<ValueProps> = ({ wallet, pool }) => {
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
                startDelegation(wallet.id, pool.pool_id, passphrase)
                    .then(res => {
                        if(res.error){
                            reject(res.error);
                        } else {
                            let tx = res.startTx;
                            console.log("startTx", tx);
                            
                            // TODO doesnt work right now because pool data is not from preview testnet

                            resetForm();
                            onClose();
                            resolve("");
                        }
                    })
            }),
            {
                loading: 'Delegating to pool...',
                success: 'Successfully delegated to pool.',
                error: 'Error delegating to pool.',
            });    
        } 
    }, [submit]);

    // TODO add estimated delegation fee
    // show useful information like blocks produced last few epochs, blocks estimated this epoch

    return(
        <>
            <Button size="sm" color="secondary" variant="ghost" className="text-sm" onClick={onOpen} startContent={<ScatterIcon width={18} height={18} className="-m-1" />}>delegate</Button> 
            <Modal isOpen={isOpen} onOpenChange={onOpenChange} onClose={resetForm} classNames={{ base: "dark" }}>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1 text-white">Delegate to {pool.name}</ModalHeader>
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
                                    Delegate
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    );
};

export default DelegateModal;