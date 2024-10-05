import express, { Request, Response} from 'express';
import { getNetworkInformation } from '../utils/network';
const routes = express.Router();

routes.get('/', async (req: Request, res: Response) => {
    let result = JSON.parse(await getNetworkInformation());
    if(result.error){
      res.status(500).send(JSON.stringify({ error: result.error }));
    } else {  
      res.status(200).send(JSON.stringify({ information: result.information }));
    }
});

export default routes;