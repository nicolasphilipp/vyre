export function formatNumber(value: number): string {
    const [integerPart, decimalPart] = value.toString().split('.');

    const formattedInteger = parseInt(integerPart, 10).toLocaleString('en-US');
    const formattedDecimal = decimalPart ? decimalPart.padEnd(2, '0') : '00';

    return `${formattedInteger}.${formattedDecimal}`;
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