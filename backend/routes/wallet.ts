import express, { Request, Response} from 'express';
import * as fs from 'fs';
const routes = express.Router();
const mnemonicWords = fs.readFileSync('./resources/mnemonic-words.txt', 'utf8').split('\n').map(word => word.trim()).filter(word => word.length > 0);

import { createWallet, getAddresses, getWallet, removeWallet, renameWallet, restoreWallet } from '../utils/wallet';

routes.post('/', async (req: Request, res: Response) => {
  if(req.body.passphrase.length < 10 || ![15, 24].includes(req.body.wordcount)) {
    res.sendStatus(400);
    return;
  }

  let createdWallet = JSON.parse(await createWallet(req.body.name, req.body.wordcount, req.body.passphrase));
  if(createdWallet.error){
    res.status(500).send(JSON.stringify({ error: createdWallet.error }));
  } else {  
    res.status(201).send(JSON.stringify({ mnemonic: createdWallet.mnemonic, wallet: createdWallet.wallet }));
  }
});

routes.post('/restore', async (req: Request, res: Response) => {
  if(req.body.passphrase.length < 10) {
    res.sendStatus(400);
    return;
  }

  let restoredWallet = JSON.parse(await restoreWallet(req.body.name, req.body.mnemonic, req.body.passphrase));
  if(restoredWallet.error){
    res.status(500).send(JSON.stringify({ error: restoredWallet.error }));
  } else {  
    res.status(200).send(JSON.stringify({ mnemonic: restoredWallet.mnemonic, wallet: restoredWallet.wallet }));
  }
});

routes.delete('/:id', async (req: Request, res: Response) => {
  if(req.params.id.length !== 40){
    res.sendStatus(400);
    return;
  }

  let remove = JSON.parse(await removeWallet(req.params.id));
  if(remove.error){
    res.status(500).send(JSON.stringify({ error: remove.error }));
  } else {  
    res.status(200).send(JSON.stringify({ status: remove.status }));
  }
});

routes.post('/:id/rename', async (req: Request, res: Response) => {
  if(req.params.id.length !== 40){
    res.sendStatus(400);
    return;
  }

  let renamedWallet = JSON.parse(await renameWallet(req.params.id, req.body.name));
  if(renamedWallet.error){
    res.status(500).send(JSON.stringify({ error: renamedWallet.error }));
  } else {
    res.status(200).send(JSON.stringify({ wallet: renamedWallet.wallet }));
  }
});

routes.get('/:id/address', async (req: Request, res: Response) => {
  if(req.params.id.length !== 40){
    res.sendStatus(400);
    return;
  }

  let address = JSON.parse(await getAddresses(req.params.id));
  if(address.error){
    res.status(500).send(JSON.stringify({ error: address.error }));
  } else { 
    res.status(200).send(JSON.stringify({ address: address.address }));
  }
});

routes.get('/:id/sync', async (req: Request, res: Response) => {
  if(req.params.id.length !== 40){
    res.sendStatus(400);
    return;
  }

  let sync = JSON.parse(await getWallet(req.params.id));
  if(sync.error){
    res.status(500).send(JSON.stringify({ error: sync.error }));
  } else {
    res.status(200).send(JSON.stringify({ wallet: sync.wallet }));
  }
});

routes.get('/mnemonic', async (req: Request, res: Response) => {
  let words = { 'words': mnemonicWords };
  res.status(200).send(words);
});

export default routes;
