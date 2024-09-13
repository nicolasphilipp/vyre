import { WalletServer, Seed, ShelleyWallet, AddressWallet } from 'cardano-wallet-js';
let walletServer = WalletServer.init('http://localhost:8090/v2');

const loveLaceToAda = 1000000;

// TODO implement pagination

async function getTxHistory(id: string, results: number, start: Date, end: Date) {
    try {
        let wallet = await walletServer.getShelleyWallet(id);
        let transactions = await wallet.getTransactions(start, end);

        // return totalResults, currentPage, resultCount for pagination
        return JSON.stringify({ transactions: transactions });
    } catch(e) {
        console.log(e);

        return JSON.stringify({ error: e });
    }
}

async function getTxDetails(walletId: string, txId: string) {
    try {
        let wallet = await walletServer.getShelleyWallet(walletId);
        let transaction = await wallet.getTransaction(txId);

        return JSON.stringify({ transaction: transaction });
    } catch(e) {
        console.log(e);

        return JSON.stringify({ error: e });
    }
}

async function estimateFees(senderId: string, receiverId: string, amount: number) {
    try {
        let wallet = await walletServer.getShelleyWallet(senderId);
        let receiver = new AddressWallet(receiverId);
        let estimatedFees = await wallet.estimateFee([receiver], [amount * loveLaceToAda]);

        return JSON.stringify({ fees: estimatedFees });
    } catch(e) {
        console.log(e);

        return JSON.stringify({ error: e });
    }
}

async function submitTx(senderId: string, receiverId: string, amount: number, passphrase: string) {
    try {
        let wallet = await walletServer.getShelleyWallet(senderId);
        let receiver = new AddressWallet(receiverId);
        let payment = await wallet.sendPayment(passphrase, [receiver], [amount * loveLaceToAda]);

        return JSON.stringify({ transaction: payment });
    } catch(e) {
        console.log(e);

        return JSON.stringify({ error: e });
    }
}

export { getTxHistory, getTxDetails, estimateFees, submitTx };