# Vyre

To run the application, a running **cardano-node** and **cardano-wallet** are needed.

> cardano-node run --config config.json --topology topology.json --database-path ./db --socket-path ./db/node.socket

> cardano-wallet serve --port 8090 --node-socket ./db/node.socket --testnet byron-genesis.json --database ./wallet-db --token-metadata-server https://metadata.cardano-testnet.iohkdev.io

## Backend

> cd backend/

> npm install

> npm run dev


## Frontend

> cd frontend/

> npm install

> npm run dev
