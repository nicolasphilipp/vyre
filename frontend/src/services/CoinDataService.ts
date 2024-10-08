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

export async function getCoinHistoricPrices(id: string, period: string, currency: string) {
    return fetch(COINDATA_SERVICE_URL + '/' + id + '/historic?period=' + period + '&currency=' + currency)
        .then((res) => res.json())
        .then((res) => res);
}