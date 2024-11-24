const ScoutFunctions = {
    0: 'None',
    1: 'Podzastępowy',
    2: 'Zastępowy',
    3: 'Przyboczny',
    4: 'Drużynowy',
};

const ScoutRanks = {
    null: { short: '-', full: 'None' },
    1: { short: 'mł.', full: 'Młodzik' },
    2: { short: 'wyw.', full: 'Wywiadowca' },
    3: { short: 'ćw.', full: 'Ćwik' },
    4: { short: 'HO.', full: 'Harcerz Orli' },
    5: { short: 'HR', full: 'Harcerz Rzeczypospolitej' }
};

const InstructorRanks = {
    null: { short: '-', full: 'None' },
    1: { short: 'pwd.', full: 'Przewodnik' },
    2: { short: 'phm.', full: 'Podharcmistrz' },
    3: { short: 'hm.', full: 'Harcmistrz' }
};


// Mapowanie wartości z bazy na pełne nazwy
const mapEnum = (enumType, value) =>
    enumType[value]?.full || enumType[value] || 'Unknown';

module.exports = { ScoutFunctions, ScoutRanks, InstructorRanks, mapEnum };
