const WALLET_SERVICE_URL = 'http://localhost:3000/wallet';

export async function createWallet(name: string, wordcount: number, passphrase: string) {
    return fetch(WALLET_SERVICE_URL, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name: name, wordcount: wordcount, passphrase: passphrase })
    })
        .then((res) => res.json())
        .then((res) => res);
}

export async function restoreWallet(name: string, mnemonic: string[], passphrase: string) {
    return fetch(WALLET_SERVICE_URL + '/restore', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name: name, mnemonic: mnemonic, passphrase: passphrase })
    })
        .then((res) => res.json())
        .then((res) => res);
}

export function removeWallet(id: string) {
    return fetch(WALLET_SERVICE_URL + '/' + id, {
        method: 'DELETE'
    });
}

export async function getAddress(id: string) {
    return fetch(WALLET_SERVICE_URL + '/' + id + '/address')
        .then((res) => res.json())
        .then((res) => res);
}

export async function syncWallet(id: string) {
    return fetch(WALLET_SERVICE_URL + '/' + id + '/sync')
        .then((res) => res.json())
        .then((res) => res);
}

export async function renameWallet(id: string, name: string) {
    return fetch(WALLET_SERVICE_URL + '/' + id + '/rename', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name: name })
    })
        .then((res) => res.json())
        .then((res) => res);
}

export async function getMnemonicWords() {
    return fetch(WALLET_SERVICE_URL + '/mnemonic')
        .then((res) => res.json())
        .then((res) => res); 
}