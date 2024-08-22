import express, { Request, Response} from 'express';
import cors from 'cors';

const app = express();
app.use(express.json());
app.use(cors());

import walletRoutes from './routes/wallet';

app.use('/wallet', walletRoutes);

app.use((req: Request, res: Response) => {
  res.sendStatus(404);
});
  
export default app;