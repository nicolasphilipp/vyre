import express, { Request, Response} from 'express';
import { estimateDelegationFees, getPool, getResults, startDelegation, stopDelegation } from '../utils/stake';
import * as fs from 'fs';
import { isWithinTime } from '../utils/helper';
import { performQuery } from '../utils/dbsync-interface';
import { getAddresses } from '../utils/wallet';
const routes = express.Router();

const CEXPLORER_API = "https://js.cexplorer.io/api-static/pool/";

routes.get('/:id', async (req: Request, res: Response) => {
    let filePath = "./resources/pools/" + req.params.id + ".json";
    
    if (!fs.existsSync(filePath)) {
        await fetch(CEXPLORER_API + req.params.id  + ".json")
            .then(response => response.json())
            .then(response => {
                fs.writeFile('./resources/pools/' + req.params.id + ".json", JSON.stringify(response), function(err) {
                    if(err) {
                        console.log(err);
                    }
                });

                res.status(200).send(JSON.stringify({ pool: response.data }));
            })
            .catch(err => {
                res.status(500).send(JSON.stringify({ error: err }));
            });
    } else {
        let poolData = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
        if(isWithinTime(poolData.time, 3 * 60 * 60 * 1000)) {
            res.status(200).send(JSON.stringify({ pool: poolData.data }));
        } else {
            await fetch(CEXPLORER_API + req.params.id  + ".json")
                .then(response => response.json())
                .then(response => {
                    fs.writeFile('./resources/pools/' + req.params.id + ".json", JSON.stringify(response), function(err) {
                        if(err) {
                            console.log(err);
                        }
                    });

                    res.status(200).send(JSON.stringify({ pool: response.data }));
                })
                .catch(err => {
                    res.status(500).send(JSON.stringify({ error: err }));
                });
        }
    }
});

routes.get('/', async (req: Request, res: Response) => {
    let jsonPools = JSON.parse(fs.readFileSync("./resources/pools.json", 'utf-8'));
    let allPools = [];

    if(isWithinTime(jsonPools.time, 3 * 60 * 60 * 1000)) {
        for(let i = 0; i < jsonPools.data.length; i++) {
            if(jsonPools.data[i]) {
                allPools.push(jsonPools.data[i]);
            }
        }
    } else {
        await fetch(CEXPLORER_API + "list.json")
            .then(res => res.json())
            .then(res => {
                fs.writeFile('./resources/pools.json', JSON.stringify(res), function(err) {
                    if(err) {
                        console.log(err);
                    }
                });

                for(let i = 0; i < res.data.length; i++) {
                    if(res.data[i]) {
                        allPools.push(res.data[i]);
                    }
                }
            })
    }

    let strippedPools = [];
    for(let i = 0; i < allPools.length; i++) {
        // TODO remove pools which would result in 404 because img missing (?)

        if (allPools[i] && fs.existsSync('./resources/pools/' + allPools[i].pool_id + ".json")) {
            strippedPools.push(allPools[i]);
        }
    }
    
    if(req.query.limit && req.query.page) {
        let limit = parseInt(req.query.limit as string);
        let page = parseInt(req.query.page as string);
        let search = req.query.search as string;

        if(search) {
            let filteredPools = [];
            for(let i = 0; i < strippedPools.length; i++) {
                if((strippedPools[i].name as string).toLowerCase().includes(search.toLowerCase())) {
                    filteredPools.push(strippedPools[i]);
                }
            }

            res.status(200).send(JSON.stringify({ 
                totalResults: filteredPools.length, 
                totalPages: Math.ceil((filteredPools.length / limit)), 
                currentPage: page, 
                pools: await getResults(limit, page, filteredPools, res)
            }));
        } else {
            res.status(200).send(JSON.stringify({ 
                totalResults: strippedPools.length, 
                totalPages: Math.ceil((strippedPools.length / limit)), 
                currentPage: page, 
                pools: await getResults(limit, page, strippedPools, res)
            }));
        }
    } else {
        res.status(200).send(JSON.stringify({ pools: strippedPools }));
    }
});

routes.post('/start', async (req: Request, res: Response) => {
    if(req.body.passphrase.length < 10 || req.body.walletId.length !== 40) {
        res.sendStatus(400);
        return;
    }
    
    let tx = JSON.parse(await startDelegation(req.body.walletId, req.body.poolId, req.body.passphrase));
    if(tx.error){
        res.status(500).send(JSON.stringify({ error: tx.error }));
    } else {  
        res.status(200).send(JSON.stringify({ startTx: tx }));
    }
});

routes.post('/stop', async (req: Request, res: Response) => {
    if(req.body.passphrase.length < 10 || req.body.walletId.length !== 40) {
        res.sendStatus(400);
        return;
    }
    
    let tx = JSON.parse(await stopDelegation(req.body.walletId, req.body.passphrase));
    if(tx.error){
        res.status(500).send(JSON.stringify({ error: tx.error }));
    } else {  
        res.status(200).send(JSON.stringify({ stopTx: tx }));
    }
});

routes.post('/estimate', async (req: Request, res: Response) => {
    if(req.body.walletId.length !== 40) {
        res.sendStatus(400);
        return;
    }
    
    let delFee = JSON.parse(await estimateDelegationFees(req.body.walletId));
    if(delFee.error){
        res.status(500).send(JSON.stringify({ error: delFee.error }));
    } else {  
        res.status(200).send(JSON.stringify({ fee: delFee.fee }));
    }
});

routes.get('/:id/rewards', async (req: Request, res: Response) => {
    if(req.params.id.length !== 40){
      res.sendStatus(400);
      return;
    }

    let address = JSON.parse(await getAddresses(req.params.id));
    if(address.error){
        res.status(500).send(JSON.stringify({ error: address.error }));
    } else { 
        let stakeAddressQuery = `SELECT stake_address.id AS stake_address_id, tx_out.address, stake_address.view AS stake_address
                        FROM tx_out INNER JOIN stake_address ON tx_out.stake_address_id = stake_address.id
                        WHERE tx_out.address = '${address.address.id}';`;

        performQuery(stakeAddressQuery)
            .then((result) => {
                let stakeAddr = result.rows[0].stake_address;
                let query = `SELECT reward.earned_epoch, pool_hash.view AS delegated_pool, reward.amount AS amount_reward, epoch_stake.amount AS amount_staked
                                FROM reward INNER JOIN stake_address ON reward.addr_id = stake_address.id
                                INNER JOIN pool_hash ON reward.pool_id = pool_hash.id
                                LEFT JOIN epoch_stake ON reward.earned_epoch = epoch_stake.epoch_no AND stake_address.id = epoch_stake.addr_id
                                WHERE stake_address.view = '${stakeAddr}'
                                ORDER BY reward.earned_epoch ASC;`;

                performQuery(query)
                    .then((result) => {
                        res.status(200).send(JSON.stringify({ stakeAddr: stakeAddr, rewards: result.rows }));
                    })
                    .catch((error) => {
                        res.status(500).send(JSON.stringify({ error: 'Error getting staking reward history' }));
                    });
            })
            .catch((error) => {
                res.status(500).send(JSON.stringify({ error: 'Error getting staking address' }));
            });            
    }
});

export default routes;