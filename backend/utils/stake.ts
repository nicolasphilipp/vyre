import { WalletServer } from 'cardano-wallet-js';
let walletServer = WalletServer.init('http://localhost:8090/v2');

async function getPool(stake: number, poolId: string) {
    try {
        let pools = await walletServer.getStakePools(stake);
        let result = {};

        for(let i = 0; i < pools.length; i++) {
            if(pools[i].id === poolId) {
                result = pools[i];
            }
        }
        return JSON.stringify({ pool: result });
    } catch(e) {
        console.log(e);

        return JSON.stringify({ error: e });
    }
}

export { getPool };