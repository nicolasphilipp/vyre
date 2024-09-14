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