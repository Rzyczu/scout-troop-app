const Genders = {
    0: 'Male',
    1: 'Female',
};

const ScoutFunctions = {
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

const ScoutRanks = {
    null: { short: '-', full: 'None' },
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

const InstructorRanks = {
    null: { short: '-', full: 'None' },
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



// Mapowanie wartości z bazy na pełne nazwy
const mapEnum = (enumType, value, gender = null) => {
    const entry = enumType[value];

    if (!entry) return 'Unknown';

    if (gender && typeof entry === 'object' && entry[gender]) {
        return entry[gender].full || entry[gender];
    }

    return entry.full || entry || 'Unknown';
};


module.exports = { ScoutFunctions, ScoutRanks, InstructorRanks, mapEnum };
