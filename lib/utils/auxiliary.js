export function parseDate(dateString) {
    const months = {
        Jan: '01', Fev: '02', Mar: '03', Abr: '04', Mai: '05', Jun: '06',
        Jul: '07', Ago: '08', Set: '09', Out: '10', Nov: '11', Dez: '12'
    };

    const [day, month, year, time] = dateString.split(' ');
    const formattedDate = `${year}-${months[month]}-${day}T${time}:00`;

    return new Date(formattedDate);
}

export const refs = {
    "draft": "draft",
    "active": "active",
    "finished": "finished",
}
