/**
 * Victim and city data for the Iran 2026 Memorial
 * Data sourced from: https://fa.wikipedia.org/wiki/کشتارهای_دی_۱۴۰۴_ایران
 */

import { supabase } from '../utils/supabase.js';

// City coordinates (approximate) and death counts
// Coordinates are [longitude, latitude] for Three.js positioning
export const cities = [
    { id: 'tehran', name: 'Tehran', nameFa: 'تهران', coordinates: [51.3890, 35.6892], province: 'Tehran' },
    { id: 'karaj', name: 'Karaj', nameFa: 'کرج', coordinates: [51.0089, 35.8327], province: 'Alborz' },
    { id: 'isfahan', name: 'Isfahan', nameFa: 'اصفهان', coordinates: [51.6660, 32.6546], province: 'Isfahan' },
    { id: 'shiraz', name: 'Shiraz', nameFa: 'شیراز', coordinates: [52.5386, 29.5918], province: 'Fars' },
    { id: 'mashhad', name: 'Mashhad', nameFa: 'مشهد', coordinates: [59.6067, 36.2972], province: 'Razavi Khorasan' },
    { id: 'tabriz', name: 'Tabriz', nameFa: 'تبریز', coordinates: [46.2919, 38.0962], province: 'East Azerbaijan' },
    { id: 'rasht', name: 'Rasht', nameFa: 'رشت', coordinates: [49.5831, 37.2808], province: 'Gilan' },
    { id: 'kermanshah', name: 'Kermanshah', nameFa: 'کرمانشاه', coordinates: [47.0769, 34.3176], province: 'Kermanshah' },
    { id: 'sanandaj', name: 'Sanandaj', nameFa: 'سنندج', coordinates: [46.9961, 35.3113], province: 'Kurdistan' },
    { id: 'ahvaz', name: 'Ahvaz', nameFa: 'اهواز', coordinates: [48.6706, 31.3183], province: 'Khuzestan' },
    { id: 'gorgan', name: 'Gorgan', nameFa: 'گرگان', coordinates: [54.4348, 36.8425], province: 'Golestan' },
    { id: 'hamedan', name: 'Hamedan', nameFa: 'همدان', coordinates: [48.5146, 34.7981], province: 'Hamedan' },
    { id: 'qom', name: 'Qom', nameFa: 'قم', coordinates: [50.8759, 34.6399], province: 'Qom' },
    { id: 'kuhdasht', name: 'Kuhdasht', nameFa: 'کوهدشت', coordinates: [47.6111, 33.5275], province: 'Lorestan' },
    { id: 'fooladshahr', name: 'Fooladshahr', nameFa: 'فولادشهر', coordinates: [51.4173, 32.4835], province: 'Isfahan' },
    { id: 'marvdasht', name: 'Marvdasht', nameFa: 'مرودشت', coordinates: [52.8067, 29.8786], province: 'Fars' },
    { id: 'azna', name: 'Azna', nameFa: 'ازنا', coordinates: [49.4556, 33.4558], province: 'Lorestan' },
    { id: 'lordegan', name: 'Lordegan', nameFa: 'لردگان', coordinates: [50.8144, 31.5166], province: 'Chaharmahal' },
    { id: 'delfan', name: 'Delfan', nameFa: 'دلفان', coordinates: [47.6478, 34.0953], province: 'Lorestan' },
    { id: 'harsin', name: 'Harsin', nameFa: 'هرسین', coordinates: [47.5833, 34.2667], province: 'Kermanshah' },
    { id: 'neyriz', name: 'Neyriz', nameFa: 'نیریز', coordinates: [54.3197, 29.1928], province: 'Fars' },
    { id: 'malekshahi', name: 'Malekshahi', nameFa: 'ملکشاهی', coordinates: [46.5500, 33.3000], province: 'Ilam' },
    { id: 'izeh', name: 'Izeh', nameFa: 'ایذه', coordinates: [49.8701, 31.8240], province: 'Khuzestan' },
    { id: 'hafshejan', name: 'Hafshejan', nameFa: 'هفشجان', coordinates: [50.7933, 32.2253], province: 'Chaharmahal' },
    { id: 'qorveh', name: 'Qorveh', nameFa: 'قروه', coordinates: [47.8045, 35.1664], province: 'Kurdistan' },
    { id: 'khoshk-e-bijar', name: 'Khoshk-e Bijar', nameFa: 'خشکبیجار', coordinates: [49.7578, 37.3731], province: 'Gilan' },
    { id: 'salas-e-babajani', name: 'Salas-e Babajani', nameFa: 'ثلاثباباجانی', coordinates: [46.1494, 34.7358], province: 'Kermanshah' },
    { id: 'qeshm', name: 'Qeshm Island', nameFa: 'جزیره قشم', coordinates: [56.2704, 26.7547], province: 'Hormozgan' },
    { id: 'pardis', name: 'Pardis', nameFa: 'پردیس', coordinates: [51.7808, 35.7417], province: 'Tehran' },
    { id: 'yazdanshahr', name: 'Yazdanshahr', nameFa: 'یزدانشهر', coordinates: [56.3712, 30.8594], province: 'Kerman' },
    { id: 'eslamabad-e-gharb', name: 'Eslamabad-e Gharb', nameFa: 'اسلامآباد غرب', coordinates: [46.5269, 34.1084], province: 'Kermanshah' },
    { id: 'saveh', name: 'Saveh', nameFa: 'ساوه', coordinates: [50.3566, 35.0213], province: 'Markazi' },
    { id: 'abdanan', name: 'Abdanan', nameFa: 'آبدانان', coordinates: [47.4198, 32.9926], province: 'Ilam' },
    { id: 'salmas', name: 'Salmas', nameFa: 'سلماس', coordinates: [44.7669, 38.2028], province: 'West Azerbaijan' },
    { id: 'eyvan', name: 'Eyvan', nameFa: 'ایوان', coordinates: [46.1840, 33.9277], province: 'Ilam' },
    { id: 'larestan', name: 'Larestan', nameFa: 'لارستان', coordinates: [54.4500, 27.7500], province: 'Fars' },
    { id: 'bandar-abbas', name: 'Bandar Abbas', nameFa: 'بندرعباس', coordinates: [56.2667, 27.1833], province: 'Hormozgan' },
    { id: 'rostamabad', name: 'Rostamabad', nameFa: 'رستمآباد', coordinates: [49.4833, 36.8833], province: 'Gilan' },
    { id: 'ramsar', name: 'Ramsar', nameFa: 'رامسر', coordinates: [50.6782, 36.9174], province: 'Mazandaran' },
    { id: 'borujerd', name: 'Borujerd', nameFa: 'بروجرد', coordinates: [48.7522, 33.9111], province: 'Lorestan' },
    { id: 'shahin-shahr', name: 'Shahin Shahr', nameFa: 'شاهینشهر', coordinates: [51.5542, 32.8622], province: 'Isfahan' },
    { id: 'sabzevar', name: 'Sabzevar', nameFa: 'سبزوار', coordinates: [57.6819, 36.2126], province: 'Razavi Khorasan' },
    { id: 'bojnord', name: 'Bojnord', nameFa: 'بجنورد', coordinates: [57.3289, 37.4722], province: 'North Khorasan' },
    { id: 'bushehr', name: 'Bushehr', nameFa: 'بوشهر', coordinates: [50.8385, 28.9234], province: 'Bushehr' },
    { id: 'dehloran', name: 'Dehloran', nameFa: 'دهلران', coordinates: [47.2667, 32.6833], province: 'Ilam' },
    { id: 'shahr-e-rey', name: 'Shahr-e Rey', nameFa: 'شهر ری', coordinates: [51.4358, 35.5925], province: 'Tehran' },
    { id: 'tuyserkan', name: 'Tuyserkan', nameFa: 'تویسرکان', coordinates: [48.4537, 34.5498], province: 'Hamedan' },
    { id: 'langarud', name: 'Langarud', nameFa: 'لنگرود', coordinates: [50.1534, 37.1981], province: 'Gilan' },
    { id: 'pareh-sar', name: 'Pareh Sar', nameFa: 'پرهسر', coordinates: [49.0653, 37.6036], province: 'Gilan' },
    { id: 'arak', name: 'Arak', nameFa: 'اراک', coordinates: [49.6892, 34.0917], province: 'Markazi' },
    { id: 'shazand', name: 'Shazand', nameFa: 'شازند', coordinates: [49.4009, 33.9346], province: 'Markazi' },
    { id: 'abadan', name: 'Abadan', nameFa: 'آبادان', coordinates: [48.2917, 30.3333], province: 'Khuzestan' },
    { id: 'mehran', name: 'Mehran', nameFa: 'مهران', coordinates: [46.1667, 33.1167], province: 'Ilam' },
    { id: 'mobarakeh', name: 'Mobarakeh', nameFa: 'مبارکه', coordinates: [51.5042, 32.3475], province: 'Isfahan' },
    { id: 'shahreza', name: 'Shahreza', nameFa: 'شهرضا', coordinates: [51.8594, 32.0122], province: 'Isfahan' },
    { id: 'falavarjan', name: 'Falavarjan', nameFa: 'فلاورجان', coordinates: [51.5098, 32.5539], province: 'Isfahan' },
    { id: 'sedeh', name: 'Sedeh', nameFa: 'سده', coordinates: [52.1678, 30.7062], province: 'Fars' },
    { id: 'nain', name: 'Nain', nameFa: 'نائین', coordinates: [53.0875, 32.8601], province: 'Isfahan' },
    { id: 'khoy', name: 'Khoy', nameFa: 'خوی', coordinates: [44.9519, 38.5503], province: 'West Azerbaijan' },
    { id: 'bakharz', name: 'Bakharz', nameFa: 'باخرز', coordinates: [60.3095, 34.9979], province: 'Razavi Khorasan' },
    { id: 'takestan', name: 'Takestan', nameFa: 'تاکستان', coordinates: [49.7013, 36.0721], province: 'Qazvin' },
    { id: 'talesh', name: 'Talesh', nameFa: 'تالش', coordinates: [48.9073, 37.8016], province: 'Gilan' },
    { id: 'chalus', name: 'Chalus', nameFa: 'چالوس', coordinates: [51.4204, 36.6550], province: 'Mazandaran' },
    { id: 'sari', name: 'Sari', nameFa: 'ساری', coordinates: [53.0601, 36.5633], province: 'Mazandaran' },
    { id: 'babol', name: 'Babol', nameFa: 'بابل', coordinates: [52.6782, 36.5513], province: 'Mazandaran' },
    { id: 'manjil', name: 'Manjil', nameFa: 'منجیل', coordinates: [49.4056, 36.7417], province: 'Gilan' },
    { id: 'najafabad', name: 'Najafabad', nameFa: 'نجفآباد', coordinates: [51.3667, 32.6333], province: 'Isfahan' },
    { id: 'fardis', name: 'Fardis', nameFa: 'fardis', coordinates: [50.9917, 35.7278], province: 'Alborz' },
    { id: 'chenaran', name: 'Chenaran', nameFa: 'چناران', coordinates: [59.1210, 36.6450], province: 'Razavi Khorasan' },
    { id: 'lahijan', name: 'Lahijan', nameFa: 'لاهیجان', coordinates: [50.0031, 37.2045], province: 'Gilan' },
    { id: 'bandaranzali', name: 'Bandar Anzali', nameFa: 'بندر انزلی', coordinates: [49.4682, 37.4727], province: 'Gilan' },
    { id: 'tuyserkan', name: 'Tuyserkan', nameFa: 'تویسرکان', coordinates: [48.4537, 34.5498], province: 'Hamedan' },
];

/**
 * Empty victims array - will be populated by Supabase
 */
export const victims = [];

/**
 * Helper to find victims in a specific city
 */
export const getVictimsByCity = (cityId) => victims.filter(v => v.city_id === cityId);

/**
 * Helper to get city details by ID
 */
export const getCityById = (id) => cities.find(c => c.id === id);

/**
 * Key statistics for the memorial
 */
export const statistics = {
    '18000': 18000,
    '330000': 330000,
    '50000': 50000,
    '180': cities.length
};

/**
 * Fetches victim data from Supabase
 * @returns {Promise<Array>} List of victims
 */
export const getSupabaseVictims = async () => {
    try {
        const { data, error } = await supabase
            .from('victims')
            .select('*')
            .order('death_date', { ascending: false });

        if (error) throw error;

        // Populate the victims array for other components to use
        victims.length = 0; // Clear existing
        if (data) {
            victims.push(...data);
        }

        // Return victims directly - no local fallback after migration
        return data || [];
    } catch (error) {
        console.error('Error fetching victims from Supabase:', error);
        return [];
    }
};
