import express, { Request, Response} from 'express';
const routes = express.Router();
const COINGECKO_API = "https://api.coingecko.com/api/v3/";

import * as fs from 'fs';
import { getYesterdaysDate } from '../utils/helper';

routes.get('/:id/price', async (req: Request, res: Response) => {
    // TEMPORARY
    const data = fs.readFileSync("./resources/adaprice.json", 'utf-8');
    const jsonData = JSON.parse(data);
    
    res.status(200).send(JSON.stringify({ data: jsonData.cardano }));

    // TODO this endpoint only for current price and volume etc...

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
      
    fetch(COINGECKO_API + 'simple/price?ids=' + req.params.id + '&vs_currencies=usd%2Ceur&include_market_cap=true&include_24hr_vol=true&include_24hr_change=true&include_last_updated_at=true&precision=full', options)
      .then(response => response.json())
      .then(response => console.log(response))
      .catch(err => console.error(err));*/
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
   // TEMPORARY
   if(req.query.from && req.query.to) {
        let from = new Date(parseInt(req.query.from as string) * 1000);
        let to = new Date(parseInt(req.query.to as string) * 1000);
        
        const oneDayAgo = new Date();
        oneDayAgo.setDate(to.getDate() - 2);

        const oneMonthAgo = new Date();
        oneMonthAgo.setMonth(to.getMonth() - 1);
        oneMonthAgo.setDate(to.getDate() - 1);

        if(from >= oneDayAgo && from <= to) {
            const data = fs.readFileSync("./resources/adadaily.json", 'utf-8');
            const jsonData = JSON.parse(data);
            
            res.status(200).send(JSON.stringify({ data: jsonData }));
        } else if(from >= oneMonthAgo && from <= to) {
            const data = fs.readFileSync("./resources/adamonthly.json", 'utf-8');
            const jsonData = JSON.parse(data);
            
            res.status(200).send(JSON.stringify({ data: jsonData }));
        } else {
            const data = fs.readFileSync("./resources/adahistoricprice.json", 'utf-8');
            const jsonData = JSON.parse(data);
            
            res.status(200).send(JSON.stringify({ data: jsonData }));
        }
   }

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
  
    fetch('https://api.coingecko.com/api/v3/coins/' + req.params.id + '/market_chart/range?vs_currency=eur&from=1695938400&to=1727474400&precision=full', options)
        .then(response => response.json())
        .then(response => console.log(response))
        .catch(err => console.error(err));*/
});

export default routes;