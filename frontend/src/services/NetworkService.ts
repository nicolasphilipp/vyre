const NETWORK_SERVICE_URL = 'http://localhost:3000/network';

export async function getNetworkInformation() {
    return fetch(NETWORK_SERVICE_URL + '/')
        .then((res) => res.json())
        .then((res) => res);
}
