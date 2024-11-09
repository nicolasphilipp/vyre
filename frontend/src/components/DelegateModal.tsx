import { StakePoolData } from "@/model/StakePool";
import { StakeFee, Wallet } from "@/model/Wallet";
import { ScatterIcon } from "./icons/ScatterIcon";
import { Button, Divider, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Progress, Snippet, Tooltip, useDisclosure, Image } from "@nextui-org/react";
import { estimateDelegation, startDelegation } from "@/services/StakeService";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { getAddress, syncWallet } from "@/services/WalletService";
import useWalletStore from "@/model/WalletState";
import { cutText, formatNumber, numberToPercent } from "@/services/TextFormatService";
import { loveLaceToAda } from "@/Constants";
import { DangerIcon } from "./icons/DangerIcon";
import { ArrowIcon } from "./icons/ArrowIcon";
import { BoxesIcon } from "./icons/BoxesIcon";
import { BoxIcon } from "./icons/BoxIcon";
import { RecentApyIcon } from "./icons/RecentApyIcon";
import { ProjectedBoxIcon } from "./icons/ProjectedBoxIcon";
import { SaturationIcon } from "./icons/SaturationIcon";
import { HandCoinIcon } from "./icons/HandCoinIcon";
import { ActiveStakeIcon } from "./icons/ActiveStakeIcon";
import { LiveStakeIcon } from "./icons/LiveStakeIcon";
import { TransactionFeeIcon } from "./icons/TransactionFeeIcon";
import { EyeIcon } from "./icons/EyeIcon";
import { EyeSlashIcon } from "./icons/EyeSlashIcon";

interface ValueProps {
    wallet: Wallet;
    pool: StakePoolData;
}

const DelegateModal: React.FC<ValueProps> = ({ wallet, pool }) => {
    const { update } = useWalletStore();
    const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();

    const [fee, setFee] = useState({} as StakeFee);
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
        estimateDelegation(wallet.id)
            .then(res => {
                console.log(res.fee);
                // TODO fee will be queried for all 8 pools, but is the same everytime
                setFee(res.fee as StakeFee);
            });
    }, []);

    useEffect(() => {
        if(firstRender.current) {
            firstRender.current = false;
            return;
        }

        if(wallet && pool && passphrase) {
            toast.promise(new Promise((resolve, reject) =>  {
                // TODO use pool.pool_id
                startDelegation(wallet.id, "3867a09729a1f954762eea035a82e2d9d3a14f1fa791a022ef0da242", passphrase)
                    .then(res => {
                        if(res.error){
                            reject(res.error);
                        } else {
                            let tx = res.startTx;
                            console.log("startTx", tx);
                            
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
                loading: 'Delegating to pool...',
                success: 'Successfully delegated to pool.',
                error: 'Error delegating to pool.',
            });    
        } 
    }, [submit]);

    return(
        <>
            <Button size="sm" color="secondary" variant="ghost" className="text-sm" onClick={onOpen} startContent={<ScatterIcon width={18} height={18} className="-m-1" />}>delegate</Button> 
            <Modal isOpen={isOpen} onOpenChange={onOpenChange} onClose={resetForm} classNames={{ base: "dark" }}>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1 text-white">Delegate to {pool.name}</ModalHeader>
                            <ModalBody className='text-sm'>
                                <div className="flex flex-col gap-3">
                                    <div className="flex justify-between items-center">
                                        <Snippet 
                                            symbol="" 
                                            tooltipProps={{
                                            className: "dark"
                                            }}
                                            codeString={pool.pool_id}
                                            size="md"
                                            classNames={{
                                            base: "p-0 bg-transparent text-inherit",
                                            pre: "font-sans"
                                            }}
                                        >
                                            <span>{cutText(pool.pool_id, 20)}</span>
                                        </Snippet>
                                        <div>
                                            <Image
                                                alt={pool.name}
                                                height={35}
                                                radius="sm"
                                                src={pool.img}
                                                width={35}
                                            />
                                        </div>
                                    </div>

                                    <Divider />

                                    <div className="flex gap-3 justify-between">
                                        <div className="flex flex-col flex-1">
                                            <div className="flex justify-between">
                                                <div className="flex gap-0.5 items-center">
                                                    <BoxIcon width={20} height={20} />
                                                    <span>Blocks this Epoch</span>
                                                </div>
                                                <span>{pool.blocks_epoch}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <div className="flex gap-0.5 items-center">
                                                    <ProjectedBoxIcon width={20} height={20} />
                                                    <span>Projected Blocks</span>
                                                </div>
                                                <span>{pool.blocks_est_epoch}</span>
                                            </div>
                                        </div>
                                        <Divider orientation="vertical" className="h-12" />
                                        <div className="flex flex-col flex-1">
                                            <div className="flex justify-between">
                                                <div className="flex gap-0.5 items-center">
                                                    <BoxesIcon width={20} height={20} />
                                                    <span>Blocks Lifetime</span>
                                                </div>
                                                <span>{pool.blocks_lifetime}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <div className="flex gap-4 items-center">
                                            <div className="flex gap-0.5 items-center">
                                                <SaturationIcon width={18} height={18} />
                                                <span>Saturation</span>
                                            </div>
                                            <div className="flex gap-2 items-center w-full">
                                                <Progress color="secondary" key={"progress"} aria-label={"progress"} value={parseFloat(numberToPercent(pool.saturation, 2))} />
                                                <span>{numberToPercent(pool.saturation, 2)}</span>
                                            </div>
                                        </div>
                                        <div className="flex justify-between">
                                            <div className="flex gap-0.5 items-center">
                                                <ActiveStakeIcon width={20} height={20} />
                                                <span>Active Stake</span>
                                            </div>
                                            <span>₳ {formatNumber(parseFloat(pool.stake_active) / loveLaceToAda, 2)}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <div className="flex gap-0.5 items-center">
                                                <LiveStakeIcon width={20} height={20} />
                                                <span>Live Stake</span>
                                            </div>
                                            <span>₳ {formatNumber(parseFloat(pool.stake) / loveLaceToAda, 2)}</span>
                                        </div>
                                    </div>
                                    

                                    <div className="flex justify-between">
                                        <div>
                                            <div className="flex gap-0.5 items-center">
                                                <RecentApyIcon width={20} height={20} />
                                                <span>Recent APY</span>
                                                <Tooltip
                                                    color="warning"
                                                    className='tooltip-container text-white'
                                                    content={
                                                        <div className="px-1 py-2">
                                                            <div className="text-small font-bold text-success">Information</div>
                                                            <div className="text-tiny flex flex-col">
                                                                <span>The estimated return if you would stake for 1 year.</span>
                                                            </div>
                                                        </div>
                                                    }
                                                >
                                                    <span className="-mt-0.5"><DangerIcon width={12} height={12} /></span>
                                                </Tooltip>
                                            </div>
                                        </div>
                                        <span>~{formatNumber(parseFloat(pool.roa_short), 2)}%</span>
                                    </div>

                                    <Divider />
                                                
                                    <div className="flex flex-col">
                                        <div className="flex justify-between">
                                            <div>
                                                <div className="flex gap-0.5 items-center">
                                                    <TransactionFeeIcon width={20} height={20} />
                                                    <span>Transaction Fees</span>
                                                    <Tooltip
                                                        color="warning"
                                                        className='tooltip-container text-white'
                                                        content={
                                                            <div className="px-1 py-2">
                                                                <div className="text-small font-bold text-success">Information</div>
                                                                <div className="text-tiny flex flex-col">
                                                                    <span>Fees that will occur for the transaction to start staking.</span>
                                                                </div>
                                                            </div>
                                                        }
                                                    >
                                                        <span className="-mt-0.5"><DangerIcon width={12} height={12} /></span>
                                                    </Tooltip>
                                                </div>
                                            </div>
                                            <span className="text-danger">₳ {fee.estimated_max && fee.estimated_max.quantity / loveLaceToAda} (<ArrowIcon width={16} height={16} className='mb-0.5 -mx-0.5 rotate-180 inline' />)</span>
                                        </div>

                                        <div className="flex justify-between">
                                            <div>
                                                <div className="flex gap-0.5 items-center">
                                                    <HandCoinIcon width={20} height={20} />
                                                    <span>Fees </span>
                                                    <Tooltip
                                                        color="warning"
                                                        className='tooltip-container text-white'
                                                        content={
                                                            <div className="px-1 py-2">
                                                            <div className="text-small font-bold text-success">Information</div>
                                                            <div className="text-tiny flex flex-col">
                                                                <span>The fees consist of a fixed fee and a variable fee (margin).</span>
                                                                <span className="mt-1">The fixed fee is deducted from the total rewards of the pool <br></br> to cover stake pool operating costs.</span>
                                                                <span className="mt-1">The variable fee is a percentage share of the total rewards <br></br> that the operator receives.</span>
                                                            </div>
                                                            </div>
                                                        }
                                                    >
                                                        <span className="-mt-0.5"><DangerIcon width={12} height={12} /></span>
                                                    </Tooltip>
                                                </div>
                                            </div>
                                            <span>₳ {formatNumber(parseFloat(pool.tax_fix) / loveLaceToAda, 2)} ({formatNumber(parseFloat(pool.tax_ratio), 2)}%)</span>
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
                                        className="mt-2"
                                        value={passphrase}
                                        onValueChange={setPassphraseTouched}
                                        isInvalid={passTouched && passphrase.length < 10}
                                        errorMessage="Passphrase must be atleast 10 characters long"
                                        classNames={{input: "text-white"}}
                                    />
                                </div>    
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