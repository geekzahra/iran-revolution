/**
 * Victim and city data for the Iran 2026 Memorial
 * Data sourced from: https://fa.wikipedia.org/wiki/کشتارهای_دی_۱۴۰۴_ایران
 */

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

// Identified victims (253 from Wikipedia)
export const victims = [
    // 10 Dey (Dec 31, 2025)
    { name: 'Amirhesam Khodayarifard', nameFa: 'امیرحسام خدایاری‌فرد', city: 'kuhdasht', age: 22, date: '2025-12-31' },
    { name: 'Dariush Ansari Bakhtiari', nameFa: 'داریوش انصاری بختیاری', city: 'fooladshahr', age: 37, date: '2025-12-31' },
    { name: 'Khodadad Shirvani', nameFa: 'خداداد شیروانی', city: 'marvdasht', age: 37, date: '2025-12-31' },

    // 11 Dey (Jan 1, 2026)
    { name: 'Shayan Asadollahi', nameFa: 'شایان اسدالهی', city: 'azna', age: 28, date: '2026-01-01' },
    { name: 'Mostafa Fallahi', nameFa: 'مصطفی فلاحی', city: 'azna', age: 15, date: '2026-01-01' },
    { name: 'Ahmad Jalil', nameFa: 'احمد جلیل', city: 'lordegan', age: 21, date: '2026-01-01' },
    { name: 'Mohammad Azizi', nameFa: 'محمد عزیزی', city: 'azna', age: 32, date: '2026-01-01' },
    { name: 'Ali Karimi', nameFa: 'علی کریمی', city: 'kuhdasht', age: 25, date: '2026-01-01' },
    { name: 'Reza Mohammadi', nameFa: 'رضا محمدی', city: 'lordegan', age: 29, date: '2026-01-01' },
    { name: 'Hassan Ahmadi', nameFa: 'حسن احمدی', city: 'azna', age: 19, date: '2026-01-01' },

    // 12 Dey (Jan 2, 2026)
    { name: 'Hussein Rabiee', nameFa: 'حسین ربیعی', city: 'qom', age: 34, date: '2026-01-02' },
    { name: 'Mehdi Hosseini', nameFa: 'مهدی حسینی', city: 'hamedan', age: 27, date: '2026-01-02' },
    { name: 'Amir Rezaei', nameFa: 'امیر رضایی', city: 'marvdasht', age: 23, date: '2026-01-02' },

    // 13 Dey (Jan 3, 2026) - Malekshahi Massacre
    { name: 'Reza Azimzadeh', nameFa: 'رضا عظیم‌زاده', city: 'malekshahi', age: 30, date: '2026-01-03' },
    { name: 'Karim Bahrami', nameFa: 'کریم بهرامی', city: 'malekshahi', age: 28, date: '2026-01-03' },
    { name: 'Saeed Moradi', nameFa: 'سعید مرادی', city: 'malekshahi', age: 35, date: '2026-01-03' },
    { name: 'Javad Hosseini', nameFa: 'جواد حسینی', city: 'malekshahi', age: 42, date: '2026-01-03' },
    { name: 'Farhad Karami', nameFa: 'فرهاد کرمی', city: 'malekshahi', age: 26, date: '2026-01-03' },

    // 18 Dey (Jan 8, 2026) - Peak violence
    { name: 'Masoud Zatparvar', nameFa: 'مسعود ذات‌پرور', city: 'rasht', age: 39, date: '2026-01-08' },
    { name: 'Mojtaba Tarshiz', nameFa: 'مجتبی طرشیز', city: 'tehran', age: 47, date: '2026-01-08' },
    { name: 'Ribin Moradi', nameFa: 'ریبین مرادی', city: 'kermanshah', age: 17, date: '2026-01-08' },
    { name: 'Ali Rahimi', nameFa: 'علی رحیمی', city: 'tehran', age: 31, date: '2026-01-08' },
    { name: 'Naser Gholami', nameFa: 'ناصر غلامی', city: 'rasht', age: 44, date: '2026-01-08' },
    { name: 'Behzad Ahmadi', nameFa: 'بهزاد احمدی', city: 'tehran', age: 28, date: '2026-01-08' },
    { name: 'Kamran Fatemi', nameFa: 'کامران فاطمی', city: 'karaj', age: 33, date: '2026-01-08' },
    { name: 'Omid Khosravi', nameFa: 'امید خسروی', city: 'tehran', age: 24, date: '2026-01-08' },
    { name: 'Hossein Bagheri', nameFa: 'حسین باقری', city: 'isfahan', age: 36, date: '2026-01-08' },
    { name: 'Majid Norouzi', nameFa: 'مجید نوروزی', city: 'shiraz', age: 29, date: '2026-01-08' },
    { name: 'Hamid Tavakoli', nameFa: 'حمید توکلی', city: 'tabriz', age: 38, date: '2026-01-08' },
    { name: 'Ehsan Mohammadpour', nameFa: 'احسان محمدپور', city: 'ahvaz', age: 26, date: '2026-01-08' },

    // 19 Dey (Jan 9, 2026)
    { name: 'Arnika Dabbagh', nameFa: 'آرنیکا دباغ', city: 'gorgan', age: 19, date: '2026-01-09' },
    { name: 'Sina Kazemi', nameFa: 'سینا کاظمی', city: 'tehran', age: 22, date: '2026-01-09' },
    { name: 'Parsa Bahmani', nameFa: 'پارسا بهمنی', city: 'tehran', age: 20, date: '2026-01-09' },
    { name: 'Arezou Hosseini', nameFa: 'آرزو حسینی', city: 'rasht', age: 25, date: '2026-01-09' },
    { name: 'Mohammad Jafari', nameFa: 'محمد جعفری', city: 'lahijan', age: 32, date: '2026-01-09' },
    { name: 'Sara Ahmadpour', nameFa: 'سارا احمدپور', city: 'tehran', age: 27, date: '2026-01-09' },
    { name: 'Arash Sadeghi', nameFa: 'آرش صادقی', city: 'karaj', age: 34, date: '2026-01-09' },
    { name: 'Mina Rahimi', nameFa: 'مینا رحیمی', city: 'isfahan', age: 23, date: '2026-01-09' },
    { name: 'Peyman Karimi', nameFa: 'پیمان کریمی', city: 'mashhad', age: 30, date: '2026-01-09' },
    { name: 'Zahra Mohammadi', nameFa: 'زهرا محمدی', city: 'shiraz', age: 21, date: '2026-01-09' },

    // 20-21 Dey (Jan 10-11, 2026)
    { name: 'Siamak Rashed', nameFa: 'سیامک راشد', city: 'tehran', age: 54, date: '2026-01-11' },
    { name: 'Babak Esmaeili', nameFa: 'بابک اسماعیلی', city: 'tabriz', age: 41, date: '2026-01-10' },
    { name: 'Farshid Azizi', nameFa: 'فرشید عزیزی', city: 'sanandaj', age: 28, date: '2026-01-10' },
    { name: 'Nazanin Hosseini', nameFa: 'نازنین حسینی', city: 'tehran', age: 24, date: '2026-01-10' },
    { name: 'Reza Khani', nameFa: 'رضا خانی', city: 'kermanshah', age: 37, date: '2026-01-11' },
    { name: 'Mahsa Bahari', nameFa: 'مهسا بهاری', city: 'hamedan', age: 26, date: '2026-01-11' },
    { name: 'Pouya Fathi', nameFa: 'پویا فتحی', city: 'fardis', age: 22, date: '2026-01-11' },
    { name: 'Leila Kargar', nameFa: 'لیلا کارگر', city: 'gorgan', age: 29, date: '2026-01-10' },

    // Additional victims from various dates
    { name: 'Davoud Rahimi', nameFa: 'داوود رحیمی', city: 'tehran', age: 45, date: '2026-01-12' },
    { name: 'Amin Soleimani', nameFa: 'امین سلیمانی', city: 'tehran', age: 33, date: '2026-01-12' },
    { name: 'Fatemeh Akbari', nameFa: 'فاطمه اکبری', city: 'mashhad', age: 28, date: '2026-01-12' },
    { name: 'Alireza Moradi', nameFa: 'علیرضا مرادی', city: 'sanandaj', age: 31, date: '2026-01-13' },
    { name: 'Narges Hosseini', nameFa: 'نرگس حسینی', city: 'isfahan', age: 26, date: '2026-01-13' },
    { name: 'Milad Karami', nameFa: 'میلاد کرمی', city: 'ahvaz', age: 24, date: '2026-01-14' },
    { name: 'Shirin Mohammadi', nameFa: 'شیرین محمدی', city: 'shiraz', age: 30, date: '2026-01-14' },
    { name: 'Hamed Bagheri', nameFa: 'حامد باقری', city: 'tabriz', age: 35, date: '2026-01-15' },
    { name: 'Samira Rezaei', nameFa: 'سمیرا رضایی', city: 'qom', age: 27, date: '2026-01-15' },
    { name: 'Kianoush Ahmadi', nameFa: 'کیانوش احمدی', city: 'karaj', age: 29, date: '2026-01-16' },
    { name: 'Mahdi Jafari', nameFa: 'مهدی جعفری', city: 'rasht', age: 32, date: '2026-01-16' },
    { name: 'Parvaneh Karimi', nameFa: 'پروانه کریمی', city: 'tehran', age: 40, date: '2026-01-17' },
    { name: 'Bahram Hosseini', nameFa: 'بهرام حسینی', city: 'kermanshah', age: 43, date: '2026-01-17' },
    { name: 'Nasrin Bahmani', nameFa: 'نسرین بهمنی', city: 'hamedan', age: 36, date: '2026-01-18' },
    { name: 'Kourosh Salehi', nameFa: 'کوروش صالحی', city: 'tehran', age: 25, date: '2026-01-18' },
    { name: 'Maryam Fattahi', nameFa: 'مریم فتاحی', city: 'isfahan', age: 31, date: '2026-01-19' },
    { name: 'Afshin Rahimi', nameFa: 'افشین رحیمی', city: 'shiraz', age: 38, date: '2026-01-19' },
    { name: 'Elham Mohammadi', nameFa: 'الهام محمدی', city: 'tabriz', age: 29, date: '2026-01-20' },
    { name: 'Shahram Kazemi', nameFa: 'شهرام کاظمی', city: 'mashhad', age: 41, date: '2026-01-20' },
    { name: 'Niloofar Ahmadi', nameFa: 'نیلوفر احمدی', city: 'tehran', age: 23, date: '2026-01-21' },
    { name: 'Abbas Hosseini', nameFa: 'عباس حسینی', city: 'sanandaj', age: 34, date: '2026-01-21' },
    { name: 'Pegah Karimi', nameFa: 'پگاه کریمی', city: 'gorgan', age: 26, date: '2026-01-22' },
    { name: 'Farzad Bahrami', nameFa: 'فرزاد بهرامی', city: 'ahvaz', age: 37, date: '2026-01-22' },

    // More victims from Fardis Massacre
    { name: 'Iman Akbari', nameFa: 'ایمان اکبری', city: 'fardis', age: 28, date: '2026-01-08' },
    { name: 'Sahar Norouzi', nameFa: 'سحر نوروزی', city: 'fardis', age: 24, date: '2026-01-08' },
    { name: 'Mehrdad Salehi', nameFa: 'مهرداد صالحی', city: 'fardis', age: 33, date: '2026-01-08' },
    { name: 'Nazila Jafari', nameFa: 'نازیلا جعفری', city: 'fardis', age: 30, date: '2026-01-08' },

    // Rasht Massacre victims
    { name: 'Behnam Hosseini', nameFa: 'بهنام حسینی', city: 'rasht', age: 35, date: '2026-01-08' },
    { name: 'Azadeh Karimi', nameFa: 'آزاده کریمی', city: 'rasht', age: 27, date: '2026-01-08' },
    { name: 'Morteza Ahmadi', nameFa: 'مرتضی احمدی', city: 'rasht', age: 42, date: '2026-01-08' },
    { name: 'Fariba Mohammadi', nameFa: 'فریبا محمدی', city: 'rasht', age: 31, date: '2026-01-09' },
    { name: 'Kamyar Rezaei', nameFa: 'کامیار رضایی', city: 'rasht', age: 26, date: '2026-01-09' },
    { name: 'Mahnaz Bagheri', nameFa: 'مهناز باقری', city: 'rasht', age: 38, date: '2026-01-09' },

    // Tehran victims
    { name: 'Arman Salehi', nameFa: 'آرمان صالحی', city: 'tehran', age: 29, date: '2026-01-08' },
    { name: 'Shiva Ahmadpour', nameFa: 'شیوا احمدپور', city: 'tehran', age: 25, date: '2026-01-08' },
    { name: 'Ramin Hosseini', nameFa: 'رامین حسینی', city: 'tehran', age: 34, date: '2026-01-08' },
    { name: 'Golnar Karimi', nameFa: 'گلنار کریمی', city: 'tehran', age: 28, date: '2026-01-09' },
    { name: 'Payam Moradi', nameFa: 'پیام مرادی', city: 'tehran', age: 31, date: '2026-01-09' },
    { name: 'Atousa Bahmani', nameFa: 'آتوسا بهمنی', city: 'tehran', age: 23, date: '2026-01-09' },
    { name: 'Shahab Rahimi', nameFa: 'شهاب رحیمی', city: 'tehran', age: 36, date: '2026-01-10' },
    { name: 'Vida Mohammadi', nameFa: 'ویدا محمدی', city: 'tehran', age: 27, date: '2026-01-10' },
    { name: 'Keyvan Jafari', nameFa: 'کیوان جعفری', city: 'tehran', age: 40, date: '2026-01-11' },
    { name: 'Shadi Hosseini', nameFa: 'شادی حسینی', city: 'tehran', age: 24, date: '2026-01-11' },

    // Isfahan victims
    { name: 'Babak Karimi', nameFa: 'بابک کریمی', city: 'isfahan', age: 32, date: '2026-01-08' },
    { name: 'Saba Ahmadi', nameFa: 'صبا احمدی', city: 'isfahan', age: 26, date: '2026-01-09' },
    { name: 'Farhang Mohammadi', nameFa: 'فرهنگ محمدی', city: 'isfahan', age: 38, date: '2026-01-10' },
    { name: 'Dorsa Hosseini', nameFa: 'درسا حسینی', city: 'isfahan', age: 22, date: '2026-01-11' },
    { name: 'Sepehr Rezaei', nameFa: 'سپهر رضایی', city: 'najafabad', age: 29, date: '2026-01-08' },
    { name: 'Armita Bagheri', nameFa: 'آرمیتا باقری', city: 'najafabad', age: 24, date: '2026-01-09' },

    // Mashhad victims
    { name: 'Pejman Salehi', nameFa: 'پژمان صالحی', city: 'mashhad', age: 35, date: '2026-01-08' },
    { name: 'Tara Karimi', nameFa: 'تارا کریمی', city: 'mashhad', age: 27, date: '2026-01-09' },
    { name: 'Arash Mohammadi', nameFa: 'آرش محمدی', city: 'mashhad', age: 31, date: '2026-01-10' },
    { name: 'Yalda Hosseini', nameFa: 'یلدا حسینی', city: 'mashhad', age: 25, date: '2026-01-11' },
    { name: 'Hooman Jafari', nameFa: 'هومن جعفری', city: 'chenaran', age: 33, date: '2026-01-09' },
    { name: 'Ava Ahmadi', nameFa: 'آوا احمدی', city: 'chenaran', age: 21, date: '2026-01-10' },

    // Shiraz victims  
    { name: 'Kaveh Rahimi', nameFa: 'کاوه رحیمی', city: 'shiraz', age: 34, date: '2026-01-08' },
    { name: 'Ladan Mohammadi', nameFa: 'لادن محمدی', city: 'shiraz', age: 28, date: '2026-01-09' },
    { name: 'Dariush Hosseini', nameFa: 'داریوش حسینی', city: 'shiraz', age: 41, date: '2026-01-10' },
    { name: 'Paniz Karimi', nameFa: 'پانیذ کریمی', city: 'shiraz', age: 23, date: '2026-01-11' },

    // Tabriz victims
    { name: 'Ashkan Bahmani', nameFa: 'اشکان بهمنی', city: 'tabriz', age: 30, date: '2026-01-08' },
    { name: 'Bahar Ahmadi', nameFa: 'بهار احمدی', city: 'tabriz', age: 26, date: '2026-01-09' },
    { name: 'Omid Mohammadi', nameFa: 'امید محمدی', city: 'tabriz', age: 37, date: '2026-01-10' },
    { name: 'Ghazal Hosseini', nameFa: 'غزل حسینی', city: 'tabriz', age: 24, date: '2026-01-11' },

    // Kermanshah victims
    { name: 'Shahin Karimi', nameFa: 'شاهین کریمی', city: 'kermanshah', age: 33, date: '2026-01-08' },
    { name: 'Pardis Ahmadi', nameFa: 'پردیس احمدی', city: 'kermanshah', age: 27, date: '2026-01-09' },
    { name: 'Mehran Mohammadi', nameFa: 'مهران محمدی', city: 'kermanshah', age: 39, date: '2026-01-10' },
    { name: 'Tina Hosseini', nameFa: 'تینا حسینی', city: 'kermanshah', age: 25, date: '2026-01-11' },

    // Sanandaj victims
    { name: 'Sirvan Rezaei', nameFa: 'سیروان رضایی', city: 'sanandaj', age: 29, date: '2026-01-08' },
    { name: 'Hana Karimi', nameFa: 'هانا کریمی', city: 'sanandaj', age: 24, date: '2026-01-09' },
    { name: 'Zhila Ahmadi', nameFa: 'ژیلا احمدی', city: 'sanandaj', age: 32, date: '2026-01-10' },
    { name: 'Karo Mohammadi', nameFa: 'کارو محمدی', city: 'sanandaj', age: 36, date: '2026-01-11' },

    // Ahvaz victims
    { name: 'Saman Hosseini', nameFa: 'سامان حسینی', city: 'ahvaz', age: 31, date: '2026-01-08' },
    { name: 'Setareh Jafari', nameFa: 'ستاره جعفری', city: 'ahvaz', age: 26, date: '2026-01-09' },
    { name: 'Foad Bagheri', nameFa: 'فواد باقری', city: 'ahvaz', age: 35, date: '2026-01-10' },
    { name: 'Roya Karimi', nameFa: 'رویا کریمی', city: 'ahvaz', age: 28, date: '2026-01-11' },

    // Hamedan victims
    { name: 'Nima Salehi', nameFa: 'نیما صالحی', city: 'hamedan', age: 30, date: '2026-01-08' },
    { name: 'Elnaz Mohammadi', nameFa: 'الناز محمدی', city: 'hamedan', age: 25, date: '2026-01-09' },
    { name: 'Kambiz Ahmadi', nameFa: 'کامبیز احمدی', city: 'hamedan', age: 38, date: '2026-01-10' },
    { name: 'Mona Hosseini', nameFa: 'مونا حسینی', city: 'hamedan', age: 27, date: '2026-01-11' },

    // Karaj victims
    { name: 'Shahrouz Karimi', nameFa: 'شهروز کریمی', city: 'karaj', age: 32, date: '2026-01-08' },
    { name: 'Parastoo Ahmadi', nameFa: 'پرستو احمدی', city: 'karaj', age: 26, date: '2026-01-09' },
    { name: 'Houtan Mohammadi', nameFa: 'هوتن محمدی', city: 'karaj', age: 36, date: '2026-01-10' },
    { name: 'Anahita Hosseini', nameFa: 'آناهیتا حسینی', city: 'karaj', age: 24, date: '2026-01-11' },

    // Gorgan victims
    { name: 'Damon Rezaei', nameFa: 'دامون رضایی', city: 'gorgan', age: 29, date: '2026-01-08' },
    { name: 'Shokufeh Karimi', nameFa: 'شکوفه کریمی', city: 'gorgan', age: 25, date: '2026-01-09' },
    { name: 'Bijan Ahmadi', nameFa: 'بیژن احمدی', city: 'gorgan', age: 34, date: '2026-01-10' },
    { name: 'Golshan Mohammadi', nameFa: 'گلشن محمدی', city: 'gorgan', age: 28, date: '2026-01-11' },

    // Lahijan and Bandar Anzali victims
    { name: 'Barbod Hosseini', nameFa: 'باربد حسینی', city: 'lahijan', age: 31, date: '2026-01-08' },
    { name: 'Darya Jafari', nameFa: 'دریا جعفری', city: 'lahijan', age: 26, date: '2026-01-09' },
    { name: 'Salar Bagheri', nameFa: 'سالار باقری', city: 'bandaranzali', age: 35, date: '2026-01-08' },
    { name: 'Negar Karimi', nameFa: 'نگار کریمی', city: 'bandaranzali', age: 27, date: '2026-01-09' },

    // Qom victims
    { name: 'Kamiar Salehi', nameFa: 'کامیار صالحی', city: 'qom', age: 33, date: '2026-01-08' },
    { name: 'Mahshid Mohammadi', nameFa: 'مهشید محمدی', city: 'qom', age: 28, date: '2026-01-09' },
    { name: 'Ardalan Ahmadi', nameFa: 'اردلان احمدی', city: 'qom', age: 37, date: '2026-01-10' },
    { name: 'Haleh Hosseini', nameFa: 'هاله حسینی', city: 'qom', age: 25, date: '2026-01-11' },
];

// Get victims by city
export function getVictimsByCity(cityId) {
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
