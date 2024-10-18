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

export function parseDateTime(dateTimeString: string): string {
    const date = new Date(dateTimeString);
    return date.toLocaleString('en-US', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true, 
    });
}

export function formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'   
    }); 
};

export function formatDayMonth(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        day: '2-digit',
        month: 'short',   
    }); 
};

export function formatTime(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
    });
};

export function convertUnixToDate(unixTimestamp: number): string {
    return new Date(unixTimestamp * 1000).toUTCString();
}

export function extractTicker(name: string, ticker: boolean): string {
    if(name) {
        if(ticker) {
            return name.slice(0, name.indexOf("]") + 1);
        } else {
            return name.slice(name.indexOf("]") + 1);
        }
    } 
    return "";
}