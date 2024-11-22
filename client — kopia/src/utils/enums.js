export const ScoutRanks = {
    1: { short: 'mł.', full: 'Młodzik' },
    2: { short: 'wyw.', full: 'Wywiadowca' },
    3: { short: 'ćw.', full: 'Ćwik' },
    4: { short: 'HO.', full: 'Harcerz Orli' },
    5: { short: 'HR', full: 'Harcerz Rzeczypospolitej' }
};

export const InstructorRanks = {
    1: { short: 'pwd.', full: 'Przewodnik' },
    2: { short: 'phm.', full: 'Podharcmistrz' },
    3: { short: 'hm.', full: 'Harcmistrz' }
};

export const ScoutFunctions = {
    0: 'None',
    1: 'Podzastępowy',
    2: 'Zastępowy',
    3: 'Przyboczny',
    4: 'Drużynowy',
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