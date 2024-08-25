import { Button, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure } from "@nextui-org/react";
import { EditIcon } from "./icons/EditIcon";
import { useEffect, useRef, useState } from "react";
import { renameWallet } from "@/services/WalletService";
import useWalletStore from "@/model/WalletState";

interface ValueProps {
    id: string;
    value: string;
}

const EditWalletModal: React.FC<ValueProps> = ({ id, value }) => {
    const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
    const [name, setName] = useState("");
    const [submit, setSubmit] = useState(false);
    const firstRender = useRef(true);
    const update = useWalletStore((state) => state.update);

    useEffect(() => {
        setName(value);
    }, [value]);

    function submitInput(): void {
        setSubmit(!submit);
    }     

    function resetForm(): void {
        setName(value);
    }

    useEffect(() => {
        if(firstRender.current) {
          firstRender.current = false;
          return;
        }
        
        renameWallet(id, name)
            .then(res => {
                let jsonRes = JSON.parse(res);
                jsonRes.wallet.isSelected = true;
                update(id, jsonRes.wallet);
            });

        resetForm();
        onClose();
      }, [submit]);

    return (
        <>
            <a className="edit-icon flex items-center justify-center cursor-pointer" onClick={onOpen} aria-label="Edit wallet"><EditIcon width={20} height={20} /></a>
            <Modal isOpen={isOpen} onOpenChange={onOpenChange} onClose={resetForm} classNames={{ base: "dark" }}>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1 text-white">Edit your wallet</ModalHeader>
                            <ModalBody className='text-base'>
                                <Input
                                  aria-label='Name'
                                  label="Name"
                                  description="The name for the wallet on here (optional)"
                                  className="max-w-xs"
                                  value={name}
                                  onValueChange={setName}
                                  placeholder={value}
                                  classNames={{input: "text-white"}}
                                />
                            </ModalBody>
                            <ModalFooter>
                                <Button color="danger" variant="light" onPress={onClose}>
                                    Close
                                </Button>
                                <Button color="secondary" className='text-white' onPress={submitInput} isDisabled={name !== undefined && name.length === 0}>
                                    Edit
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    );
}

export default EditWalletModal;