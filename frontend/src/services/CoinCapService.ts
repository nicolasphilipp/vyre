const COINCAP_API_URL = 'https://api.coincap.io/v2';

export async function getAdaStats() {
    return fetch(COINCAP_API_URL + '/assets/cardano', {
        method: 'GET',
        redirect: 'follow'
    })
        .then((res) => res.text())
        .then((res) => res);
}
