import express, { Request, Response} from 'express';
import { getPool } from '../utils/stake';
import * as fs from 'fs';
const routes = express.Router();

const CEXPLORER_API = "https://js.cexplorer.io/api-static/pool/";

routes.get('/:id', async (req: Request, res: Response) => {
    // TEMPORARY
    const data = fs.readFileSync("./resources/atada.json", 'utf-8');
    const jsonData = JSON.parse(data);

    res.status(200).send(JSON.stringify({ pool: jsonData.data }));

    /*fetch(CEXPLORER_API + req.params.id + ".json")
        .then(res => res.json())
        .then(res => {
            res.status(200).send(JSON.stringify({ pool: res.data }));
        })
        .catch(err => {
            res.status(500).send(JSON.stringify({ error: err }));
        });*/
});

export default routes;