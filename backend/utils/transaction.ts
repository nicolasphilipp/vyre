import { WalletServer, Seed, ShelleyWallet, AddressWallet, TransactionWallet } from 'cardano-wallet-js';
let walletServer = WalletServer.init('http://localhost:8090/v2');

const loveLaceToAda = 1000000;

// TODO use Dtos instead of passing normal parameters

async function getFullTxHistory(walletId: string) {
    try {
        let wallet = await walletServer.getShelleyWallet(walletId);
        let transactions = await wallet.getTransactions();
        return JSON.stringify({ transactions: transactions });
    } catch(e) {
        return JSON.stringify({ error: e });
    }
}

async function getTxHistory(walletId: string, resultCount: number, page: number) {
    try {
        let wallet = await walletServer.getShelleyWallet(walletId);
        let transactions = await wallet.getTransactions();

        let results: TransactionWallet[] = [];
        let index = (resultCount * (page - 1 >= 0 ? page - 1 : 0));
        for(let i = index; i < index + resultCount; i++) {
            if(transactions[i] && transactions[i].inserted_at) {
                results.push(transactions[i]);
            }
        }

        return JSON.stringify({ 
            totalResults: transactions.length, 
            totalPages: Math.ceil((transactions.length / resultCount)), 
            currentPage: page, 
            transactions: results 
        });
    } catch(e) {
        console.log(e);

        return JSON.stringify({ error: e });
    }
}

async function searchTx(walletId: string, resultCount: number, page: number, receiverId?: string, start?: Date, end?: Date) {
    try {
        let wallet = await walletServer.getShelleyWallet(walletId);
        let transactions = await wallet.getTransactions(start, end);
        let allResults: TransactionWallet[] = [];

        for(let i = 0; i < transactions.length; i++) {
            if(transactions[i].inserted_at) {
                if(receiverId) {
                    if(transactions[i].outputs[0].address.startsWith(receiverId)) {
                        allResults.push(transactions[i]);
                    }
                } else {
                    allResults.push(transactions[i]);
                }
            }
        }

        let results: TransactionWallet[] = [];
        let index = (resultCount * (page - 1 >= 0 ? page - 1 : 0));
        for(let i = index; i < index + resultCount; i++) {
            if(allResults[i]) {
                results.push(allResults[i]);
            }
        }

        return JSON.stringify({ 
            totalResults: allResults.length, 
            totalPages: Math.ceil((allResults.length / resultCount)), 
            currentPage: page, 
            transactions: results 
        });
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

async function estimateFees(senderId: string, receiverAddress: string, amount: number) {
    try {
        let wallet = await walletServer.getShelleyWallet(senderId);
        let receiver = new AddressWallet(receiverAddress);
        let estimatedFees = await wallet.estimateFee([receiver], [amount * loveLaceToAda]);

        return JSON.stringify({ fees: estimatedFees });
    } catch(e) {
        return JSON.stringify({ error: e });
    }
}

async function submitTx(senderId: string, receiverAddress: string, amount: number, passphrase: string) {
    try {
        let wallet = await walletServer.getShelleyWallet(senderId);
        let receiver = new AddressWallet(receiverAddress);
        let payment = await wallet.sendPayment(passphrase, [receiver], [amount * loveLaceToAda]);

        return JSON.stringify({ transaction: payment });
    } catch(e) {
        return JSON.stringify({ error: e });
    }
}

export { getFullTxHistory, getTxHistory, getTxDetails, estimateFees, submitTx, searchTx };