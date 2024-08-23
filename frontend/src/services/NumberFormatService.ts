export function formatNumber(value: number): string {
    const [integerPart, decimalPart] = value.toString().split('.');

    const formattedInteger = parseInt(integerPart, 10).toLocaleString('en-US');
    const formattedDecimal = decimalPart ? decimalPart.padEnd(2, '0') : '00';

    return `${formattedInteger}.${formattedDecimal}`;
}