import express, { Request, Response} from 'express';
import { getPool } from '../utils/stake';
const routes = express.Router();

routes.get('/:id', async (req: Request, res: Response) => {
    if(req.query.stake) {
        let stake = parseInt(req.query.stake as string);
        
        let pool = JSON.parse(await getPool(stake, req.params.id));
        if(pool.error){
            res.status(500).send(JSON.stringify({ error: pool.error }));
        } else { 
            res.status(200).send(JSON.stringify({ pool: pool.pool }));
        }
    }
});

export default routes;