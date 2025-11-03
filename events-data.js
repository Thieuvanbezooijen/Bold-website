// ===== EVENTS DATA =====
// Easy way to add events: Just add objects to this array
// 
// Format for each event:
// {
//     day: 15,                          // Day of month (1-31)
//     month: 8,                         // Month (0 = January, 8 = September, 11 = December)
//     year: 2024,                       // Year (e.g., 2024, 2025)
//     title: 'Event Title',             // Event title
//     description: 'Event description', // Event description
//     location: 'Breda',                // Location name
//     time: '14:00-17:00',             // Time or duration (e.g., '14:00-17:00', 'Hele dag', '3 dagen')
//     link: 'introkamp.html'            // Optional: link to event page (leave empty string '' if no link)
// }
//
// Events are automatically sorted by date and displayed in timeline and calendar.

const EVENTS_DATA = [
    {
        day: 13,
        month: 10,      // September (0=Jan, 1=Feb, ..., 8=Sep, ..., 11=Dec)
        year: 2025,
        title: 'Sinterklaas Pubquiz',
        description: 'Een klassieke pubquiz met een zoete prijs 👀',
        location: 'Cafe Vulling',
        time: '19:00-22:00',
    },
    {
        day: 27,
        month: 10,      // September (0=Jan, 1=Feb, ..., 8=Sep, ..., 11=Dec)
        year: 2025,
        title: 'Kroegentocht',
        description: 'Een gezellige avond bomvol deals 🤑',
        location: 'T.B.D',
        time: '20:00-00:00',
    },
    {
        day: 18,
        month: 11,      // September (0=Jan, 1=Feb, ..., 8=Sep, ..., 11=Dec)
        year: 2025,
        title: 'Kerstgala',
        description: 'HET feest van het jaar!🎉',
        location: 'De Avenue',
        time: '20:00-00:00',
    },
    
];

