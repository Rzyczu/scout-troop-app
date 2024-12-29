import { ScoutFunctions, ScoutRanks, InstructorRanks, mapEnumFullName } from './../../../utils/enums';

const headersConfig = {
    basic: [
        { label: 'ID', sortable: false, exportable: true },
        { label: 'Name', sortable: true, exportable: true, key: 'name' },
        { label: 'Surname', sortable: true, exportable: true, key: 'surname' },
        { label: 'Date of Birth', sortable: true, exportable: true, key: 'date_birth', formatter: (value) => new Date(value).toLocaleDateString() },
        { label: 'Actions', sortable: false, exportable: false },
    ],
    contact: [
        { label: 'ID', sortable: false, exportable: true },
        { label: 'Name', sortable: true, exportable: true, key: 'name' },
        { label: 'Surname', sortable: true, exportable: true, key: 'surname' },
        { label: 'Phone Number', sortable: true, exportable: true, key: 'phone_number' },
        { label: "Mother's Phone", sortable: true, exportable: true, key: 'mother_phone_number' },
        { label: "Father's Phone", sortable: true, exportable: true, key: 'father_phone_number' },
        { label: 'Actions', sortable: false, exportable: false },
    ],
    scout: [
        { label: 'ID', sortable: false, exportable: true },
        { label: 'Name', sortable: true, exportable: true, key: 'name' },
        { label: 'Surname', sortable: true, exportable: true, key: 'surname' },
        { label: 'Troop', sortable: true, exportable: true, key: 'troop_name' },
        { label: 'Function', sortable: true, exportable: true, key: 'function', formatter: (value, gender) => mapEnumFullName(ScoutFunctions, value, gender), },
        { label: 'Achieved Rank', sortable: true, exportable: true, key: 'achieved_rank', formatter: (value, gender) => mapEnumFullName(ScoutRanks, value, gender), },
        { label: 'Open Rank', sortable: true, exportable: true, key: 'open_rank', formatter: (value, gender) => mapEnumFullName(ScoutRanks, value, gender), },
        { label: 'Instructor Rank', sortable: true, exportable: true, key: 'instructor_rank', formatter: (value, gender) => mapEnumFullName(InstructorRanks, value, gender), },
        { label: 'Actions', sortable: false, exportable: false },
    ],
};

export default headersConfig;
