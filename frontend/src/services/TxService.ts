import { CalendarDate } from "@nextui-org/react";

const TX_SERVICE_URL = 'http://localhost:3000/tx';

export async function estimateFees(senderId: string, receiver: string, amount: number) {
    return fetch(TX_SERVICE_URL + '/estimate', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ senderId: senderId, receiver: receiver, amount: amount })
    })
        .then((res) => res.json())
        .then((res) => res);
}

export async function submitTx(senderId: string, receiver: string, amount: number, passphrase: string) {
    return fetch(TX_SERVICE_URL + '/', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ senderId: senderId, receiver: receiver, amount: amount, passphrase: passphrase })
    })
        .then((res) => res.json())
        .then((res) => res);
}

export async function getTxHistory(walletId: string, page?: number, limit?: number) {
    if(page && limit) {
        return fetch(TX_SERVICE_URL + '/' + walletId + "?page=" + page + "&limit=" + limit)
            .then((res) => res.json())
            .then((res) => res);
    } else {
        return fetch(TX_SERVICE_URL + '/' + walletId)
            .then((res) => res.json())
            .then((res) => res);
    }
}

export async function searchTxHistory(walletId: string, page: number, limit: number, receiver?: string, startDate?: CalendarDate, endDate?: CalendarDate) {
    return fetch(TX_SERVICE_URL + '/' + walletId + "/search?page=" + page + "&limit=" + limit, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ receiver: receiver, startDate: startDate?.toString(), endDate: endDate?.toString() })
    })
        .then((res) => res.json())
        .then((res) => res);
}
