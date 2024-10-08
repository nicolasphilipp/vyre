import * as fs from 'fs';
import { Response, Request } from 'express';
import { Period } from '../model/period';
const COINGECKO_API = "https://api.coingecko.com/api/v3";

async function fetchPrice(req: Request, res: Response, options: any) {
    // TODO add functionality to change currency -> add gbp also in frontend 

    fetch(COINGECKO_API + '/simple/price?ids=' + req.params.id + '&vs_currencies=usd%2Ceur&include_market_cap=true&include_24hr_vol=true&include_24hr_change=true&include_last_updated_at=true&precision=full', options)
        .then(response => response.json())
        .then(response => {
            let name = Object.keys(response)[0];
            let newResponse = { ...response[name] };
            newResponse.time = new Date();

            fs.writeFile('./resources/prices/' + req.params.id + '_prices.json', JSON.stringify(newResponse), function(err) {
                if(err) {
                    console.log(err);
                }
            });
            res.status(200).send(JSON.stringify({ data: newResponse }));
        })
        .catch(err => {
            res.status(500).send(JSON.stringify({ error: err }));
        });
}

async function fetchHistoricalPrice(req: Request, res: Response, options: any, period: Period) {
    let days = 1;
    switch (period) {
        case Period.month:
            days = 30;
            break;
        case Period.year:
            days = 365;
            break;
        default:
            break;
    }
    let to = Math.floor(Date.now() / 1000);
    let from = to - (days * 24 * 60 * 60);

    await fetch(COINGECKO_API + '/coins/' + req.params.id + '/market_chart/range?vs_currency=' + req.query.currency + '&from=' + from + '&to=' + to + '&precision=full', options)
        .then(response => response.json())
        .then(response => {
            response.time = new Date();

            fs.writeFile('./resources/prices/' + req.params.id + '_' + period + '.json', JSON.stringify(response), function(err) {
                if(err) {
                    console.log(err);
                }
            });
            res.status(200).send(JSON.stringify({ data: response }));
        })
        .catch(err => {
            res.status(500).send(JSON.stringify({ error: err }));
        });
}

export { fetchPrice, fetchHistoricalPrice };