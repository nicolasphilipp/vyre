const NETWORK_SERVICE_URL = 'http://localhost:3000/network';

export async function getNetworkInformation() {
    return fetch(NETWORK_SERVICE_URL + '/')
        .then((res) => res.json())
        .then((res) => res);
}

export function getRemainingEpochTime(currentSlot: number) {
    let oneDay = 86400;
    let remaining = oneDay - currentSlot;

    let hours = Math.floor(remaining / 3600);
    let minutes = Math.floor((remaining - hours * 3600) / 60);
    let seconds = remaining - hours * 3600 - minutes * 60;

    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}