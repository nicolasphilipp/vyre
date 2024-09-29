import express, { Request, Response} from 'express';
import { estimateFees, getFullTxHistory, getTxDetails, getTxHistory, searchTx, submitTx } from '../utils/transaction';
const routes = express.Router();

routes.get('/:id', async (req: Request, res: Response) => {
    if(req.params.id.length !== 40){
      res.sendStatus(400);
      return;
    }
    
    if(req.query.limit && req.query.page) {
      let limit = parseInt(req.query.limit as string);
      let page = parseInt(req.query.page as string);
      // TODO validate exception while parsing

      let txs = JSON.parse(await getTxHistory(req.params.id, limit, page));
      if(txs.error){
        res.status(500).send(JSON.stringify({ error: txs.error }));
      } else {  
        res.status(200).send(JSON.stringify({ 
          totalResults: txs.totalResults, 
          totalPages: txs.totalPages, 
          currentPage: txs.currentPage, 
          transactions: txs.transactions  
        }));
      }
    } else {
      let txs = JSON.parse(await getFullTxHistory(req.params.id));
      
      if(txs.error){
        res.status(500).send(JSON.stringify({ error: txs.error }));
      } else {  
        res.status(200).send(JSON.stringify({ transactions: txs.transactions }));
      }
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

routes.post('/:id/search', async (req: Request, res: Response) => {
  if(req.params.id.length !== 40){
    res.sendStatus(400);
    return;
  }
   
  if(req.query.limit && req.query.page) {
    let limit = parseInt(req.query.limit as string);
    let page = parseInt(req.query.page as string);
    // TODO validate exception while parsing

    let startDate = req.body.startDate ? req.body.startDate : "01-01-2021";
    let endDate = req.body.endDate ? req.body.endDate : Date.now();

    let txs = JSON.parse(await searchTx(req.params.id, limit, page, req.body.receiver ? req.body.receiver : undefined, new Date(startDate), new Date(endDate)));
    if(txs.error){
      res.status(500).send(JSON.stringify({ error: txs.error }));
    } else {  
      res.status(200).send(JSON.stringify({ 
        totalResults: txs.totalResults, 
        totalPages: txs.totalPages, 
        currentPage: txs.currentPage, 
        transactions: txs.transactions  
      }));
    }
  }
});

routes.post('/estimate', async (req: Request, res: Response) => {
    if(req.body.amount <= 0) {
      res.sendStatus(400);
      return;
    }

    let estimate = JSON.parse(await estimateFees(req.body.senderId, req.body.receiver, req.body.amount));
    if(estimate.error){
        res.status(500).send(JSON.stringify({ error: estimate.error }));
    } else {  
        res.status(200).send(JSON.stringify({ fees: estimate.fees }));
    }
});
  
routes.post('/', async (req: Request, res: Response) => {
    if(req.body.amount <= 0 || req.body.passphrase.length < 10) {
        res.sendStatus(400);
        return;
    } 

    let tx = JSON.parse(await submitTx(req.body.senderId, req.body.receiver, req.body.amount, req.body.passphrase));
 
    // TODO only return error like this: "incorrect password provided" or smth like this and not the whole error object

    if(tx.error){
      res.status(500).send(JSON.stringify({ error: tx.error }));
    } else {  
      res.status(200).send(JSON.stringify({ transaction: tx.transaction }));
    }
});

export default routes;
