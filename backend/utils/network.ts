import { WalletServer, Seed, ShelleyWallet } from 'cardano-wallet-js';
let walletServer = WalletServer.init('http://localhost:8090/v2');

async function getNetworkInformation(){
    try {
        let information = await walletServer.getNetworkInformation();
        return JSON.stringify({ information: information });
    } catch(e) {
        return JSON.stringify({ error: e });
    }
}

export { getNetworkInformation };