export const ScoutFunctions = {
    0: '-',
    1: {
        male: 'Podzastępowy',
        female: 'Podzastępowa'
    },
    2: {
        male: 'Zastępowy',
        female: 'Zastępowa'
    },
    3: {
        male: 'Przyboczny',
        female: 'Przyboczna'
    },
    4: {
        male: 'Drużynowy',
        female: 'Drużynowa'
    },
};

export const ScoutRanks = {
    0: { short: '-', full: '-', ageRange: { min: 0, max: 0 } },
    1: {
        male: { short: 'mł.', full: 'Młodzik', ageRange: { min: 11, max: 13 } },
        female: { short: 'och.', full: 'Ochotniczka', ageRange: { min: 11, max: 13 } }
    },
    2: {
        male: { short: 'wyw.', full: 'Wywiadowca', ageRange: { min: 12, max: 14 } },
        female: { short: 'trop.', full: 'Tropicielka', ageRange: { min: 13, max: 15 } }
    },
    3: {
        male: { short: 'ćw.', full: 'Ćwik', ageRange: { min: 13, max: 16 } },
        female: { short: 'sam.', full: 'Samarytanka', ageRange: { min: 14, max: 17 } }
    },
    4: {
        male: { short: 'HO.', full: 'Harcerz Orli', ageRange: { min: 15, max: 18 } },
        female: { short: 'wędr.', full: 'Wędrowniczka', ageRange: { min: 16, max: 20 } }
    },
    5: {
        male: { short: 'HR', full: 'Harcerz Rzeczypospolitej', ageRange: { min: 18, max: 99 } },
        female: { short: 'HR', full: 'Harcerka Rzeczypospolitej', ageRange: { min: 18, max: 99 } }
    }
};


export const InstructorRanks = {
    0: { short: '-', full: '-' },
    1: {
        male: { short: 'pwd.', full: 'Przewodnik' },
        female: { short: 'pwd.', full: 'Przewodniczka' }
    },
    2: {
        male: { short: 'phm.', full: 'Podharcmistrz' },
        female: { short: 'phm.', full: 'Podharcmistrzyni' }
    },
    3: {
        male: { short: 'hm.', full: 'Harcmistrz' },
        female: { short: 'hm.', full: 'Harcmistrzyni' }
    },
};

const mapEnumValue = (enumData, key, property, gender = null) => {
    const entry = enumData[key] || enumData[0];
    const genderKey = gender === 0 ? 'male' : gender === 1 ? 'female' : null;

    if (genderKey && typeof entry === 'object' && entry[genderKey]) {
        return entry[genderKey][property] || entry[genderKey];
    }

    return entry[property] || entry || 'Unknown';
};

// Funkcje eksportujące z uwzględnieniem płci
export const mapEnumFullName = (enumData, key, gender = null) => mapEnumValue(enumData, key, 'full', gender);
export const mapEnumShortName = (enumData, key, gender = null) => mapEnumValue(enumData, key, 'short', gender);
