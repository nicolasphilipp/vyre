const STAKE_SERVICE_URL = 'http://localhost:3000/stake';

export async function queryPool(poolId: string) {
    return fetch(STAKE_SERVICE_URL + '/' + poolId)
        .then((res) => res.json())
        .then((res) => res);
}

export async function getAllPools(page?: number, limit?: number, search?: string) {
    const params = new URLSearchParams();
    if(page) {
        params.append('page', page.toString());
    } 
    if(limit) {
        params.append('limit', limit.toString());
    }
    if(search) {
        params.append('search', search);
    }
    return fetch(STAKE_SERVICE_URL + (params.toString() ? `?${params.toString()}` : '/'))
        .then((res) => res.json())
        .then((res) => res);
}

export async function startDelegation(walletId: string, poolId: string, passphrase: string) {
    return fetch(STAKE_SERVICE_URL + '/start', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ walletId: walletId, poolId: poolId, passphrase: passphrase })
    })
        .then((res) => res.json())
        .then((res) => res);
}

export async function stopDelegation(walletId: string, passphrase: string) {
    return fetch(STAKE_SERVICE_URL + '/stop', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ walletId: walletId, passphrase: passphrase })
    })
        .then((res) => res.json())
        .then((res) => res);
}

export async function estimateDelegation(walletId: string) {
    return fetch(STAKE_SERVICE_URL + '/estimate', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ walletId: walletId })
    })
        .then((res) => res.json())
        .then((res) => res);
}