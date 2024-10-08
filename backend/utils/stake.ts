import { WalletServer } from 'cardano-wallet-js';
import { isWithinTime } from './helper';
import * as fs from 'fs';
import { Response } from 'express';

const CEXPLORER_API = "https://js.cexplorer.io/api-static/pool/";
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

async function getResults (limit: number, page: number, pools: any[], res: Response) {
    let results = [];
    let index = (limit * (page - 1 >= 0 ? page - 1 : 0));
    for(let i = index; i < index + limit; i++) {
        if(pools[i]) {
            let poolData = JSON.parse(fs.readFileSync("./resources/pools/" + pools[i].pool_id + ".json", 'utf-8'));

            if(isWithinTime(poolData.time, 3 * 60 * 60 * 1000)) {
                results.push(poolData.data);
            } else {
                await fetch(CEXPLORER_API + pools[i].pool_id  + ".json")
                    .then(res => res.json())
                    .then(res => {
                        fs.writeFile('./resources/pools/' + pools[i].pool_id + ".json", JSON.stringify(res), function(err) {
                            if(err) {
                                console.log(err);
                            }
                        });

                        results.push(res.data);
                    })
                    .catch(err => {
                        res.status(500).send(JSON.stringify({ error: err }));
                    });
            }
        }
    }
    return results;
}

export { getPool, getResults };

