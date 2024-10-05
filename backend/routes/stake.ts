import express, { Request, Response} from 'express';
import { getPool, getResults } from '../utils/stake';
import * as fs from 'fs';
import { isWithinThreeHours } from '../utils/helper';
const routes = express.Router();

const CEXPLORER_API = "https://js.cexplorer.io/api-static/pool/";

routes.get('/:id', async (req: Request, res: Response) => {
    let filePath = "./resources/pools/" + req.params.id + ".json";
    
    if (!fs.existsSync(filePath)) {
        await fetch(CEXPLORER_API + req.params.id  + ".json")
            .then(res => res.json())
            .then(res => {
                fs.writeFile('./resources/pools/' + req.params.id + ".json", JSON.stringify(res), function(err) {
                    if(err) {
                        console.log(err);
                    }
                });

                res.status(200).send(JSON.stringify({ pool: res.data }));
            })
            .catch(err => {
                res.status(500).send(JSON.stringify({ error: err }));
            });
    } else {
        let poolData = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
        if(isWithinThreeHours(poolData.time)) {
            res.status(200).send(JSON.stringify({ pool: poolData.data }));
        } else {
            await fetch(CEXPLORER_API + req.params.id  + ".json")
                .then(res => res.json())
                .then(res => {
                    fs.writeFile('./resources/pools/' + req.params.id + ".json", JSON.stringify(res), function(err) {
                        if(err) {
                            console.log(err);
                        }
                    });

                    res.status(200).send(JSON.stringify({ pool: res.data }));
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

    if(isWithinThreeHours(jsonPools.time)) {
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

export default routes;