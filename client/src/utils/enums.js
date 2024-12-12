export const ScoutFunctions = {
    0: 'None',
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
    0: { short: '-', full: '-' },
    1: {
        male: { short: 'mł.', full: 'Młodzik' },
        female: { short: 'och.', full: 'Ochotniczka' }
    },
    2: {
        male: { short: 'wyw.', full: 'Wywiadowca' },
        female: { short: 'trop.', full: 'Tropicielka' }
    },
    3: {
        male: { short: 'ćw.', full: 'Ćwik' },
        female: { short: 'sam.', full: 'Samarytanka' }
    },
    4: {
        male: { short: 'HO.', full: 'Harcerz Orli' },
        female: { short: 'wędr.', full: 'Wędrowniczka' }
    },
    5: {
        male: { short: 'HR', full: 'Harcerz Rzeczypospolitej' },
        female: { short: 'HR', full: 'Harcerka Rzeczypospolitej' }
    },
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
