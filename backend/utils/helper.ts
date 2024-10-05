export function getYesterdaysDate(): string {
    const today = new Date();
    today.setDate(today.getDate() - 1);

    const day = String(today.getDate()).padStart(2, '0');
    const month = String(today.getMonth() + 1).padStart(2, '0'); 
    const year = today.getFullYear();

    return `${day}-${month}-${year}`;
}

export function isWithinThreeHours(timestamp: string): boolean {
    const threeHoursInMs = 3 * 60 * 60 * 1000; 
    const currentTime = new Date(); 
    const targetTime = new Date(timestamp);
  
    const timeDifference = Math.abs(currentTime.getTime() - targetTime.getTime());
    return timeDifference <= threeHoursInMs;
  }
  