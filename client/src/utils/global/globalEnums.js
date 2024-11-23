import { ScoutRanks, InstructorRanks, ScoutFunctions, mapEnumFullName, mapEnumShortName } from '../enums';

// Dodanie do globalnego okna (jeśli wymagane)
window.ScoutRanks = ScoutRanks;
window.InstructorRanks = InstructorRanks;
window.ScoutFunctions = ScoutFunctions;
window.mapEnumFullName = mapEnumFullName;
window.mapEnumShortName = mapEnumShortName;

export default () => {
    console.log('Enums initialized globally');
};
