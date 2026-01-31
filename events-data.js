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
    // {
    // day: 9,                          // Day of month (1-31)
    // month: 9,                         // Month (0 = January, 8 = September, 11 = December)
    // year: 2025,                       // Year (e.g., 2024, 2025)
    // title: 'Kroegentocht',             // Event title
    // description: 'Een heerlijke avond bomvol enge deals ☠️', // Event description
    // location: 'Binnenstad Breda',                // Location name
    // time: '20:00-00:00',             // Time or duration (e.g., '14:00-17:00', 'Hele dag', '3 dagen')
    // link: 'https://www.facebook.com/media/set/?set=a.1229739325860933&type=3'            // Optional: link to event page (leave empty string '' if no link)
    // }, 


// {
//     day: 13,
//     month: 10,      // September (0=Jan, 1=Feb, ..., 8=Sep, ..., 11=Dec)
//     year: 2025,
//     title: 'Sinterklaas Pubquiz',
//     description: 'Een klassieke pubquiz met een zoete prijs 👀',
//     location: 'Cafe Vulling',
//     time: '20-00-22:00',
//     link: 'https://www.facebook.com/media/set/?set=a.1265868255581373&type=3'  ,
// },
// {
//     day: 27,
//     month: 10,      // September (0=Jan, 1=Feb, ..., 8=Sep, ..., 11=Dec)
//     year: 2025,
//     title: 'Kroegentocht',
//     description: 'Een gezellige avond bomvol deals 🤑',
//     location: 'Binnenstad Breda',
//     time: '20:00-01:00',
//     link: 'https://www.facebook.com/media/set/?set=a.1269588255209373&type=3',
// },
// {
//     day: 18,
//     month: 11,      // September (0=Jan, 1=Feb, ..., 8=Sep, ..., 11=Dec)
//     year: 2025,
//     title: 'Kerstgala',
//     description: 'HET feest van het jaar!🎉',
//     location: 'De Avenue',
//     time: '20:00-02:00',
//     link: 'https://www.instagram.com/p/DRaokjQghOi',
// },

// {
//     day: 22,
//     month: 0,      // September (0=Jan, 1=Feb, ..., 8=Sep, ..., 11=Dec)
//     year: 2026,
//     title: 'Nieuwjaarsborrel',
//     description: 'Trap t jaar af met een leuke borrel!',
//     location: 'Bruine Pij',
//     time: '20:00-00:00',
//     // link: 'img/placeholder1.png',
// },
    {
        day: 26,
        month: 1,      // September (0=Jan, 1=Feb, ..., 8=Sep, ..., 11=Dec)
        year: 2026,
        title: 'Carnavals Pubquiz',
        description: 'Kom bij van carnaval met een gezellige quiz',
        location: 'Cafe Vulling',
        time: '20:00-00:00',
        // link: 'img/placeholder1.png',
    },
    {
        day: 12,
        month: 2,      // September (0=Jan, 1=Feb, ..., 8=Sep, ..., 11=Dec)
        year: 2026,
        title: 'Pizza & Spelletjes',
        description: 'Een gezellige avond vol eten, spelletjes, en gezelligheid!',
        location: 'Op CMD!',
        time: 'Volgt nog',
        // link: 'img/placeholder1.png',
    },
	 {
        day: 26,
        month: 2,      // September (0=Jan, 1=Feb, ..., 8=Sep, ..., 11=Dec)
        year: 2026,
        title: 'Kroegentocht',
        description: 'Een heerlijk avondje bomvol deals en gezelligheid!',
        location: 'Binnenstad Breda',
        time: 'Volgt nog',
        // link: 'img/placeholder1.png',
    },
	
	
];

