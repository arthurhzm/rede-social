export function formatDate(date: string, country: string): string {
    const dateObj = new Date(date);
    let formattedDate: string;

    if (country === 'US') {
        
        formattedDate = dateObj.toISOString().split('T')[0];
    } else {
        // Formato DD/MM/YYYY
        const day = String(dateObj.getDate()).padStart(2, '0');
        const month = String(dateObj.getMonth() + 1).padStart(2, '0');
        const year = dateObj.getFullYear();
        formattedDate = `${day}/${month}/${year}`;
    }

    return formattedDate;
}