import { WalletServer, Seed, ShelleyWallet } from 'cardano-wallet-js';
let walletServer = WalletServer.init('http://localhost:8090/v2');

// TODO refactor so that wallet API is used and not cardano-wallet-js library
// caching?

async function createWallet(name: string, wordcount: number, passphrase: string){
    try {
        let recoveryPhrase = Seed.generateRecoveryPhrase(wordcount);
        let mnemonic_list = Seed.toMnemonicList(recoveryPhrase);
        let wallet = await walletServer.createOrRestoreShelleyWallet(name, mnemonic_list, passphrase);    
        
        wallet = await walletServer.getShelleyWallet(wallet.id);
        return JSON.stringify({ mnemonic: mnemonic_list, wallet: wallet });
    } catch(e) {
        console.log(e);

        return JSON.stringify({ error: e });
    }
}

async function restoreWallet(name: string, mnemonic: string[], passphrase: string){
    try {    
        let wallet = await walletServer.createOrRestoreShelleyWallet(name, mnemonic, passphrase);

        wallet = await walletServer.getShelleyWallet(wallet.id);
        return JSON.stringify({ mnemonic: mnemonic, wallet: wallet });
    } catch(e) {
        console.log(e);

        return JSON.stringify({ error: e });
    }
}

async function removeWallet(id: string) {
    try {
        let wallet = await walletServer.getShelleyWallet(id);
        await wallet.delete();
        return JSON.stringify({ status: 'OK' });
    } catch(e) {
        console.log(e);

        return JSON.stringify({ error: e });
    }
}

async function renameWallet(id: string, name: string) {
    try {    
        let wallet = await walletServer.getShelleyWallet(id);
        let newWallet = await wallet.rename(name);
        return JSON.stringify({ wallet: newWallet });
    } catch(e) {
        console.log(e);

        return JSON.stringify({ error: e });
    }
}

async function getAddresses(id: string) {
    try {
        let wallet = await walletServer.getShelleyWallet(id);
        let addresses = await wallet.getAddresses(); 
        return JSON.stringify({ address: addresses[0] });
    } catch(e) {
        console.log(e);

        return JSON.stringify({ error: e });
    }
}

async function getWallet(id: string) {
    try {
        let wallet = await walletServer.getShelleyWallet(id);
        return JSON.stringify({ wallet: wallet });
    } catch(e) {
        console.log(e);

        return JSON.stringify({ error: e });
    }
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
  