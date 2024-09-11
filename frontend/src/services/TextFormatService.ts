export function formatNumber(value: number): string {
    const roundedValue = value.toFixed(2);
    const [integerPart, decimalPart] = roundedValue.split('.');
    
    const formattedInteger = parseInt(integerPart, 10).toLocaleString('en-US');
    return `${formattedInteger}.${decimalPart}`;
}

export function formatString(input: string): string {
    if(input){
        const visibleCharacters = 8;
  
        const start = input.slice(0, visibleCharacters);
        const end = input.slice(-visibleCharacters);
      
        return `${start}...${end}`;
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
