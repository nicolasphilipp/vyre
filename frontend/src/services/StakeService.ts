const STAKE_SERVICE_URL = 'http://localhost:3000/stake';

export async function queryPool(poolId: string, stake: number) {
    return fetch(STAKE_SERVICE_URL + '/' + poolId + "?stake=" + stake)
        .then((res) => res.json())
        .then((res) => res);
}
