export function getYesterdaysDate(): string {
    const today = new Date();
    today.setDate(today.getDate() - 1);

    const day = String(today.getDate()).padStart(2, '0');
    const month = String(today.getMonth() + 1).padStart(2, '0'); 
    const year = today.getFullYear();

    return `${day}-${month}-${year}`;
}