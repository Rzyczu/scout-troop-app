// enums.js
const UserRoles = {
    1: 'Drużynowy',
    2: 'Przyboczny',
    3: 'Zastępowy'
};

const ScoutFunctions = {
    0: 'None',
    1: 'Zastępowy',
    2: 'Podzastępowy',
    3: 'Drużynowy',
    4: 'Przyboczny'
};

const ScoutRanks = {
    0: { full: 'None' },
    1: { short: 'mł.', full: 'Młodzik' },
    2: { short: 'wyw.', full: 'Wywiadowca' },
    3: { short: 'ćw.', full: 'Ćwik' },
    4: { short: 'HO.', full: 'Harcerz Orli' },
    5: { short: 'HR', full: 'Harcerz Rzeczypospolitej' }
};

const InstructorRanks = {
    0: { full: 'None' },
    1: { short: 'pwd.', full: 'Przewodnik' },
    2: { short: 'phm.', full: 'Podharcmistrz' },
    3: { short: 'hm.', full: 'Harcmistrz' }
};

// Mapowanie wartości z bazy na pełne nazwy
const mapEnum = (enumType, value) =>
    enumType[value]?.full || enumType[value] || 'Unknown';

module.exports = { UserRoles, ScoutFunctions, ScoutRanks, InstructorRanks, mapEnum };
