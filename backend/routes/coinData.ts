import express, { Request, Response} from 'express';
const routes = express.Router();

import * as fs from 'fs';
import { getYesterdaysDate, isWithinTime } from '../utils/helper';
import { Period } from '../model/period';
import { fetchHistoricalPrice, fetchPrice } from '../utils/coinData';

routes.get('/:id/price', async (req: Request, res: Response) => {
    let APIKEY = "";
    if(process.env.COINGECKO_APIKEY) {
        APIKEY = process.env.COINGECKO_APIKEY;
    } else {
        res.sendStatus(500);
    }
    const options = {
        method: 'GET',
        headers: {accept: 'application/json', 'x-cg-demo-api-key': APIKEY}
    };

    let filePath = './resources/prices/' + req.params.id + '_prices.json';
    if (!fs.existsSync(filePath)) {
        fetchPrice(req, res, options);
    } else {
        let priceData = JSON.parse(fs.readFileSync('./resources/prices/' + req.params.id + '_prices.json', 'utf-8'));
        if(isWithinTime(priceData.time, 5 * 60 * 1000)) {
            res.status(200).send(JSON.stringify({ data: priceData }));
        } else {
            fetchPrice(req, res, options);
        }
    }
});

routes.get('/:id/info', async (req: Request, res: Response) => {
    // TEMPORARY
    const data = fs.readFileSync("./resources/adainfo.json", 'utf-8');
    const jsonData = JSON.parse(data);
    
    res.status(200).send(JSON.stringify({ data: jsonData }));

    /*let APIKEY = "";
    if(process.env.COINGECKO_APIKEY) {
        APIKEY = process.env.COINGECKO_APIKEY;
    } else {
        res.sendStatus(500);
    }

    const options = {
        method: 'GET',
        headers: {accept: 'application/json', 'x-cg-demo-api-key': APIKEY}
    };
  
    fetch('https://api.coingecko.com/api/v3/coins/' + req.params.id + '/history?date=' + getYesterdaysDate() + '&localization=false', options)
        .then(response => response.json())
        .then(response => console.log(response))
        .catch(err => console.error(err));*/
});

routes.get('/:id/historic', async (req: Request, res: Response) => {
    let APIKEY = "";
    if(process.env.COINGECKO_APIKEY) {
        APIKEY = process.env.COINGECKO_APIKEY;
    } else {
        res.sendStatus(500);
    }
    const options = {
        method: 'GET',
        headers: {accept: 'application/json', 'x-cg-demo-api-key': APIKEY}
    };

    if(req.query.period && req.query.currency) {
        let period = req.query.period as Period;
        let filePath = './resources/prices/' + req.params.id + '_' + period + '.json';

        if (!fs.existsSync(filePath)) {
            fetchHistoricalPrice(req, res, options, period);
        } else {
            let priceData = JSON.parse(fs.readFileSync('./resources/prices/' + req.params.id + '_' + period + '.json', 'utf-8'));
            if(isWithinTime(priceData.time, 5 * 60 * 1000)) {
                res.status(200).send(JSON.stringify({ data: priceData }));
            } else {
                fetchHistoricalPrice(req, res, options, period);
            }
        }
    }
});

export default routes;