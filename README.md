# Vyre

To run the application, a running **cardano-node**, **cardano-wallet**, **cardano-db-sync** and **postgres db** are needed. Simply start the needed services defined in the compose file using:

> docker compose up -d

Keep in mind, it can take a lot of time to sync your node with the blockchain even when its only a testnet.

## Backend

> cd backend/

> npm install

> npm run dev


## Frontend

> cd frontend/

> npm install

> npm run dev
