import express, { Request, Response} from 'express';
import cors from 'cors';
require('dotenv').config()

const app = express();
app.use(express.json());
app.use(cors());

import walletRoutes from './routes/wallet';
import txRoutes from './routes/transaction';
import stakeRoutes from './routes/stake';
import coinDataRoutes from './routes/coinData';
import networkRoutes from './routes/network';

app.use('/wallet', walletRoutes);
app.use('/tx', txRoutes);
app.use('/stake', stakeRoutes);
app.use('/coinData', coinDataRoutes);
app.use('/network', networkRoutes);

app.use((req: Request, res: Response) => {
  res.sendStatus(404);
});
  
export default app;