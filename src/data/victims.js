/**
 * Victim and city data for the Iran 2026 Memorial
 * Data sourced from: https://fa.wikipedia.org/wiki/کشتارهای_دی_۱۴۰۴_ایران
 */

import { supabase } from '../utils/supabase.js';


// City coordinates (approximate) and death counts
// Coordinates are [longitude, latitude] for Three.js positioning
export const cities = [
    {
        id: 'tehran',
        name: 'Tehran',
        nameFa: 'تهران',
        coordinates: [51.389, 35.689],
        deaths: 3500,
        confirmed: 217, // Minimum confirmed in hospitals for 18 Dey
        province: 'Tehran'
    },
    {
        id: 'rasht',
        name: 'Rasht',
        nameFa: 'رشت',
        coordinates: [49.583, 37.280],
        deaths: 850,
        confirmed: 12,
        province: 'Gilan'
    },
    {
        id: 'isfahan',
        name: 'Isfahan',
        nameFa: 'اصفهان',
        coordinates: [51.667, 32.667],
        deaths: 720,
        confirmed: 25,
        province: 'Isfahan'
    },
    {
        id: 'mashhad',
        name: 'Mashhad',
        nameFa: 'مشهد',
        coordinates: [59.606, 36.297],
        deaths: 680,
        confirmed: 18,
        province: 'Razavi Khorasan'
    },
    {
        id: 'shiraz',
        name: 'Shiraz',
        nameFa: 'شیراز',
        coordinates: [52.583, 29.617],
        deaths: 540,
        confirmed: 15,
        province: 'Fars'
    },
    {
        id: 'tabriz',
        name: 'Tabriz',
        nameFa: 'تبریز',
        coordinates: [46.292, 38.080],
        deaths: 480,
        confirmed: 10,
        province: 'East Azerbaijan'
    },
    {
        id: 'kermanshah',
        name: 'Kermanshah',
        nameFa: 'کرمانشاه',
        coordinates: [47.065, 34.314],
        deaths: 420,
        confirmed: 22,
        province: 'Kermanshah'
    },
    {
        id: 'ahvaz',
        name: 'Ahvaz',
        nameFa: 'اهواز',
        coordinates: [48.683, 31.317],
        deaths: 380,
        confirmed: 14,
        province: 'Khuzestan'
    },
    {
        id: 'qom',
        name: 'Qom',
        nameFa: 'قم',
        coordinates: [50.876, 34.640],
        deaths: 320,
        confirmed: 8,
        province: 'Qom'
    },
    {
        id: 'karaj',
        name: 'Karaj',
        nameFa: 'کرج',
        coordinates: [51.000, 35.833],
        deaths: 450,
        confirmed: 16,
        province: 'Alborz'
    },
    {
        id: 'malekshahi',
        name: 'Malekshahi',
        nameFa: 'ملکشاهی',
        coordinates: [46.131, 33.507],
        deaths: 85,
        confirmed: 7,
        province: 'Ilam'
    },
    {
        id: 'azna',
        name: 'Azna',
        nameFa: 'ازنا',
        coordinates: [49.456, 33.456],
        deaths: 65,
        confirmed: 6,
        province: 'Lorestan'
    },
    {
        id: 'kuhdasht',
        name: 'Kuhdasht',
        nameFa: 'کوهدشت',
        coordinates: [47.609, 33.533],
        deaths: 55,
        confirmed: 4,
        province: 'Lorestan'
    },
    {
        id: 'fooladshahr',
        name: 'Fooladshahr',
        nameFa: 'فولادشهر',
        coordinates: [51.408, 32.493],
        deaths: 78,
        confirmed: 5,
        province: 'Isfahan'
    },
    {
        id: 'marvdasht',
        name: 'Marvdasht',
        nameFa: 'مرودشت',
        coordinates: [52.802, 29.874],
        deaths: 62,
        confirmed: 4,
        province: 'Fars'
    },
    {
        id: 'gorgan',
        name: 'Gorgan',
        nameFa: 'گرگان',
        coordinates: [54.435, 36.842],
        deaths: 180,
        confirmed: 8,
        province: 'Golestan'
    },
    {
        id: 'lahijan',
        name: 'Lahijan',
        nameFa: 'لاهیجان',
        coordinates: [50.003, 37.209],
        deaths: 95,
        confirmed: 5,
        province: 'Gilan'
    },
    {
        id: 'bandaranzali',
        name: 'Bandar Anzali',
        nameFa: 'بندر انزلی',
        coordinates: [49.462, 37.473],
        deaths: 88,
        confirmed: 4,
        province: 'Gilan'
    },
    {
        id: 'hamedan',
        name: 'Hamedan',
        nameFa: 'همدان',
        coordinates: [48.515, 34.799],
        deaths: 210,
        confirmed: 9,
        province: 'Hamedan'
    },
    {
        id: 'sanandaj',
        name: 'Sanandaj',
        nameFa: 'سنندج',
        coordinates: [47.000, 35.317],
        deaths: 280,
        confirmed: 11,
        province: 'Kurdistan'
    },
    {
        id: 'lordegan',
        name: 'Lordegan',
        nameFa: 'لردگان',
        coordinates: [50.835, 31.508],
        deaths: 48,
        confirmed: 3,
        province: 'Chaharmahal'
    },
    {
        id: 'fardis',
        name: 'Fardis',
        nameFa: 'فردیس',
        coordinates: [50.986, 35.721],
        deaths: 125,
        confirmed: 8,
        province: 'Alborz'
    },
    {
        id: 'chenaran',
        name: 'Chenaran',
        nameFa: 'چناران',
        coordinates: [59.121, 36.645],
        deaths: 42,
        confirmed: 3,
        province: 'Razavi Khorasan'
    },
    {
        id: 'najafabad',
        name: 'Najafabad',
        nameFa: 'نجف‌آباد',
        coordinates: [51.368, 32.634],
        deaths: 95,
        confirmed: 6,
        province: 'Isfahan'
    }
];

// Identified victims - Now fetched from Supabase
export const victims = [];

// Get victims by city
export function getVictimsByCity(cityId) {
    // Note: This now refers to the empty local array. 
    // Live victims are handled in main.js via getSupabaseVictims()
    return victims.filter(v => v.city === cityId);
}

// Get city by id
export function getCityById(cityId) {
    return cities.find(c => c.id === cityId);
}

// Total statistics
export const statistics = {
    estimatedDeaths: 18000,
    confirmedDeaths: 5002,
    injured: 330000,
    detained: 50000,
    citiesAffected: 180,
    provincesAffected: 31,
    internationalProtests: 168,
    countriesWithProtests: 30
};

/**
 * Fetch victims from Supabase
 * Returns empty array if Supabase is not configured or fails
 */
export async function getSupabaseVictims() {
    try {
        const { data, error } = await supabase
            .from('victims')
            .select('*')
            .order('death_date', { ascending: true });

        if (error) throw error;
        if (!data || data.length === 0) return [];

        // Map Supabase data to the format used in the app
        return data.map(v => ({
            id: v.id,
            name: v.name_en,
            nameFa: v.name_fa,
            city: v.city_id,
            age: v.age,
            date: v.death_date,
            imageUrl: v.image_url,
            cityNameEn: v.city_name_en,
            cityNameFa: v.city_name_fa
        }));
    } catch (err) {
        console.warn('Supabase fetch failed:', err.message);
        return [];
    }
}

