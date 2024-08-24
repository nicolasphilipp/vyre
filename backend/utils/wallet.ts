import { WalletServer, Seed, ShelleyWallet } from 'cardano-wallet-js';
let walletServer = WalletServer.init('http://localhost:8090/v2');

// refactor so that wallet API is used and not cardano-wallet-js library

async function createWallet(name: string, wordcount: number, passphrase: string){
    let recoveryPhrase = Seed.generateRecoveryPhrase(wordcount);
    let mnemonic_list = Seed.toMnemonicList(recoveryPhrase);
    let wallet = await walletServer.createOrRestoreShelleyWallet(name, mnemonic_list, passphrase);    
    
    let res: any = {};
    res.mnemonic = mnemonic_list;
    res.wallet = wallet;
    return JSON.stringify(res);
}

async function restoreWallet(name: string, mnemonic: string[], passphrase: string){
    let wallet = await walletServer.createOrRestoreShelleyWallet(name, mnemonic, passphrase);

    let res: any = {};
    res.mnemonic = mnemonic;
    res.wallet = wallet;
    return JSON.stringify(res);
}

async function removeWallet(id: string) {
    let wallet = await walletServer.getShelleyWallet(id);
    return await wallet.delete();
}

async function renameWallet(id: string, name: string) {
    let wallet = await walletServer.getShelleyWallet(id);
    let newWallet = await wallet.rename(name);
    
    let res: any = {};
    res.wallet = newWallet;
    return JSON.stringify(res);
}

async function getAddresses(id: string) {
    let wallet = await walletServer.getShelleyWallet(id);
    let addresses = await wallet.getAddresses(); 

    let res: any = {};
    res.address = addresses[0];
    return JSON.stringify(res);
}

async function getWallet(id: string) {
    let wallet = await walletServer.getShelleyWallet(id);

    let res: any = {};
    res.wallet = wallet;
    return JSON.stringify(res);
}

function getAvailableBalance(wallet: ShelleyWallet){
    return wallet.getAvailableBalance();
}

function getRewardBalance(wallet: ShelleyWallet){
    return wallet.getRewardBalance();
}

function getTotalBalance(wallet: ShelleyWallet){
    return wallet.getTotalBalance();
}

function getDelegation(wallet: ShelleyWallet){
    return wallet.getDelegation();
}
  
export { createWallet, restoreWallet, removeWallet, renameWallet, getAddresses, getWallet, getAvailableBalance, getRewardBalance, getTotalBalance, getDelegation };
  