import express, { Request, Response} from 'express';
import * as fs from 'fs';
const routes = express.Router();
const mnemonicWords = fs.readFileSync('./resources/mnemonic-words.txt', 'utf8').split('\n').map(word => word.trim()).filter(word => word.length > 0);

import { createWallet, getAddresses, getAvailableBalance, getDelegation, getRewardBalance, getTotalBalance, getWallet, removeWallet, renameWallet, restoreWallet } from '../utils/wallet';

routes.post('/', async (req: Request, res: Response) => {
  // validate wordcount
  if(req.body.passphrase.length < 10){
    res.sendStatus(400);
    return;
  }
  let createdWallet = await createWallet(req.body.name, req.body.wordcount, req.body.passphrase);
  res.status(201).send(JSON.stringify(createdWallet));
});

routes.post('/restore', async (req: Request, res: Response) => {
  let restoredWallet = await restoreWallet(req.body.name, req.body.mnemonic, req.body.passphrase);
  res.status(200).send(JSON.stringify(restoredWallet));
});

routes.delete('/:id', async (req: Request, res: Response) => {
  if(req.params.id.length !== 40){
    res.sendStatus(400);
    return;
  }

  await removeWallet(req.params.id);
  res.sendStatus(204);
});

routes.post('/:id/rename', async (req: Request, res: Response) => {
  if(req.params.id.length !== 40){
    res.sendStatus(400);
    return;
  }
  
  let renamedWallet = await renameWallet(req.params.id, req.body.name);
  res.status(200).send(JSON.stringify(renamedWallet));
});

routes.get('/:id/address', async (req: Request, res: Response) => {
  if(req.params.id.length !== 40){
    res.sendStatus(400);
    return;
  }

  let address = await getAddresses(req.params.id);
  res.status(200).send(JSON.stringify(address));
});

routes.get('/:id/sync', async (req: Request, res: Response) => {
  if(req.params.id.length !== 40){
    res.sendStatus(400);
    return;
  }

  let wallet = await getWallet(req.params.id);
  res.status(200).send(JSON.stringify(wallet));
});

routes.get('/mnemonic', async (req: Request, res: Response) => {
  let words = { 'words': mnemonicWords };
  res.status(200).send(words);
});


// -------------------------

routes.get('/available', (req: Request, res: Response) => {
  let balance = getAvailableBalance(req.body.wallet);
  res.status(200).send(balance);
});

routes.get('/reward', (req: Request, res: Response) => {
  let balance = getRewardBalance(req.body.wallet);
  res.status(200).send(balance);
});

routes.get('/total', (req: Request, res: Response) => {
  let balance = getTotalBalance(req.body.wallet);
  res.status(200).send(balance);
});

routes.get('/delegation', (req: Request, res: Response) => {
  let delegationInfo = getDelegation(req.body.wallet);
  res.status(200).send(delegationInfo);
});

export default routes;
