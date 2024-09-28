export function formatNumber(value: number, decimals: number): string {
    const roundedValue = value.toFixed(decimals);
    const [integerPart, decimalPart] = roundedValue.split('.');
    
    const formattedInteger = parseInt(integerPart, 10).toLocaleString('en-US');
    if(parseInt(decimalPart) === 0) {
        return `${formattedInteger}.00`;
    }
    return `${formattedInteger}.${decimalPart}`;
}

export function numberToPercent(value: number, decimals: number): string {
    const percentValue = value * 100;
    const formattedValue = percentValue.toFixed(decimals);
    return `${formattedValue}%`;
}

export function formatAdaAddress(input: string, visibleCharacters: number): string {
    if(input) {  
        const start = input.slice(0, visibleCharacters);
        const end = input.slice(-visibleCharacters);
        return `${start}...${end}`;
    }
    return "";
}

export function cutText(input: string, visibleCharacters: number): string {
    if(input) {
        const start = input.slice(0, visibleCharacters);
        return `${start}...`;
    }
    return "";
}

export function hexToAsciiString(hexString: string): string {
     if (hexString.length % 2 !== 0) {
        throw new Error("Invalid hex string. Length must be even.");
    }

    let asciiString = '';
    for (let i = 0; i < hexString.length; i += 2) {
        const hexPair = hexString.substr(i, 2);
        const decimalValue = parseInt(hexPair, 16);
        asciiString += String.fromCharCode(decimalValue);
    }
    return asciiString;
  }

export function parseDate(dateString: string): string {
    const date = new Date(dateString);
    const day = date.getUTCDate().toString().padStart(2, '0');  
    const month = (date.getUTCMonth() + 1).toString().padStart(2, '0');
    return `${day}.${month}.`;
}

export function convertUnixToDate(unixTimestamp: number): string {
    return new Date(unixTimestamp * 1000).toUTCString();
}