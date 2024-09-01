import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure } from "@nextui-org/react";
import { RemoveIcon } from "./icons/RemoveIcon";
import { useEffect, useRef, useState } from "react";
import { removeWallet, renameWallet } from "@/services/WalletService";
import useWalletStore from "@/model/WalletState";
import { Wallet } from "@/model/Wallet";

interface ValueProps {
    wallet: Wallet;
}

const RemoveWalletModal: React.FC<ValueProps> = ({ wallet }) => {
    const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
    const [submit, setSubmit] = useState(false);
    const firstRender = useRef(true);
    const { remove, setSelected } = useWalletStore();

    function submitInput(): void {
        setSubmit(!submit);
    }     

    useEffect(() => {
        if(firstRender.current) {
          firstRender.current = false;
          return;
        }
        
        removeWallet(wallet.id)
            .then(res => {
                if(res.error) {
                    // TODO show toaster notification with error message
                    console.log("There was an error removing the wallet with id: " + wallet.id);
                } else {
                    setSelected("");
                    remove(wallet);
                }
            });

        onClose();
      }, [submit]);

    return (
        <>
            <a className="remove-icon flex items-center justify-center cursor-pointer" onClick={onOpen} aria-label="Remove wallet"><RemoveIcon width={24} height={24} /></a>
            <Modal isOpen={isOpen} onOpenChange={onOpenChange} classNames={{ base: "dark" }}>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1 text-danger">Important</ModalHeader>
                            <ModalBody className='text-base'>
                                <span>Do you wish to remove your wallet from Vyre?</span>
                                <span>If you proceed, your wallet will be removed from your storage and can be restored at any provider using your recovery phrase.</span>
                            </ModalBody>
                            <ModalFooter>
                                <Button color="danger" variant="light" onPress={onClose}>
                                    Close
                                </Button>
                                <Button color="danger" className='text-white' onPress={submitInput}>
                                    Yes, remove
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    );
}

export default RemoveWalletModal;