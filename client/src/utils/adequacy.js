import { ScoutRanks } from './enums';

export const checkRankAdequacy = (achievedRank, openRank, dateOfBirth, gender) => {
    if (!achievedRank || !dateOfBirth) return 'red';

    const age = calculateAge(dateOfBirth);
    const achievedAdequacy = isRankAdequate(achievedRank, age, gender);
    const openAdequacy = isRankAdequate(openRank, age, gender);

    if (achievedAdequacy) {
        return 'green';
    } else if (openAdequacy) {
        return 'light-green';
    } else {
        return 'red';
    }
};

const isRankAdequate = (rank, age, gender) => {
    const rankDetails = ScoutRanks[rank]?.[gender === 0 ? 'male' : 'female'];
    if (!rankDetails) return false;

    const { min, max } = rankDetails.ageRange || { min: 0, max: 0 };
    return age >= min && age <= max;
};


const calculateAge = (birthdate) => {
    const birthDate = new Date(birthdate);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();
    if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
};
