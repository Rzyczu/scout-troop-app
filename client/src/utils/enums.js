export const UserRoles = {
    1: 'Drużynowy',
    2: 'Przyboczny',
    3: 'Zastępowy',
    4: 'Harcerz'
};

export const ScoutRanks = {
    0: { full: 'None' },
    1: { short: 'mł.', full: 'Młodzik' },
    2: { short: 'wyw.', full: 'Wywiadowca' },
    3: { short: 'ćw.', full: 'Ćwik' },
    4: { short: 'HO.', full: 'Harcerz Orli' },
    5: { short: 'HR', full: 'Harcerz Rzeczypospolitej' }
};

export const InstructorRanks = {
    0: { full: 'None' },
    1: { short: 'pwd.', full: 'Przewodnik' },
    2: { short: 'phm.', full: 'Podharcmistrz' },
    3: { short: 'hm.', full: 'Harcmistrz' }
};

export const ScoutFunctions = {
    0: 'None',
    1: 'Zastępowy',
    2: 'Podzastępowy',
    3: 'Drużynowy',
    4: 'Przyboczny'
};

const mapEnumValue = (enumData, key, property) => {
    if (enumData[key]?.[property]) {
        return enumData[key][property];
    } else if (enumData[key]) {
        return enumData[key];
    } else {
        return 'Unknown';
    }
};

export const mapEnumFullName = (enumData, key) => mapEnumValue(enumData, key, 'full');
export const mapEnumShortName = (enumData, key) => mapEnumValue(enumData, key, 'short');

