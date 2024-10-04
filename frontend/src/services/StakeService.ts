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
