const COINDATA_SERVICE_URL = 'http://localhost:3000/coinData';

export async function getCoinPriceData(id: string) {
    return fetch(COINDATA_SERVICE_URL + '/' + id + '/price')
        .then((res) => res.json())
        .then((res) => res);
}

export async function getCoinInfo(id: string) {
    return fetch(COINDATA_SERVICE_URL + '/' + id + '/info')
        .then((res) => res.json())
        .then((res) => res);
}

export async function getCoinHistoricPrices(id: string, from: number, to: number) {
    return fetch(COINDATA_SERVICE_URL + '/' + id + '/historic?from=' + from + '&to=' + to)
        .then((res) => res.json())
        .then((res) => res);
}