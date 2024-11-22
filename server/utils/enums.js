const ScoutFunctions = {
    0: 'None',
    1: 'Podzastępowy',
    2: 'Zastępowy',
    3: 'Przyboczny',
    4: 'Drużynowy',
};

const ScoutRanks = {
    0: { short: 'mł.', full: 'Młodzik' },
    1: { short: 'wyw.', full: 'Wywiadowca' },
    2: { short: 'ćw.', full: 'Ćwik' },
    3: { short: 'HO.', full: 'Harcerz Orli' },
    4: { short: 'HR', full: 'Harcerz Rzeczypospolitej' }
};

const InstructorRanks = {
    0: { short: 'pwd.', full: 'Przewodnik' },
    1: { short: 'phm.', full: 'Podharcmistrz' },
    2: { short: 'hm.', full: 'Harcmistrz' }
};

// Mapowanie wartości z bazy na pełne nazwy
const mapEnum = (enumType, value) =>
    enumType[value]?.full || enumType[value] || 'Unknown';

module.exports = { ScoutFunctions, ScoutRanks, InstructorRanks, mapEnum };
