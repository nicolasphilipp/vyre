import express, { Request, Response} from 'express';
import { estimateFees, getTxDetails, getTxHistory, submitTx } from '../utils/transaction';
const routes = express.Router();

routes.get('/:id', async (req: Request, res: Response) => {
    if(req.params.id.length !== 40){
      res.sendStatus(400);
      return;
    }
    
    let txs = JSON.parse(await getTxHistory(req.params.id, 10, new Date(2021, 0, 1), new Date(Date.now())));
    if(txs.error){
      res.status(500).send(JSON.stringify({ error: txs.error }));
    } else {  
      res.status(200).send(JSON.stringify({ transactions: txs.transactions }));
    }
});

routes.get('/:id/detail/:txId', async (req: Request, res: Response) => {
    if(req.params.id.length !== 40){
      res.sendStatus(400);
      return;
    }
    
    let tx = JSON.parse(await getTxDetails(req.params.id, req.params.txId));
    if(tx.error){
      res.status(500).send(JSON.stringify({ error: tx.error }));
    } else {  
      res.status(200).send(JSON.stringify({ transaction: tx.transaction }));
    }
});

routes.post('/estimate', async (req: Request, res: Response) => {
    if(req.body.sender.length !== 40 || req.body.receiver.length !== 40 || req.body.amount <= 0) {
        res.sendStatus(400);
        return;
    }

    let estimate = JSON.parse(await estimateFees(req.body.sender, req.body.receiver, req.body.amount));
    if(estimate.error){
        res.status(500).send(JSON.stringify({ error: estimate.error }));
    } else {  
        res.status(200).send(JSON.stringify({ fees: estimate.fees }));
    }
});
  
routes.post('/', async (req: Request, res: Response) => {
    if(req.body.sender.length !== 40 || req.body.receiver.length !== 40 || req.body.amount <= 0 || req.body.passphrase.length < 10) {
        res.sendStatus(400);
        return;
    } 

    let tx = JSON.parse(await submitTx(req.body.sender, req.body.receiver, req.body.amount, req.body.passphrase));
    if(tx.error){
        res.status(500).send(JSON.stringify({ error: tx.error }));
    } else {  
        res.status(200).send(JSON.stringify({ transaction: tx.transaction }));
    }
});

export default routes;
