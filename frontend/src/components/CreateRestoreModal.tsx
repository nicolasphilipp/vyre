import useWalletStore from '@/model/WalletState';
import { createWallet, getMnemonicWords, restoreWallet } from '@/services/WalletService';
import {Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure, Radio, RadioGroup, Input, Divider, input, Tooltip} from "@nextui-org/react";
import { useEffect, useRef, useState } from 'react';
import {EyeFilledIcon} from "./icons/EyeFilledIcon";
import {EyeSlashFilledIcon} from "./icons/EyeSlashFilledIcon";
import { Wallet } from '@/model/Wallet';
import { ArrowIcon } from './icons/ArrowIcon';
import { HelpIcon } from './icons/HelpIcon';
import { DangerIcon } from './icons/DangerIcon';

export default function CreateRestoreModal() {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const [wordcount, setWordcount] = useState("15");
  const [name, setName] = useState("");
  const [passphrase, setPassphrase] = useState("");
  const [passTouched, setPassTouched] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const toggleVisibility = () => setIsVisible(!isVisible);

  const [restore, setRestore] = useState(false);
  const wallets = useWalletStore((state) => state.wallets);
  const add = useWalletStore((state) => state.add);
  const update = useWalletStore((state) => state.update);
  const [submit, setSubmit] = useState(false);
  const firstRender = useRef(true);

  const [restoreView, setRestoreView] = useState(1);

  const [showRecovery, setShowRecovery] = useState(false);
  const [recovery, setRecovery] = useState([]);
  const [mnemonicWords, setMnemonicWords] = useState([]);
  const [mnemCount, setMnemCount] = useState("15");

  const [enteredMnemonic, setEnteredMnemonic] = useState(["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""]);
  const [mnemonicValid, setMnemonicValid] = useState([false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false]);
  const [mnemonicTouched, setMnemonicTouched] = useState([false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false]);

  const [word1, setWord1] = useState("");
  const [word1Touched, setWord1Touched] = useState(false);  
  const [word2, setWord2] = useState("");
  const [word2Touched, setWord2Touched] = useState(false);
  const [word3, setWord3] = useState("");
  const [word3Touched, setWord3Touched] = useState(false);
  const [word4, setWord4] = useState("");
  const [word4Touched, setWord4Touched] = useState(false);
  const [word5, setWord5] = useState("");
  const [word5Touched, setWord5Touched] = useState(false);
  const [word6, setWord6] = useState("");
  const [word6Touched, setWord6Touched] = useState(false);
  const [word7, setWord7] = useState("");
  const [word7Touched, setWord7Touched] = useState(false);
  const [word8, setWord8] = useState("");
  const [word8Touched, setWord8Touched] = useState(false);
  const [word9, setWord9] = useState("");
  const [word9Touched, setWord9Touched] = useState(false);
  const [word10, setWord10] = useState("");
  const [word10Touched, setWord10Touched] = useState(false);
  const [word11, setWord11] = useState("");
  const [word11Touched, setWord11Touched] = useState(false);
  const [word12, setWord12] = useState("");
  const [word12Touched, setWord12Touched] = useState(false);
  const [word13, setWord13] = useState("");
  const [word13Touched, setWord13Touched] = useState(false);
  const [word14, setWord14] = useState("");
  const [word14Touched, setWord14Touched] = useState(false);
  const [word15, setWord15] = useState("");
  const [word15Touched, setWord15Touched] = useState(false);
  const [word16, setWord16] = useState("");
  const [word16Touched, setWord16Touched] = useState(false);
  const [word17, setWord17] = useState("");
  const [word17Touched, setWord17Touched] = useState(false);
  const [word18, setWord18] = useState("");
  const [word18Touched, setWord18Touched] = useState(false);
  const [word19, setWord19] = useState("");
  const [word19Touched, setWord19Touched] = useState(false);
  const [word20, setWord20] = useState("");
  const [word20Touched, setWord20Touched] = useState(false);
  const [word21, setWord21] = useState("");
  const [word21Touched, setWord21Touched] = useState(false);
  const [word22, setWord22] = useState("");
  const [word22Touched, setWord22Touched] = useState(false);
  const [word23, setWord23] = useState("");
  const [word23Touched, setWord23Touched] = useState(false);
  const [word24, setWord24] = useState("");
  const [word24Touched, setWord24Touched] = useState(false);

  const wordInput = [word1, word2, word3, word4, word5, word6, word7, word8, word9, word10, word11, word12, 
    word13, word14, word15, word16, word17, word18, word19, word20, word21, word22, word23, word24];
  const wordSetter = [setWord1InputTouched, setWord2InputTouched, setWord3InputTouched, setWord4InputTouched, setWord5InputTouched, setWord6InputTouched, setWord7InputTouched, setWord8InputTouched, setWord9InputTouched, setWord10InputTouched, setWord11InputTouched, setWord12InputTouched,
    setWord13InputTouched, setWord14InputTouched, setWord15InputTouched, setWord16InputTouched, setWord17InputTouched, setWord18InputTouched, setWord19InputTouched, setWord20InputTouched, setWord21InputTouched, setWord22InputTouched, setWord23InputTouched, setWord24InputTouched];
  const wordTouched = [word1Touched, word2Touched, word3Touched, word4Touched, word5Touched, word6Touched, word7Touched, word8Touched, word9Touched, word10Touched, word11Touched, word12Touched, 
    word13Touched, word14Touched, word15Touched, word16Touched, word17Touched, word18Touched, word19Touched, word20Touched, word21Touched, word22Touched, word23Touched, word24Touched];

  function submitInput(): void {
    setSubmit(!submit);
  } 

  function setPassphraseTouched(inputPass: string): void { 
    setPassTouched(true);
    setPassphrase(inputPass);
  }

  function updateModalView(restore: boolean): void {
    resetForm();
    setRestore(restore);
  }

  function resetForm(): void {
    setPassTouched(false);
    setPassphrase("");
    setName("");
    setWordcount("15");
    setMnemCount("15");
    setRestore(false);
    setShowRecovery(false);
    setRecovery([]);
    resetWordInputs();  
  }

  function resetWordInputs(): void {
    setWord1("");
    setWord1Touched(false);
    setWord2("");
    setWord2Touched(false);
    setWord3("");
    setWord3Touched(false);
    setWord4("");
    setWord4Touched(false);
    setWord5("");
    setWord5Touched(false);
    setWord6("");
    setWord6Touched(false);
    setWord7("");
    setWord7Touched(false);
    setWord8("");
    setWord8Touched(false);
    setWord9("");
    setWord9Touched(false);
    setWord10("");
    setWord10Touched(false);
    setWord11("");
    setWord11Touched(false);
    setWord12("");
    setWord12Touched(false);
    setWord13("");
    setWord13Touched(false);
    setWord14("");
    setWord14Touched(false);
    setWord15("");
    setWord15Touched(false);
    setWord16("");
    setWord16Touched(false);
    setWord17("");
    setWord17Touched(false);
    setWord18("");
    setWord18Touched(false);
    setWord19("");
    setWord19Touched(false);
    setWord20("");
    setWord20Touched(false);
    setWord21("");
    setWord21Touched(false);
    setWord22("");
    setWord22Touched(false);
    setWord23("");
    setWord23Touched(false);
    setWord24("");
    setWord24Touched(false);
  }

  function isMnemInvalid(word: string): boolean {
    if(word){
      for(let i = 0; i < mnemonicWords.length; i++) {
        if(word === mnemonicWords[i]){
          return false;
        }
      }
    }
    return true;
  }

  function isMnemInputValid(count: number): boolean {
    for(let i = 0; i < count; i++) {
      if(!wordTouched[i]) {
        return false;
      } else {
        for(let j = 0; j < count; j++) {
          if(isMnemInvalid(wordInput[j])) {
            return false;
          }
        }
      }
    }
    return true;
  }

  function setWord1InputTouched(input: string): void {   
    setWord1Touched(true); 
    setWord1(input);
  }

  function setWord2InputTouched(input: string): void {   
    setWord2Touched(true); 
    setWord2(input);
  }

  function setWord3InputTouched(input: string): void {   
    setWord3Touched(true); 
    setWord3(input);
  }

  function setWord4InputTouched(input: string): void {   
    setWord4Touched(true); 
    setWord4(input);
  }

  function setWord5InputTouched(input: string): void {   
    setWord5Touched(true); 
    setWord5(input);
  }

  function setWord6InputTouched(input: string): void {   
    setWord6Touched(true); 
    setWord6(input);
  }

  function setWord7InputTouched(input: string): void {   
    setWord7Touched(true); 
    setWord7(input);
  }

  function setWord8InputTouched(input: string): void {   
    setWord8Touched(true); 
    setWord8(input);
  }

  function setWord9InputTouched(input: string): void {   
    setWord9Touched(true); 
    setWord9(input);
  }

  function setWord10InputTouched(input: string): void {   
    setWord10Touched(true); 
    setWord10(input);
  }

  function setWord11InputTouched(input: string): void {   
    setWord11Touched(true); 
    setWord11(input);
  }

  function setWord12InputTouched(input: string): void {   
    setWord12Touched(true); 
    setWord12(input);
  }

  function setWord13InputTouched(input: string): void {   
    setWord13Touched(true); 
    setWord13(input);
  }

  function setWord14InputTouched(input: string): void {   
    setWord14Touched(true); 
    setWord14(input);
  }

  function setWord15InputTouched(input: string): void {   
    setWord15Touched(true); 
    setWord15(input);
  }

  function setWord16InputTouched(input: string): void {   
    setWord16Touched(true); 
    setWord16(input);
  }

  function setWord17InputTouched(input: string): void {   
    setWord17Touched(true); 
    setWord17(input);
  }

  function setWord18InputTouched(input: string): void {   
    setWord18Touched(true); 
    setWord18(input);
  }

  function setWord19InputTouched(input: string): void {   
    setWord19Touched(true); 
    setWord19(input);
  }

  function setWord20InputTouched(input: string): void {   
    setWord20Touched(true); 
    setWord20(input);
  }

  function setWord21InputTouched(input: string): void {   
    setWord21Touched(true); 
    setWord21(input);
  }

  function setWord22InputTouched(input: string): void {   
    setWord22Touched(true); 
    setWord22(input);
  }

  function setWord23InputTouched(input: string): void {   
    setWord23Touched(true); 
    setWord23(input);
  }

  function setWord24InputTouched(input: string): void {   
    setWord24Touched(true); 
    setWord24(input);
  }

  useEffect(() => {
    getMnemonicWords()
      .then((res) => {
        setMnemonicWords(res.words);
      });
  }, []);

  useEffect(() => {
    if(firstRender.current) {
      firstRender.current = false;
      return;
    }

    let walletName = name;
    if(walletName === ""){
      let count = 0;
      do{
        count++;
        walletName = "Wallet " + count;
      } while(wallets.filter(wallet => wallet.name === walletName).length > 0);
    }
    
    if(!restore) { 
      createWallet(walletName, parseInt(wordcount), passphrase)
        .then(res => {
          let jsonRes = JSON.parse(res);
          jsonRes.wallet.isSelected = true;
          add(jsonRes.wallet);
          
          for(let i = 0; i < wallets.length; i++) {
            let wallet: Wallet = wallets[i];
            if(wallet.id !== jsonRes.wallet.id){
              wallet.isSelected = false;
            }
            update(wallet.id, wallet);
          } 
  
          setRecovery(jsonRes.mnemonic);
          setShowRecovery(true);
        });
    } else {
      let mnemonic: string[] = [];
      for(let i = 0; i < parseInt(mnemCount); i++) {
        mnemonic.push(wordInput[i]);
      }

      // TODO show error if wallet is present on this wallet node -> same multiple wallets possible in later version
      restoreWallet(walletName, mnemonic, passphrase)
        .then(res => {
          let jsonRes = JSON.parse(res);
          jsonRes.wallet.isSelected = true;
          add(jsonRes.wallet);
          
          for(let i = 0; i < wallets.length; i++) {
            let wallet: Wallet = wallets[i];
            if(wallet.id !== jsonRes.wallet.id){
              wallet.isSelected = false;
            }
            update(wallet.id, wallet);
          } 
        });
    }

    resetForm();
    onClose();
  }, [submit]);

  return (
    <>
    <Button size="md" color="secondary" variant="ghost" onPress={onOpen} aria-label='Create/Restore wallet'>create/restore wallet</Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} onClose={resetForm} classNames={{ base: "dark", wrapper: "overflow-hidden"}}>
        <ModalContent>
          {(onClose) => (
            <>
              {!restore && 
              <>
                <ModalHeader className="flex flex-col gap-1 text-white">Create a wallet</ModalHeader>
                <ModalBody className='text-base'>
                  <Input
                    isClearable
                    type="text"
                    label="Name"
                    placeholder="Enter a name"
                    description="The name for the wallet on here (optional)"
                    variant='bordered'
                    className="max-w-xs"
                    value={name}
                    onValueChange={setName} 
                    classNames={{input: "text-white"}} />
                  <RadioGroup
                    label="Select a wallet recovery phrase length"
                    color="secondary"
                    value={wordcount}
                    onValueChange={setWordcount}
                    classNames={{
                      base: "text-sm",
                      label: "text-white"
                    }}
                  >
                    <Radio value="15">15 words</Radio>
                    <Radio value="24">24 words</Radio>
                  </RadioGroup>
                  <Input
                    isRequired
                    label="Passphrase"
                    variant="bordered"
                    placeholder="Enter a passphrase"
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
                    classNames={{input: "text-white"}} />
                </ModalBody>
                <ModalFooter className='justify-start'>
                  <div>
                    <Button className='text-white' variant='light' startContent={<ArrowIcon width={16} height={16} />} onPress={() => updateModalView(true)}>
                      Restore wallet
                    </Button>
                  </div>
                  <div className='flex gap-2 justify-end size-full'>
                    <Button color="danger" variant="light" onPress={onClose}>
                      Close
                    </Button>
                    <Button color="secondary" className='text-white' onPress={submitInput} isDisabled={!passTouched || passphrase.length < 10}>
                      Create wallet
                    </Button>
                  </div>
                </ModalFooter>
              </>
              }
              {restore && 
              <>
                <ModalHeader className="flex flex-col gap-1 text-white">Restore a wallet</ModalHeader>
                <ModalBody className='text-base'>
                  <Input
                    isClearable
                    type="text"
                    label="Name"
                    placeholder="Enter a name"
                    variant='bordered'
                    description="The name for the wallet on here (optional)"
                    className="max-w-xs"
                    value={name}
                    onValueChange={setName}
                    classNames={{input: "text-white"}} />
                  <Divider className='my-2' />
                  <div className='text-center'>
                    <span>
                      Restore an existing wallet by entering its 15 or 24 word recovery phrase.
                      <Tooltip
                        color="warning"
                        className='tooltip-container text-white'
                        content={
                          <div className="px-1 py-2">
                            <div className="text-small font-bold text-danger">Important</div>
                            <div className="text-tiny">If you enter your phrase incorrect (different words or order), <br></br> Vyre will restore an empty wallet with 0 balance.</div>
                          </div>
                        }
                      >
                        <span className='tooltip-restore-offset'><DangerIcon width={16} height={16} /></span>
                      </Tooltip>
                    </span>
                  </div>
                  <div className='recovery-grid-15'>
                    {Array.from({ length: parseInt(mnemCount)}, (_, i) => (
                      <div className='relative' key={"word" + i}>
                        <Input
                          id={"word" + i}
                          type="text" 
                          variant='bordered'
                          value={wordInput[i]}
                          onValueChange={wordSetter[i]}
                          classNames={{ input: "mt-0.5 text-white" }} 
                          startContent={<><span>{i + 1}. </span></>}
                          isInvalid={wordTouched[i] && isMnemInvalid(wordInput[i])}
                        />
                      </div>
                    ))}
                  </div>
                  <RadioGroup
                    orientation='horizontal'
                    color="secondary"
                    value={mnemCount}
                    onValueChange={setMnemCount}
                    classNames={{
                      base: "text-sm items-center",
                      label: "text-white"
                    }}
                  >
                    <Radio value="15">15 words</Radio>
                    <Radio value="24">24 words</Radio>
                  </RadioGroup>
                  <Divider className='my-2' />
                  <Input
                    isRequired
                    label="Passphrase"
                    variant="bordered"
                    placeholder="Enter a passphrase"
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
                    classNames={{input: "text-white"}} />
                </ModalBody>
                <ModalFooter className='justify-start'>
                  <div>
                    <Button className='text-white' variant='light' startContent={<ArrowIcon width={16} height={16} />} onPress={() => updateModalView(false)}>
                      Create wallet
                    </Button>
                  </div>
                  <div className='flex gap-2 justify-end size-full'>
                    <Button color="danger" variant="light" onPress={onClose}>
                      Close
                    </Button>
                    <Button color="secondary" className='text-white' onPress={submitInput} isDisabled={!isMnemInputValid(parseInt(mnemCount)) || (!passTouched || passphrase.length < 10)}>
                      Restore wallet
                    </Button>
                  </div>
                </ModalFooter>
              </>
              }
            </>
          )}
        </ModalContent>
      </Modal>

      <Modal isOpen={showRecovery} onClose={resetForm} isDismissable={false} isKeyboardDismissDisabled={true} hideCloseButton className='dark'>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1 text-danger">Important!</ModalHeader>
              <ModalBody className='text-base'>
                <p className='text-center'> 
                  In order to make sure you don't lose access to your wallet, you need to write down your recovery phrase.
                </p>
                <Divider className='my-2' />
                {recovery.length == 15 && 
                  <div className='recovery-grid-15'>
                    {recovery.map((word, i) => 
                      <div className='recovery-word' key={"word" + i}>
                        <span>{i + 1}. {word}</span>
                      </div>
                    )}
                  </div>
                }
                {recovery.length == 24 && 
                  <div className='recovery-grid-24'>
                    {recovery.map((word, i) => 
                      <div className='recovery-word' key={"word" + i}>
                        <span>{i + 1}. {word}</span>
                      </div>
                    )}
                  </div>
                }
                <Divider className='my-2' />
                <p className='text-center'>
                  After closing this window, you will not be able to view your recovery phrase again.
                </p>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" onPress={onClose}>
                  I understand
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};
